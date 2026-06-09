(function (global) {
  const HANGUL_START = 0xac00;
  const HANGUL_END = 0xd7a3;
  const RIEUL_BATCHIM_INDEX = 8;
  const DIRECT_SUFFIX_PAIRS = {
    아: "아/야",
    야: "아/야",
    가: "가/이가",
    이가: "가/이가",
    은: "은/는",
    는: "은/는",
    을: "을/를",
    를: "을/를",
    와: "와/과",
    과: "와/과",
    로: "으로/로",
    으로: "으로/로"
  };

  function getLastLetter(text) {
    const letters = Array.from(String(text || "").trim());

    for (let i = letters.length - 1; i >= 0; i -= 1) {
      if (!/[\s"'`.,!?()[\]{}<>:;~…“”‘’]/.test(letters[i])) {
        return letters[i];
      }
    }

    return "";
  }

  function getBatchimInfo(text) {
    const letter = getLastLetter(text);
    const code = letter.charCodeAt(0);

    if (code < HANGUL_START || code > HANGUL_END) {
      return { hasBatchim: false, isRieul: false };
    }

    const batchimIndex = (code - HANGUL_START) % 28;
    return {
      hasBatchim: batchimIndex !== 0,
      isRieul: batchimIndex === RIEUL_BATCHIM_INDEX
    };
  }

  function pickJosa(text, pair) {
    const normalizedPair = String(pair || "").replace(/\s/g, "");
    const info = getBatchimInfo(text);

    if (normalizedPair === "은/는" || normalizedPair === "는/은") {
      return info.hasBatchim ? "은" : "는";
    }

    if (normalizedPair === "이/가") {
      return info.hasBatchim ? "이" : "가";
    }

    if (normalizedPair === "가/이가" || normalizedPair === "이가/가") {
      return info.hasBatchim ? "이가" : "가";
    }

    if (normalizedPair === "을/를" || normalizedPair === "를/을") {
      return info.hasBatchim ? "을" : "를";
    }

    if (normalizedPair === "와/과" || normalizedPair === "과/와") {
      return info.hasBatchim ? "과" : "와";
    }

    if (normalizedPair === "아/야" || normalizedPair === "야/아") {
      return info.hasBatchim ? "아" : "야";
    }

    if (normalizedPair === "이야/야" || normalizedPair === "야/이야") {
      return info.hasBatchim ? "이야" : "야";
    }

    if (normalizedPair === "이에요/예요" || normalizedPair === "예요/이에요") {
      return info.hasBatchim ? "이에요" : "예요";
    }

    if (normalizedPair === "으로/로" || normalizedPair === "로/으로") {
      return info.hasBatchim && !info.isRieul ? "으로" : "로";
    }

    if (normalizedPair === "를/이를" || normalizedPair === "이를/를") {
      return info.hasBatchim ? "이를" : "를";
    }

    if (normalizedPair === "는/이는" || normalizedPair === "이는/는") {
      return info.hasBatchim ? "이는" : "는";
    }

    if (normalizedPair === "랑/이랑" || normalizedPair === "이랑/랑") {
      return info.hasBatchim ? "이랑" : "랑";
    }

    return normalizedPair;
  }

  function attach(text, pair) {
    return String(text || "") + pickJosa(text, pair);
  }

  function replaceNameTokens(text, name) {
    const playerName = name || "진수";

    return String(text || "")
      .replace(/(000|OO|(?<!\d)00(?!\d))\(([^)]+)\)/g, function (_, token, pair) {
        return attach(playerName, pair);
      })
      .replace(/(000|OO|(?<!\d)00(?!\d))(이가|으로|아|야|가|이|은|는|을|를|와|과|로)(?=$|[\s"'`.,!?()[\]{}<>:;~…“”‘’])/g, function (_, token, suffix) {
        if (suffix === "이") {
          return playerName + (getBatchimInfo(playerName).hasBatchim ? "이" : "");
        }
        return attach(playerName, DIRECT_SUFFIX_PAIRS[suffix]);
      })
      .replace(/000|OO|(?<!\d)00(?!\d)/g, playerName);
  }

  global.KoreanJosa = {
    attach,
    hasBatchim: function (text) {
      return getBatchimInfo(text).hasBatchim;
    },
    pick: pickJosa,
    replaceNameTokens
  };
})(window);
