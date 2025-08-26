const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const cw = canvas.width;
const ch = canvas.height;
const size = 20;          // block size
let snake = [{x: 8*size, y: 8*size}];
let dir = {x: 0, y: 0};
let apple = {};
let score = 0;
let hiScore = 0;
let running = false;
let gameInterval = null;
const speed = 120; // ms per tick

function placeApple(){
  const cols = cw/size;
  const rows = ch/size;
  apple.x = Math.floor(Math.random()*cols)*size;
  apple.y = Math.floor(Math.random()*rows)*size;
  // avoid spawn on snake
  if(snake.some(s => s.x === apple.x && s.y === apple.y)) placeApple();
}

function reset(){
  snake = [{x: 8*size, y: 8*size}];
  dir = {x: 0, y: 0};
  score = 0;
  document.getElementById('score').textContent = score;
  placeApple();
  running = false;
  if(gameInterval) { clearInterval(gameInterval); gameInterval = null; }
}

function start(){
  if(running) return;
  running = true;
  if(!apple.x) placeApple();
  gameInterval = setInterval(tick, speed);
}

function pause(){
  if(gameInterval) { clearInterval(gameInterval); gameInterval = null; running=false; }
  else if(!gameInterval && running) start();
}

function tick(){
  // move snake
  const head = {x: snake[0].x + dir.x*size, y: snake[0].y + dir.y*size};

  // wall collision
  if(head.x < 0 || head.x >= cw || head.y < 0 || head.y >= ch) {
    gameOver();
    return;
  }
  // self collision
  if(snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver();
    return;
  }
  snake.unshift(head);

  // apple
  if(head.x === apple.x && head.y === apple.y) {
    score++;
    document.getElementById('score').textContent = score;
    if(score > hiScore) { hiScore = score; document.getElementById('hi').textContent = hiScore; }
    placeApple();
  } else {
    snake.pop();
  }
  draw();
}

function gameOver(){
  running = false;
  clearInterval(gameInterval);
  gameInterval = null;
  // flash canvas
  ctx.fillStyle = '#ff4d6d';
  ctx.fillRect(0,0,cw,ch);
  setTimeout(()=>{ reset(); draw(); }, 600);
}

function draw(){
  // clear
  ctx.fillStyle = '#071018';
  ctx.fillRect(0,0,cw,ch);

  // apple
  ctx.fillStyle = '#ff4757';
  ctx.fillRect(apple.x+2, apple.y+2, size-4, size-4);

  // snake
  for(let i=0;i<snake.length;i++){
    const s = snake[i];
    ctx.fillStyle = i===0 ? '#00d68f' : '#0fb47a';
    ctx.fillRect(s.x+1, s.y+1, size-2, size-2);
    // slight shine
    if(i===0){
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(s.x+4, s.y+4, size/3, size/3);
    }
  }
}

// controls
window.addEventListener('keydown', e=>{
  const key = e.key;
  if(key === 'ArrowUp' && dir.y === 0){ dir = {x:0, y:-1}; start(); }
  if(key === 'ArrowDown' && dir.y === 0){ dir = {x:0, y:1}; start(); }
  if(key === 'ArrowLeft' && dir.x === 0){ dir = {x:-1, y:0}; start(); }
  if(key === 'ArrowRight' && dir.x === 0){ dir = {x:1, y:0}; start(); }
  if(key === ' '){ pause(); } // space to pause
});

document.getElementById('start').addEventListener('click', ()=> start());
document.getElementById('pause').addEventListener('click', ()=> pause());
document.getElementById('reset').addEventListener('click', ()=> { reset(); draw(); });

reset();
draw();
