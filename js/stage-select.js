// Seleção de fases: compatível com file:// e GitHub Pages.
// As fases 2–10 aguardam mapas próprios. Não iniciar a fase 1 como substituta.
const STAGE_TOTAL=10, STAGE_STORAGE='millo-fases-v1';
let selectedStage=1, currentStage=1, highestUnlocked=1;
// Melhor avaliação por fase. Independente do progresso de desbloqueio.
const STAR_STORAGE='millo-estrelas-v1';
let stageStars=Array(STAGE_TOTAL).fill(0),runStars=0;
try {const saved=JSON.parse(localStorage.getItem(STAR_STORAGE)||'[]');if(Array.isArray(saved))stageStars=stageStars.map((_,i)=>Math.max(0,Math.min(3,Number(saved[i])||0)))}catch(e){console.warn('Estrelas salvas indisponíveis:',e)}
function evaluateStars(coins,total,deathCount){
 // 3: todas as moedas e zero mortes; 2: uma condição falhou; 1: ambas falharam.
 return 1+Number(total===0||coins>=total)+Number(deathCount===0);
}
function saveStageStars(n,stars){
 const i=n-1;if(i<0||i>=STAGE_TOTAL)return;
 stageStars[i]=Math.max(stageStars[i],stars);
 try{localStorage.setItem(STAR_STORAGE,JSON.stringify(stageStars))}catch(e){console.warn('Não foi possível salvar as estrelas:',e)}
}
// Estrelas desenhadas no canvas, sem dependência de fontes externas.
function paintStar(cx,cy,r,filled=true,g=ctx){
 g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.46:r;
 const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr;
 if(i===0)g.moveTo(x,y);else g.lineTo(x,y)}g.closePath();
 g.fillStyle=filled?'#ffe27a':'#273a53';g.fill();g.lineWidth=.85;g.strokeStyle=filled?'#fff0a4':'#6484a2';g.stroke();
}
function paintStars(cx,cy,earned,large=false,g=ctx){
 const d=large?31:12,r=large?9:3.6;
 paintStar(cx-d,cy,r,earned>=1,g);
 paintStar(cx,cy,large?14:5.2,earned>=2,g);
 paintStar(cx+d,cy,r,earned>=3,g);
}

try {highestUnlocked=Math.max(1,Math.min(STAGE_TOTAL,parseInt(localStorage.getItem(STAGE_STORAGE),10)||1))} catch(e) {console.warn('Progresso local indisponível:',e)}
function unlockNextStage(){
 const next=Math.min(STAGE_TOTAL,currentStage+1);
 if(next>highestUnlocked){highestUnlocked=next;try{localStorage.setItem(STAGE_STORAGE,String(highestUnlocked))}catch(e){console.warn('Não foi possível salvar o progresso:',e)}}
}
function stageBox(n){const col=(n-1)%5,row=Math.floor((n-1)/5);return {x:58+col*59,y:86+row*54,w:48,h:39}}
function stageSelectStep(){
 const up=pressed.ArrowUp||pressed.KeyW,down=pressed.ArrowDown||pressed.KeyS,left=pressed.ArrowLeft||pressed.KeyA,right=pressed.ArrowRight||pressed.KeyD;
 if(pressed.Escape||pressed.Backspace){tsub='main';subT=0;return}
 if(left)selectedStage=Math.max(1,selectedStage-1);
 if(right)selectedStage=Math.min(10,selectedStage+1);
 if(up)selectedStage=Math.max(1,selectedStage-5);
 if(down)selectedStage=Math.min(10,selectedStage+5);
 if(pressed.Enter||pressed.Space)launchSelectedStage();
}
function launchSelectedStage(){
 if(selectedStage>highestUnlocked){tone(180,120,.12,'square',.08);return}
 if(selectedStage!==1){tone(220,170,.12,'square',.08);return} // Apenas a fase 1 tem mapa atualmente
 currentStage=selectedStage;resetRun(false);irisR=0;irisIn={t:-10};menuVideo(false);
}
function drawStageSelect(){
 tc.fillStyle='rgba(3,8,22,.96)';tc.fillRect(0,0,W,H);
 txt('SELECIONAR FASE',W/2,45,'#ffe27a','center');
 txt('Complete uma fase para liberar a próxima',W/2,65,'#cfeee6','center');
 for(let n=1;n<=STAGE_TOTAL;n++){
  const b=stageBox(n),sel=n===selectedStage,locked=n>highestUnlocked,ready=n===1;
  tc.fillStyle=sel?'#ffe27a':'#42688a';tc.fillRect(b.x-2,b.y-2,b.w+4,b.h+4);
  tc.fillStyle=locked?'#111b2d':sel?'#294e70':'#193752';tc.fillRect(b.x,b.y,b.w,b.h);
  txt(locked?'🔒':String(n).padStart(2,'0'),b.x+b.w/2,b.y+16,locked?'#8d9cab':'#ffe27a','center');
  if(!locked&&stageStars[n-1])paintStars(b.x+b.w/2,b.y+28,stageStars[n-1],false,tc);
  if(!locked&&!ready&&!stageStars[n-1])txt('EM BREVE',b.x+b.w/2,b.y+31,'#9db2c4','center');
 }
 const status=selectedStage>highestUnlocked?'FASE BLOQUEADA':selectedStage!==1?'FASE EM DESENVOLVIMENTO':'ENTER PARA JOGAR';
 txt(status,W/2,207,'#ffe27a','center');txt('SETAS / WASD  selecionar  ·  ESC  voltar',W/2,230,'#a9d9cf','center');
}
