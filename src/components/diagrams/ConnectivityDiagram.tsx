import { useState } from 'react'
import { Callout, Choices, DiagramShell, Svg, SvgArrow, SvgNode, type Rect, type Tone } from './kit'

type Mode = 's2s' | 'client' | 'dx' | 'tgw' | 'peering' | 'privatelink'
type NodeId = 'dc' | 'laptop' | 'dxloc' | 'vpcA' | 'vpcB' | 'vpcC' | 'tgw' | 'svc'

const modes: readonly { id: Mode; label: string }[] = [
  { id: 's2s', label: 'Site-to-Site VPN' },
  { id: 'client', label: 'Client VPN' },
  { id: 'dx', label: 'Direct Connect' },
  { id: 'tgw', label: 'Transit Gateway' },
  { id: 'peering', label: 'VPC Peering' },
  { id: 'privatelink', label: 'PrivateLink / endpoint' },
]

const nodes: Record<NodeId, Rect & { label: string; sub?: string; dashed?: boolean }> = {
  dc: { x: 8, y: 30, w: 130, h: 54, label: 'Data center', sub: 'rede corporativa' },
  laptop: { x: 8, y: 236, w: 130, h: 46, label: 'Notebook remoto' },
  dxloc: { x: 186, y: 132, w: 124, h: 44, label: 'Local DX', sub: 'parceiro', dashed: true },
  vpcA: { x: 350, y: 20, w: 120, h: 50, label: 'VPC A' },
  vpcB: { x: 530, y: 20, w: 120, h: 50, label: 'VPC B' },
  vpcC: { x: 530, y: 132, w: 120, h: 50, label: 'VPC C' },
  tgw: { x: 360, y: 132, w: 110, h: 44, label: 'Transit GW', sub: 'hub' },
  svc: { x: 420, y: 236, w: 230, h: 46, label: 'Serviço', sub: 'S3, DynamoDB ou serviço de outra conta' },
}

interface ModeInfo {
  edges: readonly { from: NodeId; to: NodeId; state: 'hot' | 'bad'; label?: string; dashed?: boolean; both?: boolean }[]
  used: readonly NodeId[]
  facts: readonly [string, string][]
  tone: Tone
  text: string
}

const info: Record<Mode, ModeInfo> = {
  s2s: {
    edges: [{ from: 'dc', to: 'vpcA', state: 'hot', label: 'túnel IPsec pela internet', dashed: true, both: true }],
    used: ['dc', 'vpcA'],
    facts: [['Meio', 'internet pública'], ['Criptografia', 'sim, IPsec'], ['Liga', 'rede inteira ↔ VPC']],
    tone: 'focus',
    text: 'Rápida de montar, usa a internet que você já tem. Desempenho varia com a internet.',
  },
  client: {
    edges: [{ from: 'laptop', to: 'vpcA', state: 'hot', label: 'VPN do dispositivo', dashed: true, both: true }],
    used: ['laptop', 'vpcA'],
    facts: [['Meio', 'internet pública'], ['Criptografia', 'sim, TLS'], ['Liga', 'uma pessoa ↔ VPC']],
    tone: 'focus',
    text: 'Para usuários individuais em home office, não para ligar um prédio inteiro.',
  },
  dx: {
    edges: [
      { from: 'dc', to: 'dxloc', state: 'hot', label: 'circuito dedicado' },
      { from: 'dxloc', to: 'vpcA', state: 'hot' },
    ],
    used: ['dc', 'dxloc', 'vpcA'],
    facts: [['Meio', 'link dedicado, fora da internet'], ['Criptografia', 'não por padrão'], ['Liga', 'rede inteira ↔ AWS']],
    tone: 'warn',
    text: 'Banda e latência previsíveis. Privado não é o mesmo que criptografado: se precisar, combine com VPN sobre o DX ou TLS. Leva semanas para provisionar.',
  },
  tgw: {
    edges: [
      { from: 'dc', to: 'tgw', state: 'hot', label: 'VPN ou DX' },
      { from: 'vpcA', to: 'tgw', state: 'hot', both: true },
      { from: 'vpcB', to: 'tgw', state: 'hot', both: true },
      { from: 'vpcC', to: 'tgw', state: 'hot', both: true },
    ],
    used: ['dc', 'tgw', 'vpcA', 'vpcB', 'vpcC'],
    facts: [['Topologia', 'hub-and-spoke'], ['Transitivo', 'sim, via tabelas do hub'], ['Liga', 'muitas VPCs e redes']],
    tone: 'focus',
    text: 'Cada rede se conecta uma vez ao hub, em vez de N×N conexões ponto a ponto.',
  },
  peering: {
    edges: [
      { from: 'vpcA', to: 'vpcB', state: 'hot', label: 'peering', both: true },
      { from: 'vpcB', to: 'vpcC', state: 'hot', label: 'peering', both: true },
      { from: 'vpcA', to: 'vpcC', state: 'bad', label: 'A ↛ C', dashed: true },
    ],
    used: ['vpcA', 'vpcB', 'vpcC'],
    facts: [['Topologia', 'ponto a ponto'], ['Transitivo', 'não'], ['Liga', 'duas VPCs']],
    tone: 'warn',
    text: 'A fala com B e B fala com C, mas A não alcança C passando por B. Com muitas VPCs, o número de peerings explode — é aí que entra o Transit Gateway.',
  },
  privatelink: {
    edges: [{ from: 'vpcC', to: 'svc', state: 'hot', label: 'endpoint na VPC' }],
    used: ['vpcC', 'svc'],
    facts: [['Meio', 'rede da AWS, sem internet'], ['Exige NAT/IGW', 'não'], ['Liga', 'VPC → um serviço']],
    tone: 'focus',
    text: 'Consome um serviço específico por endereço privado. Gateway endpoint (S3, DynamoDB) ou interface endpoint (PrivateLink) para muitos outros e para serviços de outras contas.',
  },
}

export function ConnectivityDiagram() {
  const [mode, setMode] = useState<Mode>('dx')
  const current = info[mode]
  return (
    <DiagramShell
      label="Opções de conectividade híbrida e privada entre data center, VPCs e serviços"
      kicker="Conectividade"
      title="Seis jeitos de ligar redes, seis perguntas diferentes"
      lead="Escolha a opção e veja o que ela conecta, por onde passa e se cifra o tráfego."
      limits="Desenho conceitual: DX normalmente termina em um gateway e pode alcançar várias VPCs; VPN também pode terminar num Transit Gateway. Preço, banda e redundância ficam de fora."
    >
      <Choices label="Opção de conectividade" options={modes} value={mode} onChange={setMode} />
      <div className="diagram-canvas">
        <Svg width={660} height={292} minWidth={500} title={`Conectividade: ${mode}`}>
          <rect x={336} y={6} width={322} height={194} rx={12} className="fill-paper-raised stroke-line" strokeDasharray="6 4" />
          <text x={650} y={196} fontSize={11} textAnchor="end" className="dg-soft">
            AWS
          </text>
          {current.edges.map((edge) => (
            <SvgArrow key={`${edge.from}-${edge.to}`} from={nodes[edge.from]} to={nodes[edge.to]} state={edge.state} label={edge.label} dashed={edge.dashed} both={edge.both} />
          ))}
          {(Object.keys(nodes) as NodeId[]).map((id) => (
            <SvgNode key={id} {...nodes[id]} fontSize={12} tone={current.used.includes(id) ? 'focus' : 'dim'} />
          ))}
        </Svg>
      </div>
      <dl className="m-0 mt-2 grid grid-cols-3 gap-2 text-sm">
        {current.facts.map(([k, v]) => (
          <div key={k} className="dg-box">
            <dt className="text-xs text-ink-soft">{k}</dt>
            <dd className="m-0 font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      <Callout tone={current.tone} live>
        {current.text}
      </Callout>
    </DiagramShell>
  )
}
