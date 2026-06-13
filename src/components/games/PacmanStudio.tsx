import React, { useState, useEffect, useCallback } from 'react';

// =================================================================
// SHOW STUDENTS: 강사 시연용 게임 규칙 제어 변수 (치트키)
// =================================================================
const PACMAN_CONFIG = {
  SPEED: 250,             // 게임 업데이트 속도 (ms, 낮을수록 빠름)
  SCORE_PER_DOT: 50,      // 보석 1개당 점수
  GHOST_INTELLIGENCE: 0.7 // 유령이 팩맨을 정확히 추적할 확률 (0~1, 1이면 무조건 최단거리 추적)
};

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// 11x11 고정 미로 맵 데이터 (1: 벽, 2: 보석, 0: 빈 공간)
const INITIAL_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,0,2,2,2,2,1],
  [1,1,1,1,2,1,2,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1],
];

export default function PacmanStudio() {
  const [map, setMap] = useState<number[][]>(INITIAL_MAP);
  const [pacman, setPacman] = useState<Point>({ x: 5, y: 5 });
  const [ghost, setGhost] = useState<Point>({ x: 1, y: 1 });
  const [dir, setDir] = useState<Direction>('RIGHT');
  const [score, setScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);

  const resetGame = () => {
    setMap(INITIAL_MAP.map(row => [...row]));
    setPacman({ x: 5, y: 5 });
    setGhost({ x: 1, y: 1 });
    setDir('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsGameWon(false);
    setIsPlaying(true);
  };

  // 벽 충돌 검사 유틸리티
  const isValidMove = (x: number, y: number) => {
    if (x < 0 || x >= 11 || y < 0 || y >= 11) return false;
    return map[y][x] !== 1;
  };

  // 유령의 AI 이동 경로 연산 (A* 알고리즘의 초간량 근사화)
  const getNextGhostPos = useCallback((g: Point, p: Point): Point => {
    const directions: Point[] = [
      { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
    ];
    
    // 확률적으로 최단 거리 추적 또는 무작위 이동 판단
    if (Math.random() > PACMAN_CONFIG.GHOST_INTELLIGENCE) {
      const validMoves = directions
        .map(d => ({ x: g.x + d.x, y: g.y + d.y }))
        .filter(pos => isValidMove(pos.x, pos.y));
      return validMoves.length > 0 ? validMoves[Math.floor(Math.random() * validMoves.length)] : g;
    }

    let bestMove = g;
    let minDistance = Infinity;

    directions.forEach(d => {
      const nextX = g.x + d.x;
      const nextY = g.y + d.y;
      if (isValidMove(nextX, nextY)) {
        const dist = Math.abs(nextX - p.x) + Math.abs(nextY - p.y); // 맨해튼 거리 측정
        if (dist < minDistance) {
          minDistance = dist;
          bestMove = { x: nextX, y: nextY };
        }
      }
    });

    return bestMove;
  }, [map]);

  // 메인 게임 루프 기계실
  useEffect(() => {
    if (!isPlaying || isGameOver || isGameWon) return;

    const gameTick = () => {
      // 1. 팩맨 좌표 이동 계산
      setPacman((prev) => {
        let nextX = prev.x;
        let nextY = prev.y;
        if (dir === 'UP') nextY -= 1;
        if (dir === 'DOWN') nextY += 1;
        if (dir === 'LEFT') nextX -= 1;
        if (dir === 'RIGHT') nextX += 1;

        const moved = isValidMove(nextX, nextY) ? { x: nextX, y: nextY } : prev;

        // 보석 먹기 연산 및 상태 동기화
        if (map[moved.y][moved.x] === 2) {
          setMap(prevMap => {
            const newMap = prevMap.map(r => [...r]);
            newMap[moved.y][moved.x] = 0;
            
            // 남은 보석이 있는지 전수조사 (승리 조건 체크)
            const hasDots = newMap.some(r => r.includes(2));
            if (!hasDots) setIsGameWon(true);
            
            return newMap;
          });
          setScore(s => s + PACMAN_CONFIG.SCORE_PER_DOT);
        }
        return moved;
      });

      // 2. 유령 좌표 이동 및 충돌 정밀 검사
      setGhost((prevGhost) => {
        const nextGhost = getNextGhostPos(prevGhost, pacman);
        if (nextGhost.x === pacman.x && nextGhost.y === pacman.y) {
          setIsGameOver(true);
        }
        return nextGhost;
      });
    };

    const timer = setInterval(gameTick, PACMAN_CONFIG.SPEED);
    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, isGameWon, dir, pacman, getNextGhostPos]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-between touch-none select-none bg-slate-50 overflow-hidden">
      {/* 대시보드 상단 */}
      <div className="w-full flex justify-between items-center px-6 py-4 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">픽셀 팩맨</h2>
          <span className="text-xs text-slate-400">행렬 좌표 분석과 추적 인공지능 알고리즘</span>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-500 uppercase">Score</div>
          <div className="text-2xl font-black text-amber-500 font-mono leading-none">{score}</div>
        </div>
      </div>

      {/* 2차원 행렬 맵 렌더러 */}
      <div className="flex-1 w-full flex items-center justify-center p-4">
        <div 
          className="bg-slate-900 p-2 border-4 border-slate-700 rounded-xl shadow-2xl relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(11, minmax(0, 1fr))`,
            width: 'min(100%, 340px)',
            aspectRatio: '1 / 1'
          }}
        >
          {map.map((row, y) =>
            row.map((cell, x) => {
              const isPacman = pacman.x === x && pacman.y === y;
              const isGhost = ghost.x === x && ghost.y === y;

              return (
                <div 
                  key={`${y}-${x}`} 
                  className={`w-full h-full flex items-center justify-center relative border-[0.5px] border-slate-800/30 ${
                    cell === 1 ? 'bg-blue-900 border-blue-700 rounded-sm' : 'bg-slate-950'
                  }`}
                >
                  {cell === 2 && !isPacman && !isGhost && (
                    <div className="w-2 h-2 bg-amber-200 rounded-full shadow-glow" />
                  )}
                  {isPacman && (
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-xs text-black animate-bounce z-10">
                      C
                    </div>
                  )}
                  {isGhost && (
                    <div className="w-6 h-6 bg-red-500 rounded-t-full rounded-b-md flex items-center justify-center text-[10px] text-white font-mono font-bold z-10 animate-pulse">
                      M
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* 오버레이 제어 상태 창 */}
          {(!isPlaying || isGameOver || isGameWon) && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20">
              <h3 className="text-xl font-black mb-3 tracking-wide text-white">
                {isGameWon ? '🎉 MISSION COMPLETE' : isGameOver ? '💀 GAME OVER' : 'READY PACMAN'}
              </h3>
              <button onClick={resetGame} className="btn btn-warning btn-wide font-bold shadow-md">
                {isGameOver || isGameWon ? '다시 도전하기' : '시뮬레이션 시작'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 태블릿 하단 D-Pad */}
      <div className="w-full max-w-sm px-6 pb-6 shrink-0">
        <div className="grid grid-cols-3 grid-rows-3 gap-2 h-36">
          <button onPointerDown={() => setDir('UP')} className="col-start-2 row-start-1 bg-slate-200 active:bg-slate-300 rounded-xl font-bold text-slate-700 text-xl">▲</button>
          <button onPointerDown={() => setDir('LEFT')} className="col-start-1 row-start-2 bg-slate-200 active:bg-slate-300 rounded-xl font-bold text-slate-700 text-xl">◀</button>
          <button onPointerDown={() => setDir('RIGHT')} className="col-start-3 row-start-2 bg-slate-200 active:bg-slate-300 rounded-xl font-bold text-slate-700 text-xl">▶</button>
          <button onPointerDown={() => setDir('DOWN')} className="col-start-2 row-start-3 bg-slate-200 active:bg-slate-300 rounded-xl font-bold text-slate-700 text-xl">▼</button>
        </div>
      </div>
    </div>
  );
}