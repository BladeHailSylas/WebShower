import type { HtmlBlock, StyleProps } from "../../../../types/types";

export type EditableFieldPath =
  | keyof Pick<HtmlBlock, "content" | "src" | "link" | "correctAnswer">
  | `styles.${keyof StyleProps}`;

export type EditableFieldControl = "select" | "checkbox" | "text" | "url";

export interface EditableFieldOption {
  label: string;
  value: string | number | boolean;
}

export interface EditableFieldDefinition {
  path: EditableFieldPath;
  label: string;
  control: EditableFieldControl;
  defaultValue?: string | number | boolean;
  options?: EditableFieldOption[];
}
