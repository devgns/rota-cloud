import { useState } from 'react'
import { Callout, Choices, DiagramShell, Svg, useSvgRefs } from './kit'

type ModeId = 'average' | 'peak' | 'elastic'

/** Instâncias necessárias em cada hora de um dia ilustrativo. */
const demand = [2, 2, 2, 2, 2, 2, 3, 4, 6, 7, 8, 9, 10, 9, 8, 7, 7, 8, 9, 10, 8, 5, 3, 2] as const

const modes: readonly { id: ModeId; label: string }[] = [
  { id: 'average', label: 'Fixa pela média' },
  { id: 'peak', label: 'Fixa pelo pico' },
  { id: 'elastic', label: 'Elástica (Auto Scaling)' },
]

function capacityAt(mode: ModeId, hour: number): number {
  if (mode === 'average') return 5
  if (mode === 'peak') return 10
  // Auto Scaling reage à métrica com um passo de atraso, sem descer abaixo de 2.
  const previous = demand[(hour + 23) % 24] ?? 2
  const current = demand[hour] ?? 2
  return Math.max(2, current > previous ? previous + Math.ceil((current - previous) / 2) : current)
}

const copy: Record<ModeId, { title: string; text: string; scalable: string; elastic: string }> = {
  average: {
    title: 'Faltou capacidade no pico',
    text: 'Cinco instâncias o dia inteiro. De madrugada sobra; no almoço e à noite a demanda passa do teto e usuários recebem lentidão ou erro.',
    scalable: 'Escalável, se alguém decidir aumentar',
    elastic: 'Não elástica',
  },
  peak: {
    title: 'Sem falta, com ociosidade paga',
    text: 'Dez instâncias o dia inteiro. É a solução “escalou uma vez”: tanto faz ter trocado por uma máquina maior (vertical) ou somado instâncias (horizontal). A área hachurada é capacidade paga sem uso.',
    scalable: 'Escalável',
    elastic: 'Não elástica: não volta a 2 depois',
  },
  elastic: {
    title: 'Capacidade segue a demanda nos dois sentidos',
    text: 'O Auto Scaling Group sobe para 10 instâncias no pico e volta a 2 de madrugada, conforme a métrica. A sobra é pequena e há um atraso curto na subida. O balanceador só distribui o tráfego entre as instâncias que existirem.',
    scalable: 'Escalável (horizontal)',
    elastic: 'Elástica',
  },
}

const W = 640
const H = 250
const left = 40
const right = 12
const top = 16
const bottom = 34
const plotW = W - left - right
const plotH = H - top - bottom
const maxY = 11
const colW = plotW / 24
const yOf = (value: number) => top + plotH - (value / maxY) * plotH

function Chart({ mode }: { mode: ModeId }) {
  const refs = useSvgRefs()
  return (
    <g>
      {[0, 2, 4, 6, 8, 10].map((tick) => (
        <g key={tick}>
          <line x1={left} x2={W - right} y1={yOf(tick)} y2={yOf(tick)} className="stroke-line" strokeWidth={1} />
          <text x={left - 8} y={yOf(tick) + 4} fontSize={11} textAnchor="end" className="dg-soft">
            {tick}
          </text>
        </g>
      ))}
      {demand.map((need, hour) => {
        const cap = capacityAt(mode, hour)
        const x = left + hour * colW
        const served = Math.min(need, cap)
        return (
          <g key={hour}>
            {/* demanda atendida */}
            <rect x={x + 2} y={yOf(served)} width={colW - 4} height={yOf(0) - yOf(served)} className="fill-navy dg-fade" opacity={0.85} />
            {/* demanda não atendida */}
            {need > cap && (
              <rect x={x + 2} y={yOf(need)} width={colW - 4} height={yOf(cap) - yOf(need)} fill={refs.hatchBad} className="stroke-bad dg-fade" strokeWidth={1} />
            )}
            {/* capacidade ociosa */}
            {cap > need && (
              <rect x={x + 2} y={yOf(cap)} width={colW - 4} height={yOf(need) - yOf(cap)} fill={refs.hatch} opacity={0.55} className="dg-fade" />
            )}
            {hour % 3 === 0 && (
              <text x={x + colW / 2} y={H - bottom + 16} fontSize={11} textAnchor="middle" className="dg-soft">
                {String(hour).padStart(2, '0')}h
              </text>
            )}
          </g>
        )
      })}
      <path
        d={demand
          .map((_, hour) => {
            const cap = capacityAt(mode, hour)
            const x0 = left + hour * colW
            return `${hour === 0 ? 'M' : 'L'}${x0},${yOf(cap)} L${x0 + colW},${yOf(cap)}`
          })
          .join(' ')}
        fill="none"
        className="stroke-amber dg-fade"
        strokeWidth={2.5}
      />
      <text x={left + 4} y={top + 10} fontSize={11} className="dg-soft">
        instâncias
      </text>
    </g>
  )
}

export function ScalingDiagram() {
  const [mode, setMode] = useState<ModeId>('average')
  const totals = demand.reduce(
    (acc, need, hour) => {
      const cap = capacityAt(mode, hour)
      return {
        paid: acc.paid + cap,
        idle: acc.idle + Math.max(0, cap - need),
        missing: acc.missing + Math.max(0, need - cap),
      }
    },
    { paid: 0, idle: 0, missing: 0 },
  )
  const info = copy[mode]

  return (
    <DiagramShell
      label="Gráfico de demanda e capacidade em 24 horas"
      kicker="Escalabilidade e elasticidade"
      title="Mesma demanda, três jeitos de prover capacidade"
      lead="As barras azuis são a demanda atendida; a linha laranja é a capacidade provisionada. Troque a estratégia e veja onde sobra ou falta."
      limits="Demanda e reação do Auto Scaling são ilustrativas: na prática há cooldown, aquecimento da instância e políticas diferentes (alvo, passo, agendada). Escala vertical costuma exigir parada para trocar o tipo da instância."
    >
      <Choices label="Estratégia de capacidade" options={modes} value={mode} onChange={setMode} />
      <div className="diagram-canvas">
        <Svg width={W} height={H} minWidth={460} title={`Demanda por hora versus capacidade, estratégia ${info.title}`}>
          <Chart mode={mode} />
        </Svg>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft" aria-hidden="true">
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-navy" /> demanda atendida</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-0.5 w-4 bg-amber" /> capacidade</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm border border-amber bg-amber-soft" /> ociosa (paga sem uso)</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm border border-bad bg-bad-soft" /> demanda não atendida</span>
      </div>
      <dl className="m-0 mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-md border border-line px-2 py-2">
          <dt className="text-xs text-ink-soft">Instância-hora paga</dt>
          <dd className="m-0 text-lg font-semibold tabular-nums">{totals.paid}</dd>
        </div>
        <div className="rounded-md border border-line px-2 py-2">
          <dt className="text-xs text-ink-soft">Ociosas</dt>
          <dd className="m-0 text-lg font-semibold tabular-nums">{totals.idle}</dd>
        </div>
        <div className={`rounded-md border px-2 py-2 ${totals.missing > 0 ? 'border-bad bg-bad-soft' : 'border-line'}`}>
          <dt className="text-xs text-ink-soft">Faltaram</dt>
          <dd className="m-0 text-lg font-semibold tabular-nums">{totals.missing}</dd>
        </div>
      </dl>
      <Callout tone={mode === 'elastic' ? 'ok' : mode === 'average' ? 'bad' : 'warn'} title={info.title} live>
        <p className="m-0">{info.text}</p>
        <p className="m-0 mt-2 flex flex-wrap gap-2">
          <span className="dg-chip">{info.scalable}</span>
          <span className="dg-chip">{info.elastic}</span>
        </p>
      </Callout>
    </DiagramShell>
  )
}
