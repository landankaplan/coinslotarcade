(function(){
'use strict';
var prev=window.CSA_EXT;
window.CSA_EXT=function(K){
  if(prev)prev(K);
  try{sports16(K)}catch(e){console.error(e)}
};

function sports16(K){
'use strict';
var g=K.g,M=K.M,R=K.R;
var CAT='Sports';
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
function addGridLines(scene3d,w,d,y,cz){cz=cz||0;var gridMat=new THREE.LineBasicMaterial({color:0x3a2f78,transparent:true,opacity:.85});var pts=[],hw=w/2,hd=d/2,gx,gz;for(gx=-hw;gx<=hw+.001;gx++)pts.push(gx,y,cz-hd,gx,y,cz+hd);for(gz=-hd;gz<=hd+.001;gz++)pts.push(-hw,y,cz+gz,hw,y,cz+gz);var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));var ls=new THREE.LineSegments(geo,gridMat);scene3d.add(ls);return ls}
function addRails(scene3d,w,d,y,colorHex,cz){cz=cz||0;var wallMat=new THREE.MeshStandardMaterial({color:colorHex!==undefined?colorHex:0x2a2155,roughness:.8});var hw=w/2,hd=d/2;var r1=new THREE.Mesh(new THREE.BoxGeometry(w+.6,.4,.2),wallMat);r1.position.set(0,y+.2,cz-hd-.1);scene3d.add(r1);var r2=r1.clone();r2.material=wallMat;r2.position.z=cz+hd+.1;scene3d.add(r2);var r3=new THREE.Mesh(new THREE.BoxGeometry(.2,.4,d+.6),wallMat);r3.position.set(-hw-.1,y+.2,cz);scene3d.add(r3);var r4=r3.clone();r4.material=wallMat;r4.position.x=hw+.1;scene3d.add(r4);return[r1,r2,r3,r4]}
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
  var scene3d=new THREE.Scene();scene3d.fog=new THREE.Fog(bg,10,34);
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

/* ================= aimTarget3d: tap-tap aim+power meter, 3D projectile arc, target or distance scoring ================= */
function aimTarget3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Tap once to lock your aim while the marker sweeps, tap again to lock your power',function(G){
    loadGate(G.el,function(){
      var ROUNDS=6;
      var S3=setup3D(G,360,.72,0x0d1530);if(!S3)return;
      var scene=S3.scene,camera=S3.camera;
      camera.position.set(0,2.6,6.4);camera.lookAt(0,1,-2);
      var floor=new THREE.Mesh(new THREE.PlaneGeometry(10,16),new THREE.MeshStandardMaterial({color:0x1c1640,metalness:.2,roughness:.9}));
      floor.rotation.x=-Math.PI/2;floor.position.set(0,-.01,-3);floor.receiveShadow=true;scene.add(floor);
      addGridLines(scene,10,16,0,-3);
      addRails(scene,10,16,-.01,0x2a2155,-3);
      var colorNum=parseInt(cfg.color.replace('#','0x'));
      glowOrbs(scene,[[-4.7,.1,2.8],[4.7,.1,2.8]],colorNum);
      var particles=makeParticlePool();
      var ball=new THREE.Mesh(new THREE.SphereGeometry(.22,16,12),new THREE.MeshStandardMaterial({color:colorNum,emissive:colorNum,emissiveIntensity:.3,metalness:.25,roughness:.4}));
      ball.castShadow=true;ball.position.set(0,.3,3.6);scene.add(ball);
      var targetMesh=new THREE.Mesh(new THREE.TorusGeometry(.9,.1,10,24),new THREE.MeshStandardMaterial({color:0xffffff,emissive:colorNum,emissiveIntensity:.25,metalness:.3,roughness:.4}));
      targetMesh.position.set(0,1.1,-6);scene.add(targetMesh);
      var markerMesh=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:.6}));
      markerMesh.visible=!1;scene.add(markerMesh);
      var phase,aimT,powerT,aimVal,powerVal,round,total,flightT,flightFrom,flightTo,resultMsg,resultCol;
      var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';
      var barWrap=document.createElement('div');barWrap.style.cssText='width:100%;max-width:320px;height:18px;border-radius:9px;background:'+R.grid+';position:relative;overflow:hidden;';
      var barFill=document.createElement('div');barFill.style.cssText='position:absolute;top:0;bottom:0;width:4px;background:'+cfg.color+';border-radius:2px;';barWrap.appendChild(barFill);
      var actionBtn=document.createElement('button');actionBtn.type='button';actionBtn.style.cssText='width:100%;max-width:320px;padding:14px;border-radius:10px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;font-size:1rem;';
      function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c||R.ink}
      function updateHud(){G.hud([['ROUND',round+'/'+ROUNDS],['SCORE',total]])}
      function act(){
        if(phase==='aim'){aimVal=aimT;phase='power';actionBtn.textContent='Tap to set POWER';updateMsg('Now set your power!',cfg.color)}
        else if(phase==='power'){powerVal=powerT;launch()}
        else if(phase==='result'){nextRound()}
      }
      actionBtn.addEventListener('click',act);
      G.press=function(k){if(k===' ')act()};
      function scoreFor(aim,power){
        if(cfg.scoreMode==='distance'){
          var fair=Math.abs(aim-.5)<.32;
          if(!fair)return{pts:0,label:'Foul! Off to the side.',good:!1};
          var dist=Math.round(power*cfg.maxDistance);
          var pts=Math.round(power*100);
          return{pts:pts,label:'Distance: '+dist+' '+(cfg.unit||'m'),good:power>.7};
        }
        var aimErr=Math.abs(aim-.5)*2,powerErr=Math.abs(power-(cfg.idealPower||.5))*2;
        var err=Math.min(1,(aimErr*.6+powerErr*.4));
        var acc=1-err;
        var pts=Math.round(acc*100);
        if(acc>.92)return{pts:pts+30,label:cfg.perfectLabel||'Perfect!',good:!0};
        if(acc>.6)return{pts:pts,label:cfg.goodLabel||'Nice shot!',good:!0};
        return{pts:Math.max(0,pts),label:cfg.missLabel||'Off target.',good:!1};
      }
      function launch(){
        phase='flight';actionBtn.disabled=!0;
        var res=scoreFor(aimVal,powerVal);
        flightT=0;flightFrom=ball.position.clone();
        var lateral=(aimVal-.5)*4;
        var depth=cfg.scoreMode==='distance'?(-2-powerVal*10):-6;
        flightTo=new THREE.Vector3(lateral,cfg.scoreMode==='distance'?.25:1.1,depth);
        resultMsg=res.label;resultCol=res.good?R.green:R.coral;
        G.later(function(){
          total+=res.pts;updateHud();
          updateMsg(resultMsg+' +'+res.pts,resultCol);
          phase='result';actionBtn.disabled=!1;actionBtn.textContent=round>=ROUNDS?'See results':'Next round';
          if(res.good)burst3d(scene,particles,ball.position.x,ball.position.y+.3,ball.position.z,colorNum,18);
        },750);
      }
      function nextRound(){
        if(round>=ROUNDS){
          G.over(total,'Final score: '+total+' over '+ROUNDS+' rounds');
          return;
        }
        round++;
        ball.position.set(0,.3,3.6);
        phase='aim';aimT=0;powerT=0;actionBtn.textContent='Tap to set AIM';actionBtn.disabled=!1;
        updateMsg('Round '+round+' — set your aim!',cfg.color);updateHud();
      }
      S3.wrapDiv.appendChild(msgDiv);S3.wrapDiv.appendChild(barWrap);S3.wrapDiv.appendChild(actionBtn);
      function tick(dt){
        if(phase==='aim'){aimT+=dt*.7;if(aimT>1){aimT=1;}var s=Math.abs(((aimT*2)%2)-1);barFill.style.left=(s*(barWrap.clientWidth-6))+'px';markerMesh.visible=!0;markerMesh.position.set((s-.5)*4,1.1,-5.6)}
        else if(phase==='power'){powerT+=dt*.9;if(powerT>1)powerT=1;var s2=Math.abs(((powerT*2)%2)-1);barFill.style.left=(s2*(barWrap.clientWidth-6))+'px';}
        else if(phase==='flight'){flightT+=dt/0.75;var t2=Math.min(1,flightT);var pos=flightFrom.clone().lerp(flightTo,t2);pos.y+=Math.sin(Math.PI*t2)*1.4;ball.position.copy(pos)}
        stepParticles3d(scene,particles);
        S3.maxResizeCheck();S3.renderer.render(S3.scene,S3.camera);
      }
      G.begin(function(){
        round=0;total=0;
        ball.position.set(0,.3,3.6);
        nextRound();
        G.frame(tick);
      });
    });
  });
}
aimTarget3d('cornerKick',{title:'Corner Kick',tagline:'Curl a corner kick into the goal — lock your aim, then your power, six tries to rack up points.',color:R.green,scoreMode:'target',idealPower:.55,perfectLabel:'Top corner! Goal!',goodLabel:'Goal!',missLabel:'Saved — off target.'});
timingTap3d('freeThrowHoop',{title:'Free Throw Hoop',tagline:'Watch the marker sweep the meter and tap SHOOT the instant it hits the hot zone — six attempts.',color:R.orange,sweepSpeed:1.05,perfectLabel:'Nothing but net!',goodLabel:'Good shot!',missLabel:'Rimmed out.'});
chargeRelease3d('archeryRange',{title:'Archery Range',tagline:'Steady your aim and draw the bow — chase a perfect bullseye over six arrows.',color:R.yellow,scoreMode:'target',idealPower:.5,perfectLabel:'Bullseye!',goodLabel:'Inner ring!',missLabel:'Outer ring.'});
chargeRelease3d('horseshoePit',{title:'Horseshoe Pit',tagline:'Toss horseshoes at the stake — six throws, closest ringers win the most points.',color:R.coral,scoreMode:'target',idealPower:.6,perfectLabel:'Ringer!',goodLabel:'Close one!',missLabel:'Wide of the stake.'});
chargeRelease3d('shotPutField',{title:'Shot Put Field',tagline:'Build up power and stay in the sector for the longest put across six attempts.',color:R.blue,scoreMode:'distance',maxDistance:22,unit:'m'});

/* ================= railSport3d: lane-based paddle rally, single-player wall OR vs simple AI ================= */
function railSport3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,cfg.vsAi?'Left / Right or A / D to move your paddle — first to miss loses the point':'Left / Right or A / D to move your paddle — keep the rally alive as long as you can',function(G){
    loadGate(G.el,function(){
      var S3=setup3D(G,360,.68,0x0d1530);if(!S3)return;
      var scene=S3.scene,camera=S3.camera;
      camera.position.set(0,4.2,5.4);camera.lookAt(0,0,cfg.vsAi?-1:-2);
      var courtLen=cfg.vsAi?8:6,courtW=4;
      var floor=new THREE.Mesh(new THREE.PlaneGeometry(courtW,courtLen),new THREE.MeshStandardMaterial({color:0x1c1640,metalness:.2,roughness:.9}));
      floor.rotation.x=-Math.PI/2;floor.position.set(0,-.01,-courtLen/2+1);floor.receiveShadow=true;scene.add(floor);
      addGridLines(scene,courtW,courtLen,0,-courtLen/2+1);
      addRails(scene,courtW,courtLen,-.01,0x2a2155,-courtLen/2+1);
      var colorNum=parseInt(cfg.color.replace('#','0x'));
      var particles=makeParticlePool();
      var paddleZ=1.6,paddle=new THREE.Mesh(new THREE.BoxGeometry(.9,.3,.18),new THREE.MeshStandardMaterial({color:colorNum,emissive:colorNum,emissiveIntensity:.3,metalness:.3,roughness:.4}));
      paddle.castShadow=true;paddle.position.set(0,.2,paddleZ);scene.add(paddle);
      var aiPaddle=null,aiZ=-courtLen+2.2;
      if(cfg.vsAi){aiPaddle=new THREE.Mesh(new THREE.BoxGeometry(.9,.3,.18),new THREE.MeshStandardMaterial({color:0xff6b4a,emissive:0xff6b4a,emissiveIntensity:.3,metalness:.3,roughness:.4}));aiPaddle.castShadow=true;aiPaddle.position.set(0,.2,aiZ);scene.add(aiPaddle)}
      else{var wall=new THREE.Mesh(new THREE.BoxGeometry(courtW,1,.2),new THREE.MeshStandardMaterial({color:0x241c47}));wall.position.set(0,.5,-courtLen+1.5);scene.add(wall)}
      var ball=new THREE.Mesh(new THREE.SphereGeometry(.14,14,10),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:.2,metalness:.2,roughness:.3}));
      ball.castShadow=true;scene.add(ball);
      var px,vx,vz,score,lives,ended,speed,msgDiv;
      var halfW=courtW/2-.5;
      msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';
      function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c||R.ink}
      function updateHud(){G.hud(cfg.vsAi?[['YOU',score],['HOUSE',lives]]:[['HITS',score],['LIVES',lives]])}
      function resetBall(towardAi){
        ball.position.set(px,.24,paddleZ-.3);
        vx=(Math.random()-.5)*1.4;
        vz=towardAi?-speed:-speed;
      }
      function endGame(win){
        ended=!0;
        if(cfg.vsAi){
          updateMsg(win?'You win the rally!':'House wins the rally.',win?R.green:R.coral);
          G.later(function(){G.over(win?150+score*5:score*5,'Final: you '+score+' · house '+lives,win?'You Win!':'Game Over')},700);
        }else{
          updateMsg('Missed! Final hits: '+score,R.coral);
          G.later(function(){G.over(score*8,'You kept the rally alive for '+score+' hits.')},700);
        }
      }
      var btnRow=document.createElement('div');btnRow.style.cssText='display:flex;gap:10px;width:100%;max-width:300px;';
      var leftBtn=document.createElement('button');leftBtn.type='button';leftBtn.textContent='◀';leftBtn.style.cssText='flex:1;padding:14px;border-radius:10px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;';
      var rightBtn=document.createElement('button');rightBtn.type='button';rightBtn.textContent='▶';rightBtn.style.cssText='flex:1;padding:14px;border-radius:10px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;';
      var heldDir=0;
      leftBtn.addEventListener('pointerdown',function(){heldDir=-1});rightBtn.addEventListener('pointerdown',function(){heldDir=1});
      ['pointerup','pointerleave','pointercancel'].forEach(function(ev){leftBtn.addEventListener(ev,function(){if(heldDir===-1)heldDir=0});rightBtn.addEventListener(ev,function(){if(heldDir===1)heldDir=0})});
      btnRow.appendChild(leftBtn);btnRow.appendChild(rightBtn);
      G.pad([['◀','ArrowLeft'],['▶','ArrowRight']]);
      S3.wrapDiv.appendChild(msgDiv);S3.wrapDiv.appendChild(btnRow);
      function tick(dt){
        if(!ended){
          var dir=G.ax()||heldDir;
          px=clamp(px+dir*4.4*dt,-halfW,halfW);
          paddle.position.x=px;
          if(aiPaddle){
            var target=ball.position.x;
            aiPaddle.position.x+=clamp(target-aiPaddle.position.x,-cfg.aiSpeed*dt,cfg.aiSpeed*dt);
            aiPaddle.position.x=clamp(aiPaddle.position.x,-halfW,halfW);
          }
          ball.position.x+=vx*dt;ball.position.z+=vz*dt;
          if(ball.position.x>halfW||ball.position.x<-halfW){vx=-vx;ball.position.x=clamp(ball.position.x,-halfW,halfW)}
          if(vz<0&&aiPaddle&&ball.position.z<=aiZ+.3&&ball.position.z>aiZ-.3){
            if(Math.abs(ball.position.x-aiPaddle.position.x)<.6){vz=-vz;vx+=(Math.random()-.5)*.6;speed=Math.min(cfg.maxSpeed,speed+.08);ball.position.z=aiZ+.3}
            else{score++;updateHud();speed=cfg.startSpeed;burst3d(scene,particles,ball.position.x,ball.position.y,ball.position.z,colorNum,14);resetBall(!1);updateMsg('Point!',R.green);}
          } else if(!aiPaddle&&vz<0&&ball.position.z<=-courtLen+1.8){
            vz=-vz;ball.position.z=-courtLen+1.8;score++;speed=Math.min(cfg.maxSpeed,speed+.1);updateHud();
          }
          if(vz>0&&ball.position.z>=paddleZ-.25&&ball.position.z<=paddleZ+.1){
            if(Math.abs(ball.position.x-px)<.65){vz=-vz;vx+=(Math.random()-.5)*.6;ball.position.z=paddleZ-.25;if(aiPaddle){} }
            else{
              if(aiPaddle){lives--;updateHud();if(lives<=0){endGame(!1);return}resetBall(!0)}
              else{lives--;updateHud();if(lives<=0){endGame();return}resetBall(!1)}
            }
          }
          if(aiPaddle&&score>=11){endGame(!0);return}
        }
        stepParticles3d(scene,particles);
        S3.maxResizeCheck();S3.renderer.render(S3.scene,S3.camera);
      }
      G.begin(function(){
        px=0;score=0;lives=cfg.vsAi?5:3;ended=!1;speed=cfg.startSpeed;
        paddle.position.x=0;if(aiPaddle)aiPaddle.position.x=0;
        resetBall(!1);
        updateMsg(cfg.vsAi?'Rally to 11!':'Keep it alive!',cfg.color);updateHud();
        G.frame(tick);
      });
    });
  });
}
railSport3d('squashWall',{title:'Squash Wall',tagline:'Rally against the back wall solo — the ball speeds up with every return.',color:R.teal,vsAi:!1,startSpeed:3.4,maxSpeed:8});
volleyTiming3d('badmintonRally',{title:'Badminton Rally',tagline:'Tap LEFT / CENTER / RIGHT the instant the shuttle is in that zone to return it — first to 11 wins the match.',color:R.magenta,houseSkill:.6,startSpeed:.5});

/* ================= chargeRelease3d: hold to charge power while steering aim live, release to shoot ================= */
function chargeRelease3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Hold SPACE (or the button) to charge power, steer with Left/Right while charging, release to shoot · 6 rounds',function(G){
    var ROUNDS=6;
    var wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:12px;align-items:center;width:100%;max-width:360px;margin:0 auto;';G.el.appendChild(wrap);
    var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';wrap.appendChild(msgDiv);
    var aimWrap=document.createElement('div');aimWrap.style.cssText='width:100%;height:14px;border-radius:7px;background:'+R.grid+';position:relative;overflow:hidden;';
    var aimFill=document.createElement('div');aimFill.style.cssText='position:absolute;top:0;bottom:0;width:4px;background:#fff;border-radius:2px;left:50%;';aimWrap.appendChild(aimFill);
    var powerWrap=document.createElement('div');powerWrap.style.cssText='width:100%;height:18px;border-radius:9px;background:'+R.grid+';position:relative;overflow:hidden;';
    var powerFill=document.createElement('div');powerFill.style.cssText='position:absolute;left:0;top:0;bottom:0;width:0%;background:'+cfg.color+';border-radius:9px;';powerWrap.appendChild(powerFill);
    wrap.appendChild(aimWrap);wrap.appendChild(powerWrap);
    var holdBtn=document.createElement('button');holdBtn.type='button';holdBtn.textContent='HOLD TO CHARGE';holdBtn.style.cssText='width:100%;padding:14px;border-radius:10px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;font-size:1rem;';wrap.appendChild(holdBtn);
    var steerRow=document.createElement('div');steerRow.style.cssText='display:flex;gap:10px;width:100%;';
    var leftBtn=document.createElement('button');leftBtn.type='button';leftBtn.textContent='◀ AIM';leftBtn.style.cssText='flex:1;padding:10px;border-radius:8px;border:none;background:'+R.grid+';color:'+R.ink+';font-weight:700;cursor:pointer;';
    var rightBtn=document.createElement('button');rightBtn.type='button';rightBtn.textContent='AIM ▶';rightBtn.style.cssText='flex:1;padding:10px;border-radius:8px;border:none;background:'+R.grid+';color:'+R.ink+';font-weight:700;cursor:pointer;';
    steerRow.appendChild(leftBtn);steerRow.appendChild(rightBtn);wrap.appendChild(steerRow);
    var aimVal,chargeT,powerVal,charging,round,total,steerDir,ended;
    function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c||R.ink}
    function updateHud(){G.hud([['ROUND',round+'/'+ROUNDS],['SCORE',total]])}
    function scoreFor(aim,pw){
      if(cfg.scoreMode==='distance'){
        var fair=Math.abs(aim-.5)<.32;
        if(!fair)return{pts:0,label:'Foul! Off to the side.',good:!1};
        var dist=Math.round(pw*cfg.maxDistance);
        return{pts:Math.round(pw*100),label:'Distance: '+dist+' '+(cfg.unit||'m'),good:pw>.7};
      }
      var aimErr=Math.abs(aim-.5)*2,powerErr=Math.abs(pw-(cfg.idealPower||.5))*2;
      var err=Math.min(1,(aimErr*.6+powerErr*.4));
      var acc=1-err,pts=Math.round(acc*100);
      if(acc>.92)return{pts:pts+30,label:cfg.perfectLabel||'Perfect!',good:!0};
      if(acc>.6)return{pts:pts,label:cfg.goodLabel||'Nice shot!',good:!0};
      return{pts:Math.max(0,pts),label:cfg.missLabel||'Off target.',good:!1};
    }
    function startCharge(){if(ended||charging)return;charging=!0;chargeT=0;powerVal=0;holdBtn.textContent='RELEASE TO SHOOT!'}
    function release(){
      if(ended||!charging)return;
      charging=!1;var res=scoreFor(aimVal,powerVal);
      holdBtn.textContent='…';holdBtn.disabled=!0;
      G.later(function(){
        total+=res.pts;updateHud();updateMsg(res.label+' +'+res.pts,res.good?R.green:R.coral);
        G.later(nextRound,650);
      },300);
    }
    holdBtn.addEventListener('pointerdown',startCharge);
    ['pointerup','pointerleave','pointercancel'].forEach(function(ev){holdBtn.addEventListener(ev,release)});
    leftBtn.addEventListener('pointerdown',function(){steerDir=-1});rightBtn.addEventListener('pointerdown',function(){steerDir=1});
    ['pointerup','pointerleave','pointercancel'].forEach(function(ev){leftBtn.addEventListener(ev,function(){if(steerDir===-1)steerDir=0});rightBtn.addEventListener(ev,function(){if(steerDir===1)steerDir=0})});
    G.press=function(k){if(k===' ')startCharge();else if(k==='ArrowLeft')steerDir=-1;else if(k==='ArrowRight')steerDir=1};
    G.on(document,'keyup',function(e){if(e.key===' ')release();else if(e.key==='ArrowLeft'&&steerDir===-1)steerDir=0;else if(e.key==='ArrowRight'&&steerDir===1)steerDir=0});
    function nextRound(){
      if(round>=ROUNDS){G.over(total,'Final score: '+total+' over '+ROUNDS+' rounds');return}
      round++;aimVal=.5;chargeT=0;powerVal=0;charging=!1;steerDir=0;holdBtn.disabled=!1;holdBtn.textContent='HOLD TO CHARGE';
      updateMsg('Round '+round+' — hold to charge, steer to aim!',cfg.color);updateHud();
    }
    function tick(dt){
      aimVal=clamp(aimVal+steerDir*dt*.6,0,1);
      aimFill.style.left=(aimVal*100)+'%';
      if(charging){
        chargeT+=dt*.8;
        var cyc=chargeT%2;
        powerVal=cyc<1?cyc:2-cyc;
        powerFill.style.width=(powerVal*100)+'%';
      }
    }
    G.begin(function(){round=0;total=0;steerDir=0;nextRound();G.frame(tick)})
  });
}

/* ================= timingTap3d: a marker sweeps a meter, tap SHOOT to time it into the hot zone ================= */
function timingTap3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Tap SHOOT (or SPACE) when the marker lines up with the glowing zone · 6 attempts',function(G){
    var ROUNDS=6;
    var wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:12px;align-items:center;width:100%;max-width:360px;margin:0 auto;';G.el.appendChild(wrap);
    var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';wrap.appendChild(msgDiv);
    var barWrap=document.createElement('div');barWrap.style.cssText='width:100%;height:28px;border-radius:14px;background:'+R.grid+';position:relative;overflow:hidden;';
    var zoneDiv=document.createElement('div');zoneDiv.style.cssText='position:absolute;top:0;bottom:0;background:rgba(255,255,255,.22);border-radius:8px;';barWrap.appendChild(zoneDiv);
    var marker=document.createElement('div');marker.style.cssText='position:absolute;top:0;bottom:0;width:4px;background:#fff;border-radius:2px;left:0%;';barWrap.appendChild(marker);
    wrap.appendChild(barWrap);
    var shootBtn=document.createElement('button');shootBtn.type='button';shootBtn.textContent='SHOOT';shootBtn.style.cssText='width:100%;padding:14px;border-radius:10px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;font-size:1rem;';wrap.appendChild(shootBtn);
    var t,dir,round,total,ended,speed,zoneCenter,zoneHalf;
    function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c||R.ink}
    function updateHud(){G.hud([['ATTEMPT',round+'/'+ROUNDS],['SCORE',total]])}
    function shoot(){
      if(ended||shootBtn.disabled)return;
      var dist=Math.abs(t-zoneCenter)/zoneHalf;
      var res;
      if(dist<=.35)res={pts:130,label:cfg.perfectLabel||'Perfect!',good:!0};
      else if(dist<=1)res={pts:70,label:cfg.goodLabel||'Nice shot!',good:!0};
      else res={pts:0,label:cfg.missLabel||'Off target.',good:!1};
      shootBtn.disabled=!0;
      total+=res.pts;updateHud();updateMsg(res.label+' +'+res.pts,res.good?R.green:R.coral);
      G.later(nextRound,750);
    }
    shootBtn.addEventListener('pointerdown',shoot);
    G.press=function(k){if(k===' ')shoot()};
    function nextRound(){
      if(round>=ROUNDS){G.over(total,'Final score: '+total+' over '+ROUNDS+' attempts');return}
      round++;t=0;dir=1;shootBtn.disabled=!1;
      speed=(cfg.sweepSpeed||1.1)+round*.06;
      zoneHalf=.16;zoneCenter=.3+Math.random()*.4;
      zoneDiv.style.left=((zoneCenter-zoneHalf)*100)+'%';zoneDiv.style.width=(zoneHalf*2*100)+'%';
      updateMsg('Attempt '+round+' — time it!',cfg.color);updateHud();
    }
    function tick(dt){
      if(ended||shootBtn.disabled)return;
      t+=dir*speed*dt;
      if(t>1){t=1;dir=-1}else if(t<0){t=0;dir=1}
      marker.style.left=(t*100)+'%';
    }
    G.begin(function(){round=0;total=0;ended=!1;nextRound();G.frame(tick)})
  });
}

/* ================= volleyTiming3d: pick a zone to time your swing as the shuttle sweeps across ================= */
function volleyTiming3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Tap LEFT / CENTER / RIGHT the instant the shuttle is in that zone to return it · first to 11',function(G){
    var wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-direction:column;gap:12px;align-items:center;width:100%;max-width:360px;margin:0 auto;';G.el.appendChild(wrap);
    var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';wrap.appendChild(msgDiv);
    var barWrap=document.createElement('div');barWrap.style.cssText='width:100%;height:30px;border-radius:15px;background:'+R.grid+';position:relative;overflow:hidden;';
    var z1=document.createElement('div');z1.style.cssText='position:absolute;left:0;top:0;bottom:0;width:33.33%;border-right:1px solid rgba(255,255,255,.15);';barWrap.appendChild(z1);
    var z2=document.createElement('div');z2.style.cssText='position:absolute;left:33.33%;top:0;bottom:0;width:33.34%;border-right:1px solid rgba(255,255,255,.15);';barWrap.appendChild(z2);
    var shuttle=document.createElement('div');shuttle.style.cssText='position:absolute;top:7px;bottom:7px;width:14px;border-radius:7px;background:#fff;left:0%;';barWrap.appendChild(shuttle);
    wrap.appendChild(barWrap);
    var row=document.createElement('div');row.style.cssText='display:flex;gap:8px;width:100%;';
    var ZONES=['LEFT','CENTER','RIGHT'];
    ZONES.forEach(function(z,i){var b=document.createElement('button');b.type='button';b.textContent=z;b.style.cssText='flex:1;padding:14px;border-radius:10px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;';b.addEventListener('pointerdown',function(){trySwing(i)});row.appendChild(b)});
    wrap.appendChild(row);
    var pos,dir,speed,you,house,ended,resolved;
    function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c||R.ink}
    function updateHud(){G.hud([['YOU',you],['HOUSE',house]])}
    function zoneOf(p){return p<1/3?0:p<2/3?1:2}
    function endGame(win){
      ended=!0;
      updateMsg(win?'You win the rally!':'House wins the rally.',win?R.green:R.coral);
      G.later(function(){G.over(win?150+you*5:you*5,'Final: you '+you+' · house '+house,win?'You Win!':'Game Over')},700);
    }
    function endPoint(youWin){
      resolved=!0;
      if(youWin){you++;updateMsg('Point!',R.green)}else{house++;updateMsg('House point.',R.coral)}
      updateHud();
      if(you>=11){endGame(!0);return}
      if(house>=11){endGame(!1);return}
      G.later(nextVolley,600);
    }
    function trySwing(i){
      if(ended||resolved)return;
      var cz=zoneOf(pos);
      if(cz===i){
        resolved=!0;
        var houseOk=Math.random()<(cfg.houseSkill||.58);
        G.later(function(){
          if(houseOk){resolved=!1;updateMsg('House returns it!',R.ink);G.later(nextVolley,350)}
          else endPoint(!0);
        },280);
      } else {
        endPoint(!1);
      }
    }
    function nextVolley(){
      if(ended)return;
      pos=0;dir=1;resolved=!1;speed=(cfg.startSpeed||.5)+Math.min(you,house)*.03;
      updateMsg('Watch the shuttle…',cfg.color);
    }
    function tick(dt){
      if(ended||resolved)return;
      pos+=dir*speed*dt;
      if(pos>1){endPoint(!1);return}
      shuttle.style.left=(pos*100)+'%';
    }
    G.press=function(k){if(k==='ArrowLeft')trySwing(0);else if(k==='ArrowRight')trySwing(2);else if(k===' '||k==='ArrowDown')trySwing(1)};
    G.begin(function(){you=0;house=0;ended=!1;resolved=!1;nextVolley();G.frame(tick)})
  });
}

}
})();
