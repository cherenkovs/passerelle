import { SCENARIOS_2 } from './tutor-2'
import type { TutorScenario } from './types'

/**
 * Conversation practice.
 *
 * Deliberately scripted rather than LLM-driven: a role-play with known
 * expected answers costs nothing to run, works offline, and — crucially — can
 * give *precise* feedback ("you forgot the article", "that's the informal
 * form") instead of a generic model reply. The teacher's lines are spoken by
 * the synthesiser; the learner answers by voice or keyboard.
 */

const rencontre: TutorScenario = {
  id: 'rencontre',
  title: 'Перше знайомство',
  level: 'A1',
  emoji: '🤝',
  setting: 'Ти на мовних курсах у Ліоні. Викладачка вітається з тобою.',
  goal: 'Навчитися представлятися і підтримати коротку розмову',
  turns: [
    {
      id: 'r1',
      teacher: { fr: 'Bonjour ! Comment allez-vous ?', uk: 'Добрий день! Як ви?' },
      expected: {
        fr: 'Ça va bien, merci. Et vous ?',
        uk: 'Добре, дякую. А ви?',
        accept: [
          'ça va bien merci et vous',
          'ça va bien, merci. et vous ?',
          'ça va bien merci',
          'très bien merci et vous',
          'ça va merci et vous',
        ],
      },
      hint: 'Почни з «Ça va bien», подякуй і поверни питання: «Et vous ?»',
    },
    {
      id: 'r2',
      teacher: {
        fr: 'Très bien aussi, merci. Comment vous appelez-vous ?',
        uk: 'Теж дуже добре, дякую. Як вас звати?',
      },
      expected: {
        fr: "Je m'appelle Maryna.",
        uk: 'Мене звати Марина.',
        accept: ["je m'appelle maryna"],
        // Кажи своє справжнє ім'я — приймається будь-яке.
        acceptPrefixes: ["je m'appelle", 'je mappelle', 'je suis', "moi c'est"],
      },
      hint: "Формула: Je m'appelle + ім'я",
    },
    {
      id: 'r3',
      teacher: {
        // Без роду в питанні — сценарій має працювати і для Марини, і для Сергія.
        fr: "Enchantée ! Vous êtes d'ici ?",
        uk: 'Дуже приємно! Ви звідси?',
      },
      expected: {
        fr: 'Non, je suis ukrainien{ne}.',
        uk: 'Ні, я з України.',
        accept: ['non je suis ukrainien{ne}', 'je suis ukrainien{ne}'],
      },
      hint: 'Заперечення + національність: ukrainien / ukrainienne',
    },
    {
      id: 'r4',
      teacher: { fr: "D'où venez-vous exactement ?", uk: 'Звідки саме ви?' },
      expected: {
        fr: 'Je viens de Kyiv, en Ukraine.',
        uk: 'Я з Києва, з України.',
        accept: [
          'je viens de kyiv',
          'je viens de kyiv en ukraine',
          "je viens d'ukraine",
          'je viens de kiev',
        ],
      },
      hint: 'venir de + місто',
    },
    {
      id: 'r5',
      teacher: { fr: 'Et vous habitez à Lyon maintenant ?', uk: 'І ви тепер живете в Ліоні?' },
      expected: {
        fr: "Oui, j'habite à Lyon.",
        uk: 'Так, я живу в Ліоні.',
        accept: ["oui j'habite à lyon", "j'habite à lyon", "oui, j'habite à lyon"],
      },
      hint: 'habiter à + місто. Не забудь апостроф: j’habite',
    },
    {
      id: 'r6',
      teacher: {
        fr: 'Parfait ! Vous parlez déjà bien. Bonne journée !',
        uk: 'Чудово! Ви вже добре говорите. Гарного дня!',
      },
      expected: {
        fr: 'Merci beaucoup, au revoir !',
        uk: 'Дуже дякую, до побачення!',
        accept: ['merci beaucoup au revoir', 'merci, au revoir', 'merci au revoir', 'au revoir'],
      },
    },
  ],
}

const auCafe: TutorScenario = {
  id: 'au-cafe',
  title: 'У кафе',
  level: 'A1',
  emoji: '☕',
  setting: 'Паризька брасері, обідній час. Офіціант підходить до твого столика.',
  goal: 'Зробити замовлення й попросити рахунок',
  turns: [
    {
      id: 'c1',
      teacher: { fr: 'Bonjour ! Vous avez choisi ?', uk: 'Добрий день! Ви обрали?' },
      expected: {
        fr: 'Oui, je voudrais un café, s’il vous plaît.',
        uk: 'Так, я хотів би каву, будь ласка.',
        accept: [
          "oui je voudrais un café s'il vous plaît",
          'je voudrais un café',
          "je voudrais un café s'il vous plaît",
          'oui, je voudrais un café',
        ],
      },
      hint: 'Ввічлива формула: Je voudrais + замовлення + s’il vous plaît',
    },
    {
      id: 'c2',
      teacher: {
        fr: 'Très bien. Et avec ça ? Un croissant, peut-être ?',
        uk: 'Дуже добре. І до цього? Може, круасан?',
      },
      expected: {
        fr: 'Oui, un croissant aussi, merci.',
        uk: 'Так, круасан теж, дякую.',
        accept: [
          'oui un croissant aussi merci',
          'oui, un croissant',
          'un croissant aussi',
          'oui merci',
        ],
      },
    },
    {
      id: 'c3',
      teacher: { fr: 'Et comme boisson ? De l’eau ?', uk: 'А з напоїв? Води?' },
      expected: {
        fr: 'Oui, une carafe d’eau, s’il vous plaît.',
        uk: 'Так, карафу води, будь ласка.',
        accept: [
          "oui une carafe d'eau s'il vous plaît",
          "une carafe d'eau",
          "oui de l'eau s'il vous plaît",
          "de l'eau merci",
        ],
      },
      hint: "«Карафа води» — une carafe d'eau. У Франції вона безкоштовна.",
    },
    {
      id: 'c4',
      teacher: { fr: 'Voilà ! Bon appétit.', uk: 'Прошу! Смачного.' },
      expected: {
        fr: 'Merci beaucoup !',
        uk: 'Дуже дякую!',
        accept: ['merci beaucoup', 'merci'],
      },
    },
    {
      id: 'c5',
      teacher: {
        fr: 'Tout va bien ? Vous voulez autre chose ?',
        uk: 'Усе гаразд? Бажаєте ще щось?',
      },
      expected: {
        fr: 'Non merci. L’addition, s’il vous plaît.',
        uk: 'Ні, дякую. Рахунок, будь ласка.',
        accept: [
          "non merci l'addition s'il vous plaît",
          "l'addition s'il vous plaît",
          "non merci, l'addition",
          "l'addition",
        ],
      },
      hint: 'У Франції рахунок треба попросити — самі не принесуть.',
    },
    {
      id: 'c6',
      teacher: {
        fr: 'Bien sûr. Cela fait six euros quarante.',
        uk: 'Звісно. Виходить шість євро сорок.',
      },
      expected: {
        fr: 'Voilà. Merci, bonne journée !',
        uk: 'Прошу. Дякую, гарного дня!',
        accept: [
          'voilà merci bonne journée',
          'merci bonne journée',
          'voilà, merci',
          'merci au revoir',
        ],
      },
    },
  ],
}

const demanderChemin: TutorScenario = {
  id: 'demander-chemin',
  title: 'Питаємо дорогу',
  level: 'A1',
  emoji: '🧭',
  setting: 'Ти загубився в центрі Ліона й зупиняєш перехожу.',
  goal: 'Ввічливо звернутися, спитати дорогу й подякувати',
  turns: [
    {
      id: 'd1',
      teacher: { fr: 'Oui ? Je peux vous aider ?', uk: 'Так? Можу допомогти?' },
      expected: {
        fr: 'Excusez-moi, où est la gare, s’il vous plaît ?',
        uk: 'Перепрошую, де вокзал, будь ласка?',
        accept: [
          "excusez-moi où est la gare s'il vous plaît",
          'où est la gare',
          'excusez-moi, où est la gare',
          "où est la gare s'il vous plaît",
        ],
      },
      hint: 'Excusez-moi + Où est + місце + s’il vous plaît',
    },
    {
      id: 'd2',
      teacher: {
        fr: 'La gare ? Continuez tout droit, puis tournez à gauche.',
        uk: 'Вокзал? Ідіть прямо, потім поверніть ліворуч.',
      },
      expected: {
        fr: 'C’est loin ?',
        uk: 'Це далеко?',
        accept: ["c'est loin", "c'est loin ?", 'est-ce que c’est loin', 'c est loin'],
      },
      hint: 'Дві коротких слова: C’est + loin',
    },
    {
      id: 'd3',
      teacher: { fr: 'Non, c’est à dix minutes à pied.', uk: 'Ні, це за десять хвилин пішки.' },
      expected: {
        fr: 'Merci beaucoup, madame !',
        uk: 'Дуже дякую, пані!',
        accept: ['merci beaucoup madame', 'merci beaucoup', 'merci madame', 'merci'],
      },
    },
    {
      id: 'd4',
      teacher: { fr: 'Je vous en prie. Bonne journée !', uk: 'Прошу. Гарного дня!' },
      expected: {
        fr: 'Bonne journée, au revoir !',
        uk: 'Гарного дня, до побачення!',
        accept: ['bonne journée au revoir', 'au revoir', 'bonne journée'],
      },
    },
  ],
}

const parlerDeSoi: TutorScenario = {
  id: 'parler-de-soi',
  title: 'Розповідь про себе',
  level: 'A2',
  emoji: '💬',
  setting: 'Співбесіда на мовних курсах — треба розповісти про себе кількома реченнями.',
  goal: 'Зв’язно говорити про роботу, родину та щоденні звички',
  turns: [
    {
      id: 'p1',
      teacher: {
        fr: 'Bonjour ! Parlez-moi un peu de vous. Qu’est-ce que vous faites dans la vie ?',
        uk: 'Добрий день! Розкажіть трохи про себе. Чим ви займаєтесь?',
      },
      expected: {
        fr: 'Je suis ingénieur{e} et je travaille dans un bureau.',
        uk: 'Я інженер і працюю в офісі.',
        accept: [
          'je suis ingénieur{e} et je travaille dans un bureau',
          'je suis ingénieur{e}',
          'je travaille dans un bureau',
          'je suis étudiant{e}',
        ],
      },
      hint: 'Je suis + професія (без артикля!) + et je travaille…',
    },
    {
      id: 'p2',
      teacher: { fr: 'Vous avez une famille ?', uk: 'У вас є родина?' },
      expected: {
        fr: "Oui, j'ai un frère et une sœur.",
        uk: 'Так, у мене брат і сестра.',
        accept: [
          "oui j'ai un frère et une sœur",
          "j'ai un frère et une sœur",
          "oui j'ai une famille",
          "j'ai deux enfants",
        ],
      },
      hint: 'avoir + неозначені артиклі un/une',
    },
    {
      id: 'p3',
      teacher: {
        fr: 'Et qu’est-ce que vous avez fait le week-end dernier ?',
        uk: 'А що ви робили минулого вихідного?',
      },
      expected: {
        fr: 'Je suis allé{e} au musée avec un ami.',
        uk: 'Я ходив у музей з другом.',
        accept: [
          'je suis allé{e} au musée',
          "j'ai visité un musée",
          'je suis resté{e} à la maison',
        ],
      },
      hint: 'Минулий час: aller бере être → je suis allé / allée',
    },
    {
      id: 'p4',
      teacher: {
        fr: 'Pourquoi est-ce que vous apprenez le français ?',
        uk: 'Чому ви вчите французьку?',
      },
      expected: {
        fr: "J'apprends le français parce que j'habite en France.",
        uk: 'Я вчу французьку, бо живу у Франції.',
        accept: [
          "j'apprends le français parce que j'habite en france",
          "parce que j'habite en france",
          "parce que j'aime la langue",
          'pour mon travail',
        ],
      },
      hint: 'parce que = тому що',
    },
    {
      id: 'p5',
      teacher: {
        fr: 'Très bien ! Votre français est déjà très correct. Merci et bonne continuation !',
        uk: 'Дуже добре! Ваша французька вже цілком правильна. Дякую і успіхів!',
      },
      expected: {
        fr: 'Merci beaucoup, au revoir !',
        uk: 'Дуже дякую, до побачення!',
        accept: ['merci beaucoup au revoir', 'merci beaucoup', 'merci, au revoir'],
      },
    },
  ],
}

const chezLeMedecin: TutorScenario = {
  id: 'chez-le-medecin',
  title: 'У лікаря',
  level: 'A2',
  emoji: '🩺',
  setting: 'Кабінет сімейного лікаря. Ти погано почуваєшся третій день.',
  goal: 'Описати симптоми й зрозуміти рекомендації',
  turns: [
    {
      id: 'm1',
      teacher: {
        fr: 'Bonjour, installez-vous. Qu’est-ce qui ne va pas ?',
        uk: 'Добрий день, сідайте. Що вас турбує?',
      },
      expected: {
        fr: "J'ai mal à la tête depuis trois jours.",
        uk: 'У мене болить голова три дні.',
        accept: [
          "j'ai mal à la tête depuis trois jours",
          "j'ai mal à la tête",
          "j'ai mal à la gorge",
        ],
      },
      hint: 'avoir mal à + частина тіла',
    },
    {
      id: 'm2',
      teacher: { fr: 'Vous avez de la fièvre ?', uk: 'У вас є температура?' },
      expected: {
        fr: 'Oui, un peu. Trente-huit degrés.',
        uk: 'Так, трохи. Тридцять вісім градусів.',
        accept: ['oui un peu', 'oui un peu trente-huit degrés', 'non, pas de fièvre', 'oui'],
      },
    },
    {
      id: 'm3',
      teacher: {
        fr: 'Est-ce que vous vous sentez fatigué{e} aussi ?',
        uk: 'Ви також відчуваєте втому?',
      },
      expected: {
        fr: 'Oui, je suis très fatigué{e}.',
        uk: 'Так, я дуже втомився.',
        accept: ['oui je suis très fatigué{e}', 'oui je suis fatigué{e}', 'oui très fatigué{e}'],
      },
      hint: 'Прикметник узгоджується з тобою: fatigué / fatiguée.',
    },
    {
      id: 'm4',
      teacher: {
        fr: 'Bon. Prenez ce médicament deux fois par jour et reposez-vous.',
        uk: 'Гаразд. Приймайте ці ліки двічі на день і відпочивайте.',
      },
      expected: {
        fr: 'D’accord. Merci beaucoup, docteur.',
        uk: 'Добре. Дуже дякую, лікарю.',
        accept: [
          "d'accord merci beaucoup docteur",
          "d'accord merci",
          'merci beaucoup docteur',
          'merci docteur',
        ],
      },
    },
  ],
}

/** Ordered by level, so the list reads as a progression. */
const RANK: Record<string, number> = { A0: 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 }

export const SCENARIOS: TutorScenario[] = [
  rencontre,
  auCafe,
  demanderChemin,
  parlerDeSoi,
  chezLeMedecin,
  ...SCENARIOS_2,
].sort((a, b) => RANK[a.level] - RANK[b.level])

export function getScenario(id: string) {
  return SCENARIOS.find((s) => s.id === id)
}
