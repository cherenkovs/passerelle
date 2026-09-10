import { useNavigate, useParams } from 'react-router-dom'
import { ExerciseRunner } from '@/components/exercises/runner'
import { Button } from '@/components/ui/button'
import { getModule } from '@/content'
import { useLearner } from '@/store/learner'

const PASS = 70

export function QuizPage() {
  const { moduleId = '' } = useParams()
  const navigate = useNavigate()
  const recordQuiz = useLearner((s) => s.recordQuiz)
  const module = getModule(moduleId)

  if (!module) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <p className="text-fg-muted">Тест не знайдено.</p>
          <Button className="mt-4" onClick={() => navigate('/course')}>
            До курсу
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ExerciseRunner
      exercises={module.quiz}
      title={`Тест: ${module.title}`}
      subtitle={module.grammarFocus}
      onExit={() => navigate('/course')}
      finishLabel="До курсу"
      onFinish={(res) => recordQuiz(module.id, res.pct, PASS)}
      resultActions={(res) => (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium ${
            res.pct >= PASS ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'
          }`}
        >
          {res.pct >= PASS
            ? `Модуль складено! Прохідний бал — ${PASS}%.`
            : `Для зарахування потрібно ${PASS}%. Повтори матеріал і спробуй ще.`}
        </div>
      )}
    />
  )
}
