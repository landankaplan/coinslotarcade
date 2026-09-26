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
  var W=400, HEIGHT=300, GROUND=232, ctx=r.canvas(W,HEIGHT);
  var roverY, roverVy, obstacles, bullets, saucers, bombs, pickups, dist, parallax, lives, killScore, deathFreeze, obstacleCd, fireCd, saucerCd, pickupCd, comboMult, comboTimer, rapidTimer, shield, nextExtraLife;

  function jump(){ if(roverY>=231.5) roverVy = -340; }

  function fire(){
    if(fireCd>0) return;
    bullets.push({x:120, y:roverY-12, vx:440, vy:0}, {x:96, y:roverY-20, vx:20, vy:-360});
    fireCd = rapidTimer>0 ? 0.14 : 0.28;
  }

  function hitRover(obstacle){
    if(deathFreeze>0) return;
    if(shield>0){ shield=0; deathFreeze=0.6; r.burst(96, roverY-8, o.blue, 20); if(obstacle) obstacle.dead=1; return; }
    lives--; deathFreeze = 1.6; comboMult = 1; comboTimer = 0;
    r.burst(96, roverY-8, o.yellow, 24);
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
      if(bm.y>=GROUND){ bm.dead=1; obstacles.push({t:'c', x:bm.x-15, w:32}); r.burst(bm.x, GROUND, o.coral, 8); }
    });
    bullets.forEach(function(bl){ bl.x += bl.vx*dt - speed*dt*(bl.vx<100?1:0); bl.y += bl.vy*dt; if(bl.x>410 || bl.y<-10) bl.dead=1; });
    pickups.forEach(function(pk){ pk.x -= speed*dt; });

    for(i=0;i<bullets.length;i++){
      bullet = bullets[i];
      if(bullet.dead) continue;
      for(j=0;j<obstacles.length;j++){
        obs = obstacles[j];
        if(!bullet.dead && obs.t==='r' && !obs.dead && Math.abs(bullet.x-obs.x-9)<12 && bullet.y>208){ obs.dead=1; bullet.dead=1; addKillScore(50); r.burst(obs.x+9,224,o.orange,10); }
      }
      for(j=0;j<saucers.length;j++){
        saucer = saucers[j];
        if(!bullet.dead && !saucer.dead && Math.abs(bullet.x-saucer.x)<18 && Math.abs(bullet.y-saucer.y)<12){
          bullet.dead = 1; saucer.hp--;
          r.burst(saucer.x, saucer.y, o.violet, saucer.hp<=0?16:6);
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
        if(pick.kind==='shield'){ shield=1; r.burst(pick.x,pick.y,o.blue,14); }
        else { rapidTimer=4; addKillScore(20); r.burst(pick.x,pick.y,o.teal,14); }
        pickups.splice(i,1);
      }
    }

    obstacles = obstacles.filter(function(o2){ return !o2.dead && o2.x+o2.w>-30; });
    saucers = saucers.filter(function(s2){ return !s2.dead && s2.x>-30; });
    bombs = bombs.filter(function(bm){ return !bm.dead; });
    bullets = bullets.filter(function(bl){ return !bl.dead; });
    pickups = pickups.filter(function(pk){ return pk.x>-20; });

    if(lives<=0){ draw(dt); r.over(Math.floor(dist/10)+killScore, 'Distance '+Math.floor(dist/10)+' m · Score: '+(Math.floor(dist/10)+killScore)); return; }
    draw(dt);
  }

  function draw(dt){
    var i;
    g(ctx, W, HEIGHT);
    for(i=-1;i<6;i++){
      ctx.beginPath();
      ctx.moveTo(90*i-0.15*parallax%90, 200);
      ctx.lineTo(90*i+45-0.15*parallax%90, 150);
      ctx.lineTo(90*i+90-0.15*parallax%90, 200);
      ctx.closePath(); ctx.fillStyle = '#20194a'; ctx.fill();
    }
    ctx.fillStyle = '#3a2a7a'; ctx.fillRect(0,244,W,68);
    obstacles.forEach(function(o2){
      if(o2.t==='c'){
        ctx.fillStyle = '#0d0820';
        ctx.beginPath(); ctx.moveTo(o2.x,244); ctx.lineTo(o2.x+8,266); ctx.lineTo(o2.x+o2.w-8,266); ctx.lineTo(o2.x+o2.w,244); ctx.closePath(); ctx.fill();
      } else p(ctx, o2.x, 226, 18, 18, 5, '#9aa4b8');
    });
    ctx.fillStyle = o.yellow;
    bullets.forEach(function(bl){ ctx.fillRect(bl.x-3, bl.y-2, 6, 4); });
    saucers.forEach(function(s2){ p(ctx, s2.x-16, s2.y-4, 32, 9, 4, s2.hp>1?o.magenta:o.violet); p(ctx, s2.x-8, s2.y-11, 16, 8, 4, o.ink); });
    bombs.forEach(function(bm){ d(ctx, bm.x, bm.y, 4, o.coral); });
    pickups.forEach(function(pk){ d(ctx, pk.x, pk.y, 8, pk.kind==='shield'?o.blue:o.teal); d(ctx, pk.x, pk.y, 3, o.ink); });
    if(deathFreeze<=0 || Math.floor(10*deathFreeze)%2){
      p(ctx, 80, roverY-16, 34, 10, 4, shield>0?o.blue:o.yellow);
      p(ctx, 92, roverY-22, 14, 8, 3, o.ink);
      d(ctx, 86, roverY-2, 6, o.ink);
      d(ctx, 108, roverY-2, 6, o.ink);
      d(ctx, 86, roverY-2, 2.5, o.bg);
      d(ctx, 108, roverY-2, 2.5, o.bg);
    }
    r.fxStep(dt);
    r.hud([['SCORE', y(Math.floor(dist/10)+killScore)], ['DIST', Math.floor(dist/10)+'m'], ['LIVES', lives], ['COMBO','x'+comboMult]]);
  }

  r.press = function(key){
    if(key===' ' || key==='ArrowUp' || key==='w') jump();
    if(key==='x' || key==='z' || key==='Enter') fire();
  };
  r.pointer({down:function(pt){ if(pt.x>200) fire(); else jump(); }});
  r.pad([['JUMP','ArrowUp'],['FIRE','x']]);

  r.begin(function(){
    roverY = GROUND; roverVy = 0; obstacles = []; bullets = []; saucers = []; bombs = []; pickups = [];
    dist = 0; parallax = 0; lives = 3; killScore = 0; deathFreeze = 0;
    obstacleCd = 320; fireCd = 0; saucerCd = 6; pickupCd = 5;
    comboMult = 1; comboTimer = 0; rapidTimer = 0; shield = 0; nextExtraLife = 5000;
    r.fx = [];
    r.frame(step);
  });
}),w('botSwarm',b,'Bot Swarm',o.coral,'Move with one hand, blast with the other, dodge turret fire and rescue stranded humans.','WASD / arrows move · I J K L (or click and hold) to shoot',function(r){
  var W=400, HH=400, ctx=r.canvas(W,HH);
  var player, bullets, chasers, orbiters, spinners, humans, turrets, enemyBullets;
  var score, lives, wave, hitInvuln, aimTarget, timeAcc, fireCd, comboMult, comboTimer, nextExtraLife;

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
      for(j=0;j<chasers.length;j++) if(Math.hypot(chasers[j].x-bullet.x, chasers[j].y-bullet.y)<10){ addScore(100); r.burst(chasers[j].x,chasers[j].y,o.coral,8); chasers.splice(j,1); killed=true; break; }
      if(!killed) for(j=0;j<spinners.length;j++) if(Math.hypot(spinners[j].x-bullet.x, spinners[j].y-bullet.y)<10){ addScore(50); r.burst(spinners[j].x,spinners[j].y,o.yellow,8); spinners.splice(j,1); killed=true; break; }
      if(!killed) for(j=0;j<turrets.length;j++) if(Math.hypot(turrets[j].x-bullet.x, turrets[j].y-bullet.y)<12){ addScore(150); r.burst(turrets[j].x,turrets[j].y,o.magenta,12); turrets.splice(j,1); killed=true; break; }
      if(!killed) for(j=0;j<orbiters.length;j++) if(Math.hypot(orbiters[j].x-bullet.x, orbiters[j].y-bullet.y)<14){ orbiters[j].x += 0.02*bullet.vx; orbiters[j].y += 0.02*bullet.vy; killed=true; break; }
      if(killed) bullets.splice(i,1);
    }

    for(i=humans.length-1;i>=0;i--){
      if(Math.hypot(humans[i].x-player.x, humans[i].y-player.y)<14){ addScore(1000); r.burst(humans[i].x, humans[i].y, o.green, 14); humans.splice(i,1); }
    }

    if(hitInvuln<=0){
      var hit = chasers.some(function(ch){ return Math.hypot(ch.x-player.x, ch.y-player.y)<12; })
        || spinners.some(function(sp){ return Math.hypot(sp.x-player.x, sp.y-player.y)<11; })
        || orbiters.some(function(ob){ return Math.hypot(ob.x-player.x, ob.y-player.y)<17; })
        || enemyBullets.some(function(bl){ return Math.hypot(bl.x-player.x, bl.y-player.y)<10; });
      if(hit){
        lives--; hitInvuln = 2; comboMult = 1; comboTimer = 0;
        r.burst(player.x, player.y, o.ink, 26);
        player.x = 200; player.y = 200;
        enemyBullets = [];
        chasers.forEach(function(ch){ if(Math.hypot(ch.x-200, ch.y-200)<110){ pos = randomSpot(200); ch.x = pos.x; ch.y = pos.y; } });
      }
    }

    if(lives<=0){ draw(dt); r.over(score, 'Wave '+wave+' · Score: '+score); return; }

    if(!chasers.length){
      addScore(500*humans.length + 200);
      wave++; hitInvuln = 2; player.x = 200; player.y = 200;
      newWave();
    }

    draw(dt);
  }

  function draw(dt){
    g(ctx, W, HH);
    ctx.strokeStyle = o.violet; ctx.lineWidth = 3; ctx.strokeRect(1.5,1.5,397,397);
    spinners.forEach(function(sp){ v(ctx, sp.x-6, sp.y-6, sp.x+6, sp.y+6, o.yellow, 3); v(ctx, sp.x+6, sp.y-6, sp.x-6, sp.y+6, o.yellow, 3); });
    turrets.forEach(function(tu){ p(ctx, tu.x-11, tu.y-11, 22, 22, 4, o.magenta); d(ctx, tu.x, tu.y, 6, o.ink); });
    humans.forEach(function(hu){ d(ctx, hu.x, hu.y-5, 3.5, o.green); p(ctx, hu.x-3, hu.y-1, 6, 8, 2, o.green); });
    orbiters.forEach(function(ob){ p(ctx, ob.x-13, ob.y-13, 26, 26, 4, '#9aa4b8'); p(ctx, ob.x-8, ob.y-8, 16, 16, 3, '#68718a'); });
    chasers.forEach(function(ch){ p(ctx, ch.x-8, ch.y-8, 16, 16, 3, o.coral); p(ctx, ch.x-4, ch.y-3, 3, 3, 0, o.bg); p(ctx, ch.x+1, ch.y-3, 3, 3, 0, o.bg); });
    ctx.fillStyle = o.ink;
    bullets.forEach(function(bl){ ctx.fillRect(bl.x-2, bl.y-2, 4, 4); });
    ctx.fillStyle = o.magenta;
    enemyBullets.forEach(function(bl){ ctx.fillRect(bl.x-2.5, bl.y-2.5, 5, 5); });
    if(hitInvuln<=0 || Math.floor(10*hitInvuln)%2){
      d(ctx, player.x, player.y-6, 4, o.blue);
      p(ctx, player.x-4, player.y-2, 8, 10, 2, o.blue);
      p(ctx, player.x-7, player.y, 3, 6, 1, o.blue);
      p(ctx, player.x+4, player.y, 3, 6, 1, o.blue);
    }
    r.fxStep(dt);
    r.hud([['SCORE',y(score)],['WAVE',wave],['LIVES',lives],['COMBO','x'+comboMult]]);
  }

  r.pointer({down:function(pt){ aimTarget = pt; }, move:function(pt,evt,down){ if(down) aimTarget = pt; }, up:function(){ aimTarget = null; }});
  r.pad([['▲','ArrowUp'],['◀','ArrowLeft'],['▶','ArrowRight'],['▼','ArrowDown']]);

  r.begin(function(){
    player = {x:200,y:200}; lives=3; score=0; wave=1; hitInvuln=1.5; aimTarget=null; timeAcc=0; fireCd=0;
    comboMult=1; comboTimer=0; nextExtraLife=8000;
    r.fx = [];
    newWave();
    r.frame(step);
  });
}),w('landGrab',b,'Land Grab',o.blue,'Draw lines to fence off territory, chain claims for a bonus, and keep clear of the wild sparks.','Arrows / WASD to move and draw · fence off 75% to clear the level',function(r){
  var GRID=40, CELL=10, ctx=r.canvas(400,400);
  var grid, player, trail, drawing, sparks, lives, score, level, claimedPct, moveAccum, axisLock, comboMult, comboTimer, nextExtraLife;

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
    trail = []; drawing = false; player = {x:0, y:39};
    lives--; comboMult = 1; comboTimer = 0;
    r.burst(player.x*CELL+5, player.y*CELL+5, o.blue, 24);
  }

  function checkExtraLife(){
    if(score >= nextExtraLife){ lives++; nextExtraLife += 6000; }
  }

  function floodFillClaim(){
    var row, col, visited = [], claimedNew = 0, total = 0, r2;
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

    if(lives<=0){ draw(dt); r.over(score, 'Level '+level+' · Score: '+score); return; }
    draw(dt);
  }

  function draw(dt){
    var row, col, k;
    g(ctx, 400, 400);
    for(row=0; row<GRID; row++){
      for(col=0; col<GRID; col++){
        if(grid[row][col]===1){ ctx.fillStyle = (col===0||row===0||col===39||row===39) ? o.violet : '#2c4a7a'; ctx.fillRect(col*CELL, row*CELL, CELL, CELL); }
        else if(grid[row][col]===2){ ctx.fillStyle = o.orange; ctx.fillRect(col*CELL+1, row*CELL+1, 8, 8); }
      }
    }
    sparks.forEach(function(sp){
      for(k=0;k<4;k++) v(ctx, sp.x, sp.y, sp.x+14*Math.cos(sp.r+1.57*k), sp.y+14*Math.sin(sp.r+1.57*k), k%2?o.magenta:o.yellow, 2.5);
      d(ctx, sp.x, sp.y, 3, o.ink);
    });
    ctx.save();
    ctx.translate(player.x*CELL+5, player.y*CELL+5);
    ctx.rotate(Math.PI/4);
    p(ctx, -6, -6, 12, 12, 2, o.ink);
    ctx.restore();
    r.fxStep(dt);
    r.hud([['SCORE',y(score)],['CLAIMED',claimedPct+'%'],['LIVES',lives],['COMBO','x'+comboMult]]);
  }

  r.pad([['▲','ArrowUp'],['◀','ArrowLeft'],['▶','ArrowRight'],['▼','ArrowDown']]);

  r.begin(function(){
    lives = 3; score = 0; level = 1; axisLock = null; comboMult = 1; comboTimer = 0; nextExtraLife = 4000;
    r.fx = [];
    newLevel();
    r.frame(step);
  });
}),w('fruitSlash',m,'Fruit Slash',o.green,'Drag across the fruit to slice it. Bombs are not fruit.','Drag / swipe across fruit · avoid the bombs · miss 3 and it is over',function(r){var t,n,a,i,l,h,p,x,w,b,m=420,M=r.canvas(400,m),k=[o.coral,o.orange,o.green,o.magenta,o.yellow];function S(){var r=c(60,340),n=Math.random()<Math.min(.24,.05+5e-4*l);t.push({x:r,y:440,vx:(200-r)*c(.25,.6)+c(-30,30),vy:-c(560,700),r:n?17:22,bomb:n,col:u(k)})}function E(e){var a,u;if((h-=e)<=0){for(u=1+f(2+Math.floor(l/300)),a=0;a<u;a++)S();h=c(.8,1.5)/(1+l/500)}for(a=t.length-1;a>=0;a--)t[a].vy+=720*e,t[a].x+=t[a].vx*e,t[a].y+=t[a].vy*e,t[a].y>460&&t[a].vy>0&&(t[a].bomb||(i--,r.burst(t[a].x,410,o.coral,6)),t.splice(a,1));for(a=n.length-1;a>=0;a--)n[a].vy+=720*e,n[a].x+=n[a].vx*e,n[a].y+=n[a].vy*e,n[a].a+=n[a].va*e,n[a].y>460&&n.splice(a,1);if(i<=0)return A(e),
void r.over(l,'Too many got away. Score: '+l);A(e)}function A(f){var c;for(g(M,400,m),b>0&&(M.fillStyle='rgba(255,107,74,'+.4*b+')',M.fillRect(0,0,400,m),b-=2*f),t.forEach(function(r){r.bomb?(d(M,r.x,r.y,r.r,'#0b0518'),M.strokeStyle=o.dim,M.lineWidth=2,M.stroke(),v(M,r.x+6,r.y-14,r.x+12,r.y-22,o.orange,3),d(M,r.x+12,r.y-23,3,o.yellow)):(d(M,r.x,r.y,r.r,r.col),d(M,r.x-7,r.y-7,5,'rgba(255,255,255,.35)'),v(M,r.x,r.y-r.r,r.x+4,r.y-r.r-8,o.green,3))}),n.forEach(function(r){M.save(),M.translate(r.x,r.y),M.rotate(r.a),M.beginPath(),M.arc(0,0,22,r.s?0:Math.PI,r.s?Math.PI:e),M.closePath(),M.fillStyle=r.col,M.fill(),M.beginPath(),M.arc(0,0,15,r.s?0:Math.PI,r.s?Math.PI:e),M.closePath(),M.fillStyle=o.ink,M.fill(),M.restore()}),c=1;c<a.length;c++)v(M,a[c-1].x,a[c-1].y,a[c].x,a[c].y,'rgba(233,251,249,'+c/a.length+')',2+.6*c);r.fxStep(f),r.hud([['SCORE',y(l)],['MISSES',3-i+'/3'],['COMBO',w]])}r.pointer({down:function(r){p=!0,x=r,a=[r],w=0},move:function(e){p&&(!function(e,a){
var i,f,c,u=a.x-e.x,h=a.y-e.y,y=u*u+h*h||1;for(i=t.length-1;i>=0;i--)if(c=s((((f=t[i]).x-e.x)*u+(f.y-e.y)*h)/y,0,1),Math.hypot(f.x-(e.x+u*c),f.y-(e.y+h*c))<f.r){if(t.splice(i,1),f.bomb)return r.burst(f.x,f.y,o.coral,30),b=1,A(.016),void r.over(l,'You sliced a bomb! Score: '+l);l+=10,w++,r.burst(f.x,f.y,f.col,14),n.push({x:f.x,y:f.y,vx:f.vx-60,vy:.4*f.vy,a:0,va:-3,col:f.col,s:0},{x:f.x,y:f.y,vx:f.vx+60,vy:.4*f.vy,a:0,va:3,col:f.col,s:1})}}(x,e),x=e,a.push(e),a.length>9&&a.shift())},up:function(){p=!1,a=[],w>=3&&(l+=5*w,r.burst(200,200,o.yellow,20)),w=0}}),r.begin(function(){t=[],n=[],a=[],i=3,l=0,h=.5,p=!1,x=null,w=0,b=0,r.fx=[],r.frame(E)})}),w('towerStack',m,'Tower Stack',o.blue,'Time each tap to drop the sliding block squarely on the tower.','Tap / click / Space to drop the block',function(r){var t,n,e,a,i,l,c,u,h,s=320,y=480,d=22,v=r.canvas(s,y);function w(){var r=t[t.length-1];e=t.length%2?1:-1,n={x:e>0?.6*-r.w:s-.4*r.w,w:r.w,i:t.length},a=Math.min(400,140+6*t.length)}function b(){
