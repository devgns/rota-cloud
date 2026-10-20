import { Github, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useMatch, useNavigate } from 'react-router-dom'
import { getCorpus } from '@/lib/corpus'
import { glossaryIndex, searchAll } from '@/lib/find'
import { useProgress } from '@/state/ProgressContext'
import { Button } from '../ui'
import { BRAND, courseById, coursePath, GITHUB } from '@/courses/registry'
import { BrandLogo } from './BrandLogo'
import { Signature, SignatureLine } from './Signature'

const COURSE_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/trilhas', label: 'Trilhas' },
  { to: '/praticar', label: 'Praticar' },
  { to: '/flashcards', label: 'Flashcards' },
  { to: '/glossario', label: 'Glossário' },
  { to: '/progresso', label: 'Progresso' },
]

export function Shell() {
  const navigate = useNavigate()
  // O Shell fica fora do CourseLayout: o curso vem da URL.
  const match = useMatch('/cursos/:courseId/*')
  const onCatalog = useMatch('/') !== null
  const course = courseById(match?.params.courseId)
  const inCourse = course?.status === 'available'
  const links = inCourse ? COURSE_LINKS.map((link) => ({ ...link, to: coursePath(course.id, link.to) })) : []
  const { progress, update, warning, dismissWarning, mode } = useProgress()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const corpus = useMemo(() => getCorpus(), [])
  const glossary = useMemo(() => glossaryIndex(corpus), [corpus])
  const hits = useMemo(() => (searchOpen ? searchAll(corpus, glossary, query) : []), [corpus, glossary, query, searchOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (inCourse && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inCourse])

  useEffect(() => {
    const started = performance.now()
    const tick = window.setInterval(() => {
      if (document.hidden) return
      const elapsed = Math.round((performance.now() - started) / 1000)
      if (elapsed <= 0) return
      update((current) => ({ ...current, studySeconds: current.studySeconds + 15 }))
    }, 15000)
    return () => window.clearInterval(tick)
  }, [update])

  const cycleTheme = () => {
    update((current) => {
      const order = ['system', 'light', 'dark'] as const
      const index = order.indexOf(current.settings.theme)
      const theme = order[(index + 1) % order.length] ?? 'system'
      return { ...current, settings: { ...current.settings, theme } }
    })
  }

  return (
    <div className={`min-h-screen ${inCourse ? 'pb-20 md:pb-0' : ''}`}>
      <a className="skip-link" href="#conteudo">Ir ao conteúdo</a>
      <header className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-[color-mix(in_srgb,var(--color-paper)_92%,transparent)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          {inCourse && (
            <button className="md:hidden" aria-label="Abrir menu" onClick={() => setOpen(true)}>
              <Menu />
            </button>
          )}
          <Link to="/" className="brand-mark flex items-center gap-2 font-semibold text-[var(--color-navy)]">
            <BrandLogo className="h-5 w-5" />
            {BRAND}
          </Link>
          {inCourse && (
            <Link to={coursePath(course.id)} className="course-chip" title={`${course.code} · ${course.title}`}>
              {course.code}
            </Link>
          )}
          {inCourse && (
            <nav className="ml-2 hidden gap-4 text-sm md:flex" aria-label="Principal">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.label === 'Início'}
                  className={({ isActive }) => (isActive ? 'font-semibold text-[var(--color-navy)]' : 'text-[var(--color-ink-soft)]')}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}
          <div className="ml-auto flex items-center gap-2">
            {inCourse ? (
              <Button variant="ghost" aria-label="Buscar" onClick={() => setSearchOpen(true)}>
                <Search className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Buscar</span>
              </Button>
            ) : (
              <a className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold hover:border-[var(--color-navy)]" href={GITHUB} target="_blank" rel="noreferrer noopener">
                <Github className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            )}
            <Button variant="ghost" aria-label="Alternar tema" onClick={cycleTheme}>
              {progress.settings.theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>
      {warning && (
        <div className="bg-[var(--color-amber-soft)] px-4 py-2 text-sm" role="status">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <p>{warning} Modo atual: {mode === 'local' ? 'navegador' : 'sessão'}.</p>
            <button onClick={dismissWarning} aria-label="Dispensar aviso">Ok</button>
          </div>
        </div>
      )}
      <main id="conteudo">
        <Outlet />
      </main>
      {onCatalog ? (
        <footer className="mx-auto max-w-7xl px-4 pb-10 pt-6">
          <Signature />
          <p className="mt-4 text-center text-xs text-[var(--color-ink-soft)]">
            Material independente de preparação; não afiliado nem endossado pela AWS. AWS é marca da Amazon.
          </p>
        </footer>
      ) : (
        <footer className="mx-auto mt-6 flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-[var(--color-line)] px-4 py-5 text-xs text-[var(--color-ink-soft)]">
          <p className="m-0">Material independente de preparação; não afiliado nem endossado pela AWS. AWS é marca da Amazon.</p>
          <SignatureLine />
        </footer>
      )}
      {inCourse && <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-[var(--color-line)] bg-[var(--color-paper)] px-2 py-2 text-xs md:hidden" aria-label="Móvel">
        {links.slice(0, 5).map((link) => (
          <NavLink key={link.to} to={link.to} end={link.label === 'Início'} className="px-2 py-1">
            {link.label}
          </NavLink>
        ))}
      </nav>}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)}>
          <div className="h-full w-72 bg-[var(--color-paper)] p-4" onClick={(event) => event.stopPropagation()}>
            <button aria-label="Fechar menu" onClick={() => setOpen(false)}><X /></button>
            <ul className="mt-4 space-y-3">
              <li><Link to="/" onClick={() => setOpen(false)}>Todos os cursos</Link></li>
              {links.map((link) => (
                <li key={link.to}><Link to={link.to} onClick={() => setOpen(false)}>{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {searchOpen && inCourse && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4" onClick={() => setSearchOpen(false)}>
          <div className="mx-auto mt-16 max-w-xl rounded-2xl bg-[var(--color-paper-raised)] p-4" role="dialog" aria-label="Busca" onClick={(event) => event.stopPropagation()}>
            <label className="block text-sm font-semibold" htmlFor="busca-global">Buscar na apostila, no glossário e nas questões</label>
            <input
              id="busca-global"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--color-line)] bg-transparent px-3 py-2"
              placeholder="CloudTrail, CloudWatch, Lambda"
            />
            <ul className="mt-3 max-h-80 space-y-2 overflow-auto">
              {hits.map((hit) => (
                <li key={`${hit.kind}-${hit.id}`}>
                  <button
                    className="w-full rounded-xl px-2 py-2 text-left hover:bg-[var(--color-amber-soft)]"
                    onClick={() => {
                      setSearchOpen(false)
                      navigate(coursePath(course?.id ?? '', hit.href))
                    }}
                  >
                    <span className="text-xs uppercase tracking-wide text-[var(--color-amber)]">{hit.kind}</span>
                    <span className="block font-semibold">{hit.title}</span>
                    <span className="block text-sm text-[var(--color-ink-soft)]">{hit.excerpt}</span>
                  </button>
                </li>
              ))}
              {query.trim().length >= 2 && hits.length === 0 && <li>Nada encontrado para essa busca.</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
