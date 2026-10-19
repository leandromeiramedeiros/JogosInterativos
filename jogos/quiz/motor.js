/* Motor de quiz compartilhado (Jogos Interativos).
   Lê window.QUIZ_CONFIG, window.QUIZ_PERGUNTAS e window.QUIZ_IMAGENS e monta a página inteira.
   Veja jogos/quiz/LEIAME.md. */
(function(){
"use strict";

var CFG = window.QUIZ_CONFIG, BANK = window.QUIZ_PERGUNTAS, IMGS = window.QUIZ_IMAGENS;
var PER_GAME = 10, LIVES = 3, MAX_PONTOS = 50000;

/* ---------------- utilitários ---------------- */
var esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); };
var shuffle = function(a){ a = a.slice(); for(var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
var pick = function(a){ return a[Math.floor(Math.random() * a.length)]; };
var isObj = function(o){ return o && typeof o === "object"; };
var urlSegura = function(u){ return typeof u === "string" && /^https?:\/\//i.test(u.trim()) ? u.trim() : ""; };
var reduzido = function(){ try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } };

/* ---------------- cores ---------------- */
function parseHex(h){
  if(typeof h !== "string") return null;
  var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(h.trim()); if(!m) return null;
  var s = m[1]; if(s.length === 3) s = s.replace(/./g, "$&$&");
  return [parseInt(s.slice(0,2),16), parseInt(s.slice(2,4),16), parseInt(s.slice(4,6),16)];
}
function toHex(c){ return "#" + c.map(function(v){ return ("0" + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2); }).join(""); }
function lum(c){ var f = c.map(function(v){ v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126*f[0] + .7152*f[1] + .0722*f[2]; }
function contraste(a, b){ var x = lum(a), y = lum(b); return (Math.max(x,y) + .05) / (Math.min(x,y) + .05); }
function escurece(c, t){ return c.map(function(v){ return v * (1 - t); }); }
function textoSobre(bg){            // escolhe tinta escura ou clara conforme o contraste
  var escuro = escurece(bg, .86), claro = [255,255,255];
  return contraste(bg, escuro) >= contraste(bg, claro) ? escuro : claro;
}

var COR_PADRAO = {parede:"#123a3c", parede2:"#0c2a2b", tv:"#5a3a22", tv2:"#3f2816", tela:"#0f1d1c", destaque:"#f2b134", alerta:"#e4572e", acerto:"#5fd39b", papel:"#fdf3dc", suave:"#a8c4bf", nivel1:"#5fd39b", nivel2:"#f2b134", nivel3:"#e4572e"};
var FONTE_PADRAO = {display:"'Bungee', Impact, 'Arial Black', sans-serif", corpo:"'Nunito', system-ui, -apple-system, 'Segoe UI', sans-serif"};

/* ---------------- config (com padrões) ---------------- */
var C = isObj(CFG) ? CFG : {};
var ID = String(C.id || (document.title || "quiz")).replace(/[^a-z0-9_-]/gi, "-").toLowerCase();
var TITULO = C.titulo || document.title || "Quiz";
var NIVEIS = isObj(C.niveis) && Object.keys(C.niveis).length ? C.niveis : {
  normal:{nome:"Normal", tempo:20, mult:1, desc:""},
  dificil:{nome:"Difícil", tempo:15, mult:1.5, desc:""},
  impossivel:{nome:"Impossível", tempo:10, mult:2, desc:""}
};
var NIVEL_KEYS = Object.keys(NIVEIS);
var ACERTOS = Array.isArray(C.acertos) && C.acertos.length ? C.acertos : ["Acertou!", "Boa!", "Mandou bem!"];
var ERROS = Array.isArray(C.erros) && C.erros.length ? C.erros : ["Errou!", "Não foi dessa vez..."];
var TEMPO_ESGOTADO = C.tempoEsgotado || "O tempo acabou!";
var RES = Object.assign({
  derrota:"Fim de jogo! Tente de novo.", perfeito:"Perfeito!", otimo:"Excelente resultado!", bom:"Bom resultado!", raspando:"Passou raspando!"
}, isObj(C.resultados) ? C.resultados : {});
var TEMA = isObj(C.tema) ? C.tema : {};
var CORES = Object.assign({}, COR_PADRAO, isObj(TEMA.cores) ? TEMA.cores : {});
var FONTES = Object.assign({}, FONTE_PADRAO, isObj(TEMA.fontes) ? TEMA.fontes : {});

/* chaves do localStorage (o Quiz da Vila mantém as antigas para não perder recordes) */
var K_MUTE = ID === "quiz-da-vila" ? "qv-mute" : "quiz-" + ID + "-mute";
var K_BEST = function(lv){ return (ID === "quiz-da-vila" ? "qv-best-" : "quiz-" + ID + "-best-") + lv; };

/* ---------------- tema → variáveis CSS ---------------- */
function aplicaTema(){
  var r = document.documentElement.style, set = function(k, v){ r.setProperty(k, v); };
  var rgb = {};
  Object.keys(COR_PADRAO).forEach(function(k){
    var c = parseHex(CORES[k]) || parseHex(COR_PADRAO[k]);
    rgb[k] = c; if(k.indexOf("nivel") !== 0) set("--" + k, toHex(c));
  });
  set("--destaque-rgb", rgb.destaque.join(",")); set("--alerta-rgb", rgb.alerta.join(","));
  set("--acerto-rgb", rgb.acerto.join(",")); set("--papel-rgb", rgb.papel.join(","));
  set("--tinta", toHex(escurece(rgb.papel, .85))); set("--papel-sombra", toHex(escurece(rgb.papel, .27)));
  set("--destaque-tinta", toHex(textoSobre(rgb.destaque))); set("--destaque-sombra", toHex(escurece(rgb.destaque, .35)));
  set("--acerto-tinta", toHex(textoSobre(rgb.acerto))); set("--acerto-sombra", toHex(escurece(rgb.acerto, .35)));
  set("--alerta-tinta", toHex(textoSobre(rgb.alerta))); set("--alerta-sombra", toHex(escurece(rgb.alerta, .38)));
  set("--display", FONTES.display); set("--corpo", FONTES.corpo);
  CORES._rgb = rgb;
  var gf = urlSegura(FONTES.googleFonts);
  if(gf && /^https:\/\/fonts\.googleapis\.com\//.test(gf)){
    var pre = document.createElement("link"); pre.rel = "preconnect"; pre.href = "https://fonts.googleapis.com"; document.head.appendChild(pre);
    var l = document.createElement("link"); l.rel = "stylesheet"; l.href = gf; document.head.appendChild(l);
  }
}
aplicaTema();
document.title = TITULO;
function corNivel(i){
  var c = parseHex(CORES["nivel" + (i + 1)]) || parseHex(COR_PADRAO["nivel" + (i + 1)]) || parseHex(COR_PADRAO.nivel1);
  return {bg:toHex(c), fg:toHex(textoSobre(c))};
}

/* ---------------- som (sintetizado) ---------------- */
var AC = null, muted = false;
try{ muted = localStorage.getItem(K_MUTE) === "1"; }catch(e){}
function ac(){ if(!AC){ try{ AC = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){} } if(AC && AC.state === "suspended"){ try{ AC.resume(); }catch(e){} } return AC; }
function tone(f, start, dur, type, vol, slideTo){
  var a = ac(); if(!a || muted) return;
  try{
    var o = a.createOscillator(), g = a.createGain(), t = a.currentTime + start;
    o.type = type || "square"; o.frequency.setValueAtTime(f, t); if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol == null ? .12 : vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + .02);
  }catch(e){}
}
var SFX = {
  ok:function(){ [523,659,784,1047].forEach(function(f,i){ tone(f, i*.07, .18, "square", .1); }); },
  bad:function(){ tone(180, 0, .45, "sawtooth", .14, 90); tone(120, .05, .45, "square", .08, 70); },
  tick:function(){ tone(1200, 0, .05, "sine", .08); },
  click:function(){ tone(660, 0, .05, "triangle", .08); },
  power:function(){ tone(300, 0, .25, "triangle", .1, 900); },
  win:function(){ [523,523,523,659,784,659,784,1047].forEach(function(f,i){ tone(f, i*.12, .2, "square", .1); }); tone(1047, 1, .6, "triangle", .1); },
  lose:function(){ [392,370,349].forEach(function(f,i){ tone(f, i*.42, .38, "sawtooth", .1); }); tone(330, 1.26, 1.1, "sawtooth", .1, 250); }
};

/* ---------------- esqueleto da página ---------------- */
document.body.innerHTML =
  '<div class="wrap">' +
    '<header class="top"><div class="logo">' + esc(TITULO) + (C.subtitulo ? '<small>' + esc(C.subtitulo) + '</small>' : '') + '</div>' +
    '<button class="iconbtn" id="mute" type="button" aria-pressed="false"></button></header>' +
    '<main class="tv"><div class="screen"><div class="flash" id="flash"></div><div class="view" id="view"></div></div></main>' +
    (C.nota ? '<p class="note">' + esc(C.nota) + '</p>' : '') +
  '</div><canvas id="fx" aria-hidden="true"></canvas>';
var view = document.getElementById("view"), flash = document.getElementById("flash"), muteBtn = document.getElementById("mute");
function paintMute(){ muteBtn.textContent = muted ? "🔇 Sem som" : "🔊 Som"; muteBtn.setAttribute("aria-pressed", String(muted)); muteBtn.setAttribute("aria-label", muted ? "Som desligado. Ativar o som" : "Som ligado. Desligar o som"); }
muteBtn.onclick = function(){ muted = !muted; try{ localStorage.setItem(K_MUTE, muted ? "1" : "0"); }catch(e){} paintMute(); if(!muted) SFX.click(); };
paintMute();

/* ---------------- confete ---------------- */
var cv = document.getElementById("fx"), cx = cv.getContext("2d"), parts = [], raf = 0;
function confetti(n){
  if(reduzido() || !cx) return;
  n = n || 160;
  cv.width = innerWidth; cv.height = innerHeight;
  var cols = ["destaque","alerta","acerto","papel"].map(function(k){ return toHex(CORES._rgb[k]); }).concat(["#5aa9e6"]);
  for(var i = 0; i < n; i++) parts.push({x:Math.random()*cv.width, y:-20 - Math.random()*cv.height*.5, vx:(Math.random()-.5)*3, vy:2 + Math.random()*4, r:Math.random()*6.28, s:5 + Math.random()*6, c:cols[i % cols.length]});
  cancelAnimationFrame(raf);
  (function loop(){
    cx.clearRect(0, 0, cv.width, cv.height); parts = parts.filter(function(p){ return p.y < cv.height + 20; });
    parts.forEach(function(p){ p.x += p.vx; p.y += p.vy; p.r += .1; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.fillRect(-p.s/2, -p.s/4, p.s, p.s/2); cx.restore(); });
    if(parts.length) raf = requestAnimationFrame(loop);
  })();
}

/* ---------------- dados ---------------- */
function dadosOk(){ return isObj(CFG) && isObj(BANK) && isObj(IMGS); }

// normaliza uma pergunta do banco; devolve null se estiver inválida
function normaliza(p){
  if(!isObj(p) || !p.pergunta || !p.certa || !Array.isArray(p.erradas)) return null;
  var erradas = p.erradas.filter(function(e){ return e && String(e) !== String(p.certa); }).filter(function(e, i, a){ return a.indexOf(e) === i; }).slice(0, 3);
  if(!erradas.length) return null;
  return {cena:p.cena, text:String(p.pergunta), right:String(p.certa), wrong:erradas.map(String), fact:p.curiosidade ? String(p.curiosidade) : "", fonte:urlSegura(p.fonte)};
}
function banco(lv){ return (isObj(BANK) && Array.isArray(BANK[lv]) ? BANK[lv] : []).map(normaliza).filter(Boolean); }
function montaQ(n){ return {cena:n.cena, text:n.text, right:n.right, opts:shuffle([n.right].concat(n.wrong)), fact:n.fact, fonte:n.fonte}; }
function imagem(cena){ var im = isObj(IMGS) && cena != null ? IMGS[cena] : null; return isObj(im) ? im : null; }
function srcImagem(im){ return im && typeof im.arquivo === "string" && im.arquivo ? ID + "/" + im.arquivo.replace(/^\/+/, "") : ""; }

var preload = [];
function preCarrega(q){ if(!q) return; var s = srcImagem(imagem(q.cena)); if(!s) return; try{ var i = new Image(); i.src = s; preload.push(i); if(preload.length > 6) preload.shift(); }catch(e){} }

/* ---------------- recordes ---------------- */
function best(lv){ try{ return +localStorage.getItem(K_BEST(lv)) || 0; }catch(e){ return 0; } }
function setBest(lv, v){ try{ localStorage.setItem(K_BEST(lv), v); }catch(e){} }

/* ---------------- telas ---------------- */
var G = null, timerId = null;

function preparando(){
  clearInterval(timerId);
  view.innerHTML = '<div class="vazio" role="status"><b>' + esc(TITULO) + '</b><span>Este quiz ainda está sendo preparado.</span></div>';
}

function heroTitulo(){
  var t = esc(C.heroTitulo || TITULO);
  return t.replace(/&lt;span&gt;/g, "<span>").replace(/&lt;\/span&gt;/g, "</span>");
}

function home(){
  clearInterval(timerId); G = null;
  if(!dadosOk()) return preparando();
  var temAlgum = false;
  var cards = NIVEL_KEYS.map(function(k, i){
    var l = NIVEIS[k] || {}, n = banco(k).length, cn = corNivel(i);
    if(n) temAlgum = true;
    return '<button class="level" type="button" data-lv="' + esc(k) + '" style="--bg:' + cn.bg + ';--fg:' + cn.fg + '"' + (n ? '' : ' aria-disabled="true"') + '>' +
      '<i>' + esc(l.tempo) + 's por pergunta · pontos ×' + esc(l.mult) + '</i>' +
      '<b>' + esc(l.nome || k) + '</b>' +
      (l.desc ? '<span>' + esc(l.desc) + '</span>' : '') +
      '<i>' + (n ? 'Recorde: ' + best(k) + ' pts' : 'Em breve') + '</i></button>';
  }).join("");
  if(!temAlgum) return preparando();
  var cnt = NIVEL_KEYS.length;
  view.innerHTML =
    '<div class="hero"><h1>' + heroTitulo() + '</h1>' + (C.heroTexto ? '<p>' + esc(C.heroTexto) + '</p>' : '') + '</div>' +
    '<div class="levels n' + cnt + '">' + cards + '</div>' +
    '<div class="rules"><span>❤️ 3 vidas</span><span>🔥 Combo ×2 com 3 acertos seguidos, ×3 com 5</span><span>✂️ 50/50 · ⏭️ Pular · ⏱️ +10s (1 de cada)</span><span>⌨️ Teclas 1–4</span></div>' +
    '<button class="linkbtn" id="cred" type="button">Créditos das imagens</button>';
  view.querySelectorAll(".level").forEach(function(b){
    b.onclick = function(){ if(b.getAttribute("aria-disabled") === "true") return; SFX.power(); start(b.dataset.lv); };
  });
  document.getElementById("cred").onclick = function(){ SFX.click(); creditos(); };
}

function creditos(){
  clearInterval(timerId);
  var vistos = {}, itens = [];
  NIVEL_KEYS.forEach(function(lv){
    banco(lv).forEach(function(q){
      var im = imagem(q.cena);
      if(!im || !srcImagem(im) || vistos[q.cena]) return;
      vistos[q.cena] = 1; itens.push(im);
    });
  });
  var lista = itens.length ? itens.map(function(im){
    var f = urlSegura(im.fonte), partes = [];
    if(im.autor) partes.push(esc(im.autor)); if(im.licenca) partes.push(esc(im.licenca));
    return '<li><b>' + esc(im.legenda || "Imagem") + '</b><span>' + (partes.join(" · ") || "Autor não informado") + '</span>' +
      (f ? ' · <a href="' + esc(f) + '" target="_blank" rel="noopener">fonte ↗</a>' : '') + '</li>';
  }).join("") : '<li>As imagens deste quiz ainda não têm créditos cadastrados.</li>';
  view.innerHTML = '<div class="creditos" style="display:flex;flex-direction:column;gap:12px"><h2>Créditos das imagens</h2>' +
    '<p>Fotos e imagens usadas para ambientar as perguntas.</p><ul>' + lista + '</ul>' +
    '<div><button class="ghost" id="back" type="button">← Voltar</button></div></div>';
  var back = document.getElementById("back"); back.onclick = function(){ SFX.click(); home(); }; back.focus({preventScroll:true});
}

function start(lv){
  var pool = banco(lv);
  if(!pool.length) return home();
  var qs = shuffle(pool).slice(0, PER_GAME);
  var usados = {}; qs.forEach(function(n){ usados[n.text] = 1; });
  var sobras = pool.filter(function(n){ return !usados[n.text]; });
  G = {lv:lv, qs:qs.map(montaQ), sobras:shuffle(sobras), i:0, score:0, lives:LIVES, streak:0, bestStreak:0, hits:0, log:[], tools:{fifty:1, skip:1, time:1}, locked:false};
  try{ if(parent !== window) parent.postMessage({tipo:"jogos:modo", modo:(NIVEIS[lv] && NIVEIS[lv].nome) || lv}, "*"); }catch(e){}   // o placar mostra o pódio deste nível
  ask();
}

function mult(){ return G.streak >= 5 ? 3 : G.streak >= 3 ? 2 : 1; }

function fotoHTML(q){
  var im = imagem(q.cena), src = srcImagem(im), leg = (im && im.legenda) || "";
  var h = hash(String(q.cena || q.text)), ks = ["destaque","alerta","acerto"], R = CORES._rgb;
  var g1 = R[ks[h % 3]].join(","), g2 = R[ks[(h + 1 + (h >> 3) % 2) % 3]].join(",");
  var credito = "";
  if(src && im){
    var f = urlSegura(im.fonte), ci = [];
    if(im.autor) ci.push(esc(im.autor)); if(im.licenca) ci.push(esc(im.licenca));
    if(ci.length) credito = '<p class="credit">Foto: ' + (f ? '<a href="' + esc(f) + '" target="_blank" rel="noopener">' + ci.join(" · ") + '</a>' : ci.join(" · ")) + '</p>';
  }
  return '<figure class="pic-col"><div class="photo" id="photo" style="--g1:' + g1 + ';--g2:' + g2 + '">' +
    '<div class="tema" aria-hidden="' + (src ? "true" : "false") + '"><span>' + esc(leg || TITULO) + '</span></div>' +
    (src ? '<img id="pimg" src="' + esc(src) + '" alt="' + esc((im && im.alt) || leg) + '" decoding="async">' : '') +
    (leg ? '<span class="chip" aria-hidden="true">' + esc(leg) + '</span>' : '') +
    '</div>' + credito + '</figure>';
}
function hash(s){ var h = 7; for(var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

function ligaFoto(){
  var photo = document.getElementById("photo"), img = document.getElementById("pimg");
  if(!photo || !img) return;
  var cred = view.querySelector(".credit");
  var ok = function(){ photo.classList.add("ok"); };
  var falha = function(){ img.remove(); photo.classList.remove("ok"); photo.querySelector(".tema").setAttribute("aria-hidden", "false"); if(cred) cred.remove(); };
  img.addEventListener("load", ok); img.addEventListener("error", falha);
  if(img.complete) (img.naturalWidth > 0 ? ok : falha)();
}

function ask(){
  var q = G.qs[G.i], L = NIVEIS[G.lv];
  G.left = +L.tempo || 20; G.locked = false;
  view.innerHTML =
    '<div class="hud">' +
      '<span class="pill">' + esc(L.nome || G.lv) + ' · ' + (G.i + 1) + '/' + G.qs.length + '</span>' +
      '<span class="pill lives" role="img" aria-label="' + G.lives + ' ' + (G.lives === 1 ? "vida" : "vidas") + '">' + "❤️".repeat(G.lives) + "🖤".repeat(LIVES - G.lives) + '</span>' +
      '<span class="pill combo">' + (G.streak >= 3 ? '🔥 ×' + mult() : 'Combo ×1') + '</span>' +
      '<span class="pill">⭐ ' + G.score + '</span>' +
    '</div>' +
    '<div class="timer" id="tm" aria-hidden="true"><div id="bar"></div></div>' +
    '<div class="scene">' + fotoHTML(q) +
      '<div><div class="qnum">Pergunta ' + (G.i + 1) + ' · <span id="sec">' + G.left + '</span>s</div><p class="question">' + esc(q.text) + '</p></div>' +
    '</div>' +
    '<div class="answers" role="group" aria-label="Respostas">' + q.opts.map(function(o, n){ return '<button class="ans" type="button" data-o="' + esc(o) + '"><span class="k" aria-hidden="true">' + (n + 1) + '</span><span>' + esc(o) + '</span></button>'; }).join("") + '</div>' +
    '<div class="tools" id="tools">' +
      '<button class="tool" type="button" id="t-fifty"' + (G.tools.fifty ? "" : " disabled") + '>✂️ 50/50</button>' +
      '<button class="tool" type="button" id="t-skip"' + (G.tools.skip ? "" : " disabled") + '>⏭️ Pular</button>' +
      '<button class="tool" type="button" id="t-time"' + (G.tools.time ? "" : " disabled") + '>⏱️ +10s</button>' +
    '</div>' +
    '<div id="fb" aria-live="polite"></div>';
  ligaFoto();
  view.querySelectorAll(".ans").forEach(function(b){ b.onclick = function(){ answer(b); }; });
  document.getElementById("t-fifty").onclick = function(){
    if(G.locked || !G.tools.fifty) return; G.tools.fifty = 0; SFX.power();
    shuffle([].slice.call(view.querySelectorAll(".ans")).filter(function(b){ return b.dataset.o !== q.right; })).slice(0, 2).forEach(function(b){ b.classList.add("gone"); b.disabled = true; });
    document.getElementById("t-fifty").disabled = true;
  };
  document.getElementById("t-skip").onclick = function(){
    if(G.locked || !G.tools.skip) return; G.tools.skip = 0; SFX.power(); clearInterval(timerId);
    // troca por outra pergunta inédita do mesmo nível, se houver
    if(G.sobras.length){ G.qs[G.i] = montaQ(G.sobras.shift()); ask(); }
    else { G.log.push({q:q.text, ok:null, right:q.right}); nextQ(true); }
  };
  document.getElementById("t-time").onclick = function(){
    if(G.locked || !G.tools.time) return; G.tools.time = 0; SFX.power(); G.left += 10; G.max = G.left; paintTimer(); document.getElementById("t-time").disabled = true;
  };
  G.max = G.left; paintTimer();
  clearInterval(timerId);
  timerId = setInterval(function(){ G.left--; paintTimer(); if(G.left <= 5 && G.left > 0) SFX.tick(); if(G.left <= 0){ clearInterval(timerId); answer(null); } }, 1000);
  preCarrega(G.qs[G.i + 1]);
  if(window.scrollY > 0) window.scrollTo(0, 0);
}
function paintTimer(){
  var bar = document.getElementById("bar"), tm = document.getElementById("tm"), s = document.getElementById("sec");
  if(!bar) return; bar.style.transform = "scaleX(" + Math.max(0, G.left / G.max) + ")"; tm.classList.toggle("warn", G.left <= 5); s.textContent = Math.max(0, G.left);
}

function answer(btn){
  if(!G || G.locked) return; G.locked = true; clearInterval(timerId);
  var q = G.qs[G.i], ok = !!btn && btn.dataset.o === q.right;
  view.querySelectorAll(".ans").forEach(function(b){ b.disabled = true; if(b.dataset.o === q.right) b.classList.add("ok"); });
  var tools = document.getElementById("tools"); if(tools) tools.hidden = true;
  var pts = 0;
  if(ok){
    G.streak++; G.bestStreak = Math.max(G.bestStreak, G.streak); G.hits++;
    pts = Math.round((100 + G.left * 10) * (+NIVEIS[G.lv].mult || 1) * mult());
    G.score = Math.min(MAX_PONTOS, G.score + pts); SFX.ok(); fl("ok");
    if(G.streak === 3 || G.streak === 5) setTimeout(function(){ confetti(60); }, 150);
  } else { if(btn) btn.classList.add("bad"); G.streak = 0; G.lives--; SFX.bad(); fl("bad"); }
  G.log.push({q:q.text, ok:ok, right:q.right});
  var msg = ok ? pick(ACERTOS) : btn ? pick(ERROS) : TEMPO_ESGOTADO;
  var fb = document.getElementById("fb");
  fb.innerHTML = '<div class="feedback ' + (ok ? "ok" : "bad") + '">' +
      '<b>' + esc(msg) + '</b>' +
      (ok ? '<span class="pts">+' + pts + ' pontos' + (mult() > 1 ? ' · combo ×' + mult() : '') + '</span>'
          : '<span>Resposta certa: <strong>' + esc(q.right) + '</strong>' + (G.lives > 0 ? ' · restam ' + G.lives + ' ' + (G.lives === 1 ? 'vida' : 'vidas') : '') + '</span>') +
      (q.fact ? '<span>💡 ' + esc(q.fact) + '</span>' : '') +
      (q.fonte ? '<a class="lei" href="' + esc(q.fonte) + '" target="_blank" rel="noopener">' + esc(CFG.rotuloFonte || 'Ver a fonte') + ' ↗</a>' : '') +
    '</div>' +
    '<div class="fbrow"><button class="next" type="button" id="nx">' + (G.lives <= 0 || G.i === G.qs.length - 1 ? "Ver resultado" : "Próxima →") + '</button></div>';
  var nx = document.getElementById("nx"); nx.onclick = function(){ SFX.click(); nextQ(); }; nx.focus({preventScroll:true});
  try{ nx.scrollIntoView({block:"nearest", behavior: reduzido() ? "auto" : "smooth"}); }catch(e){}
}
function fl(k){ flash.className = "flash"; void flash.offsetWidth; flash.className = "flash " + k; }
function nextQ(){ if(G.lives <= 0 || G.i >= G.qs.length - 1) return end(); G.i++; ask(); }

function end(){
  clearInterval(timerId);
  var lv = G.lv, total = G.qs.length, pontos = Math.min(MAX_PONTOS, G.score), rec = pontos > best(lv);
  if(rec) setBest(lv, pontos);
  var nomeNivel = (NIVEIS[lv] && NIVEIS[lv].nome) || lv;
  try{ if(parent !== window) parent.postMessage({tipo:"jogos:fim", pontos:pontos, nivel:nomeNivel, modo:nomeNivel}, "*"); }catch(e){}
  var won = G.lives > 0, pct = G.hits / total;
  var rank = !won ? RES.derrota : pct === 1 ? RES.perfeito : pct >= .8 ? RES.otimo : pct >= .6 ? RES.bom : RES.raspando;
  var log = G.log, s = G;
  view.innerHTML =
    '<div class="view end">' +
      '<h2>' + (won ? "Partida concluída!" : "Acabaram as vidas") + '</h2>' +
      (rec && pontos > 0 ? '<span class="newrec">NOVO RECORDE · ' + esc(nomeNivel.toUpperCase()) + '</span>' : '') +
      '<div class="big">' + pontos + '<small> pts</small></div>' +
      '<p class="rank">' + esc(rank) + '</p>' +
      '<div class="stats"><div><b>' + s.hits + '/' + total + '</b><span>Acertos</span></div><div><b>' + s.bestStreak + '</b><span>Maior combo</span></div><div><b>' + best(lv) + '</b><span>Recorde</span></div></div>' +
      '<div class="endbtns"><button class="next" type="button" id="again">Jogar de novo</button><button class="ghost" type="button" id="menu">Trocar nível</button></div>' +
      '<div class="review" tabindex="0" aria-label="Revisão das respostas">' + log.map(function(l, n){
        return '<div>' + (l.ok ? "✅" : l.ok === null ? "⏭️" : "❌") + ' <em>' + (n + 1) + '.</em> ' + esc(l.q) + ' <br><small>Resposta: ' + esc(l.right) + '</small></div>';
      }).join("") + '</div>' +
    '</div>';
  G.over = true;
  document.getElementById("again").onclick = function(){ SFX.power(); start(lv); };
  document.getElementById("menu").onclick = function(){ SFX.click(); home(); };
  document.getElementById("again").focus({preventScroll:true});
  if(won && pct >= .6){ SFX.win(); confetti(); } else SFX.lose();
}

document.addEventListener("keydown", function(e){
  if(!G || G.over || e.ctrlKey || e.metaKey || e.altKey) return;
  if(!G.locked && /^[1-4]$/.test(e.key)){
    var b = view.querySelectorAll(".ans")[+e.key - 1]; if(b && !b.disabled) answer(b);
  } else if(e.key === "Enter" && G.locked){
    var nx = document.getElementById("nx"); if(nx){ e.preventDefault(); nx.click(); }
  }
});

/* controle: direcional escolhe, A confirma, B volta ao menu */
if(window.Controle) Controle.navegar({ voltar: function(){ var b = document.getElementById("menu") || document.getElementById("back"); if(b) b.click(); } });

home();
})();
