import * as Accordion from '@radix-ui/react-accordion'
import { BookMarked, ChevronDown, Rows3, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, LevelChip, PageHeader } from '@/components/common/misc'
import { RichText } from '@/components/common/rich-text'
import { SpokenLine } from '@/components/common/speak'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  GRAMMAR,
  groupByModule,
  searchGrammar,
  withTables,
  type GrammarEntry,
} from '@/content/reference'
import { cn, pluralUk } from '@/lib/utils'
import { Table, Warning } from './Lesson'

const LEVELS = ['A1', 'A2', 'B1', 'B2'] as const

/**
 * Grammar reference.
 *
 * Two modes, because browsing and looking something up want opposite things.
 * With no query the rules stay grouped by module and collapsed, which is a map
 * of the course. The moment you type, grouping is dropped for ranking: when
 * you are hunting for how subjonctif is formed, the best match belongs at the
 * top of the page, not wherever module 17 happens to fall.
 */
export function ReferencePage() {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<string | null>(null)
  const [tablesOnly, setTablesOnly] = useState(false)

  const pool = useMemo(() => {
    let list: GrammarEntry[] = GRAMMAR
    if (level) list = list.filter((e) => e.level === level)
    if (tablesOnly) list = withTables(list)
    return list
  }, [level, tablesOnly])

  const results = useMemo(() => searchGrammar(query, pool), [query, pool])
  const searching = query.trim().length > 0

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Довідник"
        title="Граматика під рукою"
        description="Кожне правило курсу в одному місці — з таблицею, прикладами й пасткою для українця. Шукай українською або французькою; діакритику писати не обов'язково."
      />

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="text-fg-subtle pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="subjonctif, артикль, passé composé, рід…"
            aria-label="Пошук по граматиці"
            className="h-12 pl-11 text-[15px]"
          />
          {searching && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Очистити"
              className="text-fg-subtle hover:text-fg absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Chip active={!level} onClick={() => setLevel(null)}>
            Усі рівні
          </Chip>
          {LEVELS.map((l) => (
            <Chip key={l} active={level === l} onClick={() => setLevel(level === l ? null : l)}>
              {l}
            </Chip>
          ))}
          <Chip active={tablesOnly} onClick={() => setTablesOnly((v) => !v)}>
            <Rows3 className="size-3.5" /> Тільки з таблицями
          </Chip>
          <span className="text-fg-subtle ml-auto text-[12.5px] tabular-nums">
            {results.length} {pluralUk(results.length, ['правило', 'правила', 'правил'])}
          </span>
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={BookMarked}
          title="Нічого не знайшлося"
          description="Спробуй інше слово — або французький термін замість українського. Пошук дивиться і в таблиці, і в приклади."
        />
      ) : searching ? (
        <div className="space-y-4">
          {results.map((entry) => (
            <article
              key={entry.id}
              className="border-line bg-surface rounded-2xl border p-5 sm:p-6"
            >
              <EntryHeader entry={entry} />
              <EntryBody entry={entry} />
            </article>
          ))}
        </div>
      ) : (
        <Accordion.Root type="multiple" className="space-y-3">
          {groupByModule(results).map((group) => (
            <Accordion.Item
              key={group.moduleId}
              value={group.moduleId}
              className="border-line bg-surface overflow-hidden rounded-2xl border"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center gap-4 p-5 text-left">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <LevelChip level={group.level} />
                      <span className="text-fg-subtle text-[12px]">
                        {group.entries.length}{' '}
                        {pluralUk(group.entries.length, ['правило', 'правила', 'правил'])}
                      </span>
                    </div>
                    <h3 className="font-display mt-1 text-lg font-semibold tracking-tight">
                      {group.title}
                    </h3>
                    <p className="text-fg-muted mt-0.5 text-[13px] text-pretty">{group.focus}</p>
                  </div>
                  <ChevronDown className="text-fg-subtle size-5 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden">
                <div className="border-line space-y-6 border-t px-5 py-5">
                  {group.entries.map((entry) => (
                    <div key={entry.id}>
                      <EntryHeader entry={entry} compact />
                      <EntryBody entry={entry} />
                    </div>
                  ))}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      )}
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors',
        active
          ? 'border-primary bg-primary-soft text-primary-soft-fg'
          : 'border-line bg-surface text-fg-muted hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}

function EntryHeader({ entry, compact }: { entry: GrammarEntry; compact?: boolean }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-4">
      <div className="min-w-0">
        {!compact && (
          <div className="text-fg-subtle mb-1.5 flex flex-wrap items-center gap-2 text-[12px]">
            <LevelChip level={entry.level} />
            <span>
              Модуль {entry.moduleIndex + 1} · {entry.moduleTitle}
            </span>
          </div>
        )}
        <h3 className="font-display text-xl font-semibold tracking-tight text-balance">
          {entry.title}
        </h3>
      </div>
      <Button asChild variant="ghost" size="sm" className="shrink-0">
        <Link to={`/lesson/${entry.lessonId}`}>Урок</Link>
      </Button>
    </div>
  )
}

function EntryBody({ entry }: { entry: GrammarEntry }) {
  return (
    <>
      <RichText>{entry.body}</RichText>
      {entry.table && <Table table={entry.table} className="mt-5" />}
      {entry.examples && (
        <div className="mt-5 space-y-2.5">
          {entry.examples.map((ex, i) => (
            <SpokenLine
              key={i}
              fr={ex.fr}
              uk={ex.uk}
              className="border-line bg-surface-2 rounded-xl border p-3.5"
            />
          ))}
        </div>
      )}
      {entry.warning && <Warning>{entry.warning}</Warning>}
    </>
  )
}
