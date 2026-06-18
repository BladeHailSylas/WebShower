현재 목표는 Block Studio에 “Code View” 기능을 추가하기 전에, 기존 HTML export / deploy / compiler 경로를 재사용할 수 있는지 조사하는 것입니다.

중요:

* 아직 코드를 수정하지 마세요.
* 구현 계획을 너무 앞서가지 마세요.
* 먼저 repo를 읽고, 기존 HTML 생성 경로가 Code View에 재사용 가능한지 보고서로 정리해 주세요.
* 관련 없는 mini-project, route, layout, shared app 구조는 건드리지 마세요.
* Block Studio 관련 파일만 조사하세요.
* AGENTS.md의 feature-scoped refactor 원칙을 유지하세요.

## 배경

이 프로젝트는 React + TypeScript + Tailwind CSS + DaisyUI 기반의 교육용 웹 빌더입니다.

사용자는 팔레트에서 블록을 끌어와 페이지를 만들고, preview에서 렌더링 결과를 확인할 수 있습니다. 프로젝트의 교육적 목적은 학생이 웹 프로그래밍과 친해지고, 블록으로 만든 페이지가 실제 HTML/CSS와 어떻게 연결되는지 이해하게 만드는 것입니다.

현재는 주로 “렌더링 결과 보기” 중심입니다. 다음 기능으로 “Code View”를 추가하려고 합니다.

Code View의 기본 아이디어:

* 사용자가 만든 block tree를 실제 HTML 코드로 전사한 결과를 보여준다.
* 가능하면 기존 배포/export 알고리즘을 재사용한다.
* 배포용 HTML과 Code View HTML이 서로 다른 생성 경로를 갖지 않게 한다.
* Code View는 v1에서 read-only viewer로 둔다.
* HTML을 다시 block tree로 역변환하는 기능은 이번 범위가 아니다.

최근 작업 맥락:

* `GRID_ZONE`은 direct children을 CSS grid item으로 자동 배치하는 layout container로 정리되었습니다.
* 데이터 모델은 `HtmlBlock.children` 단일 배열과 `styles.gridCols`만 유지합니다.
* `GRID_ZONE`의 preview/export에도 `styles.gridCols ?? 2`가 inline grid style로 반영되도록 수정되었습니다.
* 이 변경은 Code View가 export/compiler 경로를 제대로 재사용하는지 검증하기 좋은 사례입니다.

## 이번 조사에서 가장 중요한 질문

Code View는 새 HTML 생성기를 만들면 안 됩니다.

핵심 질문은 다음입니다.

> 기존 HTML export/deploy/compiler 경로 중 어느 부분을 Code View가 재사용해야 하는가?

특히 다음을 구분해 주세요.

1. block tree → HTML fragment/string compiler
2. full HTML document generator
3. QR/export/download/deploy UI flow
4. preview React renderer
5. HTML formatting / escaping / pretty-printing logic

Code View가 재사용해야 하는 것은 주로 1번입니다.
2번은 필요하다면 옵션으로 검토하고, 3번은 재사용 대상이 아닐 가능성이 큽니다.
4번 preview renderer는 Code View의 source of truth가 아니어야 합니다.

## 조사 대상 파일

먼저 실제 repo를 확인한 뒤, 관련 파일을 실제 경로 기준으로 정리해 주세요.

우선적으로 확인할 것으로 예상되는 파일:

* `src/pages/BlockStudioPage.tsx`
* `src/components/block/preview/BlockRenderer.tsx`
* `src/components/block/preview/PreviewBlockRenderer.tsx`
* `src/components/block/preview/QrExportPanel.tsx`
* `src/features/block-studio/blocks/html/blockHtmlCompiler.ts`
* `src/features/block-studio/blocks/html/htmlSchemaCompiler.ts`
* `src/features/block-studio/blocks/html/interactiveExporters.ts`
* `src/features/block-studio/blocks/html/escapeHtml.ts`
* `src/features/block-studio/blocks/html/transformGuiToTailwind.ts`
* `src/features/block-studio/blocks/definitions/*.definition.ts`
* `src/features/block-studio/blocks/types/htmlSchema.types.ts`
* `src/features/block-studio/hooks/useBlockStudio.ts`
* block state가 정의/관리되는 파일
* export/download/QR 관련 UI 파일

실제 파일 구조가 다르면 실제 경로를 기준으로 보고해 주세요.

## 조사 내용

### 1. 현재 HTML 생성 경로 요약

현재 사용자가 만든 block tree가 HTML로 변환되는 흐름을 정리해 주세요.

다음을 포함해 주세요.

* entry point 함수
* 입력 타입
* 출력 타입
* block tree를 받는 위치
* page-level wrapper를 만드는지 여부
* block-level HTML fragment만 만드는지 여부
* interactive blocks(password/toggle 등)를 어떻게 export하는지
* GRID_ZONE export 결과가 어디에서 만들어지는지
* escaping은 어디서 처리하는지
* className/style 변환은 어디서 처리하는지

### 2. Export/deploy UI 흐름과 compiler 분리 정도

다음을 확인해 주세요.

* QR/export/download UI가 compiler와 얼마나 결합되어 있는지
* 순수 함수로 재사용 가능한 compiler가 이미 있는지
* React component 안에서 HTML 문자열을 직접 조립하는 부분이 있는지
* DOM API, Blob, QR, download 로직과 HTML generation이 섞여 있는지
* Code View가 import해서 사용할 수 있는 안전한 함수가 있는지

### 3. Code View 재사용 가능성 평가

다음 기준으로 평가해 주세요.

* 기존 compiler를 그대로 사용할 수 있는가?
* 약간의 adapter/helper만 있으면 가능한가?
* compiler 분리가 먼저 필요한가?
* Code View 전용 HTML 생성기를 새로 만들 위험이 있는가?
* 현재 compiler output이 사람이 읽을 수 있는가?
* pretty-print/formatting이 필요한가?
* Code View에서 보여줄 HTML은 body fragment가 좋은가, full document가 좋은가?
* v1에서 어떤 범위가 가장 안전한가?

### 4. Data-driven 구조 검증

Code View는 data-driven 구조를 검증하는 기능이어야 합니다.

다음을 확인해 주세요.

* 새 blockDefinition을 추가하면 Code View가 자동 반영되는 구조인가?
* `htmlSchema` 기반 블록은 Code View에 자동 반영되는가?
* `htmlExporterKey` 또는 custom exporter가 필요한 블록은 어디서 처리되는가?
* Code View UI가 block type별 분기를 몰라도 되는가?
* 현재 `GRID_ZONE`처럼 renderer/exporter 특수 처리가 필요한 블록이 어디에 있는가?
* preview와 export가 불일치할 위험이 있는 블록은 무엇인가?

### 5. Code View v1 범위 제안

아직 구현하지 말고, 안전한 v1 범위를 제안해 주세요.

v1 기본 가정:

* read-only HTML viewer
* 기존 compiler output 재사용
* preview 옆 또는 preview panel 내부에 Code View 탭 추가
* copy button 제공
* syntax highlighting은 optional
* HTML → block tree 역변환 없음
* 코드 편집 없음
* Monaco 같은 무거운 editor 도입 없음
* QR/download/deploy 흐름 변경 없음

다음을 제안해 주세요.

* 어느 컴포넌트에 Code View UI를 붙이는 것이 자연스러운지
* Code View용 새 컴포넌트가 필요하다면 파일 경로 제안
* 기존 compiler에 adapter가 필요하다면 파일 경로 제안
* HTML formatter가 필요하다면 파일 경로 제안
* Code View가 full document와 body fragment 중 무엇을 보여주는 것이 좋을지
* copy button은 어디에 두는 것이 좋을지
* empty canvas일 때 어떤 메시지가 적절한지

### 6. 안정화 패치 필요 여부

Code View 구현 전에 선행해야 할 안정화 작업이 있는지 판단해 주세요.

특히:

* `GRID_ZONE` grid style 계산이 canvas/preview/export에 흩어져 있는지
* HTML compiler가 Code View에서 재사용하기에 충분히 순수한지
* export output이 너무 minified되어 있거나 읽기 어려운지
* escaping/security 문제가 있는지
* 전체 build/lint가 기존 unrelated 오류 때문에 실패하는 상태가 Code View 작업에 어떤 영향을 주는지

### 7. 위험 평가

위험을 우선순위로 정리해 주세요.

예상 위험:

* Code View가 export 경로와 달라져 중복 source of truth가 생김
* preview와 Code View/export가 서로 다르게 보임
* full HTML document와 fragment 구분이 모호함
* interactive block export 결과가 교육용 Code View에서 너무 복잡함
* inline style/class escaping 누락
* syntax highlighting 도입으로 dependency가 커짐
* unrelated build/lint 오류 때문에 검증이 어려움

### 8. 추천 구현 순서

아직 구현하지 말고, 구현한다면 어떤 순서가 안전한지 제안해 주세요.

예상 방향:

1. 기존 compiler 재사용 가능성 확인
2. 필요하면 compiler adapter 또는 `compileBlocksForCodeView` 같은 얇은 wrapper 추가
3. Code View formatter 추가
4. Code View panel 컴포넌트 추가
5. Preview panel에 “미리보기 / 코드 보기” 탭 추가
6. copy button 추가
7. GRID_ZONE, password/toggle/container 등 export 결과 검증
8. 수동 테스트 체크리스트 실행

## 출력 형식

다음 형식으로 보고서를 작성해 주세요.

# Code View Reuse Feasibility Report

## 1. Executive Summary

* 기존 compiler 재사용 가능성
* 바로 구현 가능한지, 선행 정리가 필요한지
* 추천 v1 범위

## 2. File Map

표 형식:
| Area | File | Responsibility | Reuse for Code View? | Notes |

## 3. Current HTML Export Flow

* block tree → HTML 흐름
* full document vs fragment 구분
* interactive blocks 처리
* GRID_ZONE 처리
* escaping/style/class 처리

## 4. Coupling Analysis

* compiler와 QR/download/deploy UI 결합도
* 순수 함수 여부
* Code View가 import 가능한 함수

## 5. Reuse Strategy

* 그대로 재사용할 함수
* adapter가 필요한 함수
* 분리/이동이 필요한 로직
* 새로 만들면 안 되는 중복 로직

## 6. Data-driven Assessment

* blockDefinitions/htmlSchema/exporterKey와 Code View의 관계
* 새 블록 추가 시 Code View 자동 반영 가능성
* type-specific 분기가 필요한 지점

## 7. Proposed Code View v1 Scope

* UI 위치
* 보여줄 코드 범위: fragment/full document
* formatting
* copy button
* empty state
* optional features와 non-goals

## 8. Stabilization Needed Before Implementation

* 선행해야 할 작은 안정화 패치
* 당장 하지 않아도 되는 작업

## 9. Risk Assessment

우선순위 높은 위험 5~10개

## 10. Recommended Implementation Plan

작고 reviewable한 단계로 제안

## 11. Regression Checklist

수동 검증 항목

제약:

* 코드를 수정하지 마세요.
* 추측과 확인된 사실을 구분하세요.
* 실제 파일 경로를 사용하세요.
* 관련 없는 mini-project 파일은 제외하세요.
* Code View 전용 HTML generator를 새로 만들지 않는 방향을 우선 검토하세요.
* Code View는 기존 export/compiler 경로를 검증하는 창이어야 합니다.
