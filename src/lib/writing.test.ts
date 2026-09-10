import { describe, expect, it } from 'vitest'
import { countWords, reviewWriting, type WritingTaskShape } from './writing'

const letter: WritingTaskShape = {
  words: { min: 10, max: 20 },
  checks: [
    {
      any: ['cordialement', 'veuillez agréer', 'salutations distinguées'],
      label: 'Формула прощання',
      hint: 'Діловий лист закінчують формулою.',
    },
    {
      any: ['salut', 'coucou', 'bisous'],
      label: 'Регістр',
      hint: 'Фамільярні звертання не місце в діловому листі.',
      forbid: true,
    },
  ],
}

describe('countWords', () => {
  it('counts words, not punctuation', () => {
    expect(countWords('Bonjour, madame ! Ça va ?')).toBe(4)
  })

  it('is not fooled by extra spacing or line breaks', () => {
    expect(countWords('  un   deux \n\n trois  ')).toBe(3)
  })

  it('is zero for an empty or punctuation-only text', () => {
    expect(countWords('')).toBe(0)
    expect(countWords('   ')).toBe(0)
    expect(countWords('... !? —')).toBe(0)
  })

  it('counts a hyphenated word once, as a reader would', () => {
    expect(countWords('Parlez-vous français')).toBe(2)
  })
})

describe('length', () => {
  const words = (n: number) => Array.from({ length: n }, (_, i) => `mot${i}`).join(' ')

  it('says which way the text missed, not just that it did', () => {
    expect(reviewWriting(words(5), letter).length).toBe('short')
    expect(reviewWriting(words(40), letter).length).toBe('long')
    expect(reviewWriting(words(15), letter).length).toBe('ok')
  })

  it('accepts both ends of the range', () => {
    expect(reviewWriting(words(10), letter).lengthOk).toBe(true)
    expect(reviewWriting(words(20), letter).lengthOk).toBe(true)
  })
})

describe('required moves', () => {
  it('passes when the closing formula is there', () => {
    const r = reviewWriting(
      'Madame, je vous écris au sujet de votre annonce parue hier. Cordialement, Serhii',
      letter,
    )
    expect(r.checks[0].ok).toBe(true)
  })

  it('fails when it is missing, and says what to add', () => {
    const r = reviewWriting(
      'Madame, je vous écris au sujet de votre annonce parue hier matin.',
      letter,
    )
    expect(r.checks[0].ok).toBe(false)
    expect(r.checks[0].hint).toContain('формулою')
  })

  it('does not require the learner to have typed the accents', () => {
    // "Veuillez agreer" should pass as readily as "Veuillez agréer".
    const withAccents = reviewWriting('Veuillez agréer mes salutations les plus sincères', letter)
    const without = reviewWriting('Veuillez agreer mes salutations les plus sinceres', letter)
    expect(withAccents.checks[0].ok).toBe(without.checks[0].ok)
    expect(without.checks[0].ok).toBe(true)
  })

  it('ignores case and the shape of the apostrophe', () => {
    expect(reviewWriting('CORDIALEMENT', letter).checks[0].ok).toBe(true)
  })
})

describe('register slips', () => {
  it('catches a familiar greeting in a formal letter', () => {
    const r = reviewWriting('Salut ! Je vous écris au sujet du poste. Cordialement', letter)
    const register = r.checks[1]
    expect(register.ok).toBe(false)
    expect(register.found).toBe('salut')
  })

  it('passes a letter that keeps its register', () => {
    const r = reviewWriting('Madame, je vous écris au sujet du poste. Cordialement', letter)
    expect(r.checks[1].ok).toBe(true)
    expect(r.checks[1].found).toBeUndefined()
  })
})

describe('the overall verdict', () => {
  it('is ready only when length and every check pass', () => {
    const good = reviewWriting(
      'Madame, je vous écris au sujet de votre annonce parue hier. Cordialement, Maryna',
      letter,
    )
    expect(good.ready).toBe(true)
    expect(good.passed).toBe(good.total)
  })

  it('counts length as one of the things that can be wrong', () => {
    const short = reviewWriting('Cordialement', letter)
    expect(short.ready).toBe(false)
    expect(short.total).toBe(3) // two checks plus length
    expect(short.passed).toBe(2) // closing ✓, no register slip ✓, length ✗
  })

  it('reports an empty text as unfinished rather than perfect', () => {
    const empty = reviewWriting('', letter)
    expect(empty.ready).toBe(false)
    expect(empty.words).toBe(0)
  })

  it('never claims to judge the writing itself', () => {
    // Nonsense of the right length with the right formula still "passes" the
    // mechanical checks — which is exactly why the model answer and the rubric
    // are the other half of the exercise, and why the UI says so.
    const nonsense = reviewWriting(
      'chat chat chat chat chat chat chat chat chat chat chat Cordialement',
      letter,
    )
    expect(nonsense.ready).toBe(true)
  })
})

describe('word boundaries', () => {
  it('does not flag "salutations" as the familiar "salut"', () => {
    // The bug this exists for: "Veuillez agréer … mes salutations distinguées"
    // is the correct formal closing, and the register check rejected it.
    const r = reviewWriting(
      'Madame, je vous écris au sujet du poste. Veuillez agréer mes salutations distinguées',
      letter,
    )
    expect(r.checks[1].ok).toBe(true)
    expect(r.checks[0].ok).toBe(true)
  })

  it('still catches the standalone word', () => {
    const r = reviewWriting('Salut ! Cordialement, moi et encore quelques mots ici', letter)
    expect(r.checks[1].ok).toBe(false)
  })

  it('does not let a suffix match inside a longer word', () => {
    const imparfait: WritingTaskShape = {
      words: { min: 1, max: 100 },
      checks: [{ any: ['ais'], label: 'Imparfait', hint: '' }],
    }
    // "je vais" is present tense and must not satisfy an imparfait check.
    expect(reviewWriting('je vais au parc', imparfait).checks[0].ok).toBe(false)
    expect(reviewWriting('je ne sais pas ce que je faisais', imparfait).checks[0].ok).toBe(false)
    expect(reviewWriting('mais ais est un mot', imparfait).checks[0].ok).toBe(true)
  })

  it('matches a phrase across its words', () => {
    const r = reviewWriting(
      'Madame, je vous écris. Veuillez agréer mes hommages les plus respectueux',
      letter,
    )
    expect(r.checks[0].ok).toBe(true)
  })
})
