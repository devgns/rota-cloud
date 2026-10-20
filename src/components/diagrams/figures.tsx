import type { ComponentType, ReactNode } from 'react'
import { Svg, SvgArrow, SvgNode, useSvgRefs, type Rect, type Tone } from './kit'

/*
 * Figuras estáticas que substituem, na leitura, os esquemas em texto (```text) da apostila.
 * O texto original continua na página, recolhido em "Ver em texto", e segue indexado pela busca.
 * A chave é a primeira linha não vazia do bloco.
 */

type N = Rect & { label: string; sub?: string; tone?: Tone; dashed?: boolean; fontSize?: number }

function Nodes({ nodes, fontSize = 12 }: { nodes: readonly N[]; fontSize?: number }) {
  return (
    <>
      {nodes.map((node) => (
        <SvgNode key={`${node.label}-${node.x}-${node.y}`} {...node} fontSize={node.fontSize ?? fontSize} />
      ))}
    </>
  )
}

function Zone({ x, y, w, h, title, titleAt = 'left', tone = 'line', fontSize = 11 }: Rect & { title?: string; titleAt?: 'left' | 'right'; tone?: 'line' | 'strong' | 'amber'; fontSize?: number }) {
  const stroke = tone === 'strong' ? 'stroke-ink-soft' : tone === 'amber' ? 'stroke-amber' : 'stroke-line'
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} className={`${tone === 'strong' ? 'fill-paper-raised' : 'fill-paper'} ${stroke}`} strokeWidth={tone === 'strong' ? 1.5 : 1.25} strokeDasharray={tone === 'strong' ? undefined : '5 4'} />
      {title && (
        <text x={titleAt === 'left' ? x + 10 : x + w - 10} y={y + 16} fontSize={fontSize} fontWeight={600} textAnchor={titleAt === 'left' ? 'start' : 'end'}>
          {title}
        </text>
      )}
    </g>
  )
}

/* 3.1 — Região, AZ e edge location */
function RegionScalesFigure() {
  const users: N = { x: 8, y: 150, w: 104, h: 44, label: 'Usuários', sub: 'várias cidades' }
  const edge: N = { x: 140, y: 150, w: 124, h: 44, label: 'Edge location', sub: 'CloudFront (CDN)', tone: 'warn' }
  const lb: N = { x: 382, y: 40, w: 156, h: 32, label: 'Load Balancer', tone: 'focus' }
  const apiA: N = { x: 310, y: 120, w: 96, h: 40, label: 'API A' }
  const apiB: N = { x: 428, y: 120, w: 96, h: 40, label: 'API B' }
  const other: N = { x: 546, y: 120, w: 96, h: 40, label: 'outros', sub: 'recursos', dashed: true }
  const dbA: N = { x: 310, y: 232, w: 96, h: 44, label: 'Banco', sub: 'primário', tone: 'focus' }
  const dbB: N = { x: 428, y: 232, w: 96, h: 44, label: 'Banco', sub: 'standby' }
  return (
    <Svg width={660} height={340} minWidth={520} title="Usuários passam por uma edge location e chegam a uma Região com três AZs">
      <Zone x={292} y={8} w={360} h={324} title="Região sa-east-1" tone="strong" fontSize={12} />
      {['AZ-a', 'AZ-b', 'AZ-c'].map((az, i) => (
        <Zone key={az} x={300 + i * 118} y={84} w={114} h={240} title={az} />
      ))}
      <SvgArrow from={users} to={edge} />
      <SvgArrow from={edge} to={lb} />
      <SvgArrow from={lb} to={apiA} />
      <SvgArrow from={lb} to={apiB} />
      <SvgArrow from={apiA} to={dbA} />
      <SvgArrow from={apiB} to={dbA} />
      <SvgArrow from={dbA} to={dbB} dashed both />
      <Nodes nodes={[users, edge, lb, apiA, apiB, other, dbA, dbB]} />
      <text x={358} y={302} fontSize={10} className="dg-soft">
        réplica síncrona entre AZs
      </text>
      <g fontSize={11}>
        {[
          ['Edge location', 'perto do usuário: cache e entrega'],
          ['Região', 'área geográfica com várias AZs'],
          ['AZ', 'data centers isolados na Região'],
        ].map(([name, text], i) => (
          <text key={name} x={8} y={240 + i * 30}>
            <tspan fontWeight={600}>{name}</tspan>
            <tspan x={8} dy={13} className="dg-soft">
              {text}
            </tspan>
          </text>
        ))}
      </g>
    </Svg>
  )
}

/* 9 — Fluxo ilustrativo de investigação */
function InvestigationFigure() {
  const row1 = 28
  const row2 = 142
  const nodes: N[] = [
    { x: 8, y: row1, w: 146, h: 48, label: 'Acesso suspeito', sub: 'na conta', tone: 'bad' },
    { x: 176, y: row1, w: 146, h: 48, label: 'GuardDuty', sub: 'gera o finding', tone: 'focus' },
    { x: 344, y: row1, w: 146, h: 48, label: 'Security Hub', sub: 'centraliza', tone: 'focus' },
    { x: 506, y: row1, w: 146, h: 48, label: 'Detective', sub: 'ajuda a investigar', tone: 'focus' },
    { x: 506, y: row2, w: 146, h: 48, label: 'CloudTrail', sub: 'eventos de API', tone: 'focus' },
    { x: 344, y: row2, w: 146, h: 48, label: 'Equipe corrige', sub: 'permissões, credenciais', tone: 'ok' },
    { x: 176, y: row2, w: 146, h: 48, label: 'Config · CloudWatch', sub: 'acompanham', fontSize: 11 },
  ]
  const phases: readonly [number, number, string][] = [
    [176, 322, 'detectar'],
    [344, 490, 'reunir'],
    [506, 652, 'investigar'],
  ]
  return (
    <Svg width={660} height={214} minWidth={520} title="Do acesso suspeito à correção: GuardDuty, Security Hub, Detective, CloudTrail, equipe, Config e CloudWatch">
      {phases.map(([x1, x2, text]) => (
        <text key={text} x={(x1 + x2) / 2} y={18} fontSize={10} textAnchor="middle" className="dg-soft">
          {text.toUpperCase()}
        </text>
      ))}
      <text x={579} y={row2 + 64} fontSize={10} textAnchor="middle" className="dg-soft">
        QUEM FEZ O QUÊ
      </text>
      <text x={417} y={row2 + 64} fontSize={10} textAnchor="middle" className="dg-soft">
        CORRIGIR
      </text>
      <text x={249} y={row2 + 64} fontSize={10} textAnchor="middle" className="dg-soft">
        ACOMPANHAR
      </text>
      {nodes.slice(1).map((node, i) => (
        <SvgArrow key={node.label} from={nodes[i]!} to={node} />
      ))}
      <Nodes nodes={nodes} />
    </Svg>
  )
}

/* 11.2 — Auto Scaling versus Load Balancing */
function AutoScalingFigure() {
  const users: N = { x: 262, y: 6, w: 136, h: 34, label: 'Usuários' }
  const lb: N = { x: 240, y: 66, w: 180, h: 42, label: 'Load Balancer', sub: 'distribui os pedidos', tone: 'focus' }
  const instances: N[] = Array.from({ length: 6 }, (_, i) => ({
    x: 52 + i * 94,
    y: 176,
    w: 80,
    h: 42,
    label: 'EC2',
    sub: i < 2 ? 'sempre' : 'no pico',
    tone: i < 2 ? 'focus' : 'plain',
    dashed: i >= 2,
  }))
  return (
    <Svg width={660} height={262} minWidth={520} title="Load Balancer distribui pedidos entre instâncias de um Auto Scaling group que varia de 2 a 6">
      <Zone x={36} y={150} w={588} h={104} tone="amber" />
      <text x={48} y={244} fontSize={11}>
        <tspan fontWeight={600}>Auto Scaling group</tspan>
        <tspan className="dg-soft"> · mín. 2 · máx. 6 · decide quantas instâncias existem</tspan>
      </text>
      <text x={432} y={84} fontSize={10} className="dg-soft">
        decide para onde vai
      </text>
      <text x={432} y={97} fontSize={10} className="dg-soft">
        cada pedido
      </text>
      <SvgArrow from={users} to={lb} />
      {instances.map((node, i) => (
        <SvgArrow key={node.x} from={lb} to={node} state={i < 2 ? 'hot' : 'idle'} dashed={i >= 2} />
      ))}
      <Nodes nodes={[users, lb, ...instances]} />
    </Svg>
  )
}

/* 11.3 — ECS em EC2 versus ECS em Fargate */
function EcsLaunchFigure() {
  const rows: readonly [string, 'you' | 'aws', 'you' | 'aws'][] = [
    ['Código e imagem do contêiner', 'you', 'you'],
    ['IAM e rede da tarefa', 'you', 'you'],
    ['Definição da tarefa (CPU, memória)', 'you', 'you'],
    ['Agendar contêineres (ECS)', 'aws', 'aws'],
    ['SO e patching dos hosts', 'you', 'aws'],
    ['Hosts que executam as tarefas', 'you', 'aws'],
  ]
  const colX = [236, 450]
  const top = 34
  const rowH = 40
  const cell = (who: 'you' | 'aws', x: number, y: number) => (
    <SvgNode key={x} x={x} y={y} w={200} h={32} rx={6} label={who === 'you' ? 'Você' : 'AWS'} tone={who === 'you' ? 'warn' : 'focus'} fontSize={12} />
  )
  return (
    <Svg width={660} height={top + rows.length * rowH + 16} minWidth={500} title="Quem administra cada camada no ECS com EC2 e no ECS com Fargate">
      {['ECS + EC2', 'ECS + Fargate'].map((name, i) => (
        <text key={name} x={colX[i]! + 100} y={20} fontSize={13} fontWeight={600} textAnchor="middle">
          {name}
        </text>
      ))}
      <rect x={4} y={top + 4 * rowH - 4} width={652} height={2 * rowH} rx={8} className="fill-amber-soft" opacity={0.5} />
      {rows.map(([label, ec2, fargate], i) => {
        const y = top + i * rowH
        return (
          <g key={label}>
            <text x={12} y={y + 21} fontSize={12}>
              {label}
            </text>
            {cell(ec2, colX[0]!, y)}
            {cell(fargate, colX[1]!, y)}
          </g>
        )
      })}
      <text x={12} y={top + rows.length * rowH + 8} fontSize={10} className="dg-soft">
        A diferença está só nas linhas destacadas: quem cuida dos hosts.
      </text>
    </Svg>
  )
}

/* 12.5 — Arquitetura VPC de três camadas */
function VpcThreeTierFigure() {
  const internet: N = { x: 270, y: 4, w: 120, h: 30, label: 'Internet' }
  const r53: N = { x: 262, y: 50, w: 136, h: 32, label: 'Route 53 · DNS' }
  const alb: N = { x: 150, y: 158, w: 360, h: 36, label: 'Application Load Balancer', tone: 'focus' }
  const apiA: N = { x: 104, y: 240, w: 140, h: 40, label: 'API', sub: 'backend' }
  const apiB: N = { x: 416, y: 240, w: 140, h: 40, label: 'API', sub: 'backend' }
  const rdsA: N = { x: 104, y: 322, w: 140, h: 44, label: 'RDS primário', tone: 'focus' }
  const rdsB: N = { x: 416, y: 322, w: 140, h: 44, label: 'RDS standby' }
  const rows: readonly [number, number, string][] = [
    [146, 70, 'subnet pública'],
    [226, 74, 'subnet privada · app'],
    [310, 74, 'subnet privada · dados'],
  ]
  return (
    <Svg width={660} height={404} minWidth={520} title="VPC com subnets pública, de aplicação e de dados em duas AZs">
      <Zone x={8} y={96} w={644} h={304} title="VPC" tone="strong" fontSize={12} />
      {['AZ-a', 'AZ-b'].map((az, i) => (
        <g key={az}>
          <Zone x={24 + i * 312} y={122} w={300} h={270} />
          <text x={36 + i * 312} y={139} fontSize={11} fontWeight={600}>
            {az}
          </text>
          {rows.map(([y, h, name]) => (
            <g key={name}>
              <rect x={32 + i * 312} y={y} width={284} height={h} rx={7} className={name.includes('pública') ? 'fill-amber-soft stroke-line' : 'fill-paper-raised stroke-line'} />
              <text x={40 + i * 312} y={y + h - 8} fontSize={10} className="dg-soft">
                {name}
              </text>
            </g>
          ))}
        </g>
      ))}
      <SvgArrow from={internet} to={r53} />
      <SvgArrow from={r53} to={alb} />
      <SvgArrow from={alb} to={apiA} />
      <SvgArrow from={alb} to={apiB} />
      <SvgArrow from={apiA} to={rdsA} />
      <SvgArrow from={apiB} to={rdsA} />
      <SvgArrow from={rdsA} to={rdsB} dashed both />
      <Nodes nodes={[internet, r53, alb, apiA, apiB, rdsA, rdsB]} />
      <text x={330} y={362} fontSize={10} textAnchor="middle" className="dg-soft">
        Multi-AZ síncrono
      </text>
    </Svg>
  )
}

/* 17.3 — AWS Glue */
function GlueFigure() {
  const refs = useSvgRefs()
  const s3: N = { x: 8, y: 56, w: 132, h: 48, label: 'S3', sub: 'CSV / Parquet' }
  const glue: N = { x: 184, y: 56, w: 140, h: 48, label: 'AWS Glue', sub: 'cataloga e transforma', tone: 'focus' }
  const catalog: N = { x: 184, y: 136, w: 140, h: 34, label: 'Data Catalog', dashed: true }
  const athena: N = { x: 368, y: 56, w: 132, h: 48, label: 'Athena', sub: 'consulta com SQL' }
  const qs: N = { x: 528, y: 56, w: 124, h: 48, label: 'QuickSight', sub: 'apresenta' }
  return (
    <Svg width={660} height={180} minWidth={520} title="Dados no S3 catalogados pelo Glue, consultados no Athena e apresentados no QuickSight">
      <path d={`M ${s3.x + s3.w / 2} ${s3.y} C ${s3.x + 80} 20, ${athena.x + 40} 20, ${athena.x + athena.w / 2} ${athena.y - 2}`} fill="none" className="stroke-ink-soft" strokeWidth={1.4} strokeDasharray="5 4" markerEnd={refs.arrow} />
      <text x={254} y={14} fontSize={10} textAnchor="middle" className="dg-soft">
        Athena lê os dados onde estão, no S3
      </text>
      <SvgArrow from={s3} to={glue} />
      <SvgArrow from={glue} to={catalog} label="esquema" />
      <SvgArrow from={catalog} to={athena} dashed />
      <SvgArrow from={athena} to={qs} />
      <Nodes nodes={[s3, glue, catalog, athena, qs]} />
    </Svg>
  )
}

/* 17.10 — Pipeline ilustrativo de telemetria */
function TelemetryPipelineFigure() {
  const labels: readonly [string, string, Tone?][] = [
    ['Leitura de sensor', 'evento', 'warn'],
    ['Kinesis', 'fluxo contínuo'],
    ['S3 raw', 'dado bruto', 'focus'],
    ['Glue', 'transforma, cataloga'],
    ['Athena', 'consulta'],
    ['QuickSight', 'relatório'],
  ]
  const nodes: N[] = labels.map(([label, sub, tone], i) => ({ x: 8 + i * 108, y: 34, w: 98, h: 46, label, sub, tone }))
  const bands: readonly [number, number, string][] = [
    [0, 1, 'ingestão em tempo real'],
    [2, 2, 'data lake'],
    [3, 5, 'preparo e análise'],
  ]
  return (
    <Svg width={660} height={124} minWidth={560} title="Telemetria entra pelo Kinesis, é guardada bruta no S3, tratada pelo Glue e consultada no Athena e no QuickSight">
      {nodes.slice(1).map((node, i) => (
        <SvgArrow key={node.label} from={nodes[i]!} to={node} />
      ))}
      <Nodes nodes={nodes} fontSize={11} />
      {bands.map(([a, b, text]) => {
        const x1 = nodes[a]!.x
        const x2 = nodes[b]!.x + nodes[b]!.w
        return (
          <g key={text}>
            <path d={`M ${x1} 92 v 6 H ${x2} v -6`} fill="none" className="stroke-line" strokeWidth={1.25} />
            <text x={(x1 + x2) / 2} y={114} fontSize={10} textAnchor="middle" className="dg-soft">
              {text}
            </text>
          </g>
        )
      })}
      <text x={8} y={18} fontSize={10} className="dg-soft">
        TEMPO →
      </text>
    </Svg>
  )
}

/* 21.2 — Arquitetura conceitual do estudo de caso */
function CaseStudyFigure() {
  const clients: N = { x: 250, y: 4, w: 160, h: 32, label: 'Clientes' }
  const r53: N = { x: 250, y: 52, w: 160, h: 32, label: 'Route 53 · DNS' }
  const cf: N = { x: 250, y: 100, w: 160, h: 32, label: 'CloudFront + WAF' }
  const web: N = { x: 250, y: 148, w: 160, h: 42, label: 'Site estático', sub: 'origem no S3' }
  const api: N = { x: 230, y: 226, w: 200, h: 34, label: 'ALB ou API Gateway (*)', tone: 'focus' }
  const backend: Rect = { x: 204, y: 282, w: 252, h: 60 }
  const taskA: N = { x: 214, y: 296, w: 112, h: 38, label: 'Backend', sub: 'AZ a', tone: 'focus' }
  const taskB: N = { x: 334, y: 296, w: 112, h: 38, label: 'Backend', sub: 'AZ b', tone: 'focus' }
  const secrets: N = { x: 8, y: 372, w: 156, h: 42, label: 'Secrets Manager', sub: '+ IAM' }
  const sqs: N = { x: 250, y: 372, w: 160, h: 36, label: 'SQS' }
  const data: N = { x: 496, y: 372, w: 156, h: 42, label: 'RDS Multi-AZ', sub: 'ou outras fontes' }
  const workers: N = { x: 250, y: 440, w: 160, h: 42, label: 'Workers', sub: 'ECS / Lambda' }
  const reports: N = { x: 430, y: 440, w: 112, h: 42, label: 'S3', sub: 'certificados' }
  const download: N = { x: 556, y: 440, w: 96, h: 42, label: 'Download', sub: 'acesso controlado', fontSize: 11 }
  return (
    <Svg width={660} height={562} minWidth={520} title="Arquitetura conceitual: CloudFront e S3 para o front, ALB e backend em Fargate em duas AZs, SQS e workers para certificados, RDS Multi-AZ">
      <rect x={backend.x} y={backend.y} width={backend.w} height={backend.h} rx={10} className="fill-paper-raised stroke-ink-soft" strokeDasharray="5 4" />
      <text x={backend.x + 6} y={backend.y - 6} fontSize={10} className="dg-soft">
        ECS + Fargate · duas AZs
      </text>
      <SvgArrow from={clients} to={r53} />
      <SvgArrow from={r53} to={cf} />
      <SvgArrow from={cf} to={web} />
      <SvgArrow from={web} to={api} label="HTTP autenticado" />
      <SvgArrow from={api} to={backend} />
      <SvgArrow from={backend} to={secrets} />
      <SvgArrow from={backend} to={sqs} />
      <SvgArrow from={backend} to={data} />
      <SvgArrow from={sqs} to={workers} />
      <SvgArrow from={workers} to={reports} />
      <SvgArrow from={reports} to={download} />
      <Nodes nodes={[clients, r53, cf, web, api, taskA, taskB, secrets, sqs, data, workers, reports, download]} />
      <line x1={8} x2={652} y1={500} y2={500} className="stroke-line" />
      <SvgNode x={8} y={510} w={318} h={46} label="Operação" sub="CloudWatch · CloudTrail · Config · Security Hub" fontSize={12} />
      <SvgNode x={334} y={510} w={318} h={46} label="Custos" sub="Tags · Cost Explorer · Budgets · Pricing Calculator" fontSize={12} />
    </Svg>
  )
}

interface FigureEntry {
  Figure?: ComponentType
  caption: ReactNode
}

const figures: Record<string, FigureEntry> = {
  'Usuário em diferentes cidades': { Figure: RegionScalesFigure, caption: 'Três escalas: a edge location fica perto do usuário; a Região agrupa AZs; cada AZ é isolada das outras.' },
  'Acesso suspeito à conta': { Figure: InvestigationFigure, caption: 'Cada serviço entra numa etapa: detectar, reunir, investigar, corrigir e acompanhar.' },
  'Usuários': { Figure: AutoScalingFigure, caption: 'Load Balancer e Auto Scaling trabalham juntos, mas respondem a perguntas diferentes. No pico, o grupo sobe para 6; quando a demanda cai, volta para 2.' },
  'ECS + EC2:': { Figure: EcsLaunchFigure, caption: 'Com Fargate você continua responsável por código, imagem, IAM e rede; some a gestão dos hosts.' },
  'INTERNET': { Figure: VpcThreeTierFigure, caption: 'Só o ALB fica na subnet pública; API e banco ficam em subnets privadas, repetidas em duas AZs.' },
  'CSV/Parquet no S3': { Figure: GlueFigure, caption: 'O Glue descreve e prepara os dados; o Athena consulta direto no S3 usando esse catálogo.' },
  'Nova leitura de sensor': { Figure: TelemetryPipelineFigure, caption: 'Primeiro guardar o dado bruto, depois transformar e consultar.' },
  'CLIENTES': { Figure: CaseStudyFigure, caption: '(*) ALB ou API Gateway: a arquitetura não precisa dos dois.' },
  'Preciso executar código': { caption: 'Esta árvore está desenhada no diagrama interativo desta seção.' },
  'Usuário pede relatório': { caption: 'Este fluxo está animado no diagrama síncrono × assíncrono desta seção.' },
}

/** Chaves usadas para casar blocos de texto da apostila (exportado para o teste de integridade). */
export const FIGURE_KEYS = Object.keys(figures)

function firstLine(text: string): string {
  return text.split('\n').find((line) => line.trim() !== '')?.trim() ?? ''
}

export function TextFigure({ text }: { text: string }) {
  const entry = figures[firstLine(text)]
  if (!entry) return null
  const { Figure, caption } = entry
  if (!Figure) {
    return (
      <details className="text-figure-note">
        <summary>Esquema em texto · {caption}</summary>
        <pre>
          <code>{text}</code>
        </pre>
      </details>
    )
  }
  return (
    <figure className="text-figure">
      <div className="diagram-canvas mt-0">
        <Figure />
      </div>
      <figcaption>{caption}</figcaption>
      <details className="diagram-limits">
        <summary>Ver em texto</summary>
        <pre>
          <code>{text}</code>
        </pre>
      </details>
    </figure>
  )
}

export function hasTextFigure(text: string): boolean {
  return firstLine(text) in figures
}
