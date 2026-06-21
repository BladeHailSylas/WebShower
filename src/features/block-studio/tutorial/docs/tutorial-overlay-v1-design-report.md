# Tutorial Overlay v1 조사·설계 보고서

> 작성 범위: 조사와 설계만 수행한다. 이 문서는 구현 코드를 포함하지 않으며, 현재 저장소의 Block Studio 관련 구조를 기준으로 작성했다.

## 1. 요약 결론

### 구현 가능 여부

Tutorial Overlay v1은 현재 구조에서 작은 변경으로 구현 가능하다. 권장 형태는 화면 전체를 덮는 전통적인 overlay가 아니라, **Block Studio 중앙 Canvas 열에만 겹쳐 표시되는 비차단형 Mission Bar**다. 튜토리얼은 `blocks`와 명시적인 UI 관찰 신호만 읽고, 블록 생성·이동·삭제 및 HTML 생성 경로에는 참여하지 않아야 한다.

다만 현재 앱은 빈 캔버스가 아니라 `createStarterDocument()`가 만든 `CONTAINER > H1 + IMAGE + P` 구조로 시작한다. 따라서 단순한 `hasBlock` 조건만 사용하면 첫 렌더에서 여러 미션이 이미 완료된다. v1에서는 튜토리얼 시작 시점의 블록 ID를 기준선으로 보관하고, 이후 추가된 블록/관계를 판정하는 조건이 필요하다.

### 권장안

- 배치: `BlockStudioLayout`의 중앙 Canvas 열 내부에 tutorial 전용 overlay slot을 두고 absolute 배치
- 소유 상태: `BlockStudioPage`에서 호출하는 feature 전용 `useTutorialProgress` hook
- 미션 정의: React/JSX와 실행 함수를 포함하지 않는 선언적 배열
- 완료 판정: 별도 evaluator가 전체 child field를 순회하고 세션 UI 신호를 함께 평가
- 완료 정책: 충족한 미션 ID를 세션 동안 latch하여, 이후 블록 삭제로 진행률이 되돌아가지 않게 함
- UI 이벤트: Preview/Code View 버튼 클릭을 얇은 callback으로 상위에 알림. 렌더링·컴파일 경로는 그대로 유지
- 영속성: v1에서는 localStorage 및 계정 저장을 사용하지 않음. 새로고침하면 초기화

### 주요 위험

1. **스타터 문서의 선완료 문제**: 존재 기반 조건만 쓰면 `CONTAINER`, `H1`, `IMAGE` 미션이 즉시 완료된다.
2. **중첩 tree 누락**: `children`만 순회하면 `PASSWORD_ZONE`/`TOGGLE_ZONE`의 `defaultChildren`, `conditionalChildren`를 놓친다.
3. **z-index 및 입력 충돌**: 기존 Canvas content는 `z-10`, 우측 Preview는 `z-20`, 편집 popover는 `z-30`, 전역 `Overlay`는 `z-9999`다. 무계획한 전역 portal은 Palette/Preview/StylePanel과 DnD를 가릴 수 있다.
4. **UI 확인의 의미 왜곡**: Preview가 기본 탭이므로 mount 자체를 `openedPreview`로 보면 사용자가 실제로 확인하지 않아도 미션이 완료된다.
5. **템플릿의 일괄 완료**: 템플릿 하나가 여러 구조 미션을 동시에 충족할 수 있다. 완료 ledger와 “첫 미완료 미션” 계산이 없으면 진행 표시가 흔들린다.

### v1에서 명시적으로 제외할 범위

강제 모달, 전체 화면 차단, spotlight/화살표, 자동 스크롤, 강제 클릭, DnD 이벤트 감시·가로채기, 튜토리얼 전용 tree mutation, 블록 자동 생성, guided-tour 의존성, 영구 저장, 계정 연동, 별도 route, `HtmlBlock`/`blockDefinitions` 변경, Preview/Code View/Export 생성 경로 변경, Canvas renderer 재작성은 제외한다.

## 2. 현재 Block Studio UI 구조 요약

### 관련 파일과 상태 소유권

| 영역 | 현재 파일 | 관찰 내용 |
| --- | --- | --- |
| 페이지 조립 및 DnD | `src/pages/BlockStudioPage.tsx` | `useBlockStudio()`의 `blocks`를 Palette, Canvas, Preview에 전달하며 `DndContext`를 소유한다. tutorial 조정자에 가장 적합하다. |
| 3열 layout | `src/features/block-studio/components/BlockStudioLayout.tsx` | Palette 고정폭 `w-70`, 중앙 `flex-1 relative overflow-hidden`, Preview 고정폭 `w-md z-20` 구조다. |
| Canvas 경계 | `src/components/block/canvas/BlockCanvas.tsx` | `relative overflow-hidden`; 내부에 장식용 absolute header(`z-10`, pointer-events none)가 있다. |
| Canvas scroll/drop | `src/components/block/canvas/CanvasRootDropZone.tsx` | 중앙의 실제 스크롤 컨테이너이자 root droppable이다. `relative overflow-auto p-12 pt-20`. |
| 선택/StylePanel | `src/features/block-studio/hooks/useSelectedBlockEditor.ts`, `BlockEditorPopover.tsx` | 선택 상태는 Canvas 내부 hook에 있고, popover는 scroll content 좌표를 사용하는 `absolute z-30`이다. |
| Preview/Code View tabs | `src/components/block/preview/BlockRenderer.tsx` | `activeTab`은 컴포넌트 로컬 state이며 기본값은 `preview`; Code View는 기존 `CodeViewPanel`을 렌더한다. |
| Palette tabs | `src/components/block/BlockPalette.tsx` | `blocks/templates` tab이 컴포넌트 로컬 state다. 템플릿 추가 결과는 기존 `onAddTemplate` callback으로 페이지까지 올라간다. |
| 블록 상태 | `src/features/block-studio/hooks/useBlockStudio.ts` | 스타터 문서를 초기화하고 `blocks`, `setBlocks`, `appendLearningTemplate`을 제공한다. |
| tree child field | `src/features/block-studio/blocks/tree/blockChildFields.ts` | definition의 `childFields`와 실제 `children/defaultChildren/conditionalChildren`를 합쳐 순회할 수 있다. |
| 기존 전역 placeholder | `src/components/layout/Overlay.tsx`, `Layout.tsx` | `document.body` portal과 `fixed inset-0 z-9999`로 “HELLO AGAIN”을 표시한다. 현재 tutorial과 충돌하므로 구현 시 제거 대상이다. |

### 실제 layout과 positioning

```text
Layout
├─ Outlet
│  └─ BlockStudioPage / DndContext
│     └─ BlockStudioLayout (3 columns, overflow-hidden)
│        ├─ Palette (w-70)
│        ├─ Canvas column (relative, flex-1, overflow-hidden)
│        │  └─ BlockCanvas (relative, overflow-hidden)
│        │     └─ CanvasRootDropZone (relative, overflow-auto, root droppable)
│        │        ├─ Canvas blocks
│        │        └─ BlockEditorPopover (absolute, z-30)
│        └─ Preview/Code/Export (w-md, z-20)
└─ current global Overlay portal (fixed, z-9999)
```

Mission Bar는 스크롤 컨테이너 **안**에 넣으면 블록과 함께 스크롤하거나 root droppable의 클릭/충돌 판정 영역에 참여한다. 반대로 중앙 Canvas 열의 relative wrapper에 배치하면 Canvas scroll과 분리되어 상단 중앙에 고정되고, 좌우 열의 경계도 넘지 않는다.

Preview/Code View의 tab state와 Palette의 tab state는 각각 하위 컴포넌트에 고립되어 있다. v1에서 Palette tab state 자체를 올릴 필요는 없다. Preview/Code 미션에는 tab 클릭 callback만 추가하고, 템플릿 미션은 이미 존재하는 `appendLearningTemplate` 호출을 감싼 observer callback으로 기록할 수 있다.

## 3. Overlay 배치 설계안

### 후보 비교

| 후보 | 장점 | 문제 | 판정 |
| --- | --- | --- | --- |
| `document.body` portal | viewport 고정이 단순함 | 좌우 패널까지 덮고 중앙 정렬 기준이 전체 화면이 됨; `z-9999` 충돌; Canvas 경계/resize 계산 필요 | 비권장 |
| `BlockStudioPage` 최상위 absolute/fixed | tutorial state와 가깝다 | DnD context 전체 및 3개 열 위에 떠서 hit area를 넓히기 쉬움 | 차선 |
| `BlockStudioLayout` 중앙 열 overlay slot | 중앙 열이 이미 `relative overflow-hidden`; Canvas scroll과 분리; 좌우 열 침범 없음 | layout prop 하나가 늘어남 | **권장** |
| `BlockCanvas` 내부, root scroll 밖 | Canvas에 가장 가깝다 | tutorial state prop이 Canvas 편집 컴포넌트를 통과하고 책임이 섞임 | 가능하지만 비권장 |
| `CanvasRootDropZone` 내부 | 구현 위치가 눈에 잘 보임 | root droppable/scroll/selection과 직접 겹침 | 제외 |

### 권장 DOM 정책

- `BlockStudioLayout`에 선택적 `canvasOverlay` slot을 추가한다.
- 중앙 열 내부에서 Canvas 다음에 `absolute inset-x-0 top-3` 성격의 wrapper를 둔다.
- 외부 wrapper는 `pointer-events-none`; 실제 bar와 버튼만 `pointer-events-auto`로 복구한다.
- bar의 클릭은 Canvas root까지 도달하지 않도록 버튼/interactive panel 경계에서만 처리한다. DnD activator listener에는 손대지 않는다.
- portal은 사용하지 않는다. 현재 `Overlay.tsx` placeholder는 구현 시 제거하여 `z-9999` 레이어 자체를 없앤다.

### z-index 정책

중앙 열 내부에서 다음의 단순한 계층을 권장한다.

| Layer | 권장 상대 순서 | 이유 |
| --- | --- | --- |
| Canvas blocks/header | 10 | 현행 유지 |
| Tutorial wrapper/bar | 20~25 | 블록 위에서 읽히되, 선택 편집 UI보다 낮게 |
| BlockEditorPopover/connector | 30 | 편집 작업을 tutorial보다 우선 |
| DragOverlay | dnd-kit 현행 | 변경하지 않음 |

우측 Preview의 `z-20`은 별도 flex sibling이며 중앙 열이 `overflow-hidden`이므로 tutorial이 중앙 경계를 넘지 않으면 직접 충돌하지 않는다. z-index 숫자를 전역 경쟁으로 키우지 않는 것이 중요하다.

### scroll과 좁은 화면

- Mission Bar는 `CanvasRootDropZone` 밖에 있으므로 Canvas를 스크롤해도 같은 상단 위치에 유지된다.
- root drop zone의 `pt-20`은 현재 상단 여백을 제공한다. bar 높이가 이를 넘지 않게 compact하게 유지하고, v1에서 scroll padding을 동적으로 바꾸지 않는다.
- bar는 중앙 열 너비를 넘지 않도록 `max-width: calc(100% - 1rem)`과 `min-width: 0`을 사용하고 설명은 말줄임/2줄 제한한다.
- 중앙 열이 좁아지면 설명을 숨기고 `진행률 + 짧은 제목 + 숨기기`만 남긴 compact variant로 전환한다. 더 좁으면 reopen pill만 표시한다.
- 현재 전체 layout 자체가 `w-70 + flex canvas + w-md` 고정형이므로 모바일 전체 재설계는 이 작업 범위가 아니다. v1 fallback은 tutorial이 기존 문제를 악화시키지 않는 수준으로 제한한다. 가능하면 중앙 열에 CSS container query를 적용하고, 불가하면 보수적인 wrapping과 숨김 규칙을 쓴다.

## 4. Tutorial state 설계안

### 상태 위치

`BlockStudioPage`에서 `useTutorialProgress({ blocks })`를 호출하는 feature-local 구조를 권장한다. Context는 소비자가 Page, Mission Bar, Preview tab callback 정도뿐인 v1에는 과하다. `useBlockStudio` 안에 tutorial state를 넣으면 핵심 block state와 부가 교육 UI state가 결합되므로 피한다.

### 필요한 상태

```ts
type TutorialSessionState = {
  isHidden: boolean;
  completedMissionIds: Set<string>;
  skippedMissionIds: Set<string>;
  initialBlockIds: Set<string>;
  uiSignals: {
    previewOpened: boolean;
    codeViewOpened: boolean;
    templateInserted: boolean;
  };
};
```

실제 React state에는 `Set`을 직접 mutate하지 않고 새 Set 또는 직렬화하기 쉬운 배열을 사용해야 한다. `initialBlockIds`는 첫 렌더의 `blocks`로 만든 고정 기준선이므로 `useRef`에 둘 수 있다. `activeMission`은 별도 mutable state로 중복 보관하지 않고, 정의 순서에서 `completed ∪ skipped`에 포함되지 않은 첫 미션으로 계산한다.

### 처리 규칙

- **완료**: evaluator가 충족한 모든 미션 ID를 기존 완료 ledger에 합친다. 한 번 완료한 미션은 현재 블록이 삭제돼도 유지한다.
- **건너뛰기**: 현재 active mission만 `skippedMissionIds`에 넣고 다음 미션으로 이동한다. 진행률에는 `완료 + 건너뜀`을 “처리됨”으로 표시하되, 완료 체크와 건너뜀 표시는 구분한다.
- **숨기기**: `isHidden = true`; evaluator와 진행 ledger는 세션 동안 계속 유지한다.
- **다시 열기**: 중앙 Canvas 상단에 작은 `미션 n/N` pill을 남기며 클릭 시 `isHidden = false`.
- **모두 처리됨**: 완료 요약 상태와 “튜토리얼 숨기기”를 제공한다. v1에서는 다시 시작 버튼을 넣지 않거나, 넣을 경우 tutorial ledger/UI signal/baseline만 재초기화하고 blocks는 절대 바꾸지 않는다.
- **새로고침**: localStorage가 없으므로 모두 초기화한다. 이것이 v1의 의도된 동작이다.

Preview는 초기 기본 탭이므로 `previewOpened`는 mount 시점이 아니라 **사용자가 Preview tab 버튼을 누른 시점**에만 기록한다. Code View도 버튼 클릭 시 기록한다. 단순 `onTabChange`는 이미 선택된 Preview를 다시 클릭할 때 신호가 누락될 수 있으므로 의미상 `onTabViewed(tab)` callback이 더 정확하다.

## 5. Mission data / evaluator 설계안

### 타입 초안

미션 정의는 설명 데이터와 조건만 포함하고 함수, JSX, mutation을 포함하지 않는다.

```ts
type TutorialUiSignal = "previewOpened" | "codeViewOpened" | "templateInserted";

type TutorialCondition =
  | { type: "hasAddedBlock"; blockType?: BlockType; min?: number }
  | {
      type: "hasAddedNestedBlock";
      parentType: BlockType;
      childType: BlockType;
      childFields?: BlockChildField[];
    }
  | { type: "hasStructure"; parentType: BlockType; directChildType: BlockType; minChildren?: number }
  | { type: "uiSignal"; signal: TutorialUiSignal };

type TutorialMission = {
  id: string;
  title: string;
  description: string;
  condition: TutorialCondition;
};

type TutorialEvaluationContext = {
  blocks: HtmlBlock[];
  initialBlockIds: ReadonlySet<string>;
  uiSignals: Readonly<Record<TutorialUiSignal, boolean>>;
};
```

`hasAddedBlock`은 현재 tree 안에 있으면서 `initialBlockIds`에 없는 블록을 대상으로 한다. `hasAddedNestedBlock`은 실제 부모-자식 관계를 검사한다. v1에서 일반적인 “어디엔가 H1과 CONTAINER가 각각 존재”를 중첩 성공으로 오판하지 않도록 관계 조건을 분리하는 것이 중요하다.

`hasStructure`는 LIST/LIST_ITEM, SLIDER_ZONE/SLIDE_ITEM처럼 부모가 생성될 때 internal child가 template에 함께 들어가는 구조를 교육적으로 한 단위로 판정하는 데 사용한다. 범용 논리 조합(`and/or/not`) DSL은 v1에 과하므로 도입하지 않는다.

### tree 순회

- 재귀 순회는 `getExistingChildFields(block)`을 사용해야 한다. 그러면 definition의 `childFields`와 현존하는 `children`, `defaultChildren`, `conditionalChildren`를 모두 다룬다.
- 매 미션마다 별도 재귀 순회를 반복하기보다 `blocks`가 바뀔 때 한 번 순회하여 다음 snapshot을 만든다.
  - `allBlocks`
  - `blocksByType`
  - `blockById`
  - 필요 시 direct parent/field 관계
- 비용은 전체 블록 수 `N`에 대해 O(N)이고, 교육용 문서 규모에서는 충분히 작다. snapshot은 `useMemo([blocks])`로 계산한다.
- 기존 `findBlockById`는 단일 ID 조회에는 유용하지만 미션 전체 평가를 위해 반복 호출하는 것은 불필요한 다중 순회가 된다. evaluator 전용 read-only index helper가 더 명확하다.

### internal block과 template 처리

- `LIST_ITEM`, `SLIDE_ITEM`은 palette에서는 숨겨진 internal block이지만 실제 HTML 구조 학습의 핵심이므로 evaluator tree에는 포함한다.
- 사용자에게 internal type 이름 자체를 요구하기보다 “목록에 항목이 있다”, “슬라이더에 슬라이드가 있다”처럼 부모 구조 미션으로 표현한다.
- 템플릿 삽입으로 여러 조건이 동시에 충족될 수 있다. evaluator는 **현재 미션 하나만** 검사하지 말고 모든 미션을 평가해 충족 ID를 ledger에 한 번에 합친다.
- UI는 완료된 수만큼 active mission을 건너뛰고 첫 미완료/미건너뜀 미션을 보여준다. 같은 렌더에서 여러 차례 자동 전환하거나 timer chain을 만들지 않는다. 필요하면 `3개 미션 완료` 같은 짧은 `aria-live` 문구만 표시한다.
- 템플릿이 구조 미션을 완료하는 것을 허용하는 것이 “행동 결과 관찰” 원칙에 부합한다. 직접 DnD로만 제한하려면 DnD origin 추적이 필요하므로 v1에서는 피한다.

### 누적 완료와 현재 상태 계산의 역할 분담

조건의 참/거짓은 항상 현재 `blocks + baseline + uiSignals`에서 계산한다. 그러나 사용자 진행은 `completedMissionIds`에 누적한다. 이 혼합 방식은 evaluator를 순수하게 유지하면서, 완료 뒤 블록 삭제로 progress가 역행하는 불쾌한 UX를 막는다.

## 6. v1 미션 목록 제안

스타터 문서와 bulk template 삽입을 고려하면 v1 핵심은 8개가 적절하다. 카드와 템플릿은 후순위 2개로 분리한다.

| Mission | 안내 문구 | 완료 조건 | 필요한 상태 | v1 적합성 | 메모 |
| --- | --- | --- | --- | --- | --- |
| 1. 첫 블록 추가하기 | 왼쪽 팔레트에서 원하는 블록 하나를 Canvas에 추가해 보세요. | baseline에 없던 임의 블록 1개 존재 | blocks, initialBlockIds | 높음 | 스타터 문서 때문에 `blocks.length > 0`은 사용할 수 없음 |
| 2. 일반 구역 만들기 | 여러 요소를 묶을 수 있는 일반 구역을 추가해 보세요. | 추가된 `CONTAINER` 존재 | blocks, baseline | 높음 | 템플릿 추가로도 완료 가능 |
| 3. 구역 안에 제목 넣기 | 제목 블록을 일반 구역 안으로 옮겨 구조를 만들어 보세요. | `CONTAINER`의 descendant 또는 권장상 direct child로 추가된 `H1` 존재 | tree 관계, baseline | 높음 | 교육 명확성을 위해 v1은 direct child 판정을 권장 |
| 4. 이미지 추가하기 | 이미지 블록을 추가하고 Preview의 변화를 살펴보세요. | 추가된 `IMAGE` 존재 | blocks, baseline | 높음 | 기술 속성 편집까지 요구하지 않음 |
| 5. 목록 만들기 | 목록을 추가해 목록과 항목의 부모-자식 구조를 확인해 보세요. | 추가된 `LIST`가 direct `LIST_ITEM` 1개 이상 보유 | tree 관계, internal block | 높음 | 기본 LIST template에 항목이 포함되므로 자연스럽게 완료 |
| 6. 슬라이더 만들기 | 슬라이더를 추가해 여러 슬라이드가 한 구역에 들어가는 구조를 확인해 보세요. | 추가된 `SLIDER_ZONE`이 direct `SLIDE_ITEM` 1개 이상 보유 | tree 관계, internal block | 높음 | SLIDE_ITEM을 별도 미션으로 노출하지 않음 |
| 7. 미리보기 확인하기 | 오른쪽의 미리보기 탭을 눌러 블록 결과를 확인해 보세요. | `previewOpened` UI signal | UI signal | 높음 | 기본 탭 mount는 완료로 치지 않고 명시적 클릭만 인정 |
| 8. 코드 보기 확인하기 | 코드 보기를 열어 블록 구조가 HTML이 된 모습을 비교해 보세요. | `codeViewOpened` UI signal | UI signal | 매우 높음 | 제품의 교육 목표와 직접 연결; 기존 compiler는 변경하지 않음 |
| 9. 카드 구역 만들기 | 관련 콘텐츠를 카드 하나로 묶어 보세요. | 추가된 `CARD` 존재 | blocks, baseline | 후순위 | CONTAINER 미션과 학습 효과가 겹쳐 v1 핵심 8개에서는 제외 가능 |
| 10. 템플릿 추가해 보기 | 템플릿 탭에서 학습 예시 하나를 Canvas에 추가해 보세요. | `templateInserted` UI signal | 기존 template callback, UI signal | 후순위 | 한 번에 구조 미션을 대량 완료하므로 마지막 bonus 미션에 적합 |

미션 3의 “구역”은 `CONTAINER`로 한정하는 편이 초보자에게 예측 가능하다. CARD/GRID_ZONE까지 허용하는 범용 container 개념은 향후 미션 metadata가 충분해진 뒤 확장할 수 있다.

## 7. UI 컴포넌트 계획

### 컴포넌트 책임

| 단위 | 책임 | 하지 않는 일 |
| --- | --- | --- |
| `TutorialOverlay` | 중앙 열 overlay wrapper, hidden/reopen 분기, pointer-events 경계 | portal, Canvas 측정, DnD 처리 |
| `TutorialMissionBar` | 제목, 설명, 진행률, 상태 아이콘, 건너뛰기/숨기기 버튼 렌더 | 미션 평가, blocks 접근 |
| `useTutorialProgress` | baseline, UI signal, completed/skipped/hidden state, active mission 계산 | block mutation, tab state 소유 |
| `buildTutorialTreeIndex` | 모든 child field를 읽는 순수 read-only tree index | definition 변경, React state |
| `evaluateTutorialMissions` | context와 선언적 condition으로 충족 ID 반환 | UI 렌더, side effect |

### 권장 props 흐름

```text
BlockStudioPage
├─ useBlockStudio() → blocks
├─ useTutorialProgress({ blocks })
├─ BlockPalette(onAddTemplate = page wrapper)
│  └─ appendLearningTemplate + tutorial.recordTemplateInserted()
├─ BlockStudioLayout
│  ├─ canvas = BlockCanvas (현행 props 유지)
│  ├─ canvasOverlay = TutorialOverlay(progress/actions)
│  └─ preview = BlockRenderer(onTabViewed)
└─ DndContext / DragOverlay (현행 유지)
```

### 예상 신규 파일

- `src/features/block-studio/tutorial/types/tutorial.types.ts`
- `src/features/block-studio/tutorial/data/tutorialMissions.ts`
- `src/features/block-studio/tutorial/evaluator/buildTutorialTreeIndex.ts`
- `src/features/block-studio/tutorial/evaluator/evaluateTutorialMissions.ts`
- `src/features/block-studio/tutorial/hooks/useTutorialProgress.ts`
- `src/features/block-studio/tutorial/components/TutorialOverlay.tsx`
- `src/features/block-studio/tutorial/components/TutorialMissionBar.tsx`

단위 테스트 기반이 현재 package에 없으므로 v1 구현 과정에서 테스트 runner를 새로 도입하지 않는다. evaluator는 순수 함수로 분리해 향후 테스트 도입이 쉬운 형태만 보장한다.

### 예상 수정 파일

- `src/pages/BlockStudioPage.tsx`: tutorial hook 연결, overlay 전달, UI signal callback 연결
- `src/features/block-studio/components/BlockStudioLayout.tsx`: 선택적 `canvasOverlay` slot 추가
- `src/components/block/preview/BlockRenderer.tsx`: tab 버튼 클릭을 알리는 optional `onTabViewed` prop 추가
- `src/components/layout/Layout.tsx`: 현재 전역 “HELLO AGAIN” placeholder 제거

`Layout.tsx`는 공유 파일이지만 현재 `Overlay`가 모든 route 위에 `z-9999`로 뜨므로 충돌 제거를 위해 최소 수정이 필요하다. `Overlay.tsx` 삭제 여부는 별도 정리로 두어도 되지만, 적어도 `Layout`에서 렌더하지 않아야 한다. 그 외 Palette, Canvas renderer, StylePanel, tree mutation, block definition, compiler/export 파일은 수정하지 않는다.

## 8. Phase별 구현 제안

### TO-1: 선언 데이터와 순수 evaluator

- tutorial type, mission data, baseline-aware tree index/evaluator 추가
- `getExistingChildFields`를 사용해 세 child field를 모두 순회
- 스타터 문서, nested structure, internal block, bulk 조건을 fixture 수준에서 수동/간단 검증
- UI나 기존 컴포넌트는 아직 수정하지 않음

완료 기준: 선언 데이터에 JSX/함수/mutation이 없고 evaluator가 current tree를 수정하지 않는다.

### TO-2: 세션 progress hook

- `useTutorialProgress`에 baseline, completed/skipped, hidden, UI signal 구현
- 전체 미션 동시 평가 후 첫 미완료 mission 계산
- localStorage 없이 refresh reset 정책 확정

완료 기준: hook이 `blocks`를 read-only로 받고, `setBlocks`를 받거나 호출하지 않는다.

### TO-3: 중앙 열 Mission Bar UI

- `BlockStudioLayout`의 `canvasOverlay` slot 추가
- `TutorialOverlay`, `TutorialMissionBar`, reopen pill 구현
- pointer-events, z-index, narrow fallback 적용
- 기존 전역 HELLO AGAIN placeholder 렌더 제거

완료 기준: 버튼 외 wrapper가 Canvas 입력을 막지 않고 scroll 중 위치가 유지된다.

### TO-4: blocks 기반 미션 연결

- Page에서 hook에 `blocks` 전달
- 추가 블록, nested H1, LIST/LIST_ITEM, SLIDER/SLIDE 조건 연결
- template bulk 삽입 시 모든 충족 미션을 한 번에 ledger에 반영

완료 기준: DnD hook, mutation helper, Canvas component props 및 block model을 변경하지 않는다.

### TO-5: Preview/Code View 관찰 신호

- `BlockRenderer`에 optional `onTabViewed` callback 추가
- tab 렌더 및 Code View compiler 경로는 그대로 유지
- Preview 기본 mount와 실제 사용자 클릭을 구분
- 선택적으로 기존 template callback wrapper에서 `templateInserted` 기록

완료 기준: Preview/Code output이 전과 같고 click signal만 상위로 전달된다.

### TO-6: UX 마감과 회귀 검증

- 건너뛰기, 숨기기, 다시 열기, 모두 완료 상태 및 접근성 문구 점검
- 좁은 중앙 열, StylePanel 겹침, Canvas scroll/DnD 회귀 점검
- 자동 검증과 수동 checklist 수행

각 phase는 type-safe/buildable 상태로 끝나야 한다. 임시로 깨진 상태를 전제로 한 대규모 묶음 변경은 필요하지 않다.

## 9. 검증 계획

### 자동 검증

구현 후 저장소 루트에서 다음을 수행한다.

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run lint
git diff --check
```

`tsconfig.json`이 project references 중심이라 `npx.cmd tsc --noEmit`의 실제 검증 범위를 확인하고, 필요하면 `npx.cmd tsc -p tsconfig.app.json --noEmit`을 보조로 실행한다. 전체 lint가 unrelated mini-project 오류로 실패하면 변경 파일만 대상으로 아래와 같이 추가 검증하고 두 결과를 분리 보고한다.

```powershell
npx.cmd eslint src/pages/BlockStudioPage.tsx src/features/block-studio/components/BlockStudioLayout.tsx src/components/block/preview/BlockRenderer.tsx src/features/block-studio/tutorial
```

이번 보고서 작성 단계에서는 코드를 변경하지 않았으므로 build/lint 실행은 구현 phase로 미룬다.

### 수동 회귀 checklist

#### Overlay/UI

- [ ] Mission Bar가 전체 viewport가 아닌 Canvas 열 상단 중앙에 표시된다.
- [ ] Canvas scroll 중 bar 위치가 유지된다.
- [ ] Palette, Preview/Code View/Export 영역을 가리지 않는다.
- [ ] StylePanel popover가 bar보다 우선하며 조작 가능하다.
- [ ] bar 외 overlay wrapper가 클릭, root deselect, DnD collision을 방해하지 않는다.
- [ ] 좁은 Canvas에서 설명/버튼이 안전하게 축약되고 reopen pill을 사용할 수 있다.
- [ ] 건너뛰기는 현재 mission만 처리하고 다음 미완료 mission을 표시한다.
- [ ] 숨기기와 다시 열기가 blocks를 변경하지 않는다.

#### 미션 판정

- [ ] 스타터의 기존 CONTAINER/H1/IMAGE가 시작 직후 미션을 자동 완료하지 않는다.
- [ ] Palette에서 첫 새 블록을 추가하면 첫 미션이 완료된다.
- [ ] 새 CONTAINER를 추가하면 해당 미션이 완료된다.
- [ ] CONTAINER 밖의 H1은 nested 미션을 완료하지 않고, 안으로 옮기면 완료한다.
- [ ] 새 IMAGE, LIST/LIST_ITEM, SLIDER_ZONE/SLIDE_ITEM 구조를 정확히 판정한다.
- [ ] `defaultChildren`, `conditionalChildren`도 tree index에서 누락되지 않는다.
- [ ] Learning Template 삽입으로 여러 조건이 충족되면 모두 한 번에 ledger에 기록되고 첫 미완료 미션으로 이동한다.
- [ ] Preview 기본 렌더만으로는 확인 미션이 완료되지 않고 Preview 버튼 클릭으로 완료된다.
- [ ] Code View 버튼 클릭으로 코드 확인 미션이 완료된다.
- [ ] 완료 뒤 관련 블록을 삭제해도 세션 진행률은 역행하지 않는다.

#### 기존 기능 회귀

- [ ] Palette에서 root Canvas로 drag/add가 동작한다.
- [ ] 기존 root block 이동과 nested reorder가 동작한다.
- [ ] container/GRID_ZONE 안팎 이동이 동작한다.
- [ ] drag handle과 edit handle이 각각 정상 동작한다.
- [ ] StylePanel 입력이 drag를 시작하지 않는다.
- [ ] LIST/LIST_ITEM과 SLIDER_ZONE/SLIDE_ITEM 편집이 정상 동작한다.
- [ ] Preview 출력이 기존과 같다.
- [ ] Code View v2가 기존 compiler fragment를 그대로 표시한다.
- [ ] QR/전체 HTML export가 기존 `compilePageHtml` 경로를 그대로 사용한다.

## 최종 권고

v1은 “가이드가 편집기를 제어한다”가 아니라 “편집 결과를 관찰해 작은 학습 목표를 표시한다”는 경계를 유지하면 안전하게 추가할 수 있다. 가장 작은 성공 범위는 **중앙 열 Mission Bar + baseline-aware blocks evaluator + Preview/Code 클릭 신호 + 세션 내 숨김/건너뜀**이다. 카드/템플릿 bonus 미션, 영속 저장, spotlight 등은 이 기반의 사용성을 확인한 뒤 별도 phase로 판단하는 것이 적절하다.
