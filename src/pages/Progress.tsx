import { Activity, BookOpen, Flame, Target, TrendingUp, Trophy } from 'lucide-react'
import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader, SectionTitle, StatTile } from '@/components/common/misc'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getCourse } from '@/content'
import {
  accuracy,
  activitySeries,
  courseProgress,
  moduleProgress,
  wordsKnown,
} from '@/lib/progress'
import { pluralUk } from '@/lib/utils'
import { useActiveProfile } from '@/store/learner'

export function ProgressPage() {
  const profile = useActiveProfile()
  const course = getCourse(profile?.courseId ?? 'a0-a1')

  const series = useMemo(() => activitySeries(profile, 30), [profile])

  const srsBuckets = useMemo(() => {
    if (!profile) return []
    const cards = Object.values(profile.srs)
    return [
      { name: 'Нові', value: cards.filter((c) => c.reps === 0).length, fill: 'var(--fg-subtle)' },
      {
        name: 'Вивчаю',
        value: cards.filter((c) => c.reps > 0 && c.interval < 7).length,
        fill: 'var(--warning)',
      },
      {
        name: 'Закріплено',
        value: cards.filter((c) => c.interval >= 7 && c.interval < 30).length,
        fill: 'var(--primary)',
      },
      {
        name: 'Міцно',
        value: cards.filter((c) => c.interval >= 30).length,
        fill: 'var(--success)',
      },
    ]
  }, [profile])

  if (!profile || !course) return null

  const cp = courseProgress(profile, course)
  const activeDays = Object.keys(profile.days).length
  const totalAnswered = Object.values(profile.days).reduce((n, d) => n + d.answered, 0)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={profile.name}
        title="Прогрес"
        description="Чесна картина: скільки ти справді вчиш, що засвоїлося міцно, а що ще хитається."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={Trophy} tone="primary" label="Усього XP" value={profile.xp} />
        <StatTile
          icon={Flame}
          tone="accent"
          label="Серія"
          value={profile.streakCurrent}
          hint={`Рекорд ${profile.streakBest}`}
        />
        <StatTile
          icon={BookOpen}
          tone="success"
          label="Слів закріплено"
          value={wordsKnown(profile)}
          hint={`${Object.keys(profile.srs).length} у роботі`}
        />
        <StatTile
          icon={Target}
          label="Точність"
          value={`${accuracy(profile)}%`}
          hint={`${totalAnswered} відповідей`}
        />
      </section>

      {/* Activity */}
      <section>
        <SectionTitle>Активність за 30 днів</SectionTitle>
        <Card className="p-5">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--fg-subtle)' }}
                  axisLine={false}
                  tickLine={false}
                  interval={6}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--fg-subtle)' }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    fontSize: 12,
                    color: 'var(--fg)',
                  }}
                  labelStyle={{ color: 'var(--fg-muted)' }}
                  formatter={((v: unknown) => [`${Number(v)} XP`, 'Отримано']) as never}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#xpFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="border-line text-fg-muted mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t pt-3 text-[12.5px]">
            <span className="inline-flex items-center gap-1.5">
              <Activity className="size-3.5" /> Активних днів: {activeDays}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="size-3.5" /> Середньо за день:{' '}
              {activeDays ? Math.round(profile.xp / activeDays) : 0} XP
            </span>
          </div>
        </Card>
      </section>

      {/* Memory strength */}
      <section>
        <SectionTitle>Міцність пам’яті</SectionTitle>
        <Card className="p-5">
          {Object.keys(profile.srs).length ? (
            <>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={srsBuckets} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: 'var(--fg-muted)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'var(--fg-subtle)' }}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'var(--surface-2)' }}
                      contentStyle={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        fontSize: 12,
                        color: 'var(--fg)',
                      }}
                      formatter={
                        ((v: unknown) => [
                          `${Number(v)} ${pluralUk(Number(v), ['слово', 'слова', 'слів'])}`,
                          '',
                        ]) as never
                      }
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {srsBuckets.map((b, i) => (
                        <Cell key={i} fill={b.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="border-line text-fg-muted mt-3 border-t pt-3 text-[12.5px] text-pretty">
                «Міцно» — слова з інтервалом понад місяць. Саме вони формують справжній активний
                словник.
              </p>
            </>
          ) : (
            <p className="text-fg-muted py-8 text-center text-sm">
              Картки з’являться після першого уроку.
            </p>
          )}
        </Card>
      </section>

      {/* Modules */}
      <section>
        <SectionTitle>
          {course.title}
          <span className="text-fg-subtle ml-2 font-sans text-sm font-normal">{cp.pct}%</span>
        </SectionTitle>
        <Card className="divide-line divide-y">
          {course.modules.map((m, i) => {
            const mp = moduleProgress(profile, m)
            const quiz = profile.quizzes[m.id]
            return (
              <div key={m.id} className="flex items-center gap-4 p-4">
                <span className="bg-surface-2 grid size-10 shrink-0 place-items-center rounded-xl text-lg">
                  {m.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-fg-subtle text-[11px] font-semibold">{i + 1}</span>
                    <span className="truncate text-[14.5px] font-medium">{m.title}</span>
                  </div>
                  <Progress value={mp.pct} className="mt-2 h-1.5" />
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-[13px] font-medium tabular-nums">
                    {mp.done}/{mp.total}
                  </div>
                  {quiz && (
                    <div
                      className={`text-[11px] ${quiz.passed ? 'text-success' : 'text-fg-subtle'}`}
                    >
                      тест {quiz.bestScore}%
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </Card>
      </section>
    </div>
  )
}
