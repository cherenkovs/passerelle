import { afterEach, describe, expect, it, vi } from 'vitest'
import { autoBackupFilename, folderAccess, supportsAutoBackup, writeBackup } from './autobackup'

/**
 * The dangerous failure here is a silent one: the learner believes copies are
 * being written, stops taking them by hand, and finds out otherwise only when
 * the browser has been cleared. So the permission states and the write path
 * are pinned down rather than assumed.
 */

type Written = { data: string; closed: boolean }

function fakeFolder(opts: { permission?: PermissionState; failWrite?: boolean } = {}) {
  const files = new Map<string, Written>()
  const handle = {
    name: 'Passerelle',
    queryPermission: vi.fn(async () => opts.permission ?? 'granted'),
    requestPermission: vi.fn(async () => opts.permission ?? 'granted'),
    getFileHandle: vi.fn(async (filename: string, o?: { create?: boolean }) => {
      if (!files.has(filename) && !o?.create) throw new Error('not found')
      const record: Written = files.get(filename) ?? { data: '', closed: false }
      files.set(filename, record)
      return {
        createWritable: async () => ({
          write: async (chunk: string) => {
            if (opts.failWrite) throw new Error('disk full')
            record.data = chunk
          },
          close: async () => {
            record.closed = true
          },
        }),
      }
    }),
  }
  return { handle: handle as unknown as FileSystemDirectoryHandle, files }
}

afterEach(() => vi.unstubAllGlobals())

describe('feature detection', () => {
  it('is false where the browser has no directory picker', () => {
    vi.stubGlobal('window', {})
    expect(supportsAutoBackup()).toBe(false)
  })

  it('is true only when the picker is actually callable', () => {
    vi.stubGlobal('window', { showDirectoryPicker: () => {} })
    expect(supportsAutoBackup()).toBe(true)
  })
})

describe('permission, reported honestly', () => {
  it('is granted when the browser says so', async () => {
    const { handle } = fakeFolder({ permission: 'granted' })
    expect(await folderAccess(handle)).toBe('granted')
  })

  it('needs a click when the browser will prompt — never treated as granted', async () => {
    const { handle } = fakeFolder({ permission: 'prompt' })
    expect(await folderAccess(handle)).toBe('needs-click')
  })

  it('needs a click when access was denied, rather than reporting none', async () => {
    const { handle } = fakeFolder({ permission: 'denied' })
    expect(await folderAccess(handle)).toBe('needs-click')
  })

  it('is none when no folder has been chosen', async () => {
    expect(await folderAccess(null)).toBe('none')
  })

  it('is none when querying throws, instead of rejecting', async () => {
    const handle = {
      queryPermission: async () => {
        throw new Error('handle is stale')
      },
    } as unknown as FileSystemDirectoryHandle
    expect(await folderAccess(handle)).toBe('none')
  })
})

describe('writing the file', () => {
  it('creates the file and closes it, or nothing reaches the disk', async () => {
    const { handle, files } = fakeFolder()
    await writeBackup(handle, '{"a":1}', 'passerelle-2026-09-13.json')
    const written = files.get('passerelle-2026-09-13.json')
    expect(written?.data).toBe('{"a":1}')
    expect(written?.closed).toBe(true)
  })

  it('still closes the file when the write throws', async () => {
    const { handle, files } = fakeFolder({ failWrite: true })
    await expect(writeBackup(handle, 'x', 'f.json')).rejects.toThrow('disk full')
    // A left-open writable would leave a zero-length file where a backup
    // should be — worse than not having written at all.
    expect(files.get('f.json')?.closed).toBe(true)
  })

  it('writes one file per day, so a day of study does not bury the folder', () => {
    expect(autoBackupFilename(new Date('2026-09-13T09:00:00Z'))).toBe('passerelle-2026-09-13.json')
    expect(autoBackupFilename(new Date('2026-09-13T23:30:00Z'))).toBe('passerelle-2026-09-13.json')
    expect(autoBackupFilename(new Date('2026-09-14T00:30:00Z'))).toBe('passerelle-2026-09-14.json')
  })
})
