import type { HtmlBlock } from "../../../../types/types";
import { createLearningTemplateExport } from "../export/createLearningTemplateExport";

interface LearningTemplateExportPanelProps {
  blocks: HtmlBlock[];
}

const exportFileName = "learning-template-export.json";

function downloadJsonFile(fileName: string, data: unknown) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

export default function LearningTemplateExportPanel({ blocks }: LearningTemplateExportPanelProps) {
  const hasBlocks = blocks.length > 0;

  const exportLearningTemplate = () => {
    if (!hasBlocks) return;
    downloadJsonFile(exportFileName, createLearningTemplateExport(blocks));
  };

  return (
    <div className="border-t border-slate-200 bg-white px-5 py-4 shrink-0 flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Template JSON</span>
        <span className="truncate text-[11px] font-medium text-slate-500">{exportFileName}</span>
      </div>
      <button
        type="button"
        onClick={exportLearningTemplate}
        disabled={!hasBlocks}
        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow-md transition-all hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
      >
        템플릿 JSON 내보내기
      </button>
    </div>
  );
}
