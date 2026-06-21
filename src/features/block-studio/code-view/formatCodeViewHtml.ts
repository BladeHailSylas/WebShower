const BLOCK_TAGS = new Set([
  "a",
  "article",
  "button",
  "div",
  "form",
  "h1",
  "hr",
  "img",
  "input",
  "li",
  "p",
  "script",
  "section",
  "style",
  "ul",
]);

const VOID_TAGS = new Set(["hr", "img", "input"]);
const RAW_TEXT_TAGS = new Set(["script", "style"]);

interface HtmlTag {
  name: string;
  isClosing: boolean;
  isSelfClosing: boolean;
  source: string;
}

interface OpenTagFrame {
  name: string;
  hasBlockChild: boolean;
  preservesRawText: boolean;
}

function readTag(source: string, start: number): { end: number; tag: HtmlTag } | null {
  if (source.startsWith("<!--", start)) {
    const commentEnd = source.indexOf("-->", start + 4);
    const end = commentEnd === -1 ? source.length : commentEnd + 3;
    return {
      end,
      tag: { name: "", isClosing: false, isSelfClosing: true, source: source.slice(start, end) },
    };
  }

  let end = start + 1;
  let quote: '"' | "'" | null = null;

  while (end < source.length) {
    const character = source[end];
    if (quote) {
      if (character === quote) quote = null;
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === ">") {
      end += 1;
      break;
    }
    end += 1;
  }

  if (end > source.length || source[end - 1] !== ">") return null;

  const tagSource = source.slice(start, end);
  const match = tagSource.match(/^<\s*(\/)?\s*([a-zA-Z][\w:-]*)/);
  const name = match?.[2]?.toLowerCase() ?? "";

  return {
    end,
    tag: {
      name,
      isClosing: Boolean(match?.[1]),
      isSelfClosing: /\/\s*>$/.test(tagSource) || VOID_TAGS.has(name) || !name,
      source: tagSource,
    },
  };
}

function currentLineIsBlank(value: string): boolean {
  const lineStart = value.lastIndexOf("\n") + 1;
  return value.slice(lineStart).trim().length === 0;
}

function appendAtIndent(value: string, content: string, depth: number): string {
  if (value.length === 0) return `${"  ".repeat(depth)}${content}`;
  if (currentLineIsBlank(value)) return `${value.replace(/[ \t]+$/, "")}${"  ".repeat(depth)}${content}`;
  return `${value}\n${"  ".repeat(depth)}${content}`;
}

/**
 * Formats only the predictable HTML fragments produced by Block Studio.
 * Text and raw script/style bodies are never parsed or rewritten.
 */
export function formatCodeViewHtml(rawHtml: string): string {
  let output = "";
  let index = 0;
  let pendingLineBreak = false;
  const stack: OpenTagFrame[] = [];

  while (index < rawHtml.length) {
    const rawFrame = stack.at(-1);
    if (rawFrame?.preservesRawText) {
      const closingStart = rawHtml.toLowerCase().indexOf(`</${rawFrame.name}`, index);
      if (closingStart === -1) {
        output += rawHtml.slice(index);
        break;
      }
      if (closingStart > index) {
        output += rawHtml.slice(index, closingStart);
        index = closingStart;
        continue;
      }
    }

    if (rawHtml[index] !== "<") {
      const nextTag = rawHtml.indexOf("<", index);
      const textEnd = nextTag === -1 ? rawHtml.length : nextTag;
      const text = rawHtml.slice(index, textEnd);

      if (text.trim().length === 0) {
        if (text.includes("\n")) {
          pendingLineBreak = true;
        } else {
          output += text;
        }
      } else {
        if (pendingLineBreak && output && !currentLineIsBlank(output)) output += "\n";
        if (currentLineIsBlank(output)) output += "  ".repeat(stack.length);
        output += text;
        pendingLineBreak = false;
      }

      index = textEnd;
      continue;
    }

    const parsed = readTag(rawHtml, index);
    if (!parsed) {
      output += rawHtml[index];
      index += 1;
      continue;
    }

    const { tag } = parsed;
    const isBlock = BLOCK_TAGS.has(tag.name) || !tag.name;

    if (tag.isClosing) {
      const frame = stack.pop();
      const depth = stack.length;
      if (frame?.preservesRawText) {
        output += tag.source;
      } else if (frame?.hasBlockChild) {
        output = appendAtIndent(output, tag.source, depth);
      } else {
        output += tag.source;
      }
    } else if (isBlock) {
      const parent = stack.at(-1);
      if (parent) parent.hasBlockChild = true;
      output = appendAtIndent(output, tag.source, stack.length);
      if (!tag.isSelfClosing) {
        stack.push({
          name: tag.name,
          hasBlockChild: false,
          preservesRawText: RAW_TEXT_TAGS.has(tag.name),
        });
      }
    } else {
      if (pendingLineBreak && output && !currentLineIsBlank(output)) output += "\n";
      if (currentLineIsBlank(output)) output += "  ".repeat(stack.length);
      output += tag.source;
      if (!tag.isSelfClosing) {
        stack.push({ name: tag.name, hasBlockChild: false, preservesRawText: false });
      }
    }

    pendingLineBreak = false;
    index = parsed.end;
  }

  return output.trim();
}
