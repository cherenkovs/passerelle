import { AlertTriangle, Check, RefreshCw } from 'lucide-react'
import { attachAfterSignIn, useSync } from '@/lib/sync'
import { cn } from '@/lib/utils'

/**
 * Whether the learner's work has reached their account.
 *
 * Nothing is kept in this browser, so "is it saved?" is a fair question and the
 * app used to have no answer to it — changes went up after a short pause, in
 * silence. A toast would be the wrong shape: settings change continuously, a
 * slider drag alone would fire a stack of them, and one arriving two seconds
 * after the fact reads as unrelated to what was just done. This is a state, so
 * it gets a state: quiet, in the same place every time, readable at a glance.
 *
 * It is deliberately plain while things are fine and only becomes loud when
 * they are not — a permanent green badge trains people to stop seeing it,
 * which is exactly when it needs to be noticed.
 */
export function SyncStatus() {
  const status = useSync((s) => s.status)
  const lastSyncedAt = useSync((s) => s.lastSyncedAt)
  const error = useSync((s) => s.error)

  if (status === 'off') return null

  const time = lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString('uk-UA') : null

  if (status === 'error') {
    return (
      <button
        type="button"
        onClick={() => void attachAfterSignIn()}
        title={`Не збережено: ${error ?? ''}. Натисни, щоб спробувати ще раз.`}
        className="border-danger-border bg-danger-soft text-danger inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium"
      >
        <AlertTriangle className="size-3.5" />
        <span className="hidden sm:inline">Не збережено</span>
      </button>
    )
  }

  const saving = status === 'connecting' || status === 'syncing'

  return (
    <span
      title={
        saving
          ? 'Зберігаю в акаунт…'
          : `Збережено в акаунт${time ? ` о ${time}` : ''} — на всіх пристроях`
      }
      className={cn(
        'border-line bg-surface inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium',
        saving ? 'text-fg-muted' : 'text-fg-subtle',
      )}
    >
      {saving ? (
        <RefreshCw className="size-3.5 animate-spin" />
      ) : (
        <Check className="text-success size-3.5" />
      )}
      <span className="hidden sm:inline">{saving ? 'Зберігаю…' : 'Збережено'}</span>
    </span>
  )
}
