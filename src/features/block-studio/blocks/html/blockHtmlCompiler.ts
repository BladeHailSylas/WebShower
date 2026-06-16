import type { HtmlBlock } from "../../../../types/types";
import { getBlockDefinition } from "../definitions";
import { compileHtmlSchema } from "./htmlSchemaCompiler";
import { compilePasswordZone, compileToggleZone } from "./interactiveExporters";

export function compileBlockHtml(block: HtmlBlock): string {
  const definition = getBlockDefinition(block.type);

  if (definition.htmlSchema) {
    return compileHtmlSchema(block, definition.htmlSchema, compileBlockHtml);
  }

  if (definition.htmlExporterKey === "passwordZone") {
    return compilePasswordZone(block, compileBlockHtml);
  }

  if (definition.htmlExporterKey === "toggleZone") {
    return compileToggleZone(block, compileBlockHtml);
  }

  return "";
}

export function compilePageHtml(blocks: HtmlBlock[]): string {
  const bodyContent = blocks.map(compileBlockHtml).join("");

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>블록 스튜디오 배포 웹페이지</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen text-slate-900 p-4 flex flex-col items-center gap-4">
  <div class="w-full max-w-lg space-y-4">${bodyContent}</div>
</body>
</html>`.trim();
}
