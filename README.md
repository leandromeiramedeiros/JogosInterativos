# Jogos Interativos

Uma prateleira de jogos para jogar no navegador.

**▶ Jogar: https://leandromeiramedeiros.github.io/JogosInterativos/**

| Jogo | Do que se trata |
| --- | --- |
| [Bandeiras do Mundo](https://leandromeiramedeiros.github.io/JogosInterativos/#bandeiras-do-mundo) | Veja a bandeira e digite o nome do país antes que o tempo acabe. 4 níveis, 10 rodadas. |
| [Quiz da Vila](https://leandromeiramedeiros.github.io/JogosInterativos/#quiz-da-vila) | Perguntas sobre o seriado Chaves, com cenas da série. |
| [Quiz da Lei 14.133](https://leandromeiramedeiros.github.io/JogosInterativos/#licitacoes-14133) | Nova Lei de Licitações e Contratos, com o artigo de cada resposta. |
| [Quiz do SUAS](https://leandromeiramedeiros.github.io/JogosInterativos/#quiz-do-suas) | LOAS, CRAS, CREAS, BPC e o Sistema Único de Assistência Social. |
| [Quiz Velozes e Furiosos](https://leandromeiramedeiros.github.io/JogosInterativos/#velozes-e-furiosos) | Carros, rachas e a família Toretto, com cenas dos filmes. |
| [Quiz The Office](https://leandromeiramedeiros.github.io/JogosInterativos/#the-office) | Dunder Mifflin e Michael Scott, com cenas da série. |
| [Quiz Sertanejo Raiz](https://leandromeiramedeiros.github.io/JogosInterativos/#sertanejo-raiz) | Duplas, violeiros e modas de viola da música caipira. |
| [Palavras Cruzadas](https://leandromeiramedeiros.github.io/JogosInterativos/#palavras-cruzadas) | Uma cruzada nova por dia em 3 níveis (7, 10 e 14 palavras). Pontua pelo tempo e pelas ajudas usadas. |
| [Palpite](https://leandromeiramedeiros.github.io/JogosInterativos/#palpite) | Descubra a palavra do dia em 6 tentativas. 3 níveis: 4, 5 e 6 letras. |
| [Interligado](https://leandromeiramedeiros.github.io/JogosInterativos/#interligado) | Descubra as palavras escondidas num mapa de associações. 14 temas (Futebol, Natureza, Música, Animais, Comida, Praia, Escola, Corpo Humano, Espaço, Cidade, Casa, Tecnologia, Viagem e Fazenda) em 3 níveis. Arraste palavras e fios, sacuda o mapa e peça pistas. |

## Placar

No fim de cada partida aparece, ao lado do jogo, um campo para salvar a pontuação com um nome. A barra mostra os 10 melhores de cada jogo (1º com medalha de ouro e coroa de louros, 2º prata, 3º bronze), e o botão **Ver últimas 100 pontuações** lista os envios mais recentes. Quem entra no pódio ganha uma tela de comemoração com o troféu do seu lugar.

### Ligar o placar online (Supabase)

Sem configuração, cada jogador vê só as pontuações salvas no próprio navegador. Para um placar compartilhado:

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Em **SQL Editor → New query**, cole o conteúdo de [`supabase/placar.sql`](supabase/placar.sql) e clique em **Run**. Isso cria a tabela `placar` com regras que deixam qualquer visitante ler e enviar pontuações, mas não editar nem apagar.
3. Em **Project Settings → API**, copie a **Project URL** e a chave pública (**anon** ou **publishable**).
4. Cole as duas em [`placar-config.js`](placar-config.js) e faça push. Essas informações são públicas por natureza; nunca coloque ali a chave `service_role`/`secret`.

As pontuações são enviadas pelo navegador, então alguém mal-intencionado poderia forjar uma. A tabela limita nome (até 20 caracteres) e pontos (até 50.000), e você pode apagar registros pelo painel do Supabase em **Table Editor → placar**.

## Estrutura

- `index.html`, `hub.css`, `hub.js` — a página com a grade de jogos. Cada jogo abre por cima da grade, e o endereço ganha `#id-do-jogo` para poder ser compartilhado.
- `jogos/` — um HTML por jogo. Os quizzes usam o motor em `jogos/quiz/` (veja `jogos/quiz/LEIAME.md`) e guardam perguntas, imagens e tema em `jogos/<id>/`. No fim da partida, o jogo avisa a página com `parent.postMessage({tipo: "jogos:fim", pontos, nivel}, "*")`.
- `jogos/palavras-cruzadas/pistas.js` e `jogos/palpite/palavras.js` — palavras dos dois jogos diários. O jogo do dia sai da data no próprio navegador (sem servidor nem agendamento): a mesma data dá o mesmo jogo para todo mundo, e o Nº 1 é 15/10/2026. No Palpite, acrescente palavras no fim de `respostas` para não trocar as palavras de dias já sorteados. Nas Palavras Cruzadas, qualquer mudança no banco de pistas redesenha as grades de todos os dias.
- `jogos/interligado/temas.js`, `temas-2.js` e `pistas.js` — os mapas do Interligado (a primeira palavra das ligações é a do tema) e a pista de cada palavra. Os temas de `temas-2.js` trazem as pistas dentro do próprio tema. Toda palavra nova nos mapas precisa de uma pista.
- `placar-config.js` — endereço e chave pública do Supabase (vazio = placar só no navegador).
- `supabase/placar.sql` — criação da tabela do placar e das regras de acesso.
- `.github/workflows/pages.yml` — publica o site no GitHub Pages a cada push no branch padrão.

## Adicionar um jogo

1. Salve o HTML do jogo em `jogos/nome-do-jogo.html`.
2. Acrescente um item na lista `JOGOS` no fim do `index.html` (id, título, arquivo, resumo, tags e a arte do cartucho).
3. Para o jogo entrar no placar, chame `parent.postMessage({tipo: "jogos:fim", pontos: 1234, nivel: "Difícil"}, "*")` quando a partida terminar.

## Publicação

Na primeira vez, ative o Pages em **Settings → Pages → Build and deployment → Source: GitHub Actions**. Depois disso, todo push no branch padrão atualiza o site.
