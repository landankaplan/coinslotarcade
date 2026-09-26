r:!1,rel:D[t]*Math.max(.5,1-.08*s)}}),v=0,w=0,b=0,M=1.4,k=0,fruit=null,fruitTimer=0}

function B(r){var t=r.tx,n=r.ty;r.tx=r.nx,r.ty=r.ny,r.nx=t,r.ny=n,r.p=1-r.p,r.dx=-r.dx,r.dy=-r.dy}
function H(r){r.p>0?B(r):(r.dx=-r.dx,r.dy=-r.dy)}
function q(r,t,n){for(var o,e=0;t>0&&e++<6;){if(0===r.p){if(n(r),!r.dx&&!r.dy)return;if(r.nx=r.tx+r.dx,r.ny=r.ty+r.dy,!I(r.nx,r.ny))return r.dx=0,void(r.dy=0)}t>=(o=1-r.p)?(t-=o,r.tx=r.nx,r.ty=r.ny,r.p=0,r.arrive&&r.arrive(r)):(r.p+=t,t=0)}}
function z(r){(f[0]||f[1])&&I(r.tx+f[0],r.ty+f[1])?(r.dx=f[0],r.dy=f[1]):I(r.tx+r.dx,r.ty+r.dy)||(r.dx=0,r.dy=0),(r.dx||r.dy)&&(r.ld=[r.dx,r.dy])}
function V(r){var t,n,o,e,a=T.filter(function(t){return I(r.tx+t[0],r.ty+t[1])&&!((r.dx||r.dy)&&t[0]===-r.dx&&t[1]===-r.dy)}),f=1e9;if(a.length||(a=[[-r.dx,-r.dy]]),r.fr&&r.out)return n=u(a),r.dx=n[0],void(r.dy=n[1]);for(t=function(r){var t,n=i.tx,o=i.ty,e=i.ld?i.ld[0]:0,a=i.ld?i.ld[1]:0;return r.out?v%2==0?P[r.i]:0===r.i?[n,o]:1===r.i?[n+4*e,o+4*a]:2===r.i?[2*(n+2*e)-(t=l[0]).tx,2*(o+2*a)-t.ty]:Math.hypot(n-r.tx,o-r.ty)>6?[n,o]:P[3]:[8,6]}(r),n=a[0],o=0;o<a.length;o++)(e=Math.pow(r.tx+a[o][0]-t[0],2)+Math.pow(r.ty+a[o][1]-t[1],2))<f&&(f=e,n=a[o]);r.dx=n[0],r.dy=n[1]}
function N(r){var t=n[r.ty][r.tx];t&&(n[r.ty][r.tx]=0,a--,h+=2===t?50:10,2===t&&(b=Math.max(2.5,7.5-.8*s),m=0,l.forEach(function(r){r.out&&(r.fr||H(r),r.fr=!0)})))}
function Y(r){return{x:(r.tx+(r.nx-r.tx)*r.p+.5)*S,y:(r.ty+(r.ny-r.ty)*r.p+.5)*S}}
function j(r,t){f=[r,t],i.p>0&&r===-i.dx&&t===-i.dy&&B(i)}

function catDraw(m,v,z){var s=9*z,ox=2*z*Math.cos(v),oy=2*z*Math.sin(v);R.fillStyle=o.yellow,R.beginPath(),R.moveTo(m.x-.85*s,m.y-.1*s),R.lineTo(m.x-.75*s,m.y-1.25*s),R.lineTo(m.x-.15*s,m.y-.65*s),R.closePath(),R.fill(),R.beginPath(),R.moveTo(m.x+.85*s,m.y-.1*s),R.lineTo(m.x+.75*s,m.y-1.25*s),R.lineTo(m.x+.15*s,m.y-.65*s),R.closePath(),R.fill(),d(R,m.x,m.y+1,s,o.yellow),d(R,m.x-3.2*z+ox,m.y-.5*z+oy,2.2*z,o.ink),d(R,m.x+3.2*z+ox,m.y-.5*z+oy,2.2*z,o.ink)}
function botDraw(m,c,dx,dy){p(R,m.x-1,m.y-11,2,4,1,c),d(R,m.x,m.y-12,2,c),p(R,m.x-8,m.y-8,16,15,5,c),p(R,m.x-7,m.y+6,4,4,1.5,c),p(R,m.x+3,m.y+6,4,4,1.5,c),p(R,m.x-6,m.y-4,12,6,3,o.ink),d(R,m.x+2.2*dx,m.y-1+1.6*dy,1.8,'#ffffff')}
function update(dt){
  U+=dt;
  if(k>0){
    if((k-=dt)<=0){
      if(c<=0)return void r.over(h,'Level '+s+' · Score: '+h);
      F()
    }
    draw();return
  }
  if(M>0){M-=dt;draw();return}
  if(b>0){
    if((b-=dt)<=0)l.forEach(function(gh){gh.fr=!1})
  }else{
    w+=dt;
    if(w>O[v]){w=0;v++;l.forEach(function(gh){gh.out&&H(gh)})}
  }
  q(i,(4.9+.12*Math.min(s,6))*dt,z);
  l.forEach(function(gh){
    if(!gh.out&&(gh.rel-=dt,gh.rel>0))return;
    var spd=gh.fr?2.9:4.2+.22*Math.min(s,8);
    if(gh.i===0&&!gh.fr&&pelletTotal&&a<=pelletTotal*.2)spd+=1.2;
    q(gh,spd*dt,V);
    if(!gh.out&&gh.ty<=7&&0===gh.p)gh.out=!0
  });
  if(!fruitSpawned&&pelletTotal&&pelletTotal-a>=Math.floor(pelletTotal*.35)){
    fruitSpawned=!0;fruit={x:4.5*S,y:17.5*S};fruitTimer=9
  }
  if(fruit){
    fruitTimer-=dt;
    if(fruitTimer<=0)fruit=null;
    else{
      var pp=Y(i);
      if(Math.hypot(pp.x-fruit.x,pp.y-fruit.y)<.55*S){
        h+=FRUIT_VALS[Math.min(FRUIT_VALS.length-1,s-1)];
        r.burst(fruit.x,fruit.y,o.coral,20);
        fruit=null
      }
    }
  }
  if(a<=0){s++;h+=300;W();return}
  var pacPos=Y(i);
  for(var gi=0;gi<l.length;gi++){
    var gh=l[gi];
    if(gh.out||!(gh.rel>0)){
      var ghPos=Y(gh);
      if(Math.hypot(pacPos.x-ghPos.x,pacPos.y-ghPos.y)<.55*S){
        if(!gh.fr){k=1.2;c--;r.burst(pacPos.x,pacPos.y,o.yellow,24);break}
        m++;h+=100*Math.pow(2,m);r.burst(ghPos.x,ghPos.y,L[gi],16);
        gh.tx=gh.nx=C[gi][0];gh.ty=gh.ny=C[gi][1];gh.p=0;gh.dx=0;gh.dy=0;gh.fr=!1;gh.out=!1;gh.rel=1.5
      }
    }
  }
  draw()
}

function draw(){
  g(R,374,418);
  for(var row=0;row<A;row++){
    for(var col=0;col<E;col++){
      if(t[row][col]){
        if(I(col-1,row)||I(col+1,row)||I(col,row-1)||I(col,row+1)||I(col-1,row-1)||I(col+1,row-1)||I(col-1,row+1)||I(col+1,row+1))
          p(R,col*S+1,row*S+1,20,20,5,'#33256b')
      }else if(n[row][col]===1){
        d(R,col*S+11,row*S+11,2,o.dim)
      }else if(n[row][col]===2){
        d(R,col*S+11,row*S+11,4+Math.sin(8*U),o.yellow)
      }
    }
  }
  if(fruit){d(R,fruit.x,fruit.y,7,o.coral);d(R,fruit.x-3,fruit.y-6,2,o.green)}
  var pacPix=Y(i),mouth=.05+.3*Math.abs(Math.sin(14*U)),ang=i.ld?Math.atan2(i.ld[1],i.ld[0]):0;
  if(k>0)mouth=Math.min(3,3*(1.2-k));
  catDraw(pacPix,ang,k>0?Math.max(.05,k/1.2):1);
  if(k>0){r.fxStep(.016);return}
  for(var gi=0;gi<l.length;gi++){
    var gh=l[gi],gp=Y(gh),flashWhite=gh.fr&&(b>2||Math.floor(4*b)%2);
    botDraw(gp,gh.fr?(flashWhite?'#4DA6FF':o.ink):L[gi],gh.dx,gh.dy)
  }
  r.fxStep(.016);
  if(M>0)x(R,'READY',187,217,18,o.yellow);
  r.hud([['SCORE',y(h)],['LEVEL',s],['LIVES',c],['CHAIN',b>0&&m>0?'x'+Math.pow(2,m):'-']])
}

r.press=function(k2){var t={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[k2];t&&j(t[0],t[1])};
r.swipe(function(d2){j.apply(null,{up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[d2])});
r.pad([['▲','ArrowUp'],['◀','ArrowLeft'],['▶','ArrowRight'],['▼','ArrowDown']]);
r.begin(function(){h=0,c=3,s=1,r.fx=[],W(),r.frame(update)})
}),w('fleetHunt',k,'Fleet Hunt',o.blue,'Call your shots across the water and hunt down the hidden fleet before it sinks yours.','Click a square on the big grid to fire · arrows + Space work too · sink all five ships',function(a){
var G=10,CELL=30,MINI=17,MY=380,ctx=a.canvas(400,560),LENS=[5,4,3,3,2];
var diff=1,DIFF=[{exp:0.7,hitW:3,noise:0.45},{exp:1.3,hitW:5,noise:0.16},{exp:2.5,hitW:7,noise:0.02}];
var enemy,mine,shotE,shotM,turn,over,score,wins,msg,hover,cursor,keyNav,rDelay,lastR;
function makeFleet(){
  var occ={},ships=[];
  LENS.forEach(function(len){
    var ok,cells,horiz,row,col,idx,j;
    do{
      horiz=Math.random()<0.5;
      col=f(horiz?G-len+1:G);
      row=f(horiz?G:G-len+1);
      cells=[];ok=true;
      for(j=0;j<len;j++){
        idx=(row+(horiz?0:j))*G+col+(horiz?j:0);
        if(occ[idx]!==undefined)ok=false;
        cells.push(idx);
      }
    }while(!ok);
    cells.forEach(function(idx){occ[idx]=ships.length;});
    ships.push({n:len,cells:cells,hit:0});
  });
  return {ships:ships,occ:occ};
}
function alive(fleet){return fleet.ships.filter(function(sh){return sh.hit<sh.n;}).length;}
function fireAt(fleet,shots,idx){
  if(shots[idx])return{already:true,hit:false};
  if(fleet.occ[idx]===undefined){shots[idx]=1;return{hit:false};}
  shots[idx]=2;
  var ship=fleet.ships[fleet.occ[idx]];
  ship.hit++;
  return{hit:true,sunk:ship.hit>=ship.n,ship:ship};
}
function densityMap(shots,sunkSet,lens,hitW){
  var heat=new Array(G*G).fill(0);
  lens.forEach(function(len){
    for(var dir=0;dir<2;dir++)
      for(var row=0;row<G;row++)
        for(var col=0;col<G;col++){
          var ok=true,cells=[];
          for(var j=0;j<len;j++){
            var rr=dir===0?row:row+j,cc=dir===0?col+j:col;
            if(rr>=G||cc>=G){ok=false;break;}
            var idx=rr*G+cc;
            if(shots[idx]===1||sunkSet[idx]){ok=false;break;}
            cells.push(idx);
          }
          if(ok)cells.forEach(function(idx){heat[idx]+=shots[idx]===2?hitW:1;});
        }
  });
  for(var i=0;i<G*G;i++)if(shots[i])heat[i]=0;
  return heat;
}
function weightedPick(cands,weights){
  var total=0,i;
  for(i=0;i<weights.length;i++)total+=weights[i];
  var r=Math.random()*total;
  for(i=0;i<cands.length;i++){r-=weights[i];if(r<=0)return cands[i];}
  return cands[cands.length-1];
}
function rivalFire(){
  var sunkSet={};
  mine.ships.forEach(function(sh){if(sh.hit>=sh.n)sh.cells.forEach(function(c){sunkSet[c]=true;});});
  var lens=mine.ships.filter(function(sh){return sh.hit<sh.n;}).map(function(sh){return sh.n;});
  var dp=DIFF[diff];
  var heat=densityMap(shotM,sunkSet,lens,dp.hitW);
  var cands=[],weights=[];
  for(var i=0;i<G*G;i++){
    if(shotM[i])continue;
    cands.push(i);
    weights.push(Math.pow(heat[i]+1,dp.exp)*(1+dp.noise*Math.random()));
  }
  var idx=cands.length?weightedPick(cands,weights):-1;
  if(idx<0)return;
  var res=fireAt(mine,shotM,idx);
  lastR=idx;
  a.burst(20+idx%G*MINI+8.5,MY+Math.floor(idx/G)*MINI+8.5,res.hit?o.coral:o.dim,res.hit?12:4);
  msg=res.hit?(res.sunk?'Rival sank your '+res.ship.n+'-long ship!':'Rival hit your fleet'):'Rival missed';
  if(!alive(mine))endRound(false);else{turn=1;rDelay=0;}
}
function playerFire(idx){
  if(over||turn!==1)return;
  if(shotE[idx])return;
  var res=fireAt(enemy,shotE,idx);
  a.burst(50+idx%G*CELL+15,46+Math.floor(idx/G)*CELL+15,res.hit?o.coral:o.dim,res.hit?16:6);
  msg=res.hit?(res.sunk?'You sank a '+res.ship.n+'-long ship!':'Hit!'):'Miss';
  if(!alive(enemy))endRound(true);else{turn=2;rDelay=0.65;}
}
function endRound(playerWon){
  over=true;
  if(playerWon){
    var bonus=alive(mine);
    var gain=Math.round((100+20*bonus+15*wins)*(1+0.5*diff));
    score+=gain;wins++;
    msg='Fleet destroyed. You win! (+'+gain+')';
    a.burst(200,200,o.blue,44);
    a.later(newRound,1800);
  }else{
    msg='Your fleet is gone';
    a.later(function(){a.over(score,'Fleet lost after '+wins+' win'+(wins===1?'':'s')+' on '+['Easy','Normal','Hard'][diff]+'. Score: '+score);},1300);
  }
}
function newRound(){
  enemy=makeFleet();mine=makeFleet();
  shotE=[];shotM=[];
  for(var i=0;i<G*G;i++){shotE.push(0);shotM.push(0);}
  turn=1;over=false;msg='';rDelay=0;lastR=-1;
}
function startGame(){
  score=0;wins=0;cursor=0;keyNav=false;hover=-1;
  newRound();
  a.fx=[];
  a.frame(step);
}
function step(dt){
  if(!over&&turn===2){
    rDelay-=dt;
    if(rDelay<=0){rDelay=99;rivalFire();}
  }
  g(ctx,400,560);
  x(ctx,msg||(turn===1?'Your shot':'Rival is aiming'),200,22,16,o.ink);
  p(ctx,46,42,308,308,8,'#12305a');
  var sunkCells={};
  enemy.ships.forEach(function(sh){if(sh.hit>=sh.n)sh.cells.forEach(function(c){sunkCells[c]=1;});});
  for(var i=0;i<G*G;i++){
    var cx=50+i%G*CELL,cy=46+Math.floor(i/G)*CELL;
    var st=shotE[i];
    p(ctx,cx+1,cy+1,28,28,4,sunkCells[i]?'#5a2440':(i===hover&&turn===1&&!over&&!st?'rgba(77,166,255,.32)':'rgba(77,166,255,.16)'));
    if(st===1)d(ctx,cx+15,cy+15,4,o.dim);
    if(st===2){d(ctx,cx+15,cy+15,9,o.coral);d(ctx,cx+15,cy+15,4,o.yellow);}
  }
  if(keyNav){ctx.strokeStyle=o.ink;ctx.lineWidth=3;r.L(ctx,50+cursor%G*CELL+1,46+Math.floor(cursor/G)*CELL+1,28,28,5);ctx.stroke();}
  x(ctx,'YOUR FLEET',105,366,12,o.dim);
  p(ctx,17,377,176,176,6,'#12305a');
  for(var j=0;j<G*G;j++){
    var mx=20+j%G*MINI,my=MY+Math.floor(j/G)*MINI;
    p(ctx,mx+1,my+1,15,15,3,mine.occ[j]!==undefined?o.blue:'rgba(77,166,255,.12)');
    if(shotM[j]===1)d(ctx,mx+8.5,my+8.5,2.5,o.dim);
    if(shotM[j]===2)d(ctx,mx+8.5,my+8.5,5,o.coral);
    if(j===lastR){ctx.strokeStyle=o.yellow;ctx.lineWidth=2;r.L(ctx,mx,my,MINI,MINI,3);ctx.stroke();}
  }
  x(ctx,'RIVAL SHIPS LEFT',300,386,12,o.dim);
  enemy.ships.forEach(function(sh,t){
    for(var m=0;m<sh.n;m++)p(ctx,236+16*m,402+24*t,14,14,3,sh.hit>=sh.n?o.coral:o.grid);
  });
  x(ctx,'YOURS: '+alive(mine)+' AFLOAT',300,540,12,o.ink);
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['WINS',wins]]);
}
a.pointer({down:function(pt){
  var cx=Math.floor((pt.x-50)/CELL),cy=Math.floor((pt.y-46)/CELL);
  keyNav=false;
  if(cx>=0&&cy>=0&&cx<G&&cy<G)playerFire(cy*G+cx);
},move:function(pt){
  var cx=Math.floor((pt.x-50)/CELL),cy=Math.floor((pt.y-46)/CELL);
  hover=(cx>=0&&cy>=0&&cx<G&&cy<G)?cy*G+cx:-1;
}});
a.press=function(key){
  var cx=cursor%G,cy=Math.floor(cursor/G);
  keyNav=true;
  if(key==='ArrowLeft'||key==='a')cx=Math.max(0,cx-1);
  else if(key==='ArrowRight'||key==='d')cx=Math.min(G-1,cx+1);
  else if(key==='ArrowUp'||key==='w')cy=Math.max(0,cy-1);
  else if(key==='ArrowDown'||key==='s')cy=Math.min(G-1,cy+1);
  else if(key===' '||key==='Enter')playerFire(cursor);
  cursor=cy*G+cx;
};
a.pad([['◀','ArrowLeft'],['▲','ArrowUp'],['▼','ArrowDown'],['▶','ArrowRight'],['Fire','Space']]);
a.opt('Difficulty',['Easy','Normal','Hard'],diff,function(i){diff=i;startGame();});
a.begin(startGame);
}),w('boxLine',k,'Box Line',o.green,'Draw lines between the dots. Close the fourth side of a box to claim it and go again.','Click near a line to draw it · or arrows to pick and Space to draw · claim more boxes than the rival',function(a){
var DOTX=56,DOTY=96,SP=72,ROWS=4,COLS=4,NLINES=40,HSPLIT=20;
var ctx=a.canvas(400,470);
var diff=1,lines,boxOwner,turn,over,score,wins,msg,moveDelay,keyCursor,keyNav,hoverEdge,lastEdge;
function topIdx(row,col){return row*COLS+col;}
function vertIdx(row,col){return HSPLIT+row*(COLS+1)+col;}
function boxEdges(br,bc){return[topIdx(br,bc),topIdx(br+1,bc),vertIdx(br,bc),vertIdx(br,bc+1)];}
function edgeBoxes(idx){
  var boxes=[],row,col;
  if(idx<HSPLIT){row=Math.floor(idx/COLS);col=idx%COLS;if(row>0)boxes.push({r:row-1,c:col});if(row<ROWS)boxes.push({r:row,c:col});}
  else{var i2=idx-HSPLIT;row=Math.floor(i2/(COLS+1));col=i2%(COLS+1);if(col>0)boxes.push({r:row,c:col-1});if(col<COLS)boxes.push({r:row,c:col});}
  return boxes;
}
function missingEdges(L,br,bc){return boxEdges(br,bc).filter(function(e){return!L[e];});}
function filledCount(L,br,bc){return boxEdges(br,bc).length-missingEdges(L,br,bc).length;}
function edgePixels(idx){
  var row,col;
  if(idx<HSPLIT){row=Math.floor(idx/COLS);col=idx%COLS;return[DOTX+col*SP,DOTY+row*SP,DOTX+(col+1)*SP,DOTY+row*SP];}
  var i2=idx-HSPLIT;row=Math.floor(i2/(COLS+1));col=i2%(COLS+1);return[DOTX+col*SP,DOTY+row*SP,DOTX+col*SP,DOTY+(row+1)*SP];
}
function unfilledEdges(){var r=[];for(var i=0;i<NLINES;i++)if(!lines[i])r.push(i);return r;}
function isCapturing(e){return edgeBoxes(e).some(function(bx){return!boxOwner[bx.r*COLS+bx.c]&&missingEdges(lines,bx.r,bx.c).length===1;});}
function simulateCascade(linesIn,ownerIn,firstEdge){
  var L=linesIn.slice(),Ow=ownerIn.slice(),queue=[firstEdge],steps=[],guard=0;
  while(queue.length&&guard++<100){
    var e=queue.shift();
    if(L[e])continue;
    L[e]=9;
    var completed=[];
    edgeBoxes(e).forEach(function(bx){
      var bi=bx.r*COLS+bx.c;
      if(Ow[bi])return;
      var miss=missingEdges(L,bx.r,bx.c);
      if(miss.length===0){Ow[bi]=9;completed.push(bi);}
      else if(miss.length===1)queue.push(miss[0]);
    });
    steps.push({edge:e,completed:completed});
  }
  return steps;
}
function totalGiveaway(linesIn,ownerIn){
  var L=linesIn.slice(),Ow=ownerIn.slice(),total=0,guard=0;
  while(guard++<60){
    var capEdge=-1;
    for(var i=0;i<NLINES&&capEdge<0;i++){
      if(L[i])continue;
      var boxes=edgeBoxes(i);
      for(var j=0;j<boxes.length;j++){
        var bx=boxes[j],bi=bx.r*COLS+bx.c;
        if(!Ow[bi]&&missingEdges(L,bx.r,bx.c).length===1){capEdge=i;break;}
      }
    }
    if(capEdge<0)break;
    var steps=simulateCascade(L,Ow,capEdge);
    steps.forEach(function(st){total+=st.completed.length;L[st.edge]=9;st.completed.forEach(function(bi){Ow[bi]=9;});});
  }
  return total;
}
function boxCenter(br,bc){return[DOTX+bc*SP+SP/2,DOTY+br*SP+SP/2];}
function playLine(idx,player){
  lines[idx]=player;
  var completed=0;
  edgeBoxes(idx).forEach(function(bx){
    var bi=bx.r*COLS+bx.c;
    if(!boxOwner[bi]&&missingEdges(lines,bx.r,bx.c).length===0){
      boxOwner[bi]=player;completed++;
      var ctr=boxCenter(bx.r,bx.c);
      a.burst(ctr[0],ctr[1],player===1?o.teal:o.coral,14);
    }
  });
  lastEdge=idx;
  return completed;
}
function boxCounts(){
  var mine=0,rival=0;
  boxOwner.forEach(function(v){if(v===1)mine++;else if(v===2)rival++;});
  return[mine,rival];
}
function endRoundCheck(){
  if(unfilledEdges().length)return false;
  var bc=boxCounts(),mine=bc[0],rival=bc[1];
  over=true;
  if(mine>rival){
    var gain=Math.round((100+10*(mine-rival)+15*wins)*(1+0.5*diff));
    score+=gain;wins++;
    msg='You win '+mine+' to '+rival+' (+'+gain+')';
    a.later(newRound,1700);
  }else if(mine===rival){
    msg='Draw, '+mine+' each';
    a.later(newRound,1700);
  }else{
    msg='You lose '+mine+' to '+rival;
    a.later(function(){a.over(score,'Lost '+mine+' to '+rival+' after '+wins+' win'+(wins===1?'':'s')+' on '+['Easy','Normal','Hard'][diff]+'. Score: '+score);},1300);
  }
  return true;
}
function applyMove(idx,player){
  var completed=playLine(idx,player);
  if(endRoundCheck())return;
  if(completed>0){
    turn=player;moveDelay=player===2?0.55:0;
  }else{
    turn=3-player;moveDelay=turn===2?0.5:0;
  }
}
function aiMove(){
  var open=unfilledEdges();
  if(!open.length)return;
  var capturing=open.filter(isCapturing);
  if(capturing.length&&!(diff===0&&Math.random()<0.4)){
    if(diff===2){
      var startEdge=u(capturing);
      var steps=simulateCascade(lines,boxOwner,startEdge);
      var totalBoxes=0;steps.forEach(function(st){totalBoxes+=st.completed.length;});
      var isFinal=(open.length-steps.length)<=0;
      if(!isFinal&&totalBoxes===2&&steps.length>=2){applyMove(steps[1].edge,2);return;}
      applyMove(startEdge,2);return;
    }
    var best=capturing[0],bestN=-1;
    capturing.forEach(function(e){
      var n=edgeBoxes(e).filter(function(bx){return!boxOwner[bx.r*COLS+bx.c]&&missingEdges(lines,bx.r,bx.c).length===1;}).length;
      if(n>bestN){bestN=n;best=e;}
    });
    applyMove(best,2);return;
  }
  var safe=open.filter(function(e){return edgeBoxes(e).every(function(bx){return filledCount(lines,bx.r,bx.c)<=1;});});
  if(diff>0&&safe.length){
    var bestScore=1e9,cands=[];
    safe.forEach(function(e){
      var sc=0;
      edgeBoxes(e).forEach(function(bx){sc+=filledCount(lines,bx.r,bx.c);});
      if(sc<bestScore){bestScore=sc;cands=[e];}else if(sc===bestScore)cands.push(e);
    });
    applyMove(u(cands),2);return;
  }
  if(diff===0&&safe.length){applyMove(u(safe),2);return;}
  if(diff===0){applyMove(u(open),2);return;}
  var bestCost=1e9,bestMoves=[];
  open.forEach(function(e){
    var testLines=lines.slice();testLines[e]=2;
    var cost=totalGiveaway(testLines,boxOwner);
    if(cost<bestCost){bestCost=cost;bestMoves=[e];}else if(cost===bestCost)bestMoves.push(e);
  });
  applyMove(u(bestMoves),2);
}
function nearestEdge(pt){
  var best=-1,bestD=16;
  for(var i=0;i<NLINES;i++){
    if(lines[i])continue;
    var ep=edgePixels(i),ex=ep[2]-ep[0],ey=ep[3]-ep[1];
    var tt=s(((pt.x-ep[0])*ex+(pt.y-ep[1])*ey)/(ex*ex+ey*ey),0,1);
    var d2=Math.hypot(pt.x-(ep[0]+ex*tt),pt.y-(ep[1]+ey*tt));
    if(d2<bestD){bestD=d2;best=i;}
  }
  return best;
}
function newRound(){
  lines=[];boxOwner=[];
  for(var i=0;i<NLINES;i++)lines.push(0);
  for(var j=0;j<ROWS*COLS;j++)boxOwner.push(0);
  turn=1;over=false;msg='';moveDelay=0;lastEdge=-1;
}
function startGame(){
  score=0;wins=0;keyCursor=0;keyNav=false;hoverEdge=-1;
  newRound();
  a.fx=[];
  a.frame(step);
}
function step(dt){
  if(!over&&turn===2){
    moveDelay-=dt;
    if(moveDelay<=0){moveDelay=99;aiMove();}
  }
  g(ctx,400,470);
  var bc=boxCounts();
  d(ctx,70,40,12,o.teal);x(ctx,bc[0],94,40,20,o.ink,'left');
  d(ctx,290,40,12,o.coral);x(ctx,bc[1],314,40,20,o.ink,'left');
  for(var br=0;br<ROWS;br++)for(var bc2=0;bc2<COLS;bc2++){
    var owner=boxOwner[br*COLS+bc2];
    if(owner)p(ctx,DOTX+bc2*SP+6,DOTY+br*SP+6,60,60,10,owner===1?'rgba(47,211,199,.5)':'rgba(255,107,74,.5)');
  }
  for(var i=0;i<NLINES;i++){
    var ep=edgePixels(i);
    if(lines[i])v(ctx,ep[0],ep[1],ep[2],ep[3],i===lastEdge?o.yellow:(lines[i]===1?o.teal:o.coral),6);
    else v(ctx,ep[0],ep[1],ep[2],ep[3],i===hoverEdge&&turn===1&&!over?'rgba(255,255,255,.35)':'rgba(255,255,255,.08)',i===hoverEdge&&turn===1&&!over?5:3);
  }
  if(keyNav&&!lines[keyCursor]){var kp=edgePixels(keyCursor);v(ctx,kp[0],kp[1],kp[2],kp[3],o.ink,6);}
  for(var rr=0;rr<=ROWS;rr++)for(var cc=0;cc<=COLS;cc++)d(ctx,DOTX+cc*SP,DOTY+rr*SP,6,o.ink);
  x(ctx,msg||(turn===1?'Your line':'Rival is choosing'),200,424,16,o.ink);
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['WINS',wins]]);
}
a.pointer({down:function(pt){
  keyNav=false;
  if(over||turn!==1)return;
  var e=nearestEdge(pt);
  if(e>-1)applyMove(e,1);
},move:function(pt){
  hoverEdge=(over||turn!==1)?-1:nearestEdge(pt);
}});
a.press=function(key){
  keyNav=true;
  var dir=0;
  if(key==='ArrowLeft'||key==='ArrowUp'||key==='a'||key==='w')dir=-1;
  else if(key==='ArrowRight'||key==='ArrowDown'||key==='d'||key==='s')dir=1;
  if(dir){
    for(var n=1;n<=NLINES;n++){
      var cand=(keyCursor+dir*n+NLINES*2)%NLINES;
      if(!lines[cand]){keyCursor=cand;break;}
    }
  }else if((key===' '||key==='Enter')&&turn===1&&!over&&!lines[keyCursor]){
    applyMove(keyCursor,1);
  }
};
a.pad([['◀','ArrowLeft'],['▶','ArrowRight'],['Draw','Space']]);
a.opt('Difficulty',['Easy','Normal','Hard'],diff,function(i){diff=i;startGame();});
a.begin(startGame);
}),w('laneDefense',k,'Lane Defense',o.orange,'Plant defenders in five lanes and stop the marching horde reaching the house.','Click a defender then a tile · click glowing energy to collect it · keys 1-5 pick a defender',function(a){
var CX=20,CY=96,CELL=40,LANES=5,COLS=9;
var ctx=a.canvas(400,320);
var TYPES=[{n:'Spark',cost:50,hp:30,col:o.yellow},{n:'Bolt',cost:100,hp:30,col:o.green},{n:'Wall',cost:50,hp:90,col:o.orange},{n:'Frost',cost:150,hp:30,col:o.blue},{n:'Dig',cost:0,hp:0,col:o.coral}];
var ENEMY_BASE=[{hp:10,sp:13,col:o.magenta,r:11},{hp:22,sp:12,col:o.violet,r:12},{hp:9,sp:30,col:o.coral,r:10},{hp:55,sp:9,col:o.teal,r:14}];
var diff=1,DIFF=[{hpMul:0.88,spMul:0.9,spawnMul:1.18,clockBonus:0,bias:0},{hpMul:1,spMul:1,spawnMul:1,clockBonus:0,bias:1.1},{hpMul:1.18,spMul:1.12,spawnMul:0.82,clockBonus:22,bias:2.2}];
var grid,enemies,shots,orbs,energy,selType,clock,spawnT,orbT,defeated,score,cursor,keyNav,flash;
function laneStrength(lane){
  var s=0;
  for(var col=0;col<COLS;col++){
    var d=grid[lane][col];
    if(d)s+=d.hp+(d.t===2?24:d.t===0?4:34);
  }
  return s;
}
function pickSpawnLane(){
  var dp=DIFF[diff];
  if(dp.bias<=0)return f(LANES);
  var weights=[],total=0,i;
  for(i=0;i<LANES;i++){var w2=1/Math.pow(laneStrength(i)+30,dp.bias);weights.push(w2);total+=w2;}
  var r=Math.random()*total;
  for(i=0;i<LANES;i++){r-=weights[i];if(r<=0)return i;}
  return LANES-1;
}
function spawnEnemy(){
  var dp=DIFF[diff],heff=clock+dp.