import { beforeEach, describe, expect, it } from 'vitest'
import { toast, toastLife, toastOnce, useToasts } from './toasts'

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

describe('repeat events', () => {
  it('replaces the previous one rather than stacking duplicates', () => {
    // Progress saves after every exercise; a lesson would otherwise produce a
    // column of identical notes.
    toastOnce('Збережено', { title: 'Збережено', tone: 'ok' })
    toastOnce('Збережено', { title: 'Збережено', tone: 'ok' })
    toastOnce('Збережено', { title: 'Збережено', tone: 'ok' })
    expect(useToasts.getState().toasts).toHaveLength(1)
  })

  it('does not swallow a different message', () => {
    toastOnce('Збережено', { title: 'Збережено', tone: 'ok' })
    toastOnce('Не збережено', { title: 'Не збережено', tone: 'error' })
    expect(useToasts.getState().toasts.map((t) => t.title)).toEqual(['Збережено', 'Не збережено'])
  })
})

describe('one save, worded for what was saved', () => {
  it('groups repeats by key even when the wording differs', async () => {
    // "Прогрес збережено" and "Налаштування збережено" are both one save;
    // matching on the text would stack them as two.
    toastOnce('save', { title: 'Прогрес збережено', tone: 'ok' })
    toastOnce('save', { title: 'Налаштування збережено', tone: 'ok' })
    const list = useToasts.getState().toasts
    expect(list).toHaveLength(1)
    expect(list[0].title).toBe('Налаштування збережено')
  })

  it('keeps unrelated events apart', () => {
    toastOnce('save', { title: 'Прогрес збережено', tone: 'ok' })
    toastOnce('signin', { title: 'Вхід виконано', tone: 'ok' })
    expect(useToasts.getState().toasts).toHaveLength(2)
  })
})
