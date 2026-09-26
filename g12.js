)continue;
    nb[pos]++;seq.push(pos);seeds--;
  }
  var extra=pos===ownStore;
  var oppPit=12-pos,captured=0;
  var ownSide=player===1?(pos<=5):(pos>=7&&pos<=12);
  if(!extra&&ownSide&&nb[pos]===1&&nb[oppPit]>0){
    captured=nb[oppPit]+1;
    nb[ownStore]+=captured;
    nb[pos]=0;nb[oppPit]=0;
  }
  return{b:nb,extra:extra,seq:seq,capturedPit:captured?oppPit:-1,capturedAmt:captured};
}
function isOver(bd){return pitSum(bd,1)===0||pitSum(bd,2)===0;}
function sweep(bd){
  var nb=bd.slice();
  if(isOver(nb)){
    for(var i=0;i<6;i++){nb[6]+=nb[i];nb[i]=0;}
    for(i=7;i<13;i++){nb[13]+=nb[i];nb[i]=0;}
  }
  return nb;
}
function search(bd,player,depth,alpha,beta){
  if(isOver(bd)){var sb=sweep(bd);return 3*(sb[13]-sb[6]);}
  if(depth===0)return bd[13]-bd[6];
  var start=player===1?0:7,indices=[],i;
  for(i=start;i<start+6;i++)if(bd[i])indices.push(i);
  var ownStore=player===1?6:13;
  indices.sort(function(x1,x2){
    var r1=sow(bd,x1,player),r2=sow(bd,x2,player);
    var s1=(r1.extra?1000:0)+r1.capturedAmt+r1.b[ownStore]-bd[ownStore],s2=(r2.extra?1000:0)+r2.capturedAmt+r2.b[ownStore]-bd[ownStore];
    return s2-s1;
  });
  var val=player===2?-1e9:1e9;
  for(i=0;i<indices.length;i++){
    var res=sow(bd,indices[i],player);
    var nextPlayer=res.extra?player:3-player;
    var v=search(res.b,nextPlayer,depth-1,alpha,beta);
    if(player===2){if(v>val)val=v;if(val>alpha)alpha=val;if(alpha>=beta)break;}
    else{if(v<val)val=v;if(val<beta)beta=val;if(alpha>=beta)break;}
  }
  return val;
}
function newGame(){
  realBoard=[];
  for(var i=0;i<14;i++)realBoard.push(i===6||i===13?0:4);
  displayBoard=realBoard.slice();
  turn=1;over=false;msg='';pending=null;highlightPit=-1;turnDelay=0;
}
function startGame(){
  score=0;wins=0;
  newGame();
  a.fx=[];
  a.frame(step);
}
function finishGame(){
  over=true;
  var mine=realBoard[6],rival=realBoard[13];
  if(mine>rival){
    var gain=Math.round((100+5*(mine-rival)+15*wins)*(1+0.5*diff));
    score+=gain;wins++;
    msg='You win '+mine+' to '+rival+' (+'+gain+')';
    a.burst(200,160,o.yellow,40);
    a.later(newGame,1700);
  }else if(mine===rival){
    msg='Draw, '+mine+' each';
    a.later(newGame,1700);
  }else{
    msg='You lose '+mine+' to '+rival;
    a.later(function(){a.over(score,'Lost '+mine+' to '+rival+' after '+wins+' win'+(wins===1?'':'s')+' on '+['Easy','Normal','Hard'][diff]+'. Score: '+score);},1300);
  }
}
function startSow(idx,player){
  var res=sow(realBoard,idx,player);
  displayBoard=realBoard.slice();
  displayBoard[idx]=0;
  highlightPit=idx;
  pending={result:res,player:player,step:0,timer:0};
}
function finalizeSow(){
  var res=pending.result,mover=pending.player;
  realBoard=res.b;
  displayBoard=realBoard.slice();
  pending=null;highlightPit=-1;
  if(res.capturedAmt>0)a.burst(pitX(mover===1?6:13),160,mover===1?o.teal:o.coral,16);
  if(isOver(realBoard)){realBoard=sweep(realBoard);displayBoard=realBoard.slice();finishGame();return;}
  if(res.extra){
    turn=mover;
    msg=mover===1?'Your store! Go again.':'Rival goes again.';
    turnDelay=mover===2?0.5:0;
  }else{
    turn=3-mover;
    msg='';
    turnDelay=turn===2?0.5:0;
  }
}
function playerSow(idx){
  if(over||pending||turn!==1||idx<0||idx>5||!realBoard[idx])return;
  startSow(idx,1);
}
function aiMove(){
  var indices=[];
  for(var i=7;i<13;i++)if(realBoard[i])indices.push(i);
  if(!indices.length)return;
  var dp=DIFF[diff],chosen;
  if(Math.random()<dp.rand){
    chosen=u(indices);
  }else{
    var best=-1e9,bestMoves=[],alpha=-1e9;
    indices.slice().sort(function(x1,x2){
      var r1=sow(realBoard,x1,2),r2=sow(realBoard,x2,2);
      return((r2.extra?1000:0)+r2.capturedAmt)-((r1.extra?1000:0)+r1.capturedAmt);
    }).forEach(function(idx){
      var res=sow(realBoard,idx,2);
      var v=search(res.b,res.extra?2:1,dp.depth-1,alpha,1e9);
      if(v>best+1e-9){best=v;bestMoves=[idx];}else if(Math.abs(v-best)<1e-9)bestMoves.push(idx);
      alpha=Math.max(alpha,best);
    });
    chosen=u(bestMoves);
  }
  startSow(chosen,2);
}
function step(dt){
  if(pending){
    pending.timer+=dt;
    while(pending&&pending.timer>=0.12){
      pending.timer-=0.12;
      if(pending.step<pending.result.seq.length){
        displayBoard[pending.result.seq[pending.step]]++;
        pending.step++;
      }else{
        finalizeSow();
      }
    }
  }else if(!over&&turn===2){
    turnDelay-=dt;
    if(turnDelay<=0){turnDelay=99;aiMove();}
  }
  g(ctx,CANVAS_W,CANVAS_H);
  p(ctx,12,60,396,200,40,'#3a2f6b');
  for(var i=0;i<14;i++){
    if(i===6||i===13)continue;
    d(ctx,pitX(i),pitY(i),22,'rgba(0,0,0,.35)');
    if(i===highlightPit){ctx.strokeStyle=o.yellow;ctx.lineWidth=3;d(ctx,pitX(i),pitY(i),22);ctx.stroke();}
    for(var s2=0;s2<Math.min(displayBoard[i],9);s2++)d(ctx,pitX(i)-9+s2%3*9,pitY(i)-9+9*Math.floor(s2/3),3.6,i<6?o.teal:o.coral);
    x(ctx,displayBoard[i],pitX(i),pitY(i)+(i<6?34:-34),13,o.ink);
    if(i<6)x(ctx,String(i+1),pitX(i),pitY(i)+50,11,o.dim);
  }
  p(ctx,pitX(6)-22,70,44,180,22,'rgba(0,0,0,.35)');
  x(ctx,displayBoard[6],pitX(6),160,26,o.teal);
  x(ctx,'YOU',pitX(6),280,11,o.dim);
  p(ctx,pitX(13)-22,70,44,180,22,'rgba(0,0,0,.35)');
  x(ctx,displayBoard[13],pitX(13),160,26,o.coral);
  x(ctx,'RIVAL',pitX(13),280,11,o.dim);
  x(ctx,msg||(turn===1?'Your move':'Rival is thinking'),210,30,16,o.ink);
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['WINS',wins]]);
}
a.pointer({down:function(pt){
  for(var i=0;i<6;i++)if(Math.hypot(pt.x-pitX(i),pt.y-pitY(i))<26)playerSow(i);
}});
a.press=function(key){
  if(key>='1'&&key<='6'&&key.length===1)playerSow(+key-1);
};
a.opt('Difficulty',['Easy','Normal','Hard'],diff,function(i){diff=i;startGame();});
a.begin(startGame);
}),w('fiveInRow',k,'Five In Row',o.blue,'Line up five stones in any direction before the rival does — and watch for their open threes.','Click an intersection · arrows + Space work too · beat the rival to move on',function(a){
var SIZE=15,CELLPX=24,PADX=32,PADY=62;
var ctx=a.canvas(400,450);
var DIRS4=[[1,0],[0,1],[1,1],[1,-1]];
var diff=1,DIFF=[{depth:1,K:10,rand:0.12},{depth:3,K:7,rand:0},{depth:4,K:8,rand:0}];
var board,turn,over,score,wins,msg,keyNav,cursor,lastMove,winLine,moveCount,aiDelay;
function inBounds(r,c){return r>=0&&c>=0&&r<SIZE&&c<SIZE;}
function getCell(bd,r,c){return inBounds(r,c)?bd[r*SIZE+c]:-1;}
function placementScore(bd,idx,player){
  var row=Math.floor(idx/SIZE),col=idx%SIZE,total=0;
  DIRS4.forEach(function(dir){
    var len=1,openEnds=0,step,rr,cc;
    for(step=1;getCell(bd,row+dir[0]*step,col+dir[1]*step)===player;step++)len++;
    if(getCell(bd,row+dir[0]*step,col+dir[1]*step)===0)openEnds++;
    for(step=1;getCell(bd,row-dir[0]*step,col-dir[1]*step)===player;step++)len++;
    if(getCell(bd,row-dir[0]*step,col-dir[1]*step)===0)openEnds++;
    total+=len>=5?100000:len===4?(openEnds===2?10000:openEnds===1?1000:0):len===3?(openEnds===2?1000:openEnds===1?100:0):len===2?(openEnds===2?100:openEnds===1?10:0):1;
  });
  return total;
}
function scanRuns(bd,player){
  var score2=0;
  DIRS4.forEach(function(dir){
    for(var idx=0;idx<SIZE*SIZE;idx++){
      var row=Math.floor(idx/SIZE),col=idx%SIZE;
      if(bd[idx]!==player)continue;
      var pr=row-dir[0],pc=col-dir[1];
      if(getCell(bd,pr,pc)===player)continue;
      var len=0,rr=row,cc=col;
      while(getCell(bd,rr,cc)===player){len++;rr+=dir[0];cc+=dir[1];}
      var openEnds=0;
      if(getCell(bd,pr,pc)===0)openEnds++;
      if(getCell(bd,rr,cc)===0)openEnds++;
      score2+=len>=5?100000:len===4?(openEnds===2?10000:openEnds===1?1000:0):len===3?(openEnds===2?1000:openEnds===1?100:0):len===2?(openEnds===2?100:openEnds===1?10:0):1;
    }
  });
  return score2;
}
function evaluate(bd){return scanRuns(bd,2)-scanRuns(bd,1);}
function getCandidates(bd){
  var seen={},out=[],has=false;
  for(var i=0;i<SIZE*SIZE;i++)if(bd[i]){has=true;break;}
  if(!has)return[Math.floor(SIZE*SIZE/2)];
  for(i=0;i<SIZE*SIZE;i++){
    if(!bd[i])continue;
    var row=Math.floor(i/SIZE),col=i%SIZE;
    for(var dr=-2;dr<=2;dr++)for(var dc=-2;dc<=2;dc++){
      var rr=row+dr,cc=col+dc;
      if(!inBounds(rr,cc))continue;
      var ci=rr*SIZE+cc;
      if(bd[ci]||seen[ci])continue;
      seen[ci]=1;out.push(ci);
    }
  }
  return out;
}
function findWinLine(bd,idx,player){
  var row=Math.floor(idx/SIZE),col=idx%SIZE;
  for(var d=0;d<4;d++){
    var dir=DIRS4[d],cells=[[row,col]],step;
    for(step=1;getCell(bd,row+dir[0]*step,col+dir[1]*step)===player;step++)cells.push([row+dir[0]*step,col+dir[1]*step]);
    for(step=1;getCell(bd,row-dir[0]*step,col-dir[1]*step)===player;step++)cells.unshift([row-dir[0]*step,col-dir[1]*step]);
    if(cells.length>=5)return cells;
  }
  return null;
}
function search(bd,player,depth,alpha,beta){
  var candidates=getCandidates(bd);
  if(!candidates.length||depth===0)return evaluate(bd);
  var dp=DIFF[diff],scored=candidates.map(function(idx){return{idx:idx,s:placementScore(bd,idx,player)+0.85*placementScore(bd,idx,3-player)};});
  scored.sort(function(m1,m2){return m2.s-m1.s;});
  var K=Math.min(dp.K,scored.length);
  var val=player===2?-1e9:1e9;
  for(var i=0;i<K;i++){
    var idx=scored[i].idx;
    var winScore=placementScore(bd,idx,player);
    var nb=bd.slice();nb[idx]=player;
    var v=winScore>=100000?(player===2?200000-depth:-200000+depth):search(nb,3-player,depth-1,alpha,beta);
    if(player===2){if(v>val)val=v;if(val>alpha)alpha=val;}else{if(v<val)val=v;if(val<beta)beta=val;}
    if(alpha>=beta)break;
  }
  return val;
}
function newGame(){
  board=new Array(SIZE*SIZE).fill(0);
  turn=1;over=false;msg='';lastMove=-1;winLine=null;moveCount=0;aiDelay=0;
}
function startGame(){
  score=0;wins=0;keyNav=false;cursor=Math.floor(SIZE*SIZE/2);
  newGame();
  a.fx=[];
  a.frame(step);
}
function finishGame(winner){
  over=true;
  if(winner===1){
    var gain=Math.round((100+20*wins)*(1+0.5*diff));
    score+=gain;wins++;
    msg='Five in a row. You win! (+'+gain+')';
    a.burst(cellCx(lastMove),cellCy(lastMove),o.blue,40);
    a.later(newGame,1800);
  }else if(winner===0){
    msg='Board full. Draw.';
    a.later(newGame,1500);
  }else{
    msg='Rival made five';
    a.later(function(){a.over(score,'Beaten after '+wins+' win'+(wins===1?'':'s')+' on '+['Easy','Normal','Hard'][diff]+'. Score: '+score);},1500);
  }
}
function cellCx(idx){return PADX+(idx%SIZE)*CELLPX;}
function cellCy(idx){return PADY+Math.floor(idx/SIZE)*CELLPX;}
function placeStone(idx,player){
  board[idx]=player;lastMove=idx;moveCount++;
  var line=findWinLine(board,idx,player);
  if(line){winLine=line;finishGame(player===1?1:2);return;}
  if(moveCount>=SIZE*SIZE){finishGame(0);return;}
  turn=3-player;
  if(turn===2)aiDelay=0.45;
  msg='';
}
function playerPlace(idx){
  if(over||turn!==1||board[idx])return;
  placeStone(idx,1);
}
function aiMove(){
  var candidates=getCandidates(board);
  if(!candidates.length)return;
  var dp=DIFF[diff];
  if(Math.random()<dp.rand){placeStone(u(candidates),2);return;}
  var scored=candidates.map(function(idx){return{idx:idx,s:placementScore(board,idx,2)+0.85*placementScore(board,idx,1)};});
  scored.sort(function(m1,m2){return m2.s-m1.s;});
  var K=Math.min(dp.K,scored.length),best=-1e9,bestMoves=[],alpha=-1e9;
  for(var i=0;i<K;i++){
    var idx=scored[i].idx;
    var winScore=placementScore(board,idx,2);
    var nb=board.slice();nb[idx]=2;
    var v=winScore>=100000?200000:search(nb,1,dp.depth-1,alpha,1e9);
    if(v>best+1e-9){best=v;bestMoves=[idx];}else if(Math.abs(v-best)<1e-9)bestMoves.push(idx);
    alpha=Math.max(alpha,best);
  }
  placeStone(u(bestMoves),2);
}
function step(dt){
  if(!over&&turn===2){
    aiDelay-=dt;
    if(aiDelay<=0){aiDelay=99;aiMove();}
  }
  g(ctx,400,450);
  p(ctx,14,44,372,372,10,'#1d2b55');
  var i;
  for(i=0;i<SIZE;i++){
    v(ctx,PADX,PADY+i*CELLPX,PADX+(SIZE-1)*CELLPX,PADY+i*CELLPX,'rgba(255,255,255,.18)',1);
    v(ctx,PADX+i*CELLPX,PADY,PADX+i*CELLPX,PADY+(SIZE-1)*CELLPX,'rgba(255,255,255,.18)',1);
  }
  if(turn===1&&!over)getCandidates(board).forEach(function(idx){d(ctx,cellCx(idx),cellCy(idx),3,'rgba(255,255,255,.18)');});
  for(i=0;i<SIZE*SIZE;i++){
    if(!board[i])continue;
    var cx=cellCx(i),cy=cellCy(i);
    d(ctx,cx,cy+1,10,'rgba(0,0,0,.35)');
    d(ctx,cx,cy,10,board[i]===1?o.teal:o.coral);
    d(ctx,cx-3,cy-3,3,'rgba(255,255,255,.35)');
    if(i===lastMove){ctx.strokeStyle=o.yellow;ctx.lineWidth=2;d(ctx,cx,cy,12);ctx.stroke();}
  }
  if(winLine){
    ctx.strokeStyle=o.yellow;ctx.lineWidth=4;ctx.beginPath();
    ctx.moveTo(PADX+winLine[0][1]*CELLPX,PADY+winLine[0][0]*CELLPX);
    ctx.lineTo(PADX+winLine[winLine.length-1][1]*CELLPX,PADY+winLine[winLine.length-1][0]*CELLPX);
    ctx.stroke();
  }
  if(keyNav&&!over){var kx=cellCx(cursor),ky=cellCy(cursor);ctx.strokeStyle=o.ink;ctx.lineWidth=2;r.L(ctx,kx-11,ky-11,22,22,5);ctx.stroke();}
  x(ctx,msg||(turn===1?'Your move':'Rival is thinking'),200,30,16,o.ink);
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['WINS',wins]]);
}
a.pointer({down:function(pt){
  var col=Math.round((pt.x-PADX)/CELLPX),row=Math.round((pt.y-PADY)/CELLPX);
  keyNav=false;
  if(turn===1&&inBounds(row,col))playerPlace(row*SIZE+col);
}});
a.press=function(key){
  var col=cursor%SIZE,row=Math.floor(cursor/SIZE);
  keyNav=true;
  if(key==='ArrowLeft'||key==='a')col=Math.max(0,col-1);
  else if(key==='ArrowRight'||key==='d')col=Math.min(SIZE-1,col+1);
  else if(key==='ArrowUp'||key==='w')row=Math.max(0,row-1);
  else if(key==='ArrowDown'||key==='s')row=Math.min(SIZE-1,row+1);
  else if((key===' '||key==='Enter')&&turn===1)playerPlace(cursor);
  cursor=row*SIZE+col;
};
a.pad([['◀','ArrowLeft'],['▲','ArrowUp'],['▼','ArrowDown'],['▶','ArrowRight'],['Place','Space']]);
a.opt('Difficulty',['Easy','Normal','Hard'],diff,function(i){diff=i;startGame();});
a.begin(startGame);
});var P={'Arcade Classics':'var(--cat-arcade)',Reflex:'var(--cat-reflex)',Puzzle:'var(--cat-puzzle)','Board & Strategy':'#7BD88F','Cards & Words':'#F2A65A'},D=document.createElement('style');D.setAttribute('data-csa-ext',''),D.textContent=a.map(function(r){return'.cart[data-game='+r+']{--cat:'+P[t[r].category]+'}'}).join('')+'.category-nav button:nth-child(10){--navcat:#7BD88F}.category-nav button:nth-child(11){--navcat:#F2A65A}',document.head.appendChild(D)
;var O=['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'],U=n.length,I=U<20?O[U]:['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'][Math.floor(U/10)]+(U%10?'-'+O[U%10].toLowerCase():''),W=document.querySelector('.console-screen p');W&&(W.textContent=W.textContent.replace(/^[A-Za-z-]+ signals/,I+' signals'))};