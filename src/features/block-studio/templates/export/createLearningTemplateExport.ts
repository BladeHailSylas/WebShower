import type { HtmlBlock } from "../../../../types/types";
import { knownChildFields } from "../../blocks/tree/blockChildFields";
import type { LearningTemplate } from "../types/learningTemplate.types";

const TEMPLATE_EXPORT_ID = "사용자 지정 ID";

function createTemplateBlockId(index: number): string {
  return `${TEMPLATE_EXPORT_ID}-block-${index}`;
}

function assignTemplateBlockIds(block: HtmlBlock, nextIndex: { value: number }): HtmlBlock {
  const blockWithId: HtmlBlock = {
    ...block,
    id: createTemplateBlockId(nextIndex.value),
  };
  nextIndex.value += 1;

  return knownChildFields.reduce<HtmlBlock>((nextBlock, field) => {
    const children = nextBlock[field];
    if (!children) return nextBlock;

    return {
      ...nextBlock,
      [field]: children.map((child) => assignTemplateBlockIds(child, nextIndex)),
    };
  }, blockWithId);
}

export function createLearningTemplateExport(blocks: HtmlBlock[]): LearningTemplate {
  const nextIndex = { value: 1 };

  return {
    id: TEMPLATE_EXPORT_ID,
    title: "사용자 지정 타이틀",
    description: "사용자 지정 설명",
    learningPoints: ["사용자 지정 학습 포인트"],
    blocks: structuredClone(blocks).map((block) => assignTemplateBlockIds(block, nextIndex)),
  };
}
