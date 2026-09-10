/**
 * Spaced repetition — SM-2 (the algorithm behind Anki/SuperMemo), adapted to a
 * four-button interface. Cards are scheduled in whole days; everything is
 * stored locally so review works offline.
 */

import { todayKey } from './utils'

export type Rating = 'again' | 'hard' | 'good' | 'easy'

export type SrsCard = {
  id: string
  /** Ease factor, 1.3 – 3.0 */
  ease: number
  /** Current interval in days */
  interval: number
  /** Successful reviews in a row */
  reps: number
  /** How many times it was forgotten */
  lapses: number
  /** Due date, local YYYY-MM-DD */
  due: string
  /** Learning-step index; a card graduates at LEARNING_STEPS.length */
  step: number
  lastReviewed?: string
  /** Rolling accuracy for the analytics screen */
  seen: number
  correct: number
}

/** Minutes for the same-session learning steps, then the card graduates. */
const LEARNING_STEPS = [0, 0]
const GRADUATING_INTERVAL = 1
const EASY_INTERVAL = 4
const MIN_EASE = 1.3
const MAX_INTERVAL = 365

export function createCard(id: string): SrsCard {
  return {
    id,
    ease: 2.5,
    interval: 0,
    reps: 0,
    lapses: 0,
    due: todayKey(),
    step: 0,
    seen: 0,
    correct: 0,
  }
}

function addDays(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + Math.round(days))
  return todayKey(d)
}

export function isLearning(card: SrsCard) {
  return card.step < LEARNING_STEPS.length
}

export function review(card: SrsCard, rating: Rating): SrsCard {
  const next: SrsCard = {
    ...card,
    seen: card.seen + 1,
    correct: card.correct + (rating === 'again' ? 0 : 1),
    lastReviewed: todayKey(),
  }

  if (rating === 'again') {
    next.step = 0
    next.reps = 0
    next.lapses = card.lapses + 1
    next.ease = Math.max(MIN_EASE, card.ease - 0.2)
    next.interval = 0
    next.due = todayKey() // back in the same session
    return next
  }

  if (isLearning(card)) {
    // Still in the learning phase.
    if (rating === 'easy') {
      next.step = LEARNING_STEPS.length
      next.interval = EASY_INTERVAL
      next.due = addDays(EASY_INTERVAL)
      next.reps = card.reps + 1
      return next
    }
    const step = card.step + (rating === 'hard' ? 0 : 1)
    next.step = step
    if (step >= LEARNING_STEPS.length) {
      next.interval = GRADUATING_INTERVAL
      next.due = addDays(GRADUATING_INTERVAL)
      next.reps = card.reps + 1
    } else {
      next.due = todayKey()
    }
    return next
  }

  // Review phase.
  const q = rating === 'hard' ? 3 : rating === 'good' ? 4 : 5
  next.ease = Math.min(3, Math.max(MIN_EASE, card.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))))
  next.reps = card.reps + 1

  const base = Math.max(card.interval, 1)
  let interval: number
  if (rating === 'hard') interval = base * 1.2
  else if (rating === 'good') interval = base * next.ease
  else interval = base * next.ease * 1.3

  interval = Math.min(MAX_INTERVAL, Math.max(1, interval))
  next.interval = interval
  next.due = addDays(interval)
  return next
}

export function isDue(card: SrsCard, on = todayKey()) {
  return card.due <= on
}

/** Newest-first learning cards, then oldest-due reviews. */
export function sortForSession(cards: SrsCard[]) {
  return [...cards].sort((a, b) => {
    const al = isLearning(a) ? 0 : 1
    const bl = isLearning(b) ? 0 : 1
    if (al !== bl) return al - bl
    return a.due.localeCompare(b.due)
  })
}

/** Human-readable next interval, used on the rating buttons. */
export function previewInterval(card: SrsCard, rating: Rating) {
  const next = review(card, rating)
  if (next.interval === 0) return '<10 хв'
  if (next.interval < 1) return '<1 дн'
  const d = Math.round(next.interval)
  if (d < 30) return `${d} дн`
  if (d < 365) return `${Math.round(d / 30)} міс`
  return `${(d / 365).toFixed(1)} р`
}
