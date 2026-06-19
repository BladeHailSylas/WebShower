import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import type { Ref } from "react";

interface BlockDragHandleProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  activatorRef?: Ref<HTMLDivElement>;
}

export default function BlockDragHandle({ attributes, listeners, activatorRef }: BlockDragHandleProps) {

  return (
    <div
      ref={activatorRef}
      {...attributes}
      {...listeners}
      className="w-6 bg-emerald-700 hover:bg-emerald-600 rounded-l-xl border-y-2 border-slate-700 flex items-center justify-center cursor-grab text-slate-400 text-xs select-none"
      title="드래그"
    >
      ::
    </div>
  );
}
