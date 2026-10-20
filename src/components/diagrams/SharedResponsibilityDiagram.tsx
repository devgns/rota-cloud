import { useState } from 'react'
import { DiagramShell } from './kit'

type Party = 'AWS' | 'Cliente' | 'Compartilhado'
type ServiceId = 'onprem' | 'ec2' | 'rds' | 's3' | 'fargate' | 'lambda'
type RowId = 'hardware' | 'platform' | 'os' | 'runtime' | 'app' | 'data' | 'identity'

interface Cell {
  party: Party
  text: string
}

interface ServiceColumn {
  id: ServiceId
  label: string
}

interface MatrixRow {
  id: RowId
  label: string
}

const services: readonly ServiceColumn[] = [
  { id: 'onprem', label: 'On-premises' },
  { id: 'ec2', label: 'EC2' },
  { id: 'rds', label: 'RDS' },
  { id: 's3', label: 'S3' },
  { id: 'fargate', label: 'Fargate' },
  { id: 'lambda', label: 'Lambda' },
]

const rows: readonly MatrixRow[] = [
  { id: 'hardware', label: 'Hardware e instalações' },
  { id: 'platform', label: 'Virtualização ou plataforma' },
  { id: 'os', label: 'Sistema operacional guest' },
  { id: 'runtime', label: 'Runtime/engine' },
  { id: 'app', label: 'Código da aplicação' },
  { id: 'data', label: 'Dados' },
  { id: 'identity', label: 'Identidade e políticas' },
]

const matrix: Record<ServiceId, Record<RowId, Cell>> = {
  onprem: {
    hardware: { party: 'Cliente', text: 'No data center próprio, servidores, energia, refrigeração e segurança física são seus.' },
    platform: { party: 'Cliente', text: 'Se houver hipervisor, a sua equipe instala, atualiza e opera.' },
    os: { party: 'Cliente', text: 'Instalação, patch e hardening do sistema operacional.' },
    runtime: { party: 'Cliente', text: 'Linguagens, bibliotecas, bancos e middleware.' },
    app: { party: 'Cliente', text: 'Código, configuração e deploy.' },
    data: { party: 'Cliente', text: 'Dados, cópias e classificação.' },
    identity: { party: 'Cliente', text: 'Diretório, contas e regras de acesso.' },
  },
  ec2: {
    hardware: { party: 'AWS', text: 'A AWS opera data centers, energia e o servidor físico.' },
    platform: { party: 'AWS', text: 'A AWS opera o hipervisor. Você recebe a instância.' },
    os: { party: 'Cliente', text: 'Você escolhe a AMI, aplica patches e endurece o SO convidado.' },
    runtime: { party: 'Cliente', text: 'Você instala e atualiza runtimes e agentes na instância.' },
    app: { party: 'Cliente', text: 'Código, configuração e deploy da aplicação são seus.' },
    data: { party: 'Cliente', text: 'Dados no disco, classificação e o que acontece se o volume for apagado.' },
    identity: { party: 'Compartilhado', text: 'A AWS opera o IAM. Você cria roles, policies, instance profiles e usuários do SO.' },
  },
  rds: {
    hardware: { party: 'AWS', text: 'A AWS opera o hardware por baixo do serviço gerenciado.' },
    platform: { party: 'AWS', text: 'A plataforma do banco é operada pela AWS. Você não administra esse host.' },
    os: { party: 'AWS', text: 'No RDS padrão o SO guest não fica com você. Dados, credenciais e acesso continuam seus. RDS Custom fica fora desta célula.' },
    runtime: { party: 'AWS', text: 'A AWS opera o engine. Você segue responsável pelos dados, pelas credenciais e pela configuração de acesso, inclusive parameter groups que você define.' },
    app: { party: 'Cliente', text: 'Esquema, SQL e a aplicação que usa o banco são seus. A AWS não modela os seus dados.' },
    data: { party: 'Cliente', text: 'Os dados são seus. Operar o engine não transfere propriedade, backup lógico que você precisa, nem classificação.' },
    identity: { party: 'Cliente', text: 'Você define usuários do banco, senhas, autenticação e quem pode conectar. A AWS oferece os mecanismos.' },
  },
  s3: {
    hardware: { party: 'AWS', text: 'A AWS opera a infraestrutura física do serviço.' },
    platform: { party: 'AWS', text: 'A AWS opera a infraestrutura do S3. Você não recebe um servidor para administrar.' },
    os: { party: 'AWS', text: 'Não há SO guest entregue a você. A AWS opera os hosts do serviço. Dados, policies e configuração do bucket continuam seus.' },
    runtime: { party: 'AWS', text: 'A AWS opera o serviço. Você define configuração, criptografia escolhida e policies.' },
    app: { party: 'Cliente', text: 'A aplicação que grava e lê objetos, e a organização desses objetos, são suas.' },
    data: { party: 'Cliente', text: 'Os objetos são seus. Versionamento, replicação e ciclo de vida que você configura também.' },
    identity: { party: 'Cliente', text: 'Bucket policy, IAM, Block Public Access e chaves são configuração sua. Serviço gerenciado não apaga essa responsabilidade.' },
  },
  fargate: {
    hardware: { party: 'AWS', text: 'A AWS opera o hardware que executa a task.' },
    platform: { party: 'AWS', text: 'A plataforma sobe a task sem você gerir instâncias do cluster.' },
    os: { party: 'AWS', text: 'Não há SO guest do Fargate para corrigir. A imagem, os dados e as permissões continuam com você.' },
    runtime: { party: 'Compartilhado', text: 'A AWS executa a task. O runtime dentro da imagem é seu.' },
    app: { party: 'Cliente', text: 'Imagem, task definition e o processo da aplicação são seus.' },
    data: { party: 'Cliente', text: 'Dados que a task usa são seus, mesmo com o host gerenciado.' },
    identity: { party: 'Compartilhado', text: 'A AWS opera o IAM. Você escreve task role, execution role e as policies.' },
  },
  lambda: {
    hardware: { party: 'AWS', text: 'A AWS opera a infraestrutura que executa a função.' },
    platform: { party: 'AWS', text: 'A plataforma de invocação é da AWS. Os servidores existem sob essa operação.' },
    os: { party: 'AWS', text: 'Não há SO guest para você corrigir. Código, dependências, dados e permissões continuam seus.' },
    runtime: { party: 'Compartilhado', text: 'A AWS atualiza o runtime gerenciado. Você escolhe o runtime, o código e as dependências. Em runtime customizado, a sua parte cresce.' },
    app: { party: 'Cliente', text: 'Código da função, pacote e configuração são seus.' },
    data: { party: 'Cliente', text: 'Dados que a função lê e grava são seus.' },
    identity: { party: 'Compartilhado', text: 'A AWS opera o IAM. Você define a execution role e as policies. Isso não sai da sua responsabilidade.' },
  },
}

const partyStyle: Record<Party, string> = {
  AWS: 'bg-navy text-paper border-navy',
  Cliente: 'bg-amber-soft text-ink border-amber',
  Compartilhado: 'text-ink border-ink-soft',
}

const sharedBackground = {
  backgroundImage: 'linear-gradient(135deg, var(--color-navy-wash) 50%, var(--color-amber-soft) 50%)',
}

const short: Record<Party, string> = { AWS: 'AWS', Cliente: 'Cliente', Compartilhado: 'Ambos' }

export function SharedResponsibilityDiagram() {
  const [serviceId, setServiceId] = useState<ServiceId>('rds')
  const [rowId, setRowId] = useState<RowId>('os')
  const service = services.find((item) => item.id === serviceId)
  const row = rows.find((item) => item.id === rowId)
  const cell = matrix[serviceId][rowId]
  const customerRows = rows.filter((item) => matrix[serviceId][item.id].party !== 'AWS').length

  return (
    <DiagramShell
      label="Matriz de responsabilidade compartilhada por serviço"
      kicker="Responsabilidade compartilhada"
      title="A fronteira desce conforme o serviço fica mais gerenciado"
      lead="Da esquerda para a direita, a AWS assume mais camadas. Dados e identidade nunca mudam de lado. Clique numa célula para ver o detalhe."
      limits="Uma célula resume decisões que, na conta real, envolvem criptografia, rede e o recurso específico. RDS Custom, EKS e runtimes customizados de Lambda deslocam a fronteira e ficam de fora."
    >
      <div className="diagram-canvas">
        <table className="w-full min-w-[36rem] border-separate border-spacing-1 text-left text-sm">
          <thead>
            <tr>
              <th scope="col" className="p-1 text-xs font-semibold text-ink-soft">Camada</th>
              {services.map((item) => (
                <th key={item.id} scope="col" className={`rounded p-1 text-center text-xs font-semibold ${item.id === serviceId ? 'bg-navy-wash' : ''}`}>
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((matrixRow) => (
              <tr key={matrixRow.id}>
                <th scope="row" className={`rounded p-1 pr-2 text-xs font-semibold ${matrixRow.id === rowId ? 'bg-navy-wash' : ''}`}>
                  {matrixRow.label}
                </th>
                {services.map((item) => {
                  const entry = matrix[item.id][matrixRow.id]
                  const selected = item.id === serviceId && matrixRow.id === rowId
                  return (
                    <td key={item.id} className="p-0">
                      <button
                        type="button"
                        className={`w-full cursor-pointer rounded border px-1 py-1.5 text-center text-xs font-semibold ${partyStyle[entry.party]} ${selected ? 'outline-2 outline-offset-1 outline-amber' : ''}`}
                        style={entry.party === 'Compartilhado' ? sharedBackground : undefined}
                        aria-current={selected ? true : undefined}
                        aria-label={`${item.label}, ${matrixRow.label}: ${entry.party}`}
                        onClick={() => {
                          setServiceId(item.id)
                          setRowId(matrixRow.id)
                        }}
                      >
                        {short[entry.party]}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft" aria-hidden="true">
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm bg-navy" /> AWS opera</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm border border-amber bg-amber-soft" /> cliente opera</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm border border-ink-soft" style={sharedBackground} /> dividido</span>
      </div>
      <div className="mt-3 rounded-md border border-line bg-paper px-3 py-2 text-sm" role="status">
        <p className="m-0 font-semibold">
          {service?.label} · {row?.label}: {cell.party}
        </p>
        <p className="m-0 mt-1">{cell.text}</p>
        <p className="m-0 mt-2 text-xs text-ink-soft">
          Em {service?.label}, o cliente ainda participa de {customerRows} de {rows.length} camadas.
        </p>
      </div>
    </DiagramShell>
  )
}
