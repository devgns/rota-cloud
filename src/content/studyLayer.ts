import type { Domain } from '@/lib/types'

export type EditorialNote = {
  id: string
  sectionId: string
  kind: 'complemento' | 'comparativo' | 'atualizacao'
  title: string
  paragraphs: string[]
  comparison?: { headers: [string, string, string]; rows: [string, string, string][] }
  cues?: string[]
  href?: string
  hrefLabel?: string
}

export const EDITORIAL_NOTES: EditorialNote[] = [
  {
    id: 'note-s3-50tb',
    sectionId: 'c13-13-1-amazon-s3-armazenamento-de-objetos',
    kind: 'atualizacao',
    title: 'Tamanho máximo de objeto',
    paragraphs: [
      'A apostila não fixa o limite antigo de 5 TB. Em 2 de dezembro de 2025, a AWS anunciou objetos de até 50 TB em todas as classes S3. O número não é tema central da CLF-C02; se aparecer material antigo, não o trate como cota vigente.',
    ],
    href: 'https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-s3-maximum-object-size-50-tb/',
    hrefLabel: 'Anúncio AWS de 2 dez 2025',
  },
  {
    id: 'note-one-zone',
    sectionId: 'c13-classes-de-armazenamento-s3',
    kind: 'comparativo',
    title: 'Durabilidade e resiliência não são a mesma frase',
    paragraphs: [
      'One Zone-IA guarda o objeto em uma única AZ. A durabilidade projetada da classe não equivale à resiliência de uma classe multi-AZ se aquela AZ deixar de estar disponível. O diagrama de lifecycle, mais abaixo, mostra o objeto descendo de classe com a idade.',
    ],
  },
  {
    id: 'note-pillars',
    sectionId: 'c04-4-1-os-seis-pilares',
    kind: 'atualizacao',
    title: 'Seis pilares, incluindo sustentabilidade',
    paragraphs: [
      'O guia atual do Well-Architected Framework lista excelência operacional, segurança, confiabilidade, eficiência de performance, otimização de custos e sustentabilidade. Material que mostre só cinco pilares está desatualizado.',
    ],
    href: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html',
    hrefLabel: 'Pilares do Well-Architected',
  },
  {
    id: 'note-free-tier',
    sectionId: 'c19-19-10-aws-free-tier-versao-atualizada',
    kind: 'atualizacao',
    title: 'Free Tier conferido em outubro de 2026',
    paragraphs: [
      'A FAQ oficial descreve, para clientes novos, até US$ 200 em créditos e um plano gratuito de até 6 meses ou até os créditos acabarem, além de ofertas Always Free. Expiração e elegibilidade mudam conforme o plano e a data da conta. Não use tabela antiga de “12 meses para tudo”.',
    ],
    href: 'https://aws.amazon.com/free/free-tier-faqs/',
    hrefLabel: 'FAQ do AWS Free Tier',
  },
  {
    id: 'note-sg-nacl',
    sectionId: 'c12-12-4-security-groups-versus-network-acls',
    kind: 'comparativo',
    title: 'Por que a resposta volta num e trava no outro',
    paragraphs: [
      'Os dois filtram tráfego de rede, em lugares diferentes. O security group fica na interface de rede do recurso: só o que está associado a ele passa por essas regras. A network ACL fica na fronteira da subnet: todo recurso dentro dela atravessa a NACL, esteja ou não ligado a um security group.',
      'Stateful quer dizer que o firewall acompanha a conexão. Se o security group deixou o pedido entrar, a resposta daquela mesma conexão sai sozinha, mesmo que nenhuma regra de saída mencione a porta da volta. Liberar HTTP na entrada não exige uma regra de saída espelhada para o cliente receber a página.',
      'Stateless quer dizer que cada pacote é julgado isolado. Liberar a entrada na NACL não autoriza a saída. A ida e a volta são duas regras. O detalhe que costuma faltar: o navegador chama a porta 80 ou 443 do servidor, mas espera a resposta numa porta alta, sorteada na hora, a porta efêmera. A NACL vê esse pacote de volta como tráfego novo, saindo da subnet rumo a essa porta alta. Sem uma regra de saída que cubra a faixa, o pedido entra e a página não volta. Na prática de prova, essa faixa é tratada como 1024–65535, porque o intervalo exato depende do sistema do cliente.',
      'O security group só escreve allow. O que não casa com nenhuma regra é negado, e todas as regras são consideradas juntas: não há um número em que a primeira regra encerre a decisão. A NACL escreve allow e deny, em ordem numérica, e para na primeira que casa. Um deny com número menor vence um allow mais abaixo. Por isso um IP de origem malicioso se bloqueia na NACL: o security group não tem como dizer “esse endereço, não”.',
      'No dia a dia, o security group é o controle por recurso: SSH a partir de um bastion, HTTPS no balanceador, banco apenas a partir do security group da API. A NACL é a cerca da subnet, útil quando a restrição vale para tudo que está ali, sobretudo um bloqueio explícito antes de o tráfego chegar às instâncias.',
    ],
    comparison: {
      headers: ['', 'Security group', 'Network ACL'],
      rows: [
        ['Onde atua', 'Interface de rede do recurso', 'Borda da subnet'],
        ['Memória da conexão', 'Stateful: a resposta permitida volta sozinha', 'Stateless: ida e volta são regras separadas'],
        ['O que se escreve', 'Só allow; o resto é negado', 'Allow e deny'],
        ['Como decide', 'Avalia o conjunto de regras', 'Ordem numérica; para no primeiro match'],
        ['Quem é afetado', 'Só os recursos associados', 'Tudo dentro da subnet'],
      ],
    },
    cues: [
      'Bloquear um endereço IP de origem: Network ACL. Security group não tem deny.',
      'O pedido entra e a resposta não sai por falta de regra de saída: a NACL está stateless e a saída, em geral a porta efêmera, não foi liberada.',
      'Segurança na interface de rede da instância: security group.',
    ],
    href: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html#nacl-ephemeral-ports',
    hrefLabel: 'Portas efêmeras na documentação de NACL',
  },
]

const OBJECTIVES: Record<string, string[]> = {
  'chapter-01': ['Explicar o formato da CLF-C02 e os pesos dos quatro domínios.', 'Escolher um método de estudo que separe reconhecimento de compreensão.'],
  'chapter-02': ['Distinguir escalabilidade de elasticidade.', 'Ler numa curva de demanda a diferença entre capacidade fixa e elástica.'],
  'chapter-03': ['Diferenciar Região, AZ e edge location.', 'Relacionar RTO e RPO com uma estratégia de DR, sem tratar números como SLA.'],
  'chapter-04': ['Nomear os seis pilares do Well-Architected, incluindo sustentabilidade.', 'Não trocar pilares da workload pelas perspectivas do CAF.'],
  'chapter-05': ['Contrastar CAPEX e OPEX e reconhecer as seis perspectivas do CAF.', 'Associar os 7 Rs a intenções de migração, não a um serviço único.'],
  'chapter-06': ['Dizer o que continua sendo do cliente em EC2, RDS, S3, Fargate e Lambda.', 'Separar responsabilidade por dados e políticas da operação da infraestrutura.'],
  'chapter-07': ['Ler um Allow e um Deny sem confundir autenticação com autorização.', 'Escolher IAM role, Identity Center ou Cognito conforme quem precisa de acesso.'],
  'chapter-08': ['Distinguir criptografia em trânsito e em repouso e o papel do KMS.', 'Reconhecer quando a pergunta é sobre conformidade, não sobre um produto de rede.'],
  'chapter-09': ['Encaminhar a evidência certa para CloudTrail, CloudWatch ou Config.', 'Separar WAF, Shield, GuardDuty, Inspector e Macie pela pergunta que cada um responde.'],
  'chapter-10': ['Separar console, CLI, SDK e CloudFormation.', 'Reconhecer infraestrutura como código sem decorar sintaxe.'],
  'chapter-11': ['Escolher EC2, contêiner em EC2, Fargate ou Lambda pelo que você ainda administra.', 'Diferenciar balanceamento de auto scaling.'],
  'chapter-12': ['Acompanhar uma requisição da internet até o banco e apontar o salto que falha.', 'Explicar por que NACL exige regra de retorno e Security Group não.'],
  'chapter-13': ['Escolher S3, EBS, EFS ou FSx pelo padrão de acesso.', 'Escolher classe S3 sem confundir acesso infrequente com resiliência de uma AZ.'],
  'chapter-14': ['Decidir entre relacional, NoSQL, cache e analytics pelo padrão de consulta.', 'Não tratar read replica como substituto de Multi-AZ.'],
  'chapter-15': ['Separar métrica, trilha de API e conformidade de configuração.', 'Reconhecer X-Ray, Trusted Advisor e ferramentas de desenvolvedor pelo problema.'],
  'chapter-16': ['Dizer quem entrega, quem consome e se o mecanismo é fila, fan-out, barramento, stream ou estado.', 'Não chamar todos de “serviço de mensagem”.'],
  'chapter-17': ['Reconhecer o serviço de analytics ou ML pela tarefa, não pelo nome isolado.', 'Distinguir warehouse, consulta no S3 e streaming.'],
  'chapter-18': ['Usar o catálogo como dicionário reverso: finalidade e serviço parecido.', 'Lembrar que estar no escopo não significa a mesma incidência na prova.'],
  'chapter-19': ['Escolher modelo de compra EC2 pela interrupção, pelo compromisso e pela capacidade.', 'Tratar números de preço do capítulo como hipotéticos.'],
  'chapter-20': ['Diferenciar planos de suporte, documentação, parceiros e AWS Health.', 'Não copiar tabela antiga de suporte ou de Free Tier.'],
  'chapter-21': ['Ler um caso e nomear o serviço que resolve cada restrição.', 'Justificar a escolha com trade-off, não só com definição.'],
  'chapter-22': ['Desarmar pegadinhas de pares que a prova aproxima de propósito.', 'Explicar a alternativa errada, não só marcar a certa.'],
  'chapter-23': ['Resolver as 80 questões no modo interativo, sem olhar o gabarito antes.', 'Usar o texto deste capítulo como fonte do comentário, não como cola durante o simulado.'],
  'chapter-24': ['Revisar os 132 cartões revelando o verso só depois de tentar responder.', 'Usar Errei, Hesitei e Sei para agendar a próxima revisão.'],
  'chapter-25': ['Transformar o cronograma em sessões reais de leitura, treino e revisão.', 'Separar “li a seção” de “consigo explicar”.'],
  'chapter-26': ['Localizar a fonte oficial quando um fato puder ter mudado.', 'Fechar lacunas de domínio sem ignorar o peso menor do domínio 4.'],
}

export function objectivesFor(chapterId: string): string[] {
  return OBJECTIVES[chapterId] ?? []
}

export type ExtraQuestion = {
  id: string
  chapterId: string
  prompt: string
  choices: string[]
  correctIndex: number
  explanation: string
}

export const EXTRA_QUESTIONS: ExtraQuestion[] = [
  {
    id: 'EXTRA-01',
    chapterId: 'chapter-02',
    prompt: 'Uma API web precisa ficar no ar o dia inteiro e o time quer controlar o sistema operacional. Qual descrição cabe melhor?',
    choices: ['Lambda, porque não há servidor', 'EC2, porque o guest OS continua com o cliente', 'S3, porque guarda a aplicação', 'CloudFront, porque aproxima a API do usuário'],
    correctIndex: 1,
    explanation: 'EC2 entrega uma VM. Lambda e Fargate abstraem o host de outro jeito; nenhum dos dois significa “não existe servidor”.',
  },
  {
    id: 'EXTRA-02',
    chapterId: 'chapter-03',
    prompt: 'O negócio aceita ficar quatro horas fora e perder o dia de alterações. Qual leitura é a mais cuidadosa?',
    choices: ['Multi-site é obrigatório porque RPO zero é padrão', 'Backup and restore pode ser candidato, e o número não é um SLA da AWS', 'Uma AZ extra zera o RPO', 'Edge location substitui a Região de DR'],
    correctIndex: 1,
    explanation: 'RTO alto e RPO amplo combinam com reconstrução a partir de backup. A sugestão é didática, não uma garantia de tempo da AWS.',
  },
  {
    id: 'EXTRA-03',
    chapterId: 'chapter-06',
    prompt: 'Quem continua responsável pelos dados em um bucket S3?',
    choices: ['Somente a AWS, porque S3 é gerenciado', 'O cliente, incluindo acesso, classificação e configuração', 'O Security Group do bucket', 'O edge location que cacheou o objeto'],
    correctIndex: 1,
    explanation: 'Serviço gerenciado não transfere a responsabilidade pelos dados e pelas políticas de acesso do cliente.',
  },
  {
    id: 'EXTRA-04',
    chapterId: 'chapter-07',
    prompt: 'Há Allow para s3:GetObject e um Deny explícito aplicável ao mesmo objeto. Qual é o resultado didático?',
    choices: ['Allow vence por ser mais específico', 'Deny explícito prevalece sobre o Allow', 'A trust policy libera mesmo assim', 'O Cognito ignora o Deny'],
    correctIndex: 1,
    explanation: 'No modelo simplificado, Deny explícito vence. A trust policy não substitui a permission policy.',
  },
  {
    id: 'EXTRA-05',
    chapterId: 'chapter-09',
    prompt: 'Você precisa saber qual principal chamou a API que alterou um Security Group. Onde procurar primeiro?',
    choices: ['CloudWatch, pela métrica de CPU', 'CloudTrail, pelo evento de API', 'Macie, pelo dado sensível', 'Shield, pelo DDoS'],
    correctIndex: 1,
    explanation: 'A pergunta é de auditoria de API. CloudWatch falaria de comportamento operacional; Config, do estado do recurso.',
  },
  {
    id: 'EXTRA-06',
    chapterId: 'chapter-12',
    prompt: 'A API está em subnet privada, o Security Group libera a porta e mesmo assim a internet não inicia conexão com ela. Por quê?',
    choices: ['Falta apenas um Deny no NACL', 'Liberar o Security Group não cria rota pelo IGW nem endereço alcançável', 'IAM bloqueia pacotes TCP', 'O NAT Gateway torna a subnet pública'],
    correctIndex: 1,
    explanation: 'Firewall não inventa rota nem IP público. Subnet privada não passa a ser pública porque o Security Group abriu uma porta.',
  },
  {
    id: 'EXTRA-07',
    chapterId: 'chapter-13',
    prompt: 'Vários servidores precisam do mesmo sistema de arquivos NFS. Qual serviço combina com essa frase?',
    choices: ['EBS', 'EFS', 'S3 Glacier', 'DynamoDB'],
    correctIndex: 1,
    explanation: 'EBS é volume de bloco visto por uma instância. EFS é arquivo compartilhado. S3 é objeto via API.',
  },
  {
    id: 'EXTRA-08',
    chapterId: 'chapter-14',
    prompt: 'A mesma leitura de um produto é feita milhares de vezes por minuto e pode expirar. O que alivia o banco?',
    choices: ['Trocar o RDS por CloudTrail', 'ElastiCache na frente do banco', 'Um NACL stateful', 'Savings Plans'],
    correctIndex: 1,
    explanation: 'Cache em memória reduz leituras repetidas. Não é o banco definitivo nem um serviço de auditoria.',
  },
  {
    id: 'EXTRA-09',
    chapterId: 'chapter-16',
    prompt: 'Um pedido precisa acordar vários destinos ao mesmo tempo. Qual mecanismo descreve isso melhor?',
    choices: ['SQS com um consumidor', 'SNS pub/sub', 'EBS snapshot', 'IAM policy'],
    correctIndex: 1,
    explanation: 'SNS faz fan-out. SQS desacopla um trabalho que o consumidor busca. Não são sinônimos.',
  },
  {
    id: 'EXTRA-10',
    chapterId: 'chapter-19',
    prompt: 'Um lote pode parar no meio e recomeçar. Os créditos fictícios do Spot são menores. O que falta decidir?',
    choices: ['Se a interrupção é aceitável; o menor número não é preço real nem decisão automática', 'Comprar Dedicated Host porque é sempre mais barato', 'Usar edge location para reduzir a interrupção', 'Tratar Capacity Reservation como desconto'],
    correctIndex: 0,
    explanation: 'Spot pode ser interrompido. Capacity Reservation trata de capacidade, não de desconto. Os valores do laboratório são hipotéticos.',
  },
]

export function extrasForChapter(chapterId: string): ExtraQuestion[] {
  return EXTRA_QUESTIONS.filter((question) => question.chapterId === chapterId)
}

export function noteForSection(sectionId: string): EditorialNote | undefined {
  return EDITORIAL_NOTES.find((note) => note.sectionId === sectionId)
}

export const MODULE_BLURB: Record<string, string> = {
  intro: 'Como a prova está organizada e como estudar sem transformar o capítulo em cartão.',
  fundamentos: 'Nuvem, falha, pilares e a economia que explica as escolhas.',
  seguranca: 'Quem protege o quê, identidade, criptografia e detecção.',
  construcao: 'Compute, rede, armazenamento e dados de uma aplicação.',
  integracao: 'Operação, mensagens, analytics e o catálogo para consulta.',
  custos: 'Como se paga e onde pedir ajuda, com números hipotéticos separados de fato.',
  revisao: 'Caso, pegadinhas, 80 questões, 132 cartões, laboratório e fontes.',
}

export function domainLabel(domain: Domain): string {
  const labels = {
    1: 'D1 Conceitos de nuvem',
    2: 'D2 Segurança e conformidade',
    3: 'D3 Tecnologia e serviços',
    4: 'D4 Faturamento, preços e suporte',
  }
  return labels[domain]
}
