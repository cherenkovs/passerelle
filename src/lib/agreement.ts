/**
 * Grammatical agreement with the learner.
 *
 * French makes you choose. "Je suis allé au musée" and "Je suis allée au musée"
 * are the same sentence about two different people, and an app that never asks
 * which one you are has to pick — which is how Serhii ends up being told he is
 * *ukrainienne*.
 *
 * Content marks the choice inline:
 *
 *   `Je suis ukrainien{ne}.`        → ukrainien   / ukrainienne
 *   `Je suis {ingénieur|ingénieure} .` → explicit pair for irregular forms
 *
 * The short form appends to the masculine, which covers the regular -e / -ne /
 * -se endings; the long form spells both out when the stem changes.
 *
 * Markers are resolved centrally — in `TapText` and in the speech layer — so
 * any French string in the app can carry one without its renderer knowing.
 */

export type Gender = 'm' | 'f'

const MARKER = /\{([^{}|]*)(?:\|([^{}]*))?\}/g

/** Render `text` for one gender, stripping the markers. */
export function agree(text: string, gender: Gender): string {
  return text.replace(MARKER, (_, a: string, b: string | undefined) =>
    b === undefined ? (gender === 'f' ? a : '') : gender === 'f' ? b : a,
  )
}

/** Both readings of a marked string — for accept lists, which take either. */
export function bothForms(text: string): string[] {
  const m = agree(text, 'm')
  const f = agree(text, 'f')
  return m === f ? [m] : [m, f]
}

export function hasMarker(text: string): boolean {
  MARKER.lastIndex = 0
  return MARKER.test(text)
}

/** The Ukrainian label for a gender, for settings and onboarding copy. */
export const GENDER_LABEL: Record<Gender, string> = {
  m: 'чоловічий',
  f: 'жіночий',
}
