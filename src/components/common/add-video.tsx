import { Download, Languages, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  fetchCaptions,
  parseTranscriptPaste,
  parseYouTubeId,
  relayUrl,
  toSentences,
  translateLines,
  type CaptionLine,
} from '@/lib/captions'
import { useSync } from '@/lib/sync'
import { cn, pluralUk } from '@/lib/utils'
import { useLearner } from '@/store/learner'
import { toast } from '@/store/toasts'

/**
 * Turning a YouTube video into a lesson.
 *
 * The transcript comes from YouTube itself — pasted from the panel every
 * captioned video has, or fetched by link when a relay is deployed — and the
 * Ukrainian comes from a translator, line by line, while the learner watches
 * the bar. Nothing here asks anyone to translate a video by hand.
 */
export function AddVideoDialog() {
  const addCustomVideo = useLearner((s) => s.addCustomVideo)
  const email = useSync((s) => s.email)
  const relay = relayUrl()

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [raw, setRaw] = useState('')
  const [lines, setLines] = useState<CaptionLine[]>([])
  const [given, setGiven] = useState<(string | null)[]>([])
  const [translate, setTranslate] = useState(true)
  const [busy, setBusy] = useState<null | 'fetch' | 'translate'>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const abort = useRef<AbortController | null>(null)

  const reset = () => {
    setTitle('')
    setUrl('')
    setRaw('')
    setLines([])
    setGiven([])
    setBusy(null)
    setProgress(0)
    setError(null)
  }

  /** Whatever is in the textarea, read into lines. */
  const parsePaste = (text: string) => {
    setRaw(text)
    const parsed = parseTranscriptPaste(text)
    // Hand-written lines carry their own translation and must stay as typed;
    // a pasted transcript is display pieces, joined into sentences.
    const hasUk = parsed.uk.some(Boolean)
    setLines(hasUk ? parsed.lines : toSentences(parsed.lines))
    setGiven(hasUk ? parsed.uk : [])
    setError(null)
  }

  const fetchByLink = async () => {
    const id = parseYouTubeId(url)
    if (!id) {
      setError('Не вдалося розпізнати посилання на YouTube.')
      return
    }
    setBusy('fetch')
    setError(null)
    try {
      const got = await fetchCaptions(id)
      setLines(toSentences(got.lines))
      setGiven([])
      setRaw('')
      if (!title.trim() && got.title) setTitle(got.title)
      if (got.kind === 'auto') {
        toast({
          title: 'Субтитри автоматичні',
          description: 'YouTube розпізнав їх сам — можливі помилки в словах.',
          tone: 'info',
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не вдалося отримати субтитри')
    } finally {
      setBusy(null)
    }
  }

  const submit = async () => {
    const youtubeId = parseYouTubeId(url)
    if (!youtubeId) {
      setError('Не вдалося розпізнати посилання на YouTube.')
      return
    }
    if (!lines.length) {
      setError('Потрібен транскрипт: отримай його за посиланням або встав із YouTube.')
      return
    }

    let uk: (string | null)[] = lines.map((_, i) => given[i] ?? null)
    let quotaHit = false
    const missing = lines.map((l, i) => (uk[i] ? null : l.text))

    if (translate && missing.some(Boolean)) {
      setBusy('translate')
      setProgress(0)
      abort.current = new AbortController()
      const targets = missing.map((m) => m ?? '')
      const result = await translateLines(targets, {
        email: email ?? undefined,
        signal: abort.current.signal,
        onProgress: (p) => setProgress(Math.round((p.done / p.total) * 100)),
      })
      uk = uk.map((u, i) => u ?? (missing[i] ? result.uk[i] : null))
      quotaHit = result.quotaHit
      setBusy(null)
    }

    addCustomVideo({
      title: title.trim() || 'Моє відео',
      youtubeId,
      transcript: lines.map((l, i) => ({ fr: l.text, uk: uk[i] ?? '', t: l.t })),
    })

    const translated = uk.filter(Boolean).length
    if (quotaHit) {
      toast({
        title: 'Перекладено частково',
        description: `${translated} з ${lines.length} рядків — денний ліміт перекладача вичерпано. Решту можна перекласти завтра, а слова й зараз доступні по тапу.`,
        tone: 'info',
      })
    }
    setOpen(false)
    reset()
  }

  const untranslated = lines.filter((_, i) => !given[i]).length

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) abort.current?.abort()
        setOpen(next)
        if (!next) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus /> Додати відео
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Відео з YouTube як урок</DialogTitle>
          <DialogDescription>
            Транскрипт береться з самого YouTube, переклад робиться автоматично. Далі — клік по
            рядку перемотує відео, клік по слову показує значення.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <Label htmlFor="v-url">Посилання на відео</Label>
            <div className="mt-1.5 flex gap-2">
              <Input
                id="v-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=…"
                className="flex-1"
              />
              {relay && (
                <Button
                  variant="surface"
                  onClick={fetchByLink}
                  disabled={busy !== null || !url.trim()}
                  className="shrink-0"
                >
                  <Download /> {busy === 'fetch' ? 'Отримую…' : 'Отримати субтитри'}
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="v-raw">
              {relay ? 'Або встав текстову версію з YouTube' : 'Текстова версія з YouTube'}
            </Label>
            <ol className="text-fg-muted mt-1.5 mb-2 list-decimal space-y-0.5 pl-5 text-[12.5px] leading-snug">
              <li>
                Під відео розгорни опис (<b>…ще</b>) і прокрути його до самого низу — там кнопка{' '}
                <b>Показати текстову версію</b> (в англійському інтерфейсі — <b>Show transcript</b>
                ).
              </li>
              <li>
                Панель з’явиться праворуч від відео (на телефоні — під ним). Клікни в неї, виділи
                все (Ctrl/⌘+A) і скопіюй.
              </li>
              <li>Встав сюди — час і рядки розпізнаються самі.</li>
            </ol>
            <Textarea
              id="v-raw"
              value={raw}
              onChange={(e) => parsePaste(e.target.value)}
              rows={6}
              placeholder={
                '0:00\nNous sommes à Paris au mois de juillet.\n0:06\nLa ville lumière accueille…'
              }
              className="text-[13px]"
            />
          </div>

          {lines.length > 0 && (
            <div className="border-line bg-surface-2 rounded-xl border px-4 py-3 text-[13px]">
              <div className="text-fg font-medium">
                {lines.length} {pluralUk(lines.length, ['речення', 'речення', 'речень'])} готово
              </div>
              <div className="fr text-fg-muted mt-1 truncate">{lines[0].text}</div>
            </div>
          )}

          <div>
            <Label htmlFor="v-title">Назва</Label>
            <Input
              id="v-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Напр. «Les Champs-Élysées»"
              className="mt-1.5"
            />
          </div>

          {untranslated > 0 && (
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={translate}
                onChange={(e) => setTranslate(e.target.checked)}
                className="accent-primary mt-1 size-4"
              />
              <span className="text-[13.5px] leading-snug">
                <span className="text-fg flex items-center gap-1.5 font-medium">
                  <Languages className="size-4" /> Перекласти українською автоматично
                </span>
                <span className="text-fg-muted mt-0.5 block text-[12.5px] text-pretty">
                  Машинний переклад, речення за реченням — щоб стежити за змістом. Точне значення
                  будь-якого слова завжди є по тапу.
                </span>
              </span>
            </label>
          )}

          {busy === 'translate' && (
            <div>
              <div className="text-fg-muted mb-1.5 flex justify-between text-[12.5px]">
                <span>Перекладаю…</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {error && <p className="text-danger text-sm">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="surface" onClick={() => setOpen(false)} disabled={busy === 'translate'}>
            Скасувати
          </Button>
          <Button onClick={submit} disabled={busy !== null} className={cn(busy && 'opacity-70')}>
            {busy === 'translate' ? 'Перекладаю…' : 'Додати'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
