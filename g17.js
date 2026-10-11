(function(){
'use strict';
var prev=window.CSA_EXT;
window.CSA_EXT=function(K){
  if(prev)prev(K);
  try{puzzle17(K)}catch(e){console.error(e)}
};

function puzzle17(K){
'use strict';
var g=K.g,M=K.M,R=K.R;
var CAT='Puzzle';
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

/* ================= slidingBlocks3d: classic 15-puzzle, 3D numbered cubes, DOM-driven slides ================= */
function slidingBlocks3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Click a tile next to the gap to slide it · arrange 1 through '+(cfg.size*cfg.size-1)+' in order',function(G){
    loadGate(G.el,function(){
      var N=cfg.size,total=N*N;
      var S3=setup3D(G,340,.95,0x0d1530);if(!S3)return;
      var scene=S3.scene,camera=S3.camera;
      camera.position.set(0,N*.95+1,N*.3+1.4);camera.lookAt(0,0,0);
      var colorNum=parseInt(cfg.color.replace('#','0x'));
      var board,moves,ended,tileMeshes;
      function cellPos(r,c){return[(c-(N-1)/2)*.92,((N-1)/2-r)*.92]}
      function makeTileTexture(n){var c=document.createElement('canvas');c.width=96;c.height=96;var ctx2=c.getContext('2d');ctx2.fillStyle='#f4f1ff';ctx2.beginPath();ctx2.roundRect(4,4,88,88,14);ctx2.fill();ctx2.fillStyle='#171233';ctx2.font='700 40px Figtree, sans-serif';ctx2.textAlign='center';ctx2.textBaseline='middle';ctx2.fillText(String(n),48,52);return new THREE.CanvasTexture(c)}
      var gridDiv=document.createElement('div');gridDiv.style.cssText='display:grid;grid-template-columns:repeat('+N+',1fr);gap:4px;width:100%;max-width:260px;margin:0 auto;';
      var cellBtns=[];
      for(var r0=0;r0<N;r0++){cellBtns.push([]);for(var c0=0;c0<N;c0++){(function(r,c){var b=document.createElement('button');b.type='button';b.style.cssText='aspect-ratio:1;border-radius:8px;border:none;font-weight:800;cursor:pointer;';b.addEventListener('click',function(){userSlide(r,c)});gridDiv.appendChild(b);cellBtns[r].push(b)})(r0,c0)}}
      var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';
      function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c||R.ink}
      function updateHud(){G.hud([['MOVES',moves]])}
      function findEmpty(){for(var r=0;r<N;r++)for(var c=0;c<N;c++)if(board[r][c]===0)return[r,c]}
      function refresh(){
        for(var r=0;r<N;r++)for(var c=0;c<N;c++){
          var v=board[r][c],b=cellBtns[r][c];
          if(v===0){b.textContent='';b.style.background=R.grid;b.style.color=R.grid;b.style.opacity='.3'}
          else{b.textContent=v;b.style.background=cfg.color;b.style.color='#171233';b.style.opacity='1'}
          var m=tileMeshes[r][c];
          if(m){var pos=cellPos(r,c);m.targetX=pos[0];m.targetY=pos[1];m.mesh.visible=v!==0}
        }
      }
      function isSolved(){var n=1;for(var r=0;r<N;r++)for(var c=0;c<N;c++){if(r===N-1&&c===N-1)return board[r][c]===0;if(board[r][c]!==n++)return!1}return!0}
      function userSlide(r,c){
        if(ended)return;
        var empty=findEmpty();
        var dr=Math.abs(r-empty[0]),dc=Math.abs(c-empty[1]);
        if((dr===1&&dc===0)||(dr===0&&dc===1)){
          board[empty[0]][empty[1]]=board[r][c];board[r][c]=0;
          moves++;updateHud();refresh();
          if(isSolved()){ended=!0;updateMsg('Solved in '+moves+' moves!',R.green);G.burst(G.w/2,G.h/2,cfg.color,20);G.later(function(){G.over(Math.max(50,500-moves*4),'Solved in '+moves+' moves!','Solved!')},700)}
        }
      }
      function shuffle(){
        board=[];var n=1;for(var r=0;r<N;r++){var row=[];for(var c=0;c<N;c++)row.push(r===N-1&&c===N-1?0:n++);board.push(row)}
        var er=N-1,ec=N-1;
        for(var i=0;i<400;i++){
          var opts=[];
          if(er>0)opts.push([er-1,ec]);if(er<N-1)opts.push([er+1,ec]);if(ec>0)opts.push([er,ec-1]);if(ec<N-1)opts.push([er,ec+1]);
          var pk=pick(opts);
          board[er][ec]=board[pk[0]][pk[1]];board[pk[0]][pk[1]]=0;er=pk[0];ec=pk[1];
        }
      }
      S3.wrapDiv.appendChild(msgDiv);S3.wrapDiv.appendChild(gridDiv);
      function tick(dt){
        for(var r=0;r<N;r++)for(var c=0;c<N;c++){
          var m=tileMeshes[r][c];if(!m)continue;
          m.mesh.position.x+=(m.targetX-m.mesh.position.x)*Math.min(1,dt*10);
          m.mesh.position.z+=(m.targetY-m.mesh.position.z)*Math.min(1,dt*10);
        }
        S3.maxResizeCheck();S3.renderer.render(S3.scene,S3.camera);
      }
      G.begin(function(){
        if(tileMeshes)tileMeshes.forEach(function(row){row.forEach(function(m){if(m){scene.remove(m.mesh);disposeThree(m.mesh)}})});
        tileMeshes=[];
        for(var r=0;r<N;r++){var row=[];for(var c=0;c<N;c++){
          var n=r*N+c+1;if(n>=total)n=null;
          var mesh=new THREE.Mesh(new THREE.BoxGeometry(.8,.2,.8),[
            new THREE.MeshStandardMaterial({color:colorNum}),new THREE.MeshStandardMaterial({color:colorNum}),
            new THREE.MeshStandardMaterial({map:n?makeTileTexture(n):null,color:n?0xffffff:0x222222}),new THREE.MeshStandardMaterial({color:colorNum}),
            new THREE.MeshStandardMaterial({color:colorNum}),new THREE.MeshStandardMaterial({color:colorNum})
          ]);
          mesh.rotation.y=0;var pos=cellPos(r,c);mesh.position.set(pos[0],0,pos[1]);scene.add(mesh);
          row.push({mesh:mesh,targetX:pos[0],targetY:pos[1]});
        }tileMeshes.push(row)}
        moves=0;ended=!1;shuffle();refresh();updateMsg('Slide the gap to solve!',cfg.color);updateHud();
        G.frame(tick);
      });
    });
  });
}
slidingBlocks3d('slidePanels',{title:'Slide Panels',tagline:'Classic sliding tile puzzle — reorder the 3D panels into sequence using the gap.',color:R.blue,size:4});

/* ================= gridLights3d: Lights Out puzzle, click toggles a cross-shaped neighborhood ================= */
function gridLights3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Click a light to toggle it and its neighbors · turn every light off to win',function(G){
    loadGate(G.el,function(){
      var N=cfg.size;
      var S3=setup3D(G,340,.95,0x0d1530);if(!S3)return;
      var scene=S3.scene,camera=S3.camera;
      camera.position.set(0,N*.9+1,N*.3+1.2);camera.lookAt(0,0,0);
      var colorNum=parseInt(cfg.color.replace('#','0x'));
      var board,clicks,ended,cubes;
      function cellPos(r,c){return[(c-(N-1)/2)*.9,((N-1)/2-r)*.9]}
      var gridDiv=document.createElement('div');gridDiv.style.cssText='display:grid;grid-template-columns:repeat('+N+',1fr);gap:5px;width:100%;max-width:260px;margin:0 auto;';
      var cellBtns=[];
      for(var r0=0;r0<N;r0++){cellBtns.push([]);for(var c0=0;c0<N;c0++){(function(r,c){var b=document.createElement('button');b.type='button';b.style.cssText='aspect-ratio:1;border-radius:8px;border:2px solid '+R.grid+';cursor:pointer;';b.addEventListener('click',function(){toggle(r,c)});gridDiv.appendChild(b);cellBtns[r].push(b)})(r0,c0)}}
      var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';
      function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c||R.ink}
      function updateHud(){G.hud([['CLICKS',clicks]])}
      function refresh(){
        for(var r=0;r<N;r++)for(var c=0;c<N;c++){
          var on=board[r][c],b=cellBtns[r][c];
          b.style.background=on?cfg.color:R.bg;
          var cube=cubes[r][c];cube.mesh.material.emissiveIntensity=on?.9:0;cube.mesh.material.color.setHex(on?colorNum:0x1a1530);
        }
      }
      function allOff(){for(var r=0;r<N;r++)for(var c=0;c<N;c++)if(board[r][c])return!1;return!0}
      function flip(r,c){if(r>=0&&r<N&&c>=0&&c<N)board[r][c]=!board[r][c]}
      function toggle(r,c){
        if(ended)return;
        flip(r,c);flip(r-1,c);flip(r+1,c);flip(r,c-1);flip(r,c+1);
        clicks++;updateHud();refresh();
        if(allOff()){ended=!0;updateMsg('All lights out!',R.green);G.burst(G.w/2,G.h/2,cfg.color,20);G.later(function(){G.over(Math.max(50,300-clicks*8),'Solved in '+clicks+' clicks!','Solved!')},700)}
      }
      function generate(){
        board=[];for(var r=0;r<N;r++){var row=[];for(var c=0;c<N;c++)row.push(!1);board.push(row)}
        var kicks=8+rnd(6);
        for(var i=0;i<kicks;i++)toggle0(rnd(N),rnd(N));
        if(allOff())toggle0(rnd(N),rnd(N));
      }
      function toggle0(r,c){flip(r,c);flip(r-1,c);flip(r+1,c);flip(r,c-1);flip(r,c+1)}
      S3.wrapDiv.appendChild(msgDiv);S3.wrapDiv.appendChild(gridDiv);
      function tick(dt){S3.maxResizeCheck();S3.renderer.render(S3.scene,S3.camera)}
      G.begin(function(){
        if(cubes)cubes.forEach(function(row){row.forEach(function(cu){scene.remove(cu.mesh);disposeThree(cu.mesh)})});
        cubes=[];
        for(var r=0;r<N;r++){var row=[];for(var c=0;c<N;c++){
          var mesh=new THREE.Mesh(new THREE.BoxGeometry(.72,.3,.72),new THREE.MeshStandardMaterial({color:0x1a1530,emissive:colorNum,emissiveIntensity:0}));
          var pos=cellPos(r,c);mesh.position.set(pos[0],0,pos[1]);scene.add(mesh);row.push({mesh:mesh});
        }cubes.push(row)}
        clicks=0;ended=!1;generate();refresh();updateMsg('Turn them all off!',cfg.color);updateHud();
        G.frame(tick);
      });
    });
  });
}
gridLights3d('luminGrid',{title:'Lumin Grid',tagline:'Toggle glowing cells and their neighbors — darken the whole grid to win.',color:R.yellow,size:5});

/* ================= pathConnect3d: rotate 3D pipe tiles along a winding strip to connect start to end ================= */
function pathConnect3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Click a pipe segment to rotate it 90° · connect the whole path from start to end',function(G){
    loadGate(G.el,function(){
      var N=cfg.size;
      var S3=setup3D(G,340,.85,0x0d1530);if(!S3)return;
      var scene=S3.scene,camera=S3.camera;
      camera.position.set(0,N*.85+1.4,N*.6+1.2);camera.lookAt(0,0,0);
      var colorNum=parseInt(cfg.color.replace('#','0x'));
      function dirsOf(type,rot){
        var base=type==='straight'?[1,3]:type==='corner'?[0,1]:[1];
        return base.map(function(d){return(d+rot)%4}).sort();
      }
      function genPath(){
        var cells=[[0,0]],r=0,c=0;
        while(r<N-1||c<N-1){
          if(c===N-1){r++;cells.push([r,c])}
          else if(r===N-1){c++;cells.push([r,c])}
          else if(Math.random()<.5){c++;cells.push([r,c])}else{r++;cells.push([r,c])}
        }
        return cells;
      }
      var path,cellMeta,tileGroups,moves,ended;
      function buildMeta(cells){
        var meta=[];
        for(var i=0;i<cells.length;i++){
          var dirs=[];
          if(i>0){var prev=cells[i-1],cur=cells[i];var d=(cur[0]>prev[0])?2:(cur[1]>prev[1])?1:(cur[0]<prev[0])?0:3;dirs.push((d+2)%4)}
          if(i<cells.length-1){var nxt=cells[i+1],cur2=cells[i];var d2=(nxt[0]>cur2[0])?2:(nxt[1]>cur2[1])?1:(nxt[0]<cur2[0])?0:3;dirs.push(d2)}
          dirs=dirs.sort();
          var type=dirs.length===1?'end':((dirs[1]-dirs[0])===2?'straight':'corner');
          meta.push({r:cells[i][0],c:cells[i][1],required:dirs,type:type,rot:rnd(4)});
        }
        return meta;
      }
      function cellPos(r,c){return[(c-(N-1)/2)*.9,((N-1)/2-r)*.9]}
      function makeStub(dir){
        var m=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.46,10),new THREE.MeshStandardMaterial({color:colorNum,metalness:.25,roughness:.5}));
        m.rotation.z=Math.PI/2;
        var off=.24;
        if(dir===0)m.position.set(0,0,-off);else if(dir===2)m.position.set(0,0,off);else if(dir===1)m.position.set(off,0,0);else m.position.set(-off,0,0);
        if(dir===0||dir===2)m.rotation.set(Math.PI/2,0,0);else m.rotation.set(0,0,Math.PI/2);
        return m;
      }
      function buildTile(meta){
        var grp=new THREE.Group();
        var base=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.14,16),new THREE.MeshStandardMaterial({color:0x1a1530}));
        grp.add(base);
        var baseDirs=meta.type==='straight'?[1,3]:meta.type==='corner'?[0,1]:[1];
        baseDirs.forEach(function(d){grp.add(makeStub(d))});
        var pos=cellPos(meta.r,meta.c);grp.position.set(pos[0],0,pos[1]);
        grp.rotation.y=-meta.rot*(Math.PI/2);
        scene.add(grp);
        return grp;
      }
      var gridWrap=document.createElement('div');gridWrap.style.cssText='display:grid;grid-template-columns:repeat('+N+',1fr);gap:4px;width:100%;max-width:260px;margin:0 auto;';
      var btnByCell={};
      var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';
      function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c||R.ink}
      function updateHud(){G.hud([['ROTATIONS',moves]])}
      function isConnected(){return cellMeta.every(function(m){var cur=dirsOf(m.type,m.rot);return cur.length===m.required.length&&cur.every(function(d,i){return d===m.required[i]})})}
      function refreshBtns(){
        for(var i=0;i<cellMeta.length;i++){
          var m=cellMeta[i],key=m.r+','+m.c,b=btnByCell[key];
          if(!b)continue;
          var solved=dirsOf(m.type,m.rot).join()===m.required.join();
          b.style.background=solved?cfg.color:R.grid;
        }
      }
      function rotateCell(i){
        if(ended)return;
        cellMeta[i].rot=(cellMeta[i].rot+1)%4;
        moves++;updateHud();
        tileGroups[i].targetRotY=-cellMeta[i].rot*(Math.PI/2);
        while(tileGroups[i].targetRotY>tileGroups[i].mesh.rotation.y)tileGroups[i].targetRotY-=Math.PI*2;
        refreshBtns();
        if(isConnected()){ended=!0;updateMsg('Connected!',R.green);G.burst(G.w/2,G.h/2,cfg.color,20);G.later(function(){G.over(Math.max(50,300-moves*6),'Connected the pipes in '+moves+' rotations!','Connected!')},700)}
      }
      S3.wrapDiv.appendChild(msgDiv);S3.wrapDiv.appendChild(gridWrap);
      function tick(dt){
        tileGroups.forEach(function(tg){tg.mesh.rotation.y+=(tg.targetRotY-tg.mesh.rotation.y)*Math.min(1,dt*10)});
        S3.maxResizeCheck();S3.renderer.render(S3.scene,S3.camera);
      }
      G.begin(function(){
        if(tileGroups)tileGroups.forEach(function(tg){scene.remove(tg.mesh);tg.mesh.traverse(function(o){disposeThree(o)})});
        gridWrap.innerHTML='';btnByCell={};
        path=genPath();cellMeta=buildMeta(path);
        tileGroups=cellMeta.map(function(m){var mesh=buildTile(m);return{mesh:mesh,targetRotY:mesh.rotation.y}});
        var full=[];for(var r=0;r<N;r++){full.push([]);for(var c=0;c<N;c++)full[r].push(null)}
        cellMeta.forEach(function(m,i){full[m.r][m.c]=i});
        for(var r2=0;r2<N;r2++)for(var c2=0;c2<N;c2++){
          var cell=document.createElement('button');cell.type='button';cell.style.cssText='aspect-ratio:1;border-radius:6px;border:none;cursor:pointer;background:'+R.bg+';opacity:'+(full[r2][c2]===null?'.15':'1')+';';
          if(full[r2][c2]!==null){(function(idx){cell.addEventListener('click',function(){rotateCell(idx)})})(full[r2][c2]);btnByCell[r2+','+c2]=cell}
          else cell.disabled=!0;
          gridWrap.appendChild(cell);
        }
        moves=0;ended=!1;refreshBtns();updateMsg('Rotate the pipes to connect!',cfg.color);updateHud();
        G.frame(tick);
      });
    });
  });
}
pathConnect3d('pipeFlow',{title:'Pipe Flow',tagline:'Rotate winding 3D pipe segments until water can flow from start to end.',color:R.teal,size:5});

/* ================= numberChain3d: Hamiltonian number-path puzzle, click adjacent cells to trace 1..N*N ================= */
function numberChain3d(id,cfg){
  def(id,cfg.title,cfg.color,cfg.tagline,'Click any cell touching your last number to continue the chain · click your last step again to undo · fill every cell ending on the marked finish',function(G){
    loadGate(G.el,function(){
      var N=cfg.size,total=N*N;
      var S3=setup3D(G,340,.95,0x0d1530);if(!S3)return;
      var scene=S3.scene,camera=S3.camera;
      camera.position.set(0,N*.9+1.4,N*.4+1.2);camera.lookAt(0,0,0);
      var colorNum=parseInt(cfg.color.replace('#','0x'));
      var endR=N-1,endC=N-1;
      var visited,path,cubes,ended;
      function cellPos(r,c){return[(c-(N-1)/2)*.88,((N-1)/2-r)*.88]}
      var gridDiv=document.createElement('div');gridDiv.style.cssText='display:grid;grid-template-columns:repeat('+N+',1fr);gap:4px;width:100%;max-width:260px;margin:0 auto;';
      var cellBtns=[];
      for(var r0=0;r0<N;r0++){cellBtns.push([]);for(var c0=0;c0<N;c0++){(function(r,c){var b=document.createElement('button');b.type='button';b.style.cssText='aspect-ratio:1;border-radius:6px;border:1px solid '+R.grid+';font-weight:800;font-size:.75rem;cursor:pointer;';b.addEventListener('click',function(){clickCell(r,c)});gridDiv.appendChild(b);cellBtns[r].push(b)})(r0,c0)}}
      var msgDiv=document.createElement('div');msgDiv.style.cssText='min-height:1.4em;font-weight:700;text-align:center;';
      function updateMsg(s,c){msgDiv.textContent=s;msgDiv.style.color=c||R.ink}
      function updateHud(){G.hud([['STEP',path.length+'/'+total],['UNDOS',undos]])}
      var undos;
      function adjacent(a,b){return Math.abs(a[0]-b[0])<=1&&Math.abs(a[1]-b[1])<=1&&!(a[0]===b[0]&&a[1]===b[1])}
      function refresh(){
        for(var r=0;r<N;r++)for(var c=0;c<N;c++){
          var idx=visited[r][c],b=cellBtns[r][c],cube=cubes[r][c];
          if(idx>0){b.textContent=idx;b.style.background=cfg.color;b.style.color='#171233';cube.mesh.material.emissiveIntensity=.7}
          else if(r===endR&&c===endC){b.textContent='★';b.style.background=R.grid;b.style.color=R.yellow;cube.mesh.material.emissiveIntensity=.2}
          else{b.textContent='';b.style.background=R.bg;b.style.color=R.dim;cube.mesh.material.emissiveIntensity=0}
        }
      }
      function clickCell(r,c){
        if(ended)return;
        if(path.length===0){
          if(r===0&&c===0){path.push([0,0]);visited[0][0]=1;undos=0;refresh();updateHud();updateMsg('Trace a path through every cell!',cfg.color)}
          return;
        }
        var last=path[path.length-1];
        if(path.length>1&&r===last[0]&&c===last[1]){return}
        if(path.length>=2){var prev=path[path.length-2];if(r===prev[0]&&c===prev[1]){
          visited[last[0]][last[1]]=0;path.pop();undos++;refresh();updateHud();return;
        }}
        if(visited[r][c])return;
        if(!adjacent(last,[r,c]))return;
        path.push([r,c]);visited[r][c]=path.length;refresh();updateHud();
        if(path.length===total&&r===endR&&c===endC){
          ended=!0;updateMsg('Chain complete!',R.green);G.burst(G.w/2,G.h/2,cfg.color,20);
          G.later(function(){G.over(Math.max(50,300-undos*15),'Completed the chain with '+undos+' undos!','Solved!')},700);
        } else if(path.length===total){
          updateMsg('Filled every cell, but not on the finish — undo and retry!',R.coral);
        }
      }
      S3.wrapDiv.appendChild(msgDiv);S3.wrapDiv.appendChild(gridDiv);
      function tick(dt){S3.maxResizeCheck();S3.renderer.render(S3.scene,S3.camera)}
      G.begin(function(){
        if(cubes)cubes.forEach(function(row){row.forEach(function(cu){scene.remove(cu.mesh);disposeThree(cu.mesh)})});
        cubes=[];
        for(var r=0;r<N;r++){var row=[];for(var c=0;c<N;c++){
          var mesh=new THREE.Mesh(new THREE.BoxGeometry(.78,.22,.78),new THREE.MeshStandardMaterial({color:0x1a1530,emissive:colorNum,emissiveIntensity:0}));
          var pos=cellPos(r,c);mesh.position.set(pos[0],0,pos[1]);scene.add(mesh);row.push({mesh:mesh});
        }cubes.push(row)}
        visited=[];for(var r2=0;r2<N;r2++){var vr=[];for(var c2=0;c2<N;c2++)vr.push(0);visited.push(vr)}
        path=[];undos=0;ended=!1;
        refresh();updateMsg('Click the top-left cell to start!',cfg.color);updateHud();
        G.frame(tick);
      });
    });
  });
}
numberChain3d('hamiltonHop',{title:'Hamilton Hop',tagline:'Trace one continuous chain through every cell of the grid, finishing on the star.',color:R.magenta,size:5});

}
})();
