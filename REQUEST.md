현재 목표는 Block Studio의 LIST 기능을 순차적으로 확장하는 것입니다.

중요:

* 이번 작업은 반드시 순차적으로 진행하세요.
* 먼저 **Phase 1: LIST_ITEM container-like 전환**만 구현하세요.
* Phase 1이 끝나면 멈추고, 변경 요약과 테스트 결과를 보고하세요.
* **Phase 2: LIST 내부 “항목 추가” 버튼**은 Phase 1 테스트 후 별도 승인 전까지 구현하지 마세요.
* 관련 없는 mini-project, route, layout, shared app 구조는 건드리지 마세요.
* Block Studio 관련 파일만 수정하세요.
* AGENTS.md의 최신 원칙을 따르세요.

## 배경

현재 Block Studio에는 `LIST`와 `LIST_ITEM`이 구현되어 있습니다.

현재 확인된 상태:

* `LIST`는 unordered list입니다.
* `LIST`는 `<ul>`로 export/Code View에 반영됩니다.
* `LIST_ITEM`은 `<li>`로 export/Code View에 반영됩니다.
* `LIST_ITEM`은 palette에 노출되지 않는 internal block입니다.
* 현재는 `LIST_ITEM`만 `LIST` 안에 들어갈 수 있습니다.
* `LIST_ITEM`은 root, CARD, CONTAINER, GRID_ZONE, PASSWORD_ZONE, TOGGLE_ZONE 등에 들어가지 않습니다.
* Code View와 Export는 현재까지 정상 동작합니다.
* ordered list, `ol`, `listKind`는 이번 범위가 아닙니다.

현재 구조:

```text
LIST
└─ LIST_ITEM(content)
```

현재 HTML:

```html
<ul>
  <li>목록 항목</li>
</ul>
```

## 최종 방향

`LIST_ITEM`을 text-only item에서 container-like `li`로 전환합니다.

목표 구조:

```text
LIST
└─ LIST_ITEM
   └─ children
      ├─ PARAGRAPH
      ├─ IMAGE
      └─ LINK
```

목표 HTML:

```html
<ul>
  <li>
    <p>...</p>
    <img ...>
    <a ...>...</a>
  </li>
</ul>
```

중요한 원칙:

* `LIST`는 계속 `LIST_ITEM`만 직접 자식으로 받아야 합니다.
* 일반 블록을 `LIST`에 직접 drop하게 만들지 마세요.
* compiler가 “LIST의 자식을 자동으로 li로 감싼다”는 예외를 만들면 안 됩니다.
* `LIST_ITEM` 자체가 `<li>`에 대응하는 block이어야 합니다.
* block tree와 HTML structure가 최대한 일치해야 합니다.
* Code View 전용 generator를 만들지 마세요.
* 기존 compiler/export 경로를 계속 사용하세요.

---

# Phase 1 — LIST_ITEM container-like 전환

이번 응답에서는 **Phase 1만 구현**하세요.

## Phase 1 목표

`LIST_ITEM`을 다음 구조로 바꿉니다.

```ts
LIST_ITEM {
  type: "LIST_ITEM",
  children: []
}
```

즉:

* `content` 사용을 중단합니다.
* `LIST_ITEM`은 `children`만 사용합니다.
* `LIST_ITEM`의 기본 children은 없어야 합니다.
* 기본 `PARAGRAPH` child를 자동 생성하지 마세요.
* 새 `LIST_ITEM`은 빈 `<li></li>`에 해당하는 구조로 시작합니다.
* 사용자는 이후 `LIST_ITEM` 안에 P, IMAGE, LINK 등 허용된 블록을 직접 넣습니다.

## 매우 중요한 수정 기준

이전 보고서에서는 `LIST_ITEM` 안에 기본 `PARAGRAPH` child를 넣는 방안을 권고했지만, 이번 구현에서는 그 방식을 사용하지 않습니다.

하지 말아야 할 것:

```text
LIST_ITEM
└─ PARAGRAPH("목록 항목")
```

해야 할 것:

```text
LIST_ITEM
└─ children: []
```

이유:

* `li`를 생성했는데 자동으로 `p`가 함께 생기는 것은 교육적으로 설명 비용이 큽니다.
* add-item button이 `LIST_ITEM` 내부 구조를 알게 만들면 data-driven abstraction이 약해집니다.
* `LIST_ITEM` definition은 단순하게 `<li>` container 역할만 해야 합니다.
* 필요하면 학생이 직접 P, IMAGE, LINK 등을 넣도록 합니다.

## Phase 1 세부 요구사항

### 1. LIST_ITEM definition

`LIST_ITEM` definition을 다음 방향으로 전환하세요.

* internal block 유지
* palette hidden 유지
* `contentField` 제거 또는 사용 중단
* template은 `children: []`
* `childFields` 추가
* `htmlSchema`: `{ tag: "li", childField: "children" }`
* `editableFields`: 최소한 common style fields만 사용
* inline input 없음
* textarea 없음

### 2. LIST definition

`LIST` definition은 계속 `LIST_ITEM`만 직접 자식으로 허용해야 합니다.

현재 기본 `LIST_ITEM` 개수는 repo 상태를 보고 판단하되, 다음 기준을 따르세요.

선호:

* LIST 생성 시 빈 `LIST_ITEM` 1개

허용:

* 기존 UX 안정성을 위해 빈 `LIST_ITEM` 3개 유지

단, 어떤 경우에도 기본 LIST_ITEM 안에 PARAGRAPH나 다른 child block을 자동 생성하지 마세요.

### 3. LIST_ITEM children 허용 범위

Phase 1에서는 `LIST_ITEM` 안에 허용할 블록을 작게 유지하세요.

우선 허용 후보:

* HEADING
* PARAGRAPH
* IMAGE
* LINK 또는 A
* HR
* CARD
* CONTAINER

우선 제외:

* LIST
* LIST_ITEM
* GRID_ZONE
* PASSWORD_ZONE
* TOGGLE_ZONE
* SPACER 또는 내부용 블록

특히 nested list는 이번 범위에서 제외합니다.

만약 현재 drop policy 구조상 indirect nested LIST, 예를 들어 `LIST_ITEM > CONTAINER > LIST`까지 엄격히 막기 위해 큰 ancestry/subtree 검사가 필요하다면, 이번 Phase 1에서는 무리하게 구현하지 말고 보고하세요.

단, 직접적으로 `LIST_ITEM` 안에 `LIST`나 `LIST_ITEM`이 들어가는 것은 막아야 합니다.

### 4. Preview / Code View / Export

다음을 지켜주세요.

* `LIST_ITEM`은 `<li>`로 출력되어야 합니다.
* `LIST_ITEM.children`은 기존 compiler recursion으로 출력되어야 합니다.
* compiler에 `if block.type === "LIST_ITEM"` 같은 전용 HTML 생성 예외를 추가하지 마세요.
* Code View 전용 generator를 만들지 마세요.
* Code View는 기존 compiler 결과만 보여줘야 합니다.
* Preview renderer는 현재 구조가 switch-based라면 최소 case 수정은 허용합니다.
* Preview에서도 `LIST_ITEM.children`을 재귀 렌더링해야 합니다.

예상 출력:

```html
<ul>
  <li>
    <p>본문</p>
  </li>
</ul>
```

빈 항목은 다음처럼 나올 수 있습니다.

```html
<ul>
  <li></li>
</ul>
```

이것은 Phase 1에서는 허용합니다.

### 5. Canvas UX

`LIST_ITEM`은 container-like block처럼 보여야 합니다.

필요한 것:

* `LIST_ITEM` 안에 child drop zone 표시
* empty state 표시

  * 예: “이 항목 안에 블록을 넣으세요”
  * 또는 “본문, 이미지, 링크 등을 드롭하세요”
* drag handle / edit handle 유지
* inline input 제외
* text-only label인 `항목: ${block.content}` 같은 표시는 children 모델에 맞게 조정

가능하면 기존 `CanvasBlockSlot`을 재사용하세요.
LIST_ITEM 전용 slot 컴포넌트를 만들지 마세요.

### 6. DnD / drop policy

다음을 유지해야 합니다.

* `LIST`는 직접 자식으로 `LIST_ITEM`만 받음
* `LIST_ITEM`은 `LIST` 안에서만 존재할 수 있음
* `LIST_ITEM`은 root로 이동할 수 없음
* `LIST_ITEM`은 CARD, CONTAINER, GRID_ZONE, PASSWORD_ZONE, TOGGLE_ZONE 등으로 이동할 수 없음
* `LIST_ITEM` 자체 reorder는 기존처럼 가능해야 함
* `LIST_ITEM` 내부에는 허용된 일반 블록만 drop 가능해야 함

이번 Phase 1에서 drop engine을 수정해야 한다면:

* 최소 범위로만 수정하세요.
* 기존 CONTAINER, CARD, GRID_ZONE, PASSWORD_ZONE, TOGGLE_ZONE의 drop 동작을 바꾸지 마세요.
* acceptedBlockTypes / allowedParentTypes가 없는 기존 블록은 기존처럼 동작해야 합니다.

### 7. StylePanel

Phase 1에서는 LIST_ITEM content editing을 제거하거나 비활성화합니다.

* LIST_ITEM은 더 이상 `content` text field를 노출하지 않아야 합니다.
* LIST_ITEM 자체는 common style 정도만 수정 가능하면 됩니다.
* 실제 텍스트는 사용자가 LIST_ITEM 안에 PARAGRAPH를 넣고, 그 PARAGRAPH를 StylePanel에서 수정하는 흐름입니다.
* inline input은 구현하지 마세요.

## Phase 1 명시적 제외 범위

이번 Phase 1에서 다음은 구현하지 마세요.

* LIST 내부 “항목 추가” 버튼
* 자동 wrapping

  * 예: LIST 빈 공간에 일반 block을 drop하면 자동으로 LIST_ITEM을 만들고 그 안에 넣는 기능
* LIST_ITEM palette 노출
* ordered list / `ol`
* `listKind`
* marker style option
* textarea list editing
* inline input
* nested list
* default PARAGRAPH child 자동 생성
* Code View 전용 generator
* compiler special-case explosion
* GRID_ZONE 관련 변경
* gridGap
* GRID_DROPPER
* HtmlBlock 모델 대수정

## Phase 1 완료 후 보고 형식

Phase 1 구현이 끝나면 다음 형식으로 보고하세요.

# Phase 1 LIST_ITEM Containerization Report

## 1. Summary

* 무엇을 바꿨는지
* LIST_ITEM이 어떻게 바뀌었는지
* 기본 child 생성 여부

## 2. Files Changed

표 형식:
| File | Change | Reason |

## 3. Data Model Result

* LIST template
* LIST_ITEM template
* childFields
* dropPolicy
* htmlSchema

## 4. Preview / Code View / Export Result

* compiler special case 추가 여부
* Code View 변경 여부
* 예상 HTML 예시

## 5. DnD Result

* LIST accepts only LIST_ITEM
* LIST_ITEM allowed parents
* LIST_ITEM allowed children
* forbidden drops

## 6. Validation

실행한 명령:

* typecheck
* build
* lint 또는 changed-file lint

실패가 있으면:

* 관련 실패인지
* 기존 unrelated 실패인지 구분

## 7. Manual Regression Checklist

* LIST 생성
* 빈 LIST_ITEM 표시
* LIST_ITEM 안에 PARAGRAPH drop
* LIST_ITEM 안에 IMAGE/LINK/HR drop
* LIST_ITEM reorder
* LIST_ITEM이 root/CARD/CONTAINER/GRID_ZONE에 drop되지 않음
* Preview 확인
* Code View 확인
* Export 확인
* 기존 H1/P/IMAGE/A/HR/CARD/CONTAINER/GRID_ZONE 동작 확인

## 8. Phase 2 Readiness

* 항목 추가 버튼 구현을 위해 필요한 최소 변경
* Phase 2에서 재사용할 수 있는 factory/mutation 경로
* Phase 2 구현 전 남은 위험

---

# Phase 2 — LIST 내부 항목 추가 버튼

Phase 2는 지금 구현하지 마세요.
다만 Phase 1 보고서의 “Phase 2 Readiness”에서 아래 방향을 고려해 주세요.

향후 목표:

* LIST 내부에 “항목 추가” 버튼을 둔다.
* 버튼은 LIST의 children slot 하단에 표시한다.
* 버튼을 누르면 새 빈 `LIST_ITEM`만 생성한다.
* 새 LIST_ITEM 안에 PARAGRAPH나 다른 child를 자동 생성하지 않는다.
* 새 item 생성은 반드시 blockFactory / createBlockFromDefinition("LIST_ITEM") 경로를 사용한다.
* 버튼이나 mutation helper가 LIST_ITEM 내부 구조를 직접 조립하지 않는다.
* LIST_ITEM은 계속 palette에 노출하지 않는다.
* 자동 wrapping은 구현하지 않는다.

향후 Phase 2에서 지켜야 할 원칙:

```text
button click
→ createBlockFromDefinition("LIST_ITEM")
→ append to LIST.children
```

하지 말아야 할 것:

```text
button click
→ manually create LIST_ITEM
→ manually create PARAGRAPH
→ append PARAGRAPH into LIST_ITEM
→ append LIST_ITEM
```

Phase 2는 Phase 1 테스트 후 별도 승인받고 진행하세요.
