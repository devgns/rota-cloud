import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Callout, DiagramShell, Svg, SvgArrow, SvgNode, type Rect } from '@/components/diagrams/kit'
import { coursePath } from '../../registry'
import { svgButton } from './parts'

const p = (n: number) => coursePath('aif-c01', `/ler/chapter-${String(n).padStart(2, '0')}`)

const tasks: readonly { id: string; name: string; chapters: number[] }[] = [
  { id: '1.1', name: 'Terminologia e conceitos de IA e ML', chapters: [2, 3, 4, 6, 7, 26] },
  { id: '1.2', name: 'Casos de uso de IA', chapters: [2, 3, 4, 7, 25] },
  { id: '1.3', name: 'Ciclo de desenvolvimento de ML', chapters: [3, 5, 6, 17, 25] },
  { id: '2.1', name: 'Conceitos básicos de GenAI', chapters: [8, 9, 10, 11, 26] },
  { id: '2.2', name: 'Capacidades e limitações de GenAI', chapters: [8, 9, 10, 11, 13, 17, 20] },
  { id: '2.3', name: 'Serviços AWS para GenAI', chapters: [12, 14, 15, 24, 25] },
  { id: '3.1', name: 'Design de aplicações com FMs', chapters: [11, 12, 13, 14, 15, 16, 18, 25] },
  { id: '3.2', name: 'Prompt e engenharia de contexto', chapters: [9, 13, 14, 15] },
  { id: '3.3', name: 'Treino e fine-tuning de FMs', chapters: [5, 11, 16] },
  { id: '3.4', name: 'Avaliar FMs e aplicações', chapters: [6, 17, 18, 25] },
  { id: '4.1', name: 'Sistemas de IA responsável', chapters: [19, 20, 25] },
  { id: '4.2', name: 'Modelos transparentes e explicáveis', chapters: [19, 20, 23] },
  { id: '5.1', name: 'Proteger sistemas de IA', chapters: [14, 15, 21, 22, 25] },
  { id: '5.2', name: 'Governança e conformidade', chapters: [21, 22, 23, 25] },
]

const CH = Array.from({ length: 25 }, (_, i) => i + 2)

export function CoverageMapDiagram() {
  const [task, setTask] = useState('3.1')
  const item = tasks.find((t) => t.id === task)!
  const cell = 21
  const left = 44
  return (
    <DiagramShell
      label="Mapa de calor das tarefas oficiais por capítulo"
      kicker="Matriz de cobertura"
      title="Cada tarefa oficial, e onde ela é ensinada"
      lead="Linhas são as 14 tarefas do guia; colunas, os capítulos 2 a 26. Clique numa linha."
      limits="Mapeamento editorial, não endosso da AWS nem garantia de incidência por subtema."
    >
      <div className="diagram-canvas">
        <Svg width={left + CH.length * cell + 8} height={30 + tasks.length * cell + 6} minWidth={480} title="Grade de tarefas por capítulos">
          {CH.map((c, j) => <text key={c} x={left + j * cell + cell / 2} y={20} fontSize={9.5} textAnchor="middle" className="dg-soft">{c}</text>)}
          {tasks.map((t, i) => {
            const on = t.id === task
            return (
              <g key={t.id} {...svgButton(`Tarefa ${t.id}: ${t.name}`, () => setTask(t.id), on)}>
                <rect x={0} y={28 + i * cell} width={left + CH.length * cell} height={cell - 2} rx={4} className={on ? 'fill-amber-soft' : 'fill-paper'} opacity={on ? 1 : 0} />
                <text x={4} y={28 + i * cell + 14} fontSize={11} fontWeight={on ? 700 : 600}>{t.id}</text>
                {CH.map((c, j) => t.chapters.includes(c) && <rect key={c} x={left + j * cell + 2} y={28 + i * cell + 2} width={cell - 5} height={cell - 6} rx={3} className={`dg-fade ${on ? 'fill-navy' : 'fill-navy-soft'}`} opacity={on ? 1 : 0.35 + 0.1 * Number(t.id[0])} />)}
              </g>
            )
          })}
        </Svg>
      </div>
      <Callout tone="focus" title={`Tarefa ${item.id} · ${item.name}`} live>
        <span className="flex flex-wrap gap-x-2">Estude: {item.chapters.map((c) => <Link key={c} to={p(c)}>cap. {c}</Link>)}</span>
      </Callout>
    </DiagramShell>
  )
}

/* 30.2 — trilha por dependência */

type Step = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i'

const steps: Record<Step, Rect & { label: string; chapters: [number, number] }> = {
  a: { x: 8, y: 20, w: 150, h: 44, label: 'Problema e fundamentos', chapters: [1, 2] },
  b: { x: 8, y: 100, w: 150, h: 44, label: 'Dados e aprendizado', chapters: [3, 4] },
  c: { x: 8, y: 180, w: 150, h: 44, label: 'Treino, inferência, métricas', chapters: [5, 7] },
  d: { x: 220, y: 180, w: 150, h: 44, label: 'FMs, tokens, embeddings', chapters: [8, 12] },
  e: { x: 220, y: 100, w: 150, h: 44, label: 'Prompts, contexto, RAG', chapters: [13, 14] },
  f: { x: 220, y: 20, w: 150, h: 44, label: 'Agentes, ferramentas, MCP', chapters: [15, 15] },
  g: { x: 440, y: 180, w: 150, h: 44, label: 'Customização e avaliação', chapters: [16, 18] },
  h: { x: 440, y: 100, w: 150, h: 44, label: 'Responsável, segurança, governança', chapters: [19, 23] },
  i: { x: 440, y: 20, w: 150, h: 44, label: 'Caso, questões e revisão', chapters: [24, 30] },
}

const links: readonly [Step, Step][] = [['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e'], ['e', 'f'], ['d', 'g'], ['f', 'h'], ['g', 'h'], ['h', 'i']]

export function DependencyTrailDiagram() {
  const [active, setActive] = useState<Step>('d')
  const s = steps[active]
  const before = new Set<Step>()
  const walk = (id: Step) => links.filter(([, to]) => to === id).forEach(([from]) => { if (!before.has(from)) { before.add(from); walk(from) } })
  walk(active)
  return (
    <DiagramShell
      label="Trilha de estudo por dependência conceitual"
      kicker="Trilha por dependência"
      title="O que você precisa saber antes de cada etapa"
      lead="Clique numa etapa: os pré-requisitos acendem."
      limits="Simplificação pedagógica. Segurança e qualidade existem desde o início do projeto, mesmo estudadas em profundidade depois."
    >
      <div className="diagram-canvas">
        <Svg width={600} height={240} minWidth={480} title="Grafo de nove etapas de estudo">
          {links.map(([a, b]) => <SvgArrow key={`${a}${b}`} from={steps[a]} to={steps[b]} state={(before.has(a) || a === active) && (before.has(b) || b === active) ? 'hot' : 'idle'} />)}
          {(Object.keys(steps) as Step[]).map((id) => (
            <g key={id} {...svgButton(steps[id].label, () => setActive(id), id === active)}>
              <SvgNode {...steps[id]} sub={`cap. ${steps[id].chapters[0]}${steps[id].chapters[1] !== steps[id].chapters[0] ? `–${steps[id].chapters[1]}` : ''}`} tone={id === active ? 'warn' : before.has(id) ? 'focus' : 'plain'} fontSize={11} />
            </g>
          ))}
        </Svg>
      </div>
      <Callout tone="focus" title={s.label} live>
        {before.size ? `Antes, domine: ${[...before].map((b) => steps[b].label).join(' · ')}.` : 'Ponto de partida: nenhum pré-requisito.'}{' '}
        <Link to={p(s.chapters[0])}>Abrir capítulo {s.chapters[0]}</Link>
      </Callout>
    </DiagramShell>
  )
}
