import { afterEach, describe, expect, it, vi } from 'vitest'
import { parseTranscriptPaste, parseYouTubeId, toSentences, translateLines } from './captions'

describe('reading a pasted YouTube transcript', () => {
  it('takes the timestamp-then-line shape Chrome copies', () => {
    const { lines } = parseTranscriptPaste(`0:00
Nous sommes à Paris au mois de juillet.
0:06
La ville lumière accueille l'exposition.
1:02:03
Fin.`)
    expect(lines).toEqual([
      { t: 0, text: 'Nous sommes à Paris au mois de juillet.' },
      { t: 6, text: "La ville lumière accueille l'exposition." },
      { t: 3723, text: 'Fin.' },
    ])
  })

  it('takes the one-line shape too, and ignores chapter titles', () => {
    const { lines } = parseTranscriptPaste(`Introduction
0:00 Bonjour à tous.
0:04 Aujourd'hui, on parle de Paris.`)
    // A bare title before any timestamp is kept as a line at 0 — the learner
    // can delete it; dropping text silently would be worse.
    expect(lines.map((l) => l.text)).toEqual([
      'Introduction',
      'Bonjour à tous.',
      "Aujourd'hui, on parle de Paris.",
    ])
    expect(lines[1].t).toBe(0)
    expect(lines[2].t).toBe(4)
  })

  it('still accepts the hand-written format with a translation', () => {
    const { lines, uk } = parseTranscriptPaste(`Bonjour. | Добрий день.
Ça va ?`)
    expect(lines.map((l) => l.text)).toEqual(['Bonjour.', 'Ça va ?'])
    expect(uk).toEqual(['Добрий день.', null])
    // No timestamps: spaced out so the player can still seek somewhere.
    expect(lines[1].t).toBeGreaterThan(lines[0].t)
  })
})

describe('joining caption pieces into sentences', () => {
  it('joins until a full stop and keeps the first timestamp', () => {
    const out = toSentences([
      { t: 0.7, d: 5.5, text: 'Nous sommes à Paris au mois de' },
      { t: 6.2, d: 5.8, text: 'juillet 1900. La ville lumière accueille la 5e' },
      { t: 12, d: 6, text: 'exposition universelle.' },
    ])
    expect(out.map((l) => l.text)).toEqual([
      'Nous sommes à Paris au mois de juillet 1900.',
      'La ville lumière accueille la 5e exposition universelle.',
    ])
    expect(out[0].t).toBe(0.7)
    // The second sentence starts inside the second piece.
    expect(out[1].t).toBe(6.2)
  })

  it('cuts a sentence that never ends once it is long enough to be one', () => {
    const long = Array.from({ length: 12 }, (_, i) => ({ t: i, text: 'et puis encore un mot' }))
    const out = toSentences(long, 60)
    expect(out.length).toBeGreaterThan(2)
    expect(out.every((l) => l.text.length < 90)).toBe(true)
  })
})

describe('translating', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('translates every line and reports progress', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        const q = new URL(url).searchParams.get('q')
        return new Response(JSON.stringify({ responseData: { translatedText: `UK(${q})` } }))
      }),
    )
    const seen: number[] = []
    const { uk, quotaHit } = await translateLines(['Bonjour.', 'Ça va ?'], {
      onProgress: (p) => seen.push(p.done),
    })
    expect(uk).toEqual(['UK(Bonjour.)', 'UK(Ça va ?)'])
    expect(quotaHit).toBe(false)
    expect(seen.sort()).toEqual([1, 2])
  })

  it('stops at the quota and keeps what it has', async () => {
    let calls = 0
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        calls++
        if (calls > 1)
          return new Response(JSON.stringify({ quotaFinished: true, responseData: {} }))
        return new Response(JSON.stringify({ responseData: { translatedText: 'Добре.' } }))
      }),
    )
    const { uk, quotaHit } = await translateLines(['a', 'b', 'c', 'd'])
    expect(quotaHit).toBe(true)
    expect(uk.filter(Boolean).length).toBeGreaterThanOrEqual(1)
    expect(uk.filter(Boolean).length).toBeLessThan(4)
  })

  it('passes the learner’s address so the day’s quota is theirs', async () => {
    const fetchMock = vi.fn(
      async (_url: string) =>
        new Response(JSON.stringify({ responseData: { translatedText: 'x' } })),
    )
    vi.stubGlobal('fetch', fetchMock)
    await translateLines(['Bonjour.'], { email: 'a@b.c' })
    expect(String(fetchMock.mock.calls[0][0])).toContain('de=a%40b.c')
  })
})

describe('reading a link', () => {
  it('finds the id in every shape of YouTube link', () => {
    for (const u of [
      'https://www.youtube.com/watch?v=QsXCFzPTc78',
      'https://youtu.be/QsXCFzPTc78?t=12',
      'https://www.youtube.com/shorts/QsXCFzPTc78',
      'QsXCFzPTc78',
    ]) {
      expect(parseYouTubeId(u), u).toBe('QsXCFzPTc78')
    }
    expect(parseYouTubeId('https://vimeo.com/1234')).toBeNull()
  })
})
