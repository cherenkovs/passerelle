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

/** Nice-sounding voices, checked only among voices of the right variety. */
const PREFERRED_NAMES = ['thomas', 'audrey', 'marie', 'aurélie', 'aurelie', 'amélie', 'amelie']

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
}

let currentUtterance: SpeechSynthesisUtterance | null = null

export function cancelSpeech() {
  if (!supportsTTS()) return
  currentUtterance = null
  window.speechSynthesis.cancel()
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
 * A slash separates alternatives ("content / contente"); only the first is
 * spoken, because "content slash contente" teaches nobody anything.
 */
export function speakable(text: string) {
  return (
    text
      .replace(/\*+/g, '')
      .replace(/^[❌✅]\s*/, '')
      // Everything from a derivation arrow on is commentary, not the phrase.
      .split(/[→⟶⇒]/)[0]
      // IPA between brackets, plus the liaison undertie if it escaped them.
      .replace(/\[[^\]]*\]/g, '')
      .replace(/‿/g, ' ')
      .split(' / ')[0]
      .replace(/\s+/g, ' ')
      .trim()
  )
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
  u.onend = () => {
    currentUtterance = null
    opts.onEnd?.()
  }
  u.onerror = () => {
    currentUtterance = null
    opts.onEnd?.()
  }

  currentUtterance = u
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
