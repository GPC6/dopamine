const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");
const context = {
  console,
  deltaTime: 16.67,
  floor: Math.floor,
  min: Math.min,
  mouseX: 0,
  mouseY: 0,
  localStorage: {
    data: {},
    getItem(key) {
      return this.data[key] || null;
    },
    setItem(key, value) {
      this.data[key] = String(value);
    }
  }
};
context.constrain = (value, min, max) => Math.max(min, Math.min(max, value));

const configCode = fs.readFileSync(path.join(projectRoot, "config.js"), "utf8");
vm.runInNewContext(configCode + "\nthis.SCENES = SCENES; this.NODE_TYPES = NODE_TYPES;", context, { filename: "config.js" });

const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
vm.runInNewContext(gameCode + "\nthis.Game = Game;", context, { filename: "game.js" });

context.EPISODES = {
  EP_TEST: [
    {
      id: 1,
      type: "dialogue",
      speaker: "수진",
      text: "테스트 대사",
      effects: { dopamine: 10, affection: 2 }
    },
    { id: 2, type: "dialogue", speaker: "수진", text: "다음 대사" }
  ]
};

const game = Object.create(context.Game.prototype);
game.state = {
  scene: context.SCENES.STORY,
  episodeId: "EP_TEST",
  nodeIndex: 0,
  dopamine: 50,
  affection: 0,
  episodeAffectionDelta: 0,
  pendingNodes: [],
  playerName: "진수"
};
game.typewriter = {
  nodeKey: null,
  visibleChars: 0,
  speed: 1,
  fullText: ""
};
game.dialogueLog = [];
game.loggedDialogueKeys = new Set();
game.appliedDialogueEffectKeys = new Set();
game.dopamineDeltaPopup = null;
game.logPanelOpen = false;
game.saveButton = { contains: () => false, mousePressed: () => {} };
game.getStoryQuickMenuItemAt = () => null;
game.isBackgroundTransitionActive = () => false;
game.refreshChoices = () => {};

const node = context.EPISODES.EP_TEST[0];

game.getTypewriterText(node);
assert.strictEqual(game.state.dopamine, 60, "dialogue effects apply when the dialogue first appears");
assert.strictEqual(game.state.affection, 2, "affection effect also applies on display");
assert.strictEqual(game.state.episodeAffectionDelta, 2, "episode affection delta updates on display");
assert.strictEqual(game.dopamineDeltaPopup.amount, 10, "dopamine popup appears on display");

game.getTypewriterText(node);
assert.strictEqual(game.state.dopamine, 60, "redrawing the same dialogue does not apply effects twice");
assert.strictEqual(game.state.affection, 2, "redrawing the same dialogue does not apply affection twice");

game.completeTypewriter();
game.handleStoryClick();
assert.strictEqual(game.state.nodeIndex, 1, "click advances the dialogue");
assert.strictEqual(game.state.dopamine, 60, "clicking past the dialogue does not apply effects again");
assert.strictEqual(game.state.affection, 2, "clicking past the dialogue does not apply affection again");

const saveGame = Object.create(context.Game.prototype);
saveGame.state = {
  scene: context.SCENES.STORY,
  episodeId: "EP_TEST",
  nodeIndex: 0,
  dopamine: 60,
  affection: 2,
  episodeAffectionDelta: 2,
  pendingNodes: [],
  playerName: "진수",
  background: null,
  characters: []
};
saveGame.appliedDialogueEffectKeys = new Set([saveGame.getDialogueNodeKey(node)]);
saveGame.saveSnapshot();

const loadGame = Object.create(context.Game.prototype);
loadGame.assets = { backgrounds: {}, characters: {} };
loadGame.state = {};
loadGame.character = {};
loadGame.refreshChoices = () => {};
loadGame.loadSnapshot();
assert.ok(
  loadGame.appliedDialogueEffectKeys.has(saveGame.getDialogueNodeKey(node)),
  "saved games remember dialogue effects already applied on display"
);

console.log("dialogue-effects-timing tests passed");
