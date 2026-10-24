import { useMemo, useState } from 'react'
import { Callout, DiagramShell, Svg } from '@/components/diagrams/kit'
import { Meter, Range, num, pct } from './parts'

/*
 * 1.000 transações, 100 fraudes. Os scores são quantis de duas logísticas escolhidas para que,
 * no limiar 52,5, a matriz seja exatamente a do exemplo 6.4: TP 80, FN 20, FP 90, TN 810.
 */
const quantiles = (n: number, mu: number, s: number) => Array.from({ length: n }, (_, i) => {
  const p = (i + 0.5) / n
  return mu + s * Math.log(p / (1 - p))
})
const FRAUD = quantiles(100, 65, 12.5 / Math.log(4))
const LEGIT = quantiles(900, 35, 17.5 / Math.log(9))
const EXAMPLE = 52.5
const NEVER = 100

const COST_FN = 300
const COST_FP = 30

function confusion(threshold: number) {
  const tp = threshold >= NEVER ? 0 : FRAUD.filter((s) => s >= threshold).length
  const fp = threshold >= NEVER ? 0 : LEGIT.filter((s) => s >= threshold).length
  const fn = 100 - tp
  const tn = 900 - fp
  const precision = tp + fp ? tp / (tp + fp) : 0
  const recall = tp / 100
  const accuracy = (tp + tn) / 1000
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0
  return { tp, fp, fn, tn, precision, recall, accuracy, f1, cost: fn * COST_FN + fp * COST_FP }
}

function histogram(scores: readonly number[]) {
  const bins = Array.from({ length: 20 }, () => 0)
  for (const s of scores) bins[Math.max(0, Math.min(19, Math.floor(s / 5)))]! += 1
  return bins
}
const H_FRAUD = histogram(FRAUD)
const H_LEGIT = histogram(LEGIT)

function Cell({ label, value, tone, hint }: { label: string; value: number; tone: 'ok' | 'bad'; hint: string }) {
  return (
    <div className="dg-box text-center" data-tone={tone}>
      <p className="m-0 text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="m-0 font-serif text-2xl tabular-nums">{value}</p>
      <p className="m-0 text-xs text-ink-soft">{hint}</p>
    </div>
  )
}

export function ConfusionMatrixDiagram() {
  const [threshold, setThreshold] = useState(EXAMPLE)
  const m = useMemo(() => confusion(threshold), [threshold])
  const best = useMemo(() => {
    let pick = { t: 0, cost: Infinity }
    for (let t = 0; t <= 100; t += 0.5) {
      const cost = confusion(t).cost
      if (cost < pick.cost) pick = { t, cost }
    }
    return pick
  }, [])
  const never = threshold >= NEVER
  const x = (score: number) => 20 + (Math.min(100, score) / 100) * 600
  const peak = Math.max(...H_LEGIT)
  return (
    <DiagramShell
      label="Simulador de matriz de confusão com limiar de decisão"
      kicker="Simulador · métricas"
      title="Mova o limiar e veja as quatro métricas brigarem"
      lead="Cada transação recebe um score de risco de 0 a 100. Acima do limiar, o sistema acusa fraude."
      limits="Distribuições sintéticas e custos hipotéticos (R$ 300 por fraude perdida, R$ 30 por bloqueio indevido). Em produção, o limiar também considera revisão humana, ética e regulação."
    >
      <div className="choice-row" role="group" aria-label="Exemplos prontos">
        <button type="button" className="choice text-sm" aria-pressed={threshold === EXAMPLE} onClick={() => setThreshold(EXAMPLE)}>Exemplo da seção 6.4</button>
        <button type="button" className="choice text-sm" aria-pressed={never} onClick={() => setThreshold(NEVER)}>Regra que nunca acusa</button>
        <button type="button" className="choice text-sm" aria-pressed={threshold === 30} onClick={() => setThreshold(30)}>Limiar agressivo (30)</button>
        <button type="button" className="choice text-sm" aria-pressed={threshold === best.t} onClick={() => setThreshold(best.t)}>Menor custo total</button>
      </div>
      <div className="diagram-canvas">
        <Svg width={640} height={170} minWidth={440} title="Histogramas dos scores de transações legítimas e fraudulentas com a linha do limiar">
          {H_LEGIT.map((count, i) => <rect key={`l${i}`} x={x(i * 5) + 2} y={120 - (count / peak) * 100} width={13} height={(count / peak) * 100} className="fill-navy-wash stroke-navy" strokeWidth={0.8} />)}
          {H_FRAUD.map((count, i) => <rect key={`f${i}`} x={x(i * 5) + 15} y={120 - (count / peak) * 100 * 3} width={13} height={(count / peak) * 100 * 3} className="fill-bad-soft stroke-bad" strokeWidth={0.8} />)}
          <line x1={20} y1={120} x2={620} y2={120} className="stroke-ink-soft" />
          {[0, 25, 50, 75, 100].map((v) => <text key={v} x={x(v)} y={136} fontSize={10} textAnchor="middle" className="dg-soft">{v}</text>)}
          {!never && (
            <g className="dg-move" style={{ transform: `translateX(${x(threshold)}px)` }}>
              <line x1={0} y1={8} x2={0} y2={124} className="stroke-amber" strokeWidth={2.5} />
              <text x={4} y={18} fontSize={11} fontWeight={700}>limiar {num(threshold, 1)}</text>
              <text x={4} y={32} fontSize={10} className="dg-soft">acusa →</text>
            </g>
          )}
          <rect x={20} y={150} width={10} height={10} className="fill-navy-wash stroke-navy" /><text x={36} y={159} fontSize={11}>900 legítimas</text>
          <rect x={140} y={150} width={10} height={10} className="fill-bad-soft stroke-bad" /><text x={156} y={159} fontSize={11}>100 fraudes (altura ×3 para aparecer)</text>
        </Svg>
      </div>
      <Range label="Limiar de decisão" min={0} max={NEVER} step={0.5} value={threshold} onChange={setThreshold} display={never ? 'nunca acusa' : num(threshold, 1)} />
      <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-1.5 text-xs">
            <span />
            <span className="text-center font-semibold">Real: fraude</span>
            <span className="text-center font-semibold">Real: legítima</span>
            <span className="font-semibold [writing-mode:vertical-rl] rotate-180">Previu fraude</span>
            <Cell label="TP" value={m.tp} tone="ok" hint="fraude pega" />
            <Cell label="FP" value={m.fp} tone="bad" hint="cliente bloqueado" />
            <span className="font-semibold [writing-mode:vertical-rl] rotate-180">Previu legítima</span>
            <Cell label="FN" value={m.fn} tone="bad" hint="fraude passou" />
            <Cell label="TN" value={m.tn} tone="ok" hint="liberada certo" />
          </div>
        </div>
        <div className="grid content-start gap-2">
          <Meter label="Accuracy" value={m.accuracy} display={pct(m.accuracy, 1)} tone="plain" hint="(TP+TN)/total" />
          <Meter label="Precision" value={m.precision} display={pct(m.precision, 1)} tone="warn" hint="dos alertas, quantos eram fraude" />
          <Meter label="Recall" value={m.recall} display={pct(m.recall, 1)} tone="focus" hint="das fraudes, quantas foram pegas" />
          <Meter label="F1" value={m.f1} display={pct(m.f1, 1)} tone="ok" hint="média harmônica de precision e recall" />
        </div>
      </div>
      <Callout tone={never || m.recall < 0.5 ? 'bad' : m.precision < 0.3 ? 'warn' : 'focus'} title={`Custo dos erros: R$ ${num(m.cost)}`} live>
        {never
          ? 'Accuracy de 90% e recall zero: nenhuma fraude encontrada. É por isso que accuracy isolada engana em classe rara.'
          : m.precision < 0.3
            ? `Quase toda fraude é pega (recall ${pct(m.recall)}), mas ${m.fp} clientes honestos são bloqueados. FP caro? Priorize precision.`
            : `Com ${m.fn} fraudes perdidas e ${m.fp} bloqueios indevidos. O menor custo total aparece por volta do limiar ${num(best.t, 1)} (R$ ${num(best.cost)}) — não no ponto de maior accuracy.`}
      </Callout>
    </DiagramShell>
  )
}
