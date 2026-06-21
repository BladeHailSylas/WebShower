import { useMemo } from "react";
import type { HtmlBlock } from "../../../types/types";
import { compileBlocksForCodeView } from "../../../features/block-studio/blocks/html/blockHtmlCompiler";
import { formatCodeViewHtml } from "../../../features/block-studio/code-view/formatCodeViewHtml";
import {
  tokenizeCodeViewHtml,
  type CodeViewTokenKind,
} from "../../../features/block-studio/code-view/tokenizeCodeViewHtml";

interface CodeViewPanelProps {
  blocks: HtmlBlock[];
}

const tokenClasses: Record<CodeViewTokenKind, string> = {
  punctuation: "text-slate-400",
  tagName: "text-cyan-300",
  attributeName: "text-sky-300",
  attributeValue: "text-amber-300",
  text: "text-slate-100",
  comment: "text-emerald-400",
  scriptContent: "text-violet-300",
  styleContent: "text-fuchsia-300",
};

export default function CodeViewPanel({ blocks }: CodeViewPanelProps) {
  const rawCode = useMemo(() => compileBlocksForCodeView(blocks), [blocks]);
  const formattedCode = useMemo(() => formatCodeViewHtml(rawCode), [rawCode]);
  const tokens = useMemo(() => tokenizeCodeViewHtml(formattedCode), [formattedCode]);
  const hasCode = blocks.length > 0;

  const handleCopy = async () => {
    if (!hasCode) return;
    await navigator.clipboard.writeText(formattedCode);
  };

  if (!hasCode) {
    return (
      <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs text-center px-4">
        캔버스에 블록을 추가하면 HTML 코드가 여기에 표시됩니다.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex justify-end shrink-0">
        <button
          type="button"
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 active:scale-95 transition"
        >
          복사
        </button>
      </div>
      <pre className="flex-1 overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100 font-mono whitespace-pre-wrap wrap-break-word">
        <code>
          {tokens.map((token, index) => (
            <span key={`${index}-${token.kind}`} className={tokenClasses[token.kind]}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
