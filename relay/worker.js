/**
 * Passerelle captions relay — a Cloudflare Worker, free tier.
 *
 * The browser cannot read YouTube's captions itself: the caption endpoint
 * answers a plain request with an empty body (it wants a proof-of-origin
 * token the player generates), and YouTube's pages are not CORS-readable
 * anyway. A mobile-app client of YouTube's own player API is still answered,
 * so this relay asks as one, fetches the track, and hands the app plain JSON
 * with CORS headers. It stores nothing and takes no credentials.
 *
 * Deploy: see README.md — five minutes, no card required.
 *
 *   GET /captions?v=<videoId>[&lang=fr]
 *   → { videoId, title, lang, kind: "manual" | "auto", lines: [{ t, d, text }] }
 */

const ALLOW = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const ANDROID = {
  context: {
    client: {
      clientName: 'ANDROID',
      clientVersion: '20.10.38',
      androidSdkVersion: 30,
      osName: 'Android',
      osVersion: '11',
      platform: 'MOBILE',
      hl: 'fr',
    },
  },
}
const ANDROID_UA = 'com.google.android.youtube/20.10.38 (Linux; U; Android 11) gzip'

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...ALLOW, ...extra },
  })
}

/** The track to use: the wanted language, human-made over auto-generated. */
export function pickTrack(tracks, lang) {
  const inLang = tracks.filter((t) => (t.languageCode || '').toLowerCase().startsWith(lang))
  const manual = inLang.find((t) => t.kind !== 'asr')
  return manual || inLang[0] || null
}

/** YouTube's timedtext XML (format 3) → lines. */
export function parseTimedText(xml) {
  const lines = []
  const re = /<p t="(\d+)"(?: d="(\d+)")?[^>]*>([\s\S]*?)<\/p>/g
  let m
  while ((m = re.exec(xml))) {
    const text = decode(m[3].replace(/<[^>]+>/g, ''))
      .replace(/\s+/g, ' ')
      .trim()
    if (text) lines.push({ t: Number(m[1]) / 1000, d: Number(m[2] || 0) / 1000, text })
  }
  return lines
}

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
}

export async function captions(videoId, lang = 'fr') {
  const player = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': ANDROID_UA },
    body: JSON.stringify({ ...ANDROID, videoId }),
  })
  if (!player.ok) throw new Error(`YouTube answered ${player.status}`)
  const data = await player.json()
  const status = data.playabilityStatus?.status
  if (status && status !== 'OK') throw new Error(`Відео недоступне: ${status}`)

  const tracks = data.captions?.playerCaptionsTracklistRenderer?.captionTracks || []
  const track = pickTrack(tracks, lang)
  if (!track) {
    const have = tracks.map((t) => t.languageCode).join(', ') || 'жодних'
    throw new Error(`У відео немає субтитрів мовою "${lang}" (є: ${have})`)
  }

  const xml = await (await fetch(track.baseUrl, { headers: { 'User-Agent': ANDROID_UA } })).text()
  const lines = parseTimedText(xml)
  if (!lines.length) throw new Error('Субтитри порожні')

  return {
    videoId,
    title: data.videoDetails?.title || '',
    lang: track.languageCode,
    kind: track.kind === 'asr' ? 'auto' : 'manual',
    lines,
  }
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: ALLOW })
    const url = new URL(request.url)
    if (url.pathname !== '/captions') return json({ error: 'not found' }, 404)

    const v = url.searchParams.get('v') || ''
    const lang = (url.searchParams.get('lang') || 'fr').toLowerCase().slice(0, 5)
    if (!/^[\w-]{11}$/.test(v)) return json({ error: 'bad video id' }, 400)

    try {
      const result = await captions(v, lang)
      return json(result, 200, { 'Cache-Control': 'public, max-age=86400' })
    } catch (e) {
      return json({ error: e instanceof Error ? e.message : String(e) }, 502)
    }
  },
}
