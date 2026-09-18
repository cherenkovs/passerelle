import * as Accordion from '@radix-ui/react-accordion'
import {
  Check,
  Compass,
  ChevronDown,
  CircleDot,
  ClipboardCheck,
  GraduationCap,
  Lock,
  Play,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { LevelChip, PageHeader } from '@/components/common/misc'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { COURSES, getCourse } from '@/content'
import {
  courseProgress,
  lessonDone,
  lessonUnlocked,
  moduleComplete,
  moduleProgress,
  moduleUnlocked,
  quizPassed,
  startModule,
} from '@/lib/progress'
import { cn, pluralUk } from '@/lib/utils'
import { useActiveProfile, useLearner } from '@/store/learner'

export function CoursePage() {
  const profile = useActiveProfile()
  const updateProfile = useLearner((s) => s.updateProfile)
  const navigate = useNavigate()

  const course = getCourse(profile?.courseId ?? 'a0-a1')
  if (!profile || !course) return null

  const progress = courseProgress(profile, course)
  const start = startModule(profile, course)
  // Expand where the learner actually is — for a placed learner that is their
  // placement, not the first module they happen not to have finished.
  const firstOpen =
    course.modules.slice(start).find((m) => !moduleComplete(profile, m))?.id ??
    course.modules[start]?.id

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`${course.from} → ${course.to}`}
        title={course.title}
        description={course.description}
      />

      {/* Course switcher */}
      <div className="flex flex-wrap gap-2">
        {COURSES.map((c) => (
          <button
            key={c.id}
            type="button"
            disabled={c.status !== 'ready'}
            onClick={() => updateProfile({ courseId: c.id })}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors',
              c.id === course.id
                ? 'border-primary bg-primary-soft text-primary-soft-fg'
                : 'border-line bg-surface text-fg-muted hover:text-fg',
              c.status !== 'ready' && 'cursor-not-allowed opacity-50',
            )}
          >
            {c.status !== 'ready' && <Lock className="size-3" />}
            {c.from} → {c.to}
          </button>
        ))}
        <Link
          to="/placement"
          className="border-line bg-surface text-fg-muted hover:text-fg ml-auto inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors"
        >
          <Compass className="size-3.5" /> Знайти свій рівень
        </Link>
      </div>

      {/* Overview */}
      <Card className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-fg-muted text-[13px]">Пройдено уроків</div>
            <div className="font-display mt-1 text-3xl font-semibold tabular-nums">
              {progress.done}
              <span className="text-fg-subtle"> / {progress.total}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl font-semibold tabular-nums">{progress.pct}%</div>
          </div>
        </div>
        <Progress value={progress.pct} className="mt-4 h-2.5" />

        <div className="border-line mt-6 border-t pt-5">
          <div className="text-fg-muted mb-3 text-[13px] font-medium">Після курсу ти зможеш:</div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {course.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2 text-[13.5px] leading-snug">
                <Check className="text-success mt-0.5 size-4 shrink-0" />
                <span className="text-fg-muted">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Modules */}
      <Accordion.Root
        type="multiple"
        defaultValue={firstOpen ? [firstOpen] : []}
        className="space-y-3"
      >
        {course.modules.map((module, mi) => {
          const unlocked = moduleUnlocked(profile, course, mi)
          const mp = moduleProgress(profile, module)
          const complete = moduleComplete(profile, module)
          const passed = quizPassed(profile, module.id)

          return (
            <Accordion.Item
              key={module.id}
              value={module.id}
              className={cn(
                'bg-surface overflow-hidden rounded-2xl border transition-colors',
                unlocked ? 'border-line' : 'border-line opacity-60',
              )}
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center gap-4 p-5 text-left">
                  <span
                    className={cn(
                      'grid size-12 shrink-0 place-items-center rounded-2xl text-xl transition-colors',
                      complete ? 'bg-success-soft' : unlocked ? 'bg-surface-2' : 'bg-surface-2',
                    )}
                  >
                    {unlocked ? module.emoji : <Lock className="text-fg-subtle size-5" />}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-fg-subtle text-[12px] font-medium">
                        Модуль {mi + 1}
                      </span>
                      {complete && (
                        <Badge variant="success" size="sm">
                          <Check /> пройдено
                        </Badge>
                      )}
                      {passed && (
                        <Badge variant="primary" size="sm">
                          тест складено
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display mt-0.5 text-lg font-semibold tracking-tight">
                      {module.title}
                    </h3>
                    <p className="text-fg-muted mt-0.5 text-[13px] text-pretty">
                      {module.grammarFocus}
                    </p>

                    {unlocked && (
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={mp.pct} className="h-1.5 max-w-[220px]" />
                        <span className="text-fg-subtle text-[11.5px] tabular-nums">
                          {mp.done}/{mp.total}
                        </span>
                      </div>
                    )}
                  </div>

                  <ChevronDown className="text-fg-subtle size-5 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content className="overflow-hidden">
                <div className="border-line border-t px-5 py-4">
                  {!unlocked ? (
                    <p className="text-fg-muted py-2 text-sm">
                      Заверши попередній модуль, щоб відкрити цей.
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {module.lessons.map((lesson, li) => {
                        const done = lessonDone(profile, lesson.id)
                        const open = lessonUnlocked(profile, course, mi, li)
                        return (
                          <li key={lesson.id}>
                            <button
                              type="button"
                              disabled={!open}
                              onClick={() => navigate(`/lesson/${lesson.id}`)}
                              className={cn(
                                'flex w-full items-center gap-3.5 rounded-xl px-3 py-3 text-left transition-colors',
                                open ? 'hover:bg-surface-2' : 'cursor-not-allowed opacity-50',
                              )}
                            >
                              <span
                                className={cn(
                                  'grid size-8 shrink-0 place-items-center rounded-full border-2 transition-colors',
                                  done
                                    ? 'border-success bg-success text-white'
                                    : open
                                      ? 'border-primary text-primary'
                                      : 'border-line text-fg-subtle',
                                )}
                              >
                                {done ? (
                                  <Check className="size-4" />
                                ) : open ? (
                                  <Play className="size-3.5 translate-x-px" />
                                ) : (
                                  <Lock className="size-3.5" />
                                )}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[14.5px] font-medium">
                                  {lesson.title}
                                </span>
                                {lesson.subtitle && (
                                  <span className="text-fg-muted block text-[12.5px]">
                                    {lesson.subtitle}
                                  </span>
                                )}
                              </span>
                              <span className="text-fg-subtle shrink-0 font-mono text-[11px]">
                                {lesson.minutes} хв
                              </span>
                            </button>
                          </li>
                        )
                      })}

                      {/* Module test */}
                      <li className="pt-2">
                        <Button
                          variant={complete ? (passed ? 'surface' : 'primary') : 'surface'}
                          className="w-full justify-start"
                          disabled={!complete}
                          onClick={() => navigate(`/quiz/${module.id}`)}
                        >
                          <ClipboardCheck />
                          {passed
                            ? `Тест складено — ${profile.quizzes[module.id]?.bestScore}%. Пройти ще раз`
                            : complete
                              ? `Тест модуля (${module.quiz.length} ${pluralUk(module.quiz.length, ['питання', 'питання', 'питань'])})`
                              : 'Тест відкриється після всіх уроків'}
                        </Button>
                      </li>
                    </ul>
                  )}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          )
        })}
      </Accordion.Root>

      {/* Exam */}
      {course.exam && (
        <Card
          className={cn(
            'p-6',
            progress.pct === 100 ? 'border-accent/40 bg-accent-soft/40' : 'opacity-70',
          )}
        >
          <div className="flex flex-wrap items-center gap-5">
            <span className="bg-accent-soft text-accent-soft-fg grid size-12 shrink-0 place-items-center rounded-2xl">
              <GraduationCap className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {course.exam.title}
              </h3>
              <p className="text-fg-muted mt-0.5 text-[13px] text-pretty">
                {course.exam.sections.length} секцій ·{' '}
                {course.exam.sections.reduce((n, s) => n + s.exercises.length, 0)} завдань ·
                прохідний бал {course.exam.passScore}%
              </p>
              {profile.exams[course.exam.id] && (
                <div className="mt-2 flex items-center gap-2">
                  <LevelChip level={course.to} />
                  <span className="text-[13px] font-medium">
                    Найкращий результат: {profile.exams[course.exam.id].bestScore}%
                    {profile.exams[course.exam.id].passed && ' — складено ✓'}
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="accent"
              disabled={progress.pct < 100}
              onClick={() => navigate(`/exam/${course.id}`)}
            >
              {progress.pct < 100 ? (
                <>
                  <CircleDot /> Заверши всі уроки
                </>
              ) : (
                <>
                  <GraduationCap /> Скласти іспит
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      <p className="text-fg-subtle pb-4 text-center text-[13px]">
        Не знаєш, з чого почати?{' '}
        <Link to="/review" className="text-primary underline-offset-4 hover:underline">
          Повторення
        </Link>{' '}
        завжди готове.
      </p>
    </div>
  )
}
