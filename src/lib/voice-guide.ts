/**
 * What a good French voice is on this particular machine, and how to get one.
 *
 * Web Speech reads whatever the operating system has installed, and what it has
 * by default is often poor — on a Mac, mostly the novelty voices; on Windows,
 * nothing French at all until a language pack is added. The app cannot install
 * anything, so the next best thing is to name the voices worth having on the
 * system the learner is actually using, say which are already there, and give
 * the steps rather than a vague "check your settings".
 *
 * The steps are in three languages, which is not the same as translating the
 * app. They quote menu items, and those read in whatever language the *system*
 * is set to — a Ukrainian learner on an English Mac is looking for "Spoken
 * Content", and «Вимовний контент» will not be on their screen anywhere.
 */

export type Platform = 'macos' | 'ios' | 'windows' | 'android' | 'linux' | 'unknown'

/** The three the learner might have their system in: their own, English, French. */
export type GuideLang = 'uk' | 'en' | 'fr'
export type Localized = Record<GuideLang, string>

export const GUIDE_LANGS: { id: GuideLang; label: string }[] = [
  { id: 'uk', label: 'Українською' },
  { id: 'en', label: 'English' },
  { id: 'fr', label: 'Français' },
]

export function detectPlatform(ua = typeof navigator === 'undefined' ? '' : navigator.userAgent) {
  const s = ua.toLowerCase()
  // iPad reports itself as a Mac, so the touch points decide it.
  const iPadAsMac =
    /macintosh/.test(s) && typeof navigator !== 'undefined' && (navigator.maxTouchPoints ?? 0) > 1
  if (/iphone|ipad|ipod/.test(s) || iPadAsMac) return 'ios' as Platform
  if (/android/.test(s)) return 'android' as Platform
  if (/windows|win32|win64/.test(s)) return 'windows' as Platform
  if (/macintosh|mac os x/.test(s)) return 'macos' as Platform
  if (/linux|x11|cros/.test(s)) return 'linux' as Platform
  return 'unknown' as Platform
}

/** The control a step is pointing at, drawn beside it so it can be recognised. */
export type StepIcon = 'settings' | 'accessibility' | 'speech' | 'info' | 'download' | 'globe'

export type Step = Localized & { icon?: StepIcon }

export type VoiceGuide = {
  /** Voices worth having here, best first, matched as lowercase substrings. */
  recommended: string[]
  steps: Step[]
  /**
   * The help page, in each language.
   *
   * One link in one language is the wrong thing to hand someone: the page has
   * to match the system they are reading their own menus in, or the words will
   * not line up with the screenshots.
   */
  href?: Localized
  hrefLabel?: Localized
  note?: Localized
}

const APPLE_NOTE: Localized = {
  uk: 'Обери «Покращена» або «Преміум» — це окреме завантаження, і саме воно звучить як людина.',
  en: 'Pick the “Enhanced” or “Premium” download — that is the one that sounds human.',
  fr: 'Choisis la version « Améliorée » ou « Premium » : c’est celle qui sonne humaine.',
}

const RESTART_NOTE: Localized = {
  uk: 'Після встановлення повністю закрий браузер і відкрий знову: він читає список голосів один раз при запуску.',
  en: 'Then quit the browser completely and reopen it — it reads the system voice list once, at startup.',
  fr: 'Ensuite, quitte complètement le navigateur et rouvre-le : il ne lit la liste des voix qu’au démarrage.',
}

const APPLE_LABEL: Localized = {
  uk: 'Інструкція Apple',
  en: 'Apple’s instructions',
  fr: 'Instructions d’Apple',
}

function join(a: Localized, b: Localized): Localized {
  return { uk: `${a.uk} ${b.uk}`, en: `${a.en} ${b.en}`, fr: `${a.fr} ${b.fr}` }
}

export const VOICE_GUIDES: Record<Platform, VoiceGuide> = {
  macos: {
    recommended: ['aurélie', 'aurelie', 'audrey', 'marie', 'thomas'],
    steps: [
      {
        icon: 'settings',
        uk: 'Меню Apple  → «Системні параметри» → «Доступність» на бічній панелі (можливо, доведеться прокрутити вниз)',
        en: 'Apple menu  → System Settings → Accessibility in the sidebar (you may need to scroll down)',
        fr: 'Menu Pomme  → Réglages Système → Accessibilité dans la barre latérale (il faudra peut-être faire défiler)',
      },
      {
        icon: 'speech',
        uk: 'Клацни «Читання і мовлення» (у старіших macOS — «Вимовний контент»)',
        en: 'Click Read & Speak (called Spoken Content on older macOS)',
        fr: 'Clique sur « Lire et énoncer » (« Contenu énoncé » sur les anciens macOS)',
      },
      {
        icon: 'info',
        uk: 'Біля «Основний голос» клацни кнопку «Досьє» ⓘ',
        en: 'Next to “System voice”, click the Info button ⓘ',
        fr: 'En regard de « Voix système », clique sur le bouton d’informations ⓘ',
      },
      {
        icon: 'download',
        uk: 'Français (France) → клацни Aurélie чи Audrey і завантаж; тоді перезапусти браузер',
        en: 'French (France) → click Aurélie or Audrey and download it, then restart the browser',
        fr: 'Français (France) → clique sur Aurélie ou Audrey et télécharge, puis redémarre le navigateur',
      },
    ],
    href: {
      uk: 'https://support.apple.com/uk-ua/guide/mac-help/mchlp2290/mac',
      en: 'https://support.apple.com/en-gb/guide/mac-help/mchlp2290/mac',
      fr: 'https://support.apple.com/fr-fr/guide/mac-help/mchlp2290/mac',
    },
    hrefLabel: APPLE_LABEL,
    note: join(APPLE_NOTE, RESTART_NOTE),
  },
  ios: {
    recommended: ['aurélie', 'aurelie', 'audrey', 'marie', 'thomas'],
    steps: [
      {
        icon: 'settings',
        uk: 'Параметри → «Доступність» → «Читання і мовлення» (раніше «Вимовний контент»)',
        en: 'Settings → Accessibility → Read & Speak (formerly Spoken Content)',
        fr: 'Réglages → Accessibilité → « Lire et énoncer » (autrefois « Contenu énoncé »)',
      },
      {
        icon: 'speech',
        uk: '«Голоси» → «Французька»',
        en: 'Voices → French',
        fr: '« Voix » → « Français »',
      },
      {
        icon: 'download',
        uk: 'Завантаж Aurélie або Audrey',
        en: 'Download Aurélie or Audrey',
        fr: 'Télécharge Aurélie ou Audrey',
      },
    ],
    href: {
      uk: 'https://support.apple.com/uk-ua/guide/iphone/iph96b214f0/ios',
      en: 'https://support.apple.com/en-gb/guide/iphone/iph96b214f0/ios',
      fr: 'https://support.apple.com/fr-fr/guide/iphone/iph96b214f0/ios',
    },
    hrefLabel: APPLE_LABEL,
    note: APPLE_NOTE,
  },
  windows: {
    recommended: ['denise', 'hortense', 'julie', 'paul'],
    steps: [
      {
        icon: 'settings',
        uk: 'Параметри → Час і мова → Мова та регіон',
        en: 'Settings → Time & language → Language & region',
        fr: 'Paramètres → Heure et langue → Langue et région',
      },
      {
        icon: 'globe',
        uk: 'Додати мову → «Французька (Франція)»',
        en: 'Add a language → “French (France)”',
        fr: 'Ajouter une langue → « Français (France) »',
      },
      {
        icon: 'speech',
        uk: 'У параметрах мови постав «Мовлення»',
        en: 'In Language options, tick “Speech”',
        fr: 'Dans Options linguistiques, coche « Voix »',
      },
      {
        icon: 'download',
        uk: 'Перезапусти браузер',
        en: 'Restart the browser',
        fr: 'Redémarre le navigateur',
      },
    ],
    href: {
      uk: 'https://support.microsoft.com/uk-ua/windows/manage-the-language-and-keyboard-input-layout-settings-in-windows-219f28b0-9881-cd4c-75ca-dba919c52321',
      en: 'https://support.microsoft.com/en-us/windows/manage-the-language-and-keyboard-input-layout-settings-in-windows-219f28b0-9881-cd4c-75ca-dba919c52321',
      fr: 'https://support.microsoft.com/fr-fr/windows/manage-the-language-and-keyboard-input-layout-settings-in-windows-219f28b0-9881-cd4c-75ca-dba919c52321',
    },
    hrefLabel: {
      uk: 'Інструкція Microsoft',
      en: 'Microsoft’s instructions',
      fr: 'Instructions de Microsoft',
    },
    note: {
      uk: `Microsoft Denise — найприродніша з французьких. ${RESTART_NOTE.uk}`,
      en: `Microsoft Denise is the most natural French one. ${RESTART_NOTE.en}`,
      fr: `Microsoft Denise est la plus naturelle des voix françaises. ${RESTART_NOTE.fr}`,
    },
  },
  android: {
    recommended: ['google français', 'google french', 'français'],
    steps: [
      {
        icon: 'settings',
        uk: 'Налаштування → Спеціальні можливості → Синтез мовлення',
        en: 'Settings → Accessibility → Text-to-speech output',
        fr: 'Paramètres → Accessibilité → Synthèse vocale',
      },
      {
        icon: 'speech',
        uk: 'Google Синтезатор мовлення → Встановити мовні дані',
        en: 'Google Text-to-speech → Install voice data',
        fr: 'Synthèse vocale Google → Installer les données vocales',
      },
      {
        icon: 'download',
        uk: 'Завантаж «Français (France)»',
        en: 'Download “Français (France)”',
        fr: 'Télécharge « Français (France) »',
      },
    ],
    href: {
      uk: 'https://support.google.com/accessibility/android/answer/6006983?hl=uk',
      en: 'https://support.google.com/accessibility/android/answer/6006983?hl=en',
      fr: 'https://support.google.com/accessibility/android/answer/6006983?hl=fr',
    },
    hrefLabel: {
      uk: 'Інструкція Google',
      en: 'Google’s instructions',
      fr: 'Instructions de Google',
    },
  },
  linux: {
    recommended: ['google français', 'google french'],
    steps: [
      {
        uk: 'Системні голоси в Linux (espeak) звучать механічно',
        en: 'The built-in Linux voices (espeak) sound mechanical',
        fr: 'Les voix système de Linux (espeak) sonnent mécaniques',
      },
      {
        uk: 'У Chrome доступні голоси Google — вони кращі, але потребують інтернету',
        en: 'Chrome offers Google’s voices — better, but they need a connection',
        fr: 'Chrome propose les voix de Google — meilleures, mais elles exigent une connexion',
      },
      {
        uk: 'Обери «Google français» у списку вище, якщо він є',
        en: 'Choose “Google français” in the list above, if it is there',
        fr: 'Choisis « Google français » dans la liste ci-dessus, s’il y est',
      },
    ],
    note: {
      uk: 'Голоси Google завантажуються з мережі, тож перша фраза може прозвучати із затримкою.',
      en: 'Google’s voices stream over the network, so the first phrase may lag.',
      fr: 'Les voix de Google passent par le réseau : la première phrase peut tarder.',
    },
  },
  unknown: {
    recommended: ['aurélie', 'aurelie', 'audrey', 'denise', 'google français'],
    steps: [
      {
        uk: 'Пошукай французькі голоси в налаштуваннях доступності своєї системи',
        en: 'Look for French voices in your system’s accessibility settings',
        fr: 'Cherche des voix françaises dans les réglages d’accessibilité de ton système',
      },
    ],
    note: RESTART_NOTE,
  },
}

export function voiceGuide(platform = detectPlatform()): VoiceGuide {
  return VOICE_GUIDES[platform]
}

/** Which of the recommended voices this device already has. */
export function installedRecommended(
  voices: { name: string }[],
  guide: VoiceGuide = voiceGuide(),
): string[] {
  const have = voices.map((v) => v.name.toLowerCase())
  const found = guide.recommended.filter((r) => have.some((n) => n.includes(r)))
  // "aurélie" and "aurelie" are the same voice spelled two ways; report once.
  const seen = new Set<string>()
  return found.filter((r) => {
    const key = r.normalize('NFD').replace(/[̀-ͯ]/g, '')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function missingRecommended(
  voices: { name: string }[],
  guide: VoiceGuide = voiceGuide(),
): boolean {
  return installedRecommended(voices, guide).length === 0
}
