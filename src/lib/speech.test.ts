import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * The voice layer, against a fake `speechSynthesis`.
 *
 * Worth testing precisely because the failures are ones you only notice by ear:
 * the app reads phonetic notation aloud, or picks a Canadian voice for a course
 * about Paris, and nothing anywhere reports an error.
 */

type FakeVoice = { name: string; lang: string; localService: boolean; voiceURI: string }

function voice(name: string, lang: string, localService = true): FakeVoice {
  return { name, lang, localService, voiceURI: `${name}-${lang}` }
}

let spoken: { text: string; lang: string; rate: number; voice?: FakeVoice }[] = []
let cancels = 0

function install(voices: FakeVoice[], opts: { populateLate?: boolean } = {}) {
  let available = opts.populateLate ? [] : voices
  const listeners: (() => void)[] = []

  const synth = {
    getVoices: () => available,
    speak: (u: SpeechSynthesisUtterance) => {
      spoken.push({ text: u.text, lang: u.lang, rate: u.rate, voice: u.voice as never })
      setTimeout(() => u.onstart?.(new Event('start') as never), 0)
    },
    cancel: () => {
      cancels++
    },
    pause: () => {},
    resume: () => {},
    speaking: false,
    addEventListener: (_: string, fn: () => void) => listeners.push(fn),
    removeEventListener: () => {},
    /** Test hook: let Chrome's late voice population happen. */
    __populate: () => {
      available = voices
      listeners.forEach((fn) => fn())
    },
  }

  vi.stubGlobal('speechSynthesis', synth)
  vi.stubGlobal('window', { ...globalThis, speechSynthesis: synth })
  vi.stubGlobal(
    'SpeechSynthesisUtterance',
    class {
      text: string
      lang = ''
      rate = 1
      pitch = 1
      voice: unknown = null
      onstart: (() => void) | null = null
      onend: (() => void) | null = null
      onerror: (() => void) | null = null
      constructor(text: string) {
        this.text = text
      }
    },
  )
  return synth
}

beforeEach(() => {
  spoken = []
  cancels = 0
  vi.resetModules()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/* ------------------------------------------------------------------ *
 * What actually gets said
 * ------------------------------------------------------------------ */

describe('speakable', () => {
  it('drops the derivation arrow and everything after it', async () => {
    const { speakable } = await import('./speech')
    // This is the bug a learner hears as "why is this taking so long": the
    // engine reads the phrase, then works through the phonetic transcription.
    expect(speakable('les amis → [le‿za.mi]')).toBe('les amis')
    expect(speakable('c’est un homme → [sɛ‿tœ̃‿nɔm]')).toBe('c’est un homme')
  })

  it('drops bracketed IPA even without an arrow', async () => {
    const { speakable } = await import('./speech')
    expect(speakable('bonjour [bɔ̃.ʒuʁ]')).toBe('bonjour')
  })

  it('speaks only the first of two alternatives', async () => {
    const { speakable } = await import('./speech')
    expect(speakable('content / contente')).toBe('content')
    expect(speakable('ma sœur / mon frère')).toBe('ma sœur')
  })

  it('keeps a slash that is part of a word', async () => {
    const { speakable } = await import('./speech')
    expect(speakable('et/ou')).toBe('et/ou')
  })

  it('drops emphasis markers and the right/wrong prefix', async () => {
    const { speakable } = await import('./speech')
    expect(speakable('Je **ne** comprends **pas**.')).toBe('Je ne comprends pas.')
    expect(speakable('❌ Je suis 20 ans')).toBe('Je suis 20 ans')
  })

  it('leaves ordinary French untouched', async () => {
    const { speakable } = await import('./speech')
    const s = '« Bonjour, madame. Vous êtes française ? », a-t-il demandé.'
    expect(speakable(s)).toBe(s)
  })

  it('never leaves notation behind', async () => {
    const { speakable } = await import('./speech')
    expect(speakable('a → b [x] ‿ c')).not.toMatch(/[→\[\]‿*]/)
  })
})

/* ------------------------------------------------------------------ *
 * Which voice
 * ------------------------------------------------------------------ */

describe('pickDefaultFrenchVoice', () => {
  it('prefers metropolitan French over a nicer-sounding Canadian one', async () => {
    // The regression this exists for: "Amélie" is fr-CA on macOS, and matching
    // on name first handed a Paris-based course a Québec accent.
    install([voice('Amélie', 'fr-CA'), voice('Jacques', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.lang).toBe('fr-FR')
    expect(pickDefaultFrenchVoice()?.name).toBe('Jacques')
  })

  it('still prefers a good name among fr-FR voices', async () => {
    install([voice('Eddy (French (France))', 'fr-FR'), voice('Thomas', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Thomas')
  })

  it('prefers a local voice over a network one — network means latency', async () => {
    install([voice('Google français', 'fr-FR', false), voice('Jacques', 'fr-FR', true)])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Jacques')
  })

  it('falls back to another French variety rather than nothing', async () => {
    install([voice('Amélie', 'fr-CA')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Amélie')
  })

  it('returns nothing when the system has no French at all', async () => {
    install([voice('Daniel', 'en-GB')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()).toBeUndefined()
  })
})

/* ------------------------------------------------------------------ *
 * Latency
 * ------------------------------------------------------------------ */

describe('speak', () => {
  it('does not wait on the voice list once it is warm', async () => {
    install([voice('Jacques', 'fr-FR')])
    const { loadVoices, speak } = await import('./speech')
    await loadVoices()

    // Every tap on a word goes through here, so an extra await is felt.
    const t0 = Date.now()
    await speak('bonjour')
    expect(Date.now() - t0).toBeLessThan(50)
    expect(spoken).toHaveLength(1)
  })

  it('still works before the voice list arrives', async () => {
    const synth = install([voice('Jacques', 'fr-FR')], { populateLate: true })
    const { speak } = await import('./speech')
    const pending = speak('bonjour')
    synth.__populate()
    await pending
    expect(spoken[0].text).toBe('bonjour')
  })

  it('cancels the previous utterance so taps do not queue up', async () => {
    install([voice('Jacques', 'fr-FR')])
    const { speak } = await import('./speech')
    await speak('un')
    await speak('deux')
    expect(cancels).toBe(2)
    expect(spoken.map((s) => s.text)).toEqual(['un', 'deux'])
  })

  it('sends the cleaned text, not the written form', async () => {
    install([voice('Jacques', 'fr-FR')])
    const { speak } = await import('./speech')
    await speak('les amis → [le‿za.mi]')
    expect(spoken[0].text).toBe('les amis')
  })

  it('ignores empty text instead of speaking silence', async () => {
    install([voice('Jacques', 'fr-FR')])
    const { speak } = await import('./speech')
    await speak('   ')
    expect(spoken).toHaveLength(0)
  })

  it('honours an explicitly chosen voice', async () => {
    install([voice('Jacques', 'fr-FR'), voice('Flo', 'fr-FR')])
    const { loadVoices, speak } = await import('./speech')
    await loadVoices()
    await speak('bonjour', { voiceURI: 'Flo-fr-FR' })
    expect(spoken[0].voice?.name).toBe('Flo')
  })
})

/* ------------------------------------------------------------------ *
 * Rate
 * ------------------------------------------------------------------ */

describe('slowRate', () => {
  it('is half the chosen rate, so slow is always slower', async () => {
    const { slowRate } = await import('./speech')
    expect(slowRate(0.85)).toBeCloseTo(0.425)
    expect(slowRate(1.2)).toBeCloseTo(0.6)
  })

  it('never drops below the point where voices start to warble', async () => {
    const { slowRate, SLOW_FLOOR } = await import('./speech')
    expect(slowRate(0.1)).toBe(SLOW_FLOOR)
  })

  it('still slows down at the slider minimum', async () => {
    // Floor and slider minimum used to be the same number, so "slow" was a
    // no-op for exactly the learners who had already asked for slow.
    const { slowRate } = await import('./speech')
    expect(slowRate(0.4)).toBeLessThan(0.4)
  })

  it('stays audibly slower than any normal rate', async () => {
    const { slowRate } = await import('./speech')
    for (const r of [0.4, 0.6, 0.85, 1.0, 1.2]) {
      expect(slowRate(r)).toBeLessThan(r)
    }
  })
})

describe('frenchIn', () => {
  it('pulls the French out of a Ukrainian explanation', async () => {
    const { frenchIn } = await import('./speech')
    // The line that prompted this: the French half was there to be heard, and
    // there was no way to hear it.
    expect(
      frenchIn("Je viens d'Ukraine. De + Ukraine → d'Ukraine, бо наступне слово з голосної."),
    ).toBe("Je viens d'Ukraine. De + Ukraine, d'Ukraine")
  })

  it('keeps the half after an arrow instead of truncating there', async () => {
    const { speakable } = await import('./speech')
    expect(speakable("De + Ukraine → d'Ukraine")).toBe("De + Ukraine, d'Ukraine")
  })

  it('still drops the IPA an arrow used to introduce', async () => {
    const { speakable } = await import('./speech')
    expect(speakable('les amis → [le‿za.mi]')).toBe('les amis')
  })

  it('returns nothing when the text is pure Ukrainian', async () => {
    const { frenchIn } = await import('./speech')
    expect(frenchIn('Прикметник узгоджується з іменником.')).toBe('')
    expect(frenchIn('')).toBe('')
  })

  it('passes pure French through', async () => {
    const { frenchIn } = await import('./speech')
    expect(frenchIn('Je ne comprends pas.')).toBe('Je ne comprends pas.')
  })

  it('separates fragments so they are not run together', async () => {
    const { frenchIn } = await import('./speech')
    expect(frenchIn('Кажемо le livre, а не la livre — рід інший.')).toBe('le livre. la livre')
  })

  it('keeps French punctuation and quotes attached', async () => {
    const { frenchIn } = await import('./speech')
    expect(frenchIn('Формула: «Je voudrais un café», і все.')).toBe('«Je voudrais un café»')
  })

  it('does not double a full stop a fragment already has', async () => {
    const { frenchIn } = await import('./speech')
    expect(frenchIn("L'Ukraine — жіночого роду, тому en. Порівняй: au Canada (чол. рід).")).toBe(
      "L'Ukraine. en. au Canada",
    )
  })

  it('ignores stray digits and symbols with no French around them', async () => {
    const { frenchIn } = await import('./speech')
    expect(frenchIn('Правило 80 % випадків.')).toBe('')
  })
})
