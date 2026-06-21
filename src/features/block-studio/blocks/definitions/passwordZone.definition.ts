import type { BlockDefinition } from "../types/blockDefinition.types";
import {
  commonStyleFields,
  correctAnswerField,
  marginSizeField,
  paddingSizeField,
} from "./editableFieldPresets";

export const passwordZoneDefinition = {
  type: "PASSWORD_ZONE",
  label: "비밀번호 구역",
  category: "interactive",
  categoryLabel: "기능 요소",
  template: {
    id: "template-password-zone",
    type: "PASSWORD_ZONE",
    correctAnswer: "12345",
    styles: { className: "border border-slate-200 rounded-xl p-4 bg-white shadow-sm w-full max-w-md mx-auto" },
    defaultChildren: [],
    conditionalChildren: [],
  },
  palette: { label: "비밀번호 구역 만들기", icon: "PW", order: 20 },
  childFields: [
    {
      field: "defaultChildren",
      label: "잠겼을 때 보여줄 요소",
      emptyLabel: "블록을 놓으세요",
      variant: "password-default",
      sortable: "vertical",
    },
    {
      field: "conditionalChildren",
      label: "비밀번호가 맞을 때 보여줄 요소",
      emptyLabel: "블록을 놓으세요",
      variant: "password-conditional",
      sortable: "vertical",
    },
  ],
  editableFields: [correctAnswerField, ...commonStyleFields, paddingSizeField, marginSizeField],
  dropPolicy: {
    acceptsChildren: true,
    childFields: ["defaultChildren", "conditionalChildren"],
    allowRoot: true,
  },
  dragPreview: { label: "비밀번호 구역" },
  htmlExporterKey: "passwordZone",
} satisfies BlockDefinition;
