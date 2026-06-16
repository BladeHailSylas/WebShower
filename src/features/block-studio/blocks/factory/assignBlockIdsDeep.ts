import type { HtmlBlock } from "../../../../types/types";
import { getExistingChildFields } from "../tree/blockChildFields";

function createBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function assignBlockIdsDeep(block: HtmlBlock): HtmlBlock {
  return getExistingChildFields(block).reduce<HtmlBlock>(
    (nextBlock, field) => {
      const children = nextBlock[field];
      return children
        ? { ...nextBlock, [field]: children.map((child) => assignBlockIdsDeep(child)) }
        : nextBlock;
    },
    { ...block, id: createBlockId() },
  );
}
