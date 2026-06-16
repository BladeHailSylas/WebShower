import { useState } from "react";
import type { HtmlBlock } from "../../../types/types";
import { createStarterDocument } from "../blocks/definitions/starterDocument";

export function useBlockStudio() {
  const [blocks, setBlocks] = useState<HtmlBlock[]>(() => createStarterDocument());

  return {
    blocks,
    setBlocks,
  };
}
