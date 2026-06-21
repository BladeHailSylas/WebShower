import type { BlockType, HtmlBlock } from "../../../../types/types";

export type BlockChildField = "children" | "defaultChildren" | "conditionalChildren";

export type ChildFieldVariant =
  | "container"
  | "grid"
  | "password-default"
  | "password-conditional"
  | "toggle-default"
  | "toggle-conditional";

export interface ChildFieldAppendAction {
  label: string;
  blockType: BlockType;
}

export interface ChildFieldDefinition {
  field: BlockChildField;
  label: string;
  emptyLabel: string;
  variant: ChildFieldVariant;
  sortable: "vertical" | "grid";
  acceptedBlockTypes?: BlockType[];
  appendAction?: ChildFieldAppendAction;
  itemLabelPrefix?: string;
  getItems?: (block: HtmlBlock) => HtmlBlock[] | undefined;
}
