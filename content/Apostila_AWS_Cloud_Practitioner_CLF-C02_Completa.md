# AWS Certified Cloud Practitioner (CLF-C02)
## Apostila completa de estudo — fundamentos, arquitetura, serviços, segurança, custos e prática

**Edição:** 9 de outubro de 2026  
**Idioma:** português brasileiro (com nomenclatura AWS em inglês)  
**Base:** guia oficial do exame CLF-C02, domínio 1 (24%), domínio 2 (30%), domínio 3 (34%) e domínio 4 (12%).  
**Objetivo:** compreender o funcionamento e as decisões por trás da nuvem AWS — não apenas memorizar a descrição dos serviços.

> **Como ler esta apostila:** capítulos assinalados como **[ESSENCIAL]** merecem atenção máxima. Capítulos **[APROFUNDAMENTO]** ajudam você a entender *por que* as respostas da prova fazem sentido. Nos serviços menos frequentes, o objetivo é saber reconhecer a finalidade e a diferença em relação a serviços próximos.
>
> **Aviso de atualização:** a AWS muda nomes, planos, funcionalidades e preços. Esta apostila foi conferida com o guia CLF-C02 e a documentação oficial em outubro de 2026. A lista de serviços em escopo **não é exaustiva**, e o exame não divulga a incidência exata de cada serviço. **Destaque especial:** os planos de AWS Support estão passando por mudanças durante 2026–2027; o capítulo de suporte explica a terminologia nova e a antiga ainda presente no guia do exame.

---

# Índice

> **Nomes completos das siglas de serviços no índice:** AWS Identity and Access Management (**IAM**); Amazon Elastic Compute Cloud (**EC2**); Amazon Virtual Private Cloud (**VPC**); Amazon Simple Storage Service (**S3**); Amazon Elastic Block Store (**EBS**); Amazon Elastic File System (**EFS**). **Amazon FSx** é o nome oficial da família de sistemas de arquivos e não uma sigla a ser expandida.

1. [Como funciona a prova e como estudar](#1-como-funciona-a-prova-e-como-estudar)
2. [O que é computação em nuvem](#2-o-que-é-computação-em-nuvem)
3. [Infraestrutura global, disponibilidade e resiliência](#3-infraestrutura-global-disponibilidade-e-resiliência)
4. [Princípios de arquitetura e Well-Architected](#4-princípios-de-arquitetura-e-well-architected)
5. [Economia da nuvem, adoção e migração](#5-economia-da-nuvem-adoção-e-migração)
6. [Responsabilidade compartilhada](#6-responsabilidade-compartilhada)
7. [IAM, autenticação, autorização e identidades](#7-iam-autenticação-autorização-e-identidades)
8. [Segurança de dados, criptografia e conformidade](#8-segurança-de-dados-criptografia-e-conformidade)
9. [Detecção de ameaças, auditoria e governança](#9-detecção-de-ameaças-auditoria-e-governança)
10. [Acesso à AWS, automação e infraestrutura como código](#10-acesso-à-aws-automação-e-infraestrutura-como-código)
11. [Computação: EC2, escalabilidade, contêineres e serverless](#11-computação-ec2-escalabilidade-contêineres-e-serverless)
12. [Redes: VPC, sub-redes, DNS, CDN e conectividade](#12-redes-vpc-sub-redes-dns-cdn-e-conectividade)
13. [Armazenamento: S3, EBS, EFS, FSx, backup e recuperação](#13-armazenamento-s3-ebs-efs-fsx-backup-e-recuperação)
14. [Bancos de dados: relacionais, NoSQL, cache e migração](#14-bancos-de-dados-relacionais-nosql-cache-e-migração)
15. [Monitoramento, operações e ferramentas de desenvolvedor](#15-monitoramento-operações-e-ferramentas-de-desenvolvedor)
16. [Integração, mensageria e aplicações empresariais](#16-integração-mensageria-e-aplicações-empresariais)
17. [Analytics, inteligência artificial e machine learning](#17-analytics-inteligência-artificial-e-machine-learning)
18. [Catálogo complementar: todos os serviços oficiais em escopo](#18-catálogo-complementar-todos-os-serviços-oficiais-em-escopo)
19. [Preços, descontos, Billing e otimização financeira](#19-preços-descontos-billing-e-otimização-financeira)
20. [Suporte, documentação, parceiros e AWS Health](#20-suporte-documentação-parceiros-e-aws-health)
21. [Estudo de caso: uma plataforma web na AWS](#21-estudo-de-caso-uma-plataforma-web-na-aws)
22. [Comparativos e pegadinhas fundamentais](#22-comparativos-e-pegadinhas-fundamentais)
23. [Simulado original comentado: 80 questões](#23-simulado-original-comentado-80-questões)
24. [Flashcards para revisão ativa](#24-flashcards-para-revisão-ativa)
25. [Laboratórios, cronograma e critérios de prontidão](#25-laboratórios-cronograma-e-critérios-de-prontidão)
26. [Mapa de cobertura CLF-C02 e fontes oficiais](#26-mapa-de-cobertura-clf-c02-e-fontes-oficiais)

---

# 1. Como funciona a prova e como estudar

> **Nomes completos nesta página:** AWS Identity and Access Management (**IAM**); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**); Amazon Elastic Block Store (**EBS**).

**Prova:** 65 perguntas em 90 minutos, sendo 50 pontuadas e 15 não pontuadas (não identificadas). Questões de escolha única ou múltipla. Nota na escala de 100 a 1.000; aprovação a partir de **700**. O critério é compensatório: o que importa é a pontuação total, não uma nota mínima por domínio. Não há penalidade adicional por responder errado: se não souber, elimine alternativas e responda.

| Domínio oficial | Peso | Forma mais produtiva de estudar |
|---|---:|---|
| 1. Conceitos da nuvem | 24% | Entender benefícios, arquitetura, CAF, migração e economia |
| 2. Segurança e conformidade | 30% | Dominar responsabilidade compartilhada, IAM e diferenças entre serviços de segurança |
| 3. Tecnologia e serviços | 34% | Aprender os serviços principais por **problema que resolvem** |
| 4. Cobrança, preços e suporte | 12% | Comparar modelos de compra e ferramentas de custo; revisar suporte atualizado |

**Não é uma prova de programação.** O guia oficial considera codificação, implementação detalhada, troubleshooting e design aprofundado fora do escopo. Porém, entender arquiteturas simples fará você memorizar muito melhor.

### 1.1. Método de aprendizagem

Em cada assunto, responda quatro perguntas:

1. **Qual é o problema?** Ex.: uma empresa precisa hospedar arquivos estáticos.
2. **Qual conceito resolve?** Ex.: armazenamento de objetos.
3. **Qual serviço AWS representa o conceito?** Ex.: Amazon S3.
4. **Qual alternativa parece similar, mas é diferente?** Ex.: Amazon EBS é armazenamento em bloco para volumes ligados a computação, e não um serviço de hospedagem de objetos via API.

Faça *active recall*: feche a explicação e reconstrua o conceito de memória. Depois use questões com distratores. Guarde em uma lista os pares que confundiu (CloudWatch × CloudTrail, RDS Multi-AZ × read replica, Security Group × NACL). Repita-os em dias diferentes.

### 1.2. Vocabulário-base

- **Workload:** conjunto de recursos que implementa uma aplicação/capacidade de negócio.
- **Provisionar:** criar/disponibilizar recurso de computação, rede, banco ou outro serviço.
- **Managed service:** o provedor assume parte da operação; isso **não** elimina responsabilidades do cliente.
- **Serverless:** o cliente não gerencia a frota de servidores subjacente; o serviço continua usando servidores, que pertencem à operação da AWS.
- **SLA:** compromisso contratual de nível de serviço, sujeito a condições; não é garantia de ausência de falhas.
- **API:** interface programática para consumir funções de um serviço.
- **IaC (Infrastructure as Code):** especificar recursos de infraestrutura de modo declarativo ou automatizado, repetível e versionável.
- **Região (Region):** área geográfica AWS contendo múltiplas AZs.
- **AZ (Availability Zone):** domínio de falha separado dentro de uma Região.

---

# 2. O que é computação em nuvem

> **Nomes completos nesta página:** Amazon Elastic Compute Cloud (**EC2**); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**).
**[ESSENCIAL — Domínio 1]**

## 2.1. A pergunta que originou a nuvem

Imagine que sua plataforma recebe 500 usuários normalmente, mas 20 mil durante uma notícia importante. Em infraestrutura própria, você compra servidores para suportar o pico — mesmo que fiquem ociosos no resto do mês. Além do hardware, precisa manter energia, refrigeração, conectividade, reposição de componentes e equipes operacionais.

Na nuvem, você solicita capacidade através de APIs e geralmente paga conforme os modelos de consumo contratados. Em vez de comprar um equipamento, consome recursos computacionais como serviço.

**Computação em nuvem** é o fornecimento sob demanda de capacidade computacional (servidores, armazenamento, bancos, redes e outros) com provisionamento rápido e modelos de cobrança ligados ao consumo ou ao compromisso assumido.

### Cinco propriedades para internalizar

1. **Autoatendimento sob demanda:** provisionar sem abrir chamado para alguém instalar máquina física.
2. **Acesso amplo pela rede:** consumo dos serviços por interfaces padronizadas.
3. **Pool de recursos:** infraestrutura compartilhada logicamente entre clientes, com isolamento apropriado.
4. **Elasticidade rápida:** aumentar e diminuir recursos acompanhando a demanda.
5. **Serviço mensurável:** consumo registrado e usado na cobrança.

Não confunda *cloud* com simplesmente “ter uma máquina virtual”. A transformação está na automação, elasticidade, serviços gerenciados e modelo operacional.

## 2.2. Cloud pública, privada, híbrida e on-premises

| Modelo | Significado | Exemplo |
|---|---|---|
| Nuvem pública | Serviços compartilhados e isolados logicamente, fornecidos por provedor | EC2, S3 e RDS em uma conta AWS |
| Nuvem privada | Infraestrutura cloud dedicada a uma organização | Ambiente virtualizado interno com provisionamento automatizado |
| Híbrido | Integração de ambientes locais e nuvem | Banco legado on-premises ligado ao backend na AWS por VPN |
| On-premises | Equipamentos operados no datacenter da empresa | Servidor físico local com PostgreSQL |

Uma arquitetura **híbrida** não significa necessariamente usar duas nuvens públicas; isso pode ser *multicloud*. A AWS oferece AWS Outposts para levar infraestrutura e serviços AWS a instalações locais em determinados casos.

## 2.3. Escalabilidade versus elasticidade

**Escalabilidade** é a capacidade de suportar mais trabalho ao adicionar recursos.

- **Vertical (scale up):** trocar máquina de 2 vCPUs/4 GiB por uma de 8 vCPUs/32 GiB.
- **Horizontal (scale out):** passar de 2 para 10 instâncias da aplicação.

**Elasticidade** acrescenta o aspecto dinâmico e reversível: subir para 10 instâncias durante o pico e voltar a 2 depois. Logo, uma solução pode ser escalável, mas pouco elástica.

Exemplo: um servidor maior permanentemente disponível é uma mudança de escala. Um Auto Scaling Group que adiciona e remove instâncias segundo métricas é **elasticidade**.

**Pegadinha:** um Elastic Load Balancer distribui tráfego entre destinos; quem aumenta/diminui a quantidade de instâncias pode ser o Auto Scaling. São complementares.

## 2.4. Agilidade, disponibilidade, confiabilidade e resiliência

São conceitos relacionados, mas não iguais:

- **Agilidade:** experimentar e implantar rapidamente, sem meses de aquisição de hardware.
- **Alta disponibilidade (HA):** manter o serviço acessível apesar de falhas previstas. Redundância entre AZs é um padrão comum.
- **Confiabilidade:** funcionar corretamente e recuperar-se de interrupções ao longo do tempo.
- **Tolerância a falhas:** continuar operando mesmo quando um componente falha, com pouca ou nenhuma interrupção percebida.
- **Resiliência:** suportar falhas, adaptar-se e recuperar-se de eventos adversos.
- **Durabilidade:** probabilidade de os dados serem preservados; não se confunde com o tempo em que o serviço fica acessível.

Exemplo decisivo: você pode ter armazenamento **altamente durável** (pouca probabilidade de perder objetos) mas um sistema que fique indisponível porque sua única instância do backend caiu.

Se um serviço tem disponibilidade hipotética de 99,9% no período de 30 dias, a indisponibilidade equivalente seria cerca de **43,2 minutos** (0,1% × 43.200 minutos). É matemática ilustrativa, não promessa contratual. O SLA real depende do serviço, arquitetura e termos vigentes.

## 2.5. Alcance global, latência e economia de escala

A AWS administra infraestrutura física distribuída globalmente. Isso permite aproximar conteúdos de usuários, escolher regiões compatíveis com necessidades legais e expandir aplicações sem construir datacenters.

**Latência** é tempo de resposta. Uma pessoa no Brasil pode perceber maior latência se cada requisição precisar atravessar o oceano; CloudFront pode manter conteúdo em caches próximos do usuário, mas dados dinâmicos e operações de banco continuam obedecendo à arquitetura da origem.

**Economia de escala:** a AWS compra infraestrutura e energia em volumes enormes e reparte os custos operacionais por muitos clientes. O modelo pode oferecer custo unitário competitivo; isso não significa que toda migração seja automaticamente mais barata.

### Verifique se entendeu

- Por que auto scaling é mais alinhado ao conceito de elasticidade do que simplesmente aumentar o servidor?
- Por que “99,999999999% de durabilidade” não significa “99,999999999% de disponibilidade”?
- Se um cliente precisa manter um banco de dados local e mover apenas a API, qual modelo de implantação descreve melhor o cenário? (**Híbrido**.)

---

# 3. Infraestrutura global, disponibilidade e resiliência

> **Nomes completos nesta página:** Application Load Balancer (**ALB**); Amazon Elastic Container Service (**ECS**); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**).
**[ESSENCIAL — Domínios 1 e 3.2]**

## 3.1. Região, AZ e Edge Location: três escalas diferentes

**Região AWS (Region):** agrupamento geográfico de infraestrutura, identificado por códigos como `sa-east-1`. Regiões são separadas geograficamente. Escolha conforme proximidade de usuários, serviços disponíveis, preço, leis sobre dados e estratégia de continuidade.

**Availability Zone (AZ):** uma ou mais instalações físicas isoladas dentro da Região, com alimentação de energia, rede e conectividade redundantes. AZs da mesma Região são conectadas por redes de baixa latência e alta largura de banda. Elas foram desenhadas para **não compartilhar um único ponto de falha**. Uma Região tem múltiplas AZs.

**Edge Location:** ponto distribuído da rede de borda, normalmente usado para acelerar entrega de conteúdo e outras funções de rede. **Não é a mesma coisa que uma AZ** e não significa “instalar um RDS na edge location”.

```text
                 Usuário em diferentes cidades
                               |
                     Edge / CDN CloudFront
                               |
                        REGIÃO sa-east-1
                  /             |             \
                AZ-a           AZ-b           AZ-c
               API A          API B          outros recursos
                  \             /
                       Load Balancer
                               |
                      Banco Multi-AZ
```

O esquema é conceitual. Na prática, um balanceador e serviços gerenciados têm componentes gerenciados distribuídos e seus próprios requisitos de configuração.

## 3.2. Single-AZ, Multi-AZ e Multi-Region

- **Single-AZ:** custo e simplicidade em alguns cenários, porém a aplicação pode ser afetada por indisponibilidade daquela AZ.
- **Multi-AZ:** várias AZs da **mesma Região**; protege contra falha de infraestrutura de uma AZ, dependendo da arquitetura.
- **Multi-Region:** várias Regiões; pode atender recuperação de desastres regionais, proximidade geográfica, exigências de residência de dados e continuidade de negócio. Eleva custo e complexidade.

**Exemplo:** dois containers ECS distribuídos entre AZs, com um ALB e um banco RDS Multi-AZ, são mais resilientes à perda de uma AZ do que uma API e banco na mesma AZ.

**Pegadinha:** replicar dados para outra AZ não implica que a aplicação inteira esteja pronta para failover. Também são necessários rede, computação, roteamento, credenciais, monitoramento e testes.

## 3.3. RTO e RPO: o que o negócio tolera?

- **RTO (Recovery Time Objective):** quanto tempo se aceita até recuperar o serviço após o incidente.
- **RPO (Recovery Point Objective):** quanto de dados/tempo de mudanças pode ser perdido.

Se o objetivo é **RTO de 1 hora** e **RPO de 15 minutos**, o negócio tolera até uma hora de interrupção e até quinze minutos de alterações não recuperadas. Isso não quer dizer que esses números serão automaticamente cumpridos.

### Estratégias comuns de Disaster Recovery

| Estratégia | Intuição | Trade-off |
|---|---|---|
| Backup and restore | Recuperar backups e reconstruir ambiente | Menor custo operacional, recuperação em geral mais lenta |
| Pilot light | Manter conjunto mínimo de componentes essenciais prontos | Recuperação mais rápida que a anterior, exige ativação do restante |
| Warm standby | Manter ambiente reduzido funcionando | Recuperação mais rápida, custo contínuo maior |
| Multi-site / active-active | Vários ambientes respondem à produção | Alta complexidade/custo; potencial de recuperação muito rápida |

**Backup não é alta disponibilidade.** O primeiro ajuda a restaurar; o segundo reduz indisponibilidade durante falhas.

## 3.4. Durabilidade, redundância e replicação

As classes S3 Standard e outras classes S3 com redundância em múltiplas AZs são desenhadas para durabilidade muito alta; entretanto existem classes **One Zone** que armazenam dados em apenas uma AZ e têm perfil de risco distinto. **Não aplique indiscriminadamente o slogan de “11 noves” a todo produto ou característica.**

Muitos bancos gerenciados permitem replicação em outra AZ. No RDS, **Multi-AZ** normalmente visa disponibilidade e failover; **read replicas** servem prioritariamente para distribuir consultas de leitura. É possível combinar capacidades dependendo do mecanismo/configuração.

## 3.5. Residência e soberania de dados

- **Residência de dados:** em quais localidades geográficas dados ficam armazenados/processados.
- **Soberania de dados:** exigências de controle e conformidade derivadas das leis aplicáveis.
- Regiões ajudam a atender restrições, mas não dispensam análise de replicações, backups, logs, suporte, serviços globais ou configurações do cliente.

### Dica de prova

Se o enunciado mencionar **proteger contra falha de datacenter/AZ**, pense **Multi-AZ**. Se mencionar **falha regional, disaster recovery geográfico, latência mundial ou exigência regulatória de país**, pense **Multi-Region**, conforme o problema. Se falar **entregar conteúdo estático com baixa latência**, pense **CloudFront/edge locations**.

---

# 4. Princípios de arquitetura e Well-Architected

> **Nomes completos nesta página:** AWS Identity and Access Management (**IAM**); Amazon Relational Database Service (**RDS**).
**[ESSENCIAL — Domínio 1.2]**

O AWS Well-Architected Framework é uma coleção de princípios e boas práticas para avaliar e melhorar *workloads*. Ele não é um único produto que corrige automaticamente sua infraestrutura. O **AWS Well-Architected Tool** oferece um mecanismo para realizar avaliações estruturadas das workloads.

## 4.1. Os seis pilares

| Pilar | Pergunta que responde | Exemplo |
|---|---|---|
| Excelência operacional | Conseguimos operar, monitorar, automatizar e evoluir? | Alarmes, runbooks, observabilidade, pipelines |
| Segurança | Quem pode fazer o quê e como protegemos dados e infraestrutura? | IAM, criptografia, resposta a incidentes |
| Confiabilidade | O serviço resiste a falhas e consegue se recuperar? | Multi-AZ, backup, failover, autoscaling |
| Eficiência de desempenho | Os recursos escolhidos atendem a demanda eficientemente? | Cache, instância adequada, ajuste de banco |
| Otimização de custos | Entregamos valor sem desperdício? | Rightsizing, Spot adequada, desligar ociosos |
| Sustentabilidade | Reduzimos recursos e impacto ambiental desnecessários? | Melhor utilização, dimensionamento e serviços eficientes |

Vamos interpretar cada um.

**Excelência operacional:** você publicou uma API, mas não sabe quando ela começa a falhar. Melhorar alertas de erro, logs centralizados, processos de rollback e automação é trabalhar nesse pilar.

**Segurança:** o endpoint funciona, mas sua aplicação guarda senhas hardcoded no repositório. Usar IAM roles, Secrets Manager e políticas adequadas atende ao pilar de segurança, independentemente da performance.

**Confiabilidade:** a API está bem monitorada, mas uma única instância pode derrubar o negócio. Distribuir redundância por AZ e testar recuperação foca confiabilidade.

**Eficiência de desempenho:** a aplicação não caiu, mas leva dez segundos para responder por falta de cache e escolhas ruins de instâncias. Isso é desempenho.

**Otimização de custos:** um cluster está veloz e resiliente, porém mantém dezenas de instâncias ociosas. Direitos e dimensionamento adequados são o foco.

**Sustentabilidade:** processar quantidades excessivas de dados sem necessidade consome energia e recursos. É o pilar ambiental.

> **Dica:** uma decisão pode melhorar mais de um pilar. Autoscaling, por exemplo, pode melhorar performance, confiabilidade e custos. O enunciado normalmente mostra qual é a **intenção principal**.

## 4.2. Princípios de arquitetura que aparecem indiretamente

1. **Design for failure:** parta da hipótese de que componentes vão falhar; elimine pontos únicos de falha.
2. **Loose coupling (baixo acoplamento):** módulos falham e evoluem de forma independente, muitas vezes via filas/eventos.
3. **Automation first:** infraestrutura, testes, deploys, recuperação e monitoramento como processos reproduzíveis.
4. **Stateless quando possível:** sessões/dados importantes fora da memória de uma instância individual; facilita escala horizontal.
5. **Escalar horizontalmente:** aumente réplicas quando o sistema e estado permitirem.
6. **Medição e experimentação:** decisões baseadas em métricas; revise trade-offs continuamente.
7. **Segurança em camadas (defense in depth):** controles de identidade, rede, aplicação, criptografia, logs e governança.
8. **Gerenciados quando fazem sentido:** transferir trabalho operacional repetitivo para serviços gerenciados sem perder controle sobre dados e acesso.

### Exemplo integrado

Uma API web pode estar atrás de um Application Load Balancer, distribuída por duas AZs, com Auto Scaling, RDS Multi-AZ e CloudWatch. Isso não é automaticamente “a arquitetura correta”, mas revela como disponibilidade, elasticidade, observabilidade e separação de responsabilidades se combinam.

## 4.3. Well-Architected versus Cloud Adoption Framework

- **Well-Architected:** avalia *como arquitetar/operar uma workload* segundo pilares.
- **Cloud Adoption Framework (CAF):** orienta a transformação da **organização inteira** e sua prontidão para a nuvem.
- **AWS Well-Architected Tool:** ferramenta para registrar avaliações e recomendações de workloads.
- **AWS Trusted Advisor:** recomendações automatizadas e checagens em categorias como custos, segurança e desempenho.

**Pegadinha recorrente:** não marque AWS CAF quando a questão pergunta pelos *seis pilares da arquitetura*. O CAF também trabalha com seis **perspectivas**, que são diferentes.

---

# 5. Economia da nuvem, adoção e migração

> **Nomes completos nesta página:** AWS Database Migration Service (**AWS DMS**); Amazon Elastic Compute Cloud (**EC2**); AWS Application Migration Service (**AWS MGN**, nome curto oficial); Amazon Relational Database Service (**RDS**); AWS Schema Conversion Tool (**AWS SCT**).
**[ESSENCIAL — Domínios 1.3 e 1.4]**

## 5.1. CAPEX e OPEX

**CAPEX (capital expenditure):** investimento de capital, como comprar hardware e estrutura de datacenter. É um desembolso/ativo sujeito a tratamento contábil apropriado.

**OPEX (operating expenditure):** despesas operacionais recorrentes, como consumo mensal de serviços cloud, suporte e operação. A classificação contábil exata de um contrato pode variar; para a prova, a ideia é a passagem de grandes investimentos iniciais para custos ligados ao uso.

### Por que isso importa?

Se comprar capacidade para um pico de 100 unidades e normalmente usar 10, paga e mantém uma capacidade enorme que fica parada. Uma arquitetura elástica busca adequar oferta à demanda.

**Mas cuidado:** pagamento por uso não é sinônimo de custo baixo. Uma instância ligada continuamente, banco superdimensionado, logs sem política de retenção ou tráfego de saída intenso geram gastos mesmo em nuvem.

## 5.2. Custos fixos, variáveis, TCO e direitos de licenciamento

- **Fixos:** estrutura, equipamentos, contratos e custos que não variam imediatamente com requisições.
- **Variáveis:** consumo de computação, armazenamento, transferências e transações conforme regras do serviço.
- **TCO (Total Cost of Ownership):** custo total, não apenas compra de servidor ou a mensalidade da AWS. Inclui hardware, energia, refrigeração, equipe, software, manutenção, renovação, licenças e custos de migração.
- **Rightsizing:** ajustar capacidade e tipo de recurso à demanda real para reduzir desperdício.
- **BYOL (Bring Your Own License):** usar licenças próprias elegíveis na nuvem, conforme termos específicos.
- **License included:** licença embutida no preço do serviço, quando disponível.

**Exemplo:** migrar um PostgreSQL instalado em EC2 para RDS pode aumentar a conta nominal do serviço, mas reduzir esforço de operação, backup e patching. Para avaliar o valor, considere TCO, riscos e exigências; não compare apenas preço da instância.

## 5.3. AWS Cloud Adoption Framework (CAF): as seis perspectivas

O AWS CAF ajuda a identificar capacidades organizacionais para adoção da nuvem:

| Perspectiva | O que examina |
|---|---|
| **Business (Negócios)** | Resultados de negócio, estratégia, receita e valor |
| **People (Pessoas)** | Habilidades, cultura, organização e capacitação |
| **Governance (Governança)** | Riscos, portfólio, regras, investimento e controles |
| **Platform (Plataforma)** | Tecnologia, arquitetura, engenharia e fundações cloud |
| **Security (Segurança)** | Identidade, proteção, conformidade e risco cibernético |
| **Operations (Operações)** | Monitoramento, automação, suporte e continuidade operacional |

As três primeiras ajudam na perspectiva de negócio e organização; as três últimas têm forte relação técnica. Os resultados que o CAF pretende ajudar a alcançar incluem redução de risco, maior eficiência, aumento de receita e melhoria de sustentabilidade/ESG.

**CAF não é uma ferramenta de migração:** é um framework de transformação. Um serviço como AWS DMS, por outro lado, executa tarefas técnicas específicas da migração de bancos.

## 5.4. As estratégias 7 Rs de migração

| Estratégia | Tradução prática | Exemplo |
|---|---|---|
| **Rehost** | “Lift and shift”: mudar quase sem alterar | VM local passa a rodar no EC2 |
| **Relocate** | Mover a infraestrutura de hospedagem praticamente sem redesenhar workload | Migração de VMs/plataforma compatível para ambiente AWS |
| **Replatform** | Ajustar componentes sem refazer a aplicação completamente | Banco em VM passa para RDS |
| **Repurchase** | Substituir por outro produto/SaaS | Trocar CRM próprio por SaaS |
| **Refactor / Rearchitect** | Reestruturar arquitetura/código | Monolito evolui para serviços orientados a eventos |
| **Retire** | Descontinuar o que não traz valor | Encerrar aplicação redundante |
| **Retain** | Manter como está por enquanto | Sistema legado incompatível permanece local |

**Critério para não confundir:**
- Poucas mudanças, troca de hospedagem → **rehost**.
- Otimização pontual, como adoção de banco gerenciado → **replatform**.
- Redesenho relevante da aplicação → **refactor**.
- Não migrar por decisão → **retain**.
- Desativar definitivamente → **retire**.

## 5.5. Ferramentas AWS de migração e suas funções

- **AWS Application Discovery Service:** coleta informações sobre aplicações e infraestrutura para planejar migração.
- **Migration Evaluator:** ajuda a avaliar perfil de uso e a construir caso econômico de migração.
- **AWS Migration Hub:** visão e acompanhamento da jornada de migração.
- **AWS Application Migration Service (MGN):** migração de servidores/aplicações com replicação e conversão necessárias.
- **AWS Database Migration Service (DMS):** migração/replicação de **dados** de bancos entre origens e destinos compatíveis, podendo reduzir indisponibilidade.
- **AWS Schema Conversion Tool (SCT):** ajuda a converter **esquemas e objetos de banco** quando muda o mecanismo (por exemplo, certas migrações heterogêneas).

**DMS ≠ SCT:** um move/replica dados; o outro ajuda a converter estruturas e código de banco. Em migração de mecanismos diferentes, ambos podem ser necessários.

### Questões de revisão

1. Uma aplicação antiga será migrada para EC2 sem mudança significativa. **Rehost.**
2. Um banco Oracle local irá para outro mecanismo com mudanças em objetos SQL e migração dos registros. **SCT + DMS**, conforme compatibilidade.
3. O time quer avaliar lacunas organizacionais de treinamento, governança e operação antes de iniciar cloud. **AWS CAF.**
4. A pergunta pede uma avaliação da segurança, confiabilidade e custo de uma workload já rodando. **Well-Architected.**

---
# 6. Responsabilidade compartilhada

> **Nomes completos nesta página:** Amazon Elastic Compute Cloud (**EC2**); Amazon Elastic Container Service (**ECS**); Amazon Elastic Kubernetes Service (**EKS**); AWS Identity and Access Management (**IAM**); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**).
**[ESSENCIAL — Domínio 2.1]**

Talvez seja o conceito isolado mais importante da certificação. A AWS não assume toda a segurança do cliente só porque o recurso está hospedado em seus datacenters.

> **AWS: segurança *da* nuvem (security OF the cloud). Cliente: segurança *na* nuvem (security IN the cloud).**

## 6.1. O que a AWS normalmente assume?

- Segurança física de datacenters, instalações e infraestrutura global.
- Hardware de computação, dispositivos de armazenamento e redes subjacentes.
- Camadas de virtualização e infraestrutura gerenciada pela AWS.
- Operação de componentes específicos de serviços gerenciados, de acordo com o modelo de cada produto.

## 6.2. O que o cliente normalmente assume?

- Dados, classificações, uso legítimo e permissões para acessá-los.
- Configuração de identidades, usuários, funções e políticas IAM.
- Criptografia e escolha/configuração de opções de proteção quando aplicável.
- Segurança e vulnerabilidades no código que escreve.
- Regras de acesso de rede e configuração dos recursos.
- Configuração e tratamento de logs, retenção, backups e recuperação.
- Cumprimento de requisitos regulatórios específicos do seu negócio.

Algumas obrigações se sobrepõem conceitualmente: AWS fornece infraestrutura e controles de segurança; cliente deve configurá-los e usá-los corretamente.

## 6.3. A responsabilidade muda conforme o serviço

| Camada/responsabilidade | EC2 (IaaS) | RDS (serviço gerenciado) | Lambda (serverless) |
|---|---|---|---|
| Infraestrutura física | AWS | AWS | AWS |
| Virtualização/host subjacente | AWS | AWS | AWS |
| Sistema operacional da instância de cliente | **Cliente** | **AWS** para a camada de banco gerenciado | **AWS** para o ambiente operacional gerenciado |
| Atualização da engine de banco | Cliente se instalar banco em EC2 | Gerenciada/automatizável conforme configurações, mecanismos e janelas; cliente decide/configura aspectos relevantes | Não aplicável, salvo banco externo da função |
| Código de aplicação | Cliente | Cliente (aplicação externa) | **Cliente** |
| Pacotes e dependências do seu código | Cliente | Cliente no que instalar/gerir | **Cliente**, inclusive dependências e camadas |
| Identidade, políticas e acesso aos dados | Cliente | Cliente | Cliente |
| Configuração de segurança do recurso | Cliente | Cliente | Cliente |

**Pegadinha de prova:** “AWS gerencia o sistema operacional no RDS” não implica “AWS define os privilégios de seus usuários de banco” ou “AWS decide quais dados podem ser publicados”.

## 6.4. Se os dados vazarem, de quem é a culpa?

Não há resposta universal. Imagine um bucket S3 inadvertidamente exposto ao público por configuração do cliente: a AWS fornece funcionalidades para bloquear acesso público, mas a **configuração e política de acesso** são deveres do cliente. Se houver falha física do datacenter, a proteção física é responsabilidade da AWS. A análise concreta depende do evento e das responsabilidades contratuais.

## 6.5. Outro exemplo: contêineres

Em **ECS sobre EC2**, o cliente administra instâncias EC2, seu SO e patching além das imagens de contêiner. Em **ECS com Fargate**, a AWS gerencia os hosts/infraestrutura; cliente ainda responde por imagem, dependências, IAM roles, rede e dados. Em **EKS**, a AWS gerencia componentes específicos do plano de controle; responsabilidades por workloads e nós variam com o modo de execução.

**Guarde:** quanto mais gerenciado o serviço, menor tende a ser seu trabalho com infraestrutura, mas *a responsabilidade por acesso e dados não desaparece*.

---

# 7. IAM, autenticação, autorização e identidades

> **Nomes completos nesta página:** AWS Identity and Access Management (**IAM**); Amazon Elastic Compute Cloud (**EC2**); Amazon Elastic Container Service (**ECS**); AWS Resource Access Manager (**AWS RAM**); Amazon Simple Storage Service (**S3**); AWS Security Token Service (**AWS STS**). **AWS Single Sign-On (AWS SSO)** é o nome anterior do AWS IAM Identity Center.
**[ESSENCIAL — Domínio 2.3]**

**IAM (Identity and Access Management)** controla identidades e permissões para ações em recursos AWS. Pense nas perguntas:

- **Quem é você?** → autenticação.
- **O que você pode fazer?** → autorização.
- **Em qual recurso?** → escopo do acesso.
- **Em que condições?** → restrições adicionais (origem, tags, MFA, horário etc., conforme suporte).

## 7.1. Conta root: o superusuário

A conta AWS tem um **usuário-raiz (root)** criado com a conta e altamente privilegiado. É indicado usar root apenas para tarefas que realmente requerem root; o trabalho diário deve ocorrer com identidades administrativas delegadas.

Medidas fundamentais:
1. Ative e mantenha MFA forte.
2. Não crie ou mantenha access keys permanentes do root; dê preferência a identidades/funções e credenciais temporárias.
3. Proteja o e-mail e os mecanismos de recuperação.
4. Monitore uso de root e mantenha trilhas de auditoria.
5. Em organizações com múltiplas contas, conheça as opções de gerenciamento centralizado de credenciais root de contas-membro.

**Cuidado de precisão:** a lista exata de operações exclusivas do root pode mudar. Exemplos historicamente associados a root incluem algumas tarefas específicas de conta e faturamento. Para fins da CLF, retenha **“use root apenas quando estritamente necessário”**, não uma lista inventada de ações.

## 7.2. IAM User, Group, Role, Policy

- **IAM user:** identidade da AWS com permissões; pode ter credenciais de login/acesso programático. Para equipes humanas, a prática moderna é preferir federação/Identity Center e credenciais temporárias.
- **IAM group:** agrupamento de usuários para atribuir políticas compartilhadas. *Roles não são membros de grupos.*
- **IAM role:** identidade com permissões que pode ser **assumida** por serviços, usuários e identidades federadas conforme política de confiança. Geralmente fornece credenciais temporárias via STS.
- **IAM policy:** documento que define permitir/negar ações sobre recursos e sob condições. Existem políticas gerenciadas pela AWS, gerenciadas pelo cliente e inline.
- **Principal:** entidade que faz a requisição de acesso.

### Exemplo de política conceitual

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::meu-bucket-relatorios/*"
    }
  ]
}
```

Interpretação: a identidade à qual essa política está efetivamente associada poderá **ler objetos** sob o prefixo ARN indicado, desde que nenhum outro controle relevante negue a ação. Isso **não** concede por si só `s3:ListBucket` no bucket e **não** transforma o bucket em público. A política também não define quem pode assumir a role; isso é assunto da **trust policy**.

### Trust policy versus permission policy

Uma **role** costuma envolver duas ideias distintas:

- **Trust policy:** **quem pode assumir** a role (`sts:AssumeRole` e mecanismos relacionados).
- **Permission policy:** **o que a role pode fazer** depois de assumida.

Se a Lambda precisa ler um bucket, a função assume uma execution role autorizada e essa role recebe permissão de leitura do bucket. Não coloque access keys fixas no código.

## 7.3. A lógica de autorização — modelo mental correto

Comece pelo princípio: **por padrão o acesso é negado**, até que alguma política adequada permita. Uma **negação explícita** em política aplicável prevalece sobre permissões.

Na mesma conta, identidades e recursos podem receber permissões por políticas diferentes; a avaliação completa depende do tipo de principal, recurso, políticas de sessão e limites. Evite decorar a simplificação incorreta de que “toda política precisa ter Allow”; tipos distintos participam da avaliação de formas diferentes.

Controles importantes:
- **Identity-based policy:** ligada a identidade (usuário/role/grupo para usuários).
- **Resource-based policy:** ligada ao recurso (por exemplo, bucket policy).
- **Permissions boundary:** limite máximo para permissões de identidades, **não concede** acessos por si só.
- **SCP (Service Control Policy):** guardrail na AWS Organizations; define teto de permissões para contas/entidades aplicáveis, **não concede** autorização.
- **Session policy:** pode restringir permissões de sessão temporária.
- **RCP (Resource Control Policy):** controle organizacional adicional aplicável a recursos compatíveis, também **não é um grant**.

Para a prova, retenha três regras:
1. *Deny explícito ganha.*
2. *IAM decide quais ações uma identidade pode executar.*
3. *SCP e permissions boundary restringem, não dão acesso por conta própria.*

## 7.4. Menor privilégio (least privilege)

Não dê `AdministratorAccess` para uma aplicação que só precisa fazer `s3:GetObject` em um prefixo. Menor privilégio diminui o impacto de credenciais vazadas e erros.

**Exemplo:** o serviço de geração de relatórios lê dados e escreve arquivos no S3. Sua role deve permitir apenas ações e buckets/prefixos necessários, não acesso irrestrito a todos os buckets.

## 7.5. MFA, access keys e credenciais temporárias

- **MFA:** pelo menos um fator adicional; aumenta a segurança de login.
- **Access key ID + secret access key:** credenciais de acesso programático, sensíveis. Evite as de longa duração quando credenciais temporárias são possíveis.
- **STS (Security Token Service):** fornece credenciais temporárias para sessões/roles.
- **IAM role de serviço:** evita embutir chaves no código de EC2/Lambda/ECS.
- **Rotação, expiração e armazenamento seguro:** controles vitais para segredos que ainda precisam existir.

**Pegadinha:** MFA melhora a **autenticação**, mas não substitui políticas de **autorização**.

## 7.6. Identidades humanas, corporativas e de aplicativos

| Necessidade | Solução típica | Por quê |
|---|---|---|
| Equipes da empresa acessando várias contas AWS | **IAM Identity Center** | Login/federação e atribuições centralizadas para a força de trabalho |
| Aplicação web ou mobile autenticando usuários finais | **Amazon Cognito** | Diretórios/pools e federação de usuários do aplicativo |
| EC2/Lambda/ECS acessando serviços AWS | **IAM role** | Acesso de workload com credenciais temporárias |
| Conectar diretórios Microsoft | **AWS Directory Service** | Integração com serviços de diretório, conforme modalidade |
| Compartilhar recursos AWS compatíveis entre contas | **AWS Resource Access Manager (RAM)** | Compartilhamento controlado de recursos |

**Identidade AWS ≠ identidade de usuário final.** A aplicação pode usar um provedor externo (por exemplo, Keycloak/OIDC) para autenticar clientes. Isso não significa que cada cliente deva receber um IAM user na AWS.

### Federação, SAML e OIDC

**Federação** permite autenticar-se por um provedor de identidade externo e acessar um serviço sem gerenciar credenciais humanas independentes para cada conta. SAML e OIDC são protocolos comuns em SSO. Dependendo da integração, identidades federadas podem receber sessões/roles temporárias.

Se uma pergunta disser “funcionários de diversas contas AWS usam o diretório corporativo”, pense **IAM Identity Center**. Se disser “clientes da aplicação precisam fazer login”, pense **Cognito**. Se disser “API em Fargate precisa ler S3”, pense **IAM task role**.

## 7.7. IAM em múltiplas contas

Uma empresa pode separar **produção, desenvolvimento, dados e segurança** em contas AWS diferentes, organizadas com AWS Organizations.

- **Identity Center:** fornece entrada central para pessoas.
- **IAM roles cross-account:** permitem que identidades autorizadas assumam papéis em outra conta.
- **Organizations e SCPs:** organizam contas e aplicam limites.
- **Control Tower:** ajuda a configurar e governar uma landing zone multiaccount.
- **RAM:** compartilha certos tipos de recursos entre contas.

**Não confunda:** IAM tem gerenciamento e políticas globais por conta (com particularidades dos recursos); **Security Groups, VPCs e subnets** são recursos de redes ligados a Regiões/VPCs.

### Mini-caso: por que o “Allow” não funcionou?

O desenvolvedor tem uma policy que permite apagar um bucket, mas a organização impôs um SCP com deny para `s3:DeleteBucket`. Resultado: **negado**. A role do desenvolvedor não pode ultrapassar um guardrail organizacional.

---

# 8. Segurança de dados, criptografia e conformidade

> **Nomes completos nesta página:** AWS Certificate Manager (**ACM**); Application Load Balancer (**ALB**); Amazon Elastic Block Store (**EBS**); AWS Identity and Access Management (**IAM**); AWS Key Management Service (**AWS KMS**); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**); AWS Web Application Firewall (**AWS WAF**).
**[ESSENCIAL — Domínio 2.2]**

## 8.1. Três objetivos centrais

- **Confidencialidade:** pessoas não autorizadas não podem acessar dados.
- **Integridade:** modificações indevidas podem ser evitadas/detectadas.
- **Disponibilidade:** dados e serviços podem ser usados quando necessário.

Uma arquitetura segura combina controles de identidade, rede, aplicação, dados, monitoramento e resposta.

## 8.2. Criptografia em trânsito e em repouso

- **Em trânsito:** protege a comunicação (normalmente com TLS/HTTPS). Exemplo: navegador ↔ API.
- **Em repouso:** protege dados armazenados. Exemplo: objetos S3, volumes EBS e bancos RDS criptografados.

Criptografia **não substitui** autorização. Uma aplicação autorizada consegue descriptografar dados; se você conceder permissão excessiva, criptografia isoladamente não corrige o problema.

## 8.3. AWS KMS versus CloudHSM versus ACM

**AWS KMS (Key Management Service):** serviço gerenciado para criar e controlar **chaves criptográficas** usadas na proteção de dados e em integrações com muitos serviços AWS. Oferece políticas de chaves, auditoria e integrações. É a opção mais comum quando a pergunta fala de gerenciamento de chaves integradas a AWS.

**AWS CloudHSM:** hardware security modules dedicados ao cliente, para cenários que exigem controle e operação de HSMs e determinadas necessidades criptográficas/compliance. Tem mais responsabilidade operacional que KMS.

**AWS Certificate Manager (ACM):** emissão, provisionamento, gerenciamento e renovação de **certificados TLS** para serviços compatíveis. Certificado para HTTPS não é a mesma coisa que chave KMS para criptografar arquivos em repouso.

| Problema | Serviço provável |
|---|---|
| Criptografar objetos S3 e gerenciar chaves AWS | KMS |
| Exigência de HSM dedicado/controlado | CloudHSM |
| Instalar/renovar certificado HTTPS de um ALB/CloudFront | ACM |

## 8.4. Segredos não são chaves de criptografia

**Secrets Manager:** guarda, gerencia e ajuda a **rotacionar segredos** como senhas de banco e chaves de API.

**Systems Manager Parameter Store:** pode armazenar parâmetros e strings seguras; pode ser alternativa adequada dependendo das necessidades. Secrets Manager tem foco maior em ciclo de vida e rotação de segredos.

**Exemplo:** a senha do RDS em Secrets Manager é um **segredo**; uma chave KMS pode criptografar o segredo armazenado. Serviços relacionados, funções diferentes.

**IAM roles** servem preferencialmente para autorizar workloads a consumir AWS sem chaves permanentes. Secrets Manager é para credenciais que *ainda precisam existir*, como login em API externa.

## 8.5. Segurança em camadas

Imagine uma API pública que retorna índices de preços:

1. **Route 53:** DNS encontra o serviço; não é firewall.
2. **CloudFront:** entrega conteúdos da borda e pode ser integrado a WAF.
3. **AWS WAF:** filtra requisições HTTP(S) por regras.
4. **ALB:** distribui requisições entre instâncias/targets.
5. **Security Groups:** restringem comunicações de rede dos recursos.
6. **IAM roles:** determinam acesso da aplicação a serviços AWS.
7. **TLS + criptografia em repouso:** protegem dados em trânsito/armazenados.
8. **CloudTrail/CloudWatch/GuardDuty:** auditam, observam e detectam comportamentos suspeitos de formas diferentes.

Uma falha em uma camada não deveria comprometer tudo. Por exemplo, o banco pode estar em subnets privadas sem exposição direta à internet.

## 8.6. Compliance, AWS Artifact e requisitos regionais

**Compliance/conformidade:** atendimento a requisitos legais, normativos, contratuais e internos. A AWS oferece infraestrutura e relatórios sobre determinados controles, mas o cliente continua responsável por configurar e comprovar os próprios processos aplicáveis.

**AWS Artifact:** acesso sob demanda a relatórios e documentos de conformidade da AWS e a determinados acordos. Se a questão pedir **“baixar relatório de auditoria de conformidade da AWS”**, a resposta é **Artifact**, não CloudTrail.

**CloudTrail:** registra eventos de atividade/API (não é biblioteca de certificados).

**AWS Config:** registra e avalia estados/configurações de recursos frente a regras.

**Amazon CloudWatch:** centraliza métricas, logs, alarmes e visibilidade operacional.

### Conformidade e geografia

Um setor pode exigir retenção específica, criptografia, trilha de auditoria e residência dos dados. Escolher Região adequada é parte da solução, não a única providência. Também considere logs, backups, replicações e o que cada serviço permite.

## 8.7. Políticas e controles úteis

- **Amazon S3 Block Public Access:** controles para reduzir exposição pública inadvertida.
- **Políticas de bucket:** definem acesso ao recurso S3.
- **Criptografia por padrão:** característica disponível em vários serviços, mas deve-se verificar controles de chaves e necessidades específicas.
- **AWS License Manager:** gerencia inventário e limites de uso de licenças de software.
- **AWS Service Catalog:** catálogo de produtos de infraestrutura aprovados pela organização.

---

# 9. Detecção de ameaças, auditoria e governança

> **Nomes completos nesta página:** Amazon Elastic Compute Cloud (**EC2**); AWS Identity and Access Management (**IAM**); AWS Resource Access Manager (**AWS RAM**); Amazon Simple Storage Service (**S3**); AWS Web Application Firewall (**AWS WAF**).
**[ESSENCIAL — Domínio 2.4 e parte do 3]**

O jeito mais produtivo de memorizar a “sopa de nomes” da AWS é agrupar por verbo: **registrar, monitorar, avaliar, detectar, investigar, proteger, governar**.

## 9.1. CloudTrail, CloudWatch e Config — a tríade

| Serviço | Pergunta principal | Tipo de informação |
|---|---|---|
| **CloudTrail** | “**Quem fez qual ação/API, quando e de onde?**” | Eventos de conta e ações de API, com escopos de eventos configuráveis |
| **CloudWatch** | “**Como a aplicação/infraestrutura está se comportando agora?**” | Métricas, logs, alarmes, dashboards e observabilidade |
| **Config** | “**Como a configuração do recurso mudou? Está conforme a regra?**” | Inventário/configurações e histórico/compliance |

Exemplo 1: “Quem alterou uma política IAM ontem?” → **CloudTrail**.

Exemplo 2: “Qual a taxa de erro HTTP da API? Enviar alarme quando subir?” → **CloudWatch** (com métricas/logs disponibilizados).

Exemplo 3: “Quais buckets ficaram fora da política de criptografia?” → **Config** (regras de conformidade e configuração).

**Nuance:** CloudTrail não inclui necessariamente **todos** os eventos de objetos S3 por padrão; certos eventos de dados exigem configuração apropriada. Não prometa cobertura que não foi habilitada.

## 9.2. GuardDuty, Inspector, Macie, Security Hub e Detective

**Amazon GuardDuty:** serviço de **detecção de ameaças**. Analisa fontes de telemetria e sinais de atividade suspeita, conforme integrações habilitadas. Ex.: credenciais usadas de maneira anômala, indicadores de comportamento malicioso.

**Amazon Inspector:** serviço de **gerenciamento/avaliação de vulnerabilidades** em workloads e artefatos compatíveis. Ex.: identificar vulnerabilidades de software em EC2, imagens de contêiner ou certas funções Lambda.

**Amazon Macie:** usa ML e técnicas de análise para **descobrir/classificar dados sensíveis** em buckets S3. Ex.: encontrar informações pessoais expostas.

**AWS Security Hub:** agrega e organiza **descobertas de segurança** de serviços AWS e integrações, fornecendo uma visão central.

**Amazon Detective:** ajuda a **investigar** achados e eventos de segurança, correlacionando evidências e relações.

**Pegadinha:**
- Achar malware/atividade suspeita → **GuardDuty**.
- Encontrar CVEs/pacotes vulneráveis → **Inspector**.
- Localizar CPF/PII em objetos S3 → **Macie**.
- Centralizar achados → **Security Hub**.
- Investigar um alerta mais profundamente → **Detective**.

## 9.3. WAF, Shield e Firewall Manager

**AWS WAF:** *Web Application Firewall* com regras para tráfego **HTTP/HTTPS**, adequado para bloquear padrões de requisições abusivas, SQL injection e certos ataques contra aplicações em recursos compatíveis.

**AWS Shield:** proteção contra **ataques DDoS**. Existe uma camada padrão e ofertas avançadas conforme produto/plano aplicável.

**AWS Firewall Manager:** gestão centralizada de políticas de proteção/firewall em múltiplas contas e recursos compatíveis.

| Enunciado típico | Serviço |
|---|---|
| “Bloquear requisições HTTP com padrão SQL injection” | WAF |
| “Mitigar ataques distribuídos de negação de serviço” | Shield |
| “Padronizar regras de segurança em diversas contas” | Firewall Manager |

Não suponha que WAF substitui controle de autorização no backend. Ele inspeciona padrões de requisição; não deve ser tratado como substituto da autenticação, políticas da aplicação ou validação de entrada.

## 9.4. AWS Organizations, SCP, Control Tower, RAM e Service Catalog

**Organizations:** organiza contas AWS em uma organização. Oferece agrupamento em unidades organizacionais, **consolidated billing**, integração de governança e uso de SCPs.

**SCP:** impõe limites de permissão (guardrails) em contas/unidades organizacionais compatíveis. **Não concede acesso**.

**Control Tower:** ajuda a configurar uma *landing zone* governada com contas separadas, guardrails e automações.

**AWS RAM:** compartilha recursos compatíveis entre contas sem exigir que tudo seja duplicado.

**Service Catalog:** oferece produtos e configurações aprovados; um time pode implantar a partir de um catálogo padronizado, em vez de criar componentes arbitrariamente.

### Outros serviços de operações e governança

- **AWS Compute Optimizer:** recomenda ajustes de recursos segundo métricas/uso.
- **AWS Trusted Advisor:** checagens e orientações de boas práticas sobre ambientes AWS, cobertura dependente do plano.
- **AWS Service Quotas:** mostra limites/cotas e ajuda a solicitar aumentos quando suportados.
- **AWS Health Dashboard:** mostra eventos de saúde/impacto de serviços AWS e situações relevantes para seus recursos/conta.
- **AWS Systems Manager:** conjunto de recursos para operações, inventário, parâmetros, automação e administração de nós compatíveis.
- **AWS License Manager:** acompanha licenças e ajuda no cumprimento de regras de uso.
- **AWS Well-Architected Tool:** avaliação estruturada da workload frente a boas práticas.

### Fluxo ilustrativo de investigação

```text
Acesso suspeito à conta
        |
 GuardDuty gera finding
        |
 Security Hub centraliza
        |
 Detective ajuda a investigar
        |
 CloudTrail informa eventos de API
        |
 Equipe corrige permissões/credenciais
        |
 Config e CloudWatch ajudam a acompanhar
```

Nem todas as etapas são automáticas ou obrigatórias: o diagrama ensina as responsabilidades relativas dos serviços.

---
# 10. Acesso à AWS, automação e infraestrutura como código

> **Nomes completos nesta página:** AWS Identity and Access Management (**IAM**); Amazon Simple Storage Service (**S3**); Amazon Virtual Private Cloud (**VPC**).
**[ESSENCIAL — Domínio 3.1]**

Antes de escolher serviços, entenda **como recursos são criados e operados**. Existem maneiras diferentes de pedir à AWS para executar uma operação, mas todas se conectam às APIs dos serviços.

## 10.1. Management Console, CLI, SDK e APIs

| Meio | O que é | Quando faz sentido |
|---|---|---|
| **AWS Management Console** | Interface web de administração | Exploração, inspeção visual, operações ocasionais |
| **AWS CLI** | Linha de comando da AWS | Scripts, automação, operações programáticas |
| **AWS SDKs** | Bibliotecas em linguagens como TypeScript, Python, Java | Aplicações que consomem serviços AWS |
| **APIs** | Interfaces de operações dos serviços | Integrações em geral, base de CLI e SDKs |
| **AWS CloudFormation** | Definição de infraestrutura por templates declarativos | Implantação repetível, versionada e auditável |

Exemplo de aplicação: no backend você pode usar um **AWS SDK** para enviar um objeto ao S3. Já a criação dos buckets, IAM roles e alarmes pode ser feita com **CloudFormation**. São camadas distintas.

## 10.2. Declarativo versus imperativo

**Imperativo:** “crie a VPC, depois a subnet, depois a security group, depois a instância”. Você descreve uma sequência de comandos.

**Declarativo:** “quero que exista uma VPC com estas subnets e configurações”. A ferramenta calcula ações para alcançar o estado especificado.

O **CloudFormation** usa templates (YAML ou JSON), organiza recursos em stacks e gerencia sua criação/atualização/exclusão conforme características do serviço. Diminui a divergência entre ambientes e facilita revisão de mudanças.

### Vantagens da IaC

- Recriar ambientes de teste/produção de modo consistente.
- Manter histórico no Git.
- Auditar quem alterou definições de infraestrutura.
- Automatizar deploy e reduzir erros manuais.
- Detectar/driblar *configuration drift* conforme ferramenta e configuração.

**Pegadinha:** uma interface gráfica não é “menos segura” por definição, nem a CLI é automaticamente IaC. Um script com comandos manuais encadeados pode automatizar operações, mas **IaC** costuma enfatizar representação versionável da infraestrutura desejada.

## 10.3. Provisionamento versus deploy de aplicações

- **CloudFormation:** orquestra a criação de recursos de infraestrutura.
- **Elastic Beanstalk:** plataforma de deploy e gerenciamento de aplicações; provisiona recursos subjacentes.
- **AWS Amplify:** ferramentas/serviços para criação, hospedagem e integração de aplicações web/mobile.
- **AWS CodeBuild:** executa builds e testes.
- **AWS CodePipeline:** organiza estágios de CI/CD.
- **AWS X-Ray:** tracing distribuído para acompanhar caminhos de requisições em sistemas compatíveis.

Exemplo: um push no repositório pode iniciar CodePipeline, que chama CodeBuild e aciona o deploy. O CloudWatch observa o resultado em produção. Serviços diferentes, fases diferentes.

## 10.4. Implantação local, cloud e híbrida

O guia também testa se você sabe **identificar o modelo de implantação**, independentemente da ferramenta:

- Tudo em datacenter próprio: on-premises.
- API e banco na AWS: cloud.
- Parte AWS e parte no datacenter: híbrido.
- Infraestrutura AWS instalada localmente via **AWS Outposts**, dentro de uma arquitetura mais ampla: possibilidade de integração híbrida com operações AWS localizadas.

---

# 11. Computação: EC2, escalabilidade, contêineres e serverless

> **Nomes completos nesta página:** Amazon Elastic Compute Cloud (**EC2**); Amazon Elastic Block Store (**EBS**); Elastic Load Balancing (**ELB**); Application Load Balancer (**ALB**); Network Load Balancer (**NLB**); Gateway Load Balancer (**GWLB**); Amazon Elastic Container Registry (**ECR**); Amazon Elastic Container Service (**ECS**); Amazon Elastic Kubernetes Service (**EKS**); AWS Identity and Access Management (**IAM**); Amazon Simple Storage Service (**S3**).
**[ESSENCIAL — Domínio 3.3]**

Este é um dos capítulos mais importantes: quase todas as outras camadas de uma aplicação dependem de saber onde e como o código executa.

## 11.1. O que é Amazon EC2?

**Amazon Elastic Compute Cloud (EC2)** oferece capacidade computacional em instâncias virtuais. Você escolhe sistema operacional/imagem, classe e tamanho, redes, discos e permissões; pode instalar serviços e executar aplicações.

Se você contratar EC2, a AWS mantém o servidor físico e virtualização. **Você**, em geral, administra o SO da instância, patching, dependências, aplicação e configurações pertinentes.

### Conceitos EC2 mais cobrados

- **Instance type:** combinação de CPU, memória, rede e demais características. Ex.: propósito geral, otimizado para computação, memória ou armazenamento.
- **AMI (Amazon Machine Image):** imagem/base para iniciar uma instância.
- **EBS:** volume persistente em bloco, com ciclo de vida independente da instância conforme configuração.
- **Instance store:** armazenamento local temporário associado ao host da instância.
- **Security Group:** regras de tráfego para recursos/interfaces de rede compatíveis.
- **Elastic IP:** endereço IPv4 público estático alocável em cenários suportados; **endereços IPv4 públicos podem gerar custo**, inclusive quando o recurso fica associado, conforme preços atuais.
- **User data:** instruções de inicialização automatizada.
- **Key pair / Session Manager:** meios de acesso administrativo segundo configuração.
- **Auto Scaling Group:** gerencia capacidade do grupo e substituição de instâncias, conforme políticas.
- **ELB:** serviço de balanceamento de tráfego entre destinos.

### Famílias de instância: por que há tantas?

| Perfil | Prioriza | Exemplo de workload |
|---|---|---|
| General purpose | Equilíbrio CPU/memória/rede | API web convencional |
| Compute optimized | Poder de processamento | Processamento intensivo, simulações |
| Memory optimized | Mais RAM relativa | Análises em memória, cache especializado |
| Storage optimized | I/O e armazenamento local apropriados | Grandes conjuntos de dados com I/O intenso |
| Accelerated computing | GPU/accelerators | Renderização, treinamento/inferência conforme workload |

**A prova pede o perfil, não a decoreba de tamanhos de instância.** Quando o gargalo é CPU, pense compute-optimized; quando é memória, memory-optimized.

### Estados e persistência

- **Running:** instancia ativa e sujeita a cobrança de computação conforme modelo.
- **Stopped:** computação encerrada temporariamente; **volumes EBS associados podem continuar cobrados** e outros recursos podem ter custo.
- **Terminated:** instância finalizada; persistência de EBS depende de configuração de exclusão no encerramento e outros recursos associados.
- **Instance store:** é efêmero; conteúdo normalmente não persiste em eventos como stop/terminate do host/instância.

**Pegadinha financeira:** “parei EC2, logo não tenho mais custos” é falso. EBS, snapshots, endereços IPv4 e outros itens podem continuar a ser cobrados.

## 11.2. Auto Scaling versus Load Balancing

Imagine uma aplicação com 3 instâncias. O trabalho chega por um endereço único.

**Elastic Load Balancing (ELB):** recebe e **distribui requisições/conexões** entre destinos registrados, com verificações de saúde compatíveis.

**EC2 Auto Scaling:** mantém quantidade desejada de instâncias e pode crescer/diminuir conforme regras/métricas, substituindo instâncias não saudáveis conforme configurações.

```text
                Usuários
                   |
              Load Balancer
             /      |       \
           EC2     EC2      EC2
                  (ASG)
           aumenta para 6 no pico,
           reduz para 2 após demanda
```

### Tipos importantes de balanceador

- **Application Load Balancer (ALB):** camada 7, HTTP/HTTPS; roteamento por host/caminho, útil para web/APIs.
- **Network Load Balancer (NLB):** camada 4 para tráfego de rede, útil com exigências de performance, protocolos e endereçamento.
- **Gateway Load Balancer (GWLB):** integração/distribuição para appliances virtuais de rede.

A CLF cobra mais frequentemente a **finalidade** do balanceamento do que parâmetros avançados.

## 11.3. Contêineres: o que resolvem?

Um contêiner empacota a aplicação e suas dependências em uma imagem executável, isolada em ambiente apropriado. Ele reduz diferenças entre desenvolvimento e produção e facilita replicar processos.

**Imagem:** artefato imutável que serve de base para a execução.  
**Contêiner:** instância em execução derivada da imagem.  
**Registry:** lugar onde ficam armazenadas imagens; na AWS, **ECR**.

### ECS, EKS, ECR e Fargate

| Serviço | Função | Como pensar |
|---|---|---|
| **Amazon ECR** | Registro de imagens de contêiner | “Onde guardo a imagem?” |
| **Amazon ECS** | Orquestra e agenda contêineres | “Como executo e administro os serviços de contêiner?” |
| **Amazon EKS** | Kubernetes gerenciado | “Preciso da API/ecossistema Kubernetes.” |
| **AWS Fargate** | Capacidade de computação serverless para contêineres compatíveis | “Não quero administrar nós EC2 de contêiner.” |

**ECS e EKS não são alternativas a ECR:** ambos podem usar imagens armazenadas no ECR. **Fargate não substitui ECS/EKS** como orquestrador; é uma opção de execução.

### ECS em EC2 versus ECS em Fargate

```text
ECS + EC2:
  você administra hosts EC2
  ECS agenda contêineres nesses hosts
  você cuida do SO/patching das instâncias

ECS + Fargate:
  você define tarefas e configurações
  AWS fornece/gerencia a infraestrutura de execução
  você ainda cuida de código, imagem, IAM e rede
```

Um serviço **Fargate** pode ter containers com processamento contínuo; *serverless* não significa “só funciona por evento” nem “não tem custos quando há tarefas ligadas”.

### Exemplo concreto com uma API

Você publica a imagem `biblioteca-api` no ECR. Um serviço ECS executa três tarefas Fargate dessa imagem, distribuídas de acordo com sua arquitetura. Um ALB encaminha chamadas da internet. Task roles permitem ler segredos do Secrets Manager ou objetos no S3. CloudWatch armazena logs e métricas. Há ao menos **cinco problemas distintos**, resolvidos por serviços diferentes.

## 11.4. AWS Lambda

**Lambda** é computação serverless baseada em funções/eventos. A AWS gerencia infraestrutura de execução e escalabilidade dentro de cotas; você fornece código, dependências, gatilhos, configuração e permissões.

Cenários típicos:
- Processar arquivo quando chega ao S3.
- Executar tarefas ao receber evento EventBridge.
- Construir um endpoint através de integração com API Gateway.
- Reagir a mensagens de filas (com cuidados de processamento).

**Limites conceituais:** funções têm limitações de execução e recursos, possibilidade de *cold start*, formas específicas de integração e cobrança baseada em características de requisições e duração/capacidade. Para workloads permanentemente ligados ou de longa duração, contêineres/EC2 podem ser alternativas mais apropriadas.

**Pegadinha:** Fargate executa **contêineres**, Lambda executa **funções**. Ambos podem ser serverless, mas não são equivalentes.

## 11.5. Serviços adicionais de computação

- **AWS Batch:** agenda e executa tarefas de processamento em lote (*batch*), escolhendo recursos compatíveis.
- **AWS Elastic Beanstalk:** simplifica deploy e operação de aplicações gerenciando recursos AWS por você, com opções de personalização.
- **Amazon Lightsail:** oferta simplificada de computação e outros componentes para sites/aplicações de menor complexidade.
- **AWS Outposts:** infraestrutura/serviços AWS em instalações do cliente para cargas que precisam permanecer locais.
- **AWS Auto Scaling:** família de recursos para ajustar capacidades de serviços compatíveis.

## 11.6. Árvore de decisão: onde executar uma aplicação?

```text
Preciso executar código
  |
  +-- Preciso administrar SO/instância ou software muito específico?
  |       -> EC2
  |
  +-- Já possuo contêineres?
  |       |
  |       +-- Preciso de Kubernetes? -> EKS
  |       +-- Orquestração AWS nativa? -> ECS
  |       +-- Não quero gerenciar hosts? -> Fargate com orquestrador compatível
  |
  +-- Funções acionadas por eventos/curta duração?
  |       -> Lambda
  |
  +-- Site/aplicação simples com caminho de implantação simplificado?
          -> Lightsail ou Elastic Beanstalk, conforme requisitos
```

### Revisão ativa

1. O que garante elasticidade: ALB ou Auto Scaling? **Auto Scaling**; ALB distribui carga.
2. Onde uma imagem é guardada? **ECR**.
3. Empresa usa Kubernetes e quer plano de controle gerenciado. **EKS**.
4. Equipe não quer administrar servidores de contêineres. **Fargate**.
5. Como dar a uma tarefa ECS permissão para ler S3? **IAM task role** com políticas adequadas.
6. Uma API precisa preservar estado de usuário. É boa ideia guardá-lo só na memória de uma instância escalável? **Não**; distribua o estado em armazenamento/serviço apropriado.

---

# 12. Redes: VPC, sub-redes, DNS, CDN e conectividade

> **Nomes completos nesta página:** Amazon Virtual Private Cloud (**VPC**); Application Load Balancer (**ALB**); Network Load Balancer (**NLB**); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**).
**[ESSENCIAL — Domínio 3.5]**

Para entender redes AWS, separe quatro perguntas: **onde está o recurso?**, **por onde os pacotes passam?**, **quem pode se conectar?** e **como o usuário descobre o endereço?**.

## 12.1. O que é uma VPC?

**Amazon Virtual Private Cloud (VPC)** é uma rede virtual logicamente isolada na AWS. Você define blocos de endereçamento (CIDR), subnets, regras de rotas e controles de segurança.

Uma **subnet** pertence a uma única **Availability Zone**. A **VPC** é um recurso regional e pode conter subnets em várias AZs.

### Endereços

- **IP privado:** usado internamente na rede; pode participar de redes corporativas conectadas.
- **IP público:** roteável pela internet, condicionado a rotas e regras adequadas.
- **CIDR:** notação de blocos de endereços (por exemplo `10.0.0.0/16`).
- **DNS:** traduz nomes em endereços ou outros registros necessários.

## 12.2. Public subnet versus private subnet

A regra mental correta gira principalmente em torno da **tabela de rotas**.

- **Subnet pública:** sua tabela de rotas possui caminho adequado para Internet Gateway para o tráfego destinado à internet. Uma instância ainda precisa de endereçamento público e controles apropriados para acesso direto externo.
- **Subnet privada:** não tem rota direta para Internet Gateway destinada à internet pública; pode acessar a internet de saída via NAT Gateway (IPv4) ou outros mecanismos conforme arquitetura.

Uma subnet pública **não transforma automaticamente toda instância em publicamente acessível**. IP e security group importam.

### Internet Gateway e NAT Gateway

- **Internet Gateway (IGW):** permite comunicação entre VPC e internet quando endereçamento, rotas e regras permitem.
- **NAT Gateway:** viabiliza **saída IPv4** para recursos privados rumo à internet ou serviços externos, com retorno da conexão. Não é mecanismo para receber conexão nova arbitrária da internet em instâncias privadas.
- **Egress-only Internet Gateway:** alternativa para saída IPv6, com funcionamento distinto do NAT IPv4.

**Exemplo:** backend na subnet privada precisa baixar dependência externa; NAT Gateway pode prover saída. Se só precisa conversar com S3/DynamoDB, **VPC endpoints** podem oferecer acesso sem depender de NAT para determinados serviços.

## 12.3. Tabela de rotas: a decisão de caminho

Uma tabela de rotas determina qual é o destino do tráfego para determinados intervalos de endereços. Uma subnet é associada a uma tabela de rotas. O mecanismo escolhe a rota mais específica aplicável, obedecendo às regras do produto.

Se a subnet privada não tem rota apropriada para um destino, não adianta abrir security group: tráfego não conseguirá chegar ao endereço pretendido.

**Interprete camadas na ordem:**
1. Existe rota para o destino?
2. Existem endereços e gateways adequados?
3. Os filtros de rede permitem entrada/saída?
4. A aplicação está ouvindo a porta certa e a autenticação autoriza a chamada?

## 12.4. Security Groups versus Network ACLs

Essa é uma das comparações clássicas.

| Característica | Security Group (SG) | Network ACL (NACL) |
|---|---|---|
| Atua em | Interface/recursos de rede associados | Fronteira de subnet |
| Stateful? | **Sim**: resposta ao tráfego permitido é acompanhada | **Não**: tratar regras de entrada e saída explicitamente |
| Regras de bloqueio | Regras **allow** (negação via ausência de permissão) | Regras **allow** e **deny** |
| Ordem de regras | Sem números/ordem explícita | Regras numeradas em ordem de avaliação |
| Uso principal | Firewall de recursos | Camada adicional de controle da subnet |

**Exemplo:** SG do RDS só permite conexões de outro SG do backend na porta do banco. Isso é melhor que permitir acesso do mundo inteiro à porta 5432. Uma NACL pode adicionar uma camada de restrição à subnet, mas exige cuidado com regras de retorno/portas efêmeras.

**Macete correto:** *SG = stateful e associado ao recurso. NACL = stateless e associado à subnet.*

## 12.5. Arquitetura VPC de três camadas

```text
                  INTERNET
                      |
                Route 53 (DNS)
                      |
                    ALB
              /               \
        Subnet pública    Subnet pública
           AZ-a               AZ-b
              \                /
       Backend em subnets privadas
         API AZ-a       API AZ-b
              \           /
               RDS Multi-AZ
           em subnets privadas
```

O ALB pode ser público e encaminhar requisições para targets em subnets privadas. Um banco de produção normalmente **não precisa** ter acesso público. É padrão conceitual; detalhes de configuração dependem da solução.

## 12.6. Route 53, CloudFront, API Gateway e Global Accelerator

**Amazon Route 53:** DNS gerenciado; também oferece registro de domínios e roteamento/health checks conforme recursos. Se o enunciado diz “resolver nome `api.exemplo.com`”, pense Route 53.

**Amazon CloudFront:** CDN de baixa latência e distribuição global. Pode armazenar conteúdo em cache e proteger/entregar conteúdo web a partir de edge locations, trabalhando com origens como S3 e ALB. Pode distribuir conteúdo dinâmico, embora o cache dependa de políticas apropriadas.

**Amazon API Gateway:** publicação e gerenciamento de APIs, com recursos como autenticação/autorização integrável, limites e controle de tráfego conforme tipo de API. Não é sinônimo de ALB; os dois podem receber tráfego HTTP, mas resolvem problemas e oferecem capacidades distintas.

**AWS Global Accelerator:** usa a rede global AWS e endereços IP estáticos anycast para acelerar tráfego suportado até endpoints regionais, melhorando disponibilidade e performance de rede de determinadas aplicações. Não é simplesmente “outro nome do CloudFront”: CDN foca distribuição/cache HTTP(S), GA foca roteamento/aceleração de rede.

### Comparativo de escolha

| Requisito | Serviço mais típico |
|---|---|
| Traduzir domínio em endpoint | Route 53 |
| Servir JS/CSS/imagens globalmente com cache | CloudFront |
| API gerenciada com throttling/authorizers | API Gateway |
| Distribuir tráfego para múltiplas instâncias da aplicação | ALB/NLB |
| Aceleração global de rede com IPs estáticos | Global Accelerator |

## 12.7. Conectividade privada e híbrida

**AWS Site-to-Site VPN:** conexão criptografada pela internet entre rede corporativa e AWS.

**AWS Client VPN:** conectividade VPN de clientes/dispositivos individuais a redes AWS ou conectadas, conforme configuração.

**AWS Direct Connect:** conexão de rede dedicada entre o ambiente do cliente e AWS via provedores/localizações apropriadas. Oferece características de conectividade previsíveis; **não equivale automaticamente a criptografia de ponta a ponta**. Se criptografia for requisito, combine com mecanismos apropriados.

**AWS Transit Gateway:** hub para conectar e rotear tráfego entre múltiplas VPCs e redes conectadas, reduzindo complexidade de conexões ponto a ponto.

**AWS PrivateLink:** acesso privado a serviços compatíveis através de endpoints, sem exposição do serviço à internet pública; útil para integração de serviços entre VPCs/contas.

**VPC endpoints:** acesso privado a serviços AWS compatíveis; tipos incluem gateway endpoints e interface endpoints (geralmente baseados em PrivateLink), com regras/precificação distintas.

### Não confunda

- **VPN** → túnel protegido via internet.
- **Direct Connect** → ligação dedicada.
- **Transit Gateway** → hub de conectividade/roteamento.
- **PrivateLink** → consumir serviço por conectividade privada.
- **VPC Peering** → comunicação direta entre VPCs compatíveis (conceito útil, mesmo que não seja um item de destaque da lista oficial).

---

# 13. Armazenamento: S3, EBS, EFS, FSx, backup e recuperação

> **Nomes completos nesta página:** Amazon Simple Storage Service (**S3**); Amazon Elastic Block Store (**EBS**); Amazon Elastic File System (**EFS**); AWS Elastic Disaster Recovery (**AWS DRS**); Amazon Elastic Compute Cloud (**EC2**); Amazon Elastic Container Service (**ECS**); AWS Identity and Access Management (**IAM**); AWS Key Management Service (**AWS KMS**). **Amazon FSx** é o nome oficial da família de sistemas de arquivos e não uma sigla a ser expandida.
**[ESSENCIAL — Domínio 3.6]**

O primeiro raciocínio é saber qual **modelo de armazenamento** você precisa:

1. **Objetos:** acessados por chave/API (S3).
2. **Blocos:** volumes semelhantes a discos para SO/sistemas de arquivos (EBS, instance store).
3. **Arquivos compartilhados:** sistema de arquivos acessível por montagens/protocolos (EFS, FSx).

## 13.1. Amazon S3: armazenamento de objetos

**Amazon Simple Storage Service (S3)** guarda **objetos** dentro de **buckets**. Cada objeto possui dados e metadados, identificado por uma **key**. Aplicações normalmente interagem via APIs HTTP/SDKs.

Uso:
- Arquivos estáticos, imagens e documentos.
- Backups e arquivos de retenção.
- Data lakes e ingestão analítica.
- Artefatos/relatórios gerados por aplicações.
- Origem de arquivos estáticos para CloudFront.

**S3 não é um “disco EBS gigante”.** Você não instala o sistema operacional em bucket S3 como faria em bloco EC2. Existem integrações/montagens especiais, mas para a prova foque nos modelos fundamentais.

### Classes de armazenamento S3

A AWS varia os preços conforme armazenamento, requisições, recuperação, períodos mínimos e saída de dados. Escolher a classe envolve **frequência de acesso, latência exigida, redundância e custo total**.

| Classe | Uso intuitivo | Atenção |
|---|---|---|
| **S3 Standard** | Uso frequente e acesso imediato | Maior adequação geral a dados ativos |
| **S3 Intelligent-Tiering** | Acesso imprevisível | Automatiza movimentação em camadas conforme atividade e regras do produto |
| **S3 Standard-IA** | Acesso raro, mas rápido quando necessário | Custos de recuperação e duração mínima aplicáveis |
| **S3 One Zone-IA** | Acesso raro com redundância em **uma AZ** | Menor resiliência à perda daquela AZ |
| **S3 Glacier Instant Retrieval** | Arquivamento raro que exige recuperação imediata | Regras de custo/duração mínima |
| **S3 Glacier Flexible Retrieval** | Arquivos de recuperação não necessariamente instantânea | Tempos e modos de recuperação |
| **S3 Glacier Deep Archive** | Arquivamento muito longo e acesso raríssimo | Recuperação geralmente mais demorada |

### Como decidir?

- Conteúdo web ativo → **Standard**.
- Padrão de uso desconhecido ou mutável → **Intelligent-Tiering**.
- Backup acessado raramente, mas com recuperação rápida → **Standard-IA**, dependendo do custo.
- Arquivo que só será consultado em auditoria eventual → **Glacier** apropriado.
- Dados recriáveis sem necessidade de redundância multi-AZ e com acesso infrequente → **One Zone-IA** pode fazer sentido.

**Não decore preços ou prazos como se fossem imutáveis.** A certificação cobra mais a diferença de cenário. Algumas classes têm cobrança mínima por armazenamento/duração e por recuperação.

## 13.2. S3: conceitos operacionais que valem entender

- **Versioning:** retém versões dos objetos quando habilitado; útil contra exclusão/sobrescrita acidental, mas pode aumentar custos.
- **Lifecycle policies:** automação da transição de objetos entre classes e/ou expiração conforme regras.
- **Replication:** cópia automática de objetos para buckets conforme configuração; pode ocorrer entre Regiões ou na mesma Região.
- **Block Public Access:** controles para prevenir exposição pública não intencional.
- **Bucket policies:** controle de acesso baseado no recurso; combinam-se com IAM.
- **Criptografia:** S3 oferece mecanismos de criptografia no lado do servidor, inclusive integrações com KMS, além de TLS em trânsito.
- **Presigned URL:** acesso temporário a um objeto/ação sob condições definidas, sem publicar o bucket inteiro.
- **S3 event notifications:** podem acionar integrações como filas, notificações e Lambda em cenários suportados.
- **Durabilidade versus disponibilidade:** armazenar múltiplas cópias protege contra perdas; acesso depende de outros fatores e SLA/classe.

### Exemplo de lifecycle

Relatórios diários:
- primeiros 30 dias: acesso frequente;
- próximos meses: acesso raro;
- após 12 meses: arquivo;
- após o prazo legal de retenção: exclusão.

Uma política de lifecycle pode automatizar movimentos/expiração **se configurada corretamente**. Evite copiar manualmente milhares de objetos todo mês.

## 13.3. EBS e instance store

**Amazon EBS (Elastic Block Store)** fornece volumes persistentes de blocos para workloads EC2 compatíveis. Pense em discos virtuais usados por aplicações e sistemas operacionais.

**Instance store** é armazenamento local temporário diretamente ligado à infraestrutura da instância apropriada. É útil para dados intermediários/cache que podem ser recriados; não trate como fonte única de dados importantes.

| Critério | EBS | Instance store |
|---|---|---|
| Persistência | Independente da vida da instância conforme configuração | Efêmero |
| Modelo | Blocos | Blocos locais |
| AZ | Volumes em uma AZ, com mecanismos de snapshot/replicação conforme recursos | Associado ao host da instância |
| Uso | Disco do SO, aplicações, dados persistentes | Cache/scratch e dados temporários |
| Backup | Snapshots EBS/AWS Backup | Exige estratégia própria se dados precisarem ser preservados |

**Snapshot EBS:** captura de estado do volume usando mecanismo de snapshots gerenciado; é ferramenta importante de backup/recuperação. Volumes EBS são associados a uma AZ; snapshots permitem criar volumes em outras AZs e podem ser copiados entre Regiões conforme condições.

## 13.4. Amazon EFS e Amazon FSx

**Amazon EFS (Elastic File System):** sistema de arquivos **NFS** totalmente gerenciado para workloads Linux e compatíveis, compartilhável por vários clientes/instâncias simultaneamente, com escalabilidade automática de capacidade conforme o serviço.

**Amazon FSx:** família de sistemas de arquivos gerenciados para necessidades/protocolos específicos. Exemplos:
- **FSx for Windows File Server:** compartilhamentos SMB e integração típica com ambientes Windows.
- **FSx for Lustre:** sistema de arquivos de alto desempenho para workloads HPC/analíticas.
- **FSx for NetApp ONTAP:** capacidades/protocolos de file storage empresariais.
- **FSx for OpenZFS:** workloads que exigem características desse sistema de arquivos.

**S3 vs EFS vs EBS:**
- Bucket de relatórios acessados por HTTP → **S3**.
- Vários servidores Linux precisam montar mesma pasta → **EFS**.
- Uma instância precisa de volume de disco persistente → **EBS**.
- Servidor Windows requer compartilhamento SMB gerenciado → **FSx for Windows**.

## 13.5. AWS Storage Gateway

Integra sistemas **on-premises** com armazenamento AWS. Pode oferecer opções como file, volume e tape gateway, conforme uso. É útil quando a empresa ainda mantém aplicações e dispositivos locais mas deseja consumir serviços de armazenamento cloud para extensão, backup ou arquivo.

**Pegadinha:** Storage Gateway é **ponte híbrida de armazenamento**, e não sinônimo de VPN ou conexão dedicada.

## 13.6. AWS Backup e AWS Elastic Disaster Recovery

**AWS Backup:** gerencia e automatiza políticas de backup para recursos AWS compatíveis e cenários integrados. Pode centralizar planos, períodos de retenção e aspectos de conformidade de backup.

**AWS Elastic Disaster Recovery (DRS):** ajuda a replicar e recuperar servidores/workloads compatíveis em situações de desastre, com foco em continuidade/recuperação da computação.

**Diferença:** Backup gerencia cópias e recuperação de dados/recursos suportados; DRS foca recuperação de workloads/servidores por replicação. Escolha conforme RTO/RPO e escopo.

## 13.7. Exercício de arquitetura

Uma plataforma gera 50 mil arquivos CSV por dia. O usuário baixa via URL com expiração de 15 minutos. Após 60 dias, as chances de leitura caem muito; é preciso manter histórico por anos.

Uma solução plausível:
1. Gerar arquivos em workloads ECS/Lambda.
2. Armazenar em **S3**.
3. Oferecer links temporários **presigned**, sujeitos às permissões.
4. Usar **lifecycle** para reduzir custos de armazenamento histórico.
5. Configurar proteção de acesso e políticas de retenção adequadas.

Não há necessidade de um EBS diferente para cada arquivo; arquivos de objeto são caso típico para S3.

---
# 14. Bancos de dados: relacionais, NoSQL, cache e migração

> **Nomes completos nesta página:** Amazon Relational Database Service (**RDS**); AWS Database Migration Service (**AWS DMS**); Amazon Elastic Compute Cloud (**EC2**); AWS Schema Conversion Tool (**AWS SCT**).
**[ESSENCIAL — Domínio 3.4]**

## 14.1. Primeiro entenda o problema que bancos resolvem

Uma aplicação precisa guardar e consultar dados, mas nem todo dado tem o mesmo formato nem o mesmo padrão de acesso:

- Pedidos e transações com integridade e relações → bancos relacionais.
- Registros flexíveis e acesso por chaves conhecidas em altíssima escala → bancos chave-valor/documento.
- Respostas muito frequentes que precisam ser rápidas → cache.
- Relações complexas entre vértices e arestas → banco de grafos.
- Pesquisas analíticas em terabytes/petabytes → serviços analíticos e warehouses.

**Não existe “um banco sempre melhor”.** A escolha envolve consistência, latência, modelo de dados, consultas, escala, disponibilidade, operação e custo.

## 14.2. Relacionais versus NoSQL

Um **banco relacional** organiza dados em tabelas com relações, restrições e SQL. São comuns transações ACID e consultas com joins. Exemplos: PostgreSQL e MySQL.

**NoSQL** é um conjunto amplo de modelos não relacionais, como chave-valor, documento e grafo. Pode ser ótima escolha quando o padrão de acesso é bem definido, há requisitos elevados de escala ou estruturas mais flexíveis. Não significa que “NoSQL nunca oferece transações” nem que “SQL não escala”. São simplificações incorretas.

### Exemplo de dados

- `users`, `subscriptions`, `payments` com relacionamentos → RDS/Aurora é uma opção natural.
- Registro por `tenantId` + `timestamp` consultado em chave bem definida e escala enorme → DynamoDB pode ser adequado.
- Recomendar conexões em rede de fornecedores, com muitos saltos entre nós → Neptune.
- Guardar documento JSON semelhante a aplicação MongoDB → DocumentDB é candidato conforme compatibilidade/necessidade.

## 14.3. RDS: banco relacional gerenciado

**Amazon Relational Database Service (RDS)** ajuda a provisionar e operar mecanismos relacionais suportados, com recursos de backup, monitoramento, aplicação de patches/atualizações e alta disponibilidade conforme mecanismo/configuração.

O cliente ainda decide:
- Modelo e esquema dos dados.
- Usuários de banco e privilégios.
- Tamanho/capacidade e controles de acesso.
- Backup/retention e janelas, onde configuráveis.
- Consultas, índices e desempenho da aplicação.
- Versões e políticas operacionais dentro do modelo oferecido.

**RDS em uma frase:** banco relacional em que a AWS assume parte significativa do trabalho operacional de infraestrutura e engine.

## 14.4. Amazon Aurora

**Aurora** é o serviço de banco relacional da AWS compatível com modalidades de MySQL/PostgreSQL, com arquitetura própria e recursos de alta disponibilidade/escala. É um membro importante das ofertas relacionais AWS.

**RDS versus Aurora:** RDS é a família ampla de bancos relacionais gerenciados; Aurora é uma opção/mecanismo dentro do universo relacional gerenciado, com arquitetura e características próprias. A prova pode perguntar “serviço relacional gerenciado com alta performance e compatibilidade MySQL/PostgreSQL” → Aurora é forte candidata se o enunciado destacar essas características.

## 14.5. Multi-AZ versus Read Replica

Esta comparação é indispensável.

| Característica | RDS Multi-AZ (cenário típico) | Read Replica |
|---|---|---|
| Objetivo principal | **Disponibilidade** e recuperação de falhas | **Escala de leitura** |
| Comportamento | Réplica/standby para failover, conforme modalidade | Réplica usada para consultas de leitura |
| Ajuda se AZ primária falhar? | **Sim**, com failover gerenciado conforme configuração | Pode ajudar em estratégias de recuperação, mas não substitui automaticamente Multi-AZ |
| Aumenta capacidade de leitura? | Não é a finalidade clássica do standby Multi-AZ | **Sim** |
| Replicação | Modalidades variam; o modelo tradicional usa replicação síncrona para standby | Frequentemente assíncrona, portanto pode haver atraso |

**Nuance técnica:** ofertas Multi-AZ de clusters podem ter instâncias leitoras. Portanto, a regra acima é o modelo de comparação **típico para a prova**, não a afirmação absoluta de que nenhuma arquitetura Multi-AZ fornece leituras adicionais.

**Pergunta:** “O banco cai quando ocorre falha da AZ e queremos failover automático.” → **Multi-AZ**.  
**Pergunta:** “O banco está saudável, mas sobrecarregado por relatórios de leitura.” → **Read Replicas**.

## 14.6. DynamoDB

**Amazon DynamoDB** é serviço **NoSQL totalmente gerenciado e serverless** de chave-valor/documentos, com foco em baixa latência e escala. Modela acessos usando chaves de partição e, opcionalmente, ordenação, índices e recursos específicos.

Não é substituição 1:1 de um banco relacional. Você projeta o esquema de acesso levando em conta consultas por chaves e padrões esperados.

Cenários:
- Catálogo de sessões/metadados em grande escala.
- Dados de usuários consultados por identificador.
- Eventos/estado de workloads que se encaixam em modelo chave-valor.
- Aplicações cuja carga varia e devem escalar sem gerenciar servidores de banco.

**Pegadinha:** sem servidor administrado por você não significa zero custo. DynamoDB cobra por modalidades de capacidade/uso, armazenamento e recursos auxiliares.

## 14.7. ElastiCache: o cache em memória

**Amazon ElastiCache** oferece cache em memória gerenciado, com mecanismos suportados como Redis OSS/Valkey e Memcached em modalidades específicas. Cache reduz latência e/ou carga no banco principal.

### Cache não é o “banco definitivo” de qualquer aplicação

Imagine 5 mil consultas por segundo ao status mais recente de uma entrega. Você pode consultar RDS a cada chamada, mas talvez seja melhor manter resultados com TTL curto em cache. Ainda assim, precisa decidir política de invalidação e fonte de verdade.

- Banco principal guarda o estado que precisa ser preservado.
- Cache guarda dados frequentemente acessados para acelerar recuperação.
- *Cache miss* consulta fonte original e preenche cache.
- *Cache stale* pode devolver valor desatualizado; TTL e invalidação importam.

A prova tende a cobrar **“melhorar latência de leitura e reduzir pressão no banco”** → ElastiCache.

## 14.8. DocumentDB e Neptune

- **Amazon DocumentDB:** banco gerenciado orientado a documentos com compatibilidade com determinadas APIs/workloads MongoDB. Bom candidato para conjuntos documentais e consultas associadas.
- **Amazon Neptune:** banco de grafos para relações complexas e consultas de grafos (relações sociais, detecção de fraude, recomendações etc.).

Não confunda **DocumentDB (documentos)** com **DynamoDB (chave-valor/documento serverless)**: ambos lidam com dados não relacionais, mas têm APIs, mecanismos e modelos distintos.

## 14.9. Banco autogerenciado em EC2 versus gerenciado

**EC2 + PostgreSQL** pode oferecer grande controle sobre SO, extensões e engine, mas você administra backups, atualizações, failover e recuperação. **RDS PostgreSQL** transfere parte desse trabalho operacional à AWS, embora possa impor certas restrições técnicas.

**Padrão de prova:** se pede “reduzir administração de banco relacional”, escolha serviço gerenciado (RDS/Aurora), salvo requisitos de controle incompatíveis.

## 14.10. Migração de bancos: DMS e SCT, revisados

- **DMS:** move/replica dados de banco para destinos suportados, podendo acompanhar alterações e reduzir interrupções durante migração.
- **SCT:** converte esquemas e código de banco quando mecanismos diferem e há elementos compatíveis com a ferramenta.

Exemplo: SQL Server → PostgreSQL pode requerer conversão de objetos SQL e replicação de dados. SCT e DMS resolvem partes diferentes.

### Checklist mental do capítulo

- SQL relacional gerenciado → **RDS/Aurora**.
- NoSQL serverless chave-valor/documento → **DynamoDB**.
- Cache em memória → **ElastiCache**.
- Documentos compatíveis com determinado ecossistema → **DocumentDB**.
- Relações e grafos → **Neptune**.
- Failover de banco → **Multi-AZ**.
- Escalar consultas → **Read replica**.
- Migrar dados → **DMS**.
- Converter esquema → **SCT**.

---

# 15. Monitoramento, operações e ferramentas de desenvolvedor

> **Nomes completos nesta página:** Amazon Elastic Compute Cloud (**EC2**); Amazon Elastic Container Registry (**ECR**); Amazon Elastic Container Service (**ECS**); Amazon Elastic Kubernetes Service (**EKS**); AWS Identity and Access Management (**IAM**); Amazon Simple Notification Service (**Amazon SNS**).
**[ESSENCIAL — Domínios 2.2, 3.1 e 3.8]**

Uma aplicação não está operacionalmente madura só porque o deploy funcionou. Você precisa **saber se está saudável, detectar problemas, explicar incidentes e evoluir sem causar falhas desnecessárias**.

## 15.1. Observabilidade: métricas, logs e traces

**Métricas:** séries numéricas agregadas ao longo do tempo. Ex.: CPU média, taxa de erro 5xx, latência p95 e número de mensagens na fila.

**Logs:** registros de eventos e contexto. Ex.: `POST /reports -> 500` acompanhado de identificador de requisição.

**Traces (rastreamentos):** caminho de uma requisição atravessando componentes. Ex.: navegador → API Gateway → Lambda → DynamoDB.

Os três se complementam. Uma métrica mostra *que algo piorou*, um log mostra *o que ocorreu num componente* e um trace pode ajudar a identificar *onde a latência se concentrou*.

## 15.2. Amazon CloudWatch

CloudWatch disponibiliza vários recursos para monitoramento e observabilidade:

- **Metrics:** agregações e valores numéricos coletados de recursos/aplicações.
- **Logs:** ingestão, busca e retenção de logs.
- **Alarms:** avaliação de métricas segundo limiares/condições.
- **Dashboards:** painéis com visualização do estado operacional.
- **Integração com ações:** alarmes podem acionar notificações e automações em cenários suportados.

Exemplo:
- Métrica da API: taxa de erro > 5%.
- Alarm: erro acima do limiar durante janelas definidas.
- Ação: notificação a um tópico SNS para alertar equipe.

**Pegadinha:** uma métrica de CPU em CloudWatch não prova quem fez uma alteração IAM; para ações de API, pense **CloudTrail**.

## 15.3. AWS CloudTrail

CloudTrail registra atividade de contas e chamadas de API. É usado para:
- Investigar mudanças administrativas.
- Apoiar auditoria e investigações.
- Identificar usuário/principal e origem das ações registradas.
- Manter trilhas apropriadas para conformidade.

**Exemplo:** uma regra de security group foi aberta para `0.0.0.0/0`. CloudTrail pode ajudar a descobrir a chamada que alterou a regra e a identidade associada.

**Nuance:** habilitar e reter trilhas de eventos adequadas importa; nem todo tipo de evento de dados é coletado automaticamente por todas as configurações.

## 15.4. AWS Config

Config ajuda a registrar **estado e histórico da configuração de recursos** e avaliar conformidade com regras. Ex.: “todos os volumes suportados precisam estar criptografados” ou “security groups não devem expor determinadas portas”.

A diferença:
- CloudTrail = **ações/eventos**.
- Config = **inventário, estado e mudanças de configuração**.
- CloudWatch = **métricas/logs/observabilidade**.

## 15.5. X-Ray e saúde dos serviços

**AWS X-Ray:** rastreamento distribuído para compreender requisições e dependências em aplicações integradas. Se a latência está escondida entre dois microsserviços, traces são especialmente úteis.

**AWS Health Dashboard:** mostra eventos conhecidos de saúde/impacto e informações específicas da conta quando aplicáveis.  
**AWS Health API:** permite obter informações de saúde programaticamente, conforme requisitos de acesso.  
**AWS Service Health:** visão de saúde geral dos serviços/regiões compatíveis.

**Diferença:** CloudWatch mostra o desempenho de seus recursos e métricas; AWS Health comunica eventos de serviços da AWS que podem afetá-los. As duas fontes se complementam.

## 15.6. Trusted Advisor versus Compute Optimizer versus Well-Architected Tool

- **Trusted Advisor:** verificações/recomendações de boas práticas, como oportunidades de custo, segurança e serviço, conforme plano e recursos habilitados.
- **Compute Optimizer:** recomendações para dimensionamento/eficiência de recursos computacionais compatíveis segundo uso.
- **Well-Architected Tool:** avaliação guiada das workloads segundo pilares e perguntas de arquitetura.

**A pergunta importa:**
- “Quais boas práticas de ambiente AWS estão faltando?” → Trusted Advisor.
- “Minha instância tem RAM/CPU excessiva; que tamanho poderia ser mais adequado?” → Compute Optimizer.
- “Quero revisar sistematicamente seis pilares da workload” → Well-Architected Tool.

## 15.7. Systems Manager, Service Quotas e License Manager

**Systems Manager** disponibiliza recursos de operações como inventário, automações, acesso a nós compatíveis, patch management e Parameter Store. Ferramentas concretas e pré-requisitos variam.

**Service Quotas** permite consultar cotas/limites dos serviços e gerenciar solicitações de aumento em serviços suportados. “Auto Scaling aumenta ilimitadamente?” **Não**: cotas e limites de serviço ainda existem.

**License Manager** auxilia no inventário, controle e regras de uso de licenças em cenários compatíveis.

## 15.8. CI/CD: CodeBuild, CodePipeline e o resto

**CI (Continuous Integration):** integrar mudanças frequentemente, rodando builds/testes.  
**CD (Continuous Delivery/Deployment):** manter/releasing software de modo repetível.

| Serviço | Função |
|---|---|
| CodeBuild | Compilar/testar/construir artefatos |
| CodePipeline | Coordenar as etapas do pipeline |
| ECR | Armazenar imagens |
| ECS/EKS/Lambda/EC2/Beanstalk | Executar versões implantadas, conforme solução |
| CloudFormation | Provisionar infraestrutura |
| CloudWatch/X-Ray | Observar produção e investigar problemas |

**Não precisa decorar YAML de pipelines para a Cloud Practitioner.** Reconheça o propósito do serviço.

---

# 16. Integração, mensageria e aplicações empresariais

> **Nomes completos nesta página:** Amazon Elastic Container Service (**ECS**); Amazon Simple Storage Service (**S3**); Amazon Simple Email Service (**Amazon SES**); Amazon Simple Notification Service (**Amazon SNS**); Amazon Simple Queue Service (**Amazon SQS**).
**[ESSENCIAL — Domínio 3.8]**

Este capítulo é sobre desacoplar componentes: em vez de tudo chamar todo mundo sincronamente, aplicações podem enviar mensagens e reagir a eventos.

## 16.1. Chamadas síncronas versus assíncronas

**Síncrona:** a API chama outro serviço e espera a resposta. Simples, mas a latência/falha do serviço chamado se propaga.

**Assíncrona:** a API registra trabalho em uma fila/evento e responde; um consumidor processa depois. Melhora desacoplamento e resiliência, mas introduz eventual consistência, tratamento de duplicidade e necessidade de monitoramento.

### Exemplo: exportação de planilha

Em vez de a requisição HTTP ficar aguardando 90 segundos até o Excel ser gerado:

```text
Usuário pede relatório
    |
Backend recebe e valida pedido
    |
Publica mensagem em SQS
    |
Retorna "processamento iniciado"
    |
Worker ECS/Lambda consome SQS
    |
Gera relatório no S3
    |
Notifica usuário
```

Esta arquitetura permite absorver picos com fila e escalar os workers conforme a demanda.

## 16.2. Amazon SQS — fila de mensagens

**SQS (Simple Queue Service)** armazena mensagens para consumidores processarem de forma assíncrona.

Conceitos:
- **Producer:** quem envia mensagem.
- **Queue:** onde mensagem fica até consumo/remoção.
- **Consumer:** quem recebe/processa.
- **Visibility timeout:** mensagem recebida fica temporariamente invisível para outros consumidores, permitindo processamento.
- **Dead-letter queue (DLQ):** destino para mensagens que falham repetidamente, conforme políticas de redrive.
- **Retention:** quanto tempo uma mensagem pode permanecer na fila.

### Standard versus FIFO

- **Standard:** throughput elevado e modelo de entrega pelo menos uma vez, com ordenação não necessariamente estrita. Consumidores precisam lidar com duplicidades.
- **FIFO:** fornece ordenação dentro de grupos de mensagens e mecanismos de deduplicação/processamento com semânticas específicas. Ainda é prudente projetar consumidores idempotentes.

**Pegadinha:** uma fila não garante que cada mensagem sempre seja processada com sucesso. O consumidor precisa confirmar/remover mensagens e tratar falhas.

## 16.3. Amazon SNS — pub/sub e fan-out

**SNS (Simple Notification Service)** é um sistema gerenciado de **publicação/assinatura e notificações**. Uma mensagem publicada em um tópico pode ser distribuída a vários inscritos/consumidores compatíveis.

**Exemplo:** venda confirmada precisa gerar notificação para analytics, atualização de CRM e e-mail. Um tópico SNS pode distribuir o evento para múltiplas filas/consumidores.

**SQS versus SNS:**
- SQS = **guardar trabalho para consumidores processarem**.
- SNS = **publicar uma mensagem para assinantes**.
- SNS + SQS = padrão clássico de fan-out durável.

## 16.4. Amazon EventBridge — roteamento de eventos

**Amazon EventBridge** ajuda a receber, filtrar e rotear **eventos** entre fontes e destinos compatíveis segundo regras. Pode integrar eventos de serviços AWS, aplicações e provedores SaaS.

Imagine:
- Objeto de dataset publicado.
- Regra recebe evento de conclusão.
- EventBridge entrega evento ao workflow apropriado.

**SNS versus EventBridge:** ambos podem distribuir eventos, mas EventBridge oferece modelo de barramento, regras e roteamento baseado no conteúdo do evento, com integrações próprias. SNS é fortemente associado a tópicos/assinantes e notificações/fan-out.

## 16.5. AWS Step Functions — workflows

**Step Functions** coordena etapas de processos, podendo incluir chamadas a serviços, condições, retries, tratamento de erros e espera.

Exemplo:
1. Validar entrada.
2. Executar função de transformação.
3. Aguardar resultado.
4. Em caso de sucesso, gravar saída.
5. Em caso de erro, notificar e registrar falha.

**SQS guarda mensagens. Step Functions coordena um fluxo de múltiplos passos.**

## 16.6. Amazon SES e Amazon Connect

**Amazon SES (Simple Email Service):** serviço de **envio/recebimento de e-mails em cenários suportados**, frequentemente usado para e-mails transacionais, avisos e integrações de aplicações.

**Amazon Connect:** plataforma de **contact center em nuvem** para atendimento, roteamento e soluções de relacionamento com clientes.

**Pegadinha:** SNS pode enviar notificações para certos tipos de assinantes, inclusive e-mail conforme configuração, mas **SES** é o serviço orientado ao envio/gestão de e-mails de aplicações em volume e com funcionalidades específicas do canal. **Connect** é contact center, não serviço de conexão VPN.

## 16.7. Escolha por intenção

| Enunciado | Solução |
|---|---|
| “Desacoplar produtor e consumidor, processar depois” | SQS |
| “Publicar alerta para muitos assinantes” | SNS |
| “Filtrar eventos por atributos e rotear para destinos” | EventBridge |
| “Orquestrar cinco etapas com retries/branches” | Step Functions |
| “Disparar mensagens de e-mail transacionais” | SES |
| “Criar central de atendimento telefônico/digital” | Amazon Connect |

### Mais uma diferença importante: evento, fila e stream

**Fila:** processamento por consumidores de mensagens individuais e sua retirada.  
**Evento:** ocorrência que descreve uma mudança.  
**Stream:** sequência ordenada/particionada de dados para processamento contínuo por consumidores conforme a plataforma (por exemplo, Kinesis).

Você não precisa dominar internamente o mecanismo de Kinesis para a CLF, mas precisa saber que ele atende fluxos contínuos de dados em tempo real, não uma simples lista de trabalhos pendentes.

---

# 17. Analytics, inteligência artificial e machine learning

> **Nomes completos nesta página:** Amazon Elastic MapReduce (**Amazon EMR**, nome que originou a sigla; o produto usa hoje o nome Amazon EMR); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**).
**[RECONHECIMENTO + FUNDAMENTOS — Domínios 3.7 e 3.8]**

A regra aqui é **memorizar “problema → serviço”**, entendendo o ecossistema. A CLF não requer treinar modelos, codificar jobs Spark ou construir data warehouses.

## 17.1. Diferencie Analytics, Machine Learning e IA generativa

- **Analytics:** consultar, transformar e apresentar dados para entender o que ocorreu.
- **Machine Learning (ML):** aprender padrões a partir de dados para classificação, previsão, recomendação etc.
- **IA generativa:** produzir novos conteúdos/saídas por modelos, incluindo textos e outros formatos.

Nem todo sistema de analytics usa ML; nem toda aplicação de IA generativa exige treinar um modelo do zero.

## 17.2. Amazon Athena

**Athena** permite executar consultas SQL sobre dados armazenados em fontes compatíveis, muito frequentemente **S3**, em modelo serverless. É útil para explorar arquivos estruturados/semiestruturados sem administrar um cluster de banco tradicional.

Exemplo: exportações CSV/Parquet de indicadores em um data lake S3 e consultas SQL para extrair agregações.

**Athena não é o mesmo que RDS:** RDS é banco transacional relacional gerenciado; Athena é motor de consultas analíticas sobre dados externos/lagos.

## 17.3. AWS Glue

**Glue** integra, descobre, cataloga e transforma dados, com capacidades de ETL/ELT e **Data Catalog** para metadados. Pode processar datasets e tornar estruturas consultáveis.

Pense numa esteira:

```text
CSV/Parquet no S3
      |
 Glue cataloga/transforma
      |
 Athena consulta
      |
 QuickSight apresenta
```

É apenas uma arquitetura possível. Não há obrigação de usar Glue para toda consulta Athena.

## 17.4. Amazon Kinesis

**Kinesis** é uma família de serviços para ingestão, processamento e entrega de **dados de streaming**. Casos típicos: telemetria, cliques em sites, eventos contínuos e ingestão em tempo real.

O ponto-chave é **streaming contínuo**, diferente de ETL batch e consultas SQL pontuais.

## 17.5. Amazon Redshift

**Redshift** é um **data warehouse** analítico para consultas sobre conjuntos grandes de dados estruturados e cargas de BI. Diferencia-se de RDS transacional: um warehouse é otimizado para análises agregadas e multidimensionais, não necessariamente para microtransações operacionais de uma aplicação.

**RDS vs Redshift:** aplicação fazendo `INSERT` de pedidos e transações → RDS. Equipe de BI executando agregações de longo período sobre volumes grandes → Redshift.

## 17.6. Amazon EMR

**Amazon EMR** facilita execução de frameworks de big data como Apache Spark e outras tecnologias compatíveis. É útil quando você precisa de ecossistema distribuído de processamento e tem workloads de dados adequados.

**Athena** é ótima para SQL serverless sobre dados; **EMR** é plataforma para execução mais ampla de frameworks/transformações de big data. **Glue** combina capacidades de integração/catálogo/ETL gerenciadas.

## 17.7. Amazon QuickSight e OpenSearch Service

**Amazon QuickSight:** BI e dashboards para visualizar/compartilhar dados analíticos, com funcionalidades atuais de produto que podem evoluir. Serve para **apresentar insights**.

**Amazon OpenSearch Service:** busca, indexação, análise de logs/dados e certos casos de observabilidade/pesquisa de texto conforme recursos suportados.

**Perguntas clássicas:**
- “Criar dashboards de negócios” → QuickSight.
- “Pesquisar rapidamente documentos/logs indexados” → OpenSearch.
- “Executar consultas SQL ad hoc em S3” → Athena.
- “ETL/catálogo” → Glue.
- “Stream em tempo real” → Kinesis.
- “Warehouse analítico” → Redshift.

## 17.8. Amazon SageMaker AI

**SageMaker AI** é um ambiente gerenciado para construir, treinar, ajustar, implantar e operar soluções de machine learning. A CLF avalia reconhecimento da finalidade; não requer conhecimento dos algoritmos e configurações detalhadas.

Exemplo: treinar um modelo de previsão de demanda usando histórico de acessos e hospedar a inferência.

**SageMaker AI ≠ serviço pronto de OCR/tradução.** Para uma função simples e especializada, serviços prontos podem ser mais adequados.

## 17.9. Serviços de IA prontos: memorizar por ação

| Serviço | Ação principal | Exemplo de pedido |
|---|---|---|
| **Amazon Rekognition** | Analisar imagens/vídeos | Identificar objetos/elementos em fotos |
| **Amazon Textract** | Extrair texto, formulários e tabelas de documentos | Ler campos de documentos digitalizados |
| **Amazon Comprehend** | Análise de texto/NLP | Entidades, sentimentos, classificação de textos |
| **Amazon Transcribe** | **Áudio → texto** | Transcrever ligação |
| **Amazon Polly** | **Texto → fala** | Ler uma resposta em voz |
| **Amazon Translate** | Tradução de idiomas | Português → inglês |
| **Amazon Lex** | Interfaces conversacionais/chatbots/voz | Criar bot de atendimento |
| **Amazon Q** | Assistentes e capacidades de IA generativa conforme produto Q | Auxílio a tarefas, buscas ou desenvolvimento |
| **Amazon SageMaker AI** | Ciclo de vida de modelos ML customizados | Desenvolver e implantar modelo próprio |

### Comparações extremamente cobraveis

**Rekognition vs Textract:** primeiro analisa imagens/vídeos; segundo extrai **texto e estrutura documental**. OCR de formulário → Textract.

**Transcribe vs Polly:**  
- Transcribe: **fala → texto**.  
- Polly: **texto → fala**.

**Comprehend vs Translate:**  
- Comprehend: **entende/análise** de linguagem natural.  
- Translate: **traduz** entre idiomas.

**Lex vs Q:**  
- Lex: construir interfaces de chatbot/voz.  
- Q: família de recursos de assistente de IA para produtividade/conhecimento/desenvolvimento, conforme produto.

**Observação de escopo:** a AWS possui outros produtos de IA, como Amazon Bedrock, que podem surgir na sua vida profissional. Para o **escopo explícito do guia CLF-C02 consultado**, estude prioritariamente a lista oficial acima; não presuma que todo serviço novo ou popular seja um tópico oficialmente enumerado.

## 17.10. Pipeline ilustrativo de telemetria

```text
Nova leitura de sensor
         |
      Kinesis
         |
       S3 (raw)
         |
  Glue transforma/cataloga
         |
       Athena
         |
 QuickSight / relatório
```

Em outra arquitetura, resultados podem ser enviados a Redshift, pesquisas podem usar OpenSearch, e modelos de previsão podem ser treinados no SageMaker AI. Os serviços não se excluem necessariamente: cada um cobre uma etapa.

---
# 18. Catálogo complementar: todos os serviços oficiais em escopo

> **Nomes completos nesta página:** AWS Certificate Manager (**ACM**); AWS Database Migration Service (**AWS DMS**); Amazon Elastic Block Store (**EBS**); Amazon Elastic Compute Cloud (**EC2**); Amazon Elastic Container Registry (**ECR**); Amazon Elastic Container Service (**ECS**); Amazon Elastic File System (**EFS**); Amazon Elastic Kubernetes Service (**EKS**); Amazon Elastic MapReduce (**Amazon EMR**, nome que originou a sigla); AWS Identity and Access Management (**IAM**); AWS Key Management Service (**AWS KMS**); Amazon Relational Database Service (**RDS**); AWS Resource Access Manager (**AWS RAM**); Amazon Simple Storage Service (**S3**); AWS Schema Conversion Tool (**AWS SCT**); Amazon Simple Email Service (**Amazon SES**); Amazon Simple Notification Service (**Amazon SNS**); Amazon Simple Queue Service (**Amazon SQS**); Amazon Virtual Private Cloud (**VPC**); AWS Web Application Firewall (**AWS WAF**).
**[CONSULTA/REVISÃO — serviços listados pelo guia AWS CLF-C02]**

Este catálogo funciona como um *dicionário reverso*: ao ler o nome de um serviço numa alternativa, você precisa lembrar a função. Os serviços fundamentais já foram explicados em profundidade; aqui, cada entrada traz uma identificação concisa. A lista foi confrontada com a relação oficial **“In-Scope AWS Services”** da CLF-C02 em outubro de 2026.

> **Importante:** constar no escopo **não** significa ter a mesma probabilidade de aparecer na prova. E a própria AWS declara que a lista é não exaustiva e sujeita a mudanças.

## 18.1. Analytics

| Serviço | Finalidade |
|---|---|
| **Amazon Athena** | SQL serverless sobre dados, frequentemente armazenados no S3 |
| **Amazon EMR** | Execução gerenciada de frameworks de big data como Spark |
| **AWS Glue** | Integração, ETL e catalogação/metadados de dados |
| **Amazon Kinesis** | Ingestão e análise/processamento de dados em streaming |
| **Amazon OpenSearch Service** | Indexação, busca e analytics de logs/documentos |
| **Amazon QuickSight** (documentação pode apresentar “Quick Sight”) | Business intelligence e dashboards |
| **Amazon Redshift** | Data warehouse gerenciado para análises em escala |

## 18.2. Application Integration

| Serviço | Finalidade |
|---|---|
| **Amazon EventBridge** | Barramento de eventos e regras de roteamento |
| **Amazon SNS** | Pub/sub e notificações |
| **Amazon SQS** | Filas de mensagens assíncronas |
| **AWS Step Functions** | Orquestração de workflows e estados de processos |

## 18.3. Business Applications

| Serviço | Finalidade |
|---|---|
| **Amazon Connect** | Contact center em nuvem |
| **Amazon SES** | E-mail transacional e serviços de e-mail para aplicações |

## 18.4. Cloud Financial Management

| Serviço | Finalidade |
|---|---|
| **AWS Budgets** | Orçamentos e alertas de custos/uso, conforme recursos |
| **AWS Cost and Usage Reports (CUR)** | Detalhamento de uso e custos para análise |
| **AWS Cost Explorer** | Explorar tendências/histórico de custos e recomendações |
| **AWS Marketplace** | Catálogo comercial de software, dados e ofertas de terceiros |

## 18.5. Compute

| Serviço | Finalidade |
|---|---|
| **AWS Batch** | Execução de trabalhos batch |
| **Amazon EC2** | Máquinas virtuais/instâncias de computação |
| **AWS Elastic Beanstalk** | Deploy e gerenciamento simplificado de aplicações |
| **Amazon Lightsail** | Instâncias e soluções simplificadas para workloads menores |
| **AWS Outposts** | Infraestrutura e serviços AWS em instalações locais do cliente |

## 18.6. Containers

| Serviço | Finalidade |
|---|---|
| **Amazon ECR** | Registro de imagens de contêiner |
| **Amazon ECS** | Orquestrador de contêineres AWS |
| **Amazon EKS** | Kubernetes gerenciado |

## 18.7. Customer Enablement

| Serviço | Finalidade |
|---|---|
| **AWS Support** | Planos e canais de assistência técnica/operacional |

## 18.8. Database

| Serviço | Finalidade |
|---|---|
| **Amazon Aurora** | Banco relacional gerenciado compatível com modalidades MySQL/PostgreSQL |
| **Amazon DocumentDB** | Banco documental compatível com APIs de MongoDB em cenários específicos |
| **Amazon DynamoDB** | Banco NoSQL chave-valor/documento serverless |
| **Amazon ElastiCache** | Cache em memória gerenciado |
| **Amazon Neptune** | Banco de grafos |
| **Amazon RDS** | Família de bancos relacionais gerenciados |

## 18.9. Developer Tools

| Serviço | Finalidade |
|---|---|
| **AWS CLI** | Interface de linha de comando |
| **AWS CodeBuild** | Build e testes automatizados |
| **AWS CodePipeline** | Orquestra pipeline de entrega |
| **AWS X-Ray** | Rastreamento distribuído de requisições |

## 18.10. End User Computing

| Serviço | Finalidade |
|---|---|
| **Amazon AppStream 2.0** | Streaming de aplicações de desktop a usuários |
| **Amazon WorkSpaces** | Ambientes de desktop virtual gerenciados |
| **Amazon WorkSpaces Secure Browser** | Navegador/ambiente de acesso web gerenciado e seguro |

**Diferença:** AppStream transmite *aplicações*; WorkSpaces entrega um ambiente de *desktop virtual*; Secure Browser focaliza acesso web/navegação.

## 18.11. Frontend Web and Mobile

| Serviço | Finalidade |
|---|---|
| **AWS Amplify** | Ferramentas e hospedagem/integradores para aplicações web e mobile |

## 18.12. Internet of Things

| Serviço | Finalidade |
|---|---|
| **AWS IoT Core** | Conectividade, gerenciamento de mensagens e integração de dispositivos IoT |

## 18.13. Machine Learning

| Serviço | Finalidade |
|---|---|
| **Amazon Comprehend** | Análise de linguagem natural |
| **Amazon Lex** | Bots conversacionais e interfaces de voz/texto |
| **Amazon Polly** | Texto para fala |
| **Amazon Q** | Família de assistentes de IA |
| **Amazon Rekognition** | Análise de imagens/vídeos |
| **Amazon SageMaker AI** | Desenvolvimento/treinamento/implantação de ML |
| **Amazon Textract** | OCR e extração estruturada de documentos |
| **Amazon Transcribe** | Fala para texto |
| **Amazon Translate** | Tradução automática |

## 18.14. Management and Governance

| Serviço | Finalidade |
|---|---|
| **AWS Auto Scaling** | Escalonamento automático de recursos compatíveis |
| **AWS CloudFormation** | Infraestrutura como código e stacks |
| **AWS CloudTrail** | Registro de eventos/ações de API |
| **Amazon CloudWatch** | Logs, métricas, alarmes e observabilidade |
| **AWS Compute Optimizer** | Recomendações de dimensionamento |
| **AWS Config** | Histórico de configuração e regras de conformidade |
| **AWS Control Tower** | Governança e landing zones multiaccount |
| **AWS Health Dashboard** | Eventos de saúde AWS e impacto relacionado |
| **AWS License Manager** | Gestão de licenças de software |
| **AWS Management Console** | Interface web de gerenciamento |
| **AWS Organizations** | Organização de contas, políticas e cobrança consolidada |
| **AWS Service Catalog** | Catálogo de produtos de infraestrutura aprovados |
| **AWS Service Quotas** | Consulta/gerenciamento de cotas |
| **AWS Systems Manager** | Operações, inventário, automação, parâmetros etc. |
| **AWS Trusted Advisor** | Checagens/recomendações de boas práticas |
| **AWS Well-Architected Tool** | Revisões guiadas dos pilares de arquitetura |

## 18.15. Migration and Transfer

| Serviço | Finalidade |
|---|---|
| **AWS Application Discovery Service** | Descoberta e inventário de dependências/servidores |
| **AWS Application Migration Service** | Migração de servidores/workloads |
| **AWS Database Migration Service (DMS)** | Migração/replicação de dados de banco |
| **Migration Evaluator** | Avaliação econômica de ambientes e migração |
| **AWS Migration Hub** | Centralização/visualização da jornada de migração |
| **AWS Schema Conversion Tool (SCT)** | Conversão de objetos e esquemas de banco |

## 18.16. Networking and Content Delivery

| Serviço | Finalidade |
|---|---|
| **Amazon API Gateway** | Criar/expor/gerenciar APIs |
| **Amazon CloudFront** | CDN e entrega global de conteúdo |
| **AWS Direct Connect** | Conectividade dedicada a AWS |
| **AWS Global Accelerator** | Aceleração de tráfego pela rede global AWS |
| **AWS PrivateLink** | Consumo privado de serviços via endpoints |
| **Amazon Route 53** | DNS e roteamento relacionado |
| **AWS Transit Gateway** | Hub de interconexão de VPCs/redes |
| **Amazon VPC** | Rede virtual isolada |
| **AWS VPN** | Família de conectividade VPN |
| **AWS Site-to-Site VPN** | VPN entre redes corporativas e AWS |
| **AWS Client VPN** | VPN para dispositivos/clientes individuais |

## 18.17. Security, Identity and Compliance

| Serviço | Finalidade |
|---|---|
| **AWS Artifact** | Relatórios/documentação de conformidade da AWS |
| **AWS Certificate Manager (ACM)** | Certificados TLS/SSL gerenciados |
| **AWS CloudHSM** | Módulos de segurança de hardware dedicados |
| **Amazon Cognito** | Identidade de usuários finais de aplicações |
| **Amazon Detective** | Investigação contextual de achados de segurança |
| **AWS Directory Service** | Serviços de diretório/integradores Microsoft AD |
| **AWS Firewall Manager** | Políticas centralizadas de firewall |
| **Amazon GuardDuty** | Detecção de ameaças |
| **AWS IAM** | Permissões e identidades para recursos AWS |
| **AWS IAM Identity Center** | Acesso centralizado de força de trabalho às contas/aplicações |
| **Amazon Inspector** | Avaliação/descoberta de vulnerabilidades |
| **AWS KMS** | Gestão de chaves criptográficas |
| **Amazon Macie** | Detecção de dados sensíveis em S3 |
| **AWS Resource Access Manager (RAM)** | Compartilhamento de recursos compatíveis entre contas |
| **AWS Secrets Manager** | Gestão/rotação de segredos |
| **AWS Security Hub** | Centralização de achados de segurança |
| **AWS Shield** | Proteção DDoS |
| **AWS WAF** | Firewall de aplicações web HTTP(S) |

## 18.18. Serverless

| Serviço | Finalidade |
|---|---|
| **AWS Fargate** | Capacidade de execução serverless para contêineres |
| **AWS Lambda** | Execução serverless de funções/eventos |

## 18.19. Storage

| Serviço | Finalidade |
|---|---|
| **AWS Backup** | Backup centralizado e gerenciado |
| **Amazon EBS** | Volumes de bloco persistentes |
| **Amazon EFS** | Compartilhamento NFS gerenciado para Linux |
| **AWS Elastic Disaster Recovery** | Recuperação de workloads/servidores |
| **Amazon FSx** | Sistemas de arquivos gerenciados especializados |
| **Amazon S3** | Armazenamento de objetos |
| **Amazon S3 Glacier** | Classes de arquivamento de objetos |
| **AWS Storage Gateway** | Integração híbrida com storage cloud |

## 18.20. Serviços menos frequentes: exemplos para realmente entender

O catálogo oficial inclui áreas que não costumam receber a mesma profundidade que IAM, VPC, S3 ou EC2. Ainda assim, vale criar uma imagem mental clara.

### Computação de usuário final

Uma empresa quer permitir que analistas utilizem **programas Windows pesados** sem instalá-los nos laptops. **AppStream 2.0** pode transmitir a aplicação remotamente. Se a necessidade é disponibilizar um **desktop virtual completo** para colaboradores, o caso remete ao **Amazon WorkSpaces**. Se a organização quer um ambiente gerenciado para **acesso a sites corporativos**, sem transmitir um desktop completo, considere **Amazon WorkSpaces Secure Browser**.

A pista é o objeto entregue ao usuário: **aplicativo → desktop → navegador**.

### AWS Amplify e aplicações web/mobile

Uma equipe frontend quer automatizar hospedagem e publicação de aplicações web e integrar componentes de backend. **Amplify** pode reduzir o esforço de configurar alguns desses fluxos.

É importante perceber que **Amplify** não é o único modo de hospedar Angular/React: uma arquitetura com **S3 + CloudFront** também pode fornecer frontend estático e é frequentemente usada. O exame pode diferenciar a *plataforma de desenvolvimento/hospedagem* dos *componentes primitivos de storage e CDN*.

### IoT Core

Imagine centenas de sensores em silos enviando medições periódicas de temperatura, umidade e status. **AWS IoT Core** oferece recursos de comunicação e integração de dispositivos com serviços cloud.

A pista é **dispositivo conectado e mensageria IoT**, não um frontend web convencional ou um banco transacional.

### Amazon Connect

Um contact center precisa atender chamadas, distribuir interações e apoiar atendentes. **Amazon Connect** atende essa família de necessidades. Não confunda o verbo genérico “connect” com infraestrutura de rede: para conectar **redes corporativas**, os candidatos seriam **Site-to-Site VPN, Direct Connect ou Transit Gateway**, dependendo do cenário.

### Migration Evaluator, Discovery e Migration Hub

Durante uma migração:
- **Discovery** ajuda a entender *o que existe* e dependências.
- **Migration Evaluator** ajuda a entender *quanto custa e qual o caso econômico*.
- **Migration Hub** ajuda a acompanhar *como a migração progride*.
- **Application Migration Service** ajuda a *mover workloads/servidores*.
- **DMS e SCT** ajudam a *migrar dados e converter estruturas* de bancos, respectivamente.

É perfeitamente possível usar várias dessas ferramentas em um mesmo projeto.

### Cloud governance na vida real

Uma empresa tem 50 contas AWS. Ela precisa:
- Organizar por unidades e centralizar cobrança → **Organizations**.
- Aplicar teto de ações permitidas → **SCP**.
- Preparar estrutura padronizada de contas e guardrails → **Control Tower**.
- Disponibilizar “templates aprovados” para equipes → **Service Catalog**.
- Compartilhar certas subnets e outros recursos compatíveis → **AWS RAM**.
- Alertar equipes sobre quotas de recursos → **Service Quotas**.
- Controlar licenças de software por regras → **License Manager**.
- Recomendar tamanho melhor para recursos → **Compute Optimizer**.

O truque é não tratar “governança” como um serviço único. A palavra descreve necessidades complementares de organização, padronização, auditoria e eficiência.

### Estratégia de memorização do catálogo

Não tente decorar as tabelas todas numa madrugada. Crie a frase **“o problema sinaliza o serviço”** e associe termos-gatilho:
- *Threat detection* → GuardDuty.
- *Vulnerability scan* → Inspector.
- *PII no S3* → Macie.
- *Audit report* → Artifact.
- *SQL em arquivos S3* → Athena.
- *ETL/Data Catalog* → Glue.
- *Kubernetes* → EKS.
- *Object storage* → S3.
- *Dedicated connection* → Direct Connect.
- *Many subscribers* → SNS.

---

# 19. Preços, descontos, Billing e otimização financeira

> **Nomes completos nesta página:** Amazon Elastic Block Store (**EBS**); Amazon Elastic Compute Cloud (**EC2**); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**).
**[ESSENCIAL — Domínios 1.4, 4.1 e 4.2]**

É comum acertar serviços técnicos e errar as questões financeiras porque várias ferramentas parecem semelhantes. A solução é decompor **qual uso é cobrado, como obter desconto e como controlar orçamento**.

## 19.1. Pagamento por uso não significa que todo preço é por requisição

Os serviços usam unidades diferentes:
- EC2: tempo/tipo de capacidade computacional, sujeito ao modelo de compra, mais recursos associados.
- Fargate: capacidade configurada e tempo de execução, mais itens auxiliares.
- Lambda: requisições, duração/capacidade e outros fatores aplicáveis.
- S3: volume armazenado, classe, requisições, recuperação e transferências relevantes.
- RDS: capacidade computacional, armazenamento, I/O e outras dimensões conforme engine/modalidade.
- CloudWatch: métricas, logs, retenção e operações conforme uso.

Um projeto com baixo tráfego **pode ser caro** se tiver recursos dedicados sempre ligados, provisionamento excessivo e muito tráfego entre serviços.

## 19.2. Modelos de compra EC2

### On-Demand

Capacidade sem compromisso de duração de 1 ou 3 anos (sujeita a mínimos/regras do serviço). É adequada quando a carga é **imprevisível, curta ou ainda não dimensionada**.

Ex.: MVP, ambiente temporário, backend de demanda variável.

### Reserved Instances (RIs)

Modelo de **compromisso** de capacidade/uso específico por período (tipicamente 1 ou 3 anos), que oferece descontos em relação ao On-Demand quando aplicável.

**Standard RI:** geralmente maior economia, menos flexibilidade de troca que opções conversíveis.  
**Convertible RI:** permite certas mudanças de atributos/família dentro das regras de troca e elegibilidade, em contrapartida a desconto menor em muitos cenários.

**Regional RI versus Zonal RI:** há diferenças de escopo e potencial reserva de capacidade. Não trate **qualquer** RI como promessa genérica de capacidade em qualquer AZ: depende de modalidades e atributos.

### Spot Instances

Capacidade ociosa de EC2 com desconto potencial significativo, sujeita a **interrupção pela AWS quando a capacidade é necessária**. Adequada para processamento tolerante a falhas/interrupções.

Ex.: simulações, jobs batch distribuídos, workloads com checkpoints, processamento que pode reiniciar.

**Não** escolha Spot como único host de uma aplicação crítica sem estratégia de disponibilidade.

### Savings Plans

Desconto em troca de **compromisso de gasto/uso medido em $/hora** por prazo (tipicamente 1 ou 3 anos), aplicado a serviços elegíveis conforme tipo de plano.

Segundo a documentação de tipos de Savings Plans disponível em outubro de 2026, aparecem:
- **Compute Savings Plans:** maior flexibilidade entre EC2 e outros serviços de computação elegíveis, como Lambda e Fargate.
- **EC2 Instance Savings Plans:** compromisso com família e Região EC2, com flexibilidade dentro das regras de tamanho/SO/tenancy.
- **Database Savings Plans:** opção voltada a serviços de banco de dados elegíveis, lançada em documentação mais recente.
- **SageMaker AI Savings Plans:** foco em uso elegível do SageMaker AI.

**Atenção:** o guia CLF-C02 lista Savings Plans como categoria genérica. Nem todos os materiais preparatórios antigos refletem novos subtipos. Para a prova, a regra prioritária é **compromisso por desconto**, e a distinção mais clássica é Compute Savings Plans versus EC2 Instance Savings Plans.

### Dedicated Instances / Dedicated Hosts

- **Dedicated Instances:** executam em hardware fisicamente dedicado a um único cliente, sob modelo de tenancy aplicável, sem necessariamente dar controle sobre posicionamento/host físico específico.
- **Dedicated Hosts:** servidor físico dedicado com visibilidade/controle de alocação compatíveis, útil em cenários de licenciamento e conformidade.

**Não confunda “dedicado” com reservado:** compromisso financeiro/capacidade e isolamento físico resolvem problemas diferentes.

### On-Demand Capacity Reservations

Reserva de capacidade de instância em AZ compatível, **sem garantir por si mesma o desconto típico de RI/Savings Plan**. O objetivo primário é **disponibilidade de capacidade**, não preço. É especialmente importante quando a pergunta fala em “garantir que uma capacidade EC2 específica esteja disponível numa AZ”.

## 19.3. Tabela-resumo de compras

| Modelo | Compromisso | Pode sofrer interrupção recuperando capacidade? | Palavra-chave |
|---|---|---|---|
| On-Demand | Não há compromisso plurianual de uso | Não como característica do modelo | Flexibilidade imediata |
| Standard/Convertible RI | Normalmente 1 ou 3 anos | Não é Spot | Desconto com compromisso |
| Spot | Não há garantia de permanência | **Sim** | Barato e interrompível |
| Savings Plans | Compromisso de gasto/hora por prazo | Não é Spot | Economia por compromisso |
| Capacity Reservation | Reserva capacidade | Não é Spot | Garantir capacidade |
| Dedicated Host | Modelo de servidor físico dedicado | Não é Spot | Isolamento/licenciamento |

**Atenção:** nenhuma categoria elimina falhas, necessidade de arquitetura ou indisponibilidade de serviços.

## 19.4. Exemplo de custos (inteiramente hipotético)

Sua aplicação usa uma instância cujo preço fictício é US$ 0,10/h.  
Se funcionar 24 horas × 30 dias:

`720 h × US$ 0,10/h = US$ 72,00 de computação`.

Agora inclua:
- Disco EBS hipotético: US$ 12.
- Logs: US$ 5.
- Transferência para a internet: US$ 18.
- Serviço gerenciado complementar: US$ 20.

**Total ilustrativo = US$ 127**, e não US$ 72.

Se desligar a computação durante 50% do tempo, o gasto dessa linha pode cair, **mas o EBS e demais itens não somem automaticamente**. Descontos de compromisso têm dinâmica de faturamento diferente: a obrigação do compromisso permanece.

> Os valores deste exemplo são **inventados apenas para ensinar a lógica**, não cotações de serviços AWS.

## 19.5. Transferência de dados e egress

A prova pode falar em:
- **Ingress (entrada de dados):** em muitas situações, o tráfego que entra na AWS é gratuito, sujeito a detalhes do serviço e percurso.
- **Egress (saída):** envio de dados da AWS para a internet **costuma gerar cobrança** dependendo do serviço/volume.
- **Entre Regiões:** transferência pode ter custo, dependendo do serviço e direção.
- **Entre AZs da mesma Região:** também pode ter custos, dependendo da arquitetura/caminho.
- **Dentro da mesma AZ:** regras variam por tipo de tráfego e serviço.

**Nunca memorize “todo tráfego dentro da AWS é grátis”.** Inter-AZ, inter-Region, NAT Gateway e transferências por endpoints podem impactar a conta.

## 19.6. S3: custo por classe e frequência

Escolher a classe com menor preço nominal por GB pode sair caro se:
- O objeto é frequentemente recuperado.
- Há taxas de recuperação e grande volume de requisições.
- Existem períodos mínimos de permanência ou tamanho cobrado mínimo.
- Transições/lifecycles geram operações adicionais.

A melhor classe é a de **menor custo total para o padrão real de acesso e recuperação**, respeitando disponibilidade/durabilidade necessárias.

## 19.7. Ferramentas financeiras: diferenças cobradas

### AWS Pricing Calculator

**Estimar custos antes de contratar/implantar**, com hipóteses de arquitetura, Região, utilização e volumes. Responde “quanto custaria aproximadamente se...?”

### AWS Cost Explorer

**Analisar custos reais/históricos e tendências**, com filtros/gráficos/recomendações de capacidade/compromissos conforme recursos. Responde “onde gastamos e como evoluiu?”

### AWS Budgets

**Definir metas e receber alertas** quando gasto/uso está próximo de limites ou ultrapassa critérios. Responde “me avise antes de passar de X”.

### Cost and Usage Reports (CUR)

**Detalhamento de registros de custo/uso** para análises/relatórios mais profundos. Responde “preciso dos dados granulares das linhas de faturamento”.

### Billing and Cost Management

**Conjunto de páginas e ferramentas** de cobrança, faturas, pagamentos, créditos, custos e relatórios. Não é sinônimo de cada serviço individual.

| Enunciado | Resposta |
|---|---|
| Prever preço de arquitetura ainda não implantada | Pricing Calculator |
| Entender por que custo do mês aumentou | Cost Explorer |
| Receber alerta ao alcançar 80% do orçamento | Budgets |
| Extrair dados detalhados para BI/financeiro | Cost and Usage Reports |
| Pagar e consultar faturas | Billing and Cost Management |

## 19.8. Cost Allocation Tags

**Tags** são metadados `chave=valor` anexados a recursos compatíveis. Exemplo:
- `Project=PortalEstudos`
- `Environment=Production`
- `Team=Plataforma`
- `CostCenter=123`

Em contexto financeiro, **tags de alocação de custos** ajudam a agrupar e atribuir gastos a equipes/projetos, quando ativadas e suportadas.

Existem **tags definidas pelo usuário** e **tags geradas pela AWS**, ambas com tratamentos e regras próprios. Nem toda tag existente vira automaticamente dimensão de relatório de custos sem configuração necessária.

**Tags não são substituto para separar contas** quando são necessários limites independentes de segurança, isolamento ou cobrança.

## 19.9. AWS Organizations e consolidated billing

**Consolidated billing** permite **pagar contas AWS de membros de uma organização em uma fatura consolidada/gerência central**. Pode permitir compartilhamento configurável de descontos de Reserved Instances e Savings Plans e benefícios de volume conforme serviços/regras.

Pontos-chave:
- A **management account** é a conta responsável pela organização e consolidação.
- As **member accounts** continuam sendo contas distintas para recursos e limites de identidade.
- A consolidação financeira não significa que uma identidade automaticamente acessa recursos de outras contas.
- Políticas de compartilhamento de descontos podem ser configuradas, respeitando condições atuais.

**Pegadinha:** AWS Organizations controla tanto aspectos de governança quanto de faturamento, mas **CloudFormation** não substitui Organizations, e **SCP** não é uma policy de faturamento.

## 19.10. AWS Free Tier: versão atualizada

O modelo do AWS Free Tier mudou em 2025 e recebeu atualizações posteriores. Na documentação oficial consultada em outubro de 2026, novos clientes elegíveis podem receber **até US$ 200 em créditos** (parcela inicial e outra por atividades elegíveis), existe **plano gratuito com duração máxima de seis meses ou até esgotar créditos**, e também ofertas com limites **Always Free**. Há diferenças entre plano gratuito e conta paga.

**Ponto didático:** *Free Tier não significa que “tudo na AWS é gratuito até 12 meses”*. Elegibilidade, serviços, limites, tipo de conta, créditos e cobranças mudam. Consulte o site oficial quando abrir uma conta.

**Cuidados em laboratórios:** leia a elegibilidade, evite recursos de alto custo e confira indicadores de cobrança. Ao migrar para conta paga ou exceder ofertas gratuitas, podem surgir cobranças. Não dependa de um alerta orçamentário como mecanismo físico de bloqueio automático de qualquer gasto; alertas geralmente não são um **teto rígido**.

## 19.11. FinOps e otimização contínua

**FinOps** é prática interdisciplinar para dar visibilidade, responsabilidade e eficiência ao gasto em nuvem.

Roteiro:
1. **Visibilidade:** contas, tags, relatórios e principais serviços.
2. **Responsabilidade:** mapear gastos a equipes/produtos.
3. **Otimização:** rightsizing, desligamento de ociosos, classes S3 e descontos adequados.
4. **Governança:** limites, aprovações, budgets e análise de anomalias.
5. **Revisão:** custo por usuário, API request, relatório ou outro indicador de valor.

A meta não é apenas gastar menos; é **gastar de maneira proporcional ao valor e à confiabilidade requeridos**.

---

# 20. Suporte, documentação, parceiros e AWS Health

> **Nome completo nesta página:** Amazon Virtual Private Cloud (**VPC**).
**[ESSENCIAL — Domínio 4.3]**

## 20.1. Tipos de recursos para obter ajuda

- **Documentação oficial AWS:** referência de funcionamento, configurações e limitações.
- **AWS Whitepapers:** explicações aprofundadas, arquiteturas e boas práticas.
- **AWS Prescriptive Guidance:** orientações práticas e padrões para transformação, migração e operação.
- **AWS re:Post:** comunidade e perguntas/respostas técnicas.
- **AWS Knowledge Center:** conteúdo de ajuda e solução de questões comuns.
- **AWS Security Blog:** informações técnicas e orientações de segurança.
- **AWS Support Center:** interface para casos de suporte e acompanhamento conforme plano.
- **AWS Solutions Architects:** profissionais que apoiam clientes em decisões técnicas quando há relacionamento/serviços disponíveis.
- **AWS Professional Services:** serviços especializados para projetos, implementações e transformação.
- **AWS Partner Network (APN):** ecossistema de parceiros que prestam soluções/serviços relacionados à AWS.
- **AWS Marketplace:** catálogo para descobrir/adquirir software e serviços de terceiros em formatos compatíveis.

## 20.2. ISV versus System Integrator

- **ISV (Independent Software Vendor):** empresa independente que fornece software/produto de software.
- **SI (System Integrator):** integra e implementa tecnologias/sistemas para clientes.
- **APN:** rede/ecossistema de parceiros AWS.
- **Marketplace:** mecanismo de contratação/descoberta de ofertas; nem todo parceiro é necessariamente comprado por Marketplace.

Um cliente que busca um aplicativo pronto pode olhar Marketplace/ISV. Quem precisa integrar sistemas complexos pode procurar um integrador de sistemas ou serviços profissionais.

## 20.3. Planos de suporte AWS: transição em 2026

**ALERTA IMPORTANTE DE ATUALIZAÇÃO**

O **guia de exame CLF-C02** consultado ainda exemplifica nomenclaturas antigas: **Basic, Developer, Business, Enterprise On-Ramp e Enterprise**. Entretanto, a página atual de **AWS Support Plans** lista **Basic, Business Support+, Enterprise Support e Unified Operations** e anuncia:
- **Developer Support** e **Business Support** com encerramento programado para **1º de janeiro de 2027**.
- **Enterprise On-Ramp** também com descontinuação em **1º de janeiro de 2027**, conforme cronograma/transição divulgado.
- Clientes existentes podem passar por migrações/renovações; condições variam por situação, regiões e contrato.

**Como estudar corretamente:** reconheça os nomes **antigos** quando a questão for baseada no guia e entenda as categorias **atuais**; não use uma tabela de 2023 como verdade universal de 2026.

### Visão de serviços atuais (outubro de 2026)

| Plano | Intenção | Destaque |
|---|---|---|
| **Basic** | Ajuda básica para toda conta | Faturamento, documentação, comunidade e verificação de saúde |
| **Business Support+** | Suporte técnico premium acessível | Engenheiros 24×7, assistência contextual, mais checagens e casos técnicos |
| **Enterprise Support** | Workloads empresariais críticos | Benefícios do nível anterior mais TAM designado e atendimento prioritário |
| **Unified Operations** | Operações empresariais de missão crítica | Suporte/serviços de operações mais abrangentes, conforme contrato |

**TAM = Technical Account Manager**, acompanhamento técnico designado em planos elegíveis.

### Como eram descritos os planos tradicionais

- **Basic:** documentação, suporte de cobrança e recursos básicos.
- **Developer:** suporte técnico orientado a desenvolvimento/testes, com condições próprias.
- **Business:** suporte de produção 24×7 e recursos mais abrangentes.
- **Enterprise On-Ramp:** opção intermediária para necessidades empresariais maiores.
- **Enterprise:** nível avançado com TAM e recursos estratégicos.

**Pegadinha de prova:** não confunda AWS Support com **AWS Health** (comunica problemas/eventos) ou **Trusted Advisor** (checa boas práticas). Os três podem aparecer na mesma pergunta, mas não são equivalentes.

## 20.4. AWS Trusted Advisor

Trusted Advisor oferece recomendações e verificações, historicamente em áreas como:
- Segurança.
- Otimização de custos.
- Confiabilidade/tolerância a falhas.
- Performance.
- Limites/cotas e excelência operacional, conforme recursos disponíveis.

**A quantidade de verificações e acesso a funcionalidades dependem do plano e das alterações do serviço.** Foque no propósito: identificar oportunidades/riscos de acordo com boas práticas.

## 20.5. AWS Health Dashboard e Health API

A AWS pode publicar informações sobre **eventos de saúde que impactam serviços e recursos**. O Health Dashboard tem visões gerais e personalizadas; a Health API permite integração programática em cenários elegíveis.

Se o enunciado diz:
- “A AWS está com indisponibilidade num serviço? Meus recursos foram afetados?” → **AWS Health**.
- “Como está a memória da minha instância?” → **CloudWatch**.
- “Minha arquitetura segue boas práticas?” → **Trusted Advisor/Well-Architected**, conforme tipo de avaliação.

## 20.6. AWS Trust & Safety

Existe uma equipe/canal especializado da AWS para reportar uso abusivo de recursos AWS (por exemplo, tentativas de ataque originadas de infraestrutura AWS). Isso é diferente de registrar um caso técnico para solucionar configuração normal de uma VPC.

---
# 21. Estudo de caso: uma plataforma web na AWS

> **Nomes completos nesta página:** Application Load Balancer (**ALB**); Amazon Elastic Block Store (**EBS**); Amazon Elastic Compute Cloud (**EC2**); Amazon Elastic Container Service (**ECS**); AWS Identity and Access Management (**IAM**); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**); Amazon Simple Queue Service (**Amazon SQS**); AWS Web Application Firewall (**AWS WAF**).
**[APROFUNDAMENTO INTEGRADOR]**

Vamos aplicar tudo a uma plataforma **hipotética de cursos online**, com frontend web, backend em API, certificados em PDF, autenticação de alunos e dados analíticos. É um exercício didático genérico e **não descreve nem presume a arquitetura de produção de nenhuma empresa**.

## 21.1. Requisitos do cenário

1. Alunos precisam acessar aulas e acompanhar o progresso no navegador.
2. A API pode enfrentar picos de acesso durante eventos relevantes.
3. Usuários autenticados acessam somente dados autorizados.
4. O backend consulta dados de matrículas, cursos e progresso.
5. A emissão de muitos certificados não deve bloquear as requisições HTTP.
6. Existe requisito de alta disponibilidade dentro de uma Região.
7. Custos devem ser separados por ambiente, acompanhados e alertados.
8. Eventos de segurança devem poder ser auditados.

## 21.2. Arquitetura conceitual

```text
                          CLIENTES
                             |
                      Route 53 (DNS)
                             |
                     CloudFront (+ WAF)
                             |
                         Site estático
                         (S3 origem)
                             |
                 Chamadas HTTP autenticadas
                             |
                  ALB ou API Gateway (*)
                             |
                    Backend em API
                    ECS + Fargate
                    (duas AZs)
                   /      |      \
       Secrets Manager   SQS      Dados
            + IAM         |       RDS Multi-AZ /
                       Workers    outras fontes
                       ECS/Lambda
                           |
                         S3 (certificados)
                           |
                        Download
                      com acesso
                       controlado

  Operação: CloudWatch, CloudTrail, Config, Security Hub
  Custos: Tags, Cost Explorer, Budgets, Pricing Calculator
```

(*) A escolha ALB/API Gateway depende de funcionalidade, modelo de backend, custo e requisitos de API. Não precisamos necessariamente dos dois.

### Por que cada peça existe?

- **Route 53:** resolve o domínio.
- **CloudFront:** entrega conteúdo estático com baixa latência, podendo atuar na entrega do frontend.
- **S3:** hospeda arquivos do site como objetos e armazena certificados.
- **WAF:** filtra requisições HTTP(S) conforme regras apropriadas.
- **ALB:** distribui o tráfego HTTP entre tarefas/instâncias de backend.
- **ECS:** orquestra os contêineres do backend.
- **Fargate:** fornece compute de contêineres sem administrar hosts EC2.
- **Multi-AZ:** reduz dependência de uma AZ.
- **RDS:** mantém dados relacionais quando esse modelo é apropriado.
- **SQS:** separa o pedido de certificado do processamento pesado.
- **IAM role:** autoriza workloads a acessar recursos AWS com privilégios mínimos.
- **Secrets Manager:** armazena segredos que não podem ser eliminados via IAM.
- **CloudWatch:** permite medir erros, latências e consumo.
- **CloudTrail:** fornece rastros de ações administrativas/API.
- **AWS Config:** avalia conformidade e mudanças de configuração.
- **Budgets/Cost Explorer:** alertam e explicam gastos.

## 21.3. Três decisões arquiteturais explicadas

### Decisão A — por que não uma única instância EC2 enorme?

Uma instância única representa ponto de falha. Se ela falhar ou precisar de manutenção, toda a API pode ficar indisponível. Uma solução com múltiplas tarefas em AZs diferentes, balanceador e autoscaling adiciona capacidade de lidar com falhas e picos. **Não significa** que você sempre deva escolher vários recursos para qualquer protótipo: há trade-offs entre custo, complexidade e SLA desejado.

### Decisão B — por que a fila melhora a experiência?

Sem fila, o usuário faz uma requisição que fica aberta até terminar a geração de um lote grande de certificados. Problemas: timeout, memória e CPU concentradas, picos de duração. Com SQS, a API registra a solicitação rapidamente e um worker executa. Isso cria desacoplamento e permite escalar processamento independente da API.

**Consequências:** você precisa informar status ao usuário, lidar com execução duplicada, tratar falhas e garantir que um aluno só acesse seus certificados. Nenhum serviço cloud “resolve autorização de aplicação automaticamente”.

### Decisão C — como proteger certificados e dados de alunos?

1. Buckets S3 privados com bloqueio de acesso público.
2. API autentica o usuário via sistema de identidade adequado.
3. API valida **autorização de negócio** (tenant/entitlement/scopes).
4. Workload usa IAM role mínima para acessar objetos necessários.
5. Downloads usam proxy/autorização apropriada ou presigned URLs de curta duração depois da validação.
6. Eventos e acessos relevantes são auditados conforme necessidade.

**Pegadinha central:** o IAM da AWS protege acesso **da aplicação ao recurso AWS**, mas não substitui a verificação de “o aluno X pode baixar o certificado Y?” dentro do backend.

## 21.4. Falhas simuladas e resposta correta

| Incidente | Impacto provável | Medida de arquitetura |
|---|---|---|
| Uma AZ fica indisponível | Instâncias/recursos daquela AZ param | Redundância em outras AZs, failover adequado |
| Banco primário cai | Operações de dados falham até recuperação | RDS Multi-AZ / plano de failover e backups |
| Serviço de certificados sobrecarregado | Fila cresce; processamento atrasa | Escalar workers, monitorar fila, DLQ |
| Configuração IAM alterada indevidamente | Permissão exposta/bloqueada | CloudTrail, guardrails, revisão e resposta |
| Uma imagem de contêiner possui CVE | Risco de exploração | Inspector, atualização e governança de imagens |
| Chamada pública maliciosa provoca tráfego abusivo | Aumento de erros/custos | WAF, Shield, limites de API e mitigação por camadas |
| Consulta complexa sobrecarrega banco | Latência crescente | Cache, read replicas se elegíveis, índices/otimização |
| Conta AWS fica acima do previsto | Surpresa de custo | Budgets + Cost Explorer + dimensionamento |

## 21.5. Exercício de raciocínio: controle de acesso

A equipe quer “uma página embutida num portal parceiro e acessível apenas aos clientes desse parceiro”. É tentador esconder a URL e presumir que o iframe controla segurança. Isso é incorreto.

Um **iframe** é um mecanismo de incorporação visual, **não** de autenticação/autorização. Dependendo do requisito, são necessários tokens assinados, sessão de usuário, backend validando entitlement, origem autorizada ou outra arquitetura de autenticação, além de controles adequados de embedding. AWS Cognito ou IdP externo podem autenticar usuários; IAM protege recursos AWS consumidos pelo backend; WAF e CloudFront ajudam em distribuição/proteção, mas nenhum deles sozinho implementa as regras de quais dados são permitidos para cada cliente.

Esse exemplo reforça a distinção entre **segurança da infraestrutura** e **autorização de negócio**.

## 21.6. Exercício financeiro: operar 08h–21h

Se uma carga de desenvolvimento realmente só precisa de execução das 08h às 21h, uma estratégia de desligamento fora do horário pode reduzir **parte dos custos variáveis de computação**. Porém:
- alguns serviços gerenciados têm cobrança enquanto provisionados;
- EBS, snapshots, storage, rede e endereços podem continuar custando;
- o esforço de startup/shutdown pode quebrar jobs e integrações;
- instâncias reservadas/Savings Plans mantêm compromissos independentemente de quanto você efetivamente utiliza.

Não conclua “13/24 do custo total” sem decompor todas as linhas de cobrança.

---

# 22. Comparativos e pegadinhas fundamentais

> **Nomes completos nesta página:** AWS Certificate Manager (**ACM**); Application Load Balancer (**ALB**); AWS Database Migration Service (**AWS DMS**); Amazon Elastic Block Store (**EBS**); Amazon Elastic Compute Cloud (**EC2**); Amazon Elastic Container Registry (**ECR**); Amazon Elastic Container Service (**ECS**); Amazon Elastic File System (**EFS**); Amazon Elastic Kubernetes Service (**EKS**); Elastic Load Balancing (**ELB**); Amazon Elastic MapReduce (**Amazon EMR**, nome que originou a sigla); AWS Identity and Access Management (**IAM**); AWS Key Management Service (**AWS KMS**); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**); AWS Schema Conversion Tool (**AWS SCT**); Amazon Simple Notification Service (**Amazon SNS**); Amazon Simple Queue Service (**Amazon SQS**); AWS Security Token Service (**AWS STS**); Amazon Virtual Private Cloud (**VPC**); AWS Web Application Firewall (**AWS WAF**).
**[REVISÃO RÁPIDA — MUITO IMPORTANTE]**

## 22.1. Matriz de conceitos parecidos

| Par ou trio | Distinção que resolve a questão |
|---|---|
| **Elasticidade × escalabilidade** | Escalabilidade suporta aumento; elasticidade ajusta capacidade à variação de demanda |
| **HA × DR × backup** | HA mantém serviço disponível; DR recupera após desastre; backup conserva cópia recuperável |
| **Durabilidade × disponibilidade** | Preservar dados não é o mesmo que conseguir acessá-los agora |
| **Multi-AZ × Multi-Region** | AZs de uma Região versus Regiões separadas |
| **Edge Location × AZ** | Borda de distribuição versus domínio de falha de computação regional |
| **Well-Architected × CAF** | Boa arquitetura de workloads versus transformação/prontidão organizacional |
| **IAM Identity Center × Cognito** | Pessoas da empresa acessando AWS versus usuários finais do aplicativo |
| **IAM role × IAM user** | Identidade assumida/temporária versus usuário com credenciais |
| **IAM policy × SCP** | Concede/negar permissões de identidade; SCP impõe teto, não concede |
| **Trust policy × permissions policy** | Quem assume uma role versus ações que ela executa |
| **KMS × CloudHSM × ACM** | Chaves gerenciadas; HSM dedicado; certificados TLS |
| **Secrets Manager × IAM role** | Segredos externos/credenciais versus acesso AWS sem chave embutida |
| **CloudWatch × CloudTrail × Config** | Métricas/logs/alarmes × ações de API × configuração/conformidade |
| **GuardDuty × Inspector × Macie** | Ameaças × vulnerabilidades × dados sensíveis no S3 |
| **WAF × Shield × Firewall Manager** | Tráfego web malicioso × DDoS × políticas de firewall centralizadas |
| **Security Group × NACL** | Stateful no recurso × stateless na subnet |
| **IAM × Security Group** | Permissões de API/recurso × tráfego de rede |
| **Route 53 × CloudFront** | DNS × CDN |
| **CloudFront × Global Accelerator** | Cache/distribuição de conteúdo × aceleração de tráfego de rede |
| **Direct Connect × VPN** | Conectividade dedicada × túnel criptografado via rede pública |
| **PrivateLink × Transit Gateway** | Acesso privado a serviço × hub de redes/VPCs |
| **ALB × Auto Scaling** | Distribui solicitações × ajusta quantidade de instâncias/tarefas |
| **EC2 × Lambda** | VM administrável × função serverless |
| **ECS × EKS × Fargate × ECR** | Orquestração AWS × Kubernetes × capacidade serverless × imagens |
| **EBS × EFS × S3** | Blocos × arquivos NFS compartilhados × objetos |
| **EFS × FSx** | NFS gerenciado Linux × sistemas de arquivos especializados |
| **S3 Standard-IA × One Zone-IA** | Acesso infrequente multi-AZ × uma AZ |
| **RDS Multi-AZ × Read replica** | Disponibilidade/failover × escala de leitura |
| **RDS × DynamoDB × ElastiCache** | Relacional × NoSQL serverless × cache |
| **DMS × SCT** | Replicar/mover dados × converter esquemas |
| **SQS × SNS × EventBridge × Step Functions** | Fila × pub/sub × barramento de eventos × workflow |
| **Athena × Redshift × RDS** | SQL sobre dados/lagos × warehouse analítico × banco transacional |
| **Glue × EMR × Kinesis** | Integração/ETL × big data frameworks × streaming |
| **Textract × Rekognition** | Extrair texto de documento × análise de imagem/vídeo |
| **Transcribe × Polly** | Áudio para texto × texto para áudio |
| **Pricing Calculator × Cost Explorer × Budgets × CUR** | Estimar × analisar × alertar × detalhar |
| **Spot × RI × Savings Plans** | Interrupção com desconto × reserva/compromisso × gasto comprometido |
| **Capacity Reservation × Reserved Instance** | Garantir capacidade × desconto/compromisso (com nuances de RI zonal) |
| **Organizations × Control Tower** | Organização/contas/SCP/billing × landing zone governada |
| **Artifact × CloudTrail** | Relatórios de compliance da AWS × eventos/ações de API |
| **Health Dashboard × CloudWatch** | Eventos de saúde de serviços AWS × observabilidade da workload |

## 22.2. Nove armadilhas em frases

1. **“Na AWS a segurança inteira é do provedor.”** Falso: há responsabilidade compartilhada.
2. **“Se a conta tem Allow, SCP não importa.”** Falso: SCP pode limitar e negar.
3. **“Bucket S3 é um disco para instância EC2.”** Falso: é object storage.
4. **“Só EC2 pode executar contêiner.”** Falso: Fargate também é uma opção de compute.
5. **“SQS envia cópia para todos os inscritos da mesma forma que SNS.”** Falso: fila e pub/sub têm semânticas diferentes.
6. **“Um cache ou read replica sempre resolve qualquer latência do banco.”** Falso: depende de padrão de consulta, consistência, gargalo e arquitetura.
7. **“Conta parada/instância desligada é custo zero.”** Falso: recursos associados podem continuar cobrados.
8. **“Free Tier é tudo grátis por 12 meses.”** Falso, especialmente com as regras atuais de créditos/planos.
9. **“Um nome de serviço resolve sozinho conformidade ou autorização de negócio.”** Falso: configuração e responsabilidades são fundamentais.

## 22.3. Trinta pistas de enunciados

| Expressão na questão | Sua primeira hipótese |
|---|---|
| *Security of the cloud* | AWS |
| *Security in the cloud* | Cliente |
| *Least privilege* | IAM |
| *Temporary credentials* | IAM Role / STS |
| *Workforce SSO* | IAM Identity Center |
| *Application end-users* | Cognito |
| *Object storage* | S3 |
| *Shared Linux file system* | EFS |
| *Persistent block volume* | EBS |
| *Managed relational DB* | RDS |
| *Key-value at scale* | DynamoDB |
| *In-memory cache* | ElastiCache |
| *Highly available DB* | Multi-AZ |
| *Scale database reads* | Read Replica |
| *Distribute traffic* | ELB |
| *Adjust capacity* | Auto Scaling |
| *Run containers without hosts* | Fargate |
| *Kubernetes* | EKS |
| *Event-driven functions* | Lambda |
| *Private virtual network* | VPC |
| *HTTP firewall rules* | WAF |
| *DDoS protection* | Shield |
| *Threat detection* | GuardDuty |
| *Software vulnerability assessment* | Inspector |
| *PII discovery S3* | Macie |
| *API audit trail* | CloudTrail |
| *Resource configuration compliance* | Config |
| *Cost forecast of architecture* | Pricing Calculator |
| *Cost alarm* | Budgets |
| *Consolidated billing* | Organizations |

---
# 23. Simulado original comentado: 80 questões

> **Nomes completos nesta página:** AWS Certificate Manager (**ACM**); Application Load Balancer (**ALB**); AWS Database Migration Service (**AWS DMS**); Amazon Elastic Block Store (**EBS**); Amazon Elastic Compute Cloud (**EC2**); Amazon Elastic Container Registry (**ECR**); Amazon Elastic Container Service (**ECS**); Amazon Elastic File System (**EFS**); Amazon Elastic Kubernetes Service (**EKS**); AWS Identity and Access Management (**IAM**); AWS Key Management Service (**AWS KMS**); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**); Amazon Simple Email Service (**Amazon SES**); Amazon Simple Notification Service (**Amazon SNS**); Amazon Simple Queue Service (**Amazon SQS**); AWS Security Token Service (**AWS STS**); Amazon Virtual Private Cloud (**VPC**); AWS Web Application Firewall (**AWS WAF**).
**[AUTOAVALIAÇÃO — questões inéditas elaboradas para esta apostila, não são questões oficiais da AWS]**

O simulado foi elaborado com 20 questões do Domínio 1, 24 do Domínio 2, 27 do Domínio 3 e 9 do Domínio 4. Essa distribuição aproxima os pesos oficiais (24/30/34/12%), mas **não imita nem prevê a banca real**. As questões são ilustrativas e usam conhecimento verificável, não “vazamentos de prova”.

### Instruções

- Responda primeiro sem consultar o gabarito; ele vem **depois da questão 80**.
- Em perguntas “**Selecione DUAS**”, marque exatamente duas alternativas.
- Você pode usar estas 80 questões como banco de treino ou sortear **65** para simular os **90 minutos** do exame.
- Cada questão vale 1 ponto neste treino particular; **não converta porcentagem diretamente em nota oficial 700**, pois a AWS utiliza escala e metodologia próprias.
- Registre suas dúvidas por **conceito confundido**, não somente por número da questão.

## Parte A — questões

### Q01 — Domínio 1 — ESCOLHA ÚNICA

Um e-commerce aumenta automaticamente de 2 para 12 instâncias no pico e retorna para 2 após a demanda. Qual benefício cloud é melhor demonstrado?
- **A)** Residência de dados
- **B)** Agilidade contratual
- **C)** Criptografia
- **D)** Elasticidade
### Q02 — Domínio 1 — ESCOLHA ÚNICA

Substituir permanentemente uma instância de 2 vCPUs por outra com 16 vCPUs representa principalmente:
- **A)** Escala horizontal
- **B)** Failover Multi-AZ
- **C)** Escala vertical
- **D)** CDN
### Q03 — Domínio 1 — ESCOLHA ÚNICA

Uma solução guarda dados de forma muito durável, mas sua aplicação fica fora do ar quando a única VM falha. Qual explicação é correta?
- **A)** Objeto durável implica HA
- **B)** Durabilidade de dados não garante disponibilidade da aplicação
- **C)** Durabilidade e disponibilidade são idênticas
- **D)** A única forma de obter HA é contratar um Dedicated Host
### Q04 — Domínio 1 — ESCOLHA ÚNICA

Uma empresa quer reduzir o impacto da falha de uma AZ sem implantar em outra Região. Qual é a estratégia inicial mais coerente?
- **A)** Implantar em AZs diferentes da mesma Região
- **B)** Criar apenas mais buckets no mesmo local
- **C)** Usar somente mais CPU numa VM
- **D)** Trocar DNS por firewall
### Q05 — Domínio 1 — ESCOLHA ÚNICA

Qual necessidade mais diretamente justifica arquitetura Multi-Region?
- **A)** Melhorar velocidade de um único disco local
- **B)** Eliminar a necessidade de IAM
- **C)** Recuperar de desastre regional e atender usuários em geografias distintas
- **D)** Evitar totalmente custos de transferência
### Q06 — Domínio 1 — ESCOLHA ÚNICA

O que melhor descreve uma Edge Location em comparação com uma AZ?
- **A)** Edge Location é o datacenter de um banco RDS
- **B)** Uma Região contém exatamente uma Edge Location
- **C)** É um local da rede de borda usado por serviços como CDN
- **D)** Edge Location substitui VPC
### Q07 — Domínio 1 — ESCOLHA ÚNICA

A troca de compra de servidores físicos por recursos contratados conforme uso ilustra qual movimento econômico típico?
- **A)** De disponibilidade para latência
- **B)** De CAPEX para despesas operacionais variáveis
- **C)** De conformidade para criptografia
- **D)** De OPEX para CAPEX
### Q08 — Domínio 1 — ESCOLHA ÚNICA

Na análise de TCO para migrar um banco on-premises à AWS, o que deve ser incluído?
- **A)** Custos de energia, manutenção, licenças, pessoas, migração e operação
- **B)** Somente o hardware antigo
- **C)** Somente a mensalidade do novo banco
- **D)** Apenas a tarifa de armazenamento
### Q09 — Domínio 1 — ESCOLHA ÚNICA

Por que economias de escala são um benefício potencial da nuvem?
- **A)** Todas as máquinas ficam ociosas por padrão
- **B)** Provedores compram e operam infraestrutura em grande escala
- **C)** Cada cliente passa a ter datacenter próprio
- **D)** Tráfego entre Regiões é sempre grátis
### Q10 — Domínio 1 — ESCOLHA ÚNICA

Qual conjunto contém somente perspectivas do AWS Cloud Adoption Framework?
- **A)** Business, People, Governance, Platform, Security, Operations
- **B)** Security, Reliability, Sustainability, Cost Optimization, Operational Excellence, Performance Efficiency
- **C)** Cost Explorer, KMS, IAM, WAF, Shield, GuardDuty
- **D)** EC2, Lambda, S3, EBS, RDS, VPC
### Q11 — Domínio 1 — ESCOLHA ÚNICA

Uma revisão sistemática avalia segurança, confiabilidade, eficiência, custos, excelência operacional e sustentabilidade de uma workload. Qual framework?
- **A)** AWS Organizations
- **B)** AWS CAF
- **C)** AWS Well-Architected Framework
- **D)** AWS Artifact
### Q12 — Domínio 1 — ESCOLHA ÚNICA

Um time quer automatizar deploys, detectar erros rapidamente e aprimorar rotinas de resposta a incidentes. Qual pilar Well-Architected está mais diretamente em foco?
- **A)** Sustentabilidade exclusivamente
- **B)** Excelência operacional
- **C)** Otimização de custos exclusivamente
- **D)** Eficiência de desempenho exclusivamente
### Q13 — Domínio 1 — ESCOLHA ÚNICA

Reduzir processamento desnecessário e melhorar utilização de recursos para diminuir impacto ambiental está mais ligado a qual pilar?
- **A)** Confiabilidade
- **B)** Segurança física
- **C)** Migração rehost
- **D)** Sustentabilidade
### Q14 — Domínio 1 — ESCOLHA ÚNICA

Uma organização move uma VM on-premises para EC2 com pouquíssimas alterações. Qual estratégia 7 Rs?
- **A)** Repurchase
- **B)** Retire
- **C)** Rehost
- **D)** Refactor
### Q15 — Domínio 1 — ESCOLHA ÚNICA

Um time migra o banco instalado em VM para RDS, mantendo essencialmente a aplicação. Qual 7 R é mais adequada?
- **A)** Repurchase
- **B)** Retain
- **C)** Retire
- **D)** Replatform
### Q16 — Domínio 1 — ESCOLHA ÚNICA

Um monolito é amplamente redesenhado para arquitetura orientada a eventos. Qual estratégia melhor descreve isso?
- **A)** Retain
- **B)** Relocate sem alterações
- **C)** Refactor / rearchitect
- **D)** Rehost
### Q17 — Domínio 1 — ESCOLHA ÚNICA

Após inventário, descobre-se um sistema antigo sem usuários que deve ser desativado. Qual 7 R?
- **A)** Rehost
- **B)** Retire
- **C)** Replatform
- **D)** Refactor
### Q18 — Domínio 1 — MÚLTIPLA RESPOSTA

**Selecione DUAS.** Quais situações ilustram adequadamente modelos de implantação?
- **A)** Banco RDS é, por definição, uma nuvem privada on-premises
- **B)** Parte do sistema local e parte AWS: híbrido
- **C)** Três instâncias EC2 na mesma Região: necessariamente multicloud
- **D)** Aplicação inteiramente em instalações próprias: on-premises
### Q19 — Domínio 1 — ESCOLHA ÚNICA

O que significa rightsizing?
- **A)** Atribuir AdministratorAccess aos usuários
- **B)** Ajustar capacidade/tipo de recurso à demanda observada
- **C)** Aumentar recursos sem analisar uso
- **D)** Adicionar uma Região obrigatoriamente
### Q20 — Domínio 1 — ESCOLHA ÚNICA

Qual afirmação sobre licenciamento na nuvem é mais correta?
- **A)** Licenças de software são sempre gratuitas na nuvem
- **B)** BYOL significa que toda licença pode ser usada em qualquer serviço
- **C)** BYOL elimina custos de computação
- **D)** Licença incluída e BYOL são opções distintas, sujeitas a elegibilidade e contrato
### Q21 — Domínio 2 — ESCOLHA ÚNICA

No modelo de responsabilidade compartilhada, quem é responsável principalmente pela segurança física dos datacenters AWS?
- **A)** Fornecedor de domínio DNS
- **B)** Usuário final
- **C)** AWS
- **D)** Cliente
### Q22 — Domínio 2 — ESCOLHA ÚNICA

Uma aplicação roda em EC2 com sistema operacional administrado pela equipe. Quem normalmente aplica patches do SO dessa instância?
- **A)** O provedor de internet do usuário
- **B)** O cliente
- **C)** A equipe de suporte da certificação
- **D)** AWS automaticamente em toda instância
### Q23 — Domínio 2 — ESCOLHA ÚNICA

Uma função Lambda contém uma dependência de terceiros desatualizada. De quem é, normalmente, a responsabilidade pela dependência incluída no código?
- **A)** Do cliente desenvolvedor da função
- **B)** Do datacenter
- **C)** Do serviço Route 53
- **D)** Somente da AWS
### Q24 — Domínio 2 — ESCOLHA ÚNICA

Quem define privilégios dos usuários do banco de dados em um RDS gerenciado?
- **A)** A AWS decide o acesso lógico aos dados de cada empresa
- **B)** O ISP da aplicação
- **C)** O cliente
- **D)** O CloudFront
### Q25 — Domínio 2 — ESCOLHA ÚNICA

Qual prática é recomendada para a conta root AWS?
- **A)** Proteger com MFA e usar somente em tarefas que exigem root
- **B)** Usá-la diariamente em deploys
- **C)** Dar a senha root a todos os desenvolvedores
- **D)** Criar e compartilhar access keys root
### Q26 — Domínio 2 — ESCOLHA ÚNICA

Uma tarefa ECS precisa ler um bucket privado S3 sem gravar credenciais fixas na imagem. Qual recurso é mais apropriado?
- **A)** Deixar senha no código
- **B)** IAM role atribuída à tarefa, com permissão mínima
- **C)** Access key root no Dockerfile
- **D)** Abrir o bucket publicamente
### Q27 — Domínio 2 — ESCOLHA ÚNICA

Um usuário tem IAM Allow para uma operação, mas a SCP aplicável a nega explicitamente. O resultado é:
- **A)** Negado
- **B)** Uma alteração automática do SCP
- **C)** Permitido, pois IAM sobrepõe SCP
- **D)** Permitido apenas por ser root sempre
### Q28 — Domínio 2 — ESCOLHA ÚNICA

Uma IAM role permite leitura no S3, mas não pode ser assumida pelo serviço esperado. O que investigar prioritariamente?
- **A)** Preço do Direct Connect
- **B)** Trust policy da role
- **C)** Tipo de instância EC2
- **D)** Classe Glacier
### Q29 — Domínio 2 — ESCOLHA ÚNICA

Uma API só precisa ler objetos em um prefixo S3 específico. Qual política segue menor privilégio?
- **A)** s3:GetObject somente nos ARNs de objetos necessários
- **B)** s3:* em todos os buckets
- **C)** AdministratorAccess
- **D)** IAMFullAccess
### Q30 — Domínio 2 — ESCOLHA ÚNICA

Funcionários precisam acessar diversas contas AWS via identidade corporativa e SSO. Qual serviço especializado?
- **A)** Amazon EFS
- **B)** Amazon SES
- **C)** IAM Identity Center
- **D)** Amazon Rekognition
### Q31 — Domínio 2 — ESCOLHA ÚNICA

Uma aplicação de assinaturas web precisa gerenciar autenticação de usuários finais. Qual serviço AWS costuma ser candidato direto?
- **A)** AWS Config
- **B)** AWS Direct Connect
- **C)** Amazon Cognito
- **D)** AWS Pricing Calculator
### Q32 — Domínio 2 — ESCOLHA ÚNICA

Qual mecanismo está mais associado à emissão de credenciais AWS temporárias ao assumir roles?
- **A)** AWS Artifact
- **B)** CloudFront
- **C)** AWS Batch
- **D)** AWS STS
### Q33 — Domínio 2 — ESCOLHA ÚNICA

Uma aplicação precisa armazenar e rotacionar senha de banco e token de API de terceiros. Qual serviço é mais adequado?
- **A)** AWS Secrets Manager
- **B)** Route 53
- **C)** Shield
- **D)** CloudTrail
### Q34 — Domínio 2 — ESCOLHA ÚNICA

Qual serviço AWS é tipicamente usado para gerir chaves criptográficas integradas a serviços AWS?
- **A)** Amazon Athena
- **B)** AWS KMS
- **C)** Amazon Lex
- **D)** Amazon Connect
### Q35 — Domínio 2 — ESCOLHA ÚNICA

Para provisionar e gerenciar certificados TLS em integrações compatíveis, escolha:
- **A)** AWS Config
- **B)** AWS Compute Optimizer
- **C)** Amazon Inspector
- **D)** AWS Certificate Manager
### Q36 — Domínio 2 — ESCOLHA ÚNICA

O auditor solicita um relatório de certificação/conformidade da infraestrutura AWS. Onde encontrá-lo?
- **A)** Amazon EC2
- **B)** AWS Artifact
- **C)** Amazon ElastiCache
- **D)** Amazon CloudWatch
### Q37 — Domínio 2 — ESCOLHA ÚNICA

Um security group foi alterado ontem. Qual serviço ajuda a identificar a chamada de API que fez a mudança?
- **A)** AWS CloudTrail
- **B)** AWS Pricing Calculator
- **C)** Amazon EFS
- **D)** Amazon Polly
### Q38 — Domínio 2 — ESCOLHA ÚNICA

Qual serviço centraliza métricas, logs operacionais e alarmes de uma aplicação?
- **A)** AWS Artifact
- **B)** Amazon CloudWatch
- **C)** AWS DMS
- **D)** AWS Firewall Manager
### Q39 — Domínio 2 — ESCOLHA ÚNICA

Uma empresa quer avaliar continuamente se recursos seguem regras de configuração aprovadas. Qual serviço?
- **A)** Amazon SES
- **B)** Amazon WorkSpaces
- **C)** Amazon Kinesis
- **D)** AWS Config
### Q40 — Domínio 2 — ESCOLHA ÚNICA

Qual serviço identifica ameaças e atividades potencialmente maliciosas em ambientes AWS?
- **A)** Amazon GuardDuty
- **B)** Amazon QuickSight
- **C)** Amazon EFS
- **D)** AWS Pricing Calculator
### Q41 — Domínio 2 — ESCOLHA ÚNICA

Um time precisa detectar pacotes de software vulneráveis em instâncias e imagens compatíveis. Qual serviço?
- **A)** AWS Artifact
- **B)** Amazon Inspector
- **C)** Amazon Translate
- **D)** Amazon Macie
### Q42 — Domínio 2 — ESCOLHA ÚNICA

A equipe quer localizar dados pessoais sensíveis em objetos armazenados no S3. Qual serviço é candidato direto?
- **A)** AWS CloudFormation
- **B)** AWS CodeBuild
- **C)** AWS DMS
- **D)** Amazon Macie
### Q43 — Domínio 2 — ESCOLHA ÚNICA

A empresa quer um painel unificado com descobertas de segurança de diversos serviços e meios de investigar relações entre eventos. Qual combinação atende melhor?
- **A)** SQS e SES
- **B)** EBS e Route 53
- **C)** Athena e WorkSpaces
- **D)** Security Hub e Detective
### Q44 — Domínio 2 — MÚLTIPLA RESPOSTA

**Selecione DUAS.** Uma API precisa filtrar padrões de requisições HTTP maliciosas e ter proteção contra DDoS. Quais serviços atendem diretamente a esses requisitos?
- **A)** AWS Glue
- **B)** Amazon EFS
- **C)** AWS Shield
- **D)** AWS WAF
### Q45 — Domínio 3 — ESCOLHA ÚNICA

Um operador deseja executar comandos de AWS de maneira repetível no terminal. Qual ferramenta?
- **A)** AWS Artifact
- **B)** Amazon Route 53
- **C)** AWS CLI
- **D)** Amazon Macie
### Q46 — Domínio 3 — ESCOLHA ÚNICA

Uma equipe deseja provisionar VPC, subnets e recursos de modo declarativo e versionável. Qual serviço?
- **A)** AWS CloudFormation
- **B)** AWS Shield
- **C)** Amazon Comprehend
- **D)** Amazon WorkSpaces
### Q47 — Domínio 3 — ESCOLHA ÚNICA

Qual afirmação sobre as subnets de uma VPC é correta?
- **A)** Toda subnet é acessível publicamente
- **B)** Cada subnet pode pertencer a várias Regiões ao mesmo tempo
- **C)** Edge Locations são subnets privadas
- **D)** Uma subnet fica em uma AZ; uma VPC regional pode conter subnets em várias AZs
### Q48 — Domínio 3 — ESCOLHA ÚNICA

Uma aplicação científica fica limitada principalmente por processamento de CPU. Qual família EC2 investigar primeiro?
- **A)** Storage optimized obrigatoriamente
- **B)** Compute optimized
- **C)** Lightsail somente
- **D)** Memory optimized
### Q49 — Domínio 3 — MÚLTIPLA RESPOSTA

**Selecione DUAS.** A aplicação web precisa distribuir requisições HTTP entre instâncias e aumentar a quantidade de instâncias quando o tráfego cresce. Quais recursos se complementam?
- **A)** Application Load Balancer
- **B)** AWS Artifact
- **C)** Amazon Polly
- **D)** EC2 Auto Scaling
### Q50 — Domínio 3 — ESCOLHA ÚNICA

Onde armazenar imagens privadas de contêiner de uma aplicação para execução posterior em serviços AWS?
- **A)** Amazon EFS obrigatoriamente
- **B)** AWS Config
- **C)** Amazon ECR
- **D)** Amazon Connect
### Q51 — Domínio 3 — ESCOLHA ÚNICA

O time usa ECS e deseja eliminar a administração de hosts EC2 para os contêineres. Qual opção?
- **A)** S3 Glacier
- **B)** AWS Artifact
- **C)** AWS Fargate
- **D)** Amazon Textract
### Q52 — Domínio 3 — ESCOLHA ÚNICA

A empresa depende de Kubernetes e quer usar serviço gerenciado pela AWS. Qual produto?
- **A)** Amazon EKS
- **B)** AWS Storage Gateway
- **C)** Amazon SES
- **D)** Amazon S3
### Q53 — Domínio 3 — ESCOLHA ÚNICA

Um código pequeno deve executar quando um objeto chega ao S3, sem provisionar servidor dedicado. Qual compute mais natural?
- **A)** AWS Direct Connect
- **B)** Amazon Redshift
- **C)** AWS Lambda
- **D)** Amazon WorkSpaces
### Q54 — Domínio 3 — ESCOLHA ÚNICA

Uma empresa precisa agendar e executar milhares de trabalhos de processamento em lote. Qual serviço foi feito para isso?
- **A)** AWS WAF
- **B)** Amazon Route 53
- **C)** Amazon Lex
- **D)** AWS Batch
### Q55 — Domínio 3 — ESCOLHA ÚNICA

Uma equipe quer reduzir a operação de um banco PostgreSQL transacional. Qual serviço?
- **A)** AWS Shield
- **B)** Amazon SNS
- **C)** Amazon Kinesis
- **D)** Amazon RDS
### Q56 — Domínio 3 — ESCOLHA ÚNICA

Qual opção é desenhada para melhorar disponibilidade/failover de um banco RDS frente à falha de uma AZ?
- **A)** S3 Intelligent-Tiering
- **B)** Multi-AZ deployment
- **C)** Read Replica obrigatoriamente substituindo backups
- **D)** Somente Route 53
### Q57 — Domínio 3 — ESCOLHA ÚNICA

O banco relacional está saudável, mas as consultas de leitura aumentaram muito. Que capacidade considerar?
- **A)** AWS Artifact
- **B)** Um certificado ACM
- **C)** Aumentar WAF rules
- **D)** Read replicas
### Q58 — Domínio 3 — ESCOLHA ÚNICA

Para uma aplicação com dados chave-valor em altíssima escala e sem servidores de banco gerenciados pelo cliente, qual serviço?
- **A)** Amazon DynamoDB
- **B)** AWS CodePipeline
- **C)** Amazon FSx
- **D)** Amazon CloudFront
### Q59 — Domínio 3 — ESCOLHA ÚNICA

Um serviço precisa acelerar leituras frequentes ao reduzir consultas à origem. Qual serviço é diretamente dedicado a cache em memória?
- **A)** Amazon Macie
- **B)** Amazon Neptune
- **C)** Amazon ElastiCache
- **D)** AWS CloudTrail
### Q60 — Domínio 3 — ESCOLHA ÚNICA

O cliente deseja uma rede virtual logicamente isolada, com subnets e rotas próprias. Qual serviço?
- **A)** Amazon SES
- **B)** Amazon QuickSight
- **C)** Amazon Textract
- **D)** Amazon VPC
### Q61 — Domínio 3 — ESCOLHA ÚNICA

Qual afirmação distingue Security Group de Network ACL?
- **A)** SG é stateful e associado a recursos; NACL é stateless e controla subnet
- **B)** NACL só administra IAM roles
- **C)** SG é stateless, NACL é stateful
- **D)** Ambos são bancos de dados
### Q62 — Domínio 3 — ESCOLHA ÚNICA

Uma instância em subnet privada precisa fazer requisições IPv4 de saída à internet sem aceitar novas conexões externas diretas. Qual componente?
- **A)** Amazon Cognito
- **B)** Amazon S3 Glacier
- **C)** NAT Gateway
- **D)** AWS Organizations
### Q63 — Domínio 3 — ESCOLHA ÚNICA

Uma companhia quer conexão dedicada do escritório/datacenter à AWS em vez de usar somente VPN sobre internet. Qual serviço?
- **A)** Amazon Athena
- **B)** AWS Step Functions
- **C)** AWS Direct Connect
- **D)** Amazon SNS
### Q64 — Domínio 3 — ESCOLHA ÚNICA

Qual serviço constrói um túnel criptografado pela internet entre a rede corporativa e a AWS?
- **A)** Amazon ElastiCache
- **B)** Amazon WorkSpaces
- **C)** AWS Site-to-Site VPN
- **D)** AWS Glue
### Q65 — Domínio 3 — ESCOLHA ÚNICA

O sistema precisa que `api.exemplo.com` resolva para o endpoint correto. Qual serviço tem DNS como função principal?
- **A)** Amazon EBS
- **B)** AWS Fargate
- **C)** Amazon Inspector
- **D)** Amazon Route 53
### Q66 — Domínio 3 — ESCOLHA ÚNICA

O frontend serve JS, CSS e imagens para usuários mundialmente, buscando reduzir latência de entrega. Qual serviço?
- **A)** Amazon CloudFront
- **B)** Amazon Neptune
- **C)** AWS Database Migration Service
- **D)** AWS CloudHSM
### Q67 — Domínio 3 — ESCOLHA ÚNICA

Um sistema precisa armazenar milhões de relatórios em arquivos acessíveis por API, organizados em buckets e chaves. Qual serviço?
- **A)** Amazon EC2 Instance Store
- **B)** Amazon S3
- **C)** Amazon RDS
- **D)** Amazon EBS
### Q68 — Domínio 3 — ESCOLHA ÚNICA

Os arquivos precisam ficar retidos por muitos anos e serão recuperados rarissimamente, aceitando espera para recuperação. Qual classe é candidata?
- **A)** S3 Glacier Deep Archive
- **B)** S3 Standard
- **C)** S3 Standard-IA obrigatoriamente
- **D)** EBS gp3
### Q69 — Domínio 3 — MÚLTIPLA RESPOSTA

**Selecione DUAS.** Qual solução combina corretamente o modelo de armazenamento com o requisito?
- **A)** S3: disco de boot obrigatório de toda EC2
- **B)** EFS: sistema compartilhado NFS para instâncias Linux compatíveis
- **C)** EBS: volume persistente em bloco para instância EC2
- **D)** Instance Store: storage de backup persistente independente da instância
### Q70 — Domínio 3 — ESCOLHA ÚNICA

Uma equipe deseja consultar arquivos Parquet no S3 usando SQL sem gerenciar cluster e manter um catálogo de metadados/ETL. Qual dupla é mais adequada?
- **A)** WorkSpaces e Polly
- **B)** Athena e Glue
- **C)** CloudTrail e Shield
- **D)** Neptune e Route 53
### Q71 — Domínio 3 — MÚLTIPLA RESPOSTA

**Selecione DUAS.** Uma plataforma precisa armazenar trabalhos em fila para processamento posterior e enviar eventos a vários assinantes. Quais serviços respectivamente são relevantes?
- **A)** Amazon SQS
- **B)** Amazon SNS
- **C)** AWS Certificate Manager
- **D)** Amazon EFS
### Q72 — Domínio 4 — ESCOLHA ÚNICA

Jobs de simulação toleram interrupções e podem ser reiniciados. Qual modelo EC2 oferece grande desconto potencial aceitando interrupção?
- **A)** Somente On-Demand
- **B)** Dedicated Hosts
- **C)** On-Demand Capacity Reservation
- **D)** Spot Instances
### Q73 — Domínio 4 — ESCOLHA ÚNICA

Uma empresa tem carga EC2 estável por anos e aceita compromisso para economizar em relação ao On-Demand. Qual categoria deve avaliar?
- **A)** AWS Artifact
- **B)** Reserved Instances
- **C)** Somente NAT Gateway
- **D)** Spot obrigatoriamente
### Q74 — Domínio 4 — ESCOLHA ÚNICA

Qual afirmação sobre Savings Plans é correta?
- **A)** Oferecem descontos por compromisso de gasto/uso elegível por período
- **B)** São um firewall de preço zero
- **C)** Servem exclusivamente para DNS
- **D)** Garantem, por si só, capacidade em qualquer AZ
### Q75 — Domínio 4 — ESCOLHA ÚNICA

Qual opção atende cenário em que licenciamento exige controle sobre servidor físico dedicado?
- **A)** Dedicated Host
- **B)** S3 One Zone-IA
- **C)** Amazon Macie
- **D)** Amazon EventBridge
### Q76 — Domínio 4 — ESCOLHA ÚNICA

Você ainda não implantou a arquitetura e precisa estimar sua conta mensal a partir de hipóteses de uso. Qual ferramenta?
- **A)** Amazon EKS
- **B)** AWS Pricing Calculator
- **C)** AWS CloudTrail
- **D)** Amazon GuardDuty
### Q77 — Domínio 4 — ESCOLHA ÚNICA

A conta aumentou 40% no último mês e o time deseja explorar gastos por serviço e período. Qual recurso?
- **A)** AWS Step Functions
- **B)** AWS Cost Explorer
- **C)** AWS ACM
- **D)** Amazon Lex
### Q78 — Domínio 4 — ESCOLHA ÚNICA

O gestor quer alertas quando o custo projetado ou efetivo se aproximar do limite planejado. Qual serviço?
- **A)** AWS Budgets
- **B)** Amazon Textract
- **C)** Amazon DocumentDB
- **D)** AWS Direct Connect
### Q79 — Domínio 4 — ESCOLHA ÚNICA

Uma empresa quer fatura centralizada para várias contas e eventual compartilhamento de descontos elegíveis. Qual recurso?
- **A)** Amazon Route 53 exclusivamente
- **B)** AWS X-Ray
- **C)** Amazon Polly
- **D)** AWS Organizations com consolidated billing
### Q80 — Domínio 4 — ESCOLHA ÚNICA

Em outubro de 2026, qual afirmação sobre planos AWS Support é mais precisa?
- **A)** O suporte não possui opção gratuita
- **B)** AWS Support substitui IAM e WAF
- **C)** A AWS já apresenta Business Support+ e Enterprise Support, enquanto o guia CLF-C02 ainda cita nomes tradicionais em transição
- **D)** Todos os planos antigos foram extintos em 2020

---

## Parte B — gabarito rápido

**Q01: D** | **Q02: C** | **Q03: B** | **Q04: A** | **Q05: C** | **Q06: C** | **Q07: B** | **Q08: A** | **Q09: B** | **Q10: A**

**Q11: C** | **Q12: B** | **Q13: D** | **Q14: C** | **Q15: D** | **Q16: C** | **Q17: B** | **Q18: BD** | **Q19: B** | **Q20: D**

**Q21: C** | **Q22: B** | **Q23: A** | **Q24: C** | **Q25: A** | **Q26: B** | **Q27: A** | **Q28: B** | **Q29: A** | **Q30: C**

**Q31: C** | **Q32: D** | **Q33: A** | **Q34: B** | **Q35: D** | **Q36: B** | **Q37: A** | **Q38: B** | **Q39: D** | **Q40: A**

**Q41: B** | **Q42: D** | **Q43: D** | **Q44: CD** | **Q45: C** | **Q46: A** | **Q47: D** | **Q48: B** | **Q49: AD** | **Q50: C**

**Q51: C** | **Q52: A** | **Q53: C** | **Q54: D** | **Q55: D** | **Q56: B** | **Q57: D** | **Q58: A** | **Q59: C** | **Q60: D**

**Q61: A** | **Q62: C** | **Q63: C** | **Q64: C** | **Q65: D** | **Q66: A** | **Q67: B** | **Q68: A** | **Q69: BC** | **Q70: B**

**Q71: AB** | **Q72: D** | **Q73: B** | **Q74: A** | **Q75: A** | **Q76: B** | **Q77: B** | **Q78: A** | **Q79: D** | **Q80: C**

## Parte C — gabarito comentado

Uma resposta certa por sorte não indica domínio. Para cada questão errada, faça a pergunta inversa: *que frase do enunciado levou a escolher um serviço ou conceito em vez do outro?*

**Q01 — D.** Elasticidade é o ajuste dinâmico de recursos conforme a demanda. Escalabilidade é capacidade de crescer; aqui há crescimento e redução automática. **Alternativa(s) correta(s):** D: Elasticidade.

**Q02 — C.** Scale up aumenta a capacidade da mesma unidade. Scale out adicionaria outras instâncias. **Alternativa(s) correta(s):** C: Escala vertical.

**Q03 — B.** Durabilidade é preservação dos dados; disponibilidade é conseguir usar o serviço. Uma VM única segue sendo ponto de falha. **Alternativa(s) correta(s):** B: Durabilidade de dados não garante disponibilidade da aplicação.

**Q04 — A.** Multi-AZ distribui componentes por domínios de falha dentro da Região. A aplicação toda precisa ser preparada para redundância. **Alternativa(s) correta(s):** A: Implantar em AZs diferentes da mesma Região.

**Q05 — C.** Multi-Region pode apoiar DR regional, residência de dados e proximidade; envolve complexidade e custos. **Alternativa(s) correta(s):** C: Recuperar de desastre regional e atender usuários em geografias distintas.

**Q06 — C.** Edge locations aproximam distribuição de conteúdo e funções de borda. AZ é domínio de falha de infraestrutura regional. **Alternativa(s) correta(s):** C: É um local da rede de borda usado por serviços como CDN.

**Q07 — B.** A nuvem tende a trocar parte de investimentos iniciais em hardware por despesas ligadas ao consumo. Tratamento contábil específico depende do contrato. **Alternativa(s) correta(s):** B: De CAPEX para despesas operacionais variáveis.

**Q08 — A.** TCO incorpora custos diretos/indiretos ao longo do ciclo de vida, e não somente a etiqueta de preço do serviço. **Alternativa(s) correta(s):** A: Custos de energia, manutenção, licenças, pessoas, migração e operação.

**Q09 — B.** Grandes volumes podem reduzir custos unitários e melhorar eficiência, mas não tornam toda migração automaticamente barata. **Alternativa(s) correta(s):** B: Provedores compram e operam infraestrutura em grande escala.

**Q10 — A.** As seis perspectivas do CAF descrevem capacidades de transformação organizacional; o conjunto da alternativa B é o Well-Architected. **Alternativa(s) correta(s):** A: Business, People, Governance, Platform, Security, Operations.

**Q11 — C.** Os seis pilares pertencem ao Well-Architected Framework, não ao CAF. **Alternativa(s) correta(s):** C: AWS Well-Architected Framework.

**Q12 — B.** Operar, monitorar e melhorar continuamente processos são capacidades do pilar excelência operacional. **Alternativa(s) correta(s):** B: Excelência operacional.

**Q13 — D.** Sustentabilidade visa minimizar consumo e impactos ambientais, aproveitando recursos de forma eficiente. **Alternativa(s) correta(s):** D: Sustentabilidade.

**Q14 — C.** Rehost é lift-and-shift, com poucas mudanças de aplicação. **Alternativa(s) correta(s):** C: Rehost.

**Q15 — D.** Replatform moderniza um componente sem redesenho substancial da aplicação. **Alternativa(s) correta(s):** D: Replatform.

**Q16 — C.** Refactor envolve mudar a arquitetura/código, não apenas o ambiente. **Alternativa(s) correta(s):** C: Refactor / rearchitect.

**Q17 — B.** Retire encerra sistemas sem valor. Retain significaria manter sem migrar. **Alternativa(s) correta(s):** B: Retire.

**Q18 — B e D.** On-premises corresponde ao ambiente local; híbrido integra local e nuvem. Várias instâncias AWS não caracterizam multicloud. **Alternativa(s) correta(s):** B: Parte do sistema local e parte AWS: híbrido; D: Aplicação inteiramente em instalações próprias: on-premises.

**Q19 — B.** Rightsizing evita recursos super/subdimensionados conforme padrões de uso e desempenho. **Alternativa(s) correta(s):** B: Ajustar capacidade/tipo de recurso à demanda observada.

**Q20 — D.** BYOL exige observância dos termos do fornecedor e modalidade; licença incluída está precificada no serviço quando oferecida. **Alternativa(s) correta(s):** D: Licença incluída e BYOL são opções distintas, sujeitas a elegibilidade e contrato.

**Q21 — C.** Segurança física e infraestrutura subjacente são responsabilidades da AWS. **Alternativa(s) correta(s):** C: AWS.

**Q22 — B.** Em EC2, o cliente administra o sistema operacional convidado; a AWS cuida da infraestrutura abaixo da VM. **Alternativa(s) correta(s):** B: O cliente.

**Q23 — A.** A AWS opera a infraestrutura da Lambda, mas a aplicação e suas dependências seguem sob responsabilidade do cliente. **Alternativa(s) correta(s):** A: Do cliente desenvolvedor da função.

**Q24 — C.** RDS reduz administração de infraestrutura, mas não escolhe a autorização lógica dos dados da aplicação. **Alternativa(s) correta(s):** C: O cliente.

**Q25 — A.** Root é altamente privilegiado; deve ser protegido e pouco utilizado. **Alternativa(s) correta(s):** A: Proteger com MFA e usar somente em tarefas que exigem root.

**Q26 — B.** Roles de workload fornecem credenciais temporárias e políticas adequadas. **Alternativa(s) correta(s):** B: IAM role atribuída à tarefa, com permissão mínima.

**Q27 — A.** Deny explícito prevalece; SCP define limites e não concede permissões. **Alternativa(s) correta(s):** A: Negado.

**Q28 — B.** Trust policy define quem pode assumir uma role, não as ações após assumi-la. **Alternativa(s) correta(s):** B: Trust policy da role.

**Q29 — A.** Permissões devem abranger apenas ações/recursos indispensáveis. **Alternativa(s) correta(s):** A: s3:GetObject somente nos ARNs de objetos necessários.

**Q30 — C.** IAM Identity Center centraliza identidade/atribuições de força de trabalho. Cognito é tipicamente orientado a usuários finais de apps. **Alternativa(s) correta(s):** C: IAM Identity Center.

**Q31 — C.** Cognito fornece capacidades de identidade para aplicações web/mobile. **Alternativa(s) correta(s):** C: Amazon Cognito.

**Q32 — D.** STS fornece credenciais temporárias de sessão; reduz necessidade de chaves fixas. **Alternativa(s) correta(s):** D: AWS STS.

**Q33 — A.** Secrets Manager cuida do armazenamento/gerenciamento e rotação de segredos, quando configurado. **Alternativa(s) correta(s):** A: AWS Secrets Manager.

**Q34 — B.** KMS gerencia chaves criptográficas; CloudHSM atende requisitos de HSM dedicado. **Alternativa(s) correta(s):** B: AWS KMS.

**Q35 — D.** ACM gerencia certificados. KMS é gerenciamento de chaves para criptografia. **Alternativa(s) correta(s):** D: AWS Certificate Manager.

**Q36 — B.** Artifact disponibiliza documentação de conformidade e determinados acordos. **Alternativa(s) correta(s):** B: AWS Artifact.

**Q37 — A.** CloudTrail audita eventos/ações de API. **Alternativa(s) correta(s):** A: AWS CloudTrail.

**Q38 — B.** CloudWatch observa workload com métricas, logs, dashboards e alarmes. **Alternativa(s) correta(s):** B: Amazon CloudWatch.

**Q39 — D.** Config registra estados de configuração e verifica regras de conformidade. **Alternativa(s) correta(s):** D: AWS Config.

**Q40 — A.** GuardDuty é detecção de ameaças, não varredura genérica de CVEs. **Alternativa(s) correta(s):** A: Amazon GuardDuty.

**Q41 — B.** Inspector avalia vulnerabilidades. Macie identifica dados sensíveis em S3. **Alternativa(s) correta(s):** B: Amazon Inspector.

**Q42 — D.** Macie é especializado em descobrir/classificar dados sensíveis no S3. **Alternativa(s) correta(s):** D: Amazon Macie.

**Q43 — D.** Security Hub agrega achados; Detective apoia investigação contextual. Um não substitui o outro. **Alternativa(s) correta(s):** D: Security Hub e Detective.

**Q44 — C e D.** WAF filtra tráfego HTTP(S) por regras; Shield foca mitigação DDoS. Firewall Manager centraliza políticas, mas não é a resposta direta aos dois controles pedidos. **Alternativa(s) correta(s):** C: AWS Shield; D: AWS WAF.

**Q45 — C.** AWS CLI é interface de linha de comando para APIs AWS. SDKs são bibliotecas para aplicações. **Alternativa(s) correta(s):** C: AWS CLI.

**Q46 — A.** CloudFormation usa templates para representar stacks de infraestrutura e controlar alterações. **Alternativa(s) correta(s):** A: AWS CloudFormation.

**Q47 — D.** Subnets pertencem a uma AZ. Uma VPC pode cobrir AZs da Região. **Alternativa(s) correta(s):** D: Uma subnet fica em uma AZ; uma VPC regional pode conter subnets em várias AZs.

**Q48 — B.** Compute optimized é a família orientada a processamento. Medição real é sempre necessária antes de dimensionar. **Alternativa(s) correta(s):** B: Compute optimized.

**Q49 — A e D.** ALB distribui tráfego entre destinos; EC2 Auto Scaling aumenta/reduz instâncias. **Alternativa(s) correta(s):** A: Application Load Balancer; D: EC2 Auto Scaling.

**Q50 — C.** ECR é registro de imagens. ECS/EKS orquestram a execução. **Alternativa(s) correta(s):** C: Amazon ECR.

**Q51 — C.** Fargate fornece compute serverless para contêineres compatíveis com ECS e EKS. **Alternativa(s) correta(s):** C: AWS Fargate.

**Q52 — A.** EKS oferece orquestração Kubernetes gerenciada. **Alternativa(s) correta(s):** A: Amazon EKS.

**Q53 — C.** Lambda executa funções acionadas por eventos e abstrai servidores subjacentes. **Alternativa(s) correta(s):** C: AWS Lambda.

**Q54 — D.** AWS Batch administra o agendamento e execução de workloads batch com recursos compatíveis. **Alternativa(s) correta(s):** D: AWS Batch.

**Q55 — D.** RDS gerencia parte relevante da infraestrutura e operação de banco relacional. **Alternativa(s) correta(s):** D: Amazon RDS.

**Q56 — B.** Multi-AZ atende alta disponibilidade; réplicas de leitura são outra capacidade com objetivo principal distinto. **Alternativa(s) correta(s):** B: Multi-AZ deployment.

**Q57 — D.** Read replicas podem distribuir consultas; dependem de mecanismo e requisitos de consistência. **Alternativa(s) correta(s):** D: Read replicas.

**Q58 — A.** DynamoDB é NoSQL serverless gerenciado para modelos chave-valor/documento. **Alternativa(s) correta(s):** A: Amazon DynamoDB.

**Q59 — C.** ElastiCache é cache em memória; requer política coerente de expiração e invalidação. **Alternativa(s) correta(s):** C: Amazon ElastiCache.

**Q60 — D.** VPC cria rede virtual regional com subnets, rotas e controles. **Alternativa(s) correta(s):** D: Amazon VPC.

**Q61 — A.** Security Groups acompanham conexões; NACL exige regras de entrada e saída e admite denies. **Alternativa(s) correta(s):** A: SG é stateful e associado a recursos; NACL é stateless e controla subnet.

**Q62 — C.** NAT Gateway pode viabilizar saída IPv4 de subnets privadas quando há rotas e configurações adequadas. **Alternativa(s) correta(s):** C: NAT Gateway.

**Q63 — C.** Direct Connect oferece conectividade dedicada. Criptografia ponta a ponta deve ser analisada separadamente. **Alternativa(s) correta(s):** C: AWS Direct Connect.

**Q64 — C.** Site-to-Site VPN é opção de conectividade híbrida por túnel criptografado. **Alternativa(s) correta(s):** C: AWS Site-to-Site VPN.

**Q65 — D.** Route 53 oferece DNS e recursos associados de roteamento. **Alternativa(s) correta(s):** D: Amazon Route 53.

**Q66 — A.** CloudFront é CDN com pontos de borda e mecanismos de cache/distribuição. **Alternativa(s) correta(s):** A: Amazon CloudFront.

**Q67 — B.** S3 é object storage. EBS fornece blocos e RDS banco relacional. **Alternativa(s) correta(s):** B: Amazon S3.

**Q68 — A.** Deep Archive é voltada a arquivamento de longa duração com recuperação não imediata. **Alternativa(s) correta(s):** A: S3 Glacier Deep Archive.

**Q69 — B e C.** EBS é bloco persistente; EFS é arquivo compartilhado. S3 é objeto e instance store é efêmero. **Alternativa(s) correta(s):** B: EFS: sistema compartilhado NFS para instâncias Linux compatíveis; C: EBS: volume persistente em bloco para instância EC2.

**Q70 — B.** Athena consulta dados por SQL; Glue cataloga/transforma. Não implica que Glue seja obrigatório em toda consulta Athena. **Alternativa(s) correta(s):** B: Athena e Glue.

**Q71 — A e B.** SQS desacopla produtores/consumidores por filas; SNS distribui mensagens via pub/sub. **Alternativa(s) correta(s):** A: Amazon SQS; B: Amazon SNS.

**Q72 — D.** Spot usa capacidade disponível com interrupção possível; adequado para batch resiliente. **Alternativa(s) correta(s):** D: Spot Instances.

**Q73 — B.** RIs são opção de desconto por compromisso de prazo, com condições próprias. **Alternativa(s) correta(s):** B: Reserved Instances.

**Q74 — A.** Savings Plans não são mecanismo genérico de reserva de capacidade nem preço fixo zero. **Alternativa(s) correta(s):** A: Oferecem descontos por compromisso de gasto/uso elegível por período.

**Q75 — A.** Dedicated Hosts atendem isolamento físico e requisitos de licenciamento compatíveis. **Alternativa(s) correta(s):** A: Dedicated Host.

**Q76 — B.** Pricing Calculator ajuda a simular custos futuros antes da implantação. **Alternativa(s) correta(s):** B: AWS Pricing Calculator.

**Q77 — B.** Cost Explorer permite exploração e análise de custos históricos, tendências e detalhamentos suportados. **Alternativa(s) correta(s):** B: AWS Cost Explorer.

**Q78 — A.** Budgets define orçamento e notificação. Alerta não deve ser presumido como teto automático universal. **Alternativa(s) correta(s):** A: AWS Budgets.

**Q79 — D.** Organizations organiza contas e oferece cobrança consolidada; não unifica automaticamente permissões entre as contas. **Alternativa(s) correta(s):** D: AWS Organizations com consolidated billing.

**Q80 — C.** Documentação atual lista Basic, Business Support+, Enterprise Support e Unified Operations; planos Developer, Business e Enterprise On-Ramp estão em transição com descontinuação anunciada para 2027. **Alternativa(s) correta(s):** C: A AWS já apresenta Business Support+ e Enterprise Support, enquanto o guia CLF-C02 ainda cita nomes tradicionais em transição.

---
# 24. Flashcards para revisão ativa

> **Nomes completos nesta página:** AWS Certificate Manager (**ACM**); Application Load Balancer (**ALB**); AWS Database Migration Service (**AWS DMS**); AWS Elastic Disaster Recovery (**AWS DRS**); Amazon Elastic Block Store (**EBS**); Amazon Elastic Compute Cloud (**EC2**); Amazon Elastic Container Registry (**ECR**); Amazon Elastic Container Service (**ECS**); Amazon Elastic File System (**EFS**); Amazon Elastic Kubernetes Service (**EKS**); Amazon Elastic MapReduce (**Amazon EMR**, nome que originou a sigla); AWS Identity and Access Management (**IAM**); AWS Key Management Service (**AWS KMS**); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**); AWS Schema Conversion Tool (**AWS SCT**); Amazon Simple Email Service (**Amazon SES**); Amazon Simple Notification Service (**Amazon SNS**); Amazon Simple Queue Service (**Amazon SQS**); AWS Security Token Service (**AWS STS**); Amazon Virtual Private Cloud (**VPC**); AWS Web Application Firewall (**AWS WAF**).

**Como usar:** cubra a coluna da direita, tente responder em voz alta e só então confira. Separe os cartões em três caixas: sei / hesitei / errei. Revise os que errou em intervalos de 1, 3 e 7 dias.

## Fundamentos

| Pergunta | Resposta curta |
|---|---|
| O que diferencia escalabilidade de elasticidade? | Escalabilidade suporta mais carga; elasticidade ajusta recursos à demanda, aumentando e reduzindo. |
| Scale up e scale out? | Up aumenta a capacidade de uma unidade; out acrescenta mais unidades. |
| O que é alta disponibilidade? | Arquitetura para manter o serviço acessível apesar de falhas. |
| O que é durabilidade? | Propriedade de preservar dados ao longo do tempo. |
| O que são RTO e RPO? | RTO é tempo-alvo de recuperação; RPO é ponto-alvo de recuperação de dados. |
| Uma AZ equivale a uma Região? | Não. Uma Região contém várias AZs. |
| Onde ficam edge locations? | Na rede global de borda; usadas por serviços de distribuição/aceleração. |
| Quando considerar Multi-Region? | Falha regional, DR, geografia de usuários ou residência de dados. |
| CAPEX versus OPEX? | Investimento de capital versus despesa operacional. |
| O que é TCO? | Custo total de propriedade, incluindo pessoas, infraestrutura, energia, licenças e operação. |
| O que é rightsizing? | Adequar tipo e tamanho de recurso ao uso real. |
| O que é pay-as-you-go? | Modelo de cobrança ligado ao consumo, sujeito a unidade e contrato específicos. |

## Arquitetura

| Pergunta | Resposta curta |
|---|---|
| Os seis pilares do Well-Architected? | Excelência operacional, segurança, confiabilidade, performance, custos e sustentabilidade. |
| Well-Architected versus CAF? | Workload e pilares técnicos versus prontidão/transformação organizacional. |
| As seis perspectivas do AWS CAF? | Business, People, Governance, Platform, Security, Operations. |
| Rehost? | Migrar com poucas mudanças: lift-and-shift. |
| Replatform? | Modernizar parte da plataforma sem redesenho substancial. |
| Refactor? | Redesenhar arquitetura/código de modo relevante. |
| Repurchase? | Trocar por produto/SaaS novo. |
| Retain e Retire? | Manter por enquanto versus desativar definitivamente. |
| Relocate? | Mover infraestrutura/plataforma de hospedagem com pouco redesenho. |
| O que é stateless? | Processamento não depende de sessão crítica guardada numa instância específica. |

## Segurança

| Pergunta | Resposta curta |
|---|---|
| Quem protege fisicamente os datacenters AWS? | A AWS. |
| Quem define o acesso aos dados da aplicação? | O cliente, via identidades, rede e autorização de negócio. |
| Quem atualiza normalmente SO de EC2? | O cliente. |
| Quem gerencia dependências do código Lambda? | O cliente. |
| Usuário root deve ser usado diariamente? | Não. Apenas nas tarefas necessárias; proteger com MFA. |
| Autenticação versus autorização? | Verificar identidade versus decidir o que pode fazer. |
| IAM user versus IAM role? | Usuário é identidade da conta; role é assumida para sessão/credenciais temporárias. |
| Group no IAM? | Conjunto de usuários para facilitar políticas; role não pertence a grupo. |
| Trust policy versus permissions policy? | Quem assume role versus o que ela pode fazer. |
| Deny explícito versus Allow? | Deny explícito aplicável prevalece. |
| Uma SCP concede acesso? | Não, SCP limita permissões em conta/organização. |
| Permissions boundary concede acesso? | Não, define limite de permissões. |
| Menor privilégio? | Permitir só as ações e recursos necessários. |
| O que é STS? | Credenciais temporárias AWS para sessões e roles. |
| Identity Center versus Cognito? | SSO de workforce/contas AWS versus login de usuários de aplicação. |
| KMS versus CloudHSM? | Chaves gerenciadas integradas versus HSM dedicado. |
| ACM? | Certificados TLS. |
| Secrets Manager? | Armazenamento, gerenciamento e rotação de segredos. |
| Artifact? | Relatórios e documentos de conformidade AWS. |
| WAF? | Filtragem de tráfego HTTP(S) para aplicações web. |
| Shield? | Proteção DDoS. |
| Firewall Manager? | Gestão centralizada de políticas de firewall. |
| GuardDuty? | Detecção de ameaças. |
| Inspector? | Descoberta/avaliação de vulnerabilidades. |
| Macie? | Detecção de dados sensíveis em S3. |
| Security Hub? | Centralização de achados de segurança. |
| Detective? | Investigação contextual de eventos de segurança. |
| CloudTrail? | Quem fez qual chamada/API e quando. |
| CloudWatch? | Métricas, logs, dashboards e alarmes. |
| Config? | Inventário/histórico de configuração e regras de conformidade. |

## Computação

| Pergunta | Resposta curta |
|---|---|
| EC2? | Máquinas virtuais administráveis. |
| AMI? | Imagem usada para iniciar EC2. |
| Compute optimized? | Família de instâncias voltada a processamento CPU. |
| Memory optimized? | Família voltada a grandes necessidades de RAM. |
| ALB? | Balanceamento de tráfego HTTP(S) e roteamento por aplicação. |
| Auto Scaling? | Ajuste de quantidade de instâncias/capacidade. |
| ECR? | Registro de imagens de contêiner. |
| ECS? | Orquestração de contêineres AWS. |
| EKS? | Kubernetes gerenciado. |
| Fargate? | Compute serverless para contêineres compatíveis. |
| Lambda? | Execução de funções baseada em eventos, sem gerir servidores. |
| Batch? | Agenda e executa processamento em lote. |
| Beanstalk? | Plataforma para deploy/gestão simplificada de aplicações. |
| Lightsail? | Solução simplificada de recursos de computação e outros para apps menores. |
| Outposts? | Infraestrutura/serviços AWS nas instalações do cliente. |

## Redes

| Pergunta | Resposta curta |
|---|---|
| VPC? | Rede virtual isolada e regional. |
| Subnet pode abranger duas AZs? | Não, uma subnet pertence a uma AZ. |
| IGW? | Gateway de internet para VPC com rotas/regras apropriadas. |
| NAT Gateway? | Saída IPv4 para recursos privados, sem acesso inbound iniciado arbitrariamente. |
| SG versus NACL? | SG stateful ligado ao recurso; NACL stateless ligada à subnet. |
| Route 53? | DNS e roteamento de domínio. |
| CloudFront? | CDN e entrega de conteúdo em borda. |
| API Gateway? | Publicação e gerenciamento de APIs. |
| Global Accelerator? | Aceleração de tráfego de rede pela infraestrutura global AWS. |
| Direct Connect versus VPN? | Conexão dedicada versus túnel criptografado via rede pública. |
| Transit Gateway? | Hub de conectividade de VPCs/redes. |
| PrivateLink? | Consumo privado de serviço via endpoints. |

## Storage

| Pergunta | Resposta curta |
|---|---|
| S3? | Armazenamento de objetos em buckets. |
| EBS? | Volumes persistentes de bloco. |
| Instance store? | Armazenamento local efêmero da instância. |
| EFS? | Sistema de arquivos NFS compartilhado. |
| FSx? | Sistemas de arquivos gerenciados especializados. |
| S3 Intelligent-Tiering? | Automatiza uso de camadas conforme padrões de acesso elegíveis. |
| S3 One Zone-IA? | Acesso infrequente com armazenamento em uma AZ. |
| S3 Deep Archive? | Arquivamento de longuíssimo prazo, acesso raro e recuperação demorada. |
| S3 lifecycle? | Automatiza transição de classes e expiração. |
| Storage Gateway? | Integração híbrida de armazenamento local à AWS. |
| AWS Backup versus DRS? | Plano central de backups versus recuperação de servidores/workloads. |

## Bancos

| Pergunta | Resposta curta |
|---|---|
| RDS? | Banco relacional gerenciado. |
| Aurora? | Banco relacional AWS com arquitetura própria e compatibilidade MySQL/PostgreSQL. |
| RDS Multi-AZ versus Read Replica? | HA/failover versus escala de leitura. |
| DynamoDB? | NoSQL serverless de chave-valor/documento. |
| ElastiCache? | Cache em memória. |
| DocumentDB? | Banco de documentos. |
| Neptune? | Banco de grafos. |
| DMS versus SCT? | Mover/replicar dados versus converter esquema de banco. |

## Integração e dados

| Pergunta | Resposta curta |
|---|---|
| SQS? | Fila para processamento assíncrono. |
| SNS? | Pub/sub e notificações. |
| EventBridge? | Barramento/regras de eventos. |
| Step Functions? | Orquestração de workflows. |
| SES? | Serviço de e-mail para aplicações. |
| Connect? | Plataforma de contact center. |
| Athena? | SQL sobre dados, muito comum com S3. |
| Glue? | Catálogo/ETL/integração de dados. |
| Kinesis? | Streaming em tempo real. |
| Redshift? | Data warehouse analítico. |
| EMR? | Big data com frameworks distribuídos. |
| QuickSight? | BI e dashboards. |
| OpenSearch? | Busca e analytics em dados indexados/logs. |

## IA

| Pergunta | Resposta curta |
|---|---|
| SageMaker AI? | Ciclo de vida de modelos de ML. |
| Rekognition versus Textract? | Análise de imagem/vídeo versus extração de texto/tabelas em documentos. |
| Transcribe versus Polly? | Fala→texto versus texto→fala. |
| Comprehend versus Translate? | Analisar linguagem natural versus traduzir idiomas. |
| Lex? | Chatbot/interface conversacional. |
| Amazon Q? | Família de assistentes de IA. |

## Custos e suporte

| Pergunta | Resposta curta |
|---|---|
| On-Demand? | Sem compromisso plurianual; pagamento conforme uso elegível. |
| Spot? | Capacidade com desconto sujeita a interrupção. |
| Reserved Instance? | Desconto/compromisso por prazo, conforme modalidade. |
| Savings Plans? | Desconto por compromisso de gasto/hora para uso elegível. |
| Capacity Reservation? | Reserva de capacidade em AZ, não implica desconto sozinha. |
| Dedicated Host? | Servidor físico dedicado para cliente. |
| Pricing Calculator? | Estimativa de custos antes de usar. |
| Cost Explorer? | Análise do gasto existente. |
| Budgets? | Orçamentos e alertas. |
| Cost and Usage Reports? | Detalhamento granular do faturamento. |
| Consolidated billing? | Cobrança agrupada de contas AWS Organizations. |
| O que fazem cost allocation tags? | Permitem atribuir gastos a projetos/ambientes quando configuradas. |
| Trusted Advisor? | Recomendações/verificações de boas práticas. |
| AWS Health? | Eventos/impacto de saúde dos serviços AWS. |
| Planos AWS Support atuais? | Basic, Business Support+, Enterprise Support e Unified Operations em 2026. |

---

# 25. Laboratórios, cronograma e critérios de prontidão

> **Nomes completos nesta página:** AWS Certificate Manager (**ACM**); Application Load Balancer (**ALB**); Amazon Elastic Block Store (**EBS**); Amazon Elastic Compute Cloud (**EC2**); Amazon Elastic Container Registry (**ECR**); Amazon Elastic Container Service (**ECS**); Amazon Elastic File System (**EFS**); AWS Identity and Access Management (**IAM**); AWS Key Management Service (**AWS KMS**); Amazon Relational Database Service (**RDS**); Amazon Simple Storage Service (**S3**); Amazon Simple Notification Service (**Amazon SNS**); Amazon Simple Queue Service (**Amazon SQS**); Amazon Virtual Private Cloud (**VPC**); AWS Web Application Firewall (**AWS WAF**).
**[PRÁTICA ORIENTADA]**

A Cloud Practitioner não exige escrever código ou implantar uma arquitetura real. Porém, **visualizar as peças**, praticar decisões e encontrar informações na documentação reduz muito a memorização mecânica.

> **Segurança financeira dos exercícios:** os laboratórios abaixo podem ser feitos apenas com papel, diagramas e documentação pública. Quando houver opção de entrar no Console AWS, **não crie recursos cobrados sem verificar elegibilidade, preço, cotas e créditos de sua conta**. Um alerta do Budgets não é garantia de bloqueio de toda cobrança. Não exponha buckets nem reutilize credenciais reais em laboratórios.

## 25.1. Laboratório 1 — desenhe a nuvem e encontre pontos de falha

**Objetivo:** diferenciar Região, AZ, edge, HA e DR.

1. Desenhe uma Região com três AZs.
2. Coloque sua API inicialmente em uma única instância na AZ-a.
3. Imagine que a AZ-a inteira falhou. Liste tudo que o usuário perdeu.
4. Adicione um segundo serviço backend na AZ-b e um balanceador.
5. Posicione um banco Multi-AZ conforme arquitetura suportada.
6. Considere agora falha da Região inteira. Qual é o novo gargalo?
7. Discuta que dados precisam ser copiados para outra Região e qual RPO é exigido.

**Resultado esperado:** você deve conseguir explicar por que **Multi-AZ reduz dependência de AZ**, enquanto **Multi-Region** trata outro nível de falha. Também deve identificar que backup e failover não são iguais.

## 25.2. Laboratório 2 — responsabilidade compartilhada em cinco cenários

**Objetivo:** identificar responsabilidades sem depender de nome do serviço.

Preencha por conta própria:

| Cenário | AWS, cliente ou ambos? | Resposta discutida |
|---|---|---|
| Trocar disco físico quebrado no datacenter | ? | AWS |
| Corrigir dependência Node vulnerável da API ECS | ? | Cliente |
| Alterar senha e roles do banco RDS | ? | Cliente |
| Patching da infraestrutura que executa Lambda | ? | AWS, para camada operacional gerenciada |
| Determinar se aluno X pode baixar certificado Y | ? | Cliente |
| Construir e operar infraestrutura global com disponibilidade apropriada | ? | AWS para infraestrutura; cliente para a arquitetura que utiliza os recursos |
| Bloquear usuário não autorizado com IAM | ? | AWS provê IAM; cliente configura política adequada |

**Discussão avançada:** em EC2 o cliente administra SO; em Fargate a AWS administra hosts; nos dois o código e permissões continuam sendo responsabilidade do cliente.

## 25.3. Laboratório 3 — avalie uma política IAM

**Objetivo:** ler `Action`, `Resource`, `Effect` e entender permissões e limites.

Considere a política:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::relatorios-teste/equipe-a/*"
  }]
}
```

**Perguntas:**
1. Permite apagar bucket? (**Não**: não há `s3:DeleteBucket`.)
2. Permite listar todos os buckets? (**Não**: não há `s3:ListAllMyBuckets`.)
3. Permite ler objetos de outro prefixo? (**Não**, somente os ARNs cobertos, antes de considerar outras políticas.)
4. Se um SCP negar `s3:PutObject`, o upload funciona? (**Não**.)
5. Se a IAM role tiver essa policy mas não puder ser assumida pela Lambda, o que pode estar errado? (**Trust policy**.)

**Conceito adquirido:** saber ler intenção e escopo de uma policy, sem decorar sintaxe avançada.

## 25.4. Laboratório 4 — faça um diagrama de VPC

**Objetivo:** separar rota, endereço e firewall.

Desenhe:
- Uma VPC `10.0.0.0/16`.
- Subnet pública AZ-a e AZ-b.
- Subnet privada AZ-a e AZ-b.
- Internet Gateway.
- Um ALB público em subnets públicas.
- Duas tarefas privadas que recebem conexões do ALB.
- Banco em subnets privadas.
- NAT Gateway para saída IPv4 de recursos privados, se requerido.

**Perguntas:**
1. Só adicionar `0.0.0.0/0 -> IGW` torna um EC2 sem IP público acessível diretamente? (**Não**.)
2. O banco precisa ser público para o backend acessá-lo? (**Não**.)
3. SG é stateful ou stateless? (**Stateful**.)
4. NACL funciona em recurso ou subnet? (**Subnet**.)
5. NAT Gateway permite que qualquer usuário da internet inicie conexão direto na instância privada? (**Não**.)

**Conceito adquirido:** entender VPC como conjunto de decisões de rede; não apenas uma caixa num diagrama.

## 25.5. Laboratório 5 — classifique cenários de armazenamento

**Objetivo:** acertar modelos de dados e classes.

Associe:
- Imagens e PDFs de certificados acessíveis via API → **S3**.
- Disco persistente de uma EC2 → **EBS**.
- Cache de arquivo temporário local recriável → **Instance store**.
- Pasta de arquivos compartilhada por várias máquinas Linux → **EFS**.
- Compartilhamento SMB para aplicações Windows → **FSx for Windows**.
- Arquivo regulatório raramente acessado por anos → **S3 Glacier** apropriado.
- Extensão de storage on-premises à AWS → **Storage Gateway**.
- Backups com políticas centralizadas → **AWS Backup**.

Depois proponha uma política de lifecycle para dados que mudam de quente para frio, explicando o custo de recuperação.

## 25.6. Laboratório 6 — escolha o serviço sem citar marcas

**Objetivo:** raciocinar por intenção.

Pegue cada demanda:
1. “Quero mandar um aviso a dez consumidores.”
2. “Quero garantir que uma tarefa eventual fique guardada até o worker terminar.”
3. “Quero executar processamento quando um arquivo aparece.”
4. “Quero consultar Parquet usando SQL.”
5. “Quero extrair uma tabela de um contrato escaneado.”
6. “Quero que um fluxo execute três etapas com lógica de erro.”
7. “Quero detectar software vulnerável em contêiner.”

Primeiro descreva o **padrão**: pub/sub; fila; evento/função; SQL em lake; OCR documental; workflow; vulnerability assessment.

Depois associe serviço: **SNS; SQS; Lambda; Athena; Textract; Step Functions; Inspector**.

Esse método impede o erro de memorizar “nomes bonitos” e confundi-los na hora da prova.

## 25.7. Laboratório 7 — prepare uma estimativa de custo sem gastar

**Objetivo:** entender modelo de preço antes de olhar a ferramenta.

Arquitetura fictícia:
- Duas instâncias de backend sempre ligadas.
- Banco gerenciado.
- 100 GB de arquivos no S3.
- 100 GB de transferência pública por mês.
- Logs da aplicação.
- Uma exportação batch executada uma vez ao dia.

Faça uma tabela de **unidade de cobrança**:
- Horas/capacidade de computação.
- Capacidade/armazenamento e operações do banco.
- GB-mês, requisições e recuperação S3.
- Transferência/egress.
- Ingestão/retenção de logs.
- Execução de jobs.

Acesse **AWS Pricing Calculator** apenas para entender como as dimensões entram na estimativa. Não confunda valores de exemplo com preços atuais. Em seguida identifique:
- **Cost Explorer** para analisar o que já gastou.
- **Budgets** para alertar.
- **CUR** para detalhamento granular.
- **Organizations** para cobrar múltiplas contas conjuntamente.

## 25.8. Laboratório 8 — faça seu próprio threat model básico

Cenário: bucket de certificados privados, backend com role IAM, frontend público.

Responda:
1. Quem autentica o usuário final?
2. Quem verifica autorização por tenant?
3. Qual recurso da AWS permite que backend acesse o S3?
4. Onde guardar token de API externa?
5. Qual serviço ajuda a ver alteração indevida de política IAM?
6. Qual detecta ameaças?
7. Qual procura dados sensíveis em S3?
8. Qual protege camada web?
9. Qual protege de DDoS?
10. Qual registra métricas de erros?

**Respostas:** sistema de identidade (Cognito/IdP compatível); backend; IAM role; Secrets Manager; CloudTrail; GuardDuty; Macie; WAF; Shield; CloudWatch.

**Discussão:** autenticação/segurança na AWS e autorização de domínio do produto são camadas relacionadas, porém diferentes.

---

## 25.9. Plano de estudos de cinco semanas

A duração pode ser ajustada; o importante é intercalar teoria, prática e recuperação ativa. Uma recomendação para alguém com experiência de desenvolvimento e interesse em fundamentos é **60–90 minutos por sessão**, com sessões adicionais para corrigir erros.

### Semana 1 — Construir os alicerces

| Sessão | Leitura | Entrega para verificar aprendizado |
|---|---|---|
| 1 | Caps. 1 e 2 | Explicar nuvem/elasticidade/HA sem consultar |
| 2 | Cap. 3 | Desenhar Region/AZ/edge e RTO/RPO |
| 3 | Cap. 4 | Ensinar os seis pilares a alguém |
| 4 | Cap. 5 | Classificar 7 Rs e seis perspectivas CAF |
| 5 | Revisão | Resolver Q01–Q20 e revisar cartões de fundamentos |

### Semana 2 — Segurança (peso de 30%)

| Sessão | Leitura | Entrega |
|---|---|---|
| 6 | Cap. 6 | Tabela de responsabilidades EC2/RDS/Lambda |
| 7 | Cap. 7 (parte 1) | Interpretar policy, root, role, trust, deny |
| 8 | Cap. 7 (parte 2) | Identidade federada, Cognito, Identity Center e SCP |
| 9 | Caps. 8 e 9 | Comparar KMS/ACM/Secrets, GuardDuty/Inspector/Macie |
| 10 | Revisão | Resolver Q21–Q44 e refazer todas as erradas |

### Semana 3 — Serviços core (peso elevado)

| Sessão | Leitura | Entrega |
|---|---|---|
| 11 | Caps. 10 e 11 | Desenhar ECS/ECR/Fargate/ALB/Auto Scaling |
| 12 | Cap. 12 | Explicar subnets, SG/NACL, NAT/VPN/DX |
| 13 | Cap. 13 | Tabela S3/EBS/EFS/FSx/classes |
| 14 | Cap. 14 | Contrapor RDS/NoSQL/cache e Multi-AZ/replica |
| 15 | Revisão | Resolver Q45–Q69 e rever pontos fracos |

### Semana 4 — Serviços complementares e cobrança

| Sessão | Leitura | Entrega |
|---|---|---|
| 16 | Caps. 15 e 16 | Tabela CloudWatch/Trail/Config e SQS/SNS/EventBridge |
| 17 | Caps. 17 e 18 | Saber nome → finalidade de serviços complementares |
| 18 | Cap. 19 | Diferenciar compras EC2, custos, budgets e relatórios |
| 19 | Cap. 20 | Separar suporte, Health, Trusted Advisor e parceiros |
| 20 | Revisão | Resolver Q70–Q80, revisar cartões de serviços e custos |

### Semana 5 — Consolidação

| Sessão | Ação |
|---|---|
| 21 | Ler Cap. 21 e reconstruir arquitetura com papel |
| 22 | Revisar Cap. 22 e montar uma lista das 20 confusões mais frequentes |
| 23 | Fazer 65 questões sortidas, com cronômetro de 90 min |
| 24 | Corrigir uma a uma; escrever por que a alternativa errada é errada |
| 25 | Novo simulado original/externo, revisar erros, conferir documentação recente |

### Regra de recuperação espaçada

Cada dia, antes de avançar:
1. Relembre 10 cartões de conteúdos antigos.
2. Resolva 5 questões misturadas.
3. Reexplique um conceito difícil de memória.
4. Ao errar, escreva um exemplo concreto que diferencia os serviços.

## 25.10. Como saber se está pronto para marcar a prova?

Não existe percentual de simulados que garanta aprovação. Mas esta é uma régua **prática e conservadora**, não um requisito da AWS:

- [ ] Consigo explicar **por que** Multi-AZ não é backup.
- [ ] Consigo interpretar `Allow`, `Deny`, `Action` e `Resource` num exemplo IAM.
- [ ] Sei quando escolher S3/EBS/EFS, EC2/Fargate/Lambda, RDS/DynamoDB.
- [ ] Sei explicar CloudWatch/CloudTrail/Config sem hesitar.
- [ ] Reconheço WAF/Shield/Inspector/GuardDuty/Macie.
- [ ] Identifico 7 Rs, seis perspectivas CAF e seis pilares Well-Architected.
- [ ] Não confundo Spot, RI, Savings Plans, On-Demand e Capacity Reservation.
- [ ] Sei usar mentalmente Calculator, Cost Explorer, Budgets e CUR.
- [ ] Consigo responder questões de serviços complementares com pistas do enunciado.
- [ ] Faço simulados diferentes, cronometrados, com desempenho **consistentemente alto**, especialmente em segurança e serviços.
- [ ] Consigo justificar alternativas erradas, e não apenas memorizar letras.
- [ ] Conferi na AWS as mudanças recentes de suporte e preços.

Se você ainda troca **CloudTrail por CloudWatch** ou **RDS Multi-AZ por Read Replica**, priorize corrigir essas confusões antes de continuar lendo serviços raros.

---

# 26. Mapa de cobertura CLF-C02 e fontes oficiais

> **Nomes completos nesta página:** AWS Database Migration Service (**AWS DMS**); Amazon Elastic Block Store (**EBS**); Amazon Elastic Compute Cloud (**EC2**); Amazon Elastic File System (**EFS**); AWS Identity and Access Management (**IAM**); Amazon Simple Storage Service (**S3**); AWS Schema Conversion Tool (**AWS SCT**); Amazon Virtual Private Cloud (**VPC**); AWS Web Application Firewall (**AWS WAF**).

## 26.1. Auditoria de cobertura por declaração de tarefa

Cada linha abaixo corresponde a uma tarefa publicada no guia do exame CLF-C02. É a melhor forma de confirmar que o estudo não ficou preso apenas a serviços “populares”.

| Domínio / tarefa do guia | O que precisa saber | Onde estudar |
|---|---|---|
| **1.1 — Definir benefícios AWS Cloud** | Disponibilidade, elasticidade, agilidade, alcance global | Caps. 2–3 |
| **1.2 — Princípios de design** | Seis pilares Well-Architected | Cap. 4 |
| **1.3 — Adoção e migração** | CAF, jornada de migração e estratégias | Cap. 5 |
| **1.4 — Economia da nuvem** | CAPEX/OPEX, TCO, licenças, rightsizing, automação | Caps. 2 e 5, 19 |
| **2.1 — Responsabilidade compartilhada** | Segurança da nuvem × na nuvem; diferenças por serviço | Cap. 6 |
| **2.2 — Segurança, governança e compliance** | Criptografia, logs, auditoria, Artifact, Config etc. | Caps. 8–9, 15 |
| **2.3 — Gerenciamento de acesso** | IAM, root, MFA, roles, SSO, federação | Cap. 7 |
| **2.4 — Componentes e recursos de segurança** | WAF, Shield, GuardDuty, Inspector, Macie, hubs etc. | Caps. 8–9 |
| **3.1 — Métodos de implantação/operar** | Console, APIs, CLI, SDK, IaC e modelos cloud | Cap. 10 |
| **3.2 — Infraestrutura global** | Regiões, AZs, edge, HA e multirregião | Cap. 3 |
| **3.3 — Computação** | EC2, instâncias, containers, Fargate, Lambda, scaling | Cap. 11 |
| **3.4 — Bancos de dados** | Relacional, NoSQL, cache, DMS e SCT | Cap. 14 |
| **3.5 — Redes** | VPC, gateways, SG, NACL, Route 53, VPN, DX | Cap. 12 |
| **3.6 — Armazenamento** | Objetos, blocos, arquivos, classes S3, lifecycle e backup | Cap. 13 |
| **3.7 — IA/ML e Analytics** | Funções de serviços de dados e IA | Cap. 17 |
| **3.8 — Outras categorias** | Integrações, negócios, ferramentas, desktops, IoT etc. | Caps. 15–18 |
| **4.1 — Modelos de preços** | On-Demand, RI, Spot, Savings Plans, dedicado, transferência | Cap. 19 |
| **4.2 — Faturamento e gerenciamento de custos** | Organizations, tags, Budgets, Explorer, Calculator, CUR | Cap. 19 |
| **4.3 — Suporte e recursos técnicos** | Support, Health, Trusted Advisor, docs, parceiros | Cap. 20 |

## 26.2. Fontes oficiais utilizadas e recomendadas

As fontes abaixo são publicações oficiais da AWS, adequadas para aprofundamento e atualização. O material acima é **síntese didática original**, não reprodução do guia.

### Edital, tarefas e relação de serviços (fonte primária da apostila)

1. [AWS Certified Cloud Practitioner — guia CLF-C02 (português)](https://docs.aws.amazon.com/pt_br/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html)
2. [Domínio 1 — Cloud Concepts](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain1.html)
3. [Domínio 2 — Security and Compliance](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain2.html)
4. [Domínio 3 — Cloud Technology and Services](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain3.html)
5. [Domínio 4 — Billing, Pricing, and Support](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02-domain4.html)
6. [Relação de serviços em escopo](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-in-scope-services.html)
7. [Tecnologias e conceitos do exame](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-technologies-concepts.html)
8. [Serviços explicitamente fora do escopo](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/clf-02-out-of-scope-services.html)

### Princípios, segurança e infraestrutura

9. [AWS Well-Architected — seis pilares](https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html)
10. [AWS Cloud Adoption Framework](https://aws.amazon.com/cloud-adoption-framework/)
11. [7 Rs de migração — AWS Prescriptive Guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html)
12. [Lógica de avaliação de políticas IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
13. [Práticas recomendadas para a conta root](https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-best-practices.html)
14. [AWS Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/)
15. [Documentação do Amazon VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
16. [Documentação Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)

### Custos e suporte atualizados

17. [AWS Support Plans — catálogo vigente e avisos de descontinuação](https://docs.aws.amazon.com/awssupport/latest/user/aws-support-plans.html)
18. [Transição dos planos Developer, Business e Enterprise On-Ramp](https://docs.aws.amazon.com/awssupport/latest/user/support-plans-eos.html)
19. [Tipos de Savings Plans](https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html)
20. [Consolidated billing no AWS Organizations](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/consolidated-billing.html)
21. [AWS Free Tier — perguntas frequentes e regras vigentes](https://aws.amazon.com/free/free-tier-faqs/)
22. [AWS Pricing Calculator](https://calculator.aws/)
23. [AWS Skill Builder](https://skillbuilder.aws/)

## 26.3. Limites deste material e como atualizá-lo

- O exame **não garante** que cada serviço da lista em escopo apareça e pode cobrar cenários diferentes dos exemplos.
- Regras detalhadas de produto, modalidades de suporte, nomenclatura e preços evoluem; os links de documentação devem prevalecer em caso de divergência futura.
- A apostila prioriza **compreensão conceitual de nível Foundation**; não substitui documentação de implementação e arquitetura para projetos de produção.
- Questões e gabaritos são **autorais**, não reproduzem o banco de questões da AWS.
- Exemplos de preços são **hipotéticos**; não são cotações de outubro de 2026.

---

## Mensagem final para estudar com entendimento

A AWS fica simples quando você deixa de ver centenas de nomes e passa a ver **algumas perguntas recorrentes**:

1. **Onde executarei código?** → EC2, contêineres, Lambda.
2. **Onde guardarei dados?** → S3, EBS/EFS/FSx, bancos.
3. **Como conectarei os componentes?** → VPC, subnets, rotas, DNS, balanceadores.
4. **Quem pode acessar o quê?** → IAM, federação, autorização de negócio e criptografia.
5. **Como saberei se funciona?** → CloudWatch, CloudTrail, Config, X-Ray e Health.
6. **Como o sistema lida com falhas?** → Multi-AZ, backups, replicação e DR.
7. **Quanto custará e como controlarei o gasto?** → modelos de compra, Calculator, Cost Explorer, Budgets, tags.
8. **Como a organização governa a nuvem?** → Organizations, CAF, Well-Architected e políticas.

Se você conseguir **explicar essas decisões sem usar o nome de um serviço primeiro**, reconhecer as alternativas da prova se torna consequência do entendimento.

**Fim da apostila — AWS Certified Cloud Practitioner (CLF-C02), edição de 09/10/2026.**
