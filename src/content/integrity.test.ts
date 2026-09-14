/**
 * Structural checks over the whole course.
 *
 * These are the faults that produce no error and no crash — a tap that opens
 * an empty word card, a mistake recorded against the wrong exercise, a
 * multiple-choice question with no correct answer to pick. Nothing reports
 * them; they are simply wrong for whoever meets them.
 */

import { expect, it } from 'vitest'
import { COURSES, WORDS } from '@/content'

it('every word id an exercise cites actually exists', () => {
  const ids = new Set(WORDS.map((w) => w.id))
  const missing: string[] = []
  for (const c of COURSES)
    for (const m of c.modules)
      for (const l of m.lessons)
        for (const e of l.exercises ?? [])
          for (const w of (e as { words?: string[] }).words ?? [])
            if (!ids.has(w)) missing.push(`${e.id} → ${w}`)
  expect(missing).toEqual([])
})

it('no duplicate exercise ids, which would break mistake tracking', () => {
  const seen = new Map<string, number>()
  for (const c of COURSES)
    for (const m of c.modules) {
      for (const l of m.lessons)
        for (const e of l.exercises ?? []) seen.set(e.id, (seen.get(e.id) ?? 0) + 1)
      for (const e of m.quiz ?? []) seen.set(e.id, (seen.get(e.id) ?? 0) + 1)
    }
  expect([...seen].filter(([, n]) => n > 1).map(([id]) => id)).toEqual([])
})

it('no duplicate lesson or module ids', () => {
  const lessons: string[] = []
  const modules: string[] = []
  for (const c of COURSES)
    for (const m of c.modules) {
      modules.push(m.id)
      for (const l of m.lessons) lessons.push(l.id)
    }
  expect(lessons.length).toBe(new Set(lessons).size)
  expect(modules.length).toBe(new Set(modules).size)
})

it('every mcq answer index points at a real option', () => {
  const bad: string[] = []
  for (const c of COURSES)
    for (const m of c.modules)
      for (const l of m.lessons)
        for (const e of [...(l.exercises ?? []), ...(m.quiz ?? [])]) {
          const q = e as { id: string; kind: string; options?: string[]; answer?: unknown }
          if ((q.kind === 'mcq' || q.kind === 'listen') && Array.isArray(q.options)) {
            if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length)
              bad.push(q.id)
          }
        }
  expect(bad).toEqual([])
})
