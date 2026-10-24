# Rota Cloud — instruções para agentes

Plataforma estática de cursos de certificação AWS (React + TypeScript + Vite). Antes de qualquer tarefa, leia a skill `rota-cloud-dev`.

## Regras que valem sempre

- **Nunca leia `.env`** nem arquivos de segredo (inclusive por scripts que carreguem `.env`). `.env.example` pode.
- **Não faça commit nem push sem pedido explícito.**
- **A plataforma é uma só:** telas, menus, cartões e estilos são iguais entre cursos. Reutilize os componentes compartilhados de `src/components/`.
- Editou a apostila em `content/`? Rode o script de extração do curso (veja `rota-cloud-dev`).
- Antes de entregar: `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e`.

## Skills do projeto

A **fonte única** de cada skill é `skills/<nome>/SKILL.md`. Os arquivos em `.claude/skills/` (Claude Code) e `.agents/skills/` (Codex e Cursor) são só ponteiros com o mesmo nome e descrição. Para criar ou alterar uma skill, edite `skills/<nome>/SKILL.md` e atualize os ponteiros (o teste `tests/skills.test.ts` confere a sincronia).

| Skill | Quando usar | Arquivo |
|---|---|---|
| `didactic-track` | Montar ou revisar um curso do Rota Cloud no padrão didático linear e progressivo (trilha por dependência de conceitos, capítulos com caso → conceito → contraste → serviço → risco → validação → pegadinha, recuperação ativa, visual por capítulo, síntese e prática no fim). Use ao planejar um curso novo, escrever ou reorganizar capítulos, ou avaliar se um material ensina na ordem certa. | `skills/didactic-track/SKILL.md` |
| `exam-research` | Pesquisar e validar o conteúdo de uma prova de certificação (guia oficial, domínios, tarefas, serviços em escopo, nomes atuais de produtos) e redigir questões autorais para o Rota Cloud. Use ao iniciar um curso novo, atualizar um curso para nova versão do guia, revisar cobertura ou escrever/revisar questões e flashcards. | `skills/exam-research/SKILL.md` |
| `rota-cloud-dev` | Desenvolver na plataforma Rota Cloud (React + TypeScript + Vite, cursos de certificação AWS como CLF-C02 e AIF-C01). Use ao mexer em telas, leitor, prática, progresso, rotas, testes ou ao adicionar um curso novo; garante consistência entre cursos, regeneração de dados e verificação visual. | `skills/rota-cloud-dev/SKILL.md` |
| `visual-elements` | Criar diagramas e elementos visuais interativos (simuladores, fluxos animados, quizzes de cenário, comparadores, flashcards) para os capítulos dos cursos do Rota Cloud. Use quando um capítulo, seção ou tela precisar de figura, ou quando um visual existente estiver difícil de ler. | `skills/visual-elements/SKILL.md` |
