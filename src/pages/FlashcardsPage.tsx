import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Panel } from '@/components/ui'
import { ServiceNamesGuide } from '@/components/ServiceNamesGuide'
import { getCorpus } from '@/lib/corpus'
import { isDue, scheduleReview } from '@/lib/progress'
import type { Rating } from '@/lib/types'
import { useProgress } from '@/state/ProgressContext'

export function FlashcardsPage() {
  const corpus = getCorpus()
  const { progress, update } = useProgress()
  const [params, setParams] = useSearchParams()
  const categories = useMemo(() => [...new Set(corpus.flashcards.map((card) => card.category))], [corpus.flashcards])
  const category = params.get('categoria') ?? 'todas'
  const dueOnly = params.get('fila') === 'hoje'
  const cards = corpus.flashcards.filter((card) => {
    if (category !== 'todas' && card.category !== category) return false
    if (dueOnly) return isDue(progress.flashcardReviews[card.id], new Date())
    return true
  })
  const requested = params.get('card')
  const initialIndex = Math.max(0, cards.findIndex((card) => card.id === requested))
  const [index, setIndex] = useState(initialIndex === -1 ? 0 : initialIndex)
  const [flipped, setFlipped] = useState(false)
  const card = cards[index]

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
      if (event.code === 'Space') {
        event.preventDefault()
        setFlipped((value) => !value)
      }
      if (event.key === '1') rate('again')
      if (event.key === '2') rate('hard')
      if (event.key === '3') rate('good')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const rate = (rating: Rating) => {
    if (!card || !flipped) return
    update((current) => ({
      ...current,
      flashcardReviews: {
        ...current.flashcardReviews,
        [card.id]: scheduleReview(current.flashcardReviews[card.id], rating, new Date()),
      },
    }))
    setFlipped(false)
    setIndex((value) => (cards.length === 0 ? 0 : (value + 1) % cards.length))
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-4xl">Flashcards</h1>
      <p className="mt-2 text-[var(--color-ink-soft)]">O verso aparece só depois do clique ou da barra de espaço. Errei volta em 1 dia, Hesitei em 3, Sei em 7.</p>
      <ServiceNamesGuide />
      <div className="choice-row" role="group" aria-label="Categoria">
        <button className="choice" aria-pressed={category === 'todas' && !dueOnly} onClick={() => setParams({})}>Todas</button>
        <button className="choice" aria-pressed={dueOnly} onClick={() => setParams({ fila: 'hoje' })}>Revisar hoje</button>
        {categories.map((item) => (
          <button key={item} className="choice" aria-pressed={category === item} onClick={() => setParams({ categoria: item })}>{item}</button>
        ))}
      </div>
      {!card && <p className="mt-6">Nenhum cartão nessa fila.</p>}
      {card && (
        <Panel className="mt-6">
          <p className="text-sm text-[var(--color-ink-soft)]">{card.category} · {card.id} · {index + 1}/{cards.length}</p>
          <button className="mt-4 min-h-40 w-full text-left" onClick={() => setFlipped((value) => !value)} aria-expanded={flipped}>
            <span className="block text-xs uppercase tracking-wide text-[var(--color-amber)]">{flipped ? 'Verso' : 'Frente'}</span>
            <span className="mt-2 block font-serif text-2xl">{flipped ? card.back_markdown : card.front_markdown}</span>
          </button>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="ghost" disabled={!flipped} onClick={() => rate('again')}>Errei (1)</Button>
            <Button variant="ghost" disabled={!flipped} onClick={() => rate('hard')}>Hesitei (2)</Button>
            <Button variant="ghost" disabled={!flipped} onClick={() => rate('good')}>Sei (3)</Button>
          </div>
        </Panel>
      )}
    </div>
  )
}
