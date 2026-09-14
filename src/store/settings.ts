import { create, type StateCreator } from 'zustand'

export type Theme = 'light' | 'dark' | 'system'

type SettingsState = {
  theme: Theme
  /** Chosen French voice (SpeechSynthesisVoice.voiceURI). */
  voiceURI: string | null
  /** Playback rate, 0.4 – 1.2. Learners benefit from slightly slow speech. */
  rate: number
  /** Speak French automatically when an exercise appears. */
  autoSpeak: boolean
  /** Daily XP target used by the ring on the dashboard. */
  dailyGoal: number
  soundEffects: boolean
  showIpa: boolean
  /** Reject answers that are right except for accents. */
  strictAccents: boolean

  set: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void
  applyTheme: () => void
}

/**
 * The preferences that belong to the learner rather than to this machine.
 *
 * All of them except the voice. A voiceURI names a voice installed on one
 * device — "com.apple.voice.compact.fr-FR.Thomas" exists on a Mac and nowhere
 * else — so carrying it to a phone would select a voice that is not there and
 * silently override a perfectly good local choice. Everything else is a
 * decision about how the learner wants to study, and should follow them.
 */
export type SyncedSettings = Omit<SettingsState, 'set' | 'applyTheme' | 'voiceURI'>

const SYNCED_KEYS = [
  'theme',
  'rate',
  'autoSpeak',
  'dailyGoal',
  'soundEffects',
  'showIpa',
  'strictAccents',
] as const

export function syncedSettings(): SyncedSettings {
  const s = useSettings.getState()
  return Object.fromEntries(SYNCED_KEYS.map((k) => [k, s[k]])) as SyncedSettings
}

/** Returns true when anything actually changed, so callers can avoid a write loop. */
export function applySyncedSettings(incoming: unknown): boolean {
  if (!incoming || typeof incoming !== 'object') return false
  const current = useSettings.getState()
  const patch: Partial<SettingsState> = {}

  for (const key of SYNCED_KEYS) {
    const value = (incoming as Record<string, unknown>)[key]
    if (value === undefined || value === current[key]) continue
    // Trust the shape only as far as it matches what is already there; a
    // malformed document must not be able to set rate to a string.
    if (typeof value !== typeof current[key]) continue
    ;(patch as Record<string, unknown>)[key] = value
  }

  if (!Object.keys(patch).length) return false
  useSettings.setState(patch)
  useSettings.getState().applyTheme()
  return true
}

/**
 * Preferences live in the account, not in this browser.
 *
 * Nothing here is written to localStorage: the settings that belong to the
 * learner arrive from their account on sign-in, and the one that belongs to
 * the machine — the chosen voice — is picked again from the voices actually
 * installed. A browser that has been signed out of holds no trace of either.
 */
export const useSettings = create<SettingsState>()(((set, get) => ({
  theme: 'system',
  voiceURI: null,
  rate: 0.85,
  autoSpeak: true,
  dailyGoal: 60,
  soundEffects: true,
  showIpa: true,
  strictAccents: false,

  set: (key, value) => {
    set({ [key]: value } as never)
    if (key === 'theme') get().applyTheme()
  },

  applyTheme: () => {
    // Settings can now arrive from the account, so this runs wherever that
    // lands — including where there is no document to paint.
    if (typeof document === 'undefined') return
    const { theme } = get()
    const dark =
      theme === 'dark' ||
      (theme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  },
})) as StateCreator<SettingsState>)

// Keep "system" honest when the OS flips at sunset.
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useSettings.getState().theme === 'system') useSettings.getState().applyTheme()
  })
}
