import { registerSW } from 'virtual:pwa-register'

/**
 * Keep a running app on the build that is actually deployed.
 *
 * `autoUpdate` fetches the new service worker but does not hand the page over
 * to it: the old worker keeps serving until every tab for the origin has
 * closed. In a course you leave open, or a PWA pinned to a home screen, that
 * can be days — long enough for a deploy to look like it never happened.
 *
 * So: take over as soon as the new worker is ready, reload once when it does,
 * and ask periodically whether there is one, since a long-lived tab otherwise
 * never checks again after the first load.
 */
const UPDATE_CHECK_MS = 15 * 60 * 1000

export function watchForUpdates(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Guarded: controllerchange can fire more than once, and a reload loop
    // would be worse than a stale page.
    if (reloading) return
    reloading = true
    window.location.reload()
  })

  const updateSW = registerSW({
    immediate: true,
    onRegisteredSW(_url, registration) {
      if (!registration) return
      setInterval(() => void registration.update(), UPDATE_CHECK_MS)
      // And whenever the learner comes back to the tab, which is the moment
      // they are most likely to be waiting on something that just shipped.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') void registration.update()
      })
    },
    onNeedRefresh() {
      void updateSW(true)
    },
  })
}
