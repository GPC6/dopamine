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
    this.backgroundImage = null;
    this.character = {};
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
    this.nameConfirmText.textContent = `당신의 이름은 [${name}](이)가 맞습니까?`;
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

    if (scene === SCENES.STORY) {
      this.refreshChoices();
    }

    if (scene === SCENES.MINIGAME) {
      this.startSelectedSubGame();
    }
  }

  getStartEpisodeId() {
    if (typeof STORY_START_EPISODE !== "undefined" && EPISODES[STORY_START_EPISODE]) {
      return STORY_START_EPISODE;
    }

    return EPISODES.EP1 ? "EP1" : Object.keys(EPISODES)[0];
  }

  update() {
    if (this.state.scene !== SCENES.MINIGAME) return;

    if (this.subGame) {
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
    if (this.state.scene === SCENES.MINIGAME && this.subGame) this.subGame.draw();
    if (this.state.scene === SCENES.ENDING) this.drawEnding();
  }

  mousePressed() {
    if (this.isNameOverlayOpen() || Date.now() < (this.ignoreCanvasClickUntil || 0)) return;

    this.unlockAudio();

    if (this.state.scene === SCENES.TITLE) this.titleButton.mousePressed();
    if (this.state.scene === SCENES.TITLE) this.loadButton.mousePressed();
    if (this.state.scene === SCENES.STORY) this.handleStoryClick();
    if (this.state.scene === SCENES.DOPAMINE_READY) this.handleDopamineReadyClick();
    if (this.state.scene === SCENES.MINIGAME && this.subGame) this.subGame.mousePressed();
    if (this.state.scene === SCENES.ENDING) this.restartButton.mousePressed();
  }

  isNameOverlayOpen() {
    return this.nameOverlay && !this.nameOverlay.hidden;
  }

  keyPressed() {
    this.unlockAudio();

    if (this.state.scene === SCENES.MINIGAME && this.subGame && this.subGame.keyPressed) {
      this.subGame.keyPressed();
    }
  }

  drawTitle() {
    this.drawSceneImage("convenienceStore", true);
    fill(255, 255, 255, 176);
    rect(0, 0, width, height);

    noStroke();
    fill("#ee3f73");
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(72);
    text("도파민때문에", width / 2, 240);
    textStyle(NORMAL);

    stroke("#ee3f73");
    strokeWeight(4);
    line(width / 2 - 205, 188, width / 2 + 205, 188);
    line(width / 2 - 205, 292, width / 2 + 205, 292);
    noStroke();

    fill("#5b5f70");
    textSize(16);
    text("SOME HOW STOPS LOVE CONVENIENCE STORY", width / 2, 310);
    textSize(18);
    text("감정을 너무 낮추지도, 너무 과열시키지도 말 것", width / 2, 354);

    this.titleButton.draw();
    this.loadButton.draw();
    this.drawTitleSideMenu();
  }

  drawStory() {
    this.drawBackground();
    this.drawEpisodeBadge();
    if (this.shouldShowDopamineMeter()) this.drawStatus();

    const node = this.processStoryCommandNodes();
    if (!node) return;

    if (node.type === NODE_TYPES.DIALOGUE && node.speaker === "END") {
      this.state.endingText = node.text;
      this.changeScene(SCENES.ENDING);
      return;
    }

    if (node.type === NODE_TYPES.DIALOGUE) {
      this.drawCharacters();
      this.textBox.draw(this.formatSpeaker(node.speaker), this.formatStoryText(node.text));
      this.drawStoryQuickMenu();
      return;
    }

    if (node.type === NODE_TYPES.CHOICE) {
      this.drawCharacters();
      this.drawChoiceOverlay(this.formatStoryText(node.prompt));
      this.choiceButtons.forEach((button) => button.draw());
      this.drawStoryQuickMenu();
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
    textSize(42);
    text(endingText[this.state.ending] || this.state.endingText || "END", width / 2, 280);

    fill("#f5f2ea");
    textSize(24);
    text(`도파민 ${Math.round(this.state.dopamine)} / 호감도 ${Math.round(this.state.affection)}`, width / 2, 360);

    this.restartButton.draw();
  }

  drawBackground() {
    if (this.state.background === "dummy") {
      this.drawSceneImage("convenienceStore", false);
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

  drawTitleSideMenu() {
    const labels = ["START", "LOAD", "SETTING", "EXTRA", "HLP"];
    for (let i = 0; i < labels.length; i++) {
      const y = 350 + i * 38;
      fill(i === 0 ? "#ff8f2a" : "#4b5565");
      circle(1104, y, 24);
      fill("#fff");
      textAlign(CENTER, CENTER);
      textSize(9);
      text(labels[i][0], 1104, y + 1);
      fill("#4b5565");
      textAlign(LEFT, CENTER);
      textSize(10);
      text(labels[i], 1124, y);
    }
  }

  drawEpisodeBadge() {
    noStroke();
    fill(28, 31, 43, 180);
    rect(width - 114, 20, 86, 36, 18);
    fill("#fff5dc");
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.getEpisodeLabel(), width - 71, 38);
  }

  drawStoryQuickMenu() {
    const currentNode = this.getCurrentNode();
    const isChoiceScreen = currentNode && currentNode.type === NODE_TYPES.CHOICE;
    const menuY = isChoiceScreen ? 676 : 464;

    this.saveButton.x = 76;
    this.saveButton.y = menuY;
    this.saveButton.w = 68;
    this.saveButton.h = 28;
    this.saveButton.label = "SAVE";
    this.saveButton.draw();
    const items = ["메뉴", "대사록", "자동", "빠른저장", "불러오기"];
    for (let i = 0; i < items.length; i++) {
      const x = 154 + i * 78;
      const y = menuY;
      fill(0, 0, 0, 128);
      stroke(255, 255, 255, 74);
      strokeWeight(1);
      rect(x, y, 66, 28, 14);
      noStroke();
      fill(255, 255, 255, 218);
      textAlign(CENTER, CENTER);
      textSize(11);
      text(items[i], x + 33, y + 14);
    }
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
    textSize(12);
    text("CHOICE", promptX + 36, promptY + 11);

    noStroke();
    fill("#ffffff");
    textAlign(LEFT, TOP);
    textStyle(BOLD);
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

    this.drawMeter(826, 298, "도파민", this.state.dopamine, "#e94c8a");

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
    textSize(20);
    text("하루가 끝나면 잠에 들고, 도파민 게임으로 마음을 정리합니다.", width / 2, 632);
  }

  handleDopamineReadyClick() {
    this.saveButton.mousePressed();
    this.dopamineStartButton.mousePressed();
    this.dopamineSkipButton.mousePressed();
  }

  skipSelectedSubGame() {
    const returnEpisodeId = this.state.selectedSubGameReturn || "EP_AFTER_MINIGAME";
    const returnNodeId = this.state.selectedSubGameReturnNode;
    this.state.selectedSubGame = null;
    this.state.selectedSubGameReturn = null;
    this.state.selectedSubGameReturnNode = null;
    this.moveTo(returnEpisodeId, returnNodeId);
    this.changeScene(SCENES.STORY);
  }

  drawCharacters() {
    const visibleCharacters = this.state.characters.filter((character) => this.character[character]);
    const characterLength = visibleCharacters.length;

    visibleCharacters.forEach((character, index) => {
      this.character[character].draw(index, characterLength);
    });
  }

  processStoryCommandNodes() {
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
        this.state.background = node.name;
        const image = this.assets.backgrounds[node.name];
        if (!image) {
          console.warn("Missing background asset: " + node.name);
        }
        this.backgroundImage = image ? new BackgroundImage(image) : null;
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

    const sound = this.getSoundAsset(node.name, "bgm");
    if (!sound) {
      console.warn("Missing bgm asset: " + node.name);
      return;
    }

    if (this.state.currentBgm === node.name && sound.isPlaying()) return;

    this.stopCurrentBgm();
    this.state.currentBgm = node.name;
    this.setSoundVolume(sound, node.volume);

    if (node.loop === false) {
      sound.play();
    } else {
      sound.loop();
    }
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
    if (this.saveButton.contains(mouseX, mouseY)) {
      this.saveButton.mousePressed();
      return;
    }

    const node = this.getCurrentNode();

    if (node.type === NODE_TYPES.DIALOGUE) {
      this.applyEffects(node.effects);
      this.advanceCurrentNode();
      this.refreshChoices();
      return;
    }

    this.choiceButtons.forEach((button) => button.mousePressed());
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
      return;
    }

    this.state.nodeIndex += 1;
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
      const button = new Button((width - buttonW) / 2, startY + index * (buttonH + gap), buttonW, buttonH, `${choiceNumber}   ${this.formatStoryText(choice.text)}`, () => {
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
      this.goToNextTarget(choice.next, choice.minigame || choice.subGame, choice.after);
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

  goToNextTarget(next, subGameId = null, after = null) {
    if (this.state.pendingNodes.length > 0) {
      this.state.pendingNodes.push({
        type: NODE_TYPES.MOVE,
        next,
        minigame: subGameId,
        after
      });
      return;
    }

    if (next === NEXT_TARGETS.MINIGAME) {
      this.state.selectedSubGame = subGameId || SUB_GAMES.BRICK_BREAKER;
      this.state.selectedSubGameReturn = after || "EP_AFTER_MINIGAME";
      this.state.selectedSubGameReturnNode = null;
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
    this.state.pendingNodes = follow.map((line) => ({
      type: NODE_TYPES.DIALOGUE,
      speaker: line.speaker,
      text: line.text,
      effects: line.effects
    }));
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

    this.subGame = new SubGameClass(this.state.dopamine);
  }

  finishSubGame() {
    if (this.subGame && typeof this.subGame.getDopamine === "function") {
      this.state.dopamine = constrain(this.subGame.getDopamine(), 0, 100);
    }

    this.subGame = null;
    const returnEpisodeId = this.state.selectedSubGameReturn || "EP_AFTER_MINIGAME";
    const returnNodeId = this.state.selectedSubGameReturnNode;
    this.state.selectedSubGame = null;
    this.state.selectedSubGameReturn = null;
    this.state.selectedSubGameReturnNode = null;
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
    this.state.dopamine = constrain(this.state.dopamine + amount, 0, 100);
  }

  decideEnding() {
    if (this.state.dopamine < 40) return "low";
    if (this.state.dopamine > 70) return "high";
    if (this.state.affection < 40) return "bad";
    return "good";
  }

  drawStatus() {
    this.drawMeter(32, 28, "도파민", this.state.dopamine, "#e94c8a");
    // this.drawMeter(32, 74, "호감도", this.state.affection, "#6cc4a1");
  }

  drawMeter(x, y, label, value, colorHex) {
    noStroke();
    fill("#2f2d5d");
    rect(x, y, 318, 38, 4);
    fill("#f5f2ea");
    textAlign(LEFT, CENTER);
    textStyle(BOLD);
    textSize(18);
    text(label, x + 12, y + 19);
    textStyle(NORMAL);

    fill("#f0f2fa");
    rect(x + 126, y + 12, 154, 14, 7);
    fill(colorHex);
    rect(x + 126, y + 12, map(value, 0, 100, 0, 154), 14, 7);
    fill("#f5f2ea");
    textAlign(RIGHT, CENTER);
    textSize(18);
    text(Math.round(value), x + 112, y + 19);
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
    if (speaker === "주인공") return this.state.playerName || "주인공";
    return speaker || "";
  }

  formatStoryText(text) {
    const playerName = this.state.playerName || "현수";
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
