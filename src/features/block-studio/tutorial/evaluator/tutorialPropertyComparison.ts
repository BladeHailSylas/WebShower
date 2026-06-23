import type { HtmlBlock } from "../../../../types/types";
import { getBlockDefinition } from "../../blocks/definitions";
import type {
  TutorialPropertySnapshot,
  TutorialTrackedStyleKey,
} from "../types/tutorial.types";

function normalizeText(value: string | undefined) {
  return value?.trim() ?? "";
}

function getComparisonValue(
  block: HtmlBlock,
  baseline: TutorialPropertySnapshot | undefined,
  field: "content" | "src" | "link" | "correctAnswer",
) {
  return baseline?.[field] ?? getBlockDefinition(block.type).template[field];
}

export function hasContentChanged(
  block: HtmlBlock,
  baseline: TutorialPropertySnapshot | undefined,
) {
  const currentValue = normalizeText(block.content);
  if (!currentValue) return false;
  return currentValue !== normalizeText(getComparisonValue(block, baseline, "content"));
}

export function hasAttributeChanged(
  block: HtmlBlock,
  baseline: TutorialPropertySnapshot | undefined,
  field: "src" | "link" | "correctAnswer",
) {
  const currentValue = normalizeText(block[field]);
  if (!currentValue || (field === "link" && currentValue === "#")) return false;
  return currentValue !== normalizeText(getComparisonValue(block, baseline, field));
}

function normalizeStyleValue(value: unknown) {
  return value === undefined || value === "default" || value === "" ? undefined : value;
}

type CustomColorStyleKey = "bgColorCustom" | "textColorCustom" | "borderColorCustom";

const customColorStyleKeys: Partial<Record<TutorialTrackedStyleKey, CustomColorStyleKey>> = {
  bgColor: "bgColorCustom",
  textColor: "textColorCustom",
  borderColor: "borderColorCustom",
};

export function hasStyleChanged(
  block: HtmlBlock,
  baseline: TutorialPropertySnapshot | undefined,
  styleKey: TutorialTrackedStyleKey,
) {
  const customStyleKey = customColorStyleKeys[styleKey];
  if (customStyleKey) {
    const currentCustomValue = normalizeStyleValue(block.styles?.[customStyleKey]);
    const baselineCustomValue = normalizeStyleValue(baseline?.styles[customStyleKey]);
    if (currentCustomValue !== undefined && currentCustomValue !== baselineCustomValue) return true;
  }

  const currentValue = normalizeStyleValue(block.styles?.[styleKey]);
  const baselineValue = normalizeStyleValue(baseline?.styles[styleKey]);

  if (currentValue === undefined || currentValue === baselineValue) return false;
  if (currentValue !== "none") return true;

  return baselineValue !== undefined && baselineValue !== "none";
}

