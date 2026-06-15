import { useState, type SubmitEvent } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { HtmlBlock, StyleProps } from '../../types/types';

interface BlockRendererProps {
  blocks: HtmlBlock[];
}

// =============================================================
// 🎨 [Phase 3 핵심] GUI 스타일 옵션을 Tailwind 클래스로 실시간 변역하는 레이어
// =============================================================
function transformGuiToTailwind(styles?: StyleProps, blockType?: string): string {
  if (!styles) return '';
  const classes: string[] = [];

  // 1. 글자 색상 번역
  if (styles.textColor === 'gray') classes.push('text-slate-500');
  else if (styles.textColor === 'red') classes.push('text-red-600');
  else if (styles.textColor === 'blue') classes.push('text-blue-600');
  else if (styles.textColor === 'green') classes.push('text-emerald-600');
  else if (styles.textColor === 'black') classes.push('text-slate-900');

  // 2. 배경 색상 번역 (아이들이 직관적으로 볼 수 있게 연한 톤 테마 가벨 적용)
  if (styles.bgColor === 'white') classes.push('bg-white border border-slate-200');
  else if (styles.bgColor === 'slate') classes.push('bg-slate-100 border border-slate-200');
  else if (styles.bgColor === 'red') classes.push('bg-red-50 border border-red-100');
  else if (styles.bgColor === 'blue') classes.push('bg-blue-50 border border-blue-100');
  else if (styles.bgColor === 'green') classes.push('bg-emerald-50 border border-emerald-100');
  else if (styles.bgColor === 'yellow') classes.push('bg-amber-50 border border-amber-100');

  // 🌟 글자 크기 정밀 번역 매킹 주입
  if (styles.fontSize === 'small') classes.push('text-xs');
  else if (styles.fontSize === 'large') classes.push('text-xl');
  else if (styles.fontSize === 'xlarge') classes.push('text-3xl');
  else classes.push('text-base'); // 기본값 'normal' (보통) 일 시 매핑

  // 3. 정렬 번역
  if (styles.textAlign === 'center') classes.push('text-center');
  else if (styles.textAlign === 'right') classes.push('text-right');
  else if (styles.textAlign === 'left') classes.push('text-left');

  // 4. 체크박스 속성 번역
  if (styles.isBold) classes.push('font-bold');
  if (styles.isRounded) classes.push('rounded-2xl');

  // 5. 컴포넌트 도메인별 기본 UI 깨짐 방지용 디폴트 레이아웃 쉴드
  if (blockType === 'LINK') {
    classes.push('px-5 py-3 text-xs inline-block text-center shadow-md transition-all active:scale-95 underline');
    if (!styles.bgColor || styles.bgColor === 'none') {
      classes.push('bg-blue-600 text-white border-none'); // 기본 링크 버튼은 눈에 띄게 블루 코팅
    }
  } else if (blockType === 'PASSWORD_ZONE' || blockType === 'TOGGLE_ZONE') {
    classes.push('p-5 shadow-sm w-full max-w-md mx-auto');
    if (!styles.bgColor || styles.bgColor === 'none') {
      classes.push('bg-white rounded-2xl border border-slate-200');
    }
  } else if (blockType === 'CONTAINER') {
    classes.push('p-4 min-h-[60px] border border-dashed border-slate-300 w-full rounded-xl');
  } else {
    classes.push('mb-1 leading-relaxed');
  }

  return classes.join(' ');
}

// =============================================================
// 🔒 PASSWORD_ZONE 프리뷰 컴포넌트 (추상화 슬롯 및 GUI 스타일 동기화)
// =============================================================
function PasswordPreviewItem({ block, renderFn, className }: { block: HtmlBlock; renderFn: (b: HtmlBlock) => React.ReactNode; className: string }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (inputVal === (block.correctAnswer || '12345')) {
      setIsUnlocked(true);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  if (isUnlocked) {
    return (
      <div className={`w-full duration-500 animate-fade-in ${className}`}>
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-center text-xs font-bold text-emerald-700">
          🔓 자물쇠 해제 완료!
        </div>
        {block.conditionalChildren?.map(child => renderFn(child))}
      </div>
    );
  }

  return (
    <div className={`w-full transition-transform ${className} ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      <form onSubmit={handleSubmit} className="space-y-3 mb-4">
        <input 
          type="password" 
          placeholder="비밀번호를 입력하세요" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 ring-slate-800 text-slate-900 bg-white"
        />
        <button type="submit" className="w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-xl active:scale-95 transition-transform">
          열기
        </button>
      </form>
      <div className="pt-3 border-t border-dashed border-slate-200/60">
        {block.defaultChildren?.map(child => renderFn(child))}
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

// =============================================================
// 📂 TOGGLE_ZONE 프리뷰 컴포넌트 (빌트인 토글 가동 및 GUI 스타일 동기화)
// =============================================================
function TogglePreviewItem({ block, renderFn, className }: { block: HtmlBlock; renderFn: (b: HtmlBlock) => React.ReactNode; className: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`w-full text-slate-900 ${className}`}>
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          {block.defaultChildren?.map(child => renderFn(child))}
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 bg-slate-900/5 hover:bg-slate-900/10 active:bg-slate-900/25 text-slate-700 text-xs font-bold rounded-lg transition-colors shrink-0"
        >
          {isOpen ? '닫기' : '열기'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-dashed border-slate-200/60 animate-fade-in">
          {block.conditionalChildren?.map(child => renderFn(child))}
        </div>
      )}
    </div>
  );
}

// =============================================================
// 메인 샌드박스 엔진
// =============================================================
export default function BlockRenderer({ blocks }: BlockRendererProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🌟 [Phase 3 핵심 관통] 재귀 렌더러 루프 내부에 GUI 변역 레이어 강제 가인젝션
  const renderBlockToReact = (block: HtmlBlock): React.ReactNode => {
    // 텍스트 인풋 className 분석기를 완전 철거하고, 구체화된 스타일 오브젝트 변역기 가동
    const classes = transformGuiToTailwind(block.styles, block.type);

    switch (block.type) {
      case 'CONTAINER':
        return (
          <div key={block.id} className={classes}>
            {block.children?.map(child => renderBlockToReact(child))}
          </div>
        );
      case 'H1':
        return <h1 key={block.id} className={classes}>{block.content}</h1>;
      case 'P':
        return <p key={block.id} className={classes}>{block.content}</p>;
      case 'IMAGE':
        return <img key={block.id} src={block.src} alt="미리보기" className={classes} />;
      case 'A':
        return (
          <a key={block.id} href={block.link || '#'} target="_blank" rel="noopener noreferrer" className={classes}>
            {block.content}
          </a>
        );
      case 'PASSWORD_ZONE':
        return <PasswordPreviewItem key={block.id} block={block} renderFn={renderBlockToReact} className={classes} />;
      case 'TOGGLE_ZONE':
        return <TogglePreviewItem key={block.id} block={block} renderFn={renderBlockToReact} className={classes} />;
      default:
        return null;
    }
  };

  // Phase 4: 컴파일러 출력부 직렬화 (기존 변역 구문 동기화 빌드)
  const buildHtmlString = (block: HtmlBlock): string => {
    const classes = transformGuiToTailwind(block.styles, block.type);

    switch (block.type) {
      case 'CONTAINER':
        return `<div class="${classes}">${block.children?.map(buildHtmlString).join('') || ''}</div>`;
      case 'H1':
        return `<h1 class="${classes}">${block.content || ''}</h1>`;
      case 'P':
        return `<p class="${classes}">${block.content || ''}</p>`;
      case 'IMAGE':
        return `<img src="${block.src || ''}" class="${classes}" alt="안내" />`;
      case 'A':
        return `<a href="${block.link || '#'}" target="_blank" rel="noopener noreferrer" class="${classes}">${block.content || ''}</a>`;
      
      case 'PASSWORD_ZONE': {
        const uniqueId = `pw-${block.id.substring(0, 6)}`;
        const answer = block.correctAnswer || '12345';
        const defaultHtml = block.defaultChildren?.map(buildHtmlString).join('') || '';
        const conditionalHtml = block.conditionalChildren?.map(buildHtmlString).join('') || '';

        return `
<div id="${uniqueId}-root" class="${classes}">
  <script>
    function verifyPassword_${uniqueId}(event) {
      event.preventDefault();
      const root = document.getElementById('${uniqueId}-root');
      const inputVal = root.querySelector('.user-pw-input').value;
      if (inputVal === "${answer}") {
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
    <form class="password-form" onsubmit="verifyPassword_${uniqueId}(event)" style="display: flex; flex-direction: column; gap: 12px;">
      <input type="password" class="user-pw-input" placeholder="비밀번호를 입력하세요" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 12px; box-sizing: border-box; background:#fff;" />
      <button type="submit" style="width: 100%; padding: 12px; background: #0f172a; color: white; font-weight: bold; border-radius: 12px; border: none; cursor: pointer;">열기</button>
    </form>
    <div style="margin-top: 16px;">${defaultHtml}</div>
  </div>
  <div class="zone-conditional" style="display: none;">${conditionalHtml}</div>
</div>`.trim();
      }

      case 'TOGGLE_ZONE': {
        const uniqueId = `tg-${block.id.substring(0, 6)}`;
        const defaultHtml = block.defaultChildren?.map(buildHtmlString).join('') || '';
        const conditionalHtml = block.conditionalChildren?.map(buildHtmlString).join('') || '';

        return `
<div id="${uniqueId}-root" class="${classes}">
  <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
    <div style="flex: 1;">${defaultHtml}</div>
    <button onclick="toggleSection_${uniqueId}(this)" style="padding: 6px 12px; background: rgba(15,23,42,0.05); color: #334155; font-size: 12px; font-weight: bold; border-radius: 8px; border: none; cursor: pointer;">열기</button>
  </div>
  <div class="zone-conditional" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e2e8f0;">
    ${conditionalHtml}
  </div>
  <script>
    function toggleSection_${uniqueId}(btn) {
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

      default:
        return '';
    }
  };

  // Node.js 하이브리드 포인터 저장소 기반 파일 관리 컴파일 배포 가동
  const generateExportData = async () => {
    const bodyContent = blocks.map(buildHtmlString).join('');
    const fullHtmlDocument = `
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

    try {
      const response = await fetch('/api/save-page', {
        method: 'POST',
        headers: { 'Content-Type': 'text/html;charset=utf-8' },
        body: fullHtmlDocument
      });
      const data = await response.json();
      setQrUrl(`${window.location.origin}/?key=${data.key}`);
      setIsModalOpen(true);
    } catch (err) {
      console.error("로컬 서버 미들웨어 정적 파일 백업 중 전송 예외:", err);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50">
      <div className="bg-slate-200 border-b border-slate-300 p-3 flex items-center gap-4 shrink-0">
        <div className="flex gap-1.5 ml-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="bg-white px-4 py-1.5 text-xs text-slate-400 rounded-md border border-slate-300 w-full flex items-center justify-center font-mono">
          🖥️ live_preview_sandbox
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {blocks.length === 0 ? (
          <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs">
            캔버스에 블록을 조립하면 실시간 결과가 반영됩니다
          </div>
        ) : (
          <div className="w-full space-y-4 max-w-md mx-auto">
            {blocks.map(block => renderBlockToReact(block))}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 bg-white shrink-0 p-5 flex items-center justify-between shadow-xl z-10">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">추상화 매크로 엔진</span>
          {qrUrl && (
            <button onClick={() => setIsModalOpen(true)} className="text-[11px] text-indigo-600 font-bold underline text-left hover:text-indigo-500">
              배포용 QR 모달 다시 열기
            </button>
          )}
        </div>
        <button 
          onClick={generateExportData} 
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
        >
          배포용 QR 생성
        </button>
      </div>

      {/* 대형 QR 코드 팝업 모달 */}
      {isModalOpen && qrUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center flex flex-col items-center gap-6 border border-slate-100" onClick={e => e.stopPropagation()}>
            <div className="w-full flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                <span>📱</span> 모바일 즉시 배포 검증
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold px-2 py-1 bg-slate-50 rounded-lg text-xs">✕</button>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100/50 flex items-center justify-center">
              <QRCodeSVG value={qrUrl} size={260} level="M" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-900">독립 실행형 바닐라 코드 압축팩 주입 완료</span>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                추상화 슬롯 트리 아키텍처가 전개된 단일 마크업 파일입니다.<br />
                스마트폰 카메라로 스캔하여 토글 작동을 테스트하세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}