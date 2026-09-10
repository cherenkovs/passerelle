import { shuffle } from '@/lib/utils'
import type { Exercise } from './types'

/**
 * Placement probes — three per module, in module order.
 *
 * Each set asks one thing: can this learner already do what the module
 * teaches? So every item targets the module's defining structure, never its
 * vocabulary — someone can be fluent in the past tense and still not know the
 * word for "aubergine", and a placement test that confuses the two sends them
 * back eight modules for no reason.
 *
 * Everything is recognition (choose or fill from options). Placement is a
 * doorway, not an exam: typing accents under pressure measures keyboards, not
 * French. The bias that remains — recognition flatters ability — is corrected
 * in the search itself, which places at the first stumble rather than the last
 * success (see lib/placement.ts).
 *
 * Options below are written **correct answer first**, because that is far
 * easier to read and review. They are therefore useless until shuffled — run
 * every probe through `shuffleOptions` before showing it, or the whole test
 * can be passed by clicking the top choice fifteen times.
 */

/** `Omit` doesn't distribute over a union, so spell it out — otherwise every
 *  kind-specific field (`sentence`, `question`, …) disappears from the type. */
type Unidentified<T> = T extends unknown ? Omit<T, 'id'> : never

function probes(moduleId: string, items: Unidentified<Exercise>[]): Exercise[] {
  return items.map((item, i) => ({ ...item, id: `pl_${moduleId}_${i + 1}` }) as Exercise)
}

/** Randomise option order, keeping the right answer pointed at the right text. */
export function shuffleOptions(ex: Exercise): Exercise {
  if (ex.kind === 'mcq' || ex.kind === 'listen') {
    const order = shuffle(ex.options.map((_, i) => i))
    return { ...ex, options: order.map((i) => ex.options[i]), answer: order.indexOf(ex.answer) }
  }
  if (ex.kind === 'cloze' && ex.options?.length) {
    // A cloze answer is matched by text, so the chips can move freely.
    return { ...ex, options: shuffle(ex.options) }
  }
  return ex
}

/* ------------------------------------------------------------------ *
 * A0 → A1
 * ------------------------------------------------------------------ */

const m1 = probes('m1', [
  {
    kind: 'cloze',
    prompt: 'Обери правильну форму',
    sentence: 'Je ___ étudiant.',
    answer: ['suis'],
    translation: 'Я студент.',
    options: ['suis', 'es', 'est', 'sommes'],
  },
  {
    kind: 'cloze',
    prompt: 'Обери правильну форму',
    sentence: 'Vous ___ français ?',
    answer: ['êtes'],
    translation: 'Ви француз?',
    options: ['êtes', 'est', 'sommes', 'sont'],
  },
  {
    kind: 'mcq',
    prompt: 'Як сказати «Ми студенти»?',
    question: 'Ми студенти.',
    options: ['Nous sommes étudiants.', 'Nous êtes étudiants.', 'Nous sont étudiants.'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m2 = probes('m2', [
  {
    kind: 'cloze',
    prompt: 'Узгодь прикметник',
    sentence: 'Marie est ___.',
    answer: ['grande'],
    translation: 'Марі висока.',
    options: ['grande', 'grand', 'grands'],
  },
  {
    kind: 'cloze',
    prompt: 'Постав заперечення',
    sentence: 'Je ___ suis pas français.',
    answer: ['ne'],
    translation: 'Я не француз.',
    options: ['ne', 'pas', 'non'],
  },
  {
    kind: 'mcq',
    prompt: 'Який варіант правильний?',
    question: 'Я не розумію.',
    options: ['Je ne comprends pas.', 'Je pas comprends.', 'Je non comprends.'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m3 = probes('m3', [
  {
    kind: 'cloze',
    prompt: 'Обери дієслово',
    sentence: "J'___ vingt ans.",
    answer: ['ai'],
    translation: 'Мені двадцять років.',
    options: ['ai', 'suis', 'est'],
  },
  {
    kind: 'cloze',
    prompt: 'Котра година',
    sentence: '___ trois heures.',
    answer: ['Il est'],
    translation: 'Третя година.',
    options: ['Il est', 'Ils sont', 'Il a'],
  },
  {
    kind: 'mcq',
    prompt: 'Скільки це?',
    question: 'quatre-vingt-dix',
    options: ['90', '80', '70', '60'],
    answer: 0,
    speak: 'quatre-vingt-dix',
  },
])

const m4 = probes('m4', [
  {
    kind: 'cloze',
    prompt: 'Обери артикль',
    sentence: '___ table est grande.',
    answer: ['La'],
    translation: 'Стіл великий.',
    options: ['La', 'Le', 'Les'],
  },
  {
    kind: 'cloze',
    prompt: 'Обери артикль',
    sentence: 'Je voudrais ___ café.',
    answer: ['un'],
    translation: 'Я хотів би каву.',
    options: ['un', 'une', 'des'],
  },
  {
    kind: 'mcq',
    prompt: 'Який рід у слова?',
    question: 'voiture (машина)',
    options: ['une voiture', 'un voiture', 'des voiture'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m5 = probes('m5', [
  {
    kind: 'cloze',
    prompt: 'Присвійний прикметник',
    sentence: "C'est ___ sœur.",
    answer: ['ma'],
    translation: 'Це моя сестра.',
    options: ['ma', 'mon', 'mes'],
  },
  {
    kind: 'cloze',
    prompt: 'Що є в кімнаті',
    sentence: 'Dans la maison, ___ trois chambres.',
    answer: ['il y a'],
    translation: 'У домі три кімнати.',
    options: ['il y a', 'il est', 'ils sont'],
  },
  {
    kind: 'mcq',
    prompt: 'Як сказати «мій друг»?',
    question: 'мій друг (ami — чол. рід)',
    options: ['mon ami', 'ma ami', 'mes ami'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m6 = probes('m6', [
  {
    kind: 'cloze',
    prompt: 'Відміни дієслово',
    sentence: 'Nous ___ français.',
    answer: ['parlons'],
    translation: 'Ми говоримо французькою.',
    options: ['parlons', 'parlez', 'parle'],
  },
  {
    kind: 'cloze',
    prompt: 'Постав запитання',
    sentence: '___-vous français ?',
    answer: ['Parlez'],
    translation: 'Ви говорите французькою?',
    options: ['Parlez', 'Parler', 'Parlons'],
  },
  {
    kind: 'mcq',
    prompt: 'Яке запитання правильне?',
    question: 'Ти любиш каву?',
    options: [
      'Est-ce que tu aimes le café ?',
      'Est-ce que tu aime le café ?',
      'Que tu aimes le café ?',
    ],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m7 = probes('m7', [
  {
    kind: 'cloze',
    prompt: 'Частковий артикль',
    sentence: 'Il mange ___ pain.',
    answer: ['du'],
    translation: 'Він їсть хліб.',
    options: ['du', 'de la', 'des'],
  },
  {
    kind: 'cloze',
    prompt: 'Частковий артикль',
    sentence: 'Je voudrais ___ eau.',
    answer: ["de l'"],
    translation: 'Я хотів би води.',
    options: ["de l'", 'du', 'de la'],
  },
  {
    kind: 'mcq',
    prompt: 'Що змінюється в запереченні?',
    question: 'Я не хочу хліба.',
    options: ['Je ne veux pas de pain.', 'Je ne veux pas du pain.', 'Je ne veux pas le pain.'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m8 = probes('m8', [
  {
    kind: 'cloze',
    prompt: 'Злиття прийменника з артиклем',
    sentence: 'Je vais ___ cinéma.',
    answer: ['au'],
    translation: 'Я йду в кіно.',
    options: ['au', 'à le', 'à la'],
  },
  {
    kind: 'cloze',
    prompt: 'Відміни aller',
    sentence: 'Nous ___ à Paris.',
    answer: ['allons'],
    translation: 'Ми їдемо в Париж.',
    options: ['allons', 'allez', 'vont'],
  },
  {
    kind: 'mcq',
    prompt: 'Найближче майбутнє',
    question: 'Я збираюся працювати.',
    options: ['Je vais travailler.', 'Je vais travaille.', 'Je vais à travailler.'],
    answer: 0,
    optionsAreFrench: true,
  },
])

/* ------------------------------------------------------------------ *
 * A1 → A2
 * ------------------------------------------------------------------ */

const m9 = probes('m9', [
  {
    kind: 'cloze',
    prompt: 'Обери допоміжне дієслово',
    sentence: "J'___ mangé une pomme.",
    answer: ['ai'],
    translation: 'Я з’їв яблуко.',
    options: ['ai', 'suis', 'est'],
  },
  {
    kind: 'cloze',
    prompt: 'Обери допоміжне дієслово',
    sentence: 'Elle ___ allée à Paris.',
    answer: ['est'],
    translation: 'Вона поїхала в Париж.',
    options: ['est', 'a', 'ont'],
  },
  {
    kind: 'mcq',
    prompt: 'Узгодження дієприкметника',
    question: 'Ми приїхали. (arriver, чол. рід множини)',
    options: ['Nous sommes arrivés.', 'Nous avons arrivé.', 'Nous sommes arrivé.'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m10 = probes('m10', [
  {
    kind: 'cloze',
    prompt: 'Порівняння',
    sentence: 'Elle est plus grande ___ moi.',
    answer: ['que'],
    translation: 'Вона вища за мене.',
    options: ['que', 'de', 'comme'],
  },
  {
    kind: 'cloze',
    prompt: 'Порівняння «менш»',
    sentence: "Ce livre est ___ intéressant que l'autre.",
    answer: ['moins'],
    translation: 'Ця книга менш цікава, ніж інша.',
    options: ['moins', 'plus', 'aussi'],
  },
  {
    kind: 'mcq',
    prompt: 'Як буде «найкращий»?',
    question: 'найкращий',
    options: ['le meilleur', 'le plus bon', 'le plus bien'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m11 = probes('m11', [
  {
    kind: 'cloze',
    prompt: 'Вказівний прикметник',
    sentence: '___ robe est jolie.',
    answer: ['Cette'],
    translation: 'Ця сукня гарна.',
    options: ['Cette', 'Ce', 'Ces'],
  },
  {
    kind: 'cloze',
    prompt: 'Займенник кількості',
    sentence: "Des pommes ? J'___ ai trois.",
    answer: ['en'],
    translation: 'Яблука? У мене їх три.',
    options: ['en', 'y', 'les'],
  },
  {
    kind: 'mcq',
    prompt: 'Перед голосною',
    question: 'цей чоловік (homme)',
    options: ['cet homme', 'ce homme', 'cette homme'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m12 = probes('m12', [
  {
    kind: 'cloze',
    prompt: 'Де болить',
    sentence: "J'ai mal ___ tête.",
    answer: ['à la'],
    translation: 'У мене болить голова.',
    options: ['à la', 'au', 'aux'],
  },
  {
    kind: 'cloze',
    prompt: 'Наказовий спосіб на «ви»',
    sentence: 'Monsieur, ___ ce médicament.',
    answer: ['prenez'],
    translation: 'Пане, приймайте ці ліки.',
    options: ['prenez', 'prends', 'prendre'],
  },
  {
    kind: 'mcq',
    prompt: 'Який варіант правильний?',
    question: 'У мене болить горло.',
    options: ['J’ai mal à la gorge.', 'Je suis mal à la gorge.', 'J’ai mal la gorge.'],
    answer: 0,
    optionsAreFrench: true,
  },
])

/* ------------------------------------------------------------------ *
 * A2 → B1
 * ------------------------------------------------------------------ */

const m13 = probes('m13', [
  {
    kind: 'cloze',
    prompt: 'Звичка в минулому',
    sentence: "Quand j'étais petit, je ___ souvent au parc.",
    answer: ['allais'],
    translation: 'Коли я був малим, я часто ходив у парк.',
    options: ['allais', 'suis allé', 'irai'],
  },
  {
    kind: 'cloze',
    prompt: 'Тло чи подія?',
    sentence: 'Il ___ quand le téléphone a sonné.',
    answer: ['dormait'],
    translation: 'Він спав, коли задзвонив телефон.',
    options: ['dormait', 'a dormi', 'dormira'],
  },
  {
    kind: 'mcq',
    prompt: 'Доконаний вид',
    question: 'Я прочитав книгу.',
    options: ['J’ai lu le livre.', 'Je lisais le livre.', 'Je lirai le livre.'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m14 = probes('m14', [
  {
    kind: 'cloze',
    prompt: 'Прямий додаток',
    sentence: 'Tu connais Marie ? Oui, je ___ connais.',
    answer: ['la'],
    translation: 'Ти знаєш Марі? Так, я її знаю.',
    options: ['la', 'lui', 'le'],
  },
  {
    kind: 'cloze',
    prompt: 'Непрямий додаток',
    sentence: 'Mes parents ? Je ___ ai téléphoné hier.',
    answer: ['leur'],
    translation: 'Мої батьки? Я їм подзвонив учора.',
    options: ['leur', 'les', 'y'],
  },
  {
    kind: 'mcq',
    prompt: 'Займенник місця',
    question: 'Я туди йду.',
    options: ['J’y vais.', 'Je le vais.', 'J’en vais.'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m15 = probes('m15', [
  {
    kind: 'cloze',
    prompt: 'Відносний займенник',
    sentence: "C'est le livre ___ j'ai acheté.",
    answer: ['que'],
    translation: 'Це книга, яку я купив.',
    options: ['que', 'qui', 'dont'],
  },
  {
    kind: 'cloze',
    prompt: 'Відносний займенник',
    sentence: 'La ville ___ je suis né est petite.',
    answer: ['où'],
    translation: 'Місто, де я народився, — маленьке.',
    options: ['où', 'que', 'qui'],
  },
  {
    kind: 'mcq',
    prompt: 'Із прийменником de',
    question: 'книга, про яку я говорив',
    options: ['le livre dont j’ai parlé', 'le livre que j’ai parlé', 'le livre qui j’ai parlé'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m16 = probes('m16', [
  {
    kind: 'cloze',
    prompt: 'Futur simple',
    sentence: 'Demain, je ___ à Paris.',
    answer: ['partirai'],
    translation: 'Завтра я поїду в Париж.',
    options: ['partirai', 'partirais', 'pars'],
  },
  {
    kind: 'cloze',
    prompt: 'Нереальна умова',
    sentence: "Si j'avais de l'argent, j'___ une maison.",
    answer: ['achèterais'],
    translation: 'Якби я мав гроші, я б купив будинок.',
    options: ['achèterais', 'achèterai', 'achète'],
  },
  {
    kind: 'mcq',
    prompt: 'Найввічливіший варіант',
    question: 'Я хотів би каву.',
    options: ['Je voudrais un café.', 'Je veux un café.', 'Je voulais un café.'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m17 = probes('m17', [
  {
    kind: 'cloze',
    prompt: 'Після il faut que',
    sentence: 'Il faut que tu ___ tout de suite.',
    answer: ['partes'],
    translation: 'Тобі треба піти негайно.',
    options: ['partes', 'pars', 'partiras'],
  },
  {
    kind: 'cloze',
    prompt: 'Після je veux que',
    sentence: "Je veux qu'il ___ là.",
    answer: ['soit'],
    translation: 'Я хочу, щоб він був тут.',
    options: ['soit', 'est', 'sera'],
  },
  {
    kind: 'mcq',
    prompt: 'Після якого звороту йде subjonctif?',
    question: 'Обери сполучник, що вимагає subjonctif',
    options: ['bien que', 'parce que', 'puisque'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m18 = probes('m18', [
  {
    kind: 'cloze',
    prompt: 'Узгодження часів',
    sentence: "Il a dit qu'il ___ fatigué.",
    answer: ['était'],
    translation: 'Він сказав, що втомлений.',
    options: ['était', 'est', 'sera'],
  },
  {
    kind: 'cloze',
    prompt: 'Gérondif',
    sentence: 'Il travaille ___ écoutant de la musique.',
    answer: ['en'],
    translation: 'Він працює, слухаючи музику.',
    options: ['en', 'à', 'de'],
  },
  {
    kind: 'mcq',
    prompt: 'Пасивний стан',
    question: 'Книга була написана Гюго.',
    options: [
      'Le livre a été écrit par Hugo.',
      'Le livre a écrit par Hugo.',
      'Le livre est écrivant par Hugo.',
    ],
    answer: 0,
    optionsAreFrench: true,
  },
])

/* ------------------------------------------------------------------ *
 * B1 → B2
 * ------------------------------------------------------------------ */

const m19 = probes('m19', [
  {
    kind: 'mcq',
    prompt: 'Жива мова',
    question: '«J’sais pas» — що це?',
    options: [
      'Розмовне «je ne sais pas»',
      'Помилка, так не кажуть',
      'Книжна форма, як у літературі',
    ],
    answer: 0,
  },
  {
    kind: 'mcq',
    prompt: 'Регістр',
    question: 'Що доречно сказати на співбесіді?',
    options: ['Je n’ai pas compris.', 'J’ai rien pigé.', 'Je n’ai point saisi.'],
    answer: 0,
    optionsAreFrench: true,
  },
  {
    kind: 'mcq',
    prompt: 'Стриманість французів',
    question: '«Ce n’est pas terrible» означає…',
    options: ['Так собі, не дуже', 'Це жахливо', 'Це чудово'],
    answer: 0,
  },
])

const m20 = probes('m20', [
  {
    kind: 'cloze',
    prompt: 'Складний відносний займенник',
    sentence: 'Le projet ___ je pense est important.',
    answer: ['auquel'],
    translation: 'Проєкт, про який я думаю, важливий.',
    options: ['auquel', 'lequel', 'duquel'],
  },
  {
    kind: 'cloze',
    prompt: 'Неозначений відносний',
    sentence: 'Je ne sais pas ___ tu veux.',
    answer: ['ce que'],
    translation: 'Я не знаю, чого ти хочеш.',
    options: ['ce que', 'ce qui', 'ce dont'],
  },
  {
    kind: 'mcq',
    prompt: 'Підмет чи додаток?',
    question: 'те, що мене цікавить',
    options: ['ce qui m’intéresse', 'ce que m’intéresse', 'ce dont m’intéresse'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m21 = probes('m21', [
  {
    kind: 'cloze',
    prompt: 'Subjonctif passé',
    sentence: "Je regrette qu'il ___ parti.",
    answer: ['soit'],
    translation: 'Шкода, що він пішов.',
    options: ['soit', 'est', 'était'],
  },
  {
    kind: 'cloze',
    prompt: 'Поступка',
    sentence: 'Il ___ beau pleuvoir, je sors quand même.',
    answer: ['a'],
    translation: 'Хай навіть іде дощ, я все одно виходжу.',
    options: ['a', 'est', 'fait'],
  },
  {
    kind: 'mcq',
    prompt: 'Докір самому собі',
    question: 'Я мав би подзвонити.',
    options: ['J’aurais dû appeler.', 'Je devrais appeler.', 'J’ai dû appeler.'],
    answer: 0,
    optionsAreFrench: true,
  },
])

const m22 = probes('m22', [
  {
    kind: 'mcq',
    prompt: 'Ділове листування',
    question: 'Як закінчити діловий лист?',
    options: ['Cordialement,', 'Bisous,', 'Salut,'],
    answer: 0,
    optionsAreFrench: true,
  },
  {
    kind: 'mcq',
    prompt: 'Номіналізація',
    question: 'Перепиши «Les prix ont augmenté» іменником',
    options: ['L’augmentation des prix', 'Les prix augmentant', 'Augmenter les prix'],
    answer: 0,
    optionsAreFrench: true,
  },
  {
    kind: 'mcq',
    prompt: 'Регістр формули',
    question: '«Veuillez agréer, Madame, mes salutations distinguées» — де це доречно?',
    options: ['У формальному листі', 'У повідомленні другові', 'У розмові в кафе'],
    answer: 0,
  },
])

const m23 = probes('m23', [
  {
    kind: 'mcq',
    prompt: 'Ідіома',
    question: 'Il m’a posé un lapin.',
    options: ['Він не прийшов на зустріч', 'Він подарував мені кролика', 'Він мене розсмішив'],
    answer: 0,
    speak: 'Il m’a posé un lapin.',
  },
  {
    kind: 'mcq',
    prompt: 'Обережно з тілом',
    question: 'J’ai mal au cœur.',
    options: ['Мене нудить', 'У мене болить серце', 'Мені сумно'],
    answer: 0,
    speak: 'J’ai mal au cœur.',
  },
  {
    kind: 'mcq',
    prompt: 'Хибний друг',
    question: 'une veste — це…',
    options: ['піджак', 'жилет', 'сорочка'],
    answer: 0,
  },
])

const m24 = probes('m24', [
  {
    kind: 'mcq',
    prompt: 'Літературний час',
    question: '«Il fut» — що це за форма?',
    options: ['Passé simple, трапляється лише в книжках', 'Майбутній час', 'Умовний спосіб'],
    answer: 0,
  },
  {
    kind: 'mcq',
    prompt: 'Мова новин',
    question: 'Le suspect **aurait** volé la voiture.',
    options: ['Нібито викрав — не доведено', 'Викрав би, якби міг', 'Мусив викрасти'],
    answer: 0,
  },
  {
    kind: 'mcq',
    prompt: 'Упізнай форму',
    question: 'Ils partirent.',
    options: ['Вони пішли', 'Вони підуть', 'Вони пішли б'],
    answer: 0,
    speak: 'Ils partirent.',
  },
])

/** Indexed by module, in the same order as the flat module list. */
export const PLACEMENT_PROBES: Exercise[][] = [
  m1,
  m2,
  m3,
  m4,
  m5,
  m6,
  m7,
  m8,
  m9,
  m10,
  m11,
  m12,
  m13,
  m14,
  m15,
  m16,
  m17,
  m18,
  m19,
  m20,
  m21,
  m22,
  m23,
  m24,
]
