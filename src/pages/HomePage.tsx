import { Link } from 'react-router-dom'
import { MODULE_BLURB } from '@/content/studyLayer'
import { getCorpus } from '@/lib/corpus'
import { countDue } from '@/lib/progress'
import { recommendNext } from '@/lib/recommend'
import { DOMAIN_META, type Domain } from '@/lib/types'
import { domainStats } from '@/lib/quiz'
import { useProgress } from '@/state/ProgressContext'
import { useCoursePath } from '@/courses/CourseContext'
import { ExamBlueprint, type BlueprintDomain } from '@/components/course/ExamBlueprint'
import { RouteMap } from '@/components/course/RouteMap'
import { Meter } from '@/components/diagrams/controls'

const blueprint: readonly BlueprintDomain[] = [
  { n: 1, name: 'Conceitos de nuvem', weight: 24, question: 'Por que a nuvem, como desenhar bem e como migrar?', chapters: [2, 3, 4, 5] },
  { n: 2, name: 'Segurança e conformidade', weight: 30, question: 'Quem protege o quê, quem acessa o quê e como provar?', chapters: [6, 7, 8, 9] },
  { n: 3, name: 'Tecnologia e serviços', weight: 34, question: 'Qual serviço AWS resolve esta necessidade?', chapters: [3, 10, 11, 12, 13, 14, 15, 16, 17, 18] },
  { n: 4, name: 'Faturamento, preços e suporte', weight: 12, question: 'Como se paga, como economizar e onde pedir ajuda?', chapters: [5, 19, 20] },
]

const card = 'rounded-2xl border border-[var(--color-line)] p-5'

export function HomePage() {
  const p = useCoursePath()
  const corpus = getCorpus()
  const { progress } = useProgress()
  const next = recommendNext(corpus, progress)
  const completed = progress.completedChapterIds.length
  const total = corpus.chapters.length
  const started = progress.questionAttempts.length > 0
  const stats = domainStats(corpus.questions, progress.questionAttempts)
  const due = countDue(progress.flashcardReviews, corpus.flashcards.map((item) => item.id), new Date())
  const answeredUnique = Object.values(stats).reduce((sum, item) => sum + item.answered, 0)
  const correctUnique = Object.values(stats).reduce((sum, item) => sum + item.correct, 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-amber)]">AWS Certified Cloud Practitioner · CLF-C02</p>
      <h1 className="mt-2 max-w-4xl font-serif text-4xl leading-tight">Estudar a nuvem com a apostila inteira, não com um resumo no lugar dela.</h1>
      <p className="mt-4 max-w-3xl text-[var(--color-ink-soft)]">
        Vinte e seis capítulos, oitenta questões comentadas e cento e trinta e dois flashcards. A leitura fica neste navegador, com o ponto em que você parou.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="btn-primary rounded-lg bg-[var(--color-navy)] px-5 py-2.5 font-semibold text-white" to={p(next.href)}>{progress.lastLocation ? 'Continuar de onde parei' : 'Começar pelo capítulo 1'}</Link>
        <Link className="choice" to={p('/trilhas')}>Explorar trilha</Link>
        <Link className="choice" to={p('/praticar')}>Praticar questões</Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className={card}>
          <p className="text-sm text-[var(--color-ink-soft)]">Capítulos estudados</p>
          <p className="mt-1 font-serif text-3xl">{completed} / {total}</p>
          <div className="mt-3 h-2 rounded-full bg-[var(--color-line)]"><div className="h-full rounded-full bg-[var(--color-amber)]" style={{ width: `${(completed / total) * 100}%` }} /></div>
        </div>
        <div className={card}>
          <p className="text-sm text-[var(--color-ink-soft)]">Questões</p>
          <p className="mt-1 font-serif text-3xl">{started ? `${correctUnique} / ${answeredUnique}` : '80 questões'}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">{started ? 'certas na última tentativa de cada uma' : 'Você ainda não respondeu questões; o simulado não estima nota oficial'}</p>
        </div>
        <div className={card}>
          <p className="text-sm text-[var(--color-ink-soft)]">Flashcards para rever</p>
          <p className="mt-1 font-serif text-3xl">{due}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">132 cartões, revisão espaçada</p>
        </div>
      </div>

      <h2 className="mb-2 mt-10 font-serif text-2xl">Sua trilha</h2>
      <p className="m-0 text-sm text-[var(--color-ink-soft)]">Cada estação é um módulo; o anel âmbar enche conforme você conclui capítulos. Clique numa estação para abrir.</p>
      <div className="max-w-4xl"><RouteMap courseId="clf-c02" modules={corpus.modules} completed={progress.completedChapterIds} /></div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,46rem)_minmax(0,1fr)] lg:items-start">
        <ExamBlueprint courseId="clf-c02" code="CLF-C02" domains={blueprint} initial={3} />
        <div className="grid gap-4 lg:my-6">
        <div className={`${card} border-[var(--color-amber)]`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-amber)]">O que estudar agora</p>
          <p className="mt-1 text-[var(--color-ink-soft)]">{next.reason}</p>
          <Link className="choice mt-3 inline-block" to={p(next.href)}>{next.title} →</Link>
        </div>
        {started && (
          <div className="diagram-shell my-0">
            <p className="diagram-kicker">Seus acertos por domínio</p>
            <p className="diagram-title">Última tentativa de cada questão</p>
            <div className="mt-3 grid gap-2">
              {([1, 2, 3, 4] as Domain[]).map((domain) => {
                const item = stats[domain]
                const share = item.answered ? item.correct / item.answered : 0
                return <Meter key={domain} label={`${DOMAIN_META[domain].title} · ${DOMAIN_META[domain].weight}`} value={share} display={item.answered ? `${item.correct}/${item.answered}` : 'sem respostas'} tone={!item.answered ? 'dim' : share >= 0.8 ? 'ok' : share >= 0.6 ? 'warn' : 'bad'} />
              })}
            </div>
          </div>
        )}
        </div>
      </div>

      <h2 className="mb-4 mt-10 font-serif text-2xl">A rota do conhecimento</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {corpus.modules.map((module, index) => {
          const done = module.chapter_ids.filter((id) => progress.completedChapterIds.includes(id)).length
          return (
            <Link key={module.id} to={p(`/ler/${module.chapter_ids[0]}`)} className={`${card} block transition hover:border-[var(--color-amber)]`}>
              <p className="text-xs uppercase tracking-wide text-[var(--color-amber)]">Etapa {index + 1}</p>
              <h3 className="mt-2 font-semibold">{module.title}</h3>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{MODULE_BLURB[module.id]}</p>
              <div className="mt-3">
                <Meter label={<span className="font-normal text-[var(--color-ink-soft)]">{done} de {module.chapter_ids.length} capítulos concluídos</span>} value={done / module.chapter_ids.length} tone={done === module.chapter_ids.length ? 'ok' : 'warn'} />
              </div>
            </Link>
          )
        })}
      </div>
      <p className="mt-6 text-sm text-[var(--color-ink-soft)]">Material independente de preparação, não afiliado à AWS. Os exercícios não reproduzem questões reais, e o percentual de acertos não equivale à pontuação oficial.</p>
    </div>
  )
}
