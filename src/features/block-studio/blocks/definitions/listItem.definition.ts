import type { BlockDefinition } from "../types/blockDefinition.types";
import { commonStyleFields, paddingSizeField } from "./editableFieldPresets";

export const listItemDefinition = {
  type: "LIST_ITEM",
  label: "목록 항목",
  category: "internal",
  categoryLabel: "내부 요소",
  internal: true,
  template: {
    id: "template-list-item",
    type: "LIST_ITEM",
    children: [],
    styles: { className: "text-slate-800" },
  },
  palette: { label: "목록 항목", hidden: true, order: 999 },
  childFields: [
    {
      field: "children",
      label: "목록 항목 내용",
      emptyLabel: "이 항목 안에 블록을 넣으세요",
      variant: "container",
      sortable: "vertical",
      acceptedBlockTypes: ["H1", "P", "IMAGE", "A", "HR", "CARD", "CONTAINER"],
    },
  ],
  editableFields: [...commonStyleFields, paddingSizeField],
  dropPolicy: {
    acceptsChildren: true,
    childFields: ["children"],
    internalOnly: true,
    allowRoot: false,
    allowedParentTypes: ["LIST"],
  },
  dragPreview: { label: "목록 항목" },
  htmlSchema: { tag: "li", childField: "children" },
} satisfies BlockDefinition;
