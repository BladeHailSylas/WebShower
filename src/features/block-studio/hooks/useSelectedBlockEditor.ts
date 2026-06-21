import { useCallback, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { HtmlBlock } from "../../../types/types";
import { findBlockById } from "../blocks/tree/blockTreeOperations";
import { useBlockMutations } from "./useBlockMutations";

export function useSelectedBlockEditor(
  blocks: HtmlBlock[],
  setBlocks: Dispatch<SetStateAction<HtmlBlock[]>>,
) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [lineStart, setLineStart] = useState({ x: 0, y: 0 });
  const { updateBlock, deleteBlock, appendBlockToChildField } = useBlockMutations(setBlocks);

  const selectedBlock = selectedBlockId ? findBlockById(blocks, selectedBlockId) : undefined;
  const popupPos = { x: lineStart.x + 180, y: Math.max(20, lineStart.y - 60) };

  const measureEditHandle = useCallback((editHandle: HTMLElement) => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const buttonRect = editHandle.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    const nextLineStart = {
      x:
        buttonRect.right -
        containerRect.left -
        scrollContainer.clientLeft +
        scrollContainer.scrollLeft,
      y:
        buttonRect.top +
        buttonRect.height / 2 -
        containerRect.top -
        scrollContainer.clientTop +
        scrollContainer.scrollTop,
    };

    setLineStart((current) =>
      current.x === nextLineStart.x && current.y === nextLineStart.y ? current : nextLineStart,
    );
  }, []);

  const findEditHandle = useCallback((blockId: string): HTMLElement | undefined => {
    const handles = scrollContainerRef.current?.querySelectorAll<HTMLElement>("[data-block-edit-handle-id]");
    if (!handles) return undefined;

    return Array.from(handles).find((handle) => handle.dataset.blockEditHandleId === blockId);
  }, []);

  useLayoutEffect(() => {
    if (!selectedBlockId) return;

    const editHandle = findEditHandle(selectedBlockId);
    if (!editHandle) return;

    measureEditHandle(editHandle);

    const blockItem = editHandle.closest<HTMLElement>("[data-canvas-block-id]");
    if (!blockItem) return;

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== blockItem || event.propertyName !== "transform") return;

      const currentEditHandle = findEditHandle(selectedBlockId);
      if (currentEditHandle) measureEditHandle(currentEditHandle);
    };

    blockItem.addEventListener("transitionend", handleTransitionEnd);
    return () => blockItem.removeEventListener("transitionend", handleTransitionEnd);
  }, [blocks, findEditHandle, measureEditHandle, selectedBlockId]);

  const selectBlock = (event: MouseEvent, blockId: string) => {
    event.stopPropagation();
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
      return;
    }

    measureEditHandle(event.currentTarget as HTMLElement);

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
    scrollContainerRef,
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
