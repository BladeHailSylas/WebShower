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

export const containerNameField: EditableFieldDefinition = {
  path: "containerName",
  label: "구역 이름",
  control: "text",
  section: "content",
  defaultValue: "",
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

export const shadowField: EditableFieldDefinition = {
  path: "styles.shadow",
  label: "그림자",
  control: "select",
  section: "border",
  defaultValue: "default",
  options: [
    { label: "기본", value: "default" },
    { label: "없음", value: "none" },
    { label: "작게", value: "small" },
    { label: "보통", value: "medium" },
    { label: "크게", value: "large" },
  ],
};

export const roundedField: EditableFieldDefinition = {
  path: "styles.rounded",
  label: "둥근 모서리",
  control: "select",
  section: "border",
  defaultValue: "default",
  options: [
    { label: "기본", value: "default" },
    { label: "각지게", value: "none" },
    { label: "조금 둥글게", value: "small" },
    { label: "둥글게", value: "medium" },
    { label: "많이 둥글게", value: "large" },
    { label: "완전히 둥글게", value: "full" },
  ],
};

export const borderWidthField: EditableFieldDefinition = {
  path: "styles.borderWidth",
  label: "테두리 굵기",
  control: "select",
  section: "border",
  defaultValue: "default",
  options: [
    { label: "기본", value: "default" },
    { label: "없음", value: "none" },
    { label: "얇게", value: "thin" },
    { label: "보통", value: "medium" },
    { label: "두껍게", value: "thick" },
  ],
};

export const borderColorField: EditableFieldDefinition = {
  path: "styles.borderColor",
  label: "테두리 색상",
  control: "select",
  section: "border",
  defaultValue: "default",
  options: [
    { label: "기본", value: "default" },
    { label: "회색", value: "slate" },
    { label: "검정색", value: "black" },
    { label: "빨간색", value: "red" },
    { label: "파란색", value: "blue" },
    { label: "초록색", value: "green" },
  ],
};

export const paddingSizeField: EditableFieldDefinition = {
  path: "styles.paddingSize",
  label: "안쪽 여백",
  control: "select",
  section: "advanced",
  defaultValue: "default",
  options: [
    { label: "기본", value: "default" },
    { label: "없음", value: "none" },
    { label: "작게", value: "sm" },
    { label: "보통", value: "md" },
    { label: "크게", value: "lg" },
    { label: "아주 크게", value: "xl" },
  ],
};

export const marginSizeField: EditableFieldDefinition = {
  path: "styles.marginSize",
  label: "바깥 여백",
  control: "select",
  section: "advanced",
  defaultValue: "default",
  options: [
    { label: "기본", value: "default" },
    { label: "없음", value: "none" },
    { label: "작게", value: "sm" },
    { label: "보통", value: "md" },
    { label: "크게", value: "lg" },
    { label: "아주 크게", value: "xl" },
  ],
};

export const sliderHeightField: EditableFieldDefinition = {
  path: "styles.sliderHeight",
  label: "슬라이더 높이",
  control: "select",
  section: "layout",
  defaultValue: "default",
  options: [
    { label: "기본", value: "default" },
    { label: "낮게", value: "sm" },
    { label: "보통", value: "md" },
    { label: "높게", value: "lg" },
    { label: "아주 높게", value: "xl" },
  ],
};

export const listStyleField: EditableFieldDefinition = {
  path: "styles.listStyle",
  label: "목록 기호",
  control: "select",
  section: "text",
  defaultValue: "disk",
  options: [
    { label: "원", value: "disk" },
    { label: "사각형", value: "square" },
    { label: "없음", value: "none" },
  ],
};

export const hrBorderFields: EditableFieldDefinition[] = [
  { ...borderWidthField, label: "선 굵기" },
  { ...borderColorField, label: "선 색상" },
];

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
  shadowField,
  roundedField,
  borderWidthField,
  borderColorField,
];

export const typographyDetailFields: EditableFieldDefinition[] = [
  {
    path: "styles.fontFamily",
    label: "글꼴",
    control: "select",
    section: "text",
    defaultValue: "default",
    options: [
      { label: "기본", value: "default" },
      { label: "고딕체", value: "sans" },
      { label: "명조체", value: "serif" },
      { label: "고정폭 글꼴", value: "mono" },
    ],
  },
  {
    path: "styles.lineHeight",
    label: "줄 간격",
    control: "select",
    section: "text",
    defaultValue: "default",
    options: [
      { label: "기본", value: "default" },
      { label: "좁게", value: "tight" },
      { label: "보통", value: "normal" },
      { label: "넓게", value: "relaxed" },
      { label: "아주 넓게", value: "loose" },
    ],
  },
  {
    path: "styles.letterSpacing",
    label: "글자 간격",
    control: "select",
    section: "text",
    defaultValue: "default",
    options: [
      { label: "기본", value: "default" },
      { label: "좁게", value: "tight" },
      { label: "보통", value: "normal" },
      { label: "넓게", value: "wide" },
    ],
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
  ],
};
