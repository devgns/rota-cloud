import { Bookmark, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DiagramSlot } from '@/components/diagrams/registry'
import { MarkdownView } from '@/components/MarkdownView'
import { ServiceNamesGuide } from '@/components/ServiceNamesGuide'
import { Button, buttonClass, Panel } from '@/components/ui'
import { ChapterWorksheet } from '@/pages/ChapterWorksheet'
import { extrasForChapter, noteForSection, objectivesFor, type ExtraQuestion } from '@/content/studyLayer'
import { chapterAbbr, namesNoteOf, withoutNamesNote } from '@/lib/abbreviations'
import { getCorpus } from '@/lib/corpus'
import { sectionHasStudyContent } from '@/lib/segment'
import type { StudyChapter, StudySection } from '@/lib/types'
import { useProgress } from '@/state/ProgressContext'
import { useCoursePath } from '@/courses/CourseContext'

function useChapter(): { chapter?: StudyChapter; preamble: boolean } {
  const { chapterId } = useParams()
  const corpus = getCorpus()
  if (chapterId === 'capa') return { preamble: true }
  return { chapter: corpus.chapters.find((item) => item.id === chapterId), preamble: false }
}

export function ReaderPage() {
  const p = useCoursePath()
  const params = useParams()
  const corpus = getCorpus()
  const { chapter, preamble } = useChapter()
  const { progress, update } = useProgress()
  const [tocOpen, setTocOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [active, setActive] = useState<string | undefined>(params.sectionId)
  const [readRatio, setReadRatio] = useState(0)
  const target = preamble ? corpus.preamble : chapter
  const savedLocation = useRef(progress.lastLocation)
  const restoredScroll = useRef(false)
  const lastPersist = useRef(0)

  useEffect(() => {
    if (!target) return
    const section = params.sectionId
    const frame = window.requestAnimationFrame(() => {
      if (section) {
        document.getElementById(section)?.scrollIntoView()
        restoredScroll.current = true
        return
      }
      const saved = savedLocation.current
      const sameChapter = saved?.chapterId === (chapter?.id ?? 'front-matter')
      if (!restoredScroll.current && sameChapter && saved?.scrollY) {
        window.scrollTo({ top: saved.scrollY, left: 0, behavior: 'instant' })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
      restoredScroll.current = true
    })
    return () => window.cancelAnimationFrame(frame)
  }, [chapter?.id, params.sectionId, target])

  useEffect(() => {
    if (!chapter && !preamble) return
    const chapterId = chapter?.id ?? 'front-matter'
    let frame = 0
    const onScroll = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const article = document.getElementById('artigo')
        if (!article) return
        const total = Math.max(article.offsetHeight - window.innerHeight, 1)
        const passed = Math.min(1, Math.max(0, -article.getBoundingClientRect().top / total))
        setReadRatio(passed)
        const nodes = [...article.querySelectorAll('section[id]')]
        const current = nodes.find((node) => {
          const top = node.getBoundingClientRect().top
          return top >= 0 && top < 180
        }) ?? [...nodes].reverse().find((node) => node.getBoundingClientRect().top < 120)
        const sectionId = current?.id
        if (sectionId) setActive(sectionId)
        const now = Date.now()
        if (now - lastPersist.current < 800) return
        lastPersist.current = now
        update((currentProgress) => ({
          ...currentProgress,
          readingPercents: { ...currentProgress.readingPercents, [chapterId]: Math.round(passed * 100) },
          lastLocation: { chapterId, sectionId, scrollY: window.scrollY },
        }))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [chapter, preamble, update])

  const sections: StudySection[] = chapter ? [chapter.opening, ...chapter.sections] : corpus.preamble ? [corpus.preamble] : []
  const abbr = useMemo(() => {
    if (!chapter) return undefined
    const readable = [chapter.opening, ...chapter.sections].filter((section) => !(chapter.id === 'chapter-23' && isExamQuestionBlock(section.id)))
    return chapterAbbr(namesNoteOf(chapter.opening.markdown), readable)
  }, [chapter])
  const abbrFor = (sectionId: string) => abbr && { entries: abbr.entries, expand: abbr.expandIn.get(sectionId) ?? new Set<string>() }
  const tocSections = sections.filter((section) => !isExamAnswerKey(section.id))
  const index = chapter ? corpus.chapters.findIndex((item) => item.id === chapter.id) : -1
  const previous = index > 0 ? corpus.chapters[index - 1] : undefined
  const next = index >= 0 ? corpus.chapters[index + 1] : corpus.chapters[0]

  if (!target) {
    return <div className="mx-auto max-w-3xl px-4 py-10"><h1>Capítulo não encontrado.</h1><Link to={p('/trilhas')}>Voltar às trilhas</Link></div>
  }

  const module = corpus.modules.find((item) => item.id === chapter?.moduleId)
  const objectives = chapter ? objectivesFor(chapter.id) : []
  const extras = chapter ? extrasForChapter(chapter.id) : []

  return (
    <div>
      <div className="reading-progress" style={{ width: `${readRatio * 100}%` }} aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[16rem_minmax(0,46rem)_14rem]">
        <aside className="hidden lg:block">
          <ChapterNav />
        </aside>
        <article id="artigo" className="min-w-0">
          <p className="text-sm text-[var(--color-ink-soft)]">
            {preamble ? 'Capa' : `${module?.title} · capítulo ${chapter?.originalNumber}`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 lg:hidden">
            <Button variant="ghost" onClick={() => setNavOpen(true)}>Capítulos</Button>
            <Button variant="ghost" onClick={() => setTocOpen((value) => !value)}>Seções</Button>
            <FontControls />
          </div>
          {tocOpen && (
            <Toc chapterId={chapter?.id ?? 'capa'} sections={tocSections} active={active} onPick={() => setTocOpen(false)} />
          )}
          {sections.map((section) => {
            if (chapter?.id === 'chapter-23' && isExamQuestionBlock(section.id)) {
              if (section.id !== 'c23-parte-a-questoes') return null
              return <ChapterWorksheet key="worksheet" />
            }
            if (chapter && section === chapter.opening) {
              const opening = splitOpening(withoutNamesNote(section.markdown))
              return (
                <section key={section.id} id={section.id} className="mt-2 scroll-mt-24">
                  <MarkdownView source={opening.title} anchorId={section.id} />
                  {opening.tag && (
                    <p className="chapter-tag">
                      <strong>{opening.tag.kind}</strong>
                      {opening.tag.detail && <span> · {opening.tag.detail}</span>}
                    </p>
                  )}
                  {objectives.length > 0 && (
                    <div className="chapter-goals">
                      <p className="chapter-goals-label">Ao fim do capítulo, você deve conseguir</p>
                      <ul>
                        {objectives.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {chapter.id === 'chapter-23' && abbr && <ServiceNamesGuide names={abbr.entries} />}
                  {chapter.id === 'chapter-23' && (
                    <p className="mt-4 text-sm">As 80 questões estão logo abaixo, para marcar e corrigir nesta página. O simulado cronometrado de até 65 questões continua em <Link className="font-semibold text-[var(--color-navy)]" to={p('/praticar')}>Praticar</Link>.</p>
                  )}
                  {chapter.id === 'chapter-24' && (
                    <p className="mt-4 text-sm"><Link className="font-semibold text-[var(--color-navy)]" to={p('/flashcards')}>Abrir os 132 flashcards com repetição.</Link> As tabelas originais continuam neste capítulo.</p>
                  )}
                  {opening.body.trim() && <MarkdownView source={opening.body} abbr={abbrFor(section.id)} />}
                  <Note sectionId={section.id} />
                  <DiagramSlot sectionId={section.id} />
                  {sectionHasStudyContent(section.markdown) && <SectionTools chapter={chapter} section={section} />}
                </section>
              )
            }
            return (
              <section key={section.id} id={section.id} className="mt-2 scroll-mt-24">
                <MarkdownView source={section.markdown} anchorId={section.id} abbr={abbrFor(section.id)} />
                <Note sectionId={section.id} />
                <DiagramSlot sectionId={section.id} />
                {chapter && sectionHasStudyContent(section.markdown) && <SectionTools chapter={chapter} section={section} />}
              </section>
            )
          })}
          {extras.length > 0 && <Recall questions={extras} />}
          <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-[var(--color-line)] pt-6">
            {previous ? <Link className={buttonClass('ghost')} to={p(`/ler/${previous.id}`)}><ChevronLeft className="h-4 w-4" /> {previous.originalNumber}. {previous.title}</Link> : <span />}
            {next && <Link className={buttonClass('ghost')} to={p(`/ler/${next.id}`)}>{next.originalNumber}. {next.title} <ChevronRight className="h-4 w-4" /></Link>}
          </div>
        </article>
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <FontControls />
            <Toc chapterId={chapter?.id ?? 'capa'} sections={tocSections} active={active} />
          </div>
        </aside>
      </div>
      {navOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setNavOpen(false)}>
          <div className="h-full w-80 overflow-auto bg-[var(--color-paper)] p-4" onClick={(event) => event.stopPropagation()}>
            <Button variant="ghost" onClick={() => setNavOpen(false)}>Fechar</Button>
            <ChapterNav />
          </div>
        </div>
      )}
    </div>
  )
}

function isExamQuestionBlock(id: string): boolean {
  return id === 'c23-parte-a-questoes' || isExamAnswerKey(id) || /^c23-q\d{2}-/.test(id)
}

/** Separa o título do capítulo e a etiqueta "[ESSENCIAL — …]" do restante da abertura. */
function splitOpening(markdown: string): { title: string; tag?: { kind: string; detail?: string }; body: string } {
  const lines = markdown.split('\n')
  const titleAt = lines.findIndex((line) => line.startsWith('# '))
  if (titleAt < 0) return { title: '', body: markdown }
  let rest = lines.slice(titleAt + 1)
  const tagAt = rest.findIndex((line) => line.trim() !== '')
  const tag = tagAt >= 0 ? /^\*\*\[(.+)\]\*\*$/.exec(rest[tagAt]!.trim())?.[1] : undefined
  if (tag) rest = rest.slice(tagAt + 1)
  const [kind, detail] = tag ? tag.split(/\s+—\s+/, 2) : []
  return { title: lines.slice(0, titleAt + 1).join('\n'), tag: kind ? { kind, detail } : undefined, body: rest.join('\n') }
}

function isExamAnswerKey(id: string): boolean {
  return id === 'c23-parte-b-gabarito-rapido' || id === 'c23-parte-c-gabarito-comentado'
}

function FontControls() {
  const { progress, update } = useProgress()
  const setScale = (fontScale: number) => update((current) => ({ ...current, settings: { ...current.settings, fontScale } }))
  return (
    <div className="mb-3 flex gap-2" aria-label="Tamanho da fonte">
      {[0.92, 1, 1.12].map((scale) => (
        <button key={scale} className="choice" aria-pressed={progress.settings.fontScale === scale} onClick={() => setScale(scale)}>
          {scale === 0.92 ? 'A−' : scale === 1 ? 'A' : 'A+'}
        </button>
      ))}
    </div>
  )
}

function ChapterNav() {
  const p = useCoursePath()
  const corpus = getCorpus()
  const { progress, update } = useProgress()
  const toggleChapter = (id: string) => {
    update((current) => ({
      ...current,
      completedChapterIds: current.completedChapterIds.includes(id)
        ? current.completedChapterIds.filter((chapterId) => chapterId !== id)
        : [...current.completedChapterIds, id],
    }))
  }
  return (
    <nav aria-label="Capítulos" className="text-sm">
      {corpus.modules.map((module) => (
        <div key={module.id} className="mb-4">
          <h2 className="module-label">{module.title}</h2>
          <ul className="mt-1 space-y-1">
            {module.chapter_ids.map((id) => {
              const item = corpus.chapters.find((chapter) => chapter.id === id)
              if (!item) return null
              const done = progress.completedChapterIds.includes(id)
              return (
                <li key={id} className="flex items-start gap-2 rounded px-1 py-1 hover:bg-[var(--color-amber-soft)]">
                  <input
                    type="checkbox"
                    className="chapter-check"
                    checked={done}
                    aria-label={`${done ? 'Desmarcar' : 'Marcar'} capítulo ${item.originalNumber} como concluído`}
                    onChange={() => toggleChapter(id)}
                  />
                  <Link to={p(`/ler/${id}`)} className="min-w-0 flex-1 leading-snug">
                    {item.originalNumber}. {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
      <Link to={p('/ler/capa')} className="mt-2 inline-block text-[var(--color-ink-soft)]">Capa e índice</Link>
    </nav>
  )
}

function Toc({ chapterId, sections, active, onPick }: { chapterId: string; sections: StudySection[]; active?: string; onPick?: () => void }) {
  const p = useCoursePath()
  return (
    <nav aria-label="Seções deste capítulo" className="max-h-[70vh] overflow-auto text-sm">
      <h2 className="module-label mb-2">Neste capítulo</h2>
      <ul className="space-y-1">
        {sections.map((section) => (
          <li key={section.id}>
            <Link
              to={p(`/ler/${chapterId}/${section.id}`)}
              onClick={() => {
                onPick?.()
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`block rounded px-1 py-1 hover:bg-[var(--color-amber-soft)] ${active === section.id ? 'bg-[var(--color-amber-soft)] font-semibold' : ''}`}
              aria-current={active === section.id ? 'location' : undefined}
            >
              {section.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Note({ sectionId }: { sectionId: string }) {
  const note = noteForSection(sectionId)
  if (!note) return null
  const label = note.kind === 'atualizacao' ? 'Nota de atualização' : note.kind === 'comparativo' ? 'Comparativo' : 'Complemento'
  return (
    <aside className="diagram-shell" aria-label={label}>
      <p className="diagram-kicker">{label} · fora do texto original</p>
      <h3 className="mt-1 font-semibold">{note.title}</h3>
      {note.paragraphs.map((paragraph) => <p key={paragraph} className="diagram-note">{paragraph}</p>)}
      {note.comparison && (
        <div className="table-scroll mt-3">
          <table>
            <thead>
              <tr>{note.comparison.headers.map((header) => <th key={header || 'criterio'}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {note.comparison.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => <td key={cell}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {note.cues && (
        <>
          <h4 className="mt-4 text-sm font-semibold">Na prova, a pista costuma ser esta</h4>
          <ul className="mt-1 list-disc pl-5 text-sm text-[var(--color-ink-soft)]">
            {note.cues.map((cue) => <li key={cue}>{cue}</li>)}
          </ul>
        </>
      )}
      {note.href && <a className="mt-3 inline-block text-sm font-semibold text-[var(--color-navy)]" href={note.href} target="_blank" rel="noreferrer noopener">{note.hrefLabel}</a>}
    </aside>
  )
}

function chapterSectionIds(chapter: StudyChapter): string[] {
  return [chapter.opening, ...chapter.sections]
    .filter((item) => sectionHasStudyContent(item.markdown))
    .map((item) => item.id)
}

function SectionTools({ chapter, section }: { chapter: StudyChapter; section: StudySection }) {
  const { progress, update } = useProgress()
  const done = progress.completedSectionIds.includes(section.id)
  const marked = progress.bookmarks.includes(section.id)
  const chapterDone = progress.completedChapterIds.includes(chapter.id)
  const toggle = (key: 'completedSectionIds' | 'bookmarks', id: string) => {
    update((current) => {
      const list = current[key]
      const next = list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
      if (key !== 'completedSectionIds') return { ...current, [key]: next }
      const allStudied = chapterSectionIds(chapter).every((sectionId) => next.includes(sectionId))
      const completedChapterIds = allStudied
        ? current.completedChapterIds.includes(chapter.id)
          ? current.completedChapterIds
          : [...current.completedChapterIds, chapter.id]
        : current.completedChapterIds.filter((chapterId) => chapterId !== chapter.id)
      return { ...current, completedSectionIds: next, completedChapterIds }
    })
  }
  const finishChapter = () => {
    update((current) => ({
      ...current,
      completedChapterIds: current.completedChapterIds.includes(chapter.id)
        ? current.completedChapterIds.filter((id) => id !== chapter.id)
        : [...current.completedChapterIds, chapter.id],
    }))
  }
  const lastSectionId = chapterSectionIds(chapter).at(-1)
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <Button variant="ghost" aria-pressed={done} onClick={() => toggle('completedSectionIds', section.id)}>
        <Check className="h-4 w-4" /> {done ? 'Seção estudada' : 'Marcar seção como estudada'}
      </Button>
      <Button variant="ghost" aria-pressed={marked} onClick={() => toggle('bookmarks', section.id)}>
        <Bookmark className="h-4 w-4" /> {marked ? 'Favorito' : 'Favoritar seção'}
      </Button>
      {section.id === lastSectionId && (
        <Button variant="ghost" aria-pressed={chapterDone} onClick={finishChapter}>
          {chapterDone ? 'Capítulo concluído' : 'Marcar capítulo como concluído'}
        </Button>
      )}
    </div>
  )
}

function Recall({ questions }: { questions: ExtraQuestion[] }) {
  return (
    <Panel className="mt-8">
      <h2 className="text-lg font-semibold">Verifique se entendeu</h2>
      <p className="text-sm text-[var(--color-ink-soft)]">Perguntas EXTRA, fora das 80. Elas não entram no simulado nem na taxa das questões da apostila.</p>
      <div className="mt-4 space-y-6">
        {questions.map((question) => <ExtraItem key={question.id} question={question} />)}
      </div>
    </Panel>
  )
}

function ExtraItem({ question }: { question: ExtraQuestion }) {
  const [picked, setPicked] = useState<number | null>(null)
  return (
    <fieldset>
      <legend className="font-semibold">{question.id}. {question.prompt}</legend>
      <div className="mt-2 space-y-2">
        {question.choices.map((choice, index) => (
          <label key={choice} className="flex gap-2 text-sm">
            <input type="radio" name={question.id} checked={picked === index} onChange={() => setPicked(index)} />
            {choice}
          </label>
        ))}
      </div>
      {picked != null && (
        <p className="mt-2 text-sm" role="status">
          {picked === question.correctIndex ? 'É essa distinção.' : 'Ainda não.'} {question.explanation}
        </p>
      )}
    </fieldset>
  )
}
