import { useEffect, useMemo, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { CourseLayout, LegacyRedirect } from '@/courses/CourseContext'
import { AifCourseApp } from '@/courses/aif/AifCourseApp'
import { apostilaSource, curriculum, flashcardsFile, questionsFile, sha256Hex, validateCorpusData } from '@/lib/corpus'
import { CatalogPage } from '@/pages/CatalogPage'
import { FlashcardsPage } from '@/pages/FlashcardsPage'
import { GlossaryPage } from '@/pages/GlossaryPage'
import { HomePage } from '@/pages/HomePage'
import { PracticeHub, ExamPage, ResultPage, TrainPage } from '@/pages/PracticePages'
import { ProgressPage } from '@/pages/ProgressPage'
import { ReaderPage } from '@/pages/ReaderPage'
import { SearchPage } from '@/pages/SearchPage'
import { TracksPage } from '@/pages/TracksPage'
import { ProgressProvider } from '@/state/ProgressContext'

export function App() {
  const errors = useMemo(
    () => validateCorpusData({
      source: apostilaSource,
      curriculum,
      questions: questionsFile,
      flashcards: flashcardsFile,
    }),
    [],
  )
  const [hashOk, setHashOk] = useState<boolean | null>(null)
  useEffect(() => {
    void sha256Hex(apostilaSource).then((hash) => setHashOk(hash === curriculum.metadata.sha256))
  }, [])

  if (errors.length > 0 || hashOk === false) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-serif text-3xl">A apostila e os dados não conferem</h1>
        <p className="mt-3">O site não usa JSON desatualizado. Rode <code>python3 scripts/extract_study_data.py</code> e recarregue.</p>
        <ul className="mt-4 list-disc pl-5">{errors.map((error) => <li key={error}>{error}</li>)}</ul>
        {hashOk === false && <p>O SHA-256 do Markdown não bate com metadata.sha256.</p>}
      </main>
    )
  }

  if (hashOk === null) {
    return <main className="px-4 py-10">Conferindo a integridade da apostila…</main>
  }

  return (
    <ProgressProvider>
      <HashRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<CatalogPage />} />
            <Route path="cursos/aif-c01">
              <Route index element={<AifCourseApp />} />
              {['trilhas', 'ler/:chapterId/:sectionId?', 'praticar', 'praticar/:mode', 'flashcards', 'glossario/:entryId?', 'progresso', 'busca', '*'].map(path => (
                <Route key={path} path={path} element={<AifCourseApp />} />
              ))}
            </Route>
            <Route path="cursos/:courseId" element={<CourseLayout />}>
              <Route index element={<HomePage />} />
              <Route path="trilhas" element={<TracksPage />} />
              <Route path="ler/:chapterId/:sectionId?" element={<ReaderPage />} />
              <Route path="praticar" element={<PracticeHub />} />
              <Route path="praticar/treino" element={<TrainPage />} />
              <Route path="praticar/simulado" element={<ExamPage />} />
              <Route path="praticar/resultado/:attemptId" element={<ResultPage />} />
              <Route path="flashcards" element={<FlashcardsPage />} />
              <Route path="glossario/:entryId?" element={<GlossaryPage />} />
              <Route path="progresso" element={<ProgressPage />} />
              <Route path="busca" element={<SearchPage />} />
            </Route>
            {['trilhas', 'ler/*', 'praticar/*', 'flashcards', 'glossario/*', 'progresso', 'busca'].map((path) => (
              <Route key={path} path={path} element={<LegacyRedirect />} />
            ))}
            <Route path="*" element={<Navigate replace to="/" />} />
          </Route>
        </Routes>
      </HashRouter>
    </ProgressProvider>
  )
}
