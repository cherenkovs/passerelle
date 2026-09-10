import { BAND_1 } from './band-1'
import { BAND_2 } from './band-2'
import { BAND_3 } from './band-3'
import { BAND_4 } from './band-4'
import { BAND_5 } from './band-5'
import { BAND_6 } from './band-6'
import { expand, type Band } from './expand'

/**
 * The ~1000 most frequent French lemmas, in approximate frequency order.
 *
 * Corpora disagree on exact positions (spoken vs written French rank things
 * very differently), so the value here is coverage, not precision: these words
 * account for roughly 80 % of everyday French. `rank` is a band indicator.
 *
 * CEFR level rises with the bands because the earlier a word is, the earlier a
 * learner meets it — the first bands are A1 material almost by definition.
 */
const BANDS: Band[] = [
  { level: 'A1', rows: BAND_1 },
  { level: 'A1', rows: BAND_2 },
  { level: 'A2', rows: BAND_3 },
  { level: 'A2', rows: BAND_4 },
  { level: 'B1', rows: BAND_5 },
  { level: 'B1', rows: BAND_6 },
]

export const CORE_WORDS = expand(BANDS)
