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
    mouseIsPressed: false,
    mouseButton: "LEFT",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
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
  const code = fs.readFileSync(path.join(projectRoot, "story-data-v1.js"), "utf8");
  vm.runInNewContext(code + "\nthis.EPISODES = EPISODES;", context, { filename: "story-data-v1.js" });
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
  assert.strictEqual(calm.enemyKillDopamine, 3, "enemy defeats raise dopamine by 3");
  assert.strictEqual(calm.getDopamineDeltaColor(1), "#ff5d73", "positive dopamine delta uses red");
  assert.strictEqual(calm.getDopamineDeltaColor(-1), "#7be0b7", "negative dopamine delta uses green");
  assert.ok(calm.getEnemyRoleText("drone").includes("+3"), "drone explains dopamine gain");
  assert.ok(calm.getEnemyRoleText("shooter").includes("+3"), "shooter explains dopamine gain");
  assert.ok(calm.getEnemyRoleText("tank").includes("+3"), "tank explains dopamine gain");

  assert.ok(
    high.getDopamineDecayPerFrame() > calm.getDopamineDecayPerFrame(),
    "high dopamine has stronger passive decay than stable dopamine"
  );

  assert.ok(calm.absorbSkillDopamine <= -25, "absorb skill lowers dopamine enough to be easy to read");
  const beforeAbsorb = calm.dopamine;
  calm.useAbsorbSkill({ key: "absorb", name: "흡수 필터" });
  assert.strictEqual(calm.dopamine, beforeAbsorb + calm.absorbSkillDopamine, "absorb skill immediately lowers dopamine");
  assert.strictEqual(calm.skillVisual.key, "absorb", "absorb skill creates a visual effect");
  assert.ok(
    calm.floatTexts.some((entry) => entry.text.includes("-25") && entry.color === "#7be0b7"),
    "absorb skill creates green floating dopamine feedback"
  );
  assert.strictEqual(calm.consumedOneTimeUpgrades.absorb, undefined, "absorb slot is not consumed after use");
  calm.powerLevel = 1;
  assert.strictEqual(calm.getSelectedUpgrade().key, "absorb", "absorb remains usable after use");
  calm.useSkill();
  assert.strictEqual(calm.getSelectedUpgrade(), null, "using absorb resets the power cursor");

  const speedSlotGame = new SideShooterGame(55, { durationSeconds: 120 });
  speedSlotGame.powerLevel = 3;
  speedSlotGame.useSkill();
  assert.strictEqual(speedSlotGame.upgrades.speed, true, "speed effect stays active after use");
  assert.strictEqual(speedSlotGame.consumedOneTimeUpgrades.speed, true, "speed slot is consumed after use");
  speedSlotGame.powerLevel = 3;
  assert.strictEqual(speedSlotGame.getSelectedUpgrade(), null, "consumed speed slot becomes unusable");
  speedSlotGame.powerLevel = 2;
  speedSlotGame.advancePowerMeter();
  assert.strictEqual(speedSlotGame.powerLevel, 3, "power meter still lands on consumed speed slot");
  assert.strictEqual(speedSlotGame.getSelectedUpgrade(), null, "consumed speed slot remains unusable after landing");
  assert.strictEqual(speedSlotGame.isCurrentPowerSlotEmpty(), true, "consumed speed slot is visibly marked as an empty current slot");

  const absorbPassGame = new SideShooterGame(55, { durationSeconds: 120 });
  absorbPassGame.advancePowerMeter();
  assert.strictEqual(absorbPassGame.powerLevel, 1, "power meter does not skip reusable absorb slot");

  const shieldGame = new SideShooterGame(55, { durationSeconds: 120 });
  shieldGame.powerLevel = 6;
  shieldGame.useSkill();
  assert.strictEqual(shieldGame.player.shield, 2, "shield still grants shield points");
  assert.strictEqual(shieldGame.consumedOneTimeUpgrades.shield, true, "shield slot is consumed after use");
  shieldGame.powerLevel = 6;
  assert.strictEqual(shieldGame.getSelectedUpgrade(), null, "consumed shield slot becomes unusable");

  const defeatGame = new SideShooterGame(55, { durationSeconds: 120 });
  const defeatedEnemy = { id: 1, type: "shooter", x: 300, y: 210, r: 20 };
  const beforeDefeat = defeatGame.dopamine;
  defeatGame.handleEnemyDefeat(defeatedEnemy);
  assert.strictEqual(defeatGame.dopamine, beforeDefeat + 3, "enemy defeat adds 3 dopamine");
  assert.ok(
    defeatGame.floatTexts.some((entry) => entry.text.includes("+3") && entry.color === "#ff5d73"),
    "enemy defeat creates red floating dopamine feedback"
  );

  const speedGame = new SideShooterGame(55, { durationSeconds: 120 });
  const baseSpeed = speedGame.getPlayerSpeed();
  const baseDecay = speedGame.getDopamineDecayPerFrame();
  speedGame.activateUpgrade("speed");
  assert.ok(speedGame.getPlayerSpeed() >= baseSpeed + 1.5, "speed upgrade gives a stronger movement increase");
  assert.ok(speedGame.getDopamineDecayPerFrame() > baseDecay, "speed upgrade helps dopamine fall faster");
  assert.strictEqual(speedGame.skillVisual.key, "speed", "speed upgrade creates a visual effect");

  const autoFireGame = new SideShooterGame(55, { durationSeconds: 120 });
  autoFireGame.spawnTimer = 9999;
  autoFireGame.enemies = [];
  autoFireGame.bullets = [];
  autoFireGame.items = [];
  autoFireGame.gates = [];
  context.mouseIsPressed = true;
  context.mouseButton = context.LEFT;
  autoFireGame.updateGame();
  assert.ok(autoFireGame.shots.length > 0, "holding left mouse auto-fires during update");
  assert.ok(autoFireGame.autoFireInterval <= 6, "auto-fire interval is fast enough for hold-to-shoot");
  assert.ok(autoFireGame.enemyStats("drone").hp <= 1, "drone HP is lowered for rapid auto-fire");
  assert.ok(autoFireGame.enemyStats("shooter").hp <= 2, "shooter HP is lowered for rapid auto-fire");
  assert.ok(autoFireGame.enemyStats("tank").hp <= 4, "tank HP is lowered for rapid auto-fire");
  context.mouseIsPressed = false;

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
  assert.ok(tutorialText.includes("흡수"), "tutorial explains absorb skills");
  assert.ok(tutorialText.includes("빨간") && tutorialText.includes("도파민"), "tutorial explains red dopamine gain cues");
  assert.ok(tutorialText.includes("초록") && tutorialText.includes("낮춰"), "tutorial explains green dopamine lowering cues");
  assert.ok(tutorialText.includes("모두 도파민 +3"), "tutorial explains all enemy defeats add dopamine");
}

runTests();
console.log("shooter-dopamine-balance tests passed");
