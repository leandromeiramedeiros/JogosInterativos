window.QUIZ_CONFIG = {
  id: "quiz-da-vila",
  titulo: "Quiz da Vila",
  subtitulo: "Perguntas sobre o seriado Chaves",
  heroTitulo: 'Você conhece mesmo <span>a vila</span>?',
  heroTexto: "Dez perguntas por partida, sorteadas e embaralhadas a cada jogo. Responda rápido para ganhar mais pontos e emende acertos para multiplicar o placar.",
  niveis: {
    normal:     { nome: "Normal",     tempo: 20, mult: 1,   desc: "Personagens, bordões e a rotina da vila." },
    dificil:    { nome: "Difícil",    tempo: 15, mult: 1.5, desc: "Elenco, dublagem e detalhes da série." },
    impossivel: { nome: "Impossível", tempo: 10, mult: 2,   desc: "Só para quem sabe o sobrenome da Dona Florinda." }
  },
  acertos: ["Isso, isso, isso!", "Boa!", "Acertou!", "Mandou bem!"],
  erros: ["Ninguém tem paciência comigo!", "Tinha que ser...", "Errou!"],
  tempoEsgotado: "O tempo acabou!",
  resultados: {
    derrota: "Fim de jogo! Até o Senhor Barriga ficou com pena.",
    perfeito: "Perfeito! Você deveria morar na vila.",
    otimo: "Nível Professor Girafales: tá-tá-tá-tá!",
    bom: "Bom vizinho! Merece um sanduíche de presunto.",
    raspando: "Passou raspando, igual aluguel do Seu Madruga."
  },
  nota: "Quiz de fãs, sem vínculo oficial. As imagens são de divulgação e pertencem aos seus respectivos detentores.",
  tema: {
    fontes: {
      display: "'Bungee', Impact, 'Arial Black', sans-serif",
      corpo: "'Nunito', system-ui, -apple-system, 'Segoe UI', sans-serif",
      googleFonts: "https://fonts.googleapis.com/css2?family=Bungee&family=Nunito:wght@500;700;800&display=swap"
    },
    cores: {
      parede: "#123a3c", parede2: "#0c2a2b",
      tv: "#5a3a22", tv2: "#3f2816",
      tela: "#0f1d1c",
      destaque: "#f2b134",
      alerta: "#e4572e",
      acerto: "#5fd39b",
      papel: "#fdf3dc",
      suave: "#a8c4bf",
      nivel1: "#5fd39b", nivel2: "#f2b134", nivel3: "#e4572e"
    }
  }
};
