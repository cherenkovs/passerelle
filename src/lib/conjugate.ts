/**
 * A French conjugator, rule-based.
 *
 * The professor has to answer "провідміняй prendre" without a server and
 * without guessing, so the rules live here in full: the three regular groups
 * with their spelling changes, the auxiliaries, and a table of the irregular
 * verbs a learner meets before B2. Anything derived from one of those — every
 * -prendre, -venir, -mettre — is conjugated from its base with the prefix put
 * back, which is how the language itself does it.
 *
 * Eight tenses: the four a learner uses in conversation, the conditional, the
 * imperative, the subjunctive, and the pluperfect. The subjunctive is built
 * the way the language builds it — the ils-stem for je/tu/il/ils, the nous-
 * stem for nous/vous — with the handful of verbs that break even that rule
 * written out in full.
 */

export type Person = 0 | 1 | 2 | 3 | 4 | 5

export type Tense =
  | 'present'
  | 'passeCompose'
  | 'imparfait'
  | 'plusQueParfait'
  | 'futur'
  | 'conditionnel'
  | 'subjonctif'
  | 'imperatif'

export const TENSES: { id: Tense; fr: string; uk: string; hint: string }[] = [
  { id: 'present', fr: 'présent', uk: 'теперішній', hint: 'що відбувається зараз або зазвичай' },
  {
    id: 'passeCompose',
    fr: 'passé composé',
    uk: 'минулий (доконаний)',
    hint: 'що сталося: avoir/être + дієприкметник',
  },
  {
    id: 'imparfait',
    fr: 'imparfait',
    uk: 'минулий (тривалий)',
    hint: 'що було, тривало, повторювалося',
  },
  {
    id: 'plusQueParfait',
    fr: 'plus-que-parfait',
    uk: 'давноминулий',
    hint: 'що сталося раніше за іншу минулу подію',
  },
  { id: 'futur', fr: 'futur simple', uk: 'майбутній', hint: 'що буде' },
  { id: 'conditionnel', fr: 'conditionnel', uk: 'умовний', hint: 'що було б; ввічливе прохання' },
  {
    id: 'subjonctif',
    fr: 'subjonctif',
    uk: 'суб’юнктив',
    hint: 'після que: бажання, необхідність, емоція, сумнів',
  },
  { id: 'imperatif', fr: 'impératif', uk: 'наказовий', hint: 'зроби! зробімо! зробіть!' },
]

export type Conjugation = {
  infinitive: string
  /** The verb without its reflexive pronoun, when it has one. */
  base: string
  reflexive: boolean
  group: '1' | '2' | '3'
  auxiliary: 'avoir' | 'être'
  participle: string
  /** Six forms, je → ils, with the pronoun already attached. */
  tenses: Record<Exclude<Tense, 'imperatif'>, string[]> & { imperatif: string[] }
  /** Something worth knowing about this verb, in Ukrainian. */
  note?: string
}

const PRONOUNS = ['je', 'tu', 'il / elle', 'nous', 'vous', 'ils / elles'] as const
const REFLEXIVE = ['me', 'te', 'se', 'nous', 'vous', 'se'] as const

const VOWEL = /^[aeiouyàâäéèêëïîôöùûüh]/i

/** "je" and "me" elide before a vowel or mute h: j'aime, je m'appelle. */
function elide(pronoun: string, form: string): string {
  if (!VOWEL.test(form)) return `${pronoun} ${form}`
  if (pronoun === 'je') return `j'${form}`
  if (pronoun === 'me' || pronoun === 'te' || pronoun === 'se') return `${pronoun[0]}'${form}`
  return `${pronoun} ${form}`
}

/* ------------------------------------------------------------------ *
 * Regular groups
 * ------------------------------------------------------------------ */

const ER_PRESENT = ['e', 'es', 'e', 'ons', 'ez', 'ent']
const IR_PRESENT = ['is', 'is', 'it', 'issons', 'issez', 'issent']
const RE_PRESENT = ['s', 's', '', 'ons', 'ez', 'ent']
const IMPARFAIT = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient']
const FUTUR = ['ai', 'as', 'a', 'ons', 'ez', 'ont']
const SUBJ = ['e', 'es', 'e', 'ions', 'iez', 'ent']

/**
 * The subjunctive from two stems.
 *
 * je/tu/il/ils take the ils-form of the present without -ent; nous/vous take
 * the nous-form without -ons, which is also the imperfect stem. For a regular
 * verb the two stems are the same; for prendre, venir, boire, devoir they
 * differ, and this is exactly what makes "que je prenne / que nous prenions".
 */
function subjunctive(present: string[], imparfaitStem: string): string[] {
  const ils = present[5].replace(/ent$/, '')
  return SUBJ.map((end, i) => (i === 3 || i === 4 ? imparfaitStem : ils) + end)
}

/**
 * First-group verbs whose stem changes before a silent ending.
 *
 * Only the ones that cannot be told from the spelling alone. -cer and -ger are
 * detected; e/é + consonant + er is detected; but "appeler" doubles its l where
 * "geler" takes a grave accent, and nothing in the letters says which.
 */
const DOUBLING = new Set([
  'appeler',
  'rappeler',
  'jeter',
  'rejeter',
  'projeter',
  'renouveler',
  'épeler',
  'ficeler',
  'feuilleter',
])
const GRAVE_ACCENT = new Set([
  'acheter',
  'racheter',
  'geler',
  'congeler',
  'dégeler',
  'peler',
  'lever',
  'élever',
  'enlever',
  'relever',
  'mener',
  'amener',
  'emmener',
  'promener',
  'ramener',
  'peser',
  'semer',
  'achever',
  'crever',
])

/** The five "silent" persons — je, tu, il, ils — where a stem change applies. */
const SILENT = new Set<Person>([0, 1, 2, 5])

function erStem(inf: string, person: Person, before: 'e' | 'a' | 'o' | 'future'): string {
  const stem = inf.slice(0, -2)
  const silent = SILENT.has(person)

  if (before === 'future') {
    // The changed stem runs through the whole future and conditional.
    if (DOUBLING.has(inf)) return stem + stem[stem.length - 1]
    if (GRAVE_ACCENT.has(inf)) return graveify(stem)
    if (/[aeiouy]yer$/.test(inf) && !inf.endsWith('ayer')) return stem.slice(0, -1) + 'i'
    if (inf.endsWith('ayer')) return stem.slice(0, -1) + 'i'
    return stem
  }

  if (before === 'e' && silent) {
    if (DOUBLING.has(inf)) return stem + stem[stem.length - 1]
    if (GRAVE_ACCENT.has(inf)) return graveify(stem)
    if (/é[^aeiouyéèêàâ]+$/.test(stem)) return stem.replace(/é([^aeiouyéèêàâ]+)$/, 'è$1')
    if (inf.endsWith('yer')) return stem.slice(0, -1) + 'i'
  }
  if (before === 'o' || before === 'a') {
    if (inf.endsWith('cer')) return stem.slice(0, -1) + 'ç'
    if (inf.endsWith('ger')) return stem + 'e'
  }
  return stem
}

/** lever → lèv-, acheter → achèt-: the last e before the final consonant. */
function graveify(stem: string): string {
  return stem.replace(/e([^aeiouyéèêàâ]+)$/, 'è$1')
}

function regularEr(inf: string): Omit<Conjugation, 'infinitive' | 'base' | 'reflexive'> {
  const present = ER_PRESENT.map((end, i) => {
    const p = i as Person
    return erStem(inf, p, end.startsWith('o') ? 'o' : 'e') + end
  })
  const imparfait = IMPARFAIT.map(
    (end, i) => erStem(inf, i as Person, end.startsWith('a') ? 'a' : 'e') + end,
  )
  const fut = erStem(inf, 0, 'future') + 'er'
  return {
    group: '1',
    auxiliary: 'avoir',
    participle: inf.slice(0, -2) + 'é',
    tenses: {
      present,
      imparfait,
      futur: FUTUR.map((e) => fut + e),
      conditionnel: IMPARFAIT.map((e) => fut + e),
      subjonctif: subjunctive(present, erStem(inf, 3, 'e')),
      passeCompose: [],
      plusQueParfait: [],
      // The tu form loses its s: parle !, not parles ! (it comes back before
      // y and en — vas-y — which is a lesson, not a table.)
      imperatif: [present[0], present[3], present[4]],
    },
  }
}

function regularIr(inf: string): Omit<Conjugation, 'infinitive' | 'base' | 'reflexive'> {
  const stem = inf.slice(0, -2)
  const present = IR_PRESENT.map((e) => stem + e)
  return {
    group: '2',
    auxiliary: 'avoir',
    participle: stem + 'i',
    tenses: {
      present,
      imparfait: IMPARFAIT.map((e) => stem + 'iss' + e),
      futur: FUTUR.map((e) => inf + e),
      conditionnel: IMPARFAIT.map((e) => inf + e),
      subjonctif: subjunctive(present, stem + 'iss'),
      passeCompose: [],
      plusQueParfait: [],
      imperatif: [present[1], present[3], present[4]],
    },
  }
}

function regularRe(inf: string): Omit<Conjugation, 'infinitive' | 'base' | 'reflexive'> {
  const stem = inf.slice(0, -2)
  const present = RE_PRESENT.map((e) => stem + e)
  const fut = inf.slice(0, -1)
  return {
    group: '3',
    auxiliary: 'avoir',
    participle: stem + 'u',
    tenses: {
      present,
      imparfait: IMPARFAIT.map((e) => stem + e),
      futur: FUTUR.map((e) => fut + e),
      conditionnel: IMPARFAIT.map((e) => fut + e),
      subjonctif: subjunctive(present, stem),
      passeCompose: [],
      plusQueParfait: [],
      imperatif: [present[1], present[3], present[4]],
    },
  }
}

/* ------------------------------------------------------------------ *
 * Irregular verbs
 * ------------------------------------------------------------------ */

type Irregular = {
  present: [string, string, string, string, string, string]
  participle: string
  /** Future stem, when it is not the infinitive. */
  futur?: string
  /** Imperfect stem, when it is not the nous-form minus -ons. */
  imparfait?: string
  auxiliary?: 'être'
  /** Explicit forms, or null for a verb that has no imperative at all. */
  imperatif?: [string, string, string] | null
  /** Full subjunctive, for the few verbs the two-stem rule does not reach. */
  subjonctif?: [string, string, string, string, string, string]
  note?: string
}

/**
 * Keyed by the base verb. A verb that ends in one of these keys — comprendre,
 * devenir, permettre — is conjugated as the key with its prefix put back.
 * Longer keys are tried first so "paraître" matches before "-aître" would.
 */
const IRREGULAR: Record<string, Irregular> = {
  être: {
    present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
    participle: 'été',
    futur: 'ser',
    imparfait: 'ét',
    imperatif: ['sois', 'soyons', 'soyez'],
    subjonctif: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'],
    note: 'Єдине дієслово, чий imparfait не береться з форми nous: ét-.',
  },
  avoir: {
    present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
    participle: 'eu',
    futur: 'aur',
    imperatif: ['aie', 'ayons', 'ayez'],
    subjonctif: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'],
    note: 'Вік, голод, спрага, страх — усе через avoir: j’ai 25 ans, j’ai faim.',
  },
  aller: {
    present: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
    participle: 'allé',
    futur: 'ir',
    auxiliary: 'être',
    imperatif: ['va', 'allons', 'allez'],
    subjonctif: ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'],
    note: 'Aller + інфінітив = найближче майбутнє: je vais partir — я зараз піду.',
  },
  faire: {
    present: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
    participle: 'fait',
    futur: 'fer',
    subjonctif: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent'],
    note: 'Faisons читається [fə.zɔ̃] — з «ə», хоч пишеться ai.',
  },
  venir: {
    present: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'],
    participle: 'venu',
    futur: 'viendr',
    auxiliary: 'être',
    note: 'Venir de + інфінітив = щойно зробив: je viens de manger.',
  },
  tenir: {
    present: ['tiens', 'tiens', 'tient', 'tenons', 'tenez', 'tiennent'],
    participle: 'tenu',
    futur: 'tiendr',
  },
  prendre: {
    present: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
    participle: 'pris',
    note: 'В однині d зберігається, у множині зникає: prends → prenons.',
  },
  mettre: {
    present: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'],
    participle: 'mis',
  },
  pouvoir: {
    present: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'],
    participle: 'pu',
    futur: 'pourr',
    imperatif: null,
    subjonctif: ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent'],
    note: 'Немає наказового способу — не можна наказати «могти».',
  },
  vouloir: {
    present: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'],
    participle: 'voulu',
    futur: 'voudr',
    imperatif: ['veuille', 'veuillons', 'veuillez'],
    subjonctif: ['veuille', 'veuilles', 'veuille', 'voulions', 'vouliez', 'veuillent'],
    note: 'Je voudrais (conditionnel) — ввічливе «я хотів би». Je veux звучить різко.',
  },
  devoir: {
    present: ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'],
    participle: 'dû',
    futur: 'devr',
  },
  savoir: {
    present: ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'],
    participle: 'su',
    futur: 'saur',
    imperatif: ['sache', 'sachons', 'sachez'],
    subjonctif: ['sache', 'saches', 'sache', 'sachions', 'sachiez', 'sachent'],
    note: 'Savoir — знати факт або вміти; connaître — бути знайомим з людиною чи місцем.',
  },
  connaître: {
    present: ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'],
    participle: 'connu',
  },
  paraître: {
    present: ['parais', 'parais', 'paraît', 'paraissons', 'paraissez', 'paraissent'],
    participle: 'paru',
  },
  naître: {
    present: ['nais', 'nais', 'naît', 'naissons', 'naissez', 'naissent'],
    participle: 'né',
    auxiliary: 'être',
  },
  dire: {
    present: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
    participle: 'dit',
    note: 'Vous dites — не «disez». Так само vous faites, vous êtes.',
  },
  lire: {
    present: ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'],
    participle: 'lu',
  },
  écrire: {
    present: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'],
    participle: 'écrit',
  },
  voir: {
    present: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'],
    participle: 'vu',
    futur: 'verr',
  },
  prévoir: {
    present: ['prévois', 'prévois', 'prévoit', 'prévoyons', 'prévoyez', 'prévoient'],
    participle: 'prévu',
  },
  croire: {
    present: ['crois', 'crois', 'croit', 'croyons', 'croyez', 'croient'],
    participle: 'cru',
  },
  boire: {
    present: ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'],
    participle: 'bu',
  },
  recevoir: {
    present: ['reçois', 'reçois', 'reçoit', 'recevons', 'recevez', 'reçoivent'],
    participle: 'reçu',
    futur: 'recevr',
  },
  dormir: {
    present: ['dors', 'dors', 'dort', 'dormons', 'dormez', 'dorment'],
    participle: 'dormi',
  },
  partir: {
    present: ['pars', 'pars', 'part', 'partons', 'partez', 'partent'],
    participle: 'parti',
    auxiliary: 'être',
  },
  sortir: {
    present: ['sors', 'sors', 'sort', 'sortons', 'sortez', 'sortent'],
    participle: 'sorti',
    auxiliary: 'être',
  },
  sentir: {
    present: ['sens', 'sens', 'sent', 'sentons', 'sentez', 'sentent'],
    participle: 'senti',
  },
  servir: {
    present: ['sers', 'sers', 'sert', 'servons', 'servez', 'servent'],
    participle: 'servi',
  },
  ouvrir: {
    present: ['ouvre', 'ouvres', 'ouvre', 'ouvrons', 'ouvrez', 'ouvrent'],
    participle: 'ouvert',
    note: 'Хоч і на -ir, у présent поводиться як дієслово на -er.',
  },
  offrir: {
    present: ['offre', 'offres', 'offre', 'offrons', 'offrez', 'offrent'],
    participle: 'offert',
  },
  souffrir: {
    present: ['souffre', 'souffres', 'souffre', 'souffrons', 'souffrez', 'souffrent'],
    participle: 'souffert',
  },
  courir: {
    present: ['cours', 'cours', 'court', 'courons', 'courez', 'courent'],
    participle: 'couru',
    futur: 'courr',
  },
  mourir: {
    present: ['meurs', 'meurs', 'meurt', 'mourons', 'mourez', 'meurent'],
    participle: 'mort',
    futur: 'mourr',
    auxiliary: 'être',
  },
  vivre: {
    present: ['vis', 'vis', 'vit', 'vivons', 'vivez', 'vivent'],
    participle: 'vécu',
  },
  suivre: {
    present: ['suis', 'suis', 'suit', 'suivons', 'suivez', 'suivent'],
    participle: 'suivi',
    note: 'Je suis — і «я є», і «я слідую». Контекст розсудить.',
  },
  rire: {
    present: ['ris', 'ris', 'rit', 'rions', 'riez', 'rient'],
    participle: 'ri',
  },
  plaire: {
    present: ['plais', 'plais', 'plaît', 'plaisons', 'plaisez', 'plaisent'],
    participle: 'plu',
  },
  conduire: {
    present: ['conduis', 'conduis', 'conduit', 'conduisons', 'conduisez', 'conduisent'],
    participle: 'conduit',
  },
  produire: {
    present: ['produis', 'produis', 'produit', 'produisons', 'produisez', 'produisent'],
    participle: 'produit',
  },
  traduire: {
    present: ['traduis', 'traduis', 'traduit', 'traduisons', 'traduisez', 'traduisent'],
    participle: 'traduit',
  },
  construire: {
    present: ['construis', 'construis', 'construit', 'construisons', 'construisez', 'construisent'],
    participle: 'construit',
  },
  peindre: {
    present: ['peins', 'peins', 'peint', 'peignons', 'peignez', 'peignent'],
    participle: 'peint',
  },
  craindre: {
    present: ['crains', 'crains', 'craint', 'craignons', 'craignez', 'craignent'],
    participle: 'craint',
  },
  joindre: {
    present: ['joins', 'joins', 'joint', 'joignons', 'joignez', 'joignent'],
    participle: 'joint',
  },
  vaincre: {
    present: ['vaincs', 'vaincs', 'vainc', 'vainquons', 'vainquez', 'vainquent'],
    participle: 'vaincu',
  },
  envoyer: {
    present: ['envoie', 'envoies', 'envoie', 'envoyons', 'envoyez', 'envoient'],
    participle: 'envoyé',
    futur: 'enverr',
  },
  falloir: {
    present: ['', '', 'faut', '', '', ''],
    participle: 'fallu',
    futur: 'faudr',
    subjonctif: ['', '', 'faille', '', '', ''],
    note: 'Тільки безособове: il faut — треба. Il faut que + subjonctif.',
  },
  pleuvoir: {
    present: ['', '', 'pleut', '', '', ''],
    participle: 'plu',
    futur: 'pleuvr',
    subjonctif: ['', '', 'pleuve', '', '', ''],
    note: 'Тільки безособове: il pleut — іде дощ.',
  },
  valoir: {
    present: ['vaux', 'vaux', 'vaut', 'valons', 'valez', 'valent'],
    participle: 'valu',
    futur: 'vaudr',
    subjonctif: ['vaille', 'vailles', 'vaille', 'valions', 'valiez', 'vaillent'],
  },
  résoudre: {
    present: ['résous', 'résous', 'résout', 'résolvons', 'résolvez', 'résolvent'],
    participle: 'résolu',
  },
  battre: {
    present: ['bats', 'bats', 'bat', 'battons', 'battez', 'battent'],
    participle: 'battu',
  },
  asseoir: {
    present: ['assieds', 'assieds', 'assied', 'asseyons', 'asseyez', 'asseyent'],
    participle: 'assis',
    futur: 'assiér',
    auxiliary: 'être',
  },
}

/** Verbs that take être in the passé composé (the "house of être"). */
const ETRE_VERBS = new Set([
  'aller',
  'venir',
  'arriver',
  'partir',
  'entrer',
  'sortir',
  'monter',
  'descendre',
  'naître',
  'mourir',
  'rester',
  'tomber',
  'retourner',
  'passer',
  'devenir',
  'revenir',
  'rentrer',
  'parvenir',
  'intervenir',
])

const IRREGULAR_KEYS = Object.keys(IRREGULAR).sort((a, b) => b.length - a.length)

function findIrregular(inf: string): { key: string; prefix: string } | null {
  for (const key of IRREGULAR_KEYS) {
    if (inf === key) return { key, prefix: '' }
    // A prefixed derivative: comprendre = com + prendre. The prefix has to be
    // a real prefix and not, say, the "s" of "sortir" against "ortir".
    if (inf.endsWith(key) && inf.length > key.length) {
      const prefix = inf.slice(0, -key.length)
      if (/^[a-zé]{1,6}$/.test(prefix)) return { key, prefix }
    }
  }
  return null
}

function irregular(inf: string, key: string, prefix: string) {
  const v = IRREGULAR[key]
  const present = v.present.map((f) => (f ? prefix + f : ''))
  const nous = present[3]
  const ipfStem = v.imparfait ? prefix + v.imparfait : nous ? nous.slice(0, -3) : ''
  const futStem = v.futur ? prefix + v.futur : inf.endsWith('e') ? inf.slice(0, -1) : inf
  const impersonal = !present[0]
  const imperatif =
    v.imperatif === null
      ? []
      : v.imperatif
        ? v.imperatif.map((f) => prefix + f)
        : impersonal
          ? []
          : [present[1].replace(/^(.*[ae])s$/, '$1'), present[3], present[4]]
  const auxiliary: 'avoir' | 'être' = v.auxiliary ?? (ETRE_VERBS.has(inf) ? 'être' : 'avoir')
  return {
    group: '3' as const,
    auxiliary,
    participle: prefix + v.participle,
    note: v.note,
    tenses: {
      present,
      imparfait: impersonal
        ? ['', '', ipfStem + 'ait', '', '', '']
        : IMPARFAIT.map((e) => ipfStem + e),
      futur: impersonal ? ['', '', futStem + 'a', '', '', ''] : FUTUR.map((e) => futStem + e),
      conditionnel: impersonal
        ? ['', '', futStem + 'ait', '', '', '']
        : IMPARFAIT.map((e) => futStem + e),
      subjonctif: v.subjonctif
        ? v.subjonctif.map((f) => (f ? prefix + f : ''))
        : impersonal
          ? ['', '', present[2].replace(/t$/, 'e'), '', '', '']
          : subjunctive(present, ipfStem),
      passeCompose: [],
      plusQueParfait: [],
      imperatif,
    },
  }
}

/* ------------------------------------------------------------------ *
 * Assembly
 * ------------------------------------------------------------------ */

/**
 * The participle as it agrees with each subject, for verbs that take être.
 *
 * Shown with the optional endings in brackets, the way a textbook does, since
 * the table does not know who "je" is. The third persons get both forms
 * spelled out — that is where the pronoun itself says the gender.
 */
function agreed(pp: string, person: Person): string {
  switch (person) {
    case 0:
    case 1:
      return `${pp}(e)`
    case 2:
      return `${pp} / ${pp}e`
    case 3:
      return `${pp}(e)s`
    case 4:
      return `${pp}(e)(s)`
    case 5:
      return `${pp}s / ${pp}es`
  }
}

const AVOIR = ['ai', 'as', 'a', 'avons', 'avez', 'ont']
const ETRE = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont']
const AVAIT = ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient']
const ETAIT = ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient']

/** Is this something the conjugator can handle at all? */
export function isConjugable(word: string): boolean {
  const inf = word.trim().toLowerCase()
  const base = inf.replace(/^s(e|')\s*/, '')
  if (findIrregular(base)) return true
  return /^[a-zàâçéèêëîïôûùüÿœ]+(er|ir|re)$/.test(base) && base.length > 3
}

export function conjugate(word: string): Conjugation | null {
  const infinitive = word.trim().toLowerCase().replace(/\s+/g, ' ')
  const reflexive = /^s(e |')/.test(infinitive)
  const base = infinitive.replace(/^s(e |')/, '')
  if (!isConjugable(infinitive)) return null

  const irr = findIrregular(base)
  const core = irr
    ? irregular(base, irr.key, irr.prefix)
    : base.endsWith('er')
      ? regularEr(base)
      : base.endsWith('ir')
        ? regularIr(base)
        : regularRe(base)

  const auxiliary: 'avoir' | 'être' = reflexive || ETRE_VERBS.has(base) ? 'être' : core.auxiliary
  const aux = auxiliary === 'être' ? ETRE : AVOIR

  const attach = (forms: string[]) =>
    forms.map((f, i) => {
      if (!f) return ''
      const p = i as Person
      const pronoun = PRONOUNS[p]
      if (!reflexive) return elide(pronoun, f)
      const refl = elide(REFLEXIVE[p], f)
      return pronoun === 'je' ? `je ${refl}` : `${pronoun} ${refl}`
    })

  /** Auxiliary + participle: the same assembly for both compound tenses. */
  const compound = (auxForms: string[]) =>
    auxForms.map((a, i) => {
      const p = i as Person
      if (!core.tenses.present[i]) return ''
      const pp = auxiliary === 'être' ? agreed(core.participle, p) : core.participle
      if (!reflexive) return `${elide(PRONOUNS[p], a)} ${pp}`
      const refl = elide(REFLEXIVE[p], a)
      return `${PRONOUNS[p]} ${refl} ${pp}`
    })
  const passeCompose = compound(aux)
  const plusQueParfait = compound(auxiliary === 'être' ? ETAIT : AVAIT)

  const imperatif = core.tenses.imperatif.map((f, i) => {
    if (!f) return ''
    if (!reflexive) return f
    // Reflexive imperatives put the pronoun after, with a hyphen: lève-toi.
    const after = ['toi', 'nous', 'vous'][i]
    return `${f}-${after}`
  })

  return {
    infinitive,
    base,
    reflexive,
    group: core.group,
    auxiliary,
    participle: core.participle,
    note: core.note,
    tenses: {
      present: attach(core.tenses.present),
      imparfait: attach(core.tenses.imparfait),
      futur: attach(core.tenses.futur),
      conditionnel: attach(core.tenses.conditionnel),
      // "que" in front, elided before a vowel: que je parle, qu'il parle.
      subjonctif: attach(core.tenses.subjonctif).map((f) =>
        f ? (/^[aeiouy]/i.test(f) ? `qu'${f}` : `que ${f}`) : '',
      ),
      passeCompose,
      plusQueParfait,
      imperatif,
    },
  }
}

/** The pronoun labels in the same order as the six forms. */
export const PERSON_LABELS = PRONOUNS

/**
 * Which infinitive a conjugated form belongs to, from a short list.
 *
 * The professor uses this to recognise "prends" in "що означає prends": each
 * candidate is conjugated and its forms compared. Small lists only — this is a
 * lookup, not a parser.
 */
export function infinitiveOf(form: string, candidates: readonly string[]): string | null {
  const wanted = form.trim().toLowerCase()
  for (const inf of candidates) {
    const c = conjugate(inf)
    if (!c) continue
    for (const tense of Object.values(c.tenses)) {
      for (const full of tense) {
        const bare = full.replace(/^(je |j'|tu |il \/ elle |nous |vous |ils \/ elles )/, '')
        if (bare === wanted || bare.split(' ').pop() === wanted) return inf
      }
    }
    if (c.participle === wanted) return inf
  }
  return null
}
