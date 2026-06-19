import type { BlockType, StyleProps } from "../../../../types/types";
import { resolveGuiStyleClasses } from "./resolveGuiStyleClasses";

export function transformGuiToTailwind(styles?: StyleProps, blockType?: BlockType): string {
  if (!styles) return "";
  const baseClasses: string[] = [];

  if (styles.className) baseClasses.push(styles.className);

  if (blockType === "A") {
    baseClasses.push("px-5 py-3 text-xs inline-block text-center shadow-md transition-all active:scale-95 underline");
    if (styles.bgColor === undefined) {
      baseClasses.push("bg-blue-600 text-white border-none");
    }
  } else if (blockType === "PASSWORD_ZONE" || blockType === "TOGGLE_ZONE") {
    baseClasses.push("p-5 shadow-sm w-full max-w-md mx-auto");
    if (blockType === "TOGGLE_ZONE") {
      baseClasses.push("text-slate-900");
    }
    if (styles.bgColor === undefined) {
      baseClasses.push("bg-white rounded-2xl border border-slate-200");
    }
  } else if (blockType === "CONTAINER" || blockType === "GRID_ZONE") {
    baseClasses.push("p-4 min-h-[60px] border border-dashed border-slate-300 w-full rounded-xl");
  } else {
    baseClasses.push("mb-1 leading-relaxed");
  }

  return resolveGuiStyleClasses(baseClasses, styles);
}
