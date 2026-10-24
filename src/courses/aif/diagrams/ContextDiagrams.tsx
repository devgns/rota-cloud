import { useState } from 'react'
import { Callout, Choices, DiagramShell, Svg } from '@/components/diagrams/kit'
import { Toggle, num } from './parts'

/* 9.1 / 9.3 — orçamento da janela de contexto */

const WINDOW = 8000

type BlockId = 'system' | 'history' | 'policy' | 'rag' | 'tool' | 'output'

const blocks: readonly { id: BlockId; label: string; tokens: number; alt?: { label: string; tokens: number }; color: string; kind: 'instrução' | 'evidência' | 'estado' | 'reserva' }[] = [
  { id: 'system', label: 'Instruções de sistema', tokens: 600, color: 'var(--color-navy)', kind: 'instrução' },
  { id: 'history', label: 'Histórico da conversa', tokens: 3200, alt: { label: 'Histórico resumido', tokens: 500 }, color: 'var(--color-navy-soft)', kind: 'estado' },
  { id: 'policy', label: 'Política inteira (20 páginas)', tokens: 9000, color: 'var(--color-bad)', kind: 'evidência' },
  { id: 'rag', label: 'Top-3 trechos recuperados (RAG)', tokens: 1200, color: 'var(--color-ok)', kind: 'evidência' },
  { id: 'tool', label: 'Saída de ferramenta (status do pedido)', tokens: 400, color: 'var(--color-amber)', kind: 'estado' },
  { id: 'output', label: 'Reserva para a resposta', tokens: 800, color: 'var(--color-ink-soft)', kind: 'reserva' },
]

export function ContextBudgetDiagram() {
  const [on, setOn] = useState<Record<BlockId, boolean>>({ system: true, history: true, policy: true, rag: false, tool: true, output: true })
  const [summary, setSummary] = useState(false)
  const sizes = blocks.map((b) => (b.id === 'history' && summary ? b.alt!.tokens : b.tokens))
  const total = blocks.reduce((sum, b, i) => sum + (on[b.id] ? sizes[i]! : 0), 0)
  const scale = 600 / Math.max(WINDOW, total)
  let x = 20
  const over = total > WINDOW
  return (
    <DiagramShell
      label="Orçamento de tokens da janela de contexto"
      kicker="Engenharia de contexto"
      title="Tudo disputa a mesma janela: instruções, histórico, evidências e a resposta"
      lead="Ligue e desligue o que vai para o modelo. Troque a política inteira por trechos do RAG e resuma o histórico."
      limits="Janela de 8.000 tokens apenas para ilustrar; modelos reais variam muito. Caber na janela não garante que o modelo dê a mesma atenção a todo o texto."
    >
      <div className="choice-row" role="group" aria-label="Blocos do contexto">
        {blocks.map((b) => <Toggle key={b.id} on={on[b.id]} onChange={(v) => setOn((s) => ({ ...s, [b.id]: v }))}>{b.id === 'history' && summary ? b.alt!.label : b.label}</Toggle>)}
        <Toggle on={summary} onChange={setSummary}>Resumir histórico</Toggle>
      </div>
      <div className="diagram-canvas">
        <Svg width={640} height={110} minWidth={460} title="Barra empilhada de tokens comparada ao limite da janela">
          {blocks.map((b, i) => {
            if (!on[b.id]) return null
            const w = sizes[i]! * scale
            const left = x
            x += w
            return (
              <g key={b.id} className="dg-fade">
                <rect x={left} y={30} width={Math.max(1, w - 2)} height={40} rx={4} style={{ fill: b.color }} opacity={0.85} />
                {w > 46 && <text x={left + w / 2} y={55} textAnchor="middle" fontSize={11} fontWeight={700} style={{ fill: 'var(--color-paper)' }}>{num(sizes[i]!)}</text>}
              </g>
            )
          })}
          <line x1={20 + WINDOW * scale} y1={16} x2={20 + WINDOW * scale} y2={84} className="stroke-ink" strokeWidth={2} strokeDasharray="4 3" />
          <text x={20 + WINDOW * scale - 4} y={12} textAnchor="end" fontSize={11} fontWeight={600}>limite: {num(WINDOW)}</text>
          {over && <rect x={20 + WINDOW * scale} y={26} width={600 - WINDOW * scale} height={48} rx={4} className="fill-bad-soft stroke-bad" opacity={0.35} />}
          <text x={20} y={102} fontSize={11} className="dg-soft">{num(total)} tokens por chamada</text>
        </Svg>
      </div>
      <ul className="m-0 mt-1 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 text-xs text-ink-soft">
        {blocks.filter((b) => on[b.id]).map((b) => (
          <li key={b.id} className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: b.color }} />{b.id === 'history' && summary ? b.alt!.label : b.label} · {b.kind}</li>
        ))}
      </ul>
      <Callout tone={over ? 'bad' : on.policy ? 'warn' : on.rag ? 'ok' : 'warn'} title={over ? `Estourou em ${num(total - WINDOW)} tokens` : `Cabe: ${num(total)} de ${num(WINDOW)}`} live>
        {over
          ? 'A chamada falha ou o texto é truncado — e a parte cortada pode ser justamente a evidência. Troque a política inteira por trechos recuperados.'
          : on.policy
            ? 'Cabe, mas você paga pela política inteira em toda chamada e mistura muito texto irrelevante com o trecho que importa.'
            : on.rag
              ? 'Contexto enxuto: instruções separadas da evidência, só os trechos relevantes, com origem. Menos custo e menos ruído.'
              : 'Sem evidência no contexto: o modelo vai responder “de memória” e pode alucinar.'}
      </Callout>
    </DiagramShell>
  )
}

/* 9.2 — espaço de embeddings */

interface Doc { id: string; text: string; x: number; y: number }

const docs: readonly Doc[] = [
  { id: 'd1', text: 'Como recuperar minha senha', x: 92, y: 62 },
  { id: 'd2', text: 'Redefinir login bloqueado', x: 140, y: 104 },
  { id: 'd3', text: 'Não consigo entrar no app', x: 60, y: 118 },
  { id: 'd4', text: 'Prazo de entrega por região', x: 470, y: 56 },
  { id: 'd5', text: 'Rastrear meu pedido', x: 510, y: 112 },
  { id: 'd6', text: 'Atraso na transportadora', x: 430, y: 128 },
  { id: 'd7', text: 'Estorno de cobrança em duplicidade', x: 300, y: 214 },
  { id: 'd8', text: 'Segunda via do boleto', x: 404, y: 262 },
  { id: 'd9', text: 'Formas de pagamento aceitas', x: 170, y: 262 },
]

const queries = [
  { id: 'q1', label: 'esqueci o acesso à conta', x: 104, y: 92 },
  { id: 'q2', label: 'quando chega minha compra?', x: 480, y: 96 },
  { id: 'q3', label: 'fui cobrado duas vezes', x: 296, y: 236 },
  { id: 'q4', label: 'segunda via do boleto vencido', x: 380, y: 244 },
] as const

const stop = new Set(['o', 'a', 'à', 'de', 'do', 'da', 'em', 'no', 'na', 'meu', 'minha', 'por', 'como', 'fui', 'não'])
const words = (text: string) => text.toLowerCase().replace(/[?]/g, '').split(/\s+/).filter((w) => !stop.has(w))

export function EmbeddingSpaceDiagram() {
  const [qid, setQid] = useState<(typeof queries)[number]['id']>('q1')
  const [mode, setMode] = useState<'semantic' | 'lexical'>('semantic')
  const q = queries.find((item) => item.id === qid)!
  const qWords = words(q.label)
  const ranked = mode === 'semantic'
    ? [...docs].sort((a, b) => Math.hypot(a.x - q.x, a.y - q.y) - Math.hypot(b.x - q.x, b.y - q.y)).slice(0, 3)
    : docs.map((d) => ({ d, hits: words(d.text).filter((w) => qWords.includes(w)).length })).filter((r) => r.hits > 0).sort((a, b) => b.hits - a.hits).map((r) => r.d).slice(0, 3)
  const top = new Set(ranked.map((d) => d.id))
  return (
    <DiagramShell
      label="Espaço de embeddings em duas dimensões com busca semântica e lexical"
      kicker="Embeddings · busca semântica"
      title="Perto no espaço = parecido no significado"
      lead="Cada frase vira um vetor (aqui, achatado em 2D). Escolha uma pergunta e compare a busca por palavras com a busca por proximidade."
      limits="Embeddings reais têm centenas ou milhares de dimensões; o desenho é uma projeção didática. Proximidade semântica não garante que o trecho seja verdadeiro, atual ou que o usuário possa lê-lo."
    >
      <Choices label="Pergunta do usuário" options={queries.map((item) => ({ id: item.id, label: item.label }))} value={qid} onChange={setQid} />
      <Choices label="Tipo de busca" options={[{ id: 'semantic', label: 'Semântica (vetores)' }, { id: 'lexical', label: 'Lexical (mesmas palavras)' }]} value={mode} onChange={setMode} />
      <div className="diagram-canvas">
        <Svg width={640} height={290} minWidth={480} title="Pontos de documentos agrupados por tema e a pergunta posicionada no espaço">
          <text x={90} y={22} fontSize={11} className="dg-soft">acesso à conta</text>
          <text x={460} y={22} fontSize={11} className="dg-soft">entregas</text>
          <text x={250} y={196} fontSize={11} className="dg-soft">pagamentos</text>
          {ranked.map((d) => <line key={d.id} x1={q.x} y1={q.y} x2={d.x} y2={d.y} className="dg-fade stroke-navy" strokeWidth={2} strokeDasharray={mode === 'lexical' ? '5 4' : undefined} />)}
          {docs.map((d) => (
            <g key={d.id} className="dg-fade" opacity={top.has(d.id) ? 1 : 0.55}>
              <circle cx={d.x} cy={d.y} r={7} className={top.has(d.id) ? 'fill-navy stroke-navy' : 'fill-paper stroke-ink-soft'} strokeWidth={1.5} />
              <text x={d.x + (d.x > 420 ? -10 : 10)} y={d.y + 4} fontSize={11} textAnchor={d.x > 420 ? 'end' : 'start'} fontWeight={top.has(d.id) ? 700 : 400}>{d.text}</text>
            </g>
          ))}
          <g className="dg-move" style={{ transform: `translate(${q.x}px, ${q.y}px)` }}>
            <rect x={-8} y={-8} width={16} height={16} rx={3} transform="rotate(45)" className="fill-amber stroke-amber" />
          </g>
        </Svg>
      </div>
      <Callout tone={ranked.length ? 'ok' : 'bad'} title={ranked.length ? `Top-${ranked.length}: ${ranked.map((d) => d.text).join(' · ')}` : 'Nenhum resultado'} live>
        {mode === 'lexical'
          ? ranked.length
            ? 'Aqui havia palavras iguais (“segunda”, “via”, “boleto”). A busca lexical funciona quando o usuário usa o mesmo vocabulário do documento.'
            : `Nenhum documento contém “${qWords.join('”, “')}”. A busca por palavras não entende que significam a mesma coisa que o documento.`
          : 'Os vizinhos mais próximos tratam do mesmo assunto, mesmo sem palavras em comum. O índice vetorial devolve esses trechos para o contexto do modelo.'}
      </Callout>
    </DiagramShell>
  )
}
