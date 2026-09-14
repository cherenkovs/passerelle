import { AlertTriangle, Check, Loader2, LogOut, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { attachAfterSignIn, signIn, signOut, useSync } from '@/lib/sync'

/** Google's mark, so the button looks like every other Google sign-in. */
export function GoogleMark({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} shrink-0`} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  )
}

/**
 * Sign in with Google, and the profile follows you between devices.
 *
 * The status line says what is actually true at each moment rather than a
 * permanent "synced" badge: a learner who believes their progress is safe on
 * both devices, and is wrong, loses work while being reassured.
 */
export function SyncCard() {
  const status = useSync((s) => s.status)
  const email = useSync((s) => s.email)
  const error = useSync((s) => s.error)
  const lastSyncedAt = useSync((s) => s.lastSyncedAt)

  const busy = status === 'connecting' || status === 'syncing'

  return (
    <div className="text-[13px] leading-relaxed">
      <p className="text-fg text-[14px] font-semibold">Синхронізація між пристроями</p>

      {status === 'off' && (
        <>
          <p className="text-fg-subtle mt-1 text-pretty">
            Увійди через Google — і той самий прогрес буде на комп’ютері й на телефоні. Почни урок
            тут, продовжуй у дорозі.
          </p>
          <Button
            className="mt-2.5"
            variant="surface"
            size="sm"
            onClick={async () => {
              await signIn()
              await attachAfterSignIn()
            }}
          >
            <GoogleMark /> Увійти через Google
          </Button>
        </>
      )}

      {busy && (
        <p className="text-fg-muted mt-1 flex items-center gap-1.5">
          <Loader2 className="size-4 shrink-0 animate-spin" />
          {status === 'connecting' ? 'Вхід…' : 'Синхронізую…'}
        </p>
      )}

      {status === 'synced' && (
        <>
          <p className="text-success mt-1 flex items-start gap-1.5">
            <Check className="mt-0.5 size-4 shrink-0" />
            <span>
              Синхронізовано{email ? ` · ${email}` : ''}
              {lastSyncedAt ? ` · ${new Date(lastSyncedAt).toLocaleTimeString('uk-UA')}` : ''}
            </span>
          </p>
          <Button className="mt-2.5" variant="ghost" size="sm" onClick={() => void signOut()}>
            <LogOut className="size-4" /> Вийти з акаунта
          </Button>
        </>
      )}

      {status === 'error' && (
        <>
          <p className="text-danger mt-1 flex items-start gap-1.5 text-pretty">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              Не синхронізується: {error}. Не закривай вкладку — прогрес цього заняття ще не
              збережений в акаунті, а в браузері він не зберігається.
            </span>
          </p>
          <Button
            className="mt-2.5"
            variant="surface"
            size="sm"
            onClick={() => void attachAfterSignIn()}
          >
            <RefreshCw className="size-4" /> Спробувати ще раз
          </Button>
        </>
      )}
    </div>
  )
}
