const EPISODES = {
  EP1: [
    {
      type: "dialogue",
      speaker: "주인공",
      text: "하... 내일까지 제출인데. 몬스터라도 마셔야겠다."
    },
    {
      type: "dialogue",
      speaker: "수진",
      text: "아, 네! 죄송합니다... 1500원입니다."
    },
    {
      type: "choice",
      prompt: "수진을 다시 본다면 어떻게 행동할까?",
      choices: [
        {
          text: "침착하게 인사한다",
          effects: { affection: 10, dopamine: -5 },
          next: "EP2"
        },
        {
          text: "운명이라고 확신한다",
          effects: { affection: 15, dopamine: 12 },
          next: "EP2"
        }
      ]
    }
  ],

  EP2: [
    {
      type: "dialogue",
      speaker: "주인공",
      text: "연극동아리 OT. 그런데 편의점에서 봤던 그 사람이 있다."
    },
    {
      type: "choice",
      prompt: "옆자리에 앉은 수진에게 말을 건다.",
      choices: [
        {
          text: "여기 앉아도 될까요?",
          effects: { affection: 15 },
          next: "MINIGAME"
        },
        {
          text: "그때 편의점... 기억하세요?",
          condition: { dopamineMin: 51 },
          effects: { affection: 20, dopamine: 8 },
          next: "MINIGAME"
        }
      ]
    }
  ],

  EP_AFTER_MINIGAME: [
    {
      type: "dialogue",
      speaker: "도파민",
      text: "오늘의 감정 농도가 정해졌다. 이제 고백의 순간으로 간다."
    },
    {
      type: "endingCheck"
    }
  ]
};
