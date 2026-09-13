/**
 * Export and import of the learner's data.
 *
 * Sync through a Google account is how progress travels between devices; this
 * is only here so the data can be taken out of the app entirely — a plain file
 * the learner owns, readable without Passerelle and restorable into it.
 */

import type { Profile } from '@/store/learner'

export function backupFilename(now = new Date()): string {
  return `passerelle-${now.toISOString().slice(0, 10)}.json`
}

export function backupPayload(profiles: Profile[], version: number): string {
  return JSON.stringify({ profiles, version, app: 'passerelle' }, null, 2)
}

export function downloadBackup(profiles: Profile[], version: number): void {
  const blob = new Blob([backupPayload(profiles, version)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = backupFilename()
  a.click()
  URL.revokeObjectURL(url)
}
