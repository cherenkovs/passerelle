import { beforeEach, describe, expect, it } from 'vitest'
import { applySyncedSettings, syncedSettings, useSettings } from './settings'

/**
 * Preferences follow the learner, with one exception that has to be deliberate.
 */

beforeEach(() => {
  useSettings.setState({
    theme: 'system',
    voiceURI: null,
    voiceName: null,
    rate: 0.85,
    slowSpeed: 0.35,
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

  it('carries the chosen voice too, by URI and by name', () => {
    // It was left out at first as device-specific. But nothing is stored
    // locally any more, so excluding it meant the choice survived nowhere and
    // reset on every page load.
    useSettings.setState({ voiceURI: 'urn:mac:flo', voiceName: 'Flo (French (France))' })
    expect(syncedSettings()).toMatchObject({
      voiceURI: 'urn:mac:flo',
      voiceName: 'Flo (French (France))',
    })
  })

  it('applies a theme chosen on another device', () => {
    // The report: light on the laptop, dark on a second browser.
    expect(applySyncedSettings({ theme: 'light' })).toBe(true)
    expect(useSettings.getState().theme).toBe('light')
  })

  it('accepts a voice chosen on another device', () => {
    applySyncedSettings({ voiceURI: 'urn:mac:flo', voiceName: 'Flo (French (France))' })
    expect(useSettings.getState().voiceName).toBe('Flo (French (France))')
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
