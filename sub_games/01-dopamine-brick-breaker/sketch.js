const W = 980;
const H = 640;
const COLS = 9;
const CELL = 76;
const TOP = 110;
const LEFT = 138;
const FLOOR = 560;

let dopamine = 50;
let score = 0;
let turn = 1;
let balls = [];
let bricks = [];
let items = [];
let aiming = true;
let message = "마우스로 각도를 정하고 클릭해서 발사";
let gameOver = false;
let settleTimer = 0;
let turnBuff = { noGain: false, boost: 1, power: 1 };
let overloadTurns = 0;
const BALL_LAUNCH_GAP = 8;

function setup() {
  createCanvas(W, H);
  textFont("sans-serif");
  resetGame();
}

function resetGame() {
  dopamine = 50;
  score = 0;
  turn = 1;
  balls = [];
  bricks = [];
  items = [];
  aiming = true;
  gameOver = false;
  overloadTurns = 0;
  for (let r = 0; r < 3; r++) addBrickRow(r);
}

function draw() {
  background("#111820");
  drawHeader();
  drawBoard();
  updateBalls();
  drawAim();
  checkTurnEnd();
  drawOverlay();
}

function mousePressed() {
  if (gameOver) {
    resetGame();
    return;
  }
  if (!aiming) return;

  const origin = createVector(W / 2, FLOOR - 18);
  const target = createVector(mouseX, mouseY);
  const dir = p5.Vector.sub(target, origin);
  if (dir.y > -20) return;
  dir.normalize();

  const count = constrain(floor(map(dopamine, 0, 100, 1, 9)), 1, 9);
  turnBuff = randomBuff();
  balls = [];
  for (let i = 0; i < count; i++) {
    balls.push({
      x: origin.x,
      y: origin.y,
      vx: dir.x * 8.6,
      vy: dir.y * 8.6,
      launchDelay: i * BALL_LAUNCH_GAP,
      active: i === 0,
      alive: true
    });
  }
  aiming = false;
  message = `${count}개 발사 / 이번 턴 효과: ${buffName(turnBuff)}`;
}

function keyPressed() {
  if (key === "r" || key === "R") resetGame();
}

function addBrickRow(rowIndex = 0) {
  for (let c = 0; c < COLS; c++) {
    if (random() > 0.66) continue;
    const kind = random() < 0.72 ? "stim" : "recover";
    const value = kind === "stim" ? floor(random(1, 4)) : -floor(random(10, 26) / 5) * 5;
    bricks.push({
      c,
      r: rowIndex,
      hp: kind === "stim" ? floor(random(1, 4)) : floor(random(2, 5)),
      kind,
      value
    });
  }
}

function randomBuff() {
  const roll = random();
  if (roll < 0.22) return { noGain: true, boost: 1, power: 1 };
  if (roll < 0.43) return { noGain: false, boost: 1.7, power: 1 };
  if (roll < 0.64) return { noGain: false, boost: 1, power: 2 };
  return { noGain: false, boost: 1, power: 1 };
}

function buffName(buff) {
  if (buff.noGain) return "완화 큐브";
  if (buff.boost > 1) return "고자극 큐브";
  if (buff.power > 1) return "강화 큐브";
  return "없음";
}

function updateBalls() {
  for (const ball of balls) {
    if (!ball.alive) continue;
    if (ball.launchDelay > 0) {
      ball.launchDelay--;
      continue;
    }
    ball.active = true;
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x < 18 || ball.x > W - 18) ball.vx *= -1;
    if (ball.y < TOP + 5) ball.vy *= -1;
    if (ball.y > FLOOR) {
      ball.alive = false;
      continue;
    }

    for (const brick of bricks) {
      const bx = LEFT + brick.c * CELL;
      const by = TOP + brick.r * 52;
      if (ball.x > bx && ball.x < bx + 60 && ball.y > by && ball.y < by + 38) {
        ball.vy *= -1;
        hitBrick(brick);
        break;
      }
    }
  }
  bricks = bricks.filter((brick) => brick.hp > 0);
}

function hitBrick(brick) {
  brick.hp -= turnBuff.power;
  score += 10;
  if (brick.kind === "stim" && !turnBuff.noGain) {
    dopamine = constrain(dopamine + brick.value * turnBuff.boost, 0, 120);
  }
  if (brick.kind === "recover" && brick.hp <= 0) {
    dopamine = constrain(dopamine + brick.value, 0, 120);
    score += 20;
  }
}

function checkTurnEnd() {
  if (aiming || balls.some((ball) => ball.alive)) return;
  settleTimer++;
  if (settleTimer < 28) return;
  settleTimer = 0;
  turn++;

  if (dopamine > 100) overloadTurns++;
  else overloadTurns = 0;

  if (turn > 10) {
    gameOver = true;
    message = "10턴 생존 완료";
    return;
  }
  if (overloadTurns >= 2) {
    gameOver = true;
    message = "도파민 과부하가 오래 지속됨";
    return;
  }

  for (const brick of bricks) brick.r++;
  addBrickRow(0);
  if (bricks.some((brick) => TOP + brick.r * 52 + 38 > FLOOR - 18)) {
    gameOver = true;
    message = "블럭이 바닥에 닿음";
    return;
  }
  aiming = true;
  message = "다음 턴: 현재 수치를 보고 목표 블럭을 선택";
}

function drawHeader() {
  fill("#f8e7a2");
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(28);
  text("도파민 벽돌깨기", 120, 36);
  textSize(15);
  fill("#d9ddde");
  text("자극 블럭은 맞을 때 상승, \n회복 블럭은 파괴될 때 감소", 120, 75);

  drawMeter(620, 28, 260, dopamine);
  fill("#f6f1df");
  textAlign(RIGHT, CENTER);
  textSize(17);
  text(`턴 ${turn}/10  점수 ${score}`, W - 34, 75);
}

function drawMeter(x, y, w, value) {
  fill("#2a3138");
  rect(x, y, w, 18, 6);
  const col = value < 31 ? "#68a7ff" : value < 71 ? "#55c99f" : value < 101 ? "#ffb64d" : "#ff5b6c";
  fill(col);
  rect(x, y, constrain(map(value, 0, 120, 0, w), 0, w), 18, 6);
  fill("#f6f1df");
  textAlign(LEFT, CENTER);
  textSize(14);
  text(`도파민 ${round(value)}`, x, y + 36);
}

function drawBoard() {
  stroke("#303944");
  line(32, FLOOR, W - 32, FLOOR);
  noStroke();
  for (const brick of bricks) {
    const x = LEFT + brick.c * CELL;
    const y = TOP + brick.r * 52;
    fill(brick.kind === "stim" ? "#f56f83" : "#63c7a4");
    rect(x, y, 60, 38, 6);
    fill("#111820");
    textAlign(CENTER, CENTER);
    textSize(16);
    const label = brick.kind === "stim" ? `+${brick.value}` : `${brick.value}`;
    text(`${label} / ${max(0, brick.hp)}`, x + 30, y + 19);
  }

  fill("#f6f1df");
  for (const ball of balls) {
    if (ball.alive && ball.active) circle(ball.x, ball.y, 12);
  }
  fill("#f8e7a2");
  circle(W / 2, FLOOR - 18, 18);
}

function drawAim() {
  if (!aiming || gameOver) return;
  stroke("#f8e7a2");
  strokeWeight(2);
  line(W / 2, FLOOR - 18, mouseX, mouseY);
  noStroke();
}

function drawOverlay() {
  fill("#d9ddde");
  textAlign(CENTER, CENTER);
  textSize(16);
  text(message, W / 2, H - 28);
  if (!gameOver) return;
  fill(0, 170);
  rect(0, 0, W, H);
  fill("#f8e7a2");
  textSize(42);
  text(message, W / 2, 270);
  fill("#f6f1df");
  textSize(22);
  text(`최종 도파민 ${round(dopamine)} / 최종 점수 ${score}`, W / 2, 326);
  text("클릭하면 다시 시작", W / 2, 380);
}
