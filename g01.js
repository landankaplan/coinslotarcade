window.CSA_EXT=function(r){'use strict';var t=r.g,n=r.M,o=r.R,e=2*Math.PI,a=[],i=String('<svg viewBox=#0 0 24 24# fill=#none# stroke=#currentColor# stroke-width=#2# stroke-linecap=#round# stroke-linejoin=#round#><rect x=#4# y=#4# width=#16# height=#16# rx=#3#/><circle cx=#12# cy=#12# r=#3#/></svg>').split('#').join(String.fromCharCode(39)),l=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '];function f(r){return Math.floor(Math.random()*r)}function c(r,t){return r+Math.random()*(t-r)}function u(r){return r[f(r.length)]}function h(r){var t,n,o;for(t=r.length-1;t>0;t--)n=f(t+1),o=r[t],r[t]=r[n],r[n]=o;return r}function s(r,t,n){return r<t?t:r>n?n:r}function y(r){return String(Math.floor(r)).padStart(4,'0')}function d(r,t,n,o,a){r.beginPath(),r.arc(t,n,o,0,e),a&&(r.fillStyle=a,r.fill())}function p(t,n,o,e,a,i,l){r.L(t,n,o,e,a,void 0===i?4:i),l&&(t.fillStyle=l,t.fill())}function x(r,t,n,e,a,i,l){r.font='700 '+a+'px Figtree, sans-serif',r.textAlign=l||'center',r.textBaseline='middle',
r.fillStyle=i||o.ink,r.fillText(t,n,e)}function v(r,t,n,o,e,a,i){r.beginPath(),r.moveTo(t,n),r.lineTo(o,e),r.strokeStyle=a,r.lineWidth=i||2,r.stroke()}function g(r,t,n,e){r.fillStyle=e||o.bg,r.fillRect(0,0,t,n)}var EXT3D_loading=false,EXT3D_queue=[];
function extLoadScript(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(null)};s.onerror=function(){cb(new Error('load fail: '+src))};document.head.appendChild(s)}
function extLoad3DLibs(done){if(window.THREE){done();return}if(EXT3D_loading){EXT3D_queue.push(done);return}EXT3D_loading=true;extLoadScript('/three.min.js',function(err){EXT3D_loading=false;var q=EXT3D_queue;EXT3D_queue=[];done(err);q.forEach(function(fn){fn(err)})})}
function ext3DLoadGate(el,startFn){var msg=document.createElement('div');msg.style.cssText='padding:40px;text-align:center;color:'+o.dim+';font-weight:600;';msg.textContent='Loading 3D engine…';el.appendChild(msg);extLoad3DLibs(function(err){if(msg&&msg.parentNode)msg.parentNode.removeChild(msg);if(err){var fail=document.createElement('div');fail.style.cssText='padding:40px;text-align:center;color:'+o.coral+';font-weight:600;';fail.textContent='3D engine failed to load.';el.appendChild(fail);return}startFn()});return function(){if(msg&&msg.parentNode)msg.parentNode.removeChild(msg)}}
function extMakeWebGLRenderer(){var r2;try{r2=new THREE.WebGLRenderer({antialias:true,alpha:false})}catch(e){return null}r2.setPixelRatio(Math.min(window.devicePixelRatio||1,2));return r2}
function extDisposeThree(obj){if(!obj)return;if(obj.geometry)obj.geometry.dispose();if(obj.material){if(Array.isArray(obj.material))obj.material.forEach(function(m){m.dispose()});else obj.material.dispose()}}function w(o,f,u,h,y,d,p){t[o]={title:u,tagline:y,color:h,hint:d,category:f,icon:i,mount:function(t,n){var a=function(t,n,o){var a={id:t,el:n,x:o,k:{},dead:!1,fns:[],rid:0,last:0,run:null,fx:[],press:null,again:null};function i(r){if(a.rid=0,!a.dead&&a.run){a.rid=requestAnimationFrame(i);var t=a.last?Math.min(.05,(r-a.last)/1e3):.016;a.last=r;try{a.run(t)}catch(r){a.run=null,console.error(r)}}}return a.on=function(r,t,n,o){r.addEventListener(t,n,o),a.fns.push(function(){r.removeEventListener(t,n,o)})},a.every=function(r,t){var n=setInterval(r,t);return a.fns.push(function(){clearInterval(n)}),n},a.later=function(r,t){var n=setTimeout(r,t);return a.fns.push(function(){clearTimeout(n)}),n},a.canvas=function(t,o){var e=r.A(n,t,o);return a.cv=e.canvas,a.c=e.ctx,a.w=t,a.h=o,a.c},
a.frame=function(r){a.run=r,a.last=0,a.rid||a.dead||(a.rid=requestAnimationFrame(i))},a.stop=function(){a.run=null},a.on(document,'keydown',function(r){if(!(r.ctrlKey||r.metaKey||r.altKey)){var t=1===r.key.length?r.key.toLowerCase():r.key;l.indexOf(t)>-1&&r.preventDefault(),a.k[t]||(a.k[t]=1,a.press&&a.press(t,r))}}),a.on(document,'keyup',function(r){delete a.k[1===r.key.length?r.key.toLowerCase():r.key]}),a.on(window,'blur',function(){a.k={}}),a.ax=function(){return(a.k.ArrowRight||a.k.d?1:0)-(a.k.ArrowLeft||a.k.a?1:0)},a.ay=function(){return(a.k.ArrowDown||a.k.s?1:0)-(a.k.ArrowUp||a.k.w?1:0)},a.pt=function(r){var t=a.cv.getBoundingClientRect();return{x:(r.clientX-t.left)*a.w/t.width,y:(r.clientY-t.top)*a.h/t.height}},a.pointer=function(r){var t=a.cv,n=!1;a.on(t,'pointerdown',function(o){n=!0;try{t.setPointerCapture(o.pointerId)}catch(r){}r.down&&r.down(a.pt(o),o)}),a.on(t,'pointermove',function(t){r.move&&r.move(a.pt(t),t,n)}),a.on(t,'pointerup',function(t){n=!1,r.up&&r.up(a.pt(t),t)
}),a.on(t,'pointercancel',function(t){n=!1,r.up&&r.up(a.pt(t),t)})},a.swipe=function(t){var n=r.D(a.cv,t);a.fns.push(n)},a.hud=function(r){var t=r.map(function(r,t){var n=r[0]+'<b>'+r[1]+'</b>';return t?'<span style=margin-left:1rem>'+n+'</span>':n}).join('');t!==a.lh&&(a.lh=t,o.setHud(t))},a.hint=function(r){o.setHint(r)},a.begin=function(r){a.again=r,o.hideOverlay(),r()},a.over=function(r,n,e){a.run=null,r=Math.floor(r),o.reportScore(t,r),o.showOverlay(e||'Game Over',(n||'Score: '+r)+' · Best '+o.getHighScore(t),'Play again',a.again)},a.burst=function(r,t,n,o){var i,l,f;for(i=0;i<(o||10);i++)l=c(0,e),f=c(30,150),a.fx.push({x:r,y:t,vx:Math.cos(l)*f,vy:Math.sin(l)*f,t:c(.3,.7),m:.7,c:n})},a.fxStep=function(r){var t=a.c;a.fx=a.fx.filter(function(n){return n.t-=r,n.x+=n.vx*r,n.y+=n.vy*r,!(n.t<=0||(t.globalAlpha=s(n.t/n.m,0,1),t.fillStyle=n.c,t.fillRect(n.x-1.5,n.y-1.5,3,3),t.globalAlpha=1,0))})},a.opt=function(r,t,n,o){
var e=document.getElementById('optionsBar'),a=document.createElement('span'),i=document.createElement('span'),l=[];a.className='opt-group',i.className='opt-label',i.textContent=r,a.appendChild(i),t.forEach(function(r,t){var e=document.createElement('button');e.type='button',e.className='opt-btn'+(t===n?' active':''),e.textContent=r,e.onclick=function(){l.forEach(function(r,n){r.className='opt-btn'+(n===t?' active':'')}),o(t)},l.push(e),a.appendChild(e)}),e.appendChild(a)},a.pad=function(r){('ontouchstart'in window||navigator.maxTouchPoints>0)&&(o.setTouchPad(r.map(function(r){return'<button type=button class=pad-btn data-k='+r[1]+'>'+r[0]+'</button>'}).join('')),[].forEach.call(document.getElementById('touchPad').querySelectorAll('button'),function(r){var t=r.getAttribute('data-k');'Space'===t&&(t=' '),a.on(r,'pointerdown',function(r){r.preventDefault(),a.k[t]||(a.k[t]=1,a.press&&a.press(t,r))});var n=function(){delete a.k[t]};a.on(r,'pointerup',n),a.on(r,'pointerleave',n),
a.on(r,'pointercancel',n)}))},a.dispose=function(){a.dead=!0,a.rid&&cancelAnimationFrame(a.rid),a.fns.forEach(function(r){r()})},a}(o,t,n);return p(a),function(){a.dispose()}}},n.push(o),a.push(o)}var b='Arcade Classics',m='Reflex',M='Puzzle',k='Board & Strategy',S='Cards & Words';w('orbitRaiders',b,'Orbit Raiders',o.blue,'Hold the line against wave after wave of raiders — chain kills for a rising multiplier.','Arrows / A D to move · hold Space to fire',function(a){
function startGame3D(){
var W=400,H=460;
var COLORS=[o.magenta,o.orange,o.yellow,o.green];
var px,bullet,enemies,formX,formDir,dropBoost,shots,shields,lives,score,wave,ufo,fireCd,spawnCd,ufoCd,diveCd,hitInv,combo,comboTimer;

var wrapDiv=document.createElement('div');
wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
a.el.appendChild(wrapDiv);
var canvasWrap=document.createElement('div');
canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:400/460;margin:0 auto';
wrapDiv.appendChild(canvasWrap);

var renderer3d=extMakeWebGLRenderer();
if(!renderer3d){a.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
renderer3d.setSize(400,460);
renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
renderer3d.setClearColor(0x090417,1);
canvasWrap.appendChild(renderer3d.domElement);
a.cv=renderer3d.domElement;a.w=W;a.h=H;

var WH2=10*(H/W);
function mapX3d(px2){return px2/W*20-10}
function mapY3d(py){return WH2-py/H*(2*WH2)}

var scene3d=new THREE.Scene();
scene3d.fog=new THREE.Fog(0x090417,24,52);
var camera3d=new THREE.PerspectiveCamera(55,W/H,0.1,200);
camera3d.position.set(0,0,29);
camera3d.lookAt(0,0,0);

scene3d.add(new THREE.AmbientLight(0xcfe3ff,0.85));
var sun3d=new THREE.DirectionalLight(0xffffff,0.75);
sun3d.position.set(6,14,14);
scene3d.add(sun3d);

var starGeo3d=new THREE.BufferGeometry();
var starPos3d=[];
for(var si3=0;si3<140;si3++){starPos3d.push((Math.random()*2-1)*13,(Math.random()*2-1)*13,-8-Math.random()*12)}
starGeo3d.setAttribute('position',new THREE.Float32BufferAttribute(starPos3d,3));
scene3d.add(new THREE.Points(starGeo3d,new THREE.PointsMaterial({color:0xe9fbf9,size:0.07,transparent:true,opacity:0.7})));

function disposeGroupChildren(grp){
  while(grp.children.length){
    var c=grp.children.pop();
    grp.remove(c);
    extDisposeThree(c)
  }
}
var enemyGroup3d=new THREE.Group();scene3d.add(enemyGroup3d);
var shieldGroup3d=new THREE.Group();scene3d.add(shieldGroup3d);
var shotGroup3d=new THREE.Group();scene3d.add(shotGroup3d);
var enemyMatsByRow=COLORS.map(function(col){return new THREE.MeshStandardMaterial({color:new THREE.Color(col),emissive:new THREE.Color(col),emissiveIntensity:0.3,roughness:0.5})});
var shieldMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.teal),roughness:0.7});
var bulletMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.ink)});
var enemyShotMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.coral)});
var ufoMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.violet),emissive:new THREE.Color(o.violet),emissiveIntensity:0.4,roughness:0.5});
var ufoMesh3d=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.5,0.6),ufoMat3d);
ufoMesh3d.visible=false;
scene3d.add(ufoMesh3d);

var shipGroup3d=new THREE.Group();
var shipMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.blue),emissive:new THREE.Color(o.blue),emissiveIntensity:0.35,roughness:0.5});
var shipBody3d=new THREE.Mesh(new THREE.ConeGeometry(0.9,1.4,4),shipMat3d);
shipBody3d.rotation.x=Math.PI/2;
shipBody3d.rotation.y=Math.PI/4;
shipGroup3d.add(shipBody3d);
var shipBase3d=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.3,0.6),shipMat3d);
shipBase3d.position.y=-0.7;
shipGroup3d.add(shipBase3d);
scene3d.add(shipGroup3d);

var particleMeshes3d=[];
function spawnParticles3d(wx,wy,color,n){
  var col=new THREE.Color(color);
  for(var pi=0;pi<n;pi++){
    var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
    var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.11,6,6),mat);
    mesh.position.set(wx,wy,0.3);
    scene3d.add(mesh);
    var ang=Math.random()*Math.PI*2,sp=0.05+Math.random()*0.17;
    particleMeshes3d.push({mesh:mesh,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,vz:(Math.random()-0.5)*0.1,life:1})
  }
}
function stepParticles3d(dt){
  for(var i2=particleMeshes3d.length-1;i2>=0;i2--){
    var pt=particleMeshes3d[i2];
    pt.mesh.position.x+=pt.vx;pt.mesh.position.y+=pt.vy;pt.mesh.position.z+=pt.vz;
    pt.life-=0.035;
    pt.mesh.material.opacity=Math.max(0,pt.life);
    if(pt.life<=0){scene3d.remove(pt.mesh);extDisposeThree(pt.mesh);particleMeshes3d.splice(i2,1)}
  }
}

function rectHit(pt,hw,hh,x2,y2){return Math.abs(pt.x-x2)<hw&&Math.abs(pt.y-y2)<hh}
function shieldHit(pt,r){for(var i=0;i<shields.length;i++)if(Math.abs(pt.x-shields[i].x-3)<r&&Math.abs(pt.y-shields[i].y-3)<6)return shields.splice(i,1),!0;return!1}
function buildShields(){shields=[];for(var b2=0;b2<3;b2++)for(var cx=0;cx<10;cx++)for(var cy=0;cy<5;cy++)if(!(cy>2&&cx>2&&cx<7))shields.push({x:50+120*b2+6*cx,y:372+6*cy})}
function buildWave(){enemies=[];var rows=Math.min(5,3+Math.floor((wave-1)/2));for(var r=0;r<rows;r++)for(var c2=0;c2<8;c2++)enemies.push({x:40+40*c2,y:46+30*r,r:r%4,diving:!1});formX=0;dropBoost=12*Math.min(wave-1,4);formDir=1;shots=[];bullet=null;buildShields();diveCd=Math.max(1.6,c(3,6)-.25*wave)}

function step(dt){
  var maxX=0,minX=999,speed=22+3.2*(32-enemies.length)+5*wave;
  px=s(px+240*a.ax()*dt,22,378);
  fireCd-=dt;hitInv-=dt;comboTimer-=dt;
  if(comboTimer<=0)combo=0;
  if(a.k[' ']&&fireCd<=0&&!bullet){bullet={x:px,y:408};fireCd=Math.max(.13,.28-wave*.01)}
  enemies.forEach(function(e){maxX=Math.max(maxX,e.x);minX=Math.min(minX,e.x)});
  formX+=speed*formDir*dt;
  if(formDir>0&&maxX+formX>380){formDir=-1;dropBoost+=14}
  else if(formDir<0&&minX+formX<20){formDir=1;dropBoost+=14}
  spawnCd-=dt;
  if(spawnCd<=0){
    spawnCd=Math.max(.22,1-.06*wave);
    var cand=u(enemies);
    if(cand&&!enemies.some(function(o2){return o2.x===cand.x&&o2.y>cand.y}))
      shots.push({x:cand.x+formX,y:cand.y+dropBoost+10,aimed:wave>=3&&Math.random()<.3});
  }
  diveCd-=dt;
  if(diveCd<=0&&wave>=2&&enemies.length){
    diveCd=Math.max(1.4,5-.3*wave);
    var divers=enemies.filter(function(e){return!e.diving});
    if(divers.length){
      var dv=u(divers);
      dv.diving=!0;dv.diveT=0;dv.diveDur=c(1.5,2.1);
      dv.p0={x:dv.x+formX,y:dv.y+dropBoost};
      dv.p1={x:s(px+c(-120,120),20,380),y:260};
      dv.p2={x:s(px+c(-140,140),20,380),y:500}
    }
  }
  enemies.forEach(function(e){
    if(e.diving){
      e.diveT+=dt/e.diveDur;
      if(e.diveT>=1)e.diving=!1;
      else{
        var tt=e.diveT,it=1-tt;
        e.curX=it*it*e.p0.x+2*it*tt*e.p1.x+tt*tt*e.p2.x;
        e.curY=it*it*e.p0.y+2*it*tt*e.p1.y+tt*tt*e.p2.y
      }
    }
  });
  if(bullet){
    bullet.y-=480*dt;
    if(bullet.y<0||shieldHit(bullet,5))bullet=null;
    else if(ufo&&rectHit(bullet,18,10,ufo.x,ufo.y)){score+=100+50*f(3);combo++;comboTimer=2.5;spawnParticles3d(mapX3d(ufo.x),mapY3d(ufo.y),o.violet,16);ufo=null;bullet=null}
    else for(var i=0;i<enemies.length;i++){
      var e=enemies[i],ex=e.diving?e.curX:e.x+formX,ey=e.diving?e.curY:e.y+dropBoost;
      if(rectHit(bullet,13,10,ex,ey)){
        var mult=1+Math.min(4,Math.floor(combo/5));
        score+=10*(4-e.r)*mult;combo++;comboTimer=2.5;
        spawnParticles3d(mapX3d(ex),mapY3d(ey),COLORS[e.r],10);
        enemies.splice(i,1);bullet=null;break
      }
    }
  }
  ufoCd-=dt;
  if(ufoCd<=0&&!ufo){ufo={x:-24,y:26};ufoCd=c(14,24)}
  if(ufo){ufo.x+=110*dt;if(ufo.x>424)ufo=null}
  for(var j=shots.length-1;j>=0;j--){
    var sh=shots[j];
    if(sh.aimed&&!sh.vx){var ddx=px-sh.x,ddy=440-sh.y,dd=Math.hypot(ddx,ddy)||1;sh.vx=ddx/dd*(150+10*wave);sh.vy=ddy/dd*(150+10*wave)}
    if(sh.vx){sh.x+=sh.vx*dt;sh.y+=sh.vy*dt}else sh.y+=(150+12*wave)*dt;
    if(sh.y>H||shieldHit(sh,4))shots.splice(j,1);
    else if(hitInv<=0&&rectHit(sh,14,10,px,426)){
      shots.splice(j,1);lives--;hitInv=1.5;combo=0;spawnParticles3d(mapX3d(px),mapY3d(426),o.blue,24);
      if(lives<=0){render3d(dt);a.over(score,'Wave '+wave+' · Score: '+score);return}
    }
  }
  for(var k2=0;k2<enemies.length;k2++){
    var e2=enemies[k2],ey2=e2.diving?e2.curY:e2.y+dropBoost;
    if(!e2.diving&&ey2>350){render3d(dt);a.over(score,'They landed on wave '+wave+' · Score: '+score);return}
  }
  if(!enemies.length){wave++;score+=100+20*wave;buildWave()}
  render3d(dt)
}

function render3d(dt){
  disposeGroupChildren(enemyGroup3d);
  var jitter=Math.floor(formX/9)%2?1:0;
  enemies.forEach(function(e){
    var ex=e.diving?e.curX:e.x+formX,ey=e.diving?e.curY:e.y+dropBoost;
    var mesh=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.75,0.5),enemyMatsByRow[e.r]);
    mesh.position.set(mapX3d(ex),mapY3d(ey),0);
    mesh.rotation.z=jitter?0.08:-0.08;
    enemyGroup3d.add(mesh)
  });

  disposeGroupChildren(shieldGroup3d);
  shields.forEach(function(sh){
    var mesh=new THREE.Mesh(new THREE.BoxGeometry(0.27,0.27,0.27),shieldMat3d);
    mesh.position.set(mapX3d(sh.x+2.5),mapY3d(sh.y+2.5),0);
    shieldGroup3d.add(mesh)
  });

  ufoMesh3d.visible=!!ufo;
  if(ufo)ufoMesh3d.position.set(mapX3d(ufo.x),mapY3d(ufo.y),0);

  disposeGroupChildren(shotGroup3d);
  shots.forEach(function(sh){
    var mesh=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.6,0.2),enemyShotMat3d);
    mesh.position.set(mapX3d(sh.x),mapY3d(sh.y),0);
    shotGroup3d.add(mesh)
  });
  if(bullet){
    var bmesh=new THREE.Mesh(new THREE.BoxGeometry(0.2,0.7,0.2),bulletMat3d);
    bmesh.position.set(mapX3d(bullet.x),mapY3d(bullet.y),0);
    shotGroup3d.add(bmesh)
  }

  var blink=hitInv<=0||Math.floor(10*hitInv)%2;
  shipGroup3d.visible=!!blink;
  if(blink)shipGroup3d.position.set(mapX3d(px),mapY3d(422),0);

  stepParticles3d(dt);
  renderer3d.render(scene3d,camera3d);
  a.hud([['SCORE',y(score)],['WAVE',wave],['LIVES',lives],['COMBO','x'+(1+Math.min(4,Math.floor(combo/5)))]])
}

a.pad([['◀','ArrowLeft'],['FIRE','Space'],['▶','ArrowRight']]);
a.fns.push(function(){
  scene3d.traverse(function(obj){extDisposeThree(obj)});
  renderer3d.dispose();
  if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
  if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
});
a.begin(function(){
  px=200;lives=3;score=0;wave=1;ufo=null;fireCd=0;spawnCd=1;ufoCd=15;hitInv=0;combo=0;comboTimer=0;
  buildWave();
  a.frame(step)
})
}
ext3DLoadGate(a.el,startGame3D)
}),w('rockDrift',b,'Rock Drift',o.orange,'Drift, spin and blast the asteroid field — watch for the UFO raiders that shoot back.','Left/Right turn · Up thrust · Space fire',function(a){
function startGame3D(){
var W=400,H=400;
var ship,bullets,ufoBullets,asteroids,lives,score,wave,invuln,fireCd,combo,comboTimer,ufo,ufoCd;

var wrapDiv=document.createElement('div');
wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
a.el.appendChild(wrapDiv);
var canvasWrap=document.createElement('div');
canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:1/1;margin:0 auto';
wrapDiv.appendChild(canvasWrap);

var renderer3d=extMakeWebGLRenderer();
if(!renderer3d){a.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
renderer3d.setSize(400,400);
renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
renderer3d.setClearColor(0x0b0518,1);
canvasWrap.appendChild(renderer3d.domElement);

var scene3d=new THREE.Scene();
scene3d.fog=new THREE.Fog(0x0b0518,24,58);
var camera3d=new THREE.PerspectiveCamera(50,1,0.1,200);
var camBase=[0,19,13.5];
camera3d.position.set(camBase[0],camBase[1],camBase[2]);
camera3d.lookAt(0,0,0);

scene3d.add(new THREE.AmbientLight(0xcfe9ff,0.8));
var sun3d=new THREE.DirectionalLight(0xffffff,0.85);
sun3d.position.set(10,22,8);
scene3d.add(sun3d);

var floor3d=new THREE.Mesh(new THREE.PlaneGeometry(21,21),new THREE.MeshStandardMaterial({color:0x161029,roughness:0.95}));
floor3d.rotation.x=-Math.PI/2;
scene3d.add(floor3d);

var gridMat3d=new THREE.LineBasicMaterial({color:0x2a2155,transparent:true,opacity:0.5});
var gridPts3d=[];
for(var gi3=-10;gi3<=10;gi3+=2){gridPts3d.push(gi3,0.01,-10.3,gi3,0.01,10.3);gridPts3d.push(-10.3,0.01,gi3,10.3,0.01,gi3)}
var gridGeo3d=new THREE.BufferGeometry();
gridGeo3d.setAttribute('position',new THREE.Float32BufferAttribute(gridPts3d,3));
scene3d.add(new THREE.LineSegments(gridGeo3d,gridMat3d));

var borderMat3d=new THREE.MeshStandardMaterial({color:0x5b4aa8,roughness:0.6,emissive:0x1a1340,emissiveIntensity:0.4});
[[0,-10.4,20.8,0.3],[0,10.4,20.8,0.3]].forEach(function(bd){var bx=new THREE.Mesh(new THREE.BoxGeometry(bd[2],0.5,bd[3]),borderMat3d);bx.position.set(bd[0],0.25,bd[1]);scene3d.add(bx)});
[[-10.4,0,0.3,20.8],[10.4,0,0.3,20.8]].forEach(function(bd){var bx=new THREE.Mesh(new THREE.BoxGeometry(bd[2],0.5,bd[3]),borderMat3d);bx.position.set(bd[0],0.25,bd[1]);scene3d.add(bx)});

function mapX3d(x2){return x2/W*20.6-10.3}
function mapZ3d(y2){return y2/H*20.6-10.3}

var shipGroup3d=new THREE.Group();
var shipMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.orange),roughness:0.4,emissive:new THREE.Color(o.orange),emissiveIntensity:0.25});
var shipGeo3d=new THREE.ConeGeometry(0.55,1.5,3);
shipGeo3d.rotateX(Math.PI/2);
shipGeo3d.rotateZ(-Math.PI/2);
var shipMesh3d=new THREE.Mesh(shipGeo3d,shipMat3d);
shipMesh3d.castShadow=true;
shipGroup3d.add(shipMesh3d);
var flameMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.yellow)});
var flameGeo3d=new THREE.ConeGeometry(0.28,0.9,8);
flameGeo3d.rotateX(Math.PI/2);
flameGeo3d.rotateZ(Math.PI/2);
var flameMesh3d=new THREE.Mesh(flameGeo3d,flameMat3d);
flameMesh3d.position.x=-1.05;
flameMesh3d.visible=false;
shipGroup3d.add(flameMesh3d);
scene3d.add(shipGroup3d);

var asteroidMeshPool3d=[];
function getAsteroidMesh3d(ast){
  if(!ast.mesh3d){
    var geo=new THREE.IcosahedronGeometry(1,0);
    var pos=geo.attributes.position;
    for(var vi=0;vi<pos.count;vi++){
      var mulIdx=vi%ast.pts.length,mul=ast.pts[mulIdx];
      pos.setXYZ(vi,pos.getX(vi)*mul,pos.getY(vi)*mul,pos.getZ(vi)*mul)
    }
    geo.computeVertexNormals();
    var mat=new THREE.MeshStandardMaterial({color:0x8a7fc9,roughness:0.85,flatShading:true});
    var mesh=new THREE.Mesh(geo,mat);
    mesh.castShadow=true;
    scene3d.add(mesh);
    ast.mesh3d=mesh;
    asteroidMeshPool3d.push(mesh)
  }
  return ast.mesh3d
}
function reclaimAsteroidMeshes3d(){
  var active={};
  asteroids.forEach(function(ast){if(ast.mesh3d)active[ast.mesh3d.id]=1});
  for(var mi=asteroidMeshPool3d.length-1;mi>=0;mi--){
    var mesh=asteroidMeshPool3d[mi];
    if(!active[mesh.id]){scene3d.remove(mesh);extDisposeThree(mesh);asteroidMeshPool3d.splice(mi,1)}
  }
}

var bulletMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.yellow)});
var ufoBulletMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.coral)});
var bulletGeo3d=new THREE.SphereGeometry(0.16,8,6);
var bulletMeshPool3d=[],ufoBulletMeshPool3d=[];
function syncBulletMeshes3d(pool,list,mat){
  while(pool.length<list.length){var m=new THREE.Mesh(bulletGeo3d,mat);scene3d.add(m);pool.push(m)}
  while(pool.length>list.length){var rm=pool.pop();scene3d.remove(rm)}
  for(var bi=0;bi<list.length;bi++)pool[bi].position.set(mapX3d(list[bi].x),0.3,mapZ3d(list[bi].y))
}

var ufoGroup3d=null;
function buildUfoGroup3d(){
  var grp=new THREE.Group();
  var bodyMat=new THREE.MeshStandardMaterial({color:new THREE.Color(o.violet),roughness:0.4});
  var body=new THREE.Mesh(new THREE.CylinderGeometry(0.85,1.1,0.4,16),bodyMat);
  grp.add(body);
  var domeMat=new THREE.MeshStandardMaterial({color:0x1a1030,roughness:0.5});
  var dome=new THREE.Mesh(new THREE.SphereGeometry(0.45,12,8,0,Math.PI*2,0,Math.PI/2),domeMat);
  dome.position.y=0.2;
  grp.add(dome);
  scene3d.add(grp);
  return grp
}

var particleMeshes3d=[];
function spawnParticles3d(wx,wz,color,n){
  var col=new THREE.Color(color);
  for(var pi=0;pi<n;pi++){
    var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
    var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.09,6,6),mat);
    mesh.position.set(wx,0.4,wz);
    scene3d.add(mesh);
    var ang=Math.random()*Math.PI*2,sp=0.04+Math.random()*0.14;
    particleMeshes3d.push({mesh:mesh,vx:Math.cos(ang)*sp,vz:Math.sin(ang)*sp,vy:0.03+Math.random()*0.06,life:1})
  }
}
function stepParticles3d(dt){
  for(var i=particleMeshes3d.length-1;i>=0;i--){
    var pt=particleMeshes3d[i];
    pt.vy-=0.01;
    pt.mesh.position.x+=pt.vx;pt.mesh.position.y+=pt.vy;pt.mesh.position.z+=pt.vz;
    pt.life-=0.035;
    pt.mesh.material.opacity=Math.max(0,pt.life);
    if(pt.life<=0||pt.mesh.position.y<-2){scene3d.remove(pt.mesh);extDisposeThree(pt.mesh);particleMeshes3d.splice(i,1)}
  }
}

function wrap(o2){o2.x=(o2.x+W)%W;o2.y=(o2.y+H)%H}
function makeAsteroid(x,y,sz){
  var ang=c(0,e),spd=c(25,60)+4*wave+15*(3-sz),pts=[];
  for(var i=0;i<10;i++)pts.push(c(.75,1.15));
  return{x:x,y:y,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,sz:sz,r:11*sz+4,pts:pts,a:0,va:c(-1,1)}
}
function buildWave(){
  asteroids=[];
  for(var i=0;i<3+wave;i++){
    var pos=f(2)?{x:c(0,W),y:0}:{x:0,y:c(0,H)};
    asteroids.push(makeAsteroid(pos.x,pos.y,3))
  }
}
function spawnShip(){return{x:200,y:200,vx:0,vy:0,a:-Math.PI/2}}
function spawnUfo(){
  var fromLeft=f(2);
  ufo={x:fromLeft?-20:W+20,y:c(40,H-40),vx:(fromLeft?1:-1)*(50+8*wave),fireCd:c(1,2)}
}
function hitShip(){
  lives--;combo=0;spawnParticles3d(mapX3d(ship.x),mapZ3d(ship.y),o.ink,20);
  if(lives<=0){draw(0);a.over(score,'Wave '+wave+' · Score: '+score);return!0}
  ship=spawnShip();invuln=2.5;return!1
}

function step(dt){
  var thrusting=a.k.ArrowUp||a.k.w;
  ship.a+=4.2*a.ax()*dt;
  if(thrusting){ship.vx+=230*Math.cos(ship.a)*dt;ship.vy+=230*Math.sin(ship.a)*dt}
  ship.vx*=1-.5*dt;ship.vy*=1-.5*dt;
  var spd=Math.hypot(ship.vx,ship.vy);
  if(spd>260){ship.vx*=260/spd;ship.vy*=260/spd}
  ship.x+=ship.vx*dt;ship.y+=ship.vy*dt;wrap(ship);
  invuln-=dt;fireCd-=dt;comboTimer-=dt;
  if(comboTimer<=0)combo=0;
  if(a.k[' ']&&fireCd<=0&&bullets.length<5){
    bullets.push({x:ship.x+14*Math.cos(ship.a),y:ship.y+14*Math.sin(ship.a),vx:380*Math.cos(ship.a)+.3*ship.vx,vy:380*Math.sin(ship.a)+.3*ship.vy,t:1});
    fireCd=.2
  }
  for(var i=bullets.length-1;i>=0;i--){
    var b2=bullets[i];b2.x+=b2.vx*dt;b2.y+=b2.vy*dt;b2.t-=dt;wrap(b2);
    if(b2.t<=0)bullets.splice(i,1)
  }
  asteroids.forEach(function(o2){o2.x+=o2.vx*dt;o2.y+=o2.vy*dt;o2.a+=o2.va*dt;wrap(o2)});
  ufoCd-=dt;
  if(!ufo&&ufoCd<=0&&wave>=2){spawnUfo();ufoCd=Math.max(6,c(12,20)-wave*.5)}
  if(ufo){
    ufo.x+=ufo.vx*dt;
    ufo.fireCd-=dt;
    if(ufo.fireCd<=0&&ufoBullets.length<8){
      var dx=ship.x-ufo.x,dy=ship.y-ufo.y,dd=Math.hypot(dx,dy)||1,spd2=180+10*wave;
      ufoBullets.push({x:ufo.x,y:ufo.y,vx:dx/dd*spd2,vy:dy/dd*spd2,t:2.2});
      ufo.fireCd=c(1.1,1.8)
    }
    if(ufo.x<-30||ufo.x>W+30)ufo=null
  }
  for(var j=ufoBullets.length-1;j>=0;j--){
    var ub=ufoBullets[j];ub.x+=ub.vx*dt;ub.y+=ub.vy*dt;ub.t-=dt;wrap(ub);
    if(ub.t<=0){ufoBullets.splice(j,1);continue}
    if(invuln<=0&&Math.hypot(ub.x-ship.x,ub.y-ship.y)<9){
      ufoBullets.splice(j,1);
      if(hitShip())return
    }
  }
  for(var bi=bullets.length-1;bi>=0;bi--){
    var bl=bullets[bi];
    for(var ai=0;ai<asteroids.length;ai++){
      var ast=asteroids[ai];
      if(Math.hypot(bl.x-ast.x,bl.y-ast.y)<ast.r){
        var base=[0,100,50,20][ast.sz],mult=1+Math.min(4,Math.floor(combo/4));
        score+=base*mult;combo++;comboTimer=2.2;
        spawnParticles3d(mapX3d(ast.x),mapZ3d(ast.y),o.orange,8+3*ast.sz);
        if(ast.mesh3d){scene3d.remove(ast.mesh3d);extDisposeThree(ast.mesh3d)}
        asteroids.splice(ai,1);bullets.splice(bi,1);
        if(ast.sz>1){asteroids.push(makeAsteroid(ast.x,ast.y,ast.sz-1));asteroids.push(makeAsteroid(ast.x,ast.y,ast.sz-1))}
        break
      }
    }
  }
  if(ufo){
    for(var bj=bullets.length-1;bj>=0;bj--){
      if(Math.hypot(bullets[bj].x-ufo.x,bullets[bj].y-ufo.y)<14){
        score+=300;spawnParticles3d(mapX3d(ufo.x),mapZ3d(ufo.y),o.violet,20);bullets.splice(bj,1);ufo=null;break
      }
    }
  }
  if(invuln<=0){
    for(var ci=0;ci<asteroids.length;ci++){
      var ca=asteroids[ci];
      if(Math.hypot(ship.x-ca.x,ship.y-ca.y)<ca.r+8){if(hitShip())return;break}
    }
  }
  if(invuln<=0&&ufo&&Math.hypot(ship.x-ufo.x,ship.y-ufo.y)<18){ufo=null;if(hitShip())return}
  if(!asteroids.length){wave++;score+=250;invuln=2;buildWave()}
  draw(dt)
}

function draw(dt){
  reclaimAsteroidMeshes3d();
  asteroids.forEach(function(ast){
    var mesh=getAsteroidMesh3d(ast);
    var sc=0.55*ast.sz+0.25;
    mesh.scale.setScalar(sc);
    mesh.position.set(mapX3d(ast.x),0.5,mapZ3d(ast.y));
    mesh.rotation.y=ast.a;
    mesh.rotation.x=ast.a*0.6
  });
  syncBulletMeshes3d(bulletMeshPool3d,bullets,bulletMat3d);
  syncBulletMeshes3d(ufoBulletMeshPool3d,ufoBullets,ufoBulletMat3d);
  if(ufo){
    if(!ufoGroup3d)ufoGroup3d=buildUfoGroup3d();
    ufoGroup3d.visible=true;
    ufoGroup3d.position.set(mapX3d(ufo.x),0.5,mapZ3d(ufo.y));
  }else if(ufoGroup3d){
    ufoGroup3d.visible=false
  }
  var shipVisible=invuln<=0||Math.floor(8*invuln)%2;
  shipGroup3d.visible=!!shipVisible;
  if(shipVisible){
    shipGroup3d.position.set(mapX3d(ship.x),0.55,mapZ3d(ship.y));
    shipGroup3d.rotation.y=-ship.a;
    flameMesh3d.visible=!!(a.k.ArrowUp||a.k.w)
  }
  stepParticles3d(dt||0.016);
  renderer3d.render(scene3d,camera3d);
  a.hud([['SCORE',y(score)],['WAVE',wave],['SHIPS',lives],['COMBO','x'+(1+Math.min(4,Math.floor(combo/4)))]])
}

a.pad([['◀','ArrowLeft'],['▲','ArrowUp'],['FIRE','Space'],['▶','ArrowRight']]);
a.fns.push(function(){
  scene3d.traverse(function(obj){extDisposeThree(obj)});
  renderer3d.dispose();
  if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
  if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
});
a.begin(function(){
  ship=spawnShip();score=0;lives=3;wave=1;bullets=[];ufoBullets=[];fireCd=0;invuln=2;combo=0;comboTimer=0;ufo=null;ufoCd=c(10,16);
  buildWave();
  a.frame(step)
})
}
ext3DLoadGate(a.el,startGame3D)
}),w('pelletProwler',b,'Pellet Prowler',o.yellow,'Gobble every pellet, snag the bonus fruit, and outrun four hunting ghosts.','Arrows / WASD to steer · swipe on mobile',function(r){
function startGame3D(){
var t,n,a,i,l,f,c,h,s,v,w,b,m,M,k,S=22,E=17,A=19,T=[[0,-1],[-1,0],[0,1],[1,0]],L=[o.coral,o.magenta,o.teal,o.orange],C=[[8,8],[7,9],[9,9],[8,9]],P=[[15,1],[1,1],[15,17],[1,17]],D=[0,2.5,5,8],O=[7,18,6,18,5,20,5,1e9],U=0,FRUIT_VALS=[100,300,500,700,1000],pelletTotal=0,fruitSpawned=!1,fruit=null,fruitTimer=0;

var wrapDiv3d=document.createElement('div');
wrapDiv3d.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
r.el.appendChild(wrapDiv3d);
var canvasWrap3d=document.createElement('div');
canvasWrap3d.style.cssText='position:relative;width:100%;max-width:374px;aspect-ratio:374/418;margin:0 auto';
wrapDiv3d.appendChild(canvasWrap3d);
var readyMsg3d=document.createElement('div');
readyMsg3d.style.cssText='position:absolute;left:0;top:44%;width:100%;text-align:center;font-weight:800;font-size:1.2rem;letter-spacing:.08em;color:'+o.yellow+';pointer-events:none;text-shadow:0 0 10px rgba(0,0,0,.6)';
canvasWrap3d.appendChild(readyMsg3d);

var renderer3d=extMakeWebGLRenderer();
if(!renderer3d){r.fns.push(function(){if(wrapDiv3d&&wrapDiv3d.parentNode)wrapDiv3d.parentNode.removeChild(wrapDiv3d)});return}
renderer3d.setSize(374,418);
renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
renderer3d.setClearColor(0x0b0518,1);
canvasWrap3d.insertBefore(renderer3d.domElement,readyMsg3d);
r.cv=renderer3d.domElement;r.w=374;r.h=418;

var scene3d=new THREE.Scene();
scene3d.fog=new THREE.Fog(0x0b0518,26,56);
var camera3d=new THREE.PerspectiveCamera(48,374/418,0.1,200);
camera3d.position.set(0,20.5,15.5);
camera3d.lookAt(0,0,0.5);
scene3d.add(new THREE.AmbientLight(0xcfe9ff,0.75));
var sun3d=new THREE.DirectionalLight(0xffffff,0.9);
sun3d.position.set(8,24,10);
scene3d.add(sun3d);

function mapX3d(col){return col-E/2+0.5}
function mapZ3d(row){return row-A/2+0.5}
function worldFromPixel3d(px,py){return{x:px/S-E/2,z:py/S-A/2}}

var floor3d=new THREE.Mesh(new THREE.PlaneGeometry(E+0.4,A+0.4),new THREE.MeshStandardMaterial({color:0x161029,roughness:0.95}));
floor3d.rotation.x=-Math.PI/2;
scene3d.add(floor3d);

var wallMat3d=new THREE.MeshStandardMaterial({color:0x33256b,roughness:0.8});
var wallGeo3d=new THREE.BoxGeometry(0.98,0.7,0.98);
var wallMeshes3d=[];
function clearWallMeshes3d(){wallMeshes3d.forEach(function(m){scene3d.remove(m);extDisposeThree(m)});wallMeshes3d=[]}
function buildWallMeshes3d(){
  clearWallMeshes3d();
  for(var row=0;row<A;row++)for(var col=0;col<E;col++){
    if(t[row][col]&&(I(col-1,row)||I(col+1,row)||I(col,row-1)||I(col,row+1)||I(col-1,row-1)||I(col+1,row-1)||I(col-1,row+1)||I(col+1,row+1))){
      var m=new THREE.Mesh(wallGeo3d,wallMat3d);
      m.position.set(mapX3d(col),0.35,mapZ3d(row));
      scene3d.add(m);
      wallMeshes3d.push(m)
    }
  }
}

var pelletMeshes3d={};
function clearPelletMeshes3d(){for(var key in pelletMeshes3d){scene3d.remove(pelletMeshes3d[key]);extDisposeThree(pelletMeshes3d[key])}pelletMeshes3d={}}
var pelletMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.dim)});
var powerMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.yellow)});
function buildPelletMeshes3d(){
  clearPelletMeshes3d();
  for(var row=0;row<A;row++)for(var col=0;col<E;col++){
    if(n[row][col]===1){
      var m=new THREE.Mesh(new THREE.SphereGeometry(0.09,6,6),pelletMat3d);
      m.position.set(mapX3d(col),0.5,mapZ3d(row));
      scene3d.add(m);
      pelletMeshes3d[row+','+col]=m
    }else if(n[row][col]===2){
      var pm=new THREE.Mesh(new THREE.SphereGeometry(0.18,10,8),powerMat3d);
      pm.position.set(mapX3d(col),0.5,mapZ3d(row));
      scene3d.add(pm);
      pelletMeshes3d[row+','+col]=pm
    }
  }
}
function syncPelletMeshes3d(){
  for(var key in pelletMeshes3d){
    var parts=key.split(','),row=+parts[0],col=+parts[1];
    pelletMeshes3d[key].visible=n[row][col]!==0;
    if(n[row][col]===2)pelletMeshes3d[key].scale.setScalar(1+0.25*Math.sin(8*U))
  }
}

var fruitMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.coral),emissive:new THREE.Color(o.coral),emissiveIntensity:0.3});
var fruitLeafMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.green)});
var fruitGroup3d=new THREE.Group();
fruitGroup3d.add(new THREE.Mesh(new THREE.SphereGeometry(0.32,12,10),fruitMat3d));
var fruitLeaf3d=new THREE.Mesh(new THREE.ConeGeometry(0.1,0.22,6),fruitLeafMat3d);
fruitLeaf3d.position.set(-0.12,0.32,0);
fruitGroup3d.add(fruitLeaf3d);
fruitGroup3d.visible=false;
scene3d.add(fruitGroup3d);

var catMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.yellow),roughness:0.45,emissive:new THREE.Color(o.yellow),emissiveIntensity:0.15});
var catGroup3d=new THREE.Group();
var catBody3d=new THREE.Mesh(new THREE.SphereGeometry(0.42,14,10),catMat3d);
catGroup3d.add(catBody3d);
var catEarGeo3d=new THREE.ConeGeometry(0.16,0.3,4);
var catEarL3d=new THREE.Mesh(catEarGeo3d,catMat3d);
catEarL3d.position.set(-0.26,0.38,0);
catGroup3d.add(catEarL3d);
var catEarR3d=new THREE.Mesh(catEarGeo3d,catMat3d);
catEarR3d.position.set(0.26,0.38,0);
catGroup3d.add(catEarR3d);
var eyeMat3d=new THREE.MeshBasicMaterial({color:0x0b0518});
var catEyeGeo3d=new THREE.SphereGeometry(0.075,8,6);
var catEyeL3d=new THREE.Mesh(catEyeGeo3d,eyeMat3d);
var catEyeR3d=new THREE.Mesh(catEyeGeo3d,eyeMat3d);
catGroup3d.add(catEyeL3d,catEyeR3d);
scene3d.add(catGroup3d);

function buildGhostGroup3d(color){
  var grp=new THREE.Group();
  var mat=new THREE.MeshStandardMaterial({color:new THREE.Color(color),roughness:0.5});
  grp.userData.mat=mat;
  var antenna=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.22,6),mat);
  antenna.position.set(0,0.55,0);
  grp.add(antenna);
  var antTip=new THREE.Mesh(new THREE.SphereGeometry(0.06,6,6),mat);
  antTip.position.set(0,0.66,0);
  grp.add(antTip);
  var head=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.5,0.5),mat);
  head.position.y=0.2;
  grp.add(head);
  var legGeo=new THREE.BoxGeometry(0.16,0.16,0.16);
  var legL=new THREE.Mesh(legGeo,mat);
  legL.position.set(-0.18,-0.18,0);
  grp.add(legL);
  var legR=new THREE.Mesh(legGeo,mat);
  legR.position.set(0.1,-0.18,0);
  grp.add(legR);
  var visorMat=new THREE.MeshBasicMaterial({color:0x0b0518});
  var visor=new THREE.Mesh(new THREE.BoxGeometry(0.44,0.16,0.1),visorMat);
  visor.position.set(0,0.22,0.26);
  grp.add(visor);
  var eye=new THREE.Mesh(new THREE.SphereGeometry(0.045,6,6),new THREE.MeshBasicMaterial({color:0xffffff}));
  eye.position.set(0,0.22,0.32);
  grp.add(eye);
  grp.userData.eye=eye;
  scene3d.add(grp);
  return grp
}
var ghostGroups3d=L.map(function(col){return buildGhostGroup3d(col)});

var particleMeshes3d=[];
function spawnParticles3d(px,py,color,n2){
  var wp=worldFromPixel3d(px,py),col=new THREE.Color(color);
  for(var pi=0;pi<n2;pi++){
    var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
    var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.08,6,6),mat);
    mesh.position.set(wp.x,0.5,wp.z);
    scene3d.add(mesh);
    var ang=Math.random()*Math.PI*2,sp=0.035+Math.random()*0.1;
    particleMeshes3d.push({mesh:mesh,vx:Math.cos(ang)*sp,vz:Math.sin(ang)*sp,vy:0.03+Math.random()*0.05,life:1})
  }
}
function stepParticles3d(){
  for(var i=particleMeshes3d.length-1;i>=0;i--){
    var pt=particleMeshes3d[i];
    pt.vy-=0.01;
    pt.mesh.position.x+=pt.vx;pt.mesh.position.y+=pt.vy;pt.mesh.position.z+=pt.vz;
    pt.life-=0.035;
    pt.mesh.material.opacity=Math.max(0,pt.life);
    if(pt.life<=0||pt.mesh.position.y<-2){scene3d.remove(pt.mesh);extDisposeThree(pt.mesh);particleMeshes3d.splice(i,1)}
  }
}

function I(r2,n2){return n2>=0&&n2<A&&r2>=0&&r2<E&&!t[n2][r2]}

function W(){var r2,o2;for(t=function(){var r2,t2,n2,o2,e2,a2,i2,l2,f2=[],c2={},h2={};function s2(r2,t2){return r2>=0&&r2<A&&t2>=0&&t2<E&&!f2[r2][t2]}for(r2=0;r2<A;r2++)for(f2.push([]),t2=0;t2<E;t2++)f2[r2].push(1);for(n2=[[0,0]],f2[1][1]=0,c2['0,0']=1;n2.length;)o2=n2[n2.length-1],e2=[],T.forEach(function(r2){var t2=o2[0]+r2[0],n2=o2[1]+r2[1];t2>=0&&t2<4&&n2>=0&&n2<9&&!c2[t2+','+n2]&&e2.push([t2,n2,r2])}),e2.length?(a2=u(e2),c2[a2[0]+','+a2[1]]=1,f2[2*a2[1]+1][2*a2[0]+1]=0,f2[2*o2[1]+1+a2[2][1]][2*o2[0]+1+a2[2][0]]=0,n2.push([a2[0],a2[1]])):n2.pop();for(r2=1;r2<18;r2++)for(t2=1;t2<8;t2++)f2[r2][t2]||1===(e2=T.filter(function(n2){return s2(r2+n2[1],t2+n2[0])})).length&&(e2=T.filter(function(n2){var o2=r2+n2[1],e2=t2+n2[0];return o2>0&&o2<18&&e2>0&&e2<8&&f2[o2][e2]&&s2(r2+2*n2[1],t2+2*n2[0])&&t2+2*n2[0]<8})).length&&(a2=u(e2),f2[r2+a2[1]][t2+a2[0]]=0);for(r2=1;r2<18;r2++)for(t2=1;t2<8;t2++)if(f2[r2][t2]){var y2=r2%2==0&&t2%2==1;(r2%2==1&&t2%2==0&&t2<7&&s2(r2,t2-1)&&s2(r2,t2+1)||y2&&s2(r2-1,t2)&&s2(r2+1,t2))&&Math.random()<.22&&(f2[r2][t2]=0)}for(r2=0;r2<A;r2++)for(t2=0;t2<8;t2++)f2[r2][16-t2]=f2[r2][t2]
;for([3,5,11,13,15].forEach(function(r2){Math.random()<.5&&(f2[r2][8]=0)}),t2=1;t2<16;t2++)f2[1][t2]=0,f2[17][t2]=0;for(t2=6;t2<=10;t2++)f2[8][t2]=1,f2[10][t2]=1;for(f2[9][6]=1,f2[9][10]=1,f2[9][7]=0,f2[9][8]=0,f2[9][9]=0,f2[8][8]=0,f2[7][8]=0,i2=[[8,17]],h2['8,17']=1;i2.length;)l2=i2.pop(),T.forEach(function(r2){var t2=l2[0]+r2[0],n2=l2[1]+r2[1];s2(n2,t2)&&!h2[t2+','+n2]&&(h2[t2+','+n2]=1,i2.push([t2,n2]))});for(r2=0;r2<A;r2++)for(t2=0;t2<E;t2++)f2[r2][t2]||h2[t2+','+r2]||(f2[r2][t2]=1);return f2}(),n=[],a=0,o2=0;o2<A;o2++)for(n.push([]),r2=0;r2<E;r2++)n[o2].push(0),t[o2][r2]||9===o2&&r2>6&&r2<10||8===o2&&8===r2||8===r2&&17===o2||(n[o2][r2]=1,a++);[[1,1],[15,1],[1,17],[15,17]].forEach(function(r2){1===n[r2[1]][r2[0]]&&(n[r2[1]][r2[0]]=2)});pelletTotal=a;fruitSpawned=!1;fruit=null;fruitTimer=0;buildWallMeshes3d();buildPelletMeshes3d();F()}

function F(){i={tx:8,ty:17,nx:8,ny:17,p:0,dx:0,dy:0,ld:null,arrive:N},f=[0,0],l=C.map(function(r2,t2){return{i:t2,tx:r2[0],ty:r2[1],nx:r2[0],ny:r2[1],p:0,dx:0,dy:0,out:0===t2,fr:!1,rel:D[t2]*Math.max(.5,1-.08*s)}}),v=0,w=0,b=0,M=1.4,k=0,fruit=null,fruitTimer=0}

function B(r2){var t2=r2.tx,n2=r2.ty;r2.tx=r2.nx,r2.ty=r2.ny,r2.nx=t2,r2.ny=n2,r2.p=1-r2.p,r2.dx=-r2.dx,r2.dy=-r2.dy}
function H(r2){r2.p>0?B(r2):(r2.dx=-r2.dx,r2.dy=-r2.dy)}
function q(r2,t2,n2){for(var o2,e2=0;t2>0&&e2++<6;){if(0===r2.p){if(n2(r2),!r2.dx&&!r2.dy)return;if(r2.nx=r2.tx+r2.dx,r2.ny=r2.ty+r2.dy,!I(r2.nx,r2.ny))return r2.dx=0,void(r2.dy=0)}t2>=(o2=1-r2.p)?(t2-=o2,r2.tx=r2.nx,r2.ty=r2.ny,r2.p=0,r2.arrive&&r2.arrive(r2)):(r2.p+=t2,t2=0)}}
function z(r2){(f[0]||f[1])&&I(r2.tx+f[0],r2.ty+f[1])?(r2.dx=f[0],r2.dy=f[1]):I(r2.tx+r2.dx,r2.ty+r2.dy)||(r2.dx=0,r2.dy=0),(r2.dx||r2.dy)&&(r2.ld=[r2.dx,r2.dy])}
function V(r2){var t2,n2,o2,e2,a2=T.filter(function(t2){return I(r2.tx+t2[0],r2.ty+t2[1])&&!((r2.dx||r2.dy)&&t2[0]===-r2.dx&&t2[1]===-r2.dy)}),f2=1e9;if(a2.length||(a2=[[-r2.dx,-r2.dy]]),r2.fr&&r2.out)return n2=u(a2),r2.dx=n2[0],void(r2.dy=n2[1]);for(t2=function(r2){var t2,n2=i.tx,o2=i.ty,e2=i.ld?i.ld[0]:0,a2=i.ld?i.ld[1]:0;return r2.out?v%2==0?P[r2.i]:0===r2.i?[n2,o2]:1===r2.i?[n2+4*e2,o2+4*a2]:2===r2.i?[2*(n2+2*e2)-(t2=l[0]).tx,2*(o2+2*a2)-t2.ty]:Math.hypot(n2-r2.tx,o2-r2.ty)>6?[n2,o2]:P[3]:[8,6]}(r2),n2=a2[0],o2=0;o2<a2.length;o2++)(e2=Math.pow(r2.tx+a2[o2][0]-t2[0],2)+Math.pow(r2.ty+a2[o2][1]-t2[1],2))<f2&&(f2=e2,n2=a2[o2]);r2.dx=n2[0],r2.dy=n2[1]}
function N(r2){var t2=n[r2.ty][r2.tx];t2&&(n[r2.ty][r2.tx]=0,a--,h+=2===t2?50:10,2===t2&&(b=Math.max(2.5,7.5-.8*s),m=0,l.forEach(function(r2){r2.out&&(r2.fr||H(r2),r2.fr=!0)})))}
function Y(r2){return{x:(r2.tx+(r2.nx-r2.tx)*r2.p+.5)*S,y:(r2.ty+(r2.ny-r2.ty)*r2.p+.5)*S}}
function j(r2,t2){f=[r2,t2],i.p>0&&r2===-i.dx&&t2===-i.dy&&B(i)}

function update(dt){
  U+=dt;
  if(k>0){
    if((k-=dt)<=0){
      if(c<=0)return void r.over(h,'Level '+s+' · Score: '+h);
      F()
    }
    draw();return
  }
  if(M>0){M-=dt;draw();return}
  if(b>0){
    if((b-=dt)<=0)l.forEach(function(gh){gh.fr=!1})
  }else{
    w+=dt;
    if(w>O[v]){w=0;v++;l.forEach(function(gh){gh.out&&H(gh)})}
  }
  q(i,(4.9+.12*Math.min(s,6))*dt,z);
  l.forEach(function(gh){
    if(!gh.out&&(gh.rel-=dt,gh.rel>0))return;
    var spd=gh.fr?2.9:4.2+.22*Math.min(s,8);
    if(gh.i===0&&!gh.fr&&pelletTotal&&a<=pelletTotal*.2)spd+=1.2;
    q(gh,spd*dt,V);
    if(!gh.out&&gh.ty<=7&&0===gh.p)gh.out=!0
  });
  if(!fruitSpawned&&pelletTotal&&pelletTotal-a>=Math.floor(pelletTotal*.35)){
    fruitSpawned=!0;fruit={x:4.5*S,y:17.5*S};fruitTimer=9
  }
  if(fruit){
    fruitTimer-=dt;
    if(fruitTimer<=0)fruit=null;
    else{
      var pp=Y(i);
      if(Math.hypot(pp.x-fruit.x,pp.y-fruit.y)<.55*S){
        h+=FRUIT_VALS[Math.min(FRUIT_VALS.length-1,s-1)];
        spawnParticles3d(fruit.x,fruit.y,o.coral,20);
        fruit=null
      }
    }
  }
  if(a<=0){s++;h+=300;W();return}
  var pacPos=Y(i);
  for(var gi=0;gi<l.length;gi++){
    var gh=l[gi];
    if(gh.out||!(gh.rel>0)){
      var ghPos=Y(gh);
      if(Math.hypot(pacPos.x-ghPos.x,pacPos.y-ghPos.y)<.55*S){
        if(!gh.fr){k=1.2;c--;spawnParticles3d(pacPos.x,pacPos.y,o.yellow,24);break}
        m++;h+=100*Math.pow(2,m);spawnParticles3d(ghPos.x,ghPos.y,L[gi],16);
        gh.tx=gh.nx=C[gi][0];gh.ty=gh.ny=C[gi][1];gh.p=0;gh.dx=0;gh.dy=0;gh.fr=!1;gh.out=!1;gh.rel=1.5
      }
    }
  }
  draw()
}

function draw(){
  syncPelletMeshes3d();
  fruitGroup3d.visible=!!fruit;
  if(fruit){var fw=worldFromPixel3d(fruit.x,fruit.y);fruitGroup3d.position.set(fw.x,0.5,fw.z)}
  var pacPix=Y(i),pacWorld=worldFromPixel3d(pacPix.x,pacPix.y),ang=i.ld?Math.atan2(i.ld[1],i.ld[0]):0;
  catGroup3d.visible=!(k>0);
  if(!(k>0)){
    catGroup3d.position.set(pacWorld.x,0.5,pacWorld.z);
    catGroup3d.rotation.y=-ang;
    var eo=0.17;
    catEyeL3d.position.set(-0.16,0.08,eo);
    catEyeR3d.position.set(0.16,0.08,eo)
  }
  ghostGroups3d.forEach(function(grp,gi){
    if(k>0){grp.visible=false;return}
    grp.visible=true;
    var gh=l[gi],gp=Y(gh),gw=worldFromPixel3d(gp.x,gp.y);
    grp.position.set(gw.x,0.42,gw.z);
    var ghAngle=Math.atan2(gh.dy||0,gh.dx||1);
    grp.rotation.y=-ghAngle;
    var flashWhite=gh.fr&&(b>2||Math.floor(4*b)%2);
    var color=gh.fr?(flashWhite?0x4DA6FF:0x0b0518):L[gi];
    grp.userData.mat.color.set(color);
    grp.userData.eye.visible=!gh.fr
  });
  stepParticles3d();
  readyMsg3d.style.display=M>0?'block':'none';
  renderer3d.render(scene3d,camera3d);
  r.hud([['SCORE',y(h)],['LEVEL',s],['LIVES',c],['CHAIN',b>0&&m>0?'x'+Math.pow(2,m):'-']])
}

r.press=function(k2){var t2={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[k2];t2&&j(t2[0],t2[1])};
r.swipe(function(d2){j.apply(null,{up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[d2])});
r.pad([['▲','ArrowUp'],['◀','ArrowLeft'],['▶','ArrowRight'],['▼','ArrowDown']]);
r.fns.push(function(){
  clearWallMeshes3d();clearPelletMeshes3d();
  scene3d.traverse(function(obj){extDisposeThree(obj)});
  renderer3d.dispose();
  if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
  if(wrapDiv3d&&wrapDiv3d.parentNode)wrapDiv3d.parentNode.removeChild(wrapDiv3d)
});
r.begin(function(){h=0,c=3,s=1,r.fx=[],W(),r.frame(update)})
}
ext3DLoadGate(r.el,startGame3D)
}),w('fleetHunt',k,'Fleet Hunt',o.blue,'Call your shots across the water and hunt down the hidden fleet before it sinks yours.','Click a square on the big grid to fire · arrows + Space work too · sink all five ships',function(a){
var G=10,CELL=30,MINI=17,MY=380,ctx=a.canvas(400,560),LENS=[5,4,3,3,2];
var diff=1,DIFF=[{exp:0.7,hitW:3,noise:0.45},{exp:1.3,hitW:5,noise:0.16},{exp:2.5,hitW:7,noise:0.02}];
var enemy,mine,shotE,shotM,turn,over,score,wins,msg,hover,cursor,keyNav,rDelay,lastR;
function makeFleet(){
  var occ={},ships=[];
  LENS.forEach(function(len){
    var ok,cells,horiz,row,col,idx,j;
    do{
      horiz=Math.random()<0.5;
      col=f(horiz?G-len+1:G);
      row=f(horiz?G:G-len+1);
      cells=[];ok=true;
      for(j=0;j<len;j++){
        idx=(row+(horiz?0:j))*G+col+(horiz?j:0);
        if(occ[idx]!==undefined)ok=false;
        cells.push(idx);
      }
    }while(!ok);
    cells.forEach(function(idx){occ[idx]=ships.length;});
    ships.push({n:len,cells:cells,hit:0});
  });
  return {ships:ships,occ:occ};
}
function alive(fleet){return fleet.ships.filter(function(sh){return sh.hit<sh.n;}).length;}
function fireAt(fleet,shots,idx){
  if(shots[idx])return{already:true,hit:false};
  if(fleet.occ[idx]===undefined){shots[idx]=1;return{hit:false};}
  shots[idx]=2;
  var ship=fleet.ships[fleet.occ[idx]];
  ship.hit++;
  return{hit:true,sunk:ship.hit>=ship.n,ship:ship};
}
function densityMap(shots,sunkSet,lens,hitW){
  var heat=new Array(G*G).fill(0);
  lens.forEach(function(len){
    for(var dir=0;dir<2;dir++)
      for(var row=0;row<G;row++)
        for(var col=0;col<G;col++){
          var ok=true,cells=[];
          for(var j=0;j<len;j++){
            var rr=dir===0?row:row+j,cc=dir===0?col+j:col;
            if(rr>=G||cc>=G){ok=false;break;}
            var idx=rr*G+cc;
            if(shots[idx]===1||sunkSet[idx]){ok=false;break;}
            cells.push(idx);
          }
          if(ok)cells.forEach(function(idx){heat[idx]+=shots[idx]===2?hitW:1;});
        }
  });
  for(var i=0;i<G*G;i++)if(shots[i])heat[i]=0;
  return heat;
}
function weightedPick(cands,weights){
  var total=0,i;
  for(i=0;i<weights.length;i++)total+=weights[i];
  var r=Math.random()*total;
  for(i=0;i<cands.length;i++){r-=weights[i];if(r<=0)return cands[i];}
  return cands[cands.length-1];
}
function rivalFire(){
  var sunkSet={};
  mine.ships.forEach(function(sh){if(sh.hit>=sh.n)sh.cells.forEach(function(c){sunkSet[c]=true;});});
  var lens=mine.ships.filter(function(sh){return sh.hit<sh.n;}).map(function(sh){return sh.n;});
  var dp=DIFF[diff];
  var heat=densityMap(shotM,sunkSet,lens,dp.hitW);
  var cands=[],weights=[];
  for(var i=0;i<G*G;i++){
    if(shotM[i])continue;
    cands.push(i);
    weights.push(Math.pow(heat[i]+1,dp.exp)*(1+dp.noise*Math.random()));
  }
  var idx=cands.length?weightedPick(cands,weights):-1;
  if(idx<0)return;
  var res=fireAt(mine,shotM,idx);
  lastR=idx;
  a.burst(20+idx%G*MINI+8.5,MY+Math.floor(idx/G)*MINI+8.5,res.hit?o.coral:o.dim,res.hit?12:4);
  msg=res.hit?(res.sunk?'Rival sank your '+res.ship.n+'-long ship!':'Rival hit your fleet'):'Rival missed';
  if(!alive(mine))endRound(false);else{turn=1;rDelay=0;}
}
function playerFire(idx){
  if(over||turn!==1)return;
  if(shotE[idx])return;
  var res=fireAt(enemy,shotE,idx);
  a.burst(50+idx%G*CELL+15,46+Math.floor(idx/G)*CELL+15,res.hit?o.coral:o.dim,res.hit?16:6);
  msg=res.hit?(res.sunk?'You sank a '+res.ship.n+'-long ship!':'Hit!'):'Miss';
  if(!alive(enemy))endRound(true);else{turn=2;rDelay=0.65;}
}
function endRound(playerWon){
  over=true;
  if(playerWon){
    var bonus=alive(mine);
    var gain=Math.round((100+20*bonus+15*wins)*(1+0.5*diff));
    score+=gain;wins++;
    msg='Fleet destroyed. You win! (+'+gain+')';
    a.burst(200,200,o.blue,44);
    a.later(newRound,1800);
  }else{
    msg='Your fleet is gone';
    a.later(function(){a.over(score,'Fleet lost after '+wins+' win'+(wins===1?'':'s')+' on '+['Easy','Normal','Hard'][diff]+'. Score: '+score);},1300);
  }
}
function newRound(){
  enemy=makeFleet();mine=makeFleet();
  shotE=[];shotM=[];
  for(var i=0;i<G*G;i++){shotE.push(0);shotM.push(0);}
  turn=1;over=false;msg='';rDelay=0;lastR=-1;
}
function startGame(){
  score=0;wins=0;cursor=0;keyNav=false;hover=-1;
  newRound();
  a.fx=[];
  a.frame(step);
}
function step(dt){
  if(!over&&turn===2){
    rDelay-=dt;
    if(rDelay<=0){rDelay=99;rivalFire();}
  }
  g(ctx,400,560);
  x(ctx,msg||(turn===1?'Your shot':'Rival is aiming'),200,22,16,o.ink);
  p(ctx,46,42,308,308,8,'#12305a');
  var sunkCells={};
  enemy.ships.forEach(function(sh){if(sh.hit>=sh.n)sh.cells.forEach(function(c){sunkCells[c]=1;});});
  for(var i=0;i<G*G;i++){
    var cx=50+i%G*CELL,cy=46+Math.floor(i/G)*CELL;
    var st=shotE[i];
    p(ctx,cx+1,cy+1,28,28,4,sunkCells[i]?'#5a2440':(i===hover&&turn===1&&!over&&!st?'rgba(77,166,255,.32)':'rgba(77,166,255,.16)'));
    if(st===1)d(ctx,cx+15,cy+15,4,o.dim);
    if(st===2){d(ctx,cx+15,cy+15,9,o.coral);d(ctx,cx+15,cy+15,4,o.yellow);}
  }
  if(keyNav){ctx.strokeStyle=o.ink;ctx.lineWidth=3;r.L(ctx,50+cursor%G*CELL+1,46+Math.floor(cursor/G)*CELL+1,28,28,5);ctx.stroke();}
  x(ctx,'YOUR FLEET',105,366,12,o.dim);
  p(ctx,17,377,176,176,6,'#12305a');
  for(var j=0;j<G*G;j++){
    var mx=20+j%G*MINI,my=MY+Math.floor(j/G)*MINI;
    p(ctx,mx+1,my+1,15,15,3,mine.occ[j]!==undefined?o.blue:'rgba(77,166,255,.12)');
    if(shotM[j]===1)d(ctx,mx+8.5,my+8.5,2.5,o.dim);
    if(shotM[j]===2)d(ctx,mx+8.5,my+8.5,5,o.coral);
    if(j===lastR){ctx.strokeStyle=o.yellow;ctx.lineWidth=2;r.L(ctx,mx,my,MINI,MINI,3);ctx.stroke();}
  }
  x(ctx,'RIVAL SHIPS LEFT',300,386,12,o.dim);
  enemy.ships.forEach(function(sh,t){
    for(var m=0;m<sh.n;m++)p(ctx,236+16*m,402+24*t,14,14,3,sh.hit>=sh.n?o.coral:o.grid);
  });
  x(ctx,'YOURS: '+alive(mine)+' AFLOAT',300,540,12,o.ink);
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['WINS',wins]]);
}
a.pointer({down:function(pt){
  var cx=Math.floor((pt.x-50)/CELL),cy=Math.floor((pt.y-46)/CELL);
  keyNav=false;
  if(cx>=0&&cy>=0&&cx<G&&cy<G)playerFire(cy*G+cx);
},move:function(pt){
  var cx=Math.floor((pt.x-50)/CELL),cy=Math.floor((pt.y-46)/CELL);
  hover=(cx>=0&&cy>=0&&cx<G&&cy<G)?cy*G+cx:-1;
}});
a.press=function(key){
  var cx=cursor%G,cy=Math.floor(cursor/G);
  keyNav=true;
  if(key==='ArrowLeft'||key==='a')cx=Math.max(0,cx-1);
  else if(key==='ArrowRight'||key==='d')cx=Math.min(G-1,cx+1);
  else if(key==='ArrowUp'||key==='w')cy=Math.max(0,cy-1);
  else if(key==='ArrowDown'||key==='s')cy=Math.min(G-1,cy+1);
  else if(key===' '||key==='Enter')playerFire(cursor);
  cursor=cy*G+cx;
};
a.pad([['◀','ArrowLeft'],['▲','ArrowUp'],['▼','ArrowDown'],['▶','ArrowRight'],['Fire','Space']]);
a.opt('Difficulty',['Easy','Normal','Hard'],diff,function(i){diff=i;startGame();});
a.begin(startGame);
}),w('boxLine',k,'Box Line',o.green,'Draw lines between the dots. Close the fourth side of a box to claim it and go again.','Click near a line to draw it · or arrows to pick and Space to draw · claim more boxes than the rival',function(a){
var DOTX=56,DOTY=96,SP=72,ROWS=4,COLS=4,NLINES=40,HSPLIT=20;
var ctx=a.canvas(400,470);
var diff=1,lines,boxOwner,turn,over,score,wins,msg,moveDelay,keyCursor,keyNav,hoverEdge,lastEdge;
function topIdx(row,col){return row*COLS+col;}
function vertIdx(row,col){return HSPLIT+row*(COLS+1)+col;}
function boxEdges(br,bc){return[topIdx(br,bc),topIdx(br+1,bc),vertIdx(br,bc),vertIdx(br,bc+1)];}
function edgeBoxes(idx){
  var boxes=[],row,col;
  if(idx<HSPLIT){row=Math.floor(idx/COLS);col=idx%COLS;if(row>0)boxes.push({r:row-1,c:col});if(row<ROWS)boxes.push({r:row,c:col});}
  else{var i2=idx-HSPLIT;row=Math.floor(i2/(COLS+1));col=i2%(COLS+1);if(col>0)boxes.push({r:row,c:col-1});if(col<COLS)boxes.push({r:row,c:col});}
  return boxes;
}
function missingEdges(L,br,bc){return boxEdges(br,bc).filter(function(e){return!L[e];});}
function filledCount(L,br,bc){return boxEdges(br,bc).length-missingEdges(L,br,bc).length;}
function edgePixels(idx){
  var row,col;
  if(idx<HSPLIT){row=Math.floor(idx/COLS);col=idx%COLS;return[DOTX+col*SP,DOTY+row*SP,DOTX+(col+1)*SP,DOTY+row*SP];}
  var i2=idx-HSPLIT;row=Math.floor(i2/(COLS+1));col=i2%(COLS+1);return[DOTX+col*SP,DOTY+row*SP,DOTX+col*SP,DOTY+(row+1)*SP];
}
function unfilledEdges(){var r=[];for(var i=0;i<NLINES;i++)if(!lines[i])r.push(i);return r;}
function isCapturing(e){return edgeBoxes(e).some(function(bx){return!boxOwner[bx.r*COLS+bx.c]&&missingEdges(lines,bx.r,bx.c).length===1;});}
function simulateCascade(linesIn,ownerIn,firstEdge){
  var L=linesIn.slice(),Ow=ownerIn.slice(),queue=[firstEdge],steps=[],guard=0;
  while(queue.length&&guard++<100){
    var e=queue.shift();
    if(L[e])continue;
    L[e]=9;
    var completed=[];
    edgeBoxes(e).forEach(function(bx){
      var bi=bx.r*COLS+bx.c;
      if(Ow[bi])return;
      var miss=missingEdges(L,bx.r,bx.c);
      if(miss.length===0){Ow[bi]=9;completed.push(bi);}
      else if(miss.length===1)queue.push(miss[0]);
    });
    steps.push({edge:e,completed:completed});
  }
  return steps;
}
function totalGiveaway(linesIn,ownerIn){
  var L=linesIn.slice(),Ow=ownerIn.slice(),total=0,guard=0;
  while(guard++<60){
    var capEdge=-1;
    for(var i=0;i<NLINES&&capEdge<0;i++){
      if(L[i])continue;
      var boxes=edgeBoxes(i);
      for(var j=0;j<boxes.length;j++){
        var bx=boxes[j],bi=bx.r*COLS+bx.c;
        if(!Ow[bi]&&missingEdges(L,bx.r,bx.c).length===1){capEdge=i;break;}
      }
    }
    if(capEdge<0)break;
    var steps=simulateCascade(L,Ow,capEdge);
    steps.forEach(function(st){total+=st.completed.length;L[st.edge]=9;st.completed.forEach(function(bi){Ow[bi]=9;});});
  }
  return total;
}
function boxCenter(br,bc){return[DOTX+bc*SP+SP/2,DOTY+br*SP+SP/2];}
function playLine(idx,player){
  lines[idx]=player;
  var completed=0;
  edgeBoxes(idx).forEach(function(bx){
    var bi=bx.r*COLS+bx.c;
    if(!boxOwner[bi]&&missingEdges(lines,bx.r,bx.c).length===0){
      boxOwner[bi]=player;completed++;
      var ctr=boxCenter(bx.r,bx.c);
      a.burst(ctr[0],ctr[1],player===1?o.teal:o.coral,14);
    }
  });
  lastEdge=idx;
  return completed;
}
function boxCounts(){
  var mine=0,rival=0;
  boxOwner.forEach(function(v){if(v===1)mine++;else if(v===2)rival++;});
  return[mine,rival];
}
function endRoundCheck(){
  if(unfilledEdges().length)return false;
  var bc=boxCounts(),mine=bc[0],rival=bc[1];
  over=true;
  if(mine>rival){
    var gain=Math.round((100+10*(mine-rival)+15*wins)*(1+0.5*diff));
    score+=gain;wins++;
    msg='You win '+mine+' to '+rival+' (+'+gain+')';
    a.later(newRound,1700);
  }else if(mine===rival){
    msg='Draw, '+mine+' each';
    a.later(newRound,1700);
  }else{
    msg='You lose '+mine+' to '+rival;
    a.later(function(){a.over(score,'Lost '+mine+' to '+rival+' after '+wins+' win'+(wins===1?'':'s')+' on '+['Easy','Normal','Hard'][diff]+'. Score: '+score);},1300);
  }
  return true;
}
function applyMove(idx,player){
  var completed=playLine(idx,player);
  if(endRoundCheck())return;
  if(completed>0){
    turn=player;moveDelay=player===2?0.55:0;
  }else{
    turn=3-player;moveDelay=turn===2?0.5:0;
  }
}
function aiMove(){
  var open=unfilledEdges();
  if(!open.length)return;
  var capturing=open.filter(isCapturing);
  if(capturing.length&&!(diff===0&&Math.random()<0.4)){
    if(diff===2){
      var startEdge=u(capturing);
      var steps=simulateCascade(lines,boxOwner,startEdge);
      var totalBoxes=0;steps.forEach(function(st){totalBoxes+=st.completed.length;});
      var isFinal=(open.length-steps.length)<=0;
      if(!isFinal&&totalBoxes===2&&steps.length>=2){applyMove(steps[1].edge,2);return;}
      applyMove(startEdge,2);return;
    }
    var best=capturing[0],bestN=-1;
    capturing.forEach(function(e){
      var n=edgeBoxes(e).filter(function(bx){return!boxOwner[bx.r*COLS+bx.c]&&missingEdges(lines,bx.r,bx.c).length===1;}).length;
      if(n>bestN){bestN=n;best=e;}
    });
    applyMove(best,2);return;
  }
  var safe=open.filter(function(e){return edgeBoxes(e).every(function(bx){return filledCount(lines,bx.r,bx.c)<=1;});});
  if(diff>0&&safe.length){
    var bestScore=1e9,cands=[];
    safe.forEach(function(e){
      var sc=0;
      edgeBoxes(e).forEach(function(bx){sc+=filledCount(lines,bx.r,bx.c);});
      if(sc<bestScore){bestScore=sc;cands=[e];}else if(sc===bestScore)cands.push(e);
    });
    applyMove(u(cands),2);return;
  }
  if(diff===0&&safe.length){applyMove(u(safe),2);return;}
  if(diff===0){applyMove(u(open),2);return;}
  var bestCost=1e9,bestMoves=[];
  open.forEach(function(e){
    var testLines=lines.slice();testLines[e]=2;
    var cost=totalGiveaway(testLines,boxOwner);
    if(cost<bestCost){bestCost=cost;bestMoves=[e];}else if(cost===bestCost)bestMoves.push(e);
  });
  applyMove(u(bestMoves),2);
}
function nearestEdge(pt){
  var best=-1,bestD=16;
  for(var i=0;i<NLINES;i++){
    if(lines[i])continue;
    var ep=edgePixels(i),ex=ep[2]-ep[0],ey=ep[3]-ep[1];
    var tt=s(((pt.x-ep[0])*ex+(pt.y-ep[1])*ey)/(ex*ex+ey*ey),0,1);
    var d2=Math.hypot(pt.x-(ep[0]+ex*tt),pt.y-(ep[1]+ey*tt));
    if(d2<bestD){bestD=d2;best=i;}
  }
  return best;
}
function newRound(){
  lines=[];boxOwner=[];
  for(var i=0;i<NLINES;i++)lines.push(0);
  for(var j=0;j<ROWS*COLS;j++)boxOwner.push(0);
  turn=1;over=false;msg='';moveDelay=0;lastEdge=-1;
}
function startGame(){
  score=0;wins=0;keyCursor=0;keyNav=false;hoverEdge=-1;
  newRound();
  a.fx=[];
  a.frame(step);
}
function step(dt){
  if(!over&&turn===2){
    moveDelay-=dt;
    if(moveDelay<=0){moveDelay=99;aiMove();}
  }
  g(ctx,400,470);
  var bc=boxCounts();
  d(ctx,70,40,12,o.teal);x(ctx,bc[0],94,40,20,o.ink,'left');
  d(ctx,290,40,12,o.coral);x(ctx,bc[1],314,40,20,o.ink,'left');
  for(var br=0;br<ROWS;br++)for(var bc2=0;bc2<COLS;bc2++){
    var owner=boxOwner[br*COLS+bc2];
    if(owner)p(ctx,DOTX+bc2*SP+6,DOTY+br*SP+6,60,60,10,owner===1?'rgba(47,211,199,.5)':'rgba(255,107,74,.5)');
  }
  for(var i=0;i<NLINES;i++){
    var ep=edgePixels(i);
    if(lines[i])v(ctx,ep[0],ep[1],ep[2],ep[3],i===lastEdge?o.yellow:(lines[i]===1?o.teal:o.coral),6);
    else v(ctx,ep[0],ep[1],ep[2],ep[3],i===hoverEdge&&turn===1&&!over?'rgba(255,255,255,.35)':'rgba(255,255,255,.08)',i===hoverEdge&&turn===1&&!over?5:3);
  }
  if(keyNav&&!lines[keyCursor]){var kp=edgePixels(keyCursor);v(ctx,kp[0],kp[1],kp[2],kp[3],o.ink,6);}
  for(var rr=0;rr<=ROWS;rr++)for(var cc=0;cc<=COLS;cc++)d(ctx,DOTX+cc*SP,DOTY+rr*SP,6,o.ink);
  x(ctx,msg||(turn===1?'Your line':'Rival is choosing'),200,424,16,o.ink);
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['WINS',wins]]);
}
a.pointer({down:function(pt){
  keyNav=false;
  if(over||turn!==1)return;
  var e=nearestEdge(pt);
  if(e>-1)applyMove(e,1);
},move:function(pt){
  hoverEdge=(over||turn!==1)?-1:nearestEdge(pt);
}});
a.press=function(key){
  keyNav=true;
  var dir=0;
  if(key==='ArrowLeft'||key==='ArrowUp'||key==='a'||key==='w')dir=-1;
  else if(key==='ArrowRight'||key==='ArrowDown'||key==='d'||key==='s')dir=1;
  if(dir){
    for(var n=1;n<=NLINES;n++){
      var cand=(keyCursor+dir*n+NLINES*2)%NLINES;
      if(!lines[cand]){keyCursor=cand;break;}
    }
  }else if((key===' '||key==='Enter')&&turn===1&&!over&&!lines[keyCursor]){
    applyMove(keyCursor,1);
  }
};
a.pad([['◀','ArrowLeft'],['▶','ArrowRight'],['Draw','Space']]);
a.opt('Difficulty',['Easy','Normal','Hard'],diff,function(i){diff=i;startGame();});
a.begin(startGame);
}),w('laneDefense',k,'Lane Defense',o.orange,'Plant defenders in five lanes and stop the marching horde reaching the house.','Click a defender then a tile · click glowing energy to collect it · keys 1-5 pick a defender',function(a){
var CX=20,CY=96,CELL=40,LANES=5,COLS=9;
var ctx=a.canvas(400,320);
var TYPES=[{n:'Spark',cost:50,hp:30,col:o.yellow},{n:'Bolt',cost:100,hp:30,col:o.green},{n:'Wall',cost:50,hp:90,col:o.orange},{n:'Frost',cost:150,hp:30,col:o.blue},{n:'Dig',cost:0,hp:0,col:o.coral}];
var ENEMY_BASE=[{hp:10,sp:13,col:o.magenta,r:11},{hp:22,sp:12,col:o.violet,r:12},{hp:9,sp:30,col:o.coral,r:10},{hp:55,sp:9,col:o.teal,r:14}];
var diff=1,DIFF=[{hpMul:0.88,spMul:0.9,spawnMul:1.18,clockBonus:0,bias:0},{hpMul:1,spMul:1,spawnMul:1,clockBonus:0,bias:1.1},{hpMul:1.18,spMul:1.12,spawnMul:0.82,clockBonus:22,bias:2.2}];
var grid,enemies,shots,orbs,energy,selType,clock,spawnT,orbT,defeated,score,cursor,keyNav,flash;
function laneStrength(lane){
  var s=0;
  for(var col=0;col<COLS;col++){
    var d=grid[lane][col];
    if(d)s+=d.hp+(d.t===2?24:d.t===0?4:34);
  }
  return s;
}
function pickSpawnLane(){
  var dp=DIFF[diff];
  if(dp.bias<=0)return f(LANES);
  var weights=[],total=0,i;
  for(i=0;i<LANES;i++){var w2=1/Math.pow(laneStrength(i)+30,dp.bias);weights.push(w2);total+=w2;}
  var r=Math.random()*total;
  for(i=0;i<LANES;i++){r-=weights[i];if(r<=0)return i;}
  return LANES-1;
}
function spawnEnemy(){
  var dp=DIFF[diff],heff=clock+dp.