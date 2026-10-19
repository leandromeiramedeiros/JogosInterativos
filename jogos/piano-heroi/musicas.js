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
    titulo:"Dragon Ball GT",
    sub:"Abertura · Eu quero saber…",
    bpm:131, compasso:4, anacruse:0, estilo:"rock",
    cor:"#ff8a1f", icone:"🐉",
    /* Refrão de "Dan Dan Kokoro Hikareteku" ("Eu quero saber, se comigo você quer vir dançar…"),
       tirado de um MIDI da música, em Dó maior. */
    melodia:`-:4 |
             G5 G5 E5:.5 F5:.5 G5:.5 A5:.5 | G5 F5 E5 D5 | E5 E5 C5:.5 D5:.5 E5:.5 F5:.5 | E5 D5 C5 B4 |
             -:1 A4 C5 A5 | G5 G5:.5 C5:1.5 D5:.5 E5:.5 | F5 E5 D5 C5:.5 D5:.5 | E5:1.5 F5:.25 E5:.25 D5:2 |
             G5 G5 E5:.5 F5:.5 G5:.5 A5:.5 | G5 F5 E5 D5 | E5 E5 C5:.5 D5:.5 E5:.5 F5:.5 | E5 D5 C5 B4 |
             -:1 A4 C5 A5 | G5 G5:.5 C5:1.5 -:1 | F5 E5 D5 C5 | D5:2 C5 B4 | C5:4`,
    acordes:`G:4 |
             C:4 | G:4 | Am:4 | Em:4 | F:4 | C:2 Am:2 | Dm:4 | E:2 G:2 |
             C:4 | G:4 | Am:4 | Em:4 | F:4 | C:2 Am:2 | Bb:4 | G:4 | C:4`
  }
];
