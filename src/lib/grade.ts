/**
 * Answer checking.
 *
 * French is unforgiving about accents but learners type on Ukrainian/US
 * keyboards, so a naive `===` would punish someone who actually knew the
 * answer. We grade in three bands:
 *
 *   correct  — matches an accepted answer exactly
 *   almost   — right word, wrong accent / one typo → counted as a pass,
 *              but the learner is shown precisely what to fix
 *   wrong    — genuinely different
 *
 * `almost` is the pedagogically important band: it keeps momentum while still
 * teaching the orthography.
 */

export type GradeStatus = 'correct' | 'almost' | 'wrong'

export type GradeResult = {
  status: GradeStatus
  /** The canonical answer we compare against (first accepted form). */
  expected: string
  /** Ukrainian hint explaining an `almost`, if any. */
  note?: string
}

const APOSTROPHES = /[’‘‛`´]/g

/**
 * Punctuation is ignored everywhere, not just at the ends. French leans on the
 * comma — "Oui, je suis très fatiguée" — and the app's own model answers are
 * written with it, so counting it would mark correct French as merely "almost".
 * Apostrophes and hyphens survive: they carry meaning (*j'ai*, *parlez-vous*).
 */
const PUNCTUATION = /["«»„“”.,!?;:…]/g

export function normalize(s: string) {
  return (
    s
      .replace(APOSTROPHES, "'")
      .replace(/\u00a0/g, ' ')
      // Replaced with a space, not removed, so "un,deux" doesn't become "undeux".
      .replace(PUNCTUATION, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLocaleLowerCase('fr-FR')
  )
}

/** "élève" → "eleve". Also flattens the œ/æ ligatures. */
export function stripDiacritics(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/ç/g, 'c')
}

/**
 * Damerau–Levenshtein (optimal string alignment).
 *
 * Plain Levenshtein charges 2 for a transposition, so "bonjuor" would score as
 * far from "bonjour" as a genuinely different word. Swapping two adjacent keys
 * is the single most common typing slip, so it costs 1 here — otherwise the
 * "almost" band would punish learners who clearly know the word.
 */
export function levenshtein(a: string, b: string) {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  // Three rolling rows: two back (for transpositions), one back, current.
  let prev2: number[] = []
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)

  for (let i = 1; i <= a.length; i++) {
    const curr = new Array<number>(b.length + 1)
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let best = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        best = Math.min(best, prev2[j - 2] + 1)
      }
      curr[j] = best
    }
    prev2 = prev
    prev = curr
  }
  return prev[b.length]
}

/** Which accented characters were missed, e.g. ["é", "à"] */
function missingAccents(user: string, target: string): string[] {
  const found = new Set<string>()
  const un = user.normalize('NFC')
  const tn = target.normalize('NFC')
  for (let i = 0; i < tn.length; i++) {
    const tc = tn[i]
    if (stripDiacritics(tc) !== tc && un[i] !== tc) found.add(tc)
  }
  return [...found]
}

export type GradeOptions = {
  /** Reject near-misses instead of accepting them (used in exams). */
  strict?: boolean
  /** Diacritics must match exactly (used in dictation). */
  requireAccents?: boolean
  /**
   * Formulas that may be completed with anything — "je m'appelle" + whatever the
   * learner is actually called. Without this the only correct answer to «як вас
   * звати?» would be the name the course author happened to pick.
   */
  acceptPrefixes?: readonly string[]
}

export function gradeAnswer(
  input: string,
  accepted: string | readonly string[],
  opts: GradeOptions = {},
): GradeResult {
  const list = (Array.isArray(accepted) ? accepted : [accepted]) as readonly string[]
  const expected = list[0] ?? ''
  const user = normalize(input)

  if (!user) return { status: 'wrong', expected }

  // 1. Exact match against any accepted form.
  for (const a of list) {
    if (user === normalize(a)) return { status: 'correct', expected }
  }

  // 1b. An open formula: the prefix must match and something must follow it.
  for (const p of opts.acceptPrefixes ?? []) {
    const prefix = normalize(p)
    if (user.startsWith(`${prefix} `) && user.length > prefix.length + 1) {
      return { status: 'correct', expected }
    }
  }

  // 2. Same letters, different accents.
  const userFlat = stripDiacritics(user)
  for (const a of list) {
    const target = normalize(a)
    if (userFlat === stripDiacritics(target)) {
      if (opts.requireAccents || opts.strict) {
        return {
          status: 'wrong',
          expected: a,
          note: `Літери правильні, але бракує діакритики. Треба: ${a}`,
        }
      }
      const missed = missingAccents(user, target)
      return {
        status: 'almost',
        expected: a,
        note: missed.length
          ? `Майже! Загубилися надрядкові знаки: ${missed.join(', ')}. Правильно: ${a}`
          : `Майже! Зверни увагу на написання: ${a}`,
      }
    }
  }

  // 3. Single typo in a reasonably long answer.
  if (!opts.strict) {
    for (const a of list) {
      const target = normalize(a)
      const tolerance = target.length >= 12 ? 2 : target.length >= 5 ? 1 : 0
      if (tolerance && levenshtein(userFlat, stripDiacritics(target)) <= tolerance) {
        return {
          status: 'almost',
          expected: a,
          note: `Зараховано, але є друкарська помилка. Правильно: ${a}`,
        }
      }
    }
  }

  return { status: 'wrong', expected }
}

/** Word-level diff for highlighting a sentence answer. */
export type DiffPart = { text: string; ok: boolean }

export function diffWords(input: string, expected: string): DiffPart[] {
  const userWords = normalize(input).split(' ').filter(Boolean)
  const expWords = normalize(expected).split(' ').filter(Boolean)
  const expSet = new Set(expWords.map(stripDiacritics))
  return userWords.map((w) => ({ text: w, ok: expSet.has(stripDiacritics(w)) }))
}

/**
 * Loose comparison for speech recognition. The recogniser adds punctuation,
 * capitalises and sometimes drops elisions, so we compare accent-insensitively
 * and return a 0..1 similarity score.
 */
export function pronunciationScore(heard: string, target: string) {
  const h = stripDiacritics(normalize(heard)).replace(/[^a-z' ]/g, '')
  const t = stripDiacritics(normalize(target)).replace(/[^a-z' ]/g, '')
  if (!h) return 0
  if (h === t) return 1
  const distance = levenshtein(h, t)
  return Math.max(0, 1 - distance / Math.max(t.length, 1))
}
