import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Eye, GraduationCap, Lightbulb, RotateCcw, XCircle } from 'lucide-react'
import { useState } from 'react'
import { ProfessorPanel } from '@/components/common/professor'
import { SpeakInline } from '@/components/common/rich-text'
import { SpeakButton } from '@/components/common/speak'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { Exercise } from '@/content'
import { diffWords } from '@/lib/grade'
import { frenchIn } from '@/lib/speech'
import { pluralUk } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Outcome } from './check'

const COPY = {
  correct: { title: 'Правильно!', Icon: CheckCircle2 },
  almost: { title: 'Майже!', Icon: Lightbulb },
  wrong: { title: 'Неправильно', Icon: XCircle },
} as const

/**
 * The feedback bar is where the actual teaching happens. It always shows the
 * correct answer (audible, tappable) and — crucially — *why*, in Ukrainian.
 */
export function FeedbackBar({
  outcome,
  explain,
  exercise,
  className,
}: {
  outcome: Outcome | null
  explain?: string
  /** When given, a miss offers the professor, opened on this exercise. */
  exercise?: Exercise
  className?: string
}) {
  const [asking, setAsking] = useState(false)
  return (
    <AnimatePresence mode="wait">
      {outcome && (
        <motion.div
          key={outcome.status + outcome.expected}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className={cn(
            'rounded-2xl border p-4 sm:p-5',
            outcome.status === 'correct' && 'border-success-border bg-success-soft',
            outcome.status === 'almost' && 'border-warning/35 bg-warning-soft',
            outcome.status === 'wrong' && 'border-danger-border bg-danger-soft',
            className,
          )}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <FeedbackIcon status={outcome.status} />

            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  'font-display text-base font-semibold',
                  outcome.status === 'correct' && 'text-success',
                  outcome.status === 'almost' && 'text-warning',
                  outcome.status === 'wrong' && 'text-danger',
                )}
              >
                {COPY[outcome.status].title}
              </div>

              {outcome.status !== 'correct' && (
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-fg-muted">Правильно:</span>
                  <span className="fr text-fg font-medium">{outcome.expected}</span>
                  {/* Audible whenever it's French — a correct answer you can't
                      hear is the one thing the learner most wants to hear. */}
                  {frenchIn(outcome.expected) && (
                    <SpeakButton text={outcome.expected} size="sm" slow />
                  )}
                </div>
              )}

              {outcome.note && (
                <p className="text-fg-muted mt-2 text-[13px] leading-relaxed">
                  <SpeakInline>{outcome.note}</SpeakInline>
                </p>
              )}

              {explain && (
                <p className="text-fg-muted mt-2 border-t border-current/10 pt-2 text-[13px] leading-relaxed text-pretty">
                  <SpeakInline>{explain}</SpeakInline>
                </p>
              )}

              {/* The moment of a mistake is when a question is sharpest.
                  The professor opens over the exercise, so asking does not
                  cost the place in the lesson. */}
              {exercise && outcome.status !== 'correct' && (
                <button
                  type="button"
                  onClick={() => setAsking(true)}
                  className="text-fg hover:text-primary mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-medium underline-offset-4 hover:underline"
                >
                  <GraduationCap className="size-4" /> Запитати професора
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {exercise && (
        <Dialog open={asking} onOpenChange={setAsking}>
          <DialogContent className="flex max-h-[88vh] max-w-2xl flex-col p-0">
            <DialogTitle className="border-line border-b px-5 py-4 text-base">
              Професор про це завдання
            </DialogTitle>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4">
              <ProfessorPanel key={exercise.id} exercise={exercise} compact />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

/**
 * The bar for a first miss: what was typed, with the wrong words marked, and
 * an invitation to try again. The answer stays hidden — that is the point.
 */
export function RetryBar({
  given,
  expected,
  onReveal,
}: {
  given: string
  expected: string
  onReveal: () => void
}) {
  const parts = diffWords(given, expected)
  const wrong = parts.filter((p) => !p.ok).length
  const expectedWords = expected.trim().split(/\s+/).filter(Boolean).length
  const givenWords = parts.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="border-warning/35 bg-warning-soft rounded-2xl border p-4 sm:p-5"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className="text-warning grid size-8 shrink-0 place-items-center rounded-full">
          <RotateCcw className="size-6" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-display text-warning text-base font-semibold">
            Не зовсім. Спробуй ще раз
          </div>
          <p className="fr text-fg mt-1.5 text-[15px] leading-relaxed">
            {parts.map((p, i) => (
              <span
                key={i}
                className={
                  p.ok
                    ? undefined
                    : 'decoration-danger text-danger underline decoration-2 underline-offset-4'
                }
              >
                {p.text}
                {i < parts.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
          <p className="text-fg-muted mt-1.5 text-[13px]">
            {wrong
              ? `${wrong} ${pluralUk(wrong, ['слово не на місці', 'слова не на місці', 'слів не на місці'])}`
              : 'Слова правильні — перевір порядок або написання'}
            {expectedWords !== givenWords &&
              `; у відповіді ${expectedWords} ${pluralUk(expectedWords, ['слово', 'слова', 'слів'])}`}
          </p>
          <button
            type="button"
            onClick={onReveal}
            className="text-fg hover:text-primary mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-medium underline-offset-4 hover:underline"
          >
            <Eye className="size-4" /> Показати відповідь
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function FeedbackIcon({ status }: { status: Outcome['status'] }) {
  const { Icon } = COPY[status]
  return (
    <motion.span
      initial={{ scale: 0.4, rotate: status === 'correct' ? -25 : 0 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-full',
        status === 'correct' && 'text-success',
        status === 'almost' && 'text-warning',
        status === 'wrong' && 'text-danger',
      )}
    >
      <Icon className="size-7" strokeWidth={2} />
    </motion.span>
  )
}
