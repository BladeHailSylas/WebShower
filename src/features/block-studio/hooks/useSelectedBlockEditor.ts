import { useRef, useState, type MouseEvent } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { HtmlBlock } from "../../../types/types";
import { findBlockById } from "../blocks/tree/blockTreeOperations";
import { useBlockMutations } from "./useBlockMutations";

export function useSelectedBlockEditor(
  blocks: HtmlBlock[],
  setBlocks: Dispatch<SetStateAction<HtmlBlock[]>>,
) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [lineStart, setLineStart] = useState({ x: 0, y: 0 });
  const { updateBlock, deleteBlock, appendBlockToChildField } = useBlockMutations(setBlocks);

  const selectedBlock = selectedBlockId ? findBlockById(blocks, selectedBlockId) : undefined;
  const popupPos = { x: lineStart.x + 180, y: Math.max(20, lineStart.y - 60) };

  const selectBlock = (event: MouseEvent, blockId: string) => {
    event.stopPropagation();
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      return;
    }

    if (canvasRef.current) {
      const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setLineStart({
        x: buttonRect.right - canvasRect.left,
        y: buttonRect.top + buttonRect.height / 2 - canvasRect.top,
      });
    }

    setSelectedBlockId(blockId);
  };

  const clearSelection = () => setSelectedBlockId(null);

  const updateSelectedBlock = (fields: Partial<HtmlBlock>) => {
    if (!selectedBlockId) return;
    updateBlock(selectedBlockId, fields);
  };

  const deleteSelectedBlock = () => {
    if (!selectedBlockId) return;
    deleteBlock(selectedBlockId);
    setSelectedBlockId(null);
  };

  return {
    canvasRef,
    selectedBlockId,
    selectedBlock,
    lineStart,
    popupPos,
    selectBlock,
    clearSelection,
    updateSelectedBlock,
    deleteSelectedBlock,
    appendBlockToChildField,
  };
}
