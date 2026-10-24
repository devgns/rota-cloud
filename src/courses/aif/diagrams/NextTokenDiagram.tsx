import { useState } from 'react'
import { Callout, Choices, DiagramShell } from '@/components/diagrams/kit'
import { Meter } from './parts'

const promptTokens = ['A', ' polí', 'tica', ' de', ' reem', 'bolso', ' da', ' loja', ' é', ' de']

/** Distribuições ilustrativas do próximo token, uma por passo. */
const steps: readonly { token: string; p: number }[][] = [
  [{ token: ' 30', p: 0.41 }, { token: ' 7', p: 0.22 }, { token: ' 15', p: 0.17 }, { token: ' até', p: 0.12 }, { token: ' um', p: 0.08 }],
  [{ token: ' dias', p: 0.83 }, { token: ' %', p: 0.07 }, { token: ' horas', p: 0.05 }, { token: ' meses', p: 0.05 }],
  [{ token: ' corridos', p: 0.36 }, { token: '.', p: 0.3 }, { token: ' úteis', p: 0.22 }, { token: ' após', p: 0.12 }],
  [{ token: ' após', p: 0.52 }, { token: '.', p: 0.33 }, { token: ',', p: 0.15 }],
  [{ token: ' a', p: 0.61 }, { token: ' o', p: 0.39 }],
  [{ token: ' compra', p: 0.58 }, { token: ' entrega', p: 0.42 }],
  [{ token: '.', p: 0.9 }, { token: ',', p: 0.1 }],
]

type Mode = 'greedy' | 'sample'

function sample(options: readonly { token: string; p: number }[]) {
  let r = Math.random()
  for (const option of options) {
    r -= option.p
    if (r <= 0) return option.token
  }
  return options.at(-1)!.token
}

export function NextTokenDiagram() {
  const [mode, setMode] = useState<Mode>('greedy')
  const [generated, setGenerated] = useState<string[]>([])
  const step = generated.length
  const options = steps[step]
  const done = !options
  const pick = () => {
    if (!options) return
    setGenerated((g) => [...g, mode === 'greedy' ? options[0]!.token : sample(options)])
  }
  return (
    <DiagramShell
      label="Geração autoregressiva: probabilidades do próximo token"
      kicker="Dentro do Transformer"
      title="Um token por vez, sempre o “provável” — não o verdadeiro"
      lead="O texto vira tokens, o modelo calcula a probabilidade de cada continuação e escolhe uma. Repita até terminar."
      limits="Probabilidades inventadas para ilustrar. Modelos reais escolhem entre dezenas de milhares de tokens, e a tokenização varia por modelo."
    >
      <p className="m-0 mt-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">1. Tokenização da entrada</p>
      <div className="mt-1 flex flex-wrap gap-1" aria-label="Tokens da entrada">
        {promptTokens.map((token, i) => <span key={i} className="dg-chip font-mono" style={{ borderColor: 'var(--color-navy)' }}>{token.replace(' ', '␣')}</span>)}
        {generated.map((token, i) => <span key={`g${i}`} className="dg-chip font-mono" style={{ borderColor: 'var(--color-amber)', background: 'var(--color-amber-soft)' }}>{token.replace(' ', '␣')}</span>)}
      </div>
      <p className="m-0 mt-1 text-xs text-ink-soft">{promptTokens.length} tokens de entrada · {generated.length} gerados. “reembolso” virou dois tokens: token não é palavra.</p>
      <Choices label="Como escolher" options={[{ id: 'greedy', label: 'Sempre o mais provável' }, { id: 'sample', label: 'Sortear pela probabilidade' }]} value={mode} onChange={setMode} />
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-ink-soft">2. Probabilidades do próximo token</p>
      <div className="mt-2 grid gap-1.5">
        {done ? <p className="m-0 text-sm">Fim da geração (o modelo emitiu o ponto final).</p> : options.map((o, i) => <Meter key={o.token} label={<code>{o.token.replace(' ', '␣')}</code>} value={o.p} tone={i === 0 ? 'focus' : 'plain'} />)}
      </div>
      <div className="choice-row">
        <button type="button" className="choice" disabled={done} onClick={pick}>Gerar próximo token</button>
        <button type="button" className="choice" disabled={step === 0} onClick={() => setGenerated([])}>Recomeçar</button>
      </div>
      <Callout tone={generated[0] && generated[0] !== ' 30' ? 'warn' : 'focus'} title={`Saída: “a política de reembolso da loja é de${generated.join('')}”`} live>
        {generated.length === 0
          ? 'Nada gerado ainda. Clique em “Gerar próximo token”.'
          : generated[0] !== ' 30'
            ? `Sorteou “${generated[0]!.trim()}”: soa igualmente plausível. O modelo não consultou a política real da loja — sem contexto (RAG, ferramenta), ele só continua o texto de forma provável.`
            : 'Mesmo “30 dias” não foi consultado em lugar nenhum: é a continuação mais frequente nos dados de treino. Fluência não prova veracidade.'}
      </Callout>
    </DiagramShell>
  )
}

/* 8.3 — ciclo de vida de um FM */

const lifecycle = [
  { id: 'data', label: '1. Dados', weights: false, who: 'Provedor do FM', text: 'Seleção e curadoria: quantidade, proveniência, licenças, diversidade e qualidade.' },
  { id: 'pre', label: '2. Pré-treino', weights: true, who: 'Provedor do FM', text: 'Aprende padrões gerais com investimento computacional altíssimo. Muda todos os pesos.' },
  { id: 'select', label: '3. Seleção', weights: false, who: 'Sua equipe', text: 'Comparar capacidades, idiomas, modalidade, custo, Região e licença com as suas tarefas reais.' },
  { id: 'adapt', label: '4. Adaptação', weights: null, who: 'Sua equipe', text: 'Prompt e RAG não mudam pesos; fine-tuning muda. É opcional — e escolher o mais simples que funciona é a regra (cap. 16).' },
  { id: 'eval', label: '5. Avaliação', weights: false, who: 'Sua equipe', text: 'Medir qualidade, segurança, adequação e custo antes de publicar (cap. 17).' },
  { id: 'deploy', label: '6. Deploy', weights: false, who: 'Sua equipe + serviço', text: 'Disponibilizar a inferência conforme demanda: sob demanda, provisionado, batch.' },
  { id: 'feedback', label: '7. Feedback', weights: false, who: 'Sua equipe', text: 'Monitorar falhas, riscos e oportunidades; voltar à seleção ou adaptação quando preciso.' },
] as const

export function FmLifecycleDiagram() {
  const [active, setActive] = useState<(typeof lifecycle)[number]['id']>('pre')
  const item = lifecycle.find((s) => s.id === active)!
  return (
    <DiagramShell label="Ciclo de vida de um foundation model" kicker="Ciclo de vida do FM" title="Onde os pesos mudam — e quem faz cada etapa" lead="Clique em cada etapa. Na AIF-C01 você raramente pré-treina: quase sempre seleciona, adapta e avalia.">
      <ol className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
        {lifecycle.map((s) => (
          <li key={s.id}>
            <button type="button" className="choice text-sm" aria-pressed={active === s.id} onClick={() => setActive(s.id)}>
              {s.label} {s.weights === true ? '●' : s.weights === null ? '◐' : '○'}
            </button>
          </li>
        ))}
      </ol>
      <p className="m-0 text-xs text-ink-soft">● muda os pesos · ◐ depende da técnica · ○ não muda</p>
      <Callout tone={item.weights ? 'warn' : 'focus'} title={`${item.label} · ${item.who}`} live>{item.text}</Callout>
    </DiagramShell>
  )
}
