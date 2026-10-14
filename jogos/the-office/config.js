window.QUIZ_CONFIG = {
  id: "the-office",
  titulo: "Quiz The Office",
  subtitulo: "Perguntas sobre a série americana",
  heroTitulo: 'Você sobreviveria a um dia na <span>Dunder Mifflin</span>?',
  heroTexto: "Dez perguntas por partida, sorteadas e embaralhadas a cada jogo. Responda rápido para ganhar mais pontos e emende acertos antes que o Michael marque uma reunião.",
  niveis: {
    normal:     { nome: "Normal",     tempo: 20, mult: 1,   desc: "Personagens, Scranton e as pegadinhas famosas." },
    dificil:    { nome: "Difícil",    tempo: 15, mult: 1.5, desc: "Episódios marcantes, cargos, empresas e a versão britânica." },
    impossivel: { nome: "Impossível", tempo: 10, mult: 2,   desc: "Só para quem nunca perdeu uma reunião de Michael Scott." }
  },
  acertos: ["Isso! Bom trabalho!", "Digno de um Dundie!", "Nota 10, Sr. Scott!", "Dwight aprovaria!"],
  erros: ["Nãããão! Deus, não!", "Isso é pior que um Toby.", "Errou. Foi mal."],
  tempoEsgotado: "O tempo acabou!",
  resultados: {
    derrota: "Fim de jogo! Você foi demitido da Dunder Mifflin.",
    perfeito: "Perfeito! Você é o Melhor Chefe do Mundo.",
    otimo: "Ótimo! Promoção a assistente do gerente regional.",
    bom: "Bom! Seu Dundie está a caminho.",
    raspando: "Passou raspando. Aguenta aí, Scranton."
  },
  nota: "Quiz de fãs, sem vínculo oficial com a série nem com a NBC. As imagens pertencem aos seus respectivos detentores.",
  tema: {
    fontes: {
      display: "'Special Elite', 'Courier New', Courier, monospace",
      corpo: "'IBM Plex Mono', 'Courier New', ui-monospace, Menlo, monospace",
      googleFonts: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Special+Elite&display=swap"
    },
    cores: {
      parede: "#3a3f4a", parede2: "#2c3039",
      tv: "#cfc5aa", tv2: "#9d9378",
      tela: "#0e1b2d",
      destaque: "#5eb3ff",
      alerta: "#ff7358",
      acerto: "#6fe0a0",
      papel: "#f6f2e7",
      suave: "#aebcd0",
      nivel1: "#6fe0a0", nivel2: "#5eb3ff", nivel3: "#ff7358"
    }
  }
};
