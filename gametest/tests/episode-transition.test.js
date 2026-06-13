const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");
const context = {
  console
};

const configCode = fs.readFileSync(path.join(projectRoot, "config.js"), "utf8");
vm.runInNewContext(configCode + "\nthis.CONFIG = CONFIG;", context, { filename: "config.js" });

const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
vm.runInNewContext(gameCode + "\nthis.Game = Game;", context, { filename: "game.js" });

context.EPISODES = {
  "EP1 첫만남": [{ id: 1 }],
  "EP2 동아리 OT": [{ id: 1 }],
  "EP3 동아리 MT": [{ id: 1 }],
  "EP4-A 넷이": [{ id: 1 }],
  "EP4-B 둘이": [{ id: 1 }],
  "EP5 미팅사건": [{ id: 1 }],
  "EP6 정기공연": [{ id: 1 }]
};

function createGame() {
  const game = Object.create(context.Game.prototype);
  game.assets = {
    episodeTransitions: {
      Ep2: { width: 1280, height: 720 },
      Ep3: { width: 1280, height: 720 },
      Ep4A: { width: 1280, height: 720 },
      Ep4B: { width: 1280, height: 720 },
      Ep5: { width: 1280, height: 720 },
      Ep6: { width: 1280, height: 720 }
    }
  };
  game.state = {
    episodeId: "EP1 첫만남",
    nodeIndex: 0,
    pendingNodes: [],
    episodeAffectionDelta: 3,
    currentBgm: "ep14"
  };
  game.getTimeMs = () => 1234;
  return game;
}

const game = createGame();

assert.strictEqual(game.getEpisodeTransitionKey("EP2 동아리 OT"), "Ep2");
assert.strictEqual(game.getEpisodeTransitionKey("EP3 동아리 MT"), "Ep3");
assert.strictEqual(game.getEpisodeTransitionKey("EP4-A 넷이"), "Ep4A");
assert.strictEqual(game.getEpisodeTransitionKey("EP4-B 둘이"), "Ep4B");
assert.strictEqual(game.getEpisodeTransitionKey("EP5 미팅사건"), "Ep5");
assert.strictEqual(game.getEpisodeTransitionKey("EP6 정기공연"), "Ep6");
assert.strictEqual(game.getEpisodeTransitionKey("EP1 첫만남"), null);

game.moveTo("EP4-A 넷이");

assert.strictEqual(game.state.episodeId, "EP4-A 넷이", "episode changes");
assert.strictEqual(game.state.nodeIndex, 0, "episode starts at first node");
assert.strictEqual(game.state.episodeAffectionDelta, 0, "episode delta resets");
assert.strictEqual(game.episodeTransition.imageKey, "Ep4A", "EP4-A uses the Ep4A transition image");
assert.strictEqual(game.episodeTransition.image, game.assets.episodeTransitions.Ep4A, "transition stores the preloaded image");
assert.strictEqual(game.episodeTransition.startedAt, 1234, "transition starts at current time");
assert.strictEqual(game.episodeTransition.fadeInDuration, 500, "transition fades in");
assert.strictEqual(game.episodeTransition.holdDuration, 2000, "transition holds for two seconds");
assert.strictEqual(game.episodeTransition.fadeOutDuration, 500, "transition fades out");
assert.strictEqual(game.episodeTransition.totalDuration, 3000, "transition total includes fades and hold");

const bgmGame = createGame();
let stopCurrentBgmCount = 0;
bgmGame.stopCurrentBgm = () => {
  stopCurrentBgmCount += 1;
  bgmGame.state.currentBgm = null;
};

bgmGame.moveTo("EP2 동아리 OT");
assert.strictEqual(stopCurrentBgmCount, 1, "moving to a new episode stops current BGM once");
assert.strictEqual(bgmGame.state.currentBgm, null, "current BGM is cleared after episode move");

bgmGame.moveTo(null, 1);
assert.strictEqual(stopCurrentBgmCount, 1, "moving within the same episode does not stop BGM again");

console.log("episode-transition tests passed");
