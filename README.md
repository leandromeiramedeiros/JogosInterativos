# Jogos Interativos

Uma prateleira de jogos para jogar no navegador.

**▶ Jogar: https://leandromeiramedeiros.github.io/JogosInterativos/**

| Jogo | Do que se trata |
| --- | --- |
| [Bandeiras do Mundo](https://leandromeiramedeiros.github.io/JogosInterativos/#bandeiras-do-mundo) | Veja a bandeira e digite o nome do país antes que o tempo acabe. 4 níveis, 10 rodadas. |
| [Quiz da Vila](https://leandromeiramedeiros.github.io/JogosInterativos/#quiz-da-vila) | Perguntas sobre o seriado Chaves. 3 níveis, 3 vidas, combos e ajudas. |

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

- `index.html` — a página com a grade de jogos. Cada jogo abre por cima da grade, e o endereço ganha `#id-do-jogo` para poder ser compartilhado.
- `jogos/` — um arquivo HTML autossuficiente por jogo. No fim da partida, o jogo avisa a página com `parent.postMessage({tipo: "jogos:fim", pontos, nivel}, "*")`.
- `placar-config.js` — endereço e chave pública do Supabase (vazio = placar só no navegador).
- `supabase/placar.sql` — criação da tabela do placar e das regras de acesso.
- `.github/workflows/pages.yml` — publica o site no GitHub Pages a cada push no branch padrão.

## Adicionar um jogo

1. Salve o HTML do jogo em `jogos/nome-do-jogo.html`.
2. Acrescente um item na lista `JOGOS` no fim do `index.html` (id, título, arquivo, resumo, tags e a arte do cartucho).
3. Para o jogo entrar no placar, chame `parent.postMessage({tipo: "jogos:fim", pontos: 1234, nivel: "Difícil"}, "*")` quando a partida terminar.

## Publicação

Na primeira vez, ative o Pages em **Settings → Pages → Build and deployment → Source: GitHub Actions**. Depois disso, todo push no branch padrão atualiza o site.
