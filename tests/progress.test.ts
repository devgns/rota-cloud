import { describe, expect, it } from 'vitest'
import { emptyProgress, isDue, mergeProgress, parseProgress, reviewIntervalDays, scheduleReview, serializeProgress } from '@/lib/progress'
import { gradeSelection, shuffleWithSeed } from '@/lib/quiz'
import { matchesQuery, normalizeSearch } from '@/lib/search'
import type { Question } from '@/lib/types'

describe('progresso local', () => {
  it('rejeita JSON inválido, versão errada e arquivo enorme', () => {
    expect(parseProgress('{').ok).toBe(false)
    expect(parseProgress(JSON.stringify({ schemaVersion: 2 })).ok).toBe(false)
    expect(parseProgress('x'.repeat(1_500_001)).ok).toBe(false)
  })

  it('serializa, relê e funde sem perder conclusão', () => {
    const current = emptyProgress()
    current.completedChapterIds = ['chapter-01']
    current.bookmarks = ['c02-2-3-escalabilidade-versus-elasticidade']
    const raw = serializeProgress(current)
    const parsed = parseProgress(raw)
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    const incoming = emptyProgress()
    incoming.completedChapterIds = ['chapter-02']
    incoming.updatedAt = '2099-01-01T00:00:00.000Z'
    const merged = mergeProgress(parsed.progress, incoming)
    expect(merged.completedChapterIds.sort()).toEqual(['chapter-01', 'chapter-02'])
    expect(merged.bookmarks).toContain('c02-2-3-escalabilidade-versus-elasticidade')
  })

  it('agenda flashcards em 1, 3 e 7 dias', () => {
    const now = new Date('2026-10-10T12:00:00.000Z')
    expect(reviewIntervalDays('again')).toBe(1)
    expect(reviewIntervalDays('hard')).toBe(3)
    expect(reviewIntervalDays('good')).toBe(7)
    const again = scheduleReview(undefined, 'again', now)
    expect(isDue(again, now)).toBe(false)
    expect(isDue(again, new Date('2026-10-11T12:00:00.000Z'))).toBe(true)
    expect(isDue(undefined, now)).toBe(true)
  })

  it('usa memória quando o storage falha', async () => {
    const { createProgressStore } = await import('@/lib/progress')
    const broken = {
      getItem: () => { throw new Error('blocked') },
      setItem: () => { throw new Error('blocked') },
    }
    const store = createProgressStore(broken)
    expect(store.load().mode).toBe('memory')
    expect(store.save(emptyProgress())).toBe('memory')
  })
})

describe('questões e busca', () => {
  const question: Question = {
    id: 'Q18',
    source_chapter_id: 'chapter-23',
    domain: 2,
    kind: 'multiple',
    selection_count: 2,
    statement_markdown: 'teste',
    options: [
      { id: 'A', text: 'a' },
      { id: 'B', text: 'b' },
      { id: 'C', text: 'c' },
      { id: 'D', text: 'd' },
    ],
    correct_option_ids: ['A', 'C'],
    explanation_markdown: 'porque',
  }

  it('aceita o conjunto certo independente da ordem e do embaralhamento', () => {
    expect(gradeSelection(question, ['C', 'A'])).toBe(true)
    expect(gradeSelection(question, ['A'])).toBe(false)
    const shuffled = shuffleWithSeed(question.options, 'sessao')
    expect(shuffled.map((option) => option.id).sort()).toEqual(['A', 'B', 'C', 'D'])
  })

  it('encontra VPC, CloudTrail e RDS sem acento', () => {
    expect(normalizeSearch('Região')).toBe('regiao')
    expect(matchesQuery('Amazon VPC isola a rede', 'vpc')).toBe(true)
    expect(matchesQuery('AWS CloudTrail audita a API', 'cloudtrail')).toBe(true)
    expect(matchesQuery('Amazon RDS é relacional', 'rds')).toBe(true)
  })
})
