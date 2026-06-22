TODO: Tutorial Mission Bar에 수동 완료 버튼을 추가한다.

## 배경

현재 Tutorial Mission은 조건을 만족하는 순간 자동으로 완료 처리된다.

현재 흐름:

```text
미션 조건 충족
→ completed ledger에 즉시 기록
→ success feedback 표시
→ 다음 미션으로 진행
```

이 방식은 다음과 같은 미션에는 적절하다.

```text
- 블록 추가하기
- Preview 열기
- Code View 열기
- LIST 만들기
- GRID 추가하기
```

하지만 content/property 수정 미션에는 다소 부적절할 수 있다.

예:

```text
- 제목을 나만의 문장으로 바꿔 보세요
- 본문을 충분히 작성해 보세요
- 이미지 주소를 바꿔 보세요
- FAQ 답변을 수정해 보세요
- 비밀 메시지를 수정해 보세요
```

이런 미션은 조건상 `content !== baseline`이 되는 순간 완료되지만, 사용자는 아직 충분히 내용을 다듬지 않았을 수 있다.

따라서 미션별로 다음 두 방식을 구분할 필요가 있다.

```text
1. 즉시 완료형 미션
   - 조건을 만족하면 기존처럼 자동 완료

2. 수동 완료형 미션
   - 조건을 만족해도 바로 완료하지 않음
   - Tutorial Bar에 “완료” 버튼 표시
   - 사용자가 “완료” 버튼을 눌렀을 때 조건을 다시 검사
   - 조건이 여전히 만족되면 완료 처리
   - 조건이 만족되지 않으면 안내 메시지 표시
```

## 목표

`TutorialMission` 타입에 `instantSuccess` 필드를 추가한다.

예상 타입:

```ts
type TutorialMission = {
  id: string;
  title: string;
  description: string;
  condition: TutorialCondition;
  commentOnSuccess?: string;
  instantSuccess?: boolean;
};
```

정책:

```text
instantSuccess가 true이면:
- 기존 방식 유지
- 조건이 만족되는 즉시 완료 처리

instantSuccess가 false이면:
- 조건이 만족되어도 즉시 완료하지 않음
- Tutorial Mission Bar에 “완료” 버튼 표시
- 사용자가 “완료” 버튼을 눌렀을 때 완료 검사를 수행
- 조건이 만족되면 완료 처리
- 조건이 만족되지 않으면 아직 완료 조건을 만족하지 않았다는 안내를 표시
```

기본값 정책은 신중하게 정한다.

권장:

```text
instantSuccess 기본값은 true로 처리한다.
```

이유:

* 기존 미션 데이터의 동작을 보존할 수 있음
* 모든 기존 mission data에 필드를 한 번에 추가하지 않아도 회귀 위험이 낮음
* 필요한 content/property 미션에만 `instantSuccess: false`를 명시하면 됨

## 적용 대상

### instantSuccess: true 권장

조건을 만족하는 순간 완료해도 자연스러운 미션:

```text
- 블록 추가 미션
- 구조 생성 미션
- Preview 탭 확인
- Code View 탭 확인
- LIST/LIST_ITEM 구조 생성
- GRID 추가
- TOGGLE 추가
- PASSWORD_ZONE 추가
- HR 추가
```

예:

```ts
{
  id: "add-container",
  title: "소개 구역을 만들어 보세요",
  condition: { type: "hasAddedBlock", blockType: "CONTAINER" },
  instantSuccess: true,
}
```

`instantSuccess` 기본값이 true라면 생략 가능하다.

### instantSuccess: false 권장

사용자가 내용을 충분히 다듬은 뒤 완료할 수 있어야 하는 미션:

```text
- 제목 content 수정
- 본문 content 수정
- 이미지 src 수정
- 링크 주소 입력
- 카드 내용 수정
- FAQ 답변 수정
- Password Zone correctAnswer 수정
- Password Zone conditionalChildren 내용 수정
- 배경색 변경
- padding/margin/shadow 등 스타일 조정
```

예:

```ts
{
  id: "edit-intro-title",
  title: "제목을 나만의 문장으로 바꿔 보세요",
  description: "제목을 “안녕하세요, 저는 ○○입니다”처럼 나를 소개하는 문장으로 바꿔 보세요.",
  condition: {
    type: "hasContentChanged",
    blockType: "HEADING",
  },
  commentOnSuccess: "좋습니다. 화면에 보이는 글자는 HTML 요소의 내용으로 저장됩니다.",
  instantSuccess: false,
}
```

## UI 요구사항

`instantSuccess: false`인 미션에서는 TutorialMissionBar에 “완료” 버튼을 표시한다.

버튼 문구 후보:

```text
완료
```

또는 조금 더 명확하게:

```text
완료 확인
```

권장 문구:

```text
완료
```

UI 동작:

```text
조건이 아직 만족되지 않은 상태:
- “완료” 버튼은 표시된다.
- 사용자가 누르면 조건을 검사한다.
- 조건이 false이면 짧은 안내 메시지를 보여준다.

조건이 만족된 상태:
- “완료” 버튼을 누르면 완료 처리된다.
- success feedback으로 이동한다.
```

버튼을 조건 만족 전에는 disabled 처리할 수도 있지만, v1에서는 비추천한다.

이유:

* 사용자가 왜 버튼이 비활성화되어 있는지 모를 수 있음
* 클릭 후 “아직 제목을 바꾸지 않았어요” 같은 안내가 학습적으로 더 좋음

권장:

```text
완료 버튼은 항상 활성화한다.
조건 미충족 시 안내 메시지를 표시한다.
```

조건 미충족 안내 예시:

```text
아직 미션 조건이 완료되지 않았어요. 안내를 따라 한 번 더 확인해 주세요.
```

가능하면 mission별 custom failure message는 v1에서는 도입하지 않는다.
필요하면 나중에 `commentOnIncomplete` 같은 필드로 확장한다.

## 상태/로직 설계

현재 evaluator는 조건을 만족한 모든 mission id를 찾아 completed ledger에 합치는 구조일 가능성이 있다.

이때 `instantSuccess: false` 미션은 자동 완료 대상에서 제외해야 한다.

권장 흐름:

### 자동 평가 시

```text
evaluateTutorialMissions(...)
→ satisfiedMissionIds 계산
→ 각 mission 확인
   - instantSuccess !== false 이면 자동 완료 후보
   - instantSuccess === false 이면 자동 완료하지 않음
→ 자동 완료 후보만 completed ledger에 합침
```

즉:

```ts
const autoCompletableMissionIds = satisfiedMissionIds.filter((id) => {
  const mission = getMissionById(id);
  return mission.instantSuccess !== false;
});
```

### 수동 완료 버튼 클릭 시

```text
사용자가 activeMission의 “완료” 버튼 클릭
→ activeMission condition을 현재 blocks/uiSignals 기준으로 다시 평가
→ true이면 completed ledger에 activeMission.id 추가
→ success feedback 표시
→ false이면 incomplete message 표시
```

주의:

* 버튼 클릭 시 과거에 계산된 satisfied state만 믿지 말고 현재 상태로 다시 검사하는 편이 안전함
* 완료 처리 후 success feedback 기존 구조를 그대로 사용
* completed ledger latch 정책 유지
* skip/hide/reopen 기존 동작 유지

## active mission 처리

수동 완료형 미션이 active인 경우:

```text
조건이 이미 만족되어도 active mission은 계속 표시된다.
사용자가 “완료” 버튼을 눌러야 success feedback으로 넘어간다.
```

이는 의도된 동작이다.

예:

```text
사용자가 제목을 조금 수정함
→ condition은 true
→ 하지만 바로 다음 미션으로 넘어가지 않음
→ 사용자가 제목을 더 다듬음
→ 완료 버튼 클릭
→ 완료 처리
```

## 여러 미션 동시 완료 처리

현재 구조에서 템플릿 삽입이나 여러 property 변경으로 여러 미션이 동시에 완료될 수 있다.

정책:

```text
- instantSuccess true 미션은 기존처럼 자동 완료 가능
- instantSuccess false 미션은 자동 완료하지 않음
- 현재 active mission이 instantSuccess false이면 완료 버튼을 눌러야 완료
- 후속 수동 미션이 이미 조건을 만족하고 있어도, 해당 미션이 active가 된 뒤 완료 버튼을 눌러야 완료
```

이 정책은 튜토리얼이 너무 빨리 지나가는 것을 막는다.

## success feedback과의 관계

수동 완료 버튼으로 완료된 미션도 기존 success feedback 흐름을 그대로 사용한다.

```text
완료 버튼 클릭
→ condition true
→ completed ledger에 mission id 추가
→ success feedback 표시
→ commentOnSuccess 표시
→ “다음 미션” 클릭
→ 다음 미션 표시
```

조건 미충족 시에는 success feedback으로 가지 않는다.

## skip/hide/reopen과의 관계

### skip

* 일반 미션 상태에서 기존처럼 동작한다.
* instantSuccess false 미션에서도 skip 가능하다.
* skip은 조건 검사 없이 현재 미션을 skipped ledger에 추가한다.

### hide

* hide는 기존처럼 Mission Bar를 숨긴다.
* hidden 상태에서도 progress/evaluator는 유지된다.
* 수동 완료형 미션은 hidden 상태에서 자동 완료되지 않아야 한다.

### reopen

* reopen 시 active mission이 그대로 표시된다.
* 수동 완료형 미션이 이미 조건을 만족한 상태여도 “완료” 버튼을 눌러야 완료된다.

## mission data 조정

기존 튜토리얼 트랙의 미션 중 content/property/style 수정 미션에는 `instantSuccess: false`를 추가한다.

대상 후보:

### 소개 페이지 트랙

```text
- 제목 문구 바꾸기
- 본문 내용 수정
- 이미지 주소 바꾸기
- 안쪽 여백 조절
- 카드 안 제목/내용 수정
- 목록 항목 수정이 별도 condition으로 있다면 해당 미션
- 배경색 바꾸기
- 그림자 추가
- 링크 주소 입력
```

### 홍보 페이지 트랙

```text
- 제목을 홍보 문구로 수정하기
- 소개 문장 수정하기
- 이미지 주소 바꾸기
- 링크 주소 입력하기
- 카드 내용을 수정하기
- 카드 스타일 바꾸기
- Toggle/FAQ 답변 수정하기
```

### 초대장 페이지 트랙

```text
- 제목을 초대 문구로 수정하기
- 초대 문장 수정하기
- 이미지 주소 바꾸기
- 초대장 배경색 바꾸기
- 초대장 안쪽 여백 조절하기
- Toggle 안내 문구 수정하기
- 비밀번호 정답 정하기
- 비밀 메시지 수정하기
- 링크 주소 입력하기
```

구조 추가형 미션은 기본값 true를 사용하거나 `instantSuccess`를 생략한다.

## 파일 변경 후보

실제 repo 구조를 확인한 뒤 조정하되, 대략 다음 파일이 관련될 가능성이 있다.

```text
src/features/block-studio/tutorial/types/tutorial.types.ts
src/features/block-studio/tutorial/data/tutorialTracks.ts
src/features/block-studio/tutorial/data/tutorialMissions.ts
src/features/block-studio/tutorial/evaluator/evaluateTutorialMissions.ts
src/features/block-studio/tutorial/hooks/useTutorialProgress.ts
src/features/block-studio/tutorial/components/TutorialMissionBar.tsx
src/features/block-studio/tutorial/components/TutorialOverlay.tsx
```

로직 변경은 tutorial feature 내부로 제한한다.

가능하면 다음 파일은 변경하지 않는다.

```text
HtmlBlock model
blockDefinitions
DnD 관련 파일
StylePanel input handler
Preview renderer
Code View
Export compiler
Learning Templates
Canvas renderer
```

단, mission data 파일은 당연히 수정 가능하다.

## 구현 단계 제안

### TUT-MANUAL-1: 타입 확장

* `TutorialMission`에 `instantSuccess?: boolean` 추가
* 기본값 정책 문서화
* 기존 mission data가 필드 없이도 기존처럼 동작하도록 보장

### TUT-MANUAL-2: 자동 완료 필터링

* evaluator 또는 progress hook에서 자동 완료 대상 mission을 필터링
* `instantSuccess === false` 미션은 조건을 만족해도 자동 completed ledger에 넣지 않음
* 기존 instant 미션은 회귀 없이 동작

### TUT-MANUAL-3: 수동 완료 action 추가

* `useTutorialProgress`에 `completeActiveMissionManually` 또는 유사 action 추가
* active mission condition을 현재 상태 기준으로 재검사
* true이면 completed ledger + success feedback
* false이면 incomplete message state 설정

### TUT-MANUAL-4: Mission Bar UI 추가

* active mission이 `instantSuccess === false`이면 “완료” 버튼 표시
* 일반 instant mission에서는 기존 UI 유지
* incomplete message 표시
* success feedback UI는 기존 흐름 재사용

### TUT-MANUAL-5: mission data 조정

* content/property/style 수정 미션에 `instantSuccess: false` 추가
* 구조 추가형 미션은 생략 또는 true 유지
* 소개/홍보/초대장 트랙 모두 검토

### TUT-MANUAL-6: 회귀 검증

* 자동 완료형 미션 정상
* 수동 완료형 미션은 조건 만족 후에도 바로 넘어가지 않음
* 완료 버튼으로만 완료됨
* 조건 미충족 시 안내 표시
* success feedback 정상
* skip/hide/reopen 정상

## 수동 검증 체크리스트

### 자동 완료형

* 일반 구역 추가 시 기존처럼 즉시 성공 feedback 표시
* 이미지 추가 시 즉시 성공 feedback 표시
* LIST 추가 시 즉시 성공 feedback 표시
* Preview / Code View tab 확인 미션 즉시 성공 feedback 표시

### 수동 완료형

* 제목 수정 미션 진입
* 제목을 아직 수정하지 않은 상태에서 완료 버튼 클릭

  * incomplete message 표시
  * completed ledger에 추가되지 않음
* 제목을 조금 수정

  * 즉시 다음 미션으로 넘어가지 않음
  * active mission 유지
* 완료 버튼 클릭

  * success feedback 표시
  * commentOnSuccess 표시
* “다음 미션” 클릭

  * 다음 미션 표시

### property/style 미션

* 이미지 src 수정 후 자동 완료되지 않음
* 링크 주소 입력 후 자동 완료되지 않음
* 배경색 변경 후 자동 완료되지 않음
* padding 변경 후 자동 완료되지 않음
* 완료 버튼 클릭 후에만 완료됨

### skip/hide/reopen

* 수동 완료형 미션에서 skip 가능
* 수동 완료형 미션에서 hide 가능
* reopen 시 같은 미션 표시
* 이미 조건을 만족했더라도 reopen 후 자동 완료되지 않음
* 완료 버튼 클릭 시 완료됨

### 동시 완료

* 어떤 행동으로 여러 조건이 동시에 만족되어도, 수동 완료형 미션은 자동 완료되지 않음
* instantSuccess true 미션만 자동 완료됨
* active 수동 미션은 버튼 클릭 필요

### 회귀

* DnD 정상
* StylePanel content/style 수정 정상
* Preview 정상
* Code View 정상
* Export 정상
* Templates 일반 모드 정상
* Tutorial mode에서 Templates 비활성화 유지

## 자동 검증

가능하면 다음 명령을 실행한다.

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run lint
git diff --check
```

필요 시 changed-file lint를 실행한다.

## 구현 후 보고 형식

구현 후 다음을 보고한다.

```text
변경 요약:
- 수정 파일:
- 신규 파일:
- TutorialMission 타입 변경:
- instantSuccess 기본값 정책:
- 자동 완료 필터링 방식:
- 수동 완료 action:
- incomplete message 처리:
- mission data 조정 내용:
- 실행한 검증:
- 수동 테스트 결과:
- 남은 위험:
```

## 명시적 제외 범위

이번 TODO에서는 다음을 제외한다.

```text
- mission별 custom incomplete message
- 자동 timeout
- success feedback queue
- localStorage
- 계정 저장
- 튜토리얼 저장/복원
- 튜토리얼 전용 block mutation
- StylePanel handler 변경
- DnD 변경
- HtmlBlock 모델 변경
- blockDefinitions 변경
- Preview / Code View / Export 변경
- Learning Templates 구조 변경
- unrelated repository 변경
```
