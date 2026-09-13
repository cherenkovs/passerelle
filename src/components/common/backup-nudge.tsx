import { Download, ShieldAlert, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { backupDue, daysSinceBackup, downloadBackup, unsavedXp } from '@/lib/backup'
import { LEARNER_VERSION, useLearner } from '@/store/learner'

/**
 * The one thing the learner has to do themselves.
 *
 * There are no accounts, so nothing restores this browser's progress if it is
 * cleared. Rather than a permanent banner nobody reads, this appears only when
 * there is real progress at stake — measured in XP earned since the last file
 * was written, because a month away from the app risks nothing while one long
 * evening risks plenty.
 */
export function BackupNudge() {
  const profiles = useLearner((s) => s.profiles)
  const lastBackupAt = useLearner((s) => s.lastBackupAt)
  const lastBackupXp = useLearner((s) => s.lastBackupXp)
  const snoozedUntil = useLearner((s) => s.backupSnoozedUntil)
  const markBackedUp = useLearner((s) => s.markBackedUp)
  const snoozeBackup = useLearner((s) => s.snoozeBackup)

  const state = { lastBackupAt, lastBackupXp, snoozedUntil }
  if (!backupDue(profiles, state)) return null

  const xp = unsavedXp(profiles, state)
  const days = daysSinceBackup(state)

  return (
    <div className="border-warning/35 bg-warning-soft rounded-2xl border p-4 sm:p-5">
      <div className="flex items-start gap-3.5">
        <span className="text-warning mt-0.5 shrink-0">
          <ShieldAlert className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-fg text-[15px] font-semibold">Збережи свій прогрес</h2>
          <p className="text-fg-muted mt-1 text-[13.5px] leading-snug text-pretty">
            Passerelle не має акаунтів — усе зберігається лише в цьому браузері. Ніхто твоїх даних
            не бачить, але й ніхто їх не відновить: якщо очистити браузер, прогрес зникне.{' '}
            <strong className="text-fg font-medium">
              Незбережено: {xp} XP
              {days === null
                ? ', копії ще не було'
                : days === 0
                  ? ''
                  : `, остання копія ${days} дн. тому`}
              .
            </strong>
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                downloadBackup(profiles, LEARNER_VERSION)
                markBackedUp()
              }}
            >
              <Download className="size-4" /> Завантажити копію
            </Button>
            <Button variant="ghost" size="sm" onClick={snoozeBackup}>
              Пізніше
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={snoozeBackup}
          aria-label="Нагадати пізніше"
          className="text-fg-subtle hover:text-fg -mt-1 -mr-1 shrink-0 rounded-lg p-1.5 transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
