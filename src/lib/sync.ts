import { create } from 'zustand'
import { loadFirebase, rememberSignedIn, wasSignedIn } from './firebase'
import { mergeProfileLists, mergeProfiles } from './merge'
import { LEARNER_VERSION, normalizeProfile, useLearner, type Profile } from '@/store/learner'

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
  // Set straight away for a browser that has signed in before, so the very
  // first render already knows to wait rather than redirect.
  restoring: wasSignedIn(),
}))

/** Long enough that a lesson's XP ticks become one write, short enough to feel live. */
const PUSH_DEBOUNCE_MS = 2500

let stopSnapshot: (() => void) | null = null
let stopStore: (() => void) | null = null
let pushTimer: ReturnType<typeof setTimeout> | null = null
let applying = false

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

async function push() {
  const target = await userDoc()
  if (!target) return
  const { fb, ref } = target
  try {
    useSync.setState({ status: 'syncing' })
    await fb.firestore.setDoc(ref, {
      profiles: profilesOf(),
      version: LEARNER_VERSION,
      updatedAt: fb.firestore.serverTimestamp(),
    })
    useSync.setState({ status: 'synced', lastSyncedAt: Date.now(), error: null })
    // Now it is in the account, the browser copy can go.
    dropLegacyLocalData()
  } catch (e) {
    useSync.setState({
      status: 'error',
      error: e instanceof Error ? e.message : 'Не вдалося синхронізувати',
    })
  }
}

function schedulePush() {
  if (applying) return
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => void push(), PUSH_DEBOUNCE_MS)
}

/** Fold whatever the server has into the local store, keeping both sides' work. */
function applyRemote(remote: unknown) {
  const incoming = Array.isArray(remote)
    ? remote.map(normalizeProfile).filter((p): p is Profile => p !== null)
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

async function startSyncing() {
  const target = await userDoc()
  if (!target) return
  const { fb, ref } = target

  stopSnapshot?.()
  stopSnapshot = fb.firestore.onSnapshot(
    ref,
    (snap) => {
      // Our own write echoing back. Applying it would be harmless but would
      // restart the push cycle for nothing.
      if (snap.metadata.hasPendingWrites) return
      applyRemote(snap.data()?.profiles)
      // Whatever the account holds has now arrived, including nothing at all.
      useSync.setState({
        status: 'synced',
        lastSyncedAt: Date.now(),
        error: null,
        restoring: false,
      })
    },
    (e) => useSync.setState({ status: 'error', error: e.message, restoring: false }),
  )

  stopStore?.()
  stopStore = useLearner.subscribe(schedulePush)

  // Push once on connect so a device that studied offline hands over its work
  // even if nothing changes afterwards.
  await push()
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

const REDIRECT_FLAG = 'passerelle:sync-redirect'

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
      await fb.auth.signInWithPopup(fb.authInstance, provider)
    } catch (inner) {
      const code = inner instanceof Error ? inner.message : String(inner)
      if (code.includes('popup-blocked') || code.includes('operation-not-supported')) {
        try {
          localStorage.setItem(REDIRECT_FLAG, '1')
        } catch {
          /* private mode */
        }
        // Navigates away; the result is picked up by finishRedirect() on return.
        await fb.auth.signInWithRedirect(fb.authInstance, provider)
        return false
      }
      throw inner
    }
    rememberSignedIn(true)
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

export async function signOut(): Promise<void> {
  const fb = await loadFirebase()
  // One last push, so work from this session is not stranded on this device.
  if (fb.authInstance.currentUser) await push()
  stopSnapshot?.()
  stopStore?.()
  stopSnapshot = stopStore = null
  await fb.auth.signOut(fb.authInstance)
  rememberSignedIn(false)
  useSync.setState({
    status: 'off',
    email: null,
    lastSyncedAt: null,
    error: null,
    restoring: false,
  })
  // The store is memory-only now, so signing out clears the data with it.
  useLearner.setState({ profiles: [], activeId: null })
}

const LEGACY_KEY = 'passerelle:learner'

/**
 * Take in progress left by the version that stored profiles in this browser.
 *
 * It is read into memory on startup and only deleted once it has been pushed
 * to the account, never before: someone who has not signed in yet still has
 * their course, and the key is cleared the moment there is somewhere safer for
 * it to live. Dropping it on sight would have wiped whatever had not synced.
 */
export function adoptLegacyLocalData(): void {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as { state?: { profiles?: unknown[]; activeId?: string | null } }
    const profiles = (parsed.state?.profiles ?? [])
      .map(normalizeProfile)
      .filter((p): p is Profile => p !== null)
    if (!profiles.length) {
      localStorage.removeItem(LEGACY_KEY)
      return
    }
    const merged = mergeProfileLists(useLearner.getState().profiles, profiles)
    useLearner.setState({
      profiles: merged,
      activeId: merged.some((p) => p.id === parsed.state?.activeId)
        ? (parsed.state?.activeId ?? merged[0].id)
        : merged[0].id,
    })
  } catch {
    /* unreadable — leave it alone rather than destroy it */
  }
}

function dropLegacyLocalData(): void {
  try {
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    /* private mode */
  }
}

/** Start fetching the SDK now, so a later click can open a popup immediately. */
export function warmFirebase(): void {
  void loadFirebase()
}

export function redirectPending(): boolean {
  try {
    return localStorage.getItem(REDIRECT_FLAG) === '1'
  } catch {
    return false
  }
}

/**
 * Pick up a sign-in that went the redirect route.
 *
 * Returns true when this load is the far side of one and it worked, so the
 * caller can route the learner the same way a popup sign-in would have.
 */
export async function finishRedirect(): Promise<boolean> {
  if (!redirectPending()) return false
  try {
    localStorage.removeItem(REDIRECT_FLAG)
  } catch {
    /* private mode */
  }
  useSync.setState({ status: 'connecting' })
  try {
    const fb = await loadFirebase()
    const result = await fb.auth.getRedirectResult(fb.authInstance)
    if (!result?.user) {
      useSync.setState({ status: 'off' })
      return false
    }
    rememberSignedIn(true)
    return true
  } catch (e) {
    useSync.setState({
      status: 'error',
      error: e instanceof Error ? e.message : 'Не вдалося увійти',
    })
    return false
  }
}

/**
 * Watch the signed-in account for the life of the app.
 *
 * Only loads Firebase when this browser has signed in before, so a learner who
 * never uses an account never pays for the SDK.
 */
export async function initSync(): Promise<void> {
  if (!wasSignedIn()) {
    useSync.setState({ restoring: false })
    return
  }
  const fb = await loadFirebase()
  fb.auth.onAuthStateChanged(fb.authInstance, (user) => {
    if (!user) {
      // Signed out elsewhere, or the session lapsed. Stop waiting.
      rememberSignedIn(false)
      useSync.setState({ status: 'off', email: null, restoring: false })
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
