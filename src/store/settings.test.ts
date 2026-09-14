import { beforeEach, describe, expect, it } from 'vitest'
import { applySyncedSettings, syncedSettings, useSettings } from './settings'

/**
 * Preferences follow the learner, with one exception that has to be deliberate.
 */

beforeEach(() => {
  useSettings.setState({
    theme: 'system',
    voiceURI: null,
    rate: 0.85,
    autoSpeak: true,
    dailyGoal: 60,
    soundEffects: true,
    showIpa: true,
    strictAccents: false,
  })
})

describe('what travels with the account', () => {
  it('carries the choices about how to study', () => {
    useSettings.setState({ theme: 'light', rate: 0.7, dailyGoal: 120, strictAccents: true })
    expect(syncedSettings()).toMatchObject({
      theme: 'light',
      rate: 0.7,
      dailyGoal: 120,
      strictAccents: true,
    })
  })

  it('leaves the chosen voice behind', () => {
    // A voiceURI names a voice installed on one machine. Carrying
    // "com.apple.voice.compact.fr-FR.Thomas" to a phone selects nothing.
    useSettings.setState({ voiceURI: 'com.apple.voice.compact.fr-FR.Thomas' })
    expect(syncedSettings()).not.toHaveProperty('voiceURI')
  })

  it('applies a theme chosen on another device', () => {
    // The report: light on the laptop, dark on a second browser.
    expect(applySyncedSettings({ theme: 'light' })).toBe(true)
    expect(useSettings.getState().theme).toBe('light')
  })

  it('never lets a remote document overwrite this device’s voice', () => {
    useSettings.setState({ voiceURI: 'local-voice' })
    applySyncedSettings({ voiceURI: 'a-voice-from-a-mac', theme: 'dark' })
    expect(useSettings.getState().voiceURI).toBe('local-voice')
    expect(useSettings.getState().theme).toBe('dark')
  })
})

describe('not writing back what just arrived', () => {
  it('reports no change when the incoming settings match', () => {
    // Returning true here would schedule a push, which returns as a snapshot,
    // which applies again — a loop that never settles.
    expect(applySyncedSettings(syncedSettings())).toBe(false)
  })

  it('ignores an empty or malformed document', () => {
    expect(applySyncedSettings(null)).toBe(false)
    expect(applySyncedSettings({})).toBe(false)
    expect(applySyncedSettings('nonsense')).toBe(false)
  })

  it('refuses a value of the wrong type rather than corrupting the setting', () => {
    applySyncedSettings({ rate: 'fast', dailyGoal: null, theme: 42 })
    const s = useSettings.getState()
    expect(s.rate).toBe(0.85)
    expect(s.dailyGoal).toBe(60)
    expect(s.theme).toBe('system')
  })
})
