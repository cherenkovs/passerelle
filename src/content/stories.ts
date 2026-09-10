import { STORIES_2 } from './stories-2'
import type { Story } from './types'

/**
 * Graded readers.
 *
 * Two originals written for this course (so the difficulty curve is exact),
 * plus two genuinely public-domain classics — La Fontaine (1668) and Perrault
 * (1697), both long out of copyright.
 *
 * Every paragraph carries a Ukrainian translation that stays hidden until the
 * learner asks for it: comprehensible input works best when you struggle
 * briefly first.
 */

const premierJour: Story = {
  id: 'premier-jour',
  title: 'Le premier jour',
  titleUk: 'Перший день',
  level: 'A1',
  minutes: 6,
  source: 'Оригінальний текст, написаний для цього курсу',
  emoji: '✈️',
  blurb: 'Марина прилітає до Ліона. Проста історія на лексиці перших трьох модулів.',
  paragraphs: [
    {
      fr: 'Maryna arrive à Lyon. Il est huit heures du matin. Elle est fatiguée, mais elle est contente.',
      uk: 'Марина прибуває до Ліона. Восьма година ранку. Вона втомлена, але задоволена.',
    },
    {
      fr: "À l'aéroport, un homme demande : « Bonjour, madame. Vous êtes française ? »",
      uk: 'В аеропорту чоловік запитує: «Добрий день, пані. Ви француженка?»',
    },
    {
      fr: '« Non, je suis ukrainienne », répond Maryna. « Je viens de Kyiv. Je ne parle pas très bien français. »',
      uk: '«Ні, я українка», — відповідає Марина. «Я з Києва. Я не дуже добре говорю французькою».',
    },
    {
      fr: "« Mais si ! Vous parlez bien », dit l'homme. « Vous habitez à Lyon maintenant ? »",
      uk: '«Та ні ж! Ви добре говорите», — каже чоловік. «Ви тепер живете в Ліоні?»',
    },
    {
      fr: "« Oui. J'ai un nouveau travail ici. Je suis ingénieure. »",
      uk: '«Так. У мене тут нова робота. Я інженерка».',
    },
    {
      fr: 'Maryna prend un taxi. Le chauffeur écoute la radio. Elle regarde la ville par la fenêtre.',
      uk: 'Марина бере таксі. Водій слухає радіо. Вона дивиться на місто крізь вікно.',
    },
    {
      fr: 'Les rues sont petites. Il y a des cafés, une boulangerie, une pharmacie. Tout est nouveau.',
      uk: 'Вулиці вузькі. Є кафе, пекарня, аптека. Усе нове.',
    },
    {
      fr: "Devant son immeuble, une voisine dit : « Bonjour ! Vous êtes la nouvelle ? Moi, c'est Camille. »",
      uk: 'Перед її будинком сусідка каже: «Добрий день! Ви нова мешканка? Я Каміль».',
    },
    {
      fr: "« Enchantée. Je m'appelle Maryna. »",
      uk: '«Дуже приємно. Мене звати Марина».',
    },
    {
      fr: '« Enchantée, Maryna. Vous voulez un café ? »',
      uk: '«Дуже приємно, Марино. Хочете кави?»',
    },
    {
      fr: 'Maryna sourit. Le premier jour commence bien.',
      uk: 'Марина усміхається. Перший день починається добре.',
    },
  ],
  glossary: [
    { fr: 'arriver', uk: 'прибувати' },
    { fr: 'fatigué / fatiguée', uk: 'втомлений / втомлена' },
    { fr: 'content / contente', uk: 'задоволений' },
    { fr: "l'aéroport", uk: 'аеропорт' },
    { fr: 'demander', uk: 'питати' },
    { fr: 'répondre', uk: 'відповідати' },
    { fr: 'le chauffeur', uk: 'водій' },
    { fr: "l'immeuble", uk: 'багатоквартирний будинок' },
    { fr: 'la voisine', uk: 'сусідка' },
    { fr: 'sourire', uk: 'усміхатися' },
    { fr: 'Mais si !', uk: 'Та ні ж! (заперечення заперечення)' },
  ],
  questions: [
    {
      id: 'st1q1',
      kind: 'mcq',
      prompt: 'Звідки Марина?',
      question: 'D’où vient Maryna ?',
      options: ['De France', "D'Ukraine", 'De Pologne'],
      answer: 1,
      optionsAreFrench: true,
      explain: 'У тексті: « Je viens de Kyiv » і « je suis ukrainienne ».',
    },
    {
      id: 'st1q2',
      kind: 'mcq',
      prompt: 'Ким вона працює?',
      question: 'Quel est son travail ?',
      options: ['Elle est médecin.', 'Elle est ingénieure.', 'Elle est professeure.'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'st1q3',
      kind: 'type',
      prompt: 'Як звати сусідку? (одне слово)',
      question: 'Comment s’appelle la voisine ?',
      answer: ['camille'],
    },
    {
      id: 'st1q4',
      kind: 'cloze',
      prompt: 'Відтвори речення з тексту',
      sentence: 'Je ne ___ pas très bien français.',
      answer: ['parle'],
      translation: 'Я не дуже добре говорю французькою.',
    },
    {
      id: 'st1q5',
      kind: 'translate',
      prompt: 'Переклади французькою (фраза з тексту)',
      question: 'У мене тут нова робота.',
      answer: ["j'ai un nouveau travail ici"],
    },
  ],
}

const cafeMontmartre: Story = {
  id: 'cafe-montmartre',
  title: 'Un café à Montmartre',
  titleUk: 'Кава на Монмартрі',
  level: 'A2',
  minutes: 7,
  source: 'Оригінальний текст, написаний для цього курсу',
  emoji: '☕',
  blurb: 'Коротка історія в минулому часі — тренує passé composé у природному контексті.',
  paragraphs: [
    {
      fr: "Samedi dernier, je suis allé à Montmartre. Il faisait beau et je n'avais rien à faire.",
      uk: 'Минулої суботи я поїхав на Монмартр. Була гарна погода, і мені не було чого робити.',
    },
    {
      fr: "J'ai pris le métro jusqu'à Anvers, puis j'ai monté les escaliers. Il y avait beaucoup de touristes.",
      uk: 'Я їхав метро до станції Анвер, потім піднявся сходами. Було багато туристів.',
    },
    {
      fr: "En haut, j'ai trouvé un petit café. Le serveur m'a demandé : « Qu'est-ce que vous prenez ? »",
      uk: 'Нагорі я знайшов маленьке кафе. Офіціант запитав: «Що ви замовляєте?»',
    },
    {
      fr: "« Un café et un croissant, s'il vous plaît », j'ai répondu.",
      uk: '«Каву й круасан, будь ласка», — відповів я.',
    },
    {
      fr: "À la table à côté, une femme lisait un livre. Elle avait l'air très concentrée.",
      uk: 'За сусіднім столиком жінка читала книгу. Вона мала дуже зосереджений вигляд.',
    },
    {
      fr: 'Soudain, le vent a tourné les pages de son livre et elle a perdu sa place.',
      uk: 'Раптом вітер перегорнув сторінки її книги, і вона загубила місце, де читала.',
    },
    {
      fr: "Elle a ri. Moi aussi. « C'est toujours comme ça ici », elle a dit. « Le vent de Montmartre. »",
      uk: 'Вона засміялася. Я теж. «Тут завжди так», — сказала вона. «Монмартрський вітер».',
    },
    {
      fr: "Nous avons parlé pendant une heure. Elle s'appelle Léa et elle est prof de dessin.",
      uk: 'Ми говорили годину. Її звати Леа, вона викладачка малювання.',
    },
    {
      fr: "Avant de partir, elle m'a donné son numéro sur un bout de papier.",
      uk: 'Перед тим як піти, вона дала мені свій номер на клаптику паперу.',
    },
    {
      fr: "Ce n'était pas un grand jour. Mais c'était un bon jour.",
      uk: 'Це не був великий день. Але це був хороший день.',
    },
  ],
  glossary: [
    { fr: 'dernier / dernière', uk: 'минулий, останній' },
    { fr: 'il faisait beau', uk: 'була гарна погода' },
    { fr: "l'escalier", uk: 'сходи' },
    { fr: 'en haut', uk: 'нагорі' },
    { fr: 'le serveur', uk: 'офіціант' },
    { fr: 'avoir l’air', uk: 'мати вигляд, здаватися' },
    { fr: 'soudain', uk: 'раптом' },
    { fr: 'le vent', uk: 'вітер' },
    { fr: 'rire (elle a ri)', uk: 'сміятися (вона засміялася)' },
    { fr: 'le dessin', uk: 'малювання' },
    { fr: 'un bout de papier', uk: 'клаптик паперу' },
  ],
  questions: [
    {
      id: 'st2q1',
      kind: 'mcq',
      prompt: 'Як він дістався Монмартру?',
      question: 'Comment est-il allé à Montmartre ?',
      options: ['En bus', 'En métro', 'À pied'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'st2q2',
      kind: 'cloze',
      prompt: 'Встав допоміжне дієслово',
      sentence: 'Je ___ allé à Montmartre.',
      answer: ['suis'],
      translation: 'Я поїхав на Монмартр.',
      options: ['ai', 'suis', 'est'],
      explain: 'aller — дієслово руху → бере être у минулому часі.',
    },
    {
      id: 'st2q3',
      kind: 'mcq',
      prompt: 'Ким працює Леа?',
      question: 'Quel est le métier de Léa ?',
      options: ['Serveuse', 'Prof de dessin', 'Écrivaine'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'st2q4',
      kind: 'type',
      prompt: 'Дієприкметник від «prendre» (з тексту)',
      question: "J'ai ___ le métro.",
      answer: ['pris'],
    },
    {
      id: 'st2q5',
      kind: 'translate',
      prompt: 'Переклади французькою',
      question: 'Ми говорили годину.',
      answer: ['nous avons parlé pendant une heure', 'nous avons parlé une heure'],
    },
  ],
}

const corbeauRenard: Story = {
  id: 'corbeau-renard',
  title: 'Le Corbeau et le Renard',
  titleUk: 'Ворон і Лис',
  level: 'B1',
  minutes: 8,
  source: 'Жан де Лафонтен, «Байки», 1668 — суспільне надбання',
  emoji: '🦊',
  blurb:
    'Найвідоміша французька байка. Кожен школяр у Франції вчить її напам’ять. Мова архаїчна, але саме тому впізнавана.',
  paragraphs: [
    {
      fr: 'Maître Corbeau, sur un arbre perché,\nTenait en son bec un fromage.',
      uk: 'Пан Ворон, сидячи на дереві,\nТримав у дзьобі сир.',
    },
    {
      fr: "Maître Renard, par l'odeur alléché,\nLui tint à peu près ce langage :",
      uk: 'Пан Лис, приваблений запахом,\nПромовив до нього приблизно таке:',
    },
    {
      fr: '« Hé ! bonjour, Monsieur du Corbeau.\nQue vous êtes joli ! que vous me semblez beau ! »',
      uk: '«Гей! Доброго дня, пане Вороне.\nЯкий же ви гарний! Яким прекрасним ви мені здаєтесь!»',
    },
    {
      fr: 'À ces mots le Corbeau ne se sent pas de joie ;\nEt pour montrer sa belle voix,\nIl ouvre un large bec, laisse tomber sa proie.',
      uk: 'На ці слова Ворон не тямиться від радості;\nІ щоб показати свій прекрасний голос,\nВін широко роззявляє дзьоб і впускає здобич.',
    },
    {
      fr: "Le Renard s'en saisit, et dit : « Mon bon Monsieur,\nApprenez que tout flatteur\nVit aux dépens de celui qui l'écoute. »",
      uk: 'Лис хапає її й каже: «Мій добрий пане,\nЗнайте, що всякий підлесник\nЖиве коштом того, хто його слухає».',
    },
    {
      fr: 'Le Corbeau, honteux et confus,\nJura, mais un peu tard, qu’on ne l’y prendrait plus.',
      uk: 'Ворон, засоромлений і збентежений,\nПоклявся, та трохи запізно, що більше на це не спіймається.',
    },
  ],
  glossary: [
    { fr: 'le corbeau', uk: 'ворон' },
    { fr: 'le renard', uk: 'лис' },
    { fr: 'le bec', uk: 'дзьоб' },
    { fr: 'perché', uk: 'умостившись, сидячи (на висоті)' },
    { fr: "l'odeur", uk: 'запах' },
    { fr: 'alléché', uk: 'приваблений' },
    { fr: 'la proie', uk: 'здобич' },
    { fr: 'le flatteur', uk: 'підлесник' },
    { fr: 'aux dépens de', uk: 'коштом когось' },
    { fr: 'honteux', uk: 'засоромлений' },
    { fr: 'jurer', uk: 'клястися' },
  ],
  questions: [
    {
      id: 'st3q1',
      kind: 'mcq',
      prompt: 'Що тримав ворон?',
      question: 'Que tenait le Corbeau ?',
      options: ['Un fromage', 'Un morceau de pain', 'Une pomme'],
      answer: 0,
      optionsAreFrench: true,
    },
    {
      id: 'st3q2',
      kind: 'mcq',
      prompt: 'Яка мораль байки?',
      question: 'Quelle est la morale ?',
      options: ['Не варто довіряти підлесникам', 'Не варто їсти сир', 'Лиси розумніші за воронів'],
      answer: 0,
      explain:
        '« Tout flatteur vit aux dépens de celui qui l’écoute » — підлесник живе коштом того, хто його слухає.',
    },
    {
      id: 'st3q3',
      kind: 'type',
      prompt: 'Як французькою «лис»?',
      question: 'лис (з артиклем)',
      answer: ['le renard'],
      accents: true,
    },
    {
      id: 'st3q4',
      kind: 'match',
      prompt: 'З’єднай слова з байки',
      pairs: [
        { fr: 'le bec', uk: 'дзьоб' },
        { fr: 'la proie', uk: 'здобич' },
        { fr: 'le flatteur', uk: 'підлесник' },
        { fr: "l'odeur", uk: 'запах' },
      ],
    },
  ],
}

const chaperonRouge: Story = {
  id: 'chaperon-rouge',
  title: 'Le Petit Chaperon rouge',
  titleUk: 'Червона Шапочка',
  level: 'A2',
  minutes: 7,
  source: 'За Шарлем Перро, 1697 — суспільне надбання. Адаптовано для рівня A2.',
  emoji: '🔴',
  blurb: 'Класична казка у спрощеному переказі. Багато минулого часу й діалогів.',
  paragraphs: [
    {
      fr: "Il était une fois une petite fille de village. Sa grand-mère lui a donné un petit chaperon rouge. Alors tout le monde l'appelait « le Petit Chaperon rouge ».",
      uk: 'Жила собі одна сільська дівчинка. Бабуся подарувала їй червону шапочку. Тому всі називали її «Червоною Шапочкою».',
    },
    {
      fr: 'Un jour, sa mère a dit : « Ta grand-mère est malade. Porte-lui une galette et un petit pot de beurre. »',
      uk: 'Одного дня мати сказала: «Твоя бабуся хвора. Віднеси їй пиріжок і горщичок масла».',
    },
    {
      fr: 'La petite fille est partie. Dans la forêt, elle a rencontré le loup.',
      uk: 'Дівчинка вирушила. У лісі вона зустріла вовка.',
    },
    {
      fr: '« Où vas-tu ? » a demandé le loup. « Chez ma grand-mère, dans le village là-bas », a répondu la petite fille.',
      uk: '«Куди ти йдеш?» — запитав вовк. «До бабусі, у те село», — відповіла дівчинка.',
    },
    {
      fr: "Le loup a couru très vite. Il est arrivé le premier chez la grand-mère et il l'a enfermée dans le placard.",
      uk: 'Вовк побіг дуже швидко. Він прибув до бабусі першим і замкнув її в шафі.',
    },
    {
      fr: "Puis il a mis le bonnet de la grand-mère et il s'est couché dans le lit.",
      uk: 'Потім він одягнув бабусин чепчик і ліг у ліжко.',
    },
    {
      fr: 'Quand la petite fille est entrée, elle a trouvé sa grand-mère très étrange.',
      uk: 'Коли дівчинка увійшла, бабуся здалася їй дуже дивною.',
    },
    {
      fr: "« Grand-mère, que vous avez de grands yeux ! » — « C'est pour mieux te voir, mon enfant. »",
      uk: '«Бабусю, які у вас великі очі!» — «Це щоб краще тебе бачити, дитино моя».',
    },
    {
      fr: "« Grand-mère, que vous avez de grandes dents ! » — « C'est pour mieux te manger ! »",
      uk: '«Бабусю, які у вас великі зуби!» — «Це щоб краще тебе з’їсти!»',
    },
    {
      fr: 'Heureusement, un chasseur passait devant la maison. Il a entendu les cris et il a sauvé la petite fille et sa grand-mère.',
      uk: 'На щастя, повз будинок проходив мисливець. Він почув крики і врятував дівчинку та її бабусю.',
    },
  ],
  glossary: [
    { fr: 'Il était une fois', uk: 'Жили собі (казковий зачин)' },
    { fr: 'le chaperon', uk: 'шапочка, капюшон' },
    { fr: 'malade', uk: 'хворий' },
    { fr: 'la galette', uk: 'пиріжок, коржик' },
    { fr: 'le beurre', uk: 'масло' },
    { fr: 'la forêt', uk: 'ліс' },
    { fr: 'le loup', uk: 'вовк' },
    { fr: 'courir (il a couru)', uk: 'бігти (він побіг)' },
    { fr: 'enfermer', uk: 'замикати' },
    { fr: 'le placard', uk: 'шафа' },
    { fr: 'étrange', uk: 'дивний' },
    { fr: 'le chasseur', uk: 'мисливець' },
    { fr: 'sauver', uk: 'рятувати' },
  ],
  questions: [
    {
      id: 'st4q1',
      kind: 'mcq',
      prompt: 'Що дівчинка несла бабусі?',
      question: "Qu'est-ce qu'elle a porté à sa grand-mère ?",
      options: ['Du pain et du fromage', 'Une galette et du beurre', 'Des fleurs'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'st4q2',
      kind: 'cloze',
      prompt: 'Встав допоміжне дієслово',
      sentence: 'La petite fille ___ partie.',
      answer: ['est'],
      translation: 'Дівчинка вирушила.',
      options: ['a', 'est'],
      explain: 'partir — дієслово руху → être. І узгодження: partie (жіночий рід).',
    },
    {
      id: 'st4q3',
      kind: 'type',
      prompt: 'Як французькою «вовк»?',
      question: 'вовк (з артиклем)',
      answer: ['le loup'],
      accents: true,
    },
    {
      id: 'st4q4',
      kind: 'mcq',
      prompt: 'Хто врятував дівчинку?',
      question: 'Qui a sauvé la petite fille ?',
      options: ['Sa mère', 'Un chasseur', 'Sa grand-mère'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'st4q5',
      kind: 'translate',
      prompt: 'Переклади французькою (фраза з казки)',
      question: 'Це щоб краще тебе бачити.',
      answer: ["c'est pour mieux te voir"],
    },
  ],
}

/** Ordered by level, so the library reads as a progression rather than a pile. */
const RANK: Record<string, number> = { A0: 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 }

export const STORIES: Story[] = [
  premierJour,
  cafeMontmartre,
  chaperonRouge,
  corbeauRenard,
  ...STORIES_2,
].sort((a, b) => RANK[a.level] - RANK[b.level])

export function getStory(id: string) {
  return STORIES.find((s) => s.id === id)
}
