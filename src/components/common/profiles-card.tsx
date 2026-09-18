import { Check, Merge, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { mergeProfiles } from '@/lib/merge'
import { cn } from '@/lib/utils'
import { useLearner, type Profile } from '@/store/learner'
import { toast } from '@/store/toasts'

/**
 * Every name on the account, with enough detail to tell them apart.
 *
 * Deleting used to reach only the profile you happened to be using, and nothing
 * showed how much work each one held — so clearing up duplicates meant
 * switching back and forth and guessing which was which. The numbers here are
 * the ones that decide it: XP, lessons finished, and when it was started.
 */
export function ProfilesCard() {
  const profiles = useLearner((s) => s.profiles)
  const activeId = useLearner((s) => s.activeId)
  const switchProfile = useLearner((s) => s.switchProfile)
  const deleteProfile = useLearner((s) => s.deleteProfile)
  const [confirmMerge, setConfirmMerge] = useState(false)
  const [toDelete, setToDelete] = useState<Profile | null>(null)

  const lessonsDone = (p: Profile) => Object.values(p.lessons).filter((l) => l.completed).length

  /**
   * Fold every name into one, keeping all of the progress.
   *
   * For duplicates of the same person this is the answer rather than deleting:
   * work spread across them is combined instead of thrown away, and it does not
   * depend on guessing which copy is the fullest. The oldest is kept as the
   * survivor, since that is the one the account started with.
   */
  const mergeAll = () => {
    const ordered = [...profiles].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    const one = ordered.reduce((acc, p) => mergeProfiles(acc, { ...p, id: acc.id, name: acc.name }))
    useLearner.setState({ profiles: [one], activeId: one.id })
    setConfirmMerge(false)
    toast({
      title: 'Профілі об’єднано',
      description: `${ordered.length} → 1 · ${one.xp} XP разом`,
      tone: 'ok',
    })
  }

  return (
    <div className="space-y-2.5">
      {profiles.map((p) => {
        const active = p.id === activeId
        return (
          <div
            key={p.id}
            className={cn(
              'flex items-center gap-3 rounded-2xl border p-3.5',
              active ? 'border-primary bg-primary-soft' : 'border-line bg-surface',
            )}
          >
            <span className="text-2xl">{p.emoji}</span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-[15px] font-semibold">{p.name}</span>
                {active && (
                  <span className="text-primary inline-flex items-center gap-1 text-[11px] font-medium">
                    <Check className="size-3" /> активний
                  </span>
                )}
              </div>
              <div className="text-fg-muted mt-0.5 text-[12px] tabular-nums">
                {p.xp} XP · {lessonsDone(p)} уроків · з{' '}
                {new Date(p.createdAt).toLocaleDateString('uk-UA')}
              </div>
            </div>

            {!active && (
              <Button variant="surface" size="sm" onClick={() => switchProfile(p.id)}>
                Обрати
              </Button>
            )}
            {profiles.length > 1 && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-danger"
                aria-label={`Видалити ${p.name}`}
                onClick={() => setToDelete(p)}
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        )
      })}

      {profiles.length > 1 && (
        <div className="border-line mt-3 border-t pt-3">
          <p className="text-fg-subtle text-[12.5px] leading-relaxed text-pretty">
            Якщо це та сама людина, а імена з’явилися через повторні входи — краще об’єднати, ніж
            видаляти: увесь прогрес складеться в один профіль, нічого не загубиться.
          </p>
          <Button
            variant="surface"
            size="sm"
            className="mt-2.5"
            onClick={() => setConfirmMerge(true)}
          >
            <Merge className="size-4" /> Об’єднати всі в один
          </Button>
        </div>
      )}

      <Dialog open={confirmMerge} onOpenChange={setConfirmMerge}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Об’єднати {profiles.length} профілі в один?</DialogTitle>
            <DialogDescription>
              Уроки, картки, слова й XP з усіх профілів складуться разом. Залишиться ім’я «
              {[...profiles].sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0]?.name}». Якщо
              це різні люди — не об’єднуй, видали зайве вручну.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="surface" onClick={() => setConfirmMerge(false)}>
              Скасувати
            </Button>
            <Button onClick={mergeAll}>Об’єднати</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={toDelete !== null} onOpenChange={(v) => !v && setToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Видалити «{toDelete?.name}»?</DialogTitle>
            <DialogDescription>
              {toDelete?.xp ?? 0} XP і {toDelete ? lessonsDone(toDelete) : 0} уроків буде втрачено
              назавжди. Щоб зберегти цей прогрес, скасуй і натомість об’єднай профілі.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="surface" onClick={() => setToDelete(null)}>
              Скасувати
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (toDelete) {
                  deleteProfile(toDelete.id)
                  toast({ title: `Профіль «${toDelete.name}» видалено`, tone: 'info' })
                }
                setToDelete(null)
              }}
            >
              Видалити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
