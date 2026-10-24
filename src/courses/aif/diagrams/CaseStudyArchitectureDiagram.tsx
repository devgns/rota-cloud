import { useState } from 'react'
import { Callout, Choices, DiagramShell, Svg, SvgArrow, SvgNode, type Rect, type Tone } from '@/components/diagrams/kit'

type Id = 'user' | 'app' | 'route' | 'kb' | 'tool' | 'agent' | 'fm' | 'val' | 'human' | 'docsec' | 'log'

const n: Record<Id, Rect & { label: string; sub?: string; dashed?: boolean }> = {
  user: { x: 8, y: 20, w: 140, h: 46, label: 'Atendente', sub: 'autenticado' },
  app: { x: 186, y: 20, w: 150, h: 46, label: 'Aplicação', sub: 'autenticação e política' },
  route: { x: 380, y: 20, w: 140, h: 46, label: 'Roteador', sub: 'qual tarefa?' },
  kb: { x: 110, y: 124, w: 140, h: 46, label: 'Knowledge Base', sub: 'RAG sobre políticas' },
  tool: { x: 300, y: 124, w: 140, h: 46, label: 'API do pedido', sub: 'leitura autorizada' },
  agent: { x: 490, y: 124, w: 142, h: 46, label: 'Agente', sub: 'escopo + aprovação' },
  fm: { x: 200, y: 226, w: 140, h: 46, label: 'FM via Bedrock', sub: 'redige a resposta' },
  val: { x: 8, y: 226, w: 150, h: 46, label: 'Validação', sub: 'Guardrails e fontes' },
  human: { x: 490, y: 226, w: 142, h: 46, label: 'Humano aprova', sub: 'reembolso' },
  docsec: { x: 60, y: 312, w: 190, h: 34, label: 'Permissões por documento', dashed: true },
  log: { x: 300, y: 312, w: 220, h: 34, label: 'Logs, métricas, auditoria', dashed: true },
}

const edges: readonly [Id, Id, boolean?][] = [
  ['user', 'app'], ['app', 'route'], ['route', 'kb'], ['route', 'tool'], ['route', 'agent'],
  ['kb', 'fm'], ['tool', 'fm'], ['agent', 'tool'], ['agent', 'human'], ['fm', 'val'], ['val', 'user'],
  ['kb', 'docsec', true], ['app', 'log', true],
]

type Route = 'policy' | 'status' | 'refund'

const routes: Record<Route, { label: string; path: Id[]; text: string }> = {
  policy: { label: 'Política', path: ['user', 'app', 'route', 'kb', 'fm', 'val'], text: 'Busca e síntese com fonte: a KB recupera só documentos que o atendente pode ler, o FM redige e a validação confere as citações. Sem base, responde “não encontrei”.' },
  status: { label: 'Status do pedido', path: ['user', 'app', 'route', 'tool', 'fm', 'val'], text: 'Consulta determinística: o status vem da API oficial, com o escopo da carteira do atendente. O FM só transforma o dado em frase — nunca inventa o status.' },
  refund: { label: 'Reembolso', path: ['user', 'app', 'route', 'agent', 'tool', 'human'], text: 'Ação com risco: o agente prepara a solicitação com dados lidos pela API, mas a escrita só acontece após aprovação humana e checagem de política fora do LLM.' },
}

const failures: readonly { id: string; label: string; bad: Id[]; cause: string; fix: string }[] = [
  { id: 'f1', label: 'Citou política antiga', bad: ['kb'], cause: 'Índice de busca desatualizado.', fix: 'Reindexar a fonte e testar freshness a cada mudança de documento.' },
  { id: 'f2', label: 'Leu pedido de outro cliente', bad: ['tool', 'app'], cause: 'Falta autorização por recurso.', fix: 'Corrigir ACL e escopo antes de gerar resposta — não pedir ao modelo para “não mostrar”.' },
  { id: 'f3', label: 'Explicação plausível mas errada', bad: ['fm', 'val'], cause: 'Alucinação com grounding fraco.', fix: 'Validar contra a fonte, exigir citação e permitir abstenção.' },
  { id: 'f4', label: 'Enviou pedido sem autorização', bad: ['agent', 'human'], cause: 'Ferramenta de escrita sem portão.', fix: 'Aprovação humana e checagem externa de política antes da escrita.' },
  { id: 'f5', label: 'Gastos explodiram', bad: ['fm', 'log'], cause: 'Contexto grande e várias chamadas por turno.', fix: 'Monitorar custo por tarefa concluída, cache, modelos menores e AWS Budgets.' },
]

export function CaseStudyArchitectureDiagram() {
  const [mode, setMode] = useState<'route' | 'fail'>('route')
  const [route, setRoute] = useState<Route>('policy')
  const [fail, setFail] = useState(failures[0]!.id)
  const failure = failures.find((f) => f.id === fail)!
  const path = routes[route].path
  const onPath = (a: Id, b: Id) => mode === 'route' && path.includes(a) && path.includes(b) && Math.abs(path.indexOf(a) - path.indexOf(b)) === 1
  const tone = (id: Id): Tone => {
    if (mode === 'fail') return failure.bad.includes(id) ? 'bad' : 'dim'
    return path.includes(id) ? 'focus' : 'dim'
  }
  return (
    <DiagramShell
      label="Arquitetura do assistente empresarial com rotas e falhas simuladas"
      kicker="Estudo de caso"
      title="Três tarefas, três caminhos — e onde cada falha mora"
      lead="Siga cada rota pela arquitetura ou injete uma das cinco falhas da seção 25.4."
      limits="Modelo conceitual: omite rede, identidade federada, filas, versionamento e resposta a incidentes."
    >
      <Choices label="Modo" options={[{ id: 'route', label: 'Seguir uma rota' }, { id: 'fail', label: 'Simular uma falha' }]} value={mode} onChange={setMode} />
      {mode === 'route'
        ? <Choices label="Rota" options={(Object.keys(routes) as Route[]).map((id) => ({ id, label: routes[id].label }))} value={route} onChange={setRoute} />
        : <Choices label="Falha" options={failures.map((f) => ({ id: f.id, label: f.label }))} value={fail} onChange={setFail} />}
      <div className="diagram-canvas">
        <Svg width={640} height={352} minWidth={540} title="Atendente, aplicação, roteador, RAG, API, agente, FM, validação e aprovação humana">
          {edges.map(([a, b, dashed]) => <SvgArrow key={`${a}${b}`} from={n[a]} to={n[b]} dashed={dashed} state={onPath(a, b) ? 'hot' : mode === 'fail' && failure.bad.includes(a) && failure.bad.includes(b) ? 'bad' : 'idle'} />)}
          {(Object.keys(n) as Id[]).map((id) => <SvgNode key={id} {...n[id]} tone={tone(id)} fontSize={12} />)}
        </Svg>
      </div>
      {mode === 'route'
        ? <Callout tone="focus" title={`Rota: ${routes[route].label}`} live>{routes[route].text}</Callout>
        : <Callout tone="bad" title={`Sintoma: ${failure.label}`} live><p className="m-0"><strong>Causa plausível:</strong> {failure.cause}</p><p className="m-0 mt-1"><strong>Resposta correta:</strong> {failure.fix}</p></Callout>}
    </DiagramShell>
  )
}
