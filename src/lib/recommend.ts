import { countDue, isDue } from './progress'
import type { Corpus, StudyProgress } from './types'

export type Recommendation = { href: string; title: string; reason: string }

export function recommendNext(corpus: Corpus, progress: StudyProgress, now = new Date()): Recommendation {
  if (progress.activeSession?.status === 'in_progress' && progress.activeSession.mode === 'exam') {
    return {
      href: '/praticar/simulado',
      title: 'Retomar o simulado',
      reason: 'Há uma tentativa em andamento neste navegador.',
    }
  }
  const location = progress.lastLocation
  if (location && !progress.completedChapterIds.includes(location.chapterId)) {
    const chapter = corpus.chapters.find((item) => item.id === location.chapterId)
    if (chapter) {
      const href = location.sectionId
        ? `/ler/${chapter.id}/${location.sectionId}`
        : `/ler/${chapter.id}`
      return {
        href,
        title: `Continuar: ${chapter.originalNumber}. ${chapter.title}`,
        reason: 'Sua última posição de leitura ainda não foi marcada como concluída.',
      }
    }
  }
  const next = corpus.chapters.find((chapter) => !progress.completedChapterIds.includes(chapter.id))
  if (next) {
    return {
      href: `/ler/${next.id}`,
      title: `Seguir para ${next.originalNumber}. ${next.title}`,
      reason: 'Próximo capítulo da trilha que ainda não foi concluído.',
    }
  }
  const dueReviews = corpus.flashcards.filter((card) => {
    const review = progress.flashcardReviews[card.id]
    return review && isDue(review, now)
  })
  if (dueReviews.length > 0) {
    return {
      href: '/flashcards?fila=hoje',
      title: 'Revisar flashcards de hoje',
      reason: `${dueReviews.length} cartão(ões) chegaram na data da revisão.`,
    }
  }
  const unseen = countDue(progress.flashcardReviews, corpus.flashcards.map((card) => card.id), now)
  if (unseen > 0) {
    return {
      href: '/flashcards',
      title: 'Começar flashcards',
      reason: 'Ainda há cartões sem uma primeira tentativa.',
    }
  }
  return {
    href: '/praticar',
    title: 'Treinar questões',
    reason: 'A leitura da trilha está marcada. O próximo ganho está na prática.',
  }
}
