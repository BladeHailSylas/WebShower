# Block Studio Canvas UI 이슈 진단 보고서

작성 범위: `REQUEST.md`에 명시된 두 가지 Canvas UI 문제의 원인 조사 및 수정 검증 계획  
작성 원칙: 코드 변경 없이 현재 저장소의 Block Studio 관련 구현과 첨부 화면을 기준으로 분석

## 1. 요약 결론

### 문제 1: GRID_ZONE 내부 중첩 overflow

가장 가능성 높은 원인은 CSS Grid 트랙 자체가 아니라, grid item 이하의 편집 전용 flex shell이 수축할 수 없는 최소 폭을 갖는 데 있다.

- `CanvasBlockSlot`의 GRID_ZONE 트랙은 이미 `repeat(n, minmax(0, 1fr))`를 사용한다.
- 그러나 각 direct child인 `CanvasBlockItem`은 `w-full`인 flex row이고 `min-w-0`이 없다.
- 그 안의 `CanvasBlockBody`는 child field를 가진 블록에 `min-w-70`을 강제한다.
- 좌우의 `BlockDragHandle`(`w-6`)과 `BlockEditHandle`(`w-8`, `shrink-0`)도 같은 row의 실제 필요 폭에 더해진다.
- CONTAINER의 중첩 slot은 단계마다 `ml-6 mr-2 p-3`을 추가해 사용 가능한 내부 폭을 계속 줄인다.
- item/body/slot에 overflow 제어가 없어, 줄어들지 못한 편집 shell이 오른쪽으로 그대로 보인다.

따라서 `min-width: auto`인 grid/flex item과 `min-w-70`의 결합이 주원인이며, 첨부 화면의 계단식 우측 돌출과 일치한다.

### 문제 2: 스크롤 후 StylePanel 위치 불일치

가장 가능성 높은 원인은 좌표 측정 기준과 absolute positioning containing block이 다르다는 것이다.

- 선택 핸들은 `getBoundingClientRect()`로 viewport 좌표를 측정한다.
- 좌표 변환에는 바깥 `BlockCanvas`의 `canvasRef` rect를 사용한다.
- 실제 스크롤 컨테이너이자 popover의 containing block은 안쪽 `CanvasRootDropZone`이다.
- 계산에 `CanvasRootDropZone.scrollTop`/`scrollLeft`가 포함되지 않는다.
- 스크롤 뒤 선택하면 이미 scroll offset이 빠진 viewport 좌표를 absolute content 좌표처럼 저장하고, 렌더링 시 스크롤 컨테이너가 그 offset을 다시 빼므로 위치가 대략 스크롤량만큼 추가로 어긋날 수 있다.

### 두 문제의 관계와 영향 범위

두 문제는 Canvas 편집 shell 안에서 나타난다는 공통점만 있고 직접적인 원인은 독립적이다. 문제 1은 CSS 최소 폭/수축 문제이고, 문제 2는 좌표계/스크롤 offset 문제다. 한 번의 수정으로 묶지 않는 편이 안전하다.

두 문제 모두 현재 증거상 Canvas 전용이다. Preview와 Export의 GRID_ZONE도 `minmax(0, 1fr)`를 사용하지만 Canvas의 drag/edit handle, `min-w-70`, 중첩 drop-zone indentation을 렌더링하지 않는다. StylePanel과 connector 역시 Preview/Export 경로에 존재하지 않는다. 다만 Preview/Export에서도 긴 비분리 문자열이나 고유 최소 폭이 큰 사용자 콘텐츠가 별도의 overflow를 만들 가능성까지 배제하는 것은 아니다.

### 수정 전 주요 위험

- 편집 shell 폭을 바꾸면 drag handle, edit handle, drop-zone hit area와 선택 표시가 달라질 수 있다.
- `overflow-hidden`만 추가하는 방식은 증상을 가리면서 handle이나 nested drop target을 잘라낼 위험이 크다.
- StylePanel을 `fixed` 또는 portal로 성급히 전환하면 clipping은 줄어도 resize/scroll 재측정과 viewport 경계 처리가 새로 필요하다.
- 두 수정은 각각 독립된 단계로 적용하고 회귀 검증해야 한다.

## 2. 문제 1: GRID_ZONE 중첩 overflow 진단

### 관련 파일과 컴포넌트

- `src/components/block/canvas/CanvasBlockSlot.tsx`: GRID_ZONE grid와 일반 container slot
- `src/components/block/canvas/CanvasBlockItem.tsx`: 모든 canvas block의 sortable flex wrapper
- `src/components/block/canvas/CanvasBlockBody.tsx`: 편집 body 및 최소 폭
- `src/components/block/canvas/BlockDragHandle.tsx`: 좌측 rail
- `src/components/block/canvas/BlockEditHandle.tsx`: 우측 rail
- `src/components/block/canvas/CanvasBlockList.tsx`: root block list
- `src/components/block/canvas/CanvasRootDropZone.tsx`: canvas scroll/drop 영역
- `src/features/block-studio/blocks/definitions/gridZone.definition.ts`: GRID_ZONE의 `children` field와 grid variant 선언
- `src/components/block/preview/PreviewBlockRenderer.tsx`: Preview grid 실행
- `src/features/block-studio/blocks/html/htmlSchemaCompiler.ts`: Export/Code View grid 직렬화

### 현재 DOM / wrapper 구조

실질 구조는 다음과 같다. `SortableContext`는 레이아웃용 DOM wrapper를 추가하지 않으므로 GRID_ZONE의 child `CanvasBlockItem`이 grid의 direct item이다.

```text
BlockCanvas (relative, overflow-hidden; canvasRef)
└─ CanvasRootDropZone (relative, overflow-auto, padding)
   └─ CanvasBlockItem: GRID_ZONE (relative flex, w-full)
      ├─ BlockDragHandle (w-6)
      ├─ CanvasBlockBody (childFields 존재 → min-w-70)
      │  └─ CanvasBlockSlot variant=grid
      │     (display:grid; repeat(n,minmax(0,1fr)); p-3; gap 12px)
      │     └─ CanvasBlockItem: CONTAINER (grid direct item; flex, w-full)
      │        ├─ drag handle
      │        ├─ CanvasBlockBody (min-w-70)
      │        │  └─ CanvasBlockSlot variant=container
      │        │     (ml-6 mr-2 p-3)
      │        │     └─ 다음 중첩 CanvasBlockItem...
      │        └─ edit handle (w-8, shrink-0)
      └─ edit handle
```

### width / min-width / overflow 분석

1. GRID_ZONE의 트랙 선언은 올바른 축에 가깝다. `minmax(0, 1fr)`는 트랙의 자동 최소 폭 문제를 완화한다.
2. 하지만 direct grid item인 `CanvasBlockItem`에는 `min-w-0`이 없고 기본 `min-width: auto`가 적용된다. 내부 콘텐츠의 고유 최소 폭이 grid item의 수축을 방해할 수 있다.
3. `CanvasBlockBody`의 `min-w-70`은 CONTAINER, CARD뿐 아니라 child field가 하나라도 있는 GRID_ZONE/LIST/SLIDER_ZONE 등의 body에도 적용된다. 약 280px보다 작게 줄어들 수 없다.
4. 한 item row에는 body 외에도 좌측 `w-6`과 우측 `w-8` rail이 있다. 따라서 container-like item의 편집 shell이 요구하는 최소 폭은 body 최소 폭보다 더 크다.
5. 일반 container slot의 `ml-6 mr-2 p-3`은 깊이마다 가용 폭을 줄인다. 중첩 깊이가 커질수록 body 최소 폭과 실제 column 폭의 충돌이 커진다.
6. `CanvasBlockBody`에는 `flex-1`, `w-full`, `min-w-0`이 없으며 item/body/slot 모두 문제를 해결할 overflow 규칙이 없다.
7. dnd-kit의 `transform`은 드래그 중 item에 적용되지만, 정지 상태의 지속적인 계단식 overflow 원인으로 보이지 않는다. scale도 Canvas item에는 적용되지 않는다.

### 원인 후보별 가능성

| 후보 | 가능성 | 판단 근거 |
|---|---:|---|
| grid/flex item의 `min-width: auto` + body `min-w-70` | 매우 높음 | 코드와 화면의 우측 돌출 형태가 직접 일치 |
| 중첩 slot의 누적 margin/padding | 높음(증폭 요인) | 깊이마다 가용 폭 감소 |
| 좌우 drag/edit rail 폭 | 중간(증폭 요인) | 최소 필요 폭에 고정 폭 추가 |
| GRID_ZONE 트랙이 `minmax(0,1fr)`가 아님 | 낮음 | 이미 해당 선언을 사용 |
| dnd-kit transform/scale | 낮음 | 일반 상태에는 scale이 없고 transform은 drag 상태 중심 |
| Preview/Export 공통 grid 오류 | 낮음 | 편집 shell이 해당 경로에 없음 |

### 가장 가능성 높은 원인

`CanvasBlockItem`부터 `CanvasBlockBody`까지 이어지는 수축 경로가 없고, body에 `min-w-70`이 강제된 상태에서 중첩 slot의 들여쓰기와 handle 폭이 누적되는 것이 핵심이다. `minmax(0, 1fr)`만으로는 자식 편집 shell의 overflow까지 막지 못한다.

### Preview/Export 영향

- Preview: `PreviewBlockRenderer.getGridZoneStyle()`가 동일한 grid column 수와 `minmax(0,1fr)`, 12px gap을 사용한다.
- Export/Code View: `htmlSchemaCompiler.getInlineStyle()`가 같은 레이아웃을 직렬화한다.
- 두 경로에는 Canvas 전용 rail, body 최소 폭, nested drop zone이 없다.

따라서 관찰된 현상은 Preview/Export HTML을 수정할 근거가 아니다. 시각 비교 검증만 하고 관련 코드는 유지해야 한다.

### 최소 수정 후보와 위험

1. **권장: Canvas 편집 shell의 수축 체인 정리**
   - `CanvasBlockItem`에 `min-w-0`을 부여하고, `CanvasBlockBody`가 남은 폭을 차지하면서 줄어들도록 `flex-1 min-w-0` 계열로 조정한다.
   - 중첩 가능한 body의 강제 `min-w-70`을 제거하거나 root/drag preview에만 제한한다.
   - 위험: root block의 최소 시각 폭이 달라지고 긴 label이 눌릴 수 있다. handle과 drop-zone 폭을 함께 확인해야 한다.

2. **중첩 문맥에서만 최소 폭 완화**
   - root와 nested/grid child를 구분해 nested item/body에만 `min-w-0` 및 유연 폭을 적용한다.
   - 위험: depth/context prop이 추가되어 Canvas API가 복잡해질 수 있고, container/list/slider마다 누락될 가능성이 있다.

3. **중첩 indentation 축소 또는 반응형 처리**
   - container slot의 `ml-6 mr-2 p-3` 누적량을 줄여 좁은 column의 가용 폭을 보존한다.
   - 위험: 원인인 강제 최소 폭을 그대로 두면 깊이가 더 커졌을 때 재발한다. 계층 시각화도 약해질 수 있으므로 단독 해결책으로는 부적합하다.

`overflow-hidden` 단독 적용은 수정 후보로 권장하지 않는다. 실제 레이아웃을 수축시키지 않고 rail, focus ring, drop target을 잘라낼 수 있다.

## 3. 문제 2: StylePanel scroll misalignment 진단

### 관련 파일과 컴포넌트

- `src/features/block-studio/hooks/useSelectedBlockEditor.ts`: 선택 상태 및 좌표 측정
- `src/components/block/canvas/BlockCanvas.tsx`: `canvasRef`, popover/connector 배치
- `src/components/block/canvas/CanvasRootDropZone.tsx`: 실제 scroll container와 containing block
- `src/components/block/canvas/BlockEditHandle.tsx`: 선택 click의 `currentTarget`
- `src/components/block/canvas/BlockEditorPopover.tsx`: absolute panel
- `src/components/block/canvas/EditorConnectorLine.tsx`: 같은 좌표를 사용하는 absolute SVG
- `src/features/block-studio/components/BlockStudioLayout.tsx`: 전체 viewport 고정 및 overflow 경계

### 현재 위치 계산과 좌표계

`useSelectedBlockEditor.selectBlock()`은 다음 방식이다.

1. `event.currentTarget`인 `BlockEditHandle`에 `getBoundingClientRect()`를 호출한다.
2. 바깥 `BlockCanvas`의 `canvasRef.current.getBoundingClientRect()`를 호출한다.
3. `buttonRect - canvasRect`로 `lineStart`를 만든다.
4. `popupPos = { x: lineStart.x + 180, y: max(20, lineStart.y - 60) }`로 고정 offset을 적용한다.

`getBoundingClientRect()`의 값은 viewport 기준이다. 두 rect를 빼는 것 자체는 바깥 canvas의 viewport 내 상대 좌표를 만든다. 그러나 panel은 바깥 canvas의 direct absolute child가 아니다.

### Canvas scroll container와 panel positioning

- 바깥 `BlockCanvas`: `relative overflow-hidden`, `canvasRef`가 연결됨.
- 안쪽 `CanvasRootDropZone`: `relative overflow-auto`; 실제 수직/수평 스크롤 컨테이너.
- `BlockEditorPopover`: `position: absolute`; `CanvasRootDropZone` 안에서 렌더링됨.
- 따라서 popover의 containing block은 `CanvasRootDropZone`이다.
- connector SVG도 같은 root drop zone 기준의 absolute element다.
- 코드에는 `scrollTop` 또는 `scrollLeft` 처리가 전혀 없다.
- Canvas item에는 dnd-kit transform이 있으나 평상시 scale/상위 transform은 없어서 주원인이 아니다.

### 왜 스크롤 뒤에 어긋나는가

스크롤 후의 `buttonRect.top`에는 이미 scrollTop에 따른 viewport 이동이 반영되어 있다. 현재 계산은 그 값을 바깥 canvas 기준 좌표로 저장한다. 이 값을 안쪽 스크롤 컨테이너의 absolute content 좌표로 사용하면, 브라우저가 panel을 표시할 때 scrollTop을 다시 차감한다. 결과적으로 새로 선택한 panel/connector가 대략 scrollTop만큼 한 번 더 위로 이동할 수 있다. 수평 스크롤이 있다면 x축에도 같은 문제가 생긴다.

또한 좌표는 선택 click 때만 측정된다. 선택 이후 resize나 외부 layout shift에 대한 재측정 로직도 없지만, 첨부 현상의 1차 원인은 선택 시점의 scroll coordinate 변환 누락이다.

### 원인 후보별 가능성

| 후보 | 가능성 | 판단 근거 |
|---|---:|---|
| 바깥 canvas 기준 좌표를 안쪽 scroll content의 absolute 좌표로 사용 | 매우 높음 | 실제 ref, containing block, overflow 구조가 다름 |
| `scrollTop`/`scrollLeft` 누락 | 매우 높음 | 관련 처리가 코드에 없음 |
| scroll offset 중복 적용 | 높음 | viewport 좌표에 scroll이 반영된 뒤 absolute 렌더링에서 다시 차감되는 효과 |
| fixed/absolute 선택 자체의 오류 | 중간 | absolute도 올바른 content 좌표를 쓰면 정상 동작 가능 |
| Canvas transform/scale | 낮음 | 상위 transform/scale이 없고 item transform은 drag 시 중심 |
| 선택 직후 layout shift | 낮음~중간 | 재측정은 없지만 현재 구조상 일관된 scroll 오차가 더 직접적 |

### 가장 가능성 높은 원인

좌표를 측정하는 기준 element(`BlockCanvas`)와 panel의 actual containing block/scroll element(`CanvasRootDropZone`)가 분리되어 있는데, 내부 scroll offset을 content 좌표로 변환하지 않은 것이 핵심이다.

### 최소 수정 후보와 위험

1. **권장: 실제 scroll container 기준 content 좌표 사용**
   - `CanvasRootDropZone` DOM ref를 좌표 측정 hook에 연결한다.
   - `buttonRect - scrollContainerRect + scrollLeft/scrollTop`으로 absolute content 좌표를 계산한다.
   - popover와 connector는 현재처럼 root drop zone 내부 absolute element로 유지한다.
   - 위험: ref 전달 방식 변경이 필요하다. panel 너비와 canvas 경계 clamp는 별도 정책으로 남을 수 있다.

2. **Popover/connector를 바깥 BlockCanvas의 absolute child로 이동**
   - 현재 `buttonRect - canvasRect` 좌표계와 containing block을 일치시킨다.
   - 위험: outer `overflow-hidden` clipping, scroll 중 panel 고정/동행 정책, connector SVG 영역을 다시 정의해야 한다.

3. **viewport fixed + portal 방식**
   - `buttonRect`를 직접 fixed 좌표로 사용하고 필요 시 scroll/resize 때 재측정한다.
   - 위험: 구현 범위가 가장 크고, viewport 경계 회피·preview 영역 겹침·scroll listener 정리 문제가 추가된다. 현재 이슈의 최소 수정으로는 과하다.

## 4. 수정 우선순위 제안

**StylePanel 좌표 문제를 먼저 수정하고, GRID_ZONE 폭 문제를 두 번째 독립 단계로 수정하는 것을 권장한다.**

| 기준 | StylePanel 좌표 수정 | GRID_ZONE 폭 수정 |
|---|---:|---:|
| DnD 회귀 위험 | 낮음 | 중간~높음 |
| Canvas layout 회귀 위험 | 낮음 | 중간 |
| StylePanel 편집 회귀 위험 | 중간(직접 대상) | 낮음 |
| 수정 범위 | hook/ref 중심으로 작음 | item/body/slot 여러 계층 |
| 테스트 용이성 | scroll 전후 위치 비교가 명확 | depth/type/열 수 조합 필요 |

좌표 수정은 원인과 기대 결과가 명확하고 작은 단위로 검증할 수 있다. GRID_ZONE 수정은 DnD hit area와 모든 nested container-like block의 시각 폭을 건드릴 수 있으므로 별도 변경으로 리뷰하는 편이 안전하다.

## 5. 권장 수정 계획

```text
Fix 1 목표:
스크롤 전후에 선택 핸들, connector, StylePanel이 동일한 기준으로 정렬되게 한다.

수정할 파일:
src/features/block-studio/hooks/useSelectedBlockEditor.ts
src/components/block/canvas/BlockCanvas.tsx
src/components/block/canvas/CanvasRootDropZone.tsx

수정 방식:
실제 overflow-auto element의 ref를 확보하고, 선택 핸들의 viewport rect를 해당 element의
scroll-content 좌표(buttonRect - containerRect + scroll offset)로 변환한다.
popover와 connector가 같은 containing block과 같은 좌표계를 사용하게 한다.

수정하지 않을 것:
BlockStylePanel 필드 UI, 선택 데이터 흐름, DnD listener, edit/drag handle 이벤트,
HtmlBlock, Preview/Export/Code View.

검증 방법:
scrollTop 0/중간/하단 및 수평 스크롤 가능 상태에서 root/nested/GRID_ZONE child를 선택한다.
선택 직후 connector 시작점과 panel anchor를 확인하고, 편집·삭제·재선택을 회귀 검증한다.

Fix 2 목표:
GRID_ZONE의 좁은 column과 깊은 중첩에서도 Canvas 편집 shell이 부모 폭 안에서 수축되게 한다.

수정할 파일:
src/components/block/canvas/CanvasBlockItem.tsx
src/components/block/canvas/CanvasBlockBody.tsx
필요한 경우에만 src/components/block/canvas/CanvasBlockSlot.tsx

수정 방식:
grid/flex 수축 경로에 min-w-0을 적용하고 body를 유연 폭으로 만든다.
nested container-like body에 강제되는 min-w-70을 제거하거나 root 문맥으로 제한한다.
들여쓰기는 수축 체인 수정 후에도 필요한 최소 범위에서만 조정한다.

수정하지 않을 것:
GRID_ZONE child 모델/열별 배열/slots, GRID_DROPPER, drop policy, dnd-kit listener,
blockDefinitions, HtmlBlock, Preview/Export/Code View의 grid 생성 로직.

검증 방법:
GRID_ZONE 2/3/4열에서 CONTAINER를 여러 단계 중첩하고 CARD/LIST/SLIDER_ZONE을 섞는다.
각 단계에서 shell, rail, drop zone이 column 안에 남는지와 이동/재정렬/선택이 유지되는지 확인한다.
Preview와 export 결과가 변경 전과 동일한지도 비교한다.
```

두 Fix는 별도 변경/리뷰 단위로 진행한다. Fix 1에서 Canvas item 폭을 건드리지 않고, Fix 2에서 좌표 계산을 건드리지 않는다.

## 6. 명시적 제외 범위

이번 진단과 권장 계획에서는 다음을 제외한다.

- 애플리케이션 코드 수정
- Canvas renderer 대규모 재작성
- DnD listener, drag handle, edit handle 동작 변경
- `HtmlBlock` 모델 변경
- slots 또는 GRID_ZONE per-column child 구조 도입
- `GRID_DROPPER` 도입
- `blockDefinitions` 구조 변경
- Preview / Export / Code View 변경
- SLIDER_ZONE / Learning Templates / 스타일 시스템 변경
- unrelated mini-project, route, layout, shared utility 변경
- 외부 positioning/editor 의존성 추가

## 7. 검증 계획

### 자동 검증

수정이 승인되고 각 Fix가 구현된 뒤, Fix별로 다음을 실행한다.

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run lint
git diff --check
```

full lint가 unrelated 기존 오류로 실패하면 실패 파일을 관련/무관으로 분리해 보고하고, 최소한 다음 changed-file lint를 실행한다.

```powershell
npx.cmd eslint src/features/block-studio/hooks/useSelectedBlockEditor.ts `
  src/components/block/canvas/BlockCanvas.tsx `
  src/components/block/canvas/CanvasRootDropZone.tsx `
  src/components/block/canvas/CanvasBlockItem.tsx `
  src/components/block/canvas/CanvasBlockBody.tsx `
  src/components/block/canvas/CanvasBlockSlot.tsx
```

### 수동 검증

#### GRID_ZONE / nested layout

- GRID_ZONE 안에 CONTAINER를 여러 단계 중첩한다.
- 2열, 3열, 4열 각각에서 같은 중첩 구조를 확인한다.
- nested CONTAINER / CARD / LIST / SLIDER_ZONE 조합을 확인한다.
- 각 direct child가 grid item으로 유지되고 column 밖으로 튀어나오지 않는지 확인한다.
- 깊은 단계에서 drag rail, edit rail, dotted drop zone이 잘리거나 겹치지 않는지 확인한다.
- 빈 nested drop zone과 콘텐츠가 있는 drop zone을 모두 확인한다.
- Preview, Code View, exported full HTML이 변경 전과 의미상 동일한지 확인한다.

#### StylePanel / connector

- 스크롤하지 않은 상태에서 root block을 선택한다.
- Canvas를 중간과 하단으로 스크롤한 뒤 각각 block을 새로 선택한다.
- 깊게 중첩된 block과 GRID_ZONE의 좌/우 column 내부 block을 선택한다.
- 수평 스크롤이 생기는 재현 상태에서도 x축 정렬을 확인한다.
- panel이 열린 상태에서 필드 편집, 삭제, 선택 해제, 다른 block 재선택을 확인한다.
- connector 시작점이 선택한 edit handle에 붙고 panel 방향으로 연결되는지 확인한다.

#### DnD / Canvas 회귀

- palette에서 root canvas로 block 추가
- 기존 root block 이동 및 재정렬
- nested block을 container-like block 안으로 이동
- nested block을 root로 다시 이동
- nested block 내부 재정렬
- drag handle 정상 작동
- edit handle 정상 작동
- edit click이 drag를 시작하지 않음
- nested drop zone 정상 작동
- root empty area click/deselect 정상 작동
- StylePanel 필드 편집이 동일한 `HtmlBlock` 상태와 Preview/Code View/Export에 반영됨

## 최종 판정

- 문제 1은 **Canvas 편집 wrapper의 강제 최소 폭과 수축 체인 누락**이 주원인이다.
- 문제 2는 **실제 scroll container와 측정 기준/absolute containing block 사이의 좌표계 불일치**가 주원인이다.
- Preview/Export 컴파일 경로를 고칠 근거는 없으며, 두 문제는 별도 Fix로 처리해야 한다.
