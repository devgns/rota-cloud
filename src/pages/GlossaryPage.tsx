import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Panel } from '@/components/ui'
import { COMPARISONS, glossaryFromCorpus } from '@/lib/glossary'
import { getCorpus } from '@/lib/corpus'
import { normalizeSearch } from '@/lib/search'
import { useCoursePath } from '@/courses/CourseContext'

export function GlossaryPage() {
  const p = useCoursePath()
  const corpus = getCorpus()
  const entries = useMemo(() => glossaryFromCorpus(corpus), [corpus])
  const { entryId } = useParams()
  const [query, setQuery] = useState('')
  const selected = entries.find((entry) => entry.id === entryId)
  const filtered = entries.filter((entry) => {
    const blob = normalizeSearch(`${entry.name} ${entry.purpose} ${entry.category} ${entry.doNotConfuse ?? ''}`)
    return blob.includes(normalizeSearch(query).trim())
  })

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside>
        <label className="text-sm font-semibold" htmlFor="filtro-glossario">Filtrar serviços</label>
        <input id="filtro-glossario" value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--color-line)] bg-transparent px-3 py-2" placeholder="CloudTrail, CloudWatch, Lambda" />
        <ul className="mt-3 max-h-[70vh] space-y-1 overflow-auto text-sm">
          {filtered.map((entry) => (
            <li key={entry.id}><Link to={p(`/glossario/${entry.id}`)}>{entry.name}</Link></li>
          ))}
        </ul>
      </aside>
      <div>
        <h1 className="font-serif text-4xl">Glossário</h1>
        <p className="mt-2 text-[var(--color-ink-soft)]">As finalidades saem do catálogo do capítulo 18. Onde há comparação, ela está marcada como orientação de estudo, não como regra universal.</p>
        {!selected && (
          <div className="mt-6 space-y-3">
            {COMPARISONS.map((item) => (
              <Panel key={item.title}>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm">{item.text}</p>
              </Panel>
            ))}
          </div>
        )}
        {selected && (
          <Panel className="mt-6">
            <p className="text-sm text-[var(--color-ink-soft)]">{selected.category}</p>
            <h2 className="mt-1 text-2xl font-semibold">{selected.name}</h2>
            <p className="mt-3">{selected.purpose}</p>
            {selected.whenToChoose && <p className="mt-3"><strong>Quando escolher: </strong>{selected.whenToChoose}</p>}
            {selected.doNotConfuse && <p className="mt-2"><strong>Não confundir com: </strong>{selected.doNotConfuse}</p>}
            {selected.scopeNote && <p className="mt-2 text-sm">{selected.scopeNote}</p>}
            <p className="mt-4 text-sm">
              <Link className="font-semibold text-[var(--color-navy)]" to={p(`/ler/${selected.chapterId}`)}>Abrir capítulo relacionado</Link>
              {selected.docUrl && <> · <a className="font-semibold text-[var(--color-navy)]" href={selected.docUrl} target="_blank" rel="noreferrer noopener">Documentação AWS</a></>}
            </p>
          </Panel>
        )}
      </div>
    </div>
  )
}
