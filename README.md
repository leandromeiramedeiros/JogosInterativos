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
| [Estilingue](https://leandromeiramedeiros.github.io/JogosInterativos/#estilingue) | Estique o estilingue, mire e derrube as torres de madeira, pedra e vidro até não sobrar nenhum inimigo. |
| [Doce na Corda](https://leandromeiramedeiros.github.io/JogosInterativos/#doce-na-corda) | Corte as cordas na hora certa para o doce pegar as estrelas e cair na boca do sapinho. |
| [Arena de Briga](https://leandromeiramedeiros.github.io/JogosInterativos/#arena-de-briga) | Luta de plataforma para 2 jogadores no mesmo teclado ou com dois controles (ou contra a CPU). Jogue o rival para fora da arena. |
| [Kart Turbo](https://leandromeiramedeiros.github.io/JogosInterativos/#kart-turbo) | Corrida de kart vista de cima: derrape nas curvas, pegue turbos e mísseis e chegue em 1º em 3 pistas. |
| [Voa Voa](https://leandromeiramedeiros.github.io/JogosInterativos/#voa-voa) | Toque para o tucano Tuca bater as asas e passar entre os troncos. Um toque, recorde infinito. |
| [Tropa de Lata](https://leandromeiramedeiros.github.io/JogosInterativos/#tropa-de-lata) | Corra e atire contra o exército de robôs, liberte reféns, pegue armas pesadas e derrube chefes gigantes. |
| [Esquadrilha](https://leandromeiramedeiros.github.io/JogosInterativos/#esquadrilha) | Tiro vertical com aviões: desvie das rajadas, junte power-ups e derrube encouraçados e fortalezas. |
| [Empilha](https://leandromeiramedeiros.github.io/JogosInterativos/#empilha) | Um toque para soltar cada bloco. Acerte em cima do anterior e a torre sobe; erre e ela encolhe. |
| [Horda](https://leandromeiramedeiros.github.io/JogosInterativos/#horda) | Sobreviva 10 minutos contra hordas de monstros. As armas atiram sozinhas; você só escolhe as melhorias. |
| [Jogo da Forca](https://leandromeiramedeiros.github.io/JogosInterativos/#jogo-da-forca) | Descubra a palavra antes de completar o boneco. 3 níveis, de palavras curtas a compostas, com dicas e sequência perfeita. |
| [Caverna Eco](https://leandromeiramedeiros.github.io/JogosInterativos/#caverna-eco) | Explore uma caverna viva, ganhe pulo duplo, investida e garra de parede para abrir caminhos e vencer dois chefes. |
| [Masmorra Relâmpago](https://leandromeiramedeiros.github.io/JogosInterativos/#masmorra-relampago) | RPG de ação em masmorras aleatórias: classe, habilidades, equipamentos e chefes em 5 minutos. |
| [Operação Ômega](https://leandromeiramedeiros.github.io/JogosInterativos/#operacao-omega) | Tiro em primeira pessoa em 3D: segure um complexo militar por 6 ondas com pistola, fuzil, escopeta e granadas. |

## Controle

Todos os jogos aceitam controle (Xbox, PlayStation ou qualquer um no padrão do navegador). Na grade, o direcional escolhe o jogo e **A** abre; dentro do jogo, **Select + Start** juntos voltam para a grade. No fim da partida o controle passa para o placar: **A** no campo do nome abre um teclado na tela.

A parte comum fica em `jogos/controle.js` (instruções no começo do arquivo): mapear botões para as teclas que o jogo já usa, navegar por botões de menu, mover uma seta na tela nos jogos de tocar e arrastar, e o teclado na tela.

## Placar

No fim de cada partida aparece, ao lado do jogo, um campo para salvar a pontuação com um nome. A barra mostra os 10 melhores (1º com medalha de ouro e coroa de louros, 2º prata, 3º bronze), e o botão **Ver últimas 100 pontuações** lista os envios mais recentes. Quem entra no pódio ganha uma tela de comemoração com um troféu 3D do seu lugar (ouro, prata ou bronze) que chega girando e pousa com clarão e faíscas. O troféu usa o three.js e só é baixado quando a pontuação vai para o pódio; sem WebGL ou sem conexão com o CDN, aparece o troféu desenhado em SVG.

### Placar por modo

Jogos com níveis, pistas, temas ou classes têm um pódio para cada modo: no Bandeiras do Mundo, quem joga no Difícil não disputa com quem joga no Fácil, e no Interligado cada tema tem seu placar em cada nível. O placar acompanha o jogador: quando a partida começa, ele passa sozinho para o pódio do modo escolhido (o botão do modo pisca para avisar), e no fim abre no modo jogado. Os botões acima do pódio servem para espiar os outros modos. A linha de cada pontuação mostra o detalhe que o jogo mandou (Fase 3, Onda 2, Andar 4…), e o aviso de "Pontuação salva" diz quando é um novo recorde pessoal naquele modo.

| Jogo | Modos |
| --- | --- |
| Bandeiras do Mundo | Nível (Fácil, Normal, Difícil, Professor de Geografia) |
| Quizzes | Nível (Normal, Difícil, Impossível) |
| Palavras Cruzadas, Palpite, Jogo da Forca | Nível (Fácil, Médio, Difícil) |
| Interligado | Tema × Nível |
| Arena de Briga | CPU (Fácil, Médio, Difícil) |
| Kart Turbo | Pista |
| Masmorra Relâmpago | Classe |

Os modos ficam no item do jogo na lista `JOGOS` (campo `modos`). O jogo avisa o modo ao começar a partida com `parent.postMessage({tipo: "jogos:modo", modo}, "*")` e manda o mesmo `modo` no `jogos:fim`. Não é preciso mudar a tabela: o modo vai na coluna `jogo` (`interligado--praia-medio`). As pontuações de antes dos modos continuam valendo no modo que tinha o mesmo nome do nível (Difícil, Montanha Maluca…). As do Interligado não diziam o tema, então ficam no tema **Antes dos temas**, separadas por nível; partida nova não entra nele.

### Ligar o placar online (Supabase)

Sem configuração, cada jogador vê só as pontuações salvas no próprio navegador. Para um placar compartilhado:

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Em **SQL Editor → New query**, cole o conteúdo de [`supabase/placar.sql`](supabase/placar.sql) e clique em **Run**. Isso cria a tabela `placar` com regras que deixam qualquer visitante ler e enviar pontuações, mas não editar nem apagar.
3. Em **Project Settings → API**, copie a **Project URL** e a chave pública (**anon** ou **publishable**).
4. Cole as duas em [`placar-config.js`](placar-config.js) e faça push. Essas informações são públicas por natureza; nunca coloque ali a chave `service_role`/`secret`.

As pontuações são enviadas pelo navegador, então alguém mal-intencionado poderia forjar uma. A tabela limita nome (até 20 caracteres) e pontos (até 50.000), e você pode apagar registros pelo painel do Supabase em **Table Editor → placar**.

## Estrutura

- `index.html`, `hub.css`, `hub.js` — a página com a grade de jogos. Cada jogo abre por cima da grade, e o endereço ganha `#id-do-jogo` para poder ser compartilhado.
- `jogos/` — um HTML por jogo. Os quizzes usam o motor em `jogos/quiz/` (veja `jogos/quiz/LEIAME.md`) e guardam perguntas, imagens e tema em `jogos/<id>/`. No fim da partida, o jogo avisa a página com `parent.postMessage({tipo: "jogos:fim", pontos, nivel, modo}, "*")`.
- `jogos/palavras-cruzadas/pistas.js` e `jogos/palpite/palavras.js` — palavras dos dois jogos diários. O jogo do dia sai da data no próprio navegador (sem servidor nem agendamento): a mesma data dá o mesmo jogo para todo mundo, e o Nº 1 é 15/10/2026. No Palpite, acrescente palavras no fim de `respostas` para não trocar as palavras de dias já sorteados. Nas Palavras Cruzadas, qualquer mudança no banco de pistas redesenha as grades de todos os dias.
- `jogos/interligado/temas.js`, `temas-2.js` e `pistas.js` — os mapas do Interligado (a primeira palavra das ligações é a do tema) e a pista de cada palavra. Os temas de `temas-2.js` trazem as pistas dentro do próprio tema. Toda palavra nova nos mapas precisa de uma pista.
- `jogos/controle.js` — suporte a controle (Gamepad API) usado pela grade e pelos jogos.
- `trofeu3d.js` — o troféu 3D da comemoração do pódio.
- `placar-config.js` — endereço e chave pública do Supabase (vazio = placar só no navegador).
- `supabase/placar.sql` — criação da tabela do placar e das regras de acesso.
- `.github/workflows/pages.yml` — publica o site no GitHub Pages a cada push no branch padrão (sem a pasta `arquivados/`).
- `arquivados/` — jogos tirados da grade e do site, guardados só para desenvolvimento e sem manutenção: o HTML de cada um em `arquivados/jogos/`, os itens da lista e a arte dos cartuchos em `jogos-arquivados.js` e `arquivados.css`, e uma grade própria em `arquivados/index.html` (abra com um servidor local na raiz do repositório). Os jogos abrem soltos, sem placar; as pontuações antigas continuam no Supabase. Para reativar um, faça o caminho de volta: HTML para `jogos/` (com `src="controle.js?v=1"`), item para `JOGOS` e CSS para `hub.css`.

## Adicionar um jogo

1. Salve o HTML do jogo em `jogos/nome-do-jogo.html`.
2. Acrescente um item na lista `JOGOS` no fim do `index.html` (id, título, arquivo, resumo, tags e a arte do cartucho).
3. Para o jogo entrar no placar, chame `parent.postMessage({tipo: "jogos:fim", pontos: 1234, nivel: "Fase 3"}, "*")` quando a partida terminar. `nivel` é o detalhe que aparece na linha do placar.
4. Se o jogo tem níveis, pistas, temas ou outro jeito de jogar que muda a pontuação, declare os eixos em `modos` no item da lista (veja o comentário antes de `JOGOS`) e mande também `modo: "Difícil"` (ou `modo: ["Praia", "Médio"]` com mais de um eixo) no `jogos:fim`. Para o placar acompanhar a partida, avise o modo também quando ela começar: `parent.postMessage({tipo: "jogos:modo", modo: "Difícil"}, "*")`. Tema novo no Interligado: acrescente também em `modos` do Interligado.

## Publicação

Na primeira vez, ative o Pages em **Settings → Pages → Build and deployment → Source: GitHub Actions**. Depois disso, todo push no branch padrão atualiza o site.
