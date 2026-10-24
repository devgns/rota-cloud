import { useState } from 'react'
import { FlipCard } from '@/components/flashcards/FlipCard'
import { Callout, DiagramShell, ScenarioQuiz, type QuizOption, type QuizScenario } from '@/components/diagrams/kit'

const pairs: readonly [string, string, string][] = [
  ['IA × ML', 'IA é área ampla; ML aprende com dados.', 'Sistema de regra não é obrigatoriamente ML.'],
  ['ML × deep learning', 'DL é família de ML com redes profundas.', 'Nem toda tarefa de ML usa rede neural.'],
  ['Classificação × regressão', 'Classe/probabilidade versus valor numérico.', '“Valor futuro” costuma ser regressão.'],
  ['Supervisionado × não supervisionado', 'Exemplos com alvo versus descobrir estrutura.', 'Sem rótulos, clustering pode ajudar.'],
  ['Precision × recall', 'Alertas corretos versus positivos encontrados.', 'FP caro → precision; FN caro → recall.'],
  ['Treino × inferência', 'Ajustar pesos versus aplicar o modelo.', 'Chamar API pronta normalmente é inferência.'],
  ['LLM × FM', 'LLM é linguagem; FM é a categoria ampla.', 'Geração de imagem pode usar outro FM.'],
  ['Token × embedding', 'Unidade da sequência versus vetor semântico.', 'Embedding não é tokenizer.'],
  ['RAG × fine-tuning', 'Buscar evidência versus alterar pesos.', 'Documento atualizado diariamente → RAG.'],
  ['RAG × cache', 'Recuperar fatos versus reutilizar computação/resultado.', 'Cache não garante fonte correta.'],
  ['Prompt × contexto', 'Instrução e estrutura versus o conjunto de informações selecionadas.', 'Contexto inclui resultados de ferramentas.'],
  ['Bedrock × SageMaker AI', 'FMs gerenciados por API versus plataforma de ML ampla.', 'Treino de ML próprio → SageMaker AI.'],
  ['Bedrock × Nova', 'Plataforma versus família de modelos.', 'Nova não é sinônimo de Bedrock.'],
  ['Amazon Q × Amazon Quick', 'Assistente generativo de trabalho ou código versus análise e BI com IA.', '“Painel de métricas” → Quick; “assistente para funcionários ou desenvolvedores” → Q.'],
  ['AgentCore × Strands Agents', 'Infraestrutura modular versus framework/SDK.', 'Framework não gerencia políticas sozinho.'],
  ['Agente × chatbot', 'Agente planeja, chama ferramentas e age.', 'Texto bem escrito não é operação externa.'],
  ['MCP × IAM', 'Protocolo de integração versus permissões AWS.', 'MCP não concede autorização.'],
  ['Guardrails × IAM', 'Filtro de conteúdo versus acesso a recursos.', 'Bloquear PII não autoriza arquivos.'],
  ['CloudTrail × Config', 'Eventos de API versus configuração e sua evolução.', '“Quem alterou?” → CloudTrail.'],
  ['Artifact × CloudTrail', 'Relatórios de conformidade da AWS versus auditoria de eventos.', 'Artifact não é logging da sua aplicação.'],
  ['Macie × Inspector', 'Dados sensíveis no S3 versus vulnerabilidades.', 'Dado sensível ≠ scanner de CVE.'],
  ['KMS × Secrets Manager', 'Chaves criptográficas versus segredos.', 'Um não é a interface principal do outro.'],
  ['ROUGE × BLEU × BERTScore', 'Sobreposição em resumo, em tradução e similaridade contextual.', 'Nenhuma garante groundedness.'],
  ['Filtro de output × validação de verdade', 'Moderar conteúdo versus checar fatos e regras.', 'Resposta segura pode estar errada.'],
]

export function ComparePairsDiagram() {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [known, setKnown] = useState<Record<number, boolean>>({})
  const [a, b, c] = pairs[index]!
  const go = (i: number) => { setIndex((i + pairs.length) % pairs.length); setOpen(false) }
  const mark = (value: boolean) => { setKnown((k) => ({ ...k, [index]: value })); go(index + 1) }
  const knownCount = Object.values(known).filter(Boolean).length
  return (
    <DiagramShell
      label="Baralho dos pares de conceitos que a prova confunde"
      kicker="Aprenda pela diferença"
      title={`${pairs.length} pares que a prova adora aproximar`}
      lead="Diga a diferença decisiva em voz alta antes de virar a carta. Marque se acertou."
    >
      <FlipCard
        flipped={open}
        onFlip={() => setOpen(!open)}
        meta={`Par ${index + 1} de ${pairs.length}`}
        frontLabel="Qual a diferença?"
        backLabel="Diferença decisiva"
        front={a}
        back={<span><span className="block">{b}</span><span className="mt-2 block text-ink-soft"><strong>Pista:</strong> {c}</span></span>}
      />
      <div className="choice-row justify-between">
        <span className="flex gap-2">
          <button type="button" className="choice" onClick={() => go(index - 1)}>Anterior</button>
          <button type="button" className="choice" onClick={() => go(Math.floor(Math.random() * pairs.length))}>Sortear</button>
        </span>
        {open && (
          <span className="flex gap-2">
            <button type="button" className="choice" onClick={() => mark(false)}>Errei</button>
            <button type="button" className="choice" onClick={() => mark(true)}>Acertei</button>
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1" aria-hidden="true">
        {pairs.map((p, i) => <span key={p[0]} className={`inline-block h-2 w-2 rounded-full ${known[i] === undefined ? 'bg-line' : known[i] ? 'bg-ok' : 'bg-bad'} ${i === index ? 'ring-2 ring-navy ring-offset-1 ring-offset-paper' : ''}`} />)}
      </div>
      <p className="m-0 mt-1 text-xs text-ink-soft">{knownCount} de {pairs.length} acertados nesta sessão.</p>
    </DiagramShell>
  )
}

type Clue = 'rag' | 'prompt' | 'sagemaker' | 'bedrock' | 'agents' | 'injection' | 'artifact' | 'cost'

const options: readonly QuizOption<Clue>[] = [
  { id: 'rag', label: 'RAG + fonte versionada', role: 'dados atuais com citação.' },
  { id: 'prompt', label: 'Prompt / few-shot', role: 'estilo e formato com exemplos.' },
  { id: 'sagemaker', label: 'SageMaker AI', role: 'treinar modelo próprio.' },
  { id: 'bedrock', label: 'Bedrock', role: 'FM sem gerenciar servidor.' },
  { id: 'agents', label: 'AgentCore / Strands', role: 'ferramentas, memória e identidade de agente.' },
  { id: 'injection', label: 'Injeção indireta', role: 'ordem maliciosa vinda de documento.' },
  { id: 'artifact', label: 'Artifact', role: 'relatório de conformidade da AWS.' },
  { id: 'cost', label: 'Revisar tokens e taxa de acerto', role: 'custo alto do modelo.' },
]

const scenarios: readonly QuizScenario<Clue>[] = [
  { id: 'p1', prompt: '“…precisa responder com dados atuais e citar a fonte.”', answer: 'rag', why: 'Dados atuais com citação → RAG sobre fonte versionada.' },
  { id: 'p2', prompt: '“…as respostas devem seguir um estilo consistente, como nestes exemplos.”', answer: 'prompt', why: 'Estilo com exemplos → prompt/few-shot primeiro; fine-tuning só com justificativa.' },
  { id: 'p3', prompt: '“…treinar um modelo específico com dados tabulares da empresa.”', answer: 'sagemaker', why: 'ML próprio em dados tabulares → SageMaker AI.' },
  { id: 'p4', prompt: '“…escolher um FM sem gerenciar servidores de inferência.”', answer: 'bedrock', why: 'FM gerenciado por API → Amazon Bedrock.' },
  { id: 'p5', prompt: '“…o agente precisa de ferramentas, memória e identidade própria.”', answer: 'agents', why: 'AgentCore (infraestrutura) e Strands (framework), em papéis distintos.' },
  { id: 'p6', prompt: '“…um documento recuperado continha instruções para ignorar as regras.”', answer: 'injection', why: 'Instrução maliciosa no conteúdo recuperado → prompt injection indireta.' },
  { id: 'p7', prompt: '“…o auditor pede o relatório de conformidade da AWS.”', answer: 'artifact', why: 'Relatório de conformidade da AWS → AWS Artifact; trilha de API seria CloudTrail.' },
  { id: 'p8', prompt: '“…o custo do modelo está alto demais.”', answer: 'cost', why: 'Inspecione tokens, retrieval, cache, modelo menor, throughput e custo por tarefa correta.' },
]

export function ExamCluesQuiz() {
  return (
    <DiagramShell label="Quiz das pistas do enunciado" kicker="Pistas do enunciado" title="Se o enunciado disser isto, pense naquilo" lead="Treine o reflexo da seção 26.2.">
      <ScenarioQuiz label="Resposta provável" scenarios={scenarios} options={options} />
      <Callout tone="warn">Cuidado com os três erros da 26.3: transformar capacidade em garantia, confundir produto com modelo e framework, e achar que mais tecnologia sempre melhora o resultado.</Callout>
    </DiagramShell>
  )
}
