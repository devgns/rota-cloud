# Exercícios suplementares AIF-C01 — formatos não contemplados pelo protótipo

**Status:** 26 itens originais (9 múltipla resposta, 8 ordenação, 9 associação), revisados e integrados ao site em *Praticar → Formatos da prova* e ao simulado, com correção sem crédito parcial. A fonte de dados é `data/QUESTOES_AIF-C01_FORMATOS_COMPLEMENTARES_24.json` (o nome do arquivo foi mantido). As questões ilustram formatos admitidos pelo guia, mas não são itens oficiais nem reproduzem a dificuldade psicométrica da prova.

## AIF-MR01 — multiple_response · Domínio 1 · Tarefa 1.2

Uma empresa quer prever a probabilidade de inadimplência a partir de dados tabulares rotulados, com explicações auditáveis. Selecione as DUAS decisões mais razoáveis.

- **A.** Começar com uma baseline de regressão logística ou árvore e avaliar os resultados.
- **B.** Escolher obrigatoriamente um LLM generalista apenas por ser maior.
- **C.** Medir precisão e recall por segmento e verificar vieses antes de usar o resultado.
- **D.** Dispensar validação porque os exemplos foram rotulados.
- **E.** Permitir que um chatbot aprove crédito sozinho sem controles de negócio.

**Gabarito (2 opções):** A, C

**Por quê:** O problema é preditivo e estruturado. Uma baseline clássica e avaliação por segmento são decisões justificáveis; tamanho do LLM não implica adequação nem segurança.

---

## AIF-MR02 — multiple_response · Domínio 1 · Tarefa 1.3

Fraudes confirmadas são raras e o conjunto é muito desbalanceado. Escolha as DUAS métricas que ajudam a interpretar erros relevantes para a classe fraude.

- **A.** Número de tokens emitidos pelo prompt.
- **B.** Recall da classe fraude.
- **C.** Quantidade de imagens geradas.
- **D.** Precision da classe fraude.
- **E.** Apenas accuracy agregada sem matriz de confusão.

**Gabarito (2 opções):** B, D

**Por quê:** Recall indica quantas fraudes foram encontradas; precision indica quantos alertas de fraude são realmente fraudes. Accuracy isolada pode esconder falhas em classes raras.

---

## AIF-MR03 — multiple_response · Domínio 2 · Tarefa 2.1

Ao projetar uma chamada de foundation model, quais DUAS afirmações sobre tokens e contexto são válidas?

- **A.** Uma janela de contexto tem tamanho infinito em modelos atuais.
- **B.** Adicionar conteúdo irrelevante ao prompt garante precisão maior.
- **C.** Tokens de entrada e saída podem influenciar o custo conforme o modelo de cobrança.
- **D.** Mais contexto nem sempre é melhor; pode elevar custo e dificultar recuperar instruções importantes.
- **E.** O número de tokens de saída é sempre igual ao de caracteres.

**Gabarito (2 opções):** C, D

**Por quê:** Uso de tokens afeta preço e desempenho conforme a oferta. Contexto deve ser selecionado, relevante e limitado para sustentar a tarefa.

---

## AIF-MR04 — multiple_response · Domínio 2 · Tarefa 2.1

Um agente usa ferramentas externas por MCP. Selecione DUAS boas práticas para reduzir riscos ao executar ações.

- **A.** Aplicar autorização real no serviço que executa a ferramenta e restringir o escopo.
- **B.** Assumir que o protocolo MCP já garante permissão e ausência de ataques.
- **C.** Pedir revisão humana para operações de impacto quando exigido pelo risco.
- **D.** Tratar o retorno de qualquer ferramenta como instrução de sistema confiável.
- **E.** Compartilhar credenciais administrativas com todas as ferramentas para simplificar.

**Gabarito (2 opções):** A, C

**Por quê:** MCP padroniza integração, mas não substitui IAM e controles de aplicação. Ações críticas podem exigir aprovação humana e logging.

---

## AIF-MR05 — multiple_response · Domínio 3 · Tarefa 3.1

Uma equipe precisa responder sobre políticas internas que mudam toda semana. Quais DUAS escolhas ajudam a construir uma solução fundamentada?

- **A.** Treinar um novo foundation model do zero toda vez que um documento mudar.
- **B.** Indexar documentos autorizados e recuperar trechos relevantes na consulta via RAG.
- **C.** Ignorar permissões documentais pois o modelo apenas resume.
- **D.** Disponibilizar referências e verificar se a resposta está apoiada no conteúdo recuperado.
- **E.** Supor que usar RAG elimina totalmente alucinações.

**Gabarito (2 opções):** B, D

**Por quê:** RAG injeta evidências atualizadas no contexto. Permissões e grounding continuam necessários; nenhuma técnica garante veracidade absoluta.

---

## AIF-MR06 — multiple_response · Domínio 3 · Tarefa 3.4

Você avalia um assistente RAG que cita documentos. Quais DUAS dimensões ajudam a diagnosticar sua qualidade além de fluência?

- **A.** Relevância dos trechos recuperados para a pergunta.
- **B.** Somente número de parâmetros do modelo.
- **C.** Se a resposta é sustentada pelos trechos e suas citações.
- **D.** Somente cor do botão de enviar mensagem.
- **E.** Quantidade máxima de requisições sem observar resultado.

**Gabarito (2 opções):** A, C

**Por quê:** Uma resposta pode soar boa mesmo quando a recuperação é ruim ou o texto inventa afirmações. Meça retrieval e grounding separadamente.

---

## AIF-MR07 — multiple_response · Domínio 4 · Tarefa 4.2

Uma empresa avalia IA para sugerir decisões sensíveis. Selecione TRÊS mecanismos coerentes com IA responsável.

- **A.** Documentar dados, uso pretendido, limitações e métricas com artefatos como Model Cards.
- **B.** Examinar desempenho e efeitos para diferentes subgrupos relevantes.
- **C.** Dispensar explicação e contestação porque o modelo tem boa média global.
- **D.** Oferecer revisão ou contestação humana de decisões de alto impacto.
- **E.** Usar apenas resultados de demonstrações comerciais como auditoria suficiente.

**Gabarito (3 opções):** A, B, D

**Por quê:** Documentação, testes por subgrupos e supervisão humana tratam responsabilidades distintas. Média global e demo não bastam.

---

## AIF-MR08 — multiple_response · Domínio 5 · Tarefa 5.1

Ao integrar um agente com um sistema financeiro, quais TRÊS proteções são compatíveis com defesa em profundidade?

- **A.** Permissões de mínimo privilégio e autenticação na ferramenta/serviço.
- **B.** Validação de parâmetros e do resultado antes de efetuar ações.
- **C.** Permitir toda ação se a resposta do modelo vier em JSON válido.
- **D.** Auditoria de chamadas de ferramenta e aprovação humana para operações críticas.
- **E.** Inserir segredos diretamente em prompts para economizar configuração.

**Gabarito (3 opções):** A, B, D

**Por quê:** IAM, validação, logs e aprovações são controles independentes. Formato JSON não equivale a autorização nem correção.

---

## AIF-ORD01 — ordering · Domínio 1 · Tarefa 1.3

Coloque em ordem um ciclo simplificado e auditável de entrega de ML, do planejamento ao uso.

- **S5.** Implantar com monitoramento, feedback e plano de atualização.
- **S3.** Treinar um baseline com dados apropriados.
- **S1.** Definir problema, público, restrições e métrica de sucesso.
- **S2.** Coletar e preparar dados representativos com tratamento de qualidade e vazamentos.
- **S4.** Avaliar resultados no conjunto de teste e revisar riscos.

**Ordem correta:** S1 → S2 → S3 → S4 → S5

**Por quê:** Definir a tarefa antes de tocar nos dados evita selecionar métrica ou técnica equivocada. Avaliar precede decisão de implantação; monitorar vem após o uso.

---

## AIF-ORD02 — ordering · Domínio 1 · Tarefa 1.2

Uma empresa começa a estudar classificação de solicitações. Ordene as decisões desde o problema até o piloto.

- **S5.** Executar piloto controlado e coletar feedback dos usuários.
- **S3.** Comparar uma solução determinística ou baseline de ML conforme necessidade.
- **S1.** Delimitar categorias e resultado de negócio desejado.
- **S2.** Examinar volume, rótulos disponíveis e representatividade dos exemplos.
- **S4.** Definir métricas e testar erros em dados não usados no treinamento.

**Ordem correta:** S1 → S2 → S3 → S4 → S5

**Por quê:** O método depende de objetivo e dados. Piloto não deve preceder avaliação em dados representativos.

---

## AIF-ORD03 — ordering · Domínio 2 · Tarefa 2.1

Ordene a preparação de uma solicitação GenAI controlada, antes de exibir a resposta ao usuário.

- **S5.** Exibir a resposta e registrar telemetria apropriada.
- **S3.** Solicitar inferência ao modelo.
- **S1.** Receber a solicitação e verificar autenticação/limites pertinentes.
- **S2.** Selecionar instruções, contexto autorizado e restrições da tarefa.
- **S4.** Validar a resposta quanto a formato, segurança e pertinência.

**Ordem correta:** S1 → S2 → S3 → S4 → S5

**Por quê:** Em fluxo simplificado, controle de entrada antecede inferência e validação de saída antecede a apresentação. Sistemas reais podem intercalar outros controles.

---

## AIF-ORD04 — ordering · Domínio 3 · Tarefa 3.1

Ordene o percurso de CONSULTA em uma aplicação RAG que usa índice vetorial já criado.

- **S5.** Gerar e validar a resposta, exibindo fontes quando disponíveis.
- **S3.** Recuperar trechos relevantes do repositório autorizado.
- **S1.** Receber e normalizar a pergunta do usuário.
- **S2.** Gerar uma representação de busca (por exemplo embedding da pergunta).
- **S4.** Combinar pergunta, instruções e evidências no contexto.

**Ordem correta:** S1 → S2 → S3 → S4 → S5

**Por quê:** O RAG recupera evidências antes da geração. Indexação dos documentos ocorre separadamente, na preparação do acervo.

---

## AIF-ORD05 — ordering · Domínio 3 · Tarefa 3.2

Ordene um processo de melhoria de prompt com histórico reproduzível.

- **S5.** Versionar a configuração escolhida e acompanhar resultados em uso.
- **S3.** Executar um conjunto consistente de casos de teste.
- **S1.** Definir tarefa, formato esperado e condições de sucesso.
- **S2.** Criar a versão inicial do prompt com restrições e exemplos necessários.
- **S4.** Analisar erros, custo, riscos e desempenho frente à versão anterior.

**Ordem correta:** S1 → S2 → S3 → S4 → S5

**Por quê:** Iterar sem objetivo, teste fixo e registro de versão dificulta saber se o prompt realmente melhorou.

---

## AIF-ORD06 — ordering · Domínio 3 · Tarefa 3.4

Ordene uma avaliação de agente antes de ampliar seu acesso a ferramentas.

- **S5.** Corrigir falhas e aplicar critérios de aprovação antes de expandir o uso.
- **S3.** Executar o agente com ferramentas em ambiente controlado.
- **S1.** Definir quais tarefas e ações são permitidas e o que caracteriza sucesso.
- **S2.** Construir cenários de teste normais, adversariais e de falha de ferramenta.
- **S4.** Avaliar conclusão da tarefa, segurança, intervenção humana e custos.

**Ordem correta:** S1 → S2 → S3 → S4 → S5

**Por quê:** Avalie comportamento de ponta a ponta, não apenas a qualidade do texto. Testes de limites e permissões são essenciais em agentes com ferramentas.

---

## AIF-ORD07 — ordering · Domínio 4 · Tarefa 4.1

Ordene um ciclo de análise de justiça para um caso de decisão com IA.

- **S5.** Monitorar em produção e abrir canais de revisão/contestação.
- **S3.** Definir métricas adequadas e avaliar resultados por subgrupo.
- **S1.** Identificar público afetado e riscos de decisão desigual.
- **S2.** Examinar origem, distribuição e qualidade dos dados por subgrupo relevante.
- **S4.** Mitigar distorções, documentar trade-offs e reavaliar.

**Ordem correta:** S1 → S2 → S3 → S4 → S5

**Por quê:** Um score agregado não revela resultados desiguais. As métricas e a mitigação dependem do contexto e das pessoas afetadas.

---

## AIF-ORD08 — ordering · Domínio 5 · Tarefa 5.2

Ordene a criação de um processo de governança para um novo caso de uso de IA.

- **S5.** Revisitar periodicamente a adequação dos controles e as mudanças do sistema.
- **S3.** Definir controles, aprovações, retenção e políticas de acesso.
- **S1.** Inventariar finalidade, responsáveis, sistemas e dados utilizados.
- **S2.** Classificar riscos, sensibilidade, requisitos legais e impacto da aplicação.
- **S4.** Instrumentar logs, auditoria, acompanhamento e evidências.

**Ordem correta:** S1 → S2 → S3 → S4 → S5

**Por quê:** Governança começa conhecendo ativos e riscos, estabelece controles e exige evidência e revisão contínua.

---

## AIF-MAT01 — matching · Domínio 1 · Tarefa 1.1

Associe cada tipo de aprendizado ao exemplo mais característico.

**Conceitos:**
- **L1:** Classificação supervisionada
- **L2:** Regressão supervisionada
- **L3:** Clustering não supervisionado
- **L4:** Aprendizado por reforço

**Definições:**
- **R4:** Aprender uma política de ações a partir de recompensas.
- **R3:** Formar grupos semelhantes sem rótulos de grupos prontos.
- **R2:** Estimar um valor numérico a partir de histórico rotulado.
- **R1:** Prever se um e-mail é spam usando exemplos rotulados.

**Associações corretas:** L1 → R1, L2 → R2, L3 → R3, L4 → R4

**Por quê:** O tipo de saída e a presença de rótulos/recompensas ajudam a identificar o paradigma.

---

## AIF-MAT02 — matching · Domínio 1 · Tarefa 1.2

Associe os serviços AWS de IA especializada a suas funções principais.

**Conceitos:**
- **L1:** Amazon Comprehend
- **L2:** Amazon Textract
- **L3:** Amazon Transcribe
- **L4:** Amazon Translate

**Definições:**
- **R4:** Traduzir texto entre idiomas.
- **R3:** Converter fala em texto.
- **R2:** Extrair texto e estrutura de documentos escaneados.
- **R1:** Extrair informações e entidades de texto com NLP.

**Associações corretas:** L1 → R1, L2 → R2, L3 → R3, L4 → R4

**Por quê:** Os nomes têm funções próximas, mas a modalidade de entrada/saída muda a escolha.

---

## AIF-MAT03 — matching · Domínio 2 · Tarefa 2.1

Associe os conceitos básicos de foundation models às descrições.

**Conceitos:**
- **L1:** Token
- **L2:** Embedding
- **L3:** Janela de contexto
- **L4:** Temperatura

**Definições:**
- **R4:** Parâmetro que influencia a aleatoriedade da amostragem, conforme modelo.
- **R3:** Limite de informação que pode ser considerada na chamada, conforme modelo.
- **R2:** Representação vetorial de informação para comparação/recuperação.
- **R1:** Unidade usada pelo modelo para representar porções de texto ou outras modalidades.

**Associações corretas:** L1 → R1, L2 → R2, L3 → R3, L4 → R4

**Por quê:** Tokenização, recuperação e geração são conceitos diferentes; embeddings não são resposta pronta.

---

## AIF-MAT04 — matching · Domínio 2 · Tarefa 2.3

Associe a necessidade ao produto/serviço AWS mais diretamente ligado a ela.

**Conceitos:**
- **L1:** Amazon Bedrock
- **L2:** Amazon SageMaker AI
- **L3:** Amazon Polly
- **L4:** Amazon Rekognition

**Definições:**
- **R4:** Analisar conteúdo de imagens e vídeos.
- **R3:** Converter texto em fala sintetizada.
- **R2:** Criar e operar fluxos de machine learning com maior controle do ciclo de vida.
- **R1:** Consumir foundation models e recursos gerenciados de GenAI.

**Associações corretas:** L1 → R1, L2 → R2, L3 → R3, L4 → R4

**Por quê:** Uma mesma solução pode usar vários serviços; associe o propósito principal de cada um.

---

## AIF-MAT05 — matching · Domínio 3 · Tarefa 3.1

Associe a técnica de adaptação de aplicação de FM à mudança que ela efetivamente faz.

**Conceitos:**
- **L1:** RAG
- **L2:** Fine-tuning
- **L3:** Destilação
- **L4:** In-context learning

**Definições:**
- **R4:** Orienta comportamento com exemplos no contexto, sem alterar os pesos.
- **R3:** Treina um modelo aluno para reproduzir capacidades/comportamento do professor em um escopo.
- **R2:** Atualiza parâmetros do modelo para adaptá-lo por treinamento adicional.
- **R1:** Fornece contexto recuperado na consulta sem exigir mudar os pesos do modelo.

**Associações corretas:** L1 → R1, L2 → R2, L3 → R3, L4 → R4

**Por quê:** RAG e in-context learning alteram entradas; fine-tuning e destilação envolvem treinamento.

---

## AIF-MAT06 — matching · Domínio 3 · Tarefa 3.4

Associe a métrica à finalidade mais adequada em avaliação.

**Conceitos:**
- **L1:** BLEU
- **L2:** ROUGE
- **L3:** BERTScore
- **L4:** Taxa de conclusão da tarefa

**Definições:**
- **R4:** Medir se o fluxo resolveu a ação de negócio definida.
- **R3:** Comparar similaridade semântica baseada em representações contextuais.
- **R2:** Analisar sobreposição de texto, frequentemente em sumarização.
- **R1:** Comparar correspondência de n-gramas, tradicionalmente em tradução.

**Associações corretas:** L1 → R1, L2 → R2, L3 → R3, L4 → R4

**Por quê:** Métricas textuais não substituem avaliação do resultado de negócio nem revisão de segurança.

---

## AIF-MAT07 — matching · Domínio 4 · Tarefa 4.2

Associe cada expressão à preocupação de IA responsável.

**Conceitos:**
- **L1:** Viés algorítmico
- **L2:** Alucinação
- **L3:** Explicabilidade
- **L4:** Humano no loop

**Definições:**
- **R4:** Intervenção humana em pontos definidos de avaliação ou decisão.
- **R3:** Capacidade de dar justificativas compreensíveis para comportamento/resultado.
- **R2:** Saída plausível que apresenta afirmação não sustentada como se fosse fato.
- **R1:** Padrão de resultado desigual potencialmente prejudicial entre grupos.

**Associações corretas:** L1 → R1, L2 → R2, L3 → R3, L4 → R4

**Por quê:** São riscos/controles relacionados, mas independentes: um modelo explicável ainda pode ter viés.

---

## AIF-MAT08 — matching · Domínio 5 · Tarefa 5.1

Associe o serviço AWS ao controle ou evidência principal.

**Conceitos:**
- **L1:** AWS IAM
- **L2:** AWS KMS
- **L3:** AWS CloudTrail
- **L4:** AWS Artifact

**Definições:**
- **R4:** Acesso a relatórios de conformidade e acordos de terceiros da AWS.
- **R3:** Registro/auditoria de atividade de API e eventos suportados.
- **R2:** Gerenciamento de chaves de criptografia.
- **R1:** Autorização de ações e recursos por papéis e políticas.

**Associações corretas:** L1 → R1, L2 → R2, L3 → R3, L4 → R4

**Por quê:** Controle de identidade, chaves, registro de eventos e documentação de conformidade não são substitutos.

---


## Itens acrescentados na revisão (Amazon Q × Amazon Quick)

**AIF-MR09 · Domínio 2 · múltipla resposta (selecione 2).** Uma empresa quer (1) que funcionários perguntem sobre documentos internos num assistente pronto, respeitando as permissões de cada um, e (2) que analistas montem painéis e façam perguntas sobre métricas de vendas. A) Amazon Q Business para o assistente dos funcionários. B) Amazon Quick para painéis e perguntas sobre os dados de vendas. C) Treinar um foundation model do zero para cada necessidade. D) Amazon Q Developer para os painéis de vendas. E) Amazon Polly para responder às perguntas dos funcionários. **Corretas: A e B.**

**AIF-MAT09 · Domínio 1 · associação.** Amazon Q Developer → assistente generativo para programar e operar na AWS; Amazon Quick → análise de dados e painéis com IA para o negócio; Kiro → ambiente de desenvolvimento orientado por agentes e especificações; Amazon Bedrock → plataforma para construir aplicações próprias com FMs.
