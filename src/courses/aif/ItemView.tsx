import { ArrowDown, ArrowUp } from 'lucide-react'
import { FORMAT_LABEL, grade, isAnswered, type Item } from './items'
import type { Answer } from './progress'

const ok = 'border-[var(--color-ok)] bg-[var(--color-ok-soft)]'
const bad = 'border-[var(--color-bad)] bg-[var(--color-bad-soft)]'
const picked = 'border-[var(--color-navy)] bg-[var(--color-navy-wash)]'
const idle = 'border-[var(--color-line)]'

/** Uma questão em qualquer dos quatro formatos. `revealed` mostra correção e explicação. */
export function ItemView({ item, answer, onChange, locked, revealed, heading = 'h2' }: { item: Item; answer: Answer | undefined; onChange: (answer: Answer) => void; locked: boolean; revealed: boolean; heading?: 'h2' | 'h3' }) {
  const H = heading
  const right = grade(item, answer)
  return (
    <div>
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">{item.id} · Domínio {item.domain} · {FORMAT_LABEL[item.type]}</p>
      <H className="mt-1 font-serif text-xl">{item.prompt}</H>
      {item.type === 'single' && <Single item={item} answer={answer as string | undefined} onChange={onChange} locked={locked} revealed={revealed} />}
      {item.type === 'multiple_response' && <Multi item={item} answer={answer as string[] | undefined} onChange={onChange} locked={locked} revealed={revealed} />}
      {item.type === 'ordering' && <Order item={item} answer={answer as string[] | undefined} onChange={onChange} locked={locked} revealed={revealed} />}
      {item.type === 'matching' && <Match item={item} answer={answer as Record<string, string> | undefined} onChange={onChange} locked={locked} revealed={revealed} />}
      {revealed && (
        <div className={`mt-4 rounded-lg border p-4 ${right ? ok : bad}`} role="status">
          <p className="m-0 font-semibold">{right ? 'Correto.' : isAnswered(item, answer) ? 'Incorreto — sem crédito parcial.' : 'Em branco — conta como erro.'}</p>
          {item.type === 'single' && !right && <p className="m-0 mt-1">Resposta esperada: {item.correct}.</p>}
          <p className="m-0 mt-2 text-sm">{item.explanation}</p>
        </div>
      )}
    </div>
  )
}

type Props<I extends Item, A> = { item: I; answer: A | undefined; onChange: (answer: Answer) => void; locked: boolean; revealed: boolean }

function Single({ item, answer, onChange, locked, revealed }: Props<Extract<Item, { type: 'single' }>, string>) {
  return (
    <fieldset className="mt-4 space-y-2" disabled={locked}>
      <legend className="sr-only">Alternativas de {item.id}</legend>
      {item.choices.map((choice, i) => {
        const letter = 'ABCD'[i]!
        const tone = revealed ? (letter === item.correct ? ok : answer === letter ? bad : idle) : answer === letter ? picked : idle
        return (
          <label key={letter} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${tone}`}>
            <input type="radio" className="mt-1" name={item.id} checked={answer === letter} onChange={() => onChange(letter)} />
            <span><strong>{letter}.</strong> {choice}</span>
          </label>
        )
      })}
    </fieldset>
  )
}

function Multi({ item, answer = [], onChange, locked, revealed }: Props<Extract<Item, { type: 'multiple_response' }>, string[]>) {
  const full = answer.length >= item.number_to_select
  return (
    <fieldset className="mt-4 space-y-2" disabled={locked}>
      <legend className="mb-1 text-sm font-semibold">Selecione {item.number_to_select} · {answer.length} marcada(s)</legend>
      {item.choices.map((choice) => {
        const on = answer.includes(choice.id)
        const correct = item.correct.includes(choice.id)
        const tone = revealed ? (correct ? ok : on ? bad : idle) : on ? picked : idle
        return (
          <label key={choice.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${tone} ${!on && full && !locked ? 'opacity-60' : ''}`}>
            <input type="checkbox" className="mt-1" checked={on} disabled={!on && full} onChange={() => onChange(on ? answer.filter((id) => id !== choice.id) : [...answer, choice.id])} />
            <span><strong>{choice.id}.</strong> {choice.text}</span>
          </label>
        )
      })}
    </fieldset>
  )
}

function Order({ item, answer, onChange, locked, revealed }: Props<Extract<Item, { type: 'ordering' }>, string[]>) {
  const order = answer ?? item.steps.map((s) => s.id)
  const move = (i: number, delta: number) => {
    const next = [...order]
    const [step] = next.splice(i, 1)
    next.splice(i + delta, 0, step!)
    onChange(next)
  }
  return (
    <div className="mt-4">
      <p className="mb-2 text-sm font-semibold">Use as setas para pôr os passos na ordem certa{answer ? '' : ' (ainda não respondida)'}.</p>
      <ol className="m-0 space-y-2 p-0">
        {order.map((id, i) => {
          const step = item.steps.find((s) => s.id === id)!
          const tone = revealed ? (item.correct_order[i] === id ? ok : bad) : answer ? picked : idle
          return (
            <li key={id} className={`flex list-none items-center gap-3 rounded-lg border p-3 ${tone}`}>
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] text-sm font-bold">{i + 1}</span>
              <span className="flex-1">{step.text}{revealed && item.correct_order[i] !== id && <span className="block text-xs text-[var(--color-ink-soft)]">posição certa: {item.correct_order.indexOf(id) + 1}</span>}</span>
              {!locked && (
                <span className="flex gap-1">
                  <button type="button" className="choice px-2 py-1" aria-label={`Subir: ${step.text}`} disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" className="choice px-2 py-1" aria-label={`Descer: ${step.text}`} disabled={i === order.length - 1} onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></button>
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {!answer && !locked && <button type="button" className="choice mt-2 text-sm" onClick={() => onChange(order)}>Responder com esta ordem</button>}
    </div>
  )
}

function Match({ item, answer = {}, onChange, locked, revealed }: Props<Extract<Item, { type: 'matching' }>, Record<string, string>>) {
  return (
    <div className="mt-4 space-y-2">
      <p className="mb-1 text-sm font-semibold">Associe cada item da esquerda a uma descrição. Cada descrição é usada uma vez.</p>
      {item.left.map((l) => {
        const value = answer[l.id] ?? ''
        const tone = revealed ? (item.correct_matches[l.id] === value ? ok : bad) : value ? picked : idle
        const used = new Set(Object.entries(answer).filter(([k]) => k !== l.id).map(([, v]) => v))
        return (
          <div key={l.id} className={`grid gap-2 rounded-lg border p-3 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:items-center ${tone}`}>
            <span className="font-semibold">{l.text}</span>
            <span>
              <select className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-2 py-2 text-sm" aria-label={`Descrição para ${l.text}`} value={value} disabled={locked} onChange={(e) => onChange({ ...answer, [l.id]: e.currentTarget.value })}>
                <option value="">escolha…</option>
                {item.right.map((r) => <option key={r.id} value={r.id} disabled={used.has(r.id)}>{r.text}</option>)}
              </select>
              {revealed && item.correct_matches[l.id] !== value && <span className="mt-1 block text-xs">Certo: {item.right.find((r) => r.id === item.correct_matches[l.id])?.text}</span>}
            </span>
          </div>
        )
      })}
    </div>
  )
}
