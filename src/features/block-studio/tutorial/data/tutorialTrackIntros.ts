import type { TutorialTrackIntro } from "../types/tutorial.types";

export const blockStudioBasicsIntro = {
  summary:
    "자기소개 페이지를 만들면서 구역, 제목, 문단, 이미지, 카드, 목록, 링크가 HTML 구조로 어떻게 이어지는지 확인합니다.",
  learningPoints: [
    "웹 페이지의 기본적인 구조 알아보기",
    "일반 구역 안에 제목, 문단, 이미지를 넣어 나만의 페이지 만들기",
    "스타일 창에서 구역 이름과 여백, 배경색 바꾸기",
    "카드와 목록으로 관심사를 정리하기",
    "미리보기와 코드 보기에서 블록이 HTML로 바뀌는 모습 확인하기",
  ],
  previewBlocks: [
    {
      id: "tutorial-preview-basics-intro-container",
      type: "CONTAINER",
      containerName: "소개 구역",
      styles: {
        className:
          "mx-auto flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-lg",
      },
      children: [
        {
          id: "tutorial-preview-basics-title",
          type: "H1",
          content: "안녕하세요, 저는 OO입니다",
          styles: { className: "text-2xl font-black text-slate-900" },
        },
        {
          id: "tutorial-preview-basics-image",
          type: "IMAGE",
          src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=640&auto=format&fit=crop",
          styles: { className: "h-40 w-full rounded-xl object-cover" },
        },
        {
          id: "tutorial-preview-basics-paragraph",
          type: "P",
          content:
            "블록으로 웹페이지를 만들면서 내가 좋아하는 것과 배우고 싶은 것을 소개합니다.",
          styles: { className: "text-sm leading-relaxed text-slate-600" },
        },
      ],
    },
    {
      id: "tutorial-preview-basics-card",
      type: "CARD",
      styles: {
        className:
          "mx-auto w-full max-w-sm rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-slate-800 shadow-sm",
      },
      children: [
        {
          id: "tutorial-preview-basics-card-title",
          type: "H1",
          content: "제가 좋아하는 것",
          styles: { className: "mb-2 text-lg font-black text-emerald-950" },
        },
        {
          id: "tutorial-preview-basics-list",
          type: "LIST",
          styles: { className: "list-disc space-y-1 pl-5 text-sm text-emerald-900" },
          children: [
            {
              id: "tutorial-preview-basics-list-item-1",
              type: "LIST_ITEM",
              children: [
                {
                  id: "tutorial-preview-basics-list-item-1-text",
                  type: "P",
                  content: "새로운 기술 배우기",
                  styles: { className: "text-sm" },
                },
              ],
            },
            {
              id: "tutorial-preview-basics-list-item-2",
              type: "LIST_ITEM",
              children: [
                {
                  id: "tutorial-preview-basics-list-item-2-text",
                  type: "P",
                  content: "직접 만든 결과물 공유하기",
                  styles: { className: "text-sm" },
                },
              ],
            },
          ],
        },
        {
          id: "tutorial-preview-basics-link",
          type: "A",
          content: "더 알아보기",
          link: "https://example.com",
          styles: { className: "mt-3 inline-block text-sm font-bold text-emerald-700 underline" },
        },
      ],
    },
  ],
} satisfies TutorialTrackIntro;

export const promotionPageIntro = {
  summary:
    "홍보 페이지를 만들면서 첫인상 구역, 장점 카드, FAQ를 나누고 방문자가 다음 행동을 할 수 있는 링크를 배치합니다.",
  learningPoints: [
    "첫인상 구역에 제목, 소개 문장, 대표 이미지 넣기",
    "Grid와 Card로 여러 장점을 나란히 보여주기",
    "FAQ 구역에 Toggle을 넣어 접었다 펼치는 질문 만들기",
    "링크로 신청하기나 더 알아보기 같은 다음 행동 연결하기",
  ],
  previewBlocks: [
    {
      id: "tutorial-preview-promotion-hero",
      type: "CONTAINER",
      containerName: "첫인상 구역",
      styles: {
        className:
          "mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl bg-slate-900 p-5 text-white shadow-lg",
      },
      children: [
        {
          id: "tutorial-preview-promotion-title",
          type: "H1",
          content: "함께 만드는 웹 제작 모임",
          styles: { className: "text-2xl font-black text-white" },
        },
        {
          id: "tutorial-preview-promotion-text",
          type: "P",
          content:
            "처음이어도 괜찮아요. 블록으로 직접 페이지를 만들며 웹 구조를 배워 봅니다.",
          styles: { className: "text-sm leading-relaxed text-slate-200" },
        },
        {
          id: "tutorial-preview-promotion-image",
          type: "IMAGE",
          src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=640&auto=format&fit=crop",
          styles: { className: "h-36 w-full rounded-xl object-cover" },
        },
        {
          id: "tutorial-preview-promotion-link",
          type: "A",
          content: "참여 신청하기",
          link: "https://example.com",
          styles: {
            className:
              "inline-flex w-fit rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-emerald-950 no-underline",
          },
        },
      ],
    },
    {
      id: "tutorial-preview-promotion-benefits",
      type: "CONTAINER",
      containerName: "장점 구역",
      styles: { className: "mx-auto w-full max-w-md rounded-2xl bg-white p-4 text-slate-800" },
      children: [
        {
          id: "tutorial-preview-promotion-benefits-title",
          type: "H1",
          content: "이런 점을 배워요",
          styles: { className: "mb-3 text-lg font-black text-slate-900" },
        },
        {
          id: "tutorial-preview-promotion-grid",
          type: "GRID_ZONE",
          styles: { className: "w-full", gridCols: 2 },
          children: [
            {
              id: "tutorial-preview-promotion-card-1",
              type: "CARD",
              styles: { className: "rounded-xl border border-slate-200 bg-slate-50 p-3" },
              children: [
                {
                  id: "tutorial-preview-promotion-card-1-title",
                  type: "H1",
                  content: "함께 배워요",
                  styles: { className: "text-sm font-black text-slate-900" },
                },
                {
                  id: "tutorial-preview-promotion-card-1-text",
                  type: "P",
                  content: "막히는 부분을 같이 해결합니다.",
                  styles: { className: "mt-1 text-xs text-slate-600" },
                },
              ],
            },
            {
              id: "tutorial-preview-promotion-card-2",
              type: "CARD",
              styles: { className: "rounded-xl border border-slate-200 bg-slate-50 p-3" },
              children: [
                {
                  id: "tutorial-preview-promotion-card-2-title",
                  type: "H1",
                  content: "직접 만들어요",
                  styles: { className: "text-sm font-black text-slate-900" },
                },
                {
                  id: "tutorial-preview-promotion-card-2-text",
                  type: "P",
                  content: "결과물을 바로 확인합니다.",
                  styles: { className: "mt-1 text-xs text-slate-600" },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "tutorial-preview-promotion-faq",
      type: "CONTAINER",
      containerName: "FAQ 구역",
      styles: { className: "mx-auto w-full max-w-md rounded-2xl bg-emerald-50 p-4" },
      children: [
        {
          id: "tutorial-preview-promotion-toggle-ein",
          type: "TOGGLE_ZONE",
          styles: { className: "rounded-xl border border-emerald-100 bg-white p-3" },
          defaultChildren: [
            {
              id: "tutorial-preview-promotion-toggle-question-ein",
              type: "P",
              content: "어떤 것을 만드나요?",
              styles: { className: "text-sm font-bold text-slate-800" },
            },
          ],
          conditionalChildren: [
            {
              id: "tutorial-preview-promotion-toggle-answer-ein",
              type: "P",
              content: "튜토리얼을 따라 추천 페이지를 만들거나, 내가 원하는 대로 직접 만들어보세요.",
              styles: { className: "text-sm text-slate-600" },
            },
          ],
        },
        {
          id: "tutorial-preview-promotion-toggle-zwei",
          type: "TOGGLE_ZONE",
          styles: { className: "rounded-xl border border-emerald-100 bg-white p-3" },
          defaultChildren: [
            {
              id: "tutorial-preview-promotion-toggle-question-zwei",
              type: "P",
              content: "처음이어도 참여할 수 있나요?",
              styles: { className: "text-sm font-bold text-slate-800" },
            },
          ],
          conditionalChildren: [
            {
              id: "tutorial-preview-promotion-toggle-answer-zwei",
              type: "P",
              content: "네. 블록을 하나씩 조립하며 천천히 따라갑니다.",
              styles: { className: "text-sm text-slate-600" },
            },
          ],
        },
      ],
    },
  ],
} satisfies TutorialTrackIntro;

export const invitationPageIntro = {
  summary:
    "초대장 페이지를 만들면서 초대 문구, 행사 안내, 접히는 안내, 비밀번호로 여는 비밀 메시지를 구성합니다.",
  learningPoints: [
    "초대장 구역에 제목, 설명, 분위기 이미지 넣기",
    "행사 안내 구역에 날짜와 장소를 목록으로 정리하기",
    "Toggle로 자세한 안내를 접어 두기",
    "Password Zone으로 비밀 메시지 만들기",
  ],
  previewBlocks: [
    {
      id: "tutorial-preview-invitation-main",
      type: "CONTAINER",
      containerName: "초대장 구역",
      styles: {
        className:
          "mx-auto flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-rose-100 bg-rose-50 p-5 text-slate-800 shadow-lg",
      },
      children: [
        {
          id: "tutorial-preview-invitation-title",
          type: "H1",
          content: "작은 축하 모임에 초대합니다",
          styles: { className: "text-2xl font-black text-rose-950" },
        },
        {
          id: "tutorial-preview-invitation-text",
          type: "P",
          content: "소중한 사람들과 함께 따뜻한 시간을 보내고 싶어요.",
          styles: { className: "text-sm leading-relaxed text-rose-900" },
        },
        {
          id: "tutorial-preview-invitation-image",
          type: "IMAGE",
          src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=640&auto=format&fit=crop",
          styles: { className: "h-40 w-full rounded-xl object-cover" },
        },
        {
          id: "tutorial-preview-invitation-divider",
          type: "HR",
          styles: { className: "border-rose-200" },
        },
      ],
    },
    {
      id: "tutorial-preview-invitation-details",
      type: "CONTAINER",
      containerName: "행사 안내 구역",
      styles: { className: "mx-auto w-full max-w-sm rounded-2xl bg-white p-4 text-slate-800" },
      children: [
        {
          id: "tutorial-preview-invitation-details-title",
          type: "H1",
          content: "행사 안내",
          styles: { className: "mb-2 text-lg font-black text-slate-900" },
        },
        {
          id: "tutorial-preview-invitation-list",
          type: "LIST",
          styles: { className: "list-disc space-y-1 pl-5 text-sm text-slate-700" },
          children: [
            {
              id: "tutorial-preview-invitation-list-item-1",
              type: "LIST_ITEM",
              children: [
                {
                  id: "tutorial-preview-invitation-list-item-1-text",
                  type: "P",
                  content: "토요일 오후 3시",
                  styles: { className: "text-sm" },
                },
              ],
            },
            {
              id: "tutorial-preview-invitation-list-item-2",
              type: "LIST_ITEM",
              children: [
                {
                  id: "tutorial-preview-invitation-list-item-2-text",
                  type: "P",
                  content: "햇살 카페 2층",
                  styles: { className: "text-sm" },
                },
              ],
            },
          ],
        },
        {
          id: "tutorial-preview-invitation-toggle-uno",
          type: "TOGGLE_ZONE",
          styles: { className: "mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3" },
          defaultChildren: [
            {
              id: "tutorial-preview-invitation-toggle-question-uno",
              type: "P",
              content: "어떤 행사인가요?",
              styles: { className: "text-sm font-bold text-slate-800" },
            },
          ],
          conditionalChildren: [
            {
              id: "tutorial-preview-invitation-toggle-answer-uno",
              type: "P",
              content: "함께 먹고 마시면서 시간을 보내는 행사입니다.",
              styles: { className: "text-sm text-slate-600" },
            },
          ],
        },
        {
          id: "tutorial-preview-invitation-toggle-due",
          type: "TOGGLE_ZONE",
          styles: { className: "mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3" },
          defaultChildren: [
            {
              id: "tutorial-preview-invitation-toggle-question-due",
              type: "P",
              content: "준비물이 있나요?",
              styles: { className: "text-sm font-bold text-slate-800" },
            },
          ],
          conditionalChildren: [
            {
              id: "tutorial-preview-invitation-toggle-answer-due",
              type: "P",
              content: "편한 마음과 작은 축하 인사만 가져오세요.",
              styles: { className: "text-sm text-slate-600" },
            },
          ],
        },
      ],
    },
    {
      id: "tutorial-preview-invitation-secret",
      type: "PASSWORD_ZONE",
      correctAnswer: "party",
      styles: { className: "mx-auto w-full max-w-sm rounded-2xl border border-rose-100 bg-white p-4" },
      defaultChildren: [
        {
          id: "tutorial-preview-invitation-secret-default",
          type: "P",
          content: "비밀번호(party)를 입력하면 비밀 메시지가 열립니다.",
          styles: { className: "text-sm text-slate-600" },
        },
      ],
      conditionalChildren: [
        {
          id: "tutorial-preview-invitation-secret-message",
          type: "P",
          content: "비말 메시지: 특별 선물을 드립니다🎁",
          styles: { className: "text-sm font-bold text-rose-800" },
        },
      ],
    },
    {
      id: "tutorial-preview-invitation-link",
      type: "A",
      content: "참석 여부 알려주기",
      link: "https://example.com",
      styles: {
        className:
          "mx-auto block w-fit rounded-full bg-rose-500 px-4 py-2 text-sm font-black text-white no-underline",
      },
    },
  ],
} satisfies TutorialTrackIntro;
