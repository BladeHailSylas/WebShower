import { useState, type SubmitEvent } from "react";
import type { HtmlBlock } from "../../types/types";
import { QRCodeSVG } from "qrcode.react";

interface BlockRendererProps {
  blocks: HtmlBlock[];
}

// 🌟 [Phase 3 신규] 비밀번호 매크로 블록 전용 실시간 미리보기 인터랙티브 컴포넌트
function PasswordPreviewItem({ block, renderFn }: { block: HtmlBlock; renderFn: (b: HtmlBlock) => React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    // 포스트잇 속성 창에 인젝션된 correctAnswer 정답 매칭
    if (inputVal === (block.correctAnswer || '12345')) {
      setIsUnlocked(true);
    } else {
      setIsShaking(true);
      // 0.5초 후 쉐이크 클래스 제거
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // 명세서 사양: 암호 성공 및 전환 연출 (잠긴 요소 언마운트, 보상 요소 페이드인)
  if (isUnlocked) {
    return (
      <div className="w-full border border-slate-200 rounded-2xl p-6 duration-500 animate-fade-in">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-center text-xs font-bold text-emerald-700">
          🔓 자물쇠 해제 완료! 보상이 나타났습니다.
        </div>
        {block.conditionalChildren?.map(child => renderFn(child))}
      </div>
    );
  }

  // 명세서 사양: 초기 진입 상태 및 실패 시 좌우 쉐이크 애니메이션 작동
  return (
    <div className={`w-full p-4 bg-white border border-slate-200 rounded-2xl shadow-sm transition-transform ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
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
      
      {/* 하단에 잠겼을 때 슬롯 트리 조건부 렌더링 */}
      <div className="pt-3 border-t border-dashed border-slate-100">
        {block.defaultChildren?.map(child => renderFn(child))}
      </div>

      {/* 런타임 쉐이크 애니메이션 CSS 주입 */}
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
        // [신규] 이미지 변환 케이스
        case 'IMAGE': return <img key={block.id} src={block.src} alt="학원 안내" className={classes} />;
        case 'PASSWORD_ZONE':
        // 패스워드 전용 조건부 런타임 샌드박스로 우회
        return <PasswordPreviewItem key={block.id} block={block} renderFn={renderBlockToReact} />;
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
        case 'PASSWORD_ZONE':
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
      // 1. 브라우저 내장 런타임 표준 CompressionStream을 이용해 고밀도 gzip 압축 실행
      const stream = new Blob([fullHtmlDocument]).stream();
      const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
      const buffer = await new Response(compressedStream).arrayBuffer();

      // 2. 압축된 바이너리 배열 버퍼를 Base64 가독형 문자열로 안전하게 변환
      let binary = '';
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const encodedData = btoa(binary);

      // 3. URL 주소창에서 특수기호 유실을 차단하기 위한 최종 배포 랩핑
      const safeParam = encodeURIComponent(encodedData);
      setQrUrl(`${window.location.origin}/code?code=${safeParam}`);
      console.log(`${window.location.origin}/code?code=${safeParam}`);
      setIsModalOpen(true);
    } catch (err) {
      console.error("배포 데이터 압축 컴파일링 중 예외가 발생했습니다:", err);
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