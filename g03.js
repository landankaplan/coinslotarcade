clockBonus,roll=Math.random(),idx;
  idx=heff<25?0:heff<60?(roll<.7?0:roll<.9?1:2):(roll<.45?0:roll<.7?1:roll<.88?2:3);
  var base=ENEMY_BASE[idx];
  var en={hp:base.hp*dp.hpMul,sp:base.sp*dp.spMul,col:base.col,r:base.r,lane:pickSpawnLane(),x:392,slow:0};
  en.hp0=en.hp;
  enemies.push(en);
}
function placeOrDig(lane,col){
  var type=TYPES[selType];
  if(selType!==4){
    if(grid[lane][col]||energy<type.cost){if(energy<type.cost)flash=1;return;}
    energy-=type.cost;
    grid[lane][col]={t:selType,hp:type.hp,cd:selType===0?5:0.6};
  }else if(grid[lane][col]){
    a.burst(CX+col*CELL+20,CY+lane*CELL+20,o.dim,8);
    grid[lane][col]=null;
  }
}
function tick(dt){
  var i,l,col,d,u,x2,y2,p2;
  clock+=dt;
  score=Math.floor((10*defeated+clock)*(1+0.35*diff));
  spawnT-=dt;
  if(spawnT<=0){
    spawnEnemy();
    if(clock>90&&Math.random()<0.5)spawnEnemy();
    spawnT=Math.max(1.6,7-0.04*clock)*c(0.7,1.2)*DIFF[diff].spawnMul;
  }
  orbT-=dt;
  if(orbT<=0){orbs.push({x:c(40,360),y:78,ty:c(150,300),v:25,life:9,sky:true});orbT=9;}
  for(l=0;l<LANES;l++)for(col=0;col<COLS;col++){
    d=grid[l][col];
    if(!d)continue;
    d.cd-=dt;
    if(d.t===0&&d.cd<=0){d.cd=8;orbs.push({x:CX+col*CELL+20,y:CY+l*CELL+6,ty:CY+l*CELL+6,v:25,life:8});}
    if((d.t===1||d.t===3)&&d.cd<=0&&enemies.some(function(e){return e.lane===l&&e.x>CX+col*CELL+10&&e.x<400;})){
      d.cd=d.t===1?1.3:1.7;
      shots.push({x:CX+col*CELL+CELL-8,lane:l,ice:d.t===3});
    }
  }
  for(u=shots.length-1;u>=0;u--){
    var sh=shots[u];sh.x+=250*dt;
    if(sh.x>410){shots.splice(u,1);continue;}
    for(y2=0;y2<enemies.length;y2++){
      p2=enemies[y2];
      if(p2.lane===sh.lane&&Math.abs(p2.x-sh.x)<p2.r+4){
        p2.hp-=sh.ice?1.4:2.4;
        if(sh.ice)p2.slow=2.2;
        a.burst(sh.x,CY+sh.lane*CELL+20,sh.ice?o.blue:o.green,3);
        shots.splice(u,1);break;
      }
    }
  }
  for(u=enemies.length-1;u>=0;u--){
    p2=enemies[u];
    if(p2.hp<=0){defeated++;a.burst(p2.x,CY+p2.lane*CELL+20,p2.col,14);enemies.splice(u,1);continue;}
    var blockerCol=Math.floor((p2.x-8-CX)/CELL),blocker=null;
    if(blockerCol>=0&&blockerCol<COLS&&grid[p2.lane][blockerCol])blocker=grid[p2.lane][blockerCol];
    if(p2.slow>0)p2.slow-=dt;
    if(blocker){
      blocker.hp-=9*dt;
      if(blocker.hp<=0)grid[p2.lane][blockerCol]=null;
    }else{
      p2.x-=p2.sp*(p2.slow>0?0.5:1)*dt;
    }
    if(p2.x<14){
      flash=1;render(dt);
      a.over(score,'The horde broke through. '+defeated+' defeated. Score: '+score);
      return;
    }
  }
  for(u=orbs.length-1;u>=0;u--){
    var ob=orbs[u];ob.life-=dt;
    if(ob.sky&&ob.y<ob.ty)ob.y+=40*dt;
    if(ob.life<=0)orbs.splice(u,1);
  }
  render(dt);
}
function render(dt){
  g(ctx,400,320);
  if(flash>0){ctx.fillStyle='rgba(255,107,74,'+(0.25*flash)+')';ctx.fillRect(0,0,400,320);flash-=2*dt;}
  var i,lx;
  for(i=0;i<5;i++){
    var type=TYPES[i];
    lx=12+76*i;
    p(ctx,lx,12,70,56,10,selType===i?'rgba(255,255,255,.16)':'rgba(255,255,255,.05)');
    if(selType===i){ctx.strokeStyle=type.col;ctx.lineWidth=2;r.L(ctx,lx,12,70,56,10);ctx.stroke();}
    d(ctx,lx+35,34,11,type.col);
    x(ctx,type.n+(type.cost?' '+type.cost:''),lx+35,58,11,energy>=type.cost?o.ink:o.dim);
    x(ctx,String(i+1),lx+8,22,10,o.dim);
  }
  for(var l=0;l<LANES;l++)for(var col=0;col<COLS;col++)p(ctx,CX+col*CELL+1,CY+l*CELL+1,38,38,4,(l+col)%2?'rgba(61,220,151,.10)':'rgba(61,220,151,.05)');
  p(ctx,4,CY,14,200,4,'rgba(255,209,102,.35)');
  for(l=0;l<LANES;l++)for(col=0;col<COLS;col++){
    var dd=grid[l][col];
    if(!dd)continue;
    lx=CX+col*CELL+20;var ly=CY+l*CELL+20;
    if(dd.t===0){d(ctx,lx,ly,12,o.yellow);d(ctx,lx,ly,5,o.orange);}
    else if(dd.t===1){d(ctx,lx-3,ly,12,o.green);p(ctx,lx+4,ly-4,13,8,3,o.green);}
    else if(dd.t===2)p(ctx,lx-13,ly-16,26,32,6,o.orange);
    else{C(ctx,lx,ly,14,6,0);ctx.fillStyle=o.blue;ctx.fill();p(ctx,lx+4,ly-4,12,8,3,o.ink);}
    p(ctx,lx-12,ly+16,24*Math.max(0,dd.hp/TYPES[dd.t].hp),3,1.5,o.ink);
  }
  for(i=0;i<shots.length;i++)d(ctx,shots[i].x,CY+shots[i].lane*CELL+20-2,4,shots[i].ice?o.blue:o.green);
  for(i=0;i<enemies.length;i++){
    var en=enemies[i],ey=CY+en.lane*CELL+20;
    d(ctx,en.x,ey,en.r,en.slow>0?o.blue:en.col);
    d(ctx,en.x-4,ey-3,2.5,o.bg);d(ctx,en.x+3,ey-3,2.5,o.bg);
    p(ctx,en.x-10,ey-en.r-6,20*Math.max(0,en.hp/en.hp0),3,1.5,o.coral);
  }
  for(i=0;i<orbs.length;i++){d(ctx,orbs[i].x,orbs[i].y,14,'rgba(255,209,102,.3)');d(ctx,orbs[i].x,orbs[i].y,9,o.yellow);}
  if(keyNav){ctx.strokeStyle=o.ink;ctx.lineWidth=2;r.L(ctx,CX+cursor.q*CELL+2,CY+cursor.r*CELL+2,36,36,5);ctx.stroke();}
  x(ctx,'ENERGY '+Math.floor(energy),60,86,13,o.yellow);
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['DEFEATED',defeated]]);
}
function startGame(){
  grid=[];for(var l=0;l<LANES;l++){grid.push([]);for(var col=0;col<COLS;col++)grid[l].push(null);}
  enemies=[];shots=[];orbs=[];energy=100;selType=1;clock=0;spawnT=6;orbT=7;defeated=0;score=0;
  cursor={r:2,q:1};keyNav=false;flash=0;
  a.fx=[];
  a.frame(tick);
}
a.pointer({down:function(pt){
  keyNav=false;
  for(var i=orbs.length-1;i>=0;i--){
    if(Math.hypot(pt.x-orbs[i].x,pt.y-orbs[i].y)<20){energy+=orbs[i].v;a.burst(orbs[i].x,orbs[i].y,o.yellow,8);orbs.splice(i,1);return;}
  }
  if(pt.y<78){var b2=Math.floor((pt.x-12)/76);if(b2>=0&&b2<5)selType=b2;return;}
  var col=Math.floor((pt.x-CX)/CELL),lane=Math.floor((pt.y-CY)/CELL);
  if(col>=0&&lane>=0&&col<COLS&&lane<LANES)placeOrDig(lane,col);
}});
a.press=function(key){
  keyNav=true;
  if(key>='1'&&key<='5'&&key.length===1)selType=+key-1;
  else if(key==='ArrowLeft'||key==='a')cursor.q=Math.max(0,cursor.q-1);
  else if(key==='ArrowRight'||key==='d')cursor.q=Math.min(COLS-1,cursor.q+1);
  else if(key==='ArrowUp'||key==='w')cursor.r=Math.max(0,cursor.r-1);
  else if(key==='ArrowDown'||key==='s')cursor.r=Math.min(LANES-1,cursor.r+1);
  else if(key===' '||key==='Enter')placeOrDig(cursor.r,cursor.q);
};
a.opt('Difficulty',['Easy','Normal','Hard'],diff,function(i){diff=i;startGame();});
a.begin(startGame);
})
;var E=['','A','2','3','4','5','6','7','8','9','10','J','Q','K'],A=['♠','♥','♦','♣'],R='planet rocket bridge castle forest garden island jungle market meadow mirror monkey orange pencil pepper pillow puzzle rabbit ribbon saddle silver spider summer temple thunder tunnel turtle valley violin window winter wizard yellow zipper anchor breeze candle canyon carpet cherry circus clover copper cotton dragon engine falcon finger flower guitar hammer helmet hunter jacket kitten ladder lantern magnet marble muffin napkin needle orbit paddle parade pirate pocket potato pretzel quartz rainbow shadow signal sketch spirit statue sticker tablet ticket tomato trophy velvet walnut whistle wrench yogurt arcade battery blanket bonfire cabinet compass crystal diamond dolphin eleven feather fortune gadget glacier harvest kingdom machine mustard network octopus painter pumpkin rooster scooter sunrise textile unicorn village whisper harbor pebble comet cactus beacon cobweb jigsaw kettle lizard mosaic nectar oyster parrot quiver radish sapphire tangle umbrella voyage walrus yonder zenith bubble castle marbles'.split(' ')
;function T(){var r,t,n=[];for(r=0;r<4;r++)for(t=1;t<=13;t++)n.push({r:t,s:r});return h(n)}function L(r,t,n,e,a,i,l){var f;if(!l)return p(r,t,n,e,a,6,o.violet),p(r,t+4,n+4,e-8,a-8,4,o.grid),void d(r,t+e/2,n+a/2,.2*Math.min(e,a),o.violet);f=1===i.s||2===i.s,p(r,t,n,e,a,6,'#f4f1ff'),x(r,E[i.r],t+8,n+12,Math.round(.24*a),f?'#d8434a':'#171233','left'),x(r,A[i.s],t+e/2,n+.62*a,Math.round(.42*a),f?'#d8434a':'#171233')}function C(r,t,n,o,a,i,l){var f,c,u;for(r.beginPath(),f=0;f<(l?2*a:a);f++)c=i+f*e/(l?2*a:a),u=l&&f%2?o*l:o,f?r.lineTo(t+Math.cos(c)*u,n+Math.sin(c)*u):r.moveTo(t+Math.cos(c)*u,n+Math.sin(c)*u);r.closePath()}w('golfCards',S,'Fairway Cards',o.green,'Play all nine holes of Golf: clear each layout by stacking cards one rank above or below the pile. Lowest total strokes wins the round.','Click a top card to play it onto the pile, click the stock to turn a card · arrows + Space work too · H for a hint, U to undo',function(t){
var ctx=t.canvas(400,470),cw=46,ch=64;
var cols,stock,waste,runLen,hole,score,strokes,msg,holeOver,hist,selCol,keyNav,hintCol,hintT;
function golfValue(rank){return 13===rank?0:1===rank?1:rank>=10?10:rank}
function canPlay(card){return waste.length&&1===Math.abs(card.r-waste[waste.length-1].r)}
function snapshot(){hist.push({cols:cols.map(function(cc){return cc.slice()}),waste:waste.slice(),stock:stock.slice(),runLen:runLen,score:score,msg:msg});if(hist.length>40)hist.shift()}
function undo(){if(holeOver||!hist.length)return;var snap=hist.pop();cols=snap.cols;waste=snap.waste;stock=snap.stock;runLen=snap.runLen;score=snap.score;msg=snap.msg}
function dealHole(){var deck=T();cols=[];for(var i=0;i<7;i++)cols.push(deck.splice(0,5));waste=[deck.pop()];stock=deck;runLen=0;msg='';holeOver=false;hist=[];hintCol=-1;hintT=0}
function anyPlay(){for(var i=0;i<7;i++){var col=cols[i];if(col.length&&canPlay(col[col.length-1]))return true}return false}
function endHole(cleared){holeOver=true;var holeStrokes=0;cols.forEach(function(colArr){colArr.forEach(function(card){holeStrokes+=golfValue(card.r)})});strokes+=holeStrokes;if(cleared){score+=100+10*stock.length;msg='Hole cleared! +'+holeStrokes+' strokes';t.burst(200,200,o.green,40)}else{msg='No plays left · +'+holeStrokes+' strokes';t.burst(200,200,o.coral,16)}
t.later(function(){if(hole>=9)t.over(score,hole+' holes complete — '+strokes+' total strokes. Arcade score '+score,'Round Complete');else{hole++;dealHole()}},1300)}
function checkEnd(){if(!cols.some(function(colArr){return colArr.length}))return void endHole(true);if(!stock.length&&!anyPlay())endHole(false)}
function playCol(i){if(holeOver)return;var col=cols[i];if(!col.length)return;var card=col[col.length-1];if(!canPlay(card))return;snapshot();col.pop();waste.push(card);score+=10+5*runLen;runLen++;t.burst(20+54*i+23,120,o.green,8);checkEnd()}
function drawStock(){if(holeOver||!stock.length)return;snapshot();waste.push(stock.pop());runLen=0;checkEnd()}
function giveHint(){if(holeOver)return;for(var i=0;i<7;i++){var col=cols[i];if(col.length&&canPlay(col[col.length-1])){hintCol=i;hintT=1.1;return}}if(stock.length){msg='Draw the stock';t.later(function(){if(!holeOver)msg=''},900)}}
function render(dt){
if(hintT>0)hintT-=dt;
g(ctx,400,470,o.bg);
x(ctx,'HOLE '+hole+'/9',20,16,13,o.dim,'left');
x(ctx,'STROKES '+strokes,380,16,13,o.dim,'right');
for(var b=0;b<7;b++){
var col=cols[b];
for(var m=0;m<col.length;m++)L(ctx,20+54*b,40+22*m,cw,ch,col[m],true);
if(col.length&&canPlay(col[col.length-1])){ctx.strokeStyle=o.green;ctx.lineWidth=3;ctx.strokeRect(20+54*b+1,40+22*(col.length-1)+1,cw-2,ch-2)}
if(hintCol===b&&hintT>0&&col.length){ctx.strokeStyle=o.yellow;ctx.lineWidth=3;ctx.strokeRect(20+54*b-2,40+22*(col.length-1)-2,cw+4,ch+4)}
if(keyNav&&b===selCol){ctx.strokeStyle=o.ink;ctx.lineWidth=3;ctx.strokeRect(18+54*b,36,50,160)}
}
if(stock.length){L(ctx,64,340,cw,ch,null,false);x(ctx,stock.length,87,420,13,o.dim)}else p(ctx,64,340,cw,ch,6,'rgba(255,255,255,.06)');
if(waste.length)L(ctx,200,340,cw,ch,waste[waste.length-1],true);
x(ctx,'STOCK',87,330,11,o.dim);
x(ctx,'PLAY ON',223,330,11,o.dim);
p(ctx,300,332,80,34,10,o.violet);x(ctx,'HINT (H)',340,349,12,o.bg);
p(ctx,300,372,80,34,10,o.blue);x(ctx,'UNDO (U)',340,389,12,o.bg);
x(ctx,runLen>1?'Run of '+runLen:'',150,412,15,o.yellow);
x(ctx,msg,150,452,14,o.ink);
t.fxStep(dt);
t.hud([['HOLE',hole+'/9'],['SCORE',y(score)],['STROKES',strokes]]);
}
t.pointer({down:function(pt){
keyNav=false;
if(pt.x>300&&pt.x<380&&pt.y>332&&pt.y<366)return giveHint();
if(pt.x>300&&pt.x<380&&pt.y>372&&pt.y<406)return undo();
if(pt.y>330&&pt.y<410&&pt.x>55&&pt.x<140)return drawStock();
for(var i=0;i<7;i++){var col=cols[i];if(col.length){var topY=40+22*(col.length-1);if(pt.x>=20+54*i&&pt.x<=20+54*i+cw&&pt.y>=topY&&pt.y<=topY+ch)playCol(i)}}
}});
t.press=function(k){
keyNav=true;
if('ArrowLeft'===k||'a'===k)selCol=Math.max(0,selCol-1);
else if('ArrowRight'===k||'d'===k)selCol=Math.min(6,selCol+1);
else if(' '===k||'Enter'===k||'ArrowUp'===k||'w'===k)playCol(selCol);
else if('ArrowDown'===k||'s'===k||'x'===k)drawStock();
else if('h'===k)giveHint();
else if('u'===k)undo();
};
t.pad([['◀','ArrowLeft'],['▶','ArrowRight'],['Play','Space'],['Draw','ArrowDown'],['Hint','h'],['Undo','u']]);
t.begin(function(){hole=1;score=0;strokes=0;selCol=3;keyNav=false;dealHole();t.fx=[];t.frame(render)});
}),
w('twentyOne',S,'Twenty One',o.coral,'Beat the dealer to twenty-one from a real four-deck shoe. Split pairs, double down, and start with 500 chips.','Tap chips or 1-5 to bet · Space deal · H hit · S stand · D double · P split · C cash out',function(r){
var ctx=r.canvas(400,480),chipVals=[10,25,50,100,250];
var shoe,playerHands,dealerHand,activeHand,chips,bet,best,phase,message,dealerTimer;
function draw(){if(!shoe.length)shoe=h(T().concat(T(),T(),T(),T()));return shoe.pop()}
function handTotal(cards){var total=0,aces=0;cards.forEach(function(card){total+=card.r>10?10:card.r;if(1===card.r)aces++});while(aces>0&&total+10<=21){total+=10;aces--}return total}
function rawTotal(cards){var total=0;cards.forEach(function(card){total+=card.r>10?10:card.r});return total}
function isSoft(cards){return handTotal(cards)!==rawTotal(cards)}
function currentHand(){return playerHands[activeHand]}
function advanceHand(){while(activeHand<playerHands.length&&playerHands[activeHand].done)activeHand++;if(activeHand>=playerHands.length){phase='dealer';dealerTimer=.6;message='Dealer plays...'}else message='Hit, stand, double or split?'}
function startRound(){if('bet'!==phase)return;if(chips<10)return;if(bet>chips)bet=chipVals.filter(function(v2){return v2<=chips}).pop()||chips;if(shoe.length<52)shoe=h(T().concat(T(),T(),T(),T()));chips-=bet;playerHands=[{cards:[draw(),draw()],bet:bet,doubled:false,done:false,isSplit:false,bust:false,blackjack:false}];dealerHand=[draw(),draw()];activeHand=0;phase='play';message='Hit, stand, double or split?';dealerTimer=0;var hnd=playerHands[0];if(21===handTotal(hnd.cards)){hnd.done=true;hnd.blackjack=true;advanceHand()}}
function hit(){if('play'!==phase)return;var hnd=currentHand();if(!hnd||hnd.done)return;hnd.cards.push(draw());var total=handTotal(hnd.cards);if(total>21){hnd.done=true;hnd.bust=true;advanceHand()}else if(21===total){hnd.done=true;advanceHand()}}
function stand(){if('play'!==phase)return;var hnd=currentHand();if(!hnd||hnd.done)return;hnd.done=true;advanceHand()}
function doubleDown(){if('play'!==phase)return;var hnd=currentHand();if(!hnd||hnd.done||2!==hnd.cards.length||chips<hnd.bet)return;chips-=hnd.bet;hnd.bet*=2;hnd.doubled=true;hnd.cards.push(draw());hnd.done=true;if(handTotal(hnd.cards)>21)hnd.bust=true;advanceHand()}
function canSplit(hnd){return hnd&&!hnd.done&&2===hnd.cards.length&&hnd.cards[0].r===hnd.cards[1].r&&chips>=hnd.bet&&playerHands.length<4}
function split(){if('play'!==phase)return;var hnd=currentHand();if(!canSplit(hnd))return;chips-=hnd.bet;var wasAce=1===hnd.cards[0].r;var second={cards:[hnd.cards.pop()],bet:hnd.bet,doubled:false,done:false,isSplit:true,bust:false,blackjack:false};hnd.isSplit=true;hnd.cards.push(draw());second.cards.push(draw());playerHands.splice(activeHand+1,0,second);if(wasAce){hnd.done=true;second.done=true;advanceHand()}else if(21===handTotal(hnd.cards)){hnd.done=true;advanceHand()}}
function cashOut(){if('bet'!==phase)return;var final=Math.max(best,chips);phase='over';r.over(final,'Cashed out with '+chips+' chips. Score: '+final)}
function setBet(idx){if('bet'!==phase)return;if(chipVals[idx]<=chips)bet=chipVals[idx]}
function resolveShowdown(){var dealerTotal=handTotal(dealerHand),dealerBust=dealerTotal>21,msgs=[],won=false;playerHands.forEach(function(hnd,idx){var total=handTotal(hnd.cards),payout=0,label;if(hnd.bust){label='Bust'}else if(hnd.blackjack&&!hnd.isSplit){payout=Math.floor(2.5*hnd.bet);label='Blackjack +'+payout;won=true}else if(dealerBust){payout=2*hnd.bet;label='Dealer busts +'+payout;won=true}else if(total>dealerTotal){payout=2*hnd.bet;label='Win +'+payout;won=true}else if(total===dealerTotal){payout=hnd.bet;label='Push'}else label='Lose';chips+=payout;msgs.push((playerHands.length>1?'H'+(idx+1)+': ':'')+label)});if(chips>best)best=chips;message=msgs.join(' · ');if(won)r.burst(200,230,o.yellow,30);phase='bet';if(chips<10){phase='over';r.later(function(){r.over(best,'Broke. Best stack: '+best+' chips. Score: '+best)},1400)}}
function render(dt){
if('dealer'===phase){dealerTimer-=dt;if(dealerTimer<=0){var allBust=playerHands.every(function(hnd){return hnd.bust});if(allBust)resolveShowdown();else if(handTotal(dealerHand)<17){dealerHand.push(draw());dealerTimer=.6}else resolveShowdown()}}
g(ctx,400,480,o.bg);
var dealerShown='play'===phase;
x(ctx,'DEALER'+(dealerShown?'':' '+handTotal(dealerHand)),60,34,13,o.dim);
for(var i=0;i<dealerHand.length;i++)L(ctx,40+46*i,50,56,78,dealerHand[i],!(dealerShown&&1===i));
var numHands=playerHands.length,cardW=numHands>1?34:56,cardH=numHands>1?50:78,step=numHands>1?20:46,handGap=numHands>1?92:0;
for(var hIdx=0;hIdx<numHands;hIdx++){
var hnd=playerHands[hIdx],baseX=20+hIdx*handGap,baseY=192,total=handTotal(hnd.cards);
for(var j=0;j<hnd.cards.length;j++)L(ctx,baseX+step*j,baseY,cardW,cardH,hnd.cards[j],true);
var label=hnd.bust?'BUST':hnd.blackjack&&!hnd.isSplit?'BLACKJACK':(total+(isSoft(hnd.cards)&&total<21?' soft':''));
x(ctx,(numHands>1?'H'+(hIdx+1)+' ':'')+label,baseX+cardW/2+step*(hnd.cards.length-1)/2,baseY-14,12,hnd.bust?o.coral:o.dim);
if('play'===phase&&hIdx===activeHand){ctx.strokeStyle=o.yellow;ctx.lineWidth=3;ctx.strokeRect(baseX-4,baseY-4,cardW+step*(hnd.cards.length-1)+8,cardH+8)}
x(ctx,'BET '+hnd.bet,baseX+cardW/2+step*(hnd.cards.length-1)/2,baseY+cardH+16,11,o.dim);
}
x(ctx,'CHIPS '+chips,330,40,18,o.yellow);
x(ctx,'BET '+bet,330,66,16,o.ink);
x(ctx,'SHOE '+shoe.length,330,88,11,o.dim);
x(ctx,message,200,300,15,o.ink);
if('bet'===phase){
for(var b=0;b<chipVals.length;b++){var cx=45+62*b,ok=chipVals[b]<=chips;d(ctx,cx,350,18,ok?bet===chipVals[b]?o.yellow:o.violet:o.grid);x(ctx,chipVals[b],cx,350,11,ok?o.bg:o.dim)}
p(ctx,200-55,380,110,38,10,chips>=10?o.green:o.grid);x(ctx,'DEAL',200,399,15,chips>=10?o.bg:o.dim);
p(ctx,320-55,380,110,38,10,o.orange);x(ctx,'CASH OUT',320,399,14,o.bg);
}else if('play'===phase){
var hnd=currentHand(),canDbl=hnd&&2===hnd.cards.length&&chips>=hnd.bet,canSpl=canSplit(hnd);
var btns=[['HIT',55,420,80,o.green,true],['STAND',150,420,80,o.coral,true],['DOUBLE',245,420,90,o.yellow,canDbl],['SPLIT',340,420,80,o.violet,canSpl]];
btns.forEach(function(bt){p(ctx,bt[1]-bt[3]/2,bt[2]-19,bt[3],38,10,bt[5]?bt[4]:o.grid);x(ctx,bt[0],bt[1],bt[2],13,bt[5]?o.bg:o.dim)});
}
r.fxStep(dt);
r.hud([['CHIPS',chips],['BET',bet],['BEST',best]]);
}
r.pointer({down:function(pt){
if('bet'===phase){
if(pt.y>335&&pt.y<365)for(var b=0;b<chipVals.length;b++)if(Math.abs(pt.x-(45+62*b))<24)setBet(b);
if(pt.x>145&&pt.x<255&&pt.y>380&&pt.y<418)startRound();
if(pt.x>265&&pt.x<375&&pt.y>380&&pt.y<418)cashOut();
}else if('play'===phase){
if(pt.y>401&&pt.y<439){
if(pt.x>15&&pt.x<95)hit();
else if(pt.x>110&&pt.x<190)stand();
else if(pt.x>200&&pt.x<290)doubleDown();
else if(pt.x>300&&pt.x<380)split();
}
}
}});
r.press=function(k){
if(k>='1'&&k<='5'&&1===k.length)setBet(+k-1);
else if(' '===k||'Enter'===k)startRound();
else if('h'===k)hit();
else if('s'===k)stand();
else if('d'===k)doubleDown();
else if('p'===k)split();
else if('c'===k)cashOut();
};
r.pad([['Deal','Space'],['Hit','h'],['Stand','s'],['Double','d'],['Split','p']]);
r.begin(function(){chips=500;bet=25;best=500;phase='bet';message='Place your bet';playerHands=[];dealerHand=[];activeHand=0;dealerTimer=0;shoe=h(T().concat(T(),T(),T(),T()));r.fx=[];r.frame(render)});
}),
w('higherLower',S,'Higher Lower',o.violet,'Guess higher or lower to build a streak multiplier, then bank your points before a wrong guess wipes the pot. Ace is low.','Up / H for higher · Down / L for lower · B to bank your streak · three wrong guesses ends it',function(r){
var W=400,ctx=r.canvas(W,470);
var deck,current,history,lives,streak,score,pot,message,msgColor,lockT,flipT;
function multiplier(streakVal){return Math.min(5,1+Math.floor((streakVal-1)/3))}
function bank(){if(lockT>0||pot<=0)return;score+=pot;message='Banked '+pot+' points!';msgColor=o.yellow;r.burst(200,160,o.yellow,24);pot=0;streak=0}
function guess(wantHigher){if(lockT>0)return;if(!deck.length){deck=T();score+=50;r.burst(200,120,o.teal,20)}var next=deck.pop();history.push(current);if(history.length>7)history.shift();if(next.r===current.r){message='Same rank. Push.';msgColor=o.dim}else if(next.r>current.r===wantHigher){streak++;var mult=multiplier(streak);pot+=10*mult;message='Correct! Streak '+streak+' · x'+mult;msgColor=o.green;r.burst(200,200,o.green,16)}else{lives--;pot=0;streak=0;message='Wrong! Pot lost.';msgColor=o.coral;r.burst(200,200,o.coral,16)}current=next;lockT=.55;flipT=.3;if(lives<=0){lockT=99;r.later(function(){r.over(score,'Out of lives. Final score: '+score)},900)}}
function render(dt){
var counts=function(){var higherN=0,lowerN=0,sameN=0;deck.forEach(function(card){card.r>current.r?higherN++:card.r<current.r?lowerN++:sameN++});return[higherN,lowerN,sameN]}();
if(lockT>0&&lockT<50)lockT-=dt;
if(flipT>0)flipT-=dt;
g(ctx,W,470,o.bg);
x(ctx,'LIVES '+'♥ '.repeat(lives),200,26,16,o.coral);
x(ctx,'DECK '+deck.length+' cards left',200,46,11,o.dim);
for(var i=0;i<history.length;i++)L(ctx,24+50*i,60,40,56,history[i],true);
var flipProgress=flipT>0?1-flipT/.3:1;
L(ctx,200-60*flipProgress,150,120*flipProgress,168,current,flipProgress>.5);
x(ctx,message,200,335,16,msgColor);
p(ctx,30,355,165,44,10,o.green);
x(ctx,'HIGHER ('+counts[0]+')',112,377,15,o.bg);
p(ctx,205,355,165,44,10,o.coral);
x(ctx,'LOWER ('+counts[1]+')',287,377,15,o.bg);
p(ctx,140,408,120,34,10,pot>0?o.yellow:o.grid);
x(ctx,pot>0?'BANK '+pot:'BANK',200,425,14,pot>0?o.bg:o.dim);
x(ctx,'Same rank left: '+counts[2],200,452,11,o.dim);
r.fxStep(dt);
r.hud([['SCORE',y(score)],['STREAK',streak],['POT',pot]]);
}
r.pointer({down:function(pt){
if(pt.y>355&&pt.y<399){if(pt.x<200)guess(true);else guess(false)}
else if(pt.y>408&&pt.y<442&&pt.x>140&&pt.x<260)bank();
}});
r.press=function(k){
if('ArrowUp'===k||'h'===k||'w'===k)guess(true);
else if('ArrowDown'===k||'l'===k||'s'===k)guess(false);
else if('b'===k)bank();
};
r.pad([['Higher','ArrowUp'],['Lower','ArrowDown'],['Bank','b']]);
r.begin(function(){deck=T();current=deck.pop();history=[];lives=3;streak=0;score=0;pot=0;message='Higher or lower?';msgColor=o.ink;lockT=0;flipT=0;r.fx=[];r.frame(render)});
}),w('hangWord',S,'Word Fuse',o.orange,'Guess the hidden word before the fuse burns out or the clock runs down. Difficulty climbs as you defuse more words.','Type letters or tap the keys · Space for a hint (costs a strike) · six wrong guesses or an empty clock ends it',function(r){
var ctx=r.canvas(400,470),rows=['qwertyuiop','asdfghjkl','zxcvbnm'];
var LETTER_FREQ={a:8.2,b:1.5,c:2.8,d:4.3,e:12.7,f:2.2,g:2,h:6.1,i:7,j:.15,k:.77,l:4,m:2.4,n:6.7,o:7.5,p:1.9,q:.1,r:6,s:6.3,t:9.1,u:2.8,v:1,w:2.4,x:.15,y:2,z:.07};
var TIERS=[[5,6],[7,7],[8,9]],TIER_NAMES=['EASY','MEDIUM','HARD'];
var word,guessed,wrongCount,score,defused,ended,boom,message,feedback,timeLeft,totalTime,hintsUsed,tier;
function letterNote(ch){var freq=LETTER_FREQ[ch]||0;return freq>=6?'common':freq>=2?'moderate':'rare'}
function tierFor(){return Math.min(2,Math.floor(defused/3))}
function wordPool(t){var range=TIERS[t],pool=R.filter(function(wd){return wd.length>=range[0]&&wd.length<=range[1]});return pool.length?pool:R.filter(function(wd){return wd.length>=5&&wd.length<=9})}
function isComplete(){for(var i=0;i<word.length;i++)if(!guessed[word.charAt(i)])return false;return true}
function newWord(){tier=tierFor();word=u(wordPool(tier));guessed={};wrongCount=0;message='';feedback='';ended=false;hintsUsed=0;totalTime=30+3*word.length;timeLeft=totalTime}
function explode(){if(ended)return;ended=true;boom=1;message='The w