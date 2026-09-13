import { AlertTriangle, FolderCheck, FolderPlus, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  chooseFolder,
  folderAccess,
  forgetFolder,
  requestFolderAccess,
  savedFolder,
  supportsAutoBackup,
  writeBackup,
  type FolderAccess,
} from '@/lib/autobackup'
import { backupPayload } from '@/lib/backup'
import { LEARNER_VERSION, useLearner } from '@/store/learner'

/**
 * Connect a folder once; the app writes a copy there from then on.
 *
 * Every state is shown as it really is, including the two awkward ones — the
 * browser that cannot do this at all, and the folder whose permission has
 * lapsed and needs a click. Quietly showing "backups on" in either case would
 * be the one failure that matters, since the learner would stop taking manual
 * copies while nothing was being written.
 */
export function AutoBackupCard() {
  const profiles = useLearner((s) => s.profiles)
  const markBackedUp = useLearner((s) => s.markBackedUp)

  const supported = supportsAutoBackup()
  const [access, setAccess] = useState<FolderAccess>('none')
  const [folderName, setFolderName] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    const handle = await savedFolder()
    setFolderName(handle?.name ?? null)
    setAccess(await folderAccess(handle))
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  /** Write immediately on connecting, so the first copy exists right away. */
  const backupNow = async (handle: FileSystemDirectoryHandle) => {
    await writeBackup(handle, backupPayload(profiles, LEARNER_VERSION))
    markBackedUp()
  }

  const connect = async () => {
    setBusy(true)
    try {
      const handle = await chooseFolder()
      if (handle) await backupNow(handle)
    } catch {
      /* surfaced by refresh below */
    } finally {
      await refresh()
      setBusy(false)
    }
  }

  const reconnect = async () => {
    setBusy(true)
    try {
      const handle = await savedFolder()
      if (handle && (await requestFolderAccess(handle))) await backupNow(handle)
    } catch {
      /* surfaced by refresh below */
    } finally {
      await refresh()
      setBusy(false)
    }
  }

  const disconnect = async () => {
    await forgetFolder()
    await refresh()
  }

  if (!supported) {
    return (
      <div className="border-line mt-5 border-t pt-4 text-[12.5px] leading-relaxed">
        <p className="text-fg font-medium">Автоматичні копії</p>
        <p className="text-fg-subtle mt-1 text-pretty">
          Цей браузер не вміє записувати у теку на диску — так уміють лише Chrome та Edge на
          комп’ютері. Тут лишається кнопка «Експортувати» вище.
        </p>
      </div>
    )
  }

  return (
    <div className="border-line mt-5 border-t pt-4 text-[12.5px] leading-relaxed">
      <p className="text-fg font-medium">Автоматичні копії</p>

      {access === 'granted' && folderName && (
        <>
          <p className="text-success mt-1 flex items-center gap-1.5">
            <FolderCheck className="size-4 shrink-0" />
            <span>
              Увімкнено — копія зберігається у теку <strong>{folderName}</strong>, один файл на
              день.
            </span>
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <Button variant="surface" size="sm" onClick={connect} disabled={busy}>
              Змінити теку
            </Button>
            <Button variant="ghost" size="sm" onClick={disconnect} disabled={busy}>
              Вимкнути
            </Button>
          </div>
        </>
      )}

      {access === 'needs-click' && (
        <>
          <p className="text-warning mt-1 flex items-start gap-1.5 text-pretty">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              Браузер просить підтвердити доступ до теки{folderName ? ` «${folderName}»` : ''} ще
              раз. Доки не підтвердиш, копії <strong>не зберігаються</strong>.
            </span>
          </p>
          <Button className="mt-2.5" size="sm" onClick={reconnect} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null} Відновити доступ
          </Button>
        </>
      )}

      {access === 'none' && (
        <>
          <p className="text-fg-subtle mt-1 text-pretty">
            Обери теку — і Passerelle сам зберігатиме туди копію після кожного заняття. Файл
            звичайний, його можна покласти в iCloud чи Dropbox, щоб копія була ще й поза
            комп’ютером.
          </p>
          <Button className="mt-2.5" variant="surface" size="sm" onClick={connect} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <FolderPlus className="size-4" />}{' '}
            Обрати теку
          </Button>
        </>
      )}
    </div>
  )
}
