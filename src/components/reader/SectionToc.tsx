import { Link } from 'react-router-dom'

/** Índice “Neste capítulo”, com a seção visível em destaque. */
export function SectionToc({
  sections,
  active,
  hrefFor,
  onPick,
}: {
  sections: readonly { id: string; title: string }[]
  active?: string
  hrefFor: (sectionId: string) => string
  onPick?: () => void
}) {
  return (
    <nav aria-label="Seções deste capítulo" className="text-sm">
      <h2 className="module-label mb-2">Neste capítulo</h2>
      <ul className="space-y-1">
        {sections.map((section) => (
          <li key={section.id}>
            <Link
              to={hrefFor(section.id)}
              onClick={() => {
                onPick?.()
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`block rounded px-1 py-1 hover:bg-[var(--color-amber-soft)] ${active === section.id ? 'bg-[var(--color-amber-soft)] font-semibold' : ''}`}
              aria-current={active === section.id ? 'location' : undefined}
            >
              {section.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
