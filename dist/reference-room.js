export function buildReferenceRoom(T,room,{box,ball,cylinder,mesh,textPlane,material}){
 box(room,'#8d6844',0,-.22,0,11.8,.4,9.6);box(room,'#b69c76',0,0,0,11.65,.08,9.45);
 for(let x=0;x<12;x++)for(let z=0;z<10;z++){
  const tile=box(room,['#dfcba8','#e7d4b1','#d8c39f','#e9d7b7'][(x*7+z*3)%4],-5.29+x*.96,.056,-4.21+z*.935,.942,.07,.917);
  tile.material.roughness=1;
 }
 box(room,'#d5c4a1',0,2.05,-4.5,11.65,4.1,.2);
 for(const x of [-5.7,5.7]){box(room,'#dfceaf',x,1.65,-1.85,.18,3.3,5.4);box(room,'#9e7950',x,.50,-1.85,.24,1,5.4);box(room,'#73583b',x,1.05,-1.85,.28,.10,5.4);}
 box(room,'#967049',0,.48,-4.34,11.6,.96,.14);
 for(const x of [-5.5,-3.6,3.6,5.5])box(room,'#805d39',x,2.04,-4.24,.18,4.08,.22);
 box(room,'#a17a4d',0,4.03,-4.26,11.8,.18,.28);
 // Long horizontal curiosity shelf, as in the approved reference.
 box(room,'#805f3c',-.4,2.95,-4.11,7.65,1.66,.22);
 for(const y of [2.13,3.79])box(room,'#a47a46',-.4,y,-3.87,7.88,.17,.64);
 for(let x=-4.15;x<3.6;x+=1.28)box(room,'#a47a46',x,2.97,-3.90,.10,1.56,.58);
 function pot(x,y,z,r=.22){cylinder(room,'#ae774e',x,y+r,z,r,r*1.55,r*.75);for(let k=0;k<6;k++){const a=k*2.4;const leaf=ball(room,k%2?'#799052':'#547544',x+Math.cos(a)*r*.6,y+r*2.6+(k%2)*.08,z+Math.sin(a)*r*.5,r*.45,r*.8,r*.3);leaf.rotation.z=Math.cos(a)*.6;}}
 function jar(x){cylinder(room,'#91b5b6',x,2.62,-3.63,.27,.63,.24);cylinder(room,'#648d92',x,2.97,-3.63,.24,.10);ball(room,'#f7d785',x,2.61,-3.39,.14,.21,.035);}
 jar(-3.50);mesh(room,new T.OctahedronGeometry(.28),'#8cadd0',-2.18,2.64,-3.61,1,1.7,1);
 const fossil=cylinder(room,'#ccb78e',-.93,2.62,-3.61,.34,.12);fossil.rotation.x=Math.PI/2;
 const spiral=new T.CatmullRomCurve3(Array.from({length:70},(_,i)=>{const a=i/69*Math.PI*4.8,r=.025+i/69*.27;return new T.Vector3(-.93+Math.cos(a)*r,2.62+Math.sin(a)*r,-3.535)}));mesh(room,new T.TubeGeometry(spiral,70,.025,6,false),'#9e8764',0,0,0);
 pot(.34,2.23,-3.64,.20);cylinder(room,'#e7d1a4',1.63,2.50,-3.64,.12,.48);ball(room,'#b85d42',1.63,2.77,-3.64,.35,.20,.30);for(const x of [1.48,1.70])ball(room,'#efdab8',x,2.92,-3.55,.055);
 cylinder(room,'#8e643a',2.88,2.53,-3.65,.19,.52);ball(room,'#ffe69b',2.88,2.55,-3.46,.115,.18,.025);
 // Clock on upper right wall.
 const clock=cylinder(room,'#876141',4.65,3.04,-4.13,.58,.16);clock.rotation.x=Math.PI/2;const dial=cylinder(room,'#eee1bf',4.65,3.04,-4.02,.49,.03);dial.rotation.x=Math.PI/2;
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2;ball(room,'#765739',4.65+Math.sin(a)*.40,3.04+Math.cos(a)*.40,-3.99,.028)}
 const hand=box(room,'#536b43',4.72,3.13,-3.96,.06,.31,.025);hand.rotation.z=-.65;box(room,'#536b43',4.52,3.03,-3.95,.26,.045,.025);
 // Hanging banners face the camera and frame the counter.
 function banner(x,lines){box(room,'#86613e',x,2.34,-3.72,1.02,1.91,.08);box(room,'#e6d3ad',x,2.34,-3.65,.87,1.72,.025);for(let i=0;i<lines.length;i++){const t=textPlane(lines[i],.76,.20,'#e6d3ad','#725d3f',76);t.position.set(x,2.85-i*.32,-3.625);room.add(t)}for(const y of [1.38,3.30])box(room,'#936d41',x,y,-3.59,1.10,.09,.12);}
 banner(-4.86,['奇物让','平凡的日子','发光']);banner(5.00,['收集','发现','分享','生活的小奇迹']);
 // Left arched window and long green waiting bench.
 const window=new T.Group();window.position.set(-5.51,1.55,.05);window.rotation.y=Math.PI/2;
 box(window,'#987043',0,.5,0,1.40,2.48,.10);box(window,'#afd4cf',0,.5,.065,1.18,2.24,.04);ball(window,'#dce9cf',0,1.08,.10,.52,.33,.015);box(window,'#967247',0,.5,.11,.065,2.25,.07);room.add(window);
 box(room,'#906b42',-4.9,.40,.65,.88,.16,2.8);box(room,'#7d905e',-4.85,.56,.65,.78,.18,2.62);box(room,'#8b693f',-5.28,.93,.65,.14,.95,2.9);box(room,'#899964',-5.18,1.02,.65,.12,.49,2.65);
 for(const z of [-.53,1.83]){box(room,'#7b5b37',-5.10,.20,z,.12,.40,.15);box(room,'#7b5b37',-4.53,.20,z,.12,.40,.15);box(room,'#a5804c',-4.87,.83,z,1.02,.14,.13)}
 // Plain timber counter with legs and a cloth hanging over its front edge.
 box(room,'#84603b',-.28,.69,-2.00,6.84,1.06,.91);for(let i=0;i<10;i++)box(room,i%2?'#9d774a':'#a47e50',-3.37+i*.687,.72,-1.525,.675,.78,.045);
 box(room,'#b68c54',-.28,1.28,-2.00,7.23,.17,1.42);for(const z of [-2.49,-2.10,-1.70])box(room,'#987245',-.28,1.371,z,7.17,.012,.018);
 for(const x of [-3.46,2.91])box(room,'#795935',x,.61,-1.69,.25,1.22,.31);
 box(room,'#87915b',-2.65,1.379,-1.90,.80,.012,.93);box(room,'#87915b',-2.65,1.05,-1.277,.80,.65,.015);box(room,'#c2bc82',-2.65,.75,-1.26,.77,.045,.018);
 cylinder(room,'#585f56',-3.00,1.45,-1.91,.16,.10);ball(room,'#abb8aa',-3,1.52,-1.91,.14,.12,.14);
 const sign=textPlane('POCKET FINDS',1.08,.60,'#ead8af','#6f583a',69);sign.position.set(-2.18,1.75,-1.97);room.add(sign);box(room,'#88643c',-2.18,1.74,-2.01,1.17,.70,.06);
 pot(2.55,1.38,-2.03,.15);
 // Three separate rugs leave the tiled queue lane visible.
 function rug(x,z,w,d,color,text){box(room,'#b39b6c',x,.102,z,w,.025,d);box(room,color,x,.117,z,w-.12,.015,d-.12);const t=textPlane(text,w*.8,d*.23,color,'#d8c598',76);t.rotation.x=-Math.PI/2;t.position.set(x,.13,z);room.add(t)}
 rug(-4.27,3.08,1.85,2.12,'#b38e63','小小奇物 · 大大快乐');rug(4.15,3.19,1.88,1.98,'#687c50','Good Finds');rug(-.55,4.06,2.40,.93,'#82905a','欢迎光临');
 for(let i=0;i<16;i++){const z=-.37+i*.26;ball(room,'#b49d76',.58,.105,z,.034,.009,.055)}
 for(const x of [-2.04,.98]){box(room,'#926b40',x,.50,4.56,.24,1,.25);ball(room,'#b18a56',x,1.02,4.56,.13,.09,.14)}
 // Right drawers and the small floor sign from the reference.
 box(room,'#a17b4c',4.35,.79,-2.45,1.30,1.42,.85);for(let y=.37;y<1.4;y+=.37){box(room,'#b28c5a',4.35,y,-1.99,1.16,.29,.03);ball(room,'#6f5a3b',4.35,y,-1.95,.04)}
 const board=new T.Group();board.position.set(4.54,.78,1.62);board.rotation.x=-.12;box(board,'#805c36',0,0,0,1.03,1.25,.10);const msg=textPlane('好奇 · 总会相遇',.90,1.08,'#dac599','#725a38',66);msg.position.z=.065;board.add(msg);room.add(board);
 // Vine tendrils add organic detail without using image planes.
 for(const x of [-5.32,-3.85,3.40,5.25])for(let i=0;i<8;i++){const xx=x+Math.sin(i*.8)*.12,y=3.8-i*.16;const leaf=ball(room,i%2?'#738448':'#526a3a',xx,y,-3.99,.12,.18,.055);leaf.rotation.z=(i%2?1:-1)*.5;}
}
