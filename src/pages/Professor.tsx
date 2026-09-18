import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/misc'
import { ProfessorPanel } from '@/components/common/professor'

/**
 * A place to ask.
 *
 * Every other screen teaches in the order the course chose. This one answers
 * in the order the learner's confusion arrives: mid-lesson, about a word from
 * a film, about why a sentence they saw on a sign works the way it does.
 */
export function ProfessorPage() {
  const [params] = useSearchParams()
  const question = params.get('q') ?? undefined

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-3xl flex-col">
      <PageHeader
        title="Професор"
        description="Запитай про слово, правило чи форму дієслова — відповідь із матеріалів курсу, з прикладами, які можна почути."
        className="mb-6"
      />
      <ProfessorPanel key={question ?? ''} question={question} className="flex-1" />
    </div>
  )
}
