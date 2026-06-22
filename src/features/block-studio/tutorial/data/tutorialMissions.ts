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
    instantSuccess: false,
    title: "제목을 나만의 문장으로 바꿔 보세요",
    description:
      "제목을 ‘안녕하세요, 저는 ○○입니다’처럼 나를 소개하는 문장으로 바꿔 보세요.",
      comment: "제목 블록의 파란색 단추를 누르면 내용을 바꿀 수 있는 창이 나온답니다.",
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
    instantSuccess: false,
    title: "나를 소개하는 글을 써 보세요",
    description:
      "문단 내용을 내가 좋아하는 것, 배우고 싶은 것, 나를 표현하는 문장으로 바꿔 보세요.",
    condition: { type: "hasContentChanged", blockType: "P" },
    commentOnSuccess:
      "내용을 수정할 수 있는 이 창을 스타일 창이라고 부릅시다.",
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
    instantSuccess: false,
    title: "이미지 주소를 바꿔 보세요",
    description: "이미지 블록의 주소를 다른 이미지 URL로 바꿔 보세요.",
    comment: "이 링크를 넣어보세요: https://picsum.photos/200",
    condition: { type: "hasAttributeChanged", blockType: "IMAGE", field: "src" },
    commentOnSuccess: "img 태그는 src 속성에 적힌 주소에서 이미지를 불러옵니다.",
  },
  {
    id: "style-intro-padding",
    instantSuccess: false,
    title: "소개 구역에 안쪽 여백을 주세요",
    description:
      "소개 구역의 안쪽 여백을 조절해 내용이 조금 더 편하게 보이도록 만들어 보세요.",
      comment: "구역 블록의 파란 단추를 누르고, 스크롤을 아래로 내리면 설정을 찾을 수 있어요.",
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
    instantSuccess: false,
    title: "소개 구역의 배경색을 바꿔 보세요",
    description: "소개 구역의 배경색을 바꿔 페이지 분위기를 만들어 보세요.",
    condition: { type: "hasStyleChanged", blockType: "CONTAINER", styleKey: "bgColor" },
    commentOnSuccess:
      "배경색은 CSS 스타일로 표현됩니다. 같은 구조라도 색을 바꾸면 분위기가 달라집니다.",
  },
  {
    id: "style-card-shadow",
    instantSuccess: false,
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
    instantSuccess: false,
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

export const promotionTutorialMissions = [
  {
    id: "promotion-add-hero-container",
    title: "첫인상 구역을 만들어 보세요",
    description:
      "홍보 페이지의 맨 위에는 방문자가 가장 먼저 보게 될 구역이 필요합니다. 일반 구역을 추가해 보세요.",
    condition: { type: "hasAddedBlock", blockType: "CONTAINER" },
    commentOnSuccess:
      "좋습니다. 웹페이지 맨 위에서 제목, 설명, 이미지, 버튼으로 첫인상을 만드는 영역을 Hero 구역이라고 부르기도 합니다.",
  },
  {
    id: "promotion-add-heading",
    title: "홍보 제목을 넣어 보세요",
    description: "첫인상 구역 안에 제목 블록을 넣어, 무엇을 홍보하는 페이지인지 알려주세요.",
    condition: { type: "hasAddedNestedBlock", parentType: "CONTAINER", childType: "H1" },
    commentOnSuccess: "제목은 방문자가 페이지의 주제를 가장 먼저 이해하도록 도와줍니다.",
  },
  {
    id: "promotion-edit-heading",
    instantSuccess: false,
    title: "제목을 홍보 문구로 바꿔 보세요",
    description:
      "예를 들어 ‘우리 동아리를 소개합니다’ 또는 ‘함께 만드는 웹 제작 모임’처럼 바꿔 보세요.",
    condition: { type: "hasContentChanged", blockType: "H1" },
    commentOnSuccess: "좋습니다. 짧고 분명한 제목은 홍보 페이지의 첫인상을 결정합니다.",
  },
  {
    id: "promotion-add-introduction",
    title: "짧은 소개 문장을 추가해 보세요",
    description:
      "첫인상 구역 안에 문단 블록을 추가해, 이 페이지가 무엇을 소개하는지 한두 문장으로 설명해 보세요.",
    condition: { type: "hasAddedNestedBlock", parentType: "CONTAINER", childType: "P" },
    commentOnSuccess: "문단은 제목을 조금 더 자세히 설명하는 역할을 합니다.",
  },
  {
    id: "promotion-edit-introduction",
    instantSuccess: false,
    title: "소개 문장을 직접 써 보세요",
    description: "동아리, 행사, 프로젝트의 매력을 짧게 소개하는 문장으로 바꿔 보세요.",
    condition: { type: "hasContentChanged", blockType: "P" },
    commentOnSuccess:
      "좋습니다. 홍보 문장은 방문자가 계속 읽어 볼지 결정하는 중요한 단서가 됩니다.",
  },
  {
    id: "promotion-add-image",
    title: "대표 이미지를 추가해 보세요",
    description: "첫인상 구역에 이미지 블록을 추가해 페이지의 분위기를 보여주세요.",
    condition: { type: "hasAddedBlock", blockType: "IMAGE" },
    commentOnSuccess: "이미지는 글보다 빠르게 분위기와 주제를 전달할 수 있습니다.",
  },
  {
    id: "promotion-edit-image-source",
    instantSuccess: false,
    title: "이미지 주소를 바꿔 보세요",
    description: "이미지 블록의 주소를 홍보 내용과 어울리는 이미지 URL로 바꿔 보세요.",
    condition: { type: "hasAttributeChanged", blockType: "IMAGE", field: "src" },
    commentOnSuccess: "img 태그는 src 속성에 적힌 주소에서 이미지를 불러옵니다.",
  },
  {
    id: "promotion-add-link",
    title: "참여 링크를 추가해 보세요",
    description: "방문자가 더 알아보거나 신청할 수 있도록 링크 블록을 추가해 보세요.",
    condition: { type: "hasAddedBlock", blockType: "A" },
    commentOnSuccess:
      "홍보 페이지에는 보통 신청하기, 더 알아보기 같은 다음 행동으로 이어지는 링크가 필요합니다.",
  },
  {
    id: "promotion-enter-link-address",
    instantSuccess: false,
    title: "링크 주소를 입력해 보세요",
    description: "링크가 이동할 주소를 입력해 보세요.",
    condition: { type: "hasAttributeChanged", blockType: "A", field: "link" },
    commentOnSuccess: "a 태그는 href 속성에 적힌 주소로 이동합니다.",
  },
  {
    id: "promotion-add-benefits-container",
    title: "장점 구역을 만들어 보세요",
    description: "홍보하려는 대상의 장점을 따로 정리할 구역을 추가해 보세요.",
    condition: { type: "hasAddedBlock", blockType: "CONTAINER", min: 2 },
    commentOnSuccess: "페이지를 여러 구역으로 나누면 방문자가 정보를 더 쉽게 이해할 수 있습니다.",
  },
  {
    id: "promotion-add-grid",
    title: "장점을 나란히 배치해 보세요",
    description: "장점 구역 안에 Grid를 추가해 여러 정보를 나란히 보여줄 준비를 해 보세요.",
    condition: { type: "hasAddedBlock", blockType: "GRID_ZONE" },
    commentOnSuccess: "Grid는 여러 정보를 같은 줄에 나란히 배치할 때 유용합니다.",
  },
  {
    id: "promotion-add-card-to-grid",
    title: "Grid 안에 카드를 넣어 보세요",
    description: "Grid 안에 Card를 추가해 장점 하나를 담을 공간을 만들어 보세요.",
    condition: { type: "hasAddedNestedBlock", parentType: "GRID_ZONE", childType: "CARD" },
    commentOnSuccess: "Grid 안에 Card를 넣으면 여러 정보를 일정한 칸으로 정리할 수 있습니다.",
  },
  {
    id: "promotion-edit-card-content",
    instantSuccess: false,
    title: "카드 내용을 장점으로 바꿔 보세요",
    description:
      "카드 안의 제목이나 문단을 ‘함께 배워요’, ‘직접 만들어요’ 같은 장점으로 바꿔 보세요.",
    condition: { type: "hasAddedNestedBlock", parentType: "CARD", childType: "H1" },
    commentOnSuccess: "좋습니다. 카드는 하나의 장점이나 정보를 짧게 묶어 보여줄 때 좋습니다.",
  },
  {
    id: "promotion-style-card",
    instantSuccess: false,
    title: "카드를 눈에 띄게 꾸며 보세요",
    description: "카드의 그림자를 바꿔, 중요한 정보가 잘 보이게 만들어 보세요.",
    condition: { type: "hasStyleChanged", blockType: "CARD", styleKey: "shadow" },
    commentOnSuccess:
      "배경색과 그림자는 CSS 스타일입니다. 중요한 정보를 시각적으로 강조할 때 사용할 수 있습니다.",
  },
  {
    id: "promotion-add-activity-list",
    title: "활동 안내 목록을 만들어 보세요",
    description: "모임 시간, 장소, 준비물처럼 반복되는 정보를 목록으로 정리해 보세요.",
    condition: {
      type: "hasStructure",
      parentType: "LIST",
      directChildType: "LIST_ITEM",
      minChildren: 1,
    },
    commentOnSuccess:
      "목록은 HTML에서 ul과 li 구조로 표현됩니다. 일정, 준비물, 특징처럼 반복되는 정보를 정리하기 좋습니다.",
  },
  {
    id: "promotion-add-faq-container",
    title: "FAQ 구역을 만들어 보세요",
    description: "방문자가 궁금해할 질문을 모아 둘 구역을 추가해 보세요.",
    condition: { type: "hasAddedBlock", blockType: "CONTAINER", min: 3 },
    commentOnSuccess:
      "FAQ는 자주 묻는 질문을 미리 정리해 방문자의 궁금증을 줄여 주는 구역입니다.",
  },
  {
    id: "promotion-add-faq-toggle",
    title: "접었다 펼칠 수 있는 질문을 만들어 보세요",
    description:
      "FAQ 구역에 Toggle 블록을 추가해 질문과 답변을 접었다 펼칠 수 있게 만들어 보세요.",
    condition: { type: "hasAddedBlock", blockType: "TOGGLE_ZONE" },
    commentOnSuccess: "Toggle은 클릭했을 때 숨겨진 내용을 보여주는 인터랙티브한 블록입니다.",
  },
  {
    id: "promotion-edit-faq-answer",
    instantSuccess: false,
    title: "FAQ 답변을 수정해 보세요",
    description: "Toggle 안의 답변 내용을 실제 질문에 맞게 바꿔 보세요.",
    condition: { type: "hasAddedNestedBlock", parentType: "TOGGLE_ZONE", childType: "P" },
    commentOnSuccess:
      "좋습니다. 방문자가 궁금해할 내용을 미리 답해 주면 홍보 페이지가 더 친절해집니다.",
  },
  {
    id: "promotion-view-preview",
    title: "미리보기에서 홍보 페이지를 확인해 보세요",
    description:
      "오른쪽 미리보기 탭을 눌러 지금 만든 홍보 페이지가 어떻게 보이는지 확인해 보세요.",
    condition: { type: "uiSignal", signal: "previewOpened" },
    commentOnSuccess:
      "좋습니다. 미리보기는 블록으로 만든 페이지가 실제 화면에서 어떻게 보일지 보여줍니다.",
  },
  {
    id: "promotion-view-code",
    title: "코드 보기에서 구조를 확인해 보세요",
    description:
      "코드 보기 탭을 눌러 첫인상 구역, Grid, Card, FAQ가 HTML 구조로 어떻게 표현되는지 확인해 보세요.",
    condition: { type: "uiSignal", signal: "codeViewOpened" },
    commentOnSuccess:
      "잘 했어요. 지금 만든 홍보 페이지의 블록 구조가 실제 HTML 코드로 변환된 모습을 확인했습니다.",
  },
] as const satisfies readonly TutorialMission[];

export const invitationTutorialMissions = [
  {
    id: "invitation-add-main-container",
    title: "초대장 구역을 만들어 보세요",
    description: "초대장의 내용을 담을 일반 구역을 추가해 보세요.",
    condition: { type: "hasAddedBlock", blockType: "CONTAINER" },
    commentOnSuccess:
      "좋습니다. 구역은 초대장의 제목, 설명, 이미지 같은 내용을 하나로 묶어 줍니다.",
  },
  {
    id: "invitation-add-heading",
    title: "초대 제목을 넣어 보세요",
    description: "초대장 구역 안에 제목 블록을 넣어 보세요.",
    condition: { type: "hasAddedNestedBlock", parentType: "CONTAINER", childType: "H1" },
    commentOnSuccess: "제목은 초대장의 분위기와 목적을 가장 먼저 알려주는 역할을 합니다.",
  },
  {
    id: "invitation-edit-heading",
    instantSuccess: false,
    title: "제목을 초대 문구로 바꿔 보세요",
    description:
      "예를 들어 ‘당신을 초대합니다’ 또는 ‘우리의 특별한 모임에 함께해요’처럼 바꿔 보세요.",
    condition: { type: "hasContentChanged", blockType: "H1" },
    commentOnSuccess:
      "좋습니다. 초대 문구는 방문자가 페이지의 분위기를 바로 느끼게 해 줍니다.",
  },
  {
    id: "invitation-add-paragraph",
    title: "초대 문장을 추가해 보세요",
    description: "초대장 구역 안에 본문 블록을 추가해, 어떤 자리인지 짧게 설명해 보세요.",
    condition: { type: "hasAddedNestedBlock", parentType: "CONTAINER", childType: "P" },
    commentOnSuccess: "본문은 제목만으로 부족한 내용을 조금 더 자세히 설명해 줍니다.",
  },
  {
    id: "invitation-edit-paragraph",
    instantSuccess: false,
    title: "초대 문장을 직접 써 보세요",
    description: "방문자가 초대받았다는 느낌을 받을 수 있도록 문장을 바꿔 보세요.",
    condition: { type: "hasContentChanged", blockType: "P" },
    commentOnSuccess:
      "좋습니다. 초대장은 정보를 전달하는 동시에 분위기를 만드는 글이기도 합니다.",
  },
  {
    id: "invitation-add-image",
    title: "분위기 이미지를 추가해 보세요",
    description: "초대장 구역에 이미지 블록을 추가해 초대장의 분위기를 보여주세요.",
    condition: { type: "hasAddedBlock", blockType: "IMAGE" },
    commentOnSuccess: "이미지는 초대장의 분위기를 빠르게 전달하는 데 도움이 됩니다.",
  },
  {
    id: "invitation-edit-image-source",
    instantSuccess: false,
    title: "이미지 주소를 바꿔 보세요",
    description:
      "이미지 블록의 주소를 초대장 분위기와 어울리는 이미지 URL로 바꿔 보세요.",
    condition: { type: "hasAttributeChanged", blockType: "IMAGE", field: "src" },
    commentOnSuccess: "img 태그는 src 속성에 적힌 주소에서 이미지를 불러옵니다.",
  },
  {
    id: "invitation-add-divider",
    title: "구분선을 추가해 보세요",
    description: "제목과 안내 정보를 나누기 위해 구분선 블록을 추가해 보세요.",
    condition: { type: "hasAddedBlock", blockType: "HR" },
    commentOnSuccess:
      "구분선은 HTML에서 hr 태그로 표현됩니다. 내용의 흐름을 나눌 때 사용합니다.",
  },
  {
    id: "invitation-add-details-container",
    title: "행사 안내 구역을 만들어 보세요",
    description: "날짜, 장소, 준비물을 정리할 새 일반 구역을 추가해 보세요.",
    condition: { type: "hasAddedBlock", blockType: "CONTAINER", min: 2 },
    commentOnSuccess:
      "페이지를 여러 구역으로 나누면 초대받은 사람이 필요한 정보를 더 쉽게 찾을 수 있습니다.",
  },
  {
    id: "invitation-add-details-list",
    title: "일정과 장소를 목록으로 정리해 보세요",
    description:
      "행사 안내 구역에 목록을 추가해 날짜, 장소, 준비물 같은 정보를 정리해 보세요.",
    condition: {
      type: "hasStructure",
      parentType: "LIST",
      directChildType: "LIST_ITEM",
      minChildren: 1,
    },
    commentOnSuccess:
      "목록은 HTML에서 ul과 li 구조로 표현됩니다. 날짜, 장소, 준비물처럼 반복되는 정보를 정리하기 좋습니다.",
  },
  {
    id: "invitation-style-background",
    instantSuccess: false,
    title: "초대장 배경색을 바꿔 보세요",
    description: "초대장 구역의 배경색을 바꿔 원하는 분위기를 만들어 보세요.",
    condition: { type: "hasStyleChanged", blockType: "CONTAINER", styleKey: "bgColor" },
    commentOnSuccess:
      "배경색은 CSS 스타일로 표현됩니다. 같은 내용도 색에 따라 분위기가 달라집니다.",
  },
  {
    id: "invitation-style-padding",
    instantSuccess: false,
    title: "초대장 안쪽 여백을 조절해 보세요",
    description:
      "초대장 구역의 안쪽 여백을 조절해 내용이 더 편하게 보이도록 만들어 보세요.",
    condition: { type: "hasStyleChanged", blockType: "CONTAINER", styleKey: "paddingSize" },
    commentOnSuccess:
      "안쪽 여백은 CSS의 padding입니다. 내용과 테두리 사이에 숨 쉴 공간을 만들어 줍니다.",
  },
  {
    id: "invitation-add-toggle",
    title: "자세한 안내를 접어 둘 수 있게 만들어 보세요",
    description:
      "자세한 안내 구역에 Toggle 블록을 추가해, 필요한 사람이 펼쳐 볼 수 있게 만들어 보세요.",
    condition: { type: "hasAddedBlock", blockType: "TOGGLE_ZONE" },
    commentOnSuccess:
      "Toggle은 길게 보이면 부담스러운 안내를 접어 두었다가 필요할 때 펼쳐 보여줄 수 있습니다.",
  },
  {
    id: "invitation-edit-toggle-content",
    instantSuccess: false,
    title: "접힌 안내 내용을 수정해 보세요",
    description:
      "Toggle 안의 답변 내용을 준비물, 오시는 길, 드레스코드 같은 안내 문구로 바꿔 보세요.",
    condition: {
      type: "hasNestedContentChanged",
      parentType: "TOGGLE_ZONE",
      childTypes: ["P"],
    },
    commentOnSuccess:
      "좋습니다. 접힌 안내를 사용하면 화면은 깔끔하게 유지하면서 필요한 정보를 숨겨 둘 수 있습니다.",
  },
  {
    id: "invitation-add-password-zone",
    title: "비밀 메시지 구역을 추가해 보세요",
    description:
      "Password Zone을 추가해 비밀번호를 입력해야 열리는 특별한 메시지를 만들어 보세요.",
    condition: { type: "hasAddedBlock", blockType: "PASSWORD_ZONE" },
    commentOnSuccess:
      "비밀번호 구역은 정답을 입력했을 때만 숨겨진 내용을 보여주는 인터랙티브한 블록입니다.",
  },
  {
    id: "invitation-edit-password-answer",
    instantSuccess: false,
    title: "비밀번호 정답을 정해 보세요",
    description: "비밀 메시지를 열 수 있는 비밀번호 정답을 정해 보세요.",
    condition: {
      type: "hasAttributeChanged",
      blockType: "PASSWORD_ZONE",
      field: "correctAnswer",
    },
    commentOnSuccess:
      "좋습니다. 이 값은 사용자가 입력한 비밀번호와 비교되는 정답 역할을 합니다.",
  },
  {
    id: "invitation-edit-secret-message",
    instantSuccess: false,
    title: "비밀 메시지를 수정해 보세요",
    description:
      "비밀번호를 맞혔을 때 보이는 특별 메시지를 실제 초대장 내용에 맞게 바꿔 보세요.",
    condition: {
      type: "hasNestedContentChanged",
      parentType: "PASSWORD_ZONE",
      childTypes: ["H1", "P"],
      childField: "conditionalChildren",
    },
    commentOnSuccess:
      "잘 했어요. 비밀번호를 맞혔을 때만 보이는 내용은 숨겨진 특별 메시지처럼 사용할 수 있습니다.",
  },
  {
    id: "invitation-add-link",
    title: "참석 링크를 추가해 보세요",
    description: "참석 여부를 알려주거나 더 자세한 정보를 볼 수 있는 링크를 추가해 보세요.",
    condition: { type: "hasAddedBlock", blockType: "A" },
    commentOnSuccess: "링크는 초대받은 사람이 다음 행동으로 넘어갈 수 있게 도와줍니다.",
  },
  {
    id: "invitation-edit-link-address",
    instantSuccess: false,
    title: "링크 주소를 입력해 보세요",
    description: "링크가 이동할 주소를 입력해 보세요.",
    condition: { type: "hasAttributeChanged", blockType: "A", field: "link" },
    commentOnSuccess: "a 태그는 href 속성에 적힌 주소로 이동합니다.",
  },
  {
    id: "invitation-view-preview",
    title: "미리보기에서 초대장을 확인해 보세요",
    description:
      "오른쪽 미리보기 탭을 눌러 초대장이 어떻게 보이는지 확인해 보세요. 가능하면 Toggle과 Password Zone도 직접 눌러 보세요.",
    condition: { type: "uiSignal", signal: "previewOpened" },
    commentOnSuccess:
      "좋습니다. 미리보기에서는 초대장의 화면과 인터랙션을 함께 확인할 수 있습니다.",
  },
  {
    id: "invitation-view-code",
    title: "코드 보기에서 구조를 확인해 보세요",
    description:
      "코드 보기 탭을 눌러 초대장 구조와 비밀번호 구역이 HTML/JavaScript로 어떻게 표현되는지 확인해 보세요.",
    condition: { type: "uiSignal", signal: "codeViewOpened" },
    commentOnSuccess:
      "잘 했어요. 초대장 페이지의 블록 구조와 인터랙션이 실제 HTML과 JavaScript 코드로 연결되는 모습을 확인했습니다.",
  },
] as const satisfies readonly TutorialMission[];
