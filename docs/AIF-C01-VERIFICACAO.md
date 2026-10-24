# Revisão técnica e de conteúdo — AIF-C01

Data: 24/10/2026. O resultado abaixo distingue **checagens concluídas** de **verificações bloqueadas**.

| Etapa | Resultado | Evidência/limite |
|---|---|---|
| Guia oficial de referência | Conferido | AIF-C01 1.1, domínios, revisões e catálogo de serviços. Links em `AIF-C01-MAPA-OFICIAL.md` |
| Estrutura do conteúdo | Passou | 30 headings numéricos em sequência; 354 seções e subseções |
| Diagramas de estudo | Passou na integridade textual | 15 blocos Mermaid fechados; 14 SVG + uma sequência HTML na prévia offline |
| Banco de perguntas | Passou na integridade dos dados | 80 IDs e enunciados únicos, gabaritos A–D, distribuição 16/19/23/11/11 |
| Flashcards | Passou na integridade dos dados | 120 IDs e frentes únicas |
| Exercícios de outros formatos (suplemento) | Gerados, não integrados | 24 questões adicionais, oito de cada tipo (múltipla resposta, ordenação e associação). Necessitam revisão editorial, UI e testes; não incluídas nos 80 itens atuais |
| Serviços em escopo | Checagem textual passou | Todos os 51 nomes enumerados na lista por categoria ocorrem na apostila; isso **não** certifica profundidade homogênea por serviço |
| Fonte canônica e JSON | Passou | `sha256` correspondente à apostila e extração repetível |
| Integração em código | Teste sintático parcial passou | TSX sem erros de sintaxe pelo transpiler TypeScript instalado |
| Patch de integração | Simulação passou | Script encontra e substitui âncoras em amostra; reaplicação idempotente |
| Prévia HTML | Gerada | Single-file offline com 30 capítulos, 15 diagramas e bancos de prática incorporados; **não** substitui teste visual no browser |
| Build real React/Vite | **Não executado** | Ambiente não conseguiu clonar repositório nem instalar suas dependências |
| Lint, Vitest e e2e reais | **Não executados** | Rodar no checkout do `devgns/rota-cloud` após copiar e integrar arquivos |
| Pull request | **Não criado** | GitHub retornou HTTP 403 `Resource not accessible by integration` ao criar branch |

## Pendências de revisão manual antes do merge

1. Revisar as 24 questões complementares de formatos oficiais e decidir sua integração ao simulador sem desfigurar o contrato do banco principal.
2. Executar `npm ci`, `npm run typecheck`, `npm run lint`, `npm test` e `npm run build` com o repositório completo.
2. Abrir as rotas AIF-C01 e CLF-C02, comparar progresso, cabeçalho, busca e navegação legada; garantir isolamento de estado e conteúdo.
3. Revisar visual e acessibilidade dos SVGs, navegação por teclado, layouts menores que 1300px e mobile, tempo do simulado e persistência em `localStorage`.
4. Conferir nomes de serviços e recursos AWS sujeitos a evolução e exemplos da prova, evitando tratar conteúdo editorial como enunciado oficial.
5. Considerar uma próxima iteração para exercícios de múltipla resposta, ordenação e associação; o banco atual é de escolha única.

## Fontes primárias

- https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html
- https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html
- https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-in-scope-services.html
