f(en.inf>0 && en.idle>0.9) en.inf = Math.max(0, en.inf-0.9*dt);
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

    draw(dt);
  }

  function draw(dt){
    var row, col, wobbleShift, px, py;
    g(ctx, 400, 375, '#1b2a55');
    ctx.fillStyle = '#1b2a55'; ctx.fillRect(0,0,400,CELL);
    for(row=1; row<ROWS; row++){
      for(col=0; col<COLS; col++){
        ctx.fillStyle = grid[row][col] ? ['#8a5a2b','#7a4d24','#6a4020','#5a351b'][Math.floor(row/4)%4] : '#0d0820';
        ctx.fillRect(col*CELL, row*CELL, CELL, CELL);
      }
    }
    rocks.forEach(function(rk){
      wobbleShift = rk.c*CELL + (rk.wob>0 && !rk.fall ? 1.5*Math.sin(50*timeAcc) : 0);
      p(ctx, wobbleShift+2, rk.r*CELL+2, 21, 21, 8, '#9aa4b8');
      p(ctx, wobbleShift+6, rk.r*CELL+5, 8, 4, 2, '#c9d1e0');
    });
    enemies.forEach(function(en){
      var scale = 1+0.35*en.inf, cx = en.c*CELL+12.5, cy = en.r*CELL+12.5;
      var color = en.kind==='fy' ? o.green : en.kind==='hd' ? o.violet : o.coral;
      ctx.globalAlpha = en.ghost>0 ? 0.55 : 1;
      d(ctx, cx, cy, 9*scale, color);
      d(ctx, cx-3*scale, cy-2, 2.6, o.ink);
      d(ctx, cx+3*scale, cy-2, 2.6, o.ink);
      d(ctx, cx-3*scale+en.d[0], cy-2+en.d[1], 1.2, o.bg);
      d(ctx, cx+3*scale+en.d[0], cy-2+en.d[1], 1.2, o.bg);
      ctx.globalAlpha = 1;
      if(en.tel>0 && Math.floor(12*en.tel)%2) d(ctx, cx+10*en.d[0], cy, 4, o.yellow);
      if(en.fire>0){ ctx.fillStyle = 'rgba(255,150,60,.85)'; ctx.fillRect(en.d[0]>0?cx+8:cx-8-75, cy-6, 75, 12); }
    });
    if(deathFreeze<=0 || Math.floor(8*deathFreeze)%2){
      px = player.rx+12.5; py = player.ry+12.5;
      d(ctx, px, py, 10, o.ink);
      d(ctx, px-3, py-2, 2.4, o.bg);
      d(ctx, px+3, py-2, 2.4, o.bg);
      p(ctx, px-9, py-12, 18, 6, 3, o.blue);
      if(player.pump>0) v(ctx, px, py, px+50*player.d[0], py+50*player.d[1], o.violet, 3);
    }
    r.fxStep(dt);
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
        r.burst(target.c*CELL+12, target.r*CELL+12, o.ink, 4);
        if(target.inf>=target.maxInf){
          addScore((200+100*Math.floor(target.r/4)) * (target.maxInf/4));
          r.burst(target.c*CELL+12, target.r*CELL+12, target.kind==='fy'?o.green:o.coral, 22);
          enemies.splice(enemies.indexOf(target),1);
        }
        return;
      }
    }
    player.pump = 0.15;
  }

  r.press = function(key){ if(key===' ') tryPump(); };
  r.pad([['▲','ArrowUp'],['◀','ArrowLeft'],['PUMP','Space'],['▶','ArrowRight'],['▼','ArrowDown']]);

  r.begin(function(){
    lives = 3; score = 0; level = 1; timeAcc = 0; comboMult = 1; comboTimer = 0; nextExtraLife = 6000;
    r.fx = [];
    buildLevel();
    r.frame(step);
  });
}),w('craterCruiser',b,'Crater Cruiser',o.yellow,'Jump craters, shoot rocks and saucers, and grab boosts for a chained high score.','Space / Up to jump · X / Z to fire forward and up',function(r){
function startGame3D(){
  var W=400,HEIGHT=300,GROUND=232;
  var roverY, roverVy, obstacles, bullets, saucers, bombs, pickups, dist, parallax, lives, killScore, deathFreeze, obstacleCd, fireCd, saucerCd, pickupCd, comboMult, comboTimer, rapidTimer, shield, nextExtraLife;

  var wrapDiv=document.createElement('div');
  wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
  r.el.appendChild(wrapDiv);
  var canvasWrap=document.createElement('div');
  canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:400/300;margin:0 auto';
  wrapDiv.appendChild(canvasWrap);

  var renderer3d=extMakeWebGLRenderer();
  if(!renderer3d){r.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
  renderer3d.setSize(W,HEIGHT);
  renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
  renderer3d.setClearColor(0x140c33,1);
  canvasWrap.appendChild(renderer3d.domElement);
  r.cv=renderer3d.domElement;r.w=W;r.h=HEIGHT;

  var WH2=10*(HEIGHT/W);
  function mapX3d(px2){return px2/W*20-10}
  function mapY3d(py){return WH2-py/HEIGHT*(2*WH2)}

  var scene3d=new THREE.Scene();
  scene3d.fog=new THREE.Fog(0x140c33,16,34);
  var camera3d=new THREE.PerspectiveCamera(50,W/HEIGHT,0.1,200);
  camera3d.position.set(0,1.2,13.5);
  camera3d.lookAt(0,0.4,0);

  scene3d.add(new THREE.AmbientLight(0xcfe3ff,0.85));
  var sun3d=new THREE.DirectionalLight(0xffffff,0.75);
  sun3d.position.set(6,10,10);
  scene3d.add(sun3d);

  function disposeGroupChildren(grp){
    while(grp.children.length){
      var c2=grp.children.pop();
      grp.remove(c2);
      extDisposeThree(c2)
    }
  }

  var groundMat3d=new THREE.MeshStandardMaterial({color:0x3a2a7a,roughness:0.85});
  var groundMesh3d=new THREE.Mesh(new THREE.BoxGeometry(40,3.2,4),groundMat3d);
  groundMesh3d.position.set(0,mapY3d(276)-1.6,-1.5);
  scene3d.add(groundMesh3d);

  var mountainGroup3d=new THREE.Group();scene3d.add(mountainGroup3d);
  var mountainMat3d=new THREE.MeshStandardMaterial({color:0x20194a,roughness:0.9});
  var MOUNTAIN_N=7;
  for(var mi=-1;mi<MOUNTAIN_N;mi++){
    var mesh=new THREE.Mesh(new THREE.ConeGeometry(2.6,2.4,4),mountainMat3d);
    mesh.rotation.y=Math.PI/4;
    mesh.position.set(mi*4.6,mapY3d(200)+0.4,-6);
    mountainGroup3d.add(mesh);
  }

  var craterGroup3d=new THREE.Group();scene3d.add(craterGroup3d);
  var rockMat3d=new THREE.MeshStandardMaterial({color:0x9aa4b8,roughness:0.6});
  var craterMat3d=new THREE.MeshStandardMaterial({color:0x0d0820,roughness:0.9});
  var bulletMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.yellow)});
  var bulletGroup3d=new THREE.Group();scene3d.add(bulletGroup3d);
  var saucerGroup3d=new THREE.Group();scene3d.add(saucerGroup3d);
  var bombMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.coral),emissive:new THREE.Color(o.coral),emissiveIntensity:0.4,roughness:0.5});
  var bombGroup3d=new THREE.Group();scene3d.add(bombGroup3d);
  var pickupGroup3d=new THREE.Group();scene3d.add(pickupGroup3d);

  var roverGroup3d=new THREE.Group();
  var roverMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.yellow),emissive:new THREE.Color(o.yellow),emissiveIntensity:0.3,roughness:0.5});
  var roverShieldMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.blue),emissive:new THREE.Color(o.blue),emissiveIntensity:0.3,roughness:0.5});
  var roverBody3d=new THREE.Mesh(new THREE.BoxGeometry(1.7,0.5,1.0),roverMat3d);
  roverGroup3d.add(roverBody3d);
  var roverCab3d=new THREE.Mesh(new THREE.BoxGeometry(0.7,0.4,0.8),new THREE.MeshStandardMaterial({color:0x10101a}));
  roverCab3d.position.set(0.3,0.4,0);
  roverGroup3d.add(roverCab3d);
  var wheelMat3d=new THREE.MeshStandardMaterial({color:0x10101a,roughness:0.7});
  var wheelL3d=new THREE.Mesh(new THREE.SphereGeometry(0.3,10,10),wheelMat3d);wheelL3d.position.set(-0.43,-0.33,0);roverGroup3d.add(wheelL3d);
  var wheelR3d=new THREE.Mesh(new THREE.SphereGeometry(0.3,10,10),wheelMat3d);wheelR3d.position.set(0.54,-0.33,0);roverGroup3d.add(wheelR3d);
  scene3d.add(roverGroup3d);

  var particleMeshes3d=[];
  function spawnParticles3d(wx,wy,color,n){
    var col=new THREE.Color(color);
    for(var pi=0;pi<n;pi++){
      var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
      var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,6),mat);
      mesh.position.set(wx,wy,0.4);
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

  function jump(){ if(roverY>=231.5) roverVy = -340; }

  function fire(){
    if(fireCd>0) return;
    bullets.push({x:120, y:roverY-12, vx:440, vy:0}, {x:96, y:roverY-20, vx:20, vy:-360});
    fireCd = rapidTimer>0 ? 0.14 : 0.28;
  }

  function hitRover(obstacle){
    if(deathFreeze>0) return;
    if(shield>0){ shield=0; deathFreeze=0.6; spawnParticles3d(mapX3d(96), mapY3d(roverY-8), o.blue, 20); if(obstacle) obstacle.dead=1; return; }
    lives--; deathFreeze = 1.6; comboMult = 1; comboTimer = 0;
    spawnParticles3d(mapX3d(96), mapY3d(roverY-8), o.yellow, 24);
    if(obstacle) obstacle.dead = 1;
  }

  function addKillScore(amount){
    killScore += amount*comboMult;
    comboMult = Math.min(6, comboMult+1);
    comboTimer = 2.2;
    if((Math.floor(dist/10)+killScore) >= nextExtraLife){ lives++; nextExtraLife += 6000; }
  }

  function step(dt){
    var speed = 130+0.015*dist, i, j, bullet, obs, saucer, bomb, pick;
    dist += speed*dt; parallax += speed*dt;
    obstacleCd -= dt; fireCd -= dt; saucerCd -= dt; pickupCd -= dt; deathFreeze -= dt; comboTimer -= dt; if(rapidTimer>0) rapidTimer -= dt;
    if(comboTimer<=0) comboMult = 1;

    roverVy += 900*dt; roverY += roverVy*dt;
    if(roverY>=GROUND){ roverY = GROUND; roverVy = 0; }

    if(obstacleCd<=0){
      if(Math.random()<0.55) obstacles.push({t:'c', x:420, w:c(40,66)});
      else obstacles.push({t:'r', x:420, w:18});
      obstacleCd = c(230,400);
    }
    if(saucerCd<=0){
      saucers.push({x:420, y:c(40,100), b:c(0.6,1.6), hp: (dist>2000 && Math.random()<0.3) ? 2 : 1});
      saucerCd = c(5,9) - Math.min(3, dist/4000);
    }
    if(pickupCd<=0){
      pickups.push({x:420, y:c(150,200), kind: (!shield && Math.random()<0.4) ? 'shield' : 'boost'});
      pickupCd = c(6,10);
    }

    obstacles.forEach(function(o2){ o2.x -= speed*dt; });
    saucers.forEach(function(s2){
      s2.x -= (0.5*speed+40)*dt; s2.b -= dt;
      if(s2.b<=0 && s2.x<380 && s2.x>20){ bombs.push({x:s2.x, y:s2.y+8, vy:60}); s2.b = c(1.2,2.4); }
    });
    bombs.forEach(function(bm){
      bm.x -= speed*dt; bm.vy += 300*dt; bm.y += bm.vy*dt;
      if(bm.y>=GROUND){ bm.dead=1; obstacles.push({t:'c', x:bm.x-15, w:32}); spawnParticles3d(mapX3d(bm.x), mapY3d(GROUND), o.coral, 8); }
    });
    bullets.forEach(function(bl){ bl.x += bl.vx*dt - speed*dt*(bl.vx<100?1:0); bl.y += bl.vy*dt; if(bl.x>410 || bl.y<-10) bl.dead=1; });
    pickups.forEach(function(pk){ pk.x -= speed*dt; });

    for(i=0;i<bullets.length;i++){
      bullet = bullets[i];
      if(bullet.dead) continue;
      for(j=0;j<obstacles.length;j++){
        obs = obstacles[j];
        if(!bullet.dead && obs.t==='r' && !obs.dead && Math.abs(bullet.x-obs.x-9)<12 && bullet.y>208){ obs.dead=1; bullet.dead=1; addKillScore(50); spawnParticles3d(mapX3d(obs.x+9),mapY3d(224),o.orange,10); }
      }
      for(j=0;j<saucers.length;j++){
        saucer = saucers[j];
        if(!bullet.dead && !saucer.dead && Math.abs(bullet.x-saucer.x)<18 && Math.abs(bullet.y-saucer.y)<12){
          bullet.dead = 1; saucer.hp--;
          spawnParticles3d(mapX3d(saucer.x),mapY3d(saucer.y),o.violet,saucer.hp<=0?16:6);
          if(saucer.hp<=0){ saucer.dead=1; addKillScore(100); }
        }
      }
    }

    obstacles.forEach(function(o2){
      if(o2.dead) return;
      if(o2.t==='c' && roverY>=231 && 96>o2.x+6 && 96<o2.x+o2.w-6) hitRover(o2);
      if(o2.t==='r' && roverY>216 && 110>o2.x && 82<o2.x+18) hitRover(o2);
    });
    bombs.forEach(function(bm){ if(!bm.dead && Math.abs(bm.x-96)<16 && Math.abs(bm.y-(roverY-10))<14){ bm.dead=1; hitRover(null); } });
    for(i=pickups.length-1;i>=0;i--){
      pick = pickups[i];
      if(Math.abs(pick.x-96)<18 && Math.abs(pick.y-roverY)<50){
        if(pick.kind==='shield'){ shield=1; spawnParticles3d(mapX3d(pick.x),mapY3d(pick.y),o.blue,14); }
        else { rapidTimer=4; addKillScore(20); spawnParticles3d(mapX3d(pick.x),mapY3d(pick.y),o.teal,14); }
        pickups.splice(i,1);
      }
    }

    obstacles = obstacles.filter(function(o2){ return !o2.dead && o2.x+o2.w>-30; });
    saucers = saucers.filter(function(s2){ return !s2.dead && s2.x>-30; });
    bombs = bombs.filter(function(bm){ return !bm.dead; });
    bullets = bullets.filter(function(bl){ return !bl.dead; });
    pickups = pickups.filter(function(pk){ return pk.x>-20; });

    if(lives<=0){ render3d(dt); r.over(Math.floor(dist/10)+killScore, 'Distance '+Math.floor(dist/10)+' m · Score: '+(Math.floor(dist/10)+killScore)); return; }
    render3d(dt);
  }

  function render3d(dt){
    mountainGroup3d.children.forEach(function(mesh,idx){
      var baseX=(idx-1)*4.6;
      var shiftedX=baseX - (0.15*parallax*20/W)%(4.6*MOUNTAIN_N);
      while(shiftedX < -4.6*1.5) shiftedX += 4.6*MOUNTAIN_N;
      mesh.position.x = shiftedX;
    });

    disposeGroupChildren(craterGroup3d);
    obstacles.forEach(function(o2){
      if(o2.t==='c'){
        var mesh=new THREE.Mesh(new THREE.BoxGeometry(o2.w/20,0.3,1.6),craterMat3d);
        mesh.position.set(mapX3d(o2.x+o2.w/2), mapY3d(255), 0.3);
        craterGroup3d.add(mesh);
      } else {
        var rmesh=new THREE.Mesh(new THREE.DodecahedronGeometry(0.42),rockMat3d);
        rmesh.position.set(mapX3d(o2.x+9), mapY3d(226), 0.3);
        craterGroup3d.add(rmesh);
      }
    });

    disposeGroupChildren(bulletGroup3d);
    bullets.forEach(function(bl){
      var mesh=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.12,0.12),bulletMat3d);
      mesh.position.set(mapX3d(bl.x), mapY3d(bl.y), 0.3);
      bulletGroup3d.add(mesh);
    });

    disposeGroupChildren(saucerGroup3d);
    saucers.forEach(function(s2){
      var mat=new THREE.MeshStandardMaterial({color: s2.hp>1?new THREE.Color(o.magenta):new THREE.Color(o.violet), emissive: s2.hp>1?new THREE.Color(o.magenta):new THREE.Color(o.violet), emissiveIntensity:0.3, roughness:0.5});
      var body=new THREE.Mesh(new THREE.SphereGeometry(0.55,12,8),mat);
      body.scale.set(1,0.45,1);
      body.position.set(mapX3d(s2.x), mapY3d(s2.y), 0.2);
      saucerGroup3d.add(body);
      var dome=new THREE.Mesh(new THREE.SphereGeometry(0.28,10,8),new THREE.MeshStandardMaterial({color:0x10101a,roughness:0.4}));
      dome.position.set(mapX3d(s2.x), mapY3d(s2.y)+0.22, 0.2);
      saucerGroup3d.add(dome);
    });

    disposeGroupChildren(bombGroup3d);
    bombs.forEach(function(bm){
      var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.2,8,8),bombMat3d);
      mesh.position.set(mapX3d(bm.x), mapY3d(bm.y), 0.3);
      bombGroup3d.add(mesh);
    });

    disposeGroupChildren(pickupGroup3d);
    pickups.forEach(function(pk){
      var col = pk.kind==='shield' ? o.blue : o.teal;
      var mat=new THREE.MeshStandardMaterial({color:new THREE.Color(col),emissive:new THREE.Color(col),emissiveIntensity:0.4,roughness:0.4});
      var mesh=new THREE.Mesh(new THREE.OctahedronGeometry(0.38),mat);
      mesh.position.set(mapX3d(pk.x), mapY3d(pk.y), 0.3);
      pickupGroup3d.add(mesh);
    });

    var blink = deathFreeze<=0 || Math.floor(10*deathFreeze)%2;
    roverGroup3d.visible = !!blink;
    if(blink){
      roverGroup3d.position.set(mapX3d(96), mapY3d(roverY-8), 0.5);
      roverBody3d.material = shield>0 ? roverShieldMat3d : roverMat3d;
    }

    stepParticles3d(dt);
    renderer3d.render(scene3d,camera3d);
    r.hud([['SCORE', y(Math.floor(dist/10)+killScore)], ['DIST', Math.floor(dist/10)+'m'], ['LIVES', lives], ['COMBO','x'+comboMult]]);
  }

  r.press = function(key){
    if(key===' ' || key==='ArrowUp' || key==='w') jump();
    if(key==='x' || key==='z' || key==='Enter') fire();
  };
  r.pointer({down:function(pt){ if(pt.x>200) fire(); else jump(); }});
  r.pad([['JUMP','ArrowUp'],['FIRE','x']]);

  r.fns.push(function(){
    scene3d.traverse(function(obj){extDisposeThree(obj)});
    renderer3d.dispose();
    if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
    if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
  });
  r.begin(function(){
    roverY = GROUND; roverVy = 0; obstacles = []; bullets = []; saucers = []; bombs = []; pickups = [];
    dist = 0; parallax = 0; lives = 3; killScore = 0; deathFreeze = 0;
    obstacleCd = 320; fireCd = 0; saucerCd = 6; pickupCd = 5;
    comboMult = 1; comboTimer = 0; rapidTimer = 0; shield = 0; nextExtraLife = 5000;
    r.fx = [];
    r.frame(step);
  });
}
ext3DLoadGate(r.el,startGame3D)
}),w('botSwarm',b,'Bot Swarm',o.coral,'Move with one hand, blast with the other, dodge turret fire and rescue stranded humans.','WASD / arrows move · I J K L (or click and hold) to shoot',function(r){
function startGame3D(){
var W=400, HH=400;
var player, bullets, chasers, orbiters, spinners, humans, turrets, enemyBullets;
var score, lives, wave, hitInvuln, aimTarget, timeAcc, fireCd, comboMult, comboTimer, nextExtraLife;

var wrapDiv=document.createElement('div');
wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
r.el.appendChild(wrapDiv);
var canvasWrap=document.createElement('div');
canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:1/1;margin:0 auto';
wrapDiv.appendChild(canvasWrap);

var renderer3d=extMakeWebGLRenderer();
if(!renderer3d){r.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
renderer3d.setSize(400,400);
renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
renderer3d.setClearColor(0x05030c,1);
canvasWrap.appendChild(renderer3d.domElement);
r.cv=renderer3d.domElement;r.w=W;r.h=HH;

function mapX3d(px2){return px2/W*20-10}
function mapZ3d(py){return py/HH*20-10}

var scene3d=new THREE.Scene();
scene3d.fog=new THREE.Fog(0x05030c,22,46);
var camera3d=new THREE.PerspectiveCamera(48,1,0.1,200);
camera3d.position.set(0,17,12.5);
camera3d.lookAt(0,0,0);

scene3d.add(new THREE.AmbientLight(0xcfe9ff,0.75));
var sun3d=new THREE.DirectionalLight(0xffffff,0.75);
sun3d.position.set(8,20,8);
scene3d.add(sun3d);

var floor3d=new THREE.Mesh(new THREE.PlaneGeometry(21,21),new THREE.MeshStandardMaterial({color:0x0e0a1f,roughness:0.95}));
floor3d.rotation.x=-Math.PI/2;
scene3d.add(floor3d);
var borderMat3d=new THREE.LineBasicMaterial({color:new THREE.Color(o.violet)});
var borderPts3d=[[-10,-10],[10,-10],[10,10],[-10,10],[-10,-10]].map(function(p2){return new THREE.Vector3(p2[0],0.02,p2[1])});
scene3d.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(borderPts3d),borderMat3d));

function disposeGroupChildren(grp){
  while(grp.children.length){
    var c=grp.children.pop();
    grp.remove(c);
    extDisposeThree(c)
  }
}
var chaserGroup3d=new THREE.Group();scene3d.add(chaserGroup3d);
var spinnerGroup3d=new THREE.Group();scene3d.add(spinnerGroup3d);
var turretGroup3d=new THREE.Group();scene3d.add(turretGroup3d);
var humanGroup3d=new THREE.Group();scene3d.add(humanGroup3d);
var orbiterGroup3d=new THREE.Group();scene3d.add(orbiterGroup3d);
var bulletGroup3d=new THREE.Group();scene3d.add(bulletGroup3d);
var enemyBulletGroup3d=new THREE.Group();scene3d.add(enemyBulletGroup3d);

var chaserMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.coral),emissive:new THREE.Color(o.coral),emissiveIntensity:0.3,roughness:0.5});
var spinnerMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.yellow)});
var turretMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.magenta),emissive:new THREE.Color(o.magenta),emissiveIntensity:0.3,roughness:0.5});
var humanMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.green),emissive:new THREE.Color(o.green),emissiveIntensity:0.3,roughness:0.5});
var orbiterMat3d=new THREE.MeshStandardMaterial({color:0x9aa4b8,roughness:0.6});
var bulletMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.ink)});
var enemyBulletMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.magenta)});

var playerGroup3d=new THREE.Group();
var playerMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.blue),emissive:new THREE.Color(o.blue),emissiveIntensity:0.4,roughness:0.5});
var pHead3d=new THREE.Mesh(new THREE.SphereGeometry(0.22,10,8),playerMat3d);
pHead3d.position.y=0.55;
playerGroup3d.add(pHead3d);
var pBody3d=new THREE.Mesh(new THREE.BoxGeometry(0.4,0.5,0.3),playerMat3d);
pBody3d.position.y=0.25;
playerGroup3d.add(pBody3d);
scene3d.add(playerGroup3d);

var particleMeshes3d=[];
function spawnParticles3d(wx,wz,color,n){
  var col=new THREE.Color(color);
  for(var pi=0;pi<n;pi++){
    var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
    var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.09,6,6),mat);
    mesh.position.set(wx,0.3,wz);
    scene3d.add(mesh);
    var ang=Math.random()*Math.PI*2,sp=0.04+Math.random()*0.15;
    particleMeshes3d.push({mesh:mesh,vx:Math.cos(ang)*sp,vz:Math.sin(ang)*sp,vy:0.05+Math.random()*0.09,life:1})
  }
}
function stepParticles3d(dt){
  for(var i2=particleMeshes3d.length-1;i2>=0;i2--){
    var pt=particleMeshes3d[i2];
    pt.vy-=0.011;
    pt.mesh.position.x+=pt.vx;pt.mesh.position.y+=pt.vy;pt.mesh.position.z+=pt.vz;
    pt.life-=0.035;
    pt.mesh.material.opacity=Math.max(0,pt.life);
    if(pt.life<=0){scene3d.remove(pt.mesh);extDisposeThree(pt.mesh);particleMeshes3d.splice(i2,1)}
  }
}

function randomSpot(minDist){
  var x2,y2,tries=0;
  do { x2=c(20,380); y2=c(20,380); tries++; } while(Math.hypot(x2-player.x,y2-player.y)<minDist && tries<40);
  return {x:x2,y:y2};
}

function newWave(){
  var i, spot;
  bullets=[]; chasers=[]; orbiters=[]; spinners=[]; humans=[]; turrets=[]; enemyBullets=[];
  for(i=0;i<8+3*wave;i++){ spot=randomSpot(130); chasers.push({x:spot.x,y:spot.y,s:42+3*wave+c(0,12)}); }
  for(i=0;i<Math.floor((wave+1)/2);i++){ spot=randomSpot(140); orbiters.push({x:spot.x,y:spot.y,a:c(0,e)}); }
  for(i=0;i<3+wave;i++){ spot=randomSpot(90); spinners.push({x:spot.x,y:spot.y}); }
  for(i=0;i<3;i++){ spot=randomSpot(60); humans.push({x:spot.x,y:spot.y,a:c(0,e),t:0}); }
  for(i=0;i<Math.floor(wave/3);i++){ spot=randomSpot(150); turrets.push({x:spot.x,y:spot.y,cd:c(1,2.4)}); }
}

function checkExtraLife(){
  if(score >= nextExtraLife){ lives++; nextExtraLife += 8000; }
}

function addScore(amount){
  score += amount*comboMult;
  comboMult = Math.min(6, comboMult+1);
  comboTimer = 2;
  checkExtraLife();
}

function step(dt){
  var moveX=r.ax(), moveY=r.ay(), aimX=0, aimY=0, dist, i, j, bullet, killed, pos;
  timeAcc += dt; hitInvuln -= dt; fireCd -= dt; comboTimer -= dt;
  if(comboTimer<=0) comboMult = 1;

  player.x = s(player.x + 170*moveX*dt*(moveX&&moveY?0.72:1), 8, 392);
  player.y = s(player.y + 170*moveY*dt*(moveX&&moveY?0.72:1), 8, 392);

  if(r.k.i) aimY -= 1;
  if(r.k.k) aimY += 1;
  if(r.k.j) aimX -= 1;
  if(r.k.l) aimX += 1;
  if(aimTarget){ dist = Math.hypot(aimTarget.x-player.x, aimTarget.y-player.y)||1; aimX=(aimTarget.x-player.x)/dist; aimY=(aimTarget.y-player.y)/dist; }
  if((aimX||aimY) && fireCd<=0){
    dist = Math.hypot(aimX,aimY);
    bullets.push({x:player.x, y:player.y, vx:aimX/dist*520, vy:aimY/dist*520, t:0.9});
    fireCd = 0.11;
  }

  for(i=bullets.length-1;i>=0;i--){
    bullet = bullets[i];
    bullet.x += bullet.vx*dt; bullet.y += bullet.vy*dt; bullet.t -= dt;
    if(bullet.t<=0 || bullet.x<0 || bullet.x>W || bullet.y<0 || bullet.y>HH) bullets.splice(i,1);
  }
  for(i=enemyBullets.length-1;i>=0;i--){
    bullet = enemyBullets[i];
    bullet.x += bullet.vx*dt; bullet.y += bullet.vy*dt; bullet.t -= dt;
    if(bullet.t<=0 || bullet.x<0 || bullet.x>W || bullet.y<0 || bullet.y>HH) enemyBullets.splice(i,1);
  }

  chasers.forEach(function(ch){
    var v = Math.hypot(player.x-ch.x, player.y-ch.y)||1;
    ch.x += (player.x-ch.x)/v*ch.s*dt + 8*Math.sin(3*timeAcc+ch.s)*dt;
    ch.y += (player.y-ch.y)/v*ch.s*dt;
  });
  orbiters.forEach(function(ob){
    if(Math.random()<1.2*dt) ob.a += c(-1.2,1.2);
    if(Math.random()<0.5*dt) ob.a = Math.atan2(player.y-ob.y, player.x-ob.x);
    ob.x += 34*Math.cos(ob.a)*dt; ob.y += 34*Math.sin(ob.a)*dt;
    if(ob.x<12 || ob.x>388){ ob.a = Math.PI-ob.a; ob.x = s(ob.x,12,388); }
    if(ob.y<12 || ob.y>388){ ob.a = -ob.a; ob.y = s(ob.y,12,388); }
  });
  humans.forEach(function(hu){
    hu.t -= dt;
    if(hu.t<=0){ hu.a += c(-1.5,1.5); hu.t = c(0.4,1.2); }
    hu.x += 30*Math.cos(hu.a)*dt; hu.y += 30*Math.sin(hu.a)*dt;
    if(hu.x<8 || hu.x>392){ hu.a = Math.PI-hu.a; hu.x = s(hu.x,8,392); }
    if(hu.y<8 || hu.y>392){ hu.a = -hu.a; hu.y = s(hu.y,8,392); }
  });
  turrets.forEach(function(tu){
    tu.cd -= dt;
    if(tu.cd<=0){
      var v2 = Math.hypot(player.x-tu.x, player.y-tu.y)||1;
      enemyBullets.push({x:tu.x, y:tu.y, vx:(player.x-tu.x)/v2*180, vy:(player.y-tu.y)/v2*180, t:2.5});
      tu.cd = c(1.8,3.2);
    }
  });

  for(i=bullets.length-1;i>=0;i--){
    bullet = bullets[i]; killed = false;
    for(j=0;j<chasers.length;j++) if(Math.hypot(chasers[j].x-bullet.x, chasers[j].y-bullet.y)<10){ addScore(100); spawnParticles3d(mapX3d(chasers[j].x),mapZ3d(chasers[j].y),o.coral,8); chasers.splice(j,1); killed=true; break; }
    if(!killed) for(j=0;j<spinners.length;j++) if(Math.hypot(spinners[j].x-bullet.x, spinners[j].y-bullet.y)<10){ addScore(50); spawnParticles3d(mapX3d(spinners[j].x),mapZ3d(spinners[j].y),o.yellow,8); spinners.splice(j,1); killed=true; break; }
    if(!killed) for(j=0;j<turrets.length;j++) if(Math.hypot(turrets[j].x-bullet.x, turrets[j].y-bullet.y)<12){ addScore(150); spawnParticles3d(mapX3d(turrets[j].x),mapZ3d(turrets[j].y),o.magenta,12); turrets.splice(j,1); killed=true; break; }
    if(!killed) for(j=0;j<orbiters.length;j++) if(Math.hypot(orbiters[j].x-bullet.x, orbiters[j].y-bullet.y)<14){ orbiters[j].x += 0.02*bullet.vx; orbiters[j].y += 0.02*bullet.vy; killed=true; break; }
    if(killed) bullets.splice(i,1);
  }

  for(i=humans.length-1;i>=0;i--){
    if(Math.hypot(humans[i].x-player.x, humans[i].y-player.y)<14){ addScore(1000); spawnParticles3d(mapX3d(humans[i].x),mapZ3d(humans[i].y),o.green,14); humans.splice(i,1); }
  }

  if(hitInvuln<=0){
    var hit = chasers.some(function(ch){ return Math.hypot(ch.x-player.x, ch.y-player.y)<12; })
      || spinners.some(function(sp){ return Math.hypot(sp.x-player.x, sp.y-player.y)<11; })
      || orbiters.some(function(ob){ return Math.hypot(ob.x-player.x, ob.y-player.y)<17; })
      || enemyBullets.some(function(bl){ return Math.hypot(bl.x-player.x, bl.y-player.y)<10; });
    if(hit){
      lives--; hitInvuln = 2; comboMult = 1; comboTimer = 0;
      spawnParticles3d(mapX3d(player.x),mapZ3d(player.y),o.ink,26);
      player.x = 200; player.y = 200;
      enemyBullets = [];
      chasers.forEach(function(ch){ if(Math.hypot(ch.x-200, ch.y-200)<110){ pos = randomSpot(200); ch.x = pos.x; ch.y = pos.y; } });
    }
  }

  if(lives<=0){ render3d(dt); r.over(score, 'Wave '+wave+' · Score: '+score); return; }

  if(!chasers.length){
    addScore(500*humans.length + 200);
    wave++; hitInvuln = 2; player.x = 200; player.y = 200;
    newWave();
  }

  render3d(dt);
}

function render3d(dt){
  disposeGroupChildren(chaserGroup3d);
  chasers.forEach(function(ch){
    var mesh=new THREE.Mesh(new THREE.BoxGeometry(0.75,0.6,0.75),chaserMat3d);
    mesh.position.set(mapX3d(ch.x),0.3,mapZ3d(ch.y));
    chaserGroup3d.add(mesh)
  });

  disposeGroupChildren(spinnerGroup3d);
  spinners.forEach(function(sp){
    var grp=new THREE.Group();
    var b1=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.08,0.08),spinnerMat3d);
    b1.rotation.y=Math.PI/4;
    var b2m=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.08,0.08),spinnerMat3d);
    b2m.rotation.y=-Math.PI/4;
    grp.add(b1);grp.add(b2m);
    grp.position.set(mapX3d(sp.x),0.3,mapZ3d(sp.y));
    spinnerGroup3d.add(grp)
  });

  disposeGroupChildren(turretGroup3d);
  turrets.forEach(function(tu){
    var mesh=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.5,1.0),turretMat3d);
    mesh.position.set(mapX3d(tu.x),0.25,mapZ3d(tu.y));
    turretGroup3d.add(mesh)
  });

  disposeGroupChildren(humanGroup3d);
  humans.forEach(function(hu){
    var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.2,8,8),humanMat3d);
    mesh.position.set(mapX3d(hu.x),0.35,mapZ3d(hu.y));
    humanGroup3d.add(mesh)
  });

  disposeGroupChildren(orbiterGroup3d);
  orbiters.forEach(function(ob){
    var mesh=new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.6,0.35,16),orbiterMat3d);
    mesh.position.set(mapX3d(ob.x),0.2,mapZ3d(ob.y));
    orbiterGroup3d.add(mesh)
  });

  disposeGroupChildren(bulletGroup3d);
  bullets.forEach(function(bl){
    var mesh=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.18,0.18),bulletMat3d);
    mesh.position.set(mapX3d(bl.x),0.3,mapZ3d(bl.y));
    bulletGroup3d.add(mesh)
  });

  disposeGroupChildren(enemyBulletGroup3d);
  enemyBullets.forEach(function(bl){
    var mesh=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.22,0.22),enemyBulletMat3d);
    mesh.position.set(mapX3d(bl.x),0.3,mapZ3d(bl.y));
    enemyBulletGroup3d.add(mesh)
  });

  var blink=hitInvuln<=0||Math.floor(10*hitInvuln)%2;
  playerGroup3d.visible=!!blink;
  if(blink)playerGroup3d.position.set(mapX3d(player.x),0,mapZ3d(player.y));

  stepParticles3d(dt);
  renderer3d.render(scene3d,camera3d);
  r.hud([['SCORE',y(score)],['WAVE',wave],['LIVES',lives],['COMBO','x'+comboMult]]);
}

r.pointer({down:function(pt){ aimTarget = pt; }, move:function(pt,evt,down){ if(down) aimTarget = pt; }, up:function(){ aimTarget = null; }});
r.pad([['▲','ArrowUp'],['◀','ArrowLeft'],['▶','ArrowRight'],['▼','ArrowDown']]);
r.fns.push(function(){
  scene3d.traverse(function(obj){extDisposeThree(obj)});
  renderer3d.dispose();
  if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
  if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
});

r.begin(function(){
  player = {x:200,y:200}; lives=3; score=0; wave=1; hitInvuln=1.5; aimTarget=null; timeAcc=0; fireCd=0;
  comboMult=1; comboTimer=0; nextExtraLife=8000;
  newWave();
  r.frame(step);
});
}
ext3DLoadGate(r.el,startGame3D)
}),w('landGrab',b,'Land Grab',o.blue,'Draw lines to fence off territory, chain claims for a bonus, and keep clear of the wild sparks.','Arrows / WASD to move and draw · fence off 75% to clear the level',function(r){
function startGame3D(){
  var GRID=40, CELL=10, W=400;
  var grid, player, trail, drawing, sparks, lives, score, level, claimedPct, moveAccum, axisLock, comboMult, comboTimer, nextExtraLife;

  var wrapDiv=document.createElement('div');
  wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
  r.el.appendChild(wrapDiv);
  var canvasWrap=document.createElement('div');
  canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:1/1;margin:0 auto';
  wrapDiv.appendChild(canvasWrap);

  var renderer3d=extMakeWebGLRenderer();
  if(!renderer3d){r.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
  renderer3d.setSize(W,W);
  renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
  renderer3d.setClearColor(0x0a0a1a,1);
  canvasWrap.appendChild(renderer3d.domElement);
  r.cv=renderer3d.domElement;r.w=W;r.h=W;

  function mapX3d(px2){return px2/W*20-10}
  function mapZ3d(py){return 10-py/W*20}

  var scene3d=new THREE.Scene();
  scene3d.fog=new THREE.Fog(0x0a0a1a,22,46);
  var camera3d=new THREE.PerspectiveCamera(48,1,0.1,200);
  camera3d.position.set(0,16,11);
  camera3d.lookAt(0,0,0);

  scene3d.add(new THREE.AmbientLight(0xcfe9ff,0.8));
  var sun3d=new THREE.DirectionalLight(0xffffff,0.7);
  sun3d.position.set(8,20,8);
  scene3d.add(sun3d);

  var gridTexCanvas=document.createElement('canvas');
  gridTexCanvas.width=400;gridTexCanvas.height=400;
  var gridTexCtx=gridTexCanvas.getContext('2d');
  var gridTexture=new THREE.CanvasTexture(gridTexCanvas);
  gridTexture.flipY=false;
  var floor3d=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshStandardMaterial({map:gridTexture,roughness:0.9}));
  floor3d.rotation.x=-Math.PI/2;
  scene3d.add(floor3d);

  function disposeGroupChildren(grp){
    while(grp.children.length){
      var c2=grp.children.pop();
      grp.remove(c2);
      extDisposeThree(c2)
    }
  }
  var sparkGroup3d=new THREE.Group();scene3d.add(sparkGroup3d);
  var sparkMatA3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.yellow)});
  var sparkMatB3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.magenta)});
  var sparkCoreMat3d=new THREE.MeshStandardMaterial({color:0x10101a,roughness:0.5});

  var playerMat3d=new THREE.MeshStandardMaterial({color:0xf4f1ff,emissive:new THREE.Color(o.blue),emissiveIntensity:0.6,roughness:0.3});
  var playerMesh3d=new THREE.Mesh(new THREE.BoxGeometry(0.6,0.45,0.6),playerMat3d);
  playerMesh3d.rotation.y=Math.PI/4;
  scene3d.add(playerMesh3d);

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

  function sparkCount(){ return level>=9 ? 4 : level>=6 ? 3 : level>=3 ? 2 : 1; }

  function newLevel(){
    var row, col, i;
    grid = [];
    for(row=0; row<GRID; row++){
      grid.push([]);
      for(col=0; col<GRID; col++) grid[row].push(row===0||col===0||row===39||col===39 ? 1 : 0);
    }
    player = {x:0, y:39};
    trail = []; drawing = false; claimedPct = 0; moveAccum = 0;
    sparks = [];
    for(i=0; i<sparkCount(); i++) sparks.push({x:150+100*i, y:200, a:c(0,e), t:0, r:0, hit:0});
  }

  function die(){
    trail.forEach(function(cell){ grid[cell[1]][cell[0]] = 0; });
    trail = []; drawing = false;
    spawnParticles3d(mapX3d(player.x*CELL+5), mapZ3d(player.y*CELL+5), o.blue, 24);
    player = {x:0, y:39};
    lives--; comboMult = 1; comboTimer = 0;
  }

  function checkExtraLife(){
    if(score >= nextExtraLife){ lives++; nextExtraLife += 6000; }
  }

  function floodFillClaim(){
    var row, col, visited = [], claimedNew = 0, total = 0;
    trail.forEach(function(cell){ grid[cell[1]][cell[0]] = 1; });
    trail = [];
    for(row=0; row<GRID; row++) visited.push(new Array(GRID).fill(0));
    for(row=1; row<39; row++){
      for(col=1; col<39; col++){
        if(!grid[row][col] && !visited[row][col]){
          var region = [], stack = [[col,row]], hasSpark = false, cell, nx, ny;
          visited[row][col] = 1;
          while(stack.length){
            cell = stack.pop();
            region.push(cell);
            if(sparks.some(function(sp){ return Math.floor(sp.x/CELL)===cell[0] && Math.floor(sp.y/CELL)===cell[1]; })) hasSpark = true;
            [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(dd){
              nx = cell[0]+dd[0]; ny = cell[1]+dd[1];
              if(grid[ny][nx]===0 && !visited[ny][nx]){ visited[ny][nx] = 1; stack.push([nx,ny]); }
            });
          }
          if(!hasSpark){ region.forEach(function(cl){ grid[cl[1]][cl[0]] = 1; }); claimedNew += region.length; }
        }
      }
    }
    if(claimedNew>0){
      score += 10*claimedNew*comboMult;
      comboMult = Math.min(6, comboMult+1);
      comboTimer = 3;
      checkExtraLife();
    }
    for(row=1; row<39; row++) for(col=1; col<39; col++) total += grid[row][col];
    claimedPct = Math.floor(total/1444*100);
    if(claimedPct>=75){
      score += 1000+200*level;
      checkExtraLife();
      level++;
      newLevel();
    }
  }

  function step(dt){
    var moveX = r.ax(), moveY = r.ay(), targetX, targetY, val, k, spark, speed, nx, ny, bx, by;
    comboTimer -= dt;
    if(comboTimer<=0) comboMult = 1;

    if(moveX && moveY){ if(axisLock==='x') moveX = 0; else moveY = 0; }
    else if(moveX) axisLock = 'x';
    else if(moveY) axisLock = 'y';

    moveAccum += dt;
    while(moveAccum >= 0.032){
      moveAccum -= 0.032;
      if((moveX||moveY)){
        targetX = player.x+moveX; targetY = player.y+moveY;
        if(targetX>=0 && targetY>=0 && targetX<GRID && targetY<GRID){
          val = grid[targetY][targetX];
          if(val===2){ die(); break; }
          if(val===0){ drawing = true; grid[targetY][targetX] = 2; trail.push([targetX,targetY]); player.x = targetX; player.y = targetY; }
          else {
            player.x = targetX; player.y = targetY;
            if(drawing){ drawing = false; floodFillClaim(); break; }
          }
        }
      }
    }

    sparks.forEach(function(spark){
      speed = 105+10*level;
      spark.t -= dt; spark.r += 5*dt;
      if(spark.t<=0){ spark.a += c(-1.1,1.1); spark.t = c(0.25,0.6); }
      nx = spark.x + Math.cos(spark.a)*speed*dt;
      ny = spark.y + Math.sin(spark.a)*speed*dt;
      if(grid[Math.floor(spark.y/CELL)][Math.floor(nx/CELL)]===1) spark.a = Math.PI-spark.a; else spark.x = nx;
      if(grid[Math.floor(ny/CELL)][Math.floor(spark.x/CELL)]===1) spark.a = -spark.a; else spark.y = ny;
      spark.x = s(spark.x,15,385); spark.y = s(spark.y,15,385);
      for(k=0;k<4;k++){
        bx = spark.x+14*Math.cos(spark.r+1.57*k);
        by = spark.y+14*Math.sin(spark.r+1.57*k);
        if(grid[s(Math.floor(by/CELL),0,39)][s(Math.floor(bx/CELL),0,39)]===2) spark.hit = 1;
      }
      if(grid[Math.floor(spark.y/CELL)][Math.floor(spark.x/CELL)]===2) spark.hit = 1;
    });
    if(sparks.some(function(sp){ return sp.hit; })){ sparks.forEach(function(sp){ sp.hit=0; }); die(); }

    if(lives<=0){ render3d(dt); r.over(score, 'Level '+level+' · Score: '+score); return; }
    render3d(dt);
  }

  function render3d(dt){
    var row, col;
    gridTexCtx.fillStyle = '#0a0a1a';
    gridTexCtx.fillRect(0,0,400,400);
    for(row=0; row<GRID; row++){
      for(col=0; col<GRID; col++){
        if(grid[row][col]===1){ gridTexCtx.fillStyle = (col===0||row===0||col===39||row===39) ? o.violet : '#2c4a7a'; gridTexCtx.fillRect(col*CELL, row*CELL, CELL, CELL); }
        else if(grid[row][col]===2){ gridTexCtx.fillStyle = o.orange; gridTexCtx.fillRect(col*CELL+1, row*CELL+1, 8, 8); }
      }
    }
    gridTexture.needsUpdate = true;

    disposeGroupChildren(sparkGroup3d);
    sparks.forEach(function(sp){
      var core=new THREE.Mesh(new THREE.SphereGeometry(0.16,8,8),sparkCoreMat3d);
      core.position.set(mapX3d(sp.x),0.32,mapZ3d(sp.y));
      sparkGroup3d.add(core);
      for(var k=0;k<4;k++){
        var ang=sp.r+1.5708*k;
        var arm=new THREE.Mesh(new THREE.BoxGeometry(0.62,0.1,0.1),k%2?sparkMatB3d:sparkMatA3d);
        arm.position.set(mapX3d(sp.x+7*Math.cos(ang)),0.32,mapZ3d(sp.y+7*Math.sin(ang)));
        arm.rotation.y=-ang;
        sparkGroup3d.add(arm);
      }
    });

    playerMesh3d.position.set(mapX3d(player.x*CELL+5),0.26,mapZ3d(player.y*CELL+5));

    stepParticles3d(dt);
    renderer3d.render(scene3d,camera3d);
    r.hud([['SCORE',y(score)],['CLAIMED',claimedPct+'%'],['LIVES',lives],['COMBO','x'+comboMult]]);
  }

  r.pad([['▲','ArrowUp'],['◀','ArrowLeft'],['▶','ArrowRight'],['▼','ArrowDown']]);

  r.fns.push(function(){
    scene3d.traverse(function(obj){extDisposeThree(obj)});
    renderer3d.dispose();
    if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
    if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
  });
  r.begin(function(){
    lives = 3; score = 0; level = 1; axisLock = null; comboMult = 1; comboTimer = 0; nextExtraLife = 4000;
    r.fx = [];
    newLevel();
    r.frame(step);
  });
}
ext3DLoadGate(r.el,startGame3D)
}),w('fruitSlash',m,'Fruit Slash',o.green,'Chain slices for a combo bonus, snag the rare golden fruit, and dodge the bombs.','Drag / swipe across fruit · slice several in one swipe for a combo bonus · avoid the bombs · miss 3 and it is over',function(r){
var W=400,H=420,ctx=r.canvas(W,H);
var fruitTypes=[
  {col:o.coral,pts:10,rad:22},
  {col:o.orange,pts:10,rad:22},
  {col:o.green,pts:12,rad:24},
  {col:o.magenta,pts:10,rad:20},
  {col:o.yellow,pts:15,rad:18}
];
var fruits,halves,trail,livesLost,score,spawnTimer,elapsed,streak,bestStreak,swipeHits,dragging,lastPt,flash;
function multiplier(){return 1+Math.min(4,Math.floor(streak/5));}
function spawnOne(){
  var px=c(60,340);
  var speedBoost=1+Math.min(.6,elapsed/50);
  var bombChance=Math.min(.3,.05+score/1800);
  var goldChance=Math.min(.12,.02+score/3500);
  var roll=Math.random();
  var vx=(200-px)*c(.25,.6)+c(-30,30);
  if(roll<bombChance){
    fruits.push({x:px,y:H+20,vx:vx,vy:-c(560,720)*speedBoost,rad:Math.random()<.3?24:17,bomb:true,heavy:Math.random()<.3});
  }else if(roll<bombChance+goldChance){
    fruits.push({x:px,y:H+20,vx:vx,vy:-c(640,780)*speedBoost,rad:16,golden:true,pts:50,col:o.yellow});
  }else{
    var ft=u(fruitTypes);
    fruits.push({x:px,y:H+20,vx:vx,vy:-c(540,700)*speedBoost,rad:ft.rad,col:ft.col,pts:ft.pts});
  }
}
function spawnWave(){
  var n=1+f(1+Math.floor(elapsed/12)),k;
  for(k=0;k<n;k++)spawnOne();
}
function sliceSegment(p0,p1){
  var dx=p1.x-p0.x,dy=p1.y-p0.y,len2=dx*dx+dy*dy||1,hitsThisMove=0,i,fr,tt,px,py,mult,chainBonus;
  for(i=fruits.length-1;i>=0;i--){
    fr=fruits[i];
    tt=s(((fr.x-p0.x)*dx+(fr.y-p0.y)*dy)/len2,0,1);
    px=p0.x+dx*tt;py=p0.y+dy*tt;
    if(Math.hypot(fr.x-px,fr.y-py)<fr.rad){
      fruits.splice(i,1);
      if(fr.bomb){
        r.burst(fr.x,fr.y,o.coral,30);
        flash=1;
        render(.016);
        r.over(score,'You sliced a bomb! Score: '+score);
        return;
      }
      hitsThisMove++;
      swipeHits++;
      streak++;
      bestStreak=Math.max(bestStreak,streak);
      mult=multiplier();
      chainBonus=hitsThisMove>1?1.5:1;
      score+=Math.round(fr.pts*mult*chainBonus);
      r.burst(fr.x,fr.y,fr.col,fr.golden?26:14);
      halves.push({x:fr.x,y:fr.y,vx:fr.vx-60,vy:.4*fr.vy,ang:0,va:-3,col:fr.col,side:0},
                  {x:fr.x,y:fr.y,vx:fr.vx+60,vy:.4*fr.vy,ang:0,va:3,col:fr.col,side:1});
    }
  }
}
function step(dt){
  elapsed+=dt;
  if((spawnTimer-=dt)<=0){
    spawnWave();
    spawnTimer=Math.max(.32,c(.8,1.4)-elapsed*.012);
  }
  var i,fr,hv;
  for(i=fruits.length-1;i>=0;i--){
    fr=fruits[i];
    fr.vy+=720*dt;fr.x+=fr.vx*dt;fr.y+=fr.vy*dt;
    if(fr.y>H+40&&fr.vy>0){
      if(!fr.bomb){livesLost++;streak=0;r.burst(fr.x,H-10,o.coral,6);}
      fruits.splice(i,1);
    }
  }
  for(i=halves.length-1;i>=0;i--){
    hv=halves[i];
    hv.vy+=720*dt;hv.x+=hv.vx*dt;hv.y+=hv.vy*dt;hv.ang+=hv.va*dt;
    if(hv.y>H+40)halves.splice(i,1);
  }
  if(flash>0)flash=Math.max(0,flash-2*dt);
  render(dt);
  if(livesLost>=3){r.over(score,'Too many got away. Score: '+score);}
}
function render(dt){
  g(ctx,W,H);
  if(flash>0){ctx.fillStyle='rgba(255,107,74,'+(.4*flash)+')';ctx.fillRect(0,0,W,H);}
  fruits.forEach(function(fr){
    if(fr.bomb){
      d(ctx,fr.x,fr.y,fr.rad,'#0b0518');
      ctx.strokeStyle=fr.heavy?o.magenta:o.dim;ctx.lineWidth=fr.heavy?3:2;ctx.stroke();
      v(ctx,fr.x+6,fr.y-14,fr.x+12,fr.y-22,o.orange,3);
      d(ctx,fr.x+12,fr.y-23,3,o.yellow);
    }else{
      d(ctx,fr.x,fr.y,fr.rad,fr.col);
      d(ctx,fr.x-7,fr.y-7,5,'rgba(255,255,255,.35)');
      v(ctx,fr.x,fr.y-fr.rad,fr.x+4,fr.y-fr.rad-8,o.green,3);
      if(fr.golden){
        ctx.strokeStyle='rgba(255,224,102,.85)';ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(fr.x,fr.y,fr.rad+5,0,e);ctx.stroke();
      }
    }
  });
  halves.forEach(function(hv){
    ctx.save();ctx.translate(hv.x,hv.y);ctx.rotate(hv.ang);
    ctx.beginPath();ctx.arc(0,0,22,hv.side?0:Math.PI,hv.side?Math.PI:e);ctx.closePath();
    ctx.fillStyle=hv.col;ctx.fill();
    ctx.beginPath();ctx.arc(0,0,15,hv.side?0:Math.PI,hv.side?Math.PI:e);ctx.closePath();
    ctx.fillStyle=o.ink;ctx.fill();
    ctx.restore();
  });
  for(var i=1;i<trail.length;i++)v(ctx,trail[i-1].x,trail[i-1].y,trail[i].x,trail[i].y,'rgba(233,251,249,'+(i/trail.length)+')',2+.6*i);
  r.fxStep(dt);
  r.hud([['SCORE',y(score)],['MISSES',livesLost+'/3'],['COMBO','x'+multiplier()]]);
}
r.pointer({
  down:function(pt){dragging=true;lastPt=pt;trail=[pt];swipeHits=0;},
  move:function(pt){
    if(!dragging)return;
    sliceSegment(lastPt,pt);
    lastPt=pt;trail.push(pt);
    if(trail.length>9)trail.shift();
  },
  up:function(){
    dragging=false;trail=[];
    if(swipeHits>=3){score+=10*swipeHits;r.burst(200,200,o.yellow,20);}
    swipeHits=0;
  }
});
r.begin(function(){
  fruits=[];halves=[];trail=[];livesLost=0;score=0;spawnTimer=.6;elapsed=0;streak=0;bestStreak=0;swipeHits=0;dragging=false;lastPt=null;flash=0;
  r.fx=[];
  r.frame(step);
});
}),w('towerStack',m,'Tower Stack',o.blue,'Time each drop to land the sliding block squarely on the tower below.','Tap / click / Space to drop the block · perfect drops shrink the target as you climb',function(r){
var W=320,H=480,BLOCK_H=22,BASE_Y=400,ctx=r.canvas(W,H);
var blocks,current,dir,speed,fallingPieces,perfectStreak,bestStreak,hue,camY,settle