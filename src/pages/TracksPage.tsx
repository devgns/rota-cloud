import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MODULE_BLURB, domainLabel } from '@/content/studyLayer'
import { getCorpus } from '@/lib/corpus'
import { useProgress } from '@/state/ProgressContext'
import { Panel } from '@/components/ui'
import { ServiceNamesGuide } from '@/components/ServiceNamesGuide'
import { useCoursePath } from '@/courses/CourseContext'

type Filter = 'todos' | 'nao' | 'andamento' | 'concluidos'

export function TracksPage() {
  const p = useCoursePath()
  const corpus = getCorpus()
  const { progress } = useProgress()
  const [filter, setFilter] = useState<Filter>('todos')
  const chapters = useMemo(() => corpus.chapters.filter((chapter) => {
    const done = progress.completedChapterIds.includes(chapter.id)
    const reading = progress.readingPercents[chapter.id] || progress.lastLocation?.chapterId === chapter.id
    const partial = chapter.sections.some((section) => progress.completedSectionIds.includes(section.id))
    if (filter === 'concluidos') return done
    if (filter === 'nao') return !done && !reading && !partial
    if (filter === 'andamento') return !done && (reading || partial)
    return true
  }), [corpus.chapters, filter, progress])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-serif text-4xl">Trilhas</h1>
      <p className="mt-2 max-w-2xl text-[var(--color-ink-soft)]">A ordem é a da apostila. Filtrar não muda o identificador do capítulo nem o progresso já salvo.</p>
      <ServiceNamesGuide scope="index" />
      <div className="choice-row" role="group" aria-label="Filtrar capítulos">
        {([
          ['todos', 'Todos'],
          ['nao', 'Não iniciados'],
          ['andamento', 'Em andamento'],
          ['concluidos', 'Concluídos'],
        ] as const).map(([id, label]) => (
          <button key={id} className="choice" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
        ))}
      </div>
      {corpus.modules.map((module) => {
        const items = chapters.filter((chapter) => chapter.moduleId === module.id)
        if (items.length === 0) return null
        return (
          <section key={module.id} id={module.id} className="mt-8">
            <h2 className="text-2xl font-semibold">{module.title}</h2>
            <p className="text-sm text-[var(--color-ink-soft)]">{MODULE_BLURB[module.id]}</p>
            <div className="mt-3 grid gap-3">
              {items.map((chapter) => {
                const done = progress.completedChapterIds.includes(chapter.id)
                const sectionsDone = chapter.sections.filter((section) => progress.completedSectionIds.includes(section.id)).length
                return (
                  <Panel key={chapter.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">
                          <Link to={p(`/ler/${chapter.id}`)}>{chapter.originalNumber}. {chapter.title}</Link>
                        </h3>
                        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                          {done ? 'Concluído' : sectionsDone > 0 ? 'Em andamento' : 'Não iniciado'}
                          {' · '}{sectionsDone}/{chapter.sections.length} seções marcadas
                          {' · '}{chapter.domains.map(domainLabel).join(', ')}
                        </p>
                      </div>
                      <Link className="text-sm font-semibold text-[var(--color-navy)]" to={p(`/ler/${chapter.id}`)}>Abrir</Link>
                    </div>
                  </Panel>
                )
              })}
            </div>
          </section>
        )
      })}
      <p className="mt-8 text-sm"><Link to={p('/ler/capa')}>Ler a capa e o índice original</Link></p>
    </div>
  )
}
