import type { ActiveSession, Domain, ExamSummary, Question, QuestionAttempt, StudyProgress } from './types'
import { latestAttempts, setsEqual } from './progress'

export function hashSeed(input: string): number {
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function shuffleWithSeed<T>(items: readonly T[], seed: string): T[] {
  const copy = [...items]
  let state = hashSeed(seed) || 1
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    const current = copy[index]
    copy[index] = copy[swap] as T
    copy[swap] = current as T
  }
  return copy
}

export function orderedOptions(question: Question, order: string[] | undefined): Question['options'] {
  if (!order) return question.options
  const byId = new Map(question.options.map((option) => [option.id, option]))
  const ordered = order.map((id) => byId.get(id)).filter((option): option is Question['options'][number] => Boolean(option))
  const missing = question.options.filter((option) => !order.includes(option.id))
  return [...ordered, ...missing]
}

export function worksheetScore(questions: Question[], answers: Record<string, string[]>) {
  const byDomain: Record<Domain, { correct: number; total: number }> = {
    1: { correct: 0, total: 0 },
    2: { correct: 0, total: 0 },
    3: { correct: 0, total: 0 },
    4: { correct: 0, total: 0 },
  }
  let correct = 0
  let answered = 0
  for (const question of questions) {
    byDomain[question.domain].total += 1
    const selected = answers[question.id] ?? []
    if (selected.length === 0) continue
    answered += 1
    if (gradeSelection(question, selected)) {
      correct += 1
      byDomain[question.domain].correct += 1
    }
  }
  return { correct, answered, blank: questions.length - answered, byDomain }
}

export function gradeSelection(question: Question, selected: string[]): boolean {
  return setsEqual(selected, question.correct_option_ids)
}

export function selectionReady(question: Question, selected: string[]): boolean {
  return selected.length === question.selection_count
}

export function missedQuestionIds(progress: StudyProgress): string[] {
  const latest = latestAttempts(progress.questionAttempts)
  return [...latest.values()].filter((attempt) => !attempt.correct).map((attempt) => attempt.questionId)
}

export function domainStats(
  questions: Question[],
  attempts: QuestionAttempt[],
): Record<Domain, { correct: number; answered: number }> {
  const stats: Record<Domain, { correct: number; answered: number }> = {
    1: { correct: 0, answered: 0 },
    2: { correct: 0, answered: 0 },
    3: { correct: 0, answered: 0 },
    4: { correct: 0, answered: 0 },
  }
  const domains = new Map(questions.map((question) => [question.id, question.domain]))
  for (const attempt of latestAttempts(attempts).values()) {
    const domain = domains.get(attempt.questionId)
    if (!domain) continue
    stats[domain].answered += 1
    if (attempt.correct) stats[domain].correct += 1
  }
  return stats
}

export function createSession(input: {
  mode: 'train' | 'exam'
  questions: Question[]
  count?: number
  now?: Date
}): ActiveSession {
  const now = input.now ?? new Date()
  const id = `sess-${now.getTime().toString(36)}`
  const pool = shuffleWithSeed(input.questions, id)
  const limit = input.mode === 'exam' ? Math.min(input.count ?? 65, 65, pool.length) : pool.length
  const chosen = pool.slice(0, limit)
  const optionOrder: Record<string, string[]> = {}
  for (const question of chosen) {
    optionOrder[question.id] = shuffleWithSeed(question.options, `${id}:${question.id}`).map((option) => option.id)
  }
  return {
    id,
    mode: input.mode,
    questionIds: chosen.map((question) => question.id),
    optionOrder,
    answers: {},
    revealed: {},
    flagged: [],
    currentIndex: 0,
    startedAt: now.toISOString(),
    deadlineAt: input.mode === 'exam' ? new Date(now.getTime() + 90 * 60 * 1000).toISOString() : undefined,
    paused: false,
    status: 'in_progress',
  }
}

export function finishExam(session: ActiveSession, questions: Question[], now = new Date()): ExamSummary {
  const byId = new Map(questions.map((question) => [question.id, question]))
  const byDomain: ExamSummary['byDomain'] = {
    1: { correct: 0, total: 0 },
    2: { correct: 0, total: 0 },
    3: { correct: 0, total: 0 },
    4: { correct: 0, total: 0 },
  }
  let correct = 0
  let answered = 0
  for (const id of session.questionIds) {
    const question = byId.get(id)
    if (!question) continue
    const key = String(question.domain)
    const bucket = byDomain[key] ?? { correct: 0, total: 0 }
    bucket.total += 1
    byDomain[key] = bucket
    const selected = session.answers[id]
    if (!selected) continue
    answered += 1
    if (gradeSelection(question, selected)) {
      correct += 1
      bucket.correct += 1
    }
  }
  return {
    id: session.id,
    questionIds: session.questionIds,
    answers: session.answers,
    flagged: session.flagged,
    correct,
    answered,
    byDomain,
    startedAt: session.startedAt,
    finishedAt: now.toISOString(),
  }
}

export function attemptsFromSession(session: ActiveSession, questions: Question[], now = new Date()): QuestionAttempt[] {
  const byId = new Map(questions.map((question) => [question.id, question]))
  const attempts: QuestionAttempt[] = []
  for (const id of session.questionIds) {
    const selected = session.answers[id]
    const question = byId.get(id)
    if (!selected || !question) continue
    attempts.push({
      questionId: id,
      selectedOptionIds: selected,
      correct: gradeSelection(question, selected),
      answeredAt: now.toISOString(),
      sessionId: session.id,
    })
  }
  return attempts
}

export function pauseSession(session: ActiveSession, now = new Date()): ActiveSession {
  return {
    ...session,
    paused: true,
    remainingMsWhenPaused: remainingMs(session, now) ?? 0,
    deadlineAt: undefined,
  }
}

export function resumeSession(session: ActiveSession, now = new Date()): ActiveSession {
  const remaining = session.remainingMsWhenPaused ?? 0
  return {
    ...session,
    paused: false,
    remainingMsWhenPaused: undefined,
    deadlineAt: new Date(now.getTime() + remaining).toISOString(),
  }
}

export function remainingMs(session: ActiveSession, now = new Date()): number | null {
  if (session.mode !== 'exam') return null
  if (session.paused && session.remainingMsWhenPaused != null) return session.remainingMsWhenPaused
  if (!session.deadlineAt) return null
  return Math.max(0, new Date(session.deadlineAt).getTime() - now.getTime())
}
