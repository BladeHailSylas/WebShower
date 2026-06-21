import type { TutorialMission } from "../types/tutorial.types";

export const tutorialMissions = [
  {
    id: "add-intro-container",
    title: "소개 구역을 만들어 보세요",
    description: "왼쪽 블록 목록에서 일반 구역을 추가해 보세요.",
    condition: { type: "hasAddedBlock", blockType: "CONTAINER" },
    commentOnSuccess: "좋습니다. 구역은 HTML에서 div처럼 여러 요소를 묶는 역할을 합니다.",
  },
  {
    id: "add-heading-to-container",
    title: "구역 안에 제목을 넣어 보세요",
    description: "방금 만든 일반 구역 안에 제목 블록을 넣어 보세요.",
    condition: { type: "hasAddedNestedBlock", parentType: "CONTAINER", childType: "H1" },
    commentOnSuccess:
      "잘 했어요. 제목이 구역 안에 들어가면 HTML에서도 부모-자식 구조가 만들어집니다.",
  },
  {
    id: "edit-heading-content",
    title: "제목을 나만의 문장으로 바꿔 보세요",
    description:
      "제목을 ‘안녕하세요, 저는 ○○입니다’처럼 나를 소개하는 문장으로 바꿔 보세요.",
    condition: { type: "hasContentChanged", blockType: "H1" },
    commentOnSuccess: "좋습니다. 화면에 보이는 글자는 HTML 요소의 내용으로 저장됩니다.",
  },
  {
    id: "add-intro-paragraph",
    title: "소개 문장을 넣어 보세요",
    description: "소개 구역 안에 문단 블록을 추가해 보세요.",
    condition: { type: "hasAddedNestedBlock", parentType: "CONTAINER", childType: "P" },
    commentOnSuccess:
      "문단은 HTML에서 p 태그로 표현됩니다. 긴 설명이나 소개 문장을 담을 때 사용합니다.",
  },
  {
    id: "edit-paragraph-content",
    title: "나를 소개하는 글을 써 보세요",
    description:
      "문단 내용을 내가 좋아하는 것, 배우고 싶은 것, 나를 표현하는 문장으로 바꿔 보세요.",
    condition: { type: "hasContentChanged", blockType: "P" },
    commentOnSuccess:
      "좋습니다. 제목과 문단을 함께 쓰면 페이지의 핵심 메시지가 더 분명해집니다.",
  },
  {
    id: "add-intro-image",
    title: "이미지를 추가해 보세요",
    description: "소개 구역에 이미지 블록을 추가해 보세요.",
    condition: { type: "hasAddedBlock", blockType: "IMAGE" },
    commentOnSuccess: "이미지는 HTML에서 img 태그로 표현됩니다.",
  },
  {
    id: "edit-image-source",
    title: "이미지 주소를 바꿔 보세요",
    description: "이미지 블록의 주소를 다른 이미지 URL로 바꿔 보세요.",
    condition: { type: "hasAttributeChanged", blockType: "IMAGE", field: "src" },
    commentOnSuccess: "img 태그는 src 속성에 적힌 주소에서 이미지를 불러옵니다.",
  },
  {
    id: "style-intro-padding",
    title: "소개 구역에 안쪽 여백을 주세요",
    description:
      "소개 구역의 안쪽 여백을 조절해 내용이 조금 더 편하게 보이도록 만들어 보세요.",
    condition: { type: "hasStyleChanged", blockType: "CONTAINER", styleKey: "paddingSize" },
    commentOnSuccess:
      "안쪽 여백은 CSS의 padding입니다. 내용과 테두리 사이에 숨 쉴 공간을 만들어 줍니다.",
  },
  {
    id: "add-interest-card",
    title: "관심사 카드를 만들어 보세요",
    description: "카드 구역을 추가해 내가 좋아하는 것들을 정리할 공간을 만들어 보세요.",
    condition: { type: "hasAddedBlock", blockType: "CARD" },
    commentOnSuccess: "카드는 관련 있는 내용을 하나의 덩어리로 묶어 보여줄 때 유용합니다.",
  },
  {
    id: "add-heading-to-card",
    title: "카드에 제목을 넣어 보세요",
    description: "카드 안에 ‘제가 좋아하는 것’ 같은 제목을 넣어 보세요.",
    condition: { type: "hasAddedNestedBlock", parentType: "CARD", childType: "H1" },
    commentOnSuccess: "카드 안에도 제목, 문단, 목록 같은 여러 블록을 넣을 수 있습니다.",
  },
  {
    id: "add-interest-list",
    title: "관심사 목록을 만들어 보세요",
    description: "카드 안에 목록을 추가해 좋아하는 것들을 정리해 보세요.",
    condition: {
      type: "hasStructure",
      parentType: "LIST",
      directChildType: "LIST_ITEM",
      minChildren: 1,
    },
    commentOnSuccess:
      "목록은 HTML에서 ul과 li 구조로 표현됩니다. 반복되는 내용을 정리할 때 자주 사용합니다.",
  },
  {
    id: "style-intro-background",
    title: "소개 구역의 배경색을 바꿔 보세요",
    description: "소개 구역의 배경색을 바꿔 페이지 분위기를 만들어 보세요.",
    condition: { type: "hasStyleChanged", blockType: "CONTAINER", styleKey: "bgColor" },
    commentOnSuccess:
      "배경색은 CSS 스타일로 표현됩니다. 같은 구조라도 색을 바꾸면 분위기가 달라집니다.",
  },
  {
    id: "style-card-shadow",
    title: "카드에 그림자를 넣어 보세요",
    description: "카드에 그림자를 넣어 화면에서 살짝 떠 있는 느낌을 만들어 보세요.",
    condition: { type: "hasStyleChanged", blockType: "CARD", styleKey: "shadow" },
    commentOnSuccess:
      "그림자는 CSS shadow 스타일입니다. 카드처럼 독립된 영역을 강조할 때 자주 사용합니다.",
  },
  {
    id: "add-link",
    title: "링크를 추가해 보세요",
    description: "더 알아볼 수 있는 사이트나 내가 좋아하는 페이지로 가는 링크를 추가해 보세요.",
    condition: { type: "hasAddedBlock", blockType: "A" },
    commentOnSuccess: "링크는 HTML에서 a 태그로 표현됩니다.",
  },
  {
    id: "enter-link-address",
    title: "링크 주소를 입력해 보세요",
    description: "링크가 이동할 주소를 입력해 보세요.",
    condition: { type: "hasAttributeChanged", blockType: "A", field: "link" },
    comment: "잘 안 보이나요? 아래로 쭉 내려보세요.",
    commentOnSuccess: "a 태그는 href 속성에 적힌 주소로 이동합니다.",
  },
  {
    id: "view-preview",
    title: "미리보기에서 확인해 보세요",
    description: "오른쪽 미리보기 탭을 눌러 지금 만든 페이지가 어떻게 보이는지 확인해 보세요.",
    condition: { type: "uiSignal", signal: "previewOpened" },
    commentOnSuccess:
      "좋습니다. 미리보기는 블록으로 만든 페이지가 실제 화면에서 어떻게 보일지 보여줍니다.",
  },
  {
    id: "view-code",
    title: "코드 보기에서 HTML을 확인해 보세요",
    description:
      "코드 보기 탭을 눌러 방금 만든 블록 구조가 HTML로 어떻게 바뀌는지 확인해 보세요.",
    condition: { type: "uiSignal", signal: "codeViewOpened" },
    commentOnSuccess:
      "잘 했어요. 지금 만든 블록 구조가 실제 HTML 코드로 변환된 모습을 확인했습니다.",
  },
] as const satisfies readonly TutorialMission[];
