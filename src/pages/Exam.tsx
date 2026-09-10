import { motion } from 'framer-motion'
import { Award, Clock, FileText, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LevelChip, Logo } from '@/components/common/misc'
import { ExerciseRunner } from '@/components/exercises/runner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getCourse } from '@/content'
import { pluralUk } from '@/lib/utils'
import { useActiveProfile, useLearner } from '@/store/learner'

export function ExamPage() {
  const { courseId = '' } = useParams()
  const navigate = useNavigate()
  const profile = useActiveProfile()
  const recordExam = useLearner((s) => s.recordExam)

  const [started, setStarted] = useState(false)
  const [finalScore, setFinalScore] = useState<number | null>(null)

  const course = getCourse(courseId)
  const exam = course?.exam

  const exercises = useMemo(() => exam?.sections.flatMap((s) => s.exercises) ?? [], [exam])

  if (!course || !exam) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <p className="text-fg-muted">Іспит не знайдено.</p>
          <Button className="mt-4" onClick={() => navigate('/course')}>
            До курсу
          </Button>
        </div>
      </div>
    )
  }

  // Certificate view after a pass.
  if (finalScore !== null && finalScore >= exam.passScore) {
    return (
      <Certificate
        name={profile?.name ?? 'Учень'}
        level={course.to}
        score={finalScore}
        onClose={() => navigate('/course')}
      />
    )
  }

  if (started) {
    return (
      <ExerciseRunner
        exercises={exercises}
        title={exam.title}
        subtitle="Іспит · відповіді перевіряються строго"
        strict
        onExit={() => navigate('/course')}
        finishLabel="До курсу"
        onFinish={(res) => {
          recordExam(exam.id, res.pct, exam.passScore)
          setFinalScore(res.pct)
        }}
        resultActions={(res) => (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              res.pct >= exam.passScore
                ? 'bg-success-soft text-success'
                : 'bg-danger-soft text-danger'
            }`}
          >
            {res.pct >= exam.passScore
              ? `Іспит складено! Рівень ${course.to} підтверджено.`
              : `Прохідний бал — ${exam.passScore}%. Пройди слабкі модулі й спробуй ще раз.`}
          </div>
        )}
      />
    )
  }

  const prev = profile?.exams[exam.id]

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-4">
      <div className="text-center">
        <span className="bg-accent-soft text-accent-soft-fg mx-auto grid size-14 place-items-center rounded-2xl">
          <Award className="size-7" />
        </span>
        <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight">{exam.title}</h1>
        <p className="text-fg-muted mt-2 text-[15px] text-pretty">
          Підсумкова перевірка всього, що ти вивчив на цьому рівні.
        </p>
      </div>

      <Card className="divide-line divide-y">
        <div className="flex items-center gap-3 p-5">
          <FileText className="text-fg-subtle size-5 shrink-0" />
          <div className="text-sm">
            <strong className="font-semibold">{exercises.length}</strong>{' '}
            {pluralUk(exercises.length, ['завдання', 'завдання', 'завдань'])} у{' '}
            {exam.sections.length} секціях
          </div>
        </div>
        <div className="flex items-center gap-3 p-5">
          <Clock className="text-fg-subtle size-5 shrink-0" />
          <div className="text-sm">
            Орієнтовно <strong className="font-semibold">{exam.minutes} хв</strong> · таймера немає,
            поспішати не треба
          </div>
        </div>
        <div className="flex items-center gap-3 p-5">
          <ShieldCheck className="text-fg-subtle size-5 shrink-0" />
          <div className="text-sm text-pretty">
            Прохідний бал <strong className="font-semibold">{exam.passScore}%</strong>. На іспиті
            діакритика й друкарські помилки <strong className="font-semibold">не</strong> прощаються
            — на відміну від уроків.
          </div>
        </div>
      </Card>

      <div>
        <h2 className="font-display mb-3 text-lg font-semibold">Що перевіряємо</h2>
        <div className="space-y-2.5">
          {exam.sections.map((s, i) => (
            <div key={s.title} className="border-line bg-surface rounded-xl border p-4">
              <div className="flex items-center gap-2">
                <span className="bg-surface-2 text-fg-subtle grid size-6 place-items-center rounded-full font-mono text-[11px] font-semibold">
                  {i + 1}
                </span>
                <span className="font-medium">{s.title}</span>
                <span className="text-fg-subtle ml-auto font-mono text-[11px]">
                  {s.exercises.length}
                </span>
              </div>
              <p className="text-fg-muted mt-1.5 pl-8 text-[13px] text-pretty">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {prev && (
        <div className="bg-surface-2 text-fg-muted rounded-xl px-4 py-3 text-sm">
          Попередні спроби: {prev.attempts}. Найкращий результат:{' '}
          <strong className="text-fg">{prev.bestScore}%</strong>
          {prev.passed && ' — складено ✓'}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="surface" size="lg" onClick={() => navigate('/course')}>
          Пізніше
        </Button>
        <Button variant="accent" size="lg" className="flex-1" onClick={() => setStarted(true)}>
          <Award /> Почати іспит
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Certificate
 * ------------------------------------------------------------------ */

function Certificate({
  name,
  level,
  score,
  onClose,
}: {
  name: string
  level: string
  score: number
  onClose: () => void
}) {
  const date = new Date().toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="grid min-h-[70vh] place-items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
        className="w-full max-w-lg"
      >
        <div className="border-accent/30 bg-surface relative overflow-hidden rounded-3xl border-2 p-8 text-center shadow-[var(--shadow-lift)] sm:p-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, var(--accent) 0 1px, transparent 1px 14px)',
            }}
          />
          <div className="relative">
            <Logo size={40} className="mx-auto" />

            <div className="text-fg-subtle mt-6 text-[11px] font-semibold tracking-[0.2em] uppercase">
              Сертифікат про завершення
            </div>

            <h1 className="font-display mt-5 text-3xl font-semibold tracking-tight text-balance">
              {name}
            </h1>

            <p className="text-fg-muted mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-pretty">
              успішно склав(ла) підсумковий іспит курсу французької мови та підтвердив(ла) рівень
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <LevelChip level={level} className="h-9 px-4 text-base" />
              <span className="font-display text-2xl font-semibold tabular-nums">{score}%</span>
            </div>

            <div className="border-line text-fg-subtle mt-8 border-t pt-5 text-[12px]">
              Passerelle · {date}
            </div>
            <p className="text-fg-subtle mt-2 text-[11px] text-pretty">
              Це навчальний сертифікат для власної мотивації, а не офіційний документ DELF/DALF.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="surface" className="flex-1" onClick={() => window.print()}>
            Зберегти як PDF
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Далі вчитися
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
