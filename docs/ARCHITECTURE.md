# Arquitetura

Aplicação estática React + TypeScript + Vite. Não há backend, autenticação nem chamada à AWS.

## Conteúdo

- `content/Apostila_AWS_Cloud_Practitioner_CLF-C02_Completa.md` é a redação. O leitor mostra esse Markdown, segmentado por AST (`remark-parse`), sem reescrever o miolo.
- `data/*.json` traz currículo, 80 questões e 132 flashcards. Os três carregam o mesmo `metadata.sha256`. Na abertura, o app recalcula o SHA-256 da apostila. Se divergir, a interface para e pede `python3 scripts/extract_study_data.py`.
- IDs de seção repetem a regra do extrator: `cNN-` + slug sem acento, no máximo 75 caracteres.

## Rotas

`HashRouter`, para um GitHub Pages em subcaminho funcionar sem fallback de servidor. A base dos assets vem de `BASE_PATH` (padrão `/`).

- `#/` início
- `#/trilhas`
- `#/ler/:chapterId/:sectionId?` e `#/ler/capa`
- `#/praticar`, `#/praticar/treino`, `#/praticar/simulado`, `#/praticar/resultado/:id`
- `#/flashcards`
- `#/glossario/:entryId?`
- `#/progresso`
- `#/busca`

## Progresso

Chave `clf-c02-study-progress:v1`. Leitura e escrita passam por funções puras em `src/lib/progress.ts`. Se `localStorage` falha, a sessão continua em memória e a interface avisa. Outra aba com `updatedAt` mais novo substitui o estado local. Exportação, fusão, substituição e reset ficam em Progresso.

Conclusão de seção ou capítulo é uma ação. A barra do topo é só posição de leitura.

## Prática

Questões e flashcards vêm dos JSON. O simulado sorteia até 65 itens, 90 minutos, com pausa. Alternativas embaralham sem trocar o id do gabarito. Múltipla resposta exige a quantidade indicada. O percentual não vira nota AWS.

Flashcards: Errei 1 dia, Hesitei 3, Sei 7.

## Diagramas

`DiagramSlot` (em `src/components/diagrams/registry.tsx`) encaixa um componente original depois da seção correspondente: 23 diagramas, cobrindo os capítulos 2 a 21. São simplificações didáticas; o texto do status (`role="status"`) acompanha o desenho, e os limites de cada um ficam num `<details>` recolhido.

Peças compartilhadas em `kit.tsx`: `DiagramShell`, `Choices`, `Callout`, `Svg`/`SvgNode`/`SvgArrow` (SVG com as cores do tema, então o modo escuro funciona sozinho), `ScenarioQuiz` (cenário → resposta, com o desenho reagindo à escolha) e `useStepper`. `FlowPlayer.tsx` anima fluxos quadro a quadro (mensageria, síncrono/assíncrono) e respeita `prefers-reduced-motion`.

Os esquemas em texto da apostila (blocos ```text) viram figuras SVG estáticas em `figures.tsx`. O `MarkdownView` troca o `<pre>` pela figura quando a primeira linha do bloco é uma chave conhecida; o texto original fica na página, recolhido em "Ver em texto". Quando um diagrama interativo da mesma seção já desenha o esquema (11.6 e exportação de planilha), o bloco só é recolhido. O teste de integridade confere que cada chave ainda existe na apostila.

## Siglas e abertura dos capítulos

Cada capítulo da apostila começa com a linha `> **Nomes completos nesta página:** …`. O leitor não mostra essa linha: `src/lib/abbreviations.ts` a transforma em dados, e um plugin remark insere o nome completo na primeira menção de cada sigla no capítulo, entre parênteses e em texto discreto. As demais menções viram `<abbr title>`. Quando a própria apostila já explica a sigla, seja por um parêntese logo depois ou pelo nome por extenso na seção, nada é repetido. No capítulo 23, cujas questões não passam pelo markdown, a lista aparece recolhida em "Siglas usadas nesta página". Trilhas, Praticar e Flashcards usam a mesma lista recolhível (`ServiceNamesGuide`).

A abertura do capítulo é montada nesta ordem: título, etiqueta `[ESSENCIAL — …]` (como selo), objetivos de aprendizagem (`studyLayer.ts`) e só então o texto.

## Cursos

A raiz (`/`) é o catálogo (`CatalogPage`, com a entrada animada em `components/landing/RouteHero.tsx`). Cada curso vive em `/cursos/:courseId/...`:

- `src/courses/registry.ts` lista os cursos (`available` ou `soon`) e guarda a marca (`BRAND`), o autor e o link do GitHub.
- `CourseLayout` (em `src/courses/CourseContext.tsx`) põe o curso no contexto. Um curso `soon` ou inexistente mostra uma página "em preparação".
- Links internos passam por `useCoursePath()`: `p('/ler/x')` vira `/cursos/clf-c02/ler/x`. `lib/recommend.ts` e `lib/find.ts` continuam devolvendo caminhos relativos ao curso, e quem os exibe aplica o prefixo.
- O `Shell` descobre o curso pela URL (`useMatch`). Dentro de um curso mostra o selo do curso, a navegação e a busca; no catálogo mostra só a marca e o GitHub.
- Endereços antigos (`/ler/…`, `/trilhas`, `/praticar/…` etc.) redirecionam para o CLF-C02 (`LegacyRedirect`).

Hoje o corpus (`lib/corpus.ts`), o progresso (`clf-c02-study-progress:v1`) e o `ProgressProvider` são do CLF-C02, e tema e fonte vivem nesse mesmo progresso. Quando o segundo curso chegar, vale extrair as preferências para uma chave global e carregar corpus e progresso por curso dentro do `CourseLayout`.

A animação usa a biblioteca `motion` (`motion/react`) e respeita `prefers-reduced-motion` com `useReducedMotion()`. A assinatura do rodapé fica em `components/layout/Signature.tsx`.

