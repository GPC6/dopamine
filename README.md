# 시나리오 룰

## EP 단위

전체 시나리오는 EP 단위로 관리된다.
EP의 구분은 미니게임 전에 끝내야 하고, 그외에는 자유롭게 구분한다.

## 노드

각 EP는 노드로 구성되어 있다.
노드는 배경 노드, 인물 노드, 대화 노드, 선택지 노드, 이동 노드, 초기화 노드로 구성된다.

### 공통 조건

모든 노드와 선택지는 `condition`을 가질 수 있다.
조건이 없으면 항상 실행된다.
조건이 있으면 모든 조건을 만족할 때만 실행된다.

사용 가능한 조건은 다음과 같다.
- `dopamineMin`: 도파민 최소값
- `dopamineMax`: 도파민 최대값
- `affectionMin`: 호감도 최소값
- `affectionMax`: 호감도 최대값

예시:

```js
condition: {
  dopamineMin: 40,
  affectionMin: 20
}
```

### 인물 노드 (character in/out)

캐릭터를 등장시키거나 퇴장시키는 노드이다.
캐릭터의 감정을 변화시킬 때도 사용한다.
다음의 정보가 필요하다.
- 등장 퇴장 여부
- 캐릭터 이름
- 감정


### 배경 노드 (background)

배경을 변화시킬 때 쓰는 노드이다.
배경 파일의 이름이 들어간다.

### 초기화 노드

화면에 남아 있는 캐릭터나 배경을 정리할 때 사용한다.

- `clear characters`: 모든 캐릭터 퇴장
- `clear background`: 현재 배경 제거
- `scene reset`: 캐릭터와 배경을 모두 제거


### 대화 노드 (dialogue)

한 대화 노드는 한 발화를 담고 있다.
노드는 기본적으로 순서대로 진행된다. (조건이 따로 없을 시)
각 대화 노드에 필요한 정보는 다음과 같다.
- 발화자
- 발화 내용
- (특정 노드를 수치에 따라 발현해야할 시) 노드 발현 조건


### 선택지 노드 (choice)

선택지 노드는 질문 프롬프트와 선택지로 구성된다.
각 선택지에는 다음을 포함해야 한다.
- 선택 내용
- 선택 직후 이어지는 대사 목록
- 호감도나 도파민 등의 수치 변화량
- (조건 선택지인 경우) 조건
- 다음으로 이동할 노드, EP 혹은 미니게임 (선택지에 따라 특정 EP를 건너뛸 수도 있기 때문)

선택지 하단에 `ㄴ`으로 표시된 대사는 선택지 버튼 문구가 아니라, 선택 직후 이어지는 발화이다.
이 대사는 선택지의 `follow`에 넣는다.

예시:

```js
{
  text: "여기 앉아도 될까요?",
  effects: { affection: 15 },
  follow: [
    { speaker: "수진", text: "네~" },
    { speaker: "주인공", text: "저는 건축학과 000이라고 합니다." }
  ],
  next: "EP2_AFTER_CHOICE"
}
```


### 이동 노드 (move)

대화 노드 이후 EP를 넘길 때 사용하는 노드이다.
어떠한 에피로 이동할지만 정하면 된다.
조건을 걸어 이동할 수 있다.

예시:

```js
{
  type: "move",
  next: "EP3",
  condition: { affectionMin: 30 }
}
```

미니게임으로 이동할 때는 `next`에 `"MINIGAME"`을 넣고, `minigame`에 실행할 서브게임 ID를 넣는다.

예시:

```js
{
  type: "move",
  next: "MINIGAME",
  minigame: "brickBreaker"
}
```

선택지에서 미니게임으로 이동할 때도 같은 방식으로 작성한다.

```js
{
  text: "벽돌깨기 시작",
  next: "MINIGAME",
  minigame: "brickBreaker"
}
```


## 미니게임

미니게임은 EP와 별도로 구분된다.
## 노드 ID 이동 규칙

웹 편집기에서는 각 에피소드 안의 노드에 `1, 2, 3...` 같은 자연수 ID를 붙인다. 코드에서는 `EP1#3`처럼 `에피소드 ID + 노드 ID` 조합으로 고유하게 해석한다.

선택지는 에피소드를 직접 선택하지 않는다. 선택지에는 `nextNode`만 넣고, 실제 에피소드 이동은 반드시 `move` 노드에서 처리한다.

```js
{
  id: 5,
  type: "choice",
  prompt: "무엇을 할까?",
  choices: [
    {
      text: "따라간다",
      nextNode: 6
    }
  ]
},
{
  id: 6,
  type: "move",
  next: "EP2"
}
```

선택지 직후에만 나오는 추가 발화는 `follow`에 넣는다. `follow` 발화가 모두 끝나면 `nextNode`로 이동한다.

```js
{
  text: "괜찮냐고 묻는다",
  follow: [
    { speaker: "주인공", text: "괜찮아?" }
  ],
  nextNode: 12
}
```

미니게임도 선택지에서 직접 실행하지 않는다. 선택지는 미니게임 `move` 노드의 `id`를 고르고, 그 `move` 노드가 미니게임과 복귀 에피소드를 지정한다.

```js
{
  id: 12,
  type: "move",
  next: "MINIGAME",
  minigame: "sideShooter",
  after: "EP3"
}
```

선택지 이후에 모든 분기가 다시 합쳐지는 공통 발화는 별도 `AFTER_CHOICE` 에피소드로 빼지 않는다. 본 에피소드 안에 공통 노드로 이어 붙이고, 각 선택지가 그 공통 노드의 `nextNode`를 가리키게 한다. 에피소드가 바뀌어야 하는 순간에만 공통 노드 뒤쪽에 `move` 노드를 둔다.
## 테스트 실행 흐름

편집기 상단의 `테스트 적용` 버튼을 누르면 현재 편집 중인 스토리가 브라우저 `localStorage`에 저장되고, `gametest/index.html`이 새 탭으로 열립니다.

`gametest` 안의 엔진은 시작할 때 `localStorage`에 저장된 테스트 스토리를 먼저 읽습니다. 저장된 테스트 스토리가 없으면 `gametest/story-data-scenario3.js`를 기본값으로 사용합니다.

GitHub Pages에서는 `story-editor/index.html`과 `story-editor/gametest/index.html`이 같은 사이트 안에 있으므로 같은 `localStorage`를 공유합니다. 그래서 편집기에서 저장한 내용을 테스트 엔진이 바로 읽을 수 있습니다.
