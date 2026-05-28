# 도파민때문에

`도파민때문에`는 p5.js로 만든 스토리 선택형 미니게임입니다.  
플레이어는 대사를 읽고 선택지를 고르며, 선택 결과로 `dopamine`과 `affection` 수치가 바뀝니다. 중간의 미니게임 결과까지 반영한 뒤 최종 엔딩이 결정됩니다.

## 실행 방법

`index.html`을 브라우저로 열면 바로 실행됩니다.

p5.js는 `libraries/` 폴더의 로컬 파일을 사용합니다.

## 파일 구조

```text
도파민때문에/
  index.html       실행 파일. p5.js와 게임 JS 파일을 순서대로 불러온다.
  styles.css       캔버스와 페이지 기본 스타일.
  config.js        캔버스 크기, 초기값, 노드 타입, 에셋 목록.
  story-data.js    에피소드, 대사, 선택지, 선택 효과 데이터.
  ui.js            Button, TextBox, BackgroundImage, CharacterImage 같은 화면 객체.
  sub_games/       클래스형 p5.js 서브게임 파일.
  game.js          전체 게임 상태, 장면 전환, 선택지 처리, 엔딩 판정.
  sketch.js        p5.js의 setup/draw/mousePressed를 Game 객체에 연결.
```

## 노드 ID 기반 이동 구조

이제 선택지는 에피소드를 직접 고르지 않습니다. 선택지는 항상 현재 에피소드 안의 자연수 노드 ID만 고르고, 에피소드 이동이나 미니게임 진입은 `move` 노드만 담당합니다.

```js
{
  id: 10,
  type: "choice",
  prompt: "어떻게 말할까?",
  choices: [
    {
      text: "같이 가자고 말한다",
      effects: { affection: 10 },
      nextNode: 11
    }
  ]
},
{
  id: 11,
  type: "move",
  next: "EP2"
}
```

웹 편집기에서는 각 에피소드 안에서 `1, 2, 3...` 같은 단순한 자연수 ID만 보여주면 됩니다. 엔진은 내부적으로 `EP1#11`처럼 `episodeId + node.id` 조합으로 해석하므로, 서로 다른 에피소드에 같은 `id: 1`이 있어도 충돌하지 않습니다.

선택지 직후 추가 발화가 필요하면 `follow`에 넣고, 그 뒤에 이어질 노드를 `nextNode`로 지정합니다.

```js
{
  id: 20,
  type: "choice",
  prompt: "반응을 고르자",
  choices: [
    {
      text: "조심스럽게 묻는다",
      follow: [
        { speaker: "주인공", text: "괜찮아?" }
      ],
      nextNode: 21
    }
  ]
},
{
  id: 21,
  type: "move",
  next: "EP3"
}
```

미니게임도 같은 원칙입니다. 선택지는 미니게임을 직접 고르지 않고, 미니게임으로 보내는 `move` 노드의 ID를 고릅니다.

```js
{
  id: 30,
  type: "move",
  next: "MINIGAME",
  minigame: "brickBreaker",
  after: "EP4"
}
```

선택지 뒤에 모든 분기가 다시 합쳐지는 공통 대사가 있다면 별도 `AFTER_CHOICE` 에피소드를 만들지 않아도 됩니다. 본 에피소드 안에 공통 노드를 이어 붙이고, 각 선택지가 그 노드의 `nextNode`를 바라보게 하면 됩니다.

특정 에피소드의 특정 노드로 이동해야 할 때는 `move` 노드에 `nextNode`를 함께 쓸 수 있습니다.

```js
{
  id: 40,
  type: "move",
  next: "EP5",
  nextNode: 7
}
```

## 전체 실행 흐름

브라우저가 `index.html`을 열면 JS 파일이 아래 순서로 로드됩니다.

```text
config.js
  -> story-data.js
  -> ui.js
  -> sub_games/breakblocks.js
  -> sub_games/shooting.js
  -> game.js
  -> sketch.js
```

이 순서가 중요합니다. `Game` 객체는 `CONFIG`, `NODE_TYPES`, `SUB_GAME_MANIFEST`, `EPISODES`, `Button`, `TextBox`, `BackgroundImage`, `CharacterImage`, `BrickBreakerGame`, `SideShooterGame`을 사용하기 때문에, 관련 파일들이 먼저 로드되어야 합니다.

`sketch.js`는 p5.js가 호출하는 기본 함수와 이미지 사전 로딩을 담당합니다.

```js
function preload() {
  // ASSET_MANIFEST를 읽어 배경과 캐릭터 이미지를 미리 불러온다.
}

function setup() {
  createCanvas(CONFIG.width, CONFIG.height);
  game = new Game(assets);
}

function draw() {
  game.update();
  game.draw();
}

function mousePressed() {
  game.mousePressed();
}
```

즉, 이미지 파일은 `preload()`에서 미리 준비되고, 실제 게임 로직은 대부분 `Game` 객체 안에서 실행됩니다. p5.js는 매 프레임마다 `game.update()`와 `game.draw()`를 불러주는 역할을 합니다.

## 에셋 로딩 구조

파일: `config.js`, `sketch.js`

사용할 이미지는 `ASSET_MANIFEST`에 등록합니다.

```js
const ASSET_MANIFEST = {
  backgrounds: {
    dummy: "./assets/bg/dummy.png"
  },
  characters: {
    수진: {
      default: "./assets/char/수진.png",
      일반: "./assets/char/수진.png"
    }
  }
};
```

`sketch.js`의 `preload()`는 이 목록을 읽어서 `assets.backgrounds`, `assets.characters`에 p5 이미지 객체를 미리 넣습니다. 그래서 `game.js`와 `ui.js`는 파일을 직접 불러오지 않고 이미 준비된 이미지를 받아 그립니다.

## 주요 게임 객체

### Game

파일: `game.js`

`Game`은 프로젝트의 중심 객체입니다. 현재 장면, 현재 에피소드, 플레이어 수치, UI 객체, 미니게임 객체를 모두 관리합니다.

```js
this.state = {
  scene: SCENES.TITLE,
  episodeId: "EP1",
  nodeIndex: 0,
  dopamine: CONFIG.initialDopamine,
  affection: CONFIG.initialAffection,
  ending: null,
  characters: [],
  background: null
};
```

`state`의 의미는 다음과 같습니다.

| 속성 | 역할 |
| --- | --- |
| `scene` | 현재 화면. `SCENES.TITLE`, `SCENES.STORY`, `SCENES.MINIGAME`, `SCENES.ENDING` 중 하나 |
| `episodeId` | 현재 읽고 있는 에피소드 ID. `EPISODES`의 key와 연결됨 |
| `nodeIndex` | 현재 에피소드 안에서 몇 번째 노드를 보여줄지 결정 |
| `dopamine` | 도파민 수치. 선택지와 미니게임으로 변함 |
| `affection` | 호감도 수치. 선택지로 변함 |
| `ending` | 마지막에 결정된 엔딩 종류 |
| `characters` | 현재 화면에 등장 중인 캐릭터 이름 배열 |
| `background` | 현재 배경 이름 |

`Game`의 핵심 메서드는 다음과 같습니다.

| 메서드 | 역할 |
| --- | --- |
| `changeScene(scene)` | 현재 화면을 바꾸고, 필요한 객체나 선택지를 준비 |
| `update()` | 미니게임 진행 상태를 갱신하고, 끝나면 스토리로 복귀 |
| `draw()` | 현재 `scene`에 맞는 화면 그리기 함수 호출 |
| `mousePressed()` | 현재 `scene`에 맞는 클릭 처리 함수 호출 |
| `handleStoryClick()` | 대사 클릭 시 다음 노드로 이동하거나 선택지 버튼 처리 |
| `refreshChoices()` | 현재 선택지 데이터를 읽어서 `Button` 객체 배열 생성 |
| `processStoryCommandNodes()` | 배경/캐릭터 등장/퇴장 같은 명령형 노드를 자동 처리 |
| `drawCharacters()` | 현재 등장 중인 캐릭터들을 그림 |
| `applyEffects(effects)` | 선택지 효과를 도파민/호감도에 반영 |
| `decideEnding()` | 최종 수치에 따라 엔딩 결정 |

### Button

파일: `ui.js`

`Button`은 클릭 가능한 사각형 버튼입니다.

```js
new Button(x, y, w, h, label, onClick)
```

| 속성/메서드 | 역할 |
| --- | --- |
| `x, y, w, h` | 버튼 위치와 크기 |
| `label` | 버튼에 표시할 글자 |
| `onClick` | 클릭되었을 때 실행할 함수 |
| `contains(px, py)` | 마우스가 버튼 안에 있는지 확인 |
| `draw()` | hover 상태를 반영해 버튼을 그림 |
| `mousePressed()` | 클릭 위치가 버튼 안이면 `onClick()` 실행 |

`Game`은 시작 버튼, 다시 시작 버튼, 선택지 버튼을 모두 `Button`으로 만듭니다.

### TextBox

파일: `ui.js`

`TextBox`는 스토리 대사를 보여주는 말풍선/대화창 객체입니다.

```js
this.textBox.draw(node.speaker, node.text);
```

`speaker`와 `text`를 받아 화면 아래쪽에 대화창을 그립니다. 대사 진행 자체는 `TextBox`가 아니라 `Game.handleStoryClick()`이 담당합니다.

### BackgroundImage

파일: `ui.js`

`BackgroundImage`는 이미 `preload()`에서 불러온 이미지를 받아 배경으로 그립니다. 배경도 캐릭터와 같이 `CENTER` 기준으로 그리며, 이미지 비율을 유지한 채 화면을 꽉 채우는 cover 방식입니다.

```js
imageMode(CENTER);
image(this.img, width / 2, height / 2, drawWidth, drawHeight);
```

### CharacterImage

파일: `ui.js`

`CharacterImage`는 현재 등장 중인 캐릭터 이미지를 그립니다. 이미지는 너비 200을 기준으로 원본 비율을 유지합니다.

캐릭터가 1명이면 중앙, 2명 이상이면 왼쪽/오른쪽/중앙 순서로 배치됩니다.

### 서브게임 클래스

파일: `sub_games/breakblocks.js`, `sub_games/shooting.js`

서브게임은 메인 p5.js 캔버스 안에서 실행되는 클래스형 객체입니다. 각 클래스는 본게임의 현재 도파민을 생성자로 받고, 게임이 끝나면 최종 도파민을 `getDopamine()`으로 본게임에 돌려줍니다.

현재 서브게임은 `config.js`의 `SUB_GAME_MANIFEST`에 등록합니다.

```js
new BrickBreakerGame(currentDopamine)
new SideShooterGame(currentDopamine)
```

## 스토리 데이터 구조

파일: `story-data.js`

스토리는 `EPISODES` 객체에 저장됩니다.

```js
const EPISODES = {
  EP1: [
    { type: "background", name: "dummy" },
    { type: "dialogue", speaker: "...", text: "..." },
    { type: "choice", prompt: "...", choices: [...] }
  ]
};
```

각 에피소드는 노드 배열입니다. `Game.state.episodeId`가 어떤 에피소드를 볼지 정하고, `Game.state.nodeIndex`가 그 안의 몇 번째 노드를 볼지 정합니다.

`story-data.js`는 웹 편집기에서 만들기 쉽도록 문자열 기반 데이터로 둡니다. `NODE_TYPES`는 엔진 코드가 비교할 때 쓰는 상수이고, 시나리오 데이터에는 `"dialogue"` 같은 문자열을 저장합니다.

모든 노드와 선택지는 `condition`을 가질 수 있습니다. 조건이 없으면 항상 실행되고, 조건이 있으면 모든 조건을 만족할 때만 실행됩니다.

```js
condition: {
  dopamineMin: 40,
  dopamineMax: 70,
  affectionMin: 20,
  affectionMax: 80
}
```

### background 노드

배경을 바꾸는 명령형 노드입니다.

```js
{
  type: "background",
  name: "dummy"
}
```

`name`은 `ASSET_MANIFEST.backgrounds`에 등록된 이름과 같아야 합니다.

### character in 노드

캐릭터를 화면에 등장시키는 명령형 노드입니다.

```js
{
  type: "character in",
  name: "수진",
  emotion: "일반"
}
```

`name`과 `emotion`은 `ASSET_MANIFEST.characters`에 등록된 값과 연결됩니다. 해당 표정 이미지가 없으면 `default` 이미지를 찾습니다.

### character out 노드

캐릭터를 화면에서 퇴장시키는 명령형 노드입니다.

```js
{
  type: "character out",
  name: "수진"
}
```

명령형 노드는 클릭을 기다리지 않고 자동으로 처리된 뒤 다음 노드로 넘어갑니다.

### clear 노드

현재 화면 상태를 정리하는 명령형 노드입니다.

```js
{ type: "clear characters" }
{ type: "clear background" }
{ type: "scene reset" }
```

`clear characters`는 모든 캐릭터를 지우고, `clear background`는 배경을 제거합니다. `scene reset`은 캐릭터와 배경을 모두 제거합니다.

### move 노드

선택지 없이 다른 에피소드나 미니게임으로 이동하는 명령형 노드입니다.

```js
{
  type: "move",
  next: "EP3"
}
```

조건과 함께 쓰면 수치에 따라 특정 루트로 보낼 수 있습니다.

```js
{
  type: "move",
  next: "EP_GOOD_ROUTE",
  condition: { affectionMin: 40 }
}
```

미니게임으로 이동할 때는 `next`에 `"MINIGAME"`을 넣고, `minigame`에 실행할 서브게임 ID를 넣습니다.

```js
{
  type: "move",
  next: "MINIGAME",
  minigame: "brickBreaker"
}
```

현재 등록된 서브게임 ID는 다음과 같습니다.

| ID | 파일 |
| --- | --- |
| `brickBreaker` | `sub_games/breakblocks.js` |
| `sideShooter` | `sub_games/shooting.js` |

### dialogue 노드

대사를 보여주는 노드입니다.

```js
{
  type: "dialogue",
  speaker: "주인공",
  text: "..."
}
```

스토리 화면에서 클릭하면 `nodeIndex`가 1 증가하면서 다음 노드로 넘어갑니다.

### choice 노드

선택지를 보여주는 노드입니다.

```js
{
  type: "choice",
  prompt: "...",
  choices: [
    {
      text: "...",
      effects: { affection: 10, dopamine: -5 },
      next: "EP2"
    }
  ]
}
```

선택지를 누르면 다음 일이 순서대로 일어납니다.

1. `applyEffects(choice.effects)`로 도파민/호감도 변화 적용.
2. `choice.follow`가 있으면 선택 직후 이어질 대사를 먼저 재생.
3. `choice.next`가 `"MINIGAME"`이면 `choice.minigame`에 적힌 서브게임으로 전환.
4. 그렇지 않으면 `episodeId`를 `choice.next`로 바꾸고 `nodeIndex`를 0으로 초기화.
5. 새 에피소드의 선택지가 있으면 `refreshChoices()`로 버튼 다시 생성.

`follow`는 선택지 버튼에는 보이지 않고, 선택 직후 이어지는 발화를 저장합니다.

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

### endingCheck 노드

엔딩 판정을 실행하는 노드입니다.

```js
{
  type: "endingCheck"
}
```

이 노드에 도달하면 `decideEnding()`으로 엔딩을 정하고 `scene`을 `SCENES.ENDING`으로 바꿉니다.

## 장면 전환 구조

현재 화면은 `Game.state.scene` 하나로 결정됩니다.

```text
title
  -> story
  -> minigame
  -> story
  -> ending
```

각 장면에서 실행되는 함수는 다음과 같습니다.

| scene | draw 처리 | 클릭 처리 |
| --- | --- | --- |
| `title` | `drawTitle()` | 시작 버튼 클릭 시 `story`로 전환 |
| `story` | `drawStory()` | 대사 진행 또는 선택지 버튼 클릭 |
| `minigame` | `minigame.draw()` | 미니게임 클릭 판정 |
| `ending` | `drawEnding()` | 다시 시작 버튼 클릭 시 새로고침 |

## 도파민/호감도 변화 로직

선택지 효과는 `effects` 객체로 관리합니다.

```js
effects: { affection: 15, dopamine: 8 }
```

`Game.applyEffects()`는 이 값을 읽어 현재 수치에 더합니다.

도파민은 `addDopamine()`을 통해 0부터 100 사이로 제한됩니다.

```js
addDopamine(amount) {
  this.state.dopamine = constrain(this.state.dopamine + amount, 0, 100);
}
```

호감도도 0부터 100 사이로 제한됩니다.

```js
this.state.affection = constrain(this.state.affection + effects.affection, 0, 100);
```

## 선택지 조건

선택지는 조건을 걸 수 있습니다.

```js
condition: { dopamineMin: 51 }
```

`Game.canChoose()`가 조건을 검사합니다.

| 조건 | 의미 |
| --- | --- |
| `dopamineMin` | 현재 도파민이 이 값 이상일 때만 선택 가능 |
| `dopamineMax` | 현재 도파민이 이 값 이하일 때만 선택 가능 |

조건을 만족하지 못한 선택지는 버튼으로 생성되지 않습니다.

## 엔딩 판정

엔딩은 `Game.decideEnding()`에서 결정됩니다.

```js
decideEnding() {
  if (this.state.dopamine < 40) return "low";
  if (this.state.dopamine > 70) return "high";
  if (this.state.affection < 40) return "bad";
  return "good";
}
```

판정 순서가 중요합니다.

1. 도파민이 40 미만이면 `low`
2. 도파민이 70 초과이면 `high`
3. 호감도가 40 미만이면 `bad`
4. 위 조건에 모두 걸리지 않으면 `good`

즉, 호감도가 높아도 도파민이 너무 낮거나 높으면 `low` 또는 `high` 엔딩이 먼저 나옵니다.

## 새 스토리를 추가하는 방법

`story-data.js`에 새 에피소드 key를 추가합니다.

```js
EP3: [
  {
    type: "dialogue",
    speaker: "주인공",
    text: "새로운 장면..."
  },
  {
    type: "choice",
    prompt: "무엇을 할까?",
    choices: [
      {
        text: "선택지",
        effects: { dopamine: 5, affection: 10 },
        next: "EP4"
      }
    ]
  }
]
```

그 다음 기존 선택지의 `next`를 새 에피소드 ID로 연결하면 됩니다.

```js
next: "EP3"
```

미니게임으로 보내고 싶으면 `next`에 `"MINIGAME"`을 넣습니다.

```js
next: "MINIGAME",
minigame: "sideShooter"
```

## 자주 수정하는 위치

| 하고 싶은 일 | 수정할 파일 |
| --- | --- |
| 대사, 선택지, 선택 효과 바꾸기 | `story-data.js` |
| 도파민/호감도 초기값 바꾸기 | `config.js` |
| 배경/캐릭터 이미지 등록하기 | `config.js` |
| 장면 전환, 엔딩 조건 바꾸기 | `game.js` |
| 서브게임 목록 바꾸기 | `config.js` |
| 서브게임 실행 방식 바꾸기 | `game.js` |
| 서브게임 내부 규칙 바꾸기 | `sub_games/` |
| 버튼/대화창 모양 바꾸기 | `ui.js` |
| 캔버스 크기 바꾸기 | `config.js` |

## 현재 게임 진행 요약

```text
타이틀
  -> EP1 대사와 선택지
  -> EP2 대사와 선택지
  -> story-data.js에서 지정한 서브게임
  -> EP_AFTER_MINIGAME 대사
  -> 엔딩 판정
```

전체적으로 `story-data.js`는 게임 내용, `game.js`는 게임 규칙, `ui.js`는 기본 화면 객체, `sub_games/`는 본게임 안에서 실행되는 미니게임을 담당한다고 보면 됩니다.
## sound 노드

`sound` 노드는 BGM과 효과음을 재생하는 명령 노드입니다. 대사처럼 클릭을 기다리지 않고 즉시 실행된 뒤 다음 노드로 넘어갑니다.

사운드 파일은 `assets/sound/bgm/` 또는 `assets/sound/effects/`에 넣고, `config.js`의 `ASSET_MANIFEST.sounds`에 등록합니다.

```js
const ASSET_MANIFEST = {
  sounds: {
    bgm: {
      nightLibrary: "./assets/sound/bgm/night-library.mp3"
    },
    effects: {
      doorOpen: "./assets/sound/effects/door-open.mp3"
    }
  }
};
```

BGM 시작:

```js
{
  type: "sound",
  soundType: "bgm",
  action: "play",
  name: "nightLibrary",
  volume: 0.6
}
```

BGM 정지:

```js
{
  type: "sound",
  soundType: "bgm",
  action: "stop"
}
```

효과음 재생:

```js
{
  type: "sound",
  soundType: "effect",
  name: "doorOpen",
  volume: 0.8
}
```

`volume`은 `0`부터 `1` 사이의 숫자입니다.
