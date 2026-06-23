import { useState, type CSSProperties, type ReactNode } from "react";
import type { HtmlBlock } from "../../../types/types";

interface TogglePreviewItemProps {
  block: HtmlBlock;
  renderBlock: (block: HtmlBlock) => ReactNode;
  className: string;
  style?: CSSProperties;
}

export default function TogglePreviewItem({ block, renderBlock, className, style }: TogglePreviewItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`w-full ${className}`} style={style}>
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">{block.defaultChildren?.map((child) => renderBlock(child))}</div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 bg-slate-900/5 hover:bg-slate-900/10 active:bg-slate-900/25 text-slate-700 text-xs font-bold rounded-lg transition-colors shrink-0"
        >
          {isOpen ? "닫기" : "열기"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-dashed border-slate-200/60 animate-fade-in">
          {block.conditionalChildren?.map((child) => renderBlock(child))}
        </div>
      )}
    </div>
  );
}
