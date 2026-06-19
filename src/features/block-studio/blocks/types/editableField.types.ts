import type { HtmlBlock, StyleProps } from "../../../../types/types";

export type EditableFieldPath =
  | keyof Pick<HtmlBlock, "content" | "src" | "link" | "correctAnswer">
  | `styles.${keyof StyleProps}`;

export type EditableFieldControl = "select" | "checkbox" | "text" | "url";

export type EditableFieldSection =
  | "content"
  | "text"
  | "background"
  | "spacing"
  | "border"
  | "layout"
  | "behavior"
  | "advanced";

export interface EditableFieldOption {
  label: string;
  value: string | number | boolean;
}

export interface EditableFieldDefinition {
  path: EditableFieldPath;
  label: string;
  control: EditableFieldControl;
  section: EditableFieldSection;
  defaultValue?: string | number | boolean;
  options?: EditableFieldOption[];
}
