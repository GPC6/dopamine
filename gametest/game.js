class Game {
  constructor(assets) {
    this.assets = assets;
    if (typeof validateStoryData === "function") {
      validateStoryData();
    }
    this.state = {
      scene: SCENES.TITLE,
      episodeId: this.getStartEpisodeId(),
      nodeIndex: 0,
      dopamine: CONFIG.initialDopamine,
      affection: CONFIG.initialAffection,
      ending: null,
      characters: [],
      background: null,
      currentBgm: null,
      selectedSubGame: null,
      selectedSubGameReturn: null,
      selectedSubGameReturnNode: null,
      selectedSubGameOptions: null,
      pendingNodes: [],
      playerName: localStorage.getItem("dopaPlayerName") || "",
      endingText: null
    };

    this.bindNameOverlay();

    this.titleButton = new Button(538, 522, 204, 54, "START", () => {
      this.showNameEntry();
    }, {
      fill: "#ffffff",
      hoverFill: "#ff7ba6",
      text: "#ef4778",
      radius: 22,
      textSize: 18
    });

    this.loadButton = new Button(538, 590, 204, 48, "LOAD", () => {
      this.loadSnapshot();
    }, {
      fill: "rgba(255, 255, 255, 0.82)",
      hoverFill: "#ffd35a",
      text: "#40445a",
      radius: 22,
      textSize: 17
    });

    this.restartButton = new Button(500, 560, 280, 64, "타이틀로", () => {
      location.reload();
    });

    this.textBox = new TextBox(0, 452, CONFIG.width, 268);
    this.choiceButtons = [];
    this.subGame = null;
    this.minigameTutorial = null;
    this.backgroundImage = null;
    this.backgroundTransition = null;
    this.pendingBgmNode = null;
    this.currentBgmLoop = null;
    this.character = {};
    this.dopamineDeltaPopup = null;
    this.lastClickSoundAt = 0;
    this.dialogueLog = [];
    this.loggedDialogueKeys = new Set();
    this.logPanelOpen = false;
    this.logScrollIndex = 0;
    this.logVisibleCount = 7;
    this.typewriter = {
      nodeKey: null,
      visibleChars: 0,
      speed: 0.82,
      fullText: ""
    };
    this.saveButton = new Button(76, 464, 68, 28, "SAVE", () => {
      this.saveSnapshot();
    }, {
      fill: "rgba(0, 0, 0, 0.5)",
      hoverFill: "rgba(255, 255, 255, 0.18)",
      stroke: "rgba(255, 255, 255, 0.38)",
      hoverStroke: "rgba(255, 255, 255, 0.75)",
      text: "#ffffff",
      radius: 14,
      textSize: 12
    });
    this.dopamineStartButton = new Button(826, 370, 312, 58, "도파민 게임 시작하기", () => {
      this.changeScene(SCENES.MINIGAME);
    }, {
      fill: "#b9ccff",
      hoverFill: "#8ba8ff",
      text: "#1f2852",
      radius: 28,
      textSize: 20
    });
    this.dopamineSkipButton = new Button(826, 444, 312, 58, "건너뛰기(개발단계용)", () => {
      this.skipSelectedSubGame();
    }, {
      fill: "#d1b5ff",
      hoverFill: "#ba8dff",
      text: "#221a44",
      radius: 28,
      textSize: 18
    });
  }

  bindNameOverlay() {
    this.nameOverlay = document.getElementById("nameOverlay");
    this.nameEntry = document.getElementById("nameEntry");
    this.nameConfirm = document.getElementById("nameConfirm");
    this.nameInput = document.getElementById("playerNameInput");
    this.nameConfirmText = document.getElementById("nameConfirmText");

    const stopOverlayEvent = (event) => {
      this.ignoreCanvasClickUntil = Date.now() + 300;
      event.stopPropagation();
    };
    const handleOverlayButton = (event, action) => {
      event.preventDefault();
      stopOverlayEvent(event);
      this.unlockAudio();
      this.playClickSound();
      action();
    };

    ["pointerdown", "pointerup", "mousedown", "mouseup", "click", "touchstart", "touchend"].forEach((eventName) => {
      this.nameOverlay.addEventListener(eventName, stopOverlayEvent);
    });

    document.getElementById("nameNextButton").addEventListener("click", (event) => {
      handleOverlayButton(event, () => this.openNameConfirm());
    });
    document.getElementById("nameConfirmButton").addEventListener("click", (event) => {
      handleOverlayButton(event, () => this.confirmName());
    });
    document.getElementById("nameCancelButton").addEventListener("click", (event) => {
      handleOverlayButton(event, () => this.showNameEntry());
    });
    this.nameInput.addEventListener("keydown", (event) => {
      event.stopPropagation();
      if (event.key === "Enter") {
        event.preventDefault();
        this.ignoreCanvasClickUntil = Date.now() + 300;
        this.unlockAudio();
        this.playClickSound();
        this.openNameConfirm();
      }
    });
  }

  showNameEntry() {
    this.nameOverlay.hidden = false;
    this.nameEntry.hidden = false;
    this.nameConfirm.hidden = true;
    this.nameInput.value = this.state.playerName || "";
    window.setTimeout(() => this.nameInput.focus(), 0);
  }

  openNameConfirm() {
    const name = (this.nameInput.value || "").trim().slice(0, 6) || "현수";
    this.pendingPlayerName = name;
    const josa = window.KoreanJosa ? window.KoreanJosa.pick(name, "이/가") : "(이)가";
    this.nameConfirmText.textContent = `당신의 이름은 [${name}]${josa} 맞습니까?`;
    this.nameEntry.hidden = true;
    this.nameConfirm.hidden = false;
  }

  confirmName() {
    this.state.playerName = this.pendingPlayerName || "현수";
    localStorage.setItem("dopaPlayerName", this.state.playerName);
    this.nameOverlay.hidden = true;
    this.changeScene(SCENES.STORY);
  }

  changeScene(scene) {
    this.state.scene = scene;

    if (scene === SCENES.DOPAMINE_READY) {
      this.resetDopamineForReady();
    }

    if (scene === SCENES.STORY) {
      this.refreshChoices();
    }

    if (scene === SCENES.MINIGAME) {
      this.startSelectedSubGame();
    }
  }

  resetDopamineForReady() {
    this.state.dopamine = Math.round(40 + Math.random() * 10);
  }

  getStartEpisodeId() {
    if (typeof STORY_START_EPISODE !== "undefined" && EPISODES[STORY_START_EPISODE]) {
      return STORY_START_EPISODE;
    }

    return EPISODES.EP1 ? "EP1" : Object.keys(EPISODES)[0];
  }

  update() {
    this.updateBgmLoop();

    if (this.state.scene !== SCENES.MINIGAME) return;

    if (this.subGame) {
      if (this.hasActiveMinigameTutorial()) return;

      this.subGame.update();

      if (this.subGame.finished) {
        this.finishSubGame();
      }
    }
  }

  draw() {
    if (this.state.scene === SCENES.TITLE) this.drawTitle();
    if (this.state.scene === SCENES.STORY) this.drawStory();
    if (this.state.scene === SCENES.DOPAMINE_READY) this.drawDopamineReady();
    if (this.state.scene === SCENES.MINIGAME && this.subGame) {
      this.subGame.draw();
      if (this.hasActiveMinigameTutorial()) this.drawMinigameTutorialOverlay();
    }
    if (this.state.scene === SCENES.ENDING) this.drawEnding();
    if (this.logPanelOpen) this.drawDialogueLogOverlay();
  }

  mousePressed() {
    if (this.isNameOverlayOpen() || Date.now() < (this.ignoreCanvasClickUntil || 0)) return;

    this.unlockAudio();
    this.playClickSound();

    const scene = this.state.scene;
    if (scene === SCENES.TITLE) {
      this.titleButton.mousePressed();
      this.loadButton.mousePressed();
      return;
    }
    if (scene === SCENES.STORY) {
      this.handleStoryClick();
      return;
    }
    if (scene === SCENES.DOPAMINE_READY) {
      this.handleDopamineReadyClick();
      return;
    }
    if (scene === SCENES.MINIGAME && this.subGame) {
      if (this.hasActiveMinigameTutorial()) {
        this.advanceMinigameTutorial();
        return;
      }
      this.subGame.mousePressed();
      return;
    }
    if (scene === SCENES.ENDING) this.restartButton.mousePressed();
  }

  isNameOverlayOpen() {
    return this.nameOverlay && !this.nameOverlay.hidden;
  }

  keyPressed() {
    this.unlockAudio();

    if (this.logPanelOpen) {
      this.handleDialogueLogKey();
      return;
    }

    if (this.state.scene === SCENES.MINIGAME && this.subGame && this.hasActiveMinigameTutorial()) {
      this.advanceMinigameTutorial();
      return;
    }

    if (this.state.scene === SCENES.MINIGAME && this.subGame && this.subGame.keyPressed) {
      this.subGame.keyPressed();
    }
  }

  useFont(role) {
    if (!this.assets.fonts || !this.assets.fonts[role]) return;
    textFont(this.assets.fonts[role]);
  }

  drawTitle() {
    this.drawSceneImage("convenienceStore", true);
    fill(255, 255, 255, 176);
    rect(0, 0, width, height);

    noStroke();
    fill("#ee3f73");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    this.useFont("title");
    textSize(72);
    text("도파민때문에", width / 2, 240);
    textStyle(NORMAL);

    stroke("#ee3f73");
    strokeWeight(4);
    line(width / 2 - 205, 188, width / 2 + 205, 188);
    line(width / 2 - 205, 292, width / 2 + 205, 292);
    noStroke();

    fill("#5b5f70");
    this.useFont("uiBold");
    textSize(16);
    text("SOME HOW STOPS LOVE CONVENIENCE STORY", width / 2, 310);
    this.useFont("ui");
    textSize(18);
    text("감정을 너무 낮추지도, 너무 과열시키지도 말 것", width / 2, 354);

    this.titleButton.draw();
    this.loadButton.draw();
  }

  drawStory() {
    this.drawBackground();

    const node = this.processStoryCommandNodes();
    if (!node) return;

    this.drawEpisodeBadge();
    if (this.shouldShowDopamineMeter()) this.drawStatus();

    if (node.type === NODE_TYPES.DIALOGUE && node.speaker === "END") {
      this.state.endingText = node.text;
      this.changeScene(SCENES.ENDING);
      return;
    }

    if (node.type === NODE_TYPES.DIALOGUE) {
      this.drawCharacters(node.speaker);
      const displayText = this.getTypewriterText(node);
      this.textBox.draw(this.formatSpeaker(node.speaker), displayText, node.speaker);
      this.drawStoryQuickMenu();
      this.drawDopamineDeltaPopup();
      return;
    }

    if (node.type === NODE_TYPES.CHOICE) {
      this.drawCharacters();
      this.drawChoiceOverlay(this.formatStoryText(node.prompt));
      this.choiceButtons.forEach((button) => button.draw());
      this.drawStoryQuickMenu();
      this.drawDopamineDeltaPopup();
      return;
    }

    if (node.type === NODE_TYPES.ENDING_CHECK) {
      this.state.ending = this.decideEnding();
      this.changeScene(SCENES.ENDING);
    }
  }

  drawEnding() {
    background("#171b24");

    const endingText = {
      low: "LowDo 엔딩: 마음이 식거나 용기가 부족했다.",
      high: "HighDo 엔딩: 감정이 너무 앞서버렸다.",
      bad: "배드 엔딩: 호감도가 충분히 쌓이지 않았다.",
      good: "Good 엔딩: 적당한 설렘으로 고백에 성공했다.",
      "TRUE END": "TRUE END",
      "BAD END": "BAD END"
    };

    fill("#f6d365");
    textAlign(CENTER, CENTER);
    this.useFont("title");
    textSize(42);
    text(endingText[this.state.ending] || this.state.endingText || "END", width / 2, 280);

    fill("#f5f2ea");
    this.useFont("ui");
    textSize(24);
    text(`도파민 ${Math.round(this.state.dopamine)} / 호감도 ${Math.round(this.state.affection)}`, width / 2, 360);

    this.restartButton.draw();
  }

  drawBackground() {
    if (this.drawBackgroundTransition()) return;

    if (this.state.background === "dummy") {
      this.drawSceneImage("convenienceStore", false);
      return;
    }

    if (this.state.background === "검은 배경") {
      background("#000000");
      return;
    }

    if (this.state.background === "꿈속") {
      this.drawDreamBackground();
      return;
    }

    if (this.backgroundImage) {
      this.backgroundImage.draw();
      return;
    }

    background("#202633");
  }

  drawSceneImage(name, faded = false) {
    const imageAsset = this.assets.backgrounds[name];
    if (!imageAsset) {
      background("#202633");
      return;
    }

    new BackgroundImage(imageAsset).draw();
    if (faded) {
      fill(255, 255, 255, 124);
      noStroke();
      rect(0, 0, width, height);
    }
  }

  drawBackgroundTransition() {
    if (!this.backgroundTransition) return false;

    const elapsed = this.getTimeMs() - this.backgroundTransition.startedAt;
    const progress = Math.min(1, elapsed / this.backgroundTransition.duration);

    if (this.backgroundTransition.type === "fadeSlide") {
      this.drawFadeSlideBackgroundTransition(elapsed);
    } else {
      this.drawFadeBlackBackgroundTransition(progress);
    }

    if (progress >= 1) {
      this.backgroundTransition = null;
    }

    return true;
  }

  drawFadeBlackBackgroundTransition(progress) {
    const fadeOutEnd = 0.35;
    const blackHoldEnd = 0.52;

    if (progress < fadeOutEnd) {
      const fadeProgress = progress / fadeOutEnd;
      this.drawTransitionBackground(this.backgroundTransition.fromName, this.backgroundTransition.fromImage);
      this.drawBlackOverlay(255 * fadeProgress);
      return;
    }

    if (progress < blackHoldEnd) {
      background("#000000");
      return;
    }

    const fadeProgress = (progress - blackHoldEnd) / (1 - blackHoldEnd);
    this.drawTransitionBackground(this.backgroundTransition.toName, this.backgroundTransition.toImage);
    this.drawBlackOverlay(255 * (1 - fadeProgress));
  }

  drawFadeSlideBackgroundTransition(elapsed) {
    const fadeOutDuration = this.backgroundTransition.fadeOutDuration;
    const blackHoldEnd = fadeOutDuration + this.backgroundTransition.blackHoldDuration;

    if (elapsed < fadeOutDuration) {
      const fadeProgress = elapsed / fadeOutDuration;
      this.drawTransitionBackground(this.backgroundTransition.fromName, this.backgroundTransition.fromImage);
      this.drawBlackOverlay(255 * fadeProgress);
      return;
    }

    background("#000000");

    if (elapsed < blackHoldEnd) {
      return;
    }

    const slideElapsed = elapsed - blackHoldEnd;
    const revealProgress = this.easeInOutCubic(Math.min(1, slideElapsed / this.backgroundTransition.slideDuration));
    this.drawBackgroundAssetSoftReveal(
      this.backgroundTransition.toImage,
      revealProgress,
      this.backgroundTransition.direction
    );
  }

  drawTransitionBackground(name, imageAsset) {
    if (name === "검은 배경") {
      background("#000000");
      return;
    }

    if (name === "꿈속") {
      this.drawDreamBackground();
      return;
    }

    this.drawBackgroundAsset(imageAsset);
  }

  drawBackgroundAsset(imageAsset, alpha = 255, offsetX = 0) {
    if (!imageAsset) {
      background("#202633");
      return;
    }

    const scale = max(width / imageAsset.width, height / imageAsset.height);
    const drawWidth = imageAsset.width * scale;
    const drawHeight = imageAsset.height * scale;

    push();
    tint(255, Math.max(0, Math.min(255, alpha)));
    imageMode(CENTER);
    image(imageAsset, width / 2 + offsetX, height / 2, drawWidth, drawHeight);
    pop();
  }

  drawBackgroundAssetSoftReveal(imageAsset, revealProgress, direction) {
    if (!imageAsset || revealProgress <= 0) return;
    if (revealProgress >= 0.995) {
      this.drawBackgroundAsset(imageAsset);
      return;
    }

    const fadeWidth = width * 0.32;
    const revealEdge = direction === "left"
      ? -fadeWidth + (width + fadeWidth * 2) * revealProgress
      : width + fadeWidth - (width + fadeWidth * 2) * revealProgress;
    const sliceCount = 64;
    const sliceWidth = width / sliceCount;

    for (let i = 0; i < sliceCount; i++) {
      const sliceX = i * sliceWidth;
      const sliceCenter = sliceX + sliceWidth / 2;
      const rawAlpha = direction === "left"
        ? (revealEdge - sliceCenter) / fadeWidth
        : (sliceCenter - revealEdge) / fadeWidth;
      const sliceAlpha = this.smoothStep(Math.max(0, Math.min(1, rawAlpha))) * 255;

      if (sliceAlpha <= 0) continue;

      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.rect(sliceX, 0, sliceWidth + 1, height);
      drawingContext.clip();
      this.drawBackgroundAsset(imageAsset, sliceAlpha);
      drawingContext.restore();
    }
  }

  smoothStep(t) {
    return t * t * (3 - 2 * t);
  }

  drawBlackOverlay(alpha) {
    noStroke();
    fill(0, 0, 0, Math.max(0, Math.min(255, alpha)));
    rect(0, 0, width, height);
  }

  drawDreamBackground() {
    const topColor = color("#101326");
    const middleColor = color("#353064");
    const bottomColor = color("#13223f");

    noStroke();
    for (let y = 0; y < height; y += 3) {
      const t = y / height;
      const c = t < 0.55
        ? lerpColor(topColor, middleColor, t / 0.55)
        : lerpColor(middleColor, bottomColor, (t - 0.55) / 0.45);
      fill(c);
      rect(0, y, width, 3);
    }

    const time = this.getTimeMs() * 0.00035;
    noFill();
    for (let i = 0; i < 9; i++) {
      const y = 130 + i * 54 + Math.sin(time + i) * 8;
      const alpha = 26 + i * 4;
      stroke(215, 226, 255, alpha);
      strokeWeight(1.5);
      beginShape();
      for (let x = -80; x <= width + 80; x += 48) {
        vertex(x, y + Math.sin(x * 0.012 + time * 2 + i * 0.7) * 18);
      }
      endShape();
    }

    noStroke();
    for (let i = 0; i < 70; i++) {
      const x = (i * 173 + Math.sin(time + i) * 22) % width;
      const y = 36 + ((i * 97) % Math.floor(height * 0.68));
      const a = 60 + 70 * Math.abs(Math.sin(time * 2 + i));
      fill(246, 241, 220, a);
      rect(x, y, 2, 2);
    }

    fill(255, 255, 255, 18);
    rect(0, 0, width, height);
  }


  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  getBackgroundAsset(name) {
    if (!name) return null;
    if (name === "dummy") return this.assets.backgrounds.convenienceStore || null;
    if (this.isSpecialBackground(name)) return null;
    return this.assets.backgrounds[name] || null;
  }

  isSpecialBackground(name) {
    return name === "검은 배경" || name === "꿈속";
  }

  startBackgroundTransition(fromImage, toImage, options = "none") {
    const transitionOptions = this.normalizeBackgroundTransitionOptions(options);
    if (transitionOptions.type === "none") return false;

    this.backgroundTransition = {
      type: transitionOptions.type,
      fromImage,
      toImage,
      startedAt: this.getTimeMs(),
      duration: transitionOptions.duration,
      direction: transitionOptions.direction,
      fadeOutDuration: transitionOptions.fadeOutDuration,
      blackHoldDuration: transitionOptions.blackHoldDuration,
      slideDuration: transitionOptions.slideDuration,
      fromName: options.fromName,
      toName: options.toName
    };

    return true;
  }

  getBackgroundTransitionOptions(node) {
    const rawOptions = node.transition ?? node.backgroundTransition ?? node.effect;
    const options = rawOptions && typeof rawOptions === "object"
      ? rawOptions
      : { type: rawOptions };

    return {
      type: options.type || options.name || (rawOptions ? "fadeBlack" : "none"),
      duration: options.duration ?? node.transitionDuration,
      direction: options.direction ?? node.transitionDirection,
      slideDuration: options.slideDuration ?? options.revealDuration ?? node.transitionSlideDuration
    };
  }

  normalizeBackgroundTransitionOptions(options) {
    const rawOptions = options && typeof options === "object" ? options : { type: options };
    const type = this.normalizeBackgroundTransitionType(rawOptions.type);
    const defaultDuration = type === "fadeSlide" ? 620 : 520;
    const duration = this.normalizeBackgroundTransitionDuration(rawOptions.duration, defaultDuration);
    const fadeOutDuration = type === "fadeSlide" ? Math.round(duration * 0.32) : 0;
    const blackHoldDuration = type === "fadeSlide" ? Math.round(duration * 0.16) : 0;
    const baseSlideDuration = Math.max(120, duration - fadeOutDuration - blackHoldDuration);
    const slideDuration = this.normalizeBackgroundSlideDuration(
      rawOptions.slideDuration,
      baseSlideDuration
    );

    return {
      type,
      duration: type === "fadeSlide" ? fadeOutDuration + blackHoldDuration + slideDuration : duration,
      direction: this.normalizeBackgroundTransitionDirection(rawOptions.direction),
      fadeOutDuration,
      blackHoldDuration,
      slideDuration
    };
  }

  normalizeBackgroundTransitionType(type) {
    const transitionType = String(type || "none").toLowerCase();

    if (transitionType === "none" || transitionType === "cut" || transitionType === "instant") return "none";
    if (transitionType === "fadeslide" || transitionType === "fade-slide" || transitionType === "slide") return "fadeSlide";
    return "fadeBlack";
  }

  normalizeBackgroundTransitionDuration(duration, fallback) {
    if (typeof duration !== "number" || !Number.isFinite(duration)) return fallback;
    return Math.max(120, Math.min(2000, duration));
  }

  normalizeBackgroundSlideDuration(duration, fallback) {
    if (typeof duration !== "number" || !Number.isFinite(duration)) return fallback;
    return Math.max(120, Math.min(2000, duration));
  }

  normalizeBackgroundTransitionDirection(direction) {
    return direction === "left" ? "left" : "right";
  }

  isBackgroundTransitionActive() {
    if (!this.backgroundTransition) return false;

    if (this.getTimeMs() - this.backgroundTransition.startedAt >= this.backgroundTransition.duration) {
      this.backgroundTransition = null;
      return false;
    }

    return true;
  }

  drawEpisodeBadge() {
    noStroke();
    fill(28, 31, 43, 180);
    rect(width - 114, 20, 86, 36, 18);
    fill("#fff5dc");
    textAlign(CENTER, CENTER);
    this.useFont("uiBold");
    textSize(16);
    text(this.getEpisodeLabel(), width - 71, 38);
  }

  drawStoryQuickMenu() {
    const items = this.getStoryQuickMenuItems();
    const menuY = items.length > 0 ? items[0].y : 464;

    this.saveButton.x = width - 178;
    this.saveButton.y = menuY;
    this.saveButton.w = 68;
    this.saveButton.h = 28;
    this.saveButton.label = "SAVE";
    this.saveButton.draw();
    for (const item of items) {
      fill(0, 0, 0, 128);
      stroke(255, 255, 255, 74);
      strokeWeight(1);
      rect(item.x, item.y, item.w, item.h, 14);
      noStroke();
      fill(255, 255, 255, 218);
      textAlign(CENTER, CENTER);
      this.useFont("uiBold");
      textSize(11);
      text(item.label, item.x + item.w / 2, item.y + item.h / 2);
    }
  }

  getStoryQuickMenuItems() {
    const menuY = 464;
    const labels = ["대사록"];

    return labels.map((label, index) => ({
      label,
      x: width - 100 + index * 78,
      y: menuY,
      w: 66,
      h: 28
    }));
  }

  drawChoiceOverlay(prompt) {
    noStroke();
    fill(0, 0, 0, 92);
    rect(0, 0, width, height);

    const promptX = 290;
    const promptY = this.getChoicePromptY();
    const promptW = 700;

    fill("#ee3f73");
    rect(promptX, promptY, 72, 22, 11);

    noStroke();
    fill("#ffffff");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    this.useFont("uiBold");
    textSize(12);
    text("CHOICE", promptX + 36, promptY + 11);

    noStroke();
    fill("#ffffff");
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    this.useFont("dialogueBold");
    textSize(28);
    text(prompt || "", promptX, promptY + 34, promptW, 38);

    stroke(255, 255, 255, 110);
    strokeWeight(1);
    line(promptX, promptY + 76, promptX + promptW, promptY + 76);
    textStyle(NORMAL);
  }

  getChoicePromptY() {
    const count = max(1, this.choiceButtons.length);
    if (count <= 2) return 370;
    if (count === 3) return 336;
    return 302;
  }

  drawDopamineReady() {
    this.drawSceneImage("bedroomNight", false);
    fill(0, 0, 0, 58);
    rect(0, 0, width, height);

    this.drawMeter(826, 298, "도파민", this.state.dopamine, "#e94c8a", {
      width: 312,
      showMilestones: false
    });

    this.dopamineStartButton.draw();
    this.dopamineSkipButton.draw();
    this.saveButton.x = 826;
    this.saveButton.y = 516;
    this.saveButton.w = 312;
    this.saveButton.h = 40;
    this.saveButton.label = "SAVE";
    this.saveButton.draw();

    fill("#f6f1ff");
    textAlign(CENTER, CENTER);
    this.useFont("ui");
    textSize(20);
    text("하루가 끝나면 잠에 들고, 도파민 게임으로 마음을 정리합니다.", width / 2, 632);
  }

  handleDopamineReadyClick() {
    if (this.pressButton(this.saveButton)) return;
    if (this.pressButton(this.dopamineStartButton)) return;
    this.pressButton(this.dopamineSkipButton);
  }

  pressButton(button) {
    if (!button.contains(mouseX, mouseY)) return false;
    button.mousePressed();
    return true;
  }

  skipSelectedSubGame() {
    const returnEpisodeId = this.state.selectedSubGameReturn || "EP_AFTER_MINIGAME";
    const returnNodeId = this.state.selectedSubGameReturnNode;
    this.minigameTutorial = null;
    this.state.selectedSubGame = null;
    this.state.selectedSubGameReturn = null;
    this.state.selectedSubGameReturnNode = null;
    this.moveTo(returnEpisodeId, returnNodeId);
    this.changeScene(SCENES.STORY);
  }

  drawCharacters(activeSpeaker = null) {
    if (this.isChatBackground()) {
      this.drawChatCharacter(activeSpeaker);
      return;
    }

    const visibleCharacters = this.state.characters.filter((character) => this.character[character]);
    const characterLength = visibleCharacters.length;

    visibleCharacters.forEach((character, index) => {
      this.character[character].draw(index, characterLength, this.getCharacterYOffset(character));
    });
  }

  getCharacterYOffset(character) {
    return character === "파미니" ? -72 : 0;
  }

  isChatBackground() {
    return this.state.background === "카톡창 안" || this.state.background === "카톡방 화면";
  }

  drawChatCharacter(activeSpeaker) {
    if (!activeSpeaker || activeSpeaker === "주인공" || activeSpeaker === "독백" || activeSpeaker === "나레이션") return;

    const characterImage = this.character[activeSpeaker];
    if (!characterImage) return;

    characterImage.drawChatBustLeft();
  }

  processStoryCommandNodes() {
    if (this.isBackgroundTransitionActive()) return null;

    let node = this.getCurrentNode();
    let processed = false;

    while (node && (!this.canUseCondition(node.condition) || this.isStoryCommandNode(node))) {
      if (!this.canUseCondition(node.condition)) {
        this.advanceCurrentNode();
        processed = true;
        node = this.getCurrentNode();
        continue;
      }

      if (node.type === NODE_TYPES.BACKGROUND) {
        const previousBackground = this.state.background;
        const previousImage = this.getBackgroundAsset(previousBackground);
        this.state.background = node.name;
        const image = this.getBackgroundAsset(node.name);
        if (!image && !this.isSpecialBackground(node.name)) {
          console.warn("Missing background asset: " + node.name);
        }
        this.backgroundImage = image ? new BackgroundImage(image) : null;
        this.advanceCurrentNode();
        processed = true;

        if (previousBackground !== node.name && (previousImage || image || this.isSpecialBackground(previousBackground) || this.isSpecialBackground(node.name))) {
          const didStartTransition = this.startBackgroundTransition(
            previousImage,
            image,
            {
              ...this.getBackgroundTransitionOptions(node),
              fromName: previousBackground,
              toName: node.name
            }
          );
          if (didStartTransition) return null;
        }

        node = this.getCurrentNode();
        continue;
      }

      if (node.type === NODE_TYPES.CLEAR_BACKGROUND) {
        this.state.background = null;
        this.backgroundImage = null;
      }

      if (node.type === NODE_TYPES.CHARACTER_IN) {
        if (this.state.characters.indexOf(node.name) === -1) {
          this.state.characters.push(node.name);
        }
        const image = this.getCharacterAsset(node.name, node.emotion);
        if (!image) {
          console.warn("Missing character asset: " + node.name + " / " + (node.emotion || "default"));
        }
        this.character[node.name] = image ? new CharacterImage(image) : null
      }

      if (node.type === NODE_TYPES.CHARACTER_OUT) {
        const index = this.state.characters.indexOf(node.name);
        if (index !== -1) {
          this.state.characters.splice(index, 1)
        }
        this.character[node.name] = null
      }

      if (node.type === NODE_TYPES.CLEAR_CHARACTERS || node.type === NODE_TYPES.SCENE_RESET) {
        this.state.characters = [];
        this.character = {};
      }

      if (node.type === NODE_TYPES.SCENE_RESET) {
        this.state.background = null;
        this.backgroundImage = null;
      }

      if (node.type === NODE_TYPES.SOUND) {
        this.handleSoundNode(node);
      }

      if (node.type === NODE_TYPES.MOVE) {
        if (node.next === NEXT_TARGETS.MINIGAME) {
          this.state.selectedSubGame = node.minigame || node.subGame || SUB_GAMES.BRICK_BREAKER;
          this.state.selectedSubGameReturn = node.after || "EP_AFTER_MINIGAME";
          this.state.selectedSubGameReturnNode = node.afterNode || null;
          this.state.selectedSubGameOptions = this.getSubGameOptions(node);
          this.changeScene(SCENES.DOPAMINE_READY);
          return null;
        }

        this.moveTo(node.next, node.nextNode);
        processed = true;
        node = this.getCurrentNode();
        continue;
      }

      this.advanceCurrentNode();
      processed = true;
      node = this.getCurrentNode();
    }

    if (processed && node && node.type === NODE_TYPES.CHOICE) {
      this.refreshChoices();
    }

    return node;
  }

  isStoryCommandNode(node) {
    return node.type === NODE_TYPES.BACKGROUND ||
      node.type === NODE_TYPES.CHARACTER_IN ||
      node.type === NODE_TYPES.CHARACTER_OUT ||
      node.type === NODE_TYPES.CLEAR_CHARACTERS ||
      node.type === NODE_TYPES.CLEAR_BACKGROUND ||
      node.type === NODE_TYPES.SCENE_RESET ||
      node.type === NODE_TYPES.SOUND ||
      node.type === NODE_TYPES.MOVE;
  }

  unlockAudio() {
    if (typeof userStartAudio === "function") {
      userStartAudio();
    }
  }

  playClickSound() {
    const now = this.getTimeMs();
    if (now - this.lastClickSoundAt < 60) return;

    const sound = this.getSoundAsset("click", "effects");
    if (!sound) return;
    if (typeof sound.isLoaded === "function" && !sound.isLoaded()) return;

    this.lastClickSoundAt = now;
    this.setSoundVolume(sound, 0.55);
    if (sound.isPlaying()) {
      sound.stop();
    }
    sound.play();
  }

  handleSoundNode(node) {
    const soundType = this.normalizeSoundType(node.soundType || node.kind || "effect");
    const action = node.action || "play";

    if (soundType === "bgm") {
      this.handleBgmNode(node, action);
      return;
    }

    if (action === "stop") {
      this.stopSound(node.name, "effects");
      return;
    }

    this.playSoundEffect(node);
  }

  normalizeSoundType(soundType) {
    if (soundType === "music") return "bgm";
    if (soundType === "sfx" || soundType === "effects") return "effect";
    return soundType;
  }

  handleBgmNode(node, action) {
    if (action === "stop") {
      this.stopCurrentBgm();
      return;
    }

    const sound = this.getOrLoadBgmAsset(node);
    if (!sound) {
      console.warn("Missing bgm asset: " + node.name);
      return;
    }

    if (this.state.currentBgm !== node.name) {
      this.stopCurrentBgm();
    }

    this.state.currentBgm = node.name;
    this.pendingBgmNode = { ...node };

    if (typeof sound.isLoaded === "function" && !sound.isLoaded()) return;

    this.playBgmSound(node, sound);
  }

  getOrLoadBgmAsset(node) {
    const cachedSound = this.getSoundAsset(node.name, "bgm");
    if (cachedSound) return cachedSound;

    const path = this.getBgmPath(node.name);
    if (!path || typeof loadSound !== "function") return null;

    const sound = loadSound(path, () => {
      if (this.state.currentBgm !== node.name) return;
      this.playBgmSound(this.pendingBgmNode || node, sound);
    }, () => {
      console.warn("Cannot load bgm asset: " + node.name);
    });

    this.assets.sounds.bgm[node.name] = sound;
    return sound;
  }

  playBgmSound(node, sound) {
    if (this.state.currentBgm !== node.name) return;
    if (sound.isPlaying()) return;

    this.setSoundVolume(sound, node.volume);
    if (node.loop === false) {
      this.currentBgmLoop = null;
      sound.play();
    } else {
      this.currentBgmLoop = this.getBgmLoopPoints(node.name);
      sound.play();
    }
    this.pendingBgmNode = null;
  }

  updateBgmLoop() {
    if (!this.currentBgmLoop) return;

    const sound = this.getSoundAsset(this.currentBgmLoop.name, "bgm");
    if (!sound || !sound.isPlaying()) return;
    if (typeof sound.isLoaded === "function" && !sound.isLoaded()) return;
    if (typeof sound.currentTime !== "function" || typeof sound.jump !== "function") return;

    const loopEnd = this.currentBgmLoop.loopEnd || (typeof sound.duration === "function" ? sound.duration() : 0);
    if (!loopEnd) return;

    if (sound.currentTime() >= loopEnd - 0.04) {
      sound.jump(this.currentBgmLoop.loopStart || 0);
    }
  }

  getBgmConfig(name) {
    const config = ASSET_MANIFEST.sounds.bgm && ASSET_MANIFEST.sounds.bgm[name];
    if (!config) return null;
    return typeof config === "string" ? { path: config } : config;
  }

  getBgmPath(name) {
    const config = this.getBgmConfig(name);
    return config ? config.path : null;
  }

  getBgmLoopPoints(name) {
    const config = this.getBgmConfig(name) || {};
    return {
      name,
      loopStart: config.loopStart || 0,
      loopEnd: config.loopEnd || null
    };
  }

  playSoundEffect(node) {
    const sound = this.getSoundAsset(node.name, "effects");
    if (!sound) {
      console.warn("Missing sound effect asset: " + node.name);
      return;
    }

    this.setSoundVolume(sound, node.volume);
    if (node.restart !== false && sound.isPlaying()) {
      sound.stop();
    }
    sound.play();
  }

  getSoundAsset(name, group) {
    if (!name || !this.assets.sounds || !this.assets.sounds[group]) return null;
    return this.assets.sounds[group][name] || null;
  }

  setSoundVolume(sound, volume) {
    if (typeof sound.setVolume === "function" && typeof volume === "number") {
      sound.setVolume(constrain(volume, 0, 1));
    }
  }

  stopCurrentBgm() {
    const currentBgm = this.state.currentBgm;
    const sound = this.getSoundAsset(currentBgm, "bgm");
    if (sound && sound.isPlaying()) {
      sound.stop();
    }
    this.state.currentBgm = null;
    this.pendingBgmNode = null;
    this.currentBgmLoop = null;
  }

  stopSound(name, group) {
    const sound = this.getSoundAsset(name, group);
    if (sound && sound.isPlaying()) {
      sound.stop();
    }
  }

  moveTo(next = null, nextNode = null) {
    const targetEpisodeId = next || this.state.episodeId;

    if (!EPISODES[targetEpisodeId]) {
      console.warn("Missing episode target: " + targetEpisodeId);
      this.state.nodeIndex += 1;
      return;
    }

    const targetNodeIndex = nextNode === null || nextNode === undefined
      ? 0
      : this.getNodeIndexById(targetEpisodeId, nextNode);

    if (targetNodeIndex === -1) {
      console.warn("Missing node target: " + this.getNodeKey(targetEpisodeId, nextNode));
      this.state.nodeIndex += 1;
      return;
    }

    this.state.pendingNodes = [];
    this.state.episodeId = targetEpisodeId;
    this.state.nodeIndex = targetNodeIndex;
  }

  getNodeIndexById(episodeId, nodeId) {
    const nodes = EPISODES[episodeId];
    if (!Array.isArray(nodes)) return -1;

    return nodes.findIndex((node) => node && node.id === nodeId);
  }

  getNodeKey(episodeId, nodeId) {
    return episodeId + "#" + nodeId;
  }

  getCharacterAsset(name, emotion) {
    const characterAssets = this.assets.characters[name];
    if (!characterAssets) return null;

    return characterAssets[emotion] || characterAssets.default || null;
  }

  canUseCondition(condition) {
    if (!condition) return true;

    if (condition.dopamineMin !== undefined && this.state.dopamine < condition.dopamineMin) return false;
    if (condition.dopamineMax !== undefined && this.state.dopamine > condition.dopamineMax) return false;
    if (condition.affectionMin !== undefined && this.state.affection < condition.affectionMin) return false;
    if (condition.affectionMax !== undefined && this.state.affection > condition.affectionMax) return false;

    return true;
  }

  handleStoryClick() {
    if (this.logPanelOpen) {
      this.handleDialogueLogClick();
      return;
    }

    if (this.isBackgroundTransitionActive()) return;

    if (this.saveButton.contains(mouseX, mouseY)) {
      this.saveButton.mousePressed();
      return;
    }

    const quickMenuItem = this.getStoryQuickMenuItemAt(mouseX, mouseY);
    if (quickMenuItem) {
      this.handleStoryQuickMenu(quickMenuItem.label);
      return;
    }

    const node = this.getCurrentNode();

    if (node.type === NODE_TYPES.DIALOGUE) {
      if (!this.isTypewriterComplete()) {
        this.completeTypewriter();
        return;
      }

      this.applyEffects(node.effects);
      this.advanceCurrentNode();
      this.refreshChoices();
      return;
    }

    this.choiceButtons.forEach((button) => button.mousePressed());
  }

  getStoryQuickMenuItemAt(px, py) {
    return this.getStoryQuickMenuItems().find((item) => (
      px >= item.x && px <= item.x + item.w &&
      py >= item.y && py <= item.y + item.h
    ));
  }

  handleStoryQuickMenu(label) {
    if (label === "대사록") {
      this.openDialogueLog();
    }
  }

  openDialogueLog() {
    this.logPanelOpen = true;
    this.logScrollIndex = max(0, this.dialogueLog.length - this.logVisibleCount);
  }

  closeDialogueLog() {
    this.logPanelOpen = false;
  }

  handleDialogueLogClick() {
    const panel = this.getDialogueLogPanelRect();
    const closeButton = this.getDialogueLogCloseRect(panel);
    const upButton = this.getDialogueLogScrollButtonRect(panel, "up");
    const downButton = this.getDialogueLogScrollButtonRect(panel, "down");

    if (this.containsRect(closeButton, mouseX, mouseY)) {
      this.closeDialogueLog();
      return;
    }

    if (this.containsRect(upButton, mouseX, mouseY)) {
      this.scrollDialogueLog(-1);
      return;
    }

    if (this.containsRect(downButton, mouseX, mouseY)) {
      this.scrollDialogueLog(1);
      return;
    }

    if (!this.containsRect(panel, mouseX, mouseY)) {
      this.closeDialogueLog();
    }
  }

  handleDialogueLogKey() {
    if (keyCode === ESCAPE) {
      this.closeDialogueLog();
      return;
    }

    if (keyCode === UP_ARROW) {
      this.scrollDialogueLog(-1);
      return;
    }

    if (keyCode === DOWN_ARROW) {
      this.scrollDialogueLog(1);
      return;
    }

    if (keyCode === 33) this.scrollDialogueLog(-4);
    if (keyCode === 34) this.scrollDialogueLog(4);
  }

  mouseWheel(event) {
    if (!this.logPanelOpen) return true;
    this.scrollDialogueLog(event.delta > 0 ? 1 : -1);
    return false;
  }

  scrollDialogueLog(delta) {
    const maxScroll = max(0, this.dialogueLog.length - this.logVisibleCount);
    this.logScrollIndex = constrain(this.logScrollIndex + delta, 0, maxScroll);
  }

  drawDialogueLogOverlay() {
    const panel = this.getDialogueLogPanelRect();
    const closeButton = this.getDialogueLogCloseRect(panel);
    const upButton = this.getDialogueLogScrollButtonRect(panel, "up");
    const downButton = this.getDialogueLogScrollButtonRect(panel, "down");

    noStroke();
    fill(0, 0, 0, 164);
    rect(0, 0, width, height);

    fill(14, 18, 31, 238);
    stroke(255, 255, 255, 52);
    strokeWeight(1);
    rect(panel.x, panel.y, panel.w, panel.h, 16);

    noStroke();
    fill("#ffffff");
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    this.useFont("uiBold");
    textSize(26);
    text("대사록", panel.x + 34, panel.y + 42);
    textStyle(NORMAL);

    fill(255, 255, 255, 34);
    rect(panel.x + 28, panel.y + 72, panel.w - 56, 1);

    this.drawDialogueLogCloseButton(closeButton);
    this.drawDialogueLogScrollButton(upButton, "▲");
    this.drawDialogueLogScrollButton(downButton, "▼");

    if (this.dialogueLog.length === 0) {
      fill(255, 255, 255, 180);
      textAlign(CENTER, CENTER);
      this.useFont("ui");
      textSize(20);
      text("아직 기록된 대사가 없습니다.", panel.x + panel.w / 2, panel.y + panel.h / 2);
      return;
    }

    const start = this.logScrollIndex;
    const entries = this.dialogueLog.slice(start, start + this.logVisibleCount);
    const rowX = panel.x + 44;
    const rowY = panel.y + 96;
    const rowW = panel.w - 112;
    const rowH = 60;

    entries.forEach((entry, index) => {
      const y = rowY + index * rowH;
      fill(index % 2 === 0 ? "rgba(255, 255, 255, 0.055)" : "rgba(255, 255, 255, 0.025)");
      noStroke();
      rect(rowX - 12, y - 8, rowW + 24, rowH - 6, 8);

      const speaker = entry.speaker || "독백";
      const speakerColor = this.getSpeakerColor(entry.speakerKey);
      fill(speakerColor);
      textAlign(LEFT, TOP);
      textStyle(BOLD);
      this.useFont("dialogueBold");
      textSize(15);
      text(speaker, rowX, y);

      fill("#ffffff");
      textStyle(NORMAL);
      this.useFont("dialogue");
      textSize(18);
      textLeading(24);
      text(entry.text, rowX + 94, y - 2, rowW - 104, rowH - 8);
    });

    fill(255, 255, 255, 150);
    textAlign(RIGHT, CENTER);
    this.useFont("ui");
    textSize(13);
    text(`${min(this.dialogueLog.length, start + 1)}-${min(this.dialogueLog.length, start + entries.length)} / ${this.dialogueLog.length}`, panel.x + panel.w - 84, panel.y + panel.h - 30);
  }

  drawDialogueLogCloseButton(button) {
    const hover = this.containsRect(button, mouseX, mouseY);
    fill(hover ? "rgba(238, 63, 115, 0.95)" : "rgba(255, 255, 255, 0.12)");
    noStroke();
    rect(button.x, button.y, button.w, button.h, 16);
    fill("#ffffff");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    this.useFont("uiBold");
    textSize(17);
    text("X", button.x + button.w / 2, button.y + button.h / 2);
    textStyle(NORMAL);
  }

  drawDialogueLogScrollButton(button, label) {
    const hover = this.containsRect(button, mouseX, mouseY);
    fill(hover ? "rgba(255, 255, 255, 0.24)" : "rgba(255, 255, 255, 0.1)");
    noStroke();
    rect(button.x, button.y, button.w, button.h, 12);
    fill("#ffffff");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    this.useFont("uiBold");
    textSize(15);
    text(label, button.x + button.w / 2, button.y + button.h / 2);
    textStyle(NORMAL);
  }

  getDialogueLogPanelRect() {
    return { x: 170, y: 58, w: 940, h: 604 };
  }

  getDialogueLogCloseRect(panel) {
    return { x: panel.x + panel.w - 62, y: panel.y + 26, w: 34, h: 34 };
  }

  getDialogueLogScrollButtonRect(panel, direction) {
    return {
      x: panel.x + panel.w - 58,
      y: direction === "up" ? panel.y + 104 : panel.y + panel.h - 82,
      w: 30,
      h: 42
    };
  }

  containsRect(rectangle, px, py) {
    return px >= rectangle.x && px <= rectangle.x + rectangle.w &&
      py >= rectangle.y && py <= rectangle.y + rectangle.h;
  }

  getCurrentNode() {
    if (this.state.pendingNodes.length > 0) {
      return this.state.pendingNodes[0];
    }

    return EPISODES[this.state.episodeId][this.state.nodeIndex];
  }

  advanceCurrentNode() {
    if (this.state.pendingNodes.length > 0) {
      this.state.pendingNodes.shift();
      this.resetTypewriter();
      return;
    }

    this.state.nodeIndex += 1;
    this.resetTypewriter();
  }

  resetTypewriter() {
    this.typewriter.nodeKey = null;
    this.typewriter.visibleChars = 0;
    this.typewriter.fullText = "";
  }

  getTypewriterText(node) {
    const fullText = this.formatStoryText(node.text);
    const nodeKey = this.getDialogueNodeKey(node);

    if (this.typewriter.nodeKey !== nodeKey) {
      this.typewriter.nodeKey = nodeKey;
      this.typewriter.visibleChars = 0;
      this.typewriter.fullText = fullText;
      this.addDialogueLog(node, fullText, nodeKey);
    }

    const chars = Array.from(this.typewriter.fullText);
    const frameScale = typeof deltaTime === "number" ? deltaTime / 16.67 : 1;
    this.typewriter.visibleChars = min(chars.length, this.typewriter.visibleChars + this.typewriter.speed * frameScale);
    return chars.slice(0, floor(this.typewriter.visibleChars)).join("");
  }

  isTypewriterComplete() {
    if (!this.typewriter.fullText) return true;
    return this.typewriter.visibleChars >= Array.from(this.typewriter.fullText).length;
  }

  completeTypewriter() {
    this.typewriter.visibleChars = Array.from(this.typewriter.fullText).length;
  }

  getDialogueNodeKey(node) {
    if (this.state.pendingNodes.length > 0) {
      return [
        "pending",
        this.state.episodeId,
        this.state.nodeIndex,
        this.state.pendingNodes.length,
        node.speaker || "",
        node.text || ""
      ].join(":");
    }

    return [
      "episode",
      this.state.episodeId,
      node.id !== undefined ? node.id : this.state.nodeIndex,
      node.speaker || "",
      node.text || ""
    ].join(":");
  }

  addDialogueLog(node, fullText, nodeKey) {
    if (this.loggedDialogueKeys.has(nodeKey)) return;
    this.loggedDialogueKeys.add(nodeKey);
    this.dialogueLog.push({
      speaker: this.formatSpeaker(node.speaker),
      speakerKey: node.speaker || "",
      text: fullText,
      episodeId: this.state.episodeId,
      nodeIndex: this.state.nodeIndex
    });
  }

  addChoiceLog(choice, fullText) {
    const node = this.getCurrentNode();
    const nodeId = node && node.id !== undefined ? node.id : this.state.nodeIndex;
    const nodeKey = [
      "choice",
      this.state.episodeId,
      nodeId,
      fullText,
      this.dialogueLog.length
    ].join(":");

    if (this.loggedDialogueKeys.has(nodeKey)) return;
    this.loggedDialogueKeys.add(nodeKey);
    this.dialogueLog.push({
      speaker: "선택",
      speakerKey: "선택",
      text: fullText,
      episodeId: this.state.episodeId,
      nodeIndex: this.state.nodeIndex
    });
  }

  refreshChoices() {
    const node = this.getCurrentNode();
    this.choiceButtons = [];

    if (!node || node.type !== NODE_TYPES.CHOICE) return;

    const choices = node.choices.filter((choice) => this.canChoose(choice));
    const buttonW = 700;
    const buttonH = 56;
    const gap = 12;
    const blockH = choices.length * buttonH + max(0, choices.length - 1) * gap;
    const startY = constrain(720 - 98 - blockH, 398, 486);

    choices.forEach((choice, index) => {
      const choiceNumber = String(index + 1).padStart(2, "0");
      const choiceText = this.formatStoryText(choice.text);
      const button = new Button((width - buttonW) / 2, startY + index * (buttonH + gap), buttonW, buttonH, `${choiceNumber}   ${choiceText}`, () => {
        this.addChoiceLog(choice, choiceText);
        if (choice.sound) this.handleSoundNode({ type: NODE_TYPES.SOUND, ...choice.sound });
        this.applyEffects(choice.effects);
        this.queueChoiceFollow(choice.follow);

        this.goToChoiceTarget(choice);
      }, {
        fill: "rgba(9, 11, 20, 0.66)",
        hoverFill: "rgba(238, 63, 115, 0.86)",
        stroke: "rgba(255, 255, 255, 0.26)",
        hoverStroke: "rgba(255, 255, 255, 0.85)",
        text: "#ffffff",
        hoverText: "#ffffff",
        radius: 12,
        textSize: 19,
        fontRole: "dialogueBold",
        align: "left",
        paddingX: 28,
        suffix: ">"
      });

      this.choiceButtons.push(button);
    });
  }

  goToChoiceTarget(choice) {
    if (choice.nextNode !== undefined) {
      this.goToNextNode(choice.nextNode);
      return;
    }

    if (choice.next) {
      console.warn("Legacy choice.next used. Prefer nextNode and a move node.");
      this.goToNextTarget(choice.next, choice.minigame || choice.subGame, choice.after, choice.options);
    }
  }

  goToNextNode(nextNode) {
    if (this.state.pendingNodes.length > 0) {
      this.state.pendingNodes.push({
        type: NODE_TYPES.MOVE,
        nextNode
      });
      return;
    }

    this.moveTo(null, nextNode);
    this.refreshChoices();
  }

  goToNextTarget(next, subGameId = null, after = null, options = null) {
    if (this.state.pendingNodes.length > 0) {
      this.state.pendingNodes.push({
        type: NODE_TYPES.MOVE,
        next,
        minigame: subGameId,
        after,
        options
      });
      return;
    }

    if (next === NEXT_TARGETS.MINIGAME) {
      this.state.selectedSubGame = subGameId || SUB_GAMES.BRICK_BREAKER;
      this.state.selectedSubGameReturn = after || "EP_AFTER_MINIGAME";
      this.state.selectedSubGameReturnNode = null;
      this.state.selectedSubGameOptions = this.getSubGameOptions({ options });
      this.changeScene(SCENES.DOPAMINE_READY);
      return;
    }

    this.moveTo(next);
    this.refreshChoices();
  }

  canChoose(choice) {
    return this.canUseCondition(choice.condition);
  }

  queueChoiceFollow(follow = []) {
    this.state.pendingNodes = follow.flatMap((line) => {
      const nodes = [];
      if (line.sound) {
        nodes.push({
          type: NODE_TYPES.SOUND,
          ...line.sound
        });
      }
      nodes.push({
        type: NODE_TYPES.DIALOGUE,
        speaker: line.speaker,
        text: line.text,
        effects: line.effects
      });
      return nodes;
    });
  }

  startSelectedSubGame() {
    const subGameId = this.state.selectedSubGame || SUB_GAMES.BRICK_BREAKER;
    const subGame = SUB_GAME_MANIFEST[subGameId];
    const SubGameClass = subGame ? window[subGame.className] : null;

    if (!SubGameClass) {
      console.warn("Cannot start sub game: " + subGameId);
      this.finishSubGame();
      return;
    }

    const options = this.state.selectedSubGameOptions || {};
    this.playSubGameBgm(subGame);
    this.minigameTutorial = this.createMinigameTutorial(options);
    this.subGame = new SubGameClass(this.state.dopamine, this.getPlayableSubGameOptions(options));
  }

  createMinigameTutorial(options) {
    if (typeof MinigameTutorialOverlay !== "function") return null;
    return MinigameTutorialOverlay.fromOptions(options);
  }

  getPlayableSubGameOptions(options = {}) {
    const playableOptions = { ...options };
    delete playableOptions.tutorial;
    return playableOptions;
  }

  hasActiveMinigameTutorial() {
    return this.minigameTutorial && this.minigameTutorial.isActive();
  }

  advanceMinigameTutorial() {
    if (!this.hasActiveMinigameTutorial()) return;
    const completed = this.minigameTutorial.advance();
    if (completed) this.resumeSubGameAfterTutorial();
  }

  resumeSubGameAfterTutorial() {
    if (!this.subGame || typeof millis !== "function") return;

    if (this.subGame.startedAt !== undefined) {
      this.subGame.startedAt = millis();
    }
    if (this.subGame.overloadStart !== undefined) {
      this.subGame.overloadStart = this.subGame.dopamine >= this.subGame.overheatThreshold ? this.subGame.startedAt : null;
    }
  }

  drawMinigameTutorialOverlay() {
    const step = this.minigameTutorial && this.minigameTutorial.getCurrentStep();
    if (!step) return;

    push();
    noStroke();
    fill(0, 0, 0, 92);
    rect(0, 0, width, height);

    this.drawTutorialMascot();
    this.drawTutorialSpeech(step);
    pop();
  }

  drawTutorialMascot() {
    const mascotImage = this.getCharacterAsset("파미니", "Normal");
    if (!mascotImage) return;

    const mascotW = 210;
    const mascotH = mascotW * mascotImage.height / mascotImage.width;
    imageMode(CENTER);
    image(mascotImage, 156, height - mascotH / 2 - 26, mascotW, mascotH);
  }

  drawTutorialSpeech(step) {
    const panelX = 296;
    const panelY = height - 188;
    const panelW = width - panelX - 72;
    const panelH = 132;

    fill(16, 20, 34, 236);
    stroke(255, 184, 108, 220);
    strokeWeight(2);
    rect(panelX, panelY, panelW, panelH, 8);

    noStroke();
    fill("#ffb86c");
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    this.useFont("dialogueBold");
    textSize(22);
    text(step.speaker || "파미니", panelX + 28, panelY + 22);

    fill("#fff7dc");
    textStyle(NORMAL);
    this.useFont("dialogue");
    textSize(24);
    text(step.text || "", panelX + 28, panelY + 56, panelW - 56, 48);

    fill(255, 255, 255, 164);
    textAlign(RIGHT, BOTTOM);
    this.useFont("ui");
    textSize(15);
    text("클릭 또는 아무 키", panelX + panelW - 24, panelY + panelH - 18);
  }

  getSubGameOptions(node = {}) {
    const options = node.options || node.subGameOptions || node.minigameOptions || null;
    return options && typeof options === "object" && !Array.isArray(options)
      ? { ...options }
      : {};
  }

  playSubGameBgm(subGame) {
    const bgmName = (subGame && subGame.bgm) || "game1";
    this.handleBgmNode({
      type: NODE_TYPES.SOUND,
      soundType: "bgm",
      name: bgmName
    }, "play");
  }

  finishSubGame() {
    if (this.subGame && typeof this.subGame.getDopamine === "function") {
      this.state.dopamine = constrain(this.subGame.getDopamine(), 0, 100);
    }

    this.subGame = null;
    this.minigameTutorial = null;
    const returnEpisodeId = this.state.selectedSubGameReturn || "EP_AFTER_MINIGAME";
    const returnNodeId = this.state.selectedSubGameReturnNode;
    this.state.selectedSubGame = null;
    this.state.selectedSubGameReturn = null;
    this.state.selectedSubGameReturnNode = null;
    this.state.selectedSubGameOptions = null;
    this.moveTo(returnEpisodeId, returnNodeId);
    this.changeScene(SCENES.STORY);
  }

  applyEffects(effects = {}) {
    if (effects.dopamine !== undefined) {
      this.addDopamine(effects.dopamine);
    }

    if (effects.affection !== undefined) {
      this.state.affection = constrain(this.state.affection + effects.affection, 0, 100);
    }
  }

  addDopamine(amount) {
    const before = this.state.dopamine;
    this.state.dopamine = constrain(this.state.dopamine + amount, 0, 100);
    const changedAmount = this.state.dopamine - before;

    if (changedAmount !== 0) {
      this.dopamineDeltaPopup = {
        amount: changedAmount,
        startedAt: this.getTimeMs(),
        duration: 1600
      };
    }
  }

  decideEnding() {
    if (this.state.dopamine < 40) return "low";
    if (this.state.dopamine > 70) return "high";
    if (this.state.affection < 40) return "bad";
    return "good";
  }

  drawStatus() {
    this.drawMeter(32, 28, "도파민", this.state.dopamine, this.getDopamineZoneColor(this.state.dopamine));
    // this.drawMeter(32, 74, "호감도", this.state.affection, "#6cc4a1");
  }

  drawMeter(x, y, label, value, colorHex, options = {}) {
    const meterW = options.width || 318;
    const showMilestones = options.showMilestones !== false;

    noStroke();
    fill("#2f2d5d");
    rect(x, y, meterW, 38, 4);
    fill("#f5f2ea");
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    this.useFont("uiBold");
    textSize(18);
    text(label, x + 12, y + 19);
    textStyle(NORMAL);

    const barX = x + 126;
    const barY = y + 12;
    const barW = Math.max(96, meterW - 164);
    const barH = 14;
    fill("#f0f2fa");
    rect(barX, barY, barW, barH, 7);

    if (label === "도파민") {
      this.drawDopamineMeterFill(barX, barY, barW, barH, value);
      if (showMilestones) this.drawDopamineMilestoneMarks(barX, barY, barW, barH);
    } else {
      fill(colorHex);
      rect(barX, barY, map(value, 0, 100, 0, barW), barH, 7);
    }

    fill(label === "도파민" ? this.getDopamineZoneColor(value) : "#f5f2ea");
    textAlign(RIGHT, CENTER);
    this.useFont("uiBold");
    textSize(18);
    text(Math.round(value), x + 112, y + 19);
  }

  drawDopamineMeterFill(x, y, w, h, value) {
    const filledW = constrain(map(value, 0, 100, 0, w), 0, w);
    fill(this.getDopamineZoneColor(value));
    rect(x, y, filledW, h, 7);
  }

  drawDopamineMilestoneMarks(x, y, w, h) {
    this.getDopamineMilestones().forEach((milestone) => {
      const markerX = x + map(milestone, 0, 100, 0, w);

      stroke(255, 255, 255, 190);
      strokeWeight(1.4);
      line(markerX, y - 4, markerX, y + h + 4);
      noStroke();

      fill(255, 255, 255, 188);
      textAlign(CENTER, TOP);
      textStyle(BOLD);
      this.useFont("uiBold");
      textSize(10);
      text(milestone, markerX, y + h + 1);
      textStyle(NORMAL);
    });
  }

  getDopamineMilestones() {
    return [50, 80];
  }

  getDopamineZones() {
    return [
      { from: 0, to: 51, color: "#70d7aa" },
      { from: 51, to: 81, color: "#ffd166" },
      { from: 81, to: 100, color: "#ff5c93" }
    ];
  }

  getDopamineZoneColor(value) {
    const zone = this.getDopamineZones().find((entry) => value >= entry.from && (value < entry.to || entry.to === 100));
    return zone ? zone.color : "#e94c8a";
  }

  drawDopamineDeltaPopup() {
    if (!this.dopamineDeltaPopup) return;

    const elapsed = this.getTimeMs() - this.dopamineDeltaPopup.startedAt;
    if (elapsed >= this.dopamineDeltaPopup.duration) {
      this.dopamineDeltaPopup = null;
      return;
    }

    const progress = elapsed / this.dopamineDeltaPopup.duration;
    const fadeProgress = progress < 0.35 ? 0 : (progress - 0.35) / 0.65;
    const alpha = 255 * (1 - fadeProgress);
    const offsetY = -16 * progress;
    const scaleAmount = 1 + 0.08 * (1 - Math.min(1, progress * 4));
    const amount = Math.round(this.dopamineDeltaPopup.amount);
    const label = `${amount > 0 ? "+" : ""}${amount} 도파민`;
    const positive = amount > 0;
    const popupW = 132;
    const popupH = 38;
    const popupX = width - popupW - 76;
    const popupY = this.textBox.y - 50 + offsetY;

    push();
    translate(popupX + popupW / 2, popupY + popupH / 2);
    scale(scaleAmount);
    noStroke();
    fill(0, 0, 0, alpha * 0.62);
    rect(-popupW / 2, -popupH / 2, popupW, popupH, 19);
    fill(positive ? 255 : 106, positive ? 218 : 211, positive ? 112 : 255, alpha);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    this.useFont("uiBold");
    textSize(18);
    text(label, 0, 0);
    textStyle(NORMAL);
    pop();
  }

  shouldShowDopamineMeter() {
    return this.getEpisodeNumber() >= 2 || this.state.episodeId.includes("ENDING") || this.state.episodeId.includes("엔딩");
  }

  getEpisodeLabel() {
    const match = this.state.episodeId.match(/EP(\d+)/);
    if (!match) return "END";
    return `EP.${match[1]}`;
  }

  getEpisodeNumber() {
    const match = this.state.episodeId.match(/EP(\d+)/);
    return match ? Number(match[1]) : 99;
  }

  getEpisodeProgress() {
    const nodes = EPISODES[this.state.episodeId] || [];
    if (!nodes.length) return 0;
    return constrain((this.state.nodeIndex / max(1, nodes.length - 1)) * 100, 0, 100);
  }

  formatSpeaker(speaker) {
    if (speaker === "독백") return "";
    if (speaker === "주인공") return this.state.playerName || "주인공";
    return speaker || "";
  }

  getSpeakerColor(speaker) {
    const colors = {
      수진: "#f48fb1",
      혜지: "#b39ddb",
      건호: "#90caf9",
      주인공: "#ffffff",
      나레이션: "#cfd8dc",
      독백: "#ffffff",
      파미니: "#ffb86c",
      선택: "#ffd166"
    };

    return colors[speaker] || "#fff7dc";
  }

  getTimeMs() {
    return typeof millis === "function" ? millis() : Date.now();
  }

  formatStoryText(text) {
    const playerName = this.state.playerName || "현수";
    if (window.KoreanJosa) {
      return window.KoreanJosa.replaceNameTokens(text, playerName);
    }
    return (text || "").replace(/000|OO/g, playerName);
  }

  saveSnapshot() {
    if (this.state.scene !== SCENES.STORY && this.state.scene !== SCENES.DOPAMINE_READY) return;
    const snapshot = {
      episodeId: this.state.episodeId,
      nodeIndex: this.state.nodeIndex,
      dopamine: this.state.dopamine,
      affection: this.state.affection,
      playerName: this.state.playerName || "현수",
      background: this.state.background,
      characters: this.state.characters
    };
    localStorage.setItem("dopaSave", JSON.stringify(snapshot));
    localStorage.setItem("dopaPlayerName", snapshot.playerName);
  }

  loadSnapshot() {
    const raw = localStorage.getItem("dopaSave");
    if (!raw) {
      this.showNameEntry();
      return;
    }

    try {
      const snapshot = JSON.parse(raw);
      this.state.episodeId = EPISODES[snapshot.episodeId] ? snapshot.episodeId : this.getStartEpisodeId();
      this.state.nodeIndex = snapshot.nodeIndex || 0;
      this.state.dopamine = snapshot.dopamine ?? CONFIG.initialDopamine;
      this.state.affection = snapshot.affection ?? CONFIG.initialAffection;
      this.state.playerName = snapshot.playerName || "현수";
      this.state.pendingNodes = [];
      this.state.characters = Array.isArray(snapshot.characters) ? snapshot.characters : [];
      this.character = {};
      this.state.characters.forEach((name) => {
        const image = this.getCharacterAsset(name, "일반");
        this.character[name] = image ? new CharacterImage(image) : null;
      });
      this.state.background = snapshot.background || null;
      const image = this.assets.backgrounds[this.state.background];
      this.backgroundImage = image ? new BackgroundImage(image) : null;
      this.changeScene(SCENES.STORY);
    } catch (error) {
      console.warn("Cannot load save data", error);
      this.showNameEntry();
    }
  }
}
