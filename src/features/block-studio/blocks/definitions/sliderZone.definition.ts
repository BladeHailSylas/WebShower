import type { BlockDefinition } from "../types/blockDefinition.types";
import { commonStyleFields, marginSizeField, paddingSizeField } from "./editableFieldPresets";

export const sliderZoneDefinition = {
  type: "SLIDER_ZONE",
  label: "슬라이더 구역",
  category: "interactive",
  categoryLabel: "기능 요소",
  template: {
    id: "template-slider-zone",
    type: "SLIDER_ZONE",
    children: [],
    styles: {
      className: "relative w-full  overflow-hidden rounded-xl border border-slate-200 shadow-sm text-slate-900",
    },
  },
  palette: { label: "슬라이더 구역 만들기", icon: "SLIDE", order: 40 },
  childFields: [
    {
      field: "children",
      label: "슬라이드",
      emptyLabel: "슬라이드가 없습니다",
      variant: "container",
      sortable: "vertical",
      acceptedBlockTypes: ["SLIDE_ITEM"],
      appendAction: { label: "슬라이드 추가", blockType: "SLIDE_ITEM" },
      itemLabelPrefix: "슬라이드",
    },
  ],
  editableFields: [...commonStyleFields, paddingSizeField, marginSizeField],
  dropPolicy: { acceptsChildren: true, childFields: ["children"], allowRoot: true },
  dragPreview: { label: "슬라이더 구역" },
  htmlExporterKey: "sliderZone",
} satisfies BlockDefinition;
