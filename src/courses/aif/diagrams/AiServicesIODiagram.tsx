import { useState } from 'react'
import { Callout, DiagramShell, Svg, SvgArrow, SvgNode, type Rect } from '@/components/diagrams/kit'
import { svgButton } from './parts'

type In = 'audio' | 'text' | 'image' | 'doc' | 'events'
type Out = 'transcript' | 'translation' | 'speech' | 'insight' | 'bot' | 'visual' | 'fields' | 'recs'

const inputs: readonly { id: In; label: string }[] = [
  { id: 'audio', label: 'Áudio / fala' },
  { id: 'text', label: 'Texto' },
  { id: 'image', label: 'Imagem / vídeo' },
  { id: 'doc', label: 'Documento escaneado' },
  { id: 'events', label: 'Cliques e compras' },
]

const outputs: readonly { id: Out; label: string }[] = [
  { id: 'transcript', label: 'Texto transcrito' },
  { id: 'translation', label: 'Texto em outro idioma' },
  { id: 'speech', label: 'Fala sintetizada' },
  { id: 'insight', label: 'Entidades e sentimento' },
  { id: 'bot', label: 'Conversa por intenções' },
  { id: 'visual', label: 'Objetos, rótulos, rostos' },
  { id: 'fields', label: 'Campos e tabelas' },
  { id: 'recs', label: 'Recomendações' },
]

const pairs: readonly { from: In; to: Out; service: string; not: string; why: string }[] = [
  { from: 'audio', to: 'transcript', service: 'Amazon Transcribe', not: 'Polly faz o caminho inverso (texto → fala).', why: 'Fala em áudio vira texto.' },
  { from: 'text', to: 'translation', service: 'Amazon Translate', not: 'Comprehend analisa o texto, não o traduz.', why: 'Texto de uma língua para outra.' },
  { from: 'text', to: 'speech', service: 'Amazon Polly', not: 'Transcribe faz o inverso (fala → texto).', why: 'Texto vira áudio com voz sintetizada.' },
  { from: 'text', to: 'insight', service: 'Amazon Comprehend', not: 'Translate muda o idioma, não extrai significado.', why: 'NLP: entidades, sentimento, frases-chave, categorias.' },
  { from: 'text', to: 'bot', service: 'Amazon Lex', not: 'Um FM genérico, sozinho, não traz intenções e slots configurados.', why: 'Bot conversacional com intenções e slots (também por voz).' },
  { from: 'audio', to: 'bot', service: 'Amazon Lex', not: 'Transcribe só transcreve; não conduz o diálogo.', why: 'Lex aceita voz ou texto e conduz o diálogo por intenções.' },
  { from: 'image', to: 'visual', service: 'Amazon Rekognition', not: 'Textract é para documentos (texto, formulários, tabelas).', why: 'Análise visual de imagens e vídeos.' },
  { from: 'doc', to: 'fields', service: 'Amazon Textract', not: 'Rekognition analisa cenas e objetos, não formulários.', why: 'Texto, tabelas e pares chave-valor de documentos.' },
  { from: 'events', to: 'recs', service: 'Amazon Personalize', not: 'Comprehend analisa texto, não histórico de interações.', why: 'Recomendações a partir de interações usuário-item.' },
]

const inRect = (i: number): Rect => ({ x: 8, y: 14 + i * 56, w: 150, h: 42 })
const outRect = (i: number): Rect => ({ x: 472, y: 6 + i * 36, w: 160, h: 30 })
const SERVICE: Rect = { x: 236, y: 120, w: 160, h: 56 }

export function AiServicesIODiagram() {
  const [input, setInput] = useState<In>('audio')
  const [output, setOutput] = useState<Out | null>('transcript')
  const valid = pairs.filter((pair) => pair.from === input)
  const pair = valid.find((item) => item.to === output)
  return (
    <DiagramShell
      label="Serviços de IA da AWS escolhidos pelo par entrada e saída"
      kicker="Escolha por entrada → saída"
      title="Diga o que entra e o que precisa sair: o serviço aparece"
      lead="Clique numa entrada à esquerda e numa saída possível à direita."
      limits="Cada serviço tem mais recursos do que o par mostrado (ex.: Comprehend também classifica documentos). A prova costuma descrever a necessidade principal."
    >
      <div className="diagram-canvas">
        <Svg width={640} height={300} minWidth={520} title="Entradas à esquerda, saídas à direita e o serviço AWS no meio">
          {pair && <SvgArrow from={inRect(inputs.findIndex((i) => i.id === input))} to={SERVICE} state="hot" />}
          {pair && <SvgArrow from={SERVICE} to={outRect(outputs.findIndex((o) => o.id === output))} state="hot" />}
          {inputs.map((item, i) => (
            <g key={item.id} {...svgButton(`Entrada: ${item.label}`, () => { setInput(item.id); setOutput(pairs.find((p) => p.from === item.id)?.to ?? null) }, input === item.id)}>
              <SvgNode {...inRect(i)} label={item.label} tone={input === item.id ? 'focus' : 'plain'} fontSize={12} />
            </g>
          ))}
          {outputs.map((item, i) => {
            const ok = valid.some((v) => v.to === item.id)
            return (
              <g key={item.id} {...svgButton(`Saída: ${item.label}`, () => ok && setOutput(item.id), output === item.id)} style={{ cursor: ok ? 'pointer' : 'not-allowed' }}>
                <SvgNode {...outRect(i)} label={item.label} tone={output === item.id && ok ? 'ok' : ok ? 'plain' : 'dim'} fontSize={11} />
              </g>
            )
          })}
          <SvgNode {...SERVICE} label={pair?.service ?? "escolha a saída"} tone={pair ? 'warn' : 'dim'} fontSize={13} />
        </Svg>
      </div>
      <Callout tone={pair ? 'ok' : 'plain'} title={pair ? pair.service : 'Combinação sem serviço dedicado'} live>
        {pair ? <><p className="m-0">{pair.why}</p><p className="m-0 mt-1 text-ink-soft">Não confundir: {pair.not}</p></> : 'Escolha uma saída destacada.'}
      </Callout>
      <p className="mt-2 mb-0 text-sm text-ink-soft">Fora do par entrada → saída: <strong>SageMaker AI</strong> quando é preciso treinar e operar um modelo próprio; <strong>Bedrock</strong> quando é para consumir um FM por API; <strong>Nova</strong> é uma família de modelos, não a plataforma.</p>
    </DiagramShell>
  )
}

/* 7.2 — dados antes do ML */

type Stage = 's3' | 'glue' | 'emr' | 'lf' | 'sm' | 'rs' | 'os' | 'dx'

const stages: Record<Stage, { label: string; sub: string; rect: Rect; text: string }> = {
  dx: { label: 'Data Exchange', sub: 'dados de terceiros', rect: { x: 8, y: 20, w: 130, h: 46 }, text: 'Assinar ou adquirir conjuntos de dados de terceiros, conforme licenças e termos.' },
  s3: { label: 'Amazon S3', sub: 'dados brutos', rect: { x: 8, y: 110, w: 130, h: 46 }, text: 'Armazena objetos: datasets, documentos, logs e artefatos de modelos. Costuma ser o “lago” de origem.' },
  glue: { label: 'Glue / DataBrew', sub: 'catálogo e ETL', rect: { x: 176, y: 60, w: 140, h: 46 }, text: 'Glue cataloga e transforma dados em pipelines; DataBrew limpa e prepara visualmente, sem código.' },
  emr: { label: 'Amazon EMR', sub: 'Spark/Hadoop', rect: { x: 176, y: 160, w: 140, h: 46 }, text: 'Infraestrutura gerenciada para frameworks de big data distribuído.' },
  lf: { label: 'Lake Formation', sub: 'governa o acesso', rect: { x: 176, y: 250, w: 140, h: 40 }, text: 'Define quem pode ler quais tabelas e colunas do data lake. Governança, não transformação.' },
  sm: { label: 'SageMaker AI', sub: 'treina e implanta ML', rect: { x: 360, y: 40, w: 140, h: 46 }, text: 'Construir, treinar, implantar e monitorar modelos próprios a partir dos dados preparados.' },
  rs: { label: 'Redshift / Quick', sub: 'análise e BI', rect: { x: 360, y: 130, w: 140, h: 46 }, text: 'Redshift é o data warehouse para análises em escala; Quick traz exploração e IA para usuários de negócio.' },
  os: { label: 'OpenSearch', sub: 'busca e vetores', rect: { x: 360, y: 220, w: 140, h: 46 }, text: 'Pesquisa e analytics, inclusive busca vetorial — reaparece no RAG (capítulo 14).' },
}

const flow: readonly [Stage, Stage][] = [['dx', 'glue'], ['s3', 'glue'], ['s3', 'emr'], ['glue', 'sm'], ['glue', 'rs'], ['emr', 'sm'], ['emr', 'os']]

export function DataPipelineDiagram() {
  const [active, setActive] = useState<Stage>('glue')
  const out: Rect = { x: 530, y: 120, w: 102, h: 66 }
  return (
    <DiagramShell
      label="Pipeline de dados da AWS antes e ao lado do ML"
      kicker="Analytics + ML"
      title="Dado confiável e localizável vem antes da previsão"
      lead="Clique em cada serviço para ver o papel dele no caminho dos dados."
      limits="Visão de portfólio: arquiteturas reais variam, e nem todo projeto usa todos esses serviços."
    >
      <div className="diagram-canvas">
        <Svg width={640} height={300} minWidth={520} title="Fontes de dados, preparação, governança, ML e análise">
          {flow.map(([a, b]) => <SvgArrow key={`${a}${b}`} from={stages[a].rect} to={stages[b].rect} state={active === a || active === b ? 'hot' : 'idle'} />)}
          <SvgArrow from={stages.sm.rect} to={out} />
          <SvgArrow from={stages.rs.rect} to={out} />
          <line x1={246} y1={250} x2={246} y2={206} className="stroke-amber" strokeDasharray="4 3" />
          {(Object.keys(stages) as Stage[]).map((id) => (
            <g key={id} {...svgButton(stages[id].label, () => setActive(id), active === id)}>
              <SvgNode {...stages[id].rect} label={stages[id].label} sub={stages[id].sub} tone={active === id ? 'focus' : id === 'lf' ? 'warn' : 'plain'} fontSize={12} />
            </g>
          ))}
          <SvgNode {...out} label="Decisões" sub="previsões e painéis" tone="ok" fontSize={12} />
        </Svg>
      </div>
      <Callout tone="focus" title={`${stages[active].label} · ${stages[active].sub}`} live>{stages[active].text}</Callout>
    </DiagramShell>
  )
}
