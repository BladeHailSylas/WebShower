import type { HtmlBlock } from "../../../../types/types";
import type { HtmlSchemaDefinition } from "../types/htmlSchema.types";
import { escapeAttribute, escapeHtml } from "./escapeHtml";
import { transformGuiToTailwind } from "./transformGuiToTailwind";

type CompileBlock = (block: HtmlBlock) => string;

export function compileHtmlSchema(
  block: HtmlBlock,
  schema: HtmlSchemaDefinition,
  compileBlock: CompileBlock,
): string {
  const classes = escapeAttribute(transformGuiToTailwind(block.styles, block.type));

  if (schema.tag === "img") {
    return `<img src="${escapeAttribute(block[schema.srcField ?? "src"])}" class="${classes}" alt="안내" />`;
  }

  if (schema.tag === "a") {
    return `<a href="${escapeAttribute(block[schema.hrefField ?? "link"] || "#")}" target="_blank" rel="noopener noreferrer" class="${classes}">${escapeHtml(block[schema.contentField ?? "content"])}</a>`;
  }

  const children = schema.childField ? block[schema.childField]?.map(compileBlock).join("") ?? "" : "";
  const content = schema.contentField ? escapeHtml(block[schema.contentField]) : children;

  return `<${schema.tag} class="${classes}">${content}</${schema.tag}>`;
}
