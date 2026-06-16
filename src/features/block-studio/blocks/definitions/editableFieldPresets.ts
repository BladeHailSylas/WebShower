import type { EditableFieldDefinition } from "../types/editableField.types";

export const commonStyleFields: EditableFieldDefinition[] = [
  {
    path: "styles.textAlign",
    label: "글자 정렬",
    control: "select",
    defaultValue: "left",
    options: [
      { label: "왼쪽 정렬", value: "left" },
      { label: "가운데 정렬", value: "center" },
      { label: "오른쪽 정렬", value: "right" },
    ],
  },
  {
    path: "styles.textColor",
    label: "글자 색상",
    control: "select",
    defaultValue: "black",
    options: [
      { label: "검정색", value: "black" },
      { label: "회색", value: "gray" },
      { label: "빨간색", value: "red" },
      { label: "파란색", value: "blue" },
      { label: "초록색", value: "green" },
    ],
  },
  {
    path: "styles.fontSize",
    label: "글자 크기",
    control: "select",
    defaultValue: "normal",
    options: [
      { label: "작게", value: "small" },
      { label: "보통", value: "normal" },
      { label: "크게", value: "large" },
      { label: "아주 크게", value: "xlarge" },
    ],
  },
  {
    path: "styles.bgColor",
    label: "배경 색상",
    control: "select",
    defaultValue: "none",
    options: [
      { label: "배경 없음", value: "none" },
      { label: "하얀색", value: "white" },
      { label: "연한 회색", value: "slate" },
      { label: "연한 빨강", value: "red" },
      { label: "연한 파랑", value: "blue" },
      { label: "연한 초록", value: "green" },
      { label: "연한 노랑", value: "yellow" },
    ],
  },
  {
    path: "styles.isBold",
    label: "굵게",
    control: "checkbox",
    defaultValue: false,
  },
  {
    path: "styles.isRounded",
    label: "둥근 모서리",
    control: "checkbox",
    defaultValue: false,
  },
];

export const gridColumnField: EditableFieldDefinition = {
  path: "styles.gridCols",
  label: "가로 칸수",
  control: "select",
  defaultValue: 2,
  options: [
    { label: "가로 2칸", value: 2 },
    { label: "가로 3칸", value: 3 },
    { label: "가로 4칸", value: 4 },
  ],
};
