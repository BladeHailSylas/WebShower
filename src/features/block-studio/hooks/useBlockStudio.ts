import { useCallback, useState } from "react";
import type { HtmlBlock } from "../../../types/types";
import { createStarterDocument } from "../blocks/definitions/starterDocument";
import { instantiateTemplateBlocks } from "../templates/factory/instantiateTemplateBlocks";
import type { LearningTemplate } from "../templates/types/learningTemplate.types";

export function useBlockStudio() {
  const [blocks, setBlocks] = useState<HtmlBlock[]>(() => createStarterDocument());

  const appendLearningTemplate = useCallback((template: LearningTemplate) => {
    const templateBlocks = instantiateTemplateBlocks(template.blocks);
    setBlocks((previous) => [...previous, ...templateBlocks]);
  }, []);

  return {
    blocks,
    setBlocks,
    appendLearningTemplate,
  };
}
