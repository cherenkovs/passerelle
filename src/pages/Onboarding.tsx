import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Compass,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Lock,
  Sparkles,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LevelChip, Logo } from '@/components/common/misc'
import { GoogleMark } from '@/components/common/sync-card'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { COURSES } from '@/content'
import type { Gender } from '@/lib/agreement'
import { useSpeak } from '@/components/common/speak'
import {
  attachAfterSignIn,
  fetchRemoteProfiles,
  routeAfterSignIn,
  signIn,
  useSync,
  warmFirebase,
} from '@/lib/sync'
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
  {
    emoji: '📡',
    title: 'Працює офлайн',
    text: 'Після входу уроки, картки й озвучка доступні без інтернету. Жодних підписок',
  },
]

export function Onboarding() {
  const navigate = useNavigate()
  const { speak } = useSpeak()
  const [params] = useSearchParams()
  const isAdding = params.get('add') === '1'

  const [step, setStep] = useState(isAdding ? 2 : 0)
  const [name, setName] = useState('')
  const [gender, setGender] = useState<Gender>('m')
  const [courseId, setCourseId] = useState('a0-a1')

  const [signingIn, setSigningIn] = useState(false)
  const [signInError, setSignInError] = useState<string | null>(null)

  /**
   * Sign in, then go wherever the account already is.
   *
   * An account that has studied before goes straight into the course — being
   * asked again for a name and a level that were settled on another device
   * weeks ago is exactly the friction an account is supposed to remove. Local
   * work done before signing in is merged rather than replaced, so trying the
   * app first and signing in afterwards never costs a lesson.
   */
  /** Shared by the button and by the redirect coming back. */
  const landAfterSignIn = async () => {
    // Deliberately not caught here. If the account cannot be read we must not
    // continue to the name step: that step ends in createProfile, so guessing
    // "probably a new account" is how a duplicate gets made. The caller turns
    // this into a visible error and leaves the learner on the sign-in screen.
    const remote = await fetchRemoteProfiles()

    const { profiles, go } = routeAfterSignIn(useLearner.getState().profiles, remote)
    if (profiles.length) useLearner.setState({ profiles, activeId: profiles[0].id })
    await attachAfterSignIn()
    if (go === 'app') navigate('/')
    else setStep(2)
  }

  useEffect(() => {
    // Fetch the SDK while the learner reads this screen, so the popup can open
    // inside their click instead of after a download.
    warmFirebase()
  }, [])

  // A sign-in that went the redirect route completes during startup, not here,
  // so this screen finds out the same way any other would: a profile appears.
  const existingProfiles = useLearner((s) => s.profiles.length)
  useEffect(() => {
    if (!isAdding && existingProfiles > 0) navigate('/', { replace: true })
  }, [isAdding, existingProfiles, navigate])

  const enterWithGoogle = async () => {
    setSigningIn(true)
    setSignInError(null)
    try {
      // A dismissed popup is not a failure and not a way past this step.
      if (!(await signIn())) {
        setSignInError(useSync.getState().error)
        return
      }

      await landAfterSignIn()
    } catch (e) {
      setSignInError(e instanceof Error ? e.message : 'Спробуй ще раз')
    } finally {
      setSigningIn(false)
    }
  }
  const createProfile = useLearner((s) => s.createProfile)
  const existing = useLearner((s) => s.profiles)

  const finish = (to = '/') => {
    // Last line of defence against a second name appearing on its own. Setup
    // should already be unreachable for someone who has a profile, but this is
    // the only place one is ever created, so the rule is enforced here too:
    // extra names come from "Додати ім’я", never from signing in.
    if (!isAdding && existing.length) {
      navigate(to, { replace: true })
      return
    }
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
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors duration-500',
                  i <= step ? 'bg-primary' : 'bg-surface-3',
                )}
              />
            ))}
          </div>
          {step > (isAdding ? 2 : 0) && (
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
          <Slide key="signin">
            <div className="flex flex-1 flex-col justify-center py-8">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Спочатку — вхід
              </h2>
              <p className="text-fg-muted mt-4 max-w-lg text-[16px] leading-relaxed text-pretty">
                Акаунт тримає твій прогрес разом на всіх пристроях: почни урок на комп’ютері —
                продовжиш у телефоні з того самого місця. Passerelle не бачить нічого, крім твого
                курсу.
              </p>

              <div className="mt-8">
                <Button
                  size="lg"
                  className="w-full sm:w-auto sm:px-10"
                  disabled={signingIn}
                  onClick={() => void enterWithGoogle()}
                >
                  {signingIn ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <GoogleMark className="size-5" />
                  )}
                  {signingIn ? 'Вхід…' : 'Увійти через Google'}
                </Button>

                {signInError && (
                  <div className="border-danger-border bg-danger-soft mt-5 rounded-2xl border p-4">
                    <p className="text-danger flex items-start gap-2 text-[13.5px] leading-snug text-pretty">
                      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                      <span>Не вдалося увійти: {signInError}</span>
                    </p>
                    {/*
                      Only offered after a failure. Sign-in is the way in, but a
                      blocked popup or a dead connection must not leave someone
                      locked out of a course that runs perfectly offline.
                    */}
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-fg-muted mt-3 text-[13px] underline underline-offset-4"
                    >
                      Продовжити без акаунта — прогрес буде лише на цьому пристрої
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Slide>
        )}

        {step === 2 && (
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
                    if (e.key === 'Enter' && name.trim()) setStep(3)
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
                onClick={() => setStep(3)}
              >
                Далі <ArrowRight />
              </Button>
            </div>
          </Slide>
        )}

        {step === 3 && (
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
