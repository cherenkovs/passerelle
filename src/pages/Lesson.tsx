import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Dumbbell,
  Eye,
  EyeOff,
  Mic,
  Square,
  Volume2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Inline, RichText, SpeakInline } from '@/components/common/rich-text'
import { SpeakButton, SpokenLine, useSpeak } from '@/components/common/speak'
import { WordCard } from '@/components/common/word-card'
import { ExerciseRunner } from '@/components/exercises/runner'
import { FullScreen } from '@/components/layout/full-screen'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getLesson, getWords, moduleOfLesson, type GrammarTable, type LessonStep } from '@/content'
import { estimateMs, frenchIn, speakSequence } from '@/lib/speech'
import { useSettings } from '@/store/settings'
import { cn } from '@/lib/utils'
import { useLearner } from '@/store/learner'

/**
 * Keyed on the lesson, so moving from one lesson to another starts fresh.
 *
 * Without the key the component survives the route change: its step counter
 * and — worse — the exercise runner's queue stay as they were, so opening a
 * second lesson from the first showed the first lesson's exercises under the
 * second one's title.
 */
export function LessonPage() {
  const { id = '' } = useParams()
  return <Lesson key={id} id={id} />
}

function Lesson({ id }: { id: string }) {
  const navigate = useNavigate()
  const completeLesson = useLearner((s) => s.completeLesson)
  const ensureCards = useLearner((s) => s.ensureCards)

  const lesson = getLesson(id)
  const module = moduleOfLesson(id)
  const [phase, setPhase] = useState<'steps' | 'exercises'>('steps')
  const [step, setStep] = useState(0)

  if (!lesson) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <p className="text-fg-muted">Урок не знайдено.</p>
          <Button className="mt-4" onClick={() => navigate('/course')}>
            До курсу
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'exercises') {
    return (
      <ExerciseRunner
        exercises={lesson.exercises}
        title={lesson.title}
        subtitle={module?.title}
        onExit={() => navigate('/course')}
        finishLabel="До курсу"
        onFinish={(res) => {
          completeLesson(lesson.id, res.pct)
          ensureCards(lesson.newWords)
        }}
      />
    )
  }

  const total = lesson.steps.length
  const current = lesson.steps[step]
  const isLast = step === total - 1

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
            <div className="text-fg-muted truncate text-[12px] font-medium">{lesson.title}</div>
            <Progress value={((step + 1) / total) * 100} className="mt-1.5 h-1.5" />
          </div>
          <span className="text-fg-subtle shrink-0 text-[12px] tabular-nums">
            {step + 1}/{total}
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <StepView step={current} />
          </motion.div>
        </div>
      </main>

      <footer className="border-line bg-bg/90 sticky bottom-0 border-t px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          {step > 0 && (
            <Button variant="surface" size="lg" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft />
              <span className="hidden sm:inline">Назад</span>
            </Button>
          )}
          <Button
            size="lg"
            className="flex-1"
            variant={isLast ? 'accent' : 'primary'}
            onClick={() => (isLast ? setPhase('exercises') : setStep((s) => s + 1))}
          >
            {isLast ? (
              <>
                <Dumbbell /> До вправ ({lesson.exercises.length})
              </>
            ) : (
              <>
                Далі <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </footer>
    </FullScreen>
  )
}

/* ------------------------------------------------------------------ *
 * Step renderers
 * ------------------------------------------------------------------ */

function StepView({ step }: { step: LessonStep }) {
  switch (step.kind) {
    case 'intro':
      return (
        <section>
          <Eyebrow>Вступ</Eyebrow>
          <Title>{step.title}</Title>
          <RichText className="mt-5">{step.body}</RichText>
        </section>
      )

    case 'vocab': {
      const words = getWords(step.words)
      return (
        <section>
          <Eyebrow>Нові слова · {words.length}</Eyebrow>
          <Title>{step.title}</Title>
          <p className="text-fg-muted mt-3 text-sm">
            Натисни на динамік, щоб почути. Закладка зберігає слово в зошит.
          </p>
          <div className="mt-6 space-y-2.5">
            {words.map((w) => (
              <WordCard key={w.id} word={w} />
            ))}
          </div>
        </section>
      )
    }

    case 'grammar':
      return (
        <section>
          <Eyebrow>Граматика</Eyebrow>
          <Title>{step.title}</Title>
          <RichText className="mt-5">{step.body}</RichText>

          {step.table && <Table table={step.table} className="mt-6" />}

          {step.examples && (
            <div className="mt-6 space-y-2.5">
              {step.examples.map((ex, i) => (
                <SpokenLine
                  key={i}
                  fr={ex.fr}
                  uk={ex.uk}
                  className="border-line bg-surface rounded-xl border p-3.5"
                />
              ))}
            </div>
          )}

          {step.warning && <Warning>{step.warning}</Warning>}

          <QuickCheck examples={step.examples ?? []} />
        </section>
      )

    case 'dialogue':
      return <DialogueStep step={step} />

    case 'pronunciation':
      return (
        <section>
          <Eyebrow>Вимова</Eyebrow>
          <Title>{step.title}</Title>
          <RichText className="mt-5">{step.body}</RichText>

          <div className="mt-6 space-y-2.5">
            {step.pairs.map((p, i) => (
              <div
                key={i}
                className="border-line bg-surface hover:border-line-strong flex items-center gap-3.5 rounded-xl border p-4 transition-colors"
              >
                <SpeakButton text={p.fr} size="sm" slow />
                <div className="min-w-0 flex-1">
                  <div className="fr font-display text-lg leading-tight font-semibold">{p.fr}</div>
                  <div className="text-fg-subtle mt-0.5 font-mono text-[11.5px]">[{p.ipa}]</div>
                  <div className="text-fg-muted mt-1 text-[13px] text-pretty">{p.uk}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )
  }
}

/**
 * A dialogue, three ways.
 *
 * Reading it with the text in view is the least the learner can do with it,
 * and the least useful. Hearing it first, with the French hidden, is how
 * listening actually gets trained: the ear has to do the work before the eye
 * is allowed to check. And saying each line back after the voice — shadowing —
 * is the closest thing to conversation practice that needs nobody else in the
 * room. The pause after each line scales with its length, so there is time to
 * say it and not so much that it feels like the app has stalled.
 */
type DialogueMode = 'read' | 'listen' | 'shadow'

function DialogueStep({ step }: { step: Extract<LessonStep, { kind: 'dialogue' }> }) {
  const [mode, setMode] = useState<DialogueMode>('read')
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState<number | null>(null)
  const [yourTurn, setYourTurn] = useState(false)
  const rate = useSettings((s) => s.rate)
  const voiceURI = useSettings((s) => s.voiceURI)
  const voiceName = useSettings((s) => s.voiceName)
  const { speak, stop } = useSpeak()
  const run = useRef(0)

  // Leaving the step must not leave the dialogue running.
  useEffect(() => () => void (run.current += 1), [])

  const hidden = (i: number) => mode === 'listen' && !revealed.has(i)

  const playAll = async () => {
    if (playing) {
      run.current += 1
      stop()
      setPlaying(false)
      setCurrent(null)
      setYourTurn(false)
      return
    }
    const mine = ++run.current
    setPlaying(true)
    const lines = step.lines.map((l) => l.fr)

    if (mode !== 'shadow') {
      await speakSequence(lines, {
        rate,
        voiceURI: voiceURI ?? undefined,
        voiceName: voiceName ?? undefined,
        gapMs: 360,
        onPart: setCurrent,
      })
    } else {
      for (let i = 0; i < lines.length; i++) {
        if (run.current !== mine) return
        setCurrent(i)
        setYourTurn(false)
        await new Promise<void>((resolve) => speak(lines[i], { onEnd: resolve }))
        if (run.current !== mine) return
        setYourTurn(true)
        await new Promise((r) => setTimeout(r, estimateMs(lines[i], rate) + 500))
      }
    }
    if (run.current !== mine) return
    setPlaying(false)
    setCurrent(null)
    setYourTurn(false)
  }

  const choose = (next: DialogueMode) => {
    if (playing) void playAll()
    setMode(next)
    setRevealed(new Set())
  }

  return (
    <section>
      <Eyebrow>Діалог</Eyebrow>
      <Title>{step.title}</Title>
      <p className="text-fg-subtle mt-2 text-sm italic">{step.setting}</p>

      <div className="border-line bg-surface-2 mt-5 inline-flex rounded-xl border p-1">
        {(
          [
            ['read', 'Читати'],
            ['listen', 'Спочатку слухати'],
            ['shadow', 'Повторювати за диктором'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => choose(id)}
            aria-pressed={mode === id}
            className={cn(
              'rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors',
              mode === id ? 'bg-surface text-fg shadow-sm' : 'text-fg-muted hover:text-fg',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'listen' && (
        <p className="text-fg-muted mt-3 text-[13px] text-pretty">
          Французький текст сховано. Прослухай, спробуй зрозуміти — і відкривай рядки, щоб
          перевірити себе.
        </p>
      )}
      {mode === 'shadow' && (
        <p className="text-fg-muted mt-3 text-[13px] text-pretty">
          Після кожної репліки — пауза для тебе. Повторюй уголос, копіюючи ритм та інтонацію.
        </p>
      )}

      <div className="mt-5 space-y-3">
        {step.lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              'rounded-2xl border p-4 transition-colors',
              i % 2 === 0 ? 'bg-surface' : 'bg-surface-2',
              current === i ? 'border-primary' : 'border-line',
            )}
          >
            {hidden(i) ? (
              <div className="flex items-center gap-3">
                <SpeakButton text={line.fr} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-fg-subtle mb-1 text-[12px] font-medium">{line.speaker}</div>
                  <button
                    type="button"
                    onClick={() => setRevealed((r) => new Set(r).add(i))}
                    className="text-primary inline-flex items-center gap-1.5 text-[13px] font-medium underline-offset-4 hover:underline"
                  >
                    <Eye className="size-3.5" /> Показати текст
                  </button>
                </div>
              </div>
            ) : (
              <SpokenLine
                fr={line.fr}
                uk={line.uk}
                frClassName="text-[16px]"
                ukClassName="mt-1 text-[13.5px]"
                above={
                  <div className="text-fg-subtle mb-1 text-[12px] font-medium">{line.speaker}</div>
                }
              />
            )}
            {mode === 'shadow' && current === i && yourTurn && (
              <div className="text-accent mt-3 flex items-center gap-2 text-[13px] font-medium">
                <Mic className="size-4" /> Твоя черга — повтори
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        <Button variant={playing ? 'soft' : 'surface'} onClick={playAll}>
          {playing ? <Square /> : <Volume2 />}
          {playing
            ? 'Зупинити'
            : mode === 'shadow'
              ? 'Почати повторення'
              : 'Прослухати весь діалог'}
        </Button>
        {mode === 'listen' && (
          <Button
            variant="ghost"
            onClick={() =>
              setRevealed((r) =>
                r.size === step.lines.length ? new Set() : new Set(step.lines.map((_, i) => i)),
              )
            }
          >
            {revealed.size === step.lines.length ? <EyeOff /> : <Eye />}
            {revealed.size === step.lines.length ? 'Сховати весь текст' : 'Показати весь текст'}
          </Button>
        )}
      </div>
    </section>
  )
}

/**
 * A rule checked the moment it is read.
 *
 * Some grammar steps show a wrong form next to the right one — "❌ Suis
 * étudiant" beside "✅ Je suis étudiant". Reading the pair is one exposure;
 * being asked which is which, with the rule still on screen, is retrieval,
 * and retrieval is what makes it stay. The pairs are already in the content;
 * this only asks about them.
 */
function QuickCheck({ examples }: { examples: { fr: string; uk: string }[] }) {
  const pairs = useMemo(() => {
    const out: { wrong: string; right: string; uk: string }[] = []
    for (let i = 0; i < examples.length - 1; i++) {
      const a = examples[i]
      const b = examples[i + 1]
      if (a.fr.startsWith('❌') && b.fr.startsWith('✅')) {
        out.push({
          wrong: a.fr.replace(/^❌\s*/, ''),
          right: b.fr.replace(/^✅\s*/, ''),
          uk: b.uk,
        })
      }
    }
    return out
  }, [examples])
  const [picked, setPicked] = useState<Record<number, string>>({})
  const { speak } = useSpeak()

  // Shuffled once per step, so the right answer is not always on one side.
  const order = useMemo(
    () => pairs.map((_, i) => (i + examples.length) % 2 === 0),
    [pairs, examples.length],
  )

  if (!pairs.length) return null

  return (
    <div className="border-line bg-surface-2 mt-6 rounded-2xl border p-4">
      <div className="text-fg mb-3 text-[14px] font-medium">Швидка перевірка: як правильно?</div>
      <div className="space-y-3">
        {pairs.map((pair, i) => {
          const options = order[i] ? [pair.right, pair.wrong] : [pair.wrong, pair.right]
          const chosen = picked[i]
          return (
            <div key={i}>
              <div className="grid gap-2 sm:grid-cols-2">
                {options.map((opt) => {
                  const isRight = opt === pair.right
                  const state = !chosen
                    ? 'idle'
                    : isRight
                      ? 'right'
                      : opt === chosen
                        ? 'wrong'
                        : 'idle'
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        if (!chosen) setPicked((p) => ({ ...p, [i]: opt }))
                        speak(opt)
                      }}
                      className={cn(
                        'fr rounded-xl border-2 px-3.5 py-2.5 text-left text-[15px] font-medium transition-colors',
                        state === 'idle' && 'border-line bg-surface hover:border-line-strong',
                        state === 'right' && 'border-success bg-success-soft text-success',
                        state === 'wrong' && 'border-danger bg-danger-soft text-danger',
                      )}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
              {chosen && (
                <p
                  className={cn(
                    'mt-1.5 text-[13px]',
                    chosen === pair.right ? 'text-success' : 'text-danger',
                  )}
                >
                  {chosen === pair.right ? 'Так. ' : 'Ні — правильно друге. '}
                  <span className="text-fg-muted">{pair.uk}</span>
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-accent mb-2 text-[12.5px] font-medium">{children}</div>
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance">
      {children}
    </h1>
  )
}

export function Warning({ children }: { children: string }) {
  return (
    <div className="border-warning/30 bg-warning-soft mt-6 flex gap-3 rounded-2xl border p-4">
      <AlertTriangle className="text-warning mt-0.5 size-5 shrink-0" />
      <p className="text-fg text-[14px] leading-relaxed text-pretty">
        <SpeakInline>{children}</SpeakInline>
      </p>
    </div>
  )
}

/**
 * A table cell you can tap to hear.
 *
 * Conjugation tables are where a learner most wants audio and least wants
 * clutter — a speaker icon in sixty cells would drown the table it is meant to
 * serve. So the cell itself is the button, and only when there is French in it.
 */
function SpeakCell({ children }: { children: string }) {
  const { speak } = useSpeak()
  const french = frenchIn(children)

  if (!french) return <Inline>{children}</Inline>

  return (
    <button
      type="button"
      onClick={() => speak(french)}
      aria-label={`Прослухати: ${french}`}
      className="hover:text-primary decoration-primary/30 hover:decoration-primary cursor-pointer text-left underline decoration-dotted decoration-1 underline-offset-4 transition-colors"
    >
      <Inline>{children}</Inline>
    </button>
  )
}

export function Table({ table, className }: { table: GrammarTable; className?: string }) {
  return (
    <figure className={className}>
      {table.caption && (
        <figcaption className="text-fg-muted mb-2 text-[12.5px] font-medium">
          <Inline>{table.caption}</Inline>
        </figcaption>
      )}
      <div className="border-line overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-full border-collapse text-left text-[14px]">
          <thead>
            <tr className="bg-surface-2">
              {table.head.map((h) => (
                <th
                  key={h}
                  className="text-fg-subtle px-4 py-2.5 text-[12.5px] font-medium whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className="border-line bg-surface border-t">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      'px-4 py-2.5 align-top',
                      j === 1 && 'fr text-fg font-medium',
                      j !== 1 && 'text-fg-muted',
                    )}
                  >
                    <SpeakCell>{cell}</SpeakCell>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
