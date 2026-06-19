import type { MouseEvent } from "react";
import type { BlockType, HtmlBlock } from "../../../types/types";
import { getBlockDefinition } from "../../../features/block-studio/blocks/definitions";
import type { BlockChildField } from "../../../features/block-studio/blocks/types/childField.types";
import CanvasBlockSlot from "./CanvasBlockSlot";
import textLimiter from "../../../utils/textLimiter";

interface CanvasBlockBodyProps {
  block: HtmlBlock;
  activeStyleId: string | null;
  onStyleClick: (event: MouseEvent, id: string) => void;
  onAppendChild: (parentId: string, field: BlockChildField, blockType: BlockType) => void;
}

function getBlockLabel(block: HtmlBlock): string | null {
  const definition = getBlockDefinition(block.type);

  if (block.type === "H1") return `제목: ${block.content || "(내용 없음)"}`;
  if (block.type === "P") return `문단: ${block.content || "(내용 없음)"}`;
  if (block.type === "LIST") return "글머리 기호 목록";
  if (block.type === "LIST_ITEM") return `목록 항목 (${block.children?.length ?? 0}개 블록)`;
  if (block.type === "IMAGE") return "이미지";
  if (block.type === "HR") return "구분선";
  if (block.type === "A") return `링크: ${block.content || "(글 없음)"} (${block.link || "링크 없음"})`;
  if (block.type === "GRID_ZONE") return `${block.styles?.gridCols ?? 2}칸 바둑판 구역`;
  if (block.type === "SPACER") return null;

  return definition.label;
}

export default function CanvasBlockBody({
  block,
  activeStyleId,
  onStyleClick,
  onAppendChild,
}: CanvasBlockBodyProps) {
  const definition = getBlockDefinition(block.type);
  const isContainer = block.type === "CONTAINER" || block.type === "CARD";
  return (
    <div
      className={`flex flex-col border-2 border-slate-700 bg-slate-800 shadow-sm ${
        isContainer || definition.childFields.length > 0 ? "min-w-70" : "min-w-50"
      }`}
    >
      <div className="p-3 font-bold text-slate-200 text-sm flex justify-between items-center">
        <span>{textLimiter(getBlockLabel(block), 14)}</span>
        {/*textLimiter를 getBlockLabel 내부에서 적용하는 것이 더 깔끔하지만, 개발 효율성을 위해 일부러 이렇게 처리함 */}
      </div>
      {definition.childFields.map((fieldDefinition) => (
        <CanvasBlockSlot
          key={fieldDefinition.field}
          block={block}
          fieldDefinition={fieldDefinition}
          activeStyleId={activeStyleId}
          onStyleClick={onStyleClick}
          onAppendChild={onAppendChild}
        />
      ))}
    </div>
  );
}
