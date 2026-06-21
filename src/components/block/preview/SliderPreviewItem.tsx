import { useState, type ReactNode } from "react";
import type { HtmlBlock } from "../../../types/types";

interface SliderPreviewItemProps {
  block: HtmlBlock;
  className: string;
  renderBlock: (block: HtmlBlock) => ReactNode;
}

export default function SliderPreviewItem({ block, className, renderBlock }: SliderPreviewItemProps) {
  const slides = (block.children ?? []).filter((child) => child.type === "SLIDE_ITEM");
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastIndex = slides.length - 1;
  const safeIndex = slides.length === 0 ? 0 : Math.min(currentIndex, lastIndex);

  if (slides.length === 0) {
    return (
      <section className={className} aria-label="콘텐츠 슬라이더">
        <div className="p-4 text-center text-sm text-slate-500">슬라이드가 없습니다</div>
      </section>
    );
  }

  return (
    <section className={className} aria-label="콘텐츠 슬라이더">
      <div className="slider-viewport" aria-live="polite">
        {renderBlock(slides[safeIndex])}
      </div>
      {slides.length > 1 && (
        <div className="slider-controls flex items-center justify-between gap-3 border-t border-slate-200 p-3">
          <button
            type="button"
            aria-label="이전 슬라이드"
            disabled={safeIndex === 0}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setCurrentIndex(Math.max(0, safeIndex - 1))}
          >
            이전
          </button>
          <span className="text-xs text-slate-500" aria-hidden="true">
            {safeIndex + 1} / {slides.length}
          </span>
          <button
            type="button"
            aria-label="다음 슬라이드"
            disabled={safeIndex === lastIndex}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setCurrentIndex(Math.min(lastIndex, safeIndex + 1))}
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
}
