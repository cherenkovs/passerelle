import { ArrowUpRight, GraduationCap, SendHorizontal, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { RichText } from '@/components/common/rich-text'
import { SpeakButton, Spoken, SpokenLine, useSpeak } from '@/components/common/speak'
import { WordCard } from '@/components/common/word-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Exercise } from '@/content'
import { PERSON_LABELS, TENSES, type Conjugation, type Tense } from '@/lib/conjugate'
import {
  PROFESSOR_SOURCES,
  SUGGESTIONS,
  ask,
  askAboutExercise,
  type Answer,
  type Block,
  type Example,
} from '@/lib/professor'
import { cn, uid } from '@/lib/utils'
import { EntryBody, EntryHeader } from '@/pages/Reference'

/**
 * The professor, as a conversation.
 *
 * Everything on screen is retrieved from the course, so the layout leans on
 * the components the course already has — a word is a WordCard, a rule is the
 * reference's own entry — rather than reformatting them as chat text. What the
 * chat adds is the question, the order, and the follow-ups.
 */

type Turn = { id: string; question?: string; answer: Answer }

export function ProfessorPanel({
  exercise,
  question,
  compact,
  className,
}: {
  /** Open on an exercise: the professor speaks first, about it. */
  exercise?: Exercise
  /** Open with a question already asked. */
  question?: string
  /** Inside a dialog: tighter spacing, no page-level intro. */
  compact?: boolean
  className?: string
}) {
  const [turns, setTurns] = useState<Turn[]>(() => {
    if (exercise) return [{ id: uid('t'), answer: askAboutExercise(exercise) }]
    if (question) return [{ id: uid('t'), question, answer: ask(question) }]
    return []
  })
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = (q: string) => {
    const text = q.trim()
    if (!text) return
    setTurns((t) => [...t, { id: uid('t'), question: text, answer: ask(text) }])
    setDraft('')
  }

  useEffect(() => {
    if (turns.length) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [turns])

  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      <div className={cn('flex-1 space-y-6', compact ? 'pb-4' : 'pb-6')}>
        {!turns.length && <Intro onAsk={submit} compact={compact} />}

        {turns.map((turn) => (
          <div key={turn.id} className="space-y-3">
            {turn.question && (
              <div className="flex justify-end">
                <div className="bg-primary text-primary-fg max-w-[85%] rounded-2xl rounded-tr-md px-4 py-2.5 text-[14.5px] leading-snug">
                  {turn.question}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <span className="bg-accent-soft text-accent-soft-fg mt-0.5 grid size-8 shrink-0 place-items-center rounded-full">
                <GraduationCap className="size-4" />
              </span>
              <div className="min-w-0 flex-1 space-y-3">
                {turn.answer.blocks.map((block, i) => (
                  <BlockView key={i} block={block} onAsk={submit} />
                ))}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(draft)
        }}
        className={cn(
          'bg-bg/95 sticky bottom-0 flex items-center gap-2 border-t pt-3 backdrop-blur-md',
          'border-line',
          compact ? 'pb-1' : 'pb-[max(0.5rem,env(safe-area-inset-bottom))]',
        )}
      >
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Запитай українською або французькою…"
          aria-label="Питання професору"
          autoComplete="off"
          spellCheck={false}
          className="h-12 flex-1 text-[15px]"
        />
        <Button type="submit" size="icon" disabled={!draft.trim()} aria-label="Запитати">
          <SendHorizontal />
        </Button>
      </form>
    </div>
  )
}

function Intro({ onAsk, compact }: { onAsk: (q: string) => void; compact?: boolean }) {
  return (
    <div className="space-y-5">
      {!compact && (
        <p className="text-fg-muted max-w-xl text-[14.5px] leading-relaxed text-pretty">
          Відповідаю з матеріалів курсу — {PROFESSOR_SOURCES.words} слів словника,{' '}
          {PROFESSOR_SOURCES.rules} правил, відмінювання і {PROFESSOR_SOURCES.faq} найчастіших
          запитань — і нічого не вигадую. Якщо чогось не знаю, так і скажу.
        </p>
      )}
      <div>
        <div className="text-fg-subtle mb-2 text-[12.5px] font-medium">Наприклад</div>
        <Chips questions={SUGGESTIONS} onAsk={onAsk} />
      </div>
    </div>
  )
}

function Chips({ questions, onAsk }: { questions: string[]; onAsk: (q: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onAsk(q)}
          className="border-line bg-surface text-fg hover:border-line-strong hover:bg-surface-2 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors"
        >
          {q}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Blocks
 * ------------------------------------------------------------------ */

function BlockView({ block, onAsk }: { block: Block; onAsk: (q: string) => void }) {
  switch (block.kind) {
    case 'text':
      return (
        <Bubble>
          <RichText className="text-fg text-[14.5px]">{block.text}</RichText>
        </Bubble>
      )
    case 'word':
      return <WordCard word={block.word} />
    case 'words':
      return (
        <Bubble>
          <div className="text-fg-muted mb-2.5 text-[12.5px] font-medium">{block.title}</div>
          <div className="space-y-2">
            {block.words.map((w) => (
              <WordCard key={w.id} word={w} compact />
            ))}
          </div>
        </Bubble>
      )
    case 'phrase':
      return <PhraseView glosses={block.glosses} />
    case 'conjugation':
      return <ConjugationView conjugation={block.conjugation} tense={block.tense} />
    case 'grammar':
      return (
        <article className="border-line bg-surface rounded-2xl border p-5">
          <EntryHeader entry={block.entry} compact />
          <EntryBody entry={block.entry} />
        </article>
      )
    case 'faq':
      return (
        <Bubble>
          <h3 className="font-display text-lg leading-tight font-semibold tracking-tight">
            {block.faq.q}
          </h3>
          <RichText className="mt-3 text-[14.5px]">{block.faq.a}</RichText>
          {block.faq.examples && (
            <div className="mt-4 space-y-2">
              {block.faq.examples.map((ex, i) => (
                <SpokenLine
                  key={i}
                  fr={ex.fr}
                  uk={ex.uk}
                  className="bg-surface-2 rounded-xl px-3.5 py-3"
                />
              ))}
            </div>
          )}
          {(block.faq.grammar || block.faq.lesson) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {block.faq.grammar && (
                <Button asChild variant="surface" size="sm">
                  <Link to={`/reference?q=${encodeURIComponent(block.faq.grammar)}`}>
                    Правило в довіднику <ArrowUpRight />
                  </Link>
                </Button>
              )}
              {block.faq.lesson && (
                <Button asChild variant="surface" size="sm">
                  <Link to={`/lesson/${block.faq.lesson}`}>
                    Урок про це <ArrowUpRight />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </Bubble>
      )
    case 'examples':
      return <ExamplesView items={block.items} />
    case 'pronounce':
      return (
        <Spoken text={block.text} size="lg" words>
          {({ controls, text }) => (
            <Bubble className="text-center">
              <div className="fr font-display text-2xl font-semibold text-balance">{text}</div>
              {block.ipa && (
                <div className="text-fg-subtle mt-1 font-mono text-[13px]">[{block.ipa}]</div>
              )}
              <div className="mt-4 flex justify-center">{controls}</div>
            </Bubble>
          )}
        </Spoken>
      )
    case 'suggest':
      return (
        <div>
          <div className="text-fg-subtle mb-2 flex items-center gap-1.5 text-[12.5px] font-medium">
            <Sparkles className="size-3.5" /> Можна запитати
          </div>
          <Chips questions={block.questions} onAsk={onAsk} />
        </div>
      )
  }
}

function Bubble({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'border-line bg-surface rounded-2xl rounded-tl-md border px-4 py-3.5 shadow-[var(--shadow-card)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

function PhraseView({ glosses }: { glosses: Extract<Block, { kind: 'phrase' }>['glosses'] }) {
  const phrase = glosses.map((g) => g.token).join(' ')
  return (
    <Bubble>
      <div className="mb-3 flex items-center gap-2.5">
        <SpeakButton text={phrase} size="sm" />
        <span className="fr text-[16px] font-medium">{phrase}</span>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[14px]">
        {glosses.map((g, i) => (
          <div key={i} className="contents">
            <dt className="fr text-fg font-medium">{g.token}</dt>
            <dd className="text-fg-muted">{g.gloss?.uk ?? '—'}</dd>
          </div>
        ))}
      </dl>
    </Bubble>
  )
}

function ExamplesView({ items }: { items: Example[] }) {
  const href = (e: Example) =>
    e.source.kind === 'lesson'
      ? `/lesson/${e.source.id}`
      : e.source.kind === 'story'
        ? `/story/${e.source.id}`
        : e.source.kind === 'scenario'
          ? `/tutor/${e.source.id}`
          : `/vocabulary`
  return (
    <Bubble>
      <div className="text-fg-muted mb-2.5 text-[12.5px] font-medium">У курсі це звучить так</div>
      <div className="space-y-2">
        {items.map((e, i) => (
          <SpokenLine
            key={i}
            fr={e.fr}
            uk={e.uk}
            className="bg-surface-2 rounded-xl px-3.5 py-3"
            above={
              <Link
                to={href(e)}
                className="text-fg-subtle hover:text-primary mb-1 inline-block text-[11.5px] underline-offset-4 hover:underline"
              >
                {e.source.title}
              </Link>
            }
          />
        ))}
      </div>
    </Bubble>
  )
}

/* ------------------------------------------------------------------ *
 * Conjugation table
 * ------------------------------------------------------------------ */

function ConjugationView({ conjugation, tense }: { conjugation: Conjugation; tense?: Tense }) {
  const [current, setCurrent] = useState<Tense>(tense ?? 'present')
  const { speak } = useSpeak()
  const forms = conjugation.tenses[current]
  const meta = TENSES.find((t) => t.id === current)!
  const isImperative = current === 'imperatif'
  const labels = isImperative ? ['tu', 'nous', 'vous'] : PERSON_LABELS

  return (
    <div className="border-line bg-surface overflow-hidden rounded-2xl border">
      <div className="border-line flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-4 py-3">
        <div>
          <span className="fr font-display text-xl font-semibold">{conjugation.infinitive}</span>
          <span className="text-fg-subtle ml-2 text-[12.5px]">
            {conjugation.group === '1'
              ? 'I група, -er'
              : conjugation.group === '2'
                ? 'II група, -ir'
                : 'III група'}
            {' · '}
            {conjugation.auxiliary} + <span className="fr">{conjugation.participle}</span>
          </span>
        </div>
        <SpeakButton text={conjugation.infinitive} size="sm" slow={false} />
      </div>

      <div className="flex [scrollbar-width:none] gap-1 overflow-x-auto px-3 pt-3 [&::-webkit-scrollbar]:hidden">
        {TENSES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setCurrent(t.id)}
            aria-pressed={current === t.id}
            className={cn(
              'shrink-0 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium whitespace-nowrap transition-colors',
              current === t.id ? 'bg-primary text-primary-fg' : 'text-fg-muted hover:bg-surface-2',
            )}
          >
            {t.fr}
          </button>
        ))}
      </div>
      <p className="text-fg-subtle px-4 pt-2 text-[12px]">
        {meta.uk} — {meta.hint}
      </p>

      {forms.every((f) => !f) ? (
        <p className="text-fg-muted px-4 py-4 text-[13.5px]">У цього дієслова немає таких форм.</p>
      ) : (
        <ul className="mt-2 divide-y divide-[var(--line)]">
          {forms.map((form, i) =>
            form ? (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => speak(form)}
                  className="hover:bg-surface-2 flex w-full items-baseline gap-4 px-4 py-2 text-left transition-colors"
                  aria-label={`Прослухати: ${form}`}
                >
                  {!isImperative && (
                    <span className="text-fg-subtle w-20 shrink-0 text-[12px]">{labels[i]}</span>
                  )}
                  <span className="fr text-fg text-[15px] font-medium">{form}</span>
                </button>
              </li>
            ) : null,
          )}
        </ul>
      )}

      {conjugation.note && (
        <p className="border-line text-fg-muted border-t px-4 py-3 text-[13px] leading-snug text-pretty">
          {conjugation.note}
        </p>
      )}
    </div>
  )
}
