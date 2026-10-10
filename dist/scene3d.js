import {decorateHall} from './decorate-hall.js';
import {shortWallet,createWalletLabels} from './wallet-labels.js';
import {createClerkDialogue} from './clerk-dialogue.js';
import {createExchange} from './exchange3d.js';
import * as THREE from './vendor/three.module.js';
import {loadShopModels,makeModel,species,hasModel} from './model-library.js';
import {buildHall,makeClerk,LANES} from './hall3d.js';

const host=document.getElementById('world');
const loading=document.createElement('div');loading.className='model-loading';loading.innerHTML='<b>布置你的奇物小店</b><span>正在加载角色与家具…</span>';host.append(loading);
const scene=new THREE.Scene();scene.background=new THREE.Color('#dce1d3');
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.localClippingEnabled=true;renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.96;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.domElement.setAttribute('role','img');renderer.domElement.setAttribute('aria-label','3D奇物小店，可旋转视角');host.prepend(renderer.domElement);
const camera=new THREE.PerspectiveCamera(43,1,.1,100),look=new THREE.Vector3(0,.75,0),targetLook=look.clone();
let yaw=.24,pitch=.68,distance=23.8,targetYaw=yaw,targetPitch=pitch,targetDistance=distance;
scene.add(new THREE.HemisphereLight('#fff3d9','#7b8e75',2.0));
const sun=new THREE.DirectionalLight('#fff0d4',2.1);sun.position.set(-3,9,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.5,far:30});sun.shadow.normalBias=.025;sun.shadow.bias=-.00015;scene.add(sun);
const fill=new THREE.DirectionalLight('#d3e6dc',1.1);fill.position.set(6,5,-2);scene.add(fill);
const mats=new Map();function material(color,roughness=.85){const key=color+roughness;if(!mats.has(key))mats.set(key,new THREE.MeshStandardMaterial({color,roughness}));return mats.get(key)}
const cube=new THREE.BoxGeometry(1,1,1),sphere=new THREE.SphereGeometry(1,20,12);
function mesh(parent,geo,color,x,y,z,sx=1,sy=1,sz=1){const m=new THREE.Mesh(geo,typeof color==='string'?material(color):color);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(p,c,x,y,z,w,h,d){return mesh(p,cube,c,x,y,z,w,h,d)}
function ball(p,c,x,y,z,w,h=w,d=w){return mesh(p,sphere,c,x,y,z,w,h,d)}
function cylinder(p,c,x,y,z,r,h,r2=r){return mesh(p,new THREE.CylinderGeometry(r,r2,h,24),c,x,y,z)}
function textPlane(text,w,h,bg='#456651',fg='#f4e7c7',font=60){const c=document.createElement('canvas');c.width=1536;c.height=Math.max(192,Math.round(1536*h/w));const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);const lines=(window.PocketI18n?.t(text)||text).split('\n');let size=Math.min(c.height/(lines.length+1)*.9,180);ctx.font='700 '+size+'px "Microsoft YaHei",sans-serif';while(Math.max(...lines.map(line=>ctx.measureText(line).width))>c.width*.89&&size>24){size-=2;ctx.font='700 '+size+'px "Microsoft YaHei",sans-serif'}ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';lines.forEach((line,i)=>ctx.fillText(line,c.width/2,c.height/2+(i-(lines.length-1)/2)*size*1.35));const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,toneMapped:false}))}
const room=new THREE.Group();scene.add(room);
const hall=buildHall(THREE,room,{box,ball,cylinder,textPlane});decorateHall(THREE,room,{box,ball,cylinder,textPlane});
// Keep initial architecture visible while assets load, with clear progress.
function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(host);resize();
function updateCamera(dt){const e=1-Math.exp(-dt*5);yaw+=(targetYaw-yaw)*e;pitch+=(targetPitch-pitch)*e;distance+=(targetDistance-distance)*e;look.lerp(targetLook,e);const aspect=host.clientWidth/host.clientHeight;const d=distance*(aspect<1?1.28:1);camera.position.set(look.x+Math.sin(yaw)*Math.cos(pitch)*d,look.y+Math.sin(pitch)*d,look.z+Math.cos(yaw)*Math.cos(pitch)*d);camera.lookAt(look);camera.updateProjectionMatrix()}
updateCamera(1);renderer.render(scene,camera);
await loadShopModels((n,total)=>{loading.querySelector('span').textContent=`角色与家具 ${n} / ${total}`});loading.remove();
function prop(name,opts,x,z,rot=0){const m=makeModel(name,opts);m.root.position.set(x,.08,z);m.root.rotation.y=rot;room.add(m.root);return m}
for(const [x,z,h]of [[-8,5.75,1.4],[8,5.75,1.4],[-7.7,-4.6,1.8],[7.7,-4.6,1.8],[-8,-.8,1.1],[8,-.8,1.1]]){const m=prop('plant',{height:h},x,z);if(x===4.4)m.root.position.y=1.48;}
const actors=new Map(),staff=[];let allocation=0;
function staffModel(name,x,z,height){const m=makeModel(name,{height});m.root.position.set(x,.08,z);scene.add(m.root);staff.push(m);return m}
// Capybara shopkeeper and rigged guest characters.
const capy=new THREE.Group();capy.position.set(-6.9,.10,-3.6);scene.add(capy);
ball(capy,'#cfa174',0,1.05,0,.65,.72,.44);ball(capy,'#dcb082',0,1.80,.05,.64,.56,.48);
for(const x of [-.45,.45]){ball(capy,'#cfa174',x,2.23,.04,.16,.17,.10);ball(capy,'#ae7a57',x,2.25,.12,.08,.09,.025);ball(capy,'#25261f',x*.57,1.94,.465,.047,.056,.029);ball(capy,'#e39478',x*.83,1.73,.45,.11,.07,.022);0}
ball(capy,'#aa7955',0,1.72,.51,.29,.29,.10);for(const x of [-.08,.08])ball(capy,'#5d4434',x,1.82,.61,.022,.065,.013);
box(capy,'#a8693e',0,1.02,.44,.91,.80,.035);box(capy,'#d8b47a',0,.92,.47,.35,.27,.025);
for(const x of [-.31,.31]){ball(capy,'#cfa174',x,.36,.08,.24,.17,.29);ball(capy,'#ddbc77',x,1.37,.46,.043)}
for(let i=0;i<3;i++){const leaf=ball(capy,'#69864c',.36+i*.1,2.37-i*.025,.13,.14,.07,.035);leaf.rotation.z=.7-i*.6;}
const arms=[];for(const x of [-.6,.6]){const arm=new THREE.Group();arm.position.set(x,1.40,.05);ball(arm,'#cfa174',0,-.25,0,.18,.38,.19);capy.add(arm);arms.push(arm)}
const exchanges=LANES.map((x,i)=>{const clerk=makeClerk(THREE,scene,{ball,box},i,x);const name=['fox','raccoon','bear'][i];let model=null;if(hasModel(name)){scene.remove(clerk.root);model=staffModel(name,x,-4.13,name==='fox'?3.1:2.85);model.root.position.y=.32;}return createExchange(scene,model?.root||clerk.root,model?[]:clerk.arms,{x,model});});
for(let i=0;i<3;i++){const x=LANES[i];if(hasModel('hall-counter')){hall.counterFallbacks[i].visible=false;prop('hall-counter',{height:1.43,width:3.48,depth:1.45},x,-2.7)}if(hasModel('hall-shelf')){hall.shelfFallbacks[i].visible=false;prop('hall-shelf',{height:2.7,width:3.5,depth:.75},x,-5.5).root.position.y=.9}}
if(hasModel('hall-window'))for(const x of [-8.74,8.74]){const m=prop('hall-window',{height:2.7,width:2.6,depth:.22},x,-1.4,x<0?Math.PI/2:-Math.PI/2);m.root.position.y=1.1}
if(hasModel('hall-entry')){box(room,'#deceb0',-8.9,1.65,3.65,.2,3.3,3.6);prop('hall-entry',{height:3.05,width:2.9,depth:.22},-8.73,3.65,Math.PI/2);}
if(hasModel('hall-bench'))[-1,1].forEach((side,i)=>{hall.benchFallbacks[i].visible=false;prop('hall-bench',{height:1.3,width:3.1,depth:1.0},side*7.8,1.2,side<0?Math.PI/2:-Math.PI/2)});
if(hasModel('hall-lantern'))LANES.forEach((x,i)=>{hall.lampFallbacks[i].visible=false;const lamp=prop('hall-lantern',{height:.9},x,-3.8);lamp.root.position.y=3.7;const light=new THREE.PointLight('#ffe2a3',2.2,6,2);light.position.set(x,3.4,-3.8);scene.add(light)});
if(hasModel('hall-cabinet'))for(const x of [-6.4,6.4])prop('hall-cabinet',{height:1.6,width:1.8,depth:.85},x,-5.5);
const helper=staffModel('pigeon',-7.7,-2.7,1.5);helper.root.position.y=.65;
const courier=staffModel('gecko',7.4,-2.2,1.72);courier.root.rotation.y=-.38;
const updateWalletLabels=createWalletLabels(THREE,host);
const dialogue=createClerkDialogue(host,THREE,LANES);
function add(v){
 const occupied=new Set([...actors.values()].map(a=>a.species));
 const order=species.slice(allocation%5).concat(species.slice(0,allocation%5));const name=order.find(s=>!occupied.has(s))||order[0];allocation++;
 v.skin={capybara:0,rabbit:3,hedgehog:4,pigeon:1,gecko:2}[name];
 const m=makeModel(name,{height:name==='rabbit'?1.72:1.62});
 const lane=v.lane??0,x=LANES[lane],last=Math.max(5.6,...[...actors.values()].filter(a=>a.lane===lane).map(a=>a.root.position.z));
 m.root.position.set(x,.08,last+1.8);m.root.rotation.y=Math.PI;scene.add(m.root);
 const label=document.createElement('span');label.className='name3d wallet-name3d';label.textContent=(v.mine?'你 · ':'')+shortWallet(v.wallet);label.setAttribute('aria-label','钱包 '+label.textContent);host.append(label);
 actors.set(v.id,{...m,species:name,lane,id:v.id,mine:v.mine,label,path:[],resolve:null,heading:Math.PI,walking:false,target:null});exchanges[lane].add(actors.get(v.id),v);
}
function route(id,points){const a=actors.get(id);if(!a)return Promise.resolve();a.resolve?.();a.path=points.map(([x,z])=>new THREE.Vector3(x,.08,z));return new Promise(r=>a.resolve=r)}
function queue(list){const counts=[0,0,0];list.forEach(v=>{const a=actors.get(v.id);if(!a)return;const z=.85+counts[a.lane]++*1.8;if(a.target!==z){a.target=z;route(v.id,[[LANES[a.lane],z]])}})}
async function inspect(v){const a=actors.get(v.id);if(!a)return;a.target=null;await route(v.id,[[LANES[a.lane],-.85]]);await exchanges[a.lane].present(a,v)}
async function leave(id){const a=actors.get(id);if(!a)return;const x=LANES[a.lane];await route(id,[[x+2.0,-.85],[x+2.0,7.65]]);exchanges[a.lane].remove(a);scene.remove(a.root);a.label.remove();a.mixer.stopAllAction();a.mixer.uncacheRoot(a.visual);actors.delete(id)}
function view(preset){if(preset==='counter'){targetYaw=.08;targetPitch=.43;targetDistance=18;targetLook.set(0,1.25,-2.7)}else if(preset==='door'){targetYaw=-.40;targetPitch=.62;targetDistance=26;targetLook.set(0,.65,.2)}else{targetYaw=.24;targetPitch=.68;targetDistance=23.8;targetLook.set(0,.75,0)}}
let drag=null;renderer.domElement.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];renderer.domElement.setPointerCapture(e.pointerId)});renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;targetYaw=THREE.MathUtils.clamp(targetYaw-(e.clientX-drag[0])*.005,-.85,.85);targetPitch=THREE.MathUtils.clamp(targetPitch+(e.clientY-drag[1])*.004,.33,1.03);drag=[e.clientX,e.clientY]});renderer.domElement.addEventListener('pointerup',()=>drag=null);renderer.domElement.addEventListener('pointercancel',()=>drag=null);window.addEventListener('blur',()=>drag=null);renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();targetDistance=THREE.MathUtils.clamp(targetDistance+e.deltaY*.007,14,36)},{passive:false});
const clock=new THREE.Clock();let t=0;
function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.05);if(document.hidden)return;t+=dt;updateCamera(dt);
 for(const a of actors.values()){
  a.walking=false;
  if(a.path.length){const goal=a.path[0],dx=goal.x-a.root.position.x,dz=goal.z-a.root.position.z,d=Math.hypot(dx,dz);let step=Math.min(d,dt*1.35);
   for(const b of actors.values()){if(b===a)continue;const bx=a.root.position.x-b.root.position.x,bz=a.root.position.z-b.root.position.z;const gap=Math.hypot(bx,bz);if(d>.001&&(dx*bx+dz*bz)<0&&gap<1.40)step=Math.min(step,Math.max(0,gap-1.32));}
   if(d<.025){a.root.position.copy(goal);a.path.shift();if(!a.path.length){a.heading=Math.PI;a.resolve?.();a.resolve=null;}}
   else if(step>.0001){a.root.position.x+=dx/d*step;a.root.position.z+=dz/d*step;a.heading=Math.atan2(dx,dz);a.walking=true;}
  }
  a.root.rotation.y+=Math.atan2(Math.sin(a.heading-a.root.rotation.y),Math.cos(a.heading-a.root.rotation.y))*Math.min(1,dt*9);
  a.update(dt,a.walking,.90);exchanges[a.lane].update(a,dt);
 }
 exchanges.forEach(e=>e.frame(dt));dialogue.update(camera);updateWalletLabels(actors,camera);host.dataset.exchange=exchanges.map(e=>e.phase).join(" / ");const visibleActors=[...actors.values()].filter(a=>a.root.position.z<6.4);let closest=Infinity;for(let i=0;i<visibleActors.length;i++)for(let j=i+1;j<visibleActors.length;j++)closest=Math.min(closest,visibleActors[i].root.position.distanceTo(visibleActors[j].root.position));host.dataset.closestActorGap=Number.isFinite(closest)?closest.toFixed(3):'none';renderer.render(scene,camera);host.dataset.renderer='three-webgl';host.dataset.characters=String(actors.size);host.dataset.walking=String([...actors.values()].filter(a=>a.walking).length);
}
window.Shop3D={say:dialogue.say,setSound:dialogue.setSound,add,queue,inspect,leave,view,result:(id,accepted)=>{const a=actors.get(id);return a?exchanges[a.lane].result(a,accepted):Promise.resolve()}};frame();






