import { useState } from 'react'
import { Callout, Choices, DiagramShell } from './kit'

type ScenarioId = 'api' | 'business' | 'batch' | 'lab'
type OfferId = 'ondemand' | 'commit' | 'spot'

interface Scenario {
  id: ScenarioId
  label: string
  hours: number
  interruptible: boolean
  /** Horas ligadas numa semana típica: [dia 0-6] → [hora inicial, hora final). */
  week: (day: number, hour: number) => boolean
  note: string
}

const scenarios: readonly Scenario[] = [
  { id: 'api', label: 'API 24/7 previsível', hours: 720, interruptible: false, week: () => true, note: 'Ligada o mês inteiro e não pode cair: o compromisso compensa porque toda hora comprometida é usada.' },
  {
    id: 'business',
    label: 'Sistema interno 08h–21h, dias úteis',
    hours: 286,
    interruptible: false,
    week: (day, hour) => day < 5 && hour >= 8 && hour < 21,
    note: 'Desligar fora do horário corta a computação On-Demand. Um compromisso cobriria as 720 horas e sairia mais caro — a armadilha do “13/24 do custo”.',
  },
  {
    id: 'batch',
    label: 'Batch noturno reprocessável',
    hours: 210,
    interruptible: true,
    week: (_day, hour) => hour < 7,
    note: 'Se uma instância for interrompida, o trabalho recomeça do último ponto. Spot é a opção mais barata quando a interrupção é aceitável.',
  },
  {
    id: 'lab',
    label: 'Aula prática ocasional',
    hours: 20,
    interruptible: false,
    week: (day, hour) => (day === 1 || day === 3) && hour >= 19 && hour < 21,
    note: 'Pouco uso, sem previsibilidade e com hora marcada: On-Demand, pagando só o tempo ligado.',
  },
]

const offers: readonly { id: OfferId; name: string; rate: string }[] = [
  { id: 'ondemand', name: 'On-Demand', rate: '100 créditos por hora ligada' },
  { id: 'commit', name: 'Savings Plans / Reserved', rate: '70 por hora, nas 720 horas do mês (compromisso de 1 ou 3 anos)' },
  { id: 'spot', name: 'Spot', rate: '35 por hora ligada, se a interrupção for aceitável' },
]

function costOf(offer: OfferId, scenario: Scenario): number | null {
  if (offer === 'ondemand') return scenario.hours * 100
  if (offer === 'commit') return 720 * 70
  return scenario.interruptible ? scenario.hours * 35 : null
}

const days = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom']

export function PricingDiagram() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('business')
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0]!
  const costs = offers.map((offer) => ({ offer, cost: costOf(offer.id, scenario) }))
  const valid = costs.filter((item): item is { offer: (typeof offers)[number]; cost: number } => item.cost !== null)
  const best = valid.reduce((a, b) => (b.cost < a.cost ? b : a))
  const max = Math.max(...valid.map((item) => item.cost))

  return (
    <DiagramShell
      label="Comparação de modelos de compra do EC2 com créditos fictícios por perfil de uso"
      kicker="Compra de compute"
      title="O perfil de uso escolhe o modelo"
      lead="Créditos fictícios, não preços AWS: 100 por hora On-Demand, 70 com compromisso, 35 no Spot. Troque o perfil e veja o total do mês."
      limits="Proporções inventadas para comparar intenções. Na vida real o compromisso pode cobrir só a base da carga, e o resto fica On-Demand ou Spot. Sistema operacional, Região, transferência e armazenamento ficam fora."
    >
      <Choices label="Perfil de uso" options={scenarios} value={scenario.id} onChange={setScenarioId} />
      <div className="diagram-canvas">
        <div className="min-w-[30rem]">
          <p className="m-0 text-xs font-semibold uppercase tracking-wide text-ink-soft">Semana típica · {scenario.hours} h ligadas no mês</p>
          <div className="mt-1 grid gap-0.5" role="img" aria-label={`Instância ligada ${scenario.hours} horas por mês`}>
            {days.map((day, d) => (
              <div key={day} className="grid grid-cols-[2.2rem_repeat(24,1fr)] items-center gap-0.5">
                <span className="text-[0.7rem] text-ink-soft">{day}</span>
                {Array.from({ length: 24 }, (_, h) => (
                  <span key={h} className={`h-3 rounded-[2px] transition-colors ${scenario.week(d, h) ? 'bg-navy' : 'bg-line'}`} />
                ))}
              </div>
            ))}
            <div className="grid grid-cols-[2.2rem_repeat(24,1fr)] gap-0.5 text-[0.65rem] text-ink-soft">
              <span />
              {Array.from({ length: 24 }, (_, h) => (
                <span key={h} className="text-center">{h % 6 === 0 ? `${h}h` : ''}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ul className="m-0 mt-3 grid list-none gap-2 p-0">
        {costs.map(({ offer, cost }) => {
          const isBest = cost !== null && offer.id === best.offer.id
          return (
            <li key={offer.id} className="dg-box" data-tone={cost === null ? 'dim' : isBest ? 'ok' : 'plain'}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-semibold">
                  {offer.name}
                  {isBest && ' · menor custo'}
                </span>
                <span className="tabular-nums">{cost === null ? 'não serve: não aceita interrupção' : `${cost.toLocaleString('pt-BR')} créditos/mês`}</span>
              </div>
              <div className="mt-1 h-2.5 rounded-full bg-line">
                {cost !== null && <div className={`h-2.5 rounded-full transition-[width] duration-300 ${isBest ? 'bg-ok' : 'bg-navy-soft'}`} style={{ width: `${(cost / max) * 100}%` }} />}
              </div>
              <p className="m-0 mt-1 text-xs text-ink-soft">{offer.rate}</p>
            </li>
          )
        })}
      </ul>
      <Callout tone="ok" title={`${best.offer.name} vence neste perfil`} live>
        {scenario.note}
      </Callout>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div className="dg-box">
          <p className="m-0 font-semibold">On-Demand Capacity Reservations</p>
          <p className="m-0 mt-0.5 text-ink-soft">Não é desconto: garante capacidade numa AZ específica. Cobra enquanto reservada, usando ou não.</p>
        </div>
        <div className="dg-box">
          <p className="m-0 font-semibold">Dedicated Hosts</p>
          <p className="m-0 mt-0.5 text-ink-soft">Não é desconto: servidor físico só seu, para licença por soquete/núcleo ou isolamento exigido.</p>
        </div>
      </div>
    </DiagramShell>
  )
}
