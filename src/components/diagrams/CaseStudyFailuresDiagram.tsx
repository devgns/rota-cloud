import { useState } from 'react'
import { Callout, Choices, DiagramShell, Svg, SvgArrow, SvgNode, type Rect, type Tone } from './kit'

type NodeId =
  | 'clients' | 'r53' | 'cf' | 'waf' | 's3web' | 'alb' | 'iam' | 'secrets'
  | 'taskA' | 'taskB' | 'sqs' | 'workers' | 'rdsP' | 'rdsS' | 's3rep'
  | 'cw' | 'ct' | 'config' | 'inspector' | 'cost'

type IncidentId = 'none' | 'az' | 'db' | 'queue' | 'iam' | 'cve' | 'abuse' | 'query' | 'bill'

const nodes: Record<NodeId, Rect & { label: string; sub?: string }> = {
  clients: { x: 8, y: 8, w: 96, h: 40, label: 'Clientes' },
  r53: { x: 8, y: 84, w: 96, h: 40, label: 'Route 53' },
  waf: { x: 130, y: 8, w: 120, h: 40, label: 'WAF · Shield' },
  cf: { x: 276, y: 8, w: 110, h: 40, label: 'CloudFront' },
  s3web: { x: 412, y: 8, w: 150, h: 40, label: 'S3 · site' },
  alb: { x: 186, y: 84, w: 140, h: 40, label: 'ALB' },
  iam: { x: 380, y: 84, w: 120, h: 40, label: 'IAM roles' },
  secrets: { x: 516, y: 84, w: 136, h: 40, label: 'Secrets Manager' },
  taskA: { x: 40, y: 164, w: 130, h: 40, label: 'Backend · AZ a' },
  taskB: { x: 200, y: 164, w: 130, h: 40, label: 'Backend · AZ b' },
  sqs: { x: 370, y: 164, w: 100, h: 40, label: 'SQS' },
  workers: { x: 500, y: 164, w: 140, h: 40, label: 'Workers' },
  rdsP: { x: 40, y: 244, w: 130, h: 44, label: 'RDS primário', sub: 'AZ a' },
  rdsS: { x: 200, y: 244, w: 130, h: 44, label: 'RDS standby', sub: 'AZ b' },
  s3rep: { x: 500, y: 244, w: 140, h: 44, label: 'S3 · certificados' },
  cw: { x: 8, y: 330, w: 116, h: 36, label: 'CloudWatch' },
  ct: { x: 134, y: 330, w: 116, h: 36, label: 'CloudTrail' },
  config: { x: 260, y: 330, w: 100, h: 36, label: 'Config' },
  inspector: { x: 370, y: 330, w: 110, h: 36, label: 'Inspector' },
  cost: { x: 490, y: 330, w: 162, h: 36, label: 'Budgets · Cost Explorer' },
}

const edges: readonly [NodeId, NodeId, string?][] = [
  ['clients', 'r53', 'DNS'],
  ['clients', 'waf'],
  ['waf', 'cf'],
  ['cf', 's3web'],
  ['cf', 'alb', '/api'],
  ['alb', 'taskA'],
  ['alb', 'taskB'],
  ['taskA', 'rdsP'],
  ['taskB', 'rdsP'],
  ['rdsP', 'rdsS'],
  ['taskB', 'sqs'],
  ['sqs', 'workers'],
  ['workers', 's3rep'],
]

interface Incident {
  id: IncidentId
  label: string
  bad: readonly NodeId[]
  warn?: readonly NodeId[]
  fix: readonly NodeId[]
  impact: string
  measure: string
}

const incidents: readonly Incident[] = [
  { id: 'none', label: 'Operação normal', bad: [], fix: [], impact: 'Cada peça existe por um motivo: DNS, entrega estática, filtro HTTP, balanceamento, contêineres em duas AZs, fila para trabalho pesado, banco Multi-AZ.', measure: 'Escolha um incidente para ver o que cai e o que responde.' },
  { id: 'az', label: 'Uma AZ cai', bad: ['taskA', 'rdsP'], fix: ['taskB', 'rdsS', 'alb'], impact: 'A task e o banco primário da AZ a param.', measure: 'O ALB manda tudo para a AZ b e o RDS faz failover para o standby. Só funciona porque cada camada já estava em duas AZs.' },
  { id: 'db', label: 'Banco primário cai', bad: ['rdsP'], fix: ['rdsS'], impact: 'Operações de dados falham até a recuperação.', measure: 'RDS Multi-AZ promove o standby. Backups continuam necessários para erro lógico, como um DELETE indevido.' },
  { id: 'queue', label: 'Certificados atrasam', bad: [], warn: ['sqs'], fix: ['workers', 'cw'], impact: 'A fila cresce e o processamento atrasa — a API continua respondendo.', measure: 'Alarme no CloudWatch pela profundidade da fila, escala dos workers e DLQ para mensagens que falham sempre.' },
  { id: 'iam', label: 'IAM alterado indevidamente', bad: ['iam'], fix: ['ct', 'config'], impact: 'Permissão exposta ou serviço bloqueado.', measure: 'CloudTrail mostra quem mudou; Config mostra o antes e o depois e acusa a não conformidade. Guardrails (SCP) evitam a repetição.' },
  { id: 'cve', label: 'CVE na imagem do contêiner', bad: ['taskA', 'taskB'], fix: ['inspector'], impact: 'Risco de exploração nas tasks em execução.', measure: 'Inspector aponta a vulnerabilidade na imagem do ECR; atualizar a imagem e reimplantar as tasks.' },
  { id: 'abuse', label: 'Tráfego abusivo', bad: [], warn: ['cf', 'alb'], fix: ['waf'], impact: 'Mais erros e mais custo.', measure: 'WAF com regras e limite de taxa; Shield contra volume. Ainda assim, a API valida autorização de negócio.' },
  { id: 'query', label: 'Consulta pesada no banco', bad: [], warn: ['rdsP'], fix: ['cw'], impact: 'Latência crescente para todo mundo.', measure: 'Índices e otimização, cache (ElastiCache) para leituras repetidas e read replica para relatórios. O standby do Multi-AZ não alivia leitura.' },
  { id: 'bill', label: 'Conta acima do previsto', bad: [], fix: ['cost'], impact: 'Surpresa na fatura.', measure: 'Budgets alerta antes de estourar; Cost Explorer mostra onde foi o gasto, com tags por ambiente; depois, ajustar dimensionamento.' },
]

function toneFor(id: NodeId, incident: Incident): Tone {
  if (incident.id === 'none') return 'plain'
  if (incident.bad.includes(id)) return 'bad'
  if (incident.warn?.includes(id)) return 'warn'
  if (incident.fix.includes(id)) return 'ok'
  return 'dim'
}

export function CaseStudyFailuresDiagram() {
  const [incidentId, setIncidentId] = useState<IncidentId>('az')
  const incident = incidents.find((item) => item.id === incidentId) ?? incidents[0]!

  return (
    <DiagramShell
      label="Arquitetura do estudo de caso com incidentes simulados"
      kicker="Estudo de caso"
      title="Quebre uma peça e veja quem responde"
      lead="A arquitetura da seção 21.2. Vermelho é o que falha, laranja o que sofre, verde o que mitiga ou detecta."
      limits="ALB ou API Gateway: o capítulo lembra que não precisamos dos dois. Security Hub, Pricing Calculator e a camada de identidade dos usuários ficaram fora do desenho para caber."
    >
      <Choices label="Incidente" options={incidents} value={incident.id} onChange={setIncidentId} />
      <div className="diagram-canvas">
        <Svg width={660} height={372} minWidth={520} title={`Incidente: ${incident.label}`}>
          <rect x={20} y={146} width={636} height={156} rx={10} className="fill-paper-raised stroke-line" strokeDasharray="5 4" />
          <text x={648} y={296} fontSize={11} textAnchor="end" className="dg-soft">
            VPC · duas AZs
          </text>
          <line x1={8} x2={652} y1={318} y2={318} className="stroke-line" />
          <text x={8} y={314} fontSize={10} className="dg-soft">
            operação, segurança e custo
          </text>
          {edges.map(([from, to, label]) => (
            <SvgArrow key={`${from}-${to}`} from={nodes[from]} to={nodes[to]} label={label} dashed={from === 'rdsP'} state={incident.id !== 'none' && (incident.bad.includes(from) || incident.bad.includes(to)) ? 'dim' : 'idle'} />
          ))}
          {(Object.keys(nodes) as NodeId[]).map((id) => (
            <SvgNode key={id} {...nodes[id]} fontSize={12} tone={toneFor(id, incident)} />
          ))}
        </Svg>
      </div>
      <Callout tone={incident.id === 'none' ? 'plain' : 'focus'} title={incident.id === 'none' ? 'Arquitetura de referência' : `Impacto: ${incident.impact}`} live>
        {incident.id === 'none' ? incident.impact : incident.measure}
      </Callout>
    </DiagramShell>
  )
}
