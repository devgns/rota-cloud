import { DiagramShell, ScenarioQuiz, type QuizOption, type QuizScenario } from './kit'

type Svc = 'cloudtrail' | 'cloudwatch' | 'config' | 'guardduty'

const options: readonly QuizOption<Svc>[] = [
  { id: 'cloudtrail', label: 'CloudTrail', role: 'registra chamadas de API: quem, quando, de onde e o quê.' },
  { id: 'cloudwatch', label: 'CloudWatch', role: 'métricas, logs e alarmes: como a aplicação e os recursos estão se comportando.' },
  { id: 'config', label: 'Config', role: 'histórico de configuração dos recursos e avaliação contra regras de conformidade.' },
  { id: 'guardduty', label: 'GuardDuty', role: 'detecta ameaças a partir de telemetria e emite achados.' },
]

const events: readonly { at: string; svc: Svc; text: string }[] = [
  { at: '10:02', svc: 'cloudtrail', text: 'AuthorizeSecurityGroupIngress: porta 22 aberta para 0.0.0.0/0, pela role dev-deploy, a partir de 203.0.113.7.' },
  { at: '10:03', svc: 'config', text: 'sg-0a1b muda de estado; a regra “SSH restrito” passa a NONCOMPLIANT. O item anterior continua no histórico.' },
  { at: '10:19', svc: 'guardduty', text: 'Achado: tentativas de SSH vindas de um IP com reputação maliciosa.' },
  { at: '10:24', svc: 'cloudwatch', text: 'CPU da instância em 96%, latência p99 sobe e o alarme dispara; logs mostram erros 500.' },
]

const scenarios: readonly QuizScenario<Svc>[] = [
  { id: 'o1', prompt: 'Quem abriu a porta 22 e de qual IP partiu a chamada?', answer: 'cloudtrail', why: 'Identidade, horário, origem e ação da chamada de API ficam no CloudTrail.' },
  { id: 'o2', prompt: 'Como estava a regra do Security Group antes da mudança, e ela segue a política da empresa?', answer: 'config', why: 'Linha do tempo da configuração e avaliação contra regras é o AWS Config.' },
  { id: 'o3', prompt: 'Avisar o plantão quando a CPU passar de 80% por cinco minutos.', answer: 'cloudwatch', why: 'Métrica com alarme é CloudWatch.' },
  { id: 'o4', prompt: 'Há sinais de atividade maliciosa contra a conta ou as instâncias?', answer: 'guardduty', why: 'Detectar ameaças a partir de CloudTrail, fluxo de VPC e DNS e emitir achados é o GuardDuty.' },
  { id: 'o5', prompt: 'Ler os logs da aplicação para entender os erros 500.', answer: 'cloudwatch', why: 'Logs da aplicação vão para o CloudWatch Logs.' },
  { id: 'o6', prompt: 'Ontem um bucket foi apagado. Qual identidade fez isso?', answer: 'cloudtrail', why: 'Ação administrativa e quem a executou: CloudTrail.' },
]

const label: Record<Svc, string> = { cloudtrail: 'CloudTrail', cloudwatch: 'CloudWatch', config: 'Config', guardduty: 'GuardDuty' }

export function ObservabilityDiagram() {
  return (
    <DiagramShell
      label="Linha do tempo de um incidente vista por CloudTrail, Config, GuardDuty e CloudWatch"
      kicker="Observabilidade e auditoria"
      title="Um incidente, quatro registros diferentes"
      lead="Alguém abriu o SSH de uma instância para a internet. Cada serviço viu um pedaço da história. Para cada pergunta, escolha quem tem a resposta; a origem de cada registro aparece depois."
      limits="Para responder, a trilha do CloudTrail, o gravador do Config e o GuardDuty precisam estar habilitados antes do incidente. Eventos de dados do S3 não entram no CloudTrail por padrão. Security Hub agregaria os achados; Detective ajudaria a investigar."
    >
      <ScenarioQuiz
        label="Serviço que responde"
        scenarios={scenarios}
        options={options}
        visual={({ scenario, picked }) => (
          <ol className="m-0 grid list-none gap-1.5 p-0" aria-label="Linha do tempo do incidente">
            {events.map((event) => {
              const tone = picked === undefined ? 'plain' : event.svc === scenario.answer ? 'ok' : event.svc === picked ? 'bad' : 'dim'
              return (
                <li key={event.at} className="dg-box grid grid-cols-[3rem_6.5rem_1fr] items-baseline gap-2 text-sm max-sm:grid-cols-[3rem_1fr]" data-tone={tone}>
                  <span className="font-semibold tabular-nums">{event.at}</span>
                  <span className="dg-chip w-fit">{picked === undefined ? 'qual registro?' : label[event.svc]}</span>
                  <span className="max-sm:col-span-2">{event.text}</span>
                </li>
              )
            })}
          </ol>
        )}
      />
    </DiagramShell>
  )
}
