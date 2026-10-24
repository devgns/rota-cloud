---
name: rota-cloud-dev
description: Desenvolver na plataforma Rota Cloud (React + TypeScript + Vite, cursos de certificação AWS como CLF-C02 e AIF-C01). Use ao mexer em telas, leitor, prática, progresso, rotas, testes ou ao adicionar um curso novo; garante consistência entre cursos, regeneração de dados e verificação visual.
---

# Desenvolvimento no Rota Cloud

Aplicação estática (sem backend) que hospeda cursos de certificação. Cada curso tem apostila em Markdown, banco de questões, flashcards e diagramas interativos. **A plataforma tem de parecer uma só:** qualquer diferença visual ou de comportamento entre cursos é bug.

Skills relacionadas: `visual-elements` (diagramas), `exam-research` (fontes e questões), `didactic-track` (estrutura do curso). Todas ficam em `skills/<nome>/SKILL.md`.

## Mapa da arquitetura

| Onde | O quê |
|---|---|
| `src/App.tsx` | Rotas (`HashRouter`). AIF-C01 usa `cursos/aif-c01/*` → `AifCourseApp`; os demais usam `cursos/:courseId` → páginas do CLF. |
| `src/courses/registry.ts` | Catálogo de cursos (`COURSES`, `coursePath`). Curso novo começa aqui. |
| `src/components/reader/` | **Leitor compartilhado**: `ReaderShell` (grade 16rem/46rem/14rem, barra de leitura, gaveta mobile), `ChapterNav` (checkbox de concluído + capítulo ativo), `SectionToc` (seção visível), `useReadingSpy`, `ChapterFooter`. |
| `src/components/course/` | `RouteMap` (mapa da trilha) e `ExamBlueprint` (pesos dos domínios), usados nas páginas iniciais. |
| `src/components/flashcards/FlipCard.tsx` | Cartão 3D com hover; todo flashcard da plataforma usa este componente. |
| `src/components/diagrams/` | Kit de diagramas (`kit.tsx`, `controls.tsx`, `FlowPlayer.tsx`) e diagramas do CLF (`registry.tsx`). Ver skill `visual-elements`. |
| `src/components/FontControls.tsx` | A−/A/A+ (preferência global, guardada nas configurações do `ProgressContext`). |
| CLF-C02 | `src/pages/*` (Home, Reader, Practice, Flashcards…), `src/lib/corpus.ts`, `src/state/ProgressContext.tsx` (chave `STORAGE_KEY`), `src/content/studyLayer.ts`. |
| AIF-C01 | `src/courses/aif/`: `AifCourseApp.tsx` (telas), `AifChapter.tsx` (corpo do capítulo), `sections.ts` (corte em seções e ids), `progress.ts` (chave `aif-c01-study-progress:v1` + `AifProgressContext`), `items.ts` (quatro formatos de questão + correção), `ItemView.tsx`, `PracticeScreens.tsx`, `AifWorksheet.tsx`, `diagrams/`. |
| `content/` + `data/` | Apostilas (fonte canônica) e JSONs gerados (currículo, questões, flashcards). |
| `scripts/` | `extract_study_data.py` (CLF) e `extract_aif_study_data.py` (AIF) regeneram currículo e SHA. |
| `tests/`, `e2e/` | Vitest (integridade, componentes) e Playwright (desktop + Pixel 5). |

## Regras da casa

1. **Nunca leia `.env`** (nem por `cat`, `grep` ou script com `dotenv`). Ao subir o app, filtre a saída do log.
2. **Não faça commit nem push sem pedido explícito.**
3. **Consistência entre cursos:** antes de criar tela, menu, cartão, botão ou layout, procure o componente compartilhado. Se só existe numa versão de curso, extraia para `src/components/` e use nos dois. Use `buttonClass`/`Button` e `Panel` de `src/components/ui.tsx`, as classes `.choice`, `.diagram-shell`, `.dg-box`, `.module-label` e os tokens `var(--color-*)` de `src/styles/index.css`; nunca cores fixas.
4. **Progresso isolado por curso:** cada curso tem sua chave no `localStorage`; preferências de exibição (tema, fonte) são globais.
5. **Fonte canônica:** o texto do curso vive no Markdown de `content/`. Editou a apostila do AIF → rode `python3 scripts/extract_aif_study_data.py` (o app confere o SHA-256 e trava se divergir); para o CLF, `python3 scripts/extract_study_data.py`.
6. **Ids de seção** seguem `cNN-<slug sem acento, até 75 caracteres>`. Mudar um título muda o id: atualize os registros de diagramas e rode os testes de integridade.
7. Português do Brasil na interface; nomes oficiais AWS em inglês.

## Comandos

```bash
npm run dev            # Vite em http://localhost:5173 (use --port 5199 para os scripts)
npm run typecheck      # tsc --noEmit
npm run lint           # eslint src tests --max-warnings 0
npm test               # vitest run
npm run test:e2e       # build + preview + Playwright (desktop e mobile)
```

## Verificação visual

Com o dev server na porta 5199:

```bash
node skills/rota-cloud-dev/scripts/screenshot.mjs /tmp/telas cursos/aif-c01 cursos/clf-c02/ler/chapter-02
W=390 node skills/rota-cloud-dev/scripts/screenshot.mjs /tmp/telas cursos/aif-c01/ler/chapter-14
DARK=1 SHELLS=1 node skills/rota-cloud-dev/scripts/screenshot.mjs /tmp/telas cursos/aif-c01/ler/chapter-06
```

O script informa overflow horizontal e erros de página. Abra as imagens e compare **os dois cursos lado a lado** quando a mudança tocar algo compartilhado.

## Adicionar um curso

1. Entrada em `COURSES` (`src/courses/registry.ts`) com `status: 'soon'` até ter conteúdo.
2. Conteúdo e trilha seguindo a skill `didactic-track`; pesquisa seguindo `exam-research`.
3. Reaproveite o leitor (`ReaderShell` + `ChapterNav` + `SectionToc` + `ChapterFooter`), `RouteMap`, `ExamBlueprint`, `FlipCard`, `ItemView`/`items.ts`. Não copie telas: parametrize.
4. Testes: integridade do conteúdo (como `tests/aif-integrity.test.ts`) e e2e que percorre todos os capítulos sem overflow (como `e2e/aif.spec.ts`), incluindo o teste “Leitor igual nos dois cursos”.

## Checklist antes de entregar

- [ ] `npm run typecheck`, `npm run lint`, `npm test` e `npm run test:e2e` passam.
- [ ] Apostila editada → script de extração rodado e SHA atualizado.
- [ ] Screenshots em 1280 e 390, claro e escuro, sem overflow; comparação entre cursos quando tocar em algo compartilhado.
- [ ] Nada de `.env` lido; nenhum commit sem pedido.
