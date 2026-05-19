const CONFIG = {
  width: 1280,
  height: 720,
  initialDopamine: 50,
  initialAffection: 0
};

const SCENES = {
  TITLE: "title",
  STORY: "story",
  MINIGAME: "minigame",
  ENDING: "ending"
};

const NODE_TYPES = {
  BACKGROUND: "background",
  CHARACTER_IN: "character in",
  CHARACTER_OUT: "character out",
  CLEAR_CHARACTERS: "clear characters",
  CLEAR_BACKGROUND: "clear background",
  SCENE_RESET: "scene reset",
  DIALOGUE: "dialogue",
  CHOICE: "choice",
  MOVE: "move",
  ENDING_CHECK: "endingCheck"
};

const NEXT_TARGETS = {
  MINIGAME: "MINIGAME"
};

const SUB_GAMES = {
  BRICK_BREAKER: "brickBreaker",
  SIDE_SHOOTER: "sideShooter"
};

const SUB_GAME_MANIFEST = {
  [SUB_GAMES.BRICK_BREAKER]: {
    title: "도파민 벽돌깨기",
    className: "BrickBreakerGame"
  },
  [SUB_GAMES.SIDE_SHOOTER]: {
    title: "뉴럴 사이드 슈터",
    className: "SideShooterGame"
  }
};

const ASSET_MANIFEST = {
  backgrounds: {
    dummy: "./assets/bg/dummy.png"
  },
  characters: {
    수진: {
      default: "./assets/char/수진.png",
      일반: "./assets/char/수진.png"
    },
    혜지: {
      default: "./assets/char/혜지.png",
      일반: "./assets/char/혜지.png"
    },
    건호: {
      default: "./assets/char/건호.png",
      일반: "./assets/char/건호.png"
    }
  }
};
