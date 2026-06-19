import type { EditableFieldDefinition } from "../types/editableField.types";

export const headingContentField: EditableFieldDefinition = {
  path: "content",
  label: "제목 내용",
  control: "text",
  section: "content",
};

export const paragraphContentField: EditableFieldDefinition = {
  path: "content",
  label: "본문 내용",
  control: "text",
  section: "content",
};

export const linkTextField: EditableFieldDefinition = {
  path: "content",
  label: "링크 글자",
  control: "text",
  section: "content",
};

export const linkHrefField: EditableFieldDefinition = {
  path: "link",
  label: "링크 주소",
  control: "url",
  section: "behavior",
};

export const imageSrcField: EditableFieldDefinition = {
  path: "src",
  label: "이미지 주소",
  control: "url",
  section: "content",
};

export const correctAnswerField: EditableFieldDefinition = {
  path: "correctAnswer",
  label: "정답",
  control: "text",
  section: "behavior",
};

export const commonStyleFields: EditableFieldDefinition[] = [
  {
    path: "styles.textAlign",
    label: "글자 정렬",
    control: "select",
    section: "text",
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
    section: "text",
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
    section: "text",
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
    section: "background",
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
    section: "text",
    defaultValue: false,
  },
  {
    path: "styles.isRounded",
    label: "둥근 모서리",
    control: "checkbox",
    section: "border",
    defaultValue: false,
  },
];

export const gridColumnField: EditableFieldDefinition = {
  path: "styles.gridCols",
  label: "자동 배치 열 수",
  control: "select",
  section: "layout",
  defaultValue: 2,
  options: [
    { label: "한 줄 2개", value: 2 },
    { label: "한 줄 3개", value: 3 },
    { label: "한 줄 4개", value: 4 },
  ],
};
