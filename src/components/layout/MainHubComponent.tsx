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
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
          크리에이티브 코딩 스튜디오 허브
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-2 leading-relaxed">
          수학적 가속도 연산, 데이터 역산 매핑, 구조적 자료구조 원리가 시각 및 청각 예술과 결합하는 가상 테크 실험실입니다.
        </p>
      </div>

      {/* 벤토 그리드 대시보드 (3열 구조) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        
        {/* CARD 1: 디지털 밴드 스튜디오 (대형 - 2열 차지) */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 ease-out flex flex-col justify-between group shadow-sm">
          {/* 비주얼 영역 */}
          <div className="w-full h-48 bg-gradient-to-br from-indigo-50 to-slate-50 relative flex items-center justify-center p-4 border-b border-slate-100">
            <svg className="w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 500 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 라이트 테마용 연한 오선지 라인 */}
              <path d="M10 75 H490" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M10 45 H490" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M10 105 H490" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
              {/* 음파 그래픽 */}
              <path d="M30 75 Q 80 15, 130 75 T 230 75 T 330 75 T 430 75 T 470 75" stroke="url(#piano-grad-light)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
              <path d="M50 75 Q 100 135, 150 75 T 250 75 T 350 75 T 450 75" stroke="#6366f1" strokeWidth="1.5" opacity="0.5" />
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
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-600 border border-indigo-100">Rule-based AI 화성학</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-600 border border-purple-100">Format 1 멀티 트랙 MIDI</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200">Web Audio API</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">디지털 밴드 스튜디오 (가상 피아노)</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                사용자가 타임라인에 입력한 선율 데이터를 가중치 기반 화성학 알고리즘으로 실시간 분석하여, 멜로디에 가장 완벽하게 동화되는 왼손 아르페지오 반주 트랙을 스스로 계산 및 결합하는 지능형 음악 환경입니다.
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
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-600 border border-purple-100">JSON 듀얼 로딩</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200">고해상도 PNG</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-purple-600 transition-colors">픽셀 스튜디오</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                인덱스 참조 모델 구조를 지니며, 완성된 도트를 컴퓨터 제어 포맷인 JSON 데이터와 실물 소장용 이미지 파일인 PNG 포맷으로 모두 추출 가능한 하이브리드 보존 시스템입니다.
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
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-600 border border-emerald-100">2D 선형 대수 벡터</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-50 text-cyan-600 border border-cyan-100">위치 보정 알고리즘</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200">Delta Time 동기화</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">미니 그래비티 샌드박스</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Unity 엔진 의존성 없이, 프레임 오차를 잡는 델타 타임(dt)과 법선·접선 벡터 분해 공식 기반의 2차원 탄성 충돌 연산을 밑바닥부터 완전 연산 형태로 시뮬레이션하는 동적 제어 물리 샌드박스입니다.
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
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-50 text-cyan-600 border border-cyan-100">LocalStorage 트래킹</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200">기초 변수 제어문</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-cyan-600 transition-colors">기초 연산 클리커 게임</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                클릭 메커니즘을 통한 변수 증가 연산, 조건부 최고 점수 갱신 연산을 다룹니다. 로컬 스토리지를 활용하여 새로고침 후에도 기록이 유지되는 데이터 저장 구조를 시연합니다.
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
      <div className="mt-16 text-center text-[11px] text-slate-400 font-mono tracking-wide">
        &copy; 2026 Coding Creative Studio Hub. Powered by Pure Frontend Web API.
      </div>

    </div>
  );
}