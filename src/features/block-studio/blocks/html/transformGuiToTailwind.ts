import type { BlockType, StyleProps } from "../../../../types/types";

export function transformGuiToTailwind(styles?: StyleProps, blockType?: BlockType): string {
  if (!styles) return "";
  const classes: string[] = [];

  if (styles.className) classes.push(styles.className);

  if (styles.textColor === "gray") classes.push("text-slate-500");
  else if (styles.textColor === "red") classes.push("text-red-600");
  else if (styles.textColor === "blue") classes.push("text-blue-600");
  else if (styles.textColor === "green") classes.push("text-emerald-600");
  else if (styles.textColor === "black") classes.push("text-slate-900");

  if (styles.bgColor === "white") classes.push("bg-white border border-slate-200");
  else if (styles.bgColor === "slate") classes.push("bg-slate-100 border border-slate-200");
  else if (styles.bgColor === "red") classes.push("bg-red-50 border border-red-100");
  else if (styles.bgColor === "blue") classes.push("bg-blue-50 border border-blue-100");
  else if (styles.bgColor === "green") classes.push("bg-emerald-50 border border-emerald-100");
  else if (styles.bgColor === "yellow") classes.push("bg-amber-50 border border-amber-100");

  if (styles.fontSize === "small") classes.push("text-xs");
  else if (styles.fontSize === "large") classes.push("text-xl");
  else if (styles.fontSize === "xlarge") classes.push("text-3xl");
  else classes.push("text-base");

  if (styles.textAlign === "center") classes.push("text-center");
  else if (styles.textAlign === "right") classes.push("text-right");
  else if (styles.textAlign === "left") classes.push("text-left");

  if (styles.isBold) classes.push("font-bold");
  if (styles.isRounded) classes.push("rounded-2xl");

  if (blockType === "A") {
    classes.push("px-5 py-3 text-xs inline-block text-center shadow-md transition-all active:scale-95 underline");
    if (!styles.bgColor || styles.bgColor === "none") {
      classes.push("bg-blue-600 text-white border-none");
    }
  } else if (blockType === "PASSWORD_ZONE" || blockType === "TOGGLE_ZONE") {
    classes.push("p-5 shadow-sm w-full max-w-md mx-auto");
    if (!styles.bgColor || styles.bgColor === "none") {
      classes.push("bg-white rounded-2xl border border-slate-200");
    }
  } else if (blockType === "CONTAINER" || blockType === "GRID_ZONE") {
    classes.push("p-4 min-h-[60px] border border-dashed border-slate-300 w-full rounded-xl");
  } else {
    classes.push("mb-1 leading-relaxed");
  }

  return classes.join(" ");
}
