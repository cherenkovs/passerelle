import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Lightbulb, Mic, MicOff, Send, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LevelChip, PageHeader } from '@/components/common/misc'
import { SpeakButton, Spoken, useSpeak } from '@/components/common/speak'
import { FullScreen } from '@/components/layout/full-screen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { SCENARIOS, getScenario, type TutorTurn } from '@/content'
import { agree, bothForms } from '@/lib/agreement'
import { gradeAnswer } from '@/lib/grade'
import { listenOnce, supportsSTT } from '@/lib/speech'
import { cn } from '@/lib/utils'
import { useActiveProfile, useGender, useLearner } from '@/store/learner'
import { useSettings } from '@/store/settings'

/* ------------------------------------------------------------------ *
 * Index
 * ------------------------------------------------------------------ */

export function TutorPage() {
  const profile = useActiveProfile()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Розмовна практика"
        title="Розмова з учителем"
        description="Рольові сценарії з реального життя. Учитель говорить французькою — ти відповідаєш голосом або з клавіатури, і одразу бачиш, що саме варто виправити."
      />

      <Card className="border-dashed p-5">
        <div className="text-fg-muted flex items-start gap-3 text-[13.5px] leading-relaxed text-pretty">
          <Sparkles className="text-accent mt-0.5 size-4 shrink-0" />
          <span>
            Сценарії написані вручну, а не згенеровані моделлю. Тому фідбек точний («забув артикль»,
            «це форма для tu, а тут потрібне vous»), нічого не коштує.
          </span>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {SCENARIOS.map((s) => {
          const best = profile?.scenarios[s.id]?.best
          return (
            <Link
              key={s.id}
              to={`/tutor/${s.id}`}
              className="group border-line bg-surface hover:border-line-strong rounded-2xl border p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl">{s.emoji}</span>
                <div className="flex items-center gap-2">
                  {best !== undefined && (
                    <Badge variant="success" size="sm">
                      <Check /> {best}%
                    </Badge>
                  )}
                  <LevelChip level={s.level} />
                </div>
              </div>

              <h3 className="font-display mt-4 text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="text-fg-muted mt-2 text-[13.5px] leading-snug text-pretty">
                {s.setting}
              </p>

              <div className="border-line mt-4 border-t pt-3">
                <div className="text-fg-subtle text-[12px] font-medium">Мета</div>
                <p className="text-fg-muted mt-1 text-[13px] text-pretty">{s.goal}</p>
              </div>

              <div className="text-fg-subtle mt-3 text-[12px]">{s.turns.length} реплік</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Conversation
 * ------------------------------------------------------------------ */

type Entry =
  | { role: 'teacher'; turn: TutorTurn }
  | { role: 'learner'; text: string; status: 'correct' | 'almost' | 'wrong'; expected: string }

export function ScenarioPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const recordScenario = useLearner((s) => s.recordScenario)
  const addXp = useLearner((s) => s.addXp)
  const autoSpeak = useSettings((s) => s.autoSpeak)
  const gender = useGender()
  const { speak } = useSpeak()

  const scenario = getScenario(id)

  const [index, setIndex] = useState(0)
  const [entries, setEntries] = useState<Entry[]>([])
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const [scores, setScores] = useState<number[]>([])
  const [finished, setFinished] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const stopRef = useRef<(() => void) | null>(null)
  const started = useRef(false)

  const turn = scenario?.turns[index]

  // Open with the teacher's first line.
  useEffect(() => {
    if (!scenario || started.current) return
    started.current = true
    setEntries([{ role: 'teacher', turn: scenario.turns[0] }])
    if (autoSpeak) setTimeout(() => speak(scenario.turns[0].teacher.fr), 420)
  }, [autoSpeak, scenario, speak])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [entries, finished])

  if (!scenario) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="text-center">
          <p className="text-fg-muted">Сценарій не знайдено.</p>
          <Button className="mt-4" onClick={() => navigate('/tutor')}>
            До сценаріїв
          </Button>
        </div>
      </div>
    )
  }

  const submit = (raw: string) => {
    if (!turn || !raw.trim()) return

    // Either agreement is accepted, whatever the learner picked in settings:
    // the tutor is practising conversation, not marking adjective endings.
    const res = gradeAnswer(raw, turn.expected.accept.flatMap(bothForms), {
      acceptPrefixes: turn.expected.acceptPrefixes,
    })
    const score = res.status === 'correct' ? 1 : res.status === 'almost' ? 0.6 : 0

    setEntries((e) => [
      ...e,
      {
        role: 'learner',
        text: raw.trim(),
        status: res.status,
        expected: agree(turn.expected.fr, gender),
      },
    ])
    setScores((s) => [...s, score])
    setInput('')
    setHintOpen(false)
    addXp(res.status === 'wrong' ? 2 : 8, 1, res.status === 'wrong' ? 0 : 1)

    const nextIndex = index + 1
    setTimeout(() => {
      if (nextIndex < scenario.turns.length) {
        const next = scenario.turns[nextIndex]
        setEntries((e) => [...e, { role: 'teacher', turn: next }])
        setIndex(nextIndex)
        if (autoSpeak) speak(next.teacher.fr)
      } else {
        const all = [...scores, score]
        const pct = Math.round((all.reduce((a, b) => a + b, 0) / all.length) * 100)
        recordScenario(scenario.id, pct)
        setFinished(true)
      }
    }, 900)
  }

  const record = async () => {
    if (listening) {
      stopRef.current?.()
      return
    }
    setListening(true)
    const handle = listenOnce({ lang: 'fr-FR', onInterim: setInput })
    stopRef.current = handle.stop
    try {
      const transcript = await handle.result
      setListening(false)
      if (transcript) submit(transcript)
    } catch {
      setListening(false)
    }
  }

  const pct = scores.length
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100)
    : 0

  return (
    <FullScreen>
      <header className="border-line bg-bg/85 sticky top-0 z-30 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-3.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate('/tutor')}
            aria-label="Вийти"
          >
            <X />
          </Button>
          <div className="min-w-0 flex-1">
            <div className="text-fg-muted truncate text-[12px] font-medium">
              {scenario.emoji} {scenario.title}
            </div>
            <Progress
              value={
                (Math.min(index + (finished ? 1 : 0), scenario.turns.length) /
                  scenario.turns.length) *
                100
              }
              className="mt-1.5 h-1.5"
            />
          </div>
          <span className="text-fg-subtle shrink-0 text-[12px] tabular-nums">
            {Math.min(index + 1, scenario.turns.length)}/{scenario.turns.length}
          </span>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="bg-surface-2 text-fg-muted rounded-xl px-4 py-3 text-[13px] text-pretty italic">
            {scenario.setting}
          </div>

          <AnimatePresence initial={false}>
            {entries.map((entry, i) =>
              entry.role === 'teacher' ? (
                <TeacherBubble key={i} turn={entry.turn} />
              ) : (
                <LearnerBubble key={i} entry={entry} />
              ),
            )}
          </AnimatePresence>

          {finished && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface rounded-2xl border p-6 text-center shadow-[var(--shadow-card)]"
            >
              <span
                className={cn(
                  'mx-auto grid size-12 place-items-center rounded-2xl',
                  pct >= 70 ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning',
                )}
              >
                <Check className="size-6" />
              </span>
              <h2 className="font-display mt-4 text-xl font-semibold">Розмову завершено</h2>
              <div className="font-display mt-3 text-4xl font-semibold tabular-nums">{pct}%</div>
              <p className="text-fg-muted mt-2 text-sm text-pretty">
                {pct >= 85
                  ? 'Відмінно — ти б упорався в реальній ситуації.'
                  : pct >= 60
                    ? 'Добре. Повтори сценарій, щоб фрази стали автоматичними.'
                    : 'Прочитай очікувані репліки ще раз і спробуй знову — це нормально.'}
              </p>
              <div className="mt-6 flex gap-3">
                <Button
                  variant="surface"
                  className="flex-1"
                  onClick={() => window.location.reload()}
                >
                  Ще раз
                </Button>
                <Button className="flex-1" onClick={() => navigate('/tutor')}>
                  Готово <ArrowRight />
                </Button>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {!finished && turn && (
        <footer className="border-line bg-bg/90 sticky bottom-0 border-t px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md">
          <div className="mx-auto max-w-2xl space-y-3">
            <AnimatePresence>
              {hintOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border-warning/30 bg-warning-soft rounded-xl border px-4 py-3 text-[13px] leading-relaxed">
                    <div className="text-warning font-medium">
                      {turn.hint ?? 'Очікувана відповідь:'}
                    </div>
                    <div className="mt-1.5 flex items-start gap-1.5">
                      <div className="fr text-fg flex-1">{agree(turn.expected.fr, gender)}</div>
                      <SpeakButton
                        text={agree(turn.expected.fr, gender)}
                        size="sm"
                        className="-mt-0.5 shrink-0"
                      />
                    </div>
                    <div className="text-fg-muted">{turn.expected.uk}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2">
              {supportsSTT() && (
                <button
                  type="button"
                  onClick={record}
                  className={cn(
                    'relative grid size-11 shrink-0 place-items-center rounded-xl transition-colors',
                    listening ? 'bg-danger text-white' : 'bg-primary text-primary-fg',
                  )}
                  aria-label={listening ? 'Зупинити' : 'Говорити'}
                >
                  {listening && (
                    <motion.span
                      className="bg-danger/30 absolute inset-0 rounded-xl"
                      animate={{ scale: [1, 1.25], opacity: [0.6, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  )}
                  {listening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
                </button>
              )}

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit(input)
                }}
                placeholder={listening ? 'Слухаю…' : 'Відповідай французькою…'}
                lang="fr"
                autoComplete="off"
                spellCheck={false}
                className="fr h-11 flex-1"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setHintOpen((v) => !v)}
                aria-label="Підказка"
              >
                <Lightbulb className={cn(hintOpen && 'text-warning')} />
              </Button>

              <Button
                size="icon"
                onClick={() => submit(input)}
                disabled={!input.trim()}
                aria-label="Надіслати"
              >
                <Send />
              </Button>
            </div>
          </div>
        </footer>
      )}
    </FullScreen>
  )
}

function TeacherBubble({ turn }: { turn: TutorTurn }) {
  const [showUk, setShowUk] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      className="flex gap-3"
    >
      <span className="bg-primary-soft grid size-9 shrink-0 place-items-center rounded-full text-base">
        👩‍🏫
      </span>
      <div className="border-line bg-surface max-w-[85%] min-w-0 rounded-2xl rounded-tl-md border px-4 py-3 shadow-[var(--shadow-card)]">
        <Spoken text={turn.teacher.fr} size="sm">
          {({ controls, text }) => (
            <div className="flex items-start gap-2.5">
              <div className="fr min-w-0 flex-1 text-[15.5px] leading-snug">{text}</div>
              <span className="shrink-0">{controls}</span>
            </div>
          )}
        </Spoken>
        <button
          type="button"
          onClick={() => setShowUk((v) => !v)}
          className="text-primary mt-1.5 text-[12px] font-medium underline-offset-4 hover:underline"
        >
          {showUk ? 'сховати' : 'переклад'}
        </button>
        {showUk && <div className="text-fg-muted mt-1 text-[13px]">{turn.teacher.uk}</div>}
      </div>
    </motion.div>
  )
}

function LearnerBubble({ entry }: { entry: Extract<Entry, { role: 'learner' }> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      className="flex justify-end gap-3"
    >
      <div
        className={cn(
          'max-w-[85%] min-w-0 rounded-2xl rounded-tr-md border px-4 py-3',
          entry.status === 'correct' && 'border-success-border bg-success-soft',
          entry.status === 'almost' && 'border-warning/35 bg-warning-soft',
          entry.status === 'wrong' && 'border-danger-border bg-danger-soft',
        )}
      >
        <div className="flex items-start gap-1.5">
          <div className="fr text-fg flex-1 text-[15.5px] leading-snug">{entry.text}</div>
          <SpeakButton text={entry.text} size="sm" className="shrink-0" />
        </div>
        {entry.status !== 'correct' && (
          <div className="mt-2 border-t border-current/10 pt-2 text-[12.5px]">
            <div className="text-fg-muted">Природніше:</div>
            <div className="flex items-start gap-1.5">
              <span className="fr text-fg flex-1 font-medium">{entry.expected}</span>
              <SpeakButton text={entry.expected} size="sm" className="-mt-0.5 shrink-0" />
            </div>
          </div>
        )}
      </div>
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-full text-base',
          entry.status === 'correct' ? 'bg-success-soft' : 'bg-surface-2',
        )}
      >
        {entry.status === 'correct' ? '✅' : entry.status === 'almost' ? '🟡' : '🙂'}
      </span>
    </motion.div>
  )
}
