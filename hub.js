/* Hub: placar, medalhas, comemoração e navegação. Depende de JOGOS (definida no index.html) e de placar-config.js. */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const player=document.getElementById("player"), frame=document.getElementById("frame"), ptitle=document.getElementById("ptitle");
const JOGAVEIS=JOGOS.filter(j=>!j.emBreve);

/* ================= Placar =================
   Com Supabase configurado em placar-config.js, o placar é compartilhado por todos.
   Sem configuração, as pontuações ficam só neste navegador. */
const CFG=window.PLACAR||{};
const ONLINE=!!(CFG.supabaseUrl&&CFG.supabaseAnonKey);
const LOCAL_KEY="jogos-placar-v1";

const Placar=ONLINE?(()=>{
  const base=CFG.supabaseUrl.replace(/\/+$/,"").replace(/\/rest\/v1$/,"")+"/rest/v1/placar"; // aceita a URL com ou sem /rest/v1
  const h={apikey:CFG.supabaseAnonKey};
  if(/^eyJ/.test(CFG.supabaseAnonKey)) h.Authorization="Bearer "+CFG.supabaseAnonKey; // chave anon antiga (JWT)
  const campos="select=id,nome,pontos,nivel,criado_em";
  async function get(q,extra){
    const r=await fetch(base+"?"+q,{headers:{...h,...extra}});
    if(!r.ok) throw new Error("HTTP "+r.status);
    return r;
  }
  return {
    async topo(jogo){ return (await get(`${campos}&jogo=eq.${encodeURIComponent(jogo)}&order=pontos.desc,criado_em.asc&limit=10`)).json() },
    async recentes(jogo){ return (await get(`${campos}&jogo=eq.${encodeURIComponent(jogo)}&order=criado_em.desc&limit=100`)).json() },
    async salvar(item){
      const r=await fetch(base+"?"+campos,{method:"POST",headers:{...h,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(item)});
      if(!r.ok) throw new Error("HTTP "+r.status);
      return (await r.json())[0];
    },
    async posicao(jogo,pontos){
      const r=await get(`select=id&jogo=eq.${encodeURIComponent(jogo)}&pontos=gt.${pontos}&limit=1`,{Prefer:"count=exact"});
      const total=+(r.headers.get("content-range")||"").split("/")[1];
      return Number.isFinite(total)?total+1:null;
    }
  };
})():(()=>{
  const ler=()=>{try{return JSON.parse(localStorage.getItem(LOCAL_KEY))||[]}catch(e){return []}};
  const doJogo=j=>ler().filter(x=>x.jogo===j);
  const ordem=(a,b)=>b.pontos-a.pontos||a.criado_em.localeCompare(b.criado_em);
  return {
    async topo(jogo){ return doJogo(jogo).sort(ordem).slice(0,10) },
    async recentes(jogo){ return doJogo(jogo).sort((a,b)=>b.criado_em.localeCompare(a.criado_em)).slice(0,100) },
    async salvar(item){
      const novo={...item,id:Date.now()+"-"+Math.random().toString(36).slice(2,7),criado_em:new Date().toISOString()};
      const todos=ler(); todos.push(novo);
      localStorage.setItem(LOCAL_KEY,JSON.stringify(todos.slice(-1000)));
      return novo;
    },
    async posicao(jogo,pontos){ return doJogo(jogo).filter(x=>x.pontos>pontos).length+1 }
  };
})();

const fmt=n=>Number(n).toLocaleString("pt-BR");
const $=id=>document.getElementById(id);
const mk=(tag,cls,txt)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e };
const board=$("board"), toggle=$("rank-toggle"), sendForm=$("send"), nomeInp=$("nome");
let pendente=null, meuId=null, boardGen=0;
$("src").textContent=ONLINE?"Online":"Só neste navegador";
$("src").classList.toggle("on",ONLINE);
$("src").title=ONLINE?"Pontuações compartilhadas entre todos os jogadores":"Sem servidor configurado: as pontuações ficam salvas apenas neste navegador";

/* ================= Medalhas e troféus =================
   Metais: [brilho, tom médio, sombra, cor do número]. Cada SVG tem ids próprios para os gradientes. */
const METAIS={1:["#fff1b8","#e9b824","#9c6a00","#6b4700"],2:["#ffffff","#c3cad4","#7b8594","#4b5563"],3:["#ffd9b8","#cd8a52","#8a4f22","#5c3210"]};
let _uid=0; const uid=p=>p+(++_uid);
const estrela=(x,y,s,d)=>`<g transform="translate(${x} ${y}) scale(${s})"><path class="sp" style="animation-delay:${d}s" d="M0-5Q.8-.8 5 0Q.8.8 0 5Q-.8.8-5 0Q-.8-.8 0-5Z" fill="#fff" stroke="#fff6cf" stroke-width=".4"/></g>`;
const SPARKS=[[16,38,.9,0],[86,30,.7,1.1],[90,78,1,.6],[10,80,.65,1.7]];
const brilhos=(pts)=>pts.map(p=>estrela(...p)).join("");

/* coroa de louros: folhas com gradiente, duas fileiras por lado */
function coroaDeLouros(cx,cy,r1,r2,n,gid){
  let out="";
  for(const lado of [1,-1]) for(let k=0;k<n;k++){
    const a=106+k*(n>6?17:19), t=a*Math.PI/180;
    for(const [r,tilt] of [[r1,-38],[r2,38]]){
      const x=cx+lado*r*Math.cos(t), y=cy+r*Math.sin(t), rot=lado*(a+90+tilt);
      out+=`<g transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7.4" ry="3.2" fill="url(#${gid})" stroke="#7a5408" stroke-width=".7"/><path d="M${(x-5.5).toFixed(1)} ${y.toFixed(1)}H${(x+5.5).toFixed(1)}" stroke="#fff6cf" stroke-opacity=".7" stroke-width=".5"/></g>`;
    }
  }
  return out;
}

function medalha(lugar){
  const [hi,mid,lo,txt]=METAIS[lugar], id=uid("m"), cy=62, atraso=(lugar*1.3).toFixed(1);
  return `<svg viewBox="0 0 100 100" role="img" aria-label="${lugar}º lugar">
    <defs>
      <linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset=".5" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></linearGradient>
      <linearGradient id="${id}i" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${hi}"/><stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></linearGradient>
      <radialGradient id="${id}f" cx="36%" cy="28%" r="85%"><stop offset="0" stop-color="${hi}"/><stop offset=".5" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></radialGradient>
      <linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a8"/><stop offset=".55" stop-color="#d9a826"/><stop offset="1" stop-color="#9a6d12"/></linearGradient>
      <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${id}e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4a74dd"/><stop offset="1" stop-color="#1f3a85"/></linearGradient>
      <linearGradient id="${id}d" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff6a5c"/><stop offset="1" stop-color="#b02a22"/></linearGradient>
      <clipPath id="${id}c"><circle cx="50" cy="${cy}" r="24"/></clipPath>
    </defs>
    <path d="M33 0H49L62 48H46Z" fill="url(#${id}b)"/><path d="M67 0H51L38 48H54Z" fill="url(#${id}d)"/>
    <path d="M35 0 48 48" stroke="#fff" stroke-opacity=".35" stroke-width="1"/><path d="M65 0 52 48" stroke="#fff" stroke-opacity=".3" stroke-width="1"/>
    ${lugar===1?coroaDeLouros(50,cy,31,40,7,id+"l"):""}
    <ellipse cx="50" cy="92" rx="22" ry="3" fill="#000" opacity=".18"/>
    <circle cx="50" cy="${cy}" r="25" fill="url(#${id}r)" stroke="${lo}" stroke-width="1.2"/>
    <circle cx="50" cy="${cy}" r="23.2" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5" stroke-dasharray="1 1.7"/>
    <circle cx="50" cy="${cy}" r="20" fill="url(#${id}i)" stroke="${lo}" stroke-opacity=".6" stroke-width=".8"/>
    <circle cx="50" cy="${cy}" r="18" fill="url(#${id}f)"/>
    <circle cx="50" cy="${cy}" r="15.5" fill="none" stroke="${hi}" stroke-opacity=".75" stroke-width=".9"/>
    <text x="50" y="${cy+8.4}" text-anchor="middle" font-family="Bowlby One SC, Arial Black, sans-serif" font-size="22" fill="${hi}" opacity=".85" transform="translate(-.5 -.7)">${lugar}</text>
    <text x="50" y="${cy+8.4}" text-anchor="middle" font-family="Bowlby One SC, Arial Black, sans-serif" font-size="22" fill="${txt}">${lugar}</text>
    <ellipse cx="41" cy="${cy-12}" rx="11" ry="5.4" transform="rotate(-38 41 ${cy-12})" fill="url(#${id}e)" opacity=".75"/>
    <g clip-path="url(#${id}c)"><g class="sheen" style="animation-delay:${atraso}s"><rect x="24" y="34" width="12" height="64" fill="url(#${id}s)" transform="rotate(24 30 62)"/></g></g>
    ${brilhos(SPARKS.map(([x,y,s,d])=>[x,y,s,(d+lugar*.4).toFixed(1)]))}
  </svg>`;
}

/* Troféu do pódio: copa com bisel e reflexo no metal do lugar (o de ouro ganha louros) */
function trofeu(lugar){
  const [hi,mid,lo,txt]=METAIS[lugar], id=uid("t");
  const cup="M38 20h44v16c0 20-10 34-22 34S38 56 38 36z";
  return `<svg viewBox="0 0 120 120" role="img" aria-label="Troféu de ${lugar}º lugar">
    <defs>
      <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${lo}"/><stop offset=".16" stop-color="${mid}"/><stop offset=".3" stop-color="${hi}"/><stop offset=".5" stop-color="${mid}"/><stop offset=".78" stop-color="${lo}"/><stop offset=".9" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></linearGradient>
      <linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset=".4" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></linearGradient>
      <linearGradient id="${id}o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1203"/><stop offset="1" stop-color="${lo}"/></linearGradient>
      <linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a8"/><stop offset=".55" stop-color="#d9a826"/><stop offset="1" stop-color="#9a6d12"/></linearGradient>
      <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <clipPath id="${id}c"><path d="${cup}"/></clipPath>
    </defs>
    ${lugar===1?coroaDeLouros(60,66,40,49,5,id+"l"):""}
    <ellipse cx="60" cy="109" rx="30" ry="4" fill="#000" opacity=".22"/>
    <path d="M39 27H30C21 27 21 49 40 53" fill="none" stroke="${lo}" stroke-width="6.4" stroke-linecap="round"/><path d="M81 27H90C99 27 99 49 80 53" fill="none" stroke="${lo}" stroke-width="6.4" stroke-linecap="round"/>
    <path d="M39 27H30C21 27 21 49 40 53" fill="none" stroke="url(#${id}v)" stroke-width="4.6" stroke-linecap="round"/><path d="M81 27H90C99 27 99 49 80 53" fill="none" stroke="url(#${id}v)" stroke-width="4.6" stroke-linecap="round"/>
    <path d="M38 26H31C25 27 24.5 38 31 45" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M54 68H66L64 82H56Z" fill="url(#${id}m)" stroke="${lo}" stroke-width="1"/>
    <ellipse cx="60" cy="71" rx="10" ry="3.4" fill="url(#${id}v)" stroke="${lo}" stroke-width="1"/>
    <path d="${cup}" fill="url(#${id}m)" stroke="${lo}" stroke-width="1.6"/>
    <path d="M41.5 25C41.5 40 46 53 55 61" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M78 28C78 40 74 51 68 58" fill="none" stroke="${lo}" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="60" cy="20" rx="22.6" ry="5.4" fill="url(#${id}v)" stroke="${lo}" stroke-width="1.4"/>
    <ellipse cx="60" cy="20.6" rx="19.6" ry="3.8" fill="url(#${id}o)"/>
    <path d="M42 19.6Q60 24 78 19.6" fill="none" stroke="${hi}" stroke-opacity=".6" stroke-width=".8"/>
    <text x="60" y="49.5" text-anchor="middle" font-family="Bowlby One SC, Arial Black, sans-serif" font-size="19" fill="${hi}" opacity=".9" transform="translate(-.6 -.8)">${lugar}º</text>
    <text x="60" y="49.5" text-anchor="middle" font-family="Bowlby One SC, Arial Black, sans-serif" font-size="19" fill="${txt}">${lugar}º</text>
    <g clip-path="url(#${id}c)"><g class="sheen" style="animation-delay:.6s"><rect x="20" y="10" width="13" height="70" fill="url(#${id}s)" transform="rotate(22 26 45)"/></g></g>
    <ellipse cx="60" cy="83" rx="13" ry="3.4" fill="url(#${id}v)" stroke="${lo}" stroke-width="1"/>
    <path d="M45 84H75L80 94H40Z" fill="url(#${id}m)" stroke="${lo}" stroke-width="1.2"/><path d="M47 86H73" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>
    <rect x="33" y="94" width="54" height="13" rx="2.5" fill="#2a2230" stroke="${lo}" stroke-width="1.2"/><rect x="33" y="94" width="54" height="3" rx="1.5" fill="#fff" opacity=".12"/>
    <rect x="45" y="98" width="30" height="5" rx="1.6" fill="url(#${id}v)"/><path d="M47 99.2H73" stroke="#fff" stroke-opacity=".7" stroke-width=".8"/>
    ${brilhos([[16,30,1.3,0],[104,26,1,.9],[102,76,1.5,.5],[18,86,1,1.6],[60,6,1.1,1.2]])}
  </svg>`;
}

/* ================= Comemoração (cartão sólido) ================= */
const FRASES={
  1:{t:"Topo do placar!",d:(n,j)=>`${n}, ninguém fez mais pontos que você em ${j}. A coroa de louros é sua.`},
  2:{t:"Medalha de prata!",d:(n,j)=>`${n}, só uma pessoa fez mais pontos que você em ${j}. Falta pouco para o topo.`},
  3:{t:"Bronze garantido!",d:(n,j)=>`${n}, você subiu ao pódio de ${j}. Agora é mirar mais alto.`}
};
const semMovimento=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
let confeteRaf=0;
function confete(cor){
  const cv=$("confete"); cancelAnimationFrame(confeteRaf);
  if(semMovimento()) return;
  const ctx=cv.getContext("2d"), dpr=Math.min(2,devicePixelRatio||1);
  cv.width=cv.clientWidth*dpr; cv.height=cv.clientHeight*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
  const W=cv.clientWidth, Hh=cv.clientHeight, cores=[...cor,"#ffffff","#e2453a","#2d4fa3","#39c27a"];
  const novo=(burst,i)=>{
    if(burst){ const a=Math.random()*Math.PI*2, v=3+Math.random()*8; return {x:W/2,y:Hh*.27,vx:Math.cos(a)*v,vy:Math.sin(a)*v-3,g:.17,r:Math.random()*6.3,vr:(Math.random()-.5)*.35,s:5+Math.random()*7,c:cores[i%cores.length]} }
    return {x:Math.random()*W,y:-12,vx:(Math.random()-.5)*1.6,vy:1.4+Math.random()*2.6,g:.012,r:Math.random()*6.3,vr:(Math.random()-.5)*.25,s:5+Math.random()*7,c:cores[(Math.random()*cores.length)|0]};
  };
  let ps=Array.from({length:110},(_,i)=>novo(true,i)), frame=0;
  (function loop(){
    ctx.clearRect(0,0,W,Hh); frame++;
    if(frame<150) for(let k=0;k<2;k++) ps.push(novo(false));
    ps=ps.filter(p=>p.y<Hh+20);
    for(const p of ps){ p.vx*=.992; p.vy+=p.g; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.c; ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2); ctx.restore() }
    if(ps.length||frame<150) confeteRaf=requestAnimationFrame(loop);
  })();
}
let AC=null;
function fanfarra(lugar){
  try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==="suspended") AC.resume() }catch(e){ return }
  const notas=lugar===1?[523,659,784,1047,784,1047,1319]:lugar===2?[523,659,784,1047]:[440,554,659,880];
  notas.forEach((f,i)=>{
    const t=AC.currentTime+i*.13, o=AC.createOscillator(), g=AC.createGain();
    o.type="triangle"; o.frequency.setValueAtTime(f,t);
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.12,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+(i===notas.length-1?.9:.22));
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t+1);
  });
}
let focoAntes=null;
function celebrar(lugar,item){
  const j=JOGOS.find(x=>x.id===item.jogo), f=FRASES[lugar], c=$("celebra");
  c.className="celebra l"+lugar;
  $("trofeu").innerHTML=trofeu(lugar);
  $("ceyebrow").textContent=`${lugar}º lugar · ${j?j.titulo:""}${item.nivel?" · "+item.nivel:""}`;
  $("ctitle").textContent=f.t;
  $("cdesc").textContent=f.d(item.nome,j?j.titulo:"este jogo");
  $("cpts").textContent=fmt(item.pontos)+" pontos";
  focoAntes=document.activeElement;
  c.hidden=false; $("c-placar").focus();
  confete([METAIS[lugar][1],METAIS[lugar][0]]); fanfarra(lugar);
}
function fecharCelebra(){ const c=$("celebra"); if(c.hidden) return; c.hidden=true; cancelAnimationFrame(confeteRaf) }
$("c-placar").onclick=()=>{ fecharCelebra(); abrirPlacar(true); $("podium").scrollIntoView({block:"nearest"}); $("bclose").focus() };
$("c-again").onclick=()=>{ fecharCelebra(); abrirPlacar(false); const j=JOGAVEIS.find(x=>x.id===atual); if(j){ frame.src=j.arquivo; frame.focus() } };
$("celebra").addEventListener("keydown",e=>{
  if(e.key!=="Tab") return;
  const bs=[$("c-placar"),$("c-again")], i=bs.indexOf(document.activeElement);
  e.preventDefault(); bs[(i+(e.shiftKey?-1:1)+bs.length)%bs.length].focus();
});

/* ================= Barra do placar ================= */
function setVazio(html){ const e=$("empty"); e.hidden=!html; e.innerHTML=html||"" }

const COLUNAS=[2,1,3];
function degrau(lugar,x,voce){
  const li=mk("li","pd p"+lugar+(x?"":" vazio")+(voce?" you":""));
  const who=mk("div","pd-who"), medal=mk("span","pd-medal");
  if(x){
    medal.innerHTML=medalha(lugar); who.appendChild(medal);
    if(voce) who.appendChild(mk("span","tagyou","você"));
    const nm=mk("span","nm",x.nome); nm.title=x.nome; who.appendChild(nm);
    const p=mk("span","pts",fmt(x.pontos)); p.appendChild(mk("small",null,"pts")); who.appendChild(p);
    if(x.nivel) who.appendChild(mk("span","lv",x.nivel));
  }else{
    li.setAttribute("aria-hidden","true");
    medal.appendChild(mk("span",null,lugar+"º")); who.appendChild(medal);
  }
  li.appendChild(who);
  li.appendChild(mk("div","pd-step")).appendChild(mk("b",null,String(lugar)));
  return li;
}
function podio(lista){
  const ol=mk("ol","podio");
  ol.setAttribute("aria-label","Pódio");
  for(const l of [1,2,3]){ const x=lista[l-1]; ol.appendChild(degrau(l,x,x&&String(x.id)===String(meuId))) }
  return ol;
}
function esqueleto(){
  const col=(f,h)=>`<div class="sk-col${f?" f":""}"><span class="c sk"></span><span class="l1 sk"></span><span class="l2 sk"></span><span class="st sk" style="height:${h}px"></span></div>`;
  $("podium").innerHTML=`<div class="sk-pod" aria-hidden="true">${col(false,60)}${col(true,84)}${col(false,44)}</div>
    <div class="sk-rows" aria-hidden="true">${'<span class="r sk"></span>'.repeat(4)}</div>`;
}

async function carregarPlacar(){
  const jogo=atual, gen=++boardGen;
  if(!jogo) return;
  setVazio(""); $("rest").innerHTML=""; esqueleto();
  $("podium").setAttribute("aria-busy","true");
  let lista;
  try{ lista=await Placar.topo(jogo) }
  catch(e){
    if(gen!==boardGen) return;
    $("podium").removeAttribute("aria-busy"); $("podium").replaceChildren(podio([]));
    setVazio(`<strong>Sem conexão com o placar</strong>Não foi possível carregar. Verifique sua conexão.<button class="linkbtn" type="button" id="retry">Tentar de novo</button>`);
    $("retry").onclick=carregarPlacar; return;
  }
  if(gen!==boardGen) return;
  $("podium").removeAttribute("aria-busy");
  $("podium").replaceChildren(podio(lista));
  if(!lista.length){ setVazio(`<strong>Ninguém pontuou ainda</strong>Termine uma partida e seja o primeiro do placar.`); return }
  const topo=Math.max(1,lista[0].pontos), rest=$("rest");
  lista.slice(3).forEach((x,i)=>{
    const li=mk("li",String(x.id)===String(meuId)?"you":"");
    li.style.setProperty("--w",Math.max(4,Math.round(x.pontos/topo*100))+"%"); li.style.setProperty("--i",i);
    li.title=(x.nivel?x.nivel+" · ":"")+fmt(x.pontos)+" pontos";
    li.appendChild(mk("span","pos",String(i+4)));
    const who=mk("span","who"); who.appendChild(mk("span","nm",x.nome)); if(x.nivel) who.appendChild(mk("span","lv",x.nivel));
    li.appendChild(who); li.appendChild(mk("span","pts",fmt(x.pontos)));
    rest.appendChild(li);
  });
}

function abrirPlacar(abrir){
  board.classList.toggle("open",abrir);
  toggle.setAttribute("aria-expanded",abrir);
}
toggle.onclick=()=>abrirPlacar(!board.classList.contains("open"));
$("bclose").onclick=()=>abrirPlacar(false);

function limparEnvio(){ pendente=null; sendForm.hidden=true; $("saved").hidden=true; $("smsg").textContent=""; $("smsg").className="msg" }

addEventListener("message",e=>{
  // Os jogos ficam no mesmo site; o Chrome nem sempre informa o iframe como remetente, então a checagem é pela origem.
  if(!atual||(e.origin!==location.origin&&e.source!==frame.contentWindow)) return;
  const d=e.data;
  if(!d||d.tipo!=="jogos:fim") return;
  const pontos=Math.round(+d.pontos);
  if(!Number.isFinite(pontos)||pontos<=0) return;   // partida sem pontos não entra no placar
  pendente={jogo:atual,pontos,nivel:String(d.nivel||"").slice(0,40)};
  $("ypts").textContent=fmt(pontos)+" pts";
  $("ylv").textContent=pendente.nivel;
  $("saved").hidden=true; $("smsg").textContent=""; $("smsg").className="msg";
  $("salvar").disabled=false;
  try{ nomeInp.value=nomeInp.value||localStorage.getItem("jogos-nome")||"" }catch(err){}
  sendForm.hidden=false;
  board.scrollTop=0;
  abrirPlacar(true);
  if(matchMedia("(min-width:900px)").matches) nomeInp.focus({preventScroll:true});
});

sendForm.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!pendente) return;
  const nome=nomeInp.value.replace(/[\u0000-\u001f\u007f]/g,"").replace(/\s+/g," ").trim().slice(0,20);
  if(!nome){ $("smsg").className="msg err"; $("smsg").textContent="Escreva um nome para aparecer no placar."; nomeInp.focus(); return }
  const item={...pendente,nome};
  $("salvar").disabled=true; $("smsg").className="msg"; $("smsg").textContent="Salvando…";
  try{
    const salvo=await Placar.salvar(item);
    try{ localStorage.setItem("jogos-nome",nome) }catch(err){}
    meuId=salvo&&salvo.id;
    let pos=null; try{ pos=await Placar.posicao(item.jogo,item.pontos) }catch(err){}
    pendente=null; sendForm.hidden=true;
    $("saved").textContent=`Pontuação salva! ${pos?`Você está em ${pos}º lugar com ${fmt(item.pontos)} pontos.`:`${fmt(item.pontos)} pontos.`}`;
    $("saved").hidden=false;
    carregarPlacar();
    if(pos&&pos<=3) celebrar(pos,item);
  }catch(err){
    $("salvar").disabled=false; $("smsg").className="msg err";
    $("smsg").textContent=ONLINE?"Não foi possível salvar agora. Verifique sua conexão e tente de novo.":"Este navegador não permitiu salvar a pontuação.";
  }
});

/* Últimas 100 */
const recent=$("recent");
function quando(iso){
  const d=new Date(iso), s=(Date.now()-d)/1000;
  if(s<60) return "agora";
  if(s<3600) return `há ${Math.floor(s/60)} min`;
  if(s<86400) return `há ${Math.floor(s/3600)} h`;
  if(s<7*86400) return `há ${Math.floor(s/86400)} ${Math.floor(s/86400)===1?"dia":"dias"}`;
  return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"short",year:"numeric"});
}
$("recent-btn").onclick=async()=>{
  const j=JOGAVEIS.find(x=>x.id===atual); if(!j) return;
  $("rtitle").textContent="Últimas 100 · "+j.titulo;
  $("rbody").innerHTML=`<p class="empty">Carregando…</p>`;
  if(typeof recent.showModal==="function") recent.showModal(); else recent.setAttribute("open","");
  try{
    const lista=await Placar.recentes(atual);
    if(!lista.length){ $("rbody").innerHTML=`<p class="empty">Nenhuma pontuação salva ainda.</p>`; return }
    $("rbody").innerHTML=`<table><thead><tr><th>Quando</th><th>Nome</th><th>Nível</th><th class="num">Pontos</th></tr></thead><tbody>${
      lista.map(x=>`<tr><td class="when" title="${esc(new Date(x.criado_em).toLocaleString("pt-BR"))}">${esc(quando(x.criado_em))}</td><td class="nm"></td><td class="lvl"></td><td class="num">${fmt(x.pontos)}</td></tr>`).join("")
    }</tbody></table>`;
    [...$("rbody").querySelectorAll("tbody tr")].forEach((tr,i)=>{ tr.querySelector(".nm").textContent=lista[i].nome; tr.querySelector(".lvl").textContent=lista[i].nivel||"—" });
  }catch(err){ $("rbody").innerHTML=`<p class="empty">Não foi possível carregar as pontuações. Verifique sua conexão e tente de novo.</p>` }
};
$("rclose").onclick=()=>recent.close?recent.close():recent.removeAttribute("open");
recent.addEventListener("click",e=>{ if(e.target===recent) recent.close() });

/* ================= Navegação ================= */
let atual=null;
function route(){
  const id=decodeURIComponent(location.hash.slice(1));
  const j=JOGAVEIS.find(x=>x.id===id);   // jogos "em breve" não abrem
  if(j){
    if(atual!==j.id){
      frame.src=j.arquivo; frame.title=j.titulo; ptitle.textContent=j.titulo; document.title=j.titulo+" · Jogos Interativos";
      const [g1,g2]=j.cor||["#ff6b2c","#14213d"];
      for(const el of [board,recent]){ el.style.setProperty("--g1",g1); el.style.setProperty("--g2",g2) }
      $("bgame").textContent=j.titulo;
      atual=j.id; meuId=null; limparEnvio(); abrirPlacar(false); carregarPlacar();
      saiuDaTelaCheia=false; abrirFab(false);
    }
    player.hidden=false; document.body.classList.add("playing");
    frame.focus(); telaCheiaAoTocar();
  }else{
    const saindo=atual; atual=null;
    player.hidden=true; document.body.classList.remove("playing");
    frame.removeAttribute("src"); frame.src="about:blank"; /* para sons e cronômetros do jogo */
    limparEnvio(); fecharCelebra(); sairTelaCheia();
    document.title="Jogos Interativos";
    if(saindo){ const b=document.getElementById("play-"+saindo); if(b) b.focus({preventScroll:false}) }
  }
}
function fechar(){ if(location.hash.length>1) location.hash=""; else route() }
document.getElementById("back").addEventListener("click",e=>{e.preventDefault();fechar()});
document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&!$("celebra").hidden){ fecharCelebra(); return } if(e.key==="Escape"&&atual&&!recent.open&&!document.fullscreenElement){ if(board.classList.contains("open")&&!matchMedia("(min-width:900px)").matches) abrirPlacar(false); else fechar() } });
/* ================= Tela cheia e celular deitado ================= */
// A página inteira entra em tela cheia (não só o jogador), para a comemoração do pódio aparecer por cima.
function pedirTelaCheia(){
  if(document.fullscreenElement||!document.fullscreenEnabled) return false;
  try{ const p=document.documentElement.requestFullscreen({navigationUI:"hide"}); if(p&&p.catch) p.catch(()=>{}); return true }catch(e){ return false }
}
function sairTelaCheia(){ if(document.fullscreenElement) try{ document.exitFullscreen().catch(()=>{}) }catch(e){} }
document.getElementById("full").addEventListener("click",()=>{ document.fullscreenElement?sairTelaCheia():pedirTelaCheia() });

// Celular deitado: o CSS esconde a barra e o placar; aqui o jogo entra em tela cheia no primeiro toque.
// O navegador só deixa pedir tela cheia logo depois de um toque; o jogo fica no mesmo site, então o toque dentro do iframe vale.
const DEITADO=matchMedia("(orientation:landscape) and (max-height:540px)");
const fab=$("fab"), fabTab=$("fab-tab");
let saiuDaTelaCheia=false;   // a pessoa saiu da tela cheia de propósito: não insistir até girar de novo ou trocar de jogo
function telaCheiaAoTocar(){ if(atual&&DEITADO.matches&&!saiuDaTelaCheia) pedirTelaCheia() }
function abrirFab(abrir){ fab.classList.toggle("open",abrir); fabTab.setAttribute("aria-expanded",abrir) }
fabTab.onclick=()=>{ abrirFab(!fab.classList.contains("open")); telaCheiaAoTocar() };
$("fab-back").onclick=()=>{ abrirFab(false); fechar() };
$("fab-rank").onclick=()=>{ abrirFab(false); abrirPlacar(!board.classList.contains("open")) };
$("fab-full").onclick=()=>{ abrirFab(false); if(document.fullscreenElement){ saiuDaTelaCheia=true; sairTelaCheia() } else { saiuDaTelaCheia=false; pedirTelaCheia() } };
$("fab-full").hidden=!document.fullscreenEnabled;   // iPhone não tem tela cheia para páginas; lá basta esconder a barra
document.addEventListener("fullscreenchange",()=>{ if(!document.fullscreenElement&&atual&&DEITADO.matches) saiuDaTelaCheia=true });
DEITADO.addEventListener("change",()=>{
  saiuDaTelaCheia=false; abrirFab(false);
  if(!DEITADO.matches&&document.fullscreenElement) sairTelaCheia();
});
frame.addEventListener("load",()=>{
  let doc=null; try{ doc=frame.contentDocument }catch(e){}
  if(!doc) return;
  for(const ev of ["touchend","pointerup","keydown"]) doc.addEventListener(ev,()=>{ abrirFab(false); telaCheiaAoTocar() },{capture:true,passive:true});
});
addEventListener("hashchange",route);
route();
