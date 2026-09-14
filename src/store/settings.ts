import { create, type StateCreator } from 'zustand'

export type Theme = 'light' | 'dark' | 'system'

type SettingsState = {
  theme: Theme
  /** Chosen French voice (SpeechSynthesisVoice.voiceURI). */
  voiceURI: string | null
  /**
   * The same voice by name.
   *
   * A voiceURI identifies a voice on the machine it came from; the name is
   * what survives the trip to another one, where the same voice may well exist
   * under a different URI.
   */
  voiceName: string | null
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
 * The voice included. It is the one setting that names something belonging to
 * a particular machine, which is why it was left out at first — but nothing is
 * stored locally any more, so leaving it out meant the choice survived nowhere
 * and reset on every page load. A voice that does not exist on the device
 * reading it simply does not resolve, and the default is used instead, so
 * carrying it costs nothing and not carrying it cost the setting entirely.
 */
export type SyncedSettings = Omit<SettingsState, 'set' | 'applyTheme'>

const SYNCED_KEYS = [
  'voiceURI',
  'voiceName',
  'theme',
  'rate',
  'autoSpeak',
  'dailyGoal',
  'soundEffects',
  'showIpa',
  'strictAccents',
] as const

const NULLABLE_KEYS = new Set<string>(['voiceURI', 'voiceName'])

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

    // Trust the shape only as far as it matches what is already there, so a
    // malformed document cannot set rate to a string. The voice settings need
    // saying explicitly: they are nullable, and `typeof null` is "object", so
    // comparing against the current value would reject every real change
    // whenever the current one happened to be null — which is exactly the
    // state a fresh browser starts in.
    if (NULLABLE_KEYS.has(key)) {
      if (value !== null && typeof value !== 'string') continue
    } else if (typeof value !== typeof current[key]) {
      continue
    }

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
  voiceName: null,
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
