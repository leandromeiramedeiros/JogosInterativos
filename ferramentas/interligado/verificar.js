/* Verificador dos mapas do Interligado.
   Uso: node ferramentas/interligado/verificar.js [tema ...]   (sem argumentos: todos os temas)
   Regras checadas em cada nível:
   - a 1ª palavra da 1ª ligação é a palavra do tema (centro); o mapa é conexo; toda palavra tem ≥ 2 ligações e uma pista;
   - anéis = distância até o centro; tamanhos de referência (fácil 12, médio 20, difícil 36 palavras, ±3);
   - poucas ligações dentro do mesmo anel (no máx. 15% das ligações) e no máx. 3 "pais" no anel anterior por palavra;
   - desenho: posiciona as palavras nos anéis, ordena cada anel para cruzar o mínimo e conta os cruzamentos que sobram.
     Limite: fácil 0, médio 1, difícil 3. */
const fs=require("fs"), vm=require("vm"), path=require("path");
const raiz=path.join(__dirname,"..","..","jogos","interligado");
const ctx={window:{}}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(raiz,"pistas.js"),"utf8"),ctx);
for(const id of fs.readFileSync(path.join(raiz,"temas","LISTA.txt"),"utf8").split(/\s+/).filter(Boolean))
  vm.runInContext(fs.readFileSync(path.join(raiz,"temas",id+".js"),"utf8"),ctx);
const TEMAS=ctx.window.INTERLIGADO_TEMAS, PISTAS=ctx.window.INTERLIGADO_PISTAS||{};
const ALVO={facil:12,medio:20,dificil:36}, MAXCR={facil:0,medio:1,dificil:3};

function analisar(id,nv){
  const T=TEMAS[id], L=T.niveis[nv].ligacoes, nome=w=>w.split("|")[0];
  const idx=new Map(), nos=[], err=[], avis=[];
  const no=w=>{const k=nome(w);if(!idx.has(k)){idx.set(k,nos.length);nos.push({t:k,viz:new Set()})}return idx.get(k)};
  const fios=[], vistos=new Set();
  for(const [a,b] of L){const i=no(a),j=no(b);const k=Math.min(i,j)+"-"+Math.max(i,j);
    if(i===j) err.push(`ligação de "${nome(a)}" com ela mesma`); else if(vistos.has(k)) err.push(`ligação repetida ${nome(a)}–${nome(b)}`);
    else{vistos.add(k);fios.push([i,j]);nos[i].viz.add(j);nos[j].viz.add(i)}}
  const N=nos.length, d=new Array(N).fill(-1); d[0]=0; const q=[0];
  while(q.length){const i=q.shift();for(const j of nos[i].viz)if(d[j]<0){d[j]=d[i]+1;q.push(j)}}
  nos.forEach((n,i)=>{ if(d[i]<0) err.push(`"${n.t}" não se liga ao resto do mapa`);
    if(n.viz.size<2) err.push(`"${n.t}" tem só ${n.viz.size} ligação`);
    if(!((T.pistas&&T.pistas[n.t])||PISTAS[n.t])) err.push(`"${n.t}" está sem pista`);
    const pais=[...n.viz].filter(j=>d[j]===d[i]-1).length; if(i&&pais>3) avis.push(`"${n.t}" tem ${pais} ligações com o anel de dentro`); });
  if(Math.abs(N-ALVO[nv])>3) err.push(`${N} palavras (referência ${ALVO[nv]} ±3)`);
  const mesmo=fios.filter(([a,b])=>d[a]===d[b]).length;
  if(mesmo>Math.max(1,Math.floor(fios.length*.15))) err.push(`${mesmo} ligações dentro do mesmo anel (máx. ${Math.max(1,Math.floor(fios.length*.15))})`);
  const aneis=[]; d.forEach((x,i)=>{if(x>=0)(aneis[x]||(aneis[x]=[])).push(i)});
  const cr=desenho(nos,fios,d,aneis);
  if(cr.n>MAXCR[nv]) err.push(`${cr.n} cruzamentos inevitáveis (máx. ${MAXCR[nv]}): ${cr.quais.slice(0,4).join("; ")}`);
  return {id,nv,N,aneis:aneis.map(a=>a.length),mesmo,cr:cr.n,err,avis,ordem:cr.ordem.map(a=>a.map(i=>nos[i].t))};
}
/* Desenho em anéis: ângulo por palavra; baricentro + trocas aleatórias; conta cruzamentos de segmentos retos. */
function desenho(nos,fios,d,aneis){
  let melhor=null;
  for(let rep=0;rep<12;rep++){
    let s=rep*7919+1; const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
    const ang=new Array(nos.length).fill(0);
    const espalhar=(g,ord)=>{ord.forEach((i,k)=>ang[i]=(k+.5)/ord.length*2*Math.PI+(g%2?.3:0))};
    aneis.forEach((g,dd)=>{if(dd) espalhar(dd,g.slice().sort(()=>rnd()-.5))});
    const media=i=>{let x=0,y=0;for(const j of nos[i].viz)if(j){x+=Math.cos(ang[j]);y+=Math.sin(ang[j])}return Math.atan2(y,x)};
    for(let it=0;it<8;it++) for(let dd=1;dd<aneis.length;dd++){const g=aneis[dd].map(i=>({i,a:media(i)})).sort((p,q)=>p.a-q.a).map(o=>o.i);
      const off=g.reduce((a,i,k)=>a+0,0); g.forEach((i,k)=>ang[i]=(k+.5)/g.length*2*Math.PI+media(g[0])-(.5)/g.length*2*Math.PI)}
    const pos=i=>({x:Math.cos(ang[i])*d[i],y:Math.sin(ang[i])*d[i]});
    const conta=()=>{let n=0,q=[];const P=nos.map((_,i)=>pos(i));
      for(let a=0;a<fios.length;a++)for(let b=a+1;b<fios.length;b++){const [p,r]=fios[a],[u,v]=fios[b];if(p===u||p===v||r===u||r===v)continue;
        if(corta(P[p],P[r],P[u],P[v])){n++;q.push(`${nos[p].t}–${nos[r].t} × ${nos[u].t}–${nos[v].t}`)}}return {n,q}};
    let c=conta();
    for(let it=0;it<3000&&c.n;it++){const g=aneis[1+Math.floor(rnd()*(aneis.length-1))];if(!g||g.length<2)continue;
      const a=g[Math.floor(rnd()*g.length)],b=g[Math.floor(rnd()*g.length)];if(a===b)continue;
      [ang[a],ang[b]]=[ang[b],ang[a]];const c2=conta();if(c2.n<=c.n)c=c2;else[ang[a],ang[b]]=[ang[b],ang[a]]}
    if(!melhor||c.n<melhor.n) melhor={n:c.n,quais:c.q,ordem:aneis.map(g=>g.slice().sort((p,q)=>ang[p]-ang[q]))};
    if(!melhor.n) break;
  }
  return melhor;
}
function corta(p1,p2,p3,p4){const o=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  const d1=o(p3,p4,p1),d2=o(p3,p4,p2),d3=o(p1,p2,p3),d4=o(p1,p2,p4);return((d1>0)!==(d2>0))&&((d3>0)!==(d4>0))}

const pedidos=process.argv.slice(2), ids=pedidos.length?pedidos:Object.keys(TEMAS);
let ruins=0;
for(const id of ids){ if(!TEMAS[id]){console.log(`tema "${id}" não existe`);ruins++;continue}
  for(const nv of ["facil","medio","dificil"]){const r=analisar(id,nv);
    console.log(`${r.err.length?"✗":"✓"} ${id}/${nv}: ${r.N} palavras, anéis ${r.aneis.join("-")}, ${r.mesmo} no mesmo anel, ${r.cr} cruzamentos`);
    r.err.forEach(e=>console.log("    erro: "+e)); r.avis.forEach(e=>console.log("    aviso: "+e));
    if(r.err.length) ruins++;}}
console.log(ruins?`\n${ruins} mapa(s) com problema.`:"\nTodos os mapas passaram.");
process.exit(ruins?1:0);
