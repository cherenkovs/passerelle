/**
 * Persistent storage.
 *
 * By default a browser treats site data as expendable: under storage pressure
 * it may evict a site's localStorage without asking. Asking to be marked
 * "persistent" opts out of that automatic eviction, and on an installed PWA
 * browsers usually grant it without prompting.
 *
 * It is worth being exact about what this does *not* do. It offers no
 * protection from the learner clearing site data, from a cleaning app, or from
 * Safari's cap on script-writable storage for sites not visited in a while.
 * Nothing can: a page able to make itself unremovable would be a worse problem
 * than the one being solved. This narrows accidental loss; the exported file
 * is what actually survives.
 */

export async function requestPersistence(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) return false
  try {
    if (await navigator.storage.persisted?.()) return true
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

export type StorageStatus = {
  supported: boolean
  persisted: boolean
  usageBytes?: number
  quotaBytes?: number
}

export async function storageStatus(): Promise<StorageStatus> {
  if (typeof navigator === 'undefined' || !navigator.storage?.estimate) {
    return { supported: false, persisted: false }
  }
  try {
    const [persisted, estimate] = await Promise.all([
      navigator.storage.persisted?.() ?? Promise.resolve(false),
      navigator.storage.estimate(),
    ])
    return {
      supported: true,
      persisted,
      usageBytes: estimate.usage,
      quotaBytes: estimate.quota,
    }
  } catch {
    return { supported: false, persisted: false }
  }
}
