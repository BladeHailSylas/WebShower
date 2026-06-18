import type { BlockDefinition } from "../types/blockDefinition.types";
import { listItemContentField } from "./editableFieldPresets";

export const listItemDefinition = {
  type: "LIST_ITEM",
  label: "목록 항목",
  category: "internal",
  categoryLabel: "내부 요소",
  internal: true,
  template: {
    id: "template-list-item",
    type: "LIST_ITEM",
    content: "목록 항목",
    styles: { className: "text-slate-800" },
  },
  palette: { label: "목록 항목", hidden: true, order: 999 },
  childFields: [],
  editableFields: [listItemContentField],
  dropPolicy: { internalOnly: true, allowRoot: false, allowedParentTypes: ["LIST"] },
  dragPreview: { label: "목록 항목", contentField: "content" },
  htmlSchema: { tag: "li", contentField: "content" },
} satisfies BlockDefinition;
