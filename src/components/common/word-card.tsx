import { Bookmark, BookmarkCheck, Info } from 'lucide-react'
import type { Word } from '@/content'
import { cn } from '@/lib/utils'
import { useLearner } from '@/store/learner'
import { useSettings } from '@/store/settings'
import { SpeakButton } from './speak'
import { Tooltip } from '@/components/ui/tooltip'

const POS_LABEL: Record<string, string> = {
  n: 'іменник',
  v: 'дієслово',
  adj: 'прикметник',
  adv: 'прислівник',
  prep: 'прийменник',
  pron: 'займенник',
  conj: 'сполучник',
  num: 'числівник',
  phrase: 'фраза',
  interj: 'вигук',
}

const GENDER_LABEL = {
  m: { text: 'm', title: 'чоловічий рід', className: 'bg-primary-soft text-primary-soft-fg' },
  f: { text: 'f', title: 'жіночий рід', className: 'bg-accent-soft text-accent-soft-fg' },
  mf: {
    text: 'm/f',
    title: 'спільного роду — має обидві форми',
    className: 'bg-surface-3 text-fg-muted px-1',
  },
} as const

export function GenderDot({ gender }: { gender?: 'm' | 'f' | 'mf' }) {
  if (!gender) return null
  const g = GENDER_LABEL[gender]
  return (
    <span
      className={cn(
        'inline-grid h-[18px] min-w-[18px] place-items-center rounded-full font-mono text-[10px] font-bold',
        g.className,
      )}
      title={g.title}
    >
      {g.text}
    </span>
  )
}

export function WordCard({
  word,
  className,
  compact,
}: {
  word: Word
  className?: string
  compact?: boolean
}) {
  const showIpa = useSettings((s) => s.showIpa)
  const saved = useLearner((s) => {
    const p = s.profiles.find((x) => x.id === s.activeId)
    return Boolean(p?.savedWords.includes(word.id))
  })
  const toggle = useLearner((s) => s.toggleSavedWord)

  return (
    <div
      className={cn(
        'group border-line bg-surface relative rounded-2xl border p-4 transition-all',
        'hover:border-line-strong hover:shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <SpeakButton text={word.fr} size="sm" className="mt-0.5" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="fr font-display text-fg text-[17px] leading-tight font-semibold">
              {word.fr}
            </span>
            <GenderDot gender={word.gender} />
            {typeof word.rank === 'number' && (
              <Tooltip
                content={`№${word.rank} за частотністю — приблизна позиція серед 1000 найуживаніших слів`}
              >
                <span className="text-fg-subtle cursor-help font-mono text-[10px] tabular-nums">
                  №{word.rank}
                </span>
              </Tooltip>
            )}
            {word.note && (
              <Tooltip content={word.note}>
                <span className="text-warning grid size-4 cursor-help place-items-center">
                  <Info className="size-3.5" />
                </span>
              </Tooltip>
            )}
          </div>

          {showIpa && word.ipa && (
            <div className="text-fg-subtle mt-0.5 font-mono text-[11px]">[{word.ipa}]</div>
          )}

          <div className="text-fg-muted mt-1 text-sm leading-snug">{word.uk}</div>

          {!compact && word.example && (
            <div className="border-line mt-2.5 border-t pt-2.5 text-[12.5px] leading-snug">
              <div className="flex items-start gap-1.5">
                <div className="fr text-fg flex-1">{word.example.fr}</div>
                <SpeakButton text={word.example.fr} size="sm" className="-mt-0.5 shrink-0" />
              </div>
              <div className="text-fg-subtle">{word.example.uk}</div>
            </div>
          )}

          {!compact && word.pos && (
            <div className="text-fg-subtle mt-2 text-[11px]">{POS_LABEL[word.pos]}</div>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggle(word.id)}
          aria-label={saved ? 'Прибрати із зошита' : 'Зберегти в зошит'}
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-lg transition-colors',
            saved
              ? 'text-accent'
              : 'text-fg-subtle hover:text-fg opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
          )}
        >
          {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
        </button>
      </div>
    </div>
  )
}
