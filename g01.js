window.CSA_EXT=function(r){'use strict';var t=r.g,n=r.M,o=r.R,e=2*Math.PI,a=[],i=String('<svg viewBox=#0 0 24 24# fill=#none# stroke=#currentColor# stroke-width=#2# stroke-linecap=#round# stroke-linejoin=#round#><rect x=#4# y=#4# width=#16# height=#16# rx=#3#/><circle cx=#12# cy=#12# r=#3#/></svg>').split('#').join(String.fromCharCode(39)),l=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '];function f(r){return Math.floor(Math.random()*r)}function c(r,t){return r+Math.random()*(t-r)}function u(r){return r[f(r.length)]}function h(r){var t,n,o;for(t=r.length-1;t>0;t--)n=f(t+1),o=r[t],r[t]=r[n],r[n]=o;return r}function s(r,t,n){return r<t?t:r>n?n:r}function y(r){return String(Math.floor(r)).padStart(4,'0')}function d(r,t,n,o,a){r.beginPath(),r.arc(t,n,o,0,e),a&&(r.fillStyle=a,r.fill())}function p(t,n,o,e,a,i,l){r.L(t,n,o,e,a,void 0===i?4:i),l&&(t.fillStyle=l,t.fill())}function x(r,t,n,e,a,i,l){r.font='700 '+a+'px Figtree, sans-serif',r.textAlign=l||'center',r.textBaseline='middle',
r.fillStyle=i||o.ink,r.fillText(t,n,e)}function v(r,t,n,o,e,a,i){r.beginPath(),r.moveTo(t,n),r.lineTo(o,e),r.strokeStyle=a,r.lineWidth=i||2,r.stroke()}function g(r,t,n,e){r.fillStyle=e||o.bg,r.fillRect(0,0,t,n)}function w(o,f,u,h,y,d,p){t[o]={title:u,tagline:y,color:h,hint:d,category:f,icon:i,mount:function(t,n){var a=function(t,n,o){var a={id:t,el:n,x:o,k:{},dead:!1,fns:[],rid:0,last:0,run:null,fx:[],press:null,again:null};function i(r){if(a.rid=0,!a.dead&&a.run){a.rid=requestAnimationFrame(i);var t=a.last?Math.min(.05,(r-a.last)/1e3):.016;a.last=r;try{a.run(t)}catch(r){a.run=null,console.error(r)}}}return a.on=function(r,t,n,o){r.addEventListener(t,n,o),a.fns.push(function(){r.removeEventListener(t,n,o)})},a.every=function(r,t){var n=setInterval(r,t);return a.fns.push(function(){clearInterval(n)}),n},a.later=function(r,t){var n=setTimeout(r,t);return a.fns.push(function(){clearTimeout(n)}),n},a.canvas=function(t,o){var e=r.A(n,t,o);return a.cv=e.canvas,a.c=e.ctx,a.w=t,a.h=o,a.c},
a.frame=function(r){a.run=r,a.last=0,a.rid||a.dead||(a.rid=requestAnimationFrame(i))},a.stop=function(){a.run=null},a.on(document,'keydown',function(r){if(!(r.ctrlKey||r.metaKey||r.altKey)){var t=1===r.key.length?r.key.toLowerCase():r.key;l.indexOf(t)>-1&&r.preventDefault(),a.k[t]||(a.k[t]=1,a.press&&a.press(t,r))}}),a.on(document,'keyup',function(r){delete a.k[1===r.key.length?r.key.toLowerCase():r.key]}),a.on(window,'blur',function(){a.k={}}),a.ax=function(){return(a.k.ArrowRight||a.k.d?1:0)-(a.k.ArrowLeft||a.k.a?1:0)},a.ay=function(){return(a.k.ArrowDown||a.k.s?1:0)-(a.k.ArrowUp||a.k.w?1:0)},a.pt=function(r){var t=a.cv.getBoundingClientRect();return{x:(r.clientX-t.left)*a.w/t.width,y:(r.clientY-t.top)*a.h/t.height}},a.pointer=function(r){var t=a.cv,n=!1;a.on(t,'pointerdown',function(o){n=!0;try{t.setPointerCapture(o.pointerId)}catch(r){}r.down&&r.down(a.pt(o),o)}),a.on(t,'pointermove',function(t){r.move&&r.move(a.pt(t),t,n)}),a.on(t,'pointerup',function(t){n=!1,r.up&&r.up(a.pt(t),t)
}),a.on(t,'pointercancel',function(t){n=!1,r.up&&r.up(a.pt(t),t)})},a.swipe=function(t){var n=r.D(a.cv,t);a.fns.push(n)},a.hud=function(r){var t=r.map(function(r,t){var n=r[0]+'<b>'+r[1]+'</b>';return t?'<span style=margin-left:1rem>'+n+'</span>':n}).join('');t!==a.lh&&(a.lh=t,o.setHud(t))},a.hint=function(r){o.setHint(r)},a.begin=function(r){a.again=r,o.hideOverlay(),r()},a.over=function(r,n,e){a.run=null,r=Math.floor(r),o.reportScore(t,r),o.showOverlay(e||'Game Over',(n||'Score: '+r)+' · Best '+o.getHighScore(t),'Play again',a.again)},a.burst=function(r,t,n,o){var i,l,f;for(i=0;i<(o||10);i++)l=c(0,e),f=c(30,150),a.fx.push({x:r,y:t,vx:Math.cos(l)*f,vy:Math.sin(l)*f,t:c(.3,.7),m:.7,c:n})},a.fxStep=function(r){var t=a.c;a.fx=a.fx.filter(function(n){return n.t-=r,n.x+=n.vx*r,n.y+=n.vy*r,!(n.t<=0||(t.globalAlpha=s(n.t/n.m,0,1),t.fillStyle=n.c,t.fillRect(n.x-1.5,n.y-1.5,3,3),t.globalAlpha=1,0))})},a.opt=function(r,t,n,o){
var e=document.getElementById('optionsBar'),a=document.createElement('span'),i=document.createElement('span'),l=[];a.className='opt-group',i.className='opt-label',i.textContent=r,a.appendChild(i),t.forEach(function(r,t){var e=document.createElement('button');e.type='button',e.className='opt-btn'+(t===n?' active':''),e.textContent=r,e.onclick=function(){l.forEach(function(r,n){r.className='opt-btn'+(n===t?' active':'')}),o(t)},l.push(e),a.appendChild(e)}),e.appendChild(a)},a.pad=function(r){('ontouchstart'in window||navigator.maxTouchPoints>0)&&(o.setTouchPad(r.map(function(r){return'<button type=button class=pad-btn data-k='+r[1]+'>'+r[0]+'</button>'}).join('')),[].forEach.call(document.getElementById('touchPad').querySelectorAll('button'),function(r){var t=r.getAttribute('data-k');'Space'===t&&(t=' '),a.on(r,'pointerdown',function(r){r.preventDefault(),a.k[t]||(a.k[t]=1,a.press&&a.press(t,r))});var n=function(){delete a.k[t]};a.on(r,'pointerup',n),a.on(r,'pointerleave',n),
a.on(r,'pointercancel',n)}))},a.dispose=function(){a.dead=!0,a.rid&&cancelAnimationFrame(a.rid),a.fns.forEach(function(r){r()})},a}(o,t,n);return p(a),function(){a.dispose()}}},n.push(o),a.push(o)}var b='Arcade Classics',m='Reflex',M='Puzzle',k='Board & Strategy',S='Cards & Words';w('orbitRaiders',b,'Orbit Raiders',o.blue,'Hold the line against wave after wave of raiders — chain kills for a rising multiplier.','Arrows / A D to move · hold Space to fire',function(a){
var ctx=a.canvas(400,460),W=400,H=460;
var COLORS=[o.magenta,o.orange,o.yellow,o.green];
var px,bullet,enemies,formX,formDir,dropBoost,shots,shields,lives,score,wave,ufo,fireCd,spawnCd,ufoCd,diveCd,hitInv,combo,comboTimer;

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
    else if(ufo&&rectHit(bullet,18,10,ufo.x,ufo.y)){score+=100+50*f(3);combo++;comboTimer=2.5;a.burst(ufo.x,ufo.y,o.violet,16);ufo=null;bullet=null}
    else for(var i=0;i<enemies.length;i++){
      var e=enemies[i],ex=e.diving?e.curX:e.x+formX,ey=e.diving?e.curY:e.y+dropBoost;
      if(rectHit(bullet,13,10,ex,ey)){
        var mult=1+Math.min(4,Math.floor(combo/5));
        score+=10*(4-e.r)*mult;combo++;comboTimer=2.5;
        a.burst(ex,ey,COLORS[e.r],10);
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
      shots.splice(j,1);lives--;hitInv=1.5;combo=0;a.burst(px,426,o.blue,24);
      if(lives<=0){draw(dt);a.over(score,'Wave '+wave+' · Score: '+score);return}
    }
  }
  for(var k2=0;k2<enemies.length;k2++){
    var e2=enemies[k2],ey2=e2.diving?e2.curY:e2.y+dropBoost;
    if(!e2.diving&&ey2>350){draw(dt);a.over(score,'They landed on wave '+wave+' · Score: '+score);return}
  }
  if(!enemies.length){wave++;score+=100+20*wave;buildWave()}
  draw(dt)
}

function draw(dt){
  g(ctx,W,H);
  var jitter=Math.floor(formX/9)%2?1:0;
  enemies.forEach(function(e){
    var ex=e.diving?e.curX:e.x+formX,ey=e.diving?e.curY:e.y+dropBoost;
    p(ctx,ex-13,ey-9,26,15,7,COLORS[e.r]);
    p(ctx,ex-9+4*jitter,ey+5,5,6,2,COLORS[e.r]);
    p(ctx,ex+4-4*jitter,ey+5,5,6,2,COLORS[e.r]);
    d(ctx,ex-5,ey-3,3,o.bg);d(ctx,ex+5,ey-3,3,o.bg)
  });
  ctx.fillStyle=o.teal;
  shields.forEach(function(sh){ctx.fillRect(sh.x,sh.y,5,5)});
  if(ufo){p(ctx,ufo.x-16,ufo.y-5,32,10,5,o.violet);p(ctx,ufo.x-8,ufo.y-11,16,8,4,o.ink)}
  ctx.fillStyle=o.coral;
  shots.forEach(function(sh){ctx.fillRect(sh.x-2,sh.y-6,4,12)});
  if(bullet){ctx.fillStyle=o.ink;ctx.fillRect(bullet.x-2,bullet.y-8,4,14)}
  if(hitInv<=0||Math.floor(10*hitInv)%2){
    ctx.fillStyle=o.blue;ctx.beginPath();ctx.moveTo(px,408);ctx.lineTo(px-18,436);ctx.lineTo(px+18,436);ctx.closePath();ctx.fill();
    p(ctx,px-22,432,44,8,3,o.ink)
  }
  a.fxStep(dt);
  for(var i2=0;i2<lives;i2++)p(ctx,10+18*i2,446,12,8,3,o.blue);
  a.hud([['SCORE',y(score)],['WAVE',wave],['LIVES',lives],['COMBO','x'+(1+Math.min(4,Math.floor(combo/5)))]])
}

a.pad([['◀','ArrowLeft'],['FIRE','Space'],['▶','ArrowRight']]);
a.begin(function(){
  px=200;lives=3;score=0;wave=1;ufo=null;fireCd=0;spawnCd=1;ufoCd=15;hitInv=0;combo=0;comboTimer=0;
  a.fx=[];
  buildWave();
  a.frame(step)
})
}),w('rockDrift',b,'Rock Drift',o.orange,'Drift, spin and blast the asteroid field — watch for the UFO raiders that shoot back.','Left/Right turn · Up thrust · Space fire',function(a){
var ctx=a.canvas(400,400),W=400,H=400;
var ship,bullets,ufoBullets,asteroids,lives,score,wave,invuln,fireCd,combo,comboTimer,ufo,ufoCd;

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
  lives--;combo=0;a.burst(ship.x,ship.y,o.ink,26);
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
        a.burst(ast.x,ast.y,o.orange,8+3*ast.sz);
        asteroids.splice(ai,1);bullets.splice(bi,1);
        if(ast.sz>1){asteroids.push(makeAsteroid(ast.x,ast.y,ast.sz-1));asteroids.push(makeAsteroid(ast.x,ast.y,ast.sz-1))}
        break
      }
    }
  }
  if(ufo){
    for(var bj=bullets.length-1;bj>=0;bj--){
      if(Math.hypot(bullets[bj].x-ufo.x,bullets[bj].y-ufo.y)<14){
        score+=300;a.burst(ufo.x,ufo.y,o.violet,20);bullets.splice(bj,1);ufo=null;break
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
  g(ctx,W,H);
  ctx.lineWidth=2;ctx.strokeStyle=o.ink;ctx.lineJoin='round';
  asteroids.forEach(function(o2){
    ctx.beginPath();
    for(var i=0;i<10;i++){
      var ang=o2.a+i*e/10,rr=o2.r*o2.pts[i],px2=o2.x+Math.cos(ang)*rr,py2=o2.y+Math.sin(ang)*rr;
      i?ctx.lineTo(px2,py2):ctx.moveTo(px2,py2)
    }
    ctx.closePath();ctx.stroke()
  });
  bullets.forEach(function(b2){d(ctx,b2.x,b2.y,2.5,o.yellow)});
  ufoBullets.forEach(function(ub){d(ctx,ub.x,ub.y,2.5,o.coral)});
  if(ufo){p(ctx,ufo.x-16,ufo.y-5,32,10,5,o.violet);p(ctx,ufo.x-8,ufo.y-11,16,8,4,o.ink)}
  if(invuln<=0||Math.floor(8*invuln)%2){
    ctx.save();ctx.translate(ship.x,ship.y);ctx.rotate(ship.a);
    ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-10,-9);ctx.lineTo(-5,0);ctx.lineTo(-10,9);ctx.closePath();
    ctx.strokeStyle=o.orange;ctx.stroke();
    if(a.k.ArrowUp||a.k.w){
      ctx.beginPath();ctx.moveTo(-6,-4);ctx.lineTo(-15-f(6),0);ctx.lineTo(-6,4);ctx.strokeStyle=o.yellow;ctx.stroke()
    }
    ctx.restore()
  }
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['WAVE',wave],['SHIPS',lives],['COMBO','x'+(1+Math.min(4,Math.floor(combo/4)))]])
}

a.pad([['◀','ArrowLeft'],['▲','ArrowUp'],['FIRE','Space'],['▶','ArrowRight']]);
a.begin(function(){
  ship=spawnShip();score=0;lives=3;wave=1;bullets=[];ufoBullets=[];fireCd=0;invuln=2;combo=0;comboTimer=0;ufo=null;ufoCd=c(10,16);
  a.fx=[];
  buildWave();
  a.frame(step)
})
}),w('pelletProwler',b,'Pellet Prowler',o.yellow,'Gobble every pellet, snag the bonus fruit, and outrun four hunting ghosts.','Arrows / WASD to steer · swipe on mobile',function(r){var t,n,a,i,l,f,c,h,s,v,w,b,m,M,k,S=22,E=17,A=19,R=r.canvas(374,418),T=[[0,-1],[-1,0],[0,1],[1,0]],L=[o.coral,o.magenta,o.teal,o.orange],C=[[8,8],[7,9],[9,9],[8,9]],P=[[15,1],[1,1],[15,17],[1,17]],D=[0,2.5,5,8],O=[7,18,6,18,5,20,5,1e9],U=0,FRUIT_VALS=[100,300,500,700,1000],pelletTotal=0,fruitSpawned=!1,fruit=null,fruitTimer=0;

function I(r,n){return n>=0&&n<A&&r>=0&&r<E&&!t[n][r]}

function W(){var r,o;for(t=function(){var r,t,n,o,e,a,i,l,f=[],c={},h={};function s(r,t){return r>=0&&r<A&&t>=0&&t<E&&!f[r][t]}for(r=0;r<A;r++)for(f.push([]),t=0;t<E;t++)f[r].push(1);for(n=[[0,0]],f[1][1]=0,c['0,0']=1;n.length;)o=n[n.length-1],e=[],T.forEach(function(r){var t=o[0]+r[0],n=o[1]+r[1];t>=0&&t<4&&n>=0&&n<9&&!c[t+','+n]&&e.push([t,n,r])}),e.length?(a=u(e),c[a[0]+','+a[1]]=1,f[2*a[1]+1][2*a[0]+1]=0,f[2*o[1]+1+a[2][1]][2*o[0]+1+a[2][0]]=0,n.push([a[0],a[1]])):n.pop();for(r=1;r<18;r++)for(t=1;t<8;t++)f[r][t]||1===(e=T.filter(function(n){return s(r+n[1],t+n[0])})).length&&(e=T.filter(function(n){var o=r+n[1],e=t+n[0];return o>0&&o<18&&e>0&&e<8&&f[o][e]&&s(r+2*n[1],t+2*n[0])&&t+2*n[0]<8})).length&&(a=u(e),f[r+a[1]][t+a[0]]=0);for(r=1;r<18;r++)for(t=1;t<8;t++)if(f[r][t]){var y=r%2==0&&t%2==1;(r%2==1&&t%2==0&&t<7&&s(r,t-1)&&s(r,t+1)||y&&s(r-1,t)&&s(r+1,t))&&Math.random()<.22&&(f[r][t]=0)}for(r=0;r<A;r++)for(t=0;t<8;t++)f[r][16-t]=f[r][t]
;for([3,5,11,13,15].forEach(function(r){Math.random()<.5&&(f[r][8]=0)}),t=1;t<16;t++)f[1][t]=0,f[17][t]=0;for(t=6;t<=10;t++)f[8][t]=1,f[10][t]=1;for(f[9][6]=1,f[9][10]=1,f[9][7]=0,f[9][8]=0,f[9][9]=0,f[8][8]=0,f[7][8]=0,i=[[8,17]],h['8,17']=1;i.length;)l=i.pop(),T.forEach(function(r){var t=l[0]+r[0],n=l[1]+r[1];s(n,t)&&!h[t+','+n]&&(h[t+','+n]=1,i.push([t,n]))});for(r=0;r<A;r++)for(t=0;t<E;t++)f[r][t]||h[t+','+r]||(f[r][t]=1);return f}(),n=[],a=0,o=0;o<A;o++)for(n.push([]),r=0;r<E;r++)n[o].push(0),t[o][r]||9===o&&r>6&&r<10||8===o&&8===r||8===r&&17===o||(n[o][r]=1,a++);[[1,1],[15,1],[1,17],[15,17]].forEach(function(r){1===n[r[1]][r[0]]&&(n[r[1]][r[0]]=2)});pelletTotal=a;fruitSpawned=!1;fruit=null;fruitTimer=0;F()}

function F(){i={tx:8,ty:17,nx:8,ny:17,p:0,dx:0,dy:0,ld:null,arrive:N},f=[0,0],l=C.map(function(r,t){return{i:t,tx:r[0],ty:r[1],nx:r[0],ny:r[1],p:0,dx:0,dy:0,out:0===t,f