/**
 * What a good French voice is on this particular machine, and how to get one.
 *
 * Web Speech reads whatever the operating system has installed, and what it has
 * by default is often poor — on a Mac, mostly the novelty voices; on Windows,
 * nothing French at all until a language pack is added. The app cannot install
 * anything, so the next best thing is to name the voices worth having on the
 * system the learner is actually using, say which are already there, and give
 * the steps rather than a vague "check your settings".
 */

export type Platform = 'macos' | 'ios' | 'windows' | 'android' | 'linux' | 'unknown'

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

export type VoiceGuide = {
  /** Voices worth having here, best first, matched as lowercase substrings. */
  recommended: string[]
  /** Where they live, in the learner's own words. */
  steps: string[]
  /** Official instructions, for when the steps have moved. */
  href?: string
  hrefLabel?: string
  /** Said when the steps alone will not be enough. */
  note?: string
}

const APPLE_NOTE =
  'Обери «Покращена» або «Преміум» — це окреме завантаження, і саме воно звучить як людина.'

const BROWSER_NOTE =
  'Після встановлення повністю закрий браузер і відкрий знову: він читає список голосів один раз при запуску.'

export const VOICE_GUIDES: Record<Platform, VoiceGuide> = {
  macos: {
    recommended: ['aurélie', 'aurelie', 'audrey', 'marie', 'thomas'],
    steps: [
      'Системні параметри → Доступність → Вимовний контент',
      'Системний голос → Керувати голосами…',
      'Знайди «Французька (Франція)» і постав галочки на Aurélie та Audrey',
      'Дочекайся завантаження, тоді перезапусти браузер',
    ],
    href: 'https://support.apple.com/guide/mac-help/change-the-voice-your-mac-uses-mh27448/mac',
    hrefLabel: 'Інструкція Apple',
    note: `${APPLE_NOTE} ${BROWSER_NOTE}`,
  },
  ios: {
    recommended: ['aurélie', 'aurelie', 'audrey', 'marie', 'thomas'],
    steps: [
      'Параметри → Доступність → Вимовний контент',
      'Голоси → Французька',
      'Завантаж Aurélie або Audrey',
    ],
    href: 'https://support.apple.com/guide/iphone/change-voice-settings-iph9a8b7f2c1/ios',
    hrefLabel: 'Інструкція Apple',
    note: APPLE_NOTE,
  },
  windows: {
    recommended: ['denise', 'hortense', 'julie', 'paul'],
    steps: [
      'Параметри → Час і мова → Мова та регіон',
      'Додати мову → «Французька (Франція)»',
      'У її параметрах постав «Мовлення» (Speech)',
      'Перезапусти браузер',
    ],
    href: 'https://support.microsoft.com/en-us/windows/appendix-a-supported-languages-and-voices-4486e345-7730-53da-fcfe-55cc64300f01',
    hrefLabel: 'Список голосів Microsoft',
    note: `Microsoft Denise — найприродніша з французьких. ${BROWSER_NOTE}`,
  },
  android: {
    recommended: ['google français', 'google french', 'français'],
    steps: [
      'Налаштування → Спеціальні можливості → Синтез мовлення',
      'Google Синтезатор мовлення → Встановити мовні дані',
      'Завантаж «Français (France)»',
    ],
    href: 'https://support.google.com/accessibility/android/answer/6006983',
    hrefLabel: 'Інструкція Google',
  },
  linux: {
    recommended: ['google français', 'google french'],
    steps: [
      'Системні голоси в Linux (espeak) звучать механічно',
      'У Chrome доступні голоси Google — вони кращі, але потребують інтернету',
      'Обери «Google français» у списку вище, якщо він є',
    ],
    note: 'Голоси Google завантажуються з мережі, тож перша фраза може прозвучати із затримкою.',
  },
  unknown: {
    recommended: ['aurélie', 'aurelie', 'audrey', 'denise', 'google français'],
    steps: ['Пошукай французькі голоси в налаштуваннях доступності своєї системи'],
    note: BROWSER_NOTE,
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
