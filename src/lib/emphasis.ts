/**
 * The tiny emphasis grammar lesson copy is written in: `**bold**` and
 * `*italic*`, nestable either way round.
 *
 * The nesting is the reason this isn't a regex split. Lesson copy puts French
 * examples in italics and marks the form under discussion in bold inside them —
 * *Je **ne** comprends **pas**.* — and a flat split loses the inner marker and
 * prints the asterisks instead.
 *
 * An unmatched marker degrades to a literal asterisk rather than swallowing the
 * rest of the line; `hasStrayAsterisk` finds those so the content tests can fail
 * on a typo that would otherwise ship silently.
 */

export type Span =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; children: Span[] }
  | { kind: 'italic'; children: Span[] }

export function parseEmphasis(input: string): Span[] {
  const out: Span[] = []
  let text = ''
  let i = 0

  const flush = () => {
    if (text) out.push({ kind: 'text', text })
    text = ''
  }

  while (i < input.length) {
    // A run of three opens an italic whose first word is bold ("***X** y*"), so
    // the leading marker belongs to the italic rather than starting a bold run.
    if (input.startsWith('**', i) && !input.startsWith('***', i)) {
      const end = input.indexOf('**', i + 2)
      if (end > i + 2) {
        flush()
        out.push({ kind: 'bold', children: parseEmphasis(input.slice(i + 2, end)) })
        i = end + 2
        continue
      }
    } else if (input[i] === '*') {
      // Step over any `**` runs on the way, so a bold span inside an italic one
      // doesn't get mistaken for the italic's closing marker.
      let j = i + 1
      while (j < input.length && input[j] !== '*') j++
      while (input.startsWith('**', j)) {
        j += 2
        while (j < input.length && input[j] !== '*') j++
      }
      if (j < input.length && j > i + 1) {
        flush()
        out.push({ kind: 'italic', children: parseEmphasis(input.slice(i + 1, j)) })
        i = j + 1
        continue
      }
    }
    text += input[i]
    i++
  }

  flush()
  return out
}

/** True when a marker went unmatched and would render as a bare `*`. */
export function hasStrayAsterisk(input: string): boolean {
  const stray = (span: Span): boolean =>
    span.kind === 'text' ? span.text.includes('*') : span.children.some(stray)
  return parseEmphasis(input).some(stray)
}
