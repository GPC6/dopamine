class SideShooterGame {
  constructor(initialDopamine) {
    this.w = 980;
    this.h = 620;
    this.skillAThreshold = 45;
    this.skillBThreshold = 75;
    this.skillACost = 25;
    this.skillBCost = 45;
    this.initialDopamine = initialDopamine;
    this.finished = false;
    this.resetGame();
  }

  resetGame() {
    this.player = { x: 110, y: this.h / 2, r: 18, shield: 0 };
    this.shots = [];
    this.enemies = [];
    this.bullets = [];
    this.gates = [];
    this.dopamine = this.initialDopamine;
    this.lives = 3;
    this.score = 0;
    this.startedAt = millis();
    this.spawnTimer = 0;
    this.skillCooldown = 0;
    this.gameOver = false;
    this.resultText = "Space 공격 / Shift 또는 X 기술 사용";
    this.overloadStart = 0;
    this.skillFlash = 0;
    this.finished = false;
  }

  update() {
    if (!this.gameOver) this.updateGame();
  }

  draw() {
    push();
    translate((width - this.w) / 2, (height - this.h) / 2);
    background("#0e151c");
    this.drawStars();
    this.drawGame();
    this.drawHud();
    if (this.gameOver) this.drawEnd();
    pop();
  }

  mousePressed() {
    if (this.gameOver) this.finished = true;
  }

  keyPressed() {
    if (this.gameOver) {
      if (key === "r" || key === "R" || keyCode === ENTER || key === " ") {
        this.finished = true;
      }
      return;
    }

    if (key === " ") this.fireShot();
    if (keyCode === SHIFT || key === "x" || key === "X") this.useSkill();
  }

  updateGame() {
    const speedBoost = map(constrain(this.dopamine, 0, 110), 0, 110, 2.5, 6.5);
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) this.player.y -= speedBoost;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) this.player.y += speedBoost;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.player.x -= speedBoost * 0.75;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.player.x += speedBoost * 0.75;
    this.player.x = constrain(this.player.x, 40, this.w - 80);
    this.player.y = constrain(this.player.y, 92, this.h - 45);

    this.skillCooldown = max(0, this.skillCooldown - 1);
    this.skillFlash = max(0, this.skillFlash - 1);

    this.spawnTimer--;
    if (this.spawnTimer <= 0) {
      this.spawnEnemy();
      if (random() < 0.2) this.gates.push({ x: this.w + 20, y: random(120, this.h - 70), r: 28 });
      this.spawnTimer = this.dopamine > 70 ? 34 : 52;
    }

    for (const s of this.shots) s.x += s.vx;
    this.shots = this.shots.filter((s) => s.x < this.w + 90);

    for (const gate of this.gates) gate.x -= 3.5;
    this.gates = this.gates.filter((gate) => gate.x > -40);

    for (const enemy of this.enemies) {
      enemy.x -= enemy.speed;
      if (enemy.type === "addict" && dist(this.player.x, this.player.y, enemy.x, enemy.y) < 130) {
        this.dopamine = constrain(this.dopamine + 0.08, 0, 120);
      }
      if (frameCount % 65 === 0) {
        this.bullets.push({ x: enemy.x - 12, y: enemy.y, vx: -4.2, vy: random(-1.2, 1.2) });
      }
    }

    for (const b of this.bullets) {
      b.x += b.vx;
      b.y += b.vy;
    }
    this.bullets = this.bullets.filter((b) => b.x > -30);

    this.handleCollisions();
    this.dopamine = constrain(this.dopamine - 0.012, 0, 120);

    const elapsed = (millis() - this.startedAt) / 1000;
    if (elapsed >= 90) this.endGame("90초 생존 성공");
    if (this.dopamine > 105) this.overloadStart = this.overloadStart || millis();
    else this.overloadStart = 0;
    if (this.overloadStart && millis() - this.overloadStart > 4200) this.endGame("도파민 과부하");
    if (this.lives <= 0) this.endGame("라이프 소진");
  }

  fireShot() {
    this.shots.push({ x: this.player.x + 18, y: this.player.y, vx: 8.2, r: this.dopamine > 70 ? 8 : 5, beam: false });
    this.dopamine = constrain(this.dopamine + 0.8, 0, 120);
  }

  useSkill() {
    if (this.skillCooldown > 0) {
      this.resultText = "기술 재사용 대기 중";
      return;
    }

    if (this.dopamine >= this.skillBThreshold) {
      this.useReceptorBeam();
      return;
    }

    if (this.dopamine >= this.skillAThreshold) {
      this.useReuptakePulse();
      return;
    }

    this.resultText = `도파민 ${this.skillAThreshold} 이상부터 기술 사용 가능`;
  }

  useReuptakePulse() {
    this.dopamine = constrain(this.dopamine - this.skillACost, 0, 120);
    this.bullets = this.bullets.filter((b) => dist(this.player.x, this.player.y, b.x, b.y) > 160);
    for (const enemy of this.enemies) {
      if (dist(this.player.x, this.player.y, enemy.x, enemy.y) < 175) {
        enemy.hp -= enemy.type === "blocker" ? 1 : 2;
        enemy.speed *= 0.55;
      }
    }
    this.skillCooldown = 110;
    this.skillFlash = 26;
    this.resultText = `A기술 재흡수 펄스 발동: 도파민 -${this.skillACost}`;
  }

  useReceptorBeam() {
    this.dopamine = constrain(this.dopamine - this.skillBCost, 0, 120);
    this.shots.push({ x: this.player.x + 22, y: this.player.y, vx: 16, r: 17, beam: true });
    this.skillCooldown = 145;
    this.skillFlash = 34;
    this.resultText = `B기술 수용체 빔 발동: 도파민 -${this.skillBCost}`;
  }

  spawnEnemy() {
    const roll = random();
    const type = roll < 0.55 ? "stim" : roll < 0.75 ? "stress" : roll < 0.9 ? "addict" : "blocker";
    this.enemies.push({
      x: this.w + 40,
      y: random(120, this.h - 70),
      r: type === "addict" ? 25 : 19,
      hp: type === "addict" ? 3 : 2,
      speed: random(2.0, 3.7) + this.dopamine / 100,
      type
    });
  }

  handleCollisions() {
    for (const gate of this.gates) {
      if (dist(this.player.x, this.player.y, gate.x, gate.y) < gate.r + this.player.r) {
        this.dopamine = lerp(this.dopamine, 55, 0.55);
        gate.x = -100;
        this.resultText = "수용체 게이트 통과: 도파민 안정화";
      }
    }

    for (const s of this.shots) {
      for (const enemy of this.enemies) {
        if (dist(s.x, s.y, enemy.x, enemy.y) < s.r + enemy.r) {
          enemy.hp -= s.beam ? 4 : 1;
          if (!s.beam) s.x = this.w + 100;
        }
      }
    }

    const defeated = this.enemies.filter((enemy) => enemy.hp <= 0);
    for (const enemy of defeated) {
      this.score += enemy.type === "addict" ? 80 : 40;
      if (enemy.type === "stress") this.dopamine = constrain(this.dopamine - 8, 0, 120);
      else this.dopamine = constrain(this.dopamine + (enemy.type === "stim" ? 5 : 8), 0, 120);
    }
    this.enemies = this.enemies.filter((enemy) => enemy.hp > 0 && enemy.x > -60);

    for (const enemy of this.enemies) {
      if (dist(this.player.x, this.player.y, enemy.x, enemy.y) < this.player.r + enemy.r) {
        this.takeHit();
        enemy.x = -80;
      }
    }
    for (const b of this.bullets) {
      if (dist(this.player.x, this.player.y, b.x, b.y) < this.player.r + 5) {
        this.takeHit();
        b.x = -100;
      }
    }
  }

  takeHit() {
    if (this.player.shield > 0) {
      this.player.shield--;
      return;
    }
    this.lives--;
    this.dopamine = constrain(this.dopamine + 10, 0, 120);
  }

  endGame(text) {
    this.gameOver = true;
    this.resultText = text;
  }

  drawStars() {
    stroke("#1f2c37");
    for (let i = 0; i < 42; i++) {
      const x = (i * 137 - frameCount * 1.4) % this.w;
      point((x + this.w) % this.w, 105 + (i * 61) % (this.h - 130));
    }
    noStroke();
  }

  drawGame() {
    fill("#7be0b7");
    triangle(this.player.x - 18, this.player.y - 16, this.player.x - 18, this.player.y + 16, this.player.x + 24, this.player.y);
    fill("#e9fff4");
    circle(this.player.x - 4, this.player.y, 8);

    for (const gate of this.gates) {
      noFill();
      stroke("#7be0b7");
      strokeWeight(4);
      circle(gate.x, gate.y, gate.r * 2);
      noStroke();
    }

    for (const s of this.shots) {
      fill(s.beam ? "#ffd166" : "#f06c86");
      ellipse(s.x, s.y, s.beam ? 72 : 18, s.beam ? 12 : 8);
    }

    for (const enemy of this.enemies) {
      fill(this.enemyColor(enemy.type));
      circle(enemy.x, enemy.y, enemy.r * 2);
      fill("#101419");
      textAlign(CENTER, CENTER);
      textSize(12);
      text(this.enemyLabel(enemy.type), enemy.x, enemy.y);
    }

    fill("#ffc857");
    for (const b of this.bullets) circle(b.x, b.y, 8);

    if (this.skillFlash > 0) {
      noFill();
      stroke(this.dopamine >= this.skillAThreshold ? "#7be0b7" : "#ffd166");
      strokeWeight(2);
      circle(this.player.x, this.player.y, 320 - this.skillFlash * 3);
      noStroke();
    }
  }

  enemyColor(type) {
    if (type === "stress") return "#77a8ff";
    if (type === "addict") return "#ff7b54";
    if (type === "blocker") return "#b48cff";
    return "#f06c86";
  }

  enemyLabel(type) {
    if (type === "stress") return "-";
    if (type === "addict") return "중";
    if (type === "blocker") return "방";
    return "+";
  }

  drawHud() {
    fill("#f8e7a2");
    textAlign(LEFT, CENTER);
    textSize(27);
    text("횡스크롤 슈팅게임", 28, 32);
    fill("#dfe8e2");
    textSize(14);
    text("WASD/방향키 이동, Space 공격, Shift/X 기술 사용", 28, 63);
    this.drawMeter(615, 28, 280, this.dopamine);
    this.drawSkillState(615, 80);
    fill("#eef4ee");
    textAlign(RIGHT, CENTER);
    textSize(16);
    const remain = max(0, 90 - floor((millis() - this.startedAt) / 1000));
    text(`라이프 ${this.lives}  점수 ${this.score}  남은 ${remain}s`, this.w - 28, 76);
    textAlign(CENTER, CENTER);
    text(this.resultText, this.w / 2, this.h - 22);
  }

  drawMeter(x, y, w, value) {
    fill("#24313b");
    rect(x, y, w, 18, 6);
    fill(value < 31 ? "#69a8ff" : value < 71 ? "#63d6a6" : value < 101 ? "#ffbd5a" : "#ff5d73");
    rect(x, y, constrain(map(value, 0, 120, 0, w), 0, w), 18, 6);
    fill("#eef4ee");
    textAlign(LEFT, CENTER);
    textSize(14);
    text(`도파민 ${round(value)}`, x, y + 35);
  }

  drawSkillState(x, y) {
    const readyText = this.skillCooldown > 0 ? `대기 ${ceil(this.skillCooldown / 60)}초` : this.nextSkillName();
    fill("#17222b");
    rect(x, y, 280, 34, 6);
    fill(this.skillCooldown > 0 ? "#99a4aa" : "#f8e7a2");
    textAlign(LEFT, CENTER);
    textSize(13);
    text(`기술: ${readyText}`, x + 12, y + 17);
  }

  nextSkillName() {
    if (this.dopamine >= this.skillBThreshold) return `B 수용체 빔 사용 가능 (${this.skillBCost} 소모)`;
    if (this.dopamine >= this.skillAThreshold) return `A 재흡수 펄스 사용 가능 (${this.skillACost} 소모)`;
    return `도파민 ${this.skillAThreshold} 필요`;
  }

  drawEnd() {
    fill(0, 175);
    rect(0, 0, this.w, this.h);
    fill("#f8e7a2");
    textAlign(CENTER, CENTER);
    textSize(42);
    text(this.resultText, this.w / 2, 255);
    fill("#eef4ee");
    textSize(22);
    text(`최종 도파민 ${round(this.dopamine)} / 점수 ${this.score}`, this.w / 2, 315);
    text("클릭 또는 Enter 키로 스토리 복귀", this.w / 2, 370);
  }

  getDopamine() {
    return this.dopamine;
  }
}

window.SideShooterGame = SideShooterGame;
