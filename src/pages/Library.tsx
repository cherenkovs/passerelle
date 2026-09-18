import {
  ArrowLeft,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  ListChecks,
  Minus,
  Plus,
  Square,
  Volume2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LevelChip, PageHeader } from '@/components/common/misc'
import { SpeakButton, Spoken, TapText, useSpeak } from '@/components/common/speak'
import { ExerciseRunner } from '@/components/exercises/runner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { STORIES, getStory } from '@/content'
import { cancelSpeech } from '@/lib/speech'
import { cn } from '@/lib/utils'
import { useActiveProfile, useLearner } from '@/store/learner'

/* ------------------------------------------------------------------ *
 * Library index
 * ------------------------------------------------------------------ */

export function LibraryPage() {
  const profile = useActiveProfile()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Читання"
        title="Бібліотека"
        description="Градуйовані тексти з паралельним перекладом. Натисни будь-яке слово, щоб почути його й побачити значення — переклад абзацу відкривається лише тоді, коли ти сам цього захочеш."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {STORIES.map((story) => {
          const read = Boolean(profile?.stories[story.id])
          return (
            <Link
              key={story.id}
              to={`/story/${story.id}`}
              className="group border-line bg-surface hover:border-line-strong rounded-2xl border p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl">{story.emoji}</span>
                <div className="flex items-center gap-2">
                  {read && (
                    <Badge variant="success" size="sm">
                      <Check /> прочитано
                    </Badge>
                  )}
                  <LevelChip level={story.level} />
                </div>
              </div>

              <h3 className="fr font-display mt-4 text-xl font-semibold tracking-tight">
                {story.title}
              </h3>
              <div className="text-fg-subtle text-[13px]">{story.titleUk}</div>

              <p className="text-fg-muted mt-3 text-[13.5px] leading-snug text-pretty">
                {story.blurb}
              </p>

              <div className="border-line text-fg-subtle mt-4 flex items-center gap-3 border-t pt-3 text-[12px]">
                <span>{story.minutes} хв</span>
                <span>·</span>
                <span>{story.paragraphs.length} абзаців</span>
                <span>·</span>
                <span>{story.questions.length} питань</span>
              </div>

              <p className="text-fg-subtle mt-2 text-[11px] text-pretty italic">{story.source}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Reader
 * ------------------------------------------------------------------ */

export function StoryPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const markStory = useLearner((s) => s.markStory)

  const story = getStory(id)
  const [showAll, setShowAll] = useState(false)
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [scale, setScale] = useState(1)
  const [quiz, setQuiz] = useState(false)
  const [reading, setReading] = useState(false)
  const readingRef = useRef(false)
  const { speak } = useSpeak()

  // Leaving the page must not leave a voice running in the background.
  useEffect(
    () => () => {
      readingRef.current = false
      cancelSpeech()
    },
    [],
  )

  if (!story) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="text-center">
          <p className="text-fg-muted">Текст не знайдено.</p>
          <Button className="mt-4" onClick={() => navigate('/library')}>
            До бібліотеки
          </Button>
        </div>
      </div>
    )
  }

  if (quiz) {
    return (
      <ExerciseRunner
        exercises={story.questions}
        title={story.title}
        subtitle="Питання на розуміння"
        onExit={() => {
          markStory(story.id)
          navigate('/library')
        }}
        finishLabel="До бібліотеки"
      />
    )
  }

  const toggle = (i: number) =>
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  /**
   * Read the whole story aloud, paragraph by paragraph.
   *
   * Goes through `useSpeak` so it honours the learner's chosen voice and speed —
   * reading a long text is exactly when a slower rate matters, and this button
   * used to ignore the setting and run at the library default.
   *
   * `readingRef` is the stop signal: without it the loop kept queueing the next
   * paragraph after a cancel, so leaving the page left the story still talking.
   */
  const readAll = async () => {
    if (reading) {
      readingRef.current = false
      setReading(false)
      cancelSpeech()
      return
    }
    readingRef.current = true
    setReading(true)
    for (const p of story.paragraphs) {
      if (!readingRef.current) break
      await new Promise<void>((resolve) => speak(p.fr.replace(/\n/g, ' '), { onEnd: resolve }))
      if (!readingRef.current) break
      await new Promise((r) => setTimeout(r, 260))
    }
    readingRef.current = false
    setReading(false)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/library')}>
          <ArrowLeft /> Бібліотека
        </Button>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setScale((s) => Math.max(0.85, s - 0.1))}
            aria-label="Менший шрифт"
          >
            <Minus />
          </Button>
          <span className="text-fg-subtle font-mono text-[11px]">Aa</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setScale((s) => Math.min(1.5, s + 0.1))}
            aria-label="Більший шрифт"
          >
            <Plus />
          </Button>
        </div>
      </div>

      {/* Title block */}
      <header className="border-line border-b pb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{story.emoji}</span>
          <LevelChip level={story.level} />
        </div>
        <div className="mt-3 flex items-start gap-2">
          <h1 className="fr font-display text-4xl font-semibold tracking-tight text-balance">
            {story.title}
          </h1>
          <SpeakButton text={story.title} className="mt-2 shrink-0" />
        </div>
        <p className="text-fg-muted mt-1 text-lg">{story.titleUk}</p>
        <p className="text-fg-subtle mt-3 text-[13px] italic">{story.source}</p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <Button variant={reading ? 'soft' : 'surface'} size="sm" onClick={readAll}>
            {reading ? <Square /> : <Volume2 />}
            {reading ? 'Зупинити' : 'Прослухати весь текст'}
          </Button>
          <Button
            variant={showAll ? 'soft' : 'surface'}
            size="sm"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? <EyeOff /> : <Eye />}
            {showAll ? 'Сховати переклад' : 'Показати весь переклад'}
          </Button>
        </div>
      </header>

      {/* Body */}
      <article className="space-y-5" style={{ fontSize: `${scale}rem` }}>
        {story.paragraphs.map((p, i) => {
          const open = showAll || revealed.has(i)
          return (
            <div key={i} className="group relative">
              <Spoken text={p.fr.replace(/\n/g, ' ')} size="sm" words={false}>
                {({ controls, ctl }) => (
                  <div className="flex gap-3">
                    <span
                      className={cn(
                        'mt-1 shrink-0 transition-opacity group-hover:opacity-100',
                        ctl.speaking ? 'opacity-100' : 'opacity-40',
                      )}
                    >
                      {controls}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="fr text-fg text-[1.15em] leading-[1.75] whitespace-pre-line">
                        <TapText activeWord={ctl.activeWord}>{p.fr}</TapText>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggle(i)}
                        className={cn(
                          'text-primary mt-1.5 text-[0.8em] font-medium underline-offset-4 transition-opacity hover:underline',
                          open && 'opacity-0 group-hover:opacity-100',
                        )}
                      >
                        {open ? 'сховати' : 'переклад'}
                      </button>

                      {open && (
                        <p className="border-line-strong text-fg-muted mt-1 border-l-2 pl-3 text-[0.92em] leading-relaxed whitespace-pre-line">
                          {p.uk}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Spoken>
            </div>
          )
        })}
      </article>

      {/* Glossary */}
      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold tracking-tight">Словничок до тексту</h2>
        <div className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {story.glossary.map((g) => (
            <div key={g.fr} className="border-line flex items-baseline gap-2 border-b pb-2">
              <button
                type="button"
                onClick={() => speak(g.fr)}
                className="fr text-fg hover:text-primary shrink-0 text-left text-[14px] font-medium"
              >
                {g.fr}
              </button>
              <span className="text-fg-muted flex-1 text-right text-[13px]">{g.uk}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap gap-3 pb-8">
        <Button size="lg" className="flex-1" onClick={() => setQuiz(true)}>
          <ListChecks /> Питання на розуміння ({story.questions.length})
        </Button>
        <Button
          variant="surface"
          size="lg"
          onClick={() => {
            markStory(story.id)
            navigate('/library')
          }}
        >
          <BookOpen /> Позначити прочитаним
        </Button>
      </div>
    </div>
  )
}
