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
  scene3d.add(new THREE.AmbientLight(0xffffff,.75));var sun=new THREE.DirectionalLight(0xffffff,.8);sun.position.set(4,8,5);scene3d.add(sun);
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
      var board=new THREE.Mesh(new THREE.BoxGeometry(COLS*.95,.3,ROWS*.95),new THREE.MeshStandardMaterial({color:0x241c47,metalness:.2,roughness:.85}));
      board.position.y=-.3;scene.add(board);
      var colorNum=parseInt(cfg.color.replace('#','0x'));
      var holes=[],gridDiv,msgDiv,score,lives,up,hideTimer,spawnTimer,speedT,combo,ended;
      function holePos(r,c){return[(c-(COLS-1)/2)*.95,(r-(ROWS-1)/2)*.95]}
      for(var r=0;r<ROWS;r++){holes.push([]);for(var c=0;c<COLS;c++){
        var ring=new THREE.Mesh(new THREE.TorusGeometry(.32,.05,10,24),new THREE.MeshStandardMaterial({color:0x120e2a}));
        ring.rotation.x=Math.PI/2;var xz=holePos(r,c);ring.position.set(xz[0],-.05,xz[1]);scene.add(ring);
        var targetMesh=new THREE.Mesh(new THREE.ConeGeometry(.26,.5,10),new THREE.MeshStandardMaterial({color:colorNum,metalness:.2,roughness:.4}));
        targetMesh.position.set(xz[0],-.6,xz[1]);scene.add(targetMesh);
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
        if(!h.up){lives--;combo=0;updateHud();G.burst(G.w/2,G.h/2,R.coral,6);if(lives<=0)return endGame();return}
        h.up=!1;refreshCells();score+=10+combo*2;combo++;speedT++;updateHud();
        G.burst(G.w/2,G.h/2,cfg.color,10);
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
popTarget3d('gemPop',{title:'Gem Pop',tagline:'Tap glowing gems the instant they surface from the vault floor.',color:R.magenta,rows:4,cols:3});
popTarget3d('ghostTag',{title:'Ghost Tag',tagline:'Tag ghosts the second they phase into view — chain combos for bonus points.',color:R.teal,rows:3,cols:3});

/* ================= fallCatch3d: move a 3D catcher to grab falling good items, dodge bad ones ================= */
function fallCatch3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Left / Right or A / D to move the catcher · grab good drops, dodge the bad ones',function(G){
    loadGate(G.el,function(){
      var LANES=5;
      var S3=setup3D(G,360,.78,0x0d1530);if(!S3)return;
      var scene=S3.scene,camera=S3.camera;
      camera.position.set(0,3.2,5.6);camera.lookAt(0,1,0);
      var floor=new THREE.Mesh(new THREE.PlaneGeometry(6,8),new THREE.MeshStandardMaterial({color:0x0a1020,metalness:.2,roughness:.9}));
      floor.rotation.x=-Math.PI/2;floor.position.y=-.01;scene.add(floor);
      var goodColor=parseInt(cfg.color.replace('#','0x')),badColor=0xff6b4a;
      var laneW=5/LANES;
      function laneX(l){return(l-(LANES-1)/2)*laneW}
      var catcherMesh=new THREE.Mesh(new THREE.CylinderGeometry(laneW*.42,laneW*.5,.3,16),new THREE.MeshStandardMaterial({color:goodColor,metalness:.3,roughness:.4}));
      catcherMesh.position.set(0,.15,3);scene.add(catcherMesh);
      var catcherLane,drops,score,lives,combo,ended,spawnEvery,spawnAcc,fallSpeed;
      function spawnDrop(){
        var lane=rnd(LANES),bad=Math.random()<Math.max(.18,.4-combo*0.01);
        var shapeGeo=bad?new THREE.BoxGeometry(.32,.32,.32):new THREE.SphereGeometry(.22,14,10);
        var mesh=new THREE.Mesh(shapeGeo,new THREE.MeshStandardMaterial({color:bad?badColor:goodColor,metalness:.25,roughness:.5}));
        mesh.position.set(laneX(lane),3.6,-6);scene.add(mesh);
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
            if(d.bad){lives--;combo=0;G.burst(G.w/2,G.h/2,R.coral,8);if(lives<=0){scene.remove(d.mesh);disposeThree(d.mesh);drops.splice(i,1);updateHud();endGame();return}}
            else{score+=10+combo*2;combo++;G.burst(G.w/2,G.h/2,cfg.color,10)}
            updateHud();
            scene.remove(d.mesh);disposeThree(d.mesh);drops.splice(i,1);continue;
          }
          if(d.z>4.5){
            if(!d.bad){combo=0;updateHud()}
            scene.remove(d.mesh);disposeThree(d.mesh);drops.splice(i,1);
          }
        }
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
fallCatch3d('boltCatch',{title:'Bolt Catch',tagline:'Catch the charged bolts streaming down the lanes — avoid the dead cells.',color:R.blue});
fallCatch3d('bubbleCatch',{title:'Bubble Catch',tagline:'Pop up to catch rising-value bubbles, steer clear of the popped ones.',color:R.teal});
fallCatch3d('emberCatch',{title:'Ember Catch',tagline:'Catch the glowing embers falling from the forge, dodge the cooled cinders.',color:R.orange});

}
})();
