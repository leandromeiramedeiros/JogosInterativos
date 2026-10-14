window.QUIZ_CONFIG = {
  id: "sertanejo-raiz",
  titulo: "Quiz Sertanejo Raiz",
  subtitulo: "Perguntas sobre a música caipira e a moda de viola",
  heroTitulo: 'Você é caipira de <span>raiz</span> ou só de fim de semana?',
  heroTexto: "Dez perguntas por partida sobre duplas, violas, modas e causos da música caipira. Ajeita o chapéu, afina a viola e bora pra roça!",
  niveis: {
    normal:     { nome: "Normal",     tempo: 20, mult: 1,   desc: "Os clássicos que todo mundo canta na beira do fogão." },
    dificil:    { nome: "Difícil",    tempo: 15, mult: 1.5, desc: "Compositores, ritmos e datas. Aqui se separa o violeiro do ouvinte." },
    impossivel: { nome: "Impossível", tempo: 10, mult: 2,   desc: "Afinações, gravações pioneiras e parcerias. Só pra doutor em viola." }
  },
  acertos: ["Uai, sô! Acertou!", "É isso aí, violeiro!", "Mandou bem, patrão!", "Tá afinado, cumpadre!"],
  erros: ["Eita, desafinou!", "Xi, errou a moda!", "Foi pra porteira errada!"],
  tempoEsgotado: "O galo cantou, acabou o tempo!",
  resultados: {
    derrota: "Acabou a lenha do fogão! Mas a prosa continua: tenta de novo, cumpadre.",
    perfeito: "Cem por cento! Pode tirar o chapéu: você é doutor em viola!",
    otimo: "Que beleza! Você merece um café coado e um pedaço de bolo de fubá.",
    bom: "Tá no caminho certo! Mais um causo e você vira violeiro de respeito.",
    raspando: "Passou raspando, mas passou! Bota mais lenha no fogão e volta pra prosear."
  },
  nota: "Quiz de fãs, sem vínculo oficial. Fotos: Wikimedia Commons.",
  tema: {
    fontes: {
      display: "'Alfa Slab One', Rockwell, 'Arial Black', Impact, serif",
      corpo: "'Nunito', system-ui, -apple-system, 'Segoe UI', sans-serif",
      googleFonts: "https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Nunito:wght@500;700;800&display=swap"
    },
    cores: {
      parede: "#5b2514", parede2: "#33150c",
      tv: "#8a5326", tv2: "#4f2e12",
      tela: "#1d1110",
      destaque: "#f6b93b",
      alerta: "#ee6a45",
      acerto: "#9bd96f",
      papel: "#fff0d4",
      suave: "#dcbb9b",
      nivel1: "#9bd96f", nivel2: "#f6b93b", nivel3: "#ee6a45"
    }
  }
};
