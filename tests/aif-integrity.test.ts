import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import source from '../content/Apostila_AWS_AI_Practitioner_AIF-C01_Completa.md?raw'
import curriculum from '../data/CURRICULO_AIF-C01.json'
import questionBank from '../data/QUESTOES_AIF-C01_80.json'
import flashcardBank from '../data/FLASHCARDS_AIF-C01_120.json'
import { AIF_DIAGRAM_SECTION_IDS } from '../src/courses/aif/diagrams/registry'
import { FORMATS, SINGLE, grade, itemById } from '../src/courses/aif/items'
import { buildExam } from '../src/courses/aif/PracticeScreens'
import { isRecallSection, openingId, recallItems, splitChapter } from '../src/courses/aif/sections'

const chapterTexts = (() => {
  const heads = [...source.matchAll(/^# (\d{1,2})\. .+$/gm)]
  return heads.map((m, i) => ({ number: Number(m[1]), markdown: source.slice(m.index, heads[i + 1]?.index ?? source.length) }))
})()

describe('AIF-C01 canonical content integrity', () => {
  it('matches the sha256 of its full Markdown source', () => {
    const actual = createHash('sha256').update(source).digest('hex')
    expect(actual).toBe(curriculum.metadata.sha256)
  })
  it('has 30 incremental chapters and no duplicate identifiers', () => {
    expect(curriculum.chapters).toHaveLength(30)
    expect(curriculum.chapters.map((c) => c.original_number)).toEqual(Array.from({length:30},(_,i)=>i+1))
    expect(new Set(curriculum.chapters.map(c=>c.id)).size).toBe(30)
    expect([...source.matchAll(/^# \d+\. .+$/gm)]).toHaveLength(30)
    expect((source.match(/```mermaid\n/g)??[]).length).toBeGreaterThanOrEqual(15)
  })
  it('has exactly 80 authored questions with the intended domain weighting', () => {
    const questions=questionBank.questions
    expect(questions).toHaveLength(80)
    expect(new Set(questions.map(q=>q.id)).size).toBe(80)
    expect([1,2,3,4,5].map(d=>questions.filter(q=>q.domain===d).length)).toEqual([16,19,23,11,11])
    for(const q of questions){
      expect(q.choices).toHaveLength(4)
      expect('ABCD').toContain(q.correct)
      expect(q.explanation.length).toBeGreaterThan(18)
      expect(source).toContain(q.id)
    }
  })
  it('has 120 distinct review cards in both forms', () => {
    const cards=flashcardBank.flashcards
    expect(cards).toHaveLength(120)
    expect(new Set(cards.map(c=>c.id)).size).toBe(120)
    expect(new Set(cards.map(c=>c.front)).size).toBe(120)
    cards.forEach(card=>expect(source).toContain(card.id))
  })
  it('provides a traceability map for all 14 official exam task groups', () => {
    for(const task of ['1.1','1.2','1.3','2.1','2.2','2.3','3.1','3.2','3.3','3.4','4.1','4.2','5.1','5.2']) {
      expect(source).toContain(`| ${task} |`)
    }
  })
  it('registers diagrams only for existing sections and gives every chapter at least one', () => {
    const ids = new Set(chapterTexts.flatMap(({ markdown, number }) => [openingId(number), ...splitChapter(markdown, number).sections.map((x) => x.id)]))
    for (const id of AIF_DIAGRAM_SECTION_IDS) expect(ids.has(id), id).toBe(true)
    for (let n = 1; n <= 30; n++) {
      const prefix = `c${String(n).padStart(2, '0')}-`
      expect(AIF_DIAGRAM_SECTION_IDS.some((id) => id.startsWith(prefix)), `capítulo ${n}`).toBe(true)
    }
  })
  it('splits recall sections into question cards, most with hidden answers', () => {
    const recall = chapterTexts.flatMap(({ markdown, number }) => splitChapter(markdown, number).sections.filter((x) => isRecallSection(x.title)))
    expect(recall.length).toBeGreaterThanOrEqual(15)
    const items = recall.flatMap((x) => recallItems(x.markdown))
    expect(items.filter((x) => x.answer).length).toBeGreaterThanOrEqual(40)
  })
  it('grades the extra formats all-or-nothing, like the exam', () => {
    const multi = FORMATS.find((q) => q.type === 'multiple_response')!
    const order = FORMATS.find((q) => q.type === 'ordering')!
    const match = FORMATS.find((q) => q.type === 'matching')!
    if (multi.type !== 'multiple_response' || order.type !== 'ordering' || match.type !== 'matching') throw new Error('tipos')
    expect(grade(multi, multi.correct)).toBe(true)
    expect(grade(multi, multi.correct.slice(0, 1))).toBe(false)
    expect(grade(order, order.correct_order)).toBe(true)
    expect(grade(order, [...order.correct_order].reverse())).toBe(false)
    expect(grade(match, match.correct_matches)).toBe(true)
    const [first, second] = match.left
    expect(grade(match, { ...match.correct_matches, [first!.id]: match.correct_matches[second!.id]!, [second!.id]: match.correct_matches[first!.id]! })).toBe(false)
    expect(grade(SINGLE[0]!, undefined)).toBe(false)
  })
  it('keeps every extra-format item internally consistent', () => {
    expect(FORMATS.length).toBeGreaterThanOrEqual(26)
    expect(new Set(FORMATS.map((q) => q.id)).size).toBe(FORMATS.length)
    for (const q of FORMATS) {
      if (q.type === 'multiple_response') {
        expect(q.correct).toHaveLength(q.number_to_select)
        for (const id of q.correct) expect(q.choices.some((c) => c.id === id)).toBe(true)
      }
      if (q.type === 'ordering') expect([...q.correct_order].sort()).toEqual(q.steps.map((s) => s.id).sort())
      if (q.type === 'matching') expect(Object.values(q.correct_matches).sort()).toEqual(q.right.map((r) => r.id).sort())
    }
  })
  it('builds a 65-item exam in the official proportion with 6 extra-format items', () => {
    for (const seed of [0, 1, 5]) {
      const ids = buildExam(seed)
      expect(ids).toHaveLength(65)
      expect(new Set(ids).size).toBe(65)
      const items = ids.map((id) => itemById.get(id)!)
      expect(items.filter((q) => q.type !== 'single')).toHaveLength(6)
      expect([1, 2, 3, 4, 5].map((d) => items.filter((q) => q.domain === d).length)).toEqual([13, 16, 18, 9, 9])
    }
  })
})
