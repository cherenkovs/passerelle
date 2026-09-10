import { describe, expect, it } from 'vitest'
import { hasStrayAsterisk, parseEmphasis, type Span } from './emphasis'

/** Flatten back to a string, dropping the markers — what the reader sees. */
function plain(spans: Span[]): string {
  return spans.map((s) => (s.kind === 'text' ? s.text : plain(s.children))).join('')
}

/** A compact shape for asserting structure: bold → [text], italic → (text). */
function shape(spans: Span[]): string {
  return spans
    .map((s) =>
      s.kind === 'text'
        ? s.text
        : s.kind === 'bold'
          ? `[${shape(s.children)}]`
          : `(${shape(s.children)})`,
    )
    .join('')
}

describe('parseEmphasis', () => {
  it('leaves plain text alone', () => {
    expect(shape(parseEmphasis('Просто текст.'))).toBe('Просто текст.')
  })

  it('reads bold and italic', () => {
    expect(shape(parseEmphasis('а **б** в *г* д'))).toBe('а [б] в (г) д')
  })

  it('reads bold nested inside italic — the house style for French examples', () => {
    expect(shape(parseEmphasis('*Je **ne** comprends **pas**.*'))).toBe(
      '(Je [ne] comprends [pas].)',
    )
  })

  it('handles a bold run that ends flush with the italic', () => {
    expect(shape(parseEmphasis('*ils **parl**ent*'))).toBe('(ils [parl]ent)')
  })

  it('treats a run of three as an italic opening on a bold word', () => {
    expect(shape(parseEmphasis("***L'augmentation** des prix…*"))).toBe(
      "([L'augmentation] des prix…)",
    )
  })

  it('never loses characters', () => {
    const src = 'Ми кажемо «**у** понеділок» — *Je travaille **le** lundi.*'
    expect(plain(parseEmphasis(src))).toBe(src.replace(/\*/g, ''))
  })

  it('leaves an unmatched marker as a literal asterisk rather than eating the line', () => {
    const spans = parseEmphasis('добре *але не закрито')
    expect(plain(spans)).toBe('добре *але не закрито')
    expect(hasStrayAsterisk('добре *але не закрито')).toBe(true)
  })

  it('accepts well-formed copy', () => {
    expect(hasStrayAsterisk('*ils **vienn**ent* → *que je vienn**e**…*')).toBe(false)
  })

  it('flags the real typo it was written for', () => {
    // A bold run left open swallows the italic's closing marker.
    expect(hasStrayAsterisk('*ils **viennent** → *que je vienn**e**…*')).toBe(true)
  })
})
