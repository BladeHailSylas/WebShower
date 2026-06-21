소개 페이지 튜토리얼 트랙의 실제 미션 데이터를 작성해 주세요.

이번 작업은 기존 Tutorial Track / TutorialMission 구조에 맞춰 **데이터를 채우는 작업**입니다.
가능하면 로직 변경 없이 mission data 중심으로 작업해 주세요.

## 목표

첫 번째 튜토리얼 트랙은 다음 주제입니다.

```text
나를 소개하는 첫 웹페이지
```

설명:

```text
제목, 본문, 이미지, 카드, 목록, 링크와 기본 스타일을 사용해 간단한 자기소개 페이지를 만들어 봅니다.
```

이 튜토리얼은 사용자가 따라 하면 간단한 자기소개 페이지 하나가 완성되는 흐름이어야 합니다.

## 사용 블록

이 트랙에서 주로 사용할 블록:

* CONTAINER
* HEADING / H1
* PARAGRAPH / P
* IMAGE
* CARD
* LIST
* LIST_ITEM
* LINK / A

첫 소개 페이지 튜토리얼에서는 다음 고급 블록은 사용하지 않습니다.

* GRID_ZONE
* SLIDER_ZONE
* PASSWORD_ZONE
* TOGGLE_ZONE

## 미션 흐름

아래 흐름을 현재 repo의 `TutorialMission` 타입과 condition 구조에 맞게 mission data로 작성해 주세요.

### 1. 일반 구역 추가

제목:

```text
소개 구역을 만들어 보세요
```

안내:

```text
왼쪽 블록 목록에서 일반 구역을 추가해 보세요.
```

완료 조건:

```text
튜토리얼 시작 baseline 이후 새 CONTAINER가 존재
```

성공 코멘트:

```text
좋습니다. 구역은 HTML에서 div처럼 여러 요소를 묶는 역할을 합니다.
```

### 2. 구역 안에 제목 넣기

제목:

```text
구역 안에 제목을 넣어 보세요
```

안내:

```text
방금 만든 일반 구역 안에 제목 블록을 넣어 보세요.
```

완료 조건:

```text
새 CONTAINER의 direct child로 HEADING/H1이 존재
```

성공 코멘트:

```text
잘 했어요. 제목이 구역 안에 들어가면 HTML에서도 부모-자식 구조가 만들어집니다.
```

### 3. 제목 문구 바꾸기

제목:

```text
제목을 나만의 문장으로 바꿔 보세요
```

안내:

```text
제목을 “안녕하세요, 저는 ○○입니다”처럼 나를 소개하는 문장으로 바꿔 보세요.
```

완료 조건:

```text
HEADING/H1의 content가 baseline 또는 기본값과 달라짐
```

성공 코멘트:

```text
좋습니다. 화면에 보이는 글자는 HTML 요소의 내용으로 저장됩니다.
```

### 4. 본문 추가

제목:

```text
소개 문장을 넣어 보세요
```

안내:

```text
소개 구역 안에 본문 블록을 추가해 보세요.
```

완료 조건:

```text
새 CONTAINER의 direct child 또는 descendant로 PARAGRAPH/P가 존재
```

성공 코멘트:

```text
본문은 HTML에서 p 태그로 표현됩니다. 긴 설명이나 소개 문장을 담을 때 사용합니다.
```

### 5. 본문 내용 수정

제목:

```text
나를 소개하는 글을 써 보세요
```

안내:

```text
본문 내용을 내가 좋아하는 것, 배우고 싶은 것, 나를 표현하는 문장으로 바꿔 보세요.
```

완료 조건:

```text
PARAGRAPH/P의 content가 baseline 또는 기본값과 달라짐
```

성공 코멘트:

```text
좋습니다. 제목과 본문을 함께 쓰면 페이지의 핵심 메시지가 더 분명해집니다.
```

### 6. 이미지 추가

제목:

```text
이미지를 추가해 보세요
```

안내:

```text
소개 구역에 이미지 블록을 추가해 보세요.
```

완료 조건:

```text
baseline 이후 새 IMAGE가 존재
```

성공 코멘트:

```text
이미지는 HTML에서 img 태그로 표현됩니다.
```

### 7. 이미지 주소 바꾸기

제목:

```text
이미지 주소를 바꿔 보세요
```

안내:

```text
이미지 블록의 주소를 다른 이미지 URL로 바꿔 보세요.
```

완료 조건:

```text
IMAGE의 src가 baseline 또는 기본값과 달라짐
```

성공 코멘트:

```text
img 태그는 src 속성에 적힌 주소에서 이미지를 불러옵니다.
```

### 8. 안쪽 여백 조절

제목:

```text
소개 구역에 안쪽 여백을 주세요
```

안내:

```text
소개 구역의 안쪽 여백을 조절해 내용이 조금 더 편하게 보이도록 만들어 보세요.
```

완료 조건:

```text
CONTAINER의 styles.paddingSize가 meaningful value로 변경됨
```

성공 코멘트:

```text
안쪽 여백은 CSS의 padding입니다. 내용과 테두리 사이에 숨 쉴 공간을 만들어 줍니다.
```

### 9. 카드 추가

제목:

```text
관심사 카드를 만들어 보세요
```

안내:

```text
카드 구역을 추가해 내가 좋아하는 것들을 정리할 공간을 만들어 보세요.
```

완료 조건:

```text
baseline 이후 새 CARD가 존재
```

성공 코멘트:

```text
카드는 관련 있는 내용을 하나의 덩어리로 묶어 보여줄 때 유용합니다.
```

### 10. 카드 안에 제목 넣기

제목:

```text
카드에 제목을 넣어 보세요
```

안내:

```text
카드 안에 “제가 좋아하는 것” 같은 제목을 넣어 보세요.
```

완료 조건:

```text
CARD의 direct child 또는 descendant로 HEADING/H1이 존재
```

성공 코멘트:

```text
카드 안에도 제목, 본문, 목록 같은 여러 블록을 넣을 수 있습니다.
```

### 11. 목록 추가

제목:

```text
관심사 목록을 만들어 보세요
```

안내:

```text
카드 안에 목록을 추가해 좋아하는 것들을 정리해 보세요.
```

완료 조건:

```text
CARD의 descendant로 LIST가 존재하고, LIST가 direct LIST_ITEM을 1개 이상 가짐
```

성공 코멘트:

```text
목록은 HTML에서 ul과 li 구조로 표현됩니다. 반복되는 내용을 정리할 때 자주 사용합니다.
```

### 12. 배경색 바꾸기

제목:

```text
소개 구역의 배경색을 바꿔 보세요
```

안내:

```text
소개 구역이나 카드의 배경색을 바꿔 페이지 분위기를 만들어 보세요.
```

완료 조건:

```text
CONTAINER 또는 CARD의 styles.bgColor가 meaningful value로 변경됨
```

성공 코멘트:

```text
배경색은 CSS 스타일로 표현됩니다. 같은 구조라도 색을 바꾸면 분위기가 달라집니다.
```

### 13. 그림자 추가

제목:

```text
카드에 그림자를 넣어 보세요
```

안내:

```text
카드에 그림자를 넣어 화면에서 살짝 떠 있는 느낌을 만들어 보세요.
```

완료 조건:

```text
CARD의 styles.shadow가 meaningful value로 변경됨
```

성공 코멘트:

```text
그림자는 CSS shadow 스타일입니다. 카드처럼 독립된 영역을 강조할 때 자주 사용합니다.
```

### 14. 링크 추가

제목:

```text
링크를 추가해 보세요
```

안내:

```text
더 알아볼 수 있는 사이트나 내가 좋아하는 페이지로 가는 링크를 추가해 보세요.
```

완료 조건:

```text
baseline 이후 새 LINK/A가 존재
```

성공 코멘트:

```text
링크는 HTML에서 a 태그로 표현됩니다.
```

### 15. 링크 주소 입력

제목:

```text
링크 주소를 입력해 보세요
```

안내:

```text
링크가 이동할 주소를 입력해 보세요.
```

완료 조건:

```text
LINK/A의 link 또는 href 값이 비어 있지 않고 meaningful value임
```

성공 코멘트:

```text
a 태그는 href 속성에 적힌 주소로 이동합니다.
```

### 16. 미리보기 확인

제목:

```text
미리보기에서 확인해 보세요
```

안내:

```text
오른쪽 미리보기 탭을 눌러 지금 만든 페이지가 어떻게 보이는지 확인해 보세요.
```

완료 조건:

```text
previewOpened UI signal
```

성공 코멘트:

```text
좋습니다. 미리보기는 블록으로 만든 페이지가 실제 화면에서 어떻게 보일지 보여줍니다.
```

### 17. 코드 보기 확인

제목:

```text
코드 보기에서 HTML을 확인해 보세요
```

안내:

```text
코드 보기 탭을 눌러 방금 만든 블록 구조가 HTML로 어떻게 바뀌는지 확인해 보세요.
```

완료 조건:

```text
codeViewOpened UI signal
```

성공 코멘트:

```text
잘 했어요. 지금 만든 블록 구조가 실제 HTML 코드로 변환된 모습을 확인했습니다.
```

## 구현 지침

* 현재 `TutorialTrack` / `TutorialMission` 타입에 맞춰 작성해 주세요.
* 새 condition 타입이 필요하면 먼저 최소 범위로 제안하고 적용해 주세요.
* 가능하면 기존 property-aware condition을 재사용해 주세요.
* mission data에 JSX, React component, mutation function을 넣지 마세요.
* 튜토리얼은 block tree를 수정하지 않아야 합니다.
* 튜토리얼 모드에서 Templates 탭 비활성화 정책은 유지합니다.
* Preview / Code View / Export 경로는 변경하지 마세요.
* DnD, StylePanel input handler, HtmlBlock 모델, blockDefinitions 구조는 변경하지 마세요.

## 검증

가능하면 다음을 실행해 주세요.

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run lint
git diff --check
```

수동 검증에는 최소한 다음을 포함해 주세요.

* 소개 페이지 튜토리얼 트랙이 표시됨
* 트랙 시작 후 starter document의 기존 블록으로 미션이 즉시 완료되지 않음
* 각 미션이 의도한 행동으로 완료됨
* content 변경 미션 정상 작동
* src/link 변경 미션 정상 작동
* padding/bgColor/shadow style 미션 정상 작동
* success feedback comment 표시
* 다음 미션 진행 정상
* skip/hide/reopen 정상
* Preview / Code View 미션 정상
* 일반 모드에서 기존 Templates 기능 정상
* 튜토리얼 모드에서 Templates 비활성화 유지
* DnD / StylePanel / Preview / Code View / Export 회귀 없음

응답은 한국어로 작성해 주세요.
