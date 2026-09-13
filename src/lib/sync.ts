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

export async function signIn(): Promise<void> {
  useSync.setState({ status: 'connecting', error: null })
  try {
    const fb = await loadFirebase()
    const provider = new fb.auth.GoogleAuthProvider()
    // Popup rather than redirect: Firebase's redirect flow breaks on browsers
    // that partition third-party storage, which includes Safari and every
    // browser on iOS — exactly the phone this exists to support.
    await fb.auth.signInWithPopup(fb.authInstance, provider)
    rememberSignedIn(true)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Не вдалося увійти'
    // Closing the popup is a choice, not a failure to report.
    if (message.includes('popup-closed-by-user') || message.includes('cancelled-popup-request')) {
      useSync.setState({ status: 'off', error: null })
      return
    }
    useSync.setState({ status: 'error', error: message })
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
