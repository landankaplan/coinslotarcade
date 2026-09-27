ord was '+word.toUpperCase();r.later(function(){r.over(score,'Boom. '+defused+' word'+(1===defused?'':'s')+' defused. Score: '+score)},1500)}
function revealAndCheck(ch){guessed[ch]=1;if(isComplete()){ended=true;score+=10*word.length+10*(6-wrongCount)+Math.floor(timeLeft);defused++;message='Defused! '+word.toUpperCase();r.later(newWord,1300)}}
function guessLetter(ch){if(ended||guessed[ch]||1!==ch.length||ch<'a'||ch>'z')return;if(word.indexOf(ch)>-1){r.burst(60+280*Math.random(),215,o.green,6);feedback=ch.toUpperCase()+' is a '+letterNote(ch)+' letter — in the word!';revealAndCheck(ch)}else{guessed[ch]=1;wrongCount++;r.burst(200,100,o.coral,8);feedback=ch.toUpperCase()+' is a '+letterNote(ch)+' letter — not in the word.';if(wrongCount>=6)explode()}}
function hint(){if(ended||hintsUsed>=2)return;var unrevealed=[];for(var i=0;i<word.length;i++){var ch=word.charAt(i);if(!guessed[ch]&&unrevealed.indexOf(ch)<0)unrevealed.push(ch)}if(!unrevealed.length)return;var pick=u(unrevealed);hintsUsed++;wrongCount++;timeLeft=Math.max(4,timeLeft-8);feedback='Hint: revealed "'+pick.toUpperCase()+'"';r.burst(200,215,o.violet,10);revealAndCheck(pick);if(!ended&&wrongCount>=6)explode()}
function render(dt){
if(!ended){if((timeLeft-=dt)<=0){timeLeft=0;explode()}}
if(boom>0)boom-=.5*dt;
g(ctx,400,470,o.bg);
x(ctx,TIER_NAMES[tier]+' · '+Math.max(0,Math.ceil(timeLeft))+'s',320,16,12,timeLeft<10?o.coral:o.dim);
p(ctx,25,8,80,22,8,hintsUsed<2&&!ended?o.violet:o.grid);
x(ctx,'HINT '+(2-hintsUsed),65,20,11,hintsUsed<2&&!ended?o.bg:o.dim);
var dangerRatio=Math.max(wrongCount/6,1-timeLeft/totalTime);
if(wrongCount<6&&boom<=0){
d(ctx,130,100,44,'#0b0518');
ctx.strokeStyle=o.dim;ctx.lineWidth=3;ctx.stroke();
d(ctx,116,86,8,'rgba(255,255,255,.15)');
p(ctx,120,48,20,12,3,o.dim);
var fusePos=Math.min(1,dangerRatio);
ctx.beginPath();ctx.moveTo(130,48);ctx.quadraticCurveTo(190,20,250-120*fusePos,40+12*fusePos);ctx.strokeStyle=o.orange;ctx.lineWidth=4;ctx.stroke();
ctx.beginPath();ctx.moveTo(250-120*fusePos,40+12*fusePos);ctx.quadraticCurveTo(255,40,260,44);ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=4;ctx.stroke();
d(ctx,250-120*fusePos,40+12*fusePos,7+2*Math.sin(performance.now()/60),o.yellow);
d(ctx,250-120*fusePos,40+12*fusePos,3,o.coral);
}else{
for(var u2=0;u2<10;u2++){ctx.strokeStyle=u2%2?o.yellow:o.coral;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(130,100);ctx.lineTo(130+Math.cos(.628*u2)*(70+70*(1-Math.max(0,boom))),100+Math.sin(.628*u2)*(70+70*(1-Math.max(0,boom))));ctx.stroke()}
}
x(ctx,'STRIKES '+'▮'.repeat(6-wrongCount)+'▯'.repeat(wrongCount),320,100,13,o.dim);
var slotW=Math.min(38,360/word.length);
for(var i=0;i<word.length;i++){var midX=200-word.length*slotW/2+i*slotW+slotW/2;v(ctx,midX-.35*slotW,236,midX+.35*slotW,236,o.dim,3);if(guessed[word.charAt(i)]||boom>0&&wrongCount>=6)x(ctx,word.charAt(i).toUpperCase(),midX,220,26,guessed[word.charAt(i)]?o.ink:o.coral)}
x(ctx,feedback,200,254,12,o.violet);
x(ctx,message,200,272,15,o.yellow);
for(var row=0;row<3;row++)for(var col=0;col<rows[row].length;col++){var kx=20+18*row+37*col,ky=300+46*row,letter=rows[row].charAt(col);p(ctx,kx+1,ky,34,40,7,guessed[letter]?word.indexOf(letter)>-1?o.green:'rgba(255,107,74,.35)':o.grid);x(ctx,letter.toUpperCase(),kx+18,ky+21,18,guessed[letter]?o.bg:o.ink)}
r.fxStep(dt);
r.hud([['SCORE',y(score)],['DEFUSED',defused]]);
}
r.press=function(k){if(' '===k)hint();else guessLetter(k)};
r.pointer({down:function(pt){
if(pt.x>25&&pt.x<105&&pt.y>8&&pt.y<30)return hint();
for(var row=0;row<3;row++)for(var col=0;col<rows[row].length;col++){var kx=20+18*row+37*col+18,ky=300+46*row+20;if(Math.abs(pt.x-kx)<18&&Math.abs(pt.y-ky)<21)guessLetter(rows[row].charAt(col))}
}});
r.pad([['Hint','Space']]);
r.begin(function(){score=0;defused=0;newWord();r.fx=[];r.frame(render)});
}),w('wordHunt',S,'Word Hunt',o.teal,'Find every hidden word in the letter grid — forwards, backwards, or on the diagonal — before time runs out. Categories get harder each grid.','Drag from the first to the last letter · or Space to anchor, arrows to stretch, Space to confirm · chain finds quickly for a speed bonus',function(t){
var GRID=10,CELL=36,GRID_TOP=120,CANVAS_W=400,CANVAS_H=500,ctx=t.canvas(CANVAS_W,CANVAS_H);
var DIRS=[[1,0],[0,1],[1,1],[-1,1],[-1,0],[0,-1],[-1,-1],[1,-1]];
var cycleColors=[o.coral,o.yellow,o.green,o.blue,o.violet,o.magenta,o.orange,o.teal];
var CATEGORIES={
ANIMALS:['tiger','zebra','otter','rabbit','falcon','beaver','dolphin','giraffe','panther','turtle'],
SPACE:['comet','planet','rocket','galaxy','meteor','nebula','orbit','asteroid','eclipse','cosmos'],
OCEAN:['coral','shark','whale','anchor','harbor','plankton','lagoon','tide','voyage','current'],
TECH:['laptop','signal','sensor','router','pixel','server','cursor','circuit','battery','network']
};
var CATEGORY_NAMES=['ANIMALS','SPACE','OCEAN','TECH','MISC'];
var cells,words,found,cellColor,timeLeft,dragStart,dragEnd,dragging,wrongFlash,flashCells,keyAnchor,keyCursor,keyboardMode,message,gridCount,category,score,comboTimer;
function newGrid(){
var placed;
do{
cells=[];
for(var idx=0;idx<100;idx++)cells.push('');
category=CATEGORY_NAMES[gridCount%CATEGORY_NAMES.length];
var pool='MISC'===category?R.filter(function(wd){return wd.length>=4&&wd.length<=8}):CATEGORIES[category];
var picks=h(pool.slice()).slice(0,6);
placed=[];
picks.forEach(function(wd){
for(var attempt=0;attempt<200;attempt++){
var dir=u(DIRS),startCol=f(GRID),startRow=f(GRID),ok=true,idxs=[];
for(var v2=0;v2<wd.length;v2++){
var col=startCol+dir[0]*v2,row=startRow+dir[1]*v2;
if(col<0||col>=GRID||row<0||row>=GRID){ok=false;break}
var g2=row*GRID+col;
if(cells[g2]&&cells[g2]!==wd.charAt(v2)){ok=false;break}
idxs.push(g2);
}
if(ok){idxs.forEach(function(g3,v3){cells[g3]=wd.charAt(v3)});placed.push(wd);break}
}
});
}while(placed.length<5);
words=placed;
for(var idx2=0;idx2<100;idx2++)if(!cells[idx2])cells[idx2]=String.fromCharCode(97+f(26));
found={};cellColor={};timeLeft=Math.max(60,100-4*gridCount);dragStart=null;dragEnd=null;dragging=false;wrongFlash=0;flashCells=[];keyAnchor=null;message='';comboTimer=0;
}
function cellsAlong(startPt,endPt){var result=[],dx=Math.sign(endPt.x-startPt.x),dy=Math.sign(endPt.y-startPt.y),steps=Math.max(Math.abs(endPt.x-startPt.x),Math.abs(endPt.y-startPt.y));for(var n2=0;n2<=steps;n2++)result.push((startPt.y+dy*n2)*GRID+startPt.x+dx*n2);return result}
function snapLine(startPt,endPt){var dx=endPt.x-startPt.x,dy=endPt.y-startPt.y,adx=Math.abs(dx),ady=Math.abs(dy),mag;if(adx>2*ady)dy=0;else if(ady>2*adx)dx=0;else{mag=Math.max(adx,ady);dx=Math.sign(dx)*mag;dy=Math.sign(dy)*mag}while(startPt.x+dx<0||startPt.x+dx>=GRID||startPt.y+dy<0||startPt.y+dy>=GRID){dx-=Math.sign(dx);dy-=Math.sign(dy)}return{x:startPt.x+dx,y:startPt.y+dy}}
function pointToCell(pt){var col=Math.floor((pt.x-20)/CELL),row=Math.floor((pt.y-GRID_TOP)/CELL);return col>=0&&row>=0&&col<GRID&&row<GRID?{x:col,y:row}:null}
function trySelection(startPt,endPt){
var idxs=cellsAlong(startPt,endPt),forward=idxs.map(function(g4){return cells[g4]}).join(''),reversed=forward.split('').reverse().join(''),match=words.filter(function(wd){return!found[wd]&&(wd===forward||wd===reversed)})[0];
if(!match||idxs.length<2){wrongFlash=.3;flashCells=idxs;t.burst(20+(endPt.x+.5)*CELL,GRID_TOP+(endPt.y+.5)*CELL,o.coral,8);return}
found[match]=1;
var col2=cycleColors[Object.keys(found).length%cycleColors.length];
idxs.forEach(function(g5){cellColor[g5]=col2});
var speedBonus=comboTimer>0?20:0;
score+=15+3*match.length+speedBonus;
comboTimer=6;
t.burst(20+(endPt.x+.5)*CELL,GRID_TOP+(endPt.y+.5)*CELL,col2,14+speedBonus/2);
if(words.every(function(wd){return found[wd]})){
score+=50+Math.floor(timeLeft);
gridCount++;
message='Grid cleared!';
dragging=false;dragStart=null;
t.burst(200,250,o.yellow,40);
t.later(newGrid,1300);
}
}
function tick(dt){
if(comboTimer>0)comboTimer-=dt;
if((timeLeft-=dt)<=0){draw(dt);t.over(score,'Time is up with '+words.filter(function(wd){return!found[wd]}).length+' words still hidden. Score: '+score);return}
draw(dt);
}
function draw(dt){
if(wrongFlash>0)wrongFlash-=dt;
g(ctx,CANVAS_W,CANVAS_H,o.bg);
x(ctx,'GRID '+(gridCount+1)+' · '+category+' · '+Math.max(0,Math.ceil(timeLeft))+'s',200,20,15,timeLeft<15?o.coral:o.ink);
words.forEach(function(wd,idx3){x(ctx,wd.toUpperCase(),20+idx3%3*125,52+26*Math.floor(idx3/3),14,found[wd]?o.dim:o.ink,'left');if(found[wd])v(ctx,20+idx3%3*125,52+26*Math.floor(idx3/3),20+idx3%3*125+11*wd.length,52+26*Math.floor(idx3/3),o.green,2)});
var liveStart=dragStart||keyAnchor,liveEnd=dragStart?dragEnd:keyAnchor?snapLine(keyAnchor,keyCursor):null,liveOverlay={};
if(liveStart&&liveEnd)cellsAlong(liveStart,liveEnd).forEach(function(g6){liveOverlay[g6]=1});
var flashOverlay={};
if(wrongFlash>0)flashCells.forEach(function(g7){flashOverlay[g7]=1});
for(var cellIdx=0;cellIdx<100;cellIdx++){
var cx=20+cellIdx%GRID*CELL,cy=GRID_TOP+Math.floor(cellIdx/GRID)*CELL;
var bg2=flashOverlay[cellIdx]?o.coral:liveOverlay[cellIdx]?o.dim:cellColor[cellIdx]?cellColor[cellIdx]:o.grid;
p(ctx,cx+1,cy+1,34,34,8,bg2);
x(ctx,cells[cellIdx].toUpperCase(),cx+18,cy+19,19,cellColor[cellIdx]?o.bg:o.ink);
}
if(keyboardMode){ctx.strokeStyle=o.ink;ctx.lineWidth=2;ctx.strokeRect(20+keyCursor.x*CELL+2,GRID_TOP+keyCursor.y*CELL+2,32,32)}
x(ctx,message,200,106,14,o.yellow);
if(comboTimer>0)x(ctx,'Chain! next find +20',200,470,11,o.teal);
t.fxStep(dt);
t.hud([['SCORE',y(score)],['FOUND',Object.keys(found).length+'/'+words.length]]);
}
t.pointer({
down:function(pt){var cell=pointToCell(pt);keyboardMode=false;if(cell){dragStart=cell;dragEnd=cell;dragging=true}},
move:function(pt){if(dragging&&dragStart){var cell=pointToCell(pt);if(cell)dragEnd=snapLine(dragStart,cell)}},
up:function(){dragging&&dragStart&&dragEnd&&trySelection(dragStart,dragEnd);dragging=false;dragStart=null;dragEnd=null}
});
t.press=function(k){
keyboardMode=true;
if('ArrowLeft'===k||'a'===k)keyCursor.x=Math.max(0,keyCursor.x-1);
else if('ArrowRight'===k||'d'===k)keyCursor.x=Math.min(GRID-1,keyCursor.x+1);
else if('ArrowUp'===k||'w'===k)keyCursor.y=Math.max(0,keyCursor.y-1);
else if('ArrowDown'===k||'s'===k)keyCursor.y=Math.min(GRID-1,keyCursor.y+1);
else if(' '===k||'Enter'===k){if(keyAnchor){trySelection(keyAnchor,snapLine(keyAnchor,keyCursor));keyAnchor=null}else keyAnchor={x:keyCursor.x,y:keyCursor.y}}
else if('Escape'===k)keyAnchor=null;
};
t.pad([['◀','ArrowLeft'],['▲','ArrowUp'],['▼','ArrowDown'],['▶','ArrowRight'],['Mark','Space']]);
t.begin(function(){gridCount=0;score=0;keyCursor={x:4,y:4};keyboardMode=false;newGrid();t.fx=[];t.frame(tick)});
}),w('laneLeaper',b,'Lane Leaper',o.green,'Hop across traffic and a sinking river — chain pad-fills for a rising streak bonus.','Arrows / WASD to hop · swipe on mobile',function(r){
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