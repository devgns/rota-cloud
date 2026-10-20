import type { Heading, Root } from 'mdast'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import type { ChapterMeta, StudyChapter, StudySection } from './types'

const parser = unified().use(remarkParse).use(remarkGfm)

export function slugHeading(title: string): string {
  const stripped = title.normalize('NFD').replace(/\p{M}/gu, '')
  return stripped
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function sectionHasStudyContent(markdown: string): boolean {
  const withoutHeading = markdown.replace(/^#{1,6}[^\n]*\n?/, '').trim()
  const withoutEditorialMeta = withoutHeading
    .replace(/^\*\*\[[^\]]+\]\*\*\s*$/gm, '')
    .replace(/^> \*\*Nomes? completos?[^\n]*$/gm, '')
    .trim()
  return withoutEditorialMeta.length > 0
}

export function sectionIdFor(chapterNumber: number, title: string): string {
  return `c${String(chapterNumber).padStart(2, '0')}-${slugHeading(title).slice(0, 75)}`
}

function headingTitle(source: string, heading: Heading): string {
  const start = heading.position?.start.offset
  const end = heading.position?.end.offset
  if (start == null || end == null) return ''
  return source.slice(start, end).replace(/^#{1,6}\s+/, '').trim()
}

type Mark = { depth: number; title: string; start: number; end: number }

function headingMarks(source: string): Mark[] {
  const tree = parser.parse(source) as Root
  const marks: Mark[] = []
  for (const node of tree.children) {
    if (node.type !== 'heading') continue
    const start = node.position?.start.offset
    const end = node.position?.end.offset
    if (start == null || end == null) continue
    marks.push({ depth: node.depth, title: headingTitle(source, node), start, end })
  }
  return marks
}

function sliceSection(source: string, start: number, end: number, id: string, title: string, level: number): StudySection {
  return { id, title, level, markdown: source.slice(start, end) }
}

export function segmentApostila(source: string, chaptersMeta: ChapterMeta[]): {
  preamble: StudySection
  chapters: StudyChapter[]
} {
  const marks = headingMarks(source)
  const numbered = marks.filter((mark) => mark.depth === 1 && /^\d+\.\s+/.test(mark.title))
  const preambleEnd = numbered[0]?.start ?? source.length
  const preamble = sliceSection(source, 0, preambleEnd, 'front-matter', 'Capa e índice', 1)

  const byNumber = new Map(chaptersMeta.map((chapter) => [chapter.original_number, chapter]))
  const chapters: StudyChapter[] = numbered.map((mark, index) => {
    const match = /^(\d+)\.\s+(.+)$/.exec(mark.title)
    const number = Number(match?.[1] ?? 0)
    const title = match?.[2]?.trim() || mark.title
    const meta = byNumber.get(number)
    const chapterEnd = numbered[index + 1]?.start ?? source.length
    const bodyMarks = marks.filter(
      (item) => item.start >= mark.end && item.start < chapterEnd && item.depth >= 2,
    )
    const openingEnd = bodyMarks[0]?.start ?? chapterEnd
    const opening = sliceSection(
      source,
      mark.start,
      openingEnd,
      meta ? `${meta.id}-abertura` : `chapter-${String(number).padStart(2, '0')}-abertura`,
      title,
      1,
    )
    const sections = bodyMarks.map((item, sectionIndex) => {
      const next = bodyMarks[sectionIndex + 1]?.start ?? chapterEnd
      const id = sectionIdFor(number, item.title)
      return sliceSection(source, item.start, next, id, item.title, item.depth)
    })
    return {
      id: meta?.id ?? `chapter-${String(number).padStart(2, '0')}`,
      originalNumber: number,
      title,
      moduleId: meta?.module_id ?? 'revisao',
      domains: meta?.domains ?? [1, 2, 3, 4],
      markdown: source.slice(mark.start, chapterEnd),
      opening,
      sections,
    }
  })

  return { preamble, chapters }
}

export function chapterPlainText(chapter: StudyChapter): string {
  return `${chapter.opening.markdown}\n${chapter.sections.map((section) => section.markdown).join('\n')}`
}
