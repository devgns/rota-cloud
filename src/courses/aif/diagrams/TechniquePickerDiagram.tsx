import { useState } from 'react'
import { Box, Callout, DiagramShell, ScenarioQuiz, type QuizOption, type QuizScenario } from '@/components/diagrams/kit'

type Tech = 'rule' | 'reg' | 'class' | 'cluster' | 'rec' | 'forecast' | 'doc' | 'gen' | 'rag' | 'agent'

const options: readonly QuizOption<Tech>[] = [
  { id: 'rule', label: 'Regra / consulta', role: 'resolve quando existe uma regra exata, validada e barata.' },
  { id: 'reg', label: 'Regressão', role: 'estima um número a partir de variáveis.' },
  { id: 'class', label: 'Classificação', role: 'atribui classe ou probabilidade de classe.' },
  { id: 'cluster', label: 'Clustering', role: 'forma grupos sem rótulo prévio.' },
  { id: 'rec', label: 'Recomendação', role: 'ordena itens para cada usuário.' },
  { id: 'forecast', label: 'Forecast', role: 'projeta valores futuros de uma série temporal.' },
  { id: 'doc', label: 'Document AI / OCR', role: 'extrai campos estruturados de documentos.' },
  { id: 'gen', label: 'GenAI', role: 'cria conteúdo novo, sem promessa de determinismo.' },
  { id: 'rag', label: 'Busca / RAG', role: 'recupera trechos de fontes e sintetiza com citação.' },
  { id: 'agent', label: 'Agente', role: 'executa uma sequência de ações auditáveis com ferramentas.' },
]

const scenarios: readonly QuizScenario<Tech>[] = [
  { id: 't0', prompt: 'Valor do frete fixo para um CEP que está numa tabela oficial.', answer: 'rule', why: 'Há uma regra exata e barata: um SELECT ou função vence um LLM em custo, latência e previsibilidade.' },
  { id: 't1', prompt: 'Estimar o valor de venda de um imóvel.', answer: 'reg', why: 'A saída é um número: regressão — não é classificação.' },
  { id: 't2', prompt: 'Risco de inadimplência de um cliente (sim/não, com probabilidade).', answer: 'class', why: 'Classe ou probabilidade de classe: classificação. Ter um score numérico não transforma a tarefa em regressão.' },
  { id: 't3', prompt: 'Descobrir perfis de comportamento de clientes sem categorias prévias.', answer: 'cluster', why: 'Sem gabarito por cliente: clustering não supervisionado.' },
  { id: 't4', prompt: 'Mostrar a cada usuário os produtos com maior chance de interesse.', answer: 'rec', why: 'Itens ordenados por usuário: recomendação/ranking. Não precisa gerar texto.' },
  { id: 't5', prompt: 'Prever o preço diário de um insumo para as próximas 4 semanas.', answer: 'forecast', why: 'Valores futuros de uma série: forecast, sem vazar o futuro para o treino.' },
  { id: 't6', prompt: 'Extrair partes, datas e multas de 5 mil contratos escaneados.', answer: 'doc', why: 'Campos estruturados a partir de documentos: OCR + NLP. Não exige um chatbot.' },
  { id: 't7', prompt: 'Criar três versões de um texto de campanha para testes A/B.', answer: 'gen', why: 'Conteúdo novo e criativo: GenAI, com revisão humana.' },
  { id: 't8', prompt: 'Responder dúvidas citando a norma interna vigente.', answer: 'rag', why: 'Buscar o trecho e sintetizar com citação: RAG. Não é fine-tuning.' },
  { id: 't9', prompt: 'Remarcar uma entrega após o cliente confirmar o novo horário.', answer: 'agent', why: 'Há uma ação no sistema, com confirmação: agente com ferramenta autorizada.' },
]

const gates = [
  { q: 'Existe uma regra exata e validada?', yes: 'Use a regra. IA só adicionaria custo e incerteza.' },
  { q: 'Há dados representativos do cenário real?', no: 'Sem dados, nenhum modelo aprende o padrão certo. Comece pela coleta.' },
  { q: 'Uma resposta aproximada é aceitável?', no: 'Se cada saída precisa ser exata, prefira fonte de verdade + validação, não geração livre.' },
  { q: 'Qual é o custo de um FP e de um FN?', note: 'Essa resposta define a métrica de sucesso (capítulo 6).' },
] as const

export function TechniquePickerDiagram() {
  const [gate, setGate] = useState<number | null>(null)
  return (
    <DiagramShell
      label="Perguntas eliminatórias e escolha de técnica de IA para cada necessidade"
      kicker="Escolha de técnica"
      title="Primeiro: precisa mesmo de IA? Depois: qual técnica?"
      lead="Abra as perguntas eliminatórias e, em seguida, classifique os dez pedidos da matriz 4.2."
      limits="Uma solução real pode combinar técnicas (ex.: OCR para extrair, regra para validar, GenAI para redigir). O quiz pede a técnica mais natural para o núcleo do pedido."
    >
      <ol className="m-0 mt-3 grid list-none gap-1.5 p-0 sm:grid-cols-2">
        {gates.map((item, i) => (
          <li key={item.q}>
            <button type="button" className="dg-box w-full text-left text-sm" data-tone={gate === i ? 'focus' : 'plain'} aria-expanded={gate === i} onClick={() => setGate(gate === i ? null : i)}>
              <span className="font-semibold">{String.fromCharCode(97 + i)}) {item.q}</span>
              {gate === i && <span className="mt-1 block">{'yes' in item ? `Sim → ${item.yes}` : 'no' in item ? `Não → ${item.no}` : item.note}</span>}
            </button>
          </li>
        ))}
      </ol>
      <Callout tone="warn">Passou pelas quatro? Agora escolha a técnica pela <strong>forma da saída</strong>: número, classe, grupo, lista ordenada, campos, texto novo, trecho citado ou ação.</Callout>
      <Box className="mt-3 text-sm">
        <strong>ML tradicional × FM:</strong> tabela com 30 variáveis e exigência de explicação regulatória → comece por ML tradicional. Dez documentos em idiomas variados para resumir → FM é candidato natural.
      </Box>
      <ScenarioQuiz label="Técnica mais natural" scenarios={scenarios} options={options} />
    </DiagramShell>
  )
}
