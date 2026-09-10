import type { Module } from '../types'

/* ================================================================== *
 * Модуль 16 — Майбутнє та умова
 * ================================================================== */
export const module16: Module = {
  id: 'm16',
  title: 'Майбутнє та умова',
  subtitle: 'Futur simple, conditionnel і три типи «якщо»',
  grammarFocus: 'Futur simple, conditionnel présent, конструкції з si',
  emoji: '🔮',
  lessons: [
    {
      id: 'm16l1',
      title: 'Futur simple',
      subtitle: 'Справжнє майбутнє',
      minutes: 14,
      newWords: ['prevoir', 'w_esperer', 'w_avenir'],
      steps: [
        {
          kind: 'grammar',
          title: 'Інфінітив плюс закінчення avoir',
          body: `Ти вже вмієш казати про майбутнє через **aller + інфінітив** (*je vais partir*). Це найближче майбутнє, розмовне.

**Futur simple** — офіційніше й «дальше»: плани, прогнози, обіцянки.

Утворення напрочуд елегантне: береш **інфінітив** і додаєш закінчення, які збігаються з формами **avoir**:

> parler + **ai, as, a, ons, ez, ont**

*je parler**ai**, tu parler**as**, il parler**a**, nous parler**ons**, vous parler**ez**, ils parler**ont***

Дієслова на **-re** відкидають кінцеве e: *prendre → je prendr**ai***.`,
          table: {
            caption: 'Неправильні основи — треба знати',
            head: ['Інфінітив', 'Основа', 'Приклад'],
            rows: [
              ['être', 'ser-', 'je serai'],
              ['avoir', 'aur-', "j'aurai"],
              ['aller', 'ir-', "j'irai"],
              ['faire', 'fer-', 'je ferai'],
              ['venir', 'viendr-', 'je viendrai'],
              ['pouvoir', 'pourr-', 'je pourrai'],
              ['vouloir', 'voudr-', 'je voudrai'],
              ['voir', 'verr-', 'je verrai'],
              ['devoir', 'devr-', 'je devrai'],
              ['savoir', 'saur-', 'je saurai'],
            ],
          },
          warning:
            'Ці основи повернуться в conditionnel — тож вивчивши їх один раз, отримуєш одразу два часи.',
        },
        {
          kind: 'grammar',
          title: 'Коли futur, а коли aller + інфінітив',
          body: `Різниця приблизно як між українськими «я зроблю» і «я зараз зроблю».

• **aller + інфінітив** — найближче, конкретне, розмовне:
  *Je vais appeler le médecin.* — Зараз подзвоню лікарю.
• **futur simple** — віддалене, планове, офіційне:
  *Un jour, j'habiterai en France.* — Колись я житиму у Франції.

У повсякденній розмові французи частіше беруть **aller + інфінітив**. Futur simple панує в письмі, прогнозах погоди й обіцянках.`,
          examples: [
            { fr: 'Demain, il fera beau.', uk: 'Завтра буде гарна погода.' },
            { fr: "Je t'écrirai dès que possible.", uk: 'Я напишу тобі якнайшвидше.' },
            { fr: 'Nous verrons bien.', uk: 'Побачимо.' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm16l1e1',
          kind: 'cloze',
          prompt: 'Постав у futur simple',
          sentence: 'Demain, je ___ à Paris. (partir)',
          answer: ['partirai'],
          translation: 'Завтра я поїду в Париж.',
          options: ['partirai', 'partirais', 'pars', 'partais'],
          explain: 'Інфінітив partir + закінчення -ai для je.',
          words: ['w_partir'],
        },
        {
          id: 'm16l1e2',
          kind: 'cloze',
          prompt: 'Неправильна основа',
          sentence: 'Nous ___ contents de te voir. (être)',
          answer: ['serons'],
          translation: 'Ми будемо раді тебе бачити.',
          options: ['serons', 'sommes', 'étions', 'aurons'],
          explain: 'être → основа ser-. nous serons.',
          words: ['etre'],
        },
        {
          id: 'm16l1e3',
          kind: 'type',
          prompt: 'Futur simple від aller для «je»',
          question: 'je (aller) → futur simple',
          answer: ['irai', "j'irai"],
          accents: true,
          hint: 'Основа ir-',
          explain: 'aller → ir- → j’irai. Одна з найнесподіваніших основ.',
          words: ['aller'],
        },
        {
          id: 'm16l1e4',
          kind: 'mcq',
          prompt: 'Який варіант природніший у розмові?',
          question: '«Зараз подзвоню лікарю»',
          options: ["J'appellerai le médecin.", 'Je vais appeler le médecin.'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Для найближчої конкретної дії французи беруть aller + інфінітив.',
          words: ['medecin'],
        },
        {
          id: 'm16l1e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Завтра буде гарна погода.',
          answer: ['demain, il fera beau', 'demain il fera beau'],
          hint: 'faire → основа fer-',
          words: ['demain'],
        },
        {
          id: 'm16l1e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Un jour, j’habiterai en France.',
          translation: 'Колись я житиму у Франції.',
          words: ['habiter', 'la_france'],
        },
      ],
    },
    {
      id: 'm16l2',
      title: 'Conditionnel',
      subtitle: 'Ввічливість, побажання, гіпотеза',
      minutes: 14,
      newWords: ['je_voudrais', 'w_esperer', 'w_souhaiter'],
      steps: [
        {
          kind: 'grammar',
          title: 'Основа futur + закінчення imparfait',
          body: `Ти вже знаєш обидві половинки, тож conditionnel дістається майже безкоштовно:

> **основа futur** + **закінчення imparfait** (-ais, -ais, -ait, -ions, -iez, -aient)

*je parler**ais**, tu parler**ais**, il parler**ait**, nous parler**ions**…*

І неправильні основи ті самі, що в futur: *être → ser**ais**, avoir → aur**ais**, aller → ir**ais**, pouvoir → pourr**ais***.

Найвідоміша форма — **je voudrais**, яку ти вживаєш із першого модуля. Тепер зрозуміло, звідки вона: це conditionnel від *vouloir*.`,
          table: {
            caption: 'Для чого потрібен conditionnel',
            head: ['Навіщо', 'Приклад', 'Українською'],
            rows: [
              ['Ввічливість', 'Je voudrais un café.', 'Я хотів би каву.'],
              ['Прохання', 'Pourriez-vous m’aider ?', 'Чи могли б ви допомогти?'],
              ['Порада', 'Tu devrais te reposer.', 'Тобі варто відпочити.'],
              ['Побажання', 'J’aimerais voyager.', 'Я хотів би подорожувати.'],
              ['Гіпотеза', 'Ce serait génial.', 'Це було б чудово.'],
            ],
          },
          warning:
            'Різниця між «Je veux» і «Je voudrais» приблизно як між «Хочу каву» і «Я хотів би каву». Друге — норма ввічливості, а не надмірність.',
        },
      ],
      exercises: [
        {
          id: 'm16l2e1',
          kind: 'cloze',
          prompt: 'Постав у conditionnel',
          sentence: 'Je ___ un café, s’il vous plaît. (vouloir)',
          answer: ['voudrais'],
          translation: 'Я хотів би каву, будь ласка.',
          options: ['voudrais', 'veux', 'voudrai', 'voulais'],
          explain: 'Основа voudr- + закінчення -ais.',
          words: ['je_voudrais'],
        },
        {
          id: 'm16l2e2',
          kind: 'cloze',
          prompt: 'Ввічливе прохання',
          sentence: '___-vous m’aider ? (pouvoir)',
          answer: ['pourriez'],
          translation: 'Чи могли б ви мені допомогти?',
          options: ['pourriez', 'pouvez', 'pourrez'],
          explain: 'Основа pourr- + -iez. Значно ввічливіше за «Pouvez-vous».',
          words: ['pouvoir', 'w_aider'],
        },
        {
          id: 'm16l2e3',
          kind: 'cloze',
          prompt: 'Порада',
          sentence: 'Tu ___ te reposer. (devoir)',
          answer: ['devrais'],
          translation: 'Тобі варто відпочити.',
          options: ['devrais', 'dois', 'devras'],
          explain: 'devoir у conditionnel = «варто, слід» — м’яка порада.',
          words: ['w_devoir', 'w_reposer'],
        },
        {
          id: 'm16l2e4',
          kind: 'mcq',
          prompt: 'Як утворюється conditionnel?',
          question: 'Формула conditionnel',
          options: [
            'Інфінітив + закінчення avoir',
            'Основа futur + закінчення imparfait',
            'Основа imparfait + закінчення futur',
          ],
          answer: 1,
        },
        {
          id: 'm16l2e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Я хотів би подорожувати.',
          answer: ["j'aimerais voyager", 'je voudrais voyager'],
          words: ['w_voyager'],
        },
        {
          id: 'm16l2e6',
          kind: 'speak',
          prompt: 'Попроси ввічливо вголос',
          text: 'Pourriez-vous m’aider, s’il vous plaît ?',
          translation: 'Чи могли б ви мені допомогти, будь ласка?',
        },
        {
          id: 'm16l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Ce serait vraiment génial.',
          translation: 'Це було б справді чудово.',
        },
      ],
    },
    {
      id: 'm16l3',
      title: 'Три типи «якщо»',
      subtitle: 'Si-конструкції',
      minutes: 15,
      newWords: ['w_si', 'meme_si', 'sinon'],
      steps: [
        {
          kind: 'grammar',
          title: 'Три схеми — і жодного вибору',
          body: `Українською ми маємо «якщо» і «якби». Французька розрізняє три ситуації, і кожна має **жорстко закріплену** пару часів.`,
          table: {
            caption: 'Схеми, які треба знати напам’ять',
            head: ['Тип', 'Після si', 'У головній частині', 'Приклад'],
            rows: [
              ['1. Реально', 'présent', 'futur simple', 'Si j’ai le temps, je viendrai.'],
              ['2. Гіпотетично', 'imparfait', 'conditionnel', 'Si j’avais le temps, je viendrais.'],
              [
                '3. Запізно',
                'plus-que-parfait',
                'conditionnel passé',
                'Si j’avais eu le temps, je serais venu.',
              ],
            ],
          },
          warning:
            '⚠️ ГОЛОВНЕ ПРАВИЛО: після **si** ніколи не буває ні futur, ні conditionnel. «Si je serai», «si j’aurais» — груба помилка, яку роблять навіть просунуті學ні. Умова завжди в présent, imparfait або plus-que-parfait.',
        },
        {
          kind: 'grammar',
          title: 'Як це лягає на українську',
          body: `• **Тип 1** = «Якщо матиму час, прийду». Реальна можливість.
• **Тип 2** = «Якби я мав час, я б прийшов». Уявна ситуація тепер.
• **Тип 3** = «Якби я мав час, я б прийшов» — але вже про минуле, коли нічого не змінити.

Українське «б» — надійний сигнал: якщо в перекладі є «б», у французькій буде **conditionnel** (у головній частині, не після si).`,
          examples: [
            {
              fr: "S'il fait beau, nous irons à la plage.",
              uk: 'Якщо буде гарна погода, ми підемо на пляж.',
            },
            {
              fr: "Si j'étais riche, j'achèterais une maison.",
              uk: 'Якби я був багатий, я б купив дім.',
            },
            { fr: "Si tu m'avais dit, je serais venu.", uk: 'Якби ти мені сказав, я б прийшов.' },
            { fr: '⚠️ Si j’aurai le temps…', uk: 'Так НЕ можна — тільки «Si j’ai le temps…»' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm16l3e1',
          kind: 'cloze',
          prompt: 'Тип 1: реальна умова',
          sentence: "Si j'ai le temps, je ___. (venir)",
          answer: ['viendrai'],
          translation: 'Якщо матиму час, я прийду.',
          options: ['viendrai', 'viendrais', 'viens', 'venais'],
          explain: 'si + présent → futur simple у головній частині.',
          words: ['venir'],
        },
        {
          id: 'm16l3e2',
          kind: 'cloze',
          prompt: 'Тип 2: гіпотеза',
          sentence: "Si j'___ riche, j'achèterais une maison. (être)",
          answer: ['étais', 'etais'],
          translation: 'Якби я був багатий, я б купив дім.',
          options: ['étais', 'suis', 'serais', 'serai'],
          explain: 'Після si — imparfait. Conditionnel іде в ІНШІЙ частині.',
          words: ['etre', 'w_riche'],
        },
        {
          id: 'm16l3e3',
          kind: 'mcq',
          prompt: 'Знайди помилку',
          question: "Si j'aurais le temps, je viendrais.",
          options: [
            'Помилки немає',
            "Після si не може бути conditionnel: треба «Si j'avais le temps»",
          ],
          answer: 1,
          explain:
            'Це найвідоміша помилка у французькій. Після si — тільки présent, imparfait або plus-que-parfait.',
        },
        {
          id: 'm16l3e4',
          kind: 'cloze',
          prompt: 'Тип 3: запізно',
          sentence: "Si tu m'avais dit, je ___ venu. (être)",
          answer: ['serais'],
          translation: 'Якби ти мені сказав, я б прийшов.',
          options: ['serais', 'serai', 'étais', 'suis'],
          explain: 'plus-que-parfait після si → conditionnel passé (serais venu).',
          words: ['w_dire'],
        },
        {
          id: 'm16l3e5',
          kind: 'mcq',
          prompt: 'Який це тип?',
          question: "S'il pleut, je resterai à la maison.",
          options: ['Реальна умова (тип 1)', 'Гіпотеза (тип 2)', 'Запізно (тип 3)'],
          answer: 0,
        },
        {
          id: 'm16l3e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Якби я мав гроші, я б подорожував.',
          answer: ["si j'avais de l'argent, je voyagerais", "si j'avais de l'argent je voyagerais"],
          hint: 'imparfait після si, conditionnel у другій частині',
          words: ['w_argent', 'w_voyager'],
        },
        {
          id: 'm16l3e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Si tu veux, on peut partir maintenant.',
          translation: 'Якщо хочеш, можемо йти зараз.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm16q1',
      kind: 'cloze',
      prompt: 'Futur simple',
      sentence: 'Demain, nous ___ nos amis. (voir)',
      answer: ['verrons'],
      translation: 'Завтра ми побачимо друзів.',
      options: ['verrons', 'voyons', 'verrions'],
    },
    {
      id: 'm16q2',
      kind: 'cloze',
      prompt: 'Conditionnel',
      sentence: 'Tu ___ faire attention. (devoir)',
      answer: ['devrais'],
      translation: 'Тобі варто бути обережним.',
      options: ['devrais', 'devras', 'dois'],
    },
    {
      id: 'm16q3',
      kind: 'mcq',
      prompt: 'Знайди помилку',
      question: 'Si je serai libre, je viendrai.',
      options: ['Помилки немає', 'Треба «Si je suis libre»'],
      answer: 1,
    },
    {
      id: 'm16q4',
      kind: 'cloze',
      prompt: 'Тип 2',
      sentence: 'Si nous ___ plus de temps, nous resterions. (avoir)',
      answer: ['avions'],
      translation: 'Якби ми мали більше часу, ми б залишилися.',
      options: ['avions', 'aurions', 'avons'],
    },
    {
      id: 'm16q5',
      kind: 'type',
      prompt: 'Futur simple від pouvoir для «je»',
      question: 'je (pouvoir) → futur simple',
      answer: ['pourrai'],
      accents: true,
    },
    {
      id: 'm16q6',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Я хотів би поговорити з вами.',
      answer: ['je voudrais vous parler', "j'aimerais vous parler"],
    },
    {
      id: 'm16q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Si j’avais su, je serais resté.',
      translation: 'Якби я знав, я б залишився.',
    },
    {
      id: 'm16q8',
      kind: 'match',
      prompt: 'З’єднай основу з дієсловом',
      pairs: [
        { fr: 'ser-', uk: 'être' },
        { fr: 'aur-', uk: 'avoir' },
        { fr: 'ir-', uk: 'aller' },
        { fr: 'fer-', uk: 'faire' },
      ],
    },
  ],
}

/* ================================================================== *
 * Модуль 17 — Subjonctif
 * ================================================================== */
export const module17: Module = {
  id: 'm17',
  title: 'Subjonctif',
  subtitle: 'Спосіб бажання, сумніву й емоції',
  grammarFocus: 'Subjonctif présent: утворення, тригери, вживання в думці',
  emoji: '💭',
  lessons: [
    {
      id: 'm17l1',
      title: 'Як утворити subjonctif',
      subtitle: 'Знову форма ils',
      minutes: 14,
      newWords: ['w_falloir', 'vouloir', 'w_douter'],
      steps: [
        {
          kind: 'intro',
          title: 'Не бійся слова «підрядний спосіб»',
          body: `Subjonctif має репутацію жаху французької граматики. Насправді для B1 потрібно небагато: **одна модель утворення** і **список тригерів**, після яких він обов'язковий.

І знову українська допомагає. Наше «**щоб** + минулий час» — це майже той самий механізм:

> «Я хочу, **щоб** ти **прийшов**.» → *Je veux **que** tu **viennes**.*

Ти вже інтуїтивно відчуваєш, що після «хочу, щоб» дієслово поводиться інакше. Французька робить те саме — тільки називає це subjonctif.`,
        },
        {
          kind: 'grammar',
          title: 'Модель: форма ils мінус -ent',
          body: `Береш форму **ils** у теперішньому часі, відкидаєш **-ent** і додаєш закінчення:

> **-e, -es, -e, -ions, -iez, -ent**

*ils **parl**ent* → корінь **parl-** → *que je parl**e**, que tu parl**es**…*
*ils **finiss**ent* → *que je finiss**e**…*
*ils **vienn**ent* → *que je vienn**e**…*

Subjonctif майже завжди йде після **que** — тому його й наводять у формі «que je parle».`,
          table: {
            caption: 'Неправильні — вивчити напам’ять',
            head: ['Дієслово', 'Subjonctif (que je…)', 'Українською'],
            rows: [
              ['être', 'que je sois', 'щоб я був'],
              ['avoir', 'que j’aie', 'щоб я мав'],
              ['aller', 'que j’aille', 'щоб я пішов'],
              ['faire', 'que je fasse', 'щоб я робив'],
              ['pouvoir', 'que je puisse', 'щоб я міг'],
              ['savoir', 'que je sache', 'щоб я знав'],
              ['vouloir', 'que je veuille', 'щоб я хотів'],
            ],
          },
          warning:
            'Форми nous та vous у subjonctif збігаються з imparfait: que nous parlions, que vous parliez. Це полегшує життя.',
        },
      ],
      exercises: [
        {
          id: 'm17l1e1',
          kind: 'cloze',
          prompt: 'Постав у subjonctif',
          sentence: 'Il faut que tu ___ tes devoirs. (finir)',
          answer: ['finisses'],
          translation: 'Треба, щоб ти зробив домашнє завдання.',
          options: ['finisses', 'finis', 'finiras'],
          explain: 'ils finissent → корінь finiss- → que tu finisses.',
          words: ['w_finir'],
        },
        {
          id: 'm17l1e2',
          kind: 'cloze',
          prompt: 'Неправильне дієслово',
          sentence: 'Je veux que tu ___ heureux. (être)',
          answer: ['sois'],
          translation: 'Я хочу, щоб ти був щасливий.',
          options: ['sois', 'es', 'seras', 'étais'],
          explain: 'être → que je sois, que tu sois. Треба знати напам’ять.',
          words: ['etre', 'w_heureux'],
        },
        {
          id: 'm17l1e3',
          kind: 'mcq',
          prompt: 'Звідки береться корінь?',
          question: 'prendre → subjonctif',
          options: ['З інфінітива', 'З форми ils prennent → prenn-', 'З форми nous prenons'],
          answer: 1,
          explain: 'Форма ils мінус -ent. Для imparfait — форма nous, для subjonctif — форма ils.',
          words: ['prendre'],
        },
        {
          id: 'm17l1e4',
          kind: 'type',
          prompt: 'Subjonctif від aller для «tu»',
          question: 'que tu (aller) →',
          answer: ['ailles'],
          accents: true,
          hint: 'Неправильне: aill-',
          words: ['aller'],
        },
        {
          id: 'm17l1e5',
          kind: 'cloze',
          prompt: 'Ще одне неправильне',
          sentence: 'Il faut que nous ___ attention. (faire)',
          answer: ['fassions'],
          translation: 'Треба, щоб ми були уважні.',
          options: ['fassions', 'faisons', 'ferions'],
          words: ['faire'],
        },
        {
          id: 'm17l1e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Il faut que tu viennes.',
          translation: 'Треба, щоб ти прийшов.',
          words: ['venir'],
        },
      ],
    },
    {
      id: 'm17l2',
      title: 'Коли він обов’язковий',
      subtitle: 'Список тригерів',
      minutes: 15,
      newWords: ['w_falloir', 'bien_que', 'pour_que', 'w_craindre'],
      steps: [
        {
          kind: 'grammar',
          title: 'Чотири групи тригерів',
          body: `Subjonctif не обирають «за відчуттям» — він **вимагається** певними виразами. Для B1 достатньо чотирьох груп.

**1. Необхідність і воля**
il faut que, je veux que, j'aimerais que, il est nécessaire que

**2. Емоція**
je suis content que, j'ai peur que, c'est dommage que

**3. Сумнів і заперечення**
je ne pense pas que, je doute que, il est possible que

**4. Певні сполучники**
bien que, pour que, avant que, jusqu'à ce que, à condition que`,
          table: {
            caption: 'Найпідступніша пара',
            head: ['Вираз', 'Спосіб', 'Приклад'],
            rows: [
              ['je pense que', 'indicatif', 'Je pense qu’il **est** là.'],
              ['je ne pense pas que', 'subjonctif', 'Je ne pense pas qu’il **soit** là.'],
              ['il est certain que', 'indicatif', 'Il est certain qu’il **vient**.'],
              ['il est possible que', 'subjonctif', 'Il est possible qu’il **vienne**.'],
            ],
          },
          warning:
            '⚠️ Ключ до логіки: **упевненість → indicatif, сумнів чи бажання → subjonctif**. Тому «я думаю» бере indicatif, а «я не думаю» — subjonctif.',
        },
        {
          kind: 'grammar',
          title: 'Коли subjonctif НЕ потрібен',
          body: `Якщо підмет в обох частинах **той самий**, французька уникає subjonctif і бере просто інфінітив:

*Je veux **partir**.* — Я хочу піти. (я хочу, я і піду)
*Je veux **que tu partes**.* — Я хочу, щоб ти пішов. (різні особи)

Так само:
*Il faut **travailler**.* — Треба працювати. (взагалі)
*Il faut **que tu travailles**.* — Треба, щоб ти працював.

Це збігається з українською інтуїцією: ми теж кажемо «хочу піти», а не «хочу, щоб я пішов».`,
          examples: [
            { fr: 'Je suis content que tu sois là.', uk: 'Я радий, що ти тут.' },
            { fr: 'Bien qu’il soit tard, je continue.', uk: 'Хоча вже пізно, я продовжую.' },
            { fr: 'Je ne pense pas qu’il ait raison.', uk: 'Я не думаю, що він має рацію.' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm17l2e1',
          kind: 'cloze',
          prompt: 'Після il faut que',
          sentence: 'Il faut que vous ___ patient. (être)',
          answer: ['soyez'],
          translation: 'Треба, щоб ви були терплячі.',
          options: ['soyez', 'êtes', 'serez'],
          words: ['etre'],
        },
        {
          id: 'm17l2e2',
          kind: 'mcq',
          prompt: 'Який спосіб?',
          question: 'Je pense qu’il ___ raison.',
          options: ['a (indicatif)', 'ait (subjonctif)'],
          answer: 0,
          optionsAreFrench: true,
          explain:
            '«Je pense que» виражає впевненість → indicatif. А от «je ne pense pas que» вимагало б subjonctif.',
          words: ['w_raison'],
        },
        {
          id: 'm17l2e3',
          kind: 'mcq',
          prompt: 'А тут?',
          question: 'Je ne pense pas qu’il ___ raison.',
          options: ['a (indicatif)', 'ait (subjonctif)'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Заперечення вносить сумнів → subjonctif.',
        },
        {
          id: 'm17l2e4',
          kind: 'cloze',
          prompt: 'Сполучник-тригер',
          sentence: 'Bien qu’il ___ tard, je continue. (être)',
          answer: ['soit'],
          translation: 'Хоча вже пізно, я продовжую.',
          options: ['soit', 'est', 'sera'],
          explain: 'bien que завжди тягне subjonctif.',
          words: ['bien_que'],
        },
        {
          id: 'm17l2e5',
          kind: 'mcq',
          prompt: 'Той самий підмет — що робимо?',
          question: '«Я хочу піти»',
          options: ['Je veux que je parte.', 'Je veux partir.'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Один підмет → інфінітив, без que і без subjonctif.',
        },
        {
          id: 'm17l2e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Я хочу, щоб ти прийшов.',
          answer: ['je veux que tu viennes'],
          hint: 'Різні підмети → que + subjonctif',
          words: ['vouloir', 'venir'],
        },
        {
          id: 'm17l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Je suis content que tu sois là.',
          translation: 'Я радий, що ти тут.',
        },
      ],
    },
    {
      id: 'm17l3',
      title: 'Висловити думку',
      subtitle: 'Аргументувати, погоджуватися, заперечувати',
      minutes: 14,
      newWords: [
        'lopinion',
        'largument',
        'le_point_de_vue',
        'convaincre',
        'sopposer',
        'avoir_tort',
        'dapres',
      ],
      steps: [
        {
          kind: 'grammar',
          title: 'Формули, які варто знати напам’ять',
          body: `На B1 оцінюють не лише правильність, а й **уміння оформити думку**. Ці звороти роблять половину роботи.`,
          table: {
            caption: 'Робочі формули',
            head: ['Навіщо', 'Французькою', 'Українською'],
            rows: [
              ['Своя думка', 'À mon avis… / Je pense que…', 'На мою думку…'],
              ['Обережніше', 'Il me semble que…', 'Мені здається, що…'],
              ['Згода', 'Je suis tout à fait d’accord.', 'Цілком погоджуюся.'],
              ['Часткова згода', 'C’est vrai, mais…', 'Це правда, але…'],
              ['Незгода', 'Je ne suis pas d’accord.', 'Я не згоден.'],
              [
                'Посилання',
                'D’après lui… / Selon l’article…',
                'За його словами… / Згідно зі статтею…',
              ],
              ['Приклад', 'Par exemple… / Ainsi…', 'Наприклад…'],
              ['Підсумок', 'En conclusion… / Bref…', 'На завершення…'],
            ],
          },
          warning:
            'Українці часто починають кожне речення з «Je pense que». Чергуй: à mon avis, il me semble, selon moi, j’ai l’impression que.',
        },
        {
          kind: 'dialogue',
          title: 'Суперечка про транспорт',
          setting: 'Обговорення в мовному клубі',
          lines: [
            {
              speaker: 'Prof',
              fr: 'Faut-il interdire les voitures en centre-ville ?',
              uk: 'Чи треба заборонити авто в центрі міста?',
            },
            {
              speaker: 'Maryna',
              fr: 'À mon avis, oui. D’une part, il y a moins de pollution.',
              uk: 'На мою думку, так. З одного боку, менше забруднення.',
            },
            {
              speaker: 'Marc',
              fr: 'Je ne suis pas d’accord. Bien que ce soit écologique, c’est difficile pour les commerçants.',
              uk: 'Я не згоден. Хоча це екологічно, це складно для торговців.',
            },
            {
              speaker: 'Maryna',
              fr: 'C’est vrai, mais on pourrait améliorer les transports en commun.',
              uk: 'Це правда, але можна було б покращити громадський транспорт.',
            },
            {
              speaker: 'Marc',
              fr: 'Il me semble que ce serait très cher.',
              uk: 'Мені здається, це було б дуже дорого.',
            },
            {
              speaker: 'Prof',
              fr: 'Bref, chacun a de bons arguments.',
              uk: 'Коротше, у кожного є вагомі аргументи.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm17l3e1',
          kind: 'cloze',
          prompt: 'Введи свою думку (3 слова)',
          sentence: '___ ___ ___, il faut agir maintenant.',
          answer: ['à mon avis', 'a mon avis'],
          translation: 'На мою думку, треба діяти зараз.',
          explain: 'À mon avis — найуживаніший спосіб ввести позицію.',
          words: ['w_avis'],
        },
        {
          id: 'm17l3e2',
          kind: 'mcq',
          prompt: 'Обери ввічливу незгоду',
          question: 'Як м’яко не погодитися?',
          options: ['Tu as tort.', 'Je ne suis pas tout à fait d’accord.', 'C’est faux.'],
          answer: 1,
          optionsAreFrench: true,
          explain: '«Tu as tort» звучить різко. «Pas tout à fait d’accord» — норма дискусії.',
          words: ['avoir_tort'],
        },
        {
          id: 'm17l3e3',
          kind: 'cloze',
          prompt: 'Після bien que — який спосіб?',
          sentence: 'Bien que ce ___ cher, je le prends. (être)',
          answer: ['soit'],
          translation: 'Хоча це дорого, я це беру.',
          options: ['soit', 'est', 'sera'],
          words: ['bien_que'],
        },
        {
          id: 'm17l3e4',
          kind: 'match',
          prompt: 'З’єднай формули',
          pairs: [
            { fr: 'à mon avis', uk: 'на мою думку' },
            { fr: 'je ne suis pas d’accord', uk: 'я не згоден' },
            { fr: 'd’après lui', uk: 'за його словами' },
            { fr: 'bref', uk: 'коротше кажучи' },
          ],
          words: ['w_avis', 'dapres', 'bref'],
        },
        {
          id: 'm17l3e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Мені здається, що це занадто дорого.',
          answer: ['il me semble que c’est trop cher', "il me semble que c'est trop cher"],
          words: ['w_sembler', 'w_cher'],
        },
        {
          id: 'm17l3e6',
          kind: 'speak',
          prompt: 'Вислови позицію вголос',
          text: 'À mon avis, il faut protéger l’environnement.',
          translation: 'На мою думку, треба захищати довкілля.',
          words: ['w_environnement'],
        },
        {
          id: 'm17l3e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Je ne suis pas tout à fait d’accord.',
          translation: 'Я не зовсім згоден.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm17q1',
      kind: 'cloze',
      prompt: 'Subjonctif',
      sentence: 'Il faut que tu ___ plus tôt. (partir)',
      answer: ['partes'],
      translation: 'Треба, щоб ти пішов раніше.',
      options: ['partes', 'pars', 'partiras'],
    },
    {
      id: 'm17q2',
      kind: 'mcq',
      prompt: 'Який спосіб?',
      question: 'Il est possible qu’il ___ en retard.',
      options: ['est', 'soit'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm17q3',
      kind: 'type',
      prompt: 'Subjonctif від avoir для «tu»',
      question: 'que tu (avoir) →',
      answer: ['aies'],
      accents: true,
    },
    {
      id: 'm17q4',
      kind: 'mcq',
      prompt: 'Той самий підмет',
      question: '«Треба працювати» (взагалі)',
      options: ['Il faut que je travaille.', 'Il faut travailler.'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm17q5',
      kind: 'cloze',
      prompt: 'Після сполучника',
      sentence: 'Je t’explique pour que tu ___. (comprendre)',
      answer: ['comprennes'],
      translation: 'Я пояснюю тобі, щоб ти зрозумів.',
      options: ['comprennes', 'comprends', 'comprendras'],
    },
    {
      id: 'm17q6',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Я хочу, щоб ти був щасливий.',
      answer: ['je veux que tu sois heureux', 'je veux que tu sois heureuse'],
    },
    {
      id: 'm17q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Bien qu’il soit tard, je continue.',
      translation: 'Хоча пізно, я продовжую.',
    },
    {
      id: 'm17q8',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'que je sois', uk: 'être' },
        { fr: 'que j’aie', uk: 'avoir' },
        { fr: 'que j’aille', uk: 'aller' },
        { fr: 'que je fasse', uk: 'faire' },
      ],
    },
  ],
}

/* ================================================================== *
 * Модуль 18 — Читати й переказувати
 * ================================================================== */
export const module18: Module = {
  id: 'm18',
  title: 'Читати й переказувати',
  subtitle: 'Непряма мова, gérondif і мова новин',
  grammarFocus: 'Discours indirect, gérondif, пасивний стан',
  emoji: '📰',
  lessons: [
    {
      id: 'm18l1',
      title: 'Непряма мова',
      subtitle: 'Переказати чужі слова',
      minutes: 15,
      newWords: ['declarer', 'affirmer', 'w_repondre', 'w_annoncer'],
      steps: [
        {
          kind: 'grammar',
          title: 'Що змінюється при переказі',
          body: `Коли переказуєш чужі слова, змінюються три речі: **сполучник**, **особа** і — якщо головне дієслово в минулому — **час**.

*Il dit : « Je suis fatigué. »* → *Il dit **qu'il est** fatigué.*
*Il a dit : « Je suis fatigué. »* → *Il a dit **qu'il était** fatigué.*

Українська робить простіше: «Він сказав, що втомився» — час не зсувається. Французька зсуває обов'язково.`,
          table: {
            caption: 'Зсув часів після минулого',
            head: ['Пряма мова', 'Непряма мова', 'Приклад'],
            rows: [
              ['présent', 'imparfait', '« Je pars » → qu’il partait'],
              ['passé composé', 'plus-que-parfait', '« J’ai fini » → qu’il avait fini'],
              ['futur simple', 'conditionnel', '« Je viendrai » → qu’il viendrait'],
              ['imparfait', 'imparfait (без змін)', '« Je dormais » → qu’il dormait'],
            ],
          },
          warning:
            '⚠️ Питання теж змінюють форму: « Tu viens ? » → *Il demande **si** tu viens*. А « Qu’est-ce que tu fais ? » → *Il demande **ce que** tu fais*.',
        },
      ],
      exercises: [
        {
          id: 'm18l1e1',
          kind: 'cloze',
          prompt: 'Переклади в непряму мову',
          sentence: 'Il a dit qu’il ___ fatigué. (« Je suis fatigué »)',
          answer: ['était', 'etait'],
          translation: 'Він сказав, що втомлений.',
          options: ['était', 'est', 'sera'],
          explain: 'Головне дієслово в минулому → présent зсувається в imparfait.',
          words: ['etre'],
        },
        {
          id: 'm18l1e2',
          kind: 'cloze',
          prompt: 'Зсув futur',
          sentence: 'Elle a promis qu’elle ___. (« Je viendrai »)',
          answer: ['viendrait'],
          translation: 'Вона пообіцяла, що прийде.',
          options: ['viendrait', 'viendra', 'vient'],
          explain: 'futur simple → conditionnel у непрямій мові.',
          words: ['venir', 'w_promettre'],
        },
        {
          id: 'm18l1e3',
          kind: 'cloze',
          prompt: 'Питання без питального слова',
          sentence: 'Il demande ___ tu viens. (« Tu viens ? »)',
          answer: ['si'],
          translation: 'Він питає, чи ти прийдеш.',
          options: ['si', 'que', 'ce que'],
          explain: 'Питання «так/ні» вводиться через si — як українське «чи».',
          words: ['w_demander'],
        },
        {
          id: 'm18l1e4',
          kind: 'mcq',
          prompt: 'Як переказати «Qu’est-ce que tu fais ?»',
          question: 'Il demande…',
          options: ['…que tu fais.', '…ce que tu fais.', '…qu’est-ce que tu fais.'],
          answer: 1,
          optionsAreFrench: true,
          explain: '«Qu’est-ce que» у непрямій мові стає «ce que».',
        },
        {
          id: 'm18l1e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Він сказав, що вже поїв.',
          answer: ["il a dit qu'il avait déjà mangé", "il a dit qu'il avait deja mangé"],
          hint: 'passé composé → plus-que-parfait',
          words: ['manger'],
        },
        {
          id: 'm18l1e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Elle a répondu qu’elle ne savait pas.',
          translation: 'Вона відповіла, що не знає.',
          words: ['w_repondre', 'savoir'],
        },
      ],
    },
    {
      id: 'm18l2',
      title: 'Gérondif',
      subtitle: 'Дві дії одночасно',
      minutes: 12,
      newWords: ['ecouter', 'w_marcher', 'w_sourire_v'],
      steps: [
        {
          kind: 'grammar',
          title: 'en + форма -ant',
          body: `Українською ми маємо дієприслівник: «читаючи», «йдучи», «усміхаючись». Французький відповідник — **gérondif**:

> **en** + корінь форми **nous** + **-ant**

*nous parlons* → **en parlant** (говорячи)
*nous finissons* → **en finissant** (закінчуючи)

Три винятки: *être → **en étant**, avoir → **en ayant**, savoir → **en sachant***.

Gérondif виражає:
• **одночасність**: *Il mange **en regardant** la télé.* — Він їсть, дивлячись телевізор.
• **спосіб**: *On apprend **en pratiquant**.* — Вчаться, практикуючись.
• **умову**: ***En travaillant** plus, tu réussiras.* — Працюючи більше, ти досягнеш успіху.`,
          warning:
            '⚠️ Головне обмеження: підмет обох дій має бути **той самий**. «Він їсть, дивлячись телевізор» — можна. «Він їсть, поки дружина готує» — gérondif не підходить, потрібне «pendant que».',
        },
      ],
      exercises: [
        {
          id: 'm18l2e1',
          kind: 'cloze',
          prompt: 'Утвори gérondif',
          sentence: 'Il mange ___ ___ la télé. (regarder)',
          answer: ['en regardant'],
          translation: 'Він їсть, дивлячись телевізор.',
          hint: 'en + основа + -ant',
          words: ['regarder'],
        },
        {
          id: 'm18l2e2',
          kind: 'type',
          prompt: 'Gérondif від finir',
          question: 'finir → gérondif',
          answer: ['en finissant'],
          accents: true,
          hint: 'nous finissons → finiss-',
          words: ['w_finir'],
        },
        {
          id: 'm18l2e3',
          kind: 'mcq',
          prompt: 'Виняток',
          question: 'être → gérondif',
          options: ['en étant', 'en êtant', 'en essant'],
          answer: 0,
          optionsAreFrench: true,
          explain: 'Три винятки: en étant, en ayant, en sachant.',
        },
        {
          id: 'm18l2e4',
          kind: 'mcq',
          prompt: 'Чи можна тут gérondif?',
          question: '«Він читає, поки дружина готує»',
          options: ['Так, gérondif підходить', 'Ні — різні підмети, потрібне «pendant que»'],
          answer: 1,
          explain: 'Gérondif вимагає спільного підмета для обох дій.',
        },
        {
          id: 'm18l2e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Вона працює, слухаючи музику.',
          answer: [
            'elle travaille en écoutant de la musique',
            'elle travaille en écoutant la musique',
          ],
          words: ['travailler', 'ecouter', 'w_musique'],
        },
        {
          id: 'm18l2e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'On apprend en pratiquant.',
          translation: 'Вчаться, практикуючись.',
          words: ['w_apprendre'],
        },
      ],
    },
    {
      id: 'm18l3',
      title: 'Мова новин',
      subtitle: 'Пасивний стан і читання преси',
      minutes: 15,
      newWords: [
        'la_presse',
        'lactualite',
        'larticle',
        'levenement',
        'la_greve',
        'la_manifestation',
        'lenquete',
        'le_fait',
      ],
      steps: [
        {
          kind: 'grammar',
          title: 'Пасивний стан',
          body: `Новини рясніють пасивом, бо важлива подія, а не той, хто її зробив.

> **être** (у потрібному часі) + **дієприкметник** (узгоджений з підметом)

*Le président **a été élu**.* — Президента обрано.
*La loi **sera votée** demain.* — Закон ухвалять завтра.
*Les résultats **sont publiés**.* — Результати опубліковано.

Виконавця, якщо він потрібен, вводять через **par**:
*Le livre **a été écrit par** Camus.*

Українська часто обходиться безособовою формою («обрано», «опубліковано»), і це найзручніший спосіб перекладу.`,
          table: {
            caption: 'Активний → пасивний',
            head: ['Активний', 'Пасивний', 'Українською'],
            rows: [
              ['On a élu le président.', 'Le président a été élu.', 'Президента обрано.'],
              ['On publie les résultats.', 'Les résultats sont publiés.', 'Результати публікують.'],
              ['On construira le pont.', 'Le pont sera construit.', 'Міст збудують.'],
            ],
          },
          warning:
            'У розмовній мові французи частіше уникають пасиву й кажуть **on**: «On a élu le président». Пасив — ознака письмового стилю та новин.',
        },
        {
          kind: 'dialogue',
          title: 'Уривок новин',
          setting: 'Ранковий радіовипуск',
          lines: [
            {
              speaker: 'Journaliste',
              fr: 'Bonjour. Voici les titres de l’actualité.',
              uk: 'Доброго ранку. Ось головні новини.',
            },
            {
              speaker: 'Journaliste',
              fr: 'Une grève a été annoncée dans les transports pour jeudi.',
              uk: 'На четвер оголошено страйк на транспорті.',
            },
            {
              speaker: 'Journaliste',
              fr: 'Selon les syndicats, plus de dix mille personnes manifesteront.',
              uk: 'За даними профспілок, вийде понад десять тисяч людей.',
            },
            {
              speaker: 'Journaliste',
              fr: 'Le gouvernement affirme qu’il est prêt à discuter.',
              uk: 'Уряд заявляє, що готовий до переговорів.',
            },
            {
              speaker: 'Journaliste',
              fr: 'Une enquête sera ouverte sur les causes de l’accident.',
              uk: 'Буде відкрито розслідування причин аварії.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm18l3e1',
          kind: 'cloze',
          prompt: 'Пасивний стан',
          sentence: 'Le président ___ ___ élu hier.',
          answer: ['a été', 'a ete'],
          translation: 'Президента обрано вчора.',
          hint: 'avoir + été',
          explain: 'Пасив у passé composé: a été + дієприкметник.',
          words: ['w_president'],
        },
        {
          id: 'm18l3e2',
          kind: 'cloze',
          prompt: 'Узгодження',
          sentence: 'La loi ___ votée demain. (être, futur)',
          answer: ['sera'],
          translation: 'Закон ухвалять завтра.',
          options: ['sera', 'est', 'a été'],
          explain: 'Futur simple від être → sera. Дієприкметник узгоджується: votée (жін. рід).',
          words: ['w_loi'],
        },
        {
          id: 'm18l3e3',
          kind: 'mcq',
          prompt: 'Як увести виконавця?',
          question: 'Le livre a été écrit ___ Camus.',
          options: ['par', 'de', 'pour'],
          answer: 0,
          optionsAreFrench: true,
          explain: 'Виконавець дії вводиться прийменником par.',
        },
        {
          id: 'm18l3e4',
          kind: 'mcq',
          prompt: 'Розмовний варіант',
          question: 'Як сказати те саме простіше за «Le président a été élu»?',
          options: ['On a élu le président.', 'Le président est élu par on.'],
          answer: 0,
          optionsAreFrench: true,
          explain: 'У розмові пасив зазвичай замінюють на on.',
        },
        {
          id: 'm18l3e5',
          kind: 'match',
          prompt: 'З’єднай слова новин',
          pairs: [
            { fr: 'la grève', uk: 'страйк' },
            { fr: 'l’enquête', uk: 'розслідування' },
            { fr: 'l’événement', uk: 'подія' },
            { fr: 'la manifestation', uk: 'демонстрація' },
          ],
          words: ['la_greve', 'lenquete', 'levenement', 'la_manifestation'],
        },
        {
          id: 'm18l3e6',
          kind: 'listen',
          prompt: 'Що оголосили?',
          audioText: 'Une grève a été annoncée dans les transports.',
          options: [
            'Оголошено страйк на транспорті',
            'Транспорт працюватиме як завжди',
            'Розслідування завершено',
          ],
          answer: 0,
          words: ['la_greve'],
        },
        {
          id: 'm18l3e7',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Розслідування буде відкрито.',
          answer: ['une enquête sera ouverte', "l'enquête sera ouverte"],
          words: ['lenquete'],
        },
        {
          id: 'm18l3e8',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Les résultats seront publiés demain.',
          translation: 'Результати опублікують завтра.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm18q1',
      kind: 'cloze',
      prompt: 'Непряма мова',
      sentence: 'Il a dit qu’il ___ malade. (« Je suis malade »)',
      answer: ['était', 'etait'],
      translation: 'Він сказав, що хворий.',
      options: ['était', 'est', 'sera'],
    },
    {
      id: 'm18q2',
      kind: 'cloze',
      prompt: 'Питання',
      sentence: 'Elle demande ___ tu as fini.',
      answer: ['si'],
      translation: 'Вона питає, чи ти закінчив.',
      options: ['si', 'que', 'ce que'],
    },
    {
      id: 'm18q3',
      kind: 'type',
      prompt: 'Gérondif від savoir',
      question: 'savoir → gérondif',
      answer: ['en sachant'],
      accents: true,
    },
    {
      id: 'm18q4',
      kind: 'cloze',
      prompt: 'Пасив',
      sentence: 'Le pont ___ construit en 1990.',
      answer: ['a été', 'a ete'],
      translation: 'Міст збудували у 1990-му.',
    },
    {
      id: 'm18q5',
      kind: 'mcq',
      prompt: 'Одночасність',
      question: '«Він співає, готуючи вечерю»',
      options: ['Il chante en préparant le dîner.', 'Il chante pendant que préparant le dîner.'],
      answer: 0,
      optionsAreFrench: true,
    },
    {
      id: 'm18q6',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Вона сказала, що прийде.',
      answer: ["elle a dit qu'elle viendrait"],
    },
    {
      id: 'm18q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Une enquête a été ouverte.',
      translation: 'Розслідування було відкрито.',
    },
    {
      id: 'm18q8',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'la presse', uk: 'преса' },
        { fr: 'l’actualité', uk: 'новини' },
        { fr: 'le fait', uk: 'факт' },
        { fr: 'le débat', uk: 'дискусія' },
      ],
    },
  ],
}
