import {
  ALL_MODULES,
  SCENARIOS,
  STORIES,
  WORDS,
  getWord,
  type Exercise,
  type Word,
} from '@/content'
import { FAQ, type Faq } from '@/content/faq'
import { GRAMMAR, searchGrammar, type GrammarEntry } from '@/content/reference'
import { conjugate, infinitiveOf, isConjugable, type Conjugation, type Tense } from './conjugate'
import { lookupWord, type Gloss } from './gloss'
import { normalize, stripDiacritics } from './grade'

/**
 * The professor.
 *
 * Not a language model, and honest about it. A model would answer anything,
 * fluently, and be wrong about French grammar often enough to teach the
 * mistakes — which for a learner is worse than no answer. This one answers
 * from what the course actually contains: the dictionary, the hundred-odd
 * grammar rules, a conjugator, the FAQ, and every example sentence in every
 * lesson, story and dialogue. It says "I don't have that" when it doesn't.
 *
 * The work is in reading the question. A learner writes "як буде вчора",
 * "провідміняй prendre", "чому тут de а не du", "prends", "що означає
 * pourtant" — each wants a different source, and the same source phrased two
 * ways. So the question is classified first, and each class knows where to
 * look and what to show.
 */

export type Block =
  | { kind: 'text'; text: string }
  | { kind: 'word'; word: Word }
  | { kind: 'phrase'; glosses: { token: string; gloss: Gloss | null }[] }
  | { kind: 'conjugation'; conjugation: Conjugation; tense?: Tense }
  | { kind: 'grammar'; entry: GrammarEntry }
  | { kind: 'faq'; faq: Faq }
  | { kind: 'words'; title: string; words: Word[] }
  | { kind: 'examples'; items: Example[] }
  | { kind: 'pronounce'; text: string; ipa?: string }
  | { kind: 'suggest'; questions: string[] }

export type Answer = { blocks: Block[] }

export type Example = {
  fr: string
  uk: string
  source: { kind: 'lesson' | 'story' | 'scenario' | 'word'; id: string; title: string }
}

/* ------------------------------------------------------------------ *
 * Reading the question
 * ------------------------------------------------------------------ */

const CYRILLIC = /[Ѐ-ӿ]/

const flat = (s: string) => stripDiacritics(normalize(s))

/** The French in the question, and the Ukrainian, told apart by script. */
function split(q: string): { fr: string; uk: string; frTokens: string[]; ukTokens: string[] } {
  const clean = q
    .replace(/[«»"„“”]/g, ' ')
    .replace(/[?!…]+$/g, '')
    .trim()
  const tokens = clean.split(/\s+/).filter(Boolean)
  const frTokens: string[] = []
  const ukTokens: string[] = []
  for (const t of tokens) {
    const bare = t.replace(/^[.,;:()[\]]+|[.,;:()[\]]+$/g, '')
    if (!bare) continue
    if (CYRILLIC.test(bare)) ukTokens.push(bare)
    else if (/\p{L}/u.test(bare)) frTokens.push(bare)
  }
  return { fr: frTokens.join(' '), uk: ukTokens.join(' '), frTokens, ukTokens }
}

type Intent = 'conjugate' | 'meaning' | 'say' | 'pronounce' | 'explain'

const RX = {
  conjugate: /відмін|провідмін|conjug|спряж|форм[иа] дієслов|дієвідмін|таблиц/,
  tense:
    /у (минулому|майбутньому|теперішньому)|passe compose|imparfait|futur|conditionnel|imperatif|наказов/,
  meaning: /що означа|що таке|переклад|значенн|означає|як переклас|що значить/,
  say: /як сказати|як буде|французьк|по французьк|як каж|як назвати/,
  pronounce: /як читає|як вимовля|вимов|читаєт|транскрипц|звучить/,
}

const TENSE_RX: [RegExp, Tense][] = [
  [/passe compose|минулому|минулий|доконан/, 'passeCompose'],
  [/imparfait|тривал|недоконан/, 'imparfait'],
  [/futur|майбутн/, 'futur'],
  [/conditionnel|умовн/, 'conditionnel'],
  [/imperatif|наказов/, 'imperatif'],
  [/present|теперішн/, 'present'],
]

function classify(q: string, parts: ReturnType<typeof split>): Intent {
  const f = flat(q)
  // A tense named on its own — "passé composé чи imparfait" — is a question
  // about the tense, not a request to conjugate; there has to be a verb.
  if (RX.conjugate.test(f) && findVerb(parts.frTokens)) return 'conjugate'
  // "prendre у минулому": a tense plus an infinitive, spelled out. Not when
  // the shape is a question about a rule — "коли être, а коли avoir".
  if (
    RX.tense.test(f) &&
    !/коли|чому|чи |різниц/.test(f) &&
    parts.frTokens.some((t) => isConjugable(t) && /(er|ir|re)$/.test(t))
  ) {
    return 'conjugate'
  }
  if (RX.pronounce.test(f) && parts.frTokens.length) return 'pronounce'
  if (RX.meaning.test(f) && parts.frTokens.length) return 'meaning'
  if (RX.say.test(f)) return 'say'
  // Bare French, no question around it: they want to know what it is —
  // unless it is the name of a rule the FAQ knows, like "subjonctif".
  if (parts.frTokens.length && parts.ukTokens.length === 0) {
    if (!findWord(parts.fr) && findFaq(q, 1).length) return 'explain'
    return 'meaning'
  }
  // Bare Ukrainian, a word or two: they want the French for it.
  if (!parts.frTokens.length && parts.ukTokens.length <= 2 && !/чому|коли|як|що|чи/.test(f)) {
    return 'say'
  }
  return 'explain'
}

/* ------------------------------------------------------------------ *
 * Sources
 * ------------------------------------------------------------------ */

const VERB_INFINITIVES: string[] = WORDS.filter(
  (w) => w.pos === 'v' && !/\s[A-Z]|\.$/.test(w.fr),
).map((w) => w.fr)

/** Which verb the learner means, from an infinitive or a conjugated form. */
function findVerb(frTokens: string[]): string | null {
  // "se lever" arrives as two tokens, and must be found before "lever" is.
  const joined = frTokens.join(' ').toLowerCase()
  const refl = joined.match(/\bs(?:e |')([a-zéèêàâçîïôûù]+)/)
  if (refl && isConjugable(`se ${refl[1]}`))
    return refl[0].startsWith("s'") ? refl[0] : `se ${refl[1]}`
  for (const t of frTokens) {
    const low = t.toLowerCase()
    if (isConjugable(low) && (WORDS.some((w) => w.fr === low) || /(er|ir|re)$/.test(low))) {
      return low
    }
  }
  for (const t of frTokens) {
    const inf = infinitiveOf(t, VERB_INFINITIVES)
    if (inf) return inf
  }
  return null
}

/** Ukrainian → French, ranked by how exactly a sense matches. */
export function findFrench(uk: string): Word[] {
  const wanted = flat(uk)
  if (!wanted) return []
  const scored: { w: Word; s: number }[] = []
  for (const w of WORDS) {
    const senses = w.uk
      .split(/[,;]/)
      .map((x) => flat(x.replace(/\(.*?\)/g, '')))
      .filter(Boolean)
    let best = 0
    for (const sense of senses) {
      if (sense === wanted) best = Math.max(best, 6)
      else if (sense.startsWith(wanted) || wanted.startsWith(sense)) best = Math.max(best, 3)
      else if (sense.includes(wanted)) best = Math.max(best, 2)
      else if (wanted.length >= 5 && sense.split(' ').some((x) => stem(x) === stem(wanted)))
        best = Math.max(best, 2)
    }
    if (best) scored.push({ w, s: best + (w.rank ? 0.5 : 0) })
  }
  return scored
    .sort((a, b) => b.s - a.s || (a.w.rank ?? 9999) - (b.w.rank ?? 9999))
    .slice(0, 6)
    .map((x) => x.w)
}

/** A crude Ukrainian stem: enough to make "артиклі" and "артикль" meet. */
function stem(word: string): string {
  return word.length > 5 ? word.slice(0, 5) : word
}

/** French → the dictionary, trying the phrase, then the head word, then a form. */
function findWord(fr: string): Word | null {
  const wanted = normalize(fr)
  const exact = WORDS.find((w) => normalize(w.fr) === wanted)
  if (exact) return exact
  const noArticle = wanted.replace(/^(le |la |les |l'|un |une |des )/, '')
  const byHead = WORDS.find(
    (w) => normalize(w.fr).replace(/^(le |la |les |l'|un |une |des )/, '') === noArticle,
  )
  if (byHead) return byHead
  const gloss = lookupWord(fr)
  if (gloss?.word) return gloss.word
  const inf = infinitiveOf(fr, VERB_INFINITIVES)
  if (inf) return WORDS.find((w) => w.fr === inf) ?? null
  return null
}

/**
 * Every example sentence the course has, indexed once, on first use.
 *
 * "Show me pourtant in a sentence" is the question a dictionary cannot answer
 * and a course can: the lessons are full of sentences that were written to
 * illustrate exactly this. Grammar examples, dialogue lines, word examples,
 * story paragraphs and the tutor's lines all go in.
 */
let corpus: (Example & { key: string })[] | null = null

function buildCorpus() {
  const out: (Example & { key: string })[] = []
  const add = (fr: string, uk: string, source: Example['source']) => {
    const clean = fr.replace(/^[❌✅]\s*/, '').replace(/\s*→.*$/, '')
    if (!clean || clean.startsWith('❌')) return
    out.push({ fr: clean, uk, source, key: ` ${flat(clean)} ` })
  }
  for (const m of ALL_MODULES) {
    for (const l of m.lessons) {
      const src = { kind: 'lesson' as const, id: l.id, title: l.title }
      for (const step of l.steps) {
        if (step.kind === 'grammar') for (const ex of step.examples ?? []) add(ex.fr, ex.uk, src)
        if (step.kind === 'dialogue') for (const line of step.lines) add(line.fr, line.uk, src)
      }
    }
  }
  for (const w of WORDS) {
    if (w.example) add(w.example.fr, w.example.uk, { kind: 'word', id: w.id, title: w.fr })
  }
  for (const s of STORIES) {
    const src = { kind: 'story' as const, id: s.id, title: s.title }
    for (const p of s.paragraphs) {
      // Paragraphs are long; a sentence is what the learner wants to see.
      const frs = p.fr.split(/(?<=[.!?])\s+/)
      const uks = p.uk.split(/(?<=[.!?])\s+/)
      frs.forEach((f, i) => add(f, uks[i] ?? p.uk, src))
    }
  }
  for (const sc of SCENARIOS) {
    const src = { kind: 'scenario' as const, id: sc.id, title: sc.title }
    for (const t of sc.turns) {
      add(t.teacher.fr, t.teacher.uk, src)
      add(t.expected.fr, t.expected.uk, src)
    }
  }
  return out
}

export function findExamples(fr: string, limit = 4): Example[] {
  corpus ??= buildCorpus()
  const wanted = ` ${flat(fr)} `
  if (wanted.trim().length < 2) return []
  const hits = corpus.filter((e) => e.key.includes(wanted))
  // Shorter sentences first: they show the word, not a paragraph around it.
  return hits
    .sort((a, b) => a.fr.length - b.fr.length)
    .slice(0, limit)
    .map(({ key: _key, ...e }) => e)
}

/** The FAQ entries a question is about, best first. */
export function findFaq(q: string, limit = 2, minScore = 2): Faq[] {
  const f = flat(q).replace(/\//g, ' ')
  const tokens = f.split(' ').filter((t) => t.length >= 2)
  const scored: { faq: Faq; s: number }[] = []
  for (const faq of FAQ) {
    let s = 0
    // The entry's own question, word for word: the closer the learner's
    // phrasing is to it, the more certainly this is the one they mean.
    for (const t of flat(faq.q).replace(/\//g, ' ').split(' ')) {
      if (t.length >= 3 && tokens.includes(t)) s += 1.5
    }
    for (const key of faq.keys) {
      const k = flat(key)
      if (k.includes(' ')) {
        if (f.includes(k)) s += 4
        continue
      }
      for (const t of tokens) {
        if (t === k) s += 3
        else if (k.length >= 4 && t.length >= 4 && (t.startsWith(k) || k.startsWith(t))) s += 2
      }
    }
    if (s >= minScore) scored.push({ faq, s })
  }
  return scored
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.faq)
}

const STOP = new Set([
  'чому',
  'коли',
  'як',
  'що',
  'чи',
  'де',
  'тут',
  'там',
  'це',
  'цей',
  'ця',
  'а',
  'і',
  'та',
  'не',
  'ні',
  'або',
  'але',
  'для',
  'про',
  'на',
  'у',
  'в',
  'з',
  'із',
  'до',
  'від',
  'по',
  'при',
  'мені',
  'мене',
  'треба',
  'потрібно',
  'можна',
  'пояснити',
  'поясни',
  'скажи',
  'розкажи',
  'будь',
  'ласка',
])

/**
 * Grammar entries for a question, without requiring every word to match.
 *
 * The reference search wants all terms present, which is right for a lookup
 * and wrong for a question: "чому тут de а не du" contains nothing the rule
 * would say in those words. So each content word is searched alone, and the
 * rules are ranked by how many of the words they answered.
 */
export function findGrammar(q: string, limit = 2): GrammarEntry[] {
  const whole = searchGrammar(q)
  if (whole.length) return whole.slice(0, limit)

  const tokens = flat(q)
    .split(' ')
    .filter((t) => t.length >= 3 && !STOP.has(t))
  const votes = new Map<string, { entry: GrammarEntry; n: number; best: number }>()
  for (const t of tokens) {
    searchGrammar(t).forEach((entry, i) => {
      const v = votes.get(entry.id) ?? { entry, n: 0, best: 99 }
      v.n += 1
      v.best = Math.min(v.best, i)
      votes.set(entry.id, v)
    })
  }
  return [...votes.values()]
    .sort((a, b) => b.n - a.n || a.best - b.best)
    .slice(0, limit)
    .map((v) => v.entry)
}

/* ------------------------------------------------------------------ *
 * Answering
 * ------------------------------------------------------------------ */

export const SUGGESTIONS = [
  'Провідміняй être',
  'Як сказати «дякую»?',
  'Що означає pourtant?',
  'Коли un/une, а коли le/la?',
  'Passé composé чи imparfait?',
  'Як читається plus?',
  'Чому j’ai 25 ans, а не je suis?',
  'Покажи приклади з depuis',
]

function tenseIn(q: string): Tense | undefined {
  const f = flat(q)
  for (const [rx, tense] of TENSE_RX) if (rx.test(f)) return tense
  return undefined
}

export function ask(question: string): Answer {
  const q = question.trim()
  if (!q) return { blocks: [{ kind: 'suggest', questions: SUGGESTIONS }] }

  const parts = split(q)
  const intent = classify(q, parts)
  const blocks: Block[] = []

  if (intent === 'conjugate') {
    const verb = findVerb(parts.frTokens)
    const c = verb ? conjugate(verb) : null
    if (c) {
      blocks.push({ kind: 'conjugation', conjugation: c, tense: tenseIn(q) })
      const w = findWord(c.infinitive)
      if (w) blocks.push({ kind: 'word', word: w })
      const ex = findExamples(c.base, 3)
      if (ex.length) blocks.push({ kind: 'examples', items: ex })
      return { blocks }
    }
    blocks.push({
      kind: 'text',
      text: `Не впізнаю дієслово в «${parts.fr || q}». Напиши інфінітив — наприклад, *prendre* або *se lever*.`,
    })
    return { blocks }
  }

  if (intent === 'pronounce') {
    const w = findWord(parts.fr)
    blocks.push({ kind: 'pronounce', text: w?.fr ?? parts.fr, ipa: w?.ipa })
    if (w) blocks.push({ kind: 'word', word: w })
    for (const faq of findFaq(q, 1)) blocks.push({ kind: 'faq', faq })
    return { blocks }
  }

  if (intent === 'meaning') {
    const w = findWord(parts.fr)
    if (w) {
      blocks.push({ kind: 'word', word: w })
      if (w.pos === 'v') {
        const c = conjugate(w.fr)
        if (c) blocks.push({ kind: 'conjugation', conjugation: c, tense: 'present' })
      }
    } else if (parts.frTokens.length > 1) {
      // A phrase: gloss it word by word, which is often the whole answer.
      blocks.push({
        kind: 'phrase',
        glosses: parts.frTokens.map((token) => ({ token, gloss: lookupWord(token) })),
      })
    } else {
      const g = lookupWord(parts.fr)
      if (g) blocks.push({ kind: 'phrase', glosses: [{ token: parts.fr, gloss: g }] })
    }
    const ex = findExamples(w?.fr.replace(/^(le |la |les |l'|un |une |des )/, '') ?? parts.fr, 4)
    if (ex.length) blocks.push({ kind: 'examples', items: ex })
    // "що таке liaison" is not a dictionary question but a rule's name.
    if (!blocks.length) for (const faq of findFaq(q, 1)) blocks.push({ kind: 'faq', faq })
    if (!blocks.length) {
      blocks.push({
        kind: 'text',
        text: `«${parts.fr}» немає в словнику курсу. Спробуй початкову форму слова, або запитай про фразу, у якій воно трапилось.`,
      })
    }
    return { blocks }
  }

  if (intent === 'say') {
    const uk = parts.uk
      .replace(/^(як сказати|як буде|як кажуть|як назвати)\s*/i, '')
      .replace(/\s*(французькою|по французьки|по-французьки)\s*$/i, '')
      .trim()
    const words = uk ? findFrench(uk) : []
    if (words.length) {
      blocks.push({ kind: 'words', title: `«${uk}» французькою`, words })
      const ex = findExamples(words[0].fr.replace(/^(le |la |les |l'|un |une |des )/, ''), 2)
      if (ex.length) blocks.push({ kind: 'examples', items: ex })
    } else {
      blocks.push({
        kind: 'text',
        text: `Не знайшов «${uk || q}» у словнику курсу. Спробуй інше слово або коротше формулювання — словник знає 1300 найуживаніших слів.`,
      })
    }
    for (const faq of findFaq(q, 1)) blocks.push({ kind: 'faq', faq })
    return { blocks }
  }

  // explain
  const faqs = findFaq(q, 2)
  for (const faq of faqs) blocks.push({ kind: 'faq', faq })
  const seen = new Set(faqs.map((f) => f.grammar).filter(Boolean))
  const grammar = findGrammar(q, faqs.length ? 1 : 2).filter(
    (e) => ![...seen].some((g) => g && searchGrammar(g)[0]?.id === e.id),
  )
  for (const entry of grammar) blocks.push({ kind: 'grammar', entry })

  // "приклади з X" — the examples are the answer.
  if (/приклад/.test(flat(q)) && parts.fr) {
    const ex = findExamples(parts.fr, 6)
    if (ex.length) blocks.unshift({ kind: 'examples', items: ex })
  } else if (parts.fr) {
    const w = findWord(parts.fr)
    if (w && !blocks.some((b) => b.kind === 'word')) blocks.push({ kind: 'word', word: w })
  }

  if (!blocks.length) {
    blocks.push({
      kind: 'text',
      text: 'Про це в курсі поки що нічого немає. Я відповідаю з матеріалів курсу — словника, правил і прикладів — і не вигадую. Спробуй сформулювати інакше, або запитай щось із цього:',
    })
    blocks.push({ kind: 'suggest', questions: SUGGESTIONS.slice(0, 5) })
  }
  return { blocks }
}

/**
 * What to say about an exercise the learner has just got wrong.
 *
 * The explanation the exercise carries comes first — it was written for this
 * exact mistake. Then the words involved, the rule they belong to, and the
 * questions that usually follow.
 */
export function askAboutExercise(ex: Exercise): Answer {
  const blocks: Block[] = []
  if (ex.explain) blocks.push({ kind: 'text', text: ex.explain })

  const words = (ex.words ?? []).map(getWord).filter((w): w is Word => Boolean(w))
  for (const w of words.slice(0, 3)) blocks.push({ kind: 'word', word: w })

  const haystack = [ex.explain ?? '', 'prompt' in ex ? (ex.prompt ?? '') : ''].join(' ').trim()
  if (haystack) {
    // A higher bar than for a typed question: an explanation mentions many
    // words in passing, and "bonne nuit" is not a question about bon/bien.
    for (const faq of findFaq(haystack, 1, 6)) blocks.push({ kind: 'faq', faq })
    for (const entry of findGrammar(haystack, 1)) blocks.push({ kind: 'grammar', entry })
  }

  const verb = words.find((w) => w.pos === 'v')
  const follow = [
    ...(verb ? [`Провідміняй ${verb.fr}`] : []),
    ...(words[0]
      ? [`Покажи приклади з ${words[0].fr.replace(/^(le |la |les |l'|un |une |des )/, '')}`]
      : []),
    'Коли un/une, а коли le/la?',
  ]
  blocks.push({ kind: 'suggest', questions: follow.slice(0, 3) })
  return { blocks }
}

/** How many of each the professor can draw on — for the honest intro line. */
export const PROFESSOR_SOURCES = {
  words: WORDS.length,
  rules: GRAMMAR.length,
  faq: FAQ.length,
}
