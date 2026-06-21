Learning Templates v1을 구현하기 전에, 현재 `starterTemplate`의 형식과 처리 방식이 다중 템플릿 확장에 적절한지 조사해 주세요.

이번 요청은 **조사와 계획 수립**입니다.
아직 코드를 수정하지 마세요.

## 배경

Block Studio에는 현재 `starterTemplate`가 존재합니다.
앞으로 Learning Templates v1을 추가하려고 합니다.

Learning Templates v1의 목표는 다음과 같습니다.

```text
사용자가 예시 템플릿 목록에서 원하는 템플릿을 고르고,
“이 템플릿 추가하기” 버튼을 누르면,
해당 템플릿의 HtmlBlock[] 묶음이 현재 Canvas root 맨 아래에 추가된다.
```

v1에서는 드래그 앤 드롭으로 템플릿을 삽입하지 않습니다.

## 중요한 방향

Learning Templates v1은 새 블록 시스템을 만드는 작업이 아닙니다.
기존 `HtmlBlock` 구조와 기존 blockDefinitions / compiler / Preview / Code View / Export 경로를 유지해야 합니다.

원칙:

* `HtmlBlock` 모델을 변경하지 않습니다.
* slots migration을 하지 않습니다.
* Code View 전용 generator를 만들지 않습니다.
* DnD를 템플릿 삽입에 연결하지 않습니다.
* 템플릿 삽입은 버튼 클릭으로 처리합니다.
* 템플릿은 root canvas 맨 아래에 append하는 방식으로 시작합니다.
* nested 위치 삽입은 v1에서 제외합니다.
* 템플릿 데이터 안에 고정 id가 있더라도, 삽입 시에는 반드시 새 id로 재생성해야 합니다.
* SLIDER_ZONE, LIST, nested CONTAINER/CARD처럼 깊은 children 구조도 id가 재귀적으로 재생성되어야 합니다.

## 조사할 것

실제 repo 구조를 확인한 뒤 다음을 조사해 주세요.

### 1. starterTemplate 구조

다음을 확인해 주세요.

* `starterTemplate`가 어디에 정의되어 있는지
* 타입이 무엇인지
* `HtmlBlock[]`인지, 다른 wrapper 구조가 있는지
* block id를 포함하고 있는지
* children / defaultChildren / conditionalChildren을 포함하는지
* LIST/LIST_ITEM, SLIDER_ZONE/SLIDE_ITEM 같은 internal block 구조를 담을 수 있는지
* 스타일 필드와 block-specific field를 담기에 충분한지

### 2. starterTemplate 처리 경로

다음을 확인해 주세요.

* 현재 `starterTemplate`가 어디에서 사용되는지
* 앱 시작 시 초기 Canvas를 채우는 데만 쓰이는지
* reset/new document 기능과 연결되어 있는지
* 현재 처리 방식이 기존 block factory를 통하는지
* starterTemplate 안의 id를 그대로 쓰는지
* 매번 새 id를 생성하는지
* deep clone 또는 id 재생성 helper가 이미 있는지
* 없다면 어디에 feature-local helper를 두는 것이 적절한지

### 3. Learning Templates로 확장 가능성

다음을 검토해 주세요.

* 현재 `starterTemplate` 형식을 그대로 여러 템플릿에 재사용할 수 있는지
* `LearningTemplate` 타입을 새로 만드는 것이 필요한지
* 최소 타입은 무엇이면 충분한지

예상 후보:

```ts
type LearningTemplate = {
  id: string;
  title: string;
  description: string;
  blocks: HtmlBlock[];
};
```

교육적 설명을 위해 다음 필드를 추가할 필요가 있는지도 검토해 주세요.

```ts
learningPoints?: string[];
usedBlocks?: string[];
category?: string;
```

단, v1에서 과도한 템플릿 registry나 검색 시스템은 만들지 않는 방향을 선호합니다.

### 4. 템플릿 삽입 방식

v1에서는 버튼 삽입만 사용합니다.

검토할 것:

* 선택한 템플릿의 `blocks`를 현재 Canvas root 맨 아래에 append할 수 있는지
* 여러 block을 한 번에 append할 수 있는 tree mutation 경로가 있는지
* 없다면 최소 helper가 필요한지
* 삽입된 block들의 id를 모두 새로 생성할 수 있는지
* children 깊이에 관계없이 재귀적으로 id를 새로 만들 수 있는지
* 삽입 후 어떤 block을 selected 상태로 둘지
* 삽입 후 Preview / Code View / Export가 즉시 갱신되는지
* undo/redo가 있다면 그 흐름에 영향을 주는지
* DnD 로직을 건드리지 않아도 되는지

### 5. UI 위치와 UX

Learning Templates v1 UI를 어디에 둘 수 있을지 조사해 주세요.

후보:

* BlockPalette 안에 별도 “템플릿” 섹션
* BlockPalette 옆 별도 탭
* StylePanel과는 분리
* 상단 또는 사이드바의 “예시 템플릿” 패널

v1에서는 다음 정도면 충분합니다.

```text
템플릿 제목
짧은 설명
사용 블록 또는 학습 포인트
“이 템플릿 추가하기” 버튼
```

드래그 앤 드롭 삽입은 제외합니다.

### 6. v1 템플릿 후보

현재 구현된 블록과 스타일을 기준으로 v1에 적절한 템플릿 후보를 제안해 주세요.

예시 후보:

* 자기소개 카드
* 공지사항 박스
* 2열 소개 섹션
* 프로젝트 포트폴리오 그리드
* FAQ 토글 섹션
* 비밀번호 잠금 콘텐츠 예시
* 메인 슬라이더 섹션
* 단계별 안내 목록

각 템플릿이 사용하는 블록과 학습 포인트도 간단히 제안해 주세요.

## v1 제외 범위

다음은 Learning Templates v1에서 제외합니다.

* 템플릿 drag/drop 삽입
* nested 위치 삽입
* 사용자 커스텀 템플릿 저장
* 템플릿 편집기
* 템플릿 검색
* 원격 템플릿 로딩
* 템플릿 카테고리 필터 고도화
* 템플릿 미리보기 iframe
* 템플릿 공유/라이브러리 기능
* HtmlBlock 모델 변경
* slots migration
* Code View 전용 generator
* DnD listener 변경
* unrelated repository 변경

## 보고서 형식

다음 구조로 보고서를 작성해 주세요.

### 1. 요약 결론

* 현재 `starterTemplate` 구조가 Learning Templates v1 확장에 적절한지
* 그대로 재사용 가능한 부분
* 보완이 필요한 부분
* 가장 큰 위험 3~5개

### 2. 현재 starterTemplate 구조와 처리 경로

* 파일 위치
* 타입
* 사용 위치
* id 처리 방식
* 초기화/삽입 흐름

### 3. LearningTemplate 타입 제안

* 최소 타입
* v1에서 포함할 메타데이터
* v1에서 제외할 메타데이터
* 기존 starterTemplate와의 관계

### 4. 템플릿 deep clone / id 재생성 계획

* 기존 helper 존재 여부
* 새 helper 필요 여부
* children 재귀 처리
* internal block 처리
* SLIDER_ZONE / LIST 등 중첩 구조 처리
* id 충돌 방지 방식

### 5. 템플릿 삽입 계획

* root append 방식
* 여러 block 삽입 방식
* selection 처리
* Preview / Code View / Export 갱신
* DnD와 분리되는지

### 6. UI 배치 제안

* 추천 위치
* v1 UI 구성
* StylePanel / BlockPalette와의 관계
* 드래그 삽입을 제외하는 이유

### 7. v1 템플릿 후보

각 후보에 대해 다음 형식으로 정리해 주세요.

```text
템플릿 이름:
사용 블록:
사용 스타일:
학습 포인트:
구현 난이도:
```

### 8. 권장 구현 Phase

작고 reviewable한 Phase로 나눠 주세요.

예시:

```text
T1: starterTemplate 구조 조사 및 template data 타입 정리
T2: deep clone / id regeneration helper
T3: Template gallery UI
T4: root append insertion
T5: sample templates 작성 및 회귀 검증
```

실제 repo 구조에 맞춰 더 적절한 Phase를 제안해 주세요.

### 9. 검증 계획

자동 검증:

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run lint
git diff --check
```

필요 시 changed-file lint를 제안해 주세요.

수동 검증에는 최소한 다음을 포함해 주세요.

* 템플릿 목록이 표시되는지
* “이 템플릿 추가하기” 버튼 동작
* Canvas root 맨 아래에 블록 묶음 추가
* 같은 템플릿을 여러 번 추가해도 id 충돌 없음
* nested children id도 재생성
* LIST/LIST_ITEM 구조 유지
* SLIDER_ZONE/SLIDE_ITEM 구조 유지
* PASSWORD_ZONE/TOGGLE_ZONE 포함 템플릿 정상 작동
* Preview 갱신
* Code View 갱신
* Export HTML 정상
* 기존 DnD 동작 회귀 없음
* 기존 block palette 동작 회귀 없음
* 기존 StylePanel 편집 회귀 없음

## 중요

이번 요청에서는 코드를 수정하지 마세요.
조사와 계획 보고서만 작성해 주세요.

응답은 한국어로 작성해 주세요.
