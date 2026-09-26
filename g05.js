orm.dir;
      if(nextRow>22){worm.vd=-1;nextRow=head.r-1}
      else if(worm.vd<0&&nextRow<CEIL_ROW){worm.vd=1;nextRow=head.r+1}
    }
    for(var t=worm.seg.length-1;t>0;t--)worm.seg[t]={c:worm.seg[t-1].c,r:worm.seg[t-1].r};
    worm.seg[0]={c:nextCol,r:nextRow}
  })
}

function step(dt){
  var moveInterval=Math.max(.045,.1-.004*wave);
  elapsed+=dt;hitFreeze-=dt;fireCd-=dt;comboTimer-=dt;
  if(comboTimer<=0)combo=0;
  player.x=s(player.x+200*a.ax()*dt,8,392);
  player.y=s(player.y+200*a.ay()*dt,348,452);
  if(a.k[' ']&&fireCd<=0&&bullets.length<3){bullets.push({x:player.x,y:player.y-10});fireCd=.13}
  moveAcc+=dt;
  while(moveAcc>=moveInterval){moveAcc-=moveInterval;advanceCentipede()}

  spiderCd-=dt;
  if(spiderCd<=0&&!spider){
    var fromLeft=f(2);
    spider={x:fromLeft?-12:412,y:c(360,440)};
    spider.d=spider.x<0?1:-1;
    spider.by=spider.y;
    spiderCd=Math.max(3,c(6,10)-.25*wave)
  }
  if(spider){
    spider.x+=(90+4*wave)*spider.d*dt;
    spider.y=s(spider.by+36*Math.sin(3.2*elapsed),346,452);
    var scol=Math.floor(spider.x/TILE),srow=Math.floor(spider.y/TILE);
    if(gridAt(srow,scol))grid[srow][scol]=0;
    if((spider.d>0&&spider.x>420)||(spider.d<0&&spider.x<-20))spider=null
  }

  for(var bi=bullets.length-1;bi>=0;bi--){
    var bl=bullets[bi];
    bl.y-=620*dt;
    var bc=Math.floor(bl.x/TILE),br=Math.floor(bl.y/TILE);
    if(bl.y<0){bullets.splice(bi,1);continue}
    if(gridAt(br,bc)>0){
      grid[br][bc]--;score+=1;bullets.splice(bi,1);continue
    }
    if(spider&&Math.hypot(spider.x-bl.x,spider.y-bl.y)<14){
      var dist=Math.hypot(spider.x-player.x,spider.y-player.y);
      var bonus=dist<70?900:dist<140?600:300;
      score+=bonus;combo++;comboTimer=2.5;
      a.burst(spider.x,spider.y,o.violet,18);
      spider=null;bullets.splice(bi,1);continue
    }
    hitLoop: for(var wi=0;wi<worms.length;wi++){
      var worm=worms[wi];
      for(var si=0;si<worm.seg.length;si++){
        if(worm.seg[si].c===bc&&worm.seg[si].r===br){
          var mult=1+Math.min(4,Math.floor(combo/4));
          score+=(si===0?100:10)*mult;combo++;comboTimer=2.5;
          a.burst(bc*TILE+10,br*TILE+10,o.green,10);
          grid[br][bc]=4;
          if(si<worm.seg.length-1)worms.push({seg:worm.seg.slice(si+1),dir:worm.dir,vd:worm.vd});
          worm.seg=worm.seg.slice(0,si);
          if(!worm.seg.length)worms.splice(wi,1);
          bullets.splice(bi,1);
          break hitLoop
        }
      }
    }
  }

  if(hitFreeze<=0){
    var spiderTouch=spider&&Math.hypot(spider.x-player.x,spider.y-player.y)<16;
    var segTouch=worms.some(function(worm){return worm.seg.some(function(sg){return Math.abs(sg.c*TILE+10-player.x)<14&&Math.abs(sg.r*TILE+10-player.y)<14})});
    if(spiderTouch||segTouch){onPlayerHit();combo=0}
    if(lives<=0){draw(dt);a.over(score,'Wave '+wave+' · Score: '+score);return}
  }

  if(!worms.length){
    wave++;score+=200;
    for(var mi=0;mi<8;mi++)grid[1+f(16)][f(COLS)]=4;
    buildCentipede()
  }
  draw(dt)
}

function draw(dt){
  var mushroomColors=['','#6b2a55','#a03a70','#d94a8c',o.magenta];
  g(ctx,W,H);
  ctx.fillStyle='rgba(255,255,255,.03)';
  ctx.fillRect(0,340,W,120);
  for(var row=0;row<23;row++){
    for(var col=0;col<COLS;col++){
      var hp=grid[row][col];
      if(hp){
        var px2=col*TILE,py2=row*TILE;
        p(ctx,px2+7,py2+10,6,9,2,'#d9c7f2');
        ctx.beginPath();ctx.arc(px2+10,py2+11,9,Math.PI,0);ctx.closePath();
        ctx.fillStyle=mushroomColors[hp];ctx.fill()
      }
    }
  }
  worms.forEach(function(worm){
    worm.seg.forEach(function(seg,idx){
      if(seg.c<0||seg.c>=COLS)return;
      d(ctx,seg.c*TILE+10,seg.r*TILE+10,idx?8.5:9.5,idx?(idx%2?o.green:'#2fb57a'):o.yellow);
      if(!idx){d(ctx,seg.c*TILE+7,seg.r*TILE+8,2,o.bg);d(ctx,seg.c*TILE+13,seg.r*TILE+8,2,o.bg)}
    })
  });
  if(spider){
    d(ctx,spider.x,spider.y,9,o.violet);
    for(var wsign=-1;wsign<=1;wsign+=2){
      v(ctx,spider.x,spider.y,spider.x+14*wsign,spider.y-8,o.violet,2);
      v(ctx,spider.x,spider.y,spider.x+14*wsign,spider.y+8,o.violet,2)
    }
    d(ctx,spider.x-3,spider.y-2,2,o.ink);d(ctx,spider.x+3,spider.y-2,2,o.ink)
  }
  ctx.fillStyle=o.ink;
  bullets.forEach(function(bl){ctx.fillRect(bl.x-1.5,bl.y-6,3,12)});
  if(hitFreeze<=0||Math.floor(10*hitFreeze)%2){
    ctx.beginPath();ctx.moveTo(player.x,player.y-11);ctx.lineTo(player.x-10,player.y+8);ctx.lineTo(player.x+10,player.y+8);ctx.closePath();
    ctx.fillStyle=o.teal;ctx.fill()
  }
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['WAVE',wave],['LIVES',lives],['COMBO','x'+(1+Math.min(4,Math.floor(combo/4)))]])
}

a.pad([['▲','ArrowUp'],['◀','ArrowLeft'],['FIRE','Space'],['▶','ArrowRight'],['▼','ArrowDown']]);
a.pointer({move:function(pt,ev,isDown){if(isDown){player.x=s(pt.x,8,392);player.y=s(pt.y-30,348,452)}},down:function(){a.k[' ']=1},up:function(){delete a.k[' ']}});
a.begin(function(){
  grid=[];
  for(var row=0;row<23;row++){grid.push([]);for(var col=0;col<COLS;col++)grid[row].push(0)}
  for(var i=0;i<45;i++)grid[1+f(16)][f(COLS)]=4;
  player={x:200,y:440};bullets=[];spider=null;lives=3;score=0;wave=1;fireCd=0;hitFreeze=0;moveAcc=0;spiderCd=c(4,7);elapsed=0;combo=0;comboTimer=0;
  a.fx=[];
  buildCentipede();
  a.frame(step)
})
}),w('skyShield',b,'Sky Shield',o.teal,'Aim, tap and detonate. Keep six cities alive, chain blasts for bonus combos, and hoard ammo to rebuild.','Click / tap to fire · or arrows to aim and Space to fire',function(a){
var W=400,H=400,ctx=a.canvas(W,H),CITY_X=[45,95,145,255,305,355],BATTERY_X=[20,200,380];
var cities,ammo,enemyMissiles,interceptors,explosions,aimX,aimY,wave,score,missilesLeft,spawnCd,combo,comboTimer;

function nearestBattery(tx){
  var bestDist=1e9,bestIdx=-1;
  for(var i=0;i<3;i++){
    if(ammo[i]>0){
      var dd=Math.abs(BATTERY_X[i]-tx)+(i===1?-70:0);
      if(dd<bestDist){bestDist=dd;bestIdx=i}
    }
  }
  return bestIdx
}

function fireInterceptor(tx,ty){
  ty=Math.min(ty,340);
  var idx=nearestBattery(tx);
  if(idx<0)return;
  ammo[idx]--;
  interceptors.push({x:BATTERY_X[idx],y:372,sx:BATTERY_X[idx],sy:372,tx:tx,ty:ty})
}

function pickTarget(){
  var opts=[];
  cities.forEach(function(alive,idx){if(alive)opts.push([CITY_X[idx],378])});
  BATTERY_X.forEach(function(bx){opts.push([bx,378])});
  return u(opts)
}

function spawnMissile(sx,sy){
  var target=pickTarget();
  enemyMissiles.push({sx:sx,sy:sy,x:sx,y:sy,tx:target[0],ty:target[1],sp:30+4*wave+f(14),split:!1})
}

function initWave(){
  ammo=[10,10,10];enemyMissiles=[];interceptors=[];explosions=[];
  missilesLeft=6+3*wave;spawnCd=1
}

function step(dt){
  aimX=s(aimX+220*a.ax()*dt,0,W);
  aimY=s(aimY+220*a.ay()*dt,0,340);
  spawnCd-=dt;
  if(missilesLeft>0&&spawnCd<=0){
    spawnMissile(c(10,390),0);
    missilesLeft--;
    spawnCd=Math.max(.35,1.5-.09*wave)*c(.5,1.3)
  }
  for(var ii=interceptors.length-1;ii>=0;ii--){
    var ic=interceptors[ii],dist=Math.hypot(ic.tx-ic.x,ic.ty-ic.y);
    if(dist<420*dt){
      explosions.push({x:ic.tx,y:ic.ty,t:0,m:34,bad:!1});
      interceptors.splice(ii,1)
    }else{
      ic.x+=(ic.tx-ic.x)/dist*420*dt;
      ic.y+=(ic.ty-ic.y)/dist*420*dt
    }
  }
  for(var ei=explosions.length-1;ei>=0;ei--){
    explosions[ei].t+=dt;
    if(explosions[ei].t>1.3)explosions.splice(ei,1)
  }
  comboTimer-=dt;
  if(comboTimer<=0)combo=0;
  for(var mi=enemyMissiles.length-1;mi>=0;mi--){
    var ms=enemyMissiles[mi],mdist=Math.hypot(ms.tx-ms.x,ms.ty-ms.y);
    if(mdist<ms.sp*dt){
      explosions.push({x:ms.tx,y:ms.ty,t:0,m:26,bad:!0});
      var cIdx=CITY_X.findIndex(function(cx,idx2){return cities[idx2]&&Math.abs(cx-ms.tx)<2});
      if(cIdx>=0){cities[cIdx]=0;a.burst(ms.tx,ms.ty,o.coral,20)}
      var bIdx=BATTERY_X.indexOf(ms.tx);
      if(bIdx>=0)ammo[bIdx]=0;
      enemyMissiles.splice(mi,1)
    }else{
      ms.x+=(ms.tx-ms.x)/mdist*ms.sp*dt;
      ms.y+=(ms.ty-ms.y)/mdist*ms.sp*dt;
      if(wave>=2&&!ms.split&&ms.y>90&&ms.y<200&&Math.random()<(.35+.02*Math.min(wave,10))*dt){
        ms.split=!0;
        spawnMissile(ms.x,ms.y);
        spawnMissile(ms.x,ms.y)
      }
      for(var xi=0;xi<explosions.length;xi++){
        var ex=explosions[xi];
        if(!ex.bad&&Math.hypot(ex.x-ms.x,ex.y-ms.y)<34*Math.sin(Math.min(1,ex.t/1.3)*Math.PI)){
          var mult=1+Math.min(4,Math.floor(combo/3));
          score+=25*mult;combo++;comboTimer=2;
          explosions.push({x:ms.x,y:ms.y,t:0,m:26,bad:!1});
          a.burst(ms.x,ms.y,o.yellow,8);
          enemyMissiles.splice(mi,1);
          break
        }
      }
    }
  }
  var aliveCount=0;
  cities.forEach(function(v2){aliveCount+=v2});
  if(aliveCount===0&&!explosions.length){draw(dt);a.over(score,'Wave '+wave+' · Score: '+score);return}
  if(aliveCount!==0){
    if(!missilesLeft&&!enemyMissiles.length&&!explosions.length&&!interceptors.length){
      var bonus=100*aliveCount+5*ammo[0]+5*ammo[1]+5*ammo[2];
      score+=bonus;
      if(ammo[0]+ammo[1]+ammo[2]>=15){
        var dead=[];cities.forEach(function(v3,idx3){if(!v3)dead.push(idx3)});
        if(dead.length)cities[u(dead)]=1
      }
      wave++;
      initWave()
    }
  }
  draw(dt)
}

function draw(dt){
  g(ctx,W,H);
  ctx.fillStyle='#1d1a3c';ctx.fillRect(0,378,W,22);
  cities.forEach(function(alive,idx){
    if(alive){p(ctx,CITY_X[idx]-14,366,28,12,2,o.teal);p(ctx,CITY_X[idx]-8,358,6,10,1,o.teal);p(ctx,CITY_X[idx]+2,360,6,8,1,o.teal)}
    else p(ctx,CITY_X[idx]-12,375,24,4,1,'#3a2a7a')
  });
  BATTERY_X.forEach(function(bx,idx){
    ctx.beginPath();ctx.moveTo(bx-14,378);ctx.lineTo(bx,364);ctx.lineTo(bx+14,378);ctx.closePath();
    ctx.fillStyle=ammo[idx]?o.violet:'#3a2a7a';ctx.fill();
    x(ctx,ammo[idx],bx,388,10,o.ink)
  });
  enemyMissiles.forEach(function(ms){v(ctx,ms.sx,ms.sy,ms.x,ms.y,o.coral,1.5);d(ctx,ms.x,ms.y,2.5,o.ink)});
  interceptors.forEach(function(ic){v(ctx,ic.sx,ic.sy,ic.x,ic.y,o.blue,1.5);d(ctx,ic.x,ic.y,2.5,o.ink)});
  explosions.forEach(function(ex){
    var rad=ex.m*Math.sin(Math.min(1,ex.t/1.3)*Math.PI);
    d(ctx,ex.x,ex.y,Math.max(.1,rad),ex.bad?'rgba(255,107,74,.6)':'rgba(255,209,102,.55)')
  });
  v(ctx,aimX-9,aimY,aimX+9,aimY,o.ink,1.5);
  v(ctx,aimX,aimY-9,aimX,aimY+9,o.ink,1.5);
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['WAVE',wave],['CITIES',cities.reduce(function(s2,v4){return s2+v4},0)],['COMBO','x'+(1+Math.min(4,Math.floor(combo/3)))]])
}

a.press=function(k){if(k===' ')fireInterceptor(aimX,aimY)};
a.pointer({down:function(pt){aimX=pt.x;aimY=pt.y;fireInterceptor(pt.x,pt.y)},move:function(pt){aimX=pt.x;aimY=pt.y}});
a.begin(function(){
  cities=[1,1,1,1,1,1];wave=1;score=0;aimX=200;aimY=200;combo=0;comboTimer=0;
  a.fx=[];
  initWave();
  a.frame(step)
})
}),w('softTouchdown',b,'Soft Touchdown',o.violet,'Feather the thrusters through crosswinds and pick a pad — the safe strip or the narrow bonus pad — before fuel runs out.','Left/Right rotate · Up thrust · land slow, level and on a pad',function(a){
var W=400,H=400,ctx=a.canvas(W,H);
var terrain,pads,lander,fuel,score,level,lives,message,resultTimer,windX,streak;

function terrainHeightAt(x){
  var idx=s(Math.floor(x/20),0,19),frac=(x-20*idx)/20;
  return terrain[idx]+(terrain[idx+1]-terrain[idx])*s(frac,0,1)
}

function newLevel(){
  var h0=c(250,340);
  terrain=[];
  for(var i=0;i<=20;i++){h0=s(h0+c(-42,42),190,380);terrain.push(h0)}
  var safeIdx=2+f(8),riskyIdx=12+f(7);
  terrain[safeIdx+1]=terrain[safeIdx+2]=terrain[safeIdx];
  terrain[riskyIdx+1]=terrain[riskyIdx];
  pads=[
    {x1:20*safeIdx,x2:20*(safeIdx+2),y:terrain[safeIdx],mult:1},
    {x1:20*riskyIdx,x2:20*(riskyIdx+1),y:terrain[riskyIdx],mult:2.5}
  ];
  lander={x:c(60,340),y:40,vx:c(-22,22),vy:0,a:0};
  fuel=Math.max(260,520-20*level);
  windX=level>1?c(-10,10)*Math.min(1,(level-1)*.18):0;
  message='';resultTimer=0
}

function step(dt){
  var thrusting=(a.k.ArrowUp||a.k.w)&&fuel>0;
  if(resultTimer>0){
    resultTimer-=dt;
    if(resultTimer<=0){
      if(lives<=0){draw(dt,false);a.over(score,'Reached level '+level+' · Score: '+score);return}
      newLevel()
    }
    draw(dt,false);
    return
  }
  lander.a+=2.6*a.ax()*dt;
  lander.vy+=(30+2*level)*dt;
  lander.vx+=windX*dt;
  if(thrusting){
    lander.vx+=95*Math.sin(lander.a)*dt;
    lander.vy-=95*Math.cos(lander.a)*dt;
    fuel=Math.max(0,fuel-60*dt)
  }
  lander.x+=lander.vx*dt;
  lander.y+=lander.vy*dt;
  if(lander.x<0||lander.x>W){lander.vx*=-.5;lander.x=s(lander.x,0,W)}
  var cosA=Math.cos(lander.a),sinA=Math.sin(lander.a),touched=!1;
  [[-9,12],[9,12],[0,-10]].forEach(function(pt){
    var wx=lander.x+pt[0]*cosA-pt[1]*sinA,wy=lander.y+pt[0]*sinA+pt[1]*cosA;
    if(wy>=terrainHeightAt(wx))touched=!0
  });
  if(touched){
    var landedPad=pads.filter(function(pd){return lander.x>pd.x1+2&&lander.x<pd.x2-2})[0];
    var speedOk=Math.abs(lander.vx)<24&&lander.vy<40&&Math.abs(lander.a)<.3;
    if(landedPad&&speedOk){
      var bonus=Math.round((100+Math.floor(fuel/5)+50*level)*landedPad.mult)+20*streak;
      score+=bonus;level++;streak++;
      message='Touchdown! +'+bonus;
      a.burst(lander.x,lander.y+12,o.green,20)
    }else{
      lives--;streak=0;
      message=landedPad?'Too fast or tilted!':'Missed the pad!';
      a.burst(lander.x,lander.y,o.coral,40)
    }
    resultTimer=1.6;lander.vx=0;lander.vy=0
  }
  draw(dt,thrusting)
}

function draw(dt,thrusting){
  g(ctx,W,H);
  for(var i2=0;i2<24;i2++)d(ctx,97*i2%W,53*i2%190,1,'rgba(233,251,249,.4)');
  ctx.beginPath();ctx.moveTo(0,H);
  terrain.forEach(function(hgt,idx){ctx.lineTo(20*idx,hgt)});
  ctx.lineTo(W,H);ctx.closePath();
  ctx.fillStyle='#2a2350';ctx.fill();
  ctx.strokeStyle=o.violet;ctx.lineWidth=2;ctx.stroke();
  pads.forEach(function(pd){v(ctx,pd.x1,pd.y,pd.x2,pd.y,pd.mult>1?o.yellow:o.green,5)});
  if(!(resultTimer>0&&message.indexOf('Touchdown')<0)){
    ctx.save();ctx.translate(lander.x,lander.y);ctx.rotate(lander.a);
    p(ctx,-8,-10,16,14,4,o.ink);
    ctx.strokeStyle=o.ink;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(-6,4);ctx.lineTo(-11,12);ctx.moveTo(6,4);ctx.lineTo(11,12);ctx.stroke();
    if(thrusting){
      ctx.beginPath();ctx.moveTo(-4,5);ctx.lineTo(0,14+f(10));ctx.lineTo(4,5);
      ctx.fillStyle=o.yellow;ctx.fill()
    }
    ctx.restore()
  }
  a.fxStep(dt);
  if(message)x(ctx,message,200,80,22,o.yellow);
  p(ctx,10,10,100,8,3,'#241C47');
  p(ctx,10,10,Math.max(1,fuel/520*100),8,3,fuel<100?o.coral:o.teal);
  a.hud([['SCORE',y(score)],['LEVEL',level],['VSPD',Math.round(lander.vy)],['LIVES',lives],['STREAK',streak]])
}

a.pad([['◀','ArrowLeft'],['THRUST','ArrowUp'],['▶','ArrowRight']]);
a.begin(function(){
  score=0;level=1;lives=3;streak=0;
  a.fx=[];
  newLevel();
  a.frame(step)
})
}),w('neonTrails',b,'Neon Trails',o.teal,'Leave a wall of light behind you, box the rival in, and watch the arena slowly close in around you both.','Arrows / WASD to turn (no brakes) · swipe on mobile',function(a){
var GRID=40,CELL=10,W=400,ctx=a.canvas(W,W),difficulty=1;
var grid,player,ai,score,streak,moveAcc,startFreeze,shrinkTimer,shrinkRing;

function isOpen(x,y){return x>=0&&y>=0&&x<GRID&&y<GRID&&!grid[y][x]}

function roomAhead(x,y,dx,dy,maxDist){
  var n=0;
  while(n<maxDist&&isOpen(x+dx*(n+1),y+dy*(n+1)))n++;
  return n
}

function closeRing(k){
  var lo=k,hi=GRID-1-k;
  if(lo>=hi)return;
  for(var col=lo;col<=hi;col++){grid[lo][col]=3;grid[hi][col]=3}
  for(var row=lo;row<=hi;row++){grid[row][lo]=3;grid[row][hi]=3}
}

function resetBoard(){
  grid=[];
  for(var row=0;row<GRID;row++){grid.push([]);for(var col=0;col<GRID;col++)grid[row].push(0)}
  player={x:8,y:20,dx:1,dy:0,nx:1,ny:0,dead:!1};
  ai={x:31,y:20,dx:-1,dy:0,dead:!1};
  grid[20][8]=1;grid[20][31]=2;
  moveAcc=0;startFreeze=.8;shrinkTimer=6;shrinkRing=0
}

function newMatch(){score=0;streak=0;resetBoard();a.frame(step)}

function aiDecide(){
  var ahead=roomAhead(ai.x,ai.y,ai.dx,ai.dy,30);
  var thresholds=[8,14,22],jitters=[.05,.02,.008];
  if(ahead<thresholds[difficulty]||Math.random()<jitters[difficulty]){
    var options=[[ai.dx,ai.dy],[-ai.dy,ai.dx],[ai.dy,-ai.dx]].map(function(dir){
      return{d:dir,n:roomAhead(ai.x,ai.y,dir[0],dir[1],30)+Math.random()*(3-difficulty)}
    }).sort(function(p,q){return q.n-p.n});
    var best=options[0];
    if(best.n>.5||ahead===0){ai.dx=best.d[0];ai.dy=best.d[1]}
  }
}

function step(dt){
  var moveInterval=Math.max(.04,.085-.004*streak);
  if(startFreeze>0){startFreeze-=dt;draw(dt);return}
  shrinkTimer-=dt;
  if(shrinkTimer<=0&&shrinkRing<19){
    closeRing(shrinkRing);shrinkRing++;
    shrinkTimer=Math.max(3,7-.3*streak)
  }
  moveAcc+=dt;
  while(moveAcc>=moveInterval&&!player.dead&&!ai.dead){
    moveAcc-=moveInterval;
    player.dx=player.nx;player.dy=player.ny;
    aiDecide();
    var px2=player.x+player.dx,py2=player.y+player.dy;
    var ax2=ai.x+ai.dx,ay2=ai.y+ai.dy;
    player.dead=!isOpen(px2,py2);
    ai.dead=!isOpen(ax2,ay2);
    if(px2===ax2&&py2===ay2){player.dead=!0;ai.dead=!0}
    if(!player.dead){player.x=px2;player.y=py2;grid[py2][px2]=1}
    if(!ai.dead){ai.x=ax2;ai.y=ay2;grid[ay2][ax2]=2}
  }
  draw(dt);
  if(player.dead||ai.dead){
    if(player.dead&&ai.dead){a.burst(player.x*CELL+5,player.y*CELL+5,o.ink,20);resetBoard();return}
    if(ai.dead){
      streak++;score+=100+25*streak;
      a.burst(ai.x*CELL+5,ai.y*CELL+5,o.orange,30);
      resetBoard();return
    }
    a.burst(player.x*CELL+5,player.y*CELL+5,o.teal,30);
    a.over(score,streak+' round'+(streak===1?'':'s')+' won · Score: '+score)
  }
}

function draw(dt){
  g(ctx,W,W);
  for(var i2=0;i2<=GRID;i2++){
    v(ctx,i2*CELL,0,i2*CELL,W,'rgba(140,124,240,.12)',1);
    v(ctx,0,i2*CELL,W,i2*CELL,'rgba(140,124,240,.12)',1)
  }
  for(var row=0;row<GRID;row++){
    for(var col=0;col<GRID;col++){
      var val=grid[row][col];
      if(val===1||val===2){
        ctx.fillStyle=val===1?o.teal:o.orange;
        ctx.globalAlpha=.75;
        ctx.fillRect(col*CELL+1,row*CELL+1,8,8);
        ctx.globalAlpha=1
      }else if(val===3){
        ctx.fillStyle='rgba(255,107,74,.35)';
        ctx.fillRect(col*CELL,row*CELL,CELL,CELL)
      }
    }
  }
  p(ctx,player.x*CELL,player.y*CELL,CELL,CELL,2,o.ink);
  p(ctx,ai.x*CELL,ai.y*CELL,CELL,CELL,2,o.ink);
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['STREAK',streak]])
}

a.press=function(key){
  var dirMap={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]};
  var dir=dirMap[key];
  if(dir&&!(dir[0]===-player.dx&&dir[1]===-player.dy)){player.nx=dir[0];player.ny=dir[1]}
};
a.swipe(function(dir){a.press({up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'}[dir])});
a.opt('AI',['Easy','Normal','Hard'],difficulty,function(idx){difficulty=idx;newMatch()});
a.pad([['▲','ArrowUp'],['◀','ArrowLeft'],['▶','ArrowRight'],['▼','ArrowDown']]);
a.begin(newMatch)
}),w('silverBall',b,'Silver Ball',o.violet,'Flip, bump and chain combos into multiball before the last ball drains.','Left/Right (or Z / M) to flip · Space to nudge · limited nudge charges',function(r){
  var ctx = r.canvas(360,500);
  var walls = [[10,70,70,10],[70,10,290,10],[290,10,350,70],[10,70,10,400],[350,70,350,400],[10,400,108,462],[350,400,252,462]];
  var bumpers = [{x:130,y:150,r:20,lit:0},{x:230,y:150,r:20,lit:0},{x:180,y:232,r:22,lit:0},{x:62,y:270,r:13,lit:0},{x:298,y:270,r:13,lit:0}];
  var targets, flippers, balls, score, lives, comboMult, comboTimer, level, nudgeCharges, nextExtraBall, bankMsg;

  function makeFlipper(px, dir){ return {px:px, py:462, dir:dir, len:64, ang:0.5, tip:{x:0,y:0}, prev:{x:0,y:0}}; }
  function flipperTip(fl){ return {x: fl.px + fl.dir*fl.len*Math.cos(fl.ang), y: fl.py + fl.len*Math.sin(fl.ang)}; }

  function resetTargets(){ targets = [{x:150,y:96,r:9,hit:0},{x:180,y:80,r:9,hit:0},{x:210,y:96,r:9,hit:0}]; }

  function spawnBall(withGrace){
    return {x:150+f(60), y:60, vx:c(-60,60), vy:0, r:8, grace: withGrace?0.6:0.35};
  }

  function gravityFor(){ return Math.min(780, 640+10*(level-1)); }
  function maxSpeedFor(){ return Math.min(900, 700+15*(level-1)); }
  function bumperPts(){ return 100+25*(level-1); }
  function targetPts(){ return 50+15*(level-1); }

  function segHit(ball, x1,y1,x2,y2, rest, wvx, wvy){
    var dx=x2-x1, dy=y2-y1;
    var tt = s(((ball.x-x1)*dx+(ball.y-y1)*dy)/(dx*dx+dy*dy||1),0,1);
    var px=x1+dx*tt, py=y1+dy*tt;
    var dist=Math.hypot(ball.x-px, ball.y-py);
    if(dist<ball.r && dist>1e-4){
      var nx=(ball.x-px)/dist, ny=(ball.y-py)/dist;
      ball.x += nx*(ball.r-dist); ball.y += ny*(ball.r-dist);
      var rvn = (ball.vx-wvx)*nx + (ball.vy-wvy)*ny;
      if(rvn<0){ ball.vx -= (1+rest)*rvn*nx; ball.vy -= (1+rest)*rvn*ny; }
      return true;
    }
    return false;
  }

  function addCombo(){ comboMult = Math.min(5, comboMult+1); comboTimer = 1.2; }

  function checkExtraBall(){
    if(score >= nextExtraBall){ lives++; nextExtraBall += 12000; bankMsg = 1.2; }
  }

  function loseBall(ball){
    balls.splice(balls.indexOf(ball),1);
    r.burst(ball.x, ball.y, o.magenta, 20);
    if(balls.length===0){
      lives--;
      if(lives<=0){ draw(0); r.over(score, 'Score: '+score); return; }
      nudgeCharges = 3;
      comboMult = 1; comboTimer = 0;
      balls.push(spawnBall(true));
    }
  }

  function step(dt){
    var grav = gravityFor(), maxSp = maxSpeedFor();
    comboTimer -= dt;
    if(comboTimer<=0) comboMult = 1;
    if(bankMsg>0) bankMsg -= dt;

    flippers.forEach(function(fl, idx){
      var held = idx===0 ? (r.k.ArrowLeft||r.k.z||r.k.a) : (r.k.ArrowRight||r.k.m||r.k.d);
      fl.prev = fl.tip;
      fl.ang += s((held?-0.45:0.5)-fl.ang, -16*dt, 16*dt);
      fl.tip = flipperTip(fl);
    });

    for(var bi=balls.length-1; bi>=0; bi--){
      var ball = balls[bi];
      if(ball.grace>0){ ball.grace -= dt; continue; }
      var sub, k;
      for(sub=0; sub<4; sub++){
        var sdt = dt/4;
        ball.vy += grav*sdt;
        ball.x += ball.vx*sdt;
        ball.y += ball.vy*sdt;
        var spd = Math.hypot(ball.vx, ball.vy);
        if(spd>maxSp){ ball.vx *= maxSp/spd; ball.vy *= maxSp/spd; }
        for(k=0;k<walls.length;k++) segHit(ball, walls[k][0],walls[k][1],walls[k][2],walls[k][3], 0.5, 0, 0);
        for(k=0;k<bumpers.length;k++){
          var bp = bumpers[k];
          var dist = Math.hypot(ball.x-bp.x, ball.y-bp.y);
          if(dist < bp.r+ball.r){
            var nx=(ball.x-bp.x)/(dist||1), ny=(ball.y-bp.y)/(dist||1);
            ball.x = bp.x+nx*(bp.r+ball.r); ball.y = bp.y+ny*(bp.r+ball.r);
            var boosted = Math.max(300, Math.min(maxSp, 1.05*Math.hypot(ball.vx,ball.vy)));
            ball.vx = nx*boosted; ball.vy = ny*boosted;
            bp.lit = 0.15;
            score += bumperPts()*comboMult;
            addCombo();
            r.burst(bp.x, bp.y, o.yellow, 6);
            checkExtraBall();
          }
        }
        for(k=0;k<targets.length;k++){
          var tg = targets[k];
          if(tg.hit) continue;
          var td = Math.hypot(ball.x-tg.x, ball.y-tg.y);
          if(td < tg.r+ball.r){
            var tnx=(ball.x-tg.x)/(td||1), tny=(ball.y-tg.y)/(td||1);
            ball.x = tg.x+tnx*(tg.r+ball.r); ball.y = tg.y+tny*(tg.r+ball.r);
            var tspd = Math.max(260, Math.hypot(ball.vx,ball.vy));
            ball.vx = tnx*tspd; ball.vy = tny*tspd;
            tg.hit = 1;
            score += targetPts()*comboMult;
            addCombo();
            r.burst(tg.x, tg.y, o.teal, 10);
            checkExtraBall();
            if(targets.every(function(z){ return z.hit; })){
              score += 800+200*(level-1);
              addCombo();
              r.burst(180,88,o.violet,26);
              resetTargets();
              if(balls.length<3) balls.push(spawnBall(false));
              checkExtraBall();
            }
          }
        }
        for(k=0;k<flippers.length;k++){
          var fl2 = flippers[k];
          segHit(ball, fl2.px, fl2.py, fl2.tip.x, fl2.tip.y, 0.35, (fl2.tip.x-fl2.prev.x)/(dt||1)*0.5, (fl2.tip.y-fl2.prev.y)/(dt||1)*0.5);
        }
      }
      if(ball.y>520) loseBall(ball);
    }

    bumpers.forEach(function(bp){ if(bp.lit>0) bp.lit -= dt; });
    level = 1+Math.floor(score/4000);
    draw(dt);
  }

  function draw(dt){
    g(ctx,360,500);
    walls.forEach(function(wl){ v(ctx, wl[0],wl[1],wl[2],wl[3], o.violet, 4); });
    targets.forEach(function(tg){ d(ctx, tg.x, tg.y, tg.r, tg.hit?o.dim:o.teal); d(ctx, tg.x, tg.y, tg.r-4, tg.hit?'#241C47':o.ink); });
    bumpers.forEach(function(bp){ d(ctx, bp.x, bp.y, bp.r, bp.lit>0?o.yellow:o.magenta); d(ctx, bp.x, bp.y, bp.r-5, bp.lit>0?o.ink:'#7a2a5a'); });
    flippers.forEach(function(fl){ v(ctx, fl.px, fl.py, fl.tip.x, fl.tip.y, o.teal, 10); d(ctx, fl.px, fl.py, 6, o.ink); });
    balls.forEach(function(ball){
      if(ball.grace>0 && Math.floor(ball.grace*10)%2) return;
      d(ctx, ball.x, ball.y, ball.r, o.ink);
      d(ctx, ball.x-2, ball.y-2, 2.5, '#9fb5c9');
    });
    r.fxStep(dt);
    r.hud([['SCORE',y(score)],['BALLS',lives],['LVL',level],['COMBO','x'+comboMult]]);
  }

  r.press = function(key){
    if(key!==' ' && key!=='ArrowUp') return;
    if(nudgeCharges<=0) return;
    var target = null;
    balls.forEach(function(ball){ if(ball.grace<=0 && (!target || ball.y>target.y)) target = ball; });
    if(!target) return;
    nudgeCharges--;
    target.vy -= 140;
    target.vx += c(-60,60);
  };

  r.pad([['◀ FLIP','z'],['NUDGE',' '],['FLIP ▶','m']]);

  r.begin(function(){
    lives = 3; score = 0; level = 1; comboMult = 1; comboTimer = 0; nudgeCharges = 3; nextExtraBall = 8000; bankMsg = 0;
    flippers = [makeFlipper(108,1), makeFlipper(252,-1)];
    flippers.forEach(function(fl){ fl.tip = fl.prev = flipperTip(fl); });
    resetTargets();
    balls = [spawnBall(true)];
    r.fx = [];
    r.frame(step);
  });
}),w('caveCopter',b,'Cave Copter',o.orange,'Hold to climb, thread the winding cave, and grab fuel orbs without clipping a wall.','Hold Space / Up / click to climb',function(r){
  var W=400, H=360, ctx=r.canvas(W,H);
  var cave, scrollAcc, heliY, heliVel, dist, tunnelW, nextCenter, gateCd, gates, orbs, orbCd, heliX, shield, invuln, bonus, timeAcc;

  function pushSegment(){
    nextCenter = s(nextCente