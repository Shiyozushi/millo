// ---------- desenho ----------
const TS=(sx,sy,w,h,x,y)=>ctx.drawImage(IM.Tileset,sx,sy,w,h,Math.round(x),Math.round(y),w,h);
function background(cx){
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1b4152');g.addColorStop(.5,'#3fa0a4');g.addColorStop(1,'#a6dcd2');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='rgba(227,245,241,.1)';
 for(let i=0;i<5;i++){const b=((i*97-cx*.1+tick*.04)%520+520)%520-80;ctx.beginPath();ctx.moveTo(b,0);ctx.lineTo(b+32,0);ctx.lineTo(b+120,H);ctx.lineTo(b+64,H);ctx.fill()}
 [[.15,'#3b8f98',70,12],[.3,'#2a6b7b',110,18],[.5,'#1c4a5d',170,26]].forEach(([f,c,sp,w],k)=>{ctx.fillStyle=c;const o=cx*f;for(let i=Math.floor(o/sp)-1;i*sp-o<W+40;i++)ctx.fillRect(Math.round(i*sp-o+hs(i,k)*30),0,Math.round(w*(.8+hs(i,5+k)*.5)),H)});
 const t=ctx.createLinearGradient(0,0,0,80);t.addColorStop(0,'rgba(12,35,48,.85)');t.addColorStop(1,'rgba(12,35,48,0)');ctx.fillStyle=t;ctx.fillRect(0,0,W,80);
}
function drawTiles(cx,cy){
 const i0=Math.max(0,Math.floor(cx/T)),i1=Math.min(LW-1,Math.floor((cx+W)/T)),j0=Math.max(0,Math.floor(cy/T)),j1=Math.min(LH-1,Math.floor((cy+H)/T));
 for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){if(!grid[j][i]||grid[j][i]===2)continue;const x=i*T,y=j*T,up=j>0&&grid[j-1][i];
  if(!up){TS(112,128,16,16,x,y)}else{ctx.fillStyle='#1f394d';ctx.fillRect(x,y,T,T);const h=hs(i,j);ctx.fillStyle='#285066';if(h<.5)ctx.fillRect(x+Math.floor(h*24),y+Math.floor(h*20)+2,3,2);ctx.fillStyle='#173044';if(h>.7)ctx.fillRect(x+Math.floor(h*10),y+8,4,2)}
  ctx.fillStyle='#3f8a6e';if(i>0&&!grid[j][i-1])ctx.fillRect(x,y,1,T);if(i<LW-1&&!grid[j][i+1])ctx.fillRect(x+T-1,y,1,T);}
}
function dirtAt(x,y,i,j){ctx.fillStyle='#1f394d';ctx.fillRect(x,y,T,T);const h=hs(i,j);ctx.fillStyle='#285066';if(h<.5)ctx.fillRect(x+Math.floor(h*24),y+Math.floor(h*20)+2,3,2);ctx.fillStyle='#173044';if(h>.7)ctx.fillRect(x+Math.floor(h*10),y+8,4,2)}
function drawPlat(s){TS(16,16,48,12,s.x,s.y);TS(16,60,48,4,s.x,s.y+12)}
function spikeBox(s){return s.d==='L'?{x:s.x+6,y:s.y+3,w:10,h:10}:s.d==='R'?{x:s.x,y:s.y+3,w:10,h:10}:s.d==='D'?{x:s.x+3,y:s.y,w:10,h:8}:{x:s.x+3,y:s.y+8,w:10,h:8}}
function spikeAt(x,y,d){
 const poly=(pts,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let q=2;q<pts.length;q+=2)ctx.lineTo(pts[q],pts[q+1]);ctx.fill()};
 for(let k=0;k<2;k++){const o=k*8;
  if(d==='L'){poly([x+16,y+o,x+6,y+o+4,x+16,y+o+8],'#7a2f4d');poly([x+16,y+o+2,x+6,y+o+4,x+16,y+o+4],'#e9708f')}
  else if(d==='R'){poly([x,y+o,x+10,y+o+4,x,y+o+8],'#7a2f4d');poly([x,y+o+2,x+10,y+o+4,x,y+o+4],'#e9708f')}
  else if(d==='D'){poly([x+o,y,x+o+4,y+10,x+o+8,y],'#7a2f4d');poly([x+o+2,y,x+o+4,y+10,x+o+4,y],'#e9708f')}
  else{poly([x+o,y+16,x+o+4,y+6,x+o+8,y+16],'#7a2f4d');poly([x+o+2,y+16,x+o+4,y+6,x+o+4,y+16],'#e9708f')}}}
const diry_=()=>(kD()?1:0)-(kU()?1:0);
function pose(){const f=p.face,s=f>0?'east':'west';
 if(grab)return['cl'+(((Math.floor(p.climbT||0)%8)+8)%8),gside<0,0];
 if(atkT>0&&!dashT)return['south-'+s,0];
 if(dashT)return['run2',f<0];
 if(!ground)return p.vy<-.3?['north-'+s,0]:p.vy>1?['south-'+s,0]:['run1',f<0];
 return(Math.abs(p.vx)>.3||p.dirx)?['run'+(Math.floor(p.runT)%8),f<0]:['idle'+(Math.floor(tick/9)%8),0]}
function drawPlayer(){if(dead)return;if(inv>0&&Math.floor(inv/4)%2)return;const[n,fl,oy=0]=pose(),a=AN[n];
 ctx.save();ctx.translate(Math.round(p.x+p.w/2),Math.round(p.y+p.h+1+oy));
 ctx.scale(p.sx*(dashT?1.25:1)*(fl?-1:1),p.sy*(dashT?.8:1));if(grab)ctx.translate(gside*-2,0);
 ctx.drawImage(IM[n],-a[0],-a[1]);ctx.restore()}
function draw(){
 if(mode==='title'){menuScene();hud();return}
 menuVideo(false);
 const sk=shake?(Math.random()-.5)*shake*.6:0,cx=Math.round(cam.x+sk),cy=Math.round(cam.y+sk);
 background(cx);
 ctx.save();ctx.translate(-cx,-cy);
 if(bkC)ctx.drawImage(bkC,0,0);
 for(const d of decos){const r=DEC[d.n];TS(r[0],r[1],r[2],r[3],d.x-r[2]/2,d.y-r[3]+2)}
 drawTiles(cx,cy);for(const f of frames){TS(80,16,48,48,f.x,f.y);for(let q=f.g?1:0;q<3;q++)dirtAt(f.x+T,f.y+q*T,f.x/T+1,f.y/T+q);if(f.g)for(let q=0;q<3;q++)TS(112,128,16,16,f.x+q*T,f.y)}
 for(const s of statics){if(s.k==='plat')drawPlat(s);else ctx.drawImage(IM[s.k],s.x,s.y)}
 for(const m of movers)drawPlat(m);
 for(const c of crumbles){
  if(c.s<2){const o=c.s===1?((tick>>1)%2?1:-1):0;for(let i=0;i<3;i++)ctx.drawImage(IM.Box,c.x+i*16+o,c.y)}
  else{const a=.3+.25*Math.sin(tick*.2)+(c.t>240?.35:0);ctx.fillStyle='rgba(255,255,255,'+Math.min(.9,a)+')';
   for(let x=0;x<48;x+=7){ctx.fillRect(c.x+x,c.y,4,1);ctx.fillRect(c.x+x,c.y+15,4,1)}for(let y=0;y<16;y+=5){ctx.fillRect(c.x,c.y+y,1,3);ctx.fillRect(c.x+47,c.y+y,1,3)}}}
 for(const s of spikes)spikeAt(s.x,s.y,s.d);
 for(const c of cps){const on=spawn.x===c.x+8;ctx.globalAlpha=on?1:.55;TS(145,48,16,17,c.x,c.y);ctx.globalAlpha=1;if(on){ctx.fillStyle='rgba(255,179,107,.25)';ctx.beginPath();ctx.arc(c.x+8,c.y+8,10+Math.sin(tick*.1)*2,0,6.28);ctx.fill()}}
 for(const it of items)if(!got.has(it.id)){const yy=Math.round(it.y+Math.sin(tick*.06+it.x)*2);
  if(it.w){const up=(tick>>3)%2,wl=up?['.....a','...aaa','.aaaa.','aaa...']:['aaa...','.aaaa.','...aaa','.....a'],wr=wl.map(s=>[...s].reverse().join(''));PIX(wl,{a:'#f4f8ff'},it.x-6,yy+3);PIX(wr,{a:'#f4f8ff'},it.x+16,yy+3)}
  ctx.drawImage(IM[it.k],it.x,yy)}
 ctx.drawImage(IM.Chest,CHEST.x,CHEST.y);for(const o of orbs)drawOrb(o);
 for(const gt of GATES){const y0=gt.y+gt.h,g=ctx.createLinearGradient(0,y0,0,y0+64),gc=gt.on?'233,112,143':'255,226,122';g.addColorStop(0,'rgba('+gc+',.5)');g.addColorStop(1,'rgba('+gc+',0)');ctx.globalAlpha=.7+.3*Math.sin(tick*.08);ctx.fillStyle=g;ctx.fillRect(gt.x,y0,gt.w,64);ctx.globalAlpha=1;if(gt.on){ctx.fillStyle='rgba(233,112,143,'+(.55+.3*Math.sin(tick*.25))+')';ctx.fillRect(gt.x,y0,gt.w,3)}PIX(['..a..','.aaa.','aaaaa','..a..','..a..'],{a:gt.on?'#e9708f':'#ffe27a'},gt.x+2*gt.w/4*1+4-0,y0+22+Math.round(Math.sin(tick*.1)*2))}
 for(const q of trail){ctx.globalAlpha=q.l/24;ctx.save();ctx.translate(Math.round(q.x),Math.round(q.y+1));ctx.scale(q.f<0?-1:1,1);ctx.drawImage(IM.run2,-AN.run2[0],-AN.run2[1]);ctx.restore();ctx.globalAlpha=1}
 drawPlayer();drawCombat();
 for(const q of parts){ctx.globalAlpha=Math.min(1,q.l/q.m*1.5);ctx.fillStyle=q.c;ctx.fillRect(Math.round(q.x),Math.round(q.y),q.s,q.s)}ctx.globalAlpha=1;
 for(const m of motes){const x=((m.x+Math.sin(tick*.01+m.ph)*20-cx*.6)%W+W)%W+cx,y=((m.y+Math.cos(tick*.013+m.ph)*14-cy*.6)%H+H)%H+cy;ctx.globalAlpha=.4+.4*Math.sin(tick*.05+m.ph);ctx.fillStyle='#e9f7a8';ctx.fillRect(Math.round(x),Math.round(y),1,1)}ctx.globalAlpha=1;
 ctx.restore();
 hud();
}
function txt(s,x,y,c='#e3f5f1',al='left'){tc.font='700 9px "Pixelify Sans",monospace';tc.textAlign=al;tc.fillStyle='#0b1820';tc.fillText(s,x+1,y+1);tc.fillStyle=c;tc.fillText(s,x,y)}
function panel(a){ctx.fillStyle='rgba(8,22,30,'+a+')';ctx.fillRect(0,0,W,H)}
function drawCp(e,k){
 const s='CHECKPOINT',n=s.length,cxm=Math.round(cam.x),cym=Math.round(cam.y);
 const bx=p.x+p.w/2-p.face*5,by=p.y+7,tx=p.x+p.w/2,ty=p.y-20;   // acompanha o personagem
 tc.save();tc.font='700 11px "Pixelify Sans",monospace';tc.textAlign='center';tc.textBaseline='middle';
 const ws=[...s].map(c=>tc.measureText(c).width+1),tot=ws.reduce((a,b)=>a+b,0);let off=-tot/2;
 if(e.t<14){tc.fillStyle='rgba(255,226,122,'+(.55*(1-e.t/14))+')';tc.beginPath();tc.arc(bx-cxm,by-cym,3+e.t*.7,0,6.28);tc.fill()}
 for(let i=0;i<n;i++){const lx=off+ws[i]/2;off+=ws[i];const lt=e.t-i*2;if(lt<0)continue;
  const u=Math.min(1,lt/18),c1=1.70158,eb=1+(c1+1)*Math.pow(u-1,3)+c1*Math.pow(u-1,2);
  const px=bx+(tx+lx-bx)*eb,py=by+(ty-by)*eb-Math.sin(u*Math.PI)*10;
  const wave=e.t>30?Math.sin(e.t*.22+i*.7)*1.3:0,fade=e.t>62?Math.max(0,1-(e.t-62)/30):1,rise=e.t>62?-(e.t-62)*.2:0;
  const sc=.3+.85*Math.min(1,u*1.2)+(lt>=18?Math.sin(Math.min(1,(lt-18)/10)*Math.PI)*.18:0);
  tc.save();tc.globalAlpha=Math.min(1,u*2.5)*fade;tc.translate(px-cxm,py+wave+rise-cym);tc.scale(sc,sc);tc.rotate((1-u)*(i%2?.6:-.6));
  tc.shadowColor='rgba(255,200,90,.9)';tc.shadowBlur=5*k*(u<1?1:.8);
  tc.fillStyle='#2a1a10';tc.fillText(s[i],1,1.3);tc.fillStyle=i%2?'#ffe27a':'#fff4c2';tc.fillText(s[i],0,0);tc.restore()}
 tc.restore()}
