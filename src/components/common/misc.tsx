import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** The mark: a circumflex — the accent that literally looks like a small bridge. */
export function Logo({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <path
        d="M8 19.5 L16 11 L24 19.5"
        stroke="var(--primary-fg)"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="24" r="1.6" fill="var(--primary-fg)" opacity=".65" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <Logo />
      <span className="font-display text-fg text-[19px] font-semibold tracking-tight">
        Passerelle
      </span>
    </span>
  )
}

export function PageHeader({
  title,
  description,
  action,
  eyebrow,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  eyebrow?: ReactNode
  className?: string
}) {
  return (
    <header className={cn('mb-8 flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-accent mb-2 text-[13px] font-medium tracking-wide uppercase">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="text-fg-muted mt-2 max-w-2xl text-[15px] leading-relaxed text-pretty">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'border-line-strong flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center',
        className,
      )}
    >
      {Icon && (
        <div className="bg-surface-2 text-fg-subtle mb-4 grid size-14 place-items-center rounded-2xl">
          <Icon className="size-6" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-fg-muted mt-1.5 max-w-sm text-sm leading-relaxed text-pretty">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'default',
  className,
}: {
  icon?: LucideIcon
  label: string
  value: ReactNode
  hint?: string
  tone?: 'default' | 'primary' | 'accent' | 'success'
  className?: string
}) {
  const tones = {
    default: 'bg-surface-2 text-fg-muted',
    primary: 'bg-primary-soft text-primary-soft-fg',
    accent: 'bg-accent-soft text-accent-soft-fg',
    success: 'bg-success-soft text-success',
  }
  return (
    <div
      className={cn(
        'border-line bg-surface rounded-2xl border p-5 shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className={cn('grid size-8 place-items-center rounded-lg', tones[tone])}>
            <Icon className="size-4" />
          </span>
        )}
        <span className="text-fg-muted text-[13px] font-medium">{label}</span>
      </div>
      <div className="font-display mt-3 text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </div>
      {hint && <div className="text-fg-subtle mt-1 text-[12px]">{hint}</div>}
    </div>
  )
}

export function SectionTitle({
  children,
  action,
  className,
}: {
  children: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-4 flex items-center justify-between gap-4', className)}>
      <h2 className="font-display text-xl font-semibold tracking-tight">{children}</h2>
      {action}
    </div>
  )
}

/** CEFR level chip with a consistent colour per level. */
export function LevelChip({ level, className }: { level: string; className?: string }) {
  const map: Record<string, string> = {
    A0: 'bg-surface-3 text-fg-muted',
    A1: 'bg-success-soft text-success',
    A2: 'bg-primary-soft text-primary-soft-fg',
    B1: 'bg-accent-soft text-accent-soft-fg',
    B2: 'bg-warning-soft text-warning',
  }
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full px-2.5 font-mono text-[11px] font-semibold tracking-wide',
        map[level] ?? map.A1,
        className,
      )}
    >
      {level}
    </span>
  )
}
