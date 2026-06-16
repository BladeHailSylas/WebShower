import type { HtmlBlock } from "../../../../types/types";

export type BlockChildField = "children" | "defaultChildren" | "conditionalChildren";

export type ChildFieldVariant =
  | "container"
  | "grid"
  | "password-default"
  | "password-conditional"
  | "toggle-default"
  | "toggle-conditional";

export interface ChildFieldDefinition {
  field: BlockChildField;
  label: string;
  emptyLabel: string;
  variant: ChildFieldVariant;
  sortable: "vertical" | "grid";
  getItems?: (block: HtmlBlock) => HtmlBlock[] | undefined;
}
