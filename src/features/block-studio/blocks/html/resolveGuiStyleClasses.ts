import type { StyleProps } from "../../../../types/types";

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
const roundedPattern = /^rounded(?:-(?:none|xs|sm|md|lg|xl|[2-9]xl|full|\[.+\]))?$/;

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

export function resolveGuiStyleClasses(baseClasses: string[], styles: StyleProps): string {
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

  if (styles.isBold !== undefined) {
    tokens = replaceRootUtility(
      tokens,
      (token) => fontWeightPattern.test(token),
      styles.isBold ? ["font-bold"] : [],
    );
  }

  if (styles.isRounded !== undefined) {
    tokens = replaceRootUtility(
      tokens,
      (token) => roundedPattern.test(token),
      styles.isRounded ? ["rounded-2xl"] : [],
    );
  }

  return deduplicate(tokens).join(" ");
}
