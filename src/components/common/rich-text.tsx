import { Fragment } from 'react'
import { SpeakButton } from '@/components/common/speak'
import { parseEmphasis, type Span } from '@/lib/emphasis'
import { frenchIn } from '@/lib/speech'
import { cn } from '@/lib/utils'

/**
 * Minimal prose renderer for lesson copy.
 * Supports **bold**, *французький приклад*, `•`/`1.` lists, `>` callouts and
 * blank-line paragraphs — enough to write a textbook without pulling in a
 * Markdown parser.
 */
export function RichText({ children, className }: { children: string; className?: string }) {
  const blocks = children.trim().split(/\n\s*\n/)

  return (
    <div className={cn('text-fg-muted space-y-3.5 text-[15px] leading-relaxed', className)}>
      {blocks.map((block, bi) => {
        const lines = block.split('\n')

        if (lines.every((l) => /^\s*[•·-]\s+/.test(l))) {
          return (
            <ul key={bi} className="space-y-1.5 pl-1">
              {lines.map((l, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="bg-accent mt-[7px] size-1.5 shrink-0 rounded-full" />
                  <span>
                    <Line>{l.replace(/^\s*[•·-]\s+/, '')}</Line>
                  </span>
                </li>
              ))}
            </ul>
          )
        }

        if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
          return (
            <ol key={bi} className="space-y-1.5">
              {lines.map((l, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="text-accent mt-px font-mono text-[12px] font-semibold">
                    {i + 1}.
                  </span>
                  <span>
                    <Line>{l.replace(/^\s*\d+\.\s+/, '')}</Line>
                  </span>
                </li>
              ))}
            </ol>
          )
        }

        if (lines[0].startsWith('>')) {
          return (
            <blockquote
              key={bi}
              className="border-primary bg-primary-soft/50 font-display text-fg rounded-xl border-l-4 px-4 py-3 text-base font-medium"
            >
              {lines.map((l, i) => (
                <div key={i}>
                  <Line>{l.replace(/^>\s?/, '')}</Line>
                </div>
              ))}
            </blockquote>
          )
        }

        return (
          <p key={bi} className="text-pretty">
            {lines.map((l, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                <Line>{l}</Line>
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}

/**
 * One line of prose, with audio when there is French in it.
 *
 * Most French a learner meets in a lesson lives here — "Je n'aime pas le café.
 * — Я не люблю каву." — and until now this was the one place in the app with no
 * sound at all: not tappable, not speakable, just text.
 */
function Line({ children }: { children: string }) {
  const french = frenchIn(children)
  return (
    <>
      <Inline>{children}</Inline>
      {french && (
        <>
          {' '}
          <SpeakButton
            text={french}
            size="sm"
            className="translate-y-1.5"
            label={`Прослухати: ${french}`}
          />
        </>
      )}
    </>
  )
}

function render(spans: Span[]) {
  return spans.map((span, i) => {
    if (span.kind === 'text') return <Fragment key={i}>{span.text}</Fragment>
    if (span.kind === 'bold') {
      return (
        <strong key={i} className="text-fg font-semibold">
          {render(span.children)}
        </strong>
      )
    }
    // Italics mark French inside Ukrainian explanation — the reader needs to see
    // at a glance which language a phrase is in.
    return (
      <em key={i} className="text-fg font-medium italic">
        {render(span.children)}
      </em>
    )
  })
}

/**
 * The same emphasis rules as RichText, without the block layout — for content
 * strings that land in a cell, a callout or a caption rather than a paragraph.
 */
export function Inline({ children }: { children: string }) {
  return <>{render(parseEmphasis(children))}</>
}

/**
 * Text that may contain French, with a way to hear it.
 *
 * Explanations, hints and warnings are written in Ukrainian *about* French, so
 * a plain speaker button would have the voice stumble through the Cyrillic.
 * This renders the line as written and offers audio for the French inside it —
 * automatically, wherever it appears, so the learner never meets a French
 * phrase they cannot listen to.
 *
 * When there is no French in the string, nothing is rendered but the text.
 */
export function SpeakInline({
  children,
  className,
  size = 'sm',
}: {
  children: string
  className?: string
  size?: 'sm' | 'md'
}) {
  const french = frenchIn(children)

  if (!french) return <Inline>{children}</Inline>

  return (
    <span className={cn('inline', className)}>
      <Inline>{children}</Inline>{' '}
      <SpeakButton
        text={french}
        size={size}
        className="translate-y-1.5"
        label={`Прослухати: ${french}`}
      />
    </span>
  )
}
