현재 목표는 기존 `LIST Block Design Proposal`을 참고하되, 수정된 설계 기준에 따라 **LIST v1 구현 계획서**를 작성하는 것입니다.

중요:

* 아직 코드를 수정하지 마세요.
* 아직 LIST를 구현하지 마세요.
* 이번 요청은 구현 계획서 작성입니다.
* 기존 `list-block-design-proposal.md`를 참고하되, 아래 수정된 설계 기준을 우선 적용하세요.
* 관련 없는 mini-project, route, layout, shared app 구조는 건드리지 마세요.
* Block Studio 관련 파일만 조사하세요.
* AGENTS.md의 최신 원칙을 따르세요.

## 배경

현재 Block Studio에는 다음 요소가 있습니다.

### 구조 요소

* 일반 구역 만들기: `CONTAINER` / `div`
* 바둑판 구역 만들기: `GRID_ZONE` / grid-div
* 카드 구역 만들기: `CARD` / card-like div

### 일반 요소

* 제목 넣기: `HEADING` / h1
* 본문 넣기: `PARAGRAPH` / p
* 이미지 넣기: `IMAGE`
* 구분선 넣기: `HR`

### 기능 요소

* 비밀번호 구역 만들기: `PASSWORD_ZONE`
* 여닫는 구역 만들기: `TOGGLE_ZONE`
* 링크 이동 버튼 만들기: `LINK` / a

최근 작업:

* StylePanel content editing이 복구되었습니다.
* HR와 CARD가 구현되었습니다.
* Code View는 기존 compiler/export 경로를 재사용합니다.
* GRID_ZONE은 잘 작동하므로 이번 범위가 아닙니다.
* inline input은 아직 구현하지 않습니다.

## 기존 LIST 보고서 요약

기존 보고서는 LIST 구현 방향으로 다음을 추천했습니다.

* `LIST` + internal `LIST_ITEM`
* `LIST_ITEM`은 palette에 노출하지 않음
* `LIST` 내부에서만 item을 추가하는 방식 선호
* `items: string[]` 같은 별도 배열 모델은 피함
* Code View 전용 generator를 만들지 않음
* 기존 compiler/export 경로 사용
* `ul/ol`은 `listKind` 같은 semantic field로 전환할 수 있다고 제안

## 수정된 설계 기준

아래 기준을 기존 보고서보다 우선 적용하세요.

### 1. LIST v1은 unordered list만 지원합니다

v1에서는 `ul`만 지원합니다.

즉:

```text
LIST
→ always <ul>

LIST_ITEM
→ always <li>
```

이번 v1 계획에서 `ol`은 구현하지 않습니다.

### 2. listKind 또는 ordered/unordered 전환 field를 넣지 않습니다

v1에서는 다음을 추가하지 마세요.

* `listKind`
* `ordered`
* `isOrdered`
* `styles.listType`
* `ul/ol` 전환 select
* ordered list start value
* marker style option

이유:

* `listKind`에 따라 `ul/ol`을 바꾸려면 preview/compiler/renderer에 semantic 분기가 생길 수 있습니다.
* 이번 단계에서는 definition 밖의 예외 처리를 늘리지 않는 것이 더 중요합니다.
* v1의 목표는 LIST/LIST_ITEM의 block structure와 HTML mapping을 검증하는 것입니다.

### 3. ol이 필요해지면 후속 별도 blockDefinition으로 검토합니다

나중에 ordered list가 정말 필요해지면 다음 방식이 더 적절한 후보입니다.

```text
UNORDERED_LIST
→ htmlSchema.tag = "ul"

ORDERED_LIST
→ htmlSchema.tag = "ol"

LIST_ITEM
→ htmlSchema.tag = "li"
```

즉, `ul/ol` 차이는 compiler나 renderer의 runtime semantic switch가 아니라, blockDefinition의 declarative tag 차이로 표현하는 방향을 우선 검토합니다.

다만 이건 후속 후보일 뿐, 이번 LIST v1에는 포함하지 않습니다.

### 4. v1의 핵심은 tag/structure 우선입니다

v1은 스타일 확장이 아니라 HTML 구조 학습을 우선합니다.

핵심 목표:

* `LIST`가 `<ul>`이 된다.
* `LIST_ITEM`이 `<li>`가 된다.
* Code View에서 `ul > li` 구조가 보인다.
* Export HTML도 같은 구조를 쓴다.
* DnD와 tree update가 안정적으로 동작한다.

이번 v1에서 과도한 스타일 옵션은 넣지 마세요.

허용:

* 기본적으로 보기 무너지지 않는 최소 class preset
* 기존 common style field 재사용

비허용:

* list marker style option
* ordered/unordered option
* complex spacing model
* nested list behavior
* list item rich editor
* inline input

## 이번 계획서에서 반드시 답해야 할 질문

### 1. LIST v1의 최소 block model

다음을 계획해 주세요.

* public block: `LIST`
* internal block: `LIST_ITEM`
* LIST는 `children` 단일 배열을 가지는가?
* LIST의 childFields는 `LIST_ITEM`만 허용할 수 있는가?
* LIST_ITEM은 `content`를 가지는가?
* LIST_ITEM은 children을 가지지 않는 단순 text item으로 시작하는가?
* LIST_ITEM이 internal block이면 palette에는 노출하지 않는가?
* LIST 생성 시 기본 LIST_ITEM을 몇 개 넣을 것인가?

  * 예: 2개 또는 3개
* item 추가/삭제 UX는 v1에서 구현할 것인가, 아니면 기본 items만 제공하고 편집은 StylePanel로 할 것인가?

### 2. LIST_ITEM 추가/삭제 UX의 v1 범위

v1에서 item 추가/삭제를 어느 수준까지 할지 제안해 주세요.

가능 후보:

* A. v1에서는 LIST 생성 시 기본 LIST_ITEM 3개만 제공하고, item 추가/삭제는 후속
* B. StylePanel 또는 canvas에 간단한 “항목 추가” 버튼 제공
* C. LIST 내부 canvas에만 item 추가 버튼 제공
* D. LIST_ITEM을 palette에는 노출하지 않되 내부 action으로만 추가
* E. item 삭제는 기존 block delete로 처리

각 후보의 구현 난이도, DnD 영향, UX, data-driven 구조와의 관계를 비교하고 추천하세요.

### 3. StylePanel editing

다음을 계획해 주세요.

* LIST_ITEM content는 StylePanel에서 수정하는가?
* LIST 자체는 어떤 editableFields를 가지는가?
* LIST_ITEM은 어떤 editableFields를 가지는가?
* inline input은 이번에 제외하는가?
* textarea는 제외하는가?
* content edit이 Preview / Code View / Export에 반영되는 경로는 기존 구조를 따르는가?

### 4. Preview / Code View / Export

다음을 계획해 주세요.

* LIST는 어떻게 `<ul>`로 preview/export되는가?
* LIST_ITEM은 어떻게 `<li>`로 preview/export되는가?
* htmlSchema만으로 처리 가능한가?
* htmlSchema가 `ul` / `li` tag를 지원하지 않는다면 어떤 최소 타입 확장이 필요한가?
* compiler에 `if block.type === "LIST"` 같은 special case를 추가하지 않고 처리 가능한가?
* Code View는 기존 compiler 결과만 보여주는가?
* HR 구현 때 추가된 selfClosing 처리와 충돌하지 않는가?

### 5. Canvas rendering / DnD

다음을 계획해 주세요.

* CanvasBlockBody에 LIST/LIST_ITEM 분기가 필요한가?
* 필요하다면 최소 분기인가?
* LIST의 child slot은 기존 CanvasBlockSlot을 쓸 수 있는가?
* LIST_ITEM은 일반 block처럼 sortable item으로 동작하는가?
* LIST_ITEM이 LIST 밖으로 나가거나, LIST가 아닌 부모에 drop되는 것을 막을 수 있는가?
* 현재 dropPolicy/childFields 구조만으로 가능한가?
* 불가능하다면 어떤 최소 확장이 필요한가?
* LIST_ITEM이 root canvas나 CARD/CONTAINER에 drop되지 않게 하려면 어디서 제한해야 하는가?

### 6. 기존 구조에 미치는 영향

다음을 확인하고 계획에 포함하세요.

* BlockType 추가 범위
* HtmlBlock model 변경 필요 여부
* editableField types 변경 필요 여부
* childFields/dropPolicy 변경 필요 여부
* htmlSchema tag union 확장 필요 여부
* PreviewBlockRenderer 변경 필요 여부
* CanvasBlockBody 변경 필요 여부
* blockDropEngine 변경 필요 여부
* Code View 변경 필요 여부

### 7. 추천 구현 순서

작고 검증 가능한 phase로 계획하세요.

예상 후보:

```text
Phase 1:
LIST/LIST_ITEM definition + types + htmlSchema tag 지원

Phase 2:
Preview/Code View/Export 연결

Phase 3:
Canvas/DnD/drop restriction 연결

Phase 4:
StylePanel에서 LIST_ITEM content 수정

Phase 5:
선택한 item 추가/삭제 UX 구현, 또는 후속으로 보류
```

실제 repo 구조를 보고 더 적절한 순서를 제안해도 됩니다.

## 명시적 제외 범위

이번 v1 계획에서 다음은 제외하세요.

* ordered list / `ol`
* `listKind`
* marker style option
* ordered start value
* nested list
* arbitrary `items: string[]`
* textarea 기반 multi-line list
* inline input
* LIST_ITEM palette 노출
* slots migration
* Code View 전용 generator
* compiler special-case explosion
* GRID_ZONE 관련 변경
* gridGap
* GRID_DROPPER

## 조사 대상 파일

실제 repo 기준으로 확인하고, 정확한 경로를 보고하세요.

우선 확인할 것으로 예상되는 파일:

* `AGENTS.md`
* `src/types/types.ts`
* `src/features/block-studio/blocks/definitions/index.ts`
* `src/features/block-studio/blocks/definitions/*.definition.ts`
* `src/features/block-studio/blocks/types/blockDefinition.types.ts`
* `src/features/block-studio/blocks/types/childField.types.ts`
* `src/features/block-studio/blocks/types/htmlSchema.types.ts`
* `src/features/block-studio/blocks/types/editableField.types.ts`
* `src/features/block-studio/blocks/drop/*`
* `src/features/block-studio/blocks/tree/*`
* `src/components/block/BlockPalette.tsx`
* `src/components/block/canvas/CanvasBlockBody.tsx`
* `src/components/block/canvas/CanvasBlockSlot.tsx`
* `src/components/block/canvas/CanvasBlockItem.tsx`
* `src/components/block/preview/PreviewBlockRenderer.tsx`
* `src/components/block/editor/BlockStylePanel.tsx`
* `src/components/block/editor/EditableFieldControl.tsx`
* `src/features/block-studio/hooks/useBlockMutations.ts`
* `src/features/block-studio/blocks/html/blockHtmlCompiler.ts`
* `src/features/block-studio/blocks/html/htmlSchemaCompiler.ts`

실제 파일 구조가 다르면 실제 경로를 따르세요.

## 출력 형식

다음 형식으로 계획서를 작성하세요.

# LIST v1 Implementation Plan

## 1. Executive Summary

* v1 scope
* unordered-only decision
* expected complexity
* biggest risk

## 2. Design Corrections from Previous Proposal

* `listKind` 제거
* ordered list 제외
* `ol`은 future separate blockDefinition 후보
* v1은 `<ul>/<li>` structure 검증

## 3. File Map

표 형식:
| Area | File | Responsibility | Change Needed? | Notes |

## 4. Proposed Data Model

* LIST
* LIST_ITEM
* default template shape
* internal/public 여부
* childFields
* editableFields
* dropPolicy

## 5. Preview / Code View / Export Plan

* htmlSchema 가능 여부
* 필요한 tag union 확장
* compiler special case 필요 여부
* Code View 영향

## 6. Canvas / DnD Plan

* canvas rendering
* sortable behavior
* LIST_ITEM parent restriction
* add/delete/reorder behavior
* 필요한 drop engine 변경

## 7. StylePanel Plan

* LIST fields
* LIST_ITEM fields
* content editing path
* inline input 제외 확인

## 8. Item Add/Delete UX Options

표 형식:
| Option | Description | Scope | Pros | Cons | Recommendation |

## 9. Implementation Phases

작고 검증 가능한 단계별 계획

## 10. Risks

* DnD restriction
* internal block handling
* compiler/schema limits
* preview/canvas branch
* Code View parity

## 11. Regression Checklist

* LIST add
* LIST_ITEM default 생성
* LIST_ITEM content edit
* reorder
* invalid parent drop prevention
* Preview / Code View / Export
* existing HR/CARD/H1/P/IMAGE/A/GRID_ZONE behavior

제약:

* 코드를 수정하지 마세요.
* LIST를 구현하지 마세요.
* 계획서만 작성하세요.
* 추측과 확인된 사실을 구분하세요.
* 기존 보고서를 참고하되, 수정된 설계 기준을 우선 적용하세요.
