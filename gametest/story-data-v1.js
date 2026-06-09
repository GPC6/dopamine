const STORY_START_EPISODE = "EP1 첫만남";
const EPISODES = {
  "EP1 첫만남": [
    {
      "type": "scene reset",
      "id": 1
    },
    {
      "type": "background",
      "name": "도서관 열람실",
      "id": 2
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "ep14",
      "id": 3
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "하 내일까지 제출인데 언제 다 끝내지..",
      "id": 4
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "음료수라도 마셔야겠다.",
      "id": 5
    },
    {
      "type": "background",
      "name": "편의점",
      "transition": {
        "type": "fadeBlack",
        "duration": 1000
      },
      "id": 6
    },
    {
      "type": "choice",
      "prompt": "음료수라도 마셔야겠다.",
      "choices": [
        {
          "text": "(망고맛 에너지 드링크를 고른다)",
          "follow": [],
          "sound": {
            "type": "sound",
            "soundType": "effect",
            "action": "play",
            "name": "ep1Ding"
          },
          "nextNode": 8
        },
        {
          "text": "(스누피 커피맛을 고른다)",
          "follow": [],
          "nextNode": 8
        }
      ],
      "id": 7
    },
    {
      "type": "background",
      "name": "(CG) 졸고 있는 수진",
      "id": 8
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "저기 계산...",
      "id": 9
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(…예쁘다.)",
      "id": 10
    },
    {
      "type": "choice",
      "prompt": "(…예쁘다.)",
      "choices": [
        {
          "text": "저기요…",
          "follow": [],
          "nextNode": 12
        },
        {
          "text": "(그냥 빤히 쳐다본다)",
          "follow": [],
          "nextNode": 12
        }
      ],
      "id": 11
    },
    {
      "type": "background",
      "name": "(CG) 화들짝 깨는 수진",
      "id": 12
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아, 네! 죄송합니다…!",
      "id": 13
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "ep1Barcode",
      "id": 14
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "1500원입니다…!",
      "id": 15
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(몽롱하던 시야가 번쩍 뜨인다.)",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "예쁘다…",
      "id": 17
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "네..?",
      "id": 18
    },
    {
      "type": "choice",
      "prompt": "네..?",
      "choices": [
        {
          "text": "아 아무것도 아니에요. 죄송합니다.",
          "follow": [],
          "nextNode": 20
        },
        {
          "text": "잘못 말했어요!",
          "follow": [],
          "nextNode": 20
        }
      ],
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "ㅎㅎ 네, 그럼 안녕히계세요.",
      "id": 20
    },
    {
      "type": "background",
      "name": "편의점",
      "id": 21
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(...미친 건가… 왜 생각이 입 밖으로 튀어나왔지?)",
      "id": 22
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(밤을 새서 정신이 나갔나...)",
      "id": 23
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(이제 또 만날 일은 없겠지…?)",
      "id": 24
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(완전 내 스타일이었는데 아쉽다.)",
      "id": 25
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(이제 집에 가서 마저 공부해야지...)",
      "id": 26
    },
    {
      "type": "background",
      "name": "(CG) 침실 앞 책상에서 과제를 하는 주인공",
      "transition": {
        "type": "fadeBlack"
      },
      "id": 27
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "후… 드디어 끝냈다. 과제 제출 완료.",
      "id": 28
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "유튜브나 좀 보다 자야겠다~",
      "id": 29
    },
    {
      "type": "background",
      "name": "(CG) 침실 앞 책상에서 과제를 하는 주인공 - 새벽",
      "transition": {
        "type": "fadeBlack",
        "duration": 2000
      },
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "헉… 미친, 쇼츠 좀 봤다고 세 시간이 지났어?!",
      "id": 31
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "지금 아침 6시라고?!",
      "id": 32
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아, 진짜 나 요즘 도파민 중독인가 봐…",
      "id": 33
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아까 마신 카페인 때문에 잠은 안 오고, 가슴은 쓸데없이 뛰네.",
      "id": 34
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "이러다 몇 시간 뒤 동아리 OT 가서 눈도 제대로 못 뜨고 대형 실수하는 거 아니겠지…",
      "id": 35
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "조금이라도 자야겠다...",
      "id": 36
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "(휴대폰을 끄고 눕는다)",
      "id": 37
    },
    {
      "type": "background",
      "name": "파미니 화면",
      "transition": {
        "type": "fadeBlack"
      },
      "id": 38
    },
    {
      "type": "character in",
      "name": "파미니",
      "emotion": "Normal",
      "id": 39
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "위기 상황! 00의 뇌 속은 현재 과도한 밤샘 과제, 카페인 폭탄,",
      "id": 40
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "그리고 3시간 연속 숏폼 시청으로 인해 도파민 체계가 완전히 붕괴되기 직전입니다.",
      "id": 41
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "하필 이 타이밍에 첫사랑을 시작하다니!",
      "id": 42
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "당신은 주인공의 행동과 이성을 제어하는 '도파민’입니다.",
      "id": 43
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "다음 날 있을 첫 동아리 OT에서 주인공이 무기력해지거나",
      "id": 44
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "반대로 과도한 각성 상태로 폭주하지 않도록,",
      "id": 45
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "적절한 도파민 수치(50~80)를 유지하세요!",
      "id": 46
    },
    {
      "type": "clear background",
      "id": 47
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP2 동아리 OT",
      "options": {
        "maxTurns": 5,
        "tutorial": [
          "첫 벽돌깨기는 5턴만 진행돼. 마우스로 각도를 정하고 클릭하면 공이 나가.",
          "블럭 숫자는 남은 내구도야. 목표는 끝날 때 도파민을 적당히 남기는 거야.",
          "빨간 블럭은 맞힐 때마다 도파민이 +1씩 늘어나고, 파란 블럭은 부숴지면 도파민이 8 감소해.",
          "블럭이 바닥에 닿으면, 도파민은 그 상태로 유지된 채 게임 종료야!"
        ]
      },
      "id": 48
    }
  ],
  "EP2 동아리 OT": [
    {
      "type": "scene reset",
      "id": 1
    },
    {
      "type": "background",
      "name": "동아리방",
      "id": 2
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "ep25",
      "id": 3
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(으악 아직도 정신을 못 차리겠네… 실수하지 않게 조심해야겠다..)",
      "condition": {
        "dopamineState": "HIGH"
      },
      "id": 4
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(휴… 다행히 짧게라도 푹 잤다… 오늘 예감이 좋은데?)",
      "condition": {
        "dopamineState": "OPT"
      },
      "id": 5
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(하암… 영 집중이 잘 안된다. 온몸에 기운이 하나도 없네. 대충 구석에 박혀 있다 가야지… )",
      "condition": {
        "dopamineState": "LOW"
      },
      "id": 6
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(그나저나 동아리는 처음이라 엄청 긴장되네…)",
      "id": 7
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(다들 벌써 친해진 것 같고. 난 어디 앉지?)",
      "id": 8
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 9
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "(수진이 저 끝에 앉아 있다.)",
      "effects": {
        "dopamine": 5
      },
      "id": 10
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "어? 설마 어제 편의점에서 만난...?",
      "id": 11
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 12
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "?",
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(이렇게 다시 만나다니… 운명인가?)",
      "id": 14
    },
    {
      "type": "choice",
      "prompt": "(이렇게 다시 만나다니… 운명인가?)",
      "choices": [
        {
          "text": "(수진의 옆자리에 앉는다)",
          "follow": [],
          "effects": {
            "dopamine": 3
          },
          "sound": {
            "type": "sound",
            "soundType": "effect",
            "action": "play",
            "name": "chair"
          },
          "nextNode": 16
        },
        {
          "text": "(수진의 뒷자리에 앉는다)",
          "follow": [],
          "effects": {
            "dopamine": -3
          },
          "sound": {
            "type": "sound",
            "soundType": "effect",
            "action": "play",
            "name": "chair"
          },
          "nextNode": 16
        }
      ],
      "id": 15
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "안녕하세요!",
      "id": 17
    },
    {
      "type": "choice",
      "prompt": "안녕하세요!",
      "choices": [
        {
          "text": "(당연히 기억 못 하겠지) 안녕하세요~ 건축학과 00입니다",
          "follow": [],
          "effects": {
            "dopamine": -3
          },
          "nextNode": 19
        },
        {
          "text": "어제 혹시 편의점… 기억하세요?",
          "follow": [
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "앗…저희가 뵌 적이 있을까요?"
            },
            {
              "background": "동아리방",
              "speaker": "주인공",
              "text": "아하… 하긴 손님이 많으니…"
            },
            {
              "background": "동아리방",
              "speaker": "주인공",
              "text": "하하 저는 건축학과 00입니다."
            }
          ],
          "effects": {
            "dopamine": 3
          },
          "nextNode": 19
        }
      ],
      "id": 18
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "저는 피아노과 윤수진이에요. 무대제작부로 지원했어요!",
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(헉 나도 무대제작부인데… 이런 우연이!!)",
      "id": 20
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "오 저도 무대제작부에요!",
      "id": 21
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "건축학과시면 무대 제작 잘하시겠다!",
      "id": 22
    },
    {
      "type": "choice",
      "prompt": "건축학과시면 무대 제작 잘하시겠다!",
      "choices": [
        {
          "text": "아니에요. 직접 해본 적은 없어요ㅎㅎ",
          "follow": [],
          "nextNode": 24
        },
        {
          "text": "무대 만드는 건 처음이에요…",
          "follow": [],
          "nextNode": 24
        }
      ],
      "id": 23
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "(싱긋 웃으며) 그래도 든든하다. 앞으로 잘 해봐요!",
      "effects": {
        "dopamine": 3
      },
      "id": 24
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "crowd",
      "id": 25
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "(시끄러운 소리가 들린다)",
      "id": 26
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Happy",
      "id": 27
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "야, 황건호! 여기 무대부 신입들은 벌써 도란도란 친해진 거 같은데?",
      "id": 28
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "안녕하세요! 저는 연기부 신입 1학년 김혜지예요! 우리 다 동기 맞지?",
      "id": 29
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Happy",
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "어, 윤수진! 너 아까 음료수 사러 간다더니 여기 있었어?",
      "id": 31
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "안녕, 나도 이번에 무대부 신입으로 들어왔어. 잘 부탁해!",
      "id": 32
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Surprised",
      "id": 33
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아, 깜짝이야! 건호 너 언제 왔어?",
      "id": 34
    },
    {
      "type": "choice",
      "prompt": "아, 깜짝이야! 건호 너 언제 왔어?",
      "choices": [
        {
          "text": "두 분은 원래 아는 사이에요?",
          "follow": [],
          "nextNode": 36
        },
        {
          "text": "수진 씨는 친구가 많네요…",
          "follow": [],
          "nextNode": 36
        }
      ],
      "id": 35
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 36
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "건호는 제 고등학교 동창인데 어쩌다 보니 동아리도 같이 들어왔어요.",
      "id": 37
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 38
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "건호야, 이쪽은 건축학과 00님이야.",
      "id": 39
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Surprised",
      "id": 40
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "오, 건축학과! 대박이다.",
      "id": 41
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Happy",
      "id": 42
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "난 몸 쓰는 거 말곤 젬병인데 도면 같은 건 00이 네가 다 짜주는 거지? 든든하다 야!",
      "effects": {
        "dopamine": -5
      },
      "id": 43
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(고등학교 동창? 되게 편해 보이네. 신경 쓰이게…)",
      "id": 44
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 45
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "00님, 건호 얘 운동하는 애라 목소리만 크지 착해요.",
      "id": 46
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "너무 부담 갖지 마요, 알았죠?",
      "id": 47
    },
    {
      "type": "choice",
      "prompt": "너무 부담 갖지 마요, 알았죠?",
      "choices": [
        {
          "text": "활발하시고 좋네요.... (피곤하다)",
          "follow": [
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "하하, 맞아요. 건호가 원래 저래요."
            }
          ],
          "effects": {
            "affection": 5
          },
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 49
        },
        {
          "text": "네.... 에너지가 조금 많이 넘치시네요....",
          "follow": [
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Normal"
                }
              ],
              "speaker": "수진",
              "text": "00씨 기 빨렸죠?ㅎㅎ 저도 가끔 그래요."
            },
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "건호",
                  "emotion": "Surprised"
                }
              ],
              "speaker": "건호",
              "text": "야! 나를 뭘로 보는 거야!"
            }
          ],
          "effects": {
            "affection": 10
          },
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 49
        },
        {
          "text": "걱정 마세요ㅎㅎ",
          "follow": [],
          "effects": {
            "affection": 15
          },
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 49
        },
        {
          "text": "네, 저희 다 같이 잘 지내봐요~",
          "follow": [],
          "effects": {
            "affection": 20
          },
          "condition": {
            "dopamineState": "OPT"
          },
          "disabledPreview": true,
          "nextNode": 49
        },
        {
          "text": "두 분 되게 친해 보이시네요?",
          "follow": [
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "아, 워낙 오래 알아서 그런가봐요..ㅎㅎ"
            }
          ],
          "effects": {
            "affection": 5
          },
          "condition": {
            "dopamineState": "HIGH"
          },
          "nextNode": 49
        },
        {
          "text": "전 또 남자친구인 줄 알았네요!",
          "follow": [
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Surprised"
                }
              ],
              "speaker": "수진",
              "text": "네?? 쟤랑요?"
            },
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "건호",
                  "emotion": "Surprised"
                }
              ],
              "speaker": "건호",
              "text": "야, 왜 그렇게 놀라는데!"
            },
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "아무튼 아니에요. 진짜 아니에요."
            }
          ],
          "effects": {
            "affection": 10
          },
          "condition": {
            "dopamineState": "HIGH"
          },
          "disabledPreview": true,
          "nextNode": 49
        }
      ],
      "id": 48
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Normal",
      "id": 49
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "암튼! 이렇게 만난 것도 인연인데! 앞으로 동아리 잘 해보자~",
      "id": 50
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 51
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "그래! 기대된다 ㅎㅎ",
      "id": 52
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(수진씨… 봐도 봐도 예쁘다...)",
      "id": 53
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(내 첫사랑, 정말로 시작되는 건가?)",
      "id": 54
    },
    {
      "type": "clear background",
      "id": 55
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "sideShooter",
      "after": "EP3 동아리 MT",
      "options": {
        "difficulty": 0,
        "durationSeconds": 45,
        "tutorial": [
          "슈팅은 45초만 버티면 돼. 마우스로 움직이고 좌클릭을 꾹 누르면 자동으로 공격해.",
          "모든 적들은 처치하면 모두 도파민 +3 증가해.",
          "적에게 맞으면 도파민이 크게 올라. 빨간 표시는 도파민 상승이라고 보면 돼.",
          "초록 안정 캡슐과 흡수 필터는 도파민을 낮춰. 초록색은 완화 신호야.",
          "노란 P 캡슐은 파워 칸을 올려. 원하는 칸에서 우클릭하면 기술을 써.",
          "예를 들어 흡수 기술은 도파민을 낮춰주는 기술이야.",
          "흡수 기술을 제외한 기술은 한 번씩만 사용할 수 있어."
        ]
      },
      "id": 56
    }
  ],
  "EP3 동아리 MT": [
    {
      "type": "scene reset",
      "id": 1
    },
    {
      "type": "background",
      "name": "(CG) 동아리방에 둘러앉은 넷",
      "id": 2
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "ep36",
      "id": 3
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "너네 톡방에 공지 올라온 거 봤어?",
      "id": 4
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "어떤 공지?",
      "id": 5
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "지금 봐봐! 방금 올라왔어.",
      "id": 6
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "오! MT 있구나 우리.",
      "id": 7
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "와 재밌겠다! 갈 거지 너네 다?",
      "id": 8
    },
    {
      "type": "choice",
      "prompt": "와 재밌겠다! 갈 거지 너네 다?",
      "choices": [
        {
          "text": "난 수진이 가면 갈 거야.",
          "follow": [
            {
              "background": "(CG) 동아리방에 둘러앉은 넷",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "ㅋㅋㅋ 그래 우리 그럼 같이 가자."
            }
          ],
          "effects": {
            "dopamine": 5
          },
          "nextNode": 10
        },
        {
          "text": "나? 잘 모르겠네.. 수진아 넌 갈거야?",
          "follow": [
            {
              "background": "(CG) 동아리방에 둘러앉은 넷",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "가야지! 너도 가자 00아"
            },
            {
              "background": "(CG) 동아리방에 둘러앉은 넷",
              "clearCharacters": true,
              "speaker": "주인공",
              "text": "그래 좋아!"
            }
          ],
          "effects": {
            "dopamine": -5
          },
          "nextNode": 10
        }
      ],
      "id": 9
    },
    {
      "type": "background",
      "name": "동아리방",
      "id": 10
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Focused",
      "id": 11
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "근데 수진이 너 술 잘 못 먹지 않나?",
      "id": 12
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "음.. 약간?",
      "id": 14
    },
    {
      "type": "choice",
      "prompt": "음.. 약간?",
      "choices": [
        {
          "text": "MT 가서도 적당히만 마시고 우리끼리 놀면 되지 뭐.",
          "follow": [],
          "effects": {
            "dopamine": -5
          },
          "nextNode": 16
        },
        {
          "text": "에이 그래도 MT인데, 술게임도 하고 그래야 재밌지.",
          "follow": [
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "건호",
                  "emotion": "Normal"
                }
              ],
              "speaker": "건호",
              "text": "술게임 싫어하는 사람들도 있잖아. 자기 스타일대로 즐기는 거지."
            }
          ],
          "effects": {
            "dopamine": 5
          },
          "nextNode": 16
        }
      ],
      "id": 15
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "나 그래도 마시려면 마실 수 있으니까 괜찮아.",
      "id": 16
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Normal",
      "id": 17
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "그래도 놀다가 힘들면 나한테 얘기해ㅋㅋ",
      "effects": {
        "dopamine": 3
      },
      "id": 18
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "ㅎㅎ그래 고마워.",
      "id": 20
    },
    {
      "type": "background",
      "name": "(CG) MT 장소에 둘러앉은 넷",
      "transition": {
        "type": "fadeBlack"
      },
      "id": 21
    },
    {
      "type": "clear characters",
      "id": 22
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "crowd",
      "id": 23
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "(모두) 건호가 좋아하는 랜덤 게임! 랜덤 게임! 게임 스타트!",
      "id": 24
    },
    {
      "type": "background",
      "name": "MT 장소",
      "transition": {
        "type": "fadeBlack"
      },
      "id": 25
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Happy",
      "id": 26
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "아이엠그라운드 지금부터 시작! 수진 넷!",
      "id": 27
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Surprised",
      "id": 28
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "?! 아악 집중 안 하고 있었어!",
      "id": 29
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Happy",
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와 수진이 걸렸다!",
      "id": 31
    },
    {
      "type": "background",
      "name": "소주병을 향해 뻗는 수진의 손",
      "id": 32
    },
    {
      "type": "clear characters",
      "id": 33
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아씨 또 걸렸네ㅜ (잔을 집어 든다)",
      "id": 34
    },
    {
      "type": "choice",
      "prompt": "아씨 또 걸렸네ㅜ (잔을 집어 든다)",
      "choices": [
        {
          "text": "수진아 집중했어야지!",
          "follow": [],
          "nextNode": 36
        },
        {
          "text": "수진아 너 괜찮아?",
          "follow": [],
          "nextNode": 36
        }
      ],
      "id": 35
    },
    {
      "type": "background",
      "name": "소주병을 향해 뻗는 수진의 손을 잡는 건호의 손",
      "id": 36
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "(잔을 낚아채며) 야야 오늘 수진이 많이 마셨다, 좀 쉬어. (대신 마신다)",
      "effects": {
        "dopamine": 3
      },
      "id": 37
    },
    {
      "type": "background",
      "name": "MT 장소",
      "id": 38
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Surprised",
      "id": 39
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "오오 황건호 흑기사 뭐야?",
      "id": 40
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered",
      "id": 41
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "(건호의 어깨를 툭 치며) 아 뭘 그렇게까지ㅎ 고마워!",
      "id": 42
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(수진이는 건호가 많이 편해 보인다. 건호도 수진이를 잘 챙겨준다..)",
      "effects": {
        "dopamine": -5
      },
      "id": 43
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Normal",
      "id": 44
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "술 더 가져올게. 소주?맥주?",
      "id": 45
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Normal",
      "id": 46
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "맥주! 야 그럼 나도 잠깐 화장실.",
      "id": 47
    },
    {
      "type": "clear characters",
      "id": 48
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 49
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아 MT 재밌다! 건호랑 혜지 진짜 재밌다, 그지 00아?",
      "id": 50
    },
    {
      "type": "choice",
      "prompt": "아 MT 재밌다! 건호랑 혜지 진짜 재밌다, 그지 00아?",
      "choices": [
        {
          "text": "응..ㅎ 좋네",
          "follow": [
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Normal"
                }
              ],
              "speaker": "수진",
              "text": "ㅋㅋㅋ 00아 힘들어? 왤케 피곤해보여ㅜ"
            },
            {
              "background": "MT 장소",
              "speaker": "주인공",
              "text": "아 그냥 오늘 하루 종일 놀아서ㅎ"
            },
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Focused"
                }
              ],
              "speaker": "수진",
              "text": "하긴 오늘 계속 사람 많은 데서 있어서 기빨렸을 수도 있겠다."
            },
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Normal"
                }
              ],
              "speaker": "수진",
              "text": "우리 나중에 그럼 넷이서만 한 번 만나서 놀자 어때?"
            },
            {
              "background": "MT 장소",
              "speaker": "주인공",
              "text": "오 좋아!",
              "effects": {
                "affection": 5
              }
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 52
        },
        {
          "text": "응? 뭐라고?",
          "follow": [
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Normal"
                }
              ],
              "speaker": "수진",
              "text": "아, 넷이 노니까 너무 재밌다구."
            },
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "우리 MT 끝나고도 한 번 만나서 놀자 어때?"
            },
            {
              "background": "MT 장소",
              "speaker": "주인공",
              "text": "오 그래!",
              "effects": {
                "affection": 0
              }
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 52
        },
        {
          "text": "응 그니까, 우리 MT 끝나고도 한 번 만나서 놀자!",
          "follow": [
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "우리 넷이서?"
            },
            {
              "background": "MT 장소",
              "speaker": "주인공",
              "text": "음 그냥 너랑 나랑은 어때?",
              "effects": {
                "affection": 20
              }
            },
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "오? 그래 좋아!"
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "disabledPreview": true,
          "nextNode": 54
        },
        {
          "text": "그러게, 몇십 명이 다 같이 놀다가 이렇게 우리끼리니까 좋다ㅎ",
          "follow": [
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "ㅋㅋㅋ그니까 난 여기가 제일 부담없고 좋은 거 같아."
            },
            {
              "background": "MT 장소",
              "speaker": "주인공",
              "text": "나도 동아리에서 네가 제일 편해."
            },
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "와 나도!"
            },
            {
              "background": "MT 장소",
              "speaker": "주인공",
              "text": "우리 그럼 MT 끝나고 나중에 둘이 한 번 만나서 놀까?",
              "effects": {
                "affection": 15
              }
            },
            {
              "background": "MT 장소",
              "speaker": "수진",
              "text": "너무 좋지!"
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 54
        },
        {
          "text": "그러게 넷이서 노니까 너무 재밌다!",
          "follow": [
            {
              "background": "MT 장소",
              "speaker": "주인공",
              "text": "우리 아예 MT 끝나고도 넷이 만나서 놀래?"
            },
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "너무 좋지! 이따 건호랑 혜지 들어오면 얘기해 보자."
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "nextNode": 52
        },
        {
          "text": "건호랑 혜지? 근데 솔직히 난 건호 좀 오버스러운 거 같긴 해.",
          "follow": [
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Normal"
                }
              ],
              "speaker": "수진",
              "text": "아 진짜?"
            },
            {
              "background": "MT 장소",
              "speaker": "주인공",
              "text": "응ㅋㅋ 우리 나중에 둘이서 한 번 놀자."
            },
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Normal"
                }
              ],
              "speaker": "수진",
              "text": "오 그것도 좋지!"
            },
            {
              "background": "MT 장소",
              "speaker": "주인공",
              "text": "MT 끝나고 내가 연락 한 번 할게! 약속 잡자.",
              "effects": {
                "affection": 10
              }
            },
            {
              "background": "MT 장소",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "그래 좋아!"
            }
          ],
          "effects": {
            "affection": -5
          },
          "condition": {
            "dopamineState": "HIGH"
          },
          "disabledPreview": true,
          "nextNode": 54
        }
      ],
      "id": 51
    },
    {
      "type": "clear background",
      "id": 52
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "options": {
        "maxTurns": 6
      },
      "after": "EP4-A 넷이",
      "id": 53
    },
    {
      "type": "clear background",
      "id": 54
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "options": {
        "maxTurns": 6
      },
      "after": "EP4-B 둘이",
      "id": 55
    }
  ],
  "EP4-A 넷이": [
    {
      "type": "scene reset",
      "id": 1
    },
    {
      "type": "background",
      "name": "카톡방 화면",
      "id": 2
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "ep14",
      "id": 3
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "다음 주 금요일에 그래서 뭐하고 놀아 우리?",
      "id": 4
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Normal",
      "id": 5
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "방탈출 하자! 추천받은 곳 있어.",
      "id": 6
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 7
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "오 어딘데?",
      "id": 8
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "○○이스케이프에 XX테마가 진짜 잘 만들었대.",
      "id": 9
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "오 네 명이면 방탈출 딱 좋다.",
      "id": 10
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Flustered",
      "id": 11
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "야 근데 여기 공포방탈출 같은데?",
      "id": 12
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered",
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "엥 진짜??",
      "id": 14
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "아 맞아 좀 무서운 게 들어있다고 하긴 했어.",
      "id": 15
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Frightened",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "나 공포방탈출은 싫어..",
      "id": 17
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "아냐 근데 공포영화 못 보는 내 친구도 해봤는데 괜찮았대.",
      "id": 18
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Normal",
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "아 진짜? 그럼 나쁘지 않겠다 뭐.",
      "id": 20
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered",
      "id": 21
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "그런가...?",
      "id": 22
    },
    {
      "type": "choice",
      "prompt": "그런가...?",
      "choices": [
        {
          "text": "그래도 수진이 불안한데 그냥 일반 테마로 찾아보는 건 어때?",
          "follow": [
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "건호",
                  "emotion": "Focused"
                }
              ],
              "speaker": "건호",
              "text": "아 근데 여기 지금 딱 금요일 8시에 자리도 비어서 완벽한데.."
            },
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "혜지",
                  "emotion": "Happy"
                }
              ],
              "speaker": "혜지",
              "text": "그래 한 번 공포테마 해보자 수진아!"
            },
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Sad"
                }
              ],
              "speaker": "수진",
              "text": "흠... 그래 알겠어.."
            }
          ],
          "effects": {
            "dopamine": -5
          },
          "nextNode": 24
        },
        {
          "text": "그래 이렇게 같이 할 때 공포 테마도 한 번 해보자 수진아.",
          "follow": [
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "건호",
                  "emotion": "Normal"
                }
              ],
              "speaker": "건호",
              "text": "충분히 할 만할 거야 진짜로."
            },
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Sad"
                }
              ],
              "speaker": "수진",
              "text": "ㅜ알겠어.. 심장 터지면 너네 책임이야."
            }
          ],
          "effects": {
            "dopamine": 5
          },
          "nextNode": 24
        }
      ],
      "id": 23
    },
    {
      "type": "background",
      "name": "공포방탈출 입구",
      "transition": {
        "type": "fadeBlack"
      },
      "id": 24
    },
    {
      "type": "clear characters",
      "id": 25
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Flustered",
      "id": 26
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "escapeRoom",
      "id": 27
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와 여기 분위기 미쳤다..",
      "id": 28
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(생각보다 무서운데...?)",
      "id": 29
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Frightened",
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "야 벌써부터 무서운데 어떡해... 내가 다른 테마 가자고 했잖아!",
      "id": 31
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Normal",
      "id": 32
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "에이~ 방탈출 와서 안 무서우면 재미없지. 걱정 마. 내가 다 풀어줄게.",
      "id": 33
    },
    {
      "type": "dialogue",
      "speaker": "직원",
      "text": "오늘 8시 예약하신 네 분 맞으실까요?",
      "id": 34
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Focused",
      "id": 35
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "넵 맞습니다!",
      "id": 36
    },
    {
      "type": "dialogue",
      "speaker": "직원",
      "text": "안쪽으로 안내 도와드릴게요.",
      "id": 37
    },
    {
      "type": "dialogue",
      "speaker": "직원",
      "text": "아시다시피 저희 테마는 공포 테마여서 갑작스럽게 \n조명이 꺼지거나 큰 소리가 날 수 있다는 점 숙지하시고요,",
      "effects": {
        "dopamine": 3
      },
      "id": 38
    },
    {
      "type": "dialogue",
      "speaker": "직원",
      "text": "예상하지 못한 곳에서 사물이 튀어나오거나 떨어질 수도 있으니 유의하시기 바랍니다.",
      "effects": {
        "dopamine": 3
      },
      "id": 39
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "(귓속말로) 어떡해....",
      "id": 40
    },
    {
      "type": "dialogue",
      "speaker": "직원",
      "text": "다들 그러면 준비 되셨을까요?",
      "id": 41
    },
    {
      "type": "choice",
      "prompt": "다들 그러면 준비 되셨을까요?",
      "choices": [
        {
          "text": "네..!",
          "follow": [],
          "nextNode": 43
        },
        {
          "text": "아니요..!",
          "follow": [],
          "nextNode": 43
        }
      ],
      "id": 42
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Happy",
      "id": 43
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "넵!",
      "id": 44
    },
    {
      "type": "dialogue",
      "speaker": "직원",
      "text": "네, 그러면 모두 눈을 감아주시고 저를 따라오시면 되겠습니다.",
      "id": 45
    },
    {
      "type": "background",
      "name": "공포방탈출 내부",
      "transition": {
        "type": "fadeBlack"
      },
      "id": 46
    },
    {
      "type": "clear characters",
      "id": 47
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Frightened",
      "id": 48
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "끄악! 건호야 뭐하는 거야!",
      "id": 49
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Focused",
      "id": 50
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "잠깐만 있어봐 여기 아래 보면 뭐가 있는 거 같단 말야… 찾았다!",
      "id": 51
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "(발견한 버튼을 누른다)",
      "id": 52
    },
    {
      "type": "background",
      "name": "(CG) 천장에서 귀신이 떨어지는 걸 보고 놀라는 수진",
      "id": 53
    },
    {
      "type": "clear characters",
      "id": 54
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "horror",
      "id": 55
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "으아아악!! (주인공의 팔을 붙잡는다)",
      "effects": {
        "dopamine": 3
      },
      "id": 56
    },
    {
      "type": "choice",
      "prompt": "으아아악!! (주인공의 팔을 붙잡는다)",
      "choices": [
        {
          "text": "(당황해 거리를 두며) 아이구 깜짝아 너무 무섭잖아 여기..",
          "follow": [
            {
              "background": "공포방탈출 내부",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Flustered"
                }
              ],
              "speaker": "수진",
              "text": "아 그러니까ㅜㅜ 빨리 탈출하자."
            }
          ],
          "effects": {
            "affection": 5
          },
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 58
        },
        {
          "text": "(당황해 거리를 두며) 어우 야 너 때문에 더 놀랐잖아.",
          "follow": [
            {
              "background": "공포방탈출 내부",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Flustered"
                }
              ],
              "speaker": "수진",
              "text": "아 미안해... 황건호 이거 어떡할 거야!!"
            },
            {
              "background": "공포방탈출 내부",
              "characters": [
                {
                  "name": "건호",
                  "emotion": "Focused"
                }
              ],
              "speaker": "건호",
              "text": "그래도 저기 문 열렸잖아! 빨리 탈출하자."
            }
          ],
          "effects": {
            "affection": -5
          },
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 58
        },
        {
          "text": "(붙잡아주며) 오 괜찮아? 무서운게 너무 많다 여기.. 혹시 힘들면 얘기해 수진아.",
          "follow": [
            {
              "background": "공포방탈출 내부",
              "speaker": "수진",
              "text": "아냐 그래도 끝까지 해보긴 해야지.. 빨리 풀어서 탈출하자.",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Focused"
                }
              ]
            }
          ],
          "effects": {
            "affection": 20
          },
          "condition": {
            "dopamineState": "OPT"
          },
          "disabledPreview": true,
          "nextNode": 58
        },
        {
          "text": "(붙잡아주며) 괜찮아? 옆 방까지 비명 소리 들리겠다ㅋㅋ 그래도 저기 문 열렸어!",
          "follow": [
            {
              "background": "공포방탈출 내부",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Flustered"
                }
              ],
              "speaker": "수진",
              "text": "ㅎㅎ고마워.. 빨리 가자."
            }
          ],
          "effects": {
            "affection": 15
          },
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 58
        },
        {
          "text": "(어깨를 감싸며) 오 괜찮아? 아니 건호가 너무 무서운 데를 찾아왔는데?",
          "follow": [
            {
              "background": "공포방탈출 내부",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Frightened"
                }
              ],
              "speaker": "수진",
              "text": "그니까ㅜㅜ 내가 다른 테마 가자고 했잖아 건호야."
            },
            {
              "background": "공포방탈출 내부",
              "characters": [
                {
                  "name": "건호",
                  "emotion": "Flustered"
                }
              ],
              "speaker": "건호",
              "text": "아 미안 나도 이 정도일 줄은 몰랐지.. 혹시 너무 힘들면 얘기해 수진아."
            },
            {
              "background": "공포방탈출 내부",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Focused"
                }
              ],
              "speaker": "수진",
              "text": "아냐 그래도 끝까지 해보긴 해야지.. 빨리 풀어서 탈출하자."
            }
          ],
          "effects": {
            "affection": 10
          },
          "condition": {
            "dopamineState": "HIGH"
          },
          "disabledPreview": true,
          "nextNode": 58
        },
        {
          "text": "(붙잡아주며) 오 야야 저기 문 열렸다! 보여?",
          "follow": [
            {
              "background": "공포방탈출 내부",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Frightened"
                }
              ],
              "speaker": "수진",
              "text": "아 진짜 심장 떨어지는 줄 알았네.."
            },
            {
              "background": "공포방탈출 내부",
              "characters": [
                {
                  "name": "건호",
                  "emotion": "Flustered"
                }
              ],
              "speaker": "건호",
              "text": "아 미안 나도 저렇게 떨어질 줄은 몰랐네 괜찮아?"
            },
            {
              "background": "공포방탈출 내부",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Flustered"
                }
              ],
              "speaker": "수진",
              "text": "응.. 빨리 넘어가자 저쪽으로."
            }
          ],
          "effects": {
            "affection": -5
          },
          "condition": {
            "dopamineState": "HIGH"
          },
          "nextNode": 58
        }
      ],
      "id": 57
    },
    {
      "type": "background",
      "name": "공포방탈출 내부",
      "transition": {
        "type": "fadeBlack"
      },
      "id": 58
    },
    {
      "type": "background",
      "name": "공포방탈출 외부",
      "transition": {
        "type": "fadeSlide",
        "duration": 1200,
        "slideDuration": 850,
        "direction": "left"
      },
      "id": 59
    },
    {
      "type": "clear characters",
      "id": 60
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Flustered",
      "id": 61
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "ep14",
      "id": 62
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와 진짜 죽는 줄 알았네.",
      "id": 63
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Happy",
      "id": 64
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "그래도 재밌지 않았어?",
      "id": 65
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 66
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "너 때문에 수명 줄었어 진짜..",
      "id": 67
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "에이 그래도 마지막 문제 네가 풀었잖아. 수진이 은근 잘해.",
      "id": 68
    },
    {
      "type": "choice",
      "prompt": "에이 그래도 마지막 문제 네가 풀었잖아. 수진이 은근 잘해.",
      "choices": [
        {
          "text": "맞아 수진이 아니었으면 우리 탈출 못했어!",
          "follow": [],
          "effects": {
            "dopamine": 5
          },
          "nextNode": 70
        },
        {
          "text": "그러게, 수진이도 잘 했지.",
          "follow": [],
          "effects": {
            "dopamine": -5
          },
          "nextNode": 70
        }
      ],
      "id": 69
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 70
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "ㅎ.. 그건 좀 뿌듯하긴 했어.",
      "id": 71
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "(수진의 어깨를 두드린다) 다음에도 또 만나서 놀자 얘들아.",
      "id": 72
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "좋아!",
      "id": 73
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(건호가 수진이를 대하는 방식이 조금 신경 쓰인다.)",
      "id": 74
    },
    {
      "type": "clear background",
      "id": 75
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "sideShooter",
      "after": "EP5 미팅사건",
      "options": {
        "difficulty": 1,
        "durationSeconds": 45
      },
      "id": 76
    }
  ],
  "EP4-B 둘이": [
    {
      "type": "scene reset",
      "id": 1
    },
    {
      "type": "background",
      "name": "카톡방 화면",
      "id": 2
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 3
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "ep14",
      "id": 4
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "00아, 내일 어디서 만날래?",
      "id": 5
    },
    {
      "type": "choice",
      "prompt": "00아, 내일 어디서 만날래?",
      "choices": [
        {
          "text": "그러게, 혹시 뭐 먹고 싶은 거 있어?",
          "follow": [
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Normal"
                }
              ],
              "speaker": "수진",
              "text": "음.. 다 상관없는데 파스타는 어때?",
              "effects": {
                "dopamine": -5
              }
            },
            {
              "background": "카톡방 화면",
              "speaker": "주인공",
              "text": "파스타 좋지! 학교 앞에 ○○음식점이 파스타 맛있다던데 어때?"
            },
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "좋아!"
            }
          ],
          "nextNode": 7
        },
        {
          "text": "너 파스타 좋아한다고 했었지?",
          "follow": [
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "오 맞아! 내가 말했었나?",
              "effects": {
                "dopamine": 5
              }
            },
            {
              "background": "카톡방 화면",
              "speaker": "주인공",
              "text": "전에 한 번 얘기했던 거 같아."
            },
            {
              "background": "카톡방 화면",
              "speaker": "주인공",
              "text": "학교 앞에 ○○음식점이 파스타 맛있다던데 어때?"
            },
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "그래 좋아!"
            }
          ],
          "nextNode": 7
        }
      ],
      "id": 6
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그럼 내일 6시에 거기서 보자!",
      "id": 7
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 8
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "그래 내일 봐!",
      "id": 9
    },
    {
      "type": "background",
      "name": "(CG) 예쁜 파스타집에 앉은 수진",
      "transition": {
        "type": "fadeBlack"
      },
      "id": 10
    },
    {
      "type": "clear characters",
      "id": 11
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "와 여기 너무 예쁘다! 어떻게 알게 된 데야?",
      "id": 12
    },
    {
      "type": "choice",
      "prompt": "와 여기 너무 예쁘다! 어떻게 알게 된 데야?",
      "choices": [
        {
          "text": "친구한테 추천받았어, 분위기도 좋고 맛있다길래.",
          "follow": [
            {
              "background": "(CG) 예쁜 파스타집에 앉은 수진",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "오 기대된다!",
              "effects": {
                "dopamine": -5
              }
            }
          ],
          "nextNode": 14
        },
        {
          "text": "내가 열심히 후기까지 검색해서 찾았지ㅎ",
          "follow": [
            {
              "background": "(CG) 예쁜 파스타집에 앉은 수진",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "오 뭐야ㅋㅋ 완전 잘 찾았다 너.",
              "effects": {
                "dopamine": 5
              }
            }
          ],
          "nextNode": 14
        }
      ],
      "id": 13
    },
    {
      "type": "background",
      "name": "예쁜 파스타",
      "id": 14
    },
    {
      "type": "dialogue",
      "speaker": "종업원",
      "text": "주문하신 메뉴 나왔습니다~",
      "id": 15
    },
    {
      "type": "background",
      "name": "예쁜 파스타집",
      "id": 16
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 17
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "와 잘 먹겠습니다!",
      "id": 18
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "맛있겠다!",
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "넌 우리 동아리 어떤 거 같아?",
      "id": 20
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 21
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "난 들어오기 너무 잘한 거 같아. 들어와서 건호랑 혜지랑 너도 만나고.",
      "id": 22
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "나도! 처음에는 낯도 많이 가리고 긴장했었는데ㅎ",
      "id": 23
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "와 나도.. 내가 새로운 사람 사귀는 게 좀 어색해서.",
      "id": 24
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "네가? 전혀 아닌 거 같은데?",
      "id": 25
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 생각해 보니 너랑은 좀 빨리 친해진 거 같기는 하다!",
      "effects": {
        "dopamine": 3
      },
      "id": 26
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그런거야? 다행이네.",
      "id": 27
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 어느새 한 학기가 거의 지났다 00아.",
      "id": 28
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그러게.. 처음 만난 지 얼마 되지도 않은 거 같은데.",
      "id": 29
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "이제 정기공연도 얼마 안 남았는데, 기분 어때?",
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "나 사실 걱정이 좀 많아..",
      "id": 31
    },
    {
      "type": "choice",
      "prompt": "나 사실 걱정이 좀 많아..",
      "choices": [
        {
          "text": "왜? 피아노과면 그래도 무대 경험 많지 않아?",
          "follow": [],
          "effects": {
            "affection": 5
          },
          "nextNode": 33
        },
        {
          "text": "에이, 너 공연도 엄청 자주 하고 잘 하잖아!",
          "follow": [],
          "effects": {
            "affection": 5
          },
          "nextNode": 33
        }
      ],
      "id": 32
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Focused",
      "id": 33
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "피아노도 항상 무대 오르면 떨리는데, 게다가 무대 스태프는 처음이잖아.",
      "id": 34
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "음 그럴 수 있겠다.",
      "id": 35
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "무대는 항상 완벽하게 하고 싶은 욕심이 커서 공연 앞두고 맨날 예민해지고..",
      "id": 36
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "네가 피아노도, 연극도 다 진심으로 해서 그래. 그니까 더 잘하고 멋있는거지.",
      "effects": {
        "affection": 5
      },
      "id": 37
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 38
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "ㅎㅎ 그런 얘기는 처음 들어보는데. 고마워.",
      "effects": {
        "dopamine": 3
      },
      "id": 39
    },
    {
      "type": "background",
      "name": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
      "transition": {
        "type": "fadeSlide",
        "duration": 1200,
        "slideDuration": 850,
        "direction": "left"
      },
      "id": 40
    },
    {
      "type": "clear characters",
      "id": 41
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 00아, 나 궁금한 거 있어.",
      "id": 42
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "음? 뭔데?",
      "id": 43
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "오늘 만날 때 왜 건호랑 혜지랑 같이 보는게 아니라 우리 둘이 보자고 한거야?",
      "effects": {
        "dopamine": 3
      },
      "id": 44
    },
    {
      "type": "choice",
      "prompt": "오늘 만날 때 왜 건호랑 혜지랑 같이 보는게 아니라 우리 둘이 보자고 한거야?",
      "choices": [
        {
          "text": "아… 음 그냥 뭐 건호랑 혜지는 바쁜 거 같아서..",
          "follow": [
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "아 그렇구나ㅎ 오늘 재밌었어. 공연도 화이팅하자!"
            },
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "주인공",
              "text": "그래! 다음에 또 봐!"
            }
          ],
          "effects": {
            "affection": 5
          },
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 46
        },
        {
          "text": "아 그냥 둘이서 봐도 좋을 거 같아서..? 별생각은 없었어.",
          "follow": [
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "아 그렇구나ㅎ 오늘 재밌었어. 공연도 화이팅하자!"
            },
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "주인공",
              "text": "그래! 다음에 또 봐!"
            }
          ],
          "effects": {
            "affection": 0
          },
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 46
        },
        {
          "text": "둘이 있으면 좀 더 대화도 길게 할 수 있고 좋잖아.",
          "follow": [
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "아 그렇구나! 그러게, 나도 오늘 이렇게 얘기 많이 해서 좋은 거 같아."
            },
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "주인공",
              "text": "우리 다음에도 또 보자!"
            },
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "좋아! 우리 공연도 화이팅!"
            }
          ],
          "effects": {
            "affection": 15
          },
          "condition": {
            "dopamineState": "OPT"
          },
          "disabledPreview": true,
          "nextNode": 46
        },
        {
          "text": "너랑 단둘이도 만나보고 싶었거든. 우리 맨날 넷이서만 봤잖아.",
          "follow": [
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "아하...! ㅎㅎ 좋다."
            },
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "주인공",
              "text": "재밌었어 오늘, 그지?"
            },
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "완전! 다음에 또 보자!"
            }
          ],
          "effects": {
            "affection": 20
          },
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 46
        },
        {
          "text": "너랑 데이트하고 싶었거든ㅎ",
          "follow": [
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "아? 갑자기 왜 그래ㅋㅋ"
            },
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "주인공",
              "text": "둘이어도 오늘 재밌지 않았어?"
            },
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "응 괜찮았어. 다음주에 봐!"
            }
          ],
          "effects": {
            "affection": 10
          },
          "condition": {
            "dopamineState": "HIGH"
          },
          "nextNode": 46
        },
        {
          "text": "왜? 혹시 어색하거나 그랬어?",
          "follow": [
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "아 아냐아냐 그냥 궁금해서 물어봤어."
            },
            {
              "background": "(Fade) (CG) 파스타집을 나와 걸어가는 둘",
              "clearCharacters": true,
              "speaker": "수진",
              "text": "오늘 재밌었어! 우리 다음 주에 보자 그럼."
            }
          ],
          "effects": {
            "affection": 5
          },
          "condition": {
            "dopamineState": "HIGH"
          },
          "disabledPreview": true,
          "nextNode": 46
        }
      ],
      "id": 45
    },
    {
      "type": "clear background",
      "id": 46
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "sideShooter",
      "after": "EP5 미팅사건",
      "options": {
        "difficulty": 1,
        "durationSeconds": 45
      },
      "id": 47
    }
  ],
  "EP5 미팅사건": [
    {
      "type": "scene reset",
      "id": 1
    },
    {
      "type": "background",
      "name": "야외 교내",
      "id": 2
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "ep25",
      "id": 3
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(공강인데 동아리방 가볼까? 수진이 있으려나?)",
      "id": 4
    },
    {
      "type": "background",
      "name": "동아리방",
      "transition": {
        "type": "fadeBlack"
      },
      "id": 5
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "door",
      "id": 6
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "(동아리방 문을 연다)",
      "id": 7
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Normal",
      "id": 8
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "그래서 너 나갈거야 안 나갈거야?",
      "id": 9
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered",
      "id": 10
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아 몰라.. 아직 고민 중이야.",
      "id": 11
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Happy",
      "id": 12
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "야, 대학 와서 미팅 한 번쯤은 해봐야지!",
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(잠시만.. 수진이가 미팅 나간다고?)",
      "effects": {
        "dopamine": 3
      },
      "id": 14
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Surprised",
      "id": 15
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "00이 왔네, 안녕.",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "어.. 안녕.",
      "id": 17
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "야 00아, 수진이 이번 주에 미팅 나간대!",
      "effects": {
        "dopamine": 3
      },
      "id": 18
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아.. 진짜?",
      "id": 19
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Focused",
      "id": 20
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아니, 그냥 친구가 대타 필요하다고 계속 부탁해서..",
      "effects": {
        "dopamine": -3
      },
      "id": 21
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered",
      "id": 22
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "나도 막 가고 싶은 거 아닌데..",
      "id": 23
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "근데 은근 그런 생각지도 못한 곳에서 잘 된다니까?",
      "id": 24
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와, 나 곧 수업 시작이다. 갈게, 잘해 봐!!",
      "id": 25
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "에이 무슨 소리야ㅠ",
      "id": 26
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "(혜지가 가고 둘만 남는다)",
      "id": 27
    },
    {
      "type": "choice",
      "prompt": "(혜지가 가고 둘만 남는다)",
      "choices": [
        {
          "text": "(말을 돌리며) 오늘 날씨가 참 꿀꿀하네..",
          "follow": [
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Normal"
                }
              ],
              "speaker": "수진",
              "text": "아..? 그런가"
            },
            {
              "background": "동아리방",
              "speaker": "주인공",
              "text": "아 맞다, 나 친구 만나기로 해서 먼저 가볼게..!",
              "effects": {
                "affection": 0
              }
            },
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Normal"
                }
              ],
              "speaker": "수진",
              "text": "음? 응 잘 가.."
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 29
        },
        {
          "text": "(무덤덤하게) 에이, 미팅은 뭐 그냥 재미로 나가는 거지.",
          "follow": [
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Surprised"
                }
              ],
              "speaker": "수진",
              "text": "그지, 진짜 어쩔 수 없이 나가는 거라."
            },
            {
              "background": "동아리방",
              "speaker": "주인공",
              "text": "미팅 한 번쯤 대학 온 김에 나가볼 수 있지."
            },
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Focused"
                }
              ],
              "speaker": "수진",
              "text": "미팅에서 진짜 잘될 일 없어ㅠ"
            },
            {
              "background": "동아리방",
              "speaker": "주인공",
              "text": "ㅋㅋㅋ그래."
            }
          ],
          "effects": {
            "affection": 5
          },
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 29
        },
        {
          "text": "미팅, 가고 싶은 거야?",
          "follow": [
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Surprised"
                }
              ],
              "speaker": "수진",
              "text": "아냐 막 가고 싶은 건 아닌데.."
            },
            {
              "background": "동아리방",
              "speaker": "주인공",
              "text": "가기 싫으면 안 가도 좋지만 재미 삼아 나가봐도 상관없지 뭐.",
              "effects": {
                "affection": 15
              }
            },
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Focused"
                }
              ],
              "speaker": "수진",
              "text": "나도 잘 모르겠어.. 고민 좀 해봐야지."
            },
            {
              "background": "동아리방",
              "speaker": "주인공",
              "text": "그래 뭐 네 선택이니까 편하게 생각해."
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "disabledPreview": true,
          "nextNode": 29
        },
        {
          "text": "수진아, 너 정말 미팅 나가?",
          "follow": [
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Flustered"
                }
              ],
              "speaker": "수진",
              "text": "응 그럴 거 같아.. 대타 때문에 진짜 어쩔 수 없는 거라."
            },
            {
              "background": "동아리방",
              "speaker": "주인공",
              "text": "아 그래? 혹시나 뭐.. 미팅에서 너무 취하면 얘기하고, 위험할 수도 있으니까.",
              "effects": {
                "affection": 20
              }
            },
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Focused"
                }
              ],
              "speaker": "수진",
              "text": "어? 어.. 고마워."
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 29
        },
        {
          "text": "(살짝 삐진 목소리로).. 꼭 가야 하는 거야?",
          "follow": [
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Sad"
                }
              ],
              "speaker": "수진",
              "text": "대타 때문에 진짜 어쩔 수 없이 나가는 거라ㅠ"
            },
            {
              "background": "동아리방",
              "speaker": "주인공",
              "text": "조금 서운하네ㅎㅎ",
              "effects": {
                "dopamine": 5,
                "affection": 5
              }
            },
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Surprised"
                }
              ],
              "speaker": "수진",
              "text": "....응?"
            },
            {
              "background": "동아리방",
              "speaker": "주인공",
              "text": "아 장난이야ㅎ"
            },
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Flustered"
                }
              ],
              "speaker": "수진",
              "text": "어? 알겠..어."
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "nextNode": 29
        },
        {
          "text": "(당황하며 빠르게) 조금 너무하다.",
          "follow": [
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Flustered"
                }
              ],
              "speaker": "수진",
              "text": "(당황하며) 미팅은 진짜 어쩔 수 없이 나가는 거야.",
              "effects": {
                "dopamine": 5
              }
            },
            {
              "background": "동아리방",
              "speaker": "주인공",
              "text": "(까칠하게) 됐다. 그냥 재밌게 놀다 와.",
              "effects": {
                "affection": -10
              }
            },
            {
              "background": "동아리방",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Flustered"
                }
              ],
              "speaker": "수진",
              "text": "뭐야, 내가 알아서 할게!"
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "disabledPreview": true,
          "nextNode": 29
        }
      ],
      "id": 28
    },
    {
      "type": "background",
      "name": "카톡방 화면",
      "transition": {
        "type": "fadeBlack"
      },
      "id": 29
    },
    {
      "type": "clear characters",
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "<다음 날 카톡>",
      "id": 31
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 32
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "나 미팅 안 나가기로 했어!",
      "effects": {
        "dopamine": 3
      },
      "id": 33
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "어? 왜?",
      "id": 34
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 35
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "생각해보니까 괜히 더 피곤할 것 같아서ㅋㅋ 공연 준비도 해야 하고.",
      "id": 36
    },
    {
      "type": "choice",
      "prompt": "생각해보니까 괜히 더 피곤할 것 같아서ㅋㅋ 공연 준비도 해야 하고.",
      "choices": [
        {
          "text": "잘됐다..! 다행이야.",
          "follow": [
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Surprised"
                }
              ],
              "speaker": "수진",
              "text": "ㅋㅋㅋㅋㅋ너는 왜 다행이야.",
              "effects": {
                "dopamine": 5
              }
            },
            {
              "background": "카톡방 화면",
              "speaker": "주인공",
              "text": "아 그냥..ㅎㅎ 마음이 조금 놓이네."
            },
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "뭐야..ㅋㅋ 공연날 보자!"
            },
            {
              "background": "카톡방 화면",
              "speaker": "주인공",
              "text": "응! 컨디션 관리 잘하고!"
            }
          ],
          "nextNode": 38
        },
        {
          "text": "맞아, 솔직히 공연 다가오는데 미팅 좀 그렇다고 생각했어.",
          "follow": [
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Surprised"
                }
              ],
              "speaker": "수진",
              "text": "아? 어..",
              "effects": {
                "dopamine": -5
              }
            },
            {
              "background": "카톡방 화면",
              "speaker": "주인공",
              "text": "그래 공연 날 보자~"
            },
            {
              "background": "카톡방 화면",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Normal"
                }
              ],
              "speaker": "수진",
              "text": "응응!"
            }
          ],
          "nextNode": 38
        }
      ],
      "id": 37
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
      "options": {
        "maxTurns": 6
      },
      "id": 39
    }
  ],
  "EP6 정기공연": [
    {
      "type": "scene reset",
      "id": 1
    },
    {
      "type": "background",
      "name": "(CG) 백스테이지에 있는 주인공과 수진",
      "id": 2
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "ep36",
      "id": 3
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "crowd",
      "id": 4
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "(귓속말로) 오늘 순조롭게 잘되고 있다!",
      "effects": {
        "dopamine": -5
      },
      "id": 5
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그러게 다행이다.. 얼른 무사히 끝났으면!",
      "id": 6
    },
    {
      "type": "background",
      "name": "백스테이지",
      "id": 7
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Surprised",
      "id": 8
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "running",
      "id": 9
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "큰일 났어요, 2막 문 세트 나사 빠졌어요!",
      "id": 10
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "...뭐?",
      "id": 11
    },
    {
      "type": "dialogue",
      "speaker": "선배1",
      "text": "그거 누구 담당이지..?",
      "id": 12
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Sad",
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "저요..",
      "id": 14
    },
    {
      "type": "dialogue",
      "speaker": "선배1",
      "text": "공연 당일에 이런 실수가 나오는 게 말이 돼!",
      "effects": {
        "dopamine": 3
      },
      "id": 15
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "죄송합니다..!",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "선배1",
      "text": "지금 고쳐야 돼, 빨리!",
      "id": 17
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Focused",
      "id": 18
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "네, 선배!",
      "id": 19
    },
    {
      "type": "background",
      "name": "문 세트",
      "transition": {
        "type": "fadeBlack"
      },
      "id": 20
    },
    {
      "type": "clear characters",
      "id": 21
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "running",
      "id": 22
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "(공구 박스를 들고 백스테이지로 달려간다)",
      "effects": {
        "dopamine": 3
      },
      "id": 23
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Focused",
      "id": 24
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "드라이버 좀!",
      "id": 25
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "여기.",
      "id": 26
    },
    {
      "type": "dialogue",
      "speaker": "선배1",
      "text": "1분 뒤 세트 들어간다!",
      "id": 27
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered",
      "id": 28
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아 이게 왜 안들어가지..",
      "id": 29
    },
    {
      "type": "choice",
      "prompt": "아 이게 왜 안들어가지..",
      "choices": [
        {
          "text": "(불안해하며) 아 어떡하지.. 곧 시작인데..",
          "follow": [
            {
              "background": "문 세트",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Sad"
                }
              ],
              "speaker": "수진",
              "text": "제발.."
            },
            {
              "background": "문 세트",
              "speaker": "주인공",
              "text": "빨리 넣어봐, 곧 시작이야!"
            },
            {
              "background": "문 세트",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "sound": {
                "type": "sound",
                "soundType": "effect",
                "action": "play",
                "name": "screwdriver"
              },
              "speaker": "수진",
              "text": "와 드디어 됐다! 선배 여기요!"
            },
            {
              "background": "문 세트",
              "speaker": "주인공",
              "text": "와 다행이다! 큰일 나는 줄 알았네."
            }
          ],
          "effects": {
            "affection": -10
          },
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 31
        },
        {
          "text": "내가 이쪽 잡아줄게.",
          "follow": [
            {
              "background": "문 세트",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Focused"
                }
              ],
              "speaker": "수진",
              "text": "고마워.. 아 제발.."
            },
            {
              "background": "문 세트",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "sound": {
                "type": "sound",
                "soundType": "effect",
                "action": "play",
                "name": "screwdriver"
              },
              "speaker": "수진",
              "text": "휴 됐다..!"
            },
            {
              "background": "문 세트",
              "speaker": "주인공",
              "text": "오! 정말 다행이다!"
            }
          ],
          "effects": {
            "affection": 5
          },
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 31
        },
        {
          "text": "내가 잘 잡고 있을게, 차분하게 하면 돼.",
          "follow": [
            {
              "background": "문 세트",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "고마워ㅜ 제발.."
            },
            {
              "background": "문 세트",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "sound": {
                "type": "sound",
                "soundType": "effect",
                "action": "play",
                "name": "screwdriver"
              },
              "speaker": "수진",
              "text": "아 됐다! (하이파이브를 하며 웃는다)"
            },
            {
              "background": "문 세트",
              "speaker": "주인공",
              "text": "다행이다, 수고했어!"
            }
          ],
          "effects": {
            "affection": 15
          },
          "condition": {
            "dopamineState": "OPT"
          },
          "disabledPreview": true,
          "nextNode": 31
        },
        {
          "text": "내가 해볼게, 이거 잘 잡고 있어 줘.",
          "follow": [
            {
              "background": "문 세트",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Focused"
                }
              ],
              "speaker": "수진",
              "text": "어, 여기 구멍에 넣으면 돼!"
            },
            {
              "background": "문 세트",
              "sound": {
                "type": "sound",
                "soundType": "effect",
                "action": "play",
                "name": "screwdriver"
              },
              "speaker": "주인공",
              "text": "(드르륵 나사를 넣는다) 오 됐다.",
              "effects": {
                "affection": 20
              }
            },
            {
              "background": "문 세트",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "와 정말 다행이다ㅠ 고마워!"
            },
            {
              "background": "문 세트",
              "speaker": "주인공",
              "text": "아니야ㅎ 너도 수고했어."
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 31
        },
        {
          "text": "이리줘 내가 할게, 이거 좀 잡고 있어봐.",
          "follow": [
            {
              "background": "문 세트",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Focused"
                }
              ],
              "speaker": "수진",
              "text": "어, 여기 구멍에 넣으면 돼!"
            },
            {
              "background": "문 세트",
              "sound": {
                "type": "sound",
                "soundType": "effect",
                "action": "play",
                "name": "screwdriver"
              },
              "speaker": "주인공",
              "text": "(드르륵, 나사를 넣는다) 오 됐다!",
              "effects": {
                "affection": 10
              }
            },
            {
              "background": "문 세트",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "speaker": "수진",
              "text": "와 정말 다행이다ㅠ 고마워!"
            },
            {
              "background": "문 세트",
              "speaker": "주인공",
              "text": "아니야ㅎ"
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "nextNode": 31
        },
        {
          "text": "그렇게 말고 나사를 이쪽으로 좀 더 세게 돌려봐 봐!",
          "follow": [
            {
              "background": "문 세트",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Sad"
                }
              ],
              "speaker": "수진",
              "text": "어, 알았어.."
            },
            {
              "background": "문 세트",
              "speaker": "주인공",
              "text": "어 지금 잘못 끼웠어."
            },
            {
              "background": "문 세트",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Happy"
                }
              ],
              "sound": {
                "type": "sound",
                "soundType": "effect",
                "action": "play",
                "name": "screwdriver"
              },
              "speaker": "수진",
              "text": "어어.. 와 됐다! 해결됐어요 선배."
            },
            {
              "background": "문 세트",
              "speaker": "주인공",
              "text": "와 다행이다."
            }
          ],
          "effects": {
            "affection": -10
          },
          "condition": {
            "dopamineState": "HIGH"
          },
          "disabledPreview": true,
          "nextNode": 31
        }
      ],
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "돌발상황이었는데 잘 해결했다!",
      "id": 31
    },
    {
      "type": "clear characters",
      "id": 32
    },
    {
      "type": "background",
      "name": "수진이 우는 모습",
      "id": 33
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "응... (울먹이며 눈물을 흘린다)",
      "effects": {
        "dopamine": 3
      },
      "id": 34
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "수진아.. 울어?",
      "id": 35
    },
    {
      "type": "background",
      "name": "백스테이지",
      "id": 36
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Sad",
      "id": 37
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아 너무 긴장했나봐, 나도 모르게 눈물이 나오네..",
      "id": 38
    },
    {
      "type": "choice",
      "prompt": "아 너무 긴장했나봐, 나도 모르게 눈물이 나오네..",
      "choices": [
        {
          "text": "(수진을 토닥여 준다) 무대 전에 돌발상황 생길 수 있지, 네 탓 아니야.",
          "follow": [],
          "nextNode": 40
        },
        {
          "text": "(휴지를 건네준 후 다른 곳을 본다)",
          "follow": [],
          "nextNode": 40
        }
      ],
      "id": 39
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "00아 정말 고마워...",
      "id": 40
    },
    {
      "type": "clear background",
      "id": 41
    },
    {
      "type": "move",
      "next": "해피엔딩",
      "condition": {
        "affectionMin": 60
      },
      "id": 42
    },
    {
      "type": "clear background",
      "id": 43
    },
    {
      "type": "move",
      "next": "베드엔딩",
      "id": 44
    }
  ],
  "해피엔딩": [
    {
      "type": "scene reset",
      "id": 1
    },
    {
      "type": "background",
      "name": "무대막이 내리는 장면",
      "id": 2,
      "transitionDuration": 3000,
      "transition": "fadeBlack"
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "crowd",
      "id": 3
    },
    {
      "type": "dialogue",
      "speaker": "선배1",
      "text": "다들 수고 많았어! 덕분에 순조롭게 공연 잘 마쳤다!",
      "id": 4
    },
    {
      "type": "background",
      "name": "백스테이지",
      "id": 5
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(공연도 끝났고.. 이제 수진이 보기 어렵겠네.. 슬프다ㅠ)",
      "id": 6
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(혹시.. 수진이도 이런 생각하려나..? )",
      "id": 7
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(오늘 아니면 볼 일 잘 없으니까 그냥 물어볼까..?)",
      "id": 8
    },
    {
      "type": "background",
      "name": "(CG) 텅 빈 밤길을 걸어가는 둘",
      "transition": {
        "type": "fadeBlack"
      },
      "id": 9
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "수진아 잠깐 얘기할 수 있어?",
      "id": 10
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아 그럼!",
      "id": 11
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "와... 오늘 하루 진짜 길었다.",
      "id": 12
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "그러게..",
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아깐 너무 무서웠어. 내가 실수해서 공연 망가질까봐.",
      "id": 14
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "그래도 네가 옆에 있어서 좀 안심됐어ㅎ",
      "id": 15
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "내가 도움이 되었다니 다행이다..",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "정말 고마워 00아.",
      "id": 17
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아니야, 너도 진짜 수고 많았어.",
      "id": 18
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "이제 공연도 다 끝나고... 우리 앞으로 한동안 볼 일이 없으려나?",
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "왜? 계속 보면 되잖아.",
      "id": 20
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "(잠시 수진을 바라본다)",
      "id": 21
    },
    {
      "type": "choice",
      "prompt": "(잠시 수진을 바라본다)",
      "choices": [
        {
          "text": "아무래도 동아리 끝나면 볼 기회가 줄어들지 않을까?",
          "follow": [
            {
              "background": "밤, 대학가",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Normal"
                }
              ],
              "speaker": "수진",
              "text": "에이 우리는 계속 만나면 되지."
            },
            {
              "background": "밤, 대학가",
              "speaker": "주인공",
              "text": "정말..?"
            }
          ],
          "nextNode": 23
        },
        {
          "text": "사실.. 난 너 동아리 끝나도 계속 보고싶어.",
          "follow": [
            {
              "background": "밤, 대학가",
              "characters": [
                {
                  "name": "수진",
                  "emotion": "Hopeful"
                }
              ],
              "speaker": "수진",
              "text": "뭐야 갑자기 부끄럽게..ㅎㅎ"
            }
          ],
          "nextNode": 23
        }
      ],
      "id": 22
    },
    {
      "type": "background",
      "name": "밤, 대학가",
      "transition": {
        "type": "fadeSlide",
        "duration": 1200,
        "slideDuration": 850,
        "direction": "left"
      },
      "id": 23
    },
    {
      "type": "clear characters",
      "id": 24
    },
    {
      "type": "background",
      "name": "(CG) 서로 바라보는 둘",
      "id": 25
    },
    {
      "type": "choice",
      "prompt": "(잠시 수진을 바라본다)",
      "choices": [
        {
          "text": "수진아.. 사실 나 너 좋아하는데, 너는 나 어때?",
          "follow": [],
          "nextNode": 27
        },
        {
          "text": "나 너 좋아해. 너랑 더 특별한 사이가 되고 싶어.",
          "follow": [],
          "nextNode": 27
        }
      ],
      "id": 26
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "(수진이 걸음을 멈춘다.)",
      "id": 27
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "나도 너.. 좋아해!",
      "id": 28
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(헉!)",
      "id": 29
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "뭘 그렇게 놀라ㅋㅋ",
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아니.. 다행이다ㅎ 너무 좋다.",
      "id": 31
    },
    {
      "type": "background",
      "name": "(CG) 손을 잡는 둘",
      "id": 32
    },
    {
      "type": "clear background",
      "id": 33
    },
    {
      "type": "dialogue",
      "speaker": "END",
      "text": "해피엔딩",
      "id": 34
    }
  ],
  "베드엔딩": [
    {
      "type": "scene reset",
      "id": 1
    },
    {
      "type": "background",
      "name": "무대막이 내리는 장면",
      "id": 2,
      "transitionDuration": 3000,
      "transition": "fadeBlack"
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "crowd",
      "id": 3
    },
    {
      "type": "dialogue",
      "speaker": "선배1",
      "text": "다들 수고 많았어! 덕분에 순조롭게 공연 잘 마쳤다!",
      "id": 4
    },
    {
      "type": "background",
      "name": "백스테이지",
      "id": 5
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(공연도 끝났고.. 이제 수진이 보기 어렵겠네.. 슬프다ㅠ)",
      "id": 6
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(혹시.. 수진이도 이런 생각하려나..? )",
      "id": 7
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(오늘 아니면 볼 일 잘 없으니까 그냥 물어볼까..?)",
      "id": 8
    },
    {
      "type": "background",
      "name": "밤, 대학가",
      "id": 9
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "수진아, 잠깐 얘기할 수 있을까?",
      "id": 10
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 11
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "어? 어..",
      "id": 12
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아까부터 하려고 했던 말인데..",
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "사실.. 나 너 좋아해.",
      "id": 14
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Surprised",
      "id": 15
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "(수진이 어색하게 웃는다) ..아, 아하하 어..",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "너무 갑작스러웠지.. 근데 공연 끝나면 더 말 못할 것 같아서..",
      "id": 17
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "조금 생각할 시간을 줄까?",
      "id": 18
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Sad",
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아니야, 음 그게 나는... 미안해.",
      "id": 20
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "00아, 너는 정말 좋은 사람이야,",
      "id": 21
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "같이 공연 준비하면서도 엄청 의지됐고..",
      "id": 22
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(애써 웃는다) 아.. 어..",
      "id": 23
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Focused",
      "id": 24
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 나는.. 그냥 너를 좋은 동아리 사람으로 생각했던 것 같아.",
      "id": 25
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "..그렇구나.",
      "id": 26
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Hopeful",
      "id": 27
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "우리 동아리에서 어색해지진 말자..!",
      "id": 28
    },
    {
      "type": "choice",
      "prompt": "우리 동아리에서 어색해지진 말자..!",
      "choices": [
        {
          "text": "그래.. 그럼 그냥 친구로 지내자..!",
          "follow": [],
          "nextNode": 30
        },
        {
          "text": "음.. 그냥 이제 볼일 없을거야..",
          "follow": [],
          "nextNode": 30
        }
      ],
      "id": 29
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "먼저 갈게..",
      "id": 31
    },
    {
      "type": "background",
      "name": "(CG) 혼자 남은 주인공)",
      "id": 32
    },
    {
      "type": "clear characters",
      "id": 33
    },
    {
      "type": "background",
      "name": "밤, 대학가",
      "id": 34
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(..어디서부터 잘못된 걸까.., 분명 처음엔 좋았는데..)",
      "id": 35
    },
    {
      "type": "clear background",
      "id": 36
    },
    {
      "type": "dialogue",
      "speaker": "END",
      "text": "베드엔딩",
      "id": 37
    }
  ]
};
