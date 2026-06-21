홍보 페이지 튜토리얼 트랙의 실제 미션 데이터를 작성해 주세요.

이번 작업은 기존 Tutorial Track / TutorialMission 구조에 맞춰 **데이터를 채우는 작업**입니다.
가능하면 로직 변경 없이 mission data 중심으로 작업해 주세요.

## 목표

두 번째 튜토리얼 트랙은 다음 주제입니다.

```text
홍보 페이지 만들기
```

설명:

```text
동아리, 행사, 프로젝트처럼 사람들에게 알리고 싶은 내용을 홍보 페이지로 만들어 봅니다.
```

이 튜토리얼은 사용자가 따라 하면 간단한 홍보 페이지 하나가 완성되는 흐름이어야 합니다.

## 교육 방향

이 트랙은 첫 번째 “소개 페이지” 튜토리얼보다 한 단계 발전된 내용입니다.

첫 번째 튜토리얼이 다음을 다뤘다면:

```text
Box, H1, P, Img, Card, UL, A, 기본 스타일, Preview, Code View
```

두 번째 튜토리얼에서는 다음을 추가로 자연스럽게 경험하게 합니다.

```text
Grid를 사용해 정보를 나란히 배치하기
Card를 반복적으로 사용해 장점을 정리하기
Toggle을 사용해 FAQ 만들기
홍보 제목, 소개 문장, 대표 이미지, 참여 링크를 조합하기
```

## 용어 정책

“Hero 구역”이라는 전문 용어는 초보자에게 낯설 수 있습니다.

따라서 미션 문구에서는 “Hero 구역” 대신 다음 표현을 사용해 주세요.

```text
첫인상 구역
```

성공 코멘트에서만 다음처럼 자연스럽게 설명해 주세요.

```text
웹페이지 맨 위에서 제목, 설명, 이미지, 버튼으로 첫인상을 만드는 영역을 Hero 구역이라고 부르기도 합니다.
```

## 사용 블록

이 트랙에서 주로 사용할 블록:

* Box / CONTAINER
* Grid / GRID_ZONE
* Card / CARD
* UL / LIST
* LIST_ITEM
* H1 / HEADING
* P / PARAGRAPH
* Img / IMAGE
* A / LINK
* Toggle / TOGGLE_ZONE

이 트랙에서는 다음 블록은 사용하지 않습니다.

* PASSWORD_ZONE / Pw
* SLIDER_ZONE / Slide

SLIDER_ZONE은 홍보 페이지에도 어울릴 수 있지만, 이번 트랙에서는 Grid와 FAQ에 집중하기 위해 제외합니다.

## 전체 결과물 구조

사용자가 완성하게 될 홍보 페이지의 구조는 대략 다음과 같습니다.

```text
[첫인상 구역]
  H1: 우리 동아리를 소개합니다
  P: 함께 배우고 만드는 즐거운 공간입니다
  Img: 대표 이미지
  A: 가입 신청하기 / 더 알아보기

[장점 구역]
  H1 또는 P: 이런 점이 좋아요
  Grid
    Card 1: 함께 배워요
    Card 2: 직접 만들어요
    Card 3: 결과를 공유해요

[활동 안내 구역]
  H1 또는 P: 활동 안내
  UL
    모임 시간
    장소
    준비물

[FAQ 구역]
  Toggle 1: 처음이어도 괜찮나요?
  Toggle 2: 준비물이 필요한가요?

[마무리]
  Preview 확인
  Code View 확인
```

## 미션 흐름

아래 흐름을 현재 repo의 `TutorialMission` 타입과 condition 구조에 맞게 mission data로 작성해 주세요.

현재 타입/condition 명칭이 다르면 repo에 맞게 조정해 주세요.
새 condition 타입이 꼭 필요하면 최소 범위로 제안하고 적용해 주세요.

---

### 1. 첫인상 구역 만들기

제목:

```text
첫인상 구역을 만들어 보세요
```

안내:

```text
홍보 페이지의 맨 위에는 방문자가 가장 먼저 보게 될 구역이 필요합니다. 일반 구역을 추가해 보세요.
```

완료 조건:

```text
튜토리얼 시작 baseline 이후 새 CONTAINER/Box가 존재
```

성공 코멘트:

```text
좋습니다. 웹페이지 맨 위에서 제목, 설명, 이미지, 버튼으로 첫인상을 만드는 영역을 Hero 구역이라고 부르기도 합니다.
```

---

### 2. 홍보 제목 넣기

제목:

```text
홍보 제목을 넣어 보세요
```

안내:

```text
첫인상 구역 안에 제목 블록을 넣어, 무엇을 홍보하는 페이지인지 알려주세요.
```

완료 조건:

```text
새 CONTAINER의 direct child 또는 descendant로 HEADING/H1이 존재
```

성공 코멘트:

```text
제목은 방문자가 페이지의 주제를 가장 먼저 이해하도록 도와줍니다.
```

---

### 3. 제목을 홍보 문구로 수정하기

제목:

```text
제목을 홍보 문구로 바꿔 보세요
```

안내:

```text
예를 들어 “우리 동아리를 소개합니다” 또는 “함께 만드는 웹 제작 모임”처럼 바꿔 보세요.
```

완료 조건:

```text
HEADING/H1의 content가 baseline 또는 기본값과 달라짐
```

성공 코멘트:

```text
좋습니다. 짧고 분명한 제목은 홍보 페이지의 첫인상을 결정합니다.
```

---

### 4. 소개 문장 추가하기

제목:

```text
짧은 소개 문장을 추가해 보세요
```

안내:

```text
첫인상 구역 안에 본문 블록을 추가해, 이 페이지가 무엇을 소개하는지 한두 문장으로 설명해 보세요.
```

완료 조건:

```text
새 CONTAINER의 direct child 또는 descendant로 PARAGRAPH/P가 존재
```

성공 코멘트:

```text
본문은 제목을 조금 더 자세히 설명하는 역할을 합니다.
```

---

### 5. 소개 문장 수정하기

제목:

```text
소개 문장을 직접 써 보세요
```

안내:

```text
동아리, 행사, 프로젝트의 매력을 짧게 소개하는 문장으로 바꿔 보세요.
```

완료 조건:

```text
PARAGRAPH/P의 content가 baseline 또는 기본값과 달라짐
```

성공 코멘트:

```text
좋습니다. 홍보 문장은 방문자가 계속 읽어 볼지 결정하는 중요한 단서가 됩니다.
```

---

### 6. 대표 이미지 추가하기

제목:

```text
대표 이미지를 추가해 보세요
```

안내:

```text
첫인상 구역에 이미지 블록을 추가해 페이지의 분위기를 보여주세요.
```

완료 조건:

```text
baseline 이후 새 IMAGE/Img가 존재
```

성공 코멘트:

```text
이미지는 글보다 빠르게 분위기와 주제를 전달할 수 있습니다.
```

---

### 7. 이미지 주소 바꾸기

제목:

```text
이미지 주소를 바꿔 보세요
```

안내:

```text
이미지 블록의 주소를 홍보 내용과 어울리는 이미지 URL로 바꿔 보세요.
```

완료 조건:

```text
IMAGE/Img의 src가 baseline 또는 기본값과 달라짐
```

성공 코멘트:

```text
img 태그는 src 속성에 적힌 주소에서 이미지를 불러옵니다.
```

---

### 8. 참여 링크 추가하기

제목:

```text
참여 링크를 추가해 보세요
```

안내:

```text
방문자가 더 알아보거나 신청할 수 있도록 링크 블록을 추가해 보세요.
```

완료 조건:

```text
baseline 이후 새 LINK/A가 존재
```

성공 코멘트:

```text
홍보 페이지에는 보통 신청하기, 더 알아보기 같은 다음 행동으로 이어지는 링크가 필요합니다.
```

---

### 9. 링크 주소 입력하기

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

---

### 10. 장점 구역 만들기

제목:

```text
장점 구역을 만들어 보세요
```

안내:

```text
홍보하려는 대상의 장점을 따로 정리할 구역을 추가해 보세요.
```

완료 조건:

```text
baseline 이후 새 CONTAINER/Box가 2개 이상 존재하거나, 첫인상 구역 이후 새 CONTAINER가 추가됨
```

성공 코멘트:

```text
페이지를 여러 구역으로 나누면 방문자가 정보를 더 쉽게 이해할 수 있습니다.
```

---

### 11. Grid 추가하기

제목:

```text
장점을 나란히 배치해 보세요
```

안내:

```text
장점 구역 안에 Grid를 추가해 여러 정보를 나란히 보여줄 준비를 해 보세요.
```

완료 조건:

```text
baseline 이후 새 GRID_ZONE/Grid가 존재
```

성공 코멘트:

```text
Grid는 여러 정보를 같은 줄에 나란히 배치할 때 유용합니다.
```

---

### 12. Grid 안에 Card 추가하기

제목:

```text
Grid 안에 카드를 넣어 보세요
```

안내:

```text
Grid 안에 Card를 추가해 장점 하나를 담을 공간을 만들어 보세요.
```

완료 조건:

```text
GRID_ZONE/Grid의 direct child 또는 descendant로 CARD가 존재
```

성공 코멘트:

```text
Grid 안에 Card를 넣으면 여러 정보를 일정한 칸으로 정리할 수 있습니다.
```

---

### 13. 카드 내용을 수정하기

제목:

```text
카드 내용을 장점으로 바꿔 보세요
```

안내:

```text
카드 안의 제목이나 본문을 “함께 배워요”, “직접 만들어요” 같은 장점으로 바꿔 보세요.
```

완료 조건:

```text
CARD 안의 HEADING/H1 또는 PARAGRAPH/P content가 baseline 또는 기본값과 달라짐
```

성공 코멘트:

```text
좋습니다. 카드는 하나의 장점이나 정보를 짧게 묶어 보여줄 때 좋습니다.
```

---

### 14. 카드 스타일 바꾸기

제목:

```text
카드를 눈에 띄게 꾸며 보세요
```

안내:

```text
카드의 배경색이나 그림자를 바꿔, 중요한 정보가 잘 보이게 만들어 보세요.
```

완료 조건:

```text
CARD의 styles.bgColor 또는 styles.shadow가 meaningful value로 변경됨
```

성공 코멘트:

```text
배경색과 그림자는 CSS 스타일입니다. 중요한 정보를 시각적으로 강조할 때 사용할 수 있습니다.
```

---

### 15. 활동 안내 목록 만들기

제목:

```text
활동 안내 목록을 만들어 보세요
```

안내:

```text
모임 시간, 장소, 준비물처럼 반복되는 정보를 목록으로 정리해 보세요.
```

완료 조건:

```text
baseline 이후 새 LIST/UL이 존재하고, LIST가 direct LIST_ITEM을 1개 이상 가짐
```

성공 코멘트:

```text
목록은 HTML에서 ul과 li 구조로 표현됩니다. 일정, 준비물, 특징처럼 반복되는 정보를 정리하기 좋습니다.
```

---

### 16. FAQ 구역 만들기

제목:

```text
FAQ 구역을 만들어 보세요
```

안내:

```text
방문자가 궁금해할 질문을 모아 둘 구역을 추가해 보세요.
```

완료 조건:

```text
baseline 이후 새 CONTAINER/Box가 3개 이상 존재하거나, FAQ 용도로 새 CONTAINER가 추가됨
```

성공 코멘트:

```text
FAQ는 자주 묻는 질문을 미리 정리해 방문자의 궁금증을 줄여 주는 구역입니다.
```

---

### 17. Toggle로 질문 만들기

제목:

```text
접었다 펼칠 수 있는 질문을 만들어 보세요
```

안내:

```text
FAQ 구역에 Toggle 블록을 추가해 질문과 답변을 접었다 펼칠 수 있게 만들어 보세요.
```

완료 조건:

```text
baseline 이후 새 TOGGLE_ZONE/Toggle이 존재
```

성공 코멘트:

```text
Toggle은 클릭했을 때 숨겨진 내용을 보여주는 인터랙티브한 블록입니다.
```

---

### 18. FAQ 답변 수정하기

제목:

```text
FAQ 답변을 수정해 보세요
```

안내:

```text
Toggle 안의 답변 내용을 실제 질문에 맞게 바꿔 보세요.
```

완료 조건:

```text
TOGGLE_ZONE 내부의 PARAGRAPH/P content가 baseline 또는 기본값과 달라짐
```

성공 코멘트:

```text
좋습니다. 방문자가 궁금해할 내용을 미리 답해 주면 홍보 페이지가 더 친절해집니다.
```

---

### 19. 미리보기 확인하기

제목:

```text
미리보기에서 홍보 페이지를 확인해 보세요
```

안내:

```text
오른쪽 미리보기 탭을 눌러 지금 만든 홍보 페이지가 어떻게 보이는지 확인해 보세요.
```

완료 조건:

```text
previewOpened UI signal
```

성공 코멘트:

```text
좋습니다. 미리보기는 블록으로 만든 페이지가 실제 화면에서 어떻게 보일지 보여줍니다.
```

---

### 20. 코드 보기 확인하기

제목:

```text
코드 보기에서 구조를 확인해 보세요
```

안내:

```text
코드 보기 탭을 눌러 첫인상 구역, Grid, Card, FAQ가 HTML 구조로 어떻게 표현되는지 확인해 보세요.
```

완료 조건:

```text
codeViewOpened UI signal
```

성공 코멘트:

```text
잘 했어요. 지금 만든 홍보 페이지의 블록 구조가 실제 HTML 코드로 변환된 모습을 확인했습니다.
```

## 구현 지침

* 현재 `TutorialTrack` / `TutorialMission` 타입에 맞춰 작성해 주세요.
* 기존 condition 구조를 최대한 재사용해 주세요.
* 새 condition 타입이 꼭 필요하면 먼저 최소 범위로 제안하고 적용해 주세요.
* mission data에 JSX, React component, mutation function을 넣지 마세요.
* 튜토리얼은 block tree를 수정하지 않아야 합니다.
* 튜토리얼 모드에서 Templates 탭 비활성화 정책은 유지합니다.
* Preview / Code View / Export 경로는 변경하지 마세요.
* DnD, StylePanel input handler, HtmlBlock 모델, blockDefinitions 구조는 변경하지 마세요.
* 홍보 페이지 트랙에서는 PASSWORD_ZONE과 SLIDER_ZONE을 사용하지 마세요.

## 주의할 점

CONTAINER/Box가 여러 번 등장하므로, 미션 10과 16의 조건은 현재 evaluator가 안전하게 지원하는 방식으로 조정해 주세요.

예를 들어 다음 중 repo에 가장 맞는 방식을 사용해 주세요.

```text
- baseline 이후 추가된 CONTAINER 개수 기준
- 특정 순서 이후 새 CONTAINER 존재 기준
- hasAddedBlockCount condition
- 현재 지원 condition 조합으로 가능한 간단한 대체 조건
```

불필요하게 복잡한 origin tracking이나 label tracking은 추가하지 마세요.

Grid 안의 Card, Card 안의 content, Toggle 안의 answer content는 기존 tree traversal/property-aware condition으로 가능한지 확인하고, 불가능하면 최소 condition 확장을 제안해 주세요.

## 검증

가능하면 다음을 실행해 주세요.

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run lint
git diff --check
```


응답은 한국어로 작성해 주세요.
