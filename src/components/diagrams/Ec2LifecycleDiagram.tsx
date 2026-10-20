import { useState } from 'react'
import { Callout, DiagramShell, Svg, SvgArrow, SvgNode, type Tone } from './kit'

type State = 'running' | 'stopped' | 'terminated'

interface Meter {
  item: string
  status: string
  tone: Tone
  detail: string
}

function meters(state: State, keepData: boolean): readonly Meter[] {
  const alive = state !== 'terminated'
  return [
    {
      item: 'Computação (vCPU e memória)',
      status: state === 'running' ? 'cobrando' : 'parou',
      tone: state === 'running' ? 'warn' : 'ok',
      detail: state === 'running' ? 'Cobrada enquanto a instância roda, conforme o modelo de compra.' : 'Sem cobrança de computação neste estado.',
    },
    {
      item: 'Volume EBS raiz',
      status: alive ? 'cobrando' : 'apagado',
      tone: alive ? 'warn' : 'ok',
      detail: alive ? 'O disco continua existindo e é cobrado por GB provisionado, mesmo parado.' : 'Com “excluir no encerramento” ligado (padrão do raiz), o volume some junto.',
    },
    {
      item: 'Volume EBS de dados',
      status: alive ? 'cobrando' : keepData ? 'órfão, cobrando' : 'apagado',
      tone: alive ? 'warn' : keepData ? 'bad' : 'ok',
      detail: alive
        ? 'Persiste entre stop e start. É cobrado nos dois estados.'
        : keepData
          ? 'Sobreviveu ao encerramento e continua cobrado, agora sem instância. Fácil de esquecer.'
          : 'Foi excluído no encerramento, junto com os dados.',
    },
    {
      item: 'Instance store',
      status: state === 'running' ? 'dados presentes' : 'dados perdidos',
      tone: state === 'running' ? 'plain' : 'bad',
      detail: state === 'running' ? 'Disco local e efêmero, incluído no preço da instância.' : 'Efêmero: o conteúdo não sobrevive a stop nem a terminate.',
    },
    {
      item: 'Snapshots do EBS',
      status: 'cobrando',
      tone: 'warn',
      detail: 'Ficam no armazenamento de snapshots e independem da instância.',
    },
    {
      item: 'Elastic IP (IPv4 público)',
      status: 'cobrando',
      tone: 'warn',
      detail: state === 'running' ? 'Endereço IPv4 público tem custo.' : 'Continua alocado e cobrado até ser liberado — com a instância parada ou encerrada.',
    },
  ]
}

const pos: Record<State, { x: number; y: number; w: number; h: number }> = {
  running: { x: 30, y: 44, w: 150, h: 54 },
  stopped: { x: 340, y: 44, w: 150, h: 54 },
  terminated: { x: 185, y: 150, w: 150, h: 54 },
}

const label: Record<State, string> = { running: 'running', stopped: 'stopped', terminated: 'terminated' }

export function Ec2LifecycleDiagram() {
  const [state, setState] = useState<State>('running')
  const [keepData, setKeepData] = useState(true)
  const rows = meters(state, keepData)
  const billing = rows.filter((row) => row.status.includes('cobrando')).length

  return (
    <DiagramShell
      label="Estados de uma instância EC2 e o que continua sendo cobrado"
      kicker="EC2"
      title="Parei a instância. Parou de cobrar?"
      lead="Mude o estado e acompanhe o que sobrevive e o que continua no medidor."
      limits="Visão simplificada: hibernate, reboot e estados transitórios (pending, stopping) ficam de fora. O IP público automático é liberado no stop; aqui aparece só o Elastic IP. Preços variam por Região e tipo."
    >
      <div className="choice-row" role="group" aria-label="Transições">
        <button type="button" className="choice" disabled={state !== 'stopped'} onClick={() => setState('running')}>
          Iniciar
        </button>
        <button type="button" className="choice" disabled={state !== 'running'} onClick={() => setState('stopped')}>
          Parar
        </button>
        <button type="button" className="choice" disabled={state === 'terminated'} onClick={() => setState('terminated')}>
          Encerrar
        </button>
        <button type="button" className="choice" disabled={state === 'running'} onClick={() => setState('running')}>
          Nova instância
        </button>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="accent-[var(--color-navy)]" checked={!keepData} onChange={(event) => setKeepData(!event.currentTarget.checked)} />
        Volume de dados com “excluir no encerramento” (DeleteOnTermination)
      </label>
      <div className="diagram-canvas">
        <Svg width={520} height={214} minWidth={420} title={`Instância no estado ${state}`}>
          <SvgArrow from={pos.running} to={pos.stopped} label="parar / iniciar" both state={state === 'terminated' ? 'dim' : 'idle'} />
          <SvgArrow from={pos.running} to={pos.terminated} state={state === 'terminated' ? 'hot' : 'idle'} />
          <SvgArrow from={pos.stopped} to={pos.terminated} state={state === 'terminated' ? 'hot' : 'idle'} />
          <text x={260} y={134} fontSize={11} textAnchor="middle" className="dg-soft">
            encerrar (sem volta)
          </text>
          {(Object.keys(pos) as State[]).map((key) => (
            <SvgNode
              key={key}
              {...pos[key]}
              label={label[key]}
              sub={key === 'running' ? 'computação ligada' : key === 'stopped' ? 'computação desligada' : 'instância apagada'}
              tone={key === state ? (key === 'terminated' ? 'bad' : 'focus') : 'plain'}
              fontSize={14}
            />
          ))}
        </Svg>
      </div>
      <ul className="m-0 mt-2 grid list-none gap-1.5 p-0 sm:grid-cols-2">
        {rows.map((row) => (
          <li key={row.item} className="dg-box text-sm" data-tone={row.tone}>
            <span className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-semibold">{row.item}</span>
              <span className="dg-chip">{row.status}</span>
            </span>
            <span className="mt-0.5 block text-xs text-ink-soft">{row.detail}</span>
          </li>
        ))}
      </ul>
      <Callout tone={state === 'running' ? 'plain' : 'warn'} title={`${billing} de ${rows.length} itens ainda cobram em ${state}`} live>
        “Parei a EC2, logo não pago mais nada” é falso: EBS, snapshots e IPv4 público seguem no medidor até serem apagados ou liberados.
      </Callout>
    </DiagramShell>
  )
}
