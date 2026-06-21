import type { BlockType, HtmlBlock } from "../../../../types/types";
import { getExistingChildFields } from "../../blocks/tree/blockChildFields";
import type { TutorialTreeIndex } from "../types/tutorial.types";

export function buildTutorialTreeIndex(blocks: readonly HtmlBlock[]): TutorialTreeIndex {
  const blocksById = new Map<string, HtmlBlock>();
  const blocksByType = new Map<BlockType, HtmlBlock[]>();
  const directChildrenByParentId = new Map<string, HtmlBlock[]>();

  const visit = (block: HtmlBlock) => {
    blocksById.set(block.id, block);
    blocksByType.set(block.type, [...(blocksByType.get(block.type) ?? []), block]);

    const directChildren = getExistingChildFields(block).flatMap((field) => block[field] ?? []);
    directChildrenByParentId.set(block.id, directChildren);
    directChildren.forEach(visit);
  };

  blocks.forEach(visit);
  return { blocksById, blocksByType, directChildrenByParentId };
}

