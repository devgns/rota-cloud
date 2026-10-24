import { Meter } from '@/components/diagrams/controls'
import { ItemView } from './ItemView'
import { SINGLE, grade, stats } from './items'
import { emptyWorksheet, useAifProgress, type Attempt } from './progress'

/** As 80 questões do capítulo 27, para marcar e corrigir na própria página. */
export function AifWorksheet() {
  const { progress, update } = useAifProgress()
  const sheet = progress.worksheet
  const marked = SINGLE.filter((q) => sheet.answers[q.id]).length
  const result = stats(SINGLE, sheet.answers)
  const open = (id: string) => sheet.resultShown || sheet.revealed.includes(id)

  const mark = (id: string, letter: string) => update((v) => ({ ...v, worksheet: { ...v.worksheet, answers: { ...v.worksheet.answers, [id]: letter } } }))
  const reveal = (id: string) => update((v) => ({
    ...v,
    answers: v.worksheet.answers[id] ? { ...v.answers, [id]: v.worksheet.answers[id]! } : v.answers,
    worksheet: { ...v.worksheet, revealed: [...new Set([...v.worksheet.revealed, id])] },
  }))
  const showResult = () => {
    update((v) => {
      const r = stats(SINGLE, v.worksheet.answers)
      const attempt: Attempt = { id: `${Date.now()}`, date: new Date().toISOString(), mode: 'capítulo 27', correct: r.correct, total: SINGLE.length, byDomain: r.byDomain, responses: { ...v.worksheet.answers } }
      return { ...v, answers: { ...v.answers, ...v.worksheet.answers }, attempts: [...v.attempts, attempt], worksheet: { ...v.worksheet, resultShown: true } }
    })
    window.requestAnimationFrame(() => document.getElementById('resultado-capitulo-27')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <section id="c27-folha" className="mt-8 scroll-mt-24" aria-labelledby="c27-folha-titulo">
      <h2 id="c27-folha-titulo" className="font-serif text-2xl">Parte A — responda aqui</h2>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        Marque as alternativas no seu ritmo; as marcações ficam salvas neste navegador. <strong>Ver resposta</strong> abre o comentário só daquela questão. <strong>Ver resultado</strong>, no final, corrige as 80 de uma vez e registra a tentativa em Progresso. Isto não vira nota oficial da AWS.
      </p>
      <p className="mt-3 text-sm font-semibold">{marked} de 80 marcadas{sheet.resultShown ? ` · ${result.correct} certas` : ''}</p>
      <div className="mt-2 flex flex-wrap gap-1" aria-label="Ir para a questão">
        {SINGLE.map((q, i) => {
          const has = Boolean(sheet.answers[q.id])
          const tone = open(q.id) ? (grade(q, sheet.answers[q.id]) ? 'border-[var(--color-ok)] bg-[var(--color-ok)] text-white dark:text-[#121820]' : 'border-[var(--color-bad)] bg-[var(--color-bad-soft)] text-[var(--color-bad)]') : has ? 'border-[var(--color-navy)] bg-[var(--color-navy-wash)]' : 'border-[var(--color-line)]'
          return <button key={q.id} type="button" aria-label={`Ir para a questão ${i + 1}`} className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs ${tone}`} onClick={() => document.getElementById(`folha-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{i + 1}</button>
        })}
      </div>
      <ol className="m-0 mt-6 space-y-5 p-0">
        {SINGLE.map((q) => (
          <li key={q.id} id={`folha-${q.id}`} className="scroll-mt-24 list-none rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-5">
            <ItemView item={q} answer={sheet.answers[q.id]} onChange={(a) => mark(q.id, a as string)} locked={open(q.id)} revealed={open(q.id)} heading="h3" />
            {!open(q.id) && <button type="button" className="choice mt-3 text-sm" onClick={() => reveal(q.id)}>Ver resposta</button>}
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-2 border-t border-[var(--color-line)] pt-6">
        <button type="button" className="btn-primary rounded-lg bg-[var(--color-navy)] px-5 py-2.5 font-semibold text-white" onClick={showResult} disabled={sheet.resultShown}>Ver resultado</button>
        <button type="button" className="choice" onClick={() => { if (window.confirm('Limpar as 80 marcações desta página?')) update((v) => ({ ...v, worksheet: emptyWorksheet() })) }}>Limpar marcações</button>
      </div>
      {sheet.resultShown && (
        <div id="resultado-capitulo-27" className="mt-4 scroll-mt-24 rounded-2xl border border-[var(--color-line)] p-5" role="status">
          <h3 className="font-serif text-2xl">Resultado: {result.correct} de 80 ({Math.round((result.correct / 80) * 100)}%)</h3>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{80 - marked} em branco contam como erro. Percentual desta seleção autoral, não a nota de 100 a 1.000 da AWS.</p>
          <div className="mt-3 grid gap-2">
            {Object.entries(result.byDomain).sort().map(([d, s]) => <Meter key={d} label={`Domínio ${d}`} value={s.correct / s.total} display={`${s.correct}/${s.total}`} tone={s.correct / s.total >= 0.8 ? 'ok' : s.correct / s.total >= 0.6 ? 'warn' : 'bad'} />)}
          </div>
          <p className="mt-3 text-sm">As questões acima agora mostram a correção e o comentário. Role para revisar as que ficaram em vermelho.</p>
        </div>
      )}
    </section>
  )
}
