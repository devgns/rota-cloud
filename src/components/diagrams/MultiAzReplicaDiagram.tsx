import { useState } from 'react'
import { Callout, Choices, DiagramShell, Svg, SvgArrow, SvgNode, useSvgRefs, type Rect, type Tone } from './kit'

type EventId = 'normal' | 'az' | 'reads'

const events: readonly { id: EventId; label: string }[] = [
  { id: 'normal', label: 'Dia normal' },
  { id: 'az', label: 'AZ a falha' },
  { id: 'reads', label: 'Pico de relatórios' },
]

const n: Record<'app' | 'reports' | 'primary' | 'standby' | 'replica', Rect> = {
  app: { x: 150, y: 8, w: 150, h: 42 },
  reports: { x: 400, y: 8, w: 180, h: 42 },
  primary: { x: 38, y: 140, w: 150, h: 52 },
  standby: { x: 245, y: 140, w: 150, h: 52 },
  replica: { x: 452, y: 140, w: 150, h: 52 },
}

/** Curva por baixo do standby, do primário até a réplica. */
function AsyncLink() {
  const refs = useSvgRefs()
  const x1 = n.primary.x + n.primary.w / 2
  const x2 = n.replica.x + n.replica.w / 2
  const y = n.primary.y + n.primary.h
  return (
    <g>
      <path d={`M${x1},${y} C${x1},${y + 46} ${x2},${y + 46} ${x2},${y + 2}`} fill="none" className="stroke-ink-soft" strokeWidth={1.4} strokeDasharray="5 4" markerEnd={refs.arrow} />
      <text x={(x1 + x2) / 2} y={y + 44} fontSize={11} textAnchor="middle" className="dg-soft">
        assíncrona
      </text>
    </g>
  )
}

function outcome(event: EventId, multiAz: boolean, replica: boolean): { tone: Tone; title: string; text: string } {
  if (event === 'normal') {
    return {
      tone: 'plain',
      title: 'Cada cópia tem um papel',
      text: `${multiAz ? 'O standby recebe cada gravação de forma síncrona e não atende consultas. ' : ''}${replica ? 'A read replica recebe as mudanças de forma assíncrona e atende leituras — pode ficar um pouco atrás.' : ''}${!multiAz && !replica ? 'Só existe o primário: uma AZ, uma cópia ativa.' : ''}`,
    }
  }
  if (event === 'az') {
    if (multiAz) return { tone: 'ok', title: 'Failover gerenciado', text: 'O standby vira primário e o mesmo endpoint passa a apontar para ele. Como a replicação era síncrona, não se perde gravação confirmada.' }
    if (replica) return { tone: 'warn', title: 'Dá para recuperar, mas não é automático', text: 'A réplica pode ser promovida como parte de um plano de recuperação. Ela não assume sozinha, a aplicação precisa trocar de endpoint e o que não replicou (assíncrono) pode se perder.' }
    return { tone: 'bad', title: 'Banco fora do ar', text: 'Sem standby nem réplica em outra AZ, resta restaurar de backup.' }
  }
  if (replica) return { tone: 'ok', title: 'Leituras desviadas para a réplica', text: 'Os relatórios apontam para o endpoint da read replica e o primário segue livre para as transações.' }
  if (multiAz) return { tone: 'bad', title: 'Primário sobrecarregado', text: 'O standby do Multi-AZ clássico não atende leitura: existe para failover. Mais capacidade de leitura pede read replica (ou cache).' }
  return { tone: 'bad', title: 'Primário sobrecarregado', text: 'Todas as consultas caem na mesma instância que grava.' }
}

export function MultiAzReplicaDiagram() {
  const [event, setEvent] = useState<EventId>('az')
  const [multiAz, setMultiAz] = useState(true)
  const [replica, setReplica] = useState(true)
  const result = outcome(event, multiAz, replica)
  const azDown = event === 'az'
  const promoted = azDown && multiAz
  const readsTo = event === 'reads' || event === 'normal' ? (replica ? 'replica' : 'primary') : null

  return (
    <DiagramShell
      label="RDS Multi-AZ e read replica diante de falha de AZ e pico de leitura"
      kicker="RDS"
      title="Multi-AZ é para cair em pé; read replica é para ler mais"
      lead="Ligue as cópias que quiser e dispare um evento. Repare em quem recebe tráfego e em como cada cópia é alimentada."
      limits="Modelo clássico cobrado na prova. Ofertas Multi-AZ de cluster podem ter leitoras; réplicas podem ficar em outra Região. Tempos de failover dependem do engine e da configuração."
    >
      <Choices label="Evento" options={events} value={event} onChange={setEvent} />
      <div className="choice-row" role="group" aria-label="Cópias configuradas">
        <button type="button" className="choice text-sm" aria-pressed={multiAz} onClick={() => setMultiAz((v) => !v)}>
          Standby Multi-AZ {multiAz ? 'ligado' : 'desligado'}
        </button>
        <button type="button" className="choice text-sm" aria-pressed={replica} onClick={() => setReplica((v) => !v)}>
          Read replica {replica ? 'ligada' : 'desligada'}
        </button>
      </div>
      <div className="diagram-canvas">
        <Svg width={640} height={250} minWidth={500} title={result.title}>
          {['AZ a', 'AZ b', 'AZ c'].map((label, i) => (
            <g key={label}>
              <rect x={14 + i * 207} y={96} width={198} height={146} rx={10} className={i === 0 && azDown ? 'fill-bad-soft stroke-bad' : 'fill-paper-raised stroke-line'} strokeDasharray="5 4" strokeWidth={i === 0 && azDown ? 2 : 1} />
              <text x={26 + i * 207} y={116} fontSize={12} fontWeight={600}>
                {label}
              </text>
            </g>
          ))}
          {/* replicação */}
          {multiAz && !azDown && <SvgArrow from={n.primary} to={n.standby} label="síncrona" />}
          {replica && !azDown && <AsyncLink />}
          {/* tráfego */}
          <SvgArrow from={n.app} to={promoted ? n.standby : n.primary} state={azDown && !multiAz ? 'bad' : 'hot'} label="grava e lê" />
          {readsTo && <SvgArrow from={n.reports} to={n[readsTo]} state={event === 'reads' && readsTo === 'primary' ? 'bad' : event === 'reads' ? 'hot' : 'idle'} label="consultas" />}
          <SvgNode {...n.app} label="Aplicação" tone="plain" />
          <SvgNode {...n.reports} label="Relatórios" sub="só leitura, pesados" tone={event === 'reads' ? 'warn' : 'plain'} />
          <SvgNode {...n.primary} label={azDown ? 'Primário ✕' : 'Primário'} sub="lê e grava" tone={azDown ? 'bad' : event === 'reads' && !replica ? 'bad' : 'focus'} />
          <SvgNode {...n.standby} label={promoted ? 'Novo primário' : 'Standby'} sub={promoted ? 'assumiu' : 'não atende leitura'} tone={!multiAz ? 'dim' : promoted ? 'ok' : 'plain'} dashed={!promoted} />
          <SvgNode {...n.replica} label="Read replica" sub="só leitura" tone={!replica ? 'dim' : event === 'reads' ? 'ok' : 'plain'} />
        </Svg>
      </div>
      <Callout tone={result.tone} title={result.title} live>
        {result.text}
      </Callout>
      <p className="mt-2 text-sm text-ink-soft">Pista de prova: “AZ falhou, failover automático” → Multi-AZ. “Banco saudável, lento por relatórios” → read replica.</p>
    </DiagramShell>
  )
}
