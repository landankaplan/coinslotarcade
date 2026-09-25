!function(){'use strict';try{
var LS='coinslotarcade_sfx',AC=window.AudioContext||window.webkitAudioContext,ctx=null,out=null,on=true,quiet=0,seen={},lastT={},cnt={},rate={};
try{on=localStorage.getItem(LS)!=='off'}catch(e){}
function now(){return Date.now()}
function has(s,l){var i;for(i=0;i<l.length;i++)if(s.indexOf(l[i])>-1)return true;return false}
function isNum(s){var i,c;if(!s)return false;for(i=0;i<s.length;i++){c=s.charAt(i);if(c==='-'&&i===0)continue;if('0123456789,.'.indexOf(c)<0)return false}return true}
function ens(){if(!AC)return null;if(!ctx){try{ctx=new AC();out=ctx.createGain();out.gain.value=.55;var c=ctx.createDynamicsCompressor();out.connect(c);c.connect(ctx.destination)}catch(e){ctx=null;return null}}if(ctx.state==='suspended'){try{ctx.resume()}catch(e){}}return ctx}
function tone(f,d,ty,v,w,to){var c=ens();if(!c||!on)return;var t=c.currentTime+(w||0),o=c.createOscillator(),g=c.createGain();o.type=ty||'square';o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v||.15,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.03)}
function hiss(d,v,w,f){var c=ens();if(!c||!on)return;var n=Math.floor(c.sampleRate*d),b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0),i,s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime+(w||0);for(i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);s.buffer=b;fl.type='lowpass';fl.frequency.value=f||1400;g.gain.setValueAtTime(v||.2,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(g);g.connect(out);s.start(t)}
function arp(fs,d,ty,v,gap,tail){fs.forEach(function(f,i){tone(f,d,ty,v,i*gap,tail?f*tail:0)})}
var S={
tick:function(){tone(1100,.025,'square',.03)},
boot:function(){tone(220,.18,'sawtooth',.08,0,660);tone(440,.2,'square',.05,.1,1320)},
down:function(){tone(660,.2,'sawtooth',.07,0,180)},
good:function(n){var k=Math.min(n||0,8);tone(520+k*45,.09,'triangle',.16);tone(780+k*60,.13,'triangle',.12,.06)},
coin:function(){tone(988,.07,'square',.1);tone(1319,.22,'square',.1,.07)},
level:function(){arp([523,659,784,1047],.12,'square',.09,.08)},
bad:function(){tone(240,.28,'sawtooth',.15,0,90);hiss(.2,.12,0,900)},
over:function(){arp([392,330,262,196],.22,'sawtooth',.12,.17,.9);hiss(.5,.08,.5,500)},
win:function(){arp([523,659,784,1047,1319],.16,'triangle',.15,.09);arp([1046,1318,1568,2094,2638],.1,'sine',.045,.09)},
best:function(){arp([659,784,988,1319,1568],.14,'square',.08,.07);arp([330,392,494,659,784],.14,'triangle',.09,.07);hiss(.25,.06,.3,4000)}
};
function play(n,a,gap){var t=now();if(!on)return;if(lastT[n]&&t-lastT[n]<(gap||60))return;lastT[n]=t;cnt[n]=(cnt[n]||0)+1;try{S[n](a)}catch(e){}}
function buzz(p){if(on&&navigator.vibrate){try{navigator.vibrate(p)}catch(e){}}}
var hud=document.getElementById('hud'),ov=document.getElementById('overlay'),ovT=document.getElementById('overlayTitle'),ovB=document.getElementById('overlayBtn'),gt=document.getElementById('gameTitle'),con=document.getElementById('console'),shelf=document.getElementById('shelf'),acts=document.querySelector('.console-actions'),well=document.querySelector('.screen-well');
var SKIP=['time','clock','fuel','sec','left','stroke','ammo','energy','stamina','oxygen','move','turn'],BADUP=['miss','strike','error','wrong','mistake','fail','damage','crash','bust'],BADDN=['life','lives','hp','health','heart','shield','hull','armor','armour','integrity','base','wall'],LEVELS=['level','wave','stage','floor','depth','round','chain'];
function react(l,d){var up=d>0,r,t=now();
if(has(l,BADUP)){if(up){play('bad',0,150);buzz(25)}return}
if(has(l,BADDN)&&!up){play('bad',0,150);buzz(25);return}
if(!up)return;
r=rate[l]||(rate[l]=[]);r.push(t);while(r.length&&t-r[0]>3000)r.shift();if(r.length>9)return;
if(has(l,LEVELS)){play('level',0,500);return}
if(d>=100){play('coin',0,120);return}
play('good',Math.floor(Math.log(d+1)/Math.LN2),90)}
function scan(){var bs=hud.getElementsByTagName('b'),i,b,l,v,p,t=now(),cur={};
for(i=0;i<bs.length;i++){b=bs[i];l=((b.previousSibling&&b.previousSibling.textContent)||'').trim().toLowerCase()||('#'+i);v=(b.textContent||'').trim();
if(!isNum(v)||!v)continue;v=parseFloat(v.split(',').join(''));if(isNaN(v))continue;cur[l]=v;p=seen[l];
if(p!==undefined&&t>quiet&&!has(l,SKIP)&&v!==p)react(l,v-p)}
seen=cur}
function calm(ms){quiet=now()+ms;seen={};rate={}}
if(hud)new MutationObserver(scan).observe(hud,{childList:true,subtree:true,characterData:true});
if(gt)new MutationObserver(function(){calm(700)}).observe(gt,{childList:true,subtree:true,characterData:true});
new MutationObserver(function(m){m.forEach(function(r){[].forEach.call(r.addedNodes,function(n){var t;if(n.className==='toast'){t=n.textContent||'';if(t.indexOf('New best')===0||t.indexOf('Achievement')===0)play('best',0,900)}})})}).observe(document.body,{childList:true});
var ovOn=false,OVER=['cpu','over','lose','lost','fell','destroy','broken','boom','out of','no more','time','game','defeat','crash','caught','sunk'],WIN=['win','clear','complete','crack','solved','nice','goal','saved','prestige','2048','done','victory','perfect','champion','congrat'];
if(ov&&ovT)new MutationObserver(function(){var vis=!ov.hidden,t;if(vis&&!ovOn){t=(ovT.textContent||'').toLowerCase();
if(now()-(lastT.best||0)<900){}else if(t.indexOf('pause')>-1)play('tick',0,60);else if(has(t,OVER)){play('over',0,400);buzz([40,40,80])}else if(has(t,WIN)){play('win',0,400);buzz([20,30,20])}else play('good',3,200)}
ovOn=vis}).observe(ov,{attributes:true,attributeFilter:['hidden']});
document.addEventListener('pointerdown',function(e){var t=e.target;ens();if(!t||!t.closest)return;if(t.closest('#playArea'))play('tick',0,70);else if(t.closest('.category-nav'))play('tick',0,70)},true);
document.addEventListener('keydown',function(e){ens();if(con&&!con.hidden&&!e.repeat&&!e.ctrlKey&&!e.metaKey&&!e.altKey)play('tick',0,90)},true);
if(shelf)shelf.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('.cart')){calm(700);play('boot',0,300)}},true);
[['ejectBtn',function(){calm(500);play('down',0,300)}],['resetBtn',function(){calm(600);play('tick',0,60)}]].forEach(function(p){var b=document.getElementById(p[0]);if(b)b.addEventListener('click',p[1],true)});
if(ovB)ovB.addEventListener('click',function(){calm(600)},true);
if(acts){var bt=document.createElement('button'),lab=function(){bt.textContent=on?'Sound on':'Sound off';bt.setAttribute('aria-pressed',on?'true':'false')};bt.type='button';bt.id='sfxBtn';bt.className='console-btn sfx';lab();bt.addEventListener('click',function(){on=!on;try{localStorage.setItem(LS,on?'on':'off')}catch(e){}lab();if(on){ens();play('good',2,0)}});acts.insertBefore(bt,acts.firstChild)}
var st=document.createElement('style');st.setAttribute('data-csa-polish','');
st.textContent='.console-actions{flex-wrap:wrap}.console-btn.sfx{background:#c9b8ff;white-space:nowrap;padding:.5rem .8rem}.screen-well>.glass{position:absolute;inset:0;pointer-events:none;border-radius:6px;z-index:2;background:linear-gradient(118deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,0) 34%),radial-gradient(ellipse at center,rgba(0,0,0,0) 60%,rgba(0,0,0,.32) 100%);box-shadow:inset 0 0 26px rgba(0,0,0,.35)}';
document.head.appendChild(st);
if(well){var gl=document.createElement('div');gl.className='glass';gl.setAttribute('aria-hidden','true');well.appendChild(gl)}
window.CSA_SFX={play:play,on:function(){return on},count:cnt,scan:scan}
}catch(e){console.error(e)}}();
