export const BRAND = 'Rota Cloud'
export const AUTHOR = 'devgns'
export const GITHUB = 'https://github.com/devgns'

export interface Course {
  id: string
  code: string
  title: string
  level: 'Foundational' | 'Associate' | 'Professional' | 'Specialty'
  status: 'available' | 'soon'
  blurb: string
  /** Números do material, só para cursos disponíveis. */
  stats?: readonly { value: number; label: string }[]
}

export const COURSES: readonly Course[] = [
  {
    id: 'clf-c02',
    code: 'CLF-C02',
    title: 'Cloud Practitioner',
    level: 'Foundational',
    status: 'available',
    blurb: 'A primeira camada: conceitos de nuvem, segurança, serviços essenciais, preços e suporte.',
    stats: [
      { value: 26, label: 'capítulos' },
      { value: 80, label: 'questões' },
      { value: 132, label: 'flashcards' },
    ],
  },
  {
    id: 'aif-c01',
    code: 'AIF-C01',
    title: 'AI Practitioner',
    level: 'Foundational',
    status: 'soon',
    blurb: 'Fundamentos de IA, machine learning e IA generativa na AWS.',
  },
  {
    id: 'saa-c03',
    code: 'SAA-C03',
    title: 'Solutions Architect',
    level: 'Associate',
    status: 'soon',
    blurb: 'Arquiteturas resilientes, seguras, performáticas e com custo otimizado.',
  },
  {
    id: 'dva-c02',
    code: 'DVA-C02',
    title: 'Developer',
    level: 'Associate',
    status: 'soon',
    blurb: 'Construir, implantar e depurar aplicações nativas da AWS.',
  },
]

export const DEFAULT_COURSE_ID = 'clf-c02'

export function courseById(id: string | undefined): Course | undefined {
  return COURSES.find((course) => course.id === id)
}

/** Caminho absoluto de uma rota dentro do curso: coursePath('clf-c02', '/ler/x') → '/cursos/clf-c02/ler/x'. */
export function coursePath(courseId: string, path = '/'): string {
  const rest = path === '/' || path === '' ? '' : path.startsWith('/') ? path : `/${path}`
  return `/cursos/${courseId}${rest}`
}
