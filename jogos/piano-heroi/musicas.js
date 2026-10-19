/* Músicas do Piano Herói.
   Cada música é uma partitura curta, no espírito de um MIDI: a melodia é a faixa do piano (as notas que caem
   e que só soam quando você acerta) e os acordes viram o acompanhamento (baixo, acordes e bateria).

   A melodia é sempre a voz de quem canta: uma nota por sílaba, no ritmo do canto, nunca o acompanhamento
   (acordes, arpejos, introdução instrumental). Quem toca deve conseguir cantar junto.

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
    /* "Dan Dan Kokoro Hikareteku" em Dó maior: refrão ("Eu quero saber, se comigo você quer vir dançar…"),
       estrofe (em Mi bemol, como na música) e refrão de novo. A melodia é a linha do canto tirada de um MIDI
       da música; no refrão, a do último refrão, onde cada sílaba tem a sua nota. */
    melodia:`-:4 |
             G5 G5 E5:.5 F5:.5 G5:.5 A5:.5 | G5 F5 E5 D5 | E5 E5 C5:.5 D5:.5 E5:.5 F5:.5 | E5 D5 C5 B4 |
             -:1 A4:.5 A4:.5 C5:.5 C5:.5 A5:.5 A5:.5 | G5 G5:.5 C5:1.5 D5:.5 E5:.5 | F5 E5:.5 E5:.5 D5 C5:.5 D5:.5 | E5:1.5 F5:.25 E5:.25 D5:2 |
             G5 G5 E5:.5 F5:.5 G5:.5 A5:.5 | G5 F5:.5 F5:.5 E5 D5 | E5 E5 C5:.5 D5:.5 E5:.5 F5:.5 | E5:.5 E5:.5 D5:.5 D5:.5 C5 B4 |
             -:1 A4:.5 A4:.5 C5 A5 | G5 G5:.5 C5:1.5 -:1 | F5:.5 F5:.5 E5 D5 C5 | D5:2 C5 B4 | -:4 |
             -:1.5 C5 C5:.5 C5:.5 C5:.5 | C5 Bb4:.5 Ab4 Bb4:.5 C5 | Bb4 -:1 Bb4:.5 Bb4:.5 Bb4:.5 Ab4:.5 | Ab4:.5 Bb4:.5 Ab4:.5 G4:1.5 Ab4:.5 Bb4:.5 |
             Ab4 -:1 Ab4 Ab4:.5 G4:1.5 -:.5 F4:.5 G4 F4:.5 F4:.5 | F4:.5 F4:.5 F4:.5 F4:.5 Eb4:.5 F4 G4:1.5 -:1.5 Ab4 Bb4:.5 |
             C5 -:.5 C5 C5:.5 C5:.5 C5:.5 | C5 Bb4:.5 Ab4 Bb4:.5 C5 | Bb4 -:.5 Bb4:.5 Bb4:.75 C5:.75 D5:.5 | Eb5:.5 D5:.5 Eb5 Bb4:.5 Ab4:.5 Ab4:.5 G4:.5 |
             Ab4:2 -:.5 Ab4:.5 Bb4:.5 Ab4:.5 | G4:.5 G4:.5 -:.5 G4:.5 G4:.5 G5 F5:.5 | F5:2 F5:.5 Eb5:.5 D5:.5 Eb5:1.5 -:.5 C5:.5 C5 D5 |
             Eb5:.5 Eb5:.5 -:.5 D5:.5 Eb5:1.5 D5:.5 | Eb5:1.5 C5:.5 F5:.5 Eb5:.5 D5:.5 C5:.5 | C5:.5 Bb4:.5 -:.5 G4:.5 Bb4:.5 Bb4:.5 -:.5 G4:.5 |
             Bb4:.5 Bb4 G4:.5 Bb4:.75 C5:.75 D5:.5 | Eb5:.75 D5:.75 Eb5:.5 C5:2 | Eb5:.75 D5:.75 Eb5:.5 C5:.5 C5:.5 G5:.5 F5:.5 |
             F5 -:.5 F5:.5 F5:.5 Eb5:.5 F5:.5 G5:3.5 -:1 |
             G5 G5 E5:.5 F5:.5 G5:.5 A5:.5 | G5 F5 E5 D5 | E5 E5 C5:.5 D5:.5 E5:.5 F5:.5 | E5 D5 C5 B4 |
             -:1 A4:.5 A4:.5 C5:.5 C5:.5 A5:.5 A5:.5 | G5 G5:.5 C5:1.5 D5:.5 E5:.5 | F5 E5:.5 E5:.5 D5 C5:.5 D5:.5 | E5:1.5 F5:.25 E5:.25 D5:2 |
             G5 G5 E5:.5 F5:.5 G5:.5 A5:.5 | G5 F5:.5 F5:.5 E5 D5 | E5 E5 C5:.5 D5:.5 E5:.5 F5:.5 | E5:.5 E5:.5 D5:.5 D5:.5 C5 B4 |
             -:1 A4:.5 A4:.5 C5 A5 | G5 G5:.5 C5:1.5 -:1 | F5:.5 F5:.5 E5 D5 C5 | D5:2 C5 B4 | C5:4`,
    acordes:`G:4 |
             C:4 | G:4 | Am:4 | Em:4 | F:4 | C:2 Am:2 | Dm:4 | E:2 G:2 |
             C:4 | G:4 | Am:4 | Em:4 | F:4 | C:2 Am:2 | Bb:4 | G:4 | Ab:2 Bb:2 |
             Ab:4 | Bb7:4 | Bb:4 | Eb:2 Cm:2 | Ab:4 | F:2 Dm:2 | Eb:4 | C#dim:2 Ab:1 Bb:1 |
             Ab:4 | Bb:4 | Gm:4 | Cm:4 | Fm:4 | Cm:2 G:2 | Eb:4 | Cm:4 |
             Ab:4 | Ab:4 | Gm:4 | Gm:4 | Eb:4 | Ab:2 Fm:2 | Fm:4 | G:4 |
             C:4 | G:4 | Am:4 | Em:4 | F:4 | C:2 Am:2 | Dm:4 | E:2 G:2 |
             C:4 | G:4 | Am:4 | Em:4 | F:4 | C:2 Am:2 | Bb:4 | G:4 | C:4`
  }
];
