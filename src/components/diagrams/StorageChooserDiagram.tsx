import type { ReactNode } from 'react'
import { DiagramShell, ScenarioQuiz, type QuizOption, type QuizScenario } from './kit'

type Store = 's3' | 'ebs' | 'instance' | 'efs' | 'fsx'

const options: readonly QuizOption<Store>[] = [
  { id: 's3', label: 'S3', role: 'objetos acessados por API, sem disco montado; durável e independente de instância.' },
  { id: 'ebs', label: 'EBS', role: 'disco de bloco persistente de uma instância, na mesma AZ.' },
  { id: 'instance', label: 'Instance store', role: 'disco local e efêmero da instância: rápido, mas some no stop ou terminate.' },
  { id: 'efs', label: 'EFS', role: 'sistema de arquivos NFS montado por muitas instâncias ou tasks, em várias AZs.' },
  { id: 'fsx', label: 'FSx', role: 'sistemas de arquivos especializados: Windows (SMB), Lustre, NetApp ONTAP, OpenZFS.' },
]

const scenarios: readonly QuizScenario<Store>[] = [
  { id: 'st1', prompt: 'Relatórios CSV gerados todo dia, baixados por link temporário e guardados por anos.', answer: 's3', why: 'Objeto acessado por API/URL, sem servidor no meio e com classes para envelhecer: S3.' },
  { id: 'st2', prompt: 'Disco de boot e dados de um PostgreSQL autogerenciado numa instância EC2.', answer: 'ebs', why: 'Volume de bloco persistente, anexado a uma instância: EBS.' },
  { id: 'st3', prompt: 'Doze tasks em duas AZs precisam ler e gravar os mesmos arquivos por NFS.', answer: 'efs', why: 'Sistema de arquivos compartilhado, montado ao mesmo tempo por muitos computadores em várias AZs: EFS.' },
  { id: 'st4', prompt: 'Compartilhamento de arquivos SMB integrado ao Active Directory para estações Windows.', answer: 'fsx', why: 'Protocolo SMB com AD é o FSx for Windows File Server.' },
  { id: 'st5', prompt: 'Área de rascunho temporária de altíssimo desempenho, que pode ser recriada se sumir.', answer: 'instance', why: 'Dado descartável e muito rápido cabe no instance store — nunca como única cópia de algo importante.' },
  { id: 'st6', prompt: 'Cluster de HPC precisa de um sistema de arquivos paralelo de alto throughput.', answer: 'fsx', why: 'Alto desempenho paralelo para HPC é o FSx for Lustre.' },
  { id: 'st7', prompt: 'Imagens enviadas por usuários, servidas pelo CloudFront para o mundo inteiro.', answer: 's3', why: 'Arquivos estáticos como origem do CloudFront: S3.' },
]

const box = 'fill-paper stroke-ink-soft'
const pictos: Record<Store, ReactNode> = {
  s3: (
    <>
      <rect x={4} y={14} width={34} height={24} rx={4} className={box} />
      <text x={21} y={30} fontSize={9} textAnchor="middle">app</text>
      <line x1={38} y1={26} x2={64} y2={26} className="stroke-ink-soft" strokeDasharray="3 2" />
      <text x={51} y={20} fontSize={8} textAnchor="middle" className="dg-soft">API</text>
      <path d="M66 12 h40 l-4 30 h-32 z" className="fill-navy-wash stroke-navy" />
      {[74, 84, 94].map((x) => <circle key={x} cx={x} cy={26} r={3} className="fill-navy" />)}
    </>
  ),
  ebs: (
    <>
      <rect x={10} y={12} width={40} height={28} rx={4} className={box} />
      <text x={30} y={30} fontSize={9} textAnchor="middle">EC2</text>
      <line x1={50} y1={26} x2={70} y2={26} className="stroke-navy" strokeWidth={2} />
      <ellipse cx={86} cy={16} rx={14} ry={4} className="fill-navy-wash stroke-navy" />
      <path d="M72 16 v20 a14 4 0 0 0 28 0 v-20" className="fill-navy-wash stroke-navy" />
    </>
  ),
  instance: (
    <>
      <rect x={20} y={6} width={70} height={40} rx={4} className={box} />
      <text x={55} y={20} fontSize={9} textAnchor="middle">EC2</text>
      <rect x={38} y={26} width={34} height={14} rx={3} className="fill-amber-soft stroke-amber" strokeDasharray="3 2" />
    </>
  ),
  efs: (
    <>
      {[4, 40, 76].map((x) => <rect key={x} x={x} y={4} width={30} height={16} rx={3} className={box} />)}
      {[19, 55, 91].map((x) => <line key={x} x1={x} y1={20} x2={55} y2={32} className="stroke-navy" />)}
      <rect x={30} y={32} width={50} height={16} rx={3} className="fill-navy-wash stroke-navy" />
      <text x={55} y={44} fontSize={9} textAnchor="middle">NFS</text>
    </>
  ),
  fsx: (
    <>
      {['SMB', 'Lustre', 'ONTAP'].map((t, i) => (
        <g key={t}>
          <rect x={4 + i * 36} y={16} width={32} height={20} rx={3} className="fill-navy-wash stroke-navy" />
          <text x={20 + i * 36} y={30} fontSize={8} textAnchor="middle">{t}</text>
        </g>
      ))}
    </>
  ),
}

const traits: Record<Store, string> = {
  s3: 'objeto · API · regional',
  ebs: 'bloco · 1 instância · 1 AZ',
  instance: 'bloco local · efêmero',
  efs: 'arquivo · muitos · multi-AZ',
  fsx: 'arquivo especializado',
}

export function StorageChooserDiagram() {
  return (
    <DiagramShell
      label="Escolha entre S3, EBS, instance store, EFS e FSx pelo jeito de acessar o dado"
      kicker="Armazenamento"
      title="Objeto, bloco ou arquivo?"
      lead="O primeiro filtro é como o dado é acessado: por API, como disco de uma máquina ou como pasta compartilhada. Classifique os cenários."
      limits="EBS Multi-Attach existe em tipos específicos e fica fora deste caso comum. Classes do S3 aparecem no diagrama de lifecycle, mais acima no capítulo."
    >
      <ScenarioQuiz
        label="Armazenamento"
        scenarios={scenarios}
        options={options}
        visual={({ scenario, picked }) => (
          <ul className="m-0 grid min-w-[30rem] list-none grid-cols-5 gap-1.5 p-0">
            {options.map((item) => {
              const tone = picked === undefined ? 'plain' : item.id === scenario.answer ? 'ok' : item.id === picked ? 'bad' : 'dim'
              return (
                <li key={item.id} className="dg-box px-1.5 text-center" data-tone={tone}>
                  <svg viewBox="0 0 110 50" className="diagram-svg mx-auto" aria-hidden="true">
                    {pictos[item.id]}
                  </svg>
                  <span className="mt-1 block text-sm font-semibold">{item.label}</span>
                  <span className="block text-[0.7rem] leading-tight text-ink-soft">{traits[item.id]}</span>
                </li>
              )
            })}
          </ul>
        )}
      />
    </DiagramShell>
  )
}
