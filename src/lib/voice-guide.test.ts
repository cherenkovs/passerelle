import { describe, expect, it } from 'vitest'
import { detectPlatform, installedRecommended, missingRecommended, voiceGuide } from './voice-guide'

const UA = {
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/152 Safari/537.36',
  iphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0',
  windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/152 Safari/537.36',
  android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/152 Mobile',
  linux: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/152 Safari/537.36',
}

const voices = (...names: string[]) => names.map((name) => ({ name }))

describe('working out which system the learner is on', () => {
  it('tells the platforms apart', () => {
    expect(detectPlatform(UA.mac)).toBe('macos')
    expect(detectPlatform(UA.iphone)).toBe('ios')
    expect(detectPlatform(UA.windows)).toBe('windows')
    // Android must be checked before Linux: it says Linux too.
    expect(detectPlatform(UA.android)).toBe('android')
    expect(detectPlatform(UA.linux)).toBe('linux')
  })

  it('falls back rather than guessing wrong', () => {
    expect(detectPlatform('some unknown agent')).toBe('unknown')
    // And the unknown guide still names voices and gives a step.
    expect(voiceGuide('unknown').recommended.length).toBeGreaterThan(0)
    expect(voiceGuide('unknown').steps.length).toBeGreaterThan(0)
  })
})

describe('advice matches the system', () => {
  it('names Apple voices on a Mac and Microsoft ones on Windows', () => {
    expect(voiceGuide('macos').recommended).toContain('audrey')
    expect(voiceGuide('windows').recommended).toContain('denise')
    expect(voiceGuide('android').recommended.join(' ')).toMatch(/google/)
  })

  it('gives every platform steps, and a link where one exists', () => {
    for (const p of ['macos', 'ios', 'windows', 'android', 'linux', 'unknown'] as const) {
      const g = voiceGuide(p)
      expect(g.steps.length).toBeGreaterThan(0)
      if (g.href) expect(g.href).toMatch(/^https:\/\//)
    }
  })
})

describe('checking what is already installed', () => {
  it('finds a recommended voice however the system spells it', () => {
    const guide = voiceGuide('macos')
    expect(installedRecommended(voices('Aurélie', 'Thomas'), guide)).toContain('aurélie')
    expect(
      installedRecommended(voices('Microsoft Denise - French'), voiceGuide('windows')),
    ).toEqual(['denise'])
  })

  it('counts a voice once when the list spells it two ways', () => {
    // "aurélie" and "aurelie" are the same voice, listed twice so either
    // spelling matches — it must not be reported twice.
    expect(installedRecommended(voices('Aurélie'), voiceGuide('macos'))).toEqual(['aurélie'])
  })

  it('reports nothing found when only the novelty voices are there', () => {
    const macVoices = voices('Flo (French (France))', 'Grandpa (French (France))', 'Sandy')
    expect(installedRecommended(macVoices, voiceGuide('macos'))).toEqual([])
    expect(missingRecommended(macVoices, voiceGuide('macos'))).toBe(true)
  })

  it('does not call Thomas missing — he is on the list, just not first', () => {
    expect(missingRecommended(voices('Thomas'), voiceGuide('macos'))).toBe(false)
  })
})
