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
    className: "BrickBreakerGame",
    bgm: "game1"
  },
  [SUB_GAMES.SIDE_SHOOTER]: {
    title: "뉴럴 사이드 슈터",
    className: "SideShooterGame",
    bgm: "game2"
  }
};

const ASSET_MANIFEST = {
  fonts: {
    ui: "./assets/font/나눔스퀘어 라운드 (부드러운 고딕체) - 설명,안내/NanumSquareRoundR.ttf",
    uiBold: "./assets/font/나눔스퀘어 라운드 (부드러운 고딕체) - 설명,안내/NanumSquareRoundB.ttf",
    dialogue: "./assets/font/IM 혜민체 - 대사/IM_Hyemin-Regular.ttf",
    dialogueBold: "./assets/font/IM 혜민체 - 대사/IM_Hyemin-Bold.ttf",
    title: "./assets/font/시원한 설레임체 - 굵은글씨/SEOLEIMcool.ttf"
  },
  backgrounds: {
    dummy: "./assets/bg/convenience_store_night.png",
    convenienceStore: "./assets/bg/convenience_store_night.png",
    bedroomNight: "./assets/bg/bedroom_night.png",
    "도서관 열람실": "./assets/bg/library_reading_room.png",
    "편의점": "./assets/bg/convenience_store_night.png",
    "(CG) 수진이 편의점 계산대에서 졸고 있음": "./assets/bg/convenience_sujin_sleepy_cg_v2.png",
    "(CG) 수진이 편의점 계산대에서 화들짝 깨어남": "./assets/bg/convenience_sujin_startled_cg_v3.png",
    "(CG) 졸고 있는 수진": "./assets/bg/convenience_sujin_sleepy_cg_v2.png",
    "(CG) 화들짝 깨는 수진": "./assets/bg/convenience_sujin_startled_cg_v3.png",
    "(CG) 침실 앞 책상에서 과제를 하는 주인공": "./assets/bg/protagonist_desk_assignment_cg.png",
    "집 안 침실": "./assets/bg/protagonist_bedroom_night.png",
    "강의실 혹은 동아리방": "./assets/bg/club_classroom.png",
    "동아리방": "./assets/bg/club_room_inside.png",
    "MT 장소": "./assets/bg/mt_room.png",
    "(CG) MT 장소에 둘러앉은 주인공, 수진, 건호, 혜지": "./assets/bg/mt_group_cg.png",
    "(CG) 동아리방에 둘러앉은 넷": "./assets/bg/club_room_group_cg.png",
    "(CG) MT 장소에 둘러앉은 넷": "./assets/bg/mt_group_cg_v2.png",
    "소주병을 향해 뻗는 수진의 손": "./assets/bg/soju_hand.png",
    "소주병을 향해 뻗는 수진의 손을 잡는 건호의 손": "./assets/bg/soju_hand_stopped.png",
    "공포방탈출 입구": "./assets/bg/escape_room_entrance.png",
    "공포방탈출 내부": "./assets/bg/escape_room_interior.png",
    "공포방탈출 외부": "./assets/bg/escape_room_exterior.png",
    "(CG) 천장에서 귀신이 떨어지는 걸 보고 놀라는 수진": "./assets/bg/escape_room_jump_scare.png",
    "예쁜 파스타집": "./assets/bg/pasta_restaurant.png",
    "길거리": "./assets/bg/university_street_night.png",
    "(CG) 예쁜 파스타집에 있는 주인공과 수진": "./assets/bg/pasta_sujin_seated_cg.png",
    "(CG) 예쁜 파스타집에 앉은 수진": "./assets/bg/pasta_sujin_seated_cg.png",
    "(CG) 파스타집을 나와 걸어가는 주인공과 수진": "./assets/bg/pasta_night_walk_cg.png",
    "예쁜 파스타": "./assets/bg/pasta_food_closeup.png",
    "야외 교내": "./assets/bg/campus_outdoor.png",
    "동아리 앞": "./assets/bg/club_room_front.png",
    "동아리실 안": "./assets/bg/club_room_inside.png",
    "카톡창 안": "./assets/bg/chat_screen.png",
    "카톡방 화면": "./assets/bg/kakaotalk_group_chat_screen.png",
    "(CG) 백스테이지에 있는 주인공과 수진": "./assets/bg/backstage_protagonist_sujin_cg.png",
    "백스테이지": "./assets/bg/backstage.png",
    "문 세트": "./assets/bg/stage_door_set.png",
    "수진이 우는 모습": "./assets/bg/sujin_crying_backstage_cg.png",
    "토닥이는 장면": "./assets/bg/comforting_sujin_cg.png",
    "휴지를 건네는 장면": "./assets/bg/tissue_to_sujin_cg.png",
    "(CG) 텅 빈 밤길을 걸어가는 둘": "./assets/bg/night_street_two_walk_cg.png",
    "밤, 대학가": "./assets/bg/campus_night.png",
    "(CG) 서로 바라보는 둘": "./assets/bg/ending_looking_at_each_other_cg.png",
    "(CG) 손을 잡는 둘": "./assets/bg/ending_holding_hands_cg.png",
    "(CG) 혼자 남은 주인공)": "./assets/bg/bad_ending_alone_protagonist_cg.png"
  },
  sounds: {
    bgm: {
      ep14: {
        path: "./assets/sound/bgm/EP1,4.mp3",
        loopStart: 2.108,
        loopEnd: 232.5
      },
      ep25: {
        path: "./assets/sound/bgm/EP2,5.mp3",
        loopStart: 9.188,
        loopEnd: 166.125
      },
      ep36: {
        path: "./assets/sound/bgm/EP3,6.mp3",
        loopStart: 8.832,
        loopEnd: 207.281
      },
      escapeRoom: {
        path: "./assets/sound/bgm/Escape Room.mp3",
        loopStart: 22.167,
        loopEnd: 100.754
      },
      game1: {
        path: "./assets/sound/bgm/Game1.mp3",
        loopStart: 10.204,
        loopEnd: 173.457
      },
      game2: {
        path: "./assets/sound/bgm/Game2.mp3",
        loopStart: 16.854,
        loopEnd: 202.125
      }
    },
    effects: {
      ep1Ding: "./assets/sound/effects/EP1 띠링.mp3",
      ep1Barcode: "./assets/sound/effects/EP1 바코드.mp3",
      chair: "./assets/sound/effects/EP2 의자.mp3",
      crowd: "./assets/sound/effects/EP2, 3 왁자지껄.mp3",
      horror: "./assets/sound/effects/EP4 공포.mp3",
      door: "./assets/sound/effects/EP5 문.mp3",
      running: "./assets/sound/effects/EP6 달리기.mp3",
      screwdriver: "./assets/sound/effects/EP6 드라이버.mp3",
      episodeTransition: "./assets/sound/effects/에피소드 전환.mp3",
      click: "./assets/sound/effects/클릭.mp3"
    }
  },
  characters: {
    수진: {
      default: "./assets/char_new/sujin_normal.png",
      일반: "./assets/char_new/sujin_normal.png",
      Normal: "./assets/char_new/sujin_normal.png",
      Happy: "./assets/char_new/sujin_happy.png",
      Surprised: "./assets/char_new/sujin_surprised.png",
      Flustered: "./assets/char_new/sujin_flustered.png",
      Frightened: "./assets/char_new/sujin_startled.png",
      Focused: "./assets/char_new/sujin_focused.png",
      Excited: "./assets/char_new/sujin_happy.png",
      Hopeful: "./assets/char_new/sujin_expectant.png",
      hopeful: "./assets/char_new/sujin_expectant.png",
      Sad: "./assets/char_new/sujin_sad.png"
    },
    혜지: {
      default: "./assets/char_new/Hyeji_normal.png",
      일반: "./assets/char_new/Hyeji_normal.png",
      Normal: "./assets/char_new/Hyeji_normal.png",
      Happy: "./assets/char_new/Hyeji_happy.png",
      Surprised: "./assets/char_new/Hyeji_surprised.png",
      Frightened: "./assets/char_new/Hyeji_startled.png",
      Flustered: "./assets/char_new/Hyeji_flustered.png",
      Focused: "./assets/char_new/Hyeji_focused.png",
      Excited: "./assets/char_new/Hyeji_happy.png",
      Hopeful: "./assets/char_new/Hyeji_expectant.png",
      hopeful: "./assets/char_new/Hyeji_expectant.png",
      Sad: "./assets/char_new/Hyeji_sad.png"
    },
    건호: {
      default: "./assets/char_new/Geonho_normal.png",
      일반: "./assets/char_new/Geonho_normal.png",
      Normal: "./assets/char_new/Geonho_normal.png",
      Happy: "./assets/char_new/Geonho_happy.png",
      Focused: "./assets/char_new/Geonho_focused.png",
      Surprised: "./assets/char_new/Geonho_surprised.png",
      Flustered: "./assets/char_new/Geonho_flustered.png",
      Frightened: "./assets/char_new/Geonho_startled.png",
      Excited: "./assets/char_new/Geonho_happy.png",
      Hopeful: "./assets/char_new/Geonho_expectant.png",
      hopeful: "./assets/char_new/Geonho_expectant.png",
      Sad: "./assets/char_new/Geonho_sad.png"
    },
    파미니: {
      default: "./assets/mascot/dopamine_mascot_concept_v1.png",
      일반: "./assets/mascot/dopamine_mascot_concept_v1.png",
      Normal: "./assets/mascot/dopamine_mascot_concept_v1.png"
    }
  }
};
