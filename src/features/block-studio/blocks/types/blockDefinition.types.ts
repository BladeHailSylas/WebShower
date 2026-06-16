import type { BlockType, HtmlBlock } from "../../../../types/types";
import type { ChildFieldDefinition } from "./childField.types";
import type { DropPolicyDefinition } from "./dropPolicy.types";
import type { EditableFieldDefinition } from "./editableField.types";
import type { HtmlExporterKey, HtmlSchemaDefinition } from "./htmlSchema.types";

export interface PaletteMetadata {
  label: string;
  icon?: string;
  hidden?: boolean;
  order: number;
}

export interface DragPreviewDefinition {
  label: string;
  contentField?: "content" | "link" | "src";
}

export interface BlockDefinition {
  type: BlockType;
  label: string;
  category: "structure" | "basic" | "interactive" | "internal";
  categoryLabel: string;
  internal?: boolean;
  template: HtmlBlock;
  palette: PaletteMetadata;
  childFields: ChildFieldDefinition[];
  editableFields: EditableFieldDefinition[];
  dropPolicy: DropPolicyDefinition;
  dragPreview: DragPreviewDefinition;
  htmlSchema?: HtmlSchemaDefinition;
  htmlExporterKey?: HtmlExporterKey;
}
