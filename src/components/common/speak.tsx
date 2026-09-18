import * as PopoverPrimitive from '@radix-ui/react-popover'
import { BookmarkPlus, BookmarkCheck, Turtle, Volume2, WholeWord } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { WORDS, type Word } from '@/content'
import { agree } from '@/lib/agreement'
import { parseEmphasis, type Span } from '@/lib/emphasis'
import {
  cancelSpeechBy,
  loadVoices,
  slowRate,
  speak as speakRaw,
  speakSequence,
  wordsOf,
} from '@/lib/speech'
import { cn } from '@/lib/utils'
import { useGender, useLearner } from '@/store/learner'
import { useSettings } from '@/store/settings'

/* ------------------------------------------------------------------ *
 * Speaking
 * ------------------------------------------------------------------ */

/**
 * The three ways a phrase can be heard.
 *
 * Normal is the voice at the learner's chosen speed. Slow is half that, for
 * hearing where one word ends and the next begins — French runs words
 * together, and at full speed a beginner hears "vous avez" as one sound. Words
 * goes further and says each word on its own with a pause, which is the mode
 * for picking a phrase apart before trying to say it.
 */
export type SpeakMode = 'normal' | 'slow' | 'words'

export type SpeakController = {
  speak: (text: string, opts?: { rate?: number; onEnd?: () => void }) => void
  speakSlow: (text: string) => void
  speakWords: (text: string) => void
  /** Play `text` in `mode`, or stop if that same mode is already playing. */
  toggle: (text: string, mode: SpeakMode) => void
  stop: () => void
  speaking: boolean
  mode: SpeakMode | null
  /** Index of the word being said right now, when the engine reports it. */
  activeWord: number | null
}

export function useSpeak(): SpeakController {
  const rate = useSettings((s) => s.rate)
  const voiceURI = useSettings((s) => s.voiceURI)
  const voiceName = useSettings((s) => s.voiceName)
  const gender = useGender()
  const [mode, setMode] = useState<SpeakMode | null>(null)
  const [activeWord, setActiveWord] = useState<number | null>(null)

  // Identity for this hook instance, so unmounting silences only what it
  // started. A flashcard flip unmounts the speaker button inside the card, and
  // a blanket cancel there cut the card's own audio off mid-word.
  const [owner] = useState(() => ({}))

  useEffect(() => {
    void loadVoices()
    return () => cancelSpeechBy(owner)
  }, [owner])

  const done = useCallback(() => {
    setMode(null)
    setActiveWord(null)
  }, [])

  const say = useCallback(
    (text: string, which: SpeakMode, opts: { rate?: number; onEnd?: () => void } = {}) => {
      setMode(which)
      setActiveWord(null)
      void speakRaw(agree(text, gender), {
        rate: opts.rate ?? rate,
        voiceURI: voiceURI ?? undefined,
        voiceName: voiceName ?? undefined,
        owner,
        onWord: setActiveWord,
        onEnd: () => {
          done()
          // Callers that read several passages in a row need to know when one
          // has finished, so they can start the next instead of talking over it.
          opts.onEnd?.()
        },
      })
    },
    [gender, rate, voiceURI, voiceName, owner, done],
  )

  const speak = useCallback(
    (text: string, opts: { rate?: number; onEnd?: () => void } = {}) => say(text, 'normal', opts),
    [say],
  )

  /** Deliberately slow — for hearing where the words join. */
  const speakSlow = useCallback(
    (text: string) => say(text, 'slow', { rate: slowRate(rate) }),
    [say, rate],
  )

  /** One word at a time, each on its own, with room between them. */
  const speakWords = useCallback(
    (text: string) => {
      const words = wordsOf(agree(text, gender))
      if (!words.length) return
      setMode('words')
      setActiveWord(null)
      void speakSequence(words, {
        // A touch under the learner's speed: single words said at full pace
        // come out clipped, and clipped is the opposite of what this is for.
        rate: Math.min(rate, 0.85),
        gapMs: 420,
        voiceURI: voiceURI ?? undefined,
        voiceName: voiceName ?? undefined,
        owner,
        onPart: setActiveWord,
      }).then(done)
    },
    [gender, rate, voiceURI, voiceName, owner, done],
  )

  const stop = useCallback(() => {
    cancelSpeechBy(owner)
    done()
  }, [owner, done])

  const toggle = useCallback(
    (text: string, which: SpeakMode) => {
      if (mode === which) {
        stop()
        return
      }
      if (which === 'slow') speakSlow(text)
      else if (which === 'words') speakWords(text)
      else speak(text)
    },
    [mode, stop, speak, speakSlow, speakWords],
  )

  return { speak, speakSlow, speakWords, toggle, stop, speaking: mode !== null, mode, activeWord }
}

/* ------------------------------------------------------------------ *
 * The audio control
 *
 * One cluster, everywhere French is heard: play, slow, and — for phrases —
 * word by word. Every piece of French in the app gets the same three, so the
 * learner never has to wonder whether *this* speaker button can go slow.
 * ------------------------------------------------------------------ */

type ControlSize = 'sm' | 'md' | 'lg'

const MAIN_SIZE: Record<ControlSize, string> = {
  sm: 'size-8 [&_svg]:size-4',
  md: 'size-10 [&_svg]:size-5',
  lg: 'size-12 [&_svg]:size-6',
}

const AUX_SIZE: Record<ControlSize, string> = {
  sm: 'size-6 [&_svg]:size-3.5',
  md: 'size-8 [&_svg]:size-4',
  lg: 'size-9 [&_svg]:size-[18px]',
}

export function SpeakControls({
  text,
  ctl,
  size = 'md',
  label,
  slow = true,
  words = 'auto',
  className,
}: {
  text: string
  ctl: SpeakController
  size?: ControlSize
  label?: string
  /** Offer the half-speed reading. On by default: every phrase deserves it. */
  slow?: boolean
  /** Offer word-by-word. `auto` shows it once there are three words to split. */
  words?: boolean | 'auto'
  className?: string
}) {
  const showWords = words === 'auto' ? wordsOf(text).length >= 3 : words
  const main = ctl.mode === 'normal'

  return (
    // A span, not a div: this sits inside prose paragraphs, and a <div> inside
    // a <p> is invalid HTML — the browser silently closes the paragraph early,
    // which breaks the run of text around it. `inline-flex` renders the same.
    <span className={cn('inline-flex items-center gap-1 align-middle', className)}>
      <button
        type="button"
        onClick={() => ctl.toggle(text, 'normal')}
        aria-label={label ?? `Прослухати: ${text}`}
        aria-pressed={main}
        className={cn(
          'bg-primary-soft text-primary-soft-fg grid shrink-0 place-items-center rounded-full transition-all',
          'hover:brightness-95 active:scale-95 dark:hover:brightness-110',
          'focus-visible:ring-primary/40 outline-none focus-visible:ring-4',
          MAIN_SIZE[size],
          main && 'bg-primary text-primary-fg ring-primary/25 ring-4',
        )}
      >
        <Volume2 className={cn(main && 'animate-pulse')} />
      </button>

      {slow && (
        <button
          type="button"
          onClick={() => ctl.toggle(text, 'slow')}
          aria-label="Прослухати повільно"
          aria-pressed={ctl.mode === 'slow'}
          title="Повільно"
          className={cn(
            'text-fg-subtle hover:bg-surface-2 hover:text-fg grid shrink-0 place-items-center rounded-full transition-colors',
            'focus-visible:ring-primary/40 outline-none focus-visible:ring-4',
            AUX_SIZE[size],
            ctl.mode === 'slow' && 'bg-primary-soft text-primary-soft-fg',
          )}
        >
          <Turtle />
        </button>
      )}

      {showWords && (
        <button
          type="button"
          onClick={() => ctl.toggle(text, 'words')}
          aria-label="Прослухати по словах"
          aria-pressed={ctl.mode === 'words'}
          title="По словах"
          className={cn(
            'text-fg-subtle hover:bg-surface-2 hover:text-fg grid shrink-0 place-items-center rounded-full transition-colors',
            'focus-visible:ring-primary/40 outline-none focus-visible:ring-4',
            AUX_SIZE[size],
            ctl.mode === 'words' && 'bg-primary-soft text-primary-soft-fg',
          )}
        >
          <WholeWord />
        </button>
      )}
    </span>
  )
}

/** The audio control on its own, for French that is shown elsewhere. */
export function SpeakButton({
  text,
  className,
  size = 'md',
  label,
  slow = true,
  words = 'auto',
}: {
  text: string
  className?: string
  size?: ControlSize
  label?: string
  slow?: boolean
  words?: boolean | 'auto'
}) {
  const ctl = useSpeak()
  return (
    <SpeakControls
      text={text}
      ctl={ctl}
      size={size}
      label={label}
      slow={slow}
      words={words}
      className={className}
    />
  )
}

/**
 * French text and its audio, wired to each other.
 *
 * The words light up as they are said. That needs the control and the text to
 * share one controller, which is why this exists: a `SpeakButton` next to a
 * `TapText` are two strangers, and the text has no way of knowing which word
 * the voice has reached. The layout is the caller's — dialogue lines, story
 * paragraphs and exercise reveals all put the pieces in different places.
 */
export function Spoken({
  text,
  size = 'md',
  slow,
  words,
  textClassName,
  children,
}: {
  text: string
  size?: ControlSize
  slow?: boolean
  words?: boolean | 'auto'
  textClassName?: string
  children: (parts: { controls: ReactNode; text: ReactNode; ctl: SpeakController }) => ReactNode
}) {
  const ctl = useSpeak()
  return (
    <>
      {children({
        ctl,
        controls: <SpeakControls text={text} ctl={ctl} size={size} slow={slow} words={words} />,
        text: (
          <TapText activeWord={ctl.activeWord} className={textClassName}>
            {text}
          </TapText>
        ),
      })}
    </>
  )
}

/**
 * The commonest arrangement: audio on the left, French beside it, Ukrainian
 * underneath. Grammar examples, dialogue lines and word examples are all this.
 */
export function SpokenLine({
  fr,
  uk,
  size = 'sm',
  className,
  frClassName,
  ukClassName,
  above,
}: {
  fr: string
  uk?: string
  size?: ControlSize
  className?: string
  frClassName?: string
  ukClassName?: string
  /** Rendered above the French — a speaker's name, a label. */
  above?: ReactNode
}) {
  return (
    <Spoken text={fr} size={size}>
      {({ controls, text }) => (
        <div className={cn('flex items-start gap-3', className)}>
          <span className="mt-0.5 shrink-0">{controls}</span>
          <div className="min-w-0 flex-1">
            {above}
            <div className={cn('fr text-[15px] leading-snug font-medium', frClassName)}>{text}</div>
            {uk && (
              <div className={cn('text-fg-muted mt-0.5 text-[13px] leading-snug', ukClassName)}>
                {uk}
              </div>
            )}
          </div>
        </div>
      )}
    </Spoken>
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
    // …and the function words too. Without this "c'est" found nothing, because
    // "est" lives in the grammar glossary rather than in the dictionary.
    const fnAfter = FUNCTION_GLOSS[after]
    if (fnAfter) return { fr: clean, uk: fnAfter }
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
          <div className="border-line text-fg-muted mt-2 border-t pt-2 text-[12px] leading-snug">
            <div className="flex items-start gap-1.5">
              <span className="fr text-fg flex-1">{gloss.word.example.fr}</span>
              <SpeakButton text={gloss.word.example.fr} size="sm" className="-mt-1 shrink-0" />
            </div>
            {gloss.word.example.uk}
          </div>
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
const WORD_CLASS =
  'decoration-primary/25 hover:bg-primary-soft hover:decoration-primary/60 cursor-pointer rounded-[3px] underline decoration-dotted decoration-1 underline-offset-[3px] transition-colors'

/**
 * The word being said right now.
 *
 * A filled highlight rather than a colour change: it has to be findable at a
 * glance from across the line, while the eye is on the previous word.
 */
const ACTIVE_CLASS = 'bg-primary text-primary-fg decoration-transparent'

/**
 * One whitespace-separated word.
 *
 * Tapping **speaks it and opens the gloss**. It used to only open the gloss,
 * which put a second tap between the learner and the sound — while a dotted
 * underline elsewhere in the app spoke immediately. Two identical affordances
 * that behaved differently is worse than either behaviour on its own.
 *
 * Every French word is tappable, dictionary entry or not. Conjugated forms of
 * irregular verbs ("comprends" from *comprendre*) are not in the index and
 * guessing at them would risk showing the wrong meaning — but there is always
 * something to *hear*, and silence was the worse answer.
 */
function Token({ token, active }: { token: string; active?: boolean }) {
  const gloss = lookupWord(token)
  const { speak } = useSpeak()

  // Ukrainian, digits, bare punctuation: nothing to say and nothing to gloss.
  if (!/\p{Script=Latin}/u.test(token)) return <span>{token}</span>

  if (!gloss) {
    return (
      <button
        type="button"
        onClick={() => speak(token)}
        aria-label={`Прослухати: ${token}`}
        className={cn(WORD_CLASS, active && ACTIVE_CLASS)}
      >
        {token}
      </button>
    )
  }

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          onClick={() => speak(gloss.word?.fr ?? token)}
          className={cn(WORD_CLASS, active && ACTIVE_CLASS)}
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
 *
 * `counter` numbers the spoken words across nested spans, in order, so the
 * index the voice reports lines up with a token on screen. Only tokens with a
 * letter count — the same rule the voice layer applies — so punctuation on its
 * own does not put the highlight one word ahead.
 */
function tappable(
  spans: Span[],
  activeWord: number | null | undefined,
  counter: { n: number },
): React.ReactNode[] {
  return spans.map((span, i) => {
    if (span.kind === 'bold') {
      return (
        <strong key={i} className="text-primary font-semibold">
          {tappable(span.children, activeWord, counter)}
        </strong>
      )
    }
    if (span.kind === 'italic') {
      return (
        <em key={i} className="italic">
          {tappable(span.children, activeWord, counter)}
        </em>
      )
    }
    return span.text.split(/(\s+)/).map((token, j) => {
      if (/^\s*$/.test(token)) return <span key={`${i}-${j}`}>{token}</span>
      const counts = /\p{L}/u.test(token)
      const index = counts ? counter.n++ : -1
      return <Token key={`${i}-${j}`} token={token} active={counts && index === activeWord} />
    })
  })
}

export function TapText({
  children,
  className,
  as: Tag = 'span',
  activeWord,
}: {
  children: string
  className?: string
  as?: 'span' | 'p' | 'div'
  /** Index of the word currently being spoken, from a shared `useSpeak`. */
  activeWord?: number | null
}) {
  const gender = useGender()
  const spans = useMemo(() => parseEmphasis(agree(children, gender)), [children, gender])
  return <Tag className={cn('fr', className)}>{tappable(spans, activeWord, { n: 0 })}</Tag>
}
