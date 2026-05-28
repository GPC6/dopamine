// Generated from ../??????_????_follow.xlsx.
const STORY_START_EPISODE = "EP1 첫만남";
const EPISODES = {
  "EP1 첫만남": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "도서관 열람실",
      "transition": "fadeBlack"
    },
    {
      "id": 3,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "…하 내일까지 제출인데."
    },
    {
      "id": 4,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "몬스터라도 마셔야겠다."
    },
    {
      "id": 5,
      "type": "choice",
      "prompt": "몬스터라도 마셔야겠다.",
      "choices": [
        {
          "text": "(망고맛 에너지 드링크를 고른다)",
          "nextNode": 6,
          "follow": []
        },
        {
          "text": "(스누피 커피맛을 고른다)",
          "nextNode": 6,
          "follow": []
        }
      ]
    },
    {
      "id": 6,
      "type": "background",
      "name": "편의점",
      "transition": "fadeBlack"
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "저기 계산...",
      "id": 7
    },
    {
      "id": 8,
      "type": "clear characters"
    },
    {
      "id": 9,
      "type": "background",
      "name": "(CG) 수진이 편의점 계산대에서 졸고 있음",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      }
    },
    {
      "type": "clear characters",
      "id": 10
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "독백",
      "text": "…예쁘다."
    },
    {
      "id": 12,
      "type": "choice",
      "prompt": "(…예쁘다.)",
      "choices": [
        {
          "text": "저기요…",
          "nextNode": 13,
          "follow": []
        },
        {
          "text": "(그냥 빤히 쳐다본다)",
          "nextNode": 13,
          "follow": []
        }
      ]
    },
    {
      "id": 13,
      "type": "clear characters"
    },
    {
      "id": 14,
      "type": "background",
      "name": "(CG) 수진이 편의점 계산대에서 화들짝 깨어남",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      }
    },
    {
      "type": "clear characters",
      "id": 15
    },
    {
      "id": 16,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아, 네! 죄송합니다…!"
    },
    {
      "id": 17,
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "바코드 찍는 효과음"
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "1500원입니다…!"
    },
    {
      "id": 19,
      "type": "choice",
      "prompt": "1500원입니다…!",
      "choices": [
        {
          "text": "…아. 감사합니다",
          "nextNode": 20,
          "follow": []
        },
        {
          "text": "안녕히계세요~",
          "nextNode": 20,
          "follow": []
        }
      ]
    },
    {
      "id": 20,
      "type": "dialogue",
      "speaker": "독백",
      "text": "...잠 덜 깬 얼굴인데도 엄청 예쁘네."
    },
    {
      "id": 21,
      "type": "dialogue",
      "speaker": "독백",
      "text": "이제 집에 가서 공부하다 자야겠다..."
    },
    {
      "type": "clear background",
      "id": 22
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP2 동아리 OT",
      "id": 23
    }
  ],
  "EP2 동아리 OT": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "강의실 혹은 동아리방",
      "transition": "fadeBlack"
    },
    {
      "id": 3,
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "웅성웅성 효과음"
    },
    {
      "id": 4,
      "type": "dialogue",
      "speaker": "독백",
      "text": "동아리는 처음이라 긴장되네..."
    },
    {
      "id": 5,
      "type": "dialogue",
      "speaker": "독백",
      "text": "어디 앉지?"
    },
    {
      "id": 6,
      "type": "character in",
      "name": "수진",
      "emotion": "Happy"
    },
    {
      "id": 7,
      "type": "dialogue",
      "speaker": "독백",
      "text": "수진이 저 끝에 앉아있다.",
      "effects": {
        "dopamine": 5
      }
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "…어?"
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "설마…"
    },
    {
      "id": 10,
      "type": "character in",
      "name": "수진",
      "emotion": "Surprised"
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "수진",
      "text": "?"
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "독백",
      "text": "운명인가?"
    },
    {
      "id": 13,
      "type": "choice",
      "prompt": "(운명인가?)",
      "choices": [
        {
          "text": "(수진의 옆자리에 앉는다)",
          "nextNode": 14
        },
        {
          "text": "(수진의 뒷자리에 앉는다)",
          "nextNode": 14
        }
      ]
    },
    {
      "id": 14,
      "type": "character in",
      "name": "수진",
      "emotion": "Happy"
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "수진",
      "text": "안녕하세요."
    },
    {
      "id": 16,
      "type": "choice",
      "prompt": "안녕하세요.",
      "choices": [
        {
          "text": "(당연히 기억 못하겠지…) 안녕하세요~ 건축학과 000입니다",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 10
          },
          "nextNode": 17
        },
        {
          "text": "여기 앉아도 될까요?",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 15
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "네~"
            },
            {
              "speaker": "주인공",
              "text": "저는 건축학과 000이라고 합니다."
            }
          ],
          "nextNode": 17
        },
        {
          "text": "여기 앉아도 될까요?",
          "condition": {
            "dopamineMin": 50,
            "dopamineMax": 80
          },
          "effects": {
            "affection": 15
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "네~"
            },
            {
              "speaker": "주인공",
              "text": "저는 건축학과 000이라고 합니다."
            }
          ],
          "nextNode": 17
        },
        {
          "text": "그때 혹시 편의점… 기억하세요?",
          "condition": {
            "dopamineMin": 50,
            "dopamineMax": 80
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "앗…저희가 뵌 적이 있을까요?"
            },
            {
              "speaker": "주인공",
              "text": "아하… 하긴 손님이 많으니…"
            },
            {
              "speaker": "주인공",
              "text": "하하 저는 건축학과 000입니다."
            },
            {
              "speaker": "수진",
              "text": "이제 기억할게요!"
            }
          ],
          "nextNode": 17
        },
        {
          "text": "그때 혹시 편의점… 기억하세요?",
          "condition": {
            "dopamineMin": 80
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "앗…저희가 뵌 적이 있을까요?"
            },
            {
              "speaker": "주인공",
              "text": "아하… 하긴 손님이 많으니…"
            },
            {
              "speaker": "주인공",
              "text": "하하 저는 건축학과 000입니다."
            },
            {
              "speaker": "수진",
              "text": "이제 기억할게요!"
            }
          ],
          "nextNode": 17
        },
        {
          "text": "오 또만났네요!",
          "condition": {
            "dopamineMin": 80
          },
          "effects": {
            "affection": 10
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "누구…?"
            },
            {
              "speaker": "주인공",
              "text": "앗… 민망…"
            },
            {
              "speaker": "주인공",
              "text": "저는 건축학과 000이에요…"
            }
          ],
          "nextNode": 17
        }
      ]
    },
    {
      "id": 17,
      "type": "dialogue",
      "speaker": "수진",
      "text": "저는 피아노과 윤수진이에요. 무대제작부로 지원했어요!"
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "독백",
      "text": "헉 나도 무대제작부인데… 이런 우연이!!"
    },
    {
      "id": 19,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "오 저도 무대제작부에요!"
    },
    {
      "id": 20,
      "type": "character in",
      "name": "수진",
      "emotion": "Happy"
    },
    {
      "id": 21,
      "type": "dialogue",
      "speaker": "수진",
      "text": "건축학과시면, 무대 제작 잘하시겠다!"
    },
    {
      "id": 22,
      "type": "choice",
      "prompt": "건축학과시면, 무대 제작 잘하시겠다!",
      "choices": [
        {
          "text": "…아니에요. 저 해본 적은 없어요ㅎㅎ",
          "nextNode": 23
        },
        {
          "text": "무대 만드는 건 처음이에요…",
          "nextNode": 23
        }
      ]
    },
    {
      "id": 23,
      "type": "dialogue",
      "speaker": "수진",
      "text": "(싱긋 웃으며) 그래도 든든하다."
    },
    {
      "id": 24,
      "type": "dialogue",
      "speaker": "수진",
      "text": "앞으로 잘 해봐요~"
    },
    {
      "id": 25,
      "type": "dialogue",
      "speaker": "독백",
      "text": "내 첫사랑… 시작되는 건가?"
    },
    {
      "type": "clear background",
      "id": 26
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "sideShooter",
      "after": "EP3 동아리 MT",
      "id": 27
    }
  ],
  "EP3 동아리 MT": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "(CG) MT 장소에 둘러앉은 주인공, 수진, 건호, 혜지",
      "transition": "fadeBlack"
    },
    {
      "type": "clear characters",
      "id": 3
    },
    {
      "id": 4,
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "BGM 시작"
    },
    {
      "id": 5,
      "type": "dialogue",
      "speaker": "모두",
      "text": "건호가 좋아하는 랜덤 게임! 랜덤 게임! 게임 스타트!"
    },
    {
      "id": 6,
      "type": "background",
      "name": "MT 장소",
      "transition": "fadeBlack"
    },
    {
      "id": 7,
      "type": "character in",
      "name": "건호",
      "emotion": "Happy"
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "건호",
      "text": "아이엠그라운드 지금부터 시작! 수진 넷!"
    },
    {
      "id": 9,
      "type": "character in",
      "name": "수진",
      "emotion": "Surprised"
    },
    {
      "id": 10,
      "type": "dialogue",
      "speaker": "수진",
      "text": "?! 아악 집중 안 하고 있었어!"
    },
    {
      "id": 11,
      "type": "character in",
      "name": "혜지",
      "emotion": "Happy"
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와 수진이 걸렸다!"
    },
    {
      "id": 13,
      "type": "background",
      "name": "소주병을 향해 뻗는 수진의 손",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      }
    },
    {
      "type": "clear characters",
      "id": 14
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아씨 또 걸렸네ㅜ (잔을 집어든다)"
    },
    {
      "id": 16,
      "type": "choice",
      "prompt": "아씨 또 걸렸네ㅜ (잔을 집어든다)",
      "choices": [
        {
          "text": "ㅋㅋㅋ수진아 오늘 왜 그래!",
          "nextNode": 17,
          "follow": []
        },
        {
          "text": "ㅋㅋㅋ수진아 괜찮겠어?",
          "nextNode": 17,
          "follow": []
        }
      ]
    },
    {
      "id": 17,
      "type": "background",
      "name": "소주병을 향해 뻗는 수진의 손을 잡는 건호의 손",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      }
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "건호",
      "text": "(잔을 낚아채며) 야야 오늘 수진이 많이 마셨다, 좀 쉬어. (대신 마신다)",
      "effects": {
        "dopamine": 3
      }
    },
    {
      "id": 19,
      "type": "background",
      "name": "MT 장소",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      }
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "hopeful",
      "id": 20
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "default",
      "id": 21
    },
    {
      "id": 22,
      "type": "character in",
      "name": "혜지",
      "emotion": "Surprised"
    },
    {
      "id": 23,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "오오 황건호 흑기사 뭐야?"
    },
    {
      "id": 24,
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered"
    },
    {
      "id": 25,
      "type": "dialogue",
      "speaker": "수진",
      "text": "(건호의 어깨를 툭 치며) 아 뭘 그렇게까지ㅎ 고마워!"
    },
    {
      "id": 26,
      "type": "dialogue",
      "speaker": "독백",
      "text": "수진이는 건호가 많이 편해보인다. 건호도 수진이를 잘 챙겨준다..",
      "effects": {
        "dopamine": -5
      }
    },
    {
      "id": 27,
      "type": "character in",
      "name": "건호",
      "emotion": "Normal"
    },
    {
      "id": 28,
      "type": "dialogue",
      "speaker": "건호",
      "text": "술 더 가져올게. 소주?맥주?"
    },
    {
      "id": 29,
      "type": "character in",
      "name": "혜지",
      "emotion": "Normal"
    },
    {
      "id": 30,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "맥주! 야 그럼 나도 잠깐 화장실."
    },
    {
      "id": 31,
      "type": "character in",
      "name": "수진",
      "emotion": "Happy"
    },
    {
      "id": 32,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아 MT 재밌다! 건호랑 혜지 진짜 재밌다, 그지 OO아?"
    },
    {
      "id": 33,
      "type": "choice",
      "prompt": "아 MT 재밌다! 건호랑 혜지 진짜 재밌다, 그지 OO아?",
      "choices": [
        {
          "text": "응..ㅎ 좋네.",
          "condition": {
            "dopamineMax": 50
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "ㅋㅋㅋ OO아 힘들어? 왤케 피곤해보여ㅜ"
            }
          ],
          "nextNode": 34
        },
        {
          "text": "응 그니까 넷이 노니까 재밌다ㅎㅎ \n우리 아예 MT 끝나고 넷이 한번 모여서 놀래? 어때?",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 15
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "오 완전 좋다! 건호랑 혜지 들어오면 얘기해보자."
            }
          ],
          "nextNode": 35
        },
        {
          "text": "응 그니까 넷이 노니까 재밌다ㅎㅎ \n우리 아예 MT 끝나고 넷이 한번 모여서 놀래? 어때?",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 15
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "오 완전 좋다! 건호랑 혜지 들어오면 얘기해보자."
            }
          ],
          "nextNode": 37
        },
        {
          "text": "그러게 재밌다ㅎㅎ 근데 수진아, 우리 MT 끝나고 한번 만나서 놀지 않을래?",
          "condition": {
            "dopamineMin": 51
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "우리 넷이서?"
            },
            {
              "speaker": "주인공",
              "text": "아니 그냥 너랑 나랑.",
              "effects": {
                "affection": 20
              }
            },
            {
              "speaker": "수진",
              "text": "오? 그래 좋아!"
            }
          ],
          "nextNode": 41
        }
      ]
    },
    {
      "id": 34,
      "type": "choice",
      "prompt": "ㅋㅋㅋ OO아 힘들어? 왤케 피곤해보여ㅜ",
      "choices": [
        {
          "text": "아 아니야ㅎ",
          "follow": [
            {
              "speaker": "수진",
              "text": "하긴 오늘 계속 사람 많은 데서 있어서 기빨렸을 수도 있겠다."
            },
            {
              "speaker": "수진",
              "text": "우리 나중에 그럼 넷이서 약속 한 번 잡아서 놀자 어때?"
            },
            {
              "speaker": "주인공",
              "text": "오 좋다!",
              "effects": {
                "affection": 5
              }
            }
          ],
          "nextNode": 39
        },
        {
          "text": "아 그냥 오늘 하루종일 놀아서ㅎ",
          "follow": [
            {
              "speaker": "수진",
              "text": "하긴 오늘 계속 사람 많은 데서 있어서 기빨렸을 수도 있겠다."
            },
            {
              "speaker": "수진",
              "text": "우리 나중에 그럼 넷이서 약속 한 번 잡아서 놀자 어때?"
            },
            {
              "speaker": "주인공",
              "text": "오 좋다!",
              "effects": {
                "affection": 5
              }
            }
          ],
          "nextNode": 39
        }
      ]
    },
    {
      "type": "clear background",
      "id": 35
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP4-A 넷이",
      "id": 36
    },
    {
      "type": "clear background",
      "id": 37
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP4-A 넷이",
      "id": 38
    },
    {
      "type": "clear background",
      "id": 39
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP4-A 넷이",
      "id": 40
    },
    {
      "type": "clear background",
      "id": 41
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP4-B 둘이",
      "id": 42
    }
  ],
  "EP4-A 넷이": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "공포방탈출 입구",
      "transition": "fadeBlack"
    },
    {
      "id": 3,
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "BGM 시작"
    },
    {
      "id": 4,
      "type": "character in",
      "name": "혜지",
      "emotion": "Frightened"
    },
    {
      "id": 5,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와 여기 분위기 미쳤다.."
    },
    {
      "id": 6,
      "type": "dialogue",
      "speaker": "독백",
      "text": "생각보다 무서운데...?"
    },
    {
      "id": 7,
      "type": "character in",
      "name": "수진",
      "emotion": "Frightened"
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "수진",
      "text": "야 벌써부터 무서운데 어떡해... 내가 다른 테마 가자고 했잖아!"
    },
    {
      "id": 9,
      "type": "character in",
      "name": "건호",
      "emotion": "Normal"
    },
    {
      "id": 10,
      "type": "dialogue",
      "speaker": "건호",
      "text": "에이~ 방탈출 와서 안 무서우면 재미없지. 걱정 마. 내가 다 풀어줄게."
    },
    {
      "id": 11,
      "type": "background",
      "name": "공포방탈출 내부",
      "transition": "fadeBlack"
    },
    {
      "id": 12,
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "공포테마 음악 시작"
    },
    {
      "id": 13,
      "type": "character in",
      "name": "수진",
      "emotion": "Frightened"
    },
    {
      "id": 14,
      "type": "dialogue",
      "speaker": "수진",
      "text": "끄악! 건호야 뭐하는 거야!"
    },
    {
      "id": 15,
      "type": "character in",
      "name": "건호",
      "emotion": "Focused"
    },
    {
      "id": 16,
      "type": "dialogue",
      "speaker": "건호",
      "text": "잠깐만 있어봐 여기 아래 보면 뭐가 있는 거 같단 말야… 찾았다!"
    },
    {
      "id": 17,
      "type": "dialogue",
      "speaker": "건호",
      "text": "(발견한 버튼을 누른다)"
    },
    {
      "id": 18,
      "type": "background",
      "name": "(CG) 천장에서 귀신이 떨어지는 걸 보고 놀라는 수진",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      }
    },
    {
      "type": "clear characters",
      "id": 19
    },
    {
      "id": 20,
      "type": "dialogue",
      "speaker": "수진",
      "text": "으아아악!! (OO의 팔을 붙잡는다)"
    },
    {
      "id": 21,
      "type": "choice",
      "prompt": "으아아악!! (OO의 팔을 붙잡는다)",
      "choices": [
        {
          "text": "(당황해 거리를 두며) 아이구 깜짝아 너무 무섭잖아 여기..",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": -5
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "아 그러니까ㅜㅜ 빨리 탈출하자."
            }
          ],
          "nextNode": 22
        },
        {
          "text": "(붙잡아주며) 오 괜찮아? 무서운게 너무 많다 여기.. 혹시 힘들면 얘기해 수진아.",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "아냐 그래도 끝까지 해보긴 해야지.. 빨리 풀어서 탈출하자."
            }
          ],
          "nextNode": 22
        },
        {
          "text": "(붙잡아주며) 오 괜찮아? 무서운게 너무 많다 여기.. 혹시 힘들면 얘기해 수진아.",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "아냐 그래도 끝까지 해보긴 해야지.. 빨리 풀어서 탈출하자."
            }
          ],
          "nextNode": 22
        },
        {
          "text": "(어깨를 감싸며) 오 괜찮아? 아니 건호가 너무 무서운 데를 찾아왔는데?",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 10
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "그니까ㅜㅜ 내가 다른 테마 가자고 했잖아 건호야"
            },
            {
              "speaker": "건호",
              "text": "아 미안 나도 이 정도일 줄은 몰랐지.. 혹시 너무 힘들면 얘기해 수진아"
            },
            {
              "speaker": "수진",
              "text": "아냐 그래도 끝까지 해보긴 해야지.. 빨리 풀어서 탈출하자."
            }
          ],
          "nextNode": 22
        }
      ]
    },
    {
      "id": 22,
      "type": "background",
      "name": "공포방탈출 외부",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right",
        "slideSpeed": 0.7
      }
    },
    {
      "id": 23,
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "BGM 다시 시작"
    },
    {
      "id": 24,
      "type": "character in",
      "name": "혜지",
      "emotion": "Flustered"
    },
    {
      "id": 25,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와 진짜 죽는 줄 알았네."
    },
    {
      "id": 26,
      "type": "character in",
      "name": "건호",
      "emotion": "Happy"
    },
    {
      "id": 27,
      "type": "dialogue",
      "speaker": "건호",
      "text": "그래도 재밌지 않았어?"
    },
    {
      "id": 28,
      "type": "character in",
      "name": "수진",
      "emotion": "Normal"
    },
    {
      "id": 29,
      "type": "dialogue",
      "speaker": "수진",
      "text": "너 때문에 수명 줄었어 진짜."
    },
    {
      "id": 30,
      "type": "character in",
      "name": "건호",
      "emotion": "Happy"
    },
    {
      "id": 31,
      "type": "dialogue",
      "speaker": "건호",
      "text": "에이 그래도 마지막 문제 네가 풀었잖아. 수진이 은근 잘해."
    },
    {
      "id": 32,
      "type": "choice",
      "prompt": "에이 그래도 마지막 문제 네가 풀었잖아. 수진이 은근 잘해.",
      "choices": [
        {
          "text": "맞아 수진이 아니었으면 우리 탈출 못했어.",
          "nextNode": 33
        },
        {
          "text": "맞아 그거 진짜 어려운 문제였는데 대단해!",
          "nextNode": 33
        }
      ]
    },
    {
      "id": 33,
      "type": "character in",
      "name": "수진",
      "emotion": "Happy"
    },
    {
      "id": 34,
      "type": "dialogue",
      "speaker": "수진",
      "text": "ㅎ.. 그건 좀 뿌듯하긴 했어."
    },
    {
      "id": 35,
      "type": "character in",
      "name": "건호",
      "emotion": "Happy"
    },
    {
      "id": 36,
      "type": "dialogue",
      "speaker": "건호",
      "text": "(수진의 어깨를 두드린다) 다음에도 또 만나서 놀자 얘들아."
    },
    {
      "id": 37,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "좋아. (건호가 수진이를 대하는 방식이 조금 신경쓰인다)"
    },
    {
      "type": "clear background",
      "id": 38
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "sideShooter",
      "after": "EP5 미팅사건",
      "id": 39
    }
  ],
  "EP4-B 둘이": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "(CG) 예쁜 파스타집에 있는 주인공과 수진",
      "transition": "fadeBlack"
    },
    {
      "type": "clear characters",
      "id": 3
    },
    {
      "id": 4,
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "BGM 시작"
    },
    {
      "id": 5,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "이제 정기공연 얼마 안 남았는데, 기분이 어때?"
    },
    {
      "id": 6,
      "type": "background",
      "name": "예쁜 파스타집",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      }
    },
    {
      "id": 7,
      "type": "character in",
      "name": "수진",
      "emotion": "Normal"
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "수진",
      "text": "사실 걱정이 좀 많아. 항상 무대가 무서워서..ㅎ"
    },
    {
      "id": 9,
      "type": "choice",
      "prompt": "사실 걱정이 좀 많아. 항상 무대가 무서워서..ㅎ",
      "choices": [
        {
          "text": "왜? 피아노과면 무대 되게 많이 서지 않아?",
          "follow": [
            {
              "speaker": "수진",
              "text": "그래도 익숙해지지가 않더라고.. 특히 피아노는 틀리면 티가 바로 나잖아.",
              "effects": {
                "dopamine": 3
              }
            }
          ],
          "nextNode": 10
        },
        {
          "text": "에이, 너 공연도 엄청 자주 하고 잘 하잖아!",
          "follow": [
            {
              "speaker": "수진",
              "text": "ㅎㅎ고마워. 그래도.. 피아노는 틀리면 바로 티가 나니까 항상 떨리지.",
              "effects": {
                "dopamine": 5
              }
            }
          ],
          "nextNode": 10
        }
      ]
    },
    {
      "id": 10,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "무대 많이 서는 너도 그런 생각 하는구나."
    },
    {
      "id": 11,
      "type": "character in",
      "name": "수진",
      "emotion": "Focused"
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "수진",
      "text": "그래서 항상 공연 앞두면 예민해지고 주변 사람들한테 날카롭게 굴기도 하고.."
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "네가 피아노도, 연극도 다 진심으로 해서 그래. 그니까 더 잘하고 멋있는거지."
    },
    {
      "id": 14,
      "type": "character in",
      "name": "수진",
      "emotion": "Happy"
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "수진",
      "text": "ㅎㅎ 그런 얘기는 처음 들어보는데. 고마워.",
      "effects": {
        "dopamine": 5
      }
    },
    {
      "id": 16,
      "type": "background",
      "name": "(CG) 파스타집을 나와 걸어가는 주인공과 수진",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right",
        "slideSpeed": 0.7
      }
    },
    {
      "type": "clear characters",
      "id": 17
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 OO아, 나 궁금한 거 있어."
    },
    {
      "id": 19,
      "type": "background",
      "name": "길거리",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right",
        "slideSpeed": 0.7
      }
    },
    {
      "id": 20,
      "type": "character in",
      "name": "수진",
      "emotion": "Normal"
    },
    {
      "id": 21,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "음? 뭔데?"
    },
    {
      "id": 22,
      "type": "character in",
      "name": "수진",
      "emotion": "Normal"
    },
    {
      "id": 23,
      "type": "dialogue",
      "speaker": "수진",
      "text": "오늘 만날 때 왜 건호랑 혜지랑 같이 보는게 아니라 우리 둘이 보자고 한거야?",
      "effects": {
        "dopamine": 7
      }
    },
    {
      "id": 24,
      "type": "choice",
      "prompt": "오늘 만날 때 왜 건호랑 혜지랑 같이 보는게 아니라 우리 둘이 보자고 한거야?",
      "choices": [
        {
          "text": "아… 음 그냥 뭐 건호랑 혜지는 바쁜 거 같아서..",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 5
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "아 그렇구나ㅎ 오늘 재밌었어. 공연도 화이팅하자!"
            },
            {
              "speaker": "주인공",
              "text": "그래! 다음에 또 봐!"
            }
          ],
          "nextNode": 25
        },
        {
          "text": "둘이 있으면 좀 더 대화도 길게 할 수 있고 좋잖아.",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 15
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "아 그렇구나! 그러게, 나도 오늘 이렇게 얘기 많이 해서 좋은 거 같아."
            },
            {
              "speaker": "주인공",
              "text": "다음에도 또 보자!"
            },
            {
              "speaker": "수진",
              "text": "좋아! 우리 공연도 화이팅!"
            }
          ],
          "nextNode": 25
        },
        {
          "text": "둘이 있으면 좀 더 대화도 길게 할 수 있고 좋잖아.",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 15
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "아 그렇구나! 그러게, 나도 오늘 이렇게 얘기 많이 해서 좋은 거 같아."
            },
            {
              "speaker": "주인공",
              "text": "다음에도 또 보자!"
            },
            {
              "speaker": "수진",
              "text": "좋아! 우리 공연도 화이팅!"
            }
          ],
          "nextNode": 25
        },
        {
          "text": "너랑 단둘이 있어보고 싶었거든. 우리 맨날 넷이서만 봤잖아.",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "아하...! ㅎㅎ 좋다."
            },
            {
              "speaker": "주인공",
              "text": "재밌었어 오늘, 그지?"
            },
            {
              "speaker": "수진",
              "text": "완전! 다음에 또 보자!"
            }
          ],
          "nextNode": 25
        }
      ]
    },
    {
      "type": "clear background",
      "id": 25
    },
    {
      "type": "move",
      "next": "EP5 미팅사건",
      "id": 26
    }
  ],
  "EP5 미팅사건": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "야외 교내",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right",
        "slideSpeed": 0.7
      }
    },
    {
      "id": 3,
      "type": "dialogue",
      "speaker": "독백",
      "text": "공강인데 동아리방 가볼까? 수진이 있으려나?"
    },
    {
      "id": 4,
      "type": "background",
      "name": "동아리 앞",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right",
        "slideSpeed": 0.7
      }
    },
    {
      "id": 5,
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "걸어가는 효과음"
    },
    {
      "id": 6,
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "문여는 효과음"
    },
    {
      "id": 7,
      "type": "dialogue",
      "speaker": "독백",
      "text": "동아리방으로 향하며 문을 연다"
    },
    {
      "id": 8,
      "type": "background",
      "name": "동아리실 안",
      "transition": "fadeBlack"
    },
    {
      "id": 9,
      "type": "character in",
      "name": "혜지",
      "emotion": "Normal"
    },
    {
      "id": 10,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "근데 수진아, 진짜 나가는 거야?"
    },
    {
      "id": 11,
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered"
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아 몰라.. 아직 고민 중이야"
    },
    {
      "id": 13,
      "type": "character in",
      "name": "혜지",
      "emotion": "Normal"
    },
    {
      "id": 14,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "야, 대학와서 미팅 한 번 쯤은 해봐야지~"
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "독백",
      "text": "잠시만.. 수진이가 미팅 나간다고?"
    },
    {
      "id": 16,
      "type": "character in",
      "name": "수진",
      "emotion": "Surprised"
    },
    {
      "id": 17,
      "type": "dialogue",
      "speaker": "수진",
      "text": "OO이 왔네, 안녕"
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "어.. 안녕"
    },
    {
      "id": 19,
      "type": "character in",
      "name": "혜지",
      "emotion": "Happy"
    },
    {
      "id": 20,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "야 OO아, 수진이 이번 주에 미팅 나간대",
      "effects": {
        "dopamine": 5
      }
    },
    {
      "id": 21,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아.. 진짜?"
    },
    {
      "id": 22,
      "type": "character in",
      "name": "수진",
      "emotion": "Focused"
    },
    {
      "id": 23,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아니, 그냥 친구가 대차 필요하다고 계속 부탁해서.. \n거의 반강제로 끌려가는 분위기야ㅠ"
    },
    {
      "id": 24,
      "type": "character in",
      "name": "혜지",
      "emotion": "Happy"
    },
    {
      "id": 25,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "근데 은근 그런 생각지도 못한 곳에서 잘 된다니까?\n와, 나 곧 수업 시작이다. 갈게, 잘해 봐!!"
    },
    {
      "id": 26,
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered"
    },
    {
      "id": 27,
      "type": "dialogue",
      "speaker": "수진",
      "text": "에이 무슨 소리야ㅠ"
    },
    {
      "id": 28,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "(혜지가 가고 둘만 남는다, 주인공은 표정이 조금 굳는다)"
    },
    {
      "id": 29,
      "type": "choice",
      "prompt": "(혜지가 가고 둘만 남는다, 주인공은 표정이 조금 굳는다)",
      "choices": [
        {
          "text": "(무덤덤하게) 에이, 미팅 그냥 재미로 나가는 거지",
          "effects": {
            "dopamine": 0,
            "affection": 5
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "그렇지, 진짜 어쩔 수 없이 나가는 거라"
            },
            {
              "speaker": "주인공",
              "text": "미팅 한번 쯤 대학 온 김에 나가볼 수 있지"
            },
            {
              "speaker": "수진",
              "text": "미팅에서 진짜 잘될 일 없어ㅠ"
            },
            {
              "speaker": "주인공",
              "text": "ㅋㅋ그래"
            }
          ],
          "nextNode": 30
        },
        {
          "text": "(살짝 삐진 목소리로).. 꼭 가야하는 거야?",
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "대타 때문에 진짜 어쩔 수 없이 나가는 거라ㅠ"
            },
            {
              "speaker": "주인공",
              "text": "아 그래? 혹시나 뭐.. 미팅에서 너무 취하면 얘기하고, 위험할 수도 있으니까"
            },
            {
              "speaker": "수진",
              "text": "어?어.. 고마워"
            }
          ],
          "nextNode": 30
        },
        {
          "text": "(당황하며 빠르게) 조금 너무하다",
          "effects": {
            "affection": -15
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "(당황하며) 미팅은 진짜 어쩔 수 없이 나가는 거야"
            },
            {
              "speaker": "주인공",
              "text": "(까칠하게) 됐다. 그냥 재밌게 놀다 와"
            },
            {
              "speaker": "수진",
              "text": "야, 내가 알아서 할게!",
              "effects": {
                "dopamine": 5
              }
            }
          ],
          "nextNode": 30
        }
      ]
    },
    {
      "id": 30,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "<다음 날 카톡>"
    },
    {
      "id": 31,
      "type": "background",
      "name": "카톡창 안",
      "transition": "fadeBlack"
    },
    {
      "id": 32,
      "type": "character in",
      "name": "수진",
      "emotion": "Happy"
    },
    {
      "id": 33,
      "type": "dialogue",
      "speaker": "수진",
      "text": "나 미팅 안 나가기로 했어!",
      "effects": {
        "dopamine": 3
      }
    },
    {
      "id": 34,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "어? 왜?"
    },
    {
      "id": 35,
      "type": "character in",
      "name": "수진",
      "emotion": "Normal"
    },
    {
      "id": 36,
      "type": "dialogue",
      "speaker": "수진",
      "text": "생각해보니까 괜히 더 피곤할 것 같아서ㅋㅋ\n공연 준비도 해야하고"
    },
    {
      "id": 37,
      "type": "choice",
      "prompt": "나 미팅 안 나가기로 했어!",
      "choices": [
        {
          "text": "그렇구나. 공연날 보자!",
          "effects": {
            "dopamine": 0,
            "affection": 0
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "응응"
            }
          ],
          "nextNode": 38
        },
        {
          "text": "잘됐다..! 다행이야",
          "effects": {
            "dopamine": 0,
            "affection": 10
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "ㅋㅌㅋㅌㅌㅋ너는 왜 다행이야"
            },
            {
              "speaker": "주인공",
              "text": "아 그냥..ㅎㅎ 공연 날 보자!"
            },
            {
              "speaker": "수진",
              "text": "그랭!"
            }
          ],
          "nextNode": 38
        },
        {
          "text": "맞아, 솔직히 공연 다가오는데 미팅 좀 그렇다고 생각했어.",
          "effects": {
            "dopamine": 0,
            "affection": -5
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "아? 어.."
            },
            {
              "speaker": "주인공",
              "text": "그래 공연날 보자~"
            },
            {
              "speaker": "수진",
              "text": "응응"
            }
          ],
          "nextNode": 38
        }
      ]
    },
    {
      "type": "clear background",
      "id": 38
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP6 정기공연",
      "id": 39
    }
  ],
  "EP6 정기공연": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "백스테이지",
      "transition": "fadeBlack"
    },
    {
      "id": 3,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "(공연은 시작되었고, 스탭들은 대기실에서 무대 상황을 지켜보고 있다.)\n(건호가 급하게 뛰어온다.)"
    },
    {
      "id": 4,
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "달려오는 소리"
    },
    {
      "id": 5,
      "type": "character in",
      "name": "건호",
      "emotion": "Surprised"
    },
    {
      "id": 6,
      "type": "dialogue",
      "speaker": "건호",
      "text": "큰일났어요, 2막 문 세트 나사 빠졌어요!"
    },
    {
      "id": 7,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "...뭐?"
    },
    {
      "id": 8,
      "type": "character in",
      "name": "선배1",
      "emotion": "Focused"
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "선배1",
      "text": "그거 누구 담당이지..?"
    },
    {
      "id": 10,
      "type": "character in",
      "name": "수진",
      "emotion": "Focused"
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "수진",
      "text": "저요.."
    },
    {
      "id": 12,
      "type": "character in",
      "name": "선배1",
      "emotion": "Focused"
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "선배1",
      "text": "지금 고쳐야 해"
    },
    {
      "id": 14,
      "type": "character in",
      "name": "수진",
      "emotion": "Focused"
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "수진",
      "text": "넵, 선배 고칠게요"
    },
    {
      "id": 16,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "(수진은 바로 공구박스를 들고 백스테이지로 간다. 주인공도 뒤따라간다\n수진은 손이 떨리지만 참고 나사를 조인다.)"
    },
    {
      "id": 17,
      "type": "dialogue",
      "speaker": "수진",
      "text": "드라이버 좀"
    },
    {
      "id": 18,
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "드라이버 소리"
    },
    {
      "id": 19,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "여기"
    },
    {
      "id": 20,
      "type": "character in",
      "name": "선배1",
      "emotion": "Flustered"
    },
    {
      "id": 21,
      "type": "dialogue",
      "speaker": "선배1",
      "text": "1분 뒤 세트 들어간다!"
    },
    {
      "id": 22,
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered"
    },
    {
      "id": 23,
      "type": "dialogue",
      "speaker": "수진",
      "text": "..아 이게 왜 안들어가지"
    },
    {
      "id": 24,
      "type": "choice",
      "prompt": "..아 이게 왜 안들어가지",
      "choices": [
        {
          "text": "좀 더 세게 돌려봐",
          "effects": {
            "dopamine": 0,
            "affection": 5
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "어, 아 됐다..!"
            },
            {
              "speaker": "주인공",
              "text": "휴..다행이다"
            }
          ],
          "nextNode": 25
        },
        {
          "text": "내가 잡고 있을게, 차분하게 해보자",
          "follow": [
            {
              "speaker": "수진",
              "text": "제발.. 아 됐다! (하이파이브를 하며 마주보고 웃는다)",
              "effects": {
                "dopamine": 10,
                "affection": 20
              }
            },
            {
              "speaker": "주인공",
              "text": "다행이다, 수고했어"
            }
          ],
          "nextNode": 25
        },
        {
          "text": "(불안해하며) 아 어떡하지.. 곧 시작인데",
          "effects": {
            "dopamine": 0,
            "affection": 0
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "제발.. 아 됐다..!"
            },
            {
              "speaker": "주인공",
              "text": "와 다행이다"
            }
          ],
          "nextNode": 25
        }
      ]
    },
    {
      "id": 25,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "와 진짜 심장 떨어지는 줄"
    },
    {
      "id": 26,
      "type": "character in",
      "name": "수진",
      "emotion": "Focused"
    },
    {
      "id": 27,
      "type": "dialogue",
      "speaker": "수진",
      "text": "그러니까.."
    },
    {
      "id": 28,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "수진아. 공연 끝나고 잠깐 나랑 이야기 할래?"
    },
    {
      "id": 29,
      "type": "character in",
      "name": "수진",
      "emotion": "Normal"
    },
    {
      "id": 30,
      "type": "dialogue",
      "speaker": "수진",
      "text": "어? 그래."
    },
    {
      "type": "clear background",
      "id": 31,
      "condition": {
        "affectionMin": 100,
        "dopamineMin": 35,
        "dopamineMax": 80
      }
    },
    {
      "type": "move",
      "next": "해피엔딩",
      "condition": {
        "affectionMin": 100,
        "dopamineMin": 35,
        "dopamineMax": 80
      },
      "id": 32
    },
    {
      "type": "clear background",
      "id": 33
    },
    {
      "type": "move",
      "next": "베드엔딩",
      "id": 34
    }
  ],
  "해피엔딩": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "밤, 대학가",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right",
        "slideSpeed": 0.7
      }
    },
    {
      "id": 3,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "(텅 빈 밤길. 둘은 천천히 걸어간다.)"
    },
    {
      "id": 4,
      "type": "character in",
      "name": "수진",
      "emotion": "Happy"
    },
    {
      "id": 5,
      "type": "dialogue",
      "speaker": "수진",
      "text": "와... 오늘 하루 진짜 길었다."
    },
    {
      "id": 6,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그러게.."
    },
    {
      "id": 7,
      "type": "character in",
      "name": "수진",
      "emotion": "Focused"
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아깐 너무 무서웠어. 내가 실수해서 공연 망가질까봐.\n근데 그때 네가 옆에 있어서 좀 안심됐어"
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "다행이다..\n우리 이제 공연 끝났으니까 못보는 건가?"
    },
    {
      "id": 10,
      "type": "character in",
      "name": "수진",
      "emotion": "Surprised"
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "수진",
      "text": "왜? 계속 보면 되잖아"
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "(주인공은 잠깐 수진을 바라본다)"
    },
    {
      "id": 13,
      "type": "choice",
      "prompt": "(주인공은 잠깐 수진을 바라본다)",
      "choices": [
        {
          "text": "아무래도 동아리 끝나면 볼 일이 많이 없긴 하지",
          "follow": [
            {
              "speaker": "수진",
              "text": "에이 우리는 계속 볼일이 있을거야"
            },
            {
              "speaker": "주인공",
              "text": "정말..?"
            }
          ],
          "nextNode": 14
        },
        {
          "text": "그럼.. 우리 동아리 없어도 계속 볼래?",
          "follow": [
            {
              "speaker": "수진",
              "text": "좋아..ㅎㅎ"
            }
          ],
          "nextNode": 14
        },
        {
          "text": "나는 너 동아리 끝나도 계속 보고싶어",
          "follow": [
            {
              "speaker": "수진",
              "text": "뭐야 부끄럽게..ㅎㅎ"
            }
          ],
          "nextNode": 14
        }
      ]
    },
    {
      "id": 14,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "(잠깐 침묵)"
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "나 사실 너 좋아해.., 너는 나 어때?"
    },
    {
      "id": 16,
      "type": "character in",
      "name": "수진",
      "emotion": "hopeful"
    },
    {
      "id": 17,
      "type": "dialogue",
      "speaker": "수진",
      "text": "(수진이 걸음을 멈춘다..) 나도 너 좋아해"
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "독백",
      "text": "얼어 붙는다"
    },
    {
      "id": 19,
      "type": "character in",
      "name": "수진",
      "emotion": "Happy"
    },
    {
      "id": 20,
      "type": "dialogue",
      "speaker": "수진",
      "text": "왜 그렇게 놀라ㅋㅋ"
    },
    {
      "id": 21,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아니.. 너무 좋아서ㅎㅎ"
    },
    {
      "id": 22,
      "type": "dialogue",
      "speaker": "독백",
      "text": "주인공은 조심스럽게 수진의 손을 잡는다"
    },
    {
      "type": "clear background",
      "id": 23
    },
    {
      "id": 24,
      "type": "dialogue",
      "speaker": "END",
      "text": "해피엔딩"
    }
  ],
  "베드엔딩": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "밤, 대학가",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right",
        "slideSpeed": 0.7
      }
    },
    {
      "id": 3,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "(텅 빈 밤길. 둘은 천천히 걸어간다.)"
    },
    {
      "id": 4,
      "type": "character in",
      "name": "수진",
      "emotion": "Normal"
    },
    {
      "id": 5,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아까 한다는 말이 뭐야?"
    },
    {
      "id": 6,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그게.. 나 너 좋아해."
    },
    {
      "id": 7,
      "type": "character in",
      "name": "수진",
      "emotion": "Surprised"
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "수진",
      "text": "(수진이 어색하게 웃는다) ..아, 아하하 어.."
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "너무 갑작스러웠지.. 근데 공연 끝나면 더 말 못할 것 같아서, \n조금 생각할 시간을 줄까?"
    },
    {
      "id": 10,
      "type": "character in",
      "name": "수진",
      "emotion": "Sad"
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아니야, 음 그게 나는... 미안해"
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "수진",
      "text": "OO아, 너는 정말 좋은 사람이야\n같이 공연 준비하면서 엄청 의지됐고"
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(애써 웃는다) 아.. 어.."
    },
    {
      "id": 14,
      "type": "character in",
      "name": "수진",
      "emotion": "Focused"
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 나는.. 그냥 너를 좋은 동아리 사람으로 생각했던 것 같아"
    },
    {
      "id": 16,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "..그렇구나"
    },
    {
      "id": 17,
      "type": "character in",
      "name": "수진",
      "emotion": "hopeful"
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "수진",
      "text": "우리 동아리에서 어색해지진 말자"
    },
    {
      "id": 19,
      "type": "choice",
      "prompt": "우리 동아리에서 어색해지진 말자",
      "choices": [
        {
          "text": "응..",
          "nextNode": 20
        },
        {
          "text": "그래 그냥 친구로 지내자..!",
          "nextNode": 20
        },
        {
          "text": "음.. 그냥 이제 볼일 없을거야",
          "nextNode": 20
        }
      ]
    },
    {
      "id": 20,
      "type": "character in",
      "name": "수진",
      "emotion": "Normal"
    },
    {
      "id": 21,
      "type": "dialogue",
      "speaker": "수진",
      "text": "먼저 갈게.."
    },
    {
      "id": 22,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "(주인공 혼자 길거리에 남는다)"
    },
    {
      "id": 23,
      "type": "dialogue",
      "speaker": "독백",
      "text": "..어디서부터 잘못된 걸까.., 분명 처음엔 좋았는데.."
    },
    {
      "type": "clear background",
      "id": 24
    },
    {
      "id": 25,
      "type": "dialogue",
      "speaker": "END",
      "text": "베드엔딩"
    }
  ]
};
