/**
 * Merging two versions of the same profile.
 *
 * Sync's hard part is not moving bytes, it is deciding what happened when a
 * learner studied on a laptop and a phone without the two meeting in between.
 * "Newest device wins" is the usual shortcut and it silently eats a session:
 * finish a lesson on the train, open the laptop that was left on a stale copy,
 * and the lesson is gone with nothing to show it ever existed.
 *
 * So every field is merged on its own terms, and the rule throughout is that
 * evidence of work is never thrown away. A lesson completed anywhere stays
 * completed; a best score stays the best of the two; a flashcard keeps the
 * review that actually happened most recently, because that one reflects what
 * the learner really remembered.
 */

import type { SrsCard } from './srs'
import type { CustomVideo, CustomWord, DayRecord, Mistake, Note, Profile } from '@/store/learner'

const later = (a?: string, b?: string) => ((a ?? '') >= (b ?? '') ? a : b)
const newest = (a?: string, b?: string) => (!a ? b : !b ? a : a >= b ? a : b)

/** Merge two id-keyed maps, deciding collisions with `pick`. */
function mergeMap<T>(
  a: Record<string, T> = {},
  b: Record<string, T> = {},
  pick: (x: T, y: T) => T,
): Record<string, T> {
  const out: Record<string, T> = { ...a }
  for (const [k, v] of Object.entries(b)) {
    out[k] = k in out ? pick(out[k], v) : v
  }
  return out
}

/** Merge two lists of records that carry their own id. */
function mergeById<T extends { id: string }>(
  a: T[] = [],
  b: T[] = [],
  pick: (x: T, y: T) => T,
): T[] {
  const byId = new Map<string, T>()
  for (const item of [...a, ...b]) {
    const existing = byId.get(item.id)
    byId.set(item.id, existing ? pick(existing, item) : item)
  }
  return [...byId.values()]
}

/**
 * A day's work, seen from two devices.
 *
 * Taking the larger count rather than the sum. Both are wrong in some case —
 * the sum double-counts everything the two devices already agreed on, the max
 * under-counts a day genuinely split across both — but they fail in opposite
 * directions, and inventing XP the learner never earned corrupts the streak
 * and the daily goal for good. Under-counting one unusual day does not.
 */
function mergeDay(x: DayRecord, y: DayRecord): DayRecord {
  return {
    xp: Math.max(x.xp, y.xp),
    answered: Math.max(x.answered, y.answered),
    correct: Math.max(x.correct, y.correct),
  }
}

/**
 * Keep the card as of its most recent actual review.
 *
 * Scheduling state is not additive: ease, interval and due date are one
 * coherent snapshot, so mixing fields from both copies would produce a card
 * that never existed. The tie-break is `lastReviewed`, not `due` — a card
 * reviewed later is the better record of what the learner knows, even when it
 * happens to be scheduled sooner.
 */
function mergeCard(x: SrsCard, y: SrsCard): SrsCard {
  const [fresh, stale] = (x.lastReviewed ?? '') >= (y.lastReviewed ?? '') ? [x, y] : [y, x]
  return {
    ...fresh,
    // History is cumulative even when scheduling is not: a review that
    // happened on the other device still happened.
    seen: Math.max(x.seen, y.seen),
    correct: Math.max(x.correct, y.correct),
    lapses: Math.max(x.lapses, y.lapses),
    reps: fresh.reps,
    ...(stale.lastReviewed && !fresh.lastReviewed ? { lastReviewed: stale.lastReviewed } : {}),
  }
}

export function mergeProfiles(a: Profile, b: Profile): Profile {
  const days = mergeMap(a.days, b.days, mergeDay)

  return {
    // Identity comes from whichever copy was edited most recently; these are
    // single values with no sensible "both".
    ...(a.createdAt <= b.createdAt ? a : b),
    id: a.id,
    createdAt: a.createdAt <= b.createdAt ? a.createdAt : b.createdAt,

    name: b.name || a.name,
    emoji: b.emoji || a.emoji,
    gender: b.gender ?? a.gender,
    courseId: b.courseId || a.courseId,

    // XP is the sum of what each day is worth, recomputed rather than carried,
    // so it can never drift away from the records that justify it.
    xp: Object.values(days).reduce((sum, d) => sum + d.xp, 0),
    days,

    streakBest: Math.max(a.streakBest, b.streakBest),
    streakCurrent: Math.max(a.streakCurrent, b.streakCurrent),
    lastStudyDay: newest(a.lastStudyDay, b.lastStudyDay),

    lessons: mergeMap(a.lessons, b.lessons, (x, y) => ({
      completed: x.completed || y.completed,
      bestScore: Math.max(x.bestScore, y.bestScore),
      attempts: Math.max(x.attempts, y.attempts),
      lastAt: later(x.lastAt, y.lastAt) ?? x.lastAt,
    })),

    quizzes: mergeMap(a.quizzes, b.quizzes, (x, y) => ({
      bestScore: Math.max(x.bestScore, y.bestScore),
      passed: x.passed || y.passed,
      attempts: Math.max(x.attempts, y.attempts),
      lastAt: later(x.lastAt, y.lastAt) ?? x.lastAt,
    })),

    exams: mergeMap(a.exams, b.exams, (x, y) => ({
      bestScore: Math.max(x.bestScore, y.bestScore),
      passed: x.passed || y.passed,
      attempts: Math.max(x.attempts, y.attempts),
      lastAt: later(x.lastAt, y.lastAt) ?? x.lastAt,
    })),

    // Completion timestamps: the first time it was finished is the true one.
    stories: mergeMap(a.stories, b.stories, (x, y) => (x <= y ? x : y)),
    videos: mergeMap(a.videos, b.videos, (x, y) => (x <= y ? x : y)),

    scenarios: mergeMap(a.scenarios, b.scenarios, (x, y) => ({
      best: Math.max(x.best, y.best),
      at: later(x.at, y.at) ?? x.at,
    })),

    // The further-along placement wins: it unlocks, and unlocking twice is
    // harmless while re-locking a module the learner has moved past is not.
    startModule: mergeMap(a.startModule, b.startModule, (x, y) => Math.max(x, y)),

    // A draft is prose, so it cannot be merged — the most recently typed
    // version is the only honest answer, and `done` is sticky.
    writings: mergeMap(a.writings, b.writings, (x, y) => {
      const fresh = x.updatedAt >= y.updatedAt ? x : y
      return { ...fresh, done: x.done || y.done }
    }),

    srs: mergeMap(a.srs, b.srs, mergeCard),

    savedWords: [...new Set([...(a.savedWords ?? []), ...(b.savedWords ?? [])])],

    // Resolved is sticky: a mistake cleared on one device must not come back
    // from the other, or the deck refills with work already done.
    mistakes: mergeById<Mistake>(a.mistakes, b.mistakes, (x, y) => ({
      ...(x.at >= y.at ? x : y),
      resolved: x.resolved || y.resolved,
    })),

    notes: mergeById<Note>(a.notes, b.notes, (x, y) => (x.updatedAt >= y.updatedAt ? x : y)),
    customWords: mergeById<CustomWord>(a.customWords, b.customWords, (x) => x),
    customVideos: mergeById<CustomVideo>(a.customVideos, b.customVideos, (x) => x),
  }
}

/** Merge two whole profile lists, pairing them up by id. */
export function mergeProfileLists(local: Profile[], remote: Profile[]): Profile[] {
  const byId = new Map(local.map((p) => [p.id, p]))
  for (const r of remote) {
    const mine = byId.get(r.id)
    byId.set(r.id, mine ? mergeProfiles(mine, r) : r)
  }
  return [...byId.values()]
}
