Block Studio의 “스타일 확장”을 위한 현재 구조 진단 및 설계 보고서를 작성해 주세요.

이번 요청은 구현이 아니라 조사와 설계 보고서 작성입니다.
아직 코드를 수정하지 마세요.

## 배경

이 프로젝트는 React + TypeScript + Tailwind CSS + DaisyUI + Vite 기반의 교육용 웹 빌더입니다.
Block Studio는 일반 no-code 플랫폼이 아니라, 학생들이 블록 구조가 실제 HTML/CSS로 어떻게 연결되는지 이해하도록 돕는 교육용 도구입니다.

AGENTS.md의 원칙을 반드시 따르세요.

특히 다음 원칙을 지켜 주세요.

* 작업 범위는 Block Studio 관련 파일로 한정합니다.
* unrelated mini-projects, routes, layouts, pages, shared utilities는 수정하지 않습니다.
* shared file 변경이 필요해 보이면, 왜 필요한지 보고서에 먼저 설명합니다.
* `HtmlBlock` 모델을 교체하지 않습니다.
* `children`, `defaultChildren`, `conditionalChildren` 구조를 유지합니다.
* slots migration을 하지 않습니다.
* `GRID_ZONE`에 columns, gridChildren, 2D child array, per-column drop target, GRID_DROPPER를 도입하지 않습니다.
* LIST는 unordered-only, LIST_ITEM은 internal `<li>` 구조를 유지합니다.
* LIST에 일반 블록을 직접 drop하고 compiler가 자동으로 `<li>`로 감싸는 구조를 만들지 않습니다.
* `blockDefinitions`는 선언적 데이터로 유지합니다.
* definition 안에 JSX, mutation, compiler 로직, DnD 실행 로직을 넣지 않습니다.
* Code View 전용 HTML generator를 만들지 않습니다.
* Preview / Code View / Export가 같은 의미의 HTML/CSS 구조를 보여야 합니다.
* dnd-kit listener, drag handle, edit handle 동작을 변경하지 않습니다.
* 이번 요청에서는 구현하지 말고, 조사와 보고서 작성만 합니다.

## 현재 상태

최근 스타일 적용 불일치 문제는 별도로 해결된 상태입니다.
이전 진단에서 확인된 주요 구조는 다음과 같습니다.

* StylePanel 변경값은 `HtmlBlock.styles`에 저장됩니다.
* Preview와 HTML compiler/export는 `transformGuiToTailwind` 또는 관련 style 변환 경로를 사용합니다.
* Code View와 Export는 기존 compiler/export 경로를 재사용해야 합니다.
* Canvas는 editor shell이 있으므로 Preview/Export와 완전히 같은 DOM일 필요는 없지만, 교육적 cause-and-effect는 중요합니다.
* 스타일 확장은 `editableFields`, `StyleProps`, style transformer, preview/export/compiler 경로와 맞아야 합니다.

## 이번 보고서의 목적

이번 보고서는 버그 수정 보고서가 아닙니다.

목적은 다음 세 가지입니다.

1. 현재 스타일 시스템이 어떤 방식으로 확장 가능한지 진단
2. 스타일 필드 메타데이터와 StylePanel 섹션화를 도입할 수 있는지 검토
3. “내부 텍스트에도 적용” 같은 텍스트 스타일 상속 기능을 나중에 안전하게 도입할 수 있는 구조 제안

## 현재 구상 중인 스타일 확장 방향

검토 중인 방향은 다음과 같습니다.

### 1. 사용 가능한 스타일 옵션 추가

현재보다 더 많은 스타일을 제공하고 싶습니다.

후보 예시:

텍스트 스타일:

* textColor
* fontSize
* fontWeight 또는 isBold
* fontFamily
* lineHeight
* textAlign
* letterSpacing 가능성

박스 스타일:

* bgColor
* padding
* margin
* border
* borderColor
* borderWidth
* rounded
* shadow

레이아웃 스타일:

* width
* maxWidth
* height 또는 minHeight
* gap
* gridCols
* align/items 관련 옵션 가능성

블록 전용 스타일:

* IMAGE: objectFit, aspectRatio, rounded, width
* LINK: variant, target, button-like style
* HR: thickness, color, spacing
* GRID_ZONE: gridCols, gap

이 후보를 그대로 구현하라는 뜻은 아닙니다.
현재 구조에서 어떤 것부터 안전하게 추가할 수 있는지 판단해 주세요.

### 2. StylePanel UI 개선

StylePanel을 현재보다 더 명확하게 섹션화하고 싶습니다.

예상 섹션 후보:

```text
내용
텍스트
배경
여백
테두리
레이아웃
고급
```

조사할 것:

* 현재 `editableFields` 구조가 섹션 정보를 담을 수 있는지
* 섹션 메타데이터를 `editableFields`에 넣는 것이 적절한지
* 별도의 style field registry가 필요한지
* 기존 content editing 필드와 style editing 필드를 어떻게 구분하는 것이 좋은지
* block별로 표시할 스타일 옵션을 선언적으로 제어할 수 있는지

### 3. “내부 텍스트에도 적용” 기능

구역 블록에서 텍스트 스타일을 내부 텍스트에도 자연스럽게 적용하는 기능을 검토 중입니다.

UI 문구 후보:

* 내부 텍스트에도 적용
* 텍스트 스타일 상속
* 구역 안 텍스트에도 적용

원하는 의미:

* 부모 구역의 텍스트 계열 스타일만 내부 텍스트에 전달합니다.
* 자식 block.styles를 직접 덮어쓰지 않습니다.
* 가능하면 CSS 상속을 활용합니다.
* Preview / Code View / Export에서 같은 의미가 유지되어야 합니다.

상속 가능 후보:

* 글자색
* 글자 크기
* 글자 굵기
* 글꼴
* 줄간격
* 글자 정렬

상속 불가능 후보:

* 배경색
* padding
* margin
* border
* rounded
* shadow
* width/height
* grid columns
* gap

조사할 것:

* 현재 구조에서 부모 구역에 text class를 붙였을 때 자식 HEADING/PARAGRAPH/LINK 등에 CSS 상속이 실제로 작동하는지
* 자식 블록이 기본 text class를 가지고 있으면 부모 text style이 막히는지
* `inheritTextStyles` 같은 flag를 `styles`에 추가하는 것이 적절한지
* 이 flag를 `HtmlBlock.styles`에 추가해도 기존 구조를 크게 흔들지 않는지
* text style과 box/layout style을 분리할 수 있는 메타데이터가 필요한지
* 이 기능을 1차 스타일 확장에 포함할지, 별도 Phase로 분리할지

## 중점 조사 파일/영역

실제 repo 구조를 먼저 확인한 뒤, Block Studio 관련 파일만 조사해 주세요.

특히 다음 영역을 확인해 주세요.

* `HtmlBlock` 타입
* `StyleProps` 타입
* `blockDefinitions`
* 각 block definition의 `template.styles`
* `editableFields`
* `editableFieldPresets`
* `BlockStylePanel`
* `EditableFieldControl`
* `transformGuiToTailwind`
* Preview renderer
* HTML compiler/export 관련 파일
* Code View가 사용하는 compile 경로
* Canvas renderer / CanvasBlockBody / BlockCanvas 관련 파일
* GRID_ZONE layout style 처리 경로
* LIST / LIST_ITEM style 처리 경로
* 현재 테스트 파일이 있다면 style 관련 테스트 위치

파일명은 실제 repo에서 확인한 이름을 기준으로 보고해 주세요.

## 조사 질문

다음 질문에 답해 주세요.

### A. 현재 스타일 시스템 구조

1. 현재 `StyleProps`에는 어떤 필드가 있나요?
2. 각 필드는 어떤 block에서 실제로 사용되나요?
3. 각 필드는 StylePanel에서 어떤 `editableField`를 통해 노출되나요?
4. 각 필드는 `transformGuiToTailwind`에서 어떻게 변환되나요?
5. 각 필드는 Preview, Code View, Export에서 같은 의미로 반영되나요?
6. Canvas에서는 어떤 필드가 반영되고 어떤 필드가 반영되지 않나요?

### B. 스타일 필드 분류

현재 및 후보 스타일을 다음 그룹으로 분류해 주세요.

* content field
* text style
* box style
* layout style
* block-specific style
* behavior/config field

각 그룹에 대해 다음을 설명해 주세요.

* `StyleProps`에 들어가는 것이 적절한지
* block의 top-level field로 두는 것이 적절한지
* block-specific props로 두는 것이 적절한지
* `transformGuiToTailwind`로 처리하기 적절한지
* 별도 layout helper나 inline style serializer가 필요한지

### C. StylePanel 섹션화 가능성

1. 현재 `editableFields` 구조에서 섹션 정보를 추가할 수 있나요?
2. 예를 들어 `section: "text" | "background" | "layout"` 같은 메타데이터를 추가하는 것이 자연스러운가요?
3. 기존 필드에 section을 추가해도 blockDefinitions의 선언적 성격이 유지되나요?
4. StylePanel이 필드를 section 기준으로 그룹화하도록 바꾸면 예상 변경 범위는 어느 정도인가요?
5. content editing 필드와 style editing 필드를 같은 패널에서 어떻게 구분하는 것이 좋나요?
6. StylePanel UI 섹션화가 DnD나 Preview/Export에 영향을 줄 가능성이 있나요?

### D. 스타일 메타데이터 도입 가능성

다음과 같은 메타데이터가 필요한지 검토해 주세요.

```ts
type StyleFieldCategory =
  | "content"
  | "text"
  | "box"
  | "layout"
  | "block-specific"
  | "behavior"
  | "advanced";

type StyleFieldMeta = {
  key: string;
  label: string;
  category: StyleFieldCategory;
  inheritable?: boolean;
  appliesTo?: string[];
  transformKind?: "tailwind-class" | "inline-style" | "exporter-specific" | "none";
};
```

반드시 이 구조를 쓰라는 뜻은 아닙니다.
현재 repo에 맞는 현실적인 구조를 제안해 주세요.

특히 다음을 비교해 주세요.

* `editableFields`에 직접 메타데이터를 추가하는 방식
* 별도 `styleFieldRegistry`를 만드는 방식
* `blockDefinitions`의 `editableFields`와 별도 registry를 조합하는 방식

각 방식의 장단점과 변경 범위를 설명해 주세요.

### E. “내부 텍스트에도 적용” 설계 가능성

1. 이 기능을 구현하려면 어떤 data field가 필요해 보이나요?

   * 예: `styles.inheritTextStyles`
   * 다른 더 적절한 이름이 있다면 제안해 주세요.
2. 이 field는 어떤 block type에 노출하는 것이 적절한가요?

   * CONTAINER
   * CARD
   * GRID_ZONE
   * LIST
   * LIST_ITEM
   * PASSWORD_ZONE
   * TOGGLE_ZONE
3. HEADING/PARAGRAPH/LINK/IMAGE/HR에는 노출하지 않는 것이 적절한가요?
4. 부모가 text style을 갖고 있고 자식도 text style을 갖고 있을 때 우선순위는 어떻게 되어야 하나요?
5. CSS 상속을 활용할 경우 자식의 기본 text class가 부모 상속을 막는지 확인해 주세요.
6. 자식 styles를 직접 변경하지 않는 방식으로 구현 가능한지 확인해 주세요.
7. Preview / Code View / Export에서 같은 의미를 유지하려면 어느 경로에서 처리해야 하나요?
8. Canvas에서도 교육적으로 비슷하게 보이게 할 필요가 있는지, 있다면 위험은 무엇인가요?

### F. 추가할 스타일 옵션의 우선순위

현재 구조에서 안전하게 추가 가능한 스타일과 위험한 스타일을 나눠 주세요.

다음 형식으로 정리해 주세요.

| 후보 스타일 | 그룹 | 구현 난이도 | Preview/Export parity 위험 | Canvas 위험 | 추천 Phase | 메모 |
| ------ | -- | -----: | -----------------------: | --------: | -------- | -- |

후보에는 최소한 다음을 포함해 주세요.

* textColor
* fontSize
* fontWeight/isBold
* fontFamily
* lineHeight
* textAlign
* letterSpacing
* bgColor
* padding
* margin
* borderWidth
* borderColor
* rounded
* shadow
* width
* maxWidth
* minHeight
* gap
* gridCols
* image objectFit
* image aspectRatio
* link variant
* hr thickness
* hr color

### G. Preview / Code View / Export parity

스타일 확장 시 다음을 확인해 주세요.

1. class-style transformation은 `transformGuiToTailwind` 같은 공통 경로로 유지 가능한가요?
2. layout-style transformation은 별도 helper가 필요한가요?
3. inline style이 필요한 경우 Preview와 Export에서 같은 의미를 유지할 수 있나요?
4. Code View가 compiler/export 경로를 계속 재사용할 수 있나요?
5. Preview switch renderer와 htmlSchema compiler가 어긋날 가능성이 어디에 있나요?
6. 이를 줄이기 위한 최소 변경 방안은 무엇인가요?

### H. 회귀 위험

다음 영역별로 위험을 정리해 주세요.

* 기존 style 적용
* StylePanel content editing
* Preview rendering
* Code View
* Export
* Canvas visual feedback
* DnD
* GRID_ZONE
* LIST / LIST_ITEM
* PASSWORD_ZONE / TOGGLE_ZONE
* Tailwind class 충돌
* TypeScript 타입 안정성

## 보고서 형식

다음 구조로 작성해 주세요.

### 1. 요약 결론

* 현재 스타일 시스템이 어느 정도까지 확장 가능한지 요약
* 가장 먼저 정해야 할 설계 결정 3~5개
* 구현 전에 반드시 확인해야 할 위험 3~5개

### 2. 현재 스타일 시스템 지도

다음 흐름을 실제 파일명과 함수명 기준으로 정리해 주세요.

```text
blockDefinitions / editableFields
→ StylePanel / EditableFieldControl
→ HtmlBlock.styles 또는 block field
→ style transformer
→ Canvas
→ Preview
→ HTML compiler/export
→ Code View
```

### 3. 현재 StyleProps / editableFields 목록

현재 필드 목록을 표로 작성해 주세요.

| Field | 저장 위치 | 노출 블록 | 입력 UI | 변환 경로 | Canvas 반영 | Preview 반영 | Export/Code View 반영 | 메모 |
| ----- | ----- | ----- | ----- | ----- | --------- | ---------- | ------------------- | -- |

### 4. 스타일 분류 제안

현재 필드와 후보 필드를 다음 기준으로 분류해 주세요.

* content
* text
* box
* layout
* block-specific
* behavior/config
* advanced

### 5. StylePanel 섹션화 설계안

최소 2가지 방식을 비교해 주세요.

* 방식 A: 기존 `editableFields`에 section/category 메타데이터 추가
* 방식 B: 별도 style field registry 도입
* 필요하다면 방식 C 제안

각 방식에 대해 다음을 포함해 주세요.

* 변경 파일
* 장점
* 단점
* 타입 안정성
* blockDefinitions 선언성 유지 여부
* 확장성
* 구현 난이도
* 권장 여부

### 6. 스타일 메타데이터 설계안

다음을 포함해 주세요.

* 현재 repo에 맞는 타입 초안
* `inheritable` 필요 여부
* `transformKind` 필요 여부
* `appliesTo` 또는 block-level 제어 방식 필요 여부
* 기존 `editableFields`와의 관계
* 1차 도입 시 최소 필드
* 나중에 확장할 필드

### 7. “내부 텍스트에도 적용” 설계안

다음을 포함해 주세요.

* 기능 의미 정의
* UI 문구 후보
* data field 후보
* 노출할 block type
* 노출하지 않을 block type
* 상속 가능 스타일 목록
* 상속 불가능 스타일 목록
* 자식 명시 스타일과 부모 상속 스타일의 우선순위
* CSS 상속 활용 가능성
* Preview / Code View / Export 적용 경로
* Canvas 적용 여부와 위험
* 구현 Phase 제안

### 8. 스타일 옵션 추가 우선순위

후보 스타일을 Phase별로 나눠 주세요.

예:

```text
Phase 1: 현재 구조에서 안전한 텍스트/박스 스타일 확장
Phase 2: StylePanel 섹션화 및 스타일 메타데이터 정리
Phase 3: 내부 텍스트에도 적용
Phase 4: layout helper가 필요한 스타일
Phase 5: block-specific style 고도화
```

실제 repo 상태를 기준으로 더 적절한 Phase를 제안해도 됩니다.

### 9. 권장 Phase 1 구현 계획

아직 구현하지 말고, 계획만 작성해 주세요.

형식:

```text
Phase 1 목표:
Phase 1에서 수정할 파일:
Phase 1에서 만들 파일:
Phase 1에서 수정하지 않을 것:
Phase 1에서 추가할 스타일:
Phase 1에서 제외할 스타일:
Phase 1 완료 후 기대 동작:
Phase 1 검증 방법:
```

Phase 1은 작고 reviewable해야 합니다.

### 10. 명시적 제외 범위

이번 스타일 확장 검토에서 제외할 것을 명시해 주세요.

반드시 제외:

* `HtmlBlock` 모델 교체
* slots migration
* GRID_ZONE columns/gridChildren/2D array/per-column drop target/GRID_DROPPER
* LIST ordered list/listKind/marker style
* LIST 자식 자동 `<li>` wrapping
* Code View 전용 generator
* 전역 theme 시스템
* responsive breakpoint 시스템
* 대규모 Canvas renderer 재작성
* DnD listener/drag handle/edit handle 변경
* unrelated repository 변경

### 11. 검증 계획

승인 후 구현 단계에서 실행할 검증 계획을 제안해 주세요.

가능하면 다음을 포함해 주세요.

* `npx.cmd tsc --noEmit`
* `npm.cmd run build`
* full lint가 막히는 경우 changed-file ESLint
* 수동 테스트

수동 테스트에는 최소한 다음을 포함해 주세요.

* 각 스타일 필드가 StylePanel에서 저장되는지
* Preview 반영
* Code View 반영
* Export HTML 반영
* Canvas에서 의도한 범위만 반영
* CONTAINER/CARD/GRID_ZONE/LIST/LIST_ITEM 스타일
* HEADING/PARAGRAPH/LINK/IMAGE/HR 스타일
* PASSWORD_ZONE/TOGGLE_ZONE 회귀
* GRID_ZONE gridCols 유지
* LIST/LIST_ITEM restriction 유지
* drag handle/edit handle 유지
* nested block 이동 및 재정렬

## 응답 언어

보고서는 한국어로 작성해 주세요.

## 중요

이번 요청은 조사와 설계 보고서 작성만입니다.
코드를 수정하지 마세요.
변경 파일이 없어야 합니다.
