// ---------- input ----------
const keys={};let pressed={};
addEventListener('keydown',e=>{audioInit();if(typeof menuVideo==='function'&&mode==='title')menuVideo(true);if(/Space|Arrow/.test(e.code))e.preventDefault();if(!keys[e.code])pressed[e.code]=1;keys[e.code]=1});
addEventListener('keyup',e=>{keys[e.code]=0});
addEventListener('blur',()=>{for(const k in keys)keys[k]=0});
const kL=()=>keys.KeyA||keys.ArrowLeft,kR=()=>keys.KeyD||keys.ArrowRight,kU=()=>keys.KeyW||keys.ArrowUp,kD=()=>keys.KeyS||keys.ArrowDown;
