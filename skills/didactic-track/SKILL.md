---
name: didactic-track
description: Montar ou revisar um curso do Rota Cloud no padrão didático linear e progressivo (trilha por dependência de conceitos, capítulos com caso → conceito → contraste → serviço → risco → validação → pegadinha, recuperação ativa, visual por capítulo, síntese e prática no fim). Use ao planejar um curso novo, escrever ou reorganizar capítulos, ou avaliar se um material ensina na ordem certa.
---

# Trilha didática linear e progressiva

O curso ensina os **porquês** na ordem em que o conhecimento depende de si mesmo — não na ordem dos domínios do guia. Quem lê do capítulo 1 ao último deve conseguir justificar cada decisão da prova.

Relacionadas: `exam-research` (o que precisa ser coberto), `visual-elements` (um visual por capítulo), `rota-cloud-dev` (como os dados entram no app). Referências reais: `docs/AIF-C01-TRILHA-DIDATICA.md` e as apostilas em `content/`.

## 1. Desenhe a trilha por dependência

1. Liste os conceitos que o guia exige (da skill `exam-research`).
2. Para cada conceito, pergunte “o que preciso saber antes?” e ordene por essas dependências.
3. Agrupe em **módulos de 1 a 7 capítulos**, do problema ao detalhe:
   `começar → fundamentos → como funciona → construir/aplicar → riscos e responsabilidade → proteção e governança → síntese e revisão`.
4. **Não antecipe:** não use um termo antes do capítulo que o ensina (ex.: não falar de RAG antes de chunk/embedding; nem de AgentCore antes de agentes e MCP; nem de ROUGE antes de avaliação). Quando inevitável, uma frase de definição e um link para o capítulo.
5. Registre a trilha em `docs/<EXAME>-TRILHA-DIDATICA.md` (módulo, capítulos, dependência, entrega de aprendizagem) e os módulos no script de extração (`MODS` em `scripts/extract_aif_study_data.py`).

## 2. Molde de cada capítulo

```markdown
# N. Título que nomeia o tema

> **Nomes completos nesta página:** sigla (**SIGLA**); …
**[ESSENCIAL — domínio X, tarefa X.Y]**        ← ou APROFUNDAMENTO / PRÁTICA / REFERÊNCIA

## N.1. Comece por um caso concreto
Problema de negócio real → por que importa.

## N.2. O conceito
Definição precisa, depois o mecanismo (como funciona por dentro, no nível da prova).

## N.3. O contraste que a prova cobra
Tabela “A × B: diferença decisiva / pista que elimina a errada”.

## N.4. Na AWS
Só agora o serviço: qual necessidade resolve, com o que é confundido, o que não faz.

## N.5. Custo, risco e como validar
Trade-offs, controles, métricas — números hipotéticos rotulados.

## N.6. Pegadinhas
Afirmações que soam certas e não são.

## N.7. Verifique se entendeu
- Pergunta que exige raciocínio? **Resposta:** resposta curta com o porquê.
- Pergunta aberta para pensar (sem resposta) também vale.
```

Regras do texto:
- Modelo mental repetido em todo tema: **problema → técnica → dados → serviço → custo/risco → validação → pegadinha**.
- Frases que ensinam decisão, não slogans; cada princípio vira critério verificável.
- Na seção de recuperação, use `**Resposta:**` — o leitor transforma em cartão “Mostrar resposta”.
- Mermaid só como reserva; o visual definitivo é um componente interativo (skill `visual-elements`), **um por capítulo no mínimo**.
- Ids de seção derivam do título (`cNN-slug`): renomear título exige atualizar registros de diagramas.

## 3. Capítulos de síntese (fim do curso)

Nesta ordem, depois de todo o conteúdo:
1. **Catálogo de serviços em escopo**, agrupado pela pergunta que cada serviço resolve, mais os fora de escopo.
2. **Estudo de caso de ponta a ponta**, com arquitetura, escolhas por fase e falhas simuladas.
3. **Comparativos decisivos e armadilhas** (tabela de pares A × B e “se o enunciado disser X → pense Y”).
4. **Simulado comentado** — 80 questões de escolha única na proporção dos pesos, respondíveis na página, mais itens nos outros formatos (múltipla resposta, ordenação, associação) na prática.
5. **Flashcards** — 120+ cartões, revisão espaçada 1/3/7 dias.
6. **Laboratórios, cronograma e prontidão** — exercícios sem conta, laboratório opcional com aviso de custo, plano de 4 semanas, critérios que não prometem aprovação.
7. **Matriz de cobertura e fontes oficiais** — cada tarefa do guia → capítulos.

## 4. Do texto ao app

1. Apostila em `content/Apostila_<...>_Completa.md` (fonte canônica, `# N.` por capítulo, `## N.M.` por seção).
2. Questões e flashcards em `data/*.json`, com ids citados na apostila.
3. Rodar o script de extração (currículo + SHA) e os testes de integridade.
4. Registrar os visuais e conferir com screenshots (skill `rota-cloud-dev`).

## Checklist de revisão didática

- [ ] Nenhum capítulo usa conceito que só será ensinado depois.
- [ ] Todo capítulo abre com caso concreto e fecha com “Verifique se entendeu”.
- [ ] Todo capítulo tem contraste explícito e pelo menos um visual interativo.
- [ ] Toda tarefa do guia aparece na matriz de cobertura com capítulos que realmente a ensinam.
- [ ] Questões e flashcards só cobram o que foi ensinado; proporção por domínio confere.
- [ ] Síntese no fim, na ordem acima; prática com os quatro formatos.
