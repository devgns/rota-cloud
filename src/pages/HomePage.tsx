import { Link } from 'react-router-dom'
import { MODULE_BLURB } from '@/content/studyLayer'
import { getCorpus } from '@/lib/corpus'
import { countDue } from '@/lib/progress'
import { recommendNext } from '@/lib/recommend'
import { DOMAIN_META, type Domain } from '@/lib/types'
import { domainStats } from '@/lib/quiz'
import { useProgress } from '@/state/ProgressContext'
import { buttonClass, Panel } from '@/components/ui'
import { useCoursePath } from '@/courses/CourseContext'

export function HomePage() {
  const p = useCoursePath()
  const corpus = getCorpus()
  const { progress } = useProgress()
  const next = recommendNext(corpus, progress)
  const completed = progress.completedChapterIds.length
  const started = progress.questionAttempts.length > 0
  const stats = domainStats(corpus.questions, progress.questionAttempts)
  const due = countDue(progress.flashcardReviews, corpus.flashcards.map((card) => card.id), new Date())
  const answeredUnique = Object.values(stats).reduce((sum, item) => sum + item.answered, 0)
  const correctUnique = Object.values(stats).reduce((sum, item) => sum + item.correct, 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-amber)]">Percurso CLF-C02</p>
      <h1 className="mt-2 max-w-3xl font-serif text-4xl leading-tight">Estudar a nuvem com a apostila inteira, não com um resumo no lugar dela.</h1>
      <p className="mt-4 max-w-2xl text-[var(--color-ink-soft)]">
        Vinte e seis capítulos, oitenta questões comentadas e cento e trinta e dois flashcards. A leitura fica neste navegador, com o ponto em que você parou.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className={buttonClass()} to={p(next.href)}>{progress.lastLocation ? 'Continuar de onde parei' : 'Começar pelo capítulo 1'}</Link>
        <Link className={buttonClass('ghost')} to={p('/trilhas')}>Ver trilhas</Link>
      </div>
      <Panel className="mt-8">
        <h2 className="text-lg font-semibold">O que estudar agora</h2>
        <p className="mt-1 text-[var(--color-ink-soft)]">{next.reason}</p>
        <Link className="mt-3 inline-block font-semibold text-[var(--color-navy)]" to={p(next.href)}>{next.title}</Link>
      </Panel>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Panel>
          <h2 className="text-sm uppercase tracking-wide text-[var(--color-ink-soft)]">Capítulos concluídos</h2>
          <p className="mt-2 font-serif text-3xl">{completed}<span className="text-lg text-[var(--color-ink-soft)]"> / 26</span></p>
          <p className="mt-2 text-sm">Conclusão é uma marca sua. Rolar a página até o fim não conta como domínio.</p>
        </Panel>
        <Panel>
          <h2 className="text-sm uppercase tracking-wide text-[var(--color-ink-soft)]">Questões</h2>
          {started ? (
            <p className="mt-2 font-serif text-3xl">{correctUnique}<span className="text-lg text-[var(--color-ink-soft)]"> / {answeredUnique} últimas certas</span></p>
          ) : (
            <p className="mt-2">Você ainda não respondeu questões. O simulado não estima nota oficial da AWS.</p>
          )}
        </Panel>
        <Panel>
          <h2 className="text-sm uppercase tracking-wide text-[var(--color-ink-soft)]">Flashcards para ver</h2>
          <p className="mt-2 font-serif text-3xl">{due}</p>
          <p className="mt-2 text-sm">Inclui cartões novos e revisões cuja data já chegou. Intervalos: 1, 3 e 7 dias.</p>
        </Panel>
      </div>
      {started && (
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {([1, 2, 3, 4] as Domain[]).map((domain) => (
            <Panel key={domain}>
              <h3 className="text-sm font-semibold">{DOMAIN_META[domain].title}</h3>
              <p className="text-sm text-[var(--color-ink-soft)]">Peso {DOMAIN_META[domain].weight}</p>
              <p className="mt-2">{stats[domain].correct}/{stats[domain].answered} na última tentativa de cada questão</p>
            </Panel>
          ))}
        </div>
      )}
      <h2 className="mt-10 text-2xl font-semibold">Módulos</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {corpus.modules.map((module) => {
          const done = module.chapter_ids.filter((id) => progress.completedChapterIds.includes(id)).length
          return (
            <Link key={module.id} to={p(`/trilhas#${module.id}`)} className="block">
              <Panel>
                <h3 className="font-semibold">{module.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{MODULE_BLURB[module.id]}</p>
                <p className="mt-3 text-sm">{done} de {module.chapter_ids.length} capítulos concluídos</p>
              </Panel>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
