// ---------- combate ----------
const tone=(f0,f1,d,type='square',v=.12)=>{if(!actx||AU.muted)return;const o=actx.createOscillator(),g=actx.createGain(),t=actx.currentTime;o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+d);g.gain.setValueAtTime(Math.max(.0001,v*AU.vs/5),t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(actx.destination);o.start(t);o.stop(t+d)};
function spawnEnemies(){ens.length=0;CROWS.forEach(c=>{if(!ekill.has(c[0]))ens.push({id:c[0],hx:c[1],hy:c[2],x:c[1],y:c[2],hp:3,t:c[0]*37,state:'idle',st:0,cd:50,face:-1,hurt:0})})}
const solidPx=(x,y)=>{const i=Math.floor(x/T),j=Math.floor(y/T);if(i<0||i>=LW)return true;if(j>=0&&j<LH&&grid[j][i])return true;for(const s of statics)if(x>=s.x&&x<s.x+s.w&&y>=s.y&&y<s.y+s.h)return true;for(const s of movers)if(x>=s.x&&x<s.x+s.w&&y>=s.y&&y<s.y+s.h)return true;return false};
function hurt(fx){if(inv>0||dead)return;hp--;tone(240,70,.28,'square',.18);if(hp<=0){die();return}inv=90;stun=14;dashT=0;grab=false;jumping=false;p.vx=(p.x+p.w/2<fx?-1:1)*2.4;p.vy=-2.6;shake=6;burst(p.x+p.w/2,p.y+p.h/2,16,'#e9708f',2,22)}
const ebox=e=>({x:e.x-8,y:e.y-34,w:16,h:34});
function combat(dirx,diry){
 if(atkCd>0)atkCd--;if(atkT>0)atkT--;if(inv>0)inv--;
 if((pressed.KeyX||pressed.KeyK)&&atkCd<=0&&!grab){let ax=dirx,ay=diry;if(!ax&&!ay)ax=p.face;const n=Math.hypot(ax,ay);if(dirx)p.face=dirx;
  bolts.push({x:p.x+p.w/2+ax/n*9,y:p.y+5+ay/n*5,vx:ax/n*3.8,vy:ay/n*3.8,l:55,t:0});atkCd=22;atkT=12;tone(420,1100,.16,'sine',.22);burst(p.x+p.w/2+ax/n*8,p.y+5,8,'#4cc9ff',1.4,14)}
 for(let i=bolts.length-1;i>=0;i--){const b=bolts[i];let gone=false;
  for(let s=0;s<2&&!gone;s++){b.x+=b.vx/2;b.y+=b.vy/2;
   if(solidPx(b.x,b.y)){gone=true;burst(b.x,b.y,8,'#4cc9ff',1.2,12);break}
   for(const e of ens)if(!ekill.has(e.id)&&overl({x:b.x-3,y:b.y-3,w:6,h:6},ebox(e))){e.hp--;e.hurt=10;gone=true;burst(b.x,b.y,10,'#4cc9ff',1.6,14);tone(200,120,.1,'square',.14);
    if(e.hp<=0){ekill.add(e.id);burst(e.x,e.y,28,'#2d3153',2.4,34);burst(e.x,e.y,14,'#6a77b0',2,30);tone(300,40,.4,'sawtooth',.16)}break}
   if(!gone)for(let k=torn.length-1;k>=0;k--){const q=torn[k];if(Math.abs(b.x-q.x)<8&&Math.abs(b.y-q.y)<10){torn.splice(k,1);gone=true;burst(q.x,q.y,12,'#cfeee6',1.6,16);break}}}
  b.t++;if(gone||--b.l<=0)bolts.splice(i,1);else if(tick%2==0)parts.push({x:b.x,y:b.y,vx:0,vy:0,l:10,m:10,c:'#4cc9ff',s:1})}
 const px=p.x+p.w/2,py=p.y+p.h/2;
 for(const e of ens){if(ekill.has(e.id))continue;e.t++;if(e.hurt>0)e.hurt--;
  const dx=px-e.x,dy=py-e.y,d=Math.hypot(dx,dy);e.face=dx>=0?1:-1;
  if(e.state==='idle'){if(e.cd>0)e.cd--;else if(d<200&&Math.abs(dy)<120){e.state='wind';e.st=0}}
  else if(e.state==='wind'){if(e.st%3==0)parts.push({x:e.x+e.face*(e.st<18?9:7),y:e.y-(e.st<18?42:46)+Math.random()*3,vx:(Math.random()-.5)*.5,vy:-.3,l:16,m:16,c:Math.random()<.5?'#cfeee6':'#8fd8cf',s:1});
   if(++e.st===36){const sx=e.x+e.face*27,sy=e.y-36,a=Math.atan2(py-sy,px-sx);torn.push({x:sx,y:sy,vx:Math.cos(a)*1.5,vy:Math.sin(a)*1.5,l:170,t:0});tone(160,320,.3,'sawtooth',.1);burst(sx,sy,10,'#cfeee6',1.6,16);e.state='rec';e.st=0}}
  else if(++e.st>18){e.state='idle';e.cd=100}
  if(overl({x:p.x,y:p.y,w:p.w,h:p.h},ebox(e)))hurt(e.x)}
 for(let i=torn.length-1;i>=0;i--){const q=torn[i];q.x+=q.vx;q.y+=q.vy;q.t++;
  if(--q.l<=0||solidPx(q.x,q.y)){torn.splice(i,1);burst(q.x,q.y,8,'#cfeee6',1,14);continue}
  if(overl({x:p.x,y:p.y,w:p.w,h:p.h},{x:q.x-5,y:q.y-8,w:10,h:16})){hurt(q.x);torn.splice(i,1)}}
}
const PIX=(pat,pal,x,y)=>{pat.forEach((r,j)=>{for(let i=0;i<r.length;i++){const c=pal[r[i]];if(c){ctx.fillStyle=c;ctx.fillRect(Math.round(x)+i,Math.round(y)+j,1,1)}}})};
const ORB=['..aaa..','.abbba.','abcccba','abcccba','abcccba','.abbba.','..aaa..'],ORBP={a:'#2a7fff',b:'#4cc9ff',c:'#e8fbff'},HRT=['.aa.aa.','aaaaaaa','aaaaaaa','.aaaaa.','..aaa..','...a...'];
const OB=['..aaaaa..','.abbbbba.','abbcccbba','abcccccba','abcccccba','abcccccba','abbcccbba','.abbbbba.','..aaaaa..'],OBP={a:'#a9d9cf',b:'#e3f5f1',c:'#ffffff'};
function drawOrb(o){const x=Math.round(o.x),y=Math.round(o.y+Math.sin(tick*.07+o.x)*2.5);
 if(o.cd>0){ctx.globalAlpha=.3;PIX(OB,{a:'#a9d9cf'},x-4,y-4);ctx.globalAlpha=1;return}
 ctx.globalAlpha=.18+.08*Math.sin(tick*.1);ctx.fillStyle='#e3f5f1';for(let j=-8;j<=8;j++)for(let i=-8;i<=8;i++)if(i*i+j*j<=64)ctx.fillRect(x+i,y+j,1,1);ctx.globalAlpha=1;PIX(OB,OBP,x-4,y-4)}
function hearts(){if(!CROWS.length)return;for(let i=0;i<3;i++)PIX(HRT,{a:i<hp?'#e9708f':'#3a3050'},6+i*10,22)}
function drawCombat(){
 for(const e of ens){if(ekill.has(e.id))continue;const fr=e.state==='wind'?(e.st<18?'wizW0':'wizW1'):e.state==='rec'?'wizC':'wizI'+(Math.floor(e.t/32)%2),im=IM[fr];
  ctx.save();ctx.translate(Math.round(e.x),Math.round(e.y));if(e.face<0)ctx.scale(-1,1);if(e.hurt>0&&Math.floor(e.hurt/2)%2)ctx.globalAlpha=.4;ctx.drawImage(im,-26,-56);ctx.restore()}
 for(const q of torn)for(let r=0;r<7;r++){const w=13-r*1.5,x=q.x+Math.sin(q.t*.4+r*.9)*2.5-w/2;ctx.fillStyle=r%2?'#8fd8cf':'#e3f5f1';ctx.fillRect(Math.round(x),Math.round(q.y-8+r*2.3),Math.round(w),2)}
 for(const b of bolts)PIX(ORB,ORBP,b.x-3.5,b.y-3.5)}
let bkC=null;
function buildBackdrop(){
 const c=document.createElement('canvas');c.width=LW*T;c.height=LH*T;const g=c.getContext('2d');
 const bk=Array.from({length:LH},()=>new Uint8Array(LW));
 LEVELS.forEach(L=>L.backdrop.zones.forEach(z=>{for(let j=z[1]+L.dy;j<=z[3]+L.dy;j++)for(let i=z[0];i<=z[2];i++)if(!grid[j][i])bk[j][i]=1}));
 const open=(i,j)=>i<0||j<0||i>=LW||j>=LH?false:(!grid[j][i]&&!bk[j][i]);
 for(let j=0;j<LH;j++)for(let i=0;i<LW;i++){if(!bk[j][i])continue;
  const oT=open(i,j-1),oB=open(i,j+1),oL=open(i-1,j),oR=open(i+1,j);
  for(let by=0;by<8;by++)for(let bx=0;bx<8;bx++){let d=9;if(oT)d=Math.min(d,by);if(oB)d=Math.min(d,7-by);if(oL)d=Math.min(d,bx);if(oR)d=Math.min(d,7-bx);
   if(d<4&&hs(i*8+bx,j*8+by)<(4-d)/4.2)continue;
   const q=hs(i*17+bx*3,j*13+by*5);g.fillStyle=q<.08?'#1d5048':q<.3?'#163545':'#0f2230';g.fillRect(i*T+bx*2,j*T+by*2,2,2)}}
 const dm=(sx,sy,w,h,a)=>{const k=document.createElement('canvas');k.width=w;k.height=h;const x=k.getContext('2d');x.drawImage(IM.Tileset,sx,sy,w,h,0,0,w,h);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(8,22,36,'+a+')';x.fillRect(0,0,w,h);return k};
 const tree=dm(196,63,57,64,.5),mush=dm(255,63,50,64,.5),bush=dm(146,105,44,22,.45),vine=dm(16,64,48,33,.35),put=(s,x,y)=>g.drawImage(s,Math.round(x),Math.round(y));
 const SPRS={tree,mush,bush,vine};LEVELS.forEach(L=>L.backdrop.props.forEach(q=>put(SPRS[q[0]],q[1],q[2]+L.dy*T)));
 
 
 bkC=c}
function respawn(){crumbles.forEach(c=>{c.s=0;c.t=0});p.x=spawn.x-p.w/2;p.y=spawn.y-p.h;
 for(const dx of[0,8,-8,16,-16,24,-24,32,-32]){p.x=spawn.x-p.w/2+dx;if(!hit(p.x,p.y)&&!spikes.some(s=>overl(p,spikeBox(s))))break}
p.vx=p.vy=p.rx=p.ry=0;dead=false;dashT=0;grab=false;gt=0;wcd=0;airJ=0;dashes=1;lock=0;hp=3;inv=0;stun=0;atkT=0;atkCd=0;orbs.forEach(o=>o.cd=0);bolts.length=0;torn.length=0;ekill=new Set(eSnap);spawnEnemies();got=new Set(snap);trail.length=0}
function die(){if(dead)return;dead=true;dT=0;deaths++;cpFx=null;sfx('morte',.8);shake=7;burst(p.x+p.w/2,p.y+p.h/2,30,'#e9708f',2.4,30);burst(p.x+p.w/2,p.y+p.h/2,14,'#8fd8cf',1.6,24)}
