import { Check, ExternalLink, Info } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GUIDE_LANGS, installedRecommended, voiceGuide, type GuideLang } from '@/lib/voice-guide'

/**
 * Whether this machine has a French voice worth learning from, and what to do
 * if not.
 *
 * Web Speech reads whatever the system happens to have installed, and the
 * defaults are often poor — on a Mac mostly the novelty voices, on Windows
 * nothing French at all until a language pack is added. The app cannot install
 * anything, so it names the voices worth having on the system in front of the
 * learner, says which are already there, and gives the steps.
 */
export function VoiceHelp({ voices }: { voices: SpeechSynthesisVoice[] }) {
  const [open, setOpen] = useState(false)
  /**
   * Which language the *system* menus are in, not the app.
   *
   * These steps quote menu items, and a learner on an English or French Mac
   * will not find «Вимовний контент» anywhere on their screen. The app stays
   * Ukrainian; only the path through their settings changes.
   */
  const [lang, setLang] = useState<GuideLang>('uk')
  const guide = voiceGuide()
  const have = installedRecommended(voices, guide)
  const ok = have.length > 0

  const pretty = (name: string) => name.charAt(0).toUpperCase() + name.slice(1)

  return (
    // py-4 to match SettingRow: this is a cell of the same divided card, and
    // with only a top margin the link sat flush against the divider below it.
    <div className="py-4 text-[12.5px] leading-relaxed">
      {ok ? (
        <p className="text-success flex items-start gap-1.5">
          <Check className="mt-0.5 size-3.5 shrink-0" />
          <span>
            У системі є {have.length === 1 ? 'хороший голос' : 'хороші голоси'}:{' '}
            <strong>{have.map(pretty).join(', ')}</strong>.
          </span>
        </p>
      ) : (
        <p className="text-fg-muted flex items-start gap-1.5 text-pretty">
          <Info className="text-warning mt-0.5 size-3.5 shrink-0" />
          <span>
            Жодного з найкращих французьких голосів для твоєї системи не встановлено. Курс звучатиме
            гірше, ніж міг би.
          </span>
        </p>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-fg-muted hover:text-fg mt-1.5 underline underline-offset-4"
      >
        {ok ? 'Як додати ще кращий голос' : 'Як встановити'}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Кращий французький голос</DialogTitle>
            <DialogDescription>
              Passerelle озвучує через голоси твоєї системи, тож якість залежить від того, які з них
              встановлені. Найкращі для тебе:{' '}
              <strong>{guide.recommended.slice(0, 3).map(pretty).join(', ')}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="border-line bg-surface-2 mt-1 flex items-center gap-1 rounded-xl border p-1">
            <span className="text-fg-subtle px-2 text-[11px]">Мова системи:</span>
            {GUIDE_LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                className={
                  'rounded-lg px-2.5 py-1 text-[12px] font-medium transition-colors ' +
                  (lang === l.id
                    ? 'bg-primary text-primary-fg'
                    : 'text-fg-muted hover:text-fg hover:bg-surface-3')
                }
              >
                {l.label}
              </button>
            ))}
          </div>

          <ol className="text-fg mt-3 space-y-2 text-[13.5px] leading-snug">
            {guide.steps.map((step, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="bg-surface-3 text-fg-subtle grid size-5 shrink-0 place-items-center rounded-md font-mono text-[11px]">
                  {i + 1}
                </span>
                <span className="text-pretty">{step[lang]}</span>
              </li>
            ))}
          </ol>

          {guide.note && (
            <p className="text-fg-muted mt-3 text-[12.5px] leading-snug text-pretty">
              {guide.note[lang]}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            {guide.href ? (
              <a
                href={guide.href}
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary inline-flex items-center gap-1.5 text-[13px] underline underline-offset-4"
              >
                {guide.hrefLabel?.[lang] ?? 'Офіційна інструкція'}{' '}
                <ExternalLink className="size-3.5" />
              </a>
            ) : (
              <span />
            )}
            <Button size="sm" variant="surface" onClick={() => setOpen(false)}>
              Зрозуміло
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
