import type { BlockDefinition } from "../types/blockDefinition.types";
import { commonStyleFields } from "./editableFieldPresets";

export const cardDefinition = {
  type: "CARD",
  label: "카드",
  category: "structure",
  categoryLabel: "구조 요소",
  template: {
    id: "template-card",
    type: "CARD",
    styles: { className: "p-5 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-800" },
    children: [],
  },
  palette: { label: "카드 만들기", icon: "CARD", order: 30 },
  childFields: [
    {
      field: "children",
      label: "카드 내용",
      emptyLabel: "카드 안에 요소를 드롭하세요",
      variant: "container",
      sortable: "vertical",
    },
  ],
  editableFields: commonStyleFields,
  dropPolicy: { acceptsChildren: true, childFields: ["children"], allowRoot: true },
  dragPreview: { label: "카드" },
  htmlSchema: { tag: "div", childField: "children" },
} satisfies BlockDefinition;
