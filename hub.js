/* Hub: placar, troféus, comemoração e navegação. Depende de JOGOS (definida no index.html) e de placar-config.js. */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const player=document.getElementById("player"), frame=document.getElementById("frame"), ptitle=document.getElementById("ptitle");
const JOGAVEIS=JOGOS.filter(j=>!j.emBreve);

/* ================= Placar =================
   Com Supabase configurado em placar-config.js, o placar é compartilhado por todos.
   Sem configuração, as pontuações ficam só neste navegador. */
const CFG=window.PLACAR||{};
const ONLINE=!!(CFG.supabaseUrl&&CFG.supabaseAnonKey);
const LOCAL_KEY="jogos-placar-v1";

/* ================= Modos =================
   Jogos com níveis, pistas, temas ou classes têm um placar para cada modo, para ninguém disputar
   o Fácil contra o Difícil. Os eixos vêm de JOGOS[i].modos (ex.: Tema × Nível); o jogo conta em qual
   jogou com {modo:"Difícil"} ou {modo:["Futebol","Difícil"]} no jogos:fim.
   Cada modo é um "quadro": a coluna jogo do placar vira "id--opcao-opcao" (sem mudar a tabela).
   Com legado:true, as pontuações de antes dos modos entram no quadro cujo nome era o nível enviado;
   legado:{"opcao-opcao":"Nível"} diz a mão em qual quadro cada nível antigo entra.
   Opção ["id","Nome",{arquivo:true}]: quadro só de pontuações antigas; partida nova nunca cai nele. */
const slug=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
const EIXOS=new Map(JOGOS.map(j=>[j.id,(j.modos||[]).map(e=>({...e,opcoes:e.opcoes.map(o=>Array.isArray(o)?{id:o[0],nome:o[1],...o[2]}:{id:slug(o),nome:o})}))]));
function quadro(jogo,ids){
  const ex=EIXOS.get(jogo)||[];
  if(!ex.length) return {jogo,chave:jogo,rotulo:"",ids:[],legado:null};
  const ops=ex.map((e,i)=>e.opcoes.find(o=>o.id===ids[i])||e.opcoes[0]);
  const rotulo=ops.map(o=>o.nome).join(" · "), j=JOGOS.find(x=>x.id===jogo), sel=ops.map(o=>o.id);
  const legado=!j||!j.legado?null:j.legado===true?rotulo:j.legado[sel.join("-")]||null;
  return {jogo,chave:jogo+"--"+sel.join("-"),rotulo,ids:sel,legado};
}
function quadros(jogo){   // todos os modos do jogo (para dar nome às linhas das últimas 100)
  let l=[[]];
  for(const e of EIXOS.get(jogo)||[]) l=l.flatMap(p=>e.opcoes.map(o=>[...p,o.id]));
  return l.map(ids=>quadro(jogo,ids));
}
/* traduz o modo mandado pelo jogo em ids de opção; o que faltar fica como está escolhido no placar */
function modoRecebido(jogo,d,escolhido){
  const ex=EIXOS.get(jogo)||[], veio=[].concat(d.modo==null?[]:d.modo);
  return ex.map((e,i)=>{
    const acha=v=>v!=null&&slug(v)&&e.opcoes.find(o=>!o.arquivo&&(o.id===slug(v)||slug(o.nome)===slug(v)));
    let o=acha(veio[i]);
    if(!o&&ex.length===1) o=acha(d.nivel);   // jogo antigo, que mandava o modo no nível
    const novo=veio[i]!=null&&slug(veio[i]).slice(0,16);
    if(!o&&e.livre&&novo&&!e.opcoes.some(x=>x.id===novo)){ o={id:novo,nome:String(veio[i]).slice(0,30)}; e.opcoes.push(o) }
    return (o||e.opcoes.find(x=>x.id===escolhido[i]&&!x.arquivo)||e.opcoes.find(x=>!x.arquivo)).id;
  });
}

const Placar=ONLINE?(()=>{
  const base=CFG.supabaseUrl.replace(/\/+$/,"").replace(/\/rest\/v1$/,"")+"/rest/v1/placar"; // aceita a URL com ou sem /rest/v1
  const h={apikey:CFG.supabaseAnonKey};
  if(/^eyJ/.test(CFG.supabaseAnonKey)) h.Authorization="Bearer "+CFG.supabaseAnonKey; // chave anon antiga (JWT)
  const campos="select=id,jogo,nome,pontos,nivel,criado_em";
  const filtro=q=>q.legado
    ?"or="+encodeURIComponent(`(jogo.eq."${q.chave}",and(jogo.eq."${q.jogo}",nivel.eq."${q.legado}"))`)
    :"jogo=eq."+encodeURIComponent(q.chave);
  async function get(q,extra){
    const r=await fetch(base+"?"+q,{headers:{...h,...extra}});
    if(!r.ok) throw new Error("HTTP "+r.status);
    return r;
  }
  return {
    async topo(q){ return (await get(`${campos}&${filtro(q)}&order=pontos.desc,criado_em.asc&limit=10`)).json() },
    async recentes(jogo){ return (await get(`${campos}&or=${encodeURIComponent(`(jogo.eq."${jogo}",jogo.like."${jogo}--*")`)}&order=criado_em.desc&limit=100`)).json() },
    async salvar(item){
      const r=await fetch(base+"?"+campos,{method:"POST",headers:{...h,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(item)});
      if(!r.ok) throw new Error("HTTP "+r.status);
      return (await r.json())[0];
    },
    async posicao(q,pontos){
      const r=await get(`select=id&${filtro(q)}&pontos=gt.${pontos}&limit=1`,{Prefer:"count=exact"});
      const total=+(r.headers.get("content-range")||"").split("/")[1];
      return Number.isFinite(total)?total+1:null;
    }
  };
})():(()=>{
  const ler=()=>{try{return JSON.parse(localStorage.getItem(LOCAL_KEY))||[]}catch(e){return []}};
  const doQuadro=q=>ler().filter(x=>x.jogo===q.chave||(q.legado&&x.jogo===q.jogo&&x.nivel===q.legado));
  const ordem=(a,b)=>b.pontos-a.pontos||a.criado_em.localeCompare(b.criado_em);
  return {
    async topo(q){ return doQuadro(q).sort(ordem).slice(0,10) },
    async recentes(jogo){ return ler().filter(x=>x.jogo===jogo||x.jogo.startsWith(jogo+"--")).sort((a,b)=>b.criado_em.localeCompare(a.criado_em)).slice(0,100) },
    async salvar(item){
      const novo={...item,id:Date.now()+"-"+Math.random().toString(36).slice(2,7),criado_em:new Date().toISOString()};
      const todos=ler(); todos.push(novo);
      localStorage.setItem(LOCAL_KEY,JSON.stringify(todos.slice(-1000)));
      return novo;
    },
    async posicao(q,pontos){ return doQuadro(q).filter(x=>x.pontos>pontos).length+1 }
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

/* ================= Troféus =================
   Metais: [brilho, tom médio, sombra, cor do número]. Cada SVG tem ids próprios para os gradientes. */
const METAIS={1:["#fff1b8","#e9b824","#9c6a00","#6b4700"],2:["#ffffff","#c3cad4","#7b8594","#4b5563"],3:["#ffd9b8","#cd8a52","#8a4f22","#5c3210"]};
let _uid=0; const uid=p=>p+(++_uid);
const estrela=(x,y,s,d)=>`<g transform="translate(${x} ${y}) scale(${s})"><path class="sp" style="animation-delay:${d}s" d="M0-5Q.8-.8 5 0Q.8.8 0 5Q-.8.8-5 0Q-.8-.8 0-5Z" fill="#fff" stroke="#fff6cf" stroke-width=".4"/></g>`;
const brilhos=(pts)=>pts.map(p=>estrela(...p)).join("");

/* Troféu em SVG: o mesmo do 3D (trofeu3d.js), visto de frente e um pouco de cima. A copa e as alças saem
   do perfil do torno do 3D (Trofeu3D.forma); a base de ébano tem o friso e a placa de metal.
   No pódio do placar a placa diz só "1º"; na comemoração (reserva do 3D, sem WebGL ou sem three.js) diz "1º LUGAR". */
const TROFEU_K=38, tx=x=>+(60+x*TROFEU_K).toFixed(2), ty=y=>+(114-y*TROFEU_K).toFixed(2);
const curvaSvg=pts=>{   // Catmull-Rom pelos pontos, em cúbicas
  let d=`M${pts[0][0]} ${pts[0][1]}`;
  for(let i=0;i<pts.length-1;i++){
    const a=pts[Math.max(0,i-1)], b=pts[i], c=pts[i+1], e=pts[Math.min(pts.length-1,i+2)], f=(u,v,w)=>+(u+(v-w)/6).toFixed(2);
    d+=`C${f(b[0],c[0],a[0])} ${f(b[1],c[1],a[1])} ${f(c[0],b[0],e[0])} ${f(c[1],b[1],e[1])} ${c[0]} ${c[1]}`;
  }
  return d;
};
let _forma=null;
function formaTrofeu(){
  if(_forma) return _forma;
  const F=window.Trofeu3D&&Trofeu3D.forma;
  if(!F) return null;
  const topo=F.PERFIL.reduce((m,p,i,a)=>p[1]>a[m][1]?i:m,0);   // topo da borda virada: dali em diante é o lado de dentro
  const fora=F.PERFIL.slice(0,topo+1).map(([x,y])=>[x,y+F.COPA_Y]);
  const lado=[...fora].reverse().map(([x,y])=>[tx(-x),ty(y)]).concat(fora.map(([x,y])=>[tx(x),ty(y)]));
  const borda=fora[fora.length-1];
  const alca=s=>curvaSvg(F.ALCA.map(([x,y])=>[tx(s*x),ty(y+F.COPA_Y)]));
  return _forma={copa:curvaSvg(lado)+"Z",alcaD:alca(1),alcaE:alca(-1),borda,anel:[.664,1.48+F.COPA_Y],estrela:F.COPA_Y+1.74};
}
function estrela5(cx,cy,r1,r2){
  let d="";
  for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, r=i%2?r2:r1; d+=(i?"L":"M")+(cx+Math.cos(a)*r).toFixed(2)+" "+(cy+Math.sin(a)*r).toFixed(2) }
  return d+"Z";
}
function trofeu(lugar,grande){
  const [hi,mid,lo,txt]=METAIS[lugar], id=uid("t"), F=formaTrofeu();
  if(!F) return "";
  const caixa=(w,y0,y1,r,fill,stroke)=>`<rect x="${tx(-w/2)}" y="${ty(y1)}" width="${(w*TROFEU_K).toFixed(1)}" height="${((y1-y0)*TROFEU_K).toFixed(1)}" rx="${r}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width=".8"`:""}/>`;
  const [bx,by]=F.borda, RY=.16;   // a borda vista um pouco de cima
  const [ax,ay]=F.anel;
  const placa=grande?`${lugar}º LUGAR`:`${lugar}º`;
  return `<svg viewBox="0 0 120 120" role="img" aria-label="Troféu de ${lugar}º lugar">
    <defs>
      <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${lo}"/><stop offset=".12" stop-color="${mid}"/><stop offset=".3" stop-color="${hi}"/><stop offset=".48" stop-color="${mid}"/><stop offset=".76" stop-color="${lo}"/><stop offset=".9" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></linearGradient>
      <linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset=".45" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></linearGradient>
      <linearGradient id="${id}o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1203"/><stop offset=".7" stop-color="${lo}"/><stop offset="1" stop-color="${mid}"/></linearGradient>
      <linearGradient id="${id}e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3542"/><stop offset=".12" stop-color="#16131b"/><stop offset="1" stop-color="#050407"/></linearGradient>
      <linearGradient id="${id}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity=".15"/></linearGradient>
      <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <clipPath id="${id}c"><path d="${F.copa}"/></clipPath>
    </defs>
    <ellipse cx="60" cy="115" rx="34" ry="3.4" fill="#000" opacity=".25"/>
    <path d="${F.alcaD}" fill="none" stroke="${lo}" stroke-width="5.2" stroke-linecap="round"/><path d="${F.alcaE}" fill="none" stroke="${lo}" stroke-width="5.2" stroke-linecap="round"/>
    <path d="${F.alcaD}" fill="none" stroke="url(#${id}v)" stroke-width="3.6" stroke-linecap="round"/><path d="${F.alcaE}" fill="none" stroke="url(#${id}v)" stroke-width="3.6" stroke-linecap="round"/>
    <path d="${F.alcaE}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1" stroke-linecap="round" transform="translate(-.6 -.8)"/>
    ${caixa(1.62,0,.3,3.4,`url(#${id}e)`)}<rect x="${tx(-.79)}" y="${ty(.3)}" width="${(1.58*TROFEU_K).toFixed(1)}" height="1" rx=".5" fill="#fff" opacity=".18"/>
    ${caixa(1.4,.29,.33,1,`url(#${id}m)`,lo)}
    ${caixa(1.32,.33,.54,2.6,`url(#${id}e)`)}<rect x="${tx(-.64)}" y="${ty(.54)}" width="${(1.28*TROFEU_K).toFixed(1)}" height=".9" rx=".45" fill="#fff" opacity=".16"/>
    ${caixa(.92,.35,.52,1,`url(#${id}m)`,lo)}<rect x="${tx(-.43)}" y="${ty(.495)}" width="${(.86*TROFEU_K).toFixed(1)}" height="${(.12*TROFEU_K).toFixed(1)}" rx=".6" fill="none" stroke="${lo}" stroke-opacity=".7" stroke-width=".5"/>
    <text x="60" y="${ty(.4)}" text-anchor="middle" font-family="Bowlby One SC, Arial Black, sans-serif" font-size="${grande?3.4:5.2}" fill="${txt}">${placa}</text>
    <path d="${F.copa}" fill="url(#${id}m)" stroke="${lo}" stroke-width="1.3"/>
    <g clip-path="url(#${id}c)">
      <rect x="${tx(-.5)}" y="${ty(2.62)}" width="${(.42*TROFEU_K).toFixed(1)}" height="${(.62*TROFEU_K).toFixed(1)}" rx="3" fill="url(#${id}r)" opacity=".55"/>
      <path d="M${tx(.6)} ${ty(2.75)}C${tx(.55)} ${ty(2.2)} ${tx(.4)} ${ty(1.9)} ${tx(.12)} ${ty(1.74)}" fill="none" stroke="${lo}" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"/>
      <path d="M${tx(-.13)} ${ty(1.4)}C${tx(-.1)} ${ty(1.1)} ${tx(-.09)} ${ty(.9)} ${tx(-.12)} ${ty(.66)}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>
      <g class="sheen" style="animation-delay:.6s"><rect x="20" y="0" width="13" height="80" fill="url(#${id}s)" transform="rotate(22 26 45)"/></g>
    </g>
    <path d="M${tx(-ax)} ${ty(ay)}A${(ax*TROFEU_K).toFixed(2)} ${(ax*TROFEU_K*RY).toFixed(2)} 0 0 0 ${tx(ax)} ${ty(ay)}" fill="none" stroke="${lo}" stroke-width="2.2"/>
    <path d="M${tx(-ax)} ${ty(ay)}A${(ax*TROFEU_K).toFixed(2)} ${(ax*TROFEU_K*RY).toFixed(2)} 0 0 0 ${tx(ax)} ${ty(ay)}" fill="none" stroke="${hi}" stroke-opacity=".8" stroke-width=".9" transform="translate(0 -.5)"/>
    <ellipse cx="60" cy="${ty(by)}" rx="${(bx*TROFEU_K).toFixed(2)}" ry="${(bx*TROFEU_K*RY).toFixed(2)}" fill="url(#${id}v)" stroke="${lo}" stroke-width="1.1"/>
    <ellipse cx="60" cy="${(ty(by)+.6).toFixed(2)}" rx="${((bx-.07)*TROFEU_K).toFixed(2)}" ry="${((bx-.07)*TROFEU_K*RY).toFixed(2)}" fill="url(#${id}o)"/>
    <path d="${estrela5(60,ty(F.estrela),.17*TROFEU_K,.072*TROFEU_K)}" fill="url(#${id}v)" stroke="${lo}" stroke-width=".8" stroke-linejoin="round"/>
    ${brilhos([[14,30,1.2,0+lugar*.4],[106,22,.9,.9+lugar*.4],[104,70,1.3,.5+lugar*.4],[16,84,.9,1.6+lugar*.4]])}
  </svg>`;
}

/* ================= Comemoração (cartão sólido) ================= */
const FRASES={
  1:{t:"Topo do placar!",d:(n,j)=>`${n}, ninguém fez mais pontos que você em ${j}. O troféu de ouro é seu.`},
  2:{t:"Medalha de prata!",d:(n,j)=>`${n}, só uma pessoa fez mais pontos que você em ${j}. Falta pouco para o topo.`},
  3:{t:"Bronze garantido!",d:(n,j)=>`${n}, você subiu ao pódio de ${j}. Agora é mirar mais alto.`}
};
const POUSO={1:1.6,2:1.05,3:1.05};   // segundos até o troféu 3D pousar (igual ao trofeu3d.js)
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
/* subida de notas enquanto o troféu chega e o acorde no pouso */
function fanfarra(lugar,pouso){
  try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==="suspended") AC.resume() }catch(e){ return }
  const nota=(f,t,dur,vol,tipo)=>{
    const o=AC.createOscillator(), g=AC.createGain(); t+=AC.currentTime;
    o.type=tipo||"triangle"; o.frequency.setValueAtTime(f,t);
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.012); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t+dur+.05);
  };
  const subida=lugar===1?[392,523,659,784,1047]:lugar===2?[523,659,784]:[440,554,659];
  const passo=Math.max(.1,(pouso-.08)/subida.length);
  subida.forEach((f,i)=>nota(f,i*passo,.2,.09));
  const acorde=lugar===1?[523,659,784,1047,1319]:lugar===2?[523,659,1047]:[440,659,880];
  acorde.forEach((f,i)=>{ nota(f,pouso,lugar===1?1.6:1,.07); if(lugar===1&&i<2) nota(f/2,pouso,1.3,.05,"sawtooth") });
  if(lugar===1) [1047,1319,1568,2093].forEach((f,i)=>nota(f,pouso+.35+i*.09,.35,.035,"sine"));   // brilhinho depois do pouso
}
let focoAntes=null, celebraVez=0;
function celebrar(lugar,item,q){
  const j=JOGOS.find(x=>x.id===q.jogo), f=FRASES[lugar], c=$("celebra"), vez=++celebraVez;
  const nomeJogo=(j?j.titulo:"este jogo")+(q.rotulo?` (${q.rotulo})`:"");
  c.className="celebra l"+lugar;
  $("ceyebrow").textContent=`${lugar}º lugar · ${j?j.titulo:""}${q.rotulo?" · "+q.rotulo:""}`;
  $("ctitle").textContent=f.t;
  $("cdesc").textContent=f.d(item.nome,nomeJogo);
  $("cpts").textContent=fmt(item.pontos)+" pontos";
  focoAntes=document.activeElement;
  c.hidden=false; $("c-placar").focus();
  const pousou=()=>{ if(vez!==celebraVez||c.hidden||c.classList.contains("pousou")) return; c.classList.add("pousou"); confete([METAIS[lugar][1],METAIS[lugar][0]]) };
  const parado=semMovimento(), musica=()=>fanfarra(lugar,parado?.3:POUSO[lugar]);
  const svg=()=>{ const t=$("trofeu"); t.className="trofeu svg"; t.innerHTML=trofeu(lugar,true); musica(); setTimeout(pousou,parado?0:700) };
  const caixa=$("trofeu"); caixa.className="trofeu"; caixa.innerHTML="";
  setTimeout(pousou,4500);   // por garantia: o texto nunca fica escondido
  if(!window.Trofeu3D){ svg(); return }
  // o three.js já vem baixando desde o fim da partida; se não chegar logo, fica o SVG
  Promise.race([Trofeu3D.preparar(),new Promise(r=>setTimeout(()=>r(false),1500))]).then(ok=>{
    if(vez!==celebraVez||c.hidden) return;
    if(!ok||!Trofeu3D.montar(caixa,lugar,{aoComecar:musica,aoPousar:pousou,parado})) svg();
  });
}
function fecharCelebra(){
  const c=$("celebra"); if(c.hidden) return;
  c.hidden=true; celebraVez++; cancelAnimationFrame(confeteRaf);
  if(window.Trofeu3D) Trofeu3D.parar();
}
$("c-placar").onclick=()=>{ fecharCelebra(); abrirPlacar(true); $("podium").scrollIntoView({block:"nearest"}); $("bclose").focus() };
$("c-again").onclick=()=>{ fecharCelebra(); abrirPlacar(false); const j=JOGAVEIS.find(x=>x.id===atual); if(j){ frame.src=endereco(j); frame.focus() } };
$("celebra").addEventListener("keydown",e=>{
  if(e.key!=="Tab") return;
  const bs=[$("c-placar"),$("c-again")], i=bs.indexOf(document.activeElement);
  e.preventDefault(); bs[(i+(e.shiftKey?-1:1)+bs.length)%bs.length].focus();
});

/* ================= Barra do placar ================= */
function setVazio(html){ const e=$("empty"); e.hidden=!html; e.innerHTML=html||"" }

/* escolha de modo: uma fileira por eixo (botões; lista quando são muitas opções) */
let escolha=[];
const MODO_KEY=j=>"jogos-modo:"+j;
function lerEscolha(jogo){
  let ids=[]; try{ ids=JSON.parse(localStorage.getItem(MODO_KEY(jogo)))||[] }catch(e){}
  return quadro(jogo,ids).ids;
}
function guardarEscolha(){ try{ localStorage.setItem(MODO_KEY(atual),JSON.stringify(escolha)) }catch(e){} }
function desenharModos(){
  const box=$("modos"), ex=EIXOS.get(atual)||[];
  box.hidden=!ex.length; box.replaceChildren();
  ex.forEach((e,i)=>{
    const row=mk("div","modo"), rot=mk("span","mrot",e.nome);
    rot.id="mrot"+i; row.appendChild(rot);
    if(e.opcoes.length>5){
      const s=mk("select","msel"); s.setAttribute("aria-labelledby",rot.id);
      for(const o of e.opcoes){ const op=mk("option",null,o.nome); op.value=o.id; s.appendChild(op) }
      s.value=escolha[i]; s.onchange=()=>escolher(i,s.value);
      row.appendChild(s);
    }else{
      const g=mk("div","chips"); g.setAttribute("role","group"); g.setAttribute("aria-labelledby",rot.id);
      for(const o of e.opcoes){
        const b=mk("button","chip",o.nome); b.type="button"; b.setAttribute("aria-pressed",o.id===escolha[i]);
        b.onclick=()=>escolher(i,o.id); g.appendChild(b);
      }
      row.appendChild(g);
    }
    box.appendChild(row);
  });
}
/* mostra no placar o modo dado; devolve true se mudou */
function mostrarModo(ids){
  if(ids.join()===escolha.join()) return false;
  escolha=ids; guardarEscolha(); desenharModos();
  return true;
}
/* O jogo avisa o modo quando a partida começa ({tipo:"jogos:modo", modo}): o placar acompanha,
   para quem está jogando ver o pódio que está disputando. */
function seguirModo(d){
  if(!(EIXOS.get(atual)||[]).length||d.modo==null) return;
  if(!mostrarModo(modoRecebido(atual,d,escolha))) return;
  carregarPlacar();
  const m=$("modos"); m.classList.remove("trocou"); void m.offsetWidth; m.classList.add("trocou");
}
function escolher(i,id){
  if(escolha[i]===id) return;
  escolha[i]=id; guardarEscolha();
  const foco=document.activeElement&&document.activeElement.closest("#modos")?i:-1;
  desenharModos(); carregarPlacar();
  if(foco>=0){ const el=$("modos").children[foco].querySelector('[aria-pressed="true"],select'); if(el) el.focus() }
}
/* o nível só aparece na linha quando diz algo além do modo (Fase 3, Onda 2…) */
const detalhe=(x,q)=>x.nivel&&x.nivel!==q.rotulo&&!q.rotulo.split(" · ").includes(x.nivel)?x.nivel:"";

const COLUNAS=[2,1,3];
function degrau(lugar,x,voce,q){
  const li=mk("li","pd p"+lugar+(x?"":" vazio")+(voce?" you":""));
  const who=mk("div","pd-who"), medal=mk("span","pd-medal");
  if(x){
    medal.innerHTML=trofeu(lugar); who.appendChild(medal);
    if(voce) who.appendChild(mk("span","tagyou","você"));
    const nm=mk("span","nm",x.nome); nm.title=x.nome; who.appendChild(nm);
    const p=mk("span","pts",fmt(x.pontos)); p.appendChild(mk("small",null,"pts")); who.appendChild(p);
    if(detalhe(x,q)) who.appendChild(mk("span","lv",detalhe(x,q)));
  }else{
    li.setAttribute("aria-hidden","true");
    medal.appendChild(mk("span",null,lugar+"º")); who.appendChild(medal);
  }
  li.appendChild(who);
  li.appendChild(mk("div","pd-step")).appendChild(mk("b",null,String(lugar)));
  return li;
}
function podio(lista,q){
  const ol=mk("ol","podio");
  ol.setAttribute("aria-label","Pódio"+(q.rotulo?" · "+q.rotulo:""));
  for(const l of [1,2,3]){ const x=lista[l-1]; ol.appendChild(degrau(l,x,x&&String(x.id)===String(meuId),q)) }
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
  const q=quadro(jogo,escolha);
  setVazio(""); $("rest").innerHTML=""; esqueleto();
  $("podium").setAttribute("aria-busy","true");
  let lista;
  try{ lista=await Placar.topo(q) }
  catch(e){
    if(gen!==boardGen) return;
    $("podium").removeAttribute("aria-busy"); $("podium").replaceChildren(podio([],q));
    setVazio(`<strong>Sem conexão com o placar</strong>Não foi possível carregar. Verifique sua conexão.<button class="linkbtn" type="button" id="retry">Tentar de novo</button>`);
    $("retry").onclick=carregarPlacar; return;
  }
  if(gen!==boardGen) return;
  $("podium").removeAttribute("aria-busy");
  $("podium").replaceChildren(podio(lista,q));
  // pontuação esperando para ser salva e que entra no pódio: já vai baixando o troféu 3D
  if(pendente&&pendente.q.chave===q.chave&&(lista.length<3||pendente.pontos>lista[2].pontos)&&window.Trofeu3D) Trofeu3D.preparar();
  if(!lista.length){ setVazio(`<strong>Ninguém pontuou ainda${q.rotulo?" em "+esc(q.rotulo):""}</strong>Termine uma partida nesse modo e seja o primeiro do placar.`); return }
  const topo=Math.max(1,lista[0].pontos), rest=$("rest");
  lista.slice(3).forEach((x,i)=>{
    const li=mk("li",String(x.id)===String(meuId)?"you":""), det=detalhe(x,q);
    li.style.setProperty("--w",Math.max(4,Math.round(x.pontos/topo*100))+"%"); li.style.setProperty("--i",i);
    li.title=(det?det+" · ":"")+fmt(x.pontos)+" pontos";
    li.appendChild(mk("span","pos",String(i+4)));
    const who=mk("span","who"); who.appendChild(mk("span","nm",x.nome)); if(det) who.appendChild(mk("span","lv",det));
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
  if(d&&d.tipo==="jogos:modo"){ seguirModo(d); return }
  if(!d||d.tipo!=="jogos:fim") return;
  const pontos=Math.round(+d.pontos);
  if(!Number.isFinite(pontos)||pontos<=0) return;   // partida sem pontos não entra no placar
  const q=quadro(atual,modoRecebido(atual,d,escolha));
  pendente={q,pontos,nivel:String(d.nivel||"").slice(0,40)};
  mostrarModo(q.ids);   // o placar passa a mostrar o modo em que a partida foi jogada
  carregarPlacar();
  const det=detalhe(pendente,q);
  $("ypts").textContent=fmt(pontos)+" pts";
  $("ylv").textContent=[q.rotulo,det].filter(Boolean).join(" · ");
  $("saved").hidden=true; $("smsg").textContent=""; $("smsg").className="msg";
  $("salvar").disabled=false;
  try{ nomeInp.value=nomeInp.value||localStorage.getItem("jogos-nome")||"" }catch(err){}
  sendForm.hidden=false;
  board.scrollTop=0;
  abrirPlacar(true);
  if(matchMedia("(min-width:900px)").matches) nomeInp.focus({preventScroll:true});
  if(padUsado()){ noPlacar=true; if(window.Controle) Controle.focar(nomeInp) }
});

/* melhor pontuação deste navegador em cada modo (a primeira partida salva só marca a referência) */
function novoRecorde(q,pontos){
  const k="jogos-recorde:"+q.chave;
  try{
    const antes=+localStorage.getItem(k)||0;
    if(pontos>antes) localStorage.setItem(k,String(pontos));
    return antes>0&&pontos>antes;
  }catch(e){ return false }
}

sendForm.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!pendente) return;
  const nome=nomeInp.value.replace(/[\u0000-\u001f\u007f]/g,"").replace(/\s+/g," ").trim().slice(0,20);
  if(!nome){ $("smsg").className="msg err"; $("smsg").textContent="Escreva um nome para aparecer no placar."; nomeInp.focus(); return }
  const {q}=pendente, item={jogo:q.chave,nome,pontos:pendente.pontos,nivel:pendente.nivel};
  $("salvar").disabled=true; $("smsg").className="msg"; $("smsg").textContent="Salvando…";
  try{
    const salvo=await Placar.salvar(item);
    try{ localStorage.setItem("jogos-nome",nome) }catch(err){}
    meuId=salvo&&salvo.id;
    let pos=null; try{ pos=await Placar.posicao(q,item.pontos) }catch(err){}
    const recorde=novoRecorde(q,item.pontos);
    pendente=null; sendForm.hidden=true;
    mostrarModo(q.ids);
    const onde=q.rotulo?` em ${q.rotulo}`:"";
    $("saved").textContent=`Pontuação salva!${recorde?" Novo recorde pessoal.":""} ${pos?`Você está em ${pos}º lugar${onde} com ${fmt(item.pontos)} pontos.`:`${fmt(item.pontos)} pontos.`}`;
    $("saved").hidden=false;
    carregarPlacar();
    if(pos&&pos<=3) celebrar(pos,item,q);
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
    const comModos=(EIXOS.get(atual)||[]).length>0, nomes=new Map(quadros(atual).map(q=>[q.chave,q]));
    // modo e nível juntos ("Difícil · Fase 3"); pontuação de antes dos modos mostra só o nível que tinha
    const modo=x=>{ const q=nomes.get(x.jogo); return q?[q.rotulo,detalhe(x,q)].filter(Boolean).join(" · "):x.nivel||"—" };
    $("rbody").innerHTML=`<table><thead><tr><th>Quando</th><th>Nome</th><th>${comModos?"Modo":"Nível"}</th><th class="num">Pontos</th></tr></thead><tbody>${
      lista.map(x=>`<tr><td class="when" title="${esc(new Date(x.criado_em).toLocaleString("pt-BR"))}">${esc(quando(x.criado_em))}</td><td class="nm"></td><td class="lvl"></td><td class="num">${fmt(x.pontos)}</td></tr>`).join("")
    }</tbody></table>`;
    [...$("rbody").querySelectorAll("tbody tr")].forEach((tr,i)=>{ tr.querySelector(".nm").textContent=lista[i].nome; tr.querySelector(".lvl").textContent=modo(lista[i]) });
  }catch(err){ $("rbody").innerHTML=`<p class="empty">Não foi possível carregar as pontuações. Verifique sua conexão e tente de novo.</p>` }
};
$("rclose").onclick=()=>recent.close?recent.close():recent.removeAttribute("open");
recent.addEventListener("click",e=>{ if(e.target===recent) recent.close() });

/* ================= Navegação =================
   O endereço é #id-do-jogo; o que vier depois de "?" vai para o jogo (ex.: #adedanha?sala=K7QF). */
let atual=null;
const lerHash=(h=location.hash)=>{ const [id,params=""]=decodeURIComponent(h.slice(1)).split("?"); return {id,params} };
const endereco=j=>{ const {id,params}=lerHash(); return j.arquivo+(id===j.id&&params?"?"+params:"") };
function route(e){
  const {id,params}=lerHash();
  const j=JOGAVEIS.find(x=>x.id===id);   // jogos "em breve" não abrem
  if(j){
    // outro convite para o jogo que já está aberto (ex.: link de outra sala do Adedanha): recarrega o jogo com ele.
    // Compara com o endereço anterior, que já inclui o que o próprio jogo mudou com replaceState.
    const antes=e&&e.oldURL?lerHash(new URL(e.oldURL).hash):null;
    if(atual===j.id&&params&&antes&&antes.params!==params) frame.src=endereco(j);
    if(atual!==j.id){
      frame.src=endereco(j); frame.title=j.titulo; ptitle.textContent=j.titulo; document.title=j.titulo+" · Jogos Interativos";
      const [g1,g2]=j.cor||["#ff6b2c","#14213d"];
      for(const el of [board,recent]){ el.style.setProperty("--g1",g1); el.style.setProperty("--g2",g2) }
      $("bgame").textContent=j.titulo;
      atual=j.id; meuId=null; escolha=lerEscolha(j.id); limparEnvio(); desenharModos(); abrirPlacar(false); carregarPlacar();
      saiuDaTelaCheia=false; abrirFab(false);
    }
    player.hidden=false; travarFundo(true);
    frame.focus(); telaCheiaAoTocar();
  }else{
    const saindo=atual; atual=null;
    player.hidden=true; travarFundo(false);
    frame.removeAttribute("src"); frame.src="about:blank"; /* para sons e cronômetros do jogo */
    limparEnvio(); fecharCelebra(); sairTelaCheia();
    document.title="Jogos Interativos";
    if(saindo){ const b=document.getElementById("play-"+saindo); if(b) b.focus({preventScroll:false}) }
  }
}
function fechar(){ if(location.hash.length>1) location.hash=""; else route() }
/* Com um jogo aberto, a grade atrás fica presa no lugar. No iPhone, ao abrir o teclado num campo de texto
   do jogo, o Safari rolava a grade, e o cursor e a seleção do campo apareciam deslocados do texto.
   Ao fechar o jogo, a grade volta para onde estava. */
let fundoY=0;
function travarFundo(on){
  const b=document.body;
  if(on===b.classList.contains("playing")) return;
  if(on){ fundoY=scrollY; b.style.top=-fundoY+"px"; b.classList.add("playing") }
  else{ b.classList.remove("playing"); b.style.top=""; scrollTo(0,fundoY) }
}
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

/* ================= Controle (gamepad) =================
   Na grade: direcional escolhe, A abre. Dentro do jogo o controle é do jogo;
   Select + Start volta para a grade. No fim da partida o placar recebe o controle
   (A no nome abre o teclado na tela, B volta para o jogo). */
let noPlacar=false;
function padUsado(){
  if(!window.Controle) return false;
  let w=null; try{ w=frame.contentWindow }catch(e){}
  try{ return Controle.usado||!!(w&&w.Controle&&w.Controle.usado) }catch(e){ return Controle.usado }
}
if(window.Controle){
  const celebraAberta=()=>!$("celebra").hidden;
  Controle.navegar({
    ativo:()=>!atual||celebraAberta()||noPlacar||recent.open,
    raiz:()=>recent.open?recent:celebraAberta()?$("celebra"):(atual?board:document),
    voltar:()=>{
      if(recent.open){ recent.close?recent.close():recent.removeAttribute("open"); return }
      if(celebraAberta()){ fecharCelebra(); return }
      if(noPlacar){ noPlacar=false; if(!matchMedia("(min-width:900px)").matches) abrirPlacar(false); frame.focus() }
    }
  });
  let avisado=false;
  Controle.on("quadro",()=>{
    if(atual&&Controle.segurando(-1,"select")&&Controle.segurando(-1,"start")&&(Controle.apertou(-1,"select")||Controle.apertou(-1,"start"))){
      noPlacar=false; fechar(); return;
    }
    if(atual&&!avisado&&padUsado()){ avisado=true; Controle.dica("Select + Start: voltar para os jogos",3500) }
    let w=null; try{ w=frame.contentWindow }catch(e){}
    try{ if(w&&w.Controle) w.Controle.pausado=!!atual&&(celebraAberta()||noPlacar||!!recent.open) }catch(e){}
  });
}
addEventListener("hashchange",()=>{ if(!atual) noPlacar=false });
route();
