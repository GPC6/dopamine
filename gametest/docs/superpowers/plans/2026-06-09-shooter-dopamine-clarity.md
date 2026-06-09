# Shooter Dopamine Clarity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 슈팅게임에서 어떤 행동이 도파민을 올리고 낮추는지 색상, 라벨, 피드백, 튜토리얼로 즉시 이해되게 만든다.

**Architecture:** 기존 `SideShooterGame`의 도파민 변화 규칙은 유지하되, 시각 언어를 벽돌깨기와 맞춘다. 빨간색은 도파민 상승/자극/피격, 초록색은 도파민 감소/완화/흡수로 통일하고, 적 타입의 의미를 화면과 튜토리얼에서 설명한다.

**Tech Stack:** p5.js, vanilla JavaScript, 기존 Node 기반 회귀 테스트.

---

## Feedback Summary

| 피드백 | 해석 | 대응 |
| --- | --- | --- |
| 도파민 상승/하강 행동이 불명확 | 색과 문구가 규칙을 설명하지 못함 | 빨강/초록 체계와 짧은 HUD 범례 추가 |
| 벽돌깨기처럼 빨강/초록 활용 | 두 미니게임의 시각 언어를 맞추라는 요구 | 자극/위험은 빨강, 완화/감소는 초록 |
| 슈팅게임에서 도파민 조절 원리가 불명확 | 적 처치, 피격, 캡슐, 기술의 도파민 효과가 한눈에 안 보임 | 튜토리얼과 인게임 피드백 강화 |
| +, 탄, 방 적을 부수면 어떻게 되는지 모름 | 적 라벨이 전투 역할처럼 보이고 도파민 효과가 안 보임 | 적 라벨/색/처치 피드백을 `+3` 중심으로 명확화 |

## Current Rules To Preserve

| 행동 | 현재 효과 |
| --- | --- |
| 적 처치 | 도파민 `+3` |
| 피격 | 도파민 `+10` |
| 자극 캡슐 | 도파민 `+8` |
| 안정 캡슐 | 도파민 `-10` |
| 흡수 필터 | 도파민 `-25` |
| 시간 경과 | 도파민 자연 감소, 높은 도파민일수록 감소량 증가 |
| 수용체 게이트 | 도파민을 `55` 쪽으로 보정 |

## File Map

| 파일 | 역할 | 변경 이유 |
| --- | --- | --- |
| `sub_games/shooting.js` | 슈팅게임 표시, 충돌, 도파민 변화 피드백 | 색상 체계, 범례, 떠오르는 변화량 텍스트, 적 라벨 정리 |
| `story-data-v1.js` | 실제 로드되는 첫 슈팅게임 튜토리얼 | 본게임에서 플레이어가 보는 규칙 설명 강화 |
| `story-data-excel.js` | 첫 슈팅게임 튜토리얼 | 실제 본게임 진입 전 규칙 설명 강화 |
| `game.js` | 기본 슈팅 튜토리얼 | 옵션 없는 슈팅 진입에서도 같은 설명 제공 |
| `sub_games/슈팅_현재_게임디자인.md` | 현재 디자인 문서 | 최신 시각 규칙과 도파민 조절 원리 기록 |
| `tests/shooter-dopamine-balance.test.js` | 슈팅 회귀 테스트 | 색상/라벨/도파민 변화 피드백 규칙 고정 |

---

## Priority Order

1. **P0 색상 의미 통일:** 도파민 상승은 빨강, 감소는 초록으로 고정한다.
2. **P0 적 처치 의미 명확화:** `+`, `탄`, `방`이 모두 처치 시 도파민 `+3`이라는 점을 화면에서 드러낸다.
3. **P1 변화량 피드백 추가:** 적 처치, 피격, 캡슐, 흡수 사용 시 `+3`, `+10`, `-10`, `-25`가 짧게 떠오르게 한다.
4. **P1 튜토리얼 보강:** 도파민 조절 원리와 색상 규칙을 첫 플레이 전에 설명한다.
5. **P2 문서/검증 정리:** 현재 디자인 문서와 테스트를 갱신한다.

---

### Task 1: Add Regression Coverage For Clarity Rules

**Files:**
- Modify: `tests/shooter-dopamine-balance.test.js`

- [ ] **Step 1: Add failing assertions for color semantics and labels**

Add these assertions inside `runTests()` after creating `calm`.

```js
assert.strictEqual(calm.getDopamineDeltaColor(1), "#ff5d73", "positive dopamine delta uses red");
assert.strictEqual(calm.getDopamineDeltaColor(-1), "#7be0b7", "negative dopamine delta uses green");
assert.strictEqual(calm.enemyKillDopamine, 3, "enemy defeats raise dopamine by 3");
assert.ok(calm.getEnemyRoleText("drone").includes("+3"), "drone explains dopamine gain");
assert.ok(calm.getEnemyRoleText("shooter").includes("+3"), "shooter explains dopamine gain");
assert.ok(calm.getEnemyRoleText("tank").includes("+3"), "tank explains dopamine gain");
```

- [ ] **Step 2: Add failing assertion for floating dopamine feedback**

Add this after `calm.useAbsorbSkill(...)`.

```js
assert.ok(
  calm.floatTexts.some((entry) => entry.text.includes("-25") && entry.color === "#7be0b7"),
  "absorb skill creates green floating dopamine feedback"
);
```

- [ ] **Step 3: Run the test and confirm RED**

Run:

```powershell
node .\tests\shooter-dopamine-balance.test.js
```

Expected before implementation: failure because `getDopamineDeltaColor`, `getEnemyRoleText`, or `floatTexts` does not exist.

---

### Task 2: Introduce A Shared Dopamine Visual Language

**Files:**
- Modify: `sub_games/shooting.js`

- [ ] **Step 1: Add constants and feedback storage**

In `constructor`, add:

```js
this.dopamineUpColor = "#ff5d73";
this.dopamineDownColor = "#7be0b7";
```

In `resetGame()`, add:

```js
this.floatTexts = [];
```

- [ ] **Step 2: Add visual helper methods**

Add methods near `addDopamine(amount)`.

```js
getDopamineDeltaColor(amount) {
  return amount < 0 ? this.dopamineDownColor : this.dopamineUpColor;
}

addFloatingText(text, x, y, amount) {
  this.floatTexts.push({
    text,
    x,
    y,
    age: 0,
    duration: 42,
    color: this.getDopamineDeltaColor(amount)
  });
}

updateFloatingTexts() {
  for (const entry of this.floatTexts) {
    entry.age++;
    entry.y -= 0.45;
  }
  this.floatTexts = this.floatTexts.filter((entry) => entry.age < entry.duration);
}
```

- [ ] **Step 3: Draw floating feedback**

Call `this.updateFloatingTexts()` in `updateGame()` after `this.updateSkillVisual()`.

Add `drawFloatingTexts()` and call it near the end of `drawGame()`.

```js
drawFloatingTexts() {
  for (const entry of this.floatTexts) {
    fill(entry.color);
    textAlign(CENTER, CENTER);
    textSize(15);
    text(entry.text, entry.x, entry.y);
  }
}
```

- [ ] **Step 4: Verify GREEN for helper tests**

Run:

```powershell
node .\tests\shooter-dopamine-balance.test.js
```

Expected: remaining failures only for missing calls or enemy role text.

---

### Task 3: Attach Feedback To Actual Dopamine Events

**Files:**
- Modify: `sub_games/shooting.js`

- [ ] **Step 1: Show feedback when collecting capsules**

In `collectItem(item)`, after dopamine changes:

```js
this.addFloatingText(`${this.calmItemDopamine}`, item.x, item.y - 18, this.calmItemDopamine);
```

For stim:

```js
this.addFloatingText(`+${this.stimItemDopamine}`, item.x, item.y - 18, this.stimItemDopamine);
```

- [ ] **Step 2: Show feedback on enemy defeat**

In `handleEnemyDefeat(enemy)`, after `this.addDopamine(this.enemyKillDopamine)`:

```js
this.addFloatingText(`+${this.enemyKillDopamine}`, enemy.x, enemy.y - enemy.r - 12, this.enemyKillDopamine);
this.resultText = `${this.getEnemyRoleText(enemy.type)} 처치: 도파민 +${this.enemyKillDopamine}`;
```

- [ ] **Step 3: Show feedback on hit and absorb**

In `takeHit()`, after `this.addDopamine(10)`:

```js
this.addFloatingText("+10", this.player.x, this.player.y - 32, 10);
```

In `useAbsorbSkill(upgrade)`, after `this.addDopamine(this.absorbSkillDopamine)`:

```js
this.addFloatingText(`${this.absorbSkillDopamine}`, this.player.x, this.player.y - 38, this.absorbSkillDopamine);
```

- [ ] **Step 4: Run tests**

Run:

```powershell
node .\tests\shooter-dopamine-balance.test.js
```

Expected: PASS for floating feedback assertions.

---

### Task 4: Make Enemy Meanings Readable

**Files:**
- Modify: `sub_games/shooting.js`

- [ ] **Step 1: Add role text helper**

Add near `enemyLabel(type)`.

```js
getEnemyRoleText(type) {
  if (type === "shooter") return "탄 적(+3)";
  if (type === "tank") return "방 적(+3)";
  return "자극 적(+3)";
}
```

- [ ] **Step 2: Align enemy colors with dopamine meaning**

Use red/pink as the base “destroying this raises dopamine” cue, but keep silhouettes distinct.

```js
enemyColor(type) {
  if (type === "shooter") return "#ff7b8d";
  if (type === "tank") return "#d86c7f";
  return "#ff5d73";
}
```

- [ ] **Step 3: Update enemy labels**

Keep labels short, but include `+` where possible.

```js
enemyLabel(type) {
  if (type === "shooter") return "탄+";
  if (type === "tank") return "방+";
  return "+3";
}
```

- [ ] **Step 4: Run tests**

Run:

```powershell
node .\tests\shooter-dopamine-balance.test.js
```

Expected: PASS.

---

### Task 5: Add A Compact In-Game Legend

**Files:**
- Modify: `sub_games/shooting.js`

- [ ] **Step 1: Add a small legend under the HUD**

In `drawHud()`, after the control text, call:

```js
this.drawDopamineLegend(28, 88);
```

Add:

```js
drawDopamineLegend(x, y) {
  textAlign(LEFT, CENTER);
  textSize(12);
  noStroke();
  fill(this.dopamineUpColor);
  rect(x, y - 8, 16, 16, 4);
  fill("#eef4ee");
  text("빨강: 도파민 상승", x + 22, y);

  fill(this.dopamineDownColor);
  rect(x + 150, y - 8, 16, 16, 4);
  fill("#eef4ee");
  text("초록: 도파민 감소", x + 172, y);
}
```

- [ ] **Step 2: Check layout manually**

Use the minigame test entry point and confirm the legend does not overlap with the title, timer, or power meter.

---

### Task 6: Rewrite Tutorial Text

**Files:**
- Modify: `story-data-excel.js`
- Modify: `game.js`

- [ ] **Step 1: Update first story shooter tutorial**

Replace the first shooter tutorial with concise steps:

```js
"슈팅은 45초만 버티면 돼. 마우스로 움직이고 좌클릭을 꾹 누르면 자동으로 공격해.",
"빨간 적을 부수면 도파민이 조금 올라. 맞아도 도파민이 크게 올라가.",
"초록 안정 캡슐과 흡수 필터는 도파민을 낮춰. 초록색은 완화라고 보면 돼.",
"노란 P 캡슐은 파워 칸을 올려. 원하는 칸에서 우클릭하면 그 기술을 써.",
"탄 적은 총알을 쏘고, 방 적은 더 단단해. 하지만 적 처치는 모두 도파민 +3이야."
```

- [ ] **Step 2: Update default shooter tutorial**

Use the same concepts in `game.js#getDefaultMinigameTutorial(SUB_GAMES.SIDE_SHOOTER)`.

- [ ] **Step 3: Add test assertions**

In `tests/shooter-dopamine-balance.test.js`, assert the tutorial includes:

```js
assert.ok(tutorialText.includes("빨간") && tutorialText.includes("도파민"));
assert.ok(tutorialText.includes("초록") && tutorialText.includes("낮춰"));
assert.ok(tutorialText.includes("모두 도파민 +3"));
```

---

### Task 7: Update Current Design Doc And Verify

**Files:**
- Modify: `sub_games/슈팅_현재_게임디자인.md`

- [ ] **Step 1: Document the visual language**

Add a section under dopamine flow:

```md
색상 규칙은 벽돌깨기와 맞춘다.

| 색 | 의미 |
| --- | --- |
| 빨강/분홍 | 도파민 상승, 자극, 피격, 적 처치 |
| 초록/민트 | 도파민 감소, 안정 캡슐, 흡수 필터 |
| 노랑 | 파워 캡슐, 기술 선택 |
```

- [ ] **Step 2: Run full verification**

Run:

```powershell
node --check .\sub_games\shooting.js
node --check .\game.js
node --check .\story-data-excel.js
node .\tests\shooter-dopamine-balance.test.js
node .\tests\tutorial-overlay.test.js
node .\story-validator.js
```

Expected: all commands exit `0`.
