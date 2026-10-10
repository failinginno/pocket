import {createShopMusic} from './shop-music.js';
export function createClerkDialogue(host,T,lanes){
 const bubbles=lanes.map((x,i)=>{const el=document.createElement('div');el.className='clerk-bubble';el.hidden=true;el.setAttribute('role','status');el.setAttribute('aria-live','polite');host.append(el);return {el,until:0,anchor:new T.Vector3(x,3.65,-3.3)}});
 let sound=false,lastVoice=-Infinity;const last=lanes.map(()=>-Infinity);const synth=window.speechSynthesis;const music=createShopMusic();
 function say(lane,text,{priority=false}={}){const now=performance.now(),b=bubbles[lane];if(!b||document.hidden||(!priority&&now-last[lane]<6000))return false;bubbles.forEach(other=>{if(other!==b){other.until=0;other.el.hidden=true}});last[lane]=now;b.el.textContent=text;b.el.hidden=false;b.until=now+5200;
 if(text.includes("欢迎")&&sound&&synth&&!synth.speaking&&now-lastVoice>18000&&typeof SpeechSynthesisUtterance!=='undefined'){const u=new SpeechSynthesisUtterance(window.PocketI18n?.lang==="en"?"Welcome!":"欢迎光临");u.lang=window.PocketI18n?.lang==="en"?"en-US":"zh-CN";u.rate=1.02;u.pitch=[1.05,.90,1.12][lane];const voices=synth.getVoices();u.voice=voices.find(v=>v.localService&&v.lang.startsWith(u.lang.slice(0,2)))||voices.find(v=>v.lang.startsWith(u.lang.slice(0,2)))||null;lastVoice=now;synth.speak(u)}return true;}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)synth?.cancel()});window.addEventListener('pagehide',()=>synth?.cancel());
 return {say,setSound(value){sound=!!value;music.set(sound);if(!sound)synth?.cancel()},update(camera){const now=performance.now();for(const b of bubbles){if(now>b.until){b.el.hidden=true;continue}const p=b.anchor.clone().project(camera);b.el.hidden=p.z>1||p.z< -1;const width=host.clientWidth,height=host.clientHeight;b.el.style.left=Math.max(85,Math.min(width-85,(p.x*.5+.5)*width))+'px';b.el.style.top=Math.max(125,Math.min(height-80,(-p.y*.5+.5)*height))+'px';}}};
}

