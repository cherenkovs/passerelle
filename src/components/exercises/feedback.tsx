import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Lightbulb, XCircle } from 'lucide-react'
import { SpeakInline } from '@/components/common/rich-text'
import { SpeakButton } from '@/components/common/speak'
import { frenchIn } from '@/lib/speech'
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
  className,
}: {
  outcome: Outcome | null
  explain?: string
  className?: string
}) {
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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
