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
      // The help page has to match the language the steps are being read in.
      if (g.href) {
        for (const lang of ['uk', 'en', 'fr'] as const) {
          expect(g.href[lang]).toMatch(/^https:\/\//)
        }
      }
    }
  })

  it('writes every step in all three system languages', () => {
    // The steps quote menu items, so a learner on an English or French system
    // needs the words that are actually on their screen. Missing one would
    // render as blank rather than fall back.
    for (const p of ['macos', 'ios', 'windows', 'android', 'linux', 'unknown'] as const) {
      const g = voiceGuide(p)
      for (const step of g.steps) {
        for (const lang of ['uk', 'en', 'fr'] as const) {
          expect(step[lang]?.trim()).toBeTruthy()
        }
      }
      for (const field of [g.note, g.hrefLabel]) {
        if (!field) continue
        for (const lang of ['uk', 'en', 'fr'] as const) expect(field[lang]?.trim()).toBeTruthy()
      }
    }
  })

  it('uses the menu names each system really shows', () => {
    // Taken from Apple's own localised pages, not from memory: the pane was
    // renamed from "Spoken Content" to "Read & Speak", and the first version
    // of these steps sent people to a menu item that no longer exists.
    const mac = voiceGuide('macos').steps
    expect(mac[1].en).toContain('Read & Speak')
    expect(mac[1].fr).toContain('Lire et énoncer')
    expect(mac[1].uk).toContain('Читання і мовлення')

    // The voices are behind the Info button next to the voice pop-up, which is
    // what Apple's own article says. An earlier version sent people to "Manage
    // Voices", which is not how this screen works.
    expect(mac[2].en).toContain('System voice')
    expect(mac[2].en).toContain('Info button')
    expect(mac[2].fr).toContain('Voix système')
    expect(mac[2].uk).toContain('Основний голос')

    expect(voiceGuide('windows').steps[0].en).toContain('Language & region')
  })

  it('still names the old menu item, for anyone on an older system', () => {
    // Ventura and Sonoma call it Spoken Content, and plenty of people are on
    // them — sending them looking for a name their Mac does not use is the
    // same failure in the other direction.
    const mac = voiceGuide('macos').steps[1]
    expect(mac.en).toContain('Spoken Content')
    expect(mac.uk).toContain('Вимовний контент')
    expect(mac.fr).toContain('Contenu énoncé')
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

describe('every step points at something the learner can see', () => {
  it('carries an icon for the control it names', () => {
    // Menu names are the hard part of following instructions in a system whose
    // language you half-read; the shape of a button is not.
    for (const p of ['macos', 'ios', 'windows', 'android'] as const) {
      for (const step of voiceGuide(p).steps) {
        expect(step.icon).toBeTruthy()
      }
    }
  })
})
