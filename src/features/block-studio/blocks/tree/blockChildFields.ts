import type { HtmlBlock } from "../../../../types/types";
import { getBlockDefinition } from "../definitions";
import type { BlockChildField, ChildFieldDefinition } from "../types/childField.types";

export const knownChildFields: BlockChildField[] = [
  "children",
  "defaultChildren",
  "conditionalChildren",
];

export function getChildFieldDefinitions(block: HtmlBlock): ChildFieldDefinition[] {
  return getBlockDefinition(block.type).childFields;
}

export function getChildBlocks(block: HtmlBlock, field: BlockChildField): HtmlBlock[] {
  return block[field] ?? [];
}

export function setChildBlocks(
  block: HtmlBlock,
  field: BlockChildField,
  children: HtmlBlock[],
): HtmlBlock {
  return { ...block, [field]: children };
}

export function getExistingChildFields(block: HtmlBlock): BlockChildField[] {
  const definitionFields = getChildFieldDefinitions(block).map((field) => field.field);
  const adHocFields = knownChildFields.filter((field) => Array.isArray(block[field]));
  return Array.from(new Set([...definitionFields, ...adHocFields]));
}
