Block Studio Canvas UI의 두 가지 문제에 대해 원인을 조사하고 진단 보고서를 작성해 주세요.

이번 요청은 **조사와 원인 분석**입니다.
아직 코드를 수정하지 마세요.

## 배경

Block Studio는 React + TypeScript + Tailwind CSS + DaisyUI + Vite 기반의 교육용 웹 빌더입니다.

최근 다음 작업들이 완료되었습니다.

* 스타일 시스템 확장
* SLIDER_ZONE v1 / v1.1
* Learning Templates v1
* Code View v2

현재 주요 기능은 대체로 정상 작동하지만, Canvas UI에서 두 가지 시각적/위치 관련 문제가 확인되었습니다.

## 문제 1: GRID_ZONE 내부 구역 중첩 시 블록이 튀어나오는 문제

### 현상

`GRID_ZONE` 안에 여러 `CONTAINER` 또는 container-like block을 중첩해서 넣을 경우, 깊게 중첩된 구역이 부모 영역 안에 자연스럽게 수축되지 않고 오른쪽으로 튀어나오거나, grid column 영역을 넘어 보입니다.

이미지에서는 빨간색 사각형으로 강조된 구간입니다.

관찰된 특징:

* GRID_ZONE 안에서 구역을 여러 단계 중첩하면 문제가 두드러집니다.
* nested CONTAINER의 편집용 shell 또는 drop zone이 부모 column 너비 안에 맞춰 줄어들지 않는 것처럼 보입니다.
* 일반 root 또는 단순 container보다 GRID_ZONE 내부 중첩에서 더 눈에 띕니다.
* 실제 Preview/Export 문제라기보다 Canvas 편집 UI 문제일 가능성이 있습니다.

### 조사할 것

다음을 확인해 주세요.

1. GRID_ZONE의 Canvas DOM 구조와 className
2. GRID_ZONE direct child가 Canvas에서 어떤 wrapper 안에 렌더링되는지
3. CanvasBlockSlot / CanvasBlockItem / CanvasBlockBody / nested drop zone 구조
4. container-like block의 기본 width, min-width, padding, border, overflow 관련 class
5. GRID_ZONE column item이 `min-width: 0` 없이 콘텐츠 최소 폭 때문에 밀려나는지
6. nested block shell에 `w-full`, `min-w-*`, fixed width, flex shrink 관련 문제가 있는지
7. drag handle / edit handle / side rail이 실제 block width 계산에 영향을 주는지
8. dotted drop zone 또는 editor shell이 부모보다 큰 width를 강제하는지
9. GRID_ZONE의 Canvas layout과 Preview/Export layout이 어떻게 다른지
10. 이 문제가 Canvas에서만 발생하는지, Preview/Export에서도 유사하게 발생하는지

특히 CSS Grid 내부 item에서 흔한 문제인 `min-width: auto` / `min-w-0` / overflow 문제인지 확인해 주세요.

## 문제 2: 스크롤 후 StylePanel 위치가 선택 요소와 어긋나는 문제

### 현상

StylePanel은 선택된 블록 근처에 floating panel처럼 표시됩니다.

스크롤을 내리지 않은 상태에서는 선택 요소와 StylePanel이 비교적 잘 정렬됩니다.
하지만 Canvas를 아래로 스크롤한 뒤 블록을 선택하면, StylePanel이 선택 요소와 맞지 않고 위/아래 또는 옆으로 어긋납니다.

이미지에서는 보라색 사각형으로 강조된 구간입니다.

### 조사할 것

다음을 확인해 주세요.

1. StylePanel 위치 계산이 어디에서 이루어지는지
2. 선택된 block의 위치를 어떤 API로 측정하는지

   * 예: `getBoundingClientRect`
   * offsetTop / offsetLeft
   * scrollTop / scrollLeft
3. viewport 좌표와 scroll container 좌표를 혼용하고 있지 않은지
4. Canvas의 실제 scroll container가 window인지, 특정 div인지
5. StylePanel이 `position: absolute`인지 `fixed`인지
6. panel의 containing block이 어디인지
7. 스크롤 offset을 더하거나 빼는 계산이 누락되었는지
8. Canvas 내부 transform, scale, relative container, overflow 설정이 위치 계산에 영향을 주는지
9. 선택 후 scroll이 발생하거나 layout shift가 생기는지
10. nested block / GRID_ZONE 내부 block 선택 시 위치 계산이 더 크게 어긋나는지

특히 다음 가능성을 검토해 주세요.

* `getBoundingClientRect()`는 viewport 기준인데 panel은 scroll container 기준 absolute 위치를 사용하고 있음
* window scroll과 Canvas scroll container scroll을 혼동하고 있음
* panel이 viewport fixed 좌표로 배치되어야 하는데 부모 relative 좌표로 배치되고 있음
* scrollTop을 중복으로 더하거나 아예 반영하지 않고 있음

## 공통 조사 범위

실제 repo 구조를 확인하고, Block Studio 관련 파일만 조사해 주세요.

특히 다음 영역을 확인해 주세요.

* Canvas layout 관련 컴포넌트
* `BlockStudioLayout`
* `BlockCanvas`
* `CanvasBlockItem`
* `CanvasBlockBody`
* `CanvasBlockSlot`
* drag handle / edit handle 관련 컴포넌트
* StylePanel / floating editor 관련 컴포넌트
* selected block 상태 관리
* block position measurement 로직
* GRID_ZONE canvas 렌더링 경로
* container-like block canvas 렌더링 경로
* CSS class / Tailwind class / inline style 관련 로직

파일명과 함수명은 실제 repo 기준으로 보고해 주세요.

## 보고서 형식

다음 구조로 작성해 주세요.

### 1. 요약 결론

* 문제 1의 가장 가능성 높은 원인
* 문제 2의 가장 가능성 높은 원인
* 두 문제가 서로 관련되어 있는지
* Canvas 전용 문제인지, Preview/Export에도 영향이 있는지
* 바로 고치기 전에 주의해야 할 위험

### 2. 문제 1: GRID_ZONE 중첩 overflow 진단

다음을 포함해 주세요.

* 관련 파일과 컴포넌트
* 현재 DOM / wrapper 구조 요약
* GRID_ZONE Canvas layout 방식
* nested container shell 구조
* width / min-width / overflow / flex/grid 관련 class 분석
* 원인 후보별 가능성
* 가장 가능성 높은 원인
* Preview/Export 영향 여부
* 최소 수정 후보 2~3개
* 각 수정 후보의 위험

### 3. 문제 2: StylePanel scroll misalignment 진단

다음을 포함해 주세요.

* 관련 파일과 컴포넌트
* 현재 위치 계산 방식
* 사용하는 좌표계
* Canvas scroll container 구조
* panel positioning 방식
* scroll offset 처리 여부
* 원인 후보별 가능성
* 가장 가능성 높은 원인
* 최소 수정 후보 2~3개
* 각 수정 후보의 위험

### 4. 수정 우선순위 제안

두 문제 중 무엇을 먼저 고치는 것이 좋은지 제안해 주세요.

기준:

* DnD 회귀 위험
* Canvas layout 회귀 위험
* StylePanel 편집 회귀 위험
* 수정 범위
* 테스트 용이성

### 5. 권장 수정 계획

아직 구현하지 말고 계획만 제시해 주세요.

형식:

```text
Fix 1 목표:
수정할 파일:
수정 방식:
수정하지 않을 것:
검증 방법:

Fix 2 목표:
수정할 파일:
수정 방식:
수정하지 않을 것:
검증 방법:
```

두 문제를 한 번에 고치는 것이 위험하다면, 반드시 분리해서 제안해 주세요.

### 6. 명시적 제외 범위

이번 진단에서는 다음을 제외합니다.

* 코드 수정
* Canvas renderer 대규모 재작성
* DnD listener / drag handle / edit handle 변경
* HtmlBlock 모델 변경
* blockDefinitions 구조 변경
* Preview / Export / Code View 변경
* SLIDER_ZONE / TEMPLATE / 스타일 시스템 변경
* unrelated repository 변경

### 7. 검증 계획

수정이 승인되었을 때 실행할 검증 계획을 제안해 주세요.

자동 검증:

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run lint
git diff --check
```

필요 시 changed-file lint를 제안해 주세요.

수동 검증에는 최소한 다음을 포함해 주세요.

* GRID_ZONE 안에 CONTAINER 여러 단계 중첩
* GRID_ZONE 2열 / 3열 / 4열 각각 확인
* nested CONTAINER / CARD / LIST / SLIDER_ZONE 조합 확인
* Canvas에서 블록이 부모 column 밖으로 튀어나오지 않는지 확인
* Preview/Export는 기존과 동일한지 확인
* 스크롤하지 않은 상태에서 StylePanel 위치 확인
* 아래로 스크롤한 상태에서 StylePanel 위치 확인
* 깊게 중첩된 블록 선택 시 StylePanel 위치 확인
* GRID_ZONE 내부 블록 선택 시 StylePanel 위치 확인
* drag handle 정상 작동
* edit handle 정상 작동
* nested drop zone 정상 작동
* StylePanel 필드 편집 정상 작동
* 기존 DnD 이동/재정렬 회귀 없음

## 중요

이번 요청에서는 코드를 수정하지 마세요.
조사와 원인 분석 보고서만 작성해 주세요.

응답은 한국어로 작성해 주세요.
