import type { HtmlBlock } from "../../../../types/types";
import { escapeAttribute, escapeJsString } from "./escapeHtml";
import { transformGuiToTailwind } from "./transformGuiToTailwind";

type CompileBlock = (block: HtmlBlock) => string;

function createSafeId(prefix: string, id: string): string {
  return `${prefix}-${id}`.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function createSafeFunctionName(prefix: string, id: string): string {
  return `${prefix}_${id}`.replace(/[^a-zA-Z0-9_]/g, "_");
}

export function compilePasswordZone(block: HtmlBlock, compileBlock: CompileBlock): string {
  const uniqueId = createSafeId("pw", block.id);
  const functionName = createSafeFunctionName("verifyPassword", block.id);
  const answer = escapeJsString(block.correctAnswer || "12345");
  const defaultHtml = block.defaultChildren?.map(compileBlock).join("") || "";
  const conditionalHtml = block.conditionalChildren?.map(compileBlock).join("") || "";
  const classes = escapeAttribute(transformGuiToTailwind(block.styles, block.type));

  return `
<div id="${uniqueId}-root" class="${classes}">
  <script>
    function ${functionName}(event) {
      event.preventDefault();
      const root = document.getElementById('${uniqueId}-root');
      const inputVal = root.querySelector('.user-pw-input').value;
      if (inputVal === ${answer}) {
        root.querySelector('.zone-default').style.display = 'none';
        root.querySelector('.zone-conditional').style.display = 'block';
      } else {
        const form = root.querySelector('.password-form');
        form.style.animation = 'compiled-shake 0.5s ease-in-out';
        setTimeout(() => { form.style.animation = ''; }, 500);
      }
    }
  </script>
  <style>
    @keyframes compiled-shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
  </style>
  <div class="zone-default" style="display: block;">
    <form class="password-form" onsubmit="${functionName}(event)" style="display: flex; flex-direction: column; gap: 12px;">
      <input type="password" class="user-pw-input" placeholder="비밀번호를 입력하세요" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 12px; box-sizing: border-box; background:#fff;" />
      <button type="submit" style="width: 100%; padding: 12px; background: #0f172a; color: white; font-weight: bold; border-radius: 12px; border: none; cursor: pointer;">열기</button>
    </form>
    <div style="margin-top: 16px;">${defaultHtml}</div>
  </div>
  <div class="zone-conditional" style="display: none;">${conditionalHtml}</div>
</div>`.trim();
}

export function compileToggleZone(block: HtmlBlock, compileBlock: CompileBlock): string {
  const uniqueId = createSafeId("tg", block.id);
  const functionName = createSafeFunctionName("toggleSection", block.id);
  const defaultHtml = block.defaultChildren?.map(compileBlock).join("") || "";
  const conditionalHtml = block.conditionalChildren?.map(compileBlock).join("") || "";
  const classes = escapeAttribute(transformGuiToTailwind(block.styles, block.type));

  return `
<div id="${uniqueId}-root" class="${classes}">
  <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
    <div style="flex: 1;">${defaultHtml}</div>
    <button onclick="${functionName}(this)" style="padding: 6px 12px; background: rgba(15,23,42,0.05); color: #334155; font-size: 12px; font-weight: bold; border-radius: 8px; border: none; cursor: pointer;">열기</button>
  </div>
  <div class="zone-conditional" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e2e8f0;">
    ${conditionalHtml}
  </div>
  <script>
    function ${functionName}(btn) {
      const root = document.getElementById('${uniqueId}-root');
      const target = root.querySelector('.zone-conditional');
      const isHidden = target.style.display === 'none';
      if (isHidden) {
        target.style.display = 'block';
        btn.innerText = '닫기';
      } else {
        target.style.display = 'none';
        btn.innerText = '열기';
      }
    }
  </script>
</div>`.trim();
}
