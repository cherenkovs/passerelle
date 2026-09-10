import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap [&_svg]:size-3.5',
  {
    variants: {
      variant: {
        default: 'bg-surface-2 text-fg-muted border border-line',
        primary: 'bg-primary-soft text-primary-soft-fg',
        accent: 'bg-accent-soft text-accent-soft-fg',
        success: 'bg-success-soft text-success border border-success-border',
        danger: 'bg-danger-soft text-danger border border-danger-border',
        warning: 'bg-warning-soft text-warning',
        outline: 'border border-line-strong text-fg-muted',
      },
      size: {
        sm: 'h-5 px-2 text-[11px]',
        md: 'h-6 px-2.5 text-xs',
        lg: 'h-7 px-3 text-[13px]',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
)

export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}
