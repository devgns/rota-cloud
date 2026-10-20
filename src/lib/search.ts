export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

export function matchesQuery(haystack: string, query: string): boolean {
  const normalizedQuery = normalizeSearch(query).trim()
  if (!normalizedQuery) return false
  const normalizedHaystack = normalizeSearch(haystack)
  return normalizedQuery.split(/\s+/).every((token) => normalizedHaystack.includes(token))
}

export function excerptAround(text: string, query: string, radius = 90): string {
  const plain = text.replace(/[#>*_`|[\]()]/g, ' ').replace(/\s+/g, ' ').trim()
  const index = normalizeSearch(plain).indexOf(normalizeSearch(query).trim().split(/\s+/)[0] ?? '')
  if (index < 0) return plain.slice(0, radius * 2)
  const start = Math.max(0, index - radius)
  const end = Math.min(plain.length, index + radius)
  return `${start > 0 ? '…' : ''}${plain.slice(start, end)}${end < plain.length ? '…' : ''}`
}
