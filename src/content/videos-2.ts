import type { VideoLesson } from './types'

/**
 * Second batch of listening lessons, weighted to B1–B2.
 *
 * Listening was the thinnest skill in the app — three lessons against
 * sixty-eight — and it is the one Ukrainian learners of French struggle with
 * most: the sound system *is* the difficulty, which is why it's module 1.
 * Worse, the gap sat exactly where the complaint lives. "I can't understand
 * natives" is a B1–B2 problem, and there was nothing above A2 to practise on.
 *
 * What these do and don't do
 * --------------------------
 * They are voiced by the browser's synthesiser, which speaks *clearly*. That
 * trains the sound→meaning link and, crucially, teaches the written-out reduced
 * forms — «j'sais pas», «t'as vu», «y a» — so that the shapes are familiar when
 * a real French person says them at speed. It does not simulate native mumble,
 * and it would be dishonest to claim it does; for that, a learner adds a real
 * YouTube clip with its transcript from the Listening screen, and it lands in
 * this same player.
 *
 * Every lesson carries a dictation. It is the hardest listening exercise and
 * the only one that proves you heard the *words* rather than guessed the gist.
 */

/* ------------------------------------------------------------------ *
 * A2 — the telephone: no lips to read, and numbers at speed
 * ------------------------------------------------------------------ */

const auTelephone: VideoLesson = {
  id: 'au-telephone',
  title: 'Au téléphone',
  titleUk: 'По телефону',
  level: 'A2',
  emoji: '📞',
  minutes: 6,
  blurb:
    'Телефон — окремий рівень складності: не видно губ, і числа летять швидко. Запис на прийом, ім’я по літерах, дата й час.',
  transcript: [
    {
      t: 0,
      fr: 'Cabinet du docteur Blanchard, bonjour.',
      uk: 'Кабінет доктора Бланшара, добрий день.',
    },
    {
      t: 3,
      fr: 'Bonjour, madame. Je voudrais prendre rendez-vous, s’il vous plaît.',
      uk: 'Добрий день, пані. Я хотів би записатися на прийом, будь ласка.',
    },
    { t: 8, fr: 'Oui, bien sûr. C’est à quel nom ?', uk: 'Так, звісно. На яке прізвище?' },
    {
      t: 11,
      fr: 'Kovalenko. Je vous épelle : K-O-V-A-L-E-N-K-O.',
      uk: 'Коваленко. Диктую по літерах: К-О-В-А-Л-Е-Н-К-О.',
    },
    { t: 18, fr: 'Merci. Et votre numéro de téléphone ?', uk: 'Дякую. І ваш номер телефону?' },
    {
      t: 21,
      fr: 'Zéro six, quarante-deux, dix-huit, soixante-quinze, treize.',
      uk: 'Нуль шість, сорок два, вісімнадцять, сімдесят п’ять, тринадцять.',
    },
    {
      t: 27,
      fr: 'Je répète : zéro six, quarante-deux, dix-huit, soixante-quinze, treize.',
      uk: 'Повторюю: нуль шість, сорок два, вісімнадцять, сімдесят п’ять, тринадцять.',
    },
    {
      t: 33,
      fr: 'C’est ça. Vous avez quelque chose cette semaine ?',
      uk: 'Саме так. У вас є щось цього тижня?',
    },
    {
      t: 37,
      fr: 'Alors… jeudi quatorze, à quinze heures trente. Ça vous convient ?',
      uk: 'Отже… четвер, чотирнадцяте, о пів на четверту. Вам підходить?',
    },
    { t: 44, fr: 'Parfait. Jeudi à quinze heures trente.', uk: 'Чудово. Четвер о 15:30.' },
    {
      t: 48,
      fr: 'C’est noté. N’oubliez pas votre carte Vitale. Bonne journée !',
      uk: 'Записала. Не забудьте картку медстрахування. Гарного дня!',
    },
  ],
  vocab: ['le_telephone', 'w_telephoner', 'w_repondre', 'w_demander', 'w_appeler'],
  exercises: [
    {
      id: 'v4e1',
      kind: 'listen',
      prompt: 'Послухай номер і обери правильний',
      audioText: 'Zéro six, quarante-deux, dix-huit, soixante-quinze, treize.',
      options: ['06 42 18 75 13', '06 22 18 65 13', '06 42 80 75 30'],
      answer: 0,
    },
    {
      id: 'v4e2',
      kind: 'mcq',
      prompt: 'Коли призначено прийом?',
      question: 'Quand est le rendez-vous ?',
      options: ['Jeudi à 15h30', 'Jeudi à 5h30', 'Mardi à 15h13'],
      answer: 0,
      optionsAreFrench: true,
      explain: '«Quinze heures trente» — 15:30. У Франції години рахують до 24.',
    },
    {
      id: 'v4e3',
      kind: 'cloze',
      prompt: 'Формула запису на прийом',
      sentence: 'Je voudrais ___ rendez-vous, s’il vous plaît.',
      answer: ['prendre'],
      translation: 'Я хотів би записатися на прийом.',
      options: ['prendre', 'faire', 'avoir'],
      explain: '«Prendre rendez-vous» — фіксований вираз.',
    },
    {
      id: 'v4e4',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'C’est à quel nom ?',
      translation: 'На яке прізвище?',
    },
    {
      id: 'v4e5',
      kind: 'translate',
      prompt: 'Переклади французькою',
      question: 'Вам підходить?',
      answer: ['ça vous convient', 'ca vous convient'],
    },
  ],
}

/* ------------------------------------------------------------------ *
 * B1 — the flagship: what people actually say
 * ------------------------------------------------------------------ */

const francaisParle: VideoLesson = {
  id: 'francais-parle',
  title: 'Le français qu’on parle vraiment',
  titleUk: 'Французька, якою справді говорять',
  level: 'B1',
  emoji: '💬',
  minutes: 8,
  blurb:
    'Дві подруги в кафе. Жодного «ne», половина складів проковтнута — саме те, через що носії здаються незрозумілими. Поруч у транскрипті: як це пишуть у підручнику.',
  transcript: [
    { t: 0, fr: 'Salut ! Ça va ?', uk: 'Привіт! Як справи?' },
    {
      t: 2,
      fr: 'Ouais, ça va. Enfin… j’suis crevée, mais ça va.',
      uk: 'Ага, нормально. Ну… я вимотана, але нормально.',
    },
    {
      t: 6,
      fr: 'T’as vu l’heure ? On a rendez-vous à deux heures.',
      uk: 'Ти бачила, котра? У нас зустріч о другій.',
    },
    {
      t: 10,
      fr: 'Ah bon ? J’savais pas. Y a le temps, non ?',
      uk: 'Справді? Я не знала. Ще є час, ні?',
    },
    {
      t: 14,
      fr: 'Ben, pas trop. Faut qu’on parte dans dix minutes.',
      uk: 'Ну, не дуже. Треба вийти за десять хвилин.',
    },
    {
      t: 19,
      fr: 'D’accord. J’prends un café vite fait et on y va.',
      uk: 'Гаразд. Я швиденько вип’ю каву — і йдемо.',
    },
    {
      t: 24,
      fr: 'Au fait, t’as parlé à Julien ? Il m’a pas rappelée.',
      uk: 'До речі, ти говорила з Жюльєном? Він мені не передзвонив.',
    },
    {
      t: 29,
      fr: 'Chais pas, moi. J’crois qu’il est en déplacement.',
      uk: 'Та я не знаю. Здається, він у відрядженні.',
    },
    {
      t: 34,
      fr: 'Mouais. Bon, c’est pas grave. J’le verrai lundi.',
      uk: 'Ну-ну. Гаразд, нічого страшного. Побачу його в понеділок.',
    },
    { t: 39, fr: 'Allez, on y va. Tu payes ou j’paye ?', uk: 'Ну все, ходімо. Ти платиш чи я?' },
    {
      t: 43,
      fr: 'J’t’invite. Tu payeras la prochaine fois.',
      uk: 'Я пригощаю. Заплатиш наступного разу.',
    },
  ],
  vocab: ['le_boulot', 'bosser', 'le_truc', 'w_croire', 'w_appeler'],
  exercises: [
    {
      id: 'v5e1',
      kind: 'mcq',
      prompt: 'Розшифруй',
      question: '«J’savais pas» — як це в підручнику?',
      options: ['Je ne savais pas', 'Je sais pas', 'J’ai su'],
      answer: 0,
      optionsAreFrench: true,
      explain: 'Проковтнуте «e» в «je» + випущене «ne». У мовленні це норма, на письмі — ні.',
    },
    {
      id: 'v5e2',
      kind: 'mcq',
      prompt: 'Що зникло?',
      question: '«Il m’a pas rappelée» — чого бракує проти письмової норми?',
      options: ['Частки ne', 'Допоміжного дієслова', 'Займенника'],
      answer: 0,
      explain: 'У розмові «ne» випадає майже завжди. Саме тому заперечення важко почути.',
    },
    {
      id: 'v5e3',
      kind: 'mcq',
      prompt: 'Безособове',
      question: '«Y a le temps» — повна форма?',
      options: ['Il y a le temps', 'Y avait le temps', 'On a le temps'],
      answer: 0,
      optionsAreFrench: true,
      explain: '«Il y a» → «y a». Одна з найчастотніших редукцій узагалі.',
    },
    {
      id: 'v5e4',
      kind: 'listen',
      prompt: 'Послухай і обери значення',
      audioText: 'Faut qu’on parte dans dix minutes.',
      options: [
        'Треба вийти за десять хвилин',
        'Ми вийшли десять хвилин тому',
        'Зустріч через десять годин',
      ],
      answer: 0,
      explain: '«Il faut qu’on» → «faut qu’on». Після нього — subjonctif: parte.',
    },
    {
      id: 'v5e5',
      kind: 'dictation',
      prompt: 'Запиши почуте (розмовна форма)',
      text: 'Chais pas, moi.',
      translation: 'Та я не знаю.',
    },
    {
      id: 'v5e6',
      kind: 'translate',
      prompt: 'Переклади французькою, як сказала б подруга',
      question: 'Я пригощаю.',
      answer: ['je t’invite', "j'invite", 'j’t’invite', 'je t invite'],
    },
  ],
}

/* ------------------------------------------------------------------ *
 * B1 — the register at the other end of the scale
 * ------------------------------------------------------------------ */

const lesInfos: VideoLesson = {
  id: 'les-infos',
  title: 'Les infos en trois minutes',
  titleUk: 'Новини за три хвилини',
  level: 'B1',
  emoji: '📻',
  minutes: 7,
  blurb:
    'Протилежність попередньому уроку: чітка дикція, пасив, безособові звороти. Мова новин звучить складно, але вона передбачувана — і саме тому з неї варто починати.',
  transcript: [
    { t: 0, fr: 'Il est huit heures. Voici les titres.', uk: 'Восьма година. Ось головні новини.' },
    {
      t: 4,
      fr: 'Les prix de l’électricité vont augmenter de quatre pour cent au mois de janvier.',
      uk: 'Ціни на електроенергію зростуть на чотири відсотки в січні.',
    },
    {
      t: 11,
      fr: 'La décision a été annoncée hier soir par le gouvernement.',
      uk: 'Рішення було оголошено вчора ввечері урядом.',
    },
    {
      t: 16,
      fr: 'Une grève est prévue jeudi dans les transports parisiens.',
      uk: 'На четвер у паризькому транспорті заплановано страйк.',
    },
    {
      t: 22,
      fr: 'Selon les syndicats, un métro sur trois circulera.',
      uk: 'За даними профспілок, курсуватиме кожен третій потяг метро.',
    },
    {
      t: 27,
      fr: 'À l’étranger, le sommet européen se poursuit à Bruxelles.',
      uk: 'За кордоном: європейський саміт триває в Брюсселі.',
    },
    {
      t: 33,
      fr: 'Le président aurait proposé un nouveau plan, selon nos informations.',
      uk: 'За нашою інформацією, президент нібито запропонував новий план.',
    },
    {
      t: 39,
      fr: 'Enfin, la météo : du soleil sur tout le pays, quinze degrés à Paris.',
      uk: 'Насамкінець погода: сонячно по всій країні, п’ятнадцять градусів у Парижі.',
    },
    { t: 46, fr: 'Il est huit heures trois. Bonne journée.', uk: 'Восьма нуль три. Гарного дня.' },
  ],
  vocab: [
    'la_presse',
    'lactualite',
    'w_augmenter',
    'w_annoncer',
    'la_greve',
    'w_gouvernement',
    'w_president',
  ],
  exercises: [
    {
      id: 'v6e1',
      kind: 'mcq',
      prompt: 'Мова новин: умовний спосіб',
      question: '«Le président aurait proposé un plan» означає…',
      options: [
        'Нібито запропонував — не підтверджено',
        'Запропонував би, якби міг',
        'Мусив запропонувати',
      ],
      answer: 0,
      explain: 'Conditionnel у новинах = «за неперевіреними даними». Журналістська обережність.',
    },
    {
      id: 'v6e2',
      kind: 'mcq',
      prompt: 'Скільки метро працюватиме?',
      question: 'Un métro sur trois circulera. Combien ?',
      options: ['Кожен третій', 'Три лінії', 'Жодного'],
      answer: 0,
      explain: '«Un X sur trois» — «кожен третій». Дуже частий зворот у статистиці.',
    },
    {
      id: 'v6e3',
      kind: 'cloze',
      prompt: 'Пасивний стан',
      sentence: 'La décision ___ été annoncée par le gouvernement.',
      answer: ['a'],
      translation: 'Рішення було оголошено урядом.',
      options: ['a', 'est', 'était'],
      explain: 'Passé composé пасиву: avoir + été + дієприкметник.',
    },
    {
      id: 'v6e4',
      kind: 'listen',
      prompt: 'Послухай і обери число',
      audioText: 'Les prix vont augmenter de quatre pour cent.',
      options: ['4 %', '14 %', '40 %'],
      answer: 0,
    },
    {
      id: 'v6e5',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Une grève est prévue jeudi.',
      translation: 'На четвер заплановано страйк.',
    },
  ],
}

/* ------------------------------------------------------------------ *
 * B2 — real speech has hesitations; textbooks never show them
 * ------------------------------------------------------------------ */

const interviewRadio: VideoLesson = {
  id: 'interview-radio',
  title: 'Une interview à la radio',
  titleUk: 'Інтерв’ю на радіо',
  level: 'B2',
  emoji: '🎙️',
  minutes: 9,
  blurb:
    'Справжня мова — з «euh», «ben», «enfin» і незакінченими реченнями. Підручники цього не показують, а в житті воно всюди. Плюс: пом’якшення й обережні формулювання.',
  transcript: [
    {
      t: 0,
      fr: 'Bonjour et merci d’être avec nous. Vous êtes libraire depuis vingt ans, c’est bien ça ?',
      uk: 'Добрий день, дякуємо, що ви з нами. Ви книгар уже двадцять років, правильно?',
    },
    {
      t: 6,
      fr: 'Oui, enfin… vingt-deux, pour être exact. Mais bon, on ne compte plus.',
      uk: 'Так, ну… двадцять два, якщо точно. Але, зрештою, вже й не рахуєш.',
    },
    {
      t: 12,
      fr: 'On dit souvent que les gens ne lisent plus. Qu’est-ce que vous en pensez ?',
      uk: 'Часто кажуть, що люди більше не читають. Що ви про це думаєте?',
    },
    {
      t: 18,
      fr: 'Euh… c’est pas si simple. Ils lisent autrement, disons.',
      uk: 'Емм… не все так просто. Вони читають інакше, скажімо так.',
    },
    {
      t: 23,
      fr: 'Moins de romans, peut-être, mais beaucoup plus de… enfin, de tout, en fait.',
      uk: 'Менше романів, можливо, але значно більше… ну, усього, власне.',
    },
    {
      t: 30,
      fr: 'Vous avez beau dire, les chiffres baissent, non ?',
      uk: 'Хай там як ви кажете, а цифри падають, хіба ні?',
    },
    {
      t: 35,
      fr: 'Certes, les chiffres baissent. Mais ça ne veut pas dire grand-chose.',
      uk: 'Певна річ, цифри падають. Але це мало про що свідчить.',
    },
    {
      t: 41,
      fr: 'Ce qui m’inquiète, c’est plutôt qu’on lise tous la même chose.',
      uk: 'Що мене турбує — то радше те, що ми всі читаємо те саме.',
    },
    {
      t: 48,
      fr: 'Si j’avais un conseil à donner, ce serait : entrez dans une librairie sans savoir ce que vous cherchez.',
      uk: 'Якби я мав дати одну пораду, вона була б така: зайдіть у книгарню, не знаючи, що ви шукаєте.',
    },
    { t: 57, fr: 'Merci beaucoup pour ce moment.', uk: 'Щиро дякуємо за цю розмову.' },
  ],
  vocab: ['w_croire', 'w_penser', 'w_expliquer', 'w_important', 'w_probleme'],
  exercises: [
    {
      id: 'v7e1',
      kind: 'mcq',
      prompt: 'Заповнювачі',
      question: 'Навіщо в мовленні «euh», «ben», «enfin»?',
      options: [
        'Це паузи на роздуми — ознака нормального мовлення',
        'Це помилки, яких треба уникати',
        'Це особливість південного акценту',
      ],
      answer: 0,
      explain:
        'Носії теж шукають слова. Упізнавати ці звуки важливо: інакше здається, що ти щось пропустив.',
    },
    {
      id: 'v7e2',
      kind: 'mcq',
      prompt: 'Поступка',
      question: '«Vous avez beau dire, les chiffres baissent» — що означає «avoir beau»?',
      options: ['Хай там що ви кажете — а все одно…', 'Ви гарно говорите', 'Вам варто сказати'],
      answer: 0,
      explain: 'avoir beau + інфінітив = «дарма що», «хай навіть». Модуль 21.',
    },
    {
      id: 'v7e3',
      kind: 'cloze',
      prompt: 'Неозначений відносний',
      sentence: '___ m’inquiète, c’est qu’on lise tous la même chose.',
      answer: ['Ce qui'],
      translation: 'Що мене турбує — то те, що ми всі читаємо те саме.',
      options: ['Ce qui', 'Ce que', 'Ce dont'],
      explain: 'Підмет підрядного → ce qui. Модуль 20.',
    },
    {
      id: 'v7e4',
      kind: 'listen',
      prompt: 'Послухай і обери зміст',
      audioText: 'Certes, les chiffres baissent. Mais ça ne veut pas dire grand-chose.',
      options: [
        'Погоджується з фактом, але не з висновком',
        'Повністю погоджується',
        'Заперечує самі цифри',
      ],
      answer: 0,
      explain: '«Certes…, mais…» — визнати й одразу заперечити. Ознака зрілого аргументу.',
    },
    {
      id: 'v7e5',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Ce n’est pas si simple.',
      translation: 'Не все так просто.',
    },
    {
      id: 'v7e6',
      kind: 'translate',
      prompt: 'Переклади французькою',
      question: 'Це мало про що свідчить.',
      answer: ['ça ne veut pas dire grand-chose', 'ca ne veut pas dire grand chose'],
    },
  ],
}

/* ------------------------------------------------------------------ *
 * B2 — announcements: distorted, formal, and unavoidable
 * ------------------------------------------------------------------ */

const annoncesGare: VideoLesson = {
  id: 'annonces-gare',
  title: 'Annonces et messages',
  titleUk: 'Оголошення й автовідповідачі',
  level: 'B2',
  emoji: '🚉',
  minutes: 7,
  blurb:
    'Вокзал, автовідповідач, автоінформатор. Формальні звороти, майбутній час і безособові конструкції — там, де перепитати нема кого.',
  transcript: [
    {
      t: 0,
      fr: 'Le train à destination de Marseille, départ quatorze heures douze, partira voie sept.',
      uk: 'Потяг до Марселя, відправлення о 14:12, відійде з сьомої колії.',
    },
    {
      t: 8,
      fr: 'En raison d’un incident technique, ce train accuse un retard d’environ vingt minutes.',
      uk: 'Через технічний інцидент цей потяг затримується приблизно на двадцять хвилин.',
    },
    {
      t: 15,
      fr: 'Nous vous prions de bien vouloir nous excuser pour la gêne occasionnée.',
      uk: 'Просимо вибачення за спричинені незручності.',
    },
    {
      t: 21,
      fr: 'Il est rappelé aux voyageurs qu’il est interdit de fumer dans l’ensemble de la gare.',
      uk: 'Нагадуємо пасажирам, що курити на всій території вокзалу заборонено.',
    },
    {
      t: 29,
      fr: 'Bonjour, vous êtes bien chez Claire et Antoine. Nous ne sommes pas disponibles pour le moment.',
      uk: 'Добрий день, ви додзвонилися до Клер і Антуана. Наразі нас немає.',
    },
    {
      t: 36,
      fr: 'Merci de laisser un message après le bip, nous vous rappellerons dès que possible.',
      uk: 'Будь ласка, залиште повідомлення після сигналу, ми передзвонимо якнайшвидше.',
    },
    {
      t: 43,
      fr: 'Votre appel est important pour nous. Tous nos conseillers sont actuellement occupés.',
      uk: 'Ваш дзвінок важливий для нас. Усі наші оператори зараз зайняті.',
    },
    {
      t: 50,
      fr: 'Votre temps d’attente est estimé à sept minutes. Veuillez patienter.',
      uk: 'Орієнтовний час очікування — сім хвилин. Будь ласка, зачекайте.',
    },
  ],
  vocab: ['le_train', 'la_gare', 'w_partir', 'w_arriver', 'w_telephoner'],
  exercises: [
    {
      id: 'v8e1',
      kind: 'mcq',
      prompt: 'З якої колії?',
      question: 'Le train pour Marseille partira de quelle voie ?',
      options: ['Voie 7', 'Voie 12', 'Voie 14'],
      answer: 0,
      optionsAreFrench: true,
      explain: 'Обережно: «quatorze heures douze» — це час, а не колія.',
    },
    {
      id: 'v8e2',
      kind: 'mcq',
      prompt: 'Формула вибачення',
      question: '«Nous vous prions de bien vouloir nous excuser» — це…',
      options: ['Дуже офіційне «перепрошуємо»', 'Прохання пробачити комусь іншому', 'Наказ вийти'],
      answer: 0,
      explain: '«Prier de bien vouloir» — верх офіційності. У розмові так ніхто не каже.',
    },
    {
      id: 'v8e3',
      kind: 'mcq',
      prompt: 'Безособовий пасив',
      question: '«Il est rappelé aux voyageurs que…» — хто нагадує?',
      options: ['Ніхто конкретно — безособова форма', 'Машиніст', 'Пасажири одне одному'],
      answer: 0,
      explain: 'Оголошення уникають діяча. Це впізнаваний маркер офіційного стилю.',
    },
    {
      id: 'v8e4',
      kind: 'listen',
      prompt: 'На скільки затримка?',
      audioText: 'Ce train accuse un retard d’environ vingt minutes.',
      options: ['Близько 20 хвилин', 'Рівно 20 годин', 'Затримки немає'],
      answer: 0,
    },
    {
      id: 'v8e5',
      kind: 'dictation',
      prompt: 'Запиши почуте',
      text: 'Veuillez patienter.',
      translation: 'Будь ласка, зачекайте.',
    },
  ],
}

export const VIDEOS_2: VideoLesson[] = [
  auTelephone,
  francaisParle,
  lesInfos,
  interviewRadio,
  annoncesGare,
]
