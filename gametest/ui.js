const SPEAKER_COLORS = {
  수진: "#f48fb1",
  혜지: "#b39ddb",
  건호: "#90caf9",
  파미니: "#ffb86c",
  주인공: "#ffffff",
  나레이션: "#cfd8dc",
  독백: "#ffffff",
  선택: "#ffd166",
  default: "#fff7dc"
};

function useGameFont(role) {
  if (typeof assets === "undefined" || !assets.fonts || !assets.fonts[role]) return;
  textFont(assets.fonts[role]);
}

class Button {
  constructor(x, y, w, h, label, onClick, options = {}) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.label = label;
    this.onClick = onClick;
    this.options = options;
  }

  contains(px, py) {
    return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
  }

  draw() {
    const hover = this.contains(mouseX, mouseY);
    const fillColor = hover
      ? (this.options.hoverFill || "#5f85f2")
      : (this.options.fill || "#f4f4f8");
    const strokeColor = hover
      ? (this.options.hoverStroke || "#ffffff")
      : (this.options.stroke || "rgba(0, 0, 0, 0)");
    stroke(strokeColor);
    strokeWeight(this.options.strokeWeight || 2);
    fill(fillColor);
    rect(this.x, this.y, this.w, this.h, this.options.radius ?? 10);

    noStroke();
    fill(hover ? (this.options.hoverText || "#ffffff") : (this.options.text || "#242947"));
    textStyle(this.options.bold === false ? NORMAL : BOLD);
    useGameFont(this.options.fontRole || (this.options.bold === false ? "ui" : "uiBold"));
    textSize(this.options.textSize || 22);
    if (this.options.align === "left") {
      const paddingX = this.options.paddingX || 24;
      textAlign(LEFT, CENTER);
      text(this.label, this.x + paddingX, this.y + this.h / 2);
      if (this.options.suffix) {
        textAlign(RIGHT, CENTER);
        text(this.options.suffix, this.x + this.w - paddingX, this.y + this.h / 2);
      }
    } else {
      textAlign(CENTER, CENTER);
      text(this.label, this.x + this.w / 2, this.y + this.h / 2);
    }
    textStyle(NORMAL);
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

  draw(speaker, bodyText, speakerKey = speaker) {
    const speakerColor = SPEAKER_COLORS[speakerKey] || SPEAKER_COLORS.default;

    noStroke();
    for (let i = 0; i < this.h; i++) {
      const t = i / max(1, this.h - 1);
      fill(0, 0, 0, lerp(0, 226, t));
      rect(this.x, this.y + i, this.w, 1);
    }

    fill(255, 255, 255, 44);
    rect(this.x, this.y + 44, this.w, 1);

    fill(speakerColor);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    useGameFont("dialogueBold");
    textSize(18);
    text(speaker || "", this.x + 76, this.y + 74);
    textStyle(NORMAL);

    fill("#ffffff");
    useGameFont("dialogue");
    textSize(25);
    textLeading(38);
    text(bodyText || "", this.x + 76, this.y + 108, this.w - 152, this.h - 130);

    fill(255, 255, 255, 200);
    triangle(this.x + this.w - 72, this.y + this.h - 42, this.x + this.w - 52, this.y + this.h - 42, this.x + this.w - 62, this.y + this.h - 28);
  }
}

class BackgroundImage {
  constructor(img) {
    this.img = img;
  }

  draw() {
    const scale = max(width / this.img.width, height / this.img.height);
    const drawWidth = this.img.width * scale;
    const drawHeight = this.img.height * scale;

    imageMode(CENTER);
    image(this.img, width / 2, height / 2, drawWidth, drawHeight);
  }
}

class CharacterImage {
  constructor(img) {
    this.img = img;
    imageMode(CENTER)
  }

  draw(i, char_len, yOffset = 0) {
    let w = 250;
    let h = w * this.img.height / this.img.width;
    const y = height / 1.5 + yOffset;
    if (char_len == 1) {
      image(this.img, width / 2, y, w, h);
    }
    else {
      if (i == 0)
        image(this.img, width * 0.25, y, w, h);
      else if (i == 1)
        image(this.img, width * 0.75, y, w, h);
      else if (i == 2)
        image(this.img, width * 0.5, y, w, h);
    }

  }

  drawChatBustLeft() {
    const clipX = 0;
    const clipY = 96;
    const clipW = 328;
    const clipH = 356;
    const drawW = 292;
    const drawH = drawW * this.img.height / this.img.width;
    const drawX = 154;
    const imageTop = 128;
    const drawY = imageTop + drawH / 2;

    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.rect(clipX, clipY, clipW, clipH);
    drawingContext.clip();

    push();
    imageMode(CENTER);
    translate(drawX, drawY);
    scale(-1, 1);
    image(this.img, 0, 0, drawW, drawH);
    pop();

    drawingContext.restore();
  }
}
