const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");
const context = {
  width: 1280,
  height: 720,
  window: {},
  max: Math.max,
  constrain: (value, min, max) => Math.max(min, Math.min(max, value)),
  Button: class {
    constructor(x, y, w, h, label, onClick, options = {}) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.label = label;
      this.onClick = onClick;
      this.options = options;
    }
  },
  BackgroundImage: class {
    constructor(image) {
      this.image = image;
    }
  }
};

const configCode = fs.readFileSync(path.join(projectRoot, "config.js"), "utf8");
vm.runInNewContext(configCode, context, { filename: "config.js" });

const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
vm.runInNewContext(gameCode + "\nthis.Game = Game;", context, { filename: "game.js" });

context.EPISODES = {
  Test: [
    {
      type: "background",
      name: "testBackground",
      transition: { type: "fadeBlack", duration: 120 },
      id: 1
    },
    {
      type: "choice",
      prompt: "바로 선택",
      choices: [
        { text: "선택한다", follow: [], nextNode: 2 }
      ],
      id: 2
    }
  ]
};

let now = 0;
const game = Object.create(context.Game.prototype);
game.assets = {
  backgrounds: {
    testBackground: { width: 1280, height: 720 }
  },
  sounds: {},
  characters: {}
};
game.state = {
  episodeId: "Test",
  nodeIndex: 0,
  dopamine: 50,
  affection: 0,
  characters: [],
  background: null,
  pendingNodes: []
};
game.character = {};
game.choiceButtons = [];
game.backgroundTransition = null;
game.typewriter = {};
game.getTimeMs = () => now;

assert.strictEqual(game.processStoryCommandNodes(), null, "background transition pauses story command processing");
assert.strictEqual(game.state.nodeIndex, 1, "story advances to the choice while transition is active");
assert.strictEqual(game.choiceButtons.length, 0, "choice buttons are not created until the transition finishes");

now = 200;
const nodeAfterTransition = game.processStoryCommandNodes();
assert.strictEqual(nodeAfterTransition.type, "choice", "choice becomes current node after transition");
assert.strictEqual(game.choiceButtons.length, 1, "choice buttons are refreshed after a background transition");

const choiceHeaderLayout = game.getChoiceHeaderLayout(290, 370, "도파민 변화 포함");
assert.strictEqual(
  choiceHeaderLayout.labelBadge.textX,
  choiceHeaderLayout.labelBadge.x + choiceHeaderLayout.labelBadge.w / 2,
  "choice header label text is centered in its box"
);
assert.strictEqual(choiceHeaderLayout.labelBadge.w, 72, "choice header label keeps its previous box width");
assert.strictEqual(game.getChoiceHeaderStyle("dopamine", true).label, "도파민 변화", "choice header keeps dopamine change label text");
assert.strictEqual(game.getChoiceHeaderStyle("affection", true).label, "호감도 변화", "affection header keeps affection change label text");

console.log("choice-after-transition tests passed");
