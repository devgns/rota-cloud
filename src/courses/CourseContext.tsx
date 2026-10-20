import { createContext, useCallback, useContext } from 'react'
import { Link, Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { buttonClass } from '@/components/ui'
import { courseById, coursePath, DEFAULT_COURSE_ID, type Course } from './registry'

const CourseContext = createContext<Course | undefined>(undefined)

/** Curso aberto no momento (undefined fora de /cursos/:courseId). */
export function useCourse(): Course | undefined {
  return useContext(CourseContext)
}

/** Prefixa rotas relativas ao curso: p('/ler/x') → '/cursos/clf-c02/ler/x'. */
export function useCoursePath(): (path?: string) => string {
  const course = useCourse()
  const id = course?.id ?? DEFAULT_COURSE_ID
  return useCallback((path = '/') => coursePath(id, path), [id])
}

export function CourseLayout() {
  const { courseId } = useParams()
  const course = courseById(courseId)
  if (!course || course.status !== 'available') return <CourseSoon course={course} />
  return (
    <CourseContext.Provider value={course}>
      <Outlet />
    </CourseContext.Provider>
  )
}

function CourseSoon({ course }: { course?: Course }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-amber)]">{course ? course.code : 'Curso'}</p>
      <h1 className="mt-2 font-serif text-3xl">{course ? `${course.title}: em preparação` : 'Curso não encontrado'}</h1>
      <p className="mt-3 text-[var(--color-ink-soft)]">
        {course ? 'O material deste curso ainda está sendo escrito. Enquanto isso, a primeira camada já está pronta.' : 'Esse endereço não corresponde a nenhum curso.'}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className={buttonClass()} to={coursePath(DEFAULT_COURSE_ID)}>Abrir o CLF-C02</Link>
        <Link className={buttonClass('ghost')} to="/">Ver cursos</Link>
      </div>
    </div>
  )
}

/** Endereços antigos (/ler/…, /trilhas…) passam a viver dentro do CLF-C02. */
export function LegacyRedirect() {
  const location = useLocation()
  return <Navigate replace to={`${coursePath(DEFAULT_COURSE_ID, location.pathname)}${location.search}${location.hash}`} />
}
