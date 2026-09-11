import { motion } from 'framer-motion'
import { Compass, ArrowLeft, ArrowRight, Check, Lock, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LevelChip, Logo } from '@/components/common/misc'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { COURSES } from '@/content'
import type { Gender } from '@/lib/agreement'
import { useSpeak } from '@/components/common/speak'
import { cn } from '@/lib/utils'
import { useLearner } from '@/store/learner'

/** Shown as the actual French forms — the choice is grammatical, so show grammar. */
const GENDER_CHOICES = [
  { gender: 'm' as const, example: 'Je suis prêt.', uk: 'чоловічий рід' },
  { gender: 'f' as const, example: 'Je suis prête.', uk: 'жіночий рід' },
]

const HIGHLIGHTS = [
  {
    emoji: '🇺🇦',
    title: 'Українською',
    text: 'Пояснення й переклади рідною мовою — без англійської як посередника',
  },
  {
    emoji: '🔊',
    title: 'З голосом',
    text: 'Будь-яке французьке слово можна почути — і вимовити самому',
  },
  {
    emoji: '🧠',
    title: 'Інтервальні повторення',
    text: 'Алгоритм сам вирішує, що і коли тобі повторити',
  },
  { emoji: '📡', title: 'Працює офлайн', text: 'Жодних підписок і жодного інтернету для навчання' },
]

export function Onboarding() {
  const navigate = useNavigate()
  const { speak } = useSpeak()
  const [params] = useSearchParams()
  const isAdding = params.get('add') === '1'

  const createProfile = useLearner((s) => s.createProfile)
  const existing = useLearner((s) => s.profiles)

  const [step, setStep] = useState(isAdding ? 1 : 0)
  const [name, setName] = useState('')
  const [gender, setGender] = useState<Gender>('m')
  const [courseId, setCourseId] = useState('a0-a1')

  const finish = (to = '/') => {
    createProfile(name, courseId, gender)
    navigate(to, { replace: true })
  }

  return (
    <div className="grain bg-bg min-h-[100dvh]">
      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-5 py-8 sm:px-8">
        {/* Progress dots */}
        <div className="mb-10 flex items-center gap-3">
          <Logo size={32} />
          <div className="flex flex-1 items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors duration-500',
                  i <= step ? 'bg-primary' : 'bg-surface-3',
                )}
              />
            ))}
          </div>
          {step > (isAdding ? 1 : 0) && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setStep((s) => s - 1)}
              aria-label="Назад"
            >
              <ArrowLeft />
            </Button>
          )}
        </div>

        {step === 0 && (
          <Slide key="welcome">
            <div className="flex flex-1 flex-col justify-center py-8">
              <div className="border-line bg-surface text-fg-muted mb-6 inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium">
                <Sparkles className="text-accent size-3.5" />
                Курс французької для українців
              </div>

              <h1 className="font-display text-[42px] leading-[1.08] font-semibold tracking-tight text-balance sm:text-6xl">
                Місток
                <br />
                до французької
              </h1>

              <p className="text-fg-muted mt-5 max-w-lg text-[17px] leading-relaxed text-pretty">
                Passerelle навчає французької <strong className="text-fg">з української</strong>, а
                не через англійську. Від перших звуків до вільної розмови — зі структурованим
                курсом, живою озвучкою та інтервальними повтореннями.
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {HIGHLIGHTS.map((h) => (
                  <div
                    key={h.title}
                    className="border-line bg-surface rounded-2xl border p-4 shadow-[var(--shadow-card)]"
                  >
                    <div className="text-xl">{h.emoji}</div>
                    <div className="mt-2 text-sm font-semibold">{h.title}</div>
                    <div className="text-fg-muted mt-0.5 text-[13px] leading-snug text-pretty">
                      {h.text}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="mt-10 w-full sm:w-auto sm:self-start sm:px-10"
                onClick={() => setStep(1)}
              >
                Почати <ArrowRight />
              </Button>

              {existing.length > 0 && (
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-fg-muted mt-4 text-sm underline-offset-4 hover:underline sm:self-start"
                >
                  Повернутися до навчання
                </button>
              )}
            </div>
          </Slide>
        )}

        {step === 1 && (
          <Slide key="name">
            <div className="flex flex-1 flex-col justify-center py-8">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Як до тебе звертатися?
              </h1>
              <p className="text-fg-muted mt-4 max-w-lg text-[16px] leading-relaxed text-pretty">
                Ім’я з’являтиметься у вправах і в зошиті. Пізніше можна додати ще одне — якщо
                застосунком користуватиметься хтось інший, прогрес зберігатиметься окремо.
              </p>

              <div className="mt-9 max-w-md">
                <Label htmlFor="name">Твоє ім’я</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && name.trim()) setStep(2)
                  }}
                  placeholder="Наприклад, Марина"
                  autoFocus
                  className="mt-2 h-14 text-lg"
                />
              </div>

              <div className="mt-7 max-w-md">
                <Label>Як писати про тебе французькою</Label>
                <p className="text-fg-muted mt-1 text-[13px] leading-snug text-pretty">
                  У французькій прикметники узгоджуються з тобою. Без цього довелося б писати
                  «fatigué(e)» на кожному кроці.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {GENDER_CHOICES.map((choice) => (
                    <button
                      key={choice.gender}
                      type="button"
                      onClick={() => {
                        // "fatigué" against "fatiguée": the difference is
                        // audible before it is visible.
                        speak(choice.example)
                        setGender(choice.gender)
                      }}
                      className={cn(
                        'rounded-2xl border-2 p-4 text-left transition-all',
                        gender === choice.gender
                          ? 'border-primary bg-primary-soft'
                          : 'border-line bg-surface hover:border-line-strong',
                      )}
                    >
                      <div className="fr text-[15px] font-semibold">{choice.example}</div>
                      <div className="text-fg-muted mt-0.5 text-[12.5px]">{choice.uk}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="mt-8 w-full sm:w-auto sm:self-start sm:px-10"
                disabled={!name.trim()}
                onClick={() => setStep(2)}
              >
                Далі <ArrowRight />
              </Button>
            </div>
          </Slide>
        )}

        {step === 2 && (
          <Slide key="level">
            <div className="flex flex-1 flex-col py-8">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                З якого рівня почнемо?
              </h1>
              <p className="text-fg-muted mt-4 max-w-lg text-[16px] leading-relaxed text-pretty">
                Якщо вже щось знаєш — краще не вгадувати: тест на 15 питань сам знайде потрібний
                модуль. Рівень можна змінити будь-коли, а пройдене не зникне.
              </p>

              <button
                type="button"
                onClick={() => finish('/placement')}
                className="border-primary/40 bg-primary-soft hover:border-primary mt-6 flex w-full items-center gap-4 rounded-2xl border-2 border-dashed p-5 text-left transition-colors"
              >
                <Compass className="text-primary size-6 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-display text-lg font-semibold">Не знаю свій рівень</div>
                  <p className="text-fg-muted mt-1 text-[13.5px] leading-snug text-pretty">
                    Пройди коротку перевірку — вона поставить тебе не просто на рівень, а на
                    конкретний модуль.
                  </p>
                </div>
                <ArrowRight className="text-primary size-5 shrink-0" />
              </button>

              <p className="text-fg-subtle mt-6 text-[12px] font-semibold tracking-wider uppercase">
                або обери сам
              </p>

              <div className="mt-8 space-y-3">
                {COURSES.map((course) => {
                  const locked = course.status !== 'ready'
                  const selected = courseId === course.id
                  return (
                    <button
                      key={course.id}
                      type="button"
                      disabled={locked}
                      onClick={() => setCourseId(course.id)}
                      className={cn(
                        'w-full rounded-2xl border-2 p-5 text-left transition-all',
                        locked && 'border-line bg-surface-2 cursor-not-allowed opacity-60',
                        !locked && selected && 'border-primary bg-primary-soft',
                        !locked && !selected && 'border-line bg-surface hover:border-line-strong',
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex shrink-0 items-center gap-1 pt-0.5">
                          <LevelChip level={course.from} />
                          <span className="text-fg-subtle">→</span>
                          <LevelChip level={course.to} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-lg font-semibold">
                              {course.title}
                            </span>
                            {locked && <Lock className="text-fg-subtle size-3.5" />}
                          </div>
                          <p className="text-fg-muted mt-1 text-[13.5px] leading-snug text-pretty">
                            {course.description}
                          </p>
                          {!locked && (
                            <p className="text-fg-subtle mt-2 text-[12px]">
                              {course.modules.length} модулів ·{' '}
                              {course.modules.reduce((n, m) => n + m.lessons.length, 0)} уроків
                            </p>
                          )}
                          {locked && (
                            <p className="text-warning mt-2 text-[12px] font-medium">
                              У розробці — структура готова, контент додається
                            </p>
                          )}
                        </div>

                        {selected && !locked && (
                          <span className="bg-primary text-primary-fg grid size-6 shrink-0 place-items-center rounded-full">
                            <Check className="size-3.5" />
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              <Button
                size="lg"
                className="mt-8 w-full sm:w-auto sm:self-start sm:px-10"
                onClick={() => finish()}
              >
                Почати навчання <ArrowRight />
              </Button>
            </div>
          </Slide>
        )}
      </div>
    </div>
  )
}

function Slide({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  )
}
