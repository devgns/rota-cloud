import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createProgressStore, parseProgress, type ProgressStore, type StorageMode } from '@/lib/progress'
import type { StudyProgress } from '@/lib/types'
import { STORAGE_KEY } from '@/lib/types'

type ProgressApi = {
  progress: StudyProgress
  mode: StorageMode
  warning?: string
  update: (recipe: (current: StudyProgress) => StudyProgress) => void
  replace: (progress: StudyProgress) => void
  dismissWarning: () => void
}

const ProgressContext = createContext<ProgressApi | null>(null)

function browserStorage(): Storage | null {
  try {
    const probe = '__clf_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return null
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState<ProgressStore>(() => createProgressStore(browserStorage()))
  const initial = useMemo(() => store.load(), [store])
  const [progress, setProgress] = useState(initial.progress)
  const [mode, setMode] = useState<StorageMode>(initial.mode)
  const [warning, setWarning] = useState(initial.warning)

  const persist = useCallback(
    (next: StudyProgress) => {
      const saved = { ...next, updatedAt: new Date().toISOString() }
      const result = store.save(saved)
      setMode(result)
      if (result === 'memory') {
        setWarning('O navegador bloqueou a gravação. O progresso fica só nesta sessão.')
      }
      setProgress(saved)
    },
    [store],
  )

  const update = useCallback(
    (recipe: (current: StudyProgress) => StudyProgress) => {
      setProgress((current) => {
        const next = { ...recipe(current), updatedAt: new Date().toISOString() }
        const result = store.save(next)
        setMode(result)
        if (result === 'memory') {
          setWarning('O navegador bloqueou a gravação. O progresso fica só nesta sessão.')
        }
        return next
      })
    },
    [store],
  )

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      const parsed = parseProgress(event.newValue)
      if (!parsed.ok) return
      setProgress((current) => (parsed.progress.updatedAt > current.updatedAt ? parsed.progress : current))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    const theme = progress.settings.theme
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches)
      document.documentElement.classList.toggle('dark', dark)
      document.documentElement.style.setProperty('--font-scale', String(progress.settings.fontScale))
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [progress.settings.fontScale, progress.settings.theme])

  const value = useMemo<ProgressApi>(
    () => ({
      progress,
      mode,
      warning,
      update,
      replace: persist,
      dismissWarning: () => setWarning(undefined),
    }),
    [mode, persist, progress, update, warning],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressApi {
  const value = useContext(ProgressContext)
  if (!value) throw new Error('useProgress fora do provider')
  return value
}
