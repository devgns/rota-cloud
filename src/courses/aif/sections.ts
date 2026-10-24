/** Corte puro de um capítulo AIF-C01 em abertura e seções "## ". Usado pelo leitor e pelos testes. */

export function slug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 75)
}

export interface AifSection {
  id: string
  title: string
  /** Markdown da seção, incluindo a linha "## título". */
  markdown: string
}

export interface ChapterParts {
  title: string
  /** Lista de siglas da nota "Nomes completos nesta página". */
  names?: string
  tag?: { kind: string; detail?: string }
  /** Texto entre a abertura e a primeira seção. */
  intro: string
  sections: AifSection[]
}

export const pad = (n: number) => String(n).padStart(2, '0')

/** Id do encaixe logo abaixo da abertura do capítulo. */
export const openingId = (number: number) => `c${pad(number)}-abertura`

function trimRule(text: string) {
  return text.replace(/\n-{3,}\s*$/g, '').trim()
}

export function splitChapter(markdown: string, number: number): ChapterParts {
  const first = markdown.search(/^## /m)
  const head = first === -1 ? markdown : markdown.slice(0, first)
  const body = first === -1 ? '' : markdown.slice(first)
  const lines = head.split('\n')
  const title = (lines.shift() ?? '').replace(/^# \d+\.\s*/, '').trim()
  let names: string | undefined
  let tag: ChapterParts['tag']
  const rest: string[] = []
  for (const line of lines) {
    const note = /^>\s*\*\*Nomes completos nesta página:\*\*\s*(.+)$/.exec(line)
    const label = /^\*\*\[([^\]]+)\]\*\*\s*$/.exec(line.trim())
    if (note) names = note[1]!.trim()
    else if (label) {
      const [kind, ...detail] = label[1]!.split(' — ')
      tag = { kind: kind!.trim(), detail: detail.join(' — ').trim() || undefined }
    } else rest.push(line)
  }
  const sections = body
    .split(/^(?=## )/m)
    .filter((part) => part.startsWith('## '))
    .map((part) => {
      const heading = /^## (.+)$/m.exec(part)![1]!.trim()
      return { id: `c${pad(number)}-${slug(heading)}`, title: heading, markdown: trimRule(part) }
    })
  return { title, names, tag, intro: trimRule(rest.join('\n')), sections }
}

export const isRecallSection = (title: string) => /verifique se entendeu|recupere o conceito/i.test(title)

export interface RecallItem {
  question: string
  answer?: string
}

/**
 * Itens de uma seção de recuperação: cada item de lista ou parágrafo vira um cartão.
 * A resposta, quando existe, vem depois de "**Resposta:**" e fica oculta até o clique.
 */
export function recallItems(markdown: string): RecallItem[] {
  const body = markdown.replace(/^## .+$/m, '').trim()
  const items: string[] = []
  for (const block of body.split(/\n\s*\n/)) {
    const text = block.trim()
    if (!text) continue
    if (/^(?:- |\d+\. )/.test(text)) {
      for (const item of text.split(/\n(?=- |\d+\. )/)) items.push(item.replace(/^(?:- |\d+\. )/, '').trim())
    } else items.push(text)
  }
  return items.map((item) => {
    const [question, ...answer] = item.split('**Resposta:**')
    return answer.length ? { question: question!.trim(), answer: answer.join('**Resposta:**').trim() } : { question: item }
  })
}
