d(s,250-120*k,40+12*k,3,o.coral);else for(u=0;u<10;u++)s.strokeStyle=u%2?o.yellow:o.coral,s.lineWidth=5,s.beginPath(),s.moveTo(130,100),s.lineTo(130+Math.cos(.628*u)*(70+70*(1-c)),100+Math.sin(.628*u)*(70+70*(1-c))),s.stroke();for(x(s,'FUSE '+'▮'.repeat(6-e)+'▯'.repeat(e),320,100,13,o.dim),S=Math.min(38,360/t.length),u=0;u<t.length;u++)m=200-t.length*S/2+u*S+S/2,v(s,m-.35*S,236,m+.35*S,236,o.dim,3),(n[t.charAt(u)]||c>0&&e>=6)&&x(s,t.charAt(u).toUpperCase(),m,220,26,n[t.charAt(u)]?o.ink:o.coral);for(x(s,f,200,268,15,o.yellow),b=0;b<3;b++)for(u=0;u<w[b].length;u++)m=20+18*b+37*u,M=300+46*b,k=w[b].charAt(u),p(s,m+1,M,34,40,7,h[k]?t.indexOf(k)>-1?o.green:'rgba(255,107,74,.35)':o.grid),x(s,k.toUpperCase(),m+18,M+21,18,h[k]?o.bg:o.ink);r.fxStep(l),r.hud([['SCORE',y(a)],['DEFUSED',i]])}r.press=function(r){m(r)},r.pointer({down:function(r){var t,n,o,e,a;for(t=0;t<3;t++)for(o=w[t],n=0;n<o.length;n++)e=20+18*t+37*n+18,a=300+46*t+20,Math.abs(r.x-e)<18&&Math.abs(r.y-a)<21&&m(o.charAt(n))}}),
r.begin(function(){a=0,i=0,b(),r.fx=[],r.frame(M)})}),w('wordHunt',S,'Word Hunt',o.teal,'Find every hidden word in the letter grid, in any direction, before time runs out.','Drag from the first to the last letter · or Space to anchor, arrows to stretch, Space to confirm',function(t){var n,e,a,i,l,c,s,d,w,b,m,M,k,S,E,A=400,T=10,L=36,C=120,P=t.canvas(A,500),D=[[1,0],[0,1],[1,1],[-1,1],[-1,0],[0,-1],[-1,-1],[1,-1]],O=[o.coral,o.yellow,o.green,o.blue,o.violet,o.magenta,o.orange,o.teal];function U(){var r,t,o,s,y,p,x,v,g;do{for(n=[],o=0;o<100;o++)n.push('');r=h(R.filter(function(r){return r.length>=4&&r.length<=8})).slice(0,6),e=[],r.forEach(function(r){for(t=0;t<200;t++){for(y=u(D),p=f(T),x=f(T),s=!0,v=0;v<r.length;v++)if(g=(x+y[1]*v)*T+p+y[0]*v,p+y[0]*v<0||p+y[0]*v>=T||x+y[1]*v<0||x+y[1]*v>=T||n[g]&&n[g]!==r.charAt(v)){s=!1;break}if(s){for(v=0;v<r.length;v++)n[(x+y[1]*v)*T+p+y[0]*v]=r.charAt(v);e.push(r);break}}})}while(e.length<5)
;for(o=0;o<100;o++)n[o]||(n[o]=String.fromCharCode(97+f(26)));a={},i={},l=Math.max(60,100-4*c),d=null,w=null,b=!1,m=0,k=null,E=''}function I(r,t){var n,o=t.x-r.x,e=t.y-r.y,a=Math.abs(o),i=Math.abs(e);for(a>2*i?e=0:i>2*a?o=0:(n=Math.max(a,i),o=Math.sign(o)*n,e=Math.sign(e)*n);r.x+o<0||r.x+o>=T||r.y+e<0||r.y+e>=T;)o-=Math.sign(o),e-=Math.sign(e);return{x:r.x+o,y:r.y+e}}function W(r,t){var n,o=[],e=Math.sign(t.x-r.x),a=Math.sign(t.y-r.y),i=Math.max(Math.abs(t.x-r.x),Math.abs(t.y-r.y));for(n=0;n<=i;n++)o.push((r.y+a*n)*T+r.x+e*n);return o}function F(r,f){var u,h=W(r,f),y=h.map(function(r){return n[r]}).join(''),p=y.split('').reverse().join(''),x=e.filter(function(r){return!a[r]&&(r===y||r===p)})[0];!x||h.length<2?m=.3:(a[x]=1,u=O[Object.keys(a).length%O.length],h.forEach(function(r){i[r]=u}),s+=20,t.burst(20+(f.x+.5)*L,C+(f.y+.5)*L,u,14),e.every(function(r){return a[r]})&&(s+=50+Math.floor(l),c++,E='Grid cleared!',b=!1,d=null,t.burst(200,250,o.yellow,40),t.later(U,1300),l+=0))}
function B(r){var t=Math.floor((r.x-20)/L),n=Math.floor((r.y-C)/L);return t>=0&&n>=0&&t<T&&n<T?{x:t,y:n}:null}function H(r){if((l-=r)<=0)return q(r),void t.over(s,'Time is up with '+e.filter(function(r){return!a[r]}).length+' words still hidden. Score: '+s);q(r)}function q(f){var u,h,b,R,D,O={};for(m>0&&(m-=f),g(P,A,500),x(P,'GRID '+(c+1)+' · '+Math.max(0,Math.ceil(l))+'s',200,20,16,l<15?o.coral:o.ink),e.forEach(function(r,t){x(P,r.toUpperCase(),20+t%3*125,52+26*Math.floor(t/3),15,a[r]?o.dim:o.ink,'left'),a[r]&&v(P,20+t%3*125,52+26*Math.floor(t/3),20+t%3*125+11*r.length,52+26*Math.floor(t/3),o.green,2)}),R=d||k,D=d?w:k?I(k,M):null,R&&D&&W(R,D).forEach(function(r){O[r]=1}),u=0;u<100;u++)h=20+u%T*L,b=C+Math.floor(u/T)*L,p(P,h+1,b+1,34,34,8,O[u]?m>0?o.coral:o.dim:i[u]?i[u]:o.grid),x(P,n[u].toUpperCase(),h+18,b+18+1,19,i[u]?o.bg:o.ink);S&&(P.strokeStyle=o.ink,P.lineWidth=2,r.L(P,20+M.x*L+2,C+M.y*L+2,32,32,8),P.stroke()),x(P,E,200,106,14,o.yellow),t.fxStep(f),
t.hud([['SCORE',y(s)],['FOUND',Object.keys(a).length+'/'+e.length]])}t.pointer({down:function(r){var t=B(r);S=!1,t&&(d=t,w=t,b=!0)},move:function(r,t,n){var o;b&&d&&(o=B(r))&&(w=I(d,o))},up:function(){b&&d&&w&&F(d,w),b=!1,d=null,w=null}}),t.press=function(r){S=!0,'ArrowLeft'===r||'a'===r?M.x=Math.max(0,M.x-1):'ArrowRight'===r||'d'===r?M.x=Math.min(9,M.x+1):'ArrowUp'===r||'w'===r?M.y=Math.max(0,M.y-1):'ArrowDown'===r||'s'===r?M.y=Math.min(9,M.y+1):' '===r||'Enter'===r?k?(F(k,I(k,M)),k=null):k={x:M.x,y:M.y}:'Escape'===r&&(k=null)},t.pad([['◀','ArrowLeft'],['▲','ArrowUp'],['▼','ArrowDown'],['▶','ArrowRight'],['Mark','Space']]),t.begin(function(){c=0,s=0,M={x:4,y:4},S=!1,U(),t.fx=[],t.frame(H)})}),w('laneLeaper',b,'Lane Leaper',o.green,'Hop across traffic and a sinking river — chain pad-fills for a rising streak bonus.','Arrows / WASD to hop · swipe on mobile',function(r){
var lanes,frog,pads,lives,score,level,timer,hitLock,elapsed,streak;
var TILE=30,W=390,ctx=r.canvas(W,390),PAD_X=[45,120,195,270,345];

function makeLane(row,kind,width,gap,speed,color){
  var period=width+gap,count=Math.ceil((W+period)/period)+1,offset=f(period),instances=[];
  for(var i=0;i<count;i++)instances.push(i*period+offset);
  return{row:row,kind:kind,w:width,period:period,count:count,sp:speed,it:instances,col:color}
}

function buildLanes(){
  var mul=1+.12*level;
  lanes=[
    makeLane(1,'log',90,110,38*mul),
    makeLane(2,'turtle',96,80,-46*mul),
    makeLane(3,'log',150,100,54*mul),
    makeLane(4,'log',70,120,-42*mul),
    makeLane(5,'turtle',64,100,60*mul),
    makeLane(7,'car',34,130,-50*mul,o.coral),
    makeLane(8,'truck',64,150,42*mul,o.violet),
    makeLane(9,'car',34,90,-78*mul,o.yellow),
    makeLane(10,'car',34,110,66*mul,o.blue),
    makeLane(11,'truck',60,170,-38*mul,o.orange)
  ]
}

function resetFrog(){frog={x:195,r:12,top:12};timer=Math.max(18,30-2*(level-1));hitLock=0}

function die(kind){
  if(hitLock>0)return;
  lives--;streak=0;
  r.burst(frog.x,frog.r*TILE+15,kind==='car'?o.coral:'#7fb5ff',22);
  hitLock=.7
}

function hop(dx,dy){
  if(hitLock>0)return;
  if(dy){
    frog.r=s(frog.r+dy,0,12);
    if(dy<0&&frog.r<frog.top){frog.top=frog.r;score+=10}
  }
  if(dx)frog.x=s(frog.x+dx*TILE,15,375);
  if(frog.r===0){
    var hit=-1;
    for(var i2=0;i2<5;i2++)if(Math.abs(frog.x-PAD_X[i2])<22)hit=i2;
    if(hit<0||pads[hit])die('bush');
    else{
      pads[hit]=1;
      score+=50+2*Math.floor(timer)+25*streak;
      streak++;
      r.burst(PAD_X[hit],15,o.green,18);
      if(pads.every(function(v2){return v2})){
        score+=500;level++;pads=[0,0,0,0,0];buildLanes()
      }
      resetFrog()
    }
  }
}

function step(dt){
  elapsed+=dt;
  lanes.forEach(function(ln){
    ln.it=ln.it.map(function(px){
      px+=ln.sp*dt;
      if(ln.sp>0&&px>W+20)px-=ln.count*ln.period;
      if(ln.sp<0&&px+ln.w<-20)px+=ln.count*ln.period;
      return px
    })
  });
  if(hitLock>0){
    hitLock-=dt;
    if(hitLock<=0){
      if(lives<=0){draw(dt);r.over(score,'Level '+level+' · Score: '+score);return}
      resetFrog()
    }
    draw(dt);return
  }
  timer-=dt;
  if(timer<=0){die('time')}
  else{
    var ln=lanes.filter(function(l2){return l2.row===frog.r})[0];
    if(ln){
      if(ln.kind==='log'||ln.kind==='turtle'){
        var submerged=ln.kind==='turtle'&&Math.sin(elapsed*1.4+ln.row*1.7)<-.5;
        var riding=!submerged&&ln.it.some(function(px){return frog.x>=px-4&&frog.x<=px+ln.w+4});
        if(riding){
          frog.x+=ln.sp*dt;
          if(frog.x<8||frog.x>382)die('edge')
        }else die('water')
      }else{
        if(ln.it.some(function(px){return frog.x>px-10&&frog.x<px+ln.w+10}))die('car')
      }
    }
  }
  draw(dt)
}

function draw(dt){
  g(ctx,W,390,'#12102a');
  ctx.fillStyle='#1e5a3a';ctx.fillRect(0,0,W,TILE);
  ctx.fillStyle='#0f2f57';ctx.fillRect(0,TILE,W,150);
  ctx.fillStyle='#2a2350';ctx.fillRect(0,180,W,TILE);
  ctx.fillRect(0,360,W,TILE);
  ctx.fillStyle='#1c1c30';ctx.fillRect(0,210,W,150);
  for(var i3=0;i3<5;i3++){
    d(ctx,PAD_X[i3],15,14,'#0f2f57');
    if(pads[i3]){d(ctx,PAD_X[i3],15,10,o.green);d(ctx,PAD_X[i3]-4,12,2.5,o.ink);d(ctx,PAD_X[i3]+4,12,2.5,o.ink)}
  }
  for(var rr=8;rr<=11;rr++){ctx.setLineDash([10,12]);v(ctx,0,rr*TILE,W,rr*TILE,'rgba(233,251,249,.18)',1);ctx.setLineDash([])}
  lanes.forEach(function(ln){
    var submerged=ln.kind==='turtle'&&Math.sin(elapsed*1.4+ln.row*1.7)<-.5;
    ln.it.forEach(function(px){
      var yy=ln.row*TILE;
      if(ln.kind==='log'){
        p(ctx,px,yy+4,ln.w,22,8,'#a5763b');p(ctx,px+6,yy+9,ln.w-12,3,2,'#c9964f')
      }else if(ln.kind==='turtle'){
        var cnt=Math.floor(ln.w/32);
        for(var tt=0;tt<cnt;tt++){
          var cx=px+16+32*tt,cy=yy+15+(submerged?6:0);
          d(ctx,cx,cy,13,submerged?'#155e58':o.teal);
          if(!submerged)d(ctx,cx,cy,7,'#1f9c92')
        }
      }else{
        p(ctx,px,yy+4,ln.w,22,6,ln.col);p(ctx,px+(ln.sp>0?ln.w-12:4),yy+8,8,14,2,o.bg)
      }
    })
  });
  if(hitLock<=0||Math.floor(10*hitLock)%2){
    d(ctx,frog.x,frog.r*TILE+15,11,o.green);
    d(ctx,frog.x-5,frog.r*TILE+10,3.5,o.ink);d(ctx,frog.x+5,frog.r*TILE+10,3.5,o.ink);
    d(ctx,frog.x-5,frog.r*TILE+10,1.5,o.bg);d(ctx,frog.x+5,frog.r*TILE+10,1.5,o.bg)
  }
  r.fxStep(dt);
  ctx.fillStyle=timer<8?o.coral:o.teal;
  ctx.fillRect(0,386,W*s(timer/30,0,1),4);
  r.hud([['SCORE',y(score)],['LIVES',lives],['LEVEL',level],['STREAK',streak]])
}

r.press=function(k){var t2={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[k];if(t2)hop(t2[0],t2[1])};
r.swipe(function(d2){hop({left:-1,right:1}[d2]||0,{up:-1,down:1}[d2]||0)});
r.pointer({down:function(pt){
  if(Math.abs(pt.x-frog.x)>40||Math.abs(pt.y-(frog.r*TILE+15))>40)
    hop(pt.x<frog.x-40?-1:pt.x>frog.x+40?1:0, pt.y<frog.r*TILE?-1:pt.y>frog.r*TILE+30?1:0);
  else hop(0,-1)
}});
r.pad([['▲','ArrowUp'],['◀','ArrowLeft'],['▶','ArrowRight'],['▼','ArrowDown']]);
r.begin(function(){
  lives=3;score=0;level=1;pads=[0,0,0,0,0];elapsed=0;streak=0;
  r.fx=[];
  buildLanes();resetFrog();
  r.frame(step)
})
}),w('swarmStrike',b,'Swarm Strike',o.magenta,'Shoot down a swarm that swoops in, forms up and dive-bombs you — armored flagships take two hits.','Arrows / A D to move · hold Space to fire',function(a){
var W=400,H=480,ctx=a.canvas(W,H),COLORS=[o.magenta,o.orange,o.yellow,o.green,o.blue];
var px,bullets,enemyBullets,enemies,lives,score,wave,fireCd,diveCd,invuln,animT,combo,comboTimer;

function bezier2(p0,p1,p2,t){var it=1-t;return{x:it*it*p0.x+2*it*t*p1.x+t*t*p2.x,y:it*it*p0.y+2*it*t*p1.y+t*t*p2.y}}
function formationPos(en){return{x:60+40*en.col+22*Math.sin(.9*animT),y:70+32*en.row+3*Math.sin(1.7*animT+en.col)}}

function buildWave(){
  var idx=0,rows=Math.min(5,3+Math.ceil(wave/2));
  enemies=[];enemyBullets=[];bullets=[];diveCd=3;
  for(var row=0;row<rows;row++)for(var col=0;col<8;col++){
    var side=(col+row)%2;
    enemies.push({row:row,col:col,st:'in',u:.09*-idx,side:side,x:-40,y:-40,dur:1.9,sx:side?-20:420,sy:110+20*row,hp:row===0?2:1});
    idx++
  }
}

function step(dt){
  animT+=dt;fireCd-=dt;diveCd-=dt;comboTimer-=dt;
  if(comboTimer<=0)combo=0;
  px=s(px+250*a.ax()*dt,20,380);
  if(a.k[' ']&&fireCd<=0&&bullets.length<3){bullets.push({x:px,y:436});fireCd=.16}
  for(var bi=bullets.length-1;bi>=0;bi--){bullets[bi].y-=520*dt;if(bullets[bi].y<-10)bullets.splice(bi,1)}

  if(diveCd<=0){
    var diveCount=Math.min(1+Math.floor(wave/3),3);
    h(enemies.filter(function(en){return en.st==='form'})).slice(0,diveCount).forEach(function(en){
      en.st='dive';en.u=0;en.dur=Math.max(1.5,2.6-.1*wave);en.fired=!1;
      en.p0={x:en.x,y:en.y};
      en.p1={x:s(px+c(-140,140),20,380),y:330};
      en.p2={x:s(px+c(-160,160),20,380),y:520}
    });
    diveCd=Math.max(.6,2.4-.16*wave)
  }

  enemies.forEach(function(en){
    var target=formationPos(en);
    if(en.st==='in'){
      en.u+=dt/en.dur;
      if(en.u<0)return;
      if(en.u>=1){en.st='form';return}
      var pos=bezier2({x:en.sx,y:en.sy},{x:en.side?340:60,y:360},target,en.u);
      en.x=pos.x;en.y=pos.y;return
    }
    if(en.st==='form'){en.x=target.x;en.y=target.y;return}
    if(en.st==='dive'){
      en.u+=dt/en.dur;
      if(en.u>=1){en.st='back';en.u=0;en.x=target.x;en.y=-20;return}
      var pos2=bezier2(en.p0,en.p1,en.p2,en.u);
      en.x=pos2.x;en.y=pos2.y;
      if(!en.fired&&en.u>.3){
        en.fired=!0;
        if(enemyBullets.length<6){
          var dx=px-en.x,dy=440-en.y,dd=Math.hypot(dx,dy)||1,spd=170+8*wave;
          enemyBullets.push({x:en.x,y:en.y+8,vx:dx/dd*spd*.6,vy:Math.abs(dy/dd)*spd+40})
        }
      }
      return
    }
    if(en.st==='back'){
      en.u+=dt/.9;
      if(en.u>=1)en.st='form';
      en.x=target.x;
      en.y=(target.y+20)*Math.min(1,en.u)-20
    }
  });

  for(var bj=bullets.length-1;bj>=0;bj--){
    var bl=bullets[bj];
    for(var ei=0;ei<enemies.length;ei++){
      var en2=enemies[ei];
      if(en2.st==='in'&&en2.u<0)continue;
      if(Math.abs(en2.x-bl.x)<14&&Math.abs(en2.y-bl.y)<12){
        en2.hp--;
        bullets.splice(bj,1);
        if(en2.hp<=0){
          var mult=1+Math.min(4,Math.floor(combo/5));
          var base=en2.st==='dive'?100+10*en2.row:50;
          score+=base*mult;combo++;comboTimer=2.4;
          a.burst(en2.x,en2.y,COLORS[en2.row],12);
          enemies.splice(ei,1)
        }else{
          a.burst(en2.x,en2.y,o.ink,6)
        }
        break
      }
    }
  }

  for(var ebi=enemyBullets.length-1;ebi>=0;ebi--){
    var eb=enemyBullets[ebi];eb.x+=eb.vx*dt;eb.y+=eb.vy*dt;
    if(eb.y>490||eb.x<-10||eb.x>410)enemyBullets.splice(ebi,1)
  }

  if(invuln<=0){
    var hitBullet=enemyBullets.filter(function(eb){return Math.abs(eb.x-px)<12&&Math.abs(eb.y-446)<14})[0];
    var hitDiver=enemies.filter(function(en){return en.st==='dive'&&Math.abs(en.x-px)<18&&Math.abs(en.y-446)<18})[0];
    if(hitBullet||hitDiver){
      lives--;invuln=2;enemyBullets=[];combo=0;
      a.burst(px,446,o.blue,26);
      if(hitDiver)enemies.splice(enemies.indexOf(hitDiver),1);
      if(lives<=0){draw(dt);a.over(score,'Wave '+wave+' · Score: '+score);return}
    }
  }
  invuln-=dt;
  if(!enemies.length){wave++;score+=200;invuln=1.5;buildWave()}
  draw(dt)
}

function draw(dt){
  var wobble=5*Math.sin(14*animT);
  g(ctx,W,H);
  for(var si=0;si<30;si++)d(ctx,137*si%W,(71*si+30*animT*(1+si%3))%H,1,'rgba(233,251,249,.35)');
  enemies.forEach(function(en){
    if(en.st==='in'&&en.u<0)return;
    var col=COLORS[en.row];
    ctx.beginPath();ctx.moveTo(en.x-6,en.y-2);ctx.lineTo(en.x-17,en.y-8+wobble);ctx.lineTo(en.x-13,en.y+6);ctx.closePath();ctx.fillStyle=col;ctx.fill();
    ctx.beginPath();ctx.moveTo(en.x+6,en.y-2);ctx.lineTo(en.x+17,en.y-8+wobble);ctx.lineTo(en.x+13,en.y+6);ctx.closePath();ctx.fill();
    d(ctx,en.x,en.y,8,en.hp>1?o.ink:col);
    if(en.hp>1)d(ctx,en.x,en.y,5,col);
    d(ctx,en.x-3,en.y-1,2.4,o.bg);d(ctx,en.x+3,en.y-1,2.4,o.bg)
  });
  ctx.fillStyle=o.ink;
  bullets.forEach(function(bl){ctx.fillRect(bl.x-2,bl.y-8,4,14)});
  ctx.fillStyle=o.coral;
  enemyBullets.forEach(function(eb){d(ctx,eb.x,eb.y,4,o.coral)});
  if(invuln<=0||Math.floor(10*invuln)%2){
    ctx.beginPath();ctx.moveTo(px,424);ctx.lineTo(px-8,450);ctx.lineTo(px-20,458);ctx.lineTo(px+20,458);ctx.lineTo(px+8,450);ctx.closePath();
    ctx.fillStyle=o.blue;ctx.fill();
    p(ctx,px-3,430,6,24,3,o.ink)
  }
  a.fxStep(dt);
  for(var li=0;li<lives;li++)p(ctx,10+18*li,466,12,8,3,o.blue);
  a.hud([['SCORE',y(score)],['WAVE',wave],['SHIPS',lives],['COMBO','x'+(1+Math.min(4,Math.floor(combo/5)))]])
}

a.pad([['◀','ArrowLeft'],['FIRE','Space'],['▶','ArrowRight']]);
a.begin(function(){
  px=200;lives=3;score=0;wave=1;fireCd=1.5;diveCd=3;invuln=1.5;animT=0;combo=0;comboTimer=0;
  a.fx=[];
  buildWave();
  a.frame(step)
})
}),w('vineCrawler',b,'Vine Crawler',o.green,'A segmented crawler snakes through your garden while a mushroom-eating spider stalks the field — chain kills for a bonus multiplier.','Arrows / WASD to move · hold Space to fire',function(a){
var TILE=20,COLS=20,CEIL_ROW=17,W=400,H=460,ctx=a.canvas(W,H);
var grid,worms,player,bullets,spider,lives,score,wave,fireCd,hitFreeze,moveAcc,spiderCd,elapsed,combo,comboTimer;

function gridAt(row,col){return row>=0&&row<23&&col>=0&&col<COLS?grid[row][col]:0}

function buildCentipede(){
  var segCount=Math.max(3,13-wave),mainSeg=[];
  for(var i=0;i<segCount;i++)mainSeg.push({c:-i,r:0});
  worms=[{seg:mainSeg,dir:1,vd:1}];
  for(var j=0;j<wave-1&&j<6;j++)worms.push({seg:[{c:24+5*j,r:0}],dir:-1,vd:1})
}

function onPlayerHit(){
  lives--;hitFreeze=2;a.burst(player.x,player.y,o.ink,26);
  player.x=200;player.y=440;spider=null;spiderCd=c(4,7)
}

function advanceCentipede(){
  worms.forEach(function(worm){
    var head=worm.seg[0],nextCol=head.c+worm.dir,nextRow=head.r;
    if((head.c<0&&worm.dir>0)||(head.c>=COLS&&worm.dir<0)){
      nextCol=head.c+worm.dir
    }else if(nextCol<0||nextCol>=COLS||gridAt(head.r,nextCol)>0){
      nextCol=head.c;
      nextRow=head.r+worm.vd;
      worm.dir=-w