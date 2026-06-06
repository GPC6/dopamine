class SideShooterGame {
  constructor(initialDopamine, options = {}) {
    this.w = 980;
    this.h = 620;
    this.maxDopamine = 100;
    this.durationSeconds = this.parseDurationSeconds(options.durationSeconds || options.maxDuration || options.maxSeconds);
    this.difficulty = this.parseDifficulty(options.difficulty);
    this.enemyKillDopamine = 1;
    this.powerDropChance = 0.22;
    this.stimItemDopamine = 8;
    this.calmItemDopamine = -10;
    this.absorbSkillDopamine = -25;
    this.speedUpgradeBonus = 1.8;
    this.speedUpgradeDecayBonus = 0.012;
    this.initialDopamine = this.clampDopamine(initialDopamine);
    this.finished = false;
    this.resetGame();
  }

  parseDurationSeconds(value) {
    if (!Number.isFinite(Number(value))) return 45;
    return Math.max(10, Math.min(120, Math.round(Number(value))));
  }

  parseDifficulty(value) {
    if (!Number.isFinite(Number(value))) return 0;
    return Math.max(0, Math.min(10, Math.round(Number(value))));
  }

  resetGame() {
    this.player = { x: 110, y: this.h / 2, r: 18, shield: 0 };
    this.shots = [];
    this.enemies = [];
    this.bullets = [];
    this.gates = [];
    this.items = [];
    this.dopamine = this.initialDopamine;
    this.lives = 3;
    this.startedAt = millis();
    this.spawnTimer = 0;
    this.nextEnemyId = 1;
    this.gameOver = false;
    this.resultText = "마우스로 이동 / 좌클릭 공격 / 우클릭 기술";
    this.skillFlash = 0;
    this.lastActivatedUpgrade = null;
    this.skillVisual = null;
    this.finished = false;
    this.powerLevel = 0;
    this.upgrades = {
      speed: false,
      double: false,
      absorb: false,
      laser: false,
      option: false,
      shield: false
    };
    this.optionDrone = null;
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
    if (this.gameOver) {
      this.finished = true;
      return false;
    }

    if (typeof mouseButton !== "undefined" && mouseButton === RIGHT) {
      this.useSkill();
      return false;
    }

    this.fireShot();
    return false;
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
    this.updateMouseMovement();
    const speedBoost = this.getPlayerSpeed();
    if (this.isKeyDown(UP_ARROW) || this.isKeyDown(87)) this.player.y -= speedBoost;
    if (this.isKeyDown(DOWN_ARROW) || this.isKeyDown(83)) this.player.y += speedBoost;
    if (this.isKeyDown(LEFT_ARROW) || this.isKeyDown(65)) this.player.x -= speedBoost * 0.75;
    if (this.isKeyDown(RIGHT_ARROW) || this.isKeyDown(68)) this.player.x += speedBoost * 0.75;
    this.player.x = constrain(this.player.x, 40, this.w - 80);
    this.player.y = constrain(this.player.y, 92, this.h - 45);
    this.updateOptionDrone();

    this.skillFlash = Math.max(0, this.skillFlash - 1);
    this.updateSkillVisual();

    this.spawnTimer--;
    if (this.spawnTimer <= 0) {
      this.spawnEnemyWave();
      if (random() < 0.04) this.spawnGate();
      this.spawnTimer = this.getSpawnInterval();
    }

    for (const s of this.shots) {
      s.x += s.vx;
      s.y += s.vy || 0;
    }
    this.shots = this.shots.filter((s) => s.x < this.w + 90 && s.y < this.h + 50 && s.y > 70);

    for (const gate of this.gates) gate.x -= 3.5;
    this.gates = this.gates.filter((gate) => gate.x > -40);

    for (const enemy of this.enemies) {
      enemy.x -= enemy.speed;
      if (enemy.pattern === "oscillate") {
        enemy.y = constrain(enemy.baseY + Math.sin(frameCount * 0.045 + enemy.phase) * 46, 120, this.h - 70);
      }
      if (enemy.x < -60) this.recycleEnemy(enemy);
    }
    this.updateEnemyBullets();

    for (const b of this.bullets) {
      b.x += b.vx;
      b.y += b.vy;
    }
    this.bullets = this.bullets.filter((b) => b.x > -30);

    this.updateItems();
    this.collectItems();
    this.handleCollisions();
    this.dopamine = this.clampDopamine(this.dopamine - this.getDopamineDecayPerFrame());

    const elapsed = (millis() - this.startedAt) / 1000;
    if (elapsed >= this.durationSeconds) {
      this.endGame(`${this.durationSeconds}초 생존 성공`);
      return;
    }

  }

  isKeyDown(code) {
    return typeof keyIsDown === "function" && keyIsDown(code);
  }

  getPlayerSpeed() {
    const speedUpgrade = this.upgrades && this.upgrades.speed ? this.speedUpgradeBonus : 0;
    return this.getDopamineProfile().playerSpeed + speedUpgrade;
  }

  updateMouseMovement() {
    const localMouseX = mouseX - (width - this.w) / 2;
    const localMouseY = mouseY - (height - this.h) / 2;
    const targetX = constrain(localMouseX, 40, this.w - 80);
    const targetY = constrain(localMouseY, 92, this.h - 45);
    const follow = 0.28;
    this.player.x = lerp(this.player.x, targetX, follow);
    this.player.y = lerp(this.player.y, targetY, follow);
  }

  getElapsedRatio() {
    const elapsed = Math.max(0, (millis() - this.startedAt) / 1000);
    return constrain(elapsed / this.durationSeconds, 0, 1);
  }

  getDifficultyLevel() {
    return Math.floor(this.getElapsedRatio() * 4);
  }

  getDopamineDecayPerFrame() {
    const speedDecay = this.upgrades && this.upgrades.speed ? this.speedUpgradeDecayBonus : 0;
    return this.getDopamineProfile().dopamineDecay + speedDecay;
  }

  getDopamineProfile() {
    if (this.dopamine < 35) {
      return {
        playerSpeed: 2.7,
        shotSpeedBonus: -1.2,
        enemySpeedBonus: -0.15,
        bulletIntervalBonus: 8,
        spawnPressure: 0,
        dopamineDecay: 0.006
      };
    }
    if (this.dopamine < 70) {
      return {
        playerSpeed: 4.1,
        shotSpeedBonus: 0,
        enemySpeedBonus: 0,
        bulletIntervalBonus: 0,
        spawnPressure: 0,
        dopamineDecay: 0.012
      };
    }
    if (this.dopamine < 90) {
      return {
        playerSpeed: 5.6,
        shotSpeedBonus: 1.4,
        enemySpeedBonus: 0.35,
        bulletIntervalBonus: -8,
        spawnPressure: 12,
        dopamineDecay: 0.028
      };
    }
    return {
      playerSpeed: 6.3,
      shotSpeedBonus: 2,
      enemySpeedBonus: 0.65,
      bulletIntervalBonus: -14,
      spawnPressure: 24,
      dopamineDecay: 0.045
    };
  }

  getSpawnInterval() {
    const difficultyPressure = this.getDifficultyLevel() * 12;
    return Math.max(78, 180 - difficultyPressure - this.getDopamineProfile().spawnPressure);
  }

  fireShot() {
    const originX = this.player.x + 18;
    const originY = this.player.y;

    if (this.upgrades.double) {
      this.shots.push(this.createShot(originX, originY - 7, { vy: -0.45 }));
      this.shots.push(this.createShot(originX, originY + 7, { vy: 0.45 }));
    } else {
      this.shots.push(this.createShot(originX, originY));
    }

    if (this.upgrades.option && this.optionDrone) {
      this.shots.push(this.createShot(this.optionDrone.x + 12, this.optionDrone.y, { owner: "option" }));
    }
  }

  createShot(x, y, options = {}) {
    const laser = Boolean(this.upgrades && this.upgrades.laser);
    return {
      x,
      y,
      vx: options.vx ?? (laser ? 13.5 : 8.2) + this.getDopamineProfile().shotSpeedBonus,
      vy: options.vy ?? 0,
      r: options.r ?? (laser ? 9 : 5),
      beam: laser,
      kind: options.kind || (laser ? "laser" : "normal"),
      owner: options.owner || "player",
      pierce: laser,
      hitEnemyIds: []
    };
  }

  useSkill() {
    const selectedUpgrade = this.getSelectedUpgrade();
    if (!selectedUpgrade) {
      this.resultText = "파워 캡슐을 획득해 기술을 선택";
      return;
    }

    if (selectedUpgrade.key === "absorb") {
      this.useAbsorbSkill(selectedUpgrade);
      return;
    }

    if (this.upgrades[selectedUpgrade.key]) {
      this.resultText = `${selectedUpgrade.name} 이미 보유 중`;
      return;
    }

    this.activateUpgrade(selectedUpgrade.key);
    this.powerLevel = 0;
    this.skillFlash = 24;
    this.lastActivatedUpgrade = selectedUpgrade.key;
    this.resultText = `${selectedUpgrade.name} 활성화`;
  }

  getUpgradeCatalog() {
    return [
      { key: "absorb", name: "흡수 필터", slot: 1 },
      { key: "double", name: "더블 샷", slot: 2 },
      { key: "speed", name: "속도 증가", slot: 3 },
      { key: "laser", name: "관통 레이저", slot: 4 },
      { key: "option", name: "보조 펫", slot: 5 },
      { key: "shield", name: "실드", slot: 6 }
    ];
  }

  getSelectedUpgrade() {
    if (this.powerLevel <= 0) return null;
    return this.getUpgradeCatalog()[this.powerLevel - 1] || null;
  }

  getNextUpgrade() {
    return this.getUpgradeCatalog().find((upgrade) => upgrade.key !== "absorb" && !this.upgrades[upgrade.key]) || null;
  }

  activateUpgrade(key) {
    this.upgrades[key] = true;
    if (key === "shield") this.player.shield = Math.min(4, this.player.shield + 2);
    if (key === "option") {
      this.optionDrone = { x: this.player.x - 42, y: this.player.y, trail: [] };
    }
    this.triggerSkillVisual(key);
  }

  useAbsorbSkill(upgrade) {
    this.addDopamine(this.absorbSkillDopamine);
    this.powerLevel = 0;
    this.skillFlash = 24;
    this.lastActivatedUpgrade = upgrade.key;
    this.triggerSkillVisual(upgrade.key);
    this.resultText = `${upgrade.name}: 도파민 ${this.absorbSkillDopamine}`;
  }

  triggerSkillVisual(key) {
    const colorMap = {
      speed: "#8ff7ff",
      absorb: "#7be0b7",
      double: "#ffd166",
      laser: "#f8e7a2",
      option: "#68a7ff",
      shield: "#b48cff"
    };
    this.skillVisual = {
      key,
      age: 0,
      duration: 34,
      color: colorMap[key] || "#f8e7a2"
    };
  }

  updateSkillVisual() {
    if (!this.skillVisual) return;
    this.skillVisual.age++;
    if (this.skillVisual.age >= this.skillVisual.duration) {
      this.skillVisual = null;
    }
  }

  advancePowerMeter() {
    this.powerLevel = Math.min(this.getUpgradeCatalog().length, this.powerLevel + 1);
  }

  updateOptionDrone() {
    if (!this.optionDrone) return;
    this.optionDrone.trail.push({ x: this.player.x, y: this.player.y });
    if (this.optionDrone.trail.length > 18) {
      const target = this.optionDrone.trail.shift();
      this.optionDrone.x = target.x - 42;
      this.optionDrone.y = target.y;
    }
  }

  getEnemyWaveTemplates() {
    return [
      {
        name: "droneLine",
        type: "drone",
        pattern: "line",
        members: [
          { dx: 0, dy: 0 },
          { dx: 48, dy: -18 },
          { dx: 96, dy: 18 },
          { dx: 144, dy: -18 },
          { dx: 192, dy: 0 }
        ]
      },
      {
        name: "shooterWedge",
        type: "shooter",
        pattern: "wedge",
        members: [
          { dx: 0, dy: 0 },
          { dx: 72, dy: -52 },
          { dx: 72, dy: 52 }
        ]
      },
      {
        name: "tankOscillate",
        type: "tank",
        pattern: "oscillate",
        members: [
          { dx: 0, dy: -42 },
          { dx: 92, dy: 42 }
        ]
      }
    ];
  }

  spawnEnemyWave() {
    const templates = this.getEnemyWaveTemplates();
    const template = templates[Math.floor(random(templates.length))];
    const baseY = random(150, this.h - 110);
    const waveId = `${template.name}-${millis()}-${this.enemies.length}`;

    const members = [...template.members];
    const extraCount = Math.min(template.type === "tank" ? 1 : 2, this.getDifficultyLevel());
    for (let i = 0; i < extraCount; i++) {
      members.push({
        dx: 230 + i * 50,
        dy: i % 2 === 0 ? -34 : 34
      });
    }

    for (const member of members) {
      this.enemies.push(this.createEnemy({
        x: this.w + 60 + member.dx,
        y: constrain(baseY + member.dy, 120, this.h - 70),
        type: template.type,
        waveId,
        pattern: template.pattern
      }));
    }
  }

  createEnemy(config) {
    const stats = this.enemyStats(config.type);
    return {
      id: this.nextEnemyId++,
      x: config.x,
      y: config.y,
      baseY: config.y,
      r: stats.r,
      hp: stats.hp + this.getEnemyHpBonus(config.type),
      speed: stats.speed + this.dopamine / 160 + this.getDifficultyLevel() * 0.18 + this.getDopamineProfile().enemySpeedBonus,
      type: config.type,
      waveId: config.waveId,
      pattern: config.pattern,
      phase: random(0, Math.PI * 2)
    };
  }

  enemyStats(type) {
    if (type === "shooter") return { r: 20, hp: 3, speed: 2.35 };
    if (type === "tank") return { r: 24, hp: 5, speed: 1.55 };
    return { r: 18, hp: 2, speed: 2.55 };
  }

  getEnemyHpBonus(type) {
    const baseBonus = this.difficulty + Math.floor(this.getElapsedRatio() * 3);
    return type === "tank" ? baseBonus + Math.floor(this.getElapsedRatio() * 2) : baseBonus;
  }

  recycleEnemy(enemy) {
    enemy.x = this.w + random(60, 180);
    enemy.y = constrain(enemy.baseY + random(-35, 35), 120, this.h - 70);
  }

  spawnGate() {
    this.gates.push({ x: this.w + 20, y: random(120, this.h - 70), r: 28 });
  }

  updateEnemyBullets() {
    const interval = Math.max(48, 82 - this.getDifficultyLevel() * 4 + this.getDopamineProfile().bulletIntervalBonus);
    if (frameCount % interval !== 0) return;
    for (const enemy of this.enemies) {
      if (enemy.type !== "shooter") continue;
      this.bullets.push({ x: enemy.x - 12, y: enemy.y, vx: -4.2, vy: random(-1.2, 1.2) });
    }
  }

  updateItems() {
    for (const item of this.items) item.x += item.vx;
    this.items = this.items.filter((item) => item.x > -30);
  }

  collectItems() {
    for (const item of this.items) {
      if (dist(this.player.x, this.player.y, item.x, item.y) < this.player.r + item.r) {
        this.collectItem(item);
      }
    }
  }

  collectItem(item) {
    item.x = -100;
    if (item.type === "power") {
      this.advancePowerMeter();
      const selected = this.getSelectedUpgrade();
      this.resultText = selected ? `파워 캡슐: ${selected.name} 선택 가능` : "파워 캡슐 획득";
      return;
    }
    if (item.type === "calm") {
      this.addDopamine(this.calmItemDopamine);
      this.resultText = `안정 캡슐: 도파민 ${this.calmItemDopamine}`;
      return;
    }
    this.addDopamine(this.stimItemDopamine);
    this.resultText = `자극 캡슐: 도파민 +${this.stimItemDopamine}`;
  }

  handleCollisions() {
    for (const gate of this.gates) {
      if (dist(this.player.x, this.player.y, gate.x, gate.y) < gate.r + this.player.r) {
        this.dopamine = this.clampDopamine(lerp(this.dopamine, 55, 0.55));
        gate.x = -100;
        this.resultText = "수용체 게이트 통과: 도파민 안정화";
      }
    }

    for (const s of this.shots) {
      for (const enemy of this.enemies) {
        if (dist(s.x, s.y, enemy.x, enemy.y) < s.r + enemy.r) {
          const enemyId = this.ensureEnemyId(enemy);
          if (s.pierce && s.hitEnemyIds.includes(enemyId)) continue;
          if (s.pierce) s.hitEnemyIds.push(enemyId);
          enemy.hp -= s.beam ? 2 : 1;
          if (!s.pierce) s.x = this.w + 100;
        }
      }
    }

    const defeated = this.enemies.filter((enemy) => enemy.hp <= 0);
    for (const enemy of defeated) {
      this.handleEnemyDefeat(enemy);
    }
    this.enemies = this.enemies.filter((enemy) => enemy.hp > 0);

    for (const enemy of this.enemies) {
      if (dist(this.player.x, this.player.y, enemy.x, enemy.y) < this.player.r + enemy.r) {
        this.takeHit();
        this.recycleEnemy(enemy);
      }
    }
    for (const b of this.bullets) {
      if (dist(this.player.x, this.player.y, b.x, b.y) < this.player.r + 5) {
        this.takeHit();
        b.x = -100;
      }
    }
  }

  handleEnemyDefeat(enemy) {
    this.addDopamine(this.enemyKillDopamine);
    if (random() < this.powerDropChance) {
      this.items.push({ x: enemy.x, y: enemy.y, r: 13, vx: -2.8, type: this.randomItemType() });
    }
  }

  ensureEnemyId(enemy) {
    if (enemy.id === undefined || enemy.id === null) enemy.id = this.nextEnemyId++;
    return enemy.id;
  }

  randomItemType() {
    const roll = random();
    if (roll < 0.7) return "power";
    if (roll < 0.85) return "calm";
    return "stim";
  }

  takeHit() {
    if (this.player.shield > 0) {
      this.player.shield--;
      return;
    }
    this.lives--;
    this.addDopamine(10);
    if (this.lives <= 0) {
      this.endGame("라이프 소진: 현재 도파민으로 종료");
    }
  }

  endGame(text) {
    this.gameOver = true;
    this.resultText = text;
  }

  clampDopamine(value) {
    if (!Number.isFinite(Number(value))) return 50;
    return Math.max(0, Math.min(this.maxDopamine, Number(value)));
  }

  addDopamine(amount) {
    this.dopamine = this.clampDopamine(this.dopamine + amount);
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
    this.drawSkillVisual();

    if (this.player.shield > 0) {
      noFill();
      stroke("#68a7ff");
      strokeWeight(2);
      circle(this.player.x, this.player.y, 56);
      noStroke();
    }

    if (this.optionDrone) {
      fill("#68a7ff");
      circle(this.optionDrone.x, this.optionDrone.y, 16);
    }

    for (const gate of this.gates) {
      noFill();
      stroke("#7be0b7");
      strokeWeight(4);
      circle(gate.x, gate.y, gate.r * 2);
      noStroke();
    }

    for (const item of this.items) {
      fill(this.itemColor(item.type));
      stroke("#f6f1df");
      strokeWeight(2);
      circle(item.x, item.y, item.r * 2);
      noStroke();
      fill("#111820");
      textAlign(CENTER, CENTER);
      textSize(10);
      text(this.itemLabel(item.type), item.x, item.y);
    }

    for (const s of this.shots) {
      fill(this.shotColor(s.kind));
      if (s.kind === "laser") ellipse(s.x, s.y, 58, 8);
      else ellipse(s.x, s.y, 18, 8);
    }

    for (const enemy of this.enemies) {
      this.drawEnemy(enemy);
    }

    fill("#ffc857");
    for (const b of this.bullets) circle(b.x, b.y, 8);

  }

  drawSkillVisual() {
    if (!this.skillVisual) return;
    const progress = this.skillVisual.age / this.skillVisual.duration;
    noFill();
    stroke(this.skillVisual.color);
    strokeWeight(3);

    if (this.skillVisual.key === "absorb") {
      const radius = 74 - progress * 34;
      circle(this.player.x, this.player.y, radius);
      circle(this.player.x, this.player.y, radius * 0.62);
    } else if (this.skillVisual.key === "speed") {
      const length = 42 + progress * 20;
      line(this.player.x - 26, this.player.y - 12, this.player.x - length, this.player.y - 22);
      line(this.player.x - 30, this.player.y, this.player.x - length - 10, this.player.y);
      line(this.player.x - 26, this.player.y + 12, this.player.x - length, this.player.y + 22);
      circle(this.player.x, this.player.y, 44 + progress * 16);
    } else {
      circle(this.player.x, this.player.y, 42 + progress * 24);
    }

    noStroke();
  }

  shotColor(kind) {
    if (kind === "laser") return "#ffd166";
    return "#f06c86";
  }

  itemColor(type) {
    if (type === "calm") return "#7be0b7";
    if (type === "stim") return "#ff7ba6";
    return "#ffd166";
  }

  itemLabel(type) {
    if (type === "calm") return "-";
    if (type === "stim") return "+";
    return "P";
  }

  drawEnemy(enemy) {
    const x = enemy.x;
    const y = enemy.y;
    fill(this.enemyColor(enemy.type));
    stroke("#101419");
    strokeWeight(2);

    if (enemy.type === "tank") {
      rectMode(CENTER);
      rect(x, y, enemy.r * 2.2, enemy.r * 1.55, 5);
      rectMode(CORNER);
    } else if (enemy.type === "shooter") {
      circle(x, y, enemy.r * 2);
      rect(x - enemy.r - 14, y - 5, 22, 10, 3);
    } else {
      beginShape();
      vertex(x, y - enemy.r);
      vertex(x + enemy.r, y);
      vertex(x, y + enemy.r);
      vertex(x - enemy.r, y);
      endShape(CLOSE);
    }

    noStroke();
    fill("#101419");
    textAlign(CENTER, CENTER);
    textSize(12);
    text(this.enemyLabel(enemy.type), x, y);
  }

  enemyColor(type) {
    if (type === "shooter") return "#77a8ff";
    if (type === "tank") return "#b48cff";
    return "#f06c86";
  }

  enemyLabel(type) {
    if (type === "shooter") return "탄";
    if (type === "tank") return "방";
    return "+";
  }

  drawHud() {
    fill("#f8e7a2");
    textAlign(LEFT, CENTER);
    textSize(27);
    text("뉴럴 사이드 슈터", 28, 32);
    fill("#dfe8e2");
    textSize(14);
    text("마우스로 이동, 좌클릭 공격, 우클릭 기술", 28, 63);
    this.drawMeter(615, 28, 280, this.dopamine);
    this.drawPowerMeter(615, 78, 310);
    fill("#eef4ee");
    textAlign(RIGHT, CENTER);
    textSize(16);
    const remain = Math.max(0, this.durationSeconds - Math.floor((millis() - this.startedAt) / 1000));
    text(`라이프 ${this.lives}  남은 ${remain}s`, this.w - 28, 76);
    textAlign(CENTER, CENTER);
    text(this.resultText, this.w / 2, this.h - 22);
  }

  drawMeter(x, y, w, value) {
    fill("#24313b");
    rect(x, y, w, 18, 6);
    fill(this.getDopamineZoneColor(value));
    rect(x, y, constrain(map(value, 0, this.maxDopamine, 0, w), 0, w), 18, 6);

    fill("#eef4ee");
    textAlign(LEFT, CENTER);
    textSize(14);
    text(`도파민 ${Math.round(value)}`, x, y + 35);
  }

  getDopamineZoneColor(value) {
    if (value < 20) return "#69a8ff";
    if (value < 50) return "#63d6a6";
    if (value < 80) return "#ffbd5a";
    return "#ff5d73";
  }

  drawPowerMeter(x, y, w) {
    const upgrades = this.getUpgradeCatalog();
    const cellW = w / upgrades.length;
    fill("#17222b");
    rect(x, y, w, 58, 6);

    for (let i = 0; i < upgrades.length; i++) {
      const upgrade = upgrades[i];
      const cellX = x + i * cellW;
      const selected = this.powerLevel === i + 1;
      const activatedFlash = this.skillFlash > 0 && this.lastActivatedUpgrade === upgrade.key;
      fill(this.upgrades[upgrade.key] ? "#7be0b7" : selected ? "#ffd166" : "#2a3843");
      rect(cellX + 4, y + 8, cellW - 8, 20, 4);
      if (activatedFlash) {
        noFill();
        stroke("#f8e7a2");
        strokeWeight(2);
        rect(cellX + 2, y + 6, cellW - 4, 24, 5);
        noStroke();
      }
      fill("#111820");
      textAlign(CENTER, CENTER);
      textSize(10);
      text(upgrade.name.slice(0, 2), cellX + cellW / 2, y + 18);
    }

    const selected = this.getSelectedUpgrade();
    fill("#f8e7a2");
    textAlign(LEFT, CENTER);
    textSize(13);
    text(`POWER ${this.powerLevel}/${upgrades.length}  선택: ${selected ? selected.name : "없음"}`, x + 12, y + 42);
    fill("#dfe8e2");
    textAlign(RIGHT, CENTER);
    text(`보유 ${this.getActiveUpgradeLabels().length}`, x + w - 12, y + 42);
  }

  getActiveUpgradeLabels() {
    return this.getUpgradeCatalog()
      .filter((upgrade) => this.upgrades[upgrade.key])
      .map((upgrade) => upgrade.name);
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
    text(`최종 도파민 ${Math.round(this.dopamine)}`, this.w / 2, 315);
    text("클릭 또는 Enter 키로 스토리 복귀", this.w / 2, 370);
  }

  getDopamine() {
    return this.clampDopamine(this.dopamine);
  }
}

window.SideShooterGame = SideShooterGame;
