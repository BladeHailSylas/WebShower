import { useState } from "react";
import type { HtmlBlock } from "../../types/types";
import { QRCodeSVG } from "qrcode.react";

interface BlockRendererProps {
  blocks: HtmlBlock[];
}

export default function BlockRenderer({blocks} : BlockRendererProps) {
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    // 핵심 엔진: 블록 트리를 React DOM으로 재귀적 렌더링
    // 1. React DOM 변환기 내부에 추가
    const renderBlockToReact = (block: HtmlBlock) => {
      const classes = block.styles?.className || '';
      switch (block.type) {
        case 'CONTAINER': return <div key={block.id} className={classes}>{block.children?.map(renderBlockToReact)}</div>;
        case 'H1': return <h1 key={block.id} className={classes}>{block.content}</h1>;
        case 'P': return <p key={block.id} className={classes}>{block.content}</p>;
        // [신규] 이미지 변환 케이스
        case 'IMAGE': return <img key={block.id} src={block.src} alt="학원 안내" className={classes} />;
        default: return null;
      }
    };

    // 2. 순수 HTML 문자열 변환기 내부에 추가
    const buildHtmlString = (block: HtmlBlock): string => {
      const classes = block.styles?.className || '';
      switch (block.type) {
        case 'CONTAINER': return `<div class="${classes}">${block.children?.map(buildHtmlString).join('') || ''}</div>`;
        case 'H1': return `<h1 class="${classes}">${block.content || ''}</h1>`;
        case 'P': return `<p class="${classes}">${block.content || ''}</p>`;
        // [신규] 이미지 HTML 태그 변환 케이스
        case 'IMAGE': return `<img src="${block.src || ''}" alt="학원 안내" class="${classes}" />`;
        default: return '';
      }
    };
    // [신규] 단일 파일 컴파일 및 Base64 인코딩 엔진
    const generateExportData = () => {
      const bodyContent = blocks.map(buildHtmlString).join('');

      const fullHtmlDocument = `
  <!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>내가 만든 첫 웹사이트</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 min-h-screen text-slate-900">
    ${bodyContent}
  </body>
  </html>`.trim();

      // 1. 순수 바이트 압축
      const encodedData = btoa(unescape(encodeURIComponent(fullHtmlDocument)));

      // 2. [수정] URL 주소창에서 '+' 기호가 공백으로 깨지는 것을 방지하기 위해 한 번 더 인코딩
      const safeParam = encodeURIComponent(encodedData);

      const currentOrigin = window.location.origin;
      setQrUrl(`${currentOrigin}/?code=${safeParam}`);
      console.log(`${currentOrigin}/code?code=${encodedData}`);
    };
  return (
    <div className="flex flex-col h-full w-full bg-slate-50">
      {/* 브라우저 상단 목업 (Mockup) 헤더 */}
      <div className="bg-slate-200 border-b border-slate-300 p-3 flex items-center gap-4 shrink-0">
        <div className="flex gap-1.5 ml-2">
          <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500/20"></div>
        </div>
        <div className="bg-white px-4 py-1.5 text-xs text-slate-400 rounded-md border border-slate-300 w-full flex items-center justify-center shadow-inner font-mono">
          <span className="text-slate-300 mr-2">🔒</span> localhost:3000/preview
        </div>
      </div>

      {/* 실제 렌더링 화면 구역 */}
      <div className="flex-1 overflow-y-auto p-4 bg-white relative">
        {blocks.length === 0 ? (
          <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50/50">
            <div className="text-center">
                <div className="text-2xl mb-2">✨</div>
                <p className="text-sm">컴파일된 웹페이지가 실시간으로 표시됩니다</p>
            </div>
          </div>
        ) : (
          /* 파싱 엔진 출력부 */
          <div className="w-full">
            {blocks.map(block => renderBlockToReact(block))}
          </div>
        )}
      </div>

      {/* [수정] 최하단 QR 코드 생성 및 표시 구역 */}
      <div className="border-t border-slate-200 bg-white shrink-0 p-5 flex flex-col items-center gap-4 shadow-xl z-10">
        {qrUrl ? (
          <div className="flex flex-col items-center gap-3 w-full text-center animate-fade-in">
            {/* size를 200으로 크게 확장하고, 복구 레벨을 M으로 조정하여 격자를 칼같이 선명하게 표현 */}
            <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200/80">
              <QRCodeSVG value={qrUrl} size={200} level="M" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-slate-800 tracking-tight">📱 스마트폰으로 소장하기</span>
              <span className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                카메라로 QR을 스캔하면 방금 만든 웹사이트가<br/>하나의 HTML 파일로 즉시 다운로드됩니다.
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">단일 HTML 내보내기 대기 중</span>
            <button 
              onClick={generateExportData}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95"
            >
              배포용 QR 생성
            </button>
          </div>
        )}
      </div>
    </div>
  );
}