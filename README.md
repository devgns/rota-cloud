# Rota Cloud

Plataforma de estudos para certificações AWS, uma camada de cada vez. O primeiro curso é a **AWS Certified Cloud Practitioner (CLF-C02)**: leitura da apostila, 80 questões comentadas, simulados e 132 flashcards. O progresso fica no navegador.

Os próximos cursos (AI Practitioner, Solutions Architect, Developer) já aparecem no catálogo como "em breve".

Material independente de preparação; não afiliado nem endossado pela AWS.

## Requisitos

Node.js 22+ e npm. Python 3 só se você for regenerar os JSON depois de editar a apostila.

## Comandos

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

O dev server sobe em `http://127.0.0.1:5173`. As rotas usam hash (`/#/cursos/clf-c02/trilhas`); endereços antigos como `/#/trilhas` redirecionam para o CLF-C02, então o mesmo build abre no GitHub Pages.

## Atualizar a apostila

Edite `content/Apostila_AWS_Cloud_Practitioner_CLF-C02_Completa.md` e rode:

```bash
python3 scripts/extract_study_data.py
```

O script regrava os três JSON em `data/` e imprime as contagens. O site recusa abrir se o SHA-256 do Markdown deixar de bater com `metadata.sha256`.

## Publicação

O site está em **https://devgns.github.io/rota-cloud/**.

A cada push na `main`, o workflow `.github/workflows/deploy.yml` roda lint, testes e build (com `BASE_PATH=/rota-cloud/`) e publica `dist/` no GitHub Pages. Também dá para disparar manualmente em Actions → "Deploy no GitHub Pages" → Run workflow. O `HashRouter` dispensa `404.html`.

## O que fica salvo

Chave `localStorage`: `clf-c02-study-progress:v1`.

- seções e capítulos marcados como concluídos
- última rota, seção e rolagem
- favoritos
- tentativas de questões e simulados finalizados
- simulado ou treino em andamento
- agenda dos flashcards
- tema, tamanho de fonte e segundos de estudo com a aba visível

Em Progresso dá para exportar, fundir, substituir ou apagar. Nada disso sai do navegador.

## Licença

- **Código** (o site): [MIT](LICENSE).
- **Conteúdo de estudo** (apostila, questões, flashcards e textos dos diagramas): [CC BY-NC-SA 4.0](LICENSE-CONTENT.md). Use, compartilhe e adapte com crédito, sem fins comerciais e mantendo a mesma licença.

---

Feito com ♥ por [@devgns](https://github.com/devgns).
