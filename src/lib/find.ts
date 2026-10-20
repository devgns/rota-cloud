import { glossaryFromCorpus, type GlossaryEntry } from './glossary'
import { excerptAround, matchesQuery } from './search'
import type { Corpus } from './types'

export type SearchHit = {
  id: string
  kind: 'Capítulo' | 'Seção' | 'Glossário' | 'Questão' | 'Flashcard'
  title: string
  excerpt: string
  href: string
}

export function searchAll(corpus: Corpus, glossary: GlossaryEntry[], query: string): SearchHit[] {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []
  const hits: SearchHit[] = []
  for (const chapter of corpus.chapters) {
    if (matchesQuery(`${chapter.title} ${chapter.opening.markdown}`, trimmed)) {
      hits.push({
        id: chapter.id,
        kind: 'Capítulo',
        title: `${chapter.originalNumber}. ${chapter.title}`,
        excerpt: excerptAround(chapter.opening.markdown, trimmed),
        href: `/ler/${chapter.id}`,
      })
    }
    for (const section of chapter.sections) {
      if (!matchesQuery(`${section.title} ${section.markdown}`, trimmed)) continue
      hits.push({
        id: section.id,
        kind: 'Seção',
        title: section.title,
        excerpt: excerptAround(section.markdown, trimmed),
        href: `/ler/${chapter.id}/${section.id}`,
      })
      if (hits.length > 40) return hits.slice(0, 30)
    }
  }
  for (const entry of glossary) {
    const blob = `${entry.name} ${entry.purpose} ${entry.whenToChoose ?? ''} ${entry.doNotConfuse ?? ''}`
    if (!matchesQuery(blob, trimmed)) continue
    hits.push({
      id: entry.id,
      kind: 'Glossário',
      title: entry.name,
      excerpt: entry.purpose,
      href: `/glossario/${entry.id}`,
    })
  }
  for (const question of corpus.questions) {
    if (!matchesQuery(question.statement_markdown, trimmed)) continue
    hits.push({
      id: question.id,
      kind: 'Questão',
      title: question.id,
      excerpt: question.statement_markdown,
      href: `/praticar/treino?q=${question.id}`,
    })
  }
  for (const card of corpus.flashcards) {
    if (!matchesQuery(`${card.front_markdown} ${card.category}`, trimmed)) continue
    hits.push({
      id: card.id,
      kind: 'Flashcard',
      title: card.front_markdown,
      excerpt: card.category,
      href: `/flashcards?card=${card.id}`,
    })
  }
  return hits.slice(0, 30)
}

export function glossaryIndex(corpus: Corpus): GlossaryEntry[] {
  return glossaryFromCorpus(corpus)
}
