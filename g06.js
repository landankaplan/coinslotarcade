,w('skyHopper',b,'Sky Hopper',o.green,'Bounce from platform to platform, snag coins and dodge crumbling ledges and spikes.','Left/Right (or A/D) to steer · drag on mobile · avoid red spikes',function(r){
function startGame3D(){
  var WW=320, HH=480;
  var player, platforms, coins, worldCursor, heightScore, dragTarget, comboMult, comboTimer, bonusScore, ended;

  var wrapDiv=document.createElement('div');
  wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
  r.el.appendChild(wrapDiv);
  var canvasWrap=document.createElement('div');
  canvasWrap.style.cssText='position:relative;width:100%;max-width:320px;aspect-ratio:320/480;margin:0 auto';
  wrapDiv.appendChild(canvasWrap);

  var renderer3d=extMakeWebGLRenderer();
  if(!renderer3d){r.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
  renderer3d.setSize(WW,HH);
  renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
  renderer3d.setClearColor(0x0e1430,1);
  canvasWrap.appendChild(renderer3d.domElement);
  r.cv=renderer3d.domElement;r.w=WW;r.h=HH;

  var WH2=10*(HH/WW);
  function mapX3d(px2){return px2/WW*20-10}
  function mapY3d(py){return WH2-py/HH*(2*WH2)}

  var scene3d=new THREE.Scene();
  scene3d.fog=new THREE.Fog(0x0e1430,28,58);
  var camera3d=new THREE.PerspectiveCamera(60,WW/HH,0.1,200);
  camera3d.position.set(0,0,26);
  camera3d.lookAt(0,0,0);

  scene3d.add(new THREE.AmbientLight(0xcfe3ff,0.85));
  var sun3d=new THREE.DirectionalLight(0xffffff,0.75);
  sun3d.position.set(6,10,12);
  scene3d.add(sun3d);

  var starGeo3d=new THREE.BufferGeometry();
  var starPos3d=[];
  for(var si=0;si<90;si++){starPos3d.push((Math.random()*2-1)*11,(Math.random()*2-1)*WH2,-6-Math.random()*10)}
  starGeo3d.setAttribute('position',new THREE.Float32BufferAttribute(starPos3d,3));
  scene3d.add(new THREE.Points(starGeo3d,new THREE.PointsMaterial({color:0xcfe9ff,size:0.06,transparent:true,opacity:0.6})));

  function disposeGroupChildren(grp){
    while(grp.children.length){
      var c2=grp.children.pop();
      grp.remove(c2);
      extDisposeThree(c2)
    }
  }
  var platGroup3d=new THREE.Group();scene3d.add(platGroup3d);
  var coinGroup3d=new THREE.Group();scene3d.add(coinGroup3d);
  var platMatByType=[
    new THREE.MeshStandardMaterial({color:new THREE.Color(o.green),roughness:0.6}),
    new THREE.MeshStandardMaterial({color:new THREE.Color(o.blue),roughness:0.6}),
    new THREE.MeshStandardMaterial({color:0xa5763b,roughness:0.7}),
    new THREE.MeshStandardMaterial({color:new THREE.Color(o.violet),roughness:0.6}),
    new THREE.MeshStandardMaterial({color:new THREE.Color(o.coral),roughness:0.6})
  ];
  var springMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.coral),roughness:0.5});
  var coinMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.yellow),emissive:new THREE.Color(o.yellow),emissiveIntensity:0.4,roughness:0.4});

  var playerGroup3d=new THREE.Group();
  var playerMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.yellow),emissive:new THREE.Color(o.yellow),emissiveIntensity:0.25,roughness:0.5});
  var playerBody3d=new THREE.Mesh(new THREE.SphereGeometry(0.85,14,14),playerMat3d);
  playerGroup3d.add(playerBody3d);
  var eyeMat3d=new THREE.MeshBasicMaterial({color:0x10101a});
  var eyeL3d=new THREE.Mesh(new THREE.SphereGeometry(0.14,8,8),eyeMat3d);eyeL3d.position.set(-0.3,0.05,0.68);playerGroup3d.add(eyeL3d);
  var eyeR3d=new THREE.Mesh(new THREE.SphereGeometry(0.14,8,8),eyeMat3d);eyeR3d.position.set(0.3,0.05,0.68);playerGroup3d.add(eyeR3d);
  scene3d.add(playerGroup3d);

  var particleMeshes3d=[];
  function spawnParticles3d(wx,wy,color,n){
    var col=new THREE.Color(color);
    for(var pi=0;pi<n;pi++){
      var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
      var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,6),mat);
      mesh.position.set(wx,wy,0.3);
      scene3d.add(mesh);
      var ang=Math.random()*Math.PI*2,sp=0.05+Math.random()*0.18;
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

  function platformType(){
    var roll = Math.random();
    if(heightScore>1500 && roll<0.09) return 4;
    if(heightScore>1000 && roll<0.16) return 3;
    if(heightScore>800 && roll<0.28) return 2;
    if(heightScore>400 && roll<0.42) return 1;
    return 0;
  }

  function spawnPlatform(atY){
    var kind = platformType();
    var plat = {x:c(0,262), y:atY, w:58, t:kind, d:Math.random()<0.5?1:-1, sp:kind===0 && Math.random()<0.09, dead:0, life: kind===3 ? 2.2 : -1};
    platforms.push(plat);
    if(Math.random()<0.35){
      coins.push({x: plat.x+plat.w/2+c(-14,14), y: atY-22, r:6, taken:0, value: heightScore>800?10:5});
    }
  }

  function fillAhead(){
    while(worldCursor>-60) spawnPlatform(worldCursor -= c(38, Math.min(108, 62+0.008*heightScore)));
  }

  function endRun(dt){
    render3d(dt);
    var total = Math.floor(heightScore/10)+bonusScore;
    r.over(total, 'Height: '+Math.floor(heightScore/10)+' m · Score: '+total);
  }

  function step(dt){
    var startY = player.y, i, plat, shift;
    player.vx = dragTarget!==null ? s(6*(dragTarget-player.x), -300, 300) : 280*r.ax();
    player.x += player.vx*dt;
    if(player.x<-10) player.x = 330;
    if(player.x>330) player.x = -10;
    player.vy += 1500*dt;
    player.y += player.vy*dt;
    player.sq = Math.max(0, player.sq - 5*dt);

    comboTimer -= dt;
    if(comboTimer<=0) comboMult = 1;

    platforms.forEach(function(plat){
      if(plat.t===1) { plat.x += 60*plat.d*dt; if(plat.x<0 || plat.x>WW-plat.w) plat.d = -plat.d; }
      if(plat.t===3 && !plat.dead){ plat.life -= dt; if(plat.life<=0){ plat.dead=1; } }
    });

    if(player.vy>0){
      for(i=0;i<platforms.length;i++){
        plat = platforms[i];
        if(plat.dead) continue;
        if(startY+12<=plat.y+2 && player.y+12>=plat.y && player.x>plat.x-8 && player.x<plat.x+plat.w+8){
          if(plat.t===4){ spawnParticles3d(mapX3d(player.x),mapY3d(plat.y),o.coral,26); endRun(dt); return; }
          if(plat.t===2){ plat.dead=1; continue; }
          player.vy = plat.sp ? -980 : -620;
          player.sq = 1;
          spawnParticles3d(mapX3d(player.x),mapY3d(plat.y),o.green,5);
          break;
        }
      }
    }

    for(i=coins.length-1;i>=0;i--){
      var coin = coins[i];
      if(!coin.taken && Math.hypot(coin.x-player.x, coin.y-player.y) < coin.r+14){
        coin.taken = 1;
        comboMult = Math.min(6, comboMult+1);
        comboTimer = 2.5;
        bonusScore += coin.value*comboMult;
        spawnParticles3d(mapX3d(coin.x),mapY3d(coin.y),o.yellow,8);
      }
    }

    if(player.y<200){
      shift = 200-player.y;
      player.y = 200;
      heightScore += shift;
      platforms.forEach(function(plat){ plat.y += shift; });
      coins.forEach(function(coin){ coin.y += shift; });
      worldCursor += shift;
      platforms = platforms.filter(function(plat){ return plat.y<500; });
      coins = coins.filter(function(coin){ return coin.y<500 && !coin.taken; });
      fillAhead();
    }

    platforms.forEach(function(plat){ if(plat.dead) plat.y += 400*dt; });
    platforms = platforms.filter(function(plat){ return plat.y<520; });

    if(player.y>510){ endRun(dt); return; }
    render3d(dt);
  }

  function render3d(dt){
    var squash = 4*player.sq;
    disposeGroupChildren(platGroup3d);
    platforms.forEach(function(plat){
      if(plat.t===3 && plat.life<0.6 && Math.floor(plat.life*10)%2) return;
      var mesh=new THREE.Mesh(new THREE.BoxGeometry(plat.w/20,0.3,0.9),platMatByType[plat.t]);
      mesh.position.set(mapX3d(plat.x+plat.w/2), mapY3d(plat.y+5), 0);
      platGroup3d.add(mesh);
      if(plat.sp){
        var spring=new THREE.Mesh(new THREE.ConeGeometry(0.3,0.4,8),springMat3d);
        spring.position.set(mapX3d(plat.x+plat.w/2), mapY3d(plat.y+5)+0.35, 0);
        platGroup3d.add(spring);
      }
      if(plat.t===4){
        for(var sk=0;sk<3;sk++){
          var spike=new THREE.Mesh(new THREE.ConeGeometry(0.12,0.4,6),new THREE.MeshStandardMaterial({color:0x10101a,roughness:0.6}));
          spike.position.set(mapX3d(plat.x+10+sk*17.5), mapY3d(plat.y)+0.3, 0);
          platGroup3d.add(spike);
        }
      }
    });

    disposeGroupChildren(coinGroup3d);
    coins.forEach(function(coin){
      if(coin.taken) return;
      var mesh=new THREE.Mesh(new THREE.CylinderGeometry(coin.r/14,coin.r/14,0.12,14),coinMat3d);
      mesh.rotation.x=Math.PI/2;
      mesh.position.set(mapX3d(coin.x), mapY3d(coin.y), 0);
      coinGroup3d.add(mesh);
    });

    playerGroup3d.scale.set(1+squash/24, 1-squash/24, 1);
    playerGroup3d.position.set(mapX3d(player.x), mapY3d(player.y), 0.4);

    stepParticles3d(dt);
    renderer3d.render(scene3d,camera3d);
    r.hud([['HEIGHT', Math.floor(heightScore/10)+'m'], ['SCORE', Math.floor(heightScore/10)+bonusScore], ['COMBO', 'x'+comboMult]]);
  }

  r.pointer({down:function(pt){ dragTarget = pt.x; }, move:function(pt,evt,down){ if(down) dragTarget = pt.x; }, up:function(){ dragTarget = null; }});
  r.pad([['◀','ArrowLeft'],['▶','ArrowRight']]);

  r.fns.push(function(){
    scene3d.traverse(function(obj){extDisposeThree(obj)});
    renderer3d.dispose();
    if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
    if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
  });
  r.begin(function(){
    player = {x:160, y:380, vx:0, vy:-300, sq:0};
    platforms = [{x:130, y:430, w:58, t:0, d:1, sp:false, dead:0, life:-1}];
    coins = [];
    worldCursor = 430; heightScore = 0; dragTarget = null; comboMult = 1; comboTimer = 0; bonusScore = 0; ended = false;
    r.fx = [];
    fillAhead();
    r.frame(step);
  });
}
ext3DLoadGate(r.el,startGame3D)
}),w('pyramidHop',b,'Pyramid Hop',o.coral,'Hop across every cube of the pyramid to repaint it, chain combos, and dodge the chasers.','Arrows hop diagonally (Up = up-right, Left = up-left, Down = down-left, Right = down-right) · or Q E Z C · or tap a corner',function(r){
function startGame3D(){
  var W=400,H=400;
  var grid, player, enemies, discs, lives, score, level, timeAcc, ballTimer, coilTimer, freezeTimer, targetColor, comboMult, comboTimer, livesLostThisLevel, nextExtraLife;

  var wrapDiv=document.createElement('div');
  wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
  r.el.appendChild(wrapDiv);
  var canvasWrap=document.createElement('div');
  canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:1/1;margin:0 auto';
  wrapDiv.appendChild(canvasWrap);

  var renderer3d=extMakeWebGLRenderer();
  if(!renderer3d){r.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
  renderer3d.setSize(W,H);
  renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
  renderer3d.setClearColor(0x120a2e,1);
  canvasWrap.appendChild(renderer3d.domElement);
  r.cv=renderer3d.domElement;r.w=W;r.h=H;

  var scene3d=new THREE.Scene();
  scene3d.fog=new THREE.Fog(0x120a2e,24,46);
  var camera3d=new THREE.PerspectiveCamera(42,W/H,0.1,200);
  camera3d.position.set(0,15,22);
  camera3d.lookAt(0,-5,0);

  scene3d.add(new THREE.AmbientLight(0xcfe3ff,0.8));
  var sun3d=new THREE.DirectionalLight(0xffffff,0.8);
  sun3d.position.set(8,16,12);
  scene3d.add(sun3d);

  function disposeGroupChildren(grp){
    while(grp.children.length){
      var c2=grp.children.pop();
      grp.remove(c2);
      extDisposeThree(c2)
    }
  }

  var SHADE_COLORS=[0x3a2a7a,new THREE.Color(o.yellow).getHex(),new THREE.Color(o.teal).getHex()];
  var cubeMatsByShade=SHADE_COLORS.map(function(hex){return new THREE.MeshStandardMaterial({color:hex,roughness:0.6})});
  var pyramidGroup3d=new THREE.Group();scene3d.add(pyramidGroup3d);
  var discGroup3d=new THREE.Group();scene3d.add(discGroup3d);
  var enemyGroup3d=new THREE.Group();scene3d.add(enemyGroup3d);
  var playerGroup3d=new THREE.Group();
  var playerMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.orange),emissive:new THREE.Color(o.orange),emissiveIntensity:0.3,roughness:0.5});
  var playerBody3d=new THREE.Mesh(new THREE.SphereGeometry(0.85,14,14),playerMat3d);
  playerGroup3d.add(playerBody3d);
  var eyeMat3d=new THREE.MeshBasicMaterial({color:0x10101a});
  var eyeL3d=new THREE.Mesh(new THREE.SphereGeometry(0.17,8,8),eyeMat3d);eyeL3d.position.set(-0.32,0.3,0.68);playerGroup3d.add(eyeL3d);
  var eyeR3d=new THREE.Mesh(new THREE.SphereGeometry(0.17,8,8),eyeMat3d);eyeR3d.position.set(0.32,0.3,0.68);playerGroup3d.add(eyeR3d);
  scene3d.add(playerGroup3d);

  var particleMeshes3d=[];
  function spawnParticles3d(wx,wy,wz,color,n){
    var col=new THREE.Color(color);
    for(var pi=0;pi<n;pi++){
      var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
      var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.13,6,6),mat);
      mesh.position.set(wx,wy,wz);
      scene3d.add(mesh);
      var ang=Math.random()*Math.PI*2,sp=0.06+Math.random()*0.2;
      particleMeshes3d.push({mesh:mesh,vx:Math.cos(ang)*sp,vy:0.05+Math.random()*0.12,vz:Math.sin(ang)*sp,life:1})
    }
  }
  function stepParticles3d(dt){
    for(var i2=particleMeshes3d.length-1;i2>=0;i2--){
      var pt=particleMeshes3d[i2];
      pt.mesh.position.x+=pt.vx;pt.mesh.position.y+=pt.vy;pt.mesh.position.z+=pt.vz;
      pt.vy-=0.01;
      pt.life-=0.035;
      pt.mesh.material.opacity=Math.max(0,pt.life);
      if(pt.life<=0){scene3d.remove(pt.mesh);extDisposeThree(pt.mesh);particleMeshes3d.splice(i2,1)}
    }
  }

  function cubePos(row,col){ return {x: 200+50*(col-row/2), y: 70+40*row}; }
  function validCell(row,col){ return row>=0 && row<6 && col>=0 && col<=row; }

  function pos3d(row,col){
    return {x:(col-row/2)*2.4, y:-row*1.7, z:row*1.9-4.5};
  }
  function animPos3d(ent){
    var base=pos3d(ent.r,ent.c), target, frac;
    if(ent.ride){
      target=pos3d(0,0);
      frac=1-ent.ride;
      return {x:base.x+(target.x-base.x)*frac, y:base.y+(target.y-base.y)*frac+2.6*Math.sin(frac*Math.PI), z:base.z+(target.z-base.z)*frac};
    }
    if(ent.hop){
      target=pos3d(ent.tr,ent.tc);
      return {x:base.x+(target.x-base.x)*ent.t, y:base.y+(target.y-base.y)*ent.t+1.4*Math.sin(ent.t*Math.PI), z:base.z+(target.z-base.z)*ent.t};
    }
    return base;
  }

  function newLevel(){
    var row, col;
    grid = [];
    for(row=0; row<6; row++){ grid.push([]); for(col=0; col<=row; col++) grid[row].push(0); }
    discs = level>=3
      ? [{r:2,c:-1,on:1},{r:2,c:3,on:1},{r:4,c:-1,on:1},{r:4,c:5,on:1}]
      : [{r:2,c:-1,on:1},{r:2,c:3,on:1}];
    targetColor = [1,2,1][(level-1)%3];
    livesLostThisLevel = 0;
  }

  function resetRound(){
    player = {r:0, c:0, tr:0, tc:0, t:0, hop:0, ride:0};
    enemies = [];
    ballTimer = 3; coilTimer = 5; freezeTimer = 0;
  }

  function paintCube(row, col, kind){
    var cur = grid[row][col];
    var mode = (level-1)%3;
    if(kind==='slick'){
      grid[row][col] = mode===1 ? Math.max(0, cur-1) : 0;
      return;
    }
    if(mode===0){ if(cur<1){ grid[row][col]=1; awardPaint(); } }
    else if(mode===1){ if(cur<2){ grid[row][col]=cur+1; awardPaint(); } }
    else { grid[row][col] = 1-cur; if(!cur) awardPaint(); }
  }

  function awardPaint(){
    score += 25*comboMult;
    comboMult = Math.min(8, comboMult+1);
    comboTimer = 2.2;
    checkExtraLife();
  }

  function checkExtraLife(){
    if(score >= nextExtraLife){ lives++; nextExtraLife += 4000; }
  }

  function requestHop(dr, dc){
    if(player.hop || player.ride || freezeTimer>0) return;
    player.tr = player.r+dr; player.tc = player.c+dc; player.hop = 1; player.t = 0;
  }

  var DIR_KEYS = {ArrowUp:[-1,0], e:[-1,0], w:[-1,0], ArrowLeft:[-1,-1], q:[-1,-1], a:[-1,-1], ArrowDown:[1,0], z:[1,0], s:[1,0], ArrowRight:[1,1], c:[1,1], d:[1,1]};

  function loseLife(){
    if(freezeTimer>0) return;
    lives--; livesLostThisLevel++; comboMult = 1; comboTimer = 0;
    freezeTimer = 1.3;
    var pp=animPos3d(player);
    spawnParticles3d(pp.x, pp.y+0.6, pp.z, o.coral, 24);
  }

  function projectedCell(ent){ return (ent.hop && ent.t>0.5) ? [ent.tr, ent.tc] : [ent.r, ent.c]; }

  function chooseDir(en){
    var options = [[1,0],[1,1]], playerCell;
    if(en.kind==='snake'){
      options = [[-1,-1],[-1,0],[1,0],[1,1]].filter(function(dd){ return validCell(en.r+dd[0], en.c+dd[1]); });
      playerCell = projectedCell(player);
      options.sort(function(dA,dB){
        var posA = cubePos(en.r+dA[0], en.c+dA[1]), posB = cubePos(en.r+dB[0], en.c+dB[1]), homeP = cubePos(playerCell[0], playerCell[1]);
        return Math.hypot(posA.x-homeP.x, posA.y-homeP.y) - Math.hypot(posB.x-homeP.x, posB.y-homeP.y);
      });
      return Math.random()<0.12 ? u(options) : options[0];
    }
    return u(options);
  }

  function allPainted(){
    var row, col;
    for(row=0; row<6; row++) for(col=0; col<=row; col++) if(grid[row][col]!==targetColor) return false;
    return true;
  }

  function step(dt){
    var idx, en, dir, discMatch, projPlayer, projEnemy;
    timeAcc += dt;
    if(freezeTimer>0){
      freezeTimer -= dt;
      if(freezeTimer<=0){
        if(lives<=0){ render3d(dt); r.over(score, 'Level '+level+' · Score: '+score); return; }
        resetRound();
      }
      render3d(dt);
      return;
    }

    comboTimer -= dt;
    if(comboTimer<=0) comboMult = 1;

    coilTimer -= dt;
    ballTimer -= dt;
    if(ballTimer<=0){
      enemies.push({r:0,c:0,tr:0,tc:0,t:0,hop:0,kind:(level>=4 && Math.random()<0.35)?'fastball':'ball',wait:0.3});
      ballTimer = Math.max(2.5, 6-0.4*level)*c(0.7,1.3);
    }
    if(coilTimer<=0 && !enemies.some(function(en){ return en.kind==='coil'||en.kind==='snake'; })){
      enemies.push({r:0,c:0,tr:0,tc:0,t:0,hop:0,kind:'coil',wait:0.3});
      coilTimer = 8;
    }
    if(level>=2 && Math.random()<0.09*dt && !enemies.some(function(en){ return en.kind==='slick'; })){
      enemies.push({r:0,c:0,tr:0,tc:0,t:0,hop:0,kind:'slick',wait:0.3});
    }

    if(player.hop){
      player.t += dt/0.24;
      if(player.t>=1){
        player.hop = 0; player.t = 0;
        if(validCell(player.tr, player.tc)){
          player.r = player.tr; player.c = player.tc;
          paintCube(player.r, player.c, 'pl');
        } else {
          discMatch = discs.filter(function(dsc){ return dsc.on && dsc.r===player.tr && dsc.c===player.tc; })[0];
          if(discMatch){ discMatch.on = 0; player.r = player.tr; player.c = player.tc; player.ride = 1; }
          else { loseLife(); player.r = 0; player.c = 0; }
        }
      }
    }

    if(player.ride){
      player.ride -= dt;
      if(player.ride<=0){
        player.ride = 0; player.r = 0; player.c = 0;
        paintCube(0,0,'pl');
        enemies = enemies.filter(function(en){
          if(en.kind==='snake' || en.kind==='coil'){
            score += 400+100*level; checkExtraLife();
            var ep=animPos3d(en);
            spawnParticles3d(ep.x, ep.y+0.5, ep.z, o.violet, 20);
            return false;
          }
          return true;
        });
      }
    }

    for(idx=enemies.length-1; idx>=0; idx--){
      en = enemies[idx];
      if(en.wait>0){ en.wait -= dt; continue; }
      if(!en.hop){
        if(en.kind==='coil' && en.r>=5) en.kind = 'snake';
        dir = chooseDir(en);
        en.tr = en.r+dir[0]; en.tc = en.c+dir[1]; en.hop = 1; en.t = 0;
      }
      en.t += dt/(en.kind==='snake' ? Math.max(0.28, 0.42-0.02*level) : en.kind==='fastball' ? 0.22 : 0.4);
      if(en.t>=1){
        en.hop = 0; en.t = 0;
        if(!validCell(en.tr, en.tc)){ enemies.splice(idx,1); continue; }
        en.r = en.tr; en.c = en.tc;
        if(en.kind==='slick') paintCube(en.r, en.c, 'slick');
      }
    }

    if(!player.ride){
      for(idx=enemies.length-1; idx>=0; idx--){
        en = enemies[idx];
        if(en.wait>0) continue;
        projPlayer = projectedCell(player); projEnemy = projectedCell(en);
        if(projPlayer[0]===projEnemy[0] && projPlayer[1]===projEnemy[1]){
          if(en.kind!=='slick'){ loseLife(); break; }
          score += 300; checkExtraLife();
          var ep2=animPos3d(en);
          spawnParticles3d(ep2.x, ep2.y+0.5, ep2.z, o.green, 14);
          enemies.splice(idx,1);
        }
      }
    }

    if(allPainted()){
      score += 500+100*discs.filter(function(dsc){ return dsc.on; }).length + (livesLostThisLevel===0 ? 300+100*level : 0);
      checkExtraLife();
      level++;
      newLevel();
      resetRound();
    }

    render3d(dt);
  }

  function render3d(dt){
    disposeGroupChildren(pyramidGroup3d);
    var row, col, pp;
    for(row=0; row<6; row++){
      for(col=0; col<=row; col++){
        pp = pos3d(row,col);
        var mesh=new THREE.Mesh(new THREE.BoxGeometry(2.2,1.0,2.2),cubeMatsByShade[grid[row][col]]);
        mesh.position.set(pp.x, pp.y-0.5, pp.z);
        pyramidGroup3d.add(mesh);
      }
    }

    disposeGroupChildren(discGroup3d);
    discs.forEach(function(dsc){
      if(!dsc.on) return;
      var dp=pos3d(dsc.r, dsc.c);
      var mat=new THREE.MeshStandardMaterial({color:Math.floor(4*timeAcc)%2 ? new THREE.Color(o.magenta) : new THREE.Color(o.blue),roughness:0.5});
      var mesh=new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.15,0.35,16),mat);
      mesh.position.set(dp.x, dp.y+0.05, dp.z);
      discGroup3d.add(mesh);
    });

    disposeGroupChildren(enemyGroup3d);
    enemies.forEach(function(en){
      if(en.wait>0) return;
      var ep=animPos3d(en);
      var colHex = en.kind==='slick' ? o.green : en.kind==='ball' ? o.coral : en.kind==='fastball' ? o.orange : o.violet;
      var mat=new THREE.MeshStandardMaterial({color:new THREE.Color(colHex),emissive:new THREE.Color(colHex),emissiveIntensity:0.25,roughness:0.5});
      var body=new THREE.Mesh(new THREE.SphereGeometry(en.kind==='snake'?0.78:0.7,12,12),mat);
      body.position.set(ep.x, ep.y+0.75, ep.z);
      enemyGroup3d.add(body);
      if(en.kind==='snake'){
        var head=new THREE.Mesh(new THREE.SphereGeometry(0.52,10,10),mat);
        head.position.set(ep.x, ep.y+1.55, ep.z);
        enemyGroup3d.add(head);
        var eL=new THREE.Mesh(new THREE.SphereGeometry(0.13,6,6),eyeMat3d);eL.position.set(ep.x-0.22,ep.y+1.6,ep.z+0.4);enemyGroup3d.add(eL);
        var eR=new THREE.Mesh(new THREE.SphereGeometry(0.13,6,6),eyeMat3d);eR.position.set(ep.x+0.22,ep.y+1.6,ep.z+0.4);enemyGroup3d.add(eR);
      }
    });

    var blink = freezeTimer<=0 || Math.floor(8*freezeTimer)%2;
    playerGroup3d.visible = !!blink;
    if(blink){
      var ppos=animPos3d(player);
      playerGroup3d.position.set(ppos.x, ppos.y+0.85, ppos.z);
    }

    stepParticles3d(dt);
    renderer3d.render(scene3d,camera3d);
    r.hud([['SCORE',y(score)],['LEVEL',level],['LIVES',lives],['COMBO','x'+comboMult]]);
  }

  r.press = function(key){
    var dir = DIR_KEYS[key];
    if(dir) requestHop(dir[0], dir[1]);
  };
  r.pointer({down:function(pt){
    var pos = cubePos(player.r, player.c);
    requestHop(pt.y<pos.y ? -1 : 1, pt.x<pos.x ? (pt.y<pos.y?-1:0) : (pt.y<pos.y?0:1));
  }});
  r.pad([['↖','q'],['↗','e'],['↙','z'],['↘','c']]);

  r.fns.push(function(){
    scene3d.traverse(function(obj){extDisposeThree(obj)});
    renderer3d.dispose();
    if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
    if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
  });
  r.begin(function(){
    lives = 3; score = 0; level = 1; timeAcc = 0; comboMult = 1; comboTimer = 0; nextExtraLife = 3000;
    r.fx = [];
    newLevel();
    resetRound();
    r.frame(step);
  });
}
ext3DLoadGate(r.el,startGame3D)
}),
w('dirtDigger',b,'Dirt Digger',o.orange,'Tunnel through the dirt, inflate critters and drop rocks on their heads for chained bonuses.','Arrows / WASD to dig · tap Space to pump the critter in front of you',function(r){
function startGame3D(){
  var CELL=25, COLS=16, ROWS=15, W=400, H=375;
  var DIRS=[[0,-1],[-1,0],[0,1],[1,0]];
  var grid, player, enemies, rocks, lives, score, level, startFreeze, deathFreeze, timeAcc, comboMult, comboTimer, nextExtraLife;

  var wrapDiv=document.createElement('div');
  wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
  r.el.appendChild(wrapDiv);
  var canvasWrap=document.createElement('div');
  canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:400/375;margin:0 auto';
  wrapDiv.appendChild(canvasWrap);

  var renderer3d=extMakeWebGLRenderer();
  if(!renderer3d){r.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
  renderer3d.setSize(W,H);
  renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
  renderer3d.setClearColor(0x0a0a1a,1);
  canvasWrap.appendChild(renderer3d.domElement);
  r.cv=renderer3d.domElement;r.w=W;r.h=H;

  var SCALE3d=20/W;
  var ZH2=H*SCALE3d/2;
  function mapX3d(px2){return px2*SCALE3d-10}
  function mapZ3d(py){return ZH2-py*SCALE3d}

  var scene3d=new THREE.Scene();
  scene3d.fog=new THREE.Fog(0x0a0a1a,22,46);
  var camera3d=new THREE.PerspectiveCamera(48,W/H,0.1,200);
  camera3d.position.set(0,16,11);
  camera3d.lookAt(0,0,0);

  scene3d.add(new THREE.AmbientLight(0xcfe9ff,0.8));
  var sun3d=new THREE.DirectionalLight(0xffffff,0.7);
  sun3d.position.set(8,20,8);
  scene3d.add(sun3d);

  var gridTexCanvas=document.createElement('canvas');
  gridTexCanvas.width=W;gridTexCanvas.height=H;
  var gridTexCtx=gridTexCanvas.getContext('2d');
  var gridTexture=new THREE.CanvasTexture(gridTexCanvas);
  gridTexture.flipY=false;
  var floor3d=new THREE.Mesh(new THREE.PlaneGeometry(20,2*ZH2),new THREE.MeshStandardMaterial({map:gridTexture,roughness:0.9}));
  floor3d.rotation.x=-Math.PI/2;
  scene3d.add(floor3d);

  function disposeGroupChildren(grp){
    while(grp.children.length){
      var c2=grp.children.pop();
      grp.remove(c2);
      extDisposeThree(c2)
    }
  }
  var rockGroup3d=new THREE.Group();scene3d.add(rockGroup3d);
  var enemyGroup3d=new THREE.Group();scene3d.add(enemyGroup3d);
  var rockMat3d=new THREE.MeshStandardMaterial({color:0x9aa4b8,roughness:0.7});
  var rockHiMat3d=new THREE.MeshStandardMaterial({color:0xc9d1e0,roughness:0.5});
  var enemyInkMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.ink)});
  var enemyBgMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.bg)});
  var enemyYellowMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.yellow)});
  var enemyKindMats3d={fy:new THREE.MeshStandardMaterial({color:new THREE.Color(o.green),emissive:new THREE.Color(o.green),emissiveIntensity:0.35,roughness:0.5,transparent:true}),
    hd:new THREE.MeshStandardMaterial({color:new THREE.Color(o.violet),emissive:new THREE.Color(o.violet),emissiveIntensity:0.35,roughness:0.5,transparent:true}),
    po:new THREE.MeshStandardMaterial({color:new THREE.Color(o.coral),emissive:new THREE.Color(o.coral),emissiveIntensity:0.35,roughness:0.5,transparent:true})};
  var fireMat3d=new THREE.MeshBasicMaterial({color:0xff9636,transparent:true,opacity:0.85});

  var playerGroup3d=new THREE.Group();
  var playerBody3d=new THREE.Mesh(new THREE.SphereGeometry(0.5,10,10),enemyInkMat3d);
  playerGroup3d.add(playerBody3d);
  [-1,1].forEach(function(sgn){
    var eye=new THREE.Mesh(new THREE.SphereGeometry(0.12,6,6),enemyBgMat3d);
    eye.position.set(sgn*0.15,0.1,0.42);
    playerGroup3d.add(eye)
  });
  var playerHatMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.blue),emissive:new THREE.Color(o.blue),emissiveIntensity:0.3,roughness:0.5});
  var playerHat3d=new THREE.Mesh(new THREE.BoxGeometry(18*SCALE3d,3*SCALE3d,6*SCALE3d),playerHatMat3d);
  playerGroup3d.add(playerHat3d);
  scene3d.add(playerGroup3d);

  var pumpBeamMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.violet)});
  var pumpBeam3d=new THREE.Mesh(new THREE.BoxGeometry(1,0.15,0.15),pumpBeamMat3d);
  scene3d.add(pumpBeam3d);

  var particleMeshes3d=[];
  function spawnParticles3d(wx,wz,color,n){
    var col=new THREE.Color(color);
    for(var pi=0;pi<n;pi++){
      var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
      var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.11,6,6),mat);
      mesh.position.set(wx,0.3,wz);
      scene3d.add(mesh);
      var ang=Math.random()*Math.PI*2,sp=0.05+Math.random()*0.17;
      particleMeshes3d.push({mesh:mesh,vx:Math.cos(ang)*sp,vy:0.04+Math.random()*0.1,vz:Math.sin(ang)*sp,life:1})
    }
  }
  function stepParticles3d(dt){
    for(var i2=particleMeshes3d.length-1;i2>=0;i2--){
      var pt=particleMeshes3d[i2];
      pt.mesh.position.x+=pt.vx;pt.mesh.position.y+=pt.vy;pt.mesh.position.z+=pt.vz;
      pt.vy-=0.01;
      pt.life-=0.035;
      pt.mesh.material.opacity=Math.max(0,pt.life);
      if(pt.life<=0){scene3d.remove(pt.mesh);extDisposeThree(pt.mesh);particleMeshes3d.splice(i2,1)}
    }
  }

  function blocked(row,col){
    return row<0 || col<0 || row>=ROWS || col>=COLS || grid[row][col]>0 ||
      rocks.some(function(rk){ return rk.r===row && rk.c===col && !rk.fall; });
  }

  function buildLevel(){
    var row, col, i, tries, kind;
    var enemyCount = 2+Math.min(level,4);
    grid = []; rocks = []; enemies = [];
    for(row=0; row<ROWS; row++){ grid.push([]); for(col=0; col<COLS; col++) grid[row].push(row>0?1:0); }
    player = {r:0, c:8, d:[0,1], rx:200, ry:0, mt:0, pump:0, tgt:null};
    grid[1][8] = 0;
    for(i=0; i<enemyCount; i++){
      row = 4+f(10); col = 1+f(14);
      grid[row][col] = 0;
      grid[row][col+1>15?col-1:col+1] = 0;
      if(level>=3 && i%4===3) kind='hd'; else if(i%3===2) kind='fy'; else kind='po';
      enemies.push({r:row, c:col, kind:kind, mt:c(0.2,0.6), inf:0, maxInf: kind==='hd'?8:4, ghost:0, stuck:0, d:[1,0], fire:0, fcd:c(2,4), stun:0, idle:0, tel:0});
    }
    for(i=0; i<3; i++){
      for(tries=0; tries<20; tries++){
        row = 2+f(6); col = f(COLS);
        if(grid[row][col] && !rocks.some(function(rk){ return rk.r===row && rk.c===col; }) && !enemies.some(function(en){ return en.r===row && en.c===col; })){
          rocks.push({r:row, c:col, wob:0, fall:0, ft:0});
          break;
        }
      }
    }
    startFreeze = 1; deathFreeze = 0;
  }

  function checkExtraLife(){
    if(score >= nextExtraLife){ lives++; nextExtraLife += 5000; }
  }

  function addScore(amount){
    score += amount*comboMult;
    comboMult = Math.min(6, comboMult+1);
    comboTimer = 2.5;
    checkExtraLife();
  }

  function hitPlayer(){
    if(deathFreeze>0) return;
    lives--; deathFreeze = 1.3; comboMult = 1; comboTimer = 0;
    spawnParticles3d(mapX3d(player.c*CELL+12), mapZ3d(player.r*CELL+12), o.orange, 26);
  }

  function step(dt){
    var moveX, moveY, targetRow, targetCol, ri, rk, en, dirOptions, chosen, dist1, dist2, ei;
    timeAcc += dt;
    comboTimer -= dt;
    if(comboTimer<=0) comboMult = 1;

    if(deathFreeze>0){
      deathFreeze -= dt;
      if(deathFreeze<=0){
        if(lives<=0){ render3d(dt); r.over(score, 'Level '+level+' · Score: '+score); return; }
        player = {r:0, c:8, d:[0,1], rx:200, ry:0, mt:0, pump:0, tgt:null};
        grid[1][8] = 0;
        enemies.forEach(function(en){
          if(Math.abs(en.r-1)+Math.abs(en.c-8)<4){ en.r = Math.min(14, en.r+4); grid[en.r][en.c] = 0; }
        });
        startFreeze = 1;
      }
      render3d(dt);
      return;
    }

    if(startFreeze>0){ startFreeze -= dt; render3d(dt); return; }

    player.mt -= dt; player.pump -= dt;
    moveX = r.ax(); moveY = r.ay();
    if(player.mt<=0 && player.pump<=0 && (moveX||moveY)){
      if(moveX) moveY = 0;
      targetRow = player.r+moveY; targetCol = player.c+moveX;
      player.d = [moveX, moveY];
      if(targetRow>=0 && targetCol>=0 && targetRow<ROWS && targetCol<COLS && !rocks.some(function(rk){ return rk.r===targetRow && rk.c===targetCol && !rk.fall; })){
        if(grid[targetRow][targetCol]){ grid[targetRow][targetCol]=0; player.mt=0.12; } else player.mt=0.085;
        player.r = targetRow; player.c = targetCol;
      }
    }
    player.rx += (player.c*CELL - player.rx)*Math.min(1, 22*dt);
    player.ry += (player.r*CELL - player.ry)*Math.min(1, 22*dt);

    for(ri=0; ri<rocks.length; ri++){
      rk = rocks[ri];
      if(rk.fall){
        rk.ft -= dt;
        if(rk.ft<=0){
          rk.ft = 0.085;
          if(!blocked(rk.r+1, rk.c) || (rk.r+1<ROWS && grid[rk.r+1][rk.c]===0 && !rocks.some(function(o2){ return o2!==rk && o2.r===rk.r+1 && o2.c===rk.c; }))) rk.r++;
          else rk.done = 1;
        }
      } else {
        if(rk.r+1<ROWS && grid[rk.r+1][rk.c]===0 && !rocks.some(function(o2){ return o2!==rk && o2.r===rk.r+1 && o2.c===rk.c; })){
          rk.wob += dt;
          if(rk.wob>0.6){ rk.fall=1; rk.ft=0.02; }
        } else rk.wob = 0;
      }
      if(rk.fall){
        if(player.r===rk.r && player.c===rk.c) hitPlayer();
        enemies = enemies.filter(function(en){
          if(en.r===rk.r && en.c===rk.c){
            addScore(1000+200*(level-1));
            spawnParticles3d(mapX3d(en.c*CELL+12), mapZ3d(en.r*CELL+12), o.yellow, 20);
            return false;
          }
          return true;
        });
      }
    }
    rocks = rocks.filter(function(rk){
      if(rk.done){ spawnParticles3d(mapX3d(rk.c*CELL+12), mapZ3d(rk.r*CELL+12), o.dim, 8); return false; }
      return true;
    });

    for(ei=0; ei<enemies.length; ei++){
      en = enemies[ei];
      en.idle += dt;
      if(en.inf>0 && en.idle>0.9) en.inf = Math.max(0, en.inf-0.9*dt);
      en.stun -= dt;
      if(en.fire>0){
        en.fire -= dt;
        if(player.r===en.r && Math.sign(player.c-en.c)===en.d[0] && Math.abs(player.c-en.c)<=3) hitPlayer();
        continue;
      }
      if(en.tel>0){
        en.tel -= dt;
        if(en.tel<=0) en.fire = 0.6;
        continue;
      }
      if(en.stun>0 || en.inf>0) continue;
      en.mt -= dt;
      if(en.kind==='fy'){
        en.fcd -= dt;
        if(en.fcd<=0 && en.r===player.r && Math.abs(player.c-en.c)<=3 && !blocked(en.r, en.c+Math.sign(player.c-en.c))){
          en.d = [Math.sign(player.c-en.c), 0]; en.tel = 0.5; en.fcd = c(3,5);
          continue;
        }
      }
      if(en.mt<=0){
        en.mt = Math.max(0.16, 0.34-0.02*level) * (en.ghost>0?1.4:1) * (en.kind==='hd'?1.3:1);
        dirOptions = DIRS.filter(function(dd){
          return en.ghost>0
            ? (en.r+dd[1]>=0 && en.r+dd[1]<ROWS && en.c+dd[0]>=0 && en.c+dd[0]<COLS && !rocks.some(function(rk){ return rk.r===en.r+dd[1] && rk.c===en.c+dd[0]; }))
            : !blocked(en.r+dd[1], en.c+dd[0]);
        });
        if(!dirOptions.length){ en.ghost = 2.5; continue; }
        dirOptions.sort(function(dA,dB){
          return Math.abs(en.r+dA[1]-player.r)+Math.abs(en.c+dA[0]-player.c) - (Math.abs(en.r+dB[1]-player.r)+Math.abs(en.c+dB[0]-player.c));
        });
        chosen = Math.random()<0.25 ? u(dirOptions) : dirOptions[0];
        dist1 = Math.abs(en.r+chosen[1]-player.r)+Math.abs(en.c+chosen[0]-player.c);
        dist2 = Math.abs(en.r-player.r)+Math.abs(en.c-player.c);
        if(en.ghost<=0 && dist1>=dist2){
          en.stuck += 0.5;
          if(en.stuck>2.5){ en.ghost=3; en.stuck=0; }
        } else if(en.ghost<=0){ en.stuck = Math.max(0, en.stuck-0.5); }
        en.r += chosen[1]; en.c += chosen[0]; en.d = chosen;
        if(en.ghost>0){
          en.ghost -= 0.3;
          if(en.ghost<=0.05 && grid[en.r][en.c]===0) en.ghost = 0;
          if(en.ghost>0 && grid[en.r][en.c]===0 && en.ghost<1.6) en.ghost = 0;
        }
      }
      if(en.r===player.r && en.c===player.c) hitPlayer();
    }

    if(!enemies.length){ level++; addScore(500); buildLevel(); }

    render3d(dt);
  }

  function render3d(dt){
    var row, col, wobbleShift, px, py;
    gridTexCtx.fillStyle = '#1b2a55'; gridTexCtx.fillRect(0,0,W,H);
    gridTexCtx.fillRect(0,0,W,CELL);
    for(row=1; row<ROWS; row++){
      for(col=0; col<COLS; col++){
        gridTexCtx.fillStyle = grid[row][col] ? ['#8a5a2b','#7a4d24','#6a4020','#5a351b'][Math.floor(row/4)%4] : '#0d0820';
        gridTexCtx.fillRect(col*CELL, row*CELL, CELL, CELL);
      }
    }
    gridTexture.needsUpdate = true;

    disposeGroupChildren(rockGroup3d);
    rocks.forEach(function(rk){
      wobbleShift = rk.c*CELL + (rk.wob>0 && !rk.fall ? 1.5*Math.sin(50*timeAcc) : 0);
      var body=new THREE.Mesh(new THREE.BoxGeometry(21*SCALE3d,0.5,21*SCALE3d),rockMat3d);
      body.position.set(mapX3d(wobbleShift+12.5), 0.3, mapZ3d(rk.r*CELL+12.5));
      rockGroup3d.add(body);
      var hi=new THREE.Mesh(new THREE.BoxGeometry(8*SCALE3d,0.2,4*SCALE3d),rockHiMat3d);
      hi.position.set(mapX3d(wobbleShift+10), 0.56, mapZ3d(rk.r*CELL+7));
      rockGroup3d.add(hi);
    });

    disposeGroupChildren(enemyGroup3d);
    enemies.forEach(function(en){
      var scale = 1+0.35*en.inf, cx = en.c*CELL+12.5, cy = en.r*CELL+12.5;
      var mat = enemyKindMats3d[en.kind];
      mat.opacity = en.ghost>0 ? 0.55 : 1;
      var body=new THREE.Mesh(new THREE.SphereGeometry(0.36*scale,10,10),mat);
      body.position.set(mapX3d(cx), 0.36*scale, mapZ3d(cy));
      enemyGroup3d.add(body);
      [-1,1].forEach(function(sgn){
        var eye=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,6),enemyInkMat3d);
        eye.position.set(mapX3d(cx+sgn*3*scale), 0.36*scale+0.08, mapZ3d(cy-2));
        enemyGroup3d.add(eye);
        var pupil=new THREE.Mesh(new THREE.SphereGeometry(0.05,6,6),enemyBgMat3d);
        pupil.position.set(mapX3d(cx+sgn*3*scale+en.d[0]), 0.36*scale+0.08, mapZ3d(cy-2+en.d[1]));
        enemyGroup3d.add(pupil);
      });
      if(en.tel>0 && Math.floor(12*en.tel)%2){
        var tel=new THREE.Mesh(new THREE.SphereGeometry(0.16,6,6),enemyYellowMat3d);
        tel.position.set(mapX3d(cx+10*en.d[0]), 0.4, mapZ3d(cy));
        enemyGroup3d.add(tel);
      }
      if(en.fire>0){
        var fx0=en.d[0]>0?cx+8:cx-8-75, fcx=fx0+37.5, fcy=cy-6+6;
        var fire=new THREE.Mesh(new THREE.BoxGeometry(75*SCALE3d,0.3,12*SCALE3d),fireMat3d);
        fire.position.set(mapX3d(fcx), 0.3, mapZ3d(fcy));
        enemyGroup3d.add(fire);
      }
    });

    var blink = deathFreeze<=0 || Math.floor(8*deathFreeze)%2;
    playerGroup3d.visible = !!blink;
    pumpBeam3d.visible = !!(blink && player.pump>0);
    if(blink){
      px = player.rx+12.5; py = player.ry+12.5;
      playerGroup3d.position.set(mapX3d(px), 0.5, mapZ3d(py));
      playerHat3d.position.set(0, 0.07, 0);
      if(player.pump>0){
        var ex=px+50*player.d[0], ey=py+50*player.d[1];
        var wx0=mapX3d(px), wz0=mapZ3d(py), wx1=mapX3d(ex), wz1=mapZ3d(ey);
        var mx=(wx0+wx1)/2, mz=(wz0+wz1)/2;
        var len=Math.hypot(wx1-wx0,wz1-wz0);
        var ang=Math.atan2(wz1-wz0,wx1-wx0);
        pumpBeam3d.position.set(mx,0.4,mz);
        pumpBeam3d.scale.set(len,1,1);
        pumpBeam3d.rotation.y=-ang;
      }
    }

    stepParticles3d(dt);
    renderer3d.render(scene3d,camera3d);
    r.hud([['SCORE',y(score)],['LEVEL',level],['LIVES',lives],['COMBO','x'+comboMult]]);
  }

  function tryPump(){
    if(player.pump>0 || deathFreeze>0 || startFreeze>0) return;
    var t, row, col, target;
    for(t=1; t<=3; t++){
      row = player.r+player.d[1]*t; col = player.c+player.d[0]*t;
      if(blocked(row,col)) break;
      target = enemies.filter(function(en){ return en.r===row && en.c===col && !en.ghost; })[0];
      if(target){
        target.inf++; target.stun = 1.4; target.idle = 0;
        player.pump = 0.22; player.tgt = target;
        spawnParticles3d(mapX3d(target.c*CELL+12), mapZ3d(target.r*CELL+12), o.ink, 4);
        if(target.inf>=target.maxInf){
          addScore((200+100*Math.floor(target.r/4)) * (target.maxInf/4));
          spawnParticles3d(mapX3d(target.c*CELL+12), mapZ3d(target.r*CELL+12), target.kind==='fy'?o.green:o.coral, 22);
          enemies.splice(enemies.indexOf(target),1);
        }
        return;
      }
    }
    player.pump = 0.15;
  }

  r.press = function(key){ if(key===' ') tryPump(); };
  r.pad([['▲','ArrowUp'],['◀','ArrowLeft'],['PUMP','Space'],['▶','ArrowRight'],['▼','ArrowDown']]);
  r.fns.push(function(){
    scene3d.traverse(function(obj){extDisposeThree(obj)});
    renderer3d.dispose();
    if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
    if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
  });

  r.begin(function(){
    lives = 3; score = 0; level = 1; timeAcc = 0; comboMult = 1; comboTimer = 0; nextExtraLife = 6000;
    r.fx = [];
    buildLevel();
    r.frame(step);
  });
}
ext3DLoadGate(r.el,startGame3D)
})