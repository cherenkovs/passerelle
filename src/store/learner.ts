import { create, type StateCreator } from 'zustand'
import type { Gender } from '@/lib/agreement'
import { createCard, isDue, review, sortForSession, type Rating, type SrsCard } from '@/lib/srs'
import { daysBetween, todayKey, uid } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export type LessonRecord = {
  completed: boolean
  bestScore: number
  attempts: number
  lastAt: string
}

export type TestRecord = {
  bestScore: number
  passed: boolean
  attempts: number
  lastAt: string
}

export type DayRecord = { xp: number; answered: number; correct: number }

export type Mistake = {
  id: string
  exerciseId: string
  kind: string
  question: string
  expected: string
  given: string
  explain?: string
  wordIds: string[]
  at: string
  /** Cleared once the learner gets it right in a review. */
  resolved?: boolean
}

export type Note = {
  id: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

export type CustomWord = {
  id: string
  fr: string
  uk: string
  note?: string
  createdAt: string
}

export type CustomVideo = {
  id: string
  title: string
  youtubeId: string
  /** Raw lines "fr | uk" — parsed by the player. */
  transcript: { fr: string; uk: string }[]
  createdAt: string
}

export type Profile = {
  id: string
  name: string
  emoji: string
  courseId: string
  createdAt: string
  /**
   * Which forms French should use about the learner. Not an identity question —
   * a grammatical one: the app has to write either "allé" or "allée", and
   * guessing means telling half its users they are someone else.
   */
  gender: Gender

  xp: number
  streakCurrent: number
  streakBest: number
  lastStudyDay?: string

  days: Record<string, DayRecord>
  lessons: Record<string, LessonRecord>
  quizzes: Record<string, TestRecord>
  exams: Record<string, TestRecord>
  stories: Record<string, string>
  videos: Record<string, string>
  scenarios: Record<string, { best: number; at: string }>

  /**
   * Where the placement test said to start, per course. Earlier modules stay
   * open and browsable — this only lifts the lock, it never claims the learner
   * did lessons they didn't do.
   */
  startModule: Record<string, number>

  /**
   * Writing drafts, kept per task. Saved as the learner types: a half-written
   * letter that vanishes on refresh teaches only that the app can't be trusted.
   */
  writings: Record<string, { text: string; updatedAt: string; done: boolean }>

  srs: Record<string, SrsCard>
  savedWords: string[]
  mistakes: Mistake[]
  notes: Note[]
  customWords: CustomWord[]
  customVideos: CustomVideo[]
}

const AVATARS = ['🦊', '🐧', '🦉', '🐬', '🦋', '🌿', '⭐️', '🎈', '🥐', '🗼']

function emptyProfile(name: string, courseId: string): Profile {
  return {
    id: uid('p'),
    name: name.trim() || 'Учень',
    emoji: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    courseId,
    createdAt: new Date().toISOString(),
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
  }
}

/**
 * Fill in anything a profile is missing, and reject what isn't one.
 *
 * Used by both the persistence migration and by import, which is the point:
 * they used to be different code paths, and only one of them backfilled. An
 * export taken before `gender` or `writings` existed could therefore be
 * imported back into a newer build with those fields absent — and since several
 * screens read `profile.customVideos` or `profile.mistakes` without guarding,
 * restoring your own backup could white-screen the app.
 *
 * That matters more here than in most apps: there is no cloud sync by design,
 * so this JSON file is the only copy of a learner's progress there is.
 */
export function normalizeProfile(raw: unknown): Profile | null {
  if (!raw || typeof raw !== 'object') return null
  const p = raw as Partial<Profile>
  if (typeof p.id !== 'string' || !p.id) return null

  const base = emptyProfile(typeof p.name === 'string' ? p.name : 'Учень', p.courseId ?? 'a0-a1')
  const record = <T>(v: unknown, fallback: Record<string, T>) =>
    v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, T>) : fallback
  const list = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])

  return {
    ...base,
    ...p,
    id: p.id,
    name: base.name,
    emoji: typeof p.emoji === 'string' ? p.emoji : base.emoji,
    courseId: typeof p.courseId === 'string' ? p.courseId : base.courseId,
    createdAt: typeof p.createdAt === 'string' ? p.createdAt : base.createdAt,
    gender: p.gender === 'f' ? 'f' : 'm',
    xp: Number.isFinite(p.xp) ? Number(p.xp) : 0,
    streakCurrent: Number.isFinite(p.streakCurrent) ? Number(p.streakCurrent) : 0,
    streakBest: Number.isFinite(p.streakBest) ? Number(p.streakBest) : 0,
    days: record(p.days, {}),
    lessons: record(p.lessons, {}),
    quizzes: record(p.quizzes, {}),
    exams: record(p.exams, {}),
    stories: record(p.stories, {}),
    videos: record(p.videos, {}),
    scenarios: record(p.scenarios, {}),
    startModule: record(p.startModule, {}),
    writings: record(p.writings, {}),
    srs: record(p.srs, {}),
    savedWords: list(p.savedWords),
    mistakes: list(p.mistakes),
    notes: list(p.notes),
    customWords: list(p.customWords),
    customVideos: list(p.customVideos),
  }
}

/* ------------------------------------------------------------------ *
 * Store
 * ------------------------------------------------------------------ */

/** Bumped whenever a profile gains a field; stamped into exports too. */
export const LEARNER_VERSION = 4

type LearnerState = {
  profiles: Profile[]
  activeId: string | null

  // --- profiles
  createProfile: (name: string, courseId: string, gender?: Gender) => string
  switchProfile: (id: string) => void
  updateProfile: (patch: Partial<Pick<Profile, 'name' | 'emoji' | 'courseId' | 'gender'>>) => void
  /** Switch to a course and unlock everything up to the placed module. */
  applyPlacement: (courseId: string, moduleIndex: number) => void
  deleteProfile: (id: string) => void
  resetProgress: () => void

  // --- progress
  addXp: (amount: number, answered?: number, correct?: number) => void
  completeLesson: (lessonId: string, score: number) => void
  recordQuiz: (quizId: string, score: number, pass: number) => void
  recordExam: (examId: string, score: number, pass: number) => void
  markStory: (id: string) => void
  saveWriting: (taskId: string, text: string, done?: boolean) => void
  markVideo: (id: string) => void
  recordScenario: (id: string, score: number) => void

  // --- SRS
  ensureCards: (wordIds: readonly string[]) => void
  reviewCard: (wordId: string, rating: Rating) => void
  dueCardIds: () => string[]

  // --- notebook
  toggleSavedWord: (wordId: string) => void
  addMistake: (m: Omit<Mistake, 'id' | 'at'>) => void
  resolveMistake: (id: string) => void
  /** Clear the mistakes for exercises the learner has now got right. */
  resolveMistakesFor: (exerciseIds: readonly string[]) => void
  clearMistakes: () => void
  addNote: (title: string, body: string) => string
  updateNote: (id: string, patch: Partial<Pick<Note, 'title' | 'body'>>) => void
  deleteNote: (id: string) => void
  addCustomWord: (fr: string, uk: string, note?: string) => void
  deleteCustomWord: (id: string) => void
  addCustomVideo: (v: Omit<CustomVideo, 'id' | 'createdAt'>) => void
  deleteCustomVideo: (id: string) => void

  // --- data
  importProfiles: (profiles: Profile[]) => void
}

/** Mutate the active profile immutably. */
function patchActive(state: LearnerState, fn: (p: Profile) => Profile): Partial<LearnerState> {
  const { profiles, activeId } = state
  if (!activeId) return {}
  return { profiles: profiles.map((p) => (p.id === activeId ? fn(p) : p)) }
}

function bumpDay(p: Profile, xp: number, answered: number, correct: number): Profile {
  const key = todayKey()
  const day = p.days[key] ?? { xp: 0, answered: 0, correct: 0 }

  // Streak: consecutive calendar days with any activity.
  let streakCurrent = p.streakCurrent
  if (p.lastStudyDay !== key) {
    const gap = p.lastStudyDay ? daysBetween(p.lastStudyDay, key) : Infinity
    streakCurrent = gap === 1 ? p.streakCurrent + 1 : 1
  }

  return {
    ...p,
    xp: p.xp + xp,
    lastStudyDay: key,
    streakCurrent,
    streakBest: Math.max(p.streakBest, streakCurrent),
    days: {
      ...p.days,
      [key]: {
        xp: day.xp + xp,
        answered: day.answered + answered,
        correct: day.correct + correct,
      },
    },
  }
}

/**
 * The learner's data lives in their account, not in this browser.
 *
 * Nothing here is persisted locally: on load the profile is read from the
 * signed-in account, which is what makes one account on two devices mean one
 * set of progress rather than two that drift apart. Working offline still
 * works — Firestore keeps its own cache and replays writes on reconnect — but
 * this app no longer keeps a second copy of its own to fall out of step.
 */
export const useLearner = create<LearnerState>()(((set, get) => ({
  profiles: [],
  activeId: null,

  createProfile: (name, courseId, gender = 'm') => {
    const p = { ...emptyProfile(name, courseId), gender }
    set((s) => ({ profiles: [...s.profiles, p], activeId: p.id }))
    return p.id
  },

  switchProfile: (id) => set({ activeId: id }),

  updateProfile: (patch) => set((s) => patchActive(s, (p) => ({ ...p, ...patch }))),

  applyPlacement: (courseId, moduleIndex) =>
    set((s) =>
      patchActive(s, (p) => ({
        ...p,
        courseId,
        // Keep the furthest placement: retaking the test and doing worse on
        // a bad day shouldn't re-lock modules the learner already opened.
        startModule: {
          ...p.startModule,
          [courseId]: Math.max(p.startModule?.[courseId] ?? 0, moduleIndex),
        },
      })),
    ),

  deleteProfile: (id) =>
    set((s) => {
      const profiles = s.profiles.filter((p) => p.id !== id)
      return {
        profiles,
        activeId: s.activeId === id ? (profiles[0]?.id ?? null) : s.activeId,
      }
    }),

  resetProgress: () =>
    set((s) =>
      patchActive(s, (p) => ({
        ...emptyProfile(p.name, p.courseId),
        id: p.id,
        emoji: p.emoji,
        createdAt: p.createdAt,
      })),
    ),

  addXp: (amount, answered = 0, correct = 0) =>
    set((s) => patchActive(s, (p) => bumpDay(p, amount, answered, correct))),

  completeLesson: (lessonId, score) =>
    set((s) =>
      patchActive(s, (p) => {
        const prev = p.lessons[lessonId]
        return {
          ...p,
          lessons: {
            ...p.lessons,
            [lessonId]: {
              completed: true,
              bestScore: Math.max(prev?.bestScore ?? 0, score),
              attempts: (prev?.attempts ?? 0) + 1,
              lastAt: new Date().toISOString(),
            },
          },
        }
      }),
    ),

  recordQuiz: (quizId, score, pass) =>
    set((s) =>
      patchActive(s, (p) => {
        const prev = p.quizzes[quizId]
        return {
          ...p,
          quizzes: {
            ...p.quizzes,
            [quizId]: {
              bestScore: Math.max(prev?.bestScore ?? 0, score),
              passed: (prev?.passed ?? false) || score >= pass,
              attempts: (prev?.attempts ?? 0) + 1,
              lastAt: new Date().toISOString(),
            },
          },
        }
      }),
    ),

  recordExam: (examId, score, pass) =>
    set((s) =>
      patchActive(s, (p) => {
        const prev = p.exams[examId]
        return {
          ...p,
          exams: {
            ...p.exams,
            [examId]: {
              bestScore: Math.max(prev?.bestScore ?? 0, score),
              passed: (prev?.passed ?? false) || score >= pass,
              attempts: (prev?.attempts ?? 0) + 1,
              lastAt: new Date().toISOString(),
            },
          },
        }
      }),
    ),

  saveWriting: (taskId, text, done) =>
    set((s) =>
      patchActive(s, (p) => ({
        ...p,
        writings: {
          ...p.writings,
          [taskId]: {
            text,
            updatedAt: new Date().toISOString(),
            // Finishing is sticky: coming back to reread your own text
            // must not un-finish the task.
            done: done ?? p.writings?.[taskId]?.done ?? false,
          },
        },
      })),
    ),

  markStory: (id) =>
    set((s) =>
      patchActive(s, (p) => ({
        ...p,
        stories: { ...p.stories, [id]: new Date().toISOString() },
      })),
    ),

  markVideo: (id) =>
    set((s) =>
      patchActive(s, (p) => ({
        ...p,
        videos: { ...p.videos, [id]: new Date().toISOString() },
      })),
    ),

  recordScenario: (id, score) =>
    set((s) =>
      patchActive(s, (p) => ({
        ...p,
        scenarios: {
          ...p.scenarios,
          [id]: {
            best: Math.max(p.scenarios[id]?.best ?? 0, score),
            at: new Date().toISOString(),
          },
        },
      })),
    ),

  ensureCards: (wordIds) =>
    set((s) =>
      patchActive(s, (p) => {
        const srs = { ...p.srs }
        let changed = false
        for (const id of wordIds) {
          if (!srs[id]) {
            srs[id] = createCard(id)
            changed = true
          }
        }
        return changed ? { ...p, srs } : p
      }),
    ),

  reviewCard: (wordId, rating) =>
    set((s) =>
      patchActive(s, (p) => {
        const card = p.srs[wordId] ?? createCard(wordId)
        return { ...p, srs: { ...p.srs, [wordId]: review(card, rating) } }
      }),
    ),

  dueCardIds: () => {
    const p = get().profiles.find((x) => x.id === get().activeId)
    if (!p) return []
    const today = todayKey()
    return sortForSession(Object.values(p.srs).filter((c) => isDue(c, today))).map((c) => c.id)
  },

  toggleSavedWord: (wordId) =>
    set((s) =>
      patchActive(s, (p) => ({
        ...p,
        savedWords: p.savedWords.includes(wordId)
          ? p.savedWords.filter((w) => w !== wordId)
          : [...p.savedWords, wordId],
      })),
    ),

  addMistake: (m) =>
    set((s) =>
      patchActive(s, (p) => {
        // Keep one entry per exercise — the newest wins.
        const rest = p.mistakes.filter((x) => x.exerciseId !== m.exerciseId)
        const entry: Mistake = { ...m, id: uid('mk'), at: new Date().toISOString() }
        return { ...p, mistakes: [entry, ...rest].slice(0, 300) }
      }),
    ),

  resolveMistake: (id) =>
    set((s) => patchActive(s, (p) => ({ ...p, mistakes: p.mistakes.filter((m) => m.id !== id) }))),

  // Matched on exerciseId, not on the mistake's own id: the runner re-adds a
  // mistake (with a fresh id) whenever it is missed again during the very
  // session that is trying to clear it, so ids captured beforehand go stale.
  resolveMistakesFor: (exerciseIds) => {
    const done = new Set(exerciseIds)
    if (!done.size) return
    set((s) =>
      patchActive(s, (p) => ({
        ...p,
        mistakes: p.mistakes.filter((m) => !done.has(m.exerciseId)),
      })),
    )
  },

  clearMistakes: () => set((s) => patchActive(s, (p) => ({ ...p, mistakes: [] }))),

  addNote: (title, body) => {
    const id = uid('n')
    const now = new Date().toISOString()
    set((s) =>
      patchActive(s, (p) => ({
        ...p,
        notes: [{ id, title, body, createdAt: now, updatedAt: now }, ...p.notes],
      })),
    )
    return id
  },

  updateNote: (id, patch) =>
    set((s) =>
      patchActive(s, (p) => ({
        ...p,
        notes: p.notes.map((n) =>
          n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n,
        ),
      })),
    ),

  deleteNote: (id) =>
    set((s) => patchActive(s, (p) => ({ ...p, notes: p.notes.filter((n) => n.id !== id) }))),

  addCustomWord: (fr, uk, note) =>
    set((s) =>
      patchActive(s, (p) => ({
        ...p,
        customWords: [
          { id: uid('cw'), fr, uk, note, createdAt: new Date().toISOString() },
          ...p.customWords,
        ],
      })),
    ),

  deleteCustomWord: (id) =>
    set((s) =>
      patchActive(s, (p) => ({ ...p, customWords: p.customWords.filter((w) => w.id !== id) })),
    ),

  addCustomVideo: (v) =>
    set((s) =>
      patchActive(s, (p) => ({
        ...p,
        customVideos: [
          { ...v, id: uid('cv'), createdAt: new Date().toISOString() },
          ...p.customVideos,
        ],
      })),
    ),

  deleteCustomVideo: (id) =>
    set((s) =>
      patchActive(s, (p) => ({
        ...p,
        customVideos: p.customVideos.filter((v) => v.id !== id),
      })),
    ),

  importProfiles: (incoming) => {
    // Normalised, not trusted: a backup can predate half these fields.
    const profiles = (Array.isArray(incoming) ? incoming : [])
      .map(normalizeProfile)
      .filter((p): p is Profile => p !== null)
    if (!profiles.length) return
    set(() => ({ profiles, activeId: profiles[0].id }))
  },
})) as StateCreator<LearnerState>)

/* ------------------------------------------------------------------ *
 * Selectors
 * ------------------------------------------------------------------ */

export function useActiveProfile(): Profile | null {
  return useLearner((s) => s.profiles.find((p) => p.id === s.activeId) ?? null)
}

export function getActiveProfile(): Profile | null {
  const s = useLearner.getState()
  return s.profiles.find((p) => p.id === s.activeId) ?? null
}

/**
 * Which French forms to use about the learner. Selects the scalar rather than
 * the profile so a component re-renders only when the answer actually changes.
 */
export function useGender(): Gender {
  return useLearner((s) => s.profiles.find((p) => p.id === s.activeId)?.gender ?? 'm')
}

/** XP awarded per correct answer, with a small bonus for harder formats. */
export const XP_PER = {
  mcq: 4,
  listen: 5,
  match: 5,
  cloze: 6,
  type: 7,
  wordbank: 7,
  dictation: 9,
  translate: 9,
  speak: 8,
} as const

export function xpFor(kind: string) {
  return (XP_PER as Record<string, number>)[kind] ?? 5
}
