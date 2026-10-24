import { useState } from 'react'
import { Callout, Choices, DiagramShell } from '@/components/diagrams/kit'

type Target = 'fm' | 'rag' | 'agent' | 'workflow'

const targets: Record<Target, { label: string; question: string; metrics: { name: string; example: string }[] }> = {
  fm: {
    label: 'Modelo (FM)',
    question: 'O modelo, sozinho, sabe fazer a tarefa?',
    metrics: [
      { name: 'Qualidade na tarefa', example: 'resume, classifica ou segue instruções nos seus exemplos' },
      { name: 'Robustez', example: 'mantém a qualidade com entradas ruidosas ou ambíguas' },
      { name: 'Segurança', example: 'recusa pedidos indevidos e evita conteúdo tóxico' },
    ],
  },
  rag: {
    label: 'Aplicação RAG',
    question: 'A resposta vem das fontes certas, para a pessoa certa?',
    metrics: [
      { name: 'Qualidade da recuperação', example: 'os trechos necessários foram trazidos' },
      { name: 'Groundedness e citações', example: 'cada afirmação se apoia num trecho citado' },
      { name: 'Vazamento', example: 'nenhum documento fora do escopo do usuário entrou no contexto' },
    ],
  },
  agent: {
    label: 'Agente',
    question: 'Terminou a tarefa sem fazer o que não podia?',
    metrics: [
      { name: 'Taxa de sucesso da tarefa', example: 'concluiu o objetivo de ponta a ponta' },
      { name: 'Uso correto de ferramentas', example: 'ação certa, parâmetros válidos, poucos passos' },
      { name: 'Autorização', example: 'nenhuma ação proibida ou sem aprovação' },
    ],
  },
  workflow: {
    label: 'Workflow completo',
    question: 'Vale a pena para o negócio?',
    metrics: [
      { name: 'Tempo e custo fim a fim', example: 'latência percebida e custo por tarefa concluída' },
      { name: 'Resiliência', example: 'o que acontece quando uma etapa falha' },
      { name: 'Efeito no negócio', example: 'satisfação, conversão, retrabalho evitado' },
    ],
  },
}

const steps = [
  { title: 'Dataset de tarefas', text: 'Casos típicos, exceções, fonte ausente, ataques e pedidos fora do escopo — com a resposta ou o comportamento esperado.' },
  { title: 'Executar a aplicação', text: 'Mesma bateria para cada candidato, registrando versão de modelo, prompt, contexto e parâmetros.' },
  { title: 'Avaliação automática + humana', text: 'Métricas e LLM-as-a-judge escalam; revisores humanos calibram a rubrica e julgam os casos sensíveis.' },
  { title: 'Qualidade, segurança, custo, latência', text: 'Os quatro juntos: uma resposta correta, lenta e cara demais também reprova.' },
  { title: 'Promover ou corrigir', text: 'Só promove se passar dos limites combinados; senão volta para prompt, recuperação, modelo ou ferramenta.' },
  { title: 'Monitorar em produção', text: 'Feedback real e drift alimentam novos casos para a próxima rodada.' },
]

export function AppEvaluationDiagram() {
  const [target, setTarget] = useState<Target>('rag')
  const [step, setStep] = useState(2)
  const item = targets[target]
  return (
    <DiagramShell
      label="Avaliar o modelo versus avaliar a aplicação, e o ciclo de avaliação"
      kicker="Avaliação"
      title="Avaliar o FM e avaliar a aplicação são perguntas diferentes"
      lead="Escolha o que está sendo avaliado e veja o que medir. Abaixo, clique nas etapas do ciclo."
      limits="Exemplos de métricas, não lista fechada. Bedrock Evaluations ajuda a comparar modelos e aplicações com avaliação automática e humana; a escolha dos casos de teste continua sendo sua."
    >
      <Choices label="O que está sendo avaliado" options={(Object.keys(targets) as Target[]).map((id) => ({ id, label: targets[id].label }))} value={target} onChange={setTarget} />
      <Callout tone="focus" title={`Pergunta-chave: ${item.question}`} live>
        <ul className="m-0 mt-1 grid list-none gap-1.5 p-0 sm:grid-cols-3">
          {item.metrics.map((m) => (
            <li key={m.name} className="dg-box">
              <p className="m-0 font-semibold">{m.name}</p>
              <p className="m-0 mt-0.5 text-ink-soft">{m.example}</p>
            </li>
          ))}
        </ul>
      </Callout>
      <p className="mb-1 mt-4 text-sm font-semibold">O ciclo de avaliação</p>
      <ol className="m-0 grid list-none gap-1.5 p-0 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title}>
            <button type="button" className="dg-box flex h-full w-full items-start gap-2 text-left text-sm" data-tone={i === step ? 'focus' : 'plain'} aria-current={i === step ? 'step' : undefined} onClick={() => setStep(i)}>
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-paper">{i + 1}</span>
              <span className="font-semibold">{s.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="m-0 mt-2 rounded-md border border-line bg-paper px-3 py-2 text-sm" role="status"><strong>{step + 1}. {steps[step]!.title}:</strong> {steps[step]!.text}{step === steps.length - 1 ? ' ↻ volta ao passo 1.' : ''}</p>
    </DiagramShell>
  )
}
