import {
  ArrowRight,
  BookOpen,
  Flame,
  Headphones,
  Layers,
  MessagesSquare,
  Play,
  Target,
  Trophy,
} from 'lucide-react'
import { BackupNudge } from '@/components/common/backup-nudge'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SpeakButton } from '@/components/common/speak'
import { LevelChip, SectionTitle, StatTile } from '@/components/common/misc'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress, RingProgress } from '@/components/ui/progress'
import { WORDS, getCourse } from '@/content'
import { accuracy, courseProgress, nextUp, wordsKnown } from '@/lib/progress'
import { cn, pluralUk, todayKey } from '@/lib/utils'
import { useActiveProfile } from '@/store/learner'
import { useSettings } from '@/store/settings'

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Доброї ночі'
  if (h < 12) return 'Доброго ранку'
  if (h < 18) return 'Доброго дня'
  return 'Доброго вечора'
}

/** Deterministic word of the day so it stays stable until midnight. */
function wordOfDay() {
  const key = todayKey()
  const seed = [...key].reduce((n, c) => n + c.charCodeAt(0), 0)
  return WORDS[seed % WORDS.length]
}

export function Dashboard() {
  const navigate = useNavigate()
  const profile = useActiveProfile()
  const dailyGoal = useSettings((s) => s.dailyGoal)
  // Derive from the profile rather than selecting an array out of the store: a
  // selector that builds a new array every render makes useSyncExternalStore loop.
  const dueCount = useMemo(() => {
    if (!profile) return 0
    const today = todayKey()
    return Object.values(profile.srs).filter((c) => c.due <= today).length
  }, [profile])

  const course = getCourse(profile?.courseId ?? 'a0-a1')
  if (!profile || !course) return null

  const next = nextUp(profile, course)
  const progress = courseProgress(profile, course)
  const today = profile.days[todayKey()]
  const todayXp = today?.xp ?? 0
  const goalPct = Math.min(100, (todayXp / Math.max(1, dailyGoal)) * 100)
  const wod = wordOfDay()

  const continueTo =
    next?.type === 'lesson'
      ? `/lesson/${next.lesson.id}`
      : next?.type === 'quiz'
        ? `/quiz/${next.module.id}`
        : next?.type === 'exam'
          ? `/exam/${course.id}`
          : '/review'

  return (
    <div className="space-y-10">
      <BackupNudge />

      {/* Hero */}
      <section>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-accent text-[13px] font-medium tracking-wide uppercase">
            {greeting()}, {profile.name}
          </span>
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {goalPct >= 100
            ? 'Денну ціль виконано 🎉'
            : todayXp > 0
              ? 'Продовжимо?'
              : 'Готовий до сьогоднішнього уроку?'}
        </h1>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Continue card */}
        <Card className="relative overflow-hidden p-6 sm:p-7">
          <div
            className="pointer-events-none absolute -top-16 -right-16 size-52 rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, var(--primary), transparent 68%)' }}
          />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">
                {next?.type === 'exam'
                  ? 'Іспит'
                  : next?.type === 'quiz'
                    ? 'Тест модуля'
                    : 'Наступний урок'}
              </Badge>
              <LevelChip level={course.to} />
            </div>

            {next?.type === 'lesson' && (
              <>
                <h2 className="font-display mt-4 text-2xl font-semibold tracking-tight text-balance">
                  {next.lesson.title}
                </h2>
                <p className="text-fg-muted mt-1.5 text-sm">
                  Модуль {next.moduleIndex + 1} · {next.module.title}
                  {next.lesson.subtitle && ` · ${next.lesson.subtitle}`}
                </p>
                <p className="text-fg-subtle mt-3 text-[13px]">
                  {next.lesson.minutes} хв · {next.lesson.exercises.length}{' '}
                  {pluralUk(next.lesson.exercises.length, ['вправа', 'вправи', 'вправ'])} ·{' '}
                  {next.lesson.newWords.length}{' '}
                  {pluralUk(next.lesson.newWords.length, [
                    'нове слово',
                    'нові слова',
                    'нових слів',
                  ])}
                </p>
              </>
            )}

            {next?.type === 'quiz' && (
              <>
                <h2 className="font-display mt-4 text-2xl font-semibold tracking-tight">
                  Тест: {next.module.title}
                </h2>
                <p className="text-fg-muted mt-1.5 text-sm text-pretty">
                  Усі уроки модуля пройдено. Перевіримо, що закріпилося.
                </p>
              </>
            )}

            {next?.type === 'exam' && (
              <>
                <h2 className="font-display mt-4 text-2xl font-semibold tracking-tight">
                  {course.exam?.title}
                </h2>
                <p className="text-fg-muted mt-1.5 text-sm text-pretty">
                  Курс пройдено повністю. Час скласти іспит і отримати сертифікат.
                </p>
              </>
            )}

            {!next && (
              <>
                <h2 className="font-display mt-4 text-2xl font-semibold tracking-tight">
                  Курс завершено!
                </h2>
                <p className="text-fg-muted mt-1.5 text-sm">
                  Час перейти на наступний рівень або закріпити вивчене повтореннями.
                </p>
              </>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => navigate(continueTo)}>
                <Play /> {todayXp > 0 ? 'Продовжити' : 'Почати'}
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/course">
                  Уся мапа курсу <ArrowRight />
                </Link>
              </Button>
            </div>

            <div className="border-line mt-6 border-t pt-5">
              <div className="mb-2 flex items-center justify-between text-[13px]">
                <span className="text-fg-muted">
                  {course.title} · {progress.done} з {progress.total}{' '}
                  {pluralUk(progress.total, ['урок', 'уроки', 'уроків'])}
                </span>
                <span className="font-mono font-medium tabular-nums">{progress.pct}%</span>
              </div>
              <Progress value={progress.pct} />
            </div>
          </div>
        </Card>

        {/* Daily goal */}
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <RingProgress
            value={goalPct}
            barClassName={goalPct >= 100 ? 'text-success' : 'text-primary'}
          >
            <div>
              <div className="font-display text-3xl font-semibold tabular-nums">{todayXp}</div>
              <div className="text-fg-subtle text-[11px]">з {dailyGoal} XP</div>
            </div>
          </RingProgress>

          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium">
            <Target className="text-fg-subtle size-4" />
            Денна ціль
          </div>
          <p className="text-fg-muted mt-1 text-[13px] text-pretty">
            {goalPct >= 100
              ? 'Ціль виконано. Серія в безпеці 🔥'
              : `Ще ${Math.max(0, dailyGoal - todayXp)} XP до цілі`}
          </p>

          {dueCount > 0 && (
            <Button variant="soft" className="mt-5 w-full" asChild>
              <Link to="/review">
                <Layers /> Повторити {dueCount} {pluralUk(dueCount, ['картку', 'картки', 'карток'])}
              </Link>
            </Button>
          )}
        </Card>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={Flame}
          tone="accent"
          label="Серія"
          value={profile.streakCurrent}
          hint={`Рекорд: ${profile.streakBest} ${pluralUk(profile.streakBest, ['день', 'дні', 'днів'])}`}
        />
        <StatTile
          icon={BookOpen}
          tone="primary"
          label="Слів вивчено"
          value={wordsKnown(profile)}
          hint={`${Object.keys(profile.srs).length} у роботі`}
        />
        <StatTile icon={Trophy} tone="success" label="Усього XP" value={profile.xp} />
        <StatTile
          icon={Target}
          label="Точність"
          value={`${accuracy(profile)}%`}
          hint="За весь час"
        />
      </section>

      {/* Word of the day */}
      <section>
        <SectionTitle>Слово дня</SectionTitle>
        <Card className="flex flex-wrap items-center gap-5 p-6">
          <SpeakButton text={wod.fr} size="lg" slow />
          <div className="min-w-0 flex-1">
            <div className="fr font-display text-2xl font-semibold tracking-tight">{wod.fr}</div>
            {wod.ipa && (
              <div className="text-fg-subtle mt-0.5 font-mono text-[12px]">[{wod.ipa}]</div>
            )}
            <div className="text-fg-muted mt-1 text-[15px]">{wod.uk}</div>
            {wod.example && (
              <div className="border-line mt-3 border-t pt-3 text-[13px]">
                <div className="fr text-fg">{wod.example.fr}</div>
                <div className="text-fg-subtle">{wod.example.uk}</div>
              </div>
            )}
            {wod.note && (
              <div className="bg-warning-soft text-warning mt-3 rounded-lg px-3 py-2 text-[12.5px] leading-snug">
                {wod.note}
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* Practice shortcuts */}
      <section>
        <SectionTitle>Практика</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          <PracticeCard
            to="/tutor"
            icon={MessagesSquare}
            title="Розмова з учителем"
            text="Рольові діалоги голосом — кафе, знайомство, дорога"
            tone="primary"
          />
          <PracticeCard
            to="/library"
            icon={BookOpen}
            title="Читання"
            text="Історії з тапом на будь-яке слово й перекладом"
            tone="accent"
          />
          <PracticeCard
            to="/videos"
            icon={Headphones}
            title="Слухання"
            text="Аудіо й відео з інтерактивним транскриптом"
            tone="success"
          />
        </div>
      </section>
    </div>
  )
}

function PracticeCard({
  to,
  icon: Icon,
  title,
  text,
  tone,
}: {
  to: string
  icon: React.ElementType
  title: string
  text: string
  tone: 'primary' | 'accent' | 'success'
}) {
  const tones = {
    primary: 'bg-primary-soft text-primary-soft-fg',
    accent: 'bg-accent-soft text-accent-soft-fg',
    success: 'bg-success-soft text-success',
  }
  return (
    <Link
      to={to}
      className="group border-line bg-surface hover:border-line-strong rounded-2xl border p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
    >
      <span className={cn('grid size-10 place-items-center rounded-xl', tones[tone])}>
        <Icon className="size-5" />
      </span>
      <h3 className="font-display mt-3.5 text-base font-semibold">{title}</h3>
      <p className="text-fg-muted mt-1 text-[13px] leading-snug text-pretty">{text}</p>
      <span className="text-primary mt-3 inline-flex items-center gap-1 text-[13px] font-medium">
        Відкрити
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
