현재 목표는 Block Studio에 새 블록을 추가하는 작업입니다.

이번 작업은 세 부분으로 나눕니다.

1. `HR` 블록 구현
2. `CARD` 블록 구현
3. `LIST` 블록은 구현하지 않고 설계 제안서만 작성

중요:

* HR과 CARD는 순차적으로 구현하세요.
* LIST는 이번 작업에서 구현하지 마세요.
* LIST 관련 타입, definition, renderer, compiler 코드를 추가하지 마세요.
* LIST는 설계 옵션과 추천안만 문서로 보고하세요.
* 관련 없는 mini-project, route, layout, shared app 구조는 건드리지 마세요.
* Block Studio 관련 파일만 수정하세요.
* AGENTS.md의 최신 원칙을 따르세요.

## 배경

이 프로젝트는 React + TypeScript + Tailwind CSS + DaisyUI 기반의 교육용 웹 빌더입니다.

현재 Block Studio의 요소 목록은 대략 다음과 같습니다.

### 구조 요소

* 일반 구역 만들기: `div` / `CONTAINER`
* 바둑판 구역 만들기: `grid-div` / `GRID_ZONE`

### 일반 요소

* 제목 넣기: `h1`
* 본문 넣기: `p`
* 이미지 넣기: `image`

### 기능 요소

* 비밀번호 구역 만들기: `PASSWORD_ZONE`
* 여닫는 구역 만들기: `TOGGLE_ZONE`
* 링크 이동 버튼 만들기: `a` / link button

최근 확인된 사항:

* StylePanel에서 content editing이 복구되었습니다.
* StylePanel 수정값이 Preview와 Code View에 실시간 반영됩니다.
* Code View는 기존 compiler/export 경로를 재사용합니다.
* inline input은 당장 구현하지 않습니다.
* GRID_ZONE은 현재 잘 작동하므로 이번 범위에서 건드리지 않습니다.

이번 새 블록 추가의 목적:

* 정적 페이지를 만드는 데 필요한 기본 재료를 보강합니다.
* blockDefinitions-driven 구조가 새 블록 추가에도 잘 작동하는지 확인합니다.
* Preview / Code View / Export가 새 블록에서도 일관되게 동작하는지 확인합니다.

## 전체 범위

### 이번에 구현할 것

#### 1. HR 블록

사용 목적:

* 섹션 구분
* 문서 흐름 구분
* 간단한 정적 페이지 구성 보강

예상 HTML:

```html
<hr />
```

또는 compiler 구조상 self-closing이 어렵다면:

```html
<hr>
```

필수 특성:

* children 없음
* content 없음
* inline input 없음
* StylePanel에서 최소 스타일 옵션 제공
* Preview / Code View / Export 반영

권장 기본 스타일:

* 위아래 여백: 보통
* 선 색상: 연하게
* 선 두께: 얇게 또는 보통
* 실선

가능한 style field 후보:

* `styles.marginY` 또는 현재 style system에 맞는 spacing field가 이미 있다면 재사용
* `styles.borderColor` 또는 현재 color style system에 맞는 field가 있다면 재사용
* 너무 큰 모델 변경이 필요하다면 이번에는 기본 className preset만 사용하고, 추가 style option은 보고서에 후속 제안으로 남기세요.

HR은 매우 단순해야 합니다. HR 구현을 위해 `HtmlBlock` 모델을 크게 확장하지 마세요.

#### 2. CARD 블록

사용 목적:

* 콘텐츠를 보기 좋게 묶는 카드형 구역
* 프로필, 공지, 상품, 프로젝트 소개, 갤러리 항목 등에 재사용 가능
* 정적 페이지 구성에서 활용도가 높음

예상 HTML:

```html
<div class="...card-like styles...">
  ...
</div>
```

필수 특성:

* container-like block
* `children` 사용
* 기존 `CONTAINER`와 유사한 child/drop 동작
* 기본적으로 카드처럼 보이는 style preset 필요
* Preview / Code View / Export 반영
* StylePanel에서 기존 common style editing 유지

권장 기본 스타일:

* 배경: 흰색 또는 현재 디자인과 어울리는 neutral background
* padding: 보통
* rounded: 보통 이상
* border: 얇게
* shadow: 약하게
* children drop 가능

중요:

* CARD는 새로운 data model이 아니라, card-like preset을 가진 container-like block으로 구현하는 것이 좋습니다.
* 가능하면 기존 `CONTAINER` 구현 선례를 따르세요.
* CARD 구현을 위해 slots, special children model, GRID_ZONE 관련 구조를 도입하지 마세요.

### 이번에 구현하지 않을 것

#### LIST 블록

LIST는 구현하지 않습니다.

대신 설계 제안서를 작성하세요.

LIST는 다음 결정이 필요하기 때문입니다.

* `LIST` + `LIST_ITEM` 구조로 갈 것인가?
* `LIST.children`에 기존 P 블록을 허용할 것인가?
* list item을 block으로 만들 것인가, 데이터 배열로 만들 것인가?
* `ul` / `ol` 전환은 style option인가, 구조 option인가?
* list item 추가/삭제 UX는 StylePanel인가, canvas인가?
* Code View/export에서 `<ul><li>...</li></ul>`를 어떻게 안정적으로 만들 것인가?

따라서 이번 작업에서는 LIST 관련 코드를 만들지 말고, 설계 옵션과 추천안을 보고하세요.

## 중요한 제약

### Code View

Code View는 기존 compiler/export 결과를 보여주는 viewer입니다.

* Code View 전용 HTML generator를 만들지 마세요.
* 새 블록도 기존 compiler 경로에 연결되어야 합니다.
* Code View가 새 블록을 보여주기 위해 별도 block type switch를 추가하면 안 됩니다.
* 정상 흐름은 다음입니다.

```text
block definition / htmlSchema / htmlExporterKey
→ compileBlockHtml
→ compileBlocksForCodeView
→ Code View display
```

### blockDefinitions-driven 구조

새 블록은 가능한 한 definition-driven 방식으로 추가하세요.

좋은 방향:

```text
definition 추가
→ palette에 자동 반영
→ factory가 template clone
→ canvas renderer가 definition/childFields/htmlSchema를 사용
→ StylePanel이 editableFields 사용
→ compiler가 htmlSchema 사용
```

나쁜 방향:

```text
BlockPalette에 hardcoded item 추가
BlockStylePanel에 block.type 조건문 추가
Code View에 block.type 조건문 추가
compiler에 불필요한 special case 추가
```

단, 현재 구조상 Preview 또는 Canvas 렌더러에 block type 분기가 필요한 경우는 최소한으로 허용합니다. 기존 패턴을 따르되, 새 블록 하나 때문에 대규모 구조 변경은 하지 마세요.

### 제외 범위

이번 작업에서 다음은 하지 마세요.

* LIST 구현
* inline input
* GRID_ZONE 안정화
* gridGap 추가
* GRID_DROPPER
* slots migration
* HtmlBlock 모델 대수정
* Code View generator 재작성
* compiler/export 대규모 리팩터링
* Canvas DnD 구조 변경
* DragHandle / EditHandle 이벤트 변경
* unrelated mini-project 수정

## Step 1. 현재 새 블록 추가 구조 확인

먼저 repo를 읽고, 새 block을 추가할 때 필요한 실제 파일과 패턴을 확인하세요.

예상 확인 파일:

* `AGENTS.md`
* `src/types/types.ts`
* `src/features/block-studio/blocks/definitions/index.ts`
* `src/features/block-studio/blocks/definitions/*.definition.ts`
* `src/features/block-studio/blocks/types/blockDefinition.types.ts`
* `src/features/block-studio/blocks/types/childField.types.ts`
* `src/features/block-studio/blocks/types/htmlSchema.types.ts`
* `src/features/block-studio/blocks/types/editableField.types.ts`
* `src/components/block/BlockPalette.tsx`
* `src/components/block/canvas/CanvasBlockBody.tsx`
* `src/components/block/canvas/CanvasBlockSlot.tsx`
* `src/components/block/preview/PreviewBlockRenderer.tsx`
* `src/components/block/editor/BlockStylePanel.tsx`
* `src/features/block-studio/blocks/html/blockHtmlCompiler.ts`
* `src/features/block-studio/blocks/html/htmlSchemaCompiler.ts`
* `src/features/block-studio/blocks/html/transformGuiToTailwind.ts`

실제 파일 구조가 다르면 실제 경로를 따르세요.

## Step 2. HR 블록 구현

HR을 먼저 구현하세요.

목표:

* palette에 HR 블록 표시
* canvas에 HR 블록 추가 가능
* StylePanel에서 가능한 최소 스타일 편집 가능
* Preview에서 실제 구분선처럼 보임
* Code View에 `<hr ...>` 출력
* Export HTML에 동일하게 반영
* DnD 가능
* children 없음

구현 방식:

* 새 definition 파일 추가가 현재 패턴에 맞으면 추가하세요.
* `template`에는 현재 `HtmlBlock` 구조에 맞는 최소 필드를 넣으세요.
* `htmlSchema`로 처리 가능한지 우선 검토하세요.
* self-closing tag 지원이 없다면 기존 compiler 구조를 크게 바꾸지 말고 안전한 방식으로 처리하세요.
* HR 전용 custom exporter는 가능하면 피하세요. 다만 현재 htmlSchema로 `<hr>`가 안전하게 표현되지 않는다면 최소 변경을 선택하고 이유를 보고하세요.

주의:

* HR에 content를 추가하지 마세요.
* HR에 children을 추가하지 마세요.
* HR 때문에 tree/drop 구조를 바꾸지 마세요.

## Step 3. CARD 블록 구현

HR 구현 후 CARD를 구현하세요.

목표:

* palette에 CARD 블록 표시
* canvas에 CARD 블록 추가 가능
* CARD 안에 child block 추가 가능
* 기존 CONTAINER와 유사하게 nested DnD 가능
* Preview에서 카드처럼 보임
* Code View / Export에서 card-like div로 출력
* StylePanel에서 기존 common style editing 가능

구현 방식:

* 기존 `CONTAINER` definition과 canvas/preview/export 패턴을 우선 따르세요.
* `children` 단일 배열을 사용하세요.
* `childFields`는 기존 container-like pattern을 따르세요.
* `htmlSchema`는 가능하면 `{ tag: "div", childField: "children" }` 형태를 활용하세요.
* card-like 기본 스타일은 `styles.className` 또는 현재 style system에 맞는 방식으로 template에 넣으세요.
* transform/export 경로에서 className이 이미 처리된다면 그 흐름을 사용하세요.

주의:

* CARD를 GRID_ZONE처럼 special layout block으로 만들지 마세요.
* CARD 전용 drop engine을 만들지 마세요.
* CARD 때문에 child model을 확장하지 마세요.
* CARD는 card-like preset container로 시작하세요.

## Step 4. LIST 설계 제안서 작성

LIST는 구현하지 말고 보고서만 작성하세요.

보고서 제목:

```text
# LIST Block Design Proposal
```

반드시 다음 질문에 답하세요.

### 1. LIST의 교육적/실용적 가치

* 어떤 페이지에서 활용되는가?
* 기존 H1/P/IMAGE/CARD/HR/CONTAINER와 어떻게 조합되는가?
* HTML 기초 교육 측면에서 어떤 의미가 있는가?

### 2. 가능한 데이터 모델 후보

최소 4가지 후보를 비교하세요.

#### 후보 A: LIST block + LIST_ITEM internal block

```text
LIST
└─ LIST_ITEM
   └─ content
```

#### 후보 B: LIST block with item array

```ts
items: string[]
```

#### 후보 C: LIST block children에 P 또는 일반 block 허용

```text
LIST
└─ P
└─ P
```

#### 후보 D: textarea 기반 multi-line input

```text
StylePanel textarea
각 줄 → li
```

필요하다면 더 좋은 후보를 추가해도 됩니다.

각 후보에 대해:

* data model
* canvas UX
* StylePanel UX
* preview/export/code behavior
* DnD 적합성
* blockDefinitions-driven 구조와의 정합성
* 구현 난이도
* 교육적 가치
* 위험

을 비교하세요.

### 3. ul / ol 전환

다음을 판단하세요.

* `ul`과 `ol`을 별도 block type으로 둘 것인가?
* 하나의 LIST block에 `styles.listType` 또는 `listType` field를 둘 것인가?
* 이것이 style인지 semantic structure인지 판단하세요.
* Preview / Code View / Export에 미치는 영향을 설명하세요.

### 4. list item 추가/삭제 UX

다음을 비교하세요.

* StylePanel에서 item 배열 편집
* canvas 안에서 item 추가 버튼
* LIST_ITEM block을 palette에서 추가
* LIST 안에서만 LIST_ITEM 추가 허용
* P block을 list item처럼 허용

### 5. 추천안

반드시 하나를 추천하세요.

추천 기준:

* 교육적 가치
* 구현 단순성
* 유지보수성
* DnD 안정성
* blockDefinitions-driven 구조
* Code View/export clarity

추천안에는 다음을 포함하세요.

* 첫 구현 범위
* 후속 확장 가능성
* 하지 말아야 할 것
* regression checklist

## Step 5. 검증

HR/CARD 구현 후 가능한 검증을 실행하세요.

우선:

* `npx.cmd tsc --noEmit`

가능하면:

* `npm.cmd run build`
* changed-file lint

full build/lint가 unrelated mini-project 문제로 실패하면 관련/무관 오류를 분리 보고하세요.

## 완료 보고서에 포함할 내용

작업 완료 후 다음을 보고하세요.

## 1. Summary

* HR 구현 여부
* CARD 구현 여부
* LIST는 구현하지 않았고 설계 제안서만 작성했는지

## 2. Changed Files

* 파일별 변경 내용

## 3. HR Behavior

* palette
* canvas
* StylePanel
* preview
* Code View
* export

## 4. CARD Behavior

* palette
* canvas
* children/drop
* StylePanel
* preview
* Code View
* export

## 5. LIST Block Design Proposal

* 위 Step 4 형식대로 작성

## 6. Validation Results

* 실행한 명령
* 성공/실패
* unrelated error 구분

## 7. Manual Regression Checklist

### HR

* palette에서 HR 추가 가능
* canvas에서 HR 선택 가능
* StylePanel 표시
* Preview에서 구분선 표시
* Code View에서 `<hr>` 출력
* Export HTML 반영
* 기존 DnD 회귀 없음

### CARD

* palette에서 CARD 추가 가능
* canvas에서 CARD 선택 가능
* CARD 안에 H1/P/IMAGE/A 등을 추가 가능
* CARD 안팎으로 block 이동 가능
* Preview에서 카드처럼 표시
* Code View/export에서 card-like div 출력
* StylePanel style edit 가능

### Existing Features

* H1/P content edit 유지
* Link content/link edit 유지
* Image src edit 유지
* Password answer edit 유지
* GRID_ZONE 기존 동작 유지
* Code View compiler 재사용 유지
* QR/export 기존 동작 유지
