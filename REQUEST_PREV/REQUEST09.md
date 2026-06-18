현재 목표는 Block Studio에서 **StylePanel을 통한 content editing 기능을 복구**하는 것입니다.

중요:

* 이번 작업에서는 inline input을 구현하지 마세요.
* CanvasBlockBody 안에 input을 넣지 마세요.
* DragHandle / EditHandle / Canvas UI 스타일은 건드리지 마세요.
* GRID_ZONE 안정화, gridGap, GRID_DROPPER는 이번 범위가 아닙니다.
* Code View 전용 HTML generator를 만들지 마세요.
* 관련 없는 mini-project, route, layout, shared app 구조는 건드리지 마세요.
* Block Studio 관련 파일만 수정하세요.
* AGENTS.md의 최신 원칙을 따르세요.

## 배경

이 프로젝트는 React + TypeScript + Tailwind CSS + DaisyUI 기반의 교육용 웹 빌더입니다.

Block Studio의 목표는:

* 학생이 블록으로 웹 페이지를 만들고,
* 블록의 내용과 스타일을 수정하며,
* Preview / Code View / Export를 통해 실제 HTML/CSS와의 연결을 이해하는 것입니다.

현재 문제:

* 어느 시점부터 요소의 내용을 수정하는 기능이 빠진 것으로 보입니다.
* StylePanel 도입 전에는 블록 선택 후 패널에서 content를 수정할 수 있었습니다.
* 최근 진단에 따르면 content update/mutation 경로는 대부분 살아 있고, 문제는 각 block definition의 `editableFields`에서 content 관련 field가 빠진 것에 가까워 보입니다.
* 따라서 먼저 StylePanel에서 content-like field를 다시 노출하여, `HtmlBlock` data update → Preview → Code View → Export 흐름이 정상인지 확인하고 싶습니다.

## 이번 작업의 목적

이번 작업은 inline input 전 단계입니다.

목표:

1. StylePanel에서 content-bearing block의 주요 content/attribute field를 수정할 수 있게 복구합니다.
2. 수정값이 실제 `HtmlBlock` state에 저장되게 합니다.
3. Preview에 반영되게 합니다.
4. Code View에 반영되게 합니다.
5. Export HTML에도 반영되게 합니다.
6. inline input 구현 전, content update path가 정상임을 검증합니다.

## 우선 복구할 범위

먼저 다음 범위만 복구해 주세요.

### 1. Heading 계열

* visible text field
* 예상 path: `content`
* control: `text`
* label 예: `제목 내용`

### 2. Paragraph 계열

* visible text field
* 예상 path: `content`
* control: `text`
* label 예: `본문 내용`

### 3. Link / Anchor 계열

* visible text field
* 예상 path: `content`
* control: `text`
* label 예: `링크 글자`
* URL field
* 예상 path: `link`
* control: `url`
* label 예: `링크 주소`

### 4. Image 계열

* image source field
* 예상 path: `src`
* control: `url`
* label 예: `이미지 주소`

### 5. Password Zone

* correct answer field
* 예상 path: `correctAnswer`
* control: `text`
* label 예: `정답`

## 이번 범위에서 제외할 것

다음은 이번 작업에서 제외해 주세요.

* H1/P inline input
* Link inline input
* Image alt 추가
* textarea control 추가
* button block 추가
* toggle zone 신규 field 추가
* GRID_ZONE 관련 변경
* gridGap 추가
* GRID_DROPPER
* slots migration
* HtmlBlock 모델 대수정
* Code View generator 재작성
* preview renderer 대규모 리팩터링
* CanvasBlockBody UI 구조 변경
* DragHandle / EditHandle 이벤트 변경

특히 IMAGE `alt`는 현재 `HtmlBlock` 모델에 없다면 이번 작업에서 추가하지 마세요. 별도 모델 변경이 필요하므로 후속 작업으로 남깁니다.

## 구현 방향

가능하면 기존 `editableFields` 기반 구조를 사용해 주세요.

우선 확인할 것:

* `EditableFieldPath`가 `content`, `src`, `link`, `correctAnswer`, `styles.*`를 이미 허용하는지
* `EditableFieldControl`이 `text`와 `url`을 이미 지원하는지
* `BlockStylePanel`이 selected block definition의 `editableFields`를 렌더링하는지
* root-level path update가 가능한지
* nested block도 update 가능한지

예상되는 최소 변경:

* content-related editable field preset 추가 또는 기존 preset 복구
* heading/paragraph/link/image/password zone definition의 `editableFields`에 해당 field 추가
* 필요하다면 label/help text 정리
* 필요하다면 type import/export 정리

가능하면 다음처럼 reusable field preset을 정의해 주세요.

예시 형태:

```ts id="d92sxt"
export const contentField = {
  path: "content",
  label: "내용",
  control: "text",
};

export const linkHrefField = {
  path: "link",
  label: "링크 주소",
  control: "url",
};

export const imageSrcField = {
  path: "src",
  label: "이미지 주소",
  control: "url",
};

export const correctAnswerField = {
  path: "correctAnswer",
  label: "정답",
  control: "text",
};
```

실제 타입명과 control 타입은 현재 repo 기준에 맞춰 주세요.

## 중요한 제약

### 1. StylePanel 복구만 하세요

이번 작업의 목적은 먼저 다음 경로를 검증하는 것입니다.

```text id="bsy2tm"
StylePanel input
→ HtmlBlock update
→ Preview update
→ Code View update
→ Export HTML update
```

inline input은 이 경로가 정상임을 확인한 뒤 후속 작업으로 진행합니다.

### 2. Code View는 건드리지 마세요

Code View는 기존 compiler/export 결과를 보여주는 viewer입니다.

수정된 content가 Code View에 반영되어야 하지만, 이를 위해 Code View 전용 변환을 만들면 안 됩니다.

정상 흐름:

```text id="j4v5hn"
StylePanel edits HtmlBlock
→ compileBlocksForCodeView reads updated HtmlBlock
→ Code View updates
```

### 3. Compiler/export를 새로 만들지 마세요

기존 compiler가 이미 `content`, `src`, `link`, `correctAnswer` 등을 읽고 있다면 그대로 사용하세요.

필요한 경우만 매우 작은 수정으로 current data path와 맞추세요.

### 4. Definition-driven 구조를 유지하세요

block type별로 StylePanel 내부에서 하드코딩하지 마세요.

좋은 방향:

```text id="gsx1y0"
block definition editableFields에 field 추가
→ BlockStylePanel이 generic하게 렌더링
```

나쁜 방향:

```text id="k4oqos"
BlockStylePanel 안에서 if block.type === "HEADING" ...
```

### 5. 현재 잘 작동하는 기능을 건드리지 마세요

특히 다음은 회귀가 없어야 합니다.

* palette에서 canvas로 block 추가
* 기존 block drag
* nested block drag
* StylePanel style editing
* Preview
* Code View
* Export
* GRID_ZONE

## 조사 및 구현 단계

### Step 1. 현재 구조 확인

먼저 관련 파일을 확인하고, 실제 field/path/control 이름을 repo 기준으로 파악해 주세요.

예상 파일:

* `src/types/types.ts`
* `src/features/block-studio/blocks/definitions/heading.definition.ts`
* `src/features/block-studio/blocks/definitions/paragraph.definition.ts`
* `src/features/block-studio/blocks/definitions/link.definition.ts`
* `src/features/block-studio/blocks/definitions/image.definition.ts`
* `src/features/block-studio/blocks/definitions/passwordZone.definition.ts`
* `src/features/block-studio/blocks/definitions/editableFieldPresets.ts`
* `src/features/block-studio/blocks/types/editableField.types.ts`
* `src/components/block/editor/BlockStylePanel.tsx`
* `src/components/block/editor/EditableFieldControl.tsx`
* `src/features/block-studio/hooks/useSelectedBlockEditor.ts`
* `src/features/block-studio/hooks/useBlockMutations.ts`
* `src/features/block-studio/blocks/tree/blockTreeOperations.ts`
* `src/components/block/preview/PreviewBlockRenderer.tsx`
* `src/features/block-studio/blocks/html/blockHtmlCompiler.ts`
* `src/features/block-studio/blocks/html/htmlSchemaCompiler.ts`
* `src/features/block-studio/blocks/html/interactiveExporters.ts`

실제 파일 구조가 다르면 실제 경로를 따르세요.

### Step 2. 최소 변경 구현

StylePanel에서 content-like fields가 다시 보이도록 block definitions를 수정하세요.

가능하면:

* field preset을 재사용 가능하게 만들고,
* block definitions에서 `commonStyleFields`와 함께 조합하세요.

예:

```ts id="m72xzw"
editableFields: [
  contentField,
  ...commonStyleFields,
]
```

또는 link:

```ts id="085z9m"
editableFields: [
  linkTextField,
  linkHrefField,
  ...commonStyleFields,
]
```

실제 명칭은 repo에 맞춰 주세요.

### Step 3. 검증

가능한 명령을 실행하세요.

우선:

* `npx.cmd tsc --noEmit`

가능하면:

* `npm.cmd run build`
* changed-file lint

full build/lint가 unrelated mini-project 오류로 실패하면, 관련/무관 오류를 구분해서 보고하세요.

## 완료 보고서에 포함할 내용

작업 완료 후 다음을 보고해 주세요.

1. 변경한 파일 목록
2. 추가/복구한 editable field 목록
3. 각 block에서 새로 StylePanel에 표시되는 field
4. StylePanel 수정값이 Preview / Code View / Export에 반영되는 경로
5. 실행한 검증 명령과 결과
6. unrelated build/lint 오류가 있다면 구분
7. 수동 테스트 체크리스트

## 수동 테스트 체크리스트

다음을 확인해 주세요.

### Heading

* heading block 선택
* StylePanel에서 제목 내용 수정
* Canvas label 또는 표시가 갱신되는지 확인
* Preview 갱신
* Code View 갱신
* Export HTML 갱신

### Paragraph

* paragraph block 선택
* StylePanel에서 본문 내용 수정
* Preview 갱신
* Code View 갱신
* Export HTML 갱신

### Link

* link block 선택
* StylePanel에서 링크 글자 수정
* StylePanel에서 링크 주소 수정
* Preview 갱신
* Code View의 `<a href="...">...</a>` 갱신
* Export HTML 갱신

### Image

* image block 선택
* StylePanel에서 이미지 주소 수정
* Preview 이미지 변경
* Code View의 `<img src="...">` 갱신
* Export HTML 갱신

### Password Zone

* password zone 선택
* StylePanel에서 정답 수정
* Preview/export 동작에 반영되는지 확인
* Code View/export HTML에 관련 값이 반영되는지 확인

### Regression

* 기존 style editing 유지
* palette에서 block 추가 가능
* 기존 block drag 가능
* nested block drag 가능
* GRID_ZONE 기존 동작 유지
* Code View가 별도 generator 없이 compiler output을 표시
