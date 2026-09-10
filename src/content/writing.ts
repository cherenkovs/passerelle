import type { WritingCheck } from '@/lib/writing'
import type { CEFR } from './types'

/**
 * Writing practice.
 *
 * Module 22 teaches how a French letter and a DELF essay are built, and until
 * now there was nowhere to actually build one — the longest thing a learner
 * ever wrote in this app was a single translated sentence.
 *
 * Each task gives a brief, a length, the moves the text has to make, and the
 * phrases worth reaching for. What can be checked mechanically is checked (see
 * lib/writing.ts); the rest is left to a model answer and a rubric, which is
 * how writing is taught anyway. The app does not pretend to grade prose.
 *
 * Drafts are saved as you type, because a half-written letter that vanishes on
 * a page refresh teaches only that the app cannot be trusted.
 */

export type WritingTask = {
  id: string
  title: string
  titleUk: string
  level: CEFR
  emoji: string
  minutes: number
  /** The situation, in Ukrainian. */
  brief: string
  /** What the text has to do — shown before writing, not after. */
  requirements: string[]
  words: { min: number; max: number }
  /** Worth reaching for; tap any of them to hear it. */
  phrases: { fr: string; uk: string }[]
  checks: WritingCheck[]
  /** Revealed only once the learner has written something. */
  model: string
  modelUk: string
  /** Questions to ask of your own text, next to the model. */
  rubric: string[]
}

/* ------------------------------------------------------------------ *
 * A2
 * ------------------------------------------------------------------ */

const carte: WritingTask = {
  id: 'carte-postale',
  title: 'Une carte postale',
  titleUk: 'Листівка з відпустки',
  level: 'A2',
  emoji: '🏖️',
  minutes: 12,
  brief:
    'Ти тиждень у Ніцці. Напиши листівку подрузі Каміль: де ти, яка погода, що робиш, і коли повертаєшся.',
  requirements: [
    'Звертання на початку («Chère Camille,»)',
    'Де ти і яка погода — теперішній час',
    'Що ти вже зробив — passé composé, хоча б одне речення',
    'Коли повертаєшся — найближче майбутнє',
    'Прощання і підпис',
  ],
  words: { min: 40, max: 70 },
  phrases: [
    { fr: 'Chère Camille,', uk: 'Дорога Каміль,' },
    { fr: 'Je suis à Nice depuis lundi.', uk: 'Я в Ніцці з понеділка.' },
    { fr: 'Il fait très beau.', uk: 'Дуже гарна погода.' },
    { fr: 'Hier, j’ai visité…', uk: 'Учора я відвідав(ла)…' },
    { fr: 'Je rentre dimanche.', uk: 'Повертаюся в неділю.' },
    { fr: 'Je t’embrasse,', uk: 'Обіймаю,' },
  ],
  checks: [
    {
      any: ['chère', 'cher', 'bonjour', 'coucou', 'salut'],
      label: 'Звертання на початку',
      hint: 'Почни з «Chère Camille,» — листівка без звертання виглядає обірваною.',
    },
    {
      any: ["j'ai", 'je suis allé', 'je suis allée', 'nous avons', 'on a'],
      label: 'Минулий час',
      hint: 'Розкажи, що ти вже встиг зробити: «Hier, j’ai visité…»',
    },
    {
      any: ['je rentre', 'je reviens', 'je vais rentrer', 'je serai'],
      label: 'Коли повертаєшся',
      hint: 'Додай речення про повернення: «Je rentre dimanche.»',
    },
    {
      any: ['embrasse', 'bises', 'à bientôt', 'amitiés', 'bisous'],
      label: 'Прощання',
      hint: 'Заверши теплою формулою: «Je t’embrasse» або «Bises».',
    },
  ],
  model:
    'Chère Camille,\n\nJe suis à Nice depuis lundi et je passe des vacances formidables. Il fait très beau, la mer est chaude et je me baigne tous les jours.\n\nHier, j’ai visité le vieux port et j’ai mangé une socca sur le marché. C’était délicieux.\n\nJe rentre dimanche soir. On se voit la semaine prochaine ?\n\nJe t’embrasse,\nMaryna',
  modelUk:
    'Дорога Каміль,\n\nЯ в Ніцці з понеділка, і відпустка чудова. Дуже гарна погода, море тепле, я купаюся щодня.\n\nУчора я відвідала старий порт і з’їла соку на ринку. Було смачно.\n\nПовертаюся в неділю ввечері. Побачимося наступного тижня?\n\nОбіймаю,\nМарина',
  rubric: [
    'Чи узгоджені дієприкметники в passé composé з твоїм родом?',
    'Чи всі іменники з артиклем?',
    'Чи не забув(ла) ти прийменник перед містом — «à Nice»?',
  ],
}

const reclamation: WritingTask = {
  id: 'message-voisin',
  title: 'Un mot au voisin',
  titleUk: 'Записка сусідові',
  level: 'A2',
  emoji: '🚪',
  minutes: 12,
  brief:
    'Сусід згори щовечора вмикає музику до другої ночі. Напиши йому ввічливу записку: поясни проблему і попроси про щось конкретне.',
  requirements: [
    'Ввічливе звертання на «vous»',
    'Опис проблеми без звинувачень',
    'Конкретне прохання',
    'Подяка наприкінці',
  ],
  words: { min: 40, max: 70 },
  phrases: [
    { fr: 'Bonjour,', uk: 'Добрий день,' },
    { fr: 'Je me permets de vous écrire…', uk: 'Дозволю собі написати вам…' },
    { fr: 'Le bruit m’empêche de dormir.', uk: 'Шум заважає мені спати.' },
    { fr: 'Serait-il possible de…', uk: 'Чи можливо було б…' },
    { fr: 'Je vous remercie d’avance.', uk: 'Заздалегідь дякую.' },
  ],
  checks: [
    {
      any: ['vous'],
      label: 'Звертання на «vous»',
      hint: 'До сусіда, якого не знаєш близько, — тільки «vous».',
    },
    {
      any: ['tu', 'te', 'ton', 'ta', 'toi', "t'as"],
      label: 'Без переходу на «tu»',
      hint: 'Десь ти перейшов(ла) на «ти» — у записці незнайомій людині це недоречно.',
      forbid: true,
    },
    {
      any: ['serait-il possible', 'pourriez-vous', 'je vous demande', 'merci de bien vouloir'],
      label: 'Ввічливе прохання',
      hint: 'Сформулюй прохання ввічливо: «Serait-il possible de…» або «Pourriez-vous…».',
    },
    {
      any: ['merci', 'remercie'],
      label: 'Подяка',
      hint: 'Закінчи подякою — це половина ввічливості французькою.',
    },
  ],
  model:
    'Bonjour,\n\nJe me permets de vous écrire au sujet du bruit le soir. La musique s’entend très bien chez moi et, après minuit, elle m’empêche de dormir.\n\nSerait-il possible de baisser un peu le volume après vingt-deux heures ?\n\nJe vous remercie d’avance et vous souhaite une bonne soirée.\n\nVotre voisine du deuxième',
  modelUk:
    'Добрий день,\n\nДозволю собі написати вам щодо вечірнього шуму. Музику дуже добре чути в мене, і після півночі вона заважає мені спати.\n\nЧи можливо було б трохи зменшити гучність після двадцять другої?\n\nЗаздалегідь дякую і бажаю гарного вечора.\n\nВаша сусідка з другого поверху',
  rubric: [
    'Чи звучить записка як прохання, а не як докір?',
    'Чи витримано «vous» до самого кінця?',
    'Чи є конкретика — котра година, що саме зробити?',
  ],
}

/* ------------------------------------------------------------------ *
 * B1
 * ------------------------------------------------------------------ */

const recit: WritingTask = {
  id: 'recit-passe',
  title: 'Un souvenir',
  titleUk: 'Спогад',
  level: 'B1',
  emoji: '📷',
  minutes: 18,
  brief:
    'Розкажи про день, який добре пам’ятаєш: перший день у новому місті, зустріч, подорож. Головне завдання — правильно розділити тло й події.',
  requirements: [
    'Тло (яка була погода, де ти був, що відчував) — imparfait',
    'Події, що рухають розповідь, — passé composé',
    'Хоча б один зв’язок «коли…, раптом…»',
    'Кінцівка з висновком або враженням',
  ],
  words: { min: 80, max: 140 },
  phrases: [
    { fr: 'Ce jour-là, il faisait…', uk: 'Того дня була…' },
    { fr: "J'avais dix-huit ans.", uk: 'Мені було вісімнадцять.' },
    { fr: 'Tout à coup,', uk: 'Раптом,' },
    { fr: 'C’est alors que…', uk: 'І саме тоді…' },
    { fr: 'Je n’oublierai jamais…', uk: 'Я ніколи не забуду…' },
  ],
  checks: [
    {
      any: [
        'était',
        'étais',
        'avait',
        'avais',
        'faisait',
        'y avait',
        'voulait',
        'pouvait',
        'savais',
        'pensais',
        'semblait',
      ],
      label: 'Imparfait для тла',
      hint: 'Опиши обстановку в imparfait: «il faisait froid», «j’avais peur».',
    },
    {
      any: ["j'ai", 'je suis', 'nous avons', 'nous sommes', 'elle a', 'il a'],
      label: 'Passé composé для подій',
      hint: 'Події, що сталися один раз, — у passé composé.',
    },
    {
      any: ['quand', 'lorsque', 'tout à coup', 'soudain', 'c’est alors', "c'est alors"],
      label: 'Зв’язка тло / подія',
      hint: 'Додай момент зміни: «quand…», «tout à coup…».',
    },
  ],
  model:
    'C’était en septembre. Il faisait encore chaud et je venais d’arriver à Lyon. Je ne connaissais personne et je n’osais pas parler français.\n\nCe matin-là, je cherchais la poste depuis vingt minutes. Je tournais en rond, la carte à la main, quand une vieille dame s’est arrêtée devant moi. Elle m’a demandé si j’étais perdue.\n\nJe lui ai répondu, très lentement, que je cherchais la poste. Elle a souri et elle m’a accompagnée jusqu’au bout de la rue.\n\nCe n’était rien du tout. Mais c’est ce jour-là que j’ai compris que j’allais y arriver.',
  modelUk:
    'Це було у вересні. Ще було тепло, і я щойно приїхала до Ліона. Я нікого не знала і не наважувалася говорити французькою.\n\nТого ранку я вже двадцять хвилин шукала пошту. Я кружляла на місці з картою в руці, коли переді мною зупинилася літня пані. Вона запитала, чи я не загубилася.\n\nЯ відповіла їй, дуже повільно, що шукаю пошту. Вона усміхнулася і провела мене до кінця вулиці.\n\nЦе була дрібниця. Але саме того дня я зрозуміла, що в мене вийде.',
  rubric: [
    'Чи кожне дієслово в imparfait описує стан, а не подію?',
    'Чи можна замінити твої passé composé на imparfait без зміни змісту? Якщо так — перевір вибір.',
    'Чи є в тексті момент, коли щось змінилося?',
  ],
}

const opinion: WritingTask = {
  id: 'opinion-forum',
  title: 'Un message sur un forum',
  titleUk: 'Допис на форумі',
  level: 'B1',
  emoji: '💭',
  minutes: 18,
  brief:
    'На форумі для іноземців у Франції питають: «Чи варто вчити мову країни, якщо всі довкола говорять англійською?» Напиши відповідь зі своєю позицією.',
  requirements: [
    'Чітко висловлена позиція',
    'Два аргументи, кожен із прикладом',
    'Врахування протилежного погляду',
    'Висновок',
  ],
  words: { min: 90, max: 150 },
  phrases: [
    { fr: 'À mon avis,', uk: 'На мою думку,' },
    { fr: 'D’une part… d’autre part…', uk: 'З одного боку… з іншого…' },
    { fr: 'Par exemple,', uk: 'Наприклад,' },
    { fr: 'Certes…, mais…', uk: 'Певна річ…, але…' },
    { fr: 'En conclusion,', uk: 'На завершення,' },
  ],
  checks: [
    {
      any: ['à mon avis', 'je pense', 'je crois', 'selon moi', 'pour ma part'],
      label: 'Твоя позиція',
      hint: 'Скажи прямо, що ти думаєш: «À mon avis…».',
    },
    {
      any: ['par exemple', 'notamment', 'ainsi'],
      label: 'Приклад',
      hint: 'Аргумент без прикладу непереконливий. Додай «Par exemple, …».',
    },
    {
      any: ['certes', 'bien sûr', 'il est vrai', 'bien que', 'même si'],
      label: 'Протилежний погляд',
      hint: 'Визнай сильний бік іншої позиції — це те, що відрізняє B1 від A2.',
    },
    {
      any: ['en conclusion', 'pour conclure', 'finalement', 'en somme', 'donc'],
      label: 'Висновок',
      hint: 'Заверши думку, а не обірви її.',
    },
  ],
  model:
    'À mon avis, apprendre la langue du pays où l’on vit change tout.\n\nD’une part, l’anglais suffit pour les choses pratiques, mais il s’arrête à la porte de la vie quotidienne. Par exemple, chez le médecin ou à la mairie, personne ne va vous expliquer un formulaire en anglais.\n\nD’autre part, la langue, c’est aussi la relation. Tant que je parlais anglais à mes voisins, j’étais l’étrangère. Le jour où j’ai commencé en français, même mal, ils se sont mis à me raconter des choses.\n\nCertes, c’est long et parfois décourageant. Mais on n’apprend pas une langue pour être parfait : on l’apprend pour entrer quelque part.\n\nEn conclusion, oui, cela vaut vraiment la peine.',
  modelUk:
    'На мою думку, вивчення мови країни, де ти живеш, змінює все.\n\nЗ одного боку, англійської досить для практичних справ, але вона зупиняється на порозі повсякденного життя. Наприклад, у лікаря чи в мерії ніхто не пояснюватиме вам бланк англійською.\n\nЗ іншого боку, мова — це ще й стосунки. Поки я говорила з сусідами англійською, я була іноземкою. Того дня, коли я почала французькою, хай і погано, вони почали мені щось розповідати.\n\nПевна річ, це довго і часом виснажливо. Але мову вчать не для того, щоб бути бездоганним: її вчать, щоб кудись увійти.\n\nНа завершення — так, це справді того варте.',
  rubric: [
    'Чи можна з першого абзацу зрозуміти твою позицію?',
    'Чи кожен аргумент має приклад із життя, а не лише твердження?',
    'Чи визнаєш ти сильний бік протилежної думки — чи просто відкидаєш її?',
  ],
}

/* ------------------------------------------------------------------ *
 * B2
 * ------------------------------------------------------------------ */

const lettreFormelle: WritingTask = {
  id: 'lettre-formelle',
  title: 'Une lettre formelle',
  titleUk: 'Діловий лист',
  level: 'B2',
  emoji: '✉️',
  minutes: 22,
  brief:
    'Ти бронював(ла) квартиру на тиждень, але після приїзду виявилося, що опалення не працює. Напиши власникові офіційного листа з вимогою часткового повернення коштів.',
  requirements: [
    'Формальне звертання',
    'Виклад фактів без емоцій — що, коли, скільки',
    'Чітко сформульована вимога',
    'Формула прощання, що повторює звертання',
  ],
  words: { min: 110, max: 180 },
  phrases: [
    { fr: 'Madame, Monsieur,', uk: 'Пані, пане,' },
    { fr: 'Je me permets de vous contacter au sujet de…', uk: 'Дозволю собі звернутися щодо…' },
    { fr: 'Or, à mon arrivée, j’ai constaté que…', uk: 'Однак після приїзду я виявив(ла), що…' },
    { fr: 'Je vous demande donc de bien vouloir…', uk: 'Тому прошу вас…' },
    {
      fr: 'Veuillez agréer, Madame, Monsieur, mes salutations distinguées.',
      uk: 'Прийміть, пані, пане, мої найкращі побажання.',
    },
  ],
  checks: [
    {
      any: ['madame', 'monsieur'],
      label: 'Формальне звертання',
      hint: 'Діловий лист починається з «Madame, Monsieur,».',
    },
    {
      any: ['veuillez agréer', 'salutations distinguées', 'cordialement', 'sincères salutations'],
      label: 'Формула прощання',
      hint: 'Без формули прощання лист недописаний. І вона має повторювати звертання.',
    },
    {
      any: ['salut', 'coucou', 'bisous', 'à plus', 'sympa', 'super'],
      label: 'Витриманий регістр',
      hint: 'Розмовне слово в діловому листі помітно одразу. Прибери його.',
      forbid: true,
    },
    {
      any: ['je vous demande', 'je souhaiterais', 'je vous prie', 'je sollicite', 'remboursement'],
      label: 'Чітка вимога',
      hint: 'Скажи прямо, чого ти хочеш: «Je vous demande de bien vouloir me rembourser…».',
    },
  ],
  model:
    'Madame, Monsieur,\n\nJe me permets de vous contacter au sujet de la location de l’appartement situé 12 rue des Lilas, réservé du 3 au 10 février sous le numéro 48213.\n\nOr, à mon arrivée, j’ai constaté que le chauffage ne fonctionnait pas. Malgré deux appels, les 3 et 4 février, aucune intervention n’a eu lieu avant le 6. La température n’a pas dépassé douze degrés pendant trois nuits.\n\nL’annonce mentionnait explicitement un logement chauffé. Je vous demande donc de bien vouloir me rembourser les trois nuits concernées, soit cent quatre-vingts euros.\n\nJe reste à votre disposition pour tout justificatif et vous remercie de l’attention que vous porterez à ma demande.\n\nVeuillez agréer, Madame, Monsieur, mes salutations distinguées.\n\nSerhii Kovalenko',
  modelUk:
    'Пані, пане,\n\nДозволю собі звернутися щодо оренди квартири на вулиці Лілових, 12, заброньованої з 3 до 10 лютого під номером 48213.\n\nОднак після приїзду я виявив, що опалення не працює. Попри два дзвінки, 3 і 4 лютого, до 6-го числа ніхто не приїхав. Три ночі температура не перевищувала дванадцяти градусів.\n\nВ оголошенні прямо йшлося про житло з опаленням. Тому прошу вас повернути мені кошти за три відповідні ночі, тобто сто вісімдесят євро.\n\nЗалишаюся у вашому розпорядженні щодо будь-яких підтверджень і дякую за увагу до мого звернення.\n\nПрийміть, пані, пане, мої найкращі побажання.\n\nСергій Коваленко',
  rubric: [
    'Чи є в листі конкретика — дати, номер броні, сума? Без неї вимога слабка.',
    'Чи повторює формула прощання те саме звертання, з якого лист починався?',
    'Чи немає жодного емоційного слова? Факти переконують сильніше.',
  ],
}

const essai: WritingTask = {
  id: 'essai-delf',
  title: 'Un essai argumenté',
  titleUk: 'Есе (формат DELF B2)',
  level: 'B2',
  emoji: '📝',
  minutes: 30,
  brief:
    'Тема: «Чи мають міста заборонити приватні автомобілі в центрі?» Напиши структуроване есе: теза — антитеза — синтез.',
  requirements: [
    'Вступ, що формулює питання',
    'Аргументи «за» з прикладами',
    'Аргументи «проти» — чесно, а не як солома',
    'Власна позиція у висновку',
    'Зв’язні слова між абзацами',
  ],
  words: { min: 180, max: 260 },
  phrases: [
    { fr: 'On peut se demander si…', uk: 'Можна запитати себе, чи…' },
    { fr: 'En premier lieu,', uk: 'По-перше,' },
    { fr: 'Toutefois,', uk: 'Однак,' },
    { fr: 'Il n’en reste pas moins que…', uk: 'І все ж лишається фактом, що…' },
    { fr: 'Pour ma part, je considère que…', uk: 'Зі свого боку я вважаю, що…' },
  ],
  checks: [
    {
      any: ['en premier lieu', 'tout d’abord', "tout d'abord", 'premièrement', 'd’une part'],
      label: 'Структурний зачин',
      hint: 'Позначай кроки аргументації: «En premier lieu…».',
    },
    {
      any: ['toutefois', 'cependant', 'néanmoins', 'en revanche', 'pourtant'],
      label: 'Поворот до антитези',
      hint: 'Есе без «однак» — це не есе, а список. Додай протилежний бік.',
    },
    {
      any: ['pour ma part', 'je considère', 'il me semble', 'à mon sens', 'en conclusion'],
      label: 'Власна позиція',
      hint: 'Синтез — це не переказ обох сторін, а твій висновок із них.',
    },
    {
      any: ['par exemple', 'ainsi', 'notamment', 'en effet'],
      label: 'Приклади',
      hint: 'На B2 кожне твердження підкріплюється — «par exemple», «en effet».',
    },
  ],
  model:
    'Depuis quelques années, plusieurs grandes villes européennes limitent la circulation automobile dans leur centre. On peut se demander si une interdiction complète serait justifiée.\n\nEn premier lieu, les arguments en faveur d’une telle mesure sont solides. La pollution de l’air est responsable de dizaines de milliers de décès prématurés par an en France, et le trafic en est l’une des causes principales. Ainsi, les villes qui ont piétonnisé leur centre, comme Pontevedra en Espagne, ont vu la qualité de l’air s’améliorer nettement. À cela s’ajoute une transformation de l’espace public : une rue sans voitures redevient un lieu où l’on s’arrête.\n\nToutefois, on ne peut pas ignorer les effets d’une interdiction brutale. Tous les habitants n’ont pas le même accès aux transports en commun, et ce sont souvent les plus modestes qui vivent loin du centre. Les artisans et les commerçants, eux, ont besoin de leur véhicule pour travailler. Une mesure présentée comme écologique peut ainsi devenir socialement injuste.\n\nPour ma part, je considère que l’interdiction n’a de sens qu’accompagnée. Il n’en reste pas moins que le statu quo n’est pas tenable : la question n’est pas de savoir s’il faut réduire la place de la voiture, mais à quelle vitesse et avec quelles compensations.',
  modelUk:
    'Останніми роками кілька великих європейських міст обмежують автомобільний рух у центрі. Можна запитати себе, чи була б виправданою повна заборона.\n\nПо-перше, аргументи на користь такого кроку вагомі. Забруднення повітря спричиняє десятки тисяч передчасних смертей на рік у Франції, і трафік — одна з головних причин. Так, міста, які зробили центр пішохідним, як Понтеведра в Іспанії, помітно покращили якість повітря. До цього додається перетворення публічного простору: вулиця без машин знову стає місцем, де зупиняються.\n\nОднак не можна ігнорувати наслідки різкої заборони. Не всі мешканці мають однаковий доступ до громадського транспорту, і саме найменш заможні часто живуть далеко від центру. А ремісникам і торговцям автомобіль потрібен для роботи. Захід, поданий як екологічний, може виявитися соціально несправедливим.\n\nЗі свого боку я вважаю, що заборона має сенс лише в супроводі інших заходів. І все ж лишається фактом, що зберігати як є не вийде: питання не в тому, чи зменшувати місце автомобіля, а як швидко і з якими компенсаціями.',
  rubric: [
    'Чи можна прочитати лише перші речення абзаців і зрозуміти хід думки?',
    'Чи є антитеза справжньою — з найсильнішим аргументом іншої сторони, а не найслабшим?',
    'Чи додає висновок щось нове, чи лише повторює сказане?',
    'Порахуй слова: на DELF B2 недобір обсягу коштує балів навіть за гарний текст.',
  ],
}

export const WRITING_TASKS: WritingTask[] = [
  carte,
  reclamation,
  recit,
  opinion,
  lettreFormelle,
  essai,
]

export function getWritingTask(id: string) {
  return WRITING_TASKS.find((t) => t.id === id)
}
