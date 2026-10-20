import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { EDITORIAL_NOTES } from '@/content/studyLayer'
import { FIGURE_KEYS } from '@/components/diagrams/figures'
import { DIAGRAM_SECTION_IDS } from '@/components/diagrams/registry'
import { chapterAbbr, namesNoteOf, parseNamesNote } from '@/lib/abbreviations'
import { apostilaSource, curriculum, flashcardsFile, getCorpus, questionsFile, validateCorpusData } from '@/lib/corpus'
import { glossaryFromCorpus } from '@/lib/glossary'
import { sectionHasStudyContent, segmentApostila } from '@/lib/segment'

describe('corpus CLF-C02', () => {
  it('confere o SHA-256 da apostila com os três JSON', () => {
    const file = readFileSync('content/Apostila_AWS_Cloud_Practitioner_CLF-C02_Completa.md')
    const hash = createHash('sha256').update(file).digest('hex')
    expect(hash).toBe(curriculum.metadata.sha256)
    expect(questionsFile.metadata.sha256).toBe(hash)
    expect(flashcardsFile.metadata.sha256).toBe(hash)
    expect(apostilaSource).toBe(file.toString('utf8'))
  })

  it('mantém 26 capítulos, 80 questões, 80 gabaritos e 132 flashcards', () => {
    const errors = validateCorpusData({
      source: apostilaSource,
      curriculum,
      questions: questionsFile,
      flashcards: flashcardsFile,
    })
    expect(errors).toEqual([])
  })

  it('não descarta texto entre a capa e o fim do capítulo 26', () => {
    const segmented = segmentApostila(apostilaSource, curriculum.chapters)
    const rebuilt = segmented.preamble.markdown + segmented.chapters.map((chapter) => chapter.markdown).join('')
    expect(rebuilt).toBe(apostilaSource)
    expect(segmented.chapters).toHaveLength(26)
    expect(segmented.chapters.every((chapter) => chapter.markdown.length > 200)).toBe(true)
  })

  it('liga glossário, notas e diagramas a seções que existem', () => {
    const corpus = getCorpus()
    const ids = new Set(corpus.chapters.flatMap((chapter) => chapter.sections.map((section) => section.id)))
    const glossary = glossaryFromCorpus(corpus)
    expect(glossary.length).toBeGreaterThan(40)
    expect(glossary.some((entry) => entry.name.includes('VPC'))).toBe(true)
    expect(glossary.some((entry) => entry.name.includes('CloudTrail'))).toBe(true)
    expect(glossary.some((entry) => entry.name.includes('RDS'))).toBe(true)
    for (const note of EDITORIAL_NOTES) expect(ids.has(note.sectionId)).toBe(true)
    const chapter2 = corpus.chapters.find((chapter) => chapter.id === 'chapter-02')
    const chapter4 = corpus.chapters.find((chapter) => chapter.id === 'chapter-04')
    expect(chapter2 && sectionHasStudyContent(chapter2.opening.markdown)).toBe(false)
    expect(chapter4 && sectionHasStudyContent(chapter4.opening.markdown)).toBe(true)
    expect(DIAGRAM_SECTION_IDS.length).toBeGreaterThanOrEqual(12)
    for (const id of DIAGRAM_SECTION_IDS) expect(ids.has(id)).toBe(true)
    const textBlocks = [...apostilaSource.matchAll(/```text\n([\s\S]*?)```/g)].map((match) => match[1]!.split('\n').find((line) => line.trim())?.trim())
    for (const key of FIGURE_KEYS) expect(textBlocks).toContain(key)
  })

  it('lê os nomes completos de cada capítulo e apresenta cada sigla uma vez', () => {
    for (const chapter of getCorpus().chapters) {
      const note = namesNoteOf(chapter.opening.markdown)
      if (!note) continue
      const entries = parseNamesNote(note)
      expect(entries.length).toBe((note.match(/\(\*\*/g) ?? []).length)
      const abbr = chapterAbbr(note, [chapter.opening, ...chapter.sections])
      const expanded = [...(abbr?.expandIn.values() ?? [])].flatMap((set) => [...set])
      expect(new Set(expanded).size).toBe(expanded.length)
    }
  })
})

