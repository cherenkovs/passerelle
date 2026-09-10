import { normalize, stripDiacritics } from '@/lib/grade'
import { COURSES } from './index'
import type { CEFR, GrammarTable } from './types'

/**
 * The grammar reference.
 *
 * Derived from the lessons rather than written again. Every rule in this app
 * already exists as a `grammar` step — prose, a table, and the trap it sets for
 * a Ukrainian — and duplicating that into a separate reference would guarantee
 * the two drift apart. So there is exactly one copy of every rule, and this is
 * a second way in.
 *
 * The problem it solves is ordinary and constant: halfway through module 20 you
 * cannot remember how subjonctif is formed, and the only way to check was to
 * guess which of sixty-eight lessons taught it.
 *
 * Searching is over everything at once — the rule's title, its prose, its
 * table, its warning, its examples, and the titles of the lesson and module it
 * came from. That last part matters more than it sounds: lesson titles are
 * written to be inviting ("Найкраща новина курсу"), so the actual grammatical
 * term often lives only in the module's `grammarFocus`.
 */

export type GrammarEntry = {
  id: string
  title: string
  body: string
  table?: GrammarTable
  warning?: string
  examples?: { fr: string; uk: string }[]

  lessonId: string
  lessonTitle: string
  moduleId: string
  moduleTitle: string
  moduleIndex: number
  grammarFocus: string
  courseId: string
  courseTitle: string
  level: CEFR
}

/**
 * Three accent-free haystacks per entry, because they are not equally telling.
 *
 * A rule's own title and body are what the search is really for. The module it
 * sits in matches every one of its siblings equally, so "займенник" would
 * otherwise return the whole pronouns module — liaison rules included — in
 * whatever order they happened to be authored. Keeping the levels apart lets
 * the ranking put the actual rule first and its neighbours after.
 */
type Hay = { title: string; own: string; context: string }

const haystack = new Map<string, Hay>()
const flat = (parts: (string | undefined)[]) =>
  stripDiacritics(normalize(parts.filter(Boolean).join(' ')))

function buildHaystack(e: GrammarEntry): Hay {
  return {
    title: flat([e.title]),
    own: flat([
      e.title,
      e.body,
      e.warning,
      e.table?.caption,
      ...(e.table?.head ?? []),
      ...(e.table?.rows.flat() ?? []),
      ...(e.examples?.flatMap((x) => [x.fr, x.uk]) ?? []),
    ]),
    context: flat([e.lessonTitle, e.moduleTitle, e.grammarFocus]),
  }
}

export const GRAMMAR: GrammarEntry[] = (() => {
  const out: GrammarEntry[] = []

  for (const course of COURSES) {
    course.modules.forEach((module, moduleIndex) => {
      for (const lesson of module.lessons) {
        lesson.steps.forEach((step, i) => {
          if (step.kind !== 'grammar') return
          const entry: GrammarEntry = {
            id: `${lesson.id}s${i}`,
            title: step.title,
            body: step.body,
            table: step.table,
            warning: step.warning,
            examples: step.examples,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            moduleId: module.id,
            moduleTitle: module.title,
            moduleIndex,
            grammarFocus: module.grammarFocus,
            courseId: course.id,
            courseTitle: course.title,
            level: course.to,
          }
          haystack.set(entry.id, buildHaystack(entry))
          out.push(entry)
        })
      }
    })
  }

  return out
})()

/**
 * Every word of the query must appear somewhere in the entry.
 *
 * Accent-blind on purpose: someone hunting for "imparfait" should not have to
 * produce "é", and a Ukrainian keyboard makes French diacritics awkward enough
 * that requiring them would make the search useless exactly when it is needed.
 */
export function searchGrammar(query: string, entries: GrammarEntry[] = GRAMMAR): GrammarEntry[] {
  const terms = stripDiacritics(normalize(query)).split(' ').filter(Boolean)
  if (!terms.length) return entries

  const scored: { entry: GrammarEntry; score: number }[] = []
  for (const entry of entries) {
    const hay = haystack.get(entry.id)
    if (!hay) continue

    let score = 0
    let matchedAll = true
    for (const t of terms) {
      if (hay.own.includes(t)) score += 4
      else if (hay.context.includes(t)) score += 1
      else {
        matchedAll = false
        break
      }
    }
    if (!matchedAll) continue
    // A rule whose own heading says it is almost always the one wanted.
    if (terms.every((t) => hay.title.includes(t))) score += 6
    scored.push({ entry, score })
  }

  // Stable within a score, so ties stay in course order — easiest first.
  return scored
    .map((s, i) => ({ ...s, i }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((s) => s.entry)
}

/** Entries grouped by their module, in course order, skipping empty modules. */
export function groupByModule(entries: GrammarEntry[]) {
  const groups: {
    moduleId: string
    title: string
    focus: string
    level: CEFR
    entries: GrammarEntry[]
  }[] = []
  for (const e of entries) {
    const last = groups[groups.length - 1]
    if (last && last.moduleId === e.moduleId) last.entries.push(e)
    else
      groups.push({
        moduleId: e.moduleId,
        title: e.moduleTitle,
        focus: e.grammarFocus,
        level: e.level,
        entries: [e],
      })
  }
  return groups
}

/** Just the rules that come with a table — the conjugation-lookup case. */
export function withTables(entries: GrammarEntry[] = GRAMMAR) {
  return entries.filter((e) => e.table)
}
