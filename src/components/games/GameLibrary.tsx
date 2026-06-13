import React, { useState } from 'react';
import SnakeStudio from './SnakeStudio';
import PacmanStudio from './PacmanStudio';
import TetrisStudio from './TetrisStudio';

type GameType = 'SNAKE' | 'PACMAN' | 'TETRIS' | 'NONE';

export default function GameLibrary() {
  const [selectedGame, setSelectedGame] = useState<GameType>('NONE');

  // 메인 허브 화면으로 돌아가는 함수
  const backToLibrary = () => {
    setSelectedGame('NONE');
  };

  return (
    <div className="h-full w-full flex flex-col justify-between touch-none select-none bg-slate-50 overflow-hidden">
      
      {selectedGame === 'NONE' ? (
        // [화면 1] 게임 선택 메뉴 리스트 (아이들의 시선을 끄는 세련된 카드 UI)
        <div className="flex-1 w-full flex flex-col justify-center items-center p-6 gap-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">아케이드 게임 스튜디오</h2>
            <p className="text-sm text-slate-400">데이터와 수학 공식으로 창조된 미니 게임 가상 실험실</p>
          </div>

          <div className="w-full max-w-md flex flex-col gap-3">
            {/* 1. 모던 스네이크 게임 버튼 */}
            <button 
              onClick={() => setSelectedGame('SNAKE')}
              className="w-full p-4 bg-white hover:bg-slate-100 border-2 border-slate-200 active:border-primary rounded-2xl shadow-sm flex items-center justify-between text-left transition-all duration-150"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-xl font-bold">
                  🐍
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">모던 스네이크</h3>
                  <p className="text-xs text-slate-400 mt-0.5">배열의 확장과 성장을 눈으로 확인하는 게임</p>
                </div>
              </div>
              <span className="text-slate-300 text-lg font-bold">▶</span>
            </button>

            {/* 2. 픽셀 팩맨 게임 버튼 */}
            <button 
              onClick={() => setSelectedGame('PACMAN')}
              className="w-full p-4 bg-white hover:bg-slate-100 border-2 border-slate-200 active:border-amber-500 rounded-2xl shadow-sm flex items-center justify-between text-left transition-all duration-150"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 text-xl font-bold">
                  🕹️
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">픽셀 팩맨</h3>
                  <p className="text-xs text-slate-400 mt-0.5">2차원 좌표 행렬 탐색과 추적 AI 알고리즘</p>
                </div>
              </div>
              <span className="text-slate-300 text-lg font-bold">▶</span>
            </button>

            {/* 3. 모던 테트리스 게임 버튼 */}
            <button 
              onClick={() => setSelectedGame('TETRIS')}
              className="w-full p-4 bg-white hover:bg-slate-100 border-2 border-slate-200 active:border-secondary rounded-2xl shadow-sm flex items-center justify-between text-left transition-all duration-150"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary text-xl font-bold">
                  🧱
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">모던 테트리스</h3>
                  <p className="text-xs text-slate-400 mt-0.5">공간 기하학 충돌 판정과 행렬 회전 기법</p>
                </div>
              </div>
              <span className="text-slate-300 text-lg font-bold">▶</span>
            </button>
          </div>

          <div className="bg-slate-100/80 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-400 text-center max-w-xs leading-relaxed">
            💡 <strong>강사 시연 팁:</strong> 아이들에게 직접 게임 종목을 고르게 유도한 뒤, 각 게임 내부의 2차원 데이터가 화면에 어떻게 렌더링되는지 연동 과정을 선포합니다.
          </div>
        </div>
      ) : (
        // [화면 2] 실제 게임 구동 화면 및 공통 뒤로가기 내비게이션 바
        <div className="flex-1 w-full flex flex-col relative overflow-hidden">
          {/* 개별 게임 컴포넌트 동적 로드 */}
          <div className="flex-1 w-full overflow-hidden">
            {selectedGame === 'SNAKE' && <SnakeStudio />}
            {selectedGame === 'PACMAN' && <PacmanStudio />}
            {selectedGame === 'TETRIS' && <TetrisStudio />}
          </div>

          {/* 공통 상시 부유식 '뒤로가기' 버튼 (태블릿 좌측 혹은 우측 하단 틈새 배치용) */}
          <button 
            onClick={backToLibrary}
            className="absolute top-4 left-4 z-30 px-3 py-1.5 bg-slate-900/80 active:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-md backdrop-blur-sm flex items-center gap-1 border border-slate-700/50"
          >
            <span>◀</span> 게임 목록으로
          </button>
        </div>
      )}

    </div>
  );
}