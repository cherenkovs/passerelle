/**
 * Backup — the one real risk of having no accounts.
 *
 * Progress lives in this browser's localStorage and nowhere else. Nobody can
 * read it, which is the point; but nothing restores it either. Clearing site
 * data, a cleaning app, or a new device all start from zero, and no browser
 * storage can prevent that — a site being able to make itself unremovable
 * would be a worse problem than the one it solves.
 *
 * So the defence is a file the learner keeps, and the job here is making sure
 * they are reminded to take one while there is still something to save.
 */

import type { Profile } from '@/store/learner'

export type BackupState = {
  lastBackupAt: number | null
  /** Total XP at the moment of that backup — how far the file has fallen behind. */
  lastBackupXp: number
  snoozedUntil: number | null
}

export const DAY = 24 * 60 * 60 * 1000

/**
 * How much progress a wiped browser would cost right now.
 *
 * Measured in XP rather than days because time alone is a poor signal: a month
 * away from the app has nothing at risk, while one long evening has plenty.
 */
export function unsavedXp(profiles: Profile[], state: BackupState): number {
  const total = profiles.reduce((sum, p) => sum + p.xp, 0)
  return Math.max(0, total - state.lastBackupXp)
}

/** Roughly a couple of lessons' worth — enough to be worth a file. */
export const NAG_THRESHOLD_XP = 120

export function backupDue(profiles: Profile[], state: BackupState, now = Date.now()): boolean {
  if (state.snoozedUntil && now < state.snoozedUntil) return false
  return unsavedXp(profiles, state) >= NAG_THRESHOLD_XP
}

/** Whole days since the last backup, or null if there has never been one. */
export function daysSinceBackup(state: BackupState, now = Date.now()): number | null {
  if (!state.lastBackupAt) return null
  return Math.floor((now - state.lastBackupAt) / DAY)
}

export function backupFilename(now = new Date()): string {
  return `passerelle-${now.toISOString().slice(0, 10)}.json`
}

export function backupPayload(profiles: Profile[], version: number): string {
  return JSON.stringify({ profiles, version, app: 'passerelle' }, null, 2)
}

/**
 * Hand the file to the browser's own download flow.
 *
 * Deliberately not automatic: a download needs a user gesture, and a file
 * appearing unasked would be worse manners than a reminder.
 */
export function downloadBackup(profiles: Profile[], version: number): void {
  const blob = new Blob([backupPayload(profiles, version)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = backupFilename()
  a.click()
  URL.revokeObjectURL(url)
}
