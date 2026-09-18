import { motion } from 'framer-motion'
import { ArrowRight, Compass, Gauge, SkipForward, Sparkles, Target, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LevelChip } from '@/components/common/misc'
import { checkExercise, isAnswered, type AnswerValue } from '@/components/exercises/check'
import { ExerciseView } from '@/components/exercises/views'
import { FullScreen } from '@/components/layout/full-screen'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ALL_MODULES, COURSES } from '@/content'
import { PLACEMENT_PROBES, shuffleOptions } from '@/content/placement'
import {
  currentProbe,
  maxProbes,
  placementProgress,
  placementResult,
  PROBES_PER_MODULE,
  recordProbe,
  startPlacement,
  type PlacementState,
} from '@/lib/placement'
import { pluralUk } from '@/lib/utils'
import { useLearner } from '@/store/learner'

const MODULE_COUNT = ALL_MODULES.length
const MAX_QUESTIONS = maxProbes(MODULE_COUNT) * PROBES_PER_MODULE

/** Which course a flat module index belongs to, and its position inside it. */
function locate(moduleIndex: number) {
  let seen = 0
  for (const course of COURSES) {
    if (moduleIndex < seen + course.modules.length) {
      return {
        course,
        indexInCourse: moduleIndex - seen,
        module: course.modules[moduleIndex - seen],
      }
    }
    seen += course.modules.length
  }
  const last = COURSES[COURSES.length - 1]
  return {
    course: last,
    indexInCourse: last.modules.length - 1,
    module: last.modules[last.modules.length - 1],
  }
}

export function PlacementPage() {
  const navigate = useNavigate()
  const applyPlacement = useLearner((s) => s.applyPlacement)

  const [phase, setPhase] = useState<'intro' | 'test' | 'result'>('intro')
  const [state, setState] = useState<PlacementState>(() => startPlacement(MODULE_COUNT))
  const [step, setStep] = useState(0) // which of the three questions in this probe
  const [correct, setCorrect] = useState(0)
  const [asked, setAsked] = useState(0)
  const [value, setValue] = useState<AnswerValue>(null)
  const [adjust, setAdjust] = useState(0)

  const probeModule = currentProbe(state)
  // Shuffled once per question — probes are authored answer-first, and useMemo
  // keeps the options from reordering under the learner's cursor on re-render.
  const exercise = useMemo(() => {
    if (probeModule === null) return null
    const raw = PLACEMENT_PROBES[probeModule]?.[step]
    return raw ? shuffleOptions(raw) : null
  }, [probeModule, step])

  const result = useMemo(() => placementResult(state, MODULE_COUNT), [state])

  /** Record the answer and move on — placement never reveals who was right. */
  const advance = (wasCorrect: boolean) => {
    if (probeModule === null) return
    const scored = correct + (wasCorrect ? 1 : 0)
    setAsked((n) => n + 1)
    setValue(null)

    if (step + 1 < PROBES_PER_MODULE) {
      setStep(step + 1)
      setCorrect(scored)
      return
    }

    const next = recordProbe(state, scored)
    setState(next)
    setStep(0)
    setCorrect(0)
    if (currentProbe(next) === null) setPhase('result')
  }

  const submit = () => {
    if (!exercise || !isAnswered(exercise, value)) return
    advance(checkExercise(exercise, value).status !== 'wrong')
  }

  // Digits pick an option (McqView handles that); Enter moves on, same as in a
  // lesson — fifteen questions is enough to reach for the mouse fifteen times.
  useEffect(() => {
    if (phase !== 'test') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return
      e.preventDefault()
      submit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  /* ---------------------------------------------------------------- *
   * Intro
   * ---------------------------------------------------------------- */

  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="bg-primary-soft text-primary mx-auto mb-5 grid size-16 place-items-center rounded-2xl">
            <Compass className="size-8" />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            З чого почати?
          </h1>
          <p className="text-fg-muted mx-auto mt-3 max-w-lg text-pretty">
            Коротка перевірка, яка сама знайде твій рівень — не «десь між A2 і B1», а конкретний
            модуль, з якого варто починати.
          </p>
        </div>

        <Card className="divide-line divide-y">
          {[
            {
              Icon: Gauge,
              title: `Максимум ${MAX_QUESTIONS} питань`,
              body: 'Питання підлаштовуються під твої відповіді: впорався — далі складніше, ні — простіше. Тому тест такий короткий.',
            },
            {
              Icon: Target,
              title: 'Тільки вибір варіанта',
              body: 'Нічого не треба друкувати. Перевіряємо французьку, а не швидкість набору з діакритикою.',
            },
            {
              Icon: Sparkles,
              title: 'Це не іспит',
              body: 'Помилки ніде не зберігаються, XP не нараховується, у повторення нічого не потрапляє. Єдиний результат — порада, з якого модуля стартувати.',
            },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="flex gap-4 p-5">
              <Icon className="text-primary mt-0.5 size-5 shrink-0" />
              <div>
                <div className="font-medium">{title}</div>
                <p className="text-fg-muted mt-1 text-[14px] leading-relaxed text-pretty">{body}</p>
              </div>
            </div>
          ))}
        </Card>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" className="flex-1" onClick={() => setPhase('test')}>
            Почати тест <ArrowRight />
          </Button>
          <Button size="lg" variant="surface" onClick={() => navigate('/course')}>
            Обрати рівень вручну
          </Button>
        </div>
      </div>
    )
  }

  /* ---------------------------------------------------------------- *
   * Result
   * ---------------------------------------------------------------- */

  if (phase === 'result') {
    const placed = Math.max(0, Math.min(result.moduleIndex + adjust, MODULE_COUNT - 1))
    const { course, indexInCourse, module } = locate(placed)
    const remaining = course.modules.length - indexInCourse

    return (
      <FullScreen>
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center px-4 py-10 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <div className="text-center">
              <div className="bg-success-soft text-success mx-auto mb-5 grid size-16 place-items-center rounded-2xl">
                <Target className="size-8" />
              </div>
              <p className="text-fg-subtle text-[12.5px] font-medium">
                {result.beyond ? 'Ти пройшов усе' : 'Твоя стартова точка'}
              </p>
              <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight">
                {result.beyond ? 'Курс тебе вже не наздожене' : module.title}
              </h1>
              <p className="text-fg-muted mt-3 text-pretty">
                {result.beyond
                  ? 'Жодне питання тебе не спинило. Спробуй одразу іспит на B2 — і бери курс як довідник.'
                  : `Ти впорався з питаннями до ${result.highestPassed + 1} ${pluralUk(result.highestPassed + 1, ['модуля', 'модулів', 'модулів'])}, а тут почалися труднощі. Саме звідси і є сенс починати.`}
              </p>
            </div>

            <Card className="mt-7 p-5">
              <div className="flex items-center gap-3">
                <span className="bg-surface-2 grid size-11 shrink-0 place-items-center rounded-xl text-xl">
                  {module.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <LevelChip level={course.to} />
                    <span className="text-fg-subtle text-[12px]">
                      Модуль {indexInCourse + 1} · {course.title}
                    </span>
                  </div>
                  <div className="mt-1 truncate font-medium">{module.grammarFocus}</div>
                </div>
              </div>
              <p className="text-fg-muted border-line mt-4 border-t pt-4 text-[13.5px] leading-relaxed">
                Попереду {remaining} {pluralUk(remaining, ['модуль', 'модулі', 'модулів'])} цього
                рівня. Усе, що раніше, лишається відкритим — туди можна зазирнути будь-коли, але
                проходити не обов’язково.
              </p>
            </Card>

            <div className="mt-5 flex items-center justify-center gap-2">
              <Button
                variant="surface"
                size="sm"
                disabled={placed === 0}
                onClick={() => setAdjust((a) => a - 1)}
              >
                Почати раніше
              </Button>
              <Button
                variant="surface"
                size="sm"
                disabled={placed >= MODULE_COUNT - 1}
                onClick={() => setAdjust((a) => a + 1)}
              >
                Почати пізніше
              </Button>
            </div>
            <p className="text-fg-subtle mt-2 text-center text-[12px]">
              Тест — це порада, а не вирок. Підправ, якщо відчуваєш інакше.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => {
                  applyPlacement(course.id, indexInCourse)
                  navigate('/course')
                }}
              >
                Почати звідси <ArrowRight />
              </Button>
              <Button size="lg" variant="ghost" onClick={() => navigate('/')}>
                Пізніше
              </Button>
            </div>
          </motion.div>
        </div>
      </FullScreen>
    )
  }

  /* ---------------------------------------------------------------- *
   * The test itself
   * ---------------------------------------------------------------- */

  if (!exercise) return null

  const canSubmit = isAnswered(exercise, value)

  return (
    <FullScreen>
      <header className="border-line bg-bg/85 sticky top-0 z-30 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3.5 sm:px-6">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate('/course')}
            aria-label="Вийти"
          >
            <X />
          </Button>
          <div className="min-w-0 flex-1">
            <Progress value={placementProgress(state, MODULE_COUNT) * 100} />
          </div>
          <span className="text-fg-subtle shrink-0 text-[12px] tabular-nums">
            {asked + 1}/{MAX_QUESTIONS}
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-fg-subtle mb-6 text-center text-[13px]">
            Не знаєш — пропусти. Це теж відповідь.
          </p>
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          >
            <ExerciseView
              exercise={exercise}
              value={value}
              onChange={setValue}
              outcome={null}
              onSubmit={submit}
              onSkip={() => advance(false)}
            />
          </motion.div>
        </div>
      </main>

      <footer className="border-line bg-bg/90 sticky bottom-0 z-30 border-t px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-6">
        <div className="mx-auto max-w-2xl space-y-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => advance(false)}
              aria-label="Не знаю, пропустити"
            >
              <SkipForward /> Не знаю
            </Button>
            <Button
              className="flex-1"
              size="lg"
              disabled={!canSubmit}
              variant={canSubmit ? 'primary' : 'surface'}
              onClick={submit}
            >
              Далі <ArrowRight />
            </Button>
          </div>
          <p className="text-fg-subtle hidden text-center text-[11px] sm:block">
            Enter — далі · цифри 1–4 — обрати варіант
          </p>
        </div>
      </footer>
    </FullScreen>
  )
}
