window.QUIZ_CONFIG = {
  id: "licitacoes-14133",
  titulo: "Quiz da Lei 14.133",
  subtitulo: "Nova Lei de Licitações e Contratos Administrativos",
  heroTitulo: 'Você domina a <span>Lei 14.133</span>?',
  heroTexto: "Dez perguntas por partida, sorteadas a cada jogo, sobre a Lei nº 14.133/2021. Responda rápido para ganhar mais pontos, emende acertos e confira o artigo na curiosidade de cada resposta.",
  niveis: {
    normal:     { nome: "Normal",     tempo: 20, mult: 1,   desc: "Modalidades, agente de contratação, PNCP e o básico de todo servidor." },
    dificil:    { nome: "Difícil",    tempo: 15, mult: 1.5, desc: "Fases, critérios de julgamento, sanções, garantias e prazos de contrato." },
    impossivel: { nome: "Impossível", tempo: 10, mult: 2,   desc: "Número de artigo, prazos exatos, transição e distinções finas." }
  },
  acertos: ["Homologado!", "Proposta vencedora!", "Habilitado!", "Adjudicado!"],
  erros: ["Recurso indeferido!", "Proposta desclassificada!", "Inabilitado!"],
  tempoEsgotado: "Prazo encerrado!",
  resultados: {
    derrota: "Licitação fracassada! Releia o edital e tente de novo.",
    perfeito: "Homologado sem ressalvas! Parecer jurídico favorável.",
    otimo: "Aprovado com louvor: a comissão de contratação aplaude.",
    bom: "Habilitado! Faltou só um esclarecimento ao edital.",
    raspando: "Adjudicado por um triz. Vale uma diligência nos artigos."
  },
  nota: "Quiz educativo, sem vínculo oficial com órgão público. Base: Lei nº 14.133/2021 (texto compilado, Planalto). Fotos: Wikimedia Commons.",
  tema: {
    fontes: {
      display: "'Alfa Slab One', Rockwell, 'Arial Black', Georgia, serif",
      corpo: "'Source Sans 3', system-ui, -apple-system, 'Segoe UI', sans-serif",
      googleFonts: "https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Source+Sans+3:wght@500;700;800&display=swap"
    },
    cores: {
      parede: "#0f4a30", parede2: "#082d1d",
      tv: "#4b3a22", tv2: "#33260f",
      tela: "#0b1f17",
      destaque: "#f6c928",
      alerta: "#e5573a",
      acerto: "#62d69a",
      papel: "#fbf5e1",
      suave: "#a9c9b8",
      nivel1: "#62d69a", nivel2: "#f6c928", nivel3: "#e5573a"
    }
  }
};
