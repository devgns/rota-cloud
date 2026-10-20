import { useId, useState } from 'react'
import { Callout, DiagramShell, Svg } from './kit'

type StrategyId = 'backup' | 'pilot' | 'warm' | 'active'

/** Escala ordinal: ordens de grandeza, não números garantidos. */
const scale = ['≈ 0', 'segundos', 'minutos', 'dezenas de min', 'horas', '1 dia ou mais'] as const

interface Strategy {
  id: StrategyId
  name: string
  cost: number
  rpo: readonly [number, number]
  rto: readonly [number, number]
  idea: string
  ready: readonly [boolean, boolean, boolean, boolean]
}

const strategies: readonly Strategy[] = [
  {
    id: 'backup',
    name: 'Backup and restore',
    cost: 1,
    rpo: [3, 4],
    rto: [4, 5],
    idea: 'Só as cópias existem no destino. No desastre, a infraestrutura é recriada e os dados restaurados.',
    ready: [true, false, false, false],
  },
  {
    id: 'pilot',
    name: 'Pilot light',
    cost: 2,
    rpo: [1, 2],
    rto: [2, 3],
    idea: 'O núcleo — dados replicados e banco — já está ligado. A aplicação é provisionada na hora.',
    ready: [true, true, false, false],
  },
  {
    id: 'warm',
    name: 'Warm standby',
    cost: 3,
    rpo: [1, 2],
    rto: [1, 2],
    idea: 'Uma cópia reduzida e funcional roda o tempo todo. No desastre, recebe tráfego e escala.',
    ready: [true, true, true, false],
  },
  {
    id: 'active',
    name: 'Multi-site active/active',
    cost: 4,
    rpo: [0, 1],
    rto: [0, 1],
    idea: 'Os dois sites atendem produção ao mesmo tempo. A falha de um desvia o tráfego para o outro.',
    ready: [true, true, true, true],
  },
]

const readyLabels = ['Dados copiados', 'Banco ligado', 'App rodando', 'Recebe tráfego'] as const

const W = 640
const H = 150
const mid = W / 2
const step = (W / 2 - 30) / 5

function Timeline({ strategy, rpoReq, rtoReq }: { strategy: Strategy; rpoReq: number; rtoReq: number }) {
  const rpoFits = strategy.rpo[1] <= rpoReq
  const rtoFits = strategy.rto[1] <= rtoReq
  const xLeft = (v: number) => mid - v * step
  const xRight = (v: number) => mid + v * step
  return (
    <>
      <text x={mid - 8} y={16} fontSize={12} textAnchor="end" fontWeight={600}>
        ← dados perdidos (RPO)
      </text>
      <text x={mid + 8} y={16} fontSize={12} fontWeight={600}>
        tempo fora do ar (RTO) →
      </text>
      {/* tolerância do negócio */}
      <rect x={xLeft(rpoReq)} y={28} width={mid - xLeft(rpoReq)} height={34} className="fill-navy-wash stroke-navy dg-fade" strokeDasharray="4 3" />
      <rect x={mid} y={28} width={xRight(rtoReq) - mid} height={34} className="fill-navy-wash stroke-navy dg-fade" strokeDasharray="4 3" />
      <text x={mid - 6} y={50} fontSize={11} textAnchor="end" className="dg-soft">
        tolerado
      </text>
      <text x={mid + 6} y={50} fontSize={11} className="dg-soft">
        tolerado
      </text>
      {/* faixa típica da estratégia */}
      <rect
        x={xLeft(strategy.rpo[1])}
        y={70}
        width={Math.max(4, (strategy.rpo[1] - strategy.rpo[0]) * step + 4)}
        height={22}
        rx={4}
        className={`${rpoFits ? 'fill-ok stroke-ok' : 'fill-bad stroke-bad'} dg-fade`}
        opacity={0.8}
      />
      <rect
        x={xRight(strategy.rto[0]) - 2}
        y={70}
        width={Math.max(4, (strategy.rto[1] - strategy.rto[0]) * step + 4)}
        height={22}
        rx={4}
        className={`${rtoFits ? 'fill-ok stroke-ok' : 'fill-bad stroke-bad'} dg-fade`}
        opacity={0.8}
      />
      {/* eixo */}
      <line x1={20} x2={W - 20} y1={108} y2={108} className="stroke-ink-soft" strokeWidth={1.2} />
      {scale.map((label, i) =>
        i === 0 ? null : (
          <g key={label}>
            <line x1={xLeft(i)} x2={xLeft(i)} y1={104} y2={112} className="stroke-ink-soft" />
            <line x1={xRight(i)} x2={xRight(i)} y1={104} y2={112} className="stroke-ink-soft" />
            <text x={xLeft(i)} y={126} fontSize={10} textAnchor="middle" className="dg-soft">
              {label}
            </text>
            <text x={xRight(i)} y={126} fontSize={10} textAnchor="middle" className="dg-soft">
              {label}
            </text>
          </g>
        ),
      )}
      <line x1={mid} x2={mid} y1={24} y2={116} className="stroke-bad" strokeWidth={2.5} />
      <text x={mid} y={144} fontSize={12} textAnchor="middle" fontWeight={600} className="fill-bad" style={{ fill: 'var(--color-bad)' }}>
        desastre
      </text>
    </>
  )
}

function Slider({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        aria-valuetext={scale[value]}
        onChange={(event) => onChange(Math.min(5, Math.max(0, Number(event.currentTarget.value) || 0)))}
        className="mt-1 w-full accent-[var(--color-navy)]"
      />
      <output htmlFor={id} className="block text-sm tabular-nums text-ink-soft">
        até {scale[value]}
      </output>
    </div>
  )
}

export function DisasterRecoveryDiagram() {
  const baseId = useId()
  const [rpoReq, setRpoReq] = useState(2)
  const [rtoReq, setRtoReq] = useState(3)
  const fits = (item: Strategy) => item.rpo[1] <= rpoReq && item.rto[1] <= rtoReq
  const cheapest = strategies.find(fits) ?? strategies[3]!
  const [selectedId, setSelectedId] = useState<StrategyId | null>(null)
  const selected = strategies.find((item) => item.id === selectedId) ?? cheapest

  return (
    <DiagramShell
      label="Linha do tempo de RPO e RTO com estratégias de disaster recovery"
      kicker="Recuperação de desastres"
      title="RPO olha para trás, RTO olha para frente"
      lead="Defina o que o negócio tolera. A faixa colorida mostra a ordem de grandeza típica da estratégia: verde cabe, vermelho não."
      limits="As faixas são ordens de grandeza didáticas, não números da AWS. Nenhuma estratégia garante RTO/RPO por si: o resultado depende de testes, automação, DNS e de cada serviço. Multi-site não significa zero."
    >
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider id={`${baseId}-rpo`} label="Perda de dados tolerada (RPO)" value={rpoReq} onChange={setRpoReq} />
        <Slider id={`${baseId}-rto`} label="Tempo fora do ar tolerado (RTO)" value={rtoReq} onChange={setRtoReq} />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4" role="group" aria-label="Estratégia">
        {strategies.map((item) => {
          const ok = fits(item)
          const isSelected = item.id === selected.id
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedId(item.id)}
              className={`cursor-pointer rounded-md border px-2 py-2 text-left text-sm transition-colors ${isSelected ? '' : ok ? 'border-ok' : 'border-line opacity-70'}`}
            >
              <span className="block font-semibold">{item.name}</span>
              <span className="mt-0.5 block text-xs" aria-label={`custo relativo ${item.cost} de 4`}>
                {'$'.repeat(item.cost)}
                <span className="opacity-30">{'$'.repeat(4 - item.cost)}</span>
                {item.id === cheapest.id && ok ? ' · mais barata que cabe' : ok ? ' · cabe' : ' · não cabe'}
              </span>
            </button>
          )
        })}
      </div>
      <div className="diagram-canvas">
        <Svg width={W} height={H} minWidth={500} title={`Linha do tempo para ${selected.name}`}>
          <Timeline strategy={selected} rpoReq={rpoReq} rtoReq={rtoReq} />
        </Svg>
      </div>
      <div className="mt-2">
        <p className="m-0 text-xs font-semibold uppercase tracking-wide text-ink-soft">No site de recuperação, antes do desastre</p>
        <ul className="m-0 mt-1 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-4">
          {readyLabels.map((label, i) => {
            const on = selected.ready[i]
            return (
              <li key={label} className="dg-box text-center text-sm" data-tone={on ? 'ok' : 'dim'}>
                {on ? '● ' : '○ '}
                {label}
              </li>
            )
          })}
        </ul>
      </div>
      <Callout tone={fits(selected) ? 'ok' : 'bad'} title={`${selected.name}: ${fits(selected) ? 'atende' : 'não atende'} o que foi definido`} live>
        {selected.idea}
        {!fits(selected) && selected.id !== cheapest.id && ` A mais barata que atende é ${cheapest.name}.`}
        {!fits(cheapest) && ' Nenhuma faixa típica cabe nesses limites; reveja o requisito ou o investimento.'}
      </Callout>
      <p className="mt-2 text-sm text-ink-soft">Backup não é alta disponibilidade: ele restaura depois, não evita a queda.</p>
    </DiagramShell>
  )
}
