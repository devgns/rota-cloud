# Revisão do curso AIF-C01

Data: 24 de outubro de 2026. Escopo: conteúdo e telas em `/home/gustavo/cfl-c02`. O CLF-C02 não foi revisado. O repositório `/home/gustavo/rota-cloud` ainda não contém este curso.

Veredito: a sequência didática, os contrastes de decisão e boa parte dos diagramas já ensinam o que a prova pede. O material ainda não deixa uma pessoa que percorra todos os capítulos apta a prestar a AIF-C01 com segurança. Dois ajustes bloqueiam essa meta. Os demais melhoram fixação e as telas.

Base normativa conferida nesta revisão: *AWS Certified AI Practitioner Exam Guide (AIF-C01)*, revisão 1.1 (30/04/2026), inclusive a lista de serviços em escopo e o histórico de mudanças. O guia declara 65 questões (50 pontuadas e 15 não identificadas), nota 700 em escala 100–1000, e quatro tipos de item: escolha única, múltipla resposta, ordenação e associação.

Não houve nova execução do Playwright nesta rodada. As telas citadas vêm do código atual e das capturas já presentes em `test-results/`.

## O que já sustenta o estudo

A ordem dos 30 capítulos segue dependência conceitual: problema e dados, depois modelos, geração, aplicação, proteção e síntese. Isso está alinhado a `docs/AIF-C01-TRILHA-DIDATICA.md` e evita despejar os cinco domínios na ordem do guia.

Os capítulos de maior peso ensinam por contraste, que é o formato da prova: ML tradicional versus foundation model, RAG versus fine-tuning, Bedrock versus SageMaker AI, temperature baixa versus resposta correta, CloudTrail versus Config versus Artifact. Os capítulos 11, 13, 14, 15, 16, 21 e 25 são os mais úteis para quem vai decidir sob enunciado.

Há diagramas interativos registrados por seção em `src/courses/aif/diagrams/registry.tsx` (mapa de conceitos, ciclo de ML, matriz de confusão, orçamento de tokens, RAG, agentes, fairness por subgrupo, transparência versus explicabilidade). O teste `e2e/aif.spec.ts` percorre os 30 capítulos e exige um `.diagram-shell` em cada um, sem overflow horizontal da página. A captura de desktop do capítulo 2 mostra o quiz de cenário funcionando junto com o mapa de elipses.

O banco `data/QUESTOES_AIF-C01_80.json` tem 80 itens de escolha única com explicação. A numeração no currículo reparte 16 / 19 / 23 / 11 / 11 entre os domínios, perto dos pesos 20 / 24 / 28 / 14 / 14. O simulado avisa que o percentual não é a nota AWS.

## Achados

Ordem: bloqueantes primeiro.

### 1. Amazon Q entra no guia 1.1 e o curso trata o nome como apelido histórico

Severidade: alta. Bloqueia a meta de cobertura.

O histórico da revisão 1.1 acrescenta **Amazon Q** à lista de serviços em escopo, ao lado de Aurora, AgentCore, Kiro, Strands Agents, SageMaker JumpStart e AWS Transform. O objetivo 1.3.4 da versão 1.1 cita, no mesmo exemplo, Amazon Bedrock, **Amazon Q**, **Amazon Quick**, Kiro e SageMaker AI. São dois produtos na categoria de “qual serviço usar nesta etapa”.

O capítulo 12 diz o contrário da distinção que a prova exige:

> “Amazon Quick está na lista oficial em escopo da revisão consultada; o histórico também faz referência a Amazon Q, então ensine o nome que aparece no enunciado e confira a documentação vigente para a capacidade específica, evitando supor equivalência entre produtos de nomes próximos.”

(`content/Apostila_AWS_AI_Practitioner_AIF-C01_Completa.md`, seção 12.3, por volta da linha 620.)

O catálogo do capítulo 24, que se apresenta como a lista em escopo, tem linha para Amazon Quick (“exploração de dados e experiências de análise/IA”) e nenhuma linha para Amazon Q. O mesmo vale para `ServiceCatalogExplorer.tsx` e para `AwsAiPortfolioDiagram.tsx`. Uma busca na apostila encontra “Amazon Q” só nesse parágrafo.

Quem estudar só este material não tem regra de decisão: Quick responde a exploração e análise de dados de negócio; Q responde a assistência generativa em tarefas de negócio ou de desenvolvimento. O texto manda “conferir a documentação” no lugar de ensinar a diferença. Isso falha o objetivo 1.3.4 e a lista de serviços adicionados.

Sugestão: uma linha no capítulo 12, uma linha no catálogo do 24 e um par no comparativo do 26. Incluir Q no explorador de serviços e em pelo menos duas questões de cenário (assistente no trabalho versus painel/perguntas sobre dados). Manter a ressalva de que capacidades mudam, sem apagar a função de cada nome no guia 1.1.

### 2. As telas de prática só treinam escolha única

Severidade: alta. Bloqueia o ensaio do formato oficial.

O guia 1.1 lista quatro tipos. Na múltipla resposta é preciso marcar todas as corretas para pontuar. Na ordenação, a ordem inteira precisa estar certa. Na associação, todos os pares precisam estar certos. Item em branco conta como erro. Não há crédito parcial.

`src/courses/aif/AifCourseApp.tsx` (treino e simulado, por volta das linhas 188–207) renderiza apenas radios A–D. O texto da tela avisa que o simulado “usa exclusivamente questões de escolha única e não reproduz a distribuição exata dos tipos oficiais”. Os 24 exercícios de múltipla resposta, ordenação e associação existem em `content/QUESTOES_AIF-C01_FORMATOS_COMPLEMENTARES.md` e em `data/QUESTOES_AIF-C01_FORMATOS_COMPLEMENTARES_24.json`, com o próprio arquivo dizendo: “Não estão integrados ao simulado React. Revisar antes de publicar.”

Quem percorre capítulos, treino, simulado de 65 questões e flashcards nunca pratica a regra de pontuação que mais derruba candidato preparado. O banco suplementar também não passou por revisão editorial, então publicá-lo cru não resolve.

Sugestão: revisar os 24 itens, corrigir enunciados ambíguos e colocá-los numa tela própria, com seleção múltipla, ordenação e associação. O simulado de 65 pode continuar majoritariamente de escolha única, desde que uma fatia visível use os outros formatos e o placar zere o item quando faltar uma alternativa ou um par. Até lá, o capítulo 1 precisa dizer que a aprovação depende desses formatos e que o simulado do site não os cobre.

### 3. O domínio 4 lista princípios que o texto não ensina a distinguir

Severidade: média. Não bloqueia sozinho; deve ser corrigido antes de chamar o domínio de coberto.

O domínio 4 vale 14% do conteúdo pontuado. O objetivo 4.1 pede identificar viés, justiça, inclusão, robustez, segurança e veracidade como características diferentes.

A seção 19.1 (cerca de 455 palavras no capítulo inteiro) faz isto:

> “IA responsável reúne princípios de justiça (fairness), inclusão, robustez, segurança, veracidade, transparência, responsabilização e respeito a direitos. A resposta não é uma lista de slogans: cada princípio deve gerar critérios e procedimentos verificáveis.”

A frase promete critérios e, em seguida, desenvolve viés, fairness por subgrupo, overfit e sustentabilidade. Inclusão, robustez, segurança e veracidade não ganham definição nem cenário contrastante em nenhum outro ponto da apostila (a palavra “veracidade” reaparece só como limite de fluência ou de um produto).

O que funciona nesse domínio deve permanecer: `FairnessSubgroupDiagram` mostra média de 98% com o grupo D em 70%, e `TransparencyQuiz` separa transparência de explicabilidade. O mapa da prova na home aponta o domínio 4 apenas para os capítulos 19 e 20 (`ExamBlueprintDiagram.tsx`, `chapters: [19, 20]`). Guardrails, grounding e o ataque indireto, que respondem aos objetivos 4.1.2 e 5.1.5, estão no capítulo 21 e ficam fora desse atalho.

Sugestão: uma tabela curta no capítulo 19, um cenário por princípio (inclusão do dataset, robustez sob entrada adversária, segurança de dano, veracidade da afirmação). Incluir o capítulo 21 no atalho do domínio 4 na home. Um quiz no mesmo estilo do de transparência fixa melhor do que alongar o texto.

### 4. O mapa da trilha corta o nome dos módulos

Severidade: média. Problema de tela, não de conteúdo.

`RouteMap.tsx`, linha 34, corta o título em 26 caracteres:

```ts
m.title.length > 28 ? `${m.title.slice(0, 26)}…` : m.title
```

Os títulos do currículo passam disso: “Fundamentos e aprendizado de máquina”, “Como funciona a IA generativa”, “Construindo aplicações com FMs”, “Proteção, conformidade e governança”. A captura de desktop da home (`test-results/.../desktop/aif-home.png`) mostra exatamente essas reticências no mapa “Sua trilha”, que é a primeira figura do curso. O guia visual do próprio projeto pede figura sem texto cortado. O nome acessível do botão SVG traz o título inteiro; quem vê a página, não.

Sugestão: rótulo em duas linhas, ou o nome curto do módulo (“GenAI”, “Aplicações”, “Proteção”) com o título completo no callout ao focar a estação. Sete estações em 640 px não cabem frases de 30 caracteres numa linha só.

### 5. O simulado de 90 minutos some ao recarregar

Severidade: média. Problema de tela.

O simulado anuncia 90 minutos e 65 questões. As respostas e o cronômetro vivem em `useState` dentro de `Practice` (`AifCourseApp.tsx`, por volta das linhas 154–175). O `localStorage` guarda só a tentativa depois de finalizar. Recarregar no meio zera a prova. O CLF-C02 já restaura simulado aberto; o AIF não. A entrega em `docs/AIF-C01-ENTREGA.md` registra o limite, e a tela não avisa antes de começar.

Sugestão: persistir o conjunto sorteado, as respostas e o tempo restante na mesma chave de progresso, com “retomar” e “abandonar”, no padrão da tela de prática do Cloud Practitioner.

### 6. Amazon Nova aparece como serviço clássico antes de existir foundation model

Severidade: baixa.

A seção 7.1 é “serviços de IA clássica” e inclui Amazon Nova na mesma tabela de Transcribe, Polly e Rekognition: “Família de modelos de IA oferecida pela AWS”. O capítulo 8, logo depois, é que define foundation model. A trilha pede para não antecipar o conceito. Nova também não é um serviço de entrada→saída no mesmo sentido de Textract.

Sugestão: tirar Nova dessa tabela e apresentá-lo no capítulo 8 ou 12, ao lado de Bedrock, como família de modelos acessada pela plataforma.

## Telas que podem ficar como estão

A home deixa claros o peso dos domínios, a escala 100–1000 e o aviso de que o percentual do site não é a nota oficial. A captura mobile da home empilha cards e botões sem cortar a página. O diagrama do capítulo 2, no mobile, mantém o quiz de cinco cenários utilizável; o rótulo interno “FMs / LLMs” fica apertado dentro da elipse, e o callout ao lado compensa.

Busca do AIF remove acento (`seguranca` encontra o texto) e não mistura o corpus do CLF-C02. Progresso, flashcards e última leitura usam a chave `aif-c01-study-progress:v1`. O cronômetro de estudo do Cloud Practitioner não conta enquanto o AIF está aberto.

O glossário do AIF é a lista dos 120 flashcards, enquanto o do CLF-C02 é um índice de serviços com página própria. O rótulo do menu é o mesmo. Vale uma frase na tela (“estes cartões são o glossário deste curso”) para quem vem do outro curso. Não é falha de conteúdo.

## O que não foi possível verificar nesta rodada

Não reexecutei `npm test`, `npm run test:e2e` nem abri o dev server de novo. A afirmação de que os 30 capítulos montam e não estouram a largura da página permanece a do teste já escrito e da entrega de 24/10/2026. Não conferi, item a item, o gabarito das 80 questões nem o texto integral dos capítulos 27 e 28. A leitura amostral (capítulos 7–17, 19–25 e o banco suplementar) não mostrou erro grosseiro de RAG, métricas ou responsabilidade compartilhada; isso não equivale a auditoria frase a frase.

Não há diretório `.compozy/tasks/<nome>/` para este pedido. As considerações ficam neste arquivo, que foi o artefato pedido, e não numa rodada `reviews-NNN`.

## Resolução (24/10/2026)

1. **Amazon Q × Amazon Quick:** seção 12.3 ganhou tabela de decisão (Q Developer, Q Business, Quick, Kiro); linhas novas nas tabelas 12.1 e 24.5, par novo no comparativo 26.1, Q no catálogo interativo, no mapa do portfólio e no baralho de pares; dois itens novos (AIF-MR09, AIF-MAT09).
2. **Formatos da prova:** os 24 itens foram revisados (um distrator trocado em MR06, redação do Artifact em MAT08) e integrados com os 2 novos: tela *Praticar → Formatos da prova* e 6 itens no simulado de 65, com correção sem crédito parcial. O capítulo 1 explica a regra.
3. **Domínio 4:** tabela das seis características (viés, justiça, inclusão, robustez, segurança, veracidade) na 19.1 e quiz de cenários; o atalho da home inclui o capítulo 21.
4. **Mapa da trilha:** rótulos em até duas linhas, sem reticências.
5. **Simulado:** sorteio, respostas, questão atual e tempo restante ficam salvos; ao voltar, o simulado é retomado; há opção de abandonar e revisão comentada ao final.
6. **Amazon Nova:** saiu da tabela de IA clássica (7.1) e passou a ser apresentada no capítulo 8.
7. **Glossário:** a tela explica que o glossário do AIF são os flashcards.
