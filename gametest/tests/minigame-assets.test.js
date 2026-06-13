const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");

const context = {
  console,
  window: {}
};

const configCode = fs.readFileSync(path.join(projectRoot, "config.js"), "utf8");
vm.runInNewContext(
  configCode + "\nthis.ASSET_MANIFEST = ASSET_MANIFEST; this.SUB_GAME_MANIFEST = SUB_GAME_MANIFEST; this.SUB_GAMES = SUB_GAMES; this.SCENES = SCENES;",
  context,
  { filename: "config.js" }
);

assert.ok(context.ASSET_MANIFEST.minigames, "minigame asset manifest exists");
assert.ok(context.ASSET_MANIFEST.minigames.brickBreaker.assets.ballDefault, "brickBreaker ball asset is registered");
assert.ok(context.ASSET_MANIFEST.minigames.brickBreaker.assets.bricks.stim, "brickBreaker stim brick asset is registered");
assert.ok(context.ASSET_MANIFEST.minigames.sideShooter.assets.player.base, "sideShooter player asset is registered");
assert.ok(context.ASSET_MANIFEST.minigames.sideShooter.assets.enemies.tank, "sideShooter tank asset is registered");
assert.strictEqual(context.ASSET_MANIFEST.sounds.bgm.title.path, "./assets/sound/bgm/title_bgm.mp3", "title bgm is registered");
assert.strictEqual(context.ASSET_MANIFEST.sounds.bgm.title.loopStart, 14.34, "title bgm loop start is registered");
assert.strictEqual(context.ASSET_MANIFEST.sounds.bgm.title.loopEnd, 171.938, "title bgm loop end is registered");
assert.strictEqual(context.ASSET_MANIFEST.sounds.effects.gameEffect, "./assets/sound/effects/game_effect.mp3", "brick hit effect is registered");

let receivedAssets = null;
context.window.TestSubGame = class {
  constructor(initialDopamine, options, minigameAssets) {
    this.initialDopamine = initialDopamine;
    this.options = options;
    receivedAssets = minigameAssets;
  }
};
context.SUB_GAME_MANIFEST.testGame = {
  title: "Test",
  className: "TestSubGame"
};

const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
vm.runInNewContext(gameCode + "\nthis.Game = Game;", context, { filename: "game.js" });

const game = Object.create(context.Game.prototype);
game.assets = {
  minigames: {
    testGame: {
      sprite: "loaded-image"
    }
  }
};
game.state = {
  dopamine: 61,
  selectedSubGame: "testGame",
  selectedSubGameOptions: {
    maxTurns: 3
  }
};
game.playSubGameBgm = () => {};
game.createMinigameTutorial = () => null;

game.startSelectedSubGame();

assert.deepStrictEqual(receivedAssets, { sprite: "loaded-image" }, "selected minigame assets are passed into subgame");
assert.strictEqual(game.subGame.initialDopamine, 61, "current dopamine is still passed into subgame");
assert.strictEqual(game.subGame.options.maxTurns, 3, "playable options are still passed into subgame");

const brickHitSound = { play() {} };
context.window.BrickBreakerGame = context.window.TestSubGame;
const brickAssetGame = Object.create(context.Game.prototype);
brickAssetGame.assets = {
  minigames: {
    brickBreaker: {
      sprite: "brick-image"
    }
  },
  sounds: {
    effects: {
      gameEffect: brickHitSound
    }
  }
};
brickAssetGame.state = {
  dopamine: 50,
  selectedSubGame: context.SUB_GAMES.BRICK_BREAKER,
  selectedSubGameOptions: {}
};
brickAssetGame.playSubGameBgm = () => {};
brickAssetGame.createMinigameTutorial = () => null;

brickAssetGame.startSelectedSubGame();

assert.strictEqual(receivedAssets.sprite, "brick-image", "brickBreaker image assets are preserved");
assert.strictEqual(receivedAssets.sounds.brickHit, brickHitSound, "brickBreaker receives the block hit sound");

let cleanupCalled = false;
const cleanupGame = Object.create(context.Game.prototype);
cleanupGame.state = { scene: context.SCENES.MINIGAME };
cleanupGame.subGame = {
  cleanup() {
    cleanupCalled = true;
  }
};
cleanupGame.refreshChoices = () => {};
cleanupGame.changeScene(context.SCENES.STORY);
assert.strictEqual(cleanupCalled, true, "leaving a minigame runs subgame cleanup");

console.log("minigame-assets tests passed");
