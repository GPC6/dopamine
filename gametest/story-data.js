const EPISODES = {
  "EP1": [
    {
      "id": 1,
      "type": "background",
      "name": "dummy"
    },
    {
      "id": 2,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "나는 주인공이야"
    },
    {
      "id": 3,
      "type": "character in",
      "name": "수진",
      "emotion": "일반"
    },
    {
      "id": 4,
      "type": "dialogue",
      "speaker": "수진",
      "text": "나는 수진이야. 이 게임의 여주인공이야."
    },
    {
      "id": 5,
      "type": "character in",
      "name": "혜지",
      "emotion": "일반"
    },
    {
      "id": 6,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "안녕 나는 혜지야"
    },
    {
      "id": 7,
      "type": "character in",
      "name": "건호",
      "emotion": "일반"
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "건호",
      "text": "나는 건호야"
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "수진",
      "text": "야 너희들 뭐야!"
    },
    {
      "id": 10,
      "type": "character out",
      "name": "혜지"
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "쳇"
    },
    {
      "id": 12,
      "type": "character out",
      "name": "건호"
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "건호",
      "text": "도망가자!"
    },
    {
      "id": 14,
      "type": "dialogue",
      "speaker": "수진",
      "text": "이상한 놈들이었어..."
    },
    {
      "id": 15,
      "type": "choice",
      "prompt": "쟤들은 누굴까?",
      "choices": [
        {
          "text": "이상한 놈들이다",
          "effects": {
            "affection": 10,
            "dopamine": -5
          },
          "nextNode": 16
        },
        {
          "text": "웃긴 놈들이다",
          "effects": {
            "affection": 15,
            "dopamine": 12
          },
          "nextNode": 16
        }
      ]
    },
    {
      "id": 16,
      "type": "move",
      "next": "EP2"
    }
  ],
  "EP2": [
    {
      "id": 1,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "연극동아리 OT. 그런데 편의점에서 봤던 그 사람이 있다."
    },
    {
      "id": 2,
      "type": "choice",
      "prompt": "옆자리에 앉은 수진에게 말을 건다.",
      "choices": [
        {
          "text": "여기 앉아도 될까요?",
          "effects": {
            "affection": 15
          },
          "nextNode": 3
        },
        {
          "text": "그때 편의점... 기억하세요?",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 20,
            "dopamine": 8
          },
          "nextNode": 4
        }
      ]
    },
    {
      "id": 3,
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker"
    },
    {
      "id": 4,
      "type": "move",
      "next": "MINIGAME",
      "minigame": "sideShooter"
    }
  ],
  "EP_AFTER_MINIGAME": [
    {
      "id": 1,
      "type": "dialogue",
      "speaker": "도파민",
      "text": "오늘의 감정 농도가 정해졌다. 이제 고백의 순간으로 간다."
    },
    {
      "id": 2,
      "type": "endingCheck"
    }
  ]
};
