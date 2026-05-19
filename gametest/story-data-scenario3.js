const EPISODES = {
  "EP1": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "dummy"
    },
    {
      "id": 3,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "늦은 밤, 학교 도서관 열람실. 건축학과 1학년인 주인공은 노트북을 바라보며 머리를 감싸쥐고 있다."
    },
    {
      "id": 4,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "...하, 내일까지 제출인데."
    },
    {
      "id": 5,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "몬스터라도 마셔야겠다."
    },
    {
      "id": 6,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "주인공은 가방에서 지갑을 꺼내 학교 앞 편의점으로 향한다."
    },
    {
      "id": 7,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "새벽 2시. 자동문이 열리며 띠링 소리가 난다."
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "주인공은 망고맛 에너지 드링크를 집어들고 계산대로 간다."
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "저기, 계산..."
    },
    {
      "id": 10,
      "type": "character in",
      "name": "수진",
      "emotion": "일반"
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "알바생이 계산대 뒤에서 고개를 꾸벅꾸벅 떨구고 있다."
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(...예쁘다.)"
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "저기요..."
    },
    {
      "id": 14,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "그녀가 화들짝 놀라며 깬다."
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아, 네! 죄송합니다...!"
    },
    {
      "id": 16,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "수진은 허둥지둥 바코드를 찍는다. 삑. 삑."
    },
    {
      "id": 17,
      "type": "dialogue",
      "speaker": "수진",
      "text": "1500원입니다...!"
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "...아. 감사합니다."
    },
    {
      "id": 19,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "주인공은 편의점을 나간다."
    },
    {
      "id": 20,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(...잠 덜 깬 얼굴인데도 엄청 예쁘네.)"
    },
    {
      "id": 21,
      "type": "character out",
      "name": "수진"
    },
    {
      "id": 22,
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP2"
    }
  ],
  "EP2": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "dummy"
    },
    {
      "id": 3,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "연극동아리 OT 당일. 시끌벅적한 강의실에 사람들이 삼삼오오 모여 있다."
    },
    {
      "id": 4,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(동아리는 처음이라 긴장되네... 어디 앉지?)"
    },
    {
      "id": 5,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "그때, 딱 끝자리에 앉아있는 수진을 본다."
    },
    {
      "id": 6,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "...어? 설마..."
    },
    {
      "id": 7,
      "type": "character in",
      "name": "수진",
      "emotion": "일반"
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "그녀가 고개를 돌리고 눈이 마주친다."
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(운명인가?)"
    },
    {
      "id": 10,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "주인공은 그녀 옆자리로 간다. 수진이 먼저 웃으며 말한다."
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "수진",
      "text": "안녕하세요."
    },
    {
      "id": 12,
      "type": "choice",
      "prompt": "수진에게 어떻게 인사할까?",
      "choices": [
        {
          "text": "(당연히 기억 못하겠지...) 안녕하세요. 건축학과 000입니다.",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 10
          },
          "nextNode": 13
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
          "nextNode": 13
        },
        {
          "text": "여기 앉아도 될까요?",
          "condition": {
            "dopamineMin": 51
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
          "nextNode": 13
        },
        {
          "text": "그때 혹시 편의점... 기억하세요?",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "앗... 저희가 뵌 적이 있을까요?"
            },
            {
              "speaker": "주인공",
              "text": "아하... 하긴 손님이 많으니... 하하. 저는 건축학과 000입니다."
            },
            {
              "speaker": "수진",
              "text": "이제 기억할게요!"
            }
          ],
          "nextNode": 13
        }
      ]
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "수진",
      "text": "저는 피아노과 윤수진이에요. 무대제작부로 지원했어요!"
    },
    {
      "id": 14,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(헉, 나도 무대제작부인데... 이런 우연이!!)"
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "오, 저도 무대제작부예요!"
    },
    {
      "id": 16,
      "type": "dialogue",
      "speaker": "수진",
      "text": "건축학과시면, 무대 제작 잘하시겠다!"
    },
    {
      "id": 17,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "...아니에요. 저 해본 적은 없어요ㅎㅎ"
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "수진",
      "text": "그래도 든든하다. 앞으로 잘 해봐요~"
    },
    {
      "id": 19,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(내 첫사랑... 시작되는 건가?)"
    },
    {
      "id": 20,
      "type": "move",
      "next": "MINIGAME",
      "minigame": "sideShooter",
      "after": "EP3"
    }
  ],
  "EP3": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "dummy"
    },
    {
      "id": 3,
      "type": "character in",
      "name": "수진",
      "emotion": "일반"
    },
    {
      "id": 4,
      "type": "character in",
      "name": "건호",
      "emotion": "일반"
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
      "speaker": "나레이션",
      "text": "새벽 1시, 동아리 MT. 주인공, 수진, 건호, 혜지가 모여 랜덤 게임을 하며 놀고 있다."
    },
    {
      "id": 7,
      "type": "dialogue",
      "speaker": "모두",
      "text": "건호가 좋아하는 랜덤 게임! 랜덤 게임! 게임 스타트!"
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "건호",
      "text": "아이엠그라운드 지금부터 시작! 수진 넷!"
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "수진",
      "text": "?! 아악, 집중 안 하고 있었어!"
    },
    {
      "id": 10,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와, 수진이 걸렸다!"
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아씨, 또 걸렸네ㅜ"
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "건호",
      "text": "야야, 오늘 수진이 많이 마셨다. 좀 쉬어."
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "건호가 멋있게 잔을 낚아채 대신 마신다."
    },
    {
      "id": 14,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "오오, 황건호 흑기사 뭐야?"
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아, 뭘 그렇게까지ㅎ 고마워!"
    },
    {
      "id": 16,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(수진이는 건호가 많이 편해보인다. 건호도 수진이를 잘 챙겨준다...)"
    },
    {
      "id": 17,
      "type": "dialogue",
      "speaker": "건호",
      "text": "술 더 가져올게. 소주? 맥주?"
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "맥주! 야, 그럼 나도 잠깐 화장실."
    },
    {
      "id": 19,
      "type": "character out",
      "name": "건호"
    },
    {
      "id": 20,
      "type": "character out",
      "name": "혜지"
    },
    {
      "id": 21,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아, MT 재밌다! 건호랑 혜지 진짜 재밌다, 그치 OO아?"
    },
    {
      "id": 22,
      "type": "choice",
      "prompt": "수진의 말에 어떻게 답할까?",
      "choices": [
        {
          "text": "응...ㅎ 좋네.",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 5
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "ㅋㅋㅋ OO아 힘들어? 왜 이렇게 피곤해 보여ㅜ"
            },
            {
              "speaker": "주인공",
              "text": "아, 아니야ㅎ"
            },
            {
              "speaker": "수진",
              "text": "오늘 하루 종일 사람 많은 데 있어서 기빨렸을 수도 있겠다ㅎ 우리 나중에 넷이서 약속 한 번 잡아서 놀자. 어때?"
            },
            {
              "speaker": "주인공",
              "text": "오, 좋은 것 같아!"
            }
          ],
          "nextNode": 23
        },
        {
          "text": "응, 그니까 넷이 노니까 재밌다ㅎㅎ MT 끝나고 넷이 한번 모여서 놀까?",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 15
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "오, 완전 좋다! 건호랑 혜지 들어오면 얘기해보자."
            }
          ],
          "nextNode": 23
        },
        {
          "text": "응, 그니까 넷이 노니까 재밌다ㅎㅎ MT 끝나고 넷이 한번 모여서 놀까?",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 15
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "오, 완전 좋다! 건호랑 혜지 들어오면 얘기해보자."
            }
          ],
          "nextNode": 23
        },
        {
          "text": "그러게 재밌다ㅎㅎ 근데 수진아, 나랑 MT 끝나고 한번 만나서 놀지 않을래?",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "우리 넷이?"
            },
            {
              "speaker": "주인공",
              "text": "아니, 그냥 너랑 나랑."
            },
            {
              "speaker": "수진",
              "text": "아하? 그래, 그것도 좋고!"
            }
          ],
          "nextNode": 24
        }
      ]
    },
    {
      "id": 23,
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP4_B"
    },
    {
      "id": 24,
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP4_A"
    }
  ],
  "EP4_A": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "dummy"
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
      "speaker": "나레이션",
      "text": "예쁜 파스타집. 주인공과 수진은 데이트 아닌 데이트를 즐기고 있다."
    },
    {
      "id": 5,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "곧 정기공연인데 기분이 어때?"
    },
    {
      "id": 6,
      "type": "dialogue",
      "speaker": "수진",
      "text": "잘할 수 있을지 모르겠어. 나 사실 무대 무서워하거든."
    },
    {
      "id": 7,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "너 무대 엄청 많이 서봤지 않아? 무슨 일 있어?"
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "수진",
      "text": "피아노는... 한번 틀리면 티가 너무 나잖아. 그래서 무대 올라갈 때 너무 무서워."
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "수진이도 그런 생각 하는구나."
    },
    {
      "id": 10,
      "type": "dialogue",
      "speaker": "수진",
      "text": "응. 그래서 공연 앞두면 예민해져. 주변 사람들한테 괜히 날카롭게 굴 때도 있고..."
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "네가 피아노도, 연극에도 다 진심이라서 그래. 그래서 더 멋있는 것 같아."
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "수진",
      "text": "...그렇게 말해주는 사람 별로 없는데. 고마워."
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 OO아, 나 궁금한 거 있어. 오늘 왜 건호랑 혜지랑 같이 보는 게 아니라 우리 둘이 보자고 한 거야?"
    },
    {
      "id": 14,
      "type": "choice",
      "prompt": "둘이 보자고 한 이유를 어떻게 말할까?",
      "choices": [
        {
          "text": "아... 음, 그냥 뭐 건호랑 혜지는 바쁜 것 같아서...",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 10
          },
          "nextNode": 15
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
              "text": "아 그렇구나! 나도 오늘 이렇게 얘기 많이 해서 좋은 것 같아."
            }
          ],
          "nextNode": 15
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
              "text": "아 그렇구나! 나도 오늘 이렇게 얘기 많이 해서 좋은 것 같아."
            }
          ],
          "nextNode": 15
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
              "text": "아하...! ㅎㅎ 좋아."
            }
          ],
          "nextNode": 15
        }
      ]
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "성공적인 데이트가 마무리된다."
    },
    {
      "id": 16,
      "type": "move",
      "next": "EP5"
    }
  ],
  "EP4_B": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "dummy"
    },
    {
      "id": 3,
      "type": "character in",
      "name": "수진",
      "emotion": "일반"
    },
    {
      "id": 4,
      "type": "character in",
      "name": "건호",
      "emotion": "일반"
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
      "speaker": "나레이션",
      "text": "주말 저녁, 공포 테마 방탈출 카페. 네 사람은 함께 방탈출에 도전한다."
    },
    {
      "id": 7,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와, 여기 분위기 미쳤다."
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(...생각보다 무서운데?)"
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "수진",
      "text": "야, 너무 무서워 보이는데? 내가 다른 테마 가자고 했잖아..."
    },
    {
      "id": 10,
      "type": "dialogue",
      "speaker": "건호",
      "text": "에이~ 방탈출 와서 안 무서우면 재미없지. 걱정 마. 내가 다 풀어줄게."
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "수진",
      "text": "끄악! 야, 내가 그래서 공포방탈출 싫다고 했잖아!"
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "건호",
      "text": "잠깐만 있어봐. 여기 아래 보면 뭐가 있는 것 같단 말야... 찾았다!"
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "무시무시한 무언가가 천장에서 떨어지면서 문이 열린다."
    },
    {
      "id": 14,
      "type": "dialogue",
      "speaker": "수진",
      "text": "으아아악!!"
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "수진이 자연스럽게 주인공의 팔을 붙잡는다."
    },
    {
      "id": 16,
      "type": "choice",
      "prompt": "놀란 수진에게 어떻게 반응할까?",
      "choices": [
        {
          "text": "(당황해 거리를 두며) 아이구 깜짝아. 너무 무섭잖아 여기...",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 10
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "아 그러니까ㅜㅜ 빨리 탈출하자."
            }
          ],
          "nextNode": 17
        },
        {
          "text": "(붙잡아주며) 오, 괜찮아? 혹시 힘들면 얘기해 수진아.",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "아냐, 그래도 끝까지 해보긴 해야지. 빨리 풀어서 탈출하자."
            }
          ],
          "nextNode": 17
        },
        {
          "text": "(붙잡아주며) 오, 괜찮아? 혹시 힘들면 얘기해 수진아.",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "아냐, 그래도 끝까지 해보긴 해야지. 빨리 풀어서 탈출하자."
            }
          ],
          "nextNode": 17
        },
        {
          "text": "(어깨를 감싸며) 오, 괜찮아? 아니, 건호가 너무 무서운 데를 찾아왔는데?",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 10
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "그니까ㅜㅜ 내가 다른 테마 가자고 했잖아, 건호야."
            },
            {
              "speaker": "건호",
              "text": "아 미안. 나도 이 정도일 줄은 몰랐지... 혹시 너무 힘들면 얘기해 수진아."
            },
            {
              "speaker": "수진",
              "text": "아냐. 그래도 끝까지 해보긴 해야지. 빨리 풀어서 탈출하자."
            }
          ],
          "nextNode": 17
        }
      ]
    },
    {
      "id": 17,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "어찌저찌 방탈출을 마친 네 사람."
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와, 진짜 죽는 줄 알았네."
    },
    {
      "id": 19,
      "type": "dialogue",
      "speaker": "건호",
      "text": "근데 재밌었지 않냐?"
    },
    {
      "id": 20,
      "type": "dialogue",
      "speaker": "수진",
      "text": "너 때문에 수명 줄었어 진짜..."
    },
    {
      "id": 21,
      "type": "dialogue",
      "speaker": "건호",
      "text": "에이, 근데 마지막 문제 네가 풀었잖아. 수진이 은근 잘해."
    },
    {
      "id": 22,
      "type": "dialogue",
      "speaker": "수진",
      "text": "...그건 좀 뿌듯하긴 했어."
    },
    {
      "id": 23,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "건호가 수진의 머리를 쓰다듬는다."
    },
    {
      "id": 24,
      "type": "dialogue",
      "speaker": "건호",
      "text": "다음에도 또 만나서 놀자, 얘들아."
    },
    {
      "id": 25,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "좋아. (근데 왜 조금 신경 쓰이지.)"
    },
    {
      "id": 26,
      "type": "move",
      "next": "MINIGAME",
      "minigame": "sideShooter",
      "after": "EP5"
    }
  ],
  "EP5": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "dummy"
    },
    {
      "id": 3,
      "type": "character in",
      "name": "수진",
      "emotion": "일반"
    },
    {
      "id": 4,
      "type": "character in",
      "name": "혜지",
      "emotion": "일반"
    },
    {
      "id": 5,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(공강인데 동아리방 가볼까? 수진이 있으려나?)"
    },
    {
      "id": 6,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "근데 수진아, 진짜 나가는 거야?"
    },
    {
      "id": 7,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아 몰라... 아직 고민 중이라니까."
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "야, 대학 와서 미팅 한 번쯤은 해봐야지~"
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(...미팅?)"
    },
    {
      "id": 10,
      "type": "dialogue",
      "speaker": "수진",
      "text": "어? OO 왔네."
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "어... 안녕."
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "야 OO아, 수진 이번 주에 미팅 나간대."
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "...진짜?"
    },
    {
      "id": 14,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아니, 그냥 친구가 대타 필요하다고 계속 부탁해서... 거의 반강제로 끌려가는 분위기야."
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "혜지",
      "text": "근데 은근 이런 데서 잘 된다니까? 아, 곧 수업 시작이다. 나 갈게! 잘해봐~"
    },
    {
      "id": 16,
      "type": "character out",
      "name": "혜지"
    },
    {
      "id": 17,
      "type": "dialogue",
      "speaker": "수진",
      "text": "에이, 무슨 소리야ㅠ 나 진짜 별 마음 없어."
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "주인공은 애써 웃지만 표정이 조금 굳는다."
    },
    {
      "id": 19,
      "type": "dialogue",
      "speaker": "수진",
      "text": "...왜?"
    },
    {
      "id": 20,
      "type": "choice",
      "prompt": "수진의 미팅 이야기에 어떻게 반응할까?",
      "choices": [
        {
          "text": "에이, 미팅 그냥 재미로 나가는 거지.",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 5
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "그렇지, 진짜 어쩔 수 없이 나가는 거라."
            },
            {
              "speaker": "주인공",
              "text": "미팅 한 번쯤 대학 온 김에 나가볼 수 있지."
            },
            {
              "speaker": "수진",
              "text": "미팅에서 진짜 절대 잘될 일 없어ㅠ"
            },
            {
              "speaker": "주인공",
              "text": "ㅋㅋ그래."
            }
          ],
          "nextNode": 21
        },
        {
          "text": "...꼭 가야 하는 거야?",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "대타 때문에 어쩔 수 없이 나가는 거라ㅠ"
            },
            {
              "speaker": "주인공",
              "text": "아 그래? 혹시나 뭐... 미팅에서 너무 취하면 얘기하고. 위험할 수도 있으니까."
            },
            {
              "speaker": "수진",
              "text": "고마워."
            }
          ],
          "nextNode": 21
        },
        {
          "text": "...꼭 가야 하는 거야?",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "대타 때문에 어쩔 수 없이 나가는 거라ㅠ"
            },
            {
              "speaker": "주인공",
              "text": "아 그래? 혹시나 뭐... 미팅에서 너무 취하면 얘기하고. 위험할 수도 있으니까."
            },
            {
              "speaker": "수진",
              "text": "고마워."
            }
          ],
          "nextNode": 21
        },
        {
          "text": "조금 너무하다. 됐다, 그냥 재밌게 놀다 와.",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 0
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "미팅은 진짜 어쩔 수 없이 나가는 거야."
            },
            {
              "speaker": "주인공",
              "text": "됐다. 그냥 재밌게 놀다 와."
            },
            {
              "speaker": "수진",
              "text": "내가 알아서 할게!"
            }
          ],
          "nextNode": 21
        }
      ]
    },
    {
      "id": 21,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "다음 날 카톡."
    },
    {
      "id": 22,
      "type": "dialogue",
      "speaker": "수진",
      "text": "나 미팅 안 나가기로 했어!"
    },
    {
      "id": 23,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "어? 왜?"
    },
    {
      "id": 24,
      "type": "dialogue",
      "speaker": "수진",
      "text": "생각해보니까 괜히 더 피곤할 것 같아서ㅋㅋ 공연 준비도 해야 하고..."
    },
    {
      "id": 25,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "잘했어. 벌써 공연이 곧이네. 내일 보자."
    },
    {
      "id": 26,
      "type": "dialogue",
      "speaker": "수진",
      "text": "응응."
    },
    {
      "id": 27,
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP6"
    }
  ],
  "EP6": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "dummy"
    },
    {
      "id": 3,
      "type": "character in",
      "name": "수진",
      "emotion": "일반"
    },
    {
      "id": 4,
      "type": "character in",
      "name": "건호",
      "emotion": "일반"
    },
    {
      "id": 5,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "정기공연이 시작되었고, 스탭들은 대기실에서 무대 상황을 보고 있다."
    },
    {
      "id": 6,
      "type": "dialogue",
      "speaker": "건호",
      "text": "큰일났어요. 2막 문 세트 나사 빠졌어요."
    },
    {
      "id": 7,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "...뭐?"
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "선배",
      "text": "그거 누가 만든 거지?"
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "수진",
      "text": "저요..."
    },
    {
      "id": 10,
      "type": "dialogue",
      "speaker": "선배",
      "text": "지금 고칠 수 있겠어?"
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "수진",
      "text": "고칠게요."
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "수진은 바로 공구박스를 들고 백스테이지로 간다. 주인공도 뒤따라간다."
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "수진",
      "text": "드라이버 좀."
    },
    {
      "id": 14,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "여기."
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "선배",
      "text": "1분 뒤 세트 들어간다!"
    },
    {
      "id": 16,
      "type": "dialogue",
      "speaker": "수진",
      "text": "...아, 안 들어가. 왜..."
    },
    {
      "id": 17,
      "type": "choice",
      "prompt": "떨고 있는 수진을 어떻게 도울까?",
      "choices": [
        {
          "text": "좀 더 세게 돌려봐.",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 10
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "어? 어..."
            },
            {
              "speaker": "수진",
              "text": "아, 됐다...!"
            },
            {
              "speaker": "주인공",
              "text": "후..."
            }
          ],
          "nextNode": 18
        },
        {
          "text": "내가 잡고 있을게. 차분하게 해보자.",
          "condition": {
            "dopamineMax": 50
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "제발..."
            },
            {
              "speaker": "수진",
              "text": "아, 됐다...!"
            },
            {
              "speaker": "주인공",
              "text": "다행이다."
            }
          ],
          "nextNode": 18
        },
        {
          "text": "내가 잡고 있을게. 차분하게 해보자.",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 20
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "제발..."
            },
            {
              "speaker": "수진",
              "text": "아, 됐다...!"
            },
            {
              "speaker": "주인공",
              "text": "다행이다."
            }
          ],
          "nextNode": 18
        },
        {
          "text": "아 어떡하지... 망할 것 같은데.",
          "condition": {
            "dopamineMin": 51
          },
          "effects": {
            "affection": 0
          },
          "follow": [
            {
              "speaker": "수진",
              "text": "제발..."
            },
            {
              "speaker": "수진",
              "text": "아, 됐다...!"
            },
            {
              "speaker": "주인공",
              "text": "후..."
            }
          ],
          "nextNode": 18
        }
      ]
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "와, 진짜 심장 떨어지는 줄."
    },
    {
      "id": 19,
      "type": "dialogue",
      "speaker": "수진",
      "text": "그러니까..."
    },
    {
      "id": 20,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "수진아, 공연 끝나고 잠깐 나랑 이야기할래?"
    },
    {
      "id": 21,
      "type": "move",
      "next": "TRUE_ENDING",
      "condition": {
        "affectionMin": 100,
        "dopamineMin": 35,
        "dopamineMax": 80
      }
    },
    {
      "id": 22,
      "type": "move",
      "next": "BAD_ENDING"
    }
  ],
  "TRUE_ENDING": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "dummy"
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
      "speaker": "나레이션",
      "text": "텅 빈 밤길. 둘은 천천히 걸어간다."
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
      "speaker": "수진",
      "text": "아깐 너무 무서웠어. 내가 실수해서 공연 망가질까봐."
    },
    {
      "id": 7,
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 그때 네가 옆에 있어서 좀 안심됐어."
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "다행이다. ...이제 공연 끝이면 못 보는 건가?"
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "수진",
      "text": "왜? 계속 보면 되잖아."
    },
    {
      "id": 10,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그럼... 우리 동아리 없어도 계속 볼래?"
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "수진",
      "text": "좋아ㅎㅎ"
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "가로등 불빛 아래. 주인공이 조심스럽게 입을 연다."
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "...나 사실 너 좋아해. 너는 나 어때?"
    },
    {
      "id": 14,
      "type": "dialogue",
      "speaker": "수진",
      "text": "나도 너 좋아해."
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "수진",
      "text": "왜 그렇게 놀라ㅋㅋ"
    },
    {
      "id": 16,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아니... 진짜 다행이라서."
    },
    {
      "id": 17,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "주인공은 조심스럽게 수진의 손을 잡는다."
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "END",
      "text": "TRUE END"
    }
  ],
  "BAD_ENDING": [
    {
      "id": 1,
      "type": "scene reset"
    },
    {
      "id": 2,
      "type": "background",
      "name": "dummy"
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
      "speaker": "나레이션",
      "text": "텅 빈 밤길. 둘은 천천히 걸어간다."
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
      "text": "그게... 나 너 좋아해."
    },
    {
      "id": 7,
      "type": "dialogue",
      "speaker": "수진",
      "text": "...아."
    },
    {
      "id": 8,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "너무 갑작스러웠지... 근데 공연 끝나면 더 말 못할 것 같아서."
    },
    {
      "id": 9,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "조금 생각할 시간을 줄까?"
    },
    {
      "id": 10,
      "type": "dialogue",
      "speaker": "수진",
      "text": "아니야, 음... 그게 나는... 미안해."
    },
    {
      "id": 11,
      "type": "dialogue",
      "speaker": "수진",
      "text": "OO아, 너 진짜 좋은 사람이야. 같이 공연 준비하면서 엄청 의지됐고."
    },
    {
      "id": 12,
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 나는... 그냥 동아리 사람으로 생각했던 것 같아."
    },
    {
      "id": 13,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "...그렇구나."
    },
    {
      "id": 14,
      "type": "dialogue",
      "speaker": "수진",
      "text": "우리 동아리에서 어색해지진 말자."
    },
    {
      "id": 15,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "응."
    },
    {
      "id": 16,
      "type": "dialogue",
      "speaker": "수진",
      "text": "먼저 갈게..."
    },
    {
      "id": 17,
      "type": "dialogue",
      "speaker": "나레이션",
      "text": "주인공은 혼자 복도에 남는다."
    },
    {
      "id": 18,
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(...어디서부터 잘못된 걸까. 분명 처음엔 좋았는데.)"
    },
    {
      "id": 19,
      "type": "dialogue",
      "speaker": "END",
      "text": "BAD END"
    }
  ]
};
