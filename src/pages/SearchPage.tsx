import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCorpus } from '@/lib/corpus'
import { glossaryIndex, searchAll } from '@/lib/find'
import { useCoursePath } from '@/courses/CourseContext'

export function SearchPage() {
  const p = useCoursePath()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const corpus = getCorpus()
  const hits = useMemo(() => searchAll(corpus, glossaryIndex(corpus), query), [corpus, query])
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-4xl">Busca</h1>
      <label className="mt-4 block text-sm font-semibold" htmlFor="q">Termo</label>
      <input
        id="q"
        value={query}
        onChange={(event) => setParams(event.target.value ? { q: event.target.value } : {})}
        className="mt-2 w-full rounded-xl border border-[var(--color-line)] bg-transparent px-3 py-2"
        placeholder="CloudTrail, CloudWatch, Lambda"
      />
      <ul className="mt-4 space-y-3">
        {hits.map((hit) => (
          <li key={`${hit.kind}-${hit.id}`}>
            <Link to={p(hit.href)}>
              <span className="text-xs uppercase text-[var(--color-amber)]">{hit.kind}</span>
              <span className="block font-semibold">{hit.title}</span>
              <span className="block text-sm text-[var(--color-ink-soft)]">{hit.excerpt}</span>
            </Link>
          </li>
        ))}
      </ul>
      {query.trim().length >= 2 && hits.length === 0 && <p>Nenhum resultado.</p>}
    </div>
  )
}
