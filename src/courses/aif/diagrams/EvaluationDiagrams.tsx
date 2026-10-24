import { useState } from 'react'
import { Callout, Choices, DiagramShell } from '@/components/diagrams/kit'
import { Meter, Toggle, num } from './parts'

/* 17.5 — bateria em camadas */

type Layer = 'text' | 'retrieval' | 'grounding' | 'tools' | 'security' | 'business'

const layers: readonly { id: Layer; label: string; question: string }[] = [
  { id: 'text', label: 'Acerto textual', question: 'A resposta bate com a esperada?' },
  { id: 'retrieval', label: 'Retrieval', question: 'Os trechos certos vieram, para o usuário certo?' },
  { id: 'grounding', label: 'Geração / grounding', question: 'Cada afirmação se apoia nos trechos?' },
  { id: 'tools', label: 'Ferramentas', question: 'Chamou a ação certa, com parâmetros e aprovação?' },
  { id: 'security', label: 'Segurança', question: 'Bloqueou injeção, vazamento e conteúdo indevido?' },
  { id: 'business', label: 'Negócio', question: 'Resolveu com custo e tempo aceitáveis?' },
]

const cases: readonly { id: string; label: string; bug: string; caughtBy: Layer }[] = [
  { id: 'k1', label: 'Pergunta direta', bug: 'Resposta errada sobre o prazo', caughtBy: 'text' },
  { id: 'k2', label: 'Versão antiga do documento', bug: 'Recuperou a política de 2024', caughtBy: 'retrieval' },
  { id: 'k3', label: 'Pedido de informação protegida', bug: 'Fonte confidencial entrou no contexto', caughtBy: 'retrieval' },
  { id: 'k4', label: 'Fonte ausente', bug: 'Inventou um prazo com citação decorativa', caughtBy: 'grounding' },
  { id: 'k5', label: 'Ação que exige confirmação', bug: 'Enviou a mensagem antes da aprovação', caughtBy: 'tools' },
  { id: 'k6', label: 'Ataque via documento recuperado', bug: 'Documento sobrescreveu as instruções', caughtBy: 'security' },
  { id: 'k7', label: 'Pico de uso', bug: 'Resposta correta, mas 14 s e 3× o custo-alvo', caughtBy: 'business' },
]

export function EvalLayersDiagram() {
  const [on, setOn] = useState<Record<Layer, boolean>>({ text: true, retrieval: false, grounding: false, tools: false, security: false, business: false })
  const caught = cases.filter((c) => on[c.caughtBy]).length
  return (
    <DiagramShell
      label="Bateria de avaliação em camadas e falhas que escapam"
      kicker="Avaliação em camadas"
      title="O que a sua bateria de testes deixa passar?"
      lead="Sete casos de teste, cada um com um defeito escondido. Ligue as camadas que a sua avaliação mede."
      limits="Classificação didática: um defeito real pode aparecer em mais de uma camada. Avaliadores automáticos (inclusive LLM-as-a-judge) precisam de rubrica e amostra revisada por humanos."
    >
      <div className="choice-row" role="group" aria-label="Camadas avaliadas">
        {layers.map((l) => <Toggle key={l.id} on={on[l.id]} onChange={(v) => setOn((s) => ({ ...s, [l.id]: v }))}>{l.label}</Toggle>)}
      </div>
      <ul className="m-0 grid list-none gap-1.5 p-0">
        {cases.map((c) => {
          const hit = on[c.caughtBy]
          const layer = layers.find((l) => l.id === c.caughtBy)!
          return (
            <li key={c.id} className="dg-box flex flex-wrap items-baseline justify-between gap-x-3 text-sm" data-tone={hit ? 'ok' : 'bad'}>
              <span><strong>{c.label}:</strong> {c.bug}</span>
              <span className="text-xs">{hit ? `pego por ${layer.label}` : `escapou — falta “${layer.question}”`}</span>
            </li>
          )
        })}
      </ul>
      <Meter label="Defeitos detectados antes da produção" value={caught / cases.length} display={`${caught} de ${cases.length}`} tone={caught === cases.length ? 'ok' : caught > 3 ? 'warn' : 'bad'} />
      <Callout tone={caught === cases.length ? 'ok' : 'bad'} title={caught === cases.length ? 'Bateria completa' : `${cases.length - caught} defeito(s) chegariam aos usuários`} live>
        {on.text && caught === 1
          ? 'Medir só acerto textual é como a demo de três perguntas fáceis: parece bom e esconde quase tudo.'
          : caught === cases.length
            ? 'Cada camada tem sua pergunta. Rode a mesma bateria a cada mudança de prompt, modelo, chunking, ferramenta ou guardrail.'
            : 'Ligue as camadas que faltam para ver onde cada defeito seria pego.'}
      </Callout>
    </DiagramShell>
  )
}

/* 17.3 — métricas de sobreposição × significado */

const reference = 'o reembolso é feito em até 15 dias corridos'
const candidates = {
  para: { label: 'Paráfrase correta', text: 'o dinheiro volta em no máximo 15 dias', bert: 0.9, correct: true },
  wrong: { label: 'Quase igual, mas errada', text: 'o reembolso é feito em até 50 dias corridos', bert: 0.96, correct: false },
  copy: { label: 'Cópia exata', text: 'o reembolso é feito em até 15 dias corridos', bert: 1, correct: true },
} as const

const tokens = (s: string) => s.split(' ')
const ngrams = (t: string[], n: number) => t.slice(0, t.length - n + 1).map((_, i) => t.slice(i, i + n).join(' '))

function overlap(cand: string[], ref: string[], n: number) {
  const pool = ngrams(ref, n)
  const grams = ngrams(cand, n)
  let hits = 0
  for (const g of grams) {
    const i = pool.indexOf(g)
    if (i >= 0) { hits++; pool.splice(i, 1) }
  }
  return { hits, cand: grams.length, ref: ngrams(ref, n).length }
}

export function TextMetricsDiagram() {
  const [pick, setPick] = useState<keyof typeof candidates>('para')
  const c = candidates[pick]
  const ref = tokens(reference)
  const cand = tokens(c.text)
  const u = overlap(cand, ref, 1)
  const b = overlap(cand, ref, 2)
  const rouge1 = u.hits / u.ref
  // BLEU simplificado: média geométrica das precisões de 1 e 2-gramas, com penalidade de brevidade.
  const bleu = Math.sqrt((u.hits / u.cand) * (b.hits / Math.max(1, b.cand))) * Math.min(1, Math.exp(1 - ref.length / cand.length))
  const refSet = new Set(ref)
  return (
    <DiagramShell
      label="Comparação de ROUGE, BLEU e BERTScore em três respostas"
      kicker="Métricas textuais"
      title="Sobreposição de palavras não é verdade"
      lead={`Referência: “${reference}”. Escolha uma resposta candidata.`}
      limits="ROUGE-1 e BLEU simplificados, calculados ao vivo sobre estas frases; BERTScore com valores ilustrativos. Nenhuma das três mede groundedness nem checa fatos."
    >
      <Choices label="Resposta candidata" options={Object.entries(candidates).map(([id, v]) => ({ id: id as keyof typeof candidates, label: v.label }))} value={pick} onChange={setPick} />
      <p className="m-0 mt-1 text-sm" aria-label="Palavras da candidata; em destaque as que existem na referência">
        {cand.map((w, i) => <span key={i} className="mr-1 inline-block rounded px-1" style={refSet.has(w) ? { background: 'var(--color-navy-wash)', outline: '1px solid var(--color-navy)' } : { outline: '1px dashed var(--color-line)' }}>{w}</span>)}
      </p>
      <div className="mt-3 grid gap-2">
        <Meter label="ROUGE-1 (recall de palavras)" value={rouge1} display={num(rouge1, 2)} tone="focus" hint="Comum em sumarização" />
        <Meter label="BLEU (precisão de n-gramas)" value={bleu} display={num(bleu, 2)} tone="warn" hint="Comum em tradução" />
        <Meter label="BERTScore (similaridade contextual)" value={c.bert} display={num(c.bert, 2)} tone="ok" hint="Captura paráfrase melhor" />
      </div>
      <Callout tone={c.correct ? 'ok' : 'bad'} title={c.correct ? 'Resposta correta' : 'Resposta factualmente errada (50 ≠ 15)'} live>
        {pick === 'para'
          ? 'ROUGE e BLEU caem porque as palavras mudaram, embora o sentido esteja certo. BERTScore percebe a paráfrase.'
          : pick === 'wrong'
            ? 'Notas altas em tudo — inclusive BERTScore — e o prazo está errado. Para fatos, valide contra a fonte; métricas de similaridade não bastam.'
            : 'Cópia perfeita: todas no máximo. Na vida real raramente existe uma única referência certa.'}
      </Callout>
    </DiagramShell>
  )
}
