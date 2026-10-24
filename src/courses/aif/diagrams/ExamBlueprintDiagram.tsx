import { ExamBlueprint, type BlueprintDomain } from '@/components/course/ExamBlueprint'

const domains: readonly BlueprintDomain[] = [
  { n: 1, name: 'Fundamentos de IA/ML', weight: 20, question: 'Qual tarefa e técnica resolvem o problema?', chapters: [2, 3, 4, 5, 6, 7] },
  { n: 2, name: 'Fundamentos de GenAI', weight: 24, question: 'Como a geração funciona, onde agrega valor e quais seus limites?', chapters: [8, 9, 10, 11, 12] },
  { n: 3, name: 'Aplicações de FMs', weight: 28, question: 'Como montar, personalizar, consultar e avaliar aplicações de FMs?', chapters: [11, 13, 14, 15, 16, 17, 18] },
  { n: 4, name: 'IA responsável', weight: 14, question: 'Como evitar causar danos e justificar decisões?', chapters: [19, 20, 21] },
  { n: 5, name: 'Segurança e governança', weight: 14, question: 'Como proteger dados, acesso, outputs e comprovar controles?', chapters: [21, 22, 23] },
]

export function ExamBlueprintDiagram() {
  return <ExamBlueprint courseId="aif-c01" code="AIF-C01" domains={domains} initial={3} />
}
