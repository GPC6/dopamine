const W = 860;
const H = 680;
const HITBOX = "#9fb2c0";
const DRAIN_LEFT = 382;
const DRAIN_RIGHT = 478;
let ball;
let dopamine;
let ballsLeft;
let bumpers;
let startedAt;
let gameOver;
let resultText;
let overloadStart;
let lowStart;
let calmTimer;
let shooterPower;
let shooterCharging;
let shooterLaunchPower;

function setup() {
  createCanvas(W, H);
  textFont("sans-serif");
  resetGame();
}

function resetGame() {
  dopamine = 52;
  ballsLeft = 3;
  bumpers = [
    { x: 305, y: 210, r: 32 },
    { x: 455, y: 175, r: 34 },
    { x: 545, y: 285, r: 30 },
    { x: 355, y: 335, r: 28 }
  ];
  startedAt = millis();
  gameOver = false;
  resultText = "";
  overloadStart = 0;
  lowStart = 0;
  calmTimer = 0;
  shooterPower = 0;
  shooterCharging = false;
  shooterLaunchPower = 0;
  launchBall();
}

function launchBall() {
  ball = { x: 702, y: 575, vx: 0, vy: 0, r: 12, inShooter: true };
  shooterPower = 0;
  shooterCharging = false;
  shooterLaunchPower = 0;
  resultText = "Space 또는 아래 방향키를 누른 뒤 떼서 발사";
}

function draw() {
  background("#101417");
  drawTable();
  if (!gameOver) updateBall();
  drawBall();
  drawHud();
  if (gameOver) drawEnd();
}

function keyPressed() {
  if (gameOver && (key === "r" || key === "R")) resetGame();
  if (gameOver) return;
  if (ball.inShooter && (key === " " || keyCode === DOWN_ARROW || key === "s" || key === "S")) {
    shooterCharging = true;
  }
}

function keyReleased() {
  if (!gameOver && ball.inShooter && shooterCharging) {
    shootBall();
  }
}

function mousePressed() {
  if (!gameOver && ball.inShooter && mouseX > 660 && mouseX < 760 && mouseY > 430) {
    shooterCharging = true;
  }
}

function mouseReleased() {
  if (!gameOver && ball.inShooter && shooterCharging) {
    shootBall();
  }
}

function shootBall() {
  const power = max(shooterPower, 0.06);
  shooterLaunchPower = power;
  ball.inShooter = false;
  ball.vx = -0.7;
  ball.vy = -map(power, 0, 1, 6.6, 18.4);
  ball.fromShooter = true;
  shooterCharging = false;
  shooterPower = 0;
  resultText = `발사 힘 ${round(power * 100)}%`;
}

function updateBall() {
  if (ball.inShooter) {
    updateShooter();
    checkEndState();
    return;
  }

  const agitation = dopamine > 70 ? 1.02 : dopamine < 31 ? 0.985 : 1;
  ball.vy += 0.23;
  ball.vx *= 0.998 * agitation;
  ball.vy *= 0.998 * agitation;
  ball.x += ball.vx;
  ball.y += ball.vy;

  guideShooterLaunch();
  collideWalls();
  exitShooterLane();

  collideBumpers();
  collideLane();
  collideReuptake();
  collideStabilizer();
  collideFlippers();

  if (ball.y > H + 30) loseBall();
  checkEndState();
}

function guideShooterLaunch() {
  if (!ball.fromShooter) return;
  if (ball.x < 660 || ball.x > 722) {
    ball.fromShooter = false;
    return;
  }

  ball.x = 702;
  ball.vx = 0;
  const guaranteedRiseSpeed = map(shooterLaunchPower, 0, 1, 5.8, 16.8);
  ball.vy = min(ball.vy, -guaranteedRiseSpeed);
}

function collideWalls() {
  if (ball.x < 132 + ball.r) {
    ball.x = 132 + ball.r;
    ball.vx = abs(ball.vx);
  }
  if (ball.x > 730 - ball.r) {
    ball.x = 730 - ball.r;
    ball.vx = -abs(ball.vx);
  }
  if (ball.y < 96 + ball.r) {
    ball.y = 96 + ball.r;
    ball.vy = abs(ball.vy);
  }

  if (ball.y > 617 - ball.r && ball.y < 640 && (ball.x < DRAIN_LEFT || ball.x > DRAIN_RIGHT)) {
    ball.y = 617 - ball.r;
    ball.vy = -abs(ball.vy) * 0.72;
    ball.vx *= 0.9;
  }

  collideRect(660, 132, 12, 470);
  collideRect(722, 132, 10, 470);
  collideRect(128, 92, 604, 12);
}

function exitShooterLane() {
  if (ball.x < 660 || ball.x > 722 || ball.y > 136 || ball.vy >= 0) return;
  const power = shooterLaunchPower;
  ball.fromShooter = false;
  ball.x = 648;
  ball.y = 135;
  ball.vx = -map(power, 0, 1, 3.7, 9.6);
  ball.vy = map(power, 0, 1, 3.2, -2.4);
  resultText = `슈터 레인 상단 배출 / 힘 ${round(power * 100)}%`;
}

function collideRect(x, y, w, h) {
  const closestX = constrain(ball.x, x, x + w);
  const closestY = constrain(ball.y, y, y + h);
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  if (dx * dx + dy * dy > ball.r * ball.r) return;

  const left = abs(ball.x - x);
  const right = abs(ball.x - (x + w));
  const top = abs(ball.y - y);
  const bottom = abs(ball.y - (y + h));
  const minSide = min(left, right, top, bottom);

  if (minSide === left) {
    ball.x = x - ball.r;
    ball.vx = -abs(ball.vx);
  } else if (minSide === right) {
    ball.x = x + w + ball.r;
    ball.vx = abs(ball.vx);
  } else if (minSide === top) {
    ball.y = y - ball.r;
    ball.vy = -abs(ball.vy);
  } else {
    ball.y = y + h + ball.r;
    ball.vy = abs(ball.vy);
  }
}

function collideBumpers() {
  for (const bumper of bumpers) {
    const d = dist(ball.x, ball.y, bumper.x, bumper.y);
    if (d < ball.r + bumper.r) {
      const nx = (ball.x - bumper.x) / d;
      const ny = (ball.y - bumper.y) / d;
      const force = dopamine > 70 ? 8.8 : 7.1;
      ball.vx = nx * force;
      ball.vy = ny * force;
      ball.x = bumper.x + nx * (ball.r + bumper.r + 1);
      ball.y = bumper.y + ny * (ball.r + bumper.r + 1);
      dopamine = constrain(dopamine + (calmTimer > 0 ? 3 : 7), 0, 120);
    }
  }
}

function collideLane() {
  if (ball.x > 610 && ball.x < 690 && ball.y > 118 && ball.y < 300 && ball.vy < 0) {
    dopamine = constrain(dopamine + 0.25, 0, 120);
  }
}

function collideReuptake() {
  const inLeftGate = ball.x > 135 && ball.x < 205 && ball.y > 420 && ball.y < 500;
  const inRightGate = ball.x > 650 && ball.x < 725 && ball.y > 418 && ball.y < 500;
  if (inLeftGate || inRightGate) {
    dopamine = constrain(dopamine - 0.55, 0, 120);
    ball.vx *= 0.985;
    resultText = "재흡수 통로 진입: 도파민 감소";
  }
}

function collideStabilizer() {
  if (ball.x > 377 && ball.x < 485 && ball.y > 470 && ball.y < 500 && dopamine >= 31 && dopamine <= 70) {
    dopamine = lerp(dopamine, 55, 0.025);
    resultText = "안정화 게이트 유지";
  }
  if (dopamine < 31 && dist(ball.x, ball.y, 225, 320) < 34) {
    dopamine = constrain(dopamine + 0.8, 0, 120);
    resultText = "결핍 자극기 활성화";
  }
}

function collideFlippers() {
  const leftActive = keyIsDown(LEFT_ARROW) || keyIsDown(65);
  const rightActive = keyIsDown(RIGHT_ARROW) || keyIsDown(68);
  handleFlipper(276, 585, 1, leftActive);
  handleFlipper(584, 585, -1, rightActive);
}

function handleFlipper(cx, cy, side, active) {
  if (dist(ball.x, ball.y, cx, cy) > 84 || ball.y < cy - 18 || ball.y > cy + 28) return;
  const lift = active ? -9.8 : -5.2;
  ball.vy = lift;
  ball.vx = side * (active ? 6.6 : 3.8);
  if (active) {
    calmTimer = 80;
    dopamine = constrain(dopamine - 1.4, 0, 120);
  }
}

function loseBall() {
  ballsLeft--;
  if (dopamine > 70) dopamine = constrain(dopamine + 12, 0, 120);
  else if (dopamine < 31) dopamine = constrain(dopamine - 8, 0, 120);
  if (ballsLeft <= 0) endGame("도파민 공 소진");
  else launchBall();
}

function updateShooter() {
  if (shooterCharging) {
    shooterPower = constrain(shooterPower + 0.018, 0, 1);
  } else {
    shooterPower = max(0, shooterPower - 0.025);
  }
  ball.x = 702;
  ball.y = 565 + shooterPower * 34;
}

function checkEndState() {
  calmTimer = max(0, calmTimer - 1);
  const now = millis();
  overloadStart = dopamine > 105 ? overloadStart || now : 0;
  lowStart = dopamine < 10 ? lowStart || now : 0;
  if (overloadStart && now - overloadStart > 4500) endGame("도파민 과잉 지속");
  if (lowStart && now - lowStart > 4500) endGame("도파민 결핍 지속");
  if ((now - startedAt) / 1000 >= 90) endGame("제한 시간 종료");
}

function endGame(text) {
  gameOver = true;
  resultText = text;
}

function drawTable() {
  fill("#172027");
  stroke("#40505b");
  strokeWeight(4);
  rect(128, 92, 604, 535, 24);
  noStroke();

  fill("#24313a");
  rect(610, 112, 82, 195, 12);
  fill("#f8c45f");
  textAlign(CENTER, CENTER);
  textSize(13);
  text("보상\n회로", 651, 205);

  fill("#19362f");
  rect(138, 422, 70, 82, 10);
  rect(652, 422, 70, 82, 10);
  fill("#78d6a9");
  text("재흡수", 173, 463);
  text("재흡수", 687, 463);

  fill("#273b37");
  rect(377, 470, 108, 30, 8);
  fill("#78d6a9");
  text("안정화", 431, 486);

  fill(dopamine < 31 ? "#76d6ff" : "#33424a");
  circle(225, 320, 48);

  for (const bumper of bumpers) {
    fill("#f06c86");
    circle(bumper.x, bumper.y, bumper.r * 2);
    fill("#fff1ee");
    circle(bumper.x, bumper.y, bumper.r * 0.82);
  }

  drawShooter();
  drawGuidesAndHitboxes();
  drawFlipper(276, 585, 1, keyIsDown(LEFT_ARROW) || keyIsDown(65));
  drawFlipper(584, 585, -1, keyIsDown(RIGHT_ARROW) || keyIsDown(68));
}

function drawGuidesAndHitboxes() {
  stroke(HITBOX);
  strokeWeight(2);
  noFill();
  rect(128, 92, 604, 535, 24);
  rect(610, 112, 82, 195, 12);
  rect(138, 422, 70, 82, 10);
  rect(652, 422, 70, 82, 10);
  rect(377, 470, 108, 30, 8);
  rect(678, 382, 48, 220, 10);
  rect(660, 132, 12, 470);
  rect(722, 132, 10, 470);
  line(128, 617, DRAIN_LEFT, 617);
  line(DRAIN_RIGHT, 617, 732, 617);
  line(DRAIN_LEFT, 617, DRAIN_RIGHT, 617);

  for (const bumper of bumpers) circle(bumper.x, bumper.y, (bumper.r + ball.r) * 2);
  circle(225, 320, 68);

  fill("#101417");
  noStroke();
  rect(DRAIN_LEFT + 2, 609, DRAIN_RIGHT - DRAIN_LEFT - 4, 18);
  fill("#ff6e7b");
  textAlign(CENTER, CENTER);
  textSize(12);
  text("낙하", (DRAIN_LEFT + DRAIN_RIGHT) / 2, 617);
}

function drawFlipper(cx, cy, side, active) {
  push();
  translate(cx, cy);
  rotate(side * (active ? -0.42 : 0.2));
  fill(active ? "#78d6a9" : "#d7d0c0");
  rectMode(CENTER);
  rect(side * 32, 0, 96, 18, 9);
  pop();
}

function drawShooter() {
  fill("#11181e");
  stroke("#40505b");
  strokeWeight(3);
  rect(678, 382, 48, 220, 10);
  rect(678, 132, 48, 255, 10);
  noStroke();

  fill("#f8e7a2");
  textAlign(CENTER, CENTER);
  textSize(12);
  text("슈터", 702, 400);
  text("배출", 702, 152);

  fill("#2b353d");
  rect(687, 548 + shooterPower * 34, 30, 42, 8);
  fill("#78d6a9");
  rect(688, 530, 28, map(shooterPower, 0, 1, 0, 86), 7);
}

function drawBall() {
  fill("#f8e7a2");
  circle(ball.x, ball.y, ball.r * 2);
}

function drawHud() {
  fill("#f8e7a2");
  textAlign(LEFT, CENTER);
  textSize(28);
  text("도파민 볼", 28, 34);
  fill("#e9e4d6");
  textSize(14);
  text("Space/아래키 길게 누른 뒤 떼기: 발사. 좌/우 방향키 또는 A/D: 플리퍼", 28, 66);
  drawMeter(530, 28, 260, dopamine);
  fill("#f7f1df");
  textAlign(RIGHT, CENTER);
  textSize(16);
  const remain = max(0, 90 - floor((millis() - startedAt) / 1000));
  text(`공 ${ballsLeft}  남은 ${remain}s`, W - 28, 78);
  textAlign(CENTER, CENTER);
  text(resultText, W / 2, H - 22);
}

function drawMeter(x, y, w, value) {
  fill("#2a3033");
  rect(x, y, w, 18, 6);
  fill(value < 31 ? "#69a8ff" : value < 71 ? "#70d6a8" : value < 101 ? "#ffbd5a" : "#ff5d73");
  rect(x, y, constrain(map(value, 0, 120, 0, w), 0, w), 18, 6);
  fill("#f7f1df");
  textAlign(LEFT, CENTER);
  textSize(14);
  text(`도파민 ${round(value)} / ${stateName(value)}`, x, y + 35);
}

function stateName(value) {
  if (value < 31) return "결핍";
  if (value < 71) return "안정";
  if (value < 101) return "과자극";
  return "과잉";
}

function drawEnd() {
  fill(0, 178);
  rect(0, 0, W, H);
  fill("#f8e7a2");
  textAlign(CENTER, CENTER);
  textSize(42);
  text(resultText, W / 2, 260);
  fill("#f7f1df");
  textSize(22);
  text(`최종 도파민 수치: ${round(dopamine)} / 결과: ${stateName(dopamine)}`, W / 2, 320);
  text("R 키로 다시 시작", W / 2, 374);
}
