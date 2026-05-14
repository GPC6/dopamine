class Button {
  constructor(x, y, w, h, label, onClick) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.onClick = onClick;
  }

  contains(px, py) {
    return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
  }

  draw() {
    const hover = this.contains(mouseX, mouseY);
    stroke(hover ? "#f6d365" : "#5f6675");
    strokeWeight(2);
    fill(hover ? "#28303f" : "#202633");
    rect(this.x, this.y, this.w, this.h, 8);

    noStroke();
    fill("#f5f2ea");
    textAlign(CENTER, CENTER);
    textSize(22);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  mousePressed() {
    if (this.contains(mouseX, mouseY)) {
      this.onClick();
    }
  }
}

class TextBox {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(speaker, bodyText) {
    fill(16, 19, 26, 235);
    stroke("#5f6675");
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h, 8);

    noStroke();
    fill("#f6d365");
    textAlign(LEFT, TOP);
    textSize(24);
    text(speaker || "", this.x + 28, this.y + 22);

    fill("#f5f2ea");
    textSize(25);
    textLeading(38);
    text(bodyText || "", this.x + 28, this.y + 64, this.w - 56, this.h - 84);
  }
}
