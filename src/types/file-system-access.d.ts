/**
 * The parts of the File System Access API that TypeScript's DOM library does
 * not describe yet.
 *
 * `FileSystemDirectoryHandle` itself is standard and already typed; the
 * directory picker and the per-handle permission methods are not, so they are
 * declared here rather than reached through `any` at each call site — the point
 * of declaring them is that a typo still fails the build.
 */

type FileSystemPermissionMode = 'read' | 'readwrite'

interface FileSystemHandlePermissionDescriptor {
  mode?: FileSystemPermissionMode
}

interface FileSystemDirectoryHandle {
  queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>
  requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>
}

interface DirectoryPickerOptions {
  /** Lets the browser reopen the picker where this app left it. */
  id?: string
  mode?: FileSystemPermissionMode
  startIn?:
    FileSystemHandle | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos'
}

interface Window {
  showDirectoryPicker(options?: DirectoryPickerOptions): Promise<FileSystemDirectoryHandle>
}
