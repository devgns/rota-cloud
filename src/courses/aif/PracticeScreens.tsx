import { useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, ListChecks, RotateCcw, Sparkles, Timer } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Meter } from '@/components/diagrams/controls'
import { coursePath } from '../registry'
import { ItemView } from './ItemView'
import { FORMATS, SINGLE, grade, isAnswered, itemById, stats, type Item } from './items'
import { KEY, useAifProgress, type Answer, type Attempt } from './progress'

const p = (path = '') => coursePath('aif-c01', path)
const EXAM_SECONDS = 5400
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function useSaveAttempt() {
  const { update } = useAifProgress()
  return (mode: string, items: readonly Item[], answers: Record<string, Answer>) => {
    const result = stats(items, answers)
    const attempt: Attempt = { id: `${Date.now()}`, date: new Date().toISOString(), mode, correct: result.correct, total: items.length, byDomain: result.byDomain, responses: { ...answers } }
    update((v) => ({ ...v, answers: { ...v.answers, ...answers }, attempts: [...v.attempts, attempt] }))
    return result
  }
}

export function PracticeHub() {
  const { progress } = useAifProgress()
  const exam = progress.exam
  const card = 'rounded-xl border border-[var(--color-line)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--color-amber)]'
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-3xl">Pratique decisões, não decore slogans</h1>
      <p className="mt-3 text-[var(--color-ink-soft)]">80 questões de escolha única e {FORMATS.length} nos formatos de múltipla resposta, ordenação e associação, todas autorais e comentadas. Na prova, esses formatos não dão crédito parcial: falta uma alternativa ou um par, a questão inteira conta como erro.</p>
      {exam && <p className="mt-4 rounded-lg border border-[var(--color-amber)] bg-[var(--color-amber-soft)] p-3 text-sm" role="status">Você tem um simulado em andamento: {Object.keys(exam.answers).length} de {exam.ids.length} respondidas, {clock(exam.remaining)} restantes. <Link className="font-semibold" to={p('/praticar/simulado')}>Retomar →</Link></p>}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link to={p('/praticar/treino')} className={card}><BookOpen className="mb-3 h-7 w-7" /><h2 className="font-semibold">Treino comentado</h2><p className="mt-2 text-sm">80 questões de escolha única, explicação logo após responder, sem limite de tempo.</p></Link>
        <Link to={p('/praticar/formatos')} className={card}><ListChecks className="mb-3 h-7 w-7" /><h2 className="font-semibold">Formatos da prova</h2><p className="mt-2 text-sm">{FORMATS.length} itens de múltipla resposta, ordenação e associação, com a regra do tudo ou nada.</p></Link>
        <Link to={p('/praticar/simulado')} className={card}><Sparkles className="mb-3 h-7 w-7" /><h2 className="font-semibold">Simulado cronometrado</h2><p className="mt-2 text-sm">65 questões (6 nos outros formatos), 90 minutos, correção comentada ao final. Fica salvo se você fechar a página.</p></Link>
      </div>
      <p className="mt-6 text-sm text-[var(--color-ink-soft)]">Prefere responder lendo? As 80 questões também estão no <Link to={p('/ler/chapter-27')}>capítulo 27</Link>, com marcação e correção na própria página.</p>
    </div>
  )
}

/** Treino com correção imediata: escolha única revela ao marcar; os outros formatos, ao conferir. */
export function Drill({ mode }: { mode: 'treino' | 'formatos' }) {
  const pool = mode === 'treino' ? SINGLE : FORMATS
  const { update } = useAifProgress()
  const save = useSaveAttempt()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [result, setResult] = useState<ReturnType<typeof stats> | null>(null)
  const item = pool[current]!
  const reveal = (id: string, answer: Answer) => {
    setRevealed((s) => new Set(s).add(id))
    update((v) => ({ ...v, answers: { ...v.answers, [id]: answer } }))
  }
  const change = (answer: Answer) => {
    setAnswers((a) => ({ ...a, [item.id]: answer }))
    if (item.type === 'single') reveal(item.id, answer)
  }
  const shown = revealed.has(item.id)
  const right = pool.filter((q) => revealed.has(q.id) && grade(q, answers[q.id])).length
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link className="text-sm text-[var(--color-navy)]" to={p('/praticar')}>← Voltar a Praticar</Link>
      <h1 className="mt-2 font-serif text-3xl">{mode === 'treino' ? 'Treino comentado (80 questões)' : `Formatos da prova (${FORMATS.length} itens)`}</h1>
      <p className="mt-3 text-sm text-[var(--color-ink-soft)]">{mode === 'treino' ? 'Feedback imediato após responder; use as explicações para aprender a distinguir os serviços.' : 'Marque, ordene ou associe e clique em Conferir. Sem crédito parcial, como na prova: um par ou uma alternativa errada zera o item.'}</p>
      <Navigator pool={pool} current={current} onPick={setCurrent} state={(q) => (revealed.has(q.id) ? (grade(q, answers[q.id]) ? 'ok' : 'bad') : isAnswered(q, answers[q.id]) ? 'marked' : 'empty')} />
      <div className="mt-2 text-sm text-[var(--color-ink-soft)]">{revealed.size} conferidas · {right} certas</div>
      <div className="mt-4 rounded-2xl border border-[var(--color-line)] p-5">
        <ItemView item={item} answer={answers[item.id]} onChange={change} locked={shown} revealed={shown} />
        {item.type !== 'single' && !shown && <button type="button" className="choice mt-4" disabled={!isAnswered(item, answers[item.id])} onClick={() => reveal(item.id, answers[item.id]!)}>Conferir resposta</button>}
        <div className="mt-6 flex justify-between gap-3">
          <button className="choice" disabled={current === 0} onClick={() => setCurrent((n) => n - 1)}><ChevronLeft className="inline h-4 w-4" /> Anterior</button>
          <button className="choice" disabled={current === pool.length - 1} onClick={() => setCurrent((n) => n + 1)}>Próxima <ChevronRight className="inline h-4 w-4" /></button>
        </div>
      </div>
      {!result && <div className="mt-4 flex flex-wrap gap-2"><button className="choice" onClick={() => setResult(save(mode, pool.filter((q) => revealed.has(q.id)), answers))} disabled={revealed.size === 0}>Encerrar e registrar sessão</button></div>}
      {result && <ResultPanel result={result} total={revealed.size} onAgain={() => { setAnswers({}); setRevealed(new Set()); setResult(null); setCurrent(0) }} />}
    </div>
  )
}

type CellState = 'empty' | 'marked' | 'ok' | 'bad'

function Navigator({ pool, current, onPick, state }: { pool: readonly Item[]; current: number; onPick: (i: number) => void; state: (item: Item) => CellState }) {
  const tone: Record<CellState, string> = {
    empty: 'border-[var(--color-line)]',
    marked: 'border-[var(--color-navy)] bg-[var(--color-navy-wash)]',
    ok: 'border-[var(--color-ok)] bg-[var(--color-ok)] text-white dark:text-[#121820]',
    bad: 'border-[var(--color-bad)] bg-[var(--color-bad-soft)] text-[var(--color-bad)]',
  }
  return (
    <div className="mt-5 flex flex-wrap gap-1" aria-label="Ir para a questão">
      {pool.map((q, i) => (
        <button key={q.id} type="button" aria-label={`Questão ${i + 1}`} aria-current={i === current ? 'step' : undefined} className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs ${tone[state(q)]} ${i === current ? 'ring-2 ring-[var(--color-amber)] ring-offset-1' : ''}`} onClick={() => onPick(i)}>
          {i + 1}
        </button>
      ))}
    </div>
  )
}

function ResultPanel({ result, total, onAgain }: { result: ReturnType<typeof stats>; total: number; onAgain: () => void }) {
  return (
    <div className="mt-6 rounded-2xl border border-[var(--color-line)] p-5" role="status">
      <h2 className="font-serif text-2xl">Resultado: {result.correct} de {total}</h2>
      <p className="mt-2 text-sm">Resultado apenas didático; não corresponde à nota escalonada da AWS. A sessão foi registrada em Progresso.</p>
      <div className="mt-4 grid gap-2">
        {Object.entries(result.byDomain).sort().map(([d, s]) => <Meter key={d} label={`Domínio ${d}`} value={s.correct / s.total} display={`${s.correct}/${s.total}`} tone={s.correct / s.total >= 0.8 ? 'ok' : s.correct / s.total >= 0.6 ? 'warn' : 'bad'} />)}
      </div>
      <button className="choice mt-4" onClick={onAgain}><RotateCcw className="mr-1 inline h-4 w-4" /> Refazer</button>
    </div>
  )
}

/* Simulado: 59 de escolha única + 6 nos outros formatos, salvo a cada resposta e a cada 5 segundos. */

const QUOTAS: Record<number, number> = { 1: 13, 2: 16, 3: 18, 4: 9, 5: 9 }

export function buildExam(seed: number): string[] {
  const formats = (['multiple_response', 'ordering', 'matching'] as const).flatMap((type) => {
    const list = FORMATS.filter((q) => q.type === type)
    return [list[(seed * 2) % list.length]!, list[(seed * 2 + 1) % list.length]!]
  })
  const quotas = { ...QUOTAS }
  for (const f of formats) quotas[f.domain] = Math.max(0, (quotas[f.domain] ?? 0) - 1)
  const singles = Object.entries(quotas).flatMap(([domain, n]) => {
    const list = SINGLE.filter((q) => q.domain === Number(domain))
    return Array.from({ length: n }, (_, i) => list[(i + seed) % list.length]!)
  })
  const all = [...singles, ...formats]
  // Intercala domínios e formatos em vez de blocos.
  return all.map((_, i) => all[(i * 17) % all.length]!.id)
}

export function ExamScreen() {
  const { progress, update } = useAifProgress()
  const save = useSaveAttempt()
  const exam = progress.exam
  const [finished, setFinished] = useState<{ ids: string[]; answers: Record<string, Answer>; result: ReturnType<typeof stats> } | null>(null)
  const [remaining, setRemaining] = useState(exam?.remaining ?? EXAM_SECONDS)
  const remainingRef = useRef(remaining)
  remainingRef.current = remaining
  const items = useMemo(() => (exam?.ids ?? finished?.ids ?? []).map((id) => itemById.get(id)!).filter(Boolean), [exam?.ids, finished?.ids])
  const current = exam?.current ?? 0
  const item = items[current]

  const start = () => {
    const seed = progress.attempts.filter((a) => a.mode === 'simulado').length
    setFinished(null)
    setRemaining(EXAM_SECONDS)
    update((v) => ({ ...v, exam: { ids: buildExam(seed), answers: {}, remaining: EXAM_SECONDS, current: 0, savedAt: new Date().toISOString() } }))
  }
  const patch = (fn: (e: NonNullable<typeof exam>) => Partial<NonNullable<typeof exam>>) => update((v) => (v.exam ? { ...v, exam: { ...v.exam, ...fn(v.exam), remaining: remainingRef.current, savedAt: new Date().toISOString() } } : v))
  const finish = () => {
    if (!exam) return
    const result = save('simulado', items, exam.answers)
    setFinished({ ids: exam.ids, answers: exam.answers, result })
    update((v) => ({ ...v, exam: null }))
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    if (!exam) return undefined
    const tick = window.setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000)
    const persist = window.setInterval(() => update((v) => (v.exam ? { ...v, exam: { ...v.exam, remaining: remainingRef.current } } : v)), 5000)
    // Ao fechar ou recarregar a aba, grava o tempo direto, sem esperar o próximo render.
    const onHide = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(KEY) ?? '{}') as { exam?: { remaining: number } }
        if (saved.exam) localStorage.setItem(KEY, JSON.stringify({ ...saved, exam: { ...saved.exam, remaining: remainingRef.current } }))
      } catch { /* sem armazenamento: o simulado vale só nesta sessão */ }
    }
    window.addEventListener('pagehide', onHide)
    return () => {
      window.removeEventListener('pagehide', onHide)
      window.clearInterval(tick)
      window.clearInterval(persist)
      update((v) => (v.exam ? { ...v, exam: { ...v.exam, remaining: remainingRef.current } } : v))
    }
  }, [Boolean(exam), update]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (exam && remaining <= 0) finish()
  }, [remaining]) // eslint-disable-line react-hooks/exhaustive-deps

  if (finished) return <ExamReview ids={finished.ids} answers={finished.answers} result={finished.result} onAgain={start} />

  if (!exam || !item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link className="text-sm text-[var(--color-navy)]" to={p('/praticar')}>← Voltar a Praticar</Link>
        <h1 className="mt-2 font-serif text-3xl">Simulado autoral cronometrado</h1>
        <ul className="mt-4 space-y-2 text-[var(--color-ink-soft)]">
          <li>65 questões em 90 minutos, na proporção dos domínios oficiais.</li>
          <li>59 de escolha única e 6 nos outros formatos (2 de múltipla resposta, 2 de ordenação, 2 de associação), sem crédito parcial.</li>
          <li>Responda no sistema: as marcações e o tempo ficam salvos neste navegador; se fechar a página, você retoma de onde parou.</li>
          <li>Ao finalizar, você vê a nota por domínio e todas as questões corrigidas e comentadas.</li>
        </ul>
        <button type="button" className="btn-primary mt-6 rounded-lg bg-[var(--color-navy)] px-5 py-2.5 font-semibold text-white" onClick={start}>Começar simulado</button>
      </div>
    )
  }

  const answered = items.filter((q) => isAnswered(q, exam.answers[q.id])).length
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link className="text-sm text-[var(--color-navy)]" to={p('/praticar')}>← Voltar a Praticar (o simulado fica salvo)</Link>
      <h1 className="mt-2 font-serif text-3xl">Simulado autoral (65 questões)</h1>
      <div className="sticky top-16 z-10 mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-2 text-sm">
        <span>Questão {current + 1} de {items.length} · {answered} respondidas</span>
        <span className={`font-semibold tabular-nums ${remaining < 600 ? 'text-[var(--color-bad)]' : ''}`} aria-label="Tempo restante"><Timer className="mr-1 inline h-4 w-4" />{clock(remaining)}</span>
      </div>
      <Navigator pool={items} current={current} onPick={(i) => patch(() => ({ current: i }))} state={(q) => (isAnswered(q, exam.answers[q.id]) ? 'marked' : 'empty')} />
      <div className="mt-4 rounded-2xl border border-[var(--color-line)] p-5">
        <ItemView item={item} answer={exam.answers[item.id]} onChange={(answer) => patch((e) => ({ answers: { ...e.answers, [item.id]: answer } }))} locked={false} revealed={false} />
        <div className="mt-6 flex justify-between gap-3">
          <button className="choice" disabled={current === 0} onClick={() => patch(() => ({ current: current - 1 }))}><ChevronLeft className="inline h-4 w-4" /> Anterior</button>
          {current < items.length - 1 ? <button className="choice" onClick={() => patch(() => ({ current: current + 1 }))}>Próxima <ChevronRight className="inline h-4 w-4" /></button> : <button className="choice" onClick={finish}>Finalizar simulado</button>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="choice" onClick={() => { if (answered < items.length && !window.confirm(`${items.length - answered} questões em branco contam como erro. Finalizar mesmo assim?`)) return; finish() }}>Encerrar e ver resultado</button>
        <button className="choice" onClick={() => { if (window.confirm('Abandonar este simulado? As marcações serão descartadas.')) update((v) => ({ ...v, exam: null })) }}>Abandonar</button>
      </div>
    </div>
  )
}

function ExamReview({ ids, answers, result, onAgain }: { ids: string[]; answers: Record<string, Answer>; result: ReturnType<typeof stats>; onAgain: () => void }) {
  const items = ids.map((id) => itemById.get(id)!).filter(Boolean)
  const [current, setCurrent] = useState(0)
  const [onlyWrong, setOnlyWrong] = useState(false)
  const pool = onlyWrong ? items.filter((q) => !grade(q, answers[q.id])) : items
  const item = pool[Math.min(current, pool.length - 1)]
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link className="text-sm text-[var(--color-navy)]" to={p('/praticar')}>← Voltar a Praticar</Link>
      <ResultPanel result={result} total={items.length} onAgain={onAgain} />
      <h2 className="mt-8 font-serif text-2xl">Questões comentadas</h2>
      <label className="mt-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyWrong} onChange={(e) => { setOnlyWrong(e.currentTarget.checked); setCurrent(0) }} /> Mostrar só as que errei ou deixei em branco</label>
      <Navigator pool={pool} current={current} onPick={setCurrent} state={(q) => (grade(q, answers[q.id]) ? 'ok' : 'bad')} />
      {item ? (
        <div className="mt-4 rounded-2xl border border-[var(--color-line)] p-5">
          <ItemView item={item} answer={answers[item.id]} onChange={() => undefined} locked revealed />
          <div className="mt-6 flex justify-between gap-3">
            <button className="choice" disabled={current === 0} onClick={() => setCurrent((n) => n - 1)}><ChevronLeft className="inline h-4 w-4" /> Anterior</button>
            <button className="choice" disabled={current >= pool.length - 1} onClick={() => setCurrent((n) => n + 1)}>Próxima <ChevronRight className="inline h-4 w-4" /></button>
          </div>
        </div>
      ) : <p className="mt-4">Nenhum erro nesta tentativa. 🎯</p>}
    </div>
  )
}
