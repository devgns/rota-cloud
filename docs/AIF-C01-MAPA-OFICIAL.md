# AIF-C01 — rastreabilidade do guia oficial AWS

**Pesquisa:** 24 de outubro de 2026. **Base normativa:** *AWS Certified AI Practitioner Exam Guide (AIF-C01)*, revisão **1.1 (30/04/2026)**. A versão 1.0 é de 26/03/2026. A AWS pode atualizar a lista de serviços e objetivos; o guia não é uma enumeração exaustiva de todas as perguntas. Conteúdo independente e original, não oficial e não endossado pela AWS.

## 1. Informações do exame

- **Nível:** Foundational; candidato-alvo com até seis meses de exposição a IA/ML na AWS.
- **Avaliação:** 65 questões no total, sendo 50 pontuadas e 15 não pontuadas e não identificadas. Tipos: escolha única, múltipla resposta, ordenação e correspondência.
- **Pontuação:** escala 100–1000, aprovação com 700; compensatória entre domínios. Sem penalização extra por tentativa incorreta.
- **Fora das tarefas esperadas:** escrever/treinar algoritmos, tuning de hiperparâmetros, montar pipelines produtivos, análise matemática aprofundada ou implementar políticas de conformidade. Saber **identificar**, **selecionar**, **explicar** e **comparar** é o foco.
- **Atenção:** a plataforma de exercícios deste projeto é material autoral e não reproduz o formato psicométrico oficial da AWS.

| Domínio oficial | Peso | Tarefas | Capítulos da trilha |
|---|---:|---|---|
| 1. Fundamentos de IA e ML | 20% | 1.1, 1.2, 1.3 | 02–07, 25–26, 29 |
| 2. Fundamentos de IA generativa | 24% | 2.1, 2.2, 2.3 | 08–12, 15, 18, 25–26, 29 |
| 3. Aplicações de modelos de base | 28% | 3.1, 3.2, 3.3, 3.4 | 11–18, 25–26, 29 |
| 4. IA responsável | 14% | 4.1, 4.2 | 19–20, 25–26, 29 |
| 5. Segurança, conformidade e governança | 14% | 5.1, 5.2 | 21–23, 25–26, 29 |

## 2. Checklist de objetivos — mapeamento granular

A numeração após o segundo ponto é **editorial**, seguindo a ordem dos itens publicados pela AWS em cada tarefa. Os títulos abaixo são paráfrases, não transcrições do guia.

| Objetivo | O que deve saber explicar/reconhecer | Capítulos |
|---|---|---|
| 1.1.1 | Vocabulário IA, ML, DL, redes neurais, CV, NLP, treino, inferência, viés, FM, LLM, GenAI e IA agêntica | 02, 08 |
| 1.1.2 | Relações e diferenças entre IA, ML, DL, GenAI e sistemas agênticos | 02, 15 |
| 1.1.3 | Inferência em lote, tempo real, assíncrona, serverless | 05, 11 |
| 1.1.4 | Dados rotulados/não rotulados, tabulares, séries, texto, imagem, estruturados/não estruturados | 03 |
| 1.1.5 | Aprendizado supervisionado, não supervisionado, por reforço | 03 |
| 1.2.1 | Valor empresarial, apoio à decisão, escala e automação | 04, 06 |
| 1.2.2 | Situações em que IA **não** faz sentido; custo/benefício, determinismo | 04, 06 |
| 1.2.3 | Regressão, classificação e clustering | 04 |
| 1.2.4 | Visão, linguagem, voz, recomendações, fraude, previsão, bases de conhecimento e agentes | 04, 07, 15 |
| 1.2.5 | SageMaker AI, Transcribe, Translate, Comprehend, Lex, Polly | 07 |
| 1.2.6 | Escolha ML tradicional vs FM, explicabilidade, regulação, operações | 04, 11 |
| 1.3.1 | Etapas de pipeline AI/ML e distinções | 05 |
| 1.3.2 | FM pré-treinado aberto versus treinamento personalizado | 05, 16 |
| 1.3.3 | API gerenciada versus API hospedada pela empresa | 05, 12 |
| 1.3.4 | Bedrock, Amazon Quick, Kiro e SageMaker AI no ciclo de vida | 07, 12 |
| 1.3.5 | MLOps: repetibilidade, monitoramento, retreino, dívida técnica | 05 |
| 1.3.6 | Accuracy, precision, recall, F1 e ROI/custo/feedback | 06 |
| 2.1.1 | Token, chunk, embedding, vetor, prompt, transformer, FM, multimodalidade, difusão | 08–10 |
| 2.1.2 | Texto, imagem, vídeo, áudio, tradução, código, busca, recomendação, assistentes | 10 |
| 2.1.3 | Ciclo FM: seleção dados/modelos, pré-treino, ajuste, avaliação, deployment, feedback | 08, 16–17 |
| 2.1.4 | Cobrança por tokens e consequências na latência/custo | 09, 18 |
| 2.1.5 | Engenharia de contexto | 09, 13–15 |
| 2.1.6 | Sistemas multiagente, MCP, memória, ferramentas, comunicação e orquestração | 15 |
| 2.2.1 | Benefícios GenAI: adaptação, interface conversacional, geração de conteúdo | 10, 11 |
| 2.2.2 | Limitações: alucinação, inexatidão, baixa interpretabilidade, não determinismo | 11, 17, 21 |
| 2.2.3 | Seleção de modelos considerando modalidade, qualidade, latência, custo, conformidade | 11 |
| 2.2.4 | Valor e KPIs: produtividade, conversão, LTV, ROI e outros | 06, 18 |
| 2.3.1 | Bedrock, SageMaker AI/JumpStart, Quick, Kiro, Strands e AgentCore | 12, 15 |
| 2.3.2 | Vantagens dos serviços gerenciados em aplicações GenAI | 12 |
| 2.3.3 | Benefícios de segurança, conformidade, responsabilidade e segurança de conteúdo | 12, 19–23 |
| 2.3.4 | Trade-offs: tokens, throughput provisionado, disponibilidade, região, performance, customização | 11, 18 |
| 3.1.1 | Seleção de FM: modalidade, tokens, tamanho, custo, idiomas, cache e latência | 11, 18 |
| 3.1.2 | Temperatura, limites de entrada/saída e parâmetros de inferência | 11 |
| 3.1.3 | RAG e Amazon Bedrock Knowledge Bases | 14 |
| 3.1.4 | Vetores em OpenSearch, Aurora, Neptune e RDS PostgreSQL | 14, 24 |
| 3.1.5 | Pré-treino, fine-tuning, in-context learning, RAG, destilação e seus custos | 16 |
| 3.1.6 | Papel dos agentes e seus casos de uso | 15 |
| 3.2.1 | Contexto, instrução e prompt negativo | 13 |
| 3.2.2 | Zero/one/few-shot, templates e chain-of-thought como técnica reconhecível | 13 |
| 3.2.3 | Experimentos, especificidade, concisão, controle de resposta e guardrails | 13, 21 |
| 3.2.4 | Exposição, poisoning, hijacking, jailbreak | 13, 21 |
| 3.2.5 | Gerenciamento e versões de prompts no Bedrock | 13 |
| 3.3.1 | Pré-treino, fine-tuning, continual pretraining, distillation | 16 |
| 3.3.2 | Instruction tuning, adaptação de domínio, transfer learning | 16 |
| 3.3.3 | Curadoria, rótulos, diversidade, governança e RLHF | 16, 19 |
| 3.4.1 | Benchmarks, avaliação humana e Bedrock Model Evaluation | 17 |
| 3.4.2 | ROUGE, BLEU, BERTScore, LLM-as-a-judge | 17 |
| 3.4.3 | Aderência de FM a metas de produtividade e engajamento | 17–18 |
| 3.4.4 | Avaliação de RAG, agentes e workflows em produção | 17 |
| 3.4.5 | Sucesso da tarefa, satisfação e custo por interação | 17–18 |
| 4.1.1 | Viés, justiça, inclusão, robustez, segurança, veracidade | 19 |
| 4.1.2 | Bedrock Guardrails e identificação/mitigação de riscos | 19, 21 |
| 4.1.3 | Sustentabilidade na escolha dos modelos | 19 |
| 4.1.4 | Direitos autorais, outputs enviesados, confiança e risco jurídico | 19 |
| 4.1.5 | Bases representativas, variadas, curadas e equilibradas | 03, 19 |
| 4.1.6 | Viés/variância, overfit/underfit e subgrupos | 06, 19 |
| 4.1.7 | Auditorias humanas, qualidade de labels, subgrupos e veracidade | 19 |
| 4.2.1 | Transparência vs explicabilidade | 20 |
| 4.2.2 | SageMaker Model Cards, avaliações Bedrock, modelos/dados/licenças | 20 |
| 4.2.3 | Trade-off entre desempenho, segurança e interpretabilidade | 20 |
| 4.2.4 | Design centrado no humano, revisão e feedback | 20 |
| 5.1.1 | IAM, cifragem, Macie, PrivateLink, responsabilidade compartilhada, AgentCore Identity/Policy e Guardrails | 21–22 |
| 5.1.2 | Linhagem, citação de fontes, catálogos e Model Cards | 20, 23 |
| 5.1.3 | Qualidade, integridade, controles de acesso e privacidade | 22–23 |
| 5.1.4 | Segurança de aplicação, prompt injection, DLP, validação, logs, proteção de infraestrutura | 21–23 |
| 5.1.5 | Grounding RAG, checagem de output, pontuação de confiança | 14, 17, 21 |
| 5.2.1 | Config, Inspector, Artifact, CloudTrail e Trusted Advisor | 23 |
| 5.2.2 | Ciclo de dados, retenção, localização, logs, monitoramento | 23 |
| 5.2.3 | Políticas, cadência de revisão, Generative AI Security Scoping Matrix e capacitação | 23 |

## 3. Catálogo de serviços em escopo (guia 1.1)

A lista abaixo é a lista **enumerada pelo guia**; é declaradamente não exaustiva. Quando uma funcionalidade é mencionada explicitamente nos objetivos (por exemplo Bedrock Knowledge Bases, Guardrails, AgentCore Identity/Policy e AWS PrivateLink), ela também é ensinada, mesmo que não seja uma linha separada na enumeração por categoria.

- **Analytics:** AWS Data Exchange, Amazon EMR, AWS Glue, AWS Glue DataBrew, AWS Lake Formation, Amazon OpenSearch Service, Amazon Quick, Amazon Redshift.
- **Cloud Financial Management:** AWS Budgets, AWS Cost Explorer.
- **Compute:** Amazon EC2, AWS Lambda.
- **Containers:** Amazon ECS, Amazon EKS.
- **Database:** Amazon Aurora, Amazon DocumentDB, Amazon DynamoDB, Amazon ElastiCache, Amazon Neptune, Amazon RDS.
- **Developer Tools:** Kiro, Strands Agents.
- **Machine Learning:** Amazon Bedrock, Amazon Bedrock AgentCore, Amazon Comprehend, Amazon Lex, Amazon Nova, Amazon Personalize, Amazon Polly, Amazon Rekognition, Amazon SageMaker AI, Amazon SageMaker JumpStart, Amazon Textract, Amazon Transcribe, Amazon Translate, AWS Transform.
- **Management and Governance:** AWS CloudTrail, Amazon CloudWatch, AWS Config, AWS Trusted Advisor, AWS Well-Architected Tool.
- **Networking and Content Delivery:** Amazon CloudFront, Amazon VPC.
- **Security, Identity, and Compliance:** AWS Artifact, AWS IAM, Amazon Inspector, AWS KMS, Amazon Macie, AWS Secrets Manager.
- **Storage:** Amazon S3, Amazon S3 Glacier.

**Fora de escopo (amostra que evita estudar em excesso):** AWS WAF, Amazon GuardDuty, Amazon Cognito, AWS Organizations, AWS Service Catalog, AWS Amplify, AWS Backup, Amazon Lightsail, AWS App Runner, AWS Marketplace. São serviços úteis na prática, mas não devem disputar tempo com os itens prioritários do guia AIF-C01 1.1. Consulte a lista oficial completa antes de revisar isso.

## 4. Diferenças da revisão 1.1 (2026)

- **Novo destaque:** GenAI e IA agêntica, agentes especializados, padrões multiagente, MCP e orquestração.
- **Novos objetivos:** engenharia de contexto, preço por tokens, Bedrock Prompt Management, custo por interação e taxas de conclusão, grounding contra alucinação, ML tradicional vs FM.
- **Serviços adicionados à lista:** Amazon Aurora, Bedrock AgentCore, Kiro, Strands Agents, Amazon Q, SageMaker JumpStart e AWS Transform; Amazon MemoryDB foi removido.
- **Atenção a inconsistências editoriais:** a lista por categoria menciona **Amazon Quick**, enquanto o histórico da revisão menciona também **Amazon Q**. Ensinar Quick (atual) e Q como nomenclatura presente no histórico e no contexto de assistentes, sem atribuir a ambos uma identidade funcional automática; checar atualizações futuras.

## 5. Fontes primárias

- Guia-mãe: https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html
- Domínio 1: https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01-domain1.html
- Domínio 2: https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01-domain2.html
- Domínio 3: https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01-domain3.html
- Domínio 4: https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01-domain4.html
- Domínio 5: https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01-domain5.html
- Serviços em escopo: https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-in-scope-services.html
- Serviços fora de escopo: https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-out-of-scope-services.html
- Histórico 1.0→1.1: https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html
- RAG: https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html
- Guardrails: https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html
- Prompt management: https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-management.html
- Bedrock evaluations: https://docs.aws.amazon.com/bedrock/latest/userguide/evaluation.html
- AgentCore: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html
- SageMaker AI: https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-mlconcepts.html
