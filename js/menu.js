// ---------- menu principal ----------
const menuBtn=i=>({x:MENU.x+Math.round(mOff[i]),y:MENU.y+i*MENU.gap,w:MENU.w,h:MENU.h});
function menuStep(){
 tick++;subT++;selT++;
 for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.x+=q.vx;q.y+=q.vy;q.vy+=.03;q.vx*=.96;if(--q.l<=0)parts.splice(i,1)}
 for(let i=0;i<MENU.items.length;i++)mOff[i]+=((tsel===i&&tsub==='main'&&!menuConf?8:0)-mOff[i])*.25;
 const up=pressed.ArrowUp||pressed.KeyW,dn=pressed.ArrowDown||pressed.KeyS,lf=pressed.ArrowLeft||pressed.KeyA,rt=pressed.ArrowRight||pressed.KeyD,ok=pressed.Enter||pressed.Space,back=pressed.Escape||pressed.Backspace;
 if(menuConf){const c=menuConf;c.t++;
  if(c.i===0&&c.t>=14){const u=Math.min(1,(c.t-14)/26);irisR=IRIS_R*(1-u*u);irisC=[200,120]}
  if(c.t===7){const b=menuBtn(c.i);burst(b.x+b.w/2,b.y+b.h/2,14,'#9fe8ff',2,22)}
  if(c.t>=c.dur){const i=c.i;menuConf=null;if(i===0){tsub='stages';subT=0;selectedStage=1;irisR=-1;irisIn=null}else{tsub=['','ctrl','cfg'][i];subT=0;csel=0}}
  return}
 const N=MENU.items.length;
 if(tsub==='stages'){stageSelectStep();return}
 if(tsub==='main'){
  if(up||dn){tsel=(tsel+(dn?1:N-1))%N;selT=0;tone(700,900,.05,'square',.07)}
  if(ok){menuConf={i:tsel,t:0,dur:tsel===0?40:20};const b=menuBtn(tsel);burst(b.x+b.w/2,b.y+b.h/2,18,'#ffe27a',2.2,26);tone(520,1040,.2,'sine',.18)}
 }else if(tsub==='cfg'){
  if(up||dn){csel=(csel+(dn?1:2))%3;tone(700,900,.05,'square',.07)}
  if((lf||rt)&&csel<2){const d=rt?1:-1;if(csel===0){AU.vm=Math.max(0,Math.min(10,AU.vm+d));if(music)music.volume=mv()}else{AU.vs=Math.max(0,Math.min(10,AU.vs+d));sfx('coin',.5)}saveCfg()}
  if(back||(ok&&csel===2)){tsub='main';subT=0;tone(500,380,.08,'square',.08)}
 }else if(ok||back){tsub='main';subT=0;tone(500,380,.08,'square',.08)}
}
let menuLast=null,menuLG=null;
const MV=document.getElementById('mv');if(MV){MV.muted=true;MV.defaultMuted=true}
function menuVideo(on){if(!MV)return;if(on){if(MV.paused&&!MV._try){MV._try=1;MV.play().catch(()=>{}).finally(()=>{MV._try=0})}}else if(!MV.paused)MV.pause()}
function menuScene(){
 menuVideo(true);
 if(MV&&MV.readyState>=2&&MV.videoWidth){if(!menuLast){menuLast=document.createElement('canvas');menuLast.width=W;menuLast.height=H;menuLG=menuLast.getContext('2d')}menuLG.drawImage(MV,0,0,MV.videoWidth,MV.videoHeight,0,0,W,H);ctx.drawImage(menuLast,0,0)}
 else if(menuLast)ctx.drawImage(menuLast,0,0)
 else{ctx.drawImage(IM.menu,0,0);ctx.globalCompositeOperation='lighter';const gl=ctx.createRadialGradient(200,112,6,200,112,80);gl.addColorStop(0,'rgba(80,150,255,'+(.16+.07*Math.sin(tick*.05))+')');gl.addColorStop(1,'rgba(80,150,255,0)');ctx.fillStyle=gl;ctx.fillRect(100,30,200,170);ctx.globalCompositeOperation='source-over'}
 const g=ctx.createLinearGradient(0,0,190,0);g.addColorStop(0,'rgba(3,8,22,.62)');g.addColorStop(1,'rgba(3,8,22,0)');ctx.fillStyle=g;ctx.fillRect(0,0,190,H);
 for(let n=0;n<motes.length;n+=2){const m=motes[n],x=((m.x+Math.sin(tick*.01+m.ph)*14)%W+W)%W,y=((m.y-tick*(.1+.05*(m.ph%1)))%H+H)%H;ctx.globalAlpha=.3+.45*Math.sin(tick*.06+m.ph*3);ctx.fillStyle=m.ph>3?'#ffe27a':'#9fe8ff';ctx.fillRect(Math.round(x),Math.round(y),1,1)}ctx.globalAlpha=1;
 ctx.drawImage(IM.title,4,6+Math.round(Math.sin(tick*.04)*1.2));
 for(const q of parts){ctx.globalAlpha=Math.min(1,q.l/q.m*1.5);ctx.fillStyle=q.c;ctx.fillRect(Math.round(q.x),Math.round(q.y),q.s,q.s)}ctx.globalAlpha=1}
function menuHud(bl){
 if(tsub==='stages'){irisR=-1;irisIn=null;drawStageSelect();return}
 if(tsub==='main'){
  
  MENU.items.forEach((label,i)=>{
   const sel=tsel===i,c=menuConf&&menuConf.i===i?menuConf:null,dim=menuConf&&!c?.35:1,b=menuBtn(i);
   const sc=c?1+.12*Math.sin(Math.min(1,c.t/12)*Math.PI):1,cx=b.x+b.w/2,cy=b.y+b.h/2,ww=Math.round(b.w*sc),hh=Math.round(b.h*sc),rx=Math.round(cx-ww/2),ry=Math.round(cy-hh/2);
   ctx.globalAlpha=dim;
   if(sel&&!menuConf){ctx.fillStyle='rgba(255,226,122,'+(.22+.14*Math.sin(tick*.15))+')';ctx.fillRect(rx-2,ry-2,ww+4,hh+4)}
   ctx.fillStyle=sel?'rgba(24,58,104,.93)':'rgba(10,24,48,.82)';ctx.fillRect(rx,ry,ww,hh);
   ctx.fillStyle=sel?'#ffe27a':'#4a78a8';ctx.fillRect(rx+1,ry,ww-2,1);ctx.fillRect(rx+1,ry+hh-1,ww-2,1);ctx.fillRect(rx,ry+1,1,hh-2);ctx.fillRect(rx+ww-1,ry+1,1,hh-2);
   ctx.fillStyle=sel?'rgba(255,255,255,.18)':'rgba(255,255,255,.07)';ctx.fillRect(rx+2,ry+1,ww-4,1);
   if(sel){ctx.save();ctx.beginPath();ctx.rect(rx,ry,ww,hh);ctx.clip();ctx.fillStyle='rgba(255,255,255,.16)';ctx.fillRect(Math.round(rx-12+((tick*1.6)%(ww+30))),ry,6,hh);ctx.restore();
    PIX(['a..','aa.','aaa','aa.','a..'],{a:'#ffe27a'},rx+5+Math.round(Math.sin(tick*.2)*1.5),cy-2)}
   if(c){if(c.t<8){ctx.fillStyle='rgba(255,255,255,'+(.85*(1-c.t/8))+')';ctx.fillRect(rx,ry,ww,hh)}
    const inf=Math.round(c.t*1.3);ctx.fillStyle='rgba(255,226,122,'+Math.max(0,1-c.t/16)+')';ctx.fillRect(rx-inf,ry-inf,ww+inf*2,1);ctx.fillRect(rx-inf,ry+hh+inf-1,ww+inf*2,1);ctx.fillRect(rx-inf,ry-inf,1,hh+inf*2);ctx.fillRect(rx+ww+inf-1,ry-inf,1,hh+inf*2)}
   ctx.globalAlpha=1;tc.globalAlpha=dim;txt(label,rx+(sel?17:12),cy+3.5,c?(c.t<8?'#ffffff':'#ffe27a'):sel?'#ffe27a':'#cfeee6');tc.globalAlpha=1});
  txt('W / S  escolher  ·  ENTER  ok  ·  M  som',12,231,'#a9d9cf');return}
 const a=Math.min(1,subT/8),bx=70,by=28+Math.round((1-a)*10),bw=260,bh=184;
 ctx.globalAlpha=a;ctx.fillStyle='rgba(3,8,22,.5)';ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(8,20,44,.95)';ctx.fillRect(bx,by,bw,bh);
 ctx.fillStyle='#ffe27a';ctx.fillRect(bx+2,by,bw-4,1);ctx.fillRect(bx+2,by+bh-1,bw-4,1);ctx.fillRect(bx,by+2,1,bh-4);ctx.fillRect(bx+bw-1,by+2,1,bh-4);
 ctx.fillStyle='#2a4a7a';ctx.fillRect(bx+3,by+3,bw-6,1);ctx.fillRect(bx+3,by+bh-4,bw-6,1);ctx.fillRect(bx+3,by+3,1,bh-6);ctx.fillRect(bx+bw-4,by+3,1,bh-6);
 ctx.fillStyle='#ffe27a';[[bx,by],[bx+bw-3,by],[bx,by+bh-3],[bx+bw-3,by+bh-3]].forEach(([x,y])=>ctx.fillRect(x,y,3,3));
 tc.globalAlpha=a;
 if(tsub==='ctrl'){txt('CONTROLES',W/2,by+18,'#ffe27a','center');CONTROLS.forEach((s,n)=>txt(s,W/2,by+46+n*14,'#e3f5f1','center'));txt('ESPAÇO ou ESC  voltar',W/2,by+bh-9,'#a9d9cf','center')}
 else{txt('CONFIGURAÇÕES',W/2,by+18,'#ffe27a','center');
  [['Música',AU.vm],['Efeitos',AU.vs]].forEach(([lb,v],i)=>{const y=by+58+i*34,sel=csel===i;
   txt(lb,bx+26,y+3,sel?'#ffe27a':'#cfeee6');if(sel)PIX(['a..','aa.','aaa','aa.','a..'],{a:'#ffe27a'},bx+14+Math.round(Math.sin(tick*.2)*1.5),y-3);
   for(let s=0;s<10;s++){ctx.fillStyle=s<v?(sel?'#ffe27a':'#6aa8ff'):'#1a2c4a';ctx.fillRect(170+s*12,y-6+(sel&&s<v&&((tick>>2)%12===s)?-1:0),10,10)}
   txt(v*10+'%',bx+bw-12,y+3,sel?'#ffe27a':'#cfeee6','right')});
  const vy=by+126,sel=csel===2;ctx.fillStyle=sel?'rgba(24,58,104,.95)':'rgba(10,24,48,.9)';ctx.fillRect(150,vy-10,100,20);ctx.fillStyle=sel?'#ffe27a':'#4a78a8';ctx.fillRect(151,vy-10,98,1);ctx.fillRect(151,vy+9,98,1);ctx.fillRect(150,vy-9,1,18);ctx.fillRect(249,vy-9,1,18);
  txt('Voltar',200,vy+3,sel?'#ffe27a':'#cfeee6','center');
  txt('A / D  ajustar   ·   ESC  voltar',W/2,by+bh-9,'#a9d9cf','center')}
 ctx.globalAlpha=1;tc.globalAlpha=1}
function irisDraw(g,cx,cy,r){g.fillStyle='#000';for(let y=0;y<H;y++){const dy=y+.5-cy;if(r<=0||Math.abs(dy)>=r){g.fillRect(0,y,W,1)}else{const hw=Math.sqrt(r*r-dy*dy),l=Math.round(cx-hw),rr=Math.round(cx+hw);if(l>0)g.fillRect(0,y,l,1);if(rr<W)g.fillRect(rr,y,W-rr,1)}}}
function hud(){if(mode==='title'&&tsub==='stages'){irisR=-1;irisIn=null}hudMain();if(mode!=='title'&&irisR>=0){irisDraw(ctx,irisC[0],irisC[1],irisR);irisDraw(tc,irisC[0],irisC[1],irisR)}}
function hudMain(){
 tc.setTransform(1,0,0,1,0,0);tc.clearRect(0,0,ov.width,ov.height);const k=ov.width/W;tc.setTransform(k,0,0,k,0,0);
 const cn=[...got].filter(i=>i[0]==='c').length,ms=Math.round(time*1000/60),bl=Math.floor(performance.now()/450)%2;
 if(mode==='title'){menuHud(bl);return}
 ctx.drawImage(IM.Coin,6,5);txt(cn+'/'+NC,24,16);hearts();if(cpFx)drawCp(cpFx,k);if(AU.muted)txt('mudo',W/2,16,'#a9d9cf','center');if(got.has('key'))ctx.drawImage(IM.Key,52,5);
 txt('mortes '+deaths,W-6,16,'#e3f5f1','right');txt(fmt(mode==='title'?0:mode==='name'||mode==='board'?finalMs:ms),W-6,28,'#ffe27a','right');
 for(const gt of GATES)if(mode==='play'&&gt.on&&p.x>gt.x-4*T&&Math.abs(p.y-(gt.y+gt.h))<90)txt('Colete todas as moedas ('+[...got].filter(i=>i[0]===gt.id).length+'/'+gt.n+')',W/2,36,'#e9708f','center');
 if(paused){panel(.6);txt('PAUSADO',W/2,H/2,'#ffe27a','center')}
 if(mode==='end'){panel(.78);txt('FASE CONCLUÍDA',W/2,70,'#ffe27a','center');paintStars(W/2,112,runStars,true,tc);txt(runStars+' / 3 ESTRELAS',W/2,146,'#ffe27a','center');txt('Tempo '+fmt(finalMs)+'   ·   Moedas '+cn+'/'+NC+'   ·   Mortes '+deaths,W/2,168,'#e3f5f1','center');if(bl&&endT>30)txt('ESPAÇO  voltar ao menu',W/2,205,'#a9d9cf','center')}
}
