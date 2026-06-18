import type { BlockType, HtmlBlock } from "../../../../types/types";

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
  acceptedBlockTypes?: BlockType[];
  getItems?: (block: HtmlBlock) => HtmlBlock[] | undefined;
}
