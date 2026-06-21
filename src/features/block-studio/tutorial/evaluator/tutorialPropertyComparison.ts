import type { HtmlBlock } from "../../../../types/types";
import type {
  TutorialPropertySnapshot,
  TutorialTrackedStyleKey,
} from "../types/tutorial.types";

function normalizeText(value: string | undefined) {
  return value?.trim() ?? "";
}

export function hasContentChanged(
  block: HtmlBlock,
  baseline: TutorialPropertySnapshot | undefined,
) {
  const currentValue = normalizeText(block.content);
  if (!currentValue) return false;
  return baseline === undefined || currentValue !== normalizeText(baseline.content);
}

export function hasAttributeChanged(
  block: HtmlBlock,
  baseline: TutorialPropertySnapshot | undefined,
  field: "src" | "link",
) {
  const currentValue = normalizeText(block[field]);
  if (!currentValue || (field === "link" && currentValue === "#")) return false;
  return baseline === undefined || currentValue !== normalizeText(baseline[field]);
}

function normalizeStyleValue(value: unknown) {
  return value === undefined || value === "default" ? undefined : value;
}

export function hasStyleChanged(
  block: HtmlBlock,
  baseline: TutorialPropertySnapshot | undefined,
  styleKey: TutorialTrackedStyleKey,
) {
  const currentValue = normalizeStyleValue(block.styles?.[styleKey]);
  const baselineValue = normalizeStyleValue(baseline?.styles[styleKey]);

  if (currentValue === undefined || currentValue === baselineValue) return false;
  if (currentValue !== "none") return true;

  return baselineValue !== undefined && baselineValue !== "none";
}

