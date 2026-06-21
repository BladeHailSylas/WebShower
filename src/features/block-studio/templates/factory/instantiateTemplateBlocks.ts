import type { HtmlBlock } from "../../../../types/types";
import { assignBlockIdsDeep } from "../../blocks/factory/assignBlockIdsDeep";

export function instantiateTemplateBlocks(blocks: HtmlBlock[]): HtmlBlock[] {
  return structuredClone(blocks).map((block) => assignBlockIdsDeep(block));
}
