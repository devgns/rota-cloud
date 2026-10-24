# Skills do Rota Cloud

Cada pasta aqui é a **fonte única** de uma skill (`SKILL.md` com frontmatter `name` e `description`, mais arquivos auxiliares).

Ferramentas leem ponteiros que apontam para cá:

| Ferramenta | Onde procura | O que há lá |
|---|---|---|
| Claude Code | `.claude/skills/<nome>/SKILL.md` | ponteiro com mesmo `name`/`description` |
| Codex | `.agents/skills/<nome>/SKILL.md` | ponteiro com mesmo `name`/`description` |
| Cursor | `.agents/skills/` (e também `.claude/skills/`) | os mesmos ponteiros |
| Todos | `AGENTS.md` (Claude via `CLAUDE.md` → `@AGENTS.md`) | índice das skills e regras gerais |

## Criar ou alterar uma skill

1. Edite ou crie `skills/<nome>/SKILL.md` (frontmatter: `name` igual ao nome da pasta, `description` dizendo o que faz e quando usar).
2. Crie/atualize os ponteiros em `.claude/skills/<nome>/SKILL.md` e `.agents/skills/<nome>/SKILL.md` com o **mesmo** frontmatter e o corpo apontando para `skills/<nome>/SKILL.md`.
3. Adicione a linha na tabela de `AGENTS.md`.
4. `npm test` — `tests/skills.test.ts` falha se algo estiver dessincronizado.
