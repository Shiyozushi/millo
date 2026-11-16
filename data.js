/* =====================================================================
   data.js — configuração e dados da fase (edite aqui para mudar a fase)
   Unidades: tiles de 16px, a menos que dito o contrário.
   ===================================================================== */

// Resolução interna (pixel art) e tamanho do tile
const W=400,H=240,T=16;
// Tamanho do mapa em tiles (LW x LH): sala 1 embaixo (15 linhas) + sala 2 em cima (30 linhas)
const LW=25,LH=45;
// Física do personagem: força do pulo, gravidade, velocidade de corrida
const J=4.8,G=.3,RUN=1.7;

// Recortes do tileset.png usados como decoração: [x, y, largura, altura]
const DEC={tree:[196,63,57,64],mush:[255,63,50,64],rocks:[32,106,113,21],bush:[146,105,44,22],flowers:[16,121,7,6]};

// Menu principal: opções e posição dos botões (em pixels)
const MENU={items:['Novo Jogo','Controles','Configurações'],x:12,y:96,gap:30,w:132,h:22};

// Texto da tela de controles
const CONTROLS=[
  'A / D  andar',
  'Espaço ou C  pular (segure para pular mais alto)',
  'Espaço ou C no ar  dash (W / S mudam a direção)',
  'Encostar na parede: agarra  (W / S sobe e desce)',
  'Na parede: Espaço ou C  pula pro outro lado',
  'X ou K  magia (W / S mudam a mira)',
  'P  pausar  ·  M  som  ·  R  reiniciar'
];

// ---- Sala 1 (embaixo). Coordenadas em tiles, relativas à sala; 'dy' é a linha onde a sala começa no mapa ----
const LEVEL={
  dy:30, coinId:'c',
  spawn:[1.8,11],                       // [x do centro, y do chão]

  // Blocos de terreno sólido: [x, y, largura, altura]
  fills:[
    [0,0,1,15],[1,2,1,3],[1,0,2,2],            // parede esquerda
    [1,11,2,4],                                // chão do spawn
    [3,14,3,1],                                // fundo do fosso
    [6,10,2,5],                                // pilar
    [8,12,3,3],                                // chão dos espinhos
    [11,9,3,3],[11,12,1,1],                    // base da torre
    [14,10,2,2],                               // prateleira com espinhos
    [16,10,1,3],[16,13,3,2],                   // beco sem saída embaixo à direita
    [22,9,2,3],[22,12,3,3],                    // rocha da direita
    [19,4,3,2],[22,1,1,9],[21,6,1,2],          // estrutura até a saída
    [3,3,3,1],[6,0,3,2],[8,0,2,4],[10,0,6,1],[13,0,1,2],[16,0,3,1],   // teto
    [11,12,5,3],[23,1,2,11]                    // preenchimentos maciços (centro-baixo e faixa da direita)
  ],

  spikes:[[3,13,3],[8,11,3],[14,9,2],[17,12,2]],   // espinhos para cima: [x, y, quantidade]
  wallSpikes:[[20,6,2]],                           // espinhos na parede (apontam p/ esquerda): [x, y, quantidade]

  // Molduras (bloco oco do tileset, 3x3): [x, y, comGramaNoTopo]
  frames:[[11,6,true],[3,0,false]],
  holes:[[4,1],[12,7]],                            // miolo das molduras, preenchido com terreno

  decos:[["flowers",1.6,11],["bush",7,10],["bush",20,4],["flowers",13,6],["flowers",9.6,12]],  // [nome, x, y do chão]
  coins:[[4.4,8.2],[9,8.4],[12,4.4],[15.4,3.1],[19,2.8]],   // moedas: a saída só abre com todas
  checkpoints:[[12,5]],
  orbs:[],                                         // esferas de pulo extra (nenhuma por enquanto)
  enemies:[],                                      // corvos: [id, x, y do chão] (desativados)
  gate:{x:21,w:4},                                // barreira da saída, no topo à direita

  // Cenário de fundo (só visual): zonas [x1,y1,x2,y2] em tiles; props [sprite, x, y] em pixels
  backdrop:{
    zones:[[1,2,9,10],[0,11,24,14],[17,6,24,14],[22,0,24,9],[10,10,17,14],[4,1,4,1],[12,7,12,7]],
    props:[
    ["tree",170,176],
    ["tree",236,172],
    ["bush",196,218],
    ["bush",150,218],
    ["mush",290,176],
    ["tree",330,172],
    ["bush",300,218],
    ["bush",352,218],
    ["mush",200,180],
    ["bush",242,218],
    ["tree",350,80],
    ["vine",354,0],
    ["bush",356,124],
    ["mush",372,86],
    ["vine",48,64],
    ["vine",96,32],
    ["vine",128,64],
    ["tree",14,112]
    ]
  }
};

// ---- Sala 2 (em cima): continuação da subida, mais difícil ----
// spikes: [x, y, quantidade, direção]  direção: U (cima), D (baixo)
// wallSpikes: [x, y, quantidade, direção]  direção: L (apontam p/ esquerda), R (apontam p/ direita)
// movers: [x1, y1, x2, y2, velocidade]  plataformas móveis
const LEVEL2={
  dy:0, coinId:'d',
  fills:[
    [0,0,11,5],                        // teto, com espinhos pendurados
    [0,8,5,22],                        // paredão da esquerda
    [5,19,3,11],                       // ponta esquerda do fosso
    [15,19,6,11],                      // plataforma ao sair do poço
    [10,8,5,1],                        // plataforma depois do dash
    [16,6,3,1],[20,4,3,1],             // degraus finais
    [23,1,2,4]                         // paredão final
  ],
  spikes:[[6,5,4,'D'],[8,29,7,'U'],[12,7,1,'U']],
  wallSpikes:[[21,25,2,'R'],[24,22,2,'L']],
  frames:[], holes:[],
  decos:[["flowers",6.5,19],["bush",17.5,19],["flowers",2,8],["bush",12,8],["bush",17.5,6],["flowers",21,4]],
  coins:[[22,24],[11,16.5],[7.5,6.8],[13,5],[21,2.3]],
  checkpoints:[[17,18],[12,7]],
  orbs:[],
  movers:[[9,19,12,19,.016]],
  enemies:[],
  gate:{x:21,w:4},                     // barreira no topo: só abre com as 5 moedas desta sala
  backdrop:{
    zones:[[0,12,24,29]],
    props:[["vine",0,80],["vine",40,80],["tree",128,400],["tree",174,402],["mush",206,404]]
  }
};

const LEVELS=[LEVEL,LEVEL2];
