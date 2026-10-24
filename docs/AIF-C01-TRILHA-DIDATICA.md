# Trilha AIF-C01 — desenho pedagógico

**Princípio:** não seguir os cinco domínios da AWS em ordem estrita. Seguir as dependências cognitivas: por que IA → dados e aprendizado → modelos → geração → integração → testes → proteção → decisões empresariais → revisão.

## Módulos e sequência

| Módulo | Capítulos | Dependência principal | Entrega de aprendizagem |
|---|---|---|---|
| 0 · Comece aqui | 01 | nenhuma | entender como ler e como funciona a prova |
| 1 · Antes da GenAI | 02–07 | 01 | distinguir paradigmas, métricas e serviços de IA clássica |
| 2 · Como funciona GenAI | 08–11 | 02–04 | entender modelo, token, vetor, modalidade e inferência |
| 3 · Criando aplicações | 12–18 | 08–11 | diferenciar Bedrock, SageMaker, prompt, RAG, agentes, fine-tuning, avaliação e custos |
| 4 · IA confiável | 19–20 | 03, 06, 17 | raciocinar sobre viés, fairness, explicabilidade e humano no loop |
| 5 · Proteção e governança | 21–23 | 14–15, 19–20 | diferenciar ataques, controles, segurança, auditoria e compliance |
| 6 · Síntese e revisão | 24–30 | todos os demais | catálogo, caso completo, comparativos, questões, cartões, plano e rastreabilidade |

## Contrato editorial (espelhar padrão CLF-C02)

1. Markdown único é a **fonte canônica de leitura**, não um resumo da apostila; cada capítulo tem objetivos, conceitos, exemplos, comparativos e perguntas de recuperação.
2. Abrir com um caso de negócio concreto, explicar o princípio e **somente depois** citar produto AWS; definições técnicas estão sempre relacionadas à necessidade.
3. Apresentar contrastes decisórios, não uma lista de slogans: classificação × regressão, precisão × recall, ML tradicional × FM, RAG × fine-tuning, Bedrock × SageMaker, Guardrails × IAM, CloudTrail × Config × Artifact.
4. Preferir diagramas estruturais originais com título, alt text e limites do modelo: hierarquia IA, pipeline ML, matriz de confusão, token/embedding, RAG, prompts, agentes/MCP, seleção de estratégia, avaliação e segurança em camadas.
5. No fim de cada capítulo, uma seção de **verificação de entendimento** e **pegadinhas**; não usar fatos sujeitos a mudança como números permanentes (preços de modelos, cotas ou disponibilidade regional).
6. Exercícios originais e fundamentados no conhecimento público; não reproduzir dumps, questões oficiais nem afirmar equivalência de nota com a escala AWS.
7. Cobertura explícita dos 14 task statements, dos subobjetivos e dos serviços em escopo; revisar nomes em futuras versões do exame.
8. Estudo incremental: não antecipar detalhes de AgentCore antes de apresentar agentes e MCP; não introduzir ROUGE antes de explicar avaliação; não recomendar RAG antes de entender chunk/embedding.

## Modelo mental repetido em cada tema

`Problema de negócio → escolha técnica → desenho dos dados → serviço AWS → custo/risco → como validar → pegadinha de prova`.

## Como priorizar o estudo

- A **maior densidade** vai para aplicações de FMs (28%), depois GenAI (24%), fundamentos IA/ML (20%), segurança/governança e responsabilidade (14% cada).
- Peso do exame não significa peso de **cada serviço** individual. Não inventar porcentagens por produto ou perfil de pergunta.
- Laboratórios são opcionais e podem incorrer custos; exercícios no papel são suficientes para a competência conceitual exigida.
