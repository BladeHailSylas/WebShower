import type { HtmlBlock } from "../../../types/types";
import BlockStylePanel from "../editor/BlockStylePanel";

interface BlockEditorPopoverProps {
  targetBlock: HtmlBlock;
  popupPos: { x: number; y: number };
  onUpdate: (fields: Partial<HtmlBlock>) => void;
  onDelete: () => void;
}

export default function BlockEditorPopover({
  targetBlock,
  popupPos,
  onUpdate,
  onDelete,
}: BlockEditorPopoverProps) {
  return (
    <div
      className="absolute z-30 w-80 bg-amber-50/95 backdrop-blur-sm shadow-2xl border border-amber-200 text-slate-800 p-5 rounded-br-3xl rounded-tr-xl rounded-l-xl"
      style={{ top: popupPos.y, left: popupPos.x }}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex flex-col gap-4 text-sm font-medium">
        <BlockStylePanel targetBlock={targetBlock} onUpdate={onUpdate} onDelete={onDelete} />
      </div>
    </div>
  );
}
