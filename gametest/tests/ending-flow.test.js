const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");
const context = {
  mouseX: 10,
  mouseY: 10,
  console
};

const configCode = fs.readFileSync(path.join(projectRoot, "config.js"), "utf8");
vm.runInNewContext(configCode + "\nthis.SCENES = SCENES; this.CONFIG = CONFIG;", context, { filename: "config.js" });

const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
vm.runInNewContext(gameCode + "\nthis.Game = Game;", context, { filename: "game.js" });

context.EPISODES = {
  EP1: []
};

function createGame() {
  const game = Object.create(context.Game.prototype);
  game.state = {
    scene: context.SCENES.ENDING,
    episodeId: "EP6",
    nodeIndex: 12,
    dopamine: 99,
    affection: 88,
    episodeAffectionDelta: 6,
    ending: "bad",
    characters: ["수진"],
    background: "편의점",
    currentBgm: "ep14",
    selectedSubGame: "brickBreaker",
    selectedSubGameReturn: "EP2",
    selectedSubGameReturnNode: 1,
    selectedSubGameOptions: { maxTurns: 3 },
    pendingNodes: [{ type: "dialogue" }],
    playerName: "진수",
    endingText: "END"
  };
  game.restartButton = { contains: () => true };
  game.stopCurrentBgm = () => {
    game.state.currentBgm = null;
  };
  game.resetTypewriter = () => {};
  game.choiceButtons = [{ label: "old" }];
  game.choiceButtonsNodeKey = "old";
  game.subGame = {};
  game.minigameTutorial = {};
  game.paminiBriefing = {};
  game.backgroundImage = {};
  game.backgroundTransition = {};
  game.pendingBgmNode = {};
  game.currentBgmLoop = {};
  game.character = { 수진: {} };
  game.dopamineDeltaPopup = {};
  game.dialogueLog = [{ text: "old" }];
  game.loggedDialogueKeys = new Set(["old"]);
  game.appliedDialogueEffectKeys = new Set(["old"]);
  game.logPanelOpen = true;
  game.logScrollIndex = 3;
  return game;
}

assert.strictEqual(context.SCENES.CREDITS, "credits", "credits scene is registered");

const happyGame = createGame();
happyGame.state.ending = "good";
happyGame.handleEndingClick();
assert.strictEqual(happyGame.state.scene, context.SCENES.CREDITS, "happy ending proceeds to temporary credits");

const trueGame = createGame();
trueGame.state.ending = "TRUE END";
trueGame.handleEndingClick();
assert.strictEqual(trueGame.state.scene, context.SCENES.CREDITS, "true ending proceeds to temporary credits");

const badGame = createGame();
badGame.handleEndingClick();
assert.strictEqual(badGame.state.scene, context.SCENES.TITLE, "bad ending returns to title without reload");
assert.strictEqual(badGame.state.episodeId, "EP1", "runtime episode resets");
assert.strictEqual(badGame.state.dopamine, context.CONFIG.initialDopamine, "dopamine resets");
assert.strictEqual(badGame.state.affection, context.CONFIG.initialAffection, "affection resets");
assert.strictEqual(badGame.state.characters.length, 0, "characters reset");
assert.strictEqual(badGame.state.pendingNodes.length, 0, "pending story nodes reset");
assert.strictEqual(badGame.subGame, null, "subgame resets");
assert.strictEqual(badGame.dialogueLog.length, 0, "dialogue log resets");
assert.strictEqual(badGame.loggedDialogueKeys.size, 0, "dialogue log keys reset");
assert.strictEqual(badGame.appliedDialogueEffectKeys.size, 0, "applied dialogue effect keys reset");

console.log("ending-flow tests passed");
