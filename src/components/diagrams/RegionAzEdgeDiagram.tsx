import { useState } from 'react'
import { Callout, Choices, DiagramShell, Svg, SvgNode, useSvgRefs, type Tone } from './kit'

type Placement = 'single' | 'multi-az' | 'multi-region'
type Failure = 'none' | 'instance' | 'az' | 'region'

const placements: readonly { id: Placement; label: string }[] = [
  { id: 'single', label: 'Single-AZ' },
  { id: 'multi-az', label: 'Multi-AZ' },
  { id: 'multi-region', label: 'Multi-Region' },
]

const failures: readonly { id: Failure; label: string }[] = [
  { id: 'none', label: 'Nada falha' },
  { id: 'instance', label: 'Uma instância' },
  { id: 'az', label: 'Uma AZ inteira' },
  { id: 'region', label: 'A Região inteira' },
]

interface Az {
  id: string
  region: 'A' | 'B'
  label: string
  x: number
  w: number
}

const azs: readonly Az[] = [
  { id: 'A-a', region: 'A', label: 'AZ a', x: 24, w: 116 },
  { id: 'A-b', region: 'A', label: 'AZ b', x: 150, w: 116 },
  { id: 'A-c', region: 'A', label: 'AZ c', x: 276, w: 116 },
  { id: 'B-a', region: 'B', label: 'AZ a', x: 436, w: 88 },
  { id: 'B-b', region: 'B', label: 'AZ b', x: 532, w: 88 },
]

const instancesFor: Record<Placement, readonly { id: string; az: string }[]> = {
  single: [
    { id: 'i1', az: 'A-a' },
    { id: 'i2', az: 'A-a' },
  ],
  'multi-az': [
    { id: 'i1', az: 'A-a' },
    { id: 'i2', az: 'A-b' },
  ],
  'multi-region': [
    { id: 'i1', az: 'A-a' },
    { id: 'i2', az: 'A-b' },
    { id: 'i3', az: 'B-a' },
  ],
}

const cost: Record<Placement, string> = {
  single: 'Custo e complexidade: menores',
  'multi-az': 'Custo e complexidade: intermediários',
  'multi-region': 'Custo e complexidade: maiores',
}

function isDown(failure: Failure, az: string, instance?: string): boolean {
  if (failure === 'region') return az.startsWith('A')
  if (failure === 'az') return az === 'A-a'
  if (failure === 'instance') return instance === 'i1'
  return false
}

function verdict(placement: Placement, failure: Failure): { tone: Tone; title: string; text: string } {
  if (failure === 'none') {
    return {
      tone: 'plain',
      title: 'Escolha o que falha',
      text: 'Região é uma área geográfica com várias AZs isoladas entre si. Edge locations ficam fora das Regiões: são pontos de presença do CloudFront e de outros serviços de borda, não uma quarta AZ, e não rodam RDS.',
    }
  }
  if (failure === 'instance') {
    return {
      tone: 'ok',
      title: 'A aplicação continua',
      text: 'Com duas instâncias atrás de um balanceador, perder uma não derruba o serviço — nem precisa de outra AZ para isso. Domínio de falha pequeno, resposta barata.',
    }
  }
  if (failure === 'az') {
    if (placement === 'single') {
      return {
        tone: 'bad',
        title: 'A aplicação cai',
        text: 'As duas instâncias estavam na AZ a. Ter várias instâncias não ajuda quando todas compartilham o mesmo domínio de falha.',
      }
    }
    return {
      tone: 'ok',
      title: 'A aplicação continua',
      text: 'A instância da AZ b segue atendendo. Isso exige que rede, banco (ex.: RDS Multi-AZ) e balanceador também estejam distribuídos — replicar só os dados não basta.',
    }
  }
  if (placement === 'multi-region') {
    return {
      tone: 'ok',
      title: 'A aplicação continua — se o failover foi preparado',
      text: 'A Região B assume desde que já esteja implantada, com dados replicados, roteamento (ex.: Route 53) e o procedimento testado. As edge locations entregam o que estiver em cache, mas não substituem a origem.',
    }
  }
  return {
    tone: 'bad',
    title: 'A aplicação cai',
    text: 'Multi-AZ protege contra a perda de uma AZ, não da Região: todas as AZs dela estão no mesmo domínio. As edge locations podem servir conteúdo já em cache, mas a origem não responde.',
  }
}

const W = 640
const H = 268

function RegionMap({ placement, failure }: { placement: Placement; failure: Failure }) {
  const refs = useSvgRefs()
  const instances = instancesFor[placement]
  const regionDown = failure === 'region'
  return (
    <>
      {/* edge locations */}
      {[60, 250, 470].map((x, i) => (
        <SvgNode
          key={x}
          x={x}
          y={6}
          w={110}
          h={30}
          rx={15}
          dashed
          label={`Edge location ${i + 1}`}
          tone={regionDown ? 'warn' : 'plain'}
          fontSize={12}
        />
      ))}
      <text x={W / 2} y={52} textAnchor="middle" fontSize={11} className="dg-soft">
        borda: cache e entrada de rede — fora das Regiões
      </text>
      {/* regiões */}
      {(['A', 'B'] as const).map((region) => {
        const x = region === 'A' ? 12 : 426
        const w = region === 'A' ? 392 : 204
        const down = regionDown && region === 'A'
        return (
          <g key={region}>
            <rect x={x} y={62} width={w} height={196} rx={12} className={down ? 'fill-bad-soft stroke-bad dg-fade' : 'fill-paper-raised stroke-ink-soft dg-fade'} strokeWidth={1.5} />
            <text x={x + 12} y={80} fontSize={12} fontWeight={600}>
              Região {region}
            </text>
          </g>
        )
      })}
      {azs.map((az) => {
        const down = isDown(failure, az.id) && failure !== 'instance'
        const unused = placement !== 'multi-region' && az.region === 'B'
        return (
          <g key={az.id} opacity={unused ? 0.4 : 1} className="dg-fade">
            <rect x={az.x} y={90} width={az.w} height={156} rx={8} className={down ? 'stroke-bad' : 'stroke-line'} fill={down ? refs.hatchBad : 'transparent'} fillOpacity={0.35} strokeWidth={down ? 2 : 1.2} strokeDasharray="4 3" />
            <text x={az.x + az.w / 2} y={108} fontSize={12} textAnchor="middle" fontWeight={600}>
              {az.label}
            </text>
          </g>
        )
      })}
      {instances.map((inst) => {
        const az = azs.find((item) => item.id === inst.az)
        if (!az) return null
        const siblings = instances.filter((item) => item.az === inst.az)
        const order = siblings.indexOf(inst)
        const size = 34
        const gap = 10
        const startX = az.x + az.w / 2 - (siblings.length * size + (siblings.length - 1) * gap) / 2
        const x = startX + order * (size + gap)
        const y = 150
        const down = isDown(failure, inst.az, inst.id)
        return (
          <g key={inst.id} className="dg-fade">
            <rect x={x} y={y} width={size} height={size} rx={6} className={down ? 'fill-bad-soft stroke-bad' : 'fill-navy stroke-navy'} strokeWidth={2} />
            {down ? (
              <path d={`M${x + 8},${y + 8} L${x + size - 8},${y + size - 8} M${x + size - 8},${y + 8} L${x + 8},${y + size - 8}`} className="stroke-bad" strokeWidth={3} />
            ) : (
              <text x={x + size / 2} y={y + size / 2 + 4} fontSize={11} textAnchor="middle" fontWeight={600} style={{ fill: 'var(--color-paper)' }}>
                app
              </text>
            )}
          </g>
        )
      })}
    </>
  )
}

export function RegionAzEdgeDiagram() {
  const [placement, setPlacement] = useState<Placement>('multi-az')
  const [failure, setFailure] = useState<Failure>('az')
  const result = verdict(placement, failure)

  return (
    <DiagramShell
      label="Mapa de Regiões, Availability Zones e edge locations com domínios de falha"
      kicker="Infraestrutura global"
      title="Onde a aplicação mora decide o que ela aguenta"
      lead="Combine a implantação com a falha. Cada escala de redundância cobre um domínio de falha — e só ele."
      limits="Duas Regiões e nomes de AZ ilustrativos. Falhas reais costumam ser parciais (um serviço, uma parte da AZ). Multi-Region pode ser ativo/ativo ou standby; o desenho não diferencia."
    >
      <Choices label="Implantação" options={placements} value={placement} onChange={setPlacement} />
      <Choices label="O que falha" options={failures} value={failure} onChange={setFailure} />
      <div className="diagram-canvas">
        <Svg width={W} height={H} minWidth={500} title={`Implantação ${placement}, falha: ${failure}`}>
          <RegionMap placement={placement} failure={failure} />
        </Svg>
      </div>
      <Callout tone={result.tone} title={result.title} live>
        <p className="m-0">{result.text}</p>
        <p className="m-0 mt-2">
          <span className="dg-chip">{cost[placement]}</span>
        </p>
      </Callout>
    </DiagramShell>
  )
}
