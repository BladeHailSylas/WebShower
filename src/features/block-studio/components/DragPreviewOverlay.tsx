import type { HtmlBlock } from "../../../types/types";
import { getBlockDefinition } from "../blocks/definitions";
import { getChildBlocks, getChildFieldDefinitions } from "../blocks/tree/blockChildFields";

interface DragPreviewOverlayProps {
  block: HtmlBlock | null;
  label: string | null;
}

function getPreviewLabel(block: HtmlBlock): string {
  const definition = getBlockDefinition(block.type);
  if (block.type === "CONTAINER" && block.containerName?.trim()) {
    return `${definition.dragPreview.label}: ${block.containerName.trim().slice(0, 10)}`;
  }

  const field = definition.dragPreview.contentField;
  const value = field ? block[field] : undefined;
  return value ? `${definition.dragPreview.label}: ${String(value).slice(0, 10)}` : definition.dragPreview.label;
}

function OverlayBlock({ block }: { block: HtmlBlock }) {
  const definition = getBlockDefinition(block.type);
  const isContainerLike = definition.childFields.length > 0;

  return (
    <div
      className={`flex flex-col border-2 border-emerald-400 bg-slate-800 rounded-xl shadow-2xl opacity-95 scale-105 ${
        isContainerLike ? "min-w-70" : "min-w-50"
      }`}
    >
      <div className="p-3 font-bold text-slate-200 text-sm flex justify-between items-center">
        <span>{getPreviewLabel(block)}</span>
      </div>

      {getChildFieldDefinitions(block).map((fieldDefinition) => {
        const children = getChildBlocks(block, fieldDefinition.field);
        if (children.length === 0) return null;

        return (
          <div
            key={fieldDefinition.field}
            className="ml-6 mr-2 mb-2 p-3 bg-slate-900/80 border-l-2 border-emerald-500 border-dashed min-h-15 flex flex-col gap-1 pointer-events-none"
          >
            {children.map((child) => (
              <OverlayBlock key={child.id} block={child} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function DragPreviewOverlay({ block, label }: DragPreviewOverlayProps) {
  if (block) return <OverlayBlock block={block} />;

  if (!label) return null;

  return (
    <div className="bg-slate-700 p-3 rounded-lg border-2 border-emerald-400 shadow-xl opacity-90 cursor-grabbing scale-105 flex items-center gap-2">
      <span className="text-sm font-medium text-white">{label}</span>
    </div>
  );
}
