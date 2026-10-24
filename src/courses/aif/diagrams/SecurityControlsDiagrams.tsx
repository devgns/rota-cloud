import { useState } from 'react'
import { Callout, Choices, DiagramShell } from '@/components/diagrams/kit'

/* 22.6 — quem protege o quê */

type Control = 'iam' | 'kms' | 'secrets' | 'network' | 'guardrails' | 'macie' | 'trail' | 'action'

const controls: readonly { id: Control; name: string; does: string; notEnough: string }[] = [
  { id: 'iam', name: 'IAM / AgentCore Identity', does: 'Quem pode chamar quais recursos AWS, com papéis e políticas de menor privilégio.', notEnough: 'Não verifica se a resposta é verdadeira.' },
  { id: 'kms', name: 'AWS KMS', does: 'Gerencia chaves e criptografia de dados em repouso nos serviços integrados.', notEnough: 'Não define quem pode pedir um reembolso.' },
  { id: 'secrets', name: 'Secrets Manager', does: 'Guarda e rotaciona senhas, tokens e credenciais.', notEnough: 'Não impede prompt injection.' },
  { id: 'network', name: 'VPC + PrivateLink', does: 'Comunicação privada com serviços compatíveis, sem atravessar a internet pública.', notEnough: 'Canal privado não corrige autorização do dado.' },
  { id: 'guardrails', name: 'Bedrock Guardrails', does: 'Filtra conteúdo, tópicos negados e dados sensíveis em entradas e saídas.', notEnough: 'Filtro não substitui ACL, linhagem nem revisão humana.' },
  { id: 'macie', name: 'Amazon Macie', does: 'Descobre e monitora dados sensíveis em buckets do Amazon S3.', notEnough: 'Descobrir não é bloquear o acesso.' },
  { id: 'trail', name: 'CloudTrail + CloudWatch', does: 'Trilha de chamadas de API AWS e telemetria operacional.', notEnough: 'Log registra; não previne. E não deve conter segredos.' },
  { id: 'action', name: 'Autorização por ação', does: 'Política, validação de parâmetros e aprovação antes de cada efeito externo do agente.', notEnough: 'O raciocínio do LLM nunca comprova permissão.' },
]

const needs: readonly { id: string; label: string; answer: Control[] }[] = [
  { id: 'n1', label: 'Só o atendente da carteira acessa as faturas daquele cliente', answer: ['iam', 'action'] },
  { id: 'n2', label: 'Faturas e embeddings cifrados no armazenamento', answer: ['kms'] },
  { id: 'n3', label: 'A senha do banco não fica no código nem no prompt', answer: ['secrets'] },
  { id: 'n4', label: 'O tráfego até o serviço de IA não passa pela internet pública', answer: ['network'] },
  { id: 'n5', label: 'Não devolver CPF na resposta do assistente', answer: ['guardrails'] },
  { id: 'n6', label: 'Descobrir planilhas com CPFs esquecidas no S3', answer: ['macie'] },
  { id: 'n7', label: 'Saber quem alterou a política IAM ontem', answer: ['trail'] },
  { id: 'n8', label: 'O agente só emite a segunda via após confirmação', answer: ['action'] },
]

export function ControlsMatrixDiagram() {
  const [need, setNeed] = useState(needs[0]!.id)
  const item = needs.find((n) => n.id === need)!
  return (
    <DiagramShell
      label="Matriz de controles de segurança para uma aplicação de IA na AWS"
      kicker="Quem protege o quê"
      title="Nenhum serviço de segurança resolve tudo"
      lead="Escolha a necessidade: o controle certo acende, e cada cartão lembra por que ele sozinho não basta."
      limits="Mapeamento simplificado de uma aplicação que responde sobre faturas e emite segunda via. Arquiteturas reais combinam mais controles e processos."
    >
      <label className="mt-3 block text-sm font-semibold" htmlFor="aif-sec-need">Necessidade</label>
      <select id="aif-sec-need" className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-2 text-sm" value={need} onChange={(e) => setNeed(e.currentTarget.value)}>
        {needs.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
      </select>
      <ul className="m-0 mt-3 grid list-none gap-2 p-0 sm:grid-cols-2" role="status">
        {controls.map((c) => {
          const lit = item.answer.includes(c.id)
          return (
            <li key={c.id} className="dg-box text-sm" data-tone={lit ? 'focus' : 'dim'}>
              <p className="m-0 font-semibold">{lit ? '✓ ' : ''}{c.name}</p>
              <p className="m-0 mt-0.5">{c.does}</p>
              <p className="m-0 mt-0.5 text-xs text-ink-soft">Não basta: {c.notEnough}</p>
            </li>
          )
        })}
      </ul>
    </DiagramShell>
  )
}

/* 22.3 — responsabilidade compartilhada em GenAI */

type Option = 'ec2' | 'sagemaker' | 'bedrock'

const rows: readonly { label: string; owner: Record<Option, 'aws' | 'you'> }[] = [
  { label: 'Data center, hardware e rede física', owner: { ec2: 'aws', sagemaker: 'aws', bedrock: 'aws' } },
  { label: 'Sistema operacional e patches', owner: { ec2: 'you', sagemaker: 'aws', bedrock: 'aws' } },
  { label: 'Servidor de inferência e escala', owner: { ec2: 'you', sagemaker: 'you', bedrock: 'aws' } },
  { label: 'Escolha e versão do modelo', owner: { ec2: 'you', sagemaker: 'you', bedrock: 'you' } },
  { label: 'Dados, prompts e retenção', owner: { ec2: 'you', sagemaker: 'you', bedrock: 'you' } },
  { label: 'Identidade, permissões e configuração', owner: { ec2: 'you', sagemaker: 'you', bedrock: 'you' } },
  { label: 'Avaliar outputs e governar o uso', owner: { ec2: 'you', sagemaker: 'you', bedrock: 'you' } },
]

export function SharedResponsibilityAiDiagram() {
  const [option, setOption] = useState<Option>('bedrock')
  const yours = rows.filter((r) => r.owner[option] === 'you').length
  return (
    <DiagramShell
      label="Responsabilidade compartilhada para modelos em EC2, SageMaker AI e Bedrock"
      kicker="Responsabilidade compartilhada"
      title="Quanto mais gerenciado, menos você opera — nunca zero"
      lead="Troque a forma de hospedar o modelo e veja as linhas que mudam de dono."
      limits="Simplificação: SageMaker AI tem modos com níveis diferentes de gestão. O ponto da prova é que dados, acesso e governança continuam com o cliente em qualquer opção."
    >
      <Choices label="Como o modelo roda" options={[{ id: 'ec2', label: 'Modelo próprio em EC2' }, { id: 'sagemaker', label: 'Endpoint SageMaker AI' }, { id: 'bedrock', label: 'API do Amazon Bedrock' }]} value={option} onChange={setOption} />
      <ol className="m-0 grid list-none gap-1 p-0">
        {rows.map((r) => {
          const aws = r.owner[option] === 'aws'
          return (
            <li key={r.label} className="dg-box flex items-center justify-between gap-2 text-sm" data-tone={aws ? 'warn' : 'focus'}>
              <span>{r.label}</span>
              <strong className="text-xs uppercase tracking-wide">{aws ? 'AWS' : 'Você'}</strong>
            </li>
          )
        })}
      </ol>
      <Callout tone="focus" title={`${yours} de ${rows.length} linhas ficam com você`} live>
        {option === 'bedrock'
          ? 'Mesmo consumindo um FM por API, você decide quem acessa, que dados envia, quanto tempo retém e como avalia as respostas.'
          : option === 'sagemaker'
            ? 'A AWS cuida da infraestrutura gerenciada; você ainda opera o endpoint, a escala e o modelo.'
            : 'Em EC2, até patches do sistema e o servidor de inferência são seus.'}
      </Callout>
    </DiagramShell>
  )
}
