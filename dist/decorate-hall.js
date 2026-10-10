export function decorateHall(T,room,{box,ball,cylinder,textPlane}){
 // Inlaid timber border, warm skirting and a calmer sage wall band.
 for(const x of [-8.65,8.65]){box(room,'#6c8063',x,.115,.35,.16,.025,12.6);box(room,'#cab27e',x+(x<0?.14:-.14),.115,.35,.055,.025,12.6)}
 for(const z of [-5.85,6.55]){box(room,'#6c8063',0,.115,z,17.3,.025,.16);box(room,'#cab27e',0,.115,z+(z<0?.14:-.14),17.3,.025,.055)}
 box(room,'#a6b295',0,3.88,-5.94,17.4,1.78,.04);box(room,'#d3bd90',0,3.0,-5.89,17.4,.085,.07);box(room,'#7d6445',0,1.0,-5.81,17.4,.095,.08);
 for(const x of [-8.3,-6.15,6.15,8.3])for(let n=0;n<10;n++){const leaf=ball(room,n%2?'#718b58':'#8ca371',x+Math.sin(n*.85)*.13,4.78-n*.14,-5.68,.11,.19,.045);leaf.rotation.z=Math.sin(n)*.8;}
 const c=new T.Group();c.position.set(0,4.23,-5.64);const face=cylinder(c,'#eddcba',0,0,.03,.40,.05);face.rotation.x=Math.PI/2;const edge=new T.Mesh(new T.TorusGeometry(.42,.035,8,48),new T.MeshStandardMaterial({color:'#a97d44',roughness:.6}));c.add(edge);for(let i=0;i<12;i++){const a=i*Math.PI/6;ball(c,'#577451',Math.sin(a)*.32,Math.cos(a)*.32,.065,.019)}box(c,'#56704d',.07,.03,.08,.15,.025,.02);const hand=box(c,'#56704d',-.035,.10,.08,.025,.23,.02);hand.rotation.z=.35;room.add(c);
 // Small ornaments stay outside visitor routes.
 for(const x of [-7.0,7.0]){cylinder(room,'#c59669',x,.29,3.45,.21,.48);for(let i=0;i<7;i++){const a=i*2.4;ball(room,i%2?'#708b55':'#95ac77',x+Math.cos(a)*.15,.64+i*.035,3.45+Math.sin(a)*.13,.12,.20,.07)}}
}

