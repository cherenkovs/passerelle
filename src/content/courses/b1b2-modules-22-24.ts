import type { Module } from '../types'

/* ================================================================== *
 * Модуль 22 — Письмо
 * ================================================================== */
export const module22: Module = {
  id: 'm22',
  title: 'Письмо',
  subtitle: 'Лист, email, есе',
  grammarFocus: 'Номіналізація, формули ділового листування, структура есе',
  emoji: '✍️',
  lessons: [
    {
      id: 'm22l1',
      title: 'Письмовий стиль',
      subtitle: 'Номіналізація',
      minutes: 14,
      newWords: [
        'laugmentation',
        'la_diminution',
        'la_croissance',
        'la_mise_en_place',
        'la_prise_de_conscience',
        'le_constat',
      ],
      steps: [
        {
          kind: 'grammar',
          title: 'Французьке письмо любить іменники',
          body: `Головна стилістична різниця між розмовною і письмовою французькою — **номіналізація**: там, де в мовленні дієслово, на письмі стоїть іменник.

> *Les prix **ont augmenté**.* (розмовно)
> ***L'augmentation** des prix…* (письмово)

Українська робить так само в офіційному стилі («ціни зросли» → «зростання цін»), тож механізм тобі знайомий. Різниця в тому, що французька письмова мова спирається на нього **значно частіше**.

Це не прикраса: без номіналізації текст читається як усна розповідь, і на іспитах DELF це помітно знижує оцінку.`,
          table: {
            caption: 'Дієслово → іменник',
            head: ['Дієслово', 'Іменник', 'Українською'],
            rows: [
              ['augmenter', 'l’augmentation', 'збільшення'],
              ['diminuer', 'la diminution', 'зменшення'],
              ['croître', 'la croissance', 'зростання'],
              ['mettre en place', 'la mise en place', 'запровадження'],
              ['prendre conscience', 'la prise de conscience', 'усвідомлення'],
              ['constater', 'le constat', 'констатація'],
              ['développer', 'le développement', 'розвиток'],
              ['réussir', 'la réussite', 'успіх'],
            ],
          },
          warning:
            'Не перестарайся: суцільна номіналізація робить текст важким і канцелярським. Норма — чергувати.',
        },
      ],
      exercises: [
        {
          id: 'm22l1e1',
          kind: 'type',
          prompt: 'Номіналізуй',
          question: 'augmenter → (іменник з артиклем)',
          answer: ["l'augmentation", 'laugmentation'],
          accents: true,
          words: ['laugmentation'],
        },
        {
          id: 'm22l1e2',
          kind: 'type',
          prompt: 'Номіналізуй',
          question: 'diminuer → (іменник з артиклем)',
          answer: ['la diminution'],
          accents: true,
          words: ['la_diminution'],
        },
        {
          id: 'm22l1e3',
          kind: 'mcq',
          prompt: 'Який варіант письмовий?',
          question: 'Оберіть формулювання для звіту',
          options: [
            'Les prix ont beaucoup augmenté cette année.',
            'On observe une forte augmentation des prix cette année.',
          ],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Номіналізація + безособове «on observe» — типовий письмовий стиль.',
        },
        {
          id: 'm22l1e4',
          kind: 'match',
          prompt: 'З’єднай дієслово з іменником',
          pairs: [
            { fr: 'augmenter', uk: "l'augmentation" },
            { fr: 'croître', uk: 'la croissance' },
            { fr: 'réussir', uk: 'la réussite' },
            { fr: 'constater', uk: 'le constat' },
          ],
          words: ['laugmentation', 'la_croissance', 'la_reussite', 'le_constat'],
        },
        {
          id: 'm22l1e5',
          kind: 'translate',
          prompt: 'Переклади письмовим стилем',
          question: 'Запровадження нових правил',
          answer: ['la mise en place de nouvelles règles'],
          words: ['la_mise_en_place'],
        },
        {
          id: 'm22l1e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'On observe une nette augmentation des prix.',
          translation: 'Спостерігається помітне зростання цін.',
        },
      ],
    },
    {
      id: 'm22l2',
      title: 'Лист і email',
      subtitle: 'Формули, без яких не обійтися',
      minutes: 15,
      newWords: ['soutenu', 'le_cadre', 'la_demarche'],
      steps: [
        {
          kind: 'grammar',
          title: 'Найформальніша письмова традиція Європи',
          body: `Французьке ділове листування значно церемонніше за українське. Кінцева формула — не ввічливість, а **обов'язковий елемент**: лист без неї читається як обірваний.

**Звертання**
*Madame, Monsieur,* — якщо не знаєш адресата (кома, з нового рядка)
*Madame Dupont,* — якщо знаєш
*Bonjour Marie,* — колезі, неформально

**Кінцівка — формальна**
*Je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.*
*Cordialement,* — стандарт для email
*Bien à vous,* — трохи тепліше`,
          table: {
            caption: 'Регістр листа',
            head: ['Ситуація', 'Кінцівка'],
            rows: [
              ['Офіційний лист', 'Je vous prie d’agréer… mes salutations distinguées.'],
              ['Діловий email', 'Cordialement,'],
              ['Email колезі', 'Bien à vous, / Bonne journée,'],
              ['Другові', 'À bientôt, / Bises,'],
            ],
          },
          warning:
            '⚠️ У формальній кінцівці треба **повторити звертання**: якщо почав «Madame, Monsieur,», то й у кінці «…agréer, Madame, Monsieur, …». Пропустити — помітна недбалість.',
        },
        {
          kind: 'grammar',
          title: 'Корисні звороти',
          body: `**Мета листа**
*Je vous écris **au sujet de**…* — Пишу вам щодо…
*Je me permets de vous contacter **concernant**…* — Дозволю собі звернутися стосовно…

**Прохання**
*Je vous serais reconnaissant de bien vouloir…* — Був би вдячний, якби ви…
*Pourriez-vous m'indiquer…* — Чи могли б ви вказати…

**Додаток і очікування**
*Veuillez trouver ci-joint…* — Додаю у вкладенні…
*Dans l'attente de votre réponse…* — В очікуванні вашої відповіді…`,
          examples: [
            {
              fr: 'Je vous écris au sujet de votre annonce.',
              uk: 'Пишу вам щодо вашого оголошення.',
            },
            { fr: 'Veuillez trouver ci-joint mon CV.', uk: 'Додаю у вкладенні своє резюме.' },
            {
              fr: 'Dans l’attente de votre réponse, je vous remercie.',
              uk: 'В очікуванні відповіді дякую вам.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm22l2e1',
          kind: 'mcq',
          prompt: 'Кінцівка ділового email',
          question: 'Як завершити email колезі, якого мало знаєш?',
          options: ['Bises,', 'Cordialement,', 'Je t’embrasse,'],
          answer: 1,
          optionsAreFrench: true,
          explain: '«Cordialement» — універсальний стандарт ділового email.',
        },
        {
          id: 'm22l2e2',
          kind: 'mcq',
          prompt: 'Звертання',
          question: 'Ти не знаєш, хто читатиме лист. Як почати?',
          options: ['Cher ami,', 'Madame, Monsieur,', 'Bonjour,'],
          answer: 1,
          optionsAreFrench: true,
        },
        {
          id: 'm22l2e3',
          kind: 'cloze',
          prompt: 'Вкладення',
          sentence: 'Veuillez trouver ___ mon CV.',
          answer: ['ci-joint', 'ci joint'],
          translation: 'Додаю у вкладенні своє резюме.',
        },
        {
          id: 'm22l2e4',
          kind: 'cloze',
          prompt: 'Мета листа',
          sentence: 'Je vous écris ___ ___ ___ votre annonce.',
          answer: ['au sujet de'],
          translation: 'Пишу вам щодо вашого оголошення.',
          hint: 'Три слова',
          words: ['w_sujet'],
        },
        {
          id: 'm22l2e5',
          kind: 'mcq',
          prompt: 'Що не так?',
          question:
            'Лист починається «Madame, Monsieur,» і закінчується «Je vous prie d’agréer mes salutations distinguées.»',
          options: [
            'Усе правильно',
            'У кінцівці треба повторити звертання: «…d’agréer, Madame, Monsieur, mes salutations…»',
          ],
          answer: 1,
        },
        {
          id: 'm22l2e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'В очікуванні вашої відповіді.',
          answer: ['dans l’attente de votre réponse', "dans l'attente de votre réponse"],
          words: ['w_reponse'],
        },
        {
          id: 'm22l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Je me permets de vous contacter au sujet de votre offre.',
          translation: 'Дозволю собі звернутися щодо вашої пропозиції.',
        },
      ],
    },
    {
      id: 'm22l3',
      title: 'Структура есе',
      subtitle: 'Теза, антитеза, синтез',
      minutes: 15,
      newWords: ['lenjeu', 'le_bilan', 'par_consequent', 'certes', 'neanmoins'],
      steps: [
        {
          kind: 'grammar',
          title: 'Французи вчать це зі школи',
          body: `Французьке есе має **жорстку структуру**, якої очікують і на DELF, і в університеті. Це не стилістична забаганка — це формат, за яким оцінюють.

**Вступ** — підвести до теми, сформулювати питання, оголосити план.
**Частина 1 (thèse)** — аргументи «за».
**Частина 2 (antithèse)** — аргументи «проти».
**Частина 3 або висновок (synthèse)** — зважена позиція.

Ключова відмінність від українського шкільного твору: **не можна одразу заявити свою думку і захищати лише її**. Треба показати обидві сторони, і лише потім зробити висновок.`,
          table: {
            caption: 'Фрази-каркас',
            head: ['Етап', 'Формула'],
            rows: [
              ['Поставити питання', 'On peut se demander si…'],
              ['Оголосити план', 'Nous verrons d’abord…, puis…'],
              ['Перший аргумент', 'Tout d’abord, il convient de noter que…'],
              ['Додати', 'De plus, / En outre,'],
              ['Приклад', 'Ainsi, / Par exemple,'],
              ['Перехід до антитези', 'Cependant, / Néanmoins,'],
              ['Поступка', 'Certes…, mais…'],
              ['Висновок', 'En définitive, / Pour conclure,'],
            ],
          },
          warning:
            'Обсяг теж очікуваний: на DELF B2 — приблизно 250 слів. Коротше читається як недопрацьоване, значно довше — як невміння структурувати.',
        },
        {
          kind: 'dialogue',
          title: 'Каркас есе в дії',
          setting: 'Тема: «Чи варто забороняти авто в центрі міст?»',
          lines: [
            {
              speaker: 'Вступ',
              fr: 'La question des transports urbains est aujourd’hui au cœur du débat. On peut se demander s’il faut interdire les voitures en centre-ville.',
              uk: 'Питання міського транспорту нині в центрі дискусії. Можна запитати, чи варто забороняти авто в центрі міста.',
            },
            {
              speaker: 'Thèse',
              fr: 'Tout d’abord, il convient de noter que la pollution diminuerait sensiblement. De plus, les piétons y gagneraient en sécurité.',
              uk: 'Насамперед варто зауважити, що забруднення відчутно зменшилося б. Крім того, пішоходи виграли б у безпеці.',
            },
            {
              speaker: 'Antithèse',
              fr: 'Néanmoins, une telle mesure pénaliserait les commerçants. Certes, l’argument écologique est valable, mais l’économie locale en souffrirait.',
              uk: 'Проте такий захід ударив би по торговцях. Звісно, екологічний аргумент слушний, але місцева економіка постраждала б.',
            },
            {
              speaker: 'Synthèse',
              fr: 'En définitive, la solution résiderait moins dans l’interdiction que dans le développement des transports en commun.',
              uk: 'Зрештою, рішення полягало б не так у забороні, як у розвитку громадського транспорту.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm22l3e1',
          kind: 'cloze',
          prompt: 'Поставити питання',
          sentence: 'On peut se ___ si cette mesure est efficace.',
          answer: ['demander'],
          translation: 'Можна запитати, чи цей захід ефективний.',
          words: ['w_demander'],
        },
        {
          id: 'm22l3e2',
          kind: 'cloze',
          prompt: 'Перехід до антитези',
          sentence: 'L’idée est séduisante. ___, elle coûte cher.',
          answer: ['cependant', 'néanmoins', 'toutefois'],
          translation: 'Ідея приваблива. Проте вона дорога.',
          words: ['w_cependant', 'neanmoins'],
        },
        {
          id: 'm22l3e3',
          kind: 'mcq',
          prompt: 'Структура',
          question: 'Що НЕ належить до французького есе?',
          options: [
            'Показати обидві сторони',
            'Одразу заявити свою думку і захищати лише її',
            'Зробити зважений висновок',
          ],
          answer: 1,
          explain:
            'Саме це найчастіше знижує оцінку іноземцям: французький формат вимагає антитези.',
        },
        {
          id: 'm22l3e4',
          kind: 'cloze',
          prompt: 'Поступка',
          sentence: '___, cet argument est valable, mais il reste incomplet.',
          answer: ['certes'],
          translation: 'Звісно, цей аргумент слушний, але він неповний.',
          words: ['certes'],
        },
        {
          id: 'm22l3e5',
          kind: 'match',
          prompt: 'З’єднай етап із формулою',
          pairs: [
            { fr: 'Tout d’abord', uk: 'перший аргумент' },
            { fr: 'De plus', uk: 'додати аргумент' },
            { fr: 'Néanmoins', uk: 'перехід до антитези' },
            { fr: 'En définitive', uk: 'висновок' },
          ],
        },
        {
          id: 'm22l3e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Насамперед варто зауважити, що…',
          answer: [
            'tout d’abord, il convient de noter que',
            "tout d'abord, il convient de noter que",
          ],
        },
        {
          id: 'm22l3e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'En définitive, la solution reste à trouver.',
          translation: 'Зрештою, рішення ще належить знайти.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm22q1',
      kind: 'type',
      prompt: 'Номіналізуй',
      question: 'croître → (іменник з артиклем)',
      answer: ['la croissance'],
      accents: true,
    },
    {
      id: 'm22q2',
      kind: 'mcq',
      prompt: 'Email',
      question: 'Стандартна кінцівка ділового email',
      options: ['Bises,', 'Cordialement,'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm22q3',
      kind: 'cloze',
      prompt: 'Вкладення',
      sentence: 'Veuillez trouver ___ le document demandé.',
      answer: ['ci-joint', 'ci joint'],
      translation: 'Додаю запитаний документ.',
    },
    {
      id: 'm22q4',
      kind: 'mcq',
      prompt: 'Есе',
      question: 'Скільки приблизно слів очікують на DELF B2?',
      options: ['100', '250', '600'],
      answer: 1,
    },
    {
      id: 'm22q5',
      kind: 'cloze',
      prompt: 'Висновок',
      sentence: '___ ___, il faudrait combiner les deux approches.',
      answer: ['en définitive', 'en definitive'],
      translation: 'Зрештою, слід було б поєднати обидва підходи.',
    },
    {
      id: 'm22q6',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Пишу вам щодо вашого оголошення.',
      answer: [
        'je vous écris au sujet de votre annonce',
        'je vous ecris au sujet de votre annonce',
      ],
    },
    {
      id: 'm22q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Je vous serais reconnaissant de bien vouloir répondre.',
      translation: 'Був би вдячний, якби ви відповіли.',
    },
    {
      id: 'm22q8',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'augmenter', uk: "l'augmentation" },
        { fr: 'diminuer', uk: 'la diminution' },
        { fr: 'mettre en place', uk: 'la mise en place' },
        { fr: 'constater', uk: 'le constat' },
      ],
    },
  ],
}

/* ================================================================== *
 * Модуль 23 — Ідіоми й образність
 * ================================================================== */
export const module23: Module = {
  id: 'm23',
  title: 'Ідіоми й образність',
  subtitle: 'Те, що не перекладається дослівно',
  grammarFocus: 'Ідіоматичні вирази, образні звороти, хибні друзі',
  emoji: '🎨',
  lessons: [
    {
      id: 'm23l1',
      title: 'Найчастіші ідіоми',
      subtitle: 'Дослівно — безглуздя',
      minutes: 14,
      newWords: [
        'avoir_le_cafard',
        'couter_les_yeux',
        'poser_un_lapin',
        'avoir_du_pain',
        'valoir_le_coup',
        'etre_a_laise',
      ],
      steps: [
        {
          kind: 'intro',
          title: 'Чому це рівень B2',
          body: `Ідіоми — точка, де знання слів перестає рятувати. Ти розумієш кожне слово окремо, а фраза все одно безглузда.

*«Il a posé un lapin»* — «він поклав кролика»? Ні: **він не прийшов на зустріч**.

Українська поводиться так само («бити байдики», «водити за носа»), тож механізм тобі знайомий — просто образи інші. Хороша новина: у щоденному вжитку їх не сотні, а кілька десятків.`,
        },
        {
          kind: 'grammar',
          title: 'Робочий мінімум',
          body: `Ці трапляються постійно — у розмові, серіалах, підкастах.`,
          table: {
            caption: 'Дослівно vs насправді',
            head: ['Вираз', 'Дослівно', 'Насправді'],
            rows: [
              ['poser un lapin', 'покласти кролика', 'не прийти на зустріч'],
              ['avoir le cafard', 'мати таргана', 'сумувати, хандрити'],
              ['coûter les yeux de la tête', 'коштувати очей з голови', 'коштувати шалено дорого'],
              ['tomber dans les pommes', 'упасти в яблука', 'знепритомніти'],
              ['avoir du pain sur la planche', 'мати хліб на дошці', 'мати купу роботи'],
              ['faire la tête', 'робити голову', 'дутися, ображатися'],
              ['avoir la pêche', 'мати персик', 'бути бадьорим'],
              ['valoir le coup', 'вартувати удару', 'бути вартим того'],
            ],
          },
          warning:
            'Порада щодо вживання: **розумій усі, вживай обережно**. Ідіома в устах іноземця звучить чудово, коли доречна, і дуже дивно, коли ні. Починай із найбезпечніших: «ça vaut le coup», «être à l’aise».',
        },
      ],
      exercises: [
        {
          id: 'm23l1e1',
          kind: 'mcq',
          prompt: 'Що це означає?',
          question: 'Il m’a posé un lapin.',
          options: [
            'Він подарував мені кролика',
            'Він не прийшов на зустріч',
            'Він мене розсмішив',
          ],
          answer: 1,
          words: ['poser_un_lapin'],
        },
        {
          id: 'm23l1e2',
          kind: 'mcq',
          prompt: 'А це?',
          question: 'Ça coûte les yeux de la tête.',
          options: ['Це дуже дорого', 'Це небезпечно для очей', 'Це безкоштовно'],
          answer: 0,
          words: ['couter_les_yeux'],
        },
        {
          id: 'm23l1e3',
          kind: 'mcq',
          prompt: 'Стан людини',
          question: 'J’ai le cafard.',
          options: ['У мене таргани', 'Мені сумно', 'Я голодний'],
          answer: 1,
          words: ['avoir_le_cafard'],
        },
        {
          id: 'm23l1e4',
          kind: 'match',
          prompt: 'З’єднай ідіому зі значенням',
          pairs: [
            { fr: 'avoir du pain sur la planche', uk: 'мати багато роботи' },
            { fr: 'tomber dans les pommes', uk: 'знепритомніти' },
            { fr: 'faire la tête', uk: 'дутися' },
            { fr: 'avoir la pêche', uk: 'бути бадьорим' },
          ],
          words: ['avoir_du_pain', 'tomber_dans_les_pommes', 'faire_la_tete', 'avoir_la_peche'],
        },
        {
          id: 'm23l1e5',
          kind: 'cloze',
          prompt: 'Чи варте воно того?',
          sentence: 'Le voyage est long, mais ça ___ ___ ___.',
          answer: ['vaut le coup'],
          translation: 'Дорога довга, але воно того варте.',
          hint: 'Три слова',
          words: ['valoir_le_coup'],
        },
        {
          id: 'm23l1e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'У мене купа роботи.',
          answer: ["j'ai du pain sur la planche", "j'ai beaucoup de travail"],
          words: ['avoir_du_pain'],
        },
        {
          id: 'm23l1e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Ça vaut vraiment le coup.',
          translation: 'Це справді того варте.',
        },
      ],
    },
    {
      id: 'm23l2',
      title: 'Тіло і тварини',
      subtitle: 'Образи, з яких зроблені вирази',
      minutes: 13,
      newWords: ['mettre_les_pieds', 'pas_dans_son_assiette', 'casser_les_pieds', 'faire_la_tete'],
      steps: [
        {
          kind: 'grammar',
          title: 'Частини тіла в переносному значенні',
          body: `Французька будує величезну кількість виразів навколо тіла. Знаючи образ, значення часто вгадується.

**Голова (la tête)**
*faire la tête* — дутися · *en avoir par-dessus la tête* — бути ситим по горло

**Ноги (les pieds)**
*casser les pieds à quelqu'un* — набридати · *mettre les pieds dans le plat* — бовкнути зайве

**Рука (la main)**
*donner un coup de main* — допомогти · *avoir la main verte* — мати хист до рослин

**Око (l'œil)**
*à l'œil* — безкоштовно · *avoir l'œil* — мати гостре око

**Серце (le cœur)**
*avoir mal au cœur* — нудить (⚠️ не «болить серце»!) · *apprendre par cœur* — вчити напам'ять`,
          table: {
            caption: 'Тварини',
            head: ['Вираз', 'Значення'],
            rows: [
              ['avoir un chat dans la gorge', 'захрипнути'],
              ['il fait un froid de canard', 'страшенний холод'],
              ['quand les poules auront des dents', 'коли рак на горі свисне'],
              ['avoir une faim de loup', 'бути голодним як вовк'],
              ['poser un lapin', 'не прийти на зустріч'],
            ],
          },
          warning:
            '⚠️ **avoir mal au cœur** означає «мене нудить», а не «болить серце». Серцевий біль — «avoir une douleur à la poitrine». Помилка з медичними наслідками.',
        },
      ],
      exercises: [
        {
          id: 'm23l2e1',
          kind: 'mcq',
          prompt: 'Небезпечна пастка',
          question: 'J’ai mal au cœur.',
          options: ['У мене болить серце', 'Мене нудить'],
          answer: 1,
          explain:
            '⚠️ Для серцевого болю кажуть «une douleur à la poitrine». Ця плутанина може дорого коштувати.',
          words: ['w_coeur'],
        },
        {
          id: 'm23l2e2',
          kind: 'mcq',
          prompt: 'Що це означає?',
          question: 'Tu me casses les pieds.',
          options: ['Ти ламаєш мені ноги', 'Ти мені набридаєш'],
          answer: 1,
          words: ['casser_les_pieds'],
        },
        {
          id: 'm23l2e3',
          kind: 'mcq',
          prompt: 'Ситуація',
          question: 'Il a mis les pieds dans le plat.',
          options: ['Він бовкнув зайве', 'Він наступив у тарілку', 'Він допоміг'],
          answer: 0,
          words: ['mettre_les_pieds'],
        },
        {
          id: 'm23l2e4',
          kind: 'match',
          prompt: 'З’єднай вирази з тваринами',
          pairs: [
            { fr: 'un froid de canard', uk: 'страшенний холод' },
            { fr: 'une faim de loup', uk: 'вовчий голод' },
            { fr: 'un chat dans la gorge', uk: 'захрипнути' },
            { fr: 'quand les poules auront des dents', uk: 'коли рак свисне' },
          ],
        },
        {
          id: 'm23l2e5',
          kind: 'cloze',
          prompt: 'Допомога',
          sentence: 'Tu peux me donner un ___ ___ ___ ?',
          answer: ['coup de main'],
          translation: 'Можеш мені допомогти?',
          hint: 'Три слова',
          words: ['w_main'],
        },
        {
          id: 'm23l2e6',
          kind: 'mcq',
          prompt: 'Вчити напам’ять',
          question: 'Як сказати «вчити напам’ять»?',
          options: ['apprendre par tête', 'apprendre par cœur'],
          answer: 1,
          optionsAreFrench: true,
        },
        {
          id: 'm23l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Je ne suis pas dans mon assiette aujourd’hui.',
          translation: 'Я сьогодні недобре почуваюся.',
          words: ['pas_dans_son_assiette'],
        },
      ],
    },
    {
      id: 'm23l3',
      title: 'Хибні друзі',
      subtitle: 'Слова, що зраджують',
      minutes: 14,
      newWords: [
        'eventuellement',
        'sensible',
        'la_librairie',
        'la_location',
        'assister',
        'ignorer',
        'pretendre',
        'la_journee',
      ],
      steps: [
        {
          kind: 'intro',
          title: 'Найпідступніша категорія',
          body: `Хибні друзі гірші за незнайомі слова. Незнайоме слово ти подивишся у словнику — а хибного друга **впевнено вживеш неправильно**, бо він виглядає прозорим.

Українська запозичила багато французьких коренів, і саме тому ця пастка для нас особливо небезпечна: «локація», «претендувати», «сенсибельний» звучать знайомо, але у французькій означають інше.`,
        },
        {
          kind: 'grammar',
          title: 'Список, який варто вивчити',
          body: `Кожен із цих трапляється часто — і помилка помітна одразу.`,
          table: {
            caption: 'Виглядає знайомо → означає інше',
            head: ['Французьке', 'НЕ означає', 'Означає'],
            rows: [
              ['éventuellement', 'врешті-решт', 'можливо, за потреби'],
              ['actuellement', 'актуально', 'нині, зараз'],
              ['sensible', 'розсудливий', 'чутливий'],
              ['la librairie', 'бібліотека', 'книгарня'],
              ['la location', 'локація', 'оренда'],
              ['assister à', 'асистувати', 'бути присутнім на'],
              ['ignorer', 'ігнорувати', 'не знати'],
              ['prétendre', 'претендувати', 'стверджувати'],
              ['large', 'великий', 'широкий'],
              ['la monnaie', 'монета', 'решта, дрібні гроші'],
              ['le collège', 'коледж', 'середня школа'],
              ['demander', 'вимагати', 'питати, просити'],
            ],
          },
          warning:
            '⚠️ Найнебезпечніший — **ignorer**. «J’ignore son adresse» означає «я не знаю його адреси», а не «я ігнорую його адресу».',
        },
      ],
      exercises: [
        {
          id: 'm23l3e1',
          kind: 'mcq',
          prompt: 'Що це означає?',
          question: 'J’ignore la réponse.',
          options: ['Я ігнорую відповідь', 'Я не знаю відповіді'],
          answer: 1,
          words: ['ignorer'],
        },
        {
          id: 'm23l3e2',
          kind: 'mcq',
          prompt: 'Куди йти по книжку?',
          question: 'Où acheter un livre ?',
          options: ['à la bibliothèque', 'à la librairie'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'librairie — книгарня (продають), bibliothèque — бібліотека (позичають).',
          words: ['la_librairie'],
        },
        {
          id: 'm23l3e3',
          kind: 'mcq',
          prompt: 'Значення',
          question: 'Éventuellement, je viendrai.',
          options: ['Врешті-решт я прийду', 'Можливо, я прийду'],
          answer: 1,
          words: ['eventuellement'],
        },
        {
          id: 'm23l3e4',
          kind: 'mcq',
          prompt: 'Значення',
          question: 'Il prétend être médecin.',
          options: ['Він претендує на посаду лікаря', 'Він стверджує, що він лікар'],
          answer: 1,
          words: ['pretendre'],
        },
        {
          id: 'm23l3e5',
          kind: 'match',
          prompt: 'З’єднай із правильним значенням',
          pairs: [
            { fr: 'la location', uk: 'оренда' },
            { fr: 'sensible', uk: 'чутливий' },
            { fr: 'assister à', uk: 'бути присутнім' },
            { fr: 'la monnaie', uk: 'решта' },
          ],
          words: ['la_location', 'sensible', 'assister'],
        },
        {
          id: 'm23l3e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Я не знаю його адреси.',
          answer: ["j'ignore son adresse", 'je ne connais pas son adresse'],
          words: ['ignorer', 'w_adresse'],
        },
        {
          id: 'm23l3e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Actuellement, je travaille à Lyon.',
          translation: 'Нині я працюю в Ліоні.',
          words: ['w_actuellement'],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm23q1',
      kind: 'mcq',
      prompt: 'Ідіома',
      question: 'Elle m’a posé un lapin.',
      options: ['Вона не прийшла', 'Вона подарувала кролика'],
      answer: 0,
    },
    {
      id: 'm23q2',
      kind: 'mcq',
      prompt: 'Небезпечна пастка',
      question: 'J’ai mal au cœur.',
      options: ['Болить серце', 'Нудить'],
      answer: 1,
    },
    {
      id: 'm23q3',
      kind: 'mcq',
      prompt: 'Хибний друг',
      question: 'J’ignore son nom.',
      options: ['Я ігнорую його ім’я', 'Я не знаю його імені'],
      answer: 1,
    },
    {
      id: 'm23q4',
      kind: 'cloze',
      prompt: 'Це того варте',
      sentence: 'C’est long, mais ça ___ ___ ___.',
      answer: ['vaut le coup'],
      translation: 'Це довго, але воно того варте.',
    },
    {
      id: 'm23q5',
      kind: 'mcq',
      prompt: 'Де купити книжку?',
      question: 'Un livre s’achète…',
      options: ['à la bibliothèque', 'à la librairie'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm23q6',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'У мене купа роботи.',
      answer: ["j'ai du pain sur la planche"],
    },
    {
      id: 'm23q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Il fait un froid de canard.',
      translation: 'Страшенний холод.',
    },
    {
      id: 'm23q8',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'éventuellement', uk: 'можливо' },
        { fr: 'actuellement', uk: 'нині' },
        { fr: 'prétendre', uk: 'стверджувати' },
        { fr: 'la location', uk: 'оренда' },
      ],
    },
  ],
}

/* ================================================================== *
 * Модуль 24 — Справжня французька
 * ================================================================== */
export const module24: Module = {
  id: 'm24',
  title: 'Справжня французька',
  subtitle: 'Література, медіа, кіно',
  grammarFocus: 'Passé simple для читання, мова медіа, розуміння швидкого мовлення',
  emoji: '📚',
  lessons: [
    {
      id: 'm24l1',
      title: 'Passé simple',
      subtitle: 'Час, який треба лише впізнавати',
      minutes: 14,
      newWords: ['la_presse', 'larticle', 'w_auteur', 'w_roman'],
      steps: [
        {
          kind: 'grammar',
          title: 'Не вчи говорити — вчи читати',
          body: `**Passé simple** — літературний минулий час. Його **не вживають у мовленні взагалі**: жоден француз не скаже «je mangeai» у розмові.

Але щойно ти відкриєш роман, казку чи історичний текст — він на кожній сторінці. Тому мета тут інша: **упізнавати**, а не вживати.

За значенням це те саме, що passé composé:
*Il **mangea**.* = *Il **a mangé**.* — Він поїв.`,
          table: {
            caption: 'Типові закінчення (3 особа)',
            head: ['Група', 'Однина', 'Множина', 'Приклад'],
            rows: [
              ['-er', '-a', '-èrent', 'il parla / ils parlèrent'],
              ['-ir, -re', '-it', '-irent', 'il finit / ils finirent'],
              ['неправильні', '-ut', '-urent', 'il fut / ils furent (être)'],
              ['avoir', 'il eut', 'ils eurent', '—'],
              ['faire', 'il fit', 'ils firent', '—'],
              ['venir', 'il vint', 'ils vinrent', '—'],
            ],
          },
          warning:
            'Практичне правило впізнавання: якщо в тексті трапляється форма на **-a, -it, -ut, -èrent, -irent, -urent** там, де ти очікував passé composé, — це passé simple. Перекладай так само.',
        },
        {
          kind: 'grammar',
          title: 'Як це виглядає в тексті',
          body: `Уривок у стилі класичної казки — саме там passé simple почувається вдома:

> *Le renard **s'approcha** du corbeau. Il **leva** la tête et **dit** : « Que vous êtes beau ! » Le corbeau, flatté, **ouvrit** le bec et **laissa** tomber le fromage.*

Переклад той самий, що з passé composé: підійшов, підняв, сказав, розкрив, впустив.

У сучасній прозі й новинах passé simple майже витіснений — але в літературі, історії та казках лишається нормою.`,
          examples: [
            { fr: 'Il fut surpris. (= Il a été surpris.)', uk: 'Він був здивований.' },
            { fr: 'Ils partirent au lever du jour.', uk: 'Вони вирушили на світанку.' },
            { fr: 'Elle ouvrit la porte et entra.', uk: 'Вона відчинила двері й увійшла.' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm24l1e1',
          kind: 'mcq',
          prompt: 'Що це за час?',
          question: 'Il mangea rapidement.',
          options: ['Passé simple = il a mangé', 'Imparfait = il mangeait', 'Futur'],
          answer: 0,
        },
        {
          id: 'm24l1e2',
          kind: 'mcq',
          prompt: 'Переклади',
          question: 'Elle ouvrit la porte.',
          options: ['Вона відчиняла двері', 'Вона відчинила двері'],
          answer: 1,
          explain: 'Passé simple = завершена дія, як passé composé.',
        },
        {
          id: 'm24l1e3',
          kind: 'mcq',
          prompt: 'Впізнай дієслово',
          question: 'Il fut surpris.',
          options: ['être', 'faire', 'falloir'],
          answer: 0,
          optionsAreFrench: true,
          explain: 'fut — passé simple від être.',
        },
        {
          id: 'm24l1e4',
          kind: 'mcq',
          prompt: 'Де ти це зустрінеш?',
          question: 'Passé simple вживається…',
          options: ['У розмові щодня', 'У літературі, казках, історичних текстах'],
          answer: 1,
        },
        {
          id: 'm24l1e5',
          kind: 'match',
          prompt: 'З’єднай passé simple із passé composé',
          pairs: [
            { fr: 'il fit', uk: 'il a fait' },
            { fr: 'il vint', uk: 'il est venu' },
            { fr: 'il eut', uk: 'il a eu' },
            { fr: 'il fut', uk: 'il a été' },
          ],
        },
        {
          id: 'm24l1e6',
          kind: 'translate',
          prompt: 'Переклади українською зміст',
          question: 'Ils partirent au lever du jour.',
          answer: ['вони вирушили на світанку', 'вони пішли на світанку'],
        },
      ],
    },
    {
      id: 'm24l2',
      title: 'Мова медіа',
      subtitle: 'Новини, подкасти, заголовки',
      minutes: 14,
      newWords: ['lactualite', 'lemission', 'le_reportage', 'lenquete', 'le_debat'],
      steps: [
        {
          kind: 'grammar',
          title: 'Заголовки грають за іншими правилами',
          body: `Французькі заголовки стискають мову: **артиклі й дієслова зникають**, лишається каркас.

> *Grève des transports : négociations en cours*
> (= Il y a une grève des transports et les négociations sont en cours.)

Типові риси:
• двокрапка замість дієслова
• номіналізація («négociations», а не «on négocie»)
• інфінітив у значенні майбутнього: *Réformer le système : le défi du gouvernement*
• conditionnel для неперевіреного: *Le ministre **aurait** démissionné* — міністр начебто подав у відставку`,
          table: {
            caption: 'Слова, що повторюються в новинах',
            head: ['Французькою', 'Українською'],
            rows: [
              ['selon des sources proches', 'за даними близьких джерел'],
              ['à la suite de', 'унаслідок'],
              ['faire l’objet de', 'бути предметом'],
              ['mettre en place', 'запровадити'],
              ['revoir à la hausse / baisse', 'переглянути в бік збільшення / зменшення'],
              ['une prise de position', 'заява позиції'],
            ],
          },
          warning:
            '⚠️ **Conditionnel у новинах = «начебто»**. «Le bilan s’élèverait à dix blessés» — «за наявними даними, поранених десятеро». Журналіст так знімає з себе відповідальність за неперевірене.',
        },
        {
          kind: 'dialogue',
          title: 'Випуск новин',
          setting: 'Радіо, ранковий ефір',
          lines: [
            {
              speaker: 'Journaliste',
              fr: 'À la suite du mouvement social, les négociations reprendront demain.',
              uk: 'Унаслідок соціального руху перемовини відновляться завтра.',
            },
            {
              speaker: 'Journaliste',
              fr: 'Selon des sources proches du dossier, un accord serait envisagé.',
              uk: 'За даними джерел, близьких до справи, начебто розглядається угода.',
            },
            {
              speaker: 'Journaliste',
              fr: 'Le gouvernement a revu ses prévisions à la baisse.',
              uk: 'Уряд переглянув прогнози в бік зниження.',
            },
            {
              speaker: 'Journaliste',
              fr: 'Cette décision fait l’objet de vives critiques.',
              uk: 'Це рішення є предметом гострої критики.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm24l2e1',
          kind: 'mcq',
          prompt: 'Розшифруй заголовок',
          question: 'Grève des transports : négociations en cours',
          options: [
            'Триває страйк на транспорті, перемовини відбуваються',
            'Транспорт працює нормально',
          ],
          answer: 0,
          words: ['la_greve'],
        },
        {
          id: 'm24l2e2',
          kind: 'mcq',
          prompt: 'Що означає conditionnel тут?',
          question: 'Le ministre aurait démissionné.',
          options: [
            'Міністр точно пішов у відставку',
            'Міністр начебто пішов у відставку (неперевірено)',
          ],
          answer: 1,
        },
        {
          id: 'm24l2e3',
          kind: 'cloze',
          prompt: 'Медійний зворот',
          sentence: '___ ___ ___ des manifestations, le projet a été suspendu.',
          answer: ['à la suite de', 'a la suite de'],
          translation: 'Унаслідок демонстрацій проєкт призупинено.',
          hint: 'Чотири слова',
          words: ['la_manifestation'],
        },
        {
          id: 'm24l2e4',
          kind: 'match',
          prompt: 'З’єднай медійні звороти',
          pairs: [
            { fr: 'à la suite de', uk: 'унаслідок' },
            { fr: 'faire l’objet de', uk: 'бути предметом' },
            { fr: 'revoir à la baisse', uk: 'переглянути в бік зниження' },
            { fr: 'selon des sources', uk: 'за даними джерел' },
          ],
        },
        {
          id: 'm24l2e5',
          kind: 'listen',
          prompt: 'Що повідомляють?',
          audioText: 'Selon des sources proches, un accord serait envisagé.',
          options: ['Угода начебто розглядається', 'Угоду підписано', 'Перемовини провалилися'],
          answer: 0,
        },
        {
          id: 'm24l2e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Це рішення критикують.',
          answer: ['cette décision fait l’objet de critiques', 'cette décision est critiquée'],
        },
        {
          id: 'm24l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Le gouvernement a revu ses prévisions à la baisse.',
          translation: 'Уряд переглянув прогнози в бік зниження.',
        },
      ],
    },
    {
      id: 'm24l3',
      title: 'Розуміти кіно',
      subtitle: 'Швидка мова без субтитрів',
      minutes: 15,
      newWords: ['du_coup', 'le_truc', 'le_pote', 'carrement', 'en_gros'],
      steps: [
        {
          kind: 'intro',
          title: 'Остання миля',
          body: `Ти читаєш статті, ведеш розмову, пишеш листи — а фільм без субтитрів усе одно вислизає. Це нормально і має конкретні причини:

1. **Швидкість** — 250–300 складів на хвилину проти 180 у навчальних аудіо.
2. **Редукція** — усе з модуля 19, тільки без пауз.
3. **Розмовна лексика** — герої говорять як друзі, а не як диктори.
4. **Накладання** — репліки перебивають одна одну, є фоновий шум.

Це не проблема рівня. Це окрема навичка, яка тренується окремо.`,
        },
        {
          kind: 'grammar',
          title: 'Стратегія, що працює',
          body: `**Крок 1.** Дивись із **французькими** субтитрами, не з українськими. Українські вимикають слух повністю — мозок читає й перестає слухати.

**Крок 2.** Той самий епізод удруге без субтитрів. Знайомий сюжет звільняє увагу для звуку.

**Крок 3.** Почни з форматів, де говорять чіткіше: інтерв'ю, документальні фільми, дитячі мультфільми. Комедії й підліткові серіали — найважчі, бо там найбільше арго.

**Крок 4.** Не намагайся зрозуміти кожне слово. Ціль — **нитка розповіді**, а не стенограма.`,
          table: {
            caption: 'Від найлегшого до найважчого',
            head: ['Формат', 'Складність', 'Чому'],
            rows: [
              ['Дитячі мультфільми', 'легко', 'проста лексика, чітка вимова'],
              ['Документальні фільми', 'легко', 'дикторський текст, повні форми'],
              ['Інтерв’ю, подкасти', 'середньо', 'жива, але виразна мова'],
              ['Драми, історичне кіно', 'середньо', 'мова ближча до літературної'],
              ['Комедії, серіали про молодь', 'важко', 'арго, швидкість, жарти'],
            ],
          },
          warning:
            'Реалістичне очікування: на B2 у фільмі розуміють приблизно 70–80 %. Стовідсоткове розуміння — це вже C1–C2. Не сприймай прогалини як провал.',
        },
      ],
      exercises: [
        {
          id: 'm24l3e1',
          kind: 'mcq',
          prompt: 'Стратегія перегляду',
          question: 'Які субтитри найкорисніші?',
          options: ['Українські', 'Французькі', 'Без субтитрів одразу'],
          answer: 1,
          explain: 'Українські вимикають слух: мозок читає замість слухати.',
        },
        {
          id: 'm24l3e2',
          kind: 'mcq',
          prompt: 'З чого почати?',
          question: 'Який формат найлегший для слуху?',
          options: ['Комедія про підлітків', 'Документальний фільм'],
          answer: 1,
          explain: 'Дикторський текст — повні форми, чітка вимова, без арго.',
        },
        {
          id: 'm24l3e3',
          kind: 'mcq',
          prompt: 'Розшифруй розмовну репліку',
          question: 'Du coup, on fait quoi ce soir ?',
          options: ['То що робимо сьогодні ввечері?', 'Ударом ми робимо вечір'],
          answer: 0,
          words: ['du_coup'],
        },
        {
          id: 'm24l3e4',
          kind: 'mcq',
          prompt: 'Ще одна',
          question: 'C’est carrément génial, ce truc !',
          options: ['Ця штука просто чудова!', 'Це квадратний геній'],
          answer: 0,
          words: ['carrement', 'le_truc'],
        },
        {
          id: 'm24l3e5',
          kind: 'mcq',
          prompt: 'Реалістична ціль',
          question: 'Скільки зазвичай розуміє людина рівня B2 у фільмі?',
          options: ['100 %', '70–80 %', '30 %'],
          answer: 1,
        },
        {
          id: 'm24l3e6',
          kind: 'listen',
          prompt: 'Швидка репліка — що почув?',
          audioText: 'Du coup, on se voit demain, en gros vers midi.',
          options: ['Отже, побачимось завтра, десь опівдні', 'Ми бачилися вчора вранці'],
          answer: 0,
          words: ['du_coup', 'en_gros'],
        },
        {
          id: 'm24l3e7',
          kind: 'speak',
          prompt: 'Скажи розмовною французькою',
          text: 'Du coup, on se voit demain ?',
          translation: 'То що, побачимось завтра?',
        },
        {
          id: 'm24l3e8',
          kind: 'dictation',
          prompt: 'Запиши повною формою',
          text: 'Je ne sais pas ce qu’il veut dire.',
          translation: 'Я не знаю, що він хоче сказати.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm24q1',
      kind: 'mcq',
      prompt: 'Passé simple',
      question: 'Il fit un geste.',
      options: ['Il a fait un geste', 'Il faisait un geste'],
      answer: 0,
      optionsAreFrench: true,
    },
    {
      id: 'm24q2',
      kind: 'mcq',
      prompt: 'Де вживається passé simple?',
      question: 'Passé simple зустрічається…',
      options: ['у розмові', 'у літературі й казках'],
      answer: 1,
    },
    {
      id: 'm24q3',
      kind: 'mcq',
      prompt: 'Новини',
      question: 'Le bilan s’élèverait à dix blessés.',
      options: ['Поранених рівно десять', 'За наявними даними, поранених десятеро'],
      answer: 1,
    },
    {
      id: 'm24q4',
      kind: 'cloze',
      prompt: 'Медійний зворот',
      sentence: 'Cette mesure ___ ___ ___ ___ nombreuses critiques.',
      answer: ['fait l’objet de', "fait l'objet de"],
      translation: 'Цей захід є предметом численної критики.',
    },
    {
      id: 'm24q5',
      kind: 'mcq',
      prompt: 'Стратегія',
      question: 'Найкорисніші субтитри для тренування слуху —',
      options: ['українські', 'французькі'],
      answer: 1,
    },
    {
      id: 'm24q6',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Унаслідок страйку потяги скасували.',
      answer: [
        'à la suite de la grève, les trains ont été annulés',
        'a la suite de la grève, les trains ont été annulés',
      ],
    },
    {
      id: 'm24q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Elle ouvrit la porte et entra.',
      translation: 'Вона відчинила двері й увійшла.',
    },
    {
      id: 'm24q8',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'il fut', uk: 'il a été' },
        { fr: 'il vint', uk: 'il est venu' },
        { fr: 'du coup', uk: 'отже (розм.)' },
        { fr: 'en gros', uk: 'загалом' },
      ],
    },
  ],
}
