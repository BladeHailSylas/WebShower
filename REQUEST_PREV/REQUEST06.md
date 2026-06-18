현재 목표는 `GRID_ZONE`의 grid style 처리 구조를 진단하는 것입니다.

중요:

* 아직 코드를 수정하지 마세요.
* 구현 계획을 너무 앞서가지 마세요.
* 먼저 repo를 읽고, `GRID_ZONE`의 grid style이 canvas / preview / export / code view 경로에서 어떻게 생성되고 적용되는지 보고서로 정리해 주세요.
* 관련 없는 mini-project, route, layout, shared app 구조는 건드리지 마세요.
* Block Studio 관련 파일만 조사하세요.
* AGENTS.md의 feature-scoped refactor 원칙을 유지하세요.

## 배경

이 프로젝트는 React + TypeScript + Tailwind CSS + DaisyUI 기반의 교육용 웹 빌더입니다.

현재 `GRID_ZONE`은 다음 원칙으로 정리되어 있습니다.

> `GRID_ZONE` is a generic grid layout container over its direct children.

즉:

* `GRID_ZONE.children`의 각 direct child는 하나의 grid item입니다.
* `styles.gridCols`는 한 행에 배치할 grid item 수를 의미합니다.
* `GRID_ZONE`은 `children` 단일 배열만 사용합니다.
* `columns`, `gridChildren`, 2차원 배열, slots 모델은 도입하지 않습니다.
* column별 독립 drop target은 현재 도입하지 않습니다.
* 향후 `GRID_DROPPER`라는 내부 블록을 도입하더라도, 그것 역시 `GRID_ZONE.children`의 direct child/grid item일 뿐입니다.

최근 진행된 작업:

* `GRID_ZONE` 자체 drag는 일반 블록처럼 drag handle로 이동 가능하게 수정되었습니다.
* preview/export에도 `styles.gridCols ?? 2`가 CSS grid inline style로 반영되었습니다.
* Code View prototype이 추가되었고, 기존 `compileBlockHtml` 경로를 재사용하여 body fragment를 표시합니다.
* Code View에서 생성된 HTML을 빈 HTML 파일에 넣었을 때 실제 작동하는 것을 수동 확인했습니다.

현재 의문:

* `GRID_ZONE`의 grid style 계산이 여러 위치에 흩어져 있는지 확인해야 합니다.
* helper를 만든다면 helper가 정확히 무엇을 책임져야 하는지 판단해야 합니다.
* 장기적으로 `GRID_DROPPER`가 도입될 가능성이 있지만, 이번 작업에서는 구현하지 않습니다.
* 이 가능성이 `GRID_ZONE` grid style helper의 책임과 위치에 어떤 영향을 주는지 판단하고 싶습니다.

## 이번 진단의 핵심 질문

다음 질문에 답해 주세요.

1. `GRID_ZONE`의 grid style은 현재 어디에서 생성되는가?
2. canvas / preview / export / code view가 같은 grid rule을 쓰고 있는가?
3. 같은 rule이 중복 구현되어 있는가?
4. 중복이 있다면 실제 위험한 중복인가, 아니면 아직 허용 가능한 좁은 분기인가?
5. helper를 만들 경우, 어떤 입력과 출력을 가져야 하는가?
6. helper는 `GRID_ZONE` 전용이어야 하는가, 아니면 grid layout container 공용이어야 하는가?
7. 향후 `GRID_DROPPER` 도입 가능성이 helper 책임에 어떤 영향을 주는가?
8. helper가 절대 책임지면 안 되는 것은 무엇인가?
9. helper화가 data-driven architecture에 도움이 되는가, 아니면 아직 이른 추상화인가?
10. 지금 당장 안정화 패치를 해야 하는가, 아니면 새 기능을 계속 진행해도 되는 수준인가?

## 조사 대상 파일

실제 repo 기준으로 관련 파일을 확인하고, 정확한 경로를 보고해 주세요.

우선 확인할 것으로 예상되는 파일:

* `src/features/block-studio/blocks/definitions/gridZone.definition.ts`
* `src/features/block-studio/blocks/definitions/editableFieldPresets.ts`
* `src/features/block-studio/blocks/types/blockDefinition.types.ts`
* `src/features/block-studio/blocks/types/htmlSchema.types.ts`
* `src/types/types.ts`
* `src/components/block/canvas/CanvasBlockSlot.tsx`
* `src/components/block/canvas/CanvasBlockBody.tsx`
* `src/components/block/preview/PreviewBlockRenderer.tsx`
* `src/components/block/preview/CodeViewPanel.tsx`
* `src/components/block/preview/BlockRenderer.tsx`
* `src/features/block-studio/blocks/html/blockHtmlCompiler.ts`
* `src/features/block-studio/blocks/html/htmlSchemaCompiler.ts`
* `src/features/block-studio/blocks/html/transformGuiToTailwind.ts`
* `src/features/block-studio/blocks/html/compileBlocksForCodeView.ts`, 만약 존재한다면
* grid style helper 또는 layout helper가 이미 있다면 해당 파일

실제 파일 구조가 다르면 실제 경로 기준으로 보고해 주세요.

## 조사 내용

### 1. 현재 GRID_ZONE 데이터/정의 구조

다음을 정리해 주세요.

* `GRID_ZONE` template shape
* `styles.gridCols` 타입과 fallback
* `editableFields`에서 grid column field가 어떻게 정의되어 있는지
* `childFields`에서 `variant: "grid"`가 어떻게 쓰이는지
* `htmlSchema`가 어떤 정보를 담는지
* definition이 grid layout style 자체를 선언하고 있는지 여부

### 2. Canvas grid style 경로

다음을 확인해 주세요.

* canvas에서 `GRID_ZONE`이 어떤 컴포넌트 흐름으로 렌더링되는지
* 실제 `display: grid`, `gridTemplateColumns`, `gap`이 어디에서 만들어지는지
* `styles.gridCols ?? 2` fallback이 어디에 있는지
* `variant === "grid"`가 어떤 역할을 하는지
* React inline style 객체가 어디에서 만들어지는지
* grid style이 `GRID_ZONE` 전용인지, childField variant 기반인지
* 다른 block이 `variant: "grid"`를 쓰면 동일 style이 적용되는지

### 3. Preview grid style 경로

다음을 확인해 주세요.

* preview에서 `GRID_ZONE`이 어떤 branch로 렌더링되는지
* `CONTAINER`와 분리되어 있는지
* grid inline style이 어디에서 만들어지는지
* canvas와 같은 값/fallback/gap을 쓰는지
* preview renderer가 자체 계산을 하고 있는지
* preview와 canvas가 어긋날 가능성이 있는지

### 4. Export / Code View grid style 경로

다음을 확인해 주세요.

* export에서 `GRID_ZONE` HTML style이 어디에서 만들어지는지
* `htmlSchemaCompiler.ts` 내부의 `block.type === "GRID_ZONE"` 분기 여부
* inline style 문자열이 어떻게 생성되고 escape되는지
* `compileBlockHtml`, `compilePageHtml`, `compileBlocksForCodeView`가 이 결과를 어떻게 재사용하는지
* Code View가 grid style을 별도로 만들고 있지는 않은지
* Code View가 export/compiler 결과를 그대로 보여주는지

### 5. 중복/불일치 분석

canvas / preview / export / code view 기준으로 다음을 비교해 주세요.

표로 정리해 주세요.

| Path | File | Trigger | Columns fallback | Gap | Output format | Duplicated? | Risk |
| ---- | ---- | ------- | ---------------- | --- | ------------- | ----------- | ---- |

특히 다음을 확인해 주세요.

* fallback이 전부 `2`인지
* gap이 전부 `12px`인지
* `gridTemplateColumns` 문자열이 전부 같은지
* 한 경로만 수정하면 다른 경로가 어긋날 수 있는지
* Code View는 별도 중복인지, export 결과 표시인지

### 6. helper 후보 설계

아직 구현하지 말고, helper를 만든다면 어떤 형태가 적절한지 제안해 주세요.

후보를 최소 2개 비교해 주세요.

예상 후보:

A. `GRID_ZONE` 전용 helper

```ts
getGridZoneLayoutStyle(gridCols?: 2 | 3 | 4): React.CSSProperties
serializeGridZoneLayoutStyle(gridCols?: 2 | 3 | 4): string
```

B. grid container 공용 helper

```ts
getGridContainerLayoutStyle(options: { columns?: number; gapPx?: number }): React.CSSProperties
serializeGridContainerLayoutStyle(options: { columns?: number; gapPx?: number }): string
```

C. definition-driven layout metadata

```ts
layout: {
  kind: "grid",
  columnsPath: "styles.gridCols",
  gapPx: 12
}
```

각 후보에 대해 다음을 평가해 주세요.

* 현재 작업 범위에 적합한가
* 과추상화 위험이 있는가
* data-driven architecture에 도움이 되는가
* 미래 `GRID_DROPPER` 도입과 충돌하지 않는가
* canvas/preview/export에서 재사용하기 쉬운가
* 타입 안정성이 좋은가
* 구현 난이도와 영향 범위

### 7. GRID_DROPPER 가능성과 helper 책임

향후 `GRID_DROPPER`가 도입될 수 있다는 전제를 두고 평가해 주세요.

중요한 가정:

* 이번 작업에서 `GRID_DROPPER`를 구현하지 않습니다.
* 향후 도입되더라도 `GRID_DROPPER`는 `GRID_ZONE.children`의 direct child/grid item입니다.
* `GRID_ZONE`은 여전히 direct children을 grid item으로 배치하는 역할입니다.

다음을 판단해 주세요.

* helper가 `GRID_DROPPER` 존재를 알아야 하는가?
* helper가 children distribution, column별 상태, drop policy를 알아야 하는가?
* helper가 direct children layout만 책임지면 충분한가?
* 향후 `GRID_DROPPER` 도입 시 현재 helper를 그대로 쓸 수 있는가?
* helper 이름/위치가 future migration을 방해하지 않는가?

### 8. Data-driven 관점 평가

다음을 평가해 주세요.

* 현재 `GRID_ZONE` style 처리는 blockDefinitions-driven 구조와 얼마나 잘 맞는가?
* executor가 `block.type === "GRID_ZONE"` 분기를 가지는 것은 현재 허용 가능한가?
* declarative metadata를 definition에 추가할 필요가 지금 있는가?
* `childFields.variant === "grid"`를 style source로 삼는 것이 더 적절한가?
* `htmlSchema`에 layout style 정보를 넣는 것이 맞는가, 아니면 executor/helper 레이어에 두는 것이 맞는가?
* blockDefinitions에 JSX, mutation logic, compiler function을 넣지 않는 원칙을 유지하면서 개선할 수 있는가?

### 9. 안정화 필요성 판단

마지막으로 다음 중 하나를 추천해 주세요.

A. 지금 helper화 안정화 패치를 먼저 한다.
B. 현재 중복은 작으므로 새 기능을 계속 진행하고, helper화는 후속으로 둔다.
C. helper화보다 definition metadata 정리가 먼저다.
D. GRID_DROPPER 설계 확정 전까지 건드리지 않는 것이 낫다.

추천 하나를 고르고 이유를 설명해 주세요.

## 출력 형식

다음 형식으로 보고서를 작성해 주세요.

# GRID_ZONE Grid Style Diagnosis Report

## 1. Executive Summary

* 현재 중복/위험 요약
* helper화 필요 여부
* 추천 방향

## 2. File Map

표 형식:
| Area | File | Responsibility | Notes |

## 3. Current Data / Definition Model

* GRID_ZONE template
* styles.gridCols
* editableFields
* childFields
* htmlSchema

## 4. Canvas Style Flow

* 컴포넌트 흐름
* style 생성 위치
* fallback/gap/format

## 5. Preview Style Flow

* 컴포넌트 흐름
* style 생성 위치
* fallback/gap/format

## 6. Export / Code View Style Flow

* compiler 흐름
* style 생성 위치
* Code View 재사용 여부

## 7. Duplication and Parity Analysis

표 포함:
| Path | File | Trigger | Columns fallback | Gap | Output format | Duplicated? | Risk |

## 8. Helper Design Options

A/B/C 후보 비교

## 9. GRID_DROPPER Future Compatibility

* helper 책임
* helper가 몰라야 할 것
* future migration 영향

## 10. Data-driven Assessment

* 현재 구조 평가
* definition metadata 필요 여부
* executor/helper 책임 위치

## 11. Recommendation

* A/B/C/D 중 하나 선택
* 이유
* 구현한다면 최소 변경 범위

## 12. Regression Checklist

* canvas / preview / export / code view parity 검증 항목
* GRID_ZONE direct children 유지 검증
* GRID_DROPPER 미도입 확인

제약:

* 코드를 수정하지 마세요.
* 추측과 확인된 사실을 구분하세요.
* 실제 파일 경로를 사용하세요.
* 관련 없는 mini-project 파일은 제외하세요.
* `GRID_DROPPER`, `columns`, `gridChildren`, slots, column별 drop target은 이번 범위가 아닙니다.
* helper를 제안하더라도 children distribution, drop policy, migration policy를 helper에 넣지 마세요.
