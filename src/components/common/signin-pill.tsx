import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GoogleMark } from './sync-card'
import {
  attachAfterSignIn,
  fetchRemoteProfiles,
  routeAfterSignIn,
  signIn,
  useSync,
} from '@/lib/sync'
import { useLearner } from '@/store/learner'

/**
 * A way back in for someone who is signed out.
 *
 * Sign-in lives in onboarding, which a returning learner never sees again — so
 * after signing out, or on a browser whose session has lapsed, the only route
 * back was buried in Settings. Progress made meanwhile still lives in this
 * browser, and signing in merges it rather than replacing it, so this is always
 * safe to press.
 */
export function SignInPill() {
  const status = useSync((s) => s.status)
  const navigate = useNavigate()

  if (status !== 'off' && status !== 'connecting') return null
  const busy = status === 'connecting'

  const enter = async () => {
    if (!(await signIn())) return
    const remote = await fetchRemoteProfiles()
    const { profiles, go } = routeAfterSignIn(useLearner.getState().profiles, remote)
    if (profiles.length) useLearner.setState({ profiles, activeId: profiles[0].id })
    await attachAfterSignIn()
    // A brand-new account still has to finish setup, even from here.
    if (go === 'setup') navigate('/onboarding')
  }

  return (
    <button
      type="button"
      onClick={() => void enter()}
      disabled={busy}
      title="Прогрес зберігається лише на цьому пристрої. Увійди, щоб він був скрізь."
      className="border-line bg-surface hover:bg-surface-2 text-fg-muted hover:text-fg inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors"
    >
      {busy ? <Loader2 className="size-3.5 animate-spin" /> : <GoogleMark className="size-3.5" />}
      <span className="hidden sm:inline">{busy ? 'Вхід…' : 'Увійти'}</span>
    </button>
  )
}
