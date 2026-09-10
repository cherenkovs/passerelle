import type { Course, Lesson, Module } from '@/content'
import type { Profile } from '@/store/learner'

export type Chunk = { done: number; total: number; pct: number }

function chunk(done: number, total: number): Chunk {
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
}

export function lessonDone(profile: Profile | null, lessonId: string) {
  return Boolean(profile?.lessons[lessonId]?.completed)
}

export function moduleProgress(profile: Profile | null, module: Module): Chunk {
  const done = module.lessons.filter((l) => lessonDone(profile, l.id)).length
  return chunk(done, module.lessons.length)
}

export function moduleComplete(profile: Profile | null, module: Module) {
  return module.lessons.every((l) => lessonDone(profile, l.id))
}

export function quizPassed(profile: Profile | null, moduleId: string) {
  return Boolean(profile?.quizzes[moduleId]?.passed)
}

/** Where the placement test put this learner in this course, or the start. */
export function startModule(profile: Profile | null, course: Course) {
  return Math.min(profile?.startModule?.[course.id] ?? 0, course.modules.length - 1)
}

/**
 * Progress is measured from where the learner actually starts. Someone placed
 * at module 5 has a course of 13 modules ahead of them, and showing "0 / 68"
 * would make their first real lesson look like it moved nothing.
 */
export function courseProgress(profile: Profile | null, course: Course): Chunk {
  const lessons = course.modules.slice(startModule(profile, course)).flatMap((m) => m.lessons)
  const done = lessons.filter((l) => lessonDone(profile, l.id)).length
  return chunk(done, lessons.length)
}

/**
 * Unlocking is intentionally gentle: a module opens once the *previous* module's
 * lessons are finished — passing its quiz is encouraged, not required. Hard
 * gates make people quit; visible structure keeps them oriented.
 *
 * A placement result opens everything up to where it placed the learner. The
 * earlier modules stay available rather than being marked done, so anyone who
 * wants to check a foundation can go back and do it.
 */
export function moduleUnlocked(profile: Profile | null, course: Course, index: number) {
  if (index === 0) return true
  if (index <= startModule(profile, course)) return true
  const prev = course.modules[index - 1]
  return moduleComplete(profile, prev)
}

export function lessonUnlocked(
  profile: Profile | null,
  course: Course,
  moduleIndex: number,
  lessonIndex: number,
) {
  if (!moduleUnlocked(profile, course, moduleIndex)) return false
  if (lessonIndex === 0) return true
  const prev = course.modules[moduleIndex].lessons[lessonIndex - 1]
  return lessonDone(profile, prev.id)
}

export type NextUp =
  | { type: 'lesson'; lesson: Lesson; module: Module; moduleIndex: number; lessonIndex: number }
  | { type: 'quiz'; module: Module; moduleIndex: number }
  | { type: 'exam'; course: Course }
  | null

/** What the "continue" button should do right now. */
export function nextUp(profile: Profile | null, course: Course): NextUp {
  // Start looking from where the learner was placed — otherwise "continue"
  // would send someone placed at B1 back to the alphabet.
  for (let mi = startModule(profile, course); mi < course.modules.length; mi++) {
    const module = course.modules[mi]
    for (let li = 0; li < module.lessons.length; li++) {
      const lesson = module.lessons[li]
      if (!lessonDone(profile, lesson.id)) {
        return { type: 'lesson', lesson, module, moduleIndex: mi, lessonIndex: li }
      }
    }
    if (!quizPassed(profile, module.id)) {
      return { type: 'quiz', module, moduleIndex: mi }
    }
  }
  if (course.exam) return { type: 'exam', course }
  return null
}

/** Words the learner has actually met (they entered the SRS). */
export function wordsSeen(profile: Profile | null) {
  return profile ? Object.keys(profile.srs).length : 0
}

/** Cards considered "known": graduated out of learning with a real interval. */
export function wordsKnown(profile: Profile | null) {
  if (!profile) return 0
  return Object.values(profile.srs).filter((c) => c.interval >= 7).length
}

export function accuracy(profile: Profile | null) {
  if (!profile) return 0
  const days = Object.values(profile.days)
  const answered = days.reduce((n, d) => n + d.answered, 0)
  const correct = days.reduce((n, d) => n + d.correct, 0)
  return answered ? Math.round((correct / answered) * 100) : 0
}

/** Last `n` days as chart-ready rows, oldest first. */
export function activitySeries(profile: Profile | null, n = 30) {
  const out: { date: string; label: string; xp: number; answered: number }[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const rec = profile?.days[key]
    out.push({
      date: key,
      label: `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`,
      xp: rec?.xp ?? 0,
      answered: rec?.answered ?? 0,
    })
  }
  return out
}
