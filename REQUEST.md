Phase 4-A 작업을 실행합니다.

이번 목표는 스타일 확장 중에서도 **padding controls**, 즉 “안쪽 여백”만 추가하는 것입니다.
작업 범위가 넓어지면 오류 원인 추적이 어려워지므로, 이번 Phase에서는 padding 외의 layout/style 기능을 추가하지 마세요.

## 배경

이 프로젝트는 React + TypeScript + Tailwind CSS + DaisyUI + Vite 기반의 교육용 웹 빌더입니다.
Block Studio는 일반 no-code 플랫폼이 아니라, 학생들이 블록 구조가 실제 HTML/CSS로 어떻게 연결되는지 이해하도록 돕는 교육용 도구입니다.

현재까지 다음 작업은 완료된 상태입니다.

* StylePanel 섹션화
* 기존 스타일 적용 문제 정리
* GRID_ZONE 관련 예외 최소 정리
* 텍스트 스타일 확장
* box/line style 확장
* HR 선 굵기/선 색상 계열 스타일 확장

이번 Phase 4-A는 **고급 스타일 항목 중 “안쪽 여백”만** 추가합니다.

## 목표

기존 StylePanel / StyleProps / transformGuiToTailwind / Preview / Compiler / Code View 흐름을 유지하면서, 제한된 토큰 기반의 padding 스타일을 추가합니다.

UI에서는 CSS 용어인 `padding`보다 학습자 친화적인 라벨을 사용해 주세요.

권장 UI 라벨:

```text
안쪽 여백
```

가능하면 설명 문구도 짧게 붙일 수 있는 구조인지 확인해 주세요.

권장 설명:

```text
블록 내용과 테두리 사이의 공간
```

설명 문구 지원이 현재 구조에 없다면, 이번 Phase에서 무리하게 tooltip/description 시스템을 새로 만들지는 말고 보고만 해 주세요.

## 허용 범위

* `StyleProps`에 padding 관련 필드 추가
* `editableFieldPresets`에 padding 필드 추가
* StylePanel의 기존 섹션 구조에서 padding을 **고급** 섹션에 표시
* 필요한 block definition의 `editableFields`에 padding 노출
* `transformGuiToTailwind` 또는 관련 resolver에 padding class mapping 추가
* 기존 `className` 또는 template className에 있는 padding 계열 Tailwind utility와의 충돌 처리
* Preview / Code View / Export parity 검증
* 필요한 경우 resolver 단위 테스트 추가

## 권장 필드 설계

자유 입력이 아니라 제한된 토큰을 사용해 주세요.

권장 필드명 예시:

```ts
styles.paddingSize?: "none" | "sm" | "md" | "lg" | "xl";
```

또는 현재 repo의 명명 규칙에 더 맞는 이름이 있다면 짧게 보고 후 적용해 주세요.

권장 Tailwind 매핑 예시:

```text
none → p-0
sm → p-2
md → p-4
lg → p-6
xl → p-8
```

실제 값은 기존 디자인과 충돌하지 않도록 repo 상태를 확인한 뒤 결정해 주세요.

## UI 섹션 정책

padding은 CSS 박스 모델 개념이 필요하므로, 1차 UI에서는 “여백” 같은 별도 주요 섹션을 만들지 말고 **고급** 섹션에 배치해 주세요.

표시 라벨은 `padding`이 아니라 다음을 사용해 주세요.

```text
안쪽 여백
```

이번 Phase에서는 다음 항목도 새로 만들지 마세요.

* 별도 “여백” 섹션
* 별도 “박스 모델” 섹션
* tooltip/description 시스템
* CSS 교육용 도움말 패널

다만 현재 구조에서 description/helpText를 이미 지원한다면, 짧은 설명 문구를 넣는 것은 허용합니다.

## 노출 대상 검토

구현 전 다음을 확인하고 보고해 주세요.

* CONTAINER에 노출할지
* CARD에 노출할지
* GRID_ZONE에 노출할지
* LIST에 노출할지
* LIST_ITEM에 노출할지
* HEADING에 노출할지
* PARAGRAPH에 노출할지
* LINK에 노출할지
* IMAGE에는 노출하지 않는 것이 적절한지
* HR에는 노출하지 않는 것이 적절한지
* PASSWORD_ZONE / TOGGLE_ZONE에는 노출할지

우선은 container-like block 중심 노출을 선호합니다.

우선 노출 후보:

```text
CONTAINER
CARD
GRID_ZONE
LIST
LIST_ITEM
PASSWORD_ZONE
TOGGLE_ZONE
```

텍스트 블록인 HEADING / PARAGRAPH / LINK에 padding을 노출하는 것은 가능하지만, 초보자에게 “텍스트 주변 공간”과 “구역 내부 공간”이 혼동될 수 있으므로 이번 Phase에서는 신중히 검토해 주세요.

IMAGE와 HR에는 기본적으로 노출하지 않는 방향을 선호합니다.

## 충돌 처리

padding을 추가할 때 기존 `styles.className` 또는 template className에 다음 계열 utility가 있을 수 있습니다.

```text
p-*
px-*
py-*
pt-*
pr-*
pb-*
pl-*
```

이번 구현에서 다음을 명확히 해 주세요.

1. 구조화된 `styles.paddingSize`가 있을 때 기존 padding utility를 제거할지
2. 방향별 padding utility가 있을 때 어떻게 처리할지
3. `px-*`, `py-*` 같은 축 방향 utility를 보존할지 제거할지
4. arbitrary value나 responsive variant는 이번 범위에서 어떻게 다룰지

권장 정책:

* `styles.paddingSize`가 명시되면 같은 root className 안의 기본 padding utility는 제거합니다.
* `p-*`, `px-*`, `py-*`, `pt-*`, `pr-*`, `pb-*`, `pl-*`는 같은 padding 계열로 보고 충돌 제거 대상으로 검토합니다.
* responsive variant, arbitrary value, 복잡한 Tailwind parser는 이번 범위에서 무리하게 처리하지 말고 명시적으로 제외하거나 기존 resolver 수준에서만 처리합니다.

과도한 Tailwind parser를 만들지 말고, 현재 resolver의 범위 안에서 유지보수 가능한 최소 정책을 제안해 주세요.

## Canvas 처리

이번 Phase에서는 Canvas renderer 구조를 변경하지 마세요.

* Canvas에 padding을 실제로 전면 반영하는 작업은 하지 않습니다.
* 기존 editor shell, drag handle, edit handle, nested drop zone 동작을 유지합니다.
* Preview / Code View / Export에서 의미가 일치하는지에 집중합니다.

단, Canvas에서 새 필드 저장 자체가 정상인지 StylePanel을 통해 확인해 주세요.

## 금지 범위

이번 Phase에서는 다음을 구현하지 마세요.

* margin 추가
* width 추가
* maxWidth 추가
* minHeight 추가
* gap 추가
* GRID_ZONE layout helper 신규 도입
* IMAGE aspectRatio 추가
* IMAGE objectFit 추가
* LINK variant 추가
* inheritTextStyles 또는 스타일 상속 구현
* Learning Templates 구현
* StylePanel 대규모 구조 변경
* 별도 “여백” 섹션 신설
* tooltip/help 시스템 신설
* Canvas renderer 대규모 변경
* HtmlBlock 모델 교체
* slots migration
* GRID_ZONE child model 변경
* LIST/LIST_ITEM 구조 변경
* Code View 전용 generator 추가
* DnD 관련 변경
* unrelated repository 변경

## 구현 전 짧은 계획 보고

코드를 수정하기 전에 먼저 아래 형식으로 짧은 계획을 보고해 주세요.

```text
Phase 4-A 구현 계획:
- 수정할 파일:
- 추가할 타입/필드:
- 노출할 블록:
- StylePanel 섹션:
- transform/resolver 변경 방식:
- padding utility 충돌 처리 정책:
- 변경하지 않을 파일/영역:
- 예상 회귀 위험:
- 검증 방법:
```

계획 승인 후 구현해 주세요.

## 구현 후 보고

구현 후에는 다음을 보고해 주세요.

```text
변경 요약:
- 수정 파일:
- 추가된 필드:
- 노출 블록:
- UI 라벨/섹션:
- class mapping:
- 충돌 처리:
- Preview / Code View / Export parity:
- 실행한 검증 명령:
- 수동 테스트 결과:
- 남은 위험:
```

## 검증

가능하면 다음을 실행해 주세요.

```powershell
npx.cmd tsc --noEmit
npm.cmd run build
```

full lint가 unrelated 오류로 막히면 변경 파일만 ESLint로 검사하고, 관련/무관 실패를 구분해 주세요.

수동 검증에는 최소한 다음을 포함해 주세요.

* CONTAINER padding 적용
* CARD padding 적용
* GRID_ZONE padding 적용
* LIST padding 적용
* LIST_ITEM padding 적용
* PASSWORD_ZONE / TOGGLE_ZONE에 노출했다면 padding 적용 확인
* HEADING / PARAGRAPH / LINK에 노출했다면 각각 padding 적용 확인
* IMAGE / HR에 노출하지 않았다면 StylePanel에 표시되지 않는지 확인
* Preview 반영 확인
* Code View class 확인
* Export HTML 확인
* 기존 bgColor/textColor/fontSize/fontFamily/lineHeight/letterSpacing/border/shadow/rounded 회귀 확인
* HR 선 굵기/선 색상 회귀 확인
* GRID_ZONE gridCols 회귀 확인
* LIST/LIST_ITEM restriction 유지
* drag handle/edit handle 유지
* nested block 이동 및 재정렬 유지

## 응답 언어

보고서는 한국어로 작성해 주세요.
