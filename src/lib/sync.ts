import { create } from 'zustand'
import { loadFirebase } from './firebase'
import { mergeProfileLists, mergeProfiles } from './merge'
import { LEARNER_VERSION, normalizeProfile, useLearner, type Profile } from '@/store/learner'
import { applySyncedSettings, syncedSettings, useSettings } from '@/store/settings'
import { toast, toastUpsert } from '@/store/toasts'

/**
 * Sync across devices, through the learner's Google account.
 *
 * The shape is deliberately simple: one document per account holding every
 * profile. Both directions go through `mergeProfileLists`, never a straight
 * overwrite, because the interesting case is not "which copy is newer" but "a
 * lesson happened on the phone that this laptop has never seen".
 *
 * The loop that has to be avoided: a local edit is pushed, the push comes back
 * as a snapshot, the snapshot is applied, which counts as a local edit. Two
 * guards stop it — Firestore flags its own un-acknowledged writes
 * (`hasPendingWrites`), and an applied merge is compared against what is
 * already in the store and dropped when nothing actually changed.
 */

export type SyncStatus = 'off' | 'connecting' | 'syncing' | 'synced' | 'error'

type SyncState = {
  status: SyncStatus
  email: string | null
  lastSyncedAt: number | null
  error: string | null
  /**
   * True while the account's data is on its way in.
   *
   * Nothing is kept in this browser any more, so a reload starts with no
   * profile at all. Without this the router would see "no profile" and bounce
   * a signed-in learner to onboarding every single time, a fraction of a
   * second before their course arrived.
   */
  restoring: boolean
}

export const useSync = create<SyncState>(() => ({
  status: 'off',
  email: null,
  lastSyncedAt: null,
  error: null,
  // Always true until Firebase Auth says one way or the other. The app keeps
  // no note of whether this browser has signed in before — that would be state
  // of its own, and the answer belongs to the session, not to a flag.
  restoring: true,
}))

/**
 * How long to wait before writing.
 *
 * It was 2500, chosen to fold a lesson's XP ticks into one write — and that is
 * most of why the confirmation felt slow, because the toast waits for the
 * write and the write waited for this. Two and a half seconds after a click is
 * long enough to wonder whether anything happened at all.
 *
 * 600 still coalesces a burst — several updates from finishing one exercise
 * land together — while leaving the confirmation close enough to the action to
 * read as caused by it. The cost is more writes: a lesson of seven exercises
 * becomes roughly seven instead of two or three, against a free-tier allowance
 * of twenty thousand a day. It was never the writes that needed protecting.
 */
const PUSH_DEBOUNCE_MS = 600

let stopSnapshot: (() => void) | null = null
let stopStore: (() => void) | null = null
let stopSettings: (() => void) | null = null
let pushTimer: ReturnType<typeof setTimeout> | null = null

/** Stop listening in both directions. Safe to call when nothing is attached. */
function detach(): void {
  stopSnapshot?.()
  stopStore?.()
  stopSettings?.()
  stopSnapshot = stopStore = stopSettings = null
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = null
}

/**
 * What is waiting to go up, so the toast can say which it was.
 *
 * Both stores feed the same write, and reporting a changed voice as "прогрес
 * збережено" describes something the learner did not do.
 */
/**
 * Did anything about the profiles actually change?
 *
 * Only to decide whether there is a save worth reporting — switching which
 * profile is active writes nothing new and should say nothing. The reference
 * check is free and right for an immutable update; the value check catches a
 * profile rebuilt wholesale by a merge or an import, where every nested object
 * is new with nothing actually edited.
 */
export function profilesChanged(before: Profile[], after: Profile[]): boolean {
  if (before === after) return false
  if (before.length !== after.length) return true

  const byId = new Map(before.map((p) => [p.id, p]))
  return after.some((next) => {
    const prev = byId.get(next.id)
    if (!prev) return true
    return (Object.keys(next) as (keyof Profile)[]).some(
      (key) => prev[key] !== next[key] && JSON.stringify(prev[key]) !== JSON.stringify(next[key]),
    )
  })
}
let applying = false

/**
 * Everything the account says was removed, plus anything removed here since.
 *
 * The deletions come from the store, where deleteProfile records them, and not
 * from noticing that a profile has gone missing from the list. Those two look
 * identical and mean opposite things: one is the learner removing a name, the
 * other is this browser not having finished loading. Guessing between them is
 * how a store that had not filled in yet was read as an instruction to delete.
 *
 * They travel in the document too, so the device that did the deleting is not
 * the only one that knows about it.
 */
function removedIds(data: Record<string, unknown> | undefined): Set<string> {
  const stored = Array.isArray(data?.removedProfileIds) ? (data.removedProfileIds as unknown[]) : []
  return new Set([
    ...stored.filter((x): x is string => typeof x === 'string'),
    ...useLearner.getState().removedIds,
  ])
}

/**
 * How long to wait for the account before saying there is no connection.
 *
 * Firestore does not report being offline as an error: the listener simply
 * never fires from the server. Without this, a learner with no connection sits
 * on "Завантажую твій акаунт…" for as long as they are willing to.
 */
const OFFLINE_AFTER_MS = 12_000

function profilesOf(): Profile[] {
  return useLearner.getState().profiles
}

function sameProfiles(a: Profile[], b: Profile[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

async function userDoc() {
  const fb = await loadFirebase()
  const uid = fb.authInstance.currentUser?.uid
  if (!uid) return null
  return { fb, ref: fb.firestore.doc(fb.db, 'users', uid) }
}

/**
 * Remove every `undefined` before the data reaches Firestore.
 *
 * Firestore rejects the whole write if any field is undefined — not that
 * field, the entire document — with "Unsupported field value: undefined". And
 * a profile is full of fields that are legitimately absent: `lastStudyDay`
 * before the first lesson, `lastReviewed` on a card never reviewed, `explain`
 * on a mistake that carried no explanation, `note` on a word without one.
 *
 * Absent and undefined are the same thing in TypeScript and different things
 * to Firestore, which is why this is needed at the boundary rather than
 * anywhere upstream. Null is kept: it is a value the learner may have chosen,
 * such as clearing the selected voice.
 */
export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) return value.map(stripUndefined) as T
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      if (v === undefined) continue
      out[k] = stripUndefined(v)
    }
    return out as T
  }
  return value
}

/**
 * Send this browser's state to the account, without ever subtracting from it.
 *
 * The write is a whole-document replace — one document holds every profile —
 * and for a long time it replaced the account with whatever this browser
 * happened to hold at that instant. That is safe only while the local store is
 * guaranteed to be a superset of the account's, and nothing guaranteed it.
 * Nothing is kept in this browser any more, so every load starts empty and
 * fills in from a snapshot that arrives whenever the network gets round to it;
 * any write that slipped in before it — a profile made at setup, a setting
 * changed on the way past — replaced a year of work with a few seconds of it.
 *
 * So the write reads first, inside a transaction, and sends the merge of the
 * two. Local wins the single values, because a name typed a second ago is
 * newer than the one on the server; the account contributes everything this
 * browser has not seen. A truncated local store is then simply a store with
 * less in it, which the merge fills back in, instead of an instruction to
 * delete. There is no ordering left for a race to get wrong.
 *
 * The transaction needs the network, where the old blind write could be queued
 * offline. That is the right trade for this app: it requires a connection to
 * show anything at all, and a queued write that erases the account on
 * reconnect is not a feature worth keeping.
 */
async function push() {
  const target = await userDoc()
  if (!target) return
  const { fb, ref } = target

  // Nothing to say. Not a wipe any more — the merge would put the account's
  // profiles straight back — but a write with nothing to add is still a write.
  if (!profilesOf().length) return

  try {
    useSync.setState({ status: 'syncing' })
    await fb.firestore.runTransaction(fb.db, async (tx) => {
      const data = (await tx.get(ref)).data() as Record<string, unknown> | undefined
      const removed = removedIds(data)
      const remote = Array.isArray(data?.profiles)
        ? (data.profiles as unknown[])
            .map(normalizeProfile)
            .filter((p): p is Profile => p !== null)
        : []

      // Remote first so local wins the single-value fields: mergeProfiles takes
      // name, emoji and course from its second argument.
      const profiles = mergeProfileLists(remote, profilesOf()).filter((p) => !removed.has(p.id))

      // Only reachable if every profile in hand has been deleted elsewhere.
      // Leave the account as it is rather than emptying it.
      if (!profiles.length) return

      tx.set(ref, {
        profiles: stripUndefined(profiles),
        // Theme, speed, daily goal and the rest: decisions about how this person
        // wants to study, so they travel with the account. The chosen voice does
        // not — see syncedSettings.
        settings: stripUndefined(syncedSettings()),
        removedProfileIds: [...removed],
        version: LEARNER_VERSION,
        updatedAt: fb.firestore.serverTimestamp(),
      })
    })
    useSync.setState({ status: 'synced', lastSyncedAt: Date.now(), error: null })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Не вдалося синхронізувати'
    useSync.setState({ status: 'error', error: message })
    // The same card that said "Збережено" a moment ago, corrected in place.
    toastUpsert('save', {
      title: 'Не збережено',
      description: message,
      tone: 'error',
      action: { label: 'Спробувати ще раз', run: () => void push() },
    })
  }
}

function schedulePush() {
  if (applying) return
  // Said at the moment of the change rather than when the write lands, so it
  // answers the action instead of trailing a second behind it. Optimistic, and
  // deliberately so: if the write fails, this same card becomes "Не збережено"
  // with the reason, which is a correction within about a second and better
  // than a second of silence on every save.
  toastUpsert('save', { title: 'Збережено', tone: 'ok' })
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => void push(), PUSH_DEBOUNCE_MS)
}

/** Preferences are last-write-wins: there is nothing to merge about a theme. */
function applySettingsFromRemote(incoming: unknown) {
  applying = true
  try {
    applySyncedSettings(incoming)
  } finally {
    applying = false
  }
}

/** Fold whatever the server has into the local store, keeping both sides' work. */
function applyRemote(remote: unknown, removed: Set<string>) {
  const incoming = Array.isArray(remote)
    ? remote
        .map(normalizeProfile)
        .filter((p): p is Profile => p !== null && !removed.has(p.id))
    : []
  if (!incoming.length) return

  const local = profilesOf()
  const merged = mergeProfileLists(local, incoming)
  if (sameProfiles(local, merged)) return

  applying = true
  try {
    useLearner.setState((s) => ({
      profiles: merged,
      activeId: merged.some((p) => p.id === s.activeId) ? s.activeId : (merged[0]?.id ?? null),
    }))
  } finally {
    applying = false
  }
}

/**
 * Read first, then write. Never the other way round.
 *
 * This used to push the local store the moment it connected, before the first
 * snapshot had said what the account held. On a browser that keeps nothing —
 * which is now every browser — the local store at that moment is empty, so the
 * first act of signing in was to overwrite the account with nothing. The
 * learner was then sent to setup, made a fresh profile, and ended up with one
 * per browser, all under the same email.
 *
 * So writing is only armed once the account has answered: the store
 * subscriptions and the first push both wait for that snapshot.
 */
async function startSyncing() {
  const target = await userDoc()
  if (!target) return
  const { fb, ref } = target

  let accountHasAnswered = false

  const giveUp = setTimeout(() => {
    if (accountHasAnswered) return
    useSync.setState({ status: 'error', error: 'Немає зв’язку з акаунтом', restoring: false })
  }, OFFLINE_AFTER_MS)

  stopSnapshot?.()
  const unsubscribe = fb.firestore.onSnapshot(
    ref,
    // Metadata changes included so the cache-then-server pair both arrive. The
    // second one carries no new data, and is the only one that counts.
    { includeMetadataChanges: true },
    (snap) => {
      // Our own write echoing back. Applying it would be harmless but would
      // restart the push cycle for nothing.
      if (snap.metadata.hasPendingWrites) return

      const data = snap.data() as Record<string, unknown> | undefined
      applyRemote(data?.profiles, removedIds(data))
      applySettingsFromRemote(data?.settings)

      // A cached answer is not the account answering. Offline — or in the
      // moments before the first response arrives — Firestore raises the empty
      // document it has locally, which says nothing about what the account
      // holds. Treating that as the answer is what declared a returning learner
      // profile-less, sent them to setup, and armed the writes in time for the
      // new profile to be sent. Wait for the server.
      if (snap.metadata.fromCache) return

      clearTimeout(giveUp)
      useSync.setState({
        status: 'synced',
        lastSyncedAt: Date.now(),
        error: null,
        restoring: false,
      })

      if (accountHasAnswered) return
      accountHasAnswered = true

      // Now — and not before — it is safe to send anything back.
      stopStore?.()
      stopStore = useLearner.subscribe((next, prev) => {
        // A deletion changes the list too, so it is covered here; what it also
        // does is leave a tombstone behind, which is what stops the merge in
        // push() handing the profile back. Switching which profile is active
        // writes nothing new.
        if (profilesChanged(prev.profiles, next.profiles)) schedulePush()
      })
      stopSettings?.()
      stopSettings = useSettings.subscribe(() => schedulePush())

      // One push on connect, so work done offline reaches the account even if
      // nothing changes afterwards.
      void push()
    },
    (e) => {
      clearTimeout(giveUp)
      useSync.setState({ status: 'error', error: e.message, restoring: false })
    },
  )
  stopSnapshot = () => {
    clearTimeout(giveUp)
    unsubscribe()
  }
}

/**
 * Where a learner belongs once they have signed in, and which profiles they own.
 *
 * Signing in must never invent a learner. Additional names are something the
 * learner adds deliberately from the profile menu, so the account is the
 * authority the moment it holds anything: its profiles are taken as the list,
 * and one already in this browser is folded into the matching entry.
 *
 * A profile that exists only in this browser is pre-sign-in work by the same
 * person, not a second learner. Appending it is what grew a new "user" on every
 * sign-in — each device minting its own id, then the union treating the ids as
 * different people. It is merged into the account's first profile instead, so
 * the work survives without a duplicate appearing.
 *
 * Setup runs only when there is no profile anywhere. Reaching it with one
 * already in hand was the other half of the same bug: the name step ends in
 * createProfile, which duly made another.
 */
export function routeAfterSignIn(
  local: Profile[],
  remote: Profile[],
): { profiles: Profile[]; go: 'app' | 'setup' } {
  if (!remote.length) return { profiles: local, go: local.length ? 'app' : 'setup' }

  const byId = new Map(remote.map((r) => [r.id, r]))
  const localOnly: Profile[] = []
  for (const mine of local) {
    const match = byId.get(mine.id)
    if (match) byId.set(mine.id, mergeProfiles(match, mine))
    else localOnly.push(mine)
  }

  const profiles = [...byId.values()]
  if (localOnly.length) {
    // Same person, so keep the account's identity and take only the progress.
    profiles[0] = localOnly.reduce(
      (acc, orphan) => mergeProfiles(acc, { ...orphan, id: acc.id, name: acc.name }),
      profiles[0],
    )
  }

  return { profiles, go: 'app' }
}

/**
 * Read the account's profiles once, right after signing in.
 *
 * This is what makes a second device work the way anyone would expect: sign in
 * on a phone and the course is simply there, rather than asking again for a
 * name and a level that were settled on the laptop weeks ago.
 *
 * Throws rather than returning nothing when the account cannot be read. An
 * empty list means the account really is empty, and callers act on that by
 * creating a profile — so a failure must never be able to impersonate one.
 */
export async function fetchRemoteProfiles(): Promise<Profile[]> {
  const target = await userDoc()
  if (!target) throw new Error('Не вдалося прочитати акаунт: немає входу')

  // From the server, not the cache. A browser opening this app for the first
  // time has an empty cache, and letting that answer the question turns "I
  // cannot see your account yet" into "your account is empty" — which sends
  // the learner to setup, which ends in createProfile, which is how a new name
  // appeared in every new browser.
  const snap = await target.fb.firestore.getDocFromServer(target.ref)
  const raw = snap.data()?.profiles
  if (!Array.isArray(raw)) return []
  return raw.map(normalizeProfile).filter((p): p is Profile => p !== null)
}

/**
 * Resolves true only when there is a signed-in user at the end of it.
 *
 * A popup has to be opened inside the click that asked for it. Awaiting the
 * Firebase SDK first — it is lazy-loaded, so the first sign-in waits on a
 * 200 KB download — spent the gesture before `signInWithPopup` ever reached
 * `window.open`, and the browser blocked it as an unsolicited popup. Hence
 * `warmFirebase()` on the screens that show a sign-in button: by click time
 * the module is already resolved and the popup opens inside the gesture.
 *
 * A redirect is the fallback rather than the default, because Firebase's
 * redirect flow is unreliable on browsers that partition third-party storage —
 * Safari and everything on iOS. Popup first, redirect only when the popup was
 * refused, so each covers the other's weakness.
 */
export async function signIn(): Promise<boolean> {
  useSync.setState({ status: 'connecting', error: null })
  try {
    const fb = await loadFirebase()
    const provider = new fb.auth.GoogleAuthProvider()
    try {
      const credential = await fb.auth.signInWithPopup(fb.authInstance, provider)
      toast({
        title: 'Вхід виконано',
        description: credential.user.email ?? undefined,
        tone: 'ok',
      })
    } catch (inner) {
      const code = inner instanceof Error ? inner.message : String(inner)
      if (code.includes('popup-blocked') || code.includes('operation-not-supported')) {
        // Navigates away. On the way back getRedirectResult picks it up during
        // initSync — no note left behind to say one is in flight, because
        // Firebase can be asked directly.
        await fb.auth.signInWithRedirect(fb.authInstance, provider)
        return false
      }
      throw inner
    }
    return true
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Не вдалося увійти'
    // Closing the popup is a choice, not a failure to report.
    if (message.includes('popup-closed-by-user') || message.includes('cancelled-popup-request')) {
      useSync.setState({ status: 'off', error: null })
      return false
    }
    useSync.setState({ status: 'error', error: message })
    return false
  }
}

/**
 * Delete the account's data, then the account itself.
 *
 * An app that holds a person's data on a server owes them a way to take it
 * back. The document goes first: if the sign-out or the account deletion fails
 * afterwards, the learner is merely still signed in, whereas the reverse order
 * can leave data behind that nobody can reach or remove any more.
 */
export async function deleteAccount(): Promise<void> {
  const target = await userDoc()
  if (!target) throw new Error('Немає входу')
  const { fb, ref } = target

  // Stop the subscriptions first, or the delete comes back as a snapshot and
  // the store tries to sync its way out of it.
  detach()

  await fb.firestore.deleteDoc(ref)

  const user = fb.authInstance.currentUser
  if (user) {
    try {
      await user.delete()
    } catch {
      // Firebase refuses this when the sign-in is old — the data is already
      // gone, so signing out is an honest end to it either way. No toast:
      // the caller reports the account removal, and "прогрес лишився в
      // акаунті" would be plainly false right after erasing it.
      await fb.auth.signOut(fb.authInstance)
    }
  }

  useLearner.setState({ profiles: [], activeId: null, removedIds: [] })
  useSync.setState({
    status: 'off',
    email: null,
    lastSyncedAt: null,
    error: null,
    restoring: false,
  })
  toast({ title: 'Акаунт видалено', description: 'Усі дані стерто', tone: 'info' })
}

export async function signOut(): Promise<void> {
  const fb = await loadFirebase()
  // One last push, so work from this session is not stranded on this device.
  if (fb.authInstance.currentUser) await push()
  detach()
  await fb.auth.signOut(fb.authInstance)
  // Kept, unlike the other descriptions: with nothing stored in this browser,
  // "where did my progress go" is a real question at exactly this moment.
  toast({ title: 'Ви вийшли', description: 'Прогрес лишився в акаунті', tone: 'info' })
  useSync.setState({
    status: 'off',
    email: null,
    lastSyncedAt: null,
    error: null,
    restoring: false,
  })
  // The store is memory-only now, so signing out clears the data with it.
  useLearner.setState({ profiles: [], activeId: null, removedIds: [] })
}

/*
 * There is no browser storage in this file, and none anywhere else in the app.
 *
 * There was one thing left: a read of the key the pre-account version wrote,
 * which pulled that progress into memory and then deleted the key. It was a
 * migration for a state that no longer exists — every account has synced many
 * times since — and keeping it meant the app still touched localStorage, which
 * is not what was asked for. The learner's data is in the account and nowhere
 * else.
 *
 * The one thing this browser does hold is Firebase Auth's own session token,
 * in its own IndexedDB store. That is not the learner's data — it is what
 * makes a reload not a re-login — and it is Firebase's to manage.
 */

/** Start fetching the SDK now, so a later click can open a popup immediately. */
export function warmFirebase(): void {
  void loadFirebase()
}

/**
 * Ask Firebase who is signed in, and follow that for the life of the app.
 *
 * There is no local flag to consult first: the session is Firebase Auth's to
 * know, and a note of our own would only be a second copy to go stale. Any
 * sign-in that went the redirect route is collected here too — again by
 * asking, rather than by having left a marker behind before navigating away.
 */
export async function initSync(): Promise<void> {
  const fb = await loadFirebase()

  try {
    await fb.auth.getRedirectResult(fb.authInstance)
  } catch (e) {
    useSync.setState({
      status: 'error',
      error: e instanceof Error ? e.message : 'Не вдалося завершити вхід',
    })
  }

  fb.auth.onAuthStateChanged(fb.authInstance, (user) => {
    if (!user) {
      // Before the store is cleared, not after. These subscriptions are what
      // turn a change into a write, and clearing the store is a change: leaving
      // them attached through a sign-out — or through a session expiring on its
      // own, which does not go through signOut() at all — left them armed and
      // pointed at an empty store.
      detach()
      useSync.setState({ status: 'off', email: null, restoring: false })
      useLearner.setState({ profiles: [], activeId: null, removedIds: [] })
      return
    }
    useSync.setState({ status: 'syncing', email: user.email })
    void startSyncing()
  })
}

/** Called by the sign-in button once auth resolves, without waiting for a reload. */
export async function attachAfterSignIn(): Promise<void> {
  const fb = await loadFirebase()
  const user = fb.authInstance.currentUser
  if (!user) return
  useSync.setState({ status: 'syncing', email: user.email })
  await startSyncing()
}
