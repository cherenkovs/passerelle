import { beforeEach, describe, expect, it } from 'vitest'
import { useLearner } from './learner'

/**
 * Progress bookkeeping.
 *
 * Everything here fails quietly. A lesson that doesn't record leaves the map
 * looking untouched; a mistake that never clears leaves "2 завдання" on screen
 * for ever, however many times the learner works through the deck. Neither
 * throws, and neither shows up anywhere except a learner's growing suspicion
 * that the app isn't listening.
 */

const store = () => useLearner.getState()
const me = () => {
  const s = store()
  return s.profiles.find((p) => p.id === s.activeId)!
}

const mistake = (exerciseId: string) => ({
  exerciseId,
  kind: 'mcq',
  question: 'Q',
  expected: 'oui',
  given: 'non',
  wordIds: [],
})

beforeEach(() => {
  useLearner.setState({ profiles: [], activeId: null })
  store().createProfile('Тест', 'a0-a1')
})

describe('mistakes deck', () => {
  it('records a mistake', () => {
    store().addMistake(mistake('m1l1e1'))
    expect(me().mistakes).toHaveLength(1)
    expect(me().mistakes[0].exerciseId).toBe('m1l1e1')
  })

  it('keeps one entry per exercise, newest first', () => {
    store().addMistake(mistake('a'))
    store().addMistake(mistake('b'))
    store().addMistake({ ...mistake('a'), given: 'peut-être' })
    expect(me().mistakes).toHaveLength(2)
    expect(me().mistakes[0].exerciseId).toBe('a')
    expect(me().mistakes[0].given).toBe('peut-être')
  })

  it('clears the ones the learner has now got right', () => {
    // The bug this exists for: finishing the deck left the counter untouched,
    // because nothing outside the notebook's delete button ever resolved.
    store().addMistake(mistake('a'))
    store().addMistake(mistake('b'))
    store().resolveMistakesFor(['a'])
    expect(me().mistakes.map((m) => m.exerciseId)).toEqual(['b'])
  })

  it('empties the deck when everything was answered correctly', () => {
    store().addMistake(mistake('a'))
    store().addMistake(mistake('b'))
    store().resolveMistakesFor(['a', 'b'])
    expect(me().mistakes).toHaveLength(0)
  })

  it('keeps the ones still missed', () => {
    store().addMistake(mistake('a'))
    store().addMistake(mistake('b'))
    store().resolveMistakesFor([]) // got both wrong again
    expect(me().mistakes).toHaveLength(2)
  })

  it('resolves by exercise, so a mistake re-added mid-session still clears', () => {
    // The runner re-adds a mistake (with a fresh id) when it is missed again
    // during the very session meant to clear it. Matching on the old id would
    // silently miss.
    store().addMistake(mistake('a'))
    const staleId = me().mistakes[0].id
    store().addMistake(mistake('a')) // missed again → new id
    expect(me().mistakes[0].id).not.toBe(staleId)
    store().resolveMistakesFor(['a'])
    expect(me().mistakes).toHaveLength(0)
  })

  it('ignores an empty list rather than clearing everything', () => {
    store().addMistake(mistake('a'))
    store().resolveMistakesFor([])
    expect(me().mistakes).toHaveLength(1)
  })

  it('still supports deleting one by hand from the notebook', () => {
    store().addMistake(mistake('a'))
    store().resolveMistake(me().mistakes[0].id)
    expect(me().mistakes).toHaveLength(0)
  })
})

describe('the rest of progress actually persists', () => {
  it('records a finished lesson and keeps the best score', () => {
    store().completeLesson('m1l1', 60)
    store().completeLesson('m1l1', 90)
    store().completeLesson('m1l1', 70)
    expect(me().lessons.m1l1.completed).toBe(true)
    expect(me().lessons.m1l1.bestScore).toBe(90)
    expect(me().lessons.m1l1.attempts).toBe(3)
  })

  it('records quizzes and exams with their pass mark', () => {
    store().recordQuiz('m1', 90, 70)
    store().recordExam('a0-a1', 50, 70)
    expect(me().quizzes.m1.passed).toBe(true)
    expect(me().exams['a0-a1'].passed).toBe(false)
  })

  it('does not un-pass a test after a worse retry', () => {
    store().recordQuiz('m1', 90, 70)
    store().recordQuiz('m1', 30, 70)
    expect(me().quizzes.m1.passed).toBe(true)
    expect(me().quizzes.m1.bestScore).toBe(90)
  })

  it('marks stories, listening lessons and scenarios', () => {
    store().markStory('premier-jour')
    store().markVideo('journee-paris')
    store().recordScenario('rencontre', 80)
    expect(me().stories['premier-jour']).toBeTruthy()
    expect(me().videos['journee-paris']).toBeTruthy()
    expect(me().scenarios.rencontre.best).toBe(80)
  })

  it("keeps a scenario's best score, not its latest", () => {
    store().recordScenario('rencontre', 90)
    store().recordScenario('rencontre', 40)
    expect(me().scenarios.rencontre.best).toBe(90)
  })

  it("accumulates XP and the day's answer tally", () => {
    store().addXp(10, 2, 1)
    store().addXp(5, 1, 1)
    expect(me().xp).toBe(15)
    const today = Object.values(me().days)[0]
    expect(today).toMatchObject({ xp: 15, answered: 3, correct: 2 })
  })

  it('starts a streak on the first day of study', () => {
    store().addXp(5, 1, 1)
    expect(me().streakCurrent).toBe(1)
    expect(me().streakBest).toBe(1)
  })

  it('creates SRS cards once, without resetting an existing one', () => {
    store().ensureCards(['bonjour', 'merci'])
    store().reviewCard('bonjour', 'good')
    const after = me().srs.bonjour.reps
    store().ensureCards(['bonjour', 'merci', 'oui'])
    expect(Object.keys(me().srs)).toHaveLength(3)
    expect(me().srs.bonjour.reps).toBe(after)
  })

  it("keeps every profile's progress separate", () => {
    store().completeLesson('m1l1', 100)
    const first = store().activeId
    store().createProfile('Другий', 'a0-a1')
    expect(me().lessons.m1l1).toBeUndefined()
    store().switchProfile(first!)
    expect(me().lessons.m1l1.completed).toBe(true)
  })
})

describe('writing drafts', () => {
  it('saves a draft and reads it back', () => {
    store().saveWriting('lettre-formelle', 'Madame, Monsieur,')
    expect(me().writings['lettre-formelle'].text).toBe('Madame, Monsieur,')
    expect(me().writings['lettre-formelle'].done).toBe(false)
  })

  it('overwrites the draft as the learner keeps typing', () => {
    store().saveWriting('carte-postale', 'Chère')
    store().saveWriting('carte-postale', 'Chère Camille,')
    expect(me().writings['carte-postale'].text).toBe('Chère Camille,')
  })

  it('marks a task done when it is checked', () => {
    store().saveWriting('carte-postale', 'texte', true)
    expect(me().writings['carte-postale'].done).toBe(true)
  })

  it('does not un-finish a task just because the learner reread it', () => {
    store().saveWriting('carte-postale', 'texte', true)
    store().saveWriting('carte-postale', 'texte révisé')
    expect(me().writings['carte-postale'].done).toBe(true)
    expect(me().writings['carte-postale'].text).toBe('texte révisé')
  })

  it('keeps each task separate', () => {
    store().saveWriting('a', 'un')
    store().saveWriting('b', 'deux')
    expect(me().writings.a.text).toBe('un')
    expect(me().writings.b.text).toBe('deux')
  })
})

describe('restoring a backup', () => {
  /** An export taken before gender, writings and startModule existed. */
  const legacy = {
    id: 'p_old',
    name: 'Олена',
    emoji: '🦊',
    courseId: 'a1-a2',
    createdAt: '2025-01-01',
    xp: 340,
    streakCurrent: 3,
    streakBest: 9,
    days: { '2025-01-01': { xp: 40, answered: 12, correct: 10 } },
    lessons: { m1l1: { completed: true, bestScore: 90, attempts: 2, lastAt: '2025-01-01' } },
    quizzes: {},
    exams: {},
    stories: {},
    videos: {},
    scenarios: {},
    srs: {},
    savedWords: ['bonjour'],
    mistakes: [],
    notes: [],
    customWords: [],
    customVideos: [],
  }

  it('keeps everything the backup did contain', () => {
    store().importProfiles([legacy as never])
    expect(me().xp).toBe(340)
    expect(me().streakBest).toBe(9)
    expect(me().lessons.m1l1.bestScore).toBe(90)
    expect(me().savedWords).toEqual(['bonjour'])
    expect(me().courseId).toBe('a1-a2')
  })

  it('fills in fields that did not exist when it was taken', () => {
    // Without this, screens that read these without guarding crash on restore —
    // and this file is the only copy of a learner's progress there is.
    store().importProfiles([legacy as never])
    expect(me().gender).toBe('m')
    expect(me().writings).toEqual({})
    expect(me().startModule).toEqual({})
    expect(me().customVideos).toEqual([])
  })

  it('survives a profile with fields of the wrong shape', () => {
    store().importProfiles([
      { ...legacy, mistakes: null, srs: 'nonsense', xp: 'lots', days: [] } as never,
    ])
    expect(me().mistakes).toEqual([])
    expect(me().srs).toEqual({})
    expect(me().days).toEqual({})
    expect(me().xp).toBe(0)
  })

  it('drops entries that are not profiles at all', () => {
    const before = store().profiles.length
    store().importProfiles([null, 42, { name: 'no id' }, legacy] as never)
    expect(store().profiles).toHaveLength(1)
    expect(me().id).toBe('p_old')
    expect(before).toBeGreaterThan(0)
  })

  it('refuses to wipe the learner when the file has nothing usable', () => {
    store().completeLesson('m1l1', 100)
    store().importProfiles([{ junk: true }] as never)
    expect(me().lessons.m1l1.completed).toBe(true)
  })

  it('activates a profile that exists, so the app is never left blank', () => {
    store().importProfiles([legacy as never])
    expect(store().activeId).toBe('p_old')
    expect(me()).toBeDefined()
  })
})
