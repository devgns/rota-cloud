import { useState } from 'react'
import { Callout, Choices, DiagramShell, type Tone } from './kit'

type ActionId = 'get' | 'delete'
type PolicyId = 'allowGet' | 'allowDelete' | 'scpDeny' | 'boundary'

interface Policy {
  id: PolicyId
  kind: string
  statement: string
  grants: boolean
  appliesTo: (action: ActionId) => boolean
}

const actions: readonly { id: ActionId; label: string; full: string }[] = [
  { id: 'get', label: 's3:GetObject', full: 's3:GetObject em relatorios/jan.csv' },
  { id: 'delete', label: 's3:DeleteBucket', full: 's3:DeleteBucket no bucket relatorios' },
]

const policies: readonly Policy[] = [
  { id: 'allowGet', kind: 'Identity policy da role', statement: 'Allow s3:GetObject em relatorios/*', grants: true, appliesTo: (a) => a === 'get' },
  { id: 'allowDelete', kind: 'Identity policy da role', statement: 'Allow s3:DeleteBucket em relatorios', grants: true, appliesTo: (a) => a === 'delete' },
  { id: 'scpDeny', kind: 'SCP da OU Produção', statement: 'Deny s3:DeleteBucket em *', grants: false, appliesTo: (a) => a === 'delete' },
  { id: 'boundary', kind: 'Permissions boundary', statement: 'Teto: no máximo s3:Get* e s3:List*', grants: false, appliesTo: (a) => a !== 'get' },
]

type Enabled = Record<PolicyId, boolean>

const presets: readonly { id: string; label: string; action: ActionId; enabled: Enabled }[] = [
  { id: 'read', label: 'Leitura comum', action: 'get', enabled: { allowGet: true, allowDelete: false, scpDeny: true, boundary: false } },
  { id: 'case', label: 'Mini-caso 7.7: Allow que não funciona', action: 'delete', enabled: { allowGet: false, allowDelete: true, scpDeny: true, boundary: false } },
  { id: 'boundary', label: 'Boundary corta', action: 'delete', enabled: { allowGet: true, allowDelete: true, scpDeny: false, boundary: true } },
  { id: 'silence', label: 'Ninguém disse nada', action: 'get', enabled: { allowGet: false, allowDelete: false, scpDeny: false, boundary: false } },
]

type GateState = 'pass' | 'stop' | 'skip'

function evaluate(action: ActionId, enabled: Enabled) {
  const on = policies.filter((p) => enabled[p.id])
  const deny = on.find((p) => p.id === 'scpDeny' && p.appliesTo(action))
  const ceiling = on.find((p) => p.id === 'boundary' && p.appliesTo(action))
  const allow = on.find((p) => p.grants && p.appliesTo(action))
  const gates: GateState[] = ['skip', 'skip', 'skip']
  if (deny) {
    gates[0] = 'stop'
    return { gates, tone: 'bad' as Tone, verdict: 'Negado — Deny explícito', why: `${deny.kind}: ${deny.statement}. Deny explícito vence qualquer Allow, inclusive o da role.` }
  }
  gates[0] = 'pass'
  if (ceiling) {
    gates[1] = 'stop'
    return { gates, tone: 'bad' as Tone, verdict: 'Negado — fora do teto', why: 'O permissions boundary não inclui esta ação. Boundary e SCP só limitam: o Allow da identity policy não ultrapassa o teto.' }
  }
  gates[1] = 'pass'
  if (!allow) {
    gates[2] = 'stop'
    return { gates, tone: 'bad' as Tone, verdict: 'Negado — negação implícita', why: 'Nenhum Allow se aplica a este pedido. Sem Allow, o padrão é negar; não precisa existir um Deny.' }
  }
  gates[2] = 'pass'
  return { gates, tone: 'ok' as Tone, verdict: 'Permitido', why: `${allow.kind}: ${allow.statement}. Nenhum Deny se aplica e a ação cabe nos tetos.` }
}

const gateText = [
  { q: 'Algum Deny explícito se aplica?', no: 'não', yes: 'sim → nega' },
  { q: 'A ação cabe nos tetos (SCP, boundary)?', no: 'não → nega', yes: 'sim' },
  { q: 'Algum Allow se aplica?', no: 'não → nega (implícito)', yes: 'sim → permite' },
]

const gateTone: Record<GateState, Tone> = { pass: 'ok', stop: 'bad', skip: 'dim' }

export function IamEvaluatorDiagram() {
  const [action, setAction] = useState<ActionId>('delete')
  const [enabled, setEnabled] = useState<Enabled>(presets[1]!.enabled)
  const result = evaluate(action, enabled)

  return (
    <DiagramShell
      label="Avaliação simplificada de políticas IAM com SCP e permissions boundary"
      kicker="Autorização"
      title="Por que o Allow não funcionou?"
      lead="Ligue e desligue políticas, troque o pedido e acompanhe por qual porta a avaliação passa ou para."
      limits="Modelo simplificado de uma conta. Ficam de fora: Condition, session policies, RCP, resource policies cruzando contas e a exigência de que a SCP também permita (aqui supomos a SCP padrão FullAWSAccess mais o Deny mostrado)."
    >
      <div className="choice-row" role="group" aria-label="Exemplos prontos">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="choice text-sm"
            onClick={() => {
              setAction(preset.action)
              setEnabled(preset.enabled)
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <Choices label="Pedido" options={actions} value={action} onChange={setAction} />
      <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_1fr]">
        <fieldset className="m-0 grid gap-1.5 border-0 p-0">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">Políticas no caminho</legend>
          {policies.map((policy) => {
            const applies = policy.appliesTo(action)
            const on = enabled[policy.id]
            return (
              <label key={policy.id} className="dg-box flex cursor-pointer items-start gap-2 text-sm" data-tone={on ? (applies ? 'focus' : 'plain') : 'dim'}>
                <input
                  type="checkbox"
                  className="mt-1 accent-[var(--color-navy)]"
                  checked={on}
                  onChange={(event) => {
                    const checked = event.currentTarget.checked
                    setEnabled((current) => ({ ...current, [policy.id]: checked }))
                  }}
                />
                <span>
                  <span className="block text-xs text-ink-soft">{policy.kind}</span>
                  <code className="text-[0.8rem]">{policy.statement}</code>
                  {on && <span className="mt-0.5 block text-xs font-semibold">{applies ? 'se aplica a este pedido' : 'não se aplica a este pedido'}</span>}
                </span>
              </label>
            )
          })}
        </fieldset>
        <ol className="m-0 grid list-none content-start gap-1.5 p-0" aria-label="Ordem de avaliação">
          <li className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Avaliação</li>
          {gateText.map((gate, i) => {
            const state = result.gates[i] ?? 'skip'
            return (
              <li key={gate.q} className="dg-box text-sm" data-tone={gateTone[state]}>
                <span className="font-semibold">
                  {i + 1}. {gate.q}
                </span>
                <span className="block text-xs">
                  {state === 'skip' ? 'não chegou aqui' : state === 'stop' ? (i === 0 ? gate.yes : gate.no) : i === 0 ? gate.no : gate.yes}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
      <Callout tone={result.tone} title={result.verdict} live>
        {result.why}
      </Callout>
      <p className="mt-2 text-sm text-ink-soft">Regra de prova: Deny explícito ganha; sem Allow, nega; SCP e boundary limitam, nunca concedem.</p>
    </DiagramShell>
  )
}
