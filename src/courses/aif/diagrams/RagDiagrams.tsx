import { useState } from 'react'
import { Callout, Choices, DiagramShell, ScenarioQuiz, type QuizOption, type QuizScenario } from '@/components/diagrams/kit'
import { FlowPlayer, type FlowEdge, type FlowFrame, type FlowNode } from '@/components/diagrams/FlowPlayer'
import { Toggle, num } from './parts'

/* 14.2 — as duas fases do RAG */

const W = 124
const H = 58
const nodes: readonly FlowNode[] = [
  { id: 'docs', x: 8, y: 26, w: W, h: H, label: 'Documentos', sub: 'autorizados' },
  { id: 'chunks', x: 168, y: 26, w: W, h: H, label: 'Chunks', sub: '+ metadados' },
  { id: 'emb', x: 328, y: 26, w: W, h: H, label: 'Embeddings' },
  { id: 'index', x: 496, y: 100, w: W, h: H, label: 'Índice vetorial' },
  { id: 'question', x: 8, y: 176, w: W, h: H, label: 'Pergunta', sub: 'usuário autenticado' },
  { id: 'qemb', x: 168, y: 176, w: W, h: H, label: 'Embedding', sub: 'da pergunta' },
  { id: 'search', x: 328, y: 176, w: W, h: H, label: 'Busca', sub: '+ filtros de acesso' },
  { id: 'topk', x: 496, y: 276, w: W, h: H, label: 'Top-k trechos', sub: '+ origem' },
  { id: 'prompt', x: 328, y: 276, w: W, h: H, label: 'Prompt', sub: 'com evidências' },
  { id: 'fm', x: 168, y: 276, w: W, h: H, label: 'FM gera', sub: 'a síntese' },
  { id: 'check', x: 8, y: 276, w: W, h: H, label: 'Validar', sub: 'e citar fontes' },
]

const edges: readonly FlowEdge[] = [
  { from: 'docs', to: 'chunks' },
  { from: 'chunks', to: 'emb' },
  { from: 'emb', to: 'index' },
  { from: 'question', to: 'qemb' },
  { from: 'qemb', to: 'search' },
  { from: 'index', to: 'search', dashed: true },
  { from: 'search', to: 'topk' },
  { from: 'topk', to: 'prompt' },
  { from: 'prompt', to: 'fm' },
  { from: 'fm', to: 'check' },
]

const frames: readonly FlowFrame[] = [
  { caption: 'Fase de preparação, antes de qualquer pergunta: o pipeline conecta só documentos autorizados e vigentes.', tokens: [{ id: 'd', label: 'D', at: 'docs' }], nodeTones: { docs: 'focus' } },
  { caption: 'Extrai texto e tabelas e divide em chunks. Cada chunk guarda metadados: documento, versão, data e quem pode ler.', tokens: [{ id: 'c1', label: 'c', at: 'chunks' }, { id: 'c2', label: 'c', at: 'chunks' }, { id: 'c3', label: 'c', at: 'chunks' }], hot: ['docs>chunks'], nodeTones: { chunks: 'focus' } },
  { caption: 'Um modelo de embeddings transforma cada chunk em um vetor numérico.', tokens: [{ id: 'c1', label: 'v', at: 'emb', tone: 'amber' }, { id: 'c2', label: 'v', at: 'emb', tone: 'amber' }, { id: 'c3', label: 'v', at: 'emb', tone: 'amber' }], hot: ['chunks>emb'], nodeTones: { emb: 'focus' } },
  { caption: 'Vetores e metadados vão para o índice. Documento mudou? Reindexe — senão a evidência antiga continua sendo recuperada.', tokens: [{ id: 'c1', label: 'v', at: 'index', tone: 'amber' }, { id: 'c2', label: 'v', at: 'index', tone: 'amber' }, { id: 'c3', label: 'v', at: 'index', tone: 'amber' }], hot: ['emb>index'], nodeTones: { index: 'ok' } },
  { caption: 'Fase de consulta: um usuário autenticado pergunta. A aplicação sabe quem é e o que ele pode ler.', tokens: [{ id: 'q', label: '?', at: 'question', tone: 'navy' }], nodeTones: { question: 'focus', index: 'ok' } },
  { caption: 'A pergunta também vira um vetor, com o mesmo modelo de embeddings.', tokens: [{ id: 'q', label: '?', at: 'qemb', tone: 'amber' }], hot: ['question>qemb'], nodeTones: { qemb: 'focus', index: 'ok' } },
  { caption: 'Busca semântica no índice, com filtros de metadados e de permissão aplicados AQUI — antes da geração.', tokens: [{ id: 'q', label: '?', at: 'search', tone: 'amber' }], hot: ['qemb>search', 'index>search'], nodeTones: { search: 'focus', index: 'ok' } },
  { caption: 'Voltam os top-k trechos mais próximos, cada um com sua origem. Pode haver reranqueamento.', tokens: [{ id: 't1', label: '1', at: 'topk', tone: 'ok' }, { id: 't2', label: '2', at: 'topk', tone: 'ok' }, { id: 't3', label: '3', at: 'topk', tone: 'ok' }], hot: ['search>topk'], nodeTones: { topk: 'focus' } },
  { caption: 'A aplicação monta o prompt: instruções + trechos marcados como evidência + pergunta, dentro do limite de tokens.', tokens: [{ id: 'p', label: 'P', at: 'prompt', tone: 'navy' }], hot: ['topk>prompt'], nodeTones: { prompt: 'focus' } },
  { caption: 'O FM gera a resposta a partir das evidências. Os pesos do modelo não mudaram em nenhum momento: RAG não é treino.', tokens: [{ id: 'r', label: 'R', at: 'fm', tone: 'navy' }], hot: ['prompt>fm'], nodeTones: { fm: 'focus' } },
  { caption: 'Validar se cada afirmação se apoia nos trechos, mostrar as citações e permitir “não encontrei” quando não houver base.', tokens: [{ id: 'r', label: '✓', at: 'check', tone: 'ok' }], hot: ['fm>check'], nodeTones: { check: 'ok' } },
]

export function RagPipelineDiagram() {
  return (
    <DiagramShell
      label="RAG em duas fases: preparação do índice e consulta"
      kicker="RAG passo a passo"
      title="Duas fases, dois tipos de risco"
      lead="A linha de cima acontece antes da pergunta (ingestão); as de baixo, durante a consulta. Reproduza e observe onde entra a permissão."
      limits="Há RAG híbrido, com SQL, grafos ou ferramentas, e serviços gerenciados (como Bedrock Knowledge Bases) que escondem parte destas etapas."
    >
      <FlowPlayer title="Pipeline de RAG com ingestão e consulta" width={630} height={340} minWidth={520} nodes={nodes} edges={edges} frames={frames} />
    </DiagramShell>
  )
}

/* 14.6 — similaridade não é a resposta certa */

const policies = [
  { id: 'p24', title: 'Política 2024', days: 30, year: 2024, category: 'geral', score: 0.91 },
  { id: 'p26', title: 'Política 2026', days: 15, year: 2026, category: 'geral', score: 0.89 },
  { id: 'vip', title: 'Política 2026 — VIP', days: 45, year: 2026, category: 'vip', score: 0.88 },
] as const

export function RagFilterDiagram() {
  const [profile, setProfile] = useState<'geral' | 'vip'>('geral')
  const [byYear, setByYear] = useState(false)
  const [byCategory, setByCategory] = useState(false)
  const allowed = policies.filter((p) => (!byYear || p.year === 2026) && (!byCategory || p.category === profile))
  const top = [...allowed].sort((a, b) => b.score - a.score)[0]
  const expected = profile === 'vip' ? 'vip' : 'p26'
  const right = top?.id === expected
  return (
    <DiagramShell
      label="Busca vetorial com e sem filtros de metadados"
      kicker="Filtros de metadados"
      title="O texto mais parecido não é a resposta certa para esta pessoa"
      lead="Pergunta: “qual o prazo de devolução?”. Três documentos quase iguais disputam o primeiro lugar."
      limits="Scores de similaridade ilustrativos. Em produção, filtros de acesso devem ser aplicados na busca, não pedindo ao modelo que “não mostre”."
    >
      <Choices label="Quem pergunta" options={[{ id: 'geral', label: 'Cliente padrão' }, { id: 'vip', label: 'Cliente VIP' }]} value={profile} onChange={setProfile} />
      <div className="choice-row" role="group" aria-label="Filtros">
        <Toggle on={byYear} onChange={setByYear}>Filtro: só versão vigente (2026)</Toggle>
        <Toggle on={byCategory} onChange={setByCategory}>Filtro: categoria = perfil do usuário</Toggle>
      </div>
      <ol className="m-0 grid list-none gap-1.5 p-0">
        {[...policies].sort((a, b) => b.score - a.score).map((p) => {
          const kept = allowed.includes(p)
          const tone = !kept ? 'dim' : p.id === top?.id ? (right ? 'ok' : 'bad') : 'plain'
          return (
            <li key={p.id} className="dg-box flex items-center justify-between gap-3 text-sm" data-tone={tone}>
              <span><strong>{p.title}</strong> · {p.days} dias <span className="text-xs text-ink-soft">({p.category}, {p.year})</span></span>
              <span className="tabular-nums text-xs">similaridade {num(p.score, 2)}{!kept && ' · filtrado'}</span>
            </li>
          )
        })}
      </ol>
      <Callout tone={right ? 'ok' : 'bad'} title={top ? `Resposta: ${top.days} dias (${top.title})` : 'Nada recuperado'} live>
        {right
          ? 'Vetor + metadados: a busca semântica encontra o assunto, os filtros garantem a versão vigente e a categoria certa.'
          : !byYear
            ? 'A política de 2024 é a mais parecida com a pergunta, mas está vencida. Similaridade não sabe o que é “vigente”.'
            : 'A versão está certa, mas sem filtrar pela categoria o cliente recebe a regra de outro perfil.'}
      </Callout>
    </DiagramShell>
  )
}

/* 14.4 — RAG ou fine-tuning */

type Fix = 'rag' | 'ft' | 'prompt'

const options: readonly QuizOption<Fix>[] = [
  { id: 'rag', label: 'RAG', role: 'traz conhecimento externo, mutável e citável na hora da pergunta, sem mudar pesos.' },
  { id: 'ft', label: 'Fine-tuning', role: 'muda pesos para fixar comportamento, estilo ou domínio a partir de exemplos.' },
  { id: 'prompt', label: 'Prompt + exemplos', role: 'orienta tarefa e formato a cada chamada, sem infraestrutura nova.' },
]

const scenarios: readonly QuizScenario<Fix>[] = [
  { id: 'r1', prompt: 'O catálogo de preços muda todo dia e as respostas precisam citar a tabela vigente.', answer: 'rag', why: 'Fatos que mudam e precisam de fonte: RAG com reindexação. Fine-tuning diário seria caro, lento e difícil de auditar.' },
  { id: 'r2', prompt: 'Milhares de laudos precisam sair sempre no mesmo estilo técnico, e prompts longos não mantiveram a consistência.', answer: 'ft', why: 'Comportamento estável que o prompt não sustentou, com exemplos disponíveis: candidato a fine-tuning.' },
  { id: 'r3', prompt: 'A saída precisa ser um JSON com três campos fixos.', answer: 'prompt', why: 'Comece pelo mais simples: instrução, exemplo e validação de schema.' },
  { id: 'r4', prompt: 'O assistente deve responder com base em 2.000 manuais internos e mostrar o trecho usado.', answer: 'rag', why: 'Conhecimento corporativo com citação: RAG (por exemplo, Bedrock Knowledge Bases).' },
]

export function RagOrFineTuneQuiz() {
  return (
    <DiagramShell label="Quiz: RAG, fine-tuning ou prompt" kicker="Decisão" title="Conhecimento ou comportamento?" lead="Primeiro descubra o que precisa mudar: o que o modelo sabe na hora da resposta, ou como ele se comporta.">
      <ScenarioQuiz label="Técnica" scenarios={scenarios} options={options} />
    </DiagramShell>
  )
}
