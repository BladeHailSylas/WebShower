import type { BlockDefinition } from "../types/blockDefinition.types";
import { commonStyleFields, linkHrefField, linkTextField } from "./editableFieldPresets";

export const linkDefinition = {
  type: "A",
  label: "링크",
  category: "interactive",
  categoryLabel: "기능 요소",
  template: {
    id: "template-link",
    type: "A",
    content: "",
    link: "",
    styles: { className: "mb-2 text-slate-800" },
  },
  palette: { label: "링크 이동 버튼 만들기 (A)", icon: "A", order: 30 },
  childFields: [],
  editableFields: [linkTextField, linkHrefField, ...commonStyleFields],
  dropPolicy: { allowRoot: true },
  dragPreview: { label: "링크", contentField: "content" },
  htmlSchema: { tag: "a", contentField: "content", hrefField: "link" },
} satisfies BlockDefinition;
