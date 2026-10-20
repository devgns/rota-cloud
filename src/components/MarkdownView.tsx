import { ExternalLink } from 'lucide-react'
import { isValidElement, type ReactNode } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { hasTextFigure, TextFigure } from '@/components/diagrams/figures'
import { remarkAbbr, type AbbrEntry } from '@/lib/abbreviations'

/** Texto de um bloco ```text, para trocar esquemas em ASCII por figuras. */
function textBlock(children: ReactNode): string | null {
  if (!isValidElement<{ className?: string; children?: ReactNode }>(children)) return null
  const { className, children: code } = children.props
  return className === 'language-text' && typeof code === 'string' ? code.replace(/\n$/, '') : null
}

// Fora do componente: identidade estável evita remontar a figura (e fechar o <details>) a cada render.
function Pre({ children }: { children?: ReactNode }) {
  const text = textBlock(children)
  if (text !== null && hasTextFigure(text)) return <TextFigure text={text} />
  return <pre>{children}</pre>
}

function chapterFromIndexHref(href: string | undefined): string | null {
  if (!href) return null
  const match = /^#(\d+)-/.exec(href)
  if (!match?.[1]) return null
  return `chapter-${match[1].padStart(2, '0')}`
}

export interface AbbrOptions {
  entries: readonly AbbrEntry[]
  expand: ReadonlySet<string>
}

export function MarkdownView({ source, anchorId, abbr }: { source: string; anchorId?: string; abbr?: AbbrOptions }) {
  let anchored = false
  const take = () => {
    if (anchored || !anchorId) return undefined
    anchored = true
    return anchorId
  }
  const components: Components = {
    h1: ({ children }) => <h1 id={take()}>{children}</h1>,
    h2: ({ children }) => <h2 id={take()}>{children}</h2>,
    h3: ({ children }) => <h3 id={take()}>{children}</h3>,
    h4: ({ children }) => <h4 id={take()}>{children}</h4>,
    pre: Pre,
    table: ({ children }) => (
      <div className="table-scroll" tabIndex={0}>
        <table>{children}</table>
      </div>
    ),
    a: ({ href, children }) => {
      const chapterId = chapterFromIndexHref(href)
      if (chapterId) return <Link to={`/ler/${chapterId}`}>{children}</Link>
      if (href?.startsWith('http')) {
        return (
          <a href={href} target="_blank" rel="noreferrer noopener">
            {children} <ExternalLink className="inline h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />
            <span className="sr-only"> (site externo)</span>
          </a>
        )
      }
      return <a href={href}>{children}</a>
    },
  }
  return (
    <div className="prose-study">
      <ReactMarkdown remarkPlugins={abbr ? [remarkGfm, [remarkAbbr, { entries: abbr.entries, expand: abbr.expand }]] : [remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  )
}
