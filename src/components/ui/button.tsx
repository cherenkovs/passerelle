import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-[transform,background-color,box-shadow,color] duration-150 select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-fg shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_20px_-10px_var(--primary)] hover:bg-primary-hover',
        accent:
          'bg-accent text-accent-fg shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_20px_-10px_var(--accent)] hover:bg-accent-hover',
        soft: 'bg-primary-soft text-primary-soft-fg hover:brightness-[0.97] dark:hover:brightness-110',
        surface:
          'bg-surface text-fg border border-line shadow-[0_1px_2px_rgb(0_0_0/0.03)] hover:bg-surface-2',
        outline: 'border border-line-strong text-fg hover:bg-surface-2',
        ghost: 'text-fg-muted hover:bg-surface-2 hover:text-fg',
        success: 'bg-success text-white hover:brightness-105',
        danger: 'bg-danger text-white hover:brightness-105',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-[13px] [&_svg]:size-4',
        md: 'h-11 px-5 text-sm [&_svg]:size-[18px]',
        lg: 'h-13 px-7 text-base [&_svg]:size-5',
        icon: 'size-10 [&_svg]:size-[18px]',
        'icon-sm': 'size-8 rounded-lg [&_svg]:size-4',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { buttonVariants }
