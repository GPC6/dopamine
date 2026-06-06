# Minigame Playtest Feedback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 교수님 플레이테스트 피드백을 반영해 미니게임을 짧고 쉽고 설명이 분명한 보조 경험으로 낮춘다.

**Architecture:** 본게임의 미니게임 진입/복귀 구조는 유지한다. 분량과 튜토리얼은 `game.js`와 테스트 하네스 옵션에서 제어하고, 실제 조작/종료 규칙은 각 미니게임 클래스(`breakblocks.js`, `shooting.js`) 안에서 최소 수정한다.

**Tech Stack:** p5.js, vanilla JavaScript, 기존 `Game`, `BrickBreakerGame`, `SideShooterGame`, `MinigameTutorialOverlay`, Node 기반 문법/회귀 검증.

---

## Feedback Summary

교수님 피드백의 핵심은 미니게임을 "실력 게임"보다 "도파민 수치를 짧게 조정하는 보조 장면"으로 낮추는 것이다.

| 피드백 | 해석 | 구현 방향 |
| --- | --- | --- |
| 미니게임 분량을 낮추기 | 플레이 시간이 길고 본게임 흐름을 끊음 | 기본 턴/시간을 줄이고 테스트 하네스 기본값도 맞춘다 |
| 슈팅게임 마우스로만 | 키보드 이동이 진입 장벽 | 마우스 위치로 이동, 클릭으로 공격, 우클릭으로 기술 |
| 벽돌깨기 직관적이지 못함 | 규칙을 플레이 전에 알기 어려움 | 튜토리얼 오버레이와 HUD 문구를 구체화 |
| 벽돌깨기 턴수 낮추기 | 결과까지 오래 걸림 | 기본 `maxTurns`를 5로 낮춤 |
| 블럭 내려오면 그 시점 도파민으로 종료 | 실패 시 0 고정 같은 과한 벌점 금지 | 현재 도파민을 그대로 반환하도록 회귀 테스트로 고정 |
| 슈팅게임도 죽으면 그 시점 도파민으로 종료 | 라이프 소진 벌점이 과함 | `lives <= 0`에서도 도파민 0 고정 제거 |
| 쉽게 바꾸기 | 플레이테스트용 난이도 완화 | 적 체력/스폰/탄막, 벽돌 내구도/공 개수 압박 완화 |

---

## File Map

| 파일 | 역할 | 변경 이유 |
| --- | --- | --- |
| `game.js` | 미니게임 시작 옵션, 튜토리얼 오버레이 생성, 미니게임 복귀 | 본게임에서 기본 미니게임 분량과 튜토리얼 문구를 안정적으로 주입 |
| `story-data-excel.js` | 실제 스토리 미니게임 진입 옵션과 튜토리얼 문구 | 스토리 데이터가 기본값을 덮어쓰는 첫 미니게임 분량/설명을 최신 기준으로 맞춤 |
| `minigame-test.js` | 미니게임 단독 테스트 기본값 | 플레이테스트 기본 턴/시간을 본게임과 동일하게 낮춤 |
| `sub_games/breakblocks.js` | 벽돌깨기 턴 수, 난이도, 종료 규칙, 안내 문구 | 더 짧고 직관적인 벽돌깨기 |
| `sub_games/shooting.js` | 슈팅 조작, 난이도, 라이프 소진 종료 규칙 | 마우스 중심, 더 쉬운 슈팅 |
| `sub_games/벽돌깨기_현재_게임디자인.md` | 벽돌깨기 최신 규칙 문서 | 구현 후 규칙 설명 갱신 |
| `sub_games/슈팅_현재_게임디자인.md` | 슈팅 최신 규칙 문서 | 구현 후 규칙 설명 갱신 |

---

## Priority Order

1. **P0 종료 결과 보정:** 죽거나 블럭이 내려와도 그 시점 도파민을 반환한다.
2. **P0 분량 축소:** 벽돌깨기 6턴, 슈팅 45초를 기본값으로 낮춘다.
3. **P1 슈팅 마우스 조작:** 키보드 이동을 몰라도 플레이 가능하게 만든다.
4. **P1 벽돌깨기 설명 강화:** 튜토리얼과 HUD 문구로 규칙을 명확히 한다.
5. **P2 난이도 완화:** 쉬운 기본값으로 체력/스폰/공 개수 압박을 낮춘다.

---

### Task 1: Regression Tests For Feedback Rules

**Files:**
- Test by command only: no permanent test file required

- [ ] **Step 1: Write the failing regression script**

Run this from repo root `도파민때문에`.

```powershell
@'
const fs = require("fs");
const vm = require("vm");

function loadGame(file, exportName, extra = "") {
  const code = fs.readFileSync(file, "utf8") + `\nthis.${exportName} = ${exportName};` + extra;
  const ctx = {
    console,
    Math,
    window: {},
    width: 1280,
    height: 720,
    mouseX: 640,
    mouseY: 360,
    mouseButton: "LEFT",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    SHIFT: 16,
    ENTER: 13,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39,
    CENTER: "CENTER",
    CORNER: "CORNER",
    CLOSE: "CLOSE",
    key: "",
    keyCode: 0,
    frameCount: 1,
    millis: () => 0,
    keyIsDown: () => false,
    random: (a, b) => {
      if (a === undefined) return 0;
      if (b === undefined) return 0;
      return a;
    },
    floor: Math.floor,
    min: Math.min,
    max: Math.max,
    constrain: (v, min, max) => Math.max(min, Math.min(max, v)),
    map: (v, a1, a2, b1, b2) => b1 + ((v - a1) / (a2 - a1)) * (b2 - b1),
    dist: (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2),
    lerp: (a, b, t) => a + (b - a) * t,
    createVector: (x, y) => ({
      x,
      y,
      normalize() {
        const len = Math.hypot(this.x, this.y) || 1;
        this.x /= len;
        this.y /= len;
      }
    }),
    p5: { Vector: { sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y, normalize() {
      const len = Math.hypot(this.x, this.y) || 1;
      this.x /= len;
      this.y /= len;
    } }) } },
    push() {}, pop() {}, translate() {}, background() {}, stroke() {}, line() {}, point() {},
    noStroke() {}, fill() {}, textAlign() {}, textSize() {}, text() {}, rect() {}, circle() {},
    triangle() {}, beginShape() {}, vertex() {}, endShape() {}, noFill() {}, strokeWeight() {},
    ellipse() {}, arc() {}, rectMode() {}, textStyle() {}
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return { ctx, GameClass: ctx[exportName] };
}

const { GameClass: BrickBreakerGame } = loadGame("sub_games/breakblocks.js", "BrickBreakerGame");
const brick = new BrickBreakerGame(63);
if (brick.maxTurns !== 6) throw new Error(`BrickBreaker default maxTurns should be 6, got ${brick.maxTurns}`);
brick.dopamine = 47;
brick.endGame("블럭이 바닥에 닿음");
if (brick.getDopamine() !== 47) throw new Error(`BrickBreaker floor failure should return current dopamine 47, got ${brick.getDopamine()}`);

const { GameClass: SideShooterGame } = loadGame("sub_games/shooting.js", "SideShooterGame");
const shooter = new SideShooterGame(58);
if (shooter.durationSeconds !== 45) throw new Error(`Shooter default duration should be 45, got ${shooter.durationSeconds}`);
shooter.dopamine = 64;
shooter.lives = 1;
shooter.takeHit();
if (shooter.getDopamine() !== 74) throw new Error(`Shooter death should keep current dopamine after hit, got ${shooter.getDopamine()}`);
if (!shooter.gameOver) throw new Error("Shooter should still end on final hit");

console.log("playtest feedback regression passed");
'@ | node
```

- [ ] **Step 2: Verify it fails before implementation**

Run:

```powershell
@'
# paste Step 1 script here
'@ | node
```

Expected before implementation:

```text
Error: BrickBreaker default maxTurns should be 6, got 10
```

If the first failure differs, inspect the related default before changing production code.

---

### Task 2: Shorten Default Minigame Length

**Files:**
- Modify: `sub_games/breakblocks.js`
- Modify: `sub_games/shooting.js`
- Modify: `minigame-test.js`

- [ ] **Step 1: Change BrickBreaker default turns**

In `sub_games/breakblocks.js`, change `parseMaxTurns`.

```js
parseMaxTurns(value) {
  if (!Number.isFinite(Number(value))) return 5;
  return Math.max(1, Math.min(20, Math.round(Number(value))));
}
```

This keeps story/test overrides possible but lowers the default.

- [ ] **Step 2: Change SideShooter default duration**

In `sub_games/shooting.js`, change `parseDurationSeconds`.

```js
parseDurationSeconds(value) {
  if (!Number.isFinite(Number(value))) return 45;
  return Math.max(10, Math.min(120, Math.round(Number(value))));
}
```

This makes the shooter half-length by default while still allowing short tests and story overrides.

- [ ] **Step 3: Align standalone test defaults**

In `minigame-test.js`, change the default turns/time helper.

```js
function defaultTurnsForGame(gameId) {
  return gameId === SUB_GAMES.SIDE_SHOOTER ? 45 : 5;
}
```

If the file currently clamps shooter to `5~180`, change it to `10~120`.

```js
if (testSubGameId === SUB_GAMES.SIDE_SHOOTER) return Math.round(constrain(value, 10, 120));
return Math.round(constrain(value, 1, 20));
```

- [ ] **Step 4: Run checks**

```powershell
node --check .\sub_games\breakblocks.js
node --check .\sub_games\shooting.js
node --check .\minigame-test.js
```

Expected: all commands exit 0.

---

### Task 3: Preserve Current Dopamine On Failure

**Files:**
- Modify: `sub_games/breakblocks.js`
- Modify: `sub_games/shooting.js`

- [ ] **Step 1: Lock BrickBreaker floor failure to current dopamine**

Inspect `sub_games/breakblocks.js`.

Current floor failure likely ends here:

```js
if (this.bricks.some((brick) => this.brickY(brick.r) + 38 >= this.floor)) {
  this.endGame("블럭이 바닥에 닿아 도파민이 무너짐");
  return;
}
```

Change only the message if needed. Do not set `this.dopamine = 0`.

```js
if (this.bricks.some((brick) => this.brickY(brick.r) + 38 >= this.floor)) {
  this.endGame("블럭이 내려와 현재 도파민으로 종료");
  return;
}
```

- [ ] **Step 2: Remove SideShooter zeroing on final hit**

In `sub_games/shooting.js`, change `takeHit`.

```js
takeHit() {
  if (this.player.shield > 0) {
    this.player.shield--;
    return;
  }
  this.lives--;
  this.addDopamine(10);
  if (this.lives <= 0) {
    this.endGame("라이프 소진: 현재 도파민으로 종료");
  }
}
```

The final hit still raises dopamine by `+10`; the result is the visible current value after the hit.

- [ ] **Step 3: Re-run Task 1 regression**

Expected after implementation:

```text
playtest feedback regression passed
```

---

### Task 4: Convert Shooter To Mouse-First Controls

**Files:**
- Modify: `sub_games/shooting.js`
- Modify: `sub_games/슈팅_현재_게임디자인.md`

- [ ] **Step 1: Add mouse movement method**

In `sub_games/shooting.js`, add this method near `getPlayerSpeed`.

```js
updateMouseMovement() {
  const localMouseX = mouseX - (width - this.w) / 2;
  const localMouseY = mouseY - (height - this.h) / 2;
  const targetX = constrain(localMouseX, 40, this.w - 80);
  const targetY = constrain(localMouseY, 92, this.h - 45);
  const follow = 0.28;
  this.player.x = lerp(this.player.x, targetX, follow);
  this.player.y = lerp(this.player.y, targetY, follow);
}
```

- [ ] **Step 2: Use mouse movement before keyboard fallback**

In `updateGame`, replace direct keyboard-first movement with mouse-first movement.

```js
this.updateMouseMovement();

const speedBoost = this.getPlayerSpeed();
if (this.isKeyDown(UP_ARROW) || this.isKeyDown(87)) this.player.y -= speedBoost;
if (this.isKeyDown(DOWN_ARROW) || this.isKeyDown(83)) this.player.y += speedBoost;
if (this.isKeyDown(LEFT_ARROW) || this.isKeyDown(65)) this.player.x -= speedBoost * 0.75;
if (this.isKeyDown(RIGHT_ARROW) || this.isKeyDown(68)) this.player.x += speedBoost * 0.75;
this.player.x = constrain(this.player.x, 40, this.w - 80);
this.player.y = constrain(this.player.y, 92, this.h - 45);
```

Keyboard remains as a fallback, but the tutorial and HUD should teach mouse-only play.

- [ ] **Step 3: Simplify shooter HUD text**

Change the reset message and HUD guidance.

```js
this.resultText = "마우스로 이동 / 좌클릭 공격 / 우클릭 기술";
```

```js
text("마우스로 이동, 좌클릭 공격, 우클릭 기술", 28, 63);
```

- [ ] **Step 4: Run focused mouse-control regression**

```powershell
@'
const fs = require("fs");
const vm = require("vm");
const code = fs.readFileSync("sub_games/shooting.js", "utf8") + "\nthis.SideShooterGame = SideShooterGame;";
const ctx = {
  console, Math, window: {}, width: 1280, height: 720, mouseX: 900, mouseY: 420,
  millis: () => 0, frameCount: 1, keyIsDown: () => false,
  UP_ARROW: 38, DOWN_ARROW: 40, LEFT_ARROW: 37, RIGHT_ARROW: 39,
  RIGHT: "RIGHT", CENTER: "CENTER", CORNER: "CORNER", CLOSE: "CLOSE",
  constrain: (v, min, max) => Math.max(min, Math.min(max, v)),
  lerp: (a, b, t) => a + (b - a) * t,
  random: (a, b) => a === undefined ? 0 : b === undefined ? 0 : a,
  dist: (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2),
  map: (v, a1, a2, b1, b2) => b1 + ((v - a1) / (a2 - a1)) * (b2 - b1),
  push(){}, pop(){}, translate(){}, background(){}, stroke(){}, line(){}, point(){}, noStroke(){},
  fill(){}, textAlign(){}, textSize(){}, text(){}, rect(){}, circle(){}, triangle(){},
  beginShape(){}, vertex(){}, endShape(){}, noFill(){}, strokeWeight(){}, ellipse(){}, arc(){}, rectMode(){}
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(code, ctx);
const game = new ctx.SideShooterGame(50, { durationSeconds: 45 });
const beforeX = game.player.x;
game.updateMouseMovement();
if (game.player.x <= beforeX) throw new Error("player should move toward mouse x");
console.log("shooter mouse movement regression passed");
'@ | node
```

Expected: `shooter mouse movement regression passed`.

---

### Task 5: Make Shooter Easier

**Files:**
- Modify: `sub_games/shooting.js`

- [ ] **Step 1: Lower default enemy HP**

Change `enemyStats`.

```js
enemyStats(type) {
  if (type === "shooter") return { r: 20, hp: 3, speed: 2.35 };
  if (type === "tank") return { r: 24, hp: 5, speed: 1.55 };
  return { r: 18, hp: 2, speed: 2.55 };
}
```

Keep `difficulty` as an override for later playtests.

- [ ] **Step 2: Slow default spawn pressure**

Change `getSpawnInterval`.

```js
getSpawnInterval() {
  const difficultyPressure = this.getDifficultyLevel() * 12;
  return Math.max(78, 180 - difficultyPressure - this.getDopamineProfile().spawnPressure);
}
```

- [ ] **Step 3: Reduce shooter bullet frequency**

Change `updateEnemyBullets`.

```js
const interval = Math.max(48, 82 - this.getDifficultyLevel() * 4 + this.getDopamineProfile().bulletIntervalBonus);
```

- [ ] **Step 4: Run existing and focused checks**

```powershell
node --check .\sub_games\shooting.js
```

Then run the combined shooter regression from the previous development turn and update expected HP values to `drone >= 2`, `shooter >= 3`, `tank >= 5`.

---

### Task 6: Make BrickBreaker Shorter And Clearer

**Files:**
- Modify: `sub_games/breakblocks.js`
- Modify: `sub_games/벽돌깨기_현재_게임디자인.md`

- [ ] **Step 1: Reduce ball count pressure**

Change `getBallCount` so high dopamine does not create an overwhelming number of balls during a short 5-turn game.

```js
getBallCount() {
  return Math.max(1, Math.min(10, Math.floor(this.dopamine / 12) + this.permanentBallBonus));
}
```

- [ ] **Step 2: Lower turn HP growth**

Change `getTurnHpBonus`.

```js
getTurnHpBonus() {
  return Math.min(2, Math.floor((this.turn - 1) / 3));
}
```

- [ ] **Step 3: Make first message explain the goal**

In `resetGame`, replace the message.

```js
this.message = "목표: 6턴 동안 도파민을 안정 구간에 가깝게 유지";
```

- [ ] **Step 4: Make launch message explain items**

In `mousePressed`, replace the launch message.

```js
this.message = `${count}개 발사 / P=공+1, ↯=관통, -=완화`;
```

- [ ] **Step 5: Keep brick labels HP-only if already changed**

If bricks currently show only HP, keep that. If they still show effect values, change drawing text to HP-centered text.

```js
text(`${brick.hp}`, x + this.cell / 2, y + 24);
```

This supports the earlier decision that dopamine gain/loss constants are shown in UI, not each brick.

- [ ] **Step 6: Run checks**

```powershell
node --check .\sub_games\breakblocks.js
```

Expected: exit 0.

---

### Task 7: Add Detailed Minigame Tutorials Through Existing Overlay

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Add default tutorial injection**

In `getPlayableSubGameOptions`, do not include tutorial data in the playable options. This already exists and should stay:

```js
getPlayableSubGameOptions(options = {}) {
  const playableOptions = { ...options };
  delete playableOptions.tutorial;
  return playableOptions;
}
```

- [ ] **Step 2: Add tutorial defaults before overlay creation**

Add a helper near `createMinigameTutorial`.

```js
getDefaultMinigameTutorial(subGameId) {
  if (subGameId === SUB_GAMES.BRICK_BREAKER) {
    return [
      { speaker: "파미니", text: "벽돌깨기는 6턴만 진행돼. 목표는 점수가 아니라 끝날 때 도파민을 적당히 남기는 거야." },
      { speaker: "파미니", text: "마우스로 각도를 정하고 클릭하면 공이 나가. 블럭 숫자는 남은 내구도야." },
      { speaker: "파미니", text: "블럭이 아래까지 내려오면 바로 끝나지만, 그 순간의 도파민이 결과로 돌아가." }
    ];
  }

  if (subGameId === SUB_GAMES.SIDE_SHOOTER) {
    return [
      { speaker: "파미니", text: "슈팅은 짧게 45초만 버티면 돼. 마우스를 움직이면 캐릭터도 따라 움직여." },
      { speaker: "파미니", text: "좌클릭은 공격, 우클릭은 현재 파워 칸의 기술이야. 죽어도 현재 도파민으로 돌아가." },
      { speaker: "파미니", text: "도파민이 높으면 강해지지만 적도 빨라져. 너무 높게 오래 유지하지 않는 게 좋아." }
    ];
  }

  return [];
}
```

- [ ] **Step 3: Merge story-provided tutorial with defaults**

Change `createMinigameTutorial`.

```js
createMinigameTutorial(options) {
  if (typeof MinigameTutorialOverlay !== "function") return null;
  const subGameId = this.state.selectedSubGame || SUB_GAMES.BRICK_BREAKER;
  const defaultSteps = this.getDefaultMinigameTutorial(subGameId);
  const mergedOptions = {
    ...options,
    tutorial: options.tutorial || defaultSteps
  };
  return MinigameTutorialOverlay.fromOptions(mergedOptions);
}
```

This preserves story-specific tutorials when provided.

- [ ] **Step 4: Run story and syntax checks**

```powershell
node --check .\game.js
node .\story-validator.js
```

Expected: both exit 0.

---

### Task 8: Update Design Docs

**Files:**
- Modify: `sub_games/벽돌깨기_현재_게임디자인.md`
- Modify: `sub_games/슈팅_현재_게임디자인.md`

- [ ] **Step 1: Update BrickBreaker document**

Required changes:

```markdown
- 기본 턴 수: 6턴
- 공 개수: 도파민 12당 1개, 최대 10개
- 블럭이 바닥까지 내려오면 현재 도파민으로 종료
- 튜토리얼: 6턴 목표, 블럭 숫자 의미, 바닥 도달 종료 설명
- 난이도 완화: 턴별 HP 상승 최대 +2
```

- [ ] **Step 2: Update Shooter document**

Required changes:

```markdown
- 기본 플레이 시간: 45초
- 조작: 마우스 이동, 좌클릭 공격, 우클릭 기술
- 라이프 소진: 현재 도파민으로 종료
- 난이도 완화: 낮아진 기본 HP, 느려진 스폰/탄막
- 튜토리얼: 마우스 조작, 생존 목표, 도파민 과열 설명
```

- [ ] **Step 3: Search for stale text**

```powershell
rg -n "90초|10턴|WASD|Space|라이프 소진.*, 결과 도파민 `0`|도파민 `0`" .\sub_games\슈팅_현재_게임디자인.md .\sub_games\벽돌깨기_현재_게임디자인.md
```

Expected: no stale rule text except historical request notes clearly marked as old requests.

---

### Task 9: Final Verification

**Files:**
- Verify only

- [ ] **Step 1: Run syntax checks**

```powershell
node --check .\game.js
node --check .\minigame-test.js
node --check .\sub_games\breakblocks.js
node --check .\sub_games\shooting.js
node --check .\sketch.js
```

Expected: all exit 0.

- [ ] **Step 2: Run story validator**

```powershell
node .\story-validator.js
```

Expected: exit 0.

- [ ] **Step 3: Run feedback regression**

Run the Task 1 script again.

Expected:

```text
playtest feedback regression passed
```

- [ ] **Step 4: Manual browser smoke test**

Open `index.html` or the local dev server if one is already running.

Manual checklist:

```text
1. Enter DOPAMINE_READY.
2. Confirm dopamine starts in the 40~50 range.
3. Click "도파민 게임 시작하기".
4. Confirm the first click does not immediately fire/act inside the minigame.
5. In shooter, move mouse and confirm player follows without keyboard.
6. In shooter, lose all lives and confirm result returns current dopamine, not 0.
7. In brickbreaker, confirm default max turns is 5.
8. In brickbreaker, let blocks reach bottom and confirm result returns current dopamine.
9. Confirm tutorial text appears before each minigame and can be advanced by click/key.
```

---

## Risk Notes

- 마우스 이동 슈팅은 플레이어가 발사하려고 클릭하는 위치와 이동 목표가 같아진다. 이게 너무 민감하면 `follow = 0.18`로 낮춘다.
- 벽돌깨기 공 개수를 도파민 12당 1개로 낮추면 후반 블럭 처리가 쉬워지지만, 너무 밋밋하면 `maxTurns`는 유지하고 아이템 빈도만 올린다.
- 튜토리얼 오버레이는 이미 `game.js`에 존재한다. 새 UI를 만들지 말고 기존 `MinigameTutorialOverlay` 옵션 흐름을 사용한다.

## Self-Review

- 피드백 7개 모두 Task 2~8에 매핑되어 있다.
- 빈 자리나 미정 항목으로 남긴 표현은 없다.
- 기본값 변경은 본게임과 `minigame-test.js`가 함께 바뀌도록 계획했다.
- 실패 시 도파민 반환은 양쪽 미니게임 모두 회귀 테스트로 고정한다.
