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
      episodeAffectionDelta: 0,
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

    this.titleButton = new Button(200, 510, 204, 54, "START", () => {
      this.showNameEntry();
    }, {
      stroke: "#ef4778",
      fill: "#ffffff",
      hoverFill: "#ff7ba6",
      text: "#ef4778",
      radius: 22,
      textSize: 18
    });

    this.loadButton = new Button(200, 590, 204, 54, "LOAD", () => {
      this.openLoadSlotOverlay();
    }, {
      stroke: "#ffd35a",
      fill: "rgba(255, 255, 255, 0.82)",
      hoverFill: "#ffd35a",
      text: "#40445a",
      radius: 22,
      textSize: 17
    });

    this.restartButton = new Button(500, 560, 280, 64, "타이틀로", () => {
      this.resetGameToTitle();
    });
    this.titleReturnButton = this.createTitleReturnButton();
    this.titleReturnConfirmOpen = false;

    this.textBox = new TextBox(0, 452, CONFIG.width, 268);
    this.choiceButtons = [];
    this.choiceButtonsNodeKey = null;
    this.subGame = null;
    this.minigameTutorial = null;
    this.paminiBriefing = null;
    this.backgroundImage = null;
    this.backgroundTransition = null;
    this.episodeTransition = null;
    this.pendingBgmNode = null;
    this.currentBgmLoop = null;
    this.character = {};
    this.dopamineDeltaPopup = null;
    this.affectionDeltaPopup = null;
    this.lastClickSoundAt = 0;
    this.dialogueLog = [];
    this.loggedDialogueKeys = new Set();
    this.appliedDialogueEffectKeys = new Set();
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
      this.openSaveSlotOverlay();
    }, {
      fill: "rgba(0, 0, 0, 0.5)",
      hoverFill: "rgba(255, 255, 255, 0.18)",
      stroke: "rgba(255, 255, 255, 0.38)",
      hoverStroke: "rgba(255, 255, 255, 0.75)",
      text: "#ffffff",
      radius: 14,
      textSize: 12
    });
    this.loadQuickButton = new Button(1182, 20, 68, 28, "LOAD", () => {
      this.openLoadSlotOverlay();
    }, {
      fill: "rgba(0, 0, 0, 0.5)",
      hoverFill: "rgba(255, 255, 255, 0.18)",
      stroke: "rgba(255, 255, 255, 0.38)",
      hoverStroke: "rgba(255, 255, 255, 0.75)",
      text: "#ffffff",
      radius: 14,
      textSize: 12
    });
    this.saveSlotOverlay = null;
    this.dopamineStartButton = new Button(826, 370, 312, 58, "도파민 게임 시작하기", () => {
      this.changeScene(SCENES.MINIGAME);
    }, {
      fill: "#b9ccff",
      hoverFill: "#8ba8ff",
      text: "#1f2852",
      radius: 28,
      textSize: 20
    });
    this.dopamineSkipButton = new Button(826, 444, 312, 58, "미니게임 건너뛰기", () => {
      this.skipSelectedSubGame();
    }, {
      fill: "#d1b5ff",
      hoverFill: "#ba8dff",
      text: "#221a44",
      radius: 28,
      textSize: 18
    });
  }

  createTitleReturnButton() {
    return new Button(CONFIG.width - 156, 58, 136, 36, "타이틀", () => {
      this.openTitleReturnConfirm();
    }, {
      fill: "rgba(0, 0, 0, 0.56)",
      hoverFill: "rgba(255, 111, 169, 0.9)",
      stroke: "rgba(255, 255, 255, 0.46)",
      hoverStroke: "#ffffff",
      text: "#ffffff",
      radius: 18,
      textSize: 14
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
    const name = (this.nameInput.value || "").trim().slice(0, 6) || "진수";
    this.pendingPlayerName = name;
    const josa = window.KoreanJosa ? window.KoreanJosa.pick(name, "이/가") : "(이)가";
    this.nameConfirmText.textContent = `당신의 이름은 [${name}]${josa} 맞습니까?`;
    this.nameEntry.hidden = true;
    this.nameConfirm.hidden = false;
  }

  confirmName() {
    this.state.playerName = this.pendingPlayerName || "진수";
    localStorage.setItem("dopaPlayerName", this.state.playerName);
    this.nameOverlay.hidden = true;
    this.changeScene(SCENES.STORY);
  }

  changeScene(scene) {
    if (this.state.scene === SCENES.MINIGAME && scene !== SCENES.MINIGAME) {
      this.cleanupSubGame();
    }

    this.state.scene = scene;

    if (scene === SCENES.STORY) {
      this.refreshChoices();
    }

    if (scene === SCENES.MINIGAME) {
      this.startSelectedSubGame();
    }
  }

  cleanupSubGame() {
    if (this.subGame && typeof this.subGame.cleanup === "function") {
      this.subGame.cleanup();
    }
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
    if (this.state.scene === SCENES.PAMINI_BRIEFING) this.drawPaminiBriefing();
    if (this.state.scene === SCENES.DOPAMINE_READY) this.drawDopamineReady();
    if (this.state.scene === SCENES.MINIGAME && this.subGame) {
      this.subGame.draw();
      if (this.hasActiveMinigameTutorial()) this.drawMinigameTutorialOverlay();
    }
    if (this.state.scene === SCENES.ENDING) this.drawEnding();
    if (this.state.scene === SCENES.CREDITS) this.drawCredits();
    if (this.drawEpisodeTransition()) return;
    this.drawTitleReturnButton();
    if (this.logPanelOpen) this.drawDialogueLogOverlay();
    if (this.saveSlotOverlay) this.drawSaveSlotOverlay();
    if (this.titleReturnConfirmOpen) this.drawTitleReturnConfirmOverlay();
  }

  mousePressed() {
    if (this.isNameOverlayOpen() || Date.now() < (this.ignoreCanvasClickUntil || 0)) return;
    if (this.isEpisodeTransitionActive()) return;

    this.unlockAudio();

    const scene = this.state.scene;
    if (this.titleReturnConfirmOpen) {
      this.handleTitleReturnConfirmClick();
      return;
    }

    if (this.handleTitleReturnClick()) return;

    if (this.saveSlotOverlay) {
      this.handleSaveSlotOverlayClick();
      return;
    }

    if (scene === SCENES.STORY && this.isDisabledChoiceButtonAt(mouseX, mouseY)) {
      this.handleStoryClick();
      return;
    }

    if (scene !== SCENES.MINIGAME) this.playClickSound();

    if (scene === SCENES.TITLE) {
      this.titleButton.mousePressed();
      this.loadButton.mousePressed();
      return;
    }
    if (scene === SCENES.STORY) {
      this.handleStoryClick();
      return;
    }
    if (scene === SCENES.PAMINI_BRIEFING) {
      this.handlePaminiBriefingClick();
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
    if (scene === SCENES.ENDING) {
      this.handleEndingClick();
      return;
    }
    if (scene === SCENES.CREDITS) this.handleCreditsClick();
  }

  isDisabledChoiceButtonAt(px, py) {
    const node = this.getCurrentNode();
    if (!node || node.type !== NODE_TYPES.CHOICE) return false;

    return this.choiceButtons.some((button) => button.options.disabled && button.contains(px, py));
  }

  isNameOverlayOpen() {
    return this.nameOverlay && !this.nameOverlay.hidden;
  }

  keyPressed() {
    this.unlockAudio();
    if (this.isEpisodeTransitionActive()) return;

    if (this.logPanelOpen) {
      this.handleDialogueLogKey();
      return;
    }

    if (this.state.scene === SCENES.MINIGAME && this.subGame && this.hasActiveMinigameTutorial()) {
      this.advanceMinigameTutorial();
      return;
    }

    if (this.state.scene === SCENES.PAMINI_BRIEFING) {
      if (this.isAdvanceKey()) this.advancePaminiBriefing();
      return;
    }

    if (this.state.scene === SCENES.STORY && this.isAdvanceKey()) {
      const node = this.getCurrentNode();
      if (node && node.type === NODE_TYPES.DIALOGUE) {
        this.handleStoryClick();
      }
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
    this.ensureTitleBgm();
    this.drawSceneImage("start_screen", false);

    this.titleButton.draw();
    this.loadButton.draw();
  }

  ensureTitleBgm() {
    if (this.state.currentBgm === "title") return;
    this.handleBgmNode({
      type: NODE_TYPES.SOUND,
      soundType: "bgm",
      name: "title"
    });
  }

  drawTitleReturnButton() {
    if (!this.shouldShowTitleReturnButton()) return;
    this.titleReturnButton.draw();
  }

  handleTitleReturnClick() {
    if (!this.shouldShowTitleReturnButton()) return false;
    return this.pressButton(this.titleReturnButton);
  }

  shouldShowTitleReturnButton() {
    if (this.state.scene === SCENES.TITLE || this.isNameOverlayOpen()) return false;
    if (!this.titleReturnButton) return false;
    return !this.titleReturnConfirmOpen && !this.saveSlotOverlay && !this.logPanelOpen && !this.backgroundTransition;
  }

  openTitleReturnConfirm() {
    this.titleReturnConfirmOpen = true;
  }

  closeTitleReturnConfirm() {
    this.titleReturnConfirmOpen = false;
  }

  getTitleReturnConfirmRects() {
    const panelW = 500;
    const panelH = 230;
    const panelX = (CONFIG.width - panelW) / 2;
    const panelY = (CONFIG.height - panelH) / 2;
    const buttonW = 144;
    const buttonH = 44;
    const gap = 24;
    const buttonY = panelY + 156;

    return {
      panel: { x: panelX, y: panelY, w: panelW, h: panelH },
      cancel: { x: panelX + panelW / 2 - buttonW - gap / 2, y: buttonY, w: buttonW, h: buttonH },
      confirm: { x: panelX + panelW / 2 + gap / 2, y: buttonY, w: buttonW, h: buttonH }
    };
  }

  handleTitleReturnConfirmClick() {
    const rects = this.getTitleReturnConfirmRects();

    if (this.isPointInRect(mouseX, mouseY, rects.cancel)) {
      this.closeTitleReturnConfirm();
      return;
    }

    if (this.isPointInRect(mouseX, mouseY, rects.confirm)) {
      this.closeTitleReturnConfirm();
      this.resetGameToTitle();
    }
  }

  drawTitleReturnConfirmOverlay() {
    const rects = this.getTitleReturnConfirmRects();

    noStroke();
    fill(0, 0, 0, 156);
    rect(0, 0, width, height);

    fill("#171a24");
    stroke(255, 255, 255, 86);
    strokeWeight(1.4);
    rect(rects.panel.x, rects.panel.y, rects.panel.w, rects.panel.h, 12);

    noStroke();
    fill("#fff5dc");
    textAlign(CENTER, CENTER);
    this.useFont("uiBold");
    textSize(25);
    text("타이틀 화면으로 돌아가겠습니까?", rects.panel.x + rects.panel.w / 2, rects.panel.y + 62);

    fill("#dfe4f4");
    this.useFont("ui");
    textSize(17);
    text("(저장되지 않은 게임은 사라집니다)", rects.panel.x + rects.panel.w / 2, rects.panel.y + 104);

    this.drawTitleReturnConfirmButton(rects.cancel, "취소", false);
    this.drawTitleReturnConfirmButton(rects.confirm, "돌아가기", true);
  }

  drawTitleReturnConfirmButton(buttonRect, label, danger) {
    const hover = this.isPointInRect(mouseX, mouseY, buttonRect);
    fill(danger ? (hover ? "#ff6fa9" : "#e9469a") : (hover ? "rgba(255, 255, 255, 0.24)" : "rgba(255, 255, 255, 0.14)"));
    stroke(255, 255, 255, hover ? 180 : 78);
    strokeWeight(1.2);
    rect(buttonRect.x, buttonRect.y, buttonRect.w, buttonRect.h, 10);

    noStroke();
    fill("#ffffff");
    textAlign(CENTER, CENTER);
    this.useFont("uiBold");
    textSize(16);
    text(label, buttonRect.x + buttonRect.w / 2, buttonRect.y + buttonRect.h / 2);
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
      this.drawStatDeltaPopups();
      return;
    }

    if (node.type === NODE_TYPES.CHOICE) {
      this.drawCharacters();
      const visibleChoiceItems = this.getVisibleChoiceItems(node);
      this.drawChoiceOverlay(this.formatStoryText(node.prompt), this.getChoiceImpactSummaryFromItems(visibleChoiceItems));
      this.choiceButtons.forEach((button) => button.draw());
      this.drawStoryQuickMenu();
      this.drawStatDeltaPopups();
      return;
    }

    if (node.type === NODE_TYPES.ENDING_CHECK) {
      this.state.ending = this.decideEnding();
      this.changeScene(SCENES.ENDING);
    }
  }

  drawEnding() {
    if(this.state.endingText == "해피엔딩") {
    this.drawSceneImage("(CG) 손을 잡는 둘", true)
    } else {
      background("rgb(15, 9, 31)")
    }

    fill("#f6d365");
    textAlign(CENTER, CENTER);
    this.useFont("title");
    textSize(42);
    text(this.state.endingText || "END", width / 2, 280);

    fill("#f5f2ea");
    this.useFont("ui");
    textSize(24);
    text(`도파민 ${Math.round(this.state.dopamine)} / 호감도 ${Math.round(this.state.affection)}`, width / 2, 360);

    this.restartButton.label = this.isHappyEnding() ? "크레딧으로" : "타이틀로";
    this.restartButton.draw();
  }

  handleEndingClick() {
    if (!this.restartButton.contains(mouseX, mouseY)) return;

    if (this.isHappyEnding()) {
      this.changeScene(SCENES.CREDITS);
      return;
    }

    this.resetGameToTitle();
  }

  isHappyEnding() {
    return this.state.endingText === "해피엔딩";
  }

  drawCredits() {
    this.drawSceneImage("happyendcredit", true)

    fill("#f6d365");
    textAlign(CENTER, CENTER);
    this.useFont("title");
    textSize(48);
    text("CREDITS", width / 2, 190);

    fill("#f5f2ea");
    this.useFont("ui");
    textSize(24);
    text("임시 크레딧", width / 2, 282);
    textSize(18);
    text("도파민때문에 제작팀", width / 2, 326);
    text("Thanks for playing", width / 2, 364);

    this.restartButton.label = "타이틀로";
    this.restartButton.draw();
  }

  handleCreditsClick() {
    if (this.restartButton.contains(mouseX, mouseY)) {
      this.resetGameToTitle();
    }
  }

  resetGameToTitle() {
    this.stopCurrentBgm();
    this.cleanupSubGame();

    this.state = {
      scene: SCENES.TITLE,
      episodeId: this.getStartEpisodeId(),
      nodeIndex: 0,
      dopamine: CONFIG.initialDopamine,
      affection: CONFIG.initialAffection,
      episodeAffectionDelta: 0,
      ending: null,
      characters: [],
      background: null,
      currentBgm: null,
      selectedSubGame: null,
      selectedSubGameReturn: null,
      selectedSubGameReturnNode: null,
      selectedSubGameOptions: null,
      pendingNodes: [],
      playerName: "",
      endingText: null
    };

    this.choiceButtons = [];
    this.choiceButtonsNodeKey = null;
    this.subGame = null;
    this.minigameTutorial = null;
    this.paminiBriefing = null;
    this.backgroundImage = null;
    this.backgroundTransition = null;
    this.episodeTransition = null;
    this.pendingBgmNode = null;
    this.currentBgmLoop = null;
    this.character = {};
    this.dopamineDeltaPopup = null;
    this.affectionDeltaPopup = null;
    this.titleReturnConfirmOpen = false;
    this.dialogueLog = [];
    this.loggedDialogueKeys = new Set();
    this.appliedDialogueEffectKeys = new Set();
    this.logPanelOpen = false;
    this.logScrollIndex = 0;
    this.typewriter = {
      nodeKey: null,
      visibleChars: 0,
      speed: 0.82,
      fullText: ""
    };

    if (this.nameOverlay) {
      this.nameOverlay.hidden = true;
      this.nameEntry.hidden = true;
      this.nameConfirm.hidden = true;
    }
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

    if (this.state.background === "꿈속" || this.state.background === "파미니 화면") {
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

    if (name === "꿈속" || name === "파미니 화면") {
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

  startEpisodeTransition(episodeId) {
    const imageKey = this.getEpisodeTransitionKey(episodeId);
    const image = imageKey && this.assets.episodeTransitions
      ? this.assets.episodeTransitions[imageKey]
      : null;

    if (!image) return false;

    const fadeInDuration = 500;
    const holdDuration = 2000;
    const fadeOutDuration = 500;

    this.episodeTransition = {
      imageKey,
      image,
      startedAt: this.getTimeMs(),
      fadeInDuration,
      holdDuration,
      fadeOutDuration,
      totalDuration: fadeInDuration + holdDuration + fadeOutDuration
    };

    return true;
  }

  getEpisodeTransitionKey(episodeId) {
    const normalizedEpisodeId = String(episodeId || "").toUpperCase();
    if (normalizedEpisodeId.includes("EP4-A")) return "Ep4A";
    if (normalizedEpisodeId.includes("EP4-B")) return "Ep4B";

    const match = normalizedEpisodeId.match(/EP([2-6])/);
    return match ? "Ep" + match[1] : null;
  }

  isEpisodeTransitionActive() {
    if (!this.episodeTransition) return false;

    if (this.getTimeMs() - this.episodeTransition.startedAt >= this.episodeTransition.totalDuration) {
      this.episodeTransition = null;
      return false;
    }

    return true;
  }

  drawEpisodeTransition() {
    if (!this.episodeTransition) return false;

    const elapsed = this.getTimeMs() - this.episodeTransition.startedAt;
    const totalDuration = this.episodeTransition.totalDuration;

    if (elapsed >= totalDuration) {
      this.episodeTransition = null;
      return false;
    }

    const fadeInEnd = this.episodeTransition.fadeInDuration;
    const fadeOutStart = fadeInEnd + this.episodeTransition.holdDuration;
    let alpha = 255;

    if (elapsed < fadeInEnd) {
      alpha = 255 * (elapsed / fadeInEnd);
      background("#000000");
    } else if (elapsed > fadeOutStart) {
      alpha = 255 * (1 - ((elapsed - fadeOutStart) / this.episodeTransition.fadeOutDuration));
    } else {
      background("#000000");
    }

    this.drawBackgroundAsset(this.episodeTransition.image, alpha);
    return true;
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
    return name === "검은 배경" || name === "꿈속" || name === "파미니 화면";
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
    this.configureQuickMenuButtons(items);

    for (const item of items) {
      if (item.label === "SAVE") {
        this.saveButton.draw();
        continue;
      }
      if (item.label === "LOAD") {
        this.loadQuickButton.draw();
        continue;
      }

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
    const labels = ["SAVE", "LOAD", "대사록"];
    const itemW = 66;
    const gap = 10;
    const startX = width - (labels.length * itemW + (labels.length - 1) * gap) - 28;

    return labels.map((label, index) => ({
      label,
      x: startX + index * (itemW + gap),
      y: menuY,
      w: itemW,
      h: 28
    }));
  }

  configureQuickMenuButtons(items) {
    const saveItem = items.find((item) => item.label === "SAVE");
    if (saveItem) {
      this.saveButton.x = saveItem.x;
      this.saveButton.y = saveItem.y;
      this.saveButton.w = saveItem.w;
      this.saveButton.h = saveItem.h;
      this.saveButton.label = "SAVE";
    }

    const loadItem = items.find((item) => item.label === "LOAD");
    if (loadItem) {
      this.loadQuickButton.x = loadItem.x;
      this.loadQuickButton.y = loadItem.y;
      this.loadQuickButton.w = loadItem.w;
      this.loadQuickButton.h = loadItem.h;
      this.loadQuickButton.label = "LOAD";
    }
  }

  drawChoiceOverlay(prompt, impactSummary = { type: "none", mixed: false }) {
    noStroke();
    fill(0, 0, 0, 92);
    rect(0, 0, width, height);

    const promptX = 290;
    const promptY = this.getChoicePromptY();
    const promptW = 700;
    const headerStyle = this.getChoiceHeaderStyle(impactSummary.type, impactSummary.mixed);
    const headerLayout = this.getChoiceHeaderLayout(promptX, promptY, headerStyle.label);

    fill(headerStyle.accent);
    rect(
      headerLayout.choiceBadge.x,
      headerLayout.choiceBadge.y,
      headerLayout.choiceBadge.w,
      headerLayout.choiceBadge.h,
      headerLayout.choiceBadge.radius
    );

    noStroke();
    fill("#ffffff");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    this.useFont("uiBold");
    textSize(12);
    text("CHOICE", headerLayout.choiceBadge.textX, headerLayout.choiceBadge.textY);

    if (headerLayout.labelBadge) {
      fill(headerStyle.fill);
      rect(
        headerLayout.labelBadge.x,
        headerLayout.labelBadge.y,
        headerLayout.labelBadge.w,
        headerLayout.labelBadge.h,
        headerLayout.labelBadge.radius
      );
      fill(headerStyle.text);
      textAlign(CENTER, CENTER);
      this.useFont("uiBold");
      textSize(11);
      text(headerStyle.label, headerLayout.labelBadge.textX, headerLayout.labelBadge.textY);
    }

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

  getChoiceHeaderLayout(x, y, label = "") {
    const height = 22;
    const choiceWidth = 72;
    const gap = 10;
    const labelWidth = 72;

    const choiceBadge = {
      x,
      y,
      w: choiceWidth,
      h: height,
      radius: height / 2,
      textX: x + choiceWidth / 2,
      textY: y + height / 2
    };

    return {
      choiceBadge,
      labelBadge: label ? {
        x: x + choiceWidth + gap,
        y,
        w: labelWidth,
        h: height,
        radius: height / 2,
        textX: x + choiceWidth + gap + labelWidth / 2,
        textY: y + height / 2
      } : null
    };
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
    const saveLoadLayout = this.getDopamineReadySaveLoadLayout();
    this.saveButton.x = saveLoadLayout.save.x;
    this.saveButton.y = saveLoadLayout.save.y;
    this.saveButton.w = saveLoadLayout.save.w;
    this.saveButton.h = saveLoadLayout.save.h;
    this.saveButton.label = "SAVE";
    this.saveButton.draw();
    this.loadQuickButton.x = saveLoadLayout.load.x;
    this.loadQuickButton.y = saveLoadLayout.load.y;
    this.loadQuickButton.w = saveLoadLayout.load.w;
    this.loadQuickButton.h = saveLoadLayout.load.h;
    this.loadQuickButton.label = "LOAD";
    this.loadQuickButton.draw();

    fill("#f6f1ff");
    textAlign(CENTER, CENTER);
    this.useFont("ui");
    textSize(20);
    text("하루가 끝나면 잠에 들고, 도파민 게임으로 마음을 정리합니다.", width / 2, 632);
  }

  getDopamineReadySaveLoadLayout() {
    const x = 826;
    const y = 516;
    const totalW = 312;
    const gap = 12;
    const buttonW = (totalW - gap) / 2;

    return {
      gap,
      save: { x, y, w: buttonW, h: 40 },
      load: { x: x + buttonW + gap, y, w: buttonW, h: 40 }
    };
  }

  drawPaminiBriefing() {
    if (this.drawBackgroundTransition()) return;

    this.drawPaminiBriefingBackground();
    fill(0, 0, 0, 104);
    rect(0, 0, width, height);

    this.ensurePaminiBriefingVisibleStarted();
    this.drawPaminiBriefingContent(this.getPaminiBriefingVisualAlpha());
    this.completePaminiBriefingFadeOutIfNeeded();
  }

  drawPaminiBriefingContent(alpha = 1) {
    if (alpha <= 0) return;

    push();
    const previousAlpha = drawingContext.globalAlpha;
    drawingContext.globalAlpha = previousAlpha * alpha;
    this.drawPaminiBriefingMascot();
    this.drawEpisodeBadge();

    const line = this.getPaminiBriefingTypewriterText();
    this.textBox.draw("파미니", line, "파미니");
    this.drawStoryQuickMenu();
    drawingContext.globalAlpha = previousAlpha;
    pop();
  }

  drawPaminiBriefingBackground() {
    if (this.getPaminiBriefingBackgroundName() === "꿈속") {
      this.drawDreamBackground();
      return;
    }

    this.drawSceneImage("bedroomNight", false);
  }

  getPaminiBriefingBackgroundName() {
    return "꿈속";
  }

  drawPaminiBriefingMascot() {
    const mascotImage = this.getCharacterAsset("파미니", "Normal");
    if (!mascotImage) return;

    const layout = this.getPaminiBriefingMascotLayout();
    new CharacterImage(mascotImage).draw(layout.index, layout.count, layout.yOffset);
  }

  getPaminiBriefingMascotLayout() {
    return {
      index: 0,
      count: 1,
      yOffset: -72
    };
  }

  handlePaminiBriefingClick() {
    if (this.logPanelOpen) {
      this.handleDialogueLogClick();
      return;
    }

    if (this.handleFunctionMenuClick()) return;
    this.advancePaminiBriefing();
  }

  startPaminiBriefingBeforeReady() {
    if (this.shouldSkipPaminiBriefing()) {
      this.paminiBriefing = null;
      this.changeScene(SCENES.DOPAMINE_READY);
      return;
    }

    const snapshot = {
      dopamine: this.state.dopamine,
      affectionDelta: this.state.episodeAffectionDelta || 0,
      episodeId: this.state.episodeId
    };
    this.paminiBriefing = {
      lines: this.buildPaminiBriefingLines(snapshot),
      index: 0,
      snapshot,
      visibleStartedAt: null,
      fadeOutStartedAt: null
    };
    this.changeScene(SCENES.PAMINI_BRIEFING);
    this.startPaminiBriefingTransition();
  }

  shouldSkipPaminiBriefing() {
    return this.getEpisodeNumber() <= 1;
  }

  buildPaminiBriefingLines(snapshot) {
    const briefingLines = [
      this.getPaminiAffectionBriefingLine(snapshot),
      this.getPaminiDopamineBriefingLine(snapshot.dopamine),
      "앞으로 매일 밤 이렇게 잠깐 나타날게. 하루 동안 네 감정이 어떤 방향으로 움직였는지 같이 정리해보자.",
      "그럼 이제 꿈속에서 내일의 도파민을 다시 맞춰보자. 너무 무기력하지도, 너무 과열되지도 않게."
    ];

    return this.buildPaminiFirstMeetingLines(snapshot).concat(briefingLines);
  }

  buildPaminiFirstMeetingLines(snapshot) {
    return [
      "안녕, 오늘도 도파민 점검하러 파미니가 왔어!",
      this.getPaminiFirstMeetingEmotionLine(snapshot.dopamine)
    ];
  }

  getPaminiFirstMeetingEmotionLine(dopamine) {
    const dopamineState = this.getDopamineState(dopamine);
    if (dopamineState === "LOW") return "오늘 하루 감정은 조금 가라앉아 있었던 것 같아. 말보다 망설임이 먼저 온 순간들이 있었지.";
    if (dopamineState === "HIGH") return "오늘 하루 감정은 꽤 달아올라 있었던 것 같아. 설렘이 먼저 튀어나오려는 순간들이 있었지.";
    return "오늘 하루 감정은 꽤 적당한 온도였던 것 같아. 설렘과 침착함이 같이 남아 있었지.";
  }

  getPaminiAffectionBriefingLine(snapshot) {
    const delta = snapshot.affectionDelta || 0;
    const dopamineState = this.getDopamineState(snapshot.dopamine);

    const lines = {
      positive: {
        LOW: "수진이와 가까워졌지만, 도파민이 낮아서 기회를 놓친 순간도 있었던 것 같아.",
        OPT: "오늘은 적절한 도파민으로 좋은 흐름을 잘 이어간 것 같아.",
        HIGH: "수진이와 더 가까워졌지만, 높은 도파민으로 감정이 조금 앞섰던 순간도 있었어."
      },
      neutral: {
        LOW: "낮은 도파민으로 기회를 놓쳤고, 그래서 관계는 제자리였던 것 같아.",
        OPT: "적절한 도파민 흐름을 유지했지만, 관계는 아직 제자리인 것 같아.",
        HIGH: "도파민이 높아서 감정이 앞섰는데, 관계는 아직 제자리였던 것 같아."
      },
      negative: {
        LOW: "도파민이 낮아 기회를 놓친 순간이 있었고, 상대와 박자가 어긋났던 것 같아.",
        OPT: "적절한 도파민 흐름을 유지했지만, 오늘은 선택의 결이 조금 엇갈린 것 같아.",
        HIGH: "높은 도파민으로 감정이 앞서면서 상대와 박자가 어긋난 순간이 있었어."
      }
    };

    const affectionState = delta > 0 ? "positive" : (delta < 0 ? "negative" : "neutral");
    return lines[affectionState][dopamineState];
  }

  getPaminiDopamineBriefingLine(dopamine) {
    const dopamineState = this.getDopamineState(dopamine);
    if (dopamineState === "LOW") return "내일은 조금 더 적극적으로 움직여보자.";
    if (dopamineState === "HIGH") return "내일은 앞서가는 마음을 붙잡고, 조금 더 신중하게 행동해보자.";
    return "내일도 이 균형을 지켜줘!";
  }

  startPaminiBriefingTransition() {
    this.startBackgroundTransition(
      this.getBackgroundAsset(this.state.background),
      null,
      {
        type: "fadeBlack",
        duration: 900,
        fromName: this.state.background,
        toName: this.getPaminiBriefingBackgroundName()
      }
    );
  }

  ensurePaminiBriefingVisibleStarted() {
    if (!this.paminiBriefing || this.paminiBriefing.visibleStartedAt != null) return;
    this.paminiBriefing.visibleStartedAt = this.getTimeMs();
  }

  getPaminiBriefingFadeDuration() {
    return 420;
  }

  getPaminiBriefingVisualAlpha() {
    if (!this.paminiBriefing) return 0;

    const duration = this.getPaminiBriefingFadeDuration();
    const now = this.getTimeMs();

    if (this.paminiBriefing.fadeOutStartedAt != null) {
      const progress = (now - this.paminiBriefing.fadeOutStartedAt) / duration;
      return constrain(1 - progress, 0, 1);
    }

    if (this.paminiBriefing.visibleStartedAt == null) return 0;

    const progress = (now - this.paminiBriefing.visibleStartedAt) / duration;
    return constrain(progress, 0, 1);
  }

  getCurrentPaminiBriefingLine() {
    const briefing = this.paminiBriefing;
    if (!briefing || !briefing.lines.length) return "";
    return briefing.lines[briefing.index] || "";
  }

  getPaminiBriefingTypewriterText() {
    const briefing = this.paminiBriefing;
    const nodeKey = `PAMINI_BRIEFING#${briefing ? briefing.index : 0}`;
    const fullText = this.getCurrentPaminiBriefingLine();
    return this.updateTypewriter(nodeKey, fullText, () => {
      this.addDialogueLog({
        speaker: "파미니",
        text: fullText
      }, fullText, nodeKey);
    });
  }

  advancePaminiBriefing() {
    if (this.backgroundTransition || (this.paminiBriefing && this.paminiBriefing.fadeOutStartedAt != null)) return;

    if (!this.paminiBriefing) {
      this.changeScene(SCENES.DOPAMINE_READY);
      return;
    }

    if (!this.isTypewriterComplete()) {
      this.completeTypewriter();
      return;
    }

    if (this.paminiBriefing.index >= this.paminiBriefing.lines.length - 1) {
      this.startPaminiBriefingFadeOut();
      return;
    }

    this.paminiBriefing.index += 1;
    this.resetTypewriter();
  }

  startPaminiBriefingFadeOut() {
    if (!this.paminiBriefing || this.paminiBriefing.fadeOutStartedAt != null) return;
    this.paminiBriefing.fadeOutStartedAt = this.getTimeMs();
  }

  completePaminiBriefingFadeOutIfNeeded() {
    if (!this.paminiBriefing || this.paminiBriefing.fadeOutStartedAt == null) return false;
    if (this.getTimeMs() - this.paminiBriefing.fadeOutStartedAt < this.getPaminiBriefingFadeDuration()) return false;

    this.finishPaminiBriefing();
    return true;
  }

  finishPaminiBriefing() {
    this.paminiBriefing = null;
    this.changeScene(SCENES.DOPAMINE_READY);
  }

  isAdvanceKey() {
    const currentKey = typeof key !== "undefined" ? key : "";
    const currentKeyCode = typeof keyCode !== "undefined" ? keyCode : null;
    return currentKey === "Enter" || currentKey === " " || currentKeyCode === 13 || currentKeyCode === 32;
  }

  handleDopamineReadyClick() {
    if (this.pressButton(this.saveButton)) return;
    if (this.pressButton(this.loadQuickButton)) return;
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
    if (!activeSpeaker || activeSpeaker === "주인공" || activeSpeaker === "독백" || activeSpeaker === "나레이션" || activeSpeaker === "지시문") return;

    const characterImage = this.character[activeSpeaker];
    if (!characterImage) return;

    characterImage.drawChatBustLeft();
  }

  processStoryCommandNodes() {
    if (this.isBackgroundTransitionActive()) return null;
    if (this.isEpisodeTransitionActive()) return null;

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
          this.startPaminiBriefingBeforeReady();
          return null;
        }

        this.moveTo(node.next, node.nextNode);
        if (this.isEpisodeTransitionActive()) return null;
        processed = true;
        node = this.getCurrentNode();
        continue;
      }

      this.advanceCurrentNode();
      processed = true;
      node = this.getCurrentNode();
    }

    if (node && node.type === NODE_TYPES.CHOICE && (processed || this.needsChoiceButtonRefresh(node))) {
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
    this.retryPendingBgmPlayback();

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

  retryPendingBgmPlayback() {
    if (!this.pendingBgmNode || !this.state.currentBgm) return;

    const sound = this.getSoundAsset(this.state.currentBgm, "bgm");
    if (!sound) return;
    if (typeof sound.isLoaded === "function" && !sound.isLoaded()) return;

    this.playBgmSound(this.pendingBgmNode, sound);
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
    const previousEpisodeId = this.state.episodeId;
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
    if (previousEpisodeId !== targetEpisodeId) {
      this.stopCurrentBgm();
      this.state.episodeAffectionDelta = 0;
      if (targetNodeIndex === 0) {
        this.startEpisodeTransition(targetEpisodeId);
      }
    }
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

    if (condition.dopamineState !== undefined && !this.matchesDopamineState(condition.dopamineState)) return false;
    if (condition.dopamineMin !== undefined && this.state.dopamine < condition.dopamineMin) return false;
    if (condition.dopamineMax !== undefined && this.state.dopamine > condition.dopamineMax) return false;
    if (condition.affectionMin !== undefined && this.state.affection < condition.affectionMin) return false;
    if (condition.affectionMax !== undefined && this.state.affection > condition.affectionMax) return false;

    return true;
  }

  matchesDopamineState(expectedState) {
    const expectedStates = Array.isArray(expectedState) ? expectedState : [expectedState];
    const currentState = this.getDopamineState(this.state.dopamine);

    return expectedStates.some((state) => String(state || "").toUpperCase() === currentState);
  }

  getDopamineState(value) {
    if (value < 50) return "LOW";
    if (value <= 80) return "OPT";
    return "HIGH";
  }

  handleStoryClick() {
    if (this.logPanelOpen) {
      this.handleDialogueLogClick();
      return;
    }

    if (this.isBackgroundTransitionActive()) return;

    if (this.handleFunctionMenuClick()) return;

    const node = this.getCurrentNode();

    if (node.type === NODE_TYPES.DIALOGUE) {
      if (!this.isTypewriterComplete()) {
        this.completeTypewriter();
        return;
      }

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
    if (label === "SAVE") {
      this.openSaveSlotOverlay();
      return;
    }
    if (label === "LOAD") {
      this.openLoadSlotOverlay();
      return;
    }
    if (label === "대사록") {
      this.openDialogueLog();
    }
  }

  handleFunctionMenuClick() {
    if (this.saveButton && this.saveButton.contains(mouseX, mouseY)) {
      this.saveButton.mousePressed();
      return true;
    }

    if (this.loadQuickButton && this.loadQuickButton.contains(mouseX, mouseY)) {
      this.loadQuickButton.mousePressed();
      return true;
    }

    const quickMenuItem = this.getStoryQuickMenuItemAt(mouseX, mouseY);
    if (!quickMenuItem) return false;
    this.handleStoryQuickMenu(quickMenuItem.label);
    return true;
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

      const speaker = entry.speaker || "";
      const speakerColor = this.getSpeakerColor(entry.speakerKey);
      if (speaker) {
        fill(speakerColor);
        textAlign(LEFT, TOP);
        textStyle(BOLD);
        this.useFont("dialogueBold");
        textSize(15);
        text(speaker, rowX, y);
      }

      fill("#ffffff");
      textStyle(NORMAL);
      this.useFont("dialogue");
      textSize(18);
      textLeading(24);
      text(entry.text, speaker ? rowX + 94 : rowX, y - 2, speaker ? rowW - 104 : rowW, rowH - 8);
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
    if (!this.typewriter) return;
    this.typewriter.nodeKey = null;
    this.typewriter.visibleChars = 0;
    this.typewriter.fullText = "";
  }

  getTypewriterText(node) {
    const fullText = this.formatDialogueText(node.text, node.speaker);
    const nodeKey = this.getDialogueNodeKey(node);

    return this.updateTypewriter(nodeKey, fullText, () => {
      this.addDialogueLog(node, fullText, nodeKey);
      this.applyDialogueEffectsOnDisplay(node, nodeKey);
    });
  }

  updateTypewriter(nodeKey, fullText, onStart = null) {
    if (!this.typewriter) return fullText;
    if (this.typewriter.nodeKey !== nodeKey) {
      this.typewriter.nodeKey = nodeKey;
      this.typewriter.visibleChars = 0;
      this.typewriter.fullText = fullText;
      if (onStart) onStart();
    }

    const chars = Array.from(this.typewriter.fullText);
    const frameScale = typeof deltaTime === "number" ? deltaTime / 16.67 : 1;
    this.typewriter.visibleChars = min(chars.length, this.typewriter.visibleChars + this.typewriter.speed * frameScale);
    return chars.slice(0, floor(this.typewriter.visibleChars)).join("");
  }

  isTypewriterComplete() {
    if (!this.typewriter) return true;
    if (!this.typewriter.fullText) return true;
    return this.typewriter.visibleChars >= Array.from(this.typewriter.fullText).length;
  }

  completeTypewriter() {
    if (!this.typewriter) return;
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

  applyDialogueEffectsOnDisplay(node, nodeKey) {
    if (!node || !node.effects) return;
    if (!this.appliedDialogueEffectKeys) this.appliedDialogueEffectKeys = new Set();
    if (this.appliedDialogueEffectKeys.has(nodeKey)) return;

    this.appliedDialogueEffectKeys.add(nodeKey);
    this.applyEffects(node.effects);
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
    this.choiceButtonsNodeKey = null;

    if (!node || node.type !== NODE_TYPES.CHOICE) return;

    this.choiceButtonsNodeKey = this.getChoiceNodeKey(node);
    const choiceItems = this.getVisibleChoiceItems(node);
    const impactSummary = this.getChoiceImpactSummaryFromItems(choiceItems);
    const frameStyle = this.getChoiceButtonFrameStyle(impactSummary.type);
    const buttonW = 700;
    const buttonH = 56;
    const gap = 12;
    const blockH = choiceItems.length * buttonH + max(0, choiceItems.length - 1) * gap;
    const startY = constrain(720 - 98 - blockH, 398, 486);

    choiceItems.forEach((item, index) => {
      const choice = item.choice;
      const choiceNumber = String(index + 1).padStart(2, "0");
      const choiceText = this.formatStoryText(choice.text);
      const lockedStyle = this.getLockedChoiceStyle(item.lockReason);
      const button = new Button((width - buttonW) / 2, startY + index * (buttonH + gap), buttonW, buttonH, `${choiceNumber}   ${choiceText}`, () => {
        this.addChoiceLog(choice, choiceText);
        if (choice.sound) this.handleSoundNode({ type: NODE_TYPES.SOUND, ...choice.sound });
        this.applyEffects(choice.effects);
        this.queueChoiceFollow(choice.follow);

        this.goToChoiceTarget(choice);
      }, {
        fill: "rgba(246, 247, 251, 0.9)",
        hoverFill: frameStyle.hoverFill,
        stroke: frameStyle.stroke,
        hoverStroke: frameStyle.hoverStroke,
        strokeWeight: 1.4,
        hoverStrokeWeight: 3,
        text: "#2b3142",
        hoverText: "#171b26",
        radius: 12,
        textSize: 19,
        fontRole: "dialogueBold",
        align: "left",
        paddingX: 28,
        disabled: item.disabled,
        disabledFill: lockedStyle.fill,
        disabledStroke: lockedStyle.stroke,
        disabledStrokeWeight: lockedStyle.strokeWeight,
        disabledText: lockedStyle.text,
        suffix: "",
        suffixW: 120
      });

      this.choiceButtons.push(button);
    });
  }

  needsChoiceButtonRefresh(node) {
    return this.choiceButtons.length === 0 || this.choiceButtonsNodeKey !== this.getChoiceNodeKey(node);
  }

  getChoiceNodeKey(node) {
    const nodeKey = node && node.id !== undefined ? node.id : this.state.nodeIndex;
    return `${this.state.episodeId}:${nodeKey}`;
  }

  getVisibleChoiceItems(node) {
    const choices = Array.isArray(node.choices) ? node.choices : [];
    return choices.flatMap((choice) => {
      if (this.canChoose(choice)) {
        return [{ choice, disabled: false, lockReason: "" }];
      }

      const lockReason = this.getDisabledPreviewLockReason(choice);
      if (!lockReason) return [];

      return [{ choice, disabled: true, lockReason }];
    });
  }

  getDisabledPreviewLockReason(choice) {
    if (!choice || choice.disabledPreview !== true) return "";

    const choiceStates = this.getChoiceDopamineStates(choice);
    const currentState = this.getDopamineState(this.state.dopamine);
    if (choiceStates.includes("OPT") && currentState === "LOW") return "low";
    if (choiceStates.includes("OPT") && currentState === "HIGH") return "high";
    if (choiceStates.includes("HIGH") && currentState === "OPT") return "low";
    return "";
  }

  getChoiceDopamineStates(choice) {
    const state = choice && choice.condition ? choice.condition.dopamineState : null;
    const states = Array.isArray(state) ? state : [state];
    return states.map((entry) => String(entry || "").toUpperCase()).filter(Boolean);
  }

  getChoiceImpact(choice) {
    const effects = { dopamine: 0, affection: 0 };
    this.addChoiceEffects(effects, choice.effects);

    const follow = Array.isArray(choice.follow) ? choice.follow : [];
    follow.forEach((line) => {
      this.addChoiceEffects(effects, line.effects);
    });

    if (effects.affection !== 0) return { type: "affection", effects };
    if (effects.dopamine !== 0) return { type: "dopamine", effects };
    return { type: "none", effects };
  }

  getChoiceImpactSummary(choices) {
    const types = choices.map((choice) => this.getChoiceImpact(choice).type);
    if (types.includes("affection")) {
      return { type: "affection", mixed: types.some((type) => type !== "affection") };
    }
    if (types.includes("dopamine")) {
      return { type: "dopamine", mixed: types.some((type) => type !== "dopamine") };
    }
    return { type: "none", mixed: false };
  }

  getChoiceImpactSummaryFromItems(choiceItems) {
    const enabledChoices = choiceItems
      .filter((item) => !item.disabled)
      .map((item) => item.choice);
    return this.getChoiceImpactSummary(enabledChoices);
  }

  addChoiceEffects(totalEffects, effects = {}) {
    if (!effects) return;
    if (effects.dopamine !== undefined) totalEffects.dopamine += effects.dopamine;
    if (effects.affection !== undefined) totalEffects.affection += effects.affection;
  }

  getChoiceHeaderStyle(type, mixed = false) {
    const styles = {
      none: {
        accent: "#9aa1b3",
        fill: "rgba(246, 247, 251, 0.86)",
        text: "#545d70",
        label: ""
      },
      dopamine: {
        accent: "#ffd166",
        fill: "rgba(255, 209, 102, 0.2)",
        text: "#ffe39a",
        label: "도파민 변화"
      },
      affection: {
        accent: "#ff6fa9",
        fill: "rgba(255, 111, 169, 0.22)",
        text: "#ffd1e6",
        label: "호감도 변화"
      }
    };

    return styles[type] || styles.none;
  }

  getChoiceButtonFrameStyle(type) {
    const styles = {
      none: {
        stroke: "rgba(255, 255, 255, 0.56)",
        hoverStroke: "rgba(255, 255, 255, 0.98)",
        hoverFill: "rgba(255, 255, 255, 0.99)"
      },
      dopamine: {
        stroke: "rgba(255, 209, 102, 0.78)",
        hoverStroke: "rgba(255, 209, 102, 1)",
        hoverFill: "rgba(255, 248, 221, 0.98)"
      },
      affection: {
        stroke: "rgba(255, 111, 169, 0.8)",
        hoverStroke: "rgba(255, 111, 169, 1)",
        hoverFill: "rgba(255, 240, 247, 0.98)"
      }
    };

    return styles[type] || styles.none;
  }

  getLockedChoiceStyle(reason) {
    const styles = {
      low: {
        fill: "rgba(58, 59, 68, 0.72)",
        stroke: "rgba(125, 135, 158, 0.62)",
        strokeWeight: 1.2,
        text: "rgba(220, 224, 235, 0.5)",
        suffix: "도파민 낮음"
      },
      high: {
        fill: "rgba(58, 59, 68, 0.72)",
        stroke: "rgba(125, 135, 158, 0.62)",
        strokeWeight: 1.2,
        text: "rgba(220, 224, 235, 0.5)",
        suffix: "도파민 높음"
      }
    };

    return styles[reason] || styles.low;
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
      this.startPaminiBriefingBeforeReady();
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
      if (line.background) {
        nodes.push({
          type: NODE_TYPES.BACKGROUND,
          name: line.background,
          transition: line.transition
        });
      }
      if (line.clearCharacters) {
        nodes.push({
          type: NODE_TYPES.CLEAR_CHARACTERS
        });
      }
      if (Array.isArray(line.characters)) {
        line.characters.forEach((character) => {
          if (!character || !character.name) return;
          nodes.push({
            type: NODE_TYPES.CHARACTER_IN,
            name: character.name,
            emotion: character.emotion
          });
        });
      }
      if (line.sound) {
        nodes.push({
          type: NODE_TYPES.SOUND,
          ...line.sound
        });
      }
      if (line.text || line.speaker) {
        nodes.push({
          type: NODE_TYPES.DIALOGUE,
          speaker: line.speaker,
          text: line.text,
          effects: line.effects
        });
      }
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
    const minigameAssets = this.getSubGameAssets(subGameId);
    this.subGame = new SubGameClass(this.state.dopamine, this.getPlayableSubGameOptions(options), minigameAssets);
  }

  getSubGameAssets(subGameId) {
    const minigameAssets = (this.assets.minigames && this.assets.minigames[subGameId]) || {};
    if (subGameId !== SUB_GAMES.BRICK_BREAKER) return minigameAssets;

    return {
      ...minigameAssets,
      sounds: {
        ...(minigameAssets.sounds || {}),
        brickHit: this.getSoundAsset("gameEffect", "effects")
      }
    };
  }

  createMinigameTutorial(options) {
    if (typeof MinigameTutorialOverlay !== "function") return null;
    if (!options || options.tutorial === undefined) return null;
    const tutorial = MinigameTutorialOverlay.fromOptions(options);
    return tutorial && tutorial.isActive() ? tutorial : null;
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
    const panelH = 176;
    const panelY = height - panelH - 42;
    const panelW = width - panelX - 72;
    const textX = panelX + 28;
    const textY = panelY + 58;
    const textW = panelW - 56;
    const textH = panelH - 96;

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
    const layout = this.getTutorialTextLayout(step.text || "", textW, textH);
    textSize(layout.size);
    textLeading(layout.leading);
    layout.lines.forEach((line, index) => {
      text(line, textX, textY + index * layout.leading);
    });

    fill(255, 255, 255, 164);
    textAlign(RIGHT, BOTTOM);
    this.useFont("ui");
    textSize(15);
    text("클릭 또는 아무 키", panelX + panelW - 24, panelY + panelH - 18);
  }

  getTutorialTextLayout(text, maxWidth, maxHeight) {
    const sizes = [24, 22, 20, 18, 16];
    for (const size of sizes) {
      textSize(size);
      const leading = Math.round(size * 1.35);
      const lines = this.wrapTutorialText(text, maxWidth);
      if (lines.length * leading <= maxHeight) {
        return { size, leading, lines };
      }
    }

    const size = sizes[sizes.length - 1];
    textSize(size);
    const leading = Math.round(size * 1.35);
    const maxLines = Math.max(1, Math.floor(maxHeight / leading));
    const lines = this.wrapTutorialText(text, maxWidth);
    return {
      size,
      leading,
      lines: this.truncateTutorialLines(lines, maxLines, maxWidth)
    };
  }

  wrapTutorialText(text, maxWidth) {
    const paragraphs = String(text || "").split(/\n/);
    const lines = [];

    paragraphs.forEach((paragraph) => {
      const chars = Array.from(paragraph.trim());
      if (chars.length === 0) {
        lines.push("");
        return;
      }

      let line = "";
      chars.forEach((char) => {
        const nextLine = line + char;
        if (line && this.measureTutorialText(nextLine) > maxWidth) {
          lines.push(line.trimEnd());
          line = char.trimStart();
          return;
        }
        line = nextLine;
      });
      if (line) lines.push(line.trimEnd());
    });

    return lines.length ? lines : [""];
  }

  truncateTutorialLines(lines, maxLines, maxWidth) {
    if (lines.length <= maxLines) return lines;
    const visibleLines = lines.slice(0, maxLines);
    const lastIndex = visibleLines.length - 1;
    visibleLines[lastIndex] = this.fitTutorialEllipsis(visibleLines[lastIndex], maxWidth);
    return visibleLines;
  }

  fitTutorialEllipsis(line, maxWidth) {
    let fitted = line;
    while (fitted.length > 0 && this.measureTutorialText(fitted + "...") > maxWidth) {
      fitted = Array.from(fitted).slice(0, -1).join("");
    }
    return `${fitted.trimEnd()}...`;
  }

  measureTutorialText(text) {
    if (typeof textWidth === "function") return textWidth(text);
    return Array.from(String(text || "")).length * 14;
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

    this.cleanupSubGame();
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
      const before = this.state.affection;
      this.state.affection = constrain(this.state.affection + effects.affection, 0, 100);
      this.state.episodeAffectionDelta = (this.state.episodeAffectionDelta || 0) + this.state.affection - before;
      this.showAffectionDeltaPopup(this.state.affection - before);
    }
  }

  showAffectionDeltaPopup(amount) {
    if (amount === 0) return;

    this.affectionDeltaPopup = {
      amount,
      label: this.getAffectionDeltaLabel(amount),
      startedAt: this.getTimeMs(),
      duration: 1600
    };
  }

  getAffectionDeltaLabel(amount) {
    if (amount >= 10) return "호감도 대폭증가";
    if (amount > 0) return "호감도 소폭증가";
    if (amount <= -10) return "호감도 대폭감소";
    return "호감도 소폭감소";
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
      { from: 0, to: 50, color: "#70d7aa" },
      { from: 50, to: 81, color: "#ffd166" },
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
    const popupX = this.textBox.x + 76;
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

  drawStatDeltaPopups() {
    this.drawDopamineDeltaPopup();
    this.drawAffectionDeltaPopup();
  }

  drawAffectionDeltaPopup() {
    if (!this.affectionDeltaPopup) return;

    const elapsed = this.getTimeMs() - this.affectionDeltaPopup.startedAt;
    if (elapsed >= this.affectionDeltaPopup.duration) {
      this.affectionDeltaPopup = null;
      return;
    }

    const progress = elapsed / this.affectionDeltaPopup.duration;
    const fadeProgress = progress < 0.35 ? 0 : (progress - 0.35) / 0.65;
    const alpha = 255 * (1 - fadeProgress);
    const offsetY = -16 * progress;
    const scaleAmount = 1 + 0.08 * (1 - Math.min(1, progress * 4));
    const positive = this.affectionDeltaPopup.amount > 0;
    const popupW = 172;
    const popupH = 38;
    const popupX = this.textBox.x + 222;
    const popupY = this.textBox.y - 50 + offsetY;

    push();
    translate(popupX + popupW / 2, popupY + popupH / 2);
    scale(scaleAmount);
    noStroke();
    fill(0, 0, 0, alpha * 0.62);
    rect(-popupW / 2, -popupH / 2, popupW, popupH, 19);
    fill(positive ? 255 : 132, positive ? 153 : 198, positive ? 210 : 255, alpha);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    this.useFont("uiBold");
    textSize(18);
    text(this.affectionDeltaPopup.label, 0, 0);
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
    return this.getEpisodeNumberFromId(this.state.episodeId);
  }

  getEpisodeNumberFromId(episodeId) {
    const match = String(episodeId || "").match(/EP(\d+)/);
    return match ? Number(match[1]) : 99;
  }

  getEpisodeProgress() {
    const nodes = EPISODES[this.state.episodeId] || [];
    if (!nodes.length) return 0;
    return constrain((this.state.nodeIndex / max(1, nodes.length - 1)) * 100, 0, 100);
  }

  formatSpeaker(speaker) {
    if (speaker === "독백" || speaker === "주인공") return this.state.playerName || "주인공";
    if (speaker === "나레이션" || speaker === "지시문") return "";
    return speaker || "";
  }

  getSpeakerColor(speaker) {
    const colors = {
      수진: "#f48fb1",
      혜지: "#b39ddb",
      건호: "#90caf9",
      주인공: "#ffffff",
      나레이션: "#cfd8dc",
      지시문: "#cfd8dc",
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
    const playerName = this.state.playerName || "진수";
    if (typeof window !== "undefined" && window.KoreanJosa) {
      return window.KoreanJosa.replaceNameTokens(text, playerName);
    }
    return (text || "").replace(/000|OO|(?<!\d)00(?!\d)/g, playerName);
  }

  formatDialogueText(text, speaker) {
    const formattedText = this.formatStoryText(text);
    if (speaker !== "독백") return formattedText;
    return this.wrapMonologueText(formattedText);
  }

  wrapMonologueText(text) {
    const trimmedText = (text || "").trim();
    if (!trimmedText) return "";
    if (trimmedText.startsWith("(") && trimmedText.endsWith(")")) return trimmedText;
    return `(${trimmedText})`;
  }

  getSaveSlotCount() {
    return 5;
  }

  getSaveSlotsStorageKey() {
    return "dopaSaveSlots";
  }

  readSaveSlots() {
    const emptySlots = Array(this.getSaveSlotCount()).fill(null);
    const raw = localStorage.getItem(this.getSaveSlotsStorageKey());
    if (!raw) return emptySlots;

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return emptySlots;
      return emptySlots.map((_, index) => this.normalizeSaveSlot(parsed[index]));
    } catch (error) {
      console.warn("Cannot read save slots", error);
      return emptySlots;
    }
  }

  normalizeSaveSlot(slot) {
    if (!slot || typeof slot !== "object" || !slot.snapshot) return null;
    return {
      savedAt: slot.savedAt || "",
      label: slot.label || "",
      snapshot: slot.snapshot
    };
  }

  writeSaveSlots(slots) {
    const normalizedSlots = Array(this.getSaveSlotCount()).fill(null).map((_, index) => this.normalizeSaveSlot(slots[index]));
    localStorage.setItem(this.getSaveSlotsStorageKey(), JSON.stringify(normalizedSlots));
  }

  isValidSaveSlotNumber(slotNumber) {
    return Number.isInteger(slotNumber) && slotNumber >= 1 && slotNumber <= this.getSaveSlotCount();
  }

  canSaveSnapshotNow() {
    return this.state.scene === SCENES.STORY ||
      this.state.scene === SCENES.PAMINI_BRIEFING ||
      this.state.scene === SCENES.DOPAMINE_READY;
  }

  createSaveSnapshot() {
    if (!this.canSaveSnapshotNow()) return null;
    return {
      scene: this.state.scene,
      episodeId: this.state.episodeId,
      nodeIndex: this.state.nodeIndex,
      dopamine: this.state.dopamine,
      affection: this.state.affection,
      episodeAffectionDelta: this.state.episodeAffectionDelta || 0,
      playerName: this.state.playerName || "진수",
      background: this.state.background,
      characters: this.state.characters,
      currentBgm: this.state.currentBgm || null,
      paminiBriefing: this.createPaminiBriefingSnapshot(),
      selectedSubGame: this.state.selectedSubGame || null,
      selectedSubGameReturn: this.state.selectedSubGameReturn || null,
      selectedSubGameReturnNode: this.state.selectedSubGameReturnNode || null,
      selectedSubGameOptions: this.state.selectedSubGameOptions || null,
      appliedDialogueEffectKeys: Array.from(this.appliedDialogueEffectKeys || [])
    };
  }

  saveSnapshot() {
    const snapshot = this.createSaveSnapshot();
    if (!snapshot) return false;
    localStorage.setItem("dopaSave", JSON.stringify(snapshot));
    localStorage.setItem("dopaPlayerName", snapshot.playerName);
    return true;
  }

  saveToSlot(slotNumber) {
    if (!this.isValidSaveSlotNumber(slotNumber)) return false;
    const snapshot = this.createSaveSnapshot();
    if (!snapshot) return false;

    const slots = this.readSaveSlots();
    slots[slotNumber - 1] = {
      savedAt: new Date().toISOString(),
      label: this.getSaveSlotLabel(snapshot),
      snapshot
    };
    this.writeSaveSlots(slots);
    localStorage.setItem("dopaSave", JSON.stringify(snapshot));
    localStorage.setItem("dopaPlayerName", snapshot.playerName);
    this.closeSaveSlotOverlay();
    return true;
  }

  getSaveSlotLabel(snapshot) {
    const sceneLabel = snapshot.scene === SCENES.DOPAMINE_READY ? "도파민 준비" : "스토리";
    return `${sceneLabel} · ${snapshot.episodeId || "EP"}`;
  }

  loadSnapshot() {
    return this.loadSnapshotRaw(localStorage.getItem("dopaSave"));
  }

  loadFromSlot(slotNumber) {
    if (this.state.scene === SCENES.MINIGAME || !this.isValidSaveSlotNumber(slotNumber)) return false;
    const slot = this.readSaveSlots()[slotNumber - 1];
    if (!slot || !slot.snapshot) return false;
    const loaded = this.applySaveSnapshot(slot.snapshot);
    if (loaded) this.closeSaveSlotOverlay();
    return loaded;
  }

  loadSnapshotRaw(raw) {
    if (!raw) {
      this.showNameEntry();
      return false;
    }

    try {
      return this.applySaveSnapshot(JSON.parse(raw));
    } catch (error) {
      console.warn("Cannot load save data", error);
      this.showNameEntry();
      return false;
    }
  }

  applySaveSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== "object") return false;

    this.state.episodeId = EPISODES[snapshot.episodeId] ? snapshot.episodeId : this.getStartEpisodeId();
    this.state.nodeIndex = snapshot.nodeIndex || 0;
    this.state.dopamine = snapshot.dopamine ?? CONFIG.initialDopamine;
    this.state.affection = snapshot.affection ?? CONFIG.initialAffection;
    this.state.episodeAffectionDelta = snapshot.episodeAffectionDelta || 0;
    this.state.playerName = snapshot.playerName || "진수";
    this.state.pendingNodes = [];
    const savedBgm = snapshot.currentBgm || null;
    this.state.selectedSubGame = snapshot.selectedSubGame || null;
    this.state.selectedSubGameReturn = snapshot.selectedSubGameReturn || null;
    this.state.selectedSubGameReturnNode = snapshot.selectedSubGameReturnNode || null;
    this.state.selectedSubGameOptions = snapshot.selectedSubGameOptions || null;
    this.appliedDialogueEffectKeys = new Set(Array.isArray(snapshot.appliedDialogueEffectKeys) ? snapshot.appliedDialogueEffectKeys : []);
    this.state.characters = Array.isArray(snapshot.characters) ? snapshot.characters : [];
    this.character = {};
    this.state.characters.forEach((name) => {
      const image = this.getCharacterAsset(name, "일반");
      this.character[name] = image ? new CharacterImage(image) : null;
    });
    this.state.background = snapshot.background || null;
    const image = this.assets.backgrounds[this.state.background];
    this.backgroundImage = image ? new BackgroundImage(image) : null;
    this.choiceButtons = [];
    this.choiceButtonsNodeKey = null;
    this.subGame = null;
    this.minigameTutorial = null;
    this.paminiBriefing = this.restorePaminiBriefingSnapshot(snapshot.paminiBriefing);
    this.backgroundTransition = null;
    this.episodeTransition = null;
    this.pendingBgmNode = null;
    this.dopamineDeltaPopup = null;
    this.affectionDeltaPopup = null;
    this.titleReturnConfirmOpen = false;
    localStorage.setItem("dopaPlayerName", this.state.playerName);

    const scene = this.normalizeLoadedScene(snapshot.scene);
    this.changeScene(scene);
    this.restoreBgmFromSave(savedBgm);
    return true;
  }

  restoreBgmFromSave(bgmName) {
    if (!bgmName) {
      this.stopCurrentBgm();
      return;
    }

    this.handleBgmNode({
      type: NODE_TYPES.SOUND,
      soundType: "bgm",
      name: bgmName
    }, "play");
  }

  normalizeLoadedScene(scene) {
    if (scene === SCENES.PAMINI_BRIEFING) return SCENES.PAMINI_BRIEFING;
    if (scene === SCENES.DOPAMINE_READY) return SCENES.DOPAMINE_READY;
    return SCENES.STORY;
  }

  createPaminiBriefingSnapshot() {
    if (this.state.scene !== SCENES.PAMINI_BRIEFING || !this.paminiBriefing) return null;
    return {
      lines: Array.isArray(this.paminiBriefing.lines) ? [...this.paminiBriefing.lines] : [],
      index: this.paminiBriefing.index || 0,
      snapshot: this.paminiBriefing.snapshot || {},
      visibleStartedAt: null,
      fadeOutStartedAt: null
    };
  }

  restorePaminiBriefingSnapshot(briefing) {
    if (!briefing || typeof briefing !== "object") return null;
    return {
      lines: Array.isArray(briefing.lines) ? [...briefing.lines] : [],
      index: briefing.index || 0,
      snapshot: briefing.snapshot || {},
      visibleStartedAt: null,
      fadeOutStartedAt: null
    };
  }

  openSaveSlotOverlay() {
    if (!this.canSaveSnapshotNow()) return false;
    this.saveSlotOverlay = { mode: "save", message: "" };
    return true;
  }

  openLoadSlotOverlay() {
    if (this.state.scene === SCENES.MINIGAME) {
      this.saveSlotOverlay = null;
      return false;
    }
    this.saveSlotOverlay = { mode: "load", message: "" };
    return true;
  }

  closeSaveSlotOverlay() {
    this.saveSlotOverlay = null;
  }

  getSaveSlotRects() {
    const panelX = 352;
    const startY = 190;
    const slotW = 576;
    const slotH = 58;
    const gap = 12;

    return Array.from({ length: this.getSaveSlotCount() }, (_, index) => ({
      slotNumber: index + 1,
      x: panelX,
      y: startY + index * (slotH + gap),
      w: slotW,
      h: slotH
    }));
  }

  getSaveSlotCloseRect() {
    return { x: 890, y: 132, w: 38, h: 38 };
  }

  handleSaveSlotOverlayClick() {
    const closeRect = this.getSaveSlotCloseRect();
    if (this.isPointInRect(mouseX, mouseY, closeRect)) {
      this.closeSaveSlotOverlay();
      return;
    }

    const rect = this.getSaveSlotRects().find((slotRect) => this.isPointInRect(mouseX, mouseY, slotRect));
    if (!rect) return;

    if (this.saveSlotOverlay.mode === "save") {
      this.saveToSlot(rect.slotNumber);
      return;
    }

    this.loadFromSlot(rect.slotNumber);
  }

  isPointInRect(px, py, rect) {
    return px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h;
  }

  drawSaveSlotOverlay() {
    const slots = this.readSaveSlots();
    const mode = this.saveSlotOverlay.mode;
    const title = mode === "save" ? "SAVE SLOT" : "LOAD SLOT";

    noStroke();
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    fill("#171a24");
    stroke(255, 255, 255, 82);
    strokeWeight(1.4);
    rect(324, 112, 632, 456, 12);

    noStroke();
    fill("#fff5dc");
    textAlign(LEFT, CENTER);
    this.useFont("uiBold");
    textSize(28);
    text(title, 352, 151);

    const closeRect = this.getSaveSlotCloseRect();
    fill(this.isPointInRect(mouseX, mouseY, closeRect) ? "#ff7ba6" : "rgba(255, 255, 255, 0.14)");
    rect(closeRect.x, closeRect.y, closeRect.w, closeRect.h, 10);
    fill("#ffffff");
    textAlign(CENTER, CENTER);
    textSize(22);
    text("X", closeRect.x + closeRect.w / 2, closeRect.y + closeRect.h / 2);

    this.getSaveSlotRects().forEach((slotRect, index) => {
      this.drawSaveSlotRow(slotRect, slots[index], mode);
    });
  }

  drawSaveSlotRow(slotRect, slot, mode) {
    const disabled = mode === "load" && !slot;
    const hover = !disabled && this.isPointInRect(mouseX, mouseY, slotRect);
    const fillColor = disabled
      ? "rgba(255, 255, 255, 0.07)"
      : (hover ? "rgba(255, 211, 90, 0.28)" : "rgba(255, 255, 255, 0.12)");

    fill(fillColor);
    stroke(disabled ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.32)");
    strokeWeight(1);
    rect(slotRect.x, slotRect.y, slotRect.w, slotRect.h, 10);

    noStroke();
    fill(disabled ? "rgba(255, 255, 255, 0.42)" : "#ffffff");
    textAlign(LEFT, CENTER);
    this.useFont("uiBold");
    textSize(18);
    text(`슬롯 ${slotRect.slotNumber}`, slotRect.x + 22, slotRect.y + 20);

    this.useFont("ui");
    textSize(14);
    const description = slot ? this.formatSaveSlotDescription(slot) : "비어 있음";
    fill(disabled ? "rgba(255, 255, 255, 0.38)" : "rgba(255, 255, 255, 0.78)");
    text(description, slotRect.x + 22, slotRect.y + 42);

    fill(disabled ? "rgba(255, 255, 255, 0.28)" : "#ffd35a");
    textAlign(RIGHT, CENTER);
    this.useFont("uiBold");
    textSize(15);
    text(mode === "save" ? "저장" : "불러오기", slotRect.x + slotRect.w - 22, slotRect.y + slotRect.h / 2);
  }

  formatSaveSlotDescription(slot) {
    const snapshot = slot.snapshot || {};
    const savedAt = this.formatSaveSlotTime(slot.savedAt);
    const label = slot.label || this.getSaveSlotLabel(snapshot);
    return savedAt ? `${label} · ${savedAt}` : label;
  }

  formatSaveSlotTime(savedAt) {
    if (!savedAt) return "";
    const date = new Date(savedAt);
    if (Number.isNaN(date.getTime())) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${month}/${day} ${hour}:${minute}`;
  }
}
