---
name: visual-elements
description: Criar diagramas e elementos visuais interativos (simuladores, fluxos animados, quizzes de cenário, comparadores, flashcards) para os capítulos dos cursos do Rota Cloud. Use quando um capítulo, seção ou tela precisar de figura, ou quando um visual existente estiver difícil de ler.
---

# Elementos visuais e interativos

Meta: **toda tela de conteúdo tem pelo menos um visual**, e de preferência um que muda com o clique e ensina o mecanismo (não decoração). Um visual = um conceito.

Antes de começar, leia a skill `rota-cloud-dev` (regras de consistência e verificação).

## Peças disponíveis (não reinvente)

| Peça | Arquivo | Quando usar |
|---|---|---|
| `DiagramShell` | `src/components/diagrams/kit.tsx` | Moldura obrigatória: `kicker`, `title`, `lead`, `limits`, `label` (acessível). |
| `Choices` | `kit.tsx` | Alternar cenário/modo (botões-pílula com `aria-pressed`). |
| `Callout` | `kit.tsx` | Resultado/explicação com tom (`ok`, `bad`, `warn`, `focus`); use `live` para `role="status"`. |
| `Box` / `.dg-box[data-tone]` | `kit.tsx`, `index.css` | Cartões HTML com tom semântico. |
| `Svg`, `SvgNode`, `SvgArrow`, `useSvgRefs` | `kit.tsx` | Diagramas estruturais em SVG (viewBox, setas, hachuras). |
| `ScenarioQuiz` | `kit.tsx` | “Qual serviço/técnica para este cenário?” com explicação do erro. |
| `FlowPlayer`, `useStepper`, `StepperControls` | `FlowPlayer.tsx`, `kit.tsx` | Fluxos passo a passo com fichas que andam (pipelines, ciclos, requisições). |
| `Range`, `Meter`, `Toggle`, `svgButton`, `pct`, `num` | `src/components/diagrams/controls.tsx` | Sliders, barras 0..1, chips liga/desliga, `<g>` SVG clicável e acessível. |
| `FlipCard` | `src/components/flashcards/FlipCard.tsx` | Qualquer cartão de frente/verso. |
| `RouteMap`, `ExamBlueprint` | `src/components/course/` | Mapa da trilha e pesos da prova. |

Exemplos para copiar o estilo: `src/components/diagrams/IamEvaluatorDiagram.tsx` (simulador), `src/courses/aif/diagrams/ConfusionMatrixDiagram.tsx` (slider + métricas), `RagDiagrams.tsx` (FlowPlayer + filtro), `DefenseInDepthDiagram.tsx` (camadas liga/desliga), `CaseStudyArchitectureDiagram.tsx` (rotas e falhas), `AppEvaluationDiagram.tsx` (HTML legível em vez de SVG).

## Escolha o formato pelo que precisa ser entendido

- **Decisão entre opções** → `ScenarioQuiz` ou comparador com `Choices` + `Callout`.
- **Mecanismo com causa e efeito** (limiar, temperatura, custo) → simulador com `Range`/`Toggle` e `Meter`, recalculado ao vivo.
- **Sequência no tempo** (pipeline, ciclo, requisição) → `FlowPlayer` ou passo a passo com `useStepper`.
- **Estrutura e relações** (arquitetura, camadas, hierarquia) → SVG com nós clicáveis (`svgButton`) e callout do item em foco.
- **Muito texto por item** → cartões HTML (`.dg-box`) em grade; **não** espremer frases em caixas SVG.

## Onde registrar

- **CLF-C02:** `src/components/diagrams/registry.tsx` — mapa `id-da-seção → componente`; o `ReaderPage` chama `<DiagramSlot sectionId>` depois da seção.
- **AIF-C01:** `src/courses/aif/diagrams/registry.tsx` — `after(Componente)` entra depois da seção; `inPlace(Componente)` substitui o bloco Mermaid daquela seção; o id especial `cNN-abertura` entra logo abaixo do título do capítulo.
- Os ids de seção vêm de `cNN-<slug>` (veja `src/courses/aif/sections.ts`). O teste de integridade falha se o id não existir — e exige ao menos um visual por capítulo no AIF.

## Regras de desenho

1. **Cores só por tokens** (`fill-navy`, `stroke-ok`, `var(--color-amber)` …). Funciona no tema escuro automaticamente.
2. **Texto SVG colorido via `style={{ fill: 'var(--color-…)' }}`** — `.diagram-svg text` tem precedência sobre classes `fill-*`. Texto secundário: `className="dg-soft"`.
3. **Largura base 640** no `viewBox`, com `minWidth` (≥ 420–560); o `.diagram-canvas` rola na horizontal no celular, mas a **página** nunca pode ter overflow em 390 px.
4. **Acessibilidade:** `label` no `DiagramShell`; título no `<Svg title>`; nós clicáveis com `svgButton` (teclado + `aria-label`); o resultado que muda vai num `role="status"` (`Callout live`).
5. Botão com fundo próprio (ex.: `.dg-box`) indica seleção com `aria-current`, não `aria-pressed` — a regra global pinta `button[aria-pressed=true]` de azul.
6. **“Limites deste desenho” honesto:** o que foi simplificado, o que é hipotético (preços, números), o que muda por Região/versão.
7. Números de exemplo são **hipotéticos e declarados como tal**; nunca preços reais fixos.
8. Rótulos não podem ser cortados com reticências nem se sobrepor: quebre em duas linhas, aumente o espaço ou mude para HTML.
9. Estado inicial já ensina algo (comece num caso interessante, não vazio).
10. Animações curtas, com `prefers-reduced-motion` respeitado (`.dg-move`, `.dg-fade` já tratam).

## Fluxo de trabalho

1. Leia a seção inteira e decida o conceito único que o visual ensina.
2. Escolha o formato (lista acima) e copie a estrutura de um exemplo parecido.
3. Registre no `registry.tsx` do curso.
4. `npm run typecheck && npm run lint && npm test`.
5. Screenshot da seção em 1280 e 390, claro e escuro (`SHELLS=1 node skills/rota-cloud-dev/scripts/screenshot.mjs …`) e **olhe as imagens**: sobreposição, corte, contraste, legibilidade.
6. Se o e2e precisar clicar num `<g>` sobreposto, use teclado (`press('Enter')`).

## Checklist

- [ ] Um conceito, com interação que muda algo visível e explicado em `role="status"`.
- [ ] Moldura `DiagramShell` com `kicker`, `title`, `lead`, `limits`.
- [ ] Só tokens; texto SVG via `style`; sem overflow em 390 px; legível no tema escuro.
- [ ] Registrado no id certo; testes de integridade passando.
- [ ] Screenshots conferidas.
