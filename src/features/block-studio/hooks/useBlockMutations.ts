import type { Dispatch, SetStateAction } from "react";
import type { HtmlBlock } from "../../../types/types";
import { removeBlockById, updateBlockById } from "../blocks/tree/blockTreeOperations";

export function useBlockMutations(setBlocks: Dispatch<SetStateAction<HtmlBlock[]>>) {
  const updateBlock = (blockId: string, fields: Partial<HtmlBlock>) => {
    setBlocks((prev) => updateBlockById(prev, blockId, (block) => ({ ...block, ...fields })));
  };

  const deleteBlock = (blockId: string) => {
    setBlocks((prev) => removeBlockById(prev, blockId));
  };

  return {
    updateBlock,
    deleteBlock,
  };
}
