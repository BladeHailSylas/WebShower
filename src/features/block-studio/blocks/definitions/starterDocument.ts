import type { HtmlBlock } from "../../../../types/types";
import { instantiateTemplateBlocks } from "../../templates/factory/instantiateTemplateBlocks";

const starterBlocks: HtmlBlock[] = [
  {
    id: "starter-wrapper",
    type: "CONTAINER",
    styles: {
      className:
        "max-w-sm mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center text-center",
    },
    children: [
      {
        id: "starter-title",
        type: "H1",
        content: "코딩 크리에이티브 스튜디오",
        styles: { className: "text-2xl font-black text-slate-800 tracking-tight mb-4" },
      },
      {
        id: "starter-image",
        type: "IMAGE",
        src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
        styles: { className: "w-full h-48 object-cover rounded-xl shadow-inner mb-5" },
      },
      {
        id: "starter-desc",
        type: "P",
        content:
          "블록을 조립하여 나만의 웹사이트를 만들어보세요. 오늘 만든 작품은 스마트폰에 저장해 부모님께 자랑해볼까요?",
        styles: { className: "text-sm text-slate-500 leading-relaxed font-medium" },
      },
    ],
  },
];

export function createStarterDocument(): HtmlBlock[] {
  return instantiateTemplateBlocks(starterBlocks);
}
