# Entrega: curso AWS Certified AI Practitioner (AIF-C01) para Rota Cloud

**Data da pesquisa:** 24/10/2026  
**Referência principal:** guia oficial AWS Certified AI Practitioner, revisão 1.1, publicada em 30/04/2026.  
**Destino:** `devgns/rota-cloud` (React + TypeScript + Vite, GitHub Pages).

## O que foi preparado

- **30 capítulos** em `content/Apostila_AWS_AI_Practitioner_AIF-C01_Completa.md`, com leitura incremental, explicações, exemplos, tabelas, diagramas Mermaid, exercícios, estudos de caso e fontes oficiais.
- **15 diagramas originais** em Markdown, convertidos em componentes visuais SVG no site React e SVG inline na prévia offline.
- **80 questões originais de escolha única**, com quatro alternativas, gabarito explicado, domínio e grupo de tarefa oficial mapeado. Distribuição: **16 / 19 / 23 / 11 / 11** pelos cinco domínios. **Observação:** a prova oficial também usa múltipla resposta, ordenação e associação, que este banco não simula.
- **120 flashcards** originais com definições e critérios de decisão.
- **Mapeamento de 14 task statements** e seus subobjetivos editoriais: `docs/AIF-C01-MAPA-OFICIAL.md`.
- **Sequência didática** com pré-requisitos e objetivos por módulo: `docs/AIF-C01-TRILHA-DIDATICA.md`.
- **Mapa do currículo** com IDs, módulos, capítulos e SHA-256: `docs/AIF-C01-CONTENT_MAP.md` + `data/CURRICULO_AIF-C01.json`.
- **Interface React aditiva** em `src/courses/aif/`, com leitura, diagramas interativos, comparação RAG × fine-tuning e Guardrails × IAM, busca, glossário, treino, simulado, flashcards, revisão espaçada, navegação e progresso próprio.
- **Prévia HTML autossuficiente** em `AIF-C01-PREVIA-OFFLINE.html`: pode ser aberta diretamente no navegador, mesmo sem npm ou acesso ao GitHub. Tem seus próprios controles de leitura, questões e cartões; é **uma prévia editorial**, não substitui testes da aplicação React.

## Como abrir a prévia agora

Baixe `AIF-C01-PREVIA-OFFLINE.html` e abra o arquivo no navegador. Os diagramas já vêm como SVG; não é necessário instalar bibliotecas ou acessar a internet. A prévia salva o progresso em uma chave própria no armazenamento local do navegador, quando permitido.

## Como integrar no repositório (nenhum arquivo atual deve ser apagado)

Estas instruções devem ser executadas em **um checkout do repositório de destino**, em uma branch nova com permissões de escrita. Os diretórios deste pacote contêm *novos* caminhos e devem ser mesclados aos diretórios correspondentes no checkout, preservando os arquivos já existentes.

```bash
# No checkout do rota-cloud, partindo da main atualizada:
git checkout main
git pull --ff-only
git checkout -b feat/aif-c01-complete-course

# Descompacte este pacote num diretório externo e mescle as novas pastas.
# Substitua /tmp/rota-cloud-aif pela localização em que você descompactou.
cp -R /tmp/rota-cloud-aif/content .
cp -R /tmp/rota-cloud-aif/data .
cp -R /tmp/rota-cloud-aif/docs .
cp -R /tmp/rota-cloud-aif/src .
cp -R /tmp/rota-cloud-aif/scripts .
cp -R /tmp/rota-cloud-aif/tests .

python3 scripts/apply_to_rota_cloud.py .
python3 scripts/extract_aif_study_data.py
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

> **Atenção ao copiar:** o script `apply_to_rota_cloud.py` valida âncoras de `registry.ts`, `App.tsx`, `Shell.tsx` e `CatalogPage.tsx`, antes de gravar. Se o upstream mudou e uma âncora não for encontrada, ele falha, em vez de aplicar uma substituição presumida. Revise o `git diff` em seguida. Não execute o script sobre uma cópia que você não pretende modificar.

O comando `npm ci` precisa de conectividade com o registro de pacotes ou cache local. O pacote **não inclui bibliotecas de terceiros**, lockfile nem fontes tipográficas.

**Atenção:** a revisão React não foi executada no checkout real porque esta sessão tinha acesso de **leitura** ao GitHub e o clone pela rede não estava disponível. Os componentes TSX passaram por checagem sintática do compilador TypeScript instalado. O script de integração passou num teste idempotente de âncoras usando um repositório sintético; **typecheck completo, lint, Vitest e build devem rodar na branch real antes do merge**. Não confundir validação estrutural com CI aprovado.

## Regeneração de conteúdo e dados

O arquivo Markdown é a fonte canônica. Os JSONs acompanham a apostila por SHA-256. Ao editar conteúdos de capítulos, execute:

```bash
python3 scripts/extract_aif_study_data.py
```

Ao alterar as questões ou flashcards, edite `scripts/build_aif_bank.py` e depois rode:

```bash
python3 scripts/build_aif_bank.py
python3 scripts/extract_aif_study_data.py
```

O gerador de banco atualiza apenas os capítulos 27/28, preservando os demais. `scripts/enrich_aif_chapters.py` mantém complementos editoriais dos capítulos de maior peso e é idempotente. Para atualizar a prévia offline (ambiente com Python, mistune 3 e Graphviz), execute `python3 scripts/build_offline_preview.py`.

## Abrir PR

Depois de conferir a branch e executar os testes:

```bash
git status
git diff --check
git add content/Apostila_AWS_AI_Practitioner_AIF-C01_Completa.md data/CURRICULO_AIF-C01.json data/QUESTOES_AIF-C01_80.json data/FLASHCARDS_AIF-C01_120.json docs/AIF-C01-*.md src/courses/aif scripts/*aif*.py scripts/apply_to_rota_cloud.py scripts/build_offline_preview.py tests/aif-integrity.test.ts src/App.tsx src/courses/registry.ts src/components/layout/Shell.tsx src/pages/CatalogPage.tsx
git commit -m "feat: add complete AWS AI Practitioner AIF-C01 course"
git push -u origin feat/aif-c01-complete-course
gh pr create --draft --base main --title "feat: curso completo AIF-C01 no Rota Cloud" --body-file docs/AIF-C01-PR.md
```

Faça merge apenas depois de **CI e revisão de conteúdo, usabilidade e acessibilidade**. Verifique links internos do HashRouter, simulados, fluxo de teclado, comportamento em mobile, contraste e armazenamento local.

## Licenciamento e autoria

Material independente escrito para este curso. No repositório de destino, respeitar o licenciamento já adotado: código MIT e conteúdo de estudo CC BY-NC-SA 4.0, conforme `LICENSE` e `LICENSE-CONTENT.md`. Não inclui imagens pagas, slides de terceiros, modelos proprietários nem questões oficiais copiadas.

## Referências AWS

- https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html
- https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html
- https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-in-scope-services.html
- https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-out-of-scope-services.html

As fontes completas por domínio estão em `docs/AIF-C01-MAPA-OFICIAL.md` e no capítulo 30.
