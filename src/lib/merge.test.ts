import { describe, expect, it } from 'vitest'
import { mergeProfileLists, mergeProfiles } from './merge'
import type { SrsCard } from './srs'
import type { Profile } from '@/store/learner'

/**
 * The scenario every one of these describes: a lesson on the phone during a
 * commute, then the laptop opened on a copy that never saw it. Under "newest
 * device wins" that lesson disappears with nothing to show it happened. These
 * pin down that it does not.
 */

function profile(over: Partial<Profile> = {}): Profile {
  return {
    id: 'p1',
    name: 'Serhii',
    emoji: '🥐',
    courseId: 'a0-a1',
    createdAt: '2026-01-01T00:00:00.000Z',
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

function card(over: Partial<SrsCard> = {}): SrsCard {
  return {
    id: 'w_bonjour',
    ease: 2.5,
    interval: 1,
    reps: 1,
    lapses: 0,
    due: '2026-09-14',
    step: 0,
    seen: 1,
    correct: 1,
    ...over,
  }
}

describe('work done on either device survives', () => {
  it('keeps a lesson finished on the phone when the laptop never saw it', () => {
    const laptop = profile({ lessons: { m1l1: rec(true, 90) } })
    const phone = profile({ lessons: { m1l1: rec(true, 90), m1l2: rec(true, 80) } })

    const merged = mergeProfiles(laptop, phone)
    expect(Object.keys(merged.lessons).sort()).toEqual(['m1l1', 'm1l2'])
    expect(merged.lessons.m1l2.completed).toBe(true)
  })

  it('keeps the better score, whichever device earned it', () => {
    const a = profile({ quizzes: { m1: test(60, false) } })
    const b = profile({ quizzes: { m1: test(95, true) } })
    expect(mergeProfiles(a, b).quizzes.m1).toMatchObject({ bestScore: 95, passed: true })
    // And the other way round, so the result does not depend on argument order.
    expect(mergeProfiles(b, a).quizzes.m1).toMatchObject({ bestScore: 95, passed: true })
  })

  it('never re-locks a module the placement test opened', () => {
    const a = profile({ startModule: { 'a0-a1': 7 } })
    const b = profile({ startModule: { 'a0-a1': 3 } })
    expect(mergeProfiles(a, b).startModule['a0-a1']).toBe(7)
  })

  it('unions saved words and notebook entries', () => {
    const a = profile({ savedWords: ['w_pain', 'w_eau'] })
    const b = profile({ savedWords: ['w_eau', 'w_vin'] })
    expect(mergeProfiles(a, b).savedWords.sort()).toEqual(['w_eau', 'w_pain', 'w_vin'])
  })
})

describe('flashcard scheduling', () => {
  it('takes the card as of the most recent real review, not the earliest due', () => {
    const stale = card({ reps: 1, interval: 1, due: '2026-09-14', lastReviewed: '2026-09-10' })
    const fresh = card({ reps: 4, interval: 21, due: '2026-10-04', lastReviewed: '2026-09-13' })

    const merged = mergeProfiles(
      profile({ srs: { w_bonjour: stale } }),
      profile({ srs: { w_bonjour: fresh } }),
    )
    expect(merged.srs.w_bonjour).toMatchObject({ reps: 4, interval: 21, due: '2026-10-04' })
  })

  it('keeps cumulative history even from the copy that lost', () => {
    const a = card({ seen: 9, correct: 7, lapses: 2, lastReviewed: '2026-09-10' })
    const b = card({ seen: 3, correct: 3, lapses: 0, lastReviewed: '2026-09-13' })

    const merged = mergeProfiles(
      profile({ srs: { w_bonjour: a } }),
      profile({ srs: { w_bonjour: b } }),
    )
    // The review on the other device still happened.
    expect(merged.srs.w_bonjour).toMatchObject({ seen: 9, correct: 7, lapses: 2 })
  })
})

describe('XP and days', () => {
  it('recomputes XP from the days that justify it', () => {
    const a = profile({ xp: 999, days: { '2026-09-12': day(50), '2026-09-13': day(30) } })
    const b = profile({ xp: 1, days: { '2026-09-13': day(70) } })

    const merged = mergeProfiles(a, b)
    // 50 from the 12th, and the larger of the two claims for the 13th.
    expect(merged.xp).toBe(120)
    expect(merged.days['2026-09-13'].xp).toBe(70)
  })

  it('never invents XP by adding up a day both devices already agreed on', () => {
    const shared = { '2026-09-13': day(80) }
    const merged = mergeProfiles(profile({ days: shared }), profile({ days: shared }))
    expect(merged.xp).toBe(80)
  })

  it('keeps the best streak ever reached', () => {
    expect(mergeProfiles(profile({ streakBest: 11 }), profile({ streakBest: 4 })).streakBest).toBe(
      11,
    )
  })
})

describe('things that must not come back from the dead', () => {
  it('leaves a resolved mistake resolved', () => {
    const open = mistake({ resolved: false, at: '2026-09-10T10:00:00.000Z' })
    const cleared = mistake({ resolved: true, at: '2026-09-13T10:00:00.000Z' })

    expect(
      mergeProfiles(profile({ mistakes: [open] }), profile({ mistakes: [cleared] })).mistakes[0]
        .resolved,
    ).toBe(true)
    // Even when the cleared copy is the older of the two.
    const clearedEarlier = mistake({ resolved: true, at: '2026-09-01T10:00:00.000Z' })
    const openLater = mistake({ resolved: false, at: '2026-09-13T10:00:00.000Z' })
    expect(
      mergeProfiles(profile({ mistakes: [clearedEarlier] }), profile({ mistakes: [openLater] }))
        .mistakes[0].resolved,
    ).toBe(true)
  })

  it('keeps the story completion date from the first time it was read', () => {
    const a = profile({ stories: { s1: '2026-09-01T00:00:00.000Z' } })
    const b = profile({ stories: { s1: '2026-09-13T00:00:00.000Z' } })
    expect(mergeProfiles(a, b).stories.s1).toBe('2026-09-01T00:00:00.000Z')
  })
})

describe('writing drafts', () => {
  it('takes the most recently typed version, since prose cannot be merged', () => {
    const a = profile({
      writings: { w1: { text: 'Bonjour', updatedAt: '2026-09-10', done: false } },
    })
    const b = profile({
      writings: { w1: { text: 'Bonjour madame', updatedAt: '2026-09-13', done: false } },
    })
    expect(mergeProfiles(a, b).writings.w1.text).toBe('Bonjour madame')
  })

  it('keeps a task marked done even if the other copy is newer', () => {
    const done = profile({ writings: { w1: { text: 'x', updatedAt: '2026-09-01', done: true } } })
    const newer = profile({ writings: { w1: { text: 'y', updatedAt: '2026-09-13', done: false } } })
    expect(mergeProfiles(done, newer).writings.w1.done).toBe(true)
  })
})

describe('merging whole profile lists', () => {
  it('pairs by id and carries across a profile the other device has never seen', () => {
    const local = [profile({ id: 'p1', savedWords: ['a'] })]
    const remote = [profile({ id: 'p1', savedWords: ['b'] }), profile({ id: 'p2', name: 'Maryna' })]

    const merged = mergeProfileLists(local, remote)
    expect(merged).toHaveLength(2)
    expect(merged.find((p) => p.id === 'p1')?.savedWords.sort()).toEqual(['a', 'b'])
    expect(merged.find((p) => p.id === 'p2')?.name).toBe('Maryna')
  })

  it('is stable when a device syncs twice with nothing new', () => {
    const a = [profile({ xp: 120, days: { '2026-09-13': day(120) }, savedWords: ['x'] })]
    const once = mergeProfileLists(a, a)
    const twice = mergeProfileLists(once, a)
    expect(twice).toEqual(once)
  })
})

describe('signing in never invents a learner', () => {
  it('reuses the account profile instead of adding another', async () => {
    const { routeAfterSignIn } = await import('./sync')
    // The reported bug: every sign-in with the same Gmail grew one more name.
    const { profiles, go } = routeAfterSignIn(
      [profile({ id: 'made_on_this_mac', xp: 40 })],
      [profile({ id: 'account_one', xp: 500 })],
    )
    expect(profiles).toHaveLength(1)
    expect(profiles[0].id).toBe('account_one')
    expect(go).toBe('app')
  })

  it('keeps work done in this browser before signing in', async () => {
    const { routeAfterSignIn } = await import('./sync')
    const { profiles } = routeAfterSignIn(
      [profile({ id: 'local', savedWords: ['w_pain'], days: { '2026-09-12': day(60) } })],
      [profile({ id: 'account', savedWords: ['w_eau'], days: { '2026-09-13': day(100) } })],
    )
    // Folded into the account's profile, not appended as a second one.
    expect(profiles).toHaveLength(1)
    expect(profiles[0].savedWords.sort()).toEqual(['w_eau', 'w_pain'])
    expect(profiles[0].xp).toBe(160)
  })

  it('stays at one profile however many times you sign in', async () => {
    const { routeAfterSignIn } = await import('./sync')
    let account = [profile({ id: 'account_one' })]
    for (let i = 0; i < 5; i++) {
      account = routeAfterSignIn([profile({ id: `device_${i}` })], account).profiles
    }
    expect(account).toHaveLength(1)
  })

  it('still merges a profile the account and this browser share', async () => {
    const { routeAfterSignIn } = await import('./sync')
    const { profiles } = routeAfterSignIn(
      [profile({ id: 'p1', savedWords: ['local'] })],
      [profile({ id: 'p1', savedWords: ['remote'] })],
    )
    expect(profiles).toHaveLength(1)
    expect(profiles[0].savedWords.sort()).toEqual(['local', 'remote'])
  })

  it('keeps every name the account holds, added deliberately', async () => {
    const { routeAfterSignIn } = await import('./sync')
    const { profiles } = routeAfterSignIn(
      [],
      [profile({ id: 'p1', name: 'Serhii' }), profile({ id: 'p2', name: 'Maryna' })],
    )
    expect(profiles.map((p) => p.name).sort()).toEqual(['Maryna', 'Serhii'])
  })

  it('sends a genuinely new learner to setup, and nobody else', async () => {
    const { routeAfterSignIn } = await import('./sync')
    expect(routeAfterSignIn([], []).go).toBe('setup')
    // Already has a profile here — asking for a name again is what created the
    // duplicate, because that step ends in createProfile.
    expect(routeAfterSignIn([profile({ id: 'local' })], []).go).toBe('app')
  })
})

function rec(completed: boolean, bestScore: number) {
  return { completed, bestScore, attempts: 1, lastAt: '2026-09-13T00:00:00.000Z' }
}
function test(bestScore: number, passed: boolean) {
  return { bestScore, passed, attempts: 1, lastAt: '2026-09-13T00:00:00.000Z' }
}
function day(xp: number) {
  return { xp, answered: xp / 10, correct: xp / 10 }
}
function mistake(over: { resolved: boolean; at: string }) {
  return {
    id: 'm1',
    exerciseId: 'm1l1e1',
    kind: 'type',
    question: 'q',
    expected: 'e',
    given: 'g',
    wordIds: [],
    ...over,
  }
}
