const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");
const context = {};
context.constrain = (value, min, max) => Math.max(min, Math.min(max, value));

const configCode = fs.readFileSync(path.join(projectRoot, "config.js"), "utf8");
vm.runInNewContext(configCode + "\nthis.SCENES = SCENES;", context, { filename: "config.js" });

const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
vm.runInNewContext(gameCode + "\nthis.Game = Game;", context, { filename: "game.js" });
context.EPISODES = {
  EP2: [{ id: 1 }],
  EP3: [{ id: 1 }]
};

function createGame(episodeId = "EP2") {
  const game = Object.create(context.Game.prototype);
  game.assets = { backgrounds: {} };
  game.state = {
    scene: context.SCENES.STORY,
    episodeId,
    dopamine: 77,
    affection: 61,
    episodeAffectionDelta: 0
  };
  return game;
}

assert.strictEqual(context.SCENES.PAMINI_BRIEFING, "paminiBriefing", "pamini briefing scene is registered");
assert.strictEqual(createGame().getPaminiBriefingBackgroundName(), "꿈속", "pamini briefing uses dream background");
const mascotLayout = createGame().getPaminiBriefingMascotLayout();
assert.strictEqual(mascotLayout.index, 0, "pamini briefing mascot uses first slot");
assert.strictEqual(mascotLayout.count, 1, "pamini briefing mascot is centered as a single character");
assert.strictEqual(mascotLayout.yOffset, -72, "pamini briefing mascot floats above the textbox");

const lines = createGame().buildPaminiBriefingLines({
  dopamine: 85,
  affectionDelta: 4,
  episodeId: "EP3"
});

assert.strictEqual(lines.length, 3, "briefing has three short lines");
assert.ok(lines[0].includes("높은 도파민") && lines[0].includes("감정"), "first line combines affection delta and dopamine state");
assert.ok(lines[1].includes("방향만"), "second line keeps dopamine guidance brief");
assert.ok(lines[2].includes("꿈속"), "last line connects to the night minigame");
assert.ok(lines.every((line) => !/\d/.test(line)), "briefing does not expose numeric values");

const missedChanceLines = createGame().buildPaminiBriefingLines({
  dopamine: 35,
  affectionDelta: -2,
  episodeId: "EP3"
});
assert.ok(missedChanceLines[0].includes("도파민이 낮아") && missedChanceLines[0].includes("기회"), "low dopamine and negative affection reads as missed chance");

const neutralGoodLines = createGame().buildPaminiBriefingLines({
  dopamine: 65,
  affectionDelta: 2,
  episodeId: "EP3"
});
assert.ok(neutralGoodLines[0].includes("적당한 도파민") && neutralGoodLines[0].includes("좋은 흐름"), "optimal dopamine and positive affection reads as good flow");

const firstMeetingLines = createGame("EP2").buildPaminiBriefingLines({
  dopamine: 77,
  affectionDelta: 1,
  episodeId: "EP2"
});
assert.strictEqual(firstMeetingLines.length, 6, "EP2 includes first meeting intro before briefing");
assert.ok(firstMeetingLines[0].includes("파미니") && firstMeetingLines[0].includes("안녕"), "EP2 starts with pamini greeting");
assert.ok(firstMeetingLines[1].includes("오늘 하루") && firstMeetingLines[1].includes("감정"), "EP2 smalltalks about today's emotion");
assert.ok(firstMeetingLines[2].includes("매일 밤"), "EP2 explains pamini will appear every night");
assert.ok(!lines.join("\n").includes("매일 밤"), "EP3 and later do not repeat the first meeting intro");

const deltaGame = createGame();
deltaGame.applyEffects({ affection: 3 });
deltaGame.applyEffects({ dopamine: 4 });
deltaGame.applyEffects({ affection: -1 });
assert.strictEqual(deltaGame.state.affection, 63, "affection still changes normally");
assert.strictEqual(deltaGame.state.episodeAffectionDelta, 2, "episode affection delta tracks today's net change");

deltaGame.moveTo("EP3");
assert.strictEqual(deltaGame.state.episodeAffectionDelta, 0, "episode affection delta resets when episode changes");

const readyGame = createGame();
readyGame.changeScene(context.SCENES.DOPAMINE_READY);
assert.strictEqual(readyGame.state.dopamine, 77, "dopamine is preserved when entering ready screen");

const briefingGame = createGame();
briefingGame.startPaminiBriefingBeforeReady();
assert.strictEqual(briefingGame.state.scene, context.SCENES.PAMINI_BRIEFING, "minigame handoff starts briefing");
assert.strictEqual(briefingGame.backgroundTransition.type, "fadeBlack", "briefing starts with fade transition");
assert.strictEqual(briefingGame.backgroundTransition.toName, "꿈속", "briefing fades into the dream background");
assert.strictEqual(briefingGame.paminiBriefing.snapshot.dopamine, 77, "briefing stores current dopamine");
assert.strictEqual(briefingGame.paminiBriefing.snapshot.affectionDelta, 0, "briefing stores today's affection delta");
assert.strictEqual(briefingGame.paminiBriefing.snapshot.episodeId, "EP2", "briefing stores current episode");

const ep1Game = createGame("EP1");
ep1Game.startPaminiBriefingBeforeReady();
assert.strictEqual(ep1Game.state.scene, context.SCENES.DOPAMINE_READY, "EP1 skips pamini briefing");
assert.strictEqual(ep1Game.paminiBriefing, null, "EP1 does not create briefing state");
assert.strictEqual(ep1Game.backgroundTransition, undefined, "EP1 does not start briefing transition");

console.log("pamini-briefing tests passed");
