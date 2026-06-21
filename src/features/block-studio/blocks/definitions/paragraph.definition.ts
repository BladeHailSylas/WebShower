import type { BlockDefinition } from "../types/blockDefinition.types";
import {
  commonStyleFields,
  marginSizeField,
  paragraphContentField,
  typographyDetailFields,
} from "./editableFieldPresets";

export const paragraphDefinition = {
  type: "P",
  label: "문단",
  category: "basic",
  categoryLabel: "일반 요소",
  template: {
    id: "template-paragraph",
    type: "P",
    content: "",
    styles: { className: "mb-2 text-slate-800" },
  },
  palette: { label: "문단 넣기 (P)", icon: "P", order: 20 },
  childFields: [],
  editableFields: [paragraphContentField, ...commonStyleFields, ...typographyDetailFields, marginSizeField],
  dropPolicy: { allowRoot: true },
  dragPreview: { label: "문단", contentField: "content" },
  htmlSchema: { tag: "p", contentField: "content" },
} satisfies BlockDefinition;
