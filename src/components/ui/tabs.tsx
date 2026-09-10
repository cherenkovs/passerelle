import * as TabsPrimitive from '@radix-ui/react-tabs'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'border-line bg-surface-2 inline-flex items-center gap-1 rounded-xl border p-1',
        // A segmented control must not wrap — on a narrow phone it scrolls
        // instead, which is why the tab strip used to push the whole page
        // sideways by the width of its last tab.
        'max-w-full [scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden',
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'text-fg-muted inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-all sm:px-4',
        'hover:text-fg',
        'data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-[0_1px_3px_rgb(0_0_0/0.08)]',
        '[&_svg]:size-4',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('mt-6 outline-none', className)} {...props} />
}
