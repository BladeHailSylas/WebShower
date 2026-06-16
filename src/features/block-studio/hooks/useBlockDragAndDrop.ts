import { useState, type Dispatch, type SetStateAction } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { BlockType, HtmlBlock } from "../../../types/types";
import { getBlockDefinition } from "../blocks/definitions";
import { blockDropEngine } from "../blocks/drop/blockDropEngine";

interface ActiveDragState {
  blockType: BlockType | null;
  label: string | null;
  block: HtmlBlock | null;
}

const emptyActiveDrag: ActiveDragState = {
  blockType: null,
  label: null,
  block: null,
};

export function useBlockDragAndDrop(setBlocks: Dispatch<SetStateAction<HtmlBlock[]>>) {
  const [activeDrag, setActiveDrag] = useState<ActiveDragState>(emptyActiveDrag);

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;

    if (data?.type === "CANVAS_ITEM") {
      const block = data.block as HtmlBlock;
      setActiveDrag({
        block,
        blockType: block.type,
        label: getBlockDefinition(block.type).dragPreview.label,
      });
      return;
    }

    if (data?.type === "PALETTE_ITEM") {
      const blockType = data.blockType as BlockType;
      setActiveDrag({
        block: null,
        blockType,
        label: data.label as string,
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const data = active.data.current;
    setActiveDrag(emptyActiveDrag);

    if (!over || active.id === over.id) return;

    setBlocks((prev) =>
      blockDropEngine({
        blocks: prev,
        activeId: String(active.id),
        overId: String(over.id),
        isPaletteItem: data?.type === "PALETTE_ITEM",
        blockType: data?.blockType as BlockType | undefined,
      }),
    );
  };

  return {
    activeDrag,
    handleDragStart,
    handleDragEnd,
  };
}
