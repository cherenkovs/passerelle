import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  BookMarked,
  BookText,
  BookOpen,
  Check,
  Flame,
  GraduationCap,
  MessageCircleQuestion,
  Headphones,
  Home,
  Layers,
  LineChart,
  LogOut,
  type LucideIcon,
  Menu,
  MessagesSquare,
  Notebook,
  PenLine,
  Plus,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Wordmark } from '@/components/common/misc'
import { Button } from '@/components/ui/button'
import { cn, pluralUk, todayKey } from '@/lib/utils'
import { SignInPill } from '@/components/common/signin-pill'
import { signOut, useSync } from '@/lib/sync'
import { useLearner, useActiveProfile } from '@/store/learner'
import { useSettings } from '@/store/settings'

type NavItem = { to: string; label: string; icon: LucideIcon; badge?: number }

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Навчання',
    items: [
      { to: '/', label: 'Головна', icon: Home },
      { to: '/course', label: 'Курс', icon: GraduationCap },
      { to: '/review', label: 'Повторення', icon: Layers },
      { to: '/reference', label: 'Довідник', icon: BookText },
      { to: '/professor', label: 'Професор', icon: MessageCircleQuestion },
    ],
  },
  {
    title: 'Практика',
    items: [
      { to: '/tutor', label: 'Розмова', icon: MessagesSquare },
      { to: '/library', label: 'Читання', icon: BookOpen },
      { to: '/videos', label: 'Слухання', icon: Headphones },
      { to: '/writing', label: 'Письмо', icon: PenLine },
    ],
  },
  {
    title: 'Моє',
    items: [
      { to: '/vocabulary', label: 'Словник', icon: BookMarked },
      { to: '/notebook', label: 'Зошит', icon: Notebook },
      { to: '/progress', label: 'Прогрес', icon: LineChart },
    ],
  },
]

const MOBILE_ITEMS: NavItem[] = [
  { to: '/', label: 'Головна', icon: Home },
  { to: '/course', label: 'Курс', icon: GraduationCap },
  { to: '/review', label: 'Повтор', icon: Layers },
  { to: '/professor', label: 'Професор', icon: MessageCircleQuestion },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMenuOpen(false), [location.pathname])

  return (
    <div className="grain min-h-[100dvh]">
      <div className="relative z-10 lg:grid lg:grid-cols-[264px_1fr]">
        {/* Desktop sidebar */}
        <Sidebar className="hidden lg:flex" />

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-[rgb(12_14_24/0.5)] backdrop-blur-[2px]"
              onClick={() => setMenuOpen(false)}
            />
            <Sidebar className="animate-pop absolute top-0 left-0 h-full w-[280px] shadow-[var(--shadow-pop)]">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="text-fg-subtle hover:bg-surface-2 absolute top-3 right-3 grid size-8 place-items-center rounded-lg"
                aria-label="Закрити меню"
              >
                <X className="size-4" />
              </button>
            </Sidebar>
          </div>
        )}

        <div className="flex min-h-[100dvh] flex-col">
          <TopBar onMenu={() => setMenuOpen(true)} />
          <main className="flex-1 px-4 pt-6 pb-28 sm:px-8 lg:pb-12">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Sidebar
 * ------------------------------------------------------------------ */

function Sidebar({ className, children }: { className?: string; children?: React.ReactNode }) {
  const dueCount = useLearner((s) => {
    const p = s.profiles.find((x) => x.id === s.activeId)
    if (!p) return 0
    const today = todayKey()
    return Object.values(p.srs).filter((c) => c.due <= today).length
  })

  return (
    <aside
      className={cn(
        'border-line bg-surface sticky top-0 z-40 flex h-[100dvh] flex-col border-r',
        className,
      )}
    >
      {children}

      <div className="px-5 py-6">
        <Link to="/" className="inline-block">
          <Wordmark />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {GROUPS.map((group) => (
          <div key={group.title} className="mb-6">
            <div className="text-fg-subtle mb-2 px-3 text-[11px] font-semibold tracking-wider uppercase">
              {group.title}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavItemLink
                    item={item}
                    badge={item.to === '/review' && dueCount > 0 ? dueCount : undefined}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-line border-t p-3">
        <NavItemLink item={{ to: '/settings', label: 'Налаштування', icon: Settings }} />
      </div>
    </aside>
  )
}

function NavItemLink({ item, badge }: { item: NavItem; badge?: number }) {
  const { icon: Icon, to, label } = item
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary-soft text-primary-soft-fg'
            : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
        )
      }
    >
      <Icon className="size-[18px] shrink-0" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className="bg-accent text-accent-fg grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-semibold">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  )
}

/* ------------------------------------------------------------------ *
 * Top bar
 * ------------------------------------------------------------------ */

function TopBar({ onMenu }: { onMenu: () => void }) {
  const profile = useActiveProfile()
  const dailyGoal = useSettings((s) => s.dailyGoal)
  const today = profile?.days[todayKey()]
  const todayXp = today?.xp ?? 0
  const goalPct = Math.min(100, Math.round((todayXp / Math.max(1, dailyGoal)) * 100))

  return (
    <header className="border-line bg-bg/80 sticky top-0 z-30 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-8">
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onMenu}
          aria-label="Меню"
        >
          <Menu />
        </Button>

        <Link to="/" className="lg:hidden">
          <Wordmark className="[&_span]:text-base" />
        </Link>

        <div className="flex-1" />

        {/* Daily goal */}
        <div
          className="border-line bg-surface hidden items-center gap-2 rounded-full border px-3 py-1.5 sm:flex"
          title={`Денна ціль: ${todayXp} з ${dailyGoal} XP`}
        >
          <div className="relative size-5">
            <svg viewBox="0 0 20 20" className="-rotate-90">
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                strokeWidth="3"
                className="text-surface-3"
                stroke="currentColor"
              />
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                className="text-primary transition-[stroke-dashoffset] duration-700"
                stroke="currentColor"
                strokeDasharray={50.3}
                strokeDashoffset={50.3 - (goalPct / 100) * 50.3}
              />
            </svg>
          </div>
          <span className="text-fg-muted font-mono text-[12px] font-medium tabular-nums">
            {todayXp} XP
          </span>
        </div>

        {/* Streak */}
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-3 py-1.5',
            (profile?.streakCurrent ?? 0) > 0
              ? 'border-accent/25 bg-accent-soft text-accent-soft-fg'
              : 'border-line bg-surface text-fg-subtle',
          )}
          title={`Серія: ${profile?.streakCurrent ?? 0} ${pluralUk(profile?.streakCurrent ?? 0, ['день', 'дні', 'днів'])}`}
        >
          <Flame className="size-4" />
          <span className="font-mono text-[12px] font-semibold tabular-nums">
            {profile?.streakCurrent ?? 0}
          </span>
        </div>
        <SignInPill />

        <ProfileMenu />
      </div>
    </header>
  )
}

function ProfileMenu() {
  const signedIn = useSync((s) => s.status !== 'off')
  const profiles = useLearner((s) => s.profiles)
  const activeId = useLearner((s) => s.activeId)
  const switchProfile = useLearner((s) => s.switchProfile)
  const profile = useActiveProfile()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="border-line bg-surface hover:bg-surface-2 grid size-10 shrink-0 place-items-center rounded-full border text-lg transition-colors"
          aria-label="Профіль"
        >
          {profile?.emoji ?? '🙂'}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="border-line bg-surface animate-pop z-50 w-60 rounded-xl border p-1.5 shadow-[var(--shadow-pop)]"
        >
          <div className="px-2.5 py-2">
            <div className="text-fg-subtle text-[11px] tracking-wider uppercase">Хто вчиться</div>
          </div>

          {profiles.map((p) => (
            <DropdownMenu.Item
              key={p.id}
              onSelect={() => switchProfile(p.id)}
              className="data-[highlighted]:bg-surface-2 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none"
            >
              <span className="text-base">{p.emoji}</span>
              <span className="flex-1 truncate">{p.name}</span>
              {p.id === activeId && <Check className="text-primary size-4" />}
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator className="bg-line my-1.5 h-px" />

          <DropdownMenu.Item asChild>
            <Link
              to="/onboarding?add=1"
              className="data-[highlighted]:bg-surface-2 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none"
            >
              <Plus className="size-4" /> Додати ім’я
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link
              to="/settings"
              className="data-[highlighted]:bg-surface-2 flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none"
            >
              <Settings className="size-4" /> Налаштування
            </Link>
          </DropdownMenu.Item>

          {signedIn && (
            <>
              <DropdownMenu.Separator className="bg-line my-1.5 h-px" />
              <DropdownMenu.Item
                onSelect={() => void signOut()}
                className="text-danger data-[highlighted]:bg-danger-soft flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none"
              >
                <LogOut className="size-4" /> Вийти
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

/* ------------------------------------------------------------------ *
 * Mobile bottom navigation
 * ------------------------------------------------------------------ */

function MobileNav() {
  return (
    <nav className="border-line bg-surface/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md lg:hidden">
      <ul className="safe-b mx-auto flex max-w-lg items-stretch">
        {MOBILE_ITEMS.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-fg-subtle',
                )
              }
            >
              <item.icon className="size-[21px]" />
              {item.label}
            </NavLink>
          </li>
        ))}
        <li className="flex-1">
          <NavLink
            to="/tutor"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-fg-subtle',
              )
            }
          >
            <Sparkles className="size-[21px]" />
            Розмова
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
