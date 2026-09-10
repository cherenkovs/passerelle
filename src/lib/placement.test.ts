import { describe, expect, it } from 'vitest'
import {
  currentProbe,
  isComplete,
  maxProbes,
  placementProgress,
  placementResult,
  PROBES_PER_MODULE,
  recordProbe,
  startPlacement,
  type PlacementState,
} from './placement'

const MODULES = 24

/**
 * Simulate a learner who can do modules `[0, ability)` and nothing above,
 * answering `correct` questions right on every probe they can handle.
 */
function run(ability: number, opts: { slipAt?: number; luckyAt?: number } = {}) {
  let state = startPlacement(MODULES)
  let probes = 0
  while (!isComplete(state)) {
    const mi = currentProbe(state)!
    probes++
    let correct = mi < ability ? PROBES_PER_MODULE : 0
    if (opts.slipAt === mi) correct = 1 // a bad day on a module they know
    if (opts.luckyAt === mi) correct = 2 // a guess that landed
    state = recordProbe(state, correct)
  }
  return { state, probes, result: placementResult(state, MODULES) }
}

describe('adaptive search', () => {
  it.each([0, 1, 5, 12, 13, 17, 23, 24])('finds the first unknown module (%i)', (ability) => {
    expect(run(ability).result.moduleIndex).toBe(ability)
  })

  it('never needs more than the worst-case number of probes', () => {
    for (let ability = 0; ability <= MODULES; ability++) {
      expect(run(ability).probes).toBeLessThanOrEqual(maxProbes(MODULES))
    }
  })

  it('asks at most fifteen questions', () => {
    for (let ability = 0; ability <= MODULES; ability++) {
      expect(run(ability).result.askedQuestions).toBeLessThanOrEqual(15)
    }
  })

  it('flags a learner the course cannot stretch', () => {
    const { result } = run(MODULES)
    expect(result.beyond).toBe(true)
    expect(result.moduleIndex).toBe(MODULES)
  })

  it('places a complete beginner at the very first module', () => {
    const { result } = run(0)
    expect(result.beyond).toBe(false)
    expect(result.moduleIndex).toBe(0)
    expect(result.highestPassed).toBe(-1)
  })
})

describe('tolerance for noise', () => {
  it('survives one wrong answer on a module the learner knows', () => {
    // 2 of 3 still passes, so a single slip changes nothing.
    const clean = run(14).result.moduleIndex
    let state = startPlacement(MODULES)
    while (!isComplete(state)) {
      const mi = currentProbe(state)!
      state = recordProbe(state, mi < 14 ? PROBES_PER_MODULE - 1 : 0)
    }
    expect(placementResult(state, MODULES).moduleIndex).toBe(clean)
  })

  it('a bad probe places low rather than high', () => {
    // Slipping to 1-of-3 on a known module can only pull the estimate down.
    const honest = run(16).result.moduleIndex
    const slipped = run(16, { slipAt: 11 }).result.moduleIndex
    expect(slipped).toBeLessThanOrEqual(honest)
  })

  it('a lucky guess is still bounded by the next probe', () => {
    // Guessing 2-of-3 above your ability pushes up, but the search keeps
    // probing higher and those probes fail — so the overshoot stays small.
    const { result } = run(10, { luckyAt: 12 })
    expect(result.moduleIndex).toBeGreaterThan(10)
    expect(result.moduleIndex).toBeLessThanOrEqual(14)
  })
})

describe('bookkeeping', () => {
  it('records every probe with its module and score', () => {
    const { state } = run(7)
    expect(state.history.length).toBeGreaterThan(0)
    for (const h of state.history) {
      expect(h.passed).toBe(h.correct >= 2)
      expect(h.moduleIndex).toBeGreaterThanOrEqual(0)
      expect(h.moduleIndex).toBeLessThan(MODULES)
    }
  })

  it('never probes the same module twice', () => {
    for (let ability = 0; ability <= MODULES; ability++) {
      const ids = run(ability).state.history.map((h) => h.moduleIndex)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('progress runs from zero to one', () => {
    const fresh: PlacementState = startPlacement(MODULES)
    expect(placementProgress(fresh, MODULES)).toBe(0)
    expect(placementProgress(run(9).state, MODULES)).toBe(1)
  })

  it('reports the highest module actually demonstrated', () => {
    const { state, result } = run(20)
    const passed = state.history.filter((h) => h.passed).map((h) => h.moduleIndex)
    expect(result.highestPassed).toBe(Math.max(...passed))
    expect(result.highestPassed).toBeLessThan(result.moduleIndex)
  })
})
