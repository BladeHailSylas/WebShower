import type { HtmlBlock } from "../../../../types/types";
import type {
  TutorialBaseline,
  TutorialPropertySnapshot,
} from "../types/tutorial.types";
import { buildTutorialTreeIndex } from "./buildTutorialTreeIndex";

function snapshotBlock(block: HtmlBlock): TutorialPropertySnapshot {
  return {
    content: block.content,
    src: block.src,
    link: block.link,
    correctAnswer: block.correctAnswer,
    styles: {
      bgColor: block.styles?.bgColor,
      bgColorCustom: block.styles?.bgColorCustom,
      textColor: block.styles?.textColor,
      textColorCustom: block.styles?.textColorCustom,
      paddingSize: block.styles?.paddingSize,
      marginSize: block.styles?.marginSize,
      borderColor: block.styles?.borderColor,
      borderColorCustom: block.styles?.borderColorCustom,
      borderWidth: block.styles?.borderWidth,
      shadow: block.styles?.shadow,
      sliderHeight: block.styles?.sliderHeight,
    },
  };
}

export function buildTutorialBaseline(blocks: readonly HtmlBlock[]): TutorialBaseline {
  const tree = buildTutorialTreeIndex(blocks);
  return {
    initialBlockIds: new Set(tree.blocksById.keys()),
    initialBlockById: new Map(
      [...tree.blocksById].map(([blockId, block]) => [blockId, snapshotBlock(block)]),
    ),
  };
}
