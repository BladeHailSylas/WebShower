import type { Dispatch, SetStateAction } from "react";
import type { HtmlBlock } from "../../../types/types";
import { useSelectedBlockEditor } from "../../../features/block-studio/hooks/useSelectedBlockEditor";
import BlockEditorPopover from "./BlockEditorPopover";
import CanvasBlockList from "./CanvasBlockList";
import CanvasRootDropZone from "./CanvasRootDropZone";
import EditorConnectorLine from "./EditorConnectorLine";

interface BlockCanvasProps {
  blocks: HtmlBlock[];
  setBlocks: Dispatch<SetStateAction<HtmlBlock[]>>;
}

export default function BlockCanvas({ blocks, setBlocks }: BlockCanvasProps) {
  const {
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
  } = useSelectedBlockEditor(blocks, setBlocks);

  return (
    <div className="flex min-w-0 flex-col h-full w-full relative overflow-hidden bg-slate-900">
      <div className="absolute top-0 left-0 w-full p-6 z-10 pointer-events-none">
        <h2 className="text-2xl font-black text-slate-700/50">조립 캔버스</h2>
      </div>

      <CanvasRootDropZone scrollContainerRef={scrollContainerRef} onClearSelection={clearSelection}>
        <div className="relative z-10 flex flex-col items-start gap-2">
          <CanvasBlockList
            blocks={blocks}
            activeStyleId={selectedBlockId}
            onStyleClick={selectBlock}
            onAppendChild={appendBlockToChildField}
          />
        </div>

        {selectedBlockId && <EditorConnectorLine lineStart={lineStart} popupPos={popupPos} />}

        {selectedBlockId && selectedBlock && (
          <BlockEditorPopover
            targetBlock={selectedBlock}
            popupPos={popupPos}
            onUpdate={updateSelectedBlock}
            onDelete={deleteSelectedBlock}
          />
        )}
      </CanvasRootDropZone>

      <style>{`@keyframes dash { to { stroke-dashoffset: -20; } }`}</style>
    </div>
  );
}
