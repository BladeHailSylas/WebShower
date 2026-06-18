import type { HtmlBlock } from "../../../../types/types";
import type { HtmlSchemaDefinition } from "../types/htmlSchema.types";
import { escapeAttribute, escapeHtml } from "./escapeHtml";
import { transformGuiToTailwind } from "./transformGuiToTailwind";

type CompileBlock = (block: HtmlBlock) => string;

function getInlineStyle(block: HtmlBlock): string {
  if (block.type !== "GRID_ZONE") return "";

  const gridCols = block.styles?.gridCols ?? 2;
  return `display: grid; grid-template-columns: repeat(${gridCols}, minmax(0, 1fr)); gap: 12px;`;
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
    return `<img src="${escapeAttribute(block[schema.srcField ?? "src"])}" class="${classes}" alt="안내" />`;
  }

  if (schema.tag === "a") {
    return `<a href="${escapeAttribute(block[schema.hrefField ?? "link"] || "#")}" target="_blank" rel="noopener noreferrer" class="${classes}">${escapeHtml(block[schema.contentField ?? "content"])}</a>`;
  }

  if (schema.selfClosing) {
    return `<${schema.tag} class="${classes}"${styleAttribute} />`;
  }

  const children = schema.childField ? block[schema.childField]?.map(compileBlock).join("") ?? "" : "";
  const content = schema.contentField ? escapeHtml(block[schema.contentField]) : children;

  return `<${schema.tag} class="${classes}"${styleAttribute}>${content}</${schema.tag}>`;
}
