(function(){
'use strict';
var prev=window.CSA_EXT;
window.CSA_EXT=function(K){
  if(prev)prev(K);
  try{cardsWords13(K)}catch(e){console.error(e)}
};

function cardsWords13(K){
'use strict';
var g=K.g,M=K.M,R=K.R;
var CAT='Cards & Words';
var ICON=String('<svg viewBox=#0 0 24 24# fill=#none# stroke=#currentColor# stroke-width=#2# stroke-linecap=#round# stroke-linejoin=#round#><rect x=#4# y=#4# width=#16# height=#16# rx=#3#/><circle cx=#12# cy=#12# r=#3#/></svg>').split('#').join(String.fromCharCode(39));

function rnd(n){return Math.floor(Math.random()*n)}
function pick(a){return a[rnd(a.length)]}
function shuf(a){var i,j,t;for(i=a.length-1;i>0;i--){j=rnd(i+1);t=a[i];a[i]=a[j];a[j]=t}return a}
function padnum(n){return String(Math.floor(n)).padStart(4,'0')}
var E=['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
function T(){var r,t,n=[];for(r=0;r<4;r++)for(t=1;t<=13;t++)n.push({r:t,s:r});return shuf(n)}

/* local 3D loader: window.THREE is a true global, so this check works independently of g01-g12's own loader */
var THREE3D_loading=false,THREE3D_queue=[];
function loadScript(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(null)};s.onerror=function(){cb(new Error('load fail: '+src))};document.head.appendChild(s)}
function load3DLibs(done){if(window.THREE){done();return}if(THREE3D_loading){THREE3D_queue.push(done);return}THREE3D_loading=true;loadScript('/three.min.js',function(err){THREE3D_loading=false;var q=THREE3D_queue;THREE3D_queue=[];done(err);q.forEach(function(fn){fn(err)})})}
function loadGate(el,startFn){var msg=document.createElement('div');msg.style.cssText='padding:40px;text-align:center;color:'+R.dim+';font-weight:600;';msg.textContent='Loading 3D engine…';el.appendChild(msg);load3DLibs(function(err){if(msg&&msg.parentNode)msg.parentNode.removeChild(msg);if(err){var fail=document.createElement('div');fail.style.cssText='padding:40px;text-align:center;color:'+R.coral+';font-weight:600;';fail.textContent='3D engine failed to load.';el.appendChild(fail);return}startFn()})}
function makeRenderer(){var r2;try{r2=new THREE.WebGLRenderer({antialias:true,alpha:false})}catch(e){return null}r2.setPixelRatio(Math.min(window.devicePixelRatio||1,2));return r2}
function disposeThree(obj){if(!obj)return;if(obj.geometry)obj.geometry.dispose();if(obj.material){if(Array.isArray(obj.material))obj.material.forEach(function(m){m.dispose()});else obj.material.dispose()}}

/* ================= shared scene-dressing helpers: grid floor + rails + glow + 3D particles =================
   Reuses the exact technique the site's own Snake/Brick Blitz games use (floor plane + line-grid overlay +
   boxed rail walls + shadow-casting light + emissive glow accents + 3D sphere particle bursts) so these
   reskinned games read as part of the same arcade, not a separate bare-bones tier. */
function dressScene(scene3d,w,d,opts){opts=opts||{};
  var fy=opts.y!==undefined?opts.y:-1;
  var floor=new THREE.Mesh(new THREE.PlaneGeometry(w+2,d+2),new THREE.MeshStandardMaterial({color:opts.floor!==undefined?opts.floor:0x1c1640,roughness:.95}));
  floor.rotation.x=-Math.PI/2;floor.position.y=fy;floor.receiveShadow=true;scene3d.add(floor);
  var gridMat=new THREE.LineBasicMaterial({color:0x241c47,transparent:true,opacity:.75});
  var pts=[],hw=w/2,hd=d/2,gy=fy+.01,gx,gz;
  for(gx=-hw;gx<=hw+.001;gx++)pts.push(gx,gy,-hd,gx,gy,hd);
  for(gz=-hd;gz<=hd+.001;gz++)pts.push(-hw,gy,gz,hw,gy,gz);
  var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  scene3d.add(new THREE.LineSegments(geo,gridMat));
  var wallMat=new THREE.MeshStandardMaterial({color:opts.wall!==undefined?opts.wall:0x2a2155,roughness:.8});
  var ry=fy+.3;
  var r1=new THREE.Mesh(new THREE.BoxGeometry(w+2,.5,.25),wallMat);r1.position.set(0,ry,-hd-1);scene3d.add(r1);
  var r2=r1.clone();r2.material=wallMat;r2.position.z=hd+1;scene3d.add(r2);
  var r3=new THREE.Mesh(new THREE.BoxGeometry(.25,.5,d+2),wallMat);r3.position.set(-hw-1,ry,0);scene3d.add(r3);
  var r4=r3.clone();r4.material=wallMat;r4.position.x=hw+1;scene3d.add(r4);
  return{floor:floor,rails:[r1,r2,r3,r4]}
}
function glowRing(scene3d,colorNum,y,radius){var m=new THREE.Mesh(new THREE.RingGeometry(radius*.78,radius,40),new THREE.MeshBasicMaterial({color:colorNum,transparent:true,opacity:.45,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.y=y;scene3d.add(m);return m}
function cornerOrbs(scene3d,w,d,y,colorNum){var hw=w/2,hd=d/2,ptsArr=[[-hw+.6,y,-hd+.6],[hw-.6,y,-hd+.6],[-hw+.6,y,hd-.6],[hw-.6,y,hd-.6]],arr=[];ptsArr.forEach(function(p){var m=new THREE.Mesh(new THREE.SphereGeometry(.16,12,10),new THREE.MeshStandardMaterial({color:colorNum,emissive:colorNum,emissiveIntensity:.5,roughness:.4}));m.position.set(p[0],p[1],p[2]);scene3d.add(m);arr.push(m)});return arr}
function makeParticlePool(){return[]}
function burst3d(scene3d,pool,x,y,z,color,n){var c=new THREE.Color(color);for(var i=0;i<(n||16);i++){var mat=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:1});var mesh=new THREE.Mesh(new THREE.SphereGeometry(.09,6,6),mat);mesh.position.set(x,y,z);scene3d.add(mesh);var a=Math.random()*Math.PI*2,sp=.06+Math.random()*.14;pool.push({mesh:mesh,vx:Math.cos(a)*sp,vy:.1+Math.random()*.1,vz:Math.sin(a)*sp,life:1})}}
function stepParticles3d(scene3d,pool){for(var i=pool.length-1;i>=0;i--){var p=pool[i];p.vy-=.012;p.mesh.position.x+=p.vx;p.mesh.position.y+=p.vy;p.mesh.position.z+=p.vz;p.life-=.035;p.mesh.material.opacity=Math.max(0,p.life);if(p.life<=0){scene3d.remove(p.mesh);disposeThree(p.mesh);pool.splice(i,1)}}}
function enableShadows(renderer3d,sun){renderer3d.shadowMap.enabled=true;sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.near=1;sun.shadow.camera.far=30;sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=8;sun.shadow.camera.bottom=-8}

/* mount-API kit, mirroring edu.js's kit()/def() (the proven working pattern used by the Education category) */
var ARROWS=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '];
function kit(id,el,x){
  var G={id:id,el:el,x:x,k:{},dead:false,fns:[],rid:0,last:0,run:null,fx:[],press:null,again:null};
  G.on=function(t,ev,f,o){t.addEventListener(ev,f,o);G.fns.push(function(){t.removeEventListener(ev,f,o)})};
  G.every=function(f,ms){var i=setInterval(f,ms);G.fns.push(function(){clearInterval(i)});return i};
  G.later=function(f,ms){var i=setTimeout(f,ms);G.fns.push(function(){clearTimeout(i)});return i};
  G.canvas=function(w,h){var a=K.A(el,w,h);G.cv=a.canvas;G.c=a.ctx;G.w=w;G.h=h;return G.c};
  function tick(t){G.rid=0;if(G.dead||!G.run)return;G.rid=requestAnimationFrame(tick);var dt=G.last?Math.min(.05,(t-G.last)/1000):.016;G.last=t;try{G.run(dt)}catch(e){G.run=null;console.error(e)}}
  G.frame=function(f){G.run=f;G.last=0;if(!G.rid&&!G.dead)G.rid=requestAnimationFrame(tick)};
  G.stop=function(){G.run=null};
  G.on(document,'keydown',function(e){if(e.ctrlKey||e.metaKey||e.altKey)return;var k=e.key.length===1?e.key.toLowerCase():e.key;if(ARROWS.indexOf(k)>-1)e.preventDefault();if(!G.k[k]){G.k[k]=1;if(G.press)G.press(k,e)}});
  G.on(document,'keyup',function(e){delete G.k[e.key.length===1?e.key.toLowerCase():e.key]});
  G.on(window,'blur',function(){G.k={}});
  G.ax=function(){return(G.k.ArrowRight||G.k.d?1:0)-(G.k.ArrowLeft||G.k.a?1:0)};
  G.ay=function(){return(G.k.ArrowDown||G.k.s?1:0)-(G.k.ArrowUp||G.k.w?1:0)};
  G.pt=function(e){var r=G.cv.getBoundingClientRect();return{x:(e.clientX-r.left)*G.w/r.width,y:(e.clientY-r.top)*G.h/r.height}};
  G.pointer=function(o){var cv=G.cv,dn=false;G.on(cv,'pointerdown',function(e){dn=true;try{cv.setPointerCapture(e.pointerId)}catch(_){}if(o.down)o.down(G.pt(e),e)});G.on(cv,'pointermove',function(e){if(o.move)o.move(G.pt(e),e,dn)});G.on(cv,'pointerup',function(e){dn=false;if(o.up)o.up(G.pt(e),e)});G.on(cv,'pointercancel',function(e){dn=false;if(o.up)o.up(G.pt(e),e)})};
  G.swipe=function(cb){var off=K.D(G.cv,cb);G.fns.push(off)};
  G.hud=function(a){var s=a.map(function(p,i){var q=p[0]+'<b>'+p[1]+'</b>';return i?'<span style=margin-left:1rem>'+q+'</span>':q}).join('');if(s!==G.lh){G.lh=s;x.setHud(s)}};
  G.hint=function(s){x.setHint(s)};
  G.begin=function(start){G.again=function(){G.st=null;start()};x.hideOverlay();G.st=null;start()};
  G.over=function(score,msg,title){G.run=null;score=Math.floor(score);x.reportScore(id,score);x.showOverlay(title||'Game Over',(msg||'Score: '+score)+' · Best '+x.getHighScore(id),'Play again',G.again)};
  G.burst=function(px,py,col,n){var i,a,s;for(i=0;i<(n||10);i++){a=Math.random()*Math.PI*2;s=30+Math.random()*120;G.fx.push({x:px,y:py,vx:Math.cos(a)*s,vy:Math.sin(a)*s,t:.3+Math.random()*.4,m:.7,c:col})}};
  G.fxStep=function(dt){var c=G.c;G.fx=G.fx.filter(function(p){p.t-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.t<=0)return false;c.globalAlpha=Math.max(0,Math.min(1,p.t/p.m));c.fillStyle=p.c;c.fillRect(p.x-1.5,p.y-1.5,3,3);c.globalAlpha=1;return true})};
  G.pad=function(list){if(!('ontouchstart' in window)&&!(navigator.maxTouchPoints>0))return;x.setTouchPad(list.map(function(p){return'<button type=button class=pad-btn data-k='+p[1]+'>'+p[0]+'</button>'}).join(''));[].forEach.call(document.getElementById('touchPad').querySelectorAll('button'),function(b){var k=b.getAttribute('data-k');if(k==='Space')k=' ';G.on(b,'pointerdown',function(e){e.preventDefault();if(!G.k[k]){G.k[k]=1;if(G.press)G.press(k,e)}});var up=function(){delete G.k[k]};G.on(b,'pointerup',up);G.on(b,'pointerleave',up);G.on(b,'pointercancel',up)})};
  G.dispose=function(){G.dead=true;if(G.rid)cancelAnimationFrame(G.rid);G.fns.forEach(function(f){f()})};
  return G;
}
function def(id,title,color,tag,hint,fn){
  g[id]={title:title,tagline:tag,color:color,hint:hint,category:CAT,icon:ICON,mount:function(el,x){var G=kit(id,el,x);fn(G);return function(){G.dispose()}}};
  M.push(id);
}

/* ================= cardDuel3d: higher/lower card duel with a flipping 3D card mesh ================= */
function cardDuel3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Up / H for higher · Down / L for lower · B to bank your streak · three wrong guesses ends it',function(G){
    loadGate(G.el,function(){
      var suits=cfg.suits,colorNum=parseInt(cfg.color.replace('#','0x'));
      var deck,current,lives,streak,score,pot,message,msgColor,lockT,flipT,flipping,pendingCard,flipStartY;
      function multiplier(sv){return Math.min(5,1+Math.floor((sv-1)/3))}
      var scene3d=new THREE.Scene();scene3d.fog=new THREE.Fog(0x0d1530,14,34);
      var camera3d=new THREE.PerspectiveCamera(42,1,.1,100);camera3d.position.set(0,3.4,6.4);camera3d.lookAt(0,.2,0);
      var renderer3d=makeRenderer();
      if(!renderer3d){G.el.innerHTML='<div style="padding:40px;text-align:center;">3D engine failed to load.</div>';return}
      var wrapDiv=document.createElement('div');wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:12px';G.el.appendChild(wrapDiv);
      var canvasWrap=document.createElement('div');canvasWrap.style.cssText='position:relative;width:100%;max-width:420px;aspect-ratio:420/320;margin:0 auto;border-radius:14px;overflow:hidden;background:#0d1530';wrapDiv.appendChild(canvasWrap);
      function resize(){var W=canvasWrap.clientWidth||420,H=W*320/420;renderer3d.setSize(W,H);camera3d.aspect=W/H;camera3d.updateProjectionMatrix();return[W,H]}
      var sz=resize();renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';canvasWrap.appendChild(renderer3d.domElement);G.cv=renderer3d.domElement;G.w=sz[0];G.h=sz[1];
      scene3d.add(new THREE.AmbientLight(0xcfe9ff,.65));var sun=new THREE.DirectionalLight(0xffffff,.9);sun.position.set(4,7,5);scene3d.add(sun);
      enableShadows(renderer3d,sun);
      dressScene(scene3d,7,5.5,{y:-1});
      glowRing(scene3d,colorNum,-.99,1.3);
      var orbs=cornerOrbs(scene3d,7,5.5,-.5,colorNum);
      var particles=makeParticlePool();
      var cardCanvas=document.createElement('canvas');cardCanvas.width=256;cardCanvas.height=358;var cctx=cardCanvas.getContext('2d');
      var cardTex=new THREE.CanvasTexture(cardCanvas);
      var sideMat=new THREE.MeshStandardMaterial({color:colorNum,emissive:colorNum,emissiveIntensity:.25});
      var cardMesh=new THREE.Mesh(new THREE.BoxGeometry(1.6,2.2,.06),[sideMat,sideMat,sideMat,sideMat,new THREE.MeshStandardMaterial({map:cardTex}),new THREE.MeshStandardMaterial({color:0x1a1530})]);
      cardMesh.position.y=.6;cardMesh.castShadow=true;scene3d.add(cardMesh);
      var spotlight=new THREE.PointLight(colorNum,.9,6);spotlight.position.set(0,2,1.5);scene3d.add(spotlight);
      function drawCard(card){cctx.clearRect(0,0,256,358);cctx.fillStyle='#f4f1ff';cctx.beginPath();cctx.roundRect(4,4,248,350,20);cctx.fill();var red=1===card.s||2===card.s;cctx.fillStyle=red?'#d8434a':'#171233';cctx.font='700 46px Figtree, sans-serif';cctx.textAlign='left';cctx.fillText(E[card.r],16,58);cctx.font='64px Figtree, sans-serif';cctx.textAlign='center';cctx.fillText(suits[card.s],128,210);cctx.save();cctx.translate(240,330);cctx.rotate(Math.PI);cctx.font='700 46px Figtree, sans-serif';cctx.textAlign='left';cctx.fillText(E[card.r],0,0);cctx.restore();cardTex.needsUpdate=!0}
      function updateHud(){msgDiv.textContent=message;msgDiv.style.color=msgColor;livesDiv.textContent='LIVES '+'♥'.repeat(Math.max(0,lives));potBtn.textContent=pot>0?'BANK — '+pot:'BANK';potBtn.disabled=pot<=0;G.hud([['SCORE',padnum(score)],['STREAK',streak],['POT',pot]])}
      function bank(){if(lockT>0||pot<=0||flipping)return;score+=pot;message='Banked '+pot+' points!';msgColor=cfg.color;pot=0;streak=0;updateHud()}
      function guess(wantHigher){if(lockT>0||flipping)return;if(!deck.length)deck=T();var next=deck.pop();if(next.r===current.r){message='Same rank. Push.';msgColor='#9aa'}else if(next.r>current.r===wantHigher){streak++;var mult=multiplier(streak);pot+=10*mult;message='Correct! Streak '+streak+' · x'+mult;msgColor='#3ddc97';burst3d(scene3d,particles,cardMesh.position.x,cardMesh.position.y,cardMesh.position.z,0x3ddc97,18)}else{lives--;pot=0;streak=0;message='Wrong! Pot lost.';msgColor='#ff6b4a';burst3d(scene3d,particles,cardMesh.position.x,cardMesh.position.y,cardMesh.position.z,0xff6b4a,18)}
      flipping=!0;flipT=0;flipStartY=cardMesh.rotation.y;pendingCard=next;updateHud()}
      var hudBar=document.createElement('div');hudBar.style.cssText='display:flex;justify-content:space-between;width:100%;max-width:360px;font-weight:700;font-size:.8rem;opacity:.85;';var livesDiv=document.createElement('div');hudBar.appendChild(livesDiv);wrapDiv.appendChild(hudBar);
      var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';wrapDiv.appendChild(msgDiv);
      var btnRow=document.createElement('div');btnRow.style.cssText='display:flex;gap:10px;width:100%;max-width:360px;';
      var hiBtn=document.createElement('button');hiBtn.type='button';hiBtn.textContent='HIGHER';hiBtn.style.cssText='flex:1;padding:14px;border-radius:10px;border:none;background:#3ddc97;color:#171233;font-weight:800;cursor:pointer;';hiBtn.addEventListener('click',function(){guess(!0)});btnRow.appendChild(hiBtn);
      var loBtn=document.createElement('button');loBtn.type='button';loBtn.textContent='LOWER';loBtn.style.cssText='flex:1;padding:14px;border-radius:10px;border:none;background:#ff6b4a;color:#171233;font-weight:800;cursor:pointer;';loBtn.addEventListener('click',function(){guess(!1)});btnRow.appendChild(loBtn);
      wrapDiv.appendChild(btnRow);
      var potBtn=document.createElement('button');potBtn.type='button';potBtn.style.cssText='width:100%;max-width:360px;padding:12px;border-radius:10px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;';potBtn.addEventListener('click',bank);wrapDiv.appendChild(potBtn);
      G.press=function(k){if('ArrowUp'===k||'h'===k)guess(!0);else if('ArrowDown'===k||'l'===k)guess(!1);else if('b'===k)bank()};
      G.pad([['Higher','ArrowUp'],['Lower','ArrowDown'],['Bank','b']]);
      G.fns.push(function(){scene3d.traverse(function(o){disposeThree(o)});renderer3d.dispose()});
      function tick(dt){
        if(flipping){var p2=flipT;flipT+=dt/.5;if(p2<.5&&flipT>=.5)drawCard(pendingCard);cardMesh.rotation.y=flipStartY+Math.min(flipT,1)*Math.PI;if(flipT>=1){cardMesh.rotation.y=flipStartY+Math.PI;current=pendingCard;flipping=!1;if(lives<=0){lockT=99;G.later(function(){G.over(score,'Out of lives. Final score: '+score)},500)}}}
        var tnow=performance.now()/1000;orbs.forEach(function(o,i){o.position.y=-.5+Math.sin(tnow*1.4+i*1.5)*.08});
        stepParticles3d(scene3d,particles);
        var w2=canvasWrap.clientWidth;if(w2&&Math.abs(w2-G.w)>4){var sz2=resize();G.w=sz2[0];G.h=sz2[1]}
        renderer3d.render(scene3d,camera3d)}
      G.begin(function(){deck=T();current=deck.pop();lives=cfg.lives||3;streak=0;score=0;pot=0;message='Higher or lower?';msgColor='#E9FBF9';lockT=0;flipping=!1;flipT=0;drawCard(current);cardMesh.rotation.y=0;updateHud();G.frame(tick)})
    })
  })
}
cardDuel3d('starDuel',{title:'Star Duel',tagline:'Guess higher or lower under the stars, bank your streak before it burns out.',color:R.violet,suits:['★','✦','✪','✶']});
cardDuel3d('gemDuel',{title:'Gem Duel',tagline:'Call higher or lower on the gem table — four lives to cash out before you bust.',color:R.magenta,suits:['◆','●','▲','■'],lives:4});
cardDuel3d('casinoDuel',{title:'Casino Duel',tagline:'Classic high-card nerve — just two lives, guess right, build the pot, know when to walk.',color:R.yellow,suits:['♠','♥','♦','♣'],lives:2});
cardPushLuck('arrowDuel',{title:'Arrow Duel',tagline:'Read the next arrow — higher or lower — and bank before you miss.',color:R.teal,suits:['▲','▼','◀','▶']});
cardPushLuck('moonDuel',{title:'Moon Duel',tagline:'The night sky busts sooner — chase a lower ceiling and bank before you cross it.',color:R.coral,suits:['☀','☾','☆','●'],bust:24});
cardPushLuck('crownDuel',{title:'Crown Duel',tagline:'Royal stakes — only two busts allowed, so bank early and often.',color:R.green,suits:['♔','♕','♖','♗'],lives:2});
cardWager('waveDuel',{title:'Wave Duel',tagline:'Ride the tide of higher-or-lower — bank your pot before it crashes.',color:R.blue,suits:['≈','∿','○','◇']});
cardWager('boltDuel',{title:'Bolt Duel',tagline:'The storm is short — just 10 fast rounds to chain a streak before it turns.',color:R.orange,suits:['⚡','✹','✺','✴'],rounds:10});

/* ================= wordReveal3d: hangman-style word guessing with flipping 3D letter tiles ================= */
function wordReveal3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Click or type a letter to guess · six wrong guesses ends the round',function(G){
    loadGate(G.el,function(){
      var colorNum=parseInt(cfg.color.replace('#','0x'));
      var word,guessed,wrong,score,solved,ended;
      var MAXWRONG=6;
      var scene3d=new THREE.Scene();scene3d.fog=new THREE.Fog(0x0d1530,14,34);
      var camera3d=new THREE.PerspectiveCamera(44,1,.1,100);camera3d.position.set(0,3.6,7.2);camera3d.lookAt(0,.1,0);
      var renderer3d=makeRenderer();
      if(!renderer3d){G.el.innerHTML='<div style="padding:40px;text-align:center;">3D engine failed to load.</div>';return}
      var wrapDiv=document.createElement('div');wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:12px';G.el.appendChild(wrapDiv);
      var canvasWrap=document.createElement('div');canvasWrap.style.cssText='position:relative;width:100%;max-width:440px;aspect-ratio:440/280;margin:0 auto;border-radius:14px;overflow:hidden;background:#0d1530';wrapDiv.appendChild(canvasWrap);
      function resize(){var W=canvasWrap.clientWidth||440,H=W*280/440;renderer3d.setSize(W,H);camera3d.aspect=W/H;camera3d.updateProjectionMatrix();return[W,H]}
      var sz=resize();renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';canvasWrap.appendChild(renderer3d.domElement);G.cv=renderer3d.domElement;G.w=sz[0];G.h=sz[1];
      scene3d.add(new THREE.AmbientLight(0xcfe9ff,.65));var sun=new THREE.DirectionalLight(0xffffff,.9);sun.position.set(4,7,5);scene3d.add(sun);
      enableShadows(renderer3d,sun);
      dressScene(scene3d,13,7,{y:-1.2});
      glowRing(scene3d,colorNum,-1.19,2.6);
      var particles=makeParticlePool();
      var tileGroup=new THREE.Group();scene3d.add(tileGroup);
      var tiles=[];
      function tileTexture(ch){var c=document.createElement('canvas');c.width=96;c.height=96;var ctx2=c.getContext('2d');ctx2.fillStyle='#f4f1ff';ctx2.beginPath();ctx2.roundRect(4,4,88,88,14);ctx2.fill();ctx2.fillStyle='#171233';ctx2.font='700 52px Figtree, sans-serif';ctx2.textAlign='center';ctx2.textBaseline='middle';ctx2.fillText(ch?ch.toUpperCase():'',48,52);return new THREE.CanvasTexture(c)}
      function blankTexture(){var c=document.createElement('canvas');c.width=96;c.height=96;var ctx2=c.getContext('2d');ctx2.fillStyle='#241c47';ctx2.beginPath();ctx2.roundRect(4,4,88,88,14);ctx2.fill();return new THREE.CanvasTexture(c)}
      function buildTiles(){tiles.forEach(function(t2){tileGroup.remove(t2.mesh);disposeThree(t2.mesh)});tiles=[];var n=word.length,spacing=.92,totalW=(n-1)*spacing;for(var i=0;i<n;i++){var blankMat=new THREE.MeshStandardMaterial({map:blankTexture()});var sideMat=new THREE.MeshStandardMaterial({color:colorNum,emissive:colorNum,emissiveIntensity:.2});var mesh=new THREE.Mesh(new THREE.BoxGeometry(.8,.8,.1),[sideMat,sideMat,sideMat,sideMat,blankMat,sideMat]);mesh.position.set(-totalW/2+i*spacing,.4,0);mesh.castShadow=true;tileGroup.add(mesh);tiles.push({mesh:mesh,ch:word.charAt(i),revealed:!1,flipT:0,flipping:!1})}}
      function revealLetter(ch){for(var i=0;i<tiles.length;i++)if(tiles[i].ch===ch&&!tiles[i].revealed){tiles[i].revealed=!0;tiles[i].flipping=!0;tiles[i].flipT=0}}
      function isComplete(){return tiles.every(function(t2){return t2.revealed})}
      function guessLetter(ch){if(ended||guessed[ch])return;guessed[ch]=!0;if(word.indexOf(ch)>=0){revealLetter(ch);updateKeys();if(isComplete()){solved++;score+=100;ended=!0;msgDiv.textContent='Solved! +100';msgDiv.style.color='#3ddc97';burst3d(scene3d,particles,0,.4,0,0x3ddc97,26);G.later(newWord,900)}}else{wrong++;updateKeys();msgDiv.textContent='Wrong guess — '+(MAXWRONG-wrong)+' left';msgDiv.style.color='#ff6b4a';burst3d(scene3d,particles,0,1.4,0,0xff6b4a,10);if(wrong>=MAXWRONG){ended=!0;msgDiv.textContent='Out of guesses. Word was '+word.toUpperCase();G.later(function(){G.over(score,'Words solved: '+solved+' · Score: '+score)},1200)}}
      updateHud()}
      function updateHud(){G.hud([['SCORE',padnum(score)],['SOLVED',solved],['WRONG',wrong+'/'+MAXWRONG]])}
      var keysDiv=document.createElement('div');keysDiv.style.cssText='display:flex;flex-wrap:wrap;gap:6px;justify-content:center;width:100%;max-width:420px;';wrapDiv.appendChild(keysDiv);
      var keyBtns={};
      'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function(ch){var b=document.createElement('button');b.type='button';b.textContent=ch.toUpperCase();b.style.cssText='width:30px;height:34px;border-radius:6px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;font-size:.8rem;';b.addEventListener('click',function(){guessLetter(ch)});keysDiv.appendChild(b);keyBtns[ch]=b});
      function updateKeys(){Object.keys(keyBtns).forEach(function(ch){var b=keyBtns[ch];if(guessed[ch]){b.disabled=!0;b.style.opacity='.35';b.style.background=word.indexOf(ch)>=0?'#3ddc97':'#555'}else{b.disabled=!1;b.style.opacity='1';b.style.background=cfg.color}})}
      var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';wrapDiv.appendChild(msgDiv);
      G.press=function(k){if(k&&1===k.length&&k>='a'&&k<='z')guessLetter(k)};
      G.fns.push(function(){scene3d.traverse(function(o){disposeThree(o)});renderer3d.dispose()});
      function tick(dt){tiles.forEach(function(t2){if(t2.flipping){t2.flipT+=dt/.4;if(t2.flipT>=.5&&t2.flipT-dt/.4<.5){t2.mesh.material[4].dispose();t2.mesh.material[4]=new THREE.MeshStandardMaterial({map:tileTexture(t2.ch),emissive:colorNum,emissiveIntensity:.12})}t2.mesh.rotation.y=Math.min(t2.flipT,1)*Math.PI;if(t2.flipT>=1){t2.flipping=!1;t2.mesh.rotation.y=Math.PI}}});
        stepParticles3d(scene3d,particles);
        var w2=canvasWrap.clientWidth;if(w2&&Math.abs(w2-G.w)>4){var sz2=resize();G.w=sz2[0];G.h=sz2[1]}
        renderer3d.render(scene3d,camera3d)}
      function newWord(){word=pick(cfg.words).toLowerCase();guessed={};wrong=0;ended=!1;msgDiv.textContent='Guess the word!';msgDiv.style.color='#E9FBF9';updateKeys();buildTiles();updateHud()}
      G.begin(function(){score=0;solved=0;newWord();G.frame(tick)})
    })
  })
}
wordReveal3d('animalWords',{title:'Animal Words',tagline:'Guess the hidden animal one letter at a time before you run out of tries.',color:R.green,words:['tiger','zebra','falcon','otter','panda','walrus','cheetah','giraffe','dolphin','penguin','koala','beaver','camel','rabbit','hedgehog','flamingo','octopus','sparrow','leopard','gorilla','raccoon','peacock','antelope','wombat']});
wordReveal3d('foodWords',{title:'Food Words',tagline:'Reveal the hidden dish or ingredient before the guesses run dry.',color:R.coral,words:['noodle','pretzel','avocado','burrito','waffle','biscuit','sausage','spinach','mustard','paprika','oatmeal','lasagna','pancake','walnut','cabbage','risotto','omelet','pumpkin','coconut','mango','ginger','broccoli','cinnamon','yogurt']});
wordReveal3d('spaceWords',{title:'Space Words',tagline:'Guess the hidden space term before your tries burn out.',color:R.violet,words:['comet','nebula','asteroid','galaxy','orbit','meteor','quasar','pulsar','satellite','telescope','gravity','eclipse','rocket','cosmos','starlight','blackhole','horizon','capsule','booster','module','crater','lunar','solar','vacuum']});
wordScramble('sportsWords',{title:'Sports Words',tagline:'Guess the hidden sports term before you run out of tries.',color:R.blue,words:['referee','stadium','offside','dribble','sprint','hurdle','javelin','wrestle','paddle','racket','goalie','fairway','rebound','timeout','penalty','scrimmage','touchdown','backstroke','marathon','forehand','dugout','bullseye','relay','podium']});
wordScramble('musicWords',{title:'Music Words',tagline:'Guess the hidden music term before the band runs out of patience.',color:R.magenta,words:['melody','rhythm','chorus','ballad','trumpet','cymbal','acoustic','harmony','tempo','falsetto','ukulele','clarinet','orchestra','vocalist','baritone','crescendo','interlude','harmonica','vibrato','sonata','timbre','encore','octave','ensemble']});
wordCrossfire('natureWords',{title:'Nature Words',tagline:'Guess the hidden nature word before your guesses run dry.',color:R.teal,words:['canyon','glacier','wetland','volcano','meadow','tundra','plateau','savanna','lagoon','boulder','cascade','thicket','orchard','prairie','monsoon','horizon','driftwood','bedrock','wildfire','estuary','foliage','ravine','blossom','summit']});
wordCrossfire('techWords',{title:'Tech Words',tagline:'Guess the hidden tech term before you run out of attempts.',color:R.yellow,words:['firewall','browser','keyboard','monitor','gigabyte','terminal','bluetooth','firmware','database','algorithm','encrypt','joystick','hologram','prototype','router','pixel','upload','malware','compiler','wireless','backup','circuit','software','gadget']});

/* ================= cardPushLuck: draw cards, bank your running total before you bust ================= */
function cardPushLuck(id,cfg){
  var BUST=cfg.bust||31;
  def(id,cfg.title,cfg.color,cfg.tagline,'Draw cards and bank before you bust past '+BUST+' · D to draw · B to bank · '+(cfg.lives||3)+' busts ends it',function(G){
    var deck,total,lives,score,drawn,cards,message,msgColor;
    var wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:12px;align-items:center;width:100%;max-width:400px;margin:0 auto;';G.el.appendChild(wrap);
    var cardsRow=document.createElement('div');cardsRow.style.cssText='display:flex;flex-wrap:wrap;gap:6px;justify-content:center;min-height:70px;width:100%;';wrap.appendChild(cardsRow);
    var totalDiv=document.createElement('div');totalDiv.style.cssText='font-weight:800;font-size:1.3rem;text-align:center;';wrap.appendChild(totalDiv);
    var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';wrap.appendChild(msgDiv);
    var btnRow=document.createElement('div');btnRow.style.cssText='display:flex;gap:10px;width:100%;';
    var drawBtn=document.createElement('button');drawBtn.type='button';drawBtn.textContent='DRAW';drawBtn.style.cssText='flex:1;padding:14px;border-radius:10px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;';
    var bankBtn=document.createElement('button');bankBtn.type='button';bankBtn.textContent='BANK';bankBtn.style.cssText='flex:1;padding:14px;border-radius:10px;border:none;background:#3ddc97;color:#171233;font-weight:800;cursor:pointer;';
    btnRow.appendChild(drawBtn);btnRow.appendChild(bankBtn);wrap.appendChild(btnRow);
    function renderCards(){cardsRow.innerHTML=cards.map(function(c){var red=c.s===1||c.s===2;return '<div style="width:34px;height:48px;border-radius:6px;background:#f4f1ff;color:'+(red?'#d8434a':'#171233')+';display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.85rem;">'+E[c.r]+'</div>'}).join('')}
    function updateHud(){totalDiv.textContent='TOTAL '+total;msgDiv.textContent=message;msgDiv.style.color=msgColor;bankBtn.disabled=total<=0;G.hud([['SCORE',padnum(score)],['LIVES','♥'.repeat(Math.max(0,lives))]])}
    function doDraw(){if(lives<=0)return;if(!deck.length)deck=T();var c=deck.pop();cards.push(c);drawn++;total+=c.r;renderCards();if(total>BUST){lives--;message='Bust at '+total+'! Run lost.';msgColor='#ff6b4a';total=0;cards=[];drawn=0;renderCards();if(lives<=0){G.later(function(){G.over(score,'Final score: '+score)},500)}}else{message='Drew '+E[c.r]+'. Keep going or bank.';msgColor='#E9FBF9'}updateHud()}
    function doBank(){if(total<=0)return;score+=total;message='Banked '+total+' points!';msgColor=cfg.color;total=0;cards=[];drawn=0;renderCards();updateHud()}
    drawBtn.addEventListener('click',doDraw);bankBtn.addEventListener('click',doBank);
    G.press=function(k){if('d'===k)doDraw();else if('b'===k)doBank()};
    G.pad([['Draw','d'],['Bank','b']]);
    G.begin(function(){deck=T();total=0;lives=cfg.lives||3;score=0;drawn=0;cards=[];message='Draw a card to start.';msgColor='#E9FBF9';renderCards();updateHud()})
  });
}

/* ================= cardWager: pick a wager tier, reveal vs the dealer, 15 rounds ================= */
function cardWager(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Pick a wager — Low/Med/High — before the reveal · higher card wins the wager, lower loses it · '+(cfg.rounds||15)+' rounds',function(G){
    var deck,score,round,message,msgColor,ROUNDS=cfg.rounds||15;
    var wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:12px;align-items:center;width:100%;max-width:400px;margin:0 auto;';G.el.appendChild(wrap);
    var cardsRow=document.createElement('div');cardsRow.style.cssText='display:flex;gap:16px;justify-content:center;min-height:70px;width:100%;align-items:center;';wrap.appendChild(cardsRow);
    var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';wrap.appendChild(msgDiv);
    var btnRow=document.createElement('div');btnRow.style.cssText='display:flex;gap:8px;width:100%;';
    var tiers=[{label:'LOW',amt:10},{label:'MED',amt:25},{label:'HIGH',amt:50}];
    tiers.forEach(function(t){var b=document.createElement('button');b.type='button';b.textContent=t.label+' ('+t.amt+')';b.style.cssText='flex:1;padding:12px 6px;border-radius:10px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;font-size:.8rem;';b.addEventListener('click',function(){resolveRound(t.amt)});btnRow.appendChild(b)});
    wrap.appendChild(btnRow);
    function cardFace(c,label){var red=c.s===1||c.s===2;return '<div style="text-align:center;"><div style="width:44px;height:62px;border-radius:7px;background:#f4f1ff;color:'+(red?'#d8434a':'#171233')+';display:flex;align-items:center;justify-content:center;font-weight:800;">'+E[c.r]+'</div><div style="font-size:.65rem;opacity:.6;margin-top:3px;">'+label+'</div></div>'}
    function renderCards(you,opp){cardsRow.innerHTML=(you?cardFace(you,'YOU'):'')+(opp?cardFace(opp,'DEALER'):'')}
    function updateHud(){G.hud([['SCORE',padnum(score)],['ROUND',round+'/'+ROUNDS]])}
    function resolveRound(amt){if(round>=ROUNDS)return;if(!deck||deck.length<2)deck=T();var you=deck.pop(),opp=deck.pop();renderCards(you,opp);round++;if(you.r===opp.r){message='Push — tie, wager returned.';msgColor='#9aa'}else if(you.r>opp.r){score+=amt;message='You win! +'+amt;msgColor='#3ddc97'}else{score=Math.max(0,score-amt);message='Dealer wins. -'+amt;msgColor='#ff6b4a'}updateHud();if(round>=ROUNDS){G.later(function(){G.over(score,ROUNDS+' rounds complete. Final score: '+score)},900)}}
    G.press=function(k){if('1'===k)resolveRound(10);else if('2'===k)resolveRound(25);else if('3'===k)resolveRound(50)};
    G.pad([['Low','1'],['Med','2'],['High','3']]);
    G.begin(function(){deck=T();score=0;round=0;message='Pick a wager to reveal.';msgColor='#E9FBF9';renderCards(null,null);updateHud()})
  });
}

/* ================= wordScramble: click shuffled letters in order to spell the word ================= */
function wordScramble(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Click the shuffled letters in order to spell the word · 5 mistakes ends the round',function(G){
    var word,order,nextIdx,mistakes,score,solved;
    var MAXW=5;
    var wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:12px;align-items:center;width:100%;max-width:420px;margin:0 auto;';G.el.appendChild(wrap);
    var answerDiv=document.createElement('div');answerDiv.style.cssText='font-weight:800;font-size:1.3rem;letter-spacing:.15em;text-align:center;min-height:1.6em;';wrap.appendChild(answerDiv);
    var tilesDiv=document.createElement('div');tilesDiv.style.cssText='display:flex;flex-wrap:wrap;gap:6px;justify-content:center;width:100%;';wrap.appendChild(tilesDiv);
    var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';wrap.appendChild(msgDiv);
    function updateHud(){G.hud([['SCORE',padnum(score)],['SOLVED',solved],['MISTAKES',mistakes+'/'+MAXW]])}
    function renderAnswer(){var s='';for(var i=0;i<word.length;i++)s+=i<nextIdx?word.charAt(i).toUpperCase():'_';answerDiv.textContent=s.split('').join(' ')}
    function renderTiles(){tilesDiv.innerHTML='';order.forEach(function(item){var b=document.createElement('button');b.type='button';b.textContent=item.ch.toUpperCase();b.style.cssText='width:38px;height:40px;border-radius:7px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;';b.addEventListener('click',function(){pickLetter(item,b)});tilesDiv.appendChild(b)})}
    function pickLetter(item,btn){if(item.used||nextIdx>=word.length)return;if(item.ch===word.charAt(nextIdx)){item.used=!0;btn.disabled=!0;btn.style.opacity='.3';nextIdx++;renderAnswer();if(nextIdx>=word.length){solved++;score+=100;msgDiv.textContent='Solved! +100';msgDiv.style.color='#3ddc97';updateHud();G.later(newWord,900);return}}else{mistakes++;msgDiv.textContent='Wrong spot — '+(MAXW-mistakes)+' left';msgDiv.style.color='#ff6b4a';btn.style.background='#ff6b4a';G.later(function(){btn.style.background=cfg.color},250);if(mistakes>=MAXW){msgDiv.textContent='Out of tries. Word was '+word.toUpperCase();G.later(function(){G.over(score,'Words solved: '+solved+' · Score: '+score)},1200)}}updateHud()}
    function newWord(){word=pick(cfg.words).toLowerCase();order=shuf(word.split('').map(function(ch,i){return{ch:ch,i:i,used:!1}}));nextIdx=0;renderAnswer();renderTiles()}
    G.begin(function(){score=0;solved=0;mistakes=0;msgDiv.textContent='Spell the word!';msgDiv.style.color='#E9FBF9';newWord();updateHud()})
  });
}

/* ================= wordCrossfire: type the whole word before decaying hints give it away ================= */
function wordCrossfire(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Type the whole word before the hints run out · Enter to submit · 10 words',function(G){
    var word,revealed,score,solved,attempts,hintTimer;
    var MAXATTEMPTS=10;
    var wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:12px;align-items:center;width:100%;max-width:400px;margin:0 auto;';G.el.appendChild(wrap);
    var hintDiv=document.createElement('div');hintDiv.style.cssText='font-weight:800;font-size:1.3rem;letter-spacing:.15em;text-align:center;min-height:1.6em;';wrap.appendChild(hintDiv);
    var inputRow=document.createElement('div');inputRow.style.cssText='display:flex;gap:8px;width:100%;';
    var input=document.createElement('input');input.type='text';input.autocomplete='off';input.spellcheck=!1;input.style.cssText='flex:1;padding:12px;border-radius:10px;border:none;font-size:1rem;';
    var submitBtn=document.createElement('button');submitBtn.type='button';submitBtn.textContent='GUESS';submitBtn.style.cssText='padding:12px 18px;border-radius:10px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;';
    inputRow.appendChild(input);inputRow.appendChild(submitBtn);wrap.appendChild(inputRow);
    var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';wrap.appendChild(msgDiv);
    function updateHud(){G.hud([['SCORE',padnum(score)],['SOLVED',solved],['WORD',attempts+'/'+MAXATTEMPTS]])}
    function renderHint(){var s='';for(var i=0;i<word.length;i++)s+=i<revealed?word.charAt(i).toUpperCase():'_';hintDiv.textContent=s.split('').join(' ')}
    function newWord(){word=pick(cfg.words).toLowerCase();revealed=1;attempts++;input.value='';renderHint();msgDiv.textContent='Guess before the hints run out!';msgDiv.style.color='#E9FBF9';hintTimer=G.every(function(){if(revealed<word.length){revealed++;renderHint()}},2800);updateHud()}
    function submitGuess(){var val=(input.value||'').toLowerCase().trim();if(!val)return;if(val===word){var bonus=Math.max(10,100-10*(revealed-1));score+=bonus;solved++;msgDiv.textContent='Correct! +'+bonus;msgDiv.style.color='#3ddc97';clearInterval(hintTimer);if(attempts>=MAXATTEMPTS){G.later(function(){G.over(score,'Words solved: '+solved+' · Score: '+score)},900);return}G.later(newWord,900)}else{msgDiv.textContent='Not quite — try again';msgDiv.style.color='#ff6b4a';input.value=''}}
    submitBtn.addEventListener('click',submitGuess);
    input.addEventListener('keydown',function(e){if('Enter'===e.key){e.preventDefault();submitGuess()}});
    G.begin(function(){score=0;solved=0;attempts=0;newWord()})
  });
}


}
})();
