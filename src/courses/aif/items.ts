/** Itens de prática do AIF-C01 nos quatro formatos do guia e a correção tudo-ou-nada. */
import questionBank from '../../../data/QUESTOES_AIF-C01_80.json'
import formatsBank from '../../../data/QUESTOES_AIF-C01_FORMATOS_COMPLEMENTARES_24.json'
import type { Answer } from './progress'

type Base = { id: string; domain: number; task: string; prompt: string; explanation: string }
type Choice = { id: string; text: string }

export type SingleItem = Base & { type: 'single'; choices: string[]; correct: string }
export type MultiItem = Base & { type: 'multiple_response'; choices: Choice[]; number_to_select: number; correct: string[] }
export type OrderItem = Base & { type: 'ordering'; steps: Choice[]; correct_order: string[] }
export type MatchItem = Base & { type: 'matching'; left: Choice[]; right: Choice[]; correct_matches: Record<string, string> }
export type Item = SingleItem | MultiItem | OrderItem | MatchItem

export const SINGLE: readonly SingleItem[] = (questionBank.questions as Omit<SingleItem, 'type'>[]).map((q) => ({ ...q, type: 'single' }))
export const FORMATS: readonly Item[] = formatsBank.questions as Item[]
export const ALL: readonly Item[] = [...SINGLE, ...FORMATS]
export const itemById = new Map(ALL.map((item) => [item.id, item]))

export const FORMAT_LABEL: Record<Item['type'], string> = {
  single: 'escolha única',
  multiple_response: 'múltipla resposta',
  ordering: 'ordenação',
  matching: 'associação',
}

/** Respondida = há algo marcado (na associação, todos os pares preenchidos). */
export function isAnswered(item: Item, answer: Answer | undefined): boolean {
  if (answer === undefined) return false
  if (item.type === 'single') return typeof answer === 'string' && answer.length > 0
  if (item.type === 'matching') return typeof answer === 'object' && !Array.isArray(answer) && item.left.every((l) => Boolean(answer[l.id]))
  return Array.isArray(answer) && answer.length > 0
}

/** Como na prova: sem crédito parcial; em branco conta como erro. */
export function grade(item: Item, answer: Answer | undefined): boolean {
  if (!isAnswered(item, answer)) return false
  switch (item.type) {
    case 'single':
      return answer === item.correct
    case 'multiple_response': {
      const picked = answer as string[]
      return picked.length === item.correct.length && item.correct.every((id) => picked.includes(id))
    }
    case 'ordering':
      return (answer as string[]).join() === item.correct_order.join()
    case 'matching': {
      const pairs = answer as Record<string, string>
      return item.left.every((l) => pairs[l.id] === item.correct_matches[l.id])
    }
  }
}

export function stats(items: readonly Item[], answers: Record<string, Answer>) {
  const byDomain: Record<string, { correct: number; total: number }> = {}
  for (const item of items) {
    const key = String(item.domain)
    const entry = byDomain[key] ?? { correct: 0, total: 0 }
    entry.total++
    if (grade(item, answers[item.id])) entry.correct++
    byDomain[key] = entry
  }
  return { correct: Object.values(byDomain).reduce((sum, d) => sum + d.correct, 0), byDomain }
}

/** Texto curto da resposta correta, para revisões. */
export function correctText(item: Item): string {
  switch (item.type) {
    case 'single':
      return item.correct
    case 'multiple_response':
      return item.correct.join(' e ')
    case 'ordering':
      return item.correct_order.map((id, i) => `${i + 1}. ${item.steps.find((s) => s.id === id)?.text ?? ''}`).join(' ')
    case 'matching':
      return item.left.map((l) => `${l.text} → ${item.right.find((r) => r.id === item.correct_matches[l.id])?.text ?? ''}`).join('; ')
  }
}
