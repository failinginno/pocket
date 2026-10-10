export const LANES=[-4,0,4];
export const CLERKS=['赤狐 · 阿枫','浣熊 · 木木','小熊 · 蜜朵'];
export function buildHall(T,room,{box,ball,cylinder,textPlane}){
 box(room,'#846342',0,-.24,.4,18,.42,13.2);box(room,'#b49c78',0,0,.4,17.8,.08,13);
 for(let x=0;x<18;x++)for(let z=0;z<13;z++)box(room,['#e1cfac','#ecdcbe','#dcc8a7'][(x*7+z*2)%3],x-8.5,.06,z-5.6,.98,.07,.98);
 box(room,'#e1d2b4',0,2.5,-6.1,18,5,.2);
 for(const x of [-8.9,8.9]){box(room,'#deceb0',x,1.65,-2.1,.2,3.3,8);box(room,'#93714a',x,.55,-2.1,.25,1.1,8)}
 box(room,'#967149',0,.56,-5.95,18,1.1,.14);
 for(const x of [-8.7,-6,6,8.7])box(room,'#937049',x,2.5,-5.9,.18,5,.18);
 box(room,'#94704a',0,4.92,-5.9,18,.20,.3);
 const title=textPlane('POCKET FINDS  ·  奇物鉴定大厅',7.0,.40,'#496847','#f3e6c7',58);title.position.set(0,4.75,-5.70);room.add(title);
 const counterFallbacks=[],shelfFallbacks=[],benchFallbacks=[],lampFallbacks=[];
 for(let lane=0;lane<3;lane++){const x=LANES[lane],desk=new T.Group();room.add(desk);counterFallbacks.push(desk);
 box(desk,'#8d6840',x,.65,-2.7,3.18,1.18,1.05);box(desk,'#b78f58',x,1.3,-2.7,3.48,.20,1.5);box(desk,'#738259',x,.72,-2.15,2.82,.80,.04);box(desk,'#bb9c68',x,.72,-2.10,2.45,.045,.02);
 const label=textPlane(`${lane+1}  ${CLERKS[lane]}`,2.15,.32,'#486747','#f8edcf',85);label.position.set(x,1.22,-1.94);room.add(label);
 const shelf=new T.Group();room.add(shelf);shelfFallbacks.push(shelf);box(shelf,'#947144',x,2.46,-5.76,3.5,2.45,.16);
 for(const y of [1.25,2.45,3.65])box(shelf,'#b78d55',x,y,-5.43,3.55,.14,.75);
 for(const offset of [-1.72,0,1.72])box(shelf,'#a57a46',x+offset,2.45,-5.43,.12,2.4,.75);
 for(let i=0;i<4;i++){const xx=x+(i%2? .85:-.85),yy=i<2?1.55:2.75;ball(shelf,['#88aaa2','#d8aa60','#8ea068','#bd8066'][i],xx,yy,-5.36,.24,.30,.22)}
 for(let n=0;n<18;n++)ball(room,['#7a9470','#bf9865','#839bac'][lane],x,.11,-.3+n*.32,.038,.012,.065);
 const rug=box(room,['#839569','#b0966d','#78918d'][lane],x,.105,4.65,2.45,.025,1.25);
 const t=textPlane(`${lane+1} 号队列`,1.6,.42,['#839569','#b0966d','#78918d'][lane],'#fff0cf',88);t.rotation.x=-Math.PI/2;t.position.set(x,.13,4.65);room.add(t);
 for(const xx of [x-1.15,x+1.15]){cylinder(room,'#a88354',xx,.48,4.0,.065,.88);ball(room,'#c8a56f',xx,.94,4,.11)}
 const lamp=new T.Group();room.add(lamp);lampFallbacks.push(lamp);cylinder(lamp,'#776045',x,4.3,-3.8,.018,1.2);cylinder(lamp,'#c4a269',x,3.69,-3.8,.17,.18,.39);ball(lamp,'#ffe0a0',x,3.57,-3.8,.27,.06,.27);
 }
 for(const side of [-1,1]){const bench=new T.Group();room.add(bench);benchFallbacks.push(bench);const x=side*7.8;box(bench,'#977346',x,.42,1.2,1.0,.18,3.1);box(bench,'#84926b',x,.59,1.2,.9,.18,2.9);box(bench,'#967049',x+side*.45,1.0,1.2,.14,1.0,3.1)}
 for(const x of [-8.1,8.1]){const t=textPlane('收集\n发现\n分享',1.15,2.05,'#ead9b7','#746042',75);t.position.set(x,2.72,-5.74);room.add(t)}
 box(room,'#7c8d5d',0,.11,6.12,3.0,.03,.95);const welcome=textPlane('欢迎来到奇物社',2.6,.40,'#7c8d5d','#ecdbab',90);welcome.rotation.x=-Math.PI/2;welcome.position.set(0,.14,6.12);room.add(welcome);
 return {counterFallbacks,shelfFallbacks,benchFallbacks,lampFallbacks};
}
export function makeClerk(T,scene,{ball,box},kind,x){
 const g=new T.Group();g.position.set(x,.40,-3.65);scene.add(g);const fur=['#c98a53','#92928a','#c4a478'][kind];
 ball(g,fur,0,1.12,0,.50,.61,.35);ball(g,fur,0,1.91,.04,.56,.48,.41);
 for(const sign of [-1,1]){const ear=ball(g,fur,sign*.38,2.30,.02,.16,kind===0?.28:.16,.11);if(kind===0)ear.rotation.z=-sign*.35;ball(g,'#e7c5a2',sign*.38,2.31,.105,.08,.10,.025);if(kind===1)ball(g,'#464e46',sign*.22,1.97,.40,.20,.13,.045);ball(g,'#252b27',sign*.22,1.99,.438,.038,.05,.02);ball(g,'#e6b7a0',sign*.34,1.80,.38,.09,.06,.02)}
 ball(g,'#e9d5b7',0,1.78,.40,.28,.17,.12);ball(g,'#4e4537',0,1.85,.51,.06,.046,.035);box(g,['#617956','#819795','#b88253'][kind],0,1.13,.34,.67,.71,.04);
 const arms=[];for(const side of [-1,1]){const a=new T.Group();a.position.set(side*.46,1.43,.04);ball(a,fur,0,-.25,0,.16,.34,.17);g.add(a);arms.push(a)}return {root:g,arms};
}


