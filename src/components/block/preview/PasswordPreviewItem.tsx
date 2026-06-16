import { useState, type ReactNode, type SubmitEvent } from "react";
import type { HtmlBlock } from "../../../types/types";

interface PasswordPreviewItemProps {
  block: HtmlBlock;
  renderBlock: (block: HtmlBlock) => ReactNode;
  className: string;
}

export default function PasswordPreviewItem({ block, renderBlock, className }: PasswordPreviewItemProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (inputVal === (block.correctAnswer || "12345")) {
      setIsUnlocked(true);
    } else {
      setIsShaking(true);
      window.setTimeout(() => setIsShaking(false), 500);
    }
  };

  if (isUnlocked) {
    return (
      <div className={`w-full duration-500 animate-fade-in ${className}`}>
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-center text-xs font-bold text-emerald-700">
          잠금 해제 완료!
        </div>
        {block.conditionalChildren?.map((child) => renderBlock(child))}
      </div>
    );
  }

  return (
    <div className={`w-full transition-transform ${className} ${isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>
      <form onSubmit={handleSubmit} className="space-y-3 mb-4">
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={inputVal}
          onChange={(event) => setInputVal(event.target.value)}
          className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 ring-slate-800 text-slate-900 bg-white"
        />
        <button type="submit" className="w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-xl active:scale-95 transition-transform">
          열기
        </button>
      </form>
      <div className="pt-3 border-t border-dashed border-slate-200/60">
        {block.defaultChildren?.map((child) => renderBlock(child))}
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
