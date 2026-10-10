export function shortWallet(value){
 const raw=String(value||'').replace(/^你\s*·\s*/,'');
 if(/^0x[0-9a-f]{40}$/i.test(raw))return raw.slice(0,6)+'…'+raw.slice(-4);
 // Demo identifiers remain recognizable; never invent a real address.
 const parts=raw.split('…');
 if(parts.length===2)return parts[0].slice(0,6)+'…'+parts[1].slice(-4);
 return raw.length>12?raw.slice(0,6)+'…'+raw.slice(-4):raw||'待识别';
}
const overlaps=(a,b)=>a.x<b.x+b.w+4&&a.x+a.w+4>b.x&&a.y<b.y+b.h+4&&a.y+a.h+4>b.y;
export function placeLabel(anchor,width,height,bounds,obstacles,previous){
 const offsets=[[0,0],[-width*.55,0],[width*.55,0],[0,-height-8],[-width*.55,-height-8],[width*.55,-height-8],[0,-2*(height+8)]];
 if(previous)offsets.unshift(previous);
 for(const offset of offsets){
  const box={x:Math.max(5,Math.min(bounds.w-width-5,anchor.x-width/2+offset[0])),y:anchor.y-height-9+offset[1],w:width,h:height};
  if(box.y<5||box.y+height>bounds.h-5||obstacles.some(b=>overlaps(box,b)))continue;
  return {...box,offset};
 }
 return null; // Crowded views hide a label instead of covering faces or another address.
}
export function createWalletLabels(T,host){
 const point=new T.Vector3();
 return function update(actors,camera){
  const w=host.clientWidth,h=host.clientHeight,origin=host.getBoundingClientRect(),blocked=[];
  host.parentElement.querySelectorAll('.game-top,.station-panel,.clerk-bubble:not([hidden]),.camera-controls,.view-hint,.inspection:not(.hidden)').forEach(el=>{
   const r=el.getBoundingClientRect();if(r.width&&r.height)blocked.push({x:r.left-origin.left,y:r.top-origin.top,w:r.width,h:r.height});
  });
  const entries=[];
  for(const a of actors.values()){
   point.copy(a.root.position).add(new T.Vector3(0,a.height+.12,0)).project(camera);
   if(a.root.position.z>6.3||point.z>1||point.z< -1||Math.abs(point.x)>1||Math.abs(point.y)>1){a.label.style.visibility='hidden';continue;}
   const x=(point.x*.5+.5)*w,y=(-point.y*.5+.5)*h;
   point.copy(a.root.position).project(camera);const foot=(-point.y*.5+.5)*h,bodyHeight=Math.max(16,foot-y);
   blocked.push({x:x-bodyHeight*.24,y:y+5,w:bodyHeight*.48,h:Math.max(8,bodyHeight-5)});
   entries.push({a,x,y});
  }
  entries.sort((a,b)=>Number(b.a.mine)-Number(a.a.mine)||b.y-a.y||a.a.id-b.a.id);
  for(const {a,x,y}of entries){
   const width=a.label.offsetWidth,height=a.label.offsetHeight;
   const box=placeLabel({x,y},width,height,{w,h},blocked,a.labelOffset);
   a.label.style.visibility=box?'visible':'hidden';
   if(!box)continue;
   a.labelOffset=box.offset;blocked.push(box);a.label.style.transform=`translate(${Math.round(box.x)}px,${Math.round(box.y)}px)`;
  }
 };
}
