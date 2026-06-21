export type CodeViewTokenKind =
  | "punctuation"
  | "tagName"
  | "attributeName"
  | "attributeValue"
  | "text"
  | "comment"
  | "scriptContent"
  | "styleContent";

export interface CodeViewToken {
  kind: CodeViewTokenKind;
  text: string;
}

function pushToken(tokens: CodeViewToken[], kind: CodeViewTokenKind, text: string): void {
  if (!text) return;
  const previous = tokens.at(-1);
  if (previous?.kind === kind) {
    previous.text += text;
  } else {
    tokens.push({ kind, text });
  }
}

function findTagEnd(source: string, start: number): number {
  let quote: '"' | "'" | null = null;
  for (let index = start + 1; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === quote) quote = null;
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === ">") {
      return index + 1;
    }
  }
  return source.length;
}

function tokenizeTag(source: string, tokens: CodeViewToken[]): { name: string; isClosing: boolean } {
  let index = 0;
  pushToken(tokens, "punctuation", "<");
  index += 1;

  while (/\s/.test(source[index] ?? "")) {
    pushToken(tokens, "text", source[index]);
    index += 1;
  }

  const isClosing = source[index] === "/";
  if (isClosing) {
    pushToken(tokens, "punctuation", "/");
    index += 1;
  }

  while (/\s/.test(source[index] ?? "")) {
    pushToken(tokens, "text", source[index]);
    index += 1;
  }

  const nameStart = index;
  while (/[\w:-]/.test(source[index] ?? "")) index += 1;
  const name = source.slice(nameStart, index);
  pushToken(tokens, "tagName", name);

  while (index < source.length) {
    const character = source[index];
    if (/\s/.test(character)) {
      const whitespaceStart = index;
      while (/\s/.test(source[index] ?? "")) index += 1;
      pushToken(tokens, "text", source.slice(whitespaceStart, index));
    } else if (character === ">") {
      pushToken(tokens, "punctuation", character);
      index += 1;
    } else if (character === "/" && source[index + 1] === ">") {
      pushToken(tokens, "punctuation", "/>");
      index += 2;
    } else if (character === "=") {
      pushToken(tokens, "punctuation", character);
      index += 1;
    } else if (character === '"' || character === "'") {
      const quote = character;
      const valueStart = index;
      index += 1;
      while (index < source.length && source[index] !== quote) index += 1;
      if (index < source.length) index += 1;
      pushToken(tokens, "attributeValue", source.slice(valueStart, index));
    } else {
      const attributeStart = index;
      while (index < source.length && !/[\s=>]/.test(source[index]) && source[index] !== "/") index += 1;
      pushToken(tokens, "attributeName", source.slice(attributeStart, index));
    }
  }

  return { name: name.toLowerCase(), isClosing };
}

/** Tokenizes formatted HTML for safe rendering as React text children. */
export function tokenizeCodeViewHtml(formattedHtml: string): CodeViewToken[] {
  const tokens: CodeViewToken[] = [];
  const lowerHtml = formattedHtml.toLowerCase();
  let index = 0;
  let rawTextTag: "script" | "style" | null = null;

  while (index < formattedHtml.length) {
    if (rawTextTag) {
      const closingStart = lowerHtml.indexOf(`</${rawTextTag}`, index);
      const rawEnd = closingStart === -1 ? formattedHtml.length : closingStart;
      pushToken(tokens, rawTextTag === "script" ? "scriptContent" : "styleContent", formattedHtml.slice(index, rawEnd));
      index = rawEnd;
      rawTextTag = null;
      continue;
    }

    if (formattedHtml.startsWith("<!--", index)) {
      const commentEnd = formattedHtml.indexOf("-->", index + 4);
      const end = commentEnd === -1 ? formattedHtml.length : commentEnd + 3;
      pushToken(tokens, "comment", formattedHtml.slice(index, end));
      index = end;
      continue;
    }

    if (formattedHtml[index] !== "<") {
      const nextTag = formattedHtml.indexOf("<", index);
      const end = nextTag === -1 ? formattedHtml.length : nextTag;
      pushToken(tokens, "text", formattedHtml.slice(index, end));
      index = end;
      continue;
    }

    if (/^<![^-]/.test(formattedHtml.slice(index, index + 4))) {
      const end = findTagEnd(formattedHtml, index);
      pushToken(tokens, "comment", formattedHtml.slice(index, end));
      index = end;
      continue;
    }

    const end = findTagEnd(formattedHtml, index);
    const tag = tokenizeTag(formattedHtml.slice(index, end), tokens);
    if (!tag.isClosing && (tag.name === "script" || tag.name === "style")) rawTextTag = tag.name;
    index = end;
  }

  return tokens;
}
