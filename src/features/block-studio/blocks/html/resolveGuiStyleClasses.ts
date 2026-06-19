import type { BlockType, StyleProps } from "../../../../types/types";

const colorNamePattern =
  "(?:inherit|current|transparent|black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)";

const backgroundColorPattern = new RegExp(`^bg-(?:${colorNamePattern}(?:-\\d{2,3})?|\\[.+\\])(?:/\\d{1,3})?$`);
const borderColorPattern = new RegExp(
  `^border-(?:${colorNamePattern}(?:-\\d{2,3})?|\\[.+\\])(?:/\\d{1,3})?$`,
);
const textColorPattern = new RegExp(`^text-(?:${colorNamePattern}(?:-\\d{2,3})?|\\[.+\\])(?:/\\d{1,3})?$`);

const fontSizePattern = /^text-(?:xs|sm|base|lg|xl|[2-9]xl)$/;
const textAlignPattern = /^text-(?:left|center|right|justify|start|end)$/;
const fontWeightPattern = /^font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/;
const fontFamilyPattern = /^font-(?:sans|serif|mono|\[.+\])$/;
const lineHeightPattern = /^leading-(?:none|tight|snug|normal|relaxed|loose|\[.+\])$/;
const letterSpacingPattern = /^tracking-(?:tighter|tight|normal|wide|wider|widest|\[.+\])$/;
const roundedPattern = /^rounded(?:-(?:none|xs|sm|md|lg|xl|[2-9]xl|full|\[.+\]))?$/;
const shadowPattern = /^shadow(?:-(?:none|xs|sm|md|lg|xl|2xl|inner|\[.+\]))?$/;
const borderWidthPattern = /^border(?:-[xytrblse])?(?:-(?:0|2|4|8|\[.+\]))?$/;
const explicitBorderColorPattern = new RegExp(
  `^border(?:-[xytrblse])?-(?:${colorNamePattern}(?:-\\d{2,3})?|\\[.+\\])(?:/\\d{1,3})?$`,
);

const textColorClasses: Record<NonNullable<StyleProps["textColor"]>, string> = {
  black: "text-slate-900",
  gray: "text-slate-500",
  red: "text-red-600",
  blue: "text-blue-600",
  green: "text-emerald-600",
};

const backgroundClasses: Record<Exclude<NonNullable<StyleProps["bgColor"]>, "none">, string[]> = {
  white: ["bg-white", "border", "border-slate-200"],
  slate: ["bg-slate-100", "border", "border-slate-200"],
  red: ["bg-red-50", "border", "border-red-100"],
  blue: ["bg-blue-50", "border", "border-blue-100"],
  green: ["bg-emerald-50", "border", "border-emerald-100"],
  yellow: ["bg-amber-50", "border", "border-amber-100"],
};

const fontSizeClasses: Record<NonNullable<StyleProps["fontSize"]>, string> = {
  small: "text-xs",
  normal: "text-base",
  large: "text-xl",
  xlarge: "text-3xl",
};

const textAlignClasses: Record<NonNullable<StyleProps["textAlign"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const fontFamilyClasses: Record<Exclude<NonNullable<StyleProps["fontFamily"]>, "default">, string> = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
};

const lineHeightClasses: Record<Exclude<NonNullable<StyleProps["lineHeight"]>, "default">, string> = {
  tight: "leading-tight",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
};

const letterSpacingClasses: Record<Exclude<NonNullable<StyleProps["letterSpacing"]>, "default">, string> = {
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
};

const shadowClasses: Record<Exclude<NonNullable<StyleProps["shadow"]>, "default">, string> = {
  none: "shadow-none",
  small: "shadow-sm",
  medium: "shadow-md",
  large: "shadow-xl",
};

const roundedClasses: Record<Exclude<NonNullable<StyleProps["rounded"]>, "default">, string> = {
  none: "rounded-none",
  small: "rounded-md",
  medium: "rounded-xl",
  large: "rounded-2xl",
  full: "rounded-full",
};

const borderWidthClasses: Record<Exclude<NonNullable<StyleProps["borderWidth"]>, "default">, string> = {
  none: "border-0",
  thin: "border",
  medium: "border-2",
  thick: "border-4",
};

const hrBorderWidthClasses: Record<Exclude<NonNullable<StyleProps["borderWidth"]>, "default">, string> = {
  none: "border-t-0",
  thin: "border-t",
  medium: "border-t-2",
  thick: "border-t-4",
};

const borderColorClasses: Record<Exclude<NonNullable<StyleProps["borderColor"]>, "default">, string> = {
  slate: "border-slate-300",
  black: "border-slate-900",
  red: "border-red-500",
  blue: "border-indigo-500",
  green: "border-emerald-500",
};

function isRootUtility(token: string): boolean {
  return !token.includes(":");
}

function replaceRootUtility(
  tokens: string[],
  matchesUtility: (token: string) => boolean,
  replacements: string[] = [],
): string[] {
  return [...tokens.filter((token) => !isRootUtility(token) || !matchesUtility(token)), ...replacements];
}

function deduplicate(tokens: string[]): string[] {
  return tokens.filter((token, index) => token.length > 0 && tokens.indexOf(token) === index);
}

export function resolveGuiStyleClasses(baseClasses: string[], styles: StyleProps, blockType?: BlockType): string {
  let tokens = baseClasses.flatMap((className) => className.split(/\s+/).filter(Boolean));

  if (styles.bgColor !== undefined) {
    tokens = replaceRootUtility(tokens, (token) => backgroundColorPattern.test(token));

    if (styles.bgColor !== "none") {
      tokens = replaceRootUtility(tokens, (token) => borderColorPattern.test(token));
      tokens.push(...backgroundClasses[styles.bgColor]);
    }
  }

  if (styles.textColor !== undefined) {
    tokens = replaceRootUtility(tokens, (token) => textColorPattern.test(token), [
      textColorClasses[styles.textColor],
    ]);
  }

  if (styles.fontSize !== undefined) {
    tokens = replaceRootUtility(tokens, (token) => fontSizePattern.test(token), [fontSizeClasses[styles.fontSize]]);
  }

  if (styles.textAlign !== undefined) {
    tokens = replaceRootUtility(tokens, (token) => textAlignPattern.test(token), [
      textAlignClasses[styles.textAlign],
    ]);
  }

  if (styles.fontFamily !== undefined && styles.fontFamily !== "default") {
    tokens = replaceRootUtility(tokens, (token) => fontFamilyPattern.test(token), [
      fontFamilyClasses[styles.fontFamily],
    ]);
  }

  if (styles.lineHeight !== undefined && styles.lineHeight !== "default") {
    tokens = replaceRootUtility(tokens, (token) => lineHeightPattern.test(token), [
      lineHeightClasses[styles.lineHeight],
    ]);
  }

  if (styles.letterSpacing !== undefined && styles.letterSpacing !== "default") {
    tokens = replaceRootUtility(tokens, (token) => letterSpacingPattern.test(token), [
      letterSpacingClasses[styles.letterSpacing],
    ]);
  }

  if (styles.isBold !== undefined) {
    tokens = replaceRootUtility(
      tokens,
      (token) => fontWeightPattern.test(token),
      styles.isBold ? ["font-bold"] : [],
    );
  }

  if (styles.shadow !== undefined && styles.shadow !== "default") {
    tokens = replaceRootUtility(tokens, (token) => shadowPattern.test(token), [shadowClasses[styles.shadow]]);
  }

  if (styles.rounded !== undefined) {
    if (styles.rounded !== "default") {
      tokens = replaceRootUtility(tokens, (token) => roundedPattern.test(token), [
        roundedClasses[styles.rounded],
      ]);
    }
  } else if (styles.isRounded !== undefined) {
    tokens = replaceRootUtility(
      tokens,
      (token) => roundedPattern.test(token),
      styles.isRounded ? ["rounded-2xl"] : [],
    );
  }

  if (styles.borderWidth !== undefined && styles.borderWidth !== "default") {
    const widthClass =
      blockType === "HR"
        ? hrBorderWidthClasses[styles.borderWidth]
        : borderWidthClasses[styles.borderWidth];
    tokens = replaceRootUtility(tokens, (token) => borderWidthPattern.test(token), [widthClass]);
  }

  if (styles.borderColor !== undefined && styles.borderColor !== "default") {
    tokens = replaceRootUtility(tokens, (token) => explicitBorderColorPattern.test(token), [
      borderColorClasses[styles.borderColor],
    ]);
  }

  return deduplicate(tokens).join(" ");
}
