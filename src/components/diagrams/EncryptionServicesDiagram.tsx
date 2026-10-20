import { DiagramShell, ScenarioQuiz, Svg, SvgArrow, SvgNode, type QuizOption, type QuizScenario, type Rect, type Tone } from './kit'

type Svc = 'acm' | 'kms' | 'cloudhsm' | 'secrets' | 'role'

const options: readonly QuizOption<Svc>[] = [
  { id: 'acm', label: 'ACM', role: 'emite e renova certificados TLS para HTTPS em ALB, CloudFront e afins.' },
  { id: 'kms', label: 'KMS', role: 'cria e controla chaves gerenciadas que criptografam dados em repouso nos serviços AWS.' },
  { id: 'cloudhsm', label: 'CloudHSM', role: 'HSM dedicado ao cliente, com mais controle e mais operação que o KMS.' },
  { id: 'secrets', label: 'Secrets Manager', role: 'guarda e rotaciona segredos que ainda precisam existir, como senha de banco ou chave de API externa.' },
  { id: 'role', label: 'IAM role', role: 'dá credenciais temporárias à workload para chamar a AWS, sem chave fixa.' },
]

const scenarios: readonly QuizScenario<Svc>[] = [
  { id: 'e1', prompt: 'O ALB precisa servir HTTPS e o certificado deve renovar sem ninguém lembrar da data.', answer: 'acm', why: 'Certificado TLS gerenciado e renovado é ACM. Ele protege o dado em trânsito, não o arquivo em repouso.' },
  { id: 'e2', prompt: 'Criptografar objetos no S3 e controlar, com auditoria, quem pode usar a chave.', answer: 'kms', why: 'KMS integra com S3, EBS, RDS e outros, com key policy e registro de uso no CloudTrail.' },
  { id: 'e3', prompt: 'A regulação exige um HSM dedicado, de inquilino único, operado pelo cliente.', answer: 'cloudhsm', why: 'HSM dedicado sob controle do cliente é CloudHSM — com mais responsabilidade operacional.' },
  { id: 'e4', prompt: 'A senha do RDS deve ser rotacionada periodicamente e nunca ficar no código.', answer: 'secrets', why: 'Rotacionar e entregar segredos à aplicação é o papel do Secrets Manager. O KMS pode criptografar o segredo guardado.' },
  { id: 'e5', prompt: 'A task do ECS precisa ler o bucket. A equipe quer tirar a access key do arquivo de configuração.', answer: 'role', why: 'Para chamar a AWS, a workload usa uma IAM role com credenciais temporárias. Nada de chave fixa, nem no Secrets Manager.' },
  { id: 'e6', prompt: 'A aplicação chama uma API de pagamento de terceiros que só aceita uma chave de API.', answer: 'secrets', why: 'Fora da AWS não há IAM role que resolva: a credencial precisa existir e ser guardada com rotação — Secrets Manager.' },
  { id: 'e7', prompt: 'Volumes EBS e o banco RDS devem estar criptografados em repouso com chave gerenciada.', answer: 'kms', why: 'Criptografia em repouso integrada aos serviços usa chaves do KMS.' },
]

const nodes: Record<string, Rect & { label: string; sub?: string; dashed?: boolean }> = {
  browser: { x: 8, y: 24, w: 100, h: 46, label: 'Navegador' },
  alb: { x: 168, y: 24, w: 92, h: 46, label: 'ALB' },
  app: { x: 316, y: 24, w: 128, h: 46, label: 'App (ECS)', sub: 'usa uma IAM role' },
  rds: { x: 508, y: 24, w: 124, h: 46, label: 'RDS', sub: 'dados em repouso' },
  acm: { x: 130, y: 122, w: 130, h: 46, label: 'ACM', sub: 'certificado TLS' },
  secrets: { x: 300, y: 122, w: 160, h: 46, label: 'Secrets Manager', sub: 'senha do banco' },
  s3: { x: 508, y: 122, w: 124, h: 46, label: 'S3', sub: 'objetos em repouso' },
  kms: { x: 372, y: 218, w: 120, h: 46, label: 'KMS', sub: 'chaves' },
  hsm: { x: 516, y: 218, w: 116, h: 46, label: 'CloudHSM', sub: 'HSM dedicado', dashed: true },
}

const highlight: Record<Svc, readonly string[]> = {
  acm: ['acm', 'alb'],
  kms: ['kms', 'rds', 's3'],
  cloudhsm: ['hsm'],
  secrets: ['secrets'],
  role: ['app'],
}

function toneFor(id: string, answer: Svc, picked: Svc | undefined): Tone {
  if (picked === undefined) return 'plain'
  if (highlight[answer].includes(id)) return 'ok'
  if (picked !== answer && highlight[picked].includes(id)) return 'bad'
  return 'dim'
}

function CryptoMap({ answer, picked }: { answer: Svc; picked: Svc | undefined }) {
  const n = (id: string) => nodes[id]!
  return (
    <>
      <SvgArrow from={n('browser')} to={n('alb')} label="HTTPS" />
      <SvgArrow from={n('alb')} to={n('app')} />
      <SvgArrow from={n('app')} to={n('rds')} label="TLS" />
      <SvgArrow from={n('app')} to={n('secrets')} />
      <SvgArrow from={n('app')} to={n('s3')} />
      <SvgArrow from={n('acm')} to={n('alb')} dashed />
      <SvgArrow from={n('kms')} to={n('secrets')} dashed />
      <SvgArrow from={n('kms')} to={n('s3')} dashed />
      <SvgArrow from={n('hsm')} to={n('kms')} dashed />
      {Object.entries(nodes).map(([id, node]) => (
        <SvgNode key={id} {...node} tone={toneFor(id, answer, picked)} />
      ))}
      <text x={8} y={110} fontSize={11} className="dg-soft">
        em trânsito: TLS
      </text>
      <text x={8} y={250} fontSize={11} className="dg-soft">
        tracejado = protege / alternativa
      </text>
    </>
  )
}

export function EncryptionServicesDiagram() {
  return (
    <DiagramShell
      label="Mapa de criptografia, certificados, segredos e credenciais numa aplicação"
      kicker="Proteção de dados"
      title="Certificado, chave, segredo ou role?"
      lead="Os quatro protegem coisas diferentes no mesmo caminho. Escolha o serviço de cada cenário e veja onde ele atua."
      limits="Criptografia não substitui autorização: quem tem permissão consegue descriptografar. Parameter Store também guarda strings seguras, com menos foco em rotação. O desenho omite TLS interno do ALB à aplicação."
    >
      <ScenarioQuiz
        label="Serviço do cenário"
        scenarios={scenarios}
        options={options}
        visual={({ scenario, picked }) => (
          <Svg width={640} height={272} minWidth={500} title="Navegador, ALB, aplicação, RDS, S3 e os serviços de proteção">
            <CryptoMap answer={scenario.answer} picked={picked} />
          </Svg>
        )}
      />
    </DiagramShell>
  )
}
