import { useState } from 'react'
import { Callout, DiagramShell, ScenarioQuiz, Svg, type QuizOption, type QuizScenario } from '@/components/diagrams/kit'
import { svgButton } from './parts'

type Layer = 'ia' | 'regras' | 'ml' | 'dl' | 'fm' | 'gen' | 'agente'

const layers: Record<Layer, { name: string; what: string; example: string }> = {
  ia: { name: 'Inteligência artificial', what: 'A área ampla: sistemas que executam tarefas associadas a capacidades inteligentes.', example: 'Inclui regras escritas à mão, ML, modelos generativos e agentes.' },
  regras: { name: 'Sistemas de regras', what: 'Lógica explícita escrita por pessoas. É IA no sentido amplo, mas não aprende com dados.', example: 'Bloquear automaticamente boletos vencidos.' },
  ml: { name: 'Machine learning', what: 'Aprende padrões a partir de dados, em vez de receber todas as regras prontas.', example: 'Prever a chance de atraso de pagamento.' },
  dl: { name: 'Deep learning', what: 'Família de ML com redes neurais de muitas camadas, que extraem representações complexas.', example: 'Reconhecer objetos em fotos; transcrever fala.' },
  fm: { name: 'Foundation models (muitos são LLMs)', what: 'Modelos pré-treinados em grande escala e adaptáveis a muitas tarefas. LLM é o FM centrado em linguagem.', example: 'Um mesmo modelo que resume, traduz e classifica.' },
  gen: { name: 'GenAI', what: 'Capacidade de criar conteúdo novo (texto, imagem, áudio). Muitos geradores modernos são FMs, mas GenAI é o que o sistema faz, não uma camada a mais.', example: 'Ler um contrato e redigir um resumo.' },
  agente: { name: 'IA agêntica', what: 'Planeja e executa sequências de ações com ferramentas, estado e alguma autonomia. Pode combinar regras, ML e FMs.', example: 'Buscar o relatório, validar permissões, montar o documento e pedir aprovação.' },
}

type Tech = 'class' | 'reg' | 'gen' | 'ocr' | 'agent'

const options: readonly QuizOption<Tech>[] = [
  { id: 'class', label: 'Classificação', role: 'escolhe uma classe ou probabilidade (ex.: fraude / legítima).' },
  { id: 'reg', label: 'Regressão / previsão', role: 'estima um número (ex.: vendas do mês).' },
  { id: 'gen', label: 'Modelo generativo', role: 'produz texto ou outro conteúdo novo de forma flexível.' },
  { id: 'ocr', label: 'OCR / extração', role: 'reconhece e estrutura texto em documentos e imagens.' },
  { id: 'agent', label: 'Agente com ferramentas', role: 'encadeia passos e age em sistemas externos.' },
]

const scenarios: readonly QuizScenario<Tech>[] = [
  { id: 'n1', prompt: '“Esta transação é fraude?”', answer: 'class', why: 'A saída é uma classe (ou uma probabilidade de classe): classificação supervisionada.' },
  { id: 'n2', prompt: '“Quanto venderemos no próximo mês?”', answer: 'reg', why: 'A saída é um número futuro: regressão / previsão de série temporal.' },
  { id: 'n3', prompt: '“Resuma este contrato em português.”', answer: 'gen', why: 'Produção flexível de texto novo: modelo generativo de linguagem.' },
  { id: 'n4', prompt: '“Leia o número de uma nota fiscal escaneada.”', answer: 'ocr', why: 'Reconhecer e estruturar texto de um documento: OCR / extração documental.' },
  { id: 'n5', prompt: '“Consulte a política e abra um chamado.”', answer: 'agent', why: 'Há várias etapas e uma ação externa (abrir o chamado): agente com busca e ferramenta.' },
]

const ring = (on: boolean, base: string) => `dg-fade ${on ? 'fill-amber-soft stroke-amber' : base}`

export function AiNestingDiagram() {
  const [active, setActive] = useState<Layer>('ml')
  const info = layers[active]
  const hit = (layer: Layer) => svgButton(layers[layer].name, () => setActive(layer), active === layer)
  return (
    <DiagramShell
      label="Relação entre IA, regras, ML, deep learning, foundation models, GenAI e agentes"
      kicker="Mapa de conceitos"
      title="Uma área dentro da outra — e duas que atravessam as fronteiras"
      lead="Clique em cada região. Repare que GenAI e agentes descrevem o que o sistema faz, não mais uma camada."
      limits="Relações frequentes, não uma hierarquia matemática. Há GenAI que não é LLM (difusão de imagens) e LLM que não é agente."
    >
      <div className="diagram-canvas">
        <Svg width={640} height={330} minWidth={460} title="Elipses aninhadas: IA contém regras e ML; ML contém deep learning; deep learning contém foundation models">
          <g {...hit('ia')}><ellipse cx={300} cy={168} rx={290} ry={155} className={ring(active === 'ia', 'fill-paper stroke-ink-soft')} strokeWidth={1.5} /><text x={60} y={92} fontSize={13} fontWeight={700}>IA</text></g>
          <g {...hit('regras')}><rect x={36} y={190} width={120} height={60} rx={10} className={ring(active === 'regras', 'fill-paper stroke-line')} strokeDasharray="5 4" /><text x={96} y={216} textAnchor="middle" fontSize={12} fontWeight={600}>Regras</text><text x={96} y={232} textAnchor="middle" fontSize={10} className="dg-soft">se X então Y</text></g>
          <g {...hit('ml')}><ellipse cx={360} cy={175} rx={200} ry={120} className={ring(active === 'ml', 'fill-navy-wash stroke-navy')} /><text x={198} y={128} fontSize={13} fontWeight={700}>ML</text></g>
          <g {...hit('dl')}><ellipse cx={395} cy={185} rx={140} ry={85} className={ring(active === 'dl', 'fill-paper stroke-navy')} /><text x={285} y={160} fontSize={12} fontWeight={700}>Deep learning</text></g>
          <g {...hit('fm')}><ellipse cx={430} cy={200} rx={80} ry={45} className={ring(active === 'fm', 'fill-navy-wash stroke-navy')} strokeWidth={1.6} /><text x={430} y={198} textAnchor="middle" fontSize={12} fontWeight={700}>FMs / LLMs</text><text x={430} y={214} textAnchor="middle" fontSize={10} className="dg-soft">pré-treinados</text></g>
          <g {...hit('gen')}><rect x={548} y={176} width={84} height={46} rx={23} className={ring(active === 'gen', 'fill-ok-soft stroke-ok')} /><text x={590} y={204} textAnchor="middle" fontSize={12} fontWeight={700}>GenAI</text><line x1={510} y1={200} x2={548} y2={200} className="stroke-ok" strokeWidth={1.5} /></g>
          <g {...hit('agente')}><rect x={150} y={262} width={330} height={40} rx={20} className={ring(active === 'agente', 'fill-paper stroke-amber')} strokeDasharray="6 4" opacity={0.95} /><text x={315} y={287} textAnchor="middle" fontSize={12} fontWeight={700}>Agentes: combinam regras + ML + FMs + ferramentas</text></g>
        </Svg>
      </div>
      <Callout tone="focus" title={info.name} live>
        <p className="m-0">{info.what}</p>
        <p className="m-0 mt-1 text-ink-soft">Exemplo: {info.example}</p>
      </Callout>
      <p className="mt-4 mb-0 text-sm font-semibold">Treine a tabela 2.2: qual abordagem cada pedido sugere?</p>
      <ScenarioQuiz label="Abordagem provável" scenarios={scenarios} options={options} />
    </DiagramShell>
  )
}
