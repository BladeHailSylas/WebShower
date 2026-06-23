import type { HtmlBlock } from "../../../../types/types";
import type { HtmlSchemaDefinition } from "../types/htmlSchema.types";
import { escapeAttribute, escapeHtml } from "./escapeHtml";
import { resolveGuiInlineStyleString } from "./resolveGuiInlineStyles";
import { transformGuiToTailwind } from "./transformGuiToTailwind";

type CompileBlock = (block: HtmlBlock) => string;

function getInlineStyle(block: HtmlBlock): string {
  const baseDeclarations =
    block.type === "GRID_ZONE"
      ? [
          `display: grid;`,
          `grid-template-columns: repeat(${block.styles?.gridCols ?? 2}, minmax(0, 1fr));`,
          `gap: 12px;`,
        ]
      : [];

  return resolveGuiInlineStyleString(block.styles, baseDeclarations);
}

export function compileHtmlSchema(
  block: HtmlBlock,
  schema: HtmlSchemaDefinition,
  compileBlock: CompileBlock,
): string {
  const classes = escapeAttribute(transformGuiToTailwind(block.styles, block.type));
  const inlineStyle = getInlineStyle(block);
  const styleAttribute = inlineStyle ? ` style="${escapeAttribute(inlineStyle)}"` : "";

  if (schema.tag === "img") {
    return `<img src="${escapeAttribute(block[schema.srcField ?? "src"])}" class="${classes}"${styleAttribute} alt="안내" />`;
  }

  if (schema.tag === "a") {
    return `<a href="${escapeAttribute(block[schema.hrefField ?? "link"] || "#")}" target="_blank" rel="noopener noreferrer" class="${classes}"${styleAttribute}>${escapeHtml(block[schema.contentField ?? "content"])}</a>`;
  }

  if (schema.selfClosing) {
    return `<${schema.tag} class="${classes}"${styleAttribute} />`;
  }

  const children = schema.childField ? block[schema.childField]?.map(compileBlock).join("") ?? "" : "";
  const content = schema.contentField ? escapeHtml(block[schema.contentField]) : children;

  return `<${schema.tag} class="${classes}"${styleAttribute}>${content}</${schema.tag}>`;
}
