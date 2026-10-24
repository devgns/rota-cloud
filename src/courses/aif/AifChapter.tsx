import { isValidElement, useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
import { coursePath } from '../registry'
import { AifDiagram } from './AifVisuals'
import { AifWorksheet } from './AifWorksheet'
import { diagramsFor } from './diagrams/registry'
import { isRecallSection, openingId, recallItems, splitChapter, type AifSection } from './sections'

const p = (path = '') => coursePath('aif-c01', path)

function Markdown({ text }: { text: string }) {
  const components = {
    pre: ({ children }: { children?: ReactNode }) => {
      if (isValidElement<{ className?: string; children?: ReactNode }>(children)) {
        const props = children.props
        if (props.className === 'language-mermaid' && typeof props.children === 'string') return <AifDiagram code={props.children.trim()} />
      }
      return <pre className="overflow-x-auto">{children}</pre>
    },
    table: ({ children }: { children?: ReactNode }) => <div className="table-scroll" tabIndex={0}><table>{children}</table></div>,
    a: ({ href, children }: { href?: string; children?: ReactNode }) => {
      if (href?.startsWith('#')) {
        const match = /^#(\d+)-/.exec(href)
        if (match) return <Link to={p(`/ler/chapter-${match[1]!.padStart(2, '0')}`)}>{children}</Link>
        return <a href={href} onClick={(event) => { event.preventDefault(); document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' }) }}>{children}</a>
      }
      return <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer noopener">{children}</a>
    },
  }
  return <div className="prose-study"><ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{text}</ReactMarkdown></div>
}

function Inline({ text }: { text: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ p: ({ children }) => <>{children}</> }}>{text}</ReactMarkdown>
}

function RecallCard({ question, answer, index }: { question: string; answer?: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="dg-box list-none" data-tone={open ? 'ok' : 'plain'}>
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-ink-soft">{answer ? `Pergunta ${index + 1}` : `Para pensar ${index + 1}`}</p>
      <p className="m-0 mt-1"><Inline text={question} /></p>
      {answer && (
        <>
          {open && <p className="m-0 mt-2 border-t border-line pt-2" role="status"><Inline text={answer} /></p>}
          <button type="button" className="choice mt-2 text-sm" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Ocultar resposta' : 'Mostrar resposta'}</button>
        </>
      )}
    </li>
  )
}

function Recall({ section }: { section: AifSection }) {
  const items = recallItems(section.markdown)
  const answered = items.filter((item) => item.answer).length
  return (
    <>
      <div className="prose-study"><h2>{section.title}</h2></div>
      <p className="mb-3 mt-0 text-sm text-ink-soft">Responda de memória antes de abrir{answered ? ` — ${answered} de ${items.length} cartões têm resposta comentada.` : '.'}</p>
      <ol className="m-0 grid gap-2 p-0">
        {items.map((item, index) => <RecallCard key={item.question} index={index} {...item} />)}
      </ol>
    </>
  )
}

function Slot({ id, skipMermaid }: { id: string; skipMermaid?: boolean }) {
  const entries = diagramsFor(id).filter((entry) => !(skipMermaid && entry.replacesMermaid))
  return <>{entries.map(({ component: Diagram }, i) => <Diagram key={i} />)}</>
}

function Section({ section }: { section: AifSection }) {
  if (isRecallSection(section.title)) return <section id={section.id} className="mt-2 scroll-mt-24"><Recall section={section} /><Slot id={section.id} /></section>
  const Replacement = diagramsFor(section.id).find((entry) => entry.replacesMermaid)?.component
  const hasMermaid = section.markdown.includes('```mermaid')
  // O diagrama próprio fica fora do .prose-study, entre o texto antes e depois do Mermaid.
  const [before, ...rest] = Replacement ? section.markdown.split(/```mermaid\n[\s\S]*?```/) : [section.markdown]
  const content = Replacement && rest.length
    ? <><Markdown text={before!} /><Replacement /><Markdown text={rest.join('')} /></>
    : <Markdown text={section.markdown} />
  const answerKey = /^Parte B — gabarito/.test(section.title)
  return (
    <section id={section.id} className="mt-2 scroll-mt-24">
      {answerKey ? (
        <>
          <div className="prose-study"><h2>{section.title}</h2></div>
          <details className="diagram-limits text-base"><summary>Abrir o gabarito comentado (tente responder a Parte A antes)</summary><Markdown text={section.markdown.replace(/^## .+$/m, '')} /></details>
        </>
      ) : content}
      <Slot id={section.id} skipMermaid={hasMermaid} />
    </section>
  )
}

export function AifChapterBody({ markdown, number }: { markdown: string; number: number }) {
  const parts = splitChapter(markdown, number)
  return (
    <div>
      <div className="prose-study"><h1>{number}. {parts.title}</h1></div>
      {parts.tag && (
        <p className="chapter-tag">
          <strong>{parts.tag.kind}</strong>
          {parts.tag.detail && <span> · {parts.tag.detail}</span>}
        </p>
      )}
      {parts.names && (
        <details className="diagram-limits">
          <summary>Siglas e nomes completos desta página</summary>
          <p><Inline text={parts.names} /></p>
        </details>
      )}
      <Slot id={openingId(number)} />
      {parts.intro && <Markdown text={parts.intro} />}
      {number === 27
        ? <AifWorksheet />
        : parts.sections.map((section) => <Section key={section.id} section={section} />)}
    </div>
  )
}
