import type { BlockType, HtmlBlock } from "../../../../types/types";
import { getBlockDefinition } from "../definitions";
import { createBlockFromDefinition } from "../factory/createBlockFromDefinition";
import {
  findBlockById,
  insertBlockBeforeTarget,
  insertBlockIntoChildField,
  removeBlockById,
  replaceBlockById,
} from "../tree/blockTreeOperations";
import type { BlockChildField } from "../types/childField.types";
import { resolveDropTarget } from "./resolveDropTarget";

interface BlockDropEngineInput {
  blocks: HtmlBlock[];
  activeId: string;
  overId: string;
  isPaletteItem: boolean;
  blockType?: BlockType;
}

function canUseChildField(parent: HtmlBlock | undefined, field: BlockChildField): boolean {
  if (!parent) return false;
  const definition = getBlockDefinition(parent.type);
  return definition.dropPolicy.childFields?.includes(field) ?? false;
}

function isDroppingIntoSelf(movingBlock: HtmlBlock, overId: string): boolean {
  return movingBlock.id === overId || !!findBlockById([movingBlock], overId);
}

export function blockDropEngine({
  blocks,
  activeId,
  overId,
  isPaletteItem,
  blockType,
}: BlockDropEngineInput): HtmlBlock[] {
  const movingBlock = isPaletteItem && blockType ? createBlockFromDefinition(blockType) : findBlockById(blocks, activeId);
  if (!movingBlock) return blocks;
  if (!isPaletteItem && isDroppingIntoSelf(movingBlock, overId)) return blocks;

  let nextBlocks = isPaletteItem ? [...blocks] : removeBlockById(blocks, activeId);
  const target = resolveDropTarget(overId);
  const directTargetBlock = findBlockById(nextBlocks, overId);

  if (directTargetBlock?.type === "SPACER") {
    return replaceBlockById(nextBlocks, overId, movingBlock);
  }

  if (target.kind === "root") {
    return [...nextBlocks, movingBlock];
  }

  if (target.kind === "child-field") {
    const parent = findBlockById(nextBlocks, target.blockId);
    if (!canUseChildField(parent, target.field)) return blocks;
    return insertBlockIntoChildField(nextBlocks, target.blockId, target.field, movingBlock);
  }

  nextBlocks = insertBlockBeforeTarget(nextBlocks, target.blockId, movingBlock);
  return nextBlocks;
}
