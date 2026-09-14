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

import accessibilityIcon from '@/assets/os-icons/accessibility.png'
import appleMenuIcon from '@/assets/os-icons/apple-menu.png'
import downloadIcon from '@/assets/os-icons/download-button.png'
import infoIcon from '@/assets/os-icons/info-button.png'
import winLanguageIcon from '@/assets/os-icons/windows-language.png'
import winLogoIcon from '@/assets/os-icons/windows-logo.png'
import winSettingsIcon from '@/assets/os-icons/windows-settings.png'

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

/**
 * A step, with glyphs written into the sentence where they belong.
 *
 * The text carries markers like {apple}, replaced by the real image from the
 * system's own documentation. Inline and in position, the way Apple writes it:
 * "choose Apple menu {apple} > System Settings, then click Accessibility
 * {accessibility} in the sidebar". An icon parked at the start of the line is
 * detached from the control it names, which is the one thing it was for —
 * someone half-reading a foreign menu is matching a shape to a word, and the
 * shape has to sit next to the word.
 */
export type Step = Localized

/** Glyphs a step's text can reference by name. */
export const STEP_IMAGES: Record<string, { src: string; alt: string }> = {
  apple: { src: appleMenuIcon, alt: 'Apple' },
  accessibility: { src: accessibilityIcon, alt: 'Accessibility' },
  info: { src: infoIcon, alt: 'Info' },
  download: { src: downloadIcon, alt: 'Download' },
  win: { src: winLogoIcon, alt: 'Windows' },
  winSettings: { src: winSettingsIcon, alt: 'Settings' },
  winLanguage: { src: winLanguageIcon, alt: 'Time & language' },
}

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
        uk: 'Меню Apple {apple} → «Системні параметри» → «Доступність» {accessibility} на бічній панелі (можливо, доведеться прокрутити вниз)',
        en: 'Apple menu {apple} → System Settings, then click Accessibility {accessibility} in the sidebar (you may need to scroll down)',
        fr: 'Menu Pomme {apple} → Réglages Système, puis Accessibilité {accessibility} dans la barre latérale (il faudra peut-être faire défiler)',
      },
      {
        uk: 'Клацни «Читання і мовлення» (у старіших macOS — «Вимовний контент»)',
        en: 'Click Read & Speak (called Spoken Content on older macOS)',
        fr: 'Clique sur « Lire et énoncer » (« Contenu énoncé » sur les anciens macOS)',
      },
      {
        uk: 'Клацни {info} поруч із «Основний голос», тоді вибери ім’я зліва',
        en: 'Click {info} next to “System voice”, then select a name on the left',
        fr: 'Clique sur {info} en regard de « Voix système », puis choisis un nom à gauche',
      },
      {
        uk: 'Français (France) → клацни Aurélie чи Audrey. Якщо поруч {download} — голос завантажиться з Apple',
        en: 'French (France) → click Aurélie or Audrey. If {download} is shown, it downloads from Apple',
        fr: 'Français (France) → clique sur Aurélie ou Audrey. Si {download} apparaît, la voix se télécharge',
      },
      {
        uk: 'Дочекайся завантаження, тоді перезапусти браузер',
        en: 'Wait for the download to finish, then restart the browser',
        fr: 'Attends la fin du téléchargement, puis redémarre le navigateur',
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
        uk: 'Параметри → «Доступність» {accessibility} → «Читання і мовлення» (раніше «Вимовний контент»)',
        en: 'Settings → Accessibility {accessibility} → Read & Speak (formerly Spoken Content)',
        fr: 'Réglages → Accessibilité {accessibility} → « Lire et énoncer » (autrefois « Contenu énoncé »)',
      },
      {
        uk: '«Голоси» → «Французька»',
        en: 'Voices → French',
        fr: '« Voix » → « Français »',
      },
      {
        uk: 'Торкнись {download} біля Aurélie або Audrey',
        en: 'Tap {download} next to Aurélie or Audrey',
        fr: 'Touche {download} à côté d’Aurélie ou Audrey',
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
        uk: '{win} Пуск → {winSettings} «Параметри» → {winLanguage} «Час і мова» → «Мова та регіон»',
        en: '{win} Start → {winSettings} Settings → {winLanguage} Time & language → Language & region',
        fr: '{win} Démarrer → {winSettings} Paramètres → {winLanguage} Heure et langue → Langue et région',
      },
      {
        uk: '«Додати мову» → «Французька (Франція)»',
        en: 'Add a language → “French (France)”',
        fr: 'Ajouter une langue → « Français (France) »',
      },
      {
        uk: 'У параметрах цієї мови постав «Мовлення» — саме воно ставить голос',
        en: 'In that language’s options, tick “Speech” — that is what installs the voice',
        fr: 'Dans les options de cette langue, coche « Voix » — c’est ce qui installe la voix',
      },
      {
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
        uk: 'Налаштування → Спеціальні можливості → Синтез мовлення',
        en: 'Settings → Accessibility → Text-to-speech output',
        fr: 'Paramètres → Accessibilité → Synthèse vocale',
      },
      {
        uk: 'Google Синтезатор мовлення → Встановити мовні дані',
        en: 'Google Text-to-speech → Install voice data',
        fr: 'Synthèse vocale Google → Installer les données vocales',
      },
      {
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
