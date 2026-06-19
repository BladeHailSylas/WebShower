````text
Block Studio의 스타일 적용 불일치 문제를 조사하고, 아직 코드는 수정하지 말고 진단 보고서를 작성해 주세요.

## 배경

이 프로젝트는 React + TypeScript + Tailwind CSS + DaisyUI 기반의 교육용 웹 빌더입니다.
Block Studio는 일반 no-code 플랫폼이 아니라, 학생들이 블록 구조가 실제 HTML/CSS로 어떻게 연결되는지 이해하도록 돕는 기능입니다.

AGENTS.md의 원칙을 반드시 따르세요.

특히 다음 원칙을 지켜 주세요.

- 작업 범위는 Block Studio 관련 파일로 한정합니다.
- unrelated mini-projects, routes, layouts, pages, shared utilities는 수정하지 않습니다.
- shared file 변경이 필요해 보이면, 왜 필요한지 보고서에 먼저 설명합니다.
- `HtmlBlock` 모델을 교체하지 않습니다.
- slots migration을 하지 않습니다.
- `blockDefinitions`는 선언적 데이터로 유지합니다.
- definition 안에 JSX, mutation, compiler 로직, DnD 실행 로직을 넣지 않습니다.
- Code View 전용 HTML generator를 만들지 않습니다.
- Preview / Code View / Export가 같은 의미의 HTML/CSS 구조를 보여야 합니다.
- dnd-kit listener나 drag handle/edit handle 동작을 건드리지 않습니다.
- 이번 요청에서는 구현하지 말고, 조사와 보고서 작성만 합니다.

## 현재 증상

최근 LIST / LIST_ITEM 구현 이후, LIST_ITEM은 container-like block으로 정상 작동하는 것으로 보입니다.

하지만 LIST_ITEM 이외의 기존 구역/블록에서 background 스타일이 기대대로 반영되지 않는 문제가 있습니다.

재현 예시:

1. 일반 구역(CONTAINER)을 하나 추가합니다.
2. 그 안에 HEADING, IMAGE, PARAGRAPH를 각각 하나씩 넣습니다.
3. 일반 구역을 포함하여 각 요소에 연한 빨강 배경 스타일을 적용합니다.
4. 결과적으로 기대한 것은 각 블록의 박스 영역에 배경이 적용되는 것입니다.
5. 실제 화면에서는:
   - CONTAINER 배경이 구역 전체 박스에 깔리지 않는 것처럼 보입니다.
   - HEADING / PARAGRAPH의 배경이 블록 전체가 아니라 텍스트 주변에만 붙는 것처럼 보입니다.
   - IMAGE의 배경 적용 의미도 불명확합니다.
   - 최근 구현된 LIST_ITEM은 상대적으로 정상적으로 보입니다.

이 문제는 단순 UI polish가 아니라, “스타일 class가 어느 DOM 요소에 붙어야 하는가”가 일관되지 않은 문제일 가능성이 있습니다.

## 조사 목표

이번 작업의 목표는 구현이 아니라 다음을 밝히는 것입니다.

1. 각 블록의 스타일 className이 실제 어느 DOM 요소에 붙는지
2. Preview, Code View, Export에서 같은 스타일 의미가 유지되는지
3. LIST_ITEM은 왜 정상처럼 보이고, 기존 CONTAINER / CARD / GRID_ZONE / HEADING / PARAGRAPH / IMAGE 등은 왜 다르게 보이는지
4. background, padding, border, rounded, shadow 같은 box style이 블록의 루트 HTML 요소에 붙고 있는지
5. textColor, fontSize, fontWeight, textAlign 같은 text style이 box style과 같은 경로로 처리되는지
6. `transformGuiToTailwind` 또는 관련 style transformer가 Preview / Export / Compiler / Code View에서 어떻게 사용되는지
7. 최소 변경으로 문제를 고칠 수 있는 위치가 어디인지
8. 수정 시 회귀 위험이 큰 부분이 무엇인지

## 중점 조사 파일/영역

실제 repo 구조를 먼저 확인한 뒤, Block Studio 관련 파일만 조사해 주세요.

특히 다음 영역을 찾아 확인해 주세요.

- `HtmlBlock` 타입과 `StyleProps` 타입 정의
- `blockDefinitions`
- `editableFields`
- `BlockStylePanel`
- canvas block renderer / block body / block item 컴포넌트
- Preview renderer
- HTML compiler/export 관련 파일
- Code View가 사용하는 compile 경로
- `transformGuiToTailwind` 또는 유사한 style 변환 함수
- LIST / LIST_ITEM 구현부
- CONTAINER / CARD / GRID_ZONE / HEADING / PARAGRAPH / IMAGE / LINK / HR 구현부

파일명은 실제 repo에서 확인한 이름을 기준으로 보고해 주세요.

## 기대하는 기준 동작

아래 기준이 현재 코드와 맞는지 확인해 주세요. 맞지 않다면 어느 지점에서 어긋나는지 설명해 주세요.

### 구조 블록

- CONTAINER → 실제 HTML 의미상 `<div>` 루트에 box style이 적용되어야 합니다.
- CARD → 실제 HTML 의미상 `<div>` 루트에 box style이 적용되어야 합니다.
- GRID_ZONE → 실제 HTML 의미상 grid `<div>` 루트에 box style이 적용되어야 합니다.
- LIST → 실제 HTML 의미상 `<ul>` 루트에 box style이 적용되어야 합니다.
- LIST_ITEM → 실제 HTML 의미상 `<li>` 루트에 box style이 적용되어야 합니다.

### 일반 요소

- HEADING → `<h1>` 자체에 style class가 붙는 것이 가장 자연스럽습니다.
- PARAGRAPH → `<p>` 자체에 style class가 붙는 것이 가장 자연스럽습니다.
- LINK → `<a>` 또는 현재 link-like root element에 style class가 붙는 것이 자연스럽습니다.
- HR → `<hr>` 또는 현재 root element에 style class가 붙는 것이 자연스럽습니다.
- IMAGE → 별도 판단이 필요합니다. 현재 `<img>` 자체에 style이 붙는지, wrapper에 붙는지, 혹은 일부 style이 적용되지 않는지 확인해 주세요.

## 특별히 확인할 가설

다음 가설이 맞는지 확인해 주세요.

### 가설 A

HEADING / PARAGRAPH의 background style이 실제 `<h1>` / `<p>` 루트가 아니라 내부 text wrapper 또는 inline element에 붙고 있어서, 배경이 텍스트 주변에만 보일 수 있습니다.

### 가설 B

CONTAINER / CARD / GRID_ZONE의 styles가 preview root element까지 전달되지 않거나, editor shell element와 실제 rendered element가 분리되어 스타일이 엉뚱한 곳에 붙고 있을 수 있습니다.

### 가설 C

LIST_ITEM은 최근 container-like block으로 확장되면서 루트 `<li>`에 className을 붙이는 경로가 정리되었고, 기존 블록들은 예전 switch-based renderer 또는 별도 JSX 경로 때문에 스타일 적용 위치가 다를 수 있습니다.

### 가설 D

Preview와 HTML compiler/export가 서로 다른 style 적용 로직을 사용하고 있어, Preview에서 보이는 문제와 Code View / Export의 문제가 서로 다를 수 있습니다.

## 보고서 형식

다음 형식으로 보고서를 작성해 주세요.

### 1. 요약 결론

- 원인이 무엇으로 보이는지 3~7줄로 요약해 주세요.
- 구현 없이도 확실히 확인된 사실과, 아직 추정인 내용을 구분해 주세요.

### 2. 현재 스타일 처리 경로

다음 흐름을 실제 파일명과 함수명 기준으로 설명해 주세요.

````text
StylePanel input
→ HtmlBlock.styles 저장
→ transformGuiToTailwind 또는 관련 변환
→ Canvas rendering
→ Preview rendering
→ HTML compiler/export
→ Code View
````

각 단계에서 같은 helper를 공유하는지, 아니면 중복 로직이 있는지 표시해 주세요.

### 3. 블록별 DOM/class 적용 위치 표

아래 표 형식으로 작성해 주세요.

| Block type | Canvas DOM/class 위치 | Preview DOM/class 위치 | Export/Code View class 위치 | 문제 여부 | 메모 |
| ---------- | ------------------- | -------------------- | ------------------------- | ----- | -- |
| CONTAINER  |                     |                      |                           |       |    |
| CARD       |                     |                      |                           |       |    |
| GRID_ZONE  |                     |                      |                           |       |    |
| LIST       |                     |                      |                           |       |    |
| LIST_ITEM  |                     |                      |                           |       |    |
| HEADING    |                     |                      |                           |       |    |
| PARAGRAPH  |                     |                      |                           |       |    |
| IMAGE      |                     |                      |                           |       |    |
| LINK       |                     |                      |                           |       |    |
| HR         |                     |                      |                           |       |    |

### 4. LIST_ITEM과 기존 블록의 차이

LIST_ITEM이 정상적으로 보이는 이유를 기존 블록들과 비교해서 설명해 주세요.

특히 다음을 확인해 주세요.

* LIST_ITEM은 루트 `<li>`에 style class가 붙는지
* LIST_ITEM과 CONTAINER/CARD/GRID_ZONE이 같은 style helper를 쓰는지
* LIST_ITEM과 HEADING/PARAGRAPH가 다른 rendering 경로를 쓰는지
* LIST_ITEM 구현을 다른 container-like block의 참고 패턴으로 삼을 수 있는지

### 5. Preview / Code View / Export parity 분석

다음을 구분해서 보고해 주세요.

* Preview에서만 생기는 문제
* Export/Code View에도 같이 생기는 문제
* Preview와 Export가 서로 다른 HTML/class 의미를 갖는 문제

Code View는 기존 compiler/export 경로를 재사용해야 하며, Code View 전용 generator를 만들면 안 됩니다.

### 6. 최소 수정 후보

아직 코드는 수정하지 말고, 가능한 수정 전략을 2~3개 제안해 주세요.

각 전략마다 다음을 포함해 주세요.

* 수정 위치
* 예상 변경 파일
* 장점
* 단점
* 회귀 위험
* Preview / Code View / Export parity에 미치는 영향
* AGENTS.md 원칙과 충돌 여부

선호 방향은 다음입니다.

* box style은 각 블록의 실제 HTML root element에 붙입니다.
* HEADING/PARAGRAPH는 내부 span/text wrapper가 아니라 `<h1>`/`<p>` 자체에 background가 적용되도록 합니다.
* Preview 전용 patch보다 공통 style 변환/적용 경로를 우선 검토합니다.
* block별 예외 처리를 무작정 늘리지 않습니다.
* 다만 현재 Preview renderer가 switch-based라면 최소 case 보완은 허용 가능한 후보로 검토할 수 있습니다.

### 7. 명시적 제외 범위

이번 이슈 해결에서 건드리지 말아야 할 것을 명시해 주세요.

반드시 제외:

* `HtmlBlock` 모델 교체
* slots migration
* GRID_ZONE columns/gridChildren/2D array/per-column drop target/GRID_DROPPER 도입
* LIST ordered list/listKind/marker style 도입
* LIST에 일반 블록을 직접 drop하고 compiler가 자동으로 `<li>`로 감싸는 구조
* Code View 전용 generator
* 전역 theme 시스템
* responsive breakpoint 스타일 시스템
* 스타일 상속 기능
* StylePanel 대규모 UI 개편
* unrelated repository area 변경

### 8. 권장 수정 계획

보고서 마지막에 “권장 Phase 1 수정 계획”을 제안해 주세요.

형식:

```text
Phase 1 목표:
Phase 1에서 수정할 파일:
Phase 1에서 만들 파일:
Phase 1에서 수정하지 않을 것:
Phase 1 완료 후 기대 동작:
Phase 1 검증 방법:
```

단, 이번 응답에서는 실제 코드를 수정하지 마세요.

### 9. 검증 계획

수정이 승인되었을 때 실행할 검증 계획을 제안해 주세요.

가능하면 다음을 포함해 주세요.

* `npx.cmd tsc --noEmit`
* `npm.cmd run build`
* full lint가 막히는 경우 changed-file ESLint
* 수동 테스트

수동 테스트에는 최소한 다음을 포함해 주세요.

* CONTAINER에 background 적용
* CARD에 background 적용
* GRID_ZONE에 background 적용
* LIST와 LIST_ITEM에 background 적용
* HEADING/PARAGRAPH에 background 적용 시 텍스트 주변만 칠해지는지 확인
* IMAGE background/padding/border 동작 확인
* Preview 변경 확인
* Code View 변경 확인
* Export HTML 변경 확인
* drag handle 동작 확인
* edit handle 동작 확인
* nested block 이동 확인
* LIST_ITEM restriction 유지 확인
* GRID_ZONE children/gridCols 동작 유지 확인

## 응답 언어

보고서는 한국어로 작성해 주세요.

## 중요

이번 요청은 조사와 보고서 작성만입니다.
코드를 수정하지 마세요.
변경 파일이 없어야 합니다.

```