import { useState, type SubmitEvent } from "react";
import type { HtmlBlock } from "../../types/types";
import { QRCodeSVG } from "qrcode.react";

interface BlockRendererProps {
  blocks: HtmlBlock[];
}

// =============================================================
// 🌟 [Phase 3] 1. 비밀번호 구역 미리보기 컴포넌트 (추상화 슬롯 반영)
// =============================================================
function PasswordPreviewItem({ block, renderFn }: { block: HtmlBlock; renderFn: (b: HtmlBlock) => React.ReactNode }) {
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
      <div className="w-full duration-500 animate-fade-in">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-center text-xs font-bold text-emerald-700">
          🔓 자물쇠 해제 완료!
        </div>
        {/* 캡슐화 완료: conditionalChildren 적용 */}
        {block.conditionalChildren?.map(child => renderFn(child))}
      </div>
    );
  }

  return (
    <div className={`w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      <form onSubmit={handleSubmit} className="space-y-3 mb-4">
        <input 
          type="password" 
          placeholder="비밀번호를 입력하세요" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 ring-slate-800"
        />
        <button type="submit" className="w-full py-3 bg-slate-900 text-white text-xs font-bold rounded-xl active:scale-95 transition-transform">
          열기
        </button>
      </form>
      <div className="pt-3 border-t border-dashed border-slate-100">
        {/* 캡슐화 완료: defaultChildren 적용 */}
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
// 🌟 [Phase 3] 2. 여닫는 구역 미리보기 컴포넌트 (buttonText 제거 버전)
// =============================================================
function TogglePreviewItem({ block, renderFn }: { block: HtmlBlock; renderFn: (b: HtmlBlock) => React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full border border-slate-200 rounded-xl p-4 bg-white shadow-sm my-2 text-slate-900">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          {/* 캡슐화 완료: defaultChildren (상시 노출) */}
          {block.defaultChildren?.map(child => renderFn(child))}
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors shrink-0"
        >
          {/* buttonText 속성 없이 시스템 빌트인으로 가볍게 처리 */}
          {isOpen ? '닫기' : '열기'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-dashed border-slate-100 animate-fade-in">
          {/* 캡슐화 완료: conditionalChildren (펼침 노출) */}
          {block.conditionalChildren?.map(child => renderFn(child))}
        </div>
      )}
    </div>
  );
}

export default function BlockRenderer({blocks} : BlockRendererProps) {
    const [qrUrl, setQrUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // 🌟 [신규] 모달 개폐 상태 추가
    // 핵심 엔진: 블록 트리를 React DOM으로 재귀적 렌더링
    // 1. React DOM 변환기 내부에 추가
    const renderBlockToReact = (block: HtmlBlock) => {
      const classes = block.styles?.className || '';
      switch (block.type) {
        case 'CONTAINER': return <div key={block.id} className={classes}>{block.children?.map(renderBlockToReact)}</div>;
        case 'H1': return <h1 key={block.id} className={classes}>{block.content}</h1>;
        case 'P': return <p key={block.id} className={classes}>{block.content}</p>;
        case 'A':
        return (
          <a 
            key={block.id} 
            href={block.link || '#'} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{textDecoration: 'underline'}}
            className={classes}
          >
            {block.content}(링크)
          </a>
        );
        // [신규] 이미지 변환 케이스
        case 'IMAGE': return <img key={block.id} src={block.src} alt="학원 안내" className={classes} />;
        case 'PASSWORD_ZONE':
        // 패스워드 전용 조건부 런타임 샌드박스로 우회
        return <PasswordPreviewItem key={block.id} block={block} renderFn={renderBlockToReact} />;
        case 'TOGGLE_ZONE':
        return <TogglePreviewItem key={block.id} block={block} renderFn={renderBlockToReact} />;
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
        case 'A': return `<a href="${block.link || '#'}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;" class="${classes}">${block.content + '(링크)' || ''}</a>`;
        case 'PASSWORD_ZONE':{
        // 명세서 사양: 고유 해시 모듈화 및 DOM 탐색용 클래스 바인딩 출력
        console.log(block.id);
        const blockId = `pw_${block.id}`;
        const uniqueId = blockId.split("-")[2];
        const answer = block.correctAnswer || '12345';
        const lockedHtml = block.defaultChildren?.map(buildHtmlString).join('') || '';
        const unlockedHtml = block.conditionalChildren?.map(buildHtmlString).join('') || '';
        return(`
<div id="${blockId}-root" class="w-full max-w-md p-6 bg-white rounded-2xl shadow-md my-4 mx-auto">
  <script>
    function verifyPassword_${uniqueId}(event) {
      event.preventDefault();
      const root = document.getElementById('${blockId}-root');
      const inputVal = root.querySelector('.user-pw-input').value;
      const answer = "${answer}";
      if (inputVal === answer) {
        root.querySelector('.zone-locked').style.display = 'none';
        root.querySelector('.zone-unlocked').style.display = 'block';
      } else {
        const form = root.querySelector('.password-form');
        form.style.animation = 'compiled-shake 0.5s ease-in-out';
        setTimeout(() => { form.style.animation = ''; }, 500);
      }
    }
  </script>
  <style>
    @keyframes compiled-shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }
  </style>
  <div class="zone-locked" style="display: block;">
    <form class="password-form" onsubmit="verifyPassword_${uniqueId}(event)" class="space-y-4" style="display: flex; flex-direction: column; gap: 12px;">
      <input type="password" class="user-pw-input" placeholder="비밀번호를 입력하세요" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 12px; box-sizing: border-box;" />
      <button type="submit" style="width: 100%; padding: 12px; background: #0f172a; color: white; font-weight: bold; border-radius: 12px; border: none; cursor: pointer;">열기</button>
    </form>
    <div class="mt-6">
      ${lockedHtml}
    </div>
  </div>
  <div class="zone-unlocked" style="display: none;">
    ${unlockedHtml}
  </div>
</div>`.trim());
        }
        case 'TOGGLE_ZONE': {
        const blockId = `pw_${block.id}`;
        const uniqueId = blockId.split("-")[2];
        const defaultHtml = block.defaultChildren?.map(buildHtmlString).join('') || '';
        const conditionalHtml = block.conditionalChildren?.map(buildHtmlString).join('') || '';

        return `
<div id="${blockId}-root" class="${classes}">
  <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px;">
    <div style="flex: 1;">${defaultHtml}</div>
    <button onclick="toggleSection_${uniqueId}(this)" style="padding: 6px 12px; background: #f1f5f9; color: #334155; font-size: 12px; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; shrink-0;">열기</button>
  </div>
  <div class="zone-conditional" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px dashed #e2e8f0;">
    ${conditionalHtml}
  </div>
  <script>
    function toggleSection_${uniqueId}(btn) {
      const root = document.getElementById('${blockId}-root');
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
        default: return '';
      }
    };
    // [신규] 단일 파일 컴파일 및 Base64 인코딩 엔진
    const generateExportData = async () => { // 🌟 비동기(async) 프로세스로 전환
    const bodyContent = blocks.map(buildHtmlString).join('');
    
    const fullHtmlDocument = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>내가 만든 첫 웹</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen text-slate-900 p-4">
  ${bodyContent}
</body>
</html>`.trim();

    try {
      // 🌟 [변경] 브라우저 메모리 압축 대신 로컬 Vite Node.js 미들웨어 파일 저장소로 전송
      const response = await fetch('/api/save-page', {
        method: 'POST',
        headers: { 'Content-Type': 'text/html;charset=utf-8' },
        body: fullHtmlDocument
      });
      
      const data = await response.json();

      // 🎯 데이터 크기와 무관하게 단 8자리의 해시 키값 포인터로 고정된 청정 URL 발급!
      setQrUrl(`${window.location.origin}/code?key=${data.key}`);
      console.log(`${window.location.origin}/code?key=${data.key}`);
      setIsModalOpen(true);
    } catch (err) {
      console.error("로컬 파일 시스템 컴파일 저장 중 오류가 발생했습니다:", err);
    }
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
        {/* 🌟 [신규] 화면 전체를 덮는 고해상도 QR 배포 모달 레이어 */}
        {isModalOpen && qrUrl && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsModalOpen(false)} // 배경 클릭 시 모달 닫기 (실리적 닫기)
          >
            <div 
              className="bg-white rounded-3xl p-8 shadow-2xl max-w-3xl w-full text-center flex flex-col items-center gap-3 border border-slate-100 relative max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()} // 내부 클릭 시 닫힘 현상 방지
            >
              {/* 모달 상단 헤더 */}
              <div className="w-full flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                  <span>📱</span> 스마트폰 무설치 웹 배포
                </span>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 font-bold px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* 🎯 모달의 핵심 장점인 초대형 고화질 오프라인 QR 코드 (크기를 280px로 시원하게 확장) */}
              <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100/50 flex items-center justify-center">
                <QRCodeSVG value={qrUrl} size={550} level="M" />
              </div>

              {/* 하단 텍스트 명세 가이드 */}
              <div className="flex flex-col gap-1 text-center">
                <span className="text-sm font-black text-slate-900">기기 카메라로 QR 스캔하기</span>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                  프레임 제한을 없애고 선명도를 극대화했습니다.<br />
                  강의실 저 멀리 자리한 스마트폰 카메라로 조준해도<br />
                  오차 없이 0.1초 만에 배포 웹파일을 즉시 복원 및 다운로드합니다.
                </p>
              </div>

              {/* 메인 닫기 액션 */}
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-full py-3 bg-slate-950 text-white text-xs font-bold rounded-xl hover:bg-slate-900 active:scale-98 transition-all shadow-md"
              >
                확인 및 작업 돌아가기
              </button>
            </div>
          </div>
        )}
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">단일 HTML 내보내기 대기 중</span>
            <button 
              onClick={generateExportData}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold shadow-md transition-all active:scale-95"
            >
              배포용 QR 생성
            </button>
          </div>
      </div>
    </div>
  );
}