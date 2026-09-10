import { describe, expect, it } from 'vitest'
import { reviewWriting } from '@/lib/writing'
import { WRITING_TASKS, getWritingTask } from './writing'

/**
 * The model answers are the standard the learner is asked to match, so they had
 * better meet the brief themselves. A model that fails its own checks teaches
 * the wrong thing twice.
 */

describe('the task set', () => {
  it('spans A2 to B2', () => {
    expect(new Set(WRITING_TASKS.map((t) => t.level))).toEqual(new Set(['A2', 'B1', 'B2']))
  })

  it('has unique ids that resolve', () => {
    const ids = WRITING_TASKS.map((t) => t.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
    for (const id of ids) expect(getWritingTask(id)).toBeDefined()
  })

  it('gives every task a brief, checks, a model and a rubric', () => {
    for (const t of WRITING_TASKS) {
      expect(t.brief.length, t.id).toBeGreaterThan(30)
      expect(t.requirements.length, t.id).toBeGreaterThan(2)
      expect(t.checks.length, t.id).toBeGreaterThan(1)
      expect(t.phrases.length, t.id).toBeGreaterThan(2)
      expect(t.rubric.length, t.id).toBeGreaterThan(1)
      expect(t.model.length, t.id).toBeGreaterThan(80)
      expect(t.modelUk.length, t.id).toBeGreaterThan(80)
    }
  })

  it('asks for longer texts at higher levels', () => {
    const a2 = WRITING_TASKS.filter((t) => t.level === 'A2')
    const b2 = WRITING_TASKS.filter((t) => t.level === 'B2')
    expect(Math.max(...a2.map((t) => t.words.min))).toBeLessThan(
      Math.min(...b2.map((t) => t.words.min)),
    )
  })

  it('sets a length range that is actually a range', () => {
    for (const t of WRITING_TASKS) expect(t.words.max, t.id).toBeGreaterThan(t.words.min)
  })
})

describe('every model answer passes its own task', () => {
  it.each(WRITING_TASKS.map((t) => [t.id, t] as const))('%s', (_id, task) => {
    const report = reviewWriting(task.model, task)
    const failed = report.checks.filter((c) => !c.ok).map((c) => c.label)
    expect(failed).toEqual([])
    expect(report.length, `${report.words} words vs ${task.words.min}-${task.words.max}`).toBe('ok')
    expect(report.ready).toBe(true)
  })
})
