import { useState } from 'react'
import { FlowPlayer, type FlowEdge, type FlowFrame, type FlowNode } from './FlowPlayer'
import { Choices, DiagramShell } from './kit'

type ModeId = 'sync' | 'async' | 'burst'

const user: FlowNode = { id: 'u', label: 'Usuário', x: 8, y: 90, w: 110, h: 62 }
const api: FlowNode = { id: 'api', label: 'API', x: 160, y: 90, w: 110, h: 62 }

const modes: readonly { id: ModeId; label: string; nodes: readonly FlowNode[]; edges: readonly FlowEdge[]; frames: readonly FlowFrame[] }[] = [
  {
    id: 'sync',
    label: 'Síncrono',
    nodes: [user, api, { id: 'gen', label: 'Gerar Excel', sub: '~90 s de trabalho', x: 330, y: 90, w: 150, h: 62 }],
    edges: [
      { from: 'u', to: 'api', label: 'HTTP' },
      { from: 'api', to: 'gen' },
    ],
    frames: [
      { caption: 'O usuário pede a planilha.', tokens: [{ id: 'r', label: 'R', at: 'u' }], hot: ['u>api'] },
      { caption: 'A API chama a geração e espera. A conexão HTTP do usuário continua aberta.', tokens: [{ id: 'r', label: 'R', at: 'gen' }], hot: ['api>gen'], nodeTones: { u: 'warn', api: 'warn' }, subs: { u: 'esperando… 10 s', api: 'thread presa' } },
      { caption: 'Com dez usuários fazendo o mesmo, a API tem dez conexões presas, consumindo memória e CPU.', tokens: [{ id: 'r', label: 'R', at: 'gen' }], nodeTones: { u: 'warn', api: 'warn' }, subs: { u: 'esperando… 45 s', api: '10 threads presas' } },
      { caption: 'O balanceador ou o navegador desiste antes de o arquivo ficar pronto. O usuário vê erro — e talvez tente de novo, dobrando a carga.', tokens: [{ id: 'r', label: 'R', at: 'gen', tone: 'bad' }], nodeTones: { u: 'bad', api: 'warn' }, subs: { u: 'timeout', api: 'ainda trabalhando' } },
    ],
  },
  {
    id: 'async',
    label: 'Assíncrono com SQS',
    nodes: [
      user,
      api,
      { id: 'q', label: 'Fila SQS', x: 312, y: 90, w: 110, h: 62 },
      { id: 'w', label: 'Worker', sub: 'ECS ou Lambda', x: 464, y: 90, w: 110, h: 62 },
      { id: 's3', label: 'S3', sub: 'relatório', x: 464, y: 200, w: 110, h: 50 },
    ],
    edges: [
      { from: 'u', to: 'api', label: 'HTTP' },
      { from: 'api', to: 'q', label: 'publica' },
      { from: 'q', to: 'w', label: 'consome' },
      { from: 'w', to: 's3', label: 'grava' },
    ],
    frames: [
      { caption: 'O usuário pede a planilha.', tokens: [{ id: 'r', label: 'R', at: 'u' }], hot: ['u>api'] },
      { caption: 'A API valida, publica uma mensagem na fila e responde na hora: “processamento iniciado”.', tokens: [{ id: 'm', label: 'M', at: 'q' }, { id: 'ok', label: '✓', at: 'u', tone: 'ok' }], hot: ['api>q'], nodeTones: { u: 'ok' }, subs: { u: 'livre em 200 ms' } },
      { caption: 'Um worker consome a mensagem e gera o arquivo, sem segurar nenhuma conexão do usuário.', tokens: [{ id: 'm', label: 'M', at: 'w', tone: 'amber' }], hot: ['q>w'], nodeTones: { w: 'focus' }, subs: { w: 'gerando…' } },
      { caption: 'O arquivo vai para o S3 e o usuário é avisado, com um link temporário (presigned URL) depois de checar a autorização.', tokens: [{ id: 'f', label: 'F', at: 's3', tone: 'ok' }, { id: 'n', label: '✉', at: 'u', tone: 'ok' }], hot: ['w>s3'], nodeTones: { s3: 'ok' } },
      { caption: 'O preço: consistência eventual, tela de status, tratamento de mensagem duplicada e monitoramento da fila.', tokens: [{ id: 'f', label: 'F', at: 's3', tone: 'ok' }] },
    ],
  },
  {
    id: 'burst',
    label: 'Pico de pedidos',
    nodes: [
      { ...user, label: 'Usuários' },
      api,
      { id: 'q', label: 'Fila SQS', x: 300, y: 70, w: 140, h: 102 },
      { id: 'w1', label: 'Worker 1', x: 500, y: 6, w: 120, h: 54 },
      { id: 'w2', label: 'Worker 2', x: 500, y: 94, w: 120, h: 54 },
      { id: 'w3', label: 'Worker 3', x: 500, y: 182, w: 120, h: 54 },
    ],
    edges: [
      { from: 'u', to: 'api' },
      { from: 'api', to: 'q' },
      { from: 'q', to: 'w1' },
      { from: 'q', to: 'w2' },
      { from: 'q', to: 'w3' },
    ],
    frames: [
      { caption: 'Fim do mês: dez pedidos chegam juntos. A API responde a todos em milissegundos.', tokens: Array.from({ length: 10 }, (_, i) => ({ id: `m${i}`, label: String(i + 1), at: 'q' })), hot: ['api>q'], nodeTones: { w2: 'dim', w3: 'dim' } },
      { caption: 'A fila absorve o pico. A profundidade da fila vira a métrica do Auto Scaling, que liga mais workers.', tokens: [...Array.from({ length: 7 }, (_, i) => ({ id: `m${i + 3}`, label: String(i + 4), at: 'q' })), { id: 'm0', label: '1', at: 'w1', tone: 'amber' as const }, { id: 'm1', label: '2', at: 'w2', tone: 'amber' as const }, { id: 'm2', label: '3', at: 'w3', tone: 'amber' as const }], hot: ['q>w1', 'q>w2', 'q>w3'] },
      { caption: 'Três workers drenam a fila em paralelo.', tokens: [{ id: 'm9', label: '10', at: 'q' }, { id: 'm6', label: '7', at: 'w1', tone: 'amber' }, { id: 'm7', label: '8', at: 'w2', tone: 'amber' }, { id: 'm8', label: '9', at: 'w3', tone: 'amber' }], hot: ['q>w1', 'q>w2', 'q>w3'] },
      { caption: 'Fila vazia: o Auto Scaling volta para um worker. Ninguém recebeu timeout.', tokens: [], nodeTones: { w2: 'dim', w3: 'dim' } },
    ],
  },
]

export function SyncAsyncDiagram() {
  const [modeId, setModeId] = useState<ModeId>('sync')
  const mode = modes.find((item) => item.id === modeId) ?? modes[0]!
  return (
    <DiagramShell
      label="Exportação de planilha feita de forma síncrona e assíncrona"
      kicker="Integração"
      title="Esperar a planilha ou receber um aviso?"
      lead="A mesma exportação de 90 segundos, de três jeitos. Avance os passos e compare quem fica preso esperando."
      limits="Tempos e número de workers são ilustrativos. Notificação pode ser por SNS, e-mail (SES), WebSocket ou consulta de status pela própria tela."
    >
      <Choices label="Modo" options={modes} value={mode.id} onChange={setModeId} />
      <FlowPlayer key={mode.id} title={mode.label} width={640} height={252} nodes={mode.nodes} edges={mode.edges} frames={mode.frames} />
    </DiagramShell>
  )
}
