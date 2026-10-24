import { useState } from 'react'
import { Callout, DiagramShell, Svg, SvgNode, type Rect } from '@/components/diagrams/kit'
import { svgButton } from './parts'

type Part =
  | 'fm' | 'nova' | 'kb' | 'guard' | 'prompt' | 'eval' | 'agents'
  | 'acRuntime' | 'acGateway' | 'acIdentity' | 'acMemory' | 'acPolicy' | 'acObs'
  | 'smTrain' | 'smEndpoint' | 'jumpstart' | 'cards'
  | 'strands' | 'kiro' | 'quick' | 'q'

const parts: Record<Part, Rect & { label: string; sub?: string }> = {
  fm: { x: 22, y: 34, w: 146, h: 40, label: 'Foundation models', sub: 'vários provedores' },
  nova: { x: 176, y: 34, w: 146, h: 40, label: 'Amazon Nova', sub: 'família de modelos' },
  kb: { x: 22, y: 82, w: 146, h: 34, label: 'Knowledge Bases' },
  guard: { x: 176, y: 82, w: 146, h: 34, label: 'Guardrails' },
  prompt: { x: 22, y: 124, w: 146, h: 34, label: 'Prompt Management' },
  eval: { x: 176, y: 124, w: 146, h: 34, label: 'Evaluations' },
  agents: { x: 22, y: 166, w: 300, h: 30, label: 'Agents / Flows' },
  acRuntime: { x: 22, y: 236, w: 96, h: 32, label: 'Runtime' },
  acGateway: { x: 124, y: 236, w: 96, h: 32, label: 'Gateway', sub: 'ferramentas/MCP' },
  acIdentity: { x: 226, y: 236, w: 96, h: 32, label: 'Identity' },
  acMemory: { x: 22, y: 274, w: 96, h: 32, label: 'Memory' },
  acPolicy: { x: 124, y: 274, w: 96, h: 32, label: 'Policy' },
  acObs: { x: 226, y: 274, w: 96, h: 32, label: 'Observability' },
  smTrain: { x: 358, y: 34, w: 130, h: 40, label: 'Preparar e treinar', sub: 'ML próprio' },
  smEndpoint: { x: 496, y: 34, w: 130, h: 40, label: 'Endpoints', sub: 'deploy e monitoria' },
  jumpstart: { x: 358, y: 82, w: 130, h: 40, label: 'JumpStart', sub: 'modelos prontos' },
  cards: { x: 496, y: 82, w: 130, h: 40, label: 'Model Cards', sub: 'e Clarify' },
  strands: { x: 358, y: 236, w: 130, h: 32, label: 'Strands Agents', sub: 'SDK para agentes' },
  q: { x: 358, y: 274, w: 130, h: 32, label: 'Amazon Q', sub: 'assistente pronto' },
  kiro: { x: 496, y: 236, w: 130, h: 32, label: 'Kiro', sub: 'dev com IA' },
  quick: { x: 496, y: 274, w: 130, h: 32, label: 'Amazon Quick', sub: 'análise com IA' },
}

const needs: readonly { id: string; label: string; parts: Part[]; answer: string; notConclude: string }[] = [
  { id: 'api', label: 'Consumir um FM pronto por API', parts: ['fm', 'nova'], answer: 'Amazon Bedrock dá acesso gerenciado a FMs de vários provedores — inclusive a família Amazon Nova — sem operar servidores de inferência.', notConclude: 'Nem todo modelo está disponível em toda Região; Nova é uma família de modelos, não a plataforma.' },
  { id: 'docs', label: 'Chatbot sobre documentos internos', parts: ['kb', 'fm'], answer: 'Bedrock + Knowledge Bases: recuperação e grounding sobre fontes autorizadas (RAG).', notConclude: 'Não exige fine-tuning por padrão.' },
  { id: 'filter', label: 'Filtrar conteúdo e PII', parts: ['guard'], answer: 'Bedrock Guardrails aplica políticas de conteúdo, tópicos negados e dados sensíveis na entrada e na saída.', notConclude: 'Não substitui IAM nem testes de negócio.' },
  { id: 'prompts', label: 'Versionar e reutilizar prompts', parts: ['prompt'], answer: 'Bedrock Prompt Management: criar, testar, comparar variantes e versionar templates.', notConclude: 'Versionar prompt não é versionar pesos de modelo.' },
  { id: 'compare', label: 'Comparar modelos na minha bateria', parts: ['eval'], answer: 'Bedrock Evaluations: avaliação automática e humana de modelos e aplicações (cap. 17).', notConclude: 'Benchmark genérico não substitui as suas perguntas reais.' },
  { id: 'agentCode', label: 'Escrever a lógica de um agente', parts: ['strands', 'agents'], answer: 'Strands Agents é um SDK/framework para construir agentes; Bedrock Agents orquestra modelos e ferramentas em cenários suportados.', notConclude: 'Framework não é modelo e não governa permissões sozinho.' },
  { id: 'agentOps', label: 'Operar agentes com identidade e memória', parts: ['acRuntime', 'acGateway', 'acIdentity', 'acMemory', 'acPolicy', 'acObs'], answer: 'Amazon Bedrock AgentCore: infraestrutura modular — runtime, gateway de ferramentas/MCP, identidade, memória, políticas e observabilidade.', notConclude: 'Identidade e limites de ação continuam sendo responsabilidade do seu desenho.' },
  { id: 'tabular', label: 'Treinar modelo tabular próprio', parts: ['smTrain', 'smEndpoint'], answer: 'Amazon SageMaker AI: preparar dados, treinar, implantar e monitorar ML customizado.', notConclude: 'Não obriga treinar do zero.' },
  { id: 'jump', label: 'Partir de modelo pronto no SageMaker', parts: ['jumpstart', 'smEndpoint'], answer: 'SageMaker JumpStart oferece modelos e soluções pré-construídas para começar mais rápido.', notConclude: 'Deploy e cobrança ainda exigem análise.' },
  { id: 'doc', label: 'Documentar o modelo para auditoria', parts: ['cards'], answer: 'SageMaker Model Cards documentam propósito, avaliação e limites; Clarify apoia análise de viés e explicabilidade.', notConclude: 'Documentação não é controle de acesso.' },
  { id: 'dev', label: 'Ajudar o time a programar', parts: ['kiro'], answer: 'Kiro: desenvolvimento de software assistido por IA.', notConclude: 'Ferramenta de desenvolvimento não é um FM específico.' },
  { id: 'bi', label: 'Painéis e análise de dados para o negócio', parts: ['quick'], answer: 'Amazon Quick: análise e BI com IA para usuários de negócio — painéis, perguntas sobre dados e automações.', notConclude: 'Não substitui a governança de dados nem é um assistente de código.' },
  { id: 'assist', label: 'Assistente pronto para funcionários ou desenvolvedores', parts: ['q'], answer: 'Amazon Q: Q Business responde e executa tarefas sobre os dados da empresa respeitando permissões; Q Developer ajuda a programar e operar na AWS.', notConclude: 'Assistente pronto não é plataforma para construir sua própria aplicação de FM (isso é Bedrock).' },
]

export function AwsAiPortfolioDiagram() {
  const [need, setNeed] = useState(needs[0]!.id)
  const item = needs.find((n) => n.id === need)!
  const lit = new Set(item.parts)
  const [peek, setPeek] = useState<Part | null>(null)
  const zone = (x: number, y: number, w: number, h: number, title: string, on: boolean) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} className={on ? 'fill-paper-raised stroke-navy' : 'fill-paper stroke-line'} strokeWidth={on ? 2 : 1.2} />
      <text x={x + 12} y={y + 17} fontSize={12} fontWeight={700}>{title}</text>
    </g>
  )
  const inBedrock = item.parts.some((p) => ['fm', 'nova', 'kb', 'guard', 'prompt', 'eval', 'agents'].includes(p))
  const inAgentCore = item.parts.some((p) => p.startsWith('ac'))
  const inSageMaker = item.parts.some((p) => ['smTrain', 'smEndpoint', 'jumpstart', 'cards'].includes(p))
  return (
    <DiagramShell
      label="Mapa do portfólio AWS de IA: Bedrock, AgentCore, SageMaker AI e ferramentas"
      kicker="Portfólio AWS de IA"
      title="Escolha a necessidade; o mapa acende onde começar"
      lead="Bedrock, AgentCore e SageMaker AI não competem: cobrem responsabilidades diferentes e podem coexistir."
      limits="Visão de portfólio. Componentes, nomes e disponibilidade por Região mudam; o desenho não afirma que todos sejam usados em toda arquitetura."
    >
      <label className="mt-3 block text-sm font-semibold" htmlFor="aif-need">Necessidade dominante</label>
      <select id="aif-need" className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-2 text-sm" value={need} onChange={(e) => setNeed(e.currentTarget.value)}>
        {needs.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
      </select>
      <div className="diagram-canvas">
        <Svg width={640} height={320} minWidth={520} title="Quatro áreas: Amazon Bedrock, Bedrock AgentCore, SageMaker AI e ferramentas">
          {zone(10, 8, 324, 196, 'Amazon Bedrock', inBedrock)}
          {zone(10, 212, 324, 102, 'Amazon Bedrock AgentCore', inAgentCore)}
          {zone(346, 8, 288, 124, 'Amazon SageMaker AI', inSageMaker)}
          {zone(346, 212, 288, 102, 'Frameworks e ferramentas', item.parts.some((p) => ['strands', 'kiro', 'quick', 'q'].includes(p)))}
          {(Object.keys(parts) as Part[]).map((id) => (
            <g key={id} {...svgButton(parts[id].label, () => setPeek(id), peek === id)}>
              <SvgNode {...parts[id]} tone={lit.has(id) ? 'focus' : peek === id ? 'warn' : 'plain'} fontSize={11} />
            </g>
          ))}
          <text x={358} y={156} fontSize={10.5} className="dg-soft">Bedrock: consumir e compor FMs.</text>
          <text x={358} y={172} fontSize={10.5} className="dg-soft">SageMaker AI: construir e operar ML.</text>
          <text x={358} y={188} fontSize={10.5} className="dg-soft">AgentCore: operar agentes com controles.</text>
        </Svg>
      </div>
      <Callout tone="ok" title={item.label} live>
        <p className="m-0">{item.answer}</p>
        <p className="m-0 mt-1 text-ink-soft">O que não concluir: {item.notConclude}</p>
      </Callout>
      {peek && <p className="m-0 mt-2 text-sm text-ink-soft">Você clicou em <strong>{parts[peek].label}</strong>{parts[peek].sub ? ` (${parts[peek].sub})` : ''}. Escolha uma necessidade acima que o acenda.</p>}
    </DiagramShell>
  )
}
