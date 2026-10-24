/** Progresso do AIF-C01: chave própria no localStorage, separada do CLF-C02. */
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export const KEY = 'aif-c01-study-progress:v1'

/** Resposta: letra (escolha única), lista (múltipla resposta ou ordem) ou pares (associação). */
export type Answer = string | string[] | Record<string, string>

export type Review = { due: string; intervalDays: number; seen: number }
export type Attempt = { id: string; date: string; mode: string; correct: number; total: number; byDomain: Record<string, { correct: number; total: number }>; responses: Record<string, Answer> }

/** Folha de respostas das 80 questões do capítulo 27. */
export type Worksheet = { answers: Record<string, string>; revealed: string[]; resultShown: boolean }

/** Simulado cronometrado em andamento, para retomar depois de recarregar a página. */
export type ExamState = { ids: string[]; answers: Record<string, Answer>; remaining: number; current: number; savedAt: string }

export type Progress = {
  completed: string[]
  bookmarks: string[]
  answers: Record<string, Answer>
  reviews: Record<string, Review>
  attempts: Attempt[]
  lastChapter: string
  lastUpdated: string
  worksheet: Worksheet
  exam: ExamState | null
}

export const emptyWorksheet = (): Worksheet => ({ answers: {}, revealed: [], resultShown: false })

export function blank(): Progress {
  return { completed: [], bookmarks: [], answers: {}, reviews: {}, attempts: [], lastChapter: 'chapter-01', lastUpdated: new Date().toISOString(), worksheet: emptyWorksheet(), exam: null }
}

export function readAifProgress(): Progress {
  try {
    const value = localStorage.getItem(KEY)
    if (!value) return blank()
    const parsed = JSON.parse(value) as Partial<Progress>
    const sheet = parsed.worksheet
    return {
      ...blank(),
      ...parsed,
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
      answers: parsed.answers ?? {},
      reviews: parsed.reviews ?? {},
      attempts: parsed.attempts ?? [],
      worksheet: sheet && typeof sheet === 'object' ? { ...emptyWorksheet(), ...sheet } : emptyWorksheet(),
      exam: parsed.exam && Array.isArray(parsed.exam.ids) ? parsed.exam : null,
    }
  } catch {
    return blank()
  }
}

export type Update = (fn: (p: Progress) => Progress) => void

export function useAifProgressState() {
  const [progress, setProgress] = useState<Progress>(() => readAifProgress())
  const [storageWarning, setStorageWarning] = useState(false)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress))
    } catch {
      setStorageWarning(true)
    }
  }, [progress])
  const update = useCallback<Update>((updater) => setProgress((prev) => ({ ...updater(prev), lastUpdated: new Date().toISOString() })), [])
  return { progress, update, storageWarning }
}

export const AifProgressContext = createContext<{ progress: Progress; update: Update } | null>(null)

export function useAifProgress() {
  const value = useContext(AifProgressContext)
  if (!value) throw new Error('useAifProgress fora do AifProgressContext')
  return value
}
