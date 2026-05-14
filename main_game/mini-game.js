class DopamineGame {
  constructor() {
    this.score = 50;
    this.shotsLeft = 5;
    this.finished = false;
    this.receptorX = width / 2;
    this.receptorDirection = 1;
  }

  update() {
    this.receptorX += this.receptorDirection * 5;

    if (this.receptorX < 260 || this.receptorX > width - 260) {
      this.receptorDirection *= -1;
    }
  }

  draw() {
    background("#18202d");
    noStroke();
    fill("#f5f2ea");
    textAlign(CENTER, CENTER);
    textSize(30);
    text("도파민 수용체 맞추기", width / 2, 90);

    textSize(20);
    text("움직이는 수용체가 중앙에 가까울 때 클릭하면 도파민이 안정됩니다.", width / 2, 132);
    text(`남은 기회 ${this.shotsLeft} / 현재 점수 ${Math.round(this.score)}`, width / 2, 175);

    stroke("#5f6675");
    strokeWeight(4);
    line(260, 360, width - 260, 360);

    noStroke();
    fill("#6cc4a1");
    ellipse(width / 2, 360, 90, 90);

    fill("#f06a7a");
    ellipse(this.receptorX, 360, 58, 58);
  }

  mousePressed() {
    if (this.finished) return;

    const distanceFromCenter = abs(this.receptorX - width / 2);
    const gain = map(distanceFromCenter, 0, 380, 14, -18);
    this.score = constrain(this.score + gain, 0, 100);
    this.shotsLeft -= 1;

    if (this.shotsLeft <= 0) {
      this.finished = true;
    }
  }

  getDopamineChange() {
    return Math.round(this.score - 50);
  }
}
