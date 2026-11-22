// ---------- jogador ----------
const p={x:0,y:0,w:9,h:13,vx:0,vy:0,rx:0,ry:0,face:1,sx:1,sy:1,runT:0};
let spawn={...SPAWN0},snap=new Set(),got=new Set(),mode='title',paused=false,dead=false,dT=0,deaths=0,time=0,tick=0,shake=0,ax=16,ay=30,cam={x:0,y:0};
let finalMs=0,endT=0,tsub='main',tsel=0,csel=0,selT=0,subT=0,menuConf=null,irisR=-1,irisC=[200,120],irisIn=null;const mOff=[0,0,0,0];const AN={},IRIS_R=260;
const fmt=ms=>Math.floor(ms/60000)+':'+String(Math.floor(ms/1000)%60).padStart(2,'0')+'.'+String(Math.floor(ms/10)%100).padStart(2,'0');
function finish(){const coins=[...got].filter(i=>i[0]==='c').length;runStars=evaluateStars(coins,NC,deaths);saveStageStars(currentStage,runStars);unlockNextStage();sfx('level_complete',.9);if(music)music.volume=mv(.15);finalMs=Math.round(time*1000/60);endT=0;mode='end'}
let hp=3,inv=0,stun=0,atkCd=0,atkT=0,ekill=new Set(),eSnap=new Set();const bolts=[],torn=[],ens=[];
let cpFx=null,wcd=0,buf=0,coy=0,airJ=0,dashes=1,dashT=0,grab=false,gt=0,gside=0,lock=0,lastWall=0,lastWallT=0,jumping=false,cut=false,ground=false,dd={x:1,y:0};
const parts=[],trail=[],motes=Array.from({length:36},(_,i)=>({x:hs(i,1)*W,y:hs(i,2)*H,ph:hs(i,3)*6}));
const burst=(x,y,n,col,sp=1.6,l=24)=>{for(let i=0;i<n;i++){const a=Math.random()*6.28,s=Math.random()*sp;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-.3,l:l*(.5+Math.random()*.7),m:l,c:col,s:Math.random()<.4?2:1})}};
function overl(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function hit(x,y,nm){const x0=Math.floor(x/T),x1=Math.floor((x+p.w-1)/T),y0=Math.floor(y/T),y1=Math.floor((y+p.h-1)/T);
 if(x0<0||x1>=LW)return true;
 for(let j=Math.max(y0,0);j<=y1&&j<LH;j++)for(let i=x0;i<=x1;i++)if(grid[j][i])return true;
 const r={x,y,w:p.w,h:p.h};for(const g of GATES)if(g.on&&overl(r,g))return true;for(const s of statics)if(overl(r,s))return true;for(const c of crumbles)if(c.s<2&&overl(r,c))return true;if(!nm)for(const s of movers)if(overl(r,s))return true;return false}
function mx(v){p.rx+=v;let m=Math.round(p.rx);p.rx-=m;const s=Math.sign(m);while(m){if(!hit(p.x+s,p.y)){p.x+=s;m-=s}else{p.vx=0;p.rx=0;break}}}
function my(v){p.ry+=v;let m=Math.round(p.ry);p.ry-=m;const s=Math.sign(m);while(m){if(!hit(p.x,p.y+s)){p.y+=s;m-=s}else{
 if(s<0){let ok=0;for(let n=1;n<=4&&!ok;n++)for(const d of[-n,n])if(!hit(p.x+d,p.y+s)){p.x+=d;ok=1;break}if(ok)continue;jumping=false}
 p.vy=0;p.ry=0;break}}}
function camStep(snapNow){const roomY=LH*T-H,t=Math.max(0,Math.min(LW*T-W,p.x+p.w/2-W/2+p.face*22)),follow=Math.max(0,Math.min(roomY,p.y-H/2+10)),k=Math.max(0,Math.min(1,(LEVEL.dy*T-(p.y+p.h/2))/48)),u=roomY*(1-k)+follow*k;if(snapNow){cam.x=t;cam.y=u}else{cam.x+=(t-cam.x)*.12;cam.y+=(u-cam.y)*.1}}
function resetRun(toTitle){time=0;deaths=0;runStars=0;got=new Set();snap=new Set();eSnap=new Set();spawn={...SPAWN0};movers.forEach(m=>{m.t=0;m.x=m.ax;m.y=m.ay});parts.length=0;trail.length=0;paused=false;finalMs=0;tsub='main';mode=toTitle?'title':'play';cpFx=null;menuConf=null;irisR=-1;irisIn=null;if(toTitle){tsel=0;tsub='main'}if(music)music.volume=mv();respawn();p.face=1;camStep(true);pressed={}}

