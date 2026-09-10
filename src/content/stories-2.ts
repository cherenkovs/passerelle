import type { Story } from './types'

/**
 * Second batch of graded readers, weighted towards B1–B2.
 *
 * The course reaches B2 but the library stopped at B1, which is backwards:
 * reading is where vocabulary actually sticks, and it is the *only* part of the
 * app that scales without more authored exercises.
 *
 * On sources. La Fontaine (1668) is reproduced as written — it is public
 * domain and short enough to give whole. Daudet (1869) and Maupassant (1884)
 * are **adaptations**, written for this course and labelled as such: an
 * approximate "original" would be worse than an honest retelling, and the
 * abridgement lets the difficulty be aimed at a level instead of wherever the
 * author happened to land.
 *
 * The Maupassant is deliberately in **passé simple**, so module 24 — which
 * teaches that tense for recognition only — has something real to read.
 */

/* ------------------------------------------------------------------ *
 * A1 — présent, food, numbers
 * ------------------------------------------------------------------ */

const auMarche: Story = {
  id: 'au-marche',
  title: 'Au marché',
  titleUk: 'На ринку',
  level: 'A1',
  minutes: 5,
  source: 'Оригінальний текст, написаний для цього курсу',
  emoji: '🧺',
  blurb: 'Субота, ринок, кілограм помідорів. Числа, ціни й ввічливі формули в дії.',
  paragraphs: [
    {
      fr: "C'est samedi matin. Serhii va au marché. Il aime le marché du samedi.",
      uk: 'Субота, ранок. Сергій іде на ринок. Він любить суботній ринок.',
    },
    {
      fr: 'Il y a beaucoup de monde. Les vendeurs crient : « Regardez mes tomates ! Elles sont belles ! »',
      uk: 'Тут багато людей. Продавці гукають: «Погляньте на мої помідори! Вони гарні!»',
    },
    {
      fr: 'Serhii regarde les légumes. Les tomates sont rouges, les carottes sont orange, la salade est verte.',
      uk: 'Сергій дивиться на овочі. Помідори червоні, морква помаранчева, салат зелений.',
    },
    {
      fr: '« Bonjour, monsieur. Je voudrais un kilo de tomates, s’il vous plaît. »',
      uk: '«Добрий день, пане. Я хотів би кілограм помідорів, будь ласка».',
    },
    {
      fr: '« Voilà. Et avec ça ? » — « Deux baguettes et six œufs. C’est combien ? »',
      uk: '«Прошу. Що ще?» — «Два багети і шість яєць. Скільки це коштує?»',
    },
    {
      fr: '« Alors… neuf euros cinquante. » Serhii donne dix euros. Le vendeur rend cinquante centimes.',
      uk: '«Отже… дев’ять євро п’ятдесят». Сергій дає десять євро. Продавець дає решту — п’ятдесят центів.',
    },
    {
      fr: 'Serhii met tout dans son sac. Le sac est lourd, mais il est content.',
      uk: 'Сергій складає все в сумку. Сумка важка, але він задоволений.',
    },
    {
      fr: 'À midi, il fait une salade de tomates. C’est simple et c’est bon.',
      uk: 'Опівдні він робить салат із помідорів. Це просто і смачно.',
    },
  ],
  glossary: [
    { fr: 'le marché', uk: 'ринок' },
    { fr: 'le vendeur', uk: 'продавець' },
    { fr: 'les légumes', uk: 'овочі' },
    { fr: 'la tomate', uk: 'помідор' },
    { fr: 'la carotte', uk: 'морква' },
    { fr: "l'œuf", uk: 'яйце' },
    { fr: 'un kilo de', uk: 'кілограм чогось' },
    { fr: 'C’est combien ?', uk: 'Скільки це коштує?' },
    { fr: 'rendre', uk: 'віддавати, давати решту' },
    { fr: 'lourd / lourde', uk: 'важкий' },
  ],
  questions: [
    {
      id: 'st5q1',
      kind: 'mcq',
      prompt: 'Коли відбувається історія?',
      question: 'Quel jour Serhii va au marché ?',
      options: ['Samedi', 'Dimanche', 'Lundi'],
      answer: 0,
      optionsAreFrench: true,
      explain: 'Перше речення: « C’est samedi matin. »',
    },
    {
      id: 'st5q2',
      kind: 'mcq',
      prompt: 'Скільки він платить?',
      question: 'Il donne dix euros. Combien le vendeur rend ?',
      options: ['Cinquante centimes', 'Un euro', 'Rien'],
      answer: 0,
      optionsAreFrench: true,
      explain: 'Рахунок — 9,50 €, він дає 10 € → решта 0,50 €.',
    },
    {
      id: 'st5q3',
      kind: 'cloze',
      prompt: 'Ввічливе замовлення з тексту',
      sentence: 'Je ___ un kilo de tomates, s’il vous plaît.',
      answer: ['voudrais'],
      translation: 'Я хотів би кілограм помідорів, будь ласка.',
      options: ['voudrais', 'veux', 'voudrai'],
      explain: 'На ринку й у кафе «je voudrais» — норма ввічливості.',
    },
    {
      id: 'st5q4',
      kind: 'translate',
      prompt: 'Переклади французькою',
      question: 'Скільки це коштує?',
      answer: ["c'est combien", 'combien ça coûte', 'ça coûte combien'],
    },
  ],
}

/* ------------------------------------------------------------------ *
 * A2 — passé composé, a fable retold as prose
 * ------------------------------------------------------------------ */

const lievreTortue: Story = {
  id: 'lievre-tortue',
  title: 'Le Lièvre et la Tortue',
  titleUk: 'Заєць і черепаха',
  level: 'A2',
  minutes: 6,
  source: 'За байкою Жана де Лафонтена, 1668 — суспільне надбання. Переказано прозою для рівня A2.',
  emoji: '🐢',
  blurb:
    'Байка, яку ти вже знаєш українською, — прозою і в passé composé. Знайомий сюжет тримає тебе на плаву.',
  paragraphs: [
    {
      fr: 'Un jour, le Lièvre a rencontré la Tortue sur la route. Il a ri : « Tu marches si lentement ! »',
      uk: 'Одного дня Заєць зустрів Черепаху на дорозі. Він засміявся: «Ти так повільно ходиш!»',
    },
    {
      fr: '« Peut-être, a répondu la Tortue. Mais je suis sûre d’arriver avant toi. »',
      uk: '«Можливо, — відповіла Черепаха. — Але я впевнена, що прийду раніше за тебе».',
    },
    {
      fr: 'Le Lièvre n’a pas pu croire ses oreilles. Ils ont décidé de faire la course jusqu’au grand arbre.',
      uk: 'Заєць не міг повірити своїм вухам. Вони вирішили влаштувати перегони до великого дерева.',
    },
    {
      fr: 'La Tortue est partie tout de suite. Elle a marché sans s’arrêter, doucement, toute la journée.',
      uk: 'Черепаха вирушила одразу. Вона йшла без зупинки, поволі, цілий день.',
    },
    {
      fr: 'Le Lièvre, lui, a attendu. « J’ai le temps », a-t-il pensé. Il a mangé, il a dormi sous un arbre.',
      uk: 'А Заєць чекав. «У мене є час», — подумав він. Він поїв і поспав під деревом.',
    },
    {
      fr: 'Quand il s’est réveillé, le soleil descendait déjà. Il a couru comme le vent.',
      uk: 'Коли він прокинувся, сонце вже сідало. Він побіг як вітер.',
    },
    {
      fr: 'Mais c’était trop tard : la Tortue était assise sous le grand arbre. Elle l’attendait.',
      uk: 'Але було запізно: Черепаха вже сиділа під великим деревом. Вона чекала на нього.',
    },
    {
      fr: '« Rien ne sert de courir, a-t-elle dit. Il faut partir à point. »',
      uk: '«Немає сенсу бігти, — сказала вона. — Треба вирушати вчасно».',
    },
  ],
  glossary: [
    { fr: 'le lièvre', uk: 'заєць' },
    { fr: 'la tortue', uk: 'черепаха' },
    { fr: 'rencontrer', uk: 'зустрічати' },
    { fr: 'lentement', uk: 'повільно' },
    { fr: 'faire la course', uk: 'змагатися в бігу' },
    { fr: 's’arrêter', uk: 'зупинятися' },
    { fr: 'se réveiller', uk: 'прокидатися' },
    { fr: 'trop tard', uk: 'запізно' },
    { fr: 'attendre', uk: 'чекати' },
    { fr: 'à point', uk: 'вчасно, саме тоді, коли треба' },
  ],
  questions: [
    {
      id: 'st6q1',
      kind: 'mcq',
      prompt: 'Чому заєць програв?',
      question: 'Pourquoi le Lièvre a perdu ?',
      options: [
        'Il a dormi au lieu de courir',
        'Il s’est perdu sur la route',
        'La Tortue a triché',
      ],
      answer: 0,
      optionsAreFrench: true,
      explain: '« Il a mangé, il a dormi sous un arbre. »',
    },
    {
      id: 'st6q2',
      kind: 'cloze',
      prompt: 'Допоміжне дієслово: partir бере être',
      sentence: 'La Tortue ___ partie tout de suite.',
      answer: ['est'],
      translation: 'Черепаха вирушила одразу.',
      options: ['est', 'a', 'était'],
      explain: 'Дієслова руху беруть être, і дієприкметник узгоджується: partie.',
    },
    {
      id: 'st6q3',
      kind: 'mcq',
      prompt: 'Мораль байки',
      question: '« Rien ne sert de courir, il faut partir à point. » Що це означає?',
      options: [
        'Краще почати вчасно, ніж поспішати потім',
        'Бігати шкідливо для здоров’я',
        'Швидкість завжди перемагає',
      ],
      answer: 0,
    },
    {
      id: 'st6q4',
      kind: 'translate',
      prompt: 'Переклади французькою',
      question: 'Було запізно.',
      answer: ["c'était trop tard", 'il était trop tard'],
    },
  ],
}

/* ------------------------------------------------------------------ *
 * B1 — La Fontaine, as written
 * ------------------------------------------------------------------ */

const cigaleFourmi: Story = {
  id: 'cigale-fourmi',
  title: 'La Cigale et la Fourmi',
  titleUk: 'Цикада і мурашка',
  level: 'B1',
  minutes: 7,
  source: 'Жан де Лафонтен, «Байки», книга I, 1668 — суспільне надбання. Текст оригінальний.',
  emoji: '🐜',
  blurb:
    'Найвідоміша французька байка — так, як її написано 1668 року. Кожен француз учив її напам’ять у школі.',
  paragraphs: [
    {
      fr: 'La Cigale, ayant chanté\nTout l’été,\nSe trouva fort dépourvue\nQuand la bise fut venue :',
      uk: 'Цикада, проспівавши\nЦіле літо,\nОпинилася зовсім ні з чим,\nКоли настав холодний вітер:',
    },
    {
      fr: 'Pas un seul petit morceau\nDe mouche ou de vermisseau.\nElle alla crier famine\nChez la Fourmi sa voisine,',
      uk: 'Ані шматочка\nМухи чи черв’ячка.\nВона пішла благати про їжу\nДо Мурашки, своєї сусідки,',
    },
    {
      fr: 'La priant de lui prêter\nQuelque grain pour subsister\nJusqu’à la saison nouvelle.\n« Je vous paierai, lui dit-elle,\nAvant l’août, foi d’animal,\nIntérêt et principal. »',
      uk: 'Просячи позичити їй\nЯкогось зерна, щоб протриматися\nДо нового сезону.\n«Я вам заплачу, — каже вона, —\nДо серпня, слово тварини,\nІ відсотки, і борг».',
    },
    {
      fr: 'La Fourmi n’est pas prêteuse :\nC’est là son moindre défaut.\n« Que faisiez-vous au temps chaud ?\nDit-elle à cette emprunteuse.',
      uk: 'Мурашка не з тих, хто позичає:\nЦе її найменша вада.\n«Що ж ви робили в теплу пору? —\nКаже вона тій позичальниці. —',
    },
    {
      fr: '— Nuit et jour à tout venant\nJe chantais, ne vous déplaise.\n— Vous chantiez ? j’en suis fort aise.\nEh bien ! dansez maintenant. »',
      uk: '— Удень і вночі, кому завгодно,\nЯ співала, не гнівайтеся.\n— Ви співали? Дуже за вас рада.\nОтже, тепер танцюйте!»',
    },
  ],
  glossary: [
    { fr: 'la cigale', uk: 'цикада' },
    { fr: 'la fourmi', uk: 'мурашка' },
    { fr: 'dépourvu / dépourvue', uk: 'позбавлений усього, ні з чим' },
    { fr: 'la bise', uk: 'холодний північний вітер' },
    { fr: 'le vermisseau', uk: 'черв’ячок' },
    { fr: 'crier famine', uk: 'благати про їжу' },
    { fr: 'prêter', uk: 'позичати (комусь)' },
    { fr: 'subsister', uk: 'протриматися, вижити' },
    { fr: 'le défaut', uk: 'вада, недолік' },
    { fr: 'être fort aise', uk: 'бути дуже радим (застаріле)' },
  ],
  questions: [
    {
      id: 'st7q1',
      kind: 'mcq',
      prompt: 'Що робила цикада влітку?',
      question: 'Qu’est-ce que la Cigale a fait pendant l’été ?',
      options: ['Elle a chanté', 'Elle a travaillé', 'Elle a dormi'],
      answer: 0,
      optionsAreFrench: true,
      explain: '« La Cigale, ayant chanté tout l’été… »',
    },
    {
      id: 'st7q2',
      kind: 'mcq',
      prompt: 'Тон мурашки в кінці',
      question: '« Eh bien ! dansez maintenant. » Як це звучить?',
      options: ['Іронічно, майже жорстоко', 'Тепло й дружньо', 'Байдуже'],
      answer: 0,
      explain:
        'Лафонтен не робить мурашку доброю. Байка не хвалить її — вона показує обох такими, які вони є.',
    },
    {
      id: 'st7q3',
      kind: 'mcq',
      prompt: 'Граматика минулого',
      question: '« Se trouva », « alla », « fut venue » — що це за форми?',
      options: ['Passé simple — літературний час', 'Passé composé', 'Умовний спосіб'],
      answer: 0,
      explain:
        'Passé simple. У розмові його не вживають, але в літературі він скрізь — упізнавати треба.',
    },
    {
      id: 'st7q4',
      kind: 'translate',
      prompt: 'Переклади французькою (з байки)',
      question: 'Я вам заплачу.',
      answer: ['je vous paierai', 'je vous payerai'],
    },
  ],
}

/* ------------------------------------------------------------------ *
 * B1 — Daudet, adapted
 * ------------------------------------------------------------------ */

const chevreSeguin: Story = {
  id: 'chevre-seguin',
  title: 'La chèvre de monsieur Seguin',
  titleUk: 'Коза пана Сегена',
  level: 'B1',
  minutes: 8,
  source:
    'За оповіданням Альфонса Доде «Листи з мого млина», 1869 — суспільне надбання. Скорочено й адаптовано для рівня B1.',
  emoji: '🐐',
  blurb:
    'Найсумніша й найулюбленіша французька історія про свободу. Імперфект проти passé composé — на кожному абзаці.',
  paragraphs: [
    {
      fr: 'Monsieur Seguin n’avait jamais eu de chance avec ses chèvres. Toutes voulaient aller dans la montagne, et toutes finissaient mangées par le loup.',
      uk: 'Панові Сегену ніколи не щастило з козами. Усі хотіли піти в гори, і всіх зрештою з’їдав вовк.',
    },
    {
      fr: 'Cette fois, il en acheta une petite, toute blanche, qu’il appela Blanquette. Il l’attacha dans son jardin avec une longue corde.',
      uk: 'Цього разу він купив маленьку, зовсім білу, і назвав її Бланкетт. Він прив’язав її в саду довгою мотузкою.',
    },
    {
      fr: 'Blanquette était heureuse. Mais un jour, elle regarda la montagne et pensa : « Comme on doit être bien là-haut. »',
      uk: 'Бланкетт була щаслива. Але одного дня вона подивилася на гору й подумала: «Як же там, нагорі, мабуть, добре».',
    },
    {
      fr: '« Monsieur Seguin, je veux aller dans la montagne. » — « Mais le loup te mangera ! » — « Ça m’est égal. »',
      uk: '«Пане Сеген, я хочу в гори». — «Але ж вовк тебе з’їсть!» — «Мені однаково».',
    },
    {
      fr: 'Monsieur Seguin l’enferma dans l’étable. Mais il oublia la fenêtre, et Blanquette partit.',
      uk: 'Пан Сеген замкнув її в хліві. Але забув про вікно — і Бланкетт утекла.',
    },
    {
      fr: 'Là-haut, ce fut merveilleux. L’herbe était haute, les fleurs étaient partout. Elle courut, elle mangea, elle joua toute la journée.',
      uk: 'Там, нагорі, було чудово. Трава була висока, квіти — усюди. Вона бігала, їла, гралася цілий день.',
    },
    {
      fr: 'Puis le soir tomba. Elle entendit un bruit derrière elle. C’était le loup.',
      uk: 'Потім настав вечір. Вона почула шум позаду. Це був вовк.',
    },
    {
      fr: 'Blanquette savait qu’elle allait mourir. Mais elle pensa aux autres chèvres, mangées tout de suite, et elle décida de se battre.',
      uk: 'Бланкетт знала, що загине. Але згадала про інших кіз, з’їдених одразу, — і вирішила боротися.',
    },
    {
      fr: 'Elle se battit toute la nuit. Au matin, quand le soleil se leva enfin, elle se coucha dans l’herbe. Et le loup la mangea.',
      uk: 'Вона билася цілу ніч. Уранці, коли нарешті зійшло сонце, вона лягла в траву. І вовк її з’їв.',
    },
  ],
  glossary: [
    { fr: 'la chèvre', uk: 'коза' },
    { fr: 'le loup', uk: 'вовк' },
    { fr: 'la corde', uk: 'мотузка' },
    { fr: 'attacher', uk: 'прив’язувати' },
    { fr: 'enfermer', uk: 'замикати' },
    { fr: "l'étable", uk: 'хлів' },
    { fr: "l'herbe", uk: 'трава' },
    { fr: 'se battre', uk: 'битися, боротися' },
    { fr: 'Ça m’est égal.', uk: 'Мені однаково.' },
    { fr: 'se lever', uk: 'вставати; сходити (про сонце)' },
  ],
  questions: [
    {
      id: 'st8q1',
      kind: 'mcq',
      prompt: 'Чому Бланкетт пішла в гори?',
      question: 'Pourquoi Blanquette est partie ?',
      options: ['Elle voulait être libre', 'Monsieur Seguin était méchant', 'Elle avait faim'],
      answer: 0,
      optionsAreFrench: true,
      explain: 'Вона знала про вовка й пішла все одно: « Ça m’est égal. »',
    },
    {
      id: 'st8q2',
      kind: 'mcq',
      prompt: 'Тло чи подія?',
      question: '« L’herbe était haute » — чому тут imparfait, а не passé composé?',
      options: ['Це опис, тло — стан, а не подія', 'Бо це минуле доконане', 'Бо це умовний спосіб'],
      answer: 0,
      explain:
        'Опис декорацій — завжди imparfait. Дії, що рухають сюжет, — passé simple / composé.',
    },
    {
      id: 'st8q3',
      kind: 'cloze',
      prompt: 'Постав у imparfait',
      sentence: 'Toutes les chèvres ___ aller dans la montagne. (vouloir)',
      answer: ['voulaient'],
      translation: 'Усі кози хотіли піти в гори.',
      options: ['voulaient', 'ont voulu', 'voudraient'],
      explain: 'Тривале бажання, стан → imparfait.',
    },
    {
      id: 'st8q4',
      kind: 'translate',
      prompt: 'Переклади французькою',
      question: 'Мені однаково.',
      answer: ["ça m'est égal", 'ca m est egal'],
    },
  ],
}

/* ------------------------------------------------------------------ *
 * B2 — Maupassant, adapted, in passé simple
 * ------------------------------------------------------------------ */

const laParure: Story = {
  id: 'la-parure',
  title: 'La Parure',
  titleUk: 'Намисто',
  level: 'B2',
  minutes: 10,
  source:
    'За новелою Гі де Мопассана «La Parure», 1884 — суспільне надбання. Скорочено й адаптовано для рівня B2.',
  emoji: '💎',
  blurb:
    'Класична новела з фіналом, який б’є під дих. Написана в passé simple — саме той час, який модуль 24 учить упізнавати.',
  paragraphs: [
    {
      fr: 'Elle était jolie, mais elle était née dans une famille pauvre, et elle avait épousé un petit employé du ministère. Elle souffrait de la pauvreté de son appartement, des murs nus, des chaises usées.',
      uk: 'Вона була гарна, але народилася в бідній родині і вийшла заміж за дрібного міністерського службовця. Вона страждала від убогості своєї квартири, від голих стін, від потертих стільців.',
    },
    {
      fr: 'Un soir, son mari rentra, l’air heureux, et lui tendit une enveloppe : une invitation au bal du ministère. Au lieu de se réjouir, elle jeta le carton sur la table.',
      uk: 'Одного вечора чоловік повернувся з радісним виглядом і простягнув їй конверт: запрошення на бал у міністерстві. Замість зрадіти, вона кинула картку на стіл.',
    },
    {
      fr: '« Que veux-tu que je fasse de cela ? Je n’ai rien à me mettre. » Il lui donna les quatre cents francs qu’il gardait pour un fusil. Elle acheta une robe.',
      uk: '«І що мені з цим робити? Мені нема в чому піти». Він віддав їй чотириста франків, які беріг на рушницю. Вона купила сукню.',
    },
    {
      fr: 'Mais elle n’avait pas de bijoux. « Va voir ton amie madame Forestier », dit-il. Elle y alla, et son amie lui prêta une rivière de diamants magnifique.',
      uk: 'Але прикрас у неї не було. «Сходи до своєї подруги, пані Форестьє», — сказав він. Вона пішла, і подруга позичила їй розкішне діамантове намисто.',
    },
    {
      fr: 'Le soir du bal, elle fut la plus belle. Tous les hommes la regardaient. Elle dansa, ivre de joie, sans penser à rien.',
      uk: 'У вечір балу вона була найкрасивішою. Усі чоловіки дивилися на неї. Вона танцювала, п’яна від щастя, ні про що не думаючи.',
    },
    {
      fr: 'Chez eux, devant la glace, elle poussa un cri : la rivière n’était plus à son cou. Ils la cherchèrent partout. Ils ne la retrouvèrent jamais.',
      uk: 'Удома, перед дзеркалом, вона скрикнула: намиста на шиї не було. Вони шукали його всюди. Так і не знайшли.',
    },
    {
      fr: 'Ils achetèrent la même chez un bijoutier : trente-six mille francs. Ils empruntèrent, signèrent partout, et rendirent le bijou sans rien dire.',
      uk: 'Вони купили таке саме в ювеліра: тридцять шість тисяч франків. Вони позичали, підписували всюди — і повернули прикрасу, нічого не сказавши.',
    },
    {
      fr: 'Alors commencèrent dix années terribles. Ils renvoyèrent la bonne, changèrent de logement. Elle lava le linge, marchanda chaque sou. Elle devint vieille avant l’âge.',
      uk: 'Тоді почалися десять страшних років. Вони звільнили служницю, змінили житло. Вона прала білизну, торгувалася за кожен су. Вона зістарілася раніше часу.',
    },
    {
      fr: 'Au bout de dix ans, tout était payé. Un dimanche, elle rencontra madame Forestier, toujours jeune, toujours belle. Elle lui raconta tout.',
      uk: 'Через десять років усе було виплачено. Однієї неділі вона зустріла пані Форестьє — так само молоду, так само гарну. І розповіла їй усе.',
    },
    {
      fr: '« Oh ! ma pauvre… Mais ma rivière était fausse. Elle valait au plus cinq cents francs. »',
      uk: '«Ох, бідолашна… Але ж моє намисто було фальшиве. Воно коштувало щонайбільше п’ятсот франків».',
    },
  ],
  glossary: [
    { fr: 'la parure', uk: 'убір, коштовна прикраса' },
    { fr: 'la rivière de diamants', uk: 'діамантове намисто' },
    { fr: 'épouser', uk: 'одружитися з, вийти заміж за' },
    { fr: 'tendre (quelque chose)', uk: 'простягати' },
    { fr: 'se réjouir', uk: 'радіти' },
    { fr: 'prêter', uk: 'позичати (комусь)' },
    { fr: 'emprunter', uk: 'позичати (в когось)' },
    { fr: 'le bijoutier', uk: 'ювелір' },
    { fr: 'la bonne', uk: 'служниця' },
    { fr: 'marchander', uk: 'торгуватися' },
    { fr: 'faux / fausse', uk: 'фальшивий' },
  ],
  questions: [
    {
      id: 'st9q1',
      kind: 'mcq',
      prompt: 'Фінал',
      question: 'Чому кінець новели такий жорстокий?',
      options: [
        'Десять років злиднів були заплачені за фальшивку',
        'Подруга навмисно її обдурила',
        'Намисто так і не знайшли',
      ],
      answer: 0,
      explain:
        'Мопассан не карає героїню за марнославство — він показує, як одна невимовлена фраза коштує десяти років життя.',
    },
    {
      id: 'st9q2',
      kind: 'mcq',
      prompt: 'Упізнай час',
      question: '« Elle jeta », « ils achetèrent », « alors commencèrent » — що це?',
      options: ['Passé simple — час письмової розповіді', 'Passé composé', 'Plus-que-parfait'],
      answer: 0,
      explain:
        'Passé simple. Вживати його не треба — але без упізнавання французька література закрита.',
    },
    {
      id: 'st9q3',
      kind: 'mcq',
      prompt: 'Хибний друг і пара, яку легко сплутати',
      question: 'prêter і emprunter — у чому різниця?',
      options: [
        'prêter — давати в борг, emprunter — брати в борг',
        'Це синоніми',
        'prêter — брати в борг, emprunter — давати',
      ],
      answer: 0,
      explain: 'Подруга lui a prêté намисто; подружжя ont emprunté гроші.',
    },
    {
      id: 'st9q4',
      kind: 'cloze',
      prompt: 'Subjonctif після que veux-tu que…',
      sentence: 'Que veux-tu que je ___ de cela ?',
      answer: ['fasse'],
      translation: 'І що мені з цим робити?',
      options: ['fasse', 'fais', 'ferai'],
      explain: 'Після «vouloir que» — завжди subjonctif.',
    },
    {
      id: 'st9q5',
      kind: 'translate',
      prompt: 'Переклади французькою',
      question: 'Мені нема в чому піти.',
      answer: ["je n'ai rien à me mettre", 'je n ai rien a me mettre'],
    },
  ],
}

export const STORIES_2: Story[] = [auMarche, lievreTortue, cigaleFourmi, chevreSeguin, laParure]
