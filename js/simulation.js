// ---------- simulação ----------
function step(){
 if(pressed.KeyM){AU.muted=!AU.muted;if(music)music.muted=AU.muted}
 if(irisIn){irisIn.t++;const u=Math.max(0,Math.min(1,irisIn.t/32));irisR=IRIS_R*(1-(1-u)*(1-u));irisC=[p.x+p.w/2-Math.round(cam.x),p.y+p.h/2-Math.round(cam.y)];if(u>=1){irisR=-1;irisIn=null;time=0}}
 if(mode==='title'){menuStep();pressed={};return}
 if(mode==='end'){endT++;if(endT>30&&(pressed.Space||pressed.Enter))resetRun(true);pressed={};return}
 if(pressed.KeyR){resetRun(false);return}
 if(pressed.KeyP||pressed.Escape)paused=!paused;
 if(paused){pressed={};return}
 tick++;time++;camStep();if(cpFx&&++cpFx.t>92)cpFx=null;GATES.forEach(g=>g.on=[...got].filter(i=>i[0]===g.id).length<g.n);
 for(const m of movers){const ride=!dead&&p.y+p.h===m.y&&p.x+p.w>m.x&&p.x<m.x+m.w,ox=m.x,oy=m.y;m.t+=m.s;const k=.5-.5*Math.cos(m.t*6.28);
  m.x=Math.round(m.ax+(m.bx-m.ax)*k);m.y=Math.round(m.ay+(m.by-m.ay)*k);
  if(ride){p.y=m.y-p.h;if(m.x-ox)mx(m.x-ox)}else if(!dead&&overl(p,m)){
   const ov=p.y+p.h-m.y;
   if(ov>0&&ov<=4&&p.vy>=0){p.y=m.y-p.h}                       // 1-4 px de sobreposição: pousa em cima
   else{const dx=m.x-ox,dy=m.y-oy,sx=Math.sign(dx),sy=Math.sign(dy);
    for(let q=0;q<24&&overl(p,m);q++){if(dx&&!hit(p.x+sx,p.y,true))p.x+=sx;else if(dy&&!hit(p.x,p.y+sy,true))p.y+=sy;else break}
    if(overl(p,m))die()}}}
 for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.x+=q.vx;q.y+=q.vy;q.vy+=.03;q.vx*=.96;if(--q.l<=0)parts.splice(i,1)}
 for(let i=trail.length-1;i>=0;i--)if(--trail[i].l<=0)trail.splice(i,1);
 p.sx+=(1-p.sx)*.22;p.sy+=(1-p.sy)*.22;if(shake>0)shake--;
 if(dead){if(++dT>26){respawn();camStep(true)}pressed={};return}
 const fresh=!!(pressed.Space||pressed.KeyC),held=!!(keys.Space||keys.KeyC),dirx=(kR()?1:0)-(kL()?1:0),diry=(kD()?1:0)-(kU()?1:0);p.dirx=dirx;
 const wasG=ground;ground=hit(p.x,p.y+1);
 const wallAny=hit(p.x+1,p.y)?1:hit(p.x-1,p.y)?-1:0,wallDir=ground?0:wallAny;
 if(wallDir){lastWall=wallDir;lastWallT=8}else if(lastWallT>0)lastWallT--;
 if(ground){coy=6;if(!dashT){dashes=1}airJ=0;lock=0;grab=false;gt=0}else if(coy>0)coy--;
 if(wcd>0)wcd--;
 if(!wasG&&ground){p.sx=1.3;p.sy=.7;burst(p.x+p.w/2,p.y+p.h,6,'#a9d9cf',.9,14)}
 if(fresh)buf=6;else if(buf>0)buf--;
 // agarrar na parede (fácil): encostou no ar -> agarra e escorrega; pular = pulo para o outro lado
 if(grab&&(dirx===-gside||!wallDir)){if(!wallDir&&!ground&&diry<0&&dirx!==-gside){p.vy=-2.4;p.vx=gside*1.8;wcd=8}grab=false}
 if(!grab&&!dashT&&wcd<=0&&((wallDir&&dirx!==-wallDir&&p.vy>=-.5)||(ground&&wallAny&&dirx===wallAny&&diry<0))){
  const sd=wallDir||wallAny;grab=true;gside=sd;gt=0;airJ=1;p.vx=0;p.vy=0;burst(p.x+(sd>0?p.w:0),p.y+4,6,'#cfeee6',.8,14)}
 // pulo / pulo de parede / dash
 if(buf>0&&!dashT){
  if(grab){grab=false;wcd=10;gt=0;airJ=0;buf=0;p.vy=-J*.95;p.vx=-gside*2.5;p.face=-gside;jumping=true;cut=false;p.sx=.75;p.sy=1.3;sfx('jump',.6);burst(p.x+(gside>0?p.w:0),p.y+p.h/2,8,'#cfeee6',1.2,16)}
  else if(coy>0){p.vy=-J;coy=0;buf=0;jumping=true;cut=false;p.sx=.75;p.sy=1.3;sfx('jump');burst(p.x+p.w/2,p.y+p.h,7,'#a9d9cf',1,14)}
  else if(airJ>0){airJ--;buf=0;p.vy=-J*.95;p.vx=lastWallT>0?-lastWall*2.6:p.vx;if(dirx&&lastWallT>0&&dirx!==lastWall)p.vx=dirx*2.6;jumping=true;cut=false;p.sx=.75;p.sy=1.3;sfx('jump',.6);burst(p.x+p.w/2,p.y+p.h/2,8,'#cfeee6',1.2,16)}
  else if(fresh&&dashes>0){dashes--;dashT=10;buf=0;let dx=dirx,dy=diry;if(!dx&&!dy)dx=p.face;const n=Math.hypot(dx,dy);dd={x:dx/n,y:dy/n};p.vx=dd.x*5.4;p.vy=dd.y*5.4;p.rx=p.ry=0;if(dx)p.face=Math.sign(dx);jumping=false;shake=3;sfx('dash',1.4);burst(p.x+p.w/2,p.y+p.h/2,10,'#9fe8ff',1.8,16)}}
 if(dashT){dashT--;if(tick%2==0)trail.push({x:p.x+p.w/2,y:p.y+p.h,f:p.face,n:'dash',l:12});
  if(!dashT){p.vx*=.45;p.vy=p.vy<0?p.vy*.45:Math.min(p.vy*.3,1.5)}}
 else if(grab){gt++;p.climbT=(p.climbT||0)+(diry<0?.2:diry>0?-.2:0);p.vx=0;p.vy=diry<0?-1.4:diry>0?2.2:0;if(diry&&tick%6==0)burst(p.x+(gside>0?p.w:0),p.y+p.h/2,1,'#a9d9cf',.4,10)}
 else{
  if(dirx)p.face=dirx;
  let a=ground?.34:.2;
  const ix=stun>0?0:dirx;if(stun>0)stun--;if(ix){if(Math.abs(p.vx)>RUN&&Math.sign(p.vx)===ix)a=.05;p.vx=approach(p.vx,ix*RUN,a)}else p.vx=approach(p.vx,0,stun>0?.03:ground?.42:.07);
  if(jumping&&p.vy<0&&!held&&!cut){p.vy*=.45;cut=true}
  if(p.vy>=0)jumping=false;
  let g=G;if(!ground&&Math.abs(p.vy)<.7&&held)g*=.5;
  p.vy=Math.min(p.vy+g,kD()?5.8:5);
  if(ground&&dirx&&tick%8==0)burst(p.x+p.w/2,p.y+p.h,1,'#a9d9cf',.5,10);
 }
 p.runT+=(ground&&p.dirx&&Math.abs(p.vx)<RUN*.5?RUN:Math.abs(p.vx))*.15;
 mx(p.vx);my(p.vy);combat(dirx,diry);
 for(const c of crumbles){
  if(c.s===0){if(!dead&&(ground||grab)&&overl({x:p.x-1,y:p.y-1,w:p.w+2,h:p.h+2},c)){c.s=1;c.t=0;burst(c.x+24,c.y+4,6,'#c98a4a',1.2,16);tone(190,130,.1,'square',.08)}}
  else if(c.s===1){if(++c.t>=28){c.s=2;c.t=0;for(let q=0;q<3;q++)burst(c.x+8+q*16,c.y+8,9,q%2?'#c98a4a':'#8b5028',1.7,26);tone(150,60,.25,'sawtooth',.12)}}
  else if(++c.t>=300&&!overl(p,c))c.s=0}
 for(const o of orbs){if(o.cd>0){o.cd--;continue}if(Math.abs(p.x+p.w/2-o.x)<10&&Math.abs(p.y+p.h/2-o.y)<12){airJ=1;o.cd=170;burst(o.x,o.y,14,'#e3f5f1',1.8,20);tone(660,1320,.12,'sine',.18)}}
 // perigos e coletáveis
 const hb={x:p.x,y:p.y,w:p.w,h:p.h};
 for(const s of spikes)if(overl(hb,spikeBox(s)))return die();
 if(p.y>LH*T+16)return die();
 for(const it of items)if(!got.has(it.id)&&overl(hb,{x:it.x,y:it.y,w:16,h:16})){got.add(it.id);sfx('coin');burst(it.x+8,it.y+8,14,'#ffe27a',1.8,22)}
 for(const c of cps)if(spawn.x!==c.x+8&&overl(hb,{x:c.x-4,y:c.y-8,w:24,h:24})){spawn={x:c.x+8,y:c.y+16};snap=new Set(got);eSnap=new Set(ekill);hp=3;cpFx={t:0,bx:p.x+p.w/2-p.face*5,by:p.y+7,tx:p.x+p.w/2,ty:p.y-20};burst(cpFx.bx,cpFx.by,22,'#ffe27a',1.9,28);tone(520,1040,.22,'sine',.16);burst(c.x+8,c.y+8,20,'#ffb36b',1.6,28)}
 if(p.y+p.h<4&&p.x>GATES[GATES.length-1].x-2*T){burst(p.x,p.y+8,40,'#ffe27a',2.5,40);finish()}
 pressed={};
}
