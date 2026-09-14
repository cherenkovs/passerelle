import { create } from 'zustand'
import { uid } from '@/lib/utils'

export type ToastTone = 'ok' | 'error' | 'info'

export type Toast = {
  id: string
  /** Groups repeats of the same event, independently of how it is worded. */
  key?: string
  title: string
  description?: string
  tone: ToastTone
  /** Set when the toast offers a way to undo or retry what it reports. */
  action?: { label: string; run: () => void }
}

/**
 * How many are on screen at once.
 *
 * Four is about the limit of what reads as a list rather than a wall. Past it
 * the oldest goes immediately, so the newest — the one describing what just
 * happened — is never the one pushed off.
 */
const MAX_VISIBLE = 4

/**
 * How long one stays.
 *
 * Shorter when the stack is deep: several at once means things are happening
 * quickly, and holding each for the full time would leave a backlog reporting
 * events the learner has already moved past.
 */
export function toastLife(stackSize: number): number {
  return Math.max(2200, 4200 - (stackSize - 1) * 650)
}

type ToastState = {
  toasts: Toast[]
  push: (t: Omit<Toast, 'id'>) => string
  dismiss: (id: string) => void
  clear: () => void
}

export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => {
    const id = uid('t')
    set((s) => ({ toasts: [...s.toasts, { ...t, id }].slice(-MAX_VISIBLE) }))
    return id
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}))

/**
 * Raise a toast from anywhere, including outside React.
 *
 * Most of what is worth reporting happens in the sync layer — a write landing,
 * a write failing — which is plain TypeScript with no component around it.
 */
export function toast(t: Omit<Toast, 'id'>): string {
  return useToasts.getState().push(t)
}

/**
 * Report the same thing only once while it is still on screen.
 *
 * Progress saves after every exercise, so a lesson would otherwise produce a
 * column of identical "Збережено" notes. This keeps the most recent one and
 * lets its timer start again.
 */
export function toastOnce(key: string, t: Omit<Toast, 'id' | 'key'>): void {
  const { toasts, dismiss, push } = useToasts.getState()
  // Matched on the key, not the wording: the same event can be phrased
  // differently — "Прогрес збережено" and "Налаштування збережено" are both
  // one save — and matching on text would stack them.
  const existing = toasts.find((x) => x.key === key)
  if (existing) dismiss(existing.id)
  push({ ...t, key })
}
