const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");
const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
const context = {};
vm.runInNewContext(gameCode + "\nthis.Game = Game;", context, { filename: "game.js" });

const game = Object.create(context.Game.prototype);
game.state = { playerName: "현수" };

assert.strictEqual(game.formatSpeaker("독백"), "현수", "monologue uses player name");
assert.strictEqual(game.formatSpeaker("나레이션"), "", "narration has no speaker label");
assert.strictEqual(game.formatSpeaker("지시문"), "", "direction has no speaker label");
assert.strictEqual(game.formatSpeaker("주인공"), "현수", "protagonist uses player name");

assert.strictEqual(game.formatDialogueText("속으로 생각한다", "독백"), "(속으로 생각한다)", "monologue text is wrapped");
assert.strictEqual(game.formatDialogueText("(이미 괄호)", "독백"), "(이미 괄호)", "wrapped monologue is kept");
assert.strictEqual(game.formatDialogueText("(문을 연다)", "지시문"), "(문을 연다)", "direction text is not changed");

console.log("dialogue-formatting tests passed");
