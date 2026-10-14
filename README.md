# Jogos Interativos

Uma prateleira de jogos para jogar no navegador.

**▶ Jogar: https://leandromeiramedeiros.github.io/JogosInterativos/**

| Jogo | Do que se trata |
| --- | --- |
| [Bandeiras do Mundo](https://leandromeiramedeiros.github.io/JogosInterativos/#bandeiras-do-mundo) | Veja a bandeira e digite o nome do país antes que o tempo acabe. 4 níveis, 10 rodadas. |
| [Quiz da Vila](https://leandromeiramedeiros.github.io/JogosInterativos/#quiz-da-vila) | Perguntas sobre o seriado Chaves. 3 níveis, 3 vidas, combos e ajudas. |

## Estrutura

- `index.html` — a página com a grade de jogos. Cada jogo abre por cima da grade, e o endereço ganha `#id-do-jogo` para poder ser compartilhado.
- `jogos/` — um arquivo HTML autossuficiente por jogo.
- `.github/workflows/pages.yml` — publica o site no GitHub Pages a cada push no branch padrão.

## Adicionar um jogo

1. Salve o HTML do jogo em `jogos/nome-do-jogo.html`.
2. Acrescente um item na lista `JOGOS` no fim do `index.html` (id, título, arquivo, resumo, tags e a arte do cartucho).

## Publicação

Na primeira vez, ative o Pages em **Settings → Pages → Build and deployment → Source: GitHub Actions**. Depois disso, todo push no branch padrão atualiza o site.
