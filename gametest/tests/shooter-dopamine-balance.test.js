const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");

function loadSideShooter() {
  let now = 0;
  const bodyClasses = new Set();
  const context = {
    window: {},
    document: {
      body: {
        classList: {
          toggle(name, force) {
            if (force) bodyClasses.add(name);
            else bodyClasses.delete(name);
          },
          contains(name) {
            return bodyClasses.has(name);
          }
        }
      }
    },
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
    isBodyClassSet: (name) => bodyClasses.has(name),
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
  assert.strictEqual(typeof calm.useSkill, "undefined", "sideShooter no longer exposes a skill activation method");
  assert.strictEqual(typeof calm.getUpgradeCatalog, "undefined", "sideShooter no longer exposes upgrade slots");
  assert.strictEqual(calm.enemyKillDopamine, 3, "enemy defeats raise dopamine by 3");
  assert.ok(calm.powerDropChance > 0, "enemy defeats can drop capsules again");
  assert.ok(calm.getSpawnInterval() <= 150, "enemy waves spawn more frequently after the rule change");
  assert.strictEqual(calm.getDopamineDeltaColor(1), "#ff5d73", "positive dopamine delta uses red");
  assert.strictEqual(calm.getDopamineDeltaColor(-1), "#7be0b7", "negative dopamine delta uses green");
  assert.ok(calm.getEnemyRoleText("drone").includes("+3"), "drone explains dopamine gain");
  assert.ok(calm.getEnemyRoleText("shooter").includes("+3"), "shooter explains dopamine gain");
  assert.ok(calm.getEnemyRoleText("tank").includes("+3"), "tank explains dopamine gain");
  calm.setCursorHidden(true);
  assert.strictEqual(context.isBodyClassSet("hide-game-cursor"), true, "sideShooter can hide the page cursor");
  calm.cleanup();
  assert.strictEqual(context.isBodyClassSet("hide-game-cursor"), false, "sideShooter restores the page cursor on cleanup");

  assert.ok(
    high.getDopamineDecayPerFrame() > calm.getDopamineDecayPerFrame(),
    "high dopamine has stronger passive decay than stable dopamine"
  );
  assert.ok(
    calm.getDopamineDecayPerFrame() >= 0.075,
    "stable dopamine now falls fast enough to require continuous enemy defeats"
  );

  const defeatGame = new SideShooterGame(55, { durationSeconds: 120 });
  const defeatedEnemy = { id: 1, type: "shooter", x: 300, y: 210, r: 20 };
  const beforeDefeat = defeatGame.dopamine;
  defeatGame.handleEnemyDefeat(defeatedEnemy);
  assert.strictEqual(defeatGame.dopamine, beforeDefeat + 3, "enemy defeat adds 3 dopamine");
  assert.ok(
    defeatGame.floatTexts.some((entry) => entry.text.includes("+3") && entry.color === "#ff5d73"),
    "enemy defeat creates red floating dopamine feedback"
  );
  context.random = () => 0.1;
  defeatGame.handleEnemyDefeat({ id: 2, type: "drone", x: 340, y: 230, r: 18 });
  assert.strictEqual(defeatGame.items.length, 1, "enemy defeat can create item drops");

  const itemGame = new SideShooterGame(55, { durationSeconds: 120 });
  itemGame.collectItem({ x: 320, y: 240, r: 13, vx: -2.8, type: "stim" });
  assert.strictEqual(itemGame.dopamine, 63, "stim capsules raise dopamine");
  itemGame.collectItem({ x: 320, y: 240, r: 13, vx: -2.8, type: "calm" });
  assert.strictEqual(itemGame.dopamine, 55, "calm capsules lower dopamine");

  const doubleGame = new SideShooterGame(55, { durationSeconds: 120 });
  doubleGame.collectItem({ x: 320, y: 240, r: 13, vx: -2.8, type: "double" });
  assert.strictEqual(doubleGame.doubleShotActive, true, "double-shot capsule activates double shot");
  doubleGame.fireShot();
  assert.strictEqual(doubleGame.shots.length, 2, "double-shot fires two projectiles");
  context.random = () => 0.99;
  assert.notStrictEqual(doubleGame.randomItemType(), "double", "double-shot capsule does not appear again after collection");

  const hitGame = new SideShooterGame(55, { durationSeconds: 120 });
  const beforeHit = hitGame.dopamine;
  hitGame.takeHit();
  assert.strictEqual(hitGame.dopamine, beforeHit - 10, "enemy hits now lower dopamine by 10");
  assert.ok(hitGame.hitFlash > 0, "enemy hits start a visual hit effect");
  assert.ok(
    hitGame.floatTexts.some((entry) => entry.text === "-10" && entry.color === "#7be0b7"),
    "enemy hit feedback uses green dopamine decrease text"
  );
  const livesAfterFirstHit = hitGame.lives;
  const dopamineAfterFirstHit = hitGame.dopamine;
  hitGame.takeHit();
  assert.strictEqual(hitGame.lives, livesAfterFirstHit, "invincibility prevents immediate repeated life loss");
  assert.strictEqual(hitGame.dopamine, dopamineAfterFirstHit, "invincibility prevents immediate repeated dopamine loss");
  assert.ok(hitGame.isPlayerInvincible(), "player is invincible during hit recovery");
  assert.ok(hitGame.getHitOverlayAlpha() > 0, "hit recovery shows a red screen flash");

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
  assert.ok(!tutorialText.includes("P 캡슐") && !tutorialText.includes("우클릭"), "tutorial no longer explains removed power capsule controls");
  assert.ok(!tutorialText.includes("흡수"), "tutorial no longer explains removed absorb skills");
  assert.ok(tutorialText.includes("빨간") && tutorialText.includes("도파민"), "tutorial explains red dopamine gain cues");
  assert.ok(tutorialText.includes("자연스럽게") && tutorialText.includes("감소"), "tutorial explains stronger passive dopamine decay");
  assert.ok(tutorialText.includes("맞으면") && tutorialText.includes("줄어"), "tutorial explains hits now lower dopamine");
  assert.ok(tutorialText.includes("캡슐") && tutorialText.includes("더블샷"), "tutorial explains restored capsules and double-shot item");
  assert.ok(tutorialText.includes("모두 도파민 +3"), "tutorial explains all enemy defeats add dopamine");
}

runTests();
console.log("shooter-dopamine-balance tests passed");
