/**
 * Getting a transcript out of a YouTube video, and Ukrainian out of it.
 *
 * Three ways in, in the order a learner will meet them:
 *
 * 1. Paste. YouTube shows its own transcript under any captioned video
 *    («Показати текстову версію»), and the whole panel copies as timestamps
 *    and lines. That is parsed here. It needs nothing from us and works for
 *    every video that has captions at all.
 * 2. A link, when a relay is configured. The browser cannot read YouTube's
 *    captions directly — the endpoint answers a plain request with nothing —
 *    so `relay/worker.js` asks on the app's behalf. Optional, free to run.
 * 3. The old hand-written "французька | переклад" lines, still accepted.
 *
 * Then translation. MyMemory's free API answers from the browser (CORS is
 * open), a few thousand characters a day per address and ten times that when
 * an address is given — which the signed-in learner has. It is machine
 * translation: good enough to follow a video, and every word stays tappable
 * for the dictionary's own gloss underneath it.
 */

export type CaptionLine = { t: number; text: string; d?: number }

/** "1:23" or "1:02:03" → seconds. */
function seconds(stamp: string): number {
  const parts = stamp.split(':').map(Number)
  return parts.reduce((acc, n) => acc * 60 + n, 0)
}

const STAMP = /^(?:\d{1,2}:)?\d{1,2}:\d{2}$/

/**
 * YouTube's transcript panel, as it comes off the clipboard.
 *
 * Every browser copies it a little differently: a timestamp on its own line
 * followed by the text, or both on one line, or with the video's chapter
 * titles mixed in. Lines with a pipe are the hand-written format and carry
 * their own translation.
 */
export function parseTranscriptPaste(raw: string): { lines: CaptionLine[]; uk: (string | null)[] } {
  const rows = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  const lines: CaptionLine[] = []
  const uk: (string | null)[] = []
  let pending: number | null = null

  for (const row of rows) {
    if (STAMP.test(row)) {
      pending = seconds(row)
      continue
    }
    const inline = row.match(/^((?:\d{1,2}:)?\d{1,2}:\d{2})\s+(.+)$/)
    let t = pending ?? (lines.length ? lines[lines.length - 1].t + 4 : 0)
    let text = row
    if (inline) {
      t = seconds(inline[1])
      text = inline[2]
    }
    pending = null

    const [fr, translation] = text.split('|').map((s) => s.trim())
    if (!fr) continue
    lines.push({ t, text: fr })
    uk.push(translation || null)
  }
  return { lines, uk }
}

/**
 * Captions come in display-sized pieces, cut wherever the screen ran out of
 * room — mid-clause, mid-word sometimes. A learner reads sentences, and a
 * translator translates them far better whole, so pieces are joined until one
 * ends in a full stop, or the line has grown long enough to be a sentence
 * whatever the punctuation says.
 */
export function toSentences(lines: CaptionLine[], maxChars = 170): CaptionLine[] {
  const out: CaptionLine[] = []
  let buf = ''
  let start = 0

  const emit = (text: string, t: number) => {
    const clean = text.trim()
    if (clean) out.push({ t, text: clean })
  }

  for (const line of lines) {
    const text = line.text.replace(/\s+/g, ' ').trim()
    if (!text) continue
    if (!buf) start = line.t
    buf = buf ? `${buf} ${text}` : text

    // A sentence may end in the middle of a piece: emit up to each ending
    // and keep the tail, which belongs to this piece's timestamp.
    let m: RegExpMatchArray | null
    while ((m = buf.match(/[.!?…]["»]?\s+(?=[A-ZÀ-Ý«"(])/))) {
      const cut = (m.index ?? 0) + m[0].length
      emit(buf.slice(0, cut), start)
      buf = buf.slice(cut)
      start = line.t
    }
    if (buf.length >= maxChars) {
      emit(buf, start)
      buf = ''
    }
  }
  if (buf) emit(buf, start)
  return out
}

/* ------------------------------------------------------------------ *
 * The relay
 * ------------------------------------------------------------------ */

export function relayUrl(): string | null {
  const url = (import.meta.env.VITE_CAPTIONS_RELAY as string | undefined)?.trim()
  return url ? url.replace(/\/+$/, '') : null
}

export type FetchedCaptions = {
  title: string
  lang: string
  kind: 'manual' | 'auto'
  lines: CaptionLine[]
}

export async function fetchCaptions(videoId: string, lang = 'fr'): Promise<FetchedCaptions> {
  const base = relayUrl()
  if (!base) throw new Error('Релей субтитрів не налаштовано')
  const res = await fetch(`${base}/captions?v=${encodeURIComponent(videoId)}&lang=${lang}`)
  const data = (await res.json()) as Partial<FetchedCaptions> & { error?: string }
  if (!res.ok || data.error) throw new Error(data.error ?? `Релей відповів ${res.status}`)
  return {
    title: data.title ?? '',
    lang: data.lang ?? lang,
    kind: data.kind === 'auto' ? 'auto' : 'manual',
    lines: (data.lines ?? []).map((l) => ({ t: Number(l.t) || 0, d: l.d, text: String(l.text) })),
  }
}

/* ------------------------------------------------------------------ *
 * Translation
 * ------------------------------------------------------------------ */

const MYMEMORY = 'https://api.mymemory.translated.net/get'
/** MyMemory takes up to 500 characters a call. */
const MAX_CHARS = 480

/** Split one long line where a sentence or clause ends, under the limit. */
function pieces(text: string): string[] {
  if (text.length <= MAX_CHARS) return [text]
  const out: string[] = []
  let rest = text
  while (rest.length > MAX_CHARS) {
    const window = rest.slice(0, MAX_CHARS)
    const cut = Math.max(
      window.lastIndexOf('. '),
      window.lastIndexOf(', '),
      window.lastIndexOf(' '),
    )
    const at = cut > 40 ? cut + 1 : MAX_CHARS
    out.push(rest.slice(0, at).trim())
    rest = rest.slice(at).trim()
  }
  if (rest) out.push(rest)
  return out
}

export class QuotaError extends Error {}

async function translateOne(text: string, email?: string, signal?: AbortSignal): Promise<string> {
  const parts: string[] = []
  for (const piece of pieces(text)) {
    const params = new URLSearchParams({ q: piece, langpair: 'fr|uk' })
    if (email) params.set('de', email)
    const res = await fetch(`${MYMEMORY}?${params}`, { signal })
    if (res.status === 429) throw new QuotaError('Денний ліміт перекладу вичерпано')
    if (!res.ok) throw new Error(`Перекладач відповів ${res.status}`)
    const data = (await res.json()) as {
      responseStatus?: number | string
      quotaFinished?: boolean
      responseData?: { translatedText?: string }
    }
    if (data.quotaFinished || Number(data.responseStatus) === 429) {
      throw new QuotaError('Денний ліміт перекладу вичерпано')
    }
    const out = data.responseData?.translatedText?.trim()
    if (!out || /^(MYMEMORY WARNING|QUERY LENGTH LIMIT)/i.test(out)) {
      throw new Error('Перекладач не відповів')
    }
    parts.push(out)
  }
  return parts.join(' ')
}

export type TranslateProgress = { done: number; total: number }

/**
 * Translate every line, a few at a time, reporting as each lands.
 *
 * Stops at the day's quota rather than failing the whole job: the lines that
 * made it are kept, the rest stay French, and the caller says how many. A
 * single line that fails for any other reason is skipped, not fatal.
 */
export async function translateLines(
  texts: string[],
  opts: { email?: string; onProgress?: (p: TranslateProgress) => void; signal?: AbortSignal } = {},
): Promise<{ uk: (string | null)[]; quotaHit: boolean }> {
  const uk: (string | null)[] = texts.map(() => null)
  let done = 0
  let quotaHit = false
  let next = 0

  const worker = async () => {
    while (next < texts.length && !quotaHit && !opts.signal?.aborted) {
      const i = next++
      try {
        uk[i] = await translateOne(texts[i], opts.email, opts.signal)
      } catch (e) {
        if (e instanceof QuotaError) quotaHit = true
        else if ((e as Error).name === 'AbortError') return
      }
      done++
      opts.onProgress?.({ done, total: texts.length })
    }
  }
  await Promise.all([worker(), worker(), worker()])
  return { uk, quotaHit }
}

/** Accepts a full URL or a bare id. */
export function parseYouTubeId(input: string): string | null {
  const trimmed = input.trim()
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed
  const m = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  )
  return m ? m[1] : null
}
