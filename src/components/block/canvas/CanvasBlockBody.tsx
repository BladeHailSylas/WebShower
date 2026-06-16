import type { MouseEvent } from "react";
import type { HtmlBlock } from "../../../types/types";
import { getBlockDefinition } from "../../../features/block-studio/blocks/definitions";
import CanvasBlockSlot from "./CanvasBlockSlot";

interface CanvasBlockBodyProps {
  block: HtmlBlock;
  activeStyleId: string | null;
  onStyleClick: (event: MouseEvent, id: string) => void;
}

function getBlockLabel(block: HtmlBlock): string | null {
  const definition = getBlockDefinition(block.type);

  if (block.type === "H1") return `제목: ${block.content || "(내용 없음)"}`;
  if (block.type === "P") return `문단: ${block.content || "(내용 없음)"}`;
  if (block.type === "IMAGE") return "이미지";
  if (block.type === "A") return `링크: ${block.content || "(글 없음)"} (${block.link || "링크 없음"})`;
  if (block.type === "GRID_ZONE") return `${block.styles?.gridCols ?? 2}칸 바둑판 구역`;
  if (block.type === "SPACER") return null;

  return definition.label;
}

export default function CanvasBlockBody({ block, activeStyleId, onStyleClick }: CanvasBlockBodyProps) {
  const definition = getBlockDefinition(block.type);
  const isGrid = block.type === "GRID_ZONE";
  const isContainer = block.type === "CONTAINER";

  if (isGrid) {
    return (
      <div className="flex flex-col border-2 border-l-0 border-indigo-500 bg-slate-800 p-4 flex-1 rounded-r-none gap-2">
        <div className="text-xs font-black text-indigo-300 flex items-center justify-between">
          <span>바둑판 구역 만들기</span>
          <span className="text-[10px] bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/40 text-indigo-400">
            한 줄에 {block.styles?.gridCols ?? 2}칸
          </span>
        </div>
        {definition.childFields.map((fieldDefinition) => (
          <CanvasBlockSlot
            key={fieldDefinition.field}
            block={block}
            fieldDefinition={fieldDefinition}
            activeStyleId={activeStyleId}
            onStyleClick={onStyleClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col border-2 border-slate-700 bg-slate-800 rounded-l-xl shadow-sm ${
        isContainer || definition.childFields.length > 0 ? "min-w-70" : "min-w-50"
      }`}
    >
      <div className="p-3 font-bold text-slate-200 text-sm flex justify-between items-center">
        <span>{getBlockLabel(block)}</span>
      </div>
      {definition.childFields.map((fieldDefinition) => (
        <CanvasBlockSlot
          key={fieldDefinition.field}
          block={block}
          fieldDefinition={fieldDefinition}
          activeStyleId={activeStyleId}
          onStyleClick={onStyleClick}
        />
      ))}
    </div>
  );
}
