const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");

function loadBrickBreaker() {
  const context = {
    window: {},
    random: () => 0.5,
    Math
  };
  const code = fs.readFileSync(path.join(projectRoot, "sub_games", "breakblocks.js"), "utf8");
  vm.runInNewContext(code, context, { filename: "sub_games/breakblocks.js" });
  return context.window.BrickBreakerGame;
}

function loadEpisodes() {
  const context = {};
  const code = fs.readFileSync(path.join(projectRoot, "story-data-excel.js"), "utf8");
  vm.runInNewContext(code + "\nthis.EPISODES = EPISODES;", context, { filename: "story-data-excel.js" });
  return context.EPISODES;
}

function findFirstBrickBreaker(episodes) {
  for (const nodes of Object.values(episodes)) {
    const node = nodes.find((entry) => entry.type === "move" && entry.next === "MINIGAME" && entry.minigame === "brickBreaker");
    if (node) return node;
  }
  return null;
}

function runTests() {
  const BrickBreakerGame = loadBrickBreaker();

  const game = new BrickBreakerGame(45);
  assert.strictEqual(game.getBallCount(), 9, "ball count keeps the original dopamine / 5 scaling");
  assert.ok(
    new BrickBreakerGame(95).getStimChance() <= 0.5,
    "high dopamine makes recover bricks substantially more common"
  );

  const firstBrickBreaker = findFirstBrickBreaker(loadEpisodes());
  assert.ok(firstBrickBreaker, "first story brickBreaker exists");
  assert.ok(firstBrickBreaker.options.maxTurns <= 5, "first story brickBreaker is at most 5 turns");

  const paced = new BrickBreakerGame(70, {
    speedUpAfterSeconds: 1 / 60,
    forceDropAfterSeconds: 2 / 60
  });
  paced.aiming = false;
  paced.bricks = [];
  paced.items = [];
  paced.wallLeft = 0;
  paced.wallRight = 1000;
  paced.wallTop = 0;
  paced.floor = 1000;
  paced.balls = [
    { x: 100, y: 100, vx: 1, vy: 0, launchDelay: 0, active: true, alive: true, pierceHits: 0, piercingBrick: null }
  ];

  paced.update();
  assert.strictEqual(paced.turnSpeedMultiplier, 2, "turn speed becomes 2x after the speed-up threshold");
  assert.ok(paced.balls[0].x >= 102, "2x speed advances ball physics twice in one frame");

  paced.update();
  assert.strictEqual(paced.turnDropForced, true, "long turns trigger forced ball drop");
  assert.strictEqual(paced.balls[0].forceDropping, true, "forced drop marks the ball to skip further collisions");
  assert.ok(paced.balls[0].vy > 0, "forced drop sends the ball downward");

  const overheated = new BrickBreakerGame(95, { maxTurns: 6 });
  overheated.aiming = false;
  overheated.balls = [];
  overheated.bricks = [];
  overheated.items = [];
  overheated.overloadTurns = 1;
  overheated.settleTimer = 28;
  overheated.checkTurnEnd();
  assert.strictEqual(overheated.gameOver, false, "brickBreaker no longer ends from dopamine overheat");
}

runTests();
console.log("brickbreaker-pacing tests passed");
