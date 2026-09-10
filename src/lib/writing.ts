import { stripDiacritics } from './grade'

/**
 * Automatic feedback on free writing, without a model in the loop.
 *
 * A short text cannot be *graded* without an LLM, and pretending otherwise
 * would be worse than saying nothing. But a surprising amount of what a teacher
 * actually writes in the margin is mechanical, and those parts can be checked
 * honestly offline:
 *
 *   - length, against the brief rather than against nothing;
 *   - whether the required moves are there at all — a formal letter with no
 *     closing formula is incomplete regardless of how good the sentences are;
 *   - register slips, which is the single most common B1–B2 mistake and the
 *     one a learner cannot see in their own work: «Salut» in a letter to an
 *     employer is not a small thing.
 *
 * Everything else — is the argument any good, does it flow — is left to the
 * learner against a model answer and a rubric. That division is deliberate and
 * stated on screen: the app claims only what it can actually check.
 */

export type WritingCheck = {
  /** Any one of these phrases satisfies the check. */
  any: string[]
  label: string
  hint: string
  /** Invert: finding one of these is the problem, not the fix. */
  forbid?: boolean
}

export type WritingTaskShape = {
  words: { min: number; max: number }
  checks: WritingCheck[]
}

export type CheckResult = {
  label: string
  ok: boolean
  hint: string
  /** The offending phrase, when a `forbid` rule tripped. */
  found?: string
}

export type WritingReport = {
  words: number
  lengthOk: boolean
  /** 'short' | 'long' | 'ok' — worth saying which way it missed. */
  length: 'short' | 'long' | 'ok'
  checks: CheckResult[]
  /** Checks passed, out of the checkable total including length. */
  passed: number
  total: number
  /** Nothing left to fix mechanically — time to compare with the model. */
  ready: boolean
}

/** Word count that doesn't reward padding with punctuation. */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/[\s ]+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length
}

/** Accent- and case-blind, so a missing "é" never fails a content check. */
function haystack(text: string) {
  return stripDiacritics(text.toLowerCase().replace(/[’‘]/g, "'"))
}

/**
 * Matched on word boundaries, not as a bare substring.
 *
 * "salutations distinguées" contains "salut", so a naive `includes` flagged the
 * *correct* formal closing as a register slip — the check punished exactly the
 * answer it was meant to reward. Likewise "je vais" contains the imparfait
 * ending "ais". Boundaries are not a nicety here.
 */
function present(hay: string, phrase: string) {
  const needle = stripDiacritics(phrase.toLowerCase().replace(/[’‘]/g, "'")).trim()
  if (!needle) return false
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, 'u').test(hay)
}

export function reviewWriting(text: string, task: WritingTaskShape): WritingReport {
  const words = countWords(text)
  const hay = haystack(text)

  const length: WritingReport['length'] =
    words < task.words.min ? 'short' : words > task.words.max ? 'long' : 'ok'

  const checks: CheckResult[] = task.checks.map((c) => {
    const found = c.any.find((p) => present(hay, p))
    return c.forbid
      ? { label: c.label, ok: !found, hint: c.hint, found }
      : { label: c.label, ok: Boolean(found), hint: c.hint }
  })

  const passed = checks.filter((c) => c.ok).length + (length === 'ok' ? 1 : 0)
  const total = checks.length + 1

  return {
    words,
    length,
    lengthOk: length === 'ok',
    checks,
    passed,
    total,
    ready: passed === total,
  }
}
