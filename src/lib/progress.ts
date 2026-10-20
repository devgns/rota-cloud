import type { ActiveSession, FlashcardReview, Rating, StudyProgress, WorksheetState } from './types'
import { STORAGE_KEY } from './types'

const MAX_IMPORT_CHARS = 1_500_000
const DAY_MS = 24 * 60 * 60 * 1000

export function emptyWorksheet(): WorksheetState {
  return { answers: {}, revealedIds: [], resultShown: false }
}

export function emptyProgress(now = new Date()): StudyProgress {
  return {
    schemaVersion: 1,
    completedSectionIds: [],
    completedChapterIds: [],
    bookmarks: [],
    questionAttempts: [],
    examAttempts: [],
    activeSession: null,
    flashcardReviews: {},
    readingPercents: {},
    studySeconds: 0,
    settings: { theme: 'system', fontScale: 1 },
    worksheet: emptyWorksheet(),
    updatedAt: now.toISOString(),
  }
}

function parseWorksheet(value: unknown): WorksheetState {
  const record = asRecord(value)
  if (!record) return emptyWorksheet()
  const answers: Record<string, string[]> = {}
  for (const [id, selected] of Object.entries(asRecord(record.answers) ?? {})) {
    if (isStringArray(selected)) answers[id] = selected.filter((option) => /^[A-D]$/.test(option))
  }
  return {
    answers,
    revealedIds: isStringArray(record.revealedIds) ? record.revealedIds : [],
    resultShown: record.resultShown === true,
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null
}

export function parseProgress(raw: string): { ok: true; progress: StudyProgress } | { ok: false; error: string } {
  if (raw.length > MAX_IMPORT_CHARS) return { ok: false, error: 'Arquivo grande demais para importar.' }
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'JSON inválido.' }
  }
  const record = asRecord(data)
  if (!record) return { ok: false, error: 'O progresso precisa ser um objeto.' }
  if (record.schemaVersion !== 1) {
    return { ok: false, error: 'Versão de progresso não suportada. Exporte um backup e mantenha o arquivo.' }
  }
  const base = emptyProgress()
  if (!isStringArray(record.completedSectionIds) || !isStringArray(record.completedChapterIds) || !isStringArray(record.bookmarks)) {
    return { ok: false, error: 'Listas de conclusão ou favoritos inválidas.' }
  }
  if (!Array.isArray(record.questionAttempts) || !Array.isArray(record.examAttempts)) {
    return { ok: false, error: 'Histórico de questões inválido.' }
  }
  const settings = asRecord(record.settings)
  const theme = settings?.theme
  const fontScale = settings?.fontScale
  if (theme !== 'light' && theme !== 'dark' && theme !== 'system') {
    return { ok: false, error: 'Tema inválido.' }
  }
  if (typeof fontScale !== 'number' || fontScale < 0.85 || fontScale > 1.4) {
    return { ok: false, error: 'Tamanho de fonte inválido.' }
  }
  const reviews = asRecord(record.flashcardReviews) ?? {}
  const flashcardReviews: StudyProgress['flashcardReviews'] = {}
  for (const [id, value] of Object.entries(reviews)) {
    const review = asRecord(value)
    const rating = review?.lastRating
    if (!review || (rating !== 'again' && rating !== 'hard' && rating !== 'good')) continue
    if (typeof review.nextReviewAt !== 'string' || typeof review.reviewedAt !== 'string') continue
    flashcardReviews[id] = {
      streak: typeof review.streak === 'number' ? review.streak : 0,
      nextReviewAt: review.nextReviewAt,
      lastRating: rating,
      reviewedAt: review.reviewedAt,
    }
  }
  const progress: StudyProgress = {
    ...base,
    completedSectionIds: record.completedSectionIds,
    completedChapterIds: record.completedChapterIds,
    bookmarks: record.bookmarks,
    questionAttempts: record.questionAttempts as StudyProgress['questionAttempts'],
    examAttempts: record.examAttempts as StudyProgress['examAttempts'],
    activeSession: (record.activeSession as ActiveSession | null) ?? null,
    flashcardReviews,
    readingPercents: (asRecord(record.readingPercents) as StudyProgress['readingPercents']) ?? {},
    studySeconds: typeof record.studySeconds === 'number' ? record.studySeconds : 0,
    settings: { theme, fontScale },
    worksheet: parseWorksheet(record.worksheet),
    lastLocation: record.lastLocation as StudyProgress['lastLocation'],
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : base.updatedAt,
  }
  return { ok: true, progress }
}

export function serializeProgress(progress: StudyProgress): string {
  return JSON.stringify(progress, null, 2)
}

function uniq(values: string[]): string[] {
  return [...new Set(values)]
}

export function mergeProgress(current: StudyProgress, incoming: StudyProgress): StudyProgress {
  const reviews = { ...current.flashcardReviews }
  for (const [id, review] of Object.entries(incoming.flashcardReviews)) {
    const previous = reviews[id]
    if (!previous || review.reviewedAt > previous.reviewedAt) reviews[id] = review
  }
  const readingPercents = { ...current.readingPercents }
  for (const [id, value] of Object.entries(incoming.readingPercents)) {
    readingPercents[id] = Math.max(readingPercents[id] ?? 0, value)
  }
  const newerLocation = !current.lastLocation
    ? incoming.lastLocation
    : !incoming.lastLocation
      ? current.lastLocation
      : incoming.updatedAt > current.updatedAt
        ? incoming.lastLocation
        : current.lastLocation
  return {
    ...current,
    completedSectionIds: uniq([...current.completedSectionIds, ...incoming.completedSectionIds]),
    completedChapterIds: uniq([...current.completedChapterIds, ...incoming.completedChapterIds]),
    bookmarks: uniq([...current.bookmarks, ...incoming.bookmarks]),
    questionAttempts: [...current.questionAttempts, ...incoming.questionAttempts].slice(-5000),
    examAttempts: [...current.examAttempts, ...incoming.examAttempts].slice(-200),
    activeSession:
      (incoming.updatedAt > current.updatedAt ? incoming.activeSession : current.activeSession) ?? null,
    flashcardReviews: reviews,
    readingPercents,
    studySeconds: Math.max(current.studySeconds, incoming.studySeconds),
    worksheet: incoming.updatedAt > current.updatedAt ? incoming.worksheet : current.worksheet,
    lastLocation: newerLocation,
    settings: current.settings,
    updatedAt: new Date().toISOString(),
  }
}

export type StorageMode = 'local' | 'memory'

export type ProgressStore = {
  load: () => { progress: StudyProgress; mode: StorageMode; warning?: string }
  save: (progress: StudyProgress) => StorageMode
  mode: () => StorageMode
}

export function createProgressStore(storage: Pick<Storage, 'getItem' | 'setItem'> | null): ProgressStore {
  let mode: StorageMode = storage ? 'local' : 'memory'
  let memory = emptyProgress()
  let warning: string | undefined = storage ? undefined : 'O armazenamento do navegador está indisponível. O progresso vale só nesta sessão.'

  return {
    mode: () => mode,
    load() {
      if (!storage) return { progress: memory, mode, warning }
      try {
        const raw = storage.getItem(STORAGE_KEY)
        if (!raw) return { progress: emptyProgress(), mode: 'local' }
        const parsed = parseProgress(raw)
        if (!parsed.ok) {
          warning = `${parsed.error} Os dados antigos foram mantidos na chave e esta sessão começou vazia.`
          return { progress: emptyProgress(), mode: 'local', warning }
        }
        return { progress: parsed.progress, mode: 'local' }
      } catch {
        mode = 'memory'
        warning = 'Não foi possível ler o progresso salvo. Usando memória desta sessão.'
        return { progress: memory, mode, warning }
      }
    },
    save(progress) {
      memory = progress
      if (!storage || mode === 'memory') return 'memory'
      try {
        storage.setItem(STORAGE_KEY, serializeProgress(progress))
        return 'local'
      } catch {
        mode = 'memory'
        return 'memory'
      }
    },
  }
}

export function reviewIntervalDays(rating: Rating): number {
  if (rating === 'again') return 1
  if (rating === 'hard') return 3
  return 7
}

export function scheduleReview(previous: FlashcardReview | undefined, rating: Rating, now: Date): FlashcardReview {
  const streak = rating === 'good' ? (previous?.streak ?? 0) + 1 : 0
  return {
    streak,
    lastRating: rating,
    reviewedAt: now.toISOString(),
    nextReviewAt: new Date(now.getTime() + reviewIntervalDays(rating) * DAY_MS).toISOString(),
  }
}

export function isDue(review: FlashcardReview | undefined, now: Date): boolean {
  if (!review) return true
  return new Date(review.nextReviewAt).getTime() <= now.getTime()
}

export function setsEqual(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false
  const bag = new Set(left)
  return right.every((item) => bag.has(item))
}

export function latestAttempts(attempts: StudyProgress['questionAttempts']) {
  const map = new Map<string, StudyProgress['questionAttempts'][number]>()
  for (const attempt of attempts) {
    const previous = map.get(attempt.questionId)
    if (!previous || attempt.answeredAt >= previous.answeredAt) map.set(attempt.questionId, attempt)
  }
  return map
}

export function countDue(reviews: StudyProgress['flashcardReviews'], ids: string[], now: Date): number {
  return ids.filter((id) => isDue(reviews[id], now)).length
}
