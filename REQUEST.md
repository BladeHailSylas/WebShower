Code View v2 구현 계획을 작성해 주세요.

이번 요청은 **조사와 계획 수립**입니다.
아직 코드를 수정하지 마세요.

## 배경

Block Studio에는 현재 Code View v1이 구현되어 있으며, 기능적으로는 충분히 잘 작동합니다.

현재 원칙:

* Code View는 read-only입니다.
* Code View는 기존 compiler/export 경로를 재사용해야 합니다.
* Code View 전용 HTML generator를 만들면 안 됩니다.
* Preview / Code View / Export는 같은 의미의 HTML 구조를 보여야 합니다.
* Code View는 학생들이 블록 구조가 실제 HTML/CSS/JS로 어떻게 변환되는지 이해하도록 돕는 교육용 transparency feature입니다.

최근 Learning Templates v1도 구현되었으므로, Code View가 더 읽기 쉬워지면 템플릿을 통해 만든 구조를 학습하는 데 도움이 됩니다.

## v2 목표

Code View v2의 목표는 **읽기 경험 개선**입니다.

v2에서 다룰 대표 개선 사항은 다음 두 가지입니다.

```text
1. HTML formatting
   - 줄바꿈
   - 들여쓰기
   - 중첩 구조가 보이게 표시

2. Syntax highlighting
   - 태그 이름
   - 속성 이름
   - 속성 값
   - 텍스트 내용
   - 주석 / script / style 구분 가능성 검토
```

v2는 코드 편집 기능이 아닙니다.
기존 raw HTML 생성 경로를 유지하고, Code View 표시 단계에서만 formatting/highlighting을 적용하는 방향을 선호합니다.

권장 흐름:

```text
HtmlBlock[]
→ 기존 compileBlockHtml / compilePageHtml
→ raw HTML string
→ display-only formatter
→ display-only highlighter
→ Code View 표시
```

## 중요한 제한

다음은 v2에서 구현하지 않습니다.

* Code View에서 코드 직접 수정
* HTML → block tree 역변환
* Code View 전용 generator
* Preview JSX로부터 HTML 재생성
* escaping 재구현으로 compiler 의미 변경
* 대형 코드 에디터 의존성 도입
* 실시간 linting
* HTML validation
* diff view
* 선택 블록의 코드 range mapping
* 선택 블록 코드 강조
* 접기/펼치기
* 검색 기능
* Export 경로 변경
* HtmlBlock 모델 변경
* blockDefinitions 변경
* DnD / Canvas / StylePanel 변경
* unrelated repository 변경

## 조사할 것

실제 repo 구조를 확인한 뒤 다음을 조사해 주세요.

### 1. 현재 Code View v1 구조

다음을 실제 파일명과 함수명 기준으로 정리해 주세요.

* Code View 컴포넌트 위치
* Code View가 raw HTML string을 받는 방식
* `compileBlocksForCodeView` 또는 관련 adapter
* `compileBlockHtml` 사용 경로
* body fragment / full document 표시 여부
* copy button 동작
* empty state 동작
* HTML escaping 처리 위치
* 현재 CSS class / layout 구조

### 2. Formatting 적용 가능성

다음을 확인해 주세요.

* 기존 compiler 결과 string을 display-only로 formatting할 수 있는지
* formatter가 HTML 의미를 바꾸지 않는지
* body fragment와 full document 모두 처리해야 하는지
* SLIDER_ZONE exporter처럼 script가 포함된 HTML도 안전하게 처리 가능한지
* script/style 내용은 formatting 대상에서 제외하거나 보존해야 하는지
* 자체 lightweight formatter로 충분한지
* Prettier 같은 외부 의존성이 필요한지
* 외부 의존성 도입 시 번들 크기와 유지보수 부담은 어떤지

우선은 대형 의존성 없이, 현재 compiler가 생성하는 예측 가능한 HTML을 대상으로 하는 lightweight formatter를 선호합니다.

다만 자체 formatter가 script/style을 위험하게 바꿀 가능성이 크다면, 안전한 범위 제한 또는 다른 방안을 제안해 주세요.

### 3. Syntax highlighting 적용 가능성

다음을 확인해 주세요.

* raw HTML을 안전하게 escape한 뒤 token span으로 감싸는 방식이 가능한지
* `dangerouslySetInnerHTML`이 필요한지, 필요하다면 XSS 위험을 어떻게 피할지
* 태그 이름, 속성 이름, 속성 값, 텍스트를 구분할 수 있는지
* script/style 블록을 어떻게 표시할지
* highlighting이 copy되는 코드 내용에 영향을 주지 않도록 할 수 있는지
* Tailwind class 기반 색상만으로 충분한지
* 별도 syntax highlighting 라이브러리가 필요한지

우선은 read-only 표시용 lightweight highlighter를 선호합니다.
대형 코드 에디터 라이브러리는 도입하지 마세요.

### 4. Copy behavior

현재 copy button이 있다면 다음을 검토해 주세요.

* v2에서는 raw HTML을 복사할지
* formatted HTML을 복사할지
* 화면에 보이는 코드와 복사되는 코드가 일치해야 하는지
* Export HTML은 계속 기존 compile/export 경로를 사용해야 함

선호 방향:

```text
Code View에 표시되는 formatted HTML을 복사한다.
Export는 기존 compiler/export 경로를 그대로 사용한다.
```

단, 현재 UX와 더 잘 맞는 대안이 있다면 보고서에 비교해 주세요.

### 5. Learning Templates와의 관계

Learning Templates로 추가한 예시 블록 묶음이 Code View v2에서 더 읽기 쉬워져야 합니다.

다음을 확인해 주세요.

* nested CONTAINER / CARD 구조가 들여쓰기로 잘 보이는지
* GRID_ZONE, LIST/LIST_ITEM 구조가 잘 보이는지
* PASSWORD_ZONE / TOGGLE_ZONE 출력이 지나치게 읽기 어려워지지 않는지
* SLIDER_ZONE exporter HTML/JS가 formatting/highlighting에서 깨지지 않는지
* interactive block의 script가 교육적으로 너무 복잡하게 보일 때 최소한 구분되어 보이는지

## 권장 v2 범위

v2에서 구현할 것:

```text
- Code View 표시용 HTML formatter
- Code View 표시용 syntax highlighter
- formatted HTML copy 정책 정리
- empty state / copy button 기존 동작 유지
```

v2에서 구현하지 않을 것:

```text
- 코드 편집
- Code View 전용 HTML 생성
- block 선택과 코드 range 연결
- 접기/펼치기
- 검색
- diff
- 대형 editor dependency
```

## 구현 방식 제안 시 비교할 것

보고서에서는 최소한 다음 방식을 비교해 주세요.

### 방식 A: 자체 lightweight formatter + highlighter

* 장점
* 단점
* 처리 가능한 HTML 범위
* script/style 처리 정책
* 예상 수정 파일
* 위험

### 방식 B: 작은 syntax highlighting 라이브러리 사용

* 후보가 있다면 이름과 이유
* 번들 크기 / 의존성 부담
* formatter는 별도로 필요한지
* 위험

### 방식 C: Prettier standalone 사용

* 장점
* 단점
* 번들 크기
* import 방식
* html parser 필요 여부
* Block Studio v2 범위에 과한지 여부

우선은 방식 A를 선호하지만, 실제 repo 상태에 따라 현실적인 권장안을 제시해 주세요.

## 보고서 형식

다음 구조로 작성해 주세요.

### 1. 요약 결론

* Code View v2 구현 가능 여부
* 권장 방식
* 가장 큰 위험
* v2에서 제외해야 할 것

### 2. 현재 Code View 구조

* 관련 파일
* compiler/export 경로
* copy button
* empty state
* 현재 표시 방식

### 3. Formatting 설계안

* formatter 위치
* 입력/출력
* body fragment/full document 처리
* script/style 처리
* SLIDER_ZONE exporter 처리
* HTML 의미 보존 방식
* 자체 formatter vs 외부 의존성 비교

### 4. Syntax highlighting 설계안

* highlighter 위치
* token 구분 방식
* escaping / XSS 안전성
* 표시용 span 구조
* Tailwind class 구성
* copy 동작과 분리
* script/style 처리

### 5. Copy behavior 제안

* raw HTML copy
* formatted HTML copy
* 권장 정책
* 기존 사용자 경험과의 차이

### 6. 수정 파일 계획

예상 수정 파일과 새 파일이 있다면 정리해 주세요.

### 7. Phase별 구현 제안

작고 reviewable하게 나눠 주세요.

예시:

```text
CV2-1: 현재 Code View 구조 정리 및 formatter helper 추가
CV2-2: Code View 표시를 formatted HTML로 전환
CV2-3: syntax highlighting 추가
CV2-4: copy behavior 정리 및 회귀 검증
```

실제 repo 구조에 맞춰 더 적절한 Phase를 제안해 주세요.

### 8. 검증 계획

자동 검증:

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run lint
git diff --check
```

필요 시 changed-file lint를 제안해 주세요.

수동 검증에는 최소한 다음을 포함해 주세요.

* 빈 Canvas Code View
* 단순 HEADING / PARAGRAPH
* nested CONTAINER / CARD
* GRID_ZONE
* LIST / LIST_ITEM
* PASSWORD_ZONE
* TOGGLE_ZONE
* SLIDER_ZONE
* Learning Template 삽입 후 Code View
* formatting 줄바꿈/들여쓰기 확인
* syntax highlighting 확인
* copy button 결과 확인
* Export HTML이 기존처럼 작동하는지 확인
* Preview와 Code View 의미 일치 확인
* 기존 Code View empty state 회귀 없음
* 기존 Canvas / DnD / StylePanel 회귀 없음

## 중요

이번 요청에서는 코드를 수정하지 마세요.
조사와 Code View v2 구현 계획만 작성해 주세요.

응답은 한국어로 작성해 주세요.
