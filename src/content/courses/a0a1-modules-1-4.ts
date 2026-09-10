import type { Module } from '../types'

/* ================================================================== *
 * Модуль 1 — Перші кроки
 * ================================================================== */
export const module1: Module = {
  id: 'm1',
  title: 'Перші кроки',
  subtitle: 'Звуки, привітання, «я — це я»',
  grammarFocus: 'Особові займенники та дієслово être (бути)',
  emoji: '👋',
  lessons: [
    {
      id: 'm1l1',
      title: 'Звуки, яких немає в українській',
      subtitle: 'Носові голосні, увулярне R, німі букви',
      minutes: 12,
      newWords: ['bonjour', 'bonsoir', 'salut', 'merci', 'oui', 'non'],
      steps: [
        {
          kind: 'intro',
          title: 'Чому починаємо зі звуків',
          body: `Французька пишеться зовсім не так, як звучить. **beaucoup** — вісім літер, а звуків лише чотири: [bo.ku].

Якщо одразу звикнути читати «як бачу», потім переучуватися буде важко. Тому перший урок — про вухо, а не про очі.

Три речі, які зробимо сьогодні:
1. Носові голосні — звук іде «в ніс», в українській такого немає взагалі.
2. Французьке **R** — не наше розкотисте, а глибоке, з горла.
3. Німі закінчення — більшість приголосних у кінці слова просто не читаються.`,
        },
        {
          kind: 'pronunciation',
          title: 'Носові голосні',
          body: `Затисни ніс пальцями й скажи «он». Відчуваєш опір? Це і є носовий звук. У французькій їх три основні. Голосна + **n/m** = один носовий звук, а сама **n** НЕ вимовляється.`,
          pairs: [
            { fr: 'bon', ipa: 'bɔ̃', uk: 'добрий — звук [ɔ̃], як «он» у ніс' },
            { fr: 'bonjour', ipa: 'bɔ̃.ʒuʁ', uk: 'добрий день' },
            { fr: 'vin', ipa: 'vɛ̃', uk: 'вино — звук [ɛ̃], як «ен» у ніс' },
            { fr: 'pain', ipa: 'pɛ̃', uk: 'хліб — те саме [ɛ̃], хоч пишеться -ain' },
            { fr: 'grand', ipa: 'ɡʁɑ̃', uk: 'великий — звук [ɑ̃], як «ан» у ніс' },
            { fr: 'français', ipa: 'fʁɑ̃.sɛ', uk: 'французький' },
          ],
        },
        {
          kind: 'pronunciation',
          title: 'Німі кінцівки та R',
          body: `**Правило кінця слова:** приголосні в кінці зазвичай німі. Запам'ятай виняток-підказку — читаються переважно **C, R, F, L** (слово-шпаргалка: «**CaReFuL**»).

**R** вимовляється глибоко в горлі — приблизно як українське «х», але з голосом. Спробуй сказати «ага» і затримати звук у горлі.`,
          pairs: [
            { fr: 'petit', ipa: 'p(ə)ti', uk: 'маленький — T у кінці німе' },
            { fr: 'salut', ipa: 'sa.ly', uk: 'привіт — T німе' },
            { fr: 'Paris', ipa: 'pa.ʁi', uk: 'Париж — S німе' },
            { fr: 'bonjour', ipa: 'bɔ̃.ʁuʁ', uk: 'а тут R у кінці читається (CaReFuL)' },
            { fr: 'merci', ipa: 'mɛʁ.si', uk: 'дякую — послухай R усередині' },
            { fr: 'rouge', ipa: 'ʁuʒ', uk: 'червоний — R на початку' },
          ],
        },
        {
          kind: 'grammar',
          title: 'Зв’язування (liaison)',
          body: `Коли слово закінчується на німу приголосну, а наступне починається з голосної — німа приголосна «оживає» і приклеюється до наступного слова.

Це те, чому французька звучить як суцільний потік без пауз.`,
          examples: [
            { fr: 'les amis → [le‿za.mi]', uk: 'друзі — S ожила і стала [z]' },
            { fr: 'vous avez → [vu‿za.ve]', uk: 'ви маєте' },
            { fr: 'un ami → [œ̃‿na.mi]', uk: 'друг — N приклеїлась' },
            { fr: 'c’est un homme → [sɛ‿tœ̃‿nɔm]', uk: 'це чоловік' },
          ],
          warning:
            'В українській слова вимовляються окремо. Тут — навпаки: намагайся не робити пауз між словами всередині фрази.',
        },
      ],
      exercises: [
        {
          id: 'm1l1e1',
          kind: 'listen',
          prompt: 'Послухай і обери, що ти чуєш',
          audioText: 'bonjour',
          options: ['bonjour', 'bonsoir', 'bonne nuit'],
          answer: 0,
          explain: 'bonjour = добрий день. bonsoir — добрий вечір, bonne nuit — на добраніч.',
          words: ['bonjour'],
        },
        {
          id: 'm1l1e2',
          kind: 'mcq',
          prompt: 'Скільки звуків у слові «bon»?',
          question: 'bon',
          speak: 'bon',
          options: ['3 звуки: б-о-н', '2 звуки: [b] + носовий [ɔ̃]', '4 звуки'],
          answer: 1,
          explain:
            'Голосна + n дають ОДИН носовий звук. Сама «n» окремо не вимовляється: [bɔ̃], а не [бон].',
        },
        {
          id: 'm1l1e3',
          kind: 'mcq',
          prompt: 'Яка літера в кінці слова НЕ читається?',
          question: 'petit',
          speak: 'petit',
          options: ['p', 't', 'e'],
          answer: 1,
          explain:
            'Кінцеве T німе: [p(ə)ti]. Пам’ятай CaReFuL — читаються переважно лише C, R, F, L.',
        },
        {
          id: 'm1l1e4',
          kind: 'listen',
          prompt: 'Носовий чи ні? Послухай уважно',
          audioText: 'vin',
          options: ['вино (vin) — носовий [ɛ̃]', 'вина (vine) — без носового'],
          answer: 0,
          explain: 'vin = вино, звук [vɛ̃]. Кінцева n не звучить окремо, вона «зафарбовує» голосну.',
        },
        {
          id: 'm1l1e5',
          kind: 'match',
          prompt: 'З’єднай слово з перекладом',
          pairs: [
            { fr: 'bonjour', uk: 'добрий день' },
            { fr: 'merci', uk: 'дякую' },
            { fr: 'oui', uk: 'так' },
            { fr: 'non', uk: 'ні' },
          ],
          words: ['bonjour', 'merci', 'oui', 'non'],
        },
        {
          id: 'm1l1e6',
          kind: 'mcq',
          prompt: 'Як прозвучить «les amis» (друзі)?',
          question: 'les amis',
          speak: 'les amis',
          options: ['[le a.mi] — з паузою', '[le‿za.mi] — зі зв’язуванням', '[les a.mi]'],
          answer: 1,
          explain:
            'Це liaison: німа S перед голосною оживає і читається як [z], приклеюючись до наступного слова.',
        },
        {
          id: 'm1l1e7',
          kind: 'speak',
          prompt: 'Скажи вголос — тренуємо носовий звук',
          text: 'Bonjour !',
          translation: 'Добрий день!',
          explain: 'Головне — не вимовляти «н» окремо. Звук [ɔ̃] іде в ніс одним рухом.',
          words: ['bonjour'],
        },
      ],
    },
    {
      id: 'm1l2',
      title: 'Привітання та ввічливість',
      subtitle: 'bonjour, salut, merci, s’il vous plaît',
      minutes: 14,
      newWords: [
        'bonjour',
        'bonsoir',
        'salut',
        'au_revoir',
        'a_bientot',
        'merci',
        'de_rien',
        'sil_vous_plait',
        'pardon',
        'excusez_moi',
        'madame',
        'monsieur',
        'ca_va',
        'comment_ca_va',
        'tres_bien',
        'et_toi',
      ],
      steps: [
        {
          kind: 'intro',
          title: 'Один звичай, який варто знати',
          body: `У Франції **bonjour** — не просто слово, а обов'язковий ритуал. Заходиш у булочну, у ліфт, до лікаря — спочатку «Bonjour», і лише потім усе інше.

Пропустити його — приблизно як в Україні штовхнути когось і не вибачитись. Саме тому туристи іноді скаржаться на «грубих французів»: часто вони просто не привіталися першими.

**Bonjour + madame / monsieur** — і ти вже сприймаєшся як ввічлива людина.`,
        },
        {
          kind: 'vocab',
          title: 'Ключові фрази',
          words: [
            'bonjour',
            'bonsoir',
            'salut',
            'au_revoir',
            'a_bientot',
            'merci',
            'de_rien',
            'sil_vous_plait',
            'pardon',
            'excusez_moi',
            'madame',
            'monsieur',
          ],
        },
        {
          kind: 'grammar',
          title: 'Ти чи Ви: tu та vous',
          body: `Так само, як в українській. **tu** — до друга, родича, дитини. **vous** — до незнайомого, старшого, у магазині, на роботі.

Правило для новачка просте: **починай з vous завжди**. Француз сам запропонує перейти на «ти» фразою *On peut se tutoyer ?*`,
          table: {
            caption: 'Та сама думка в двох регістрах',
            head: ['Ситуація', 'Французькою', 'Українською'],
            rows: [
              ['До друга', 'Salut ! Ça va ?', 'Привіт! Як справи?'],
              ['До незнайомого', 'Bonjour ! Comment allez-vous ?', 'Добрий день! Як ся маєте?'],
              ['Прохання (друг)', 's’il te plaît', 'будь ласка'],
              ['Прохання (ввічливо)', 's’il vous plaît', 'будь ласка'],
            ],
          },
          warning:
            'Сказати «tu» незнайомій людині — відчутна нетактовність. Помилка в інший бік (зайва ввічливість) нікого не образить.',
        },
        {
          kind: 'dialogue',
          title: 'Перша зустріч',
          setting: 'Ранок, невелика кав’ярня в Ліоні',
          lines: [
            { speaker: 'Клієнт', fr: 'Bonjour, madame !', uk: 'Добрий день, пані!' },
            {
              speaker: 'Продавчиня',
              fr: 'Bonjour, monsieur. Ça va ?',
              uk: 'Добрий день, пане. Як справи?',
            },
            {
              speaker: 'Клієнт',
              fr: 'Ça va très bien, merci. Et vous ?',
              uk: 'Дуже добре, дякую. А ви?',
            },
            { speaker: 'Продавчиня', fr: 'Très bien aussi, merci !', uk: 'Теж дуже добре, дякую!' },
            { speaker: 'Клієнт', fr: 'Un café, s’il vous plaît.', uk: 'Каву, будь ласка.' },
            { speaker: 'Продавчиня', fr: 'Voilà. Bonne journée !', uk: 'Прошу. Гарного дня!' },
            { speaker: 'Клієнт', fr: 'Merci, au revoir !', uk: 'Дякую, до побачення!' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm1l2e1',
          kind: 'mcq',
          prompt: 'Ти заходиш у магазин о 10-й ранку. Що кажеш?',
          question: 'Ранок, незнайома продавчиня',
          options: ['Salut !', 'Bonjour, madame !', 'Bonne nuit !'],
          answer: 1,
          optionsAreFrench: true,
          explain:
            'Salut — лише для друзів. Bonne nuit кажуть перед сном. З незнайомою людиною вдень — Bonjour + madame/monsieur.',
          words: ['bonjour', 'madame'],
        },
        {
          id: 'm1l2e2',
          kind: 'type',
          prompt: 'Напиши французькою: «дякую»',
          question: 'дякую',
          answer: ['merci'],
          accents: true,
          explain: 'merci [mɛʁ.si]. «Дуже дякую» — merci beaucoup.',
          words: ['merci'],
        },
        {
          id: 'm1l2e3',
          kind: 'cloze',
          prompt: 'Встав ввічливе прохання',
          sentence: 'Un café, ___ ___ ___ !',
          answer: ["s'il vous plaît", 's il vous plaît', 'sil vous plaît'],
          translation: 'Каву, будь ласка!',
          hint: 'Три слова, перше — з апострофом',
          explain:
            "s'il vous plaît — дослівно «якщо вам це подобається». Апостроф обов’язковий: s'il, а не si il.",
          words: ['sil_vous_plait'],
        },
        {
          id: 'm1l2e4',
          kind: 'match',
          prompt: 'З’єднай пари',
          pairs: [
            { fr: 'au revoir', uk: 'до побачення' },
            { fr: 'de rien', uk: 'нема за що' },
            { fr: 'excusez-moi', uk: 'вибачте' },
            { fr: 'à bientôt', uk: 'до зустрічі' },
          ],
          words: ['au_revoir', 'de_rien', 'excusez_moi', 'a_bientot'],
        },
        {
          id: 'm1l2e5',
          kind: 'mcq',
          prompt: 'До кого можна сказати «tu»?',
          question: 'Оберіть правильну ситуацію',
          options: [
            'До поліцейського на вулиці',
            'До найкращої подруги',
            'До нового керівника на роботі',
          ],
          answer: 1,
          explain:
            'tu — для друзів, родини, дітей. У решті випадків vous. Помилитися в бік ввічливості безпечно.',
        },
        {
          id: 'm1l2e6',
          kind: 'listen',
          prompt: 'Послухай і обери переклад',
          audioText: 'Comment ça va ?',
          options: ['Як тебе звати?', 'Як справи?', 'Скільки коштує?'],
          answer: 1,
          explain: 'Comment ça va ? [kɔ.mɑ̃ sa va] — Як справи? Коротко можна просто: Ça va ?',
          words: ['comment_ca_va'],
        },
        {
          id: 'm1l2e7',
          kind: 'wordbank',
          prompt: 'Збери відповідь: «Дуже добре, дякую. А ти?»',
          question: 'Дуже добре, дякую. А ти?',
          answer: 'Très bien, merci. Et toi ?',
          distractors: ['vous', 'salut', 'non'],
          explain: 'Et toi ? — до друга. До незнайомого було б Et vous ?',
          words: ['tres_bien', 'merci', 'et_toi'],
        },
        {
          id: 'm1l2e8',
          kind: 'speak',
          prompt: 'Привітайся так, як у кав’ярні',
          text: 'Bonjour, madame !',
          translation: 'Добрий день, пані!',
          words: ['bonjour', 'madame'],
        },
      ],
    },
    {
      id: 'm1l3',
      title: 'Я — це я',
      subtitle: 'Займенники та дієслово être',
      minutes: 15,
      newWords: [
        'je',
        'tu',
        'il',
        'elle',
        'nous',
        'vous',
        'ils',
        'elles',
        'etre',
        'je_mappelle',
        'enchante',
      ],
      steps: [
        {
          kind: 'grammar',
          title: 'Підмет обов’язковий',
          body: `Найперша й найчастіша помилка українців. В українській можна сказати просто «Йду додому» — і так зрозуміло, хто йде, бо закінчення дієслова це показує.

У французькій **займенник опускати не можна ніколи**. Дієслівні закінчення на слух часто однакові (*parle, parles, parlent* звучать ідентично), тому саме займенник несе інформацію про особу.`,
          examples: [
            { fr: '❌ Suis étudiant.', uk: 'Так не кажуть' },
            { fr: '✅ Je suis étudiant.', uk: 'Я студент' },
            { fr: '❌ Vais à Paris.', uk: 'Так не кажуть' },
            { fr: '✅ Je vais à Paris.', uk: 'Я їду в Париж' },
          ],
          warning: 'Немає підмета — немає речення. Це найшвидший спосіб «видати» початківця.',
        },
        {
          kind: 'grammar',
          title: 'être — бути',
          body: `Найважливіше дієслово французької мови. Воно неправильне, тож форми доведеться просто запам'ятати — але вони окуплять себе тисячу разів.

Зверни увагу: **est** і **es** звучать однаково [ɛ], а **sont** — [sɔ̃] з носовим.`,
          table: {
            caption: 'être у теперішньому часі',
            head: ['Особа', 'Французькою', 'Вимова', 'Українською'],
            rows: [
              ['1 од.', 'je suis', '[ʒə sɥi]', 'я є'],
              ['2 од.', 'tu es', '[ty ɛ]', 'ти є'],
              ['3 од.', 'il / elle est', '[il ɛ]', 'він / вона є'],
              ['1 мн.', 'nous sommes', '[nu sɔm]', 'ми є'],
              ['2 мн.', 'vous êtes', '[vu‿zɛt]', 'ви є'],
              ['3 мн.', 'ils / elles sont', '[il sɔ̃]', 'вони є'],
            ],
          },
          warning:
            'В українській «є» зазвичай випадає: «Він лікар». Французькою пропустити est НЕ можна: Il est médecin.',
        },
        {
          kind: 'grammar',
          title: 'Як назвати своє ім’я',
          body: `Є два способи, обидва вживані:

• **Je m'appelle Maryna.** — дослівно «я себе називаю». Найприродніший варіант.
• **Je suis Maryna.** — «я Марина». Теж правильно, трохи прямолінійніше.

У відповідь на знайомство кажуть **Enchanté** (чоловік) / **Enchantée** (жінка) — «дуже приємно». Вимова однакова, різниця лише на письмі.`,
          examples: [
            { fr: 'Je m’appelle Serhii. Et vous ?', uk: 'Мене звати Сергій. А вас?' },
            { fr: 'Elle s’appelle Sophie.', uk: 'Її звати Софі.' },
            { fr: 'Enchantée, madame.', uk: 'Дуже приємно, пані. (говорить жінка)' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm1l3e1',
          kind: 'cloze',
          prompt: 'Встав правильну форму être',
          sentence: 'Je ___ ukrainien.',
          answer: ['suis'],
          translation: 'Я українець.',
          options: ['suis', 'es', 'est', 'sommes'],
          explain: 'je → suis. Це форма першої особи однини.',
          words: ['etre', 'je'],
        },
        {
          id: 'm1l3e2',
          kind: 'cloze',
          prompt: 'Встав правильну форму être',
          sentence: 'Vous ___ professeur ?',
          answer: ['êtes', 'etes'],
          translation: 'Ви викладач?',
          options: ['es', 'êtes', 'sont', 'est'],
          explain: 'vous → êtes. Зверни увагу на зв’язування: vous êtes звучить [vu‿zɛt].',
          words: ['etre', 'vous'],
        },
        {
          id: 'm1l3e3',
          kind: 'mcq',
          prompt: 'Знайди помилку',
          question: 'Suis étudiante.',
          options: [
            'Помилки немає',
            'Бракує займенника: Je suis étudiante.',
            'Треба est замість suis',
          ],
          answer: 1,
          explain:
            'У французькій підмет обов’язковий. Українське «Студентка» без «я» — нормально, французьке без je — ні.',
          words: ['je', 'etre'],
        },
        {
          id: 'm1l3e4',
          kind: 'type',
          prompt: 'Напиши французькою: «Мене звати…» (без імені)',
          question: 'Мене звати…',
          answer: ["je m'appelle", 'je mappelle'],
          accents: true,
          hint: 'Три слова, апостроф після m',
          explain: "Je m'appelle — дослівно «я себе називаю». Апостроф обов’язковий.",
          words: ['je_mappelle'],
        },
        {
          id: 'm1l3e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Він лікар.',
          answer: ['il est médecin', 'il est medecin'],
          hint: 'Не забудь дієслово «є»!',
          explain:
            'Il est médecin. В українській «є» випадає, у французькій est обов’язкове. І артикль перед професією не ставиться.',
          words: ['il', 'etre', 'medecin'],
        },
        {
          id: 'm1l3e6',
          kind: 'match',
          prompt: 'З’єднай займенник з формою être',
          pairs: [
            { fr: 'je', uk: 'suis' },
            { fr: 'tu', uk: 'es' },
            { fr: 'nous', uk: 'sommes' },
            { fr: 'ils', uk: 'sont' },
          ],
          explain:
            'Ці шість форм варто знати напам’ять — вони трапляються в кожному другому реченні.',
        },
        {
          id: 'm1l3e7',
          kind: 'dictation',
          prompt: 'Запиши те, що чуєш',
          text: 'Je suis étudiant.',
          translation: 'Я студент.',
          explain: 'Je suis étudiant. Кінцеве -t у étudiant не вимовляється, але пишеться.',
          words: ['je', 'etre', 'etudiant'],
        },
        {
          id: 'm1l3e8',
          kind: 'speak',
          prompt: 'Представся вголос',
          text: 'Bonjour, je m’appelle Maryna. Enchantée !',
          translation: 'Добрий день, мене звати Марина. Дуже приємно!',
          words: ['je_mappelle', 'enchante'],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm1q1',
      kind: 'mcq',
      prompt: 'Обери правильне вітання для 9-ї ранку в аптеці',
      question: 'Незнайомий фармацевт, ранок',
      options: ['Salut !', 'Bonne nuit !', 'Bonjour, madame !'],
      answer: 2,
    },
    {
      id: 'm1q2',
      kind: 'cloze',
      prompt: 'Встав форму être',
      sentence: 'Nous ___ à Paris.',
      answer: ['sommes'],
      translation: 'Ми в Парижі.',
      options: ['sommes', 'êtes', 'sont', 'suis'],
    },
    {
      id: 'm1q3',
      kind: 'type',
      prompt: 'Напиши французькою: «до побачення»',
      question: 'до побачення',
      answer: ['au revoir'],
      accents: true,
    },
    {
      id: 'm1q4',
      kind: 'mcq',
      prompt: 'Скільки звуків передає сполучення «on» у слові bon?',
      question: 'bon',
      speak: 'bon',
      options: ['Два: о + н', 'Один носовий звук', 'Три'],
      answer: 1,
    },
    {
      id: 'm1q5',
      kind: 'translate',
      prompt: 'Переклади французькою',
      question: 'Вона студентка.',
      answer: ['elle est étudiante', 'elle est etudiante'],
      hint: 'Підмет + être + професія без артикля',
    },
    {
      id: 'm1q6',
      kind: 'listen',
      prompt: 'Що ти чуєш?',
      audioText: 'Merci beaucoup !',
      options: ['Дуже дякую!', 'Добрий вечір!', 'Вибачте, будь ласка!'],
      answer: 0,
    },
    {
      id: 'm1q7',
      kind: 'wordbank',
      prompt: 'Збери речення',
      question: 'Мене звати Марк. Дуже приємно!',
      answer: 'Je m’appelle Marc. Enchanté !',
      distractors: ['suis', 'vous'],
    },
    {
      id: 'm1q8',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Bonjour, ça va ?',
      translation: 'Добрий день, як справи?',
    },
  ],
}

/* ================================================================== *
 * Модуль 2 — Хто ти і звідки
 * ================================================================== */
export const module2: Module = {
  id: 'm2',
  title: 'Хто ти і звідки',
  subtitle: 'Країни, національності, професії',
  grammarFocus: 'Узгодження прикметників та заперечення ne… pas',
  emoji: '🌍',
  lessons: [
    {
      id: 'm2l1',
      title: 'Я з України',
      subtitle: 'Країни та національності',
      minutes: 14,
      newWords: [
        'la_france',
        'lukraine',
        'la_pologne',
        'lallemagne',
        'le_canada',
        'lespagne',
        'litalie',
        'ukrainien',
        'francais_adj',
        'habiter',
        'venir',
      ],
      steps: [
        {
          kind: 'vocab',
          title: 'Країни',
          words: [
            'la_france',
            'lukraine',
            'la_pologne',
            'lallemagne',
            'le_canada',
            'lespagne',
            'litalie',
          ],
        },
        {
          kind: 'grammar',
          title: 'Прикметник змінюється за родом',
          body: `В українській ми кажемо «українець» / «українка». У французькій те саме, і працює це через закінчення.

Базове правило: **жіночий рід = чоловічий + e**. Ця «e» часто оживляє німу приголосну.`,
          table: {
            caption: 'Національності',
            head: ['Чоловік', 'Жінка', 'Українською'],
            rows: [
              ['ukrainien', 'ukrainienne', 'українець / українка'],
              ['français', 'française', 'француз / француженка'],
              ['polonais', 'polonaise', 'поляк / полька'],
              ['allemand', 'allemande', 'німець / німкеня'],
              ['espagnol', 'espagnole', 'іспанець / іспанка'],
              ['canadien', 'canadienne', 'канадець / канадка'],
            ],
          },
          warning:
            'Ключове на слух: у чоловічому роді кінцева приголосна німа (français [фʁɑ̃сɛ]), а в жіночому вона ЗВУЧИТЬ (française [фʁɑ̃сɛз]). Саме так на слух відрізняють стать.',
        },
        {
          kind: 'grammar',
          title: 'Три способи сказати «я з України»',
          body: `**1. Національність** — без артикля:
*Je suis ukrainien.* — Я українець.

**2. Звідки походиш** — venir de:
*Je viens d'Ukraine.* — Я з України.

**3. Де живеш** — habiter à/en:
*J'habite à Kyiv.* — Я живу в Києві.
*J'habite en Ukraine.* — Я живу в Україні.`,
          table: {
            caption: 'Прийменник залежить від роду країни',
            head: ['Тип', 'Прийменник', 'Приклад'],
            rows: [
              ['Місто', 'à', 'à Kyiv, à Paris'],
              ['Країна жін. роду', 'en', 'en Ukraine, en France'],
              ['Країна чол. роду', 'au', 'au Canada, au Portugal'],
              ['Країна у множині', 'aux', 'aux États-Unis'],
            ],
          },
          warning:
            'Перед професією та національністю артикль НЕ ставиться: Je suis médecin (а не «un médecin»).',
        },
      ],
      exercises: [
        {
          id: 'm2l1e1',
          kind: 'cloze',
          prompt: 'Встав правильний прийменник',
          sentence: "J'habite ___ Ukraine.",
          answer: ['en'],
          translation: 'Я живу в Україні.',
          options: ['à', 'en', 'au', 'aux'],
          explain: "L'Ukraine — жіночого роду, тому en. Порівняй: au Canada (чол. рід).",
          words: ['habiter', 'lukraine'],
        },
        {
          id: 'm2l1e2',
          kind: 'cloze',
          prompt: 'Встав правильний прийменник',
          sentence: 'Elle habite ___ Canada.',
          answer: ['au'],
          translation: 'Вона живе в Канаді.',
          options: ['en', 'au', 'à', 'aux'],
          explain: 'Le Canada — чоловічий рід → au (це à + le).',
          words: ['le_canada'],
        },
        {
          id: 'm2l1e3',
          kind: 'mcq',
          prompt: 'Говорить жінка. Як правильно?',
          question: 'Je suis…',
          options: ['ukrainien', 'ukrainienne', 'Ukrainienne'],
          answer: 1,
          optionsAreFrench: true,
          explain:
            'Жіночий рід: ukrainienne. І з малої літери — на відміну від української, національності-прикметники не капіталізують.',
          words: ['ukrainien'],
        },
        {
          id: 'm2l1e4',
          kind: 'listen',
          prompt: 'Чоловік це чи жінка? Слухай кінцеву приголосну',
          audioText: 'Elle est française.',
          options: ['Жінка — чути [z] у кінці', 'Чоловік — кінцева приголосна німа'],
          answer: 0,
          explain:
            'française [fʁɑ̃.sɛz] — «e» на письмі оживляє s і вона звучить як [z]. У français [fʁɑ̃.sɛ] нічого не чути.',
          words: ['francais_adj'],
        },
        {
          id: 'm2l1e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Я з України.',
          answer: ["je viens d'ukraine", 'je viens dukraine'],
          hint: 'venir de + країна, з апострофом перед голосною',
          explain: "Je viens d'Ukraine. De + Ukraine → d'Ukraine, бо наступне слово з голосної.",
          words: ['venir', 'lukraine'],
        },
        {
          id: 'm2l1e6',
          kind: 'match',
          prompt: 'З’єднай країну з національністю (чол. рід)',
          pairs: [
            { fr: 'la France', uk: 'français' },
            { fr: "l'Ukraine", uk: 'ukrainien' },
            { fr: "l'Allemagne", uk: 'allemand' },
            { fr: "l'Espagne", uk: 'espagnol' },
          ],
        },
        {
          id: 'm2l1e7',
          kind: 'wordbank',
          prompt: 'Збери речення',
          question: 'Я живу в Києві, я українка.',
          answer: "J'habite à Kyiv, je suis ukrainienne.",
          distractors: ['en', 'ukrainien', 'êtes'],
          words: ['habiter', 'ukrainien'],
        },
      ],
    },
    {
      id: 'm2l2',
      title: 'Сказати «ні»',
      subtitle: 'Заперечення ne… pas',
      minutes: 12,
      newWords: ['parler', 'le_francais', 'langlais', 'un_peu', 'comprendre'],
      steps: [
        {
          kind: 'grammar',
          title: 'Заперечення обіймає дієслово',
          body: `В українській заперечення — це одна частка перед дієсловом: «Я **не** розумію».

У французькій їх **дві**, і вони охоплюють дієслово з обох боків:

> **ne** + ДІЄСЛОВО + **pas**

*Je **ne** comprends **pas**.* — Я не розумію.

Якщо дієслово починається з голосної, **ne** скорочується до **n'**:
*Je **n'**aime **pas** le café.* — Я не люблю каву.`,
          table: {
            caption: 'Ствердження → заперечення',
            head: ['Ствердження', 'Заперечення', 'Українською'],
            rows: [
              ['Je parle français.', 'Je ne parle pas français.', 'Я не говорю французькою.'],
              ['Il est médecin.', "Il n'est pas médecin.", 'Він не лікар.'],
              ['Nous sommes prêts.', 'Nous ne sommes pas prêts.', 'Ми не готові.'],
              ["J'ai faim.", "Je n'ai pas faim.", 'Я не голодний.'],
            ],
          },
          warning:
            'У розмовній мові французи часто ковтають ne: «Je sais pas» замість «Je ne sais pas». Розуміти це треба, але самому краще писати повну форму.',
        },
        {
          kind: 'dialogue',
          title: 'Ти говориш французькою?',
          setting: 'Знайомство на мовних курсах',
          lines: [
            { speaker: 'Léa', fr: 'Tu parles français ?', uk: 'Ти говориш французькою?' },
            {
              speaker: 'Ти',
              fr: 'Un peu. Je ne parle pas très bien.',
              uk: 'Трохи. Я не дуже добре говорю.',
            },
            { speaker: 'Léa', fr: 'Tu comprends ?', uk: 'Ти розумієш?' },
            {
              speaker: 'Ти',
              fr: 'Je comprends, mais je ne parle pas vite.',
              uk: 'Розумію, але говорю не швидко.',
            },
            { speaker: 'Léa', fr: 'C’est déjà très bien !', uk: 'Це вже дуже добре!' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm2l2e1',
          kind: 'cloze',
          prompt: 'Встав другу частину заперечення',
          sentence: 'Je ne comprends ___.',
          answer: ['pas'],
          translation: 'Я не розумію.',
          options: ['pas', 'non', 'ne', 'rien'],
          explain: 'Схема ne + дієслово + pas. Обидві частини обов’язкові на письмі.',
          words: ['comprendre'],
        },
        {
          id: 'm2l2e2',
          kind: 'type',
          prompt: 'Зроби речення заперечним: «Je parle russe.»',
          question: 'Je parle russe. → (заперечення)',
          answer: ['je ne parle pas russe'],
          accents: true,
          explain: 'Je ne parle pas russe. ne — перед дієсловом, pas — після нього.',
          words: ['parler'],
        },
        {
          id: 'm2l2e3',
          kind: 'mcq',
          prompt: 'Яка форма правильна?',
          question: '«Я не люблю каву»',
          options: ['Je ne aime pas le café.', "Je n'aime pas le café.", 'Je aime ne pas le café.'],
          answer: 1,
          optionsAreFrench: true,
          explain:
            "aime починається з голосної → ne скорочується до n'. Це обов’язково, не факультативно.",
          words: ['aimer', 'le_cafe'],
        },
        {
          id: 'm2l2e4',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Вона не француженка.',
          answer: [
            "elle n'est pas française",
            'elle nest pas française',
            "elle n'est pas francaise'",
          ],
          hint: "n' + est + pas",
          explain: "Elle n'est pas française. Не забудь і про жіночий рід прикметника.",
          words: ['francais_adj', 'etre'],
        },
        {
          id: 'm2l2e5',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Je ne parle pas anglais.',
          translation: 'Я не говорю англійською.',
          words: ['parler', 'langlais'],
        },
        {
          id: 'm2l2e6',
          kind: 'wordbank',
          prompt: 'Збери речення',
          question: 'Я не дуже добре говорю французькою.',
          answer: 'Je ne parle pas très bien français.',
          distractors: ['suis', 'anglais'],
          words: ['parler', 'le_francais'],
        },
        {
          id: 'm2l2e7',
          kind: 'speak',
          prompt: 'Скажи вголос',
          text: 'Je ne comprends pas, pardon.',
          translation: 'Я не розумію, перепрошую.',
          explain: 'Найкорисніша фраза для першої поїздки до Франції.',
          words: ['comprendre', 'pardon'],
        },
      ],
    },
    {
      id: 'm2l3',
      title: 'Чим ти займаєшся',
      subtitle: 'Професії та дієслово avoir',
      minutes: 14,
      newWords: [
        'avoir',
        'travailler',
        'le_travail',
        'etudiant',
        'professeur',
        'medecin',
        'ingenieur',
      ],
      steps: [
        {
          kind: 'grammar',
          title: 'avoir — мати',
          body: `Друге найважливіше дієслово після être. Теж неправильне.

Особливо зверни увагу на **j'ai** — «je» завжди скорочується перед голосною.`,
          table: {
            caption: 'avoir у теперішньому часі',
            head: ['Особа', 'Форма', 'Вимова', 'Українською'],
            rows: [
              ['1 од.', "j'ai", '[ʒe]', 'я маю'],
              ['2 од.', 'tu as', '[ty a]', 'ти маєш'],
              ['3 од.', 'il / elle a', '[il a]', 'він / вона має'],
              ['1 мн.', 'nous avons', '[nu‿za.vɔ̃]', 'ми маємо'],
              ['2 мн.', 'vous avez', '[vu‿za.ve]', 'ви маєте'],
              ['3 мн.', 'ils / elles ont', '[il‿zɔ̃]', 'вони мають'],
            ],
          },
          warning:
            'Не плутай ils ONT [il‿zɔ̃] (вони мають) та ils SONT [il sɔ̃] (вони є). Різниця лише в одному звуці, а зміст протилежний.',
        },
        {
          kind: 'grammar',
          title: 'Професія — без артикля',
          body: `Це відрізняється від англійської (*I am **a** doctor*) і збігається з українською.

*Je suis médecin.* — Я лікар.
*Elle est ingénieure.* — Вона інженерка.

Артикль з’являється, лише якщо додаємо опис: *C'est **un** bon médecin.* — Це хороший лікар.`,
          examples: [
            { fr: 'Je suis étudiant en médecine.', uk: 'Я студент-медик.' },
            { fr: 'Il travaille dans un hôpital.', uk: 'Він працює в лікарні.' },
            { fr: "J'ai un nouveau travail.", uk: 'У мене нова робота.' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm2l3e1',
          kind: 'cloze',
          prompt: 'Встав форму avoir',
          sentence: "J'___ un frère.",
          answer: ['ai'],
          translation: 'Я маю брата.',
          options: ['ai', 'as', 'a', 'ont'],
          explain: "je + ai → j'ai. Скорочення обов’язкове.",
          words: ['avoir'],
        },
        {
          id: 'm2l3e2',
          kind: 'cloze',
          prompt: 'Встав форму avoir',
          sentence: 'Vous ___ deux enfants ?',
          answer: ['avez'],
          translation: 'У вас двоє дітей?',
          options: ['avons', 'avez', 'ont', 'as'],
          words: ['avoir', 'vous'],
        },
        {
          id: 'm2l3e3',
          kind: 'mcq',
          prompt: 'Обери правильний варіант',
          question: '«Вона вчителька»',
          options: ['Elle est une professeure.', 'Elle est professeure.', 'Elle a professeure.'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Перед назвою професії артикль не ставиться — так само, як в українській.',
          words: ['professeur'],
        },
        {
          id: 'm2l3e4',
          kind: 'listen',
          prompt: 'Уважно: «є» чи «мають»?',
          audioText: 'Ils ont un chien.',
          options: ['Вони мають собаку', 'Вони — собаки'],
          answer: 0,
          explain:
            'ils ont [il‿zɔ̃] = вони мають. ils sont [il sɔ̃] = вони є. Чути різницю — важлива навичка.',
          words: ['avoir'],
        },
        {
          id: 'm2l3e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Я працюю в офісі.',
          answer: ['je travaille dans un bureau'],
          hint: 'travailler dans + un bureau',
          words: ['travailler'],
        },
        {
          id: 'm2l3e6',
          kind: 'match',
          prompt: 'З’єднай професію з перекладом',
          pairs: [
            { fr: 'un médecin', uk: 'лікар' },
            { fr: 'un professeur', uk: 'викладач' },
            { fr: 'un ingénieur', uk: 'інженер' },
            { fr: 'un étudiant', uk: 'студент' },
          ],
          words: ['medecin', 'professeur', 'ingenieur', 'etudiant'],
        },
        {
          id: 'm2l3e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: "J'ai un nouveau travail.",
          translation: 'У мене нова робота.',
          words: ['avoir', 'le_travail'],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm2q1',
      kind: 'cloze',
      prompt: 'Встав прийменник',
      sentence: 'Il habite ___ France.',
      answer: ['en'],
      translation: 'Він живе у Франції.',
      options: ['à', 'en', 'au', 'aux'],
    },
    {
      id: 'm2q2',
      kind: 'type',
      prompt: 'Зроби заперечним: «Je suis fatigué.»',
      question: 'Je suis fatigué. → (заперечення)',
      answer: ['je ne suis pas fatigué', 'je ne suis pas fatigue'],
      accents: true,
    },
    {
      id: 'm2q3',
      kind: 'mcq',
      prompt: 'Говорить жінка з Польщі',
      question: 'Je suis…',
      options: ['polonais', 'polonaise', 'Polonaise'],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm2q4',
      kind: 'cloze',
      prompt: 'Встав форму avoir',
      sentence: 'Nous ___ trois enfants.',
      answer: ['avons'],
      translation: 'У нас троє дітей.',
      options: ['avons', 'avez', 'sommes', 'ont'],
    },
    {
      id: 'm2q5',
      kind: 'translate',
      prompt: 'Переклади французькою',
      question: 'Я не говорю німецькою.',
      answer: ['je ne parle pas allemand'],
    },
    {
      id: 'm2q6',
      kind: 'listen',
      prompt: 'Що ти чуєш?',
      audioText: 'Elles sont ukrainiennes.',
      options: ['Вони українки', 'Вони мають українку', 'Ви українки'],
      answer: 0,
    },
    {
      id: 'm2q7',
      kind: 'wordbank',
      prompt: 'Збери речення',
      question: 'Я з України, але живу в Парижі.',
      answer: "Je viens d'Ukraine, mais j'habite à Paris.",
      distractors: ['en', 'suis'],
    },
    {
      id: 'm2q8',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: "Je n'ai pas de voiture.",
      translation: 'У мене немає машини.',
    },
  ],
}

/* ================================================================== *
 * Модуль 3 — Числа, час і вік
 * ================================================================== */
export const module3: Module = {
  id: 'm3',
  title: 'Числа, час і вік',
  subtitle: 'Рахунок, години, дні тижня',
  grammarFocus: 'Числівники, вік через avoir, конструкція il est + година',
  emoji: '🔢',
  lessons: [
    {
      id: 'm3l1',
      title: 'Від нуля до двадцяти',
      subtitle: 'Основа основ',
      minutes: 11,
      newWords: [
        'zero',
        'un_num',
        'deux',
        'trois',
        'quatre',
        'cinq',
        'six',
        'sept',
        'huit',
        'neuf',
        'dix',
        'onze',
        'douze',
        'treize',
        'quatorze',
        'quinze',
        'seize',
        'dix_sept',
        'dix_huit',
        'dix_neuf',
        'vingt',
      ],
      steps: [
        {
          kind: 'vocab',
          title: '0–10',
          words: [
            'zero',
            'un_num',
            'deux',
            'trois',
            'quatre',
            'cinq',
            'six',
            'sept',
            'huit',
            'neuf',
            'dix',
          ],
        },
        {
          kind: 'grammar',
          title: 'Числа-хамелеони',
          body: `Кілька чисел змінюють вимову залежно від того, що йде після них. Це справді збиває з пантелику, тож розберімо систему.

**cinq, six, huit, dix** — кінцевий звук зникає перед приголосною:
• six [sis] — окремо
• six ans [si‿zɑ̃] — перед голосною звук стає [z]
• six livres [si livʁ] — перед приголосною зникає зовсім`,
          table: {
            caption: 'Одне число — три вимови',
            head: ['Контекст', 'Написання', 'Вимова'],
            rows: [
              ['Саме по собі', 'six', '[sis]'],
              ['Перед голосною', 'six ans', '[si‿zɑ̃]'],
              ['Перед приголосною', 'six minutes', '[si mi.nyt]'],
            ],
          },
          warning:
            'Не намагайся вивчити це таблицею — воно приходить від слухання. Просто знай, що ти не помилився, коли чуєш «сі» замість «сіс».',
        },
        {
          kind: 'vocab',
          title: '11–20',
          words: [
            'onze',
            'douze',
            'treize',
            'quatorze',
            'quinze',
            'seize',
            'dix_sept',
            'dix_huit',
            'dix_neuf',
            'vingt',
          ],
        },
      ],
      exercises: [
        {
          id: 'm3l1e1',
          kind: 'listen',
          prompt: 'Яке число ти чуєш?',
          audioText: 'quatorze',
          options: ['4', '14', '40'],
          answer: 1,
          explain: 'quatorze = 14. Не плутай з quatre (4) і quarante (40).',
          words: ['quatorze'],
        },
        {
          id: 'm3l1e2',
          kind: 'type',
          prompt: 'Напиши число словами',
          question: '7',
          answer: ['sept'],
          explain: 'sept [sɛt] — P не вимовляється.',
          words: ['sept'],
        },
        {
          id: 'm3l1e3',
          kind: 'type',
          prompt: 'Напиши число словами',
          question: '12',
          answer: ['douze'],
          words: ['douze'],
        },
        {
          id: 'm3l1e4',
          kind: 'match',
          prompt: 'З’єднай число з цифрою',
          pairs: [
            { fr: 'quinze', uk: '15' },
            { fr: 'neuf', uk: '9' },
            { fr: 'treize', uk: '13' },
            { fr: 'vingt', uk: '20' },
          ],
        },
        {
          id: 'm3l1e5',
          kind: 'mcq',
          prompt: 'Як прозвучить «six ans» (шість років)?',
          question: 'six ans',
          speak: 'six ans',
          options: ['[sis ɑ̃]', '[si‿zɑ̃]', '[siks ɑ̃]'],
          answer: 1,
          explain: 'Перед голосною кінцеве x читається як [z] і зв’язується: [si‿zɑ̃].',
        },
        {
          id: 'm3l1e6',
          kind: 'dictation',
          prompt: 'Запиши число словами',
          text: 'dix-huit',
          translation: 'вісімнадцять',
          words: ['dix_huit'],
        },
      ],
    },
    {
      id: 'm3l2',
      title: 'Десятки та вік',
      subtitle: 'Чому 80 — це «чотири по двадцять»',
      minutes: 13,
      newWords: [
        'trente',
        'quarante',
        'cinquante',
        'soixante',
        'soixante_dix',
        'quatre_vingts',
        'quatre_vingt_dix',
        'cent',
        'mille',
      ],
      steps: [
        {
          kind: 'grammar',
          title: 'Найдивніше в французькій',
          body: `До 60 усе логічно. А далі французи раптом починають рахувати **двадцятками** — спадок кельтської системи числення.

• **70** = soixante-dix = «60 + 10»
• **80** = quatre-vingts = «4 × 20»
• **90** = quatre-vingt-dix = «4 × 20 + 10»
• **97** = quatre-vingt-dix-sept = «4 × 20 + 17»

Гарна новина: у Бельгії та Швейцарії кажуть просто — *septante* (70), *huitante* (80), *nonante* (90). Але у Франції треба рахувати.`,
          table: {
            caption: 'Десятки',
            head: ['Число', 'Французькою', 'Дослівно'],
            rows: [
              ['20', 'vingt', '—'],
              ['30', 'trente', '—'],
              ['40', 'quarante', '—'],
              ['50', 'cinquante', '—'],
              ['60', 'soixante', '—'],
              ['70', 'soixante-dix', '60 + 10'],
              ['80', 'quatre-vingts', '4 × 20'],
              ['90', 'quatre-vingt-dix', '4 × 20 + 10'],
              ['100', 'cent', '—'],
            ],
          },
          warning:
            'Найважче — сприймати це на слух у номерах телефону. Тренуйся саме слухати, не читати.',
        },
        {
          kind: 'grammar',
          title: 'Вік: «я МАЮ 25 років»',
          body: `Класична помилка українців — сказати *«Je suis 25»*. Так не можна: вийде «я є 25».

Французькою вік — це те, що ти **маєш**:

> **avoir** + число + **ans**

*J'ai vingt-cinq ans.* — Мені 25 років.
*Elle a trente ans.* — Їй 30 років.
*Quel âge as-tu ?* — Скільки тобі років?

Слово **ans** пропускати не можна, на відміну від українського «Мені 25».`,
          examples: [
            { fr: '❌ Je suis 25 ans.', uk: 'Груба помилка' },
            { fr: "✅ J'ai 25 ans.", uk: 'Мені 25 років' },
            { fr: 'Quel âge avez-vous ?', uk: 'Скільки вам років?' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm3l2e1',
          kind: 'mcq',
          prompt: 'Що означає quatre-vingts?',
          question: 'quatre-vingts',
          speak: 'quatre-vingts',
          options: ['24', '80', '420'],
          answer: 1,
          explain: '4 × 20 = 80. Французи рахують двадцятками — спадок кельтів.',
          words: ['quatre_vingts'],
        },
        {
          id: 'm3l2e2',
          kind: 'type',
          prompt: 'Напиши число словами',
          question: '70',
          answer: ['soixante-dix', 'soixante dix'],
          explain: 'soixante-dix = 60 + 10. Через дефіс.',
          words: ['soixante_dix'],
        },
        {
          id: 'm3l2e3',
          kind: 'cloze',
          prompt: 'Встав правильне дієслово',
          sentence: "J'___ vingt ans.",
          answer: ['ai'],
          translation: 'Мені двадцять років.',
          options: ['ai', 'suis', 'est'],
          explain: 'Вік — через avoir, ніколи через être. Дослівно «я маю двадцять років».',
          words: ['avoir', 'vingt'],
        },
        {
          id: 'm3l2e4',
          kind: 'mcq',
          prompt: 'Знайди помилку',
          question: 'Je suis trente ans.',
          options: ['Помилки немає', "Треба J'ai trente ans", 'Треба Je suis trente'],
          answer: 1,
          explain: 'Вік французькою «мають», а не «є». J’ai trente ans.',
        },
        {
          id: 'm3l2e5',
          kind: 'listen',
          prompt: 'Яке число?',
          audioText: 'quatre-vingt-dix-sept',
          options: ['77', '87', '97'],
          answer: 2,
          explain: '4 × 20 + 17 = 97.',
        },
        {
          id: 'm3l2e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Мені тридцять два роки.',
          answer: ["j'ai trente-deux ans", "j'ai trente deux ans"],
          hint: 'avoir + число + ans',
          words: ['avoir', 'trente'],
        },
        {
          id: 'm3l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Elle a soixante-quinze ans.',
          translation: 'Їй сімдесят п’ять років.',
        },
      ],
    },
    {
      id: 'm3l3',
      title: 'Котра година',
      subtitle: 'Час і дні тижня',
      minutes: 13,
      newWords: [
        'lheure',
        'la_minute',
        'le_jour',
        'la_semaine',
        'lundi',
        'mardi',
        'mercredi',
        'jeudi',
        'vendredi',
        'samedi',
        'dimanche',
        'aujourdhui',
        'demain',
        'hier',
      ],
      steps: [
        {
          kind: 'grammar',
          title: 'Il est… heures',
          body: `Час завжди починається з безособового **il est** — це «воно», яке ні на що не вказує (як українське «смеркає»).

> **Il est** + число + **heures**

Слово **heures** обов’язкове, на відміну від українського «Зараз третя».`,
          table: {
            caption: 'Як сказати час',
            head: ['Час', 'Французькою', 'Дослівно'],
            rows: [
              ['13:00', 'Il est une heure.', 'є одна година'],
              ['14:00', 'Il est deux heures.', 'є дві години'],
              ['14:15', 'Il est deux heures et quart.', '+ чверть'],
              ['14:30', 'Il est deux heures et demie.', '+ половина'],
              ['13:45', 'Il est deux heures moins le quart.', 'дві мінус чверть'],
              ['12:00', 'Il est midi.', 'полудень'],
              ['00:00', 'Il est minuit.', 'опівніч'],
            ],
          },
          warning:
            'Офіційно (розклади, телебачення) французи вживають 24-годинний формат: quinze heures trente = 15:30.',
        },
        {
          kind: 'vocab',
          title: 'Дні тижня',
          words: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
        },
        {
          kind: 'grammar',
          title: 'Дні тижня — без прийменника',
          body: `Ще одна відмінність від української. Ми кажемо «**у** понеділок», французи — просто **lundi**.

*Je travaille lundi.* — Я працюю в понеділок. (цього конкретного)
*Je travaille **le** lundi.* — Я працюю по понеділках. (щотижня)

Артикль **le** перетворює одноразову подію на регулярну — маленька деталь із великим змістом.`,
          examples: [
            { fr: 'On se voit samedi ?', uk: 'Побачимось у суботу?' },
            { fr: 'Le dimanche, je ne travaille pas.', uk: 'По неділях я не працюю.' },
            { fr: "Aujourd'hui, c'est mardi.", uk: 'Сьогодні вівторок.' },
          ],
          warning: 'Усі дні тижня чоловічого роду: le samedi, хоч «субота» в нас жіночого.',
        },
      ],
      exercises: [
        {
          id: 'm3l3e1',
          kind: 'cloze',
          prompt: 'Встав початок фрази про час',
          sentence: '___ ___ trois heures.',
          answer: ['il est'],
          translation: 'Зараз третя година.',
          hint: 'Два слова — безособова конструкція',
          explain: 'Час завжди «Il est…» — безособове «воно».',
          words: ['lheure'],
        },
        {
          id: 'm3l3e2',
          kind: 'mcq',
          prompt: 'Як сказати 14:30?',
          question: '14:30',
          options: [
            'Il est deux heures et quart.',
            'Il est deux heures et demie.',
            'Il est deux heures moins le quart.',
          ],
          answer: 1,
          optionsAreFrench: true,
          explain: 'et demie = і половина. et quart = і чверть (14:15).',
        },
        {
          id: 'm3l3e3',
          kind: 'match',
          prompt: 'З’єднай день з перекладом',
          pairs: [
            { fr: 'lundi', uk: 'понеділок' },
            { fr: 'mercredi', uk: 'середа' },
            { fr: 'vendredi', uk: "п'ятниця" },
            { fr: 'dimanche', uk: 'неділя' },
          ],
          words: ['lundi', 'mercredi', 'vendredi', 'dimanche'],
        },
        {
          id: 'm3l3e4',
          kind: 'mcq',
          prompt: 'У чому різниця?',
          question: '«Je travaille le samedi» проти «Je travaille samedi»',
          options: [
            'Різниці немає',
            'З le — щосуботи (регулярно), без le — цієї суботи',
            'З le — минулої суботи',
          ],
          answer: 1,
          explain: 'Артикль le робить дію регулярною. Крихітна деталь, яка змінює зміст.',
        },
        {
          id: 'm3l3e5',
          kind: 'listen',
          prompt: 'Котра година?',
          audioText: 'Il est sept heures et demie.',
          options: ['7:15', '7:30', '6:45'],
          answer: 1,
          explain: 'sept heures et demie = 7:30.',
        },
        {
          id: 'm3l3e6',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'Сьогодні понеділок.',
          answer: ["aujourd'hui, c'est lundi", "aujourd'hui c'est lundi", "c'est lundi"],
          words: ['aujourdhui', 'lundi'],
        },
        {
          id: 'm3l3e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Il est midi et demi.',
          translation: 'Пів на першу (12:30).',
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm3q1',
      kind: 'listen',
      prompt: 'Яке число?',
      audioText: 'quatre-vingt-treize',
      options: ['73', '83', '93'],
      answer: 2,
    },
    {
      id: 'm3q2',
      kind: 'cloze',
      prompt: 'Встав дієслово',
      sentence: 'Ma sœur ___ dix-huit ans.',
      answer: ['a'],
      translation: 'Моїй сестрі вісімнадцять.',
      options: ['a', 'est', 'ai'],
    },
    { id: 'm3q3', kind: 'type', prompt: 'Напиши словами', question: '16', answer: ['seize'] },
    {
      id: 'm3q4',
      kind: 'mcq',
      prompt: 'Як сказати 21:00 офіційно?',
      question: '21:00',
      options: [
        'Il est neuf heures.',
        'Il est vingt et une heures.',
        'Il est neuf heures du soir.',
      ],
      answer: 1,
      optionsAreFrench: true,
    },
    {
      id: 'm3q5',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'Мені сорок років.',
      answer: ["j'ai quarante ans"],
    },
    {
      id: 'm3q6',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'hier', uk: 'вчора' },
        { fr: "aujourd'hui", uk: 'сьогодні' },
        { fr: 'demain', uk: 'завтра' },
        { fr: 'maintenant', uk: 'зараз' },
      ],
    },
    {
      id: 'm3q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Il est huit heures moins le quart.',
      translation: '7:45',
    },
    {
      id: 'm3q8',
      kind: 'wordbank',
      prompt: 'Збери речення',
      question: 'У суботу я не працюю.',
      answer: 'Samedi, je ne travaille pas.',
      distractors: ['suis', 'lundi'],
    },
  ],
}

/* ================================================================== *
 * Модуль 4 — Артиклі: головний виклик
 * ================================================================== */
export const module4: Module = {
  id: 'm4',
  title: 'Артиклі: головний виклик',
  subtitle: 'le, la, les, un, une, des',
  grammarFocus: 'Означені й неозначені артиклі; рід іменника',
  emoji: '🔑',
  lessons: [
    {
      id: 'm4l1',
      title: 'Навіщо взагалі артиклі',
      subtitle: 'le / la / les',
      minutes: 15,
      newWords: [
        'le_livre',
        'la_table',
        'la_chaise',
        'le_stylo',
        'la_porte',
        'la_fenetre',
        'la_ville',
        'le_pays',
      ],
      steps: [
        {
          kind: 'intro',
          title: 'Найважчий модуль курсу — і найважливіший',
          body: `В українській артиклів **немає взагалі**. Ми кажемо «книга» — і все. Тому це найбільший бар'єр для нас.

Але є хороша новина: артикль у французькій майже завжди **обов'язковий**. Іменник без артикля — рідкість. Тобто не треба вирішувати «ставити чи ні» — треба лише обрати **який**.

Друга новина: артикль показує **рід і число** іменника. Часто саме він, а не саме слово, несе цю інформацію — тому французи вчать слова разом з артиклем, і тобі варто робити так само.

⚠️ **Головне правило цього курсу:** ніколи не запам'ятовуй слово *table*. Запам'ятовуй **la table**.`,
        },
        {
          kind: 'grammar',
          title: 'Означений артикль: le, la, les',
          body: `Вживається, коли мова про **конкретний, відомий** предмет — або про поняття загалом.

Приблизний український відповідник — «цей, той самий», але ми його зазвичай не промовляємо.`,
          table: {
            caption: 'Означений артикль',
            head: ['Рід / число', 'Артикль', 'Приклад', 'Українською'],
            rows: [
              ['чоловічий', 'le', 'le livre', 'книга (та сама)'],
              ['жіночий', 'la', 'la table', 'стіл'],
              ['перед голосною', "l'", "l'ami, l'eau", 'друг, вода'],
              ['множина', 'les', 'les livres', 'книги'],
            ],
          },
          warning:
            'Перед голосною або німим h артикль скорочується: l’ami, l’heure, l’hôtel. Це не варіант, а обов’язок.',
        },
        {
          kind: 'grammar',
          title: 'Пастка: рід не збігається з українським',
          body: `Це те, що збиває найбільше. Рід у французькій **не має жодного зв'язку** з українським родом.`,
          table: {
            caption: 'Класичні розбіжності',
            head: ['Французькою', 'Рід у фр.', 'Українською', 'Рід в укр.'],
            rows: [
              ['le livre', 'чол.', 'книга', 'жін. ⚠️'],
              ['la table', 'жін.', 'стіл', 'чол. ⚠️'],
              ['la chaise', 'жін.', 'стілець', 'чол. ⚠️'],
              ['le stylo', 'чол.', 'ручка', 'жін. ⚠️'],
              ['la fenêtre', 'жін.', 'вікно', 'сер. ⚠️'],
              ['la pomme', 'жін.', 'яблуко', 'сер. ⚠️'],
            ],
          },
          warning:
            'Середнього роду у французькій немає взагалі. Усі «вікна», «яблука» й «море» розподілені між чоловічим і жіночим.',
        },
      ],
      exercises: [
        {
          id: 'm4l1e1',
          kind: 'cloze',
          prompt: 'Встав артикль',
          sentence: '___ table est grande.',
          answer: ['la'],
          translation: 'Стіл великий.',
          options: ['le', 'la', 'les', "l'"],
          explain: '⚠️ table — ЖІНОЧИЙ рід у французькій, хоч «стіл» у нас чоловічий. la table.',
          words: ['la_table'],
        },
        {
          id: 'm4l1e2',
          kind: 'cloze',
          prompt: 'Встав артикль',
          sentence: '___ livre est intéressant.',
          answer: ['le'],
          translation: 'Книга цікава.',
          options: ['le', 'la', 'les', "l'"],
          explain: '⚠️ livre — ЧОЛОВІЧИЙ, хоч українська «книга» жіночого роду.',
          words: ['le_livre'],
        },
        {
          id: 'm4l1e3',
          kind: 'cloze',
          prompt: 'Встав артикль перед голосною',
          sentence: '___ eau est froide.',
          answer: ["l'", 'l’'],
          translation: 'Вода холодна.',
          options: ['le', 'la', "l'", 'les'],
          explain: "eau жіночого роду, але перед голосною la → l'. Тому рід «не видно».",
          words: ['leau'],
        },
        {
          id: 'm4l1e4',
          kind: 'mcq',
          prompt: 'Який рід у слова «fenêtre» (вікно)?',
          question: 'fenêtre',
          options: ['Чоловічий — le fenêtre', 'Жіночий — la fenêtre', 'Середній'],
          answer: 1,
          explain:
            'la fenêtre. Середнього роду у французькій немає взагалі, тож «вікно» стало жіночим.',
          words: ['la_fenetre'],
        },
        {
          id: 'm4l1e5',
          kind: 'match',
          prompt: 'З’єднай слово з правильним артиклем',
          pairs: [
            { fr: 'livre', uk: 'le' },
            { fr: 'table', uk: 'la' },
            { fr: 'stylo', uk: 'le' },
            { fr: 'porte', uk: 'la' },
          ],
        },
        {
          id: 'm4l1e6',
          kind: 'type',
          prompt: 'Напиши з артиклем: «стілець»',
          question: 'стілець (з артиклем le/la)',
          answer: ['la chaise'],
          accents: true,
          explain: 'la chaise — жіночий рід. Завжди вчи слово РАЗОМ з артиклем.',
          words: ['la_chaise'],
        },
        {
          id: 'm4l1e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'Le stylo est sur la table.',
          translation: 'Ручка на столі.',
          words: ['le_stylo', 'la_table'],
        },
      ],
    },
    {
      id: 'm4l2',
      title: 'un, une, des',
      subtitle: 'Коли предмет «якийсь»',
      minutes: 13,
      newWords: ['le_chat', 'le_chien', 'la_maison', 'la_voiture', 'lordinateur', 'le_telephone'],
      steps: [
        {
          kind: 'grammar',
          title: 'Неозначений артикль',
          body: `Вживається, коли предмет згадується **вперше** або коли він «якийсь, один із багатьох».

Український відповідник — приблизно «якийсь», «один»: «У мене є **якийсь** кіт» → *J'ai **un** chat.*`,
          table: {
            caption: 'Неозначений артикль',
            head: ['Рід / число', 'Артикль', 'Приклад', 'Українською'],
            rows: [
              ['чоловічий', 'un', 'un chat', 'кіт (якийсь)'],
              ['жіночий', 'une', 'une maison', 'дім (якийсь)'],
              ['множина', 'des', 'des livres', 'книги (якісь)'],
            ],
          },
          warning:
            'des в українській не має відповідника взагалі. «Я купую книги» → J’achète DES livres. Пропустити не можна.',
        },
        {
          kind: 'grammar',
          title: 'le чи un — як обрати',
          body: `Проста перевірка: **чи знає співрозмовник, про що йдеться?**

• Так, це щось конкретне → **le / la / les**
• Ні, це щось нове або будь-яке → **un / une / des**

*J'ai **un** chien.* — У мене є (якийсь) собака. — перша згадка
***Le** chien est noir.* — Собака чорний. — вже відомий нам

І ще: у **запереченні** un/une/des перетворюються на **de**:
*J'ai un chat.* → *Je n'ai **pas de** chat.*`,
          examples: [
            { fr: 'Il y a un problème.', uk: 'Є (якась) проблема.' },
            { fr: 'Le problème, c’est le temps.', uk: 'Проблема — це час. (конкретна)' },
            { fr: "Je n'ai pas de voiture.", uk: 'У мене немає машини. (не «pas une»!)' },
          ],
        },
      ],
      exercises: [
        {
          id: 'm4l2e1',
          kind: 'cloze',
          prompt: 'Встав артикль',
          sentence: "J'ai ___ chat.",
          answer: ['un'],
          translation: 'У мене є кіт.',
          options: ['un', 'une', 'des', 'le'],
          explain: 'chat — чоловічий рід, перша згадка → un chat.',
          words: ['le_chat'],
        },
        {
          id: 'm4l2e2',
          kind: 'cloze',
          prompt: 'Встав артикль',
          sentence: 'Elle a ___ voiture rouge.',
          answer: ['une'],
          translation: 'У неї червона машина.',
          options: ['un', 'une', 'des', 'la'],
          explain: 'voiture — жіночий рід → une voiture.',
          words: ['la_voiture'],
        },
        {
          id: 'm4l2e3',
          kind: 'cloze',
          prompt: 'Увага — це заперечення!',
          sentence: "Je n'ai pas ___ voiture.",
          answer: ['de', "d'"],
          translation: 'У мене немає машини.',
          options: ['une', 'de', 'la', 'des'],
          explain:
            'У запереченні un/une/des → de. Правило без винятків: pas de voiture, pas de chat, pas de livres.',
          words: ['la_voiture'],
        },
        {
          id: 'm4l2e4',
          kind: 'mcq',
          prompt: 'Який артикль тут?',
          question: 'Тебе питають: «Що це?» Ти вперше показуєш свій новий телефон.',
          options: ["C'est le téléphone.", "C'est un téléphone.", 'C’est des téléphone.'],
          answer: 1,
          optionsAreFrench: true,
          explain: 'Перша згадка, невідомий предмет → неозначений артикль un.',
          words: ['le_telephone'],
        },
        {
          id: 'm4l2e5',
          kind: 'translate',
          prompt: 'Переклади французькою',
          question: 'У мене немає собаки.',
          answer: ["je n'ai pas de chien", 'je nai pas de chien'],
          hint: 'Не забудь: у запереченні un → de',
          words: ['le_chien'],
        },
        {
          id: 'm4l2e6',
          kind: 'wordbank',
          prompt: 'Збери речення',
          question: 'Це великий дім.',
          answer: "C'est une grande maison.",
          distractors: ['un', 'grand'],
          explain: 'maison жіночого роду → une + grande (прикметник теж узгоджується).',
          words: ['la_maison', 'grand'],
        },
        {
          id: 'm4l2e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: "J'ai un ordinateur et un téléphone.",
          translation: 'У мене є комп’ютер і телефон.',
          words: ['lordinateur', 'le_telephone'],
        },
      ],
    },
    {
      id: 'm4l3',
      title: 'Як вгадати рід',
      subtitle: 'Підказки за закінченням',
      minutes: 12,
      newWords: ['lecole', 'la_rue', 'le_mot', 'la_langue', 'la_question'],
      steps: [
        {
          kind: 'grammar',
          title: 'Закінчення підказує рід у 80 % випадків',
          body: `Рід доводиться вчити, але не наосліп. Закінчення слова дає доволі надійну підказку.

Це не абсолютне правило, але воно рятує, коли забув.`,
          table: {
            caption: 'Зазвичай ЖІНОЧИЙ рід',
            head: ['Закінчення', 'Приклад', 'Українською'],
            rows: [
              ['-tion / -sion', 'la question, la nation', 'питання, нація'],
              ['-té', 'la liberté, la beauté', 'свобода, краса'],
              ['-ette', 'la baguette', 'багет'],
              ['-ance / -ence', 'la France, la science', 'Франція, наука'],
              ['-ure', 'la voiture, la nature', 'машина, природа'],
              ['-ie', 'la boulangerie', 'пекарня'],
            ],
          },
        },
        {
          kind: 'grammar',
          title: 'І чоловічі закінчення',
          body: `Дзеркальний список. Разом ці дві таблиці покривають більшість слів, які трапляться на A1–A2.`,
          table: {
            caption: 'Зазвичай ЧОЛОВІЧИЙ рід',
            head: ['Закінчення', 'Приклад', 'Українською'],
            rows: [
              ['-age', 'le fromage, le voyage', 'сир, подорож'],
              ['-ment', 'le moment, l’appartement', 'момент, квартира'],
              ['-eau', 'le bureau, le château', 'офіс, замок'],
              ['-isme', 'le tourisme', 'туризм'],
              ['-eur (речі)', 'l’ordinateur', 'комп’ютер'],
              ['приголосна', 'le pain, le vin', 'хліб, вино'],
            ],
          },
          warning:
            'Винятки є: le musée та le lycée чоловічого роду попри -ée. Але їх небагато — легше запам’ятати винятки, ніж усі слова.',
        },
      ],
      exercises: [
        {
          id: 'm4l3e1',
          kind: 'mcq',
          prompt: 'Слово «la nation» закінчується на -tion. Який рід у «situation»?',
          question: 'situation',
          options: ['Чоловічий', 'Жіночий'],
          answer: 1,
          explain: 'Усі слова на -tion жіночого роду: la situation, la nation, la question.',
        },
        {
          id: 'm4l3e2',
          kind: 'cloze',
          prompt: 'Встав артикль (підказка: -age)',
          sentence: '___ fromage est délicieux.',
          answer: ['le'],
          translation: 'Сир смачний.',
          options: ['le', 'la', "l'"],
          explain: 'Закінчення -age → чоловічий рід. le fromage, le voyage, le message.',
          words: ['le_fromage'],
        },
        {
          id: 'm4l3e3',
          kind: 'cloze',
          prompt: 'Встав артикль (підказка: -ure)',
          sentence: '___ voiture est nouvelle.',
          answer: ['la'],
          translation: 'Машина нова.',
          options: ['le', 'la', "l'"],
          explain: 'Закінчення -ure → жіночий рід. la voiture, la nature, la culture.',
          words: ['la_voiture'],
        },
        {
          id: 'm4l3e4',
          kind: 'match',
          prompt: 'З’єднай закінчення з родом',
          pairs: [
            { fr: '-tion', uk: 'жіночий' },
            { fr: '-age', uk: 'чоловічий' },
            { fr: '-té', uk: 'жіночий' },
            { fr: '-ment', uk: 'чоловічий' },
          ],
        },
        {
          id: 'm4l3e5',
          kind: 'mcq',
          prompt: 'Знайди виняток',
          question: 'Яке слово чоловічого роду попри «жіноче» закінчення?',
          options: ['la liberté', 'le musée', 'la question'],
          answer: 1,
          explain: 'le musée та le lycée — чоловічого роду, хоч закінчуються на -ée.',
          words: ['le_musee'],
        },
        {
          id: 'm4l3e6',
          kind: 'type',
          prompt: 'Напиши з артиклем: «школа»',
          question: 'школа (з артиклем)',
          answer: ["l'école", 'lécole', 'l’école'],
          accents: true,
          explain: "école жіночого роду, але перед голосною → l'école.",
          words: ['lecole'],
        },
        {
          id: 'm4l3e7',
          kind: 'dictation',
          prompt: 'Запиши почуте',
          text: 'La question est difficile.',
          translation: 'Питання складне.',
          words: ['la_question'],
        },
      ],
    },
  ],
  quiz: [
    {
      id: 'm4q1',
      kind: 'cloze',
      prompt: 'Встав артикль',
      sentence: '___ chaise est cassée.',
      answer: ['la'],
      translation: 'Стілець зламаний.',
      options: ['le', 'la', "l'", 'les'],
    },
    {
      id: 'm4q2',
      kind: 'cloze',
      prompt: 'Заперечення!',
      sentence: 'Il n’a pas ___ chien.',
      answer: ['de', "d'"],
      translation: 'У нього немає собаки.',
      options: ['un', 'de', 'le', 'des'],
    },
    {
      id: 'm4q3',
      kind: 'mcq',
      prompt: 'Який рід?',
      question: 'appartement',
      options: ['Чоловічий (-ment)', 'Жіночий'],
      answer: 0,
    },
    {
      id: 'm4q4',
      kind: 'type',
      prompt: 'Напиши з артиклем: «книга»',
      question: 'книга (з артиклем)',
      answer: ['le livre'],
      accents: true,
    },
    {
      id: 'm4q5',
      kind: 'match',
      prompt: 'З’єднай',
      pairs: [
        { fr: 'un', uk: 'чоловічий, неозначений' },
        { fr: 'une', uk: 'жіночий, неозначений' },
        { fr: 'des', uk: 'множина, неозначений' },
        { fr: 'les', uk: 'множина, означений' },
      ],
    },
    {
      id: 'm4q6',
      kind: 'translate',
      prompt: 'Переклади',
      question: 'У мене немає комп’ютера.',
      answer: ["je n'ai pas d'ordinateur", 'je nai pas dordinateur'],
      hint: "pas de → перед голосною d'",
    },
    {
      id: 'm4q7',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: "L'eau est froide.",
      translation: 'Вода холодна.',
    },
    {
      id: 'm4q8',
      kind: 'wordbank',
      prompt: 'Збери речення',
      question: 'Це якась цікава книга.',
      answer: "C'est un livre intéressant.",
      distractors: ['une', 'intéressante'],
    },
  ],
}
