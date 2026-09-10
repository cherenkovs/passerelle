import { describe, expect, it } from 'vitest'
import { agree, bothForms, hasMarker } from './agreement'

describe('agree', () => {
  it('leaves unmarked text alone', () => {
    expect(agree('Je viens de Kyiv.', 'f')).toBe('Je viens de Kyiv.')
    expect(agree('Je viens de Kyiv.', 'm')).toBe('Je viens de Kyiv.')
  })

  it('appends the short form only for the feminine', () => {
    expect(agree('Je suis ukrainien{ne}.', 'm')).toBe('Je suis ukrainien.')
    expect(agree('Je suis ukrainien{ne}.', 'f')).toBe('Je suis ukrainienne.')
  })

  it('handles the commonest ending of all', () => {
    expect(agree('Je suis allé{e} au musée.', 'm')).toBe('Je suis allé au musée.')
    expect(agree('Je suis allé{e} au musée.', 'f')).toBe('Je suis allée au musée.')
  })

  it('takes an explicit pair when the stem changes', () => {
    expect(agree('Je suis {vieux|vieille}.', 'm')).toBe('Je suis vieux.')
    expect(agree('Je suis {vieux|vieille}.', 'f')).toBe('Je suis vieille.')
  })

  it('resolves several markers in one sentence', () => {
    const s = 'Je suis étudiant{e} et je suis fatigué{e}.'
    expect(agree(s, 'm')).toBe('Je suis étudiant et je suis fatigué.')
    expect(agree(s, 'f')).toBe('Je suis étudiante et je suis fatiguée.')
  })

  it('never leaves a brace behind', () => {
    for (const g of ['m', 'f'] as const) {
      expect(agree('a{e} b{x|y} c', g)).not.toMatch(/[{}]/)
    }
  })
})

describe('bothForms', () => {
  it('returns the two readings of a marked string', () => {
    expect(bothForms('Je suis allé{e}.')).toEqual(['Je suis allé.', 'Je suis allée.'])
  })

  it('collapses to one when nothing is marked', () => {
    expect(bothForms('Je viens de Kyiv.')).toEqual(['Je viens de Kyiv.'])
  })
})

describe('hasMarker', () => {
  it('is not confused by repeated calls — the regex is global', () => {
    // A global regex carries lastIndex between calls; without a reset this
    // alternates true/false on identical input.
    expect(hasMarker('allé{e}')).toBe(true)
    expect(hasMarker('allé{e}')).toBe(true)
    expect(hasMarker('rien')).toBe(false)
  })
})
