현재 목표는 Block Studio의 LIST v1을 확장할 수 있는지 진단하고, 다음 구현 계획을 세우는 것입니다.

이번 요청은 **보고서/계획서 작성**입니다.

중요:

* 아직 코드를 수정하지 마세요.
* 아직 구현하지 마세요.
* 이번 요청은 두 가지 가능성을 함께 검토하되, 실제 구현은 반드시 순차적으로 진행할 계획입니다.
* 관련 없는 mini-project, route, layout, shared app 구조는 건드리지 마세요.
* Block Studio 관련 파일만 조사하세요.
* AGENTS.md의 최신 원칙을 따르세요.

## 배경

현재 Block Studio에는 `LIST`와 `LIST_ITEM`이 구현되어 있습니다.

현재 확인된 상태:

* `LIST`는 unordered list입니다.
* `LIST`는 `<ul>`로 export/Code View에 반영됩니다.
* `LIST_ITEM`은 `<li>`로 export/Code View에 반영됩니다.
* `LIST_ITEM`은 현재 text-only item입니다.
* `LIST_ITEM`은 palette에 노출되지 않는 internal block입니다.
* 현재는 `LIST_ITEM`만 `LIST` 안에 들어갈 수 있습니다.
* `LIST_ITEM`은 다른 block에 영향을 주지 않습니다.
* `LIST_ITEM`의 상호작용 가능한 부모는 현재 `LIST`뿐입니다.
* `LIST_ITEM`이 root, CARD, CONTAINER, GRID_ZONE, PASSWORD_ZONE, TOGGLE_ZONE 등에 들어가지 않는 것이 확인되었습니다.
* Code View와 Export도 현재까지 이상 없이 동작합니다.

현재 LIST v1의 핵심 구조:

```text
LIST
└─ LIST_ITEM
```

현재 HTML 구조:

```html
<ul>
  <li>목록 항목</li>
</ul>
```

## 이번에 검토할 두 가지 확장

### 확장 1. LIST_ITEM을 container-like li로 만들 수 있는가?

목표 구조:

```text
LIST
└─ LIST_ITEM
   └─ children
      ├─ PARAGRAPH
      ├─ IMAGE
      └─ LINK
```

목표 HTML:

```html
<ul>
  <li>
    <p>...</p>
    <img ...>
    <a ...>...</a>
  </li>
</ul>
```

중요한 방향:

* `LIST`는 계속 `LIST_ITEM`만 받아야 합니다.
* 일반 블록을 `LIST`에 직접 drop하게 만들지 마세요.
* compiler가 “LIST의 자식을 자동으로 li로 감싸는” 예외를 만들면 안 됩니다.
* `LIST_ITEM` 자체가 `<li>`에 대응하는 block이어야 합니다.
* block tree와 HTML structure가 최대한 일치해야 합니다.

### 확장 2. LIST 내부에 “항목 추가” 버튼을 둘 수 있는가?

목표:

* `LIST_ITEM`을 palette에 노출하지 않고도 새 item을 추가할 수 있게 합니다.
* `LIST` canvas 영역 안에 “항목 추가” 같은 contextual action을 둘 수 있는지 검토합니다.
* 버튼을 누르면 새 `LIST_ITEM`이 해당 `LIST.children`에 추가됩니다.
* 가능하면 새로 추가된 `LIST_ITEM`을 선택하거나, 최소한 바로 StylePanel에서 편집 가능한 흐름을 제안해 주세요.

중요한 방향:

* `LIST_ITEM`은 여전히 internal block입니다.
* `LIST_ITEM`을 구조 요소 palette에 등록하지 마세요.
* `LIST_ITEM`을 root나 다른 container에 추가할 수 있게 만들지 마세요.
* 자동 wrapping, 즉 “LIST 빈 공간에 일반 block을 drop하면 LIST_ITEM을 자동 생성하고 그 안에 넣는 방식”은 이번 범위에서 제외합니다.
* inline input도 이번 범위에서 제외합니다.

## 이번 요청의 핵심 질문

다음 질문에 답해 주세요.

### 1. LIST_ITEM을 container-like로 바꾸는 것이 현재 구조와 맞는가?

확인할 것:

* 현재 `LIST_ITEM` template은 어떤 구조인가?
* `LIST_ITEM`에 `children: []`을 추가해도 `HtmlBlock` 모델 변경 없이 가능한가?
* `LIST_ITEM`에 `childFields`를 추가할 수 있는가?
* `LIST_ITEM`이 어떤 block type들을 children으로 받을 수 있어야 하는가?
* 처음에는 H1/P/IMAGE/A/HR/CARD/CONTAINER 같은 일반 block을 모두 허용해도 되는가?
* PASSWORD_ZONE, TOGGLE_ZONE, GRID_ZONE 같은 zone-like block도 허용할지, 아니면 후속으로 둘지 판단해 주세요.
* nested LIST 또는 LIST_ITEM을 허용하지 않으려면 어디에서 제한해야 하는가?

### 2. text-only LIST_ITEM에서 container-like LIST_ITEM으로 바꿀 때 content field는 어떻게 처리해야 하는가?

가능한 후보를 비교해 주세요.

#### 후보 A: content 유지 + children 추가

```ts
LIST_ITEM {
  content: "목록 항목",
  children: []
}
```

질문:

* content와 children이 동시에 있을 때 export 우선순위가 모호해지는가?
* canvas/preview/code/export에서 content와 children을 함께 보여줄 것인가?
* 이 방식이 예외 처리를 늘리는가?

#### 후보 B: content 제거 또는 사용 중단 + children만 사용

```ts
LIST_ITEM {
  children: [PARAGRAPH]
}
```

질문:

* 기존 LIST_ITEM content edit과 호환성을 어떻게 처리할 것인가?
* default LIST_ITEM 안에 기본 PARAGRAPH child를 넣는 방식이 적절한가?
* Code View에서 `<li><p>목록 항목</p></li>`가 되는 것이 교육적으로 괜찮은가?

#### 후보 C: v2에서는 content-only를 유지하고, container-like 전환은 후속으로 보류

질문:

* 지금 굳이 container-like로 바꿀 필요가 있는가?
* 현재 text-only LIST_ITEM이 충분한가?

각 후보에 대해:

* 구현 범위
* 기존 데이터와의 호환성
* preview/export/code parity
* 교육적 명확성
* compiler 예외 위험
* 추천 여부

를 비교해 주세요.

### 3. LIST_ITEM의 child/drop policy는 어떻게 되어야 하는가?

확인할 것:

* `LIST`는 여전히 `LIST_ITEM`만 받을 수 있는가?
* `LIST_ITEM`은 어떤 block을 받을 수 있는가?
* `LIST_ITEM`이 또 다른 `LIST_ITEM`을 받을 수 없도록 할 수 있는가?
* `LIST_ITEM`이 `LIST`를 받을 수 있게 할지, 즉 nested list를 허용할지 판단해 주세요.
* v2에서 nested list는 제외하는 것이 적절한가?
* 현재 `acceptedBlockTypes` / `allowedParentTypes` 확장으로 충분한가?
* `blockDropEngine` 추가 수정이 필요한가?
* sibling drop 시 parent validation은 이미 충분한가?

### 4. Preview / Code View / Export는 어떻게 바뀌는가?

확인할 것:

* `LIST_ITEM`을 `{ tag: "li", childField: "children" }`로 바꾸면 htmlSchema만으로 처리 가능한가?
* `contentField`에서 `childField`로 바꿀 때 compiler 수정이 필요한가?
* `<li><p>...</p></li>` 같은 구조가 정상 출력되는가?
* Code View는 기존 compiler 결과만 보여주는가?
* Code View 전용 generator가 필요 없는가?
* PreviewBlockRenderer에는 어떤 최소 case 수정이 필요한가?
* compiler에 LIST/LIST_ITEM 전용 special case가 생기지 않는가?

### 5. Canvas rendering은 어떻게 바뀌는가?

확인할 것:

* `LIST_ITEM`이 child slot을 가지면 `CanvasBlockBody`에서 어떻게 보여야 하는가?
* 기존 container-like block의 `CanvasBlockSlot`을 재사용할 수 있는가?
* LIST_ITEM 안의 empty state는 어떻게 보여야 하는가?
* LIST_ITEM이 너무 무겁게 보이지 않게 하려면 어떤 최소 UI가 적절한가?
* 이번 단계에서 inline input은 제외해도 되는가?
* `LIST_ITEM` 내부에 기본 PARAGRAPH child를 넣는 경우 canvas 표시가 자연스러운가?

### 6. LIST 내부 “항목 추가” 버튼은 구현 가능한가?

확인할 것:

* `LIST` canvas body 또는 slot 주변에 contextual action button을 둘 수 있는가?
* 버튼은 `LIST`에만 표시되어야 하는가?
* 선택된 LIST에 대해서만 표시할지, 항상 표시할지 판단해 주세요.
* 버튼 클릭 시 새 `LIST_ITEM`을 해당 `LIST.children` 끝에 추가할 수 있는 mutation helper가 있는가?
* 현재 `useBlockMutations` / tree operations로 parent block에 child를 추가할 수 있는가?
* 없다면 어떤 최소 helper가 필요한가?
* 새 item 추가 후 selection을 새 LIST_ITEM으로 옮길 수 있는가?
* 버튼 클릭이 canvas deselect, DnD, selection과 충돌할 위험이 있는가?
* 버튼이 drop zone이나 sortable context와 충돌하지 않는가?

### 7. 항목 추가 버튼과 LIST_ITEM 구역화는 같은 구현 작업으로 묶어도 되는가?

반드시 판단해 주세요.

선택지:

* A. 같은 작업으로 구현해도 안전
* B. 하나의 큰 작업 안에서 Phase 1 / Phase 2로 순차 구현 가능
* C. 별도 구현 작업으로 분리해야 함

추천 이유:

* 변경 파일 중복 여부
* DnD 위험
* mutation helper 위험
* review/debug 난이도
* 기능 검증 순서

현재 선호는 다음입니다.

```text
Phase 1:
LIST_ITEM container-like 전환

Phase 2:
LIST 내부 항목 추가 버튼
```

하지만 실제 repo를 보고 다른 판단이 있으면 설명해 주세요.

## 명시적 제외 범위

이번 계획에서 다음은 제외하세요.

* 자동 wrapping

  * 예: LIST 빈 공간에 일반 block을 drop하면 자동으로 LIST_ITEM을 만들고 그 안에 넣는 기능
* LIST_ITEM palette 노출
* ordered list / ol
* listKind
* marker style option
* textarea list editing
* inline input
* nested list
* slots migration
* Code View 전용 generator
* compiler special-case explosion
* GRID_ZONE 관련 변경
* gridGap
* GRID_DROPPER
* HtmlBlock 모델 대수정

## 조사 대상 파일

실제 repo 기준으로 확인하고, 정확한 경로를 보고하세요.

우선 확인할 것으로 예상되는 파일:

* `AGENTS.md`
* `src/types/types.ts`
* `src/features/block-studio/blocks/definitions/list.definition.ts`
* `src/features/block-studio/blocks/definitions/listItem.definition.ts`
* `src/features/block-studio/blocks/definitions/index.ts`
* `src/features/block-studio/blocks/types/blockDefinition.types.ts`
* `src/features/block-studio/blocks/types/childField.types.ts`
* `src/features/block-studio/blocks/types/dropPolicy.types.ts`
* `src/features/block-studio/blocks/types/htmlSchema.types.ts`
* `src/features/block-studio/blocks/tree/blockTreeOperations.ts`
* `src/features/block-studio/blocks/drop/blockDropEngine.ts`
* `src/features/block-studio/blocks/drop/resolveDropTarget.ts`
* `src/features/block-studio/hooks/useBlockMutations.ts`
* `src/features/block-studio/hooks/useSelectedBlockEditor.ts`
* `src/components/block/canvas/CanvasBlockBody.tsx`
* `src/components/block/canvas/CanvasBlockSlot.tsx`
* `src/components/block/canvas/CanvasBlockItem.tsx`
* `src/components/block/preview/PreviewBlockRenderer.tsx`
* `src/components/block/editor/BlockStylePanel.tsx`
* `src/features/block-studio/blocks/html/blockHtmlCompiler.ts`
* `src/features/block-studio/blocks/html/htmlSchemaCompiler.ts`

실제 파일 구조가 다르면 실제 경로를 따르세요.

## 출력 형식

다음 형식으로 보고서를 작성하세요.

# LIST_ITEM Containerization and Add-Item Feasibility Report

## 1. Executive Summary

* LIST_ITEM container-like 전환 가능 여부
* 항목 추가 버튼 가능 여부
* 추천 구현 순서
* 가장 큰 위험

## 2. File Map

표 형식:
| Area | File | Responsibility | Relevant Change | Notes |

## 3. Current LIST/LIST_ITEM Model

* current LIST template
* current LIST_ITEM template
* current childFields/dropPolicy
* current preview/export/code behavior
* current DnD restriction status

## 4. LIST_ITEM Containerization Options

후보 A/B/C 비교:
| Option | Description | Scope | Pros | Cons | Recommendation |

## 5. Recommended LIST_ITEM Model

* template shape
* childFields
* editableFields
* htmlSchema
* default children strategy
* content field 처리
* excluded behavior

## 6. Drop Policy / DnD Impact

* LIST accepts only LIST_ITEM
* LIST_ITEM accepts which blocks
* forbidden drops
* existing drop engine sufficiency
* required minimal changes

## 7. Preview / Code View / Export Impact

* htmlSchema change
* compiler special case 여부
* Code View 영향
* Preview renderer 최소 변경

## 8. Canvas UX Plan

* LIST_ITEM visual body
* child slot behavior
* empty state
* selection/edit behavior
* inline input 제외 확인

## 9. Add-Item Button Feasibility

* button location
* visibility rule
* mutation helper requirement
* selection behavior after add
* event/DnD/deselect risks

## 10. Scope Decision

반드시 하나 선택:

* A. 같은 작업으로 구현해도 안전
* B. 한 작업 안에서 Phase 1 LIST_ITEM container-like, Phase 2 add-item button으로 순차 구현
* C. 별도 구현 작업으로 분리

## 11. Implementation Plan

작고 검증 가능한 phase로 제안

## 12. Regression Checklist

* existing LIST behavior
* LIST_ITEM inside LIST only
* LIST_ITEM children add/move/reorder
* Preview / Code View / Export
* add-item button, if implemented later
* existing H1/P/IMAGE/A/HR/CARD/CONTAINER/GRID_ZONE behavior

제약:

* 코드를 수정하지 마세요.
* 구현하지 마세요.
* 추측과 확인된 사실을 구분하세요.
* 자동 wrapping은 이번 범위에서 제외하세요.
* LIST_ITEM palette 노출은 제외하세요.
* ordered list / listKind / inline input / nested list는 제외하세요.
