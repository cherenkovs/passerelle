import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { ArrowRight, Check, RotateCcw, Sparkles, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FullScreen } from '@/components/layout/full-screen'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { Exercise } from '@/content'
import { useSpeak } from '@/components/common/speak'
import { frenchIn } from '@/lib/speech'
import { cn, pluralUk } from '@/lib/utils'
import { useLearner, xpFor } from '@/store/learner'
import { useSettings } from '@/store/settings'
import { checkExercise, isAnswered, scoreVerdict, type AnswerValue, type Outcome } from './check'
import { FeedbackBar, RetryBar } from './feedback'
import { ExerciseView } from './views'

export type RunResult = {
  correct: number
  total: number
  pct: number
  wrongIds: string[]
  /**
   * Answered *and* got right. Deliberately not "everything that isn't in
   * `wrongIds`": a skipped question was never answered at all, and treating it
   * as a pass would quietly clear mistakes the learner ducked.
   */
  correctIds: string[]
}

type RunnerProps = {
  exercises: Exercise[]
  title: string
  subtitle?: string
  onExit: () => void
  onFinish?: (result: RunResult) => void
  /** Exam mode: near-misses are not forgiven and feedback waits until the end. */
  strict?: boolean
  finishLabel?: string
  /** Extra buttons on the results screen. */
  resultActions?: (result: RunResult) => React.ReactNode
}

/** Short success chime built with the Web Audio API — no asset to download. */
function chime(ok: boolean) {
  try {
    const Ctx = window.AudioContext ?? (window as any).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const now = ctx.currentTime
    const notes = ok ? [660, 880] : [300, 220]
    notes.forEach((f, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0.0001, now + i * 0.09)
      gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.09 + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.22)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + i * 0.09)
      osc.stop(now + i * 0.09 + 0.25)
    })
    setTimeout(() => void ctx.close(), 700)
  } catch {
    /* audio is a nicety, never a requirement */
  }
}

export function ExerciseRunner({
  exercises,
  title,
  subtitle,
  onExit,
  onFinish,
  strict = false,
  finishLabel = 'Завершити',
  resultActions,
}: RunnerProps) {
  const [queue, setQueue] = useState(exercises)
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState<AnswerValue>(null)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  /**
   * A first miss on a typed answer, held back from the verdict.
   *
   * Being shown the answer and being made to find it are not the same
   * lesson. A wrong word underlined, and one more go, is where the actual
   * recall happens; the reveal is what happens when recall has failed. So
   * the first miss on anything typed or assembled costs a second attempt
   * rather than the answer — and if the second attempt lands, it counts as
   * "almost", because it was.
   */
  const [retry, setRetry] = useState<{ given: string; expected: string } | null>(null)
  const [results, setResults] = useState<Record<string, Outcome>>({})
  const [done, setDone] = useState(false)

  const addXp = useLearner((s) => s.addXp)
  const addMistake = useLearner((s) => s.addMistake)
  const ensureCards = useLearner((s) => s.ensureCards)
  const soundEffects = useSettings((s) => s.soundEffects)
  const autoSpeak = useSettings((s) => s.autoSpeak)
  const { speak } = useSpeak()

  const current = queue[index]
  const total = queue.length
  const answeredCount = Object.keys(results).length

  // Reset per-question state whenever we move.
  useEffect(() => {
    setValue(null)
    setOutcome(null)
    setRetry(null)
  }, [index, queue])

  const finish = useCallback(
    (final: Record<string, Outcome>) => {
      const entries = Object.entries(final)
      const correct = entries.filter(([, o]) => o.status !== 'wrong').length
      const pct = entries.length ? Math.round((correct / entries.length) * 100) : 0
      const wrongIds = entries.filter(([, o]) => o.status === 'wrong').map(([id]) => id)
      const correctIds = entries.filter(([, o]) => o.status !== 'wrong').map(([id]) => id)
      setDone(true)
      onFinish?.({ correct, total: entries.length, pct, wrongIds, correctIds })
      if (pct >= 80) {
        confetti({
          particleCount: pct === 100 ? 160 : 90,
          spread: 78,
          origin: { y: 0.65 },
          colors: ['#33409b', '#c15734', '#2c7d5b', '#a3760f'],
          disableForReducedMotion: true,
        })
      }
    },
    [onFinish],
  )

  const submit = useCallback(() => {
    if (!current || outcome) return
    if (!isAnswered(current, value)) return

    let res = checkExercise(current, value, { strict })

    if (res.status === 'wrong' && !strict && !retry && secondChance(current)) {
      setRetry({ given: res.given, expected: res.expected })
      if (soundEffects) chime(false)
      return
    }
    if (retry && res.status === 'correct') {
      res = { ...res, status: 'almost', note: 'З другої спроби — зараховано наполовину.' }
    }

    setOutcome(res)
    setRetry(null)
    setResults((r) => ({ ...r, [current.id]: res }))

    if (soundEffects) chime(res.status !== 'wrong')

    // After a miss, the right answer is heard as well as shown. Reading a
    // correction is one exposure; hearing it while reading it is two, and the
    // second is the one that survives to the next time the phrase comes up.
    // Not after a spoken answer — the learner has just said it — and not when
    // the expected text is a description rather than French ("усі пари").
    if (
      autoSpeak &&
      res.status !== 'correct' &&
      current.kind !== 'speak' &&
      current.kind !== 'listen' &&
      frenchIn(res.expected)
    ) {
      setTimeout(() => speak(res.expected), 450)
    }

    if (res.status === 'correct') addXp(xpFor(current.kind), 1, 1)
    else if (res.status === 'almost') addXp(Math.round(xpFor(current.kind) / 2), 1, 1)
    else {
      addXp(1, 1, 0)
      addMistake({
        exerciseId: current.id,
        kind: current.kind,
        question: questionOf(current, title),
        expected: res.expected,
        given: res.given,
        explain: current.explain,
        wordIds: current.words ?? [],
      })
    }

    if (current.words?.length) ensureCards(current.words)
  }, [
    addMistake,
    addXp,
    autoSpeak,
    current,
    ensureCards,
    outcome,
    retry,
    soundEffects,
    speak,
    strict,
    title,
    value,
  ])

  /** Give up on the second attempt: grade what was typed the first time. */
  const reveal = useCallback(() => {
    if (!current || !retry) return
    const res: Outcome = { status: 'wrong', expected: retry.expected, given: retry.given }
    setOutcome(res)
    setRetry(null)
    setResults((r) => ({ ...r, [current.id]: res }))
    addXp(1, 1, 0)
    addMistake({
      exerciseId: current.id,
      kind: current.kind,
      question: questionOf(current, title),
      expected: res.expected,
      given: res.given,
      explain: current.explain,
      wordIds: current.words ?? [],
    })
    if (autoSpeak && frenchIn(res.expected)) setTimeout(() => speak(res.expected), 450)
  }, [addMistake, addXp, autoSpeak, current, retry, speak, title])

  const next = useCallback(() => {
    if (index + 1 >= total) {
      finish(results)
    } else {
      setIndex((i) => i + 1)
    }
  }, [finish, index, results, total])

  // Enter drives the whole session: check, then advance.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || done) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'TEXTAREA') return
      e.preventDefault()
      if (outcome) next()
      else submit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, next, outcome, submit])

  const retryWrong = () => {
    const wrongIds = Object.entries(results)
      .filter(([, o]) => o.status === 'wrong')
      .map(([id]) => id)
    const retry = exercises.filter((e) => wrongIds.includes(e.id))
    if (!retry.length) return
    setQueue(retry)
    setIndex(0)
    setResults({})
    setDone(false)
  }

  const stats = useMemo(() => {
    const entries = Object.values(results)
    const correct = entries.filter((o) => o.status !== 'wrong').length
    return {
      correct,
      total: entries.length,
      pct: entries.length ? Math.round((correct / entries.length) * 100) : 0,
      wrongIds: Object.entries(results)
        .filter(([, o]) => o.status === 'wrong')
        .map(([id]) => id),
      correctIds: Object.entries(results)
        .filter(([, o]) => o.status !== 'wrong')
        .map(([id]) => id),
    }
  }, [results])

  if (done) {
    return (
      <ResultScreen
        stats={stats}
        onExit={onExit}
        onRetryWrong={stats.wrongIds.length ? retryWrong : undefined}
        finishLabel={finishLabel}
        extra={resultActions?.(stats)}
      />
    )
  }

  if (!current) return null

  const canSubmit = isAnswered(current, value)

  return (
    <FullScreen>
      {/* Header */}
      <header className="border-line bg-bg/85 sticky top-0 z-30 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3.5 sm:px-6">
          <Button variant="ghost" size="icon-sm" onClick={onExit} aria-label="Вийти">
            <X />
          </Button>
          <div className="min-w-0 flex-1">
            <Progress value={(answeredCount / total) * 100} />
          </div>
          <span className="text-fg-subtle shrink-0 text-[12px] tabular-nums">
            {Math.min(index + 1, total)}/{total}
          </span>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl">
          {subtitle && <p className="text-fg-subtle mb-6 text-center text-[13px]">{subtitle}</p>}
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          >
            <ExerciseView
              exercise={current}
              value={value}
              onChange={setValue}
              outcome={outcome}
              onSubmit={submit}
              onSkip={next}
            />
          </motion.div>
        </div>
      </main>

      {/* Footer: feedback + action */}
      <footer className="border-line bg-bg/90 sticky bottom-0 z-30 border-t px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {retry && !outcome ? (
            <RetryBar given={retry.given} expected={retry.expected} onReveal={reveal} />
          ) : (
            <FeedbackBar outcome={outcome} explain={current.explain} exercise={current} />
          )}
          <div className="flex items-center gap-3">
            {!outcome ? (
              <Button
                className="flex-1"
                size="lg"
                disabled={!canSubmit}
                onClick={submit}
                variant={canSubmit ? 'primary' : 'surface'}
              >
                <Check /> Перевірити
              </Button>
            ) : (
              <Button
                className="flex-1"
                size="lg"
                onClick={next}
                variant={outcome.status === 'wrong' ? 'surface' : 'primary'}
              >
                {index + 1 >= total ? 'Підсумок' : 'Далі'} <ArrowRight />
              </Button>
            )}
          </div>
          <p className="text-fg-subtle hidden text-center text-[11px] sm:block">
            Enter — перевірити й перейти далі · цифри 1–4 — обрати варіант
          </p>
        </div>
      </footer>
    </FullScreen>
  )
}

/** What the mistakes log shows as the question, whatever the exercise shape. */
function questionOf(ex: Exercise, fallback: string): string {
  if ('question' in ex) return ex.question
  if ('sentence' in ex) return ex.sentence
  if ('text' in ex) return ex.text
  if ('audioText' in ex) return ex.audioText
  return fallback
}

/**
 * Which exercises earn a second attempt.
 *
 * The ones where the learner produced something: typed, translated, took
 * dictation, assembled a sentence. A choice among three options is not
 * recall, and a second guess there is just the odds shortening.
 */
function secondChance(ex: Exercise): boolean {
  switch (ex.kind) {
    case 'type':
    case 'translate':
    case 'dictation':
    case 'wordbank':
      return true
    case 'cloze':
      return !ex.options
    default:
      return false
  }
}

/* ------------------------------------------------------------------ *
 * Result screen
 * ------------------------------------------------------------------ */

function ResultScreen({
  stats,
  onExit,
  onRetryWrong,
  finishLabel,
  extra,
}: {
  stats: RunResult
  onExit: () => void
  onRetryWrong?: () => void
  finishLabel: string
  extra?: React.ReactNode
}) {
  const verdict = scoreVerdict(stats.pct)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <FullScreen>
      <div className="grid flex-1 place-items-center px-4 py-12">
        <motion.div
          ref={ref}
          tabIndex={-1}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className="border-line bg-surface w-full max-w-md rounded-3xl border p-8 text-center shadow-[var(--shadow-lift)] outline-none"
        >
          <div
            className={cn(
              'mx-auto grid size-16 place-items-center rounded-2xl',
              stats.pct >= 80
                ? 'bg-success-soft text-success'
                : stats.pct >= 60
                  ? 'bg-primary-soft text-primary-soft-fg'
                  : 'bg-warning-soft text-warning',
            )}
          >
            <Sparkles className="size-8" />
          </div>

          <h2 className="font-display mt-5 text-2xl font-semibold tracking-tight">
            {verdict.title}
          </h2>
          <p className="text-fg-muted mt-1.5 text-sm text-pretty">{verdict.note}</p>

          <div className="my-7">
            <div className="font-display text-6xl font-semibold tracking-tight tabular-nums">
              {stats.pct}
              <span className="text-fg-subtle text-3xl">%</span>
            </div>
            <p className="text-fg-muted mt-2 text-sm">
              {stats.correct} з {stats.total}{' '}
              {pluralUk(stats.total, ['завдання', 'завдання', 'завдань'])}
            </p>
          </div>

          <Progress
            value={stats.pct}
            className="h-2.5"
            barClassName={cn(
              stats.pct >= 80 ? 'bg-success' : stats.pct >= 60 ? 'bg-primary' : 'bg-warning',
            )}
          />

          <div className="mt-8 space-y-2.5">
            {extra}
            {onRetryWrong && (
              <Button variant="surface" className="w-full" size="lg" onClick={onRetryWrong}>
                <RotateCcw /> Повторити помилки ({stats.wrongIds.length})
              </Button>
            )}
            <Button className="w-full" size="lg" onClick={onExit}>
              {finishLabel} <ArrowRight />
            </Button>
          </div>

          <p className="text-fg-subtle mt-5 text-[12px] text-pretty">
            Слова із цієї сесії автоматично додано до інтервальних повторень.
          </p>
        </motion.div>
      </div>
    </FullScreen>
  )
}
