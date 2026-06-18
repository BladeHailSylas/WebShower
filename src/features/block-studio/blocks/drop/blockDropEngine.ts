import type { BlockType, HtmlBlock } from "../../../../types/types";
import { getBlockDefinition } from "../definitions";
import { createBlockFromDefinition } from "../factory/createBlockFromDefinition";
import {
  findBlockById,
  findBlockLocationById,
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

function canUseChildField(parent: HtmlBlock | undefined, field: BlockChildField, movingBlock: HtmlBlock): boolean {
  if (!parent) return false;
  const parentDefinition = getBlockDefinition(parent.type);
  if (!(parentDefinition.dropPolicy.childFields?.includes(field) ?? false)) return false;

  const fieldDefinition = parentDefinition.childFields.find((candidate) => candidate.field === field);
  if (fieldDefinition?.acceptedBlockTypes && !fieldDefinition.acceptedBlockTypes.includes(movingBlock.type)) {
    return false;
  }

  const allowedParentTypes = getBlockDefinition(movingBlock.type).dropPolicy.allowedParentTypes;
  return !allowedParentTypes || allowedParentTypes.includes(parent.type);
}

function canUseRoot(movingBlock: HtmlBlock): boolean {
  const policy = getBlockDefinition(movingBlock.type).dropPolicy;
  if (policy.allowRoot === false) return false;
  return !policy.allowedParentTypes;
}

function canInsertBeforeTarget(blocks: HtmlBlock[], targetId: string, movingBlock: HtmlBlock): boolean {
  const location = findBlockLocationById(blocks, targetId);
  if (!location) return false;
  if (!location.parent || !location.field) return canUseRoot(movingBlock);
  return canUseChildField(location.parent, location.field, movingBlock);
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
    if (!canInsertBeforeTarget(nextBlocks, overId, movingBlock)) return blocks;
    return replaceBlockById(nextBlocks, overId, movingBlock);
  }

  if (target.kind === "root") {
    if (!canUseRoot(movingBlock)) return blocks;
    return [...nextBlocks, movingBlock];
  }

  if (target.kind === "child-field") {
    const parent = findBlockById(nextBlocks, target.blockId);
    if (!canUseChildField(parent, target.field, movingBlock)) return blocks;
    return insertBlockIntoChildField(nextBlocks, target.blockId, target.field, movingBlock);
  }

  if (!canInsertBeforeTarget(nextBlocks, target.blockId, movingBlock)) return blocks;
  nextBlocks = insertBlockBeforeTarget(nextBlocks, target.blockId, movingBlock);
  return nextBlocks;
}
