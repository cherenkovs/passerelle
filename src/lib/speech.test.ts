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
      synth.speaking = true
      spoken.push({ text: u.text, lang: u.lang, rate: u.rate, voice: u.voice as never })
      setTimeout(() => u.onstart?.(new Event('start') as never), 0)
    },
    cancel: () => {
      cancels++
      synth.speaking = false
    },
    pause: () => {},
    resume: () => {},
    paused: false,
    pending: false,
    speaking: false,
    addEventListener: (_: string, fn: () => void) => listeners.push(fn),
    removeEventListener: () => {},
    /** Test hook: the system's voice list changing under the app. */
    __replace: (next: FakeVoice[]) => {
      available = next
      listeners.forEach((fn) => fn())
    },
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
      onerror: (() => void) | null = null
      private _onend: ((e: unknown) => void) | null = null
      constructor(text: string) {
        this.text = text
      }
      // Ending an utterance frees the engine, as it does in a real one.
      get onend() {
        const fn = this._onend
        return fn
          ? (e: unknown) => {
              synth.speaking = false
              fn(e)
            }
          : null
      }
      set onend(fn: ((e: unknown) => void) | null) {
        this._onend = fn
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
    expect(speakable('content / contente')).toBe('content. contente')
    expect(speakable('ma sœur / mon frère')).toBe('ma sœur. mon frère')
    expect(speakable('au / à la / aux')).toBe('au. à la. aux')
  })

  it('gives a shared verb to each pronoun in a conjugation row', async () => {
    const { speakable } = await import('./speech')
    // "il / elle a" means *il a / elle a*. Stopping at the slash left a bare
    // "il" — the one row of the avoir table with no verb in it.
    expect(speakable('il / elle a')).toBe('il a. elle a')
    expect(speakable('ils / elles ont')).toBe('ils ont. elles ont')
    expect(speakable('il / elle est')).toBe('il est. elle est')
    // Nothing to share — both alternatives are whole.
    expect(speakable('nous / vous')).toBe('nous. vous')
    expect(speakable('il / elle')).toBe('il. elle')
    // The conjunction written once belongs to both pronouns.
    expect(speakable("qu'il / elle prenne")).toBe("qu'il prenne. qu'elle prenne")
    expect(speakable('que nous / vous parlions')).toBe('que nous parlions. que vous parlions')
  })

  it('never borrows a tail across unrelated phrases', async () => {
    const { speakable } = await import('./speech')
    // The trap: "Par exemple," is two words, but "Ainsi," is no pronoun and
    // shares nothing with it. Borrowing would invent "Ainsi, exemple,".
    expect(speakable('Ainsi, / Par exemple,')).toBe('Ainsi. Par exemple')
    expect(speakable('il fait chaud / froid / beau')).toBe('il fait chaud. froid. beau')
    expect(speakable('Bien à vous, / Bonne journée,')).toBe('Bien à vous. Bonne journée')
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

  it('never picks a comedy voice when a real one exists', async () => {
    // Flo, Sandy, Grandma and the rest are macOS novelty voices. They are what
    // gets described as robotic, and on a Mac without the good French voices
    // downloaded they are most of what is installed.
    install([voice('Flo (French (France))', 'fr-FR'), voice('Thomas', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Thomas')
  })

  it('would rather cross the Atlantic than use a cartoon', async () => {
    // A real Québécois voice teaches a real accent. A comedy Parisian one
    // teaches nothing a learner can measure themselves against.
    install([voice('Grandpa (French (France))', 'fr-FR'), voice('Amélie', 'fr-CA')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Amélie')
  })

  it('takes the enhanced build of a voice over the compact one', async () => {
    install([voice('Thomas', 'fr-FR'), voice('Aurélie (Enhanced)', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Aurélie (Enhanced)')
  })

  it('still offers a novelty voice when there is nothing else', async () => {
    install([voice('Flo (French (France))', 'fr-FR')])
    const { loadVoices, pickDefaultFrenchVoice } = await import('./speech')
    await loadVoices()
    expect(pickDefaultFrenchVoice()?.name).toBe('Flo (French (France))')
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
    // One cancel per utterance: the cancel-then-resume handshake in front of
    // every one is what keeps Chrome's engine from jamming.
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

describe('how a voice is named in the list', () => {
  it('drops the language that the variety label already says', async () => {
    const { voiceLabel } = await import('./speech')
    // The list read "Flo (French (France)) · Франція" — France twice, and the
    // only part identifying the voice buried at the front.
    expect(voiceLabel({ name: 'Flo (French (France))' } as SpeechSynthesisVoice)).toBe('Flo')
    expect(voiceLabel({ name: 'Microsoft Denise - French (France)' } as SpeechSynthesisVoice)).toBe(
      'Denise',
    )
  })

  it('leaves a plain name alone', async () => {
    const { voiceLabel } = await import('./speech')
    expect(voiceLabel({ name: 'Thomas' } as SpeechSynthesisVoice)).toBe('Thomas')
    expect(voiceLabel({ name: 'Aurélie (Enhanced)' } as SpeechSynthesisVoice)).toBe(
      'Aurélie (Enhanced)',
    )
  })
})

describe('voices installed while the app is running', () => {
  it('shows a voice added after the list first loaded', async () => {
    const synth = install([voice('Thomas', 'fr-FR')])
    const { loadVoices, frenchVoicesRanked } = await import('./speech')
    await loadVoices()
    expect(frenchVoicesRanked().map((v) => v.name)).toEqual(['Thomas'])

    // The learner follows the advice in Settings and installs Aurélie. This
    // used to need a full reload: the listener was removed after the first
    // successful read, so the list was a snapshot of app startup.
    synth.__replace([voice('Thomas', 'fr-FR'), voice('Aurélie', 'fr-FR')])
    expect(frenchVoicesRanked().map((v) => v.name)).toEqual(['Aurélie', 'Thomas'])
  })

  it('tells subscribers, so an open settings page updates itself', async () => {
    const synth = install([voice('Thomas', 'fr-FR')])
    const { loadVoices, onVoicesChanged } = await import('./speech')
    await loadVoices()

    let told = 0
    const stop = onVoicesChanged(() => told++)
    synth.__replace([voice('Thomas', 'fr-FR'), voice('Audrey', 'fr-FR')])
    expect(told).toBe(1)

    stop()
    synth.__replace([voice('Thomas', 'fr-FR')])
    expect(told).toBe(1)
  })
})

describe('the novelty voices are not offered', () => {
  it('leaves them out of the list entirely', async () => {
    install([voice('Thomas', 'fr-FR'), voice('Flo (French (France))', 'fr-FR')])
    const { loadVoices, frenchVoicesRanked } = await import('./speech')
    await loadVoices()
    expect(frenchVoicesRanked().map((v) => v.name)).toEqual(['Thomas'])
  })

  it('keeps them only when there is nothing else to speak with', async () => {
    // Silence would be worse; Settings explains how to install a real voice.
    install([voice('Flo (French (France))', 'fr-FR'), voice('Grandpa (French (France))', 'fr-FR')])
    const { loadVoices, frenchVoicesRanked } = await import('./speech')
    await loadVoices()
    expect(frenchVoicesRanked()).toHaveLength(2)
  })
})

describe('a voice chosen in one browser, opened in another', () => {
  it('finds it even though the browsers give it different ids', async () => {
    // The report: chosen in Chrome, the select was empty in Firefox — while
    // the voice was in the list and was in fact being used to speak.
    install([voice('Aurélie (Enhanced)', 'fr-FR')])
    const { loadVoices, resolveVoice } = await import('./speech')
    await loadVoices()
    expect(
      resolveVoice('urn:moz-tts:osx:com.apple.voice.aurelie', 'Aurélie (Enhanced)')?.name,
    ).toBe('Aurélie (Enhanced)')
  })

  it('matches when the name differs by the quality suffix', async () => {
    // Chrome says "Aurélie (Enhanced)", Firefox says "Aurélie" — same voice.
    install([voice('Aurélie', 'fr-FR')])
    const { loadVoices, resolveVoice } = await import('./speech')
    await loadVoices()
    expect(resolveVoice('chrome-uri', 'Aurélie (Enhanced)')?.name).toBe('Aurélie')
  })

  it('matches across a vendor prefix', async () => {
    install([voice('Denise', 'fr-FR')])
    const { loadVoices, resolveVoice } = await import('./speech')
    await loadVoices()
    expect(resolveVoice('some-uri', 'Microsoft Denise - French (France)')?.name).toBe('Denise')
  })

  it('honours the exact name when the device has it', async () => {
    // Choosing "Aurélie" and being given "Aurélie (Premium)" would be the app
    // overruling a choice it was asked to remember.
    install([voice('Aurélie', 'fr-FR'), voice('Aurélie (Premium)', 'fr-FR')])
    const { loadVoices, resolveVoice } = await import('./speech')
    await loadVoices()
    expect(resolveVoice('gone', 'Aurélie')?.name).toBe('Aurélie')
  })

  it('takes the better build only when neither name matches exactly', async () => {
    install([voice('Aurélie (Compact)', 'fr-FR'), voice('Aurélie (Premium)', 'fr-FR')])
    const { loadVoices, resolveVoice } = await import('./speech')
    await loadVoices()
    expect(resolveVoice('gone', 'Aurélie (Enhanced)')?.name).toBe('Aurélie (Premium)')
  })

  it('still gives up when the voice is genuinely not installed', async () => {
    // Not the same as "cannot match": the caller must fall back and the UI
    // must say so, rather than showing the box as though nothing were chosen.
    install([voice('Thomas', 'fr-FR')])
    const { loadVoices, resolveVoice } = await import('./speech')
    await loadVoices()
    expect(resolveVoice('gone', 'Aurélie')).toBeUndefined()
  })
})

/* ------------------------------------------------------------------ *
 * Following along
 * ------------------------------------------------------------------ */

describe('following the voice word by word', () => {
  it('counts the words the way the text on screen does', async () => {
    install([])
    const { wordsOf } = await import('./speech')
    // Punctuation on its own is not a word; notation is not spoken at all.
    expect(wordsOf('Un peu. Je ne parle pas — très bien !')).toEqual([
      'Un',
      'peu.',
      'Je',
      'ne',
      'parle',
      'pas',
      'très',
      'bien',
    ])
    expect(wordsOf('les amis → [le‿za.mi]')).toEqual(['les', 'amis'])
  })

  it('reports each word as the engine reaches it, skipping the punctuation', async () => {
    install([voice('Aurélie', 'fr-FR')])
    const { speak } = await import('./speech')
    const seen: number[] = []
    await speak('Tu parles français ?', { onWord: (i) => seen.push(i) })
    const u = lastUtterance as unknown as {
      text: string
      onboundary?: (e: { name: string; charIndex: number; charLength?: number }) => void
    }
    expect(u.onboundary).toBeTypeOf('function')
    // Chrome sends a sentence boundary first, then one per word; some engines
    // also report the trailing "?" as its own boundary. Only the words count.
    u.onboundary!({ name: 'sentence', charIndex: 0 })
    u.onboundary!({ name: 'word', charIndex: 0, charLength: 2 })
    u.onboundary!({ name: 'word', charIndex: 3, charLength: 6 })
    u.onboundary!({ name: 'word', charIndex: 10, charLength: 8 })
    u.onboundary!({ name: 'word', charIndex: 19, charLength: 1 })
    expect(seen).toEqual([0, 1, 2])
  })

  it('says a sequence in order and stops the moment something else is said', async () => {
    install([voice('Aurélie', 'fr-FR')])
    const { speak, speakSequence } = await import('./speech')
    const parts: number[] = []
    const run = speakSequence(['un', 'deux', 'trois'], { gapMs: 0, onPart: (i) => parts.push(i) })
    // Let the first part be handed to the engine, then end it.
    await new Promise((r) => setTimeout(r, 0))
    lastUtterance!.onend?.(new Event('end') as never)
    await new Promise((r) => setTimeout(r, 0))
    // A tap elsewhere while the second is playing: the sequence must yield.
    await speak('bonjour')
    lastUtterance!.onend?.(new Event('end') as never)
    await run
    expect(parts).toEqual([0, 1])
    expect(spoken.map((s) => s.text)).toEqual(['un', 'deux', 'bonjour'])
  })
})

describe('the slow reading', () => {
  it('cuts a phrase into short groups that end at punctuation', async () => {
    install([])
    const { slowChunks } = await import('./speech')
    expect(slowChunks('Je ne parle pas très bien français.')).toEqual([
      'Je ne parle',
      'pas très bien',
      'français.',
    ])
    expect(slowChunks('Oui, je suis très fatiguée ce soir.')).toEqual([
      'Oui,',
      'je suis très',
      'fatiguée ce soir.',
    ])
    expect(slowChunks('bonjour')).toEqual(['bonjour'])
  })
})

describe('pacing the slow reading', () => {
  it('groups by length: a pause between two words, after each two up to five', async () => {
    install([])
    const { slowGroups } = await import('./speech')
    expect(slowGroups('Tu parles français ?')).toEqual(['Tu parles', 'français ?'])
    expect(slowGroups('au revoir')).toEqual(['au', 'revoir'])
    expect(slowGroups('bonjour')).toEqual(['bonjour'])
    expect(slowGroups('Je ne parle pas très bien français.')).toEqual([
      'Je ne parle',
      'pas très bien',
      'français.',
    ])
  })

  it('never puts a full stop after a word, which the engine would spell out', async () => {
    install([voice('Aurélie', 'fr-FR')])
    const { speak } = await import('./speech')
    await speak('je')
    // "je." is read as an abbreviation — "jé-dé" — so the word goes as it is.
    expect(spoken[0].text).toBe('je')
  })
})

describe('alternatives are said one at a time', () => {
  it('gives each form its own utterance, with the shared verb on both', async () => {
    install([voice('Aurélie', 'fr-FR')])
    const { speak } = await import('./speech')
    const run = speak('il / elle a')
    await new Promise((r) => setTimeout(r, 0))
    expect(spoken.map((s) => s.text)).toEqual(['il a'])
    lastUtterance!.onend?.(new Event('end') as never)
    await new Promise((r) => setTimeout(r, 400))
    lastUtterance!.onend?.(new Event('end') as never)
    await run
    expect(spoken.map((s) => s.text)).toEqual(['il a', 'elle a'])
  })

  it('leaves a plain phrase as one utterance', async () => {
    install([voice('Aurélie', 'fr-FR')])
    const { speak, alternativesOf } = await import('./speech')
    await speak('Je ne parle pas très bien français.')
    expect(spoken).toHaveLength(1)
    expect(alternativesOf('content / contente')).toEqual(['content', 'contente'])
    expect(alternativesOf("qu'il / elle prenne")).toEqual(["qu'il prenne", "qu'elle prenne"])
  })
})
