# Guia visual e de interações — novo curso AIF-C01

Este documento serve como **briefing editorial de interface** para complementar `docs/AIF-C01-TRILHA-DIDATICA.md`. O material-fonte está na apostila e deve continuar disponível integralmente. O leitor do CLF-C02 é a referência de identidade: fonte editorial, contrastes, componentes claros, progresso, acessibilidade e diagramas que explicam um conceito em vez de apenas enfeitar a página.

## Regras para cada diagrama

- **Um problema por figura:** título didático, legenda e explicação textual adjacente com a conclusão a ser aprendida.
- **Interatividade com função:** botões/seletores devem alterar um cenário e mostrar consequência; evitar animação gratuita.
- **Acessível:** SVG com `role="img"`, nome descritivo, teclado para controles, `aria-live` onde couber e conteúdo equivalente em texto.
- **Responsivo e tema:** sem texto cortado em 360px; permitir scroll horizontal **interno à figura**, não à página; usar variáveis CSS para light/dark.
- **Limites declarados:** as ilustrações simplificam arquiteturas; não afirmar que são desenhos de implementação produtiva.
- **Sem recursos externos obrigatórios:** o site deve continuar funcionando como aplicação estática no GitHub Pages, sem chave de API.

## Storyboard dos 15 diagramas já contidos na apostila

A tabela abaixo indica a intenção visual. A IA local deve localizar cada bloco ` ```mermaid ` na seção correspondente, verificar se o desenho representa corretamente o texto e criar/ajustar componentes. O protótipo usa um parser parcial de Mermaid; **não suponha que todo traço e rótulo já é renderizado fielmente**.

| Capítulo | Figura | Pergunta que o estudante precisa conseguir responder | Interação sugerida |
|---|---|---|---|
| 02 | Família IA ⟶ ML ⟶ DL ⟶ GenAI ⟶ agentes | Em que a técnica baseada em regras difere de ML e GenAI? | Selecionar categoria e revelar caso típico/contraexemplo |
| 03 | Mapa das formas de aprendizado | Em qual modalidade existe rótulo, padrão oculto ou recompensa? | Escolher tipo de dado e iluminar abordagem |
| 05 | Ciclo de ML e feedback | Qual a diferença entre treino, avaliação, inferência e operação? | Avançar etapas e mostrar artefatos e riscos |
| 07 | Escolha de serviços AWS especializados | Em qual serviço há OCR, fala, tradução, NLP e recomendação? | Cenários de negócio com escolha e feedback |
| 08 | FM/Transformer e tokens | Por que geração de texto depende de entrada, contexto e saída? | Seguir a sequência da inferência, sem entrar em matemática |
| 09 | Embeddings e busca por similaridade | Por que vetores representam proximidade sem serem respostas? | Selecionar pergunta e destacar documentos relevantes |
| 12 | Ecossistema Bedrock × SageMaker AI | Em qual nível operacional cada produto ajuda? | Alternar necessidade: usar modelo, construir, ajustar, operar |
| 13 | Arquitetura de prompt/contexto | Como system, user, exemplos, RAG e restrições se combinam? | Montar contexto com orçamento de tokens fictício |
| 14 | RAG ponta a ponta | O que é indexado antes, e o que acontece a cada pergunta? | Passo a passo ingestão vs consulta; destacar citações |
| 15 | Agentes + MCP + ferramenta | O que o MCP padroniza e o que a autorização ainda exige? | Reproduzir chamada e um bloqueio por permissão |
| 16 | Árvore RAG × fine-tuning × destilação | Qual problema cada técnica resolve e quanto custa operar? | Caso de decisão; mostrar por que alternativas falham |
| 17 | Avaliação de modelo/aplicação | Por que um benchmark bom não garante tarefa concluída? | Escolher uma métrica e ver sua limitação |
| 21 | Ameaças e proteção em camadas | Qual defesa interrompe prompt injection e exfiltração? | Acionar falhas em etapas, destacando filtros independentes |
| 25 | Estudo de caso integrado | Como desenhar assistente que lê documentos e age com controles? | Caminho consulta vs ação, com aprovação humana |
| 30 | Revisão, cobertura e aprendizagem | Como as tarefas oficiais se distribuem nos capítulos? | Visão de trilhas com cobertura de domínios, sem inventar notas |

*O capítulo exato das figuras pode ser conferido pelo conteúdo, pois o material contém blocos Mermaid embutidos e o mapeamento pedagógico pode evoluir.*

## Componentes prioritários a reaproveitar do CLF-C02

- `src/components/diagrams/kit.tsx`: `DiagramShell`, `Choices`, `Callout`, `Svg`, `SvgNode`, `SvgArrow`, `ScenarioQuiz`.
- `src/components/diagrams/FlowPlayer.tsx`: etapas com controles de avanço/retrocesso e respeito a `prefers-reduced-motion`.
- `src/components/diagrams/registry.tsx`: associação estável de seção para um componente específico. Preferir esse padrão quando o parser genérico de Mermaid simplificar demais.
- `src/pages/ReaderPage.tsx` e `src/components/MarkdownView.tsx`: hierarquia editorial, contexto de seção e Markdown.

## Três protótipos de alto valor para a primeira revisão visual

### A. RAG versus fine-tuning

O usuário escolhe um requisito: **documentos mudam semanalmente**, **tom e formato precisam ser consistentes** ou **aplicação exige fontes citáveis**. A interface explica por que RAG é melhor para incorporar documentos atualizados, fine-tuning pode adaptar comportamento e formato, e uma abordagem combinada às vezes faz sentido. Evite afirmar que fine-tuning nunca muda conhecimento ou que RAG garante veracidade absoluta.

### B. Fluxo de agentes e MCP

Mostrar usuário → modelo/planejador → descoberta de ferramenta → solicitação → autorização/validação → execução → observação → resposta. Se a ferramenta pede ação de impacto, oferecer uma trilha com *human-in-the-loop*. O **MCP é protocolo de integração/contexto**, não substituto de IAM, validação ou políticas.

### C. IA responsável em cenários

Apresentar um modelo de aprovação fictício com desempenho agregado bom, mas desempenho desigual entre grupos. O estudante seleciona uma métrica, vê que a média mascara subgrupos e aprende por que transparência, fairness e revisão humana são responsabilidades distintas.

## Rubrica de inspeção visual

1. O estudante aprende algo ao olhar a figura sem precisar decodificar setas soltas?
2. Todas as linhas e rótulos do conteúdo original aparecem ou estão explicados no texto alternativo?
3. O estado selecionado é distinguível sem depender apenas da cor?
4. Os controles são utilizáveis no teclado e seus estados têm nomes acessíveis?
5. O diagrama cabe em viewport estreita sem provocar overflow da página?
6. O desenho continua legível em modo escuro e com redução de movimento?
7. A legenda declara simplificações e evita inferência de garantia de segurança/desempenho?

Este guia é um **briefing para a implementação**, não prova de que os 15 diagramas já foram inspecionados em navegador.
