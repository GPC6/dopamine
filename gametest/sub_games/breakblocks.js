class BrickBreakerGame {
  constructor(initialDopamine) {
    this.w = 980;
    this.h = 640;
    this.cols = 9;
    this.cell = 76;
    this.top = 110;
    this.left = 138;
    this.floor = 560;
    this.ballLaunchGap = 8;
    this.offsetX = 0;
    this.offsetY = 0;
    this.initialDopamine = initialDopamine;
    this.finished = false;
    this.resetGame();
  }

  resetGame() {
    this.dopamine = this.initialDopamine;
    this.score = 0;
    this.turn = 1;
    this.balls = [];
    this.bricks = [];
    this.items = [];
    this.aiming = true;
    this.message = "마우스로 각도를 정하고 클릭해서 발사";
    this.gameOver = false;
    this.settleTimer = 0;
    this.turnBuff = { noGain: false, boost: 1, power: 1 };
    this.overloadTurns = 0;
    this.finished = false;

    for (let r = 0; r < 3; r++) this.addBrickRow(r);
  }

  update() {
    if (!this.gameOver) {
      this.updateBalls();
      this.checkTurnEnd();
    }
  }

  draw() {
    this.offsetX = (width - this.w) / 2;
    this.offsetY = (height - this.h) / 2;

    push();
    translate(this.offsetX, this.offsetY);
    background("#111820");
    this.drawHeader();
    this.drawBoard();
    this.drawAim();
    this.drawOverlay();
    pop();
  }

  mousePressed() {
    if (this.gameOver) {
      this.finished = true;
      return;
    }
    if (!this.aiming) return;

    const localMouseX = mouseX - this.offsetX;
    const localMouseY = mouseY - this.offsetY;
    const origin = createVector(this.w / 2, this.floor - 18);
    const target = createVector(localMouseX, localMouseY);
    const dir = p5.Vector.sub(target, origin);
    if (dir.y > -20) return;
    dir.normalize();

    const count = constrain(floor(map(this.dopamine, 0, 100, 1, 9)), 1, 9);
    this.turnBuff = this.randomBuff();
    this.balls = [];
    for (let i = 0; i < count; i++) {
      this.balls.push({
        x: origin.x,
        y: origin.y,
        vx: dir.x * 8.6,
        vy: dir.y * 8.6,
        launchDelay: i * this.ballLaunchGap,
        active: i === 0,
        alive: true
      });
    }
    this.aiming = false;
    this.message = `${count}개 발사 / 이번 턴 효과: ${this.buffName(this.turnBuff)}`;
  }

  keyPressed() {
    if (this.gameOver && (key === "r" || key === "R" || keyCode === ENTER)) {
      this.finished = true;
    }
  }

  addBrickRow(rowIndex = 0) {
    for (let c = 0; c < this.cols; c++) {
      if (random() > 0.66) continue;
      const kind = random() < 0.72 ? "stim" : "recover";
      const value = kind === "stim" ? floor(random(1, 4)) : -floor(random(10, 26) / 5) * 5;
      this.bricks.push({
        c,
        r: rowIndex,
        hp: kind === "stim" ? floor(random(1, 4)) : floor(random(2, 5)),
        kind,
        value
      });
    }
  }

  randomBuff() {
    const roll = random();
    if (roll < 0.22) return { noGain: true, boost: 1, power: 1 };
    if (roll < 0.43) return { noGain: false, boost: 1.7, power: 1 };
    if (roll < 0.64) return { noGain: false, boost: 1, power: 2 };
    return { noGain: false, boost: 1, power: 1 };
  }

  buffName(buff) {
    if (buff.noGain) return "완화 큐브";
    if (buff.boost > 1) return "고자극 큐브";
    if (buff.power > 1) return "강화 큐브";
    return "없음";
  }

  updateBalls() {
    for (const ball of this.balls) {
      if (!ball.alive) continue;
      if (ball.launchDelay > 0) {
        ball.launchDelay--;
        continue;
      }
      ball.active = true;
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.x < 18 || ball.x > this.w - 18) ball.vx *= -1;
      if (ball.y < this.top + 5) ball.vy *= -1;
      if (ball.y > this.floor) {
        ball.alive = false;
        continue;
      }

      for (const brick of this.bricks) {
        const bx = this.left + brick.c * this.cell;
        const by = this.top + brick.r * 52;
        if (ball.x > bx && ball.x < bx + 60 && ball.y > by && ball.y < by + 38) {
          ball.vy *= -1;
          this.hitBrick(brick);
          break;
        }
      }
    }
    this.bricks = this.bricks.filter((brick) => brick.hp > 0);
  }

  hitBrick(brick) {
    brick.hp -= this.turnBuff.power;
    this.score += 10;
    if (brick.kind === "stim" && !this.turnBuff.noGain) {
      this.dopamine = constrain(this.dopamine + brick.value * this.turnBuff.boost, 0, 120);
    }
    if (brick.kind === "recover" && brick.hp <= 0) {
      this.dopamine = constrain(this.dopamine + brick.value, 0, 120);
      this.score += 20;
    }
  }

  checkTurnEnd() {
    if (this.aiming || this.balls.some((ball) => ball.alive)) return;
    this.settleTimer++;
    if (this.settleTimer < 28) return;
    this.settleTimer = 0;
    this.turn++;

    if (this.dopamine > 100) this.overloadTurns++;
    else this.overloadTurns = 0;

    if (this.turn > 10) {
      this.endGame("10턴 생존 완료");
      return;
    }
    if (this.overloadTurns >= 2) {
      this.endGame("도파민 과부하가 오래 지속됨");
      return;
    }

    for (const brick of this.bricks) brick.r++;
    this.addBrickRow(0);
    if (this.bricks.some((brick) => this.top + brick.r * 52 + 38 > this.floor - 18)) {
      this.endGame("블럭이 바닥에 닿음");
      return;
    }
    this.aiming = true;
    this.message = "다음 턴: 현재 수치를 보고 목표 블럭을 선택";
  }

  endGame(message) {
    this.gameOver = true;
    this.message = message;
  }

  drawHeader() {
    fill("#f8e7a2");
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(28);
    text("도파민 벽돌깨기", 120, 36);
    textSize(15);
    fill("#d9ddde");
    text("자극 블럭은 맞을 때 상승, \n회복 블럭은 파괴될 때 감소", 120, 75);

    this.drawMeter(620, 28, 260, this.dopamine);
    fill("#f6f1df");
    textAlign(RIGHT, CENTER);
    textSize(17);
    text(`턴 ${this.turn}/10  점수 ${this.score}`, this.w - 34, 75);
  }

  drawMeter(x, y, w, value) {
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

  drawBoard() {
    stroke("#303944");
    line(32, this.floor, this.w - 32, this.floor);
    noStroke();
    for (const brick of this.bricks) {
      const x = this.left + brick.c * this.cell;
      const y = this.top + brick.r * 52;
      fill(brick.kind === "stim" ? "#f56f83" : "#63c7a4");
      rect(x, y, 60, 38, 6);
      fill("#111820");
      textAlign(CENTER, CENTER);
      textSize(16);
      const label = brick.kind === "stim" ? `+${brick.value}` : `${brick.value}`;
      text(`${label} / ${max(0, brick.hp)}`, x + 30, y + 19);
    }

    fill("#f6f1df");
    for (const ball of this.balls) {
      if (ball.alive && ball.active) circle(ball.x, ball.y, 12);
    }
    fill("#f8e7a2");
    circle(this.w / 2, this.floor - 18, 18);
  }

  drawAim() {
    if (!this.aiming || this.gameOver) return;
    stroke("#f8e7a2");
    strokeWeight(2);
    line(this.w / 2, this.floor - 18, mouseX - this.offsetX, mouseY - this.offsetY);
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
    text(`최종 도파민 ${round(this.dopamine)} / 최종 점수 ${this.score}`, this.w / 2, 326);
    text("클릭 또는 Enter 키로 스토리 복귀", this.w / 2, 380);
  }

  getDopamine() {
    return this.dopamine;
  }
}

window.BrickBreakerGame = BrickBreakerGame;
