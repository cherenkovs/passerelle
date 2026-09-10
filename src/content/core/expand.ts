import type { CEFR, PartOfSpeech, Word } from '../types'

/**
 * Compact row format for the frequency core.
 *
 * Writing ~1000 entries as full objects would be unreadable, so each word is a
 * tuple. Gender is folded into the part-of-speech slot (`nm` / `nf`) because
 * every French noun needs one and a separate column would be mostly empty.
 *
 *   [id, français, українською, IPA, частина мови, (примітка)]
 *
 * The optional last field is reserved for a trap a Ukrainian speaker actually
 * falls into — gender mismatch, false friend, silent letter. Leave it out
 * rather than writing something generic.
 */
export type Pos =
  | 'nm' // іменник чоловічого роду
  | 'nf' // іменник жіночого роду
  | 'nmf' // іменник спільного роду або з обома формами
  | 'n' // іменник, рід якого не показуємо (множинні форми)
  | Exclude<PartOfSpeech, 'n'>

export type Row =
  | [id: string, fr: string, uk: string, ipa: string, pos: Pos]
  | [id: string, fr: string, uk: string, ipa: string, pos: Pos, note: string]

export type Band = {
  level: CEFR
  rows: Row[]
}

/**
 * Ranks are assigned by position across the bands in order, so adding or
 * removing a row never leaves a gap or a duplicate rank to maintain by hand.
 */
export function expand(bands: Band[]): Word[] {
  const out: Word[] = []
  let rank = 0

  for (const band of bands) {
    for (const row of band.rows) {
      const [id, fr, uk, ipa, pos, note] = row
      out.push({
        id,
        fr,
        uk,
        ipa,
        pos: pos === 'nm' || pos === 'nf' || pos === 'nmf' ? 'n' : (pos as PartOfSpeech),
        gender: pos === 'nm' ? 'm' : pos === 'nf' ? 'f' : pos === 'nmf' ? 'mf' : undefined,
        note,
        level: band.level,
        tags: ['core'],
        rank: ++rank,
      })
    }
  }

  return out
}
