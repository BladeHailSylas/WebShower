import type { BlockDefinition } from "../types/blockDefinition.types";

export const spacerDefinition = {
  type: "SPACER",
  label: "스페이서",
  category: "internal",
  categoryLabel: "내부 요소",
  internal: true,
  template: {
    id: "template-spacer",
    type: "SPACER",
    styles: { className: "mb-2 text-slate-800" },
  },
  palette: { label: "스페이서", hidden: true, order: 999 },
  childFields: [],
  editableFields: [],
  dropPolicy: { internalOnly: true },
  dragPreview: { label: "스페이서" },
} satisfies BlockDefinition;
