import type { BlockDefinition } from "../types/blockDefinition.types";
import { commonStyleFields, marginSizeField, paddingSizeField } from "./editableFieldPresets";

export const listDefinition = {
  type: "LIST",
  label: "목록",
  category: "structure",
  categoryLabel: "구조 요소",
  template: {
    id: "template-list",
    type: "LIST",
    styles: { className: "mb-2 list-disc space-y-1 pl-5 text-slate-800" },
    children: [
      {
        id: "template-list-item-1",
        type: "LIST_ITEM",
        children: [],
        styles: { className: "text-slate-800" },
      },
      {
        id: "template-list-item-2",
        type: "LIST_ITEM",
        children: [],
        styles: { className: "text-slate-800" },
      },
      {
        id: "template-list-item-3",
        type: "LIST_ITEM",
        children: [],
        styles: { className: "text-slate-800" },
      },
    ],
  },
  palette: { label: "목록 만들기 (UL)", icon: "UL", order: 40 },
  childFields: [
    {
      field: "children",
      label: "목록 항목",
      emptyLabel: "목록 항목이 없습니다",
      variant: "container",
      sortable: "vertical",
      acceptedBlockTypes: ["LIST_ITEM"],
      appendAction: { label: "항목 추가", blockType: "LIST_ITEM" },
    },
  ],
  editableFields: [...commonStyleFields, paddingSizeField, marginSizeField],
  dropPolicy: { acceptsChildren: true, childFields: ["children"], allowRoot: true },
  dragPreview: { label: "목록" },
  htmlSchema: { tag: "ul", childField: "children" },
} satisfies BlockDefinition;
