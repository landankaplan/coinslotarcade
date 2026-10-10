,w('skyShield',b,'Sky Shield',o.teal,'Aim, tap and detonate. Keep six cities alive, chain blasts for bonus combos, and hoard ammo to rebuild.','Click / tap to fire · or arrows to aim and Space to fire',function(a){
function startGame3D(){
var W=400,H=400,CITY_X=[45,95,145,255,305,355],BATTERY_X=[20,200,380];
var cities,ammo,enemyMissiles,interceptors,explosions,aimX,aimY,wave,score,missilesLeft,spawnCd,combo,comboTimer;

var wrapDiv=document.createElement('div');
wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
a.el.appendChild(wrapDiv);
var canvasWrap=document.createElement('div');
canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:1/1;margin:0 auto';
wrapDiv.appendChild(canvasWrap);

var renderer3d=extMakeWebGLRenderer();
if(!renderer3d){a.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
renderer3d.setSize(400,400);
renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
renderer3d.setClearColor(0x090417,1);
canvasWrap.appendChild(renderer3d.domElement);
a.cv=renderer3d.domElement;a.w=W;a.h=H;

var scene3d=new THREE.Scene();
scene3d.fog=new THREE.Fog(0x090417,20,46);
var camera3d=new THREE.PerspectiveCamera(50,1,0.1,200);
camera3d.position.set(0,2,25);
camera3d.lookAt(0,-2,0);

scene3d.add(new THREE.AmbientLight(0xcfe3ff,0.85));
var sun3d=new THREE.DirectionalLight(0xffffff,0.8);
sun3d.position.set(6,14,14);
scene3d.add(sun3d);

var starGeo3d=new THREE.BufferGeometry();
var starPos3d=[];
for(var si3=0;si3<100;si3++){starPos3d.push((Math.random()*2-1)*15,Math.random()*9+2,-8-Math.random()*10)}
starGeo3d.setAttribute('position',new THREE.Float32BufferAttribute(starPos3d,3));
scene3d.add(new THREE.Points(starGeo3d,new THREE.PointsMaterial({color:0xe9fbf9,size:0.07,transparent:true,opacity:0.75})));

function mapX3d(px){return px/W*20-10}
function mapY3d(py){return 10-py/H*20}

var groundMesh3d=new THREE.Mesh(new THREE.PlaneGeometry(22,3),new THREE.MeshStandardMaterial({color:0x1d1a3c,roughness:0.95}));
groundMesh3d.rotation.x=-Math.PI/2;
groundMesh3d.position.set(0,mapY3d(389),-0.3);
scene3d.add(groundMesh3d);

var cityAliveMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.teal),emissive:new THREE.Color(o.teal),emissiveIntensity:0.25,roughness:0.5});
var cityDeadMat3d=new THREE.MeshStandardMaterial({color:0x3a2a7a,roughness:0.9});
var cityMeshes3d=[];
CITY_X.forEach(function(cx){
  var grp=new THREE.Group();
  var base=new THREE.Mesh(new THREE.BoxGeometry(1.3,0.6,0.9),cityAliveMat3d);
  base.position.y=0.3;
  grp.add(base);
  var t1=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.5,0.3),cityAliveMat3d);
  t1.position.set(-0.3,0.85,0);
  grp.add(t1);
  var t2=new THREE.Mesh(new THREE.BoxGeometry(0.3,0.4,0.3),cityAliveMat3d);
  t2.position.set(0.15,0.8,0);
  grp.add(t2);
  var rubble=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.2,0.8),cityDeadMat3d);
  rubble.position.y=0.1;
  rubble.visible=false;
  grp.add(rubble);
  grp.position.set(mapX3d(cx),mapY3d(389),0.4);
  scene3d.add(grp);
  cityMeshes3d.push({grp:grp,alive:[base,t1,t2],rubble:rubble})
});

var batteryAliveMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.violet),emissive:new THREE.Color(o.violet),emissiveIntensity:0.3,roughness:0.5});
var batteryDeadMat3d=new THREE.MeshStandardMaterial({color:0x3a2a7a,roughness:0.9});
var batteryMeshes3d=[];
BATTERY_X.forEach(function(bx){
  var mesh=new THREE.Mesh(new THREE.ConeGeometry(0.7,0.9,4),batteryAliveMat3d);
  mesh.position.set(mapX3d(bx),mapY3d(389)+0.45,0.4);
  mesh.rotation.y=Math.PI/4;
  scene3d.add(mesh);
  batteryMeshes3d.push(mesh)
});

function disposeGroupChildren(grp){
  while(grp.children.length){
    var c=grp.children.pop();
    grp.remove(c);
    extDisposeThree(c)
  }
}
var missileGroup3d=new THREE.Group();scene3d.add(missileGroup3d);
var interceptorGroup3d=new THREE.Group();scene3d.add(interceptorGroup3d);
var explosionGroup3d=new THREE.Group();scene3d.add(explosionGroup3d);

var missileLineMat3d=new THREE.LineBasicMaterial({color:new THREE.Color(o.coral)});
var missileHeadMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.ink)});
var interceptorLineMat3d=new THREE.LineBasicMaterial({color:new THREE.Color(o.blue)});

var reticleGroup3d=new THREE.Group();
var reticleMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.ink)});
var rh=new THREE.Mesh(new THREE.BoxGeometry(0.9,0.08,0.08),reticleMat3d);
var rv=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.9,0.08),reticleMat3d);
reticleGroup3d.add(rh);reticleGroup3d.add(rv);
scene3d.add(reticleGroup3d);

function nearestBattery(tx){
  var bestDist=1e9,bestIdx=-1;
  for(var i=0;i<3;i++){
    if(ammo[i]>0){
      var dd=Math.abs(BATTERY_X[i]-tx)+(i===1?-70:0);
      if(dd<bestDist){bestDist=dd;bestIdx=i}
    }
  }
  return bestIdx
}

function fireInterceptor(tx,ty){
  ty=Math.min(ty,340);
  var idx=nearestBattery(tx);
  if(idx<0)return;
  ammo[idx]--;
  interceptors.push({x:BATTERY_X[idx],y:372,sx:BATTERY_X[idx],sy:372,tx:tx,ty:ty})
}

function pickTarget(){
  var opts=[];
  cities.forEach(function(alive,idx){if(alive)opts.push([CITY_X[idx],378])});
  BATTERY_X.forEach(function(bx){opts.push([bx,378])});
  return u(opts)
}

function spawnMissile(sx,sy){
  var target=pickTarget();
  enemyMissiles.push({sx:sx,sy:sy,x:sx,y:sy,tx:target[0],ty:target[1],sp:30+4*wave+f(14),split:!1})
}

function initWave(){
  ammo=[10,10,10];enemyMissiles=[];interceptors=[];explosions=[];
  missilesLeft=6+3*wave;spawnCd=1
}

var particleMeshes3d=[];
function spawnParticles3d(wx,wy,color,n){
  var col=new THREE.Color(color);
  for(var pi=0;pi<n;pi++){
    var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
    var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.09,6,6),mat);
    mesh.position.set(wx,wy,0.4);
    scene3d.add(mesh);
    var ang=Math.random()*Math.PI*2,sp=0.04+Math.random()*0.15;
    particleMeshes3d.push({mesh:mesh,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp*0.6+0.04,vz:(Math.random()-0.5)*0.1,life:1})
  }
}
function stepParticles3d(dt){
  for(var i2=particleMeshes3d.length-1;i2>=0;i2--){
    var pt=particleMeshes3d[i2];
    pt.vy-=0.01;
    pt.mesh.position.x+=pt.vx;pt.mesh.position.y+=pt.vy;pt.mesh.position.z+=pt.vz;
    pt.life-=0.035;
    pt.mesh.material.opacity=Math.max(0,pt.life);
    if(pt.life<=0){scene3d.remove(pt.mesh);extDisposeThree(pt.mesh);particleMeshes3d.splice(i2,1)}
  }
}

function step(dt){
  aimX=s(aimX+220*a.ax()*dt,0,W);
  aimY=s(aimY+220*a.ay()*dt,0,340);
  spawnCd-=dt;
  if(missilesLeft>0&&spawnCd<=0){
    spawnMissile(c(10,390),0);
    missilesLeft--;
    spawnCd=Math.max(.35,1.5-.09*wave)*c(.5,1.3)
  }
  for(var ii=interceptors.length-1;ii>=0;ii--){
    var ic=interceptors[ii],dist=Math.hypot(ic.tx-ic.x,ic.ty-ic.y);
    if(dist<420*dt){
      explosions.push({x:ic.tx,y:ic.ty,t:0,m:34,bad:!1});
      interceptors.splice(ii,1)
    }else{
      ic.x+=(ic.tx-ic.x)/dist*420*dt;
      ic.y+=(ic.ty-ic.y)/dist*420*dt
    }
  }
  for(var ei=explosions.length-1;ei>=0;ei--){
    explosions[ei].t+=dt;
    if(explosions[ei].t>1.3)explosions.splice(ei,1)
  }
  comboTimer-=dt;
  if(comboTimer<=0)combo=0;
  for(var mi=enemyMissiles.length-1;mi>=0;mi--){
    var ms=enemyMissiles[mi],mdist=Math.hypot(ms.tx-ms.x,ms.ty-ms.y);
    if(mdist<ms.sp*dt){
      explosions.push({x:ms.tx,y:ms.ty,t:0,m:26,bad:!0});
      var cIdx=CITY_X.findIndex(function(cx,idx2){return cities[idx2]&&Math.abs(cx-ms.tx)<2});
      if(cIdx>=0){cities[cIdx]=0;spawnParticles3d(mapX3d(ms.tx),mapY3d(ms.ty),o.coral,20)}
      var bIdx=BATTERY_X.indexOf(ms.tx);
      if(bIdx>=0)ammo[bIdx]=0;
      enemyMissiles.splice(mi,1)
    }else{
      ms.x+=(ms.tx-ms.x)/mdist*ms.sp*dt;
      ms.y+=(ms.ty-ms.y)/mdist*ms.sp*dt;
      if(wave>=2&&!ms.split&&ms.y>90&&ms.y<200&&Math.random()<(.35+.02*Math.min(wave,10))*dt){
        ms.split=!0;
        spawnMissile(ms.x,ms.y);
        spawnMissile(ms.x,ms.y)
      }
      for(var xi=0;xi<explosions.length;xi++){
        var ex=explosions[xi];
        if(!ex.bad&&Math.hypot(ex.x-ms.x,ex.y-ms.y)<34*Math.sin(Math.min(1,ex.t/1.3)*Math.PI)){
          var mult=1+Math.min(4,Math.floor(combo/3));
          score+=25*mult;combo++;comboTimer=2;
          explosions.push({x:ms.x,y:ms.y,t:0,m:26,bad:!1});
          spawnParticles3d(mapX3d(ms.x),mapY3d(ms.y),o.yellow,8);
          enemyMissiles.splice(mi,1);
          break
        }
      }
    }
  }
  var aliveCount=0;
  cities.forEach(function(v2){aliveCount+=v2});
  if(aliveCount===0&&!explosions.length){render3d(dt);a.over(score,'Wave '+wave+' · Score: '+score);return}
  if(aliveCount!==0){
    if(!missilesLeft&&!enemyMissiles.length&&!explosions.length&&!interceptors.length){
      var bonus=100*aliveCount+5*ammo[0]+5*ammo[1]+5*ammo[2];
      score+=bonus;
      if(ammo[0]+ammo[1]+ammo[2]>=15){
        var dead=[];cities.forEach(function(v3,idx3){if(!v3)dead.push(idx3)});
        if(dead.length)cities[u(dead)]=1
      }
      wave++;
      initWave()
    }
  }
  render3d(dt)
}

function render3d(dt){
  cityMeshes3d.forEach(function(cm,idx){
    var alive=!!cities[idx];
    cm.alive.forEach(function(m){m.visible=alive});
    cm.rubble.visible=!alive
  });
  batteryMeshes3d.forEach(function(bm,idx){bm.material=ammo[idx]?batteryAliveMat3d:batteryDeadMat3d});

  disposeGroupChildren(missileGroup3d);
  enemyMissiles.forEach(function(ms){
    var pts=[new THREE.Vector3(mapX3d(ms.sx),mapY3d(ms.sy),0.4),new THREE.Vector3(mapX3d(ms.x),mapY3d(ms.y),0.4)];
    var geo=new THREE.BufferGeometry().setFromPoints(pts);
    missileGroup3d.add(new THREE.Line(geo,missileLineMat3d));
    var head=new THREE.Mesh(new THREE.SphereGeometry(0.12,6,6),missileHeadMat3d);
    head.position.set(mapX3d(ms.x),mapY3d(ms.y),0.4);
    missileGroup3d.add(head)
  });

  disposeGroupChildren(interceptorGroup3d);
  interceptors.forEach(function(ic){
    var pts=[new THREE.Vector3(mapX3d(ic.sx),mapY3d(ic.sy),0.4),new THREE.Vector3(mapX3d(ic.x),mapY3d(ic.y),0.4)];
    var geo=new THREE.BufferGeometry().setFromPoints(pts);
    interceptorGroup3d.add(new THREE.Line(geo,interceptorLineMat3d));
    var head=new THREE.Mesh(new THREE.SphereGeometry(0.12,6,6),missileHeadMat3d);
    head.position.set(mapX3d(ic.x),mapY3d(ic.y),0.4);
    interceptorGroup3d.add(head)
  });

  disposeGroupChildren(explosionGroup3d);
  explosions.forEach(function(ex){
    var rad=Math.max(0.05,ex.m*Math.sin(Math.min(1,ex.t/1.3)*Math.PI)/400*20);
    var mat=new THREE.MeshBasicMaterial({color:ex.bad?0xff6b4a:0xffd166,transparent:true,opacity:0.6});
    var mesh=new THREE.Mesh(new THREE.SphereGeometry(rad,10,10),mat);
    mesh.position.set(mapX3d(ex.x),mapY3d(ex.y),0.4);
    explosionGroup3d.add(mesh)
  });

  reticleGroup3d.position.set(mapX3d(aimX),mapY3d(aimY),0.5);

  stepParticles3d(dt);
  renderer3d.render(scene3d,camera3d);
  a.hud([['SCORE',y(score)],['WAVE',wave],['CITIES',cities.reduce(function(s2,v4){return s2+v4},0)],['COMBO','x'+(1+Math.min(4,Math.floor(combo/3)))],['AMMO',ammo.join('/')]])
}

a.press=function(k){if(k===' ')fireInterceptor(aimX,aimY)};
a.pointer({down:function(pt){aimX=pt.x;aimY=pt.y;fireInterceptor(pt.x,pt.y)},move:function(pt){aimX=pt.x;aimY=pt.y}});
a.fns.push(function(){
  scene3d.traverse(function(obj){extDisposeThree(obj)});
  renderer3d.dispose();
  if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
  if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
});
a.begin(function(){
  cities=[1,1,1,1,1,1];wave=1;score=0;aimX=200;aimY=200;combo=0;comboTimer=0;
  initWave();
  a.frame(step)
})
}
ext3DLoadGate(a.el,startGame3D)
}),w('softTouchdown',b,'Soft Touchdown',o.violet,'Feather the thrusters through crosswinds and pick a pad — the safe strip or the narrow bonus pad — before fuel runs out.','Left/Right rotate · Up thrust · land slow, level and on a pad',function(a){
function startGame3D(){
var W=400,H=400;
var terrain,pads,lander,fuel,score,level,lives,message,resultTimer,windX,streak;

var wrapDiv=document.createElement('div');
wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
a.el.appendChild(wrapDiv);
var canvasWrap=document.createElement('div');
canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:1/1;margin:0 auto';
wrapDiv.appendChild(canvasWrap);

var renderer3d=extMakeWebGLRenderer();
if(!renderer3d){a.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
renderer3d.setSize(400,400);
renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
renderer3d.setClearColor(0x090417,1);
canvasWrap.appendChild(renderer3d.domElement);

var msgDiv=document.createElement('div');
msgDiv.style.cssText='position:absolute;left:50%;top:24%;transform:translate(-50%,-50%);color:'+o.yellow+';font-weight:800;font-size:22px;text-shadow:0 2px 10px rgba(0,0,0,.85);pointer-events:none;display:none;white-space:nowrap;font-family:inherit';
canvasWrap.appendChild(msgDiv);

var scene3d=new THREE.Scene();
scene3d.fog=new THREE.Fog(0x090417,20,48);
var camera3d=new THREE.PerspectiveCamera(50,1,0.1,200);
camera3d.position.set(0,3,26);
camera3d.lookAt(0,-1,0);

scene3d.add(new THREE.AmbientLight(0xcfe3ff,0.85));
var sun3d=new THREE.DirectionalLight(0xffffff,0.8);
sun3d.position.set(8,14,14);
scene3d.add(sun3d);

var starGeo3d=new THREE.BufferGeometry();
var starPos3d=[];
for(var si3=0;si3<120;si3++){starPos3d.push((Math.random()*2-1)*15,Math.random()*10+1,-6-Math.random()*10)}
starGeo3d.setAttribute('position',new THREE.Float32BufferAttribute(starPos3d,3));
scene3d.add(new THREE.Points(starGeo3d,new THREE.PointsMaterial({color:0xe9fbf9,size:0.08,transparent:true,opacity:0.8})));

function mapX3d(px){return px/W*20-10}
function mapY3d(py){return 10-py/H*20}

var terrainMesh3d=null;
function buildTerrainMesh3d(){
  if(terrainMesh3d){scene3d.remove(terrainMesh3d);extDisposeThree(terrainMesh3d)}
  var shape=new THREE.Shape();
  var baseY=-11;
  shape.moveTo(mapX3d(0),baseY);
  for(var i2=0;i2<=20;i2++)shape.lineTo(mapX3d(20*i2),mapY3d(terrain[i2]));
  shape.lineTo(mapX3d(400),baseY);
  shape.closePath();
  var geo=new THREE.ExtrudeGeometry(shape,{depth:3,bevelEnabled:false});
  geo.translate(0,0,-1.5);
  var mat=new THREE.MeshStandardMaterial({color:0x2a2350,roughness:0.92});
  terrainMesh3d=new THREE.Mesh(geo,mat);
  scene3d.add(terrainMesh3d)
}

var padMeshes3d=[];
function buildPadMeshes3d(){
  padMeshes3d.forEach(function(m){scene3d.remove(m);extDisposeThree(m)});
  padMeshes3d=[];
  pads.forEach(function(pd){
    var wx1=mapX3d(pd.x1),wx2=mapX3d(pd.x2),wy=mapY3d(pd.y);
    var padColor=pd.mult>1?o.yellow:o.green;
    var mat=new THREE.MeshStandardMaterial({color:new THREE.Color(padColor),emissive:new THREE.Color(padColor),emissiveIntensity:0.35,roughness:0.5});
    var mesh=new THREE.Mesh(new THREE.BoxGeometry(Math.abs(wx2-wx1),0.22,3.1),mat);
    mesh.position.set((wx1+wx2)/2,wy+0.12,0);
    scene3d.add(mesh);
    padMeshes3d.push(mesh)
  })
}

var landerGroup3d=new THREE.Group();
var bodyMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.ink),roughness:0.4});
var bodyMesh3d=new THREE.Mesh(new THREE.ConeGeometry(0.55,1.3,4),bodyMat3d);
landerGroup3d.add(bodyMesh3d);
var legMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.ink)});
[[-0.45,-0.55,0.35],[0.45,-0.55,-0.35]].forEach(function(leg){
  var legMesh=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.9,6),legMat3d);
  legMesh.position.set(leg[0],-0.65,0);
  legMesh.rotation.z=leg[2];
  landerGroup3d.add(legMesh)
});
var flameMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.yellow)});
var flameMesh3d=new THREE.Mesh(new THREE.ConeGeometry(0.3,0.8,8),flameMat3d);
flameMesh3d.rotation.x=Math.PI;
flameMesh3d.position.y=-1.0;
flameMesh3d.visible=false;
landerGroup3d.add(flameMesh3d);
scene3d.add(landerGroup3d);

var particleMeshes3d=[];
function spawnParticles3d(wx,wy,color,n){
  var col=new THREE.Color(color);
  for(var pi=0;pi<n;pi++){
    var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
    var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,6),mat);
    mesh.position.set(wx,wy,0);
    scene3d.add(mesh);
    var ang=Math.random()*Math.PI*2,sp=0.05+Math.random()*0.18;
    particleMeshes3d.push({mesh:mesh,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp*0.6+0.05,vz:(Math.random()-0.5)*0.12,life:1})
  }
}
function stepParticles3d(dt){
  for(var i2=particleMeshes3d.length-1;i2>=0;i2--){
    var pt=particleMeshes3d[i2];
    pt.vy-=0.012;
    pt.mesh.position.x+=pt.vx;pt.mesh.position.y+=pt.vy;pt.mesh.position.z+=pt.vz;
    pt.life-=0.035;
    pt.mesh.material.opacity=Math.max(0,pt.life);
    if(pt.life<=0){scene3d.remove(pt.mesh);extDisposeThree(pt.mesh);particleMeshes3d.splice(i2,1)}
  }
}

function terrainHeightAt(x){
  var idx=s(Math.floor(x/20),0,19),frac=(x-20*idx)/20;
  return terrain[idx]+(terrain[idx+1]-terrain[idx])*s(frac,0,1)
}

function newLevel(){
  var h0=c(250,340);
  terrain=[];
  for(var i=0;i<=20;i++){h0=s(h0+c(-42,42),190,380);terrain.push(h0)}
  var safeIdx=2+f(8),riskyIdx=12+f(7);
  terrain[safeIdx+1]=terrain[safeIdx+2]=terrain[safeIdx];
  terrain[riskyIdx+1]=terrain[riskyIdx];
  pads=[
    {x1:20*safeIdx,x2:20*(safeIdx+2),y:terrain[safeIdx],mult:1},
    {x1:20*riskyIdx,x2:20*(riskyIdx+1),y:terrain[riskyIdx],mult:2.5}
  ];
  lander={x:c(60,340),y:40,vx:c(-22,22),vy:0,a:0};
  fuel=Math.max(260,520-20*level);
  windX=level>1?c(-10,10)*Math.min(1,(level-1)*.18):0;
  message='';resultTimer=0;
  buildTerrainMesh3d();
  buildPadMeshes3d()
}

function step(dt){
  var thrusting=(a.k.ArrowUp||a.k.w)&&fuel>0;
  if(resultTimer>0){
    resultTimer-=dt;
    if(resultTimer<=0){
      if(lives<=0){render3d(dt,false);a.over(score,'Reached level '+level+' · Score: '+score);return}
      newLevel()
    }
    render3d(dt,false);
    return
  }
  lander.a+=2.6*a.ax()*dt;
  lander.vy+=(30+2*level)*dt;
  lander.vx+=windX*dt;
  if(thrusting){
    lander.vx+=95*Math.sin(lander.a)*dt;
    lander.vy-=95*Math.cos(lander.a)*dt;
    fuel=Math.max(0,fuel-60*dt)
  }
  lander.x+=lander.vx*dt;
  lander.y+=lander.vy*dt;
  if(lander.x<0||lander.x>W){lander.vx*=-.5;lander.x=s(lander.x,0,W)}
  var cosA=Math.cos(lander.a),sinA=Math.sin(lander.a),touched=!1;
  [[-9,12],[9,12],[0,-10]].forEach(function(pt){
    var wx=lander.x+pt[0]*cosA-pt[1]*sinA,wy=lander.y+pt[0]*sinA+pt[1]*cosA;
    if(wy>=terrainHeightAt(wx))touched=!0
  });
  if(touched){
    var landedPad=pads.filter(function(pd){return lander.x>pd.x1+2&&lander.x<pd.x2-2})[0];
    var speedOk=Math.abs(lander.vx)<24&&lander.vy<40&&Math.abs(lander.a)<.3;
    if(landedPad&&speedOk){
      var bonus=Math.round((100+Math.floor(fuel/5)+50*level)*landedPad.mult)+20*streak;
      score+=bonus;level++;streak++;
      message='Touchdown! +'+bonus;
      spawnParticles3d(mapX3d(lander.x),mapY3d(lander.y+12),o.green,20)
    }else{
      lives--;streak=0;
      message=landedPad?'Too fast or tilted!':'Missed the pad!';
      spawnParticles3d(mapX3d(lander.x),mapY3d(lander.y),o.coral,40)
    }
    resultTimer=1.6;lander.vx=0;lander.vy=0
  }
  render3d(dt,thrusting)
}

function render3d(dt,thrusting){
  var landerVisible=!(resultTimer>0&&message.indexOf('Touchdown')<0);
  landerGroup3d.visible=landerVisible;
  if(landerVisible){
    landerGroup3d.position.set(mapX3d(lander.x),mapY3d(lander.y),0);
    landerGroup3d.rotation.z=-lander.a;
    flameMesh3d.visible=!!thrusting
  }
  stepParticles3d(dt);
  renderer3d.render(scene3d,camera3d);
  if(message){msgDiv.textContent=message;msgDiv.style.display='block'}else{msgDiv.style.display='none'}
  a.hud([['SCORE',y(score)],['LEVEL',level],['VSPD',Math.round(lander.vy)],['LIVES',lives],['STREAK',streak]])
}

a.pad([['◀','ArrowLeft'],['THRUST','ArrowUp'],['▶','ArrowRight']]);
a.fns.push(function(){
  scene3d.traverse(function(obj){extDisposeThree(obj)});
  renderer3d.dispose();
  if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
  if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
});
a.begin(function(){
  score=0;level=1;lives=3;streak=0;
  newLevel();
  a.frame(step)
})
}
ext3DLoadGate(a.el,startGame3D)
}),w('neonTrails',b,'Neon Trails',o.teal,'Leave a wall of light behind you, box the rival in, and watch the arena slowly close in around you both.','Arrows / WASD to turn (no brakes) · swipe on mobile',function(a){
function startGame3D(){
var GRID=40,CELL=10,W=400,difficulty=1;
var grid,player,ai,score,streak,moveAcc,startFreeze,shrinkTimer,shrinkRing;

var wrapDiv=document.createElement('div');
wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
a.el.appendChild(wrapDiv);
var canvasWrap=document.createElement('div');
canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:1/1;margin:0 auto';
wrapDiv.appendChild(canvasWrap);

var renderer3d=extMakeWebGLRenderer();
if(!renderer3d){a.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
renderer3d.setSize(400,400);
renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
renderer3d.setClearColor(0x05030c,1);
canvasWrap.appendChild(renderer3d.domElement);
a.cv=renderer3d.domElement;a.w=W;a.h=W;

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

var gridMat3d=new THREE.LineBasicMaterial({color:0x3a2e74,transparent:true,opacity:0.45});
var gridPts3d=[];
for(var gi3=0;gi3<=GRID;gi3++){
  var gv=gi3-GRID/2;
  gridPts3d.push(gv,0.01,-GRID/2,gv,0.01,GRID/2);
  gridPts3d.push(-GRID/2,0.01,gv,GRID/2,0.01,gv)
}
var gridGeo3d=new THREE.BufferGeometry();
gridGeo3d.setAttribute('position',new THREE.Float32BufferAttribute(gridPts3d,3));
scene3d.add(new THREE.LineSegments(gridGeo3d,gridMat3d));

function mapX3d(col){return col-GRID/2+0.5}
function mapZ3d(row){return row-GRID/2+0.5}

var trailMeshes3d={};
var trailGeo3d=new THREE.BoxGeometry(0.92,0.5,0.92);
var playerTrailMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.teal),emissive:new THREE.Color(o.teal),emissiveIntensity:0.55,roughness:0.4});
var aiTrailMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.orange),emissive:new THREE.Color(o.orange),emissiveIntensity:0.55,roughness:0.4});
var ringMat3d=new THREE.MeshBasicMaterial({color:0xff6b4a,transparent:true,opacity:0.55});

function clearTrailMeshes3d(){
  Object.keys(trailMeshes3d).forEach(function(key){scene3d.remove(trailMeshes3d[key]);extDisposeThree(trailMeshes3d[key])});
  trailMeshes3d={}
}
function syncTrailMeshes3d(){
  for(var row=0;row<GRID;row++){
    for(var col=0;col<GRID;col++){
      var val=grid[row][col],key=row+','+col;
      if(val&&!trailMeshes3d[key]){
        var mat=val===1?playerTrailMat3d:val===2?aiTrailMat3d:ringMat3d;
        var h=val===3?0.9:0.5;
        var mesh=new THREE.Mesh(val===3?new THREE.BoxGeometry(1,h,1):trailGeo3d,mat);
        mesh.position.set(mapX3d(col),h/2,mapZ3d(row));
        scene3d.add(mesh);
        trailMeshes3d[key]=mesh
      }
    }
  }
}

var playerMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.teal),emissive:new THREE.Color(o.teal),emissiveIntensity:0.9,roughness:0.3});
var aiMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.orange),emissive:new THREE.Color(o.orange),emissiveIntensity:0.9,roughness:0.3});
var playerMesh3d=new THREE.Mesh(new THREE.BoxGeometry(0.85,0.7,0.85),playerMat3d);
var aiMesh3d=new THREE.Mesh(new THREE.BoxGeometry(0.85,0.7,0.85),aiMat3d);
scene3d.add(playerMesh3d);
scene3d.add(aiMesh3d);

var particleMeshes3d=[];
function spawnParticles3d(col,row,color,n){
  var col3=new THREE.Color(color),wx=mapX3d(col),wz=mapZ3d(row);
  for(var pi=0;pi<n;pi++){
    var mat=new THREE.MeshBasicMaterial({color:col3,transparent:true,opacity:1});
    var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.1,6,6),mat);
    mesh.position.set(wx,0.5,wz);
    scene3d.add(mesh);
    var ang=Math.random()*Math.PI*2,sp=0.04+Math.random()*0.16;
    particleMeshes3d.push({mesh:mesh,vx:Math.cos(ang)*sp,vz:Math.sin(ang)*sp,vy:0.03+Math.random()*0.08,life:1})
  }
}
function stepParticles3d(dt){
  for(var i2=particleMeshes3d.length-1;i2>=0;i2--){
    var pt=particleMeshes3d[i2];
    pt.vy-=0.012;
    pt.mesh.position.x+=pt.vx;pt.mesh.position.y+=pt.vy;pt.mesh.position.z+=pt.vz;
    pt.life-=0.035;
    pt.mesh.material.opacity=Math.max(0,pt.life);
    if(pt.life<=0||pt.mesh.position.y<-2){scene3d.remove(pt.mesh);extDisposeThree(pt.mesh);particleMeshes3d.splice(i2,1)}
  }
}

function isOpen(x,y){return x>=0&&y>=0&&x<GRID&&y<GRID&&!grid[y][x]}

function roomAhead(x,y,dx,dy,maxDist){
  var n=0;
  while(n<maxDist&&isOpen(x+dx*(n+1),y+dy*(n+1)))n++;
  return n
}

function closeRing(k){
  var lo=k,hi=GRID-1-k;
  if(lo>=hi)return;
  for(var col=lo;col<=hi;col++){grid[lo][col]=3;grid[hi][col]=3}
  for(var row=lo;row<=hi;row++){grid[row][lo]=3;grid[row][hi]=3}
}

function resetBoard(){
  grid=[];
  for(var row=0;row<GRID;row++){grid.push([]);for(var col=0;col<GRID;col++)grid[row].push(0)}
  player={x:8,y:20,dx:1,dy:0,nx:1,ny:0,dead:!1};
  ai={x:31,y:20,dx:-1,dy:0,dead:!1};
  grid[20][8]=1;grid[20][31]=2;
  moveAcc=0;startFreeze=.8;shrinkTimer=6;shrinkRing=0;
  clearTrailMeshes3d()
}

function newMatch(){score=0;streak=0;resetBoard();a.frame(step)}

function aiDecide(){
  var ahead=roomAhead(ai.x,ai.y,ai.dx,ai.dy,30);
  var thresholds=[8,14,22],jitters=[.05,.02,.008];
  if(ahead<thresholds[difficulty]||Math.random()<jitters[difficulty]){
    var options=[[ai.dx,ai.dy],[-ai.dy,ai.dx],[ai.dy,-ai.dx]].map(function(dir){
      return{d:dir,n:roomAhead(ai.x,ai.y,dir[0],dir[1],30)+Math.random()*(3-difficulty)}
    }).sort(function(p,q){return q.n-p.n});
    var best=options[0];
    if(best.n>.5||ahead===0){ai.dx=best.d[0];ai.dy=best.d[1]}
  }
}

function step(dt){
  var moveInterval=Math.max(.04,.085-.004*streak);
  if(startFreeze>0){startFreeze-=dt;render3d(dt);return}
  shrinkTimer-=dt;
  if(shrinkTimer<=0&&shrinkRing<19){
    closeRing(shrinkRing);shrinkRing++;
    shrinkTimer=Math.max(3,7-.3*streak)
  }
  moveAcc+=dt;
  while(moveAcc>=moveInterval&&!player.dead&&!ai.dead){
    moveAcc-=moveInterval;
    player.dx=player.nx;player.dy=player.ny;
    aiDecide();
    var px2=player.x+player.dx,py2=player.y+player.dy;
    var ax2=ai.x+ai.dx,ay2=ai.y+ai.dy;
    player.dead=!isOpen(px2,py2);
    ai.dead=!isOpen(ax2,ay2);
    if(px2===ax2&&py2===ay2){player.dead=!0;ai.dead=!0}
    if(!player.dead){player.x=px2;player.y=py2;grid[py2][px2]=1}
    if(!ai.dead){ai.x=ax2;ai.y=ay2;grid[ay2][ax2]=2}
  }
  render3d(dt);
  if(player.dead||ai.dead){
    if(player.dead&&ai.dead){spawnParticles3d(player.x,player.y,o.ink,20);resetBoard();return}
    if(ai.dead){
      streak++;score+=100+25*streak;
      spawnParticles3d(ai.x,ai.y,o.orange,30);
      resetBoard();return
    }
    spawnParticles3d(player.x,player.y,o.teal,30);
    a.over(score,streak+' round'+(streak===1?'':'s')+' won · Score: '+score)
  }
}

function render3d(dt){
  syncTrailMeshes3d();
  playerMesh3d.visible=!player.dead;
  aiMesh3d.visible=!ai.dead;
  if(!player.dead)playerMesh3d.position.set(mapX3d(player.x),0.35,mapZ3d(player.y));
  if(!ai.dead)aiMesh3d.position.set(mapX3d(ai.x),0.35,mapZ3d(ai.y));
  stepParticles3d(dt);
  renderer3d.render(scene3d,camera3d);
  a.hud([['SCORE',y(score)],['STREAK',streak]])
}

a.press=function(key){
  var dirMap={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]};
  var dir=dirMap[key];
  if(dir&&!(dir[0]===-player.dx&&dir[1]===-player.dy)){player.nx=dir[0];player.ny=dir[1]}
};
a.swipe(function(dir){a.press({up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'}[dir])});
a.opt('AI',['Easy','Normal','Hard'],difficulty,function(idx){difficulty=idx;newMatch()});
a.pad([['▲','ArrowUp'],['◀','ArrowLeft'],['▶','ArrowRight'],['▼','ArrowDown']]);
a.fns.push(function(){
  scene3d.traverse(function(obj){extDisposeThree(obj)});
  renderer3d.dispose();
  if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
  if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
});
a.begin(newMatch)
}
ext3DLoadGate(a.el,startGame3D)
}),w('silverBall',b,'Silver Ball',o.violet,'Flip, bump and chain combos into multiball before the last ball drains.','Left/Right (or Z / M) to flip · Space to nudge · limited nudge charges',function(r){
function startGame3D(){
  var W=360,H=500;
  var walls = [[10,70,70,10],[70,10,290,10],[290,10,350,70],[10,70,10,400],[350,70,350,400],[10,400,108,462],[350,400,252,462]];
  var bumpers = [{x:130,y:150,r:20,lit:0},{x:230,y:150,r:20,lit:0},{x:180,y:232,r:22,lit:0},{x:62,y:270,r:13,lit:0},{x:298,y:270,r:13,lit:0}];
  var targets, flippers, balls, score, lives, comboMult, comboTimer, level, nudgeCharges, nextExtraBall, bankMsg;

  var wrapDiv=document.createElement('div');
  wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
  r.el.appendChild(wrapDiv);
  var canvasWrap=document.createElement('div');
  canvasWrap.style.cssText='position:relative;width:100%;max-width:360px;aspect-ratio:360/500;margin:0 auto';
  wrapDiv.appendChild(canvasWrap);

  var renderer3d=extMakeWebGLRenderer();
  if(!renderer3d){r.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
  renderer3d.setSize(W,H);
  renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
  renderer3d.setClearColor(0x120a24,1);
  canvasWrap.appendChild(renderer3d.domElement);
  r.cv=renderer3d.domElement;r.w=W;r.h=H;

  var WH2=10*(H/W);
  function mapX3d(px2){return px2/W*20-10}
  function mapY3d(py){return WH2-py/H*(2*WH2)}

  var scene3d=new THREE.Scene();
  scene3d.fog=new THREE.Fog(0x120a24,30,56);
  var camera3d=new THREE.PerspectiveCamera(60,W/H,0.1,200);
  camera3d.position.set(0,0,24);
  camera3d.lookAt(0,0,0);

  scene3d.add(new THREE.AmbientLight(0xcfe3ff,0.85));
  var sun3d=new THREE.DirectionalLight(0xffffff,0.75);
  sun3d.position.set(6,10,14);
  scene3d.add(sun3d);

  function segMesh3d(x1,y1,x2,y2,thickness,mat){
    var p1={x:mapX3d(x1),y:mapY3d(y1)}, p2={x:mapX3d(x2),y:mapY3d(y2)};
    var mx=(p1.x+p2.x)/2, my=(p1.y+p2.y)/2;
    var len=Math.hypot(p2.x-p1.x,p2.y-p1.y);
    var ang=Math.atan2(p2.y-p1.y,p2.x-p1.x);
    var mesh=new THREE.Mesh(new THREE.BoxGeometry(len,thickness,thickness),mat);
    mesh.position.set(mx,my,0.2);
    mesh.rotation.z=ang;
    return mesh;
  }

  var wallMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.violet),emissive:new THREE.Color(o.violet),emissiveIntensity:0.25,roughness:0.5});
  walls.forEach(function(wl){ scene3d.add(segMesh3d(wl[0],wl[1],wl[2],wl[3],0.3,wallMat3d)); });

  var bumperLitMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.yellow),emissive:new THREE.Color(o.yellow),emissiveIntensity:0.5,roughness:0.4});
  var bumperOffMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.magenta),emissive:new THREE.Color(o.magenta),emissiveIntensity:0.2,roughness:0.5});
  var bumperMeshes3d = bumpers.map(function(bp){
    var mesh=new THREE.Mesh(new THREE.CylinderGeometry(bp.r/14,bp.r/14,0.7,16),bumperOffMat3d);
    mesh.rotation.x=Math.PI/2;
    mesh.position.set(mapX3d(bp.x),mapY3d(bp.y),0.2);
    scene3d.add(mesh);
    return mesh;
  });

  var targetHitMat3d=new THREE.MeshStandardMaterial({color:0x2a2050,roughness:0.7});
  var targetLiveMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.teal),emissive:new THREE.Color(o.teal),emissiveIntensity:0.4,roughness:0.4});
  var targetMeshes3d = [];

  var flipperMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.teal),emissive:new THREE.Color(o.teal),emissiveIntensity:0.25,roughness:0.5});
  var flipperPivotMat3d=new THREE.MeshStandardMaterial({color:0x10101a,roughness:0.5});
  var flipperMeshes3d = [];
  var flipperPivotMeshes3d = [];

  function disposeGroupChildren(grp){
    while(grp.children.length){
      var c2=grp.children.pop();
      grp.remove(c2);
      extDisposeThree(c2)
    }
  }
  var ballGroup3d=new THREE.Group();scene3d.add(ballGroup3d);
  var ballMat3d=new THREE.MeshStandardMaterial({color:0xd8dee8,metalness:0.6,roughness:0.25,emissive:0x9fb5c9,emissiveIntensity:0.15});

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

  function makeFlipper(px, dir){ return {px:px, py:462, dir:dir, len:64, ang:0.5, tip:{x:0,y:0}, prev:{x:0,y:0}}; }
  function flipperTip(fl){ return {x: fl.px + fl.dir*fl.len*Math.cos(fl.ang), y: fl.py + fl.len*Math.sin(fl.ang)}; }

  function resetTargets(){
    targets = [{x:150,y:96,r:9,hit:0},{x:180,y:80,r:9,hit:0},{x:210,y:96,r:9,hit:0}];
    targetMeshes3d.forEach(function(m){ scene3d.remove(m); extDisposeThree(m); });
    targetMeshes3d = targets.map(function(tg){
      var mesh=new THREE.Mesh(new THREE.CylinderGeometry(tg.r/14,tg.r/14,0.5,14),targetLiveMat3d);
      mesh.rotation.x=Math.PI/2;
      mesh.position.set(mapX3d(tg.x),mapY3d(tg.y),0.2);
      scene3d.add(mesh);
      return mesh;
    });
  }

  function spawnBall(withGrace){
    return {x:150+f(60), y:60, vx:c(-60,60), vy:0, r:8, grace: withGrace?0.6:0.35};
  }

  function gravityFor(){ return Math.min(780, 640+10*(level-1)); }
  function maxSpeedFor(){ return Math.min(900, 700+15*(level-1)); }
  function bumperPts(){ return 100+25*(level-1); }
  function targetPts(){ return 50+15*(level-1); }

  function segHit(ball, x1,y1,x2,y2, rest, wvx, wvy){
    var dx=x2-x1, dy=y2-y1;
    var tt = s(((ball.x-x1)*dx+(ball.y-y1)*dy)/(dx*dx+dy*dy||1),0,1);
    var px=x1+dx*tt, py=y1+dy*tt;
    var dist=Math.hypot(ball.x-px, ball.y-py);
    if(dist<ball.r && dist>1e-4){
      var nx=(ball.x-px)/dist, ny=(ball.y-py)/dist;
      ball.x += nx*(ball.r-dist); ball.y += ny*(ball.r-dist);
      var rvn = (ball.vx-wvx)*nx + (ball.vy-wvy)*ny;
      if(rvn<0){ ball.vx -= (1+rest)*rvn*nx; ball.vy -= (1+rest)*rvn*ny; }
      return true;
    }
    return false;
  }

  function addCombo(){ comboMult = Math.min(5, comboMult+1); comboTimer = 1.2; }

  function checkExtraBall(){
    if(score >= nextExtraBall){ lives++; nextExtraBall += 12000; bankMsg = 1.2; }
  }

  function loseBall(ball){
    balls.splice(balls.indexOf(ball),1);
    spawnParticles3d(mapX3d(ball.x), mapY3d(ball.y), o.magenta, 20);
    if(balls.length===0){
      lives--;
      if(lives<=0){ render3d(0); r.over(score, 'Score: '+score); return; }
      nudgeCharges = 3;
      comboMult = 1; comboTimer = 0;
      balls.push(spawnBall(true));
    }
  }

  function step(dt){
    var grav = gravityFor(), maxSp = maxSpeedFor();
    comboTimer -= dt;
    if(comboTimer<=0) comboMult = 1;
    if(bankMsg>0) bankMsg -= dt;

    flippers.forEach(function(fl, idx){
      var held = idx===0 ? (r.k.ArrowLeft||r.k.z||r.k.a) : (r.k.ArrowRight||r.k.m||r.k.d);
      fl.prev = fl.tip;
      fl.ang += s((held?-0.45:0.5)-fl.ang, -16*dt, 16*dt);
      fl.tip = flipperTip(fl);
    });

    for(var bi=balls.length-1; bi>=0; bi--){
      var ball = balls[bi];
      if(ball.grace>0){ ball.grace -= dt; continue; }
      var sub, k;
      for(sub=0; sub<4; sub++){
        var sdt = dt/4;
        ball.vy += grav*sdt;
        ball.x += ball.vx*sdt;
        ball.y += ball.vy*sdt;
        var spd = Math.hypot(ball.vx, ball.vy);
        if(spd>maxSp){ ball.vx *= maxSp/spd; ball.vy *= maxSp/spd; }
        for(k=0;k<walls.length;k++) segHit(ball, walls[k][0],walls[k][1],walls[k][2],walls[k][3], 0.5, 0, 0);
        for(k=0;k<bumpers.length;k++){
          var bp = bumpers[k];
          var dist = Math.hypot(ball.x-bp.x, ball.y-bp.y);
          if(dist < bp.r+ball.r){
            var nx=(ball.x-bp.x)/(dist||1), ny=(ball.y-bp.y)/(dist||1);
            ball.x = bp.x+nx*(bp.r+ball.r); ball.y = bp.y+ny*(bp.r+ball.r);
            var boosted = Math.max(300, Math.min(maxSp, 1.05*Math.hypot(ball.vx,ball.vy)));
            ball.vx = nx*boosted; ball.vy = ny*boosted;
            bp.lit = 0.15;
            score += bumperPts()*comboMult;
            addCombo();
            spawnParticles3d(mapX3d(bp.x), mapY3d(bp.y), o.yellow, 6);
            checkExtraBall();
          }
        }
        for(k=0;k<targets.length;k++){
          var tg = targets[k];
          if(tg.hit) continue;
          var td = Math.hypot(ball.x-tg.x, ball.y-tg.y);
          if(td < tg.r+ball.r){
            var tnx=(ball.x-tg.x)/(td||1), tny=(ball.y-tg.y)/(td||1);
            ball.x = tg.x+tnx*(tg.r+ball.r); ball.y = tg.y+tny*(tg.r+ball.r);
            var tspd = Math.max(260, Math.hypot(ball.vx,ball.vy));
            ball.vx = tnx*tspd; ball.vy = tny*tspd;
            tg.hit = 1;
            score += targetPts()*comboMult;
            addCombo();
            spawnParticles3d(mapX3d(tg.x), mapY3d(tg.y), o.teal, 10);
            checkExtraBall();
            if(targets.every(function(z){ return z.hit; })){
              score += 800+200*(level-1);
              addCombo();
              spawnParticles3d(mapX3d(180), mapY3d(88), o.violet, 26);
              resetTargets();
              if(balls.length<3) balls.push(spawnBall(false));
              checkExtraBall();
            }
          }
        }
        for(k=0;k<flippers.length;k++){
          var fl2 = flippers[k];
          segHit(ball, fl2.px, fl2.py, fl2.tip.x, fl2.tip.y, 0.35, (fl2.tip.x-fl2.prev.x)/(dt||1)*0.5, (fl2.tip.y-fl2.prev.y)/(dt||1)*0.5);
        }
      }
      if(ball.y>520) loseBall(ball);
    }

    bumpers.forEach(function(bp){ if(bp.lit>0) bp.lit -= dt; });
    level = 1+Math.floor(score/4000);
    render3d(dt);
  }

  function render3d(dt){
    bumpers.forEach(function(bp,idx){ bumperMeshes3d[idx].material = bp.lit>0 ? bumperLitMat3d : bumperOffMat3d; });
    targets.forEach(function(tg,idx){ if(targetMeshes3d[idx]) targetMeshes3d[idx].material = tg.hit ? targetHitMat3d : targetLiveMat3d; });

    flippers.forEach(function(fl, idx){
      if(flipperMeshes3d[idx]){ scene3d.remove(flipperMeshes3d[idx]); extDisposeThree(flipperMeshes3d[idx]); }
      flipperMeshes3d[idx] = segMesh3d(fl.px, fl.py, fl.tip.x, fl.tip.y, 0.75, flipperMat3d);
      scene3d.add(flipperMeshes3d[idx]);
      if(!flipperPivotMeshes3d[idx]){
        flipperPivotMeshes3d[idx] = new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.28,0.4,10), flipperPivotMat3d);
        flipperPivotMeshes3d[idx].rotation.x = Math.PI/2;
        scene3d.add(flipperPivotMeshes3d[idx]);
      }
      flipperPivotMeshes3d[idx].position.set(mapX3d(fl.px), mapY3d(fl.py), 0.25);
    });

    disposeGroupChildren(ballGroup3d);
    balls.forEach(function(ball){
      if(ball.grace>0 && Math.floor(ball.grace*10)%2) return;
      var mesh=new THREE.Mesh(new THREE.SphereGeometry(ball.r/14,12,12),ballMat3d);
      mesh.position.set(mapX3d(ball.x), mapY3d(ball.y), 0.3);
      ballGroup3d.add(mesh);
    });

    stepParticles3d(dt);
    renderer3d.render(scene3d,camera3d);
    r.hud([['SCORE',y(score)],['BALLS',lives],['LVL',level],['COMBO','x'+comboMult]]);
  }

  r.press = function(key){
    if(key!==' ' && key!=='ArrowUp') return;
    if(nudgeCharges<=0) return;
    var target = null;
    balls.forEach(function(ball){ if(ball.grace<=0 && (!target || ball.y>target.y)) target = ball; });
    if(!target) return;
    nudgeCharges--;
    target.vy -= 140;
    target.vx += c(-60,60);
  };

  r.pad([['◀ FLIP','z'],['NUDGE',' '],['FLIP ▶','m']]);

  r.fns.push(function(){
    scene3d.traverse(function(obj){extDisposeThree(obj)});
    renderer3d.dispose();
    if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
    if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
  });
  r.begin(function(){
    lives = 3; score = 0; level = 1; comboMult = 1; comboTimer = 0; nudgeCharges = 3; nextExtraBall = 8000; bankMsg = 0;
    flippers = [makeFlipper(108,1), makeFlipper(252,-1)];
    flippers.forEach(function(fl){ fl.tip = fl.prev = flipperTip(fl); });
    resetTargets();
    balls = [spawnBall(true)];
    r.fx = [];
    r.frame(step);
  });
}
ext3DLoadGate(r.el,startGame3D)
}),w('caveCopter',b,'Cave Copter',o.orange,'Hold to climb, thread the winding cave, and grab fuel orbs without clipping a wall.','Hold Space / Up / click to climb',function(r){
function startGame3D(){
  var W=400, H=360;
  var cave, scrollAcc, heliY, heliVel, dist, tunnelW, nextCenter, gateCd, gates, orbs, orbCd, heliX, shield, invuln, bonus, timeAcc;

  var wrapDiv=document.createElement('div');
  wrapDiv.style.cssText='display:flex;flex-direction:column;align-items:center;width:100%;gap:10px';
  r.el.appendChild(wrapDiv);
  var canvasWrap=document.createElement('div');
  canvasWrap.style.cssText='position:relative;width:100%;max-width:400px;aspect-ratio:400/360;margin:0 auto';
  wrapDiv.appendChild(canvasWrap);

  var renderer3d=extMakeWebGLRenderer();
  if(!renderer3d){r.fns.push(function(){if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)});return}
  renderer3d.setSize(W,H);
  renderer3d.domElement.style.cssText='display:block;width:100%;height:100%';
  renderer3d.setClearColor(0x140a2e,1);
  canvasWrap.appendChild(renderer3d.domElement);
  r.cv=renderer3d.domElement;r.w=W;r.h=H;

  var WH2=10*(H/W);
  var SCALE3d=0.05;
  function mapX3d(px2){return px2/W*20-10}
  function mapY3d(py){return WH2-py/H*(2*WH2)}

  var scene3d=new THREE.Scene();
  scene3d.fog=new THREE.Fog(0x140a2e,22,46);
  var camera3d=new THREE.PerspectiveCamera(60,W/H,0.1,200);
  camera3d.position.set(0,0,17);
  camera3d.lookAt(0,0,0);

  scene3d.add(new THREE.AmbientLight(0xe8d9ff,0.55));
  var sun3d=new THREE.DirectionalLight(0xffffff,0.6);
  sun3d.position.set(6,10,14);
  scene3d.add(sun3d);

  function disposeGroupChildren(grp){
    while(grp.children.length){
      var c2=grp.children.pop();
      grp.remove(c2);
      extDisposeThree(c2)
    }
  }
  var wallGroup3d=new THREE.Group();scene3d.add(wallGroup3d);
  var gateGroup3d=new THREE.Group();scene3d.add(gateGroup3d);
  var orbGroup3d=new THREE.Group();scene3d.add(orbGroup3d);

  var wallMat3d=new THREE.MeshStandardMaterial({color:0x3a2a7a,roughness:0.7,side:THREE.DoubleSide});
  var gateScoredMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.dim),roughness:0.6});
  var gateActiveMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.magenta),emissive:new THREE.Color(o.magenta),emissiveIntensity:0.3,roughness:0.5});
  var orbFuelMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.green),emissive:new THREE.Color(o.green),emissiveIntensity:0.4,roughness:0.4});
  var orbShieldMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.blue),emissive:new THREE.Color(o.blue),emissiveIntensity:0.4,roughness:0.4});
  var orbCoreMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.ink)});

  var heliOrangeMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.orange),emissive:new THREE.Color(o.orange),emissiveIntensity:0.3,roughness:0.5,transparent:true,opacity:1});
  var heliBlueMat3d=new THREE.MeshStandardMaterial({color:new THREE.Color(o.blue),emissive:new THREE.Color(o.blue),emissiveIntensity:0.3,roughness:0.5,transparent:true,opacity:1});
  var heliInkMat3d=new THREE.MeshBasicMaterial({color:new THREE.Color(o.ink)});
  var heliGroup3d=new THREE.Group();
  var heliBody3d=new THREE.Mesh(new THREE.BoxGeometry(24*SCALE3d,14*SCALE3d,8*SCALE3d),heliOrangeMat3d);
  heliGroup3d.add(heliBody3d);
  var heliBlade3d=new THREE.Mesh(new THREE.BoxGeometry(10*SCALE3d,2.4*SCALE3d,2.4*SCALE3d),heliInkMat3d);
  heliBlade3d.position.set(-6*SCALE3d,7*SCALE3d,2*SCALE3d);
  heliBlade3d.rotation.z=0.26;
  heliGroup3d.add(heliBlade3d);
  var heliTail3d=new THREE.Mesh(new THREE.BoxGeometry(8*SCALE3d,2.4*SCALE3d,2.4*SCALE3d),heliInkMat3d);
  heliTail3d.position.set(-18*SCALE3d,-1*SCALE3d,2*SCALE3d);
  heliGroup3d.add(heliTail3d);
  var heliSkid3d=new THREE.Mesh(new THREE.BoxGeometry(8*SCALE3d,6*SCALE3d,2*SCALE3d),heliInkMat3d);
  heliSkid3d.position.set(4*SCALE3d,-2*SCALE3d,2*SCALE3d);
  heliGroup3d.add(heliSkid3d);
  scene3d.add(heliGroup3d);

  var particleMeshes3d=[];
  function spawnParticles3d(wx,wy,color,n){
    var col=new THREE.Color(color);
    for(var pi=0;pi<n;pi++){
      var mat=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1});
      var mesh=new THREE.Mesh(new THREE.SphereGeometry(0.11,6,6),mat);
      mesh.position.set(wx,wy,0.3);
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

  function pushSegment(){
    nextCenter = s(nextCenter+c(-9,9), tunnelW/2+14, H-tunnelW/2-14);
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
      if(shield>0){ shield=0; invuln=0.9; spawnParticles3d(mapX3d(heliX), mapY3d(heliY), o.blue, 20); }
      else { spawnParticles3d(mapX3d(heliX), mapY3d(heliY), o.orange, 30); render3d(dt); r.over(Math.floor(dist/10)+bonus, 'Distance '+Math.floor(dist/10)+' m · Score '+(Math.floor(dist/10)+bonus)); return; }
    }

    for(gi=0; gi<gates.length; gi++){
      gt = gates[gi];
      if(!gt.scored && gt.x+gt.w < heliX-8){ gt.scored=1; bonus += 10; spawnParticles3d(mapX3d(gt.x), mapY3d(gt.y+gt.h/2), o.magenta, 6); }
      if(invuln<=0 && heliX+8 > gt.x && heliX-8 < gt.x+gt.w && heliY+8 > gt.y && heliY-8 < gt.y+gt.h){
        if(shield>0){ shield=0; invuln=0.9; spawnParticles3d(mapX3d(heliX), mapY3d(heliY), o.blue, 20); }
        else { spawnParticles3d(mapX3d(heliX), mapY3d(heliY), o.orange, 30); render3d(dt); r.over(Math.floor(dist/10)+bonus, 'Distance '+Math.floor(dist/10)+' m · Score '+(Math.floor(dist/10)+bonus)); return; }
      }
    }

    for(oi=orbs.length-1; oi>=0; oi--){
      ot = orbs[oi];
      if(Math.hypot(ot.x-heliX, ot.y-heliY) < ot.r+10){
        ot.taken = 1;
        if(ot.kind==='shield'){ shield = 1; spawnParticles3d(mapX3d(ot.x), mapY3d(ot.y), o.blue, 14); }
        else { bonus += 15; spawnParticles3d(mapX3d(ot.x), mapY3d(ot.y), o.green, 10); }
      }
    }

    render3d(dt);
  }

  function render3d(dt){
    disposeGroupChildren(wallGroup3d);
    var shapeTop=new THREE.Shape();
    shapeTop.moveTo(mapX3d(0), mapY3d(0));
    cave.forEach(function(seg,i){ shapeTop.lineTo(mapX3d(10*i-scrollAcc), mapY3d(seg.t)); });
    shapeTop.lineTo(mapX3d(420), mapY3d(0));
    wallGroup3d.add(new THREE.Mesh(new THREE.ShapeGeometry(shapeTop), wallMat3d));

    var shapeBot=new THREE.Shape();
    shapeBot.moveTo(mapX3d(0), mapY3d(H));
    cave.forEach(function(seg,i){ shapeBot.lineTo(mapX3d(10*i-scrollAcc), mapY3d(seg.b)); });
    shapeBot.lineTo(mapX3d(420), mapY3d(H));
    wallGroup3d.add(new THREE.Mesh(new THREE.ShapeGeometry(shapeBot), wallMat3d));

    disposeGroupChildren(gateGroup3d);
    gates.forEach(function(gt){
      var mesh=new THREE.Mesh(new THREE.BoxGeometry(gt.w*SCALE3d,gt.h*SCALE3d,0.3), gt.scored?gateScoredMat3d:gateActiveMat3d);
      mesh.position.set(mapX3d(gt.x+gt.w/2), mapY3d(gt.y+gt.h/2), 0);
      gateGroup3d.add(mesh);
    });

    disposeGroupChildren(orbGroup3d);
    orbs.forEach(function(ob){
      var pulse = 1+0.15*Math.sin(timeAcc*6+ob.x);
      var mat = ob.kind==='shield'?orbShieldMat3d:orbFuelMat3d;
      var mesh=new THREE.Mesh(new THREE.SphereGeometry(ob.r*SCALE3d*pulse,10,10), mat);
      mesh.position.set(mapX3d(ob.x), mapY3d(ob.y), 0.2);
      orbGroup3d.add(mesh);
      var core=new THREE.Mesh(new THREE.SphereGeometry(ob.r*SCALE3d*0.4,8,8), orbCoreMat3d);
      core.position.set(mapX3d(ob.x), mapY3d(ob.y), 0.3);
      orbGroup3d.add(core);
    });

    var flicker = invuln>0 && Math.floor(invuln*16)%2;
    var heliMat = shield>0?heliBlueMat3d:heliOrangeMat3d;
    heliBody3d.material = heliMat;
    heliMat.opacity = flicker ? 0.35 : 1;
    heliGroup3d.position.set(mapX3d(heliX), mapY3d(heliY), 0.1);
    heliGroup3d.rotation.z = -heliVel/900;

    stepParticles3d(dt);
    renderer3d.render(scene3d,camera3d);
    r.hud([['SCORE', Math.floor(dist/10)+bonus], ['DIST', Math.floor(dist/10)+'m'], ['SHIELD', shield>0?'yes':'no']]);
  }

  r.pointer({down:function(){ r.k[' ']=1; }, up:function(){ delete r.k[' ']; }});
  r.pad([['CLIMB','ArrowUp']]);
  r.fns.push(function(){
    scene3d.traverse(function(obj){extDisposeThree(obj)});
    renderer3d.dispose();
    if(renderer3d.forceContextLoss)renderer3d.forceContextLoss();
    if(wrapDiv&&wrapDiv.parentNode)wrapDiv.parentNode.removeChild(wrapDiv)
  });
  r.begin(function(){
    var i;
    cave = []; nextCenter = 180; tunnelW = 240; dist = 0; scrollAcc = 0; heliY = 180; heliVel = 0;
    gates = []; orbs = []; gateCd = 500; orbCd = 3; heliX = 90; shield = 0; invuln = 0; bonus = 0; timeAcc = 0;
    r.fx = [];
    for(i=0;i<46;i++) pushSegment();
    r.frame(step);
  });
}
ext3DLoadGate(r.el,startGame3D)
})