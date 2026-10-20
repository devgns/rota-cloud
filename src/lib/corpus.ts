import apostila from '../../content/Apostila_AWS_Cloud_Practitioner_CLF-C02_Completa.md?raw'
import curriculumJson from '../../data/CURRICULO_CLF-C02.json'
import flashcardsJson from '../../data/FLASHCARDS_CLF-C02_132.json'
import questionsJson from '../../data/QUESTOES_CLF-C02_80.json'
import { segmentApostila } from './segment'
import type { Corpus, CurriculumFile, FlashcardsFile, QuestionsFile } from './types'

export const curriculum = curriculumJson as CurriculumFile
export const questionsFile = questionsJson as QuestionsFile
export const flashcardsFile = flashcardsJson as FlashcardsFile
export const apostilaSource = apostila

const MULTIPLE_IDS = ['Q18', 'Q44', 'Q49', 'Q69', 'Q71']

export function validateCorpusData(input: {
  source: string
  curriculum: CurriculumFile
  questions: QuestionsFile
  flashcards: FlashcardsFile
}): string[] {
  const errors: string[] = []
  const { source, curriculum: catalog, questions, flashcards } = input
  const hashes = new Set([
    catalog.metadata.sha256,
    questions.metadata.sha256,
    flashcards.metadata.sha256,
  ])
  if (hashes.size !== 1) errors.push('SHA-256 divergente entre os três JSON.')
  if (catalog.chapters.length !== 26) errors.push(`Capítulos no currículo: ${catalog.chapters.length}.`)
  if (questions.questions.length !== 80) errors.push(`Questões: ${questions.questions.length}.`)
  if (flashcards.flashcards.length !== 132) errors.push(`Flashcards: ${flashcards.flashcards.length}.`)

  const qIds = new Set<string>()
  for (const question of questions.questions) {
    if (qIds.has(question.id)) errors.push(`Questão duplicada ${question.id}.`)
    qIds.add(question.id)
    if (question.options.length < 4) errors.push(`${question.id} tem menos de 4 opções.`)
    if (!question.explanation_markdown.trim()) errors.push(`${question.id} sem gabarito comentado.`)
    if (question.correct_option_ids.length !== question.selection_count) {
      errors.push(`${question.id} selection_count divergente.`)
    }
    const optionIds = new Set(question.options.map((option) => option.id))
    for (const correct of question.correct_option_ids) {
      if (!optionIds.has(correct)) errors.push(`${question.id} resposta ${correct} inexistente.`)
    }
    if (question.kind === 'single' && question.correct_option_ids.length !== 1) {
      errors.push(`${question.id} deveria ter uma resposta.`)
    }
    if (question.kind === 'multiple' && question.correct_option_ids.length < 2) {
      errors.push(`${question.id} deveria ter múltiplas respostas.`)
    }
  }
  for (const id of MULTIPLE_IDS) {
    const question = questions.questions.find((item) => item.id === id)
    if (!question || question.kind !== 'multiple') errors.push(`${id} não está como múltipla.`)
  }
  const domainCounts = [1, 2, 3, 4].map(
    (domain) => questions.questions.filter((question) => question.domain === domain).length,
  )
  if (domainCounts.join(',') !== '20,24,27,9') {
    errors.push(`Contagem por domínio inesperada: ${domainCounts.join(',')}.`)
  }

  const cardIds = new Set<string>()
  for (const card of flashcards.flashcards) {
    if (cardIds.has(card.id)) errors.push(`Flashcard duplicado ${card.id}.`)
    cardIds.add(card.id)
    if (!card.front_markdown.trim() || !card.back_markdown.trim() || !card.category.trim()) {
      errors.push(`Flashcard vazio ${card.id}.`)
    }
  }

  const segmented = segmentApostila(source, catalog.chapters)
  if (segmented.chapters.length !== 26) errors.push(`Segmentação gerou ${segmented.chapters.length} capítulos.`)
  if (!segmented.preamble.markdown.includes('Como ler esta apostila')) {
    errors.push('A capa da apostila não foi preservada.')
  }
  for (const meta of catalog.chapters) {
    const chapter = segmented.chapters.find((item) => item.originalNumber === meta.original_number)
    if (!chapter) {
      errors.push(`Capítulo ${meta.original_number} ausente na segmentação.`)
      continue
    }
    const joined = chapter.opening.markdown + chapter.sections.map((section) => section.markdown).join('')
    if (joined !== chapter.markdown) errors.push(`${chapter.id} perdeu texto na segmentação.`)
    if (!chapter.markdown.includes(meta.title)) errors.push(`${chapter.id} não contém o título original.`)
    const ids = chapter.sections.map((section) => section.id)
    const expected = meta.subheadings.map((sub) => sub.id)
    if (ids.join('|') !== expected.join('|')) {
      errors.push(`${chapter.id} divergiu dos IDs do currículo.`)
    }
  }
  return errors
}

export function buildCorpus(): Corpus {
  const segmented = segmentApostila(apostilaSource, curriculum.chapters)
  return {
    sha256: curriculum.metadata.sha256,
    preamble: segmented.preamble,
    modules: curriculum.modules,
    chapters: segmented.chapters,
    questions: questionsFile.questions,
    flashcards: flashcardsFile.flashcards,
  }
}

let cached: Corpus | null = null

export function getCorpus(): Corpus {
  if (!cached) cached = buildCorpus()
  return cached
}

export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}
