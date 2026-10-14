window.QUIZ_CONFIG = {
  id: "velozes-e-furiosos",
  titulo: "Quiz Velozes e Furiosos",
  subtitulo: "Perguntas sobre a saga de Dom, Brian e a família",
  heroTitulo: 'Você aguenta <span>um quarto de milha</span> de conhecimento?',
  heroTexto: "Dez perguntas por partida sobre os filmes, os carros e a família mais barulhenta do cinema. Pé embaixo, a largada é agora!",
  niveis: {
    normal:     { nome: "Normal",     tempo: 20, mult: 1,   desc: "Personagens, carros icônicos, cidades e bordões. Largada tranquila." },
    dificil:    { nome: "Difícil",    tempo: 15, mult: 1.5, desc: "Elenco, diretores, ordem dos filmes, cenas famosas e quem é parente de quem." },
    impossivel: { nome: "Impossível", tempo: 10, mult: 2,   desc: "Anos, modelos exatos de carros, bastidores e trilha sonora. Só para quem vive a quarto de milha." }
  },
  acertos: [
    "Família!",
    "Nitro no talo!",
    "Pé embaixo!",
    "Quarto de milha na frente!",
    "Isso é ser da família!"
  ],
  erros: [
    "Motor fundiu!",
    "Perdeu a largada!",
    "Bateu no muro!"
  ],
  tempoEsgotado: "O tempo acabou! A largada passou.",
  resultados: {
    derrota: "Acabaram as vidas. Volte para a oficina e tente de novo: a família espera você!",
    perfeito: "Gabarito! Vivo a vida a um quarto de milha por vez, e você venceu todas. Dom ficaria orgulhoso!",
    otimo: "Que corrida! Você é da família, só faltou um pouco de nitro para o gabarito.",
    bom: "Boa largada! Dá para chegar à linha de chegada, mas ainda há curvas para treinar.",
    raspando: "Você cruzou a linha de chegada raspando. Revise os filmes e volte para o racha!"
  },
  nota: "Quiz de fãs, sem vínculo oficial com a Universal Pictures. Cenas dos filmes: Fast & Furious Wiki (Fandom).",
  tema: {
    fontes: {
      display: "'Russo One', Impact, 'Arial Black', sans-serif",
      corpo: "'Rajdhani', 'Barlow', system-ui, -apple-system, 'Segoe UI', sans-serif",
      googleFonts: "https://fonts.googleapis.com/css2?family=Russo+One&family=Rajdhani:wght@500;600;700&display=swap"
    },
    cores: {
      parede: "#12141f", parede2: "#07080e",
      tv: "#2d3140", tv2: "#181b27",
      tela: "#06080f",
      destaque: "#ff7a1a",
      alerta: "#ff4259",
      acerto: "#35d0ff",
      papel: "#f4f1ea",
      suave: "#9fabc9",
      nivel1: "#35d0ff", nivel2: "#ff7a1a", nivel3: "#ff4259"
    }
  }
};
