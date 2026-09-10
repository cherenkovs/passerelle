import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const TooltipProvider = TooltipPrimitive.Provider

export function Tooltip({
  content,
  children,
  side = 'top',
  className,
  ...props
}: {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
} & Omit<ComponentProps<typeof TooltipPrimitive.Root>, 'children'>) {
  if (!content) return <>{children}</>
  return (
    <TooltipPrimitive.Root {...props}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className={cn(
            'z-50 max-w-[280px] rounded-lg bg-[var(--fg)] px-2.5 py-1.5 text-xs leading-relaxed text-[var(--bg)] shadow-lg',
            'data-[state=delayed-open]:animate-pop',
            className,
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-[var(--fg)]" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
