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
;function T(){var r,t,n=[];for(r=0;r<4;r++)for(t=1;t<=13;t++)n.push({r:t,s:r});return h(n)}function L(r,t,n,e,a,i,l){var f;if(!l)return p(r,t,n,e,a,6,o.violet),p(r,t+4,n+4,e-8,a-8,4,o.grid),void d(r,t+e/2,n+a/2,.2*Math.min(e,a),o.violet);f=1===i.s||2===i.s,p(r,t,n,e,a,6,'#f4f1ff'),x(r,E[i.r],t+8,n+12,Math.round(.24*a),f?'#d8434a':'#171233','left'),x(r,A[i.s],t+e/2,n+.62*a,Math.round(.42*a),f?'#d8434a':'#171233')}function C(r,t,n,o,a,i,l){var f,c,u;for(r.beginPath(),f=0;f<(l?2*a:a);f++)c=i+f*e/(l?2*a:a),u=l&&f%2?o*l:o,f?r.lineTo(t+Math.cos(c)*u,n+Math.sin(c)*u):r.moveTo(t+Math.cos(c)*u,n+Math.sin(c)*u);r.closePath()}w('golfCards',S,'Fairway Cards',o.green,'Clear the table by playing cards one rank above or below the card showing.','Click an open card to play it · click the pile to turn a card · arrows + Space work too',function(t){var n,e,a,i,l,f,c,u,h,s,d=46,v=64,w=t.canvas(400,470);function b(){var r,t=T();for(n=[],r=0;r<7;r++)n.push(t.splice(0,5));a=[t.pop()],e=t,l=0,h='',s=!1}
function m(r){return a.length&&1===Math.abs(r.r-a[a.length-1].r)}function M(){var r=n.reduce(function(r,t){return r+t.length},0);if(!r)return s=!0,i+=100+20*e.length,f++,h='Table cleared!',t.burst(200,200,o.green,40),void t.later(b,1400);e.length||n.some(function(r){return r.length&&m(r[r.length-1])})||(s=!0,h='No plays left',t.later(function(){t.over(i,'Stuck with '+r+' cards left on the table. Score: '+i)},1200))}function k(r){var e=n[r];!s&&e&&e.length&&m(e[e.length-1])&&(a.push(e.pop()),i+=10+5*l,l++,t.burst(20+54*r+23,120,o.green,6),M())}function S(){!s&&e.length&&(a.push(e.pop()),l=0,M())}function E(s){var b,M,k;for(g(w,400,470),b=0;b<7;b++){for(k=n[b],M=0;M<k.length;M++)L(w,20+54*b,40+22*M,d,v,k[M],!0);M>0&&m(k[M-1])&&(w.strokeStyle=o.green,w.lineWidth=3,r.L(w,20+54*b,40+22*(M-1),d,v,6),w.stroke()),u&&b===c&&(w.strokeStyle=o.ink,w.lineWidth=3,r.L(w,16+54*b,36,54,160,8),w.stroke())}e.length?(L(w,64,340,d,v,null,!1),
x(w,e.length,87,420,13,o.dim)):p(w,64,340,d,v,6,'rgba(255,255,255,.06)'),a.length&&L(w,200,340,d,v,a[a.length-1],!0),x(w,'DRAW',87,330,11,o.dim),x(w,'PLAY ON',223,330,11,o.dim),x(w,h||(l>1?'Run of '+l:''),320,372,16,o.yellow),t.fxStep(s),t.hud([['SCORE',y(i)],['TABLES',f],['RUN',l]])}t.pointer({down:function(r){var t,o,e;if(u=!1,r.y>330&&r.x>60&&r.x<130)S();else for(t=0;t<7;t++)(o=n[t]).length&&r.x>=20+54*t&&r.x<=20+54*t+d&&(e=40+22*(o.length-1),r.y>=e&&r.y<=e+v&&k(t))}}),t.press=function(r){u=!0,'ArrowLeft'===r||'a'===r?c=Math.max(0,c-1):'ArrowRight'===r||'d'===r?c=Math.min(6,c+1):' '===r||'Enter'===r||'ArrowUp'===r||'w'===r?k(c):'ArrowDown'!==r&&'s'!==r&&'x'!==r||S()},t.pad([['◀','ArrowLeft'],['▶','ArrowRight'],['Play','Space'],['Draw','ArrowDown']]),t.begin(function(){i=0,f=0,c=3,u=!1,b(),t.fx=[],t.frame(E)})}),
w('twentyOne',S,'Twenty One',o.coral,'Beat the dealer to twenty-one without going over. Start with 500 chips.','Buttons or keys: 1-4 bet · Space deal · H hit · S stand · D double · C cash out',function(r){var t,n,e,a,i,l,f,c,u,s,y=r.canvas(400,480),v=[10,25,50,100];function w(r){var t=0,n=0;return r.forEach(function(r){t+=r.r>10?10:1===r.r?1:r.r,1===r.r&&n++}),n&&t+10<=21&&(t+=10),t}function b(){return t.length<20&&h(t=T().concat(T(),T(),T())),t.pop()}function m(){'bet'===f&&(i>a&&(i=v.filter(function(r){return r<=a}).pop()||a),a-=i,n=[b(),b()],e=[b(),b()],s=!1,f='play',c='Hit, stand or double?',21===w(n)&&(s=!0,f='dealer',u=.6,c='Blackjack!'))}function M(){var t=w(n),u=w(e),h=0;t>21?c='Bust. You lose '+i:!s||2===e.length&&21===u?u>21?(h=2*i,c='Dealer busts. You win '+i):t>u?(h=2*i,c='You win '+i):t===u?(h=i,c='Push'):c='Dealer wins. You lose '+i:(h=Math.floor(2.5*i),c='Blackjack pays 3 to 2'),(a+=h)>l&&(l=a),h>i&&r.burst(200,220,o.yellow,30),f='bet',a<10&&(f='over',r.later(function(){
r.over(l,'Broke. Best stack: '+l+' chips. Score: '+l)},1400))}function k(){'play'===f&&(n.push(b()),w(n)>21?(f='dealer',u=.5):21===w(n)&&S())}function S(){'play'===f&&(f='dealer',u=.6)}function E(){'play'!==f||2!==n.length||a<i||(a-=i,i*=2,n.push(b()),f='dealer',u=.6)}function A(){'bet'===f&&(f='over',r.over(Math.max(l,a),'Cashed out with '+a+' chips. Score: '+Math.max(l,a)))}function R(r){'bet'===f&&v[r]<=a&&(i=v[r])}var C={bet:[['DEAL',200,400,110,o.green,m],['CASH OUT',320,400,110,o.orange,A]],play:[['HIT',70,400,90,o.green,k],['STAND',185,400,90,o.coral,S],['DOUBLE',300,400,90,o.yellow,E]]};function P(t){var h,m,k,S;for('dealer'===f&&(u-=t)<=0&&(w(n)>21||s?M():w(e)<17?(e.push(b()),u=.6):M()),g(y,400,480),x(y,'DEALER'+('play'===f?'':' '+w(e)),60,34,13,o.dim),m='play'===f,h=0;h<e.length;h++)L(y,40+46*h,50,56,78,e[h],!(m&&1===h));for(x(y,'YOU '+(n.length?w(n)+(k=0,S=0,n.forEach(function(r){k+=r.r>10?10:r.r,1===r.r&&S++}),S&&k+10<=21&&w(n)<21?' soft':''):''),60,176,13,o.dim),
h=0;h<n.length;h++)L(y,40+46*h,192,56,78,n[h],!0);if(x(y,'CHIPS '+a,330,40,18,o.yellow),x(y,'BET '+i,330,66,16,o.ink),x(y,c,200,300,16,o.ink),'bet'===f)for(h=0;h<4;h++)d(y,65+90*h,350,20,v[h]<=a?i===v[h]?o.yellow:o.violet:o.grid),x(y,v[h],65+90*h,350,13,v[h]<=a?o.bg:o.dim);(C[f]||[]).forEach(function(r){var t='DOUBLE'!==r[0]||2===n.length&&a>=i;p(y,r[1]-r[3]/2,r[2]-20,r[3],40,10,t?r[4]:o.grid),x(y,r[0],r[1],r[2],15,t?o.bg:o.dim)}),r.fxStep(t),r.hud([['CHIPS',a],['BEST',l]])}r.pointer({down:function(r){var t;if(r.y>330&&r.y<372&&'bet'===f)for(t=0;t<4;t++)Math.abs(r.x-(65+90*t))<40&&R(t);else(C[f]||[]).forEach(function(t){Math.abs(r.x-t[1])<t[3]/2&&Math.abs(r.y-t[2])<22&&t[5]()})}}),r.press=function(r){r>='1'&&r<='4'&&1===r.length?R(+r-1):' '===r||'Enter'===r?m():'h'===r?k():'s'===r?S():'d'===r?E():'c'===r&&A()},r.pad([['Deal','Space'],['Hit','h'],['Stand','s'],['Double','d']]),r.begin(function(){a=500,i=25,l=500,f='bet',c='Place your bet',n=[],e=[],u=0,t=[],r.fx=[],r.frame(P)})}),
w('higherLower',S,'Higher Lower',o.violet,'Will the next card be higher or lower? Build a streak. Ace is low.','Up / H for higher · Down / L for lower · three wrong guesses ends it',function(r){var t,n,e,a,i,l,f,c,u,h,s=400,d=r.canvas(s,470);function v(s){var y;f>0||(t.length||(t=T(),l+=50),y=t.pop(),e.push(n),e.length>7&&e.shift(),y.r===n.r?(c='Same rank. Push.',u=o.dim):y.r>n.r===s?(i++,l+=10*Math.min(i,10),c='Correct! Streak '+i,u=o.green,r.burst(200,200,o.green,16)):(a--,i=0,c='Wrong.',u=o.coral,r.burst(200,200,o.coral,16)),n=y,f=.55,h=.3,a<=0&&(f=99,r.later(function(){r.over(l,'Out of lives. Score: '+l)},900)))}function w(v){var w,b,m=function(){var r=0,o=0,e=0;return t.forEach(function(t){t.r>n.r?r++:t.r<n.r?o++:e++}),[r,o,e]}();for(f>0&&f<50&&(f-=v),h>0&&(h-=v),g(d,s,470),x(d,'LIVES '+'♥ '.repeat(a),200,30,16,o.coral),w=0;w<e.length;w++)L(d,24+50*w,56,40,56,e[w],!0);L(d,200-60*(b=h>0?1-h/.3:1),150,120*b,168,n,b>.5),x(d,c,200,335,16,u),p(d,30,355,165,44,10,o.green),
x(d,'HIGHER ('+m[0]+')',112,377,15,o.bg),p(d,205,355,165,44,10,o.coral),x(d,'LOWER ('+m[1]+')',287,377,15,o.bg),x(d,'Same rank left: '+m[2]+' · Cards left: '+t.length,200,425,12,o.dim),r.fxStep(v),r.hud([['SCORE',y(l)],['STREAK',i]])}r.pointer({down:function(r){r.y>340&&r.y<400&&(r.x<200?v(!0):v(!1))}}),r.press=function(r){'ArrowUp'===r||'h'===r||'w'===r?v(!0):'ArrowDown'!==r&&'l'!==r&&'s'!==r||v(!1)},r.pad([['Higher','ArrowUp'],['Lower','ArrowDown']]),r.begin(function(){t=T(),n=t.pop(),e=[],a=3,i=0,l=0,f=0,c='Higher or lower?',u=o.ink,h=0,r.fx=[],r.frame(w)})}),w('hangWord',S,'Word Fuse',o.orange,'Guess the hidden word letter by letter before the fuse burns down.','Type letters or tap the keys · six wrong guesses and the bomb goes off',function(r){var t,n,e,a,i,l,f,c,h,s=r.canvas(400,470),w=['qwertyuiop','asdfghjkl','zxcvbnm'];function b(){t=function(){var r;do{r=u(R)}while(r.length<5||r.length>9);return r}(),n={},e=0,h={},l=!1,f='',c=0}function m(u){
l||h[u]||1!==u.length||u<'a'||u>'z'||(h[u]=1,t.indexOf(u)>-1?(n[u]=1,r.burst(60+280*Math.random(),215,o.green,6),function(){var r;for(r=0;r<t.length;r++)if(!n[t.charAt(r)])return!1;return!0}()&&(l=!0,a+=10*t.length+10*(6-e),i++,f='Defused! '+t.toUpperCase(),r.later(b,1300))):(e++,r.burst(200,100,o.coral,8),e>=6&&(l=!0,c=1,f='The word was '+t.toUpperCase(),r.later(function(){r.over(a,'Boom. '+i+' word'+(1===i?'':'s')+' defused. Score: '+a)},1500))))}function M(l){var u,b,m,M,k,S;if(c>0&&(c-=.5*l),g(s,400,470),e<6)d(s,130,100,44,'#0b0518'),s.strokeStyle=o.dim,s.lineWidth=3,s.stroke(),d(s,116,86,8,'rgba(255,255,255,.15)'),p(s,120,48,20,12,3,o.dim),130+0*(k=e/6),s.beginPath(),s.moveTo(130,48),s.quadraticCurveTo(190,20,250-120*k,40+12*k),s.strokeStyle=o.orange,s.lineWidth=4,s.stroke(),s.beginPath(),s.moveTo(250-120*k,40+12*k),s.quadraticCurveTo(255,40,260,44),s.strokeStyle='rgba(255,255,255,.12)',s.lineWidth=4,s.stroke(),d(s,250-120*k,40+12*k,7+2*Math.sin(performance.now()/60),o.yellow),
