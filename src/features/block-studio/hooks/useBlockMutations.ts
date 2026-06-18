import type { Dispatch, SetStateAction } from "react";
import type { BlockType, HtmlBlock } from "../../../types/types";
import { createBlockFromDefinition } from "../blocks/factory/createBlockFromDefinition";
import {
  insertBlockIntoChildField,
  removeBlockById,
  updateBlockById,
} from "../blocks/tree/blockTreeOperations";
import type { BlockChildField } from "../blocks/types/childField.types";

export function useBlockMutations(setBlocks: Dispatch<SetStateAction<HtmlBlock[]>>) {
  const updateBlock = (blockId: string, fields: Partial<HtmlBlock>) => {
    setBlocks((prev) => updateBlockById(prev, blockId, (block) => ({ ...block, ...fields })));
  };

  const deleteBlock = (blockId: string) => {
    setBlocks((prev) => removeBlockById(prev, blockId));
  };

  const appendBlockToChildField = (parentId: string, field: BlockChildField, blockType: BlockType) => {
    const block = createBlockFromDefinition(blockType);
    setBlocks((prev) => insertBlockIntoChildField(prev, parentId, field, block));
  };

  return {
    updateBlock,
    deleteBlock,
    appendBlockToChildField,
  };
}
