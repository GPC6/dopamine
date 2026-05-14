class Game {
  constructor() {
    this.state = {
      scene: "title",
      episodeId: "EP1",
      nodeIndex: 0,
      dopamine: CONFIG.initialDopamine,
      affection: CONFIG.initialAffection,
      ending: null
    };

    this.titleButton = new Button(500, 500, 280, 68, "시작", () => {
      this.changeScene("story");
    });

    this.restartButton = new Button(500, 560, 280, 64, "다시 시작", () => {
      location.reload();
    });

    this.textBox = new TextBox(80, 470, 1120, 200);
    this.choiceButtons = [];
    this.minigame = null;
  }

  changeScene(scene) {
    this.state.scene = scene;

    if (scene === "story") {
      this.refreshChoices();
    }

    if (scene === "minigame") {
      this.minigame = new DopamineGame();
    }
  }

  update() {
    if (this.state.scene !== "minigame") return;

    this.minigame.update();

    if (this.minigame.finished) {
      this.addDopamine(this.minigame.getDopamineChange());
      this.state.episodeId = "EP_AFTER_MINIGAME";
      this.state.nodeIndex = 0;
      this.changeScene("story");
    }
  }

  draw() {
    if (this.state.scene === "title") this.drawTitle();
    if (this.state.scene === "story") this.drawStory();
    if (this.state.scene === "minigame") this.minigame.draw();
    if (this.state.scene === "ending") this.drawEnding();
  }

  mousePressed() {
    if (this.state.scene === "title") this.titleButton.mousePressed();
    if (this.state.scene === "story") this.handleStoryClick();
    if (this.state.scene === "minigame") this.minigame.mousePressed();
    if (this.state.scene === "ending") this.restartButton.mousePressed();
  }

  drawTitle() {
    background("#171b24");
    noStroke();
    fill("#f6d365");
    textAlign(CENTER, CENTER);
    textSize(68);
    text("도파민때문에", width / 2, 240);

    fill("#f5f2ea");
    textSize(24);
    text("감정을 너무 낮추지도, 너무 과열시키지도 말 것", width / 2, 330);

    this.titleButton.draw();
  }

  drawStory() {
    background("#202633");
    this.drawStatus();

    const node = this.getCurrentNode();

    if (node.type === "dialogue") {
      this.textBox.draw(node.speaker, node.text);
      return;
    }

    if (node.type === "choice") {
      fill("#f5f2ea");
      textAlign(CENTER, CENTER);
      textSize(28);
      text(node.prompt, width / 2, 260);
      this.choiceButtons.forEach((button) => button.draw());
      return;
    }

    if (node.type === "endingCheck") {
      this.state.ending = this.decideEnding();
      this.changeScene("ending");
    }
  }

  drawEnding() {
    background("#171b24");

    const endingText = {
      low: "LowDo 엔딩: 마음이 식거나 용기가 부족했다.",
      high: "HighDo 엔딩: 감정이 너무 앞서버렸다.",
      bad: "배드 엔딩: 호감도가 충분히 쌓이지 않았다.",
      good: "Good 엔딩: 적당한 설렘으로 고백에 성공했다."
    };

    fill("#f6d365");
    textAlign(CENTER, CENTER);
    textSize(42);
    text(endingText[this.state.ending], width / 2, 280);

    fill("#f5f2ea");
    textSize(24);
    text(`도파민 ${Math.round(this.state.dopamine)} / 호감도 ${Math.round(this.state.affection)}`, width / 2, 360);

    this.restartButton.draw();
  }

  handleStoryClick() {
    const node = this.getCurrentNode();

    if (node.type === "dialogue") {
      this.state.nodeIndex += 1;
      this.refreshChoices();
      return;
    }

    this.choiceButtons.forEach((button) => button.mousePressed());
  }

  getCurrentNode() {
    return EPISODES[this.state.episodeId][this.state.nodeIndex];
  }

  refreshChoices() {
    const node = this.getCurrentNode();
    this.choiceButtons = [];

    if (!node || node.type !== "choice") return;

    const choices = node.choices.filter((choice) => this.canChoose(choice));

    choices.forEach((choice, index) => {
      const button = new Button(340, 360 + index * 88, 600, 64, choice.text, () => {
        this.applyEffects(choice.effects);

        if (choice.next === "MINIGAME") {
          this.changeScene("minigame");
          return;
        }

        this.state.episodeId = choice.next;
        this.state.nodeIndex = 0;
        this.refreshChoices();
      });

      this.choiceButtons.push(button);
    });
  }

  canChoose(choice) {
    if (!choice.condition) return true;
    if (choice.condition.dopamineMin && this.state.dopamine < choice.condition.dopamineMin) return false;
    if (choice.condition.dopamineMax && this.state.dopamine > choice.condition.dopamineMax) return false;
    return true;
  }

  applyEffects(effects = {}) {
    if (effects.dopamine) {
      this.addDopamine(effects.dopamine);
    }

    if (effects.affection) {
      this.state.affection = constrain(this.state.affection + effects.affection, 0, 100);
    }
  }

  addDopamine(amount) {
    this.state.dopamine = constrain(this.state.dopamine + amount, 0, 100);
  }

  decideEnding() {
    if (this.state.dopamine < 40) return "low";
    if (this.state.dopamine > 70) return "high";
    if (this.state.affection < 40) return "bad";
    return "good";
  }

  drawStatus() {
    this.drawMeter(32, 28, "도파민", this.state.dopamine, "#f06a7a");
    this.drawMeter(32, 74, "호감도", this.state.affection, "#6cc4a1");
  }

  drawMeter(x, y, label, value, colorHex) {
    noStroke();
    fill("#f5f2ea");
    textAlign(LEFT, CENTER);
    textSize(18);
    text(`${label} ${Math.round(value)}`, x, y + 12);

    fill("#2a303d");
    rect(x + 110, y, 220, 24, 4);
    fill(colorHex);
    rect(x + 110, y, map(value, 0, 100, 0, 220), 24, 4);
  }
}
