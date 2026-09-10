import { describe, expect, it } from 'vitest'
import { gradeAnswer, levenshtein, pronunciationScore } from './grade'

/**
 * The grader is the piece of logic a learner feels most: too strict and a
 * correct answer reads as wrong, too loose and mistakes go unnoticed.
 */

describe('normalisation — formatting must never cost a mark', () => {
  it.each([
    ['merci', 'merci'],
    ['  Merci! ', 'merci'],
    ['j’ai', "j'ai"], // curly apostrophe
    ['je ne parle pas russe', 'Je ne parle pas russe.'],
    ['LE LIVRE', 'le livre'],
  ])('accepts %j against %j', (input, accepted) => {
    expect(gradeAnswer(input, accepted).status).toBe('correct')
  })
})

describe('the "almost" band — right word, wrong orthography', () => {
  it.each([
    ['cafe', 'café'], // missing accent
    ['eleve', 'élève'],
    ['mercii', 'merci'], // inserted letter
    ['bonjuor', 'bonjour'], // transposed letters
    ['etudiant', 'étudiant'],
  ])('forgives %j for %j', (input, accepted) => {
    expect(gradeAnswer(input, accepted).status).toBe('almost')
  })

  it('names the specific accent that was missed', () => {
    expect(gradeAnswer('cafe', 'café').note).toContain('é')
  })

  it('treats a transposition as one edit, not two', () => {
    expect(levenshtein('bonjuor', 'bonjour')).toBe(1)
  })
})

describe('genuinely wrong answers', () => {
  it.each([
    ['bonsoir', 'bonjour'],
    ['', 'merci'],
    ['chat', 'chien'],
  ])('rejects %j for %j', (input, accepted) => {
    expect(gradeAnswer(input, accepted).status).toBe('wrong')
  })
})

describe('multiple accepted forms', () => {
  it('accepts any listed variant', () => {
    expect(gradeAnswer('sil vous plait', ["s'il vous plaît", 'sil vous plait']).status).toBe(
      'correct',
    )
  })

  it('falls back to "almost" when only an accented variant is listed', () => {
    expect(gradeAnswer('sil vous plait', ["s'il vous plaît"]).status).toBe('almost')
  })
})

describe('strict mode (exams) forgives nothing', () => {
  it.each([
    ['cafe', 'café', 'wrong'],
    ['mercii', 'merci', 'wrong'],
    ['café', 'café', 'correct'],
  ])('%j vs %j → %s', (input, accepted, want) => {
    expect(gradeAnswer(input, accepted, { strict: true }).status).toBe(want)
  })
})

describe('dictation requires accents', () => {
  it('rejects an unaccented answer', () => {
    expect(gradeAnswer('etudiant', 'étudiant', { requireAccents: true }).status).toBe('wrong')
  })
})

describe('pronunciation scoring', () => {
  it('scores a clear match high', () => {
    expect(pronunciationScore('bonjour madame', 'Bonjour, madame !')).toBeGreaterThan(0.9)
  })

  it('scores an unrelated phrase low', () => {
    expect(pronunciationScore('au revoir', 'Bonjour, madame !')).toBeLessThan(0.5)
  })
})

describe('open formulas', () => {
  // The tutor asks «Comment vous appelez-vous ?» — the learner answers with
  // their own name, so only the formula can be checked.
  const prefixes = ["je m'appelle", 'je mappelle', 'je suis', "moi c'est"]
  const grade = (s: string) =>
    gradeAnswer(s, ["je m'appelle maryna"], { acceptPrefixes: prefixes }).status

  it.each(["Je m'appelle Serhii.", 'Je suis Maryna', "Moi c'est Olha", "je m'appelle Jean-Luc"])(
    'accepts %j whatever the name is',
    (input) => {
      expect(grade(input)).toBe('correct')
    },
  )

  it('rejects the bare formula with no name', () => {
    expect(grade("Je m'appelle")).not.toBe('correct')
  })

  it('rejects a different sentence', () => {
    expect(grade('Je viens de Kyiv')).toBe('wrong')
  })
})

describe('punctuation is not part of the answer', () => {
  it('accepts correct French written with its commas', () => {
    // The app's own model answers carry the comma, so grading it as a typo
    // marked correct French as merely "almost".
    expect(gradeAnswer('Oui, je suis très fatiguée.', 'oui je suis très fatiguée').status).toBe(
      'correct',
    )
    expect(gradeAnswer('Non, je suis ukrainien.', 'non je suis ukrainien').status).toBe('correct')
  })

  it('accepts an answer written without them too', () => {
    expect(gradeAnswer('oui je suis très fatiguée', 'Oui, je suis très fatiguée.').status).toBe(
      'correct',
    )
  })

  it('keeps words apart when punctuation is all that separates them', () => {
    expect(gradeAnswer('un,deux', 'un deux').status).toBe('correct')
    expect(gradeAnswer('undeux', 'un deux').status).not.toBe('correct')
  })

  it('still respects apostrophes and hyphens, which carry meaning', () => {
    expect(gradeAnswer("j'ai", "j'ai").status).toBe('correct')
    expect(gradeAnswer('Parlez-vous français ?', 'parlez-vous français').status).toBe('correct')
  })
})
