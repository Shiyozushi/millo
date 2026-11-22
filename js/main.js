// ---------- loop ----------
function boot(){
 fit();addEventListener('resize',fit);buildBackdrop();
 document.getElementById('w').addEventListener('pointerdown',e=>{if(mode!=='title'||menuConf)return;audioInit();const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
  if(tsub==='main'){for(let i=0;i<MENU.items.length;i++){const b=menuBtn(i);if(x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h){tsel=i;selT=0;pressed.Enter=1}}}
  else if(tsub==='cfg'){for(let i=0;i<2;i++){if(Math.abs(y-(86+i*34))<10&&x>=166&&x<=294){csel=i;const v=Math.max(0,Math.min(10,Math.ceil((x-170)/12)));if(i===0){AU.vm=v;if(music)music.volume=mv()}else{AU.vs=v;sfx('coin',.5)}saveCfg()}}
   if(Math.abs(y-154)<11&&x>150&&x<250){tsub='main';subT=0}}
  else if(tsub==='stages'){for(let n=1;n<=STAGE_TOTAL;n++){const b=stageBox(n);if(x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h){if(selectedStage===n)launchSelectedStage();else selectedStage=n;break}}}
  else{tsub='main';subT=0}});
 document.getElementById('w').addEventListener('pointermove',e=>{if(mode!=='title'||menuConf||tsub!=='main')return;const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;for(let i=0;i<MENU.items.length;i++){const b=menuBtn(i);if(x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h&&tsel!==i){tsel=i;selT=0;tone(700,900,.05,'square',.07)}}});
 if(document.fonts)document.fonts.load('700 9px "Pixelify Sans"');
 const BB={};const c=document.createElement('canvas');c.width=c.height=48;const x=c.getContext('2d');
 for(const k in IM){if(!/^(east|west|north|south|idle|run|cl\d)/.test(k))continue;x.clearRect(0,0,48,48);x.drawImage(IM[k],0,0);const d=x.getImageData(0,0,48,48).data;let x0=48,x1=0,y1=0;
  for(let j=0;j<48;j++)for(let i=0;i<48;i++)if(d[(j*48+i)*4+3]>20){x0=Math.min(x0,i);x1=Math.max(x1,i);y1=Math.max(y1,j)}
  BB[k]=[(x0+x1+1)/2,y1+1,x1+1];if(k==='idle0')p.w=Math.max(10,Math.round((x1-x0+1)*.45))}
 p.h=16;
 const G={};for(const k in BB){const g=/^idle/.test(k)?'i':/^run/.test(k)?'r':/^cl\d/.test(k)?'c':'d';(G[g]=G[g]||[]).push(k)}
 for(const g in G){if(g==='c')continue;const ks=G[g],mxv=ks.reduce((a,k)=>a+BB[k][0],0)/ks.length,myv=Math.max(...ks.map(k=>BB[k][1]));ks.forEach(k=>AN[k]=[Math.round(mxv*2)/2,myv])}
 {const cls=Object.keys(BB).filter(k=>/^cl\d/.test(k)),cb=Math.max(...cls.map(k=>BB[k][1])),fx=cls.reduce((a,k)=>a+BB[k][2],0)/cls.length;cls.forEach(k=>AN[k]=[Math.round(fx-6),cb])}   // frente (mãos) rente à parede
 respawn();let last=performance.now(),acc=0;
 camStep(true);(function loop(now){let dt=Math.min(100,now-last);last=now;if(Math.abs(dt-16.667)<2)dt=16.667;acc+=dt;while(acc>=16.66){step();acc-=16.667}if(acc<0)acc=0;draw();requestAnimationFrame(loop)})(last);
}
Promise.all(Object.entries(SPR).map(([k,u])=>new Promise(r=>{const i=new Image();i.onload=r;i.onerror=()=>{console.error("Sprite não carregado:",u);r()};i.src=u;IM[k]=i}))).then(boot);
