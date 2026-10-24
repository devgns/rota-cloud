import { useState } from 'react'
import { Choices, DiagramShell, ScenarioQuiz, type QuizOption, type QuizScenario } from '@/components/diagrams/kit'

type Cat = 'data' | 'compute' | 'db' | 'ai' | 'ops' | 'out'

const cats: readonly { id: Cat; label: string }[] = [
  { id: 'ai', label: 'ML e IA' },
  { id: 'data', label: 'Analytics e dados' },
  { id: 'compute', label: 'Compute e armazenamento' },
  { id: 'db', label: 'Bancos de dados' },
  { id: 'ops', label: 'Gestão, segurança e custos' },
  { id: 'out', label: 'Fora de escopo' },
]

const services: readonly { cat: Cat; name: string; when: string }[] = [
  { cat: 'ai', name: 'Amazon Bedrock', when: 'acesso gerenciado a foundation models e componentes GenAI' },
  { cat: 'ai', name: 'Bedrock AgentCore', when: 'runtime, ferramentas, identidade, memória e operação de agentes' },
  { cat: 'ai', name: 'Strands Agents', when: 'framework/SDK para construir agentes' },
  { cat: 'ai', name: 'Amazon Nova', when: 'família de modelos de IA da Amazon' },
  { cat: 'ai', name: 'SageMaker AI', when: 'construir, treinar, implantar e operar ML' },
  { cat: 'ai', name: 'SageMaker JumpStart', when: 'começar com modelos e soluções pré-construídas' },
  { cat: 'ai', name: 'Kiro', when: 'IDE com agentes: desenvolvimento orientado por especificação' },
  { cat: 'ai', name: 'Amazon Q Developer', when: 'assistente generativo para programar e operar na AWS' },
  { cat: 'ai', name: 'Amazon Q Business', when: 'assistente generativo para funcionários, sobre dados da empresa' },
  { cat: 'ai', name: 'AWS Transform', when: 'modernizar aplicações com IA em cenários suportados' },
  { cat: 'ai', name: 'Amazon Comprehend', when: 'NLP: sentimento, entidades e análise de texto' },
  { cat: 'ai', name: 'Amazon Lex', when: 'bots conversacionais com intenções e slots' },
  { cat: 'ai', name: 'Amazon Personalize', when: 'recomendações personalizadas' },
  { cat: 'ai', name: 'Amazon Polly', when: 'texto para fala' },
  { cat: 'ai', name: 'Amazon Rekognition', when: 'análise de imagens e vídeo' },
  { cat: 'ai', name: 'Amazon Textract', when: 'texto, tabelas e formulários de documentos' },
  { cat: 'ai', name: 'Amazon Transcribe', when: 'voz/áudio para texto' },
  { cat: 'ai', name: 'Amazon Translate', when: 'tradução automática de texto' },
  { cat: 'data', name: 'AWS Data Exchange', when: 'obter conjuntos de dados de terceiros' },
  { cat: 'data', name: 'Amazon EMR', when: 'big data distribuído (Spark, Hadoop)' },
  { cat: 'data', name: 'AWS Glue', when: 'catálogo e pipelines de ETL' },
  { cat: 'data', name: 'Glue DataBrew', when: 'preparar e limpar dados visualmente' },
  { cat: 'data', name: 'AWS Lake Formation', when: 'governar o acesso a um data lake' },
  { cat: 'data', name: 'Amazon OpenSearch Service', when: 'pesquisa, analytics e busca vetorial' },
  { cat: 'data', name: 'Amazon Quick', when: 'análise e BI com IA para o negócio (evolução do QuickSight)' },
  { cat: 'data', name: 'Amazon Redshift', when: 'data warehouse para análises em escala' },
  { cat: 'compute', name: 'Amazon EC2', when: 'máquinas virtuais com controle da instância' },
  { cat: 'compute', name: 'AWS Lambda', when: 'código por evento, sem gerenciar servidores' },
  { cat: 'compute', name: 'Amazon ECS', when: 'orquestrar contêineres na AWS' },
  { cat: 'compute', name: 'Amazon EKS', when: 'Kubernetes gerenciado' },
  { cat: 'compute', name: 'Amazon S3', when: 'objetos: datasets, documentos, logs e artefatos' },
  { cat: 'compute', name: 'S3 Glacier', when: 'arquivamento de baixo custo' },
  { cat: 'db', name: 'Amazon Aurora', when: 'relacional gerenciado; PostgreSQL com vetores' },
  { cat: 'db', name: 'Amazon RDS', when: 'bancos relacionais gerenciados, inclusive PostgreSQL' },
  { cat: 'db', name: 'Amazon DynamoDB', when: 'NoSQL chave-valor de baixa latência' },
  { cat: 'db', name: 'Amazon DocumentDB', when: 'documentos compatíveis com MongoDB' },
  { cat: 'db', name: 'Amazon ElastiCache', when: 'cache em memória' },
  { cat: 'db', name: 'Amazon Neptune', when: 'grafos e dados conectados' },
  { cat: 'ops', name: 'AWS CloudTrail', when: 'trilha de chamadas de API' },
  { cat: 'ops', name: 'Amazon CloudWatch', when: 'métricas, logs e alarmes' },
  { cat: 'ops', name: 'AWS Config', when: 'estado e histórico de configuração' },
  { cat: 'ops', name: 'AWS Trusted Advisor', when: 'recomendações de boas práticas' },
  { cat: 'ops', name: 'Well-Architected Tool', when: 'revisão de workload por pilares' },
  { cat: 'ops', name: 'Amazon CloudFront', when: 'CDN, entrega na borda' },
  { cat: 'ops', name: 'Amazon VPC', when: 'rede privada e isolamento lógico' },
  { cat: 'ops', name: 'AWS PrivateLink', when: 'acesso privado a serviços, sem internet pública' },
  { cat: 'ops', name: 'AWS Artifact', when: 'relatórios de conformidade da AWS' },
  { cat: 'ops', name: 'AWS IAM', when: 'identidades, papéis, políticas e permissões' },
  { cat: 'ops', name: 'Amazon Inspector', when: 'vulnerabilidades em recursos suportados' },
  { cat: 'ops', name: 'AWS KMS', when: 'chaves e criptografia' },
  { cat: 'ops', name: 'Amazon Macie', when: 'dados sensíveis no S3' },
  { cat: 'ops', name: 'AWS Secrets Manager', when: 'segredos e credenciais' },
  { cat: 'ops', name: 'AWS Budgets', when: 'orçamento e alertas de gasto' },
  { cat: 'ops', name: 'AWS Cost Explorer', when: 'análise de custos históricos' },
  { cat: 'out', name: 'AWS WAF', when: 'útil em projetos, mas fora do escopo AIF-C01' },
  { cat: 'out', name: 'Amazon GuardDuty', when: 'útil em projetos, mas fora do escopo AIF-C01' },
  { cat: 'out', name: 'Amazon Cognito', when: 'útil em projetos, mas fora do escopo AIF-C01' },
  { cat: 'out', name: 'AWS Organizations', when: 'útil em projetos, mas fora do escopo AIF-C01' },
  { cat: 'out', name: 'AWS Amplify', when: 'útil em projetos, mas fora do escopo AIF-C01' },
  { cat: 'out', name: 'AWS Marketplace', when: 'útil em projetos, mas fora do escopo AIF-C01' },
]

const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function ServiceCard({ name, when, out }: { name: string; when: string; out: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <li>
      <button type="button" className="dg-box h-full w-full text-left text-sm" data-tone={open ? (out ? 'warn' : 'focus') : 'plain'} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="block font-semibold">{name}</span>
        <span className="block text-xs text-ink-soft">{open ? when : 'clique: quando reconhecer?'}</span>
      </button>
    </li>
  )
}

export function ServiceCatalogExplorer() {
  const [cat, setCat] = useState<Cat>('ai')
  const [query, setQuery] = useState('')
  const needle = strip(query.trim())
  const list = services.filter((s) => (needle ? strip(`${s.name} ${s.when}`).includes(needle) : s.cat === cat))
  return (
    <DiagramShell
      label="Explorador dos serviços AWS no escopo da AIF-C01"
      kicker="Catálogo interativo"
      title={`${services.filter((s) => s.cat !== 'out').length} serviços em escopo, pela pergunta que resolvem`}
      lead="Escolha uma categoria ou busque por necessidade (“vetor”, “segredo”, “fala”…). Tente lembrar antes de clicar no cartão."
      limits="Lista não exaustiva do guia v1.1; nomes e recursos mudam. Fora de escopo não significa inútil — só não é o foco desta prova."
    >
      <Choices label="Categoria" options={cats} value={needle ? null : cat} onChange={(v) => { setQuery(''); setCat(v) }} />
      <input type="search" className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm" placeholder="Buscar por nome ou necessidade" aria-label="Buscar serviço" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
      <p className="m-0 mt-2 text-xs text-ink-soft" role="status">{list.length} serviço(s)</p>
      <ul className="m-0 mt-2 grid list-none gap-1.5 p-0 sm:grid-cols-2 md:grid-cols-3">
        {list.map((s) => <ServiceCard key={`${needle}-${s.name}`} name={s.name} when={s.when} out={s.cat === 'out'} />)}
      </ul>
    </DiagramShell>
  )
}

type Pick = 'artifact' | 'textract' | 'secrets' | 'bedrock' | 'sagemaker' | 'config' | 'trail' | 'cost'

const options: readonly QuizOption<Pick>[] = [
  { id: 'artifact', label: 'Artifact', role: 'relatórios de conformidade da AWS.' },
  { id: 'textract', label: 'Textract', role: 'extrai texto, tabelas e formulários.' },
  { id: 'secrets', label: 'Secrets Manager', role: 'guarda e rotaciona segredos.' },
  { id: 'bedrock', label: 'Bedrock', role: 'FMs gerenciados por API.' },
  { id: 'sagemaker', label: 'SageMaker AI', role: 'treina e opera ML próprio.' },
  { id: 'config', label: 'Config', role: 'estado e mudança de configuração.' },
  { id: 'trail', label: 'CloudTrail', role: 'auditoria de chamadas de API.' },
  { id: 'cost', label: 'Cost Explorer', role: 'custo histórico e tendências.' },
]

const scenarios: readonly QuizScenario<Pick>[] = [
  { id: 's1', prompt: 'Relatório de conformidade da AWS.', answer: 'artifact', why: 'AWS Artifact.' },
  { id: 's2', prompt: 'Extrair uma tabela de um documento escaneado.', answer: 'textract', why: 'Amazon Textract.' },
  { id: 's3', prompt: 'Gerenciar a senha do banco usada pela aplicação.', answer: 'secrets', why: 'AWS Secrets Manager.' },
  { id: 's4', prompt: 'Usar um LLM gerenciado.', answer: 'bedrock', why: 'Amazon Bedrock.' },
  { id: 's5', prompt: 'Treinar um modelo tabular próprio.', answer: 'sagemaker', why: 'Amazon SageMaker AI.' },
  { id: 's6', prompt: 'Saber como um recurso estava configurado semana passada.', answer: 'config', why: 'AWS Config.' },
  { id: 's7', prompt: 'Auditar quem fez uma chamada à AWS.', answer: 'trail', why: 'AWS CloudTrail.' },
  { id: 's8', prompt: 'Ver o custo dos últimos seis meses por serviço.', answer: 'cost', why: 'AWS Cost Explorer.' },
]

export function ServiceClassificationQuiz() {
  return (
    <DiagramShell label="Exercício de classificação de serviços" kicker="Exercício 24.8" title="Associe a necessidade ao serviço" lead="Oito necessidades, oito serviços. Responda rápido: na prova, o enunciado costuma trazer a pista.">
      <ScenarioQuiz label="Serviço" scenarios={scenarios} options={options} />
    </DiagramShell>
  )
}
