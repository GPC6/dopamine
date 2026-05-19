class Game {
  constructor(assets) {
    this.assets = assets;
    this.validateStoryData();
    this.state = {
      scene: SCENES.TITLE,
      episodeId: "EP1",
      nodeIndex: 0,
      dopamine: CONFIG.initialDopamine,
      affection: CONFIG.initialAffection,
      ending: null,
      characters: [],
      background: null,
      selectedSubGame: null,
      selectedSubGameReturn: null,
      selectedSubGameReturnNode: null,
      pendingNodes: []
    };

    this.titleButton = new Button(500, 500, 280, 68, "시작", () => {
      this.changeScene(SCENES.STORY);
    });

    this.restartButton = new Button(500, 560, 280, 64, "다시 시작", () => {
      location.reload();
    });

    this.textBox = new TextBox(80, 470, 1120, 200);
    this.choiceButtons = [];
    this.subGame = null;
    this.backgroundImage = null;
    this.character = {};
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
    if (this.state.scene === SCENES.MINIGAME && this.subGame) this.subGame.draw();
    if (this.state.scene === SCENES.ENDING) this.drawEnding();
  }

  mousePressed() {
    if (this.state.scene === SCENES.TITLE) this.titleButton.mousePressed();
    if (this.state.scene === SCENES.STORY) this.handleStoryClick();
    if (this.state.scene === SCENES.MINIGAME && this.subGame) this.subGame.mousePressed();
    if (this.state.scene === SCENES.ENDING) this.restartButton.mousePressed();
  }

  keyPressed() {
    if (this.state.scene === SCENES.MINIGAME && this.subGame && this.subGame.keyPressed) {
      this.subGame.keyPressed();
    }
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
    this.drawBackground();
    this.drawStatus();

    const node = this.processStoryCommandNodes();
    if (!node) return;

    if (node.type === NODE_TYPES.DIALOGUE) {
      this.drawCharacters();
      this.textBox.draw(node.speaker, node.text);
      return;
    }

    if (node.type === NODE_TYPES.CHOICE) {
      this.drawCharacters();
      fill("#f5f2ea");
      textAlign(CENTER, CENTER);
      textSize(28);
      text(node.prompt, width / 2, 260);
      this.choiceButtons.forEach((button) => button.draw());
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

  drawBackground() {
    if (this.backgroundImage) {
      this.backgroundImage.draw();
      return;
    }

    background("#202633");
  }

  drawCharacters() {
    let i = 0;
    const characterLength = this.state.characters.length;

    for (const character of this.state.characters) {
      if (this.character[character]) {
        this.character[character].draw(i, characterLength);
      }
      i++;
    }
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
        if(this.state.characters.indexOf(node.name) === -1){
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

      if (node.type === NODE_TYPES.MOVE) {
        if (node.next === NEXT_TARGETS.MINIGAME) {
          this.state.selectedSubGame = node.minigame || node.subGame || SUB_GAMES.BRICK_BREAKER;
          this.state.selectedSubGameReturn = node.after || "EP_AFTER_MINIGAME";
          this.state.selectedSubGameReturnNode = node.afterNode || null;
          this.changeScene(SCENES.MINIGAME);
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
      node.type === NODE_TYPES.MOVE;
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
    const node = this.getCurrentNode();

    if (node.type === NODE_TYPES.DIALOGUE) {
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

  validateStoryData() {
    const validNodeTypes = Object.values(NODE_TYPES);

    Object.entries(EPISODES).forEach(([episodeId, nodes]) => {
      if (!Array.isArray(nodes)) {
        console.warn("Episode is not an array: " + episodeId);
        return;
      }

      const nodeIds = new Set();

      nodes.forEach((node, index) => {
        const location = episodeId + "[" + index + "]";

        if (!node || typeof node !== "object") {
          console.warn("Invalid node at " + location);
          return;
        }

        if (node.id !== undefined) {
          if (typeof node.id !== "number") {
            console.warn("Node id must be a number at " + location + ": " + node.id);
          } else if (nodeIds.has(node.id)) {
            console.warn("Duplicate node id at " + location + ": " + this.getNodeKey(episodeId, node.id));
          } else {
            nodeIds.add(node.id);
          }
        }

        if (!validNodeTypes.includes(node.type)) {
          console.warn("Unknown node type at " + location + ": " + node.type);
        }

        this.validateCondition(node.condition, location);

        if (node.type === NODE_TYPES.BACKGROUND && !ASSET_MANIFEST.backgrounds[node.name]) {
          console.warn("Unknown background at " + location + ": " + node.name);
        }

        if (node.type === NODE_TYPES.CHARACTER_IN) {
          this.validateCharacterAsset(node.name, node.emotion, location);
        }

        if (node.type === NODE_TYPES.MOVE) {
          this.validateMoveTarget(node.next, node.nextNode, location);
          this.validateSubGameTarget(node.minigame || node.subGame, node.next, location);
          this.validateSubGameReturn(node.after, node.afterNode, node.next, location);
        }

        if (node.type === NODE_TYPES.DIALOGUE) {
          if (!node.speaker) console.warn("Dialogue has no speaker at " + location);
          if (!node.text) console.warn("Dialogue has no text at " + location);
        }

        if (node.type === NODE_TYPES.CHOICE) {
          if (!Array.isArray(node.choices) || node.choices.length === 0) {
            console.warn("Choice has no choices at " + location);
            return;
          }

          node.choices.forEach((choice, choiceIndex) => {
            const choiceLocation = location + ".choices[" + choiceIndex + "]";
            if (!choice.text) console.warn("Choice option has no text at " + choiceLocation);
            this.validateFollowNodes(choice.follow, choiceLocation);
            this.validateChoiceTarget(choice.nextNode, episodeId, choiceLocation);
            if (choice.next) {
              console.warn("Choice should use nextNode instead of next at " + choiceLocation);
              this.validateNextTarget(choice.next, choiceLocation);
            }
            this.validateCondition(choice.condition, choiceLocation);
          });
        }
      });
    });
  }

  validateCharacterAsset(name, emotion, location) {
    const character = ASSET_MANIFEST.characters[name];
    if (!character) {
      console.warn("Unknown character at " + location + ": " + name);
      return;
    }

    if (emotion && !character[emotion] && !character.default) {
      console.warn("Unknown character emotion at " + location + ": " + name + " / " + emotion);
    }
  }

  validateNextTarget(next, location) {
    if (!next) {
      console.warn("Missing next target at " + location);
      return;
    }

    if (next === NEXT_TARGETS.MINIGAME) return;

    if (!EPISODES[next]) {
      console.warn("Unknown next episode at " + location + ": " + next);
    }
  }

  validateMoveTarget(next, nextNode, location) {
    if (!next && (nextNode === null || nextNode === undefined)) {
      console.warn("Missing move target at " + location);
      return;
    }

    if (next) {
      this.validateNextTarget(next, location);
    }

    if (next === NEXT_TARGETS.MINIGAME) return;

    const targetEpisodeId = next || location.split("[")[0];
    if (nextNode !== null && nextNode !== undefined) {
      this.validateNodeTarget(targetEpisodeId, nextNode, location);
    }
  }

  validateChoiceTarget(nextNode, episodeId, location) {
    if (nextNode === null || nextNode === undefined) {
      console.warn("Choice option has no nextNode at " + location);
      return;
    }

    this.validateNodeTarget(episodeId, nextNode, location);
  }

  validateNodeTarget(episodeId, nextNode, location) {
    if (typeof nextNode !== "number") {
      console.warn("Node target must be a number at " + location + ": " + nextNode);
      return;
    }

    if (this.getNodeIndexById(episodeId, nextNode) === -1) {
      console.warn("Unknown node target at " + location + ": " + this.getNodeKey(episodeId, nextNode));
    }
  }

  validateSubGameTarget(subGameId, next, location) {
    if (next !== NEXT_TARGETS.MINIGAME) return;

    if (!subGameId) {
      console.warn("Missing sub game id at " + location + ". Using default: " + SUB_GAMES.BRICK_BREAKER);
      return;
    }

    if (!SUB_GAME_MANIFEST[subGameId]) {
      console.warn("Unknown sub game at " + location + ": " + subGameId);
    }
  }

  validateSubGameReturn(after, afterNode, next, location) {
    if (next !== NEXT_TARGETS.MINIGAME || !after) return;

    if (!EPISODES[after]) {
      console.warn("Unknown sub game return episode at " + location + ": " + after);
      return;
    }

    if (afterNode !== null && afterNode !== undefined) {
      this.validateNodeTarget(after, afterNode, location);
    }
  }

  validateCondition(condition, location) {
    if (!condition) return;

    const validConditionKeys = ["dopamineMin", "dopamineMax", "affectionMin", "affectionMax"];

    Object.keys(condition).forEach((key) => {
      if (!validConditionKeys.includes(key)) {
        console.warn("Unknown condition key at " + location + ": " + key);
      }
    });

    validConditionKeys.forEach((key) => {
      if (condition[key] !== undefined && typeof condition[key] !== "number") {
        console.warn("Condition value must be a number at " + location + ": " + key);
      }
    });
  }

  validateFollowNodes(follow, location) {
    if (follow === undefined) return;

    if (!Array.isArray(follow)) {
      console.warn("Choice follow must be an array at " + location);
      return;
    }

    follow.forEach((line, index) => {
      const lineLocation = location + ".follow[" + index + "]";
      if (!line || typeof line !== "object") {
        console.warn("Invalid follow line at " + lineLocation);
        return;
      }

      if (!line.speaker) console.warn("Follow line has no speaker at " + lineLocation);
      if (!line.text) console.warn("Follow line has no text at " + lineLocation);
    });
  }

  refreshChoices() {
    const node = this.getCurrentNode();
    this.choiceButtons = [];

    if (!node || node.type !== NODE_TYPES.CHOICE) return;

    const choices = node.choices.filter((choice) => this.canChoose(choice));

    choices.forEach((choice, index) => {
      const button = new Button(340, 360 + index * 88, 600, 64, choice.text, () => {
        this.applyEffects(choice.effects);
        this.queueChoiceFollow(choice.follow);

        this.goToChoiceTarget(choice);
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
      this.changeScene(SCENES.MINIGAME);
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
      text: line.text
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
    // this.drawMeter(32, 74, "호감도", this.state.affection, "#6cc4a1");
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
