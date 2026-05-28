const CONFIG = {
  width: 1280,
  height: 720,
  initialDopamine: 50,
  initialAffection: 0
};

const SCENES = {
  TITLE: "title",
  STORY: "story",
  DOPAMINE_READY: "dopamineReady",
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
  SOUND: "sound",
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
    dummy: "./assets/bg/convenience_store_night.png",
    convenienceStore: "./assets/bg/convenience_store_night.png",
    bedroomNight: "./assets/bg/bedroom_night.png",
    "도서관 열람실": "./assets/bg/library_reading_room.png",
    "편의점": "./assets/bg/convenience_store_night.png",
    "강의실 혹은 동아리방": "./assets/bg/club_classroom.png",
    "MT 장소": "./assets/bg/mt_room.png",
    "(CG) MT 장소에 둘러앉은 주인공, 수진, 건호, 혜지": "./assets/bg/mt_group_cg.png",
    "소주병을 향해 뻗는 수진의 손": "./assets/bg/soju_hand.png",
    "소주병을 향해 뻗는 수진의 손을 잡는 건호의 손": "./assets/bg/soju_hand_stopped.png",
    "공포방탈출 입구": "./assets/bg/escape_room_entrance.png",
    "공포방탈출 내부": "./assets/bg/escape_room_interior.png",
    "공포방탈출 외부": "./assets/bg/escape_room_exterior.png",
    "(CG) 천장에서 귀신이 떨어지는 걸 보고 놀라는 수진": "./assets/bg/escape_room_jump_scare.png",
    "예쁜 파스타집": "./assets/bg/pasta_restaurant.png",
    "길거리": "./assets/bg/university_street_night.png",
    "(CG) 예쁜 파스타집에 있는 주인공과 수진": "./assets/bg/pasta_restaurant_cg.png",
    "(CG) 파스타집을 나와 걸어가는 주인공과 수진": "./assets/bg/pasta_night_walk_cg.png",
    "야외 교내": "./assets/bg/campus_outdoor.png",
    "동아리 앞": "./assets/bg/club_room_front.png",
    "동아리실 안": "./assets/bg/club_room_inside.png",
    "카톡창 안": "./assets/bg/chat_screen.png",
    "백스테이지": "./assets/bg/backstage.png",
    "밤, 대학가": "./assets/bg/campus_night.png"
  },
  sounds: {
    bgm: {
      // exampleBgm: "./assets/sound/bgm/example.mp3"
    },
    effects: {
      // doorOpen: "./assets/sound/effects/door-open.mp3"
    }
  },
  characters: {
    수진: {
      default: "./assets/char/수진_Normal.png",
      일반: "./assets/char/수진_Normal.png",
      Normal: "./assets/char/수진_Normal.png",
      Happy: "./assets/char/수진_Happy.png",
      Surprised: "./assets/char/수진_Surprised.png",
      Flustered: "./assets/char/수진_Flustered.png",
      Frightened: "./assets/char/수진_Frightened.png",
      Focused: "./assets/char/수진_Focused.png",
      hopeful: "./assets/char/수진_hopeful.png",
      Sad: "./assets/char/수진_Sad.png"
    },
    혜지: {
      default: "./assets/char/혜지_Normal.png",
      일반: "./assets/char/혜지_Normal.png",
      Normal: "./assets/char/혜지_Normal.png",
      Happy: "./assets/char/혜지_Happy.png",
      Surprised: "./assets/char/혜지_Surprised.png",
      Frightened: "./assets/char/혜지_Frightened.png",
      Flustered: "./assets/char/혜지_Flustered.png"
    },
    건호: {
      default: "./assets/char/건호_Normal.png",
      일반: "./assets/char/건호_Normal.png",
      Normal: "./assets/char/건호_Normal.png",
      Happy: "./assets/char/건호_Happy.png",
      Focused: "./assets/char/건호_Focused.png",
      Surprised: "./assets/char/건호_Surprised.png",
      Flustered: "./assets/char/건호_Flustered.png"
    }
  }
};
