const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");

function loadScript(fileName, context = {}) {
  const code = fs.readFileSync(path.join(projectRoot, fileName), "utf8");
  vm.runInNewContext(code, context, { filename: fileName });
  return context;
}

function loadEpisodes() {
  const context = {};
  loadScript("config.js", context);
  const storyCode = fs.readFileSync(path.join(projectRoot, "story-data-excel.js"), "utf8");
  vm.runInNewContext(storyCode + "\nthis.EPISODES = EPISODES;", context, { filename: "story-data-excel.js" });
  return context.EPISODES;
}

function loadGame(MinigameTutorialOverlay) {
  const context = {
    MinigameTutorialOverlay
  };
  loadScript("config.js", context);
  const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
  vm.runInNewContext(gameCode + "\nthis.Game = Game;", context, { filename: "game.js" });
  return context.Game;
}

function findFirstMinigameNode(episodes, minigame) {
  for (const nodes of Object.values(episodes)) {
    const node = nodes.find((entry) => entry.type === "move" && entry.next === "MINIGAME" && entry.minigame === minigame);
    if (node) return node;
  }
  return null;
}

function runTests() {
  const { MinigameTutorialOverlay } = require("../minigame-tutorial.js");

  const tutorial = MinigameTutorialOverlay.fromOptions({
    tutorial: {
      speaker: "파미니",
      steps: ["첫 안내", "둘째 안내"]
    }
  });

  assert.strictEqual(tutorial.isActive(), true, "tutorial starts active");
  assert.strictEqual(tutorial.getCurrentStep().speaker, "파미니", "tutorial uses speaker");
  assert.strictEqual(tutorial.getCurrentStep().text, "첫 안내", "tutorial exposes first line");
  assert.strictEqual(tutorial.advance(), false, "first advance moves to next step");
  assert.strictEqual(tutorial.getCurrentStep().text, "둘째 안내", "tutorial exposes second line");
  assert.strictEqual(tutorial.advance(), true, "last advance completes tutorial");
  assert.strictEqual(tutorial.isActive(), false, "tutorial no longer blocks game after completion");

  const shorthand = MinigameTutorialOverlay.fromOptions({
    tutorial: ["배열 안내"]
  });
  assert.strictEqual(shorthand.getCurrentStep().speaker, "파미니", "array shorthand defaults to 파미니");
  assert.strictEqual(shorthand.getCurrentStep().text, "배열 안내", "array shorthand becomes a step");

  const episodes = loadEpisodes();
  const brickBreaker = findFirstMinigameNode(episodes, "brickBreaker");
  const sideShooter = findFirstMinigameNode(episodes, "sideShooter");

  assert.ok(brickBreaker, "first brickBreaker node exists");
  assert.ok(sideShooter, "first sideShooter node exists");
  assert.ok(brickBreaker.options && brickBreaker.options.tutorial, "first brickBreaker has tutorial options");
  assert.ok(sideShooter.options && sideShooter.options.tutorial, "first sideShooter has tutorial options");

  const Game = loadGame(MinigameTutorialOverlay);
  const game = Object.create(Game.prototype);
  game.state = { selectedSubGame: "sideShooter" };
  assert.strictEqual(game.createMinigameTutorial({}), null, "minigame tutorial is not auto-generated without scenario tutorial");

  const explicitTutorial = game.createMinigameTutorial({ tutorial: ["명시된 안내"] });
  assert.strictEqual(explicitTutorial.isActive(), true, "explicit scenario tutorial still appears");
  assert.strictEqual(explicitTutorial.getCurrentStep().text, "명시된 안내", "explicit tutorial text is preserved");
}

runTests();
console.log("tutorial-overlay tests passed");
