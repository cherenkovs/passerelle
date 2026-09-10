import { BookMarked, Filter, Search, Sparkles, TrendingUp, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState, PageHeader } from '@/components/common/misc'
import { WordCard } from '@/components/common/word-card'
import { ExerciseRunner } from '@/components/exercises/runner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FREQUENCY_BANDS, WORDS, generateVocabExercises } from '@/content'
import { CORE_WORDS } from '@/content/core'
import { stripDiacritics } from '@/lib/grade'
import { cn, pluralUk, todayKey } from '@/lib/utils'
import { useActiveProfile } from '@/store/learner'

const TAGS: { id: string; label: string }[] = [
  { id: 'all', label: 'Усі' },
  { id: 'greetings', label: 'Привітання' },
  { id: 'identity', label: 'Про себе' },
  { id: 'numbers', label: 'Числа й час' },
  { id: 'gender', label: 'Рід і артиклі' },
  { id: 'family', label: 'Родина й дім' },
  { id: 'daily', label: 'Щодення' },
  { id: 'food', label: 'Їжа' },
  { id: 'city', label: 'Місто' },
]

type Status = 'all' | 'saved' | 'learning' | 'known' | 'new'

const STATUSES: { id: Status; label: string }[] = [
  { id: 'all', label: 'Усі' },
  { id: 'saved', label: 'У зошиті' },
  { id: 'learning', label: 'Вивчаю' },
  { id: 'known', label: 'Знаю' },
  { id: 'new', label: 'Ще не бачив' },
]

/**
 * Frequency is the single most useful way to order a dictionary: the first
 * hundred words carry about half of everything you will ever read.
 */
const BANDS = [
  { id: 'all', label: 'Уся база', from: 0, to: Infinity },
  ...FREQUENCY_BANDS.map((b) => ({ id: b.id, label: b.label, from: b.from, to: b.to })),
]

export function VocabularyPage() {
  const profile = useActiveProfile()
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('all')
  const [status, setStatus] = useState<Status>('all')
  const [band, setBand] = useState('all')
  const [practising, setPractising] = useState<string[] | null>(null)

  const filtered = useMemo(() => {
    const q = stripDiacritics(query.trim().toLowerCase())
    const range = BANDS.find((b) => b.id === band) ?? BANDS[0]

    const rows = WORDS.filter((w) => {
      if (tag !== 'all' && !w.tags?.includes(tag)) return false

      if (band !== 'all') {
        if (typeof w.rank !== 'number') return false
        if (w.rank < range.from || w.rank > range.to) return false
      }

      if (status !== 'all' && profile) {
        const card = profile.srs[w.id]
        const saved = profile.savedWords.includes(w.id)
        if (status === 'saved' && !saved) return false
        if (status === 'new' && card) return false
        if (status === 'learning' && (!card || card.interval >= 7)) return false
        if (status === 'known' && (!card || card.interval < 7)) return false
      }

      if (!q) return true
      return (
        stripDiacritics(w.fr.toLowerCase()).includes(q) ||
        w.uk.toLowerCase().includes(q) ||
        (w.ipa ?? '').includes(q)
      )
    })

    // Inside a frequency band, the most frequent word should come first.
    if (band !== 'all') rows.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    return rows
  }, [band, profile, query, status, tag])

  if (practising) {
    return (
      <ExerciseRunner
        exercises={generateVocabExercises(practising.slice(0, 20), WORDS)}
        title="Тренування словника"
        onExit={() => setPractising(null)}
        finishLabel="Готово"
      />
    )
  }

  const savedCount = profile?.savedWords.length ?? 0
  const dueToday = profile
    ? Object.values(profile.srs).filter((c) => c.due <= todayKey()).length
    : 0

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${WORDS.length} слів · ${CORE_WORDS.length} за частотністю`}
        title="Словник"
        description="Кожне слово вчиться разом з артиклем і родом — саме там, де українці помиляються найчастіше. Позначки ⚠️ показують розбіжність із українським родом, а фільтр за частотністю дає найкоротший шлях: перша сотня слів покриває близько половини будь-якого тексту."
        action={
          filtered.length > 0 && (
            <Button onClick={() => setPractising(filtered.map((w) => w.id))}>
              <Sparkles /> Тренувати ({Math.min(filtered.length, 20)})
            </Button>
          )
        }
      />

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="text-fg-subtle pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Шукати французькою, українською або за транскрипцією…"
            className="pr-10 pl-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-fg-subtle hover:text-fg absolute top-1/2 right-3 -translate-y-1/2"
              aria-label="Очистити"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {BANDS.map((b) => (
            <Chip key={b.id} active={band === b.id} onClick={() => setBand(b.id)}>
              {b.id !== 'all' && <TrendingUp className="mr-1 inline size-3" />}
              {b.label}
            </Chip>
          ))}
        </div>

        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {TAGS.map((t) => (
            <Chip key={t.id} active={tag === t.id} onClick={() => setTag(t.id)}>
              {t.label}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="text-fg-subtle mr-1 size-3.5" />
          {STATUSES.map((s) => (
            <Chip key={s.id} active={status === s.id} onClick={() => setStatus(s.id)} small>
              {s.label}
              {s.id === 'saved' && savedCount > 0 && ` · ${savedCount}`}
            </Chip>
          ))}
        </div>
      </div>

      {dueToday > 0 && (
        <div className="border-primary/25 bg-primary-soft text-primary-soft-fg rounded-xl border px-4 py-3 text-sm">
          {dueToday} {pluralUk(dueToday, ['картка', 'картки', 'карток'])} чекає на повторення
          сьогодні.
        </div>
      )}

      <div className="text-fg-subtle text-[13px]">
        Знайдено {filtered.length} {pluralUk(filtered.length, ['слово', 'слова', 'слів'])}
      </div>

      {filtered.length ? (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {filtered.map((w) => (
            <WordCard key={w.id} word={w} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookMarked}
          title="Нічого не знайдено"
          description="Спробуй інший запит або зніми фільтри."
          action={
            <Button
              variant="surface"
              onClick={() => {
                setQuery('')
                setTag('all')
                setStatus('all')
                setBand('all')
              }}
            >
              Скинути фільтри
            </Button>
          }
        />
      )}
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  small?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full border font-medium whitespace-nowrap transition-colors',
        small ? 'px-3 py-1 text-[12px]' : 'px-3.5 py-1.5 text-[13px]',
        active
          ? 'border-primary bg-primary-soft text-primary-soft-fg'
          : 'border-line bg-surface text-fg-muted hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}
