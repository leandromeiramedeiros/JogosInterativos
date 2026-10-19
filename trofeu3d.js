/* Troféu 3D da comemoração do pódio: copa clássica de metal polido sobre base de ébano.
   Chega voando do fundo, girando rápido, pousa com clarão, onda de luz e faíscas, e fica girando devagar
   (dá para girar arrastando). Usa o three.js r128 do cdnjs (o mesmo dos jogos 3D), baixado só quando
   alguém termina uma partida.
     Trofeu3D.preparar()                          → Promise<boolean>  baixa o three.js
     Trofeu3D.montar(caixa,lugar,{aoComecar,aoPousar,parado}) → boolean  false = sem three.js/WebGL (o hub usa o SVG)
       aoComecar: primeiro quadro desenhado (a música começa junto); aoPousar: o troféu chegou
     Trofeu3D.parar()                             para a animação e solta o troféu da cena */
window.Trofeu3D=(()=>{
  const SRC="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  let baixando=null;
  function preparar(){
    if(window.THREE) return Promise.resolve(true);
    return baixando||(baixando=new Promise(ok=>{
      const s=document.createElement("script"); s.src=SRC; s.async=true;
      s.onload=()=>ok(!!window.THREE);
      s.onerror=()=>{ s.remove(); baixando=null; ok(false) };
      document.head.appendChild(s);
    }));
  }

  /* metal de cada lugar: cor (linear), aspereza */
  const METAL={1:[[1,.74,.29],.12],2:[[.9,.92,.96],.14],3:[[.8,.45,.24],.2]};
  /* entrada: de onde vem, quanto tempo leva e quantas voltas extras dá */
  const ENTRADA={1:{z:-30,y:3.4,t:1.6,voltas:2.5,faiscas:150},2:{z:-14,y:1.6,t:1.05,voltas:1.5,faiscas:60},3:{z:-14,y:1.6,t:1.05,voltas:1.5,faiscas:60}};
  const GIRO=.5;   // rad/s depois de pousar (uma volta a cada ~12 s)
  const BASE=-1.43; // o troféu tem ~2,86 de altura; o centro fica na origem

  let R=null, env=null, TX=null, quebrou=false;
  let cena=null, cam=null, luzVarre=null, sol=null;
  let obj=null, raf=0, ro=null, canvasPai=null;

  function iniciar(){
    if(R&&!R.getContext().isContextLost()) return true;
    if(quebrou||!window.THREE) return false;
    try{
      R=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:"high-performance"});
    }catch(e){ quebrou=true; R=null; return false }
    R.setPixelRatio(Math.min(2,devicePixelRatio||1));
    R.outputEncoding=THREE.sRGBEncoding;
    R.toneMapping=THREE.ACESFilmicToneMapping;
    R.setClearColor(0,0);
    R.domElement.className="t3d";
    R.domElement.setAttribute("aria-hidden","true");
    R.domElement.addEventListener("webglcontextlost",()=>{ parar(); R=null; env=null; TX=null; cena=null });
    env=ambiente(); TX=texturas();
    cena=new THREE.Scene(); cena.environment=env;
    cam=new THREE.PerspectiveCamera(30,1,.1,80);
    sol=new THREE.DirectionalLight(0xfff0d8,1.1); sol.position.set(3,6,5); cena.add(sol);
    luzVarre=new THREE.PointLight(0xffffff,0,9,1.2); cena.add(luzVarre);
    arrastar(R.domElement);
    return true;
  }

  /* Estúdio para o reflexo: horizonte quente, chão escuro e tiras de luz fortes (o ouro precisa de claro e escuro) */
  function ambiente(){
    const c=new THREE.Scene();
    const g=new THREE.SphereGeometry(20,48,24), p=g.attributes.position, cor=[];
    for(let i=0;i<p.count;i++){
      const y=p.getY(i)/20, ang=Math.atan2(p.getZ(i),p.getX(i));
      const faixa=.55+.45*Math.cos(ang*3);   // claros e escuros em volta, para o giro ter reflexo que passa
      if(y>0) cor.push((.55+.6*y)*faixa,(.42+.55*y)*faixa,(.3+.5*y)*faixa);
      else cor.push(.5*faixa*(1+y*1.6)+.03,.36*faixa*(1+y*1.6)+.02,.22*faixa*(1+y*1.6)+.02);
    }
    g.setAttribute("color",new THREE.Float32BufferAttribute(cor,3));
    c.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({side:THREE.BackSide,vertexColors:true})));
    const caixa=(w,h,x,y,z,r,gg,b)=>{
      const m=new THREE.Mesh(h?new THREE.PlaneGeometry(w,h):new THREE.CircleGeometry(w/2,48),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
      m.material.color.setRGB(r,gg,b); m.position.set(x,y,z); m.lookAt(0,1,0); c.add(m);
    };
    caixa(12,0,0,10,0,4,3.8,3.5);        // teto (redondo: o reflexo no bojo vira um oval)
    caixa(1.2,14,-7,2,4,16,15,13);       // tira principal, à esquerda
    caixa(.9,12,7.5,2,-1,11,10.5,10);    // tira de recorte, à direita
    caixa(.7,10,3,2,8,9,8,6.5);          // tira de frente, que corre pelo bojo no giro
    caixa(14,2.5,0,-3,9,5,3.2,1.4);      // rebote quente embaixo
    caixa(8,1.5,0,5,-9,9,8,7);           // contraluz
    caixa(1,1,-3,6,6,40,36,30); caixa(.8,.8,5,5,5,40,36,30); // pontinhos que viram faísca no metal
    const pm=new THREE.PMREMGenerator(R);
    const t=pm.fromScene(c,.025).texture;
    pm.dispose(); c.traverse(o=>{ if(o.geometry) o.geometry.dispose(); if(o.material) o.material.dispose() });
    return t;
  }

  function texCanvas(w,h,desenha){
    const c=document.createElement("canvas"); c.width=w; c.height=h; desenha(c.getContext("2d"),w,h);
    const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; return t;
  }
  function texturas(){
    const radial=(g,w,paradas)=>{ const r=g.createRadialGradient(w/2,w/2,0,w/2,w/2,w/2); paradas.forEach(([o,c])=>r.addColorStop(o,c)); g.fillStyle=r; g.fillRect(0,0,w,w) };
    return {
      brilho:texCanvas(128,128,(g,w)=>radial(g,w,[[0,"rgba(255,255,255,1)"],[.18,"rgba(255,240,190,.8)"],[.45,"rgba(255,196,80,.25)"],[1,"rgba(255,160,40,0)"]])),
      estrela:texCanvas(128,128,(g,w)=>{
        radial(g,w,[[0,"rgba(255,255,255,.9)"],[.12,"rgba(255,244,210,.45)"],[.35,"rgba(255,220,140,0)"]]);
        g.translate(w/2,w/2); g.fillStyle="#fff";
        for(const [s,a] of [[1,0],[.5,Math.PI/4]]){
          g.save(); g.rotate(a); g.scale(s,s); g.beginPath();
          g.moveTo(0,-62); g.quadraticCurveTo(5,-5,62,0); g.quadraticCurveTo(5,5,0,62); g.quadraticCurveTo(-5,5,-62,0); g.quadraticCurveTo(-5,-5,0,-62);
          g.fill(); g.restore();
        }
      }),
      onda:texCanvas(256,256,(g,w)=>radial(g,w,[[0,"rgba(255,220,140,0)"],[.62,"rgba(255,220,140,0)"],[.86,"rgba(255,236,180,.95)"],[.93,"rgba(255,200,90,.4)"],[1,"rgba(255,180,60,0)"]])),
      sombra:texCanvas(128,128,(g,w)=>radial(g,w,[[0,"rgba(0,0,0,.75)"],[.5,"rgba(0,0,0,.35)"],[1,"rgba(0,0,0,0)"]]))
    };
  }

  /* placa gravada na base: o mapa escurece o metal onde há letras */
  function texPlaca(lugar){
    return texCanvas(640,120,(g,w,h)=>{
      g.fillStyle="#fff"; g.fillRect(0,0,w,h);
      g.strokeStyle="#8a6a3a"; g.lineWidth=5; g.strokeRect(10,10,w-20,h-20);
      g.strokeStyle="#c9b48c"; g.lineWidth=2; g.strokeRect(20,20,w-40,h-40);
      g.font="64px 'Bowlby One SC','Arial Black',sans-serif"; g.textAlign="center"; g.textBaseline="middle";
      const txt=`${lugar}º LUGAR`;
      g.fillStyle="#fff"; g.fillText(txt,w/2,h/2+5);
      g.fillStyle="#3a2508"; g.fillText(txt,w/2,h/2+2);
    });
  }

  function caixaRedonda(w,h,d,r,b){
    const s=new THREE.Shape(), x=w/2-b, z=d/2-b, rr=Math.max(.001,r-b);
    s.moveTo(-x+rr,-z); s.lineTo(x-rr,-z); s.quadraticCurveTo(x,-z,x,-z+rr); s.lineTo(x,z-rr); s.quadraticCurveTo(x,z,x-rr,z);
    s.lineTo(-x+rr,z); s.quadraticCurveTo(-x,z,-x,z-rr); s.lineTo(-x,-z+rr); s.quadraticCurveTo(-x,-z,-x+rr,-z);
    const g=new THREE.ExtrudeGeometry(s,{depth:h-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:4,curveSegments:8});
    g.rotateX(-Math.PI/2); g.translate(0,b,0);
    return g;
  }
  function estrela5(r1,r2){
    const s=new THREE.Shape();
    for(let i=0;i<10;i++){ const a=Math.PI/2+i*Math.PI/5, r=i%2?r2:r1; i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r) }
    return s;
  }
  const curva=pts=>new THREE.CatmullRomCurve3(pts.map(([x,y])=>new THREE.Vector3(x,y,0)),false,"centripetal");

  /* A copa: pé, haste com nó, bojo, borda virada e o lado de dentro, num só torno */
  const PERFIL=[[.001,0],[.6,0],[.625,.025],[.625,.065],[.57,.105],[.44,.155],[.3,.215],[.2,.3],[.15,.38],[.122,.5],[.116,.6],[.15,.665],[.2,.72],[.15,.785],[.112,.85],[.106,.95],[.14,1.02],[.24,1.085],
    [.4,1.155],[.55,1.28],[.66,1.48],[.725,1.72],[.752,1.95],[.768,2.1],[.8,2.2],[.85,2.255],[.858,2.295],[.83,2.315],[.795,2.295],[.745,2.2],[.718,2],[.692,1.75],[.62,1.5],[.48,1.3],[.25,1.2],[.001,1.18]];
  const ALCA=[[.745,2.03],[.98,2.13],[1.2,2.07],[1.31,1.87],[1.25,1.63],[1.06,1.47],[.82,1.4],[.58,1.4]];
  const COPA_Y=.54; // altura da base de ébano

  function construir(lugar){
    const [c,rug]=METAL[lugar];
    const ouro=new THREE.MeshPhysicalMaterial({color:new THREE.Color(...c),metalness:1,roughness:rug,clearcoat:.5,clearcoatRoughness:.06,envMapIntensity:1.3,side:THREE.DoubleSide});
    const ebano=new THREE.MeshPhysicalMaterial({color:0x050407,metalness:0,roughness:.45,clearcoat:1,clearcoatRoughness:.03,envMapIntensity:.32});
    const placa=new THREE.MeshPhysicalMaterial({color:new THREE.Color(...c),metalness:1,roughness:rug+.08,envMapIntensity:1.3,map:texPlaca(lugar)});
    const g=new THREE.Group(), m=(geo,mat,y=0)=>{ const o=new THREE.Mesh(geo,mat); o.position.y=y; g.add(o); return o };

    m(caixaRedonda(1.62,.3,1.62,.1,.03),ebano);
    m(caixaRedonda(1.4,.035,1.4,.08,.012),ouro,.29);
    m(caixaRedonda(1.32,.22,1.32,.07,.025),ebano,.32);
    const pl=m(new THREE.PlaneGeometry(.92,.17),placa,.43); pl.position.z=.662;

    m(new THREE.LatheGeometry(curva(PERFIL).getPoints(520).map(v=>new THREE.Vector2(Math.max(0,v.x),v.y)),112),ouro,COPA_Y);
    const anel=m(new THREE.TorusGeometry(.664,.02,12,112),ouro,COPA_Y+1.48); anel.rotation.x=Math.PI/2;
    const ga=new THREE.TubeGeometry(curva(ALCA),90,.054,18,false);
    m(ga,ouro,COPA_Y); m(ga,ouro,COPA_Y).rotation.y=Math.PI;
    const es=m(new THREE.ExtrudeGeometry(estrela5(.17,.072),{depth:.03,bevelEnabled:true,bevelThickness:.016,bevelSize:.014,bevelSegments:3}),ouro,COPA_Y+1.74);
    es.position.z=.712; es.rotation.x=-.12;

    /* faíscas que acendem no metal de vez em quando */
    const faiscas=[[0,COPA_Y+2.3,.86],[.6,COPA_Y+2.29,.6],[-.84,COPA_Y+2.28,.2],[1.31,COPA_Y+1.87,0],[-1.2,COPA_Y+2.07,0],[0,COPA_Y+1.9,.8],[.44,COPA_Y+.17,.44],[0,COPA_Y+.72,.21],[.66,.3,.66]].map((p,i)=>{
      const s=new THREE.Sprite(new THREE.SpriteMaterial({map:TX.estrela,blending:THREE.AdditiveBlending,depthTest:false,depthWrite:false,transparent:true}));
      s.position.set(...p); s.scale.setScalar(0); s.userData.fase=i*2.1; g.add(s); return s;
    });
    return {g,faiscas,mats:[ouro,ebano,placa]};
  }

  /* Partículas de luz: rastro na chegada e explosão no pouso */
  function particulas(n){
    const geo=new THREE.BufferGeometry(), pos=new Float32Array(n*3), cor=new Float32Array(n*3), vel=new Float32Array(n*3), vida=new Float32Array(n), dur=new Float32Array(n);
    geo.setAttribute("position",new THREE.BufferAttribute(pos,3)); geo.setAttribute("color",new THREE.BufferAttribute(cor,3));
    const pts=new THREE.Points(geo,new THREE.PointsMaterial({size:.3,map:TX.estrela,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
    pts.frustumCulled=false;
    let prox=0;
    return {obj:pts,
      solta(x,y,z,vx,vy,vz,d){ const i=prox; prox=(prox+1)%n; pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z; vel[i*3]=vx; vel[i*3+1]=vy; vel[i*3+2]=vz; vida[i]=dur[i]=d },
      passo(dt){
        const ar=Math.exp(-1.8*dt);
        for(let i=0;i<n;i++){
          const k=i*3;
          if(vida[i]<=0){ cor[k]=cor[k+1]=cor[k+2]=0; continue }
          vida[i]-=dt; vel[k+1]-=2.2*dt;
          for(let a=0;a<3;a++){ vel[k+a]*=ar; pos[k+a]+=vel[k+a]*dt }
          const f=Math.max(0,vida[i]/dur[i]), tw=.6+.4*Math.sin(vida[i]*40+i);
          cor[k]=f*tw; cor[k+1]=f*.86*tw; cor[k+2]=f*.55*tw;
        }
        geo.attributes.position.needsUpdate=true; geo.attributes.color.needsUpdate=true;
      },
      solte(){ geo.dispose(); pts.material.dispose() }
    };
  }

  /* arrastar para girar (com inércia) */
  let arrasto=null;
  function arrastar(el){
    el.addEventListener("pointerdown",e=>{ if(!obj) return; arrasto={x:e.clientX,t:performance.now()}; obj.vel=0; acordar(); try{ el.setPointerCapture(e.pointerId) }catch(_){} });
    el.addEventListener("pointermove",e=>{
      if(!arrasto||!obj) return;
      const agora=performance.now(), dx=(e.clientX-arrasto.x)*.012, dt=Math.max(.008,(agora-arrasto.t)/1000);
      obj.giroExtra+=dx; obj.vel=Math.max(-14,Math.min(14,dx/dt)); arrasto={x:e.clientX,t:agora};
    });
    const solta=()=>{ arrasto=null };
    el.addEventListener("pointerup",solta); el.addEventListener("pointercancel",solta);
  }

  const easeOut=p=>1-Math.pow(1-p,3);
  const easeInOut=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;

  function montar(caixa,lugar,{aoComecar,aoPousar,parado}={}){
    parar();
    if(!iniciar()) return false;
    const E=ENTRADA[lugar]||ENTRADA[3];
    const T=construir(lugar), P=particulas(260);
    const sombra=new THREE.Mesh(new THREE.PlaneGeometry(3.4,3.4),new THREE.MeshBasicMaterial({map:TX.sombra,transparent:true,depthWrite:false}));
    sombra.rotation.x=-Math.PI/2; sombra.position.y=BASE-.002;
    const aditivo=tex=>new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
    const onda=new THREE.Mesh(new THREE.PlaneGeometry(2,2),aditivo(TX.onda));
    onda.rotation.x=-Math.PI/2; onda.position.y=BASE+.01; onda.visible=false;
    const clarao=new THREE.Sprite(new THREE.SpriteMaterial({map:TX.brilho,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:false,transparent:true}));
    const nucleo=new THREE.Sprite(clarao.material.clone());
    for(const o of [T.g,sombra,onda,clarao,nucleo,P.obj]) cena.add(o);

    obj={T,P,sombra,onda,clarao,nucleo,lugar,E,t:0,ult:0,pousou:false,giroExtra:0,vel:0,parado:!!parado,aoComecar,aoPousar};
    canvasPai=caixa; caixa.appendChild(R.domElement);
    const medir=()=>{ const w=R.domElement.clientWidth||1, h=R.domElement.clientHeight||1; R.setSize(w,h,false); cam.aspect=w/h; cam.updateProjectionMatrix() };
    medir();
    if(window.ResizeObserver){ ro=new ResizeObserver(medir); ro.observe(R.domElement) }
    try{ R.compile(cena,cam) }catch(e){}   // compila os shaders antes, para a entrada não pular quadros
    obj.ult=performance.now();
    if(obj.parado){ obj.pousou=true; if(aoPousar) aoPousar() }
    quadro();
    if(aoComecar) aoComecar();
    return true;
  }

  function quadro(){
    if(!obj) return;
    // o tempo anda no máximo 1/10 s por quadro: num aparelho lento a entrada fica mais lenta, mas não pula
    const o=obj, agora=performance.now(), bruto=Math.max(0,(agora-o.ult)/1000), dt=Math.min(.1,bruto), E=o.E, g=o.T.g;
    o.ult=agora; o.t+=dt;
    // aparelho que não dá conta: desenha em resolução 1×
    o.n=(o.n||0)+1; o.lento=(o.lento||0)+(bruto>.07?1:0);
    if(o.n===8&&o.lento>=5&&R.getPixelRatio()>1){ R.setPixelRatio(1); R.setSize(R.domElement.clientWidth||1,R.domElement.clientHeight||1,false) }
    const t=o.t;
    const tp=o.parado?Infinity:t-E.t;          // tempo desde o pouso (negativo = ainda chegando)
    const p=o.parado?1:Math.min(1,t/E.t), e=easeOut(p);

    /* posição: vem do fundo, alto, numa curva; depois assenta com um quiquezinho e flutua de leve */
    let x=0,y=0,z=0,s=1;
    if(p<1){
      z=E.z*(1-e); y=E.y*(1-e)*(1-e*.35); x=Math.sin(p*Math.PI)*(o.lugar===1?1.3:.6)*(1-p);
      s=.6+.4*e;
    }else{
      const q=Math.min(1,tp/.55);
      y=-.09*Math.sin(Math.PI*q)*(1-q);
      if(!o.parado) y+=.035*Math.sin(Math.max(0,tp-.55)*1.4)*Math.min(1,Math.max(0,tp-.55));
    }
    g.position.set(x,BASE+y,z); g.scale.setScalar(s);
    g.rotation.x=-.3*(1-e)*(1-e);
    g.rotation.z=.18*Math.sin(p*7)*(1-e);

    /* giro: muitas voltas na chegada, desacelerando até o giro lento (a derivada casa no pouso) */
    const A=E.voltas*Math.PI*2;
    o.vel*=Math.exp(-2.2*dt);
    if(!arrasto) o.giroExtra+=o.vel*dt;
    const base=o.parado?.55:GIRO*t-A*Math.pow(1-p,3)+.35;
    g.rotation.y=base+o.giroExtra;

    /* câmera: aproxima devagar; tremidinha no pouso */
    const d=o.parado?9:12.5-3.5*easeInOut(Math.min(1,t/(E.t+1.1)));
    let sx=0,sy=0;
    if(tp>0&&tp<.35){ const a=.07*(1-tp/.35); sx=(Math.random()-.5)*a; sy=(Math.random()-.5)*a }
    cam.position.set(sx,2.05+sy,d); cam.lookAt(0,.05,0);

    /* exposição: o metal "acende" ao chegar e estoura no pouso */
    let ex=1.05;
    if(o.lugar===1&&!o.parado) ex=tp<0?.5+.5*e:1.05+.9*Math.exp(-tp*4);
    else if(!o.parado) ex=tp<0?.8+.25*e:1.05+.4*Math.exp(-tp*5);
    R.toneMappingExposure=ex;

    /* bola de luz que vira troféu */
    const wp=new THREE.Vector3(); g.getWorldPosition(wp); wp.y+=1.43*s;
    o.nucleo.position.copy(wp); o.nucleo.scale.setScalar((1-e)*(o.lugar===1?4.5:2.5)+.001); o.nucleo.material.opacity=Math.pow(1-e,1.5);

    /* rastro de faíscas na chegada */
    if(tp<0&&!o.parado) for(let k=0;k<(o.lugar===1?4:2);k++)
      o.P.solta(wp.x+(Math.random()-.5)*1.4*s,wp.y+(Math.random()-.5)*2.2*s,wp.z,(Math.random()-.5)*.6,(Math.random()-.2)*.8,(Math.random()-.5)*.6,.5+Math.random()*.5);

    /* pouso */
    if(!o.pousou&&tp>=0){
      o.pousou=true;
      for(let k=0;k<E.faiscas;k++){
        const a=Math.random()*Math.PI*2, el=Math.random()*1.2-.2, v=2.2+Math.random()*(o.lugar===1?4.2:2.4);
        o.P.solta((Math.random()-.5)*1.2,BASE+.4+Math.random()*2.2,(Math.random()-.5)*1.2,Math.cos(a)*Math.cos(el)*v,Math.sin(el)*v+1.4,Math.sin(a)*Math.cos(el)*v,.7+Math.random()*.9);
      }
      if(o.aoPousar) o.aoPousar();
    }
    if(tp>=0&&tp<1.1&&!o.parado){
      const q=tp/1.1;
      o.clarao.position.set(0,.35,.4); o.clarao.scale.setScalar((o.lugar===1?7.5:4.5)*easeOut(Math.min(1,q*2.2))); o.clarao.material.opacity=Math.pow(1-q,2)*(o.lugar===1?1:.7);
      o.onda.visible=o.lugar===1; o.onda.scale.setScalar(.6+4.2*easeOut(q)); o.onda.material.opacity=1-q;
    }else{ o.clarao.material.opacity=0; o.onda.visible=false }
    o.sombra.material.opacity=o.parado?1:Math.max(0,(e-.6)/.4)*.9;

    /* reflexo de luz que passa pelo metal, no pouso e depois a cada 6 s */
    const ciclo=o.parado?-1:(tp-.3)%6.5, q=ciclo/1.4;
    if(tp>.3&&q>=0&&q<=1){ luzVarre.position.set(-4+8*easeInOut(q),1.4,3.2); luzVarre.intensity=3.2*Math.sin(Math.PI*q) }
    else luzVarre.intensity=0;

    /* faíscas no metal: só as do lado da câmera */
    const v=new THREE.Vector3();
    for(const f of o.T.faiscas){
      f.getWorldPosition(v);
      const pisca=Math.pow(Math.max(0,Math.sin(t*1.15+f.userData.fase)),14)*(tp>0||o.parado?1:0);
      f.scale.setScalar(v.z>.15?.55*pisca+.001:.001); f.material.rotation=t*.8+f.userData.fase;
    }

    o.P.passo(dt);
    R.render(cena,cam);
    if(!(o.parado&&p>=1&&!arrasto&&Math.abs(o.vel)<.01&&t>.2)) raf=requestAnimationFrame(quadro);
    else raf=0;
  }
  /* parado (sem movimento): arrastar volta a desenhar */
  function acordar(){ if(obj&&!raf) { obj.ult=performance.now(); raf=requestAnimationFrame(quadro) } }

  function parar(){
    cancelAnimationFrame(raf); raf=0;
    if(ro){ ro.disconnect(); ro=null }
    if(obj){
      const o=obj; obj=null; arrasto=null;
      for(const x of [o.T.g,o.sombra,o.onda,o.clarao,o.nucleo,o.P.obj]) cena.remove(x);
      o.T.g.traverse(x=>{ if(x.geometry) x.geometry.dispose() });
      o.T.mats.forEach(m=>{ if(m.map) m.map.dispose(); m.dispose() });
      o.T.faiscas.forEach(f=>f.material.dispose());
      for(const x of [o.sombra,o.onda]){ x.geometry.dispose(); x.material.dispose() }
      o.clarao.material.dispose(); o.nucleo.material.dispose(); o.P.solte();
    }
    if(R&&R.domElement.parentNode) R.domElement.parentNode.removeChild(R.domElement);
    canvasPai=null;
  }

  return {preparar,montar,parar,acordar};
})();
