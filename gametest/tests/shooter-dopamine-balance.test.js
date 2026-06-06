const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");

function loadSideShooter() {
  let now = 0;
  const context = {
    window: {},
    Math,
    width: 1280,
    height: 720,
    mouseX: 640,
    mouseY: 360,
    frameCount: 1,
    SHIFT: 16,
    ENTER: 13,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39,
    millis: () => now,
    setMillis: (value) => {
      now = value;
    },
    keyIsDown: () => false,
    random: () => 0.99,
    constrain: (value, min, max) => Math.max(min, Math.min(max, value)),
    lerp: (a, b, t) => a + (b - a) * t
  };
  const code = fs.readFileSync(path.join(projectRoot, "sub_games", "shooting.js"), "utf8");
  vm.runInNewContext(code, context, { filename: "sub_games/shooting.js" });
  return { SideShooterGame: context.window.SideShooterGame, context };
}

function loadEpisodes() {
  const context = {};
  const code = fs.readFileSync(path.join(projectRoot, "story-data-excel.js"), "utf8");
  vm.runInNewContext(code + "\nthis.EPISODES = EPISODES;", context, { filename: "story-data-excel.js" });
  return context.EPISODES;
}

function findFirstSideShooter(episodes) {
  for (const nodes of Object.values(episodes)) {
    const node = nodes.find((entry) => entry.type === "move" && entry.next === "MINIGAME" && entry.minigame === "sideShooter");
    if (node) return node;
  }
  return null;
}

function runTests() {
  const { SideShooterGame, context } = loadSideShooter();

  const calm = new SideShooterGame(55, { durationSeconds: 120 });
  const high = new SideShooterGame(95, { durationSeconds: 120 });
  const upgrades = calm.getUpgradeCatalog();
  assert.strictEqual(upgrades[0].key, "absorb", "absorb skill is the first power slot");
  assert.strictEqual(upgrades[2].key, "speed", "speed skill moves to the third power slot");

  assert.ok(
    high.getDopamineDecayPerFrame() > calm.getDopamineDecayPerFrame(),
    "high dopamine has stronger passive decay than stable dopamine"
  );

  assert.ok(calm.absorbSkillDopamine <= -25, "absorb skill lowers dopamine enough to be easy to read");
  const beforeAbsorb = calm.dopamine;
  calm.useAbsorbSkill({ key: "absorb", name: "흡수 필터" });
  assert.strictEqual(calm.dopamine, beforeAbsorb + calm.absorbSkillDopamine, "absorb skill immediately lowers dopamine");
  assert.strictEqual(calm.skillVisual.key, "absorb", "absorb skill creates a visual effect");

  const speedGame = new SideShooterGame(55, { durationSeconds: 120 });
  const baseSpeed = speedGame.getPlayerSpeed();
  const baseDecay = speedGame.getDopamineDecayPerFrame();
  speedGame.activateUpgrade("speed");
  assert.ok(speedGame.getPlayerSpeed() >= baseSpeed + 1.5, "speed upgrade gives a stronger movement increase");
  assert.ok(speedGame.getDopamineDecayPerFrame() > baseDecay, "speed upgrade helps dopamine fall faster");
  assert.strictEqual(speedGame.skillVisual.key, "speed", "speed upgrade creates a visual effect");

  context.setMillis(0);
  const overheated = new SideShooterGame(95, { durationSeconds: 120 });
  overheated.spawnTimer = 9999;
  overheated.enemies = [];
  overheated.bullets = [];
  overheated.items = [];
  overheated.gates = [];
  context.setMillis(6000);
  overheated.updateGame();
  assert.strictEqual(overheated.gameOver, false, "sideShooter no longer ends from dopamine overheat");

  const sideShooter = findFirstSideShooter(loadEpisodes());
  assert.ok(sideShooter, "first sideShooter node exists");
  const tutorialText = sideShooter.options.tutorial.join("\n");
  assert.ok(tutorialText.includes("P 캡슐") && tutorialText.includes("우클릭"), "tutorial explains power capsule mechanism");
  assert.ok(tutorialText.includes("속도") && tutorialText.includes("흡수"), "tutorial explains speed and absorb skills");
  assert.ok(tutorialText.includes("빛") || tutorialText.includes("효과"), "tutorial mentions visual feedback");
}

runTests();
console.log("shooter-dopamine-balance tests passed");
