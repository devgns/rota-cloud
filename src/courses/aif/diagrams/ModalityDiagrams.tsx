import { useState } from 'react'
import { Callout, DiagramShell, StepperControls, Svg, useStepper } from '@/components/diagrams/kit'

/* 10.1 — matriz entrada × saída */

const ins = ['Texto', 'Imagem', 'Áudio / vídeo', 'Dados estruturados', 'Código'] as const
const outs = ['Texto', 'Imagem', 'Áudio', 'Código', 'Ação'] as const

type Cell = { use: string; care: string; note?: string }

const cells: Partial<Record<`${number}-${number}`, Cell>> = {
  '0-0': { use: 'Resumir um contrato, responder dúvidas', care: 'Citação das fontes e revisão jurídica.' },
  '0-1': { use: 'Gerar ilustração a partir de descrição', care: 'Direitos, marcas e fidelidade ao pedido.', note: 'Muitos geradores de imagem usam modelos de difusão.' },
  '0-2': { use: 'Narrar um comunicado', care: 'Voz e consentimento.', note: 'Para só converter texto em fala, Amazon Polly é o encaixe direto.' },
  '0-3': { use: 'Gerar código a partir de instruções', care: 'Segurança, licença e testes antes de usar.' },
  '0-4': { use: 'Atendimento que executa operações', care: 'Permissão por ação e confirmação humana (cap. 15).' },
  '1-0': { use: 'Descrever uma foto ou um gráfico', care: 'Pode deixar detalhes passar; não use como prova.' },
  '1-1': { use: 'Variações a partir de imagem de referência', care: 'Direitos da imagem de origem.' },
  '2-0': { use: 'Transcrever e resumir uma reunião', care: 'Consentimento e confidencialidade.', note: 'Só transcrever 5 mil chamadas? Amazon Transcribe é mais direto que um chat genérico.' },
  '3-0': { use: 'Descrição de produto a partir da ficha técnica', care: 'Não inventar propriedades que não estão nos dados.' },
  '4-0': { use: 'Explicar um trecho de código ou API', care: 'Conferir com a documentação.' },
  '4-3': { use: 'Sugerir testes, refatorar, completar código', care: 'Revisão humana, testes e varredura de segurança.' },
}

export function ModalityMatrixDiagram() {
  const [active, setActive] = useState<`${number}-${number}`>('2-0')
  const cell = cells[active]
  const [r, c] = active.split('-').map(Number) as [number, number]
  return (
    <DiagramShell
      label="Matriz de modalidades de entrada e saída da IA generativa"
      kicker="Multimodalidade"
      title="Nem toda IA generativa produz texto"
      lead="Cada célula é um par entrada → saída. Clique para ver o caso de uso e a restrição que importa."
      limits="Um modelo é multimodal quando recebe ou gera mais de um tipo de dado. Confirme sempre a capacidade real de entrada e saída do modelo escolhido."
    >
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[30rem] border-separate border-spacing-1 text-xs">
          <thead>
            <tr><th className="text-left">entrada ↓ / saída →</th>{outs.map((o) => <th key={o}>{o}</th>)}</tr>
          </thead>
          <tbody>
            {ins.map((name, i) => (
              <tr key={name}>
                <th className="text-left">{name}</th>
                {outs.map((_, j) => {
                  const key = `${i}-${j}` as const
                  const has = Boolean(cells[key])
                  return (
                    <td key={key} className="p-0">
                      <button type="button" disabled={!has} aria-pressed={active === key} aria-label={`${name} para ${outs[j]}`} onClick={() => setActive(key)} className="dg-box h-9 w-full text-center" data-tone={active === key ? 'focus' : has ? 'plain' : 'dim'}>
                        {has ? '●' : '·'}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout tone="focus" title={`${ins[r]} → ${outs[c]}: ${cell?.use ?? ''}`} live>
        <p className="m-0"><strong>Cuidado:</strong> {cell?.care}</p>
        {cell?.note && <p className="m-0 mt-1 text-ink-soft">{cell.note}</p>}
      </Callout>
    </DiagramShell>
  )
}

/* 10.1 — difusão: do ruído à imagem */

const N = 16
const target = (row: number, col: number) => {
  const sun = Math.hypot(row - 3, col - 12.5) < 2.3
  const roof = row >= 4 && row <= 7 && Math.abs(col - 6) <= row - 4 + 0.5
  const body = row >= 8 && row <= 13 && col >= 3 && col <= 9
  const door = row >= 10 && row <= 13 && col >= 5 && col <= 6
  const ground = row >= 14
  if (door) return 0.15
  return sun || roof || body || ground ? 1 : 0
}
const noise = (row: number, col: number) => {
  const v = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453
  return v - Math.floor(v)
}
const levels = [1, 0.8, 0.6, 0.4, 0.2, 0]
const captions = [
  'Começa de ruído puro. O pedido de texto (“uma casa com sol”) condiciona o processo.',
  'Passo 1: o modelo estima e remove um pouco do ruído.',
  'Passo 2: formas grandes começam a aparecer.',
  'Passo 3: estrutura reconhecível; detalhes ainda incertos.',
  'Passo 4: refinamento de bordas e detalhes.',
  'Imagem final. Cada passo removeu ruído — o processo é iterativo, não “desenhado” de uma vez.',
]

export function DiffusionDiagram() {
  const stepper = useStepper(levels.length, 900)
  const n = levels[stepper.step]!
  return (
    <DiagramShell
      label="Modelo de difusão transformando ruído em imagem"
      kicker="Modelos de difusão"
      title="Do ruído à imagem, um passo de cada vez"
      lead="Reproduza: a cada passo o modelo remove parte do ruído, guiado pelo texto."
      limits="Ilustração conceitual com 16×16 pixels. Modelos reais trabalham num espaço latente, com dezenas de passos, e nem toda geração de imagem usa a mesma arquitetura."
    >
      <StepperControls stepper={stepper} total={levels.length} />
      <div className="diagram-canvas">
        <Svg width={640} height={200} minWidth={380} title="Grade de pixels saindo do ruído até formar uma casa com sol">
          <text x={20} y={30} fontSize={12} fontWeight={600}>prompt:</text>
          <text x={20} y={48} fontSize={12}>“uma casa com sol”</text>
          <text x={20} y={90} fontSize={11} className="dg-soft">ruído restante</text>
          <rect x={20} y={98} width={150} height={10} rx={5} className="fill-line" />
          <rect x={20} y={98} width={150 * n} height={10} rx={5} className="dg-fade fill-amber" style={{ transition: 'width 400ms ease' }} />
          <text x={20} y={126} fontSize={12} fontWeight={700}>{Math.round(n * 100)}%</text>
          <g transform="translate(250 8)">
            {Array.from({ length: N * N }, (_, k) => {
              const row = Math.floor(k / N)
              const col = k % N
              const v = target(row, col) * (1 - n) + noise(row, col) * n
              return <rect key={k} x={col * 11.5} y={row * 11.5} width={11} height={11} className="dg-fade fill-navy" opacity={0.08 + v * 0.92} />
            })}
          </g>
        </Svg>
      </div>
      <p className="m-0 mt-2 rounded-md border border-line bg-paper px-3 py-2 text-sm" role="status">{captions[stepper.step]}</p>
    </DiagramShell>
  )
}
