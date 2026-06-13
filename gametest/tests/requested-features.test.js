const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");
const context = {
  console,
  Date,
  window: {},
  constrain: (value, min, max) => Math.max(min, Math.min(max, value)),
  max: Math.max,
  mouseX: 0,
  mouseY: 0,
  key: " ",
  keyCode: 32,
  width: 1280,
  height: 720,
  noStroke: () => {},
  stroke: () => {},
  strokeWeight: () => {},
  fill: () => {},
  rect: () => {},
  textAlign: () => {},
  textSize: () => {},
  text: () => {},
  CENTER: "center",
  Button: class {
    constructor(x, y, w, h, label, onClick, options = {}) {
      Object.assign(this, { x, y, w, h, label, onClick, options });
    }

    contains(px, py) {
      return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
    }

    mousePressed() {
      if (this.contains(context.mouseX, context.mouseY)) this.onClick();
    }
  }
};

const configCode = fs.readFileSync(path.join(projectRoot, "config.js"), "utf8");
const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
vm.runInNewContext(configCode + "\n" + gameCode + "\nthis.Game = Game; this.SCENES = SCENES; this.NODE_TYPES = NODE_TYPES;", context, {
  filename: "game.js"
});

function createBareGame() {
  const game = Object.create(context.Game.prototype);
  game.state = {
    scene: context.SCENES.STORY,
    dopamine: 45,
    affection: 10,
    episodeAffectionDelta: 0
  };
  game.getTimeMs = () => 1000;
  return game;
}

{
  const game = createBareGame();
  game.applyEffects({ affection: 18 });

  assert.ok(game.affectionDeltaPopup, "affection changes create a popup");
  assert.strictEqual(game.affectionDeltaPopup.label, "호감도 대폭증가");
}

{
  const game = createBareGame();
  const node = {
    type: "choice",
    prompt: "잠긴 선택지는 효과 표시 제외",
    choices: [
      { text: "가능", effects: {}, nextNode: 2 },
      { text: "잠김", condition: { dopamineState: "OPT" }, disabledPreview: true, effects: { dopamine: 10 }, nextNode: 3 }
    ]
  };

  const items = game.getVisibleChoiceItems(node);
  const summary = game.getChoiceImpactSummaryFromItems(items);
  assert.strictEqual(summary.type, "none", "locked choices are excluded from dopamine/affection impact summaries");
  assert.strictEqual(summary.mixed, false, "locked choices do not create mixed impact summaries");
}

{
  const game = createBareGame();
  let storyClicks = 0;
  game.unlockAudio = () => {};
  game.handleStoryClick = () => {
    storyClicks++;
  };
  game.getCurrentNode = () => ({ type: context.NODE_TYPES.DIALOGUE });

  game.keyPressed();

  assert.strictEqual(storyClicks, 1, "space advances dialogue nodes");

  game.getCurrentNode = () => ({ type: context.NODE_TYPES.CHOICE });
  game.keyPressed();

  assert.strictEqual(storyClicks, 1, "space does not activate choice nodes");
}

{
  const game = createBareGame();
  let resetCalls = 0;
  game.resetGameToTitle = () => {
    resetCalls++;
  };

  const button = game.createTitleReturnButton();
  assert.strictEqual(button.x, 1124, "title return button has a fixed x position");
  assert.strictEqual(button.y, 58, "title return button has a fixed y position");

  context.mouseX = button.x + 4;
  context.mouseY = button.y + 4;
  button.mousePressed();

  assert.strictEqual(resetCalls, 0, "title return button does not reset immediately");
  assert.strictEqual(game.titleReturnConfirmOpen, true, "title return button opens a confirmation popup");

  const rects = game.getTitleReturnConfirmRects();
  context.mouseX = rects.confirm.x + 4;
  context.mouseY = rects.confirm.y + 4;
  game.handleTitleReturnConfirmClick();

  assert.strictEqual(resetCalls, 1, "confirming the popup resets to title");
}

{
  const game = createBareGame();
  let resetCalls = 0;
  game.resetGameToTitle = () => {
    resetCalls++;
  };
  game.openTitleReturnConfirm();

  const rects = game.getTitleReturnConfirmRects();
  context.mouseX = rects.cancel.x + 4;
  context.mouseY = rects.cancel.y + 4;
  game.handleTitleReturnConfirmClick();

  assert.strictEqual(resetCalls, 0, "canceling the popup does not reset");
  assert.strictEqual(game.titleReturnConfirmOpen, false, "canceling the popup closes it");
}

{
  const game = createBareGame();
  game.useFont = () => {};
  const rects = game.getTitleReturnConfirmRects();

  assert.doesNotThrow(() => {
    game.drawTitleReturnConfirmButton(rects.cancel, "취소", false);
  }, "title return confirm buttons render without shadowing p5 rect()");
}

console.log("requested feature tests passed");
