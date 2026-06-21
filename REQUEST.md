Tutorial Overlay v1.2: Success Feedback 구현 계획을 작성해 주세요.

이번 요청은 **조사와 구현 계획 수립**입니다.
아직 코드를 수정하지 마세요.

## 배경

Block Studio에는 현재 Tutorial Overlay가 구현되어 있습니다.

현재 확인된 상태:

* Canvas 상단에 Tutorial Mission Bar가 표시됨
* block tree / UI signal / property 변경 조건을 기반으로 미션 완료를 추적함
* 튜토리얼은 block tree를 직접 수정하지 않음
* 튜토리얼은 DnD, StylePanel, Preview, Code View, Export 경로를 방해하지 않음
* 완료된 미션은 ledger에 기록되어 이후 블록을 삭제하거나 값을 되돌려도 진행률이 역행하지 않음
* 현재는 미션 성공 시 곧바로 다음 미션으로 넘어가는 흐름임

현재 문제:

* 미션을 완료해도 사용자가 “무엇을 방금 배웠는지” 인지하기 전에 다음 미션으로 넘어감
* 튜토리얼이 체크리스트처럼 느껴지고, 개념 설명의 깊이가 부족함
* 성공 순간에 짧은 피드백과 학습 코멘트를 제공하면 교육 효과가 좋아질 수 있음

## 목표

Tutorial Overlay v1.2의 목표는 **미션 성공 피드백**입니다.

미션이 완료되었을 때 즉시 다음 미션으로 넘어가지 않고, 짧은 성공 상태를 보여준 뒤 사용자가 직접 다음 미션으로 넘어가게 합니다.

원하는 흐름:

```text
미션 조건 충족
→ 성공 상태 표시
→ commentOnSuccess로 짧은 학습 코멘트 표시
→ 사용자가 “다음 미션” 버튼 클릭
→ 다음 미션 표시
```

예시:

```text
잘 했어요!
블록을 추가할 때 사용한 이 동작을 “드래그”라고 합니다.
[다음 미션]
```

## 핵심 원칙

반드시 지켜 주세요.

* 튜토리얼은 block tree를 직접 수정하지 않습니다.
* 튜토리얼은 DnD 이벤트를 가로채지 않습니다.
* StylePanel input handler를 변경하지 않습니다.
* Preview / Code View / Export 생성 경로를 변경하지 않습니다.
* HtmlBlock 모델을 변경하지 않습니다.
* blockDefinitions 구조를 변경하지 않습니다.
* localStorage / 계정 저장을 추가하지 않습니다.
* mission data는 여전히 선언적 데이터여야 합니다.
* `commentOnSuccess`에는 JSX, React component, function, mutation logic을 넣지 않습니다.
* 성공 피드백은 UI 상태일 뿐, 미션 조건 판정 자체를 바꾸지 않습니다.

## 제안 기능

### 1. TutorialMission에 commentOnSuccess 추가

`TutorialMission` 타입에 선택적 필드를 추가하는 방향을 검토해 주세요.

우선 후보:

```ts
type TutorialMission = {
  id: string;
  title: string;
  description: string;
  condition: TutorialCondition;
  commentOnSuccess?: string;
};
```

v1.2에서는 단순 문자열을 선호합니다.

다음과 같은 구조는 v1.2에서 과하면 제외해 주세요.

```ts
commentOnSuccess?: {
  title?: string;
  body: string;
};
```

단, 현재 UI 구조상 객체형이 더 안전하다면 이유를 설명해 주세요.

### 2. 성공 상태 표시

미션이 완료되면 Mission Bar가 다음 미션으로 바로 넘어가지 않고 성공 상태를 보여주도록 계획해 주세요.

성공 상태에는 다음을 표시합니다.

* 완료 표시
* 짧은 성공 제목
* `commentOnSuccess`
* “다음 미션” 버튼

`commentOnSuccess`가 없는 미션은 기본 성공 문구를 표시하거나, 성공 상태 없이 바로 다음으로 넘길지 비교해 주세요.

선호 방향:

```text
commentOnSuccess가 없더라도 짧은 기본 성공 상태는 표시한다.
```

기본 문구 예시:

```text
좋습니다! 다음 미션으로 넘어가 볼까요?
```

### 3. 다음 미션 이동 방식

v1.2에서는 자동 이동보다 사용자가 “다음 미션” 버튼을 눌러 이동하는 방식을 선호합니다.

검토할 것:

* 성공 상태에서 자동 timeout을 둘지
* 자동 timeout 없이 버튼만 둘지
* skip/hide/reopen과 success state가 어떻게 상호작용할지

선호 방향:

```text
자동 timeout 없이 “다음 미션” 버튼으로만 이동한다.
```

## 조사할 것

현재 Tutorial Overlay 구현을 확인한 뒤 다음을 조사해 주세요.

### 1. 현재 active mission 계산 구조

다음을 실제 파일명과 함수명 기준으로 정리해 주세요.

* mission data 위치
* TutorialMission 타입 위치
* evaluator 위치
* completed ledger 업데이트 방식
* active mission 계산 방식
* skipped mission 처리
* hidden/reopen 처리
* property-aware mission 완료 처리
* 여러 미션 동시 완료 처리

### 2. 성공 feedback state 필요성

현재 구조에서 미션 완료 후 곧바로 다음 미션으로 넘어가는 원인을 확인하고, 성공 상태를 추가하려면 어떤 상태가 필요한지 제안해 주세요.

후보:

```ts
type TutorialSuccessFeedback = {
  missionId: string;
  title: string;
  comment: string;
} | null;
```

또는 더 적절한 형태가 있다면 제안해 주세요.

검토할 것:

* completed ledger와 success feedback state를 어떻게 분리할지
* active mission 계산을 success feedback 중에는 잠시 멈출지
* success feedback 중에도 evaluator는 계속 동작해야 하는지
* success feedback 중 새 미션이 추가로 완료되면 어떻게 처리할지
* feedback state가 skip/hide/reopen에 미치는 영향

### 3. 여러 미션 동시 완료 처리

Learning Template 삽입이나 property 변경으로 여러 미션이 동시에 완료될 수 있습니다.

v1.2에서는 다음 정책을 선호합니다.

```text
여러 미션이 동시에 완료되면,
현재 activeMission이 완료된 경우에만 그 미션의 성공 피드백을 보여준다.
다른 동시에 완료된 미션은 completed ledger에는 기록하되 별도 피드백은 생략한다.
```

이 정책이 현재 구조에 적절한지 검토해 주세요.

검토할 것:

* 현재 active mission이 아닌 후속 미션이 먼저 완료되는 경우
* 템플릿 삽입으로 여러 조건이 한꺼번에 충족되는 경우
* success feedback을 연속 queue로 만들 필요가 있는지
* v1.2에서 queue는 과한지

선호 방향:

```text
success feedback queue는 v1.2에서 만들지 않는다.
현재 active mission 중심으로만 feedback을 표시한다.
```

### 4. skip / hide / reopen과의 관계

다음을 검토해 주세요.

* 성공 상태에서 “건너뛰기” 버튼을 보여줄지
* 성공 상태에서 “숨기기” 버튼은 유지할지
* success feedback 중 숨기면 reopen 시 성공 상태를 다시 보여줄지, 다음 미션으로 넘어갈지
* success feedback 중 skip이 가능한지
* 모든 미션 완료 상태와 success feedback이 충돌하지 않는지

선호 방향:

```text
성공 상태에서는 “다음 미션”과 “숨기기”만 보여준다.
건너뛰기는 일반 미션 상태에서만 보여준다.
성공 상태에서 숨긴 뒤 다시 열면 같은 성공 상태를 보여준다.
```

### 5. UI/UX 설계

TutorialMissionBar의 success variant를 제안해 주세요.

검토할 것:

* 기존 Mission Bar 크기를 크게 늘리지 않는 방법
* 완료 아이콘 또는 체크 표시
* 성공 제목
* commentOnSuccess 표시
* “다음 미션” 버튼
* 진행률 표시 유지 여부
* 좁은 화면에서 comment를 어떻게 줄일지
* StylePanel popover / Canvas overlay / DnD와 충돌하지 않는지
* `aria-live`를 사용해 성공 상태를 알려줄지

성공 애니메이션은 과도할 필요 없습니다.

우선 후보:

* border color 변경
* check icon 표시
* 짧은 fade/scale transition
* DaisyUI alert-like styling
* `transition-all` 정도의 가벼운 효과

다음은 v1.2에서 제외합니다.

* confetti
* 복잡한 animation library
* sound effect
* modal success screen
* full-screen celebration
* motion preference 처리 고도화

### 6. commentOnSuccess 문구 초안

기존 미션 목록을 확인하고, 각 미션에 넣을 수 있는 `commentOnSuccess` 초안을 제안해 주세요.

예시:

```text
첫 블록 추가하기:
잘 했어요! 블록을 추가할 때 사용한 이 동작을 “드래그”라고 합니다.

일반 구역 만들기:
좋습니다. 구역은 HTML에서 div처럼 여러 요소를 묶는 역할을 합니다.

구역 안에 제목 넣기:
잘 했어요. 제목이 구역 안에 들어가면 HTML에서도 부모-자식 구조가 만들어집니다.

이미지 추가하기:
이미지는 웹페이지에서 img 태그로 표현됩니다.

제목 문구 바꾸기:
좋습니다. 화면의 글자는 HTML 요소의 content로 저장됩니다.

배경색 바꾸기:
잘 했어요. 배경색은 CSS 스타일로 표현됩니다.

코드 보기 확인:
좋습니다. 지금 만든 블록 구조가 실제 HTML 코드로 변환된 모습을 확인했습니다.
```

문구는 초보자가 이해하기 쉬운 한국어로 작성해 주세요.
너무 길지 않게, 한두 문장 정도로 제한해 주세요.

## 보고서 형식

다음 구조로 작성해 주세요.

### 1. 요약 결론

* v1.2 구현 가능 여부
* 권장 success feedback 구조
* `commentOnSuccess` 타입 설계
* 주요 위험
* v1.2에서 제외해야 할 것

### 2. 현재 Tutorial 흐름 분석

* 관련 파일
* active mission 계산
* completed ledger 업데이트
* skip/hide/reopen
* 동시 완료 처리
* property-aware mission 처리

### 3. Success feedback state 설계

* 필요한 state
* completed ledger와의 관계
* active mission 계산과의 관계
* 여러 미션 동시 완료 처리
* hide/reopen/skip과의 관계

### 4. TutorialMission 타입 확장안

* `commentOnSuccess?: string` 추가 가능성
* 객체형 대안 비교
* mission data 선언성 유지 여부
* 문구 작성 기준

### 5. UI 설계안

* 일반 mission 상태
* success feedback 상태
* 모두 완료 상태
* hidden/reopen 상태
* 좁은 화면 fallback
* 접근성 고려
* 애니메이션/시각 효과 범위

### 6. commentOnSuccess 문구 초안

표 형식으로 작성해 주세요.

| Mission | commentOnSuccess |
| ------- | ---------------- |

### 7. 수정 파일 계획

예상 수정 파일과 신규 파일이 있다면 정리해 주세요.

### 8. Phase별 구현 제안

작고 reviewable하게 나눠 주세요.

예시:

```text
TUT-1.2-A: TutorialMission 타입과 mission data에 commentOnSuccess 추가
TUT-1.2-B: success feedback state와 active mission 계산 조정
TUT-1.2-C: TutorialMissionBar success variant UI 추가
TUT-1.2-D: skip/hide/reopen 및 동시 완료 회귀 검증
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

* 미션 완료 시 즉시 다음 미션으로 넘어가지 않는지
* 성공 상태가 표시되는지
* commentOnSuccess가 표시되는지
* commentOnSuccess가 없는 미션의 기본 문구 처리
* “다음 미션” 버튼으로 다음 미션 이동
* 성공 상태에서 숨기기 / 다시 열기
* 성공 상태에서 건너뛰기 버튼이 표시되지 않는지
* 일반 미션 상태에서 건너뛰기 정상 작동
* 여러 미션 동시 완료 시 현재 active mission 중심으로 feedback 표시
* 템플릿 삽입 시 ledger가 흔들리지 않는지
* property-aware mission 완료 시 success feedback 표시
* 모든 미션 완료 상태와 success feedback 충돌 없음
* DnD 회귀 없음
* StylePanel 편집 회귀 없음
* Preview / Code View / Export 회귀 없음

## 명시적 제외 범위

이번 v1.2에서는 다음을 제외합니다.

* success feedback queue
* 자동 timeout 진행
* confetti
* sound effect
* full-screen modal
* animation library
* guided-tour library
* localStorage
* 계정 저장
* block mutation
* DnD 변경
* StylePanel input handler 변경
* HtmlBlock 모델 변경
* blockDefinitions 구조 변경
* Preview / Code View / Export 변경
* unrelated repository 변경

## 중요

이번 요청에서는 코드를 수정하지 마세요.
조사와 Tutorial Overlay v1.2 success feedback 구현 계획만 작성해 주세요.

응답은 한국어로 작성해 주세요.
