import { describe, expect, it } from 'vitest'
import {
  createCard,
  isDue,
  isLearning,
  previewInterval,
  review,
  sortForSession,
  type Rating,
  type SrsCard,
} from './srs'
import { todayKey } from './utils'

/**
 * The memory engine.
 *
 * Nothing here can fail loudly: a card scheduled a year too far away simply
 * never comes back, and the learner quietly stops being asked about a word they
 * were getting wrong. So the properties are worth pinning down.
 */

/** Put a card through a sequence of ratings. */
function drill(ratings: Rating[], card = createCard('w')) {
  return ratings.reduce((c, r) => review(c, r), card)
}

/** A card that has already graduated into the review phase. */
function mature(overrides: Partial<SrsCard> = {}): SrsCard {
  return { ...drill(['good', 'good']), ...overrides }
}

describe('a new card', () => {
  it('is due immediately — a word met today is reviewed today', () => {
    const card = createCard('bonjour')
    expect(isDue(card)).toBe(true)
    expect(isLearning(card)).toBe(true)
    expect(card.reps).toBe(0)
  })

  it('graduates after two good answers', () => {
    const card = drill(['good', 'good'])
    expect(isLearning(card)).toBe(false)
    expect(card.interval).toBeGreaterThanOrEqual(1)
    expect(isDue(card)).toBe(false)
  })

  it('skips the queue when the learner says it was easy', () => {
    const card = drill(['easy'])
    expect(isLearning(card)).toBe(false)
    expect(card.interval).toBe(4)
  })

  it('does not advance on "hard" — the step repeats', () => {
    const once = drill(['hard'])
    expect(isLearning(once)).toBe(true)
    expect(once.step).toBe(0)
    expect(isDue(once)).toBe(true)
  })
})

describe('forgetting', () => {
  it('brings the card back the same session', () => {
    const card = review(mature({ interval: 60 }), 'again')
    expect(card.due).toBe(todayKey())
    expect(isDue(card)).toBe(true)
    expect(card.interval).toBe(0)
  })

  it('counts a lapse and lowers the ease', () => {
    const before = mature()
    const after = review(before, 'again')
    expect(after.lapses).toBe(before.lapses + 1)
    expect(after.ease).toBeLessThan(before.ease)
  })

  it('resets the streak but keeps the history', () => {
    const before = mature()
    const after = review(before, 'again')
    expect(after.reps).toBe(0)
    expect(after.seen).toBe(before.seen + 1)
    expect(after.correct).toBe(before.correct) // not incremented
  })

  it('never lets ease fall below the floor, however bad the run', () => {
    const card = drill(Array<Rating>(30).fill('again'))
    expect(card.ease).toBeGreaterThanOrEqual(1.3)
  })
})

describe('intervals grow', () => {
  it('gets longer every time the learner remembers', () => {
    let card = drill(['good', 'good'])
    const seen = [card.interval]
    for (let i = 0; i < 6; i++) {
      card = review(card, 'good')
      seen.push(card.interval)
    }
    for (let i = 1; i < seen.length; i++) {
      expect(seen[i]).toBeGreaterThan(seen[i - 1])
    }
  })

  it('grows fastest for "easy" and slowest for "hard"', () => {
    const base = mature({ interval: 10 })
    const hard = review(base, 'hard').interval
    const good = review(base, 'good').interval
    const easy = review(base, 'easy').interval
    expect(hard).toBeLessThan(good)
    expect(good).toBeLessThan(easy)
  })

  it('is capped, so a word never disappears for years', () => {
    let card = mature({ interval: 300, ease: 3 })
    for (let i = 0; i < 10; i++) card = review(card, 'easy')
    expect(card.interval).toBeLessThanOrEqual(365)
  })

  it('is never less than a day once the card has graduated', () => {
    const card = review(mature({ interval: 1, ease: 1.3 }), 'hard')
    expect(card.interval).toBeGreaterThanOrEqual(1)
  })
})

describe('session order', () => {
  it('puts learning cards before reviews', () => {
    const fresh = createCard('new')
    const old = mature({ id: 'old', due: '2020-01-01' })
    const order = sortForSession([old, fresh]).map((c) => c.id)
    expect(order).toEqual(['new', 'old'])
  })

  it('takes the most overdue review first', () => {
    const a = mature({ id: 'a', due: '2024-05-01' })
    const b = mature({ id: 'b', due: '2024-01-01' })
    expect(sortForSession([a, b]).map((c) => c.id)).toEqual(['b', 'a'])
  })

  it('does not mutate the list it was given', () => {
    const cards = [mature({ id: 'a', due: '2025-01-01' }), createCard('b')]
    const copy = [...cards]
    sortForSession(cards)
    expect(cards).toEqual(copy)
  })
})

describe('the labels on the rating buttons', () => {
  it('promises the same interval the card will actually get', () => {
    const card = mature({ interval: 10 })
    for (const rating of ['hard', 'good', 'easy'] as const) {
      const days = review(card, rating).interval
      const label = previewInterval(card, rating)
      if (days < 30) expect(label).toBe(`${Math.round(days)} дн`)
    }
  })

  it('says "same session" rather than a number when the card lapses', () => {
    expect(previewInterval(mature({ interval: 30 }), 'again')).toBe('<10 хв')
  })

  it('switches to months and years as intervals grow', () => {
    expect(previewInterval(mature({ interval: 40, ease: 2.5 }), 'good')).toMatch(/міс|р$/)
  })
})

describe('accuracy tracking', () => {
  it('counts every answer and only the right ones as correct', () => {
    const card = drill(['good', 'good', 'again', 'good', 'hard'])
    expect(card.seen).toBe(5)
    expect(card.correct).toBe(4)
  })
})
