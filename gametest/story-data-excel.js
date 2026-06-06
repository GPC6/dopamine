// Generated from ../도파민때문에_시나리오_proto_2.xlsx.
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
      "transition": "fadeBlack",
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
      "type": "choice",
      "prompt": "음료수라도 마셔야겠다.",
      "choices": [
        {
          "text": "(망고맛 에너지 드링크를 고른다)",
          "follow": [],
          "sound": {
            "soundType": "effect",
            "action": "play",
            "name": "ep1Ding"
          },
          "nextNode": 7
        },
        {
          "text": "(스누피 커피맛을 고른다)",
          "follow": [],
          "nextNode": 7
        }
      ],
      "id": 6
    },
    {
      "type": "background",
      "name": "편의점",
      "transition": "fadeBlack",
      "id": 7
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "저기 계산...",
      "id": 8
    },
    {
      "type": "background",
      "name": "(CG) 졸고 있는 수진",
      "id": 9
    },
    {
      "type": "clear characters",
      "id": 10
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(…예쁘다.)",
      "id": 11
    },
    {
      "type": "choice",
      "prompt": "(…예쁘다.)",
      "choices": [
        {
          "text": "저기요…",
          "follow": [],
          "nextNode": 13
        },
        {
          "text": "(그냥 빤히 쳐다본다)",
          "follow": [],
          "nextNode": 13
        }
      ],
      "id": 12
    },
    {
      "type": "background",
      "name": "(CG) 화들짝 깨는 수진",
      "id": 13
    },
    {
      "type": "clear characters",
      "id": 14
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아, 네! 죄송합니다…!",
      "id": 15
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "ep1Barcode",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "1500원입니다…!",
      "id": 17
    },
    {
      "type": "choice",
      "prompt": "1500원입니다…!",
      "choices": [
        {
          "text": "아 감사합니다.",
          "follow": [],
          "nextNode": 19
        },
        {
          "text": "안녕히계세요~",
          "follow": [],
          "nextNode": 19
        }
      ],
      "id": 18
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(...잠 덜 깬 얼굴인데도 엄청 예쁘네.)",
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(이제 집에 가서 공부 좀 더 하다 자야겠다...)",
      "id": 20
    },
    {
      "type": "background",
      "name": "(CG) 침실 앞 책상에서 과제를 하는 주인공",
      "transition": "fadeBlack",
      "id": 21
    },
    {
      "type": "clear characters",
      "id": 22
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "후… 드디어 끝냈다. 과제 제출 완료.",
      "id": 23
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "유튜브나 좀 보다 자야겠다~",
      "id": 24
    },
    {
      "type": "background",
      "name": "(CG) 침실 앞 책상에서 과제를 하는 주인공 - 새벽",
      "transition": {
        "type": "fadeBlack",
        "duration": 1800
      },
      "id": 1017
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "헉… 미친, 쇼츠 좀 봤다고 세 시간이 지났어?!",
      "id": 25
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "지금 아침 6시라고?!",
      "id": 26
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아, 진짜 나 요즘 도파민 중독인가 봐…",
      "id": 27
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아까 마신 카페인 때문에 잠은 안 오고, 가슴은 쓸데없이 뛰네.",
      "id": 28
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "이러다 몇 시간 뒤 동아리 OT 가서 눈도 제대로 못 뜨고 대형 실수하는 거 아니겠지…",
      "id": 29
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "조금이라도 자야겠다...",
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(휴대폰을 끄고 눕는다)",
      "id": 31
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "눈꺼풀이 무겁다. 아까까지 머릿속을 떠다니던 영상들이 흐릿하게 녹아내린다.",
      "id": 1007
    },
    {
      "type": "clear characters",
      "id": 1008
    },
    {
      "type": "background",
      "name": "검은 배경",
      "transition": "fadeBlack",
      "id": 1004
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "…잠깐만. 나 분명 눈을 감았는데, 여긴 어디지?",
      "id": 1009
    },
    {
      "type": "background",
      "name": "꿈속",
      "transition": {
        "type": "fadeBlack",
        "duration": 900
      },
      "id": 1010
    },
    {
      "type": "character in",
      "name": "파미니",
      "emotion": "Normal",
      "id": 1005
    },
    {
      "type": "dialogue",
      "speaker": "파미니",
      "text": "드디어 연결됐다! 안녕, OO. 여기는 네 꿈속이야.",
      "id": 32
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "꿈속…? 그리고 넌 누구야?",
      "id": 33
    },
    {
      "type": "dialogue",
      "speaker": "파미니",
      "text": "나는 도파민. 정확히는 네가 설레고, 집중하고, 가끔은 쓸데없이 각성하는 그 흐름을 관리하는 존재지.",
      "id": 34
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "내 도파민이… 말도 해?",
      "id": 35
    },
    {
      "type": "dialogue",
      "speaker": "파미니",
      "text": "오늘은 특별히 비상 호출이야. 밤샘 과제, 카페인, 세 시간짜리 쇼츠 콤보로 네 뇌가 꽤 흔들렸거든.",
      "id": 36
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그거… 부정할 수가 없네.",
      "id": 37
    },
    {
      "type": "dialogue",
      "speaker": "파미니",
      "text": "앞으로 너는 매일 밤 이 꿈속으로 오게 될 거야. 여기서 네 도파민 상태가 미니게임으로 정해지고, 그 수치가 다음 날의 행동에 영향을 줄 거야.",
      "id": 38
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "다음 날의 행동이라면… 내가 말하거나 움직이는 방식도 달라진다는 뜻이야?",
      "id": 1011
    },
    {
      "type": "dialogue",
      "speaker": "파미니",
      "text": "맞아. 너무 낮으면 기운이 빠져서 타이밍을 놓치고, 너무 높으면 감정이 앞서서 실수할 수 있어.",
      "id": 1012
    },
    {
      "type": "dialogue",
      "speaker": "파미니",
      "text": "가장 좋은 건 적당히 설레고, 적당히 차분한 상태. 대략 50에서 80 사이를 기억해 둬.",
      "id": 1013
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그러니까 지금부터… 내 마음 상태를 직접 조절해보라는 거네.",
      "id": 1014
    },
    {
      "type": "dialogue",
      "speaker": "파미니",
      "text": "정답. 내일은 첫 동아리 OT잖아. 무기력하게 굳어버리거나, 과하게 들떠서 폭주하지 않게 균형을 맞춰보자.",
      "id": 1015
    },
    {
      "type": "dialogue",
      "speaker": "파미니",
      "text": "자, 첫 번째 밤의 도파민 조절을 시작할게.",
      "id": 1016
    },
    {
      "type": "clear characters",
      "id": 1006
    },
    {
      "type": "clear background",
      "id": 39
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP2 동아리 OT",
      "id": 40,
      "options": {
        "maxTurns": 5,
        "tutorial": [
          "첫 벽돌깨기는 5턴만 진행돼. 마우스로 각도를 정하고 클릭하면 공이 나가.",
          "블럭 숫자는 남은 내구도야. 목표는 끝날 때 도파민을 적당히 남기는 거야.",
          "빨간 블럭은 맞힐 때마다 도파민이 +1씩 늘어나고, 파란 블럭은 부숴지면 도파민이 8 감소해.",
          "블럭이 아래까지 내려오면 바로 끝나지만, 그 순간의 도파민이 결과로 돌아가."
        ]
      }
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
      "transition": "fadeBlack",
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
      "speaker": "독백",
      "text": "(으악 아직도 정신을 못 차리겠네… 실수하지 않게 조심해야겠다..)",
      "condition": {
        "dopamineState": "HIGH"
      },
      "id": 4
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(휴… 다행히 짧게라도 푹 잤다… 오늘 예감이 좋은데?)",
      "condition": {
        "dopamineState": "OPT"
      },
      "id": 5
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(하암… 영 집중이 잘 안 된다. 온몸에 기운이 하나도 없네. 대충 구석에 박혀 있다 가야지… )",
      "condition": {
        "dopamineState": "LOW"
      },
      "id": 6
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(그나저나 동아리는 처음이라 엄청 긴장되네…)",
      "id": 7
    },
    {
      "type": "dialogue",
      "speaker": "독백",
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
      "text": "(수진이 저 끝에 앉아있다.)",
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
      "text": "(운명인가?)",
      "id": 14
    },
    {
      "type": "choice",
      "prompt": "(운명인가?)",
      "choices": [
        {
          "text": "(수진의 옆자리에 앉는다)",
          "follow": [],
          "effects": {
            "dopamine": 7
          },
          "sound": {
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
            "dopamine": 3
          },
          "sound": {
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
          "text": "(당연히 기억 못하겠지) 안녕하세요~ 건축학과 000입니다",
          "follow": [],
          "nextNode": 19
        },
        {
          "text": "그때 혹시 편의점… 기억하세요?",
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
            }
          ],
          "effects": {
            "dopamine": 7
          },
          "nextNode": 19
        }
      ],
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
      "text": "저는 피아노과 윤수진이에요. 무대제작부로 지원했어요!",
      "id": 20
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(헉 나도 무대제작부인데… 이런 우연이!!)",
      "id": 21
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "오 저도 무대제작부에요!",
      "id": 22
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 23
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "건축학과시면 무대 제작 잘하시겠다!",
      "id": 24
    },
    {
      "type": "choice",
      "prompt": "건축학과시면 무대 제작 잘하시겠다!",
      "choices": [
        {
          "text": "아니에요. 직접 해본 적은 없어요ㅎㅎ",
          "follow": [],
          "nextNode": 26
        },
        {
          "text": "무대 만드는 건 처음이에요…",
          "follow": [],
          "nextNode": 26
        }
      ],
      "id": 25
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 26
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "(싱긋 웃으며) 그래도 든든하다. 앞으로 잘 해봐요!",
      "id": 27
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "crowd",
      "id": 28
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "(시끄러운 소리가 들린다)",
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
      "text": "야, 황건호! 여기 무대부 신입들은 벌써 도란도란 친해진 거 같은데?",
      "id": 31
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Happy",
      "id": 32
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "안녕하세요! 저는 연기부 신입 1학년 김혜지에요! 우리 다 동기 맞지?",
      "id": 33
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Happy",
      "id": 34
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "어, 윤수진! 너 아까 음료수 사러 간다더니 여기 있었어?",
      "id": 35
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Happy",
      "id": 36
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "안녕, 나도 이번에 무대부 신입으로 들어왔어. 잘 부탁해!",
      "id": 37
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Surprised",
      "id": 38
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아, 깜짝이야! 건호 너 언제 왔어?",
      "id": 39
    },
    {
      "type": "choice",
      "prompt": "아, 깜짝이야! 건호 너 언제 왔어?",
      "choices": [
        {
          "text": "두 분은 원래 아는 사이에요?",
          "follow": [],
          "nextNode": 41
        },
        {
          "text": "수진 씨는 친구가 많네요…",
          "follow": [],
          "nextNode": 41
        }
      ],
      "id": 40
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 41
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "건호는 제 고등학교 동창인데 어쩌다보니 동아리도 같이 들어왔어요.",
      "id": 42
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 43
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "건호야, 이쪽은 건축학과 OO님이야.",
      "id": 44
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Surprised",
      "id": 45
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "오, 건축학과! 대박이다.",
      "id": 46
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Happy",
      "id": 47
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "난 몸 쓰는 거 말곤 젬병인데 도면 같은 건 OO이 네가 다 짜주는 거지? 든든하다 야!",
      "id": 48
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(고등학교 동창? 되게 편해 보이네. 신경 쓰이게…)",
      "id": 49
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 50
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "OO님, 건호 얘 운동하는 애라 목소리만 크지 착해요.",
      "id": 51
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 52
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "너무 부담 갖지 마요, 알았죠?",
      "id": 53
    },
    {
      "type": "choice",
      "prompt": "너무 부담 갖지 마요, 알았죠?",
      "choices": [
        {
          "text": "활발하시고 좋네요.... (피곤하다)",
          "follow": [
            {
              "speaker": "수진",
              "text": "하하, 맞아요. 건호가 원래 저래요."
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 55
        },
        {
          "text": "네.... 에너지가 조금 많이 넘치시네요....",
          "follow": [
            {
              "speaker": "수진",
              "text": "OO씨 기 빨렸죠?"
            },
            {
              "speaker": "수진",
              "text": "저도 가끔 그래요."
            },
            {
              "speaker": "건호",
              "text": "야! 내가 무슨 발전기냐?"
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 55
        },
        {
          "text": "걱정 마세요ㅎㅎ",
          "follow": [],
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 55
        },
        {
          "text": "네, 저희 다같이 잘 지내봐요~",
          "follow": [],
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 55
        },
        {
          "text": "두 분 되게 친해 보이시네요?!!?",
          "follow": [
            {
              "speaker": "수진",
              "text": "아, 워낙 오래 알아서 그런가봐요..ㅎㅎ"
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "nextNode": 55
        },
        {
          "text": "전 또 남자친구인 줄 알았네요.",
          "follow": [
            {
              "speaker": "수진",
              "text": "네???"
            },
            {
              "speaker": "수진",
              "text": "쟤랑요?"
            },
            {
              "speaker": "건호",
              "text": "야, 왜 그렇게 놀라는데!"
            },
            {
              "speaker": "수진",
              "text": "아무튼 아니에요. 진짜 아니에요."
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "nextNode": 55
        }
      ],
      "id": 54
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Normal",
      "id": 55
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "암튼! 이렇게 만난 것도 인연인데! 앞으로 동아리 잘 해보자~",
      "id": 56
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 57
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "그래! 기대된다 ㅎㅎ",
      "id": 58
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(수진씨… 예쁘다)",
      "id": 59
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 60
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(…내 첫사랑, 정말로 시작되는 건가?)",
      "id": 61
    },
    {
      "type": "clear background",
      "id": 62
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "sideShooter",
      "after": "EP3 동아리 MT",
      "id": 63,
      "options": {
        "difficulty": 0,
        "durationSeconds": 45,
        "tutorial": [
          "슈팅은 45초만 버티면 돼. 마우스를 움직이면 캐릭터도 따라 움직여.",
          "노란 P 캡슐을 먹으면 우측 위 파워 칸이 한 칸 올라가.",
          "원하는 칸에서 우클릭하면 그 기술을 쓸 수 있어.",
          "흡수 기술은 도파민을 크게 낮춰. 속도 증가는 더 빠르게 움직이고 도파민도 조금 더 빨리 낮춰.",
          "적들에게 맞으면 체력이 줄고, 도파민이 증가해.", 
          "체력은 3이고, 체력이 0이되면 그때의 도파민으로 게임이 끝나."
        ]
      }
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
      "transition": "fadeBlack",
      "id": 2
    },
    {
      "type": "clear characters",
      "id": 3
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "ep36",
      "id": 4
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "너네 톡방에 공지 올라온 거 봤어?",
      "id": 5
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "어떤 공지?",
      "id": 6
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "지금 봐봐! 방금 올라왔어.",
      "id": 7
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "오! MT 있구나 우리.",
      "id": 8
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "와 재밌겠다! 갈 거지 너네 다?",
      "id": 9
    },
    {
      "type": "choice",
      "prompt": "와 재밌겠다! 갈 거지 너네 다?",
      "choices": [
        {
          "text": "난 수진이 가면 갈거야.",
          "follow": [
            {
              "speaker": "수진",
              "text": "ㅋㅋㅋ 그래 우리 그럼 같이 가자."
            }
          ],
          "effects": {
            "dopamine": 7
          },
          "nextNode": 11
        },
        {
          "text": "당연히 가야지! 수진아 너도 가자.",
          "follow": [
            {
              "speaker": "수진",
              "text": "좋아좋아!"
            }
          ],
          "effects": {
            "dopamine": 3
          },
          "nextNode": 11
        }
      ],
      "id": 10
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "근데 수진이 너 술 잘 못 먹지 않나?",
      "id": 11
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "음.. 약간?",
      "id": 12
    },
    {
      "type": "choice",
      "prompt": "음.. 약간?",
      "choices": [
        {
          "text": "MT 가서도 적당히만 마시고 우리끼리 놀면 되지 뭐.",
          "follow": [],
          "effects": {
            "dopamine": 3
          },
          "nextNode": 14
        },
        {
          "text": "에이 그래도 MT인데, 술게임도 하고 그래야 재밌지.",
          "follow": [
            {
              "speaker": "건호",
              "text": "술게임 싫어하는 사람들도 있잖아. 자기 스타일대로 즐기는 거지."
            }
          ],
          "effects": {
            "dopamine": 7
          },
          "nextNode": 14
        }
      ],
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "나 그래도 마시려면 마실 수 있으니까 괜찮아.",
      "id": 14
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "그래도 놀다가 힘들면 나한테 얘기해ㅋㅋ",
      "effects": {
        "dopamine": 5
      },
      "id": 15
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "ㅎㅎ그래 고마워.",
      "id": 16
    },
    {
      "type": "background",
      "name": "(CG) MT 장소에 둘러앉은 넷",
      "transition": "fadeBlack",
      "id": 17
    },
    {
      "type": "clear characters",
      "id": 18
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "crowd",
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "모두",
      "text": "건호가 좋아하는 랜덤 게임! 랜덤 게임! 게임 스타트!",
      "id": 20
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "아이엠그라운드 지금부터 시작! 수진 넷!",
      "id": 21
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "?! 아악 집중 안 하고 있었어!",
      "id": 22
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와 수진이 걸렸다!",
      "id": 23
    },
    {
      "type": "background",
      "name": "소주병을 향해 뻗는 수진의 손",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      },
      "id": 1001
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아씨 또 걸렸네ㅜ (잔을 집어든다)",
      "id": 24
    },
    {
      "type": "choice",
      "prompt": "아씨 또 걸렸네ㅜ (잔을 집어든다)",
      "choices": [
        {
          "text": "수진아 집중했어야지!",
          "follow": [],
          "nextNode": 1002
        },
        {
          "text": "수진아 너 괜찮아?",
          "follow": [],
          "nextNode": 1002
        }
      ],
      "id": 25
    },
    {
      "type": "background",
      "name": "소주병을 향해 뻗는 수진의 손을 잡는 건호의 손",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      },
      "id": 1002
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "(잔을 낚아채며) 야야 오늘 수진이 많이 마셨다, 좀 쉬어. (대신 마신다)",
      "effects": {
        "dopamine": 5
      },
      "id": 26
    },
    {
      "type": "background",
      "name": "MT 장소",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      },
      "id": 1003
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "오오 황건호 흑기사 뭐야?",
      "id": 27
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "(건호의 어깨를 툭 치며) 아 뭘 그렇게까지ㅎ 고마워!",
      "id": 28
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(수진이는 건호가 많이 편해보인다. 건호도 수진이를 잘 챙겨준다..)",
      "effects": {
        "dopamine": -5
      },
      "id": 29
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "술 더 가져올게. 소주?맥주?",
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "맥주! 야 그럼 나도 잠깐 화장실.",
      "id": 31
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아 MT 재밌다! 건호랑 혜지 진짜 재밌다, 그지 OO아?",
      "id": 32
    },
    {
      "type": "choice",
      "prompt": "아 MT 재밌다! 건호랑 혜지 진짜 재밌다, 그지 OO아?",
      "choices": [
        {
          "text": "응..ㅎ 좋네",
          "follow": [
            {
              "speaker": "수진",
              "text": "ㅋㅋㅋ OO아 힘들어? 왤케 피곤해보여ㅜ"
            },
            {
              "speaker": "주인공",
              "text": "아 그냥 오늘 하루종일 놀아서ㅎ"
            },
            {
              "speaker": "수진",
              "text": "하긴 오늘 계속 사람 많은 데서 있어서 기빨렸을 수도 있겠다."
            },
            {
              "speaker": "수진",
              "text": "우리 나중에 그럼 넷이서만 한 번 만나서 놀자 어때?"
            },
            {
              "speaker": "주인공",
              "text": "오 좋아!",
              "effects": {
                "affection": 7
              }
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 34
        },
        {
          "text": "응? 뭐라고?",
          "follow": [
            {
              "speaker": "수진",
              "text": "아, 넷이 노니까 너무 재밌다구."
            },
            {
              "speaker": "수진",
              "text": "우리 MT 끝나고도 한 번 만나서 놀자 어때?"
            },
            {
              "speaker": "주인공",
              "text": "오 그래!",
              "effects": {
                "affection": 3
              }
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 36
        },
        {
          "text": "응 그니까 넷이 노니까 재밌다ㅎㅎ",
          "follow": [
            {
              "speaker": "주인공",
              "text": "우리 아예 MT 끝나고 넷이 만나서 놀래?",
              "effects": {
                "affection": 15
              }
            },
            {
              "speaker": "수진",
              "text": "오 완전 좋아! 건호랑 혜지 들어오면 얘기해보자."
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 38
        },
        {
          "text": "그러게, 몇십명이 다 같이 놀다가 이렇게 우리끼리니까 좋다ㅎ",
          "follow": [
            {
              "speaker": "수진",
              "text": "ㅋㅋㅋ그니까 난 여기가 제일 부담없고 좋은 거 같아."
            },
            {
              "speaker": "주인공",
              "text": "나도 동아리에서 네가 제일 편해."
            },
            {
              "speaker": "수진",
              "text": "와 나도!"
            },
            {
              "speaker": "주인공",
              "text": "우리 그럼 MT 끝나고 나중에 둘이 한 번 만나서 놀까?",
              "effects": {
                "affection": 20
              }
            },
            {
              "speaker": "수진",
              "text": "너무 좋지!"
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 40
        },
        {
          "text": "그러게ㅎㅎ 근데 수진아, 우리 MT 끝나고 따로 한 번 또 놀자.",
          "follow": [
            {
              "speaker": "수진",
              "text": "우리 넷이서?"
            },
            {
              "speaker": "주인공",
              "text": "아니 그냥 너랑 나랑.",
              "effects": {
                "affection": 10
              }
            },
            {
              "speaker": "수진",
              "text": "오? 그래 좋아!"
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "nextNode": 42
        },
        {
          "text": "건호랑 혜지? 근데 솔직히 난 건호 좀 오버스러운 거 같긴 해.",
          "follow": [
            {
              "speaker": "수진",
              "text": "아 진짜?"
            },
            {
              "speaker": "주인공",
              "text": "응ㅋㅋ 우리 나중에 둘이서 한 번 놀자."
            },
            {
              "speaker": "수진",
              "text": "오 그것도 좋지!"
            },
            {
              "speaker": "주인공",
              "text": "MT 끝나고 내가 연락 한 번 할게! 약속 잡자.",
              "effects": {
                "affection": 10
              }
            },
            {
              "speaker": "수진",
              "text": "그래 좋아!"
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "effects": {
            "affection": -5
          },
          "nextNode": 44
        }
      ],
      "id": 33
    },
    {
      "type": "clear background",
      "id": 34
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP4-A 넷이",
      "id": 35,
      "options": {
        "maxTurns": 6
      }
    },
    {
      "type": "clear background",
      "id": 36
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP4-A 넷이",
      "id": 37,
      "options": {
        "maxTurns": 6
      }
    },
    {
      "type": "clear background",
      "id": 38
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP4-A 넷이",
      "id": 39,
      "options": {
        "maxTurns": 6
      }
    },
    {
      "type": "clear background",
      "id": 40
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP4-B 둘이",
      "id": 41,
      "options": {
        "maxTurns": 6
      }
    },
    {
      "type": "clear background",
      "id": 42
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP4-B 둘이",
      "id": 43,
      "options": {
        "maxTurns": 6
      }
    },
    {
      "type": "clear background",
      "id": 44
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP4-B 둘이",
      "id": 45,
      "options": {
        "maxTurns": 6
      }
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
      "transition": "fadeBlack",
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
      "text": "다음주 금요일에 그래서 뭐하고 놀아 우리?",
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
      "type": "character in",
      "name": "건호",
      "emotion": "Normal",
      "id": 9
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "○○이스케이프에 XX테마가 진짜 잘 만들었대.",
      "id": 10
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "오 네 명이면 방탈출 딱 좋다.",
      "id": 11
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Flustered",
      "id": 12
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "야 근데 여기 공포방탈출 같은데?",
      "id": 13
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered",
      "id": 14
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "엥 진짜??",
      "id": 15
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Normal",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "아 맞아 좀 무서운 게 들어있다고 하긴 했어.",
      "id": 17
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Frightened",
      "id": 18
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "나 공포방탈출은 싫어..",
      "id": 19
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Normal",
      "id": 20
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "아냐 근데 공포영화 못 보는 내 친구도 해봤는데 괜찮았대.",
      "id": 21
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Normal",
      "id": 22
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "아 진짜? 그럼 나쁘지 않겠다 뭐.",
      "id": 23
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered",
      "id": 24
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "그런가...?",
      "id": 25
    },
    {
      "type": "choice",
      "prompt": "그런가...?",
      "choices": [
        {
          "text": "그래도 수진이 불안한데 그냥 일반 테마로 찾아보는 건 어때?",
          "follow": [
            {
              "speaker": "건호",
              "text": "아 근데 여기 지금 딱 금요일 8시에 자리도 비어서 완벽한데.."
            },
            {
              "speaker": "혜지",
              "text": "그래 한 번 공포테마 해보자 수진아!"
            },
            {
              "speaker": "수진",
              "text": "흠... 그래 알겠어.."
            }
          ],
          "effects": {
            "dopamine": 3
          },
          "nextNode": 27
        },
        {
          "text": "그래 이렇게 같이 할 때 공포 테마도 한 번 해보자 수진아.",
          "follow": [
            {
              "speaker": "건호",
              "text": "충분히 할 만할 거야 진짜로."
            },
            {
              "speaker": "수진",
              "text": "ㅜ알겠어.. 심장 터지면 너네 책임이야."
            }
          ],
          "effects": {
            "dopamine": 7
          },
          "nextNode": 27
        }
      ],
      "id": 26
    },
    {
      "type": "background",
      "name": "공포방탈출 입구",
      "transition": "fadeBlack",
      "id": 27
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "escapeRoom",
      "id": 28
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Flustered",
      "id": 29
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와 여기 분위기 미쳤다..",
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(생각보다 무서운데...?)",
      "id": 31
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Frightened",
      "id": 32
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "야 벌써부터 무서운데 어떡해... 내가 다른 테마 가자고 했잖아!",
      "id": 33
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Normal",
      "id": 34
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "에이~ 방탈출 와서 안 무서우면 재미없지. 걱정 마. 내가 다 풀어줄게.",
      "id": 35
    },
    {
      "type": "dialogue",
      "speaker": "직원",
      "text": "오늘 8시 예약하신 네 분 맞으실까요?",
      "id": 36
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Focused",
      "id": 37
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "넵 맞습니다!",
      "id": 38
    },
    {
      "type": "dialogue",
      "speaker": "직원",
      "text": "안쪽으로 안내 도와드릴게요.",
      "id": 39
    },
    {
      "type": "dialogue",
      "speaker": "직원",
      "text": "아시다시피 저희 테마는 공포 테마여서 갑작스럽게 \n조명이 꺼지거나 큰 소리가 날 수 있다는 점 숙지하시고요,",
      "effects": {
        "dopamine": 3
      },
      "id": 40
    },
    {
      "type": "dialogue",
      "speaker": "직원",
      "text": "예상하지 못한 곳에서 사물이 튀어나오거나 떨어질 수도 있으니 유의하시기 바랍니다.",
      "effects": {
        "dopamine": 3
      },
      "id": 41
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Frightened",
      "id": 42
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "(귓속말로) 어떡해....",
      "id": 43
    },
    {
      "type": "dialogue",
      "speaker": "직원",
      "text": "다들 그러면 준비 되셨을까요?",
      "id": 44
    },
    {
      "type": "choice",
      "prompt": "다들 그러면 준비 되셨을까요?",
      "choices": [
        {
          "text": "네..!",
          "follow": [],
          "nextNode": 46
        },
        {
          "text": "아니요..!",
          "follow": [],
          "nextNode": 46
        }
      ],
      "id": 45
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Happy",
      "id": 46
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "넵!",
      "id": 47
    },
    {
      "type": "dialogue",
      "speaker": "직원",
      "text": "네, 그러면 모두 눈을 감아주시고 저를 따라오시면 되겠습니다.",
      "id": 48
    },
    {
      "type": "background",
      "name": "공포방탈출 내부",
      "transition": "fadeBlack",
      "id": 49
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Frightened",
      "id": 50
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "끄악! 건호야 뭐하는 거야!",
      "id": 51
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Focused",
      "id": 52
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "잠깐만 있어봐 여기 아래 보면 뭐가 있는 거 같단 말야… 찾았다!",
      "id": 53
    },
    {
      "type": "character in",
      "name": "건호",
      "emotion": "Focused",
      "id": 54
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "(발견한 버튼을 누른다)",
      "id": 55
    },
    {
      "type": "background",
      "name": "(CG) 천장에서 귀신이 떨어지는 걸 보고 놀라는 수진",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      },
      "id": 56
    },
    {
      "type": "clear characters",
      "id": 57
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "horror",
      "id": 58
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "으아아악!! (주인공의 팔을 붙잡는다)",
      "effects": {
        "dopamine": 5
      },
      "id": 59
    },
    {
      "type": "choice",
      "prompt": "으아아악!! (주인공의 팔을 붙잡는다)",
      "choices": [
        {
          "text": "(당황해 거리를 두며) 아이구 깜짝아 너무 무섭잖아 여기..",
          "follow": [
            {
              "speaker": "수진",
              "text": "아 그러니까ㅜㅜ 빨리 탈출하자."
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "effects": {
            "affection": 5
          },
          "nextNode": 61
        },
        {
          "text": "(당황해 거리를 두며) 어우 야 너 때문에 더 놀랐잖아",
          "follow": [
            {
              "speaker": "수진",
              "text": "아 미안해... 황건호 이거 어떡할 거야!!"
            },
            {
              "speaker": "건호",
              "text": "그래도 저기 문 열렸잖아! 빨리 탈출하자."
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "effects": {
            "affection": -5
          },
          "nextNode": 61
        },
        {
          "text": "(붙잡아주며) 오 괜찮아? 무서운게 너무 많다 여기.. 혹시 힘들면 얘기해 수진아.",
          "follow": [
            {
              "speaker": "수진",
              "text": "아냐 그래도 끝까지 해보긴 해야지.. 빨리 풀어서 탈출하자."
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "effects": {
            "affection": 20
          },
          "nextNode": 61
        },
        {
          "text": "(붙잡아주며) 괜찮아? 옆 방까지 비명 소리 들리겠다ㅋㅋ 그래도 저기 문 열렸어!",
          "follow": [
            {
              "speaker": "수진",
              "text": "ㅎㅎ고마워.. 빨리 가자."
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "effects": {
            "affection": 15
          },
          "nextNode": 61
        },
        {
          "text": "(어깨를 감싸며) 오 괜찮아? 아니 건호가 너무 무서운 데를 찾아왔는데?",
          "follow": [
            {
              "speaker": "수진",
              "text": "그니까ㅜㅜ 내가 다른 테마 가자고 했잖아 건호야."
            },
            {
              "speaker": "건호",
              "text": "아 미안 나도 이 정도일 줄은 몰랐지.. 혹시 너무 힘들면 얘기해 수진아."
            },
            {
              "speaker": "수진",
              "text": "아냐 그래도 끝까지 해보긴 해야지.. 빨리 풀어서 탈출하자."
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "effects": {
            "affection": 10
          },
          "nextNode": 61
        },
        {
          "text": "(붙잡아주며) 오 야야 저기 문 열렸다! 보여?",
          "follow": [
            {
              "speaker": "수진",
              "text": "아 진짜 심장 떨어지는 줄 알았네.."
            },
            {
              "speaker": "건호",
              "text": "아 미안 나도 저렇게 떨어질 줄은 몰랐네 괜찮아?"
            },
            {
              "speaker": "수진",
              "text": "응.. 빨리 넘어가자 저쪽으로."
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "effects": {
            "affection": -5
          },
          "nextNode": 61
        }
      ],
      "id": 60
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "ep14",
      "id": 61
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "와 진짜 죽는 줄 알았네.",
      "id": 62
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "그래도 재밌지 않았어?",
      "id": 63
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "너 때문에 수명 줄었어 진짜",
      "id": 64
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "에이 그래도 마지막 문제 네가 풀었잖아. 수진이 은근 잘해",
      "id": 65
    },
    {
      "type": "choice",
      "prompt": "에이 그래도 마지막 문제 네가 풀었잖아. 수진이 은근 잘해",
      "choices": [
        {
          "text": "맞아 수진이 아니었으면 우리 탈출 못했어",
          "follow": [],
          "nextNode": 67
        },
        {
          "text": "맞아 그거 진짜 어려운 문제였는데 대단해!",
          "follow": [],
          "nextNode": 67
        }
      ],
      "id": 66
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "ㅎ.. 그건 좀 뿌듯하긴 했어",
      "id": 67
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "(수진의 어깨를 두드린다) 다음에도 또 만나서 놀자 얘들아",
      "id": 68
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "좋아!",
      "id": 69
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(건호가 수진이를 대하는 방식이 조금 신경 쓰인다)",
      "id": 70
    },
    {
      "type": "clear background",
      "id": 71
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "sideShooter",
      "after": "EP5 미팅사건",
      "id": 72,
      "options": {
        "difficulty": 1,
        "durationSeconds": 45
      }
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
      "transition": "fadeBlack",
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
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 4
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "OO아, 내일 어디서 만날래?",
      "id": 5
    },
    {
      "type": "choice",
      "prompt": "OO아, 내일 어디서 만날래?",
      "choices": [
        {
          "text": "그러게, 혹시 뭐 먹고 싶은 거 있어?",
          "follow": [
            {
              "speaker": "수진",
              "text": "음.. 다 상관없는데 파스타는 어때?",
              "effects": {
                "dopamine": 3
              }
            },
            {
              "speaker": "주인공",
              "text": "파스타 좋지! 학교 앞에 ○○음식점이 파스타 맛있다던데 어때?"
            },
            {
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
              "speaker": "수진",
              "text": "오 맞아! 내가 말했었나?",
              "effects": {
                "dopamine": 7
              }
            },
            {
              "speaker": "주인공",
              "text": "전에 한 번 얘기했던 거 같애."
            },
            {
              "speaker": "주인공",
              "text": "학교 앞에 ○○음식점이 파스타 맛있다던데 어때?"
            },
            {
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
      "transition": "fadeBlack",
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
              "speaker": "수진",
              "text": "와 기대된다!",
              "effects": {
                "dopamine": 3
              }
            }
          ],
          "nextNode": 14
        },
        {
          "text": "내가 열심히 후기까지 검색해서 찾았지ㅎ",
          "follow": [
            {
              "speaker": "수진",
              "text": "오 뭐야ㅋㅋ 완전 잘 찾았다 너.",
              "effects": {
                "dopamine": 7
              }
            }
          ],
          "nextNode": 14
        }
      ],
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "종업원",
      "text": "주문하신 메뉴 나왔습니다~",
      "id": 14
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "와 잘 먹겠습니다!",
      "id": 15
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "맛있겠다!",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "넌 우리 동아리 어떤 거 같아?",
      "id": 17
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "난 들어오기 너무 잘한 거 같아. 들어와서 건호랑 혜지랑 너도 만나고.",
      "id": 18
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "나도! 처음에는 낯도 많이 가리고 긴장했었는데ㅎ",
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "와 나도.. 내가 새로운 사람 사귀는 게 좀 어색해서.",
      "id": 20
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "네가? 전혀 아닌 거 같은데?",
      "id": 21
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 생각해보니 너랑은 좀 빨리 친해진 거 같기는 하다!",
      "effects": {
        "dopamine": 5
      },
      "id": 22
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그런거야? 다행이네.",
      "id": 23
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 어느새 한 학기가 거의 지났다 OO아.",
      "id": 24
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그러게.. 처음 만난지 얼마 되지도 않은 거 같은데.",
      "id": 25
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "이제 정기공연도 얼마 안 남았는데, 기분 어때?",
      "id": 26
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "나 사실 걱정이 좀 많아..",
      "id": 27
    },
    {
      "type": "choice",
      "prompt": "나 사실 걱정이 좀 많아..",
      "choices": [
        {
          "text": "왜? 피아노과면 그래도 무대 경험 많지 않아?",
          "follow": [],
          "nextNode": 29
        },
        {
          "text": "에이, 너 공연도 엄청 자주 하고 잘 하잖아!",
          "follow": [],
          "nextNode": 29
        }
      ],
      "id": 28
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "피아노도 항상 무대 오르면 떨리는데, 게다가 무대 스태프는 처음이잖아.",
      "id": 29
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "음 그럴 수 있겠다.",
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "무대는 항상 완벽하게 하고 싶은 욕심이 커서 공연 앞두고 맨날 예민해지고..",
      "id": 31
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "네가 피아노도, 연극도 다 진심으로 해서 그래. 그니까 더 잘하고 멋있는거지.",
      "id": 32
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "ㅎㅎ 그런 얘기는 처음 들어보는데. 고마워.",
      "effects": {
        "dopamine": 5
      },
      "id": 33
    },
    {
      "type": "background",
      "name": "(CG) 파스타집을 나와 걸어가는 주인공과 수진",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      },
      "id": 34
    },
    {
      "type": "clear characters",
      "id": 35
    },
    {
      "type": "background",
      "name": "길거리",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right",
        "slideDuration": 900
      },
      "id": 36
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 37
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 OO아, 나 궁금한 거 있어.",
      "id": 38
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "음? 뭔데?",
      "id": 39
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 40
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "오늘 만날 때 왜 건호랑 혜지랑 같이 보는게 아니라 우리 둘이 보자고 한거야?",
      "effects": {
        "dopamine": 5
      },
      "id": 41
    },
    {
      "type": "choice",
      "prompt": "오늘 만날 때 왜 건호랑 혜지랑 같이 보는게 아니라 우리 둘이 보자고 한거야?",
      "choices": [
        {
          "text": "아… 음 그냥 뭐 건호랑 혜지는 바쁜 거 같아서..",
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
          "condition": {
            "dopamineState": "LOW"
          },
          "effects": {
            "affection": 5
          },
          "nextNode": 43
        },
        {
          "text": "아 그냥 둘이서 봐도 좋을 거 같아서..? 별 생각은 없었어.",
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
          "condition": {
            "dopamineState": "LOW"
          },
          "effects": {
            "affection": 3
          },
          "nextNode": 43
        },
        {
          "text": "둘이 있으면 좀 더 대화도 길게 할 수 있고 좋잖아.",
          "follow": [
            {
              "speaker": "수진",
              "text": "아 그렇구나! 그러게, 나도 오늘 이렇게 얘기 많이 해서 좋은 거 같아."
            },
            {
              "speaker": "주인공",
              "text": "우리 다음에도 또 보자!"
            },
            {
              "speaker": "수진",
              "text": "좋아! 우리 공연도 화이팅!"
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "effects": {
            "affection": 15
          },
          "nextNode": 43
        },
        {
          "text": "너랑 단둘이도 만나보고 싶었거든. 우리 맨날 넷이서만 봤잖아.",
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
          "condition": {
            "dopamineState": "OPT"
          },
          "effects": {
            "affection": 20
          },
          "nextNode": 43
        },
        {
          "text": "너랑 데이트하고 싶었거든ㅎ",
          "follow": [
            {
              "speaker": "수진",
              "text": "아? 갑자기 왜 그래ㅋㅋ"
            },
            {
              "speaker": "주인공",
              "text": "둘이어도 오늘 재밌지 않았어?"
            },
            {
              "speaker": "수진",
              "text": "응 괜찮았어. 다음주에 봐!"
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "effects": {
            "affection": 10
          },
          "nextNode": 43
        },
        {
          "text": "왜? 혹시 어색하거나 그랬어?",
          "follow": [
            {
              "speaker": "수진",
              "text": "아 아냐아냐 그냥 궁금해서 물어봤어."
            },
            {
              "speaker": "수진",
              "text": "오늘 재밌었어! 우리 다음주에 보자 그럼."
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "effects": {
            "affection": 5
          },
          "nextNode": 43
        }
      ],
      "id": 42
    },
    {
      "type": "clear background",
      "id": 43
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
      "id": 44
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
      "transition": "fadeBlack",
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
      "speaker": "독백",
      "text": "(공강인데 동아리방 가볼까? 수진이 있으려나?)",
      "id": 4
    },
    {
      "type": "background",
      "name": "동아리방",
      "transition": "fadeBlack",
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
      "text": "야, 대학와서 미팅 한 번 쯤은 해봐야지!",
      "effects": {
        "dopamine": 3
      },
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(잠시만.. 수진이가 미팅 나간다고?)",
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
      "text": "OO이 왔네, 안녕",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "어.. 안녕",
      "id": 17
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Happy",
      "id": 18
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "야 OO아, 수진이 이번 주에 미팅 나간대!",
      "effects": {
        "dopamine": 5
      },
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아.. 진짜?",
      "id": 20
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Focused",
      "id": 21
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아니, 그냥 친구가 대타 필요하다고 계속 부탁해서..",
      "id": 22
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered",
      "id": 23
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "나도 막 가고 싶은 거 아닌데..",
      "id": 24
    },
    {
      "type": "character in",
      "name": "혜지",
      "emotion": "Happy",
      "id": 25
    },
    {
      "type": "dialogue",
      "speaker": "혜지",
      "text": "근데 은근 그런 생각지도 못한 곳에서 잘 된다니까?",
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
      "text": "와, 나 곧 수업 시작이다. 갈게, 잘해 봐!!",
      "id": 28
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Flustered",
      "id": 29
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "에이 무슨 소리야ㅠ",
      "id": 30
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "(혜지가 가고 둘만 남는다)",
      "id": 31
    },
    {
      "type": "choice",
      "prompt": "(혜지가 가고 둘만 남는다)",
      "choices": [
        {
          "text": "(말을 돌리며) 오늘 날씨가 참 꿀꿀하네..",
          "follow": [
            {
              "speaker": "수진",
              "text": "아..? 그런가"
            },
            {
              "speaker": "주인공",
              "text": "아 맞다, 나도 친구 만나기로 해서 먼저 가볼게..!"
            },
            {
              "speaker": "수진",
              "text": "음? 응 잘가.."
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 33
        },
        {
          "text": "(무덤덤하게) 에이, 미팅은 뭐 그냥 재미로 나가는 거지",
          "follow": [
            {
              "speaker": "수진",
              "text": "그지, 진짜 어쩔 수 없이 나가는 거라."
            },
            {
              "speaker": "주인공",
              "text": "미팅 한 번쯤 대학 온 김에 나가볼 수 있지"
            },
            {
              "speaker": "수진",
              "text": "미팅에서 진짜 잘될 일 없어ㅠ"
            },
            {
              "speaker": "주인공",
              "text": "ㅋㅋㅋ그래"
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "effects": {
            "affection": 5
          },
          "nextNode": 33
        },
        {
          "text": "미팅, 가고 싶은거야?",
          "follow": [
            {
              "speaker": "수진",
              "text": "아냐 막 가고 싶은 건 아닌데.."
            },
            {
              "speaker": "주인공",
              "text": "가기 싫으면 안 가도 좋지만 재미삼아 나가봐도 상관없지 뭐",
              "effects": {
                "affection": 10
              }
            },
            {
              "speaker": "수진",
              "text": "나도 잘 모르겠어.. 고민 좀 해봐야지."
            },
            {
              "speaker": "주인공",
              "text": "그래 뭐 네 선택이니까 편하게 생각해."
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 33
        },
        {
          "text": "너 정말 미팅 나가?",
          "follow": [
            {
              "speaker": "수진",
              "text": "응 그럴 거 같아.. 대타 때문에 진짜 어쩔 수 없는 거라."
            },
            {
              "speaker": "주인공",
              "text": "아 그래? 혹시나 뭐.. 미팅에서 너무 취하면 얘기하고, 위험할 수도 있으니까.",
              "effects": {
                "affection": 20
              }
            },
            {
              "speaker": "수진",
              "text": "어? 어.. 고마워"
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 33
        },
        {
          "text": "(살짝 삐진 목소리로).. 꼭 가야하는 거야?",
          "follow": [
            {
              "speaker": "수진",
              "text": "대타 때문에 진짜 어쩔 수 없이 나가는 거라ㅠ"
            },
            {
              "speaker": "주인공",
              "text": "조금 서운하네ㅎㅎ",
              "effects": {
                "affection": 5
              }
            },
            {
              "speaker": "수진",
              "text": "....응?"
            },
            {
              "speaker": "주인공",
              "text": "아 장난이야ㅎ"
            },
            {
              "speaker": "수진",
              "text": "어? 알겠..어."
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "nextNode": 33
        },
        {
          "text": "(당황하며 빠르게) 조금 너무하다",
          "follow": [
            {
              "speaker": "수진",
              "text": "(당황하며) 미팅은 진짜 어쩔 수 없이 나가는 거야."
            },
            {
              "speaker": "주인공",
              "text": "(까칠하게) 됐다. 그냥 재밌게 놀다 와",
              "effects": {
                "affection": -10
              }
            },
            {
              "speaker": "수진",
              "text": "뭐야, 내가 알아서 할게!"
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "nextNode": 33
        }
      ],
      "id": 32
    },
    {
      "type": "background",
      "name": "카톡방 화면",
      "transition": "fadeBlack",
      "id": 33
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Happy",
      "id": 34
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "나 미팅 안 나가기로 했어!",
      "id": 35
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "어? 왜?",
      "id": 36
    },
    {
      "type": "character in",
      "name": "수진",
      "emotion": "Normal",
      "id": 37
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "생각해보니까 괜히 더 피곤할 것 같아서ㅋㅋ 공연 준비도 해야하고",
      "id": 38
    },
    {
      "type": "choice",
      "prompt": "생각해보니까 괜히 더 피곤할 것 같아서ㅋㅋ 공연 준비도 해야하고",
      "choices": [
        {
          "text": "잘됐다..! 다행이야",
          "follow": [
            {
              "speaker": "수진",
              "text": "ㅋㅋㅋㅋㅋ너는 왜 다행이야"
            },
            {
              "speaker": "주인공",
              "text": "아 그냥..ㅎㅎ 마음이 조금 놓이네"
            },
            {
              "speaker": "수진",
              "text": "뭐야..ㅋㅋ 공연날 보자!"
            },
            {
              "speaker": "주인공",
              "text": "응! 컨디션 관리 잘하고!"
            }
          ],
          "nextNode": 40
        },
        {
          "text": "맞아, 솔직히 공연 다가오는데 미팅 좀 그렇다고 생각했어.",
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
              "text": "응응!"
            }
          ],
          "nextNode": 40
        }
      ],
      "id": 39
    },
    {
      "type": "clear background",
      "id": 40
    },
    {
      "type": "move",
      "next": "MINIGAME",
      "minigame": "brickBreaker",
      "after": "EP6 정기공연",
      "id": 41,
      "options": {
        "maxTurns": 6
      }
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
      "transition": "fadeBlack",
      "id": 2
    },
    {
      "type": "clear characters",
      "id": 3
    },
    {
      "type": "sound",
      "soundType": "bgm",
      "action": "play",
      "name": "ep36",
      "id": 4
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "(귓속말로) 오늘 순조롭게 잘되고 있다!",
      "id": 5
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그러게 다행이다.. 얼른 무사히 끝났으면!",
      "id": 6
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "running",
      "id": 7
    },
    {
      "type": "dialogue",
      "speaker": "건호",
      "text": "큰일났어요, 2막 문 세트 나사 빠졌어요!",
      "id": 8
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "...뭐?",
      "id": 9
    },
    {
      "type": "dialogue",
      "speaker": "선배1",
      "text": "그거 누구 담당이지..?",
      "id": 10
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "저요..",
      "id": 11
    },
    {
      "type": "dialogue",
      "speaker": "선배1",
      "text": "공연 당일에 이런 실수가 나오는게 말이 돼!",
      "effects": {
        "dopamine": 5
      },
      "id": 12
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "죄송합니다..!",
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "선배1",
      "text": "지금 고쳐야 돼, 빨리!",
      "id": 14
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "네, 선배!",
      "id": 15
    },
    {
      "type": "sound",
      "soundType": "effect",
      "action": "play",
      "name": "running",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "(공구박스를 들고 백스테이지로 달려간다)",
      "effects": {
        "dopamine": 5
      },
      "id": 17
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "드라이버 좀!",
      "id": 18
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "여기.",
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "선배1",
      "text": "1분 뒤 세트 들어간다!",
      "id": 20
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아 이게 왜 안들어가지..",
      "id": 21
    },
    {
      "type": "choice",
      "prompt": "아 이게 왜 안들어가지..",
      "choices": [
        {
          "text": "나사를 이쪽으로 좀 더 세게 돌려봐봐",
          "follow": [
            {
              "speaker": "수진",
              "text": "어, 알았어.."
            },
            {
              "speaker": "수진",
              "text": "와 됐다!",
              "sound": {
                "soundType": "effect",
                "action": "play",
                "name": "screwdriver"
              }
            },
            {
              "speaker": "주인공",
              "text": "휴..다행이다, 해결됐어요 선배."
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "nextNode": 23
        },
        {
          "text": "내가 이쪽 잡아줄게.",
          "follow": [
            {
              "speaker": "수진",
              "text": "고마워.. 아 제발.."
            },
            {
              "speaker": "수진",
              "text": "휴 됐다..!",
              "sound": {
                "soundType": "effect",
                "action": "play",
                "name": "screwdriver"
              }
            },
            {
              "speaker": "주인공",
              "text": "다행이다!"
            }
          ],
          "condition": {
            "dopamineState": "LOW"
          },
          "effects": {
            "affection": 5
          },
          "nextNode": 23
        },
        {
          "text": "내가 잘 잡고 있을게, 차분하게 하면 돼.",
          "follow": [
            {
              "speaker": "수진",
              "text": "고마워ㅜ 제발.."
            },
            {
              "speaker": "수진",
              "text": "아 됐다! (하이파이브를 하며 웃는다)",
              "sound": {
                "soundType": "effect",
                "action": "play",
                "name": "screwdriver"
              }
            },
            {
              "speaker": "주인공",
              "text": "다행이다, 수고했어!"
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "effects": {
            "affection": 15
          },
          "nextNode": 23
        },
        {
          "text": "내가 해볼게, 이거 잘 잡고 있어줘.",
          "follow": [
            {
              "speaker": "수진",
              "text": "어, 여기 구멍에 넣으면 돼!"
            },
            {
              "speaker": "주인공",
              "text": "(드르륵, 나사를 넣는다) 오 됐다!",
              "effects": {
                "affection": 20
              },
              "sound": {
                "soundType": "effect",
                "action": "play",
                "name": "screwdriver"
              }
            },
            {
              "speaker": "수진",
              "text": "와 정말 다행이다ㅠ 고마워!"
            },
            {
              "speaker": "주인공",
              "text": "아냐, 선배 여기 됐어요!"
            }
          ],
          "condition": {
            "dopamineState": "OPT"
          },
          "nextNode": 23
        },
        {
          "text": "이리줘 내가 할게, 이거 잘 잡고 있어봐.",
          "follow": [
            {
              "speaker": "수진",
              "text": "어, 여기 구멍에 넣으면 돼!"
            },
            {
              "speaker": "주인공",
              "text": "(드르륵, 나사를 넣는다) 오 됐다!",
              "effects": {
                "affection": 10
              },
              "sound": {
                "soundType": "effect",
                "action": "play",
                "name": "screwdriver"
              }
            },
            {
              "speaker": "수진",
              "text": "와 정말 다행이다ㅠ 고마워!"
            },
            {
              "speaker": "주인공",
              "text": "아니야, 선배 여기있어요!"
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "nextNode": 23
        },
        {
          "text": "(불안해하며) 아 어떡하지.. 곧 시작인데",
          "follow": [
            {
              "speaker": "수진",
              "text": "제발.."
            },
            {
              "speaker": "주인공",
              "text": "빨리 넣어봐, 곧 시작이야!"
            },
            {
              "speaker": "수진",
              "text": "와 드디어 됐다! 선배 여기요!",
              "sound": {
                "soundType": "effect",
                "action": "play",
                "name": "screwdriver"
              }
            },
            {
              "speaker": "주인공",
              "text": "와 다행이다!"
            }
          ],
          "condition": {
            "dopamineState": "HIGH"
          },
          "effects": {
            "affection": -5
          },
          "nextNode": 23
        }
      ],
      "id": 22
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "와 진짜 심장 떨어지는 줄..",
      "id": 23
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "어..(수진이 울먹거리며 눈물을 흘린다)",
      "id": 24
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "수진아.. 울어?",
      "id": 25
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아 너무 긴장했나봐, 나도 모르게 눈물이 나오네..",
      "id": 26
    },
    {
      "type": "choice",
      "prompt": "아 너무 긴장했나봐, 나도 모르게 눈물이 나오네..",
      "choices": [
        {
          "text": "(수진을 토닥여 준다) 무대 전에 돌발상황 생길 수 있지, 네 탓 아니야.",
          "follow": [],
          "nextNode": 28
        },
        {
          "text": "(휴지를 건네 준 후 다른 곳을 본다)",
          "follow": [],
          "nextNode": 28
        }
      ],
      "id": 27
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "OO아 정말 고마워...",
      "id": 28
    },
    {
      "type": "clear background",
      "id": 29
    },
    {
      "type": "move",
      "next": "해피엔딩",
      "condition": {
        "affectionMin": 60
      },
      "id": 30
    },
    {
      "type": "clear background",
      "id": 31
    },
    {
      "type": "move",
      "next": "베드엔딩",
      "id": 32
    }
  ],
  "해피엔딩": [
    {
      "type": "scene reset",
      "id": 1
    },
    {
      "type": "background",
      "name": "(CG) 텅 빈 밤길을 걸어가는 둘",
      "transition": "fadeBlack",
      "id": 2
    },
    {
      "type": "clear characters",
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
      "text": "와... 오늘 하루 진짜 길었다.",
      "id": 5
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "그러게..",
      "id": 6
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아깐 너무 무서웠어. 내가 실수해서 공연 망가질까봐.",
      "id": 7
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "그래도 네가 옆에 있어서 좀 안심됐어ㅎ",
      "id": 8
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "내가 도움이 되었다니 다행이다..",
      "id": 9
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "정말 고마워 OO아.",
      "id": 10
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아니야, 너도 진짜 수고 많았어.",
      "id": 11
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "이제 공연도 다 끝나고... 우리 앞으로 한동안 볼 일이 없으려나?",
      "id": 12
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "왜? 계속 보면 되잖아",
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "지시문",
      "text": "(잠시 수진을 바라본다)",
      "id": 14
    },
    {
      "type": "choice",
      "prompt": "(잠시 수진을 바라본다)",
      "choices": [
        {
          "text": "아무래도 동아리 끝나면 볼 기회가 줄어들지 않을까?",
          "follow": [
            {
              "speaker": "수진",
              "text": "에이 우리는 계속 만나면 되지."
            },
            {
              "speaker": "주인공",
              "text": "정말..?"
            }
          ],
          "nextNode": 16
        },
        {
          "text": "사실.. 난 너 동아리 끝나도 계속 보고싶어",
          "follow": [
            {
              "speaker": "수진",
              "text": "뭐야 갑자기 부끄럽게..ㅎㅎ"
            }
          ],
          "nextNode": 16
        }
      ],
      "id": 15
    },
    {
      "type": "background",
      "name": "(CG) 서로 바라보는 둘",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      },
      "id": 16
    },
    {
      "type": "clear characters",
      "id": 17
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "수진아.. 사실 나 너 좋아하는데, 너는 나 어때?",
      "id": 18
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "(수진이 걸음을 멈춘다.)",
      "id": 19
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "나도 너.. 좋아해!",
      "id": 20
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(헉!)",
      "id": 21
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "뭘 그렇게 놀라ㅋㅋ",
      "id": 22
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아니.. 다행이다ㅎ 너무 좋다.",
      "id": 23
    },
    {
      "type": "background",
      "name": "(CG) 손을 잡는 둘",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      },
      "id": 24
    },
    {
      "type": "clear characters",
      "id": 25
    },
    {
      "type": "clear background",
      "id": 26
    },
    {
      "type": "dialogue",
      "speaker": "END",
      "text": "해피엔딩",
      "id": 27
    }
  ],
  "베드엔딩": [
    {
      "type": "scene reset",
      "id": 1
    },
    {
      "type": "background",
      "name": "(CG) 텅 빈 밤길을 걸어가는 둘",
      "transition": "fadeBlack",
      "id": 2
    },
    {
      "type": "clear characters",
      "id": 3
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "수진아, 잠깐 얘기할 수 있을까?",
      "id": 4
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "어? 어..",
      "id": 5
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "아까부터 하려고 했던 말인데..",
      "id": 6
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "사실.. 나 너 좋아해.",
      "id": 7
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "(수진이 어색하게 웃는다) ..아, 아하하 어..",
      "id": 8
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "너무 갑작스러웠지.. 근데 공연 끝나면 더 말 못할 것 같아서..",
      "id": 9
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "조금 생각할 시간을 줄까?",
      "id": 10
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "아니야, 음 그게 나는... 미안해.",
      "id": 11
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "OO아, 너는 정말 좋은 사람이야,",
      "id": 12
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "같이 공연 준비하면서도 엄청 의지됐고..",
      "id": 13
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "(애써 웃는다) 아.. 어..",
      "id": 14
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "근데 나는.. 그냥 너를 좋은 동아리 사람으로 생각했던 것 같아.",
      "id": 15
    },
    {
      "type": "dialogue",
      "speaker": "주인공",
      "text": "..그렇구나.",
      "id": 16
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "우리 동아리에서 어색해지진 말자..!",
      "id": 17
    },
    {
      "type": "choice",
      "prompt": "우리 동아리에서 어색해지진 말자..!",
      "choices": [
        {
          "text": "그래.. 그럼 그냥 친구로 지내자..!",
          "follow": [],
          "nextNode": 19
        },
        {
          "text": "음.. 그냥 이제 볼일 없을거야..",
          "follow": [],
          "nextNode": 19
        }
      ],
      "id": 18
    },
    {
      "type": "dialogue",
      "speaker": "수진",
      "text": "먼저 갈게..",
      "id": 19
    },
    {
      "type": "background",
      "name": "(CG) 혼자 남은 주인공)",
      "transition": {
        "type": "fadeSlide",
        "duration": 700,
        "direction": "right"
      },
      "id": 20
    },
    {
      "type": "clear characters",
      "id": 21
    },
    {
      "type": "dialogue",
      "speaker": "독백",
      "text": "(..어디서부터 잘못된 걸까.., 분명 처음엔 좋았는데..)",
      "id": 22
    },
    {
      "type": "clear background",
      "id": 23
    },
    {
      "type": "dialogue",
      "speaker": "END",
      "text": "베드엔딩",
      "id": 24
    }
  ]
};
