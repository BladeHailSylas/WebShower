import type { MouseEvent } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { BlockType, HtmlBlock } from "../../../types/types";
import type { BlockChildField } from "../../../features/block-studio/blocks/types/childField.types";
import CanvasBlockItem from "./CanvasBlockItem";

interface CanvasBlockListProps {
  blocks: HtmlBlock[];
  activeStyleId: string | null;
  onStyleClick: (event: MouseEvent, id: string) => void;
  onAppendChild: (parentId: string, field: BlockChildField, blockType: BlockType) => void;
}

export default function CanvasBlockList({
  blocks,
  activeStyleId,
  onStyleClick,
  onAppendChild,
}: CanvasBlockListProps) {
  return (
    <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
      {blocks.map((block) => (
        <CanvasBlockItem
          key={block.id}
          block={block}
          isNested={false}
          activeStyleId={activeStyleId}
          onStyleClick={onStyleClick}
          onAppendChild={onAppendChild}
        />
      ))}
    </SortableContext>
  );
}
