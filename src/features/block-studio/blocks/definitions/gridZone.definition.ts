import type { BlockDefinition } from "../types/blockDefinition.types";
import { commonStyleFields, gridColumnField } from "./editableFieldPresets";

export const gridZoneDefinition = {
  type: "GRID_ZONE",
  label: "바둑판 구역",
  category: "structure",
  categoryLabel: "구조 요소",
  template: {
    id: "template-grid-zone",
    type: "GRID_ZONE",
    styles: {
      className: "border border-slate-200 rounded-xl p-4 bg-white shadow-sm",
      gridCols: 2,
    },
    children: [],
  },
  palette: { label: "바둑판 구역 만들기", icon: "GRID", order: 20 },
  childFields: [
    {
      field: "children",
      label: "바둑판 요소",
      emptyLabel: "블록을 놓으세요",
      variant: "grid",
      sortable: "grid",
    },
  ],
  editableFields: [...commonStyleFields, gridColumnField],
  dropPolicy: { acceptsChildren: true, childFields: ["children"], allowRoot: true },
  dragPreview: { label: "바둑판 구역" },
  htmlSchema: { tag: "div", childField: "children" },
} satisfies BlockDefinition;
