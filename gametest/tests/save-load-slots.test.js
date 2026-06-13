const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.join(__dirname, "..");
const storage = {};
const context = {
  console,
  Date,
  localStorage: {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
    },
    setItem(key, value) {
      storage[key] = String(value);
    },
    removeItem(key) {
      delete storage[key];
    }
  },
  CharacterImage: class CharacterImage {
    constructor(image) {
      this.image = image;
    }
  },
  BackgroundImage: class BackgroundImage {
    constructor(image) {
      this.image = image;
    }
  }
};

const configCode = fs.readFileSync(path.join(projectRoot, "config.js"), "utf8");
vm.runInNewContext(configCode + "\nthis.SCENES = SCENES; this.CONFIG = CONFIG;", context, { filename: "config.js" });

const gameCode = fs.readFileSync(path.join(projectRoot, "game.js"), "utf8");
vm.runInNewContext(gameCode + "\nthis.Game = Game;", context, { filename: "game.js" });

context.EPISODES = {
  EP1: [],
  EP2: [{ id: 1, type: "dialogue", speaker: "수진", text: "저장 테스트" }]
};

function createGame(scene = context.SCENES.STORY) {
  const bgmSounds = {
    ep14: {
      played: 0,
      stopped: 0,
      volume: null,
      isPlaying() {
        return this.played > this.stopped;
      },
      isLoaded() {
        return true;
      },
      setVolume(value) {
        this.volume = value;
      },
      play() {
        this.played += 1;
      },
      stop() {
        this.stopped += 1;
      }
    },
    ep25: {
      played: 0,
      stopped: 0,
      isPlaying() {
        return this.played > this.stopped;
      },
      isLoaded() {
        return true;
      },
      setVolume() {},
      play() {
        this.played += 1;
      },
      stop() {
        this.stopped += 1;
      }
    }
  };
  const game = Object.create(context.Game.prototype);
  game.assets = {
    backgrounds: { "편의점": { image: "bg" } },
    characters: { 수진: { 일반: { image: "sujin" } } },
    sounds: { bgm: bgmSounds, effects: {} }
  };
  game.state = {
    scene,
    episodeId: "EP2",
    nodeIndex: 0,
    dopamine: 64,
    affection: 21,
    episodeAffectionDelta: 3,
    pendingNodes: [],
    playerName: "진수",
    background: "편의점",
    characters: ["수진"],
    currentBgm: "ep14",
    selectedSubGame: "sideShooter",
    selectedSubGameReturn: "EP2",
    selectedSubGameReturnNode: 1,
    selectedSubGameOptions: { durationSeconds: 45 }
  };
  game.character = {};
  game.backgroundImage = null;
  game.currentBgmLoop = null;
  game.pendingBgmNode = null;
  game.bgmSounds = bgmSounds;
  game.appliedDialogueEffectKeys = new Set(["EP2#1"]);
  game.choiceButtons = [];
  game.refreshChoices = () => {
    game.refreshedChoices = true;
  };
  game.changeScene = (nextScene) => {
    game.state.scene = nextScene;
  };
  game.getStartEpisodeId = () => "EP1";
  game.showNameEntry = () => {
    game.nameEntryShown = true;
  };
  return game;
}

const emptyGame = createGame();
assert.strictEqual(emptyGame.getSaveSlotCount(), 5, "save slot count is fixed at five");
assert.strictEqual(emptyGame.readSaveSlots().length, 5, "empty storage still returns five slots");
assert.ok(emptyGame.readSaveSlots().every((slot) => slot === null), "empty slots are null");

const saveGame = createGame(context.SCENES.DOPAMINE_READY);
assert.strictEqual(saveGame.saveToSlot(3), true, "saving to a valid slot succeeds");
const slotsAfterSave = saveGame.readSaveSlots();
assert.strictEqual(slotsAfterSave[2].snapshot.scene, context.SCENES.DOPAMINE_READY, "slot stores current scene");
assert.strictEqual(slotsAfterSave[2].snapshot.selectedSubGame, "sideShooter", "slot stores selected minigame");
assert.strictEqual(slotsAfterSave[2].snapshot.currentBgm, "ep14", "slot stores the currently playing bgm");
assert.strictEqual(slotsAfterSave[2].snapshot.appliedDialogueEffectKeys[0], "EP2#1", "slot stores applied dialogue effects");
assert.ok(slotsAfterSave[2].savedAt, "slot records a saved timestamp");
assert.strictEqual(context.localStorage.getItem("dopaPlayerName"), "진수", "saving keeps the player name");

const loadGame = createGame(context.SCENES.TITLE);
assert.strictEqual(loadGame.loadFromSlot(3), true, "loading a saved slot succeeds");
assert.strictEqual(loadGame.state.scene, context.SCENES.DOPAMINE_READY, "load returns to saved non-minigame scene");
assert.strictEqual(loadGame.state.episodeId, "EP2", "load restores episode");
assert.strictEqual(loadGame.state.dopamine, 64, "load restores dopamine");
assert.strictEqual(loadGame.state.selectedSubGameOptions.durationSeconds, 45, "load restores minigame options");
assert.ok(loadGame.appliedDialogueEffectKeys.has("EP2#1"), "load restores dialogue effect tracking");
assert.ok(loadGame.character["수진"], "load rebuilds character image objects");
assert.ok(loadGame.backgroundImage, "load rebuilds background image object");
assert.strictEqual(loadGame.state.currentBgm, "ep14", "load restores current bgm name");
assert.strictEqual(loadGame.bgmSounds.ep14.played, 1, "load starts the saved bgm");
assert.strictEqual(loadGame.currentBgmLoop.name, "ep14", "load restores bgm loop metadata");

const minigameGame = createGame(context.SCENES.MINIGAME);
assert.strictEqual(minigameGame.openLoadSlotOverlay(), false, "load overlay does not open during minigame play");
assert.strictEqual(minigameGame.saveSlotOverlay, null, "minigame load attempt leaves overlay closed");

const endingGame = createGame(context.SCENES.ENDING);
assert.strictEqual(endingGame.openLoadSlotOverlay(), true, "load overlay opens outside minigames");
assert.strictEqual(endingGame.saveSlotOverlay.mode, "load", "load overlay records load mode");

console.log("save-load-slots tests passed");
