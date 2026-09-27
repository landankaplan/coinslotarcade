d,score;
function blockScreenY(b){return BASE_Y-(b.i*BLOCK_H-camY)-BLOCK_H;}
function nextBlock(){
  var prev=blocks[blocks.length-1];
  dir=blocks.length%2?1:-1;
  current={x:dir>0?-.6*prev.w:W-.4*prev.w,w:prev.w,i:blocks.length};
  speed=Math.min(420,140+7*blocks.length);
}
function dropBlock(){
  if(settled)return;
  var prev=blocks[blocks.length-1];
  var left=Math.max(current.x,prev.x);
  var right=Math.min(current.x+current.w,prev.x+prev.w);
  var overlap=right-left;
  if(overlap<=0){
    fallingPieces.push({x:current.x,w:current.w,i:current.i,vy:0,dy:0});
    settled=true;
    r.burst(current.x+current.w/2,blockScreenY(current),o.coral,16);
    r.later(function(){r.over(score,'Tower height: '+(blocks.length-1)+' blocks - Score: '+score);},700);
    return;
  }
  var tolerance=Math.max(2,10-Math.floor(blocks.length/2));
  if(Math.abs(current.x-prev.x)<tolerance){
    current.x=prev.x;
    perfectStreak++;
    bestStreak=Math.max(bestStreak,perfectStreak);
    if(perfectStreak%3===0)current.w=Math.min(200,current.w+6);
    score+=50+perfectStreak*10;
    r.burst(current.x+current.w/2,blockScreenY(current),o.yellow,16);
  }else{
    perfectStreak=0;
    if(current.x<prev.x)fallingPieces.push({x:current.x,w:prev.x-current.x,i:current.i,vy:0,dy:0});
    else fallingPieces.push({x:prev.x+prev.w,w:current.x+current.w-(prev.x+prev.w),i:current.i,vy:0,dy:0});
    current.x=left;current.w=overlap;
    score+=10;
    r.burst(current.x+current.w/2,blockScreenY(current),o.ink,10);
  }
  blocks.push(current);
  nextBlock();
}
function update(dt){
  if(!settled){
    current.x+=dir*speed*dt;
    if(current.x<-.6*current.w){current.x=-.6*current.w;dir=1;}
    if(current.x>W-.4*current.w){current.x=W-.4*current.w;dir=-1;}
  }
  var targetCam=Math.max(0,(blocks.length-8)*BLOCK_H);
  camY+=(targetCam-camY)*Math.min(1,4*dt);
  fallingPieces.forEach(function(pc){pc.vy+=900*dt;pc.dy=(pc.dy||0)+pc.vy*dt;});
  fallingPieces=fallingPieces.filter(function(pc){return pc.dy<600;});
  render(dt);
}
function render(dt){
  g(ctx,W,H);
  blocks.forEach(function(b){
    var sy=blockScreenY(b);
    if(sy>-30&&sy<H)p(ctx,b.x,sy,b.w,BLOCK_H-2,3,'hsl('+((hue+9*b.i)%360)+',70%,62%)');
  });
  fallingPieces.forEach(function(pc){
    var sy=BASE_Y-(pc.i*BLOCK_H-camY)-BLOCK_H+(pc.dy||0);
    p(ctx,pc.x,sy,pc.w,BLOCK_H-2,3,'hsl('+((hue+9*pc.i)%360)+',40%,45%)');
  });
  if(!settled){
    var sy2=blockScreenY(current);
    p(ctx,current.x,sy2,current.w,BLOCK_H-2,3,'hsl('+((hue+9*current.i)%360)+',80%,68%)');
  }
  r.fxStep(dt);
  if(perfectStreak>=2)x(ctx,'PERFECT x'+perfectStreak,W/2,40,18,o.yellow);
  r.hud([['HEIGHT',blocks.length-1],['SCORE',y(score)],['COMBO',perfectStreak]]);
}
r.press=function(k){if(k===' '||k==='Enter'||k==='ArrowDown')dropBlock();};
r.pointer({down:dropBlock});
r.begin(function(){
  blocks=[{x:60,w:200,i:0}];
  fallingPieces=[];
  perfectStreak=0;bestStreak=0;hue=f(360);camY=0;settled=false;score=0;
  r.fx=[];
  nextBlock();
  r.frame(update);
});
}),w('helixFall',m,'Helix Fall',o.violet,'Twist the helix so the ball threads every gap - watch for spinning hazard rings.','Left/Right (or drag) to rotate the tower · chain clean passes for combo score',function(r){
var W=320,H=480,SLOTS=12,SLOT_W=W/SLOTS,ctx=r.canvas(W,H);
var rings,ball,rotationOffset,camY,score,streak,bestStreak,dragX,vyCap;
function computeSlot(ring){
  return Math.floor((((W/2-(rotationOffset+ring.localOffset))%W+W)%W)/SLOT_W);
}
function makeRing(idx){
  var slots=[],k,hs,gapStart,gapSize,hazardCount,spin;
  for(k=0;k<SLOTS;k++)slots.push(1);
  gapStart=f(SLOTS);
  gapSize=2+(Math.random()<.5?1:0);
  for(k=0;k<gapSize;k++)slots[(gapStart+k)%SLOTS]=0;
  hazardCount=Math.min(4,1+Math.floor(idx/8));
  for(k=0;k<hazardCount;k++){
    hs=f(SLOTS);
    if(slots[hs]===1&&slots[(hs+1)%SLOTS]!==0&&slots[(hs+SLOTS-1)%SLOTS]!==0)slots[hs]=2;
  }
  spin=(idx>10&&Math.random()<.35)?c(20,55)*(Math.random()<.5?1:-1):0;
  return{y:280+92*idx,slots:slots,passed:false,index:idx,localOffset:0,spin:spin};
}
function update(dt){
  var ballBottom=ball.y+9,idx,ring,slotIdx,sIdx,prevV,nextV;
  rotationOffset+=-260*r.ax()*dt;
  ball.vy=Math.min(vyCap,ball.vy+1400*dt);
  ball.y+=ball.vy*dt;
  for(idx=0;idx<rings.length;idx++){
    ring=rings[idx];
    ring.localOffset+=ring.spin*dt;
    if(ball.vy>0&&ballBottom<=ring.y&&ball.y+9>=ring.y){
      slotIdx=computeSlot(ring);
      if(ring.slots[slotIdx]===1){
        ball.y=ring.y-9;ball.vy=-520;streak=0;
        r.burst(W/2,ring.y-camY,o.violet,6);
      }else if(ring.slots[slotIdx]===2){
        ball.y=ring.y-9;
        render(dt);
        r.over(score,'Rings cleared: '+ring.index+' - Score: '+score);
        return;
      }
    }
    if(!ring.passed&&ball.y-9>ring.y+16){
      ring.passed=true;
      streak++;
      bestStreak=Math.max(bestStreak,streak);
      score+=streak;
      vyCap=Math.min(1500,900+ring.index*10);
      sIdx=computeSlot(ring);
      prevV=ring.slots[(sIdx+SLOTS-1)%SLOTS];
      nextV=ring.slots[(sIdx+1)%SLOTS];
      if(prevV===2||nextV===2){score+=25;r.burst(W/2,ball.y-camY,o.coral,14);}
      if(streak>=3)r.burst(W/2,ball.y-camY,o.yellow,10);
    }
  }
  camY=Math.max(camY,ball.y-170);
  while(rings[rings.length-1].y<camY+H+120)rings.push(makeRing(rings.length));
  rings=rings.filter(function(rg){return rg.y>camY-60;});
  render(dt);
}
function render(dt){
  g(ctx,W,H);
  rings.forEach(function(ring){
    var ringScreenY=ring.y-camY;
    if(ringScreenY>500)return;
    for(var t=0;t<SLOTS;t++){
      if(!ring.slots[t])continue;
      var pos=((t*SLOT_W+rotationOffset+ring.localOffset)%W+W)%W;
      var col=ring.slots[t]===2?o.coral:o.blue;
      p(ctx,pos+1,ringScreenY,SLOT_W-2,16,3,col);
      if(pos>W-SLOT_W)p(ctx,pos-W+1,ringScreenY,SLOT_W-2,16,3,col);
    }
  });
  d(ctx,W/2,ball.y-camY,9,o.yellow);
  d(ctx,W/2-3,ball.y-camY-3,3,'rgba(255,255,255,.6)');
  r.fxStep(dt);
  r.hud([['SCORE',y(score)],['STREAK',streak],['SPEED',Math.round(vyCap)]]);
}
r.pointer({
  down:function(pt){dragX=pt.x;},
  move:function(pt,ev,isDown){if(isDown&&dragX!==null){rotationOffset+=1.3*(pt.x-dragX);dragX=pt.x;}},
  up:function(){dragX=null;}
});
r.pad([['◀','ArrowLeft'],['▶','ArrowRight']]);
r.begin(function(){
  var idx;
  rings=[];
  for(idx=0;idx<9;idx++)rings.push(makeRing(idx));
  rings[0].slots=[1,1,1,1,1,1,1,1,1,1,0,0];
  ball={y:120,vy:0};
  rotationOffset=0;camY=0;score=0;streak=0;bestStreak=0;dragX=null;vyCap=900;
  r.fx=[];
  r.frame(update);
});
}),w('hueHopper',m,'Hue Hopper',o.magenta,'Hop through spinning rings, but only where a quadrant matches your colour.','Tap / click / Space to hop · grab the dot to change colour before the next ring',function(r){
var W=320,H=480,ctx=r.canvas(W,H);
var basePalette=[o.yellow,o.magenta,o.teal,o.violet];
var bonusPalette;
var activeColors,bird,rings,pickups,camY,score,streak,bestStreak,nextUnlockScore;
function maybeUnlockColor(){
  if(bonusPalette.length&&score>=nextUnlockScore){
    activeColors.push(bonusPalette.shift());
    nextUnlockScore+=12;
  }
}
function spawnRing(){
  var prevY=rings.length?rings[rings.length-1].y:500;
  var idx=rings.length;
  var n=activeColors.length;
  var ringY=prevY-230;
  var isDouble=idx>4&&Math.random()<.4;
  var isWild=idx>3&&Math.random()<.12;
  var spinMag=c(1.1,2)*(1+Math.min(1.4,idx/25));
  rings.push({y:ringY,rot:c(0,e),sp:spinMag*(Math.random()<.5?1:-1),two:isDouble,wild:isWild,passed:false,n:n,index:idx});
  pickups.push({y:ringY+115,taken:false,n:n});
}
function hop(){bird.vy=-340;}
function update(dt){
  var blocked=false,ended;
  bird.vy+=900*dt;bird.y+=bird.vy*dt;
  if(bird.y-camY<240)camY=bird.y-240;
  while(rings[rings.length-1].y>camY-320)spawnRing();
  rings.forEach(function(ring){
    ring.rot+=ring.sp*dt;
    var dy=bird.y-ring.y,dist=Math.hypot(0,dy);
    if(!ring.wild)[70,44].forEach(function(radius,layerIdx){
      if(layerIdx===0||ring.two){
        var rot=layerIdx?-ring.rot:ring.rot;
        if(Math.abs(dist-radius)<14){
          var angle=(Math.atan2(dy,0)-rot+4*e)%e;
          var slice=Math.floor(angle/(e/ring.n))%ring.n;
          if(activeColors[slice]!==activeColors[bird.col])blocked=true;
        }
      }
    });
    if(!ring.passed&&bird.y<ring.y-90){
      ring.passed=true;
      streak++;
      bestStreak=Math.max(bestStreak,streak);
      score+=streak;
      maybeUnlockColor();
      if(ring.wild)r.burst(160,ring.y-camY,'rgba(255,255,255,.9)',12);
    }
  });
  pickups.forEach(function(pk){
    if(!pk.taken&&Math.abs(bird.y-pk.y)<16){
      pk.taken=true;
      var n=pk.n;
      bird.col=(bird.col+1+f(Math.max(1,n-1)))%n;
      r.burst(160,pk.y-camY,activeColors[bird.col],14);
    }
  });
  ended=blocked||bird.y-camY>500;
  rings=rings.filter(function(rg){return rg.y-camY<680;});
  pickups=pickups.filter(function(pk){return pk.y-camY<540;});
  if(ended){
    r.burst(160,bird.y-camY,activeColors[bird.col],30);
    render(dt);
    r.over(score,'Rings cleared: '+streak);
    return;
  }
  render(dt);
}
function render(dt){
  g(ctx,W,H);
  rings.forEach(function(ring){
    var sy=ring.y-camY;
    if(ring.wild){
      ctx.beginPath();ctx.arc(160,sy,70,0,e);
      ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=12;ctx.setLineDash([6,6]);ctx.stroke();ctx.setLineDash([]);
      return;
    }
    [70,44].forEach(function(radius,layerIdx){
      if(layerIdx===0||ring.two){
        var rot=layerIdx?-ring.rot:ring.rot;
        for(var t=0;t<ring.n;t++){
          ctx.beginPath();
          ctx.arc(160,sy,radius,rot+t*e/ring.n,rot+(t+1)*e/ring.n);
          ctx.strokeStyle=activeColors[t];
          ctx.lineWidth=12;
          ctx.stroke();
        }
      }
    });
  });
  pickups.forEach(function(pk){
    var sy=pk.y-camY;
    if(!pk.taken)for(var t=0;t<pk.n;t++){
      ctx.beginPath();
      ctx.arc(160,sy,9,t*e/pk.n,(t+1)*e/pk.n);
      ctx.lineTo(160,sy);
      ctx.fillStyle=activeColors[t];
      ctx.fill();
    }
  });
  d(ctx,160,bird.y-camY,8,activeColors[bird.col]);
  ctx.strokeStyle=o.ink;ctx.lineWidth=2;ctx.stroke();
  r.fxStep(dt);
  r.hud([['SCORE',y(score)],['STREAK',streak],['COLORS',activeColors.length]]);
}
r.press=function(k){if(k===' '||k==='ArrowUp'||k==='w')hop();};
r.pointer({down:hop});
r.begin(function(){
  activeColors=basePalette.slice();
  bonusPalette=[o.green,o.blue,o.orange,o.coral];
  nextUnlockScore=8;
  bird={y:400,vy:0,col:2};
  camY=0;score=0;streak=0;bestStreak=0;
  rings=[];pickups=[];
  spawnRing();spawnRing();
  r.fx=[];
  r.frame(update);
});
}),
w('beatTiles',m,'Beat Tiles',o.teal,'Tap the lit lane in every row, in order, as the speed climbs - watch for double-tap chords.','D F J K (or arrow keys) for the four lanes · or tap the tile · chords need both lanes',function(r){
var W=320,H=480,ROW_H=120,ctx=r.canvas(W,H);
var rows,speed,tilesHit,score,missedLane,ended,streak,bestStreak;
function spawnRow(){
  var prevY=rows.length?rows[rows.length-1].y-ROW_H:260;
  var isChord=rows.length>6&&Math.random()<Math.min(.22,.05+rows.length*.003);
  var col1=f(4),col2,cols;
  cols=[col1];
  if(isChord){
    col2=(col1+1+f(3))%4;
    cols.push(col2);
  }
  rows.push({y:prevY,cols:cols,done:cols.map(function(){return false;}),hit:false});
}
function activeTarget(){
  var pending=rows.filter(function(rr){return!rr.hit;});
  pending.sort(function(a,b){return b.y-a.y;});
  return pending[0];
}
function fail(laneIndex){
  if(ended)return;
  ended=true;
  missedLane=laneIndex;
  streak=0;
  render(.016);
  r.later(function(){r.over(score,'Tiles tapped: '+tilesHit);},350);
}
function tap(laneIndex){
  if(ended)return;
  var target=activeTarget();
  if(!target||target.y+ROW_H<0)return;
  var colPos=target.cols.indexOf(laneIndex);
  if(colPos===-1){
    fail(laneIndex);
    return;
  }
  target.done[colPos]=true;
  if(target.done.every(function(v){return v;})){
    target.hit=true;
    tilesHit++;
    streak++;
    bestStreak=Math.max(bestStreak,streak);
    var mult=1+Math.min(4,Math.floor(streak/6));
    var isChord=target.cols.length>1;
    score+=(isChord?2:1)*mult;
    speed=Math.min(900,speed+(isChord?9:6));
    r.burst(80*laneIndex+40,target.y+60,isChord?o.yellow:o.teal,isChord?14:8);
  }
}
function update(dt){
  if(ended){render(dt);return;}
  rows.forEach(function(rr){rr.y+=speed*dt;});
  while(rows[rows.length-1].y>-240)spawnRow();
  rows=rows.filter(function(rr){return rr.y<600;});
  var pending=rows.filter(function(rr){return!rr.hit;});
  pending.sort(function(a,b){return b.y-a.y;});
  var nearest=pending[0];
  if(nearest&&nearest.y>H){
    ended=true;
    r.over(score,'A tile got past. Tiles tapped: '+tilesHit);
    return;
  }
  render(dt);
}
function render(dt){
  g(ctx,W,H,'#f4f1ff');
  rows.forEach(function(rr){
    for(var t=0;t<4;t++){
      ctx.strokeStyle='#c9c2e8';ctx.lineWidth=1;
      ctx.strokeRect(80*t+.5,rr.y+.5,79,ROW_H-1);
    }
    rr.cols.forEach(function(colIdx,ci){
      var doneThis=rr.done[ci];
      p(ctx,80*colIdx+2,rr.y+2,76,ROW_H-4,6,rr.hit?'#9fe3dc':(doneThis?'#c9a8ff':'#1a1233'));
    });
  });
  if(missedLane>=0){ctx.fillStyle='rgba(255,107,74,.5)';ctx.fillRect(80*missedLane,0,80,H);}
  r.fxStep(dt);
  r.hud([['SCORE',score],['STREAK',streak],['SPEED',Math.round(speed)]]);
}
r.press=function(k){
  var map={d:0,f:1,j:2,k:3,ArrowLeft:0,ArrowDown:1,ArrowUp:2,ArrowRight:3};
  var lane=map[k];
  if(lane!==undefined)tap(lane);
};
r.pointer({down:function(pt){tap(s(Math.floor(pt.x/80),0,3));}});
r.pad([['D','d'],['F','f'],['J','j'],['K','k']]);
r.begin(function(){
  rows=[];speed=190;tilesHit=0;score=0;missedLane=-1;ended=false;streak=0;bestStreak=0;
  do{spawnRow();}while(rows[rows.length-1].y>-240);
  r.fx=[];
  r.frame(update);
});
}),w('perfectTen',m,'Perfect Ten',o.yellow,'The clock hides itself. Stop it on the target time by feel alone — chain close stops for a rising streak bonus.','Space / click to start, then again to stop on target. The clock vanishes after a moment each round.',function(r){
  var W=400,H=300,ctx=r.canvas(W,H);
  var ROUNDS=8;
  var targets,round,phase,startAt,lastElapsed,lastMiss,lastGain,score,misses,streak,bestStreak;
  function visibleFor(rd){
    return Math.max(0.35,1.5-rd*0.15);
  }
  function advance(){
    if(phase==='done') return;
    if(phase==='idle'){
      phase='run';
      startAt=performance.now();
    } else if(phase==='run'){
      var elapsed=(performance.now()-startAt)/1000;
      var miss=Math.abs(elapsed-targets[round]);
      var base=Math.round(220*Math.max(0,1-miss/1.2));
      var perfect=miss<0.03;
      if(perfect) base+=60;
      if(miss<0.15){ streak++; if(streak>bestStreak) bestStreak=streak; }
      else { streak=0; }
      var streakBonus=Math.min(6,streak)*12;
      var gain=base+streakBonus;
      score+=gain;
      misses.push(miss);
      lastElapsed=elapsed; lastMiss=miss; lastGain=gain;
      phase='res';
      if(miss<0.06) r.burst(200,120,o.yellow,perfect?32:20);
      else if(miss>0.5) r.burst(200,120,o.dim,10);
    } else if(phase==='res'){
      round++;
      if(round>=ROUNDS){
        var total=0,i;
        for(i=0;i<misses.length;i++) total+=misses[i];
        var avg=Math.round(total/misses.length*1000);
        r.over(score,'Average miss '+avg+' ms · Best streak '+bestStreak,'Perfect Ten Complete');
        phase='done';
      } else {
        phase='idle';
      }
    }
  }
  function step(dt){
    g(ctx,W,H);
    x(ctx,'ROUND '+Math.min(ROUNDS,round+1)+' OF '+ROUNDS,200,26,14,o.dim);
    x(ctx,'STOP AT '+targets[Math.min(ROUNDS-1,round)].toFixed(2),200,62,24,o.yellow);
    if(phase==='idle'){
      x(ctx,'0.00',200,150,60,o.dim);
      x(ctx,'Press Space or tap to start the clock',200,220,15,o.ink);
    } else if(phase==='run'){
      var elapsed=(performance.now()-startAt)/1000;
      var vis=visibleFor(round);
      if(elapsed<vis) x(ctx,elapsed.toFixed(2),200,150,60,o.ink);
      else x(ctx,'?.??',200,150,60,o.dim);
      x(ctx,'Press again when you think it is time',200,220,15,o.ink);
    } else if(phase==='res'){
      x(ctx,lastElapsed.toFixed(2),200,150,60,lastMiss<0.05?o.green:o.ink);
      var msg=(lastMiss<0.03?'PERFECT! ':'Off by '+Math.round(lastMiss*1000)+' ms · ')+'+'+lastGain;
      x(ctx,msg,200,220,15,o.ink);
      x(ctx,'Press again to continue',200,250,13,o.dim);
    }
    r.fxStep(dt);
    r.hud([['SCORE',y(score)],['ROUND',Math.min(ROUNDS,round+1)+'/'+ROUNDS],['STREAK',streak]]);
  }
  r.press=function(k){
    if(k===' '||k==='Enter') advance();
  };
  r.pointer({down:advance});
  r.begin(function(){
    targets=h([3,4,5,6,7,8,9,10,11,12]).slice(0,ROUNDS);
    round=0; phase='idle'; score=0; misses=[]; streak=0; bestStreak=0;
    r.fx=[];
    r.frame(step);
  });
}),
w('coinCatcher',m,'Coin Catcher',o.orange,'Catch coins and gems, dodge bombs, and chain combos for bigger multipliers.','Left/Right (or move the mouse / drag) to steer the basket · grab the magnet and x2 power-ups',function(r){
  var W=400,H=400,ctx=r.canvas(W,H);
  var MAX_LIVES=5,MAGNET_TIME=5,MULTI_TIME=7,CATCH_Y1=356,CATCH_Y2=382,CATCH_HALF=34;
  var basketX,dragX,items,lives,score,combo,comboMult,elapsed,spawnTimer,magnetTimer,multiTimer;
  function pickType(t){
    var bombW=Math.min(30,8+t*0.18);
    var table=[['coin',52],['gem',15],['diamond',5],['bomb',bombW],['heart',4],['magnet',3],['multi',3]];
    var total=0,i;
    for(i=0;i<table.length;i++) total+=table[i][1];
    var roll=Math.random()*total;
    for(i=0;i<table.length;i++){
      if(roll<table[i][1]) return table[i][0];
      roll-=table[i][1];
    }
    return 'coin';
  }
  function spawnItem(){
    items.push({x:c(20,W-20),y:-12,t:pickType(elapsed),v:130+3.6*elapsed+Math.min(90,combo*1.5)+f(40)});
  }
  function resetCombo(){ combo=0; comboMult=1; }
  function step(dt){
    elapsed+=dt;
    var axis=r.ax();
    if(dragX===null||axis){
      basketX+=axis*360*dt;
      if(axis) dragX=null;
    } else {
      basketX+=s(dragX-basketX,-430*dt,430*dt);
    }
    basketX=s(basketX,30,W-30);
    spawnTimer-=dt;
    if(spawnTimer<=0){
      spawnItem();
      spawnTimer=Math.max(0.22,0.62-0.006*elapsed)*c(0.6,1.15);
    }
    magnetTimer=Math.max(0,magnetTimer-dt);
    multiTimer=Math.max(0,multiTimer-dt);
    var i,it;
    for(i=items.length-1;i>=0;i--){
      it=items[i];
      if(magnetTimer>0&&(it.t==='coin'||it.t==='gem'||it.t==='diamond')&&it.y>H*0.3){
        it.x+=s(basketX-it.x,-230*dt,230*dt);
      }
      it.y+=it.v*dt;
      var caught=it.y>CATCH_Y1&&it.y<CATCH_Y2&&Math.abs(it.x-basketX)<CATCH_HALF;
      if(caught){
        if(it.t==='bomb'){
          lives--; resetCombo();
          r.burst(it.x,it.y,o.coral,22);
        } else if(it.t==='heart'){
          lives=Math.min(MAX_LIVES,lives+1);
          r.burst(it.x,it.y,o.magenta,14);
        } else if(it.t==='magnet'){
          magnetTimer=MAGNET_TIME;
          r.burst(it.x,it.y,o.teal,16);
        } else if(it.t==='multi'){
          multiTimer=MULTI_TIME;
          r.burst(it.x,it.y,o.violet,16);
        } else {
          combo++;
          comboMult=1+Math.min(4,Math.floor(combo/6));
          var base=it.t==='diamond'?90:it.t==='gem'?40:10;
          var gain=base*comboMult*(multiTimer>0?2:1);
          score+=gain;
          r.burst(it.x,it.y,it.t==='diamond'?o.violet:it.t==='gem'?o.teal:o.yellow,10);
        }
        items.splice(i,1);
      } else if(it.y>H+10){
        if(it.t==='coin'||it.t==='gem'||it.t==='diamond') resetCombo();
        items.splice(i,1);
      }
    }
    if(lives<=0){
      render(dt);
      r.over(score,'Score: '+score);
      return;
    }
    render(dt);
  }
  function render(dt){
    g(ctx,W,H);
    items.forEach(function(it){
      if(it.t==='coin'){
        d(ctx,it.x,it.y,9,o.yellow);
        d(ctx,it.x,it.y,5,'#e0a93a');
      } else if(it.t==='gem'){
        ctx.beginPath();
        ctx.moveTo(it.x,it.y-11);
        ctx.lineTo(it.x+10,it.y);
        ctx.lineTo(it.x,it.y+11);
        ctx.lineTo(it.x-10,it.y);
        ctx.closePath();
        ctx.fillStyle=o.teal;
        ctx.fill();
      } else if(it.t==='diamond'){
        ctx.beginPath();
        ctx.moveTo(it.x,it.y-14);
        ctx.lineTo(it.x+12,it.y-2);
        ctx.lineTo(it.x,it.y+14);
        ctx.lineTo(it.x-12,it.y-2);
        ctx.closePath();
        ctx.fillStyle=o.violet;
        ctx.fill();
        ctx.strokeStyle='#fff';
        ctx.lineWidth=1;
        ctx.stroke();
      } else if(it.t==='heart'){
        x(ctx,'♥',it.x,it.y,24,o.magenta);
      } else if(it.t==='magnet'){
        d(ctx,it.x,it.y,11,o.teal);
        x(ctx,'M',it.x,it.y,14,o.ink);
      } else if(it.t==='multi'){
        d(ctx,it.x,it.y,11,o.violet);
        x(ctx,'x2',it.x,it.y,12,'#fff');
      } else {
        d(ctx,it.x,it.y,10,'#0b0518');
        ctx.strokeStyle=o.coral;
        ctx.lineWidth=2;
        ctx.stroke();
        v(ctx,it.x+4,it.y-9,it.x+8,it.y-15,o.orange,2);
      }
    });
    if(magnetTimer>0){
      ctx.save();
      ctx.globalAlpha=0.35;
      d(ctx,basketX,373,44,o.teal);
      ctx.restore();
    }
    ctx.beginPath();
    ctx.moveTo(basketX-32,360);
    ctx.lineTo(basketX+32,360);
    ctx.lineTo(basketX+24,386);
    ctx.lineTo(basketX-24,386);
    ctx.closePath();
    ctx.fillStyle=o.orange;
    ctx.fill();
    p(ctx,basketX-34,356,68,6,3,o.ink);
    r.fxStep(dt);
    var buff=magnetTimer>0?'MAGNET '+Math.ceil(magnetTimer):(multiTimer>0?'x2 '+Math.ceil(multiTimer):'-');
    r.hud([['SCORE',y(score)],['LIVES',lives],['COMBO',combo+' x'+comboMult],['BUFF',buff]]);
  }
  r.pointer({
    down:function(pt){ dragX=pt.x; },
    move:function(pt,ev,isDown){ if(isDown||ev.pointerType==='mouse') dragX=pt.x; },
    up:function(pt,ev){ if(ev.pointerType!=='mouse') dragX=null; }
  });
  r.pad([['◀','ArrowLeft'],['▶','ArrowRight']]);
  r.begin(function(){
    basketX=200; dragX=null; items=[]; lives=3; score=0; combo=0; comboMult=1;
    elapsed=0; spawnTimer=0.4; magnetTimer=0; multiTimer=0;
    r.fx=[];
    r.frame(step);
  });
}),
w('typeRush',m,'Type Rush',o.blue,'Words rain down and get longer and faster — type them before they hit the ground, chain combos, and watch for gold bonus words.','Keyboard game: type the falling words · Backspace to unlock a target',function(r){
  var W=400,H=420,ctx=r.canvas(W,H);
  var pool=['echo','pixel','coin','arcade','joystick','score','level','combo','boost','laser','rocket','turbo','quest','ghost','maze','byte','glitch','neon','cyber','orbit','comet','pulse','spark','blaze','storm','frost','ember','flare','nova','delta','omega','sigma','vortex','cipher','matrix','hyper','magnet','plasma','photon','quartz','radar','sonic','titan','ultra','vector','warp','xenon','bonus','token','power','speed','clash','gizmo','hover','karma','lunar','mirror','nitro','prism','rival','shield','tunnel'];
  var MAX_LIVES=5;
  var fallingWords,locked,lives,score,combo,bestCombo,elapsed,spawnTimer,hasBonus;
  function spawnWord(){
    var bonus=!hasBonus&&elapsed>4&&Math.random()<0.08;
    var minLen=elapsed<12?4:elapsed<28?5:6;
    var maxLen=Math.min(8,minLen+2);
    var candidates=bonus?pool.filter(function(wd){return wd.length>=6;}):pool.filter(function(wd){return wd.length>=minLen&&wd.length<=maxLen;});
    if(!candidates.length) candidates=pool;
    var word=u(candidates);
    var wpx=11*word.length+10;
    fallingWords.push({w:word,x:c(10,W-wpx-10),y:-10,v:(bonus?20:26)+Math.min(95,1.05*elapsed+0.045*score),n:0,bonus:bonus});
    if(bonus) hasBonus=true;
  }
  function completeWord(wd){
    combo++;
    if(combo>bestCombo) bestCombo=combo;
    var gain=10*wd.w.length+5*combo;
    if(wd.bonus){
      gain*=2;
      lives=Math.min(MAX_LIVES,lives+1);
      hasBonus=false;
    }
    score+=gain;
    if(combo%10===0){
      score+=25;
      r.burst(200,60,o.yellow,20);
    }
    r.burst(wd.x+5.5*wd.w.length,wd.y,wd.bonus?o.yellow:o.blue,wd.bonus?24:16);
    var idx=fallingWords.indexOf(wd);
    if(idx>-1) fallingWords.splice(idx,1);
    if(locked===wd) locked=null;
  }
  function step(dt){
    elapsed+=dt;
    spawnTimer-=dt;
    if(spawnTimer<=0){
      spawnWord();
      spawnTimer=Math.max(0.55,2.2-0.025*elapsed)*c(0.7,1.15);
    }
    var i,wd;
    for(i=fallingWords.length-1;i>=0;i--){
      wd=fallingWords[i];
      wd.y+=wd.v*dt;
      if(wd.y>390){
        if(locked===wd) locked=null;
        if(wd.bonus) hasBonus=false;
        fallingWords.splice(i,1);
        lives--; combo=0;
        r.burst(200,400,o.coral,14);
      }
    }
    if(lives<=0){
      render(dt);
      r.over(score,'Score: '+score+' · Best combo '+bestCombo);
      return;
    }
    render(dt);
  }
  function render(dt){
    g(ctx,W,H);
    p(ctx,0,390,W,30,0,'#3a1a3a');
    fallingWords.forEach(function(wd){
      var bg=wd===locked?'#22346a':(wd.bonus?'#4a3a12':'#241C47');
      p(ctx,wd.x-5,wd.y-12,11*wd.w.length+10,24,6,bg);
      for(var i=0;i<wd.w.length;i++){
        var col=i<wd.n?o.yellow:(wd.bonus?o.orange:o.ink);
        x(ctx,wd.w[i],wd.x+11*i+5,wd.y,18,col);
      }
    });
    r.fxStep(dt);
    r.hud([['SCORE',y(score)],['LIVES',lives],['COMBO',combo]]);
  }
  r.press=function(k){
    if(k==='Backspace'||k==='Escape'){
      if(locked) locked.n=0;
      locked=null;
      return;
    }
    if(k.length!==1||k<'a'||k>'z') return;
    if(locked){
      if(locked.w[locked.n]===k){
        locked.n++;
        if(locked.n===locked.w.length) completeWord(locked);
      } else {
        combo=0;
      }
    } else {
      var candidates=fallingWords.filter(function(wd){return wd.w[0]===k;}).sort(function(p1,p2){return p2.y-p1.y;});
      var cand=candidates[0];
      if(cand){
        locked=cand;
        cand.n=1;
        if(cand.n===cand.w.length) completeWord(cand);
      }
    }
  };
  r.begin(function(){
    fallingWords=[]; locked=null; lives=3; score=0; combo=0; bestCombo=0;
    elapsed=0; spawnTimer=0.4; hasBonus=false;
    r.fx=[];
    r.frame(step);
  });
}),
w('targetBlitz',m,'Target Blitz',o.coral,'Targets pop up and shrink away — chain center hits for a rising streak bonus, and watch out for decoys.','Click / tap the targets before they vanish · avoid the marked decoys · 3 misses ends it',function(r){
  var W=400,H=400,ctx=r.canvas(W,H);
  var targets,lives,score,combo,comboMult,centerStreak,bestCenterStreak,elapsed,spawnTimer;
  function tryPlace(){
    var attempts=0,tx,ty,ok;
    do{
      tx=c(40,W-40); ty=c(40,H-40); attempts++;
      ok=!targets.some(function(t2){ return Math.hypot(t2.x-tx,t2.y-ty)<70; });
    } while(!ok&&attempts<10);
    return {x:tx,y:ty};
  }
  function step(dt){
    elapsed+=dt;
    var lifeDur=Math.max(0.5,1.65-0.014*elapsed);
    var maxTargets=elapsed>45?5:4;
    spawnTimer-=dt;
    if(spawnTimer<=0&&targets.length<maxTargets){
      var pos=tryPlace();
      var isBonus=elapsed>6&&Math.random()<0.07;
      var isDecoy=!isBonus&&elapsed>9&&Math.random()<0.09;
      var type=isBonus?'bonus':(isDecoy?'