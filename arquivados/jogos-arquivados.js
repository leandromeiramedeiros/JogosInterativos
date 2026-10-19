/* Jogos arquivados: fora da grade e do site publicado. Mesmo formato da lista JOGOS do index.html;
   para reativar um jogo, mova o item de volta para JOGOS, o HTML para jogos/ e o CSS da arte para hub.css. */
const NIVEL3={nome:"Nível",opcoes:["Fácil","Médio","Difícil"]};
const JOGOS_ARQUIVADOS=[
  {
    id:"puxe-o-pino",
    titulo:"Puxe o Pino",
    arquivo:"jogos/puxe-o-pino.html",
    resumo:"Puxe os pinos na ordem certa: o ouro tem que cair no herói, e a lava não.",
    tags:["Quebra-cabeça","Física","Fases"],
    cor:["#ffd23f","#2b4f9a"],
    arte:`<div class="label art-pino">
      <svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="pi-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3567c4"/><stop offset="1" stop-color="#16306e"/></linearGradient>
          <linearGradient id="pi-lava" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb13b"/><stop offset="1" stop-color="#e2461b"/></linearGradient>
          <linearGradient id="pi-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16306e" stop-opacity="0"/><stop offset="1" stop-color="#16306e" stop-opacity=".94"/></linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#pi-bg)"/>
        <rect x="72" y="50" width="256" height="186" rx="10" fill="#dfe5ec" opacity=".12"/>
        <g fill="#c4ccd6" stroke="#8c96a4" stroke-width="2">
          <rect x="56" y="44" width="16" height="206" rx="4"/>
          <rect x="328" y="44" width="16" height="206" rx="4"/>
          <rect x="56" y="36" width="288" height="14" rx="4"/>
        </g>
        <rect x="72" y="236" width="256" height="14" fill="#aeb8c4"/>
        <rect x="200" y="214" width="128" height="22" fill="url(#pi-lava)"/>
        <g fill="#ffe08a"><circle cx="222" cy="222" r="3"/><circle cx="262" cy="226" r="2.5"/><circle cx="302" cy="220" r="3"/></g>
        <g fill="#ffc22e" stroke="#8a6008" stroke-width="2">
          <ellipse cx="118" cy="230" rx="14" ry="5"/><ellipse cx="134" cy="226" rx="14" ry="5"/><ellipse cx="150" cy="230" rx="14" ry="5"/>
          <ellipse cx="126" cy="218" rx="14" ry="5"/><ellipse cx="142" cy="214" rx="14" ry="5"/>
        </g>
        <g fill="#aab4c2" stroke="#8c96a4" stroke-width="2">
          <rect x="46" y="106" width="134" height="10" rx="5"/>
          <rect x="46" y="162" width="150" height="10" rx="5"/>
        </g>
        <g fill="#ffd23f" stroke="#8a6a00" stroke-width="2.5">
          <circle cx="34" cy="111" r="13"/><circle cx="34" cy="167" r="13"/>
        </g>
        <circle cx="34" cy="111" r="4" fill="#8a6a00"/><circle cx="34" cy="167" r="4" fill="#8a6a00"/>
        <path d="M160 128 Q224 112 268 150" fill="none" stroke="#ffd23f" stroke-width="2" stroke-dasharray="4 4" opacity=".75"/>
        <circle cx="226" cy="124" r="7" fill="#ffc22e" stroke="#8a6008" stroke-width="2"/>
        <rect x="270" y="196" width="60" height="8" rx="2" fill="#aeb8c4"/>
        <circle cx="300" cy="168" r="9" fill="#ffd9b3"/>
        <circle cx="296" cy="167" r="1.3" fill="#222"/><circle cx="304" cy="167" r="1.3" fill="#222"/>
        <rect x="292" y="178" width="16" height="18" rx="4" fill="#2ec4b6"/>
        <rect x="292" y="159" width="16" height="4" rx="2" fill="#ffd23f"/>
        <rect y="168" width="400" height="132" fill="url(#pi-fade)"/>
      </svg>
      <div class="mark m" aria-hidden="true">Puxe o<br><span>Pino</span></div>
    </div>`
  },
  {
    id:"corrida-dos-portoes",
    titulo:"Corrida dos Portões",
    arquivo:"jogos/corrida-dos-portoes.html",
    resumo:"Arraste a multidão pelos portões que mais somam e vença o exército inimigo no fim da pista.",
    tags:["Corrida","Multidão","Fases sem fim"],
    cor:["#2f7cf6","#174a9e"],
    arte:`<div class="label art-corrida">
      <svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="co-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb4f2"/><stop offset="1" stop-color="#d8f1ff"/></linearGradient>
          <linearGradient id="co-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#174a9e" stop-opacity="0"/><stop offset="1" stop-color="#174a9e" stop-opacity=".94"/></linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#co-sky)"/>
        <rect y="120" width="400" height="180" fill="#6cc04a"/>
        <circle cx="48" cy="130" r="18" fill="#2f8a3a"/><rect x="44" y="140" width="8" height="14" fill="#7a4a22"/>
        <circle cx="352" cy="130" r="18" fill="#2f8a3a"/><rect x="348" y="140" width="8" height="14" fill="#7a4a22"/>
        <polygon points="172,120 228,120 318,300 82,300" fill="#8b8f99"/>
        <line x1="200" y1="124" x2="200" y2="300" stroke="#f4f4f4" stroke-width="3" stroke-dasharray="14 12" opacity=".7"/>
        <line x1="200" y1="90" x2="200" y2="120" stroke="#5a4a30" stroke-width="2"/>
        <path d="M200 90 h16 l-4 6 l4 6 h-16z" fill="#e5484d"/>
        <g fill="#e5484d"><circle cx="192" cy="128" r="3.5"/><circle cx="200" cy="125" r="3.5"/><circle cx="208" cy="128" r="3.5"/><circle cx="196" cy="134" r="3.5"/><circle cx="204" cy="134" r="3.5"/></g>
        <rect x="158" y="150" width="42" height="36" rx="4" fill="#2fbf5b" stroke="#17703a" stroke-width="2"/>
        <text x="179" y="176" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="20" fill="#fff">×3</text>
        <rect x="200" y="150" width="42" height="36" rx="4" fill="#e5484d" stroke="#8a1c22" stroke-width="2"/>
        <text x="221" y="176" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="16" fill="#fff">−20</text>
        <g fill="#2f7cf6" stroke="#fff" stroke-width="2">
          <circle cx="172" cy="236" r="8"/><circle cx="188" cy="232" r="8"/><circle cx="204" cy="236" r="8"/><circle cx="220" cy="232" r="8"/><circle cx="236" cy="236" r="8"/>
          <circle cx="180" cy="254" r="9"/><circle cx="198" cy="252" r="9"/><circle cx="216" cy="254" r="9"/><circle cx="234" cy="252" r="9"/>
          <circle cx="162" cy="274" r="9"/><circle cx="184" cy="272" r="9"/><circle cx="206" cy="274" r="9"/><circle cx="228" cy="272" r="9"/><circle cx="250" cy="274" r="9"/>
        </g>
        <rect y="168" width="400" height="132" fill="url(#co-fade)"/>
      </svg>
      <div class="mark m" aria-hidden="true">Corrida dos<br><span>Portões</span></div>
    </div>`
  },
  {
    id:"torre-do-poder",
    titulo:"Torre do Poder",
    arquivo:"jogos/torre-do-poder.html",
    resumo:"Derrote só quem for mais fraco que você e fique mais forte a cada andar da torre.",
    tags:["Estratégia","Torres","Chefes"],
    cor:["#2fbf5b","#1b1640"],
    arte:`<div class="label art-torre">
      <svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="to-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2a7a"/><stop offset="1" stop-color="#1b1640"/></linearGradient>
          <linearGradient id="to-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1640" stop-opacity="0"/><stop offset="1" stop-color="#1b1640" stop-opacity=".94"/></linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#to-bg)"/>
        <circle cx="318" cy="58" r="26" fill="#f7efc8"/>
        <g fill="#e3d8a6"><circle cx="328" cy="50" r="5"/><circle cx="310" cy="68" r="4"/></g>
        <g fill="#fff" opacity=".7"><circle cx="60" cy="50" r="1.5"/><circle cx="110" cy="30" r="1.2"/><circle cx="250" cy="34" r="1.5"/><circle cx="40" cy="110" r="1.2"/><circle cx="370" cy="130" r="1.5"/></g>
        <g fill="#6d6680">
          <rect x="128" y="34" width="144" height="236"/>
          <rect x="128" y="20" width="18" height="16"/><rect x="156" y="20" width="18" height="16"/><rect x="184" y="20" width="18" height="16"/><rect x="212" y="20" width="18" height="16"/><rect x="240" y="20" width="18" height="16"/>
        </g>
        <g stroke="#58526a" stroke-width="2" opacity=".7"><line x1="128" y1="84" x2="272" y2="84"/><line x1="128" y1="144" x2="272" y2="144"/><line x1="128" y1="204" x2="272" y2="204"/></g>
        <rect x="196" y="48" width="18" height="26" rx="9" fill="#ffd67a"/>
        <circle cx="170" cy="118" r="12" fill="#c2412d"/>
        <path d="M162 108 l-4 -8 l8 4z M178 108 l4 -8 l-8 4z" fill="#c2412d"/>
        <circle cx="166" cy="116" r="2.5" fill="#fff"/><circle cx="174" cy="116" r="2.5" fill="#fff"/>
        <rect x="200" y="106" width="46" height="24" rx="7" fill="#e5484d"/>
        <text x="223" y="124" text-anchor="middle" font-family="Lilita One,Arial Black,sans-serif" font-size="16" fill="#fff">24</text>
        <circle cx="170" cy="184" r="11" fill="#5fbf6a"/>
        <circle cx="166" cy="182" r="2.2" fill="#fff"/><circle cx="174" cy="182" r="2.2" fill="#fff"/>
        <rect x="200" y="172" width="46" height="24" rx="7" fill="#2fbf5b"/>
        <text x="223" y="190" text-anchor="middle" font-family="Lilita One,Arial Black,sans-serif" font-size="16" fill="#fff">6</text>
        <circle cx="170" cy="233" r="8" fill="#ffd9b3"/>
        <rect x="162" y="241" width="16" height="22" rx="4" fill="#e8edf5"/>
        <rect x="156" y="204" width="28" height="16" rx="5" fill="#2fbf5b" stroke="#17703a" stroke-width="1.5"/>
        <text x="170" y="216" text-anchor="middle" font-family="Lilita One,Arial Black,sans-serif" font-size="12" fill="#fff">7</text>
        <rect x="200" y="238" width="46" height="24" rx="7" fill="#2fbf5b" opacity=".35"/>
        <rect y="168" width="400" height="132" fill="url(#to-fade)"/>
      </svg>
      <div class="mark m" aria-hidden="true">Torre<br><span>do Poder</span></div>
    </div>`
  },
  {
    id:"salve-o-cachorro",
    titulo:"Salve o Cachorro",
    arquivo:"jogos/salve-o-cachorro.html",
    resumo:"Desenhe uma linha para proteger o cachorro das abelhas por 10 segundos. A tinta é pouca.",
    tags:["Desenho","Física","Estrelas"],
    cor:["#f2a516","#3a2a10"],
    arte:`<div class="label art-cao">
      <svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="ca-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d2"/><stop offset="1" stop-color="#f7d56a"/></linearGradient>
          <linearGradient id="ca-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a10" stop-opacity="0"/><stop offset="1" stop-color="#3a2a10" stop-opacity=".94"/></linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#ca-bg)"/>
        <ellipse cx="200" cy="262" rx="230" ry="44" fill="#8fbf4a"/>
        <rect x="250" y="112" width="110" height="8" rx="4" fill="#7a4a22"/>
        <path d="M300 56 C334 46 344 80 336 102 C332 120 300 126 290 112 C276 98 280 64 300 56Z" fill="#e8a33a" stroke="#9a5b10" stroke-width="3"/>
        <path d="M284 80 Q310 88 336 80 M286 98 Q310 106 334 98" fill="none" stroke="#9a5b10" stroke-width="2.5"/>
        <circle cx="312" cy="104" r="4" fill="#3a2a10"/>
        <g transform="translate(248 66) rotate(-12)"><ellipse rx="10" ry="6" fill="#ffd23f" stroke="#3a2a10" stroke-width="2"/><path d="M-2 -6v12M3 -6v12" stroke="#3a2a10" stroke-width="2"/><ellipse cx="-2" cy="-9" rx="6" ry="4" fill="#fff" opacity=".85"/></g>
        <g transform="translate(272 40) rotate(10)"><ellipse rx="10" ry="6" fill="#ffd23f" stroke="#3a2a10" stroke-width="2"/><path d="M-2 -6v12M3 -6v12" stroke="#3a2a10" stroke-width="2"/><ellipse cx="-2" cy="-9" rx="6" ry="4" fill="#fff" opacity=".85"/></g>
        <g transform="translate(356 150) rotate(-8)"><ellipse rx="10" ry="6" fill="#ffd23f" stroke="#3a2a10" stroke-width="2"/><path d="M-2 -6v12M3 -6v12" stroke="#3a2a10" stroke-width="2"/><ellipse cx="-2" cy="-9" rx="6" ry="4" fill="#fff" opacity=".85"/></g>
        <g transform="translate(190 60) rotate(-20)"><ellipse rx="10" ry="6" fill="#ffd23f" stroke="#3a2a10" stroke-width="2"/><path d="M-2 -6v12M3 -6v12" stroke="#3a2a10" stroke-width="2"/><ellipse cx="-2" cy="-9" rx="6" ry="4" fill="#fff" opacity=".85"/></g>
        <path d="M150 218 q-14 -8 -10 -24" fill="none" stroke="#d4924c" stroke-width="8" stroke-linecap="round"/>
        <rect x="166" y="232" width="8" height="18" rx="4" fill="#b9733a"/>
        <rect x="200" y="232" width="8" height="18" rx="4" fill="#b9733a"/>
        <ellipse cx="190" cy="222" rx="40" ry="22" fill="#d4924c"/>
        <ellipse cx="208" cy="180" rx="8" ry="14" fill="#7a4a22" transform="rotate(-20 208 180)"/>
        <circle cx="226" cy="196" r="22" fill="#d4924c"/>
        <circle cx="221" cy="192" r="3.5" fill="#1d1510"/><circle cx="222" cy="191" r="1.2" fill="#fff"/>
        <circle cx="236" cy="206" r="5" fill="#ffc7b0" opacity=".7"/>
        <ellipse cx="246" cy="202" rx="5" ry="4" fill="#1d1510"/>
        <path d="M236 212 q5 8 10 0z" fill="#ff7aa2"/>
        <path d="M118 210 Q196 92 268 196" fill="none" stroke="#14110d" stroke-width="6" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="26" fill="#3a2a10"/>
        <text x="60" y="68" text-anchor="middle" font-family="Lilita One,Arial Black,sans-serif" font-size="22" fill="#ffc53d">10</text>
        <rect y="168" width="400" height="132" fill="url(#ca-fade)"/>
      </svg>
      <div class="mark m" aria-hidden="true">Salve o<br><span>Cachorro</span></div>
    </div>`
  },
  {
    id:"pulo-do-ze",
    titulo:"Pulo do Zé",
    arquivo:"jogos/pulo-do-ze.html",
    resumo:"Plataforma clássica: Zé, o faz-tudo de bigode, pula em mangas bravas, quebra tijolos e chega na bandeira em 4 fases.",
    tags:["Plataforma","4 fases","Chefe"],
    cor:["#2fbf5b","#3a6fd8"],
    arte:`<div class="label art-ze">
      <svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs><linearGradient id="pz-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5cb8ff"/><stop offset="1" stop-color="#bfe6ff"/></linearGradient><linearGradient id="pz-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14306a" stop-opacity="0"/><stop offset="1" stop-color="#14306a" stop-opacity=".94"/></linearGradient></defs>
        <rect width="400" height="300" fill="url(#pz-bg)"/>
        <g fill="#fff"><ellipse cx="300" cy="50" rx="30" ry="12"/><ellipse cx="320" cy="44" rx="18" ry="11"/></g>
        <ellipse cx="80" cy="222" rx="120" ry="60" fill="#2fbf5b"/>
        <ellipse cx="320" cy="218" rx="140" ry="70" fill="#27a84f"/>
        <rect y="212" width="400" height="88" fill="#8b5a2b"/>
        <rect y="204" width="400" height="10" fill="#2fbf5b"/>
        <rect x="170" y="150" width="30" height="20" fill="#b5552c" stroke="#5a2a14" stroke-width="2"/>
        <rect x="200" y="150" width="30" height="20" fill="#b5552c" stroke="#5a2a14" stroke-width="2"/>
        <rect x="230" y="150" width="30" height="20" fill="#b5552c" stroke="#5a2a14" stroke-width="2"/>
        <rect x="260" y="140" width="22" height="22" rx="3" fill="#ffc53d" stroke="#8a5a00" stroke-width="2"/>
        <text x="271" y="157" text-anchor="middle" font-family="Lilita One,Arial Black,sans-serif" font-size="16" fill="#8a5a00">?</text>
        <path d="M140 200 Q150 120 170 130" stroke="#fff" stroke-width="2" stroke-dasharray="3 6" fill="none"/>
        <path d="M106 142 Q120 122 136 142 Z" fill="#2fbf5b"/>
        <rect x="104" y="140" width="22" height="4" fill="#2fbf5b"/>
        <circle cx="120" cy="150" r="12" fill="#ffd9b3"/>
        <circle cx="124" cy="147" r="2" fill="#1d1510"/>
        <path d="M111 157 Q120 162 129 157 Q126 160 120 160 Q114 160 111 157Z" fill="#5a2e10"/>
        <rect x="106" y="164" width="28" height="16" rx="5" fill="#e53b3b"/>
        <rect x="98" y="168" width="10" height="6" rx="3" fill="#e53b3b"/>
        <rect x="109" y="172" width="22" height="18" fill="#3a6fd8"/>
        <rect x="110" y="190" width="8" height="12" fill="#3a6fd8"/>
        <rect x="122" y="190" width="8" height="12" fill="#3a6fd8"/>
        <rect x="108" y="200" width="12" height="5" fill="#5a2e10"/>
        <rect x="120" y="200" width="12" height="5" fill="#5a2e10"/>
        <ellipse cx="300" cy="186" rx="22" ry="26" fill="#ffb020" stroke="#b86a00" stroke-width="2"/>
        <path d="M300 160 Q306 148 316 152 Q308 158 300 160Z" fill="#2fbf5b"/>
        <path d="M288 176 L296 180 M312 176 L304 180" stroke="#1d1510" stroke-width="3"/>
        <circle cx="292" cy="184" r="3" fill="#1d1510"/><circle cx="308" cy="184" r="3" fill="#1d1510"/>
        <path d="M292 198 Q300 194 308 198" stroke="#1d1510" stroke-width="2" fill="none"/>
        <rect y="168" width="400" height="132" fill="url(#pz-fade)"/>
      </svg>
      <div class="mark m" aria-hidden="true">Pulo<br><span>do Zé</span></div>
    </div>`
  },
  {
    id:"rua-dos-socos",
    titulo:"Rua dos Socos",
    arquivo:"jogos/rua-dos-socos.html",
    resumo:"Briga de rua com combos, arremessos e chefes. Limpe a cidade, o porto e o terraço.",
    tags:["Porradaria","3 fases","Combos"],
    cor:["#ff3d7f","#1a0f2e"],
    modos:[{nome:"Jogadores",opcoes:[["1p","1 jogador"],["2p","2 jogadores"]]}], legado:true,
    arte:`<div class="label art-rua">
      <svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs><linearGradient id="rd-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1446"/><stop offset="1" stop-color="#1a0f2e"/></linearGradient><linearGradient id="rd-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0f2e" stop-opacity="0"/><stop offset="1" stop-color="#1a0f2e" stop-opacity=".94"/></linearGradient></defs>
        <rect width="400" height="300" fill="url(#rd-bg)"/>
        <circle cx="60" cy="50" r="16" fill="#fff3c4" opacity=".8"/>
        <rect x="0" y="90" width="90" height="120" fill="#120a24"/>
        <rect x="300" y="70" width="100" height="140" fill="#120a24"/>
        <g fill="#ffd23f" opacity=".6"><rect x="14" y="110" width="12" height="14"/><rect x="50" y="110" width="12" height="14"/><rect x="316" y="100" width="12" height="14"/><rect x="360" y="100" width="12" height="14"/></g>
        <rect x="30" y="50" width="110" height="28" rx="5" fill="none" stroke="#ff3d7f" stroke-width="3"/>
        <text x="85" y="71" text-anchor="middle" font-family="Lilita One,Arial Black,sans-serif" font-size="20" fill="#ff3d7f">BAR</text>
        <rect x="250" y="40" width="120" height="28" rx="5" fill="none" stroke="#3dd6ff" stroke-width="3"/>
        <text x="310" y="61" text-anchor="middle" font-family="Lilita One,Arial Black,sans-serif" font-size="20" fill="#3dd6ff">CLUBE</text>
        <rect y="200" width="400" height="100" fill="#2a2236"/>
        <rect y="196" width="400" height="6" fill="#4a3d5e"/>
        <rect x="152" y="188" width="7" height="16" fill="#1d1d3a"/>
        <rect x="164" y="188" width="7" height="16" fill="#1d1d3a"/>
        <rect x="150" y="160" width="26" height="30" rx="6" fill="#3dd6ff" stroke="#0b5a7a" stroke-width="2"/>
        <circle cx="163" cy="150" r="12" fill="#ffd9b3"/>
        <path d="M151 146 Q163 130 175 146 L173 142 Q163 136 153 142Z" fill="#1d1020"/>
        <circle cx="168" cy="150" r="2" fill="#1d1510"/>
        <rect x="174" y="166" width="30" height="10" rx="5" fill="#3dd6ff" stroke="#0b5a7a" stroke-width="1.5"/>
        <circle cx="206" cy="171" r="9" fill="#ffd9b3" stroke="#a86a40" stroke-width="1.5"/>
        <rect x="250" y="188" width="7" height="16" fill="#222"/>
        <rect x="262" y="188" width="7" height="16" fill="#222"/>
        <rect x="246" y="160" width="26" height="30" rx="6" fill="#222" stroke="#ff3d7f" stroke-width="2"/>
        <circle cx="259" cy="150" r="12" fill="#f2c9a0"/>
        <path d="M250 142 L256 124 L262 142Z" fill="#ff3d7f"/>
        <path d="M253 147 l4 3 M257 147 l-4 3" stroke="#1d1510" stroke-width="2"/>
        <polygon points="215,104 221,118 236,112 231,126 246,130 231,134 236,148 221,142 215,156 209,142 194,148 199,134 184,130 199,126 194,112 209,118" fill="#ffe066" stroke="#ff3d7f" stroke-width="2"/>
        <text x="215" y="134" text-anchor="middle" font-family="Lilita One,Arial Black,sans-serif" font-size="13" fill="#1a0f2e">POW!</text>
        <rect x="330" y="176" width="34" height="30" rx="3" fill="#5b6470" stroke="#2a2f36" stroke-width="2"/>
        <rect x="326" y="170" width="42" height="8" rx="2" fill="#7a8490" stroke="#2a2f36" stroke-width="2"/>
        <path d="M338 184 V200 M348 184 V200 M356 184 V200" stroke="#2a2f36" stroke-width="2"/>
        <rect y="168" width="400" height="132" fill="url(#rd-fade)"/>
      </svg>
      <div class="mark m" aria-hidden="true">Rua dos<br><span>Socos</span></div>
    </div>`
  },
  {
    id:"sinuca",
    titulo:"Sinuca",
    arquivo:"jogos/sinuca.html",
    resumo:"Sinuca brasileira: acerte sempre a bola da vez, some pontos e cuidado com a falta de 7. Contra a CPU ou a dois.",
    tags:["Sinuca","vs CPU","2 jogadores"],
    cor:["#1f8a4c","#3b2414"],
    modos:[{nome:"CPU",opcoes:["Fácil","Médio","Difícil"]}], legado:true,
    arte:`<div class="label art-sinuca">
      <svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs><radialGradient id="sn-felt" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#2aa35d"/><stop offset="1" stop-color="#1a7040"/></radialGradient></defs>
        <rect width="400" height="300" fill="#3b2414"/>
        <rect x="30" y="24" width="340" height="252" rx="26" fill="#6b4226" stroke="#2a160b" stroke-width="3"/>
        <rect x="60" y="52" width="280" height="196" rx="6" fill="url(#sn-felt)" stroke="#124a2a" stroke-width="2"/>
        <g fill="#e8d9a8"><circle cx="130" cy="38" r="2.5"/><circle cx="270" cy="38" r="2.5"/><circle cx="130" cy="262" r="2.5"/><circle cx="270" cy="262" r="2.5"/><circle cx="46" cy="100" r="2.5"/><circle cx="46" cy="200" r="2.5"/><circle cx="354" cy="100" r="2.5"/><circle cx="354" cy="200" r="2.5"/></g>
        <g fill="#0b0b0b"><circle cx="60" cy="52" r="11"/><circle cx="340" cy="52" r="11"/><circle cx="60" cy="248" r="11"/><circle cx="340" cy="248" r="11"/><circle cx="200" cy="46" r="10"/><circle cx="200" cy="254" r="10"/></g>
        <line x1="130" y1="150" x2="236" y2="150" stroke="#fff" stroke-width="2" stroke-dasharray="3 6" opacity=".75"/>
        <circle cx="250" cy="150" r="8.5" fill="#d7262e" stroke="#4a0608" stroke-width="1"/>
        <circle cx="272" cy="132" r="8.5" fill="#ffd23f" stroke="#6b5200" stroke-width="1"/>
        <circle cx="272" cy="168" r="8.5" fill="#1f9d4a" stroke="#0a4020" stroke-width="1"/>
        <circle cx="294" cy="118" r="8.5" fill="#7a4420" stroke="#321a0a" stroke-width="1"/>
        <circle cx="294" cy="150" r="8.5" fill="#2a6fe0" stroke="#0c2a66" stroke-width="1"/>
        <circle cx="294" cy="182" r="8.5" fill="#ff7eb6" stroke="#7a2a50" stroke-width="1"/>
        <circle cx="316" cy="150" r="8.5" fill="#111" stroke="#000" stroke-width="1"/>
        <circle cx="120" cy="150" r="8.5" fill="#fbfbf6" stroke="#8a8a80" stroke-width="1"/>
        <line x1="74" y1="70" x2="112" y2="142" stroke="#d9a66b" stroke-width="7" stroke-linecap="round"/>
        <line x1="112" y1="142" x2="108" y2="138" stroke="#1c1208" stroke-width="5" stroke-linecap="round"/>
      </svg>
      <div class="mark m" aria-hidden="true">Si<br><span>nuca</span></div>
    </div>`
  },
  {
    id:"futebol-classico",
    titulo:"Clássico",
    arquivo:"jogos/futebol-classico.html",
    resumo:"Futebol arcade com os grandes do Rio e de São Paulo. Amistoso a dois ou o Torneio Rio-São Paulo contra a CPU.",
    tags:["Futebol","8 times","2 jogadores"],
    cor:["#ffffff","#1a5c2a"],
    modos:[{nome:"Modo",opcoes:["Amistoso","Torneio"]},NIVEL3,{nome:"Tempo",opcoes:[["2min","2 min"],["3min","3 min"]]}],
    arte:`<div class="label art-cla">
      <svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs><pattern id="cl-stripes" width="400" height="60" patternUnits="userSpaceOnUse"><rect width="400" height="30" fill="#1a5c2a"/><rect y="30" width="400" height="30" fill="#1f6b32"/></pattern></defs>
        <rect width="400" height="300" fill="url(#cl-stripes)"/>
        <g fill="none" stroke="#fff" stroke-width="3" opacity=".85">
          <rect x="12" y="12" width="376" height="276"/>
          <line x1="200" y1="12" x2="200" y2="288"/>
          <circle cx="200" cy="150" r="46"/>
          <rect x="12" y="90" width="60" height="120"/>
          <rect x="328" y="90" width="60" height="120"/>
        </g>
        <circle cx="200" cy="150" r="3" fill="#fff"/>
        <rect x="384" y="124" width="16" height="52" fill="#fff" opacity=".18" stroke="#fff" stroke-width="3"/>
        <path d="M384 132 H400 M384 140 H400 M384 148 H400 M384 156 H400 M384 164 H400 M388 124 V176 M392 124 V176 M396 124 V176" stroke="#fff" stroke-width="1" opacity=".7"/>
        <g transform="translate(100 120)"><circle cx="0" cy="-14" r="6" fill="#c68642"/><rect x="-7" y="-7" width="14" height="18" rx="3" fill="#d62828"/><rect x="-7" y="-3" width="14" height="3" fill="#111"/><rect x="-7" y="2" width="14" height="3" fill="#111"/><rect x="-6" y="11" width="5" height="12" fill="#111"/><rect x="1" y="11" width="5" height="12" fill="#111"/></g>
        <g transform="translate(150 206)"><circle cx="0" cy="-14" r="6" fill="#8d5524"/><rect x="-7" y="-7" width="14" height="18" rx="3" fill="#d62828"/><rect x="-7" y="-3" width="14" height="3" fill="#111"/><rect x="-7" y="2" width="14" height="3" fill="#111"/><rect x="-6" y="11" width="5" height="12" fill="#111"/><rect x="1" y="11" width="5" height="12" fill="#111"/></g>
        <g transform="translate(96 62)"><circle cx="0" cy="-14" r="6" fill="#c68642"/><rect x="-7" y="-7" width="14" height="18" rx="3" fill="#d62828"/><rect x="-7" y="-3" width="14" height="3" fill="#111"/><rect x="-7" y="2" width="14" height="3" fill="#111"/><rect x="-6" y="11" width="5" height="12" fill="#111"/><rect x="1" y="11" width="5" height="12" fill="#111"/></g>
        <g transform="translate(262 108)"><circle cx="0" cy="-14" r="6" fill="#c68642"/><rect x="-7" y="-7" width="14" height="18" rx="3" fill="#39b54a" stroke="#0d3b1a"/><rect x="-6" y="11" width="5" height="12" fill="#111"/><rect x="1" y="11" width="5" height="12" fill="#111"/></g>
        <g transform="translate(300 196)"><circle cx="0" cy="-14" r="6" fill="#8d5524"/><rect x="-7" y="-7" width="14" height="18" rx="3" fill="#39b54a" stroke="#0d3b1a"/><rect x="-6" y="11" width="5" height="12" fill="#111"/><rect x="1" y="11" width="5" height="12" fill="#111"/></g>
        <g transform="translate(232 232)"><circle cx="0" cy="-14" r="6" fill="#c68642"/><rect x="-7" y="-7" width="14" height="18" rx="3" fill="#39b54a" stroke="#0d3b1a"/><rect x="-6" y="11" width="5" height="12" fill="#111"/><rect x="1" y="11" width="5" height="12" fill="#111"/></g>
        <path d="M160 160 H176 M152 172 H170 M160 184 H176" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>
        <circle cx="186" cy="170" r="7" fill="#fff" stroke="#222" stroke-width="1.5"/>
        <circle cx="186" cy="170" r="2.5" fill="#222"/>
        <rect x="120" y="18" width="160" height="36" rx="6" fill="#0b1a10" stroke="#ffd23f" stroke-width="2"/>
        <text x="200" y="42" text-anchor="middle" font-family="Lilita One, Arial Black, sans-serif" font-size="16" fill="#fff">FLA 2 × 1 PAL</text>
      </svg>
      <div class="mark m" aria-hidden="true">Clás<br><span>sico</span></div>
    </div>`
  },
  {
    id:"quati-maluco",
    titulo:"Quati Maluco",
    arquivo:"jogos/quati-maluco.html",
    resumo:"Plataforma em 3D: corra pelas trilhas, gire para quebrar caixas, pule em TNT, fuja da pedra gigante e junte mangas, máscaras, joias e relíquias em 4 fases.",
    tags:["Plataforma 3D","4 fases","Caixas e TNT"],
    cor:["#ff7a1a","#14301a"],
    arte:`<div class="label art-qm">
      <svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="400" height="300" fill="#8fd3ff"/>
        <path d="M0 190 L400 190 L400 300 L0 300Z" fill="#2f6a2a"/>
        <path d="M150 140 L250 140 L360 300 L40 300Z" fill="#58b83a"/>
        <path d="M150 140 L250 140 L252 146 L148 146Z" fill="#7a4e2a"/>
        <circle cx="60" cy="150" r="46" fill="#3fa03a"/><rect x="54" y="180" width="12" height="40" fill="#6b4422"/>
        <circle cx="345" cy="140" r="50" fill="#2f8a2a"/><rect x="339" y="175" width="12" height="45" fill="#6b4422"/>
        <g transform="translate(250 196)"><rect width="56" height="56" fill="#c98a3e" stroke="#6b3d14" stroke-width="8"/><rect x="10" y="16" width="36" height="4" fill="#a8692b"/><rect x="10" y="30" width="36" height="4" fill="#a8692b"/></g>
        <g transform="translate(176 156)"><rect width="38" height="38" fill="#e8661a" stroke="#7a2a05" stroke-width="5"/><text x="19" y="25" text-anchor="middle" font-family="Impact,Arial Black,sans-serif" font-size="13" fill="#ffe14d">TNT</text></g>
        <circle cx="105" cy="196" r="11" fill="#ff8a1a"/><circle cx="130" cy="176" r="9" fill="#ff8a1a"/>
        <g transform="translate(150 200)">
          <ellipse cx="22" cy="76" rx="26" ry="6" fill="#000" opacity=".3"/>
          <path d="M40 46 q26 -10 30 -40" stroke="#3a2414" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="9 7"/>
          <rect x="6" y="30" width="34" height="26" rx="6" fill="#a0612b"/><rect x="5" y="50" width="36" height="12" fill="#2f5fd0"/>
          <rect x="9" y="62" width="10" height="10" fill="#e23a2a"/><rect x="27" y="62" width="10" height="10" fill="#e23a2a"/>
          <circle cx="23" cy="18" r="18" fill="#a0612b"/><rect x="6" y="12" width="34" height="8" fill="#3a2414"/>
          <circle cx="16" cy="16" r="4" fill="#fff"/><circle cx="30" cy="16" r="4" fill="#fff"/><path d="M15 24 L31 24 L23 38Z" fill="#e8c08a"/><circle cx="23" cy="36" r="3" fill="#3a2414"/>
          <path d="M8 4 L12 -8 L18 2Z M28 2 L34 -8 L38 4Z" fill="#a0612b"/>
        </g>
      </svg>
      <div class="mark" aria-hidden="true">Quati<br><span>Maluco</span></div>
    </div>`
  }
];
