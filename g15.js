(function(){
'use strict';
var prev=window.CSA_EXT;
window.CSA_EXT=function(K){
  if(prev)prev(K);
  try{reflex15(K)}catch(e){console.error(e)}
};

function reflex15(K){
'use strict';
var g=K.g,M=K.M,R=K.R;
var CAT='Reflex';
var ICON=String('<svg viewBox=#0 0 24 24# fill=#none# stroke=#currentColor# stroke-width=#2# stroke-linecap=#round# stroke-linejoin=#round#><rect x=#4# y=#4# width=#16# height=#16# rx=#3#/><circle cx=#12# cy=#12# r=#3#/></svg>').split('#').join(String.fromCharCode(39));

function rnd(n){return Math.floor(Math.random()*n)}
function pick(a){return a[rnd(a.length)]}
function clamp(v,a,b){return v<a?a:v>b?b:v}
function padnum(n){return String(Math.floor(n)).padStart(4,'0')}

var THREE3D_loading=false,THREE3D_queue=[];
function loadScript(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(null)};s.onerror=function(){cb(new Error('load fail: '+src))};document.head.appendChild(s)}
function load3DLibs(done){if(window.THREE){done();return}if(THREE3D_loading){THREE3D_queue.push(done);return}THREE3D_loading=true;loadScript('/three.min.js',function(err){THREE3D_loading=false;var q=THREE3D_queue;THREE3D_queue=[];done(err);q.forEach(function(fn){fn(err)})})}
function loadGate(el,startFn){var msg=document.createElement('div');msg.style.cssText='padding:40px;text-align:center;color:'+R.dim+';font-weight:600;';msg.textContent='Loading 3D engine…';el.appendChild(msg);load3DLibs(function(err){if(msg&&msg.parentNode)msg.parentNode.removeChild(msg);if(err){var fail=document.createElement('div');fail.style.cssText='padding:40px;text-align:center;color:'+R.coral+';font-weight:600;';fail.textContent='3D engine failed to load.';el.appendChild(fail);return}startFn()})}
function makeRenderer(){var r2;try{r2=new THREE.WebGLRenderer({antialias:true,alpha:false})}catch(e){return null}r2.setPixelRatio(Math.min(window.devicePixelRatio||1,2));return r2}
function disposeThree(obj){if(!obj)return;if(obj.geometry)obj.geometry.dispose();if(obj.material){if(Array.isArray(obj.material))obj.material.forEach(function(m){m.dispose()});else obj.material.dispose()}}

/* ================= shared scene-dressing helpers (grid floor, rails, glow, 3D particle bursts, shadows) ================= */
function addGridLines(scene3d,w,d,y){var gridMat=new THREE.LineBasicMaterial({color:0x3a2f78,transparent:true,opacity:.85});var pts=[],hw=w/2,hd=d/2,gx,gz;for(gx=-hw;gx<=hw+.001;gx++)pts.push(gx,y,-hd,gx,y,hd);for(gz=-hd;gz<=hd+.001;gz++)pts.push(-hw,y,gz,hw,y,gz);var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));var ls=new THREE.LineSegments(geo,gridMat);scene3d.add(ls);return ls}
function addFloor(scene3d,w,d,y,colorHex){var floor=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshStandardMaterial({color:colorHex!==undefined?colorHex:0x1c1640,roughness:.95}));floor.rotation.x=-Math.PI/2;floor.position.y=y;floor.receiveShadow=true;scene3d.add(floor);return floor}
function addRails(scene3d,w,d,y,colorHex){var wallMat=new THREE.MeshStandardMaterial({color:colorHex!==undefined?colorHex:0x2a2155,roughness:.8});var hw=w/2,hd=d/2;var r1=new THREE.Mesh(new THREE.BoxGeometry(w+.6,.4,.2),wallMat);r1.position.set(0,y+.2,-hd-.1);scene3d.add(r1);var r2=r1.clone();r2.material=wallMat;r2.position.z=hd+.1;scene3d.add(r2);var r3=new THREE.Mesh(new THREE.BoxGeometry(.2,.4,d+.6),wallMat);r3.position.set(-hw-.1,y+.2,0);scene3d.add(r3);var r4=r3.clone();r4.material=wallMat;r4.position.x=hw+.1;scene3d.add(r4);return[r1,r2,r3,r4]}
function glowOrbs(scene3d,ptsArr,colorNum){var arr=[];ptsArr.forEach(function(p){var m=new THREE.Mesh(new THREE.SphereGeometry(.14,12,10),new THREE.MeshStandardMaterial({color:colorNum,emissive:colorNum,emissiveIntensity:.5,roughness:.4}));m.position.set(p[0],p[1],p[2]);scene3d.add(m);arr.push(m)});return arr}
function makeParticlePool(){return[]}
function burst3d(scene3d,pool,x,y,z,color,n){var c=new THREE.Color(color);for(var i=0;i<(n||16);i++){var mat=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:1});var mesh=new THREE.Mesh(new THREE.SphereGeometry(.09,6,6),mat);mesh.position.set(x,y,z);scene3d.add(mesh);var a=Math.random()*Math.PI*2,sp=.06+Math.random()*.14;pool.push({mesh:mesh,vx:Math.cos(a)*sp,vy:.1+Math.random()*.1,vz:Math.sin(a)*sp,life:1})}}
function stepParticles3d(scene3d,pool){for(var i=pool.length-1;i>=0;i--){var p=pool[i];p.vy-=.012;p.mesh.position.x+=p.vx;p.mesh.position.y+=p.vy;p.mesh.position.z+=p.vz;p.life-=.035;p.mesh.material.opacity=Math.max(0,p.life);if(p.life<=0){scene3d.remove(p.mesh);disposeThree(p.mesh);pool.splice(i,1)}}}
function enableShadows(renderer3d,sun){renderer3d.shadowMap.enabled=true;sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.near=1;sun.shadow.camera.far=30;sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=8;sun.shadow.camera.bottom=-8}

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

function setup3D(G,maxW,aspectH,bg){
  var scene3d=new THREE.Scene();scene3d.fog=new THREE.Fog(bg,10,30);
  var camera3d=new THREE.PerspectiveCamera(48,1,.1,100);
  var renderer3d=makeRenderer();
  if(!renderer3d){G.el.innerHTML='<div style="padding:40px;text-align:center;">3D engine failed to load.</div>';return null}
  var wrapDiv=document.createElement('div');wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';G.el.appendChild(wrapDiv);
  var canvasWrap=document.createElement('div');canvasWrap.style.cssText='position:relative;width:100%;max-width:'+maxW+'px;aspect-ratio:'+maxW+'/'+Math.round(maxW*aspectH)+';margin:0 auto;border-radius:14px;overflow:hidden;background:#0d1530';wrapDiv.appendChild(canvasWrap);
  function resize(){var W=canvasWrap.clientWidth||maxW,H=W*aspectH;renderer3d.setSize(W,H);camera3d.aspect=W/H;camera3d.updateProjectionMatrix();return[W,H]}
  var sz=resize();renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';canvasWrap.appendChild(renderer3d.domElement);G.cv=renderer3d.domElement;G.w=sz[0];G.h=sz[1];
  scene3d.add(new THREE.AmbientLight(0xcfe9ff,.65));var sun=new THREE.DirectionalLight(0xffffff,.9);sun.position.set(4,8,5);scene3d.add(sun);
  enableShadows(renderer3d,sun);
  G.fns.push(function(){scene3d.traverse(function(o){disposeThree(o)});renderer3d.dispose()});
  return{scene:scene3d,camera:camera3d,renderer:renderer3d,wrapDiv:wrapDiv,canvasWrap:canvasWrap,resize:function(){var s=resize();G.w=s[0];G.h=s[1];return s},maxResizeCheck:function(){var w2=canvasWrap.clientWidth;if(w2&&Math.abs(w2-G.w)>4)this.resize()}};
}

/* ================= popTarget3d: whack-a-mole style reflex game, DOM grid + synced 3D pop-up visuals ================= */
function popTarget3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Tap a hole the instant something pops up — missed taps and empty-hole taps cost a life',function(G){
    loadGate(G.el,function(){
      var ROWS=cfg.rows,COLS=cfg.cols;
      var S3=setup3D(G,360,.72,0x0d1530);if(!S3)return;
      var scene=S3.scene,camera=S3.camera;
      camera.position.set(0,COLS*.62+1.4,ROWS*.95+1.4);camera.lookAt(0,0,0);
      var board=new THREE.Mesh(new THREE.BoxGeometry(COLS*.95+.5,.3,ROWS*.95+.5),new THREE.MeshStandardMaterial({color:0x241c47,metalness:.2,roughness:.85}));
      board.position.y=-.3;board.receiveShadow=true;scene.add(board);
      var colorNum=parseInt(cfg.color.replace('#','0x'));
      addGridLines(scene,COLS*.95+.5,ROWS*.95+.5,-.145);
      addRails(scene,COLS*.95+.5,ROWS*.95+.5,-.3,0x2a2155);
      glowOrbs(scene,[[-(COLS*.95+.5)/2+.25,-.05,-(ROWS*.95+.5)/2+.25],[(COLS*.95+.5)/2-.25,-.05,-(ROWS*.95+.5)/2+.25],[-(COLS*.95+.5)/2+.25,-.05,(ROWS*.95+.5)/2-.25],[(COLS*.95+.5)/2-.25,-.05,(ROWS*.95+.5)/2-.25]],colorNum);
      var particles=makeParticlePool();
      var holes=[],gridDiv,msgDiv,score,lives,up,hideTimer,spawnTimer,speedT,combo,ended;
      function holePos(r,c){return[(c-(COLS-1)/2)*.95,(r-(ROWS-1)/2)*.95]}
      for(var r=0;r<ROWS;r++){holes.push([]);for(var c=0;c<COLS;c++){
        var ring=new THREE.Mesh(new THREE.TorusGeometry(.32,.05,10,24),new THREE.MeshStandardMaterial({color:0x120e2a}));
        ring.rotation.x=Math.PI/2;var xz=holePos(r,c);ring.position.set(xz[0],-.05,xz[1]);scene.add(ring);
        var targetMesh=new THREE.Mesh(new THREE.ConeGeometry(.26,.5,10),new THREE.MeshStandardMaterial({color:colorNum,emissive:colorNum,emissiveIntensity:.35,metalness:.2,roughness:.4}));
        targetMesh.position.set(xz[0],-.6,xz[1]);targetMesh.castShadow=true;scene.add(targetMesh);
        holes[r].push({mesh:targetMesh,up:false,animY:-.6,restY:-.6,upY:.3});
      }}
      gridDiv=document.createElement('div');gridDiv.style.cssText='display:grid;grid-template-columns:repeat('+COLS+',1fr);gap:8px;width:100%;max-width:300px;margin:0 auto;';
      var cellBtns=[];
      for(var r0=0;r0<ROWS;r0++){cellBtns.push([]);for(var c0=0;c0<COLS;c0++){(function(r,c){var b=document.createElement('button');b.type='button';b.style.cssText='aspect-ratio:1;border-radius:50%;border:2px solid '+R.grid+';background:'+R.bg+';cursor:pointer;';b.addEventListener('click',function(){hit(r,c)});gridDiv.appendChild(b);cellBtns[r].push(b)})(r0,c0)}}
      msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';
      function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c}
      function updateHud(){G.hud([['SCORE',padnum(score)],['COMBO',combo],['LIVES',lives]])}
      function refreshCells(){for(var r=0;r<ROWS;r++)for(var c=0;c<COLS;c++){var b=cellBtns[r][c];b.style.background=holes[r][c].up?cfg.color:R.bg;b.disabled=ended}}
      function spawnOne(){
        if(ended)return;
        var r=rnd(ROWS),c=rnd(COLS);
        if(holes[r][c].up)return;
        holes[r][c].up=!0;refreshCells();
        var dur=Math.max(420,900-speedT*18);
        holes[r][c].hideAt=performance.now()+dur;
      }
      function hit(r,c){
        if(ended)return;
        var h=holes[r][c];
        var xz=holePos(r,c);
        if(!h.up){lives--;combo=0;updateHud();burst3d(scene,particles,xz[0],.1,xz[1],0xff6b4a,8);if(lives<=0)return endGame();return}
        h.up=!1;refreshCells();score+=10+combo*2;combo++;speedT++;updateHud();
        burst3d(scene,particles,xz[0],.2,xz[1],colorNum,14);
      }
      function endGame(){
        ended=!0;updateMsg('Out of lives!',R.coral);refreshCells();
        G.later(function(){G.over(score,'Score: '+score+' · Best combo reached x'+combo)},700);
      }
      function tickLogic(now){
        for(var r=0;r<ROWS;r++)for(var c=0;c<COLS;c++){
          var h=holes[r][c];
          if(h.up&&h.hideAt&&now>=h.hideAt){h.up=!1;h.hideAt=null;lives--;combo=0;refreshCells();updateHud();if(lives<=0){endGame();return}}
        }
      }
      G.press=function(k){};
      S3.wrapDiv.appendChild(msgDiv);S3.wrapDiv.appendChild(gridDiv);
      function tick(dt){
        for(var r=0;r<ROWS;r++)for(var c=0;c<COLS;c++){
          var h=holes[r][c],target=h.up?h.upY:h.restY;
          h.animY+=(target-h.animY)*Math.min(1,dt*14);
          h.mesh.position.y=h.animY;
        }
        tickLogic(performance.now());
        stepParticles3d(scene,particles);
        S3.maxResizeCheck();
        S3.renderer.render(S3.scene,S3.camera);
      }
      G.begin(function(){
        score=0;lives=3;combo=0;ended=!1;speedT=0;
        holes.forEach(function(row){row.forEach(function(h){h.up=!1;h.hideAt=null;h.animY=h.restY})});
        refreshCells();updateMsg('Go!',cfg.color);updateHud();
        if(spawnTimer)clearInterval(spawnTimer);
        spawnTimer=setInterval(function(){spawnOne()},Math.max(500,1000-speedT*12));
        G.fns.push(function(){clearInterval(spawnTimer)});
        G.frame(tick);
      });
    });
  });
}
popTarget3d('moleThump',{title:'Mole Thump',tagline:'Thump the moles the instant they pop out of their burrows — three misses ends it.',color:R.green,rows:3,cols:3});
popTarget3d('alienZap',{title:'Alien Zap',tagline:'Zap alien scouts the moment they peek out — speed ramps up the longer you last.',color:R.violet,rows:3,cols:4});
popSequence3d('gemPop',{title:'Gem Pop',tagline:'Tap glowing gems the instant they surface from the vault floor.',color:R.magenta,rows:4,cols:3});
popSequence3d('ghostTag',{title:'Ghost Tag',tagline:'Tag ghosts the second they phase into view — chain combos for bonus points.',color:R.teal,rows:3,cols:3});

/* ================= fallCatch3d: move a 3D catcher to grab falling good items, dodge bad ones ================= */
function fallCatch3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Left / Right or A / D to move the catcher · grab good drops, dodge the bad ones',function(G){
    loadGate(G.el,function(){
      var LANES=cfg.lanes||5;
      var S3=setup3D(G,360,.78,0x0d1530);if(!S3)return;
      var scene=S3.scene,camera=S3.camera;
      camera.position.set(0,3.2,5.6);camera.lookAt(0,1,0);
      var floor=new THREE.Mesh(new THREE.PlaneGeometry(6,10),new THREE.MeshStandardMaterial({color:0x1c1640,metalness:.2,roughness:.9}));
      floor.rotation.x=-Math.PI/2;floor.position.y=-.01;floor.receiveShadow=true;scene.add(floor);
      addGridLines(scene,6,10,0);
      addRails(scene,6,10,-.01,0x2a2155);
      var goodColor=parseInt(cfg.color.replace('#','0x')),badColor=0xff6b4a;
      glowOrbs(scene,[[-2.6,.1,-4.6],[2.6,.1,-4.6]],goodColor);
      var particles=makeParticlePool();
      var laneW=5/LANES;
      function laneX(l){return(l-(LANES-1)/2)*laneW}
      var catcherMesh=new THREE.Mesh(new THREE.CylinderGeometry(laneW*.42,laneW*.5,.3,16),new THREE.MeshStandardMaterial({color:goodColor,emissive:goodColor,emissiveIntensity:.35,metalness:.3,roughness:.4}));
      catcherMesh.position.set(0,.15,3);catcherMesh.castShadow=true;scene.add(catcherMesh);
      var catcherLane,drops,score,lives,combo,ended,spawnEvery,spawnAcc,fallSpeed;
      function spawnDrop(){
        var lane=rnd(LANES),bad=Math.random()<Math.max(.18,.4-combo*0.01);
        var shapeGeo=bad?new THREE.BoxGeometry(.32,.32,.32):new THREE.SphereGeometry(.22,14,10);
        var dropCol=bad?badColor:goodColor;var mesh=new THREE.Mesh(shapeGeo,new THREE.MeshStandardMaterial({color:dropCol,emissive:dropCol,emissiveIntensity:.3,metalness:.25,roughness:.5}));
        mesh.castShadow=true;mesh.position.set(laneX(lane),3.6,-6);scene.add(mesh);
        drops.push({mesh:mesh,lane:lane,bad:bad,z:-6});
      }
      var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';
      function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c}
      function updateHud(){G.hud([['SCORE',padnum(score)],['COMBO',combo],['LIVES',lives]])}
      function endGame(){
        ended=!0;updateMsg('Out of lives!',R.coral);
        G.later(function(){G.over(score,'Score: '+score+' · Best combo x'+combo)},700);
      }
      function moveCatcher(dir){
        catcherLane=clamp(catcherLane+dir,0,LANES-1);
      }
      var btnRow=document.createElement('div');btnRow.style.cssText='display:flex;gap:10px;width:100%;max-width:300px;';
      var leftBtn=document.createElement('button');leftBtn.type='button';leftBtn.textContent='◀';leftBtn.style.cssText='flex:1;padding:14px;border-radius:10px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;';leftBtn.addEventListener('click',function(){moveCatcher(-1)});btnRow.appendChild(leftBtn);
      var rightBtn=document.createElement('button');rightBtn.type='button';rightBtn.textContent='▶';rightBtn.style.cssText='flex:1;padding:14px;border-radius:10px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;';rightBtn.addEventListener('click',function(){moveCatcher(1)});btnRow.appendChild(rightBtn);
      S3.wrapDiv.appendChild(msgDiv);S3.wrapDiv.appendChild(btnRow);
      var moveAcc=0;
      G.press=function(k){if(k==='ArrowLeft'||k==='a')moveCatcher(-1);else if(k==='ArrowRight'||k==='d')moveCatcher(1)};
      G.pad([['◀','ArrowLeft'],['▶','ArrowRight']]);
      function tick(dt){
        spawnAcc+=dt;
        if(spawnAcc>=spawnEvery){spawnAcc=0;spawnDrop();spawnEvery=Math.max(.45,spawnEvery*.985)}
        catcherMesh.position.x+=(laneX(catcherLane)-catcherMesh.position.x)*Math.min(1,dt*10);
        for(var i=drops.length-1;i>=0;i--){
          var d=drops[i];d.z+=fallSpeed*dt;d.mesh.position.z=d.z;
          if(d.z>=2.8&&d.z<3.3&&d.lane===catcherLane){
            if(d.bad){lives--;combo=0;burst3d(scene,particles,d.mesh.position.x,.2,d.mesh.position.z,badColor,10);if(lives<=0){scene.remove(d.mesh);disposeThree(d.mesh);drops.splice(i,1);updateHud();endGame();return}}
            else{score+=10+combo*2;combo++;burst3d(scene,particles,d.mesh.position.x,.2,d.mesh.position.z,goodColor,12)}
            updateHud();
            scene.remove(d.mesh);disposeThree(d.mesh);drops.splice(i,1);continue;
          }
          if(d.z>4.5){
            if(!d.bad){combo=0;updateHud()}
            scene.remove(d.mesh);disposeThree(d.mesh);drops.splice(i,1);
          }
        }
        stepParticles3d(scene,particles);
        S3.maxResizeCheck();
        S3.renderer.render(S3.scene,S3.camera);
      }
      G.begin(function(){
        drops&&drops.forEach(function(d){scene.remove(d.mesh);disposeThree(d.mesh)});
        drops=[];score=0;lives=3;combo=0;ended=!1;catcherLane=Math.floor(LANES/2);spawnEvery=1.1;spawnAcc=0;fallSpeed=3.2;
        catcherMesh.position.x=laneX(catcherLane);
        updateMsg('Go!',cfg.color);updateHud();
        G.frame(tick);
      });
    });
  });
}
fallCatch3d('starCatch',{title:'Star Catch',tagline:'Slide the catcher to grab falling stars and dodge the rogue meteors.',color:R.yellow});
fallCatch3d('boltCatch',{title:'Bolt Catch',tagline:'Catch the charged bolts streaming down a tighter four-lane grid — avoid the dead cells.',color:R.blue,lanes:4});
laneTap3d('bubbleCatch',{title:'Bubble Catch',tagline:'Pop up to catch rising-value bubbles, steer clear of the popped ones.',color:R.teal});
laneTap3d('emberCatch',{title:'Ember Catch',tagline:'The forge runs hot — embers fall faster and closer together, dodge the cooled cinders.',color:R.orange,fallDur:1.0,spawnEvery:.9});

/* ================= popSequence3d: Simon-says memory sequence on the same hole grid ================= */
function popSequence3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Watch the holes light up in order, then tap them back in the same order · three mistakes ends it',function(G){
    var ROWS=cfg.rows,COLS=cfg.cols;
    var wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:12px;align-items:center;width:100%;max-width:360px;margin:0 auto;';G.el.appendChild(wrap);
    var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';wrap.appendChild(msgDiv);
    var gridDiv=document.createElement('div');gridDiv.style.cssText='display:grid;grid-template-columns:repeat('+COLS+',1fr);gap:8px;width:100%;';wrap.appendChild(gridDiv);
    var cellBtns=[];
    for(var i=0;i<ROWS*COLS;i++){(function(idx){var b=document.createElement('button');b.type='button';b.style.cssText='aspect-ratio:1;border-radius:50%;border:2px solid '+R.grid+';background:'+R.bg+';cursor:pointer;';b.addEventListener('click',function(){tapHole(idx)});gridDiv.appendChild(b);cellBtns.push(b)})(i)}
    var seq,playerIdx,lives,score,showingSeq,ended;
    function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c}
    function updateHud(){G.hud([['SCORE',padnum(score)],['LEVEL',seq?seq.length:0],['LIVES',lives]])}
    function flash(idx,ms){var b=cellBtns[idx];b.style.background=cfg.color;G.later(function(){if(!ended)b.style.background=R.bg},ms)}
    function replaySeq(){
      showingSeq=!0;updateMsg('Watch closely…',cfg.color);
      seq.forEach(function(idx,i){G.later(function(){flash(idx,380)},i*520)});
      G.later(function(){showingSeq=!1;updateMsg('Your turn — repeat it!',cfg.color)},seq.length*520);
    }
    function newRound(){
      seq=(seq||[]).concat([rnd(ROWS*COLS)]);playerIdx=0;
      replaySeq();
    }
    function tapHole(idx){
      if(ended||showingSeq)return;
      if(idx===seq[playerIdx]){
        flash(idx,220);playerIdx++;
        if(playerIdx>=seq.length){score+=10*seq.length;updateHud();G.later(newRound,700)}
      }else{
        lives--;playerIdx=0;updateHud();
        var b=cellBtns[idx];b.style.background='#ff6b4a';G.later(function(){if(!ended)b.style.background=R.bg},250);
        if(lives<=0){ended=!0;updateMsg('Out of lives!',R.coral);G.later(function(){G.over(score,'Reached a sequence of '+seq.length+' · Score: '+score)},700)}
        else{updateMsg('Wrong hole — try this sequence again',R.coral);G.later(replaySeq,700)}
      }
    }
    G.begin(function(){score=0;lives=3;seq=[];ended=!1;showingSeq=!1;updateHud();G.later(newRound,400)})
  });
}

/* ================= laneTap3d: Guitar-Hero style multi-lane rhythm tapping ================= */
function laneTap3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Press 1-4 (or tap a lane) the instant a note crosses the line · misses cost a life',function(G){
    var LANES=4,KEYS=['1','2','3','4'];
    var wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:12px;align-items:center;width:100%;max-width:360px;margin:0 auto;';G.el.appendChild(wrap);
    var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';wrap.appendChild(msgDiv);
    var laneRow=document.createElement('div');laneRow.style.cssText='display:flex;gap:8px;width:100%;height:220px;';wrap.appendChild(laneRow);
    var laneEls=[],noteEls=[],hitLineEls=[];
    for(var l=0;l<LANES;l++){
      var col=document.createElement('div');col.style.cssText='position:relative;flex:1;background:'+R.grid+';border-radius:8px;overflow:hidden;';
      var hitLine=document.createElement('div');hitLine.style.cssText='position:absolute;left:0;right:0;bottom:36px;height:4px;background:'+R.dim+';';col.appendChild(hitLine);
      var note=document.createElement('div');note.style.cssText='position:absolute;left:4px;right:4px;height:22px;border-radius:5px;background:'+cfg.color+';top:-30px;display:none;';col.appendChild(note);
      laneRow.appendChild(col);laneEls.push(col);noteEls.push(note);hitLineEls.push(hitLine);
    }
    var btnRow=document.createElement('div');btnRow.style.cssText='display:flex;gap:8px;width:100%;';
    KEYS.forEach(function(k,l){var b=document.createElement('button');b.type='button';b.textContent=k;b.style.cssText='flex:1;padding:12px;border-radius:8px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;';b.addEventListener('click',function(){hitLane(l)});btnRow.appendChild(b)});
    wrap.appendChild(btnRow);
    var notes,score,lives,combo,ended,spawnAcc,spawnEvery,fallDur;
    function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c}
    function updateHud(){G.hud([['SCORE',padnum(score)],['COMBO',combo],['LIVES',lives]])}
    function spawnNote(){
      var l=rnd(LANES);
      if(notes[l])return;
      notes[l]={t:0};
    }
    function missLane(l){lives--;combo=0;notes[l]=null;noteEls[l].style.display='none';updateHud();if(lives<=0)endGame()}
    function hitLane(l){
      if(ended)return;
      var n=notes[l];
      if(!n){missLane(l);return}
      if(n.t>=.72&&n.t<=1.28){score+=10+combo*2;combo++;notes[l]=null;noteEls[l].style.display='none';updateHud()}
      else{missLane(l)}
    }
    function endGame(){ended=!0;updateMsg('Out of lives!',R.coral);G.later(function(){G.over(score,'Score: '+score+' · Best combo x'+combo)},700)}
    G.press=function(k){var idx=KEYS.indexOf(k);if(idx>=0)hitLane(idx)};
    G.pad(KEYS.map(function(k,i){return[k,k]}));
    function tick(dt){
      spawnAcc+=dt;
      if(spawnAcc>=spawnEvery){spawnAcc=0;spawnNote();spawnEvery=Math.max(.55,spawnEvery*.98)}
      for(var l=0;l<LANES;l++){
        var n=notes[l];
        if(!n)continue;
        n.t+=dt/fallDur;
        var pxPos=n.t*184;
        noteEls[l].style.display='block';noteEls[l].style.top=pxPos+'px';
        if(n.t>1.5)missLane(l);
      }
    }
    G.begin(function(){score=0;lives=3;combo=0;ended=!1;notes=[null,null,null,null];spawnAcc=0;spawnEvery=cfg.spawnEvery||1.1;fallDur=cfg.fallDur||1.3;noteEls.forEach(function(e){e.style.display='none'});updateMsg('Go!',cfg.color);updateHud();G.frame(tick)})
  });
}


}
})();
