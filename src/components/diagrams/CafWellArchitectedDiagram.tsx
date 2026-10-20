import { DiagramShell, ScenarioQuiz, type QuizOption, type QuizScenario } from './kit'

type Framework = 'caf' | 'wa'

interface Item {
  id: string
  name: string
  pt: string
}

const caf: readonly Item[] = [
  { id: 'business', name: 'Business', pt: 'valor de negócio' },
  { id: 'people', name: 'People', pt: 'cultura, papéis, capacitação' },
  { id: 'governance', name: 'Governance', pt: 'prioridades, riscos, gestão' },
  { id: 'platform', name: 'Platform', pt: 'base técnica da nuvem' },
  { id: 'caf-security', name: 'Security', pt: 'segurança na adoção' },
  { id: 'operations', name: 'Operations', pt: 'operar serviços na nuvem' },
]

const wa: readonly Item[] = [
  { id: 'opex', name: 'Operational Excellence', pt: 'operar e melhorar a workload' },
  { id: 'wa-security', name: 'Security', pt: 'proteger dados e sistemas' },
  { id: 'reliability', name: 'Reliability', pt: 'falhar e se recuperar' },
  { id: 'performance', name: 'Performance Efficiency', pt: 'recursos certos para a carga' },
  { id: 'cost', name: 'Cost Optimization', pt: 'evitar gasto sem valor' },
  { id: 'sustainability', name: 'Sustainability', pt: 'impacto ambiental' },
]

const options: readonly QuizOption<Framework>[] = [
  { id: 'caf', label: 'CAF — perspectiva', role: 'organiza a adoção da nuvem pela empresa: pessoas, negócio, governança.' },
  { id: 'wa', label: 'Well-Architected — pilar', role: 'avalia a arquitetura de uma workload específica.' },
]

interface Scenario extends QuizScenario<Framework> {
  item: string
}

const scenarios: readonly Scenario[] = [
  {
    id: 's1',
    prompt: 'A empresa vai treinar as equipes e redefinir papéis antes de migrar para a nuvem.',
    answer: 'caf',
    item: 'people',
    why: 'Capacitação e papéis são a perspectiva People do CAF: preparação da organização, não da arquitetura.',
  },
  {
    id: 's2',
    prompt: 'A API precisa voltar sozinha quando uma AZ falha.',
    answer: 'wa',
    item: 'reliability',
    why: 'Recuperar-se de falhas é o pilar Reliability da workload.',
  },
  {
    id: 's3',
    prompt: 'Reduzir o impacto ambiental da workload escolhendo instâncias mais eficientes.',
    answer: 'wa',
    item: 'sustainability',
    why: 'Sustainability é o sexto pilar do Well-Architected. Não existe perspectiva equivalente no CAF.',
  },
  {
    id: 's4',
    prompt: 'A diretoria quer ligar o investimento em nuvem a metas de receita e de agilidade.',
    answer: 'caf',
    item: 'business',
    why: 'Alinhar a nuvem ao resultado de negócio é a perspectiva Business do CAF.',
  },
  {
    id: 's5',
    prompt: 'Revisar se os dados desta aplicação estão criptografados e com acesso mínimo.',
    answer: 'wa',
    item: 'wa-security',
    why: 'Proteger os dados de uma workload é o pilar Security. A palavra também aparece no CAF, com outro escopo.',
  },
  {
    id: 's6',
    prompt: 'Definir como a empresa vai gerir riscos, orçamento e prioridades da jornada para a nuvem.',
    answer: 'caf',
    item: 'governance',
    why: 'Prioridades, riscos e controle da jornada são a perspectiva Governance do CAF.',
  },
  {
    id: 's7',
    prompt: 'A workload está superdimensionada e gera custo sem benefício.',
    answer: 'wa',
    item: 'cost',
    why: 'Cost Optimization é um pilar da workload. Cuidado: “custo” não leva automaticamente ao CAF.',
  },
]

function Column({ title, subtitle, items, focus, framework, active }: { title: string; subtitle: string; items: readonly Item[]; focus: string | null; framework: Framework; active: Framework | null }) {
  return (
    <div className={`rounded-lg border p-2 transition-opacity ${active === framework ? 'border-navy' : 'border-line'} ${active && active !== framework ? 'opacity-55' : ''}`}>
      <p className="m-0 px-1 text-sm font-semibold">{title}</p>
      <p className="m-0 px-1 text-xs text-ink-soft">{subtitle}</p>
      <ol className="m-0 mt-2 grid list-none gap-1.5 p-0">
        {items.map((item, i) => (
          <li key={item.id} className="dg-box flex items-baseline gap-2 py-1.5 text-sm" data-tone={focus === item.id ? 'ok' : 'plain'}>
            <span className="w-4 shrink-0 text-xs tabular-nums text-ink-soft">{i + 1}</span>
            <span>
              <span className="font-semibold">{item.name}</span>
              <span className="block text-xs text-ink-soft">{item.pt}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function CafWellArchitectedDiagram() {
  return (
    <DiagramShell
      label="CAF e Well-Architected lado a lado, com classificação de cenários"
      kicker="Frameworks"
      title="Seis perspectivas ou seis pilares?"
      lead="CAF responde “a empresa está pronta para a nuvem?”. Well-Architected responde “esta workload está bem construída?”. Classifique cada cenário e veja o item correspondente acender."
      limits="Cada perspectiva e cada pilar tem capacidades e práticas que este quadro não lista. O exercício treina só o enquadramento da pergunta."
    >
      <ScenarioQuiz
        label="Framework do cenário"
        scenarios={scenarios}
        options={options}
        visual={({ scenario, picked }) => {
          const focus = picked ? scenario.item : null
          const active = picked ? scenario.answer : null
          return (
            <div className="grid gap-2 sm:grid-cols-2">
              <Column title="Cloud Adoption Framework" subtitle="perspectivas — a organização" items={caf} focus={focus} framework="caf" active={active} />
              <Column title="Well-Architected Framework" subtitle="pilares — a workload" items={wa} focus={focus} framework="wa" active={active} />
            </div>
          )
        }}
      />
    </DiagramShell>
  )
}
