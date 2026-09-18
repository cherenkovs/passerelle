/**
 * Voice layer — deliberately built on the browser's built-in Web Speech API.
 *
 * Rationale (see docs/RESEARCH.md): cloud TTS/STT costs money per character and
 * needs network. macOS/iOS ship genuinely good French voices (Thomas, Amélie,
 * Aurélie) and Chrome/Safari expose free French speech recognition. Result:
 * zero running cost, works offline, no API keys.
 */

let cachedVoices: SpeechSynthesisVoice[] = []
let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null

export function supportsTTS() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** Notified whenever the system's voice list changes. */
const voiceListeners = new Set<() => void>()
let watchingVoices = false

function readVoices(): boolean {
  const v = window.speechSynthesis.getVoices()
  if (!v.length) return false
  cachedVoices = v
  voiceListeners.forEach((fn) => fn())
  return true
}

/**
 * Keep listening after the first answer.
 *
 * This used to unsubscribe as soon as voices appeared, which made the list a
 * snapshot of the moment the app started. Install a voice in system settings —
 * the exact thing the app now tells people to do when it has nothing good to
 * read with — and it would not show up until the whole page was reloaded.
 */
function watchVoices() {
  if (watchingVoices || !supportsTTS()) return
  watchingVoices = true
  window.speechSynthesis.addEventListener('voiceschanged', () => readVoices())
}

/** Re-read the system list now, for a learner who has just installed a voice. */
export function refreshVoices(): SpeechSynthesisVoice[] {
  if (supportsTTS()) readVoices()
  return cachedVoices
}

export function onVoicesChanged(cb: () => void): () => void {
  voiceListeners.add(cb)
  return () => {
    voiceListeners.delete(cb)
  }
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!supportsTTS()) return Promise.resolve([])
  watchVoices()
  if (voicesReady) return voicesReady

  voicesReady = new Promise((resolve) => {
    if (readVoices()) {
      resolve(cachedVoices)
      return
    }
    // Chrome populates voices asynchronously.
    const onChange = () => {
      if (readVoices()) {
        window.speechSynthesis.removeEventListener('voiceschanged', onChange)
        resolve(cachedVoices)
      }
    }
    window.speechSynthesis.addEventListener('voiceschanged', onChange)
    // Safety net — some browsers never fire the event.
    setTimeout(() => {
      cachedVoices = window.speechSynthesis.getVoices()
      resolve(cachedVoices)
    }, 1200)
  })
  return voicesReady
}

export function frenchVoices(): SpeechSynthesisVoice[] {
  return cachedVoices.filter((v) => v.lang.toLowerCase().startsWith('fr'))
}

/**
 * The novelty voices.
 *
 * macOS ships a family of deliberately characterful voices — Grandma and
 * Grandpa sound elderly, Rocko and Eddy are cartoonish, Bubbles and Zarvox are
 * not trying to sound human at all. They are the ones that get described as
 * robotic, and on a Mac with none of the good French voices downloaded they
 * are most of what is installed, so they are easy to pick by accident.
 *
 * Never chosen automatically. A learner is judging their own pronunciation
 * against whatever this says, and a comedy voice makes that impossible. They
 * stay selectable by hand for anyone who wants one.
 */
const NOVELTY_VOICES = [
  'eddy',
  'flo',
  'grandma',
  'grandpa',
  'reed',
  'rocko',
  'sandy',
  'shelley',
  'bahh',
  'bells',
  'boing',
  'bubbles',
  'cellos',
  'jester',
  'organ',
  'superstar',
  'trinoids',
  'whisper',
  'wobble',
  'zarvox',
  'albert',
  'bad news',
  'good news',
]

export function isNoveltyVoice(v: SpeechSynthesisVoice): boolean {
  const name = v.name.toLowerCase()
  return NOVELTY_VOICES.some((n) => name.startsWith(n) || name.includes(`(${n}`))
}

/**
 * Real French voices, best first.
 *
 * These are the ones built to sound like a person reading: Apple's classic
 * French voices, Microsoft's, and Google's. Female before male, because the
 * onboarding gender question speaks its own example and so the default is the
 * first French anyone hears.
 *
 * Alice leads by request. On most systems she is Italian and never matches
 * here, which is the point — variety is filtered before this list is read.
 */
const VOICE_RANK = [
  'alice',
  'aurélie',
  'aurelie',
  'audrey',
  'marie',
  'amélie',
  'amelie',
  'chantal',
  'denise',
  'julie',
  'hortense',
  'google français',
  'google french',
  'thomas',
  'jacques',
  'nicolas',
  'paul',
  'henri',
]

function isFrance(v: SpeechSynthesisVoice) {
  return v.lang.toLowerCase().replace('_', '-') === 'fr-fr'
}

/**
 * Apple and Microsoft ship several grades of the same voice, and the better
 * ones are downloads rather than defaults. Where both are present, take the
 * one that was deliberately installed.
 */
function isHighQuality(v: SpeechSynthesisVoice) {
  return /\b(enhanced|premium|natural|neural)\b/i.test(v.name)
}

function rankOf(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase()
  const i = VOICE_RANK.findIndex((p) => name.includes(p))
  return i === -1 ? VOICE_RANK.length : i
}

/**
 * A voice's name without the language spelled out again.
 *
 * The lists read "Flo (French (France)) · Франція", which says France twice and
 * buries the only part that identifies the voice. Windows does the same with
 * "Microsoft Denise - French (France)".
 */
export function voiceLabel(v: SpeechSynthesisVoice): string {
  return v.name
    .replace(/\s*[-–]\s*French.*$/i, '')
    .replace(/\s*\(French.*$/i, '')
    .replace(/^Microsoft\s+/i, '')
    .trim()
}

/** Voices that threw while speaking; not offered again this session. */
const brokenVoices = new Set<string>()

/**
 * Every French voice this device has, best first.
 *
 * Returned as an ordered list rather than a single pick so that a voice which
 * fails mid-sentence can be set aside and the next one tried, instead of the
 * learner simply hearing nothing.
 *
 * The order is: metropolitan French before any other variety, because the
 * course teaches Paris and the DELF and an accent is not a matter of taste;
 * then voices installed on the device before ones fetched over the network,
 * which are slower and stop working on a train; then the ranked names above.
 */
export function frenchVoicesRanked(): SpeechSynthesisVoice[] {
  const usable = frenchVoices().filter((v) => !brokenVoices.has(v.voiceURI))

  // The novelty voices are not offered at all. They are not a worse choice, they
  // are the wrong kind of thing — a learner cannot judge their own pronunciation
  // against a cartoon. The only reason to keep any is that a machine with
  // nothing else should still make a sound; Settings says how to fix that.
  const real = usable.filter((v) => !isNoveltyVoice(v))
  const pool = real.length ? real : usable

  return pool.sort((a, b) => {
    if (isFrance(a) !== isFrance(b)) return isFrance(a) ? -1 : 1
    if (isHighQuality(a) !== isHighQuality(b)) return isHighQuality(a) ? -1 : 1
    if (a.localService !== b.localService) return a.localService ? -1 : 1
    return rankOf(a) - rankOf(b)
  })
}

export function pickDefaultFrenchVoice(): SpeechSynthesisVoice | undefined {
  return frenchVoicesRanked()[0]
}

/** Remember that a voice failed, so the next attempt moves on to another. */
export function markVoiceBroken(voiceURI: string) {
  brokenVoices.add(voiceURI)
}

/**
 * Strip what a browser adds to a voice's name, leaving the voice itself.
 *
 * The same voice is reported differently depending on who is asking: Chrome on
 * macOS says "Aurélie (Enhanced)", Firefox says "Aurélie", Windows prefixes
 * "Microsoft ", and some builds append the locale. Comparing raw names across
 * browsers therefore fails on the same machine, for the same voice.
 */
function baseVoiceName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^(microsoft|google|apple)\s+/i, '')
    .replace(/\s*\((?:enhanced|premium|compact|natural|neural)\)\s*/gi, ' ')
    .replace(/\s*[-–(].*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * The learner's chosen voice, on whatever machine is doing the reading.
 *
 * Tried in order, because each identifier survives a different distance. The
 * voiceURI is exact but belongs to one browser on one machine — Firefox and
 * Chrome give the same voice different ones, which is why a choice made in one
 * showed up as an empty box in the other. The full name crosses browsers on the
 * same system. The base name crosses systems, where the quality suffix or a
 * vendor prefix differs.
 *
 * When none matches, the voice is genuinely absent and the caller falls back to
 * the best French voice actually installed.
 */
export function resolveVoice(
  voiceURI?: string | null,
  voiceName?: string | null,
): SpeechSynthesisVoice | undefined {
  if (voiceURI) {
    const exact = cachedVoices.find((v) => v.voiceURI === voiceURI)
    if (exact) return exact
  }
  if (!voiceName) return undefined

  const byName = cachedVoices.find((v) => v.name === voiceName)
  if (byName) return byName

  const wanted = baseVoiceName(voiceName)
  if (!wanted) return undefined
  const sameVoice = cachedVoices.filter((v) => baseVoiceName(v.name) === wanted)
  if (!sameVoice.length) return undefined

  // More than one build of it: take the better one, the way the ranking would.
  return (
    sameVoice.find((v) => /\b(enhanced|premium|natural|neural)\b/i.test(v.name)) ?? sameVoice[0]
  )
}

export type SpeakOptions = {
  rate?: number
  pitch?: number
  voiceURI?: string
  voiceName?: string
  lang?: string
  onEnd?: () => void
  onStart?: () => void
  /**
   * Called as each word starts, with its index among the spoken words.
   *
   * This is what lets the text light up in time with the voice. Word boundary
   * events come from the engine, not from a timer, so the highlight stays with
   * the sound even when the voice hesitates. Not every engine sends them —
   * Firefox rarely does — in which case this is simply never called and the
   * text stays as it was.
   */
  onWord?: (index: number) => void
  /** Identity of the caller, so it can later cancel only its own speech. */
  owner?: unknown
  /** Set when this is already the retry after a voice failed; stops a loop. */
  retried?: boolean
  /** Internal: this utterance is one step of speakSequence and must not end it. */
  partOfSequence?: boolean
}

/**
 * Which run of speech is current. Every new request — a tap, a cancel, a
 * sequence starting — moves it on, and a sequence in progress stops the moment
 * it sees the number change under it. This is what makes "tap another word
 * halfway through a word-by-word reading" do the obvious thing.
 */
let generation = 0

/**
 * Sequences waiting on an utterance to finish.
 *
 * An interrupted utterance does not reliably report its end — some engines
 * fire an error, some fire nothing — so a sequence cannot wait on that alone.
 * Moving the generation on releases every waiter, and each then sees it is no
 * longer current and stops.
 */
const waiters = new Set<() => void>()

function bump() {
  generation++
  for (const release of waiters) release()
  waiters.clear()
}

/**
 * The words of a phrase, as the voice will meet them.
 *
 * Split after the notation has been stripped, so the count matches the words
 * the engine reports boundaries for and the tokens the text is displayed as.
 * Tokens with no letters — a stray dash, a lone quotation mark — are dropped,
 * because neither the engine nor the reader counts them as words.
 */
export function wordsOf(text: string): string[] {
  return speakable(text)
    .split(/\s+/)
    .filter((w) => /\p{L}/u.test(w))
}

/**
 * A rough length for a phrase, for pauses that should scale with it.
 *
 * Shadowing needs a gap after each line long enough to say it back. Timing the
 * actual utterance would be exact but would need it to finish first; at ~14
 * characters a second for the default rate this is close enough to leave a
 * gap that feels like the learner's turn rather than a hiccup.
 */
export function estimateMs(text: string, rate = 0.92): number {
  const chars = speakable(text).length
  return Math.max(900, Math.round((chars / 14) * 1000 * (1 / Math.max(rate, 0.3))))
}

let currentUtterance: SpeechSynthesisUtterance | null = null

/**
 * Who started what is currently being said.
 *
 * Components stop the voice when they unmount, so that leaving a page does not
 * leave it talking to an empty room. But an unmount is not evidence that the
 * voice is saying *your* text: on a flashcard, flipping the card unmounts the
 * speaker button inside it, and a blanket cancel there cut off the word the
 * card itself had just started — measured at exactly 1.0s in, every flip.
 *
 * So ownership is recorded, and an unmount only silences its own utterance.
 */
let currentOwner: unknown = null

export function cancelSpeech() {
  if (!supportsTTS()) return
  bump()
  currentUtterance = null
  currentOwner = null
  window.speechSynthesis.cancel()
}

/** Stop the voice only if it is still saying something `owner` started. */
export function cancelSpeechBy(owner: unknown) {
  if (owner !== null && currentOwner === owner) cancelSpeech()
}

/**
 * Strip everything that is notation rather than speech.
 *
 * Lesson copy is written to be *read*, and it carries marks a synthesiser will
 * happily pronounce: emphasis asterisks, a derivation arrow, the IPA in
 * brackets. "les amis → [le‿za.mi]" was being spoken in full — the learner
 * heard the phrase, then a long stretch of the engine working through phonetic
 * symbols, which is where the "why is this taking so long" comes from.
 *
 * A slash separates alternatives, which are read in turn with a pause between
 * them — see `expandAlternatives`.
 */
export function speakable(text: string) {
  const cleaned = text
    .replace(/\*+/g, '')
    .replace(/^[❌✅]\s*/, '')
    // An arrow becomes a pause, not a full stop. It used to truncate, which
    // was right for "les amis → [le‿za.mi]" but wrong everywhere else: in an
    // explanation like "De + Ukraine → d'Ukraine" the interesting half is the
    // one after the arrow, and it was being silently cut off.
    .replace(/\s*[→⟶⇒]\s*/g, ', ')
    // IPA between brackets, plus the liaison undertie if it escaped them.
    .replace(/\[[^\]]*\]/g, '')
    .replace(/‿/g, ' ')
    // "+" joins the parts of a formula — "ne + ДІЄСЛОВО + pas". A French
    // voice reads it as the word *plus*, so the schema came out as
    // "ne plus plus pas".
    .replace(/[+=]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return (
    expandAlternatives(cleaned)
      .replace(new RegExp(ALT, 'g'), '. ')
      // Joining alternatives can double up a comma when one already ended in
      // one ("Bien à vous, / Bonne journée,").
      .replace(/,\s*,/g, ',')
      .replace(/[,\s]+$/, '')
      .trim()
  )
}

/** French subject pronouns — a closed class, so this set is complete. */
/** Marks the boundary between alternatives; never appears in real text. */
const ALT = '\u0001'

/**
 * The alternatives of a slashed string, exactly as written.
 *
 * "il / elle est" is read as "il", then "elle est" — what is on the screen,
 * no more. An earlier version handed the verb to each pronoun ("il est,
 * elle est"), which was clever and sounded like a mistake: the learner saw
 * one thing and heard another. Each alternative is its own utterance, since
 * no punctuation makes the engine pause between short words (measured).
 */
export function alternativesOf(text: string): string[] {
  return expandAlternatives(text)
    .split(ALT)
    .map((p) => p.trim().replace(/[,;:]+$/, ''))
    .filter(Boolean)
}

function expandAlternatives(text: string) {
  // A comma that ended an alternative would sit against the stop that
  // follows it in the displayed form: "Ainsi,." — so it is dropped.
  return text
    .split(' / ')
    .map((p) => p.trim().replace(/[,;:]+$/, ''))
    .join(ALT)
}

/** Anything outside the Cyrillic alphabet, which in this app means French. */
const CYRILLIC = /[\u0400-\u04FF]/

/**
 * Pull the French out of a mixed Ukrainian/French string.
 *
 * Explanations are written in Ukrainian *about* French — "De + Ukraine →
 * d'Ukraine, бо наступне слово з голосної" — so there is something worth
 * hearing in most of them, but handing the whole line to a French voice would
 * have it stumble through the Cyrillic.
 *
 * The split is by script, which is exact here rather than a guess: Ukrainian is
 * Cyrillic and French is Latin, with no overlap. Fragments are joined with a
 * full stop so the synthesiser pauses between them instead of running two
 * unrelated phrases together.
 */
export function frenchIn(text: string): string {
  const out: string[] = []
  let run: string[] = []

  const flush = () => {
    // A token with no letters at all is punctuation or a stray symbol: there is
    // nothing in it to pronounce, and leaving it in gives the voice something
    // to stumble over between the words that matter.
    run = run.filter((w) => /\p{L}/u.test(w))
    if (run.some((w) => /\p{Script=Latin}/u.test(w))) {
      // Trailing punctuation belonged to the Ukrainian that has just been cut
      // away, so it would only make the voice pause on nothing.
      out.push(run.join(' ').replace(/[\s,;:—–-]+$/, ''))
    }
    run = []
  }

  for (const word of speakable(text).split(/\s+/)) {
    if (CYRILLIC.test(word)) flush()
    else run.push(word)
  }
  flush()

  // A full stop between fragments so the voice pauses — but only where the
  // fragment hasn't already ended in one, or "тому en." becomes "en..".
  return out
    .map((f, i) => (i === out.length - 1 || /[.!?…]$/.test(f) ? f : `${f}.`))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function speak(text: string, opts: SpeakOptions = {}) {
  if (!supportsTTS() || !text?.trim()) return

  // "il / elle est" is two utterances, with the engine's own gap between
  // them — the one pause it respects. The word index the highlight follows
  // runs on across the parts.
  if (!opts.partOfSequence) {
    const parts = alternativesOf(text)
    if (parts.length > 1) {
      const starts: number[] = []
      let n = 0
      for (const p of parts) {
        starts.push(n)
        n += wordsOf(p).length
      }
      await speakSequence(parts, {
        ...opts,
        gapMs: 320,
        onWord: opts.onWord ? (part, word) => opts.onWord!(starts[part] + word) : undefined,
      })
      opts.onEnd?.()
      return
    }
  }

  if (!opts.partOfSequence) bump()

  // Only wait for the voice list when we haven't got one yet. Awaiting
  // unconditionally put a promise hop — and, on a cold page where Chrome has
  // not populated voices, up to the full safety-net timeout — in front of every
  // single tap on a word.
  if (!cachedVoices.length) await loadVoices()

  const synth = window.speechSynthesis

  const u = new SpeechSynthesisUtterance(speakable(text))
  u.lang = opts.lang ?? 'fr-FR'
  u.rate = paceFor(u.text, opts.rate ?? 0.92)
  u.pitch = opts.pitch ?? 1

  const voice =
    resolveVoice(opts.voiceURI, opts.voiceName) ??
    (u.lang.startsWith('fr') ? pickDefaultFrenchVoice() : undefined)
  if (voice) u.voice = voice

  if (opts.onStart) u.onstart = opts.onStart

  if (opts.onWord) {
    const onWord = opts.onWord
    let index = -1
    u.onboundary = (event) => {
      // Chrome reports sentence boundaries too; only the words count.
      if (event.name && event.name !== 'word') return
      // Safari leaves charLength undefined; one character is enough to tell a
      // word from the punctuation between words, which has no letter in it.
      const piece = u.text.slice(event.charIndex, event.charIndex + (event.charLength || 1))
      if (!/\p{L}/u.test(piece)) return
      index += 1
      onWord(index)
    }
  }

  const finish = () => {
    if (currentUtterance === u) {
      currentUtterance = null
      currentOwner = null
    }
    opts.onEnd?.()
  }
  u.onend = finish

  /**
   * A voice can be listed and still fail to speak — a network voice with no
   * network, or one the system has not finished installing. Set it aside and
   * try the next one down the ranking, once, rather than leaving the learner
   * with silence and no way to know why.
   */
  u.onerror = (event) => {
    const failed = u.voice
    // "interrupted" and "canceled" are barge-in: a new utterance replaced this
    // one on purpose, and the voice is fine.
    const reason = (event as SpeechSynthesisErrorEvent)?.error
    const bargeIn = reason === 'interrupted' || reason === 'canceled'

    if (!bargeIn && failed && !opts.retried) {
      markVoiceBroken(failed.voiceURI)
      const next = pickDefaultFrenchVoice()
      if (next && next.voiceURI !== failed.voiceURI) {
        currentUtterance = null
        currentOwner = null
        void speak(text, { ...opts, voiceURI: next.voiceURI, voiceName: next.name, retried: true })
        return
      }
    }
    finish()
  }

  currentUtterance = u
  currentOwner = opts.owner ?? null

  let started = false
  const onStart = u.onstart
  u.onstart = (e) => {
    started = true
    onStart?.call(u, e)
  }

  // Barge-in, and the handshake that keeps Chrome's engine honest.
  //
  // Cancelled mid-word a few times in a row — a learner tapping the speaker
  // impatiently is enough — the engine jams: it reports nothing playing,
  // accepts the next utterance, and never starts it. Measured: cancel() on
  // its own does not clear that, nor does resume() on its own, but cancel()
  // followed by resume() does, and the next utterance then starts within
  // about 30 ms. So that pair goes in front of every utterance, jammed or
  // not; when the engine is fine it costs nothing.
  synth.cancel()
  synth.resume()
  synth.speak(u)

  // And a watchdog, for the jam that gets through anyway. If the utterance
  // has not started after a second, pause and resume — measured to bring a
  // jammed engine back — and if that fails too, take it back and try once
  // more from the top.
  setTimeout(() => {
    if (started || currentUtterance !== u) return
    synth.pause()
    synth.resume()
    setTimeout(() => {
      if (started || currentUtterance !== u) return
      synth.cancel()
      synth.resume()
      synth.speak(u)
    }, 900)
  }, 1000)

  // Chrome bug: synthesis stops itself partway through a long utterance on
  // a network voice. Pausing and resuming keeps it going. Local voices do
  // not need it, and on them the same nudge can itself cause a hiccup.
  if (voice && !voice.localService) {
    const keepAlive = setInterval(() => {
      if (currentUtterance !== u) return clearInterval(keepAlive)
      if (!synth.speaking) return clearInterval(keepAlive)
      synth.pause()
      synth.resume()
    }, 9000)
  }
}

/**
 * The rate a text is actually spoken at.
 *
 * A short word on its own — "il", "ils", "je" — is dragged out by the voice:
 * measured on Aurélie, a lone "il" takes 430 ms where the same "il" inside
 * "il est" takes about 150, the extra being a held, released l that the ear
 * takes for a second syllable ("il-le"). Nothing written around the word
 * changes that (measured: commas, stops, dashes, spaces). What does is the
 * rate, which the engine honours on the fast side: at 2× the lone word is
 * back at its in-sentence length (measured: 230 ms) and sounds like the
 * word again.
 *
 * Only for a lone word of up to three letters; longer words are not dragged
 * the same way, and a phrase never is.
 */
export function paceFor(spoken: string, rate: number): number {
  const words = spoken.split(/\s+/).filter((w) => /\p{L}/u.test(w))
  if (words.length !== 1) return rate
  const letters = words[0].replace(/[^\p{L}]/gu, '')
  if (letters.length > 3) return rate
  return Math.min(rate * 2, 2)
}

/**
 * A phrase cut into short groups, for the slow reading.
 *
 * Asking the engine for a low rate is not enough: the system voices on
 * Apple devices clamp it, so 0.2 plays only a little slower than 1.0 —
 * measured, not assumed. What makes speech genuinely easier to follow is
 * the pauses: two or three words, a breath, two or three more. Groups end
 * at punctuation where there is any, so a clause is never split mid-way.
 *
 * Each group is its own utterance. No punctuation makes the engine pause
 * between short words — that was measured too — and a full stop after a
 * short word makes it read an abbreviation ("je." came out as "jé-dé").
 */
export function slowGroups(text: string): string[] {
  const n = wordsOf(text).length
  // Two words get a pause between them; up to five, a pause after each two.
  return slowChunks(text, n <= 2 ? 1 : n <= 5 ? 2 : 3)
}

export function slowChunks(text: string, size = 3): string[] {
  const words = speakable(text).split(/\s+/).filter(Boolean)
  const out: string[] = []
  let group: string[] = []
  for (const w of words) {
    // French spaces its question and exclamation marks — "et toi ?" — so a
    // mark can arrive as a token of its own. Left alone it became its own
    // utterance, and the voice read it out: "point d'interrogation".
    if (!/[\p{L}\p{N}]/u.test(w)) {
      if (group.length) group[group.length - 1] += ` ${w}`
      else if (out.length) out[out.length - 1] += ` ${w}`
      continue
    }
    group.push(w)
    const clauseEnd = /[,;:.!?…]$/.test(w)
    if (group.length >= size || clauseEnd) {
      out.push(group.join(' '))
      group = []
    }
  }
  if (group.length) out.push(group.join(' '))
  return out
}

/**
 * Say several things in turn, with a pause between them.
 *
 * Word-by-word reading and "play the whole dialogue" are the same operation
 * with different parts and a different gap. `onPart` fires as each begins, so
 * the text can follow along; the promise settles when the last has finished
 * or when something else has taken the voice — a tap elsewhere, a page left —
 * in which case the remaining parts are simply not said.
 */
export async function speakSequence(
  parts: string[],
  opts: Omit<SpeakOptions, 'onEnd' | 'onWord' | 'partOfSequence'> & {
    gapMs?: number
    onPart?: (index: number) => void
    /** A word starting, as (part index, word index within the part). */
    onWord?: (part: number, word: number) => void
  } = {},
): Promise<void> {
  if (!supportsTTS() || !parts.length) return
  bump()
  const mine = generation
  const gap = opts.gapMs ?? 320

  for (let i = 0; i < parts.length; i++) {
    if (generation !== mine) return
    opts.onPart?.(i)
    await new Promise<void>((resolve) => {
      waiters.add(resolve)
      void speak(parts[i], {
        ...opts,
        partOfSequence: true,
        onWord: opts.onWord ? (w) => opts.onWord!(i, w) : undefined,
        onEnd: () => {
          waiters.delete(resolve)
          resolve()
        },
      })
    })
    if (generation !== mine) return
    if (i < parts.length - 1 && gap > 0) await new Promise((r) => setTimeout(r, gap))
  }
}

/* ------------------------------------------------------------------ *
 * Speech recognition (learner speaking)
 * ------------------------------------------------------------------ */

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: any) => void) | null
  onerror: ((e: any) => void) | null
  onend: (() => void) | null
}

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as any
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function supportsSTT() {
  return Boolean(getRecognitionCtor())
}

export type ListenHandle = {
  stop: () => void
  result: Promise<string>
}

/**
 * Listen once and resolve with the best transcript.
 * `onInterim` streams partial results so the UI can show live text.
 */
export function listenOnce(
  opts: { lang?: string; onInterim?: (text: string) => void } = {},
): ListenHandle {
  const Ctor = getRecognitionCtor()
  if (!Ctor) {
    return { stop: () => {}, result: Promise.reject(new Error('unsupported')) }
  }

  const rec = new Ctor()
  rec.lang = opts.lang ?? 'fr-FR'
  rec.continuous = false
  rec.interimResults = true
  rec.maxAlternatives = 3

  let best = ''
  let settled = false

  const result = new Promise<string>((resolve, reject) => {
    rec.onresult = (e: any) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) best = r[0].transcript
        else interim += r[0].transcript
      }
      opts.onInterim?.(best || interim)
    }
    rec.onerror = (e: any) => {
      if (settled) return
      settled = true
      reject(new Error(e?.error ?? 'speech-error'))
    }
    rec.onend = () => {
      if (settled) return
      settled = true
      resolve(best.trim())
    }
  })

  try {
    rec.start()
  } catch {
    /* already started */
  }

  return { stop: () => rec.stop(), result }
}
