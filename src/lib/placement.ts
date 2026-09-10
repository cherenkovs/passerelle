/**
 * Adaptive placement.
 *
 * The question a placement test actually has to answer is not "what level are
 * you" but "which module should you open tomorrow morning". So the search runs
 * over the flat list of modules and looks for one number: the first module the
 * learner cannot already do.
 *
 * That number is found by binary search. Ability over an ordered curriculum is
 * close enough to monotonic — someone who handles subjonctif handles the
 * present tense — so each probe can halve the remaining range. Twenty-four
 * modules therefore need at most five probes; at three questions per probe
 * that is fifteen questions, which is about as much as anyone will sit through
 * before they have learned anything.
 *
 * Two deliberate biases:
 *
 * - Three questions per probe, passing at two. One careless slip shouldn't
 *   cost a learner four modules.
 * - The result is where they *first stumbled*, not the highest thing they
 *   managed. Being placed slightly low costs a few easy lessons; being placed
 *   slightly high costs the learner their footing, and that is what makes
 *   people quit.
 */

export const PROBES_PER_MODULE = 3
export const PROBE_PASS_MARK = 2

export type ProbeRecord = {
  moduleIndex: number
  correct: number
  passed: boolean
}

export type PlacementState = {
  /** Modules in `[lo, hi]` are still candidates for "first one they can't do". */
  lo: number
  hi: number
  history: ProbeRecord[]
}

export function startPlacement(moduleCount: number): PlacementState {
  return { lo: 0, hi: moduleCount, history: [] }
}

/** Which module to probe next, or `null` once the answer is pinned down. */
export function currentProbe(state: PlacementState): number | null {
  if (state.lo >= state.hi) return null
  return Math.floor((state.lo + state.hi) / 2)
}

export function recordProbe(state: PlacementState, correct: number): PlacementState {
  const moduleIndex = currentProbe(state)
  if (moduleIndex === null) return state

  const passed = correct >= PROBE_PASS_MARK
  return {
    lo: passed ? moduleIndex + 1 : state.lo,
    hi: passed ? state.hi : moduleIndex,
    history: [...state.history, { moduleIndex, correct, passed }],
  }
}

export function isComplete(state: PlacementState): boolean {
  return currentProbe(state) === null
}

/** Worst-case number of probes — each one at most halves the range. */
export function maxProbes(moduleCount: number): number {
  return Math.ceil(Math.log2(moduleCount + 1))
}

/** 0 → 1, for a progress bar that always reaches the end. */
export function placementProgress(state: PlacementState, moduleCount: number): number {
  if (moduleCount <= 0) return 1
  return 1 - (state.hi - state.lo) / moduleCount
}

export type PlacementResult = {
  /** Module index to start from. Equals `moduleCount` when nothing stumped them. */
  moduleIndex: number
  /** True when every probe was passed — the course has nothing left to teach. */
  beyond: boolean
  /** Highest module they demonstrably handled, or -1 if none. */
  highestPassed: number
  askedQuestions: number
}

export function placementResult(state: PlacementState, moduleCount: number): PlacementResult {
  const passed = state.history.filter((h) => h.passed).map((h) => h.moduleIndex)
  return {
    moduleIndex: Math.min(state.lo, moduleCount),
    beyond: state.lo >= moduleCount,
    highestPassed: passed.length ? Math.max(...passed) : -1,
    askedQuestions: state.history.length * PROBES_PER_MODULE,
  }
}
