import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Callout, DiagramShell, Svg } from '@/components/diagrams/kit'
import { svgButton } from '@/components/diagrams/controls'
import { coursePath } from '@/courses/registry'

export interface BlueprintDomain {
  n: number
  name: string
  weight: number
  question: string
  chapters: number[]
}

const tones = ['fill-navy', 'fill-amber', 'fill-ok', 'fill-navy-soft', 'fill-bad']

/** Faixa clicável com o peso de cada domínio da prova e a escala de pontuação. */
export function ExamBlueprint({ courseId, code, domains, initial }: { courseId: string; code: string; domains: readonly BlueprintDomain[]; initial?: number }) {
  const [active, setActive] = useState(initial ?? domains[0]!.n)
  const domain = domains.find((item) => item.n === active)!
  const scored = Math.round((domain.weight / 100) * 50)
  let x = 0
  return (
    <DiagramShell
      label={`Pesos dos domínios da ${code} e escala de pontuação`}
      kicker="Mapa da prova"
      title={`Onde estão os pontos da ${code}?`}
      lead="Clique numa faixa para ver o que o domínio pergunta e onde ele é estudado neste curso."
      limits="Pesos do guia oficial do exame. As 15 questões não pontuadas não são identificadas na prova, e a nota é escalonada: acertos não viram pontos de forma linear."
    >
      <div className="diagram-canvas">
        <Svg width={640} height={150} minWidth={420} title="Faixa proporcional aos pesos dos domínios">
          {domains.map((item, i) => {
            const w = (item.weight / 100) * 620
            const left = 10 + x
            x += w
            const on = item.n === active
            return (
              <g key={item.n} {...svgButton(`Domínio ${item.n}: ${item.name}, ${item.weight}%`, () => setActive(item.n), on)}>
                <rect x={left} y={on ? 14 : 22} width={w - 4} height={on ? 64 : 48} rx={8} className={`dg-fade ${tones[i % tones.length]}`} opacity={on ? 1 : 0.45} />
                <text x={left + (w - 4) / 2} y={52} textAnchor="middle" fontSize={20} fontWeight={700} style={{ fill: 'var(--color-paper)' }}>{item.weight}%</text>
                <text x={left + (w - 4) / 2} y={100} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400}>D{item.n}</text>
              </g>
            )
          })}
          <text x={10} y={132} fontSize={11} className="dg-soft">65 questões = 50 pontuadas + 15 experimentais · escala 100–1.000 · aprovação em 700</text>
        </Svg>
      </div>
      <Callout tone="focus" title={`Domínio ${domain.n} · ${domain.name} (${domain.weight}%)`} live>
        <p className="m-0">“{domain.question}”</p>
        <p className="m-0 mt-1 text-ink-soft">Cerca de {scored} das 50 questões pontuadas, se a prova seguir o peso.</p>
        <p className="m-0 mt-1">
          Capítulos:{' '}
          {domain.chapters.map((n, i) => (
            <span key={n}>
              {i > 0 && ', '}
              <Link to={coursePath(courseId, `/ler/chapter-${String(n).padStart(2, '0')}`)}>{n}</Link>
            </span>
          ))}
        </p>
      </Callout>
      <div className="mt-3" aria-label="Escala de pontuação">
        <div className="relative h-3 rounded-full bg-line">
          <div className="absolute inset-y-0 left-0 rounded-l-full bg-bad-soft" style={{ width: `${(600 / 900) * 100}%` }} />
          <div className="absolute inset-y-0 right-0 rounded-r-full bg-ok" style={{ width: `${(300 / 900) * 100}%` }} />
        </div>
        <div className="relative mt-1 h-4 text-xs text-ink-soft">
          <span className="absolute left-0">100</span>
          <span className="absolute -translate-x-1/2 font-semibold text-ink" style={{ left: `${(600 / 900) * 100}%` }}>700 · aprovação</span>
          <span className="absolute right-0">1.000</span>
        </div>
        <p className="m-0 mt-1 text-xs text-ink-soft">Os domínios são compensatórios: ir bem num domínio pode cobrir uma lacuna em outro, desde que o total passe de 700.</p>
      </div>
    </DiagramShell>
  )
}
