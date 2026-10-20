import type { Corpus } from './types'
import { normalizeSearch } from './search'

export type GlossaryEntry = {
  id: string
  name: string
  purpose: string
  category: string
  chapterId: string
  sectionId?: string
  whenToChoose?: string
  doNotConfuse?: string
  scopeNote?: string
  docUrl?: string
}

const ENRICHMENT: Record<string, Pick<GlossaryEntry, 'whenToChoose' | 'doNotConfuse' | 'scopeNote' | 'docUrl' | 'chapterId'>> = {
  'Amazon EC2': {
    chapterId: 'chapter-11',
    whenToChoose: 'Quando você precisa controlar o sistema operacional e a instância.',
    doNotConfuse: 'Lambda executa funções; Fargate executa contêineres sem você administrar o host.',
    docUrl: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html',
  },
  'AWS Lambda': {
    chapterId: 'chapter-11',
    whenToChoose: 'Funções acionadas por eventos, com o modelo de execução do serviço.',
    doNotConfuse: 'Não é o mesmo que Fargate. Serverless não significa ausência de servidores.',
  },
  'Amazon S3': {
    chapterId: 'chapter-13',
    whenToChoose: 'Objetos acessados por API, com classes conforme frequência e recuperação.',
    doNotConfuse: 'EBS é bloco para uma instância; EFS é arquivo compartilhado.',
    docUrl: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html',
  },
  'Amazon RDS': {
    chapterId: 'chapter-14',
    whenToChoose: 'Banco relacional gerenciado com SQL e transações.',
    doNotConfuse: 'DynamoDB é NoSQL; ElastiCache é cache; Redshift é warehouse.',
  },
  'Amazon DynamoDB': {
    chapterId: 'chapter-14',
    whenToChoose: 'Acesso chave-valor ou documento desenhado para escala.',
    doNotConfuse: 'Não substitui um modelo relacional só porque “é da AWS”.',
  },
  'Amazon VPC': {
    chapterId: 'chapter-12',
    whenToChoose: 'Isolar a rede da sua aplicação em uma Região.',
    doNotConfuse: 'Security Group não cria rota; IAM não substitui firewall de rede.',
  },
  'Amazon CloudWatch': {
    chapterId: 'chapter-15',
    whenToChoose: 'Métricas, logs e alarmes da operação.',
    doNotConfuse: 'CloudTrail registra chamadas de API; Config acompanha configuração.',
  },
  'AWS CloudTrail': {
    chapterId: 'chapter-09',
    whenToChoose: 'Saber quem chamou qual API.',
    doNotConfuse: 'Não é o alarme de latência nem o histórico de configuração por si só.',
  },
  'AWS Config': {
    chapterId: 'chapter-15',
    whenToChoose: 'Ver se a configuração de um recurso desviou do esperado.',
    doNotConfuse: 'Não substitui CloudTrail nem GuardDuty.',
  },
  'Amazon SQS': {
    chapterId: 'chapter-16',
    whenToChoose: 'Desacoplar produtor e consumidor com uma fila.',
    doNotConfuse: 'SNS publica para vários assinantes; não é um workflow.',
  },
  'Amazon SNS': {
    chapterId: 'chapter-16',
    whenToChoose: 'Fan-out e notificações pub/sub.',
    doNotConfuse: 'SQS é fila; EventBridge roteia eventos por regras.',
  },
  'Amazon EventBridge': {
    chapterId: 'chapter-16',
    whenToChoose: 'Rotear eventos com regras e filtros.',
    doNotConfuse: 'Não é uma fila de trabalho nem um stream contínuo.',
  },
  'AWS IAM': {
    chapterId: 'chapter-07',
    whenToChoose: 'Autorizar identidades e workloads nos recursos AWS.',
    doNotConfuse: 'Cognito é para usuários da aplicação; Identity Center é workforce.',
  },
  'AWS IAM Identity Center': {
    chapterId: 'chapter-07',
    whenToChoose: 'Acesso da força de trabalho a várias contas.',
    doNotConfuse: 'O nome antigo AWS SSO não descreve usuários finais de app.',
    scopeNote: 'Nome atual do antigo AWS SSO.',
  },
}

function cleanCell(value: string): string {
  return value.replace(/\*\*/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').trim()
}

export function glossaryFromCorpus(corpus: Corpus): GlossaryEntry[] {
  const chapter = corpus.chapters.find((item) => item.id === 'chapter-18')
  if (!chapter) return []
  const entries: GlossaryEntry[] = []
  let category = 'Catálogo'
  const lines = chapter.markdown.split('\n')
  for (const line of lines) {
    const heading = /^##\s+(.+)$/.exec(line)
    if (heading?.[1]) category = cleanCell(heading[1])
    if (!line.startsWith('|')) continue
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    if (cells.length < 2) continue
    const name = cleanCell(cells[0] ?? '')
    const purpose = cleanCell(cells[1] ?? '')
    if (!name || !purpose || name === 'Serviço' || /^-+$/.test(name.replace(/\s/g, ''))) continue
    const extra = ENRICHMENT[name]
    entries.push({
      id: `gloss-${normalizeSearch(name).replace(/[^a-z0-9]+/g, '-')}`,
      name,
      purpose,
      category,
      chapterId: extra?.chapterId ?? 'chapter-18',
      whenToChoose: extra?.whenToChoose,
      doNotConfuse: extra?.doNotConfuse,
      scopeNote: extra?.scopeNote,
      docUrl: extra?.docUrl,
    })
  }
  return entries
}

export const COMPARISONS = [
  { title: 'CloudWatch, CloudTrail e Config', text: 'Métrica e log operacional, auditoria de API e estado de configuração respondem perguntas diferentes.' },
  { title: 'SQS, SNS, EventBridge, Kinesis e Step Functions', text: 'Fila, fan-out, barramento com regras, stream e workflow de estados não são o mesmo mecanismo.' },
  { title: 'EC2, ECS, EKS, Fargate e Lambda', text: 'Instância, orquestração de contêiner, Kubernetes gerenciado, contêiner sem host gerido por você e função.' },
  { title: 'S3, EBS, EFS e FSx', text: 'Objeto, bloco, arquivo compartilhado NFS e sistemas de arquivo especializados.' },
  { title: 'RDS, Aurora, DynamoDB e ElastiCache', text: 'Relacional gerenciado, relacional compatível de alta performance, NoSQL e cache em memória.' },
  { title: 'WAF, Shield, GuardDuty, Inspector e Macie', text: 'Filtro web, DDoS, detecção de ameaças, vulnerabilidades e dados sensíveis no S3.' },
  { title: 'CAF e Well-Architected', text: 'Seis perspectivas de adoção da organização versus seis pilares da workload, incluindo sustentabilidade.' },
]
