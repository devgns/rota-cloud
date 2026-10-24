# feat: Curso completo AWS Certified AI Practitioner (AIF-C01)

## Motivação

Adicionar o segundo curso ao Rota Cloud com base no guia oficial AWS **AIF-C01 v1.1**, mantendo a proposta pedagógica de leitura integral, decisões explicadas, figuras, prática, revisão e progresso local.

## Conteúdo

- 30 capítulos originais de estudo, com mapeamento de 5 domínios, 14 tarefas e subobjetivos.
- 15 diagramas Mermaid, visualização SVG no leitor, comparadores interativos.
- 80 questões comentadas (16/19/23/11/11 por domínio); 120 flashcards.
- Guias de cobertura, currículo com hash de integridade e fontes AWS.
- Estudos de caso, laboratório opcional, plano de quatro semanas, matriz de decisões.

## Implementação

- Rota dedicada `#/cursos/aif-c01/...` e item do catálogo atualizado.
- Corpus, exercícios e progresso **isolados** do CLF-C02 (`aif-c01-study-progress:v1`).
- Leitura, trilhas, quiz, simulado autoral, flashcards, glossário, busca e painel de progresso.
- Integração da busca global por rota AIF-C01 e correção da contagem de progresso do catálogo por curso.
- Mantido o curso CLF-C02 e suas rotas legadas.

## Validação realizada no pacote

- [x] Guia AWS v1.1 e lista de serviços em escopo pesquisados em documentação oficial.
- [x] 30 capítulos em sequência e 354 seções estruturadas.
- [x] 80 questões únicas e 120 cartões distintos, com IDs únicos.
- [x] Distribuição por domínio conferida (16/19/23/11/11).
- [x] SHA-256 da apostila gerado e mapeamento de conteúdo consistente.
- [x] Arquivos TSX sem erro sintático no transpiler TypeScript disponível.
- [x] Script de integração testado com reaplicação em repositório sintético.
- [ ] Typecheck completo no checkout real.
- [ ] Lint, testes e build Vite no checkout real.
- [ ] Verificação visual e de acessibilidade da versão React em navegador.

## Checklist antes do merge

- [ ] `npm ci && npm run typecheck && npm run lint && npm test && npm run build`
- [ ] AIF-C01 e CLF-C02 navegáveis sem contaminação do progresso ou da busca.
- [ ] Diagramas responsivos, texto alternativo e controles por teclado.
- [ ] Simulado e flashcards em telas desktop/tablet/mobile.
- [ ] Conferência editorial de nomes de serviços e preços mutáveis.
- [ ] Revisão de acessibilidade e eventual refinamento do temporizador.

**Limites explícitos:** o banco de exercícios é autoral e de escolha única; o exame oficial também possui múltipla resposta, ordenação e associação. O simulado não fornece nota certificadora. Os laboratórios AWS são opcionais e podem gerar custos.
