import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { centerActiveIn } from '@/lib/scrollActive'

export interface NavModule {
  id: string
  title: string
  chapters: readonly { id: string; number: number; title: string }[]
}

/** Menu de capítulos por módulo, com checkbox de concluído e o capítulo aberto em destaque. Igual em todos os cursos. */
export function ChapterNav({
  modules,
  completed,
  onToggle,
  activeId,
  hrefFor,
  label = 'Capítulos',
  footer,
}: {
  modules: readonly NavModule[]
  completed: readonly string[]
  onToggle: (id: string) => void
  activeId?: string
  hrefFor: (id: string) => string
  label?: string
  footer?: ReactNode
}) {
  const nav = useRef<HTMLElement>(null)
  // Traz o capítulo aberto para a área visível do menu lateral.
  useEffect(() => {
    centerActiveIn(nav.current)
  }, [activeId])
  return (
    <nav ref={nav} aria-label={label} className="text-sm">
      {modules.map((module) => (
        <div key={module.id} className="mb-4">
          <h2 className="module-label">{module.title}</h2>
          <ul className="mt-1 space-y-1">
            {module.chapters.map((item) => {
              const done = completed.includes(item.id)
              return (
                <li key={item.id} className="chapter-link flex items-start gap-2 rounded px-1 py-1 hover:bg-[var(--color-amber-soft)]" data-active={item.id === activeId || undefined}>
                  <input
                    type="checkbox"
                    className="chapter-check"
                    checked={done}
                    aria-label={`${done ? 'Desmarcar' : 'Marcar'} capítulo ${item.number} como concluído`}
                    onChange={() => onToggle(item.id)}
                  />
                  <Link to={hrefFor(item.id)} className="min-w-0 flex-1 leading-snug" aria-current={item.id === activeId ? 'page' : undefined}>
                    {item.number}. {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
      {footer}
    </nav>
  )
}
