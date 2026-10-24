import { useState } from 'react'
import { Callout, DiagramShell, ScenarioQuiz, Svg, type QuizOption, type QuizScenario } from '@/components/diagrams/kit'
import { svgButton } from './parts'

/* 23.2 — qual serviço responde? */

type Service = 'trail' | 'watch' | 'config' | 'artifact' | 'inspector' | 'advisor' | 'wat'

const options: readonly QuizOption<Service>[] = [
  { id: 'trail', label: 'CloudTrail', role: 'quem chamou qual API AWS, quando e de onde.' },
  { id: 'watch', label: 'CloudWatch', role: 'logs, métricas e alarmes operacionais.' },
  { id: 'config', label: 'Config', role: 'estado e histórico de configuração dos recursos.' },
  { id: 'artifact', label: 'Artifact', role: 'relatórios de conformidade e acordos da própria AWS.' },
  { id: 'inspector', label: 'Inspector', role: 'vulnerabilidades e exposições em recursos suportados.' },
  { id: 'advisor', label: 'Trusted Advisor', role: 'recomendações de boas práticas a partir de verificações.' },
  { id: 'wat', label: 'Well-Architected Tool', role: 'revisão de um workload pelos pilares de arquitetura.' },
]

const scenarios: readonly QuizScenario<Service>[] = [
  { id: 'g1', prompt: 'A auditoria quer saber quem removeu a permissão do bucket de prompts ontem às 22h.', answer: 'trail', why: '“Quem chamou a API e quando” é evento: CloudTrail.' },
  { id: 'g2', prompt: 'Alarme quando a latência do endpoint de inferência passar de 3 segundos.', answer: 'watch', why: 'Métrica operacional com alarme: CloudWatch.' },
  { id: 'g3', prompt: 'Detectar quando um bucket com documentos do RAG deixar de ter criptografia habilitada.', answer: 'config', why: 'Desvio de configuração em relação a uma regra: AWS Config.' },
  { id: 'g4', prompt: 'O cliente pede o relatório SOC 2 da AWS para o processo de compra.', answer: 'artifact', why: 'Relatórios de conformidade da AWS ficam no AWS Artifact — ele não audita o seu modelo.' },
  { id: 'g5', prompt: 'Encontrar CVEs na imagem de contêiner que serve o modelo.', answer: 'inspector', why: 'Vulnerabilidades de software: Amazon Inspector. Não é filtro de resposta tóxica.' },
  { id: 'g6', prompt: 'Revisar o workload de IA pelos pilares de segurança, confiabilidade e custo.', answer: 'wat', why: 'Revisão estruturada por pilares: AWS Well-Architected Tool.' },
  { id: 'g7', prompt: 'Receber recomendações automáticas sobre limites de serviço e boas práticas da conta.', answer: 'advisor', why: 'Verificações e recomendações de boas práticas: AWS Trusted Advisor.' },
]

export function GovernanceServicesQuiz() {
  return (
    <DiagramShell label="Quiz de serviços de auditoria e conformidade" kicker="Serviços que a prova aproxima" title="Qual serviço responde a esta pergunta?" lead="Segurança previne, auditoria explica o que ocorreu, governança define quem decide, conformidade demonstra aderência. Cada serviço responde a uma pergunta diferente.">
      <ScenarioQuiz label="Serviço AWS" scenarios={scenarios} options={options} />
    </DiagramShell>
  )
}

/* 23.4 — ciclo de vida dos dados em uma aplicação de IA */

const stages = [
  { id: 'collect', label: 'Coleta', ai: 'Prompts, arquivos enviados, documentos do RAG: colete só o necessário e com base legal.' },
  { id: 'classify', label: 'Classificação', ai: 'Marque o que é PII, confidencial ou público — inclusive nos chunks e embeddings.' },
  { id: 'store', label: 'Armazenamento e Região', ai: 'Onde ficam índices vetoriais, logs e saídas do agente? Região não resolve sozinha a residência.' },
  { id: 'access', label: 'Acesso', ai: 'ACL por documento e por usuário, também na recuperação; menor privilégio para agentes.' },
  { id: 'use', label: 'Uso e compartilhamento', ai: 'Para que finalidade o dado alimenta o modelo? Há envio a terceiros ou fine-tuning?' },
  { id: 'retain', label: 'Retenção', ai: 'Por quanto tempo guardar prompts, respostas e revisões humanas? Logs sem segredos.' },
  { id: 'delete', label: 'Exclusão', ai: 'Apagar o documento exige reindexar: o embedding antigo continua respondendo se ficar no índice.' },
] as const

export function DataLifecycleRingDiagram() {
  const [active, setActive] = useState<(typeof stages)[number]['id']>('delete')
  const item = stages.find((s) => s.id === active)!
  const cx = 320
  const cy = 150
  const rx = 228
  const ry = 112
  return (
    <DiagramShell
      label="Ciclo de vida dos dados em uma aplicação de IA"
      kicker="Ciclo de vida dos dados"
      title="Cada etapa tem uma pergunta nova quando há IA no meio"
      lead="Clique numa etapa do anel."
      limits="Não substitui análise jurídica. A Generative AI Security Scoping Matrix ajuda a delimitar o que fica com o cliente e o que fica com o provedor."
    >
      <div className="diagram-canvas">
        <Svg width={640} height={300} minWidth={440} title="Anel com sete etapas do ciclo de vida dos dados">
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" className="stroke-line" strokeWidth={10} />
          {stages.map((s, i) => {
            const a = (i / stages.length) * Math.PI * 2 - Math.PI / 2
            const x = cx + rx * Math.cos(a)
            const y = cy + ry * Math.sin(a)
            const on = s.id === active
            const w = s.label.length > 14 ? 172 : 128
            return (
              <g key={s.id} {...svgButton(s.label, () => setActive(s.id), on)}>
                <rect x={x - w / 2} y={y - 16} width={w} height={32} rx={16} className={`dg-fade ${on ? 'fill-amber-soft stroke-amber' : 'fill-paper stroke-ink-soft'}`} strokeWidth={on ? 2.5 : 1.2} />
                <text x={x} y={y + 4} textAnchor="middle" fontSize={11.5} fontWeight={on ? 700 : 600}>{i + 1}. {s.label}</text>
              </g>
            )
          })}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize={12} fontWeight={700}>dados da aplicação</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize={10.5} className="dg-soft">prompts · RAG · embeddings · logs</text>
        </Svg>
      </div>
      <Callout tone="focus" title={item.label} live>{item.ai}</Callout>
    </DiagramShell>
  )
}
