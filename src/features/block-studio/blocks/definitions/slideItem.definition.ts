import type { BlockDefinition } from "../types/blockDefinition.types";
import { commonStyleFields, paddingSizeField } from "./editableFieldPresets";

export const slideItemDefinition = {
  type: "SLIDE_ITEM",
  label: "슬라이드 항목",
  category: "internal",
  categoryLabel: "내부 요소",
  internal: true,
  template: {
    id: "template-slide-item",
    type: "SLIDE_ITEM",
    children: [],
    styles: { className: "w-full p-4 text-slate-900" },
  },
  palette: { label: "슬라이드 항목", hidden: true, order: 999 },
  childFields: [
    {
      field: "children",
      label: "슬라이드 내용",
      emptyLabel: "슬라이드 안에 블록을 넣으세요",
      variant: "container",
      sortable: "vertical",
      acceptedBlockTypes: ["H1", "P", "IMAGE", "A", "CARD", "CONTAINER"],
    },
  ],
  editableFields: [...commonStyleFields, paddingSizeField],
  dropPolicy: {
    acceptsChildren: true,
    childFields: ["children"],
    internalOnly: true,
    allowRoot: false,
    allowedParentTypes: ["SLIDER_ZONE"],
  },
  dragPreview: { label: "슬라이드 항목" },
  htmlSchema: { tag: "article", childField: "children" },
} satisfies BlockDefinition;
