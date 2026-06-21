import type { HtmlBlock } from "../../../../types/types";
import { escapeAttribute } from "./escapeHtml";
import { transformGuiToTailwind } from "./transformGuiToTailwind";

type CompileBlock = (block: HtmlBlock) => string;

function createSafeId(prefix: string, id: string): string {
  return `${prefix}-${id}`.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function createSafeFunctionName(prefix: string, id: string): string {
  return `${prefix}_${id}`.replace(/[^a-zA-Z0-9_]/g, "_");
}

export function compileSliderZone(block: HtmlBlock, compileBlock: CompileBlock): string {
  const slides = (block.children ?? []).filter((child) => child.type === "SLIDE_ITEM");
  const uniqueId = createSafeId("slider", block.id);
  const functionName = createSafeFunctionName("moveSlider", block.id);
  const classes = escapeAttribute(transformGuiToTailwind(block.styles, block.type));

  if (slides.length === 0) {
    return `
<section id="${uniqueId}-root" class="${classes}" aria-label="콘텐츠 슬라이더">
  <div class="p-4 text-center text-sm text-slate-500">슬라이드가 없습니다</div>
</section>`.trim();
  }

  const slideHtml = slides
    .map(
      (slide, index) => `
    <div class="slider-slide" data-slider-owner="${uniqueId}" data-slide-index="${index}" role="group" aria-roledescription="슬라이드" aria-label="${index + 1} / ${slides.length}" aria-hidden="${index === 0 ? "false" : "true"}"${index === 0 ? "" : " hidden"}>${compileBlock(slide)}</div>`,
    )
    .join("");

  const controls =
    slides.length > 1
      ? `
  <div class="slider-controls flex items-center justify-between gap-3 border-t border-slate-200 p-3" data-slider-owner="${uniqueId}">
    <button type="button" data-slider-owner="${uniqueId}" data-slider-action="prev" aria-label="이전 슬라이드" disabled onclick="${functionName}(-1)" class="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40">이전</button>
    <span class="text-xs text-slate-500" data-slider-owner="${uniqueId}" data-slider-counter aria-hidden="true">1 / ${slides.length}</span>
    <button type="button" data-slider-owner="${uniqueId}" data-slider-action="next" aria-label="다음 슬라이드" onclick="${functionName}(1)" class="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40">다음</button>
  </div>
  <script>
    function ${functionName}(direction) {
      const root = document.getElementById('${uniqueId}-root');
      if (!root) return;
      const slides = Array.from(root.querySelectorAll('.slider-slide[data-slider-owner="${uniqueId}"]'));
      const lastIndex = slides.length - 1;
      const currentIndex = Number(root.dataset.slideIndex || '0');
      const nextIndex = Math.max(0, Math.min(lastIndex, currentIndex + direction));
      root.dataset.slideIndex = String(nextIndex);
      slides.forEach((slide, index) => {
        const isActive = index === nextIndex;
        slide.hidden = !isActive;
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      root.querySelector('[data-slider-owner="${uniqueId}"][data-slider-action="prev"]').disabled = nextIndex === 0;
      root.querySelector('[data-slider-owner="${uniqueId}"][data-slider-action="next"]').disabled = nextIndex === lastIndex;
      root.querySelector('[data-slider-owner="${uniqueId}"][data-slider-counter]').textContent = String(nextIndex + 1) + ' / ' + String(slides.length);
    }
  </script>`
      : "";

  return `
<section id="${uniqueId}-root" class="${classes}" data-slide-index="0" aria-label="콘텐츠 슬라이더">
  <div class="slider-viewport">${slideHtml}
  </div>${controls}
</section>`.trim();
}
