const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");
const context = {
  console,
  width: 1280,
  height: 720,
  frameRate: () => 60,
  floor: Math.floor,
  min: Math.min,
  mouseX: 0,
  mouseY: 0
};

const configCode = fs.readFileSync(path.join(projectRoot, "config.js"), "utf8");
vm.runInNewContext(configCode + "\nthis.SCENES = SCENES; this.CONFIG = CONFIG;", context, { filename: "config.js" });

const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
vm.runInNewContext(gameCode + "\nthis.Game = Game;", context, { filename: "game.js" });

function createGame(scene = context.SCENES.STORY) {
  const game = Object.create(context.Game.prototype);
  game.state = {
    scene,
    episodeId: "EP2",
    nodeIndex: 0,
    dopamine: 70,
    affection: 20,
    playerName: "진수",
    background: null,
    characters: []
  };
  game.typewriter = {
    nodeKey: null,
    visibleChars: 0,
    speed: 0.82,
    fullText: ""
  };
  game.saveButton = {
    contains: () => false,
    mousePressed() {}
  };
  game.loadQuickButton = {
    contains: () => false,
    mousePressed() {}
  };
  game.dialogueLog = [];
  game.loggedDialogueKeys = new Set();
  game.appliedDialogueEffectKeys = new Set();
  return game;
}

const menuGame = createGame();
const menuItems = menuGame.getStoryQuickMenuItems();
assert.strictEqual(menuItems.map((item) => item.label).join(","), "SAVE,LOAD,대사록", "quick menu order is SAVE, LOAD, dialogue log");
assert.ok(menuItems[0].x < menuItems[1].x && menuItems[1].x < menuItems[2].x, "quick menu is ordered left to right");

const readyGame = createGame(context.SCENES.DOPAMINE_READY);
const readyLayout = readyGame.getDopamineReadySaveLoadLayout();
assert.strictEqual(readyLayout.save.w, readyLayout.load.w, "ready screen SAVE and LOAD buttons have equal half widths");
assert.strictEqual(readyLayout.save.x + readyLayout.save.w + readyLayout.gap, readyLayout.load.x, "ready screen LOAD sits to the right of SAVE");
assert.strictEqual(readyLayout.save.y, readyLayout.load.y, "ready screen buttons share a row");

const briefingGame = createGame(context.SCENES.PAMINI_BRIEFING);
briefingGame.paminiBriefing = {
  lines: ["abcdef"],
  index: 0,
  snapshot: {},
  visibleStartedAt: 0,
  fadeOutStartedAt: null
};
const firstText = briefingGame.getPaminiBriefingTypewriterText();
assert.notStrictEqual(firstText, "abcdef", "pamini briefing text starts with typewriter reveal");
assert.strictEqual(briefingGame.dialogueLog.length, 1, "pamini briefing text is recorded in dialogue log");
assert.strictEqual(briefingGame.dialogueLog[0].speaker, "파미니", "pamini briefing log entry uses pamini speaker");
briefingGame.completeTypewriter();
assert.strictEqual(briefingGame.getPaminiBriefingTypewriterText(), "abcdef", "pamini briefing typewriter can be completed");

let openedSave = false;
briefingGame.saveButton = {
  contains: () => true,
  mousePressed() {
    openedSave = true;
  }
};
briefingGame.handlePaminiBriefingClick();
assert.strictEqual(openedSave, true, "pamini briefing functional buttons handle clicks before advancing text");

let handledLogClick = false;
const logGame = createGame(context.SCENES.PAMINI_BRIEFING);
logGame.logPanelOpen = true;
logGame.handleDialogueLogClick = () => {
  handledLogClick = true;
};
logGame.handlePaminiBriefingClick();
assert.strictEqual(handledLogClick, true, "pamini briefing lets dialogue log overlay handle clicks");

const saveGame = createGame(context.SCENES.PAMINI_BRIEFING);
assert.strictEqual(saveGame.canSaveSnapshotNow(), true, "pamini briefing is saveable");

console.log("save-load-ui-layout tests passed");
