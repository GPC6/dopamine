const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");

let receivedAssets = null;
const context = {
  CONFIG: {
    width: 1280,
    height: 720,
    initialDopamine: 50
  },
  SUB_GAMES: {
    BRICK_BREAKER: "brickBreaker",
    SIDE_SHOOTER: "sideShooter"
  },
  SUB_GAME_MANIFEST: {
    brickBreaker: {
      title: "Test",
      className: "TestSubGame"
    }
  },
  ASSET_MANIFEST: {
    minigames: {
      brickBreaker: {
        basePath: "./assets/minigame/breakblocks/original/",
        assets: {
          ballDefault: "ball_default.png",
          bricks: {
            stim: "brick_stim.png"
          }
        }
      }
    }
  },
  window: {
    location: {
      pathname: "/minigame-test.html"
    },
    history: {
      replaceState: () => {}
    }
  },
  document: {
    getElementById: () => ({ textContent: "" })
  },
  URLSearchParams,
  constrain: (value, min, max) => Math.max(min, Math.min(max, value)),
  loadImage: (path) => `loaded:${path}`
};
context.window.TestSubGame = class {
  constructor(initialDopamine, options, minigameAssets) {
    this.initialDopamine = initialDopamine;
    this.options = options;
    this.finished = false;
    receivedAssets = minigameAssets;
  }
};

const code = fs.readFileSync(path.join(projectRoot, "minigame-test.js"), "utf8");
vm.runInNewContext(code + "\npreload(); startTestSubGame();", context, { filename: "minigame-test.js" });

assert.ok(receivedAssets, "minigame test passes assets into the selected subgame");
assert.strictEqual(receivedAssets.ballDefault, "loaded:./assets/minigame/breakblocks/original/ball_default.png");
assert.strictEqual(receivedAssets.bricks.stim, "loaded:./assets/minigame/breakblocks/original/brick_stim.png");

console.log("minigame-test-assets tests passed");
