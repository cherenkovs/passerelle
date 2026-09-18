import {
  ArrowLeft,
  Check,
  Headphones,
  ListChecks,
  Pause,
  Play,
  Trash2,
  MonitorPlay,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LevelChip, PageHeader, SectionTitle } from '@/components/common/misc'
import { SpeakButton, TapText, useSpeak } from '@/components/common/speak'
import { ExerciseRunner } from '@/components/exercises/runner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { VIDEOS, getVideo, getWords } from '@/content'
import { AddVideoDialog } from '@/components/common/add-video'
import { WordCard } from '@/components/common/word-card'
import { cancelSpeech } from '@/lib/speech'
import { cn, formatDuration } from '@/lib/utils'
import { useActiveProfile, useLearner } from '@/store/learner'

/* ------------------------------------------------------------------ *
 * Index
 * ------------------------------------------------------------------ */

export function VideosPage() {
  const profile = useActiveProfile()
  const custom = profile?.customVideos ?? []

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Слухання"
        title="Відео та аудіо"
        description="Інтерактивний транскрипт: натисни рядок — почуєш його, натисни слово — побачиш переклад. Можна додати будь-яке відео з YouTube разом із власним транскриптом."
        action={<AddVideoDialog />}
      />

      <section>
        <SectionTitle>Вбудовані уроки</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {VIDEOS.map((v) => {
            const watched = Boolean(profile?.videos[v.id])
            return (
              <Link
                key={v.id}
                to={`/video/${v.id}`}
                className="group border-line bg-surface hover:border-line-strong rounded-2xl border p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-lift)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl">{v.emoji}</span>
                  <div className="flex items-center gap-2">
                    {watched && (
                      <Badge variant="success" size="sm">
                        <Check /> прослухано
                      </Badge>
                    )}
                    <LevelChip level={v.level} />
                  </div>
                </div>
                <h3 className="fr font-display mt-4 text-xl font-semibold tracking-tight">
                  {v.title}
                </h3>
                <div className="text-fg-subtle text-[13px]">{v.titleUk}</div>
                <p className="text-fg-muted mt-3 text-[13.5px] leading-snug text-pretty">
                  {v.blurb}
                </p>
                <div className="border-line text-fg-subtle mt-4 flex items-center gap-3 border-t pt-3 text-[12px]">
                  <span>{v.minutes} хв</span>
                  <span>·</span>
                  <span>{v.transcript.length} реплік</span>
                  <span>·</span>
                  <span>{v.exercises.length} вправ</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {custom.length > 0 && (
        <section>
          <SectionTitle>Мої відео</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {custom.map((v) => (
              <CustomVideoCard key={v.id} id={v.id} title={v.title} lines={v.transcript.length} />
            ))}
          </div>
        </section>
      )}

      <Card className="border-dashed p-6">
        <div className="flex items-start gap-4">
          <span className="bg-surface-2 text-fg-muted grid size-10 shrink-0 place-items-center rounded-xl">
            <MonitorPlay className="size-5" />
          </span>
          <div className="text-fg-muted text-[13.5px] leading-relaxed text-pretty">
            <strong className="text-fg">Будь-яке відео з YouTube може стати уроком.</strong> Встав
            посилання, а транскрипт візьми з самого YouTube (під відео: «…ще» → «Показати текстову
            версію») — переклад зробиться автоматично, рядки прив’яжуться до часу, кожне слово можна
            буде натиснути.
          </div>
        </div>
      </Card>
    </div>
  )
}

function CustomVideoCard({ id, title, lines }: { id: string; title: string; lines: number }) {
  const deleteCustomVideo = useLearner((s) => s.deleteCustomVideo)
  return (
    <div className="group border-line bg-surface hover:border-line-strong relative rounded-2xl border p-6 shadow-[var(--shadow-card)] transition-all">
      <Link to={`/video/${id}`} className="block">
        <span className="text-3xl">📺</span>
        <h3 className="font-display mt-4 text-xl font-semibold tracking-tight">{title}</h3>
        <div className="text-fg-subtle mt-3 text-[12px]">{lines} реплік у транскрипті</div>
      </Link>
      <button
        type="button"
        onClick={() => deleteCustomVideo(id)}
        className="text-fg-subtle hover:bg-danger-soft hover:text-danger absolute top-4 right-4 grid size-8 place-items-center rounded-lg opacity-0 transition-all group-hover:opacity-100"
        aria-label="Видалити"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Player
 * ------------------------------------------------------------------ */

export function VideoPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const profile = useActiveProfile()
  const markVideo = useLearner((s) => s.markVideo)

  const builtin = getVideo(id)
  const custom = profile?.customVideos.find((v) => v.id === id)

  const [quiz, setQuiz] = useState(false)
  const [showUk, setShowUk] = useState(true)
  const [active, setActive] = useState<number | null>(null)
  const [playingAll, setPlayingAll] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const abortRef = useRef(false)
  const { speak, activeWord } = useSpeak()

  useEffect(() => () => cancelSpeech(), [])

  const youtubeId = builtin?.youtubeId ?? custom?.youtubeId
  const times = (builtin?.transcript ?? custom?.transcript ?? []).map((l, i) =>
    't' in l && typeof l.t === 'number' ? l.t : i * 5,
  )

  /**
   * The transcript follows the video.
   *
   * The embedded player reports its position to whoever asks: once told we are
   * listening, it posts `infoDelivery` messages with the current time several
   * times a second while playing. The line whose timestamp was passed most
   * recently is the one being said, and it is kept in view — nearest edge, so
   * a learner reading ahead is not yanked back to the top.
   */
  useEffect(() => {
    if (!youtubeId) return
    const onMessage = (e: MessageEvent) => {
      if (typeof e.data !== 'string' || !/youtube(-nocookie)?\.com$/.test(e.origin)) return
      let data: { event?: string; info?: { currentTime?: number } }
      try {
        data = JSON.parse(e.data)
      } catch {
        return
      }
      const t = data.info?.currentTime
      if (data.event !== 'infoDelivery' || typeof t !== 'number') return
      let i = -1
      for (let k = 0; k < times.length; k++) if (times[k] <= t + 0.2) i = k
      if (i < 0) return
      setActive((prev) => {
        if (prev === i) return prev
        lineRefs.current[i]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        return i
      })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
    // times is derived from the transcript, which is fixed for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId])

  /** Ask the player to start reporting; it only does so once asked. */
  const listen = () => {
    const w = iframeRef.current?.contentWindow
    if (!w) return
    w.postMessage(JSON.stringify({ event: 'listening', id: 'passerelle', channel: 'widget' }), '*')
    w.postMessage(
      JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'] }),
      '*',
    )
  }

  if (!builtin && !custom) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="text-center">
          <p className="text-fg-muted">Відео не знайдено.</p>
          <Button className="mt-4" onClick={() => navigate('/videos')}>
            До списку
          </Button>
        </div>
      </div>
    )
  }

  const title = builtin?.title ?? custom!.title
  const subtitle = builtin?.titleUk
  const transcript =
    builtin?.transcript ?? custom!.transcript.map((l, i) => ({ ...l, t: l.t ?? i * 5 }))
  const exercises = builtin?.exercises ?? []

  if (quiz && exercises.length) {
    return (
      <ExerciseRunner
        exercises={exercises}
        title={title}
        subtitle="Питання за матеріалом"
        onExit={() => {
          markVideo(id)
          navigate('/videos')
        }}
        finishLabel="До списку"
      />
    )
  }

  const seek = (seconds: number) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
      '*',
    )
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
      '*',
    )
  }

  const onLine = (i: number) => {
    setActive(i)
    if (youtubeId) seek(transcript[i].t)
    else speak(transcript[i].fr)
  }

  const playAll = async () => {
    if (playingAll) {
      abortRef.current = true
      cancelSpeech()
      setPlayingAll(false)
      setActive(null)
      return
    }
    abortRef.current = false
    setPlayingAll(true)
    for (let i = 0; i < transcript.length; i++) {
      if (abortRef.current) break
      setActive(i)
      await new Promise<void>((resolve) => speak(transcript[i].fr, { onEnd: resolve }))
      await new Promise((r) => setTimeout(r, 220))
    }
    setPlayingAll(false)
    setActive(null)
  }

  const vocabWords = builtin ? getWords(builtin.vocab) : []

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/videos')}>
        <ArrowLeft /> Усі відео
      </Button>

      <header>
        <div className="flex items-center gap-3">
          {builtin && <span className="text-3xl">{builtin.emoji}</span>}
          {builtin && <LevelChip level={builtin.level} />}
        </div>
        <div className="mt-3 flex items-start gap-2">
          <h1 className="fr font-display text-3xl font-semibold tracking-tight text-balance">
            {title}
          </h1>
          <SpeakButton text={title} className="mt-2 shrink-0" />
        </div>
        {subtitle && <p className="text-fg-muted mt-1 text-lg">{subtitle}</p>}
      </header>

      {youtubeId ? (
        <div className="border-line overflow-hidden rounded-2xl border bg-black">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&rel=0&hl=fr`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            onLoad={listen}
            className="aspect-video w-full"
          />
        </div>
      ) : (
        <Card className="flex flex-col items-center gap-3 p-8">
          <span className="bg-primary-soft text-primary-soft-fg grid size-16 place-items-center rounded-2xl">
            <Headphones className="size-8" />
          </span>
          <p className="text-fg-muted text-center text-sm text-pretty">
            Аудіоурок озвучується вбудованим синтезатором мовлення — нічого не коштує.
          </p>
          <Button onClick={playAll} size="lg" className="mt-2">
            {playingAll ? <Pause /> : <Play />}
            {playingAll ? 'Зупинити' : 'Прослухати повністю'}
          </Button>
        </Card>
      )}

      {/* Transcript */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">Транскрипт</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowUk((v) => !v)}>
            {showUk ? 'Сховати переклад' : 'Показати переклад'}
          </Button>
        </div>

        <div className="space-y-1.5">
          {transcript.map((line, i) => (
            <div
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el
              }}
              className={cn(
                'group flex gap-3 rounded-xl border p-3 transition-colors',
                active === i
                  ? 'border-primary bg-primary-soft'
                  : 'hover:border-line hover:bg-surface-2 border-transparent',
              )}
            >
              <button
                type="button"
                onClick={() => onLine(i)}
                className="text-fg-subtle hover:text-primary mt-0.5 shrink-0 text-[11.5px] tabular-nums"
                title={youtubeId ? 'Перемотати сюди' : 'Прослухати рядок'}
              >
                {formatDuration(line.t)}
              </button>

              <div className="min-w-0 flex-1">
                <div className="fr text-fg text-[15px] leading-relaxed">
                  <TapText activeWord={active === i ? activeWord : null}>{line.fr}</TapText>
                </div>
                {showUk && line.uk && (
                  <div className="text-fg-muted mt-0.5 text-[13px]">{line.uk}</div>
                )}
              </div>

              <SpeakButton
                text={line.fr}
                size="sm"
                className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>

      {vocabWords.length > 0 && (
        <section>
          <SectionTitle>Ключова лексика</SectionTitle>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {vocabWords.map((w) => (
              <WordCard key={w.id} word={w} compact />
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-3 pb-8">
        {exercises.length > 0 && (
          <Button size="lg" className="flex-1" onClick={() => setQuiz(true)}>
            <ListChecks /> Вправи ({exercises.length})
          </Button>
        )}
        <Button
          variant="surface"
          size="lg"
          onClick={() => {
            markVideo(id)
            navigate('/videos')
          }}
        >
          <Check /> Позначити прослуханим
        </Button>
      </div>
    </div>
  )
}
