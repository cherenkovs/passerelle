import {
  AlertCircle,
  BookMarked,
  Check,
  NotebookPen,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { EmptyState, PageHeader } from '@/components/common/misc'
import { SpeakButton } from '@/components/common/speak'
import { WordCard } from '@/components/common/word-card'
import { ExerciseRunner } from '@/components/exercises/runner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { findExercises, getWords } from '@/content'
import { pluralUk } from '@/lib/utils'
import { useActiveProfile, useLearner } from '@/store/learner'

export function NotebookPage() {
  const profile = useActiveProfile()
  const [practising, setPractising] = useState(false)

  if (!profile) return null

  if (practising) {
    const exercises = findExercises(profile.mistakes.map((m) => m.exerciseId))
    if (exercises.length) {
      return (
        <ExerciseRunner
          exercises={exercises}
          title="Робота над помилками"
          onExit={() => setPractising(false)}
          finishLabel="До зошита"
        />
      )
    }
    setPractising(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={profile.name}
        title="Зошит"
        description="Твій особистий простір: нотатки, збережені слова та автоматична колода з тих завдань, де ти помилявся."
      />

      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">
            <NotebookPen /> Нотатки
            {profile.notes.length > 0 && (
              <span className="text-fg-subtle ml-1">{profile.notes.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="words">
            <BookMarked /> Мої слова
            {profile.savedWords.length + profile.customWords.length > 0 && (
              <span className="text-fg-subtle ml-1">
                {profile.savedWords.length + profile.customWords.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="mistakes">
            <AlertCircle /> Помилки
            {profile.mistakes.length > 0 && (
              <span className="text-danger ml-1">{profile.mistakes.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <NotesTab />
        </TabsContent>
        <TabsContent value="words">
          <WordsTab />
        </TabsContent>
        <TabsContent value="mistakes">
          <MistakesTab onPractise={() => setPractising(true)} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ------------------------------- Notes ------------------------------- */

function NotesTab() {
  const profile = useActiveProfile()
  const addNote = useLearner((s) => s.addNote)
  const updateNote = useLearner((s) => s.updateNote)
  const deleteNote = useLearner((s) => s.deleteNote)

  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editing, setEditing] = useState<string | null>(null)

  const notes = profile?.notes ?? []

  const save = () => {
    if (!title.trim() && !body.trim()) return
    addNote(title.trim() || 'Без назви', body)
    setTitle('')
    setBody('')
    setCreating(false)
  }

  return (
    <div className="space-y-4">
      {creating ? (
        <Card className="p-5">
          <Label htmlFor="n-title">Заголовок</Label>
          <Input
            id="n-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Напр. «Коли вживати du, а коли le»"
            className="mt-1.5"
            autoFocus
          />
          <Label htmlFor="n-body" className="mt-4">
            Нотатка
          </Label>
          <Textarea
            id="n-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Запиши правило своїми словами — так воно запам'ятовується вдвічі краще."
            className="mt-1.5"
          />
          <div className="mt-4 flex gap-2.5">
            <Button onClick={save}>
              <Check /> Зберегти
            </Button>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              Скасувати
            </Button>
          </div>
        </Card>
      ) : (
        <Button onClick={() => setCreating(true)}>
          <Plus /> Нова нотатка
        </Button>
      )}

      {notes.length === 0 && !creating ? (
        <EmptyState
          icon={NotebookPen}
          title="Ще немає нотаток"
          description="Найкращий спосіб закріпити правило — переказати його власними словами. Тут для цього все й задумано."
          action={
            <Button onClick={() => setCreating(true)}>
              <Plus /> Створити першу
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id} className="group p-5">
              {editing === note.id ? (
                <>
                  <Input
                    defaultValue={note.title}
                    onChange={(e) => updateNote(note.id, { title: e.target.value })}
                    className="font-medium"
                  />
                  <Textarea
                    defaultValue={note.body}
                    onChange={(e) => updateNote(note.id, { body: e.target.value })}
                    rows={5}
                    className="mt-3"
                  />
                  <Button size="sm" className="mt-3" onClick={() => setEditing(null)}>
                    <Check /> Готово
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold tracking-tight">
                      {note.title}
                    </h3>
                    <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setEditing(note.id)}
                        aria-label="Редагувати"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteNote(note.id)}
                        aria-label="Видалити"
                        className="hover:text-danger"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                  {note.body && (
                    <p className="text-fg-muted mt-2 text-[14px] leading-relaxed whitespace-pre-line">
                      {note.body}
                    </p>
                  )}
                  <div className="text-fg-subtle mt-3 text-[11px]">
                    {new Date(note.updatedAt).toLocaleDateString('uk-UA', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------- Words ------------------------------- */

function WordsTab() {
  const profile = useActiveProfile()
  const addCustomWord = useLearner((s) => s.addCustomWord)
  const deleteCustomWord = useLearner((s) => s.deleteCustomWord)

  const [fr, setFr] = useState('')
  const [uk, setUk] = useState('')

  const saved = getWords(profile?.savedWords ?? [])
  const custom = profile?.customWords ?? []

  const add = () => {
    if (!fr.trim() || !uk.trim()) return
    addCustomWord(fr.trim(), uk.trim())
    setFr('')
    setUk('')
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="font-display text-base font-semibold">Додати своє слово</h3>
        <p className="text-fg-muted mt-1 text-[13px] text-pretty">
          Почув щось у фільмі чи на вулиці — запиши сюди. Слово одразу можна прослухати.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Input
            value={fr}
            onChange={(e) => setFr(e.target.value)}
            placeholder="Французькою (з артиклем)"
            className="fr min-w-[200px] flex-1"
            lang="fr"
          />
          <Input
            value={uk}
            onChange={(e) => setUk(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Українською"
            className="min-w-[200px] flex-1"
          />
          <Button onClick={add} disabled={!fr.trim() || !uk.trim()}>
            <Plus /> Додати
          </Button>
        </div>
      </Card>

      {custom.length > 0 && (
        <section>
          <h3 className="font-display mb-3 text-lg font-semibold">
            Власні слова{' '}
            <span className="text-fg-subtle font-sans text-sm font-normal">({custom.length})</span>
          </h3>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {custom.map((w) => (
              <div
                key={w.id}
                className="group border-line bg-surface flex items-center gap-3 rounded-2xl border p-4"
              >
                <SpeakButton text={w.fr} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="fr font-display text-[16px] font-semibold">{w.fr}</div>
                  <div className="text-fg-muted text-[13px]">{w.uk}</div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCustomWord(w.id)}
                  className="text-fg-subtle hover:text-danger grid size-8 shrink-0 place-items-center rounded-lg opacity-0 transition-all group-hover:opacity-100"
                  aria-label="Видалити"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="font-display mb-3 text-lg font-semibold">
          Збережені з курсу{' '}
          <span className="text-fg-subtle font-sans text-sm font-normal">({saved.length})</span>
        </h3>
        {saved.length ? (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {saved.map((w) => (
              <WordCard key={w.id} word={w} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookMarked}
            title="Поки що порожньо"
            description="Натисни закладку на будь-якому слові в уроці, словнику чи тексті — і воно з’явиться тут."
          />
        )}
      </section>
    </div>
  )
}

/* ------------------------------ Mistakes ----------------------------- */

function MistakesTab({ onPractise }: { onPractise: () => void }) {
  const profile = useActiveProfile()
  const resolveMistake = useLearner((s) => s.resolveMistake)
  const clearMistakes = useLearner((s) => s.clearMistakes)

  const mistakes = profile?.mistakes ?? []

  if (!mistakes.length) {
    return (
      <EmptyState
        icon={Check}
        title="Помилок немає"
        description="Коли ти відповіси неправильно, завдання автоматично потрапить сюди — щоб повернутися до нього пізніше."
      />
    )
  }

  const replayable = findExercises(mistakes.map((m) => m.exerciseId)).length

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center gap-4 p-5">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold">
            {mistakes.length} {pluralUk(mistakes.length, ['помилка', 'помилки', 'помилок'])}
          </h3>
          <p className="text-fg-muted mt-0.5 text-[13px] text-pretty">
            Колода формується автоматично. {replayable} з них можна пройти ще раз.
          </p>
        </div>
        {replayable > 0 && (
          <Button onClick={onPractise}>
            <RotateCcw /> Опрацювати
          </Button>
        )}
        <Button variant="ghost" onClick={clearMistakes}>
          Очистити
        </Button>
      </Card>

      <div className="space-y-2.5">
        {mistakes.map((m) => (
          <Card key={m.id} className="group p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm">{kindLabel(m.kind)}</Badge>
                  <span className="text-fg-subtle text-[11px]">
                    {new Date(m.at).toLocaleDateString('uk-UA')}
                  </span>
                </div>

                <div className="text-fg mt-2 text-[14px] font-medium">{m.question}</div>

                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13px]">
                  <span>
                    <span className="text-fg-subtle">Ти написав: </span>
                    <span className="fr text-danger line-through">{m.given || '—'}</span>
                  </span>
                  <span className="inline-flex items-baseline gap-1.5">
                    <span className="text-fg-subtle">Правильно: </span>
                    <span className="fr text-success font-medium">{m.expected}</span>
                    <SpeakButton text={m.expected} size="sm" />
                  </span>
                </div>

                {m.explain && (
                  <p className="bg-surface-2 text-fg-muted mt-2 rounded-lg px-3 py-2 text-[12.5px] leading-snug">
                    {m.explain}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-col gap-1">
                <SpeakButton text={m.expected} size="sm" />
                <button
                  type="button"
                  onClick={() => resolveMistake(m.id)}
                  className="text-fg-subtle hover:text-success grid size-8 place-items-center rounded-lg opacity-0 transition-all group-hover:opacity-100"
                  aria-label="Прибрати"
                  title="Я це вже знаю"
                >
                  <Check className="size-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function kindLabel(kind: string) {
  const map: Record<string, string> = {
    mcq: 'вибір',
    type: 'ввід',
    cloze: 'пропуск',
    match: 'пари',
    listen: 'аудіювання',
    dictation: 'диктант',
    wordbank: 'речення',
    speak: 'вимова',
    translate: 'переклад',
  }
  return map[kind] ?? kind
}
