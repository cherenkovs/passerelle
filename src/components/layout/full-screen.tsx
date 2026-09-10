import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

/**
 * Immersive overlay for focused activities (lessons, quizzes, exams, reviews).
 * It covers the shell so nothing competes with the task at hand, while pages
 * themselves stay mounted inside normal routing.
 *
 * Rendered through a portal, and that is not cosmetic. The shell wraps its
 * content in `relative z-10`, which opens a stacking context — so `z-60` here
 * was only ever 60 *within* that context, and the mobile tab bar (z-40, a
 * sibling outside it) painted on top of the overlay. On a phone that put the
 * navigation over the bottom of every lesson: taps meant for "Перевірити"
 * landed on "Головна" and threw the learner out of the exercise.
 *
 * Escaping to `document.body` puts the overlay in the root stacking context,
 * where its z-index means what it says.
 */
export function FullScreen({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return createPortal(
    <div className={cn('bg-bg fixed inset-0 z-[60] overflow-y-auto overscroll-contain', className)}>
      <div className="flex min-h-full flex-col">{children}</div>
    </div>,
    document.body,
  )
}
