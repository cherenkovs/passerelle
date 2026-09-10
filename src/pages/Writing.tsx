import { motion } from 'framer-motion'
import { ArrowLeft, Check, Eye, Info, ListChecks, PenLine, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState, LevelChip, PageHeader } from '@/components/common/misc'
import { SpeakButton, TapText } from '@/components/common/speak'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { WRITING_TASKS, getWritingTask } from '@/content/writing'
import { countWords, reviewWriting } from '@/lib/writing'
import { cn, pluralUk } from '@/lib/utils'
import { useActiveProfile, useLearner } from '@/store/learner'

/* ------------------------------------------------------------------ *
 * Index
 * ------------------------------------------------------------------ */

export function WritingPage() {
  const profile = useActiveProfile()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Письмо"
        title="Писати, а не лише перекладати"
        description="Найдовше, що ти досі писав у застосунку, — одне речення. Тут — справжні тексти: листівка, скарга, есе. Застосунок перевіряє те, що можна перевірити чесно, решту показує на зразку."
      />

      <Card className="border-dashed p-5">
        <div className="text-fg-muted flex items-start gap-3 text-[13.5px] leading-relaxed text-pretty">
          <Info className="text-accent mt-0.5 size-4 shrink-0" />
          <span>
            Твій текст нікуди не надсилається і його ніхто не оцінює «на бал». Перевіряються обсяг,
            наявність обов'язкових ходів і зриви регістру — те, що можна перевірити без здогадок.
            Якість аргументів ти оцінюєш сам, поруч зі зразком.
          </span>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {WRITING_TASKS.map((task) => {
          const saved = profile?.writings?.[task.id]
          const words = saved ? countWords(saved.text) : 0
          return (
            <Link
              key={task.id}
              to={`/writing/${task.id}`}
              className="group border-line bg-surface hover:border-line-strong rounded-2xl border p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl">{task.emoji}</span>
                <div className="flex items-center gap-2">
                  {saved?.done && (
                    <Badge variant="success" size="sm">
                      <Check /> готово
                    </Badge>
                  )}
                  {!saved?.done && words > 0 && (
                    <Badge variant="primary" size="sm">
                      чернетка
                    </Badge>
                  )}
                  <LevelChip level={task.level} />
                </div>
              </div>

              <h3 className="fr font-display mt-4 text-xl font-semibold tracking-tight">
                {task.title}
              </h3>
              <div className="text-fg-subtle text-[13px]">{task.titleUk}</div>
              <p className="text-fg-muted mt-3 text-[13.5px] leading-snug text-pretty">
                {task.brief}
              </p>

              <div className="border-line text-fg-subtle mt-4 flex items-center gap-3 border-t pt-3 text-[12px]">
                <span>{task.minutes} хв</span>
                <span>·</span>
                <span>
                  {task.words.min}–{task.words.max} слів
                </span>
                {words > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-primary">написано {words}</span>
                  </>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * One task
 * ------------------------------------------------------------------ */

export function WritingTaskPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const profile = useActiveProfile()
  const saveWriting = useLearner((s) => s.saveWriting)

  const task = getWritingTask(id)
  const saved = profile?.writings?.[id]

  const [text, setText] = useState(saved?.text ?? '')
  const [checked, setChecked] = useState(false)

  // Autosave, debounced — typing shouldn't write to storage on every keystroke.
  useEffect(() => {
    if (!task) return
    const t = setTimeout(() => saveWriting(task.id, text), 600)
    return () => clearTimeout(t)
  }, [text, task, saveWriting])

  const report = useMemo(() => (task ? reviewWriting(text, task) : null), [text, task])

  if (!task || !report) {
    return (
      <EmptyState
        icon={PenLine}
        title="Завдання не знайдено"
        action={<Button onClick={() => navigate('/writing')}>До завдань</Button>}
      />
    )
  }

  const words = report.words

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/writing')}>
        <ArrowLeft /> Письмо
      </Button>

      <header className="border-line border-b pb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{task.emoji}</span>
          <LevelChip level={task.level} />
        </div>
        <h1 className="fr font-display mt-4 text-3xl font-semibold tracking-tight text-balance">
          {task.title}
        </h1>
        <p className="text-fg-muted mt-1 text-lg">{task.titleUk}</p>
        <p className="text-fg mt-4 leading-relaxed text-pretty">{task.brief}</p>
      </header>

      {/* Brief */}
      <Card className="p-5">
        <h2 className="text-fg-subtle text-[12px] font-semibold tracking-wider uppercase">
          Що має бути в тексті
        </h2>
        <ul className="mt-3 space-y-2">
          {task.requirements.map((r) => (
            <li key={r} className="flex items-start gap-2.5 text-[14px] leading-snug">
              <span className="bg-accent mt-[7px] size-1.5 shrink-0 rounded-full" />
              <span className="text-fg-muted">{r}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Useful phrases */}
      <Card className="p-5">
        <h2 className="text-fg-subtle text-[12px] font-semibold tracking-wider uppercase">
          Корисні звороти
        </h2>
        <div className="mt-3 space-y-2">
          {task.phrases.map((p) => (
            <div key={p.fr} className="flex items-start gap-3">
              <SpeakButton text={p.fr} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="fr text-[14.5px] leading-snug font-medium">
                  <TapText>{p.fr}</TapText>
                </div>
                <div className="text-fg-muted text-[12.5px]">{p.uk}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* The writing itself */}
      <div>
        <div className="mb-2 flex items-end justify-between gap-3">
          <label htmlFor="text" className="text-fg text-sm font-medium">
            Твій текст
          </label>
          <span
            className={cn(
              'font-mono text-[12px] tabular-nums',
              report.length === 'ok' ? 'text-success' : 'text-fg-subtle',
            )}
          >
            {words} / {task.words.min}–{task.words.max}{' '}
            {pluralUk(words, ['слово', 'слова', 'слів'])}
          </span>
        </div>
        <textarea
          id="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setChecked(false)
          }}
          rows={14}
          spellCheck={false}
          placeholder="Пиши французькою. Чернетка зберігається автоматично."
          className="border-line bg-surface text-fg placeholder:text-fg-subtle focus:border-primary focus:ring-primary/25 fr w-full resize-y rounded-2xl border p-4 text-[15px] leading-relaxed outline-none focus:ring-4"
        />

        <div className="mt-3 flex flex-wrap gap-3">
          <Button
            size="lg"
            className="flex-1"
            disabled={words === 0}
            variant={words === 0 ? 'surface' : 'primary'}
            onClick={() => {
              setChecked(true)
              saveWriting(task.id, text, true)
            }}
          >
            <ListChecks /> Перевірити
          </Button>
          {text.trim() && (
            <Button variant="ghost" size="lg" onClick={() => setText('')}>
              <X /> Очистити
            </Button>
          )}
        </div>
      </div>

      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          className="space-y-6"
        >
          {/* What the app can actually check */}
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold tracking-tight">
                Формальна перевірка
              </h2>
              <span className="text-fg-subtle font-mono text-[12px] tabular-nums">
                {report.passed}/{report.total}
              </span>
            </div>

            <ul className="mt-4 space-y-2.5">
              <CheckRow
                ok={report.lengthOk}
                label="Обсяг"
                hint={
                  report.length === 'short'
                    ? `Закоротко: ${words} замість ${task.words.min}–${task.words.max}. Недобір обсягу коштує балів навіть за гарний текст.`
                    : `Задовго: ${words} замість ${task.words.min}–${task.words.max}. Стислість теж оцінюється.`
                }
              />
              {report.checks.map((c) => (
                <CheckRow
                  key={c.label}
                  ok={c.ok}
                  label={c.label}
                  hint={c.found ? `${c.hint} Знайдено: «${c.found}».` : c.hint}
                />
              ))}
            </ul>
          </Card>

          {/* The half the app can't do */}
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Eye className="text-accent size-4" />
              <h2 className="font-display text-lg font-semibold tracking-tight">Зразок</h2>
            </div>
            <p className="text-fg-muted mt-1 text-[13px] text-pretty">
              Не «правильна відповідь», а один із можливих текстів. Порівняй хід думки, а не слова.
            </p>
            <div className="border-line bg-surface-2 fr mt-4 rounded-xl border p-4 text-[15px] leading-relaxed whitespace-pre-line">
              <TapText as="div">{task.model}</TapText>
            </div>
            <details className="mt-3">
              <summary className="text-fg-muted hover:text-fg cursor-pointer text-[13px] select-none">
                Показати переклад
              </summary>
              <div className="text-fg-muted mt-2 text-[14px] leading-relaxed whitespace-pre-line">
                {task.modelUk}
              </div>
            </details>
          </Card>

          {/* Self-assessment */}
          <Card className="p-5">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Тепер перечитай свій текст
            </h2>
            <p className="text-fg-muted mt-1 text-[13px] text-pretty">
              Ці питання застосунок за тебе не вирішить — і саме вони відрізняють добрий текст від
              правильного.
            </p>
            <ul className="mt-4 space-y-2.5">
              {task.rubric.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-[14px] leading-snug">
                  <span className="border-line mt-0.5 grid size-4 shrink-0 place-items-center rounded border" />
                  <span className="text-fg-muted">{r}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

function CheckRow({ ok, label, hint }: { ok: boolean; label: string; hint: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full',
          ok ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
        )}
      >
        {ok ? <Check className="size-3" /> : <X className="size-3" />}
      </span>
      <div className="min-w-0">
        <div className="text-fg text-[14px] font-medium">{label}</div>
        {!ok && <div className="text-fg-muted mt-0.5 text-[13px] text-pretty">{hint}</div>}
      </div>
    </li>
  )
}
