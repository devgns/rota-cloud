# CLF-C02 — plataforma de estudos

Leitura da apostila, 80 questões comentadas, simulados e 132 flashcards para a AWS Certified Cloud Practitioner. O progresso fica no navegador.

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

O dev server sobe em `http://127.0.0.1:5173`. As rotas usam hash (`/#/trilhas`), então o mesmo build abre no GitHub Pages.

## Atualizar a apostila

Edite `content/Apostila_AWS_Cloud_Practitioner_CLF-C02_Completa.md` e rode:

```bash
python3 scripts/extract_study_data.py
```

O script regrava os três JSON em `data/` e imprime as contagens. O site recusa abrir se o SHA-256 do Markdown deixar de bater com `metadata.sha256`.

## GitHub Pages, quando você autorizar

Não há deploy neste repositório por padrão. Quando for publicar:

1. `npm run build` gera `dist/`.
2. Para um site de projeto (`https://usuario.github.io/nome-do-repo/`), gere com a base dos assets:

```bash
BASE_PATH=/nome-do-repo/ npm run build
```

3. Publique o conteúdo de `dist/` no branch que o Pages usa, ou use uma GitHub Action que rode o build. O `HashRouter` não precisa de `404.html`.

`references-private/` e qualquer PDF de terceiro estão no `.gitignore`. Não os envie.

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
