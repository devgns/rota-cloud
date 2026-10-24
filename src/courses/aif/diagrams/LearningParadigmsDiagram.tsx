import { useState } from 'react'
import { Callout, Choices, DiagramShell, Svg, SvgNode } from '@/components/diagrams/kit'

type Mode = 'sup' | 'unsup' | 'rl'

const modes = [
  { id: 'sup', label: 'Supervisionado' },
  { id: 'unsup', label: 'Não supervisionado' },
  { id: 'rl', label: 'Reforço' },
] as const

const text: Record<Mode, { title: string; body: string; signal: string; tasks: string }> = {
  sup: { title: 'Há rótulo de resposta para cada exemplo', body: 'O modelo vê entrada + resposta certa (fraude / legítima) e aprende a fronteira que separa as classes.', signal: 'Pista no enunciado: “histórico rotulado”, “prever se…”, “prever quanto…”.', tasks: 'Classificação (classe) e regressão (número).' },
  unsup: { title: 'Não há rótulo: o objetivo é descobrir estrutura', body: 'O modelo agrupa pontos parecidos. Os grupos não têm nome: alguém do negócio ainda precisa interpretá-los.', signal: 'Pista: “segmentar sem categorias prévias”, “encontrar padrões ou anomalias”.', tasks: 'Clustering, detecção de anomalias, redução de dimensionalidade.' },
  rl: { title: 'Um agente age e recebe recompensa ao longo do tempo', body: 'Não há gabarito por exemplo: a política melhora tentando ações e observando recompensas ou penalidades acumuladas.', signal: 'Pista: “maximizar recompensa”, “ações sequenciais”, “ambiente”.', tasks: 'Robótica, jogos, otimização de decisões sequenciais. RLHF usa feedback humano como sinal de recompensa.' },
}

// Pontos fixos: dois grupos bem separados.
const points = [
  [70, 70, 0], [95, 110, 0], [60, 140, 0], [120, 80, 0], [110, 150, 0], [80, 185, 0], [140, 120, 0],
  [250, 60, 1], [290, 95, 1], [270, 140, 1], [320, 70, 1], [300, 170, 1], [240, 180, 1], [335, 130, 1],
] as const

function Scatter({ mode }: { mode: 'sup' | 'unsup' }) {
  return (
    <Svg width={400} height={240} minWidth={300} title={mode === 'sup' ? 'Pontos rotulados em duas classes e uma fronteira de decisão' : 'Pontos sem rótulo agrupados em dois clusters'}>
      <rect x={20} y={20} width={360} height={200} rx={8} className="fill-paper stroke-line" />
      {mode === 'sup' && <line x1={210} y1={30} x2={180} y2={210} className="stroke-navy" strokeWidth={2} strokeDasharray="6 4" />}
      {mode === 'sup' && <text x={214} y={44} fontSize={10} className="dg-soft">fronteira aprendida</text>}
      {mode === 'unsup' && (
        <>
          <ellipse cx={100} cy={128} rx={66} ry={80} className="fill-navy-wash stroke-navy" strokeDasharray="5 4" opacity={0.7} />
          <ellipse cx={288} cy={122} rx={72} ry={82} className="fill-amber-soft stroke-amber" strokeDasharray="5 4" opacity={0.7} />
          <text x={100} y={38} textAnchor="middle" fontSize={10} className="dg-soft">grupo A (sem nome)</text>
          <text x={288} y={36} textAnchor="middle" fontSize={10} className="dg-soft">grupo B (sem nome)</text>
        </>
      )}
      {points.map(([x, y, cls]) => {
        if (mode === 'unsup') return <circle key={`${x}-${y}`} cx={x} cy={y} r={6} className="dg-fade fill-ink-soft" />
        return cls === 0
          ? <circle key={`${x}-${y}`} cx={x} cy={y} r={6} className="dg-fade fill-ok" />
          : <rect key={`${x}-${y}`} x={x - 6} y={y - 6} width={12} height={12} className="dg-fade fill-bad" />
      })}
      {mode === 'sup' && (
        <>
          <circle cx={36} cy={232} r={5} className="fill-ok" /><text x={46} y={236} fontSize={10}>legítima</text>
          <rect x={104} y={227} width={10} height={10} className="fill-bad" /><text x={120} y={236} fontSize={10}>fraude</text>
        </>
      )}
    </Svg>
  )
}

function Loop({ step }: { step: number }) {
  const agent = { x: 30, y: 80, w: 120, h: 60 }
  const env = { x: 250, y: 80, w: 120, h: 60 }
  return (
    <Svg width={400} height={240} minWidth={300} title="Laço de reforço: agente age no ambiente e recebe estado e recompensa">
      <path d="M150 95 C 200 40, 200 40, 250 95" className={step % 2 === 0 ? 'stroke-navy' : 'stroke-ink-soft'} strokeWidth={step % 2 === 0 ? 2.5 : 1.4} fill="none" />
      <path d="M250 125 C 200 180, 200 180, 150 125" className={step % 2 === 1 ? 'stroke-amber' : 'stroke-ink-soft'} strokeWidth={step % 2 === 1 ? 2.5 : 1.4} fill="none" />
      <text x={200} y={46} textAnchor="middle" fontSize={11} fontWeight={600}>ação</text>
      <text x={200} y={186} textAnchor="middle" fontSize={11} fontWeight={600}>novo estado + recompensa</text>
      <SvgNode {...agent} label="Agente" sub="política" tone="focus" />
      <SvgNode {...env} label="Ambiente" sub="regras do mundo" />
      <text x={200} y={222} textAnchor="middle" fontSize={11} className="dg-soft">Recompensa acumulada: {[0, 0, 1, 1, 3, 3, 6][step % 7]}</text>
    </Svg>
  )
}

export function LearningParadigmsDiagram() {
  const [mode, setMode] = useState<Mode>('sup')
  const [step, setStep] = useState(0)
  const info = text[mode]
  return (
    <DiagramShell
      label="Três paradigmas de aprendizado: supervisionado, não supervisionado e reforço"
      kicker="Formas de aprender"
      title="O que existe nos dados decide o paradigma"
      lead="Troque o paradigma e compare o mesmo conjunto de pontos com e sem rótulos."
      limits="Existem também aprendizado semi-supervisionado e auto-supervisionado (base do pré-treino de LLMs); a prova pede principalmente estes três."
    >
      <Choices label="Paradigma" options={modes} value={mode} onChange={setMode} />
      <div className="diagram-canvas">{mode === 'rl' ? <Loop step={step} /> : <Scatter mode={mode} />}</div>
      {mode === 'rl' && (
        <div className="choice-row">
          <button type="button" className="choice" onClick={() => setStep((s) => s + 1)}>Próxima interação</button>
          <button type="button" className="choice" onClick={() => setStep(0)}>Recomeçar</button>
        </div>
      )}
      <Callout tone="focus" title={info.title} live>
        <p className="m-0">{info.body}</p>
        <p className="m-0 mt-1"><strong>Tarefas:</strong> {info.tasks}</p>
        <p className="m-0 mt-1 text-ink-soft">{info.signal}</p>
      </Callout>
    </DiagramShell>
  )
}

/* 3.3 — divisão treino/validação/teste e vazamento temporal */

const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const randomOrder = [2, 0, 1, 2, 0, 0, 1, 0, 2, 0, 0, 1] // 0 treino, 1 validação, 2 teste
const temporalOrder = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2]
const splitTone = ['fill-navy-wash stroke-navy', 'fill-amber-soft stroke-amber', 'fill-ok-soft stroke-ok']
const splitName = ['treino', 'validação', 'teste']

export function DataSplitDiagram() {
  const [temporal, setTemporal] = useState(false)
  const order = temporal ? temporalOrder : randomOrder
  const leaks = order.map((set, i) => set === 0 && order.slice(0, i).some((s) => s === 2))
  const leakCount = leaks.filter(Boolean).length
  return (
    <DiagramShell
      label="Divisão de uma série temporal em treino, validação e teste"
      kicker="Separação de dados"
      title="Prever vendas: sorteio ou corte no tempo?"
      lead="Doze meses de vendas. Compare a divisão aleatória com o corte temporal e veja onde o treino “enxerga o futuro”."
      limits="Em dados sem ordem temporal, a divisão aleatória (estratificada) é comum. O vazamento também aparece com registros do mesmo cliente ou imagens quase iguais em conjuntos diferentes."
    >
      <Choices label="Tipo de divisão" options={[{ id: 'random', label: 'Sorteio aleatório' }, { id: 'time', label: 'Corte temporal' }]} value={temporal ? 'time' : 'random'} onChange={(v) => setTemporal(v === 'time')} />
      <div className="diagram-canvas">
        <Svg width={620} height={110} minWidth={460} title="Linha do tempo de doze meses colorida por conjunto">
          {months.map((m, i) => (
            <g key={m}>
              <rect x={10 + i * 50} y={20} width={44} height={40} rx={6} className={`dg-fade ${splitTone[order[i]!]}`} strokeWidth={leaks[i] ? 3 : 1.2} />
              <text x={32 + i * 50} y={45} textAnchor="middle" fontSize={12} fontWeight={600}>{m}</text>
              {leaks[i] && <text x={32 + i * 50} y={78} textAnchor="middle" fontSize={10} style={{ fill: 'var(--color-bad)' }}>vê o futuro</text>}
            </g>
          ))}
          {[0, 1, 2].map((s) => (
            <g key={s}>
              <rect x={10 + s * 110} y={92} width={12} height={12} rx={2} className={splitTone[s]} />
              <text x={28 + s * 110} y={102} fontSize={11}>{splitName[s]}</text>
            </g>
          ))}
        </Svg>
      </div>
      <Callout tone={leakCount ? 'bad' : 'ok'} title={leakCount ? `${leakCount} meses de treino vêm depois de um mês de teste` : 'Treino sempre antes de validação e teste'} live>
        {leakCount
          ? 'O modelo aprende com padrões posteriores ao período que deveria prever. A métrica de teste fica otimista e despenca em produção: é data leakage.'
          : 'Treina no passado, ajusta na validação e mede no futuro que ele nunca viu — como acontecerá em produção.'}
      </Callout>
    </DiagramShell>
  )
}

