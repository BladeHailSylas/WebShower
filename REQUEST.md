SLIDER_ZONE v1.1 UI polish 구현 계획을 작성해 주세요.

이번 요청은 **조사와 구현 계획 수립**입니다.
아직 코드를 수정하지 마세요.

## 배경

Block Studio에는 현재 `SLIDER_ZONE` v1이 구현되어 있습니다.

확인된 상태:

* `SLIDER_ZONE` 추가 가능
* `SLIDE_ITEM`은 internal block으로 동작
* 슬라이드가 없을 때 / 1개일 때 / 2개 이상일 때 처리됨
* 첫 슬라이드 / 마지막 슬라이드에서 이전·다음 버튼 상태 처리됨
* Preview에서 이전/다음 버튼 작동
* Export HTML에서도 이전/다음 버튼 작동
* 한 페이지에 여러 개의 `SLIDER_ZONE`이 있어도 각 slider가 독립적으로 작동
* 현재 구조상 큰 파괴나 회귀는 보이지 않음

이제 v1.1에서는 새 기능을 크게 늘리는 것이 아니라, **시각적 품질과 사용감 개선**에 집중합니다.

## 현재 문제

현재 `SLIDER_ZONE`은 기능적으로는 작동하지만 다음 문제가 있습니다.

1. 슬라이드를 넘길 때 전환이 뚝뚝 끊겨 보임
2. 슬라이드마다 내부 요소 크기가 다르면 slider 전체 높이가 변해서 화면이 흔들려 보임

## v1.1 목표

이번 v1.1의 목표는 다음 두 가지입니다.

```text
1. 슬라이드 전환을 더 부드럽게 보이도록 개선
2. 슬라이더 높이를 더 안정적으로 유지할 수 있는 옵션 검토
```

우선 선호하는 방향:

```text
- fade transition
- SLIDER_ZONE 전용 높이 토큰
```

## 중요한 범위 제한

이번 작업은 `SLIDER_ZONE` v1.1 UI polish입니다.

기능 확장이 아니라 기존 수동 이전/다음 슬라이더의 시각적 품질 개선만 다룹니다.

v1.1에서 구현하지 않을 것:

* autoplay
* autoplay interval
* loop
* swipe / drag transition
* dots indicator
* thumbnail
* 여러 장 동시 표시
* responsive slidesPerView
* transition 종류 선택 UI
* transition duration 설정 UI
* 슬라이드별 transition 설정
* 복잡한 height auto-measurement
* 이미지 로딩 후 높이 재계산 로직
* Canvas renderer 대규모 변경
* HtmlBlock 모델 변경
* slots migration
* Code View 전용 generator
* DnD listener / drag handle / edit handle 변경
* unrelated repository 변경

## 조사할 것

현재 repo의 `SLIDER_ZONE` 구현을 확인한 뒤, 다음을 조사해 주세요.

### 1. 현재 SLIDER_ZONE 구조

다음을 실제 파일명과 함수명 기준으로 정리해 주세요.

* `SLIDER_ZONE` definition
* `SLIDE_ITEM` definition
* Preview renderer / slider preview component
* Export interactive exporter
* Code View가 사용하는 compiler/export 경로
* StylePanel에 노출된 `SLIDER_ZONE` 스타일 필드
* `SLIDER_ZONE` / `SLIDE_ITEM`의 기본 className
* 현재 slider viewport / slide / controls 구조

### 2. 전환 애니메이션

v1.1에서는 우선 `fade transition`을 선호합니다.

다음을 검토해 주세요.

* 현재 Preview 구조에서 fade transition을 넣을 수 있는지
* 현재 Export JS 구조에서 fade transition을 동일하게 넣을 수 있는지
* Preview와 Export가 같은 의미로 동작할 수 있는지
* 현재처럼 한 번에 하나의 slide만 렌더링하는 구조라면 fade가 가능한지
* fade를 위해 모든 slide를 DOM에 두고 `opacity` / `hidden`을 제어해야 하는지
* 아니면 현재 렌더링 구조를 유지하면서 CSS transition을 적용할 수 있는지
* 0개 / 1개 / 2개 이상 상태에서 transition 처리가 어떻게 달라지는지
* 끝 버튼 비활성화 정책과 충돌하지 않는지

우선은 수평 slide transition보다 fade transition을 선호합니다.
좌우 translate track 구조는 v1.1에서는 과도할 수 있으므로 신중히 검토해 주세요.

### 3. 높이 안정화

현재는 슬라이드 내부 요소 크기에 따라 slider 높이가 변할 수 있습니다.

v1.1에서는 복잡한 자동 측정 방식보다, 토큰 기반 높이 옵션을 선호합니다.

검토할 옵션:

```ts
styles.sliderHeight?: "default" | "sm" | "md" | "lg" | "xl";
```

또는 repo의 기존 명명 규칙에 더 맞는 이름이 있다면 제안해 주세요.

권장 UI 라벨:

```text
슬라이더 높이
```

권장 선택지 예시:

```text
기본
낮게
보통
높게
아주 높게
```

권장 class mapping 예시:

```text
default 또는 미설정 → 기존 높이 유지
sm → min-h-48
md → min-h-64
lg → min-h-80
xl → min-h-96
```

실제 mapping은 repo의 기존 Tailwind 사용 방식과 디자인에 맞춰 제안해 주세요.

확인할 것:

* 이 옵션을 `StyleProps`에 둘지, slider-specific style field로 볼지
* `transformGuiToTailwind` / resolver에서 처리할지
* `SLIDER_ZONE` 전용 class mapping으로 처리할지
* Preview / Export / Code View에서 같은 class 결과가 나오는지
* Canvas에는 이 높이 옵션을 실제로 반영할지, 아니면 Preview/Export 중심으로 둘지
* 0개 슬라이드 상태에서도 높이가 적용되어야 하는지
* 1개 슬라이드 상태와 복수 슬라이드 상태에서 같은 높이 정책을 쓸 수 있는지

## 권장 방향

가능하면 다음 방향을 우선 검토해 주세요.

### 전환

* fade transition만 추가
* 전환 duration은 고정값으로 둠
* transition 종류 선택 UI는 추가하지 않음
* transition 관련 StylePanel 옵션은 추가하지 않음

### 높이

* `SLIDER_ZONE` 전용 높이 토큰 추가
* UI 라벨은 `슬라이더 높이`
* StylePanel에서는 기존 구조에 맞는 적절한 섹션에 배치
* 자유 입력이 아니라 제한된 토큰 사용
* 일반 `minHeight` 공통 스타일로 확장하지 않음

### Canvas

* Canvas 편집 구조는 크게 바꾸지 않음
* Canvas에서는 모든 `SLIDE_ITEM`을 펼쳐 보여주는 기존 편집 방식 유지
* Canvas에 fade transition을 적용하지 않음
* Canvas에 높이 옵션을 강하게 반영해 편집 UX를 해치지 않도록 주의
* 필요한 경우 Preview/Export 중심 적용으로 제한

## 구현 계획에서 답해야 할 질문

다음 질문에 명확히 답해 주세요.

1. fade transition 구현을 위해 Preview 구조를 얼마나 바꿔야 하나요?
2. Export JS 구조를 얼마나 바꿔야 하나요?
3. 현재처럼 선택된 slide만 렌더링하는 구조를 유지할 수 있나요?
4. 모든 slide를 DOM에 두는 방식이 필요하다면, 0개/1개/복수 상태와 접근성 처리는 어떻게 하나요?
5. `hidden`과 `opacity` transition은 함께 사용할 수 있나요?
6. Export에서 여러 slider instance의 독립 동작은 유지되나요?
7. slider height 옵션은 어디에 저장하는 것이 가장 적절한가요?
8. slider height class는 기존 resolver 정책과 충돌하지 않나요?
9. 기존 `paddingSize`, `marginSize`, border, shadow, rounded, text style과 충돌하지 않나요?
10. Code View는 기존 compiler/export 결과를 그대로 표시하나요?
11. SLIDE_ITEM의 내부 content가 CONTAINER/CARD를 포함해도 높이와 transition이 안정적인가요?
12. v1.1에서 반드시 하지 말아야 할 작업은 무엇인가요?

## 보고서 형식

다음 구조로 작성해 주세요.

### 1. 요약 결론

* v1.1 구현 가능 여부
* 권장 방식
* 주요 위험
* 제외해야 할 것

### 2. 현재 구조 요약

* 관련 파일
* Preview 구조
* Export 구조
* StylePanel / style field 구조
* 현재 높이와 전환 처리 방식

### 3. Fade transition 설계안

* Preview 구현 방식
* Export 구현 방식
* DOM 구조 변경 필요 여부
* CSS class / inline style 사용 여부
* 0개 / 1개 / 복수 slide 처리
* 접근성 영향
* 여러 slider instance 영향

### 4. Slider height 설계안

* 필드명 후보
* 저장 위치
* UI 라벨 / 선택지
* class mapping
* StylePanel 섹션
* Preview / Export / Code View 반영
* Canvas 반영 여부
* 기존 스타일과의 충돌 가능성

### 5. 권장 구현 범위

v1.1에서 구현할 것과 구현하지 않을 것을 구분해 주세요.

### 6. 수정 파일 계획

예상 수정 파일과 새 파일이 있다면 정리해 주세요.

### 7. 검증 계획

자동 검증:

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run lint
git diff --check
```

필요 시 changed-file lint를 제안해 주세요.

수동 검증에는 최소한 다음을 포함해 주세요.

* 슬라이드 0개 상태
* 슬라이드 1개 상태
* 슬라이드 2개 이상 상태
* 첫 슬라이드 / 마지막 슬라이드 버튼 상태
* fade transition Preview 동작
* fade transition Export 동작
* 여러 SLIDER_ZONE instance 독립 동작
* slider height 기본 / 낮게 / 보통 / 높게 / 아주 높게
* SLIDE_ITEM 내부에 HEADING / PARAGRAPH / IMAGE / LINK
* SLIDE_ITEM 내부에 CONTAINER / CARD
* 높이가 다른 슬라이드 간 이동 시 흔들림 개선 여부
* Code View class/output 확인
* Export HTML 확인
* 기존 SLIDER_ZONE 추가 / 슬라이드 추가 / 재정렬 / 삭제 회귀
* 기존 GRID_ZONE, LIST/LIST_ITEM, PASSWORD_ZONE, TOGGLE_ZONE 회귀 없음
* drag handle / edit handle 회귀 없음

## 중요

이번 요청에서는 코드를 수정하지 마세요.
조사와 v1.1 구현 계획만 작성해 주세요.

응답은 한국어로 작성해 주세요.
