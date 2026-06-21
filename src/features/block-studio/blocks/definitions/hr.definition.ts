import type { BlockDefinition } from "../types/blockDefinition.types";
import { hrBorderFields, marginSizeField } from "./editableFieldPresets";

export const hrDefinition = {
  type: "HR",
  label: "구분선",
  category: "basic",
  categoryLabel: "일반 요소",
  template: {
    id: "template-hr",
    type: "HR",
    styles: { className: "my-4 border-t border-slate-300" },
  },
  palette: { label: "구분선 넣기 (HR)", icon: "HR", order: 40 },
  childFields: [],
  editableFields: [...hrBorderFields, marginSizeField],
  dropPolicy: { allowRoot: true },
  dragPreview: { label: "구분선" },
  htmlSchema: { tag: "hr", selfClosing: true },
} satisfies BlockDefinition;
