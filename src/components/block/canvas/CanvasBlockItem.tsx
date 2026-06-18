import type { MouseEvent } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BlockType, HtmlBlock } from "../../../types/types";
import type { BlockChildField } from "../../../features/block-studio/blocks/types/childField.types";
import BlockDragHandle from "./BlockDragHandle";
import BlockEditHandle from "./BlockEditHandle";
import CanvasBlockBody from "./CanvasBlockBody";

interface CanvasBlockItemProps {
  block: HtmlBlock;
  activeStyleId: string | null;
  onStyleClick: (event: MouseEvent, id: string) => void;
  onAppendChild: (parentId: string, field: BlockChildField, blockType: BlockType) => void;
}

export default function CanvasBlockItem({ block, activeStyleId, onStyleClick, onAppendChild }: CanvasBlockItemProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, isDragging } = useSortable({
    id: block.id,
    data: { type: "CANVAS_ITEM", block },
  });
  const isGrid = block.type === "GRID_ZONE";
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : "transform 220ms cubic-bezier(0.2, 0, 0, 1), opacity 220ms ease",
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-2 relative flex items-stretch ${
        isGrid ? "w-full max-w-xl" : "w-max"
      } active:cursor-grabbing group`}
    >
      <BlockDragHandle activatorRef={setActivatorNodeRef} attributes={attributes} listeners={listeners} />
      <CanvasBlockBody
        block={block}
        activeStyleId={activeStyleId}
        onStyleClick={onStyleClick}
        onAppendChild={onAppendChild}
      />
      <BlockEditHandle
        blockId={block.id}
        active={activeStyleId === block.id}
        variant={isGrid ? "grid" : "default"}
        onStyleClick={onStyleClick}
      />
    </div>
  );
}
