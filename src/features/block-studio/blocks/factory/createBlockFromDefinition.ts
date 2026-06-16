import type { BlockType, HtmlBlock } from "../../../../types/types";
import { getBlockDefinition } from "../definitions";
import { assignBlockIdsDeep } from "./assignBlockIdsDeep";

export function createBlockFromDefinition(type: BlockType): HtmlBlock {
  const template = structuredClone(getBlockDefinition(type).template);
  return assignBlockIdsDeep(template);
}
