import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'border-line bg-surface text-fg h-11 w-full rounded-xl border px-4 text-sm',
        'placeholder:text-fg-subtle',
        'transition-[border-color,box-shadow] outline-none',
        'focus:border-primary focus:ring-primary/12 focus:ring-4',
        'disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'border-line bg-surface text-fg w-full rounded-xl border px-4 py-3 text-sm',
        'placeholder:text-fg-subtle resize-y',
        'transition-[border-color,box-shadow] outline-none',
        'focus:border-primary focus:ring-primary/12 focus:ring-4',
        className,
      )}
      {...props}
    />
  )
}

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return <label className={cn('text-fg-muted text-[13px] font-medium', className)} {...props} />
}
