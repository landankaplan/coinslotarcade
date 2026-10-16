(function(){
'use strict';
var prev=window.CSA_EXT;
window.CSA_EXT=function(K){
  if(prev)prev(K);
  try{boardStrategy14(K)}catch(e){console.error(e)}
};

function boardStrategy14(K){
'use strict';
var g=K.g,M=K.M,R=K.R;
var CAT='Board & Strategy';
var ICON=String('<svg viewBox=#0 0 24 24# fill=#none# stroke=#currentColor# stroke-width=#2# stroke-linecap=#round# stroke-linejoin=#round#><rect x=#4# y=#4# width=#16# height=#16# rx=#3#/><circle cx=#12# cy=#12# r=#3#/></svg>').split('#').join(String.fromCharCode(39));

function rnd(n){return Math.floor(Math.random()*n)}
function pick(a){return a[rnd(a.length)]}
function clamp(v,a,b){return v<a?a:v>b?b:v}
function padnum(n){return String(Math.floor(n)).padStart(4,'0')}

/* local 3D loader -- window.THREE is a true global, independent of g01-g12's own loader */
var THREE3D_loading=false,THREE3D_queue=[];
function loadScript(src,cb){var s=document.createElement('script');s.src=src;s.onload=function(){cb(null)};s.onerror=function(){cb(new Error('load fail: '+src))};document.head.appendChild(s)}
function load3DLibs(done){if(window.THREE){done();return}if(THREE3D_loading){THREE3D_queue.push(done);return}THREE3D_loading=true;loadScript('/three.min.js',function(err){THREE3D_loading=false;var q=THREE3D_queue;THREE3D_queue=[];done(err);q.forEach(function(fn){fn(err)})})}
function loadGate(el,startFn){var msg=document.createElement('div');msg.style.cssText='padding:40px;text-align:center;color:'+R.dim+';font-weight:600;';msg.textContent='Loading 3D engine…';el.appendChild(msg);load3DLibs(function(err){if(msg&&msg.parentNode)msg.parentNode.removeChild(msg);if(err){var fail=document.createElement('div');fail.style.cssText='padding:40px;text-align:center;color:'+R.coral+';font-weight:600;';fail.textContent='3D engine failed to load.';el.appendChild(fail);return}startFn()})}
function makeRenderer(){var r2;try{r2=new THREE.WebGLRenderer({antialias:true,alpha:false})}catch(e){return null}r2.setPixelRatio(Math.min(window.devicePixelRatio||1,2));return r2}
function disposeThree(obj){if(!obj)return;if(obj.geometry)obj.geometry.dispose();if(obj.material){if(Array.isArray(obj.material))obj.material.forEach(function(m){m.dispose()});else obj.material.dispose()}}

/* ================= shared scene-dressing helpers (same technique as the site's own Snake/Brick Blitz
   games: grid-line floor overlay, boxed rail framing, shadow-casting light, emissive glow accents, and
   real 3D sphere particle bursts) so these games read as part of the same arcade look. ================= */
function addGridLines(scene3d,w,d,y){var gridMat=new THREE.LineBasicMaterial({color:0x241c47,transparent:true,opacity:.75});var pts=[],hw=w/2,hd=d/2,gx,gz;for(gx=-hw;gx<=hw+.001;gx++)pts.push(gx,y,-hd,gx,y,hd);for(gz=-hd;gz<=hd+.001;gz++)pts.push(-hw,y,gz,hw,y,gz);var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));var ls=new THREE.LineSegments(geo,gridMat);scene3d.add(ls);return ls}
function addFloor(scene3d,w,d,y,colorHex){var floor=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshStandardMaterial({color:colorHex!==undefined?colorHex:0x1c1640,roughness:.95}));floor.rotation.x=-Math.PI/2;floor.position.y=y;floor.receiveShadow=true;scene3d.add(floor);return floor}
function addRails(scene3d,w,d,y,colorHex){var wallMat=new THREE.MeshStandardMaterial({color:colorHex!==undefined?colorHex:0x2a2155,roughness:.8});var hw=w/2,hd=d/2;var r1=new THREE.Mesh(new THREE.BoxGeometry(w+.6,.4,.2),wallMat);r1.position.set(0,y+.2,-hd-.1);scene3d.add(r1);var r2=r1.clone();r2.material=wallMat;r2.position.z=hd+.1;scene3d.add(r2);var r3=new THREE.Mesh(new THREE.BoxGeometry(.2,.4,d+.6),wallMat);r3.position.set(-hw-.1,y+.2,0);scene3d.add(r3);var r4=r3.clone();r4.material=wallMat;r4.position.x=hw+.1;scene3d.add(r4);return[r1,r2,r3,r4]}
function glowOrbs(scene3d,ptsArr,colorNum){var arr=[];ptsArr.forEach(function(p){var m=new THREE.Mesh(new THREE.SphereGeometry(.14,12,10),new THREE.MeshStandardMaterial({color:colorNum,emissive:colorNum,emissiveIntensity:.5,roughness:.4}));m.position.set(p[0],p[1],p[2]);scene3d.add(m);arr.push(m)});return arr}
function makeParticlePool(){return[]}
function burst3d(scene3d,pool,x,y,z,color,n){var c=new THREE.Color(color);for(var i=0;i<(n||16);i++){var mat=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:1});var mesh=new THREE.Mesh(new THREE.SphereGeometry(.09,6,6),mat);mesh.position.set(x,y,z);scene3d.add(mesh);var a=Math.random()*Math.PI*2,sp=.06+Math.random()*.14;pool.push({mesh:mesh,vx:Math.cos(a)*sp,vy:.1+Math.random()*.1,vz:Math.sin(a)*sp,life:1})}}
function stepParticles3d(scene3d,pool){for(var i=pool.length-1;i>=0;i--){var p=pool[i];p.vy-=.012;p.mesh.position.x+=p.vx;p.mesh.position.y+=p.vy;p.mesh.position.z+=p.vz;p.life-=.035;p.mesh.material.opacity=Math.max(0,p.life);if(p.life<=0){scene3d.remove(p.mesh);disposeThree(p.mesh);pool.splice(i,1)}}}
function enableShadows(renderer3d,sun){renderer3d.shadowMap.enabled=true;sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.near=1;sun.shadow.camera.far=30;sun.shadow.camera.left=-8;sun.shadow.camera.right=8;sun.shadow.camera.top=8;sun.shadow.camera.bottom=-8}

/* mount-API kit, mirroring edu.js's kit()/def() and g13.js's -- the proven working pattern */
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

/* shared 3D scaffold: scene/camera/renderer + resize, used by all three engines below */
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

/* ================= dropConnect3d: Connect-N drop game, vertical 3D grid, DOM column buttons ================= */
function dropConnect3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Click a column button (or press 1-'+cfg.cols+') to drop a piece · get '+cfg.winLen+' in a row to win',function(G){
    loadGate(G.el,function(){
      var ROWS=cfg.rows,COLS=cfg.cols,WIN=cfg.winLen;
      var S3=setup3D(G,400,1.05,0x0d1530);if(!S3)return;
      var scene=S3.scene,camera=S3.camera;
      camera.position.set(0,ROWS*.68,COLS*.98);camera.lookAt(0,ROWS*.36,0);
      var frame=new THREE.Mesh(new THREE.BoxGeometry(COLS*.92+.3,ROWS*.92+.3,.18),new THREE.MeshStandardMaterial({color:0x241c47}));
      frame.position.set(0,ROWS*.46,-.3);frame.receiveShadow=true;scene.add(frame);
      var colorNum0=parseInt(cfg.color.replace('#','0x'));
      var fhw=COLS*.46+.15,ftop=ROWS*.92+.15,fbot=-.15;
      var standFloor=new THREE.Mesh(new THREE.PlaneGeometry(COLS*1.3+3,3),new THREE.MeshStandardMaterial({color:0x1c1640,roughness:.95}));
      standFloor.rotation.x=-Math.PI/2;standFloor.position.set(0,fbot-.02,.9);standFloor.receiveShadow=true;scene.add(standFloor);
      (function(){var gridMat=new THREE.LineBasicMaterial({color:0x3a2f78,transparent:true,opacity:.9});var pts=[],hw=(COLS*1.3+3)/2,z0=.9-1.5,z1=.9+1.5,gx,gz;for(gx=-hw;gx<=hw+.001;gx+=.85)pts.push(gx,fbot-.01,z0,gx,fbot-.01,z1);for(gz=z0;gz<=z1+.001;gz+=.85)pts.push(-hw,fbot-.01,gz,hw,fbot-.01,gz);var geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));scene.add(new THREE.LineSegments(geo,gridMat))})();
      glowOrbs(scene,[[-fhw,ftop,-.25],[fhw,ftop,-.25],[-fhw,fbot,-.25],[fhw,fbot,-.25]],colorNum0);
      var particles=makeParticlePool();
      var p1Col=colorNum0,p2Col=0xff6b4a;
      var board,turn,ended,moves,pieceMeshes,dropping,turnDeadline;
      function cellX(c){return(c-(COLS-1)/2)*.92}
      function cellY(r){return(ROWS-1-r)*.92+.46}
      function makePiece(colorNum){var m=new THREE.Mesh(new THREE.SphereGeometry(.38,20,16),new THREE.MeshStandardMaterial({color:colorNum,emissive:colorNum,emissiveIntensity:.2,metalness:.25,roughness:.5}));m.castShadow=true;scene.add(m);return m}
      function legalCols(){var a=[];for(var c=0;c<COLS;c++)if(board[0][c]===0)a.push(c);return a}
      function dropRow(c){for(var r=ROWS-1;r>=0;r--)if(board[r][c]===0)return r;return -1}
      function checkWin(b,who){
        var dirs=[[0,1],[1,0],[1,1],[1,-1]];
        for(var r=0;r<ROWS;r++)for(var c=0;c<COLS;c++){
          if(b[r][c]!==who)continue;
          for(var d=0;d<4;d++){
            var dr=dirs[d][0],dc=dirs[d][1],cnt=1;
            for(var k=1;k<WIN;k++){var rr=r+dr*k,cc=c+dc*k;if(rr<0||rr>=ROWS||cc<0||cc>=COLS||b[rr][cc]!==who)break;cnt++}
            if(cnt>=WIN)return true;
          }
        }
        return false;
      }
      function boardFull(){for(var c=0;c<COLS;c++)if(board[0][c]===0)return false;return true}
      function place(c,who,cb){
        var r=dropRow(c);if(r<0)return false;
        board[r][c]=who;
        var mesh=makePiece(who===1?p1Col:p2Col);mesh.position.set(cellX(c),ROWS*.7+1.5,0);
        pieceMeshes.push(mesh);
        dropping={mesh:mesh,targetY:cellY(r),vy:0};
        G.later(function(){if(cb)cb(r)},10);
        return true;
      }
      function aiMove(){
        var cols=legalCols();if(!cols.length)return;
        var c,r;
        for(c=0;c<COLS;c++){r=dropRow(c);if(r<0)continue;board[r][c]=2;if(checkWin(board,2)){board[r][c]=0;place(c,2,afterAiMove);return}board[r][c]=0}
        for(c=0;c<COLS;c++){r=dropRow(c);if(r<0)continue;board[r][c]=1;if(checkWin(board,1)){board[r][c]=0;place(c,2,afterAiMove);return}board[r][c]=0}
        var center=(COLS-1)/2,best=cols[0],bestScore=-1;
        cols.forEach(function(cc){var sc=10-Math.abs(cc-center)+Math.random()*2;if(sc>bestScore){bestScore=sc;best=cc}});
        place(best,2,afterAiMove);
      }
      function afterAiMove(){
        if(checkWin(board,2)){ended=!0;updateMsg('The house wins. Try again!',R.coral);burst3d(scene,particles,0,ROWS*.5,0,0xff6b4a,22);G.later(function(){G.over(moves*5,'The house connected '+WIN+'. Moves: '+moves)},900);return}
        if(boardFull()){ended=!0;updateMsg('Board full — draw.',R.dim);G.later(function(){G.over(50+moves*5,'Draw after '+moves+' moves')},900);return}
        turn=1;if(cfg.timed)turnDeadline=performance.now()+8000;updateMsg('Your turn',cfg.color);updateHud();refreshButtons();
      }
      var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';
      function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c}
      function updateHud(){var h=[['MOVES',moves],['TURN',turn===1?'You':'House']];if(cfg.timed&&turn===1&&!ended)h.push(['TIME',Math.max(0,Math.ceil((turnDeadline-performance.now())/1000))+'s']);G.hud(h)}
      var btnRow=document.createElement('div');btnRow.style.cssText='display:flex;gap:6px;width:100%;max-width:360px;flex-wrap:wrap;justify-content:center;';
      var colBtns=[];
      for(var ci=0;ci<COLS;ci++){(function(c){var b=document.createElement('button');b.type='button';b.textContent=String(c+1);b.style.cssText='flex:1;min-width:28px;padding:10px 0;border-radius:8px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;';b.addEventListener('click',function(){userMove(c)});btnRow.appendChild(b);colBtns.push(b)})(ci)}
      function refreshButtons(){colBtns.forEach(function(b,c){b.disabled=ended||turn!==1||board[0][c]!==0;b.style.opacity=b.disabled?'.4':'1'})}
      function userMove(c){
        if(ended||turn!==1||dropping)return;
        if(!place(c,1,function(){
          if(checkWin(board,1)){ended=!0;updateMsg('You win!',R.green);burst3d(scene,particles,0,ROWS*.5,0,0x3ddc97,28);G.later(function(){G.over(100+moves*5,'You connected '+WIN+' in '+moves+' moves!','You Win!')},900);return}
          if(boardFull()){ended=!0;updateMsg('Board full — draw.',R.dim);G.later(function(){G.over(50+moves*5,'Draw after '+moves+' moves')},900);return}
          moves++;turn=2;updateMsg('House thinking…',R.dim);updateHud();refreshButtons();G.later(aiMove,500);
        }))return;
        refreshButtons();
      }
      G.press=function(k){var n=parseInt(k,10);if(!isNaN(n)&&n>=1&&n<=COLS)userMove(n-1)};
      S3.wrapDiv.appendChild(msgDiv);S3.wrapDiv.appendChild(btnRow);
      function tick(dt){
        if(dropping){dropping.vy+=dt*9;dropping.mesh.position.y-=dropping.vy;if(dropping.mesh.position.y<=dropping.targetY){dropping.mesh.position.y=dropping.targetY;dropping=null}}
        if(cfg.timed&&turn===1&&!ended&&!dropping){
          updateHud();
          if(performance.now()>=turnDeadline){var legal=legalCols();if(legal.length)userMove(legal[rnd(legal.length)])}
        }
        stepParticles3d(scene,particles);
        S3.maxResizeCheck();
        S3.renderer.render(S3.scene,S3.camera);
      }
      G.begin(function(){
        board=[];for(var r=0;r<ROWS;r++){var row=[];for(var c=0;c<COLS;c++)row.push(0);board.push(row)}
        pieceMeshes&&pieceMeshes.forEach(function(m){scene.remove(m);disposeThree(m)});
        pieceMeshes=[];turn=1;ended=!1;moves=0;dropping=null;if(cfg.timed)turnDeadline=performance.now()+8000;
        updateMsg('Your turn',cfg.color);updateHud();refreshButtons();
        G.frame(tick);
      });
    });
  });
}
dropConnect3d('skylineDrop',{title:'Skyline Drop',tagline:'Drop pieces down a city-grid shaft and line up four before the house does.',color:R.blue,cols:7,rows:6,winLen:4});
dropConnect3d('coralDrop',{title:'Coral Drop',tagline:'Stack coral pegs in a reef column grid — four in a row wins the tide.',color:R.teal,cols:7,rows:6,winLen:4});
dropConnect3d('emberDrop',{title:'Ember Drop',tagline:'Drop glowing embers down a forge grid, chain four to win the round.',color:R.coral,cols:6,rows:5,winLen:4});
dropConnect3d('orchardDrop',{title:'Orchard Drop',tagline:'Drop seeds down tall rows and line up five to win the harvest — you only get 8 seconds a turn.',color:R.green,cols:8,rows:6,winLen:5,timed:!0});
dropConnect3d('nebulaDrop',{title:'Nebula Drop',tagline:'Drop star-cores down a cosmic shaft — connect three on this compact grid, 8 seconds a turn.',color:R.violet,cols:5,rows:5,winLen:3,timed:!0});

/* ================= flipGrid3d: Reversi/Othello-style disc flip, DOM grid + 3D disc visualization ================= */
function flipGrid3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Click a highlighted cell to flip the discs between it and your other discs',function(G){
    loadGate(G.el,function(){
      var N=cfg.size;
      var S3=setup3D(G,360,.62,0x0d1530);if(!S3)return;
      var scene=S3.scene,camera=S3.camera;
      camera.position.set(0,N*.95,N*.78);camera.lookAt(0,0,0);
      var boardMesh=new THREE.Mesh(new THREE.BoxGeometry(N*.86,.16,N*.86),new THREE.MeshStandardMaterial({color:0x0f1a38,metalness:.2,roughness:.85}));
      boardMesh.position.y=-.1;boardMesh.receiveShadow=true;scene.add(boardMesh);
      var p1Col=parseInt(cfg.color.replace('#','0x')),p2Col=0xff6b4a;
      addGridLines(scene,N*.86,N*.86,-.015);
      addRails(scene,N*.86,N*.86,-.1,0x2a2155);
      glowOrbs(scene,[[-N*.43,.02,-N*.43],[N*.43,.02,-N*.43],[-N*.43,.02,N*.43],[N*.43,.02,N*.43]],p1Col);
      var particles=makeParticlePool();
      var board,turn,ended,discMeshes,turnDeadline;
      function cellPos(r,c){return[(c-(N-1)/2)*.82,(r-(N-1)/2)*.82]}
      function makeDisc(r,c,who){var dc=who===1?p1Col:p2Col;var m=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.12,20),new THREE.MeshStandardMaterial({color:dc,emissive:dc,emissiveIntensity:.2,metalness:.3,roughness:.4}));var xz=cellPos(r,c);m.position.set(xz[0],.06,xz[1]);m.castShadow=true;scene.add(m);discMeshes[r][c]=m;return m}
      var DIRS=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
      function inB(r,c){return r>=0&&r<N&&c>=0&&c<N}
      function flipsFor(b,r,c,who){
        if(b[r][c]!==0)return[];
        var opp=who===1?2:1,all=[];
        DIRS.forEach(function(d){
          var rr=r+d[0],cc=c+d[1],line=[];
          while(inB(rr,cc)&&b[rr][cc]===opp){line.push([rr,cc]);rr+=d[0];cc+=d[1]}
          if(inB(rr,cc)&&b[rr][cc]===who&&line.length)all=all.concat(line);
        });
        return all;
      }
      function legalMoves(who){var out=[];for(var r=0;r<N;r++)for(var c=0;c<N;c++)if(board[r][c]===0&&flipsFor(board,r,c,who).length)out.push([r,c]);return out}
      function applyMove(r,c,who){var fl=flipsFor(board,r,c,who);board[r][c]=who;fl.forEach(function(p){board[p[0]][p[1]]=who});return fl}
      function score(who){var s=0;for(var r=0;r<N;r++)for(var c=0;c<N;c++)if(board[r][c]===who)s++;return s}
      function syncMeshes(changed){
        changed.forEach(function(p){var r=p[0],c=p[1];var old=discMeshes[r][c];if(old){scene.remove(old);disposeThree(old)}makeDisc(r,c,board[r][c])});
      }
      var gridDiv=document.createElement('div');gridDiv.style.cssText='display:grid;grid-template-columns:repeat('+N+',1fr);gap:3px;width:100%;max-width:300px;margin:0 auto;';
      var cellBtns=[];
      for(var r0=0;r0<N;r0++){cellBtns.push([]);for(var c0=0;c0<N;c0++){(function(r,c){var b=document.createElement('button');b.type='button';b.style.cssText='aspect-ratio:1;border-radius:5px;border:1px solid '+R.grid+';background:'+R.bg+';cursor:pointer;position:relative;';b.addEventListener('click',function(){userMove(r,c)});gridDiv.appendChild(b);cellBtns[r].push(b)})(r0,c0)}}
      var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';
      function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c}
      function updateHud(){var h=[['YOU',score(1)],['HOUSE',score(2)]];if(cfg.timed&&turn===1&&!ended)h.push(['TIME',Math.max(0,Math.ceil((turnDeadline-performance.now())/1000))+'s']);G.hud(h)}
      function refreshGrid(){
        var legal=turn===1?legalMoves(1):[];
        var legalSet={};legal.forEach(function(p){legalSet[p[0]+','+p[1]]=1});
        for(var r=0;r<N;r++)for(var c=0;c<N;c++){
          var b=cellBtns[r][c],v=board[r][c];
          b.style.background=v===1?cfg.color:v===2?'#ff6b4a':(legalSet[r+','+c]?R.grid:R.bg);
          b.disabled=ended||turn!==1||!legalSet[r+','+c];
          b.style.cursor=b.disabled?'default':'pointer';
        }
      }
      function endIfNeeded(){
        var l1=legalMoves(1),l2=legalMoves(2);
        if(!l1.length&&!l2.length){
          ended=!0;var s1=score(1),s2=score(2);
          var win=s1>s2;
          updateMsg(win?'You win '+s1+'-'+s2+'!':s1===s2?'Tied '+s1+'-'+s2:'House wins '+s2+'-'+s1,win?R.green:R.coral);
          burst3d(scene,particles,0,.3,0,win?0x3ddc97:0xff6b4a,win?26:18);
          G.later(function(){G.over(win?150+s1*2:(s1===s2?60:s1*2),'Final: you '+s1+' · house '+s2,win?'You Win!':'Game Over')},900);
          return true;
        }
        return false;
      }
      function aiTurn(){
        var moves2=legalMoves(2);
        if(!moves2.length){turn=1;if(cfg.timed)turnDeadline=performance.now()+8000;if(!endIfNeeded()){updateMsg('Your turn (house had no move)',cfg.color);updateHud();refreshGrid()}return}
        var best=null,bestScore=-1;
        moves2.forEach(function(p){
          var fl=flipsFor(board,p[0],p[1],2).length;
          var corner=((p[0]===0||p[0]===N-1)&&(p[1]===0||p[1]===N-1))?6:0;
          var edge=(p[0]===0||p[0]===N-1||p[1]===0||p[1]===N-1)?1:0;
          var sc=fl+corner+edge+Math.random()*0.5;
          if(sc>bestScore){bestScore=sc;best=p}
        });
        var changed=applyMove(best[0],best[1],2);changed.push(best);
        syncMeshes(changed);
        if(endIfNeeded())return;
        turn=1;
        var l1=legalMoves(1);
        if(!l1.length){turn=2;updateMsg('House moves again…',R.dim);updateHud();refreshGrid();G.later(aiTurn,500);return}
        if(cfg.timed)turnDeadline=performance.now()+8000;updateMsg('Your turn',cfg.color);updateHud();refreshGrid();
      }
      function userMove(r,c){
        if(ended||turn!==1)return;
        var fl=flipsFor(board,r,c,1);if(!fl.length)return;
        var changed=applyMove(r,c,1);changed.push([r,c]);
        syncMeshes(changed);
        if(endIfNeeded())return;
        turn=2;updateMsg('House thinking…',R.dim);updateHud();refreshGrid();
        G.later(aiTurn,500);
      }
      S3.wrapDiv.appendChild(msgDiv);S3.wrapDiv.appendChild(gridDiv);
      function tick(dt){
        if(cfg.timed&&turn===1&&!ended){
          updateHud();
          if(performance.now()>=turnDeadline){var legal=legalMoves(1);if(legal.length){var p=legal[rnd(legal.length)];userMove(p[0],p[1])}}
        }
        stepParticles3d(scene,particles);S3.maxResizeCheck();S3.renderer.render(S3.scene,S3.camera)}
      G.begin(function(){
        board=[];discMeshes=[];for(var r=0;r<N;r++){var row=[],mrow=[];for(var c=0;c<N;c++){row.push(0);mrow.push(null)}board.push(row);discMeshes.push(mrow)}
        var mid=N/2;
        board[mid-1][mid-1]=2;board[mid-1][mid]=1;board[mid][mid-1]=1;board[mid][mid]=2;
        var changed=[];for(var rr=mid-1;rr<=mid;rr++)for(var cc=mid-1;cc<=mid;cc++)changed.push([rr,cc]);
        syncMeshes(changed);
        turn=1;ended=!1;if(cfg.timed)turnDeadline=performance.now()+8000;updateMsg('Your turn',cfg.color);updateHud();refreshGrid();
        G.frame(tick);
      });
    });
  });
}
flipGrid3d('galaxyFlip',{title:'Galaxy Flip',tagline:'Outflank the house across a starfield grid — control the most discs when no moves remain.',color:R.violet,size:6});
flipGrid3d('emeraldFlip',{title:'Emerald Flip',tagline:'Claim gem tiles by trapping the house between your stones.',color:R.green,size:6});
flipGrid3d('duneFlip',{title:'Dune Flip',tagline:'Flip dune tiles to your color and out-claim the house across the sands — 8 seconds a turn.',color:R.yellow,size:8,timed:!0});
flipGrid3d('tidalFlip',{title:'Tidal Flip',tagline:'A bigger flipping board — out-maneuver the house across the whole tide pool, 8 seconds a turn.',color:R.blue,size:8,timed:!0});

/* ================= nimStones3d: classic take-away stone-pile strategy game, optimal AI ================= */
function nimStones3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,cfg.misere?'Click a stone to remove it and every stone above it in that pile · avoid taking the last stone':'Click a stone to remove it and every stone above it in that pile · take the last stone to win',function(G){
    loadGate(G.el,function(){
      var piles0=cfg.piles.slice();
      var S3=setup3D(G,360,.7,0x0d1530);if(!S3)return;
      var scene=S3.scene,camera=S3.camera;
      var n=piles0.length;
      camera.position.set(0,5,n*1.6+2);camera.lookAt(0,1.5,0);
      var floor=new THREE.Mesh(new THREE.PlaneGeometry(n*2+4,10),new THREE.MeshStandardMaterial({color:0x1c1640,metalness:.2,roughness:.9}));
      floor.rotation.x=-Math.PI/2;floor.position.y=-.2;floor.receiveShadow=true;scene.add(floor);
      var colorNum=parseInt(cfg.color.replace('#','0x'));
      addGridLines(scene,n*2+4,10,-.19);
      addRails(scene,n*1.6+2.4,8,-.2,0x2a2155);
      glowOrbs(scene,[[-(n*1.6+2.4)/2+.3,.1,0],[(n*1.6+2.4)/2-.3,.1,0]],colorNum);
      var particles=makeParticlePool();
      var piles,ended,turn,stoneMeshes;
      function pileX(i){return(i-(n-1)/2)*1.6}
      function rebuildMeshes(){
        stoneMeshes.forEach(function(arr){arr.forEach(function(m){scene.remove(m);disposeThree(m)})});
        stoneMeshes=[];
        for(var i=0;i<n;i++){var arr=[];for(var s=0;s<piles[i];s++){var m=new THREE.Mesh(new THREE.BoxGeometry(.7,.42,.7),new THREE.MeshStandardMaterial({color:colorNum,emissive:colorNum,emissiveIntensity:.15,metalness:.15,roughness:.6}));m.position.set(pileX(i),.21+s*.46,0);m.castShadow=true;scene.add(m);arr.push(m)}stoneMeshes.push(arr)}
      }
      var pilesDiv=document.createElement('div');pilesDiv.style.cssText='display:flex;gap:14px;justify-content:center;width:100%;max-width:380px;align-items:flex-end;';
      var pileCols=[];
      for(var pi=0;pi<n;pi++){(function(i){var col=document.createElement('div');col.style.cssText='display:flex;flex-direction:column-reverse;gap:4px;align-items:center;';pilesDiv.appendChild(col);pileCols.push(col)})(pi)}
      var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';
      function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c}
      function totalStones(){return piles.reduce(function(a,b){return a+b},0)}
      function updateHud(){G.hud([['STONES LEFT',totalStones()],['TURN',turn===1?'You':'House']])}
      function refreshPiles(){
        pileCols.forEach(function(col,i){
          col.innerHTML='';
          for(var s=0;s<piles[i];s++){
            (function(idx){
              var b=document.createElement('button');b.type='button';b.textContent='●';
              b.style.cssText='width:30px;height:26px;border-radius:5px;border:none;background:'+cfg.color+';color:#171233;font-weight:800;cursor:pointer;';
              b.disabled=ended||turn!==1;b.style.opacity=b.disabled?'.5':'1';
              b.addEventListener('click',function(){userTake(i,piles[i]-idx)});
              col.appendChild(b);
            })(s);
          }
          if(!piles[i]){var ph=document.createElement('div');ph.style.cssText='width:30px;height:4px;border-radius:2px;background:'+R.grid+';';col.appendChild(ph)}
        });
      }
      function doTake(i,count){
        var removed=0;
        while(removed<count&&stoneMeshes[i].length){var m=stoneMeshes[i].pop();scene.remove(m);disposeThree(m);removed++}
        piles[i]=Math.max(0,piles[i]-count);
      }
      function checkEndAfter(moverWasPlayer){
        if(totalStones()===0){
          ended=!0;
          var youWon=cfg.misere?!moverWasPlayer:moverWasPlayer;
          if(youWon){updateMsg(cfg.misere?'The house was forced to take the last stone — you win!':'You took the last stone — you win!',R.green);burst3d(scene,particles,0,1.5,0,0x3ddc97,26);G.later(function(){G.over(150,cfg.misere?'The house was forced to take the last stone!':'You took the last stone!','You Win!')},800)}
          else{updateMsg(cfg.misere?'You took the last stone. Try again!':'House took the last stone. Try again!',R.coral);burst3d(scene,particles,0,1.5,0,0xff6b4a,18);G.later(function(){G.over(30,cfg.misere?'You took the last stone.':'The house took the last stone.')},800)}
          return true;
        }
        return false;
      }
      function aiMove(){
        var xorAll=0;piles.forEach(function(p){xorAll^=p});
        var chosenPile=-1,chosenCount=0;
        if(xorAll!==0){
          for(var i=0;i<n;i++){var target=piles[i]^xorAll;if(target<piles[i]){chosenPile=i;chosenCount=piles[i]-target;break}}
        }
        if(chosenPile<0){
          var opts=[];for(var i2=0;i2<n;i2++)if(piles[i2]>0)opts.push(i2);
          chosenPile=opts[rnd(opts.length)];chosenCount=1+rnd(piles[chosenPile]);
        }
        doTake(chosenPile,chosenCount);
        refreshPiles();updateHud();
        if(checkEndAfter(!1))return;
        turn=1;updateMsg('Your turn',cfg.color);refreshPiles();
      }
      function userTake(i,count){
        if(ended||turn!==1)return;
        doTake(i,count);
        refreshPiles();updateHud();
        if(checkEndAfter(!0))return;
        turn=2;updateMsg('House thinking…',R.dim);refreshPiles();
        G.later(aiMove,600);
      }
      S3.wrapDiv.appendChild(msgDiv);S3.wrapDiv.appendChild(pilesDiv);
      function tick(dt){stepParticles3d(scene,particles);S3.maxResizeCheck();S3.renderer.render(S3.scene,S3.camera)}
      G.begin(function(){
        piles=piles0.slice();stoneMeshes=[];
        rebuildMeshes();
        turn=1;ended=!1;updateMsg('Your turn',cfg.color);updateHud();refreshPiles();
        G.frame(tick);
      });
    });
  });
}
nimStones3d('templeStones',{title:'Temple Stones',tagline:'Classic stone-pile strategy — take the last stone from the temple vault to win.',color:R.yellow,piles:[1,3,5,7]});
nimStones3d('glacierStones',{title:'Glacier Stones',tagline:'Chip away at ice-block piles — out-think the house to claim the final block.',color:R.teal,piles:[3,4,5]});
nimStones3d('pirateStones',{title:'Pirate Stones',tagline:'Misère rules — split the treasure piles with the house, but DON\'T get stuck grabbing the last coin.',color:R.coral,piles:[2,4,6,8],misere:!0});
nimStones3d('meteorStones',{title:'Meteor Stones',tagline:'Misère rules — clear meteor-rock piles turn by turn, but don\'t let yourself clear the final one.',color:R.orange,piles:[1,2,3,4,5],misere:!0});

}
})();
