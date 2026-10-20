# Revisão de conteúdo

Data da conferência desta implementação: 16 de outubro de 2026.

## O que foi conferido em fonte oficial

- Well-Architected tem seis pilares, incluindo sustentabilidade: [The pillars of the framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html). A apostila já diz isso. A nota junto de `c04-4-1-os-seis-pilares` só impede que material antigo de cinco pilares seja reintroduzido.
- S3 passou a aceitar objetos de até 50 TB em 2 de dezembro de 2025: [anúncio AWS](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-s3-maximum-object-size-50-tb/). A apostila não afirma o limite antigo de 5 TB. A nota em `c13-13-1-amazon-s3-armazenamento-de-objetos` registra o anúncio sem alterar o capítulo.
- Free Tier, FAQ lida em 16/10/2026: [aws.amazon.com/free/free-tier-faqs](https://aws.amazon.com/free/free-tier-faqs/). Para clientes novos, a página descreve até US$ 200 em créditos e plano gratuito de até 6 meses ou até os créditos acabarem, além de ofertas Always Free. A expiração muda conforme o plano e a data da conta. A apostila já tem a seção 19.10; a nota aponta a FAQ e não substitui o texto.
- Planos de AWS Support, documentação relida em 16/10/2026: [AWS Support Plans](https://docs.aws.amazon.com/awssupport/latest/user/aws-support-plans.html). Basic, Business Support+, Enterprise Support e Unified Operations constam como planos atuais; Developer, Business e Enterprise On-Ramp permanecem documentados durante a transição para 2027. O capítulo 20 preserva essa distinção temporal.

## Revisão para publicação

- Exemplos vinculados a um contexto empresarial específico foram substituídos por cenários genéricos de educação, biblioteca, entregas e telemetria.
- Cada capítulo informa os nomes completos das siglas de serviços usadas na página. As telas independentes de trilhas, treino, resultados e flashcards também exibem essa referência.
- Os JSONs derivados foram regenerados após a revisão; o SHA-256 vigente está em `docs/CONTENT_MAP.md`.

## O que não foi reescrito

O Markdown da apostila permanece a fonte da leitura. Complementos editoriais viraram diagramas e notas rotuladas (`complemento`, `comparativo`, `nota de atualização`), fora do corpo original.

Perguntas `EXTRA-*` ficam só no leitor. Não entram nas 80 nem no simulado.

## Conteúdo sujeito a mudança

Planos de AWS Support seguem em transição em 2026–2027. Free Tier, preços, cotas e nomes de produtos também podem mudar. Na dúvida, os links oficiais do capítulo 26 prevalecem.

Não houve consulta ao PDF de terceiros. Nenhum slide, imagem ou trecho ExamPro entrou no site.
