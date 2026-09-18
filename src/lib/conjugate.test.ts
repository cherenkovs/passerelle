import { describe, expect, it } from 'vitest'
import { conjugate, infinitiveOf, isConjugable } from './conjugate'

/**
 * The conjugator is the one part of the professor that produces French
 * rather than retrieving it, so a wrong form here is a wrong form taught.
 * Every case is a form a learner would type into the box and expect to be
 * right about.
 */

const forms = (inf: string, tense: keyof NonNullable<ReturnType<typeof conjugate>>['tenses']) =>
  conjugate(inf)!.tenses[tense]

describe('regular groups', () => {
  it('conjugates a plain -er verb', () => {
    expect(forms('parler', 'present')).toEqual([
      'je parle',
      'tu parles',
      'il / elle parle',
      'nous parlons',
      'vous parlez',
      'ils / elles parlent',
    ])
    expect(forms('parler', 'passeCompose')[0]).toBe("j'ai parlé")
    expect(forms('parler', 'imparfait')[3]).toBe('nous parlions')
    expect(forms('parler', 'futur')[5]).toBe('ils / elles parleront')
    expect(forms('parler', 'conditionnel')[0]).toBe('je parlerais')
    expect(forms('parler', 'imperatif')).toEqual(['parle', 'parlons', 'parlez'])
  })

  it('elides je before a vowel', () => {
    expect(forms('aimer', 'present')[0]).toBe("j'aime")
    expect(forms('habiter', 'present')[0]).toBe("j'habite")
    expect(forms('habiter', 'imparfait')[0]).toBe("j'habitais")
  })

  it('conjugates -ir and -re', () => {
    expect(forms('finir', 'present')).toEqual([
      'je finis',
      'tu finis',
      'il / elle finit',
      'nous finissons',
      'vous finissez',
      'ils / elles finissent',
    ])
    expect(forms('finir', 'imparfait')[0]).toBe('je finissais')
    expect(forms('finir', 'passeCompose')[2]).toBe('il / elle a fini')
    expect(forms('vendre', 'present')).toEqual([
      'je vends',
      'tu vends',
      'il / elle vend',
      'nous vendons',
      'vous vendez',
      'ils / elles vendent',
    ])
    expect(forms('attendre', 'futur')[0]).toBe("j'attendrai")
    expect(forms('répondre', 'passeCompose')[0]).toBe("j'ai répondu")
  })
})

describe('spelling changes in the first group', () => {
  it('keeps the soft c and g before o and a', () => {
    expect(forms('manger', 'present')[3]).toBe('nous mangeons')
    expect(forms('manger', 'imparfait')[0]).toBe('je mangeais')
    expect(forms('manger', 'imparfait')[3]).toBe('nous mangions')
    expect(forms('commencer', 'present')[3]).toBe('nous commençons')
    expect(forms('commencer', 'imparfait')[2]).toBe('il / elle commençait')
  })

  it('opens the e before a silent ending', () => {
    expect(forms('acheter', 'present')[0]).toBe("j'achète")
    expect(forms('acheter', 'present')[3]).toBe('nous achetons')
    expect(forms('acheter', 'futur')[0]).toBe("j'achèterai")
    expect(forms('lever', 'present')[0]).toBe('je lève')
  })

  it('doubles the consonant where the language does', () => {
    expect(forms('appeler', 'present')[0]).toBe("j'appelle")
    expect(forms('appeler', 'present')[4]).toBe('vous appelez')
    expect(forms('appeler', 'futur')[0]).toBe("j'appellerai")
    expect(forms('jeter', 'present')[2]).toBe('il / elle jette')
  })

  it('turns é to è before a silent ending but not in the future', () => {
    expect(forms('préférer', 'present')[0]).toBe('je préfère')
    expect(forms('préférer', 'present')[3]).toBe('nous préférons')
    expect(forms('préférer', 'futur')[0]).toBe('je préférerai')
  })

  it('turns y to i before a silent ending', () => {
    expect(forms('payer', 'present')[0]).toBe('je paie')
    expect(forms('nettoyer', 'present')[5]).toBe('ils / elles nettoient')
    expect(forms('nettoyer', 'present')[3]).toBe('nous nettoyons')
  })
})

describe('irregular verbs', () => {
  it('knows the two auxiliaries', () => {
    expect(forms('être', 'present')).toEqual([
      'je suis',
      'tu es',
      'il / elle est',
      'nous sommes',
      'vous êtes',
      'ils / elles sont',
    ])
    expect(forms('être', 'imparfait')[0]).toBe("j'étais")
    expect(forms('être', 'futur')[0]).toBe('je serai')
    expect(forms('être', 'passeCompose')[0]).toBe("j'ai été")
    expect(forms('avoir', 'present')[0]).toBe("j'ai")
    expect(forms('avoir', 'futur')[2]).toBe('il / elle aura')
    expect(forms('avoir', 'imperatif')).toEqual(['aie', 'ayons', 'ayez'])
  })

  it('conjugates the everyday irregulars', () => {
    expect(forms('aller', 'present')).toEqual([
      'je vais',
      'tu vas',
      'il / elle va',
      'nous allons',
      'vous allez',
      'ils / elles vont',
    ])
    expect(forms('aller', 'futur')[0]).toBe("j'irai")
    expect(forms('faire', 'present')[4]).toBe('vous faites')
    expect(forms('faire', 'futur')[0]).toBe('je ferai')
    expect(forms('faire', 'imparfait')[0]).toBe('je faisais')
    expect(forms('prendre', 'present')[5]).toBe('ils / elles prennent')
    expect(forms('prendre', 'passeCompose')[0]).toBe("j'ai pris")
    expect(forms('venir', 'present')[0]).toBe('je viens')
    expect(forms('venir', 'futur')[0]).toBe('je viendrai')
    expect(forms('pouvoir', 'present')[0]).toBe('je peux')
    expect(forms('pouvoir', 'futur')[0]).toBe('je pourrai')
    expect(forms('pouvoir', 'imperatif')).toEqual([])
    expect(forms('vouloir', 'conditionnel')[0]).toBe('je voudrais')
    expect(forms('devoir', 'passeCompose')[0]).toBe("j'ai dû")
    expect(forms('voir', 'futur')[0]).toBe('je verrai')
    expect(forms('dire', 'present')[4]).toBe('vous dites')
    expect(forms('boire', 'present')[3]).toBe('nous buvons')
    expect(forms('ouvrir', 'present')[0]).toBe("j'ouvre")
    expect(forms('ouvrir', 'passeCompose')[0]).toBe("j'ai ouvert")
  })

  it('conjugates a prefixed derivative from its base', () => {
    expect(forms('comprendre', 'present')[0]).toBe('je comprends')
    expect(forms('comprendre', 'present')[3]).toBe('nous comprenons')
    expect(forms('comprendre', 'passeCompose')[0]).toBe("j'ai compris")
    expect(forms('devenir', 'passeCompose')[0]).toBe('je suis devenu(e)')
    expect(forms('permettre', 'passeCompose')[0]).toBe("j'ai permis")
    expect(forms('découvrir', 'present')[0]).toBe('je découvre')
    expect(forms('traduire', 'present')[3]).toBe('nous traduisons')
  })

  it('uses être for the verbs of movement, with agreement shown', () => {
    expect(forms('aller', 'passeCompose')).toEqual([
      'je suis allé(e)',
      'tu es allé(e)',
      'il / elle est allé / allée',
      'nous sommes allé(e)s',
      'vous êtes allé(e)(s)',
      'ils / elles sont allés / allées',
    ])
    expect(forms('partir', 'passeCompose')[0]).toBe('je suis parti(e)')
    expect(forms('rester', 'passeCompose')[0]).toBe('je suis resté(e)')
    // …but not for a verb that merely looks like one.
    expect(forms('parler', 'passeCompose')[0]).toBe("j'ai parlé")
  })

  it('handles the impersonal verbs', () => {
    expect(forms('falloir', 'present')).toEqual(['', '', 'il / elle faut', '', '', ''])
    expect(forms('falloir', 'futur')[2]).toBe('il / elle faudra')
    expect(forms('pleuvoir', 'passeCompose')[2]).toBe('il / elle a plu')
  })
})

describe('reflexive verbs', () => {
  it('carries the pronoun through every tense', () => {
    expect(forms('se lever', 'present')).toEqual([
      'je me lève',
      'tu te lèves',
      'il / elle se lève',
      'nous nous levons',
      'vous vous levez',
      'ils / elles se lèvent',
    ])
    expect(forms("s'appeler", 'present')[0]).toBe("je m'appelle")
    expect(forms("s'appeler", 'present')[3]).toBe('nous nous appelons')
    expect(forms('se lever', 'passeCompose')[0]).toBe('je me suis levé(e)')
    expect(forms("s'habiller", 'passeCompose')[0]).toBe('je me suis habillé(e)')
    expect(forms('se lever', 'imperatif')).toEqual(['lève-toi', 'levons-nous', 'levez-vous'])
    expect(forms('se lever', 'futur')[0]).toBe('je me lèverai')
  })
})

describe('recognising forms', () => {
  it('finds the infinitive behind a conjugated form', () => {
    const verbs = ['prendre', 'être', 'avoir', 'aller', 'parler', 'finir']
    expect(infinitiveOf('prends', verbs)).toBe('prendre')
    expect(infinitiveOf('sommes', verbs)).toBe('être')
    expect(infinitiveOf('vont', verbs)).toBe('aller')
    expect(infinitiveOf('pris', verbs)).toBe('prendre')
    expect(infinitiveOf('finissons', verbs)).toBe('finir')
    expect(infinitiveOf('bonjour', verbs)).toBeNull()
  })

  it('refuses what is not a verb', () => {
    expect(isConjugable('bonjour')).toBe(false)
    expect(isConjugable('la maison')).toBe(false)
    expect(isConjugable('mer')).toBe(false)
    expect(conjugate('merci')).toBeNull()
  })
})
