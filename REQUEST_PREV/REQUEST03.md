현재 목표는 Block Studio의 `GRID_ZONE`을 개선하는 것입니다.

중요:

* 이번에는 실제 구현을 진행해 주세요.
* 단, 작업 범위는 `GRID_ZONE` 개선에 한정합니다.
* 관련 없는 mini-project, route, layout, shared app 구조는 수정하지 마세요.
* AGENTS.md의 feature-scoped refactor 원칙을 유지하세요.
* 구현 후 build/typecheck가 가능한 상태를 목표로 해 주세요.

## 핵심 설계 합의

`GRID_ZONE`은 column 데이터를 직접 소유하는 블록이 아닙니다.

이번 작업에서 `GRID_ZONE`은 다음처럼 정의합니다.

> `GRID_ZONE` is a generic grid layout container over its direct children.

즉:

* `GRID_ZONE.children`의 각 direct child는 하나의 grid item입니다.
* `styles.gridCols`는 한 행에 배치할 grid item 수를 의미합니다.
* `GRID_ZONE`은 `children` 단일 배열만 사용합니다.
* `columns`, `gridChildren`, 2차원 배열, slots 모델을 도입하지 마세요.
* column별 독립 drop target도 이번 작업에서는 도입하지 마세요.
* 향후 `GRID_DROPPER`라는 내부 블록을 도입하더라도, 그것 역시 `GRID_ZONE.children`의 direct child/grid item일 뿐입니다.
* 따라서 `GRID_ZONE`의 기본 렌더링 원칙은 미래에도 동일해야 합니다.

현재 v1 구조:

```text
GRID_ZONE
 ├─ H1
 ├─ IMAGE
 ├─ PARAGRAPH
 └─ BUTTON
```

렌더링 원칙:

```text
GRID_ZONE.children을 CSS grid item 목록으로 보고,
styles.gridCols에 따라 CSS grid로 자동 배치한다.
```

향후 v2 가능성:

```text
GRID_ZONE
 ├─ GRID_DROPPER
 │   ├─ H1
 │   └─ PARAGRAPH
 ├─ GRID_DROPPER
 │   └─ IMAGE
 └─ GRID_DROPPER
     └─ BUTTON
```

이 경우에도 `GRID_ZONE` 입장에서는 `GRID_DROPPER`들이 direct children/grid items일 뿐입니다.
따라서 이번 작업에서 `GRID_ZONE`에 column-specific data structure를 넣지 마세요.

## 현재 코드 맥락 요약

현 시점에 확인된 구조는 다음과 같습니다.

* `GRID_ZONE` definition:

  * `src/features/block-studio/blocks/definitions/gridZone.definition.ts`
  * `template.styles.gridCols: 2`
  * `children: []`
  * `childFields: ["children"]`
  * `variant: "grid"`
  * `editableFields`에 `gridColumnField` 포함
  * `htmlSchema: { tag: "div", childField: "children" }`

* `GRID_COLS` field:

  * `src/features/block-studio/blocks/definitions/editableFieldPresets.ts`
  * 현재 `styles.gridCols`
  * 타입상 `2 | 3 | 4`

* canvas rendering:

  * `src/components/block/canvas/CanvasBlockSlot.tsx`
  * `variant === "grid"`일 때 inline style로:

    * `display: "grid"`
    * `gridTemplateColumns: repeat(${block.styles?.gridCols ?? 2}, minmax(0, 1fr))`
    * `gap: "12px"`

* preview rendering:

  * `src/components/block/preview/PreviewBlockRenderer.tsx`
  * 현재 `GRID_ZONE`은 `CONTAINER`와 같은 branch로 처리되어 `gridCols`가 반영되지 않는 것으로 보임

* HTML export:

  * `src/features/block-studio/blocks/html/blockHtmlCompiler.ts`
  * `src/features/block-studio/blocks/html/htmlSchemaCompiler.ts`
  * `src/features/block-studio/blocks/html/transformGuiToTailwind.ts`
  * 현재 export path에서도 `gridCols`가 grid layout으로 반영되지 않는 것으로 보임

* DnD:

  * 일반 블록 DragHandle 문제는 `BlockDragHandle`의 `onPointerDown={stopPointer}`가 dnd-kit listener를 덮어쓴 것이 원인이었고, 제거 후 일반 블록 이동은 가능해졌음
  * 다만 `GRID_ZONE`은 `CanvasBlockItem.tsx`에서 일반 블록과 다른 drag activator 정책을 가지고 있음
  * `GRID_ZONE`은 `BlockDragHandle`이 렌더링되지 않고 wrapper에 `onPointerDown={stopPointer}`가 남아 있을 수 있음
  * 따라서 `GRID_ZONE` 자체 이동이 깨질 가능성이 큼

## 이번 구현 목표

### 1. `GRID_ZONE` 자체 drag 정책 정리

`GRID_ZONE`도 일반 블록처럼 root canvas 내에서 이동 가능해야 합니다.

확인하고 개선할 것:

* `CanvasBlockItem.tsx`에서 `GRID_ZONE`만 `BlockDragHandle`을 숨기는 로직이 있는지 확인
* `GRID_ZONE` wrapper에 `onPointerDown={stopPointer}` 또는 유사 pointer 차단이 남아 있는지 확인
* `GRID_ZONE`도 일반 블록과 동일하게 drag handle을 사용할 수 있도록 개선
* dnd-kit `listeners.onPointerDown`을 다시 덮어쓰지 않도록 주의
* 가능하면 `useSortable`의 `setActivatorNodeRef`를 `BlockDragHandle`에 명시적으로 연결하는 안정적인 구조로 정리
* `BlockEditHandle`의 pointer 차단은 편집 클릭 보호 목적이므로 필요한 범위에서 유지

주의:

* drag handle과 edit handle의 역할을 분리하세요.
* drag handle은 dnd-kit activator가 살아 있어야 합니다.
* edit handle은 drag로 오인되지 않게 pointer propagation 차단이 필요할 수 있습니다.

### 2. `GRID_ZONE` canvas / preview / export parity 맞추기

`styles.gridCols`가 canvas뿐 아니라 preview와 HTML export에도 동일하게 반영되어야 합니다.

현재 canvas에서는 grid layout이 보이지만, preview/export는 container처럼 보일 위험이 있습니다. 이를 개선하세요.

목표:

* Canvas에서 보이는 grid layout과 Preview에서 보이는 layout이 일치해야 함
* Export HTML에서도 `GRID_ZONE`이 grid layout으로 출력되어야 함
* `GRID_ZONE.children` 순서는 그대로 유지
* `children`의 각 direct child를 grid item으로 렌더링
* `styles.gridCols ?? 2` fallback 유지

구현 방향:

* preview renderer에서 `GRID_ZONE`을 `CONTAINER`와 완전히 동일하게 처리하지 말고, grid layout style/class를 반영
* export compiler에서도 `GRID_ZONE`의 `gridCols`가 반영되도록 처리
* 현재 canvas가 inline style을 쓰고 있으므로 preview/export도 inline style 방식이 가장 안전할 수 있음
* Tailwind dynamic class 예: `grid-cols-${n}` 방식은 content scan/purge 문제를 만들 수 있으므로 피하는 편이 안전함
* 단, 기존 architecture와 맞는 더 좋은 방식이 있으면 그 이유를 설명하고 적용

예상 style:

```ts
{
  display: "grid",
  gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
  gap: "12px"
}
```

HTML export에서는 예를 들어 다음과 같은 결과가 가능해야 합니다.

```html
<div class="..." style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">
  ...
</div>
```

기존 className/style export 방식이 있다면 그 구조에 맞게 통합하세요.

### 3. `GRID_COLS` editor UX 점검

이미 `gridColumnField`가 존재하므로 큰 구조 변경은 필요하지 않을 수 있습니다.

확인할 것:

* `styles.gridCols` 편집 UI가 정상 표시되는지
* label이 사용자에게 오해를 만들지 않는지
* 필요하다면 label/help text를 “자동 배치 열 수” 또는 이에 준하는 의미로 개선
* `EditableFieldControl`에서 숫자 coercion이 정상인지 확인
* 타입 `2 | 3 | 4`를 유지할지, 확장할지 판단

주의:

* 이번 작업에서 16 columns나 arbitrary number 입력을 도입하지 마세요.
* 현재 안정성을 위해 2/3/4 select 구조 유지가 우선입니다.
* 필요하면 후속 과제로 responsive columns를 제안만 하세요.

### 4. 데이터 모델 유지

이번 작업에서 반드시 지켜야 할 것:

* `HtmlBlock.children` 단일 배열 유지
* `styles.gridCols` 유지
* `defaultChildren`, `conditionalChildren`로 GRID_ZONE을 옮기지 않기
* `columns`, `gridChildren`, `gridRows`, 2D array 추가 금지
* slots 모델 도입 금지
* `GRID_DROPPER` 구현 금지
* column별 drop target 구현 금지
* `blockDefinitions`에 JSX, mutation logic, HTML compiler function 직접 삽입 금지

## 구현 전 확인

구현 전에 관련 파일을 다시 확인해 주세요.

필수 확인 파일:

* `src/features/block-studio/blocks/definitions/gridZone.definition.ts`
* `src/features/block-studio/blocks/definitions/editableFieldPresets.ts`
* `src/types/types.ts`
* `src/components/block/canvas/CanvasBlockItem.tsx`
* `src/components/block/canvas/BlockDragHandle.tsx`
* `src/components/block/canvas/BlockEditHandle.tsx`
* `src/components/block/canvas/CanvasBlockBody.tsx`
* `src/components/block/canvas/CanvasBlockSlot.tsx`
* `src/components/block/preview/PreviewBlockRenderer.tsx`
* `src/features/block-studio/blocks/html/blockHtmlCompiler.ts`
* `src/features/block-studio/blocks/html/htmlSchemaCompiler.ts`
* `src/features/block-studio/blocks/html/transformGuiToTailwind.ts`
* DnD 관련:

  * `src/features/block-studio/hooks/useBlockDragAndDrop.ts`
  * `src/features/block-studio/blocks/drop/blockDropEngine.ts`
  * `src/features/block-studio/blocks/drop/resolveDropTarget.ts`
  * `src/features/block-studio/blocks/drop/dropTargetIds.ts`

## 구현 방식 요구

작업은 작고 reviewable하게 진행해 주세요.

권장 순서:

1. 현재 build/typecheck 상태 확인
2. `GRID_ZONE` 자체 drag 가능 여부 확인 및 수정
3. preview에 `gridCols` 반영
4. HTML export에 `gridCols` 반영
5. editor label/help text 필요 시 소폭 개선
6. regression checklist 기준으로 동작 확인
7. 변경 요약 작성

## 수동 검증 체크리스트

구현 후 다음을 확인해 주세요.

### DnD

* 팔레트에서 `GRID_ZONE`을 root canvas에 추가 가능
* 기존 `GRID_ZONE` 자체를 root canvas 내에서 이동 가능
* 일반 heading/paragraph/image block을 `GRID_ZONE` 내부로 추가 가능
* root의 기존 일반 블록을 `GRID_ZONE` 내부로 이동 가능
* `GRID_ZONE` 내부 블록을 root canvas로 이동 가능
* `GRID_ZONE` 내부 블록 간 순서 변경 가능
* 일반 블록 DragHandle 회귀 없음
* BlockEditHandle 클릭 시 editor 정상 open/close
* root canvas 빈 영역 클릭 시 선택 해제 정상

### GRID_COLS

* `GRID_COLS` 2 → 3 변경 시 canvas 반영
* `GRID_COLS` 3 → 4 변경 시 canvas 반영
* `GRID_COLS` 4 → 2 변경 시 children 손실 없음
* column 수 변경 후 children 배열 순서 유지

### Preview / Export

* preview에서 `GRID_ZONE`이 grid layout으로 보임
* HTML export에서 `GRID_ZONE`이 grid layout으로 출력됨
* canvas / preview / export의 grid column 수가 일치함
* 기존 heading/paragraph/image/container/password/toggle zone preview/export 회귀 없음

## 출력 요청

작업 후 다음 형식으로 보고해 주세요.

1. 변경 요약
2. 수정한 파일 목록
3. `GRID_ZONE` drag 정책이 어떻게 바뀌었는지
4. preview/export에 `gridCols`를 어떻게 반영했는지
5. 데이터 모델을 유지했는지 확인
6. 실행한 build/typecheck/test 명령과 결과
7. 수동 검증이 필요한 항목
8. 남은 위험 또는 후속 과제

다시 강조:
이번 작업은 `GRID_ZONE`을 “direct children을 CSS grid로 배치하는 layout container”로 안정화하는 작업입니다.
column별 데이터 구조나 `GRID_DROPPER`는 이번 범위가 아닙니다.
