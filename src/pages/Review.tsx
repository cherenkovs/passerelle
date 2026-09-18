import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, Keyboard, Layers, RotateCcw, Sparkles, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState, PageHeader, StatTile } from '@/components/common/misc'
import { SpeakButton, useSpeak } from '@/components/common/speak'
import { ExerciseRunner } from '@/components/exercises/runner'
import { FullScreen } from '@/components/layout/full-screen'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  WORDS,
  findExercise,
  findExercises,
  generateVocabExercises,
  getWord,
  type Exercise,
} from '@/content'
import { previewInterval, type Rating, type SrsCard } from '@/lib/srs'
import { cn, pluralUk, todayKey } from '@/lib/utils'
import { exerciseOfCard, isSentenceCard, useActiveProfile, useLearner } from '@/store/learner'
import { useSettings } from '@/store/settings'

type Mode = 'idle' | 'cards' | 'drill' | 'mistakes'

export function ReviewPage() {
  const navigate = useNavigate()
  const profile = useActiveProfile()
  const resolveMistakesFor = useLearner((s) => s.resolveMistakesFor)
  const [mode, setMode] = useState<Mode>('idle')
  /**
   * The mistakes deck is snapshotted when it starts, not read live.
   *
   * Two reasons. Answering correctly removes the mistake, so a live list would
   * shrink under the learner and — once the last one cleared — unmount the
   * runner before it could show the summary. And a set of questions that
   * changes mid-run is wrong on its own terms.
   */
  const [mistakeDeck, setMistakeDeck] = useState<Exercise[]>([])

  const dueCards = useMemo(() => {
    if (!profile) return []
    const today = todayKey()
    return Object.values(profile.srs)
      .filter((c) => c.due <= today)
      .sort((a, b) => a.due.localeCompare(b.due))
  }, [profile])

  const dueIds = dueCards.map((c) => c.id)

  if (!profile) return null

  if (mode === 'cards' && dueIds.length) {
    return <FlashcardSession cards={dueCards} onExit={() => setMode('idle')} />
  }

  if (mode === 'drill' && dueIds.length) {
    // Words become generated drills; sentence cards are their own cloze,
    // straight from the lesson — the gap is the recall.
    const due = dueIds.slice(0, 20)
    const sentences = due
      .filter(isSentenceCard)
      .map((id) => findExercise(exerciseOfCard(id)))
      .filter((e): e is Exercise => Boolean(e))
    const drills = [
      ...generateVocabExercises(
        due.filter((id) => !isSentenceCard(id)),
        WORDS,
      ),
      ...sentences,
    ]
    return (
      <ExerciseRunner
        exercises={drills}
        title="Тренування словника"
        subtitle="Згенеровано з карток, які сьогодні на повторенні"
        onExit={() => setMode('idle')}
        finishLabel="Готово"
      />
    )
  }

  if (mode === 'mistakes' && mistakeDeck.length) {
    return (
      <ExerciseRunner
        exercises={mistakeDeck}
        title="Робота над помилками"
        subtitle="Завдання, у яких ти помилявся"
        onExit={() => setMode('idle')}
        finishLabel="Готово"
        // Getting it right is what takes it out of the deck. Without this the
        // counter never moved, however many times the learner cleared it.
        onFinish={(res) => resolveMistakesFor(res.correctIds)}
      />
    )
  }

  const total = Object.keys(profile.srs).length
  const learning = Object.values(profile.srs).filter((c) => c.interval < 7).length
  const mature = total - learning

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Інтервальні повторення"
        title="Повторення"
        description="Алгоритм SM-2 сам вирішує, коли показати кожне слово — саме перед тим, як ти його забудеш. Це найефективніші 10 хвилин твого дня."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          icon={Layers}
          tone="primary"
          label="До повторення"
          value={dueIds.length}
          hint="Сьогодні"
        />
        <StatTile icon={Sparkles} label="У вивченні" value={learning} hint="Інтервал < 7 днів" />
        <StatTile
          icon={Check}
          tone="success"
          label="Закріплено"
          value={mature}
          hint="Інтервал ≥ 7 днів"
        />
      </div>

      {dueIds.length > 0 ? (
        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {dueIds.length} {pluralUk(dueIds.length, ['картка', 'картки', 'карток'])} чекає
          </h2>
          <p className="text-fg-muted mt-1.5 text-sm text-pretty">
            Обери формат. Картки швидші, ввід з клавіатури — ефективніший.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode('cards')}
              className="group border-line bg-surface hover:border-primary hover:bg-primary-soft/40 rounded-2xl border-2 p-5 text-left transition-colors"
            >
              <Layers className="text-primary size-6" />
              <div className="font-display mt-3 text-base font-semibold">Картки</div>
              <p className="text-fg-muted mt-1 text-[13px] leading-snug text-pretty">
                Класичний формат: згадай — переверни — оціни себе
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('drill')}
              className="group border-line bg-surface hover:border-primary hover:bg-primary-soft/40 rounded-2xl border-2 p-5 text-left transition-colors"
            >
              <Keyboard className="text-primary size-6" />
              <div className="font-display mt-3 text-base font-semibold">Ввід з клавіатури</div>
              <p className="text-fg-muted mt-1 text-[13px] leading-snug text-pretty">
                Активне пригадування — важче, але запам’ятовується краще
              </p>
            </button>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={Check}
          title="На сьогодні все повторено"
          description={
            total === 0
              ? 'Картки з’являться автоматично, щойно ти пройдеш перший урок.'
              : 'Повертайся завтра — алгоритм підготує наступну порцію.'
          }
          action={
            <Button onClick={() => navigate(total === 0 ? '/course' : '/vocabulary')}>
              {total === 0 ? 'До курсу' : 'Переглянути словник'}
            </Button>
          }
        />
      )}

      {/* Mistakes deck */}
      {profile.mistakes.length > 0 && (
        <Card className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="bg-danger-soft text-danger grid size-11 shrink-0 place-items-center rounded-xl">
              <AlertCircle className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-semibold tracking-tight">Мої помилки</h3>
              <p className="text-fg-muted mt-0.5 text-[13px] text-pretty">
                {profile.mistakes.length}{' '}
                {pluralUk(profile.mistakes.length, ['завдання', 'завдання', 'завдань'])}, у яких ти
                помилявся. Ця колода створюється автоматично.
              </p>
            </div>
            <Button
              variant="surface"
              onClick={() => {
                setMistakeDeck(findExercises(profile.mistakes.map((m) => m.exerciseId)))
                setMode('mistakes')
              }}
            >
              <RotateCcw /> Опрацювати
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Flashcard session
 * ------------------------------------------------------------------ */

/**
 * What a card shows, whichever kind it is.
 *
 * A word card asks for the translation. A sentence card asks for the missing
 * word — the sentence with its gap on the front, filled in on the back — so
 * the recall is of the word in the place it lives, not in isolation.
 */
type Face = {
  kind: 'word' | 'sentence'
  front: string
  frontLabel: string
  back: string
  backLabel: string
  /** What the speaker button says: the word, or the whole sentence. */
  speak: string
  hint: string
  ipa?: string
  example?: { fr: string; uk: string }
  note?: string
}

function faceOf(cardId: string): Face | undefined {
  if (!isSentenceCard(cardId)) {
    const word = getWord(cardId)
    if (!word) return undefined
    return {
      kind: 'word',
      front: word.fr,
      frontLabel: 'Французькою',
      back: word.uk,
      backLabel: 'Переклад',
      speak: word.fr,
      hint: 'Згадай переклад, потім натисни, щоб перевірити',
      ipa: word.ipa,
      example: word.example,
      note: word.note,
    }
  }
  const ex = findExercise(exerciseOfCard(cardId))
  if (!ex || ex.kind !== 'cloze') return undefined
  const answer = ex.answer[0] ?? ''
  return {
    kind: 'sentence',
    front: ex.sentence.replace(/_{2,}/, '______'),
    frontLabel: 'Яке слово пропущено?',
    back: ex.translation,
    backLabel: 'Речення повністю',
    speak: ex.sentence.replace(/_{2,}/, answer),
    hint: ex.hint ? `Підказка: ${ex.hint}` : 'Згадай слово, потім натисни, щоб перевірити',
    note: ex.explain,
  }
}

const RATINGS: { key: Rating; label: string; className: string }[] = [
  { key: 'again', label: 'Забув', className: 'border-danger text-danger hover:bg-danger-soft' },
  { key: 'hard', label: 'Важко', className: 'border-warning text-warning hover:bg-warning-soft' },
  { key: 'good', label: 'Добре', className: 'border-primary text-primary hover:bg-primary-soft' },
  { key: 'easy', label: 'Легко', className: 'border-success text-success hover:bg-success-soft' },
]

function FlashcardSession({ cards, onExit }: { cards: SrsCard[]; onExit: () => void }) {
  const reviewCard = useLearner((s) => s.reviewCard)
  const addXp = useLearner((s) => s.addXp)
  const autoSpeak = useSettings((s) => s.autoSpeak)
  const showIpa = useSettings((s) => s.showIpa)
  const { speak } = useSpeak()

  // A card with nothing to show — an exercise since removed from the course —
  // is skipped rather than ending the session in front of it.
  const [queue, setQueue] = useState(() => cards.filter((c) => faceOf(c.id)))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [reviewed, setReviewed] = useState(0)

  const card = queue[index]
  const face = card ? faceOf(card.id) : undefined

  const rate = (rating: Rating) => {
    if (!card) return
    reviewCard(card.id, rating)
    addXp(rating === 'again' ? 1 : 4, 1, rating === 'again' ? 0 : 1)
    setReviewed((n) => n + 1)
    setFlipped(false)

    if (rating === 'again') {
      // Put it back near the end of this session.
      setQueue((q) => {
        const rest = q.filter((_, i) => i !== index)
        const insertAt = Math.min(rest.length, index + 3)
        return [...rest.slice(0, insertAt), q[index], ...rest.slice(insertAt)]
      })
    } else {
      setQueue((q) => q.filter((_, i) => i !== index))
    }
    setIndex(0)
  }

  if (!card || !face) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-line bg-surface w-full max-w-sm rounded-3xl border p-8 text-center shadow-[var(--shadow-lift)]"
        >
          <span className="bg-success-soft text-success mx-auto grid size-14 place-items-center rounded-2xl">
            <Check className="size-7" />
          </span>
          <h2 className="font-display mt-5 text-2xl font-semibold">Сесію завершено</h2>
          <p className="text-fg-muted mt-2 text-sm">
            Повторено {reviewed} {pluralUk(reviewed, ['картку', 'картки', 'карток'])}
          </p>
          <Button className="mt-7 w-full" size="lg" onClick={onExit}>
            Готово
          </Button>
        </motion.div>
      </div>
    )
  }

  const remaining = queue.length

  return (
    <FullScreen>
      <header className="border-line bg-bg/85 sticky top-0 z-30 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 py-3.5">
          <Button variant="ghost" size="icon-sm" onClick={onExit} aria-label="Вийти">
            <X />
          </Button>
          <Progress
            value={(reviewed / Math.max(1, reviewed + remaining)) * 100}
            className="flex-1"
          />
          <span className="text-fg-subtle text-[12px] tabular-nums">{remaining} лишилось</span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.button
              key={`${card.id}-${flipped}`}
              type="button"
              onClick={() => {
                if (!flipped) {
                  setFlipped(true)
                  if (autoSpeak) speak(face.speak)
                }
              }}
              initial={{ opacity: 0, rotateX: flipped ? -12 : 12, y: 10 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className={cn(
                'bg-surface min-h-[300px] w-full rounded-3xl border-2 p-8 text-center shadow-[var(--shadow-card)] transition-colors',
                flipped
                  ? 'border-line cursor-default'
                  : 'border-line-strong hover:border-primary cursor-pointer',
              )}
            >
              <div className="text-fg-subtle mb-4 text-[12px] font-medium">
                {flipped ? face.backLabel : face.frontLabel}
              </div>

              <div
                className={cn(
                  'fr font-display leading-tight font-semibold tracking-tight text-balance',
                  face.kind === 'word' ? 'text-4xl' : 'text-2xl',
                )}
              >
                {flipped && face.kind === 'sentence' ? face.speak : face.front}
              </div>

              {showIpa && face.ipa && (
                <div className="text-fg-subtle mt-2 font-mono text-[13px]">[{face.ipa}]</div>
              )}

              {(face.kind === 'word' || flipped) && (
                <div className="mt-5 flex justify-center">
                  <SpeakButton text={face.speak} slow />
                </div>
              )}

              {flipped ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-line mt-6 border-t pt-6"
                >
                  <div className="text-fg text-xl font-medium">{face.back}</div>
                  {face.example && (
                    <div className="mt-4 text-[13.5px]">
                      {/* The pair stacks centred; the audio cluster is three
                          buttons wide now and would push the French off
                          centre if it shared the line. */}
                      <div className="fr text-fg">{face.example.fr}</div>
                      <div className="text-fg-muted mt-0.5">{face.example.uk}</div>
                      <div className="mt-2 flex justify-center">
                        <SpeakButton text={face.example.fr} size="sm" />
                      </div>
                    </div>
                  )}
                  {face.note && (
                    <div className="bg-warning-soft text-warning mt-4 rounded-lg px-3 py-2 text-left text-[12.5px] leading-snug">
                      {face.note}
                    </div>
                  )}
                </motion.div>
              ) : (
                <p className="text-fg-subtle mt-8 text-[13px]">{face.hint}</p>
              )}
            </motion.button>
          </AnimatePresence>
        </div>
      </main>

      <footer className="border-line bg-bg/90 sticky bottom-0 border-t px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <div className="mx-auto max-w-lg">
          {flipped ? (
            <div className="grid grid-cols-4 gap-2">
              {RATINGS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => rate(r.key)}
                  className={cn(
                    'flex flex-col items-center gap-0.5 rounded-xl border-2 py-3 text-[13px] font-semibold transition-colors',
                    r.className,
                  )}
                >
                  {r.label}
                  <span className="font-mono text-[10px] font-normal opacity-70">
                    {previewInterval(card, r.key)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                setFlipped(true)
                if (autoSpeak) speak(face.speak)
              }}
            >
              {face.kind === 'word' ? 'Показати переклад' : 'Показати відповідь'}
            </Button>
          )}
        </div>
      </footer>
    </FullScreen>
  )
}
