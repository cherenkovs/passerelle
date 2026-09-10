import type { Module } from '../types'

/* ================================================================== *
 * Модуль 9 — Минуле, що вже сталося
 * ================================================================== */
export const module9: Module = {
  id: 'm9',
  title: 'Минуле, що вже сталося',
  subtitle: 'passé composé — найголовніший минулий час',
  grammarFocus: 'avoir/être + дієприкметник минулого часу',
  emoji: '⏳',
  lessons: [
    {
      id: 'm9l1',
      title: 'Складений минулий час',
      subtitle: 'Дві частини замість однієї',
      minutes: 16,
      newWords: ['avoir', 'faire', 'manger', 'regarder'],
      steps: [
        {
          kind: 'grammar',
          title: 'Минулий час складається з двох слів',
          body: `В українській минулий час — одне слово: «я **читав**». У французькій їх два:

> **avoir** (у теперішньому) + **дієприкметник**

*J'**ai mangé**.* — Я поїв.
*Tu **as regardé**.* — Ти подивився.
*Nous **avons travaillé**.* — Ми попрацювали.

**Як утворити дієприкметник:**
• Дієслова на **-er** → **-é**: parler → parl**é**
• Дієслова на **-ir** → **-i**: finir → fin**i**
• Неправильні — вчити окремо: faire → **fait**, prendre → **pris**, voir → **vu**`,
          table: {
            caption: 'parler у passé composé',
            head: ['Особа', 'Форма', 'Українською'],
            rows: [
              ['je', "j'ai parlé", 'я говорив'],
              ['tu', 'tu as parlé', 'ти говорив'],
              ['il / elle', 'il a parlé', 'він говорив'],
              ['nous', 'nous avons parlé', 'ми говорили'],
              ['vous', 'vous avez parlé', 'ви говорили'],
              ['ils / elles', 'ils ont parlé', 'вони говорили'],
            ],
          },
          warning:
            '⚠️ У запереченні ne…pas обіймає ЛИШЕ допоміжне дієслово: Je n’ai pas mangé. Дієприкметник залишається зовні.',
        },
        {
          kind: 'grammar',
          title: 'Найчастіші неправильні дієприкметники',
          body: `Ці десять доведеться просто вивчити — вони трапляються постійно.`,
          table: {
            caption: 'Треба знати напам’ять',
            head: ['Інфінітив', 'Дієприкметник', 'Українською'],
            rows: [
              ['faire', 'fait', 'робити → зроблено'],
              ['prendre', 'pris', 'брати → узято'],
              ['voir', 'vu', 'бачити → побачено'],
              ['être', 'été', 'бути → було'],
              ['avoir', 'eu [y]', 'мати → мав'],
              ['boire', 'bu', 'пити → випито'],
              ['lire', 'lu', 'читати → прочитано'],
              ['écrire', 'écrit', 'писати → написано'],
              ['dire', 'dit', 'казати → сказано'],
              ['pouvoir', 'pu', 'могти → зміг'],
            ],
          },
        },
      ],
      exercises: [
        {
          id: 'm9l1e1',
          kind: 'cloze',
          prompt: 'Постав у минулий час',
          sentence: "Hier, j'___ mangé au restaurant.",
          answer: ['ai'],
          translation: 'Вчора я їв у ресторані.',
          options: ['ai', 'suis', 'as'],
          explain: 'passé composé = avoir + дієприкметник. je → ai.',
          words: ['avoir', 'manger'],
        },
        {
          id: 'm9l1e2',
          kind: 'type',
          prompt: 'Утвори дієприкметник від «parler»',
          question: 'parler → (дієприкметник)',
          answer: ['parlé', 'parle'],
          accents: true,
          explain: 'Дієслова на -er дають -é: parlé.',
          words: ['parler'],
        },
        {
          id: 'm9l1e3',
          kind: 'mcq',
          prompt: 'Де ставиться «pas»?',
          question: '«Я не їв»',
          options: ["Je n'ai pas mangé.", "Je n'ai mangé pas.", 'Je ne mangé pas ai.'],
          answer: 0,
          optionsAreFrench: true,
          explain: 'ne…pas обіймає лише допоміжне avoir. Дієприкметник іде після.',
        },
        {
          id: 'm9l1e4',
          kind: 'cloze',
          prompt: 'Неправильний дієприкметник',
          sentence: "J'ai ___ mes devoirs. (faire)",
          answer: ['fait'],
          translation: 'Я зробив домашнє завдання.',
          options: ['fait', 'faisé', 'fais'],
          words: ['faire'],
        },
        {
          id: 'm9l1e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Вчора ми подивилися фільм.',
          answer: ['hier, nous avons regardé un film', 'hier nous avons regardé un film'],
          words: ['regarder'],
        },
        {
          id: 'm9l1e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: "J'ai pris le train hier.",
          translation: 'Вчора я їхав потягом.',
        },
      ],
    },
    {
      id: 'm9l2',
      title: 'Дієслова з être',
      subtitle: 'Виняток, який треба знати',
      minutes: 15,
      newWords: ['aller', 'venir', 'se_lever'],
      steps: [
        {
          kind: 'grammar',
          title: 'Невелика група бере être замість avoir',
          body: `Більшість дієслів у минулому часі беруть **avoir**. Але приблизно 15 дієслів руху та зміни стану беруть **être** — і тоді дієприкметник **узгоджується з підметом**, як прикметник.

*Je **suis allé**.* (чоловік) — Я пішов.
*Je **suis allée**.* (жінка) — Я пішла.
*Nous **sommes allés**.* — Ми пішли.

Це найближче до української логіки: у нас теж «пішов / пішла / пішли».`,
          table: {
            caption: 'Дієслова з être (найчастіші)',
            head: ['Інфінітив', 'Дієприкметник', 'Українською'],
            rows: [
              ['aller', 'allé', 'йти'],
              ['venir', 'venu', 'приходити'],
              ['arriver', 'arrivé', 'прибувати'],
              ['partir', 'parti', 'вирушати'],
              ['entrer', 'entré', 'входити'],
              ['sortir', 'sorti', 'виходити'],
              ['rester', 'resté', 'залишатися'],
              ['naître', 'né', 'народжуватися'],
              ['mourir', 'mort', 'помирати'],
              ['усі зворотні', 'se lever → levé(e)', 'вставати'],
            ],
          },
          warning:
            '⚠️ Узгодження чути рідко (allé та allée звучать однаково), але на письмі помилка помітна одразу.',
        },
      ],
      exercises: [
        {
          id: 'm9l2e1',
          kind: 'cloze',
          prompt: 'Яке допоміжне дієслово?',
          sentence: 'Elle ___ allée à Paris.',
          answer: ['est'],
          translation: 'Вона поїхала в Париж.',
          options: ['a', 'est', 'ai'],
          explain:
            'aller — дієслово руху → бере être. І дієприкметник узгоджується: allée (жін. рід).',
          words: ['aller'],
        },
        {
          id: 'm9l2e2',
          kind: 'cloze',
          prompt: 'А тут?',
          sentence: "J'___ mangé une pomme.",
          answer: ['ai'],
          translation: 'Я з’їв яблуко.',
          options: ['ai', 'suis'],
          explain: 'manger — звичайне дієслово → avoir.',
          words: ['manger'],
        },
        {
          id: 'm9l2e3',
          kind: 'mcq',
          prompt: 'Говорить жінка. Як правильно?',
          question: 'Je suis…',
          options: ['allé', 'allée', 'allés'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'З être дієприкметник узгоджується з підметом. Жінка → allée.',
        },
        {
          id: 'm9l2e4',
          kind: 'cloze',
          prompt: 'Зворотне дієслово',
          sentence: 'Elle ___ levée à six heures.',
          answer: ["s'est", 'sest'],
          translation: 'Вона встала о шостій.',
          hint: 'se + est, з апострофом',
          explain: 'Усі зворотні дієслова беруть être: elle s’est levée.',
          words: ['se_lever'],
        },
        {
          id: 'm9l2e5',
          kind: 'translate',
          prompt: 'Переклади французькою (говорить чоловік)',
          question: 'Я приїхав учора.',
          answer: ['je suis arrivé hier', 'je suis arrive hier'],
          words: ['venir'],
        },
        {
          id: 'm9l2e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Nous sommes allés au cinéma.',
          translation: 'Ми ходили в кіно.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm9q1',
      kind: 'cloze',
      prompt: 'Допоміжне дієслово',
      sentence: 'Il ___ parti ce matin.',
      answer: ['est'],
      translation: 'Він поїхав сьогодні вранці.',
      options: ['a', 'est', 'ai'],
    },
    {
      id: 'm9q2',
      kind: 'type',
      prompt: 'Дієприкметник від «prendre»',
      question: 'prendre →',
      answer: ['pris'],
    },
    {
      id: 'm9q3',
      kind: 'mcq',
      prompt: 'Знайди помилку',
      question: "J'ai allé au parc.",
      options: ['Помилки немає', 'Треба: Je suis allé au parc.', 'Треба: J’ai allée'],
      answer: 1,
    },
    {
      id: 'm9q4',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Я не бачив цей фільм.',
      answer: ["je n'ai pas vu ce film"],
    },
    {
      id: 'm9q5',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Elle est née à Lviv.',
      translation: 'Вона народилася у Львові.',
    },
    {
      id: 'm9q6',
      kind: 'wordbank',
      prompt: 'Збери речення',
      question: 'Вчора ми поїли в ресторані.',
      answer: 'Hier, nous avons mangé au restaurant.',
      distractors: ['sommes', 'mangés'],
    },
  ],
}

/* ================================================================== *
 * Модуль 10 — Описувати й порівнювати
 * ================================================================== */
export const module10: Module = {
  id: 'm10',
  title: 'Описувати й порівнювати',
  subtitle: 'Прикметники, кольори, ступені порівняння',
  grammarFocus: 'Узгодження прикметників та конструкції plus/moins/aussi… que',
  emoji: '🎨',
  lessons: [
    {
      id: 'm10l1',
      title: 'Прикметник узгоджується',
      subtitle: 'Чотири форми одного слова',
      minutes: 14,
      newWords: ['grand', 'petit', 'beau', 'nouveau'],
      steps: [
        {
          kind: 'grammar',
          title: 'Рід і число — як в українській',
          body: `Прикметник у французькій змінюється за родом і числом, як і в нас. Базова схема проста:

> **+ e** для жіночого · **+ s** для множини · **+ es** для жіночої множини`,
          table: {
            caption: 'petit — маленький',
            head: ['', 'Однина', 'Множина'],
            rows: [
              ['Чоловічий', 'petit', 'petits'],
              ['Жіночий', 'petite', 'petites'],
            ],
          },
          warning:
            '⚠️ На слух чути лише жіночий рід: petit [p(ə)ti] проти petite [p(ə)tit]. Множинне -s німе завжди.',
        },
        {
          kind: 'grammar',
          title: 'Неправильні прикметники',
          body: `Кілька дуже частих прикметників мають власні форми — їх треба знати.`,
          table: {
            caption: 'Вивчити напам’ять',
            head: ['Чоловічий', 'Жіночий', 'Українською'],
            rows: [
              ['beau', 'belle', 'гарний'],
              ['nouveau', 'nouvelle', 'новий'],
              ['vieux', 'vieille', 'старий'],
              ['blanc', 'blanche', 'білий'],
              ['heureux', 'heureuse', 'щасливий'],
              ['cher', 'chère', 'дорогий'],
              ['bon', 'bonne', 'добрий'],
            ],
          },
        },
      ],
      exercises: [
        {
          id: 'm10l1e1',
          kind: 'cloze',
          prompt: 'Узгодь прикметник',
          sentence: 'Une ___ maison. (beau)',
          answer: ['belle'],
          translation: 'Гарний дім.',
          options: ['beau', 'belle', 'beaux'],
          explain: 'maison — жіночий рід → belle (неправильна форма).',
          words: ['beau', 'la_maison'],
        },
        {
          id: 'm10l1e2',
          kind: 'cloze',
          prompt: 'Узгодь прикметник',
          sentence: 'Des livres ___. (intéressant)',
          answer: ['intéressants', 'interessants'],
          translation: 'Цікаві книги.',
          words: ['le_livre'],
        },
        {
          id: 'm10l1e3',
          kind: 'mcq',
          prompt: 'Що чути на слух?',
          question: 'petit / petits',
          speak: 'petit, petits',
          options: ['Різні слова', 'Однаково — множинне s німе'],
          answer: 1,
          explain: 'Кінцеве -s множини не вимовляється ніколи. Число видно лише з артикля.',
        },
        {
          id: 'm10l1e4',
          kind: 'match',
          prompt: 'З’єднай форми',
          pairs: [
            { fr: 'beau', uk: 'belle' },
            { fr: 'nouveau', uk: 'nouvelle' },
            { fr: 'vieux', uk: 'vieille' },
            { fr: 'blanc', uk: 'blanche' },
          ],
        },
        {
          id: 'm10l1e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Це нова машина.',
          answer: ["c'est une nouvelle voiture"],
          words: ['nouveau', 'la_voiture'],
        },
        {
          id: 'm10l1e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Elle est très heureuse.',
          translation: 'Вона дуже щаслива.',
        },
      ],
    },
    {
      id: 'm10l2',
      title: 'Більше, менше, так само',
      subtitle: 'Ступені порівняння',
      minutes: 13,
      newWords: ['grand', 'petit', 'beaucoup'],
      steps: [
        {
          kind: 'grammar',
          title: 'Три конструкції порівняння',
          body: `Французька не змінює саме слово (як українське «великий → більший»). Замість цього додає службове слово:

> **plus** … **que** — більш … ніж
> **moins** … **que** — менш … ніж
> **aussi** … **que** — так само … як

*Paris est **plus** grand **que** Lyon.* — Париж більший за Ліон.
*Le train est **moins** cher **que** l'avion.* — Потяг дешевший за літак.
*Elle est **aussi** grande **que** moi.* — Вона така ж висока, як я.

**Найвищий ступінь** — додаємо артикль:
*C'est **le plus** grand musée de Paris.* — Це найбільший музей Парижа.`,
          table: {
            caption: 'Винятки, які треба знати',
            head: ['Прикметник', 'Порівняння', 'Українською'],
            rows: [
              ['bon (добрий)', 'meilleur', 'кращий (не «plus bon»!)'],
              ['bien (добре)', 'mieux', 'краще'],
              ['mauvais (поганий)', 'pire / plus mauvais', 'гірший'],
            ],
          },
          warning:
            '⚠️ «plus bon» — помилка. Треба meilleur. Так само як українське «більш добрий» звучить дивно.',
        },
      ],
      exercises: [
        {
          id: 'm10l2e1',
          kind: 'cloze',
          prompt: 'Встав слово порівняння',
          sentence: 'Paris est ___ grand ___ Lyon.',
          answer: ['plus … que', 'plus que'],
          translation: 'Париж більший за Ліон.',
          hint: 'Два слова: перед і після прикметника',
          explain: 'Схема: plus + прикметник + que.',
        },
        {
          id: 'm10l2e2',
          kind: 'mcq',
          prompt: 'Як сказати «кращий»?',
          question: '«Це кращий ресторан»',
          options: ['le plus bon restaurant', 'le meilleur restaurant'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'bon → meilleur. Форми «plus bon» не існує.',
        },
        {
          id: 'm10l2e3',
          kind: 'cloze',
          prompt: 'Встав',
          sentence: "Le train est ___ cher que l'avion.",
          answer: ['moins'],
          translation: 'Потяг дешевший за літак.',
          options: ['plus', 'moins', 'aussi'],
          words: ['le_train'],
        },
        {
          id: 'm10l2e4',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Вона така ж висока, як я.',
          answer: ['elle est aussi grande que moi'],
          words: ['grand'],
        },
        {
          id: 'm10l2e5',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: "C'est le plus beau musée de la ville.",
          translation: 'Це найгарніший музей міста.',
        },
        {
          id: 'm10l2e6',
          kind: 'wordbank',
          prompt: 'Збери речення',
          question: 'Французька легша за німецьку.',
          answer: "Le français est plus facile que l'allemand.",
          distractors: ['moins', 'meilleur'],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm10q1',
      kind: 'cloze',
      prompt: 'Узгодь',
      sentence: 'Une ___ voiture. (nouveau)',
      answer: ['nouvelle'],
      translation: 'Нова машина.',
      options: ['nouveau', 'nouvelle', 'nouveaux'],
    },
    {
      id: 'm10q2',
      kind: 'mcq',
      prompt: 'Оберіть правильне',
      question: '«краще»',
      options: ['plus bien', 'mieux'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm10q3',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Це найбільше місто Франції.',
      answer: ['c’est la plus grande ville de france', "c'est la plus grande ville de france"],
    },
    {
      id: 'm10q4',
      kind: 'cloze',
      prompt: 'Порівняння',
      sentence: 'Il est ___ vieux ___ son frère.',
      answer: ['plus … que', 'plus que'],
      translation: 'Він старший за свого брата.',
    },
    {
      id: 'm10q5',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'La cuisine française est meilleure.',
      translation: 'Французька кухня краща.',
    },
    {
      id: 'm10q6',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'plus… que', uk: 'більш ніж' },
        { fr: 'moins… que', uk: 'менш ніж' },
        { fr: 'aussi… que', uk: 'так само як' },
        { fr: 'meilleur', uk: 'кращий' },
      ],
    },
  ],
}

/* ================================================================== *
 * Модуль 11 — Покупки та гроші
 * ================================================================== */
export const module11: Module = {
  id: 'm11',
  title: 'Покупки та гроші',
  subtitle: 'У магазині, ціни, розміри',
  grammarFocus: 'Вказівні прикметники ce/cette/ces та займенник en',
  emoji: '🛍️',
  lessons: [
    {
      id: 'm11l1',
      title: 'Цей, ця, ці',
      subtitle: 'Вказівні прикметники',
      minutes: 13,
      newWords: ['le_magasin', 'cent', 'delicieux'],
      steps: [
        {
          kind: 'grammar',
          title: 'ce / cette / ces',
          body: `Українське «цей / ця / це / ці» французькою:`,
          table: {
            caption: 'Вказівні прикметники',
            head: ['Рід / число', 'Форма', 'Приклад'],
            rows: [
              ['чоловічий', 'ce', 'ce livre — ця книга'],
              ['чол. перед голосною', 'cet', 'cet homme — цей чоловік'],
              ['жіночий', 'cette', 'cette table — цей стіл'],
              ['множина', 'ces', 'ces livres — ці книги'],
            ],
          },
          warning:
            '⚠️ cet — окрема форма лише перед голосною або німим h: cet ami, cet hôtel. Вимовляється так само, як cette.',
        },
        {
          kind: 'dialogue',
          title: 'У магазині',
          setting: 'Крамниця одягу',
          lines: [
            {
              speaker: 'Vendeuse',
              fr: 'Bonjour ! Je peux vous aider ?',
              uk: 'Добрий день! Можу допомогти?',
            },
            {
              speaker: 'Клієнт',
              fr: 'Oui, combien coûte cette veste ?',
              uk: 'Так, скільки коштує ця куртка?',
            },
            {
              speaker: 'Vendeuse',
              fr: 'Elle coûte quatre-vingts euros.',
              uk: 'Вона коштує вісімдесят євро.',
            },
            {
              speaker: 'Клієнт',
              fr: "C'est un peu cher. Vous avez moins cher ?",
              uk: 'Це трохи дорого. Є дешевше?',
            },
            {
              speaker: 'Vendeuse',
              fr: 'Oui, ce modèle est à cinquante euros.',
              uk: 'Так, ця модель за п’ятдесят євро.',
            },
            { speaker: 'Клієнт', fr: 'Parfait, je la prends !', uk: 'Чудово, я її беру!' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm11l1e1',
          kind: 'cloze',
          prompt: 'Встав вказівний',
          sentence: '___ livre est intéressant.',
          answer: ['ce'],
          translation: 'Ця книга цікава.',
          options: ['ce', 'cet', 'cette', 'ces'],
          explain: 'livre — чоловічий рід, починається з приголосної → ce.',
          words: ['le_livre'],
        },
        {
          id: 'm11l1e2',
          kind: 'cloze',
          prompt: 'Увага — голосна!',
          sentence: '___ homme est français.',
          answer: ['cet'],
          translation: 'Цей чоловік — француз.',
          options: ['ce', 'cet', 'cette'],
          explain: 'Перед голосною чоловіча форма → cet.',
        },
        {
          id: 'm11l1e3',
          kind: 'cloze',
          prompt: 'Встав вказівний',
          sentence: '___ voiture est chère.',
          answer: ['cette'],
          translation: 'Ця машина дорога.',
          options: ['ce', 'cet', 'cette', 'ces'],
          words: ['la_voiture'],
        },
        {
          id: 'm11l1e4',
          kind: 'listen',
          prompt: 'Скільки коштує?',
          audioText: 'Ça coûte quatre-vingts euros.',
          options: ['80 євро', '90 євро', '70 євро'],
          answer: 0,
          words: ['quatre_vingts'],
        },
        {
          id: 'm11l1e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Скільки коштує ця книга?',
          answer: ['combien coûte ce livre', 'combien coute ce livre'],
          words: ['le_livre'],
        },
        {
          id: 'm11l1e6',
          kind: 'speak',
          prompt: 'Спитай ціну вголос',
          text: 'Combien coûte cette veste, s’il vous plaît ?',
          translation: 'Скільки коштує ця куртка, будь ласка?',
        },
      ],
    },
    {
      id: 'm11l2',
      title: 'Займенник en',
      subtitle: 'Як не повторювати те саме слово',
      minutes: 13,
      newWords: ['du', 'beaucoup'],
      steps: [
        {
          kind: 'grammar',
          title: 'en замінює «цього, їх»',
          body: `Українською ми часто просто опускаємо повтор: «— Хочеш хліба? — Так, хочу.»

Французька так не може: дієслово потребує доповнення. Тому вживають **en** — воно замінює те, про що вже йшлося.

*— Tu veux du pain ? — Oui, j'**en** veux.* — Так, хочу (його).
*— Tu as des frères ? — Oui, j'**en** ai deux.* — Так, у мене їх двоє.
*— Vous avez du lait ? — Non, je n'**en** ai pas.* — Ні, немає.

**en** стоїть **перед** дієсловом і замінює конструкції з **de** (du, de la, des).`,
          warning:
            '⚠️ Українською «Так, хочу» — нормально. Французькою «Oui, je veux» звучить обірвано. Потрібне en.',
        },
      ],
      exercises: [
        {
          id: 'm11l2e1',
          kind: 'cloze',
          prompt: 'Встав займенник',
          sentence: '— Tu veux du café ? — Oui, j’___ veux.',
          answer: ['en'],
          translation: '— Хочеш кави? — Так, хочу.',
          explain: 'en замінює «du café». Стоїть перед дієсловом.',
          words: ['du'],
        },
        {
          id: 'm11l2e2',
          kind: 'cloze',
          prompt: 'Встав займенник',
          sentence: '— Vous avez des enfants ? — Oui, j’___ ai trois.',
          answer: ['en'],
          translation: '— У вас є діти? — Так, троє.',
        },
        {
          id: 'm11l2e3',
          kind: 'mcq',
          prompt: 'Що не так?',
          question: '— Tu as du pain ? — Oui, je veux.',
          options: ['Усе правильно', "Бракує en: Oui, j'en veux."],
          answer: 1,
          explain: 'Французьке дієслово не можна лишати без доповнення — потрібне en.',
        },
        {
          id: 'm11l2e4',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: '— У тебе є сестри? — Так, у мене їх дві.',
          answer: ["tu as des sœurs ? oui, j'en ai deux", "oui, j'en ai deux"],
          hint: 'Достатньо відповіді',
        },
        {
          id: 'm11l2e5',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: "Non, je n'en ai pas.",
          translation: 'Ні, у мене цього немає.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm11q1',
      kind: 'cloze',
      prompt: 'Вказівний',
      sentence: '___ hôtel est cher.',
      answer: ['cet'],
      translation: 'Цей готель дорогий.',
      options: ['ce', 'cet', 'cette'],
    },
    {
      id: 'm11q2',
      kind: 'cloze',
      prompt: 'Займенник',
      sentence: '— Tu as du sucre ? — Oui, j’___ ai.',
      answer: ['en'],
      translation: '— У тебе є цукор? — Так, є.',
    },
    {
      id: 'm11q3',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Ця куртка занадто дорога.',
      answer: ['cette veste est trop chère', 'cette veste est trop chere'],
    },
    {
      id: 'm11q4',
      kind: 'listen',
      prompt: 'Яка ціна?',
      audioText: 'Cela fait quarante-cinq euros.',
      options: ['45 євро', '55 євро', '40 євро'],
      answer: 0,
    },
    {
      id: 'm11q5',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'ce', uk: 'цей (ч. р.)' },
        { fr: 'cette', uk: 'ця (ж. р.)' },
        { fr: 'ces', uk: 'ці (мн.)' },
        { fr: 'cet', uk: 'цей (перед голосною)' },
      ],
    },
    {
      id: 'm11q6',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Combien ça coûte ?',
      translation: 'Скільки це коштує?',
    },
  ],
}

/* ================================================================== *
 * Модуль 12 — Здоров'я і самопочуття
 * ================================================================== */
export const module12: Module = {
  id: 'm12',
  title: "Здоров'я і самопочуття",
  subtitle: 'Тіло, самопочуття, у лікаря',
  grammarFocus: 'avoir mal à, наказовий спосіб',
  emoji: '🩺',
  lessons: [
    {
      id: 'm12l1',
      title: 'Мені болить',
      subtitle: 'avoir mal à',
      minutes: 13,
      newWords: ['avoir', 'medecin', 'la_pharmacie', 'lhopital'],
      steps: [
        {
          kind: 'grammar',
          title: 'Знову «мати», а не «бути»',
          body: `Як і з віком, самопочуття французькою — це те, що ти **маєш**.

> **avoir mal à** + частина тіла

*J'ai mal **à la** tête.* — У мене болить голова.
*J'ai mal **au** ventre.* — У мене болить живіт.
*J'ai mal **aux** dents.* — У мене болять зуби.

Артикль зливається так само: à + le = **au**, à + les = **aux**.`,
          table: {
            caption: 'Частини тіла',
            head: ['Французькою', 'Українською', 'З болем'],
            rows: [
              ['la tête', 'голова', "j'ai mal à la tête"],
              ['le ventre', 'живіт', "j'ai mal au ventre"],
              ['la gorge', 'горло', "j'ai mal à la gorge"],
              ['le dos', 'спина', "j'ai mal au dos"],
              ['les dents', 'зуби', "j'ai mal aux dents"],
              ['la jambe', 'нога', "j'ai mal à la jambe"],
            ],
          },
          warning:
            'Інші стани теж через avoir: avoir froid (мерзнути), avoir chaud (спекотно), avoir peur (боятися), avoir sommeil (хотіти спати).',
        },
      ],
      exercises: [
        {
          id: 'm12l1e1',
          kind: 'cloze',
          prompt: 'Встав злиття артикля',
          sentence: "J'ai mal ___ ventre.",
          answer: ['au'],
          translation: 'У мене болить живіт.',
          options: ['à le', 'au', 'à la', 'aux'],
          explain: 'ventre — чоловічий рід → à + le = au.',
        },
        {
          id: 'm12l1e2',
          kind: 'cloze',
          prompt: 'Встав',
          sentence: "J'ai mal ___ ___ tête.",
          answer: ['à la'],
          translation: 'У мене болить голова.',
          options: ['au', 'à la', 'aux'],
        },
        {
          id: 'm12l1e3',
          kind: 'mcq',
          prompt: 'Знайди помилку',
          question: 'Je suis mal à la tête.',
          options: ['Помилки немає', "Треба J'ai mal à la tête"],
          answer: 1,
          explain: 'Біль — через avoir, не через être. Як і вік.',
        },
        {
          id: 'm12l1e4',
          kind: 'match',
          prompt: 'З’єднай частини тіла',
          pairs: [
            { fr: 'la tête', uk: 'голова' },
            { fr: 'le dos', uk: 'спина' },
            { fr: 'la gorge', uk: 'горло' },
            { fr: 'les dents', uk: 'зуби' },
          ],
        },
        {
          id: 'm12l1e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'У мене болить горло.',
          answer: ["j'ai mal à la gorge"],
        },
        {
          id: 'm12l1e6',
          kind: 'speak',
          prompt: 'Скажи вголос',
          text: "J'ai mal à la tête depuis hier.",
          translation: 'У мене болить голова з учора.',
        },
      ],
    },
    {
      id: 'm12l2',
      title: 'Наказовий спосіб',
      subtitle: 'Порада, прохання, вказівка',
      minutes: 12,
      newWords: ['prendre', 'aller', 'faire'],
      steps: [
        {
          kind: 'grammar',
          title: 'Просто прибираємо займенник',
          body: `Наказовий спосіб утворюється дуже легко: береш форму теперішнього часу й **прибираєш займенник**.

*Tu prends ce médicament.* → ***Prends** ce médicament !* — Прийми ці ліки!
*Vous tournez à gauche.* → ***Tournez** à gauche !* — Поверніть ліворуч!
*Nous allons !* → ***Allons** !* — Ходімо!

⚠️ Одна деталь: у дієслів на **-er** форма для *tu* втрачає кінцеве **-s**:
*Tu manges* → ***Mange** !* (а не «Manges !»)

**Заперечення** — звична схема ne…pas:
***Ne** mange **pas** ça !* — Не їж це!`,
          table: {
            caption: 'Три форми наказового способу',
            head: ['Кому', 'Приклад', 'Українською'],
            rows: [
              ['tu (друг)', 'Regarde !', 'Дивись!'],
              ['vous (ввічливо)', 'Regardez !', 'Дивіться!'],
              ['nous (спонукання)', 'Regardons !', 'Подивімось!'],
            ],
          },
        },
      ],
      exercises: [
        {
          id: 'm12l2e1',
          kind: 'type',
          prompt: 'Утвори наказ для «tu»',
          question: 'tu manges → (наказ)',
          answer: ['mange'],
          explain: 'У дієслів на -er форма для tu втрачає -s: Mange !',
        },
        {
          id: 'm12l2e2',
          kind: 'cloze',
          prompt: 'Наказовий для vous',
          sentence: '___ à gauche ! (tourner)',
          answer: ['tournez'],
          translation: 'Поверніть ліворуч!',
          words: ['tourner', 'a_gauche'],
        },
        {
          id: 'm12l2e3',
          kind: 'mcq',
          prompt: 'Оберіть правильну форму',
          question: '«Не їж це!» (до друга)',
          options: ['Ne manges pas ça !', 'Ne mange pas ça !'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Кінцеве -s зникає в наказовій формі дієслів на -er.',
        },
        {
          id: 'm12l2e4',
          kind: 'translate',
          prompt: 'Переклади французькою (ввічливо)',
          question: 'Ідіть прямо!',
          answer: ['continuez tout droit', 'allez tout droit'],
          words: ['tout_droit'],
        },
        {
          id: 'm12l2e5',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Prenez ce médicament deux fois par jour.',
          translation: 'Приймайте ці ліки двічі на день.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm12q1',
      kind: 'cloze',
      prompt: 'Встав',
      sentence: 'Il a mal ___ dents.',
      answer: ['aux'],
      translation: 'У нього болять зуби.',
      options: ['au', 'à la', 'aux'],
    },
    {
      id: 'm12q2',
      kind: 'type',
      prompt: 'Наказ для «vous»',
      question: 'vous prenez → (наказ)',
      answer: ['prenez'],
    },
    {
      id: 'm12q3',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'У мене болить спина.',
      answer: ["j'ai mal au dos"],
    },
    {
      id: 'm12q4',
      kind: 'mcq',
      prompt: 'Правильна форма',
      question: '«Дивись!» (до друга, regarder)',
      options: ['Regardes !', 'Regarde !'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm12q5',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: "J'ai mal à la gorge.",
      translation: 'У мене болить горло.',
    },
    {
      id: 'm12q6',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'avoir froid', uk: 'мерзнути' },
        { fr: 'avoir chaud', uk: 'бути спекотно' },
        { fr: 'avoir peur', uk: 'боятися' },
        { fr: 'avoir sommeil', uk: 'хотіти спати' },
      ],
    },
  ],
}
