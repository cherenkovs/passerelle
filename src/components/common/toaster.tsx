import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Info, X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { toastLife, useToasts, type Toast } from '@/store/toasts'

const TONE = {
  ok: { icon: Check, ring: 'border-success-border', accent: 'text-success' },
  error: { icon: AlertTriangle, ring: 'border-danger-border', accent: 'text-danger' },
  info: { icon: Info, ring: 'border-line', accent: 'text-fg-muted' },
} as const

function ToastCard({ toast, depth }: { toast: Toast; depth: number }) {
  const dismiss = useToasts((s) => s.dismiss)
  const { icon: Icon, ring, accent } = TONE[toast.tone]

  useEffect(() => {
    // An error waits for the learner rather than timing out: it is the one
    // kind worth reading in full, and the one they may want to act on.
    if (toast.tone === 'error') return
    const t = setTimeout(() => dismiss(toast.id), toastLife(depth))
    return () => clearTimeout(t)
  }, [toast.id, toast.tone, depth, dismiss])

  return (
    <motion.li
      // layout is what makes the stack settle downwards when one leaves,
      // rather than the rest jumping into the gap.
      layout
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      className={cn(
        'bg-surface pointer-events-auto flex w-[min(22rem,calc(100vw-2rem))] items-start gap-2.5 rounded-2xl border p-3.5 shadow-[var(--shadow-card)]',
        ring,
      )}
    >
      <Icon className={cn('mt-0.5 size-4 shrink-0', accent)} />

      <div className="min-w-0 flex-1">
        <div className="text-fg text-[13.5px] leading-snug font-medium">{toast.title}</div>
        {toast.description && (
          <div className="text-fg-muted mt-0.5 text-[12.5px] leading-snug text-pretty">
            {toast.description}
          </div>
        )}
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              toast.action?.run()
              dismiss(toast.id)
            }}
            className="text-primary mt-1.5 text-[12.5px] font-medium underline underline-offset-4"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Закрити"
        className="text-fg-subtle hover:text-fg -mt-0.5 -mr-0.5 shrink-0 rounded-lg p-1 transition-colors"
      >
        <X className="size-3.5" />
      </button>
    </motion.li>
  )
}

/**
 * The toast stack.
 *
 * Portalled to the body: the app shell sets up stacking contexts of its own,
 * and anything rendered inside one of those is trapped behind the mobile tab
 * bar however high its z-index goes.
 *
 * Sits above that bar on a phone and out of the way of it on a desktop. The
 * list itself ignores pointer events so it never swallows a tap meant for the
 * page underneath; only the cards themselves take clicks.
 */
export function Toaster() {
  const toasts = useToasts((s) => s.toasts)
  if (typeof document === 'undefined') return null

  return createPortal(
    <ul className="pointer-events-none fixed right-4 bottom-20 z-[100] flex flex-col items-end gap-2 sm:right-6 sm:bottom-6">
      <AnimatePresence initial={false} mode="popLayout">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} depth={toasts.length} />
        ))}
      </AnimatePresence>
    </ul>,
    document.body,
  )
}
