import { describe, expect, it } from 'vitest'
import type { Profile } from '@/store/learner'
import {
  backupDue,
  backupFilename,
  backupPayload,
  DAY,
  daysSinceBackup,
  NAG_THRESHOLD_XP,
  unsavedXp,
} from './backup'

/**
 * A reminder nobody can dismiss for good is nagware, and one that never fires
 * is decoration. These pin down exactly when it speaks up.
 */

function learner(xp: number): Profile {
  return { xp } as Profile
}

const fresh = { lastBackupAt: null, lastBackupXp: 0, snoozedUntil: null }

describe('how much a wiped browser would cost', () => {
  it('counts every profile, not just the active one', () => {
    expect(unsavedXp([learner(300), learner(120)], fresh)).toBe(420)
  })

  it('counts only what the last file does not already cover', () => {
    const state = { lastBackupAt: Date.now(), lastBackupXp: 400, snoozedUntil: null }
    expect(unsavedXp([learner(450)], state)).toBe(50)
  })

  it('never goes negative when a profile is deleted after a backup', () => {
    const state = { lastBackupAt: Date.now(), lastBackupXp: 900, snoozedUntil: null }
    expect(unsavedXp([learner(100)], state)).toBe(0)
  })
})

describe('when the reminder appears', () => {
  it('stays quiet for a learner who has barely started', () => {
    expect(backupDue([learner(40)], fresh)).toBe(false)
  })

  it('speaks up once there is real progress at stake', () => {
    expect(backupDue([learner(NAG_THRESHOLD_XP)], fresh)).toBe(true)
  })

  it('goes quiet again after a file is written', () => {
    const after = { lastBackupAt: Date.now(), lastBackupXp: 500, snoozedUntil: null }
    expect(backupDue([learner(500)], after)).toBe(false)
  })

  it('does not return the moment the app reloads — "later" means later', () => {
    const now = Date.now()
    const snoozed = { ...fresh, snoozedUntil: now + 3 * DAY }
    expect(backupDue([learner(5000)], snoozed, now)).toBe(false)
    expect(backupDue([learner(5000)], snoozed, now + 4 * DAY)).toBe(true)
  })

  it('is driven by progress rather than the calendar', () => {
    // A month away from the app risks nothing; the reminder should not fire
    // just because time passed.
    const old = { lastBackupAt: Date.now() - 60 * DAY, lastBackupXp: 800, snoozedUntil: null }
    expect(backupDue([learner(800)], old)).toBe(false)
  })
})

describe('reporting the age of the last backup', () => {
  it('says nothing rather than zero when there has never been one', () => {
    expect(daysSinceBackup(fresh)).toBeNull()
  })

  it('counts whole days', () => {
    const now = Date.now()
    expect(daysSinceBackup({ ...fresh, lastBackupAt: now - 3.5 * DAY }, now)).toBe(3)
  })
})

describe('the file itself', () => {
  it('is named by date so successive backups sort and do not overwrite', () => {
    expect(backupFilename(new Date('2026-09-13T20:00:00Z'))).toBe('passerelle-2026-09-13.json')
  })

  it('carries the schema version, so a restore can migrate rather than guess', () => {
    const parsed = JSON.parse(backupPayload([learner(10)], 4))
    expect(parsed.version).toBe(4)
    expect(parsed.app).toBe('passerelle')
    expect(parsed.profiles).toHaveLength(1)
  })
})
