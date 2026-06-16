import type { BlockChildField } from "../types/childField.types";

export const CANVAS_ROOT_DROP_ID = "canvas-droppable";

const childFieldPrefixes: Record<BlockChildField, string> = {
  children: "droppable-container",
  defaultChildren: "droppable-default",
  conditionalChildren: "droppable-conditional",
};

export function createChildFieldDropId(blockId: string, field: BlockChildField): string {
  return `${childFieldPrefixes[field]}-${blockId}`;
}

export function getChildFieldDropPrefix(field: BlockChildField): string {
  return `${childFieldPrefixes[field]}-`;
}
