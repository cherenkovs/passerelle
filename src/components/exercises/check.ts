import type { Exercise } from '@/content'
import { gradeAnswer, normalize, pronunciationScore, type GradeStatus } from '@/lib/grade'

export type Outcome = {
  status: GradeStatus
  /** Canonical correct answer, shown in the feedback bar. */
  expected: string
  /** What the learner actually produced (for the mistakes log). */
  given: string
  /** Extra Ukrainian note produced by the grader (accents, typo…). */
  note?: string
}

/** Value shapes each exercise kind stores in the runner. */
export type AnswerValue = number | string | string[] | { mistakes: number } | null

export function isAnswered(ex: Exercise, value: AnswerValue): boolean {
  switch (ex.kind) {
    case 'mcq':
    case 'listen':
      return typeof value === 'number'
    case 'match':
      return typeof value === 'object' && value !== null && 'mistakes' in value
    case 'wordbank':
      return Array.isArray(value) && value.length > 0
    default:
      return typeof value === 'string' && value.trim().length > 0
  }
}

export function checkExercise(
  ex: Exercise,
  value: AnswerValue,
  opts: { strict?: boolean } = {},
): Outcome {
  switch (ex.kind) {
    case 'mcq':
    case 'listen': {
      const idx = value as number
      const given = ex.options[idx] ?? ''
      return {
        status: idx === ex.answer ? 'correct' : 'wrong',
        expected: ex.options[ex.answer],
        given,
      }
    }

    case 'match': {
      const mistakes = (value as { mistakes: number })?.mistakes ?? 0
      return {
        status: mistakes === 0 ? 'correct' : mistakes <= 1 ? 'almost' : 'wrong',
        expected: 'усі пари',
        given: `${mistakes} помилок`,
        note:
          mistakes === 1
            ? 'Одна хиба — але ти впорався. Ці пари повернуться в повторення.'
            : mistakes > 1
              ? 'Кілька пар переплуталися. Повторимо їх пізніше.'
              : undefined,
      }
    }

    case 'wordbank': {
      const chips = (value as string[]) ?? []
      const given = chips.join(' ')
      const res = gradeAnswer(given, [ex.answer], { strict: opts.strict })
      return { ...res, given }
    }

    case 'dictation': {
      const given = (value as string) ?? ''
      // Dictation is precisely the exercise where accents matter.
      const res = gradeAnswer(given, [ex.text], { requireAccents: true, strict: opts.strict })
      return { ...res, given }
    }

    case 'speak': {
      const heard = (value as string) ?? ''
      const score = pronunciationScore(heard, ex.text)
      return {
        status: score >= 0.82 ? 'correct' : score >= 0.6 ? 'almost' : 'wrong',
        expected: ex.text,
        given: heard,
        note:
          score >= 0.82
            ? undefined
            : score >= 0.6
              ? 'Майже — розпізнано більшість слів. Спробуй вимовити чіткіше.'
              : 'Розпізнано мало. Говори ближче до мікрофона й трохи повільніше.',
      }
    }

    case 'cloze': {
      const given = (value as string) ?? ''
      const res = gradeAnswer(given, ex.answer, { strict: opts.strict })
      return { ...res, given }
    }

    case 'type':
    case 'translate': {
      const given = (value as string) ?? ''
      const res = gradeAnswer(given, ex.answer, { strict: opts.strict })
      return { ...res, given }
    }
  }
}

/** Ukrainian summary line for the result screen. */
export function scoreVerdict(pct: number) {
  if (pct >= 95) return { title: 'Бездоганно!', note: 'Матеріал засвоєно повністю.' }
  if (pct >= 80) return { title: 'Чудова робота', note: 'Ще трохи практики — і буде ідеально.' }
  if (pct >= 60) return { title: 'Непогано', note: 'Основне зрозуміло, деталі варто повторити.' }
  if (pct >= 40) return { title: 'Є над чим попрацювати', note: 'Радимо пройти урок ще раз.' }
  return { title: 'Повторімо разом', note: 'Це нормально на початку. Пройди урок повторно.' }
}

export { normalize }
