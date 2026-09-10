import type { RefObject } from 'react'
import { cn } from '@/lib/utils'

const ACCENTS = ['é', 'è', 'ê', 'à', 'â', 'ç', 'î', 'ï', 'ô', 'ù', 'û', 'œ', "'"]

/**
 * Ukrainian and US keyboards have no French accents, and hunting through the
 * system character picker breaks the flow of a drill. This bar inserts at the
 * caret and keeps focus in the field.
 */
export function AccentBar({
  inputRef,
  onInsert,
  className,
}: {
  inputRef: RefObject<HTMLInputElement | null>
  onInsert?: (value: string) => void
  className?: string
}) {
  const insert = (char: string) => {
    const el = inputRef.current
    if (!el) return
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    const next = el.value.slice(0, start) + char + el.value.slice(end)

    // Drive React's onChange through the native setter so state stays in sync.
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set
    setter?.call(el, next)
    el.dispatchEvent(new Event('input', { bubbles: true }))

    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + char.length, start + char.length)
    })
    onInsert?.(next)
  }

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {ACCENTS.map((char) => (
        <button
          key={char}
          type="button"
          tabIndex={-1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => insert(char)}
          className="fr border-line bg-surface text-fg-muted hover:border-primary hover:bg-primary-soft hover:text-primary-soft-fg grid h-9 min-w-9 place-items-center rounded-lg border px-2 text-[15px] transition-colors active:scale-95"
        >
          {char}
        </button>
      ))}
    </div>
  )
}
