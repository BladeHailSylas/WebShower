import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { HtmlBlock } from "../../../types/types";
import { compilePageHtml } from "../../../features/block-studio/blocks/html/blockHtmlCompiler";

interface QrExportPanelProps {
  blocks: HtmlBlock[];
}

export default function QrExportPanel({ blocks }: QrExportPanelProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const generateExportData = async () => {
    try {
      const response = await fetch("/api/save-page", {
        method: "POST",
        headers: { "Content-Type": "text/html;charset=utf-8" },
        body: compilePageHtml(blocks),
      });
      const data = (await response.json()) as { key: string };
      setQrUrl(`${window.location.origin}/code?key=${data.key}`);
      setIsModalOpen(true);
    } catch (error) {
      console.error("로컬 서버 저장 중 오류:", error);
    }
  };

  return (
    <>
      <div className="border-t border-slate-200 bg-white shrink-0 p-5 flex items-center justify-between shadow-xl z-10">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">배포 엔진</span>
          {qrUrl && (
            <button onClick={() => setIsModalOpen(true)} className="text-[11px] text-indigo-600 font-bold underline text-left hover:text-indigo-500">
              배포 QR 다시 열기
            </button>
          )}
        </div>
        <button
          onClick={generateExportData}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
        >
          배포 QR 생성
        </button>
      </div>

      {isModalOpen && qrUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center flex flex-col items-center gap-6 border border-slate-100" onClick={(event) => event.stopPropagation()}>
            <div className="w-full flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                모바일 즉시 배포
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold px-2 py-1 bg-slate-50 rounded-lg text-xs">
                닫기
              </button>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100/50 flex items-center justify-center">
              <QRCodeSVG value={qrUrl} size={260} level="M" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-900">다운로드 링크 준비 완료</span>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                스마트폰 카메라로 스캔하여 만든 웹페이지를 다운로드하세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
