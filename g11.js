;if(r.y>420)for(n=0;n<6;n++)Math.hypot(r.x-(45+62*n),r.y-455)<26&&S(n);else o=Math.floor((r.x-20)/v),e=Math.floor((r.y-w)/v),o>=0&&e>=0&&o<s&&e<s&&S(t[e][o])}}),r.press=function(r){r>='1'&&r<='6'&&1===r.length&&S(+r-1)},r.begin(function(){n=0,i=0,u=0,k(),r.fx=[],r.frame(E)})}),w('oddTileOut',M,'Odd Tile Out',o.yellow,'One tile is a slightly different shade. Find it before the clock runs dry.','Click or tap the odd tile · right pick adds time · wrong pick costs time',function(r){var t,n,e,a,i,l,c,u,h,s,d,v=400,w=r.canvas(v,460);function b(){a=Math.min(9,2+Math.floor(t/2)),i=f(a*a),l=f(360),c=45+f(35),u=42+f(18),h=Math.max(2.5,22-1.1*t)*(Math.random()<.5?1:-1)}function m(f){var b,m,M,k=360/a,S=d>0?4*Math.sin(80*d):0;if(d>0&&(d-=f),(n-=f)<=0)r.over(e,'Time is up after '+t+' tiles. Score: '+e);else{for(g(w,v,460),s>0&&(w.fillStyle='rgba(255,107,74,'+.25*s+')',w.fillRect(0,0,v,460),s-=2.5*f),p(w,20,30,360,22,11,o.grid),p(w,20,30,Math.max(0,360*n/45),22,11,n<8?o.coral:o.yellow),
x(w,Math.ceil(n)+'s',200,41,13,o.bg),b=0;b<a*a;b++)m=20+b%a*k,M=80+Math.floor(b/a)*k,p(w,m+3+S,M+3,k-6,k-6,Math.min(14,k/5),'hsl('+l+','+c+'%,'+(b===i?u+h:u)+'%)');r.fxStep(f),r.hud([['SCORE',y(e)],['ROUND',t+1]])}}r.pointer({down:function(l){var f=360/a,c=Math.floor((l.x-20)/f),u=Math.floor((l.y-80)/f);c<0||u<0||c>=a||u>=a||(u*a+c===i?(e+=10+Math.min(20,t),t++,n=Math.min(45,n+1.5),r.burst(l.x,l.y,o.yellow,10),b()):(n-=3,d=.3,s=1))}}),r.begin(function(){t=0,n=30,e=0,s=0,d=0,b(),r.fx=[],r.frame(m)})}),w('numberGrid',M,'Number Grid',o.orange,'Slide the whole board. Equal numbers merge into their sum. Chase the biggest tile you can.','Arrow keys / WASD or swipe · merge equal tiles',function(r){var t,n,e,a,i,l,f=84,c=r.canvas(400,470);function h(){var r,n,o=[];for(r=0;r<4;r++)for(n=0;n<4;n++)t[r][n]||o.push([r,n]);return o}function s(){var r,o=h();o.length&&(r=u(o),t[r[0]][r[1]]=Math.random()<.9?2:4,n[r[0]][r[1]]=.2)}function d(r,t,n){return 0===r?[t,n]:1===r?[t,3-n]:2===r?[n,t]:[3-n,t]}
function v(f){var c,u,y,p,x,v,g=!1;if(!a){for(c=0;c<4;c++){for(y=[],u=0;u<4;u++)x=d(f,c,u),t[x[0]][x[1]]&&y.push(t[x[0]][x[1]]);for(p=[],u=0;u<y.length;u++)y[u]===y[u+1]?(p.push(2*y[u]),e+=2*y[u],2*y[u]>i&&(i=2*y[u]),v=p.length-1,y[u+1]=0,u++,p[v]=-p[v]):p.push(y[u]);for(u=0;u<4;u++)x=d(f,c,u),(v=u<p.length?p[u]:0)<0&&(v=-v,n[x[0]][x[1]]=.2),t[x[0]][x[1]]!==v&&(g=!0),t[x[0]][x[1]]=v}g&&(s(),i>=2048&&!l&&(l=!0,r.burst(200,240,o.yellow,60)),function(){var r,n;if(h().length)return!0;for(r=0;r<4;r++)for(n=0;n<4;n++){if(n<3&&t[r][n]===t[r][n+1])return!0;if(r<3&&t[r][n]===t[r+1][n])return!0}return!1}()||(a=!0,r.later(function(){r.over(e,'Board locked. Biggest tile '+i+' · Score: '+e)},700)))}}function w(a){var l,u,h,s,d,v,w;for(g(c,400,470),p(c,24,88,352,352,14,o.grid),l=0;l<4;l++)for(u=0;u<4;u++)d=32+u*f,v=96+l*f,h=t[l][u],p(c,d+4,v+4,76,76,10,'rgba(255,255,255,.05)'),h&&(n[l][u]>0&&(n[l][u]-=a),s=1+.6*Math.max(0,n[l][u]),w=(Math.log(h)/Math.LN2*32+10)%360,
p(c,d+4+76*(1-s)/2,v+4+76*(1-s)/2,76*s,76*s,10,'hsl('+w+',70%,58%)'),x(c,h,d+42,v+42+1,h<100?32:h<1e3?28:22,o.bg));x(c,'BEST TILE '+i,200,50,20,o.yellow),r.fxStep(a),r.hud([['SCORE',y(e)],['BEST TILE',i]])}r.press=function(r){var t={ArrowLeft:0,a:0,ArrowRight:1,d:1,ArrowUp:2,w:2,ArrowDown:3,s:3}[r];void 0!==t&&v(t)},r.swipe(function(r){v({left:0,right:1,up:2,down:3}[r])}),r.pad([['◀','ArrowLeft'],['▲','ArrowUp'],['▼','ArrowDown'],['▶','ArrowRight']]),r.begin(function(){var o,f;for(t=[],n=[],o=0;o<4;o++)for(t.push([]),n.push([]),f=0;f<4;f++)t[o].push(0),n[o].push(0);e=0,a=!1,i=2,l=!1,s(),s(),r.fx=[],r.frame(w)})}),w('discFlip',k,'Disc Flip',o.teal,'Trap the rival discs between yours to flip them. Corners are gold, and giving one away can cost the game.','Click a dotted square · arrows + Space work too · win to face a fresh rival',function(a){
var CELLPX=46,PADX=16,PADY=62;
var ctx=a.canvas(400,470);
var DIRS=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
var CORNERS={0:1,7:1,56:1,63:1};
var XSQ={9:0,14:7,49:56,54:63};
var CSQ={1:0,8:0,6:7,15:7,48:56,57:56,62:63,55:63};
var BASE=[[0,-20,10,5],[-20,-50,-2,-2],[10,-2,-1,-1],[5,-2,-1,-1]];
var diff=1,DIFF=[{depth:1,rand:0.25},{depth:4,rand:0},{depth:5,rand:0}];
var board,turn,over,score,wins,msg,keyNav,cursor,lastMove,aiDelay;
function inBounds(r,c){return r>=0&&r<8&&c>=0&&c<8;}
function flipsFor(bd,idx,player){
  if(bd[idx])return[];
  var row=idx>>3,col=idx&7,all=[];
  DIRS.forEach(function(dir){
    var line=[],rr=row+dir[0],cc=col+dir[1];
    while(inBounds(rr,cc)&&bd[rr*8+cc]===3-player){line.push(rr*8+cc);rr+=dir[0];cc+=dir[1];}
    if(line.length&&inBounds(rr,cc)&&bd[rr*8+cc]===player)all=all.concat(line);
  });
  return all;
}
function legalMoves(bd,player){
  var moves=[];
  for(var i=0;i<64;i++){var fl=flipsFor(bd,i,player);if(fl.length)moves.push({i:i,f:fl});}
  return moves;
}
function applyMove(bd,move,player){
  var nb=bd.slice();
  nb[move.i]=player;
  move.f.forEach(function(c){nb[c]=player;});
  return nb;
}
function countDiscs(bd,player){var n=0;for(var i=0;i<64;i++)if(bd[i]===player)n++;return n;}
function cellWeight(bd,idx){
  if(CORNERS[idx])return 100;
  if(XSQ[idx]!==undefined)return bd[XSQ[idx]]===0?-50:8;
  if(CSQ[idx]!==undefined)return bd[CSQ[idx]]===0?-20:8;
  var r=idx>>3,c=idx&7;
  return BASE[Math.min(r,7-r)][Math.min(c,7-c)];
}
function evaluate(bd){
  var score2=0;
  for(var i=0;i<64;i++){
    if(bd[i]===2)score2+=cellWeight(bd,i);
    else if(bd[i]===1)score2-=cellWeight(bd,i);
  }
  return score2+6*(legalMoves(bd,2).length-legalMoves(bd,1).length);
}
function orderMoves(bd,moves,player){
  return moves.slice().sort(function(m1,m2){
    var w1=cellWeight(bd,m1.i)+2*m1.f.length,w2=cellWeight(bd,m2.i)+2*m2.f.length;
    return player===2?w2-w1:w1-w2;
  });
}
function search(bd,player,depth,alpha,beta){
  var moves=legalMoves(bd,player);
  if(!moves.length){
    var oppMoves=legalMoves(bd,3-player);
    if(!oppMoves.length)return 500*(countDiscs(bd,2)-countDiscs(bd,1));
    return depth>0?search(bd,3-player,depth-1,alpha,beta):evaluate(bd);
  }
  if(depth===0)return evaluate(bd);
  var ordered=orderMoves(bd,moves,player),val,i;
  if(player===2){
    val=-1e9;
    for(i=0;i<ordered.length;i++){
      val=Math.max(val,search(applyMove(bd,ordered[i],2),1,depth-1,alpha,beta));
      alpha=Math.max(alpha,val);
      if(alpha>=beta)break;
    }
  }else{
    val=1e9;
    for(i=0;i<ordered.length;i++){
      val=Math.min(val,search(applyMove(bd,ordered[i],1),2,depth-1,alpha,beta));
      beta=Math.min(beta,val);
      if(alpha>=beta)break;
    }
  }
  return val;
}
function newGame(){
  board=new Array(64).fill(0);
  board[27]=2;board[36]=2;board[28]=1;board[35]=1;
  turn=1;over=false;msg='';lastMove=-1;aiDelay=0;
}
function startGame(){
  score=0;wins=0;keyNav=false;cursor=27;
  newGame();
  a.fx=[];
  a.frame(step);
}
function afterMove(){
  var next=3-turn;
  if(legalMoves(board,next).length){turn=next;msg='';aiDelay=0.55;return;}
  if(legalMoves(board,turn).length){msg=turn===1?'Rival has no move. You go again.':'You have no move. Rival goes again.';aiDelay=0.55;return;}
  finishGame();
}
function finishGame(){
  over=true;
  var mine=countDiscs(board,1),rival=countDiscs(board,2);
  if(mine>rival){
    var gain=Math.round((100+5*(mine-rival)+15*wins)*(1+0.5*diff));
    score+=gain;wins++;
    msg='You win '+mine+' to '+rival+' (+'+gain+')';
    a.burst(200,250,o.teal,40);
    a.later(newGame,1600);
  }else if(mine===rival){
    msg='Draw, '+mine+' each';
    a.later(newGame,1600);
  }else{
    msg='You lose '+mine+' to '+rival;
    a.later(function(){a.over(score,'Lost '+mine+' to '+rival+' after '+wins+' win'+(wins===1?'':'s')+' on '+['Easy','Normal','Hard'][diff]+'. Score: '+score);},1300);
  }
}
function playerMove(idx){
  if(over||turn!==1)return;
  var fl=flipsFor(board,idx,1);
  if(!fl.length)return;
  board=applyMove(board,{i:idx,f:fl},1);
  lastMove=idx;
  fl.forEach(function(c){a.burst(PADX+(c&7)*CELLPX+23,PADY+(c>>3)*CELLPX+23,o.teal,2);});
  afterMove();
}
function aiMove(){
  var moves=legalMoves(board,2);
  if(!moves.length)return;
  var dp=DIFF[diff],chosen;
  if(Math.random()<dp.rand){
    chosen=u(moves);
  }else if(dp.depth<=1){
    var bestVal=-1e9,best=[];
    moves.forEach(function(m){
      var v2=m.f.length+0.1*cellWeight(board,m.i);
      if(v2>bestVal+1e-9){bestVal=v2;best=[m];}else if(Math.abs(v2-bestVal)<1e-9)best.push(m);
    });
    chosen=u(best);
  }else{
    var alpha=-1e9,beta=1e9,bestVal2=-1e9,best2=[];
    orderMoves(board,moves,2).forEach(function(m){
      var v3=search(applyMove(board,m,2),1,dp.depth-1,alpha,beta);
      if(v3>bestVal2+1e-9){bestVal2=v3;best2=[m];}else if(Math.abs(v3-bestVal2)<1e-9)best2.push(m);
      alpha=Math.max(alpha,bestVal2);
    });
    chosen=u(best2);
  }
  board=applyMove(board,chosen,2);
  lastMove=chosen.i;
  chosen.f.forEach(function(c){a.burst(PADX+(c&7)*CELLPX+23,PADY+(c>>3)*CELLPX+23,o.coral,2);});
  afterMove();
}
function step(dt){
  if(!over&&turn===2){
    aiDelay-=dt;
    if(aiDelay<=0){aiDelay=99;aiMove();}
  }
  g(ctx,400,470);
  p(ctx,10,56,380,380,10,'#155e4d');
  for(var i=0;i<64;i++){
    var cx=PADX+(i&7)*CELLPX,cy=PADY+(i>>3)*CELLPX;
    p(ctx,cx+1,cy+1,44,44,4,((i&7)+(i>>3))%2?'#1a6f5a':'#1e7d65');
    if(board[i]){
      d(ctx,cx+23,cy+23,17.48,board[i]===1?o.teal:o.coral);
      d(ctx,cx+17,cy+17,5,'rgba(255,255,255,.3)');
    }
    if(i===lastMove){ctx.strokeStyle=o.yellow;ctx.lineWidth=3;r.L(ctx,cx+3,cy+3,40,40,6);ctx.stroke();}
  }
  if(turn===1&&!over)legalMoves(board,1).forEach(function(m){d(ctx,PADX+(m.i&7)*CELLPX+23,PADY+(m.i>>3)*CELLPX+23,5,'rgba(255,255,255,.55)');});
  if(keyNav&&!over){var kx=PADX+(cursor&7)*CELLPX,ky=PADY+(cursor>>3)*CELLPX;ctx.strokeStyle=o.ink;ctx.lineWidth=3;r.L(ctx,kx+1,ky+1,44,44,6);ctx.stroke();}
  var mine=countDiscs(board,1),rival=countDiscs(board,2);
  d(ctx,60,28,12,o.teal);x(ctx,mine,84,28,20,o.ink,'left');
  d(ctx,300,28,12,o.coral);x(ctx,rival,324,28,20,o.ink,'left');
  x(ctx,msg||(turn===1?'Your move':'Rival is thinking'),200,458,16,o.ink);
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['WINS',wins]]);
}
a.pointer({down:function(pt){
  var col=Math.floor((pt.x-PADX)/CELLPX),row=Math.floor((pt.y-PADY)/CELLPX);
  keyNav=false;
  if(inBounds(row,col))playerMove(row*8+col);
}});
a.press=function(key){
  keyNav=true;
  var row=cursor>>3,col=cursor&7;
  if(key==='ArrowLeft'||key==='a')col=col>0?col-1:col;
  else if(key==='ArrowRight'||key==='d')col=col<7?col+1:col;
  else if(key==='ArrowUp'||key==='w')row=row>0?row-1:row;
  else if(key==='ArrowDown'||key==='s')row=row<7?row+1:row;
  else if((key===' '||key==='Enter')&&turn===1)playerMove(cursor);
  cursor=row*8+col;
};
a.pad([['◀','ArrowLeft'],['▲','ArrowUp'],['▼','ArrowDown'],['▶','ArrowRight'],['Place','Space']]);
a.opt('Difficulty',['Easy','Normal','Hard'],diff,function(i){diff=i;startGame();});
a.begin(startGame);
}),w('draughts',k,'Draughts',o.coral,'Hop diagonally, capture every jump on offer, and crown a king on the far row.','Click a piece then a highlighted square · captures are compulsory · beat the rival to move on',function(a){
function startGame3D(){
var CELLPX=46,PADX=16,PADY=62,W=400,H=470;
var DIRS_ALL=[[-1,-1],[-1,1],[1,-1],[1,1]];
var diff=1,DIFF=[{depth:1,rand:0.35},{depth:5,rand:0},{depth:7,rand:0}];
var board,turn,over,score,wins,msg,keyNav,cursor,selected,legal,lastMove,noCapCount,aiDelay;

var wrapDiv=document.createElement('div');
wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
a.el.appendChild(wrapDiv);
var canvasWrap=document.createElement('div');
canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:400/470;margin:0 auto';
wrapDiv.appendChild(canvasWrap);

var renderer3d=extMakeWebGLRenderer();
if(!renderer3d){a.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
renderer3d.setSize(W,H);
renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
renderer3d.setClearColor(0x120a24,1);
canvasWrap.appendChild(renderer3d.domElement);
a.cv=renderer3d.domElement;a.w=W;a.h=H;

var SCALE3d=20/W;
var ZH2=H*SCALE3d/2;
var camRatio3d=ZH2/9.375;
function mapX3d(px2){return px2*SCALE3d-10}
function mapZ3d(py){return py*SCALE3d-ZH2}

var scene3d=new THREE.Scene();
scene3d.fog=new THREE.Fog(0x120a24,24*camRatio3d,50*camRatio3d);
var camera3d=new THREE.PerspectiveCamera(64,W/H,0.1,200);
camera3d.position.set(0,16*camRatio3d,11*camRatio3d);
camera3d.lookAt(0,0,0);

scene3d.add(new THREE.AmbientLight(0xcfe9ff,0.8));
var sun3d=new THREE.DirectionalLight(0xffffff,0.7);
sun3d.position.set(8,20,8);
scene3d.add(sun3d);

var boardTexCanvas=document.createElement('canvas');
boardTexCanvas.width=W;boardTexCanvas.height=H;
var ctx=boardTexCanvas.getContext('2d');
var boardTexture=new THREE.CanvasTexture(boardTexCanvas);
var floor3d=new THREE.Mesh(new THREE.PlaneGeometry(20,2*ZH2),new THREE.MeshStandardMaterial({map:boardTexture,roughness:0.9}));
floor3d.rotation.x=-Math.PI/2;
scene3d.add(floor3d);

function disposeGroupChildren(grp){
  while(grp.children.length){
    var c2=grp.children.pop();
    grp.remove(c2);
    extDisposeThree(c2)
  }
}
var pieceGroup3d=new THREE.Group();scene3d.add(pieceGroup3d);
var mineMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.teal),emissive:new THREE.Color(o.teal),emissiveIntensity:0.25,roughness:0.45});
var rivalMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.coral),emissive:new THREE.Color(o.coral),emissiveIntensity:0.25,roughness:0.45});
var crownMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.yellow),emissive:new THREE.Color(o.yellow),emissiveIntensity:0.4,roughness:0.4});

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

function isMine(piece,player){return player===1?(piece===1||piece===2):(piece===3||piece===4);}
function dirsFor(piece){
  if(piece===2||piece===4)return DIRS_ALL;
  return piece===1?[[-1,-1],[-1,1]]:[[1,-1],[1,1]];
}
function crownRow(idx,player){return(idx>>3)===(player===1?0:7);}
function genPieceMoves(bd,idx,player,out){
  var piece=bd[idx],isKing=piece===2||piece===4,bd2=bd.slice();
  bd2[idx]=0;
  (function walk(pos,caps,path){
    var row=pos>>3,col=pos&7,found=false;
    (isKing?DIRS_ALL:dirsFor(piece)).forEach(function(dir){
      var midR=row+dir[0],midC=col+dir[1],landR=row+2*dir[0],landC=col+2*dir[1];
      if(landR<0||landR>7||landC<0||landC>7)return;
      var midIdx=midR*8+midC,landIdx=landR*8+landC;
      if(!isMine(bd2[midIdx],3-player))return;
      if(caps.indexOf(midIdx)>-1)return;
      if(bd2[landIdx])return;
      found=true;
      var newCaps=caps.concat([midIdx]),newPath=path.concat([landIdx]);
      if(!isKing&&crownRow(landIdx,player)){out.push({from:idx,to:landIdx,caps:newCaps,path:newPath});}
      else walk(landIdx,newCaps,newPath);
    });
    if(!found&&caps.length)out.push({from:idx,to:pos,caps:caps,path:path});
  })(idx,[],[idx]);
}
function legalMoves(bd,player){
  var out=[],i;
  for(i=0;i<64;i++)if(isMine(bd[i],player))genPieceMoves(bd,i,player,out);
  if(out.length)return out;
  for(i=0;i<64;i++){
    if(!isMine(bd[i],player))continue;
    var piece=bd[i],isKing=piece===2||piece===4,row=i>>3,col=i&7;
    (isKing?DIRS_ALL:dirsFor(piece)).forEach(function(dir){
      var rr=row+dir[0],cc=col+dir[1];
      if(rr<0||rr>7||cc<0||cc>7)return;
      var to=rr*8+cc;
      if(!bd[to])out.push({from:i,to:to,caps:[],path:[i,to]});
    });
  }
  return out;
}
function applyMove(bd,move){
  var nb=bd.slice(),piece=nb[move.from],mover=piece<=2?1:2;
  nb[move.from]=0;
  move.caps.forEach(function(c){nb[c]=0;});
  if((piece===1||piece===3)&&crownRow(move.to,mover))piece+=1;
  nb[move.to]=piece;
  return nb;
}
function evaluate(bd){
  var score2=0,i,pc,row,col;
  for(i=0;i<64;i++){
    pc=bd[i];
    if(!pc)continue;
    row=i>>3;col=i&7;
    var centerBonus=(col>1&&col<6&&row>1&&row<6)?2:0;
    if(pc===3)score2+=100+4*row+centerBonus+(row===0?4:0);
    else if(pc===4)score2+=175+centerBonus;
    else if(pc===1)score2-=100+4*(7-row)+centerBonus+(row===7?4:0);
    else if(pc===2)score2-=175+centerBonus;
  }
  score2+=1.5*(legalMoves(bd,2).length-legalMoves(bd,1).length);
  return score2;
}
function orderMoves(bd,moves,player){
  return moves.slice().sort(function(m1,m2){
    var v1=m1.caps.length*20+(player===2?m1.to>>3:7-(m1.to>>3)),v2=m2.caps.length*20+(player===2?m2.to>>3:7-(m2.to>>3));
    return v2-v1;
  });
}
function search(bd,player,depth,alpha,beta){
  var moves=legalMoves(bd,player);
  if(!moves.length)return player===2?-9000-depth:9000+depth;
  if(depth===0)return evaluate(bd);
  var ordered=orderMoves(bd,moves,player),val,i;
  if(player===2){
    val=-1e9;
    for(i=0;i<ordered.length;i++){
      val=Math.max(val,search(applyMove(bd,ordered[i]),1,depth-1,alpha,beta));
      alpha=Math.max(alpha,val);
      if(alpha>=beta)break;
    }
  }else{
    val=1e9;
    for(i=0;i<ordered.length;i++){
      val=Math.min(val,search(applyMove(bd,ordered[i]),2,depth-1,alpha,beta));
      beta=Math.min(beta,val);
      if(alpha>=beta)break;
    }
  }
  return val;
}
function newGame(){
  board=new Array(64).fill(0);
  for(var i=0;i<64;i++){
    var row=i>>3,col=i&7;
    if((row+col)%2){
      if(row<3)board[i]=3;
      else if(row>4)board[i]=1;
    }
  }
  turn=1;over=false;selected=-1;legal=legalMoves(board,1);msg='';lastMove=null;noCapCount=0;aiDelay=0;
}
function startGame(){
  score=0;wins=0;keyNav=false;cursor=0;
  newGame();
  a.fx=[];
  a.frame(step);
}
function finishGame(result){
  over=true;
  if(result===1){
    var gain=Math.round((140+25*wins)*(1+0.5*diff));
    score+=gain;wins++;
    msg='You win! (+'+gain+')';
    spawnParticles3d(mapX3d(200),mapZ3d(250),o.coral,40);
    a.later(newGame,1600);
  }else if(result===0){
    msg='Draw';
    a.later(newGame,1600);
  }else{
    msg='You lose';
    a.later(function(){a.over(score,'Beaten after '+wins+' win'+(wins===1?'':'s')+' on '+['Easy','Normal','Hard'][diff]+'. Score: '+score);},1300);
  }
}
function commitMove(move){
  var piece=board[move.from];
  if(move.caps.length||piece===1||piece===3)noCapCount=0;else noCapCount++;
  move.caps.forEach(function(c){spawnParticles3d(mapX3d(PADX+(c&7)*CELLPX+23),mapZ3d(PADY+(c>>3)*CELLPX+23),turn===1?o.coral:o.teal,6);});
  board=applyMove(board,move);
  lastMove=move;
  selected=-1;
  var next=3-turn;
  legal=legalMoves(board,next);
  if(legal.length){
    turn=next;
    if(noCapCount>=60)finishGame(0);
    else{aiDelay=0.5;msg='';}
  }else{
    finishGame(turn===1?1:2);
  }
}
function aiMove(){
  var moves=legalMoves(board,2);
  if(!moves.length)return;
  var dp=DIFF[diff],chosen;
  if(Math.random()<dp.rand){
    chosen=u(moves);
  }else{
    var alpha=-1e9,best=-1e9,bestMoves=[];
    orderMoves(board,moves,2).forEach(function(m){
      var v=search(applyMove(board,m),1,dp.depth-1,alpha,1e9);
      if(v>best+1e-9){best=v;bestMoves=[m];}else if(Math.abs(v-best)<1e-9)bestMoves.push(m);
      alpha=Math.max(alpha,best);
    });
    chosen=u(bestMoves);
  }
  commitMove(chosen);
}
function tryPlayerMove(idx){
  if(over||turn!==1)return;
  if(selected>-1){
    var mv=legal.filter(function(m){return m.from===selected&&m.to===idx;})[0];
    if(mv){commitMove(mv);return;}
  }
  if(board[idx]&&isMine(board[idx],1)&&legal.some(function(m){return m.from===idx;}))selected=idx;
  else selected=-1;
}
function step(dt){
  if(!over&&turn===2){
    aiDelay-=dt;
    if(aiDelay<=0){aiDelay=99;aiMove();}
  }
  render3d(dt)
}
function render3d(dt){
  g(ctx,400,470);
  p(ctx,10,56,380,380,10,o.grid);
  var targets=[];
  if(selected>-1)legal.forEach(function(m){if(m.from===selected)targets.push(m.to);});
  var mine=0,rival=0,i,pieceRenderList=[];
  for(i=0;i<64;i++){
    var cx=PADX+(i&7)*CELLPX,cy=PADY+(i>>3)*CELLPX,pc=board[i];
    p(ctx,cx,cy,CELLPX,CELLPX,2,((i&7)+(i>>3))%2?'#3a2f6b':'#241C47');
    if(lastMove&&(i===lastMove.from||i===lastMove.to))p(ctx,cx+2,cy+2,42,42,4,'rgba(255,209,102,.16)');
    if(targets.indexOf(i)>-1)d(ctx,cx+23,cy+23,8,o.yellow);
    if(pc){
      pc<=2?mine++:rival++;
      pieceRenderList.push({cx:cx,cy:cy,pc:pc});
    }
    if(i===selected){ctx.strokeStyle=o.ink;ctx.lineWidth=3;r.L(ctx,cx+2,cy+2,42,42,6);ctx.stroke();}
  }
  if(keyNav&&!over){var kx=PADX+(cursor&7)*CELLPX,ky=PADY+(cursor>>3)*CELLPX;ctx.strokeStyle=o.ink;ctx.lineWidth=2;r.L(ctx,kx+3,ky+3,40,40,6);ctx.stroke();}
  d(ctx,60,28,12,o.teal);x(ctx,mine,84,28,20,o.ink,'left');
  d(ctx,300,28,12,o.coral);x(ctx,rival,324,28,20,o.ink,'left');
  x(ctx,msg||(turn===1?(legal.length&&legal[0].caps.length?'You must capture':'Your move'):'Rival is thinking'),200,458,16,o.ink);
  boardTexture.needsUpdate=true;

  disposeGroupChildren(pieceGroup3d);
  pieceRenderList.forEach(function(pr){
    var isKing=pr.pc===2||pr.pc===4;
    var mat=pr.pc<=2?mineMat3d:rivalMat3d;
    var body=new THREE.Mesh(new THREE.CylinderGeometry(0.78,0.78,0.3,18),mat);
    body.position.set(mapX3d(pr.cx+23),0.15,mapZ3d(pr.cy+23));
    pieceGroup3d.add(body);
    if(isKing){
      var crown=new THREE.Mesh(new THREE.ConeGeometry(0.38,0.3,6),crownMat3d);
      crown.position.set(mapX3d(pr.cx+23),0.46,mapZ3d(pr.cy+23));
      pieceGroup3d.add(crown);
    }
  });

  stepParticles3d(dt);
  renderer3d.render(scene3d,camera3d);
  a.fxStep(dt);
  a.hud([['SCORE',y(score)],['WINS',wins]]);
}
a.pointer({down:function(pt){
  var col=Math.floor((pt.x-PADX)/CELLPX),row=Math.floor((pt.y-PADY)/CELLPX);
  keyNav=false;
  if(col>=0&&row>=0&&col<8&&row<8)tryPlayerMove(row*8+col);
}});
a.press=function(key){
  keyNav=true;
  var row=cursor>>3,col=cursor&7;
  if(key==='ArrowLeft'||key==='a')col=col>0?col-1:col;
  else if(key==='ArrowRight'||key==='d')col=col<7?col+1:col;
  else if(key==='ArrowUp'||key==='w')row=row>0?row-1:row;
  else if(key==='ArrowDown'||key==='s')row=row<7?row+1:row;
  else if(key===' '||key==='Enter')tryPlayerMove(cursor);
  cursor=row*8+col;
};
a.pad([['◀','ArrowLeft'],['▲','ArrowUp'],['▼','ArrowDown'],['▶','ArrowRight'],['Select','Space']]);
a.opt('Difficulty',['Easy','Normal','Hard'],diff,function(i){diff=i;startGame();});
a.fns.push(function(){
  scene3d.traverse(function(obj){extDisposeThree(obj)});
  renderer3d.dispose();
  if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
  if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
});
a.begin(startGame);
}
ext3DLoadGate(a.el,startGame3D)
}),w('seedSow',k,'Seed Sow',o.yellow,'Scoop a pit, sow seeds round the board, and bank more than your rival.','Click one of your pits (bottom row) or press 1-6 · end in your store to go again',function(a){
var CANVAS_W=420,CANVAS_H=330;
var ctx=a.canvas(CANVAS_W,CANVAS_H);
var diff=1,DIFF=[{depth:2,rand:0.3},{depth:6,rand:0},{depth:11,rand:0}];
var realBoard,displayBoard,turn,over,score,wins,msg,pending,highlightPit,turnDelay;
function pitX(idx){return idx<6?86+50*idx:(idx>6&&idx<13?86+50*(12-idx):(idx===6?380:40));}
function pitY(idx){return idx<6?220:(idx>6&&idx<13?100:160);}
function pitSum(bd,player){
  var sum=0,start=player===1?0:7;
  for(var i=start;i<start+6;i++)sum+=bd[i];
  return sum;
}
function sow(bd,idx,player){
  var nb=bd.slice(),seeds=nb[idx],pos=idx,seq=[];
  var oppStore=player===1?13:6,ownStore=player===1?6:13;
  nb[idx]=0;
  while(seeds>0){
    pos=(pos+1)%14;
    if(pos===oppStore