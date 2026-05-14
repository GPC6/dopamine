# 도파민때문에 p5.js 구조

이 폴더는 개발을 처음 접하는 팀원도 파일 역할을 이해하기 쉽도록, 너무 깊지 않게 나눈 p5.js 프로젝트입니다.

## 실행

`index.html`을 브라우저로 열면 됩니다.

p5.js는 인터넷에서 불러옵니다. 발표 환경에서 인터넷이 불안하면 나중에 `p5.min.js`를 파일로 받아서 로컬 연결로 바꾸면 됩니다.

## 파일 역할

```text
dopa-p5/
  index.html       실행 파일. p5.js와 우리 JS 파일들을 순서대로 불러옴
  styles.css       캔버스 배치와 페이지 배경
  config.js        화면 크기, 초기 도파민/호감도 같은 기본 설정
  story-data.js    시나리오, 대사, 선택지, 선택지 효과
  ui.js            버튼, 텍스트박스 같은 공통 UI
  mini-game.js     도파민 미니게임
  game.js          전체 게임 진행, 장면 전환, 엔딩 판정
  sketch.js        p5.js의 setup/draw/mousePressed만 있는 시작점
```

## 어떤 파일을 고치면 되나

시나리오를 추가하거나 대사를 바꾸려면:

```text
story-data.js
```

선택지가 도파민/호감도에 주는 영향을 바꾸려면:

```js
effects: { affection: 15, dopamine: 8 }
```

미니게임 규칙을 바꾸려면:

```text
mini-game.js
```

버튼이나 대화창 모양을 바꾸려면:

```text
ui.js
```

엔딩 조건, 장면 전환, 전체 게임 흐름을 바꾸려면:

```text
game.js
```

캔버스 크기나 초기 수치를 바꾸려면:

```text
config.js
```

## 현재 게임 흐름

```text
타이틀
  -> EP1 스토리
  -> EP2 스토리
  -> 도파민 미니게임
  -> 엔딩 판정
```

## 협업 기준

찬영:
- `game.js`
- `mini-game.js`
- 전체 통합

시나리오 담당:
- `story-data.js`

아트/UI 담당:
- `ui.js`
- 추후 `assets/` 폴더

이 구조는 나중에 파일이 너무 커지면 다시 폴더로 나눌 수 있습니다. 지금은 팀원이 빠르게 이해하고 고칠 수 있는 것을 우선합니다.
