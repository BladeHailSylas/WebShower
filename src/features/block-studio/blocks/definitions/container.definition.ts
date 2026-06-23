import type { BlockDefinition } from "../types/blockDefinition.types";
import {
  commonStyleFields,
  containerNameField,
  marginSizeField,
  paddingSizeField,
} from "./editableFieldPresets";

export const containerDefinition = {
  type: "CONTAINER",
  label: "일반 구역",
  category: "structure",
  categoryLabel: "구조 요소",
  template: {
    id: "template-container",
    type: "CONTAINER",
    containerName: "",
    styles: { className: "mb-2 text-slate-800 w-full" },
    children: [],
  },
  palette: { label: "일반 구역 만들기", icon: "BOX", order: 10 },
  childFields: [
    {
      field: "children",
      label: "하위 요소",
      emptyLabel: "요소를 드롭하여 중첩하세요",
      variant: "container",
      sortable: "vertical",
    },
  ],
  editableFields: [containerNameField, ...commonStyleFields, paddingSizeField, marginSizeField],
  dropPolicy: { acceptsChildren: true, childFields: ["children"], allowRoot: true },
  dragPreview: { label: "일반 구역" },
  htmlSchema: { tag: "div", childField: "children" },
} satisfies BlockDefinition;
