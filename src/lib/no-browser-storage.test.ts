import { describe, expect, it } from 'vitest'

/**
 * The learner's data lives in their account and nowhere else.
 *
 * This is a rule about the whole source tree rather than about one function,
 * so it is checked as one. Browser storage has come back twice by accident —
 * once as a persisted store, once as a migration that read the old key — and
 * each time it reintroduced a second copy of the truth, able to disagree with
 * the account and to outlive the session. A grep is a blunt test and exactly
 * the right shape here: the rule is "this API is not used", and that is what
 * it checks.
 *
 * Firebase Auth's own session token is not covered by this and is not meant to
 * be: it is the SDK's storage, holding a sign-in rather than any progress, and
 * without it every reload would be a fresh login.
 */

const SOURCES = import.meta.glob('../**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** A use, not a mention: the word followed by a property access or an index. */
const USE = /\b(localStorage|sessionStorage|indexedDB)\s*[.[]/

describe('nothing is kept in the browser', () => {
  it('never touches localStorage, sessionStorage or IndexedDB', () => {
    const offenders = Object.entries(SOURCES)
      .filter(([path]) => !path.endsWith('no-browser-storage.test.ts'))
      .flatMap(([path, source]) =>
        source
          .split('\n')
          .map((text, i) => ({ path, line: i + 1, text: text.trim() }))
          // Comments talk about these APIs to explain why they are absent.
          .filter(({ text }) => USE.test(text) && !text.startsWith('*') && !text.startsWith('//')),
      )
      .map(({ path, line, text }) => `${path}:${line}  ${text}`)

    expect(offenders).toEqual([])
  })

  it('is looking at the real source tree', () => {
    // A glob that matched nothing would pass the check above silently.
    expect(Object.keys(SOURCES).length).toBeGreaterThan(50)
    expect(Object.keys(SOURCES).some((p) => p.endsWith('/sync.ts'))).toBe(true)
  })
})
