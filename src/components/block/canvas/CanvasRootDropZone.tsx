import { useCallback, type MouseEvent, type ReactNode, type RefObject } from "react";
import { useDroppable } from "@dnd-kit/core";
import { CANVAS_ROOT_DROP_ID } from "../../../features/block-studio/blocks/drop/dropTargetIds";

interface CanvasRootDropZoneProps {
  children: ReactNode;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  onClearSelection: () => void;
}

export default function CanvasRootDropZone({
  children,
  scrollContainerRef,
  onClearSelection,
}: CanvasRootDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_ROOT_DROP_ID });
  const setRootDropZoneRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      scrollContainerRef.current = node;
    },
    [scrollContainerRef, setNodeRef],
  );
  const handleClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) onClearSelection();
  };

  return (
    <div
      ref={setRootDropZoneRef}
      className={`min-w-0 flex-1 w-full h-full relative overflow-auto p-12 pt-20 transition-colors duration-200 ${
        isOver ? "bg-slate-800/80 ring-4 ring-inset ring-emerald-500/30" : ""
      }`}
      style={{
        backgroundImage: "radial-gradient(circle, #334155 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
