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

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!supportsTTS()) return Promise.resolve([])
  if (voicesReady) return voicesReady

  voicesReady = new Promise((resolve) => {
    const read = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length) {
        cachedVoices = v
        resolve(v)
        return true
      }
      return false
    }
    if (read()) return
    // Chrome populates voices asynchronously.
    const onChange = () => {
      if (read()) window.speechSynthesis.removeEventListener('voiceschanged', onChange)
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
 * Voices to reach for first, checked only among voices of the right variety.
 *
 * Ordered female-first. The list used to open with Thomas, so the very first
 * thing a learner heard — the example on the onboarding gender question — was
 * a man's voice regardless of anything else.
 *
 * Alice leads because she was asked for by name. On most systems Alice is an
 * Italian voice and will simply never match here, which is the intent: the
 * variety check runs first, so she is only ever chosen on a device that ships
 * a French one. A course about French vowels read by an Italian synthesiser
 * would teach the wrong sounds.
 *
 * Audrey, Aurélie, Amélie and Marie are the classic French female voices;
 * Flo, Sandy and Shelley are the newer system ones, kept last because they are
 * more stylised.
 */
const PREFERRED_NAMES = [
  'alice',
  'audrey',
  'aurélie',
  'aurelie',
  'amélie',
  'amelie',
  'marie',
  'flo',
  'sandy',
  'shelley',
]

function isFrance(v: SpeechSynthesisVoice) {
  return v.lang.toLowerCase().replace('_', '-') === 'fr-fr'
}

/**
 * Best-guess default: **metropolitan French first**, then a good name.
 *
 * The order matters. Checking names first picked "Amélie", who on macOS is
 * fr-CA — so a course built around Paris, Lyon and the DELF was teaching a
 * Québec accent. Variety beats timbre: a learner can live with a plainer
 * voice, not with the wrong vowels.
 */
export function pickDefaultFrenchVoice(): SpeechSynthesisVoice | undefined {
  const fr = frenchVoices()
  if (!fr.length) return undefined

  const pick = (pool: SpeechSynthesisVoice[]) => {
    if (!pool.length) return undefined
    const local = pool.filter((v) => v.localService)
    const best = local.length ? local : pool
    return (
      best.find((v) => PREFERRED_NAMES.some((p) => v.name.toLowerCase().includes(p))) ?? best[0]
    )
  }

  return pick(fr.filter(isFrance)) ?? pick(fr)
}

/**
 * The "slow" button is relative to the learner's own setting: someone who has
 * already slowed the main voice down expects slow to be slower still, not to
 * jump back up to a fixed rate.
 *
 * The floor sits below the speed slider's own minimum on purpose. With both at
 * 0.4, a learner who had dragged the slider all the way down and then pressed
 * "slow" got exactly the rate they already had — the button silently did
 * nothing for the people most likely to need it.
 */
export const SLOW_FLOOR = 0.3

export function slowRate(rate: number) {
  return Math.min(Math.max(rate * 0.5, SLOW_FLOOR), 0.6)
}

export type SpeakOptions = {
  rate?: number
  pitch?: number
  voiceURI?: string
  lang?: string
  onEnd?: () => void
  onStart?: () => void
  /** Identity of the caller, so it can later cancel only its own speech. */
  owner?: unknown
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

  // Only wait for the voice list when we haven't got one yet. Awaiting
  // unconditionally put a promise hop — and, on a cold page where Chrome has
  // not populated voices, up to the full safety-net timeout — in front of every
  // single tap on a word.
  if (!cachedVoices.length) await loadVoices()

  // Barge-in: a new utterance always replaces the old one.
  window.speechSynthesis.cancel()

  const u = new SpeechSynthesisUtterance(speakable(text))
  u.lang = opts.lang ?? 'fr-FR'
  u.rate = opts.rate ?? 0.92
  u.pitch = opts.pitch ?? 1

  const voice =
    (opts.voiceURI && cachedVoices.find((v) => v.voiceURI === opts.voiceURI)) ||
    (u.lang.startsWith('fr') ? pickDefaultFrenchVoice() : undefined)
  if (voice) u.voice = voice

  if (opts.onStart) u.onstart = opts.onStart
  const finish = () => {
    if (currentUtterance === u) {
      currentUtterance = null
      currentOwner = null
    }
    opts.onEnd?.()
  }
  u.onend = finish
  u.onerror = finish

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
