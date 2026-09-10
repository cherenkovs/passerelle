import type { VideoLesson } from './types'
import { VIDEOS_2 } from './videos-2'

/**
 * Listening lessons with an interactive transcript.
 *
 * The built-in ones have no `youtubeId`: the text is voiced by the browser's
 * speech synthesiser, so they work offline and cost nothing. The player also
 * supports embedding a real YouTube video — learners add their own from the
 * Videos screen by pasting a link plus its transcript, and it lands in the same
 * component with the same tap-to-translate behaviour.
 */

const journeeParis: VideoLesson = {
  id: 'journee-paris',
  title: 'Une journée à Paris',
  titleUk: 'Один день у Парижі',
  level: 'A1',
  emoji: '🗼',
  minutes: 5,
  blurb:
    'Розповідь про звичайний день у теперішньому часі. Слухай, читай, натискай на будь-яке слово.',
  transcript: [
    {
      t: 0,
      fr: "Bonjour ! Je m'appelle Camille et j'habite à Paris.",
      uk: 'Добрий день! Мене звати Каміль, і я живу в Парижі.',
    },
    { t: 4, fr: 'Le matin, je me lève à sept heures.', uk: 'Вранці я встаю о сьомій.' },
    { t: 8, fr: 'Je prends un café et je mange un croissant.', uk: 'Я п’ю каву і їм круасан.' },
    {
      t: 12,
      fr: 'Après, je prends le métro pour aller au travail.',
      uk: 'Потім я їду метро на роботу.',
    },
    {
      t: 17,
      fr: 'Je travaille dans un bureau, près de la gare de Lyon.',
      uk: 'Я працюю в офісі, біля Ліонського вокзалу.',
    },
    { t: 22, fr: 'À midi, je déjeune avec mes collègues.', uk: 'Опівдні я обідаю з колегами.' },
    {
      t: 26,
      fr: 'Nous allons souvent dans un petit restaurant à côté.',
      uk: 'Ми часто ходимо в маленький ресторан поруч.',
    },
    {
      t: 31,
      fr: "L'après-midi, je travaille encore trois ou quatre heures.",
      uk: 'Після обіду я працюю ще три-чотири години.',
    },
    {
      t: 36,
      fr: 'Le soir, je rentre à la maison vers dix-huit heures.',
      uk: 'Увечері я повертаюся додому близько вісімнадцятої.',
    },
    {
      t: 41,
      fr: 'Je fais la cuisine, je regarde un film ou je lis un livre.',
      uk: 'Я готую, дивлюся фільм або читаю книгу.',
    },
    { t: 47, fr: 'Le week-end, je ne travaille pas.', uk: 'У вихідні я не працюю.' },
    {
      t: 50,
      fr: 'Je vais au parc, au musée, ou je vois mes amis.',
      uk: 'Я йду в парк, у музей або бачуся з друзями.',
    },
    {
      t: 55,
      fr: "C'est une vie simple, mais j'aime beaucoup ma ville.",
      uk: 'Це просте життя, але я дуже люблю своє місто.',
    },
  ],
  vocab: ['se_lever', 'prendre', 'travailler', 'le_metro', 'le_matin', 'le_soir', 'la_gare'],
  exercises: [
    {
      id: 'v1e1',
      kind: 'mcq',
      prompt: 'О котрій встає Каміль?',
      question: 'À quelle heure se lève-t-elle ?',
      options: ['À six heures', 'À sept heures', 'À huit heures'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'v1e2',
      kind: 'mcq',
      prompt: 'Як вона добирається на роботу?',
      question: 'Comment va-t-elle au travail ?',
      options: ['En bus', 'En métro', 'À pied'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'v1e3',
      kind: 'cloze',
      prompt: 'Відтвори речення з тексту',
      sentence: 'Le matin, je ___ lève à sept heures.',
      answer: ['me'],
      translation: 'Вранці я встаю о сьомій.',
      words: ['se_lever'],
    },
    {
      id: 'v1e4',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Le week-end, je ne travaille pas.',
      translation: 'У вихідні я не працюю.',
    },
    {
      id: 'v1e5',
      kind: 'translate',
      prompt: 'Переклади французькою',
      question: 'Увечері я повертаюся додому.',
      answer: ['le soir, je rentre à la maison', 'le soir je rentre à la maison'],
    },
  ],
}

const commanderCafe: VideoLesson = {
  id: 'commander-cafe',
  title: 'Comment commander au café',
  titleUk: 'Як замовити в кафе',
  level: 'A1',
  emoji: '🥐',
  minutes: 4,
  blurb: 'Справжній діалог у кафе — саме те, що почуєш у перший день у Франції.',
  transcript: [
    {
      t: 0,
      fr: 'Bonjour, monsieur ! Une table pour une personne ?',
      uk: 'Добрий день, пане! Столик на одну особу?',
    },
    {
      t: 4,
      fr: 'Oui, s’il vous plaît. Près de la fenêtre, si possible.',
      uk: 'Так, будь ласка. Біля вікна, якщо можливо.',
    },
    {
      t: 9,
      fr: 'Bien sûr. Voici la carte. Je vous laisse choisir.',
      uk: 'Звісно. Ось меню. Залишу вас обирати.',
    },
    { t: 14, fr: '… Vous avez choisi ?', uk: '…Ви обрали?' },
    {
      t: 17,
      fr: 'Oui. Je voudrais un café allongé et un croissant, s’il vous plaît.',
      uk: 'Так. Я хотів би подовжену каву й круасан, будь ласка.',
    },
    { t: 23, fr: 'Très bien. Et avec ça ? De l’eau ?', uk: 'Дуже добре. І до цього? Води?' },
    { t: 27, fr: 'Oui, une carafe d’eau, merci.', uk: 'Так, карафу води, дякую.' },
    { t: 31, fr: 'Je vous apporte ça tout de suite.', uk: 'Зараз усе принесу.' },
    { t: 35, fr: '… Voilà ! Bon appétit.', uk: '…Прошу! Смачного.' },
    {
      t: 38,
      fr: 'Merci. L’addition, s’il vous plaît, quand vous avez un moment.',
      uk: 'Дякую. Рахунок, будь ласка, коли матимете хвилинку.',
    },
    {
      t: 44,
      fr: 'Bien sûr. Cela fait six euros quarante.',
      uk: 'Звісно. Виходить шість євро сорок.',
    },
    {
      t: 49,
      fr: 'Voilà. Gardez la monnaie. Bonne journée !',
      uk: 'Прошу. Решту залиште. Гарного дня!',
    },
  ],
  vocab: ['je_voudrais', 'laddition', 'la_carte', 'le_cafe', 'sil_vous_plait'],
  exercises: [
    {
      id: 'v2e1',
      kind: 'mcq',
      prompt: 'Що замовив клієнт?',
      question: "Qu'est-ce qu'il a commandé ?",
      options: ['Un thé et du pain', 'Un café et un croissant', 'Un verre de vin'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'v2e2',
      kind: 'mcq',
      prompt: 'Скільки коштує?',
      question: 'Combien ça coûte ?',
      options: ['6,40 €', '6,14 €', '16,40 €'],
      answer: 0,
    },
    {
      id: 'v2e3',
      kind: 'type',
      prompt: 'Як ввічливо попросити рахунок?',
      question: 'рахунок, будь ласка',
      answer: [
        "l'addition, s'il vous plaît",
        "l'addition s'il vous plaît",
        'laddition sil vous plait',
      ],
      accents: true,
      words: ['laddition'],
    },
    {
      id: 'v2e4',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Je voudrais un café, s’il vous plaît.',
      translation: 'Я хотів би каву, будь ласка.',
    },
    {
      id: 'v2e5',
      kind: 'speak',
      prompt: 'Зроби замовлення вголос',
      text: 'Je voudrais un croissant et un café, s’il vous plaît.',
      translation: 'Я хотів би круасан і каву, будь ласка.',
    },
  ],
}

const pourquoiArticles: VideoLesson = {
  id: 'pourquoi-articles',
  title: 'Pourquoi les articles existent',
  titleUk: 'Навіщо французькій артиклі',
  level: 'A2',
  emoji: '🔑',
  minutes: 5,
  blurb:
    'Міні-лекція французькою про те, чому артиклі не можна пропускати. Перше «слухання про мову самою мовою».',
  transcript: [
    {
      t: 0,
      fr: 'En français, on ne dit jamais un nom tout seul.',
      uk: 'У французькій іменник ніколи не вживають самотою.',
    },
    {
      t: 5,
      fr: 'On dit « le livre », « un livre », « du pain » — mais jamais juste « livre ».',
      uk: 'Кажуть «le livre», «un livre», «du pain» — але ніколи просто «livre».',
    },
    {
      t: 12,
      fr: "Pourquoi ? Parce que l'article donne trois informations.",
      uk: 'Чому? Тому що артикль дає три відомості.',
    },
    {
      t: 18,
      fr: 'Premièrement : le genre. « Le » pour le masculin, « la » pour le féminin.',
      uk: 'По-перше: рід. «Le» для чоловічого, «la» для жіночого.',
    },
    {
      t: 25,
      fr: 'Deuxièmement : le nombre. « Le livre », un seul. « Les livres », plusieurs.',
      uk: 'По-друге: число. «Le livre» — один. «Les livres» — кілька.',
    },
    {
      t: 33,
      fr: "C'est important, parce que le « s » du pluriel ne s'entend pas.",
      uk: 'Це важливо, бо «s» множини не чути.',
    },
    {
      t: 39,
      fr: '« Livre » et « livres » — c’est le même son. Seul l’article fait la différence.',
      uk: '«Livre» і «livres» — це той самий звук. Лише артикль показує різницю.',
    },
    {
      t: 47,
      fr: "Troisièmement : est-ce qu'on parle d'une chose connue ou pas ?",
      uk: 'По-третє: чи йдеться про відому річ, чи ні?',
    },
    {
      t: 53,
      fr: "« Un chat » — un chat quelconque. « Le chat » — le chat qu'on connaît.",
      uk: '«Un chat» — якийсь кіт. «Le chat» — той кіт, якого ми знаємо.',
    },
    {
      t: 61,
      fr: "Donc l'article n'est pas un détail. C'est une partie du mot.",
      uk: 'Отже, артикль — не дрібниця. Це частина слова.',
    },
    {
      t: 67,
      fr: 'Apprenez toujours le nom avec son article. Toujours.',
      uk: 'Завжди вчіть іменник разом з артиклем. Завжди.',
    },
  ],
  vocab: ['le_livre', 'le_chat', 'le_pain', 'la_langue', 'le_mot'],
  exercises: [
    {
      id: 'v3e1',
      kind: 'mcq',
      prompt: 'Скільки відомостей дає артикль?',
      question: "Combien d'informations donne l'article ?",
      options: ['Une', 'Deux', 'Trois'],
      answer: 2,
      explain: 'Рід, число та означеність (відома річ чи ні).',
    },
    {
      id: 'v3e2',
      kind: 'mcq',
      prompt: 'Чому артикль показує число?',
      question: 'Pourquoi l’article est important pour le pluriel ?',
      options: [
        'Тому що «s» множини не вимовляється',
        'Тому що іменники не мають множини',
        'Тому що так гарніше',
      ],
      answer: 0,
      explain:
        'livre та livres звучать однаково — різницю чути лише в артиклі: [lə livʁ] проти [le livʁ].',
    },
    {
      id: 'v3e3',
      kind: 'cloze',
      prompt: 'Відтвори речення',
      sentence: 'Apprenez toujours le nom avec son ___.',
      answer: ['article'],
      translation: 'Завжди вчіть іменник разом з артиклем.',
    },
    {
      id: 'v3e4',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: "L'article n'est pas un détail.",
      translation: 'Артикль — не дрібниця.',
    },
  ],
}

/** Ordered by level, so the list reads as a progression. */
const RANK: Record<string, number> = { A0: 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 }

export const VIDEOS: VideoLesson[] = [
  journeeParis,
  commanderCafe,
  pourquoiArticles,
  ...VIDEOS_2,
].sort((a, b) => RANK[a.level] - RANK[b.level])

export function getVideo(id: string) {
  return VIDEOS.find((v) => v.id === id)
}
