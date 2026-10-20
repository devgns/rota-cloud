import type { Nodes, Parent, PhrasingContent, Root, Text } from 'mdast'

/*
 * Siglas de serviços AWS. A fonte é a linha "> **Nomes completos nesta página:** …" que abre cada
 * capítulo da apostila. Na leitura, essa linha some do topo e o nome completo aparece na primeira
 * menção da sigla; as demais menções viram <abbr> com o nome no title.
 */

export interface AbbrEntry {
  /** Sigla como a apostila a destaca, ex.: "AWS DMS". */
  abbr: string
  full: string
  /** Formas aceitas no texto, da mais longa para a mais curta: "AWS DMS", "DMS". */
  variants: string[]
}

export interface ChapterAbbr {
  entries: AbbrEntry[]
  /** Por seção: siglas cujo nome completo deve aparecer ali, na primeira menção. */
  expandIn: Map<string, Set<string>>
}

const NOTE_LINE = /^> \*\*Nomes? completos?[^\n]*$/m

export function namesNoteOf(markdown: string): string | undefined {
  return NOTE_LINE.exec(markdown)?.[0]
}

export function withoutNamesNote(markdown: string): string {
  return markdown.replace(/^> \*\*Nomes? completos?[^\n]*\n?/m, '')
}

export function parseNamesNote(note: string): AbbrEntry[] {
  const body = note.replace(/^> \*\*[^*]+\*\*\s*/, '')
  const entries: AbbrEntry[] = []
  for (const match of body.matchAll(/([^;]+?) \(\*\*([^*]+)\*\*[^)]*\)/g)) {
    const full = match[1]!.trim()
    const abbr = match[2]!.trim()
    const short = abbr.replace(/^(AWS|Amazon) /, '')
    entries.push({ abbr, full, variants: short === abbr ? [abbr] : [abbr, short] })
  }
  return entries
}

function escape(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function abbrPattern(entries: readonly AbbrEntry[]): RegExp | null {
  const variants = entries.flatMap((entry) => entry.variants).sort((a, b) => b.length - a.length)
  if (variants.length === 0) return null
  return new RegExp(`(?<![\\w-])(${variants.map(escape).join('|')})(?![\\w-])`, 'g')
}

function entryFor(entries: readonly AbbrEntry[], found: string): AbbrEntry | undefined {
  return entries.find((entry) => entry.variants.includes(found))
}

function bareName(full: string): string {
  return full.replace(/^(AWS|Amazon) /, '').toLowerCase()
}

/** Texto corrido de uma seção: sem blocos de código e sem títulos (onde o nome completo não é expandido). */
function proseOf(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .split('\n')
    .filter((line) => !/^#{1,6} /.test(line))
    .join('\n')
}

/** Decide, em ordem de leitura, em qual seção cada sigla é apresentada pela primeira vez. */
export function chapterAbbr(note: string | undefined, sections: readonly { id: string; markdown: string }[]): ChapterAbbr | undefined {
  if (!note) return undefined
  const entries = parseNamesNote(note)
  const pattern = abbrPattern(entries)
  if (!pattern) return undefined
  const introduced = new Set<string>()
  const expandIn = new Map<string, Set<string>>()
  for (const section of sections) {
    const prose = proseOf(withoutNamesNote(section.markdown))
    const lower = prose.toLowerCase()
    for (const match of prose.matchAll(pattern)) {
      const entry = entryFor(entries, match[1]!)
      if (!entry || introduced.has(entry.abbr)) continue
      introduced.add(entry.abbr)
      // Se a apostila já explica a sigla (nome por extenso na seção ou parêntese logo depois), não repete.
      const after = prose.slice(match.index + match[1]!.length)
      if (/^\s*(\*\*|_)?\(/.test(after) || lower.includes(bareName(entry.full))) continue
      const set = expandIn.get(section.id) ?? new Set<string>()
      set.add(entry.abbr)
      expandIn.set(section.id, set)
    }
  }
  return { entries, expandIn }
}

const SKIP = new Set(['inlineCode', 'code', 'html'])

/** Plugin remark: troca siglas por <abbr> e insere o nome completo na primeira menção indicada. */
export function remarkAbbr(options: { entries: readonly AbbrEntry[]; expand: ReadonlySet<string> }) {
  const pattern = abbrPattern(options.entries)
  return (tree: Root) => {
    if (!pattern) return
    const pending = new Set(options.expand)
    const walk = (node: Nodes, inHeading: boolean) => {
      if (SKIP.has(node.type) || !('children' in node)) return
      const parent = node as Parent
      const heading = inHeading || node.type === 'heading'
      const next: Nodes[] = []
      for (const child of parent.children) {
        if (child.type !== 'text') {
          walk(child, heading)
          next.push(child)
          continue
        }
        next.push(...split(child, heading))
      }
      parent.children = next as Parent['children']
    }
    const split = (text: Text, inHeading: boolean): PhrasingContent[] => {
      const out: PhrasingContent[] = []
      let last = 0
      for (const match of text.value.matchAll(pattern)) {
        const entry = entryFor(options.entries, match[1]!)
        if (!entry) continue
        const start = match.index
        if (start > last) out.push({ type: 'text', value: text.value.slice(last, start) })
        out.push({
          type: 'text',
          value: match[1]!,
          data: { hName: 'abbr', hProperties: { title: entry.full } },
        })
        if (!inHeading && pending.has(entry.abbr)) {
          pending.delete(entry.abbr)
          out.push({
            type: 'text',
            value: entry.full,
            data: { hName: 'span', hProperties: { className: ['abbr-full'] } },
          })
        }
        last = start + match[1]!.length
      }
      if (out.length === 0) return [text]
      if (last < text.value.length) out.push({ type: 'text', value: text.value.slice(last) })
      return out
    }
    walk(tree, false)
  }
}
