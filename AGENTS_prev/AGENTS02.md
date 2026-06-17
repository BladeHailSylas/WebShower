현재 목표는 GRID_ZONE / GRID_COLS 개선 작업을 계속하기 전에, 이 작업에 필요한 실제 코드 맥락을 정리하는 것입니다.

중요:

* 아직 코드를 수정하지 마세요.
* 구현 계획도 너무 앞서가지 마세요.
* 우선 repo를 읽고, GRID_ZONE / GRID_COLS 작업을 이해하는 데 필요한 코드 맥락을 정리해 주세요.
* 이 정리 결과는 다른 대화/검토자에게 전달될 예정이므로, 코드 전체를 붙여넣기보다는 “어떤 파일에 어떤 책임이 있고, 어떤 데이터가 어떻게 흐르는지”를 명확히 설명해 주세요.
* AGENTS.md의 지침을 유지하세요. Block Studio 관련 범위만 다루고, unrelated mini-project 파일은 건드리지 마세요.

배경:

* 이 프로젝트는 React + TypeScript + Tailwind CSS + DaisyUI 기반의 교육용 웹 빌더입니다.
* 사용자는 팔레트에서 블록을 끌어와 캔버스에 배치하고, 기존 블록을 이동/편집/미리보기/HTML export할 수 있습니다.
* 최근 blockDefinitions/template copy 기반 구조로 refactor가 진행되었습니다.
* 일반 블록 DragHandle 문제는 `onPointerDown={stopPointer}`가 dnd-kit listener를 덮어쓰는 것이 원인으로 보이며, 해당 제거로 일반 블록 이동은 가능해졌습니다.
* 다만 GRID_ZONE은 handle이 없거나 wrapper pointer down이 남아 있을 수 있어, GRID 계열 DnD는 별도 확인이 필요합니다.

이번 요청의 핵심:
GRID_ZONE / GRID_COLS 개선을 위해 다음 맥락을 정리해 주세요.

1. 관련 파일 지도
   다음 범주별로 실제 파일 경로와 역할을 정리해 주세요.

* GRID_ZONE 정의 파일
* GRID_COLS 또는 grid column 수/레이아웃을 다루는 파일
* blockDefinitions index/registry
* HtmlBlock 타입 정의
* childFields/dropPolicy 관련 타입 및 helper
* blockFactory / assignBlockIdsDeep
* BlockCanvas / CanvasBlockItem / CanvasBlockSlot / CanvasBlockList 등 canvas 렌더링 관련 파일
* BlockDragHandle / BlockEditHandle
* useBlockDragAndDrop
* blockDropEngine / resolveDropTarget / dropTargetIds
* blockTreeOperations / blockChildFields
* BlockStylePanel / EditableFieldControl
* BlockRenderer / PreviewBlockRenderer / HTML export 관련 파일

2. GRID_ZONE 데이터 구조
   GRID_ZONE block instance가 실제로 어떤 shape을 가지는지 설명해 주세요.
   가능하면 예시를 간략히 보여 주세요.
   특히 다음을 확인해 주세요.

* type 값
* id 부여 방식
* children / defaultChildren / conditionalChildren 중 무엇을 쓰는지
* GRID_COLS 또는 column 수가 어디에 저장되는지
* grid column 내부 children이 어떻게 표현되는지
* template copy 시 grid 내부 children/id도 새로 부여되는지
* 기존 HtmlBlock 모델을 유지하면서 grid 구조를 표현하는 방식

3. GRID_ZONE blockDefinition
   GRID_ZONE definition이 어떤 declarative metadata를 가지고 있는지 정리해 주세요.
   특히 다음을 확인해 주세요.

* template
* editableFields
* childFields
* dropPolicy
* palette metadata
* dragPreview
* htmlSchema 또는 htmlExporterKey
* GRID_COLS 관련 editable field가 이미 있는지, 없다면 어디에 추가하는 게 자연스러운지

4. Canvas 렌더링 흐름
   GRID_ZONE이 캔버스에서 어떻게 렌더링되는지 흐름을 설명해 주세요.
   다음 질문에 답해 주세요.

* root canvas에서 GRID_ZONE은 어떤 컴포넌트로 들어가는가?
* CanvasBlockItem에서 GRID_ZONE을 특별 취급하는 조건이 있는가?
* GRID_ZONE 내부 column/drop zone은 어떤 컴포넌트가 렌더링하는가?
* column별 drop target id는 어떻게 만들어지는가?
* nested SortableContext가 column별로 존재하는가?
* grid 내부 블록 이동과 root 블록 이동은 같은 drop engine을 쓰는가?
* GRID_ZONE 자체를 이동하는 경로와 GRID_ZONE 내부에 블록을 drop하는 경로가 구분되는가?

5. DnD 흐름
   GRID_ZONE 관련 DnD 흐름을 다음 케이스별로 정리해 주세요.

* 팔레트에서 GRID_ZONE을 root canvas에 추가
* 기존 GRID_ZONE 자체를 root canvas 내에서 이동
* 팔레트에서 일반 블록을 GRID_ZONE 내부 column에 추가
* 기존 일반 블록을 GRID_ZONE 내부 column으로 이동
* GRID_ZONE 내부 column 간 블록 이동
* GRID_ZONE 내부 블록을 root canvas로 이동
  각 케이스마다 다음을 적어 주세요.
* active.data.current
* over.data.current
* active.id / over.id 형식
* resolveDropTarget 결과
* blockDropEngine에서 어떤 branch를 타는지
* tree operation이 어떻게 remove/insert하는지

6. GRID_ZONE과 pointer event / drag handle 상태
   최근 일반 블록 드래그 문제와 관련하여 GRID_ZONE의 상태를 확인해 주세요.
   특히 다음을 확인해 주세요.

* GRID_ZONE에도 BlockDragHandle이 렌더링되는가?
* 렌더링되지 않는다면 이유는 무엇인가?
* GRID_ZONE wrapper에 onPointerDown={stopPointer} 또는 유사 이벤트 차단이 남아 있는가?
* GRID_ZONE 자체 드래그가 현재 가능한 구조인가?
* GRID_ZONE 내부 클릭/선택/편집과 드래그가 충돌할 수 있는 지점은 어디인가?
* 일반 블록과 GRID_ZONE의 drag activator 정책이 다른가?

7. Style/editor 흐름
   GRID_COLS 개선이 스타일 패널 또는 editable field와 연결된다면 다음을 정리해 주세요.

* GRID_COLS 값을 편집하는 UI가 현재 존재하는가?
* 존재한다면 어느 파일/컴포넌트인가?
* 없다면 blockDefinitions.editableFields 기반으로 추가 가능한 구조인가?
* GRID_COLS 값 변경 시 block state가 어떻게 업데이트되는가?
* Tailwind class로 반영되는가, inline style로 반영되는가, 별도 renderer 로직이 있는가?
* 반응형 column 수를 고려하는 기존 구조가 있는가?

8. Preview / export 흐름
   GRID_ZONE이 preview와 HTML export에서 어떻게 처리되는지 정리해 주세요.

* editable canvas 렌더링과 preview 렌더링이 다른가?
* GRID_COLS가 preview에 반영되는 경로는 어디인가?
* GRID_COLS가 export HTML에 반영되는 경로는 어디인가?
* htmlSchema 또는 exporterKey 중 무엇을 쓰는가?
* canvas에서는 보이지만 export에서는 누락될 위험이 있는가?

9. 현재 위험 지점
   GRID_COLS 개선을 시작하기 전에 위험해 보이는 지점을 정리해 주세요.
   특히 다음 관점으로 봐 주세요.

* DnD 회귀 가능성
* nested drop target 충돌 가능성
* block.id 중복 가능성
* column 수 변경 시 기존 children 보존/삭제 문제
* column 수 감소 시 orphan children 처리 문제
* preview/export와 canvas 동작 불일치
* editableFields와 실제 renderer 로직 불일치
* Tailwind dynamic class purge/content scan 문제

10. 최소 검증 체크리스트
    GRID_COLS 작업 전후로 수동 테스트해야 할 체크리스트를 작성해 주세요.
    반드시 다음 케이스를 포함해 주세요.

* GRID_ZONE 추가
* GRID_ZONE 자체 이동
* 일반 블록을 GRID_ZONE 각 column에 추가
* column 간 블록 이동
* grid 내부 블록을 root로 이동
* root 블록을 grid 내부로 이동
* GRID_COLS 증가
* GRID_COLS 감소
* column 수 변경 후 기존 children 보존 여부
* preview 반영
* HTML export 반영
* 기존 heading/paragraph/image/container/password/toggle zone 회귀 여부

출력 형식:
아래 형식으로 정리해 주세요.

# GRID_ZONE / GRID_COLS Context Report

## 1. Executive Summary

* 현재 GRID_ZONE 구조를 5~10줄로 요약
* GRID_COLS 개선에 앞서 가장 중요한 판단 포인트

## 2. File Map

표 형식:
| Area | File | Responsibility | Notes |

## 3. Data Model

* GRID_ZONE block shape
* child storage 방식
* GRID_COLS 저장 위치
* id assignment 방식

## 4. Definition Layer

* GRID_ZONE blockDefinition 내용 요약
* editableFields / childFields / dropPolicy 상태

## 5. Canvas Rendering Flow

* 컴포넌트 호출 흐름
* GRID_ZONE 특수 처리 여부
* column/drop zone 렌더링 방식

## 6. Drag and Drop Flow

케이스별로 active/over/drop engine/tree operation 흐름 정리

## 7. Editor / Style Flow

GRID_COLS 편집 가능성과 state update 흐름

## 8. Preview / Export Flow

preview와 HTML export 반영 경로

## 9. Risk Assessment

우선순위 높은 위험 5~10개

## 10. Recommended Next Step

아직 구현하지 말고, 다음 작업을 시작한다면 어떤 순서가 안전한지 제안

## 11. Regression Checklist

수동 테스트 체크리스트

제약:

* 실제 코드를 수정하지 마세요.
* 추측과 확인된 사실을 구분해 주세요.
* 파일명을 반드시 실제 경로로 적어 주세요.
* 관련 없는 프로젝트 파일은 제외해 주세요.
* 긴 코드 전문을 붙여넣지 말고, 필요한 경우 핵심 snippet만 짧게 인용해 주세요.
