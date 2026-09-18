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
      // Joining alternatives can double up a comma when one already ended in
      // one ("Bien à vous, / Bonne journée,").
      .replace(/,\s*,/g, ',')
      .replace(/[,\s]+$/, '')
      .trim()
  )
}

/** French subject pronouns — a closed class, so this set is complete. */
const SUBJECT_PRONOUNS = new Set([
  'je',
  "j'",
  'tu',
  'il',
  'elle',
  'on',
  'nous',
  'vous',
  'ils',
  'elles',
])

/**
 * Read every alternative, not just the first.
 *
 * This used to stop at the slash, on the grounds that "content slash contente"
 * teaches nobody anything. True of the symbol — but the remedy threw away half
 * the content along with it. Hearing "content, contente" *is* the lesson: the
 * silent final consonant comes back in the feminine. So the slash becomes a
 * pause and both forms are spoken.
 *
 * One case needs more than a pause. "il / elle a" is a row of a conjugation
 * table and means *il a / elle a* — the verb belongs to both pronouns. Stopping
 * at the slash left a bare "il" with no verb at all, which is the one row of
 * the table you could not hear. So a trailing form is handed to each pronoun in
 * turn: "il a, elle a".
 *
 * That sharing applies only when every alternative but the last is a subject
 * pronoun. Otherwise the slash is separating whole phrases with nothing in
 * common, and borrowing a tail would invent text — "Ainsi, / Par exemple,"
 * must not become "Ainsi, exemple,".
 */
function expandAlternatives(text: string) {
  const parts = text.split(' / ')
  if (parts.length < 2) return text

  const last = parts[parts.length - 1].split(' ')
  const leading = parts.slice(0, -1)
  const sharesTail =
    last.length > 1 &&
    leading.every((p) => SUBJECT_PRONOUNS.has(p.toLowerCase().replace(/’/g, "'")))

  if (!sharesTail) return parts.join(', ')

  const tail = last.slice(1).join(' ')
  return [...leading.map((p) => `${p} ${tail}`), parts[parts.length - 1]].join(', ')
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
  if (!opts.partOfSequence) bump()

  // Only wait for the voice list when we haven't got one yet. Awaiting
  // unconditionally put a promise hop — and, on a cold page where Chrome has
  // not populated voices, up to the full safety-net timeout — in front of every
  // single tap on a word.
  if (!cachedVoices.length) await loadVoices()

  // Barge-in: a new utterance always replaces the old one.
  window.speechSynthesis.cancel()

  const u = new SpeechSynthesisUtterance(rounded(speakable(text)))
  u.lang = opts.lang ?? 'fr-FR'
  u.rate = opts.rate ?? 0.92
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
  window.speechSynthesis.speak(u)

  // Chrome bug: synthesis pauses itself on long utterances.
  const keepAlive = setInterval(() => {
    if (currentUtterance !== u) return clearInterval(keepAlive)
    if (!window.speechSynthesis.speaking) return clearInterval(keepAlive)
    window.speechSynthesis.pause()
    window.speechSynthesis.resume()
  }, 9000)
}

/**
 * A full stop where there was none.
 *
 * A word said on its own — "Je", "à" — ends with the engine cutting the
 * last sound short, as if the recording stopped a moment early; it is most
 * audible on the shortest words, which is exactly what the tap-to-hear and
 * word-by-word readings play. Terminal punctuation makes the voice finish
 * the sound and fall, the way a spoken word ends.
 */
export function rounded(text: string): string {
  const t = text.trim()
  if (!t) return t
  return /[.!?…»"]$/.test(t) ? t : `${t}.`
}

/**
 * The slow reading as one utterance.
 *
 * Earlier this played the groups as separate utterances, which added the
 * engine's start-up to every group and clipped the end of each one. One
 * utterance with a comma between groups gives the same breaths from the
 * voice's own phrasing, with nothing cut.
 *
 * The pauses are where the slowness comes from, so there have to be some:
 * a short phrase pauses after every two words rather than three. A word on
 * its own has nowhere to pause and is said once at the slow rate.
 */
export function slowText(text: string): string {
  const words = wordsOf(text)
  // A lone word has nowhere to pause; it is simply said once at the slow
  // rate. Saying it twice was tried and sounded odd.
  if (words.length <= 1) return speakable(text)
  // Two words get a pause between them; up to five, a pause after each two.
  const size = words.length <= 2 ? 1 : words.length <= 5 ? 2 : 3
  return slowChunks(text, size)
    .map((c, i, all) => (i < all.length - 1 && !/[,;:.!?…]$/.test(c) ? `${c},` : c))
    .join(' ')
}

/**
 * The word-by-word reading as one utterance: each word ends the sentence,
 * so the voice says it whole, pauses, and starts the next.
 */
export function wordByWordText(text: string): string {
  return wordsOf(text)
    .map((w) => w.replace(/[,;:]+$/, ''))
    .map((w) => (/[.!?…]$/.test(w) ? w : `${w}.`))
    .join(' ')
}

/**
 * A phrase cut into short groups, for the slow reading.
 *
 * Asking the engine for a low rate is not enough: the system voices on
 * Apple devices clamp it, so 0.2 plays only a little slower than 1.0 —
 * measured, not assumed. What makes speech genuinely easier to follow is
 * the pauses: two or three words, a breath, two or three more. Groups end
 * at punctuation where there is any, so a clause is never split mid-way.
 */
export function slowChunks(text: string, size = 3): string[] {
  const words = speakable(text).split(/\s+/).filter(Boolean)
  const out: string[] = []
  let group: string[] = []
  for (const w of words) {
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
