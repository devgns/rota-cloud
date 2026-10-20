import { DiagramShell, ScenarioQuiz, type QuizOption, type QuizScenario } from './kit'

type R = 'retire' | 'retain' | 'rehost' | 'relocate' | 'replatform' | 'refactor' | 'repurchase'

const options: readonly QuizOption<R>[] = [
  { id: 'retire', label: 'Retire', role: 'desliga de vez o que não traz valor.' },
  { id: 'retain', label: 'Retain', role: 'mantém onde está, por decisão, por enquanto.' },
  { id: 'rehost', label: 'Rehost', role: 'lift and shift: a mesma aplicação passa a rodar em EC2, quase sem mudança.' },
  { id: 'relocate', label: 'Relocate', role: 'move a plataforma de hospedagem (ex.: ambiente de VMs compatível) sem redesenhar a workload.' },
  { id: 'replatform', label: 'Replatform', role: 'ajuste pontual sem reescrever, como trocar o banco em VM por RDS.' },
  { id: 'refactor', label: 'Refactor', role: 'redesenha arquitetura ou código para aproveitar a nuvem.' },
  { id: 'repurchase', label: 'Repurchase', role: 'abandona o sistema próprio e adota outro produto ou SaaS.' },
]

const scenarios: readonly QuizScenario<R>[] = [
  { id: 'm1', prompt: 'Uma aplicação antiga vai para EC2 com a mesma VM, sem mudança significativa no código.', answer: 'rehost', why: 'Trocar só a hospedagem, com o mínimo de alteração, é rehost (lift and shift).' },
  { id: 'm2', prompt: 'O MySQL que roda numa VM vai para o RDS; o restante da aplicação continua igual.', answer: 'replatform', why: 'Uma otimização pontual — adotar um banco gerenciado — sem reescrever a aplicação é replatform.' },
  { id: 'm3', prompt: 'O CRM desenvolvido em casa será substituído por um SaaS de mercado.', answer: 'repurchase', why: 'Trocar o sistema próprio por um produto pronto é repurchase.' },
  { id: 'm4', prompt: 'Um monolito vai virar serviços orientados a eventos para escalar partes separadamente.', answer: 'refactor', why: 'Redesenho relevante da arquitetura é refactor / rearchitect.' },
  { id: 'm5', prompt: 'Durante o inventário, descobriram um sistema de relatórios que ninguém usa há dois anos.', answer: 'retire', why: 'Desativar o que não traz valor é retire — e reduz o escopo da migração.' },
  { id: 'm6', prompt: 'Um sistema legado depende de hardware específico e fica no data center por enquanto.', answer: 'retain', why: 'Não migrar agora, por decisão consciente, é retain. Diferente de retire: o sistema continua em uso.' },
  { id: 'm7', prompt: 'Todo o ambiente de VMs é transferido para uma plataforma compatível na AWS, sem mexer nas workloads.', answer: 'relocate', why: 'Mover a infraestrutura de hospedagem inteira, sem redesenhar a workload, é relocate.' },
]

const groups: readonly { title: string; ids: readonly R[] }[] = [
  { title: 'Não migra', ids: ['retire', 'retain'] },
  { title: 'Migra o que existe — cada vez mais mudança →', ids: ['rehost', 'relocate', 'replatform', 'refactor'] },
  { title: 'Substitui', ids: ['repurchase'] },
]

const examples: Record<R, string> = {
  retire: 'encerrar app redundante',
  retain: 'legado fica local',
  rehost: 'VM local → EC2',
  relocate: 'plataforma de VMs → AWS',
  replatform: 'banco em VM → RDS',
  refactor: 'monolito → eventos',
  repurchase: 'CRM próprio → SaaS',
}

export function MigrationRsDiagram() {
  return (
    <DiagramShell
      label="As sete estratégias de migração agrupadas por quanto o sistema muda"
      kicker="Migração"
      title="Os 7 Rs pela quantidade de mudança"
      lead="Primeiro pergunte se o sistema migra; depois, quanto ele muda no caminho. Classifique os cenários."
      limits="Na prática um portfólio mistura estratégias: cada aplicação recebe a sua. Ferramentas (MGN, DMS, SCT) apoiam as estratégias, não são estratégias."
    >
      <ScenarioQuiz
        label="Estratégia de migração"
        scenarios={scenarios}
        options={options}
        visual={({ scenario, picked }) => (
          <div className="grid min-w-[34rem] gap-2 sm:grid-cols-[1.7fr_3.6fr_1fr]">
            {groups.map((group) => (
              <div key={group.title} className="rounded-lg border border-line p-2">
                <p className="m-0 text-xs font-semibold uppercase tracking-wide text-ink-soft">{group.title}</p>
                <ul className={`m-0 mt-2 grid list-none gap-1.5 p-0 ${group.ids.length === 4 ? 'grid-cols-4' : group.ids.length === 2 ? 'grid-cols-2' : ''}`}>
                  {group.ids.map((id) => {
                    const label = options.find((item) => item.id === id)?.label ?? id
                    const tone = picked === undefined ? 'plain' : id === scenario.answer ? 'ok' : id === picked ? 'bad' : 'plain'
                    return (
                      <li key={id} className="dg-box text-sm" data-tone={tone}>
                        <span className="block font-semibold">{label}</span>
                        <span className="block text-xs text-ink-soft">{examples[id]}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      />
    </DiagramShell>
  )
}
