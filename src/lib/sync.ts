import { create } from 'zustand'
import { loadFirebase, rememberSignedIn, wasSignedIn } from './firebase'
import { mergeProfileLists } from './merge'
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
}

export const useSync = create<SyncState>(() => ({
  status: 'off',
  email: null,
  lastSyncedAt: null,
  error: null,
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
      useSync.setState({ status: 'synced', lastSyncedAt: Date.now(), error: null })
    },
    (e) => useSync.setState({ status: 'error', error: e.message }),
  )

  stopStore?.()
  stopStore = useLearner.subscribe(schedulePush)

  // Push once on connect so a device that studied offline hands over its work
  // even if nothing changes afterwards.
  await push()
}

/**
 * Where a learner belongs once they have signed in.
 *
 * The distinction that matters is whether the *account* has studied before,
 * not whether this browser has. A brand-new account still needs a name and a
 * level even when a stale profile happens to be sitting in local storage —
 * treating that leftover as "returning" silently skipped the rest of setup.
 *
 * Local work is merged either way: someone who tried the app before signing in
 * keeps what they did.
 */
export function routeAfterSignIn(
  local: Profile[],
  remote: Profile[],
): { profiles: Profile[]; go: 'app' | 'setup' } {
  return {
    profiles: mergeProfileLists(local, remote),
    go: remote.length ? 'app' : 'setup',
  }
}

/**
 * Read the account's profiles once, right after signing in.
 *
 * This is what makes a second device work the way anyone would expect: sign in
 * on a phone and the course is simply there, rather than asking again for a
 * name and a level that were settled on the laptop weeks ago.
 */
export async function fetchRemoteProfiles(): Promise<Profile[]> {
  const target = await userDoc()
  if (!target) return []
  try {
    const snap = await target.fb.firestore.getDoc(target.ref)
    const raw = snap.data()?.profiles
    if (!Array.isArray(raw)) return []
    return raw.map(normalizeProfile).filter((p): p is Profile => p !== null)
  } catch {
    return []
  }
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
  useSync.setState({ status: 'off', email: null, lastSyncedAt: null, error: null })
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
  if (!wasSignedIn()) return
  const fb = await loadFirebase()
  fb.auth.onAuthStateChanged(fb.authInstance, (user) => {
    if (!user) {
      useSync.setState({ status: 'off', email: null })
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
