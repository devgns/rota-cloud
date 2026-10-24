import { useState, type ReactNode } from 'react'
import { FontControls } from '@/components/FontControls'
import { Button } from '@/components/ui'

/**
 * Layout do leitor, igual em todos os cursos: barra de leitura, menu de capítulos à esquerda,
 * texto ao centro, fonte e índice à direita; no celular, gaveta de capítulos e índice recolhível.
 */
export function ReaderShell({
  ratio,
  context,
  nav,
  toc,
  children,
}: {
  ratio: number
  /** Linha acima do título, ex.: “Módulo · capítulo 3”. */
  context: ReactNode
  nav: () => ReactNode
  toc: (onPick?: () => void) => ReactNode
  children: ReactNode
}) {
  const [navOpen, setNavOpen] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  return (
    <div>
      <div className="reading-progress" style={{ width: `${ratio * 100}%` }} aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[16rem_minmax(0,46rem)_14rem]">
        <aside className="hidden lg:block">
          <div className="reader-rail sticky top-20 overflow-auto pr-1">{nav()}</div>
        </aside>
        <article id="artigo" className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-ink-soft)]">{context}</div>
          <div className="mt-3 flex flex-wrap gap-2 lg:hidden">
            <Button variant="ghost" onClick={() => setNavOpen(true)}>Capítulos</Button>
            <Button variant="ghost" onClick={() => setTocOpen((value) => !value)}>Seções</Button>
            <FontControls />
          </div>
          {tocOpen && <div className="mt-2 rounded-xl border border-[var(--color-line)] p-3 lg:hidden">{toc(() => setTocOpen(false))}</div>}
          {children}
        </article>
        <aside className="hidden lg:block">
          <div className="reader-rail sticky top-20 overflow-auto">
            <FontControls />
            {toc()}
          </div>
        </aside>
      </div>
      {navOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setNavOpen(false)}>
          <div className="h-full w-80 max-w-[85vw] overflow-auto bg-[var(--color-paper)] p-4" onClick={(event) => event.stopPropagation()}>
            <Button variant="ghost" onClick={() => setNavOpen(false)}>Fechar</Button>
            <div className="mt-3">{nav()}</div>
          </div>
        </div>
      )}
    </div>
  )
}
