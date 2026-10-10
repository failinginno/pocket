import * as THREE from './vendor/three.module.js';
import { GLTFLoader } from './vendor/loaders/GLTFLoader.js';
import { clone } from './vendor/utils/SkeletonUtils.js';

const loader = new GLTFLoader();
export const species = ['capybara','rabbit','hedgehog','pigeon','gecko'];
const sources = new Map();
export const hasModel=name=>sources.has(name);
export async function loadShopModels(onProgress) {
  const files = [...species.map(name => [name, `${name}-walk.glb`]), ...['plant'].map(name => [name, `${name}.glb`])];
  const manifest=await fetch("./assets/models/hall-manifest.json").then(r=>r.json());
  files.push(...Object.entries(manifest));
  let done = 0;
  await Promise.all(files.map(async ([name,file]) => {
    const gltf = await loader.loadAsync(`./assets/models/${file}`);
    sources.set(name,gltf);
    onProgress?.(++done,files.length);
  }));
}

export function makeModel(name, {height=1.65,width,depth,rotation=0}={}) {
  const source=sources.get(name);
  if (!source) throw new Error(`Missing model: ${name}`);
  const visual=clone(source.scene);
  visual.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}});
  visual.updateMatrixWorld(true);
  const bounds=new THREE.Box3().setFromObject(visual),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  const wrapper=new THREE.Group(),pivot=new THREE.Group();wrapper.add(pivot);pivot.add(visual);
  const scale=height/size.y;
  // Preserve character anatomy and skeleton proportions from every camera angle.
  // Only static props may be fitted independently to room dimensions.
  const character=species.includes(name)||['fox','raccoon','bear'].includes(name);
  if(character)pivot.scale.setScalar(scale);
  else pivot.scale.set(width?width/size.x:scale,scale,depth?depth/size.z:scale);
  visual.position.sub(new THREE.Vector3(center.x,bounds.min.y,center.z));
  wrapper.rotation.y=rotation;
  const restLegs=[];visual.traverse(o=>{if(o.isBone&&/leg|foot|toe|hips/i.test(o.name))restLegs.push({bone:o,q:o.quaternion.clone(),p:o.position.clone()})});
  const mixer=new THREE.AnimationMixer(visual);
  let walk=null;
  if(source.animations.length){
    const clip=(source.animations.find(c=>/walk/i.test(c.name))||source.animations[0]).clone();
    // Route code owns horizontal travel. Keep the authored gait/vertical hip motion.
    for(const track of clip.tracks){
      if(/\.position$/.test(track.name) && /hips|pelvis|root|armature/i.test(track.name)) {
        for(let i=3;i<track.values.length;i+=3){track.values[i]=track.values[0];track.values[i+2]=track.values[2];}
      }
    }
    walk=mixer.clipAction(clip);walk.play();walk.paused=true;mixer.update(0);
  }
  let gaitSpeed=0,idleBlend=1;
  return {root:wrapper,visual,mixer,walk,height,update(dt,moving,speed=1){
    if(!walk)return;
    gaitSpeed=THREE.MathUtils.damp(gaitSpeed,moving?speed:0,12,dt);
    idleBlend=THREE.MathUtils.damp(idleBlend,moving?0:1,12,dt);
    walk.paused=false;walk.timeScale=gaitSpeed;mixer.update(dt);
    for(const {bone,q,p}of restLegs){bone.quaternion.slerp(q,idleBlend);bone.position.lerp(p,idleBlend);}
    if(!moving&&gaitSpeed<.025){walk.paused=true;}
  }};
}

