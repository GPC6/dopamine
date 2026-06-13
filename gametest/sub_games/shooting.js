class SideShooterGame {
  constructor(initialDopamine, options = {}, minigameAssets = {}) {
    this.assets = minigameAssets || {};
    this.w = 980;
    this.h = 620;
    this.maxDopamine = 100;
    this.durationSeconds = this.parseDurationSeconds(options.durationSeconds || options.maxDuration || options.maxSeconds);
    this.difficulty = this.parseDifficulty(options.difficulty);
    this.enemyKillDopamine = 3;
    this.powerDropChance = 0.32;
    this.stimItemDopamine = 8;
    this.calmItemDopamine = -8;
    this.autoFireInterval = 5;
    this.dopamineUpColor = "#ff5d73";
    this.dopamineDownColor = "#7be0b7";
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
    this.player = { x: 110, y: this.h / 2, r: 18 };
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
    this.resultText = "마우스로 이동 / 좌클릭 홀드 공격";
    this.autoFireCooldown = 0;
    this.floatTexts = [];
    this.hitFlash = 0;
    this.invincibleFrames = 0;
    this.doubleShotActive = false;
    this.doubleShotCollected = false;
    this.finished = false;
  }

  update() {
    if (!this.gameOver) this.updateGame();
  }

  draw() {
    this.setCursorHidden(true);
    push();
    translate((width - this.w) / 2, (height - this.h) / 2);
    background("#0e151c");
    this.drawImageTopLeft(this.assets.background, 0, 0, this.w, this.h, 125);
    this.drawStars();
    this.drawGame();
    this.drawHud();
    if (this.gameOver) this.drawEnd();
    pop();
    this.drawShooterCursor();
  }

  drawShooterCursor() {
    push();
    noStroke();
    fill("#ff2f4f");
    ellipse(mouseX, mouseY, 9, 9);
    noFill();
    stroke(255, 47, 79, 160);
    strokeWeight(2);
    ellipse(mouseX, mouseY, 18, 18);
    pop();
  }

  setCursorHidden(hidden) {
    if (typeof document === "undefined" || !document.body) return;
    document.body.classList.toggle("hide-game-cursor", hidden);
  }

  cleanup() {
    this.setCursorHidden(false);
  }

  drawImageTopLeft(img, x, y, w, h, alpha = 255) {
    if (!img) return false;
    push();
    imageMode(CORNER);
    if (alpha < 255) tint(255, alpha);
    image(img, x, y, w, h);
    pop();
    return true;
  }

  drawImageCentered(img, x, y, w, h, alpha = 255) {
    if (!img) return false;
    push();
    imageMode(CORNER);
    if (alpha < 255) tint(255, alpha);
    image(img, x - w / 2, y - h / 2, w, h);
    pop();
    return true;
  }

  mousePressed() {
    if (this.gameOver) {
      this.finished = true;
      return false;
    }

    this.fireShot();
    this.autoFireCooldown = this.autoFireInterval;
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

    this.hitFlash = Math.max(0, this.hitFlash - 1);
    this.invincibleFrames = Math.max(0, this.invincibleFrames - 1);
    this.updateFloatingTexts();
    this.updateAutoFire();

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
    return this.getDopamineProfile().playerSpeed;
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
    return this.getDopamineProfile().dopamineDecay;
  }

  getDopamineProfile() {
    if (this.dopamine < 35) {
      return {
        playerSpeed: 2.7,
        shotSpeedBonus: -1.2,
        enemySpeedBonus: -0.15,
        bulletIntervalBonus: 8,
        spawnPressure: 0,
        dopamineDecay: 0.04
      };
    }
    if (this.dopamine < 70) {
      return {
        playerSpeed: 4.1,
        shotSpeedBonus: 0,
        enemySpeedBonus: 0,
        bulletIntervalBonus: 0,
        spawnPressure: 0,
        dopamineDecay: 0.075
      };
    }
    if (this.dopamine < 90) {
      return {
        playerSpeed: 5.6,
        shotSpeedBonus: 1.4,
        enemySpeedBonus: 0.35,
        bulletIntervalBonus: -8,
        spawnPressure: 12,
        dopamineDecay: 0.11
      };
    }
    return {
      playerSpeed: 6.3,
      shotSpeedBonus: 2,
      enemySpeedBonus: 0.65,
      bulletIntervalBonus: -14,
      spawnPressure: 24,
      dopamineDecay: 0.15
    };
  }

  getSpawnInterval() {
    const difficultyPressure = this.getDifficultyLevel() * 12;
    return Math.max(64, 150 - difficultyPressure - this.getDopamineProfile().spawnPressure);
  }

  updateAutoFire() {
    if (!this.isHoldingPrimaryFire()) {
      this.autoFireCooldown = 0;
      return;
    }

    if (this.autoFireCooldown > 0) {
      this.autoFireCooldown--;
      return;
    }

    this.fireShot();
    this.autoFireCooldown = this.autoFireInterval;
  }

  isHoldingPrimaryFire() {
    return Boolean(
      typeof mouseIsPressed !== "undefined" &&
      mouseIsPressed &&
      (typeof mouseButton === "undefined" || mouseButton !== RIGHT)
    );
  }

  fireShot() {
    const originX = this.player.x + 18;
    const originY = this.player.y;
    if (this.doubleShotActive) {
      this.shots.push(this.createShot(originX, originY - 7, { vy: -0.45 }));
      this.shots.push(this.createShot(originX, originY + 7, { vy: 0.45 }));
      return;
    }

    this.shots.push(this.createShot(originX, originY));
  }

  createShot(x, y, options = {}) {
    return {
      x,
      y,
      vx: options.vx ?? 8.2 + this.getDopamineProfile().shotSpeedBonus,
      vy: options.vy ?? 0,
      r: options.r ?? 5,
      beam: false,
      kind: options.kind || "normal",
      owner: options.owner || "player",
      pierce: false,
      hitEnemyIds: []
    };
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
    if (type === "shooter") return { r: 20, hp: 2, speed: 2.35 };
    if (type === "tank") return { r: 24, hp: 4, speed: 1.55 };
    return { r: 18, hp: 1, speed: 2.55 };
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
    const collectedX = item.x;
    const collectedY = item.y;
    item.x = -100;

    if (item.type === "double") {
      if (!this.doubleShotCollected) {
        this.doubleShotActive = true;
        this.doubleShotCollected = true;
        this.resultText = "더블샷 캡슐: 발사체 2개 발사";
      }
      return;
    }

    if (item.type === "calm") {
      this.addDopamine(this.calmItemDopamine);
      this.addFloatingText(`${this.calmItemDopamine}`, collectedX, collectedY - 18, this.calmItemDopamine);
      this.resultText = `안정 캡슐: 도파민 ${this.calmItemDopamine}`;
      return;
    }

    this.addDopamine(this.stimItemDopamine);
    this.addFloatingText(`+${this.stimItemDopamine}`, collectedX, collectedY - 18, this.stimItemDopamine);
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
    this.addFloatingText(`+${this.enemyKillDopamine}`, enemy.x, enemy.y - enemy.r - 12, this.enemyKillDopamine);
    this.resultText = `${this.getEnemyRoleText(enemy.type)} 처치: 도파민 +${this.enemyKillDopamine}`;
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
    if (!this.doubleShotCollected && roll > 0.82) return "double";
    if (roll < 0.55) return "stim";
    return "calm";
  }

  takeHit() {
    if (this.isPlayerInvincible()) return;

    this.lives--;
    this.hitFlash = 32;
    this.invincibleFrames = 60;
    this.addDopamine(-10);
    this.addFloatingText("-10", this.player.x, this.player.y - 32, -10);
    if (this.lives <= 0) {
      this.endGame("라이프 소진: 현재 도파민으로 종료");
    }
  }

  isPlayerInvincible() {
    return this.invincibleFrames > 0;
  }

  getHitOverlayAlpha() {
    if (this.hitFlash <= 0) return 0;
    return 46 * (this.hitFlash / 32);
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

  getDopamineDeltaColor(amount) {
    return amount < 0 ? this.dopamineDownColor : this.dopamineUpColor;
  }

  addFloatingText(text, x, y, amount) {
    this.floatTexts.push({
      text,
      x,
      y,
      age: 0,
      duration: 42,
      color: this.getDopamineDeltaColor(amount)
    });
  }

  updateFloatingTexts() {
    for (const entry of this.floatTexts) {
      entry.age++;
      entry.y -= 0.45;
    }
    this.floatTexts = this.floatTexts.filter((entry) => entry.age < entry.duration);
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
    const playerImg = this.getPlayerAsset();
    if (!this.drawImageCentered(playerImg, this.player.x + 3, this.player.y, 64, 48)) {
      fill("#7be0b7");
      triangle(this.player.x - 18, this.player.y - 16, this.player.x - 18, this.player.y + 16, this.player.x + 24, this.player.y);
      fill("#e9fff4");
      circle(this.player.x - 4, this.player.y, 8);
    }
    this.drawHitEffect();

    for (const gate of this.gates) {
      if (!this.drawImageCentered(this.assets.receptorGate, gate.x, gate.y, gate.r * 2, gate.r * 2)) {
        noFill();
        stroke("#7be0b7");
        strokeWeight(4);
        circle(gate.x, gate.y, gate.r * 2);
        noStroke();
      }
    }

    for (const item of this.items) {
      const itemImg = this.getItemAsset(item.type);
      if (!this.drawImageCentered(itemImg, item.x, item.y, 32, 32)) {
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
    }

    for (const s of this.shots) {
      const shotImg = this.assets.shots && this.assets.shots.normal;
      const shotW = 24;
      const shotH = 12;
      if (!this.drawImageCentered(shotImg, s.x, s.y, shotW, shotH)) {
        fill(this.shotColor(s.kind));
        ellipse(s.x, s.y, 18, 8);
      }
    }

    for (const enemy of this.enemies) {
      this.drawEnemy(enemy);
    }

    fill("#ffc857");
    for (const b of this.bullets) {
      if (!this.drawImageCentered(this.assets.enemyBullet, b.x, b.y, 14, 14)) {
        circle(b.x, b.y, 8);
      }
    }

    this.drawFloatingTexts();
  }

  drawHitEffect() {
    if (this.hitFlash <= 0) return;
    const progress = this.hitFlash / 32;

    noFill();
    stroke("#ff5d73");
    strokeWeight(3);
    circle(this.player.x, this.player.y, 72 - progress * 18);
    noStroke();

    fill(255, 63, 87, this.getHitOverlayAlpha());
    rect(0, 0, this.w, this.h);
  }

  getPlayerAsset() {
    if (this.dopamine >= 85 && this.assets.player && this.assets.player.overdrive) {
      return this.assets.player.overdrive;
    }
    return this.assets.player && this.assets.player.base;
  }

  drawFloatingTexts() {
    for (const entry of this.floatTexts) {
      fill(entry.color);
      textAlign(CENTER, CENTER);
      textSize(15);
      text(entry.text, entry.x, entry.y);
    }
  }

  shotColor(kind) {
    return "#f06c86";
  }

  getItemAsset(type) {
    if (type === "double") {
      return (this.assets.upgrades && this.assets.upgrades.double) || (this.assets.items && this.assets.items.power);
    }
    return this.assets.items && this.assets.items[type];
  }

  itemColor(type) {
    if (type === "calm") return this.dopamineDownColor;
    if (type === "double") return "#ffd166";
    return this.dopamineUpColor;
  }

  itemLabel(type) {
    if (type === "calm") return "-";
    if (type === "double") return "2";
    return "+";
  }

  drawEnemy(enemy) {
    const x = enemy.x;
    const y = enemy.y;
    const enemyImg = this.assets.enemies && this.assets.enemies[enemy.type];
    if (enemyImg) {
      const size = this.getEnemyImageSize(enemy.type);
      this.drawImageCentered(enemyImg, x, y, size.w, size.h);
      return;
    }

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

  getEnemyImageSize(type) {
    if (type === "shooter") return { w: 64, h: 50 };
    if (type === "tank") return { w: 72, h: 56 };
    return { w: 48, h: 48 };
  }

  enemyColor(type) {
    if (type === "shooter") return "#ff7b8d";
    if (type === "tank") return "#d86c7f";
    return this.dopamineUpColor;
  }

  enemyLabel(type) {
    if (type === "shooter") return "탄+";
    if (type === "tank") return "방+";
    return "+3";
  }

  getEnemyRoleText(type) {
    if (type === "shooter") return "탄 적(+3)";
    if (type === "tank") return "방 적(+3)";
    return "자극 적(+3)";
  }

  drawHud() {
    this.drawImageTopLeft(this.assets.hudTopPanel, 0, 0, this.w, 102, 210);
    this.drawImageTopLeft(this.assets.messagePanel, 0, this.h - 48, this.w, 48, 210);

    fill("#f8e7a2");
    textAlign(LEFT, CENTER);
    textSize(27);
    text("뉴럴 사이드 슈터", 28, 32);
    fill("#dfe8e2");
    textSize(14);
    text("마우스로 이동, 좌클릭 홀드 공격", 28, 63);
    this.drawDopamineLegend(28, 88);
    this.drawMeter(615, 28, 280, this.dopamine);
    fill("#eef4ee");
    textAlign(RIGHT, CENTER);
    textSize(16);
    const remain = Math.max(0, this.durationSeconds - Math.floor((millis() - this.startedAt) / 1000));
    text(`라이프 ${this.lives}  남은 ${remain}s`, this.w - 28, 76);
    textAlign(CENTER, CENTER);
    text(this.resultText, this.w / 2, this.h - 22);
  }

  drawDopamineLegend(x, y) {
    textAlign(LEFT, CENTER);
    textSize(12);
    noStroke();

    fill(this.dopamineUpColor);
    rect(x, y - 8, 16, 16, 4);
    fill("#eef4ee");
    text("빨강: 도파민 상승", x + 22, y);

    fill(this.dopamineDownColor);
    rect(x + 150, y - 8, 16, 16, 4);
    fill("#eef4ee");
    text("초록: 도파민 감소", x + 172, y);
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
