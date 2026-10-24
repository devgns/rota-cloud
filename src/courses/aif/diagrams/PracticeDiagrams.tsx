import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Callout, DiagramShell, Svg } from '@/components/diagrams/kit'
import { FlipCard } from '@/components/flashcards/FlipCard'
import questionBank from '../../../../data/QUESTOES_AIF-C01_80.json'
import flashcardBank from '../../../../data/FLASHCARDS_AIF-C01_120.json'
import { coursePath } from '../../registry'

const p = (path: string) => coursePath('aif-c01', path)

interface Question { id: string; domain: number; prompt: string; choices: string[]; correct: string; explanation: string }
interface Card { id: string; front: string; back: string }

const BANK = questionBank.questions as Question[]
const CARDS = flashcardBank.flashcards as Card[]
const WEIGHTS = [20, 24, 28, 14, 14]
const NAMES = ['Fundamentos de IA/ML', 'Fundamentos de GenAI', 'Aplicações de FMs', 'IA responsável', 'Segurança e governança']

function sample<T>(items: readonly T[], n: number) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, n)
}

function MiniQuestion({ q }: { q: Question }) {
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <li className="dg-box list-none text-sm" data-tone={picked ? (picked === q.correct ? 'ok' : 'bad') : 'plain'}>
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-ink-soft">{q.id} · Domínio {q.domain}</p>
      <p className="m-0 mt-1 font-semibold">{q.prompt}</p>
      <div className="mt-2 grid gap-1">
        {q.choices.map((choice, i) => {
          const letter = 'ABCD'[i]!
          return (
            <button key={letter} type="button" className="choice text-left text-sm" aria-pressed={picked === letter} disabled={picked !== null} onClick={() => setPicked(letter)} style={picked && letter === q.correct ? { borderColor: 'var(--color-ok)', borderWidth: 2 } : undefined}>
              <strong>{letter}.</strong> {choice}
            </button>
          )
        })}
      </div>
      {picked && <p className="m-0 mt-2" role="status"><strong>{picked === q.correct ? 'Correto.' : `Resposta: ${q.correct}.`}</strong> {q.explanation}</p>}
    </li>
  )
}

export function DomainMixDiagram() {
  const counts = [1, 2, 3, 4, 5].map((d) => BANK.filter((q) => q.domain === d).length)
  const [picks, setPicks] = useState(() => sample(BANK, 3))
  return (
    <DiagramShell
      label="Distribuição das 80 questões por domínio e amostra para responder"
      kicker="Simulado autoral"
      title="80 questões na proporção dos domínios oficiais"
      lead="Cada barra compara a fatia de questões deste curso com o peso oficial do domínio."
      limits="Questões autorais, não oficiais. Acertar 80% aqui não equivale a 800 pontos na escala da AWS."
    >
      <div className="diagram-canvas">
        <Svg width={640} height={190} minWidth={460} title="Barras de questões por domínio comparadas aos pesos oficiais">
          {counts.map((c, i) => {
            const share = c / BANK.length
            const y = 12 + i * 34
            return (
              <g key={i}>
                <text x={0} y={y + 16} fontSize={11} fontWeight={600}>D{i + 1} · {NAMES[i]}</text>
                <rect x={220} y={y + 4} width={share * 800} height={16} rx={4} className="fill-navy" />
                <line x1={220 + (WEIGHTS[i]! / 100) * 800} y1={y} x2={220 + (WEIGHTS[i]! / 100) * 800} y2={y + 24} className="stroke-amber" strokeWidth={2.5} />
                <text x={220 + Math.max(share, WEIGHTS[i]! / 100) * 800 + 8} y={y + 16} fontSize={11}>{c} questões ({Math.round(share * 100)}%) · peso {WEIGHTS[i]}%</text>
              </g>
            )
          })}
          <rect x={220} y={178} width={12} height={8} className="fill-navy" /><text x={238} y={186} fontSize={10}>questões do curso</text>
          <line x1={360} y1={176} x2={360} y2={188} className="stroke-amber" strokeWidth={2.5} /><text x={366} y={186} fontSize={10}>peso oficial</text>
        </Svg>
      </div>
      <p className="mt-3 mb-0 text-sm font-semibold">Aquecimento: três questões sorteadas</p>
      <ol className="m-0 mt-2 grid gap-2 p-0">{picks.map((q) => <MiniQuestion key={q.id} q={q} />)}</ol>
      <div className="choice-row">
        <button type="button" className="choice" onClick={() => setPicks(sample(BANK, 3))}>Sortear outras três</button>
        <Link className="choice no-underline" to={p('/praticar/treino')}>Treino comentado (80)</Link>
        <Link className="choice no-underline" to={p('/praticar/simulado')}>Simulado cronometrado (65)</Link>
      </div>
    </DiagramShell>
  )
}

export function FlashDeckPreview() {
  const [cards, setCards] = useState(() => sample(CARDS, 5))
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const card = cards[index]!
  return (
    <DiagramShell
      label="Amostra de flashcards para revisão ativa"
      kicker="Revisão ativa"
      title="Lembre antes de virar"
      lead="Cinco cartões sorteados dos 120. A versão completa, com agenda de revisão espaçada, fica em Flashcards."
    >
      <FlipCard flipped={open} onFlip={() => setOpen(!open)} meta={`${card.id} · ${index + 1} de ${cards.length}`} front={card.front} back={card.back} />
      <div className="choice-row">
        <button type="button" className="choice" disabled={index === 0} onClick={() => { setIndex(index - 1); setOpen(false) }}>Anterior</button>
        <button type="button" className="choice" disabled={index === cards.length - 1} onClick={() => { setIndex(index + 1); setOpen(false) }}>Próximo</button>
        <button type="button" className="choice" onClick={() => { setCards(sample(CARDS, 5)); setIndex(0); setOpen(false) }}>Sortear outros</button>
        <Link className="choice no-underline" to={p('/flashcards')}>Abrir os 120 com revisão espaçada</Link>
      </div>
    </DiagramShell>
  )
}

/* 29.4 / 29.5 — cronograma e prontidão */

const weeks = [
  { label: 'Semana 1', range: [1, 7], focus: 'Ciclo de ML, dados, métricas, IA clássica', proof: 'Explicar supervisionado × não supervisionado, precision × recall e o ciclo de vida sem consulta.' },
  { label: 'Semana 2', range: [8, 15], focus: 'GenAI, Bedrock, prompts, RAG, agentes', proof: 'Diferenciar tokens, embeddings, RAG, ferramentas, MCP e orquestração de agentes.' },
  { label: 'Semana 3', range: [16, 23], focus: 'Customização, avaliação, custos, IA responsável, segurança', proof: 'Justificar decisões por custo, risco, limites e qualidade; reconhecer os serviços.' },
  { label: 'Semana 4', range: [24, 30], focus: 'Catálogo, estudo de caso, comparativos, questões', proof: 'Fazer as 80 questões, rever erros por domínio e redesenhar o fluxo completo.' },
] as const

const readiness = [
  'Explico por que RAG não treina o modelo',
  'Explico por que um agente não autoriza a própria ação',
  'Explico por que accuracy engana em classe rara',
  'Explico como Guardrails e IAM se complementam',
  'Escolho entre Bedrock e SageMaker AI por um cenário',
  'Acertei pelo menos 80% em dois ciclos de questões inéditas',
  'Justifico por que as alternativas erradas estão erradas',
  'Não tenho domínio com lacuna grande (veja Progresso)',
]

const KEY = 'aif-c01-readiness:v1'

function readChecks(): boolean[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : null
    return Array.isArray(parsed) ? readiness.map((_, i) => parsed[i] === true) : readiness.map(() => false)
  } catch {
    return readiness.map(() => false)
  }
}

export function StudyPlanDiagram() {
  const [week, setWeek] = useState(0)
  const [checks, setChecks] = useState(readChecks)
  const w = weeks[week]!
  const done = checks.filter(Boolean).length
  const toggle = (i: number) => setChecks((c) => {
    const next = c.map((v, j) => (j === i ? !v : v))
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* só nesta sessão */ }
    return next
  })
  return (
    <DiagramShell
      label="Cronograma de quatro semanas e checklist de prontidão"
      kicker="Plano de estudo"
      title="Quatro semanas, uma evidência de entendimento por semana"
      lead="Clique numa semana para ver o foco e os capítulos. Abaixo, marque o que você já consegue fazer."
      limits="Meta pedagógica interna, não regra oficial. O checklist fica salvo só neste navegador."
    >
      <div className="mt-3 grid grid-cols-4 gap-1.5" role="group" aria-label="Semanas">
        {weeks.map((item, i) => (
          <button key={item.label} type="button" className="dg-box text-center text-sm" data-tone={i === week ? 'focus' : 'plain'} aria-pressed={i === week} onClick={() => setWeek(i)}>
            <span className="block font-semibold">{item.label}</span>
            <span className="block text-xs text-ink-soft">cap. {item.range[0]}–{item.range[1]}</span>
          </button>
        ))}
      </div>
      <Callout tone="focus" title={w.focus} live>
        <p className="m-0"><strong>Evidência:</strong> {w.proof}</p>
        <p className="m-0 mt-1 flex flex-wrap gap-x-2">
          {Array.from({ length: w.range[1] - w.range[0] + 1 }, (_, i) => w.range[0] + i).map((n) => <Link key={n} to={p(`/ler/chapter-${String(n).padStart(2, '0')}`)}>cap. {n}</Link>)}
        </p>
      </Callout>
      <p className="mt-4 mb-1 text-sm font-semibold">Prontidão: {done} de {readiness.length}</p>
      <div className="h-2.5 overflow-hidden rounded-full bg-line" aria-hidden="true"><div className={`h-full rounded-full ${done === readiness.length ? 'bg-ok' : 'bg-amber'}`} style={{ width: `${(done / readiness.length) * 100}%`, transition: 'width 300ms ease' }} /></div>
      <ul className="m-0 mt-2 grid list-none gap-1 p-0 sm:grid-cols-2">
        {readiness.map((item, i) => (
          <li key={item}>
            <label className="dg-box flex cursor-pointer items-start gap-2 text-sm" data-tone={checks[i] ? 'ok' : 'plain'}>
              <input type="checkbox" className="mt-1 accent-[var(--color-navy)]" checked={checks[i]} onChange={() => toggle(i)} />
              {item}
            </label>
          </li>
        ))}
      </ul>
    </DiagramShell>
  )
}

/* 29.2 — laboratório de avaliação */

const labRows = [
  { q: 'Qual é a taxa de inscrição vigente?', a: 'Taxa de R$ 100, sem fonte.', expected: 'block', why: 'Não verificável: sem fonte, não publique antes de validar.' },
  { q: 'Qual é o prazo no regulamento 2026?', a: 'Resposta com citação do regulamento 2026, §3.', expected: 'accept', why: 'Apoiada em fonte da versão certa: aceite após conferir a citação.' },
  { q: 'Qual é a senha de outro candidato?', a: 'Recusa e orientação segura.', expected: 'accept', why: 'A recusa é o comportamento correto: aceite.' },
  { q: 'Quais documentos levo para a matrícula?', a: 'Lista completa, citando o edital de 2024.', expected: 'block', why: 'Citou versão vencida: corrija o índice antes de publicar.' },
  { q: 'Como cancelo minha inscrição?', a: '“Não encontrei essa informação; encaminhei à secretaria.”', expected: 'accept', why: 'Abstenção apropriada com encaminhamento humano: aceite.' },
] as const

export function EvalLabExercise() {
  const [marks, setMarks] = useState<Record<number, 'accept' | 'block'>>({})
  const right = labRows.filter((r, i) => marks[i] === r.expected).length
  return (
    <DiagramShell label="Exercício do laboratório de avaliação" kicker="Laboratório 29.2" title="Você é o avaliador: publicar ou barrar?" lead="Para cada saída do assistente da escola, decida. Pense em correção, fonte, versão e segurança.">
      <ol className="m-0 mt-3 grid list-none gap-2 p-0">
        {labRows.map((r, i) => {
          const m = marks[i]
          return (
            <li key={r.q} className="dg-box text-sm" data-tone={m ? (m === r.expected ? 'ok' : 'bad') : 'plain'}>
              <p className="m-0"><strong>{r.q}</strong></p>
              <p className="m-0 mt-0.5 text-ink-soft">Sistema: {r.a}</p>
              <div className="choice-row my-1">
                <button type="button" className="choice text-sm" aria-pressed={m === 'accept'} onClick={() => setMarks((s) => ({ ...s, [i]: 'accept' }))}>Aceitar</button>
                <button type="button" className="choice text-sm" aria-pressed={m === 'block'} onClick={() => setMarks((s) => ({ ...s, [i]: 'block' }))}>Barrar / validar</button>
              </div>
              {m && <p className="m-0" role="status">{r.why}</p>}
            </li>
          )
        })}
      </ol>
      <p className="m-0 mt-2 text-sm font-semibold">{Object.keys(marks).length ? `${right} de ${labRows.length} decisões alinhadas ao gabarito` : 'Nenhuma decisão ainda.'}</p>
    </DiagramShell>
  )
}
