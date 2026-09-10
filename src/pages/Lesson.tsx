import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, ArrowRight, Dumbbell, Volume2, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Inline, RichText, SpeakInline } from '@/components/common/rich-text'
import { SpeakButton, TapText, useSpeak } from '@/components/common/speak'
import { WordCard } from '@/components/common/word-card'
import { ExerciseRunner } from '@/components/exercises/runner'
import { FullScreen } from '@/components/layout/full-screen'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getLesson, getWords, moduleOfLesson, type GrammarTable, type LessonStep } from '@/content'
import { frenchIn, speak as speakRaw } from '@/lib/speech'
import { cn } from '@/lib/utils'
import { useLearner } from '@/store/learner'

export function LessonPage() {
  const { id = '' } = useParams()
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
          <span className="text-fg-subtle shrink-0 font-mono text-[12px] tabular-nums">
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
                <div
                  key={i}
                  className="border-line bg-surface flex items-start gap-3 rounded-xl border p-3.5"
                >
                  <SpeakButton text={ex.fr.replace(/^[❌✅]\s*/, '')} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="fr text-[15px] leading-snug font-medium">
                      <TapText>{ex.fr}</TapText>
                    </div>
                    <div className="text-fg-muted mt-0.5 text-[13px]">{ex.uk}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step.warning && <Warning>{step.warning}</Warning>}
        </section>
      )

    case 'dialogue':
      return (
        <section>
          <Eyebrow>Діалог</Eyebrow>
          <Title>{step.title}</Title>
          <p className="text-fg-subtle mt-2 text-sm italic">{step.setting}</p>

          <div className="mt-6 space-y-3">
            {step.lines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  'border-line rounded-2xl border p-4',
                  i % 2 === 0 ? 'bg-surface' : 'bg-surface-2',
                )}
              >
                <div className="text-accent mb-1.5 text-[11px] font-semibold tracking-wider uppercase">
                  {line.speaker}
                </div>
                <div className="flex items-start gap-3">
                  <SpeakButton text={line.fr} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="fr text-[16px] leading-snug font-medium">
                      <TapText>{line.fr}</TapText>
                    </div>
                    <div className="text-fg-muted mt-1 text-[13.5px]">{line.uk}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <PlayAll lines={step.lines.map((l) => l.fr)} />
          </div>
        </section>
      )

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

function PlayAll({ lines }: { lines: string[] }) {
  const [playing, setPlaying] = useState(false)

  const play = async () => {
    setPlaying(true)
    for (const line of lines) {
      await new Promise<void>((resolve) => {
        void speakRaw(line, { onEnd: resolve })
      })
      await new Promise((r) => setTimeout(r, 320))
    }
    setPlaying(false)
  }

  return (
    <Button variant="surface" onClick={play} disabled={playing}>
      <Volume2 /> {playing ? 'Відтворюється…' : 'Прослухати весь діалог'}
    </Button>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-accent mb-2 text-[12px] font-semibold tracking-wider uppercase">
      {children}
    </div>
  )
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
                  className="text-fg-subtle px-4 py-2.5 text-[12px] font-semibold tracking-wider whitespace-nowrap uppercase"
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
