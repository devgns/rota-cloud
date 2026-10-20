import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, buttonClass, Panel } from '@/components/ui'
import { ServiceNamesGuide } from '@/components/ServiceNamesGuide'
import { domainLabel } from '@/content/studyLayer'
import { getCorpus } from '@/lib/corpus'
import { attemptsFromSession, createSession, finishExam, gradeSelection, orderedOptions, pauseSession, remainingMs, resumeSession, selectionReady } from '@/lib/quiz'
import { missedQuestionIds } from '@/lib/quiz'
import type { ActiveSession, Question } from '@/lib/types'
import { DOMAIN_META, type Domain } from '@/lib/types'
import { useProgress } from '@/state/ProgressContext'

export function PracticeHub() {
  const { progress } = useProgress()
  const missed = missedQuestionIds(progress)
  const exam = progress.activeSession?.mode === 'exam' && progress.activeSession.status === 'in_progress'
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-serif text-4xl">Prática</h1>
      <p className="mt-3 max-w-2xl text-[var(--color-ink-soft)]">
        As 80 questões são autorais, extraídas da apostila. O percentual desta simulação não é a nota oficial de 100 a 1000 e não indica aprovação na AWS.
      </p>
      {exam && (
        <Panel className="mt-6">
          <h2 className="font-semibold">Simulado em andamento</h2>
          <Link className="mt-2 inline-block font-semibold text-[var(--color-navy)]" to="/praticar/simulado">Retomar</Link>
        </Panel>
      )}
      <h2 className="mt-8 text-xl font-semibold">Treino rápido</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link className={buttonClass('ghost')} to="/praticar/treino">Todas</Link>
        {([1, 2, 3, 4] as Domain[]).map((domain) => (
          <Link className={buttonClass('ghost')} key={domain} to={`/praticar/treino?domain=${domain}`}>{domainLabel(domain)}</Link>
        ))}
        <Link className={buttonClass('ghost')} to="/praticar/treino?missed=1">Questões que errei ({missed.length})</Link>
      </div>
      <h2 className="mt-8 text-xl font-semibold">Simulado</h2>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Até 65 questões, 90 minutos, ordem aleatória. Você pode pausar o cronômetro.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {[20, 40, 65].map((count) => (
          <Link className={buttonClass()} key={count} to={`/praticar/simulado?n=${count}`}>{count} questões</Link>
        ))}
      </div>
      <h2 className="mt-8 text-xl font-semibold">Tentativas anteriores</h2>
      <ul className="mt-3 space-y-2">
        {progress.examAttempts.length === 0 && <li>Nenhum simulado finalizado ainda.</li>}
        {progress.examAttempts.map((attempt) => (
          <li key={attempt.id}>
            <Link className="font-semibold text-[var(--color-navy)]" to={`/praticar/resultado/${attempt.id}`}>
              {new Date(attempt.finishedAt).toLocaleString('pt-BR')} — {attempt.correct}/{attempt.questionIds.length} acertos nesta simulação
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function useQuestionMap() {
  const corpus = getCorpus()
  return useMemo(() => new Map(corpus.questions.map((question) => [question.id, question])), [corpus.questions])
}

export function TrainPage() {
  const [params] = useSearchParams()
  const corpus = getCorpus()
  const questions = useQuestionMap()
  const { progress, update } = useProgress()
  const domain = Number(params.get('domain'))
  const missedOnly = params.get('missed') === '1'
  const onlyId = params.get('q')
  const pool = corpus.questions.filter((question) => {
    if (onlyId) return question.id === onlyId
    if (missedOnly) return missedQuestionIds(progress).includes(question.id)
    if (domain >= 1 && domain <= 4) return question.domain === domain
    return true
  })
  const session = progress.activeSession?.mode === 'train' ? progress.activeSession : null
  const signature = pool.map((question) => question.id).sort().join(',')
  const samePool = session && [...session.questionIds].sort().join(',') === signature
  const active = samePool ? session : null

  const start = () => {
    if (progress.activeSession?.mode === 'exam') return
    update((current) => ({ ...current, activeSession: createSession({ mode: 'train', questions: pool }) }))
  }

  if (progress.activeSession?.mode === 'exam' && progress.activeSession.status === 'in_progress') {
    return <div className="mx-auto max-w-3xl px-4 py-8"><p>Há um simulado aberto. Finalize ou abandone-o antes de um treino novo.</p><Link to="/praticar/simulado">Ir ao simulado</Link></div>
  }
  if (!active) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-serif text-3xl">Treino</h1>
        <p className="mt-2">{pool.length === 0 ? 'Não há questões nesse filtro.' : `${pool.length} questões. A resposta aparece só depois que você enviar.`}</p>
        {pool.length > 0 && <Button className="mt-4" onClick={start}>Começar treino</Button>}
      </div>
    )
  }
  return <Runner session={active} questions={questions} mode="train" />
}

export function ExamPage() {
  const [params] = useSearchParams()
  const corpus = getCorpus()
  const questions = useQuestionMap()
  const { progress, update } = useProgress()
  const count = Number(params.get('n') || 65)
  const session = progress.activeSession?.mode === 'exam' && progress.activeSession.status === 'in_progress'
    ? progress.activeSession
    : null

  const start = () => {
    update((current) => ({
      ...current,
      activeSession: createSession({ mode: 'exam', questions: corpus.questions, count }),
    }))
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-serif text-3xl">Simulado</h1>
        <p className="mt-2">Serão sorteadas {Math.min(count, 65, corpus.questions.length)} questões entre as 80. O tempo é de 90 minutos. Nada aqui vira nota AWS.</p>
        <Button className="mt-4" onClick={start}>Iniciar simulado</Button>
      </div>
    )
  }
  return <Runner session={session} questions={questions} mode="exam" />
}

function Runner({ session, questions, mode }: { session: ActiveSession; questions: Map<string, Question>; mode: 'train' | 'exam' }) {
  const { update } = useProgress()
  const navigate = useNavigate()
  const [now, setNow] = useState(() => Date.now())
  const finishing = useRef(false)
  const questionId = session.questionIds[session.currentIndex]
  const question = questionId ? questions.get(questionId) : undefined
  const selected = question ? session.answers[question.id] ?? [] : []
  const revealed = question ? Boolean(session.revealed[question.id]) : false

  useEffect(() => {
    if (mode !== 'exam') return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [mode])

  useEffect(() => {
    if (mode !== 'exam' || session.paused || finishing.current || !question) return
    if (remainingMs(session, new Date()) !== 0) return
    finishing.current = true
    const summary = finishExam(session, [...questions.values()])
    const attempts = attemptsFromSession(session, [...questions.values()])
    update((progress) => ({
      ...progress,
      activeSession: null,
      examAttempts: [...progress.examAttempts, summary],
      questionAttempts: [...progress.questionAttempts, ...attempts],
    }))
    navigate(`/praticar/resultado/${summary.id}`)
  }, [mode, navigate, question, questions, session, update])

  if (!question) return <p className="px-4 py-8">Questão indisponível.</p>

  const patch = (recipe: (current: ActiveSession) => ActiveSession) => {
    update((progress) => progress.activeSession ? { ...progress, activeSession: recipe(progress.activeSession) } : progress)
  }
  const toggle = (optionId: string) => {
    if (revealed) return
    if (question.kind === 'multiple' && !selected.includes(optionId) && selected.length >= question.selection_count) return
    const next = question.kind === 'single'
      ? [optionId]
      : selected.includes(optionId)
        ? selected.filter((id) => id !== optionId)
        : [...selected, optionId]
    patch((current) => ({ ...current, answers: { ...current.answers, [question.id]: next } }))
  }
  const submit = () => {
    if (!selectionReady(question, selected)) return
    if (mode === 'train') {
      const correct = gradeSelection(question, selected)
      update((progress) => ({
        ...progress,
        questionAttempts: [...progress.questionAttempts, {
          questionId: question.id,
          selectedOptionIds: selected,
          correct,
          answeredAt: new Date().toISOString(),
          sessionId: session.id,
        }],
        activeSession: progress.activeSession ? {
          ...progress.activeSession,
          revealed: { ...progress.activeSession.revealed, [question.id]: true },
        } : progress.activeSession,
      }))
      return
    }
    const last = session.currentIndex >= session.questionIds.length - 1
    patch((current) => ({ ...current, currentIndex: last ? current.currentIndex : current.currentIndex + 1 }))
  }
  const finish = () => {
    const summary = finishExam(session, [...questions.values()])
    const attempts = attemptsFromSession(session, [...questions.values()])
    update((progress) => ({
      ...progress,
      activeSession: null,
      examAttempts: [...progress.examAttempts, summary],
      questionAttempts: [...progress.questionAttempts, ...attempts],
    }))
    navigate(`/praticar/resultado/${summary.id}`)
  }
  const clock = remainingMs(session, new Date(now))

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <ServiceNamesGuide />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-ink-soft)]">
          {session.currentIndex + 1} / {session.questionIds.length}
          {mode === 'exam' && clock != null && ` · ${session.paused ? 'pausado ' : ''}${formatClock(clock)}`}
        </p>
        {mode === 'exam' && (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => patch((current) => current.paused ? resumeSession(current) : pauseSession(current))}>
              {session.paused ? 'Retomar tempo' : 'Pausar'}
            </Button>
            <Button variant="ghost" aria-pressed={session.flagged.includes(question.id)} onClick={() => patch((current) => ({
              ...current,
              flagged: current.flagged.includes(question.id)
                ? current.flagged.filter((id) => id !== question.id)
                : [...current.flagged, question.id],
            }))}>
              {session.flagged.includes(question.id) ? 'Marcada' : 'Marcar para revisar'}
            </Button>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm">{domainLabel(question.domain as Domain)} · {question.kind === 'multiple' ? `escolha ${question.selection_count}` : 'escolha única'}</p>
      <h1 className="mt-2 text-2xl font-semibold">{question.statement_markdown}</h1>
      <fieldset className="mt-4 space-y-2" disabled={revealed}>
        <legend className="sr-only">Alternativas</legend>
        {orderedOptions(question, session.optionOrder[question.id]).map((option) => {
          const checked = selected.includes(option.id)
          return (
            <label key={option.id} className="flex gap-3 rounded-xl border border-[var(--color-line)] px-3 py-3">
              <input
                type={question.kind === 'single' ? 'radio' : 'checkbox'}
                name={question.id}
                checked={checked}
                onChange={() => toggle(option.id)}
              />
              <span><strong>{option.id}.</strong> {option.text}</span>
            </label>
          )
        })}
      </fieldset>
      {!revealed && (
        <Button className="mt-4" disabled={!selectionReady(question, selected)} onClick={submit}>
          {mode === 'train' ? 'Enviar resposta' : 'Guardar e avançar'}
        </Button>
      )}
      {question.kind === 'multiple' && !revealed && (
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">Selecione exatamente {question.selection_count} alternativas. Seleção atual: {selected.length}.</p>
      )}
      {revealed && (
        <Panel className="mt-4">
          <p className="font-semibold">{gradeSelection(question, selected) ? 'Certa.' : 'Ainda não.'}</p>
          <p className="mt-2">{question.explanation_markdown}</p>
          <p className="mt-2 text-sm">Gabarito: {question.correct_option_ids.join(', ')}. <Link to={`/ler/chapter-23`}>Ver na apostila</Link></p>
          <Button className="mt-4" onClick={() => patch((current) => ({
            ...current,
            currentIndex: Math.min(current.questionIds.length - 1, current.currentIndex + 1),
          }))}>Próxima</Button>
        </Panel>
      )}
      {mode === 'exam' && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold">Questões</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {session.questionIds.map((id, index) => (
              <button
                key={id}
                className="choice"
                aria-pressed={index === session.currentIndex}
                aria-label={`${id}${session.flagged.includes(id) ? ', marcada' : ''}${session.answers[id] ? ', respondida' : ''}`}
                onClick={() => patch((current) => ({ ...current, currentIndex: index }))}
              >
                {index + 1}{session.flagged.includes(id) ? '*' : ''}
              </button>
            ))}
          </div>
          <Button className="mt-4" variant="danger" onClick={finish}>Finalizar simulado</Button>
        </div>
      )}
    </div>
  )
}

export function ResultPage() {
  const { attemptId } = useParams()
  const corpus = getCorpus()
  const { progress } = useProgress()
  const attempt = progress.examAttempts.find((item) => item.id === attemptId)
  if (!attempt) return <div className="px-4 py-8">Tentativa não encontrada. <Link to="/praticar">Voltar</Link></div>
  const byId = new Map(corpus.questions.map((question) => [question.id, question]))
  const percent = Math.round((attempt.correct / attempt.questionIds.length) * 100)
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-4xl">Resultado da simulação</h1>
      <ServiceNamesGuide />
      <p className="mt-3 text-[var(--color-ink-soft)]">
        {attempt.correct} acertos em {attempt.questionIds.length} questões ({percent}% desta seleção). {attempt.questionIds.length - attempt.answered} ficaram sem resposta e não contam como acerto.
        Isso não é a nota escalada da AWS e não diz se você seria aprovado.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {([1, 2, 3, 4] as Domain[]).map((domain) => {
          const bucket = attempt.byDomain[String(domain)] ?? { correct: 0, total: 0 }
          return (
            <Panel key={domain}>
              <h2 className="font-semibold">{DOMAIN_META[domain].title}</h2>
              <p>{bucket.correct}/{bucket.total} nesta tentativa</p>
              {bucket.total > 0 && bucket.correct < bucket.total && (
                <p className="text-sm text-[var(--color-ink-soft)]">Vale reler os capítulos desse domínio antes da próxima tentativa.</p>
              )}
            </Panel>
          )
        })}
      </div>
      <h2 className="mt-8 text-xl font-semibold">Questões</h2>
      <ol className="mt-3 space-y-4">
        {attempt.questionIds.map((id) => {
          const question = byId.get(id)
          if (!question) return null
          const selected = attempt.answers[id] ?? []
          const correct = selected.length > 0 && gradeSelection(question, selected)
          return (
            <li key={id}>
              <Panel>
                <p className="text-sm">{id} · {correct ? 'acerto' : selected.length ? 'erro' : 'sem resposta'}{attempt.flagged.includes(id) ? ' · marcada' : ''}</p>
                <p className="mt-1 font-semibold">{question.statement_markdown}</p>
                <p className="mt-2 text-sm">Sua escolha: {selected.join(', ') || '—'}. Gabarito: {question.correct_option_ids.join(', ')}.</p>
                <p className="mt-2 text-sm">{question.explanation_markdown}</p>
              </Panel>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
