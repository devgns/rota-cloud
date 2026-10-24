import { useState } from 'react'
import { Callout, DiagramShell, Svg } from '@/components/diagrams/kit'
import { Meter, Range, num, pct } from './parts'

/* 18.1 / 18.5 — custo por tarefa concluída */

interface Model { price: number; success: number }

const perTask = (m: Model, review: number) => (m.price + (1 - m.success) * review) / m.success

export function CostPerTaskDiagram() {
  const [a, setA] = useState<Model>({ price: 0.02, success: 0.6 })
  const [b, setB] = useState<Model>({ price: 0.03, success: 0.95 })
  const [review, setReview] = useState(0)
  const ca = perTask(a, review)
  const cb = perTask(b, review)
  const max = Math.max(ca, cb)
  const cheaperCall = a.price <= b.price ? 'A' : 'B'
  const cheaperTask = ca <= cb ? 'A' : 'B'
  return (
    <DiagramShell
      label="Calculadora de custo por tarefa concluída corretamente"
      kicker="Custo real"
      title="O mais barato por chamada nem sempre é o mais barato por resultado"
      lead="Cada tentativa custa o preço da chamada; cada falha ainda pode exigir revisão humana. Ajuste e compare."
      limits="Valores hipotéticos (em US$). Supõe tentativas independentes e custo igual por tentativa; na prática falhas se correlacionam e há custos de busca, logs, rede e risco."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {([['A', a, setA], ['B', b, setB]] as const).map(([name, m, set]) => (
          <div key={name} className="dg-box" data-tone={cheaperTask === name ? 'ok' : 'plain'}>
            <p className="m-0 font-semibold">Modelo {name}</p>
            <Range label="Preço por chamada" min={0.005} max={0.06} step={0.005} value={m.price} onChange={(v) => set({ ...m, price: v })} display={`US$ ${num(m.price, 3)}`} />
            <Range label="Taxa de sucesso" min={0.3} max={1} step={0.05} value={m.success} onChange={(v) => set({ ...m, success: v })} display={pct(m.success)} />
          </div>
        ))}
      </div>
      <Range label="Revisão humana por tentativa que falha" min={0} max={2} step={0.1} value={review} onChange={setReview} display={`US$ ${num(review, 2)}`} />
      <div className="mt-3 grid gap-2">
        <Meter label="Modelo A · custo por tarefa concluída" value={ca / max} display={`US$ ${num(ca, 4)}`} tone={cheaperTask === 'A' ? 'ok' : 'bad'} />
        <Meter label="Modelo B · custo por tarefa concluída" value={cb / max} display={`US$ ${num(cb, 4)}`} tone={cheaperTask === 'B' ? 'ok' : 'bad'} />
      </div>
      <Callout tone={cheaperCall !== cheaperTask ? 'warn' : 'focus'} title={cheaperCall !== cheaperTask ? `Inverteu: ${cheaperCall} é mais barato por chamada, ${cheaperTask} por tarefa` : `${cheaperTask} vence nos dois critérios`} live>
        Fórmula: (preço + falhas × revisão) ÷ taxa de sucesso. {review > 0 ? 'Com revisão humana, cada ponto de taxa de sucesso pesa muito mais que o preço do token.' : 'Coloque um custo de revisão humana e veja a diferença crescer.'}
      </Callout>
    </DiagramShell>
  )
}

/* 18.2 — sob demanda × capacidade provisionada */

const ON_DEMAND = 12 // US$ por mil requisições
const PROVISIONED = 18_000 // US$ por mês
const CAPACITY = 2_500_000

export function ProvisionedBreakEvenDiagram() {
  const [volume, setVolume] = useState(800_000)
  const od = (volume / 1000) * ON_DEMAND
  const breakEven = (PROVISIONED / ON_DEMAND) * 1000
  const x = (v: number) => 50 + (v / 3_000_000) * 560
  const y = (c: number) => 200 - (c / 36_000) * 180
  const over = volume > CAPACITY
  const best = volume < breakEven ? 'sob demanda' : 'provisionado'
  return (
    <DiagramShell
      label="Ponto de equilíbrio entre preço sob demanda e capacidade provisionada"
      kicker="Previsibilidade de custo"
      title="Provisionado compensa só com volume alto e previsível"
      lead="Mova o volume mensal e compare a reta do sob demanda com o custo fixo do provisionado."
      limits={`Números hipotéticos: US$ ${ON_DEMAND} por mil requisições sob demanda; US$ ${num(PROVISIONED)}/mês por capacidade para até ${num(CAPACITY / 1e6, 1)} milhões. Ofertas reais variam por modelo e serviço.`}
    >
      <div className="diagram-canvas">
        <Svg width={640} height={240} minWidth={460} title="Gráfico de custo mensal por volume de requisições">
          <line x1={50} y1={200} x2={620} y2={200} className="stroke-ink-soft" />
          <line x1={50} y1={14} x2={50} y2={200} className="stroke-ink-soft" />
          {[0, 1, 2, 3].map((m) => <text key={m} x={x(m * 1e6)} y={216} fontSize={10} textAnchor="middle" className="dg-soft">{m} mi</text>)}
          {[0, 12_000, 24_000, 36_000].map((c) => <text key={c} x={44} y={y(c) + 4} fontSize={10} textAnchor="end" className="dg-soft">{c / 1000}k</text>)}
          <line x1={x(0)} y1={y(0)} x2={x(3_000_000)} y2={y(36_000)} className="stroke-navy" strokeWidth={2.5} />
          <line x1={x(0)} y1={y(PROVISIONED)} x2={x(CAPACITY)} y2={y(PROVISIONED)} className="stroke-amber" strokeWidth={2.5} />
          <line x1={x(CAPACITY)} y1={y(PROVISIONED)} x2={x(CAPACITY)} y2={y(PROVISIONED) - 30} className="stroke-amber" strokeDasharray="4 3" />
          <text x={x(CAPACITY) + 4} y={y(PROVISIONED) - 20} fontSize={10} className="dg-soft">limite de capacidade</text>
          <text x={x(2_700_000)} y={y(34_000)} fontSize={11} fontWeight={600} textAnchor="end">sob demanda</text>
          <text x={x(200_000)} y={y(PROVISIONED) - 6} fontSize={11} fontWeight={600}>provisionado (fixo)</text>
          <circle cx={x(breakEven)} cy={y(PROVISIONED)} r={5} className="fill-paper stroke-ink" strokeWidth={2} />
          <text x={x(breakEven)} y={y(PROVISIONED) + 18} fontSize={10} textAnchor="middle">equilíbrio {num(breakEven / 1e6, 1)} mi</text>
          <g className="dg-move" style={{ transform: `translateX(${x(volume)}px)` }}>
            <line x1={0} y1={14} x2={0} y2={200} className="stroke-ink" strokeDasharray="3 3" />
          </g>
        </Svg>
      </div>
      <Range label="Requisições por mês" min={100_000} max={3_000_000} step={100_000} value={volume} onChange={setVolume} display={`${num(volume / 1e6, 1)} milhão(ões)`} />
      <Callout tone={over ? 'bad' : best === 'provisionado' ? 'ok' : 'focus'} title={`Sob demanda: US$ ${num(od)} · Provisionado: US$ ${num(PROVISIONED)}`} live>
        {over
          ? 'Acima da capacidade reservada: seria preciso reservar mais unidades ou mandar o excedente para sob demanda.'
          : best === 'sob demanda'
            ? `Abaixo de ${num(breakEven / 1e6, 1)} milhão, a capacidade provisionada fica ociosa: você paga pelo compromisso mesmo sem uso.`
            : 'Volume alto e estável: o custo fixo dilui e você ganha capacidade previsível. Se a demanda cair, o compromisso continua.'}
      </Callout>
    </DiagramShell>
  )
}
