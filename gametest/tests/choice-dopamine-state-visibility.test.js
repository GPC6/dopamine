const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");
const context = {
  console,
  constrain: (value, min, max) => Math.max(min, Math.min(max, value))
};

const configCode = fs.readFileSync(path.join(projectRoot, "config.js"), "utf8");
vm.runInNewContext(configCode, context, { filename: "config.js" });

const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
vm.runInNewContext(gameCode + "\nthis.Game = Game;", context, { filename: "game.js" });

const dopamineChoicesNode = {
  type: "choice",
  prompt: "도파민 상태별 선택",
  choices: [
    { text: "낮음 선택", condition: { dopamineState: "LOW" }, nextNode: 2 },
    { text: "숨김 적정 선택", condition: { dopamineState: "OPT" }, nextNode: 3 },
    { text: "잠금 적정 선택", condition: { dopamineState: "OPT" }, disabledPreview: true, nextNode: 4 },
    { text: "숨김 높음 선택", condition: { dopamineState: "HIGH" }, nextNode: 5 },
    { text: "잠금 높음 선택", condition: { dopamineState: "HIGH" }, disabledPreview: true, nextNode: 6 }
  ]
};

function createGame(dopamine) {
  const game = Object.create(context.Game.prototype);
  game.state = {
    dopamine,
    affection: 0
  };
  return game;
}

function summarizeChoices(game) {
  return game.getVisibleChoiceItems(dopamineChoicesNode).map((item) => ({
    text: item.choice.text,
    disabled: item.disabled
  }));
}

assert.deepStrictEqual(
  summarizeChoices(createGame(20)),
  [
    { text: "낮음 선택", disabled: false },
    { text: "잠금 적정 선택", disabled: true }
  ],
  "LOW state shows matching LOW choice and disabled OPT preview only"
);

assert.deepStrictEqual(
  summarizeChoices(createGame(60)),
  [
    { text: "숨김 적정 선택", disabled: false },
    { text: "잠금 적정 선택", disabled: false },
    { text: "잠금 높음 선택", disabled: true }
  ],
  "OPT state shows matching OPT choices and disabled HIGH preview only"
);

assert.deepStrictEqual(
  summarizeChoices(createGame(90)),
  [
    { text: "잠금 적정 선택", disabled: true },
    { text: "숨김 높음 선택", disabled: false },
    { text: "잠금 높음 선택", disabled: false }
  ],
  "HIGH state shows matching HIGH choices and disabled OPT preview only"
);

console.log("choice dopamine state visibility tests passed");
