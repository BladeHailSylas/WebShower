현재 목표는 Block Studio의 다음 UI/편집 UX 개선 작업을 어떻게 나눌지 판단하는 것입니다.

중요:

* 아직 코드를 수정하지 마세요.
* 구현 계획을 너무 앞서가지 마세요.
* 먼저 repo를 읽고, 두 작업이 같은 변경 범위로 묶일 수 있는지 또는 분리해야 하는지 진단 보고서를 작성해 주세요.
* 관련 없는 mini-project, route, layout, shared app 구조는 건드리지 마세요.
* Block Studio 관련 파일만 조사하세요.
* AGENTS.md의 feature-scoped refactor 원칙을 유지하세요.

## 배경

이 프로젝트는 React + TypeScript + Tailwind CSS + DaisyUI 기반의 교육용 웹 빌더입니다.

현재 Block Studio는 다음 기능을 갖고 있습니다.

* 팔레트에서 블록을 드래그해 canvas에 추가
* 기존 블록 이동
* StylePanel을 통한 스타일 편집
* Preview
* Code View
* HTML export/compiler 재사용

최근 작업:

* `GRID_ZONE` drag/preview/export/code view가 안정화되었습니다.
* Code View prototype이 추가되어 기존 compiler 경로로 block tree가 HTML fragment로 변환되는 것을 확인했습니다.
* 전체적으로 blockDefinitions-driven 구조를 유지하려고 합니다.

## 현재 새로 고민하는 작업

다음 두 작업을 진행하려고 합니다.

### 작업 A: Canvas 조작 UI 일관성 개선

문제:

* DragHandle과 블록 본체의 UI 스타일이 일관적이지 않아 연결이 어색해 보입니다.
* 사용자가 “어디를 잡아야 이동하는지”, “어디를 누르면 편집되는지”를 더 명확히 알 수 있어야 합니다.
* 블록 카드, drag handle, edit handle, 선택 상태, 중첩 slot UI가 하나의 체계처럼 보여야 합니다.

예상 대상:

* `CanvasBlockItem`
* `CanvasBlockBody`
* `CanvasBlockSlot`
* `BlockDragHandle`
* `BlockEditHandle`
* 관련 Tailwind/DaisyUI class

목표:

* 기능 변경보다 visual affordance 개선
* DnD 동작 회귀 없음
* inline input이 나중에 들어와도 충돌이 적은 구조

### 작업 B: 내용 수정 기능 복구 및 inline input 검토

문제:

* 어느 시점부터 요소의 내용을 수정하는 기능이 빠졌습니다.
* StylePanel 도입 전, 블록에서 직접 StylePanel을 생성해 연결하던 시절에는 패널에서 내용을 수정할 수 있었습니다.
* 현재는 H1/P/A/IMAGE 등 content/src/href 같은 실제 내용 또는 속성을 수정하기 어렵거나 불가능한 상태일 수 있습니다.

검토할 두 방식:

1. 기존 방식 복구

   * StylePanel에서 content/text/src/href 등을 수정
   * `editableFields` 기반으로 복구 가능할 수 있음
2. 새 inline input 방식

   * Scratch처럼 블록 내부에 직접 input을 둠
   * 예: `[텍스트] 라고 본문 쓰기`
   * visible content는 블록 안에서 직접 수정
   * technical attributes는 StylePanel에서 수정

장기적으로 선호하는 방향:

* visible content는 inline input 우선
* technical attributes는 StylePanel 우선
* 둘 다 같은 HtmlBlock data path를 수정해야 함
* inline input도 가능하면 definition/editableFields-driven 구조와 맞아야 함

## 이번 진단에서 답해야 할 질문

### 1. 두 작업은 같은 변경 범위인가, 분리해야 하는가?

다음을 판단해 주세요.

* 작업 A와 B가 주로 같은 파일을 수정하는가?
* 같은 컴포넌트에서 충돌 가능성이 있는가?
* 한 번에 구현하면 review/debug가 어려워지는가?
* phase를 나누면 어떤 순서가 안전한가?

결론은 다음 중 하나로 내려 주세요.

* A. 한 구현 작업으로 묶어도 안전
* B. 하나의 큰 프롬프트 안에서 Phase 1/Phase 2로 나누는 것이 적절
* C. 별도 프롬프트/별도 작업으로 분리해야 함

### 2. 현재 내용 수정 기능은 어디에서 빠졌는가?

다음을 확인해 주세요.

* H1/P/A/IMAGE 등 content-bearing block의 data field 구조
* 각 blockDefinition의 `editableFields`
* `BlockStylePanel`이 현재 어떤 fields를 렌더링하는지
* `EditableFieldControl`이 text/url/textarea/select 등을 지원하는지
* `useSelectedBlockEditor`, `useBlockMutations`, `updateBlockById`가 content update를 지원하는지
* StylePanel이 현재 styles만 수정하도록 제한되어 있는지
* content/src/href/alt/correctAnswer 같은 필드가 definition에서 빠져 있는지
* 과거 방식과 비교할 수 있는 흔적이 있는지, 있다면 파일/커밋 흔적 없이 현재 코드 기준으로 추정해 주세요.

### 3. StylePanel content edit 복구 가능성

다음을 평가해 주세요.

* existing `editableFields` 체계에 content fields를 다시 넣는 것만으로 복구 가능한지
* `EditableFieldControl`이 필요한 control을 이미 지원하는지
* path update가 nested field와 root field 모두 가능한지
* H1/P/A/IMAGE/PASSWORD_ZONE/TOGGLE_ZONE에 어떤 fields를 StylePanel에 노출해야 하는지
* 이 복구가 data-driven 구조와 잘 맞는지

### 4. Inline input 방식 도입 가능성

다음을 평가해 주세요.

* H1/P 같은 visible text block에 inline input을 넣을 경우 어떤 컴포넌트가 적절한지
* `CanvasBlockBody`에서 block type별 하드코딩이 필요한지
* definition/editableFields에 `editSurface: "inline"` 또는 유사 metadata를 추가하는 것이 필요한지
* inline input이 DnD와 충돌할 가능성
* input pointer/focus event 처리에서 `BlockDragHandle` 문제와 유사한 회귀 위험
* inline input prototype을 H1/P에만 먼저 적용하는 것이 가능한지
* StylePanel edit와 inline edit를 동시에 지원할 수 있는지

### 5. UI 일관성 개선과 inline input의 관계

다음을 확인해 주세요.

* DragHandle/EditHandle UI를 먼저 정리하면 inline input 도입이 쉬워지는지
* block body 전체를 draggable로 쓰는 구조가 남아 있는지
* drag handle 전용 activator 구조가 확실한지
* input 클릭이 drag/selection/deselect와 충돌하지 않도록 하려면 어떤 UI 구조가 필요한지
* 선택 상태/hover 상태/input focus 상태가 서로 어떻게 표현되어야 하는지

### 6. 추천 작업 순서

다음 중 하나를 추천해 주세요.

* A. DragHandle/UI 일관성 개선 먼저, 내용 수정은 다음 작업
* B. StylePanel content edit 복구 먼저, UI 일관성은 다음 작업
* C. 하나의 작업으로 묶되 Phase 1 UI, Phase 2 content edit
* D. 하나의 작업으로 묶되 Phase 1 content edit, Phase 2 UI
* E. inline input prototype부터 시작

추천 이유와 위험을 설명해 주세요.

## 출력 형식

다음 형식으로 보고서를 작성해 주세요.

# Canvas Editing UX Scope Report

## 1. Executive Summary

* 두 작업을 묶어도 되는지
* 추천 순서
* 가장 큰 위험

## 2. File Map

표 형식:
| Area | File | Responsibility | Relevant to A/B | Notes |

## 3. Current Canvas Interaction Model

* CanvasBlockItem / CanvasBlockBody / handles / slots 구조
* DnD activator 구조
* selection/edit panel 구조

## 4. Current Content Editing Model

* content-bearing block data fields
* editableFields 상태
* StylePanel field rendering 상태
* mutation/update path 상태

## 5. Missing Content Edit Diagnosis

* 내용 수정이 어디에서 빠진 것으로 보이는지
* 복구 난이도
* data-driven 구조와의 관계

## 6. UI Consistency Improvement Scope

* DragHandle/EditHandle/block shell 개선 가능 범위
* 위험
* inline input을 고려한 UI 요구사항

## 7. Inline Input Feasibility

* 적용 가능 block
* 필요한 metadata
* DnD/focus/pointer event 위험
* StylePanel과 병행 가능성

## 8. Scope Decision

반드시 하나 선택:

* A. 한 구현 작업으로 묶어도 안전
* B. 하나의 프롬프트 안에서 Phase 1/Phase 2로 나누기
* C. 별도 작업으로 분리

## 9. Recommended Implementation Order

작고 reviewable한 단계로 제안

## 10. Regression Checklist

* DnD
* edit handle
* StylePanel
* inline input, 만약 도입한다면
* preview/code/export 반영

제약:

* 코드를 수정하지 마세요.
* 추측과 확인된 사실을 구분하세요.
* 실제 파일 경로를 사용하세요.
* 관련 없는 mini-project 파일은 제외하세요.
* blockDefinitions-driven 구조를 유지하는 방향으로 평가하세요.
* Inline input을 제안하더라도, 아직 전체 블록에 확대하지 말고 H1/P prototype 수준부터 판단하세요.
