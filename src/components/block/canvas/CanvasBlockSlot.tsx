import type { MouseEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { BlockType, HtmlBlock } from "../../../types/types";
import { createChildFieldDropId } from "../../../features/block-studio/blocks/drop/dropTargetIds";
import { getChildBlocks } from "../../../features/block-studio/blocks/tree/blockChildFields";
import type { ChildFieldDefinition } from "../../../features/block-studio/blocks/types/childField.types";
import CanvasBlockItem from "./CanvasBlockItem";

interface CanvasBlockSlotProps {
  block: HtmlBlock;
  fieldDefinition: ChildFieldDefinition;
  activeStyleId: string | null;
  onStyleClick: (event: MouseEvent, id: string) => void;
  onAppendChild: (parentId: string, field: ChildFieldDefinition["field"], blockType: BlockType) => void;
}

function getSlotClassName(variant: ChildFieldDefinition["variant"], isOver: boolean): string {
  const base = "flex flex-col gap-1 transition-colors";

  if (variant === "grid") {
    return `p-3 border-l-2 bg-indigo-950/50 min-h-20 border-dashed border-indigo-700 ${base} ${
      isOver ? "ring-2 ring-indigo-400/50 bg-indigo-900/50" : ""
    }`;
  }

  if (variant === "password-default") {
    return `p-3 border-l-2 border-dashed border-red-500/30 bg-red-950/20 ${base} ${
      isOver ? "bg-red-900/30 ring-2 ring-red-500/50" : ""
    }`;
  }

  if (variant === "password-conditional") {
    return `p-3 border-l-2 border-dashed border-emerald-500/30 bg-emerald-950/20 ${base} ${
      isOver ? "bg-emerald-900/30 ring-2 ring-emerald-500/50" : ""
    }`;
  }

  if (variant === "toggle-default") {
    return `p-3 border-l-2 border-dashed border-emerald-500/30 bg-emerald-950/20 ${base} ${
      isOver ? "bg-emerald-900/30 ring-2 ring-emerald-500/50" : ""
    }`;
  }

  if (variant === "toggle-conditional") {
    return `p-3 border-l-2 border-dashed border-blue-500/30 bg-blue-950/20 ${base} ${
      isOver ? "bg-blue-900/30 ring-2 ring-blue-500/50" : ""
    }`;
  }

  return `ml-6 mr-2 mb-2 p-3 bg-slate-900/80 border-l-2 border-slate-700 border-dashed min-h-15 ${base} ${
    isOver ? "bg-slate-800 ring-2 ring-emerald-500/50" : ""
  }`;
}

export default function CanvasBlockSlot({
  block,
  fieldDefinition,
  activeStyleId,
  onStyleClick,
  onAppendChild,
}: CanvasBlockSlotProps) {
  const children = getChildBlocks(block, fieldDefinition.field);
  const { setNodeRef, isOver } = useDroppable({
    id: createChildFieldDropId(block.id, fieldDefinition.field),
    data: { type: "CHILD_FIELD_DROP_ZONE", blockId: block.id, field: fieldDefinition.field },
  });
  const strategy = fieldDefinition.sortable === "grid" ? rectSortingStrategy : verticalListSortingStrategy;
  const appendAction = fieldDefinition.appendAction;

  return (
    <div
      ref={setNodeRef}
      className={getSlotClassName(fieldDefinition.variant, isOver)}
      style={
        fieldDefinition.variant === "grid"
          ? {
              display: "grid",
              gridTemplateColumns: `repeat(${block.styles?.gridCols ?? 2}, minmax(0, 1fr))`,
              gap: "12px",
            }
          : undefined
      }
    >
      {fieldDefinition.variant !== "container" && fieldDefinition.variant !== "grid" && (
        <div className="text-[10px] font-bold tracking-tight mb-1">{fieldDefinition.label}</div>
      )}
      <SortableContext items={children.map((child) => child.id)} strategy={strategy}>
        {children.map((child) => (
          <CanvasBlockItem
            key={child.id}
            block={child}
            activeStyleId={activeStyleId}
            onStyleClick={onStyleClick}
            onAppendChild={onAppendChild}
          />
        ))}
      </SortableContext>
      {children.length === 0 && (
        <span className="text-xs text-slate-500 font-medium my-2 text-center pointer-events-none">
          {fieldDefinition.emptyLabel}
        </span>
      )}
      {appendAction && (
        <button
          type="button"
          className="mt-2 rounded-md border border-emerald-500/50 bg-emerald-950/40 px-3 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-900/60"
          onClick={(event) => {
            event.stopPropagation();
            onAppendChild(block.id, fieldDefinition.field, appendAction.blockType);
          }}
        >
          + {appendAction.label}
        </button>
      )}
    </div>
  );
}
