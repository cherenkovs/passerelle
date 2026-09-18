import { describe, expect, it } from 'vitest'
import { ask, askAboutExercise, findExamples, findFaq, findFrench } from './professor'
import { FAQ } from '@/content/faq'
import { searchGrammar } from '@/content/reference'
import { findExercise } from '@/content'

/**
 * The professor is judged on reading the question, since the answers are
 * retrieved rather than written. Each case is a question typed the way a
 * learner types it, and the block it must lead with.
 */

const kinds = (q: string) => ask(q).blocks.map((b) => b.kind)
const first = (q: string) => ask(q).blocks[0]

describe('reading the question', () => {
  it('conjugates when asked, in all the ways people ask', () => {
    for (const q of [
      'Провідміняй être',
      'відмінювання prendre',
      'prendre у минулому',
      'conjugue aller',
    ]) {
      expect(first(q).kind, q).toBe('conjugation')
    }
    const b = first('prendre у минулому')
    expect(b.kind === 'conjugation' && b.tense).toBe('passeCompose')
    const c = first('Провідміняй se lever')
    expect(c.kind === 'conjugation' && c.conjugation.infinitive).toBe('se lever')
  })

  it('recognises a conjugated form and finds its verb', () => {
    const b = first('що означає prends')
    expect(b.kind).toBe('word')
    expect(b.kind === 'word' && b.word.fr).toBe('prendre')
  })

  it('treats bare French as a request for its meaning', () => {
    expect(first('pourtant').kind).toBe('word')
    expect(first('bonjour').kind).toBe('word')
    expect(kinds('bonjour')).toContain('examples')
  })

  it('glosses a phrase word by word when it is not one entry', () => {
    // ("Je ne sais pas." is itself a dictionary phrase, so that one is a word.)
    const b = first('що означає je ne parle pas')
    expect(b.kind).toBe('phrase')
    if (b.kind === 'phrase') {
      expect(b.glosses.map((g) => g.token)).toEqual(['je', 'ne', 'parle', 'pas'])
      expect(b.glosses.every((g) => g.gloss)).toBe(true)
    }
  })

  it('finds the French for a Ukrainian word', () => {
    const b = first('Як сказати «дякую»?')
    expect(b.kind).toBe('words')
    expect(b.kind === 'words' && b.words[0].fr).toBe('merci')
    const c = first('вчора')
    expect(c.kind === 'words' && c.words[0].fr).toBe('hier')
    expect(findFrench('хліб')[0].fr).toBe('le pain')
  })

  it('explains pronunciation with the FAQ where there is one', () => {
    expect(kinds('як читається plus')).toEqual(['pronounce', 'word', 'faq'])
    const b = ask('як читається plus').blocks[2]
    expect(b.kind === 'faq' && b.faq.id).toBe('plus-pronunciation')
  })

  it('answers grammar questions from the FAQ first', () => {
    const cases: [string, string][] = [
      ['Коли un/une, а коли le/la?', 'un-une-le-la'],
      ['чому артиклі', 'un-une-le-la'],
      ['passé composé чи imparfait', 'pc-vs-imparfait'],
      ['коли être а коли avoir у минулому', 'etre-avoir-pc'],
      ['чому j’ai 25 ans', 'avoir-age'],
      ['tu чи vous', 'tu-vous'],
      ['як поставити запитання', 'questions'],
      ['що таке liaison', 'liaison'],
      ['savoir чи connaître', 'savoir-connaitre'],
      ['коли subjonctif', 'subjonctif'],
    ]
    for (const [q, id] of cases) {
      const b = first(q)
      expect(b.kind, q).toBe('faq')
      expect(b.kind === 'faq' && b.faq.id, q).toBe(id)
    }
  })

  it('shows examples when asked for them', () => {
    const b = first('Покажи приклади з depuis')
    expect(b.kind).toBe('examples')
    if (b.kind === 'examples') {
      expect(b.items.length).toBeGreaterThan(0)
      expect(b.items.every((e) => /depuis/i.test(e.fr))).toBe(true)
    }
  })

  it('says so when it has nothing, and offers a way forward', () => {
    const b = ask('розкажи анекдот про Наполеона').blocks
    expect(b[0].kind).toBe('text')
    expect(b.at(-1)?.kind).toBe('suggest')
  })

  it('offers questions when asked nothing', () => {
    expect(first('').kind).toBe('suggest')
  })
})

describe('the sources hold together', () => {
  it('every FAQ pointer into the reference finds a rule', () => {
    for (const faq of FAQ) {
      if (!faq.grammar) continue
      expect(searchGrammar(faq.grammar).length, `${faq.id} → "${faq.grammar}"`).toBeGreaterThan(0)
    }
  })

  it('every FAQ has keys, an answer and an example to hear', () => {
    for (const faq of FAQ) {
      expect(faq.keys.length, faq.id).toBeGreaterThan(2)
      expect(faq.a.length, faq.id).toBeGreaterThan(120)
      expect(faq.examples?.length ?? 0, faq.id).toBeGreaterThan(0)
    }
  })

  it('FAQ questions are found by their own wording', () => {
    for (const faq of FAQ) {
      expect(findFaq(faq.q, 1)[0]?.id, faq.q).toBe(faq.id)
    }
  })

  it('the corpus knows the course', () => {
    expect(findExamples('bonjour').length).toBeGreaterThan(0)
    expect(findExamples('il y a').length).toBeGreaterThan(0)
  })
})

describe('about an exercise', () => {
  it('leads with the explanation and ends with follow-ups', () => {
    const ex = findExercise('m1l1e1')!
    const b = askAboutExercise(ex).blocks
    expect(b[0].kind).toBe('text')
    expect(b.some((x) => x.kind === 'word')).toBe(true)
    expect(b.at(-1)?.kind).toBe('suggest')
  })
})
