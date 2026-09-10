import { describe, expect, it } from 'vitest'
import { getLesson } from './index'
import { GRAMMAR, groupByModule, searchGrammar, withTables } from './reference'

/**
 * The reference is derived, so the risk is not that it breaks — it is that it
 * quietly stops covering things, or that searching for the obvious word fails
 * to find the rule that teaches it. Both look fine on screen.
 */

describe('coverage', () => {
  it('has an entry for every grammar step in the course', () => {
    expect(GRAMMAR.length).toBeGreaterThan(90)
  })

  it('reaches every module — no level is a blank page', () => {
    expect(groupByModule(GRAMMAR)).toHaveLength(24)
  })

  it('spans all four levels', () => {
    expect(new Set(GRAMMAR.map((e) => e.level))).toEqual(new Set(['A1', 'A2', 'B1', 'B2']))
  })

  it('keeps most rules with their table', () => {
    // Tables are the reason to open a reference at all.
    expect(withTables().length).toBeGreaterThan(60)
  })
})

describe('every entry can be acted on', () => {
  it('links to a lesson that actually exists', () => {
    const broken = GRAMMAR.filter((e) => !getLesson(e.lessonId)).map((e) => e.id)
    expect(broken).toEqual([])
  })

  it('has a title and a body — an empty card is worse than none', () => {
    const thin = GRAMMAR.filter((e) => !e.title.trim() || e.body.trim().length < 20).map(
      (e) => e.id,
    )
    expect(thin).toEqual([])
  })

  it('has unique ids, so React keys and lookups stay honest', () => {
    const ids = GRAMMAR.map((e) => e.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
  })
})

describe('searching', () => {
  it('finds the rule by its French grammatical term', () => {
    for (const term of ['subjonctif', 'imparfait', 'conditionnel', 'passé composé', 'lequel']) {
      expect(searchGrammar(term).length, term).toBeGreaterThan(0)
    }
  })

  it('finds the rule by the Ukrainian word for it', () => {
    for (const term of ['артикль', 'заперечення', 'займенник', 'рід', 'наказовий']) {
      expect(searchGrammar(term).length, term).toBeGreaterThan(0)
    }
  })

  it('does not require the learner to type accents', () => {
    // A Ukrainian keyboard makes "é" awkward exactly when the search is needed.
    expect(searchGrammar('passe compose').map((e) => e.id)).toEqual(
      searchGrammar('passé composé').map((e) => e.id),
    )
    expect(searchGrammar('etre').length).toBeGreaterThan(0)
  })

  it('ignores case and stray punctuation', () => {
    expect(searchGrammar('SUBJONCTIF!').length).toBe(searchGrammar('subjonctif').length)
  })

  it('ranks the rule that teaches the thing above its neighbours', () => {
    // Module titles are searchable too, so without ranking "займенник" returned
    // the whole pronouns module — liaison included — in authoring order.
    expect(searchGrammar('subjonctif')[0].title.toLowerCase()).toContain('subjonctif')
    expect(searchGrammar('артикль')[0].title.toLowerCase()).toContain('артикль')
  })

  it('requires every word of a multi-word query', () => {
    const both = searchGrammar('subjonctif тригер')
    expect(both.length).toBeGreaterThan(0)
    expect(both.length).toBeLessThanOrEqual(searchGrammar('subjonctif').length)
  })

  it('returns everything for an empty query, and nothing for nonsense', () => {
    expect(searchGrammar('')).toHaveLength(GRAMMAR.length)
    expect(searchGrammar('   ')).toHaveLength(GRAMMAR.length)
    expect(searchGrammar('щосьчогонемає')).toHaveLength(0)
  })

  it('searches inside tables, not just prose', () => {
    // Looking up a form you saw in a conjugation table should find that table.
    expect(searchGrammar('viendr').length).toBeGreaterThan(0)
  })

  it('can be narrowed to a subset', () => {
    const b2 = GRAMMAR.filter((e) => e.level === 'B2')
    const hits = searchGrammar('subjonctif', b2)
    expect(hits.length).toBeGreaterThan(0)
    expect(hits.every((e) => e.level === 'B2')).toBe(true)
  })
})

describe('grouping', () => {
  it('keeps course order — easiest module first', () => {
    const groups = groupByModule(GRAMMAR)
    expect(groups[0].level).toBe('A1')
    expect(groups[groups.length - 1].level).toBe('B2')
  })

  it('puts each module in exactly one group', () => {
    const ids = groupByModule(GRAMMAR).map((g) => g.moduleId)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('loses no entries in the grouping', () => {
    const total = groupByModule(GRAMMAR).reduce((n, g) => n + g.entries.length, 0)
    expect(total).toBe(GRAMMAR.length)
  })
})
