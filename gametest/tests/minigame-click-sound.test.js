const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");
const context = {
  console,
  Date,
  mouseX: 0,
  mouseY: 0
};

const configCode = fs.readFileSync(path.join(projectRoot, "config.js"), "utf8");
const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
vm.runInNewContext(configCode + "\n" + gameCode + "\nthis.Game = Game; this.SCENES = SCENES;", context, {
  filename: "game.js"
});

let clickSounds = 0;
let subGameClicks = 0;
const game = Object.create(context.Game.prototype);
game.state = { scene: context.SCENES.MINIGAME };
game.subGame = {
  mousePressed() {
    subGameClicks++;
  }
};
game.ignoreCanvasClickUntil = 0;
game.isNameOverlayOpen = () => false;
game.unlockAudio = () => {};
game.playClickSound = () => {
  clickSounds++;
};
game.hasActiveMinigameTutorial = () => false;

game.mousePressed();

assert.strictEqual(clickSounds, 0, "minigame clicks do not play the global click sound");
assert.strictEqual(subGameClicks, 1, "minigame still receives the click");

console.log("minigame-click-sound tests passed");
