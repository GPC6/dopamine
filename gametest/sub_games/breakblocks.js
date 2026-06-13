class BrickBreakerGame {
  constructor(initialDopamine, options = {}, minigameAssets = {}) {
    this.assets = minigameAssets || {};
    this.w = 980;
    this.h = 640;
    this.cols = 9;
    this.cell = 76;
    this.top = 140;
    this.left = 138;
    this.floor = 560;
    this.wallTop = this.top - 18;
    this.wallLeft = this.left - 14;
    this.wallRight = this.left + (this.cols - 1) * this.cell + 74;
    this.ballLaunchGap = 8;
    this.ballRadius = 6;
    this.speedUpAfterFrames = this.parsePacingFrames(options.speedUpAfterSeconds, 10);
    this.forceDropAfterFrames = this.parsePacingFrames(options.forceDropAfterSeconds, 15);
    this.offsetX = 0;
    this.offsetY = 0;
    this.maxDopamine = 100;
    this.stimAmount = 1;
    this.recoverAmount = 1;
    this.maxTurns = this.parseMaxTurns(options.maxTurns);
    this.initialDopamine = this.clampDopamine(initialDopamine);
    this.finished = false;
    this.resetGame();
  }

  parseMaxTurns(value) {
    if (!Number.isFinite(Number(value))) return 6;
    return Math.max(1, Math.min(20, Math.round(Number(value))));
  }

  parsePacingFrames(value, fallbackSeconds) {
    const seconds = Number.isFinite(Number(value)) ? Number(value) : fallbackSeconds;
    return Math.max(1, Math.round(seconds * 60));
  }

  resetGame() {
    this.dopamine = this.initialDopamine;
    this.turn = 1;
    this.balls = [];
    this.bricks = [];
    this.items = [];
    this.aiming = true;
    this.message = `목표: ${this.maxTurns}턴 동안 도파민을 안정 구간에 가깝게 유지`;
    this.gameOver = false;
    this.settleTimer = 0;
    this.finished = false;
    this.launchX = this.w / 2;
    this.launchY = this.floor - 18;
    this.nextLaunchX = null;
    this.nextLaunchCaptured = false;
    this.effectFlash = 0;
    this.resetTurnPacing();
    this.resetTurnBuff();

    for (let r = 0; r < 3; r++) this.addBrickRow(r);
  }

  resetTurnBuff() {
    this.turnBuff = {
      power: 1,
      ballColor: "#f6f1df",
      brickTint: null,
      assetKey: null,
      name: "기본"
    };
  }

  resetTurnPacing() {
    this.turnElapsedFrames = 0;
    this.turnSpeedMultiplier = 1;
    this.turnDropForced = false;
  }

  updateTurnPacing() {
    if (this.aiming || !this.balls.some((ball) => ball.alive)) return;

    this.turnElapsedFrames++;
    if (this.turnElapsedFrames >= this.speedUpAfterFrames) {
      if (this.turnSpeedMultiplier !== 2) {
        this.message = "턴이 길어져 게임속도 2배";
      }
      this.turnSpeedMultiplier = 2;
    }
    if (!this.turnDropForced && this.turnElapsedFrames >= this.forceDropAfterFrames) {
      this.forceDropBalls();
    }
  }

  forceDropBalls() {
    let forced = false;
    for (const ball of this.balls) {
      if (!ball.alive) continue;
      ball.launchDelay = 0;
      ball.active = true;
      ball.sliding = false;
      ball.forceDropping = true;
      ball.piercingBrick = null;
      ball.vx = 0;
      ball.vy = Math.max(14, Math.abs(ball.vy));
      forced = true;
    }
    if (forced) {
      this.turnDropForced = true;
      this.message = "15초 경과: 공을 자동 낙하시킴";
    }
  }

  update() {
    if (!this.gameOver) {
      this.updateTurnPacing();
      const physicsSteps = this.turnSpeedMultiplier;
      for (let i = 0; i < physicsSteps; i++) {
        this.updateBalls();
        if (!this.balls.some((ball) => ball.alive)) break;
      }
      this.checkTurnEnd();
    }
    if (this.effectFlash > 0) this.effectFlash--;
  }

  draw() {
    this.offsetX = (width - this.w) / 2;
    this.offsetY = (height - this.h) / 2;

    push();
    translate(this.offsetX, this.offsetY);
    background("#111820");
    this.drawImageTopLeft(this.assets.background, 0, 0, this.w, this.h);
    this.drawHeader();
    this.drawBoard();
    this.drawAim();
    this.drawOverlay();
    pop();
  }

  drawImageTopLeft(img, x, y, w, h) {
    if (!img) return false;
    push();
    imageMode(CORNER);
    image(img, x, y, w, h);
    pop();
    return true;
  }

  drawImageCentered(img, x, y, w, h) {
    if (!img) return false;
    push();
    imageMode(CORNER);
    image(img, x - w / 2, y - h / 2, w, h);
    pop();
    return true;
  }

  mousePressed() {
    if (this.gameOver) {
      this.finished = true;
      return;
    }
    if (!this.aiming) return;

    const localMouseX = mouseX - this.offsetX;
    const localMouseY = mouseY - this.offsetY;
    const origin = createVector(this.launchX, this.launchY);
    const target = createVector(localMouseX, localMouseY);
    const dir = p5.Vector.sub(target, origin);
    if (dir.y > -20) return;
    dir.normalize();

    const count = this.getBallCount();
    this.resetTurnBuff();
    this.resetTurnPacing();
    this.nextLaunchX = null;
    this.nextLaunchCaptured = false;
    this.balls = [];
    for (let i = 0; i < count; i++) {
      this.balls.push({
        x: origin.x,
        y: origin.y,
        vx: dir.x * 8.6,
        vy: dir.y * 8.6,
        launchDelay: i * this.ballLaunchGap,
        active: i === 0,
        alive: true,
        pierceHits: 0,
        piercingBrick: null
      });
    }
    this.aiming = false;
    this.message = `${count}개 발사 / 빨강은 상승, 초록은 맞을 때마다 감소`;
  }

  keyPressed() {
    if (this.gameOver && (key === "r" || key === "R" || keyCode === ENTER)) {
      this.finished = true;
    }
  }

  getBallCount() {
    return Math.max(1, Math.min(10, Math.floor(this.dopamine / 5)));
  }

  addBrickRow(rowIndex = 0) {
    const openCol = Math.floor(random(this.cols));

    for (let c = 0; c < this.cols; c++) {
      if (c !== openCol) this.addBrick(c, rowIndex);
    }
  }

  addBrick(col, rowIndex) {
    const kind = this.getBrickKind();
    this.bricks.push({
      c: col,
      r: rowIndex,
      hp: this.getBrickHp(kind),
      kind
    });
  }

  getBrickKind() {
    if (random() < this.getNormalChance()) return "normal";
    return random() < this.getStimChance() ? "stim" : "recover";
  }

  getNormalChance() {
    return 0.25;
  }

  getStimChance() {
    if (this.dopamine < 40) return 0.84;
    if (this.dopamine > 80) return 0.45;
    if (this.dopamine > 65) return 0.65;
    return 0.82;
  }

  getBrickHp(kind) {
    const turnBonus = this.getTurnHpBonus();
    if (kind === "normal") return this.getNormalBrickHp() + turnBonus;
    if (kind === "stim") return this.randomInt(1, 3) + turnBonus;
    const baseHp = this.dopamine > 80 ? this.randomInt(5, 8) : this.randomInt(4, 7);
    return baseHp + turnBonus;
  }

  getNormalBrickHp() {
    let hp = this.randomInt(2, 4);
    if (this.dopamine > 80) hp++;
    if (this.dopamine < 45) hp--;
    return Math.max(1, hp);
  }

  getTurnHpBonus() {
    return Math.min(2, Math.floor((this.turn - 1) / 3));
  }

  tryAddItem(col, rowIndex) {
    return false;
  }

  randomInt(min, max) {
    return Math.floor(random(min, max));
  }

  updateBalls() {
    for (const ball of this.balls) {
      if (!ball.alive) continue;
      if (ball.launchDelay > 0) {
        ball.launchDelay--;
        continue;
      }
      ball.active = true;
      if (ball.sliding) {
        this.updateSlidingBall(ball);
        continue;
      }
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.x < this.wallLeft || ball.x > this.wallRight) ball.vx *= -1;
      if (ball.y < this.wallTop) ball.vy *= -1;
      if (ball.y > this.floor) {
        this.handleBallFloorTouch(ball);
        continue;
      }
      if (ball.forceDropping) continue;

      this.hitBricks(ball);
    }

    this.bricks = this.bricks.filter((brick) => brick.hp > 0);
  }

  updateSlidingBall(ball) {
    const targetX = this.nextLaunchX ?? this.launchX;
    const distance = targetX - ball.x;
    const step = Math.sign(distance) * Math.min(Math.abs(distance), 10);
    ball.x += step;
    ball.y = this.launchY;
    if (Math.abs(targetX - ball.x) <= 0.5) {
      ball.alive = false;
    }
  }

  handleBallFloorTouch(ball) {
    ball.y = this.launchY;
    if (!this.nextLaunchCaptured) {
      this.captureNextLaunchX(ball.x);
      ball.alive = false;
      return;
    }

    ball.sliding = true;
    ball.vx = 0;
    ball.vy = 0;
  }

  captureNextLaunchX(x) {
    if (this.nextLaunchCaptured) return;
    this.nextLaunchX = Math.max(this.wallLeft + 24, Math.min(this.wallRight - 24, x));
    this.nextLaunchCaptured = true;
  }

  hitBricks(ball) {
    if (ball.piercingBrick && !this.isBallTouchingBrick(ball, ball.piercingBrick)) {
      ball.piercingBrick = null;
    }

    for (const brick of this.bricks) {
      if (brick === ball.piercingBrick) continue;

      const bx = this.getCellX(brick.c);
      const by = this.getCellY(brick.r);
      const collision = this.getCircleRectCollision(ball, bx, by, 60, 38);
      if (collision) {
        if ((ball.pierceHits || 0) > 0) {
          ball.pierceHits--;
          ball.piercingBrick = brick;
          this.hitBrick(brick);
          break;
        }

        this.resolveBrickCollision(ball, collision);
        this.hitBrick(brick);
        break;
      }
    }
  }

  isBallTouchingBrick(ball, brick) {
    return Boolean(
      this.getCircleRectCollision(ball, this.getCellX(brick.c), this.getCellY(brick.r), 60, 38)
    );
  }

  getCircleRectCollision(ball, rectX, rectY, rectW, rectH) {
    const closestX = Math.max(rectX, Math.min(ball.x, rectX + rectW));
    const closestY = Math.max(rectY, Math.min(ball.y, rectY + rectH));
    const dx = ball.x - closestX;
    const dy = ball.y - closestY;
    const distanceSq = dx * dx + dy * dy;
    const radius = this.ballRadius;

    if (distanceSq > radius * radius) return null;

    if (distanceSq > 0) {
      const distance = Math.sqrt(distanceSq);
      return {
        nx: dx / distance,
        ny: dy / distance,
        overlap: radius - distance
      };
    }

    const left = Math.abs(ball.x - rectX);
    const right = Math.abs(rectX + rectW - ball.x);
    const top = Math.abs(ball.y - rectY);
    const bottom = Math.abs(rectY + rectH - ball.y);
    const minDepth = Math.min(left, right, top, bottom);

    if (minDepth === left) return { nx: -1, ny: 0, overlap: radius + left };
    if (minDepth === right) return { nx: 1, ny: 0, overlap: radius + right };
    if (minDepth === top) return { nx: 0, ny: -1, overlap: radius + top };
    return { nx: 0, ny: 1, overlap: radius + bottom };
  }

  resolveBrickCollision(ball, collision) {
    const pushOut = collision.overlap + 0.2;
    ball.x += collision.nx * pushOut;
    ball.y += collision.ny * pushOut;

    if (Math.abs(collision.nx) > Math.abs(collision.ny)) {
      ball.vx = Math.abs(ball.vx) * Math.sign(collision.nx || -ball.vx);
      return;
    }

    ball.vy = Math.abs(ball.vy) * Math.sign(collision.ny || -ball.vy);
  }

  hitBrick(brick) {
    this.playBrickHitSound();
    brick.hp -= this.turnBuff.power;
    if (brick.kind === "stim") {
      this.addDopamine(this.stimAmount);
    }
    if (brick.kind === "recover") {
      this.addDopamine(-this.recoverAmount);
    }
  }

  playBrickHitSound() {
    const sound = this.assets.sounds && this.assets.sounds.brickHit;
    if (!sound || typeof sound.play !== "function") return;
    if (typeof sound.isLoaded === "function" && !sound.isLoaded()) return;
    if (typeof sound.isPlaying === "function" && sound.isPlaying() && typeof sound.stop === "function") {
      sound.stop();
    }
    sound.play();
  }

  checkTurnEnd() {
    if (this.aiming || this.balls.some((ball) => ball.alive)) return;
    this.settleTimer++;
    if (this.settleTimer < 28) return;
    this.settleTimer = 0;
    this.turn++;

    this.launchX = this.nextLaunchX ?? this.launchX;
    this.nextLaunchX = null;
    this.nextLaunchCaptured = false;

    if (this.turn > this.maxTurns) {
      this.endGame(`${this.maxTurns}턴 생존 완료`);
      return;
    }

    this.resetTurnPacing();
    for (const brick of this.bricks) brick.r++;
    this.addBrickRow(0);
    if (this.bricks.some((brick) => this.getCellY(brick.r) + 38 > this.floor - 18)) {
      this.endGame("블럭이 내려와 현재 도파민으로 종료");
      return;
    }
    this.resetTurnBuff();
    this.aiming = true;
    this.message = "다음 턴: 현재 수치를 보고 목표 블럭을 선택";
  }

  endGame(message) {
    this.gameOver = true;
    this.message = message;
  }

  addDopamine(amount) {
    this.dopamine = this.clampDopamine(this.dopamine + amount);
  }

  clampDopamine(value) {
    if (!Number.isFinite(Number(value))) return 50;
    return Math.max(0, Math.min(this.maxDopamine, Number(value)));
  }

  getCellX(col) {
    return this.left + col * this.cell;
  }

  getCellY(row) {
    return this.top + row * 52;
  }

  drawHeader() {
    fill("#f8e7a2");
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(28);
    text("도파민 벽돌깨기", 120, 36);
    textSize(15);
    fill("#d9ddde");
    text("자극 블럭은 맞을 때 상승, 회복 블럭은 파괴될 때 감소", 120, 72);
    this.drawEffectLegend(120, 98);

    this.drawMeter(620, 28, 260, this.dopamine);
    fill("#f6f1df");
    textAlign(RIGHT, CENTER);
    textSize(17);
    text(`턴 ${Math.min(this.turn, this.maxTurns)}/${this.maxTurns}`, this.w - 34, 75);
    if (!this.aiming && this.turnSpeedMultiplier > 1) {
      fill("#ffcf66");
      textSize(15);
      text("2배속", this.w - 34, 100);
    }

  }

  drawEffectLegend(x, y) {
    textAlign(LEFT, CENTER);
    textSize(13);
    noStroke();
    fill("#f56f83");
    rect(x, y - 10, 18, 18, 5);
    fill("#f6f1df");
    text(`자극 +${this.stimAmount}`, x + 26, y);

    fill("#63c7a4");
    rect(x + 112, y - 10, 18, 18, 5);
    fill("#f6f1df");
    text(`완화 -${this.recoverAmount}`, x + 138, y);

    fill("#a8b2bf");
    rect(x + 232, y - 10, 18, 18, 5);
    fill("#f6f1df");
    text("일반 0", x + 258, y);
  }

  drawMeter(x, y, w, value) {
    const h = 22;
    const labelW = 82;
    const barX = x + labelW;
    const barY = y + 8;
    const barW = w - labelW;

    noStroke();
    fill("#2f2d5d");
    rect(x, y, w, 38, 4);

    fill("#f5f2ea");
    textAlign(LEFT, CENTER);
    textSize(15);
    text("도파민", x + 12, y + 19);

    fill("#25234f");
    rect(barX, barY, barW, h, 7);
    fill(this.getDopamineZoneColor(value));
    rect(barX, barY, Math.max(0, Math.min(barW, (value / this.maxDopamine) * barW)), h, 7);
    this.drawDopamineMilestoneMarks(barX, barY, barW, h);

    fill(this.getDopamineZoneColor(value));
    textAlign(RIGHT, CENTER);
    textSize(17);
    text(Math.round(value), x + labelW - 12, y + 19);
  }

  drawDopamineMilestoneMarks(x, y, w, h) {
    [50, 80].forEach((milestone) => {
      const markerX = x + (milestone / this.maxDopamine) * w;
      stroke(255, 255, 255, 190);
      strokeWeight(1.4);
      line(markerX, y - 4, markerX, y + h + 4);
      noStroke();

      fill(255, 255, 255, 188);
      textAlign(CENTER, CENTER);
      textSize(10);
      text(milestone, markerX, y + h + 14);
    });
  }

  getDopamineZoneColor(value) {
    if (value < 51) return "#70d7aa";
    if (value < 81) return "#ffd166";
    return "#ff5c93";
  }

  drawBoard() {
    this.drawPlayWalls();
    for (const brick of this.bricks) {
      const x = this.getCellX(brick.c);
      const y = this.getCellY(brick.r);
      const brickImg = this.assets.bricks && this.assets.bricks[brick.kind];
      if (!this.drawImageTopLeft(brickImg, x, y, 60, 38)) {
        fill(this.getBrickColor(brick.kind));
        rect(x, y, 60, 38, 6);
      }
      const tintImg = this.assets.brickTints && this.assets.brickTints[this.turnBuff.assetKey];
      if (!this.drawImageTopLeft(tintImg, x, y, 60, 38) && this.turnBuff.brickTint) {
        fill(this.turnBuff.brickTint + "55");
        rect(x, y, 60, 38, 6);
      }
      this.drawBrickHpLabel(Math.max(0, brick.hp), x + 30, y + 19);
    }

    fill(this.turnBuff.ballColor);
    const ballImg = this.getBallAsset();
    for (const ball of this.balls) {
      if (ball.alive && ball.active) {
        if (!this.drawImageCentered(ballImg, ball.x, ball.y, 12, 12)) {
          circle(ball.x, ball.y, 12);
        }
        if (this.effectFlash > 0) {
          if (!this.drawImageCentered(this.assets.effectRing, ball.x, ball.y, 22, 22)) {
            noFill();
            stroke(this.turnBuff.ballColor);
            strokeWeight(2);
            circle(ball.x, ball.y, 22);
            noStroke();
            fill(this.turnBuff.ballColor);
          }
        }
      }
    }
    if (this.aiming) {
      fill("#f8e7a2");
      if (!this.drawImageCentered(this.assets.launchMarker, this.launchX, this.launchY, 18, 18)) {
        circle(this.launchX, this.launchY, 18);
      }
    }
    if (this.nextLaunchX !== null && !this.aiming) {
      fill("#7be0b7");
      if (!this.drawImageCentered(this.assets.nextLaunchMarker, this.nextLaunchX, this.launchY, 10, 10)) {
        circle(this.nextLaunchX, this.launchY, 10);
      }
    }
  }

  getBallAsset() {
    if (this.turnBuff.assetKey === "calm") return this.assets.ballCalm || this.assets.ballDefault;
    if (this.turnBuff.assetKey === "focus" || this.turnBuff.assetKey === "stabilize") {
      return this.assets.ballFocus || this.assets.ballDefault;
    }
    if (this.turnBuff.assetKey) return this.assets.ballStim || this.assets.ballDefault;
    return this.assets.ballDefault;
  }

  getBrickColor(kind) {
    if (kind === "stim") return "#f56f83";
    if (kind === "recover") return "#63c7a4";
    return "#a8b2bf";
  }

  drawBrickHpLabel(hp, x, y) {
    push();
    rectMode(CENTER);
    noStroke();
    fill(0, 185);
    rect(x, y, 30, 22, 8);
    stroke("#f6f1df");
    strokeWeight(3);
    fill("#ffffff");
    textAlign(CENTER, CENTER);
    textSize(17);
    textStyle(BOLD);
    text(hp, x, y);
    pop();
  }

  drawPlayWalls() {
    if (this.drawImageTopLeft(this.assets.frame, 0, 0, this.w, this.h)) return;

    noFill();
    stroke("#7f8ea3");
    strokeWeight(4);
    line(this.wallLeft, this.wallTop, this.wallLeft, this.floor);
    line(this.wallRight, this.wallTop, this.wallRight, this.floor);
    line(this.wallLeft, this.wallTop, this.wallRight, this.wallTop);

    stroke("#ff6b7a");
    strokeWeight(3);
    line(this.wallLeft, this.floor, this.wallRight, this.floor);

    noStroke();
    fill("#7f8ea3");
    rect(this.wallLeft - 6, this.wallTop, 12, this.floor - this.wallTop, 4);
    rect(this.wallRight - 6, this.wallTop, 12, this.floor - this.wallTop, 4);
    rect(this.wallLeft - 6, this.wallTop - 12, this.wallRight - this.wallLeft + 12, 12, 4);

    fill("#ff6b7a");
    rect(this.wallLeft - 6, this.floor - 3, this.wallRight - this.wallLeft + 12, 6, 3);
  }

  drawAim() {
    if (!this.aiming || this.gameOver) return;
    stroke("#f8e7a2");
    strokeWeight(2);
    line(this.launchX, this.launchY, mouseX - this.offsetX, mouseY - this.offsetY);
    noStroke();
  }

  drawOverlay() {
    fill("#d9ddde");
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.message, this.w / 2, this.h - 28);
    if (!this.gameOver) return;
    fill(0, 170);
    rect(0, 0, this.w, this.h);
    fill("#f8e7a2");
    textSize(42);
    text(this.message, this.w / 2, 270);
    fill("#f6f1df");
    textSize(22);
    text(`최종 도파민 ${Math.round(this.dopamine)}`, this.w / 2, 326);
    text("클릭 또는 Enter 키로 스토리 복귀", this.w / 2, 380);
  }

  getDopamine() {
    return this.clampDopamine(this.dopamine);
  }
}

window.BrickBreakerGame = BrickBreakerGame;
