import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Profile } from '@/store/learner'

/**
 * What a write is allowed to do to the account.
 *
 * This is the file that can destroy a learner's course, and until now it was
 * the one file with no tests of its own — the merge underneath it was covered,
 * the decision to call it was not. Every case here is a way the account was
 * actually emptied, written down so it cannot come back:
 *
 *  - a write that went out before the account had answered,
 *  - a write that sent less than the account already held,
 *  - Firestore's own empty cache being mistaken for an empty account,
 *  - subscriptions left armed after the session went away.
 */

function profile(over: Partial<Profile> = {}): Profile {
  return {
    id: 'p1',
    name: 'Serhii',
    emoji: '🥐',
    courseId: 'a0-a1',
    createdAt: '2026-09-01T00:00:00.000Z',
    gender: 'm',
    xp: 0,
    streakCurrent: 0,
    streakBest: 0,
    days: {},
    lessons: {},
    quizzes: {},
    exams: {},
    stories: {},
    videos: {},
    scenarios: {},
    startModule: {},
    writings: {},
    srs: {},
    savedWords: [],
    mistakes: [],
    notes: [],
    customWords: [],
    customVideos: [],
    ...over,
  }
}

/** A profile with a year behind it, so losing it is unmistakable in a diff. */
const rich = profile({
  id: 'rich',
  xp: 4200,
  days: { '2026-09-01': { xp: 4200, answered: 500, correct: 430 } },
  lessons: { 'a0-1': { completed: true, bestScore: 95, attempts: 2, lastAt: '2026-09-01' } },
})

type Doc = Record<string, unknown> | undefined

function makeFirebase() {
  const writes: Record<string, unknown>[] = []
  let stored: Doc
  let onNext: ((snap: unknown) => void) | null = null
  let authCb: ((user: unknown) => void) | null = null

  const snapshot = (data: Doc, meta: { fromCache: boolean; hasPendingWrites?: boolean }) => ({
    data: () => data,
    exists: () => data !== undefined,
    metadata: { fromCache: meta.fromCache, hasPendingWrites: meta.hasPendingWrites ?? false },
  })

  const fb = {
    db: {},
    authInstance: { currentUser: { uid: 'u1', email: 'a@b.c' } as unknown },
    auth: {
      onAuthStateChanged: (_i: unknown, cb: (u: unknown) => void) => {
        authCb = cb
        return () => {}
      },
      getRedirectResult: async () => null,
      signOut: async () => {
        fb.authInstance.currentUser = null
      },
    },
    firestore: {
      doc: () => ({ path: 'users/u1' }),
      serverTimestamp: () => 'ts',
      onSnapshot: (_ref: unknown, _opts: unknown, next: (s: unknown) => void) => {
        onNext = next
        return () => {
          onNext = null
        }
      },
      runTransaction: async (
        _db: unknown,
        body: (tx: {
          get: (ref: unknown) => Promise<unknown>
          set: (ref: unknown, data: Record<string, unknown>) => void
        }) => Promise<void>,
      ) => {
        await body({
          get: async () => snapshot(stored, { fromCache: false }),
          set: (_ref, data) => {
            writes.push(data)
            stored = data
          },
        })
      },
    },
  }

  return {
    fb,
    writes,
    /** What the account currently holds, as the server sees it. */
    setStored: (d: Doc) => {
      stored = d
    },
    emit: (data: Doc, opts: { fromCache?: boolean } = {}) =>
      onNext?.(snapshot(data, { fromCache: opts.fromCache ?? false })),
    signalAuth: (user: unknown) => authCb?.(user),
  }
}

async function freshModules(fb: unknown) {
  vi.resetModules()
  vi.doMock('./firebase', () => ({ loadFirebase: () => Promise.resolve(fb) }))
  const sync = await import('./sync')
  const learner = await import('@/store/learner')
  return { sync, learner }
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  vi.useRealTimers()
  vi.doUnmock('./firebase')
})

/** Long enough for the push debounce, short enough not to trip the offline timer. */
const settle = () => vi.advanceTimersByTimeAsync(1200)

describe('nothing goes out before the account has answered', () => {
  it('does not treat Firestore’s empty cache as an empty account', async () => {
    const world = makeFirebase()
    world.setStored({ profiles: [rich] })
    const { sync, learner } = await freshModules(world.fb)

    await sync.attachAfterSignIn()

    // Offline, or in the moment before the first response: Firestore raises the
    // empty document it holds locally. It says nothing about the account.
    world.emit(undefined, { fromCache: true })

    expect(sync.useSync.getState().restoring).toBe(true)

    // This is what used to happen next: told there was no profile, the app sent
    // the learner to setup, and setup made one.
    learner.useLearner.getState().createProfile('Serhii', 'a0-a1')
    await settle()

    expect(world.writes).toHaveLength(0)
  })

  it('starts syncing once the server answers', async () => {
    const world = makeFirebase()
    world.setStored({ profiles: [rich] })
    const { sync, learner } = await freshModules(world.fb)

    await sync.attachAfterSignIn()
    world.emit({ profiles: [rich] })
    await settle()

    expect(sync.useSync.getState().restoring).toBe(false)
    expect(learner.useLearner.getState().profiles.map((p) => p.id)).toEqual(['rich'])
  })

  it('says there is no connection rather than loading for ever', async () => {
    const world = makeFirebase()
    const { sync } = await freshModules(world.fb)

    await sync.attachAfterSignIn()
    await vi.advanceTimersByTimeAsync(13_000)

    // Firestore reports being offline by never answering, so the wait has to
    // end somewhere: the app shows the offline screen, not a spinner.
    expect(sync.useSync.getState().restoring).toBe(false)
    expect(sync.useSync.getState().error).toBeTruthy()
  })
})

describe('a write can only ever add to the account', () => {
  it('puts back what this browser never had', async () => {
    const world = makeFirebase()
    world.setStored({ profiles: [rich] })
    const { sync, learner } = await freshModules(world.fb)

    await sync.attachAfterSignIn()
    world.emit({ profiles: [rich] })
    await settle()

    // The store truncated behind the sync layer's back — whatever the cause,
    // the account must survive it.
    const fresh = profile({ id: 'fresh', xp: 0 })
    learner.useLearner.setState({ profiles: [fresh], activeId: 'fresh' })
    await settle()

    const sent = world.writes.at(-1)!.profiles as Profile[]
    expect(sent.map((p) => p.id).sort()).toEqual(['fresh', 'rich'])
    expect(sent.find((p) => p.id === 'rich')!.xp).toBe(4200)
  })

  it('keeps a name typed a second ago, rather than the account’s older one', async () => {
    const world = makeFirebase()
    world.setStored({ profiles: [rich] })
    const { sync, learner } = await freshModules(world.fb)

    await sync.attachAfterSignIn()
    world.emit({ profiles: [rich] })
    await settle()

    learner.useLearner.getState().updateProfile({ name: 'Сергій' })
    await settle()

    const sent = world.writes.at(-1)!.profiles as Profile[]
    expect(sent.find((p) => p.id === 'rich')!.name).toBe('Сергій')
  })
})

describe('deleting still means deleting', () => {
  it('does not resurrect a profile the learner removed', async () => {
    const world = makeFirebase()
    const second = profile({ id: 'second', name: 'Оля' })
    world.setStored({ profiles: [rich, second] })
    const { sync, learner } = await freshModules(world.fb)

    await sync.attachAfterSignIn()
    world.emit({ profiles: [rich, second] })
    await settle()

    learner.useLearner.getState().deleteProfile('second')
    await settle()

    const last = world.writes.at(-1)!
    expect((last.profiles as Profile[]).map((p) => p.id)).toEqual(['rich'])
    expect(last.removedProfileIds).toContain('second')

    // Another device, still on the old list, sends it back.
    world.emit({ profiles: [rich, second], removedProfileIds: ['second'] })
    expect(learner.useLearner.getState().profiles.map((p) => p.id)).toEqual(['rich'])
  })
})

describe('losing the session takes the subscriptions with it', () => {
  it('writes nothing more once the account is gone', async () => {
    const world = makeFirebase()
    world.setStored({ profiles: [rich] })
    const { sync, learner } = await freshModules(world.fb)

    await sync.initSync()
    world.signalAuth({ uid: 'u1', email: 'a@b.c' })
    await vi.advanceTimersByTimeAsync(0)
    world.emit({ profiles: [rich] })
    await settle()
    const before = world.writes.length

    // A session expiring does not go through signOut(), so this is the only
    // place the subscriptions can be taken down.
    world.fb.authInstance.currentUser = null
    world.signalAuth(null)
    await settle()

    expect(learner.useLearner.getState().profiles).toEqual([])
    expect(world.writes).toHaveLength(before)
  })
})

describe('a save in flight when the tab closes', () => {
  it('goes out immediately instead of waiting for the debounce', async () => {
    const world = makeFirebase()
    world.setStored({ profiles: [rich] })
    const { sync, learner } = await freshModules(world.fb)

    await sync.attachAfterSignIn()
    world.emit({ profiles: [rich] })
    await settle()
    const before = world.writes.length

    learner.useLearner.getState().addXp(40, 1, 1)
    // Still inside the window where writes are being coalesced.
    await vi.advanceTimersByTimeAsync(100)
    expect(world.writes).toHaveLength(before)

    sync.flushPending()
    await vi.advanceTimersByTimeAsync(0)

    expect(world.writes.length).toBe(before + 1)
    const sent = world.writes.at(-1)!.profiles as Profile[]
    expect(sent.find((p) => p.id === 'rich')!.xp).toBeGreaterThan(4200)
  })
})

describe('the two clears that are meant to clear', () => {
  it('resets progress for real, against a merge that would undo it', async () => {
    const world = makeFirebase()
    world.setStored({ profiles: [rich] })
    const { sync, learner } = await freshModules(world.fb)

    await sync.attachAfterSignIn()
    world.emit({ profiles: [rich] })
    await settle()

    learner.useLearner.getState().resetProgress()
    await settle()

    const last = world.writes.at(-1)!
    const sent = last.profiles as Profile[]
    expect(sent).toHaveLength(1)
    expect(sent[0].xp).toBe(0)
    expect(sent[0].lessons).toEqual({})
    // The name and course are what the dialog promises to keep.
    expect(sent[0].name).toBe('Serhii')
    expect(sent[0].courseId).toBe('a0-a1')
    // And the old id is retired, or the account's copy merges straight back in.
    expect(sent[0].id).not.toBe('rich')
    expect(last.removedProfileIds).toContain('rich')
  })

  it('records the deletion of the last profile, with nothing left to send', async () => {
    const world = makeFirebase()
    world.setStored({ profiles: [rich] })
    const { sync, learner } = await freshModules(world.fb)

    await sync.attachAfterSignIn()
    world.emit({ profiles: [rich] })
    await settle()

    learner.useLearner.getState().deleteProfile('rich')
    await settle()

    // Nothing to write in the profiles field, but the deletion still has to
    // reach the account or a reload hands the profile back.
    const last = world.writes.at(-1)!
    expect(last.removedProfileIds).toContain('rich')
    expect(last.profiles).toBeUndefined()
  })
})
