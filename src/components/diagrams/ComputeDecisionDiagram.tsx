import { useState } from 'react'
import { Callout, DiagramShell, Svg, SvgArrow, SvgNode, type Rect, type Tone } from './kit'

type Q = 'os' | 'containers' | 'k8s' | 'hosts' | 'event'
type Leaf = 'ec2' | 'eks' | 'ecs' | 'fargate' | 'nodes' | 'lambda' | 'simple'
type Id = Q | Leaf
type Answers = Partial<Record<Q, boolean>>

const questions: Record<Q, string> = {
  os: 'Precisa administrar o SO ou um software muito específico?',
  containers: 'A aplicação já está em contêineres?',
  k8s: 'Precisa de Kubernetes?',
  hosts: 'Quer administrar os servidores que rodam os contêineres?',
  event: 'São funções curtas, acionadas por eventos?',
}

const nodes: Record<Id, Rect & { label: string; sub?: string }> = {
  os: { x: 250, y: 8, w: 180, h: 44, label: 'Administrar o SO?' },
  ec2: { x: 40, y: 82, w: 120, h: 44, label: 'EC2', sub: 'controle total' },
  containers: { x: 350, y: 82, w: 180, h: 44, label: 'Já tem contêineres?' },
  k8s: { x: 160, y: 156, w: 180, h: 44, label: 'Precisa de Kubernetes?' },
  event: { x: 470, y: 156, w: 190, h: 44, label: 'Função curta por evento?' },
  eks: { x: 100, y: 230, w: 100, h: 44, label: 'EKS' },
  ecs: { x: 270, y: 230, w: 100, h: 44, label: 'ECS' },
  lambda: { x: 440, y: 230, w: 100, h: 44, label: 'Lambda' },
  simple: { x: 556, y: 230, w: 116, h: 44, label: 'Lightsail', sub: 'ou Beanstalk' },
  hosts: { x: 145, y: 304, w: 180, h: 44, label: 'Administrar hosts?' },
  fargate: { x: 70, y: 378, w: 130, h: 44, label: 'Fargate', sub: 'sem hosts seus' },
  nodes: { x: 270, y: 378, w: 130, h: 44, label: 'Instâncias EC2', sub: 'no cluster' },
}

const edges: readonly { from: Id; to: Id; when: boolean }[] = [
  { from: 'os', to: 'ec2', when: true },
  { from: 'os', to: 'containers', when: false },
  { from: 'containers', to: 'k8s', when: true },
  { from: 'containers', to: 'event', when: false },
  { from: 'k8s', to: 'eks', when: true },
  { from: 'k8s', to: 'ecs', when: false },
  { from: 'eks', to: 'hosts', when: true },
  { from: 'ecs', to: 'hosts', when: true },
  { from: 'event', to: 'lambda', when: true },
  { from: 'event', to: 'simple', when: false },
  { from: 'hosts', to: 'fargate', when: false },
  { from: 'hosts', to: 'nodes', when: true },
]

/** Percorre a árvore com as respostas dadas e devolve o caminho e a pergunta pendente. */
function walk(answers: Answers): { path: Id[]; pending: Q | null } {
  const path: Id[] = ['os']
  const go = (q: Q, yes: Id, no: Id): Id | null => {
    const a = answers[q]
    if (a === undefined) return null
    return a ? yes : no
  }
  let next = go('os', 'ec2', 'containers')
  if (!next) return { path, pending: 'os' }
  path.push(next)
  if (next === 'ec2') return { path, pending: null }
  next = go('containers', 'k8s', 'event')
  if (!next) return { path, pending: 'containers' }
  path.push(next)
  if (next === 'event') {
    const leaf = go('event', 'lambda', 'simple')
    if (!leaf) return { path, pending: 'event' }
    path.push(leaf)
    return { path, pending: null }
  }
  const orchestrator = go('k8s', 'eks', 'ecs')
  if (!orchestrator) return { path, pending: 'k8s' }
  path.push(orchestrator, 'hosts')
  const capacity = go('hosts', 'nodes', 'fargate')
  if (!capacity) return { path, pending: 'hosts' }
  path.push(capacity)
  return { path, pending: null }
}

const presets: readonly { label: string; answers: Answers }[] = [
  { label: 'Kubernetes sem gerir servidores', answers: { os: false, containers: true, k8s: true, hosts: false } },
  { label: 'Software legado que exige um SO específico', answers: { os: true } },
  { label: 'Redimensionar imagem a cada upload', answers: { os: false, containers: false, event: true } },
  { label: 'API em contêiner, orquestração nativa AWS', answers: { os: false, containers: true, k8s: false, hosts: false } },
]

function result(path: Id[]): string {
  const last = path[path.length - 1]
  if (last === 'ec2') return 'EC2: você escolhe a AMI, aplica patches e mantém o SO. Mais controle, mais operação.'
  if (last === 'lambda') return 'Lambda: você entrega código e configuração; a AWS executa cada invocação. Ideal para trabalho curto disparado por eventos.'
  if (last === 'simple') return 'Lightsail ou Elastic Beanstalk: caminho simplificado para publicar uma aplicação comum, conforme os requisitos.'
  const orchestrator = path.includes('eks') ? 'EKS' : 'ECS'
  if (last === 'fargate') return `${orchestrator} com Fargate: o orquestrador decide onde rodar; o Fargate fornece a capacidade sem hosts para você gerir. Fargate não substitui ECS/EKS e não é Lambda.`
  return `${orchestrator} com instâncias EC2: você mantém as instâncias do cluster (SO, patches, capacidade) e o orquestrador distribui as tasks ou pods.`
}

export function ComputeDecisionDiagram() {
  const [answers, setAnswers] = useState<Answers>({})
  const { path, pending } = walk(answers)
  const onPath = new Set<Id>(path)
  const answer = (q: Q, value: boolean) => {
    // Reiniciar as respostas abaixo da pergunta alterada evita caminhos incoerentes.
    const order: Q[] = ['os', 'containers', 'k8s', 'event', 'hosts']
    const kept: Answers = {}
    for (const key of order) {
      if (key === q) break
      if (answers[key] !== undefined) kept[key] = answers[key]
    }
    setAnswers({ ...kept, [q]: value })
  }

  const toneFor = (id: Id): Tone => {
    if (id === pending) return 'focus'
    if (!onPath.has(id)) return path.length > 1 ? 'dim' : 'plain'
    if (pending === null && id === path[path.length - 1]) return 'ok'
    return 'focus'
  }

  return (
    <DiagramShell
      label="Árvore de decisão para escolher onde executar uma aplicação"
      kicker="Computação"
      title="Onde executar: responda e siga o caminho"
      lead="Cada resposta tira uma camada de operação das suas mãos. Responda as perguntas ou use um dos exemplos."
      limits="Árvore didática do capítulo. Na prática pesam também custo, duração máxima de execução, estado, rede e o que a equipe já domina. EKS também pode usar Fargate ou nós EC2, como o ECS."
    >
      <div className="choice-row" role="group" aria-label="Exemplos">
        {presets.map((preset) => (
          <button key={preset.label} type="button" className="choice text-sm" onClick={() => setAnswers(preset.answers)}>
            {preset.label}
          </button>
        ))}
        <button type="button" className="choice text-sm" onClick={() => setAnswers({})}>
          Recomeçar
        </button>
      </div>
      <div className="diagram-canvas">
        <Svg width={680} height={428} minWidth={500} title="Árvore: SO, contêineres, Kubernetes, hosts e funções por evento">
          {edges.map((edge) => {
            const hot = onPath.has(edge.from) && onPath.has(edge.to) && path.indexOf(edge.to) === path.indexOf(edge.from) + 1
            return (
              <SvgArrow
                key={`${edge.from}-${edge.to}`}
                from={nodes[edge.from]}
                to={nodes[edge.to]}
                label={edge.from === 'eks' || edge.from === 'ecs' ? undefined : edge.when ? 'sim' : 'não'}
                state={hot ? 'hot' : path.length > 1 ? 'dim' : 'idle'}
              />
            )
          })}
          {(Object.keys(nodes) as Id[]).map((id) => (
            <SvgNode key={id} {...nodes[id]} tone={toneFor(id)} fontSize={12} />
          ))}
        </Svg>
      </div>
      {pending ? (
        <div className="mt-3 rounded-md border border-navy bg-navy-wash px-3 py-2">
          <p className="m-0 text-sm font-semibold">{questions[pending]}</p>
          <div className="choice-row mb-0" role="group" aria-label={questions[pending]}>
            <button type="button" className="choice" onClick={() => answer(pending, true)}>
              Sim
            </button>
            <button type="button" className="choice" onClick={() => answer(pending, false)}>
              Não
            </button>
          </div>
        </div>
      ) : (
        <Callout tone="ok" title="Resultado" live>
          {result(path)}
        </Callout>
      )}
      {Object.keys(answers).length > 0 && (
        <ol className="m-0 mt-2 list-none p-0 text-xs text-ink-soft">
          {(Object.keys(answers) as Q[])
            .filter((q) => path.includes(q))
            .map((q) => (
              <li key={q}>
                <button type="button" className="cursor-pointer underline decoration-dotted underline-offset-2" onClick={() => answer(q, !answers[q])}>
                  {questions[q]} {answers[q] ? 'Sim' : 'Não'} (inverter)
                </button>
              </li>
            ))}
        </ol>
      )}
    </DiagramShell>
  )
}
