import type { TutorScenario } from './types'

/**
 * Conversation practice at B1–B2.
 *
 * The first five scenarios all sat at A1–A2 — greetings, a café, directions.
 * But nobody stalls on ordering a coffee. What actually defeats a learner is
 * the conversation where something has gone wrong and they have to hold their
 * ground in a second language: a shop refusing a refund, an interviewer asking
 * about your weaknesses, a friend who disagrees.
 *
 * So these four are built around the moves that carry that weight — polite
 * insistence, hedged disagreement, `avoir beau`, `Certes…, mais…`, conditionnel
 * passé — which are exactly what modules 19 to 21 teach and had nowhere to be
 * practised aloud.
 *
 * Where the learner describes themselves, the French is marked `{e}` so it
 * agrees with them; the teacher's own lines never assume the learner's gender.
 */

/* ------------------------------------------------------------------ *
 * B1
 * ------------------------------------------------------------------ */

const retour: TutorScenario = {
  id: 'retour-magasin',
  title: 'Повернути покупку',
  level: 'B1',
  emoji: '🎧',
  setting: 'Ти купив(ла) навушники тиждень тому — вони зламалися. Повертаєшся в магазин.',
  goal: 'Поскаржитися ввічливо, але наполегливо — і домогтися свого',
  turns: [
    {
      id: 'rm1',
      teacher: { fr: 'Bonjour, je peux vous aider ?', uk: 'Добрий день, чим можу допомогти?' },
      expected: {
        fr: "Bonjour. J'ai acheté ces écouteurs la semaine dernière et ils ne fonctionnent plus.",
        uk: 'Добрий день. Я купив ці навушники минулого тижня, і вони більше не працюють.',
        accept: [
          "j'ai acheté ces écouteurs la semaine dernière et ils ne fonctionnent plus",
          "j'ai acheté ces écouteurs et ils ne fonctionnent plus",
          "j'ai acheté ces écouteurs la semaine dernière",
          'ces écouteurs ne fonctionnent plus',
        ],
      },
      hint: 'Спочатку факт: що купив, коли, і що не так. Без емоцій.',
    },
    {
      id: 'rm2',
      teacher: { fr: 'Vous avez le ticket de caisse ?', uk: 'У вас є чек?' },
      expected: {
        fr: 'Oui, le voici.',
        uk: 'Так, ось він.',
        accept: ['oui le voici', 'oui, le voilà', 'oui je l’ai', "oui, je l'ai", 'le voici'],
      },
      hint: '«Le voici» — «ось він». Коротко й по-французьки.',
    },
    {
      id: 'rm3',
      teacher: {
        fr: 'Qu’est-ce qui ne va pas exactement ?',
        uk: 'А що саме не так?',
      },
      expected: {
        fr: 'Le son ne sort que d’un côté.',
        uk: 'Звук іде лише з одного боку.',
        accept: [
          'le son ne sort que d’un côté',
          "le son ne sort que d'un coté",
          'ils ne s’allument plus',
          'le son ne marche que d’un côté',
          'un côté ne marche pas',
        ],
      },
      hint: '«Ne… que» — «лише». Конструкція, яку варто мати напоготові.',
    },
    {
      id: 'rm4',
      teacher: {
        fr: 'Malheureusement, je ne peux pas vous rembourser. Je peux seulement les échanger.',
        uk: 'На жаль, повернути кошти не можу. Можу лише обміняти.',
      },
      expected: {
        fr: 'Je comprends, mais ils sont tombés en panne au bout de trois jours. Je préférerais un remboursement.',
        uk: 'Розумію, але вони зламалися через три дні. Я б надав перевагу поверненню коштів.',
        accept: [
          'je comprends mais ils sont tombés en panne au bout de trois jours je préférerais un remboursement',
          'je comprends, mais je préférerais un remboursement',
          'je préférerais un remboursement',
          'je comprends mais je voudrais un remboursement',
        ],
      },
      hint: 'Ключовий хід: визнай позицію («Je comprends, mais…») і одразу назви своє.',
    },
    {
      id: 'rm5',
      teacher: {
        fr: 'Je vais voir avec mon responsable. Un instant.',
        uk: 'Я перевірю з керівником. Хвилинку.',
      },
      expected: {
        fr: 'Merci beaucoup.',
        uk: 'Дуже дякую.',
        accept: ['merci beaucoup', 'merci', 'je vous remercie', 'très bien merci'],
      },
    },
    {
      id: 'rm6',
      teacher: {
        fr: 'C’est bon, on peut vous rembourser. Vous avez votre carte ?',
        uk: 'Усе гаразд, можемо повернути кошти. Картка при вас?',
      },
      expected: {
        fr: 'Oui, la voici. Merci de votre aide.',
        uk: 'Так, ось вона. Дякую за допомогу.',
        accept: [
          'oui la voici merci de votre aide',
          'oui, la voici',
          'la voici merci',
          'merci de votre aide',
        ],
      },
    },
  ],
}

const appartement: TutorScenario = {
  id: 'visite-appartement',
  title: 'Оренда квартири',
  level: 'B1',
  emoji: '🔑',
  setting: 'Ти дивишся квартиру в Ліоні. Агентка показує помешкання.',
  goal: 'Розпитати про все, що справді важливо — і не забути про гаранта',
  turns: [
    {
      id: 'va1',
      teacher: { fr: 'Bonjour, vous avez trouvé facilement ?', uk: 'Добрий день, легко знайшли?' },
      expected: {
        fr: 'Oui, merci. C’est très bien situé.',
        uk: 'Так, дякую. Розташування дуже добре.',
        accept: [
          'oui merci c’est très bien situé',
          "oui, merci. c'est bien situé",
          'oui sans problème',
          'oui très facilement merci',
        ],
      },
    },
    {
      id: 'va2',
      teacher: {
        fr: 'Alors, voici le salon. Qu’est-ce que vous en pensez ?',
        uk: 'Отже, це вітальня. Що скажете?',
      },
      expected: {
        fr: 'C’est lumineux. Quelle est la superficie ?',
        uk: 'Тут світло. Яка площа?',
        accept: [
          'c’est lumineux quelle est la superficie',
          'quelle est la superficie',
          'ça fait combien de mètres carrés',
          'c’est lumineux',
        ],
      },
      hint: '«La superficie» — площа. На огляді це перше питання.',
    },
    {
      id: 'va3',
      teacher: {
        fr: 'Cinquante-cinq mètres carrés. Le chauffage est électrique.',
        uk: 'П’ятдесят п’ять квадратних метрів. Опалення електричне.',
      },
      expected: {
        fr: 'Les charges sont comprises dans le loyer ?',
        uk: 'Комунальні входять в оренду?',
        accept: [
          'les charges sont comprises dans le loyer',
          'est-ce que les charges sont comprises',
          'les charges sont incluses',
          'le loyer comprend les charges',
        ],
      },
      hint: '«Les charges» — комунальні платежі. Питати обов’язково.',
    },
    {
      id: 'va4',
      teacher: {
        fr: 'Non, elles sont en plus : cinquante euros par mois.',
        uk: 'Ні, вони окремо: п’ятдесят євро на місяць.',
      },
      expected: {
        fr: 'D’accord. Et il faut un garant ?',
        uk: 'Зрозуміло. А гарант потрібен?',
        accept: [
          'd’accord et il faut un garant',
          'il faut un garant',
          'est-ce qu’il faut un garant',
          'vous demandez un garant',
        ],
      },
      hint: '«Un garant» — поручитель. У Франції без нього квартиру зняти майже неможливо.',
    },
    {
      id: 'va5',
      teacher: {
        fr: 'Oui, un garant en France, c’est obligatoire.',
        uk: 'Так, гарант у Франції обов’язковий.',
      },
      expected: {
        fr: 'Je vois. Est-ce que je peux visiter la chambre ?',
        uk: 'Зрозуміло. Чи можу я подивитися спальню?',
        accept: [
          'je vois est-ce que je peux visiter la chambre',
          'est-ce que je peux voir la chambre',
          'je peux visiter la chambre',
          'on peut voir la chambre',
        ],
      },
    },
    {
      id: 'va6',
      teacher: { fr: 'Bien sûr, suivez-moi.', uk: 'Звісно, ходімо за мною.' },
      expected: {
        fr: 'Merci. L’appartement me plaît beaucoup.',
        uk: 'Дякую. Квартира мені дуже подобається.',
        accept: [
          'merci l’appartement me plaît beaucoup',
          'l’appartement me plaît',
          'ça me plaît beaucoup',
          "l'appartement me plait beaucoup",
        ],
      },
      hint: '«Me plaît», а не «j’aime»: про речі французи частіше кажуть саме так.',
    },
  ],
}

/* ------------------------------------------------------------------ *
 * B2
 * ------------------------------------------------------------------ */

const entretien: TutorScenario = {
  id: 'entretien',
  title: 'Співбесіда',
  level: 'B2',
  emoji: '💼',
  setting: 'Співбесіда в ліонській компанії. Рекрутерка починає з твого досвіду.',
  goal: 'Говорити про себе у формальному регістрі — і витримати незручне питання',
  turns: [
    {
      id: 'en1',
      teacher: {
        fr: 'Bonjour, installez-vous. Parlez-moi un peu de votre parcours.',
        uk: 'Добрий день, сідайте. Розкажіть трохи про свій шлях.',
      },
      expected: {
        fr: 'Je suis ingénieur{e} et j’ai travaillé cinq ans dans ce domaine en Ukraine.',
        uk: 'Я інженер і п’ять років працював у цій галузі в Україні.',
        accept: ['je suis ingénieur{e} et j’ai travaillé cinq ans dans ce domaine en ukraine'],
        // Своя професія, свій досвід — приймається будь-яке продовження.
        acceptPrefixes: ['je suis', 'j’ai travaillé', "j'ai travaillé", 'je travaille'],
      },
      hint: 'Назви професію без артикля: «Je suis ingénieur», не «un ingénieur».',
    },
    {
      id: 'en2',
      teacher: {
        fr: 'Qu’est-ce qui vous a amené{e} en France ?',
        uk: 'Що привело вас до Франції?',
      },
      expected: {
        fr: 'Je suis arrivé{e} en 2022 et j’ai décidé de rester.',
        uk: 'Я приїхав у 2022 році і вирішив залишитися.',
        accept: ['je suis arrivé{e} en 2022 et j’ai décidé de rester'],
        acceptPrefixes: ['je suis arrivé', 'je suis arrivée', 'je suis venu', 'je suis venue'],
      },
    },
    {
      id: 'en3',
      teacher: {
        fr: 'Votre français est tout à fait correct. Comment l’avez-vous appris ?',
        uk: 'Ваша французька цілком пристойна. Як ви її вивчили?',
      },
      expected: {
        fr: 'Je l’apprends tous les jours, surtout en travaillant.',
        uk: 'Я вчу її щодня, найбільше — працюючи.',
        accept: [
          'je l’apprends tous les jours surtout en travaillant',
          'en travaillant et en lisant',
          'je l’apprends tous les jours',
          "je l'apprends en travaillant",
        ],
      },
      hint: 'Gérondif: «en travaillant» — «працюючи». Модуль 18.',
    },
    {
      id: 'en4',
      teacher: {
        fr: 'Quel serait votre principal défaut, selon vous ?',
        uk: 'Яка, на вашу думку, ваша головна вада?',
      },
      expected: {
        fr: 'J’ai tendance à vouloir tout vérifier moi-même. J’y travaille.',
        uk: 'Я схильний усе перевіряти сам. Я над цим працюю.',
        accept: [
          'j’ai tendance à vouloir tout vérifier moi-même j’y travaille',
          'j’ai tendance à tout vérifier moi-même',
          "j'ai tendance a vouloir tout verifier moi meme",
          'je suis parfois trop perfectionniste',
        ],
      },
      hint: 'Назви справжню ваду й одразу — що з нею робиш. «J’y travaille» рятує відповідь.',
    },
    {
      id: 'en5',
      teacher: {
        fr: 'Et pourquoi vous, plutôt qu’un autre candidat ?',
        uk: 'І чому саме ви, а не інший кандидат?',
      },
      expected: {
        fr: 'Certes, je n’ai pas encore l’habitude du marché français, mais je connais ce secteur et j’apprends vite.',
        uk: 'Певна річ, я ще не звик до французького ринку, але я знаю цю галузь і швидко вчуся.',
        accept: [
          'certes je n’ai pas encore l’habitude du marché français mais je connais ce secteur et j’apprends vite',
          'certes, mais je connais ce secteur et j’apprends vite',
          'parce que je connais ce secteur et j’apprends vite',
          'je connais ce secteur et j’apprends vite',
        ],
      },
      hint: '«Certes…, mais…» — визнати слабке місце й одразу перекрити його сильним. Модуль 20.',
    },
    {
      id: 'en6',
      teacher: {
        fr: 'Très bien. Nous vous recontacterons d’ici la fin de la semaine.',
        uk: 'Дуже добре. Ми зв’яжемося з вами до кінця тижня.',
      },
      expected: {
        fr: 'Je vous remercie de votre temps. Bonne journée.',
        uk: 'Дякую за ваш час. Гарного дня.',
        accept: [
          'je vous remercie de votre temps bonne journée',
          'merci de votre temps',
          'je vous remercie bonne journée',
          'merci beaucoup bonne journée',
        ],
      },
    },
  ],
}

const desaccord: TutorScenario = {
  id: 'desaccord',
  title: 'Не погодитися ввічливо',
  level: 'B2',
  emoji: '🗯️',
  setting: 'Вечеря з друзями. Антуан заявляє, що вчити мови більше немає сенсу.',
  goal: 'Заперечити так, щоб розмова не обірвалася, а пішла далі',
  turns: [
    {
      id: 'ds1',
      teacher: {
        fr: 'Franchement, avec les traducteurs automatiques, apprendre une langue, ça n’a plus de sens.',
        uk: 'Чесно кажучи, з автоперекладачами вчити мову більше немає сенсу.',
      },
      expected: {
        fr: 'Je vois ce que tu veux dire, mais je ne suis pas tout à fait d’accord.',
        uk: 'Я розумію, про що ти, але не зовсім погоджуюся.',
        accept: [
          'je vois ce que tu veux dire mais je ne suis pas tout à fait d’accord',
          'je ne suis pas tout à fait d’accord',
          'je vois ce que tu veux dire mais je ne suis pas d’accord',
          "je ne suis pas d'accord",
        ],
      },
      hint: 'Не «tu as tort». Спершу покажи, що почув: «Je vois ce que tu veux dire, mais…».',
    },
    {
      id: 'ds2',
      teacher: { fr: 'Ah bon ? Pourquoi ?', uk: 'Справді? Чому?' },
      expected: {
        fr: 'Parce qu’une langue, ce n’est pas seulement traduire des mots.',
        uk: 'Бо мова — це не лише переклад слів.',
        accept: [
          'parce qu’une langue ce n’est pas seulement traduire des mots',
          'une langue ce n’est pas seulement des mots',
          'parce qu’une langue, c’est plus que des mots',
          "parce qu'une langue ce n'est pas que des mots",
        ],
      },
    },
    {
      id: 'ds3',
      teacher: {
        fr: 'Oui, enfin, pour commander un café ça suffit largement.',
        uk: 'Ну так, але щоб замовити каву — цілком достатньо.',
      },
      expected: {
        fr: 'Certes, pour un café. Mais essaie de te faire des amis avec un traducteur.',
        uk: 'Певна річ, для кави. Але спробуй завести друзів через перекладач.',
        accept: [
          'certes pour un café mais essaie de te faire des amis avec un traducteur',
          'certes, mais essaie de te faire des amis avec un traducteur',
          'pour un café oui mais pas pour se faire des amis',
          'certes mais pas pour se faire des amis',
        ],
      },
      hint: '«Certes…, mais…» — погодитися з вузьким і заперечити широке.',
    },
    {
      id: 'ds4',
      teacher: {
        fr: 'Tu marques un point. Mais ça prend des années !',
        uk: 'Тут ти маєш рацію. Але ж це роки!',
      },
      expected: {
        fr: 'Tu as beau dire, j’ai progressé en un an. Ça dépend surtout de la régularité.',
        uk: 'Хай там як ти кажеш, я просунувся за рік. Усе залежить радше від регулярності.',
        accept: [
          'tu as beau dire j’ai progressé en un an ça dépend surtout de la régularité',
          'tu as beau dire, j’ai progressé en un an',
          'ça dépend surtout de la régularité',
          "j'ai progressé en un an",
        ],
      },
      hint: '«Avoir beau» + інфінітив — «дарма що». Модуль 21.',
    },
    {
      id: 'ds5',
      teacher: {
        fr: 'C’est vrai que tu te débrouilles bien.',
        uk: 'Правда, ти непогано даєш раду.',
      },
      expected: {
        fr: 'Merci. Et puis j’aurais raté beaucoup de choses si j’avais attendu.',
        uk: 'Дякую. До того ж я багато чого пропустив би, якби чекав.',
        accept: [
          'merci et puis j’aurais raté beaucoup de choses si j’avais attendu',
          'j’aurais raté beaucoup de choses si j’avais attendu',
          "j'aurais rate beaucoup de choses si j'avais attendu",
          'merci j’aurais raté beaucoup de choses',
        ],
      },
      hint: 'Третій тип si: «si j’avais attendu, j’aurais raté…». Модуль 21.',
    },
    {
      id: 'ds6',
      teacher: { fr: 'Bon, tu m’as presque convaincu.', uk: 'Ну добре, ти мене майже переконав.' },
      expected: {
        fr: 'Presque ? Alors il me reste du travail !',
        uk: 'Майже? Тоді мені ще є над чим працювати!',
        accept: [
          'presque alors il me reste du travail',
          'presque ? alors il me reste du travail',
          'alors il me reste du travail',
          'presque seulement',
        ],
      },
    },
  ],
}

export const SCENARIOS_2: TutorScenario[] = [retour, appartement, entretien, desaccord]
