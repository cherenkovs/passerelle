/**
 * Content model.
 *
 * Everything a learner sees is declarative data — no lesson logic lives in a
 * component. Adding a lesson means adding an object; the player, the quiz
 * engine and the SRS scheduler all read from these shapes.
 */

export type CEFR = 'A0' | 'A1' | 'A2' | 'B1' | 'B2'

export type PartOfSpeech =
  | 'n' // іменник
  | 'v' // дієслово
  | 'adj' // прикметник
  | 'adv' // прислівник
  | 'prep' // прийменник
  | 'pron' // займенник
  | 'conj' // сполучник
  | 'num' // числівник
  | 'phrase' // стала фраза
  | 'interj' // вигук

export type Word = {
  id: string
  /** Head form as a learner should store it — nouns include their article. */
  fr: string
  /** Ukrainian translation. Multiple senses separated by ", ". */
  uk: string
  ipa?: string
  pos?: PartOfSpeech
  /** 'mf' = спільного роду або має обидві форми (l'élève, un ami / une amie). */
  gender?: 'm' | 'f' | 'mf'
  plural?: string
  example?: { fr: string; uk: string }
  /** Ukrainian-specific warning: gender mismatch, false friend, silent ending… */
  note?: string
  tags?: string[]
  level: CEFR
  /**
   * Approximate position in the ~1000 most frequent French lemmas.
   * Corpora disagree on exact positions, so treat this as a band indicator
   * ("roughly the first hundred") rather than an exact ranking.
   */
  rank?: number
}

/** Frequency bands used to filter the dictionary and plan study order. */
export const FREQUENCY_BANDS = [
  { id: 'top100', label: 'Топ-100', from: 1, to: 100, coverage: '~50 % тексту' },
  { id: 'top250', label: '101–250', from: 101, to: 250, coverage: '~60 %' },
  { id: 'top500', label: '251–500', from: 251, to: 500, coverage: '~70 %' },
  { id: 'top750', label: '501–750', from: 501, to: 750, coverage: '~76 %' },
  { id: 'top1000', label: '751–1000', from: 751, to: 1000, coverage: '~80 %' },
] as const

/* ------------------------------------------------------------------ *
 * Exercises
 * ------------------------------------------------------------------ */

type ExerciseBase = {
  id: string
  /** Ukrainian instruction shown above the task. */
  prompt?: string
  /** Ukrainian explanation revealed after answering. */
  explain?: string
  /** Word ids this exercise practises — used to route mistakes into the SRS. */
  words?: string[]
}

/** Multiple choice — the gentle first encounter. */
export type McqExercise = ExerciseBase & {
  kind: 'mcq'
  question: string
  /** Read this aloud instead of the question text, if set. */
  speak?: string
  options: string[]
  answer: number
  /** Options are French and should be clickable-to-hear. */
  optionsAreFrench?: boolean
}

/** Free typing — active recall, the highest-value drill. */
export type TypeExercise = ExerciseBase & {
  kind: 'type'
  question: string
  answer: string[]
  hint?: string
  speak?: string
  /** Show the French keyboard helper (é è ê à ç ù î ô œ). */
  accents?: boolean
}

/** Fill the gap. `sentence` uses "___" as the blank. */
export type ClozeExercise = ExerciseBase & {
  kind: 'cloze'
  sentence: string
  answer: string[]
  translation: string
  /** When present the learner picks a chip instead of typing. */
  options?: string[]
  hint?: string
}

/** Match French ↔ Ukrainian pairs. */
export type MatchExercise = ExerciseBase & {
  kind: 'match'
  pairs: { fr: string; uk: string }[]
}

/** Listen to French, then choose the meaning. */
export type ListenExercise = ExerciseBase & {
  kind: 'listen'
  audioText: string
  options: string[]
  answer: number
}

/** Dictation — the only honest test of silent endings. */
export type DictationExercise = ExerciseBase & {
  kind: 'dictation'
  text: string
  translation: string
}

/** Build a sentence from word chips. */
export type WordBankExercise = ExerciseBase & {
  kind: 'wordbank'
  question: string
  answer: string
  /** Extra decoy chips beyond the answer's own words. */
  distractors?: string[]
}

/** Say it out loud; speech recognition scores it. */
export type SpeakExercise = ExerciseBase & {
  kind: 'speak'
  text: string
  translation: string
}

/** Ukrainian → French production. The hardest and most valuable type. */
export type TranslateExercise = ExerciseBase & {
  kind: 'translate'
  question: string
  answer: string[]
  hint?: string
}

export type Exercise =
  | McqExercise
  | TypeExercise
  | ClozeExercise
  | MatchExercise
  | ListenExercise
  | DictationExercise
  | WordBankExercise
  | SpeakExercise
  | TranslateExercise

export type ExerciseKind = Exercise['kind']

/* ------------------------------------------------------------------ *
 * Lessons
 * ------------------------------------------------------------------ */

export type GrammarTable = {
  caption?: string
  head: string[]
  rows: string[][]
}

export type LessonStep =
  | { kind: 'intro'; title: string; body: string }
  | { kind: 'vocab'; title: string; words: string[] }
  | {
      kind: 'grammar'
      title: string
      body: string
      table?: GrammarTable
      /** The Ukrainian-learner trap this rule usually causes. */
      warning?: string
      examples?: { fr: string; uk: string }[]
    }
  | {
      kind: 'dialogue'
      title: string
      setting: string
      lines: { speaker: string; fr: string; uk: string }[]
    }
  | {
      kind: 'pronunciation'
      title: string
      body: string
      pairs: { fr: string; ipa: string; uk: string }[]
    }

export type Lesson = {
  id: string
  title: string
  subtitle?: string
  minutes: number
  /** Word ids introduced here — they enter the SRS on completion. */
  newWords: string[]
  steps: LessonStep[]
  exercises: Exercise[]
}

export type Module = {
  id: string
  title: string
  subtitle: string
  /** One-line Ukrainian statement of the grammar payload. */
  grammarFocus: string
  emoji: string
  lessons: Lesson[]
  /** Module test — unlocked once every lesson is done. */
  quiz: Exercise[]
}

export type ExamSection = {
  title: string
  description: string
  exercises: Exercise[]
}

export type Exam = {
  id: string
  title: string
  /** Percentage needed to pass. */
  passScore: number
  minutes: number
  sections: ExamSection[]
}

export type CourseStatus = 'ready' | 'preview' | 'planned'

export type Course = {
  id: string
  from: CEFR
  to: CEFR
  title: string
  tagline: string
  description: string
  /** What the learner will be able to do — CEFR "can do" statements, in UA. */
  outcomes: string[]
  status: CourseStatus
  modules: Module[]
  exam?: Exam
}

/* ------------------------------------------------------------------ *
 * Reading & listening library
 * ------------------------------------------------------------------ */

export type Story = {
  id: string
  title: string
  titleUk: string
  level: CEFR
  minutes: number
  /** Where the text comes from — original, or a public-domain source. */
  source: string
  emoji: string
  blurb: string
  paragraphs: { fr: string; uk: string }[]
  /** Words worth pre-teaching; shown in a side panel. */
  glossary: { fr: string; uk: string }[]
  questions: Exercise[]
}

export type VideoLesson = {
  id: string
  title: string
  titleUk: string
  level: CEFR
  emoji: string
  minutes: number
  blurb: string
  /** When set, the YouTube player is embedded (privacy-enhanced domain). */
  youtubeId?: string
  /** Otherwise the transcript is voiced by the built-in synthesiser. */
  transcript: { t: number; fr: string; uk: string }[]
  vocab: string[]
  exercises: Exercise[]
}

/* ------------------------------------------------------------------ *
 * Conversation practice
 * ------------------------------------------------------------------ */

export type TutorTurn = {
  id: string
  /** What the teacher says. */
  teacher: { fr: string; uk: string }
  /**
   * What the learner is expected to reply. `acceptPrefixes` marks an open
   * formula — «Je m'appelle …» is correct whatever name the learner gives.
   */
  expected: { fr: string; uk: string; accept: string[]; acceptPrefixes?: string[] }
  /** Ukrainian nudge available on demand. */
  hint?: string
}

export type TutorScenario = {
  id: string
  title: string
  level: CEFR
  emoji: string
  setting: string
  goal: string
  turns: TutorTurn[]
}
