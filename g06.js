r+c(-9,9), tunnelW/2+14, H-tunnelW/2-14);
    tunnelW = Math.max(112, 240-0.02*dist);
    cave.push({t: nextCenter-tunnelW/2, b: nextCenter+tunnelW/2});
  }

  function speedFor(){ return Math.min(420, 150+0.02*dist); }

  function step(dt){
    var climbing = r.k[' '] || r.k.ArrowUp || r.k.w;
    var spd = speedFor();
    var idx, seg, gi, gt, oi, ot;

    heliVel = s(heliVel + (climbing?-760:520)*dt, -280, 300);
    heliY += heliVel*dt;
    dist += spd*dt;
    scrollAcc += spd*dt;
    timeAcc += dt;
    if(invuln>0) invuln -= dt;

    while(scrollAcc>=10){
      scrollAcc -= 10;
      cave.shift();
      pushSegment();
    }

    gates.forEach(function(gt){ gt.x -= spd*dt; if(gt.osc) gt.phase += dt*3; });
    gates = gates.filter(function(gt){ return gt.x > -40; });

    orbs.forEach(function(ob){ ob.x -= spd*dt; });
    orbs = orbs.filter(function(ob){ return ob.x > -20 && !ob.taken; });

    gateCd -= dt;
    if(gateCd<=0){
      seg = cave[cave.length-1];
      var oscillate = dist>500 && Math.random()<0.4;
      gates.push({x:410, y:c(seg.t+20, seg.b-80), w:22, h:60, scored:0, osc:oscillate, phase:0, baseY:0});
      gates[gates.length-1].baseY = gates[gates.length-1].y;
      gateCd = c(Math.max(150, 340-0.04*dist), Math.max(230, 460-0.04*dist));
    }

    orbCd -= dt;
    if(orbCd<=0){
      seg = cave[cave.length-1];
      var kind = (!shield && Math.random()<0.22) ? 'shield' : 'fuel';
      orbs.push({x:410, y:c(seg.t+16, seg.b-16), r:8, kind:kind, taken:0});
      orbCd = c(2.2, 4.2);
    }

    // oscillating gates bob vertically
    gates.forEach(function(gt){ if(gt.osc) gt.y = gt.baseY + Math.sin(gt.phase)*24; });

    idx = s(Math.floor((90+scrollAcc)/10), 0, cave.length-1);
    seg = cave[idx];

    if(invuln<=0 && (heliY-8 < seg.t || heliY+8 > seg.b)){
      if(shield>0){ shield=0; invuln=0.9; r.burst(heliX, heliY, o.blue, 20); }
      else { r.burst(heliX, heliY, o.orange, 30); draw(dt); r.over(Math.floor(dist/10)+bonus, 'Distance '+Math.floor(dist/10)+' m · Score '+(Math.floor(dist/10)+bonus)); return; }
    }

    for(gi=0; gi<gates.length; gi++){
      gt = gates[gi];
      if(!gt.scored && gt.x+gt.w < heliX-8){ gt.scored=1; bonus += 10; r.burst(gt.x, gt.y+gt.h/2, o.magenta, 6); }
      if(invuln<=0 && heliX+8 > gt.x && heliX-8 < gt.x+gt.w && heliY+8 > gt.y && heliY-8 < gt.y+gt.h){
        if(shield>0){ shield=0; invuln=0.9; r.burst(heliX, heliY, o.blue, 20); }
        else { r.burst(heliX, heliY, o.orange, 30); draw(dt); r.over(Math.floor(dist/10)+bonus, 'Distance '+Math.floor(dist/10)+' m · Score '+(Math.floor(dist/10)+bonus)); return; }
      }
    }

    for(oi=orbs.length-1; oi>=0; oi--){
      ot = orbs[oi];
      if(Math.hypot(ot.x-heliX, ot.y-heliY) < ot.r+10){
        ot.taken = 1;
        if(ot.kind==='shield'){ shield = 1; r.burst(ot.x, ot.y, o.blue, 14); }
        else { bonus += 15; r.burst(ot.x, ot.y, o.green, 10); }
      }
    }

    draw(dt);
  }

  function draw(dt){
    g(ctx, W, H);
    ctx.fillStyle = '#3a2a7a';
    ctx.beginPath(); ctx.moveTo(0,0);
    cave.forEach(function(seg,i){ ctx.lineTo(10*i-scrollAcc, seg.t); });
    ctx.lineTo(420,0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0,H);
    cave.forEach(function(seg,i){ ctx.lineTo(10*i-scrollAcc, seg.b); });
    ctx.lineTo(420,H); ctx.closePath(); ctx.fill();

    gates.forEach(function(gt){ p(ctx, gt.x, gt.y, gt.w, gt.h, 4, gt.scored?o.dim:o.magenta); });
    orbs.forEach(function(ob){
      var pulse = 1+0.15*Math.sin(timeAcc*6+ob.x);
      d(ctx, ob.x, ob.y, ob.r*pulse, ob.kind==='shield'?o.blue:o.green);
      d(ctx, ob.x, ob.y, ob.r*0.4, o.ink);
    });

    ctx.save();
    ctx.translate(heliX, heliY);
    if(invuln>0 && Math.floor(invuln*16)%2) ctx.globalAlpha = 0.35;
    ctx.rotate(heliVel/900);
    p(ctx, -14, -7, 24, 14, 6, shield>0?o.blue:o.orange);
    v(ctx, -14, 0, -22, -3, o.orange, 3);
    v(ctx, -6, -10, 8, -10, o.ink, 2);
    v(ctx, 1, -7, 1, -10, o.ink, 2);
    p(ctx, 0, -5, 8, 6, 2, o.ink);
    ctx.globalAlpha = 1;
    ctx.restore();

    r.fxStep(dt);
    r.hud([['SCORE', Math.floor(dist/10)+bonus], ['DIST', Math.floor(dist/10)+'m'], ['SHIELD', shield>0?'yes':'no']]);
  }

  r.pointer({down:function(){ r.k[' ']=1; }, up:function(){ delete r.k[' ']; }});
  r.pad([['CLIMB','ArrowUp']]);
  r.begin(function(){
    var i;
    cave = []; nextCenter = 180; tunnelW = 240; dist = 0; scrollAcc = 0; heliY = 180; heliVel = 0;
    gates = []; orbs = []; gateCd = 500; orbCd = 3; heliX = 90; shield = 0; invuln = 0; bonus = 0; timeAcc = 0;
    r.fx = [];
    for(i=0;i<46;i++) pushSegment();
    r.frame(step);
  });
}),w('skyHopper',b,'Sky Hopper',o.green,'Bounce from platform to platform, snag coins and dodge crumbling ledges and spikes.','Left/Right (or A/D) to steer · drag on mobile · avoid red spikes',function(r){
  var WW=320, HH=480, ctx=r.canvas(WW,HH);
  var player, platforms, coins, worldCursor, heightScore, dragTarget, comboMult, comboTimer, bonusScore, ended;

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
    draw(dt);
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
          if(plat.t===4){ r.burst(player.x, plat.y, o.coral, 26); endRun(dt); return; }
          if(plat.t===2){ plat.dead=1; continue; }
          player.vy = plat.sp ? -980 : -620;
          player.sq = 1;
          r.burst(player.x, plat.y, o.green, 5);
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
        r.burst(coin.x, coin.y, o.yellow, 8);
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
    draw(dt);
  }

  function draw(dt){
    var squash = 4*player.sq;
    g(ctx, WW, HH);
    platforms.forEach(function(plat){
      var color = plat.t===4 ? o.coral : plat.t===1 ? o.blue : plat.t===2 ? '#a5763b' : plat.t===3 ? o.violet : o.green;
      if(plat.t===3 && plat.life<0.6 && Math.floor(plat.life*10)%2) return;
      p(ctx, plat.x, plat.y, plat.w, 10, 5, color);
      if(plat.sp) p(ctx, plat.x+plat.w/2-6, plat.y-8, 12, 8, 2, o.coral);
      if(plat.t===2 && !plat.dead) v(ctx, plat.x+24, plat.y, plat.x+30, plat.y+10, o.bg, 2);
      if(plat.t===4){ v(ctx, plat.x+10, plat.y, plat.x+10, plat.y-6, o.ink, 2); v(ctx, plat.x+30, plat.y, plat.x+30, plat.y-6, o.ink, 2); v(ctx, plat.x+45, plat.y, plat.x+45, plat.y-6, o.ink, 2); }
    });
    coins.forEach(function(coin){ if(!coin.taken){ d(ctx, coin.x, coin.y, coin.r, o.yellow); d(ctx, coin.x, coin.y, coin.r-2.5, '#f4f1ff'); } });
    p(ctx, player.x-12-squash/2, player.y-14+squash, 24+squash, 26-squash, 10, o.yellow);
    d(ctx, player.x-4, player.y-5+squash, 3, o.bg);
    d(ctx, player.x+4, player.y-5+squash, 3, o.bg);
    r.fxStep(dt);
    r.hud([['HEIGHT', Math.floor(heightScore/10)+'m'], ['SCORE', Math.floor(heightScore/10)+bonusScore], ['COMBO', 'x'+comboMult]]);
  }

  r.pointer({down:function(pt){ dragTarget = pt.x; }, move:function(pt,evt,down){ if(down) dragTarget = pt.x; }, up:function(){ dragTarget = null; }});
  r.pad([['◀','ArrowLeft'],['▶','ArrowRight']]);

  r.begin(function(){
    player = {x:160, y:380, vx:0, vy:-300, sq:0};
    platforms = [{x:130, y:430, w:58, t:0, d:1, sp:false, dead:0, life:-1}];
    coins = [];
    worldCursor = 430; heightScore = 0; dragTarget = null; comboMult = 1; comboTimer = 0; bonusScore = 0; ended = false;
    r.fx = [];
    fillAhead();
    r.frame(step);
  });
}),w('pyramidHop',b,'Pyramid Hop',o.coral,'Hop across every cube of the pyramid to repaint it, chain combos, and dodge the chasers.','Arrows hop diagonally (Up = up-right, Left = up-left, Down = down-left, Right = down-right) · or Q E Z C · or tap a corner',function(r){
  var ctx = r.canvas(400,400);
  var grid, player, enemies, discs, lives, score, level, timeAcc, ballTimer, coilTimer, freezeTimer, targetColor, comboMult, comboTimer, livesLostThisLevel, nextExtraLife;

  function cubePos(row,col){ return {x: 200+50*(col-row/2), y: 70+40*row}; }
  function validCell(row,col){ return row>=0 && row<6 && col>=0 && col<=row; }

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
    r.burst(animPos(player).x, animPos(player).y-10, o.coral, 24);
  }

  function animPos(ent){
    var base = cubePos(ent.r, ent.c), target, frac;
    if(ent.ride){
      target = cubePos(0,0);
      frac = 1-ent.ride;
      return {x: base.x+(target.x-base.x)*frac, y: base.y+(target.y-base.y)*frac - 30*Math.sin(frac*Math.PI)};
    }
    if(ent.hop){
      target = cubePos(ent.tr, ent.tc);
      return {x: base.x+(target.x-base.x)*ent.t, y: base.y+(target.y-base.y)*ent.t - 16*Math.sin(ent.t*Math.PI)};
    }
    return base;
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
        if(lives<=0){ draw(dt); r.over(score, 'Level '+level+' · Score: '+score); return; }
        resetRound();
      }
      draw(dt);
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
            r.burst(animPos(en).x, animPos(en).y, o.violet, 20);
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
          r.burst(animPos(en).x, animPos(en).y, o.green, 14);
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

    draw(dt);
  }

  function draw(dt){
    var row, col, pos, shadeColors = ['#3a2a7a', o.yellow, o.teal];
    g(ctx, 400, 400);
    for(row=0; row<6; row++){
      for(col=0; col<=row; col++){
        pos = cubePos(row,col);
        ctx.beginPath(); ctx.moveTo(pos.x-25,pos.y); ctx.lineTo(pos.x,pos.y+12.5); ctx.lineTo(pos.x,pos.y+38); ctx.lineTo(pos.x-25,pos.y+25.5); ctx.closePath();
        ctx.fillStyle = '#241C47'; ctx.fill();
        ctx.beginPath(); ctx.moveTo(pos.x+25,pos.y); ctx.lineTo(pos.x,pos.y+12.5); ctx.lineTo(pos.x,pos.y+38); ctx.lineTo(pos.x+25,pos.y+25.5); ctx.closePath();
        ctx.fillStyle = '#1b1538'; ctx.fill();
        ctx.beginPath(); ctx.moveTo(pos.x,pos.y-12.5); ctx.lineTo(pos.x+25,pos.y); ctx.lineTo(pos.x,pos.y+12.5); ctx.lineTo(pos.x-25,pos.y); ctx.closePath();
        ctx.fillStyle = shadeColors[grid[row][col]]; ctx.fill();
        ctx.strokeStyle = o.bg; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    discs.forEach(function(dsc){
      if(!dsc.on) return;
      pos = cubePos(dsc.r, dsc.c);
      ctx.beginPath(); ctx.ellipse(pos.x, pos.y, 16, 8, 0, 0, e); ctx.fillStyle = Math.floor(4*timeAcc)%2 ? o.magenta : o.blue; ctx.fill();
    });
    enemies.forEach(function(en){
      if(en.wait>0) return;
      var pos2 = animPos(en);
      var col2 = en.kind==='slick' ? o.green : en.kind==='ball' ? o.coral : en.kind==='fastball' ? o.orange : o.violet;
      d(ctx, pos2.x, pos2.y-10, en.kind==='snake' ? 9 : 8, col2);
      if(en.kind==='snake'){ d(ctx, pos2.x, pos2.y+2, 6, col2); d(ctx, pos2.x-3, pos2.y-12, 2.4, o.ink); d(ctx, pos2.x+3, pos2.y-12, 2.4, o.ink); }
    });
    if(freezeTimer<=0 || Math.floor(8*freezeTimer)%2){
      var ppos = animPos(player);
      d(ctx, ppos.x, ppos.y-11, 10, o.orange);
      d(ctx, ppos.x-3.5, ppos.y-14, 3, o.ink);
      d(ctx, ppos.x+3.5, ppos.y-14, 3, o.ink);
      p(ctx, ppos.x-4, ppos.y-9, 8, 5, 2, o.bg);
    }
    r.fxStep(dt);
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

  r.begin(function(){
    lives = 3; score = 0; level = 1; timeAcc = 0; comboMult = 1; comboTimer = 0; nextExtraLife = 3000;
    r.fx = [];
    newLevel();
    resetRound();
    r.frame(step);
  });
}),
w('dirtDigger',b,'Dirt Digger',o.orange,'Tunnel through the dirt, inflate critters and drop rocks on their heads for chained bonuses.','Arrows / WASD to dig · tap Space to pump the critter in front of you',function(r){
  var CELL=25, COLS=16, ROWS=15, ctx=r.canvas(400,375);
  var DIRS=[[0,-1],[-1,0],[0,1],[1,0]];
  var grid, player, enemies, rocks, lives, score, level, startFreeze, deathFreeze, timeAcc, comboMult, comboTimer, nextExtraLife;

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
    r.burst(player.c*CELL+12, player.r*CELL+12, o.orange, 26);
  }

  function step(dt){
    var moveX, moveY, targetRow, targetCol, ri, rk, en, dirOptions, chosen, dist1, dist2, ei;
    timeAcc += dt;
    comboTimer -= dt;
    if(comboTimer<=0) comboMult = 1;

    if(deathFreeze>0){
      deathFreeze -= dt;
      if(deathFreeze<=0){
        if(lives<=0){ draw(dt); r.over(score, 'Level '+level+' · Score: '+score); return; }
        player = {r:0, c:8, d:[0,1], rx:200, ry:0, mt:0, pump:0, tgt:null};
        grid[1][8] = 0;
        enemies.forEach(function(en){
          if(Math.abs(en.r-1)+Math.abs(en.c-8)<4){ en.r = Math.min(14, en.r+4); grid[en.r][en.c] = 0; }
        });
        startFreeze = 1;
      }
      draw(dt);
      return;
    }

    if(startFreeze>0){ startFreeze -= dt; draw(dt); return; }

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
            r.burst(en.c*CELL+12, en.r*CELL+12, o.yellow, 20);
            return false;
          }
          return true;
        });
      }
    }
    rocks = rocks.filter(function(rk){
      if(rk.done){ r.burst(rk.c*CELL+12, rk.r*CELL+12, o.dim, 8); return false; }
      return true;
    });

    for(ei=0; ei<enemies.length; ei++){
      en = enemies[ei];
      en.idle += dt;
      i