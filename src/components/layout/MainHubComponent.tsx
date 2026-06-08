import { useNavigate } from "react-router-dom";


export default function MainHubComponent() {
    const navigate = useNavigate();
return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 p-6 md:p-12 flex flex-col items-center justify-center font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 상단 타이틀 영역 */}
      <div className="text-center max-w-2xl mb-12 animate-fade-in">
        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-wider uppercase border border-indigo-200">
          Creative Coding Framework v2
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3 tracking-tight">
          코딩 스튜디오
        </h1>
        <p className="text-xl text-slate-500 mt-2 leading-relaxed">
          코딩으로 가능한 것들을 알아봅시다
        </p>
      </div>

      {/* 벤토 그리드 대시보드 (3열 구조) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        
        {/* CARD 1: 디지털 밴드 스튜디오 (대형 - 2열 차지) */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 ease-out flex flex-col justify-between group shadow-sm">
          {/* 비주얼 영역 */}
          <div className="w-full h-48 bg-gradient-to-br from-indigo-50 to-slate-50 relative flex items-center justify-center p-4 border-b border-slate-100">
            <svg className="w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 500 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  {/* 라이트 테마용 연한 오선지 라인 (배경) */}
  <path d="M10 75 H490" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
  <path d="M10 45 H490" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
  <path d="M10 105 H490" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />

  {/* 기존 음파 그래픽 (투명도를 0.2, 0.1로 대폭 낮추어 배경 텍스처로 강등) */}
  <path d="M30 75 Q 80 15, 130 75 T 230 75 T 330 75 T 430 75 T 470 75" stroke="url(#piano-grad-light)" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
  <path d="M50 75 Q 100 135, 150 75 T 250 75 T 350 75 T 450 75" stroke="#6366f1" strokeWidth="1.5" opacity="0.1" />

  {/* [신규 추가] 직관적인 모던 피아노 건반 아이콘 (메인 강조) */}
  <g transform="translate(155, 45)">
    {/* 건반 전체 배경 및 테두리 */}
    <rect x="0" y="0" width="190" height="60" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />

    {/* 백건 구분선 (7개 건반) */}
    <line x1="27" y1="0" x2="27" y2="60" stroke="#cbd5e1" strokeWidth="1.5" />
    <line x1="54" y1="0" x2="54" y2="60" stroke="#cbd5e1" strokeWidth="1.5" />
    <line x1="81" y1="0" x2="81" y2="60" stroke="#cbd5e1" strokeWidth="1.5" />
    <line x1="108" y1="0" x2="108" y2="60" stroke="#cbd5e1" strokeWidth="1.5" />
    <line x1="135" y1="0" x2="135" y2="60" stroke="#cbd5e1" strokeWidth="1.5" />
    <line x1="162" y1="0" x2="162" y2="60" stroke="#cbd5e1" strokeWidth="1.5" />

    {/* 흑건 (5개) - 그라데이션 적용하여 세련미 부여 */}
    <rect x="18" y="0" width="16" height="35" rx="2" fill="url(#piano-grad-light)" />
    <rect x="45" y="0" width="16" height="35" rx="2" fill="url(#piano-grad-light)" />
    {/* 미-파 사이는 흑건 없음 */}
    <rect x="99" y="0" width="16" height="35" rx="2" fill="url(#piano-grad-light)" />
    <rect x="126" y="0" width="16" height="35" rx="2" fill="url(#piano-grad-light)" />
    <rect x="153" y="0" width="16" height="35" rx="2" fill="url(#piano-grad-light)" />
  </g>

  <defs>
    <linearGradient id="piano-grad-light" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#6366f1" />
      <stop offset="50%" stopColor="#a855f7" />
      <stop offset="100%" stopColor="#4f46e5" />
    </linearGradient>
  </defs>
</svg>
            <span className="absolute right-4 top-4 text-[10px] font-mono text-indigo-600 font-bold bg-white px-2 py-0.5 rounded border border-indigo-200 shadow-sm">AUDIO ENGINE</span>
          </div>
          {/* 콘텐츠 영역 */}
          <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-600 border border-indigo-100">AI가 만드는 반주</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-600 border border-purple-100">음악 파일 다운로드</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200">어디서나 연주 가능</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">음악 스튜디오</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                어디서나 피아노를 연주하고, 작곡하고, 저장해보세요
              </p>
            </div>
            <button 
              onClick={() => {
                navigate("/piano");
              }}
              className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold border-none rounded-xl mt-5 w-full md:w-auto md:self-end shadow-md shadow-indigo-600/20 transition-all"
            >
              스튜디오 입장
            </button>
          </div>
        </div>

        {/* CARD 2: 픽셀 아트 스튜디오 (중형 - 1열 차지) */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 ease-out flex flex-col justify-between group shadow-sm">
          {/* 비주얼 영역 */}
          <div className="w-full h-48 bg-gradient-to-br from-purple-50 to-slate-50 relative flex items-center justify-center p-6 border-b border-slate-100">
            <svg className="w-24 h-24 opacity-90 group-hover:rotate-12 transition-transform duration-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="30" width="16" height="16" fill="#9333ea" rx="2" />
              <rect x="28" y="30" width="16" height="16" fill="#9333ea" rx="2" />
              <rect x="56" y="30" width="16" height="16" fill="#9333ea" rx="2" />
              <rect x="74" y="30" width="16" height="16" fill="#9333ea" rx="2" />
              <rect x="10" y="48" width="16" height="16" fill="#a855f7" rx="2" />
              <rect x="28" y="48" width="16" height="16" fill="#a855f7" rx="2" />
              <rect x="46" y="48" width="16" height="16" fill="#a855f7" rx="2" />
              <rect x="64" y="48" width="16" height="16" fill="#a855f7" rx="2" />
              <rect x="82" y="48" width="16" height="16" fill="#a855f7" rx="2" />
              <rect x="28" y="66" width="16" height="16" fill="#c084fc" rx="2" />
              <rect x="46" y="66" width="16" height="16" fill="#c084fc" rx="2" />
              <rect x="64" y="66" width="16" height="16" fill="#c084fc" rx="2" />
              <rect x="46" y="84" width="16" height="16" fill="#d8b4fe" rx="2" />
            </svg>
            <span className="absolute right-4 top-4 text-[10px] font-mono text-purple-600 font-bold bg-white px-2 py-0.5 rounded border border-purple-200 shadow-sm">PERSISTENCE</span>
          </div>
          {/* 콘텐츠 영역 */}
          <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-600 border border-purple-100">데이터로 출력</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200">고해상도 PNG</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-purple-600 transition-colors">픽셀 스튜디오</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                픽셀 아트를 그리고, 데이터나 이미지로 저장해보세요
              </p>
            </div>
            <button 
              onClick={() => {
                navigate("/pixel");
              }}
              className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white font-bold border-none rounded-xl mt-5 w-full shadow-md shadow-purple-600/20 transition-all"
            >
              스튜디오 입장
            </button>
          </div>
        </div>

        {/* CARD 3: 미니 그래비티 샌드박스 (중형 - 2열 차지) */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 ease-out flex flex-col justify-between group shadow-sm">
          {/* 비주얼 영역 */}
          <div className="w-full h-48 bg-gradient-to-br from-emerald-50 to-slate-50 relative flex items-center justify-center p-4 border-b border-slate-100">
            <svg className="w-full h-full opacity-90 group-hover:scale-95 transition-all duration-500" viewBox="0 0 500 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="180" cy="65" r="24" fill="url(#ball-grad-1-light)" opacity="0.9"/>
              <circle cx="320" cy="85" r="14" fill="url(#ball-grad-2-light)" opacity="0.9"/>
              <line x1="180" y1="65" x2="240" y2="110" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="320" y1="85" x2="280" y2="40" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M 180 65 Q 250 100, 320 85" stroke="#cbd5e1" strokeWidth="1" />
              <defs>
                <linearGradient id="ball-grad-1-light" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="ball-grad-2-light" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0e7490" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute right-4 top-4 text-[10px] font-mono text-emerald-600 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-sm">PHYSICS SYSTEM</span>
          </div>
          {/* 콘텐츠 영역 */}
          <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-600 border border-emerald-100">2D 물리학</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-50 text-cyan-600 border border-cyan-100">공식 자동 계산</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">물리 샌드박스</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                공식 계산은 컴퓨터의 특기
              </p>
            </div>
            <button 
              onClick={() => {
                navigate("/sandbox");
              }}
              className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-none rounded-xl mt-5 w-full md:w-auto md:self-end shadow-md shadow-emerald-600/20 transition-all"
            >
              샌드박스 입장
            </button>
          </div>
        </div>

        {/* CARD 4: 미니 클리커 게임 (소형 - 1열 차지) */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 ease-out flex flex-col justify-between group shadow-sm">
          {/* 비주얼 영역 */}
          <div className="w-full h-48 bg-gradient-to-br from-cyan-50 to-slate-50 relative flex items-center justify-center p-6 border-b border-slate-100">
            <svg className="w-20 h-20 opacity-90 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 밝은 테마에 맞춘 트로피 라인 아트 */}
              <path d="M12 16 H52 V28 C52 40, 42 48, 32 48 C22 48, 12 40, 12 28 Z" stroke="#0891b2" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M32 48 V56 M20 56 H44" stroke="#0891b2" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="32" cy="28" r="4" fill="#0891b2" />
            </svg>
            <span className="absolute right-4 top-4 text-[10px] font-mono text-cyan-600 font-bold bg-white px-2 py-0.5 rounded border border-cyan-200 shadow-sm">LOGIC CONTROL</span>
          </div>
          {/* 콘텐츠 영역 */}
          <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-50 text-cyan-600 border border-cyan-100">값 저장</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-cyan-600 transition-colors">클리커 게임</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                게임 개발도 얼마든지
              </p>
            </div>
            <button 
              onClick={() => {
                navigate("/clicker");
              }}
              className="btn btn-sm bg-cyan-600 hover:bg-cyan-700 text-white font-bold border-none rounded-xl mt-5 w-full shadow-md shadow-cyan-600/20 transition-all"
            >
              게임 시작
            </button>
          </div>
        </div>

      </div>

      {/* 하단 푸터 영역 */}
      <div className="mt-16 text-center text-slate-400 tracking-wide">
	<p className="text-lg font-bold">
	...그리고 더 많은 것들!
	</p>
	<p className="text-[8px] flex flex-col max-w-5xl mb-8">
	워드 프로세서, 스프레드시트, 프레젠테이션, 노트 필기 앱, PDF 편집기, 래스터 그래픽 편집기, 벡터 그래픽 편집기, 비디오 편집기, UI/UX 디자인 툴, 3D 모델링 및 렌더링, 컴퓨터 지원 설계(CAD), 디지털 오디오 워크스테이션(DAW), 오디오 편집기, 음악 스트리밍 플레이어, 통합 개발 환경(IDE), 데이터베이스 관리 시스템(DBMS), API 테스트 툴, 터미널 에뮬레이터, 가상화 및 컨테이너 프로그램, 비즈니스 메신저, 화상 회의 앱, 이메일 클라이언트, 프로젝트 관리 툴, 웹 브라우저, FTP 클라이언트, 웹 크롤러/스크래퍼, 가상 사설망(VPN), AI 챗봇 클라이언트, 데이터 시각화 툴, 데이터 연산 노트북, 게임 런처/플랫폼, 비디오 플레이어, 게임 엔진, 라이브 스트리밍 송출 앱, 화면 캡처 및 녹화기, 백신/안티바이러스, 파일 압축 해제 프로그램, 디스크 정리 및 최적화, 패스워드 매니저, 파일 복구 프로그램, 전사적 자원 관리(ERP), 고객 관계 관리(CRM), 지리 정보 시스템(GIS), 회계/세무 프로그램, POS 시스템, 원격 제어 프로그램, 폰트 관리 프로그램, 벤치마크 프로그램, 전자책 뷰어/제작 툴, 모바일 에뮬레이터...
	</p>
	<p className="text-[11px] font-mono">
        &copy; 2026 Coding Creative Studio Hub. Powered by Pure Frontend Web API.
	</p>
      </div>

    </div>
  );
}