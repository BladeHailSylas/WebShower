import type { MouseEvent, PointerEvent as ReactPointerEvent } from "react";

interface BlockEditHandleProps {
  blockId: string;
  active: boolean;
  onStyleClick: (event: MouseEvent, id: string) => void;
}

export default function BlockEditHandle({
  blockId,
  active,
  onStyleClick,
}: BlockEditHandleProps) {
  const stopPointer = (event: ReactPointerEvent) => event.stopPropagation();
  const colors = "bg-indigo-500 border-indigo-500 hover:bg-indigo-400";

  return (
    <div
      onClick={(event) => onStyleClick(event, blockId)}
      onPointerDown={stopPointer}
      className={`w-8 rounded-r-xl border-y-2 border-r-2 cursor-pointer flex items-center justify-center shrink-0 ${colors} ${
        active ? "ring-2 ring-emerald-300 z-10" : ""
      }`}
      title="스타일 편집"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
    </div>
  );
}
