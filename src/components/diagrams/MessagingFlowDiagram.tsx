import { useState } from 'react'
import { FlowPlayer, type FlowEdge, type FlowFrame, type FlowNode } from './FlowPlayer'
import { Choices, DiagramShell } from './kit'

type ModeId = 'sqs' | 'sns' | 'eventbridge' | 'kinesis' | 'stepfunctions'

interface Mode {
  id: ModeId
  label: string
  summary: string
  nodes: readonly FlowNode[]
  edges: readonly FlowEdge[]
  frames: readonly FlowFrame[]
}

const producer: FlowNode = { id: 'p', label: 'Produtor', x: 8, y: 92, w: 120, h: 62 }

const modes: readonly Mode[] = [
  {
    id: 'sqs',
    label: 'SQS',
    summary: 'Fila: cada mensagem é processada por um consumidor, que busca (poll) e apaga.',
    nodes: [
      producer,
      { id: 'q', label: 'Fila SQS', sub: 'guarda até alguém buscar', x: 210, y: 92, w: 190, h: 62 },
      { id: 'w1', label: 'Worker 1', x: 490, y: 22, w: 140, h: 62 },
      { id: 'w2', label: 'Worker 2', x: 490, y: 162, w: 140, h: 62 },
    ],
    edges: [
      { from: 'p', to: 'q', label: 'envia' },
      { from: 'q', to: 'w1', label: 'poll' },
      { from: 'q', to: 'w2', label: 'poll' },
    ],
    frames: [
      { caption: 'O produtor envia três mensagens e segue a vida: não espera ninguém processar.', tokens: [{ id: 'm1', label: '1', at: 'p' }, { id: 'm2', label: '2', at: 'p' }, { id: 'm3', label: '3', at: 'p' }] },
      { caption: 'A fila guarda as mensagens. Se nenhum worker estiver no ar, elas esperam (dentro do período de retenção).', tokens: [{ id: 'm1', label: '1', at: 'q' }, { id: 'm2', label: '2', at: 'q' }, { id: 'm3', label: '3', at: 'q' }], hot: ['p>q'] },
      { caption: 'Os workers competem pela fila: o 1 pega a mensagem 1, o 2 pega a 2. Ninguém recebe cópia — cada mensagem vai para um só.', tokens: [{ id: 'm1', label: '1', at: 'w1' }, { id: 'm2', label: '2', at: 'w2' }, { id: 'm3', label: '3', at: 'q' }], hot: ['q>w1', 'q>w2'] },
      { caption: 'Processou, apagou. A mensagem 3 vai para quem fizer o próximo poll. Se um worker falhar sem apagar, a mensagem volta a ficar visível.', tokens: [{ id: 'm3', label: '3', at: 'w1' }], hot: ['q>w1'] },
      { caption: 'Fila vazia. Mais mensagens do que workers? A fila cresce e você escala os workers — o produtor nem percebe.', tokens: [] },
    ],
  },
  {
    id: 'sns',
    label: 'SNS',
    summary: 'Tópico pub/sub: uma publicação vira uma cópia para cada assinatura, entregue por push.',
    nodes: [
      producer,
      { id: 't', label: 'Tópico SNS', sub: 'não armazena', x: 210, y: 92, w: 170, h: 62 },
      { id: 's1', label: 'Fila SQS', x: 480, y: 6, w: 150, h: 58 },
      { id: 's2', label: 'Lambda', x: 480, y: 94, w: 150, h: 58 },
      { id: 's3', label: 'E-mail', x: 480, y: 182, w: 150, h: 58 },
    ],
    edges: [
      { from: 'p', to: 't', label: 'publica' },
      { from: 't', to: 's1', label: 'push' },
      { from: 't', to: 's2', label: 'push' },
      { from: 't', to: 's3', label: 'push' },
    ],
    frames: [
      { caption: 'O produtor publica um evento “pedido criado”.', tokens: [{ id: 'a', label: '1', at: 'p' }] },
      { caption: 'O tópico recebe a publicação. Ele não é uma fila: não guarda à espera de quem leia.', tokens: [{ id: 'a', label: '1', at: 't' }], hot: ['p>t'] },
      { caption: 'Fan-out: cada assinatura recebe a sua cópia ao mesmo tempo. Ninguém faz poll — o SNS empurra.', tokens: [{ id: 'a', label: '1', at: 's1' }, { id: 'b', label: '1', at: 's2', tone: 'amber' }, { id: 'c', label: '1', at: 's3', tone: 'amber' }], hot: ['t>s1', 't>s2', 't>s3'] },
      { caption: 'Padrão comum: SNS na frente, uma fila SQS por consumidor. Assim cada um processa no próprio ritmo, sem perder mensagens.', tokens: [{ id: 'a', label: '1', at: 's1' }], nodeTones: { s1: 'ok' } },
    ],
  },
  {
    id: 'eventbridge',
    label: 'EventBridge',
    summary: 'Barramento de eventos: regras filtram pelo conteúdo e só os destinos que casam recebem.',
    nodes: [
      { ...producer, label: 'Serviço de pedidos' },
      { id: 'bus', label: 'Event bus', sub: 'avalia as regras', x: 210, y: 92, w: 170, h: 62 },
      { id: 'fat', label: 'Faturamento', sub: 'regra: tipo = criado', x: 470, y: 22, w: 160, h: 62 },
      { id: 'est', label: 'Estoque', sub: 'regra: tipo = cancelado', x: 470, y: 162, w: 160, h: 62 },
    ],
    edges: [
      { from: 'p', to: 'bus', label: 'evento' },
      { from: 'bus', to: 'fat' },
      { from: 'bus', to: 'est' },
    ],
    frames: [
      { caption: 'Três eventos: C (criado), X (cancelado) e A (atualizado).', tokens: [{ id: 'c', label: 'C', at: 'p' }, { id: 'x', label: 'X', at: 'p', tone: 'amber' }, { id: 'a', label: 'A', at: 'p', tone: 'ok' }] },
      { caption: 'O barramento compara cada evento com os padrões das regras.', tokens: [{ id: 'c', label: 'C', at: 'bus' }, { id: 'x', label: 'X', at: 'bus', tone: 'amber' }, { id: 'a', label: 'A', at: 'bus', tone: 'ok' }], hot: ['p>bus'] },
      { caption: 'C casa com a regra do faturamento; X com a do estoque. A não casa com nada e não vai a lugar algum.', tokens: [{ id: 'c', label: 'C', at: 'fat' }, { id: 'x', label: 'X', at: 'est', tone: 'amber' }, { id: 'a', label: 'A', at: 'bus', tone: 'bad' }], hot: ['bus>fat', 'bus>est'] },
      { caption: 'Diferença para o SNS: aqui o conteúdo do evento decide o destino. Também recebe eventos de serviços AWS, de SaaS e agendados.', tokens: [{ id: 'c', label: 'C', at: 'fat' }, { id: 'x', label: 'X', at: 'est', tone: 'amber' }] },
    ],
  },
  {
    id: 'kinesis',
    label: 'Kinesis',
    summary: 'Stream: registros ficam retidos em ordem; vários consumidores leem o mesmo fluxo, cada um no seu ponto.',
    nodes: [
      { ...producer, label: 'Sensores' },
      { id: 'st', label: 'Kinesis Data Stream', sub: 'retém em ordem', x: 190, y: 86, w: 230, h: 74 },
      { id: 'ca', label: 'Analytics', sub: 'tempo real', x: 490, y: 22, w: 140, h: 62 },
      { id: 'cb', label: 'Arquivo S3', sub: 'lote', x: 490, y: 162, w: 140, h: 62 },
    ],
    edges: [
      { from: 'p', to: 'st', label: 'grava sempre' },
      { from: 'st', to: 'ca', label: 'lê' },
      { from: 'st', to: 'cb', label: 'lê' },
    ],
    frames: [
      { caption: 'Os sensores gravam registros sem parar.', tokens: [{ id: 'r1', label: '1', at: 'st' }, { id: 'r2', label: '2', at: 'st' }, { id: 'r3', label: '3', at: 'p' }, { id: 'r4', label: '4', at: 'p' }], hot: ['p>st'] },
      { caption: 'O stream guarda tudo em ordem. O consumidor Analytics leu 1 e 2 — e eles continuam no stream.', tokens: [{ id: 'r1', label: '1', at: 'st' }, { id: 'r2', label: '2', at: 'st' }, { id: 'r3', label: '3', at: 'st' }, { id: 'r4', label: '4', at: 'st' }, { id: 'a1', label: '1', at: 'ca', tone: 'amber' }, { id: 'a2', label: '2', at: 'ca', tone: 'amber' }], hot: ['st>ca'] },
      { caption: 'O arquivador lê os mesmos registros, no próprio ritmo. Ler não apaga: os dados ficam até o fim da retenção.', tokens: [{ id: 'r1', label: '1', at: 'st' }, { id: 'r2', label: '2', at: 'st' }, { id: 'r3', label: '3', at: 'st' }, { id: 'r4', label: '4', at: 'st' }, { id: 'a1', label: '3', at: 'ca', tone: 'amber' }, { id: 'a2', label: '4', at: 'ca', tone: 'amber' }, { id: 'b1', label: '1', at: 'cb', tone: 'ok' }, { id: 'b2', label: '2', at: 'cb', tone: 'ok' }], hot: ['st>ca', 'st>cb'] },
    ],
  },
  {
    id: 'stepfunctions',
    label: 'Step Functions',
    summary: 'Workflow: uma execução percorre estados, com decisão, espera, nova tentativa, sucesso ou falha.',
    nodes: [
      { id: 'v', label: 'Validar', x: 8, y: 92, w: 110, h: 62 },
      { id: 'c', label: 'Dados ok?', sub: 'Choice', x: 158, y: 92, w: 110, h: 62 },
      { id: 'g', label: 'Gerar relatório', sub: 'retry 3x', x: 308, y: 22, w: 140, h: 62 },
      { id: 'f', label: 'Falha', x: 308, y: 166, w: 140, h: 62 },
      { id: 'n', label: 'Notificar', x: 500, y: 22, w: 130, h: 62 },
    ],
    edges: [
      { from: 'v', to: 'c' },
      { from: 'c', to: 'g', label: 'sim' },
      { from: 'c', to: 'f', label: 'não' },
      { from: 'g', to: 'n' },
    ],
    frames: [
      { caption: 'Uma execução começa no primeiro estado.', tokens: [{ id: 'e', label: 'E', at: 'v' }], nodeTones: { v: 'focus' } },
      { caption: 'O estado Choice decide o próximo passo pelo dado da execução.', tokens: [{ id: 'e', label: 'E', at: 'c' }], hot: ['v>c'], nodeTones: { c: 'focus' } },
      { caption: 'Gerar relatório falha uma vez e é repetido automaticamente, como manda a definição.', tokens: [{ id: 'e', label: 'E', at: 'g', tone: 'amber' }], hot: ['c>g'], nodeTones: { g: 'warn' }, subs: { g: 'tentativa 2 de 3' } },
      { caption: 'Sucesso: a execução termina e o histórico mostra cada estado percorrido. Coordena passos — não é fila nem tópico.', tokens: [{ id: 'e', label: 'E', at: 'n', tone: 'ok' }], hot: ['g>n'], nodeTones: { n: 'ok' } },
    ],
  },
]

export function MessagingFlowDiagram() {
  const [modeId, setModeId] = useState<ModeId>('sqs')
  const mode = modes.find((item) => item.id === modeId) ?? modes[0]!

  return (
    <DiagramShell
      label="Animação passo a passo de SQS, SNS, EventBridge, Kinesis e Step Functions"
      kicker="Integração"
      title="Cinco serviços, cinco formas de a mensagem andar"
      lead="Escolha o serviço e avance os passos. Observe se a mensagem é copiada, filtrada, retida ou consumida."
      limits="Sem FIFO, DLQ, filtros de assinatura do SNS, shards nem estados paralelos. Os passos mostram a semântica, não tempos reais."
    >
      <Choices label="Serviço" options={modes} value={mode.id} onChange={setModeId} />
      <p className="m-0 text-sm font-semibold">{mode.summary}</p>
      <FlowPlayer key={mode.id} title={mode.summary} width={640} height={240} nodes={mode.nodes} edges={mode.edges} frames={mode.frames} />
    </DiagramShell>
  )
}
