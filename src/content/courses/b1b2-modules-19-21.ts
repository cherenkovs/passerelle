import type { Module } from '../types'

/* ================================================================== *
 * Модуль 19 — Мова, яка звучить природно
 * ================================================================== */
export const module19: Module = {
  id: 'm19',
  title: 'Мова, яка звучить природно',
  subtitle: 'Регістри та справжнє мовлення',
  grammarFocus: 'Три регістри французької, редукція в мовленні, пом’якшення',
  emoji: '🗣️',
  lessons: [
    {
      id: 'm19l1',
      title: 'Три регістри',
      subtitle: 'Soutenu, courant, familier',
      minutes: 15,
      newWords: [
        'le_langage',
        'familier',
        'soutenu',
        'courant',
        'le_boulot',
        'bosser',
        'le_truc',
        'le_mec',
      ],
      steps: [
        {
          kind: 'intro',
          title: 'Чому підручникова французька видає іноземця',
          body: `На рівні B1 ти вже будуєш правильні речення. Проблема інша: вони звучать **як підручник**.

Французька значно суворіше за українську розділяє регістри. Одну й ту саму думку носій висловить трьома різними способами — і вибір не між «правильно» і «неправильно», а між **доречно** і **недоречно**.

> *Je n'ai pas compris.* (courant — нейтрально)
> *Je n'ai point saisi.* (soutenu — книжно, майже літературно)
> *J'ai rien pigé.* (familier — з друзями)

Помилка іноземця зазвичай не в граматиці, а в тому, що він каже книжну фразу друзям — або розмовну на співбесіді.`,
        },
        {
          kind: 'grammar',
          title: 'Те саме трьома регістрами',
          body: `**Soutenu** — література, офіційні промови, урочисті листи. Пасив, складні часи, книжна лексика.

**Courant** — те, чого вчать у підручнику. Робота, незнайомі люди, більшість ситуацій. **Твій стандарт за замовчуванням.**

**Familier** — друзі, родина, соцмережі. Скорочення, проковтнуте *ne*, розмовна лексика.`,
          table: {
            caption: 'Одне значення — три вирази',
            head: ['Familier', 'Courant', 'Soutenu'],
            rows: [
              ['le boulot', 'le travail', "l'emploi"],
              ['bosser', 'travailler', 'exercer une activité'],
              ['bouffer', 'manger', 'se restaurer'],
              ['le mec', "l'homme", 'le monsieur'],
              ['le truc', 'la chose', "l'objet"],
              ['ouais', 'oui', 'en effet'],
              ['vachement', 'très', 'extrêmement'],
              ['C’est nul.', "Ce n'est pas bien.", 'Cela laisse à désirer.'],
            ],
          },
          warning:
            '⚠️ Правило безпеки: **розумій усі три, вживай courant**. Розмовний регістр краще засвоювати пасивно, поки не з’явиться відчуття — недоречне «bouffer» на роботі ріже вухо сильніше, ніж граматична помилка.',
        },
        {
          kind: 'dialogue',
          title: 'Одна ситуація, два регістри',
          setting: 'Спершу з другом, потім із керівником — про ту саму втому',
          lines: [
            {
              speaker: 'Другові',
              fr: 'Franchement, j’en peux plus. Ce boulot me tue.',
              uk: 'Чесно, я більше не можу. Ця робота мене вбиває.',
            },
            {
              speaker: 'Другові',
              fr: 'Ouais, j’ai vachement besoin de vacances.',
              uk: 'Ага, мені страшенно потрібна відпустка.',
            },
            {
              speaker: 'Керівникові',
              fr: 'Je me permets de vous parler de ma charge de travail.',
              uk: 'Дозволю собі поговорити про моє навантаження.',
            },
            {
              speaker: 'Керівникові',
              fr: 'J’aurais besoin de prendre quelques jours de congé.',
              uk: 'Мені було б потрібно взяти кілька днів відпустки.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm19l1e1',
          kind: 'mcq',
          prompt: 'Який регістр доречний на співбесіді?',
          question: 'Як сказати «робота» роботодавцю?',
          options: ['le boulot', 'le travail', 'le taf'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Courant — безпечний стандарт. «Boulot» і «taf» — розмовні.',
          words: ['le_boulot', 'le_travail'],
        },
        {
          id: 'm19l1e2',
          kind: 'match',
          prompt: 'З’єднай розмовне з нейтральним',
          pairs: [
            { fr: 'bosser', uk: 'travailler' },
            { fr: 'bouffer', uk: 'manger' },
            { fr: 'le mec', uk: "l'homme" },
            { fr: 'ouais', uk: 'oui' },
          ],
          words: ['bosser', 'bouffer', 'le_mec', 'ouais'],
        },
        {
          id: 'm19l1e3',
          kind: 'mcq',
          prompt: 'Де тут помилка регістру?',
          question: 'На діловій зустрічі: «Ce projet est vachement bien.»',
          options: ['Помилки немає', '«Vachement» — розмовне; краще «très» або «particulièrement»'],
          answer: 1,
          explain: 'Граматично бездоганно, але регістр не той. Саме так іноземці й видають себе.',
          words: ['vachement'],
        },
        {
          id: 'm19l1e4',
          kind: 'type',
          prompt: 'Нейтральний відповідник до «le truc»',
          question: 'le truc → (courant)',
          answer: ['la chose'],
          accents: true,
          words: ['le_truc'],
        },
        {
          id: 'm19l1e5',
          kind: 'translate',
          prompt: 'Переклади нейтральним регістром',
          question: 'Я багато працюю.',
          answer: ['je travaille beaucoup'],
          hint: 'Не «je bosse» — потрібен courant',
          words: ['travailler'],
        },
        {
          id: 'm19l1e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Franchement, ce boulot me fatigue.',
          translation: 'Чесно кажучи, ця робота мене втомлює.',
          words: ['franchement', 'le_boulot'],
        },
      ],
    },
    {
      id: 'm19l2',
      title: 'Що зникає в мовленні',
      subtitle: 'Чому ти не розумієш носіїв',
      minutes: 16,
      newWords: ['du_coup', 'ouais', 'raler', 'se_debrouiller'],
      steps: [
        {
          kind: 'intro',
          title: 'Не твоя провина',
          body: `Типова історія: ти читаєш французькою досить добре, а живу розмову не розбираєш узагалі.

Причина не в словниковому запасі. У реальному мовленні французи **скорочують і ковтають** стільки, що почуте не збігається з написаним. Це не недбалість — це норма усної мови.

Хороша новина: скорочень небагато і вони систематичні. Знаючи десяток правил, ти раптом починаєш чути.`,
        },
        {
          kind: 'grammar',
          title: 'Що саме зникає',
          body: `**1. «Ne» просто щезає.** Це найголовніше.
*Je **ne** sais pas* → *Je sais pas* → [шсе па]
*Il **n'**y a pas* → *Y a pas* → [я па]

**2. «Tu» перед голосною стає t’.**
*Tu as* → *T'as* [та] · *Tu es* → *T'es* [те]

**3. «Il / ils» втрачають l.**
*Il y a* → [я] · *Ils sont* → [і сɔ̃]

**4. «Je» зливається з наступним.**
*Je suis* → [шɥі] · *Je ne sais pas* → [шсе па]

**5. «Celui-là, cela» → çui-là, ça.**`,
          table: {
            caption: 'Написано → почуто',
            head: ['На письмі', 'У мовленні', 'Приблизно'],
            rows: [
              ['Je ne sais pas.', 'J’sais pas.', '[шсе па]'],
              ['Il n’y a pas de problème.', 'Y a pas d’problème.', '[я па дпʁɔблɛм]'],
              ['Tu as vu ?', 'T’as vu ?', '[та вю]'],
              ['Qu’est-ce que tu fais ?', 'Qu’est-c’ tu fais ?', '[кɛс тю фɛ]'],
              ['Il faut que tu viennes.', 'Faut qu’tu viennes.', '[фо ктю вjɛn]'],
            ],
          },
          warning:
            '⚠️ Асиметрія важлива: **розпізнавай усе це на слух, але сам говори повними формами.** Іноземець, що ковтає ne, звучить не «як носій», а недбало — доки вимова не бездоганна.',
        },
        {
          kind: 'grammar',
          title: 'Слова-заповнювачі',
          body: `Жива мова повна слів, які нічого не додають до змісту, але тримають ритм. Не розуміти їх — означає губити нитку.

**du coup** — «і тому, отже». Найпоширеніший паразит сучасної французької.
**genre** — «типу»
**quoi** у кінці речення — підсилення: *C'est bizarre, quoi.*
**bon / ben / bah** — «ну…»
**voilà** — «отак, ось»
**enfin** — «ну, тобто» (не «нарешті»!)

Українською ми робимо те саме: «коротше», «типу», «ну», «от».`,
          examples: [
            { fr: 'Du coup, on fait quoi ?', uk: 'То що робимо?' },
            { fr: 'Ben… j’sais pas trop.', uk: 'Ну… не дуже знаю.' },
            { fr: 'Enfin, c’est compliqué.', uk: 'Ну, тобто це складно.' },
            { fr: 'Voilà, c’est tout.', uk: 'Ось і все.' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm19l2e1',
          kind: 'mcq',
          prompt: 'Що це означає?',
          question: 'J’sais pas.',
          options: ['Je sais pas → Je ne sais pas', 'Je sais tout', 'Je ne sais rien'],
          answer: 0,
          explain: 'Ковтання «ne» + злиття «je» — найчастіше скорочення живої мови.',
        },
        {
          id: 'm19l2e2',
          kind: 'mcq',
          prompt: 'Розшифруй',
          question: 'T’as vu ?',
          options: ['Tu as vu ?', 'Tout a vu ?', 'Ta vue ?'],
          answer: 0,
          optionsAreFrench: true,
          explain: 'Tu + голосна → t’.',
        },
        {
          id: 'm19l2e3',
          kind: 'mcq',
          prompt: 'А це?',
          question: 'Y a pas d’problème.',
          options: ['Il n’y a pas de problème.', 'Y a un problème.'],
          answer: 0,
          optionsAreFrench: true,
          explain: '«Il n’y a» стискається до [я], плюс зникає «ne».',
        },
        {
          id: 'm19l2e4',
          kind: 'mcq',
          prompt: 'Що означає «du coup»?',
          question: 'Du coup, on y va ?',
          options: ['Раптом ми йдемо?', 'То що, ідемо?', 'Удар, ми йдемо?'],
          answer: 1,
          explain: 'Розмовний зв’язковий елемент, приблизно як українське «то що» або «отже».',
          words: ['du_coup'],
        },
        {
          id: 'm19l2e5',
          kind: 'mcq',
          prompt: 'Хибний друг у розмові',
          question: 'У живій мові «enfin» найчастіше означає…',
          options: ['нарешті', 'ну, тобто (виправлення думки)'],
          answer: 1,
          explain: 'У розмові це майже завжди «ну, тобто», а не «нарешті».',
        },
        {
          id: 'm19l2e6',
          kind: 'type',
          prompt: 'Запиши повною формою',
          question: 'J’sais pas → (повна форма)',
          answer: ['je ne sais pas'],
          accents: true,
          explain: 'Сам говори повною формою, навіть якщо чуєш скорочену.',
        },
        {
          id: 'm19l2e7',
          kind: 'listen',
          prompt: 'Що ти чуєш?',
          audioText: 'Je ne sais pas ce qu’il veut.',
          options: [
            'Я не знаю, чого він хоче',
            'Я знаю, чого він хоче',
            'Він не знає, чого я хочу',
          ],
          answer: 0,
        },
        {
          id: 'm19l2e8',
          kind: 'dictation',
          prompt: 'Запиши повною формою те, що чуєш',
          text: 'Il n’y a pas de problème.',
          translation: 'Немає проблеми.',
        },
      ],
    },
    {
      id: 'm19l3',
      title: 'Сказати м’якше',
      subtitle: 'Пом’якшення й нюанс',
      minutes: 14,
      newWords: ['a_vrai_dire', 'en_quelque_sorte', 'plus_ou_moins', 'quasiment', 'voire'],
      steps: [
        {
          kind: 'grammar',
          title: 'Пряме «ні» звучить різкіше, ніж ти думаєш',
          body: `Українська досить пряма: «Це неправильно», «Я не згоден», «Ні». Французька в тих самих ситуаціях **пом'якшує майже завжди** — і пряма відповідь читається як грубість, хоч ти цього й не мав на увазі.

Механізмів пом'якшення кілька, і всі прості:

**1. Conditionnel замість présent**
*Je veux* → *Je **voudrais*** · *Tu dois* → *Tu **devrais***

**2. Заперечення замість прямого протилежного**
*C'est mauvais* → *Ce **n'est pas terrible***
*Je déteste* → *Je **n'aime pas trop***

**3. Хеджування — вставні звороти**
*C'est faux* → ***Il me semble que** ce n'est pas tout à fait exact*`,
          table: {
            caption: 'Прямо → природно',
            head: ['Занадто прямо', 'Природно', 'Українською'],
            rows: [
              ['C’est faux.', 'Ce n’est pas tout à fait exact.', 'Це не зовсім точно.'],
              [
                'Je ne suis pas d’accord.',
                'Je ne suis pas sûr d’être d’accord.',
                'Не певен, що погоджуся.',
              ],
              ['C’est mauvais.', 'Ce n’est pas terrible.', 'Так собі.'],
              ['Non.', 'Ce serait difficile.', 'Це було б складно.'],
              ['Tu as tort.', 'Tu es sûr ? Il me semble que…', 'Ти певен? Мені здається…'],
            ],
          },
          warning:
            'Парадокс: «Ce n’est pas terrible» дослівно «це не жахливо», але означає «так собі, погано». Французька применшує — і це треба чути.',
        },
        {
          kind: 'grammar',
          title: 'Точні відтінки кількості',
          body: `B2 — це рівень, де замість «дуже» і «трохи» з'являються півтони.

**quasiment / presque** — майже
**plus ou moins** — більш-менш
**en quelque sorte** — певною мірою, так би мовити
**voire** — ба навіть (підсилення)
**à vrai dire** — правду кажучи

*C'est difficile, **voire** impossible.* — Це складно, ба навіть неможливо.
*Il a **plus ou moins** compris.* — Він більш-менш зрозумів.`,
          examples: [
            {
              fr: 'À vrai dire, je ne suis pas convaincu.',
              uk: 'Правду кажучи, я не переконаний.',
            },
            { fr: 'C’est en quelque sorte une exception.', uk: 'Це певною мірою виняток.' },
            {
              fr: 'Le projet est long, voire très long.',
              uk: 'Проєкт довгий, ба навіть дуже довгий.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm19l3e1',
          kind: 'mcq',
          prompt: 'Пом’якши відмову',
          question: 'Як увічливо сказати «ні» на пропозицію?',
          options: ['Non.', 'Ce serait difficile, malheureusement.', 'C’est impossible.'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Conditionnel + пояснення — стандартний спосіб відмовити, не образивши.',
        },
        {
          id: 'm19l3e2',
          kind: 'mcq',
          prompt: 'Що насправді означає ця фраза?',
          question: 'Ce n’est pas terrible.',
          options: ['Це не жахливо, тобто добре', 'Так собі, не дуже'],
          answer: 1,
          explain: 'Класичне французьке применшення: формально м’яко, за змістом — негативно.',
        },
        {
          id: 'm19l3e3',
          kind: 'cloze',
          prompt: 'Встав підсилення',
          sentence: "C'est difficile, ___ impossible.",
          answer: ['voire'],
          translation: 'Це складно, ба навіть неможливо.',
          options: ['voire', 'voir', 'très'],
          explain: '⚠️ voire (ба навіть) ≠ voir (бачити).',
          words: ['voire'],
        },
        {
          id: 'm19l3e4',
          kind: 'cloze',
          prompt: 'Пом’якш вставним зворотом',
          sentence: '___ ___ ___, je ne suis pas convaincu.',
          answer: ['à vrai dire', 'a vrai dire'],
          translation: 'Правду кажучи, я не переконаний.',
          hint: 'Три слова',
          words: ['a_vrai_dire'],
        },
        {
          id: 'm19l3e5',
          kind: 'match',
          prompt: 'З’єднай відтінки',
          pairs: [
            { fr: 'quasiment', uk: 'майже' },
            { fr: 'plus ou moins', uk: 'більш-менш' },
            { fr: 'en quelque sorte', uk: 'певною мірою' },
            { fr: 'voire', uk: 'ба навіть' },
          ],
          words: ['quasiment', 'plus_ou_moins', 'en_quelque_sorte', 'voire'],
        },
        {
          id: 'm19l3e6',
          kind: 'translate',
          prompt: 'Пом’якши: «Ти неправий»',
          question: 'Скажи м’якше, що співрозмовник помиляється',
          answer: [
            'il me semble que ce n’est pas tout à fait exact',
            "il me semble que ce n'est pas tout à fait exact",
            'tu es sûr ?',
          ],
          hint: 'Il me semble que…',
        },
        {
          id: 'm19l3e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Ce n’est pas tout à fait exact.',
          translation: 'Це не зовсім точно.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm19q1',
      kind: 'mcq',
      prompt: 'Регістр',
      question: 'Який варіант доречний у діловому листі?',
      options: ['J’ai un truc à vous dire.', 'Je souhaiterais vous parler d’un point.'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm19q2',
      kind: 'mcq',
      prompt: 'Розшифруй',
      question: 'Chuis crevé.',
      options: ['Je suis fatigué.', 'Je suis créatif.'],
      answer: 0,
      optionsAreFrench: true,
    },
    {
      id: 'm19q3',
      kind: 'type',
      prompt: 'Повна форма',
      question: 'T’as compris ? → (повна форма)',
      answer: ['tu as compris'],
      accents: true,
    },
    {
      id: 'm19q4',
      kind: 'mcq',
      prompt: 'Значення',
      question: 'У розмові «enfin» найчастіше означає…',
      options: ['нарешті', 'ну, тобто'],
      answer: 1,
    },
    {
      id: 'm19q5',
      kind: 'cloze',
      prompt: 'Підсилення',
      sentence: 'Le trajet est long, ___ épuisant.',
      answer: ['voire'],
      translation: 'Дорога довга, ба навіть виснажлива.',
      options: ['voire', 'voir', 'vers'],
    },
    {
      id: 'm19q6',
      kind: 'translate',
      prompt: 'Переклади нейтральним регістром',
      question: 'Мені страшенно потрібна відпустка.',
      answer: ["j'ai vraiment besoin de vacances", "j'ai besoin de vacances"],
    },
    {
      id: 'm19q7',
      kind: 'dictation',
      prompt: 'Запиши повною формою',
      text: 'Je ne sais pas ce qu’il veut.',
      translation: 'Я не знаю, чого він хоче.',
    },
    {
      id: 'm19q8',
      kind: 'match',
      prompt: 'З’єднай регістри',
      pairs: [
        { fr: 'bosser', uk: 'familier' },
        { fr: 'travailler', uk: 'courant' },
        { fr: 'le boulot', uk: 'familier' },
        { fr: "l'emploi", uk: 'soutenu' },
      ],
    },
  ],
}

/* ================================================================== *
 * Модуль 20 — Складні зв’язки
 * ================================================================== */
export const module20: Module = {
  id: 'm20',
  title: 'Складні зв’язки',
  subtitle: 'Довгі речення, які не розсипаються',
  grammarFocus: 'lequel / auquel / duquel, ce qui / ce que / ce dont, складні сполучники',
  emoji: '🪢',
  lessons: [
    {
      id: 'm20l1',
      title: 'lequel і компанія',
      subtitle: 'Відносні займенники з прийменником',
      minutes: 15,
      newWords: ['le_cadre', 'le_domaine', 'la_demarche'],
      steps: [
        {
          kind: 'grammar',
          title: 'Коли qui та que вже не досить',
          body: `Ти знаєш **qui** (підмет) і **que** (додаток). Але щойно перед займенником потрібен **прийменник**, вони не працюють.

Українською ми просто відмінюємо: «стіл, **на якому**…», «друг, **з яким**…». Французька для цього має окрему форму — **lequel**, яка змінюється за родом і числом.`,
          table: {
            caption: 'Форми lequel',
            head: ['', 'Однина', 'Множина'],
            rows: [
              ['Чоловічий', 'lequel', 'lesquels'],
              ['Жіночий', 'laquelle', 'lesquelles'],
            ],
          },
          warning:
            'Про **людей** після прийменника частіше вживають **qui**: *l’ami **avec qui** je travaille*. А от про **речі** — обов’язково lequel: *le projet **sur lequel** je travaille*.',
        },
        {
          kind: 'grammar',
          title: 'Злиття з à та de',
          body: `Як і артиклі, lequel зливається з прийменниками **à** і **de**:

**à + lequel = auquel** · à + lesquels = **auxquels**
**de + lequel = duquel** · de + lesquels = **desquels**

*Le projet **auquel** je pense.* — Проєкт, про який я думаю. (penser **à**)
*Le sujet **duquel** nous parlons.* — Тема, про яку ми говоримо.

⚠️ Але якщо конструкція з простим **de**, у розмовній мові майже завжди беруть **dont**, а не duquel:
*Le sujet **dont** nous parlons.* — природніше.

**duquel** лишається для складених прийменників: *au cours **duquel**, à côté **duquel***.`,
          examples: [
            {
              fr: 'La table sur laquelle j’ai posé mes clés.',
              uk: 'Стіл, на якому я поклав ключі.',
            },
            { fr: 'Les collègues avec qui je travaille.', uk: 'Колеги, з якими я працюю.' },
            {
              fr: 'La réunion au cours de laquelle tout a changé.',
              uk: 'Зустріч, під час якої все змінилося.',
            },
            { fr: 'Le problème auquel nous faisons face.', uk: 'Проблема, з якою ми стикаємося.' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm20l1e1',
          kind: 'cloze',
          prompt: 'Встав форму lequel',
          sentence: 'La table sur ___ j’ai posé mes clés.',
          answer: ['laquelle'],
          translation: 'Стіл, на якому я поклав ключі.',
          options: ['lequel', 'laquelle', 'lesquels', 'qui'],
          explain: 'table — жіночий рід однини → laquelle.',
          words: ['la_table'],
        },
        {
          id: 'm20l1e2',
          kind: 'cloze',
          prompt: 'Злиття з à',
          sentence: 'Le problème ___ nous faisons face.',
          answer: ['auquel'],
          translation: 'Проблема, з якою ми стикаємося.',
          options: ['auquel', 'à lequel', 'duquel', 'dont'],
          explain: 'faire face À → à + lequel = auquel. Форми «à lequel» не існує.',
          words: ['w_probleme'],
        },
        {
          id: 'm20l1e3',
          kind: 'mcq',
          prompt: 'Про людей',
          question: 'Les collègues avec ___ je travaille.',
          options: ['lesquels', 'qui'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Після прийменника про людей природніше «qui».',
          words: ['w_collegue'],
        },
        {
          id: 'm20l1e4',
          kind: 'mcq',
          prompt: 'dont чи duquel?',
          question: 'Le sujet ___ nous parlons.',
          options: ['dont', 'duquel'],
          answer: 0,
          optionsAreFrench: true,
          explain: 'Для простого «de» завжди dont. Duquel — лише в складених прийменниках.',
          words: ['w_sujet'],
        },
        {
          id: 'm20l1e5',
          kind: 'cloze',
          prompt: 'Складений прийменник',
          sentence: 'La réunion au cours de ___ tout a changé.',
          answer: ['laquelle'],
          translation: 'Зустріч, під час якої все змінилося.',
          options: ['laquelle', 'lequel', 'dont'],
          explain: 'Після «au cours de» dont неможливе — потрібна форма lequel.',
          words: ['w_reunion'],
        },
        {
          id: 'm20l1e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Проєкт, над яким я працюю.',
          answer: ['le projet sur lequel je travaille'],
          hint: 'travailler SUR + lequel',
          words: ['w_projet', 'travailler'],
        },
        {
          id: 'm20l1e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'C’est la raison pour laquelle je suis venu.',
          translation: 'Ось причина, через яку я прийшов.',
          words: ['w_raison'],
        },
      ],
    },
    {
      id: 'm20l2',
      title: 'ce qui, ce que, ce dont',
      subtitle: 'Коли немає іменника',
      minutes: 14,
      newWords: ['le_constat', 'lenjeu', 'w_avis'],
      steps: [
        {
          kind: 'grammar',
          title: 'Займенник без опори',
          body: `Іноді те, до чого стосується підрядне, — не іменник, а **ціла ідея**. Українською ми кажемо «те, що…»:

> «Я не розумію **того, що** він каже.»

Французька додає до qui / que / dont частку **ce**:

**ce qui** — коли це підмет: *Je ne sais pas **ce qui** se passe.* (Не знаю, що відбувається.)
**ce que** — коли це додаток: *Je ne comprends pas **ce que** tu dis.* (Не розумію, що ти кажеш.)
**ce dont** — коли дієслово вимагає de: *C'est **ce dont** j'ai besoin.* (Це те, що мені потрібно.)

Правило вибору те саме, що для qui / que: після **ce qui** йде дієслово, після **ce que** — підмет.`,
          table: {
            caption: 'Порівняй',
            head: ['З іменником', 'Без іменника', 'Українською'],
            rows: [
              ['le livre qui est là', 'ce qui est là', 'те, що там'],
              ['le livre que je lis', 'ce que je lis', 'те, що я читаю'],
              ['le livre dont je parle', 'ce dont je parle', 'те, про що я говорю'],
            ],
          },
          warning:
            '⚠️ Дуже частий зворот **«Ce qui est intéressant, c’est que…»** — «Що цікаво, так це те, що…». Він одразу піднімає рівень усного мовлення.',
        },
        {
          kind: 'grammar',
          title: 'celui, celle, ceux — «той, хто»',
          body: `Коли треба сказати «той, хто» або «ті, які», беруть **celui / celle / ceux / celles** + відносний займенник:

*Ceux **qui** veulent partir peuvent y aller.* — Ті, хто хоче піти, можуть іти.
*Celle **que** j'ai choisie.* — Та, яку я обрав.

Ці ж форми з **-ci / -là** означають «цей / той»:
*Je préfère **celui-ci**.* — Я віддаю перевагу цьому.`,
          examples: [
            { fr: 'Ce qui m’étonne, c’est son calme.', uk: 'Що мене дивує, так це його спокій.' },
            { fr: 'Fais ce que tu veux.', uk: 'Роби те, що хочеш.' },
            { fr: 'Ce dont j’ai envie, c’est d’un café.', uk: 'Чого мені хочеться, так це кави.' },
            { fr: 'Ceux qui arrivent en retard attendront.', uk: 'Ті, хто спізниться, зачекають.' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm20l2e1',
          kind: 'cloze',
          prompt: 'ce qui чи ce que?',
          sentence: 'Je ne comprends pas ___ ___ tu dis.',
          answer: ['ce que'],
          translation: 'Я не розумію, що ти кажеш.',
          hint: 'Далі йде підмет «tu»',
          explain: 'Після пропуску підмет → ce que.',
          words: ['comprendre'],
        },
        {
          id: 'm20l2e2',
          kind: 'cloze',
          prompt: 'А тут?',
          sentence: 'Dis-moi ___ ___ se passe.',
          answer: ['ce qui'],
          translation: 'Скажи мені, що відбувається.',
          hint: 'Далі йде дієслово',
          explain: 'Після пропуску дієслово → ce qui.',
          words: ['w_se_passer'],
        },
        {
          id: 'm20l2e3',
          kind: 'cloze',
          prompt: 'Дієслово вимагає de',
          sentence: "C'est exactement ___ ___ j'ai besoin.",
          answer: ['ce dont'],
          translation: 'Це саме те, що мені потрібно.',
          explain: 'avoir besoin DE → ce dont.',
          words: ['w_besoin'],
        },
        {
          id: 'm20l2e4',
          kind: 'cloze',
          prompt: 'Той, хто',
          sentence: '___ qui veulent partir peuvent y aller.',
          answer: ['ceux'],
          translation: 'Ті, хто хоче піти, можуть іти.',
          options: ['ceux', 'celui', 'celles', 'ce'],
          explain: 'Множина чоловічого роду → ceux.',
        },
        {
          id: 'm20l2e5',
          kind: 'mcq',
          prompt: 'Що це означає?',
          question: 'Ce qui m’étonne, c’est son calme.',
          options: ['Що мене дивує, так це його спокій', 'Він дивується моєму спокою'],
          answer: 0,
        },
        {
          id: 'm20l2e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Роби те, що хочеш.',
          answer: ['fais ce que tu veux'],
          words: ['faire', 'vouloir'],
        },
        {
          id: 'm20l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Ce qui est important, c’est de continuer.',
          translation: 'Що важливо, так це продовжувати.',
          words: ['w_important', 'w_continuer'],
        },
      ],
    },
    {
      id: 'm20l3',
      title: 'Причина, наслідок, поступка',
      subtitle: 'Сполучники письмового рівня',
      minutes: 15,
      newWords: [
        'neanmoins',
        'toutefois',
        'par_consequent',
        'etant_donne',
        'de_sorte_que',
        'dautant_plus',
        'or_conj',
      ],
      steps: [
        {
          kind: 'grammar',
          title: 'Точніші інструменти',
          body: `На A2–B1 ти обходився *parce que*, *donc*, *mais*. На B2 від тебе очікують **точності**: причина буває відомою й невідомою, наслідок — наміреним і ненаміреним.`,
          table: {
            caption: 'Розширений набір',
            head: ['Зв’язок', 'Вираз', 'Нюанс'],
            rows: [
              ['Причина (нова)', 'parce que', 'подає нову інформацію'],
              ['Причина (відома)', 'puisque, étant donné que', 'обидва вже це знають'],
              ['Причина (книжна)', 'du fait que, en raison de', 'письмовий стиль'],
              ['Наслідок', 'par conséquent, de sorte que', 'офіційніше за donc'],
              ['Протиставлення', 'néanmoins, toutefois', 'книжніше за mais'],
              ['Поступка', 'bien que, quoique + subj.', 'хоча'],
              ['Підсилення причини', 'd’autant plus que', 'тим більше що'],
              ['Поворот думки', 'or', 'а проте, тим часом'],
            ],
          },
          warning:
            '⚠️ **puisque** проти **parce que**: «Puisque tu es là, aide-moi» — «Раз уже ти тут, допоможи» (факт відомий обом). «Parce que» так не вжити.',
        },
        {
          kind: 'grammar',
          title: 'Схема академічної поступки',
          body: `Найкорисніша конструкція для есе й дискусії — визнати аргумент опонента, а потім заперечити:

> **Certes**, …, **mais** / **néanmoins** …

*Certes, la voiture est pratique. Néanmoins, elle pollue énormément.*
Звісно, авто зручне. Проте воно дуже забруднює.

Це справляє значно краще враження, ніж просто «Je ne suis pas d'accord», бо показує, що ти розумієш обидві сторони.`,
          examples: [
            {
              fr: 'Étant donné que le budget est limité, nous devons choisir.',
              uk: 'Зважаючи на обмежений бюджет, треба обирати.',
            },
            {
              fr: 'Il pleuvait ; par conséquent, le match a été annulé.',
              uk: 'Ішов дощ; відповідно, матч скасували.',
            },
            {
              fr: 'C’est cher, d’autant plus que la qualité est moyenne.',
              uk: 'Це дорого, тим більше що якість посередня.',
            },
            {
              fr: 'Il a promis de venir. Or, il n’est jamais arrivé.',
              uk: 'Він обіцяв прийти. А проте так і не з’явився.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm20l3e1',
          kind: 'cloze',
          prompt: 'Причина, відома обом',
          sentence: '___ tu es là, aide-moi.',
          answer: ['puisque'],
          translation: 'Раз уже ти тут, допоможи мені.',
          options: ['puisque', 'parce que', 'car'],
          explain: 'puisque подає причину, яку співрозмовник уже знає.',
        },
        {
          id: 'm20l3e2',
          kind: 'cloze',
          prompt: 'Книжний наслідок',
          sentence: 'Il pleuvait ; ___ ___, le match a été annulé.',
          answer: ['par conséquent'],
          translation: 'Ішов дощ; відповідно, матч скасували.',
          hint: 'Два слова',
          words: ['par_consequent'],
        },
        {
          id: 'm20l3e3',
          kind: 'cloze',
          prompt: 'Книжне протиставлення',
          sentence: 'C’est cher ; ___, la qualité est excellente.',
          answer: ['néanmoins', 'neanmoins', 'toutefois'],
          translation: 'Це дорого; проте якість чудова.',
          words: ['neanmoins'],
        },
        {
          id: 'm20l3e4',
          kind: 'cloze',
          prompt: 'Підсилення причини',
          sentence: 'C’est risqué, ___ ___ ___ nous manquons de temps.',
          answer: ["d'autant plus que", 'd autant plus que'],
          translation: 'Це ризиковано, тим більше що нам бракує часу.',
          hint: 'Чотири слова',
          words: ['dautant_plus'],
        },
        {
          id: 'm20l3e5',
          kind: 'mcq',
          prompt: 'Академічна поступка',
          question: 'Який варіант справляє краще враження в есе?',
          options: [
            'Je ne suis pas d’accord.',
            'Certes, cet argument est valable. Néanmoins, il ignore un point essentiel.',
          ],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Визнати аргумент опонента, потім заперечити — базова схема французького есе.',
          words: ['certes'],
        },
        {
          id: 'm20l3e6',
          kind: 'match',
          prompt: 'З’єднай сполучники',
          pairs: [
            { fr: 'étant donné que', uk: 'зважаючи на те, що' },
            { fr: 'par conséquent', uk: 'відповідно' },
            { fr: 'néanmoins', uk: 'проте' },
            { fr: 'or', uk: 'а проте' },
          ],
          words: ['etant_donne', 'par_consequent', 'neanmoins', 'or_conj'],
        },
        {
          id: 'm20l3e7',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Зважаючи на те, що бюджет обмежений, треба обирати.',
          answer: [
            'étant donné que le budget est limité, il faut choisir',
            'etant donné que le budget est limité, il faut choisir',
          ],
          words: ['etant_donne'],
        },
        {
          id: 'm20l3e8',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Certes, c’est difficile ; néanmoins, c’est possible.',
          translation: 'Звісно, це складно; проте можливо.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm20q1',
      kind: 'cloze',
      prompt: 'Форма lequel',
      sentence: 'La maison dans ___ il habite.',
      answer: ['laquelle'],
      translation: 'Дім, у якому він живе.',
      options: ['lequel', 'laquelle', 'lesquels'],
    },
    {
      id: 'm20q2',
      kind: 'cloze',
      prompt: 'Злиття',
      sentence: 'Le sujet ___ je pense.',
      answer: ['auquel'],
      translation: 'Тема, про яку я думаю.',
      options: ['auquel', 'à lequel', 'duquel'],
    },
    {
      id: 'm20q3',
      kind: 'cloze',
      prompt: 'ce qui чи ce que?',
      sentence: 'Je sais ___ ___ tu penses.',
      answer: ['ce que'],
      translation: 'Я знаю, що ти думаєш.',
    },
    {
      id: 'm20q4',
      kind: 'cloze',
      prompt: 'Той, хто',
      sentence: '___ qui arrivent en retard attendront.',
      answer: ['ceux'],
      translation: 'Ті, хто спізниться, зачекають.',
      options: ['ceux', 'celui', 'ce'],
    },
    {
      id: 'm20q5',
      kind: 'mcq',
      prompt: 'Причина',
      question: 'Який сполучник подає причину, відому обом?',
      options: ['parce que', 'puisque'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm20q6',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Це те, що мені потрібно.',
      answer: ["c'est ce dont j'ai besoin"],
    },
    {
      id: 'm20q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'C’est la raison pour laquelle je refuse.',
      translation: 'Ось причина, чому я відмовляюся.',
    },
    {
      id: 'm20q8',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'ce qui', uk: 'те, що (підмет)' },
        { fr: 'ce que', uk: 'те, що (додаток)' },
        { fr: 'ce dont', uk: 'те, про що' },
        { fr: 'ceux qui', uk: 'ті, хто' },
      ],
    },
  ],
}

/* ================================================================== *
 * Модуль 21 — Відтінки думки
 * ================================================================== */
export const module21: Module = {
  id: 'm21',
  title: 'Відтінки думки',
  subtitle: 'Поступка, жаль, докір',
  grammarFocus: 'Subjonctif passé, конструкції поступки, conditionnel passé',
  emoji: '🎭',
  lessons: [
    {
      id: 'm21l1',
      title: 'Subjonctif passé',
      subtitle: 'Коли дія вже сталася',
      minutes: 14,
      newWords: ['regretter', 'w_content', 's_etonner'],
      steps: [
        {
          kind: 'grammar',
          title: 'Той самий тригер, інший час',
          body: `Ти вже знаєш subjonctif présent після *il faut que*, *je veux que*, *bien que*. Логіка не змінюється — змінюється лише **час дії**.

Якщо дія в підрядному **вже відбулася**, беруть **subjonctif passé**:

> **avoir / être в subjonctif** + дієприкметник

*Je suis content **qu'il soit venu**.* — Я радий, що він прийшов.
*Bien **qu'elle ait fini**, elle reste.* — Хоча вона закінчила, вона залишається.

Порівняй:
*Je doute **qu'il vienne**.* — Сумніваюся, що він прийде. (майбутнє / одночасно)
*Je doute **qu'il soit venu**.* — Сумніваюся, що він приходив. (раніше)`,
          table: {
            caption: 'Допоміжні в subjonctif',
            head: ['Особа', 'avoir', 'être'],
            rows: [
              ['que je', 'aie', 'sois'],
              ['que tu', 'aies', 'sois'],
              ['qu’il / elle', 'ait', 'soit'],
              ['que nous', 'ayons', 'soyons'],
              ['que vous', 'ayez', 'soyez'],
              ['qu’ils / elles', 'aient', 'soient'],
            ],
          },
          warning:
            '⚠️ Вибір допоміжного той самий, що завжди: дієслова руху й зворотні беруть être, решта — avoir. Узгодження дієприкметника теж працює як звичайно.',
        },
      ],
      exercises: [
        {
          id: 'm21l1e1',
          kind: 'cloze',
          prompt: 'Subjonctif passé',
          sentence: 'Je suis content qu’il ___ venu.',
          answer: ['soit'],
          translation: 'Я радий, що він прийшов.',
          options: ['soit', 'ait', 'est', 'a'],
          explain: 'venir — дієслово руху → être, у subjonctif: soit venu.',
          words: ['venir'],
        },
        {
          id: 'm21l1e2',
          kind: 'cloze',
          prompt: 'А тут?',
          sentence: 'Bien qu’elle ___ fini, elle reste.',
          answer: ['ait'],
          translation: 'Хоча вона закінчила, вона залишається.',
          options: ['ait', 'soit', 'a'],
          explain: 'finir — звичайне дієслово → avoir, у subjonctif: ait fini.',
          words: ['w_finir'],
        },
        {
          id: 'm21l1e3',
          kind: 'mcq',
          prompt: 'Яка різниця?',
          question: '«Je doute qu’il vienne» проти «Je doute qu’il soit venu»',
          options: ['Різниці немає', 'Перше — про майбутнє, друге — про минуле'],
          answer: 1,
          explain: 'Subjonctif présent — дія одночасна або пізніша; passé — раніша.',
          words: ['w_douter'],
        },
        {
          id: 'm21l1e4',
          kind: 'type',
          prompt: 'Subjonctif від avoir для «nous»',
          question: 'que nous (avoir) →',
          answer: ['ayons'],
          accents: true,
        },
        {
          id: 'm21l1e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Я радий, що ти прийшов.',
          answer: ['je suis content que tu sois venu', 'je suis contente que tu sois venu'],
          words: ['w_content'],
        },
        {
          id: 'm21l1e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Je regrette qu’il soit parti.',
          translation: 'Шкода, що він пішов.',
          words: ['regretter'],
        },
      ],
    },
    {
      id: 'm21l2',
      title: 'Поступка',
      subtitle: 'avoir beau, quoique, quel que soit',
      minutes: 15,
      newWords: ['avoir_beau', 'quoique', 'quel_que_soit', 'certes'],
      steps: [
        {
          kind: 'grammar',
          title: 'Конструкція без українського відповідника',
          body: `**avoir beau** — один із тих зворотів, які неможливо перекласти дослівно, а вживаються вони постійно.

> **avoir beau** + інфінітив = «хоч скільки…, дарма що…»

*J'**ai beau** essayer, ça ne marche pas.*
Хоч скільки я намагаюся, не працює.

*Il **a beau** être riche, il n'est pas heureux.*
Хоч який він багатий, він не щасливий.

Зверни увагу на порядок: конструкція йде **першою**, а результат — після коми. І жодного «mais» — воно тут зайве.`,
          table: {
            caption: 'Способи поступки',
            head: ['Вираз', 'Що після нього', 'Приклад'],
            rows: [
              ['bien que / quoique', 'subjonctif', 'Bien qu’il **soit** tard…'],
              ['même si', 'indicatif', 'Même s’il **est** tard…'],
              ['avoir beau', 'інфінітив', 'Il **a beau** être tard…'],
              ['quel que soit', 'subjonctif', 'Quel que **soit** le prix…'],
              ['malgré', 'іменник', 'Malgré **le prix**…'],
            ],
          },
          warning:
            '⚠️ Найчастіша помилка: **malgré** вимагає іменника, а не підрядного. «Malgré qu’il soit tard» — неправильно; треба «Bien qu’il soit tard» або «Malgré l’heure tardive».',
        },
        {
          kind: 'grammar',
          title: 'quel que soit — «хоч би який»',
          body: `Конструкція **quel que** + être в subjonctif узгоджується з іменником:

*Quel que **soit** le prix, je l'achète.* — Хоч би яка ціна, я це куплю.
*Quelle que **soit** la raison…* — Хоч би яка причина…
*Quels que **soient** les problèmes…* — Хоч би які проблеми…

⚠️ Не плутай з **quoi que** («хоч би що»): *Quoi que tu fasses…* — Хоч би що ти робив…
І обидва — не те саме, що **quoique** («хоча»), яке пишеться разом.`,
          examples: [
            {
              fr: 'J’ai beau relire, je ne comprends pas.',
              uk: 'Хоч скільки перечитую, не розумію.',
            },
            {
              fr: 'Quelle que soit ta décision, je te soutiens.',
              uk: 'Хоч би яким було твоє рішення, я тебе підтримую.',
            },
            {
              fr: 'Quoi que tu dises, il ne changera pas d’avis.',
              uk: 'Хоч би що ти казав, він не передумає.',
            },
            { fr: 'Malgré la pluie, nous sommes sortis.', uk: 'Попри дощ, ми вийшли.' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm21l2e1',
          kind: 'cloze',
          prompt: 'Встав конструкцію поступки',
          sentence: 'J’___ ___ essayer, ça ne marche pas.',
          answer: ['ai beau'],
          translation: 'Хоч скільки я намагаюся, не працює.',
          hint: 'Два слова, від avoir',
          words: ['avoir_beau'],
        },
        {
          id: 'm21l2e2',
          kind: 'mcq',
          prompt: 'Що йде після avoir beau?',
          question: 'Il a beau ___ riche…',
          options: ['être', 'est', 'soit'],
          answer: 0,
          optionsAreFrench: true,
          explain: 'Після avoir beau завжди інфінітив.',
        },
        {
          id: 'm21l2e3',
          kind: 'mcq',
          prompt: 'Знайди помилку',
          question: 'Malgré qu’il soit tard, je continue.',
          options: ['Помилки немає', '«Malgré» вимагає іменника — треба «Bien qu’il soit tard»'],
          answer: 1,
          explain: 'Класична помилка навіть у просунутих. Malgré + іменник, bien que + підрядне.',
        },
        {
          id: 'm21l2e4',
          kind: 'cloze',
          prompt: 'Хоч би яка',
          sentence: '___ ___ ___ ta décision, je te soutiens.',
          answer: ['quelle que soit'],
          translation: 'Хоч би яким було твоє рішення, я тебе підтримую.',
          hint: 'Три слова, узгоджені з «décision»',
          words: ['quel_que_soit'],
        },
        {
          id: 'm21l2e5',
          kind: 'mcq',
          prompt: 'Три схожі слова',
          question: 'Яке з них означає «хоча»?',
          options: ['quoique', 'quoi que', 'quel que'],
          answer: 0,
          optionsAreFrench: true,
          explain: 'quoique (разом) = хоча; quoi que (окремо) = хоч би що; quel que = хоч би який.',
          words: ['quoique'],
        },
        {
          id: 'm21l2e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Попри дощ, ми вийшли.',
          answer: ['malgré la pluie, nous sommes sortis', 'malgré la pluie nous sommes sortis'],
          hint: 'malgré + іменник',
          words: ['w_pluie'],
        },
        {
          id: 'm21l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'J’ai beau relire, je ne comprends pas.',
          translation: 'Хоч скільки перечитую, не розумію.',
        },
      ],
    },
    {
      id: 'm21l3',
      title: 'Жаль і докір',
      subtitle: 'Conditionnel passé',
      minutes: 14,
      newWords: ['regretter', 'w_eviter', 'w_prevenir'],
      steps: [
        {
          kind: 'grammar',
          title: 'Те, що могло б статися',
          body: `**Conditionnel passé** говорить про минуле, якого не було: жаль, докір, невпевнена інформація.

> **avoir / être в conditionnel** + дієприкметник

*J'**aurais dû** partir plus tôt.* — Мені **слід було** піти раніше. (жаль)
*Tu **aurais pu** me prévenir !* — Ти **міг би** мене попередити! (докір)
*Il **serait parti** hier.* — Він начебто поїхав учора. (непідтверджена інформація)

Три звороти, які варто вивчити як готові формули:
**j'aurais dû** — мені слід було
**j'aurais pu** — я міг би
**j'aurais aimé** — мені хотілося б (у минулому)`,
          table: {
            caption: 'Повна схема si-конструкцій',
            head: ['Умова', 'Наслідок', 'Приклад'],
            rows: [
              ['si + présent', 'futur', 'Si j’ai le temps, je viendrai.'],
              ['si + imparfait', 'conditionnel présent', 'Si j’avais le temps, je viendrais.'],
              [
                'si + plus-que-parfait',
                'conditionnel passé',
                'Si j’avais eu le temps, je serais venu.',
              ],
            ],
          },
          warning:
            'Українське «я б зробив» не розрізняє теперішнє й минуле — контекст вирішує. Французька розрізняє формою, тож переклад «я б прийшов» може бути і *je viendrais*, і *je serais venu*.',
        },
        {
          kind: 'dialogue',
          title: 'Після невдалого дня',
          setting: 'Двоє друзів обговорюють пропущений потяг',
          lines: [
            {
              speaker: 'Marc',
              fr: 'On a raté le train. J’aurais dû partir plus tôt.',
              uk: 'Ми проґавили потяг. Мені слід було вийти раніше.',
            },
            {
              speaker: 'Léa',
              fr: 'Tu aurais pu me prévenir, j’aurais réservé autre chose.',
              uk: 'Ти міг би мене попередити, я б забронювала інше.',
            },
            {
              speaker: 'Marc',
              fr: 'Si j’avais su, j’aurais pris un taxi.',
              uk: 'Якби я знав, я б узяв таксі.',
            },
            {
              speaker: 'Léa',
              fr: 'Bon. Quoi qu’il en soit, il y en a un autre à seize heures.',
              uk: 'Гаразд. Хай там як, є ще один о шістнадцятій.',
            },
            {
              speaker: 'Marc',
              fr: 'Tant mieux. J’ai beau râler, ça ne changera rien.',
              uk: 'Тим краще. Хоч скільки я бурчатиму, це нічого не змінить.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm21l3e1',
          kind: 'cloze',
          prompt: 'Вислови жаль',
          sentence: 'J’___ ___ partir plus tôt. (devoir)',
          answer: ['aurais dû', 'aurais du'],
          translation: 'Мені слід було піти раніше.',
          hint: 'conditionnel від avoir + dû',
          words: ['w_devoir'],
        },
        {
          id: 'm21l3e2',
          kind: 'cloze',
          prompt: 'Докір',
          sentence: 'Tu ___ ___ me prévenir ! (pouvoir)',
          answer: ['aurais pu'],
          translation: 'Ти міг би мене попередити!',
          words: ['pouvoir', 'w_prevenir'],
        },
        {
          id: 'm21l3e3',
          kind: 'cloze',
          prompt: 'Тип 3',
          sentence: 'Si j’avais su, j’___ ___ un taxi. (prendre)',
          answer: ['aurais pris'],
          translation: 'Якби я знав, я б узяв таксі.',
          words: ['prendre'],
        },
        {
          id: 'm21l3e4',
          kind: 'mcq',
          prompt: 'Який відтінок?',
          question: 'Il serait parti hier.',
          options: ['Він точно поїхав учора', 'Він начебто поїхав учора (неперевірено)'],
          answer: 1,
          explain: 'Conditionnel у новинах позначає неперевірену інформацію.',
        },
        {
          id: 'm21l3e5',
          kind: 'mcq',
          prompt: 'Знайди помилку',
          question: 'Si j’aurais su, j’aurais pris un taxi.',
          options: ['Помилки немає', 'Після si не буває conditionnel — треба «Si j’avais su»'],
          answer: 1,
          explain: 'Те саме правило, що на B1: після si — présent, imparfait або plus-que-parfait.',
        },
        {
          id: 'm21l3e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Мені слід було тобі сказати.',
          answer: ["j'aurais dû te le dire", "j'aurais du te le dire", "j'aurais dû te dire"],
          words: ['w_dire'],
        },
        {
          id: 'm21l3e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Tu aurais pu me prévenir.',
          translation: 'Ти міг би мене попередити.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm21q1',
      kind: 'cloze',
      prompt: 'Subjonctif passé',
      sentence: 'Je suis ravi qu’elle ___ réussi.',
      answer: ['ait'],
      translation: 'Я в захваті, що їй вдалося.',
      options: ['ait', 'soit', 'a'],
    },
    {
      id: 'm21q2',
      kind: 'cloze',
      prompt: 'Поступка',
      sentence: 'Il ___ ___ être riche, il n’est pas heureux.',
      answer: ['a beau'],
      translation: 'Хоч який він багатий, він не щасливий.',
    },
    {
      id: 'm21q3',
      kind: 'mcq',
      prompt: 'Знайди помилку',
      question: 'Malgré qu’il pleuve, je sors.',
      options: ['Помилки немає', 'Треба «Bien qu’il pleuve» або «Malgré la pluie»'],
      answer: 1,
    },
    {
      id: 'm21q4',
      kind: 'cloze',
      prompt: 'Жаль',
      sentence: 'J’___ ___ te le dire plus tôt.',
      answer: ['aurais dû', 'aurais du'],
      translation: 'Мені слід було сказати тобі раніше.',
    },
    {
      id: 'm21q5',
      kind: 'mcq',
      prompt: 'Три схожі форми',
      question: '«Хоч би що ти робив» — це…',
      options: ['quoique tu fasses', 'quoi que tu fasses'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm21q6',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Якби я знав, я б залишився.',
      answer: ["si j'avais su, je serais resté", "si j'avais su je serais resté"],
    },
    {
      id: 'm21q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Quelle que soit ta décision, je te soutiens.',
      translation: 'Хоч би яким було твоє рішення, я тебе підтримую.',
    },
    {
      id: 'm21q8',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'j’aurais dû', uk: 'мені слід було' },
        { fr: 'j’aurais pu', uk: 'я міг би' },
        { fr: 'avoir beau', uk: 'хоч скільки' },
        { fr: 'quel que soit', uk: 'хоч би який' },
      ],
    },
  ],
}
