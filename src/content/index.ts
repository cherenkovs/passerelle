import { examA0A1, examA1A2, examA2B1, examB1B2 } from './exams'
import { module1, module2, module3, module4 } from './courses/a0a1-modules-1-4'
import { module5, module6, module7, module8 } from './courses/a0a1-modules-5-8'
import { module9, module10, module11, module12 } from './courses/a1a2'
import { module13, module14, module15 } from './courses/a2b1-modules-13-15'
import { module16, module17, module18 } from './courses/a2b1-modules-16-18'
import { module19, module20, module21 } from './courses/b1b2-modules-19-21'
import { module22, module23, module24 } from './courses/b1b2-modules-22-24'
import { STORIES } from './stories'
import type { Course, Exercise, Lesson, Module, Word } from './types'
import { VIDEOS } from './videos'
import { getWords } from './vocab'
import { shuffle } from '@/lib/utils'

export * from './types'
export { WORDS, getWord, getWords, wordsByTag } from './vocab'
export { STORIES, getStory } from './stories'
export { VIDEOS, getVideo } from './videos'
export { SCENARIOS, getScenario } from './tutor'

export const COURSES: Course[] = [
  {
    id: 'a0-a1',
    from: 'A0',
    to: 'A1',
    title: 'З нуля до A1',
    tagline: 'Перші кроки',
    description:
      'Повний старт: від звуків і алфавіту до вміння представитися, замовити каву й запитати дорогу. Ніяких попередніх знань не потрібно.',
    outcomes: [
      'Розумію й вимовляю носові голосні, R та німі закінчення',
      'Представляюся, розповідаю звідки я і ким працюю',
      'Рахую до 100, кажу котра година й скільки мені років',
      'Впевнено вживаю артиклі le/la/les та un/une/des',
      'Описую родину та своє житло',
      'Відмінюю дієслова на -er і ставлю запитання трьома способами',
      'Замовляю в кафе й прошу рахунок',
      'Питаю дорогу та розумію напрямок',
    ],
    status: 'ready',
    modules: [module1, module2, module3, module4, module5, module6, module7, module8],
    exam: examA0A1,
  },
  {
    id: 'a1-a2',
    from: 'A1',
    to: 'A2',
    title: 'Від A1 до A2',
    tagline: 'Минуле, опис, побут',
    description:
      'Наступний крок: розповідати про минуле, описувати й порівнювати, робити покупки та звертатися до лікаря.',
    outcomes: [
      'Розповідаю про минулі події у passé composé',
      'Знаю, коли дієслово бере être, а коли avoir',
      'Узгоджую прикметники й порівнюю (plus / moins / aussi… que)',
      'Роблю покупки, питаю ціну та вживаю ce/cette/ces',
      'Описую самопочуття та розумію поради лікаря',
    ],
    status: 'ready',
    modules: [module9, module10, module11, module12],
    exam: examA1A2,
  },
  {
    id: 'a2-b1',
    from: 'A2',
    to: 'B1',
    title: 'Від A2 до B1',
    tagline: 'Впевнена розмова',
    description:
      'Імперфект проти passé composé, майбутній час, умовний спосіб, відносні займенники — і перші справжні тексти без адаптації.',
    outcomes: [
      'Розрізняю imparfait і passé composé, спираючись на український вид дієслова',
      'Розповідаю про минуле зв’язно, з plus-que-parfait',
      'Замінюю повтори займенниками: le/la/les, lui/leur, y, en',
      'Будую складні речення з qui / que / où / dont',
      'Говорю про майбутнє й гіпотези: futur simple, conditionnel, три типи si',
      'Вживаю subjonctif після il faut que, je veux que, bien que',
      'Переказую чужі слова в непрямій мові',
      'Читаю новини та розумію пасивні конструкції',
    ],
    status: 'ready',
    modules: [module13, module14, module15, module16, module17, module18],
    exam: examA2B1,
  },
  {
    id: 'b1-b2',
    from: 'B1',
    to: 'B2',
    title: 'Від B1 до B2',
    tagline: 'Вільне володіння',
    description:
      'Регістри й жива мова, складні відносні займенники, поступка й докір, письмо та ідіоми — рівень, з якого починається робота й навчання французькою.',
    outcomes: [
      'Розрізняю три регістри й обираю доречний',
      'Розбираю скорочення живої мови: «j’sais pas», «t’as vu», «y a pas»',
      'Пом’якшую відмову й незгоду так, як це роблять французи',
      'Будую довгі речення з lequel, auquel, ce qui / ce que / ce dont',
      'Виражаю поступку: avoir beau, quoique, quel que soit',
      'Говорю про жаль і докір у conditionnel passé',
      'Пишу діловий лист і структуроване есе',
      'Упізнаю passé simple у літературі й розумію мову новин',
    ],
    status: 'ready',
    modules: [module19, module20, module21, module22, module23, module24],
    exam: examB1B2,
  },
]

/* ------------------------------------------------------------------ *
 * Lookups
 * ------------------------------------------------------------------ */

export function getCourse(id: string) {
  return COURSES.find((c) => c.id === id)
}

export const ALL_MODULES: Module[] = COURSES.flatMap((c) => c.modules)

export function getModule(id: string) {
  return ALL_MODULES.find((m) => m.id === id)
}

export function getLesson(id: string): Lesson | undefined {
  for (const m of ALL_MODULES) {
    const l = m.lessons.find((x) => x.id === id)
    if (l) return l
  }
  return undefined
}

export function moduleOfLesson(lessonId: string): Module | undefined {
  return ALL_MODULES.find((m) => m.lessons.some((l) => l.id === lessonId))
}

export function courseOfModule(moduleId: string): Course | undefined {
  return COURSES.find((c) => c.modules.some((m) => m.id === moduleId))
}

/** Flat ordered list of lesson ids for a course — drives "continue" and locking. */
export function lessonSequence(courseId: string): string[] {
  const course = getCourse(courseId)
  if (!course) return []
  return course.modules.flatMap((m) => m.lessons.map((l) => l.id))
}

export function allLessonIds(): string[] {
  return ALL_MODULES.flatMap((m) => m.lessons.map((l) => l.id))
}

export function countExercises(courseId: string) {
  const course = getCourse(courseId)
  if (!course) return 0
  return course.modules.reduce(
    (sum, m) => sum + m.quiz.length + m.lessons.reduce((s, l) => s + l.exercises.length, 0),
    0,
  )
}

export function courseWordIds(courseId: string): string[] {
  const course = getCourse(courseId)
  if (!course) return []
  const set = new Set<string>()
  for (const m of course.modules) for (const l of m.lessons) for (const w of l.newWords) set.add(w)
  return [...set]
}

/** Every authored exercise in the app, indexed by id — used to replay mistakes. */
const exerciseIndex: Map<string, Exercise> = (() => {
  const map = new Map<string, Exercise>()
  const add = (list: readonly Exercise[]) => list.forEach((e) => map.set(e.id, e))

  for (const m of ALL_MODULES) {
    add(m.quiz)
    for (const l of m.lessons) add(l.exercises)
  }
  for (const c of COURSES) {
    if (c.exam) for (const s of c.exam.sections) add(s.exercises)
  }
  for (const s of STORIES) add(s.questions)
  for (const v of VIDEOS) add(v.exercises)
  return map
})()

export function findExercise(id: string) {
  return exerciseIndex.get(id)
}

export function findExercises(ids: readonly string[]): Exercise[] {
  return ids.map((id) => exerciseIndex.get(id)).filter((e): e is Exercise => Boolean(e))
}

/* ------------------------------------------------------------------ *
 * On-the-fly exercise generation
 *
 * Authored exercises teach; generated ones drill. Any set of words can be
 * turned into recall practice, which is what powers the review sessions and
 * the "practise my mistakes" deck without needing hand-written items for
 * every single word.
 * ------------------------------------------------------------------ */

function decoys(word: Word, pool: Word[], n: number): string[] {
  const sameKind = pool.filter((w) => w.id !== word.id && w.pos === word.pos)
  const chosen = shuffle(sameKind.length >= n ? sameKind : pool.filter((w) => w.id !== word.id))
  return chosen.slice(0, n).map((w) => w.uk)
}

export function generateVocabExercises(wordIds: readonly string[], pool: Word[]): Exercise[] {
  const words = getWords(wordIds)
  const out: Exercise[] = []

  words.forEach((word, i) => {
    // Alternate recognition and recall so a session never feels like one drill.
    if (i % 2 === 0) {
      const wrong = decoys(word, pool, 3)
      if (wrong.length < 3) return
      const options = shuffle([word.uk, ...wrong])
      out.push({
        id: `gen_mcq_${word.id}`,
        kind: 'mcq',
        prompt: 'Що означає це слово?',
        question: word.fr,
        speak: word.fr,
        options,
        answer: options.indexOf(word.uk),
        explain: word.note ?? word.example?.fr,
        words: [word.id],
      })
    } else {
      out.push({
        id: `gen_type_${word.id}`,
        kind: 'type',
        prompt: 'Напиши французькою',
        question: word.uk,
        answer: [word.fr],
        accents: true,
        hint: word.ipa ? `[${word.ipa}]` : undefined,
        explain: word.note ?? word.example?.fr,
        words: [word.id],
      })
    }
  })

  return out
}

/** A "listen and choose" drill built from any word list. */
export function generateListeningExercises(wordIds: readonly string[], pool: Word[]): Exercise[] {
  const words = getWords(wordIds)
  return words
    .map((word) => {
      const wrong = decoys(word, pool, 2)
      if (wrong.length < 2) return null
      const options = shuffle([word.uk, ...wrong])
      return {
        id: `gen_listen_${word.id}`,
        kind: 'listen' as const,
        prompt: 'Послухай і обери переклад',
        audioText: word.fr,
        options,
        answer: options.indexOf(word.uk),
        words: [word.id],
      }
    })
    .filter((e): e is Exclude<typeof e, null> => e !== null)
}
