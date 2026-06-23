import type { CSSProperties } from "react";
import type { StyleProps } from "../../../../types/types";

const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

type CssDeclaration = {
  property: string;
  value: string;
};

function normalizeCustomColor(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmedValue = value.trim();
  return hexColorPattern.test(trimmedValue) ? trimmedValue : undefined;
}

function getCustomColorDeclarations(styles?: StyleProps): CssDeclaration[] {
  const textColor = normalizeCustomColor(styles?.textColorCustom);
  const backgroundColor = normalizeCustomColor(styles?.bgColorCustom);
  const borderColor = normalizeCustomColor(styles?.borderColorCustom);

  return [
    textColor ? { property: "color", value: textColor } : undefined,
    backgroundColor ? { property: "background-color", value: backgroundColor } : undefined,
    borderColor ? { property: "border-color", value: borderColor } : undefined,
  ].filter((declaration): declaration is CssDeclaration => Boolean(declaration));
}

export function resolveGuiInlineStyleObject(styles?: StyleProps): CSSProperties {
  return getCustomColorDeclarations(styles).reduce<CSSProperties>((inlineStyles, declaration) => {
    if (declaration.property === "color") inlineStyles.color = declaration.value;
    if (declaration.property === "background-color") inlineStyles.backgroundColor = declaration.value;
    if (declaration.property === "border-color") inlineStyles.borderColor = declaration.value;
    return inlineStyles;
  }, {});
}

export function resolveGuiInlineStyleString(styles?: StyleProps, baseDeclarations: string[] = []): string {
  return [
    ...baseDeclarations.map((declaration) => declaration.trim()).filter(Boolean),
    ...getCustomColorDeclarations(styles).map(
      (declaration) => `${declaration.property}: ${declaration.value};`,
    ),
  ].join(" ");
}
