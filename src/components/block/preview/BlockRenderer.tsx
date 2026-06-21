import { useState } from "react";
import type { HtmlBlock } from "../../../types/types";
import CodeViewPanel from "./CodeViewPanel";
import PreviewBlockRenderer from "./PreviewBlockRenderer";
import QrExportPanel from "./QrExportPanel";

interface BlockRendererProps {
  blocks: HtmlBlock[];
  onTabViewed?: (tab: PreviewTab) => void;
}

type PreviewTab = "preview" | "code";

export default function BlockRenderer({ blocks, onTabViewed }: BlockRendererProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>("preview");

  const viewTab = (tab: PreviewTab) => {
    setActiveTab(tab);
    onTabViewed?.(tab);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50">
      <div className="bg-slate-200 border-b border-slate-300 p-3 flex items-center gap-4 shrink-0">
        <div className="flex gap-1.5 ml-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="bg-white px-4 py-1.5 text-xs text-slate-400 rounded-md border border-slate-300 w-full flex items-center justify-center font-mono">
          live_preview_sandbox
        </div>
      </div>

      <div className="bg-white border-b border-slate-200 p-2 flex gap-2 shrink-0">
        <button
          type="button"
          onClick={() => viewTab("preview")}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === "preview" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          미리보기
        </button>
        <button
          type="button"
          onClick={() => viewTab("code")}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === "code" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          코드 보기
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {activeTab === "code" ? (
          <CodeViewPanel blocks={blocks} />
        ) : blocks.length === 0 ? (
          <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs">
            캔버스에 블록을 조립하면 실시간 결과가 반영됩니다
          </div>
        ) : (
          <div className="w-full space-y-4 max-w-md mx-auto">
            {blocks.map((block) => (
              <PreviewBlockRenderer key={block.id} block={block} />
            ))}
          </div>
        )}
      </div>

      <QrExportPanel blocks={blocks} />
    </div>
  );
}
