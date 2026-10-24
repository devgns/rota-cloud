import { useState } from 'react'
import { Callout, DiagramShell } from '@/components/diagrams/kit'
import { Meter, Range, num, pct } from './parts'

/* 11.2 — temperature, top-p e máximo de tokens */

const candidates = [
  { token: 'confirmado', logit: 3.2 },
  { token: 'aprovado', logit: 2.6 },
  { token: 'em análise', logit: 2.1 },
  { token: 'pendente', logit: 1.4 },
  { token: 'cancelado', logit: 0.6 },
  { token: 'abacaxi', logit: -1.2 },
]

const answer = 'O reembolso do pedido 4821 foi confirmado e o valor volta ao cartão em até 2 faturas, conforme a política 2026, seção 4.2.'.split(' ')

export function GenerationParamsDiagram() {
  const [temperature, setTemperature] = useState(0.7)
  const [topP, setTopP] = useState(0.9)
  const [maxTokens, setMaxTokens] = useState(40)
  const exp = candidates.map((c) => Math.exp(c.logit / temperature))
  const sum = exp.reduce((a, b) => a + b, 0)
  const probs = exp.map((e) => e / sum)
  const order = probs.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p)
  const kept = new Set<number>()
  let acc = 0
  for (const { p, i } of order) {
    if (acc >= topP) break
    kept.add(i)
    acc += p
  }
  const keptMass = [...kept].reduce((s, i) => s + probs[i]!, 0)
  // Aproximação didática: cada palavra ≈ 1,6 token.
  const words = Math.max(1, Math.floor(maxTokens / 1.6))
  const truncated = words < answer.length
  return (
    <DiagramShell
      label="Efeito de temperature, top-p e máximo de tokens na geração"
      kicker="Parâmetros de geração"
      title="Temperature e top-p mudam a escolha; não mudam a verdade"
      lead="Mova os controles e veja a distribuição do próximo token após “O status do seu reembolso está…”."
      limits="Logits inventados. Nem todo modelo ou API expõe todos os parâmetros, e os nomes e faixas variam. Temperature baixa reduz variação, mas não garante resposta correta nem determinismo absoluto."
    >
      <div className="grid gap-x-4 sm:grid-cols-2">
        <Range label="Temperature" min={0.1} max={2} step={0.1} value={temperature} onChange={setTemperature} display={num(temperature, 1)} />
        <Range label="Top-p" min={0.1} max={1} step={0.05} value={topP} onChange={setTopP} display={num(topP, 2)} />
      </div>
      <div className="mt-3 grid gap-1.5">
        {candidates.map((c, i) => (
          <div key={c.token} className="dg-fade" style={{ opacity: kept.has(i) ? 1 : 0.35 }}>
            <Meter label={<>{c.token}{!kept.has(i) && <span className="ml-1 text-xs font-normal text-ink-soft">(cortado pelo top-p)</span>}</>} value={probs[i]!} display={pct(probs[i]!, 1)} tone={i === 5 ? 'bad' : kept.has(i) ? 'focus' : 'dim'} />
          </div>
        ))}
      </div>
      <Callout tone={temperature >= 1.4 && kept.has(5) ? 'bad' : temperature <= 0.3 ? 'ok' : 'focus'} title={`${kept.size} candidato(s) no sorteio · ${pct(keptMass)} da probabilidade`} live>
        {temperature <= 0.3
          ? 'Temperature baixa concentra quase tudo no mais provável: saídas estáveis, boas para extração e classificação. Ainda pode estar errado — “confirmado” pode não ser o status real.'
          : temperature >= 1.4 && kept.has(5)
            ? 'Temperature alta achata a distribuição: até “abacaxi” entra no sorteio. Útil para brainstorm, ruim para respostas factuais.'
            : 'Faixa intermediária: alguma variação de texto. Top-p corta a cauda de tokens improváveis antes do sorteio.'}
      </Callout>
      <Range label="Máximo de tokens de saída" min={8} max={48} step={2} value={maxTokens} onChange={setMaxTokens} display={`${maxTokens} tokens`} />
      <p className="m-0 mt-2 rounded-md border border-line bg-paper px-3 py-2 text-sm" role="status">
        {answer.slice(0, words).join(' ')}
        {truncated && <span className="font-semibold text-bad"> ✂ [resposta cortada]</span>}
      </p>
      <p className="m-0 mt-1 text-xs text-ink-soft">{truncated ? 'Limite pequeno demais truncou a resposta — inclusive a citação da fonte.' : 'O limite controla custo e tamanho; precisa caber a resposta completa.'}</p>
    </DiagramShell>
  )
}

/* 11.5 — roteamento por complexidade */

const REQUESTS = 100_000
const IN = 2000
const OUT = 400
const SIMPLE_SHARE = 0.7
// Preços hipotéticos por 1.000 tokens (US$), só para comparar ordens de grandeza.
const LARGE = { in: 0.003, out: 0.015 }
const SMALL = { in: 0.0003, out: 0.0015 }

export function RoutingCostDiagram() {
  const [routed, setRouted] = useState(0)
  const [compress, setCompress] = useState(false)
  const tokensIn = compress ? IN - 700 : IN
  const share = routed / 100
  const costPer = (price: { in: number; out: number }) => (tokensIn / 1000) * price.in + (OUT / 1000) * price.out
  const cost = REQUESTS * (share * costPer(SMALL) + (1 - share) * costPer(LARGE))
  const baseline = REQUESTS * ((IN / 1000) * LARGE.in + (OUT / 1000) * LARGE.out)
  const misrouted = Math.max(0, share - SIMPLE_SHARE)
  const quality = 0.95 - misrouted * 1.1 - (compress ? 0.04 : 0)
  return (
    <DiagramShell
      label="Calculadora de roteamento por complexidade entre modelo pequeno e grande"
      kicker="Decisão por cenário"
      title="Mandar tudo para o maior modelo é simples — e caro"
      lead={`${num(REQUESTS)} requisições, ${num(IN)} tokens de entrada e ${num(OUT)} de saída cada. ${pct(SIMPLE_SHARE)} delas são mensagens simples.`}
      limits="Preços e qualidade hipotéticos, apenas para mostrar o raciocínio. Confira preços atuais por modelo e Região; um roteador também erra e precisa ser testado."
    >
      <Range label="Mensagens enviadas ao modelo pequeno" min={0} max={100} step={5} value={routed} onChange={setRouted} display={`${routed}%`} />
      <label className="mt-2 flex items-center gap-2 text-sm">
        <input type="checkbox" className="accent-[var(--color-navy)]" checked={compress} onChange={(e) => setCompress(e.currentTarget.checked)} />
        Resumir o contexto (−700 tokens de entrada por requisição)
      </label>
      <div className="mt-3 grid gap-2">
        <Meter label="Custo estimado" value={cost / baseline} display={`US$ ${num(cost)} (vs ${num(baseline)} tudo no grande)`} tone="warn" />
        <Meter label="Qualidade nas tarefas" value={quality} display={pct(quality)} tone={quality < 0.85 ? 'bad' : 'ok'} />
        <p className="m-0 text-xs text-ink-soft">Tokens de entrada no total: {num((REQUESTS * tokensIn) / 1e6)} milhões · saída: {num((REQUESTS * OUT) / 1e6)} milhões</p>
      </div>
      <Callout tone={quality < 0.85 ? 'bad' : routed >= 50 ? 'ok' : 'focus'} title={quality < 0.85 ? 'Economia que vira retrabalho' : routed >= 50 ? 'Bom equilíbrio' : 'Tudo (ou quase) no modelo grande'} live>
        {quality < 0.85
          ? `Você está mandando ${pct(misrouted)} de mensagens complexas para o modelo pequeno. O custo caiu, mas as correções humanas e reclamações vão comer a economia.`
          : routed >= 50
            ? 'As mensagens simples vão para o modelo pequeno e as difíceis escalam. Meça custo por tarefa concluída, não por chamada.'
            : 'A arquitetura parece simples, mas paga preço de modelo grande até para “qual o horário da loja?”.'}
        {compress && ' Resumir o contexto economiza tokens, mas se cortar a evidência essencial a qualidade cai.'}
      </Callout>
    </DiagramShell>
  )
}
