import { useState } from 'react'
import { Callout, DiagramShell, Svg, useSvgRefs, type Tone } from './kit'

interface Rules {
  naclIn: boolean
  naclOut: boolean
  sgIn: boolean
}

type Check = 'pass' | 'stop' | 'auto' | 'skip'

function trace(rules: Rules): { checks: { id: string; label: string; state: Check; note: string }[]; tone: Tone; title: string; text: string } {
  const checks: { id: string; label: string; state: Check; note: string }[] = []
  // Ida: cliente → NACL (entrada) → SG (entrada) → instância
  checks.push({ id: 'naclIn', label: 'NACL · entrada 443', state: rules.naclIn ? 'pass' : 'stop', note: rules.naclIn ? 'regra allow' : 'regra deny explícita' })
  if (!rules.naclIn) {
    checks.push({ id: 'sgIn', label: 'SG · entrada 443', state: 'skip', note: 'não chegou' })
    checks.push({ id: 'sgOut', label: 'SG · retorno', state: 'skip', note: 'não chegou' })
    checks.push({ id: 'naclOut', label: 'NACL · saída efêmera', state: 'skip', note: 'não chegou' })
    return { checks, tone: 'bad', title: 'Bloqueado na borda da subnet', text: 'A NACL tem deny explícito, avaliado por número de regra. O pacote nem chega ao security group.' }
  }
  checks.push({ id: 'sgIn', label: 'SG · entrada 443', state: rules.sgIn ? 'pass' : 'stop', note: rules.sgIn ? 'regra allow' : 'sem regra: negação implícita' })
  if (!rules.sgIn) {
    checks.push({ id: 'sgOut', label: 'SG · retorno', state: 'skip', note: 'não chegou' })
    checks.push({ id: 'naclOut', label: 'NACL · saída efêmera', state: 'skip', note: 'não chegou' })
    return { checks, tone: 'bad', title: 'Bloqueado no security group', text: 'O SG só tem regras allow. Sem uma que case, nega — não existe “deny” para escrever no SG.' }
  }
  // Volta: instância → SG (stateful) → NACL (saída, stateless)
  checks.push({ id: 'sgOut', label: 'SG · retorno', state: 'auto', note: 'stateful: volta sozinho' })
  checks.push({ id: 'naclOut', label: 'NACL · saída efêmera', state: rules.naclOut ? 'pass' : 'stop', note: rules.naclOut ? 'regra allow' : 'sem allow para a resposta' })
  if (!rules.naclOut) {
    return {
      checks,
      tone: 'bad',
      title: 'Entrou, mas a resposta não sai',
      text: 'O SG lembrou da conexão e liberou o retorno. A NACL é stateless: a resposta é um pacote novo e precisa de regra de saída para as portas efêmeras do cliente.',
    }
  }
  return { checks, tone: 'ok', title: 'Conexão completa', text: 'Ida liberada nas duas camadas; volta liberada pelo estado do SG e pela regra de saída da NACL.' }
}

const W = 640
const H = 196

const xs = { client: 50, naclIn: 200, sgIn: 360, ec2: 560 }

function Path({ rules }: { rules: Rules }) {
  const refs = useSvgRefs()
  const { checks } = trace(rules)
  const state = (id: string) => checks.find((c) => c.id === id)?.state ?? 'skip'
  const color = (s: Check) => (s === 'stop' ? 'stroke-bad' : s === 'skip' ? 'stroke-line' : 'stroke-navy')
  const goStop = state('naclIn') === 'stop' ? xs.naclIn : state('sgIn') === 'stop' ? xs.sgIn : xs.ec2 - 40
  const backReached = state('sgOut') !== 'skip'
  const backStop = state('naclOut') === 'stop' ? xs.naclIn : xs.client + 40
  const gate = (x: number, y: number, s: Check, label: string, labelAbove = false) => (
    <g>
      <circle cx={x} cy={y} r={11} className={s === 'stop' ? 'fill-bad-soft stroke-bad' : s === 'skip' ? 'fill-paper stroke-line' : 'fill-ok-soft stroke-ok'} strokeWidth={2} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={700}>
        {s === 'stop' ? '✕' : s === 'skip' ? '·' : s === 'auto' ? '↺' : '✓'}
      </text>
      <text x={x} y={labelAbove ? y - 17 : y + 26} textAnchor="middle" fontSize={10} className="dg-soft">
        {label}
      </text>
    </g>
  )
  return (
    <>
      {/* subnet com NACL na borda */}
      <rect x={xs.naclIn} y={14} width={W - xs.naclIn - 10} height={H - 24} rx={10} className="fill-paper-raised stroke-amber" strokeWidth={3} strokeDasharray="10 5" />
      <text x={xs.naclIn + 10} y={32} fontSize={12} fontWeight={600}>
        Subnet — a NACL fica na borda
      </text>
      {/* SG em volta da instância */}
      <rect x={xs.sgIn} y={44} width={W - xs.sgIn - 26} height={H - 66} rx={10} className="fill-paper stroke-navy" strokeWidth={2.5} />
      <text x={xs.sgIn + 10} y={62} fontSize={12} fontWeight={600}>
        Security group — na ENI da instância
      </text>
      <rect x={xs.ec2 - 40} y={76} width={60} height={70} rx={8} className="fill-navy" />
      <text x={xs.ec2 - 10} y={116} textAnchor="middle" fontSize={12} fontWeight={600} style={{ fill: 'var(--color-paper)' }}>
        EC2
      </text>
      {/* cliente */}
      <rect x={10} y={76} width={80} height={70} rx={8} className="fill-paper stroke-ink-soft" />
      <text x={50} y={116} textAnchor="middle" fontSize={12} fontWeight={600}>
        Cliente
      </text>
      {/* ida */}
      <line x1={90} y1={92} x2={goStop - 14} y2={92} className={color('pass')} strokeWidth={2.5} markerEnd={refs.arrowHot} />
      <text x={110} y={86} fontSize={10} className="dg-soft">
        pedido → 443
      </text>
      {/* volta */}
      {backReached && (
        <line x1={xs.ec2 - 40} y1={132} x2={backStop + 14} y2={132} className={state('naclOut') === 'stop' ? 'stroke-bad' : 'stroke-navy'} strokeWidth={2.5} strokeDasharray="6 4" markerEnd={state('naclOut') === 'stop' ? refs.arrowBad : refs.arrowHot} />
      )}
      {backReached && (
        <text x={98} y={150} fontSize={10} className="dg-soft">
          <tspan x={98}>← resposta</tspan>
          <tspan x={98} dy={12}>porta efêmera</tspan>
        </text>
      )}
      {gate(xs.naclIn, 92, state('naclIn'), 'NACL in', true)}
      {gate(xs.sgIn, 92, state('sgIn'), 'SG in', true)}
      {gate(xs.sgIn, 132, state('sgOut'), 'SG out')}
      {gate(xs.naclIn, 132, state('naclOut'), 'NACL out')}
    </>
  )
}

function Toggle({ label, on, onLabel, offLabel, onChange }: { label: string; on: boolean; onLabel: string; offLabel: string; onChange: (value: boolean) => void }) {
  return (
    <div className="rounded-md border border-line px-3 py-2">
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</p>
      <div className="choice-row mb-0 mt-1" role="group" aria-label={label}>
        <button type="button" className="choice text-sm" aria-pressed={on} onClick={() => onChange(true)}>
          {onLabel}
        </button>
        <button type="button" className="choice text-sm" aria-pressed={!on} onClick={() => onChange(false)}>
          {offLabel}
        </button>
      </div>
    </div>
  )
}

export function SgNaclDiagram() {
  const [rules, setRules] = useState<Rules>({ naclIn: true, naclOut: false, sgIn: true })
  const result = trace(rules)
  const set = (key: keyof Rules) => (value: boolean) => setRules((current) => ({ ...current, [key]: value }))

  return (
    <DiagramShell
      label="Pedido HTTPS atravessando Network ACL e security group, ida e volta"
      kicker="Firewall de rede"
      title="Ida e volta por duas camadas"
      lead="Um cliente abre HTTPS para a instância. Configure as regras e veja onde a ida ou a volta param."
      limits="Uma regra por camada, sem numeração nem intervalos reais de portas efêmeras. O SG de saída padrão permite tudo; aqui ele não interfere porque o retorno de conexão aceita é automático."
    >
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Toggle label="NACL · entrada 443" on={rules.naclIn} onLabel="Allow" offLabel="Deny" onChange={set('naclIn')} />
        <Toggle label="SG · entrada 443" on={rules.sgIn} onLabel="Allow" offLabel="Sem regra" onChange={set('sgIn')} />
        <Toggle label="NACL · saída efêmera" on={rules.naclOut} onLabel="Allow" offLabel="Sem regra" onChange={set('naclOut')} />
      </div>
      <div className="diagram-canvas">
        <Svg width={W} height={H} minWidth={500} title={result.title}>
          <Path rules={rules} />
        </Svg>
      </div>
      <Callout tone={result.tone} title={result.title} live>
        {result.text}
      </Callout>
      <dl className="m-0 mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div className="dg-box">
          <dt className="font-semibold">Security group</dt>
          <dd className="m-0 text-ink-soft">Stateful · só allow · na interface da instância · avalia todas as regras</dd>
        </div>
        <div className="dg-box">
          <dt className="font-semibold">Network ACL</dt>
          <dd className="m-0 text-ink-soft">Stateless · allow e deny · na subnet · regras em ordem numérica</dd>
        </div>
      </dl>
    </DiagramShell>
  )
}
