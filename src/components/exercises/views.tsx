import { AnimatePresence, motion } from 'framer-motion'
import { Mic, MicOff, RotateCcw, Turtle, Volume2, WholeWord } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AccentBar } from '@/components/common/accent-bar'
import { Inline, SpeakInline } from '@/components/common/rich-text'
import {
  SpeakButton,
  Spoken,
  TapText,
  useSpeak,
  type SpeakController,
  type SpeakMode,
} from '@/components/common/speak'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type {
  ClozeExercise,
  DictationExercise,
  Exercise,
  ListenExercise,
  MatchExercise,
  McqExercise,
  SpeakExercise,
  TranslateExercise,
  TypeExercise,
  WordBankExercise,
} from '@/content'
import { listenOnce, supportsSTT, wordsOf } from '@/lib/speech'
import { cn, shuffle } from '@/lib/utils'
import { useSettings } from '@/store/settings'
import type { AnswerValue, Outcome } from './check'

export type ViewProps<E extends Exercise = Exercise> = {
  exercise: E
  value: AnswerValue
  onChange: (v: AnswerValue) => void
  outcome: Outcome | null
  onSubmit: () => void
  /**
   * Move on without grading. Speaking tasks need this: a learner with no
   * microphone (or no privacy to talk) must never be trapped on a question,
   * and skipping shouldn't count as a mistake against them.
   */
  onSkip: () => void
}

/* ------------------------------------------------------------------ *
 * Shared bits
 * ------------------------------------------------------------------ */

/**
 * The listening panel: one big play button, and the two slower ways under it.
 *
 * Listening and dictation are the exercises where "say that again, slower"
 * is the whole point, so the three modes are laid out in full rather than as
 * the compact cluster used beside a line of text. Once the answer is in, the
 * text appears and lights up word by word on replay — the moment to connect
 * what was heard to how it is written.
 */
function ListeningPanel({
  text,
  ctl,
  revealed,
  tone = 'primary',
  hint,
}: {
  text: string
  ctl: SpeakController
  revealed: boolean
  tone?: 'primary' | 'accent'
  hint?: string
}) {
  const many = wordsOf(text).length >= 2
  const modes: { id: SpeakMode; label: string; icon: React.ReactNode }[] = [
    { id: 'slow', label: 'Повільніше', icon: <Turtle className="size-3.5" /> },
    ...(many
      ? [{ id: 'words' as const, label: 'По словах', icon: <WholeWord className="size-3.5" /> }]
      : []),
  ]

  return (
    <div className="border-line bg-surface-2 mb-6 flex flex-col items-center gap-4 rounded-2xl border py-8">
      <button
        type="button"
        onClick={() => ctl.toggle(text, 'normal')}
        aria-pressed={ctl.mode === 'normal'}
        className={cn(
          'grid size-20 place-items-center rounded-full transition-transform hover:scale-105 active:scale-95',
          tone === 'primary'
            ? 'bg-primary text-primary-fg shadow-[0_10px_30px_-10px_var(--primary)]'
            : 'bg-accent text-accent-fg shadow-[0_10px_30px_-10px_var(--accent)]',
          ctl.mode === 'normal' && 'ring-primary/25 ring-8',
        )}
        aria-label="Прослухати"
      >
        <Volume2 className={cn('size-9', ctl.mode === 'normal' && 'animate-pulse')} />
      </button>

      <div className="flex gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => ctl.toggle(text, m.id)}
            aria-pressed={ctl.mode === m.id}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors',
              ctl.mode === m.id
                ? 'border-primary bg-primary-soft text-primary-soft-fg'
                : 'border-line bg-surface text-fg-muted hover:text-fg',
            )}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {revealed ? (
        <div className="fr text-fg mt-1 px-6 text-center text-[17px] leading-snug">
          <TapText activeWord={ctl.activeWord}>{text}</TapText>
        </div>
      ) : (
        hint && <p className="text-fg-subtle px-6 text-center text-[12px] text-pretty">{hint}</p>
      )}
    </div>
  )
}

function Prompt({ children }: { children?: string }) {
  if (!children) return null
  return (
    <p className="text-accent mb-5 text-[13px] font-medium tracking-wide uppercase">{children}</p>
  )
}

function Question({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'font-display text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-[28px]',
        className,
      )}
    >
      {typeof children === 'string' ? <Inline>{children}</Inline> : children}
    </div>
  )
}

/**
 * Choice button shared by MCQ and listening.
 *
 * A French option is also an audio button: picking «Je n'aime pas le café»
 * should let you *hear* the elision you just chose, and hear it again on every
 * tap. So once the answer is locked the button stays live — `locked` stops the
 * answer changing, which is not the same thing as the button going dead.
 */
function Choice({
  label,
  index,
  selected,
  state,
  french,
  onClick,
  locked,
}: {
  label: string
  index: number
  selected: boolean
  state: 'idle' | 'correct' | 'wrong'
  french?: boolean
  onClick: () => void
  locked?: boolean
}) {
  const { speak } = useSpeak()
  const inert = locked && !french

  const handleClick = () => {
    if (french) speak(label)
    if (!locked) onClick()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={inert}
      aria-label={french ? `${label} — прослухати` : undefined}
      className={cn(
        'group flex w-full items-center gap-3.5 rounded-2xl border-2 p-4 text-left transition-all',
        'disabled:cursor-default',
        state === 'idle' &&
          (selected
            ? 'border-primary bg-primary-soft'
            : 'border-line bg-surface hover:border-line-strong hover:bg-surface-2'),
        state === 'correct' && 'border-success bg-success-soft',
        state === 'wrong' && 'border-danger bg-danger-soft',
      )}
    >
      <span
        className={cn(
          'grid size-7 shrink-0 place-items-center rounded-lg font-mono text-[12px] font-semibold transition-colors',
          state === 'idle' &&
            (selected ? 'bg-primary text-primary-fg' : 'bg-surface-3 text-fg-subtle'),
          state === 'correct' && 'bg-success text-white',
          state === 'wrong' && 'bg-danger text-white',
        )}
      >
        {index + 1}
      </span>
      <span className={cn('flex-1 text-[15px] leading-snug', french && 'fr font-medium')}>
        {label}
      </span>
    </button>
  )
}

function choiceState(i: number, answer: number, chosen: number | null, outcome: Outcome | null) {
  if (!outcome) return 'idle' as const
  if (i === answer) return 'correct' as const
  if (i === chosen) return 'wrong' as const
  return 'idle' as const
}

/** Text field shared by type / cloze / translate / dictation. */
function AnswerField({
  value,
  onChange,
  onSubmit,
  outcome,
  placeholder,
  autoFocus = true,
  accents = true,
  className,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  outcome: Outcome | null
  placeholder?: string
  autoFocus?: boolean
  accents?: boolean
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && !outcome) ref.current?.focus()
  }, [autoFocus, outcome])

  return (
    <div className={cn('space-y-3', className)}>
      <Input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onSubmit()
          }
        }}
        disabled={Boolean(outcome)}
        placeholder={placeholder ?? 'Твоя відповідь…'}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        lang="fr"
        className={cn(
          'fr h-14 text-lg',
          outcome?.status === 'correct' && 'border-success bg-success-soft',
          outcome?.status === 'almost' && 'border-warning bg-warning-soft',
          outcome?.status === 'wrong' && 'border-danger bg-danger-soft',
        )}
      />
      {accents && !outcome && <AccentBar inputRef={ref} />}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * MCQ
 * ------------------------------------------------------------------ */

export function McqView({ exercise, value, onChange, outcome }: ViewProps<McqExercise>) {
  const chosen = typeof value === 'number' ? value : null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (outcome) return
      const n = Number(e.key)
      if (n >= 1 && n <= exercise.options.length) onChange(n - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [exercise.options.length, onChange, outcome])

  return (
    <div>
      <Prompt>{exercise.prompt}</Prompt>
      <div className="mb-6 flex items-start gap-3">
        <Question className={cn(exercise.speak && 'fr')}>{exercise.question}</Question>
        {exercise.speak && <SpeakButton text={exercise.speak} className="mt-1" slow />}
      </div>
      <div className="space-y-2.5">
        {exercise.options.map((opt, i) => (
          <Choice
            key={i}
            label={opt}
            index={i}
            selected={chosen === i}
            state={choiceState(i, exercise.answer, chosen, outcome)}
            french={exercise.optionsAreFrench}
            locked={Boolean(outcome)}
            onClick={() => onChange(i)}
          />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Listening
 * ------------------------------------------------------------------ */

export function ListenView({ exercise, value, onChange, outcome }: ViewProps<ListenExercise>) {
  const chosen = typeof value === 'number' ? value : null
  const ctl = useSpeak()
  const { speak } = ctl
  const autoSpeak = useSettings((s) => s.autoSpeak)
  const played = useRef(false)

  useEffect(() => {
    if (autoSpeak && !played.current) {
      played.current = true
      const t = setTimeout(() => speak(exercise.audioText), 350)
      return () => clearTimeout(t)
    }
  }, [autoSpeak, exercise.audioText, speak])

  return (
    <div>
      <Prompt>{exercise.prompt ?? 'Послухай і обери правильну відповідь'}</Prompt>

      <ListeningPanel text={exercise.audioText} ctl={ctl} revealed={Boolean(outcome)} />

      <div className="space-y-2.5">
        {exercise.options.map((opt, i) => (
          <Choice
            key={i}
            label={opt}
            index={i}
            selected={chosen === i}
            state={choiceState(i, exercise.answer, chosen, outcome)}
            locked={Boolean(outcome)}
            onClick={() => onChange(i)}
          />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Free typing
 * ------------------------------------------------------------------ */

export function TypeView({
  exercise,
  value,
  onChange,
  outcome,
  onSubmit,
}: ViewProps<TypeExercise>) {
  return (
    <div>
      <Prompt>{exercise.prompt ?? 'Напиши французькою'}</Prompt>
      <div className="mb-6 flex items-start gap-3">
        <Question>{exercise.question}</Question>
        {exercise.speak && <SpeakButton text={exercise.speak} className="mt-1" />}
      </div>
      {exercise.hint && !outcome && (
        <p className="text-fg-subtle mb-4 text-sm">
          💡 <SpeakInline>{exercise.hint}</SpeakInline>
        </p>
      )}
      <AnswerField
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
        onSubmit={onSubmit}
        outcome={outcome}
        accents={exercise.accents !== false}
      />
    </div>
  )
}

export function TranslateView({
  exercise,
  value,
  onChange,
  outcome,
  onSubmit,
}: ViewProps<TranslateExercise>) {
  return (
    <div>
      <Prompt>{exercise.prompt ?? 'Переклади французькою'}</Prompt>
      <div className="border-accent bg-accent-soft/50 mb-6 rounded-2xl border-l-4 px-5 py-4">
        <Question className="font-sans text-xl font-medium">{exercise.question}</Question>
      </div>
      {exercise.hint && !outcome && (
        <p className="text-fg-subtle mb-4 text-sm">
          💡 <SpeakInline>{exercise.hint}</SpeakInline>
        </p>
      )}
      <AnswerField
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
        onSubmit={onSubmit}
        outcome={outcome}
        placeholder="Французькою…"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Cloze
 * ------------------------------------------------------------------ */

export function ClozeView({
  exercise,
  value,
  onChange,
  outcome,
  onSubmit,
}: ViewProps<ClozeExercise>) {
  const str = typeof value === 'string' ? value : ''
  const { speak } = useSpeak()
  const parts = exercise.sentence.split(/(_{2,})/)
  const blanks = parts.filter((p) => /^_{2,}$/.test(p)).length

  // The whole point of a gap-fill is the finished sentence, and until now there
  // was no way to hear it — the learner filled the blank and moved on without
  // ever knowing how the result sounds.
  const filled = exercise.sentence.replace(/_{2,}/, exercise.answer[0] ?? '')

  return (
    <div>
      <Prompt>{exercise.prompt ?? 'Заповни пропуск'}</Prompt>

      <div className="border-line bg-surface-2 mb-3 rounded-2xl border px-5 py-6">
        <div className="fr font-display flex flex-wrap items-baseline gap-x-1.5 gap-y-2 text-2xl leading-relaxed font-semibold">
          {parts.map((part, i) => {
            if (!/^_{2,}$/.test(part)) return <span key={i}>{part}</span>
            const isFirst = parts.slice(0, i).every((p) => !/^_{2,}$/.test(p))
            return (
              <span
                key={i}
                className={cn(
                  'inline-block min-w-[4.5rem] rounded-lg border-b-[3px] px-2 pb-0.5 text-center transition-colors',
                  !outcome && 'border-primary/50 bg-primary-soft/40',
                  outcome?.status === 'correct' && 'border-success bg-success-soft text-success',
                  outcome?.status === 'almost' && 'border-warning bg-warning-soft text-warning',
                  outcome?.status === 'wrong' && 'border-danger bg-danger-soft text-danger',
                )}
              >
                {outcome
                  ? blanks > 1 && !isFirst
                    ? '…'
                    : outcome.status === 'wrong'
                      ? outcome.expected
                      : str || outcome.expected
                  : blanks > 1 && !isFirst
                    ? '…'
                    : str || ' '}
              </span>
            )
          })}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-fg-muted text-sm">
            <Inline>{exercise.translation}</Inline>
          </div>
          {outcome && <SpeakButton text={filled} size="sm" slow />}
        </div>
      </div>

      {exercise.hint && !outcome && (
        <p className="text-fg-subtle mb-4 text-sm">
          💡 <SpeakInline>{exercise.hint}</SpeakInline>
        </p>
      )}

      {exercise.options ? (
        <div className="flex flex-wrap gap-2.5">
          {exercise.options.map((opt) => {
            const selected = str === opt
            const isRight = exercise.answer.some(
              (a) => a.toLowerCase().trim() === opt.toLowerCase().trim(),
            )
            return (
              <button
                key={opt}
                type="button"
                aria-label={`${opt} — прослухати`}
                onClick={() => {
                  // Gap-fill chips are always French, so each tap says the word
                  // — including after the answer is locked, when hearing the
                  // right form next to the one you picked is the lesson.
                  speak(opt)
                  if (!outcome) onChange(opt)
                }}
                className={cn(
                  'fr rounded-xl border-2 px-5 py-3 text-[15px] font-medium transition-all',
                  !outcome &&
                    (selected
                      ? 'border-primary bg-primary-soft text-primary-soft-fg'
                      : 'border-line bg-surface hover:border-line-strong hover:bg-surface-2'),
                  outcome && isRight && 'border-success bg-success-soft text-success',
                  outcome && !isRight && selected && 'border-danger bg-danger-soft text-danger',
                  outcome && !isRight && !selected && 'border-line bg-surface opacity-50',
                )}
              >
                {opt}
              </button>
            )
          })}
        </div>
      ) : (
        <AnswerField
          value={str}
          onChange={onChange}
          onSubmit={onSubmit}
          outcome={outcome}
          placeholder="Що на місці пропуску?"
        />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Dictation
 * ------------------------------------------------------------------ */

export function DictationView({
  exercise,
  value,
  onChange,
  outcome,
  onSubmit,
}: ViewProps<DictationExercise>) {
  const ctl = useSpeak()
  const { speak } = ctl
  const autoSpeak = useSettings((s) => s.autoSpeak)
  const played = useRef(false)

  useEffect(() => {
    if (autoSpeak && !played.current) {
      played.current = true
      const t = setTimeout(() => speak(exercise.text), 350)
      return () => clearTimeout(t)
    }
  }, [autoSpeak, exercise.text, speak])

  return (
    <div>
      <Prompt>{exercise.prompt ?? 'Диктант — запиши те, що чуєш'}</Prompt>

      <ListeningPanel
        text={exercise.text}
        ctl={ctl}
        revealed={Boolean(outcome)}
        tone="accent"
        hint="Німі закінчення почути неможливо — саме тому диктант і працює."
      />

      <AnswerField
        value={typeof value === 'string' ? value : ''}
        onChange={onChange}
        onSubmit={onSubmit}
        outcome={outcome}
        placeholder="Запиши французькою…"
      />

      {outcome && (
        <div className="text-fg-muted mt-4 px-1 text-sm">
          <Inline>{exercise.translation}</Inline>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Word bank
 * ------------------------------------------------------------------ */

export function WordBankView({ exercise, value, onChange, outcome }: ViewProps<WordBankExercise>) {
  const chosen = Array.isArray(value) ? value : []
  const { speak } = useSpeak()

  const bank = useMemo(() => {
    const words = exercise.answer.split(/\s+/).filter(Boolean)
    return shuffle([...words, ...(exercise.distractors ?? [])], exercise.id.length * 17)
  }, [exercise.answer, exercise.distractors, exercise.id])

  // Track consumed bank slots by index so duplicate words behave correctly.
  const [used, setUsed] = useState<number[]>([])

  const add = (i: number) => {
    if (outcome || used.includes(i)) return
    // Every tap says the word: assembling a sentence out of silent blocks
    // teaches its shape and nothing about how it sounds.
    speak(bank[i])
    setUsed((u) => [...u, i])
    onChange([...chosen, bank[i]])
  }
  const removeAt = (pos: number) => {
    if (outcome) return
    setUsed((u) => u.filter((_, k) => k !== pos))
    onChange(chosen.filter((_, k) => k !== pos))
  }

  return (
    <div>
      <Prompt>{exercise.prompt ?? 'Збери речення'}</Prompt>
      <div className="border-accent bg-accent-soft/50 mb-6 rounded-2xl border-l-4 px-5 py-4">
        <div className="text-xl leading-snug font-medium">{exercise.question}</div>
      </div>

      {/* Answer line */}
      <div
        className={cn(
          'mb-5 flex min-h-[76px] flex-wrap content-start items-start gap-2 rounded-2xl border-2 border-dashed p-3.5 transition-colors',
          !outcome && 'border-line-strong bg-surface-2',
          outcome?.status === 'correct' && 'border-success bg-success-soft',
          outcome?.status === 'almost' && 'border-warning bg-warning-soft',
          outcome?.status === 'wrong' && 'border-danger bg-danger-soft',
        )}
      >
        {chosen.length === 0 && (
          <span className="text-fg-subtle px-1.5 py-2 text-sm">
            Натискай слова знизу, щоб скласти речення
          </span>
        )}
        <AnimatePresence mode="popLayout">
          {chosen.map((w, i) => (
            <motion.button
              key={`${w}-${i}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              type="button"
              onClick={() => removeAt(i)}
              className="fr border-line bg-surface hover:border-danger hover:text-danger rounded-lg border px-3 py-2 text-[15px] font-medium shadow-sm transition-colors"
            >
              {w}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Bank */}
      <div className="flex flex-wrap gap-2">
        {bank.map((w, i) => (
          <button
            key={`${w}-${i}`}
            type="button"
            disabled={used.includes(i) || Boolean(outcome)}
            onClick={() => add(i)}
            className={cn(
              'fr rounded-lg border px-3 py-2 text-[15px] font-medium transition-all',
              used.includes(i)
                ? 'border-line pointer-events-none border-dashed bg-transparent text-transparent'
                : 'border-line bg-surface hover:border-primary hover:bg-primary-soft active:scale-95',
            )}
          >
            {w}
          </button>
        ))}
      </div>

      {outcome && (
        <div className="mt-5 flex items-center gap-2">
          <SpeakButton text={exercise.answer} size="sm" />
          <span className="fr text-fg-muted text-sm">
            <TapText>{exercise.answer}</TapText>
          </span>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Matching pairs
 * ------------------------------------------------------------------ */

export function MatchView({ exercise, onChange, outcome, onSubmit }: ViewProps<MatchExercise>) {
  const { speak } = useSpeak()
  const [left, setLeft] = useState<number | null>(null)
  const [solved, setSolved] = useState<number[]>([])
  const [wrongPair, setWrongPair] = useState<[number, number] | null>(null)
  const [mistakes, setMistakes] = useState(0)

  const rights = useMemo(
    () =>
      shuffle(
        exercise.pairs.map((p, i) => ({ ...p, i })),
        exercise.id.length * 31,
      ),
    [exercise.pairs, exercise.id],
  )

  const pick = (rightIndex: number) => {
    if (left === null || outcome) return
    if (left === rightIndex) {
      const next = [...solved, left]
      setSolved(next)
      setLeft(null)
      speak(exercise.pairs[left].fr)
      if (next.length === exercise.pairs.length) {
        onChange({ mistakes })
        setTimeout(onSubmit, 260)
      }
    } else {
      setMistakes((n) => n + 1)
      setWrongPair([left, rightIndex])
      setTimeout(() => {
        setWrongPair(null)
        setLeft(null)
      }, 550)
    }
  }

  return (
    <div>
      <Prompt>{exercise.prompt ?? "З'єднай пари"}</Prompt>
      <p className="text-fg-muted mb-5 text-sm">
        Обери слово ліворуч, потім його відповідник праворуч.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2.5">
          {exercise.pairs.map((p, i) => {
            const done = solved.includes(i)
            const isWrong = wrongPair?.[0] === i
            return (
              <button
                key={i}
                type="button"
                aria-label={`${p.fr} — прослухати`}
                onClick={() => {
                  // Picking the French side says it. A matched word stays
                  // tappable for sound: being solved is not a reason to go
                  // silent, and it is the moment you most want to hear it.
                  speak(p.fr)
                  if (!done) setLeft(i)
                }}
                className={cn(
                  'fr w-full rounded-xl border-2 px-3.5 py-3 text-left text-[15px] font-medium transition-all',
                  done && 'border-success bg-success-soft text-success opacity-60',
                  !done && left === i && 'border-primary bg-primary-soft',
                  !done && left !== i && 'border-line bg-surface hover:border-line-strong',
                  isWrong && 'animate-shake border-danger bg-danger-soft',
                )}
              >
                {p.fr}
              </button>
            )
          })}
        </div>

        <div className="space-y-2.5">
          {rights.map((p) => {
            const done = solved.includes(p.i)
            const isWrong = wrongPair?.[1] === p.i
            return (
              <button
                key={p.i}
                type="button"
                disabled={done || left === null}
                onClick={() => pick(p.i)}
                className={cn(
                  'w-full rounded-xl border-2 px-3.5 py-3 text-left text-[15px] transition-all',
                  done && 'border-success bg-success-soft text-success opacity-60',
                  !done && 'border-line bg-surface',
                  !done && left !== null && 'hover:border-primary hover:bg-primary-soft',
                  !done && left === null && 'opacity-70',
                  isWrong && 'animate-shake border-danger bg-danger-soft',
                )}
              >
                {p.uk}
              </button>
            )
          })}
        </div>
      </div>

      <p className="text-fg-subtle mt-5 text-center text-[12px]">
        Знайдено {solved.length} з {exercise.pairs.length}
        {mistakes > 0 && ` · помилок: ${mistakes}`}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Speaking
 * ------------------------------------------------------------------ */

export function SpeakView({
  exercise,
  value,
  onChange,
  outcome,
  onSubmit,
  onSkip,
}: ViewProps<SpeakExercise>) {
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<string | null>(null)
  const stopRef = useRef<(() => void) | null>(null)
  const supported = supportsSTT()

  const start = async () => {
    if (listening) {
      stopRef.current?.()
      return
    }
    setError(null)
    setInterim('')
    setListening(true)
    const handle = listenOnce({ lang: 'fr-FR', onInterim: setInterim })
    stopRef.current = handle.stop
    try {
      const transcript = await handle.result
      setListening(false)
      if (transcript) {
        onChange(transcript)
        setTimeout(onSubmit, 120)
      } else {
        setError('Нічого не почули. Спробуй ще раз.')
      }
    } catch (e) {
      setListening(false)
      const msg = (e as Error).message
      setError(
        msg === 'not-allowed'
          ? 'Доступ до мікрофона заблоковано. Дозволь його в налаштуваннях браузера.'
          : 'Не вдалося розпізнати. Перевір мікрофон і спробуй ще.',
      )
    }
  }

  return (
    <div>
      <Prompt>{exercise.prompt ?? 'Вимов уголос'}</Prompt>

      <Spoken text={exercise.text} words>
        {({ controls, text }) => (
          <div className="border-line bg-surface-2 mb-6 rounded-2xl border p-6 text-center">
            <div className="fr font-display text-2xl leading-snug font-semibold text-balance">
              {text}
            </div>
            <div className="text-fg-muted mt-2 text-sm">
              <Inline>{exercise.translation}</Inline>
            </div>
            <div className="mt-4 flex justify-center">{controls}</div>
          </div>
        )}
      </Spoken>

      {supported ? (
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={start}
            disabled={Boolean(outcome)}
            className={cn(
              'relative grid size-20 place-items-center rounded-full transition-all',
              listening
                ? 'bg-danger text-white'
                : 'bg-primary text-primary-fg hover:scale-105 active:scale-95',
              'disabled:opacity-50',
            )}
            aria-label={listening ? 'Зупинити запис' : 'Почати запис'}
          >
            {listening && (
              <motion.span
                className="bg-danger/30 absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            )}
            {listening ? <MicOff className="size-8" /> : <Mic className="size-8" />}
          </button>

          <p className="text-fg-muted text-sm">
            {listening ? 'Слухаю… говори французькою' : 'Натисни й вимов фразу'}
          </p>

          {(interim || typeof value === 'string') && (
            <div className="fr bg-surface min-h-[2rem] rounded-xl px-4 py-2 text-center text-[15px]">
              {interim || (value as string)}
            </div>
          )}

          {error && <p className="text-danger text-sm">{error}</p>}

          {!outcome && (
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Пропустити
            </Button>
          )}
        </div>
      ) : (
        <div className="border-line bg-surface-2 rounded-2xl border p-5 text-center">
          <p className="text-fg-muted text-sm text-pretty">
            Розпізнавання мовлення недоступне в цьому браузері. Найкраще працює в Chrome, Edge та
            Safari. Вимов фразу вголос самостійно й перевір себе на слух.
          </p>
          <Button className="mt-4" variant="surface" onClick={onSkip}>
            <RotateCcw /> Я вимовив, далі
          </Button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Dispatcher
 * ------------------------------------------------------------------ */

export function ExerciseView(props: ViewProps) {
  const { exercise } = props
  switch (exercise.kind) {
    case 'mcq':
      return <McqView {...(props as ViewProps<McqExercise>)} />
    case 'listen':
      return <ListenView {...(props as ViewProps<ListenExercise>)} />
    case 'type':
      return <TypeView {...(props as ViewProps<TypeExercise>)} />
    case 'translate':
      return <TranslateView {...(props as ViewProps<TranslateExercise>)} />
    case 'cloze':
      return <ClozeView {...(props as ViewProps<ClozeExercise>)} />
    case 'dictation':
      return <DictationView {...(props as ViewProps<DictationExercise>)} />
    case 'wordbank':
      return <WordBankView {...(props as ViewProps<WordBankExercise>)} />
    case 'match':
      return <MatchView {...(props as ViewProps<MatchExercise>)} />
    case 'speak':
      return <SpeakView {...(props as ViewProps<SpeakExercise>)} />
  }
}
