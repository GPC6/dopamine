const NODE_LABELS = {
  background: "배경",
  "character in": "캐릭터 등장",
  "character out": "캐릭터 퇴장",
  "clear characters": "캐릭터 지우기",
  "clear background": "배경 지우기",
  "scene reset": "장면 초기화",
  sound: "사운드",
  dialogue: "대사",
  choice: "선택지",
  move: "이동",
  endingCheck: "엔딩 체크"
};

const SUB_GAME_OPTIONS = typeof SUB_GAMES === "undefined" ? ["brickBreaker", "sideShooter"] : Object.values(SUB_GAMES);
const UID_KEY = "__editorUid";
const NEXT_UID_KEY = "__editorNextUid";
const AFTER_UID_KEY = "__editorAfterUid";
const TEST_STORAGE_KEY = "dopaStoryEditor.testEpisodes";

let nextUid = 1;

const sampleEpisodes = {
  EP1: [
    { id: 1, type: "background", name: "bedroomNight" },
    { id: 2, type: "dialogue", speaker: "주인공", text: "잠이 오지 않아~" },
    { id: 3, type: "character in", name: "수진", emotion: "일반" },
    { id: 4, type: "dialogue", speaker: "수진", text: "헬로~" },
    {
      id: 5,
      type: "choice",
      prompt: "누구지..?",
      choices: [
        {
          text: "수진이니?",
          effects: { dopamine: 0, affection: 20 },
          follow: [],
          nextNode: 6
        },
        {
          text: "몰루",
          effects: { dopamine: 0, affection: 0 },
          follow: [],
          nextNode: 6
        }
      ]
    },
    { id: 6, type: "character in", name: "혜지", emotion: "일반" },
    { id: 7, type: "dialogue", speaker: "혜지", text: "사랑해 자기야!", condition: { affectionMin: 15 } },
    { id: 8, type: "dialogue", speaker: "혜지", text: "어서오고 ㅋㅋ" },
    { id: 9, type: "character in", name: "건호", emotion: "일반" },
    { id: 10, type: "dialogue", speaker: "형근", text: "저는 형근입니다." }
  ]
};

let episodes = clone(sampleEpisodes);
let selectedEpisodeId = Object.keys(episodes)[0];
let exportMode = "json";
let activeNodeUid = null;
const gameStoryEpisodes = typeof EPISODES === "undefined" ? null : clone(EPISODES);
const gameStoryStartEpisodeId = typeof STORY_START_EPISODE === "undefined" ? null : STORY_START_EPISODE;
const gameAssetManifest = typeof ASSET_MANIFEST === "undefined" ? { backgrounds: {}, characters: {} } : ASSET_MANIFEST;

const elements = {
  episodeList: document.querySelector("#episodeList"),
  nodeList: document.querySelector("#nodeList"),
  episodeIdInput: document.querySelector("#episodeIdInput"),
  addEpisodeButton: document.querySelector("#addEpisodeButton"),
  renameEpisodeButton: document.querySelector("#renameEpisodeButton"),
  deleteEpisodeButton: document.querySelector("#deleteEpisodeButton"),
  loadSampleButton: document.querySelector("#loadSampleButton"),
  loadGameStoryButton: document.querySelector("#loadGameStoryButton"),
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
  if (!getActiveNode()) activeNodeUid = null;
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
      activeNodeUid = null;
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
  card.classList.toggle("active", node[UID_KEY] === activeNodeUid);
  card.querySelector(".node-id").textContent = `#${index + 1}`;
  card.querySelector(".node-title").textContent = NODE_LABELS[node.type] || node.type;

  const fields = card.querySelector(".node-fields");
  renderNodeFields(fields, node);
  bindNodeActions(card, node, index);
  return card;
}

function renderNodeFields(container, node) {
  container.innerHTML = "";

  if (node.type === "dialogue") {
    container.append(
      makeComboInput("화자", node.speaker, (value) => node.speaker = value, getSuggestionOptions("characters")),
      makeTextarea("대사", node.text, (value) => node.text = value),
      createEffectsEditor(node),
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
      makeSelectInput("미니게임", node.minigame, SUB_GAME_OPTIONS, (value) => setOptionalString(node, "minigame", value))
    );

    const returnGrid = document.createElement("div");
    returnGrid.className = "field-grid two";
    returnGrid.append(
      makeTextInput("미니게임 후 에피소드", node.after, (value) => setOptionalString(node, "after", value)),
      makeNumberInput("미니게임 후 노드 번호", getAfterNodeId(node), (value) => setAfterNode(node, value))
    );

    container.append(grid, returnGrid, createSubGameOptionsEditor(node), createConditionEditor(node));
    return;
  }

  if (node.type === "sound") {
    const grid = document.createElement("div");
    grid.className = "field-grid four";
    grid.append(
      makeSelectInput("사운드 종류", node.soundType || node.kind, ["bgm", "effect"], (value) => setOptionalString(node, "soundType", value)),
      makeSelectInput("동작", node.action, ["play", "stop"], (value) => setOptionalString(node, "action", value)),
      makeComboInput("사운드 이름", node.name, (value) => setOptionalString(node, "name", value), getSuggestionOptions("sounds", node.soundType || node.kind || "effect")),
      makeNumberInput("볼륨", node.volume, (value) => setOptionalNumber(node, "volume", value))
    );
    container.append(grid, createConditionEditor(node));
    return;
  }

  if (node.type === "background") {
    container.append(
      makeComboInput("배경 이름", node.name, (value) => node.name = value, getSuggestionOptions("backgrounds"), "dummy"),
      createBackgroundTransitionEditor(node),
      createConditionEditor(node)
    );
    return;
  }

  if (node.type === "character in") {
    const grid = document.createElement("div");
    grid.className = "field-grid two";
    grid.append(
      makeComboInput("캐릭터 이름", node.name, (value) => node.name = value, getSuggestionOptions("characters")),
      makeComboInput("표정", node.emotion, (value) => setOptionalString(node, "emotion", value), getSuggestionOptions("emotions", node.name), "일반")
    );
    container.append(grid, createConditionEditor(node));
    return;
  }

  if (node.type === "character out") {
    container.append(
      makeComboInput("캐릭터 이름", node.name, (value) => node.name = value, getSuggestionOptions("characters")),
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
  item.append(createEmbeddedSoundEditor(choice, "선택 효과음"));

  return item;
}

function createFollowLine(lines, line, lineIndex) {
  const row = document.createElement("div");
  row.className = "follow-line";
  row.append(
    makeComboInput("화자", line.speaker, (value) => line.speaker = value, getSuggestionOptions("characters")),
    makeTextarea("발화", line.text, (value) => line.text = value),
    makeButton("삭제", "danger-button small-button", () => {
      lines.splice(lineIndex, 1);
      renderNodes();
    }),
    createEffectsEditor(line),
    createEmbeddedSoundEditor(line, "발화 효과음")
  );
  return row;
}

function createEffectsEditor(target) {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "수치 변화";
  const effects = target.effects || {};
  const grid = document.createElement("div");
  grid.className = "field-grid two";
  grid.append(
    makeNumberInput("도파민 변화", effects.dopamine, (value) => setNestedNumber(target, "effects", "dopamine", value)),
    makeNumberInput("호감도 변화", effects.affection, (value) => setNestedNumber(target, "effects", "affection", value))
  );
  details.append(summary, grid);
  return details;
}

function createBackgroundTransitionEditor(node) {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "배경 전환";
  const grid = document.createElement("div");
  grid.className = "field-grid four";
  grid.append(
    makeSelectInput("전환 방식", getBackgroundTransitionType(node), ["fadeBlack", "fadeSlide", "none"], (value) => setBackgroundTransitionType(node, value)),
    makeNumberInput("전환 시간(ms)", getBackgroundTransitionDuration(node), (value) => setBackgroundTransitionDuration(node, value), 120),
    makeSelectInput("슬라이드 방향", getBackgroundTransitionDirection(node), ["right", "left"], (value) => setBackgroundTransitionDirection(node, value)),
    makeNumberInput("슬라이드 시간(ms)", getBackgroundSlideDuration(node), (value) => setBackgroundSlideDuration(node, value), 120)
  );
  details.append(summary, grid);
  return details;
}

function createEmbeddedSoundEditor(target, title) {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const sound = target.sound || {};
  const grid = document.createElement("div");
  const getSoundType = () => target.sound?.soundType || target.sound?.kind || "effect";

  summary.textContent = title;
  grid.className = "field-grid four";
  grid.append(
    makeSelectInput("사운드 종류", sound.soundType || sound.kind, ["effect", "bgm"], (value) => setNestedSoundString(target, "soundType", value)),
    makeSelectInput("동작", sound.action, ["play", "stop"], (value) => setNestedSoundString(target, "action", value)),
    makeComboInput("사운드 이름", sound.name, (value) => setNestedSoundString(target, "name", value), getSuggestionOptions("sounds", getSoundType())),
    makeNumberInput("볼륨", sound.volume, (value) => setNestedSoundNumber(target, "volume", value))
  );
  details.append(summary, grid);
  return details;
}

function createSubGameOptionsEditor(node) {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const options = getSubGameOptions(node);
  const grid = document.createElement("div");

  summary.textContent = "미니게임 옵션";
  grid.className = "field-grid five";
  grid.append(
    makeNumberInput("최대 턴", options.maxTurns, (value) => setSubGameOptionNumber(node, "maxTurns", value), 1),
    makeNumberInput("난이도", options.difficulty, (value) => setSubGameOptionNumber(node, "difficulty", value), 0),
    makeNumberInput("진행 시간(초)", options.durationSeconds, (value) => setSubGameOptionNumber(node, "durationSeconds", value), 5),
    makeNumberInput("최대 시간(초)", options.maxDuration, (value) => setSubGameOptionNumber(node, "maxDuration", value), 5),
    makeNumberInput("최대 초", options.maxSeconds, (value) => setSubGameOptionNumber(node, "maxSeconds", value), 5)
  );
  details.append(summary, grid, createSubGameTutorialEditor(node));
  return details;
}

function createSubGameTutorialEditor(node) {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  const tutorial = getSubGameTutorial(node);
  const list = document.createElement("div");
  const addButton = makeButton("튜토리얼 발화 추가", "secondary-button", () => {
    const next = getSubGameTutorial(node);
    next.steps.push("");
    writeSubGameTutorial(node, next);
    renderNodes();
  });

  summary.textContent = "미니게임 튜토리얼";
  list.className = "choice-items";
  tutorial.steps.forEach((text, index) => {
    const row = document.createElement("div");
    row.className = "follow-line";
    row.append(
      makeTextarea("발화", text, (value) => setSubGameTutorialStep(node, index, value)),
      makeButton("삭제", "danger-button small-button", () => {
        const next = getSubGameTutorial(node);
        next.steps.splice(index, 1);
        writeSubGameTutorial(node, next);
        renderNodes();
      })
    );
    list.append(row);
  });

  details.append(
    summary,
    makeComboInput("안내 화자", tutorial.speaker, (value) => setSubGameTutorialSpeaker(node, value), getSuggestionOptions("characters"), "파미니"),
    list,
    addButton
  );
  return details;
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

function bindNodeActions(card, node, index) {
  const nodes = getSelectedNodes();

  card.addEventListener("pointerdown", () => setActiveNode(node));
  card.addEventListener("focusin", () => setActiveNode(node));
  card.querySelector(".move-up").disabled = index === 0;
  card.querySelector(".move-down").disabled = index === nodes.length - 1;
  card.querySelector(".move-up").addEventListener("click", () => {
    setActiveNode(node);
    swapNodes(index, index - 1);
  });
  card.querySelector(".move-down").addEventListener("click", () => {
    setActiveNode(node);
    swapNodes(index, index + 1);
  });
  card.querySelector(".duplicate-node").addEventListener("click", () => duplicateNode(index));
  card.querySelector(".delete-node").addEventListener("click", () => {
    nodes.splice(index, 1);
    activeNodeUid = nodes[index]?.[UID_KEY] || nodes[index - 1]?.[UID_KEY] || null;
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

function makeComboInput(labelText, value, onInput, options, placeholder = "") {
  const label = makeLabel(labelText);
  const wrap = document.createElement("div");
  const input = document.createElement("input");
  const select = document.createElement("select");
  const datalist = document.createElement("datalist");
  const listId = `list-${Math.random().toString(36).slice(2)}`;
  const optionValues = uniqueSorted(options);

  wrap.className = "combo-input";

  datalist.id = listId;
  optionValues.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    datalist.append(option);
  });

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "목록에서 선택";
  select.append(emptyOption);
  optionValues.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    select.append(option);
  });

  input.type = "text";
  input.value = value || "";
  input.placeholder = placeholder;
  input.setAttribute("list", listId);
  input.addEventListener("input", (event) => {
    select.value = optionValues.includes(event.target.value) ? event.target.value : "";
    onInput(event.target.value);
  });
  select.value = optionValues.includes(value) ? value : "";
  select.addEventListener("change", (event) => {
    input.value = event.target.value;
    onInput(event.target.value);
  });

  wrap.append(input, select);
  label.append(wrap, datalist);
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

function getSuggestionOptions(kind, option = "") {
  const values = [];

  if (kind === "backgrounds") {
    values.push(...Object.keys(gameAssetManifest.backgrounds || {}));
  }

  if (kind === "characters") {
    values.push(...Object.keys(gameAssetManifest.characters || {}));
    values.push("주인공", "지시문", "나레이션", "END");
  }

  if (kind === "emotions") {
    const characterAssets = gameAssetManifest.characters || {};
    const emotionGroups = option && characterAssets[option]
      ? [characterAssets[option]]
      : Object.values(characterAssets);
    emotionGroups.forEach((emotions) => {
      values.push(...Object.keys(emotions || {}));
    });
  }

  if (kind === "sounds") {
    const sounds = gameAssetManifest.sounds || {};
    const soundType = option === "bgm" ? "bgm" : "effects";
    values.push(...Object.keys(sounds[soundType] || {}));
  }

  Object.values(episodes).forEach((nodes) => {
    nodes.forEach((node) => {
      if (kind === "backgrounds" && node.type === "background" && node.name) values.push(node.name);

      if (kind === "characters") {
        if (node.name && (node.type === "character in" || node.type === "character out")) values.push(node.name);
        if (node.speaker) values.push(node.speaker);
        if (node.type === "choice" && Array.isArray(node.choices)) {
          node.choices.forEach((choice) => {
            (choice.follow || []).forEach((line) => {
              if (line.speaker) values.push(line.speaker);
            });
          });
        }
      }

      if (kind === "emotions" && node.emotion) values.push(node.emotion);

      if (kind === "sounds" && node.type === "sound" && node.name) {
        collectSoundSuggestion(values, option, node);
      }

      if (kind === "sounds" && node.type === "choice" && Array.isArray(node.choices)) {
        node.choices.forEach((choice) => {
          collectSoundSuggestion(values, option, choice.sound);
          (choice.follow || []).forEach((line) => collectSoundSuggestion(values, option, line.sound));
        });
      }
    });
  });

  return uniqueSorted(values);
}

function collectSoundSuggestion(values, option, sound) {
  if (!sound || !sound.name) return;

  const soundType = sound.soundType || sound.kind || "effect";
  if ((option === "bgm" && soundType === "bgm") || (option !== "bgm" && soundType !== "bgm")) {
    values.push(sound.name);
  }
}

function uniqueSorted(values) {
  return Array.from(new Set(values.filter((value) => typeof value === "string" && value.trim()).map((value) => value.trim())))
    .sort((a, b) => a.localeCompare(b, "ko"));
}

function getSelectedNodes() {
  return episodes[selectedEpisodeId] || [];
}

function getActiveNode() {
  return getSelectedNodes().find((node) => node[UID_KEY] === activeNodeUid) || null;
}

function getActiveNodeIndex() {
  return getSelectedNodes().findIndex((node) => node[UID_KEY] === activeNodeUid);
}

function setActiveNode(node) {
  activeNodeUid = node ? node[UID_KEY] : null;
}

function insertNodeAfterActive(node) {
  const nodes = getSelectedNodes();
  const activeIndex = getActiveNodeIndex();
  const insertIndex = activeIndex === -1 ? nodes.length : activeIndex + 1;
  nodes.splice(insertIndex, 0, node);
  setActiveNode(node);
  render();
}

function duplicateNode(index) {
  const nodes = getSelectedNodes();
  const source = nodes[index];
  if (!source) return;

  const duplicated = clone(source);
  duplicated[UID_KEY] = createUid();
  nodes.splice(index + 1, 0, duplicated);
  setActiveNode(duplicated);
  render();
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
  if (type === "sound") return { ...base, soundType: "effect", action: "play", name: "" };
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

function getBackgroundTransitionObject(node) {
  if (node.transition && typeof node.transition === "object") return node.transition;
  if (node.backgroundTransition && typeof node.backgroundTransition === "object") return node.backgroundTransition;
  if (node.effect && typeof node.effect === "object") return node.effect;
  return null;
}

function getBackgroundTransitionType(node) {
  const options = getBackgroundTransitionObject(node);
  if (options) return options.type || options.name || "";
  return node.transition || node.backgroundTransition || node.effect || "";
}

function getBackgroundTransitionDuration(node) {
  const options = getBackgroundTransitionObject(node);
  return options && options.duration !== undefined ? options.duration : node.transitionDuration;
}

function getBackgroundTransitionDirection(node) {
  const options = getBackgroundTransitionObject(node);
  return options && options.direction !== undefined ? options.direction : node.transitionDirection;
}

function getBackgroundSlideDuration(node) {
  const options = getBackgroundTransitionObject(node);
  return options && options.slideDuration !== undefined ? options.slideDuration : node.transitionSlideDuration;
}

function setBackgroundTransitionType(node, rawValue) {
  const value = rawValue.trim();
  const options = getBackgroundTransitionObject(node);
  if (options) {
    if (!value) delete options.type;
    else options.type = value;
    return;
  }

  if (!value) delete node.transition;
  else node.transition = value;
}

function setBackgroundTransitionDuration(node, rawValue) {
  const options = getBackgroundTransitionObject(node);
  if (options) {
    if (rawValue === "") delete options.duration;
    else options.duration = Number(rawValue);
    return;
  }

  setOptionalNumber(node, "transitionDuration", rawValue);
}

function setBackgroundTransitionDirection(node, rawValue) {
  const value = rawValue.trim();
  const options = getBackgroundTransitionObject(node);
  if (options) {
    if (!value) delete options.direction;
    else options.direction = value;
    return;
  }

  setOptionalString(node, "transitionDirection", value);
}

function setBackgroundSlideDuration(node, rawValue) {
  const options = getBackgroundTransitionObject(node);
  if (options) {
    if (rawValue === "") delete options.slideDuration;
    else options.slideDuration = Number(rawValue);
    return;
  }

  setOptionalNumber(node, "transitionSlideDuration", rawValue);
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

function setNestedSoundString(target, key, rawValue) {
  if (!target.sound) target.sound = {};
  setOptionalString(target.sound, key, rawValue);
  cleanupEmptyObject(target, "sound");
}

function setNestedSoundNumber(target, key, rawValue) {
  if (!target.sound) target.sound = {};
  setOptionalNumber(target.sound, key, rawValue);
  cleanupEmptyObject(target, "sound");
}

function getSubGameOptions(node) {
  if (node.options && typeof node.options === "object") return node.options;
  if (node.subGameOptions && typeof node.subGameOptions === "object") return node.subGameOptions;
  if (node.minigameOptions && typeof node.minigameOptions === "object") return node.minigameOptions;
  return {};
}

function ensureSubGameOptions(node) {
  if (!node.options || typeof node.options !== "object") {
    node.options = { ...getSubGameOptions(node) };
    delete node.subGameOptions;
    delete node.minigameOptions;
  }

  return node.options;
}

function setSubGameOptionNumber(node, key, rawValue) {
  const options = ensureSubGameOptions(node);
  setOptionalNumber(node.options, key, rawValue);
  cleanupEmptyObject(node, "options");
}

function getSubGameTutorial(node) {
  const tutorial = getSubGameOptions(node).tutorial;
  if (Array.isArray(tutorial)) {
    return {
      speaker: "",
      steps: tutorial.map((step) => typeof step === "string" ? step : step?.text || "")
    };
  }

  if (tutorial && typeof tutorial === "object") {
    const rawSteps = Array.isArray(tutorial.steps) ? tutorial.steps : [];
    return {
      speaker: tutorial.speaker || "",
      steps: rawSteps.map((step) => typeof step === "string" ? step : step?.text || "")
    };
  }

  return { speaker: "", steps: [] };
}

function setSubGameTutorialSpeaker(node, rawValue) {
  const tutorial = getSubGameTutorial(node);
  tutorial.speaker = rawValue.trim();
  writeSubGameTutorial(node, tutorial);
}

function setSubGameTutorialStep(node, index, rawValue) {
  const tutorial = getSubGameTutorial(node);
  tutorial.steps[index] = rawValue;
  writeSubGameTutorial(node, tutorial);
}

function writeSubGameTutorial(node, tutorial) {
  const options = ensureSubGameOptions(node);
  const steps = tutorial.steps.filter((step) => typeof step === "string");
  const speaker = tutorial.speaker.trim();

  if (!steps.length && !speaker) {
    delete options.tutorial;
  } else if (speaker) {
    options.tutorial = { speaker, steps };
  } else {
    options.tutorial = steps;
  }

  cleanupEmptyObject(node, "options");
}

function cleanupEmptyObject(target, key) {
  if (target[key] && typeof target[key] === "object" && !Object.keys(target[key]).length) {
    delete target[key];
  }
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
  activeNodeUid = null;
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
    activeNodeUid = null;
    render();
    return;
  }

  delete episodes[selectedEpisodeId];
  selectedEpisodeId = Object.keys(episodes)[0];
  activeNodeUid = null;
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
    const importedStartEpisodeId = parsed && (parsed.STORY_START_EPISODE || parsed.startEpisodeId);
    selectedEpisodeId = importedStartEpisodeId && episodes[importedStartEpisodeId]
      ? importedStartEpisodeId
      : Object.keys(episodes)[0];
    activeNodeUid = null;
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
  const startEpisodeMatch = text.match(/const\s+STORY_START_EPISODE\s*=\s*("[^"]+"|'[^']+')\s*;/);
  const startEpisodeId = startEpisodeMatch ? JSON.parse(startEpisodeMatch[1].replace(/^'/, "\"").replace(/'$/, "\"")) : null;

  if (text.startsWith("const EPISODES")) {
    text = text.replace(/^const\s+EPISODES\s*=\s*/, "").replace(/;\s*$/, "");
  }

  if (text.includes("const EPISODES")) {
    text = text.replace(/^[\s\S]*?const\s+EPISODES\s*=\s*/, "").replace(/;\s*$/, "");
  }

  const parsed = JSON.parse(text);
  if (startEpisodeId) {
    return {
      STORY_START_EPISODE: startEpisodeId,
      EPISODES: parsed
    };
  }

  return parsed;
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
  const startEpisodeId = episodes[selectedEpisodeId] ? selectedEpisodeId : Object.keys(episodes)[0];
  return `const STORY_START_EPISODE = ${JSON.stringify(startEpisodeId)};\nconst EPISODES = ${formatJson(value)};\n`;
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
    insertNodeAfterActive(createDefaultNode(button.dataset.addType));
  });
});

elements.addEpisodeButton.addEventListener("click", addEpisode);
elements.renameEpisodeButton.addEventListener("click", renameEpisode);
elements.deleteEpisodeButton.addEventListener("click", deleteEpisode);
elements.loadSampleButton.addEventListener("click", () => {
  episodes = clone(sampleEpisodes);
  selectedEpisodeId = Object.keys(episodes)[0];
  activeNodeUid = null;
  render();
});
elements.loadGameStoryButton.addEventListener("click", () => {
  if (!gameStoryEpisodes) {
    alert("본게임 story-data-excel 파일을 불러오지 못했습니다.");
    return;
  }

  episodes = normalizeImportedData(gameStoryEpisodes);
  selectedEpisodeId = gameStoryStartEpisodeId && episodes[gameStoryStartEpisodeId]
    ? gameStoryStartEpisodeId
    : Object.keys(episodes)[0];
  activeNodeUid = null;
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
