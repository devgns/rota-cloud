# Entrega AIF-C01 — 24/10/2026

## Origem e instalação

O diretório solicitado `/home/gustavo/cfl-c02` continha apenas `.vite/`. A base de código completa e sem alterações locais estava em `/home/gustavo/rota-cloud`. A entrega usa uma cópia dessa base e incorpora o pacote `rota-cloud-AIF-C01-material-para-Claude-v2.zip` fornecido pelo usuário.

## Curso

30 capítulos, organizados em sete etapas: orientação; fundamentos de IA/ML; IA generativa; aplicações com modelos de base; IA responsável; segurança e governança; síntese e revisão. A interface preserva fontes, cores e navegação do curso existente. Inclui 15 diagramas, comparadores interativos, busca, glossário, 80 questões comentadas, simulado de 65 questões e 120 flashcards.

Os cinco domínios, pesos e a revisão 1.1 de 30/04/2026 foram conferidos no [guia oficial](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html) e no [histórico de revisões](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html). O material incorpora engenharia de contexto, agentes, MCP e serviços recentes citados na revisão. Esta conferência de escopo não representa endosso da AWS nem auditoria exaustiva de cada afirmação do texto.

## Correções de integração

- Rotas explícitas impedem que rotas profundas AIF-C01 sejam resolvidas pelo leitor CLF-C02.
- Busca e atalho do cabeçalho abrem o conteúdo AIF-C01; progresso e contador do CLF-C02 permanecem separados.
- Fluxos com retorno mantêm as conexões sem colapsar etapas na mesma coluna.
- Busca ignora acentos; glossário disponibiliza os 120 conceitos sem corte silencioso em 80.
- Página de progresso explica o armazenamento em linguagem de estudo.

## Como abrir

```bash
cd /home/gustavo/cfl-c02
npm run dev
```

Abra o endereço exibido pelo Vite e escolha AI Practitioner, ou acrescente `/#/cursos/aif-c01` ao endereço.

## Limites conhecidos

O simulado é didático, de escolha única; o percentual não equivale à nota escalonada AWS. Os 24 exercícios complementares de outros formatos permanecem como arquivos adicionais, fora da interface. O progresso é local ao navegador e sessões de prática não finalizadas não são restauradas após recarregar. Nenhuma publicação remota faz parte desta entrega. O build inclui ambas as apostilas e emite aviso de tamanho de bundle (aproximadamente 443 kB gzip).

O arquivo `AIF-C01-VERIFICACAO.md` veio do ZIP e registra a verificação anterior. Para os resultados desta integração, consulte abaixo.

## Validação concluída

- `npm run typecheck`: passou (também executado pelo build).
- `npm run lint`: passou, sem warnings.
- `npm test`: 19 testes passaram.
- `npm run build`: passou; apenas aviso de tamanho de bundle.
- `npm run test:e2e`: 26 testes passaram, dois testes existentes de menu lateral foram ignorados no mobile por serem exclusivos de desktop.
- Os testes AIF cobrem catálogo, leitura dos 30 capítulos nas duas larguras, ausência de overflow horizontal da página, interação com diagrama, persistência de capítulo concluído, treino, finalização de simulado, flashcards e busca no cabeçalho. Screenshots da página inicial e de um diagrama foram inspecionados.

As alterações permanecem locais, sem commit ou push. O repositório original `/home/gustavo/rota-cloud` foi preservado.
