export type Domain = 1 | 2 | 3 | 4

export type SubheadingMeta = {
  id: string
  title: string
  heading_level: number
}

export type ChapterMeta = {
  id: string
  original_number: number
  title: string
  module_id: string
  domains: Domain[]
  source_heading: string
  subheadings: SubheadingMeta[]
}

export type ModuleMeta = {
  id: string
  title: string
  chapter_ids: string[]
}

export type CurriculumFile = {
  metadata: {
    generated_from: string
    sha256: string
    chapter_count: number
    question_count: number
    flashcard_count: number
    editorial_warning: string
  }
  modules: ModuleMeta[]
  chapters: ChapterMeta[]
}

export type QuestionOption = { id: string; text: string }

export type Question = {
  id: string
  source_chapter_id: string
  domain: Domain
  kind: 'single' | 'multiple'
  selection_count: number
  statement_markdown: string
  options: QuestionOption[]
  correct_option_ids: string[]
  explanation_markdown: string
}

export type QuestionsFile = {
  metadata: {
    source: string
    sha256: string
    count: number
    domains: Record<string, number>
    status: string
    expected_selection_mode: string
  }
  questions: Question[]
}

export type Flashcard = {
  id: string
  category: string
  front_markdown: string
  back_markdown: string
  source_chapter_id: string
}

export type FlashcardsFile = {
  metadata: { source: string; sha256: string; count: number; category_count: number }
  flashcards: Flashcard[]
}

export type StudySection = {
  id: string
  title: string
  level: number
  markdown: string
}

export type StudyChapter = {
  id: string
  originalNumber: number
  title: string
  moduleId: string
  domains: Domain[]
  markdown: string
  opening: StudySection
  sections: StudySection[]
}

export type Corpus = {
  sha256: string
  preamble: StudySection
  modules: ModuleMeta[]
  chapters: StudyChapter[]
  questions: Question[]
  flashcards: Flashcard[]
}

export type Rating = 'again' | 'hard' | 'good'

export type QuestionAttempt = {
  questionId: string
  selectedOptionIds: string[]
  correct: boolean
  answeredAt: string
  sessionId?: string
}

export type ExamSummary = {
  id: string
  questionIds: string[]
  answers: Record<string, string[]>
  flagged: string[]
  correct: number
  answered: number
  byDomain: Record<string, { correct: number; total: number }>
  startedAt: string
  finishedAt: string
}

export type ActiveSession = {
  id: string
  mode: 'train' | 'exam'
  questionIds: string[]
  optionOrder: Record<string, string[]>
  answers: Record<string, string[]>
  revealed: Record<string, boolean>
  flagged: string[]
  currentIndex: number
  startedAt: string
  deadlineAt?: string
  paused: boolean
  remainingMsWhenPaused?: number
  status: 'in_progress' | 'finished'
}

export type FlashcardReview = {
  streak: number
  nextReviewAt: string
  lastRating: Rating
  reviewedAt: string
}

export type StudySettings = {
  theme: 'light' | 'dark' | 'system'
  fontScale: number
}

export type WorksheetState = {
  answers: Record<string, string[]>
  revealedIds: string[]
  resultShown: boolean
}

export type StudyProgress = {
  schemaVersion: 1
  completedSectionIds: string[]
  completedChapterIds: string[]
  lastLocation?: { chapterId: string; sectionId?: string; scrollY?: number }
  bookmarks: string[]
  questionAttempts: QuestionAttempt[]
  examAttempts: ExamSummary[]
  activeSession?: ActiveSession | null
  flashcardReviews: Record<string, FlashcardReview>
  readingPercents: Record<string, number>
  studySeconds: number
  settings: StudySettings
  worksheet: WorksheetState
  updatedAt: string
}

export const STORAGE_KEY = 'clf-c02-study-progress:v1'
export const SCHEMA_VERSION = 1 as const

export const DOMAIN_META: Record<Domain, { title: string; weight: string }> = {
  1: { title: 'Conceitos de nuvem', weight: '24%' },
  2: { title: 'Segurança e conformidade', weight: '30%' },
  3: { title: 'Tecnologia e serviços de nuvem', weight: '34%' },
  4: { title: 'Faturamento, preços e suporte', weight: '12%' },
}
