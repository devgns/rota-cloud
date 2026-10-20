import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Panel } from '@/components/ui'
import { getCorpus } from '@/lib/corpus'
import { emptyProgress, mergeProgress, parseProgress, serializeProgress } from '@/lib/progress'
import { domainStats } from '@/lib/quiz'
import { DOMAIN_META, type Domain } from '@/lib/types'
import { useProgress } from '@/state/ProgressContext'
import { useCoursePath } from '@/courses/CourseContext'

export function ProgressPage() {
  const p = useCoursePath()
  const corpus = getCorpus()
  const { progress, replace, mode } = useProgress()
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const stats = domainStats(corpus.questions, progress.questionAttempts)
  const hours = Math.floor(progress.studySeconds / 3600)
  const minutes = Math.floor((progress.studySeconds % 3600) / 60)

  const onFile = async (file: File | undefined) => {
    if (!file) return
    const text = await file.text()
    const parsed = parseProgress(text)
    if (!parsed.ok) {
      setMessage(parsed.error)
      setPending(null)
      return
    }
    setPending(text)
    setMessage('Arquivo válido. Escolha fundir com o progresso atual ou substituir.')
  }

  const download = () => {
    const blob = new Blob([serializeProgress(progress)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'clf-c02-progresso.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-serif text-4xl">Meu progresso</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Gravado em {mode === 'local' ? 'localStorage' : 'memória desta sessão'}, chave clf-c02-study-progress:v1.
        Tempo de estudo: {progress.studySeconds < 15 ? 'ainda sem uma amostra de 15 segundos' : `${hours} h ${minutes} min`} medidos com a aba visível.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {([1, 2, 3, 4] as Domain[]).map((domain) => (
          <Panel key={domain}>
            <h2 className="font-semibold">{DOMAIN_META[domain].title}</h2>
            <p>{stats[domain].answered === 0 ? 'Sem questões respondidas neste domínio.' : `${stats[domain].correct}/${stats[domain].answered} na última tentativa de cada questão`}</p>
          </Panel>
        ))}
      </div>
      <Panel className="mt-4">
        <h2 className="font-semibold">Última posição</h2>
        {progress.lastLocation ? (
          <Link className="text-[var(--color-navy)]" to={p(progress.lastLocation.sectionId ? `/ler/${progress.lastLocation.chapterId}/${progress.lastLocation.sectionId}` : `/ler/${progress.lastLocation.chapterId}`)}>
            Continuar em {progress.lastLocation.chapterId}
          </Link>
        ) : <p>Nenhuma leitura registrada.</p>}
        <h3 className="mt-4 font-semibold">Favoritos</h3>
        <ul className="mt-2 text-sm">
          {progress.bookmarks.length === 0 && <li>Nenhum favorito.</li>}
          {progress.bookmarks.map((id) => <li key={id}>{id}</li>)}
        </ul>
      </Panel>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={download}>Exportar JSON</Button>
        <label className="inline-flex cursor-pointer items-center rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold">
          Importar JSON
          <input className="sr-only" type="file" accept="application/json" onChange={(event) => void onFile(event.target.files?.[0])} />
        </label>
        <Button variant="danger" onClick={() => setConfirmReset(true)}>Limpar progresso</Button>
      </div>
      {message && <p className="mt-3 text-sm" role="status">{message}</p>}
      {pending && (
        <div className="mt-3 flex gap-2">
          <Button onClick={() => {
            const parsed = parseProgress(pending)
            if (!parsed.ok) return
            replace(mergeProgress(progress, parsed.progress))
            setPending(null)
            setMessage('Progresso fundido.')
          }}>Fundir</Button>
          <Button variant="ghost" onClick={() => {
            const parsed = parseProgress(pending)
            if (!parsed.ok) return
            replace(parsed.progress)
            setPending(null)
            setMessage('Progresso substituído.')
          }}>Substituir</Button>
        </div>
      )}
      {confirmReset && (
        <Panel className="mt-4">
          <p>Isso apaga capítulos, questões, flashcards, favoritos e o simulado em andamento neste navegador. A aparência volta ao padrão.</p>
          <div className="mt-3 flex gap-2">
            <Button variant="danger" onClick={() => { replace(emptyProgress()); setConfirmReset(false); setMessage('Progresso apagado.') }}>Apagar tudo</Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>Cancelar</Button>
          </div>
        </Panel>
      )}
      <p className="mt-6 text-sm">Capítulos concluídos: {progress.completedChapterIds.length}. Seções marcadas: {progress.completedSectionIds.length}. Simulados: {progress.examAttempts.length}.</p>
    </div>
  )
}
