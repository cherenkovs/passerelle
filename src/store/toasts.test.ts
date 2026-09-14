import { beforeEach, describe, expect, it } from 'vitest'
import { toast, toastLife, toastUpsert, useToasts } from './toasts'

beforeEach(() => useToasts.getState().clear())

describe('the stack', () => {
  it('keeps at most four, dropping the oldest', () => {
    for (let i = 1; i <= 6; i++) toast({ title: `n${i}`, tone: 'info' })
    const titles = useToasts.getState().toasts.map((t) => t.title)
    // The newest describes what just happened, so it is never the one pushed off.
    expect(titles).toEqual(['n3', 'n4', 'n5', 'n6'])
  })

  it('shortens the life of each as the stack deepens', () => {
    // Several at once means things are moving quickly; holding each for the
    // full time would leave a backlog reporting what the learner has passed.
    expect(toastLife(1)).toBeGreaterThan(toastLife(4))
    expect(toastLife(9)).toBeGreaterThanOrEqual(2200)
  })

  it('dismisses by id and leaves the rest in order', () => {
    const a = toast({ title: 'a', tone: 'ok' })
    toast({ title: 'b', tone: 'ok' })
    useToasts.getState().dismiss(a)
    expect(useToasts.getState().toasts.map((t) => t.title)).toEqual(['b'])
  })
})

describe('one event, told as it progresses', () => {
  it('updates the card in place instead of replacing it', () => {
    // Replacing it would restart the entrance animation, so a save going
    // "Зберігаю…" then "Збережено" would look like two things rather than one
    // thing finishing.
    toastUpsert('save', { title: 'Зберігаю…', tone: 'info' })
    const first = useToasts.getState().toasts[0]
    toastUpsert('save', { title: 'Збережено', tone: 'ok' })
    const after = useToasts.getState().toasts

    expect(after).toHaveLength(1)
    expect(after[0].id).toBe(first.id)
    expect(after[0].title).toBe('Збережено')
    expect(after[0].tone).toBe('ok')
  })

  it('carries a failure on the same card', () => {
    toastUpsert('save', { title: 'Зберігаю…', tone: 'info' })
    toastUpsert('save', {
      title: 'Не збережено',
      description: 'мережа недоступна',
      tone: 'error',
    })
    const list = useToasts.getState().toasts
    expect(list).toHaveLength(1)
    expect(list[0].tone).toBe('error')
    expect(list[0].description).toBe('мережа недоступна')
  })

  it('keeps unrelated events apart', () => {
    toastUpsert('save', { title: 'Збережено', tone: 'ok' })
    toastUpsert('signin', { title: 'Вхід виконано', tone: 'ok' })
    expect(useToasts.getState().toasts).toHaveLength(2)
  })

  it('does not stack repeats of the same event', () => {
    for (let i = 0; i < 5; i++) toastUpsert('save', { title: 'Збережено', tone: 'ok' })
    expect(useToasts.getState().toasts).toHaveLength(1)
  })
})
