,w('helixFall',m,'Helix Fall',o.violet,'Twist the helix so the ball threads every gap - watch for spinning hazard rings.','Left/Right (or drag) to rotate the tower · chain clean passes for combo score',function(r){
function startGame3D(){
var W=320,H=480,SLOTS=12,SLOT_W=W/SLOTS;
var rings,ball,rotationOffset,camY,score,streak,bestStreak,dragX,vyCap;

var wrapDiv=document.createElement('div');
wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
r.el.appendChild(wrapDiv);
var canvasWrap=document.createElement('div');
canvasWrap.style.cssText='position:relative;width:100%;max-width:320px;aspect-ratio:320/480;margin:0 auto';
wrapDiv.appendChild(canvasWrap);

var renderer3d=extMakeWebGLRenderer();
if(!renderer3d){r.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
renderer3d.setSize(W,H);
renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
renderer3d.setClearColor(0x0d0820,1);
canvasWrap.appendChild(renderer3d.domElement);
r.cv=renderer3d.domElement;r.w=W;r.h=H;

var R=3.4,Z0=4,ZCAM=6,DEPTH_SCALE=0.08;
function zFor(screenY){return Z0-screenY*DEPTH_SCALE}

var scene3d=new THREE.Scene();
scene3d.fog=new THREE.Fog(0x0d0820,8,40);
var camera3d=new THREE.PerspectiveCamera(52,W/H,0.1,200);
camera3d.position.set(0,0,ZCAM);
camera3d.lookAt(0,0,0);

scene3d.add(new THREE.AmbientLight(0xe8dcff,0.55));
var sun3d=new THREE.PointLight(0xffffff,1.1,40);
sun3d.position.set(0,2,ZCAM+2);
scene3d.add(sun3d);

function disposeGroupChildren(grp){
  while(grp.children.length){
    var c2=grp.children.pop();
    grp.remove(c2);
    extDisposeThree(c2)
  }
}
var ringGroup3d=new THREE.Group();scene3d.add(ringGroup3d);
var blockMatNormal3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.blue),emissive:new THREE.Color(o.blue),emissiveIntensity:0.2,roughness:0.5});
var blockMatHazard3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.coral),emissive:new THREE.Color(o.coral),emissiveIntensity:0.3,roughness:0.5});

var ballMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.yellow),emissive:new THREE.Color(o.yellow),emissiveIntensity:0.3,roughness:0.4});
var ballHiMat3d=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.6});
var ballGroup3d=new THREE.Group();scene3d.add(ballGroup3d);
var ballMesh3d=new THREE.Mesh(new THREE.SphereGeometry(0.42,16,14),ballMat3d);
ballGroup3d.add(ballMesh3d);
var ballHiMesh3d=new THREE.Mesh(new THREE.SphereGeometry(0.14,8,8),ballHiMat3d);
ballHiMesh3d.position.set(-0.14,0.14,0.3);
ballGroup3d.add(ballHiMesh3d);

var particleMeshes3d=[];
function spawnParticles3d(wx,wy,wz,color,n){
  var col=new THREE.Color(color);
  for(var pi=0;pi<n;pi++){
    var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
    var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,6),mat);
    mesh.position.set(wx+(Math.random()-0.5)*0.3,wy+(Math.random()-0.5)*0.3,wz);
    scene3d.add(mesh);
    var ang=Math.random()*Math.PI*2,sp=0.04+Math.random()*0.15;
    particleMeshes3d.push({mesh:mesh,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,vz:(Math.random()-0.5)*0.08,life:1})
  }
}
function stepParticles3d(dt){
  for(var i2=particleMeshes3d.length-1;i2>=0;i2--){
    var pt=particleMeshes3d[i2];
    pt.mesh.position.x+=pt.vx;pt.mesh.position.y+=pt.vy;pt.mesh.position.z+=pt.vz;
    pt.life-=0.03;
    pt.mesh.material.opacity=Math.max(0,pt.life);
    if(pt.life<=0){scene3d.remove(pt.mesh);extDisposeThree(pt.mesh);particleMeshes3d.splice(i2,1)}
  }
}

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
        spawnParticles3d(0,0,zFor(ring.y-camY),o.violet,6);
      }else if(ring.slots[slotIdx]===2){
        ball.y=ring.y-9;
        render3d(dt);
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
      if(prevV===2||nextV===2){score+=25;spawnParticles3d(0,0,zFor(ball.y-camY),o.coral,14);}
      if(streak>=3)spawnParticles3d(0,0,zFor(ball.y-camY),o.yellow,10);
    }
  }
  camY=Math.max(camY,ball.y-170);
  while(rings[rings.length-1].y<camY+H+120)rings.push(makeRing(rings.length));
  rings=rings.filter(function(rg){return rg.y>camY-60;});
  render3d(dt);
}
function render3d(dt){
  disposeGroupChildren(ringGroup3d);
  rings.forEach(function(ring){
    var ringScreenY=ring.y-camY;
    if(ringScreenY<-20||ringScreenY>500)return;
    var zr=zFor(ringScreenY);
    for(var t=0;t<SLOTS;t++){
      if(!ring.slots[t])continue;
      var pos=((t*SLOT_W+rotationOffset+ring.localOffset)%W+W)%W;
      var theta=pos/W*Math.PI*2;
      var mat=ring.slots[t]===2?blockMatHazard3d:blockMatNormal3d;
      var mesh=new THREE.Mesh(new THREE.BoxGeometry(1.5,0.35,0.9),mat);
      mesh.position.set(R*Math.cos(theta),R*Math.sin(theta),zr);
      mesh.rotation.z=theta+Math.PI/2;
      ringGroup3d.add(mesh)
    }
  });
  ballGroup3d.position.set(0,0,zFor(ball.y-camY));

  stepParticles3d(dt);
  renderer3d.render(scene3d,camera3d);
  r.fxStep(dt);
  r.hud([['SCORE',y(score)],['STREAK',streak],['SPEED',Math.round(vyCap)]]);
}
r.pointer({
  down:function(pt){dragX=pt.x;},
  move:function(pt,ev,isDown){if(isDown&&dragX!==null){rotationOffset+=1.3*(pt.x-dragX);dragX=pt.x;}},
  up:function(){dragX=null;}
});
r.pad([['◀','ArrowLeft'],['▶','ArrowRight']]);
r.fns.push(function(){
  scene3d.traverse(function(obj){extDisposeThree(obj)});
  renderer3d.dispose();
  if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
  if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
});
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
}
ext3DLoadGate(r.el,startGame3D)
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
function startGame3D(){
var W=400,H=400;
var MAX_LIVES=5,MAGNET_TIME=5,MULTI_TIME=7,CATCH_Y1=356,CATCH_Y2=382,CATCH_HALF=34;
var basketX,dragX,items,lives,score,combo,comboMult,elapsed,spawnTimer,magnetTimer,multiTimer;

var wrapDiv=document.createElement('div');
wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
r.el.appendChild(wrapDiv);
var canvasWrap=document.createElement('div');
canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:400/400;margin:0 auto';
wrapDiv.appendChild(canvasWrap);

var renderer3d=extMakeWebGLRenderer();
if(!renderer3d){r.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
renderer3d.setSize(W,H);
renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
renderer3d.setClearColor(0x1a0f08,1);
canvasWrap.appendChild(renderer3d.domElement);
r.cv=renderer3d.domElement;r.w=W;r.h=H;

var SCALE3d=20/W;
var WH2=10*(H/W);
function mapX3d(px2){return px2/W*20-10}
function mapY3d(py){return WH2-py/H*(2*WH2)}

var scene3d=new THREE.Scene();
scene3d.fog=new THREE.Fog(0x1a0f08,26,48);
var camera3d=new THREE.PerspectiveCamera(60,W/H,0.1,200);
camera3d.position.set(0,0,18.3);
camera3d.lookAt(0,0,0);

scene3d.add(new THREE.AmbientLight(0xffe9d9,0.85));
var sun3d=new THREE.DirectionalLight(0xffffff,0.65);
sun3d.position.set(6,10,16);
scene3d.add(sun3d);

function disposeGroupChildren(grp){
  while(grp.children.length){
    var c2=grp.children.pop();
    grp.remove(c2);
    extDisposeThree(c2)
  }
}
var itemGroup3d=new THREE.Group();scene3d.add(itemGroup3d);

var coinOuterMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.yellow),emissive:new THREE.Color(o.yellow),emissiveIntensity:0.2,roughness:0.4});
var coinInnerMat3d=new THREE.MeshStandardMaterial({color:0xe0a93a,roughness:0.5});
var gemMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.teal),emissive:new THREE.Color(o.teal),emissiveIntensity:0.25,roughness:0.35});
var diamondMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.violet),emissive:new THREE.Color(o.violet),emissiveIntensity:0.3,roughness:0.3});
var diamondEdgeMat3d=new THREE.LineBasicMaterial({color:0xffffff});
var heartMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.magenta),roughness:0.5});
var magnetMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.teal),roughness:0.45});
var multiMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.violet),roughness:0.45});
var multiRingMat3d=new THREE.MeshBasicMaterial({color:0xffffff});
var bombMat3d=new THREE.MeshStandardMaterial({color:0x0b0518,roughness:0.5});
var bombRingMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.coral)});
var fuseMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.orange),roughness:0.5});
var sparkMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.yellow)});

var basketMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.orange),roughness:0.5});
var lipMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.ink),roughness:0.6});
var auraMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.teal),transparent:true,opacity:0.35,side:THREE.DoubleSide});
var basketGroup3d=new THREE.Group();scene3d.add(basketGroup3d);
var basketMesh3d=new THREE.Mesh(new THREE.CylinderGeometry(32*SCALE3d,24*SCALE3d,(386-360)*SCALE3d,4,1,true),basketMat3d);
basketMesh3d.rotation.y=Math.PI/4;
basketGroup3d.add(basketMesh3d);
var lipMesh3d=new THREE.Mesh(new THREE.BoxGeometry(68*SCALE3d,6*SCALE3d,6*SCALE3d),lipMat3d);
basketGroup3d.add(lipMesh3d);
var auraMesh3d=new THREE.Mesh(new THREE.RingGeometry(0,44*SCALE3d,24),auraMat3d);
auraMesh3d.position.z=-0.15;
basketGroup3d.add(auraMesh3d);

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

var particleMeshes3d=[];
function spawnParticles3d(wx,wy,color,n){
  var col=new THREE.Color(color);
  for(var pi=0;pi<n;pi++){
    var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
    var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,6),mat);
    mesh.position.set(wx,wy,0.3);
    scene3d.add(mesh);
    var ang=Math.random()*Math.PI*2,sp=0.04+Math.random()*0.16;
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
        spawnParticles3d(mapX3d(it.x),mapY3d(it.y),o.coral,22);
      } else if(it.t==='heart'){
        lives=Math.min(MAX_LIVES,lives+1);
        spawnParticles3d(mapX3d(it.x),mapY3d(it.y),o.magenta,14);
      } else if(it.t==='magnet'){
        magnetTimer=MAGNET_TIME;
        spawnParticles3d(mapX3d(it.x),mapY3d(it.y),o.teal,16);
      } else if(it.t==='multi'){
        multiTimer=MULTI_TIME;
        spawnParticles3d(mapX3d(it.x),mapY3d(it.y),o.violet,16);
      } else {
        combo++;
        comboMult=1+Math.min(4,Math.floor(combo/6));
        var base=it.t==='diamond'?90:it.t==='gem'?40:10;
        var gain=base*comboMult*(multiTimer>0?2:1);
        score+=gain;
        spawnParticles3d(mapX3d(it.x),mapY3d(it.y),it.t==='diamond'?o.violet:it.t==='gem'?o.teal:o.yellow,10);
      }
      items.splice(i,1);
    } else if(it.y>H+10){
      if(it.t==='coin'||it.t==='gem'||it.t==='diamond') resetCombo();
      items.splice(i,1);
    }
  }
  if(lives<=0){
    render3d(dt);
    r.over(score,'Score: '+score);
    return;
  }
  render3d(dt);
}
function render3d(dt){
  disposeGroupChildren(itemGroup3d);
  items.forEach(function(it){
    var wx=mapX3d(it.x),wy=mapY3d(it.y);
    var mesh;
    if(it.t==='coin'){
      var grp=new THREE.Group();
      var outer=new THREE.Mesh(new THREE.CylinderGeometry(9*SCALE3d,9*SCALE3d,0.1,16),coinOuterMat3d);
      outer.rotation.x=Math.PI/2;
      grp.add(outer);
      var inner=new THREE.Mesh(new THREE.CylinderGeometry(5*SCALE3d,5*SCALE3d,0.12,16),coinInnerMat3d);
      inner.rotation.x=Math.PI/2;
      grp.add(inner);
      grp.position.set(wx,wy,0);
      itemGroup3d.add(grp);
    } else if(it.t==='gem'){
      mesh=new THREE.Mesh(new THREE.OctahedronGeometry(10*SCALE3d,0),gemMat3d);
      mesh.position.set(wx,wy,0);
      itemGroup3d.add(mesh);
    } else if(it.t==='diamond'){
      var dgeo=new THREE.OctahedronGeometry(13*SCALE3d,0);
      mesh=new THREE.Mesh(dgeo,diamondMat3d);
      mesh.position.set(wx,wy,0);
      itemGroup3d.add(mesh);
      var edges=new THREE.LineSegments(new THREE.EdgesGeometry(dgeo),diamondEdgeMat3d);
      mesh.add(edges);
    } else if(it.t==='heart'){
      var hgrp=new THREE.Group();
      var hr=9*SCALE3d;
      var lobeL=new THREE.Mesh(new THREE.SphereGeometry(hr*0.55,8,8),heartMat3d);
      lobeL.position.set(-hr*0.3,hr*0.15,0);
      hgrp.add(lobeL);
      var lobeR=new THREE.Mesh(new THREE.SphereGeometry(hr*0.55,8,8),heartMat3d);
      lobeR.position.set(hr*0.3,hr*0.15,0);
      hgrp.add(lobeR);
      var tip=new THREE.Mesh(new THREE.ConeGeometry(hr*0.62,hr*0.9,8),heartMat3d);
      tip.rotation.x=Math.PI;
      tip.position.set(0,-hr*0.3,0);
      hgrp.add(tip);
      hgrp.position.set(wx,wy,0);
      itemGroup3d.add(hgrp);
    } else if(it.t==='magnet'){
      var mgrp=new THREE.Group();
      var horseshoe=new THREE.Mesh(new THREE.TorusGeometry(8*SCALE3d,3*SCALE3d,8,14,Math.PI*1.3),magnetMat3d);
      horseshoe.rotation.z=Math.PI*0.35;
      mgrp.add(horseshoe);
      mgrp.position.set(wx,wy,0);
      itemGroup3d.add(mgrp);
    } else if(it.t==='multi'){
      var xgrp=new THREE.Group();
      var ball=new THREE.Mesh(new THREE.SphereGeometry(9*SCALE3d,12,10),multiMat3d);
      xgrp.add(ball);
      var ring=new THREE.Mesh(new THREE.TorusGeometry(9*SCALE3d,0.8*SCALE3d,6,16),multiRingMat3d);
      xgrp.add(ring);
      xgrp.position.set(wx,wy,0);
      itemGroup3d.add(xgrp);
    } else {
      var bgrp=new THREE.Group();
      var bomb=new THREE.Mesh(new THREE.SphereGeometry(10*SCALE3d,14,12),bombMat3d);
      bgrp.add(bomb);
      var bring=new THREE.Mesh(new THREE.TorusGeometry(10*SCALE3d+0.04,0.03,6,16),bombRingMat3d);
      bgrp.add(bring);
      var fuse=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.3,5),fuseMat3d);
      fuse.position.set(4*SCALE3d,12*SCALE3d,0);
      fuse.rotation.z=-0.4;
      bgrp.add(fuse);
      var spark=new THREE.Mesh(new THREE.SphereGeometry(0.06,6,6),sparkMat3d);
      spark.position.set(8*SCALE3d,15*SCALE3d,0);
      bgrp.add(spark);
      bgrp.position.set(wx,wy,0);
      itemGroup3d.add(bgrp);
    }
  });

  auraMesh3d.visible=magnetTimer>0;
  basketGroup3d.position.set(mapX3d(basketX),mapY3d(373),0);

  stepParticles3d(dt);
  renderer3d.render(scene3d,camera3d);
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
r.fns.push(function(){
  scene3d.traverse(function(obj){extDisposeThree(obj)});
  renderer3d.dispose();
  if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
  if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
});
r.begin(function(){
  basketX=200; dragX=null; items=[]; lives=3; score=0; combo=0; comboMult=1;
  elapsed=0; spawnTimer=0.4; magnetTimer=0; multiTimer=0;
  r.fx=[];
  r.frame(step);
});
}
ext3DLoadGate(r.el,startGame3D)
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
function startGame3D(){
var W=400,H=400;
var targets,lives,score,combo,comboMult,centerStreak,bestCenterStreak,elapsed,spawnTimer;

var wrapDiv=document.createElement('div');
wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
r.el.appendChild(wrapDiv);
var canvasWrap=document.createElement('div');
canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:400/400;margin:0 auto';
wrapDiv.appendChild(canvasWrap);

var renderer3d=extMakeWebGLRenderer();
if(!renderer3d){r.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
renderer3d.setSize(W,H);
renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
renderer3d.setClearColor(0x1a0d12,1);
canvasWrap.appendChild(renderer3d.domElement);
r.cv=renderer3d.domElement;r.w=W;r.h=H;

var SCALE3d=20/W;
var WH2=10*(H/W);
function mapX3d(px2){return px2/W*20-10}
function mapY3d(py){return WH2-py/H*(2*WH2)}

var scene3d=new THREE.Scene();
scene3d.fog=new THREE.Fog(0x1a0d12,26,48);
var camera3d=new THREE.PerspectiveCamera(60,W/H,0.1,200);
camera3d.position.set(0,0,18.3);
camera3d.lookAt(0,0,0);

scene3d.add(new THREE.AmbientLight(0xffe0d9,0.85));
var sun3d=new THREE.DirectionalLight(0xffffff,0.6);
sun3d.position.set(6,10,16);
scene3d.add(sun3d);

function disposeGroupChildren(grp){
  while(grp.children.length){
    var c2=grp.children.pop();
    grp.remove(c2);
    extDisposeThree(c2)
  }
}
var targetGroup3d=new THREE.Group();scene3d.add(targetGroup3d);
var inkMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.ink)});
var decoyMat3d=new THREE.MeshBasicMaterial({color:0xffffff});
var bonusMarkMat3d=new THREE.MeshBasicMaterial({color:0xffffff});
var ringColMatCache3d={};
function ringColMat(col,opacity){
  var key=col+'|'+(opacity||1);
  if(!ringColMatCache3d[key])ringColMatCache3d[key]=new THREE.MeshBasicMaterial({color:new THREE.Color(col),transparent:opacity<1,opacity:opacity===undefined?1:opacity});
  return ringColMatCache3d[key]
}

function tryPlace(){
  var attempts=0,tx,ty,ok;
  do{
    tx=c(40,W-40); ty=c(40,H-40); attempts++;
    ok=!targets.some(function(t2){ return Math.hypot(t2.x-tx,t2.y-ty)<70; });
  } while(!ok&&attempts<10);
  return {x:tx,y:ty};
}

var particleMeshes3d=[];
function spawnParticles3d(wx,wy,color,n){
  var col=new THREE.Color(color);
  for(var pi=0;pi<n;pi++){
    var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
    var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,6),mat);
    mesh.position.set(wx,wy,0.3);
    scene3d.add(mesh);
    var ang=Math.random()*Math.PI*2,sp=0.04+Math.random()*0.16;
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

function step(dt){
  elapsed+=dt;
  var lifeDur=Math.max(0.5,1.65-0.014*elapsed);
  var maxTargets=elapsed>45?5:4;
  spawnTimer-=dt;
  if(spawnTimer<=0&&targets.length<maxTargets){
    var pos=tryPlace();
    var isBonus=elapsed>6&&Math.random()<0.07;
    var isDecoy=!isBonus&&elapsed>9&&Math.random()<0.09;
    var type=isBonus?'bonus':(isDecoy?'decoy':'normal');
    var life=lifeDur*(type==='bonus'?0.6:1);
    targets.push({x:pos.x,y:pos.y,r:30,life:life,t:life,type:type});
    spawnTimer=Math.max(0.24,0.8-0.008*elapsed)*c(0.6,1.15);
  }
  var i,tg;
  for(i=targets.length-1;i>=0;i--){
    tg=targets[i];
    tg.t-=dt;
    if(tg.t<=0){
      if(tg.type!=='decoy'){
        lives--; combo=0; comboMult=1; centerStreak=0;
        spawnParticles3d(mapX3d(tg.x),mapY3d(tg.y),o.dim,8);
      } else {
        spawnParticles3d(mapX3d(tg.x),mapY3d(tg.y),o.dim,4);
      }
      targets.splice(i,1);
    }
  }
  if(lives<=0){
    render3d(dt);
    r.over(score,'Score: '+score+' · Best center streak '+bestCenterStreak);
    return;
  }
  render3d(dt);
}
function render3d(dt){
  disposeGroupChildren(targetGroup3d);
  targets.forEach(function(tg){
    var frac=tg.t/tg.life;
    var ringCol=tg.type==='bonus'?o.yellow:(tg.type==='decoy'?o.violet:o.coral);
    var wx=mapX3d(tg.x),wy=mapY3d(tg.y);
    var grp=new THREE.Group();
    var halo=new THREE.Mesh(new THREE.CircleGeometry(tg.r*SCALE3d,24),ringColMat(ringCol,0.25));
    halo.position.z=0;
    grp.add(halo);
    var outer=new THREE.Mesh(new THREE.CircleGeometry(Math.max(0.01,tg.r*frac*SCALE3d),24),ringColMat(ringCol,1));
    outer.position.z=0.01;
    grp.add(outer);
    var mid=new THREE.Mesh(new THREE.CircleGeometry(Math.max(0.005,tg.r*frac*0.6*SCALE3d),20),inkMat3d);
    mid.position.z=0.02;
    grp.add(mid);
    var inner=new THREE.Mesh(new THREE.CircleGeometry(Math.max(0.003,tg.r*frac*0.25*SCALE3d),16),ringColMat(ringCol,1));
    inner.position.z=0.03;
    grp.add(inner);
    var border=new THREE.Mesh(new THREE.RingGeometry(Math.max(0.001,tg.r*SCALE3d-0.04),tg.r*SCALE3d,28),inkMat3d);
    border.position.z=0.012;
    grp.add(border);
    if(tg.type==='decoy'){
      var crossA=new THREE.Mesh(new THREE.BoxGeometry(0.33,0.05,0.01),decoyMat3d);
      crossA.rotation.z=Math.PI/4;
      crossA.position.z=0.05;
      grp.add(crossA);
      var crossB=new THREE.Mesh(new THREE.BoxGeometry(0.33,0.05,0.01),decoyMat3d);
      crossB.rotation.z=-Math.PI/4;
      crossB.position.z=0.05;
      grp.add(crossB);
    } else if(tg.type==='bonus'){
      var mark=new THREE.Mesh(new THREE.OctahedronGeometry(0.1,0),bonusMarkMat3d);
      mark.position.z=0.06;
      grp.add(mark);
    }
    grp.position.set(wx,wy,0);
    targetGroup3d.add(grp)
  });
  stepParticles3d(dt);
  renderer3d.render(scene3d,camera3d);
  r.fxStep(dt);
  r.hud([['SCORE',y(score)],['LIVES',lives],['COMBO',combo+' x'+comboMult],['CENTER',centerStreak]]);
}
r.pointer({
  down:function(pt){
    var i,tg,dist,freshness,distRatio,isCenter,gain;
    for(i=targets.length-1;i>=0;i--){
      tg=targets[i];
      dist=Math.hypot(tg.x-pt.x,tg.y-pt.y);
      if(dist<tg.r){
        if(tg.type==='decoy'){
          lives--; combo=0; comboMult=1; centerStreak=0;
          spawnParticles3d(mapX3d(tg.x),mapY3d(tg.y),o.violet,16);
          targets.splice(i,1);
          return;
        }
        freshness=tg.t/tg.life;
        distRatio=dist/tg.r;
        combo++;
        comboMult=1+Math.min(4,Math.floor(combo/5));
        isCenter=distRatio<0.35;
        if(isCenter){ centerStreak++; if(centerStreak>bestCenterStreak) bestCenterStreak=centerStreak; }
        else { centerStreak=0; }
        gain=Math.round((10+30*freshness+20*(1-distRatio))*comboMult);
        gain+=Math.min(60,centerStreak*5);
        if(tg.type==='bonus') gain*=3;
        score+=gain;
        if(centerStreak>0&&centerStreak%5===0){
          score+=30;
          spawnParticles3d(mapX3d(tg.x),mapY3d(tg.y),o.yellow,26);
        } else {
          spawnParticles3d(mapX3d(tg.x),mapY3d(tg.y),tg.type==='bonus'?o.yellow:o.coral,12);
        }
        targets.splice(i,1);
        return;
      }
    }
    combo=0; comboMult=1; centerStreak=0;
  }
});
r.fns.push(function(){
  scene3d.traverse(function(obj){extDisposeThree(obj)});
  renderer3d.dispose();
  if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
  if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
});
r.begin(function(){
  targets=[]; lives=3; score=0; combo=0; comboMult=1; centerStreak=0; bestCenterStreak=0;
  elapsed=0; spawnTimer=0.5;
  r.fx=[];
  r.frame(step);
});
}
ext3DLoadGate(r.el,startGame3D)
})