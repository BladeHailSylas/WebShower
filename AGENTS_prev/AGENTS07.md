현재 목표는 Block Studio의 zone-like block들이 스타일을 어떻게 처리하는지 조사하고, 그 선례를 `GRID_ZONE`에도 적용할 수 있는지 평가하는 것입니다.

중요:

* 아직 코드를 수정하지 마세요.
* 구현 계획을 너무 앞서가지 마세요.
* 먼저 repo를 읽고, 실제 파일 기준으로 진단 보고서를 작성해 주세요.
* 관련 없는 mini-project, route, layout, shared app 구조는 건드리지 마세요.
* Block Studio 관련 파일만 조사하세요.
* AGENTS.md의 feature-scoped refactor 원칙을 유지하세요.

## 배경

현재 `GRID_ZONE`은 다음 원칙으로 정리되어 있습니다.

> `GRID_ZONE` is a generic grid layout container over its direct children.

즉:

* `GRID_ZONE.children`의 각 direct child는 하나의 grid item입니다.
* `styles.gridCols`는 한 행에 배치할 grid item 수를 의미합니다.
* `GRID_ZONE`은 `children` 단일 배열만 사용합니다.
* `columns`, `gridChildren`, 2차원 배열, slots 모델은 도입하지 않습니다.
* column별 독립 drop target은 현재 도입하지 않습니다.
* 향후 `GRID_DROPPER`가 도입되더라도, 그것은 `GRID_ZONE.children`의 direct child/grid item일 뿐입니다.

최근 작업:

* `GRID_ZONE` 자체 drag는 일반 블록처럼 drag handle로 이동 가능하게 정리되었습니다.
* preview/export에도 `styles.gridCols ?? 2`가 CSS grid inline style로 반영되었습니다.
* Code View prototype이 추가되었고, 기존 `compileBlockHtml` / `compileBlocksForCodeView` 경로를 재사용하여 HTML fragment를 표시합니다.
* Code View에서 생성된 HTML을 빈 HTML 파일에 넣었을 때 실제 작동하는 것을 수동 확인했습니다.

현재 논의:

* `GRID_ZONE` grid style rule은 canvas / preview / export compiler에 중복되어 있습니다.
* 현재 중복은 작지만, 앞으로 `grid gap` 같은 옵션을 style panel에 추가한다면 중복 위험이 커질 수 있습니다.
* 가능한 한 기존 zone-like block들의 스타일 처리 선례를 따르고, 필요할 때만 구조를 확장하고 싶습니다.
* 따라서 `CONTAINER`, `PASSWORD_ZONE`, `TOGGLE_ZONE`, `GRID_ZONE` 등 zone-like block의 스타일 처리 방식을 비교해야 합니다.

## 이번 진단에서 반드시 답해야 할 6가지 질문

아래 6가지 질문에 명확히 답해 주세요.

### 1. 다른 zone들은 스타일을 어디서 정의하고 어디서 실행하는가?

대상:

* `CONTAINER`
* `PASSWORD_ZONE`
* `TOGGLE_ZONE`
* `GRID_ZONE`
* 필요하면 `SPACER` 또는 기타 container-like/internal block

각 block에 대해 다음을 확인해 주세요.

* definition template의 `styles`
* `editableFields`
* `childFields`
* canvas rendering에서 style 적용 위치
* preview rendering에서 style 적용 위치
* export/html compiler에서 style 적용 위치
* Code View 반영 경로
* `transformGuiToTailwind` 사용 여부
* `htmlSchema` 또는 `htmlExporterKey` 사용 여부

### 2. canvas / preview / export / Code View 사이의 style parity를 어떻게 유지하고 있는가?

각 zone-like block에 대해 다음을 비교해 주세요.

* canvas에서 보이는 style
* preview에서 보이는 style
* export HTML에서 나오는 style/class
* Code View에서 보이는 code
* 이 네 경로가 같은 source of truth를 쓰는지
* 불일치가 있는지
* 불일치가 있다면 의도된 차이인지, 기술 부채인지

특히:

* `transformGuiToTailwind`가 parity를 보장하는 역할을 하는지
* canvas는 별도 editor shell/style을 쓰는지
* preview와 export가 같은 style transform을 쓰는지
* Code View는 export/compiler 결과를 그대로 보여주는지 확인해 주세요.

### 3. GRID_ZONE은 그 방식과 얼마나 다르게 처리되고 있는가?

`GRID_ZONE`을 다른 zone-like block과 비교해 주세요.

확인할 것:

* `GRID_ZONE`만 inline grid style을 별도 계산하는지
* `GRID_ZONE`만 canvas trigger가 `childFields.variant === "grid"`이고 preview/export trigger가 `block.type === "GRID_ZONE"`인지
* `GRID_ZONE`만 `gridCols ?? 2`, `gap: 12px`, `repeat(n, minmax(0, 1fr))` rule을 여러 곳에서 반복하는지
* `GRID_ZONE`이 기존 `transformGuiToTailwind` 흐름에서 벗어나 있는지
* `GRID_ZONE`의 차이가 layout block 특성상 자연스러운 예외인지

### 4. GRID_ZONE의 차이는 정당한 예외인가, 아니면 정리할 필요가 있는 불일치인가?

다음 기준으로 판단해 주세요.

* 현재 동작 안정성
* 코드 중복 위험
* data-driven architecture와의 정합성
* 향후 `gridGap` 같은 옵션 추가 가능성
* 향후 `GRID_DROPPER` 도입 가능성
* 새 layout block 추가 가능성
* canvas / preview / export drift 가능성

결론은 다음 중 하나로 내려 주세요.

* A. 현재 차이는 정당한 예외이므로 유지
* B. 현재는 유지 가능하지만, 다음 grid style 확장 전 helper화 권장
* C. 지금 바로 helper화하는 것이 적절
* D. helper화보다 definition metadata 정리가 먼저
* E. 기존 zone style 처리 체계에 맞춰 더 큰 정리가 필요

### 5. gap option을 추가한다면 기존 editableFields/style transform 체계에 자연스럽게 들어가는가?

가정:

* 아직 구현하지 않습니다.
* 다만 향후 `GRID_ZONE`에 grid gap 옵션을 추가할 수 있습니다.
* UI는 숫자 입력보다 교육용 select가 좋을 수 있습니다.
* 예: `좁게`, `보통`, `넓게`
* 내부 값 후보:

  * `gridGap?: "narrow" | "normal" | "wide"`
  * 또는 `gridGapPx?: 8 | 12 | 16`
  * 또는 기존 style 체계에 맞는 더 적절한 구조

확인할 것:

* `StyleProps`에 어떤 필드를 추가하는 것이 자연스러운지
* `editableFieldPresets.ts`에 추가하는 것이 자연스러운지
* `EditableFieldControl`이 현재 enum/select 값을 처리할 수 있는지
* canvas / preview / export / Code View에 반영하려면 어느 파일을 수정해야 하는지
* `transformGuiToTailwind`에 넣는 것이 맞는지, 별도 layout helper가 맞는지
* 기존 `commonStyleFields`와 충돌하지 않는지
* gap option이 `GRID_ZONE` 전용이어야 하는지, 향후 layout block 공용이 될 수 있는지

### 6. helper를 만든다면 기존 선례에 맞춘 helper인가, GRID_ZONE만을 위한 새 패턴인가?

다음을 비교해 주세요.

후보 A: 기존 style transform 체계 확장

* 예: `transformGuiToTailwind` 또는 유사 공통 style 경로에 grid 관련 값을 반영
* 장점/단점
* canvas/preview/export에 모두 적용 가능한지

후보 B: `GRID_ZONE` 전용 layout helper

* 예:

```ts id="gszljh"
getGridZoneLayoutStyle(gridCols?, gridGap?): React.CSSProperties
serializeGridZoneLayoutStyle(gridCols?, gridGap?): string
```

* 장점/단점
* 기존 구조와 충돌 여부
* future `GRID_DROPPER`와 호환성

후보 C: grid container 공용 helper

* 예:

```ts id="j31qce"
getGridContainerLayoutStyle({ columns, gap }): React.CSSProperties
serializeGridContainerLayoutStyle({ columns, gap }): string
```

* 장점/단점
* 현재는 과추상화인지 여부
* future layout block과 호환성

후보 D: definition-driven layout metadata

* 예:

```ts id="mfel9a"
layout: {
  kind: "grid",
  columnsPath: "styles.gridCols",
  gapPath: "styles.gridGap",
  fallbackColumns: 2,
  fallbackGap: "normal"
}
```

* 장점/단점
* 지금 도입하기 적절한지
* blockDefinitions에 로직을 넣지 않는 원칙과 충돌하지 않는지

각 후보에 대해 다음을 평가해 주세요.

* 기존 선례를 따르는가
* 변경 범위
* 과추상화 위험
* data-driven architecture에 주는 이점
* canvas/preview/export parity에 주는 이점
* 향후 `GRID_DROPPER`와 충돌 여부
* 이번 단계에서 추천 여부

## 조사 대상 파일

실제 repo 기준으로 관련 파일을 확인하고, 정확한 경로를 보고해 주세요.

우선 확인할 것으로 예상되는 파일:

* `src/features/block-studio/blocks/definitions/container.definition.ts`
* `src/features/block-studio/blocks/definitions/gridZone.definition.ts`
* `src/features/block-studio/blocks/definitions/passwordZone.definition.ts`
* `src/features/block-studio/blocks/definitions/toggleZone.definition.ts`
* `src/features/block-studio/blocks/definitions/editableFieldPresets.ts`
* `src/features/block-studio/blocks/definitions/index.ts`
* `src/features/block-studio/blocks/types/blockDefinition.types.ts`
* `src/features/block-studio/blocks/types/editableField.types.ts`
* `src/features/block-studio/blocks/types/childField.types.ts`
* `src/features/block-studio/blocks/types/htmlSchema.types.ts`
* `src/types/types.ts`
* `src/components/block/canvas/CanvasBlockBody.tsx`
* `src/components/block/canvas/CanvasBlockSlot.tsx`
* `src/components/block/canvas/CanvasBlockItem.tsx`
* `src/components/block/preview/PreviewBlockRenderer.tsx`
* `src/components/block/preview/CodeViewPanel.tsx`
* `src/components/block/preview/BlockRenderer.tsx`
* `src/components/block/editor/BlockStylePanel.tsx`
* `src/components/block/editor/EditableFieldControl.tsx`
* `src/features/block-studio/blocks/html/blockHtmlCompiler.ts`
* `src/features/block-studio/blocks/html/htmlSchemaCompiler.ts`
* `src/features/block-studio/blocks/html/interactiveExporters.ts`
* `src/features/block-studio/blocks/html/transformGuiToTailwind.ts`
* `src/features/block-studio/blocks/html/escapeHtml.ts`

실제 파일 구조가 다르면 실제 경로 기준으로 보고해 주세요.

## 특별히 주의할 제약

* 코드를 수정하지 마세요.
* `GRID_DROPPER`는 이번 범위에서 구현하지 마세요.
* `columns`, `gridChildren`, 2차원 배열, slots, column별 drop target은 도입하지 마세요.
* `GRID_ZONE`의 현재 원칙, 즉 “direct children을 grid item으로 배치하는 layout container”를 유지하세요.
* blockDefinitions에 JSX, mutation logic, compiler function을 넣는 방향은 피하세요.
* 기존 작동 중인 canvas / preview / export / Code View 동작을 깨는 방향은 추천하지 마세요.
* 필요하다면 기존 처리 로직을 파괴하지 않는 수준의 작은 수정이나 확장만 제안하세요.
* 추측과 확인된 사실을 구분하세요.

## 출력 형식

다음 형식으로 보고서를 작성해 주세요.

# Zone Style Consistency Report

## 1. Executive Summary

* 다른 zone들의 스타일 처리 방식 요약
* GRID_ZONE이 선례와 얼마나 다른지
* grid gap option 추가 전 helper화 필요 여부
* 최종 추천

## 2. File Map

표 형식:
| Area | File | Responsibility | Notes |

## 3. Zone-by-Zone Style Flow

각 zone별로 작성:

### CONTAINER

* Definition
* Editable fields
* Canvas style
* Preview style
* Export style
* Code View path
* Notes

### PASSWORD_ZONE

...

### TOGGLE_ZONE

...

### GRID_ZONE

...

필요하면 SPACER 등 기타 block 포함.

## 4. Style Parity Analysis

표 형식:

| Block | Canvas | Preview | Export | Code View | Source of Truth | Parity Risk |
| ----- | ------ | ------- | ------ | --------- | --------------- | ----------- |

## 5. GRID_ZONE Difference Analysis

* 다른 zone들과 다른 점
* 정당한 예외인지
* 정리할 필요가 있는 불일치인지

## 6. Grid Gap Option Feasibility

* 권장 데이터 모델
* editableFields 반영 가능성
* canvas/preview/export/code view 영향
* transformGuiToTailwind vs layout helper 판단
* 위험

## 7. Helper Strategy Comparison

후보 A/B/C/D 비교 표:
| Option | Description | Follows Existing Pattern? | Scope | Pros | Cons | Recommendation |

## 8. Data-driven Assessment

* 현재 zone style 처리와 blockDefinitions-driven 구조의 관계
* `GRID_ZONE` helper 또는 metadata가 필요한지
* 지금 어느 수준이 적절한지

## 9. Recommendation

반드시 다음 중 하나를 선택:

* A. 현 구조 유지
* B. 다음 grid style 확장 전 `GRID_ZONE` helper화
* C. 지금 바로 `GRID_ZONE` helper화
* D. 기존 style transform 체계 확장
* E. definition-driven layout metadata 도입
* F. 다른 선행 안정화 필요

선택 이유와 최소 변경 범위를 설명해 주세요.

## 10. Regression Checklist

* canvas / preview / export / Code View parity 검증
* `GRID_ZONE.children` 단일 배열 유지 검증
* `GRID_DROPPER`, columns, gridChildren, slots 미도입 확인
* gap option을 나중에 추가할 경우 확인할 항목
