import type { BlockDefinition } from "../types/blockDefinition.types";
import { commonStyleFields } from "./editableFieldPresets";

export const headingDefinition = {
  type: "H1",
  label: "제목",
  category: "basic",
  categoryLabel: "일반 요소",
  template: {
    id: "template-heading",
    type: "H1",
    content: "",
    styles: { className: "mb-2 text-slate-800" },
  },
  palette: { label: "제목 넣기 (H1)", icon: "H1", order: 10 },
  childFields: [],
  editableFields: commonStyleFields,
  dropPolicy: { allowRoot: true },
  dragPreview: { label: "제목", contentField: "content" },
  htmlSchema: { tag: "h1", contentField: "content" },
} satisfies BlockDefinition;
