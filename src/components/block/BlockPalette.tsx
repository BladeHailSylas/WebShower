import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { BlockType } from "../../types/types";
import { visiblePaletteDefinitions } from "../../features/block-studio/blocks/definitions";
import type { BlockDefinition } from "../../features/block-studio/blocks/types/blockDefinition.types";
import LearningTemplateGallery from "../../features/block-studio/templates/components/LearningTemplateGallery";
import type { LearningTemplate } from "../../features/block-studio/templates/types/learningTemplate.types";

interface BlockPaletteProps {
  onAddTemplate: (template: LearningTemplate) => void;
}

interface PaletteItemProps {
  definition: BlockDefinition;
}

function PaletteItem({ definition }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${definition.type}`,
    data: {
      type: "PALETTE_ITEM",
      blockType: definition.type as BlockType,
      label: definition.palette.label,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-slate-700 p-3 rounded-lg border border-slate-600 cursor-grab hover:bg-slate-600 transition-colors shadow-sm flex items-center gap-2 ${
        isDragging ? "opacity-50 border-dashed" : ""
      }`}
    >
      {definition.palette.icon && (
        <span className="text-[11px] font-black text-emerald-300 min-w-8">{definition.palette.icon}</span>
      )}
      <span className="text-sm font-medium text-slate-200">{definition.palette.label}</span>
    </div>
  );
}

function groupDefinitions() {
  return visiblePaletteDefinitions.reduce<Record<string, BlockDefinition[]>>((groups, definition) => {
    const key = definition.categoryLabel;
    return {
      ...groups,
      [key]: [...(groups[key] ?? []), definition],
    };
  }, {});
}

export default function BlockPalette({ onAddTemplate }: BlockPaletteProps) {
  const [activeTab, setActiveTab] = useState<"blocks" | "templates">("blocks");
  const groupedDefinitions = groupDefinitions();

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-5 border-b border-slate-700 bg-slate-800/50">
        <h2 className="text-xl font-bold text-white tracking-tight">블록 스튜디오</h2>
        <p className="text-xs text-slate-400 mt-1">블록을 조립하거나 학습 템플릿을 추가하세요</p>
        <div className="mt-4 grid grid-cols-2 gap-2" role="tablist" aria-label="팔레트 보기">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "blocks"}
            className={`rounded-lg px-3 py-2 text-xs font-black transition-colors ${
              activeTab === "blocks" ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
            onClick={() => setActiveTab("blocks")}
          >
            블록
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "templates"}
            className={`rounded-lg px-3 py-2 text-xs font-black transition-colors ${
              activeTab === "templates" ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
            onClick={() => setActiveTab("templates")}
          >
            템플릿
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
        {activeTab === "blocks" ? (
          Object.entries(groupedDefinitions).map(([categoryLabel, definitions]) => (
            <div key={categoryLabel} className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{categoryLabel}</h3>
              {definitions.map((definition) => (
                <PaletteItem key={definition.type} definition={definition} />
              ))}
            </div>
          ))
        ) : (
          <LearningTemplateGallery onAddTemplate={onAddTemplate} />
        )}
      </div>
    </div>
  );
}
