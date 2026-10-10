import {createRelic} from './relics3d.js';
import * as T from './vendor/three.module.js';
export function createExchange(scene,capy,arms,{x=-.55,model=null}={}){
 function item(name){const g=createRelic(name);scene.add(g);return g;}
 function dispose(g){scene.remove(g);g.userData.dispose();}
 // Solve in each joint's parent space: imported rigs use non-uniform scale.
 function aim(bone,end,target){if(!bone||!end)return;bone.updateWorldMatrix(true,true);const inv=bone.parent.matrixWorld.clone().invert(),origin=bone.position.clone(),old=end.getWorldPosition(new T.Vector3()).applyMatrix4(inv).sub(origin).normalize(),to=target.clone().applyMatrix4(inv).sub(origin).normalize();bone.quaternion.premultiply(new T.Quaternion().setFromUnitVectors(old,to));bone.updateWorldMatrix(false,true);}
 function pose(a,target){const b=a.bones;if(!b?.arm||!b.fore||!b.hand)return;for(let i=0;i<12;i++){aim(b.fore,b.hand,target);aim(b.arm,b.hand,target);if(b.hand.getWorldPosition(new T.Vector3()).distanceToSquared(target)<.000001)break;}}
 function carryTarget(a){return a.root.localToWorld(new T.Vector3(.38,a.height*.43,.43));}
 function carriedPosition(a){pose(a,carryTarget(a));return hand(a);}
 function prepareItem(a,name){const mesh=createRelic(name),g=new T.Group();mesh.scale.setScalar(.52);mesh.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(mesh),center=bounds.getCenter(new T.Vector3());mesh.position.set(-center.x,-bounds.min.y+.055,-center.z+.08);g.add(mesh);
 // A small wooden presentation tray has its handle at the actual wrist.
 const mat=new T.MeshStandardMaterial({color:0x98734b,roughness:.8});const tray=new T.Mesh(new T.CylinderGeometry(.22,.21,.035,32),mat);tray.position.set(0,.025,.08);g.add(tray);const handle=new T.Mesh(new T.BoxGeometry(.085,.04,.18),mat);handle.position.set(0,0,-.09);g.add(handle);g.userData.dispose=()=>{mesh.userData.dispose();tray.geometry.dispose();handle.geometry.dispose();mat.dispose()};scene.add(g);return g;}
 function hand(a){a.root.updateWorldMatrix(true,true);return a.bones?.hand?.getWorldPosition(new T.Vector3())||a.root.localToWorld(new T.Vector3(.3,.85,.35))}
 let active=null;
 const counter=new T.Vector3(x,1.65,-2.5),check=new T.Vector3(x,2.10,-3.35);
 if(model){model.bones={arm:model.visual.getObjectByName("RightArm"),fore:model.visual.getObjectByName("RightForeArm"),hand:model.visual.getObjectByName("RightHand")};}
 function tween(a,phase,duration,from,to){return new Promise(resolve=>{active={a,phase,duration,time:0,from:from.clone(),to:to.clone(),resolve};scene.userData.exchange=phase})}
 return {
 add(a,v){a.gift=prepareItem(a,v.item.name);a.carry=true;const find=n=>a.visual.getObjectByName(n);a.bones={arm:find('RightArm'),fore:find('RightForeArm'),hand:find('RightHand')};},
 async present(a,v){dispose(a.gift);a.gift=prepareItem(a,v.item.name);a.carry=false;await tween(a,'递交奇物',1.15,carriedPosition(a),counter);await tween(a,'店主接取',.8,counter,check);active={a,phase:'检查奇物',time:0};},
 async result(a,accepted){if(!a)return;const start=a.gift.position.clone();if(accepted){await tween(a,'收下奇物',1.05,start,new T.Vector3(x-.85,1.58,-2.9));a.gift.visible=false;}else{await tween(a,'退回奇物',.9,start,counter);await tween(a,'取回奇物',.85,counter,carriedPosition(a));a.carry=true;}active=null;},
 update(a,dt){if(a.carry){a.gift.position.copy(carriedPosition(a));a.gift.rotation.set(0,a.root.rotation.y,0)}},
 frame(dt){if(model){model.update(dt,false);if(active)pose(model,active.a.gift.position)}for(const arm of arms){const q=new T.Quaternion();if(active){const target=capy.worldToLocal(active.a.gift.position.clone()).sub(arm.position).normalize();q.setFromUnitVectors(new T.Vector3(0,-1,0),target)}arm.quaternion.slerp(q,1-Math.exp(-dt*9))}if(!active)return;const s=active;s.time+=dt;if(s.phase==='检查奇物'){s.a.gift.position.copy(check);s.a.gift.position.y+=Math.sin(s.time*2.6)*.045;s.a.gift.rotation.set(Math.sin(s.time*2)*.18,s.time*.9,.12*Math.sin(s.time*2.3));capy.rotation.y=Math.sin(s.time*1.7)*.065;}else{const p=Math.min(1,s.time/s.duration),e=p*p*(3-2*p);if(s.phase==='取回奇物')s.to.copy(carriedPosition(s.a));s.a.gift.rotation.set(0,s.a.root.rotation.y,0);s.a.gift.position.lerpVectors(s.from,s.to,e);s.a.gift.position.y+=Math.sin(p*Math.PI)*.12;pose(s.a,s.a.gift.position);if(p===1){active=null;s.resolve()}}},
 remove(a){dispose(a.gift);if(active?.a===a){active.resolve?.();active=null}capy.rotation.y=0;},
 get phase(){return active?.phase||'拿着奇物排队'}
 };
}

