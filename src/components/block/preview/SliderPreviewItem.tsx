import { useState, type CSSProperties, type ReactNode } from "react";
import type { HtmlBlock } from "../../../types/types";

interface SliderPreviewItemProps {
  block: HtmlBlock;
  className: string;
  renderBlock: (block: HtmlBlock) => ReactNode;
  style?: CSSProperties;
}

export default function SliderPreviewItem({ block, className, renderBlock, style }: SliderPreviewItemProps) {
  const slides = (block.children ?? []).filter((child) => child.type === "SLIDE_ITEM");
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastIndex = slides.length - 1;
  const safeIndex = slides.length === 0 ? 0 : Math.min(currentIndex, lastIndex);

  if (slides.length === 0) {
    return (
      <section className={className} style={style} aria-label="콘텐츠 슬라이더">
        <div className="grid flex-1 place-items-center p-4 text-center text-sm text-slate-500">슬라이드가 없습니다</div>
      </section>
    );
  }

  return (
    <section className={className} style={style} aria-label="콘텐츠 슬라이더">
      <div className="slider-viewport grid flex-1" aria-live="polite">
        {slides.map((slide, index) => {
          const isActive = index === safeIndex;
          const transitionClasses =
            slides.length > 1
              ? "transition-[opacity,visibility] duration-300 ease-in-out motion-reduce:transition-none"
              : "";

          return (
            <div
              key={slide.id}
              className={`slider-slide flex flex-col justify-center col-start-1 row-start-1 ${transitionClasses} ${
                isActive ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
              }`}
              role="group"
              aria-roledescription="슬라이드"
              aria-label={`${index + 1} / ${slides.length}`}
              aria-hidden={!isActive}
              inert={isActive ? undefined : true}
            >
              {renderBlock(slide)}
            </div>
          );
        })}
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
