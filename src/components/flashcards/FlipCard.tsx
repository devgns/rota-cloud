import type { ReactNode } from 'react'

/** Cartão que vira em 3D: frente e verso ocupam a mesma célula, então a altura acompanha o maior. */
export function FlipCard({
  flipped,
  onFlip,
  meta,
  front,
  back,
  frontLabel = 'Frente',
  backLabel = 'Verso',
}: {
  flipped: boolean
  onFlip: () => void
  meta?: ReactNode
  front: ReactNode
  back: ReactNode
  frontLabel?: string
  backLabel?: string
}) {
  return (
    <button type="button" className="flip-card mt-4 block w-full text-left" data-flipped={flipped || undefined} aria-expanded={flipped} aria-label={flipped ? 'Cartão virado: clique para ver a frente' : 'Clique para virar o cartão'} onClick={onFlip}>
      <span className="flip-card-inner">
        <span className="flip-face flip-front" aria-hidden={flipped}>
          <span className="flip-meta">
            <span className="flip-tag">{frontLabel}</span>
            {meta && <span>{meta}</span>}
          </span>
          <span className="flip-body font-serif text-2xl leading-snug">{front}</span>
          <span className="flip-hint">Tente lembrar · clique ou espaço para virar ↻</span>
        </span>
        <span className="flip-face flip-back" aria-hidden={!flipped}>
          <span className="flip-meta">
            <span className="flip-tag flip-tag-back">{backLabel}</span>
            {meta && <span>{meta}</span>}
          </span>
          <span className="flip-body text-base leading-relaxed">{back}</span>
          <span className="flip-hint">Clique para voltar à frente ↻</span>
        </span>
      </span>
    </button>
  )
}
