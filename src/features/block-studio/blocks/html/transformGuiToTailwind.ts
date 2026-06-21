import type { BlockType, StyleProps } from "../../../../types/types";
import { resolveGuiStyleClasses } from "./resolveGuiStyleClasses";

export function transformGuiToTailwind(styles?: StyleProps, blockType?: BlockType): string {
  if (!styles) return "";
  const baseClasses: string[] = [];

  if (styles.className) baseClasses.push(styles.className);

  return resolveGuiStyleClasses(baseClasses, styles, blockType);
}
