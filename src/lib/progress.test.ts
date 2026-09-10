import { describe, expect, it } from 'vitest'
import { COURSES, getCourse } from '@/content'
import type { Profile } from '@/store/learner'
import {
  courseProgress,
  lessonUnlocked,
  moduleComplete,
  moduleUnlocked,
  nextUp,
  startModule,
} from './progress'

/**
 * Locking and "what's next".
 *
 * The failure mode is a learner who is stuck or lost rather than an exception:
 * a module that never opens, or a "continue" button that sends someone placed
 * at B1 back to the alphabet.
 */

const course = getCourse('a2-b1')!

function learner(over: Partial<Profile> = {}): Profile {
  return {
    id: 'p',
    name: 'Тест',
    emoji: '🦊',
    courseId: course.id,
    createdAt: '2026-01-01',
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

/** Mark every lesson in the first `n` modules as done. */
function finished(n: number) {
  const lessons: Profile['lessons'] = {}
  for (const m of course.modules.slice(0, n)) {
    for (const l of m.lessons) {
      lessons[l.id] = { completed: true, bestScore: 100, attempts: 1, lastAt: '2026-01-01' }
    }
  }
  return learner({ lessons })
}

describe('locking', () => {
  it('opens the first module to everyone', () => {
    expect(moduleUnlocked(learner(), course, 0)).toBe(true)
  })

  it('keeps later modules shut until the one before is finished', () => {
    const fresh = learner()
    expect(moduleUnlocked(fresh, course, 1)).toBe(false)
    expect(moduleUnlocked(finished(1), course, 1)).toBe(true)
  })

  it('opens a module the moment its predecessor is complete, quiz or no quiz', () => {
    // Deliberate: hard gates make people quit (see the comment in progress.ts).
    const p = finished(1)
    expect(p.quizzes[course.modules[0].id]).toBeUndefined()
    expect(moduleUnlocked(p, course, 1)).toBe(true)
  })

  it('opens lessons one at a time inside a module', () => {
    const fresh = learner()
    expect(lessonUnlocked(fresh, course, 0, 0)).toBe(true)
    expect(lessonUnlocked(fresh, course, 0, 1)).toBe(false)
  })

  it('never opens a lesson in a locked module', () => {
    expect(lessonUnlocked(learner(), course, 3, 0)).toBe(false)
  })
})

describe('placement', () => {
  const placed = learner({ startModule: { [course.id]: 3 } })

  it('opens everything up to where the learner was placed', () => {
    for (let i = 0; i <= 3; i++) expect(moduleUnlocked(placed, course, i)).toBe(true)
  })

  it('does not open anything beyond it — that still has to be earned', () => {
    expect(moduleUnlocked(placed, course, 4)).toBe(false)
  })

  it('leaves the earlier modules browsable rather than marking them done', () => {
    // Honesty: the learner did not do those lessons, and the stats must not say
    // they did. Unlocked, not completed.
    expect(moduleComplete(placed, course.modules[0])).toBe(false)
    expect(lessonUnlocked(placed, course, 0, 0)).toBe(true)
  })

  it('counts progress from the placement, not from lesson one', () => {
    // "0 / 68" would make a placed learner's first real lesson look pointless.
    const all = courseProgress(learner(), course).total
    const from3 = courseProgress(placed, course).total
    expect(from3).toBeLessThan(all)
    expect(from3).toBe(course.modules.slice(3).reduce((n, m) => n + m.lessons.length, 0))
  })

  it('clamps a placement past the end of the course', () => {
    const silly = learner({ startModule: { [course.id]: 99 } })
    expect(startModule(silly, course)).toBe(course.modules.length - 1)
    expect(courseProgress(silly, course).total).toBeGreaterThan(0)
  })

  it('is per course — placing in one does not unlock another', () => {
    const other = getCourse('b1-b2')!
    expect(startModule(placed, other)).toBe(0)
    expect(moduleUnlocked(placed, other, 3)).toBe(false)
  })
})

describe('what to do next', () => {
  it('starts at the very first lesson for a new learner', () => {
    const next = nextUp(learner(), course)
    expect(next?.type).toBe('lesson')
    expect(next && 'lesson' in next && next.lesson.id).toBe(course.modules[0].lessons[0].id)
  })

  it('offers the module quiz once its lessons are done', () => {
    const next = nextUp(finished(1), course)
    expect(next?.type).toBe('quiz')
    expect(next && 'module' in next && next.module.id).toBe(course.modules[0].id)
  })

  it('does not send a placed learner back to the alphabet', () => {
    const placed = learner({ startModule: { [course.id]: 3 } })
    const next = nextUp(placed, course)
    expect(next && 'moduleIndex' in next && next.moduleIndex).toBe(3)
  })

  it('ends at the exam when everything is finished', () => {
    const done = learner({
      lessons: finished(course.modules.length).lessons,
      quizzes: Object.fromEntries(
        course.modules.map((m) => [
          m.id,
          { bestScore: 100, passed: true, attempts: 1, lastAt: '2026-01-01' },
        ]),
      ),
    })
    expect(nextUp(done, course)?.type).toBe('exam')
  })
})

describe('across every course', () => {
  it('a fresh learner can always start somewhere', () => {
    for (const c of COURSES.filter((x) => x.status === 'ready')) {
      expect(moduleUnlocked(learner(), c, 0), c.id).toBe(true)
      expect(nextUp(learner(), c), c.id).not.toBeNull()
    }
  })

  it('progress is zero at the start and whole at the end', () => {
    for (const c of COURSES.filter((x) => x.status === 'ready')) {
      expect(courseProgress(learner(), c).pct, c.id).toBe(0)
      const lessons: Profile['lessons'] = {}
      for (const m of c.modules)
        for (const l of m.lessons)
          lessons[l.id] = { completed: true, bestScore: 100, attempts: 1, lastAt: '2026-01-01' }
      expect(courseProgress(learner({ lessons }), c).pct, c.id).toBe(100)
    }
  })
})
