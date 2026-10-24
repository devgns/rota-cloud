import { useId, type ReactNode } from 'react'
import type { Tone } from '@/components/diagrams/kit'

/* Peças pequenas dos diagramas AIF-C01, sobre o kit compartilhado do CLF-C02. */

export function Range({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  display?: ReactNode
}) {
  const id = useId()
  return (
    <div className="mt-2">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <label htmlFor={id} className="font-semibold">{label}</label>
        <span className="tabular-nums text-ink-soft">{display ?? value}</span>
      </div>
      <input
        id={id}
        type="range"
        className="mt-1 w-full accent-[var(--color-navy)]"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </div>
  )
}

const meterFill: Record<Tone, string> = {
  focus: 'bg-navy',
  ok: 'bg-ok',
  bad: 'bg-bad',
  warn: 'bg-amber',
  dim: 'bg-line',
  plain: 'bg-ink-soft',
}

/** Barra horizontal 0..1 com rótulo e valor. */
export function Meter({ label, value, display, tone = 'focus', hint }: { label: ReactNode; value: number; display?: ReactNode; tone?: Tone; hint?: ReactNode }) {
  const width = `${Math.max(0, Math.min(1, value)) * 100}%`
  return (
    <div className="text-sm">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">{label}</span>
        <span className="tabular-nums">{display ?? `${Math.round(value * 100)}%`}</span>
      </div>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div className={`dg-fade h-full rounded-full ${meterFill[tone]}`} style={{ width, transition: 'width 300ms ease' }} />
      </div>
      {hint && <p className="m-0 mt-0.5 text-xs text-ink-soft">{hint}</p>}
    </div>
  )
}

/** Botão liga/desliga no formato de chip. */
export function Toggle({ on, onChange, children }: { on: boolean; onChange: (on: boolean) => void; children: ReactNode }) {
  return (
    <button type="button" className="choice text-sm" aria-pressed={on} onClick={() => onChange(!on)}>
      {on ? '✓ ' : ''}
      {children}
    </button>
  )
}

export const pct = (value: number, digits = 0) => `${(value * 100).toFixed(digits).replace('.', ',')}%`
export const num = (value: number, digits = 0) => value.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits })

/** Props para tornar um <g> de SVG clicável e acessível pelo teclado. */
export function svgButton(label: string, onSelect: () => void, pressed?: boolean) {
  return {
    role: 'button',
    tabIndex: 0,
    'aria-label': label,
    'aria-pressed': pressed,
    style: { cursor: 'pointer' },
    onClick: (event: { stopPropagation: () => void }) => {
      event.stopPropagation()
      onSelect()
    },
    onKeyDown: (event: { key: string; preventDefault: () => void; stopPropagation: () => void }) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        event.stopPropagation()
        onSelect()
      }
    },
  } as const
}
