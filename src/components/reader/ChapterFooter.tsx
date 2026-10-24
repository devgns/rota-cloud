import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { buttonClass } from '@/components/ui'

interface Neighbor { href: string; label: string }

/** Fim do capítulo: marcar como estudado e seguir para o anterior/próximo. */
export function ChapterFooter({ done, onToggle, previous, next }: { done?: boolean; onToggle?: () => void; previous?: Neighbor; next?: Neighbor }) {
  return (
    <div className="mt-10 border-t border-[var(--color-line)] pt-6">
      {onToggle && (
        <button type="button" className={buttonClass('ghost')} aria-pressed={done} onClick={onToggle}>
          <Check className="h-4 w-4" /> {done ? 'Capítulo concluído' : 'Marcar como estudado'}
        </button>
      )}
      <div className="mt-4 flex flex-wrap justify-between gap-3">
        {previous ? <Link className={buttonClass('ghost')} to={previous.href}><ChevronLeft className="h-4 w-4" /> {previous.label}</Link> : <span />}
        {next && <Link className={buttonClass('ghost')} to={next.href}>{next.label} <ChevronRight className="h-4 w-4" /></Link>}
      </div>
    </div>
  )
}
