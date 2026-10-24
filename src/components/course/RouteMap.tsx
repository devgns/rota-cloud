import { useNavigate } from 'react-router-dom'
import { Svg } from '@/components/diagrams/kit'
import { svgButton } from '@/components/diagrams/controls'
import { coursePath } from '@/courses/registry'

interface Module { id: string; title: string; chapter_ids: readonly string[] }

/** Quebra o título em no máximo duas linhas de ~18 caracteres, sem cortar palavras. */
function twoLines(title: string, size = 18): string[] {
  const words = title.split(' ')
  const first: string[] = []
  while (words.length && [...first, words[0]].join(' ').length <= size) first.push(words.shift()!)
  if (!first.length) first.push(words.shift()!)
  return words.length ? [first.join(' '), words.join(' ')] : [first.join(' ')]
}

/** Mapa da trilha: uma estação por módulo, com anel de progresso; clique abre o primeiro capítulo. */
export function RouteMap({ courseId, modules, completed }: { courseId: string; modules: readonly Module[]; completed: readonly string[] }) {
  const navigate = useNavigate()
  const step = 540 / (modules.length - 1)
  const pos = (i: number) => ({ x: 50 + i * step, y: i % 2 ? 130 : 70 })
  const path = modules.map((_, i) => {
    const { x, y } = pos(i)
    if (!i) return `M${x} ${y}`
    const prev = pos(i - 1)
    return `C${prev.x + step / 2} ${prev.y} ${x - step / 2} ${y} ${x} ${y}`
  }).join(' ')
  return (
    <div className="diagram-canvas">
      <Svg width={640} height={210} minWidth={560} title="Mapa da trilha de estudo por módulo">
        <path d={path} fill="none" className="stroke-line" strokeWidth={8} strokeLinecap="round" />
        {modules.map((m, i) => {
          const done = m.chapter_ids.filter((id) => completed.includes(id)).length
          const share = done / m.chapter_ids.length
          const { x, y } = pos(i)
          const r = 20
          const arc = 2 * Math.PI * r
          const top = i % 2 === 0
          const lines = twoLines(m.title)
          const labelY = top ? y - 34 - (lines.length - 1) * 12 : y + 38
          return (
            <g key={m.id} {...svgButton(`${m.title}: ${done} de ${m.chapter_ids.length} capítulos`, () => navigate(coursePath(courseId, `/ler/${m.chapter_ids[0]}`)))}>
              <circle cx={x} cy={y} r={r} className={share === 1 ? 'fill-ok-soft stroke-ok' : 'fill-paper stroke-line'} strokeWidth={4} />
              <circle cx={x} cy={y} r={r} fill="none" className="stroke-amber" strokeWidth={4} strokeDasharray={`${arc * share} ${arc}`} transform={`rotate(-90 ${x} ${y})`} style={{ transition: 'stroke-dasharray 400ms ease' }} />
              <text x={x} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={700}>{i + 1}</text>
              {lines.map((line, j) => <text key={line} x={x} y={labelY + j * 12} textAnchor="middle" fontSize={10.5} fontWeight={600}>{line}</text>)}
              <text x={x} y={top ? y - 22 : labelY + lines.length * 12 + 1} textAnchor="middle" fontSize={10} className="dg-soft">{done}/{m.chapter_ids.length}</text>
            </g>
          )
        })}
      </Svg>
    </div>
  )
}
