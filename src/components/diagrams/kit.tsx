import { createContext, useContext, useEffect, useId, useState, type ReactNode } from 'react'

export type Tone = 'focus' | 'ok' | 'bad' | 'warn' | 'dim' | 'plain'

export function DiagramShell({
  label,
  kicker,
  title,
  lead,
  limits,
  children,
}: {
  label: string
  kicker: string
  title: string
  lead?: ReactNode
  limits?: ReactNode
  children: ReactNode
}) {
  return (
    <aside aria-label={label} className="diagram-shell">
      <p className="diagram-kicker">{kicker}</p>
      <p className="diagram-title">{title}</p>
      {lead && <p className="diagram-lead">{lead}</p>}
      {children}
      {limits && (
        <details className="diagram-limits">
          <summary>Limites deste desenho</summary>
          <p>{limits}</p>
        </details>
      )}
    </aside>
  )
}

export interface Option<T extends string> {
  id: T
  label: string
}

export function Choices<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly Option<T>[]
  value: T | null
  onChange: (value: T) => void
}) {
  return (
    <div className="choice-row" role="group" aria-label={label}>
      {options.map((item) => (
        <button
          key={item.id}
          type="button"
          className="choice"
          aria-pressed={item.id === value}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

const calloutTone: Record<Tone, string> = {
  focus: 'border-navy bg-navy-wash',
  ok: 'border-ok bg-ok-soft',
  bad: 'border-bad bg-bad-soft',
  warn: 'border-amber bg-amber-soft',
  dim: 'border-line',
  plain: 'border-line',
}

export function Callout({
  tone = 'plain',
  title,
  children,
  live = false,
}: {
  tone?: Tone
  title?: ReactNode
  children?: ReactNode
  live?: boolean
}) {
  return (
    <div className={`mt-3 rounded-md border px-3 py-2 text-sm ${calloutTone[tone]}`} role={live ? 'status' : undefined}>
      {title && <p className="m-0 font-semibold">{title}</p>}
      {children && <div className={title ? 'mt-1' : ''}>{children}</div>}
    </div>
  )
}

/** Caixa HTML com tom semântico (usa .dg-box em index.css). */
export function Box({
  tone = 'plain',
  className = '',
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`dg-box ${className}`} data-tone={tone}>
      {children}
    </div>
  )
}

export function Svg({
  width,
  height,
  title,
  minWidth,
  children,
}: {
  width: number
  height: number
  title: string
  minWidth?: number
  children: ReactNode
}) {
  const id = useId()
  return (
    <svg
      className="diagram-svg"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={id}
      style={minWidth ? { minWidth } : undefined}
    >
      <title id={id}>{title}</title>
      <defs>
        <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="fill-ink-soft" />
        </marker>
        <marker id={`${id}-arrow-hot`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="fill-navy" />
        </marker>
        <marker id={`${id}-arrow-bad`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="fill-bad" />
        </marker>
        <pattern id={`${id}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className="stroke-amber" strokeWidth="2" />
        </pattern>
        <pattern id={`${id}-hatch-bad`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" className="stroke-bad" strokeWidth="2" />
        </pattern>
      </defs>
      <SvgIds.Provider value={id}>{children}</SvgIds.Provider>
    </svg>
  )
}

const SvgIds = createContext('')

/** Referências aos markers e patterns do <Svg> atual. */
export function useSvgRefs() {
  const id = useContext(SvgIds)
  return {
    arrow: `url(#${id}-arrow)`,
    arrowHot: `url(#${id}-arrow-hot)`,
    arrowBad: `url(#${id}-arrow-bad)`,
    hatch: `url(#${id}-hatch)`,
    hatchBad: `url(#${id}-hatch-bad)`,
  }
}

const nodeFill: Record<Tone, string> = {
  focus: 'fill-navy-wash stroke-navy',
  ok: 'fill-ok-soft stroke-ok',
  bad: 'fill-bad-soft stroke-bad',
  warn: 'fill-amber-soft stroke-amber',
  dim: 'fill-paper stroke-line',
  plain: 'fill-paper stroke-line',
}

export function SvgNode({
  x,
  y,
  w,
  h,
  label,
  sub,
  tone = 'plain',
  dashed = false,
  rx = 8,
  align = 'center',
  fontSize = 13,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  sub?: string
  tone?: Tone
  dashed?: boolean
  rx?: number
  align?: 'center' | 'top'
  fontSize?: number
}) {
  const textY = align === 'top' ? y + 17 : sub ? y + h / 2 - 3 : y + h / 2 + 4
  return (
    <g className="dg-fade" opacity={tone === 'dim' ? 0.45 : 1}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        className={nodeFill[tone]}
        strokeWidth={tone === 'focus' || tone === 'bad' || tone === 'ok' ? 2 : 1.25}
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      <text x={x + w / 2} y={textY} textAnchor="middle" fontSize={fontSize} fontWeight={600}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={textY + 15} textAnchor="middle" fontSize={fontSize - 2} className="dg-soft">
          {sub}
        </text>
      )}
    </g>
  )
}

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** Ponto onde a reta entre os centros cruza a borda do retângulo. */
function edgePoint(from: Rect, to: Rect): [number, number] {
  const cx = from.x + from.w / 2
  const cy = from.y + from.h / 2
  const dx = to.x + to.w / 2 - cx
  const dy = to.y + to.h / 2 - cy
  if (dx === 0 && dy === 0) return [cx, cy]
  const sx = dx === 0 ? Infinity : from.w / 2 / Math.abs(dx)
  const sy = dy === 0 ? Infinity : from.h / 2 / Math.abs(dy)
  const s = Math.min(sx, sy)
  return [cx + dx * s, cy + dy * s]
}

export function SvgArrow({
  from,
  to,
  state = 'idle',
  label,
  both = false,
  dashed = false,
}: {
  from: Rect
  to: Rect
  state?: 'idle' | 'hot' | 'bad' | 'dim'
  label?: string
  both?: boolean
  dashed?: boolean
}) {
  const refs = useSvgRefs()
  const [x1, y1] = edgePoint(from, to)
  const [x2, y2] = edgePoint(to, from)
  const stroke = state === 'hot' ? 'stroke-navy' : state === 'bad' ? 'stroke-bad' : 'stroke-ink-soft'
  const marker = state === 'hot' ? refs.arrowHot : state === 'bad' ? refs.arrowBad : refs.arrow
  return (
    <g className="dg-fade" opacity={state === 'dim' ? 0.3 : 1}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={stroke}
        strokeWidth={state === 'hot' || state === 'bad' ? 2.5 : 1.4}
        strokeDasharray={dashed ? '5 4' : undefined}
        markerEnd={marker}
        markerStart={both ? marker : undefined}
      />
      {label &&
        (Math.abs(x2 - x1) >= Math.abs(y2 - y1) ? (
          <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} fontSize={11} textAnchor="middle" className="dg-soft">
            {label}
          </text>
        ) : (
          <text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 + 4} fontSize={11} className="dg-soft">
            {label}
          </text>
        ))}
    </g>
  )
}

/* ---------- Quiz de cenários reaproveitável ---------- */

export interface QuizOption<O extends string> {
  id: O
  label: string
  /** O que esta opção faz, usado para explicar uma escolha errada. */
  role: string
}

export interface QuizScenario<O extends string> {
  id: string
  prompt: string
  answer: O
  why: string
}

export interface QuizFocus<O extends string, S extends QuizScenario<O> = QuizScenario<O>> {
  scenario: S
  picked: O | undefined
}

export function ScenarioQuiz<O extends string, S extends QuizScenario<O> = QuizScenario<O>>({
  label,
  scenarios,
  options,
  visual,
}: {
  label: string
  scenarios: readonly S[]
  options: readonly QuizOption<O>[]
  visual?: (focus: QuizFocus<O, S>) => ReactNode
}) {
  const [index, setIndex] = useState(0)
  const [picks, setPicks] = useState<Record<string, O>>({})
  const scenario = scenarios[index] ?? scenarios[0]
  if (!scenario) return null
  const picked = picks[scenario.id]
  const answered = Object.keys(picks).length
  const correct = scenarios.filter((item) => picks[item.id] === item.answer).length
  const pickedOption = options.find((item) => item.id === picked)
  const answerOption = options.find((item) => item.id === scenario.answer)

  return (
    <div className="mt-3">
      {visual && <div className="diagram-canvas">{visual({ scenario, picked })}</div>}
      <div className="mt-3 rounded-md border border-line bg-paper px-3 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-soft">
          <span className="font-semibold uppercase tracking-wide">
            Cenário {index + 1} de {scenarios.length}
          </span>
          <span className="tabular-nums">
            {answered === 0 ? 'Nenhuma resposta ainda' : `${correct} de ${answered} certas`}
          </span>
        </div>
        <p className="m-0 mt-2 font-serif text-[1.02rem] leading-snug">{scenario.prompt}</p>
        <div className="choice-row" role="group" aria-label={label}>
          {options.map((item) => {
            const isPicked = item.id === picked
            const isAnswer = picked !== undefined && item.id === scenario.answer
            return (
              <button
                key={item.id}
                type="button"
                className="choice"
                aria-pressed={isPicked}
                onClick={() => setPicks((current) => ({ ...current, [scenario.id]: item.id }))}
                style={isAnswer && !isPicked ? { borderColor: 'var(--color-ok)', borderWidth: 2 } : undefined}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        <div role="status">
          {picked === undefined ? null : picked === scenario.answer ? (
            <Callout tone="ok" title={`Certo: ${answerOption?.label ?? ''}`}>
              {scenario.why}
            </Callout>
          ) : (
            <Callout tone="bad" title={`A resposta é ${answerOption?.label ?? ''}`}>
              <p className="m-0">{scenario.why}</p>
              {pickedOption && (
                <p className="m-0 mt-1 text-ink-soft">
                  {pickedOption.label}: {pickedOption.role}
                </p>
              )}
            </Callout>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1" aria-hidden="true">
            {scenarios.map((item, i) => {
              const p = picks[item.id]
              const color = p === undefined ? 'bg-line' : p === item.answer ? 'bg-ok' : 'bg-bad'
              return <span key={item.id} className={`inline-block h-2 w-2 rounded-full ${color} ${i === index ? 'ring-2 ring-navy ring-offset-1 ring-offset-paper' : ''}`} />
            })}
          </div>
          <div className="flex gap-2">
            <button type="button" className="choice" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>
              Anterior
            </button>
            <button
              type="button"
              className="choice"
              disabled={index === scenarios.length - 1}
              onClick={() => setIndex((i) => Math.min(scenarios.length - 1, i + 1))}
            >
              Próximo cenário
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Player de quadros para fluxos ---------- */

export function useStepper(total: number, intervalMs = 1500) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return undefined
    if (step >= total - 1) {
      setPlaying(false)
      return undefined
    }
    const timer = window.setTimeout(() => setStep((s) => Math.min(total - 1, s + 1)), intervalMs)
    return () => window.clearTimeout(timer)
  }, [playing, step, total, intervalMs])
  return {
    step,
    playing,
    reset: () => {
      setPlaying(false)
      setStep(0)
    },
    go: (value: number) => {
      setPlaying(false)
      setStep(Math.max(0, Math.min(total - 1, value)))
    },
    play: () => {
      if (step >= total - 1) setStep(0)
      setPlaying(true)
    },
    pause: () => setPlaying(false),
  }
}

export function StepperControls({
  stepper,
  total,
}: {
  stepper: ReturnType<typeof useStepper>
  total: number
}) {
  return (
    <div className="choice-row items-center" role="group" aria-label="Controle do fluxo">
      <button type="button" className="choice" onClick={stepper.reset} disabled={stepper.step === 0 && !stepper.playing}>
        Recomeçar
      </button>
      <button type="button" className="choice" onClick={() => stepper.go(stepper.step - 1)} disabled={stepper.step === 0}>
        Passo anterior
      </button>
      <button type="button" className="choice" onClick={() => stepper.go(stepper.step + 1)} disabled={stepper.step >= total - 1}>
        Próximo passo
      </button>
      <button type="button" className="choice" aria-pressed={stepper.playing} onClick={stepper.playing ? stepper.pause : stepper.play}>
        {stepper.playing ? 'Pausar' : 'Reproduzir'}
      </button>
      <span className="text-sm tabular-nums text-ink-soft">
        {stepper.step + 1}/{total}
      </span>
    </div>
  )
}
