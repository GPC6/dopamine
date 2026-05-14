const W = 980;
const H = 620;
const SKILL_A_THRESHOLD = 45;
const SKILL_B_THRESHOLD = 75;
const SKILL_A_COST = 25;
const SKILL_B_COST = 45;

let player;
let shots;
let enemies;
let bullets;
let gates;
let dopamine;
let lives;
let score;
let startedAt;
let spawnTimer;
let skillCooldown;
let gameOver;
let resultText;
let overloadStart;
let skillFlash;

function setup() {
  createCanvas(W, H);
  textFont("sans-serif");
  resetGame();
}

function resetGame() {
  player = { x: 110, y: H / 2, r: 18, shield: 0 };
  shots = [];
  enemies = [];
  bullets = [];
  gates = [];
  dopamine = 48;
  lives = 3;
  score = 0;
  startedAt = millis();
  spawnTimer = 0;
  skillCooldown = 0;
  gameOver = false;
  resultText = "Space 공격 / Shift 또는 X 기술 사용";
  overloadStart = 0;
  skillFlash = 0;
}

function draw() {
  background("#0e151c");
  drawStars();
  if (!gameOver) updateGame();
  drawGame();
  drawHud();
  if (gameOver) drawEnd();
}

function keyPressed() {
  if (gameOver && (key === "r" || key === "R")) resetGame();
  if (gameOver) return;
  if (key === " ") fireShot();
  if (keyCode === SHIFT || key === "x" || key === "X") useSkill();
}

function updateGame() {
  const speedBoost = map(constrain(dopamine, 0, 110), 0, 110, 2.5, 6.5);
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) player.y -= speedBoost;
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) player.y += speedBoost;
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) player.x -= speedBoost * 0.75;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) player.x += speedBoost * 0.75;
  player.x = constrain(player.x, 40, W - 80);
  player.y = constrain(player.y, 92, H - 45);

  skillCooldown = max(0, skillCooldown - 1);
  skillFlash = max(0, skillFlash - 1);

  spawnTimer--;
  if (spawnTimer <= 0) {
    spawnEnemy();
    if (random() < 0.2) gates.push({ x: W + 20, y: random(120, H - 70), r: 28 });
    spawnTimer = dopamine > 70 ? 34 : 52;
  }

  for (const s of shots) s.x += s.vx;
  shots = shots.filter((s) => s.x < W + 90);

  for (const gate of gates) gate.x -= 3.5;
  gates = gates.filter((gate) => gate.x > -40);

  for (const enemy of enemies) {
    enemy.x -= enemy.speed;
    if (enemy.type === "addict" && dist(player.x, player.y, enemy.x, enemy.y) < 130) {
      dopamine = constrain(dopamine + 0.08, 0, 120);
    }
    if (frameCount % 65 === 0) {
      bullets.push({ x: enemy.x - 12, y: enemy.y, vx: -4.2, vy: random(-1.2, 1.2) });
    }
  }

  for (const b of bullets) {
    b.x += b.vx;
    b.y += b.vy;
  }
  bullets = bullets.filter((b) => b.x > -30);

  handleCollisions();
  dopamine = constrain(dopamine - 0.012, 0, 120);

  const elapsed = (millis() - startedAt) / 1000;
  if (elapsed >= 90) endGame("90초 생존 성공");
  if (dopamine > 105) overloadStart = overloadStart || millis();
  else overloadStart = 0;
  if (overloadStart && millis() - overloadStart > 4200) endGame("도파민 과부하");
  if (lives <= 0) endGame("라이프 소진");
}

function fireShot() {
  shots.push({ x: player.x + 18, y: player.y, vx: 8.2, r: dopamine > 70 ? 8 : 5, beam: false });
  dopamine = constrain(dopamine + 0.8, 0, 120);
}

function useSkill() {
  if (skillCooldown > 0) {
    resultText = "기술 재사용 대기 중";
    return;
  }

  if (dopamine >= SKILL_B_THRESHOLD) {
    useReceptorBeam();
    return;
  }

  if (dopamine >= SKILL_A_THRESHOLD) {
    useReuptakePulse();
    return;
  }

  resultText = `도파민 ${SKILL_A_THRESHOLD} 이상부터 기술 사용 가능`;
}

function useReuptakePulse() {
  dopamine = constrain(dopamine - SKILL_A_COST, 0, 120);
  bullets = bullets.filter((b) => dist(player.x, player.y, b.x, b.y) > 160);
  for (const enemy of enemies) {
    if (dist(player.x, player.y, enemy.x, enemy.y) < 175) {
      enemy.hp -= enemy.type === "blocker" ? 1 : 2;
      enemy.speed *= 0.55;
    }
  }
  skillCooldown = 110;
  skillFlash = 26;
  resultText = `A기술 재흡수 펄스 발동: 도파민 -${SKILL_A_COST}`;
}

function useReceptorBeam() {
  dopamine = constrain(dopamine - SKILL_B_COST, 0, 120);
  shots.push({ x: player.x + 22, y: player.y, vx: 16, r: 17, beam: true });
  skillCooldown = 145;
  skillFlash = 34;
  resultText = `B기술 수용체 빔 발동: 도파민 -${SKILL_B_COST}`;
}

function spawnEnemy() {
  const roll = random();
  const type = roll < 0.55 ? "stim" : roll < 0.75 ? "stress" : roll < 0.9 ? "addict" : "blocker";
  enemies.push({
    x: W + 40,
    y: random(120, H - 70),
    r: type === "addict" ? 25 : 19,
    hp: type === "addict" ? 3 : 2,
    speed: random(2.0, 3.7) + dopamine / 100,
    type
  });
}

function handleCollisions() {
  for (const gate of gates) {
    if (dist(player.x, player.y, gate.x, gate.y) < gate.r + player.r) {
      dopamine = lerp(dopamine, 55, 0.55);
      gate.x = -100;
      resultText = "수용체 게이트 통과: 도파민 안정화";
    }
  }

  for (const s of shots) {
    for (const enemy of enemies) {
      if (dist(s.x, s.y, enemy.x, enemy.y) < s.r + enemy.r) {
        enemy.hp -= s.beam ? 4 : 1;
        if (!s.beam) s.x = W + 100;
      }
    }
  }

  const defeated = enemies.filter((enemy) => enemy.hp <= 0);
  for (const enemy of defeated) {
    score += enemy.type === "addict" ? 80 : 40;
    if (enemy.type === "stress") dopamine = constrain(dopamine - 8, 0, 120);
    else dopamine = constrain(dopamine + (enemy.type === "stim" ? 5 : 8), 0, 120);
  }
  enemies = enemies.filter((enemy) => enemy.hp > 0 && enemy.x > -60);

  for (const enemy of enemies) {
    if (dist(player.x, player.y, enemy.x, enemy.y) < player.r + enemy.r) {
      takeHit();
      enemy.x = -80;
    }
  }
  for (const b of bullets) {
    if (dist(player.x, player.y, b.x, b.y) < player.r + 5) {
      takeHit();
      b.x = -100;
    }
  }
}

function takeHit() {
  if (player.shield > 0) {
    player.shield--;
    return;
  }
  lives--;
  dopamine = constrain(dopamine + 10, 0, 120);
}

function endGame(text) {
  gameOver = true;
  resultText = text;
}

function drawStars() {
  stroke("#1f2c37");
  for (let i = 0; i < 42; i++) {
    const x = (i * 137 - frameCount * 1.4) % W;
    point((x + W) % W, 105 + (i * 61) % (H - 130));
  }
  noStroke();
}

function drawGame() {
  fill("#7be0b7");
  triangle(player.x - 18, player.y - 16, player.x - 18, player.y + 16, player.x + 24, player.y);
  fill("#e9fff4");
  circle(player.x - 4, player.y, 8);

  for (const gate of gates) {
    noFill();
    stroke("#7be0b7");
    strokeWeight(4);
    circle(gate.x, gate.y, gate.r * 2);
    noStroke();
  }

  for (const s of shots) {
    fill(s.beam ? "#ffd166" : "#f06c86");
    ellipse(s.x, s.y, s.beam ? 72 : 18, s.beam ? 12 : 8);
  }

  for (const enemy of enemies) {
    fill(enemyColor(enemy.type));
    circle(enemy.x, enemy.y, enemy.r * 2);
    fill("#101419");
    textAlign(CENTER, CENTER);
    textSize(12);
    text(enemyLabel(enemy.type), enemy.x, enemy.y);
  }

  fill("#ffc857");
  for (const b of bullets) circle(b.x, b.y, 8);

  if (skillFlash > 0) {
    noFill();
    stroke(dopamine >= SKILL_A_THRESHOLD ? "#7be0b7" : "#ffd166");
    strokeWeight(2);
    circle(player.x, player.y, 320 - skillFlash * 3);
    noStroke();
  }
}

function enemyColor(type) {
  if (type === "stress") return "#77a8ff";
  if (type === "addict") return "#ff7b54";
  if (type === "blocker") return "#b48cff";
  return "#f06c86";
}

function enemyLabel(type) {
  if (type === "stress") return "-";
  if (type === "addict") return "중";
  if (type === "blocker") return "방";
  return "+";
}

function drawHud() {
  fill("#f8e7a2");
  textAlign(LEFT, CENTER);
  textSize(27);
  text("횡스크롤 슈팅게임", 28, 32);
  fill("#dfe8e2");
  textSize(14);
  text("WASD/방향키 이동, Space 공격, Shift/X 기술 사용", 28, 63);
  drawMeter(615, 28, 280, dopamine);
  drawSkillState(615, 80);
  fill("#eef4ee");
  textAlign(RIGHT, CENTER);
  textSize(16);
  const remain = max(0, 90 - floor((millis() - startedAt) / 1000));
  text(`라이프 ${lives}  점수 ${score}  남은 ${remain}s`, W - 28, 76);
  textAlign(CENTER, CENTER);
  text(resultText, W / 2, H - 22);
}

function drawMeter(x, y, w, value) {
  fill("#24313b");
  rect(x, y, w, 18, 6);
  fill(value < 31 ? "#69a8ff" : value < 71 ? "#63d6a6" : value < 101 ? "#ffbd5a" : "#ff5d73");
  rect(x, y, constrain(map(value, 0, 120, 0, w), 0, w), 18, 6);
  fill("#eef4ee");
  textAlign(LEFT, CENTER);
  textSize(14);
  text(`도파민 ${round(value)}`, x, y + 35);
}

function drawSkillState(x, y) {
  const readyText = skillCooldown > 0 ? `대기 ${ceil(skillCooldown / 60)}초` : nextSkillName();
  fill("#17222b");
  rect(x, y, 280, 34, 6);
  fill(skillCooldown > 0 ? "#99a4aa" : "#f8e7a2");
  textAlign(LEFT, CENTER);
  textSize(13);
  text(`기술: ${readyText}`, x + 12, y + 17);
}

function nextSkillName() {
  if (dopamine >= SKILL_B_THRESHOLD) return `B 수용체 빔 사용 가능 (${SKILL_B_COST} 소모)`;
  if (dopamine >= SKILL_A_THRESHOLD) return `A 재흡수 펄스 사용 가능 (${SKILL_A_COST} 소모)`;
  return `도파민 ${SKILL_A_THRESHOLD} 필요`;
}

function drawEnd() {
  fill(0, 175);
  rect(0, 0, W, H);
  fill("#f8e7a2");
  textAlign(CENTER, CENTER);
  textSize(42);
  text(resultText, W / 2, 255);
  fill("#eef4ee");
  textSize(22);
  text(`최종 도파민 ${round(dopamine)} / 점수 ${score}`, W / 2, 315);
  text("R 키로 다시 시작", W / 2, 370);
}
