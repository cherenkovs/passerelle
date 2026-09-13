import { useEffect, useRef } from 'react'
import { backupPayload, unsavedXp } from './backup'
import { folderAccess, savedFolder, writeBackup } from './autobackup'
import { LEARNER_VERSION, useLearner } from '@/store/learner'

/** Long enough that a lesson's worth of XP ticks becomes one write. */
const QUIET_MS = 8000

/**
 * Write a backup whenever progress has moved on, once a folder is connected.
 *
 * Subscribes to the store rather than polling: the interesting moment is a
 * change, and between changes there is nothing to save. Writes are debounced,
 * because XP arrives a few points at a time and a file per exercise would be
 * pointless churn on the learner's disk.
 */
export function useAutoBackup() {
  const markBackedUp = useLearner((s) => s.markBackedUp)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const writing = useRef(false)

  useEffect(() => {
    const flush = async () => {
      // A second write starting while the first is still open would race for
      // the same file handle.
      if (writing.current) return

      const state = useLearner.getState()
      const pending = unsavedXp(state.profiles, {
        lastBackupAt: state.lastBackupAt,
        lastBackupXp: state.lastBackupXp,
        snoozedUntil: null,
      })
      if (pending <= 0) return

      const handle = await savedFolder()
      // Only ever writes silently when permission is already granted. If it
      // has lapsed, this does nothing and Settings shows the reconnect button
      // — re-granting needs a click, and failing quietly here would leave the
      // learner believing backups were running when they had stopped.
      if (!handle || (await folderAccess(handle)) !== 'granted') return

      writing.current = true
      try {
        await writeBackup(handle, backupPayload(state.profiles, LEARNER_VERSION))
        markBackedUp()
      } catch {
        // Folder moved, deleted, or permission revoked mid-session. Settings
        // reports the real state on its next check; the reminder reappears on
        // its own because markBackedUp never ran.
      } finally {
        writing.current = false
      }
    }

    const unsubscribe = useLearner.subscribe(() => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => void flush(), QUIET_MS)
    })

    // Catch up on anything earned before this mount — most often progress from
    // a session that ended before the debounce fired.
    void flush()

    return () => {
      if (timer.current) clearTimeout(timer.current)
      unsubscribe()
    }
  }, [markBackedUp])
}
