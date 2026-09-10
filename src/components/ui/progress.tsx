import { cn } from '@/lib/utils'

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number
  className?: string
  barClassName?: string
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn('bg-surface-3 h-2 w-full overflow-hidden rounded-full', className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          'bg-primary h-full rounded-full transition-[width] duration-500 ease-out',
          barClassName,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/** Circular goal indicator used on the dashboard. */
export function RingProgress({
  value,
  size = 132,
  stroke = 11,
  children,
  className,
  trackClassName = 'text-surface-3',
  barClassName = 'text-primary',
}: {
  value: number
  size?: number
  stroke?: number
  children?: React.ReactNode
  className?: string
  trackClassName?: string
  barClassName?: string
}) {
  const pct = Math.max(0, Math.min(100, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r

  return (
    <div
      className={cn('relative inline-grid place-items-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className={trackClassName}
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={cn('transition-[stroke-dashoffset] duration-700 ease-out', barClassName)}
          stroke="currentColor"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}
