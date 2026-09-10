import { Fragment } from 'react'
import { parseEmphasis, type Span } from '@/lib/emphasis'
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
                    <Inline>{l.replace(/^\s*[•·-]\s+/, '')}</Inline>
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
                    <Inline>{l.replace(/^\s*\d+\.\s+/, '')}</Inline>
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
                  <Inline>{l.replace(/^>\s?/, '')}</Inline>
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
                <Inline>{l}</Inline>
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
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
