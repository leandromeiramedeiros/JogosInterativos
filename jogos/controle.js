/* controle.js — camada comum de controle (Gamepad API, mapeamento padrão Xbox/PlayStation)
   Uso nos jogos (todas as partes são opcionais):

   Controle.teclas({a:'Space', b:'KeyX', start:'KeyP', cima:'ArrowUp', ...}, {jogador:0, ativo:()=>bool})
     → cada botão "aperta" a tecla: keydown ao apertar, keyup ao soltar. Sem `jogador`, vale qualquer controle.
       Valor pode ser lista: {a:['Space','Enter']}. O analógico esquerdo também conta como cima/baixo/esquerda/direita.
   Controle.navegar({raiz:()=>el, ativo:()=>bool, voltar:()=>{}, seletor:'button,...'})
     → direcional/analógico move o foco entre botões visíveis, A clica, B chama `voltar`.
       Em campo de texto, A abre o teclado na tela.
   Controle.cursor({ativo:()=>bool, velocidade:900})
     → analógico/direcional move uma seta na tela; A = toque/clique (segurar A = arrastar).
   Controle.tecladoVirtual({campo, aoConfirmar, letras}) → abre o teclado na tela.
   Controle.pad(i) → estado atual {conectado,a,b,x,y,lb,rb,lt,rt,select,start,l3,r3,cima,baixo,esquerda,direita,lx,ly,rx,ry}
   Controle.apertou(i,'a') / Controle.soltou(i,'a') → borda neste quadro (i=-1: qualquer controle)
   Controle.on('botao', (i,nome)=>{}) · on('conectado', i=>{}) · on('quadro', ()=>{})
   Controle.vibrar(i, ms, forte, fraco) · Controle.dica('texto')
   Controle.pausado = true → ignora o controle (a página principal usa isso quando abre o placar).

   Teste sem controle: window.__padFalso = [{buttons:[...17 booleanos ou números], axes:[lx,ly,rx,ry]}]
   (na página principal ou dentro do jogo; o jogo também lê o __padFalso da página principal).
   Controle._passo(n) avança n quadros na hora, sem esperar o requestAnimationFrame. */
(function(){
  if(window.Controle) return;
  const NOMES=['a','b','x','y','lb','rb','lt','rt','select','start','l3','r3','cima','baixo','esquerda','direita'];
  const ZONA=.5;
  const ouvintes={};
  const C={pausado:false,usado:false,pads:[{},{},{},{}],ant:[{},{},{},{}]};
  function emitir(ev,...a){ (ouvintes[ev]||[]).slice().forEach(f=>{ try{ f(...a) }catch(e){ console.error(e) } }) }
  C.on=(ev,f)=>{ (ouvintes[ev]=ouvintes[ev]||[]).push(f); return C };
  C.off=(ev,f)=>{ const l=ouvintes[ev]; if(l){ const i=l.indexOf(f); if(i>=0) l.splice(i,1) } return C };

  /* ---------- leitura ---------- */
  function topo(){ try{ if(window.top!==window&&window.top.navigator) return window.top }catch(e){} return null }
  function lista(){
    const fal=window.__padFalso||(()=>{ const t=topo(); try{ return t&&t.__padFalso }catch(e){ return null } })();
    if(fal) return fal.map(p=>p&&{connected:true,mapping:'standard',
      buttons:(p.buttons||[]).map(v=>typeof v==='object'?v:{pressed:!!v,value:+v||0}),axes:p.axes||[0,0,0,0]});
    let l=[];
    const fontes=[navigator]; const t=topo(); if(t) fontes.unshift(t.navigator);
    for(const n of fontes){
      try{ if(n.getGamepads){ l=Array.from(n.getGamepads()).filter(p=>p&&p.connected); if(l.length) break } }catch(e){}
    }
    return l;
  }
  function ler(gp){
    const b=k=>{ const x=gp.buttons[k]; return !!x&&(x.pressed||x.value>.5) };
    const ax=k=>{ const v=gp.axes[k]||0; return Math.abs(v)<.15?0:v };
    const lx=ax(0),ly=ax(1),rx=ax(2),ry=ax(3);
    return {conectado:true,gp,lx,ly,rx,ry,
      a:b(0),b:b(1),x:b(2),y:b(3),lb:b(4),rb:b(5),lt:b(6),rt:b(7),select:b(8),start:b(9),l3:b(10),r3:b(11),
      cima:b(12)||ly<-ZONA,baixo:b(13)||ly>ZONA,esquerda:b(14)||lx<-ZONA,direita:b(15)||lx>ZONA};
  }
  C.pad=i=>C.pads[i]||{};
  C.conectados=()=>C.pads.filter(p=>p.conectado).length;
  C.apertou=(i,n)=>{ if(i<0) return C.pads.some((p,j)=>p[n]&&!C.ant[j][n]); return !!(C.pads[i][n]&&!C.ant[i][n]) };
  C.soltou=(i,n)=>{ if(i<0) return C.pads.some((p,j)=>!p[n]&&C.ant[j][n]); return !!(!C.pads[i][n]&&C.ant[i][n]) };
  C.segurando=(i,n)=>{ if(i<0) return C.pads.some(p=>p[n]); return !!C.pads[i][n] };
  C.vibrar=(i,ms,forte,fraco)=>{
    const gp=(C.pads[i]||{}).gp;
    try{ if(gp&&gp.vibrationActuator) gp.vibrationActuator.playEffect('dual-rumble',{duration:ms||100,strongMagnitude:forte==null?.5:forte,weakMagnitude:fraco==null?.5:fraco}) }catch(e){}
  };

  /* ---------- teclas falsas ---------- */
  const NOMETECLA={Space:' ',Enter:'Enter',Escape:'Escape',Backspace:'Backspace',Tab:'Tab',
    ArrowUp:'ArrowUp',ArrowDown:'ArrowDown',ArrowLeft:'ArrowLeft',ArrowRight:'ArrowRight',
    ShiftLeft:'Shift',ShiftRight:'Shift',ControlLeft:'Control',ControlRight:'Control',AltLeft:'Alt'};
  function keyDe(code,key){
    if(key) return key;
    if(NOMETECLA[code]) return NOMETECLA[code];
    let m=/^Key([A-Z])$/.exec(code); if(m) return m[1].toLowerCase();
    m=/^(?:Digit|Numpad)(\d)$/.exec(code); if(m) return m[1];
    return code;
  }
  const KC={Space:32,Enter:13,Escape:27,Backspace:8,Tab:9,ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40,ShiftLeft:16,ShiftRight:16,ControlLeft:17,AltLeft:18};
  function kc(code){ if(KC[code]) return KC[code]; let m=/^Key([A-Z])$/.exec(code); if(m) return m[1].charCodeAt(0); m=/^Digit(\d)$/.exec(code); if(m) return 48+ +m[1]; return 0 }
  C.tecla=(tipo,code,key)=>{
    const k=keyDe(code,key);
    const ev=new KeyboardEvent(tipo,{key:k,code,bubbles:true,cancelable:true,composed:true});
    const n=kc(code); try{ Object.defineProperty(ev,'keyCode',{get:()=>n}); Object.defineProperty(ev,'which',{get:()=>n}) }catch(e){}
    try{ Object.defineProperty(ev,'__pad',{value:true}) }catch(e){}
    let alvo=document.activeElement;
    if(!alvo||alvo===document.documentElement||alvo.tagName==='IFRAME') alvo=document.body||document;
    alvo.dispatchEvent(ev);
    return ev;
  };
  C.toque=(code,key)=>{ C.tecla('keydown',code,key); C.tecla('keyup',code,key) };

  const mapas=[];
  C.teclas=(mapa,op)=>{
    op=op||{};
    const m={mapa,jogador:op.jogador,ativo:op.ativo,presos:{}};
    mapas.push(m);
    return {remover(){ soltarTudo(m); const i=mapas.indexOf(m); if(i>=0) mapas.splice(i,1) }};
  };
  function soltarTudo(m){ for(const code in m.presos){ if(m.presos[code]){ m.presos[code]=0; C.tecla('keyup',code) } } }
  function rodarMapas(bloq){
    for(const m of mapas){
      const ok=!bloq&&!C.pausado&&(!m.ativo||m.ativo());
      const quer={};
      if(ok){
        for(const nome in m.mapa){
          const segura=m.jogador==null?C.segurando(-1,nome):C.segurando(m.jogador,nome);
          if(!segura) continue;
          const v=m.mapa[nome]; for(const code of (Array.isArray(v)?v:[v])) if(code) quer[code]=1;
        }
      }
      for(const code in quer) if(!m.presos[code]){ m.presos[code]=1; C.tecla('keydown',code) }
      for(const code in m.presos) if(m.presos[code]&&!quer[code]){ m.presos[code]=0; C.tecla('keyup',code) }
    }
  }

  /* ---------- estilo comum ---------- */
  let estilo=false;
  function css(){
    if(estilo||!document.head) return; estilo=true;
    const s=document.createElement('style');
    s.textContent=`.pad-foco{outline:4px solid #ffd23f!important;outline-offset:3px!important;box-shadow:0 0 0 7px rgba(0,0,0,.45)!important;position:relative;z-index:1}
#pad-cursor{position:fixed;left:0;top:0;width:28px;height:28px;margin:-3px 0 0 -3px;pointer-events:none;z-index:2147483646;display:none;
 filter:drop-shadow(0 2px 3px rgba(0,0,0,.6))}
#pad-cursor.on{display:block}
#pad-cursor svg{width:100%;height:100%}
#pad-cursor.down svg{transform:scale(.82);transform-origin:3px 3px}
#pad-dica{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);background:rgba(15,18,30,.92);color:#fff;font:600 14px/1.3 system-ui,sans-serif;
 padding:9px 16px;border-radius:999px;z-index:2147483647;pointer-events:none;opacity:0;transition:opacity .25s;white-space:nowrap;max-width:94vw;overflow:hidden;text-overflow:ellipsis}
#pad-dica.on{opacity:1}
#pad-teclado{position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:2147483645;background:rgba(15,18,30,.96);border-radius:14px;padding:10px;
 box-shadow:0 10px 30px rgba(0,0,0,.5);font:700 18px/1 system-ui,sans-serif;color:#fff;max-width:98vw}
#pad-teclado .lin{display:flex;gap:5px;justify-content:center;margin:5px 0}
#pad-teclado .t{min-width:34px;height:40px;padding:0 8px;border-radius:8px;background:#2c3350;display:flex;align-items:center;justify-content:center}
#pad-teclado .t.sel{background:#ffd23f;color:#141414}
#pad-teclado .leg{font:500 12px/1.2 system-ui,sans-serif;opacity:.75;text-align:center;margin-top:6px}`;
    document.head.appendChild(s);
  }

  /* ---------- dica ---------- */
  let dicaT=0;
  C.dica=(txt,ms)=>{
    css(); let d=document.getElementById('pad-dica');
    if(!d){ d=document.createElement('div'); d.id='pad-dica'; document.body.appendChild(d) }
    d.textContent=txt; d.classList.add('on'); clearTimeout(dicaT); dicaT=setTimeout(()=>d.classList.remove('on'),ms||2600);
  };

  /* ---------- repetição de direcional (menus) ---------- */
  function repetidor(){
    const t={};
    return (nome,seg,agora)=>{
      if(!seg){ t[nome]=0; return false }
      if(!t[nome]){ t[nome]=agora+380; return true }
      if(agora>=t[nome]){ t[nome]=agora+110; return true }
      return false;
    };
  }

  /* ---------- navegação por foco ---------- */
  const SELETOR='button,a[href],input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"]),[data-pad],[role=button],[onclick]';
  function visivel(el){
    if(!el.isConnected||el.disabled||el.closest('[hidden],[inert],[aria-hidden=true]')) return false;
    const r=el.getBoundingClientRect(); if(r.width<2||r.height<2) return false;
    const s=getComputedStyle(el); if(s.visibility==='hidden'||s.display==='none'||+s.opacity===0||s.pointerEvents==='none') return false;
    /* acima ou abaixo da tela vale: a página rola até ele */
    if(r.bottom<0||r.right<0||r.top>innerHeight||r.left>innerWidth) return r.right>0&&r.left<innerWidth;
    const x=Math.min(Math.max(r.left+r.width/2,0),innerWidth-1),y=Math.min(Math.max(r.top+r.height/2,0),innerHeight-1);
    const topo=document.elementFromPoint(x,y);
    if(!topo||el===topo||el.contains(topo)||topo.contains(el)||topo.closest('#pad-cursor,#pad-dica')) return true;
    /* escondido só pela rolagem de uma lista: vale, o scrollIntoView traz ele */
    for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){
      const o=getComputedStyle(p).overflowY;
      if(o==='auto'||o==='scroll'){ const q=p.getBoundingClientRect(); return y<q.top||y>q.bottom }
    }
    return false;
  }
  const navs=[];
  let focoPad=null;
  function marcar(el){
    if(focoPad&&focoPad!==el) focoPad.classList.remove('pad-foco');
    focoPad=el; if(!el) return;
    css(); el.classList.add('pad-foco');
    try{ el.focus({preventScroll:true}) }catch(e){}
    try{ el.scrollIntoView({block:'nearest',inline:'nearest'}) }catch(e){}
  }
  function candidatos(n){
    const raiz=(n.raiz&&n.raiz())||document;
    return Array.from(raiz.querySelectorAll(n.seletor||SELETOR)).filter(el=>!el.closest('#pad-teclado')&&visivel(el));
  }
  function centro(el){ const r=el.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,r} }
  function mover(n,dir){
    const cs=candidatos(n); if(!cs.length) return;
    let atual=focoPad&&cs.includes(focoPad)?focoPad:(cs.includes(document.activeElement)?document.activeElement:null);
    if(!atual){ marcar(cs[0]); return }
    const a=centro(atual); let melhor=null,mv=1e9;
    for(const el of cs){
      if(el===atual) continue;
      const b=centro(el),dx=b.x-a.x,dy=b.y-a.y;
      let prim,orto;
      if(dir==='cima'){ prim=-dy; orto=Math.abs(dx) } else if(dir==='baixo'){ prim=dy; orto=Math.abs(dx) }
      else if(dir==='esquerda'){ prim=-dx; orto=Math.abs(dy) } else { prim=dx; orto=Math.abs(dy) }
      if(prim<=4) continue;
      const v=prim+orto*2.2; if(v<mv){ mv=v; melhor=el }
    }
    if(melhor) marcar(melhor);
  }
  function ativar(el){
    if(!el) return;
    const tag=el.tagName;
    if((tag==='INPUT'&&/^(text|search|email|tel|url|password|)$/i.test(el.type||''))||tag==='TEXTAREA'){
      C.tecladoVirtual({campo:el}); return;
    }
    if(tag==='SELECT'){ const o=el.options.length; if(o){ el.selectedIndex=(el.selectedIndex+1)%o; el.dispatchEvent(new Event('change',{bubbles:true})) } return }
    if(tag==='INPUT'&&/checkbox|radio/i.test(el.type)){ el.click(); return }
    if(tag==='BUTTON'||tag==='A'||tag==='INPUT'||tag==='SUMMARY'){ el.click(); return }
    const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
    const o={bubbles:true,cancelable:true,clientX:x,clientY:y,view:window};
    try{ el.dispatchEvent(new PointerEvent('pointerdown',Object.assign({pointerId:PID,pointerType:'mouse',isPrimary:true},o))) }catch(e){}
    el.dispatchEvent(new MouseEvent('mousedown',o));
    try{ el.dispatchEvent(new PointerEvent('pointerup',Object.assign({pointerId:PID,pointerType:'mouse',isPrimary:true},o))) }catch(e){}
    el.dispatchEvent(new MouseEvent('mouseup',o));
    if(typeof el.click==='function') el.click(); else el.dispatchEvent(new MouseEvent('click',o));   /* SVG não tem .click() */
  }
  C.navegar=op=>{
    const n=Object.assign({rep:repetidor()},op||{});
    navs.push(n);
    return {remover(){ const i=navs.indexOf(n); if(i>=0) navs.splice(i,1); if(!navs.length) marcar(null) },focar:el=>marcar(el)};
  };
  C.focar=el=>marcar(el);
  function navAtiva(){ return C.pausado?null:navs.find(n=>!n.ativo||n.ativo())||null }
  function rodarNavs(n,agora){
    if(!n){ if(focoPad){ focoPad.classList.remove('pad-foco'); focoPad=null } return }
    if(focoPad&&(!focoPad.isConnected||!visivel(focoPad))){ focoPad.classList.remove('pad-foco'); focoPad=null }
    let cs=null,recem=false;
    /* sem foco ainda: o primeiro aperto só mostra onde o foco está, não clica */
    if(!focoPad&&C.usado){ cs=candidatos(n); if(cs.length){ marcar(cs.includes(document.activeElement)?document.activeElement:cs[0]); recem=true } }
    for(const d of ['cima','baixo','esquerda','direita']) if(n.rep(d,C.segurando(-1,d),agora)) mover(n,d);
    if(!recem&&(C.apertou(-1,'a')||C.apertou(-1,'start'))){
      cs=candidatos(n);
      const el=focoPad&&cs.includes(focoPad)?focoPad:null;
      if(!el) marcar(cs[0]||null); else ativar(el);
    }
    if(C.apertou(-1,'b')&&n.voltar) n.voltar();
  }

  /* ---------- cursor virtual ---------- */
  const PID=9173;
  (function(){
    const P=Element.prototype;
    for(const nome of ['setPointerCapture','releasePointerCapture']){
      const orig=P[nome]; if(!orig) continue;
      P[nome]=function(id){ if(id===PID) return; return orig.apply(this,arguments) };
    }
    const has=P.hasPointerCapture; if(has) P.hasPointerCapture=function(id){ if(id===PID) return cur.preso; return has.apply(this,arguments) };
  })();
  const cur={x:-1,y:-1,preso:false,alvo:null,el:null,ops:null,ultimoMov:0,visivel:false};
  function curEl(){
    if(cur.el) return cur.el;
    css(); const d=document.createElement('div'); d.id='pad-cursor';
    d.innerHTML='<svg viewBox="0 0 28 28"><path d="M3 3 L3 23 L9 17.5 L13 26 L17 24 L13 15.5 L21 15.5 Z" fill="#fff" stroke="#141414" stroke-width="2" stroke-linejoin="round"/></svg>';
    document.body.appendChild(d); cur.el=d; return d;
  }
  function despachar(tipo,x,y,botoes){
    const alvo=(cur.preso&&cur.alvo&&cur.alvo.isConnected)?cur.alvo:(document.elementFromPoint(x,y)||document.body);
    const o={bubbles:true,cancelable:true,composed:true,clientX:x,clientY:y,screenX:x,screenY:y,pageX:x+scrollX,pageY:y+scrollY,
      button:0,buttons:botoes,view:window};
    const mt={pointerdown:'mousedown',pointermove:'mousemove',pointerup:'mouseup'}[tipo];
    let pe; try{ pe=new PointerEvent(tipo,Object.assign({pointerId:PID,pointerType:'mouse',isPrimary:true,width:1,height:1,pressure:botoes?.5:0},o)) }catch(e){}
    const okP=pe?alvo.dispatchEvent(pe):true;
    if(mt&&okP) alvo.dispatchEvent(new MouseEvent(mt,o));
    return alvo;
  }
  C.cursor=op=>{
    const c=Object.assign({velocidade:900},op||{});
    cur.ops=c;
    return {remover(){ if(cur.ops===c){ cur.ops=null; if(cur.el) cur.el.classList.remove('on') } },
      mover(x,y){ cur.x=x; cur.y=y }};
  };
  C.posicaoCursor=()=>({x:cur.x,y:cur.y,preso:cur.preso});
  function rodarCursor(dt,bloq){
    const c=cur.ops;
    const ok=c&&!bloq&&!C.pausado&&(!c.ativo||c.ativo());
    if(!ok){
      if(cur.preso){ cur.preso=false; despachar('pointerup',cur.x,cur.y,0) }
      if(cur.el) cur.el.classList.remove('on'); return;
    }
    if(cur.x<0){ cur.x=innerWidth/2; cur.y=innerHeight/2 }
    let vx=0,vy=0;
    for(let i=0;i<C.pads.length;i++){
      const p=C.pads[i]; if(!p.conectado) continue;
      const fx=p.lx||(p.direita?1:p.esquerda?-1:0)||(c.direitoTambem?p.rx:0);
      const fy=p.ly||(p.baixo?1:p.cima?-1:0)||(c.direitoTambem?p.ry:0);
      vx+=Math.sign(fx)*Math.pow(Math.abs(fx),1.6); vy+=Math.sign(fy)*Math.pow(Math.abs(fy),1.6);
    }
    const lento=C.segurando(-1,'lb')||C.segurando(-1,'lt')?.35:1;
    const sp=c.velocidade*lento*Math.min(Math.max(innerWidth,innerHeight)/1000,1.6);
    const mexeu=vx||vy;
    if(mexeu){
      cur.x=Math.min(Math.max(cur.x+vx*sp*dt,0),innerWidth-1);
      cur.y=Math.min(Math.max(cur.y+vy*sp*dt,0),innerHeight-1);
      despachar('pointermove',cur.x,cur.y,cur.preso?1:0);
    }
    if(mexeu||C.apertou(-1,'a')){ cur.visivel=true }
    const el=curEl(); el.classList.toggle('on',cur.visivel); el.classList.toggle('down',cur.preso);
    el.style.transform=`translate(${cur.x}px,${cur.y}px)`;
    const a=C.segurando(-1,'a');
    if(a&&!cur.preso){
      cur.alvo=document.elementFromPoint(cur.x,cur.y)||document.body;
      despachar('pointerdown',cur.x,cur.y,1); cur.preso=true;
    }else if(!a&&cur.preso){
      despachar('pointerup',cur.x,cur.y,0);
      const alvo=cur.alvo; cur.preso=false; cur.alvo=null;
      const sob=document.elementFromPoint(cur.x,cur.y);
      if(alvo&&sob&&(alvo===sob||alvo.contains(sob)||sob.contains(alvo))){
        if(typeof alvo.click==='function') alvo.click();
        else alvo.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:cur.x,clientY:cur.y,view:window}));
      }
    }
  }

  /* ---------- teclado na tela ---------- */
  const LINHAS=['1234567890','QWERTYUIOP','ASDFGHJKLÇ','ZXCVBNM-'];
  let tv=null;
  C.tecladoVirtual=op=>{
    op=op||{}; css();
    if(tv) tv.fechar(false);
    const linhas=(op.letras||LINHAS).map(l=>Array.from(l));
    linhas.push(['ESPAÇO','⌫','OK']);
    const box=document.createElement('div'); box.id='pad-teclado';
    box.innerHTML=linhas.map((l,r)=>`<div class="lin">${l.map((t,c)=>`<div class="t" data-r="${r}" data-c="${c}">${t}</div>`).join('')}</div>`).join('')+
      '<div class="leg">A digita · B apaga · X espaço · Start confirma · Y fecha</div>';
    document.body.appendChild(box);
    let r=1,c=0;
    const rep=repetidor();
    const campo=op.campo||null;
    function pinta(){ box.querySelectorAll('.t').forEach(e=>e.classList.toggle('sel',+e.dataset.r===r&&+e.dataset.c===c)) }
    function inserir(txt){
      if(campo){
        const ini=campo.selectionStart??campo.value.length,fim=campo.selectionEnd??campo.value.length;
        const max=campo.maxLength>0?campo.maxLength:1e9;
        if(txt===null){
          if(!campo.value) return;
          const a=ini===fim?Math.max(0,ini-1):ini;
          campo.value=campo.value.slice(0,a)+campo.value.slice(fim);
          try{ campo.setSelectionRange(a,a) }catch(e){}
          campo.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'deleteContentBackward'}));
        }else{
          if(campo.value.length>=max) return;
          campo.value=campo.value.slice(0,ini)+txt+campo.value.slice(fim);
          try{ campo.setSelectionRange(ini+txt.length,ini+txt.length) }catch(e){}
          campo.dispatchEvent(new InputEvent('input',{bubbles:true,data:txt,inputType:'insertText'}));
        }
      }else if(txt===null) C.toque('Backspace');
      else if(txt===' ') C.toque('Space');
      else{
        const L=txt.toUpperCase();
        const code=/^[A-Z]$/.test(L)?'Key'+L:/^\d$/.test(L)?'Digit'+L:'';
        C.toque(code,txt.toLowerCase());
      }
      if(op.aoDigitar) op.aoDigitar(txt);
    }
    function confirmar(){
      fechar(true);
      if(op.aoConfirmar) op.aoConfirmar(campo?campo.value:null);
      else if(campo){
        const ev={key:'Enter',code:'Enter',bubbles:true,cancelable:true};
        campo.dispatchEvent(new KeyboardEvent('keydown',ev)); campo.dispatchEvent(new KeyboardEvent('keyup',ev));
        if(campo.form){ if(campo.form.requestSubmit) campo.form.requestSubmit(); else campo.form.submit() }
      }else C.toque('Enter');
    }
    function fechar(ok){ box.remove(); tv=null; if(!ok&&op.aoFechar) op.aoFechar() }
    function passo(agora){
      for(const d of ['cima','baixo','esquerda','direita']) if(rep(d,C.segurando(-1,d),agora)){
        if(d==='cima'||d==='baixo'){
          const antes=linhas[r].length;
          r=(r+(d==='cima'?linhas.length-1:1))%linhas.length;
          c=Math.round(c*(linhas[r].length-1)/Math.max(1,antes-1));
        }
        if(d==='esquerda') c--; if(d==='direita') c++;
        c=(c+linhas[r].length)%linhas[r].length;
      }
      c=Math.min(c,linhas[r].length-1);
      pinta();
      if(C.apertou(-1,'a')){
        const t=linhas[r][c];
        if(t==='OK') confirmar(); else if(t==='⌫') inserir(null); else if(t==='ESPAÇO') inserir(' ');
        else inserir(campo?t:t.toLowerCase());
      }
      if(C.apertou(-1,'b')) inserir(null);
      if(C.apertou(-1,'x')) inserir(' ');
      if(C.apertou(-1,'start')) confirmar();
      if(C.apertou(-1,'y')) fechar(false);
    }
    tv={passo,fechar,box};
    pinta();
    return tv;
  };
  C.tecladoAberto=()=>!!tv;

  /* ---------- laço ---------- */
  let ult=performance.now(),conhecidos=0;
  function passo(agora){
    const dt=Math.min(.05,(agora-ult)/1000); ult=agora;
    const l=lista();   /* só controles com mapeamento padrão: nos outros os botões vêm trocados ou presos */
    C.ant=C.pads;
    C.pads=[0,1,2,3].map(i=>l[i]&&l[i].mapping==='standard'?ler(l[i]):{});
    const n=C.pads.filter(p=>p.conectado).length;
    if(n>conhecidos){ for(let i=0;i<4;i++) if(C.pads[i].conectado&&!C.ant[i].conectado) emitir('conectado',i) }
    conhecidos=n;
    if(!C.pausado){
      for(let i=0;i<4;i++) for(const nome of NOMES) if(C.pads[i][nome]&&!C.ant[i][nome]){ C.usado=true; emitir('botao',i,nome) }
      if(tv){ for(const m of mapas) soltarTudo(m); tv.passo(agora) }
      else{
        /* prioridade: teclado na tela → navegação de menu → teclas e cursor do jogo (A nunca vale por dois) */
        const n=navAtiva();
        rodarMapas(!!n); rodarCursor(dt,!!n); rodarNavs(n,agora);
      }
      emitir('quadro',dt);
    }else{ rodarMapas(true); rodarCursor(dt,true); rodarNavs(null) }
  }
  function quadro(agora){ passo(agora); requestAnimationFrame(quadro) }
  /* teste: Controle._passo(5) roda 5 quadros na hora (útil com __padFalso quando a aba está em segundo plano) */
  C._passo=(n,ms)=>{ for(let k=0;k<(n||1);k++) passo(ult+(ms||16)) };
  window.Controle=C;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',css); else css();
  requestAnimationFrame(quadro);
})();
