function validateStoryData() {
  const validNodeTypes = Object.values(NODE_TYPES);

  Object.entries(EPISODES).forEach(([episodeId, nodes]) => {
    if (!Array.isArray(nodes)) {
      console.warn("Episode is not an array: " + episodeId);
      return;
    }

    const nodeIds = new Set();

    nodes.forEach((node, index) => {
      const location = episodeId + "[" + index + "]";

      if (!node || typeof node !== "object") {
        console.warn("Invalid node at " + location);
        return;
      }

      if (node.id !== undefined) {
        if (typeof node.id !== "number") {
          console.warn("Node id must be a number at " + location + ": " + node.id);
        } else if (nodeIds.has(node.id)) {
          console.warn("Duplicate node id at " + location + ": " + getNodeKey(episodeId, node.id));
        } else {
          nodeIds.add(node.id);
        }
      }

      if (!validNodeTypes.includes(node.type)) {
        console.warn("Unknown node type at " + location + ": " + node.type);
      }

      validateCondition(node.condition, location);

      if (node.type === NODE_TYPES.BACKGROUND && !node.name) {
        console.warn("Background node has no name at " + location);
      }

      if (node.type === NODE_TYPES.BACKGROUND) {
        validateBackgroundTransition(node, location);
      }

      if (node.type === NODE_TYPES.CHARACTER_IN && !node.name) {
        console.warn("Character node has no name at " + location);
      }

      if (node.type === NODE_TYPES.SOUND) {
        validateSoundNode(node, location);
      }

      if (node.type === NODE_TYPES.MOVE) {
        validateMoveTarget(node.next, node.nextNode, location);
        validateSubGameTarget(node.minigame || node.subGame, node.next, location);
        validateSubGameReturn(node.after, node.afterNode, node.next, location);
      }

      if (node.type === NODE_TYPES.DIALOGUE) {
        if (!node.speaker) console.warn("Dialogue has no speaker at " + location);
        if (!node.text) console.warn("Dialogue has no text at " + location);
      }

      if (node.type === NODE_TYPES.CHOICE) {
        validateChoiceNode(node, episodeId, location);
      }
    });
  });
}

function validateChoiceNode(node, episodeId, location) {
  if (!Array.isArray(node.choices) || node.choices.length === 0) {
    console.warn("Choice has no choices at " + location);
    return;
  }

  node.choices.forEach((choice, choiceIndex) => {
    const choiceLocation = location + ".choices[" + choiceIndex + "]";
    if (!choice.text) console.warn("Choice option has no text at " + choiceLocation);
    validateFollowNodes(choice.follow, choiceLocation);
    validateChoiceTarget(choice.nextNode, episodeId, choiceLocation);
    if (choice.next) {
      console.warn("Choice should use nextNode instead of next at " + choiceLocation);
      validateNextTarget(choice.next, choiceLocation);
    }
    validateCondition(choice.condition, choiceLocation);
  });
}

function validateSoundNode(node, location) {
  const soundType = normalizeSoundType(node.soundType || node.kind || "effect");
  const action = node.action || "play";

  if (!["bgm", "effect"].includes(soundType)) {
    console.warn("Unknown sound type at " + location + ": " + soundType);
  }

  if (!["play", "stop"].includes(action)) {
    console.warn("Unknown sound action at " + location + ": " + action);
  }

  if (action !== "stop" && !node.name) {
    console.warn("Sound node has no name at " + location);
    return;
  }

  if (node.volume !== undefined && (typeof node.volume !== "number" || node.volume < 0 || node.volume > 1)) {
    console.warn("Sound volume must be a number from 0 to 1 at " + location);
  }
}

function validateBackgroundTransition(node, location) {
  const rawOptions = node.transition ?? node.backgroundTransition ?? node.effect;
  const options = rawOptions && typeof rawOptions === "object"
    ? rawOptions
    : { type: rawOptions };
  const type = String(options.type || options.name || rawOptions || "fadeBlack").toLowerCase();
  const validTypes = ["fadeblack", "fade-black", "fade", "black", "fadeinout", "fade-in-out", "fadeslide", "fade-slide", "slide", "none", "cut", "instant"];
  const duration = options.duration ?? node.transitionDuration;
  const direction = options.direction ?? node.transitionDirection;
  const slideDuration = options.slideDuration ?? options.revealDuration ?? node.transitionSlideDuration;
  const slideSpeed = options.slideSpeed ?? options.speed ?? node.transitionSlideSpeed;

  if (!validTypes.includes(type)) {
    console.warn("Unknown background transition at " + location + ": " + type);
  }

  if (duration !== undefined && (typeof duration !== "number" || duration < 120 || duration > 2000)) {
    console.warn("Background transition duration must be a number from 120 to 2000 at " + location);
  }

  if (direction !== undefined && direction !== "left" && direction !== "right") {
    console.warn("Background transition direction must be left or right at " + location);
  }

  if (slideDuration !== undefined && (typeof slideDuration !== "number" || slideDuration < 120 || slideDuration > 2000)) {
    console.warn("Background slide duration must be a number from 120 to 2000 at " + location);
  }

  if (slideSpeed !== undefined && (typeof slideSpeed !== "number" || slideSpeed < 0.25 || slideSpeed > 4)) {
    console.warn("Background slide speed must be a number from 0.25 to 4 at " + location);
  }
}

function normalizeSoundType(soundType) {
  if (soundType === "music") return "bgm";
  if (soundType === "sfx" || soundType === "effects") return "effect";
  return soundType;
}

function validateNextTarget(next, location) {
  if (!next) {
    console.warn("Missing next target at " + location);
    return;
  }

  if (next === NEXT_TARGETS.MINIGAME) return;

  if (!EPISODES[next]) {
    console.warn("Unknown next episode at " + location + ": " + next);
  }
}

function validateMoveTarget(next, nextNode, location) {
  if (!next && (nextNode === null || nextNode === undefined)) {
    console.warn("Missing move target at " + location);
    return;
  }

  if (next) {
    validateNextTarget(next, location);
  }

  if (next === NEXT_TARGETS.MINIGAME) return;

  const targetEpisodeId = next || location.split("[")[0];
  if (nextNode !== null && nextNode !== undefined) {
    validateNodeTarget(targetEpisodeId, nextNode, location);
  }
}

function validateChoiceTarget(nextNode, episodeId, location) {
  if (nextNode === null || nextNode === undefined) {
    console.warn("Choice option has no nextNode at " + location);
    return;
  }

  validateNodeTarget(episodeId, nextNode, location);
}

function validateNodeTarget(episodeId, nextNode, location) {
  if (typeof nextNode !== "number") {
    console.warn("Node target must be a number at " + location + ": " + nextNode);
    return;
  }

  if (getNodeIndexById(episodeId, nextNode) === -1) {
    console.warn("Unknown node target at " + location + ": " + getNodeKey(episodeId, nextNode));
  }
}

function validateSubGameTarget(subGameId, next, location) {
  if (next !== NEXT_TARGETS.MINIGAME) return;

  if (!subGameId) {
    console.warn("Missing sub game id at " + location + ". Using default: " + SUB_GAMES.BRICK_BREAKER);
    return;
  }

  if (!SUB_GAME_MANIFEST[subGameId]) {
    console.warn("Unknown sub game at " + location + ": " + subGameId);
  }
}

function validateSubGameReturn(after, afterNode, next, location) {
  if (next !== NEXT_TARGETS.MINIGAME || !after) return;

  if (!EPISODES[after]) {
    console.warn("Unknown sub game return episode at " + location + ": " + after);
    return;
  }

  if (afterNode !== null && afterNode !== undefined) {
    validateNodeTarget(after, afterNode, location);
  }
}

function validateCondition(condition, location) {
  if (!condition) return;

  const validConditionKeys = ["dopamineMin", "dopamineMax", "affectionMin", "affectionMax"];

  Object.keys(condition).forEach((key) => {
    if (!validConditionKeys.includes(key)) {
      console.warn("Unknown condition key at " + location + ": " + key);
    }
  });

  validConditionKeys.forEach((key) => {
    if (condition[key] !== undefined && typeof condition[key] !== "number") {
      console.warn("Condition value must be a number at " + location + ": " + key);
    }
  });
}

function validateFollowNodes(follow, location) {
  if (follow === undefined) return;

  if (!Array.isArray(follow)) {
    console.warn("Choice follow must be an array at " + location);
    return;
  }

  follow.forEach((line, index) => {
    const lineLocation = location + ".follow[" + index + "]";
    if (!line || typeof line !== "object") {
      console.warn("Invalid follow line at " + lineLocation);
      return;
    }

    if (!line.speaker) console.warn("Follow line has no speaker at " + lineLocation);
    if (!line.text) console.warn("Follow line has no text at " + lineLocation);
  });
}

function getNodeIndexById(episodeId, nodeId) {
  const nodes = EPISODES[episodeId];
  if (!Array.isArray(nodes)) return -1;

  return nodes.findIndex((node) => node && node.id === nodeId);
}

function getNodeKey(episodeId, nodeId) {
  return episodeId + "#" + nodeId;
}
