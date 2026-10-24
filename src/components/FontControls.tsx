import { useProgress } from '@/state/ProgressContext'

/** Tamanho da fonte de leitura; preferência do site inteiro, guardada junto do tema. */
export function FontControls() {
  const { progress, update } = useProgress()
  const setScale = (fontScale: number) => update((current) => ({ ...current, settings: { ...current.settings, fontScale } }))
  return (
    <div className="mb-3 flex gap-2" aria-label="Tamanho da fonte">
      {[0.92, 1, 1.12].map((scale) => (
        <button key={scale} className="choice" aria-pressed={progress.settings.fontScale === scale} onClick={() => setScale(scale)}>
          {scale === 0.92 ? 'A−' : scale === 1 ? 'A' : 'A+'}
        </button>
      ))}
    </div>
  )
}
