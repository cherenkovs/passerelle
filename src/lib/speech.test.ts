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
/** The utterance handed to the engine, so a test can end it the way the engine would. */
let lastUtterance: SpeechSynthesisUtterance | null = null

function install(voices: FakeVoice[], opts: { populateLate?: boolean } = {}) {
  let available = opts.populateLate ? [] : voices
  const listeners: (() => void)[] = []

  const synth = {
    getVoices: () => available,
    speak: (u: SpeechSynthesisUtterance) => {
      lastUtterance = u
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
  lastUtterance = null
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

  it('speaks both alternatives, with the slash as a pause', async () => {
    const { speakable } = await import('./speech')
    // Hearing the pair is the lesson: the silent -t comes back in the feminine.
    expect(speakable('content / contente')).toBe('content, contente')
    expect(speakable('ma sœur / mon frère')).toBe('ma sœur, mon frère')
    expect(speakable('au / à la / aux')).toBe('au, à la, aux')
  })

  it('gives a shared verb to each pronoun in a conjugation row', async () => {
    const { speakable } = await import('./speech')
    // "il / elle a" means *il a / elle a*. Stopping at the slash left a bare
    // "il" — the one row of the avoir table with no verb in it.
    expect(speakable('il / elle a')).toBe('il a, elle a')
    expect(speakable('ils / elles ont')).toBe('ils ont, elles ont')
    expect(speakable('il / elle est')).toBe('il est, elle est')
    // Nothing to share — both alternatives are whole.
    expect(speakable('nous / vous')).toBe('nous, vous')
    expect(speakable('il / elle')).toBe('il, elle')
  })

  it('never borrows a tail across unrelated phrases', async () => {
    const { speakable } = await import('./speech')
    // The trap: "Par exemple," is two words, but "Ainsi," is no pronoun and
    // shares nothing with it. Borrowing would invent "Ainsi, exemple,".
    expect(speakable('Ainsi, / Par exemple,')).toBe('Ainsi, Par exemple')
    expect(speakable('il fait chaud / froid / beau')).toBe('il fait chaud, froid, beau')
    expect(speakable('Bien à vous, / Bonne journée,')).toBe('Bien à vous, Bonne journée')
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

describe('choosing a French voice', () => {
  it('prefers metropolitan French over a nicer-sounding Canadian one', async () => {
    // "Amélie" is fr-CA on macOS. Matching on name first handed a course built
    // around Paris and the DELF a Québec accent.
    install([voice('Amélie', 'fr-CA'), voice('Jacques', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.lang).toBe('fr-FR')
  })

  it('picks a female voice over a male one within the same variety', async () => {
    // The onboarding gender question speaks its own example, so the default is
    // the first French anyone hears. It used to be Thomas.
    install([voice('Thomas', 'fr-FR'), voice('Aurélie', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Aurélie')
  })

  it('falls back to the newer system voices when no classic one is installed', async () => {
    install([voice('Eddy (French (France))', 'fr-FR'), voice('Shelley (French (France))', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Shelley (French (France))')
  })

  it('takes Amélie when the device has no metropolitan voice at all', async () => {
    install([voice('Amélie', 'fr-CA'), voice('Nicolas', 'fr-CA')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Amélie')
  })

  it('finds a sensible default away from Apple', async () => {
    install([voice('Microsoft Paul', 'fr-FR'), voice('Microsoft Denise', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Microsoft Denise')
  })

  it('prefers a local voice over a network one — network means latency', async () => {
    install([voice('Aurélie', 'fr-FR', false), voice('Thomas', 'fr-FR', true)])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    // Installed beats better-ranked: a network voice is slow and dies offline.
    expect(pickDefaultFrenchVoice()?.name).toBe('Thomas')
  })

  it('never takes an Italian Alice for a French course', async () => {
    install([voice('Alice', 'it-IT'), voice('Aurélie', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Aurélie')
  })

  it('does take a French Alice where one exists', async () => {
    install([voice('Alice', 'fr-FR'), voice('Aurélie', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Alice')
  })

  it('returns nothing rather than a wrong language when no French is installed', async () => {
    install([voice('Alice', 'it-IT'), voice('Daniel', 'en-GB')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()).toBeUndefined()
  })
})

describe('when a voice fails', () => {
  it('steps down to the next one and leaves the broken one out', async () => {
    install([voice('Aurélie', 'fr-FR'), voice('Thomas', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice, markVoiceBroken, frenchVoicesRanked } =
      await import('./speech')
    await loadVoices()

    const first = pickDefaultFrenchVoice()
    expect(first?.name).toBe('Aurélie')

    // A voice can be listed and still fail: a network voice with no network,
    // or one the system has not finished installing.
    markVoiceBroken(first!.voiceURI)
    expect(pickDefaultFrenchVoice()?.name).toBe('Thomas')
    expect(frenchVoicesRanked().map((v) => v.name)).not.toContain('Aurélie')
  })

  it('gives up rather than looping when every voice has failed', async () => {
    install([voice('Aurélie', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice, markVoiceBroken } = await import('./speech')
    await loadVoices()
    markVoiceBroken(pickDefaultFrenchVoice()!.voiceURI)
    expect(pickDefaultFrenchVoice()).toBeUndefined()
  })
})

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
    ).toBe("Je viens d'Ukraine. De Ukraine, d'Ukraine")
  })

  it('keeps the half after an arrow instead of truncating there', async () => {
    const { speakable } = await import('./speech')
    expect(speakable("De + Ukraine → d'Ukraine")).toBe("De Ukraine, d'Ukraine")
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

describe('symbols that are notation, not speech', () => {
  it('does not read "+" as the word plus', async () => {
    const { frenchIn } = await import('./speech')
    // "Схема ne + дієслово + pas" came out of the speaker as "ne plus plus pas".
    expect(frenchIn('Схема ne + дієслово + pas. Обидві частини обов’язкові.')).toBe('ne. pas.')
  })

  it('drops a stray symbol rather than pausing on it', async () => {
    const { speakable } = await import('./speech')
    expect(speakable("De + Ukraine → d'Ukraine")).toBe("De Ukraine, d'Ukraine")
    expect(speakable('a = b')).toBe('a b')
  })

  it('still keeps the contrast a line exists to teach', async () => {
    const { frenchIn } = await import('./speech')
    // Two bare particles, but hearing "ne" against "n'" is the whole point.
    expect(frenchIn("Якщо дієслово починається з голосної, ne скорочується до n':")).toBe("ne. n'")
  })
})

describe('who may stop the voice', () => {
  it('lets an unrelated component unmount without cutting the audio', async () => {
    install([voice('Thomas', 'fr-FR')])
    const { speak, cancelSpeechBy } = await import('./speech')

    const card = {}
    const buttonInsideCard = {}
    await speak('comprendre', { owner: card })
    const afterSpeak = cancels // the barge-in inside speak()

    // Flipping the card unmounts the speaker button sitting inside it. That
    // button never started anything, so it must not silence the card's word.
    cancelSpeechBy(buttonInsideCard)
    expect(cancels).toBe(afterSpeak)

    // The component that did start it still can.
    cancelSpeechBy(card)
    expect(cancels).toBe(afterSpeak + 1)
  })

  it('forgets the owner once the utterance is over', async () => {
    install([voice('Thomas', 'fr-FR')])
    const { speak, cancelSpeechBy } = await import('./speech')

    const card = {}
    await speak('comprendre', { owner: card })
    const afterSpeak = cancels

    // The word finished on its own; a later unmount has nothing to stop.
    lastUtterance?.onend?.(new Event('end') as never)
    cancelSpeechBy(card)
    expect(cancels).toBe(afterSpeak)
  })

  it('ignores an owner that never spoke, and a null one', async () => {
    install([voice('Thomas', 'fr-FR')])
    const { cancelSpeechBy } = await import('./speech')
    cancelSpeechBy({})
    cancelSpeechBy(null)
    expect(cancels).toBe(0)
  })
})

describe('resolving the learner’s chosen voice', () => {
  it('takes the exact voice when this device has it', async () => {
    install([voice('Flo (French (France))', 'fr-FR'), voice('Thomas', 'fr-FR')])
    const { loadVoices, resolveVoice } = await import('./speech')
    await loadVoices()
    expect(resolveVoice('Flo (French (France))-fr-FR', null)?.name).toBe('Flo (French (France))')
  })

  it('falls back to the name when the URI belongs to another machine', async () => {
    install([voice('Flo (French (France))', 'fr-FR')])
    const { loadVoices, resolveVoice } = await import('./speech')
    await loadVoices()
    // The same voice exists here, but under a URI from the Mac it was picked on.
    expect(resolveVoice('com.apple.voice.whatever', 'Flo (French (France))')?.name).toBe(
      'Flo (French (France))',
    )
  })

  it('gives up rather than guessing when the voice is not installed', async () => {
    install([voice('Thomas', 'fr-FR')])
    const { loadVoices, resolveVoice } = await import('./speech')
    await loadVoices()
    // The caller then uses the best French voice actually present.
    expect(resolveVoice('urn:absent', 'Aurélie')).toBeUndefined()
  })
})
