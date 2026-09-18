/**
 * The questions Ukrainian learners actually ask, answered once, well.
 *
 * This is the professor's own knowledge — the part that is neither a
 * dictionary entry nor a lesson rule. Each answer is written to be read on
 * its own, in a minute, by someone who has just hit the problem: the rule,
 * the trap it sets for a Ukrainian speaker in particular, and two or three
 * examples they can hear. Where a lesson goes deeper, `grammar` is the search
 * that finds it in the reference, so the professor can point there.
 *
 * `keys` are what a question is matched on: accent-free, lower-case, and
 * including the ways people misspell the French term and the Ukrainian stems
 * they would use. A key is matched as a prefix of the learner's word once it
 * is four letters long, which is what makes "артиклі", "артикль" and
 * "артиклем" all land here.
 */

export type Faq = {
  id: string
  /** The question as the professor would phrase it — shown as a suggestion. */
  q: string
  keys: string[]
  /** RichText: **bold**, *French*, lists, > callouts. */
  a: string
  examples?: { fr: string; uk: string }[]
  /** A query into the grammar reference that finds the fuller rule. */
  grammar?: string
  /** The lesson to send them to, where the rule is not a grammar step. */
  lesson?: string
}

export const FAQ: Faq[] = [
  {
    id: 'un-une-le-la',
    q: 'Коли un/une, а коли le/la?',
    keys: [
      'артикл',
      'un',
      'une',
      'le',
      'la',
      'les',
      'des',
      'неозначен',
      'означен',
      'обрати артикль',
    ],
    a: `**un / une / des** — коли предмет *будь-який*, вперше згаданий, один із багатьох. **le / la / les** — коли *саме цей*, відомий обом, або клас предметів узагалі.

Практична перевірка: якщо українською можна вставити «якийсь / один» — ставимо *un / une*. Якщо можна вставити «цей / той самий» — *le / la*.

Пастка для українця: в нас артиклів немає, тому ми їх просто пропускаємо. У французькій іменник майже ніколи не стоїть голим — артикль обов'язковий.`,
    examples: [
      { fr: 'Je cherche un café.', uk: 'Я шукаю (якесь) кафе.' },
      { fr: 'Le café est fermé.', uk: '(Це) кафе зачинене.' },
      { fr: "J'aime le café.", uk: 'Я люблю каву (взагалі).' },
    ],
    grammar: 'le чи un',
  },
  {
    id: 'gender',
    q: 'Як визначити рід іменника?',
    keys: ['рід', 'роду', 'чоловіч', 'жіноч', 'genre', 'masculin', 'feminin', 'закінченн'],
    a: `Рід треба вчити разом зі словом — *le livre*, *la table* — а не окремо. Але закінчення підказує правильно приблизно у 80 % випадків.

**Зазвичай жіночий:** *-e* (крім *-age, -isme*), *-tion / -sion*, *-té*, *-ure*, *-ette*, *-ence / -ance*.
**Зазвичай чоловічий:** приголосна на кінці, *-age*, *-ment*, *-isme*, *-eau*, *-ier*.

Головна пастка: рід **не збігається** з українським. *le livre* — книга (чол.), *la voiture* — автомобіль (жін.), *le problème* — проблема (чол.).`,
    examples: [
      { fr: 'la nation, la liberté, la voiture', uk: 'жіночий: -tion, -té, -ure' },
      { fr: 'le fromage, le gouvernement, le bateau', uk: 'чоловічий: -age, -ment, -eau' },
      { fr: 'le problème, le système', uk: 'винятки: грецькі слова на -ème — чоловічі' },
    ],
    grammar: 'закінчення підказує рід',
  },
  {
    id: 'avoir-age',
    q: 'Чому «мені 25 років» — це j’ai 25 ans?',
    keys: [
      'рок',
      'вік',
      'ans',
      'j ai',
      'jai',
      'скільки років',
      'avoir faim',
      'голод',
      'faim',
      'soif',
    ],
    a: `У французькій вік, голод, спрагу, страх і холод не *є*, а *мають*: **avoir** + іменник.

*J'ai 25 ans* — дослівно «я маю 25 років». *J'ai faim* — «я маю голод». Сказати *je suis 25 ans* або *je suis faim* — груба помилка, яку одразу чути.

Запам'ятай пачкою: *avoir faim / soif / peur / froid / chaud / raison / tort / sommeil / … ans*.`,
    examples: [
      { fr: "J'ai vingt-cinq ans.", uk: 'Мені 25 років.' },
      { fr: 'Tu as faim ?', uk: 'Ти голодний?' },
      { fr: 'Elle a raison.', uk: 'Вона має рацію.' },
    ],
    grammar: 'я МАЮ 25 років',
  },
  {
    id: 'tu-vous',
    q: 'Коли tu, а коли vous?',
    keys: ['tu', 'vous', 'ти', 'ви', 'ввічлив', 'звертанн', 'tutoyer', 'vouvoyer'],
    a: `**vous** — до незнайомих, старших, у магазині, на роботі, з чиновниками. І до кількох людей — завжди. **tu** — до друзів, родини, дітей, і коли тобі самому запропонували: *On peut se tutoyer ?*

Правило безпеки: сумніваєшся — кажи *vous*. Зайве *vous* звучить чемно, зайве *tu* — фамільярно.

Не забудь, що з *vous* змінюється й дієслово: *tu parles* → *vous parlez*.`,
    examples: [
      {
        fr: 'Vous pouvez répéter, s’il vous plaît ?',
        uk: 'Можете повторити, будь ласка? (до незнайомого)',
      },
      { fr: 'Tu viens ce soir ?', uk: 'Ти прийдеш сьогодні ввечері? (до друга)' },
    ],
    grammar: 'tu та vous',
  },
  {
    id: 'ne-pas',
    q: 'Як будується заперечення?',
    keys: ['запереч', 'ne', 'pas', 'не', 'ne pas', 'ніколи', 'jamais', 'rien', 'personne', 'plus'],
    a: `Заперечення — це **дві частини**, які обіймають дієслово: *ne* + дієслово + *pas*. Перед голосною *ne* стає *n'*.

Замість *pas* можуть стояти інші «другі половинки»: *jamais* (ніколи), *rien* (нічого), *personne* (ніхто), *plus* (більше не).

У живій мові *ne* часто зникає — *je sais pas* — але писати так не варто. І ще: після заперечення *un / une / des* перетворюються на **de**: *Je n'ai pas de voiture.*`,
    examples: [
      { fr: 'Je ne comprends pas.', uk: 'Я не розумію.' },
      { fr: "Il n'est jamais en retard.", uk: 'Він ніколи не спізнюється.' },
      { fr: "Je n'ai pas de frère.", uk: 'У мене немає брата. (de, не un)' },
    ],
    grammar: 'заперечення обіймає дієслово',
  },
  {
    id: 'pc-vs-imparfait',
    q: 'Passé composé чи imparfait?',
    keys: [
      'passe compose',
      'imparfait',
      'минул',
      'минулого',
      'різниц',
      'коли imparfait',
      'коли passe',
    ],
    a: `Найкраща опора для українця — **вид дієслова**.

**Passé composé** ≈ доконаний вид: *що сталося*, одна завершена дія, подія, яку можна порахувати. «Я *прочитав* книгу» → *J'ai lu le livre.*

**Imparfait** ≈ недоконаний вид: *що було, тривало, повторювалося*, фон, опис, звичка. «Я *читав* щовечора» → *Je lisais tous les soirs.*

У розповіді вони працюють разом: imparfait малює декорацію, passé composé — те, що на її тлі *сталося*.`,
    examples: [
      { fr: 'Il pleuvait quand je suis sorti.', uk: 'Ішов дощ (фон), коли я вийшов (подія).' },
      {
        fr: "Quand j'étais petit, j'habitais à Kyiv.",
        uk: 'Коли я був малим, я жив у Києві. (стан, звичка)',
      },
      { fr: "Hier, j'ai vu Marie.", uk: 'Вчора я побачив Марі. (одна подія)' },
    ],
    grammar: 'Декорація і те, що сталося',
  },
  {
    id: 'etre-avoir-pc',
    q: 'Коли passé composé з être, а коли з avoir?',
    keys: [
      'etre',
      'avoir',
      'допоміжн',
      'allé',
      'alle',
      'venu',
      'passe compose etre',
      'узгодж',
      'дієприкметник',
    ],
    a: `Майже всі дієслова беруть **avoir**. З **être** — невелика група дієслів руху та зміни стану (*aller, venir, partir, arriver, entrer, sortir, monter, descendre, naître, mourir, rester, tomber, retourner, passer, devenir*) і **всі зворотні** (*se lever, s'appeler…*).

З *être* дієприкметник **узгоджується** з підметом, як прикметник: *elle est allée*, *ils sont partis*. З *avoir* — ні (за винятком, який тут не потрібен).

Підказка: «прийшов, пішов, народився, помер, залишився, впав» — усе це «être-дієслова».`,
    examples: [
      { fr: 'Je suis allée au marché.', uk: 'Я (жінка) пішла на ринок.' },
      { fr: "J'ai acheté du pain.", uk: 'Я купив хліба.' },
      { fr: 'Nous nous sommes levés tôt.', uk: 'Ми встали рано. (зворотне → être)' },
    ],
    grammar: 'бере être замість avoir',
  },
  {
    id: 'futur-proche-vs-simple',
    q: 'Futur proche чи futur simple?',
    keys: ['майбутн', 'futur', 'aller', 'futur proche', 'futur simple', 'буде', 'збираюся'],
    a: `**Futur proche** (*aller* + інфінітив) — те, що зараз збираєшся зробити, найближчі плани, у розмові — майже завжди. *Je vais partir.* — я зараз піду / збираюся піти.

**Futur simple** — далекі плани, обіцянки, передбачення, офіційна мова, і після *quand / lorsque* про майбутнє. *Je partirai en juin.*

У побутовій розмові французи вживають futur proche набагато частіше, ніж підручники дають зрозуміти.`,
    examples: [
      { fr: 'On va manger ?', uk: 'Підемо поїмо? (зараз)' },
      { fr: "Un jour, j'irai au Japon.", uk: 'Колись я поїду в Японію. (далеке)' },
      {
        fr: 'Quand tu arriveras, appelle-moi.',
        uk: 'Коли приїдеш, подзвони. (після quand — futur simple)',
      },
    ],
    grammar: 'Коли futur, а коли aller',
  },
  {
    id: 'subjonctif',
    q: 'Коли потрібен subjonctif?',
    keys: ['subjonctif', 'умовн', 'il faut que', 'que je', 'спосіб', 'бажанн', 'сумнів'],
    a: `Subjonctif з'являється після **que**, коли головне речення виражає не факт, а *ставлення* до дії: бажання, необхідність, емоцію, сумнів.

Чотири групи тригерів:
1. Необхідність: *il faut que, il est nécessaire que*
2. Бажання: *je veux que, je voudrais que, j'aimerais que*
3. Емоція: *je suis content que, j'ai peur que, c'est dommage que*
4. Сумнів: *je ne pense pas que, je doute que, il est possible que*

**Не** потрібен після *je pense que, je sais que, il est certain que* (це факти) і після *espérer*.`,
    examples: [
      { fr: 'Il faut que tu viennes.', uk: 'Треба, щоб ти прийшов.' },
      { fr: 'Je veux que tu sois là.', uk: 'Я хочу, щоб ти був там.' },
      { fr: 'Je pense qu’il vient.', uk: 'Я думаю, що він прийде. (факт → indicatif)' },
    ],
    grammar: 'Чотири групи тригерів',
  },
  {
    id: 'liaison',
    q: 'Що таке liaison і коли воно обов’язкове?',
    keys: ['liaison', 'зв язуванн', 'звязуванн', 'німа', 'вимовляється', 'vous avez', 'les amis'],
    a: `Німа приголосна в кінці слова «оживає» перед голосною наступного слова й приклеюється до нього: *les amis* [le‿za.mi], *vous avez* [vu‿za.ve].

**Обов'язково:** артикль + іменник (*les enfants*), займенник + дієслово (*nous avons*, *ils ont*), прикметник + іменник (*petit ami*), після *très, en, dans, chez* (*très intéressant*).

**Заборонено:** після *et* (*et‿un* — ніколи), перед *h aspiré* (*les héros*), після однини іменника (*un étudiant / américain* — без зв'язки).

Звук змінюється: *s, x* → [z]; *d* → [t]; *f* → [v] у *neuf ans*.`,
    examples: [
      { fr: 'Ils ont deux enfants.', uk: '[il‿zɔ̃ dø‿zɑ̃.fɑ̃] — три зв’язки в одному реченні' },
      { fr: 'un grand ami', uk: '[œ̃ ɡʁɑ̃‿ta.mi] — d звучить як t' },
    ],
    grammar: 'liaison',
  },
  {
    id: 'silent-letters',
    q: 'Які букви в кінці слова не читаються?',
    keys: ['німі', 'не читаєт', 'кінц', 'закінченн', 'careful', 'ent', 'читанн', 'вимов'],
    a: `Більшість кінцевих приголосних — німі: *petit* [pə.ti], *Paris* [pa.ʁi], *beaucoup* [bo.ku].

Читаються зазвичай **C, R, F, L** — шпаргалка «CaReFuL»: *sac, bonjour, neuf, hôtel*. Виняток: *-er* в інфінітивах та *-ier* читається [e] без r: *parler* [paʁ.le].

Найпідступніше — закінчення **-ent** у дієсловах: *ils parlent* звучить точно як *il parle*. Але в прислівниках *-ment* читається: *vraiment* [vʁɛ.mɑ̃].

Кінцеве **e** без наголосу — німе, але робить попередню приголосну чутною: *grand* [ɡʁɑ̃] → *grande* [ɡʁɑ̃d].`,
    examples: [
      { fr: 'Ils parlent français.', uk: '[il paʁl] — -ent не звучить' },
      { fr: 'petit / petite', uk: '[pə.ti] / [pə.tit] — е «вмикає» t' },
    ],
    lesson: 'm1l1',
  },
  {
    id: 'nasals',
    q: 'Як вимовляти носові голосні?',
    keys: ['носов', 'nasal', 'on', 'an', 'en', 'in', 'ain', 'un', 'bon', 'vin', 'ніс'],
    a: `Носовий голосний — це голосна, під час якої повітря йде і через рот, і через ніс. Сама *n / m* при цьому **не вимовляється**.

Три основні:
- **[ɔ̃]** — *on, om*: *bon, nom, maison*. Як «он», але в ніс.
- **[ɑ̃]** — *an, am, en, em*: *grand, enfant, temps*. Як «ан» у ніс.
- **[ɛ̃]** — *in, im, ain, ein, un*: *vin, pain, un, matin*. Як «ен» у ніс.

Перевірка: затисни ніс і скажи *bon*. Якщо звук «застряг» — ти на правильному шляху. Важливо: *bon* [bɔ̃] і *bonne* [bɔn] — різні слова: перед голосною носовість зникає.`,
    examples: [
      { fr: 'un bon vin blanc', uk: '[œ̃ bɔ̃ vɛ̃ blɑ̃] — усі чотири носові в одній фразі' },
      { fr: 'bon / bonne', uk: '[bɔ̃] / [bɔn] — носовий / не носовий' },
    ],
    lesson: 'm1l1',
  },
  {
    id: 'r',
    q: 'Як вимовляти французьке R?',
    keys: ['r', 'ер', 'горл', 'увулярн', 'rouge', 'paris'],
    a: `Французьке **R** [ʁ] — не наше розкотисте, а звук у глибині горла, близький до українського **х**, але з голосом (як у «гарно», якщо казати м'яко, задньою частиною язика).

Вправа: скажи «ага», затримай останній звук і додай голос. Або: полощи горло без води.

Не намагайся зробити його гучним — у французькій *R* часто ледь чутне, особливо в кінці слова: *bonjour* [bɔ̃.ʒuʁ] звучить майже як «бонжу(х)».`,
    examples: [{ fr: 'rouge, rue, Paris, merci', uk: 'R на початку, у середині, в кінці' }],
    lesson: 'm1l1',
  },
  {
    id: 'cest-vs-il-est',
    q: 'C’est чи il est?',
    keys: ['c est', 'cest', 'il est', 'це', 'він є', 'професі'],
    a: `**C'est** + артикль/іменник/ім'я: *C'est un ami. C'est Marie. C'est bon.* — «це є хтось/щось».

**Il est** + прикметник або професія **без артикля**: *Il est médecin. Il est gentil.* — «він є яким».

Тест: якщо після «є» стоїть *un / une / le / la* або ім'я — це *c'est*. Якщо голий прикметник або професія — *il / elle est*.

Пастка: *Il est un médecin* — помилка. Або *Il est médecin*, або *C'est un médecin*.`,
    examples: [
      { fr: "C'est un bon restaurant.", uk: 'Це хороший ресторан.' },
      { fr: 'Elle est ingénieure.', uk: 'Вона інженерка. (без артикля)' },
      { fr: "C'est une ingénieure brillante.", uk: 'Це блискуча інженерка. (з артиклем → c’est)' },
    ],
    grammar: 'Професія — без артикля',
  },
  {
    id: 'savoir-connaitre',
    q: 'Savoir чи connaître?',
    keys: ['savoir', 'connaitre', 'знати', 'знаю', 'вміти'],
    a: `Обидва — «знати», але:

**savoir** — знати *факт*, *як* щось робити, *що* / *де* / *коли*: *Je sais nager. Je sais qu'il vient. Tu sais où c'est ?*

**connaître** — бути *знайомим* з людиною, місцем, твором: *Je connais Marie. Tu connais Lyon ? Je connais ce film.*

Після *connaître* завжди стоїть іменник, ніколи — підрядне речення чи інфінітив.`,
    examples: [
      { fr: 'Je sais parler français.', uk: 'Я вмію говорити французькою.' },
      { fr: 'Je connais un bon café.', uk: 'Я знаю одне хороше кафе.' },
    ],
  },
  {
    id: 'bon-bien',
    q: 'Bon чи bien?',
    keys: ['bon', 'bien', 'добре', 'хороший', 'добрий'],
    a: `**bon / bonne** — прикметник, описує *іменник*: хороший, смачний, добрий. *Un bon livre. C'est bon !* (смачно).

**bien** — прислівник, описує *дію*: добре. *Il parle bien. C'est bien !* (це добре, молодець).

Українська плутає їх, бо «добре» в нас — і те, і те. Перевір: якщо можна замінити на «хороший» — *bon*; якщо на «як?» — *bien*.`,
    examples: [
      { fr: "C'est un bon film.", uk: 'Це хороший фільм.' },
      { fr: 'Tu chantes bien.', uk: 'Ти добре співаєш.' },
    ],
  },
  {
    id: 'partitif',
    q: 'Що таке du / de la і коли їх вживати?',
    keys: ['du', 'de la', 'de l', 'частков', 'partitif', 'невідлічуван', 'їжа', 'трохи'],
    a: `**du / de la / de l'** — «частковий артикль»: невизначена *кількість* чогось, що не рахується на штуки. *Je mange du pain* — я їм (трохи / якусь кількість) хліба.

Українською тут родовий відмінок або нічого: «їм хліб / п'ю воду». Французька вимагає артикль.

Після заперечення й після слів кількості — просто **de**: *Je ne mange pas de pain. Beaucoup de pain. Un kilo de pommes.*`,
    examples: [
      { fr: 'Je voudrais du café, s’il vous plaît.', uk: 'Я хотів би кави, будь ласка.' },
      { fr: "Il n'y a plus de lait.", uk: 'Молока більше немає.' },
      { fr: 'Un peu de sucre.', uk: 'Трохи цукру.' },
    ],
    grammar: 'Артикль для «невідлічуваного»',
  },
  {
    id: 'countries',
    q: 'À, en чи au перед назвою країни?',
    keys: ['країн', 'en', 'au', 'aux', 'à', 'ukraine', 'france', 'місто', 'в україні', 'у франції'],
    a: `**à** + місто: *à Kyiv, à Paris*.
**en** + країна жіночого роду (майже всі на *-e*): *en Ukraine, en France, en Italie*.
**au** + країна чоловічого роду: *au Canada, au Japon, au Portugal*.
**aux** + країна в множині: *aux États-Unis, aux Pays-Bas*.

«З країни» дзеркально: *de France, d'Ukraine* (жін.), *du Canada* (чол.), *des États-Unis* (мн.).`,
    examples: [
      { fr: "J'habite en Ukraine, à Lviv.", uk: 'Я живу в Україні, у Львові.' },
      { fr: 'Il va au Canada.', uk: 'Він їде в Канаду.' },
      { fr: 'Je viens d’Ukraine.', uk: 'Я з України.' },
    ],
    grammar: 'я з України',
  },
  {
    id: 'questions',
    q: 'Як поставити запитання?',
    keys: ['питанн', 'запитанн', 'est ce que', 'інверс', 'question', 'як спитати'],
    a: `Три способи, від розмовного до формального:

1. **Інтонація** — те саме речення, голос угору: *Tu viens ?*
2. **Est-ce que** + речення: *Est-ce que tu viens ?* — нейтрально, найбезпечніше.
3. **Інверсія** — дієслово перед займенником через дефіс: *Viens-tu ?* — письмово й офіційно.

З питальним словом: *Où est-ce que tu vas ? / Où vas-tu ? / Tu vas où ?* — усі три правильні, останній — розмовний.`,
    examples: [
      { fr: 'Est-ce que vous parlez ukrainien ?', uk: 'Ви говорите українською?' },
      { fr: 'Quelle heure est-il ?', uk: 'Котра година? (інверсія)' },
      { fr: 'Tu habites où ?', uk: 'Ти де живеш? (розмовно)' },
    ],
    grammar: 'Три регістри одного питання',
  },
  {
    id: 'numbers-70-99',
    q: 'Чому 80 — це quatre-vingts?',
    keys: [
      'числ',
      'вісімдесят',
      'сімдесят',
      'дев яносто',
      'девяносто',
      'quatre vingts',
      'soixante dix',
      '70',
      '80',
      '90',
    ],
    a: `Залишок давньої лічби двадцятками. Після 69 французька (у Франції) перестає рахувати десятками:

- **70** = *soixante-dix* (60 + 10), 71 = *soixante et onze*, 75 = *soixante-quinze*
- **80** = *quatre-vingts* (4 × 20), 81 = *quatre-vingt-un*
- **90** = *quatre-vingt-dix* (4 × 20 + 10), 99 = *quatre-vingt-dix-neuf*

У Бельгії та Швейцарії кажуть простіше: *septante, huitante / octante, nonante* — і тебе зрозуміють у Франції, хоч і посміхнуться.`,
    examples: [
      { fr: 'soixante-quinze', uk: '75' },
      { fr: 'quatre-vingt-douze', uk: '92' },
    ],
    grammar: 'Найдивніше в французькій',
  },
  {
    id: 'on',
    q: 'Що означає займенник on?',
    keys: ['on', 'ми', 'люди', 'кажуть', 'займенник on'],
    a: `**on** — форма третьої особи однини (*on parle*, як *il parle*), але значень у неї три:

1. **ми** — у розмові майже завжди замість *nous*: *On va au cinéma ?* — Підемо в кіно?
2. **люди, взагалі** — як українське «кажуть», «тут говорять»: *En France, on mange tard.*
3. **хтось** — *On frappe à la porte.* — Хтось стукає.

Дієслово завжди в однині, навіть коли *on* = ми.`,
    examples: [
      { fr: 'On y va ?', uk: 'Ходімо? (ми)' },
      { fr: 'Ici, on parle français.', uk: 'Тут говорять французькою.' },
    ],
    grammar: 'Одна форма — три українські значення',
  },
  {
    id: 'y-en',
    q: 'Коли y, а коли en?',
    keys: ['y', 'en', 'займенник', 'туди', 'там', 'цього', 'j en', 'j y'],
    a: `Обидва замінюють цілі шматки речення, щоб не повторювати.

**y** = *à* + щось / місце: «туди, там, про це». *Tu vas à Paris ? — J'y vais demain.* *Tu penses à ça ? — J'y pense.*

**en** = *de* + щось / кількість: «цього, їх, звідти». *Tu veux du café ? — J'en veux.* *Tu as des frères ? — J'en ai deux.*

Обидва стоять **перед** дієсловом. Підказка: чуєш *à* — думай *y*; чуєш *de / du / des* — думай *en*.`,
    examples: [
      { fr: "J'y vais.", uk: 'Я туди йду.' },
      { fr: "J'en ai deux.", uk: 'У мене їх два.' },
    ],
    grammar: 'y та en',
  },
  {
    id: 'adjective-position',
    q: 'Прикметник перед іменником чи після?',
    keys: [
      'прикметник',
      'після іменник',
      'перед іменник',
      'порядок',
      'bangs',
      'grand',
      'petit',
      'beau',
    ],
    a: `За замовчуванням — **після**: *une voiture rouge, un film intéressant*. Це навпаки від української, і саме тут українці найчастіше помиляються.

**Перед** іменником стоїть коротка група найуживаніших: краса, вік, добро, розмір — *beau, joli, jeune, vieux, nouveau, bon, mauvais, grand, petit, gros*. Англомовна шпаргалка — «BAGS»: Beauty, Age, Goodness, Size.

Кілька прикметників змінюють значення від позиції: *un homme grand* — високий, *un grand homme* — великий (видатний).`,
    examples: [
      {
        fr: 'une petite maison blanche',
        uk: 'маленький білий будинок — petit перед, blanche після',
      },
      { fr: 'un ancien collègue / un bâtiment ancien', uk: 'колишній колега / старовинна будівля' },
    ],
    grammar: 'Прикметник зазвичай ПІСЛЯ іменника',
  },
  {
    id: 'comparison',
    q: 'Як порівнювати: plus, moins, aussi?',
    keys: [
      'порівнянн',
      'plus que',
      'moins que',
      'aussi que',
      'більше',
      'менше',
      'найкращ',
      'meilleur',
    ],
    a: `Три конструкції, всі з **que**:
- **plus** … *que* — більше, ніж: *Il est plus grand que moi.*
- **moins** … *que* — менше, ніж: *C'est moins cher qu'ici.*
- **aussi** … *que* — так само, як: *Elle est aussi forte que lui.*

Найвищий ступінь — артикль + *plus / moins*: *le plus grand, la moins chère*.

Винятки: *bon → meilleur* (не «plus bon»), *bien → mieux*. *C'est meilleur. Il parle mieux.*`,
    examples: [
      { fr: 'Le métro est plus rapide que le bus.', uk: 'Метро швидше за автобус.' },
      { fr: "C'est le meilleur café de la ville.", uk: 'Це найкраще кафе в місті.' },
    ],
    grammar: 'Три конструкції порівняння',
  },
  {
    id: 'reflexive',
    q: 'Що таке зворотні дієслова (se lever, s’appeler)?',
    keys: ['зворотн', 'se', 'se lever', 's appeler', 'sappeler', 'pronominal', 'реф'],
    a: `Зворотне дієслово несе з собою займенник, що змінюється за особою: *je **me** lève, tu **te** lèves, il **se** lève, nous **nous** levons, vous **vous** levez, ils **se** lèvent*. Перед голосною — *m', t', s'*: *je m'appelle*.

В українській це «-ся»: *умиватися, називатися, прокидатися*. Але збіг не повний: *se lever* — вставати (без «-ся»), а *rester* — залишатися (не зворотне).

У passé composé — завжди з **être**: *Je me suis levé(e) à sept heures.*`,
    examples: [
      { fr: "Je m'appelle Oksana.", uk: 'Мене звати Оксана.' },
      { fr: 'Nous nous couchons tard.', uk: 'Ми лягаємо пізно.' },
    ],
    grammar: 'Зворотні дієслова',
  },
  {
    id: 'depuis-pendant',
    q: 'Depuis, pendant чи il y a?',
    keys: ['depuis', 'pendant', 'il y a', 'протягом', 'тому', 'з того часу', 'уже'],
    a: `Три слова про час, які українець плутає:

**depuis** — «уже / з (певного часу)», дія триває досі, дієслово в **présent**: *J'habite ici depuis deux ans* — я живу тут уже два роки.

**pendant** — «протягом», закінчений відрізок: *J'ai vécu à Paris pendant deux ans* — я прожив у Парижі два роки (і вже не там).

**il y a** — «тому»: *Je suis arrivé il y a deux ans* — я приїхав два роки тому.`,
    examples: [
      { fr: "J'apprends le français depuis six mois.", uk: 'Я вчу французьку вже пів року.' },
      { fr: 'Il a dormi pendant dix heures.', uk: 'Він проспав десять годин.' },
    ],
  },
  {
    id: 'accents',
    q: 'Навіщо потрібні é, è, ê, ç і чи можна їх не писати?',
    keys: ['діакрит', 'акцент', 'accent', 'é', 'è', 'ê', 'ç', 'седій', 'надрядков', 'знак'],
    a: `Це не прикраси, а частина написання — як крапка над **ї**.

- **é** (aigu) — закритий [e]: *été, café*.
- **è / ê** (grave / circonflexe) — відкритий [ɛ]: *mère, fête*.
- **à / où** — розрізняють слова: *a* (має) / *à* (в), *ou* (або) / *où* (де).
- **ç** — [s] перед *a, o, u*: *français, garçon*.

Без акцентів *marche* (крокує) і *marché* (ринок) — різні слова. У цьому додатку відповідь без акценту зараховується як «майже», щоб ти не втрачав темп, але привчайся ставити їх одразу.`,
    examples: [
      { fr: 'Le marché / il marche', uk: 'ринок / він іде' },
      { fr: 'Où est-il ? — Il est à Lyon ou à Paris.', uk: 'où (де) ≠ ou (або); à (в) ≠ a (має)' },
    ],
  },
  {
    id: 'plus-pronunciation',
    q: 'Як читається plus — [ply] чи [plys]?',
    keys: ['plus', 'плюс', 'більше', 'читається plus'],
    a: `Залежить від значення:

- **[ply]** (s німе) — у запереченні «більше не»: *Je ne fume plus* [ply].
- **[plys]** (s звучить) — «більше» як кількість, наприкінці фрази, і в математиці: *J'en veux plus* [plys], *deux plus deux*.
- **[plyz]** — зв'язування перед голосною: *plus intéressant* [ply.zɛ̃…].

Найважливіше: *ne … plus* — завжди [ply]. Скажеш [plys] — і «я більше не хочу» перетвориться на «я хочу більше».`,
    examples: [
      { fr: 'Je ne veux plus de café.', uk: '[ply] — я більше не хочу кави' },
      { fr: "J'en veux plus.", uk: '[plys] — я хочу ще' },
    ],
  },
  {
    id: 'chez',
    q: 'Що означає chez?',
    keys: ['chez', 'у когось', 'додому', 'до лікаря'],
    a: `**chez** + людина = «у (когось), до (когось)», у місці, яке з цією людиною пов'язане: дім, кабінет, магазин.

*chez moi* — у мене вдома, *chez le médecin* — у лікаря / до лікаря, *chez Marie* — у Марі, *chez le boulanger* — у булочника.

Не плутай із *à*: *à la maison* — вдома (місце), *chez moi* — у мене (в моєму місці).`,
    examples: [
      { fr: 'Je rentre chez moi.', uk: 'Я йду додому.' },
      { fr: 'Elle est chez le dentiste.', uk: 'Вона в стоматолога.' },
    ],
  },
  {
    id: 'il-y-a',
    q: 'Що означає il y a?',
    keys: ['il y a', 'ilya', 'є', 'існує', 'знаходиться'],
    a: `**il y a** — «є, існує, знаходиться». Незмінна безособова конструкція, завжди в однині — навіть коли далі множина.

*Il y a un problème.* — Є проблема. *Il y a des gens.* — Є люди. Заперечення: *Il n'y a pas de…* Питання: *Est-ce qu'il y a… ? / Y a-t-il… ?*

Друге значення — «тому» з часом: *il y a deux ans* — два роки тому.`,
    examples: [
      { fr: 'Il y a un café en face.', uk: 'Навпроти є кафе.' },
      { fr: "Il n'y a personne.", uk: 'Нікого немає.' },
    ],
    grammar: 'il y a',
  },
  {
    id: 'faire-du',
    q: 'Faire du sport, faire de la musique — чому du?',
    keys: ['faire du', 'faire de la', 'займатися', 'спорт', 'jouer'],
    a: `**faire du / de la / de l'** + заняття = «займатися чимось»: *faire du sport, faire de la natation, faire de l'escalade*. Частковий артикль тут — частина сталої конструкції.

Для музичних інструментів — **jouer du / de la**: *jouer du piano, jouer de la guitare*. Для ігор і спорту з м'ячем — **jouer au / à la**: *jouer au football, jouer aux cartes*.

Після заперечення — *de*: *Je ne fais pas de sport.*`,
    examples: [
      { fr: 'Je fais du vélo le week-end.', uk: 'На вихідних я катаюся на велосипеді.' },
      { fr: 'Elle joue du violon.', uk: 'Вона грає на скрипці.' },
    ],
  },
  {
    id: 'politeness',
    q: 'Як ввічливо попросити?',
    keys: [
      'ввічлив',
      'попросити',
      'прохання',
      'будь ласка',
      's il vous plait',
      'je voudrais',
      'pourriez',
    ],
    a: `Від простого до найчемнішого:

1. *Un café, s'il vous plaît.* — Каву, будь ласка. (у кафе — цілком нормально)
2. **Je voudrais** … — Я хотів би… (conditionnel від *vouloir*; *je veux* звучить як наказ)
3. **Pourriez-vous** … ? / **Est-ce que vous pourriez** … ? — Чи не могли б ви…
4. *Ça vous dérangerait de* … ? — Вам не важко було б…

І завжди: *Bonjour* на вході, *merci*, *au revoir* на виході. Без *bonjour* прохання французам здається грубим, хоч би яким чемним було далі.`,
    examples: [
      { fr: 'Je voudrais un croissant, s’il vous plaît.', uk: 'Я хотів би круасан, будь ласка.' },
      { fr: 'Pourriez-vous parler plus lentement ?', uk: 'Чи не могли б ви говорити повільніше?' },
    ],
    grammar: 'Ввічливість = je voudrais',
  },
  {
    id: 'false-friends',
    q: 'Які французькі слова обманюють українця?',
    keys: ['хибн', 'фальшив', 'друз', 'faux amis', 'схож', 'обман', 'journal', 'magasin'],
    a: `Слова, які виглядають знайомо, але означають інше:

- *le magasin* — **магазин**, а *le magazine* — журнал.
- *le journal* — **газета**, не журнал.
- *la librairie* — **книгарня**, не бібліотека (*la bibliothèque*).
- *la figure* — **обличчя**, не фігура.
- *le régime* — переважно **дієта**.
- *actuellement* — **зараз**, не «актуально».
- *la conférence* — **лекція**.
- *sympathique* — **приємний, милий**, не «симпатичний» зовні.
- *le chef* — **керівник, шеф**, не тільки кухар.`,
    examples: [
      { fr: "J'ai acheté le journal à la librairie.", uk: 'Я купив газету в книгарні.' },
      { fr: 'Actuellement, je travaille à Lyon.', uk: 'Зараз я працюю в Ліоні.' },
    ],
  },
  {
    id: 'time',
    q: 'Як сказати котра година?',
    keys: ['година', 'котра', 'час', 'heure', 'quelle heure', 'пів на', 'чверть'],
    a: `**Il est** + число + **heure(s)**: *Il est trois heures.* — Третя година. *Il est une heure* (однина!).

Хвилини просто додаються: *trois heures dix* — 3:10. Спеціальні слова: *et quart* (чверть по), *et demie* (пів), *moins le quart* (за чверть).

*Il est midi* — полудень, *il est minuit* — північ. Офіційно — 24-годинний формат: *quinze heures trente* (15:30).

Пастка: «пів на четверту» українською = 3:30 = *trois heures et demie* (пів **після** третьої), а не «four».`,
    examples: [
      { fr: 'Il est huit heures et demie.', uk: '8:30 — пів на дев’яту' },
      { fr: 'Il est midi moins le quart.', uk: '11:45' },
    ],
    grammar: 'Il est… heures',
  },
  {
    id: 'ca-va',
    q: 'Що відповідати на ça va?',
    keys: ['ca va', 'ça va', 'як справи', 'comment allez vous', 'привіт', 'відповісти'],
    a: `*Ça va ?* — і питання, і відповідь одразу: **— Ça va ? — Ça va, et toi ?**

Варіанти відповіді: *Ça va bien, merci* (добре), *Très bien* (дуже добре), *Pas mal* (непогано), *Bof* (так собі — розмовно), *Ça peut aller* (терпимо).

Офіційніше: *Comment allez-vous ? — Je vais bien, merci, et vous ?* Не кажи *je suis bien* — це «мені зручно», а не «я в порядку».`,
    examples: [
      { fr: 'Salut ! Ça va ? — Ça va, et toi ?', uk: 'Привіт! Як справи? — Добре, а в тебе?' },
      { fr: 'Comment allez-vous ? — Très bien, merci.', uk: 'Як ся маєте? — Дуже добре, дякую.' },
    ],
  },
  {
    id: 'tout',
    q: 'Tout, toute, tous чи toutes?',
    keys: ['tout', 'tous', 'toute', 'toutes', 'весь', 'усі', 'все'],
    a: `**tout** узгоджується з іменником:
- *tout le monde* — усі (чол. одн.: *le monde*)
- *toute la journée* — увесь день (жін. одн.)
- *tous les jours* — щодня (чол. мн.) — **s** не читається: [tu]
- *toutes les femmes* — усі жінки (жін. мн.)

Як займенник «усі» *tous* читається **[tus]** — з s: *Ils sont tous là* [tus].

Як прислівник «зовсім, дуже» — незмінне: *tout doucement, il est tout content*.`,
    examples: [
      { fr: 'Tout le monde est là.', uk: 'Усі тут. (дієслово в однині!)' },
      { fr: 'Je travaille tous les jours.', uk: 'Я працюю щодня.' },
    ],
  },
  {
    id: 'encore-toujours',
    q: 'Encore чи toujours — «ще» чи «завжди»?',
    keys: ['encore', 'toujours', 'ще', 'досі', 'завжди', 'все ще'],
    a: `**toujours** — «завжди», але також «досі, все ще»: *Il est toujours là* — він досі тут / він завжди тут (контекст).

**encore** — «ще» (додатково, повторно, досі): *Encore un café ?* — Ще кави? *Il dort encore* — він ще спить.

Із запереченням: *ne … pas encore* — ще не: *Je n'ai pas encore fini.* А *ne … plus* — більше не: *Je ne fume plus.*`,
    examples: [
      { fr: 'Tu es encore là ?', uk: 'Ти ще тут?' },
      { fr: "Je n'ai pas encore mangé.", uk: 'Я ще не їв.' },
    ],
  },
  {
    id: 'imperative',
    q: 'Як утворити наказовий спосіб?',
    keys: ['наказов', 'imperatif', 'impératif', 'наказ', 'зроби', 'скажи'],
    a: `Береш форми *tu / nous / vous* теперішнього часу й **прибираєш займенник**: *Parle ! Parlons ! Parlez !*

Для дієслів на *-er* (і *aller*) у формі *tu* зникає кінцеве **s**: *tu parles* → *Parle !*, *tu vas* → *Va !*

Нерегулярні: *être — sois, soyons, soyez*; *avoir — aie, ayons, ayez*; *savoir — sache, sachons, sachez*.

Зворотні дієслова ставлять займенник **після** з дефісом, а *te* стає *toi*: *Lève-toi ! Dépêchez-vous !* У запереченні — назад уперед: *Ne te lève pas.*`,
    examples: [
      { fr: 'Écoute et répète.', uk: 'Слухай і повторюй.' },
      { fr: 'Asseyez-vous, s’il vous plaît.', uk: 'Сідайте, будь ласка.' },
    ],
    grammar: 'Наказовий спосіб',
  },
]

export function getFaq(id: string): Faq | undefined {
  return FAQ.find((f) => f.id === id)
}
