// ---------- fase (montada a partir de LEVEL e LEVEL2, em data.js) ----------
const grid=Array.from({length:LH},()=>new Uint8Array(LW));
const fill=(x,y,w,h,v=1)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)grid[j][i]=v};
const statics=[],movers=[],spikes=[],decos=[],cps=[],items=[],orbs=[],frames=[],GATES=[],crumbles=[];
for(const L of LEVELS){const dy=L.dy;
 L.fills.forEach(([x,y,w,h])=>fill(x,y+dy,w,h));
 (L.spikes||[]).forEach(([x,y,n,d])=>{for(let i=0;i<n;i++)spikes.push({x:(x+i)*T,y:(y+dy)*T,d:d||'U'})});
 (L.wallSpikes||[]).forEach(([x,y,n,d])=>{for(let j=0;j<n;j++)spikes.push({x:x*T,y:(y+j+dy)*T,d:d||'L'})});
 (L.frames||[]).forEach(([x,y,g])=>{frames.push({x:x*T,y:(y+dy)*T,g});fill(x,y+dy,3,3,2);grid[y+dy+1][x+1]=0});
 (L.holes||[]).forEach(([x,y])=>{grid[y+dy][x]=1});
 (L.decos||[]).forEach(d=>decos.push({n:d[0],x:d[1]*T,y:(d[2]+dy)*T}));
 L.coins.forEach((c,i)=>items.push({k:'Coin',x:c[0]*T,y:(c[1]+dy)*T,id:L.coinId+i,w:!!c[2]}));
 (L.crumbles||[]).forEach(([x,y])=>crumbles.push({x:x*T,y:(y+dy)*T,w:48,h:16,s:0,t:0}));
 (L.checkpoints||[]).forEach(c=>cps.push({x:c[0]*T,y:(c[1]+dy)*T}));
 (L.orbs||[]).forEach(o=>orbs.push({x:o[0]*T,y:(o[1]+dy)*T,cd:0}));
 (L.movers||[]).forEach(([ax,ay,bx,by,s])=>movers.push({x:ax*T,y:(ay+dy)*T,w:48,h:16,ax:ax*T,ay:(ay+dy)*T,bx:bx*T,by:(by+dy)*T,s,t:0}));
 GATES.push({x:L.gate.x*T,y:dy*T-24,w:L.gate.w*T,h:24,on:true,id:L.coinId,n:L.coins.length});
}
const SPAWN0={x:LEVEL.spawn[0]*T,y:(LEVEL.spawn[1]+LEVEL.dy)*T};
const CHEST={x:-999,y:-999};
const NC=items.filter(i=>i.k==='Coin').length;
const CROWS=LEVEL.enemies.map(e=>[e[0],e[1]*T,e[2]*T]);

