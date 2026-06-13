let testSubGame = null;
let testSubGameId = SUB_GAMES.BRICK_BREAKER;
let testInitialDopamine = CONFIG.initialDopamine;
let testMaxTurns = 10;
let testFinished = false;
let testMinigameAssets = {};

const TEST_STORAGE_KEY = "dopaMinigameTest";

function preload() {
  testMinigameAssets = {};
  Object.entries(ASSET_MANIFEST.minigames || {}).forEach(([name, config]) => {
    testMinigameAssets[name] = loadTestImageAssetTree(config.assets || {}, config.basePath || "");
  });
}

function loadTestImageAssetTree(tree, basePath = "") {
  if (typeof tree === "string") return loadImage(basePath + tree);

  const loaded = {};
  Object.entries(tree || {}).forEach(([name, value]) => {
    loaded[name] = loadTestImageAssetTree(value, basePath);
  });
  return loaded;
}

function setup() {
  const canvas = createCanvas(CONFIG.width, CONFIG.height);
  canvas.elt.addEventListener("contextmenu", (event) => event.preventDefault());
  textFont("DopaUI, Malgun Gothic, sans-serif");
  setupTestPanel();
  startTestSubGame();
}

function draw() {
  if (!testSubGame) {
    drawMissingSubGame();
    return;
  }

  if (!testSubGame.finished) {
    testSubGame.update();
  }

  testSubGame.draw();
  syncTestStatus();
}

function mousePressed() {
  if (testSubGame && !testSubGame.finished) {
    const result = testSubGame.mousePressed();
    syncTestStatus();
    return result;
  }

  if (testSubGame && testSubGame.finished) {
    syncTestStatus();
  }
}

function keyPressed() {
  if (isTestPanelFocused()) return;

  if (testSubGame && !testSubGame.finished && typeof testSubGame.keyPressed === "function") {
    testSubGame.keyPressed();
    syncTestStatus();
    return;
  }

  if (testSubGame && testSubGame.finished && (key === "r" || key === "R" || keyCode === ENTER)) {
    startTestSubGame();
  }
}

function setupTestPanel() {
  const savedState = readSavedTestState();
  const params = new URLSearchParams(window.location.search);
  const queryGame = params.get("game");
  const queryDopamine = Number(params.get("dopamine"));
  const queryTurns = Number(params.get("turns"));

  testSubGameId = SUB_GAME_MANIFEST[queryGame]
    ? queryGame
    : savedState.gameId || testSubGameId;
  testInitialDopamine = Number.isFinite(queryDopamine)
    ? queryDopamine
    : savedState.dopamine ?? testInitialDopamine;
  testMaxTurns = Number.isFinite(queryTurns)
    ? queryTurns
    : savedState.maxTurns ?? testMaxTurns;

  const gameSelect = document.getElementById("testGameSelect");
  const dopamineInput = document.getElementById("testDopamineInput");
  const turnsInput = document.getElementById("testTurnsInput");
  const startButton = document.getElementById("testStartButton");

  Object.entries(SUB_GAME_MANIFEST).forEach(([gameId, subGame]) => {
    const option = document.createElement("option");
    option.value = gameId;
    option.textContent = subGame.title || gameId;
    gameSelect.appendChild(option);
  });

  gameSelect.value = testSubGameId;
  dopamineInput.value = clampDopamine(testInitialDopamine);
  updateTurnsInputForGame(turnsInput);

  gameSelect.addEventListener("change", () => {
    const previousGameId = testSubGameId;
    testSubGameId = gameSelect.value;
    if (previousGameId !== testSubGameId) {
      testMaxTurns = defaultTurnsForGame(testSubGameId);
    }
    updateTurnsInputForGame(turnsInput);
    saveTestState();
    startTestSubGame();
  });

  dopamineInput.addEventListener("change", () => {
    testInitialDopamine = clampDopamine(Number(dopamineInput.value));
    dopamineInput.value = testInitialDopamine;
    saveTestState();
    startTestSubGame();
  });

  turnsInput.addEventListener("change", () => {
    testMaxTurns = clampTurns(Number(turnsInput.value));
    turnsInput.value = testMaxTurns;
    saveTestState();
    startTestSubGame();
  });

  startButton.addEventListener("click", () => {
    testSubGameId = gameSelect.value;
    testInitialDopamine = clampDopamine(Number(dopamineInput.value));
    testMaxTurns = clampTurns(Number(turnsInput.value));
    dopamineInput.value = testInitialDopamine;
    turnsInput.value = testMaxTurns;
    saveTestState();
    startTestSubGame();
  });
}

function startTestSubGame() {
  if (testSubGame && typeof testSubGame.cleanup === "function") {
    testSubGame.cleanup();
  }

  const subGame = SUB_GAME_MANIFEST[testSubGameId];
  const SubGameClass = subGame ? window[subGame.className] : null;

  testFinished = false;
  if (!SubGameClass) {
    testSubGame = null;
    syncTestStatus("실행 불가");
    return;
  }

  testSubGame = new SubGameClass(
    clampDopamine(testInitialDopamine),
    { ...getSubGameOptions() },
    testMinigameAssets[testSubGameId] || {}
  );
  updateTestUrl();
  syncTestStatus("플레이 중");
}

function syncTestStatus(forcedText = null) {
  const status = document.getElementById("testStatus");
  if (!status) return;

  if (forcedText) {
    status.textContent = forcedText;
    return;
  }

  if (!testSubGame) {
    status.textContent = "실행 불가";
    return;
  }

  const dopamine = typeof testSubGame.getDopamine === "function"
    ? Math.round(constrain(testSubGame.getDopamine(), 0, 100))
    : "-";

  if (testSubGame.finished) {
    if (!testFinished) testFinished = true;
    status.textContent = `종료 / 도파민 ${dopamine}`;
    return;
  }

  status.textContent = `플레이 중 / 도파민 ${dopamine}`;
}

function drawMissingSubGame() {
  background("#111318");
  fill("#f5f2ea");
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  text("미니게임을 실행할 수 없습니다.", width / 2, height / 2);
}

function isTestPanelFocused() {
  const active = document.activeElement;
  return active && active.closest && Boolean(active.closest(".minigame-test-panel"));
}

function clampDopamine(value) {
  if (!Number.isFinite(value)) return CONFIG.initialDopamine;
  return Math.round(constrain(value, 0, 100));
}

function clampTurns(value) {
  if (!Number.isFinite(value)) return defaultTurnsForGame(testSubGameId);
  if (testSubGameId === SUB_GAMES.SIDE_SHOOTER) return Math.round(constrain(value, 10, 120));
  return Math.round(constrain(value, 1, 20));
}

function defaultTurnsForGame(gameId) {
  return gameId === SUB_GAMES.SIDE_SHOOTER ? 45 : 6;
}

function updateTurnsInputForGame(input) {
  input.min = testSubGameId === SUB_GAMES.SIDE_SHOOTER ? 10 : 1;
  input.max = testSubGameId === SUB_GAMES.SIDE_SHOOTER ? 120 : 20;
  testMaxTurns = clampTurns(testMaxTurns);
  input.value = testMaxTurns;
}

function getSubGameOptions() {
  const value = clampTurns(testMaxTurns);
  if (testSubGameId === SUB_GAMES.SIDE_SHOOTER) return { durationSeconds: value };
  return { maxTurns: value };
}

function readSavedTestState() {
  try {
    return JSON.parse(localStorage.getItem(TEST_STORAGE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveTestState() {
  localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify({
    gameId: testSubGameId,
    dopamine: clampDopamine(testInitialDopamine),
    maxTurns: clampTurns(testMaxTurns)
  }));
}

function updateTestUrl() {
  const params = new URLSearchParams();
  params.set("game", testSubGameId);
  params.set("dopamine", clampDopamine(testInitialDopamine));
  params.set("turns", clampTurns(testMaxTurns));
  window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
}
