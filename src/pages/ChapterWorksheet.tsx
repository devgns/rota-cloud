import { useMemo } from 'react'
import { Button, Panel } from '@/components/ui'
import { domainLabel } from '@/content/studyLayer'
import { getCorpus } from '@/lib/corpus'
import { emptyWorksheet } from '@/lib/progress'
import { gradeSelection, worksheetScore } from '@/lib/quiz'
import type { Domain, Question, QuestionAttempt, WorksheetState } from '@/lib/types'
import { DOMAIN_META } from '@/lib/types'
import { useProgress } from '@/state/ProgressContext'

function anchorsForQuestions(questions: Question[]): Map<string, string> {
  const chapter = getCorpus().chapters.find((item) => item.id === 'chapter-23')
  const anchors = new Map<string, string>()
  for (const section of chapter?.sections ?? []) {
    const match = /^c23-(q\d{2})-/.exec(section.id)
    if (match?.[1]) anchors.set(match[1].toUpperCase(), section.id)
  }
  for (const question of questions) {
    if (!anchors.has(question.id)) anchors.set(question.id, question.id.toLowerCase())
  }
  return anchors
}

export function ChapterWorksheet() {
  const corpus = getCorpus()
  const questions = corpus.questions
  const { progress, update } = useProgress()
  const sheet = progress.worksheet
  const anchors = useMemo(() => anchorsForQuestions(questions), [questions])
  const score = worksheetScore(questions, sheet.answers)
  const marked = questions.filter((question) => (sheet.answers[question.id]?.length ?? 0) > 0).length

  const patch = (recipe: (current: WorksheetState) => WorksheetState, attempts?: QuestionAttempt[]) => {
    update((current) => ({
      ...current,
      worksheet: recipe(current.worksheet),
      questionAttempts: attempts
        ? [
            ...current.questionAttempts.filter(
              (attempt) => !(attempt.sessionId === 'worksheet' && attempts.some((item) => item.questionId === attempt.questionId)),
            ),
            ...attempts,
          ]
        : current.questionAttempts,
    }))
  }

  const toggle = (question: Question, optionId: string) => {
    if (sheet.revealedIds.includes(question.id) || sheet.resultShown) return
    const selected = sheet.answers[question.id] ?? []
    const next = question.kind === 'single'
      ? [optionId]
      : selected.includes(optionId)
        ? selected.filter((id) => id !== optionId)
        : [...selected, optionId]
    patch((current) => ({ ...current, answers: { ...current.answers, [question.id]: next } }))
  }

  const reveal = (question: Question) => {
    const selected = sheet.answers[question.id] ?? []
    const attempt: QuestionAttempt | undefined = selected.length
      ? {
          questionId: question.id,
          selectedOptionIds: selected,
          correct: gradeSelection(question, selected),
          answeredAt: new Date().toISOString(),
          sessionId: 'worksheet',
        }
      : undefined
    patch(
      (current) => ({
        ...current,
        revealedIds: current.revealedIds.includes(question.id) ? current.revealedIds : [...current.revealedIds, question.id],
      }),
      attempt ? [attempt] : undefined,
    )
  }

  const showResult = () => {
    const attempts: QuestionAttempt[] = []
    const now = new Date().toISOString()
    for (const question of questions) {
      const selected = sheet.answers[question.id] ?? []
      if (selected.length === 0) continue
      attempts.push({
        questionId: question.id,
        selectedOptionIds: selected,
        correct: gradeSelection(question, selected),
        answeredAt: now,
        sessionId: 'worksheet',
      })
    }
    patch(
      (current) => ({ ...current, resultShown: true, revealedIds: questions.map((question) => question.id) }),
      attempts,
    )
    window.requestAnimationFrame(() => document.getElementById('resultado-capitulo-23')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const reset = () => {
    update((current) => ({
      ...current,
      worksheet: emptyWorksheet(),
      questionAttempts: current.questionAttempts.filter((attempt) => attempt.sessionId !== 'worksheet'),
    }))
  }

  return (
    <div className="mt-8">
      <h2 id="c23-parte-a-questoes" className="font-sans text-2xl font-semibold">Parte A — questões</h2>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Marque as alternativas no seu ritmo. <strong>Ver resposta</strong> abre só aquela questão. <strong>Ver resultado</strong>, no final, corrige as 80 de uma vez. O gabarito corrido da apostila fica escondido enquanto você responde. Isto não vira nota oficial da AWS.
      </p>
      <p className="mt-3 text-sm font-semibold">{marked} de 80 marcadas{sheet.resultShown ? ` · ${score.correct} certas` : ''}</p>
      <div className="mt-3 flex flex-wrap gap-1" aria-label="Ir para a questão">
        {questions.map((question, index) => {
          const hasAnswer = (sheet.answers[question.id]?.length ?? 0) > 0
          const open = sheet.resultShown || sheet.revealedIds.includes(question.id)
          const right = open && hasAnswer && gradeSelection(question, sheet.answers[question.id] ?? [])
          return (
            <button
              key={question.id}
              type="button"
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs ${open ? (right ? 'border-[var(--color-ok)] bg-[var(--color-ok)] text-white dark:text-[#121820]' : hasAnswer ? 'border-[var(--color-bad)] text-[var(--color-bad)]' : 'border-[var(--color-line)]') : hasAnswer ? 'border-[var(--color-navy)] bg-[var(--color-amber-soft)]' : 'border-[var(--color-line)]'}`}
              onClick={() => document.getElementById(anchors.get(question.id) ?? '')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              {index + 1}
            </button>
          )
        })}
      </div>
      <ol className="mt-6 space-y-6">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            anchor={anchors.get(question.id) ?? question.id}
            selected={sheet.answers[question.id] ?? []}
            revealed={sheet.resultShown || sheet.revealedIds.includes(question.id)}
            onToggle={(optionId) => toggle(question, optionId)}
            onReveal={() => reveal(question)}
          />
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-2 border-t border-[var(--color-line)] pt-6">
        <Button onClick={showResult}>Ver resultado</Button>
        <Button variant="ghost" onClick={reset}>Limpar marcações</Button>
      </div>
      {sheet.resultShown && <ResultPanel score={score} />}
    </div>
  )
}

function ResultPanel({ score }: { score: ReturnType<typeof worksheetScore> }) {
  const percent = Math.round((score.correct / 80) * 100)
  return (
    <Panel className="mt-4 scroll-mt-24">
      <h3 id="resultado-capitulo-23" className="text-lg font-semibold">Resultado deste simulado</h3>
      <p className="mt-2">
        {score.correct} certas em 80 ({percent}%). {score.answered - score.correct} erradas e {score.blank} em branco. Em branco não conta como acerto.
      </p>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Percentual desta seleção autoral. Não é a nota de 100 a 1000 da AWS e não indica aprovação.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {([1, 2, 3, 4] as Domain[]).map((domain) => (
          <p key={domain} className="text-sm">
            <span className="font-semibold">{DOMAIN_META[domain].title}.</span> {score.byDomain[domain].correct}/{score.byDomain[domain].total}
          </p>
        ))}
      </div>
    </Panel>
  )
}

function QuestionCard({
  question,
  anchor,
  selected,
  revealed,
  onToggle,
  onReveal,
}: {
  question: Question
  anchor: string
  selected: string[]
  revealed: boolean
  onToggle: (optionId: string) => void
  onReveal: () => void
}) {
  const correct = gradeSelection(question, selected)
  return (
    <li id={anchor} className="scroll-mt-24 list-none rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-4">
      <p className="text-sm text-[var(--color-ink-soft)]">
        {question.id} · {domainLabel(question.domain)} · {question.kind === 'multiple' ? `marque ${question.selection_count}` : 'escolha única'}
      </p>
      <h3 className="mt-1 text-lg font-semibold">{question.statement_markdown}</h3>
      <fieldset className="mt-3 space-y-2" disabled={revealed}>
        <legend className="sr-only">Alternativas de {question.id}</legend>
        {question.options.map((option) => {
          const checked = selected.includes(option.id)
          const isCorrect = question.correct_option_ids.includes(option.id)
          const tone = !revealed
            ? checked ? 'border-[var(--color-navy)] bg-[var(--color-amber-soft)]' : 'border-[var(--color-line)]'
            : isCorrect
              ? 'border-[var(--color-ok)] bg-[color-mix(in_srgb,var(--color-ok)_12%,transparent)]'
              : checked
                ? 'border-[var(--color-bad)] bg-[color-mix(in_srgb,var(--color-bad)_12%,transparent)]'
                : 'border-[var(--color-line)] opacity-70'
          return (
            <label key={option.id} className={`flex cursor-pointer gap-3 rounded-xl border px-3 py-3 ${tone}`}>
              <input
                className="chapter-check mt-1"
                type={question.kind === 'single' ? 'radio' : 'checkbox'}
                name={question.id}
                checked={checked}
                onChange={() => onToggle(option.id)}
              />
              <span><strong>{option.id}.</strong> {option.text}</span>
            </label>
          )
        })}
      </fieldset>
      {!revealed && (
        <Button className="mt-3" variant="ghost" onClick={onReveal}>Ver resposta</Button>
      )}
      {revealed && (
        <div className="mt-3 text-sm" role="status">
          <p className="font-semibold">{selected.length === 0 ? 'Sem marcação.' : correct ? 'Certa.' : 'Ainda não.'} Gabarito: {question.correct_option_ids.join(', ')}.</p>
          <p className="mt-1">{question.explanation_markdown}</p>
        </div>
      )}
    </li>
  )
}
