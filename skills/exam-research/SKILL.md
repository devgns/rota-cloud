---
name: exam-research
description: Pesquisar e validar o conteúdo de uma prova de certificação (guia oficial, domínios, tarefas, serviços em escopo, nomes atuais de produtos) e redigir questões autorais para o Rota Cloud. Use ao iniciar um curso novo, atualizar um curso para nova versão do guia, revisar cobertura ou escrever/revisar questões e flashcards.
---

# Pesquisa de conteúdo de prova

Objetivo: o curso cobre **tudo o que o guia oficial pede**, com nomes atuais, sem afirmar o que não foi verificado e sem copiar material de terceiros.

Relacionadas: `didactic-track` (como transformar a pesquisa em trilha) e `rota-cloud-dev` (onde os dados entram no código).

## Fontes, em ordem de autoridade

1. **Guia oficial do exame** (AWS Certification → exam guide do código, ex.: AIF-C01, CLF-C02). Registre **versão e data** do guia.
2. **Domínios, pesos e task statements** do guia (cada domínio tem página própria).
3. **Serviços em escopo e fora de escopo** (páginas `*-in-scope-services` e `*-out-of-scope-services`).
4. **Histórico de revisões do guia** — mostra o que entrou ou saiu (foi assim que surgiram Amazon Q, Kiro, AgentCore no AIF 1.1).
5. **Documentação oficial de cada serviço** (`docs.aws.amazon.com`) para definir função e limites.
6. Blogs e posts de terceiros só como pista; **confirme na fonte oficial** antes de escrever.

## Como pesquisar

- Use busca na web com a data atual em mente; nomes de produtos mudam (ex.: QuickSight → Amazon Quick; Q Business migrando para o Quick). Se a documentação diverge do guia, **ensine o nome do guia** e explique a mudança com data.
- Para cada serviço em escopo: “qual necessidade ele resolve?”, “com o que a prova o confunde?”, “o que ele **não** faz?”.
- Para cada task statement: quais conceitos, contrastes e serviços ele exige; em que capítulo será ensinado.
- **Nunca fixe** preços, cotas, limites numéricos ou disponibilidade por Região. Use números hipotéticos rotulados como tais.
- Cite as fontes consultadas (URL) no documento de pesquisa.

## Onde registrar

- `docs/<EXAME>-MAPA-OFICIAL.md` — versão do guia, domínios/pesos, task statements e o capítulo que cobre cada um.
- Matriz de cobertura no último capítulo da apostila (tabela `| tarefa | tema | capítulos |`; o teste de integridade confere as 14 tarefas no AIF).
- `docs/<EXAME>-REVISAO-CONTEUDO.md` — achados de revisão no formato abaixo e, ao resolver, uma seção “Resolução” com data.

### Formato de achado

```
### N. Título curto
Severidade: alta | média | baixa (e se bloqueia a meta)
Evidência: citação do guia + trecho/arquivo do curso (com caminho)
Correção: o que mudar, onde, e como verificar
```

## Questões autorais

- **Nunca** copiar dumps, questões oficiais ou de cursos pagos. Cenários originais, com contexto de negócio.
- Proporção por domínio segue os pesos do guia (ex.: AIF 80 questões = 16/19/23/11/11; simulado de 65 com cotas 13/16/18/9/9).
- Os **quatro formatos** do guia, com o schema de `src/courses/aif/items.ts`:
  - `single` — `choices` (4 textos) + `correct` (letra);
  - `multiple_response` — `choices[{id,text}]`, `number_to_select`, `correct[]`;
  - `ordering` — `steps[{id,text}]` (embaralhados) + `correct_order[]`;
  - `matching` — `left[]`, `right[]` (embaralhado) + `correct_matches{left→right}`.
  Todos com `id`, `domain`, `task`, `prompt`, `explanation`. Correção **sem crédito parcial**; em branco = erro.
- Distratores **plausíveis** (o serviço vizinho, a técnica quase certa), nunca absurdos (“cor do botão”).
- A explicação diz por que a certa é certa **e** por que a tentadora está errada.
- Cada questão aponta para um conceito ensinado num capítulo anterior; nada de cobrar o que o curso não ensinou.
- Flashcards: frente curta (termo ou contraste), verso com definição + pista de prova; ids sequenciais (`<EXAME>-F001`).

## Checklist

- [ ] Versão e data do guia registradas; todas as tarefas mapeadas para capítulos.
- [ ] Todos os serviços em escopo aparecem no catálogo do curso (e os fora de escopo são sinalizados).
- [ ] Nomes de produtos conferidos na documentação atual, com data.
- [ ] Nenhum preço/cota fixo; números hipotéticos rotulados.
- [ ] Banco na proporção dos pesos, nos quatro formatos, com explicações; testes de integridade atualizados.
