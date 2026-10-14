window.QUIZ_CONFIG = {
  rotuloFonte: "Ver na norma",
  id: "quiz-do-suas",
  titulo: "Quiz do SUAS",
  subtitulo: "Perguntas sobre a LOAS e o Sistema Único de Assistência Social",
  heroTitulo: 'Você conhece os direitos que o <span>SUAS</span> garante?',
  heroTexto: "Dez perguntas por partida, sorteadas a cada jogo, sobre a Lei Orgânica da Assistência Social (Lei 8.742/1993), as mudanças da Lei 12.435/2011 e as normas do Sistema. Responda rápido para ganhar mais pontos e, ao fim de cada pergunta, confira o artigo.",
  niveis: {
    normal:     { nome: "Normal",     tempo: 20, mult: 1,   desc: "Cras, Creas, BPC, proteção básica e especial e os princípios da LOAS." },
    dificil:    { nome: "Difícil",    tempo: 15, mult: 1.5, desc: "Paif, Paefi, serviços da Tipificação, conselhos, fundos, benefícios eventuais e CIT/CIB." },
    impossivel: { nome: "Impossível", tempo: 10, mult: 2,   desc: "Artigos, números exatos, competências dos entes, composição do CNAS e detalhes da Lei 12.435." }
  },
  acertos: ["Direito garantido!", "Isso é proteção social!", "Acertou em cheio!", "Nota máxima para o SUAS!"],
  erros: ["Quase lá. Vale revisar a lei.", "Essa pede uma releitura do artigo.", "Errou, mas a rede de proteção é grande."],
  tempoEsgotado: "O tempo acabou!",
  resultados: {
    derrota: "Fim de jogo! Hora de reler a LOAS com calma e voltar mais forte.",
    perfeito: "Perfeito! Você domina o SUAS de ponta a ponta.",
    otimo: "Ótimo! Equipe de referência com louvor.",
    bom: "Bom! Falta pouco para dominar a lei.",
    raspando: "Passou raspando. A rede de proteção segurou você!"
  },
  nota: "Quiz educativo, sem vínculo com órgãos públicos. Conteúdo baseado em planalto.gov.br e no MDS; confira sempre o texto oficial vigente. Imagens: Wikimedia Commons.",
  tema: {
    fontes: {
      display: "'Fredoka', 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif",
      corpo: "'Nunito', system-ui, -apple-system, 'Segoe UI', sans-serif",
      googleFonts: "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@500;700;800&display=swap"
    },
    cores: {
      parede: "#7a3a22", parede2: "#4f2415",
      tv: "#9a6a3c", tv2: "#6b4526",
      tela: "#1c1a24",
      destaque: "#f6a623",
      alerta: "#f0603a",
      acerto: "#6fd39a",
      papel: "#fff3df",
      suave: "#d9c3a8",
      nivel1: "#6fd39a", nivel2: "#f6a623", nivel3: "#f0603a"
    }
  }
};
