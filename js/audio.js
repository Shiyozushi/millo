// ---------- áudio ----------
const AU={muted:false,vm:5,vs:5};   // vm = volume da música, vs = volume dos efeitos (0 a 10, padrão 5)
try{const c=JSON.parse(localStorage.getItem('millo.cfg')||'{}');if(typeof c.vm==='number')AU.vm=c.vm;if(typeof c.vs==='number')AU.vs=c.vs}catch(e){}
const saveCfg=()=>{try{localStorage.setItem('millo.cfg',JSON.stringify({vm:AU.vm,vs:AU.vs}))}catch(e){}};
const mv=b=>Math.min(1,(b||.35)*AU.vm/5);let actx=null,music=null;const bufs={};
// HTMLAudioElement funciona tanto em file:// quanto em HTTP(S), sem fetch.
const effects={};
function audioInit(){
 if(actx){if(actx.state==='suspended')actx.resume().catch(()=>{});return}
 try{actx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}
 for(const k of ['jump','dash','level_complete','coin','morte']){
  effects[k]=new Audio(AUD[k]);effects[k].preload='auto';
 }
 music=new Audio(AUD.background);music.loop=true;music.volume=mv();music.muted=AU.muted;
 music.play().catch(()=>{});
}
function sfx(k,v=.7){
 if(AU.muted||!effects[k])return;
 const a=effects[k].cloneNode();a.volume=Math.min(1,v*AU.vs/5);
 a.play().catch(()=>{});a.addEventListener('ended',()=>{a.src='';a.load()},{once:true});
}
