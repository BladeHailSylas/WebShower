import type { ReactNode } from "react";

interface BlockStudioLayoutProps {
  palette: ReactNode;
  canvas: ReactNode;
  preview: ReactNode;
}

export default function BlockStudioLayout({ palette, canvas, preview }: BlockStudioLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden text-slate-100 font-sans select-none">
      <div className="w-70 border-r border-slate-700 bg-slate-800 flex flex-col shrink-0">{palette}</div>
      <div className="min-w-0 flex-1 bg-slate-900 relative flex flex-col overflow-hidden">{canvas}</div>
      <div className="w-md border-l border-slate-700 bg-white flex flex-col text-slate-900 shrink-0 shadow-2xl z-20">
        {preview}
      </div>
    </div>
  );
}
