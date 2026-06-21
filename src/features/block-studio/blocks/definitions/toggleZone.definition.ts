import type { BlockDefinition } from "../types/blockDefinition.types";
import { commonStyleFields, marginSizeField, paddingSizeField } from "./editableFieldPresets";

export const toggleZoneDefinition = {
  type: "TOGGLE_ZONE",
  label: "여닫는 구역",
  category: "interactive",
  categoryLabel: "기능 요소",
  template: {
    id: "template-toggle-zone",
    type: "TOGGLE_ZONE",
    styles: { className: "border border-slate-200 rounded-xl p-4 bg-white shadow-sm w-full max-w-md mx-auto" },
    defaultChildren: [],
    conditionalChildren: [],
  },
  palette: { label: "여닫는 구역 만들기", icon: "OPEN", order: 10 },
  childFields: [
    {
      field: "defaultChildren",
      label: "항상 보이는 요소",
      emptyLabel: "블록을 놓으세요",
      variant: "toggle-default",
      sortable: "vertical",
    },
    {
      field: "conditionalChildren",
      label: "열렸을 때 보이는 요소",
      emptyLabel: "블록을 놓으세요",
      variant: "toggle-conditional",
      sortable: "vertical",
    },
  ],
  editableFields: [...commonStyleFields, paddingSizeField, marginSizeField],
  dropPolicy: {
    acceptsChildren: true,
    childFields: ["defaultChildren", "conditionalChildren"],
    allowRoot: true,
  },
  dragPreview: { label: "여닫는 구역" },
  htmlExporterKey: "toggleZone",
} satisfies BlockDefinition;
