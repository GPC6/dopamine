const NODE_LABELS = {
  background: "배경",
  "character in": "캐릭터 등장",
  "character out": "캐릭터 퇴장",
  "clear characters": "캐릭터 지우기",
  "clear background": "배경 지우기",
  "scene reset": "장면 초기화",
  dialogue: "대사",
  choice: "선택지",
  move: "이동",
  endingCheck: "엔딩 체크"
};

const SUB_GAMES = ["brickBreaker", "sideShooter"];
const UID_KEY = "__editorUid";
const NEXT_UID_KEY = "__editorNextUid";
const AFTER_UID_KEY = "__editorAfterUid";
const TEST_STORAGE_KEY = "dopaStoryEditor.testEpisodes";

let nextUid = 1;

const sampleEpisodes = {
  EP1: [
    { id: 1, type: "background", name: "dummy" },
    { id: 2, type: "dialogue", speaker: "주인공", text: "오늘은 이상하게 마음이 붕 떠 있다." },
    { id: 3, type: "character in", name: "수진", emotion: "일반" },
    { id: 4, type: "dialogue", speaker: "수진", text: "안녕. 여기 앉아도 돼?" },
    {
      id: 5,
      type: "choice",
      prompt: "수진에게 어떻게 답할까?",
      choices: [
        {
          text: "편하게 앉으라고 한다",
          effects: { affection: 10, dopamine: -5 },
          follow: [{ speaker: "주인공", text: "응, 여기 앉아." }],
          nextNode: 6
        },
        {
          text: "장난스럽게 말을 건다",
          effects: { affection: 15, dopamine: 8 },
          follow: [{ speaker: "주인공", text: "자리세는 비싼데?" }],
          nextNode: 6
        }
      ]
    },
    { id: 6, type: "dialogue", speaker: "수진", text: "고마워. 오늘 뭔가 재밌는 일이 생길 것 같아." },
    { id: 7, type: "move", next: "MINIGAME", minigame: "brickBreaker", after: "EP2" }
  ],
  EP2: [
    { id: 1, type: "scene reset" },
    { id: 2, type: "dialogue", speaker: "주인공", text: "미니게임이 끝나고 마음이 조금 정리됐다." },
    { id: 3, type: "endingCheck" }
  ]
};

let episodes = clone(sampleEpisodes);
let selectedEpisodeId = Object.keys(episodes)[0];
let exportMode = "json";
const scenario3Episodes = typeof EPISODES === "undefined" ? null : clone(EPISODES);

const elements = {
  episodeList: document.querySelector("#episodeList"),
  nodeList: document.querySelector("#nodeList"),
  episodeIdInput: document.querySelector("#episodeIdInput"),
  addEpisodeButton: document.querySelector("#addEpisodeButton"),
  renameEpisodeButton: document.querySelector("#renameEpisodeButton"),
  deleteEpisodeButton: document.querySelector("#deleteEpisodeButton"),
  loadSampleButton: document.querySelector("#loadSampleButton"),
  loadScenario3Button: document.querySelector("#loadScenario3Button"),
  importButton: document.querySelector("#importButton"),
  testStoryButton: document.querySelector("#testStoryButton"),
  exportButton: document.querySelector("#exportButton"),
  importDialog: document.querySelector("#importDialog"),
  exportDialog: document.querySelector("#exportDialog"),
  importText: document.querySelector("#importText"),
  importMessage: document.querySelector("#importMessage"),
  applyImportButton: document.querySelector("#applyImportButton"),
  exportText: document.querySelector("#exportText"),
  showJsonButton: document.querySelector("#showJsonButton"),
  showJsButton: document.querySelector("#showJsButton"),
  copyExportButton: document.querySelector("#copyExportButton"),
  downloadExportButton: document.querySelector("#downloadExportButton"),
  nodeTemplate: document.querySelector("#nodeTemplate"),
  choiceItemTemplate: document.querySelector("#choiceItemTemplate")
};

function render() {
  ensureSelection();
  hydrateEditorState();
  assignNodeIds();
  renderEpisodes();
  renderNodes();
}

function ensureSelection() {
  const ids = Object.keys(episodes);
  if (!ids.length) {
    episodes.EP1 = [];
    selectedEpisodeId = "EP1";
    return;
  }

  if (!episodes[selectedEpisodeId]) selectedEpisodeId = ids[0];
}

function assignNodeIds() {
  Object.values(episodes).forEach((nodes) => {
    nodes.forEach((node, index) => {
      node.id = index + 1;
    });
  });
}

function hydrateEditorState() {
  Object.values(episodes).forEach((nodes) => {
    nodes.forEach((node) => {
      if (!node[UID_KEY]) node[UID_KEY] = createUid();
    });
  });

  Object.entries(episodes).forEach(([episodeId, nodes]) => {
    const nodeById = new Map(nodes.map((node) => [node.id, node]));

    nodes.forEach((node) => {
      if (node.type === "choice" && Array.isArray(node.choices)) {
        node.choices.forEach((choice) => {
          if (!choice[NEXT_UID_KEY] && choice.nextNode !== undefined && nodeById.has(choice.nextNode)) {
            choice[NEXT_UID_KEY] = nodeById.get(choice.nextNode)[UID_KEY];
          }
        });
      }

      if (node.type === "move" && !node[NEXT_UID_KEY] && node.nextNode !== undefined) {
        const targetEpisodeId = node.next || episodeId;
        const target = episodes[targetEpisodeId]?.find((candidate) => candidate.id === node.nextNode);
        if (target) node[NEXT_UID_KEY] = target[UID_KEY];
      }

      if (node.type === "move" && !node[AFTER_UID_KEY] && node.after && node.afterNode !== undefined) {
        const target = episodes[node.after]?.find((candidate) => candidate.id === node.afterNode);
        if (target) node[AFTER_UID_KEY] = target[UID_KEY];
      }
    });
  });
}

function renderEpisodes() {
  elements.episodeList.innerHTML = "";

  Object.entries(episodes).forEach(([episodeId, nodes]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `episode-button${episodeId === selectedEpisodeId ? " active" : ""}`;
    button.textContent = `${episodeId} (${nodes.length})`;
    button.addEventListener("click", () => {
      selectedEpisodeId = episodeId;
      render();
    });
    elements.episodeList.append(button);
  });

  elements.episodeIdInput.value = selectedEpisodeId;
}

function renderNodes() {
  elements.nodeList.innerHTML = "";

  getSelectedNodes().forEach((node, index) => {
    elements.nodeList.append(createNodeCard(node, index));
  });
}

function createNodeCard(node, index) {
  const card = elements.nodeTemplate.content.firstElementChild.cloneNode(true);
  card.dataset.type = node.type;
  card.querySelector(".node-id").textContent = `#${index + 1}`;
  card.querySelector(".node-title").textContent = NODE_LABELS[node.type] || node.type;

  const fields = card.querySelector(".node-fields");
  renderNodeFields(fields, node);
  bindNodeActions(card, index);
  return card;
}

function renderNodeFields(container, node) {
  container.innerHTML = "";

  if (node.type === "dialogue") {
    container.append(
      makeTextInput("화자", node.speaker, (value) => node.speaker = value),
      makeTextarea("대사", node.text, (value) => node.text = value),
      createConditionEditor(node)
    );
    return;
  }

  if (node.type === "choice") {
    if (!Array.isArray(node.choices)) node.choices = [];
    container.append(
      makeTextarea("질문", node.prompt, (value) => node.prompt = value),
      createConditionEditor(node)
    );

    const choiceList = document.createElement("div");
    choiceList.className = "choice-items";
    node.choices.forEach((choice, choiceIndex) => {
      choiceList.append(createChoiceItem(choice, node.choices, choiceIndex));
    });

    const addButton = makeButton("선택 항목 추가", "secondary-button", () => {
      node.choices.push(createDefaultChoice());
      renderNodes();
    });

    container.append(choiceList, addButton);
    return;
  }

  if (node.type === "move") {
    const grid = document.createElement("div");
    grid.className = "field-grid three";
    grid.append(
      makeTextInput("다음 에피소드", node.next, (value) => setOptionalString(node, "next", value), "EP2 또는 MINIGAME"),
      makeNumberInput("다음 노드 번호", getMoveNextNodeId(node), (value) => setMoveNextNode(node, value)),
      makeSelectInput("미니게임", node.minigame, SUB_GAMES, (value) => setOptionalString(node, "minigame", value))
    );

    const returnGrid = document.createElement("div");
    returnGrid.className = "field-grid two";
    returnGrid.append(
      makeTextInput("미니게임 후 에피소드", node.after, (value) => setOptionalString(node, "after", value)),
      makeNumberInput("미니게임 후 노드 번호", getAfterNodeId(node), (value) => setAfterNode(node, value))
    );

    container.append(grid, returnGrid, createConditionEditor(node));
    return;
  }

  if (node.type === "background") {
    container.append(
      makeTextInput("배경 이름", node.name, (value) => node.name = value, "dummy"),
      createConditionEditor(node)
    );
    return;
  }

  if (node.type === "character in") {
    const grid = document.createElement("div");
    grid.className = "field-grid two";
    grid.append(
      makeTextInput("캐릭터 이름", node.name, (value) => node.name = value),
      makeTextInput("표정", node.emotion, (value) => setOptionalString(node, "emotion", value), "일반")
    );
    container.append(grid, createConditionEditor(node));
    return;
  }

  if (node.type === "character out") {
    container.append(
      makeTextInput("캐릭터 이름", node.name, (value) => node.name = value),
      createConditionEditor(node)
    );
    return;
  }

  if (node.type === "endingCheck" || node.type === "scene reset" || node.type === "clear characters" || node.type === "clear background") {
    const empty = document.createElement("p");
    empty.className = "empty-node-text";
    empty.textContent = "추가 입력이 필요 없는 노드입니다.";
    container.append(empty, createConditionEditor(node));
  }
}

function createChoiceItem(choice, choices, choiceIndex) {
  const item = elements.choiceItemTemplate.content.firstElementChild.cloneNode(true);
  const effects = choice.effects || {};
  const condition = choice.condition || {};

  item.querySelector(".choice-text-input").value = choice.text || "";
  item.querySelector(".choice-next-node-input").value = numberToInput(getChoiceNextNodeId(choice));
  item.querySelector(".choice-affection-input").value = numberToInput(effects.affection);
  item.querySelector(".choice-dopamine-input").value = numberToInput(effects.dopamine);
  item.querySelector(".condition-dopamine-min-input").value = numberToInput(condition.dopamineMin);
  item.querySelector(".condition-dopamine-max-input").value = numberToInput(condition.dopamineMax);
  item.querySelector(".condition-affection-min-input").value = numberToInput(condition.affectionMin);
  item.querySelector(".condition-affection-max-input").value = numberToInput(condition.affectionMax);

  item.querySelector(".choice-text-input").addEventListener("input", (event) => choice.text = event.target.value);
  item.querySelector(".choice-next-node-input").addEventListener("input", (event) => setChoiceNextNode(choice, event.target.value));
  item.querySelector(".choice-affection-input").addEventListener("input", (event) => setNestedNumber(choice, "effects", "affection", event.target.value));
  item.querySelector(".choice-dopamine-input").addEventListener("input", (event) => setNestedNumber(choice, "effects", "dopamine", event.target.value));
  item.querySelector(".condition-dopamine-min-input").addEventListener("input", (event) => setNestedNumber(choice, "condition", "dopamineMin", event.target.value));
  item.querySelector(".condition-dopamine-max-input").addEventListener("input", (event) => setNestedNumber(choice, "condition", "dopamineMax", event.target.value));
  item.querySelector(".condition-affection-min-input").addEventListener("input", (event) => setNestedNumber(choice, "condition", "affectionMin", event.target.value));
  item.querySelector(".condition-affection-max-input").addEventListener("input", (event) => setNestedNumber(choice, "condition", "affectionMax", event.target.value));
  item.querySelector(".remove-choice-item").addEventListener("click", () => {
    choices.splice(choiceIndex, 1);
    renderNodes();
  });

  const followList = item.querySelector(".follow-list");
  if (!Array.isArray(choice.follow)) choice.follow = [];
  choice.follow.forEach((line, lineIndex) => followList.append(createFollowLine(choice.follow, line, lineIndex)));
  item.querySelector(".add-follow-line").addEventListener("click", () => {
    choice.follow.push({ speaker: "", text: "" });
    renderNodes();
  });

  return item;
}

function createFollowLine(lines, line, lineIndex) {
  const row = document.createElement("div");
  row.className = "follow-line";
  row.append(
    makeTextInput("화자", line.speaker, (value) => line.speaker = value),
    makeTextarea("발화", line.text, (value) => line.text = value),
    makeButton("삭제", "danger-button small-button", () => {
      lines.splice(lineIndex, 1);
      renderNodes();
    })
  );
  return row;
}

function createConditionEditor(node) {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "실행 조건";
  const condition = node.condition || {};
  const grid = document.createElement("div");
  grid.className = "field-grid four";
  grid.append(
    makeNumberInput("도파민 최소", condition.dopamineMin, (value) => setNestedNumber(node, "condition", "dopamineMin", value)),
    makeNumberInput("도파민 최대", condition.dopamineMax, (value) => setNestedNumber(node, "condition", "dopamineMax", value)),
    makeNumberInput("호감도 최소", condition.affectionMin, (value) => setNestedNumber(node, "condition", "affectionMin", value)),
    makeNumberInput("호감도 최대", condition.affectionMax, (value) => setNestedNumber(node, "condition", "affectionMax", value))
  );
  details.append(summary, grid);
  return details;
}

function bindNodeActions(card, index) {
  const nodes = getSelectedNodes();

  card.querySelector(".move-up").disabled = index === 0;
  card.querySelector(".move-down").disabled = index === nodes.length - 1;
  card.querySelector(".move-up").addEventListener("click", () => swapNodes(index, index - 1));
  card.querySelector(".move-down").addEventListener("click", () => swapNodes(index, index + 1));
  card.querySelector(".delete-node").addEventListener("click", () => {
    nodes.splice(index, 1);
    render();
  });
}

function makeTextInput(labelText, value, onInput, placeholder = "") {
  const label = makeLabel(labelText);
  const input = document.createElement("input");
  input.type = "text";
  input.value = value || "";
  input.placeholder = placeholder;
  input.addEventListener("input", (event) => onInput(event.target.value));
  label.append(input);
  return label;
}

function makeNumberInput(labelText, value, onInput, min = "") {
  const label = makeLabel(labelText);
  const input = document.createElement("input");
  input.type = "number";
  input.min = min;
  input.step = "1";
  input.value = numberToInput(value);
  input.addEventListener("input", (event) => onInput(event.target.value));
  label.append(input);
  return label;
}

function makeSelectInput(labelText, value, options, onInput) {
  const label = makeLabel(labelText);
  const select = document.createElement("select");
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "선택 안 함";
  select.append(emptyOption);
  options.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    select.append(option);
  });
  select.value = value || "";
  select.addEventListener("change", (event) => onInput(event.target.value));
  label.append(select);
  return label;
}

function makeTextarea(labelText, value, onInput) {
  const label = makeLabel(labelText);
  const textarea = document.createElement("textarea");
  textarea.rows = 3;
  textarea.value = value || "";
  textarea.addEventListener("input", (event) => onInput(event.target.value));
  label.append(textarea);
  return label;
}

function makeLabel(text) {
  const label = document.createElement("label");
  label.append(document.createTextNode(text));
  return label;
}

function makeButton(text, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

function getSelectedNodes() {
  return episodes[selectedEpisodeId] || [];
}

function swapNodes(from, to) {
  const nodes = getSelectedNodes();
  const current = nodes[from];
  nodes[from] = nodes[to];
  nodes[to] = current;
  render();
}

function createDefaultNode(type) {
  const base = { type, [UID_KEY]: createUid() };
  if (type === "dialogue") return { ...base, speaker: "", text: "" };
  if (type === "choice") return { ...base, prompt: "", choices: [createDefaultChoice()] };
  if (type === "move") return { ...base, next: "" };
  if (type === "background") return { ...base, name: "" };
  if (type === "character in") return { ...base, name: "", emotion: "" };
  if (type === "character out") return { ...base, name: "" };
  return base;
}

function createDefaultChoice() {
  return { text: "", effects: {} };
}

function numberToInput(value) {
  return Number.isFinite(value) ? String(value) : "";
}

function setOptionalString(target, key, rawValue) {
  const value = rawValue.trim();
  if (!value) delete target[key];
  else target[key] = value;
}

function setOptionalNumber(target, key, rawValue) {
  if (rawValue === "") delete target[key];
  else target[key] = Number(rawValue);
}

function setChoiceNextNode(choice, rawValue) {
  delete choice.nextNode;
  if (rawValue === "") {
    delete choice[NEXT_UID_KEY];
    return;
  }

  const target = getSelectedNodes()[Number(rawValue) - 1];
  if (target) choice[NEXT_UID_KEY] = target[UID_KEY];
}

function setMoveNextNode(node, rawValue) {
  delete node.nextNode;
  if (rawValue === "") {
    delete node[NEXT_UID_KEY];
    return;
  }

  const targetEpisodeId = node.next || selectedEpisodeId;
  const target = episodes[targetEpisodeId]?.[Number(rawValue) - 1];
  if (target) node[NEXT_UID_KEY] = target[UID_KEY];
}

function setAfterNode(node, rawValue) {
  delete node.afterNode;
  if (rawValue === "") {
    delete node[AFTER_UID_KEY];
    return;
  }

  const target = episodes[node.after]?.[Number(rawValue) - 1];
  if (target) node[AFTER_UID_KEY] = target[UID_KEY];
}

function getChoiceNextNodeId(choice) {
  return getNodeIdByUid(selectedEpisodeId, choice[NEXT_UID_KEY]) ?? choice.nextNode;
}

function getMoveNextNodeId(node) {
  const targetEpisodeId = node.next || selectedEpisodeId;
  return getNodeIdByUid(targetEpisodeId, node[NEXT_UID_KEY]) ?? node.nextNode;
}

function getAfterNodeId(node) {
  return getNodeIdByUid(node.after, node[AFTER_UID_KEY]) ?? node.afterNode;
}

function getNodeIdByUid(episodeId, uid) {
  if (!episodeId || !uid || !episodes[episodeId]) return undefined;
  const target = episodes[episodeId].find((node) => node[UID_KEY] === uid);
  return target ? target.id : undefined;
}

function setNestedNumber(target, groupName, key, rawValue) {
  if (!target[groupName]) target[groupName] = {};

  if (rawValue === "") delete target[groupName][key];
  else target[groupName][key] = Number(rawValue);

  if (!Object.keys(target[groupName]).length) delete target[groupName];
}

function addEpisode() {
  let index = Object.keys(episodes).length + 1;
  let id = `EP${index}`;
  while (episodes[id]) id = `EP${++index}`;

  episodes[id] = [];
  selectedEpisodeId = id;
  render();
}

function renameEpisode() {
  const nextId = elements.episodeIdInput.value.trim();
  if (!nextId || nextId === selectedEpisodeId) {
    renderEpisodes();
    return;
  }

  if (episodes[nextId]) {
    alert("이미 존재하는 에피소드 ID입니다.");
    renderEpisodes();
    return;
  }

  const renamed = {};
  Object.entries(episodes).forEach(([episodeId, nodes]) => {
    renamed[episodeId === selectedEpisodeId ? nextId : episodeId] = nodes;
  });

  episodes = renamed;
  selectedEpisodeId = nextId;
  render();
}

function deleteEpisode() {
  const ids = Object.keys(episodes);
  if (ids.length <= 1) {
    episodes[selectedEpisodeId] = [];
    render();
    return;
  }

  delete episodes[selectedEpisodeId];
  selectedEpisodeId = Object.keys(episodes)[0];
  render();
}

function openImportDialog() {
  elements.importText.value = formatJson(getExportEpisodes());
  elements.importMessage.textContent = "";
  elements.importMessage.classList.remove("error");
  elements.importDialog.showModal();
}

function applyImport() {
  try {
    const parsed = parseImportText(elements.importText.value);
    episodes = normalizeImportedData(parsed);
    selectedEpisodeId = Object.keys(episodes)[0];
    elements.importMessage.textContent = "적용했습니다.";
    elements.importMessage.classList.remove("error");
    elements.importDialog.close();
    render();
  } catch (error) {
    elements.importMessage.textContent = error.message;
    elements.importMessage.classList.add("error");
  }
}

function parseImportText(rawText) {
  let text = rawText.trim();
  if (text.startsWith("const EPISODES")) {
    text = text.replace(/^const\s+EPISODES\s*=\s*/, "").replace(/;\s*$/, "");
  }
  return JSON.parse(text);
}

function normalizeImportedData(value) {
  const source = value && value.EPISODES ? value.EPISODES : value;
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new Error("최상위 값은 에피소드 객체여야 합니다.");
  }

  const normalized = {};
  Object.entries(source).forEach(([episodeId, nodes]) => {
    if (!episodeId.trim()) throw new Error("비어 있는 에피소드 ID가 있습니다.");
    if (!Array.isArray(nodes)) throw new Error(`${episodeId} 에피소드가 배열이 아닙니다.`);
    normalized[episodeId] = nodes.map((node) => migrateNode(clone(node)));
  });
  return normalized;
}

function migrateNode(node) {
  if (node.type === "choice" && Array.isArray(node.choices)) {
    node.choices.forEach((choice) => {
      if (choice.nextNode === undefined && Number.isFinite(Number(choice.next))) {
        choice.nextNode = Number(choice.next);
      }
      delete choice.next;
      delete choice.minigame;
      delete choice.subGame;
      delete choice.after;
      delete choice.afterNode;
    });
  }
  return node;
}

function openExportDialog() {
  exportMode = "json";
  updateExportMode();
  elements.exportDialog.showModal();
}

function updateExportMode() {
  elements.showJsonButton.classList.toggle("active", exportMode === "json");
  elements.showJsButton.classList.toggle("active", exportMode === "js");
  elements.exportText.value = exportMode === "json" ? formatJson(getExportEpisodes()) : formatJs(getExportEpisodes());
}

function getExportEpisodes() {
  hydrateEditorState();
  assignNodeIds();
  const exported = clone(episodes);

  Object.entries(exported).forEach(([episodeId, nodes]) => {
    nodes.forEach((node) => {
      if (node.type === "choice" && Array.isArray(node.choices)) {
        node.choices.forEach((choice) => {
          const nextNode = resolveNodeIdByUid(exported, episodeId, choice[NEXT_UID_KEY]);
          if (choice[NEXT_UID_KEY]) {
            if (nextNode !== undefined) choice.nextNode = nextNode;
            else delete choice.nextNode;
          }
          delete choice[NEXT_UID_KEY];
        });
      }

      if (node.type === "move") {
        const targetEpisodeId = node.next || episodeId;
        const nextNode = resolveNodeIdByUid(exported, targetEpisodeId, node[NEXT_UID_KEY]);
        if (node[NEXT_UID_KEY]) {
          if (nextNode !== undefined) node.nextNode = nextNode;
          else delete node.nextNode;
        }

        const afterNode = resolveNodeIdByUid(exported, node.after, node[AFTER_UID_KEY]);
        if (node[AFTER_UID_KEY]) {
          if (afterNode !== undefined) node.afterNode = afterNode;
          else delete node.afterNode;
        }

        delete node[NEXT_UID_KEY];
        delete node[AFTER_UID_KEY];
      }

      delete node[UID_KEY];
    });
  });

  return exported;
}

function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

function formatJs(value) {
  return `const EPISODES = ${formatJson(value)};\n`;
}

async function copyExport() {
  await navigator.clipboard.writeText(elements.exportText.value);
  elements.copyExportButton.textContent = "복사됨";
  window.setTimeout(() => {
    elements.copyExportButton.textContent = "복사";
  }, 1200);
}

function downloadExport() {
  const filename = exportMode === "json" ? "episodes.json" : "story-data.js";
  const blob = new Blob([elements.exportText.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function saveAndOpenTestStory() {
  try {
    const payload = {
      savedAt: new Date().toISOString(),
      startEpisodeId: selectedEpisodeId,
      episodes: getExportEpisodes()
    };
    localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(payload));
    window.open("./gametest/index.html?story=local", "_blank", "noopener");
  } catch (error) {
    alert("테스트 스토리를 저장하지 못했습니다. 브라우저 저장 공간 권한을 확인해 주세요.");
    console.error(error);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createUid() {
  return `node-${nextUid++}`;
}

function resolveNodeIdByUid(sourceEpisodes, episodeId, uid) {
  if (!episodeId || !uid || !sourceEpisodes[episodeId]) return undefined;
  const target = sourceEpisodes[episodeId].find((node) => node[UID_KEY] === uid);
  return target ? target.id : undefined;
}

document.querySelectorAll("[data-add-type]").forEach((button) => {
  button.addEventListener("click", () => {
    getSelectedNodes().push(createDefaultNode(button.dataset.addType));
    render();
  });
});

elements.addEpisodeButton.addEventListener("click", addEpisode);
elements.renameEpisodeButton.addEventListener("click", renameEpisode);
elements.deleteEpisodeButton.addEventListener("click", deleteEpisode);
elements.loadSampleButton.addEventListener("click", () => {
  episodes = clone(sampleEpisodes);
  selectedEpisodeId = Object.keys(episodes)[0];
  render();
});
elements.loadScenario3Button.addEventListener("click", () => {
  if (!scenario3Episodes) {
    alert("3차 시나리오 파일을 불러오지 못했습니다.");
    return;
  }

  episodes = normalizeImportedData(scenario3Episodes);
  selectedEpisodeId = Object.keys(episodes)[0];
  render();
});
elements.importButton.addEventListener("click", openImportDialog);
elements.testStoryButton.addEventListener("click", saveAndOpenTestStory);
elements.exportButton.addEventListener("click", openExportDialog);
elements.applyImportButton.addEventListener("click", applyImport);
elements.showJsonButton.addEventListener("click", () => {
  exportMode = "json";
  updateExportMode();
});
elements.showJsButton.addEventListener("click", () => {
  exportMode = "js";
  updateExportMode();
});
elements.copyExportButton.addEventListener("click", copyExport);
elements.downloadExportButton.addEventListener("click", downloadExport);

render();
