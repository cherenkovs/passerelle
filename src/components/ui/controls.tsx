import * as SelectPrimitive from '@radix-ui/react-select'
import * as SliderPrimitive from '@radix-ui/react-slider'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { Check, ChevronDown } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* ------------------------------- Switch ------------------------------- */

export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-surface-3',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block size-5 rounded-full bg-white shadow-md ring-0 transition-transform',
          'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
        )}
      />
    </SwitchPrimitive.Root>
  )
}

/* ------------------------------- Slider ------------------------------- */

export function Slider({ className, ...props }: ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn('relative flex w-full touch-none items-center select-none', className)}
      {...props}
    >
      <SliderPrimitive.Track className="bg-surface-3 relative h-1.5 w-full grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="border-primary bg-surface block size-5 rounded-full border-2 shadow-md transition-transform hover:scale-110 focus-visible:outline-none" />
    </SliderPrimitive.Root>
  )
}

/* ------------------------------- Select ------------------------------- */

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'border-line bg-surface flex h-11 w-full items-center justify-between gap-2 rounded-xl border px-4 text-sm',
        'focus:border-primary focus:ring-primary/12 transition-[border-color,box-shadow] outline-none focus:ring-4',
        'data-[placeholder]:text-fg-subtle',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="text-fg-subtle size-4 shrink-0" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export function SelectContent({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={6}
        className={cn(
          'border-line bg-surface z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border p-1 shadow-[var(--shadow-pop)]',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'relative flex cursor-pointer items-center gap-2 rounded-lg py-2 pr-8 pl-3 text-sm outline-none select-none',
        'data-[highlighted]:bg-surface-2 data-[state=checked]:font-medium',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2">
        <Check className="text-primary size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

/* ------------------------- Settings row helper ------------------------- */

export function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: ReactNode
}) {
  return (
    // Wrapping, so a control too wide for the space left beside its label —
    // the voice picker on a phone — drops under it instead of pushing the
    // page sideways. A switch still sits on the label's line.
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
      <div className="min-w-0 flex-1 basis-48">
        <div className="text-fg text-sm font-medium">{label}</div>
        {description && (
          <div className="text-fg-muted mt-0.5 text-[13px] text-pretty">{description}</div>
        )}
      </div>
      <div className="max-w-full shrink-0">{children}</div>
    </div>
  )
}
