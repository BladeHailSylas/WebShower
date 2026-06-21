import type { LearningTemplate } from "../types/learningTemplate.types";

export const learningTemplates: LearningTemplate[] = [
  {
    id: "profile-card",
    title: "자기소개 카드",
    description: "사진과 소개 글, 링크를 한 장의 카드로 구성합니다.",
    learningPoints: ["카드 안에 블록 중첩하기", "이미지와 링크 연결하기"],
    blocks: [
      {
        id: "profile-card-root",
        type: "CARD",
        styles: {
          className: "mx-auto w-full max-w-md p-6 bg-white border border-slate-200 rounded-2xl shadow-lg text-center",
        },
        children: [
          {
            id: "profile-title",
            type: "H1",
            content: "안녕하세요, 웹 개발자 XXX입니다!",
            styles: { className: "mb-4 text-2xl font-black text-slate-900" },
          },
          {
            id: "profile-image",
            type: "IMAGE",
            src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
            styles: { className: "mb-4 h-56 w-full rounded-xl object-cover" },
          },
          {
            id: "profile-description",
            type: "P",
            content: "그림 그리기와 코딩을 좋아해요. 제가 만든 프로젝트를 함께 구경해 보세요.",
            styles: { className: "mb-4 text-sm leading-relaxed text-slate-600" },
          },
          {
            id: "profile-link",
            type: "A",
            content: "내 프로젝트 보러 가기",
            link: "https://example.com",
            styles: { className: "inline-block rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white no-underline" },
          },
        ],
      },
    ],
  },
  {
    id: "two-column-introduction",
    title: "2열 소개 섹션",
    description: "Grid 안에 두 개의 카드를 나란히 배치합니다.",
    learningPoints: ["Grid의 열 수 이해하기", "직접 자식을 Grid Item으로 배치하기"],
    blocks: [
      {
        id: "two-column-grid",
        type: "GRID_ZONE",
        styles: { className: "w-full", gridCols: 2 },
        children: [
          {
            id: "two-column-left-card",
            type: "CARD",
            styles: { className: "h-full p-5 rounded-xl border border-blue-200 bg-blue-50" },
            children: [
              {
                id: "two-column-left-title",
                type: "H1",
                content: "내가 좋아하는 것",
                styles: { className: "mb-3 text-xl font-black text-blue-900" },
              },
              {
                id: "two-column-left-image",
                type: "IMAGE",
                src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=800&auto=format&fit=crop",
                styles: { className: "mb-3 h-36 w-full rounded-lg object-cover" },
              },
              {
                id: "two-column-left-copy",
                type: "P",
                content: "색을 섞고 새로운 그림을 만드는 시간이 즐거워요.",
                styles: { className: "text-sm leading-relaxed text-blue-800" },
              },
            ],
          },
          {
            id: "two-column-right-card",
            type: "CARD",
            styles: { className: "h-full p-5 rounded-xl border border-emerald-200 bg-emerald-50" },
            children: [
              {
                id: "two-column-right-title",
                type: "H1",
                content: "내가 배우는 것",
                styles: { className: "mb-3 text-xl font-black text-emerald-900" },
              },
              {
                id: "two-column-right-image",
                type: "IMAGE",
                src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
                styles: { className: "mb-3 h-36 w-full rounded-lg object-cover" },
              },
              {
                id: "two-column-right-copy",
                type: "P",
                content: "HTML 블록을 조립하며 웹페이지의 구조를 배우고 있어요.",
                styles: { className: "text-sm leading-relaxed text-emerald-800" },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "step-by-step-list",
    title: "단계별 안내 목록",
    description: "제목과 설명, 순서가 있는 안내 내용을 하나의 구역으로 구성합니다.",
    learningPoints: ["CONTAINER로 관련 블록 묶기", "목록과 목록 항목의 중첩 구조"],
    blocks: [
      {
        id: "steps-container",
        type: "CONTAINER",
        children: [
          {
            id: "steps-title",
            type: "H1",
            content: "나만의 웹페이지 만드는 순서",
            styles: { className: "mb-2 text-2xl font-black text-slate-900" },
          },
          {
            id: "steps-description",
            type: "P",
            content: "작은 단계부터 하나씩 완성해 보세요.",
            styles: { className: "mb-4 text-slate-600" },
          },
          {
            id: "steps-list",
            type: "LIST",
            styles: { className: "space-y-3 rounded-xl border border-slate-200 bg-white p-5 pl-10 shadow-sm list-decimal" },
            children: [
              {
                id: "steps-item-one",
                type: "LIST_ITEM",
                styles: { className: "font-bold text-slate-800" },
                children: [
                  { id: "steps-item-one-copy", type: "P", content: "전하고 싶은 주제를 정해요.", styles: { className: "text-slate-700" } },
                ],
              },
              {
                id: "steps-item-two",
                type: "LIST_ITEM",
                styles: { className: "font-bold text-slate-800" },
                children: [
                  { id: "steps-item-two-copy", type: "P", content: "제목과 문단 블록을 배치해요.", styles: { className: "text-slate-700" } },
                ],
              },
              {
                id: "steps-item-three",
                type: "LIST_ITEM",
                styles: { className: "font-bold text-slate-800" },
                children: [
                  { id: "steps-item-three-copy", type: "P", content: "미리보기와 코드 보기를 비교해요.", styles: { className: "text-slate-700" } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "faq-toggle-section",
    title: "FAQ 여닫기 섹션",
    description: "질문과 답변을 여닫는 두 개의 FAQ 항목을 만듭니다.",
    learningPoints: ["항상 보이는 내용과 조건부 내용 구분하기", "여닫기 동작을 HTML로 확인하기"],
    blocks: [
      {
        id: "faq-container",
        type: "CONTAINER",
        children: [
          {
            id: "faq-title",
            type: "H1",
            content: "자주 묻는 질문",
            styles: { className: "mb-4 text-2xl font-black text-slate-900" },
          },
          {
            id: "faq-first",
            type: "TOGGLE_ZONE",
            styles: { className: "mb-3 w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm" },
            defaultChildren: [
              { id: "faq-first-question", type: "P", content: "블록은 어떻게 이동하나요?", styles: { className: "font-bold text-slate-900" } },
            ],
            conditionalChildren: [
              { id: "faq-first-answer", type: "P", content: "블록의 드래그 손잡이를 잡고 원하는 위치로 옮기면 됩니다.", styles: { className: "text-sm leading-relaxed text-slate-600" } },
            ],
          },
          {
            id: "faq-second",
            type: "TOGGLE_ZONE",
            styles: { className: "w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm" },
            defaultChildren: [
              { id: "faq-second-question", type: "P", content: "만든 코드는 어디에서 보나요?", styles: { className: "font-bold text-slate-900" } },
            ],
            conditionalChildren: [
              { id: "faq-second-answer", type: "P", content: "오른쪽 미리보기의 코드 보기 탭에서 현재 HTML을 확인할 수 있습니다.", styles: { className: "text-sm leading-relaxed text-slate-600" } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "password-secret-content",
    title: "비밀번호 잠금 콘텐츠",
    description: "비밀번호를 맞히기 전과 후의 콘텐츠를 다르게 구성합니다.",
    learningPoints: ["두 조건부 child field 비교하기", "입력과 조건에 따른 화면 변화 관찰하기"],
    blocks: [
      {
        id: "secret-root",
        type: "PASSWORD_ZONE",
        correctAnswer: "web123",
        styles: { className: "mx-auto w-full max-w-md rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-md" },
        defaultChildren: [
          { id: "secret-hint-title", type: "H1", content: "비밀 상자", styles: { className: "mb-2 text-xl font-black text-violet-900" } },
          { id: "secret-hint", type: "P", content: "힌트: web + 숫자 123을 입력해 보세요.", styles: { className: "text-sm text-violet-700" } },
        ],
        conditionalChildren: [
          { id: "secret-title", type: "H1", content: "축하합니다!", styles: { className: "mb-3 text-2xl font-black text-emerald-700" } },
          {
            id: "secret-image",
            type: "IMAGE",
            src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
            styles: { className: "mb-3 h-48 w-full rounded-xl object-cover" },
          },
          { id: "secret-copy", type: "P", content: "조건을 만족하면 숨겨진 블록들이 화면에 나타납니다.", styles: { className: "mb-3 text-sm text-slate-600" } },
          { id: "secret-link", type: "A", content: "HTML 조건부 출력 더 알아보기", link: "https://developer.mozilla.org/ko/docs/Web/HTML", styles: { className: "font-bold text-indigo-600 underline" } },
        ],
      },
    ],
  },
  {
    id: "main-slider-section",
    title: "메인 슬라이더",
    description: "두 장의 슬라이드를 넘기며 서로 다른 콘텐츠를 보여줍니다.",
    learningPoints: ["슬라이더와 슬라이드 항목의 부모·자식 관계", "여러 화면을 한 영역에 배치하기"],
    blocks: [
      {
        id: "slider-root",
        type: "SLIDER_ZONE",
        styles: {
          className: "w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg text-slate-900",
          sliderHeight: "lg",
        },
        children: [
          {
            id: "slider-first-slide",
            type: "SLIDE_ITEM",
            styles: { className: "w-full p-5 text-center" },
            children: [
              { id: "slider-first-title", type: "H1", content: "상상을 화면으로", styles: { className: "mb-3 text-2xl font-black text-slate-900" } },
              {
                id: "slider-first-image",
                type: "IMAGE",
                src: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1000&auto=format&fit=crop",
                styles: { className: "mb-3 h-56 w-full rounded-xl object-cover" },
              },
              { id: "slider-first-copy", type: "P", content: "블록을 조립해 아이디어를 웹페이지로 표현해 보세요.", styles: { className: "text-slate-600" } },
            ],
          },
          {
            id: "slider-second-slide",
            type: "SLIDE_ITEM",
            styles: { className: "w-full p-5 text-center" },
            children: [
              { id: "slider-second-title", type: "H1", content: "코드와 친해지기", styles: { className: "mb-3 text-2xl font-black text-slate-900" } },
              {
                id: "slider-second-image",
                type: "IMAGE",
                src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000&auto=format&fit=crop",
                styles: { className: "mb-3 h-56 w-full rounded-xl object-cover" },
              },
              { id: "slider-second-copy", type: "P", content: "미리보기와 HTML을 비교하면 블록 구조가 코드로 보입니다.", styles: { className: "text-slate-600" } },
            ],
          },
        ],
      },
    ],
  },
];
