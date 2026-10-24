import { useId, useMemo, useState, type ReactNode } from 'react'

type Node = { id: string; title: string; kind: 'rect' | 'decision' }
type Edge = { from: string; to: string; label: string; dashed: boolean }

function cleanLabel(value: string) {
  return value.replace(/^['"`]|['"`]$/g, '').replace(/<br\s*\/?\s*>/gi, ' ').replace(/\s+/g, ' ').trim()
}

function parseGraph(code: string): { orientation: 'LR' | 'TD'; nodes: Node[]; edges: Edge[] } {
  const orientation = /flowchart\s+LR/.test(code) ? 'LR' : 'TD'
  const nodes: Node[] = []
  const edges: Edge[] = []
  const seen = new Set<string>()
  // Labels in [rectangles], {decisions} and [(database-like nodes)].
  const definitions = /\b([A-Za-z][\w]*)\s*(\[\([^\]]+\)\]|\[[^\]]+\]|\{[^}]+\})/g
  for (const match of code.matchAll(definitions)) {
    const id = match[1]!
    if (seen.has(id) || id === 'subgraph') continue
    seen.add(id)
    const shape = match[2]!
    const title = cleanLabel(shape.replace(/^\[\(|^\[|^\{|\)\]$|\]$|\}$/g, ''))
    nodes.push({ id, title, kind: shape.startsWith('{') ? 'decision' : 'rect' })
  }
  // Labels may appear inline between dashes. Keep the edge list faithful to the graph.
  for (const line of code.split('\n')) {
    if (!/-->|-\.->/.test(line)) continue
    const plain = line.replace(/\[\([^\]]+\)\]|\[[^\]]+\]|\{[^}]+\}/g, '')
    const pattern = /\b([A-Za-z][\w]*)\s*(-->|-\.->)\s*(?:\|([^|]+)\|\s*)?\b([A-Za-z][\w]*)/g
    for (const match of plain.matchAll(pattern)) {
      if (seen.has(match[1]!) && seen.has(match[4]!)) {
        edges.push({ from:match[1]!, to:match[4]!, label:match[3] ?? '', dashed:match[2]==='-.->' })
      }
    }
  }
  return { orientation, nodes, edges }
}

function layout(nodes: Node[], edges: Edge[], orientation: 'LR' | 'TD') {
  // Ignore feedback edges while assigning ranks; retain them in the drawing.
  const depths = new Map(nodes.map((node) => [node.id, 0]))
  const order = new Map(nodes.map((node, index) => [node.id, index]))
  for (let i = 0; i < nodes.length; i++) {
    let changed = false
    for (const edge of edges) {
      if (order.get(edge.from)! >= order.get(edge.to)!) continue
      const candidate = (depths.get(edge.from) ?? 0) + 1
      if (candidate > (depths.get(edge.to) ?? 0)) {
        depths.set(edge.to, candidate)
        changed = true
      }
    }
    if (!changed) break
  }
  // A stable source-order grouping avoids random reflow and preserves reading order.
  const levels = new Map<number, Node[]>()
  nodes.forEach((node) => {
    const depth = depths.get(node.id) ?? 0
    levels.set(depth,[...(levels.get(depth) ?? []),node])
  })
  const numLevels = Math.max(1,...levels.keys())+1
  const maxPerLevel = Math.max(1,...[...levels.values()].map((list) => list.length))
  const horizontal = orientation === 'LR'
  const width = horizontal ? Math.max(720,numLevels*226+42) : Math.max(760,maxPerLevel*234+42)
  const height = horizontal ? Math.max(310,maxPerLevel*106+56) : Math.max(350,numLevels*104+56)
  const points = new Map<string, { x:number; y:number }>()
  for (const [depth,items] of levels.entries()) {
    items.forEach((node,index) => {
      const x = horizontal ? 22+depth*226 : (width-items.length*234)/2+index*234+10
      const y = horizontal ? (height-items.length*106)/2+index*106+12 : 18+depth*104
      points.set(node.id,{ x, y })
    })
  }
  return { width, height, points }
}

function SequenceDiagram({ code }: { code: string }) {
  const messages = code.split('\n').map((line) => {
    const match = /^\s*(\w+)\s*(-->>|->>)\s*(\w+)\s*:\s*(.*)$/.exec(line)
    return match && { from:match[1]!,to:match[3]!,title:match[4]!,reply:match[2]==='-->>' }
  }).filter((item): item is {from:string;to:string;title:string;reply:boolean} => Boolean(item))
  const [step,setStep] = useState(0)
  const participants = Object.fromEntries([...code.matchAll(/^\s*participant\s+(\w+)\s+as\s+(.+)$/gm)].map((m) => [m[1]!,m[2]!]))
  const current = messages[step]
  return <div className="diagram-shell my-6" aria-label="Sequência interativa de agentes">
    <p className="diagram-kicker">DIAGRAMA INTERATIVO · AGENTES</p>
    <p className="diagram-title">Uma ferramenta não é uma permissão: acompanhe o fluxo</p>
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      {Object.entries(participants).map(([key,name]) => <div key={key} className="rounded-lg border border-[var(--color-line)] p-2 text-sm"><strong>{key}</strong> · {name}</div>)}
    </div>
    <div className="my-4 rounded-lg border border-[var(--color-navy)] bg-[var(--color-navy-wash)] p-4" role="status">
      <p className="m-0 text-xs uppercase tracking-wide">Passo {step+1} de {messages.length}</p>
      <p className="mt-2 font-semibold">{current ? `${participants[current.from] ?? current.from} → ${participants[current.to] ?? current.to}` : 'Fluxo não identificado'}</p>
      <p className="mt-1">{current?.title}</p>
    </div>
    <div className="flex flex-wrap gap-2">
      <button className="choice" disabled={step===0} onClick={() => setStep((p) => p-1)}>Anterior</button>
      <button className="choice" disabled={step>=messages.length-1} onClick={() => setStep((p) => p+1)}>Próximo</button>
      <button className="choice" onClick={() => setStep(0)}>Recomeçar</button>
    </div>
    <details className="diagram-limits"><summary>Limites deste desenho e sequência textual</summary>
      <p>Fluxo conceitual. A aprovação humana e as permissões devem ser verificadas no sistema real, não apenas descritas pelo modelo.</p>
      <pre className="overflow-auto text-xs">{code}</pre>
    </details>
  </div>
}

function wrap(label: string, size=27): string[] {
  if (label.length<=size) return [label]
  const words=label.split(' ');const lines:string[]=[];let line=''
  for(const word of words){const joined=line?line+' '+word:word;if(joined.length>size&&line){lines.push(line);line=word}else{line=joined}}
  if(line)lines.push(line)
  return lines.slice(0,3).map((part,i) => i===2 && lines.length>3 ? part.slice(0,size-1)+'…' : part)
}

export function AifDiagram({ code }: { code: string }) {
  const graph=useMemo(() => parseGraph(code),[code])
  const coords=useMemo(() => layout(graph.nodes,graph.edges,graph.orientation),[graph])
  const [active,setActive]=useState<string | null>(null)
  const markerId=useId()
  if (code.trimStart().startsWith('sequenceDiagram')) return <SequenceDiagram code={code}/>
  if (graph.nodes.length === 0) return <pre>{code}</pre>
  const center = (id:string) => { const p=coords.points.get(id);return p?{x:p.x+99,y:p.y+29}:null }
  const selected = graph.nodes.find((node) => node.id===active)
  return <div className="diagram-shell my-6" aria-label="Diagrama de estudo da AIF-C01">
    <p className="diagram-kicker">FIGURA DE ESTUDO · {graph.orientation==='LR'?'FLUXO':'RELAÇÕES'}</p>
    <p className="diagram-title">Explore as etapas e suas dependências</p>
    <div className="diagram-canvas mt-3 overflow-x-auto">
      <svg viewBox={`0 0 ${coords.width} ${coords.height}`} style={{minWidth:Math.min(coords.width,780),width:'100%'}} role="img" aria-label={`Esquema com ${graph.nodes.length} conceitos e ${graph.edges.length} conexões`}>
        <defs><marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="var(--color-ink-soft)" /></marker></defs>
        {graph.edges.map((edge,i) => {const a=center(edge.from),b=center(edge.to);if(!a||!b)return null
          const delta=graph.orientation==='LR'?{x:Math.sign(b.x-a.x)*99,y:0}:{x:0,y:Math.sign(b.y-a.y)*29}
          return <g key={`${edge.from}-${edge.to}-${i}`} opacity={active && edge.from!==active && edge.to!==active?0.18:0.7}>
            <line x1={a.x+delta.x} y1={a.y+delta.y} x2={b.x-delta.x} y2={b.y-delta.y} stroke="var(--color-ink-soft)" strokeWidth="1.5" strokeDasharray={edge.dashed?'5 4':undefined} markerEnd={`url(#${markerId})`} />
            {edge.label && <text x={(a.x+b.x)/2} y={(a.y+b.y)/2-6} fill="var(--color-ink-soft)" fontSize="11" textAnchor="middle">{edge.label}</text>}
          </g>})}
        {graph.nodes.map((node) => {const p=coords.points.get(node.id)!;const lines=wrap(node.title);const isActive=active===node.id
          return <g key={node.id} tabIndex={0} role="button" aria-label={`Selecionar conceito: ${node.title}`} onClick={() => setActive(node.id)} onKeyDown={(event) => {if(event.key==='Enter'||event.key===' '){event.preventDefault();setActive(node.id)}}} style={{cursor:'pointer'}}>
            <rect x={p.x} y={p.y} rx="10" width="198" height="58" fill={isActive?'var(--color-amber-soft)':'var(--color-paper)'} stroke={isActive?'var(--color-amber)':'var(--color-navy)'} strokeWidth={isActive?2.5:1.15} />
            {lines.map((line,i) => <text key={line} x={p.x+99} y={p.y+27-(lines.length-1)*8+i*15} textAnchor="middle" fill="var(--color-ink)" fontSize="12" fontWeight={isActive?700:500}>{line}</text>)}
          </g>})}
      </svg>
    </div>
    <p className="diagram-note" role="status">{selected?`Em foco: ${selected.title}. Conecte esse elemento ao problema de negócio descrito no texto.`:'Selecione um bloco para destacá-lo e identificar suas relações no fluxo.'}</p>
    <details className="diagram-limits"><summary>Limites do desenho / ver Mermaid original</summary>
      <p>Layout esquemático didático. Em fluxos com ciclos, cruzamentos ou decisões, consulte as conexões descritas no código Mermaid e a explicação do capítulo.</p>
      <pre className="overflow-auto text-xs">{code}</pre>
    </details>
  </div>
}

export function AifCompare({ title, left, right, children }: {title:string;left:{name:string;points:string[]};right:{name:string;points:string[]};children?:ReactNode}) {
  const [choice,setChoice]=useState<'left'|'right'|null>(null)
  return <aside className="diagram-shell my-6">
    <p className="diagram-kicker">COMPARADOR INTERATIVO</p><p className="diagram-title">{title}</p>
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      {([['left',left],['right',right]] as const).map(([key,item]) => <button key={key} className={`rounded-xl border p-4 text-left ${choice===key?'border-[var(--color-navy)] bg-[var(--color-navy-wash)]':'border-[var(--color-line)]'}`} onClick={() => setChoice(key)} aria-pressed={choice===key}>
        <strong>{item.name}</strong><ul className="mt-2 list-disc pl-4 text-sm">{item.points.map(p=><li key={p}>{p}</li>)}</ul>
      </button>)}
    </div>
    <p className="diagram-note" role="status">{choice ? `${choice==='left'?left.name:right.name}: confira o cenário no texto e explique por que esta abordagem se encaixa.` : 'Selecione uma alternativa para explorar os critérios.'}</p>
    {children}
  </aside>
}
