import {
  Download,
  Monitor,
  Moon,
  Play,
  Sun,
  Trash2,
  TriangleAlert,
  Upload,
  UserPlus,
  RefreshCw,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, SectionTitle } from '@/components/common/misc'
import { useSpeak } from '@/components/common/speak'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SettingRow,
  Slider,
  Switch,
} from '@/components/ui/controls'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input, Label } from '@/components/ui/input'
import { COURSES } from '@/content'
import {
  frenchVoicesRanked,
  isNoveltyVoice,
  loadVoices,
  onVoicesChanged,
  refreshVoices,
  resolveVoice,
  slowRate,
  supportsSTT,
  supportsTTS,
  voiceLabel,
} from '@/lib/speech'
import { ProfilesCard } from '@/components/common/profiles-card'
import { SyncCard } from '@/components/common/sync-card'
import { VoiceHelp } from '@/components/common/voice-help'
import { backupFilename, downloadBackup } from '@/lib/backup'
import { cn } from '@/lib/utils'
import { toast } from '@/store/toasts'
import { LEARNER_VERSION, useActiveProfile, useLearner, type Profile } from '@/store/learner'
import { useSettings, type Theme } from '@/store/settings'

const AVATARS = ['🦊', '🐧', '🦉', '🐬', '🦋', '🌿', '⭐️', '🎈', '🥐', '🗼', '📚', '🎧']

export function SettingsPage() {
  const navigate = useNavigate()
  const settings = useSettings()
  const profile = useActiveProfile()
  const profiles = useLearner((s) => s.profiles)
  const updateProfile = useLearner((s) => s.updateProfile)
  const deleteProfile = useLearner((s) => s.deleteProfile)
  const resetProgress = useLearner((s) => s.resetProgress)
  const importProfiles = useLearner((s) => s.importProfiles)

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [confirm, setConfirm] = useState<null | 'reset' | 'delete'>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const { speak } = useSpeak()

  useEffect(() => {
    // Same order the automatic choice uses, so the top of the list is the one
    // the app would have picked.
    const sync = () => setVoices(frenchVoicesRanked())
    void loadVoices().then(sync)
    // And again whenever the system's list changes, so a voice installed while
    // this page is open appears without a reload.
    return onVoicesChanged(sync)
  }, [])

  if (!profile) return null

  const exportData = () => {
    downloadBackup(profiles, LEARNER_VERSION)
    toast({
      title: 'Копію збережено',
      description: backupFilename(),
      tone: 'ok',
    })
  }

  /**
   * Which French a voice actually speaks.
   *
   * Amélie is Québécois, and the list gives no hint of it — so a learner
   * picking by name can land a different accent from the one the course
   * teaches without ever being told.
   */
  /**
   * A voice chosen elsewhere that this device does not have at all.
   *
   * Different from the cross-browser case above: there the voice is present
   * under another id and resolves fine. Here it is genuinely absent, the app
   * falls back to the automatic choice, and saying so beats a box that reads
   * "Автоматично" as though that were the setting.
   */
  const chosenVoiceMissing =
    Boolean(settings.voiceName) && !resolveVoice(settings.voiceURI, settings.voiceName)

  const frenchVariety = (lang: string) => {
    const tag = lang.toLowerCase().replace('_', '-')
    if (tag === 'fr-fr') return 'Франція'
    if (tag === 'fr-ca') return 'Канада'
    if (tag === 'fr-be') return 'Бельгія'
    if (tag === 'fr-ch') return 'Швейцарія'
    return tag
  }

  const importData = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        if (Array.isArray(data?.profiles)) {
          importProfiles(data.profiles as Profile[])
          toast({
            title: 'Дані імпортовано',
            description: `Профілів: ${(data.profiles as Profile[]).length}`,
            tone: 'ok',
          })
        } else {
          toast({ title: 'Не схоже на файл Passerelle', tone: 'error' })
        }
      } catch {
        toast({ title: 'Не вдалося прочитати файл', tone: 'error' })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader title="Налаштування" description="Голос, вигляд, дані — усе під твій темп." />

      {/* Profile */}
      <section>
        <SectionTitle>Профіль</SectionTitle>
        <Card className="p-5">
          <div>
            <Label htmlFor="p-name">Ім’я</Label>
            <Input
              id="p-name"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="mt-1.5 max-w-sm"
            />
          </div>

          <div className="mt-5">
            <Label>Як писати про тебе французькою</Label>
            <p className="text-fg-muted mt-1 text-[13px] leading-snug text-pretty">
              Від цього залежить узгодження: «je suis allé» чи «je suis allée».
            </p>
            <div className="mt-2.5 flex gap-2.5">
              {(
                [
                  { gender: 'm', example: 'Je suis prêt.', uk: 'чоловічий рід' },
                  { gender: 'f', example: 'Je suis prête.', uk: 'жіночий рід' },
                ] as const
              ).map((choice) => (
                <button
                  key={choice.gender}
                  type="button"
                  onClick={() => {
                    // The pair only differs in a final consonant you can hear
                    // but barely see — "prêt" against "prête" — so the choice
                    // says itself.
                    speak(choice.example)
                    updateProfile({ gender: choice.gender })
                  }}
                  className={cn(
                    'flex-1 rounded-2xl border-2 p-3.5 text-left transition-all sm:max-w-52',
                    profile.gender === choice.gender
                      ? 'border-primary bg-primary-soft'
                      : 'border-line bg-surface hover:border-line-strong',
                  )}
                >
                  <div className="fr text-[14px] font-semibold">{choice.example}</div>
                  <div className="text-fg-muted mt-0.5 text-[12px]">{choice.uk}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <Label>Аватар</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => updateProfile({ emoji: a })}
                  className={cn(
                    'grid size-11 place-items-center rounded-xl border text-xl transition-colors',
                    profile.emoji === a
                      ? 'border-primary bg-primary-soft'
                      : 'border-line bg-surface hover:bg-surface-2',
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <Label>Курс</Label>
            <Select value={profile.courseId} onValueChange={(v) => updateProfile({ courseId: v })}>
              <SelectTrigger className="mt-1.5 max-w-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COURSES.filter((c) => c.status === 'ready').map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.from} → {c.to} · {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-line mt-6 flex flex-wrap gap-2.5 border-t pt-5">
            <Button variant="surface" onClick={() => navigate('/onboarding?add=1')}>
              <UserPlus /> Додати ім’я
            </Button>
            {profiles.length > 1 && (
              <Button variant="ghost" className="text-danger" onClick={() => setConfirm('delete')}>
                <Trash2 /> Видалити цей профіль
              </Button>
            )}
          </div>
        </Card>
      </section>

      {/* Voice */}
      <section>
        <SectionTitle>Голос і звук</SectionTitle>
        <Card className="divide-line divide-y px-5">
          {supportsTTS() ? (
            <>
              <SettingRow
                label="Французький голос"
                description={
                  voices.length
                    ? `Доступно ${voices.length}, найкращі — зверху. «Франція» — вимова, якої вчить курс.`
                    : 'Голоси ще завантажуються або відсутні в системі.'
                }
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Select
                    // Resolved, not the stored URI. A voiceURI identifies a
                    // voice on the machine it was chosen on: Firefox and Chrome
                    // give the same voice different ones, so the stored value
                    // matched no item and the box simply looked empty — while
                    // the voice itself was in the list and was being used.
                    value={resolveVoice(settings.voiceURI, settings.voiceName)?.voiceURI ?? 'auto'}
                    onValueChange={(v) => {
                      // Store the name alongside the URI: the URI identifies
                      // this machine's copy, the name is what another device
                      // can recognise.
                      const chosen = voices.find((x) => x.voiceURI === v)
                      settings.set('voiceURI', v === 'auto' ? null : v)
                      settings.set('voiceName', v === 'auto' ? null : (chosen?.name ?? null))
                    }}
                  >
                    <SelectTrigger className="w-full min-w-0 sm:w-56">
                      <SelectValue placeholder="Автоматично" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Автоматично</SelectItem>
                      {voices.map((v) => (
                        <SelectItem key={v.voiceURI} value={v.voiceURI}>
                          {voiceLabel(v)} · {frenchVariety(v.lang)}
                          {isNoveltyVoice(v) ? ' · жартівливий' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="surface"
                    size="icon"
                    className="shrink-0"
                    // Chrome does not always announce a voice installed while it
                    // is running, so offer to look again rather than asking for
                    // a restart.
                    onClick={() => {
                      refreshVoices()
                      const list = frenchVoicesRanked()
                      setVoices(list)
                      toast({
                        title: 'Список голосів оновлено',
                        description: list.length
                          ? `Французьких голосів: ${list.length}`
                          : 'Французьких голосів не знайдено',
                        tone: list.length ? 'info' : 'error',
                      })
                    }}
                    aria-label="Оновити список голосів"
                    title="Оновити список голосів"
                  >
                    <RefreshCw />
                  </Button>
                  <Button
                    variant="surface"
                    size="icon"
                    className="shrink-0"
                    onClick={() => speak('Bonjour ! Je suis votre professeur de français.')}
                    aria-label="Прослухати"
                  >
                    <Play />
                  </Button>
                </div>
              </SettingRow>

              {chosenVoiceMissing && (
                <p className="text-warning px-0 pt-1 pb-2 text-[12.5px] leading-snug text-pretty">
                  Голос «{settings.voiceName}» не встановлено на цьому пристрої — поки що звучить
                  автоматично обраний. Обери інший тут або встанови той самий у системі.
                </p>
              )}

              <VoiceHelp voices={voices} />

              <SettingRow
                label="Швидкість мовлення"
                description={`Зараз ${settings.rate.toFixed(2)}×, кнопка «повільно» — ${slowRate(settings.rate).toFixed(2)}×. Для початківців корисно повільніше.`}
              >
                <Slider
                  value={[settings.rate]}
                  min={0.4}
                  max={1.2}
                  step={0.02}
                  onValueChange={([v]) => settings.set('rate', v)}
                  className="w-40"
                />
              </SettingRow>

              <SettingRow
                label="Автоматична озвучка"
                description="Промовляти французьку одразу, коли з’являється завдання"
              >
                <Switch
                  checked={settings.autoSpeak}
                  onCheckedChange={(v) => settings.set('autoSpeak', v)}
                />
              </SettingRow>

              <SettingRow label="Звукові сигнали" description="Короткий сигнал після відповіді">
                <Switch
                  checked={settings.soundEffects}
                  onCheckedChange={(v) => settings.set('soundEffects', v)}
                />
              </SettingRow>
            </>
          ) : (
            <div className="text-fg-muted py-5 text-sm">
              Синтез мовлення недоступний у цьому браузері.
            </div>
          )}
        </Card>

        {!supportsSTT() && (
          <p className="text-fg-muted mt-3 flex items-start gap-2 text-[13px] text-pretty">
            <TriangleAlert className="text-warning mt-0.5 size-4 shrink-0" />
            Розпізнавання мовлення недоступне тут. Вправи на вимову працюють у Chrome, Edge та
            Safari.
          </p>
        )}
      </section>

      {/* Learning */}
      <section>
        <SectionTitle>Навчання</SectionTitle>
        <Card className="divide-line divide-y px-5">
          <SettingRow
            label="Денна ціль"
            description={`${settings.dailyGoal} XP — приблизно ${Math.round(settings.dailyGoal / 12)} хв на день`}
          >
            <Slider
              value={[settings.dailyGoal]}
              min={20}
              max={200}
              step={10}
              onValueChange={([v]) => settings.set('dailyGoal', v)}
              className="w-40"
            />
          </SettingRow>

          <SettingRow
            label="Показувати транскрипцію"
            description="Фонетичний запис [bɔ̃.ʒuʁ] біля слів"
          >
            <Switch
              checked={settings.showIpa}
              onCheckedChange={(v) => settings.set('showIpa', v)}
            />
          </SettingRow>

          <SettingRow
            label="Сувора перевірка діакритики"
            description="Без цього «cafe» замість «café» зараховується як «майже правильно». На іспиті перевірка сувора завжди."
          >
            <Switch
              checked={settings.strictAccents}
              onCheckedChange={(v) => settings.set('strictAccents', v)}
            />
          </SettingRow>
        </Card>
      </section>

      {/* Appearance */}
      <section>
        <SectionTitle>Вигляд</SectionTitle>
        <Card className="p-5">
          <Label>Тема</Label>
          <div className="mt-2 grid grid-cols-3 gap-2.5">
            {(
              [
                { id: 'light', label: 'Світла', Icon: Sun },
                { id: 'dark', label: 'Темна', Icon: Moon },
                { id: 'system', label: 'Системна', Icon: Monitor },
              ] as { id: Theme; label: string; Icon: typeof Sun }[]
            ).map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => settings.set('theme', id)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 py-4 text-[13px] font-medium transition-colors',
                  settings.theme === id
                    ? 'border-primary bg-primary-soft text-primary-soft-fg'
                    : 'border-line bg-surface text-fg-muted hover:border-line-strong',
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </div>
        </Card>
      </section>

      {/* Account */}
      <section>
        <SectionTitle>Акаунт</SectionTitle>
        <Card className="p-5">
          <SyncCard />
        </Card>
      </section>

      {/* Profiles */}
      <section>
        <SectionTitle>Імена на цьому акаунті</SectionTitle>
        <Card className="p-5">
          <ProfilesCard />
        </Card>
      </section>

      {/* Data */}
      <section>
        <SectionTitle>Дані</SectionTitle>
        <Card className="p-5">
          <p className="text-fg-muted text-[13.5px] leading-relaxed text-pretty">
            Прогрес можна вивантажити у файл — щоб мати його поза застосунком або перенести туди, де
            немає входу через Google.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Button variant="surface" onClick={exportData}>
              <Download /> Експортувати
            </Button>
            <Button variant="surface" onClick={() => fileRef.current?.click()}>
              <Upload /> Імпортувати
            </Button>
            <input
              ref={fileRef}
              type="file"
              // The extension matters as much as the MIME type: iOS matches the
              // Files picker on UTType, and a bare application/json greys out
              // the very .json file this app just wrote.
              accept=".json,application/json"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) importData(f)
                e.target.value = ''
              }}
            />
            <Button variant="ghost" className="text-danger" onClick={() => setConfirm('reset')}>
              <Trash2 /> Скинути прогрес
            </Button>
          </div>
        </Card>
      </section>

      <p className="text-fg-subtle pb-6 text-center text-[12px] text-pretty">
        Passerelle · курс французької для українців · без підписок і без відстеження
      </p>

      {/* Confirmations */}
      <Dialog open={confirm !== null} onOpenChange={(v) => !v && setConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirm === 'reset' ? 'Скинути весь прогрес?' : 'Видалити профіль?'}
            </DialogTitle>
            <DialogDescription>
              {confirm === 'reset'
                ? 'Уроки, картки, зошит і статистика будуть стерті. Ім’я та курс залишаться. Скасувати це не вийде.'
                : `Профіль «${profile.name}» і весь його прогрес буде видалено назавжди.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="surface" onClick={() => setConfirm(null)}>
              Скасувати
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm === 'reset') resetProgress()
                else {
                  deleteProfile(profile.id)
                  navigate('/')
                }
                setConfirm(null)
              }}
            >
              {confirm === 'reset' ? 'Скинути' : 'Видалити'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
