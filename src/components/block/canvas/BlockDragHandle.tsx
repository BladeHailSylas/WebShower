import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { PointerEvent as ReactPointerEvent } from "react";

interface BlockDragHandleProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}

export default function BlockDragHandle({ attributes, listeners }: BlockDragHandleProps) {
  const stopPointer = (event: ReactPointerEvent) => event.stopPropagation();

  return (
    <div
      {...attributes}
      {...listeners}
      onPointerDown={stopPointer}
      className="w-6 bg-slate-700 hover:bg-slate-600 rounded-l-xl border-y-2 border-slate-700 flex items-center justify-center cursor-grab text-slate-400 text-xs select-none"
      title="드래그"
    >
      ::
    </div>
  );
}
