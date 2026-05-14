const W = 980;
const H = 620;
const lanes = [220, 340, 460];
let runner;
let objects;
let dopamine;
let distanceRun;
let gameSpeed;
let spawnGap;
let overloadStart;
let lowStart;
let gameOver;
let resultText;

function setup() {
  createCanvas(W, H);
  textFont("sans-serif");
  resetGame();
}

function resetGame() {
  runner = { x: 150, lane: 1, yOffset: 0, vy: 0, sliding: 0, invincible: 0 };
  objects = [];
  dopamine = 50;
  distanceRun = 0;
  gameSpeed = 5;
  spawnGap = 0;
  overloadStart = 0;
  lowStart = 0;
  gameOver = false;
  resultText = "";
}

function draw() {
  background("#111316");
  drawCircuit();
  if (!gameOver) updateGame();
  drawObjects();
  drawRunner();
  drawHud();
  if (gameOver) drawEnd();
}

function keyPressed() {
  if (gameOver && (key === "r" || key === "R")) resetGame();
  if (gameOver) return;
  if ((keyCode === UP_ARROW || key === "w" || key === "W") && runner.lane > 0) runner.lane--;
  if ((keyCode === DOWN_ARROW || key === "s" || key === "S") && runner.lane < 2) runner.lane++;
  if (key === " " && runner.yOffset === 0) runner.vy = jumpPower();
  if (keyCode === SHIFT || key === "x" || key === "X") runner.sliding = 34;
}

function updateGame() {
  gameSpeed = map(constrain(dopamine, 0, 110), 0, 110, 3.2, 9.2);
  distanceRun += gameSpeed * 0.08;
  dopamine = constrain(dopamine - 0.01, 0, 120);

  runner.vy += 0.72;
  runner.yOffset += runner.vy;
  if (runner.yOffset > 0) {
    runner.yOffset = 0;
    runner.vy = 0;
  }
  runner.sliding = max(0, runner.sliding - 1);
  runner.invincible = max(0, runner.invincible - 1);

  spawnGap -= gameSpeed;
  if (spawnGap <= 0) {
    spawnObject();
    spawnGap = dopamine > 70 ? random(120, 190) : random(165, 245);
  }

  for (const obj of objects) obj.x -= gameSpeed;
  objects = objects.filter((obj) => obj.x > -60);
  handleCollisions();
  checkStateTimers();

  if (distanceRun >= 1000) endGame("보상 회로 터널 완주");
}

function jumpPower() {
  if (dopamine < 31) return -12;
  if (dopamine < 71) return -15;
  return -14;
}

function spawnObject() {
  const roll = random();
  let type = "capsule";
  if (roll < 0.25) type = "obstacleLow";
  else if (roll < 0.43) type = "obstacleHigh";
  else if (roll < 0.62) type = "rest";
  else if (roll < 0.77) type = "portal";
  else if (roll < 0.87) type = "booster";
  objects.push({ x: W + 40, lane: floor(random(3)), type, taken: false });
}

function handleCollisions() {
  const ry = lanes[runner.lane] + runner.yOffset;
  for (const obj of objects) {
    if (obj.taken || obj.lane !== runner.lane || abs(obj.x - runner.x) > 34) continue;
    const lowBody = runner.sliding > 0;
    const jumping = runner.yOffset < -34;

    if (obj.type === "obstacleLow" && !jumping) {
      hitObstacle(obj);
    } else if (obj.type === "obstacleHigh" && !lowBody) {
      hitObstacle(obj);
    } else if (obj.type === "capsule") {
      dopamine = constrain(dopamine + 9, 0, 120);
      obj.taken = true;
    } else if (obj.type === "rest") {
      dopamine = constrain(dopamine - 11, 0, 120);
      obj.taken = true;
    } else if (obj.type === "portal") {
      dopamine = constrain(dopamine - 22, 0, 120);
      obj.taken = true;
    } else if (obj.type === "booster") {
      distanceRun += 42;
      dopamine = constrain(dopamine + 17, 0, 120);
      obj.taken = true;
    }
  }
}

function hitObstacle(obj) {
  if (runner.invincible > 0) return;
  runner.lane = floor(random(3));
  dopamine = constrain(dopamine + random([-10, 13]), 0, 120);
  runner.invincible = 55;
  obj.taken = true;
  resultText = "장애물 충돌: 랜덤 차선 변경";
}

function checkStateTimers() {
  const now = millis();
  overloadStart = dopamine > 105 ? overloadStart || now : 0;
  lowStart = dopamine < 12 ? lowStart || now : 0;
  if (overloadStart && now - overloadStart > 4200) endGame("과자극 지속으로 종료");
  if (lowStart && now - lowStart > 4200) endGame("무기력 지속으로 종료");
}

function endGame(text) {
  gameOver = true;
  resultText = text;
}

function drawCircuit() {
  stroke("#25313a");
  strokeWeight(2);
  for (const y of lanes) {
    line(40, y, W - 40, y);
    for (let x = 60; x < W; x += 96) circle((x - frameCount * gameSpeed * 0.4) % W, y, 5);
  }
  noStroke();
}

function drawObjects() {
  for (const obj of objects) {
    if (obj.taken) continue;
    const y = lanes[obj.lane];
    if (obj.type === "obstacleLow") {
      fill("#ff6e7b");
      rect(obj.x - 18, y - 4, 36, 44, 4);
    } else if (obj.type === "obstacleHigh") {
      fill("#ff9b54");
      rect(obj.x - 20, y - 76, 40, 48, 4);
    } else if (obj.type === "capsule") {
      fill("#f06c86");
      circle(obj.x, y - 24, 26);
      fill("#fff0f2");
      textAlign(CENTER, CENTER);
      text("+", obj.x, y - 24);
    } else if (obj.type === "rest") {
      fill("#70d6a8");
      rect(obj.x - 14, y - 38, 28, 28, 6);
    } else if (obj.type === "portal") {
      noFill();
      stroke("#70d6a8");
      strokeWeight(5);
      circle(obj.x, y - 28, 46);
      noStroke();
    } else {
      fill("#ffd166");
      triangle(obj.x - 15, y - 45, obj.x - 15, y - 5, obj.x + 20, y - 25);
    }
  }
}

function drawRunner() {
  const y = lanes[runner.lane] + runner.yOffset;
  fill(runner.invincible > 0 && frameCount % 8 < 4 ? "#ffffff" : "#76d6ff");
  if (runner.sliding > 0) rect(runner.x - 22, y - 20, 44, 20, 10);
  else {
    circle(runner.x, y - 28, 34);
    rect(runner.x - 13, y - 28, 26, 34, 8);
  }
}

function drawHud() {
  fill("#f8e7a2");
  textAlign(LEFT, CENTER);
  textSize(27);
  text("신경 회로 Run", 28, 32);
  fill("#e9eadf");
  textSize(14);
  text("위/아래 차선 변경, Space 점프, Shift/X 슬라이드", 28, 63);
  drawMeter(615, 28, 280, dopamine);
  fill("#f8f4e8");
  textAlign(RIGHT, CENTER);
  textSize(16);
  text(`진행 ${floor(distanceRun)}/1000`, W - 28, 76);
  textAlign(CENTER, CENTER);
  text(resultText, W / 2, H - 24);
}

function drawMeter(x, y, w, value) {
  fill("#2a3033");
  rect(x, y, w, 18, 6);
  fill(value < 31 ? "#69a8ff" : value < 71 ? "#70d6a8" : value < 101 ? "#ffbd5a" : "#ff5d73");
  rect(x, y, constrain(map(value, 0, 120, 0, w), 0, w), 18, 6);
  fill("#f8f4e8");
  textAlign(LEFT, CENTER);
  textSize(14);
  text(`도파민 ${round(value)} / 속도 ${nf(gameSpeed, 1, 1)}`, x, y + 35);
}

function drawEnd() {
  fill(0, 175);
  rect(0, 0, W, H);
  fill("#f8e7a2");
  textAlign(CENTER, CENTER);
  textSize(42);
  text(resultText, W / 2, 255);
  fill("#f8f4e8");
  textSize(22);
  text(`최종 도파민 ${round(dopamine)} / 진행 ${floor(distanceRun)}`, W / 2, 315);
  text("R 키로 다시 시작", W / 2, 370);
}
