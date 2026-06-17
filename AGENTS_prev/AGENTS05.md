현재 목표는 Block Studio에 Code View 프로토타입을 추가하는 것입니다.

중요:

* 이번 작업은 “프로토타입”입니다.
* 아직 UI 스타일링에 많은 시간을 쓰지 마세요.
* 목적은 블록 트리가 기존 HTML compiler 경로를 통해 제대로 HTML 코드로 변환되는지 확인하는 것입니다.
* Code View를 위해 block type별로 HTML을 새로 만드는 generator/component를 만들면 안 됩니다.
* 기존 export/compiler 경로를 반드시 재사용하세요.
* 관련 없는 mini-project, route, layout, shared app 구조는 수정하지 마세요.
* Block Studio 관련 파일만 수정하세요.

## 핵심 원칙

Code View는 새로운 HTML 생성기가 아닙니다.

Code View의 역할:

```text
HtmlBlock[]
→ 기존 compiler 경로
→ HTML string
→ read-only display
```

금지:

```text
CodeViewPanel 내부에서 block.type별 switch로 HTML 생성
PreviewBlockRenderer의 React JSX를 읽어서 HTML로 재구성
Code View 전용 H1/P/IMAGE/GRID_ZONE/PASSWORD_ZONE HTML 생성기 작성
escapeHtml / escapeAttribute / style transform 로직 재구현
QR/export/deploy flow 변경
HTML → block tree 역변환
코드 편집 기능
Monaco 등 무거운 editor dependency 추가
```

허용:

```text
기존 compileBlockHtml을 호출하는 얇은 adapter
HtmlBlock[]를 fragment string으로 변환하는 wrapper
컴파일 결과 문자열을 그대로 보여주는 CodeViewPanel
기본적인 <pre><code> 표시
복사 버튼
빈 canvas 안내 문구
```

## 기존 조사 결과 요약

이전 보고서 기준:

* `src/features/block-studio/blocks/html/blockHtmlCompiler.ts`

  * `compileBlockHtml(block)`는 block-level HTML fragment를 생성합니다.
  * `compilePageHtml(blocks)`는 full HTML document를 생성합니다.
* Code View v1/prototype은 `compileBlockHtml` 기반 body fragment를 보여주는 것이 가장 안전합니다.
* `QrExportPanel.tsx`는 `compilePageHtml(blocks)`를 호출하지만, QR/export UI 자체는 Code View 재사용 대상이 아닙니다.
* `PreviewBlockRenderer.tsx`는 React preview renderer이며 Code View의 source of truth가 아닙니다.
* `htmlSchema` 기반 블록은 기존 compiler에 의해 자동 반영됩니다.
* `htmlExporterKey` 기반 블록은 기존 custom exporter를 통해 반영됩니다.
* `GRID_ZONE` export에는 `styles.gridCols ?? 2` 기반 inline grid style이 이미 반영되어야 합니다.

## 이번 구현 범위

### 1. Code View prototype UI 추가

Preview 영역에 간단한 “미리보기 / 코드 보기” 전환 UI를 추가해 주세요.

권장 위치:

* `src/components/block/preview/BlockRenderer.tsx`

요구:

* 기본값은 기존 미리보기
* “코드 보기”를 선택하면 현재 blocks의 HTML fragment가 표시됨
* 스타일링은 최소화
* DaisyUI/Tailwind를 과하게 꾸미지 말 것
* 일단 사용자가 변환 결과를 확인할 수 있으면 충분함

예상 UI 수준:

```tsx
<button>미리보기</button>
<button>코드 보기</button>
```

```tsx
<pre>
  <code>{code}</code>
</pre>
```

### 2. CodeViewPanel 컴포넌트 추가

새 컴포넌트를 만든다면 다음 위치를 권장합니다.

```text
src/components/block/preview/CodeViewPanel.tsx
```

역할:

* `blocks: HtmlBlock[]`를 받음
* 기존 compiler adapter를 통해 HTML string을 얻음
* read-only로 표시
* copy button 제공 가능
* 빈 canvas면 안내 문구 표시

주의:

* `CodeViewPanel`은 block type을 알면 안 됩니다.
* `CodeViewPanel` 안에 block type별 switch/if를 만들지 마세요.
* HTML 생성은 반드시 기존 compiler를 통해 수행하세요.

### 3. compiler adapter 추가

`compileBlockHtml(block)`는 단일 block 입력이므로, `HtmlBlock[]`를 fragment string으로 바꾸는 얇은 adapter를 추가해 주세요.

가능한 위치:

* `src/features/block-studio/blocks/html/blockHtmlCompiler.ts`에 exported helper 추가
  또는
* `src/features/block-studio/blocks/html/compileBlocksForCodeView.ts`

권장 형태:

```ts
export function compileBlocksForCodeView(blocks: HtmlBlock[]): string {
  return blocks.map(compileBlockHtml).join("\n");
}
```

이 함수는 새 generator가 아닙니다. 기존 `compileBlockHtml`을 호출하는 wrapper여야 합니다.

주의:

* `compileBlocksForCodeView` 안에서 block type별 HTML을 만들지 마세요.
* escaping/class/style 변환을 다시 구현하지 마세요.
* full document가 아니라 body fragment를 기본으로 반환하세요.
* `compilePageHtml`는 QR/export flow에 그대로 두세요.

### 4. formatter는 이번에는 선택 사항

이번 프로토타입에서는 “변환 결과 확인”이 목표입니다.

따라서 HTML pretty formatter는 필수가 아닙니다.

가능하면:

* 단순히 `join("\n")` 정도만 적용
* 추가 formatter가 너무 커지면 이번 작업에서 제외
* formatter를 추가하더라도 HTML 의미를 바꾸지 않는 표시용 helper로만 구현

이번 작업에서는 미려한 syntax highlighting이나 완성도 높은 formatting을 하지 마세요.

### 5. QR/export flow는 변경하지 않기

`QrExportPanel.tsx`와 기존 배포/export 동작은 가능한 한 변경하지 마세요.

확인할 것:

* QR/export는 계속 `compilePageHtml(blocks)`를 사용
* Code View는 fragment display를 위해 adapter를 사용
* 두 경로 모두 기존 `compileBlockHtml`를 공유

## 구현 전 확인 파일

작업 전 다음 파일을 확인해 주세요.

* `src/components/block/preview/BlockRenderer.tsx`
* `src/components/block/preview/PreviewBlockRenderer.tsx`
* `src/components/block/preview/QrExportPanel.tsx`
* `src/features/block-studio/blocks/html/blockHtmlCompiler.ts`
* `src/features/block-studio/blocks/html/htmlSchemaCompiler.ts`
* `src/features/block-studio/blocks/html/interactiveExporters.ts`
* `src/features/block-studio/blocks/html/escapeHtml.ts`
* `src/features/block-studio/blocks/html/transformGuiToTailwind.ts`
* `src/types/types.ts`

## 수동 검증 목표

구현 후 다음을 확인해 주세요.

### 기본 표시

* 빈 canvas에서 Code View가 안내 문구를 표시
* H1/P 블록이 HTML로 표시
* IMAGE 블록이 `<img ...>` 형태로 표시
* A/link 블록이 `<a ...>` 형태로 표시
* CONTAINER children이 중첩 HTML로 표시
* GRID_ZONE이 `display: grid`, `grid-template-columns`, `gap: 12px`를 포함해 표시
* PASSWORD_ZONE / TOGGLE_ZONE이 기존 exporter 경로의 결과로 표시

### 경로 재사용

* Code View가 `compileBlockHtml` 또는 그 wrapper를 사용
* CodeViewPanel에 block type별 HTML 생성 로직이 없음
* PreviewBlockRenderer를 HTML source로 사용하지 않음
* QR/export flow가 변경되지 않음

### 회귀

* 기존 미리보기는 계속 동작
* QR/export 버튼은 기존처럼 동작
* 일반 block drag/edit 동작에 영향 없음

## 검증 명령

가능하면 다음을 실행해 주세요.

```bash
npx.cmd tsc --noEmit
```

전체 lint는 기존 unrelated 오류가 있을 수 있으므로, 가능하면 변경 파일 중심 lint를 실행하고 결과를 보고해 주세요.

## 출력 요청

작업 후 다음 형식으로 보고해 주세요.

1. 변경 요약
2. 수정/추가한 파일 목록
3. Code View가 기존 compiler를 어떻게 재사용하는지
4. CodeViewPanel에 block type별 HTML 생성 로직이 없는지 확인
5. QR/export flow 변경 여부
6. 실행한 검증 명령과 결과
7. 수동 테스트 체크리스트 결과
8. 남은 위험 또는 후속 과제

다시 강조:
이번 작업은 Code View prototype입니다.
목표는 “예쁘게 보이기”가 아니라 “기존 compiler 경로로 블록이 코드로 전사되는지 확인하기”입니다.
Code View 전용 HTML generator를 만들지 마세요.
