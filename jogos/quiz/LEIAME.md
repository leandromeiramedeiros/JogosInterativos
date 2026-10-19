# Motor de quiz

`motor.js` e `motor.css` montam a página inteira de um quiz (TV antiga no centro, níveis, vidas, combo, ajudas, sons, tela final, recordes). Cada quiz só fornece **dados**. Nada de HTML ou CSS próprio.

## Como criar um quiz novo (id `meu-quiz`)

1. Crie a pasta `jogos/meu-quiz/` com quatro arquivos:
   - `config.js` define `window.QUIZ_CONFIG` (textos, níveis, tema).
   - `perguntas.js` define `window.QUIZ_PERGUNTAS` (15 perguntas por nível).
   - `imagens.js` define `window.QUIZ_IMAGENS` (cenas e créditos).
   - `img/` guarda as imagens (`.webp`, até 960 px de largura, ideal abaixo de 150 KB).
2. Crie `jogos/meu-quiz.html` copiando qualquer página de quiz existente (por exemplo `jogos/the-office.html`) e trocando o `<title>` e o id nos três caminhos `meu-quiz/…`. A ordem dos scripts importa: `config.js`, `perguntas.js`, `imagens.js`, `quiz/motor.js`.
3. Cadastre o jogo em `index.html` (lista de jogos) apontando para `jogos/meu-quiz.html`.

## `config.js`

```js
window.QUIZ_CONFIG = {
  id: "meu-quiz",                     // igual ao nome da pasta; também prefixa o localStorage
  titulo: "Meu Quiz",                 // logotipo e <title>
  subtitulo: "Perguntas sobre…",
  heroTitulo: 'Você sabe tudo sobre <span>isso</span>?',  // o <span> pega a cor de destaque
  heroTexto: "Dez perguntas por partida…",
  niveis: {                           // 1 a 3 níveis; a chave é a mesma usada em perguntas.js
    normal:     { nome: "Normal",     tempo: 20, mult: 1,   desc: "…" },
    dificil:    { nome: "Difícil",    tempo: 15, mult: 1.5, desc: "…" },
    impossivel: { nome: "Impossível", tempo: 10, mult: 2,   desc: "…" }
  },
  acertos: ["…"],                     // manchetes sorteadas a cada acerto
  erros: ["…"],                       // manchetes sorteadas a cada erro
  tempoEsgotado: "O tempo acabou!",
  resultados: { derrota: "…", perfeito: "…", otimo: "…", bom: "…", raspando: "…" },
  nota: "Texto do rodapé.",
  tema: {
    fontes: { display: "…", corpo: "…", googleFonts: "https://fonts.googleapis.com/css2?…" },
    cores: { parede, parede2, tv, tv2, tela, destaque, alerta, acerto, papel, suave, nivel1, nivel2, nivel3 }
  }
};
```

Cores em `#rgb` ou `#rrggbb`. O texto de cada cartão de nível, dos botões e do feedback é escolhido sozinho pelo contraste. Cores ou fontes que faltarem usam o padrão do Quiz da Vila.

## `perguntas.js`

```js
window.QUIZ_PERGUNTAS = {
  normal: [
    { cena: "id-da-cena",
      pergunta: "…?",
      certa: "…",
      erradas: ["…", "…", "…"],       // exatamente 3, plausíveis
      curiosidade: "…",               // aparece no feedback
      fonte: "https://…"              // opcional: vira um link no feedback ("Ver a fonte ↗", ou o texto de `rotuloFonte` no config.js)
    }
  ],
  dificil: [ … ], impossivel: [ … ]
};
```

Sorteiam-se 10 por partida; as sobras (use 15 por nível) servem para a ajuda "Pular". Um nível com menos de 10 perguntas usa as que houver; um nível sem perguntas aparece como "Em breve".

## `imagens.js`

```js
window.QUIZ_IMAGENS = {
  "id-da-cena": {
    arquivo: "img/id-da-cena.webp",   // relativo a jogos/meu-quiz/; null = só o painel temático
    legenda: "Rótulo curto",          // chip sobre a imagem (e texto do painel temático)
    alt: "Descrição para leitores de tela",
    autor: "…", licenca: "CC BY-SA 4.0", fonte: "https://…"   // crédito "Foto: autor · licença" com link
  }
};
```

Se `arquivo` for `null`, a cena não existir ou a imagem falhar ao carregar, o motor mostra um painel nas cores do tema com a legenda. O jogo nunca quebra. A imagem da próxima pergunta é pré-carregada. A tela inicial tem o botão "Créditos das imagens", que lista as cenas com arquivo usadas nas perguntas.

## Comportamento fixo (igual em todos os quizzes)

- 3 vidas, combo ×2 com 3 acertos seguidos e ×3 com 5.
- Pontos por acerto: `round((100 + segundosRestantes × 10) × mult do nível × combo)`, no máximo 50.000 por partida.
- Ajudas (1 de cada por partida): 50/50, Pular (troca por pergunta inédita do mesmo nível) e +10s.
- Teclas 1 a 4 respondem; Enter avança.
- Recordes em `localStorage` (`quiz-<id>-best-<nivel>`) e som em `quiz-<id>-mute`. O Quiz da Vila mantém as chaves antigas `qv-best-<nivel>` e `qv-mute`.
- No fim da partida envia `parent.postMessage({tipo:"jogos:fim", pontos, nivel, modo}, "*")` para o placar da página de jogos. `modo` é o nome do nível, e cada nível tem seu pódio (veja `modos` no `index.html`). Ao começar a partida, avisa o nível com `{tipo:"jogos:modo", modo}` para o placar mostrar o pódio dele.
- Se `QUIZ_CONFIG`, `QUIZ_PERGUNTAS` ou `QUIZ_IMAGENS` não existirem, a TV mostra "Este quiz ainda está sendo preparado.".
- Textos vindos dos dados são sempre escapados (só `<span>` é aceito no `heroTitulo`).
