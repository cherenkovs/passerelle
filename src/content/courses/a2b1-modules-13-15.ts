import type { Module } from '../types'

/* ================================================================== *
 * Модуль 13 — Минуле, яке тривало
 * ================================================================== */
export const module13: Module = {
  id: 'm13',
  title: 'Минуле, яке тривало',
  subtitle: 'Imparfait і головна перевага українця',
  grammarFocus: 'Imparfait, протиставлення з passé composé, plus-que-parfait',
  emoji: '🎞️',
  lessons: [
    {
      id: 'm13l1',
      title: 'Imparfait: форма',
      subtitle: 'Одне правило, один виняток',
      minutes: 15,
      newWords: ['w_vivre', 'paraitre', 'w_sembler', 'w_habitude'],
      steps: [
        {
          kind: 'intro',
          title: 'Твоя рідна мова тут дає фору',
          body: `Англомовні студенти мучаться з imparfait місяцями. Українцям простіше — бо в нас **уже є** те, чого немає в англійській: **вид дієслова**.

«Я **читав** книгу» і «Я **прочитав** книгу» — для тебе це очевидно різні речі. Французька робить те саме, тільки не суфіксами, а двома різними часами:

• **imparfait** ≈ недоконаний вид: *читав, робив, жив*
• **passé composé** ≈ доконаний вид: *прочитав, зробив, прожив*

Це не стовідсоткове правило, але воно працює в переважній більшості випадків — і це найкоротший шлях до відчуття, якого англомовні досягають роками.`,
        },
        {
          kind: 'grammar',
          title: 'Як утворити imparfait',
          body: `Механіка приємно передбачувана. Береш форму **nous** у теперішньому часі, відкидаєш **-ons** і додаєш закінчення.

*nous **parl**ons* → корінь **parl-**
*nous **finiss**ons* → корінь **finiss-**
*nous **pren**ons* → корінь **pren-**

Це працює **для всіх дієслів без винятку**, навіть неправильних. Саме тому imparfait вважають найлегшим часом французької.`,
          table: {
            caption: 'parler в imparfait',
            head: ['Особа', 'Форма', 'Вимова', 'Українською'],
            rows: [
              ['je', 'parlais', '[paʁ.lɛ]', 'я говорив'],
              ['tu', 'parlais', '[paʁ.lɛ]', 'ти говорив'],
              ['il / elle', 'parlait', '[paʁ.lɛ]', 'він говорив'],
              ['nous', 'parlions', '[paʁ.ljɔ̃]', 'ми говорили'],
              ['vous', 'parliez', '[paʁ.lje]', 'ви говорили'],
              ['ils / elles', 'parlaient', '[paʁ.lɛ]', 'вони говорили'],
            ],
          },
          warning:
            '⚠️ Чотири форми — parlais, parlais, parlait, parlaient — звучать ОДНАКОВО: [paʁ.lɛ]. Як і в теперішньому часі, розрізняє їх лише займенник.',
        },
        {
          kind: 'grammar',
          title: 'Єдиний виняток у мові',
          body: `**être** — одне-єдине дієслово, чий корінь не виводиться з форми nous. Його корінь — **ét-**.

*j'**ét**ais, tu **ét**ais, il **ét**ait, nous **ét**ions, vous **ét**iez, ils **ét**aient*

Більше винятків немає. Жодного.

Дуже частий зворот — **il y avait** («було, існувало»), imparfait від *il y a*:
*Il y **avait** beaucoup de monde.* — Було багато людей.`,
          examples: [
            {
              fr: "Quand j'étais petit, j'habitais à Lviv.",
              uk: 'Коли я був малий, я жив у Львові.',
            },
            { fr: 'Il faisait froid et il pleuvait.', uk: 'Було холодно, і йшов дощ.' },
            { fr: 'Nous allions à la mer chaque été.', uk: 'Ми їздили на море щоліта.' },
            { fr: 'Il y avait un café au coin de la rue.', uk: 'На розі вулиці було кафе.' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm13l1e1',
          kind: 'cloze',
          prompt: 'Постав дієслово в imparfait',
          sentence: 'Quand j’étais petit, je ___ beaucoup. (jouer)',
          answer: ['jouais'],
          translation: 'Коли я був малий, я багато грався.',
          options: ['jouais', 'jouait', 'jouions', 'jouaient'],
          explain: 'je → закінчення -ais. Корінь від nous jouons → jou-.',
          words: ['w_jouer'],
        },
        {
          id: 'm13l1e2',
          kind: 'cloze',
          prompt: 'Виняток!',
          sentence: 'Nous ___ très fatigués. (être)',
          answer: ['étions', 'etions'],
          translation: 'Ми були дуже втомлені.',
          options: ['étions', 'étaient', 'sommes', 'avions'],
          explain: 'être — єдине дієслово з особливим коренем ét-. nous étions.',
          words: ['etre'],
        },
        {
          id: 'm13l1e3',
          kind: 'mcq',
          prompt: 'Звідки береться корінь imparfait?',
          question: 'prendre → imparfait',
          options: [
            'З інфінітива: prendr-',
            'З форми nous prenons: pren-',
            'З форми je prends: prend-',
          ],
          answer: 1,
          explain: 'Завжди з форми nous теперішнього часу, мінус -ons. nous prenons → je prenais.',
          words: ['prendre'],
        },
        {
          id: 'm13l1e4',
          kind: 'type',
          prompt: 'Постав faire в imparfait для «il»',
          question: 'il (faire) → imparfait',
          answer: ['faisait'],
          accents: true,
          hint: 'nous faisons → корінь fais-',
          explain: 'il faisait [fə.zɛ]. Зверни увагу: ai тут читається як [ə].',
          words: ['faire'],
        },
        {
          id: 'm13l1e5',
          kind: 'listen',
          prompt: 'Скільки різних форм ти чуєш?',
          audioText: 'je parlais, tu parlais, il parlait, ils parlaient',
          options: ['Чотири різні', 'Усі однакові — [paʁ.lɛ]', 'Дві різні'],
          answer: 1,
          explain:
            'Класична пастка французької: чотири написання, один звук. Рятує лише займенник.',
          words: ['parler'],
        },
        {
          id: 'm13l1e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Коли я був малий, я жив у Києві.',
          answer: [
            "quand j'étais petit, j'habitais à kyiv",
            "quand j'étais petite, j'habitais à kyiv",
            "quand j'etais petit, j'habitais à kyiv",
          ],
          hint: 'Обидва дієслова в imparfait',
          words: ['habiter', 'etre'],
        },
        {
          id: 'm13l1e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Il y avait beaucoup de monde.',
          translation: 'Було багато людей.',
          explain: 'il y avait — imparfait від il y a. Дуже частий зворот.',
          words: ['il_y_a'],
        },
      ],
    },
    {
      id: 'm13l2',
      title: 'Тло і подія',
      subtitle: 'Imparfait проти passé composé',
      minutes: 16,
      newWords: ['w_soudain', 'w_tout_a_coup', 'w_pendant', 'toujours'],
      steps: [
        {
          kind: 'grammar',
          title: 'Декорація і те, що сталося',
          body: `Уяви сцену у фільмі. **Imparfait** — це декорація: погода, настрій, що тривало. **Passé composé** — це те, що врізалося в кадр і сталося.

> *Il **pleuvait** (тло) quand le téléphone **a sonné** (подія).*
> Йшов дощ, коли задзвонив телефон.

Українською ти відчуваєш це видом: «йшов» — недоконаний, «задзвонив» — доконаний. Довірся цьому відчуттю: воно тебе майже не підведе.`,
          table: {
            caption: 'Що яким часом',
            head: ['Imparfait — тло', 'Passé composé — подія'],
            rows: [
              ['Опис: погода, вік, настрій', 'Одноразова завершена дія'],
              ['Звичка, повторення: «щодня»', 'Послідовність подій'],
              ['Дія, що тривала', 'Дія, що перервала іншу'],
              ['«робив, читав, жив»', '«зробив, прочитав, прожив»'],
            ],
          },
          warning:
            'Слова-підказки: **imparfait** тягнуть souvent, toujours, chaque jour, d’habitude. **Passé composé** — soudain, tout à coup, hier, une fois.',
        },
        {
          kind: 'grammar',
          title: 'Одне дієслово, два змісти',
          body: `Іноді вибір часу повністю змінює зміст — і українською це знову видно через вид.`,
          examples: [
            { fr: 'Je **savais** la réponse.', uk: 'Я знав відповідь. (стан)' },
            { fr: "J'**ai su** la réponse.", uk: 'Я дізнався відповідь. (момент)' },
            { fr: 'Il **voulait** partir.', uk: 'Він хотів піти. (бажання тривало)' },
            { fr: 'Il **a voulu** partir.', uk: 'Він захотів піти (і спробував).' },
            { fr: 'Elle **connaissait** Paul.', uk: 'Вона знала Поля.' },
            { fr: 'Elle **a connu** Paul en 2020.', uk: 'Вона познайомилася з Полем у 2020-му.' },
          ],
        },
        {
          kind: 'dialogue',
          title: 'Що сталося вчора',
          setting: 'Двоє колег у понеділок вранці',
          lines: [
            { speaker: 'Léa', fr: 'Tu as passé un bon week-end ?', uk: 'Гарно провів вихідні?' },
            {
              speaker: 'Marc',
              fr: 'Bof. Samedi, il pleuvait, alors je suis resté à la maison.',
              uk: 'Так собі. У суботу йшов дощ, тож я лишився вдома.',
            },
            { speaker: 'Léa', fr: "Et qu'est-ce que tu as fait ?", uk: 'І що ти робив?' },
            {
              speaker: 'Marc',
              fr: 'Je lisais tranquillement, et puis mon frère est arrivé sans prévenir.',
              uk: 'Я спокійно читав, а потім без попередження приїхав мій брат.',
            },
            { speaker: 'Léa', fr: 'Ah bon ! Vous êtes sortis ?', uk: 'Он як! Ви кудись пішли?' },
            {
              speaker: 'Marc',
              fr: 'Oui, on a dîné dans un petit restaurant qui venait d’ouvrir.',
              uk: 'Так, ми повечеряли в маленькому ресторані, який щойно відкрився.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm13l2e1',
          kind: 'cloze',
          prompt: 'Тло чи подія?',
          sentence: 'Il ___ quand le téléphone a sonné. (dormir)',
          answer: ['dormait'],
          translation: 'Він спав, коли задзвонив телефон.',
          options: ['dormait', 'a dormi'],
          explain: 'Сон тривав — це тло → imparfait. Дзвінок його перервав → passé composé.',
          words: ['dormir'],
        },
        {
          id: 'm13l2e2',
          kind: 'cloze',
          prompt: 'А тут?',
          sentence: 'Hier, j’___ un très bon film. (voir)',
          answer: ['ai vu'],
          translation: 'Учора я подивився дуже хороший фільм.',
          options: ['ai vu', 'voyais'],
          explain:
            '«Учора» + одноразова завершена дія → passé composé. Українською: «подивився», доконаний.',
          words: ['w_voir'],
        },
        {
          id: 'm13l2e3',
          kind: 'mcq',
          prompt: 'Що означає ця фраза?',
          question: "J'ai su la vérité.",
          options: ['Я знав правду', 'Я дізнався правду'],
          answer: 1,
          explain: 'savoir у passé composé = момент дізнавання. «Я знав» було б «je savais».',
          words: ['savoir'],
        },
        {
          id: 'm13l2e4',
          kind: 'mcq',
          prompt: 'Яке слово підказує imparfait?',
          question: 'Оберіть маркер звички',
          options: ['soudain', 'chaque jour', 'une fois'],
          answer: 1,
          explain:
            '«Щодня» — повторювана дія → imparfait. soudain і une fois тягнуть passé composé.',
        },
        {
          id: 'm13l2e5',
          kind: 'wordbank',
          prompt: 'Збери речення',
          question: 'Було холодно, тож ми залишилися вдома.',
          answer: 'Il faisait froid, alors nous sommes restés à la maison.',
          distractors: ['a fait', 'restions'],
          explain: 'Погода — тло (imparfait), рішення залишитися — подія (passé composé).',
          words: ['w_rester', 'w_froid'],
        },
        {
          id: 'm13l2e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Я читав, коли вона подзвонила.',
          answer: ['je lisais quand elle a téléphoné', 'je lisais quand elle a appelé'],
          hint: 'Тривало → imparfait; перервало → passé composé',
          words: ['lire', 'w_telephoner'],
        },
        {
          id: 'm13l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Nous regardions la télé quand il est arrivé.',
          translation: 'Ми дивилися телевізор, коли він прийшов.',
          words: ['regarder', 'w_arriver'],
        },
      ],
    },
    {
      id: 'm13l3',
      title: 'Ще раніше',
      subtitle: 'Plus-que-parfait',
      minutes: 13,
      newWords: ['w_oublier', 'w_deja', 'w_avant'],
      steps: [
        {
          kind: 'grammar',
          title: 'Минуле перед минулим',
          body: `Коли одна минула подія сталася **раніше** за іншу минулу, для давнішої беруть **plus-que-parfait**.

> **avoir / être в imparfait** + дієприкметник

*Quand je suis arrivé, il **était** déjà **parti**.*
Коли я прийшов, він уже пішов.

Логіка та сама, що в українському «вже пішов» — тільки французька позначає це окремим часом, а не словом «вже».

Допоміжне дієслово вибирається так само, як у passé composé: дієслова руху й зворотні беруть **être**, решта — **avoir**.`,
          table: {
            caption: 'Три минулі часи поруч',
            head: ['Час', 'Приклад', 'Українською'],
            rows: [
              ['imparfait', 'il mangeait', 'він їв (тривало)'],
              ['passé composé', 'il a mangé', 'він поїв (сталося)'],
              ['plus-que-parfait', 'il avait mangé', 'він (уже) поїв раніше'],
            ],
          },
          warning:
            'Дуже вживане у розповідях і в непрямій мові. Без нього переказ «він сказав, що вже зробив» звучить неприродно.',
        },
      ],
      exercises: [
        {
          id: 'm13l3e1',
          kind: 'cloze',
          prompt: 'Постав у plus-que-parfait',
          sentence: 'Quand je suis arrivé, il ___ déjà parti.',
          answer: ['était', 'etait'],
          translation: 'Коли я прийшов, він уже пішов.',
          options: ['était', 'avait', 'est', 'a'],
          explain: 'partir — дієслово руху → бере être, а воно стоїть в imparfait: était parti.',
          words: ['w_partir'],
        },
        {
          id: 'm13l3e2',
          kind: 'cloze',
          prompt: 'Допоміжне дієслово?',
          sentence: 'Elle a dit qu’elle ___ oublié son passeport.',
          answer: ['avait'],
          translation: 'Вона сказала, що забула паспорт.',
          options: ['avait', 'était', 'a', 'est'],
          explain: 'oublier — звичайне дієслово → avoir, в imparfait: avait oublié.',
          words: ['w_oublier'],
        },
        {
          id: 'm13l3e3',
          kind: 'mcq',
          prompt: 'Що сталося першим?',
          question: 'Quand nous sommes entrés, le film avait commencé.',
          options: ['Ми увійшли, потім почався фільм', 'Фільм почався раніше, ніж ми увійшли'],
          answer: 1,
          explain: 'Plus-que-parfait завжди позначає давнішу подію. Фільм уже йшов.',
          words: ['w_commencer'],
        },
        {
          id: 'm13l3e4',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Він сказав, що вже поїв.',
          answer: ["il a dit qu'il avait déjà mangé", "il a dit qu'il avait deja mangé"],
          hint: 'plus-que-parfait: avait + дієприкметник',
          words: ['manger', 'w_deja'],
        },
        {
          id: 'm13l3e5',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Nous étions déjà partis.',
          translation: 'Ми вже пішли.',
        },
        {
          id: 'm13l3e6',
          kind: 'wordbank',
          prompt: 'Збери речення',
          question: 'Коли вона прийшла, я вже все зробив.',
          answer: "Quand elle est arrivée, j'avais déjà tout fait.",
          distractors: ['ai', 'était'],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm13q1',
      kind: 'cloze',
      prompt: 'Imparfait',
      sentence: 'Quand nous ___ jeunes, nous voyagions beaucoup. (être)',
      answer: ['étions', 'etions'],
      translation: 'Коли ми були молоді, ми багато подорожували.',
      options: ['étions', 'étaient', 'avons été'],
    },
    {
      id: 'm13q2',
      kind: 'mcq',
      prompt: 'Тло чи подія?',
      question: 'Il faisait beau, alors nous ___ au parc.',
      options: ['allions', 'sommes allés'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm13q3',
      kind: 'type',
      prompt: 'Imparfait для «vous»',
      question: 'vous (faire) → imparfait',
      answer: ['faisiez'],
      accents: true,
    },
    {
      id: 'm13q4',
      kind: 'mcq',
      prompt: 'Що це означає?',
      question: 'Elle a connu Marc en 2019.',
      options: ['Вона знала Марка у 2019', 'Вона познайомилася з Марком у 2019'],
      answer: 1,
    },
    {
      id: 'm13q5',
      kind: 'cloze',
      prompt: 'Plus-que-parfait',
      sentence: 'Il m’a dit qu’il ___ vu ce film.',
      answer: ['avait'],
      translation: 'Він сказав мені, що бачив цей фільм.',
      options: ['avait', 'était', 'a'],
    },
    {
      id: 'm13q6',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Я спав, коли ти подзвонив.',
      answer: ['je dormais quand tu as téléphoné', 'je dormais quand tu as appelé'],
    },
    {
      id: 'm13q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Il pleuvait quand je suis sorti.',
      translation: 'Йшов дощ, коли я вийшов.',
    },
    {
      id: 'm13q8',
      kind: 'match',
      prompt: 'З’єднай час зі значенням',
      pairs: [
        { fr: 'il mangeait', uk: 'він їв (тривало)' },
        { fr: 'il a mangé', uk: 'він поїв' },
        { fr: 'il avait mangé', uk: 'він поїв раніше' },
        { fr: 'il mange', uk: 'він їсть' },
      ],
    },
  ],
}

/* ================================================================== *
 * Модуль 14 — Займенники, які скорочують мову
 * ================================================================== */
export const module14: Module = {
  id: 'm14',
  title: 'Займенники, які скорочують мову',
  subtitle: 'Не повторювати те, що вже сказано',
  grammarFocus: 'Прямий і непрямий додаток, y та en, порядок займенників',
  emoji: '🔗',
  lessons: [
    {
      id: 'm14l1',
      title: 'Прямий додаток',
      subtitle: 'le, la, les',
      minutes: 14,
      newWords: ['w_connaitre', 'w_attendre', 'w_chercher'],
      steps: [
        {
          kind: 'grammar',
          title: 'Головна відмінність від української',
          body: `В українській додаток стоїть після дієслова: «Я бачу **його**». У французькій — **перед** дієсловом:

> *Je **le** vois.* — Я його бачу.

Це найчастіша помилка на цьому рівні: сказати «je vois le» замість «je le vois».

**Прямий додаток** — той, що відповідає на питання «кого? що?» без прийменника.`,
          table: {
            caption: 'Прямий додаток (COD)',
            head: ['Замість', 'Займенник', 'Приклад'],
            rows: [
              ['чол. рід однини', 'le / l’', 'Je **le** connais.'],
              ['жін. рід однини', 'la / l’', 'Je **la** connais.'],
              ['множина', 'les', 'Je **les** connais.'],
              ['мене / тебе', 'me / te', 'Il **me** voit.'],
              ['нас / вас', 'nous / vous', 'Il **nous** voit.'],
            ],
          },
          warning:
            '⚠️ У запереченні займенник залишається біля дієслова, а ne стоїть перед ним: «Je **ne le** vois **pas**».',
        },
        {
          kind: 'grammar',
          title: 'Дві деталі, які помітно все змінюють',
          body: `**1. Перед голосною** le та la скорочуються:
*Je **l'**aime.* — Я його/її люблю.

**2. У passé composé** дієприкметник **узгоджується** з прямим додатком, що стоїть попереду:
*J'ai vu **la** voiture* → *Je **l'**ai **vue**.*
*J'ai vu **les** films* → *Je **les** ai **vus**.*

Це чути рідко, але на письмі помилка одразу видно.`,
          examples: [
            {
              fr: '— Tu connais Marie ? — Oui, je la connais.',
              uk: '— Ти знаєш Марі? — Так, я її знаю.',
            },
            {
              fr: '— Tu as fini le livre ? — Oui, je l’ai fini.',
              uk: '— Ти дочитав книгу? — Так, дочитав.',
            },
            { fr: 'Je ne les comprends pas.', uk: 'Я їх не розумію.' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm14l1e1',
          kind: 'cloze',
          prompt: 'Заміни «Marie» займенником',
          sentence: 'Je ___ connais bien.',
          answer: ['la'],
          translation: 'Я її добре знаю.',
          options: ['le', 'la', 'les', 'lui'],
          explain: 'Marie — жіночий рід, прямий додаток → la. І стоїть ПЕРЕД дієсловом.',
          words: ['w_connaitre'],
        },
        {
          id: 'm14l1e2',
          kind: 'mcq',
          prompt: 'Знайди правильний порядок',
          question: '«Я його бачу»',
          options: ['Je vois le.', 'Je le vois.', 'Le je vois.'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Займенник завжди перед дієсловом — на відміну від української.',
          words: ['w_voir'],
        },
        {
          id: 'm14l1e3',
          kind: 'cloze',
          prompt: 'Заперечення із займенником',
          sentence: 'Je ne ___ comprends pas.',
          answer: ['les'],
          translation: 'Я їх не розумію.',
          options: ['les', 'leur', 'y'],
          explain: 'Порядок жорсткий: ne + займенник + дієслово + pas.',
          words: ['comprendre'],
        },
        {
          id: 'm14l1e4',
          kind: 'mcq',
          prompt: 'Узгодження дієприкметника',
          question: 'J’ai vu la voiture → Je l’ai…',
          options: ['vu', 'vue', 'vues'],
          answer: 1,
          optionsAreFrench: true,
          explain:
            'Прямий додаток (la voiture, жін. рід) стоїть попереду → дієприкметник додає -e: vue.',
        },
        {
          id: 'm14l1e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Я його чекаю.',
          answer: ["je l'attends", 'je lattends'],
          hint: 'attendre + скорочення перед голосною',
          words: ['w_attendre'],
        },
        {
          id: 'm14l1e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Je ne le connais pas.',
          translation: 'Я його не знаю.',
          words: ['w_connaitre'],
        },
      ],
    },
    {
      id: 'm14l2',
      title: 'Непрямий додаток, y та en',
      subtitle: 'lui, leur — і два універсальні замінники',
      minutes: 15,
      newWords: ['w_telephoner', 'w_repondre', 'w_offrir'],
      steps: [
        {
          kind: 'grammar',
          title: 'Кому? — lui та leur',
          body: `**Непрямий додаток** відповідає на питання «кому?» і в французькій вводиться прийменником **à**.

*Je parle **à Marie*** → *Je **lui** parle.*
*Je parle **aux enfants*** → *Je **leur** parle.*

Найважливіше: **lui** — і «йому», і «їй». Рід не показується взагалі.`,
          table: {
            caption: 'Непрямий додаток (COI)',
            head: ['Кому', 'Займенник', 'Приклад'],
            rows: [
              ['мені / тобі', 'me / te', 'Il **me** parle.'],
              ['йому / їй', 'lui', 'Je **lui** téléphone.'],
              ['нам / вам', 'nous / vous', 'Il **nous** répond.'],
              ['їм', 'leur', 'Je **leur** écris.'],
            ],
          },
          warning:
            '⚠️ Дієслова, які в українській вимагають знахідного, у французькій можуть вимагати à — і навпаки. téléphoner À quelqu’un, але attendre quelqu’un (без прийменника).',
        },
        {
          kind: 'grammar',
          title: 'y та en — два робочі конячки',
          body: `**y** замінює місце або конструкцію з **à**:
*Je vais **à Paris*** → *J'**y** vais.*
*Je pense **à mon travail*** → *J'**y** pense.*

**en** замінює конструкцію з **de** або кількість:
*Je viens **de Lyon*** → *J'**en** viens.*
*J'ai **trois** frères* → *J'**en** ai trois.*

Українською ми в таких випадках просто нічого не кажемо — і це головна пастка. «— Скільки в тебе братів? — Троє.» Французькою обов'язково: «— J'**en** ai trois.»`,
          examples: [
            { fr: '— Tu vas au marché ? — Oui, j’y vais.', uk: '— Ти йдеш на ринок? — Так, іду.' },
            {
              fr: '— Tu as des questions ? — Oui, j’en ai une.',
              uk: '— У тебе є питання? — Так, одне.',
            },
            { fr: 'Il y pense souvent.', uk: 'Він часто про це думає.' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm14l2e1',
          kind: 'cloze',
          prompt: 'Заміни «à Marie»',
          sentence: 'Je ___ téléphone ce soir.',
          answer: ['lui'],
          translation: 'Я їй подзвоню сьогодні ввечері.',
          options: ['la', 'lui', 'leur', 'y'],
          explain: 'téléphoner à quelqu’un → непрямий додаток → lui (і «йому», і «їй»).',
          words: ['w_telephoner'],
        },
        {
          id: 'm14l2e2',
          kind: 'cloze',
          prompt: 'Заміни «aux enfants»',
          sentence: 'Elle ___ raconte une histoire.',
          answer: ['leur'],
          translation: 'Вона розповідає їм історію.',
          options: ['les', 'leur', 'lui', 'en'],
          words: ['w_raconter'],
        },
        {
          id: 'm14l2e3',
          kind: 'cloze',
          prompt: 'Місце → який займенник?',
          sentence: '— Tu vas à la gare ? — Oui, j’___ vais.',
          answer: ['y'],
          translation: '— Ти йдеш на вокзал? — Так, іду.',
          options: ['y', 'en', 'le'],
          explain: 'y замінює місце й конструкції з à.',
          words: ['la_gare'],
        },
        {
          id: 'm14l2e4',
          kind: 'cloze',
          prompt: 'Кількість → який займенник?',
          sentence: '— Tu as des frères ? — Oui, j’___ ai deux.',
          answer: ['en'],
          translation: '— У тебе є брати? — Так, двоє.',
          options: ['y', 'en', 'les'],
          explain:
            'en замінює кількість і конструкції з de. Українською ми його просто не вимовляємо.',
          words: ['le_frere'],
        },
        {
          id: 'm14l2e5',
          kind: 'mcq',
          prompt: 'Що не так?',
          question: '— Tu as des questions ? — Oui, j’ai deux.',
          options: ['Усе правильно', 'Бракує en: j’en ai deux'],
          answer: 1,
          explain: 'Французьке дієслово не можна лишати без доповнення — потрібне en.',
        },
        {
          id: 'm14l2e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Я їм пишу щотижня.',
          answer: ['je leur écris chaque semaine', 'je leur ecris chaque semaine'],
          words: ['ecrire', 'la_semaine'],
        },
        {
          id: 'm14l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: "J'y pense souvent.",
          translation: 'Я часто про це думаю.',
        },
      ],
    },
    {
      id: 'm14l3',
      title: 'Коли займенників кілька',
      subtitle: 'Порядок і наказовий спосіб',
      minutes: 13,
      newWords: ['w_donner', 'w_preter', 'w_montrer'],
      steps: [
        {
          kind: 'grammar',
          title: 'Жорсткий порядок',
          body: `Якщо займенників два, вони шикуються в суворій послідовності. Її просто вчать напам'ять:

> **me / te / se / nous / vous** → **le / la / les** → **lui / leur** → **y** → **en**

*Il **me le** donne.* — Він мені його дає.
*Je **le lui** ai dit.* — Я йому це сказав.
*Il **y en** a trois.* — Їх там три.

Зверни увагу: «me le», але «le lui» — порядок змінюється залежно від того, які саме займенники зустрілися.`,
          table: {
            caption: 'Типові поєднання',
            head: ['Французькою', 'Українською'],
            rows: [
              ['Il me le donne.', 'Він мені його дає.'],
              ['Je te les montre.', 'Я тобі їх показую.'],
              ['Elle le lui explique.', 'Вона йому це пояснює.'],
              ['Nous leur en parlons.', 'Ми з ними про це говоримо.'],
            ],
          },
        },
        {
          kind: 'grammar',
          title: 'Наказовий спосіб ламає правило',
          body: `У **стверджувальному** наказі займенник переходить **після** дієслова й приєднується дефісом. Крім того, **me** стає **moi**:

*Donne-**moi** le livre.* — Дай мені книгу.
*Dis-**le-moi**.* — Скажи мені це.
*Vas-**y** !* — Іди туди! / Давай!

А в **заперечному** наказі все повертається на звичне місце:
*Ne **me le** donne pas.* — Не давай мені його.`,
          examples: [
            { fr: 'Donne-le-moi, s’il te plaît.', uk: 'Дай мені його, будь ласка.' },
            { fr: 'Ne lui dis rien !', uk: 'Нічого йому не кажи!' },
            { fr: 'Allez-y !', uk: 'Уперед! / Проходьте!' },
          ],
          warning:
            'Vas-y та Allez-y — одні з найчастіших фраз розмовної французької. Означають і «іди туди», і «давай, починай».',
        },
      ],
      exercises: [
        {
          id: 'm14l3e1',
          kind: 'cloze',
          prompt: 'Постав займенники в правильному порядку',
          sentence: 'Il ___ ___ donne. (мені його)',
          answer: ['me le'],
          translation: 'Він мені його дає.',
          hint: 'me йде перед le',
          explain: 'Порядок: me / te / se → le / la / les. Тому «me le».',
          words: ['w_donner'],
        },
        {
          id: 'm14l3e2',
          kind: 'cloze',
          prompt: 'А тут порядок інший',
          sentence: 'Je ___ ___ ai dit. (це йому)',
          answer: ['le lui'],
          translation: 'Я йому це сказав.',
          hint: 'le йде перед lui',
          explain: 'Коли зустрічаються le та lui, порядок «le lui» — дзеркальний до «me le».',
          words: ['w_dire'],
        },
        {
          id: 'm14l3e3',
          kind: 'mcq',
          prompt: 'Наказовий спосіб',
          question: '«Дай мені книгу»',
          options: ['Me donne le livre.', 'Donne-moi le livre.', 'Donne-me le livre.'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'У стверджувальному наказі займенник після дієслова, і me → moi.',
          words: ['w_donner'],
        },
        {
          id: 'm14l3e4',
          kind: 'mcq',
          prompt: 'А в запереченні?',
          question: '«Не кажи мені цього»',
          options: ['Ne dis-moi pas ça.', 'Ne me le dis pas.'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Заперечний наказ повертає займенники на звичне місце — перед дієсловом.',
        },
        {
          id: 'm14l3e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Покажи мені їх!',
          answer: ['montre-les-moi', 'montre les moi', 'montrez-les-moi'],
          hint: 'Наказ: дієслово + les + moi через дефіси',
          words: ['w_montrer'],
        },
        {
          id: 'm14l3e6',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Je le lui ai déjà expliqué.',
          translation: 'Я йому це вже пояснив.',
          words: ['w_expliquer'],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm14q1',
      kind: 'cloze',
      prompt: 'Прямий додаток',
      sentence: '— Tu connais ce film ? — Oui, je ___ connais.',
      answer: ['le'],
      translation: '— Ти знаєш цей фільм? — Так, знаю.',
      options: ['le', 'lui', 'y', 'en'],
    },
    {
      id: 'm14q2',
      kind: 'cloze',
      prompt: 'Непрямий додаток',
      sentence: 'J’écris à mes parents → Je ___ écris.',
      answer: ['leur'],
      translation: 'Я їм пишу.',
      options: ['les', 'leur', 'lui', 'en'],
    },
    {
      id: 'm14q3',
      kind: 'cloze',
      prompt: 'y чи en?',
      sentence: '— Tu reviens de Paris ? — Oui, j’___ reviens.',
      answer: ['en'],
      translation: '— Ти повертаєшся з Парижа? — Так.',
      options: ['y', 'en'],
    },
    {
      id: 'm14q4',
      kind: 'mcq',
      prompt: 'Порядок слів',
      question: '«Я тобі їх показую»',
      options: ['Je te les montre.', 'Je les te montre.'],
      answer: 0,
      optionsAreFrench: true,
    },
    {
      id: 'm14q5',
      kind: 'mcq',
      prompt: 'Наказ',
      question: '«Скажи мені це»',
      options: ['Dis-me-le.', 'Dis-le-moi.'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm14q6',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Я його не бачу.',
      answer: ['je ne le vois pas'],
    },
    {
      id: 'm14q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Elle ne nous en parle jamais.',
      translation: 'Вона нам про це ніколи не говорить.',
    },
    {
      id: 'm14q8',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'le / la / les', uk: 'прямий додаток' },
        { fr: 'lui / leur', uk: 'непрямий додаток' },
        { fr: 'y', uk: 'місце або à + щось' },
        { fr: 'en', uk: 'de + щось або кількість' },
      ],
    },
  ],
}

/* ================================================================== *
 * Модуль 15 — Складні речення
 * ================================================================== */
export const module15: Module = {
  id: 'm15',
  title: 'Складні речення',
  subtitle: 'Зв’язати думки в одне ціле',
  grammarFocus: 'Відносні займенники qui, que, où, dont і сполучники',
  emoji: '🧩',
  lessons: [
    {
      id: 'm15l1',
      title: 'qui та que',
      subtitle: 'Хто діє, а хто зазнає дії',
      minutes: 14,
      newWords: ['habiter', 'ecrire', 'w_choisir'],
      steps: [
        {
          kind: 'grammar',
          title: 'Не рід, а роль',
          body: `В українській «який» змінюється за родом і відмінком: *який, яка, якого, якому*. У французькій усе інакше — вибір залежить **не від роду**, а від **ролі в підрядному реченні**.

> **qui** — якщо це **підмет** (він виконує дію)
> **que** — якщо це **прямий додаток** (над ним виконують дію)

*L'homme **qui** parle est mon père.* — Чоловік, **який** говорить, — мій батько.
*L'homme **que** je vois est mon père.* — Чоловік, **якого** я бачу, — мій батько.

**Практична перевірка:** після qui одразу йде **дієслово**, після que — **підмет** (je, tu, il…).`,
          table: {
            caption: 'Як не переплутати',
            head: ['Після нього йде', 'Займенник', 'Приклад'],
            rows: [
              ['дієслово', 'qui', 'le livre **qui** est sur la table'],
              ['підмет (je, tu, il…)', 'que', 'le livre **que** j’ai acheté'],
            ],
          },
          warning:
            '⚠️ que скорочується перед голосною (qu’il, qu’elle), а qui — ніколи. «qui il» неможливе, буде просто «qui».',
        },
      ],
      exercises: [
        {
          id: 'm15l1e1',
          kind: 'cloze',
          prompt: 'qui чи que?',
          sentence: "C'est le train ___ va à Lyon.",
          answer: ['qui'],
          translation: 'Це потяг, який їде в Ліон.',
          options: ['qui', 'que'],
          explain: 'Після пропуску одразу дієслово «va» → потяг сам виконує дію → qui.',
          words: ['le_train'],
        },
        {
          id: 'm15l1e2',
          kind: 'cloze',
          prompt: 'qui чи que?',
          sentence: "C'est le livre ___ j'ai acheté hier.",
          answer: ['que'],
          translation: 'Це книга, яку я купив учора.',
          options: ['qui', 'que'],
          explain: 'Після пропуску підмет «j’» → книга є додатком → que.',
          words: ['le_livre', 'w_acheter'],
        },
        {
          id: 'm15l1e3',
          kind: 'mcq',
          prompt: 'Швидка перевірка',
          question: 'Як за секунду обрати між qui та que?',
          options: [
            'За родом іменника',
            'За тим, що йде далі: дієслово → qui, підмет → que',
            'За довжиною речення',
          ],
          answer: 1,
          explain: 'Рід тут узагалі ні до чого — на відміну від українського «який / яка».',
        },
        {
          id: 'm15l1e4',
          kind: 'cloze',
          prompt: 'Скорочення',
          sentence: 'La personne ___ elle attend est en retard.',
          answer: ["qu'", 'qu’'],
          translation: 'Людина, на яку вона чекає, запізнюється.',
          explain: 'que + elle → qu’elle. qui ніколи не скорочується.',
          words: ['w_personne', 'w_attendre'],
        },
        {
          id: 'm15l1e5',
          kind: 'wordbank',
          prompt: 'Збери речення',
          question: 'Я знаю жінку, яка живе тут.',
          answer: 'Je connais la femme qui habite ici.',
          distractors: ['que', 'dont'],
          words: ['w_connaitre', 'la_femme'],
        },
        {
          id: 'm15l1e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Це фільм, який я люблю.',
          answer: ["c'est le film que j'aime", 'cest le film que jaime'],
          hint: 'Після пропуску підмет «je» → que',
          words: ['w_film', 'aimer'],
        },
      ],
    },
    {
      id: 'm15l2',
      title: 'où та dont',
      subtitle: 'Місце, час і «якого»',
      minutes: 14,
      newWords: ['w_endroit', 'w_besoin', 'parler'],
      steps: [
        {
          kind: 'grammar',
          title: 'où — не лише «де»',
          body: `Як відносний займенник **où** позначає і місце, і **час**:

*La ville **où** j'habite.* — Місто, **де** я живу.
*Le jour **où** je suis arrivé.* — День, **коли** я приїхав.

Друге вживання дивує: українською ми кажемо «коли», а французи — «où». Просто запам'ятай: після слів jour, moment, année, époque майже завжди **où**, а не «quand».`,
          examples: [
            {
              fr: "C'est le café où nous nous sommes rencontrés.",
              uk: 'Це кафе, де ми познайомилися.',
            },
            { fr: "L'année où il est né.", uk: 'Рік, коли він народився.' },
          ],
        },
        {
          kind: 'grammar',
          title: 'dont — усе, що з de',
          body: `**dont** замінює конструкцію з прийменником **de**. Українською це «якого, про якого, чий».

*Le livre **dont** je parle.* — Книга, **про яку** я говорю. (parler **de**)
*L'homme **dont** la voiture est rouge.* — Чоловік, **чия** машина червона.
*La chose **dont** j'ai besoin.* — Річ, **яка** мені потрібна. (avoir besoin **de**)

**Ключ:** якщо дієслово вимагає **de**, потрібне dont. Тому варто пам'ятати такі дієслова: parler de, avoir besoin de, avoir envie de, se souvenir de, être content de.`,
          warning:
            '⚠️ Українською ці конструкції мають різні відмінки, тому спокуса перекласти дослівно велика. Орієнтуйся не на український відмінок, а на французький прийменник de.',
        },
      ],
      exercises: [
        {
          id: 'm15l2e1',
          kind: 'cloze',
          prompt: 'Встав відносний займенник',
          sentence: "C'est la ville ___ je suis né.",
          answer: ['où', 'ou'],
          translation: 'Це місто, де я народився.',
          options: ['où', 'que', 'dont', 'qui'],
          words: ['la_ville'],
        },
        {
          id: 'm15l2e2',
          kind: 'cloze',
          prompt: 'Час — теж où',
          sentence: 'Je me souviens du jour ___ nous nous sommes rencontrés.',
          answer: ['où', 'ou'],
          translation: 'Я пам’ятаю день, коли ми познайомилися.',
          options: ['où', 'quand', 'que'],
          explain: 'Після jour, moment, année вживається où, а не quand.',
          words: ['le_jour'],
        },
        {
          id: 'm15l2e3',
          kind: 'cloze',
          prompt: 'Дієслово вимагає de',
          sentence: "C'est le film ___ je t'ai parlé.",
          answer: ['dont'],
          translation: 'Це фільм, про який я тобі говорив.',
          options: ['que', 'dont', 'où', 'qui'],
          explain: 'parler DE quelque chose → dont.',
          words: ['parler'],
        },
        {
          id: 'm15l2e4',
          kind: 'cloze',
          prompt: 'Ще один de',
          sentence: "C'est exactement la chose ___ j'ai besoin.",
          answer: ['dont'],
          translation: 'Це саме та річ, яка мені потрібна.',
          options: ['que', 'dont', 'qui'],
          explain: 'avoir besoin DE → dont. Українське «яка» тут збиває з пантелику.',
          words: ['w_besoin'],
        },
        {
          id: 'm15l2e5',
          kind: 'mcq',
          prompt: 'Як обрати dont?',
          question: 'Коли потрібне dont?',
          options: [
            'Коли іменник жіночого роду',
            'Коли дієслово або вираз вимагає прийменника de',
            'Коли йдеться про людей',
          ],
          answer: 1,
        },
        {
          id: 'm15l2e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Це книга, про яку я говорю.',
          answer: ["c'est le livre dont je parle", 'cest le livre dont je parle'],
          words: ['le_livre', 'parler'],
        },
        {
          id: 'm15l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: "C'est la maison où j'ai grandi.",
          translation: 'Це дім, де я виріс.',
          words: ['la_maison', 'w_grandir'],
        },
      ],
    },
    {
      id: 'm15l3',
      title: 'Зв’язний текст',
      subtitle: 'Сполучники, які роблять мову дорослою',
      minutes: 13,
      newWords: [
        'w_pourtant',
        'w_cependant',
        'en_revanche',
        'tandis_que',
        'alors_que',
        'sinon',
        'bref',
        'dune_part',
      ],
      steps: [
        {
          kind: 'grammar',
          title: 'Чому це важливіше за нову лексику',
          body: `На рівні B1 різниця між «шкільною» і природною французькою — не в кількості слів, а в **зв'язках** між реченнями.

Порівняй:

> *J'aime Paris. C'est cher. J'y vais souvent.*
> *J'aime Paris. **C'est vrai que** c'est cher, **mais** j'y vais **quand même** souvent.*

Друге — та сама думка, але звучить як мова людини, а не як список.`,
          table: {
            caption: 'Робочий набір',
            head: ['Зв’язок', 'Французькою', 'Українською'],
            rows: [
              ['протиставлення', 'mais, pourtant, cependant', 'але, проте, однак'],
              ['протиставлення (сильне)', 'en revanche, par contre', 'натомість, зате'],
              ['одночасність / контраст', 'tandis que, alors que', 'тоді як'],
              ['причина', 'parce que, car, puisque', 'тому що, бо, оскільки'],
              ['наслідок', 'donc, alors, c’est pourquoi', 'отже, тож, тому'],
              ['послідовність', 'd’abord, ensuite, enfin', 'спершу, потім, нарешті'],
              ['підсумок', 'bref, en conclusion', 'коротше, на завершення'],
              ['умова навпаки', 'sinon', 'інакше, а то'],
            ],
          },
          warning:
            'Українці часто зловживають «et» і «mais», бо це перші вивчені слова. Свідомо замінюй їх на pourtant, cependant, alors que — і рівень мови одразу підскакує.',
        },
        {
          kind: 'dialogue',
          title: 'Обговорення',
          setting: 'Розмова про життя у великому місті',
          lines: [
            {
              speaker: 'Anna',
              fr: 'Tu aimes vivre à Paris ?',
              uk: 'Тобі подобається жити в Парижі?',
            },
            {
              speaker: 'Yuriy',
              fr: "D'une part oui, il y a tout. D'autre part, c'est très cher.",
              uk: 'З одного боку так, тут є все. З іншого — це дуже дорого.',
            },
            {
              speaker: 'Anna',
              fr: 'C’est vrai. En revanche, les transports sont excellents.',
              uk: 'Правда. Зате транспорт чудовий.',
            },
            {
              speaker: 'Yuriy',
              fr: 'Oui, alors qu’à Lviv je devais tout faire à pied.',
              uk: 'Так, тоді як у Львові я мусив усе робити пішки.',
            },
            { speaker: 'Anna', fr: 'Donc tu restes ici ?', uk: 'Отже, ти залишаєшся тут?' },
            {
              speaker: 'Yuriy',
              fr: 'Bref, oui — même si le loyer me fait peur.',
              uk: 'Коротше, так — навіть якщо оренда мене лякає.',
            },
          ],
        },
      ],
      exercises: [
        {
          id: 'm15l3e1',
          kind: 'cloze',
          prompt: 'Встав сполучник протиставлення',
          sentence: "C'est cher, ___ la qualité est excellente.",
          answer: ['pourtant', 'cependant', 'mais'],
          translation: 'Це дорого, проте якість чудова.',
          options: ['pourtant', 'donc', 'parce que'],
          words: ['w_pourtant'],
        },
        {
          id: 'm15l3e2',
          kind: 'cloze',
          prompt: 'Наслідок',
          sentence: 'Il pleuvait, ___ nous sommes restés à la maison.',
          answer: ['donc', 'alors'],
          translation: 'Йшов дощ, тож ми залишилися вдома.',
          options: ['donc', 'pourtant', 'bien que'],
          words: ['w_donc'],
        },
        {
          id: 'm15l3e3',
          kind: 'cloze',
          prompt: 'Контраст двох ситуацій',
          sentence: 'Il travaille beaucoup, ___ son frère ne fait rien.',
          answer: ['alors que', 'tandis que'],
          translation: 'Він багато працює, тоді як його брат нічого не робить.',
          hint: 'Два слова',
          words: ['alors_que'],
        },
        {
          id: 'm15l3e4',
          kind: 'match',
          prompt: 'З’єднай сполучники',
          pairs: [
            { fr: 'pourtant', uk: 'проте' },
            { fr: 'en revanche', uk: 'натомість' },
            { fr: 'sinon', uk: 'інакше' },
            { fr: 'bref', uk: 'коротше кажучи' },
          ],
          words: ['w_pourtant', 'en_revanche', 'sinon', 'bref'],
        },
        {
          id: 'm15l3e5',
          kind: 'mcq',
          prompt: 'Який варіант звучить природніше?',
          question: 'Оберіть більш «дорослу» побудову',
          options: [
            "J'aime Paris. C'est cher. J'y vais souvent.",
            "J'aime Paris. C'est cher, mais j'y vais quand même souvent.",
          ],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Зв’язки між реченнями — те, що відрізняє B1 від A2 сильніше, ніж запас слів.',
        },
        {
          id: 'm15l3e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Це дорого, зате якісно.',
          answer: [
            "c'est cher, en revanche c'est de bonne qualité",
            "c'est cher, mais c'est de bonne qualité",
          ],
          words: ['en_revanche'],
        },
        {
          id: 'm15l3e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Il fait froid, pourtant je sors.',
          translation: 'Холодно, проте я виходжу.',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm15q1',
      kind: 'cloze',
      prompt: 'qui чи que?',
      sentence: "C'est la femme ___ travaille ici.",
      answer: ['qui'],
      translation: 'Це жінка, яка тут працює.',
      options: ['qui', 'que'],
    },
    {
      id: 'm15q2',
      kind: 'cloze',
      prompt: 'qui чи que?',
      sentence: 'Le film ___ nous avons vu était long.',
      answer: ['que'],
      translation: 'Фільм, який ми подивилися, був довгий.',
      options: ['qui', 'que'],
    },
    {
      id: 'm15q3',
      kind: 'cloze',
      prompt: 'Встав займенник',
      sentence: "C'est le sujet ___ nous avons discuté.",
      answer: ['dont'],
      translation: 'Це тема, яку ми обговорювали.',
      options: ['que', 'dont', 'où'],
    },
    {
      id: 'm15q4',
      kind: 'cloze',
      prompt: 'Час',
      sentence: 'Le moment ___ tout a changé.',
      answer: ['où', 'ou'],
      translation: 'Момент, коли все змінилося.',
      options: ['où', 'quand', 'que'],
    },
    {
      id: 'm15q5',
      kind: 'mcq',
      prompt: 'Швидке правило',
      question: 'Після qui завжди йде…',
      options: ['підмет', 'дієслово'],
      answer: 1,
    },
    {
      id: 'm15q6',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Це книга, про яку я говорив.',
      answer: ["c'est le livre dont j'ai parlé", "c'est le livre dont je parlais"],
    },
    {
      id: 'm15q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: "L'homme qui parle est mon voisin.",
      translation: 'Чоловік, який говорить, — мій сусід.',
    },
    {
      id: 'm15q8',
      kind: 'wordbank',
      prompt: 'Збери речення',
      question: 'Це місто, де я виріс.',
      answer: "C'est la ville où j'ai grandi.",
      distractors: ['que', 'dont'],
    },
  ],
}
