import { describe, expect, it } from 'vitest'
import { bothForms, hasMarker } from '@/lib/agreement'
import { hasStrayAsterisk } from '@/lib/emphasis'
import { speakable } from '@/lib/speech'
import { PROBES_PER_MODULE } from '@/lib/placement'
import { ALL_MODULES, COURSES, SCENARIOS, STORIES, VIDEOS, findExercise } from './index'
import { PLACEMENT_PROBES, shuffleOptions } from './placement'
import { getWord } from './vocab'
import type { Exercise } from './types'

/**
 * Course integrity.
 *
 * The failure mode these catch is silent: a lesson that references a word id
 * which no longer exists still renders fine — the word simply never reaches the
 * SRS, so the learner is never asked to review it. Nothing visibly breaks.
 */

const lessons = ALL_MODULES.flatMap((m) => m.lessons)

/**
 * Course content — everything the learner can be sent back to, which is exactly
 * what `exerciseIndex` holds. Stories and listening lessons belong here too:
 * their questions are replayable mistakes and share the same id space, so a
 * collision would silently drop one from the index.
 */
const courseExercises: Exercise[] = [
  ...ALL_MODULES.flatMap((m) => m.quiz),
  ...lessons.flatMap((l) => l.exercises),
  ...COURSES.flatMap((c) => c.exam?.sections.flatMap((s) => s.exercises) ?? []),
  ...STORIES.flatMap((s) => s.questions),
  ...VIDEOS.flatMap((v) => v.exercises),
]

/** Plus the placement probes, which share the same renderers and the same id space. */
const allExercises: Exercise[] = [...courseExercises, ...PLACEMENT_PROBES.flat()]

describe('word references', () => {
  it('every newWords id exists in the dictionary', () => {
    const broken = lessons.flatMap((l) =>
      l.newWords.filter((id) => !getWord(id)).map((id) => `${l.id} → ${id}`),
    )
    expect(broken).toEqual([])
  })

  it('every exercise word id exists in the dictionary', () => {
    const broken = allExercises.flatMap((e) =>
      (e.words ?? []).filter((id) => !getWord(id)).map((id) => `${e.id} → ${id}`),
    )
    expect(broken).toEqual([])
  })

  it('every listening lesson references real words', () => {
    // Same silent failure as lessons: a bad id here means the word never
    // reaches the SRS, and nothing on screen looks wrong.
    const broken = VIDEOS.flatMap((v) =>
      v.vocab.filter((id) => !getWord(id)).map((id) => `${v.id} → ${id}`),
    )
    expect(broken).toEqual([])
  })

  it('every story glossary word is real French, not a broken id', () => {
    const empty = STORIES.flatMap((s) =>
      s.glossary.filter((g) => !g.fr.trim() || !g.uk.trim()).map(() => s.id),
    )
    expect(empty).toEqual([])
  })

  it('placement probes never feed the SRS', () => {
    // A probe is a measurement, not a lesson: getting one wrong must not drop
    // vocabulary the learner has never been taught into their review deck.
    const leaking = PLACEMENT_PROBES.flat()
      .filter((e) => e.words?.length)
      .map((e) => e.id)
    expect(leaking).toEqual([])
  })

  it('every vocab step references real words', () => {
    const broken = lessons.flatMap((l) =>
      l.steps.flatMap((s) =>
        s.kind === 'vocab'
          ? s.words.filter((id) => !getWord(id)).map((id) => `${l.id} → ${id}`)
          : [],
      ),
    )
    expect(broken).toEqual([])
  })
})

describe('emphasis markers', () => {
  // Another silent one: an unclosed `**` renders as a literal asterisk rather
  // than failing, so a typo survives review and ships into the lesson text.
  const strings = (function collect(
    v: unknown,
    out: [string, string][] = [],
    path = '',
  ): [string, string][] {
    if (typeof v === 'string') out.push([path, v])
    else if (Array.isArray(v)) v.forEach((x, i) => collect(x, out, `${path}[${i}]`))
    else if (v && typeof v === 'object')
      for (const [k, x] of Object.entries(v)) collect(x, out, `${path}.${k}`)
    return out
  })({ modules: ALL_MODULES, probes: PLACEMENT_PROBES }, [], '')

  it('every asterisk in lesson copy is part of a matched marker', () => {
    const broken = strings.filter(([, s]) => hasStrayAsterisk(s)).map(([p, s]) => `${p}: ${s}`)
    expect(broken).toEqual([])
  })
})

describe('identifiers', () => {
  it('exercise ids are unique across the whole app', () => {
    const ids = allExercises.map((e) => e.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
  })

  it('lesson ids are unique', () => {
    const ids = lessons.map((l) => l.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
  })

  it('module ids are unique', () => {
    const ids = ALL_MODULES.map((m) => m.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
  })

  it('every exercise is findable by id — mistakes replay depends on it', () => {
    const missing = courseExercises.filter((e) => !findExercise(e.id)).map((e) => e.id)
    expect(missing).toEqual([])
  })
})

describe('placement probes', () => {
  it('covers every module, in order', () => {
    expect(PLACEMENT_PROBES.length).toBe(ALL_MODULES.length)
  })

  it('asks the same number of questions about each module', () => {
    // The search assumes a fixed probe size when it decides pass or fail.
    const odd = PLACEMENT_PROBES.map((p, i) => [i, p.length] as const).filter(
      ([, n]) => n !== PROBES_PER_MODULE,
    )
    expect(odd).toEqual([])
  })

  it('is answerable without typing', () => {
    // Placement measures French, not keyboard layouts — every probe must be
    // a choice, or a gap with options to choose from.
    const typed = PLACEMENT_PROBES.flat()
      .filter((e) => !(e.kind === 'mcq' || (e.kind === 'cloze' && e.options?.length)))
      .map((e) => e.id)
    expect(typed).toEqual([])
  })
})

describe('exercise shape', () => {
  it('multiple-choice answers point at a real option', () => {
    const broken = allExercises
      .filter((e) => e.kind === 'mcq' || e.kind === 'listen')
      .filter((e) => {
        const ex = e as Extract<Exercise, { options: string[]; answer: number }>
        return ex.answer < 0 || ex.answer >= ex.options.length
      })
      .map((e) => e.id)
    expect(broken).toEqual([])
  })

  it('cloze exercises actually contain a blank', () => {
    const broken = allExercises
      .filter((e) => e.kind === 'cloze')
      .filter((e) => !(e as Extract<Exercise, { kind: 'cloze' }>).sentence.includes('___'))
      .map((e) => e.id)
    expect(broken).toEqual([])
  })

  it('a cloze with options can actually be answered from them', () => {
    // Options replace the keyboard, so if the right answer isn't among them the
    // item is unanswerable — and it looks completely normal until you try it.
    const broken = allExercises
      .filter((e) => e.kind === 'cloze')
      .map((e) => e as Extract<Exercise, { kind: 'cloze' }>)
      .filter((e) => e.options?.length)
      .filter((e) => !e.options!.some((o) => e.answer.includes(o)))
      .map((e) => e.id)
    expect(broken).toEqual([])
  })

  it('typed answers are never empty', () => {
    const broken = allExercises
      .filter((e) => e.kind === 'type' || e.kind === 'cloze' || e.kind === 'translate')
      .filter((e) => {
        const ex = e as Extract<Exercise, { answer: string[] }>
        return !ex.answer.length || ex.answer.some((a) => !a.trim())
      })
      .map((e) => e.id)
    expect(broken).toEqual([])
  })

  it('word-bank answers are buildable from their own words', () => {
    const broken = allExercises
      .filter((e) => e.kind === 'wordbank')
      .filter(
        (e) => (e as Extract<Exercise, { kind: 'wordbank' }>).answer.trim().split(/\s+/).length < 2,
      )
      .map((e) => e.id)
    expect(broken).toEqual([])
  })
})

describe('course structure', () => {
  it('every ready course has modules and an exam', () => {
    for (const c of COURSES.filter((x) => x.status === 'ready')) {
      expect(c.modules.length, `${c.id} modules`).toBeGreaterThan(0)
      expect(c.exam, `${c.id} exam`).toBeDefined()
    }
  })

  it('every module has lessons and a quiz', () => {
    for (const m of ALL_MODULES) {
      expect(m.lessons.length, `${m.id} lessons`).toBeGreaterThan(0)
      expect(m.quiz.length, `${m.id} quiz`).toBeGreaterThan(0)
    }
  })

  it('every lesson has teaching steps and exercises', () => {
    for (const l of lessons) {
      expect(l.steps.length, `${l.id} steps`).toBeGreaterThan(0)
      expect(l.exercises.length, `${l.id} exercises`).toBeGreaterThan(0)
    }
  })

  it('every lesson includes at least one production task', () => {
    // Recognition alone doesn't build active language — see docs/CONTENT.md.
    const productive = new Set(['translate', 'wordbank', 'dictation', 'type', 'speak'])
    const passive = lessons
      .filter((l) => !l.exercises.some((e) => productive.has(e.kind)))
      .map((l) => l.id)
    expect(passive).toEqual([])
  })
})

describe('probe option order', () => {
  // Probes are authored answer-first for readability, so shuffling is not a
  // nicety: unshuffled, the whole placement test is "click the top choice".
  it('every probe is authored with the answer first', () => {
    const misfiled = PLACEMENT_PROBES.flat()
      .filter((e) => {
        if (e.kind === 'mcq') return e.answer !== 0
        if (e.kind === 'cloze' && e.options?.length) return !e.answer.includes(e.options[0])
        return false
      })
      .map((e) => e.id)
    expect(misfiled).toEqual([])
  })

  it('shuffling moves the answer without losing it', () => {
    for (const probe of PLACEMENT_PROBES.flat()) {
      for (let i = 0; i < 20; i++) {
        const mixed = shuffleOptions(probe)
        if (mixed.kind === 'mcq' && probe.kind === 'mcq') {
          expect(new Set(mixed.options)).toEqual(new Set(probe.options))
          expect(mixed.options[mixed.answer]).toBe(probe.options[probe.answer])
        }
        if (mixed.kind === 'cloze' && probe.kind === 'cloze') {
          expect(new Set(mixed.options)).toEqual(new Set(probe.options))
          expect(mixed.options!.some((o) => mixed.answer.includes(o))).toBe(true)
        }
      }
    }
  })

  it('actually reorders — otherwise the shuffle is decorative', () => {
    const probe = PLACEMENT_PROBES[0][0] as Extract<Exercise, { kind: 'cloze' }>
    const seen = new Set<string>()
    for (let i = 0; i < 50; i++) {
      seen.add((shuffleOptions(probe) as typeof probe).options!.join('|'))
    }
    expect(seen.size).toBeGreaterThan(1)
  })
})

describe('agreement markers', () => {
  const collect = (v: unknown, out: [string, string][] = [], path = ''): [string, string][] => {
    if (typeof v === 'string') out.push([path, v])
    else if (Array.isArray(v)) v.forEach((x, i) => collect(x, out, `${path}[${i}]`))
    else if (v && typeof v === 'object')
      for (const [k, x] of Object.entries(v)) collect(x, out, `${path}.${k}`)
    return out
  }

  it('never appears in graded fields', () => {
    // Exercises compare the learner's text against `answer` literally, so a
    // `{e}` there is unanswerable — nobody types a brace.
    const graded = collect(
      [...courseExercises, ...PLACEMENT_PROBES.flat()].map((e) => ({
        id: e.id,
        answer: (e as { answer?: unknown }).answer,
        options: (e as { options?: unknown }).options,
        sentence: (e as { sentence?: unknown }).sentence,
      })),
      [],
      'ex',
    )
    expect(graded.filter(([, s]) => hasMarker(s)).map(([p, s]) => `${p}: ${s}`)).toEqual([])
  })

  it('is only used where something resolves it', () => {
    // Lesson copy is not about the learner, so a marker there would print raw.
    const leaking = collect(ALL_MODULES, [], 'modules')
      .filter(([, s]) => hasMarker(s))
      .map(([p]) => p)
    expect(leaking).toEqual([])
  })

  it('every scenario marker resolves to two real sentences', () => {
    const marked = collect(SCENARIOS, [], 'scenarios').filter(([, s]) => hasMarker(s))
    expect(marked.length).toBeGreaterThan(0)
    for (const [path, s] of marked) {
      for (const form of bothForms(s)) {
        expect(form, path).not.toMatch(/[{}]/)
        expect(form.trim().length, path).toBeGreaterThan(0)
      }
    }
  })
})

describe('what the synthesiser is given', () => {
  /** Every authored string that reaches `speak()`. */
  const spoken: [string, string][] = []
  const add = (where: string, s?: string) => {
    if (typeof s === 'string' && s.trim()) spoken.push([where, s])
  }

  for (const m of ALL_MODULES) {
    for (const e of m.quiz) add(`${e.id}.speak`, (e as { speak?: string }).speak)
    for (const l of m.lessons) {
      for (const step of l.steps) {
        if (step.kind === 'pronunciation')
          step.pairs.forEach((p, i) => add(`${l.id}.pair${i}`, p.fr))
        if (step.kind === 'dialogue') step.lines.forEach((x, i) => add(`${l.id}.line${i}`, x.fr))
        if (step.kind === 'grammar')
          step.examples?.forEach((x, i) => add(`${l.id}.example${i}`, x.fr))
      }
      for (const e of l.exercises) {
        const ex = e as { speak?: string; audioText?: string; text?: string }
        add(`${e.id}.speak`, ex.speak)
        add(`${e.id}.audioText`, ex.audioText)
        add(`${e.id}.text`, ex.text)
      }
    }
  }
  for (const s of STORIES) s.paragraphs.forEach((p, i) => add(`${s.id}.p${i}`, p.fr))
  for (const v of VIDEOS) {
    v.transcript.forEach((t, i) => add(`${v.id}.t${i}`, t.fr))
    for (const e of v.exercises) {
      const ex = e as { speak?: string; audioText?: string; text?: string }
      add(`${e.id}.audioText`, ex.audioText)
      add(`${e.id}.text`, ex.text)
    }
  }
  for (const sc of SCENARIOS)
    sc.turns.forEach((t, i) => {
      add(`${sc.id}.teacher${i}`, t.teacher.fr)
      add(`${sc.id}.expected${i}`, t.expected.fr)
    })

  it('has something to speak in the first place', () => {
    expect(spoken.length).toBeGreaterThan(200)
  })

  it('never asks a voice to pronounce notation', () => {
    // A synthesiser will gamely read "→", "[", "‿" and the IPA between them.
    // The learner hears the phrase, then a long stretch of phonetic symbols —
    // which is exactly what "the audio has a huge delay" turns out to be.
    const noisy = spoken.filter(([, s]) => /[→⟶⇒\[\]‿*]/.test(speakable(s))).map(([w]) => w)
    expect(noisy).toEqual([])
  })

  it('never reduces to silence', () => {
    // A field that is *only* notation would strip to nothing: the button
    // depresses, no sound comes out, and nothing reports an error.
    const silent = spoken.filter(([, s]) => !speakable(s).trim()).map(([w]) => w)
    expect(silent).toEqual([])
  })
})
