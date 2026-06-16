import type { BlockDefinition } from "../types/blockDefinition.types";
import { commonStyleFields } from "./editableFieldPresets";

export const imageDefinition = {
  type: "IMAGE",
  label: "이미지",
  category: "basic",
  categoryLabel: "일반 요소",
  template: {
    id: "template-image",
    type: "IMAGE",
    src: "",
    styles: { className: "mb-2 text-slate-800" },
  },
  palette: { label: "이미지 넣기 (Image)", icon: "IMG", order: 30 },
  childFields: [],
  editableFields: commonStyleFields,
  dropPolicy: { allowRoot: true },
  dragPreview: { label: "이미지", contentField: "src" },
  htmlSchema: { tag: "img", srcField: "src", selfClosing: true },
} satisfies BlockDefinition;
