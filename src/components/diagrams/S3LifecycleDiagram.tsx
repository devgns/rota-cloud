import { useId, useState } from 'react'
import { Callout, Choices, DiagramShell, Svg } from './kit'

type Rule = 'lifecycle' | 'none'

interface Tier {
  id: string
  name: string
  from: number
  to: number
  share: number
  read: string
  store: number
  note: string
}

const RETENTION = 1825

const tiers: readonly Tier[] = [
  { id: 'std', name: 'S3 Standard', from: 0, to: 30, share: 0.2, read: 'imediata', store: 4, note: 'Fase de acesso frequente: relatório recém-gerado, baixado várias vezes.' },
  { id: 'ia', name: 'S3 Standard-IA', from: 30, to: 365, share: 0.3, read: 'imediata, com taxa por GB lido', store: 2, note: 'Acesso raro, mas quando acontece precisa ser rápido. Guardar fica mais barato; ler passa a custar, e há duração mínima.' },
  { id: 'glacier', name: 'S3 Glacier Flexible Retrieval', from: 365, to: RETENTION, share: 0.4, read: 'minutos a horas, conforme o modo', store: 1, note: 'Arquivo de auditoria: quase ninguém lê. Se precisar de leitura imediata no arquivo, a classe seria Glacier Instant Retrieval.' },
  { id: 'gone', name: 'Expirado', from: RETENTION, to: 2200, share: 0.1, read: 'não existe mais', store: 0, note: 'Passado o prazo legal de retenção, a regra apaga o objeto. Guardar além disso é custo — e às vezes risco.' },
]

const stops = [1, 15, 29, 45, 120, 300, 400, 900, 1500, 1900] as const

function xFor(age: number, left: number, width: number): number {
  let x = left
  for (const tier of tiers) {
    const w = tier.share * width
    if (age <= tier.to) return x + ((age - tier.from) / (tier.to - tier.from)) * w
    x += w
  }
  return left + width
}

function ageLabel(days: number): string {
  if (days < 60) return `${days} dias`
  if (days < 365) return `${Math.round(days / 30)} meses`
  const years = days / 365
  return `${years.toFixed(years < 2 ? 1 : 0).replace('.', ',')} anos`
}

export function S3LifecycleDiagram() {
  const id = useId()
  const [rule, setRule] = useState<Rule>('lifecycle')
  const [stop, setStop] = useState(1)
  const age = stops[stop] ?? 1
  const tier = rule === 'none' ? tiers[0]! : tiers.find((t) => age < t.to) ?? tiers[3]!
  const W = 640
  const left = 16
  const width = W - 32

  return (
    <DiagramShell
      label="Linha do tempo de um objeto no S3 com regra de lifecycle"
      kicker="S3 lifecycle"
      title="Um relatório envelhece; a classe acompanha"
      lead="Arraste a idade do objeto. Com a regra, ele desce de classe sozinho e expira no prazo legal. Sem a regra, fica em Standard para sempre."
      limits="Prazos do exemplo do capítulo (30 dias, 12 meses, retenção ilustrativa de 5 anos). Preços, durações mínimas e tempos de recuperação mudam por classe e Região; aqui só a ordem relativa. Intelligent-Tiering faria a movimentação por padrão de acesso, sem regra por idade."
    >
      <Choices
        label="Regra do bucket"
        options={[
          { id: 'lifecycle', label: 'Com lifecycle' },
          { id: 'none', label: 'Sem lifecycle' },
        ]}
        value={rule}
        onChange={setRule}
      />
      <div className="diagram-canvas">
        <Svg width={W} height={112} minWidth={480} title={`Objeto com ${ageLabel(age)} em ${tier.name}`}>
          {rule === 'lifecycle' ? (
            tiers.map((t, i) => {
              const x0 = xFor(t.from, left, width)
              const x1 = xFor(t.to, left, width)
              const tones = ['fill-navy', 'fill-navy-soft', 'fill-navy-wash', 'fill-paper']
              const isCurrent = t.id === tier.id
              return (
                <g key={t.id}>
                  <rect x={x0} y={24} width={x1 - x0 - 2} height={34} rx={4} className={`${tones[i]} ${t.id === 'gone' ? 'stroke-line' : 'stroke-navy'} dg-fade`} strokeDasharray={t.id === 'gone' ? '4 3' : undefined} strokeWidth={isCurrent ? 3 : 1} />
                  <text x={(x0 + x1) / 2} y={45} fontSize={11} textAnchor="middle" fontWeight={600} style={i < 2 ? { fill: 'var(--color-paper)' } : undefined}>
                    {t.id === 'glacier' ? 'Glacier Flexible' : t.name.replace('S3 ', '')}
                  </text>
                </g>
              )
            })
          ) : (
            <g>
              <rect x={left} y={24} width={width} height={34} rx={4} className="fill-navy stroke-navy" />
              <text x={left + width / 2} y={45} fontSize={11} textAnchor="middle" fontWeight={600} style={{ fill: 'var(--color-paper)' }}>
                Standard — para sempre
              </text>
            </g>
          )}
          {[0, 30, 365, RETENTION].map((d) => (
            <text key={d} x={xFor(d, left, width)} y={76} fontSize={10} textAnchor={d === 0 ? 'start' : 'middle'} className="dg-soft">
              {d === 0 ? 'criado' : d === 30 ? '30 dias' : d === 365 ? '12 meses' : 'retenção legal'}
            </text>
          ))}
          <g className="dg-move" style={{ transform: `translateX(${xFor(age, left, width)}px)` }}>
            <line x1={0} x2={0} y1={14} y2={66} className="stroke-amber" strokeWidth={3} />
            <circle cx={0} cy={12} r={6} className="fill-amber" />
          </g>
          <text x={W - 16} y={102} fontSize={11} textAnchor="end" className="dg-soft">
            idade do objeto →
          </text>
        </Svg>
      </div>
      <label htmlFor={id} className="mt-2 block text-sm font-semibold">
        Idade do objeto: <span className="tabular-nums">{ageLabel(age)}</span>
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={stops.length - 1}
        step={1}
        value={stop}
        aria-valuetext={ageLabel(age)}
        onChange={(event) => setStop(Math.min(stops.length - 1, Math.max(0, Number(event.currentTarget.value) || 0)))}
        className="w-full accent-[var(--color-amber)]"
      />
      <dl className="m-0 mt-2 grid grid-cols-3 gap-2 text-sm">
        <div className="dg-box">
          <dt className="text-xs text-ink-soft">Classe agora</dt>
          <dd className="m-0 font-semibold">{tier.name}</dd>
        </div>
        <div className="dg-box">
          <dt className="text-xs text-ink-soft">Leitura</dt>
          <dd className="m-0 font-semibold">{tier.read}</dd>
        </div>
        <div className="dg-box">
          <dt className="text-xs text-ink-soft">Custo de guardar (relativo)</dt>
          <dd className="m-0 font-semibold" aria-label={`${tier.store} de 4`}>
            {tier.store === 0 ? '—' : '$'.repeat(tier.store)}
            <span className="opacity-30">{'$'.repeat(tier.store === 0 ? 0 : 4 - tier.store)}</span>
          </dd>
        </div>
      </dl>
      {rule === 'none' ? (
        <Callout tone={age > RETENTION ? 'bad' : age > 30 ? 'warn' : 'plain'} title={age > RETENTION ? 'Passou do prazo e o objeto ainda está aqui' : age > 30 ? 'Pagando classe quente por dado frio' : 'Por enquanto, Standard faz sentido'} live>
          {age > RETENTION
            ? 'Sem expiração, ninguém apaga. O custo acumula e o dado fica além da retenção definida.'
            : age > 30
              ? 'O acesso caiu, mas o objeto segue na classe mais cara de guardar. Mover milhares de objetos à mão todo mês não escala; é para isso que existe a regra.'
              : 'Nos primeiros dias o acesso é frequente e Standard é a classe adequada.'}
        </Callout>
      ) : (
        <Callout tone={tier.id === 'gone' ? 'ok' : 'focus'} title={tier.name} live>
          {tier.note}
        </Callout>
      )}
      <p className="mt-2 text-sm text-ink-soft">A classe mais barata por GB nem sempre é a de menor custo total: taxas de recuperação, duração mínima e tamanho mínimo cobrado entram na conta.</p>
    </DiagramShell>
  )
}
