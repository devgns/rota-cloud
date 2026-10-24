import { DiagramShell, ScenarioQuiz, type QuizOption, type QuizScenario } from '@/components/diagrams/kit'
import { FlowPlayer, type FlowEdge, type FlowFrame, type FlowNode } from '@/components/diagrams/FlowPlayer'

const W = 124
const H = 62
const nodes: readonly FlowNode[] = [
  { id: 'kpi', x: 8, y: 20, w: W, h: H, label: 'Problema e KPI' },
  { id: 'data', x: 168, y: 20, w: W, h: H, label: 'Coleta e curadoria' },
  { id: 'prep', x: 328, y: 20, w: W, h: H, label: 'Preparação', sub: 'features' },
  { id: 'train', x: 488, y: 20, w: W, h: H, label: 'Treino ou FM' },
  { id: 'eval', x: 488, y: 178, w: W, h: H, label: 'Avaliação' },
  { id: 'deploy', x: 328, y: 178, w: W, h: H, label: 'Deploy e inferência' },
  { id: 'mon', x: 168, y: 178, w: W, h: H, label: 'Monitoramento' },
]

const edges: readonly FlowEdge[] = [
  { from: 'kpi', to: 'data' },
  { from: 'data', to: 'prep' },
  { from: 'prep', to: 'train' },
  { from: 'train', to: 'eval' },
  { from: 'eval', to: 'deploy' },
  { from: 'deploy', to: 'mon' },
  { from: 'mon', to: 'data', label: 'retreino', dashed: true },
]

const frames: readonly FlowFrame[] = [
  { caption: 'Comece pelo problema mensurável: “reduzir fraude sem bloquear clientes honestos”, com KPI e custo de FP/FN.', tokens: [{ id: 'k', label: 'K', at: 'kpi', tone: 'amber' }], nodeTones: { kpi: 'focus' } },
  { caption: 'Coletar e curar dados representativos, com rótulo e linhagem conhecidos.', tokens: [{ id: 'd', label: 'D', at: 'data' }], hot: ['kpi>data'], nodeTones: { data: 'focus' } },
  { caption: 'Explorar e preparar: limpar, tratar ausentes, criar features e separar treino/validação/teste sem vazamento.', tokens: [{ id: 'd', label: 'D', at: 'prep' }], hot: ['data>prep'], nodeTones: { prep: 'focus' } },
  { caption: 'Treinar um modelo (ML tradicional) ou selecionar um FM pronto e adaptá-lo com prompt/RAG.', tokens: [{ id: 'm', label: 'M1', at: 'train', tone: 'navy' }], hot: ['prep>train'], nodeTones: { train: 'focus' } },
  { caption: 'Avaliar no conjunto de teste e contra um baseline. Só passa se atingir a meta de negócio.', tokens: [{ id: 'm', label: 'M1', at: 'eval', tone: 'navy' }], hot: ['train>eval'], nodeTones: { eval: 'ok' } },
  { caption: 'Publicar com versão, rollback e o modo de inferência adequado (batch, real-time, assíncrono).', tokens: [{ id: 'm', label: 'M1', at: 'deploy', tone: 'ok' }], hot: ['eval>deploy'], nodeTones: { deploy: 'focus' } },
  { caption: 'Monitorar qualidade, latência, custo e distribuição dos dados de entrada.', tokens: [{ id: 'm', label: 'M1', at: 'deploy', tone: 'ok' }, { id: 'r', label: '✓', at: 'mon', tone: 'ok' }], hot: ['deploy>mon'], nodeTones: { mon: 'ok' } },
  { caption: 'Três meses depois o padrão de fraude muda: data/concept drift. O monitoramento detecta a queda de recall.', tokens: [{ id: 'm', label: 'M1', at: 'deploy', tone: 'bad' }, { id: 'r', label: '!', at: 'mon', tone: 'bad' }], nodeTones: { mon: 'bad', deploy: 'bad' }, subs: { mon: 'recall caiu 80% → 55%' } },
  { caption: 'O alerta volta para a coleta: dados novos e rotulados, retreino e nova avaliação antes de trocar a versão. Isso é MLOps.', tokens: [{ id: 'm', label: 'M1', at: 'deploy', tone: 'bad' }, { id: 'd', label: 'D2', at: 'data', tone: 'amber' }], hot: ['mon>data'], nodeTones: { data: 'focus' } },
  { caption: 'M2 aprovado substitui M1, com a versão anterior guardada para rollback.', tokens: [{ id: 'm2', label: 'M2', at: 'deploy', tone: 'ok' }, { id: 'r', label: '✓', at: 'mon', tone: 'ok' }], hot: ['eval>deploy'], nodeTones: { deploy: 'ok', mon: 'ok' } },
]

export function MlLifecycleDiagram() {
  return (
    <DiagramShell
      label="Ciclo de vida de ML com detecção de drift e retreino"
      kicker="Ciclo de vida · MLOps"
      title="O modelo que funcionava e parou: acompanhe o ciclo"
      lead="Reproduza o fluxo ou avance passo a passo. Repare no quadro 8: o algoritmo não mudou, o mundo mudou."
      limits="Em GenAI com FM pronto, “treino” costuma virar seleção de modelo, prompts e RAG, mas avaliação, deploy e monitoramento continuam obrigatórios."
    >
      <FlowPlayer title="Ciclo de vida de ML em sete etapas com retorno do monitoramento para a coleta" width={630} height={258} minWidth={520} nodes={nodes} edges={edges} frames={frames} />
    </DiagramShell>
  )
}

/* 5.2 — modos de inferência */

type Mode = 'batch' | 'rt' | 'async' | 'serverless'

const options: readonly QuizOption<Mode>[] = [
  { id: 'batch', label: 'Batch', role: 'processa lotes periódicos; ninguém espera a resposta.' },
  { id: 'rt', label: 'Real-time', role: 'responde uma requisição por vez com baixa latência.' },
  { id: 'async', label: 'Assíncrona', role: 'aceita trabalhos longos e entrega o resultado depois, com fila e status.' },
  { id: 'serverless', label: 'Serverless', role: 'delega a capacidade ao serviço; bom para uso esporádico, com limites.' },
]

const scenarios: readonly QuizScenario<Mode>[] = [
  { id: 'i1', prompt: 'Calcular o risco de inadimplência de 3 milhões de contratos toda madrugada.', answer: 'batch', why: 'Volume grande, sem usuário esperando: batch.' },
  { id: 'i2', prompt: 'Avaliar o risco de fraude no checkout, antes de aprovar o pagamento.', answer: 'rt', why: 'O cliente está esperando: latência e disponibilidade são críticas.' },
  { id: 'i3', prompt: 'Transcrever e resumir vídeos de 2 horas enviados por usuários.', answer: 'async', why: 'Trabalho longo: aceitar o pedido, processar e avisar quando ficar pronto.' },
  { id: 'i4', prompt: 'Um endpoint interno chamado poucas vezes por dia, em horários imprevisíveis.', answer: 'serverless', why: 'Uso esporádico: pagar pelo uso sem manter capacidade ociosa — sem supor latência mínima ou custo zero.' },
]

export function InferenceModesQuiz() {
  return (
    <DiagramShell label="Quiz de modos de inferência" kicker="Inferência" title="Qual modo de atendimento cada cenário pede?" lead="A pergunta-chave é: alguém está esperando a resposta, e por quanto tempo?">
      <ScenarioQuiz label="Modo de inferência" scenarios={scenarios} options={options} />
    </DiagramShell>
  )
}
