/**
 * Automatic backups into a real folder on the learner's machine.
 *
 * The File System Access API lets the learner grant this origin write access
 * to one directory they choose. The handle survives in IndexedDB, so after a
 * single "pick a folder" the app can keep writing there on its own — an actual
 * backup habit rather than a reminder to have one.
 *
 * Support is the catch, and it is worth being blunt about: this is Chromium
 * desktop only. Safari and Firefox have not implemented directory pickers, and
 * every iOS browser is WebKit underneath, so a phone will never have it. The
 * export button and the reminder stay for everyone else, which is why they are
 * not built on top of this.
 */

const DB_NAME = 'passerelle-fs'
const STORE = 'handles'
const HANDLE_KEY = 'backup-dir'

/** One file per day of use: a usable history, without a directory of hundreds. */
export function autoBackupFilename(now = new Date()): string {
  return `passerelle-${now.toISOString().slice(0, 10)}.json`
}

export function supportsAutoBackup(): boolean {
  return typeof window !== 'undefined' && typeof window.showDirectoryPicker === 'function'
}

/* ------------------------------------------------------------------ *
 * Remembering the folder
 *
 * A directory handle is structured-cloneable, so IndexedDB can hold it —
 * localStorage cannot, since it only stores strings.
 * ------------------------------------------------------------------ */

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const request = run(db.transaction(STORE, mode).objectStore(STORE))
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      }),
  )
}

export async function savedFolder(): Promise<FileSystemDirectoryHandle | null> {
  if (!supportsAutoBackup()) return null
  try {
    return (await tx('readonly', (s) => s.get(HANDLE_KEY))) ?? null
  } catch {
    return null
  }
}

async function rememberFolder(handle: FileSystemDirectoryHandle): Promise<void> {
  await tx('readwrite', (s) => s.put(handle, HANDLE_KEY))
}

export async function forgetFolder(): Promise<void> {
  try {
    await tx('readwrite', (s) => s.delete(HANDLE_KEY))
  } catch {
    /* nothing stored */
  }
}

/* ------------------------------------------------------------------ *
 * Permission
 * ------------------------------------------------------------------ */

export type FolderAccess = 'granted' | 'needs-click' | 'none'

/**
 * Whether we may write without interrupting the learner.
 *
 * Chrome can return "prompt" at the start of a new session even for a folder
 * already chosen, and re-granting needs a user gesture — so a silent attempt
 * would simply fail. That case is reported as `needs-click` rather than hidden,
 * because a backup the learner believes is running and is not would be worse
 * than no backup at all.
 */
export async function folderAccess(
  handle: FileSystemDirectoryHandle | null,
): Promise<FolderAccess> {
  if (!handle) return 'none'
  try {
    const state = await handle.queryPermission({ mode: 'readwrite' })
    return state === 'granted' ? 'granted' : 'needs-click'
  } catch {
    return 'none'
  }
}

/** Must be called from a user gesture. */
export async function requestFolderAccess(handle: FileSystemDirectoryHandle): Promise<boolean> {
  try {
    return (await handle.requestPermission({ mode: 'readwrite' })) === 'granted'
  } catch {
    return false
  }
}

/** Must be called from a user gesture. Returns null if the learner cancels. */
export async function chooseFolder(): Promise<FileSystemDirectoryHandle | null> {
  if (!supportsAutoBackup()) return null
  try {
    const handle = await window.showDirectoryPicker({ id: 'passerelle-backup', mode: 'readwrite' })
    await rememberFolder(handle)
    return handle
  } catch {
    // The learner dismissed the picker; not an error worth reporting.
    return null
  }
}

/* ------------------------------------------------------------------ *
 * Writing
 * ------------------------------------------------------------------ */

export async function writeBackup(
  handle: FileSystemDirectoryHandle,
  contents: string,
  filename = autoBackupFilename(),
): Promise<void> {
  const file = await handle.getFileHandle(filename, { create: true })
  const writable = await file.createWritable()
  try {
    await writable.write(contents)
  } finally {
    // Without the close the data never reaches disk, and a throw mid-write
    // would otherwise leave the file truncated to nothing.
    await writable.close()
  }
}
