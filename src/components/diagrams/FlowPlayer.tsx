import { Svg, SvgArrow, SvgNode, StepperControls, useStepper, type Rect, type Tone } from './kit'

export interface FlowNode extends Rect {
  id: string
  label: string
  sub?: string
  dashed?: boolean
}

export interface FlowEdge {
  from: string
  to: string
  label?: string
  dashed?: boolean
}

export interface FlowToken {
  id: string
  label: string
  at: string
  tone?: 'navy' | 'amber' | 'ok' | 'bad'
}

export interface FlowFrame {
  caption: string
  tokens: readonly FlowToken[]
  /** Arestas em destaque, no formato "origem>destino". */
  hot?: readonly string[]
  nodeTones?: Readonly<Record<string, Tone>>
  /** Rótulo alternativo do nó neste quadro (ex.: um relógio). */
  subs?: Readonly<Record<string, string>>
}

const tokenClass: Record<NonNullable<FlowToken['tone']>, string> = {
  navy: 'fill-navy stroke-navy',
  amber: 'fill-amber stroke-amber',
  ok: 'fill-ok stroke-ok',
  bad: 'fill-bad stroke-bad',
}

function tokenPositions(nodes: readonly FlowNode[], tokens: readonly FlowToken[]) {
  const counts = new Map<string, number>()
  const totals = new Map<string, number>()
  for (const token of tokens) totals.set(token.at, (totals.get(token.at) ?? 0) + 1)
  return tokens.map((token) => {
    const node = nodes.find((item) => item.id === token.at)
    const index = counts.get(token.at) ?? 0
    counts.set(token.at, index + 1)
    if (!node) return { token, x: 0, y: 0 }
    const total = totals.get(token.at) ?? 1
    const perRow = Math.max(1, Math.floor((node.w - 8) / 22))
    const row = Math.floor(index / perRow)
    const col = index % perRow
    const inRow = Math.min(perRow, total - row * perRow)
    const x = node.x + node.w / 2 - ((inRow - 1) * 22) / 2 + col * 22
    const y = node.y + node.h - 14 - row * 20
    return { token, x, y }
  })
}

export function FlowPlayer({
  title,
  width,
  height,
  minWidth = 480,
  nodes,
  edges,
  frames,
}: {
  title: string
  width: number
  height: number
  minWidth?: number
  nodes: readonly FlowNode[]
  edges: readonly FlowEdge[]
  frames: readonly FlowFrame[]
}) {
  const stepper = useStepper(frames.length, 1700)
  const frame = frames[stepper.step] ?? frames[0]
  if (!frame) return null
  const placed = tokenPositions(nodes, frame.tokens)

  return (
    <div>
      <StepperControls stepper={stepper} total={frames.length} />
      <div className="diagram-canvas mt-0">
        <Svg width={width} height={height} minWidth={minWidth} title={title}>
          {edges.map((edge) => {
            const from = nodes.find((item) => item.id === edge.from)
            const to = nodes.find((item) => item.id === edge.to)
            if (!from || !to) return null
            const key = `${edge.from}>${edge.to}`
            return <SvgArrow key={key} from={from} to={to} label={edge.label} dashed={edge.dashed} state={frame.hot?.includes(key) ? 'hot' : 'idle'} />
          })}
          {nodes.map((node) => (
            <SvgNode key={node.id} {...node} sub={frame.subs?.[node.id] ?? node.sub} align="top" fontSize={12} tone={frame.nodeTones?.[node.id] ?? 'plain'} />
          ))}
          {placed.map(({ token, x, y }) => (
            <g key={token.id} className="dg-move" style={{ transform: `translate(${x}px, ${y}px)` }}>
              <circle r={9} className={tokenClass[token.tone ?? 'navy']} />
              <text y={4} textAnchor="middle" fontSize={10} fontWeight={700} style={{ fill: 'var(--color-paper)' }}>
                {token.label}
              </text>
            </g>
          ))}
        </Svg>
      </div>
      <p className="m-0 mt-2 min-h-[3rem] rounded-md border border-line bg-paper px-3 py-2 text-sm" role="status">
        <span className="font-semibold tabular-nums">{stepper.step + 1}. </span>
        {frame.caption}
      </p>
    </div>
  )
}
