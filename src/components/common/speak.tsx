import * as PopoverPrimitive from '@radix-ui/react-popover'
import { BookmarkPlus, BookmarkCheck, Loader2, Volume2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { WORDS, type Word } from '@/content'
import { agree } from '@/lib/agreement'
import { parseEmphasis, type Span } from '@/lib/emphasis'
import { cancelSpeech, loadVoices, slowRate, speak as speakRaw } from '@/lib/speech'
import { cn } from '@/lib/utils'
import { useGender, useLearner } from '@/store/learner'
import { useSettings } from '@/store/settings'

/* ------------------------------------------------------------------ *
 * Speaking
 * ------------------------------------------------------------------ */

export function useSpeak() {
  const rate = useSettings((s) => s.rate)
  const voiceURI = useSettings((s) => s.voiceURI)
  const gender = useGender()
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    void loadVoices()
    return () => cancelSpeech()
  }, [])

  const speak = useCallback(
    (text: string, opts: { rate?: number; onEnd?: () => void } = {}) => {
      setSpeaking(true)
      void speakRaw(agree(text, gender), {
        rate: opts.rate ?? rate,
        voiceURI: voiceURI ?? undefined,
        onEnd: () => {
          setSpeaking(false)
          // Callers that read several passages in a row need to know when one
          // has finished, so they can start the next instead of talking over it.
          opts.onEnd?.()
        },
      })
    },
    [gender, rate, voiceURI],
  )

  /** Deliberately slow — for picking a phrase apart word by word. */
  const speakSlow = useCallback(
    (text: string) => speak(text, { rate: slowRate(rate) }),
    [speak, rate],
  )

  return { speak, speakSlow, speaking }
}

export function SpeakButton({
  text,
  className,
  size = 'md',
  label,
  slow,
}: {
  text: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
  /** Render a secondary half-speed button too. */
  slow?: boolean
}) {
  const { speak, speakSlow, speaking } = useSpeak()
  const dim =
    size === 'sm'
      ? 'size-8 [&_svg]:size-4'
      : size === 'lg'
        ? 'size-12 [&_svg]:size-6'
        : 'size-10 [&_svg]:size-5'

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => speak(text)}
        aria-label={label ?? `Прослухати: ${text}`}
        className={cn(
          'bg-primary-soft text-primary-soft-fg grid shrink-0 place-items-center rounded-full transition-all',
          'hover:brightness-95 active:scale-95 dark:hover:brightness-110',
          dim,
          speaking && 'animate-pulse',
          className,
        )}
      >
        {speaking ? <Loader2 className="animate-spin" /> : <Volume2 />}
      </button>
      {slow && (
        <button
          type="button"
          onClick={() => speakSlow(text)}
          aria-label="Прослухати повільно"
          title="Повільно"
          className={cn(
            'border-line text-fg-muted hover:bg-surface-2 hover:text-fg grid shrink-0 place-items-center rounded-full border transition-colors',
            size === 'sm' ? 'size-8 text-[10px]' : 'size-10 text-[11px]',
          )}
        >
          ½×
        </button>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Tap-to-translate
 *
 * Every French string in the app runs through <TapText>. Clicking a word
 * speaks it and shows its Ukrainian meaning; the learner can save it straight
 * into the notebook. This is the LingQ-style reading loop, built in.
 * ------------------------------------------------------------------ */

/** Function words that carry grammar rather than meaning — worth glossing too. */
const FUNCTION_GLOSS: Record<string, string> = {
  le: 'артикль (чол. рід, означений)',
  la: 'артикль (жін. рід, означений)',
  les: 'артикль (множина, означений)',
  "l'": 'артикль перед голосною',
  un: 'артикль (чол. рід, неозначений)',
  une: 'артикль (жін. рід, неозначений)',
  des: 'артикль (множина, неозначений)',
  du: 'частковий артикль (чол. рід)',
  de: 'прийменник: з, від, про',
  à: 'прийменник: до, в, у',
  et: 'і, та',
  ou: 'або',
  où: 'де, куди',
  mais: 'але',
  que: 'що; ніж',
  qui: 'хто; який',
  ne: 'частка заперечення (перша частина)',
  pas: 'частка заперечення (друга частина)',
  est: 'є (être, 3 ос. одн.)',
  sont: 'є (être, 3 ос. мн.)',
  suis: 'є (être, 1 ос. одн.)',
  es: 'є (être, 2 ос. одн.)',
  sommes: 'є (être, 1 ос. мн.)',
  êtes: 'є (être, 2 ос. мн.)',
  ai: 'маю (avoir, 1 ос. одн.)',
  as: 'маєш (avoir)',
  a: 'має (avoir)',
  avons: 'маємо (avoir)',
  avez: 'маєте (avoir)',
  ont: 'мають (avoir)',
  ce: 'цей',
  cette: 'ця',
  ces: 'ці',
  très: 'дуже',
  plus: 'більше',
  moins: 'менше',
  aussi: 'також',
  bien: 'добре',
  pour: 'для, щоб',
  avec: 'з (разом із)',
  sans: 'без',
  dans: 'у, всередині',
  chez: 'у (когось), до (когось)',
  vers: 'близько, у напрямку',
  puis: 'потім',
  alors: 'тоді, отже',
  encore: 'ще',
  déjà: 'вже',
  toujours: 'завжди',
  jamais: 'ніколи',
  quand: 'коли',
  comme: 'як',
  tout: 'весь, усе',
  même: 'навіть; той самий',
  cela: 'це',
  ça: 'це',
  voilà: 'ось, прошу',
  oui: 'так',
  non: 'ні',
  si: 'якщо; та ні ж',
  y: 'там, туди',
  en: 'цього, їх (займенник); у (країні)',
  se: 'себе (зворотна частка)',
  me: 'мене, мені',
  te: 'тебе, тобі',
  lui: 'йому, їй',
  leur: 'їм; їхній',
  nous: 'ми, нас',
  vous: 'ви, вас',
  mon: 'мій',
  ma: 'моя',
  mes: 'мої',
  son: 'його / її',
  sa: 'його / її',
  ses: 'його / її (мн.)',
}

const ARTICLE_RE = /^(le |la |les |l'|un |une |des |du |de la |de l')/

/** Index every surface form we can cheaply derive from the vocabulary. */
const wordIndex: Map<string, Word> = (() => {
  const map = new Map<string, Word>()
  const add = (form: string, w: Word) => {
    const key = form.trim().toLowerCase()
    if (key && !map.has(key)) map.set(key, w)
  }

  for (const w of WORDS) {
    const base = w.fr.toLowerCase()
    add(base, w)
    add(base.replace(ARTICLE_RE, ''), w)
    // "grand / grande" and "ukrainien / ukrainienne" style entries
    for (const alt of base.split('/')) {
      const cleaned = alt.trim().replace(ARTICLE_RE, '')
      add(cleaned, w)
    }
    // Single-word head forms also match without the article
    const words = base.replace(ARTICLE_RE, '').split(' ')
    if (words.length === 1) add(words[0], w)
  }
  return map
})()

export type Gloss = { fr: string; uk: string; word?: Word; ipa?: string; note?: string }

export function lookupWord(token: string): Gloss | null {
  const clean = token
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/^[«»"„“”([]+|[.,!?;:…«»"„“”)\]]+$/g, '')
  if (!clean) return null

  const direct = wordIndex.get(clean)
  if (direct)
    return { fr: direct.fr, uk: direct.uk, word: direct, ipa: direct.ipa, note: direct.note }

  // Elision: "j'habite" → try "habite" and the infinitive-ish stem.
  if (clean.includes("'")) {
    const after = clean.split("'").pop() ?? ''
    const hit = wordIndex.get(after)
    if (hit) return { fr: hit.fr, uk: hit.uk, word: hit, ipa: hit.ipa, note: hit.note }
  }

  const fn = FUNCTION_GLOSS[clean]
  if (fn) return { fr: clean, uk: fn }

  // Conjugated -er verbs: strip the ending and retry the infinitive.
  const stem = clean.replace(/(e|es|ent|ons|ez|é|ée|és)$/, '')
  if (stem.length >= 3) {
    const infinitive = wordIndex.get(`${stem}er`)
    if (infinitive)
      return {
        fr: infinitive.fr,
        uk: infinitive.uk,
        word: infinitive,
        ipa: infinitive.ipa,
        note: 'Форма дієслова ' + infinitive.fr,
      }
  }

  return null
}

function WordPopover({ token, gloss }: { token: string; gloss: Gloss }) {
  const { speak } = useSpeak()
  const saved = useLearner((s) => {
    const p = s.profiles.find((x) => x.id === s.activeId)
    return gloss.word ? Boolean(p?.savedWords.includes(gloss.word.id)) : false
  })
  const toggleSavedWord = useLearner((s) => s.toggleSavedWord)
  const addCustomWord = useLearner((s) => s.addCustomWord)
  const [savedCustom, setSavedCustom] = useState(false)

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={8}
        className="border-line bg-surface animate-pop z-50 w-64 rounded-xl border p-3.5 shadow-[var(--shadow-pop)]"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="fr font-display text-fg text-base font-semibold">{gloss.fr}</div>
            {gloss.ipa && (
              <div className="text-fg-subtle mt-0.5 font-mono text-[11px]">[{gloss.ipa}]</div>
            )}
          </div>
          <button
            type="button"
            onClick={() => speak(gloss.word?.fr ?? token)}
            className="bg-primary-soft text-primary-soft-fg grid size-8 shrink-0 place-items-center rounded-full transition-transform active:scale-90"
            aria-label="Прослухати"
          >
            <Volume2 className="size-4" />
          </button>
        </div>

        <p className="text-fg mt-2 text-sm leading-snug">{gloss.uk}</p>

        {gloss.note && (
          <p className="bg-warning-soft text-warning mt-2 rounded-lg px-2.5 py-1.5 text-[12px] leading-snug">
            {gloss.note}
          </p>
        )}

        {gloss.word?.example && (
          <p className="border-line text-fg-muted mt-2 border-t pt-2 text-[12px] leading-snug">
            <span className="fr text-fg">{gloss.word.example.fr}</span>
            <br />
            {gloss.word.example.uk}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            if (gloss.word) toggleSavedWord(gloss.word.id)
            else {
              addCustomWord(gloss.fr, gloss.uk)
              setSavedCustom(true)
            }
          }}
          className={cn(
            'border-line mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors',
            saved || savedCustom
              ? 'border-success-border bg-success-soft text-success'
              : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
          )}
        >
          {saved || savedCustom ? (
            <>
              <BookmarkCheck className="size-3.5" /> У зошиті
            </>
          ) : (
            <>
              <BookmarkPlus className="size-3.5" /> Додати в зошит
            </>
          )}
        </button>
        <PopoverPrimitive.Arrow className="fill-[var(--surface)]" />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

/**
 * Renders French text with every word tappable.
 * Unknown words stay plain so the highlighting means something.
 */
/** One whitespace-separated word, tappable when the dictionary knows it. */
function Token({ token }: { token: string }) {
  const gloss = lookupWord(token)
  if (!gloss) return <span>{token}</span>
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className="decoration-primary/25 hover:bg-primary-soft hover:decoration-primary/60 cursor-pointer rounded-[3px] underline decoration-dotted decoration-1 underline-offset-[3px] transition-colors"
        >
          {token}
        </button>
      </PopoverPrimitive.Trigger>
      <WordPopover token={token} gloss={gloss} />
    </PopoverPrimitive.Root>
  )
}

/**
 * Emphasis is resolved before tokenising: a marker left in the text ends up
 * inside a tappable word and silently breaks its dictionary lookup.
 */
function tappable(spans: Span[]): React.ReactNode[] {
  return spans.map((span, i) => {
    if (span.kind === 'bold') {
      return (
        <strong key={i} className="text-primary font-semibold">
          {tappable(span.children)}
        </strong>
      )
    }
    if (span.kind === 'italic') {
      return (
        <em key={i} className="italic">
          {tappable(span.children)}
        </em>
      )
    }
    return span.text
      .split(/(\s+)/)
      .map((token, j) =>
        /^\s*$/.test(token) ? (
          <span key={`${i}-${j}`}>{token}</span>
        ) : (
          <Token key={`${i}-${j}`} token={token} />
        ),
      )
  })
}

export function TapText({
  children,
  className,
  as: Tag = 'span',
}: {
  children: string
  className?: string
  as?: 'span' | 'p' | 'div'
}) {
  const gender = useGender()
  const spans = useMemo(() => parseEmphasis(agree(children, gender)), [children, gender])
  return <Tag className={cn('fr', className)}>{tappable(spans)}</Tag>
}
