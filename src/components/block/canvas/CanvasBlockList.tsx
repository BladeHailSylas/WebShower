import type { MouseEvent } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { HtmlBlock } from "../../../types/types";
import CanvasBlockItem from "./CanvasBlockItem";

interface CanvasBlockListProps {
  blocks: HtmlBlock[];
  activeStyleId: string | null;
  onStyleClick: (event: MouseEvent, id: string) => void;
}

export default function CanvasBlockList({ blocks, activeStyleId, onStyleClick }: CanvasBlockListProps) {
  return (
    <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
      {blocks.map((block) => (
        <CanvasBlockItem key={block.id} block={block} activeStyleId={activeStyleId} onStyleClick={onStyleClick} />
      ))}
    </SortableContext>
  );
}
