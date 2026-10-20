import { DiagramShell, ScenarioQuiz, Svg, SvgArrow, SvgNode, type QuizOption, type QuizScenario, type Rect, type Tone } from './kit'

type Svc = 'shield' | 'waf' | 'guardduty' | 'inspector' | 'macie' | 'hub' | 'detective' | 'fwm'

const options: readonly QuizOption<Svc>[] = [
  { id: 'waf', label: 'WAF', role: 'filtra requisições HTTP(S) por regras: SQL injection, bots, taxa, origem.' },
  { id: 'shield', label: 'Shield', role: 'protege contra DDoS; o Standard já vem em serviços elegíveis.' },
  { id: 'guardduty', label: 'GuardDuty', role: 'detecta ameaças em telemetria (CloudTrail, fluxo de VPC, DNS) e gera achados.' },
  { id: 'inspector', label: 'Inspector', role: 'procura vulnerabilidades de software (CVEs) em EC2, imagens de contêiner e Lambda.' },
  { id: 'macie', label: 'Macie', role: 'descobre dados sensíveis, como PII, em buckets S3.' },
  { id: 'hub', label: 'Security Hub', role: 'centraliza e organiza achados de vários serviços e contas.' },
  { id: 'detective', label: 'Detective', role: 'ajuda a investigar um achado, correlacionando entidades e eventos.' },
  { id: 'fwm', label: 'Firewall Manager', role: 'padroniza regras de WAF, Shield e security groups em muitas contas.' },
]

const scenarios: readonly QuizScenario<Svc>[] = [
  { id: 'x1', prompt: 'Um bot envia SQL injection nos parâmetros das requisições HTTP da API.', answer: 'waf', why: 'Inspecionar o conteúdo HTTP e bloquear padrões é o WAF, na frente do CloudFront, ALB ou API Gateway.' },
  { id: 'x2', prompt: 'Um ataque volumétrico distribuído tenta derrubar o site.', answer: 'shield', why: 'Negação de serviço distribuída é o domínio do Shield.' },
  { id: 'x3', prompt: 'Uma access key começou a chamar APIs a partir de um país onde a empresa não opera.', answer: 'guardduty', why: 'Comportamento anômalo detectado em telemetria vira achado do GuardDuty.' },
  { id: 'x4', prompt: 'A imagem do contêiner tem uma versão do OpenSSL com CVE crítica.', answer: 'inspector', why: 'Vulnerabilidade de software em imagem, instância ou função é o Inspector.' },
  { id: 'x5', prompt: 'Descobrir se há CPFs e números de cartão em objetos de um bucket.', answer: 'macie', why: 'Classificar dados sensíveis no S3 é o Macie. Ele olha o conteúdo, não o tráfego.' },
  { id: 'x6', prompt: 'Uma tela única com os achados de GuardDuty, Inspector e Macie de todas as contas.', answer: 'hub', why: 'Agregar e priorizar achados é o Security Hub. Ele não detecta sozinho: consome os outros.' },
  { id: 'x7', prompt: 'Entender a fundo um achado: que IP, que role e que instâncias se relacionaram nas últimas semanas.', answer: 'detective', why: 'Investigação e correlação de um achado é o Detective.' },
  { id: 'x8', prompt: 'Aplicar o mesmo conjunto de regras de WAF em 40 contas da organização.', answer: 'fwm', why: 'Gerenciar regras de proteção de forma central, em várias contas, é o Firewall Manager.' },
]

const nodes: Record<Svc | 'internet' | 'front' | 'work' | 's3' | 'telemetry', Rect & { label: string; sub?: string; dashed?: boolean }> = {
  internet: { x: 6, y: 30, w: 84, h: 46, label: 'Internet' },
  shield: { x: 106, y: 30, w: 92, h: 46, label: 'Shield', sub: 'DDoS' },
  waf: { x: 214, y: 30, w: 92, h: 46, label: 'WAF', sub: 'HTTP' },
  front: { x: 322, y: 30, w: 110, h: 46, label: 'CloudFront/ALB' },
  work: { x: 448, y: 30, w: 100, h: 46, label: 'Workload', sub: 'EC2·ECR·Lambda' },
  s3: { x: 564, y: 30, w: 90, h: 46, label: 'S3', sub: 'dados' },
  fwm: { x: 120, y: 120, w: 170, h: 46, label: 'Firewall Manager', sub: 'regras em N contas', dashed: true },
  inspector: { x: 448, y: 120, w: 100, h: 46, label: 'Inspector', sub: 'CVEs' },
  macie: { x: 564, y: 120, w: 90, h: 46, label: 'Macie', sub: 'PII' },
  telemetry: { x: 6, y: 220, w: 150, h: 46, label: 'Telemetria', sub: 'Trail · Flow Logs · DNS', dashed: true },
  guardduty: { x: 186, y: 220, w: 112, h: 46, label: 'GuardDuty', sub: 'ameaças' },
  hub: { x: 344, y: 220, w: 130, h: 46, label: 'Security Hub', sub: 'agrega achados' },
  detective: { x: 520, y: 220, w: 134, h: 46, label: 'Detective', sub: 'investiga' },
}

function toneFor(id: string, answer: Svc, picked: Svc | undefined): Tone {
  if (picked === undefined) return 'plain'
  if (id === answer) return 'ok'
  if (id === picked) return 'bad'
  return 'dim'
}

function SecurityMap({ answer, picked }: { answer: Svc; picked: Svc | undefined }) {
  const n = nodes
  return (
    <>
      <text x={6} y={18} fontSize={11} className="dg-soft">
        caminho da requisição →
      </text>
      <SvgArrow from={n.internet} to={n.shield} />
      <SvgArrow from={n.shield} to={n.waf} />
      <SvgArrow from={n.waf} to={n.front} />
      <SvgArrow from={n.front} to={n.work} />
      <SvgArrow from={n.work} to={n.s3} />
      <SvgArrow from={n.fwm} to={n.waf} dashed />
      <SvgArrow from={n.fwm} to={n.shield} dashed />
      <SvgArrow from={n.inspector} to={n.work} dashed label="examina" />
      <SvgArrow from={n.macie} to={n.s3} dashed />
      <SvgArrow from={n.telemetry} to={n.guardduty} />
      <SvgArrow from={n.guardduty} to={n.hub} />
      <SvgArrow from={n.inspector} to={n.hub} />
      <SvgArrow from={n.macie} to={n.hub} />
      <SvgArrow from={n.hub} to={n.detective} />
      <text x={6} y={206} fontSize={11} className="dg-soft">
        achados e investigação →
      </text>
      {Object.entries(nodes).map(([id, node]) => (
        <SvgNode key={id} {...node} fontSize={12} tone={toneFor(id, answer, picked)} />
      ))}
    </>
  )
}

export function SecurityServicesDiagram() {
  return (
    <DiagramShell
      label="Mapa de onde atuam WAF, Shield, GuardDuty, Inspector, Macie, Security Hub, Detective e Firewall Manager"
      kicker="Segurança"
      title="Onde cada serviço de segurança atua"
      lead="Em cima, o caminho da requisição; no meio, o que examina recursos; embaixo, quem detecta, agrega e investiga. Responda os cenários e veja o serviço no mapa."
      limits="Nenhum destes substitui IAM, security groups, criptografia ou a autorização de negócio no backend. O Shield Advanced e as fontes extras do GuardDuty dependem de plano e configuração."
    >
      <ScenarioQuiz
        label="Serviço de segurança"
        scenarios={scenarios}
        options={options}
        visual={({ scenario, picked }) => (
          <Svg width={660} height={276} minWidth={520} title="Serviços de segurança organizados por camada">
            <SecurityMap answer={scenario.answer} picked={picked} />
          </Svg>
        )}
      />
    </DiagramShell>
  )
}
