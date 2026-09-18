import { WORDS, type Word } from '@/content'

/**
 * The word index behind tap-to-translate.
 *
 * Pure data and lookup, kept apart from the React that shows it: the professor
 * answers "що означає prends" with the same index the popover uses, and it
 * should not have to import a component to do so.
 */

/** Function words that carry grammar rather than meaning — worth glossing too. */
const FUNCTION_GLOSS: Record<string, string> = {
  le: 'артикль (чол. рід, означений)',
  la: 'артикль (жін. рід, означений)',
  les: 'артикль (множина, означений)',
  "l'": 'артикль перед голосною',
  un: 'артикль (чол. рід, неозначений)',
  une: 'артикль (жін. рід, неозначений)',
  des: 'артикль (множина, неозначений)',
  du: 'частковий артикль (чол. рід)',
  de: 'прийменник: з, від, про',
  à: 'прийменник: до, в, у',
  et: 'і, та',
  ou: 'або',
  où: 'де, куди',
  mais: 'але',
  que: 'що; ніж',
  qui: 'хто; який',
  ne: 'частка заперечення (перша частина)',
  pas: 'частка заперечення (друга частина)',
  est: 'є (être, 3 ос. одн.)',
  sont: 'є (être, 3 ос. мн.)',
  suis: 'є (être, 1 ос. одн.)',
  es: 'є (être, 2 ос. одн.)',
  sommes: 'є (être, 1 ос. мн.)',
  êtes: 'є (être, 2 ос. мн.)',
  ai: 'маю (avoir, 1 ос. одн.)',
  as: 'маєш (avoir)',
  a: 'має (avoir)',
  avons: 'маємо (avoir)',
  avez: 'маєте (avoir)',
  ont: 'мають (avoir)',
  ce: 'цей',
  cette: 'ця',
  ces: 'ці',
  très: 'дуже',
  plus: 'більше',
  moins: 'менше',
  aussi: 'також',
  bien: 'добре',
  pour: 'для, щоб',
  avec: 'з (разом із)',
  sans: 'без',
  dans: 'у, всередині',
  chez: 'у (когось), до (когось)',
  vers: 'близько, у напрямку',
  puis: 'потім',
  alors: 'тоді, отже',
  encore: 'ще',
  déjà: 'вже',
  toujours: 'завжди',
  jamais: 'ніколи',
  quand: 'коли',
  comme: 'як',
  tout: 'весь, усе',
  même: 'навіть; той самий',
  cela: 'це',
  ça: 'це',
  voilà: 'ось, прошу',
  oui: 'так',
  non: 'ні',
  si: 'якщо; та ні ж',
  y: 'там, туди',
  en: 'цього, їх (займенник); у (країні)',
  se: 'себе (зворотна частка)',
  me: 'мене, мені',
  te: 'тебе, тобі',
  lui: 'йому, їй',
  leur: 'їм; їхній',
  nous: 'ми, нас',
  vous: 'ви, вас',
  mon: 'мій',
  ma: 'моя',
  mes: 'мої',
  son: 'його / її',
  sa: 'його / її',
  ses: 'його / її (мн.)',
}

const ARTICLE_RE = /^(le |la |les |l'|un |une |des |du |de la |de l')/

/** Index every surface form we can cheaply derive from the vocabulary. */
const wordIndex: Map<string, Word> = (() => {
  const map = new Map<string, Word>()
  const add = (form: string, w: Word) => {
    const key = form.trim().toLowerCase()
    if (key && !map.has(key)) map.set(key, w)
  }

  for (const w of WORDS) {
    const base = w.fr.toLowerCase()
    add(base, w)
    add(base.replace(ARTICLE_RE, ''), w)
    // "grand / grande" and "ukrainien / ukrainienne" style entries
    for (const alt of base.split('/')) {
      const cleaned = alt.trim().replace(ARTICLE_RE, '')
      add(cleaned, w)
    }
    // Single-word head forms also match without the article
    const words = base.replace(ARTICLE_RE, '').split(' ')
    if (words.length === 1) add(words[0], w)
  }
  return map
})()

export type Gloss = { fr: string; uk: string; word?: Word; ipa?: string; note?: string }

export function lookupWord(token: string): Gloss | null {
  const clean = token
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/^[«»"„“”([]+|[.,!?;:…«»"„“”)\]]+$/g, '')
  if (!clean) return null

  const direct = wordIndex.get(clean)
  if (direct)
    return { fr: direct.fr, uk: direct.uk, word: direct, ipa: direct.ipa, note: direct.note }

  // Elision: "j'habite" → try "habite" and the infinitive-ish stem.
  if (clean.includes("'")) {
    const after = clean.split("'").pop() ?? ''
    const hit = wordIndex.get(after)
    if (hit) return { fr: hit.fr, uk: hit.uk, word: hit, ipa: hit.ipa, note: hit.note }
    // …and the function words too. Without this "c'est" found nothing, because
    // "est" lives in the grammar glossary rather than in the dictionary.
    const fnAfter = FUNCTION_GLOSS[after]
    if (fnAfter) return { fr: clean, uk: fnAfter }
  }

  const fn = FUNCTION_GLOSS[clean]
  if (fn) return { fr: clean, uk: fn }

  // Conjugated -er verbs: strip the ending and retry the infinitive.
  const stem = clean.replace(/(e|es|ent|ons|ez|é|ée|és)$/, '')
  if (stem.length >= 3) {
    const infinitive = wordIndex.get(`${stem}er`)
    if (infinitive)
      return {
        fr: infinitive.fr,
        uk: infinitive.uk,
        word: infinitive,
        ipa: infinitive.ipa,
        note: 'Форма дієслова ' + infinitive.fr,
      }
  }

  return null
}
