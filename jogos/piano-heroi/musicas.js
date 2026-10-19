/* Músicas do Piano Herói.
   Cada música é uma partitura curta, no espírito de um MIDI: a melodia é a faixa do piano (as notas que caem
   e que só soam quando você acerta) e os acordes viram o acompanhamento (baixo, acordes e bateria).

   melodia: notas separadas por espaço, "Nota:duração" com a duração em tempos (sem duração = 1 tempo).
     Nota = letra + acidente opcional (# ou b) + oitava: C4 é o Dó central, F#4, Bb4… "-" é pausa.
     O teclado tem duas oitavas: de C4 a B5. O "|" só separa os compassos para facilitar a leitura.
   acordes: "Acorde:duração" na mesma contagem de tempos. Acorde = C, Am, G7, Dm7, Fmaj7, Csus4, Bdim; "-" é silêncio.
   compasso: tempos por compasso (3 = valsa, 4 = rock). anacruse: tempos de "pegada" antes do primeiro compasso.
   estilo: "valsa" ou "rock" (como o acompanhamento toca os acordes). icone, cor e sub: como a música aparece no menu. */
window.MUSICAS=[
  {
    id:"parabens",
    titulo:"Parabéns pra Você",
    sub:"Valsa · fácil de começar",
    bpm:104, compasso:3, anacruse:1, estilo:"valsa",
    cor:"#ffd23f", icone:"🎂",
    melodia:`D4:.75 D4:.25 | E4 D4 G4 | F#4:2 D4:.75 D4:.25 | E4 D4 A4 | G4:2 D4:.75 D4:.25 |
             D5 B4 G4 | F#4 E4 C5:.75 C5:.25 | B4 G4 A4 | G4:3`,
    acordes:`-:1 | G:3 | D:3 | D:3 | G:3 | G7:3 | C:3 | G:2 D:1 | G:3`
  },
  {
    id:"dragon-ball",
    titulo:"Dragon Ball",
    sub:"Abertura · rock acelerado",
    bpm:126, compasso:4, anacruse:0, estilo:"rock",
    cor:"#ff8a1f", icone:"🐉",
    /* Arranjo simplificado em Dó maior, escrito de ouvido: confira com a gravação e ajuste à vontade. */
    melodia:`-:4 |
             G4:.5 G4:.5 A4:.5 C5:1.5 -:1 | D5:.5 C5:.5 D5:.5 E5:1.5 -:1 |
             E5:.5 E5:.5 E5:.5 D5:.5 C5:.5 C5:.5 D5:1 | E5:.5 D5:.5 C5:.5 A4:.5 C5:2 |
             G4:.5 G4:.5 A4:.5 C5:1.5 -:1 | D5:.5 C5:.5 D5:.5 E5:1.5 -:1 |
             E5:.5 E5:.5 E5:.5 D5:.5 C5:.5 C5:.5 D5:1 | E5:.5 G5:.5 E5:.5 D5:.5 C5:2 |
             A4:.5 A4:.5 C5:.5 A4:.5 G4 E4 | F4:.5 F4:.5 A4:.5 F4:.5 E4 C4 |
             D4:.5 E4:.5 F4:.5 G4:.5 A4:.5 B4:.5 C5:.5 D5:.5 | E5:2 D5:2 |
             C5 E5 G5:1.5 E5:.5 | F5 E5:.5 D5:.5 C5:2 |
             A4:.5 C5:.5 D5:.5 E5:.5 F5 E5 | D5:4 |
             C5 E5 G5:1.5 A5:.5 | G5 E5:.5 C5:.5 D5:2 |
             E5:.5 D5:.5 C5:.5 A4:.5 G4 A4 | C5:4`,
    acordes:`C:4 | C:4 | G:4 | Am:4 | F:2 G:2 | C:4 | G:4 | Am:4 | F:2 G:2 |
             Am:4 | F:2 C:2 | Dm:2 G:2 | C:2 G:2 |
             C:4 | F:2 C:2 | F:4 | G:4 | C:4 | C:2 G:2 | F:2 G:2 | C:4`
  }
];
