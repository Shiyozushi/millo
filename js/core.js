/* Lógica original do jogo, preservada para compatibilidade. */
const cv=document.getElementById('c'),ctx=cv.getContext('2d');cv.width=W;cv.height=H;ctx.imageSmoothingEnabled=false;
const ov=document.getElementById('t'),tc=ov.getContext('2d');
function fit(){const d=window.devicePixelRatio||1,w=document.getElementById('w'),vw=innerWidth*d,vh=innerHeight*d;let s=Math.floor(Math.min(vw/W,vh/H));if(s<1)s=Math.min(vw/W,vh/H);w.style.width=(W*s/d)+'px';w.style.height=(H*s/d)+'px';ov.width=Math.max(1,Math.round(W*s));ov.height=Math.max(1,Math.round(H*s))}
const IM={};
const approach=(v,t,a)=>v<t?Math.min(v+a,t):Math.max(v-a,t);
const hs=(a,b)=>(((a*73856093)^(b*19349663))>>>0)%1000/1000;
