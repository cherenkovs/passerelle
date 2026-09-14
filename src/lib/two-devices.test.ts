import { describe, expect, it } from 'vitest'
import { mergeProfileLists, mergeProfiles } from './merge'
import { routeAfterSignIn } from './sync'
import type { Profile } from '@/store/learner'

/**
 * Two browsers, one Google account.
 *
 * The rules that decide this are spread across sign-in and sync, so here they
 * are exercised together as the sequence a person actually performs: sign in on
 * a laptop, sign in on a phone, study on each, and see what the account ends up
 * holding. The property under test is that it converges on one profile holding
 * everything, rather than one profile per browser or one device's work erased.
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

/** Stands in for the Firestore document: one per account. */
class Account {
  profiles: Profile[] = []

  /** A push replaces the document — the guard against writing nothing lives in sync.ts. */
  push(local: Profile[]) {
    if (!local.length) return
    this.profiles = local
  }

  /** A snapshot merges rather than overwrites, so the other device's work survives. */
  pullInto(local: Profile[]): Profile[] {
    return mergeProfileLists(local, this.profiles)
  }
}

/** Everything a browser holds — which, after sign-out, is nothing. */
class Device {
  local: Profile[] = []
  name: string

  constructor(name: string) {
    this.name = name
  }

  signIn(account: Account) {
    const { profiles, go } = routeAfterSignIn(this.local, account.profiles)
    this.local = profiles
    if (go === 'setup') {
      // The only place a profile is ever created.
      this.local = [profile({ id: `made_on_${this.name}` })]
    }
    // Read first, then write: the push only happens after the account answered.
    this.local = account.pullInto(this.local)
    account.push(this.local)
    return go
  }

  study(account: Account, day: string, xp: number, lesson: string) {
    this.local = this.local.map((p) => {
      const days = { ...p.days, [day]: { xp, answered: xp / 10, correct: xp / 10 } }
      return {
        ...p,
        days,
        // The store keeps these two in step, and so must this.
        xp: Object.values(days).reduce((sum, d) => sum + d.xp, 0),
        lessons: {
          ...p.lessons,
          [lesson]: { completed: true, bestScore: 100, attempts: 1, lastAt: day },
        },
      }
    })
    account.push(this.local)
  }

  receiveSnapshot(account: Account) {
    this.local = account.pullInto(this.local)
  }
}

describe('a laptop and a phone on one account', () => {
  it('puts the second browser straight into the course, without a second name', () => {
    const account = new Account()
    const laptop = new Device('laptop')
    const phone = new Device('phone')

    expect(laptop.signIn(account)).toBe('setup') // brand-new account
    expect(phone.signIn(account)).toBe('app') // already has one

    expect(account.profiles).toHaveLength(1)
    expect(phone.local[0].id).toBe(laptop.local[0].id)
  })

  it('carries a lesson done on the phone back to the laptop', () => {
    const account = new Account()
    const laptop = new Device('laptop')
    laptop.signIn(account)
    const phone = new Device('phone')
    phone.signIn(account)

    phone.study(account, '2026-09-14', 120, 'm2l1')
    laptop.receiveSnapshot(account)

    expect(laptop.local[0].lessons.m2l1.completed).toBe(true)
    expect(laptop.local[0].xp).toBe(120)
  })

  it('keeps both sides when each studied before hearing from the other', () => {
    const account = new Account()
    const laptop = new Device('laptop')
    laptop.signIn(account)
    const phone = new Device('phone')
    phone.signIn(account)

    // Neither has seen the other's session yet.
    laptop.study(account, '2026-09-14', 100, 'm2l1')
    phone.study(account, '2026-09-15', 80, 'm2l2')

    laptop.receiveSnapshot(account)
    phone.receiveSnapshot(account)
    account.push(laptop.local)
    phone.receiveSnapshot(account)

    for (const device of [laptop, phone]) {
      expect(device.local).toHaveLength(1)
      expect(device.local[0].lessons.m2l1.completed).toBe(true)
      expect(device.local[0].lessons.m2l2.completed).toBe(true)
      expect(device.local[0].xp).toBe(180)
    }
  })

  it('does not multiply profiles however many browsers sign in', () => {
    const account = new Account()
    new Device('first').signIn(account)

    for (const name of ['chrome', 'safari', 'firefox', 'phone', 'tablet']) {
      const device = new Device(name)
      expect(device.signIn(account)).toBe('app')
      expect(account.profiles).toHaveLength(1)
    }
  })

  it('never lets a freshly signed-in browser erase the account', () => {
    const account = new Account()
    const laptop = new Device('laptop')
    laptop.signIn(account)
    laptop.study(account, '2026-09-14', 500, 'm3l1')

    // The bug this guards: a browser that keeps nothing locally used to push
    // its empty store the instant it connected, before reading.
    const fresh = new Device('fresh')
    expect(fresh.local).toHaveLength(0)
    fresh.signIn(account)

    expect(account.profiles).toHaveLength(1)
    expect(account.profiles[0].xp).toBe(500)
    expect(account.profiles[0].lessons.m3l1.completed).toBe(true)
  })

  it('leaves the account untouched when a device signs out', () => {
    const account = new Account()
    const laptop = new Device('laptop')
    laptop.signIn(account)
    laptop.study(account, '2026-09-14', 300, 'm2l1')

    // Signing out stops the subscriptions, then clears the store.
    laptop.local = []
    account.push(laptop.local) // refused: an empty list is never written

    expect(account.profiles[0].xp).toBe(300)
  })
})

describe('the merge is order-independent', () => {
  it('reaches the same place whichever device syncs first', () => {
    const a = profile({ id: 'p1', days: { '2026-09-14': { xp: 100, answered: 10, correct: 9 } } })
    const b = profile({ id: 'p1', days: { '2026-09-15': { xp: 80, answered: 8, correct: 8 } } })
    expect(mergeProfiles(a, b).xp).toBe(mergeProfiles(b, a).xp)
    expect(mergeProfiles(a, b).xp).toBe(180)
  })
})

describe('what is safe to hand to the database', () => {
  it('drops fields that are merely absent', async () => {
    const { stripUndefined } = await import('./sync')
    // Firestore rejects the whole write for one undefined field, and a profile
    // is full of legitimately absent ones.
    const p = profile({ lastStudyDay: undefined, xp: 0 })
    expect('lastStudyDay' in stripUndefined(p)).toBe(false)
  })

  it('reaches inside nested records and arrays', async () => {
    const { stripUndefined } = await import('./sync')
    const cleaned = stripUndefined({
      srs: { w_pain: { id: 'w_pain', reps: 1, lastReviewed: undefined } },
      mistakes: [{ id: 'm1', explain: undefined, resolved: true }],
    }) as Record<string, any>
    expect('lastReviewed' in cleaned.srs.w_pain).toBe(false)
    expect('explain' in cleaned.mistakes[0]).toBe(false)
    expect(cleaned.mistakes[0].resolved).toBe(true)
  })

  it('keeps null, which is a value someone chose', async () => {
    const { stripUndefined } = await import('./sync')
    // Clearing the selected voice sets null; dropping it would silently
    // restore whatever the account held before.
    expect(stripUndefined({ voiceURI: null, voiceName: null })).toEqual({
      voiceURI: null,
      voiceName: null,
    })
  })

  it('leaves a clean profile untouched', async () => {
    const { stripUndefined } = await import('./sync')
    const p = profile({ xp: 120, savedWords: ['w_pain'] })
    expect(stripUndefined(p)).toEqual(p)
  })

  it('produces something JSON can round-trip with nothing lost', async () => {
    const { stripUndefined } = await import('./sync')
    const p = profile({
      lastStudyDay: undefined,
      srs: {
        a: {
          id: 'a',
          ease: 2.5,
          interval: 1,
          reps: 1,
          lapses: 0,
          due: '2026-09-15',
          step: 0,
          seen: 1,
          correct: 1,
          lastReviewed: undefined,
        },
      },
    })
    const cleaned = stripUndefined(p)
    expect(JSON.parse(JSON.stringify(cleaned))).toEqual(cleaned)
  })
})
