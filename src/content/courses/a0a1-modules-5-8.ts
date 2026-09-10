import type { Module } from '../types'

/* ================================================================== *
 * Модуль 5 — Родина і дім
 * ================================================================== */
export const module5: Module = {
  id: 'm5',
  title: 'Родина і дім',
  subtitle: 'Близькі люди та де ти живеш',
  grammarFocus: 'Присвійні прикметники mon/ma/mes та конструкція il y a',
  emoji: '🏠',
  lessons: [
    {
      id: 'm5l1',
      title: 'Моя родина',
      subtitle: 'Хто є хто',
      minutes: 12,
      newWords: [
        'la_famille',
        'la_mere',
        'le_pere',
        'les_parents',
        'le_frere',
        'la_soeur',
        'le_fils',
        'la_fille',
        'lenfant',
        'la_grand_mere',
        'le_grand_pere',
        'le_mari',
        'la_femme',
      ],
      steps: [
        {
          kind: 'vocab',
          title: 'Родина',
          words: [
            'la_famille',
            'la_mere',
            'le_pere',
            'les_parents',
            'le_frere',
            'la_soeur',
            'le_fils',
            'la_fille',
            'lenfant',
          ],
        },
        {
          kind: 'grammar',
          title: 'Три слова, які читаються не так, як пишуться',
          body: `Французька любить винятки саме в найчастіших словах — бо вони «зношуються» від уживання.

• **le fils** (син) — читається [фіс]. L зникає повністю. Не плутай із *le fil* (нитка).
• **la femme** (жінка) — читається [фам], а не [фем]. Єдине слово, де -emme звучить як [am].
• **la fille** (дочка) — [фій], тут -ill- дає звук [j], як українське «й».`,
          examples: [
            { fr: 'Mon fils a dix ans.', uk: 'Моєму синові десять років.' },
            { fr: 'Ma femme est médecin.', uk: 'Моя дружина — лікарка.' },
            { fr: 'Leur fille est étudiante.', uk: 'Їхня дочка — студентка.' },
          ],
          warning: 'la fille означає і «дочка», і «дівчина» — розрізняє контекст.',
        },
        {
          kind: 'dialogue',
          title: 'Розповідь про родину',
          setting: 'Двоє колег на обідній перерві',
          lines: [
            { speaker: 'Marc', fr: 'Tu as des frères et sœurs ?', uk: 'У тебе є брати й сестри?' },
            {
              speaker: 'Maryna',
              fr: "Oui, j'ai un frère et une sœur.",
              uk: 'Так, у мене брат і сестра.',
            },
            { speaker: 'Marc', fr: 'Ils habitent en Ukraine ?', uk: 'Вони живуть в Україні?' },
            {
              speaker: 'Maryna',
              fr: 'Ma sœur, oui. Mon frère habite à Berlin.',
              uk: 'Сестра — так. Брат живе в Берліні.',
            },
            { speaker: 'Marc', fr: 'Et tes parents ?', uk: 'А твої батьки?' },
            {
              speaker: 'Maryna',
              fr: 'Mes parents sont à Lviv. Ma mère est professeure.',
              uk: 'Мої батьки у Львові. Мама — викладачка.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm5l1e1',
          kind: 'match',
          prompt: 'З’єднай пари',
          pairs: [
            { fr: 'la mère', uk: 'мати' },
            { fr: 'le frère', uk: 'брат' },
            { fr: 'la sœur', uk: 'сестра' },
            { fr: 'le fils', uk: 'син' },
          ],
          words: ['la_mere', 'le_frere', 'la_soeur', 'le_fils'],
        },
        {
          id: 'm5l1e2',
          kind: 'mcq',
          prompt: 'Як читається «le fils»?',
          question: 'le fils',
          speak: 'le fils',
          options: ['[лё фільс]', '[лё фіс] — L німа', '[лё філь]'],
          answer: 1,
          explain: 'Виняток: у fils літера L не вимовляється. Звучить [фіс].',
          words: ['le_fils'],
        },
        {
          id: 'm5l1e3',
          kind: 'type',
          prompt: 'Напиши з артиклем: «сестра»',
          question: 'сестра (з артиклем)',
          answer: ['la sœur', 'la soeur'],
          accents: true,
          words: ['la_soeur'],
        },
        {
          id: 'm5l1e4',
          kind: 'listen',
          prompt: 'Що ти чуєш?',
          audioText: 'Ma femme est ukrainienne.',
          options: ['Моя дружина українка', 'Моя дочка українка', 'Моя мати українка'],
          answer: 0,
          words: ['la_femme'],
        },
        {
          id: 'm5l1e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'У мене є брат і сестра.',
          answer: ["j'ai un frère et une sœur", "j'ai un frere et une soeur"],
          hint: 'avoir + неозначені артиклі',
          words: ['avoir', 'le_frere', 'la_soeur'],
        },
        {
          id: 'm5l1e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Mes parents habitent à Lviv.',
          translation: 'Мої батьки живуть у Львові.',
          words: ['les_parents', 'habiter'],
        },
      ],
    },
    {
      id: 'm5l2',
      title: 'Мій, моя, мої',
      subtitle: 'Присвійні прикметники',
      minutes: 14,
      newWords: ['mon', 'ton', 'son'],
      steps: [
        {
          kind: 'grammar',
          title: 'Рід залежить від ПРЕДМЕТА, а не від власника',
          body: `Тут французька працює так само, як українська, — і це полегшення.

«**Моя** сестра» — «моя», бо *сестра* жіночого роду, а не тому що я жінка. Французькою так само: **ma** sœur.

> Форма присвійного = рід того, чим володіють`,
          table: {
            caption: 'Присвійні прикметники',
            head: ['Власник', 'ч. р.', 'ж. р.', 'множина', 'Українською'],
            rows: [
              ['я', 'mon', 'ma', 'mes', 'мій / моя / мої'],
              ['ти', 'ton', 'ta', 'tes', 'твій / твоя / твої'],
              ['він, вона', 'son', 'sa', 'ses', 'його / її'],
              ['ми', 'notre', 'notre', 'nos', 'наш / наші'],
              ['ви', 'votre', 'votre', 'vos', 'ваш / ваші'],
              ['вони', 'leur', 'leur', 'leurs', 'їхній / їхні'],
            ],
          },
          warning:
            '⚠️ Найбільша пастка: son livre = і «його книга», і «ЇЇ книга». Французька не показує стать власника — тільки рід предмета. Щоб уточнити, кажуть: le livre de Marie.',
        },
        {
          kind: 'grammar',
          title: 'Виняток заради милозвучності',
          body: `Перед жіночим словом, що починається з **голосної**, замість *ma* ставлять **mon** — бо «ma amie» важко вимовити.

*❌ ma amie → ✅ **mon** amie* (моя подруга)
*❌ ta école → ✅ **ton** école* (твоя школа)

Слово залишається жіночим! Змінюється лише форма артикля, заради зручності вимови.`,
          examples: [
            { fr: 'mon amie Sophie', uk: 'моя подруга Софі (вона жінка!)' },
            { fr: 'mon histoire', uk: 'моя історія' },
            { fr: 'ma sœur / mon frère', uk: 'моя сестра / мій брат' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm5l2e1',
          kind: 'cloze',
          prompt: 'Встав присвійний',
          sentence: '___ sœur est médecin.',
          answer: ['ma'],
          translation: 'Моя сестра — лікарка.',
          options: ['mon', 'ma', 'mes'],
          explain: 'sœur жіночого роду → ma.',
          words: ['mon', 'la_soeur'],
        },
        {
          id: 'm5l2e2',
          kind: 'cloze',
          prompt: 'Встав присвійний',
          sentence: '___ frère habite à Paris.',
          answer: ['mon'],
          translation: 'Мій брат живе в Парижі.',
          options: ['mon', 'ma', 'mes'],
          words: ['mon', 'le_frere'],
        },
        {
          id: 'm5l2e3',
          kind: 'cloze',
          prompt: 'Обережно — голосна!',
          sentence: '___ amie s’appelle Léa.',
          answer: ['mon'],
          translation: 'Мою подругу звати Леа.',
          options: ['mon', 'ma', 'mes'],
          explain:
            'amie — жіночий рід, але починається з голосної → mon amie. Заради милозвучності.',
          words: ['mon', 'un_ami'],
        },
        {
          id: 'm5l2e4',
          kind: 'mcq',
          prompt: 'Що означає «son livre»?',
          question: 'son livre',
          options: [
            'Тільки «його книга»',
            'Тільки «її книга»',
            'І «його», і «її» — залежить від контексту',
          ],
          answer: 2,
          explain: 'Французька показує рід ПРЕДМЕТА (livre — чол.), а не стать власника.',
          words: ['son'],
        },
        {
          id: 'm5l2e5',
          kind: 'cloze',
          prompt: 'Встав присвійний',
          sentence: '___ parents sont à Kyiv.',
          answer: ['mes'],
          translation: 'Мої батьки в Києві.',
          options: ['mon', 'ma', 'mes'],
          words: ['mon', 'les_parents'],
        },
        {
          id: 'm5l2e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Моя мати — вчителька.',
          answer: ['ma mère est professeure', 'ma mere est professeure', 'ma mère est professeur'],
          words: ['mon', 'la_mere'],
        },
        {
          id: 'm5l2e7',
          kind: 'wordbank',
          prompt: 'Збери речення',
          question: 'Твоя сестра і твій брат живуть у Львові.',
          answer: 'Ta sœur et ton frère habitent à Lviv.',
          distractors: ['ma', 'mon'],
          words: ['ton'],
        },
      ],
    },
    {
      id: 'm5l3',
      title: 'Мій дім',
      subtitle: 'Кімнати та конструкція il y a',
      minutes: 12,
      newWords: [
        'lappartement',
        'la_chambre',
        'la_cuisine',
        'la_salle_de_bains',
        'le_lit',
        'il_y_a',
        'grand',
        'petit',
        'beau',
        'nouveau',
      ],
      steps: [
        {
          kind: 'vocab',
          title: 'Дім',
          words: [
            'la_maison',
            'lappartement',
            'la_chambre',
            'la_cuisine',
            'la_salle_de_bains',
            'le_lit',
          ],
        },
        {
          kind: 'grammar',
          title: 'il y a — «є, знаходиться»',
          body: `Незмінна конструкція. Не змінюється ні за родом, ні за числом — це велике полегшення.

*Il y a **un** chat.* — Тут є кіт.
*Il y a **des** chats.* — Тут є коти.

Заперечення: **il n'y a pas de**
*Il n'y a pas de problème.* — Проблеми немає.

Питання: **Est-ce qu'il y a…?**
*Est-ce qu'il y a un supermarché près d'ici ?* — Тут поруч є супермаркет?`,
          warning:
            '«il» тут ні на кого не вказує — це порожнє «воно», як в українському «смеркає». Не перекладай його.',
        },
        {
          kind: 'grammar',
          title: 'Прикметник зазвичай ПІСЛЯ іменника',
          body: `Це протилежно українській звичці. Ми кажемо «червона машина», французи — «машина червона»:

*une voiture **rouge*** — червона машина
*un livre **intéressant*** — цікава книга

**Але** невелика група дуже частих прикметників стоїть перед іменником. Їх запам'ятовують за абревіатурою **BAGS**: **B**eauty, **A**ge, **G**oodness, **S**ize.

*une **belle** maison* — гарний дім
*un **petit** chat* — маленький кіт
*une **grande** ville* — велике місто`,
          table: {
            caption: 'Прикметники, що стоять ПЕРЕД іменником',
            head: ['Категорія', 'Приклади'],
            rows: [
              ['Краса', 'beau / belle, joli'],
              ['Вік', 'jeune, vieux, nouveau'],
              ['Оцінка', 'bon, mauvais'],
              ['Розмір', 'grand, petit, gros, long'],
            ],
          },
        },
      ],
      exercises: [
        {
          id: 'm5l3e1',
          kind: 'cloze',
          prompt: 'Встав конструкцію',
          sentence: '___ ___ ___ une cuisine et deux chambres.',
          answer: ['il y a'],
          translation: 'Тут є кухня і дві спальні.',
          hint: 'Три коротких слова',
          explain: 'il y a — незмінна конструкція «є».',
          words: ['il_y_a'],
        },
        {
          id: 'm5l3e2',
          kind: 'mcq',
          prompt: 'Де стоїть прикметник?',
          question: '«червона машина»',
          options: ['une rouge voiture', 'une voiture rouge'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Колір іде після іменника. Перед іменником стоять лише BAGS-прикметники.',
          words: ['la_voiture'],
        },
        {
          id: 'm5l3e3',
          kind: 'mcq',
          prompt: 'А тут?',
          question: '«великий дім»',
          options: ['une grande maison', 'une maison grande'],
          answer: 0,
          optionsAreFrench: true,
          explain: 'grand — прикметник розміру (BAGS) → перед іменником.',
          words: ['grand', 'la_maison'],
        },
        {
          id: 'm5l3e4',
          kind: 'cloze',
          prompt: 'Заперечення',
          sentence: "Il n'y a pas ___ problème.",
          answer: ['de'],
          translation: 'Проблеми немає.',
          options: ['un', 'de', 'le'],
          explain: 'Після заперечення неозначений артикль → de.',
          words: ['il_y_a'],
        },
        {
          id: 'm5l3e5',
          kind: 'match',
          prompt: 'З’єднай кімнати',
          pairs: [
            { fr: 'la cuisine', uk: 'кухня' },
            { fr: 'la chambre', uk: 'спальня' },
            { fr: 'la salle de bains', uk: 'ванна' },
            { fr: "l'appartement", uk: 'квартира' },
          ],
          words: ['la_cuisine', 'la_chambre', 'la_salle_de_bains', 'lappartement'],
        },
        {
          id: 'm5l3e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'У моїй квартирі є дві кімнати.',
          answer: [
            'dans mon appartement, il y a deux chambres',
            'dans mon appartement il y a deux chambres',
            'il y a deux chambres dans mon appartement',
          ],
          hint: 'dans + mon + appartement, il y a…',
          words: ['il_y_a', 'lappartement', 'la_chambre'],
        },
        {
          id: 'm5l3e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: "C'est une belle maison.",
          translation: 'Це гарний дім.',
          words: ['beau', 'la_maison'],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm5q1',
      kind: 'cloze',
      prompt: 'Встав присвійний',
      sentence: '___ école est grande.',
      answer: ['mon'],
      translation: 'Моя школа велика.',
      options: ['mon', 'ma', 'mes'],
    },
    {
      id: 'm5q2',
      kind: 'mcq',
      prompt: 'Як читається «la femme»?',
      question: 'la femme',
      speak: 'la femme',
      options: ['[ла фем]', '[ла фам]'],
      answer: 1,
    },
    {
      id: 'm5q3',
      kind: 'mcq',
      prompt: 'Обери правильний порядок',
      question: '«маленький кіт»',
      options: ['un chat petit', 'un petit chat'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm5q4',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Мій брат живе в Києві.',
      answer: ['mon frère habite à kyiv', 'mon frere habite a kyiv'],
    },
    {
      id: 'm5q5',
      kind: 'cloze',
      prompt: 'Встав',
      sentence: '___ ___ ___ un problème.',
      answer: ['il y a'],
      translation: 'Є проблема.',
      hint: 'Три слова',
    },
    {
      id: 'm5q6',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'mon', uk: 'мій (ч. р.)' },
        { fr: 'ma', uk: 'моя (ж. р.)' },
        { fr: 'mes', uk: 'мої (мн.)' },
        { fr: 'leur', uk: 'їхній' },
      ],
    },
    {
      id: 'm5q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Ma sœur a deux enfants.',
      translation: 'У моєї сестри двоє дітей.',
    },
    {
      id: 'm5q8',
      kind: 'wordbank',
      prompt: 'Збери речення',
      question: 'У квартирі є гарна кухня.',
      answer: "Dans l'appartement, il y a une belle cuisine.",
      distractors: ['beau', 'un'],
    },
  ],
}

/* ================================================================== *
 * Модуль 6 — Щоденне життя
 * ================================================================== */
export const module6: Module = {
  id: 'm6',
  title: 'Щоденне життя',
  subtitle: 'Дієслова, звички, запитання',
  grammarFocus: 'Дієслова на -ER у теперішньому часі та три способи ставити запитання',
  emoji: '☀️',
  lessons: [
    {
      id: 'm6l1',
      title: 'Дієслова на -ER',
      subtitle: 'Одна модель — 90 % усіх дієслів',
      minutes: 15,
      newWords: ['aimer', 'regarder', 'ecouter', 'travailler', 'toujours', 'souvent', 'beaucoup'],
      steps: [
        {
          kind: 'grammar',
          title: 'Найкраща новина курсу',
          body: `Близько **90 % французьких дієслів** закінчуються на **-er** і відмінюються однаково. Вивчиш одну модель — отримаєш тисячі дієслів.

Механіка проста: відкидаєш **-er** і додаєш закінчення.

**parler** (говорити) → корінь **parl-**`,
          table: {
            caption: 'parler — теперішній час',
            head: ['Особа', 'Форма', 'Вимова', 'Українською'],
            rows: [
              ['je', 'parle', '[paʁl]', 'я говорю'],
              ['tu', 'parles', '[paʁl]', 'ти говориш'],
              ['il / elle', 'parle', '[paʁl]', 'він говорить'],
              ['nous', 'parlons', '[paʁ.lɔ̃]', 'ми говоримо'],
              ['vous', 'parlez', '[paʁ.le]', 'ви говорите'],
              ['ils / elles', 'parlent', '[paʁl]', 'вони говорять'],
            ],
          },
          warning:
            '⚠️ Ключове: je parle, tu parles, il parle, ils parlent звучать ОДНАКОВО — [paʁl]. Чотири різні написання, один звук. Саме тому займенник обов’язковий: без нього незрозуміло, хто говорить.',
        },
        {
          kind: 'grammar',
          title: 'Одна форма — три українські значення',
          body: `Французький теперішній час ширший за український. Одна форма покриває три ситуації:

*Je travaille.* може означати:
• Я працюю (зараз, у цю мить)
• Я працюю (взагалі, маю роботу)
• Я попрацюю (найближчим часом)

Окремої форми «я є працюючим» (як англійське *I am working*) французька не має — і це спрощує життя.`,
          examples: [
            { fr: "J'écoute de la musique.", uk: 'Я слухаю музику.' },
            { fr: 'Elle regarde un film.', uk: 'Вона дивиться фільм.' },
            { fr: 'Nous travaillons beaucoup.', uk: 'Ми багато працюємо.' },
            { fr: 'Ils aiment le café.', uk: 'Вони люблять каву.' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm6l1e1',
          kind: 'cloze',
          prompt: 'Постав дієслово parler у правильну форму',
          sentence: 'Nous ___ français.',
          answer: ['parlons'],
          translation: 'Ми говоримо французькою.',
          options: ['parle', 'parles', 'parlons', 'parlez'],
          explain: 'nous → закінчення -ons. Це єдине закінчення, яке чути виразно.',
          words: ['parler'],
        },
        {
          id: 'm6l1e2',
          kind: 'cloze',
          prompt: 'Постав дієслово aimer',
          sentence: "J'___ le chocolat.",
          answer: ['aime'],
          translation: 'Я люблю шоколад.',
          options: ['aime', 'aimes', 'aimons', 'aiment'],
          words: ['aimer'],
        },
        {
          id: 'm6l1e3',
          kind: 'cloze',
          prompt: 'Постав дієслово travailler',
          sentence: 'Vous ___ où ?',
          answer: ['travaillez'],
          translation: 'Де ви працюєте?',
          options: ['travaille', 'travailles', 'travaillez', 'travaillent'],
          words: ['travailler'],
        },
        {
          id: 'm6l1e4',
          kind: 'mcq',
          prompt: 'Які форми звучать однаково?',
          question: 'parle / parles / parlons / parlent',
          speak: 'je parle, tu parles, ils parlent',
          options: ['Усі чотири', 'parle, parles, parlent — так; parlons — ні', 'Жодні'],
          answer: 1,
          explain:
            'Німі закінчення -e, -es, -ent дають один звук [paʁl]. А -ons чути виразно: [paʁ.lɔ̃].',
          words: ['parler'],
        },
        {
          id: 'm6l1e5',
          kind: 'type',
          prompt: 'Постав écouter у форму для «ils»',
          question: 'ils (écouter) →',
          answer: ['écoutent', 'ecoutent'],
          accents: true,
          explain: 'ils écoutent. Закінчення -ent німе — на слух як «екут».',
          words: ['ecouter'],
        },
        {
          id: 'm6l1e6',
          kind: 'dictation',
          prompt: 'Запиши почуте (увага на закінчення!)',
          text: 'Ils regardent la télévision.',
          translation: 'Вони дивляться телевізор.',
          explain: 'На слух «regarde» і «regardent» однакові — розрізняє лише займенник ils.',
          words: ['regarder'],
        },
        {
          id: 'm6l1e7',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Ми багато працюємо.',
          answer: ['nous travaillons beaucoup', 'on travaille beaucoup'],
          words: ['travailler', 'beaucoup'],
        },
      ],
    },
    {
      id: 'm6l2',
      title: 'Як поставити запитання',
      subtitle: 'Три способи — від найпростішого',
      minutes: 14,
      newWords: ['est_ce_que', 'pourquoi', 'quand', 'ou', 'comment', 'parce_que'],
      steps: [
        {
          kind: 'grammar',
          title: 'Три регістри одного питання',
          body: `Французька дає три способи спитати те саме. Різниця — у формальності.

**1. Інтонацією** (розмовний). Просто підвищуєш тон у кінці:
*Tu parles français ?*

**2. Est-ce que** (нейтральний, найбезпечніший). Додаєш конструкцію на початок:
*Est-ce que tu parles français ?*

**3. Інверсія** (формальний, письмовий). Міняєш дієслово й займенник місцями через дефіс:
*Parles-tu français ?*

**Порада:** вивчи спершу **est-ce que**. Він доречний завжди й ніколи не звучить дивно.`,
          table: {
            caption: 'Одне питання — три форми',
            head: ['Спосіб', 'Приклад', 'Де доречно'],
            rows: [
              ['Інтонація', 'Vous avez l’heure ?', 'Розмова, друзі'],
              ['Est-ce que', 'Est-ce que vous avez l’heure ?', 'Скрізь'],
              ['Інверсія', 'Avez-vous l’heure ?', 'Формально, на письмі'],
            ],
          },
          warning:
            'est-ce que українською не перекладається — це чиста граматична обгортка. Дослівно «чи є це, що…».',
        },
        {
          kind: 'grammar',
          title: 'Питальні слова',
          body: `Ставляться на початок, а далі — будь-який із трьох способів.`,
          table: {
            caption: 'Основні питальні слова',
            head: ['Слово', 'Українською', 'Приклад'],
            rows: [
              ['où', 'де, куди', 'Où est-ce que tu habites ?'],
              ['quand', 'коли', 'Quand est-ce que tu arrives ?'],
              ['comment', 'як', 'Comment ça va ?'],
              ['pourquoi', 'чому', 'Pourquoi est-ce que tu pleures ?'],
              ['combien', 'скільки', 'Combien ça coûte ?'],
              ['qui', 'хто', 'Qui est-ce ?'],
              ['quoi / que', 'що', "Qu'est-ce que c'est ?"],
            ],
          },
          warning:
            '⚠️ où (де) пишеться з наголосом, ou (або) — без. На письмі це різні слова, на слух однакові.',
        },
      ],
      exercises: [
        {
          id: 'm6l2e1',
          kind: 'cloze',
          prompt: 'Зроби питання нейтральним',
          sentence: '___-___ ___ tu parles anglais ?',
          answer: ['est-ce que', 'est ce que'],
          translation: 'Ти говориш англійською?',
          hint: 'Три частини через дефіси',
          explain: 'Est-ce que — універсальна питальна конструкція.',
          words: ['est_ce_que'],
        },
        {
          id: 'm6l2e2',
          kind: 'mcq',
          prompt: 'Який спосіб найформальніший?',
          question: 'Оберіть найформальніший варіант',
          options: ['Tu viens ?', 'Est-ce que tu viens ?', 'Viens-tu ?'],
          answer: 2,
          optionsAreFrench: true,
          explain: 'Інверсія (Viens-tu ?) — найформальніша, властива письму й офіційній мові.',
        },
        {
          id: 'm6l2e3',
          kind: 'cloze',
          prompt: 'Встав питальне слово',
          sentence: '___ est-ce que tu habites ?',
          answer: ['où', 'ou'],
          translation: 'Де ти живеш?',
          options: ['où', 'quand', 'comment', 'pourquoi'],
          words: ['ou'],
        },
        {
          id: 'm6l2e4',
          kind: 'cloze',
          prompt: 'Встав питальне слово',
          sentence: '___ est-ce que tu apprends le français ?',
          answer: ['pourquoi'],
          translation: 'Чому ти вчиш французьку?',
          options: ['où', 'quand', 'pourquoi', 'qui'],
          words: ['pourquoi'],
        },
        {
          id: 'm6l2e5',
          kind: 'match',
          prompt: 'З’єднай питальні слова',
          pairs: [
            { fr: 'où', uk: 'де' },
            { fr: 'quand', uk: 'коли' },
            { fr: 'pourquoi', uk: 'чому' },
            { fr: 'combien', uk: 'скільки' },
          ],
          words: ['ou', 'quand', 'pourquoi'],
        },
        {
          id: 'm6l2e6',
          kind: 'translate',
          prompt: 'Переклади французькою (через est-ce que)',
          question: 'Де ти працюєш?',
          answer: ['où est-ce que tu travailles', 'ou est-ce que tu travailles'],
          words: ['ou', 'travailler'],
        },
        {
          id: 'm6l2e7',
          kind: 'wordbank',
          prompt: 'Збери питання',
          question: 'Чому ви вчите французьку?',
          answer: 'Pourquoi est-ce que vous apprenez le français ?',
          distractors: ['où', 'quand'],
          words: ['pourquoi'],
        },
        {
          id: 'm6l2e8',
          kind: 'speak',
          prompt: 'Постав питання вголос',
          text: 'Est-ce que vous parlez anglais ?',
          translation: 'Ви говорите англійською?',
          words: ['est_ce_que', 'parler'],
        },
      ],
    },
    {
      id: 'm6l3',
      title: 'Мій звичайний день',
      subtitle: 'Розпорядок і частота',
      minutes: 13,
      newWords: [
        'se_lever',
        'dormir',
        'manger',
        'le_matin',
        'lapres_midi',
        'le_soir',
        'jamais',
        'faire',
      ],
      steps: [
        {
          kind: 'grammar',
          title: 'Зворотні дієслова',
          body: `Дієслова з **se** описують дію, спрямовану на себе — як українське «-ся».

**se lever** (вставати, «підійматися сам») — *je **me** lève*
**s'appeler** (зватися) — *je **m'**appelle*
**se coucher** (лягати спати) — *je **me** couche*

Займенник змінюється разом з особою і стоїть **перед** дієсловом:`,
          table: {
            caption: 'se lever — вставати',
            head: ['Особа', 'Форма', 'Українською'],
            rows: [
              ['je', 'me lève', 'я встаю'],
              ['tu', 'te lèves', 'ти встаєш'],
              ['il / elle', 'se lève', 'він встає'],
              ['nous', 'nous levons', 'ми встаємо'],
              ['vous', 'vous levez', 'ви встаєте'],
              ['ils / elles', 'se lèvent', 'вони встають'],
            ],
          },
          warning:
            'На відміну від українського «-ся» в кінці, французьке me/te/se стоїть ПЕРЕД дієсловом.',
        },
        {
          kind: 'grammar',
          title: 'Як часто?',
          body: `Прислівники частоти зазвичай ідуть **після** дієслова — знову навпаки до української звички.

*Je bois **souvent** du café.* — Я часто п'ю каву.

**ne… jamais** (ніколи) працює як ne…pas — обіймає дієслово:
*Je **ne** fume **jamais**.* — Я ніколи не курю.`,
          examples: [
            { fr: 'Je me lève toujours à sept heures.', uk: 'Я завжди встаю о сьомій.' },
            { fr: 'Elle mange souvent au restaurant.', uk: 'Вона часто їсть у ресторані.' },
            { fr: 'Nous ne regardons jamais la télé.', uk: 'Ми ніколи не дивимось телевізор.' },
          ],
        },
        {
          kind: 'dialogue',
          title: 'Твій день',
          setting: 'Розмова на курсах французької',
          lines: [
            {
              speaker: 'Prof',
              fr: 'À quelle heure est-ce que vous vous levez ?',
              uk: 'О котрій ви встаєте?',
            },
            { speaker: 'Ти', fr: 'Je me lève à sept heures.', uk: 'Я встаю о сьомій.' },
            {
              speaker: 'Prof',
              fr: "Et qu'est-ce que vous faites le matin ?",
              uk: 'А що ви робите вранці?',
            },
            { speaker: 'Ти', fr: 'Je bois un café et je travaille.', uk: 'Я п’ю каву і працюю.' },
            { speaker: 'Prof', fr: 'Vous travaillez le week-end ?', uk: 'Ви працюєте у вихідні?' },
            {
              speaker: 'Ти',
              fr: 'Non, je ne travaille jamais le dimanche.',
              uk: 'Ні, я ніколи не працюю в неділю.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm6l3e1',
          kind: 'cloze',
          prompt: 'Встав зворотний займенник',
          sentence: 'Je ___ lève à six heures.',
          answer: ['me'],
          translation: 'Я встаю о шостій.',
          options: ['me', 'te', 'se', 'nous'],
          explain: 'je → me. Займенник стоїть перед дієсловом.',
          words: ['se_lever'],
        },
        {
          id: 'm6l3e2',
          kind: 'cloze',
          prompt: 'Встав зворотний займенник',
          sentence: 'Elle ___ couche tard.',
          answer: ['se'],
          translation: 'Вона пізно лягає.',
          options: ['me', 'te', 'se'],
          words: ['se_lever'],
        },
        {
          id: 'm6l3e3',
          kind: 'cloze',
          prompt: 'Встав другу частину заперечення',
          sentence: 'Je ne regarde ___ la télé.',
          answer: ['jamais'],
          translation: 'Я ніколи не дивлюсь телевізор.',
          options: ['pas', 'jamais', 'rien'],
          explain: 'ne… jamais = ніколи. Працює так само, як ne… pas.',
          words: ['jamais', 'regarder'],
        },
        {
          id: 'm6l3e4',
          kind: 'match',
          prompt: 'З’єднай частини доби',
          pairs: [
            { fr: 'le matin', uk: 'ранок' },
            { fr: "l'après-midi", uk: 'після обіду' },
            { fr: 'le soir', uk: 'вечір' },
            { fr: 'la nuit', uk: 'ніч' },
          ],
          words: ['le_matin', 'lapres_midi', 'le_soir'],
        },
        {
          id: 'm6l3e5',
          kind: 'listen',
          prompt: 'Що ти чуєш?',
          audioText: 'Je me lève à sept heures.',
          options: ['Я встаю о сьомій', 'Я лягаю о сьомій', 'Я працюю о сьомій'],
          answer: 0,
          words: ['se_lever'],
        },
        {
          id: 'm6l3e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Я ніколи не працюю в неділю.',
          answer: ['je ne travaille jamais le dimanche'],
          hint: 'ne… jamais + le dimanche (регулярно)',
          words: ['jamais', 'travailler', 'dimanche'],
        },
        {
          id: 'm6l3e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Le matin, je bois un café.',
          translation: 'Вранці я п’ю каву.',
          words: ['le_matin', 'le_cafe'],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm6q1',
      kind: 'cloze',
      prompt: 'Постав дієслово',
      sentence: 'Ils ___ la musique. (écouter)',
      answer: ['écoutent', 'ecoutent'],
      translation: 'Вони слухають музику.',
      options: ['écoute', 'écoutes', 'écoutez', 'écoutent'],
    },
    {
      id: 'm6q2',
      kind: 'mcq',
      prompt: 'Які форми звучать однаково?',
      question: 'aime / aimes / aiment',
      options: ['Усі три', 'Жодні', 'Тільки перші дві'],
      answer: 0,
    },
    {
      id: 'm6q3',
      kind: 'cloze',
      prompt: 'Встав питальну конструкцію',
      sentence: '___-___ ___ vous avez un stylo ?',
      answer: ['est-ce que', 'est ce que'],
      translation: 'У вас є ручка?',
    },
    {
      id: 'm6q4',
      kind: 'cloze',
      prompt: 'Зворотний займенник',
      sentence: 'Nous ___ levons tôt.',
      answer: ['nous'],
      translation: 'Ми встаємо рано.',
      options: ['me', 'se', 'nous', 'vous'],
    },
    {
      id: 'm6q5',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Чому ти не працюєш?',
      answer: ['pourquoi est-ce que tu ne travailles pas', 'pourquoi tu ne travailles pas'],
    },
    {
      id: 'm6q6',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Elle se lève très tôt.',
      translation: 'Вона встає дуже рано.',
    },
    {
      id: 'm6q7',
      kind: 'wordbank',
      prompt: 'Збери речення',
      question: 'Я ніколи не дивлюсь телевізор увечері.',
      answer: 'Je ne regarde jamais la télé le soir.',
      distractors: ['pas', 'matin'],
    },
    {
      id: 'm6q8',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'toujours', uk: 'завжди' },
        { fr: 'souvent', uk: 'часто' },
        { fr: 'jamais', uk: 'ніколи' },
        { fr: 'un peu', uk: 'трохи' },
      ],
    },
  ],
}

/* ================================================================== *
 * Модуль 7 — За столом
 * ================================================================== */
export const module7: Module = {
  id: 'm7',
  title: 'За столом',
  subtitle: 'Їжа, кафе, замовлення',
  grammarFocus: 'Частковий артикль du / de la / des',
  emoji: '🥐',
  lessons: [
    {
      id: 'm7l1',
      title: 'Їжа та напої',
      subtitle: 'Базовий словник',
      minutes: 12,
      newWords: [
        'le_pain',
        'le_fromage',
        'le_cafe',
        'le_the',
        'le_vin',
        'la_pomme',
        'le_poulet',
        'le_poisson',
        'la_viande',
        'les_legumes',
        'le_sucre',
        'le_lait',
      ],
      steps: [
        {
          kind: 'vocab',
          title: 'Основне',
          words: [
            'le_pain',
            'le_fromage',
            'le_cafe',
            'le_the',
            'le_vin',
            'la_pomme',
            'le_poulet',
            'le_poisson',
            'la_viande',
            'les_legumes',
          ],
        },
        {
          kind: 'grammar',
          title: 'Пастки роду в їжі',
          body: `Тут особливо багато розбіжностей з українською — а помилка в артиклі одразу помітна на слух.`,
          table: {
            caption: 'Уважно з цими словами',
            head: ['Французькою', 'Українською', 'Пастка'],
            rows: [
              ['la pomme', 'яблуко', 'жін. рід ↔ наш середній'],
              ['le poisson', 'риба', 'чол. рід ↔ наш жіночий'],
              ['la viande', 'м’ясо', 'жін. рід ↔ наш середній'],
              ['le lait', 'молоко', 'чол. рід ↔ наш середній'],
              ['l’eau', 'вода', 'жіночий, але артикль схований'],
            ],
          },
          warning:
            '⚠️ le poisson (риба) ≠ le poison (отрута). Різниця в одній літері «s». У ресторані це важливо.',
        },
      ],
      exercises: [
        {
          id: 'm7l1e1',
          kind: 'match',
          prompt: 'З’єднай',
          pairs: [
            { fr: 'le pain', uk: 'хліб' },
            { fr: 'le fromage', uk: 'сир' },
            { fr: 'la pomme', uk: 'яблуко' },
            { fr: 'le poisson', uk: 'риба' },
          ],
          words: ['le_pain', 'le_fromage', 'la_pomme', 'le_poisson'],
        },
        {
          id: 'm7l1e2',
          kind: 'cloze',
          prompt: 'Встав артикль',
          sentence: '___ pomme est rouge.',
          answer: ['la'],
          translation: 'Яблуко червоне.',
          options: ['le', 'la', "l'"],
          explain: '⚠️ pomme — жіночий рід, хоч «яблуко» в нас середній.',
          words: ['la_pomme'],
        },
        {
          id: 'm7l1e3',
          kind: 'mcq',
          prompt: 'Що ти замовляєш?',
          question: 'Je voudrais du poisson.',
          options: ['Рибу', 'Отруту', 'Курку'],
          answer: 0,
          explain: 'poisson = риба. poison (без s у вимові інакше) = отрута. Увага до написання!',
          words: ['le_poisson'],
        },
        {
          id: 'm7l1e4',
          kind: 'type',
          prompt: 'Напиши з артиклем: «хліб»',
          question: 'хліб (з артиклем)',
          answer: ['le pain'],
          accents: true,
          words: ['le_pain'],
        },
        {
          id: 'm7l1e5',
          kind: 'listen',
          prompt: 'Що ти чуєш?',
          audioText: 'du fromage et du vin',
          options: ['сир і вино', 'риба і вода', 'хліб і молоко'],
          answer: 0,
          words: ['le_fromage', 'le_vin'],
        },
        {
          id: 'm7l1e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Le fromage est délicieux.',
          translation: 'Сир смачний.',
          words: ['le_fromage', 'delicieux'],
        },
      ],
    },
    {
      id: 'm7l2',
      title: 'Частковий артикль',
      subtitle: 'du, de la — те, чого немає в українській',
      minutes: 15,
      newWords: ['du', 'manger', 'boire', 'avoir_faim', 'avoir_soif'],
      steps: [
        {
          kind: 'grammar',
          title: 'Артикль для «невідлічуваного»',
          body: `Ще одна річ, якої в українській немає взагалі.

Коли йдеться про **частину, невизначену кількість** чогось — хліба, води, музики — французька вимагає особливий артикль.

Ми кажемо просто «Я їм хліб». Французькою — «Я їм **трохи** хліба»:

> **du** (чол.) · **de la** (жін.) · **de l'** (перед голосною) · **des** (мн.)

*Je mange **du** pain.* — Я їм хліб.
*Je bois **de la** limonade.* — Я п'ю лимонад.
*Je bois **de l'**eau.* — Я п'ю воду.`,
          table: {
            caption: 'Три артиклі — три значення',
            head: ['Артикль', 'Приклад', 'Зміст'],
            rows: [
              ['le / la', "J'aime le café.", 'кава взагалі, як явище'],
              ['un / une', 'Je prends un café.', 'одна чашка кави'],
              ['du / de la', 'Je bois du café.', 'трохи кави, невизначено'],
            ],
          },
          warning:
            'Пропустити артикль не можна ніколи. «Je mange pain» — груба помилка, звучить як «я їм хліб» у значенні «я їм слово хліб».',
        },
        {
          kind: 'grammar',
          title: 'У запереченні — завжди de',
          body: `Правило без винятків, і воно рятує: у заперечному реченні **всі** du / de la / des / un / une перетворюються на просте **de**.

*Je mange du pain.* → *Je ne mange **pas de** pain.*
*J'ai une voiture.* → *Je n'ai **pas de** voiture.*
*Il y a des chaises.* → *Il n'y a **pas de** chaises.*

Перед голосною: **d'** — *pas d'eau, pas d'argent.*`,
          examples: [
            { fr: 'Je ne bois pas de café le soir.', uk: 'Я не п’ю каву ввечері.' },
            { fr: "Il n'y a pas d'eau.", uk: 'Води немає.' },
            { fr: '⚠️ Але з être правило НЕ діє:', uk: "Ce n'est pas un problème." },
          ],
        },
      ],
      exercises: [
        {
          id: 'm7l2e1',
          kind: 'cloze',
          prompt: 'Встав частковий артикль',
          sentence: 'Je mange ___ pain.',
          answer: ['du'],
          translation: 'Я їм хліб.',
          options: ['le', 'un', 'du', 'de la'],
          explain: 'pain — чоловічий рід, невизначена кількість → du.',
          words: ['du', 'le_pain', 'manger'],
        },
        {
          id: 'm7l2e2',
          kind: 'cloze',
          prompt: 'Встав частковий артикль',
          sentence: 'Elle boit ___ ___ limonade.',
          answer: ['de la'],
          translation: 'Вона п’є лимонад.',
          options: ['du', 'de la', "de l'", 'des'],
          explain: 'limonade — жіночий рід → de la.',
          words: ['du', 'boire'],
        },
        {
          id: 'm7l2e3',
          kind: 'cloze',
          prompt: 'Перед голосною',
          sentence: 'Je bois ___ ___ eau.',
          answer: ["de l'", 'de l’'],
          translation: 'Я п’ю воду.',
          options: ['du', 'de la', "de l'", 'des'],
          explain: "eau починається з голосної → de l'.",
          words: ['du', 'leau'],
        },
        {
          id: 'm7l2e4',
          kind: 'cloze',
          prompt: 'Заперечення!',
          sentence: 'Je ne mange pas ___ viande.',
          answer: ['de'],
          translation: 'Я не їм м’яса.',
          options: ['de la', 'de', 'du', 'une'],
          explain: 'У запереченні всі часткові артиклі → de. Без винятків.',
          words: ['la_viande'],
        },
        {
          id: 'm7l2e5',
          kind: 'mcq',
          prompt: 'У чому різниця?',
          question: '«J’aime le café» проти «Je bois du café»',
          options: [
            'Різниці немає',
            'le café — кава взагалі; du café — трохи кави зараз',
            'le café — гаряча, du café — холодна',
          ],
          answer: 1,
          explain: 'Означений артикль = поняття загалом. Частковий = невизначена кількість.',
          words: ['le_cafe'],
        },
        {
          id: 'm7l2e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Я не п’ю кави.',
          answer: ['je ne bois pas de café', 'je ne bois pas de cafe'],
          hint: 'У запереченні → de',
          words: ['boire', 'le_cafe'],
        },
        {
          id: 'm7l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: "J'ai faim, je voudrais du pain.",
          translation: 'Я голодний, хотів би хліба.',
          words: ['avoir_faim', 'du'],
        },
      ],
    },
    {
      id: 'm7l3',
      title: 'У кафе',
      subtitle: 'Замовити й попросити рахунок',
      minutes: 13,
      newWords: [
        'je_voudrais',
        'laddition',
        'la_carte',
        'le_restaurant',
        'delicieux',
        'le_petit_dejeuner',
        'le_dejeuner',
        'le_diner',
      ],
      steps: [
        {
          kind: 'grammar',
          title: 'Ввічливість = je voudrais',
          body: `**Je veux** («я хочу») звучить різко, майже як вимога — приблизно як українське «Дайте мені».

Ввічлива форма — **je voudrais** («я хотів би»). Це умовний спосіб, але зараз просто вивчи як готову фразу.

Ще ввічливіше — додати **s'il vous plaît** у кінець.

Формула замовлення:
> **Je voudrais** + un/une/du + страва + **s'il vous plaît**`,
          examples: [
            { fr: 'Je voudrais un café, s’il vous plaît.', uk: 'Я хотів би каву, будь ласка.' },
            { fr: 'Je vais prendre le menu du jour.', uk: 'Я візьму денне меню.' },
            { fr: "L'addition, s'il vous plaît !", uk: 'Рахунок, будь ласка!' },
            { fr: 'C’était délicieux, merci !', uk: 'Було смачно, дякую!' },
          ],
          warning:
            'У Франції рахунок ніколи не приносять самі — його треба попросити. Інакше сидітимеш годину.',
        },
        {
          kind: 'dialogue',
          title: 'Замовлення в кафе',
          setting: 'Обід у паризькій брасері',
          lines: [
            {
              speaker: 'Serveur',
              fr: 'Bonjour ! Vous avez choisi ?',
              uk: 'Добрий день! Ви обрали?',
            },
            {
              speaker: 'Клієнтка',
              fr: 'Oui, je voudrais le poulet, s’il vous plaît.',
              uk: 'Так, я хотіла б курку, будь ласка.',
            },
            { speaker: 'Serveur', fr: 'Et comme boisson ?', uk: 'А з напоїв?' },
            {
              speaker: 'Клієнтка',
              fr: 'De l’eau, s’il vous plaît. Une carafe.',
              uk: 'Води, будь ласка. Карафу.',
            },
            { speaker: 'Serveur', fr: 'Très bien. Un dessert ?', uk: 'Дуже добре. Десерт?' },
            {
              speaker: 'Клієнтка',
              fr: 'Non merci. L’addition, s’il vous plaît.',
              uk: 'Ні, дякую. Рахунок, будь ласка.',
            },
            { speaker: 'Serveur', fr: 'Tout de suite !', uk: 'Зараз же!' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm7l3e1',
          kind: 'mcq',
          prompt: 'Як ввічливо замовити?',
          question: 'Ти в кафе, хочеш каву',
          options: ['Je veux un café.', 'Je voudrais un café, s’il vous plaît.', 'Donne un café.'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'je voudrais — ввічливо. je veux звучить як вимога.',
          words: ['je_voudrais', 'le_cafe'],
        },
        {
          id: 'm7l3e2',
          kind: 'type',
          prompt: 'Попроси рахунок (2 слова + ввічливість не треба)',
          question: 'рахунок (з артиклем)',
          answer: ["l'addition", 'laddition', 'l’addition'],
          accents: true,
          words: ['laddition'],
        },
        {
          id: 'm7l3e3',
          kind: 'cloze',
          prompt: 'Встав артикль',
          sentence: 'Je voudrais ___ ___ eau, s’il vous plaît.',
          answer: ["de l'", 'de l’'],
          translation: 'Я хотів би води, будь ласка.',
          options: ['du', 'de la', "de l'"],
          words: ['je_voudrais', 'leau'],
        },
        {
          id: 'm7l3e4',
          kind: 'listen',
          prompt: 'Що каже офіціант?',
          audioText: 'Et comme boisson ?',
          options: ['А з напоїв?', 'Скільки коштує?', 'Ви обрали?'],
          answer: 0,
        },
        {
          id: 'm7l3e5',
          kind: 'wordbank',
          prompt: 'Збери замовлення',
          question: 'Я хотіла б курку, будь ласка.',
          answer: 'Je voudrais le poulet, s’il vous plaît.',
          distractors: ['veux', 'la'],
          words: ['je_voudrais', 'le_poulet'],
        },
        {
          id: 'm7l3e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Рахунок, будь ласка!',
          answer: [
            "l'addition, s'il vous plaît",
            'laddition sil vous plait',
            "l'addition s'il vous plaît",
          ],
          words: ['laddition', 'sil_vous_plait'],
        },
        {
          id: 'm7l3e7',
          kind: 'speak',
          prompt: 'Зроби замовлення вголос',
          text: 'Je voudrais un café, s’il vous plaît.',
          translation: 'Я хотів би каву, будь ласка.',
          words: ['je_voudrais'],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm7q1',
      kind: 'cloze',
      prompt: 'Частковий артикль',
      sentence: 'Je mange ___ fromage.',
      answer: ['du'],
      translation: 'Я їм сир.',
      options: ['le', 'du', 'de la', 'un'],
    },
    {
      id: 'm7q2',
      kind: 'cloze',
      prompt: 'Заперечення',
      sentence: 'Il ne boit pas ___ vin.',
      answer: ['de'],
      translation: 'Він не п’є вина.',
      options: ['du', 'de', 'le'],
    },
    {
      id: 'm7q3',
      kind: 'mcq',
      prompt: 'Ввічливе замовлення',
      question: 'Оберіть найввічливіший варіант',
      options: ['Je veux le poisson.', 'Le poisson !', 'Je voudrais le poisson, s’il vous plaît.'],
      answer: 2,
      optionsAreFrench: true,
    },
    {
      id: 'm7q4',
      kind: 'type',
      prompt: 'Напиши з артиклем: «яблуко»',
      question: 'яблуко (з артиклем)',
      answer: ['la pomme'],
      accents: true,
    },
    {
      id: 'm7q5',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Я не їм м’яса.',
      answer: ['je ne mange pas de viande'],
    },
    {
      id: 'm7q6',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: "L'addition, s'il vous plaît.",
      translation: 'Рахунок, будь ласка.',
    },
    {
      id: 'm7q7',
      kind: 'match',
      prompt: 'З’єднай прийоми їжі',
      pairs: [
        { fr: 'le petit-déjeuner', uk: 'сніданок' },
        { fr: 'le déjeuner', uk: 'обід' },
        { fr: 'le dîner', uk: 'вечеря' },
        { fr: "l'addition", uk: 'рахунок' },
      ],
    },
    {
      id: 'm7q8',
      kind: 'wordbank',
      prompt: 'Збери речення',
      question: 'Я хотів би води, будь ласка.',
      answer: 'Je voudrais de l’eau, s’il vous plaît.',
      distractors: ['du', 'veux'],
    },
  ],
}

/* ================================================================== *
 * Модуль 8 — Місто й напрямки
 * ================================================================== */
export const module8: Module = {
  id: 'm8',
  title: 'Місто й напрямки',
  subtitle: 'Орієнтуватися та питати дорогу',
  grammarFocus: 'Дієслово aller, злиття à + le = au, найближче майбутнє',
  emoji: '🗺️',
  lessons: [
    {
      id: 'm8l1',
      title: 'Місця в місті',
      subtitle: 'Куди ми ходимо',
      minutes: 12,
      newWords: [
        'la_gare',
        'la_boulangerie',
        'le_magasin',
        'la_pharmacie',
        'lhopital',
        'le_musee',
        'le_parc',
        'la_place',
        'le_metro',
        'le_bus',
        'le_train',
      ],
      steps: [
        {
          kind: 'vocab',
          title: 'Міські місця',
          words: [
            'la_gare',
            'la_boulangerie',
            'le_magasin',
            'la_pharmacie',
            'lhopital',
            'le_musee',
            'le_parc',
            'la_place',
          ],
        },
        {
          kind: 'grammar',
          title: 'aller — йти, їхати',
          body: `Ще одне неправильне дієслово, яке доведеться знати напам’ять. Воно потрібне і для руху, і для майбутнього часу.`,
          table: {
            caption: 'aller у теперішньому часі',
            head: ['Особа', 'Форма', 'Українською'],
            rows: [
              ['je', 'vais', 'я йду / їду'],
              ['tu', 'vas', 'ти йдеш'],
              ['il / elle', 'va', 'він іде'],
              ['nous', 'allons', 'ми йдемо'],
              ['vous', 'allez', 'ви йдете'],
              ['ils / elles', 'vont', 'вони йдуть'],
            ],
          },
          warning:
            'Попри закінчення -er, aller НЕ відмінюється за звичайною моделлю. Це виняток, який трапляється щодня.',
        },
        {
          kind: 'grammar',
          title: 'à + le = au (обов’язкове злиття)',
          body: `Прийменник **à** (до, в) зливається з означеним артиклем. Написати «à le» — помилка, така форма просто не існує.`,
          table: {
            caption: 'Злиття артиклів',
            head: ['Формула', 'Результат', 'Приклад'],
            rows: [
              ['à + le', 'au', 'Je vais au parc.'],
              ['à + la', 'à la (без змін)', 'Je vais à la gare.'],
              ["à + l'", "à l' (без змін)", "Je vais à l'hôpital."],
              ['à + les', 'aux', 'Je vais aux toilettes.'],
            ],
          },
          warning: 'Те саме робить прийменник de: de + le = du, de + les = des.',
        },
      ],
      exercises: [
        {
          id: 'm8l1e1',
          kind: 'cloze',
          prompt: 'Встав форму aller',
          sentence: 'Je ___ à la gare.',
          answer: ['vais'],
          translation: 'Я йду на вокзал.',
          options: ['vais', 'vas', 'va', 'allons'],
          words: ['aller', 'la_gare'],
        },
        {
          id: 'm8l1e2',
          kind: 'cloze',
          prompt: 'Злиття артикля!',
          sentence: 'Nous allons ___ parc.',
          answer: ['au'],
          translation: 'Ми йдемо в парк.',
          options: ['à le', 'au', 'à la', 'aux'],
          explain: 'à + le = au. Форми «à le» не існує.',
          words: ['au', 'le_parc'],
        },
        {
          id: 'm8l1e3',
          kind: 'cloze',
          prompt: 'А тут?',
          sentence: 'Elle va ___ ___ pharmacie.',
          answer: ['à la'],
          translation: 'Вона йде в аптеку.',
          options: ['au', 'à la', 'aux'],
          explain: 'pharmacie — жіночий рід, à la не зливається.',
          words: ['la_pharmacie'],
        },
        {
          id: 'm8l1e4',
          kind: 'match',
          prompt: 'З’єднай місця',
          pairs: [
            { fr: 'la gare', uk: 'вокзал' },
            { fr: 'la boulangerie', uk: 'пекарня' },
            { fr: 'la pharmacie', uk: 'аптека' },
            { fr: 'le musée', uk: 'музей' },
          ],
          words: ['la_gare', 'la_boulangerie', 'la_pharmacie', 'le_musee'],
        },
        {
          id: 'm8l1e5',
          kind: 'listen',
          prompt: 'Куди він іде?',
          audioText: 'Il va au musée.',
          options: ['У музей', 'На вокзал', 'В аптеку'],
          answer: 0,
          words: ['le_musee'],
        },
        {
          id: 'm8l1e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Ми їдемо на вокзал.',
          answer: ['nous allons à la gare', 'on va à la gare'],
          words: ['aller', 'la_gare'],
        },
        {
          id: 'm8l1e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Je vais au supermarché.',
          translation: 'Я йду в супермаркет.',
        },
      ],
    },
    {
      id: 'm8l2',
      title: 'Найближче майбутнє',
      subtitle: 'aller + інфінітив',
      minutes: 12,
      newWords: ['prendre', 'vouloir', 'pouvoir'],
      steps: [
        {
          kind: 'grammar',
          title: 'Майбутнє без нового часу',
          body: `Щоб сказати про найближче майбутнє, окремий час учити не треба. Достатньо:

> **aller** (у теперішньому) + **інфінітив**

*Je **vais manger**.* — Я зараз їстиму / Я збираюся поїсти.
*Nous **allons partir**.* — Ми зараз підемо.

Це майже дослівно збігається з українським «я **йду** їсти» або «я **збираюся** поїсти» — тож конструкція інтуїтивна.

У розмовній мові французи вживають її частіше, ніж «справжній» майбутній час.`,
          table: {
            caption: 'Теперішнє → найближче майбутнє',
            head: ['Теперішнє', 'Майбутнє', 'Українською'],
            rows: [
              ['Je mange.', 'Je vais manger.', 'Я поїм.'],
              ['Tu travailles.', 'Tu vas travailler.', 'Ти працюватимеш.'],
              ['Il part.', 'Il va partir.', 'Він піде.'],
              ['Nous regardons.', 'Nous allons regarder.', 'Ми подивимось.'],
            ],
          },
          warning:
            'Заперечення обіймає лише aller, а не інфінітив: Je ne vais pas manger. (не «Je vais ne pas manger»)',
        },
      ],
      exercises: [
        {
          id: 'm8l2e1',
          kind: 'cloze',
          prompt: 'Встав допоміжне дієслово',
          sentence: 'Je ___ manger au restaurant.',
          answer: ['vais'],
          translation: 'Я збираюся поїсти в ресторані.',
          options: ['vais', 'suis', 'ai'],
          explain: 'Найближче майбутнє = aller + інфінітив.',
          words: ['aller', 'manger'],
        },
        {
          id: 'm8l2e2',
          kind: 'type',
          prompt: 'Переклади в найближче майбутнє: «Nous partons.»',
          question: 'Nous partons. → (майбутнє)',
          answer: ['nous allons partir'],
          accents: true,
          words: ['aller'],
        },
        {
          id: 'm8l2e3',
          kind: 'mcq',
          prompt: 'Де ставиться заперечення?',
          question: '«Я не буду їсти»',
          options: ['Je vais ne pas manger.', 'Je ne vais pas manger.', 'Je ne mange pas aller.'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'ne…pas обіймає ЛИШЕ aller. Інфінітив залишається без змін.',
          words: ['aller', 'manger'],
        },
        {
          id: 'm8l2e4',
          kind: 'cloze',
          prompt: 'Встав форму aller',
          sentence: 'Ils ___ prendre le train.',
          answer: ['vont'],
          translation: 'Вони поїдуть потягом.',
          options: ['va', 'vont', 'allons', 'allez'],
          words: ['aller', 'prendre', 'le_train'],
        },
        {
          id: 'm8l2e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Я візьму метро.',
          answer: ['je vais prendre le métro', 'je prends le métro', 'je vais prendre le metro'],
          hint: 'prendre + транспорт',
          words: ['prendre', 'le_metro'],
        },
        {
          id: 'm8l2e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Nous allons visiter le musée.',
          translation: 'Ми відвідаємо музей.',
          words: ['aller', 'le_musee'],
        },
      ],
    },
    {
      id: 'm8l3',
      title: 'Як пройти?',
      subtitle: 'Питати й розуміти напрямок',
      minutes: 13,
      newWords: [
        'a_gauche',
        'a_droite',
        'tout_droit',
        'a_cote_de',
        'en_face_de',
        'pres_de',
        'loin_de',
        'tourner',
        'ou_est',
        'dans',
        'sur',
        'sous',
        'entre',
      ],
      steps: [
        {
          kind: 'vocab',
          title: 'Напрямки та розташування',
          words: [
            'a_gauche',
            'a_droite',
            'tout_droit',
            'a_cote_de',
            'en_face_de',
            'pres_de',
            'loin_de',
            'dans',
            'sur',
            'sous',
            'entre',
          ],
        },
        {
          kind: 'grammar',
          title: 'Головна пастка: droite чи droit',
          body: `Два дуже схожі вирази, які означають зовсім різне:

• **à droite** [a dʁwat] — **праворуч**
• **tout droit** [tu dʁwa] — **прямо**

Різниця на слух — кінцевий звук [t]. Переплутати їх — і ти підеш зовсім не туди.

Корисні фрази:
*Excusez-moi, où est la gare ?* — Перепрошую, де вокзал?
*C'est loin ?* — Це далеко?
*Tournez à gauche.* — Поверніть ліворуч.
*Continuez tout droit.* — Ідіть прямо.`,
          examples: [
            { fr: 'La pharmacie est à côté de la boulangerie.', uk: 'Аптека поруч із пекарнею.' },
            { fr: "Le musée est en face de l'hôtel.", uk: 'Музей навпроти готелю.' },
            { fr: "C'est tout près d'ici.", uk: 'Це зовсім поруч.' },
          ],
          warning:
            'Прийменники à côté DE, en face DE, près DE завжди тягнуть за собою de — і воно зливається: de + le = du.',
        },
        {
          kind: 'dialogue',
          title: 'На вулиці',
          setting: 'Ти загубився в Ліоні',
          lines: [
            {
              speaker: 'Ти',
              fr: 'Excusez-moi, madame. Où est la gare, s’il vous plaît ?',
              uk: 'Перепрошую, пані. Де вокзал, будь ласка?',
            },
            {
              speaker: 'Passante',
              fr: 'Continuez tout droit, puis tournez à gauche.',
              uk: 'Ідіть прямо, потім поверніть ліворуч.',
            },
            { speaker: 'Ти', fr: "C'est loin ?", uk: 'Це далеко?' },
            {
              speaker: 'Passante',
              fr: 'Non, c’est à cinq minutes à pied.',
              uk: 'Ні, це за п’ять хвилин пішки.',
            },
            { speaker: 'Ти', fr: 'Merci beaucoup !', uk: 'Дуже дякую!' },
            {
              speaker: 'Passante',
              fr: 'Je vous en prie. Bonne journée !',
              uk: 'Прошу. Гарного дня!',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm8l3e1',
          kind: 'mcq',
          prompt: 'Тобі кажуть «tout droit». Куди йти?',
          question: 'Continuez tout droit.',
          speak: 'Continuez tout droit.',
          options: ['Праворуч', 'Прямо', 'Ліворуч'],
          answer: 1,
          explain: '⚠️ tout droit = прямо. à droite = праворуч. Різниця в кінцевому [t].',
          words: ['tout_droit'],
        },
        {
          id: 'm8l3e2',
          kind: 'mcq',
          prompt: 'А тепер «à droite»?',
          question: 'Tournez à droite.',
          speak: 'Tournez à droite.',
          options: ['Праворуч', 'Прямо', 'Назад'],
          answer: 0,
          words: ['a_droite'],
        },
        {
          id: 'm8l3e3',
          kind: 'cloze',
          prompt: 'Встав прийменник',
          sentence: 'La pharmacie est ___ ___ ___ la gare.',
          answer: ['à côté de', 'a cote de'],
          translation: 'Аптека поруч із вокзалом.',
          hint: 'Три слова',
          words: ['a_cote_de'],
        },
        {
          id: 'm8l3e4',
          kind: 'match',
          prompt: 'З’єднай напрямки',
          pairs: [
            { fr: 'à gauche', uk: 'ліворуч' },
            { fr: 'à droite', uk: 'праворуч' },
            { fr: 'tout droit', uk: 'прямо' },
            { fr: 'en face de', uk: 'навпроти' },
          ],
          words: ['a_gauche', 'a_droite', 'tout_droit', 'en_face_de'],
        },
        {
          id: 'm8l3e5',
          kind: 'listen',
          prompt: 'Куди тебе направляють?',
          audioText: 'Tournez à gauche, puis continuez tout droit.',
          options: ['Ліворуч, потім прямо', 'Праворуч, потім ліворуч', 'Прямо, потім праворуч'],
          answer: 0,
          words: ['a_gauche', 'tout_droit'],
        },
        {
          id: 'm8l3e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Перепрошую, де вокзал?',
          answer: [
            'excusez-moi, où est la gare',
            'excusez moi où est la gare',
            'excusez-moi, où est la gare ?',
          ],
          words: ['excusez_moi', 'ou_est', 'la_gare'],
        },
        {
          id: 'm8l3e7',
          kind: 'speak',
          prompt: 'Спитай дорогу вголос',
          text: 'Excusez-moi, où est la gare, s’il vous plaît ?',
          translation: 'Перепрошую, де вокзал, будь ласка?',
          words: ['excusez_moi', 'ou_est'],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm8q1',
      kind: 'cloze',
      prompt: 'Злиття артикля',
      sentence: 'Je vais ___ cinéma.',
      answer: ['au'],
      translation: 'Я йду в кіно.',
      options: ['à le', 'au', 'à la', 'aux'],
    },
    {
      id: 'm8q2',
      kind: 'cloze',
      prompt: 'Форма aller',
      sentence: 'Vous ___ où ?',
      answer: ['allez'],
      translation: 'Куди ви йдете?',
      options: ['allez', 'allons', 'vont', 'vas'],
    },
    {
      id: 'm8q3',
      kind: 'mcq',
      prompt: 'Що означає «tout droit»?',
      question: 'tout droit',
      speak: 'tout droit',
      options: ['Праворуч', 'Прямо', 'Ліворуч'],
      answer: 1,
    },
    {
      id: 'm8q4',
      kind: 'type',
      prompt: 'Переклади в майбутнє: «Je mange.»',
      question: 'Je mange. → (найближче майбутнє)',
      answer: ['je vais manger'],
      accents: true,
    },
    {
      id: 'm8q5',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Аптека навпроти вокзалу.',
      answer: ['la pharmacie est en face de la gare'],
    },
    {
      id: 'm8q6',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Tournez à gauche après la place.',
      translation: 'Поверніть ліворуч після площі.',
    },
    {
      id: 'm8q7',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'dans', uk: 'у, всередині' },
        { fr: 'sur', uk: 'на' },
        { fr: 'sous', uk: 'під' },
        { fr: 'entre', uk: 'між' },
      ],
    },
    {
      id: 'm8q8',
      kind: 'wordbank',
      prompt: 'Збери речення',
      question: 'Ми збираємось відвідати музей.',
      answer: 'Nous allons visiter le musée.',
      distractors: ['sommes', 'avons'],
    },
  ],
}
