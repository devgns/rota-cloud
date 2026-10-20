import { useState } from 'react'
import { Callout, Choices, DiagramShell, Svg, SvgArrow, SvgNode, type Rect, type Tone } from './kit'

type ScenarioId = 'expected' | 'sg-db' | 'no-nat' | 'sg-is-not-route'
type NodeId = 'internet' | 'igw' | 'alb' | 'nat' | 'api' | 'rds'
type EdgeState = 'hot' | 'bad' | 'dim'

interface Scenario {
  id: ScenarioId
  label: string
  edges: readonly { from: NodeId; to: NodeId; state: EdgeState; label?: string }[]
  stop: NodeId | null
  title: string
  text: string
  tone: Tone
  noNatRoute?: boolean
}

const scenarios: readonly Scenario[] = [
  {
    id: 'expected',
    label: 'Caminho esperado',
    edges: [
      { from: 'internet', to: 'igw', state: 'hot', label: '1' },
      { from: 'igw', to: 'alb', state: 'hot', label: '2' },
      { from: 'alb', to: 'api', state: 'hot', label: '3' },
      { from: 'api', to: 'rds', state: 'hot', label: '4' },
    ],
    stop: null,
    tone: 'ok',
    title: 'O pedido chega ao banco',
    text: 'Internet → IGW → ALB na subnet pública → API na privada → RDS na subnet de dados. A API não precisa de IP público: quem fica exposto é o ALB.',
  },
  {
    id: 'sg-db',
    label: 'SG do banco fechado',
    edges: [
      { from: 'internet', to: 'igw', state: 'hot' },
      { from: 'igw', to: 'alb', state: 'hot' },
      { from: 'alb', to: 'api', state: 'hot' },
      { from: 'api', to: 'rds', state: 'bad', label: 'porta 5432 negada' },
    ],
    stop: 'rds',
    tone: 'bad',
    title: 'Para no security group do RDS',
    text: 'Rotas estão certas e a API recebe o pedido. Mas o SG do banco não permite a porta a partir do SG da API, então a conexão para no último salto.',
  },
  {
    id: 'no-nat',
    label: 'API sem rota para o NAT',
    edges: [
      { from: 'api', to: 'nat', state: 'bad', label: 'sem rota' },
      { from: 'nat', to: 'igw', state: 'dim' },
      { from: 'igw', to: 'internet', state: 'dim' },
    ],
    stop: 'api',
    tone: 'bad',
    noNatRoute: true,
    title: 'A API não consegue sair para a internet',
    text: 'Para baixar um pacote, a API precisa de rota 0.0.0.0/0 → NAT Gateway na tabela da subnet privada. Sem ela, a saída para ali. A entrada pelo ALB é outro caminho e segue funcionando.',
  },
  {
    id: 'sg-is-not-route',
    label: 'Abrir o SG da API para 0.0.0.0/0',
    edges: [{ from: 'internet', to: 'api', state: 'bad', label: 'sem IP público nem rota' }],
    stop: 'api',
    tone: 'warn',
    title: 'Abrir o SG não publica a API',
    text: 'O SG passou a aceitar qualquer origem, mas a API está numa subnet privada, sem IP público e sem rota de entrada pelo IGW. O pacote nunca chega até a regra. Security group filtra; não cria caminho.',
  },
]

const nodes: Record<NodeId, Rect & { label: string; sub?: string }> = {
  internet: { x: 262, y: 4, w: 136, h: 36, label: 'Internet' },
  igw: { x: 270, y: 58, w: 120, h: 34, label: 'Internet Gateway' },
  alb: { x: 110, y: 130, w: 130, h: 40, label: 'ALB', sub: 'público' },
  nat: { x: 300, y: 130, w: 140, h: 40, label: 'NAT Gateway', sub: 'só saída' },
  api: { x: 110, y: 218, w: 130, h: 40, label: 'API (ECS)', sub: 'sem IP público' },
  rds: { x: 110, y: 306, w: 130, h: 40, label: 'RDS' },
}

const subnets: readonly { y: number; h: number; title: string; route: (s: Scenario) => string }[] = [
  { y: 108, h: 76, title: 'Subnet pública', route: () => 'rota 0.0.0.0/0 → IGW' },
  { y: 196, h: 76, title: 'Subnet privada · app', route: (s) => (s.noNatRoute ? 'rota 0.0.0.0/0 → (ausente)' : 'rota 0.0.0.0/0 → NAT') },
  { y: 284, h: 70, title: 'Subnet privada · dados', route: () => 'só rota local' },
]

function nodeTone(id: NodeId, scenario: Scenario): Tone {
  if (scenario.stop === id) return 'bad'
  const touched = scenario.edges.some((e) => (e.from === id || e.to === id) && e.state !== 'dim')
  return touched ? 'focus' : 'dim'
}

export function VpcTopologyDiagram() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('expected')
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0]!

  return (
    <DiagramShell
      label="Topologia de VPC em três camadas com o caminho do pacote"
      kicker="Rede"
      title="Siga o pacote pela VPC"
      lead="Rota decide se existe caminho; security group decide se o pacote é aceito. Escolha um cenário e veja onde o fluxo para."
      limits="Uma AZ só para caber no desenho — em produção cada camada tem subnets em pelo menos duas AZs. Sem NACL customizada, IPv6 nem VPC endpoints."
    >
      <Choices label="Cenário de rede" options={scenarios} value={scenario.id} onChange={setScenarioId} />
      <div className="diagram-canvas">
        <Svg width={660} height={364} minWidth={500} title={scenario.title}>
          <rect x={8} y={74} width={644} height={286} rx={12} className="fill-paper-raised stroke-ink-soft" strokeWidth={1.5} />
          <text x={20} y={96} fontSize={12} fontWeight={600}>
            VPC 10.0.0.0/16
          </text>
          {subnets.map((subnet) => (
            <g key={subnet.title}>
              <rect x={24} y={subnet.y} width={612} height={subnet.h} rx={8} className="fill-paper stroke-line" strokeDasharray="5 4" />
              <text x={630} y={subnet.y + 18} fontSize={11} textAnchor="end" fontWeight={600}>
                {subnet.title}
              </text>
              <text x={630} y={subnet.y + 34} fontSize={11} textAnchor="end" className={subnet.route(scenario).includes('ausente') ? '' : 'dg-soft'} style={subnet.route(scenario).includes('ausente') ? { fill: 'var(--color-bad)' } : undefined}>
                {subnet.route(scenario)}
              </text>
            </g>
          ))}
          {scenario.edges.map((edge) => (
            <SvgArrow key={`${edge.from}-${edge.to}`} from={nodes[edge.from]} to={nodes[edge.to]} state={edge.state} label={edge.label} dashed={edge.state === 'bad'} />
          ))}
          {(Object.keys(nodes) as NodeId[]).map((id) => (
            <SvgNode key={id} {...nodes[id]} tone={nodeTone(id, scenario)} fontSize={12} />
          ))}
        </Svg>
      </div>
      <Callout tone={scenario.tone} title={scenario.title} live>
        {scenario.text}
      </Callout>
    </DiagramShell>
  )
}
