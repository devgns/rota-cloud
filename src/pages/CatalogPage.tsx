import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RouteHero } from '@/components/landing/RouteHero'
import { COURSES, coursePath } from '@/courses/registry'
import { getCorpus } from '@/lib/corpus'
import { useProgress } from '@/state/ProgressContext'

export function CatalogPage() {
  const reduce = useReducedMotion()
  const { progress } = useProgress()
  const chapters = getCorpus().chapters.length
  const done = progress.completedChapterIds.length

  return (
    <div className="mx-auto max-w-6xl px-4">
      <RouteHero />
      <section id="cursos" className="scroll-mt-24 pb-6 pt-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-amber)]">Cursos</p>
        <h2 className="mt-1 font-serif text-3xl">Escolha a próxima camada</h2>
        <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {COURSES.map((course, index) => {
            const available = course.status === 'available'
            const card = (
              <>
                <div className="flex items-center justify-between gap-2">
                  <span className="course-code">{course.code}</span>
                  <span className={`course-badge ${available ? 'course-badge-ok' : ''}`}>{available ? 'disponível' : 'em breve'}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{course.title}</h3>
                <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">{course.level}</p>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{course.blurb}</p>
                {course.stats && (
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {course.stats.map((stat) => (
                      <div key={stat.label}>
                        <p className="m-0 font-serif text-2xl leading-none">{stat.value}</p>
                        <p className="m-0 mt-1 text-[0.7rem] text-[var(--color-ink-soft)]">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                )}
                {available && (
                  <>
                    <div className="mt-4 h-1.5 rounded-full bg-[var(--color-line)]" aria-label={`${done} de ${chapters} capítulos concluídos`} role="img">
                      <div className="h-1.5 rounded-full bg-[var(--color-amber)]" style={{ width: `${(done / chapters) * 100}%` }} />
                    </div>
                    <p className="mt-3 flex items-center gap-1 text-sm font-semibold text-[var(--color-navy)]">
                      {done > 0 ? 'Continuar' : 'Abrir curso'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </p>
                  </>
                )}
              </>
            )
            return (
              <motion.li
                key={course.id}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08, type: 'spring', stiffness: 160, damping: 20 }}
              >
                {available ? (
                  <Link to={coursePath(course.id)} className="course-card course-card-live">
                    {card}
                  </Link>
                ) : (
                  <div className="course-card course-card-soon" aria-disabled="true">
                    {card}
                  </div>
                )}
              </motion.li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
