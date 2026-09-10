import { describe, expect, it } from 'vitest'
import { CORE_WORDS } from './core'
import type { Word } from './types'
import { WORDS } from './vocab'

/**
 * ~1000 hand-authored entries is exactly the size where duplicates and typos
 * creep in silently: a repeated word shows up twice in the dictionary, a missing
 * gender teaches the wrong article.
 */

/** Same key the merge uses: head form plus part of speech. */
function lexicalKey(w: Word) {
  const ARTICLES = new Set(['le', 'la', 'les', "l'", 'un', 'une', 'des', 'du'])
  const parts = w.fr
    .toLowerCase()
    .replace(/[’]/g, "'")
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean)

  // "le / la journaliste" — skip the bare article and key on the noun itself.
  for (const part of parts) {
    if (ARTICLES.has(part)) continue
    const head = part.replace(/^(le |la |les |l'|un |une |des |du |de la |de l')/, '').trim()
    if (head) return `${head}|${w.pos ?? ''}`
  }

  // Entries that are nothing but articles ("un / une / des") key on themselves.
  return `${w.fr.toLowerCase()}|${w.pos ?? ''}`
}

describe('identifiers', () => {
  it('are unique', () => {
    const ids = WORDS.map((w) => w.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
  })

  it('are ascii slugs', () => {
    expect(WORDS.filter((w) => !/^[a-z0-9_]+$/.test(w.id)).map((w) => w.id)).toEqual([])
  })
})

describe('no word is listed twice', () => {
  it('has no duplicate entries', () => {
    const keys = WORDS.map(lexicalKey)
    const dupes = [...new Set(keys.filter((k, i) => keys.indexOf(k) !== i))]
    expect(dupes).toEqual([])
  })
})

describe('required fields', () => {
  it('every word has a Ukrainian translation', () => {
    expect(WORDS.filter((w) => !w.uk.trim()).map((w) => w.fr)).toEqual([])
  })

  it('every word has IPA', () => {
    expect(WORDS.filter((w) => !w.ipa?.trim()).map((w) => w.fr)).toEqual([])
  })

  it('nouns declare a gender — the whole teaching point', () => {
    // Plural-only nouns (les gens, les vacances) legitimately have none.
    const needsGender = (w: Word) => w.pos === 'n' && !w.gender && !w.fr.startsWith('les ')
    expect(WORDS.filter(needsGender).map((w) => w.fr)).toEqual([])
  })
})

describe('frequency core', () => {
  it('covers about a thousand lemmas', () => {
    expect(CORE_WORDS.length).toBeGreaterThanOrEqual(950)
  })

  it('assigns ranks 1..N with no gaps or repeats', () => {
    const ranks = CORE_WORDS.map((w) => w.rank!).sort((a, b) => a - b)
    expect(ranks).toEqual(Array.from({ length: CORE_WORDS.length }, (_, i) => i + 1))
  })

  it('carries every rank through the merge into the dictionary', () => {
    const ranked = WORDS.filter((w) => typeof w.rank === 'number')
    expect(ranked.length).toBe(CORE_WORDS.length)
  })

  it('keeps the richer authored entry when a course word is also frequent', () => {
    // "bonjour" is authored with an example sentence and is also top-frequency.
    const bonjour = WORDS.find((w) => w.id === 'bonjour')
    expect(bonjour?.example).toBeDefined()
  })
})

describe('Ukrainian-specific traps', () => {
  it('flags plenty of them — this is the differentiator', () => {
    expect(WORDS.filter((w) => w.note?.includes('⚠️')).length).toBeGreaterThanOrEqual(50)
  })
})
