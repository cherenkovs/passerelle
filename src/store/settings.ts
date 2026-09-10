import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
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
        const { theme } = get()
        const dark =
          theme === 'dark' ||
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        document.documentElement.classList.toggle('dark', dark)
      },
    }),
    {
      name: 'passerelle:settings',
      version: 2,
      migrate: (persisted, from) => {
        const s = persisted as Partial<SettingsState>
        // v2 slowed the default voice down. Anyone still sitting on the old
        // default never chose it, so move them; a deliberate choice is kept.
        if (from < 2 && s.rate === 0.92) s.rate = 0.85
        return s as SettingsState
      },
      onRehydrateStorage: () => (state) => state?.applyTheme(),
    },
  ),
)

// Keep "system" honest when the OS flips at sunset.
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useSettings.getState().theme === 'system') useSettings.getState().applyTheme()
  })
}
