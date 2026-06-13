import React, { useState, useEffect, useCallback } from 'react';

// =================================================================
// SHOW STUDENTS: 강사 시연용 게임 규칙 제어 변수 (치트키)
// =================================================================
const TETRIS_CONFIG = {
  COLS: 10,
  ROWS: 20,
  NORMAL_SPEED: 700,      // 블록 하강 기본 속도 (ms)
  LINE_SCORE_BASE: 1000,  // 한 줄 제거 시 점수 가중치 (치트 연출용 수치 수정 가능)
};

// 테트로미노 형태학 행렬 선언 (I, O, T, S, Z, J, L)
const TETROMINOES = {
  I: [[1, 1, 1, 1]],
  O: [[2, 2], [2, 2]],
  T: [[0, 3, 0], [3, 3, 3]],
  S: [[0, 4, 4], [4, 4, 0]],
  Z: [[5, 5, 0], [0, 5, 5]],
  J: [[6, 0, 0], [6, 6, 6]],
  L: [[0, 0, 7], [7, 7, 7]],
};

const COLORS = [
  'transparent',
  '#22d3ee', // I: Cyan
  '#facc15', // O: Yellow
  '#c084fc', // T: Purple
  '#4ade80', // S: Green
  '#f87171', // Z: Red
  '#60a5fa', // J: Blue
  '#fb923c', // L: Orange
];

export default function TetrisStudio() {
  const [grid, setGrid] = useState<number[][]>(() => Array(TETRIS_CONFIG.ROWS).fill(null).map(() => Array(TETRIS_CONFIG.COLS).fill(0)));
  const [currentPiece, setCurrentPiece] = useState({ shape: TETROMINOES.I, x: 3, y: 0, colorIdx: 1 });
  const [nextPieceType, setNextPieceType] = useState<keyof typeof TETROMINOES>('O');
  const [score, setScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // 무작위 넥스트 블록 생성기 (7-Bag 기반 근사화)
  const getRandomType = (): keyof typeof TETROMINOES => {
    const keys = Object.keys(TETROMINOES) as (keyof typeof TETROMINOES)[];
    return keys[Math.floor(Math.random() * keys.length)];
  };

  const spawnPiece = useCallback((nextType: keyof typeof TETROMINOES) => {
    const shape = TETROMINOES[nextType];
    const colorIdx = Object.keys(TETROMINOES).indexOf(nextType) + 1;
    const newPiece = {
      shape,
      x: Math.floor((TETRIS_CONFIG.COLS - shape[0].length) / 2),
      y: 0,
      colorIdx
    };

    // 생성 즉시 충돌 시 게임 오버 판정 예외 처리
    if (checkCollision(shape, newPiece.x, newPiece.y, grid)) {
      setIsGameOver(true);
      setIsPlaying(false);
    } else {
      setCurrentPiece(newPiece);
      setNextPieceType(getRandomType());
    }
  }, [grid]);

  const startGame = () => {
    setGrid(Array(TETRIS_CONFIG.ROWS).fill(null).map(() => Array(TETRIS_CONFIG.COLS).fill(0)));
    setScore(0);
    setIsGameOver(false);
    const firstType = getRandomType();
    const nextType = getRandomType();
    setNextPieceType(nextType);
    
    const shape = TETROMINOES[firstType];
    setCurrentPiece({
      shape,
      x: Math.floor((TETRIS_CONFIG.COLS - shape[0].length) / 2),
      y: 0,
      colorIdx: Object.keys(TETROMINOES).indexOf(firstType) + 1
    });
    setIsPlaying(true);
  };

  // 물리 충돌 시스템 핵심 판정 연산 (공간 기하학)
  function checkCollision(shape: number[][], offsetX: number, offsetY: number, currentGrid: number[][]) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const nextX = offsetX + c;
          const nextY = offsetY + r;

          if (nextX < 0 || nextX >= TETRIS_CONFIG.COLS || nextY >= TETRIS_CONFIG.ROWS) return true;
          if (nextY >= 0 && currentGrid[nextY][nextX] !== 0) return true;
        }
      }
    }
    return false;
  }

  // 고정(Lock-in) 및 라인 클리어 행렬 연산
  const mergeToGrid = useCallback(() => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(row => [...row]);
      
      currentPiece.shape.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0) {
            const gridX = currentPiece.x + c;
            const gridY = currentPiece.y + r;
            if (gridY >= 0) newGrid[gridY][gridX] = currentPiece.colorIdx;
          }
        });
      });

      // 가로 한 줄이 가득 찼는지 필터링 연산 수행
      let clearedLines = 0;
      const filteredGrid = newGrid.filter(row => {
        const isLineFull = row.every(cell => cell !== 0);
        if (isLineFull) clearedLines++;
        return !isLineFull;
      });

      // 터진 줄 수만큼 위쪽에 상단 빈 행렬(0 배열) 수혈 연산
      while (filteredGrid.length < TETRIS_CONFIG.ROWS) {
        filteredGrid.unshift(Array(TETRIS_CONFIG.COLS).fill(0));
      }

      if (clearedLines > 0) {
        setScore(s => s + clearedLines * TETRIS_CONFIG.LINE_SCORE_BASE);
      }

      setTimeout(() => spawnPiece(nextPieceType), 0);
      return filteredGrid;
    });
  }, [currentPiece, nextPieceType, spawnPiece]);

  // 하강 제어기
  const moveDown = useCallback(() => {
    if (!isPlaying || isGameOver) return;
    if (!checkCollision(currentPiece.shape, currentPiece.x, currentPiece.y + 1, grid)) {
      setCurrentPiece(prev => ({ ...prev, y: prev.y + 1 }));
    } else {
      mergeToGrid();
    }
  }, [isPlaying, isGameOver, currentPiece, grid, mergeToGrid]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const interval = setInterval(moveDown, TETRIS_CONFIG.NORMAL_SPEED);
    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, moveDown]);

  // 수평 이동 핸들러
  const moveHorizontal = (dir: number) => {
    if (!isPlaying) return;
    if (!checkCollision(currentPiece.shape, currentPiece.x + dir, currentPiece.y, grid)) {
      setCurrentPiece(prev => ({ ...prev, x: prev.x + dir }));
    }
  };

  // 행렬 전치(Transpose) 및 반전 기반의 90도 회전 연산 기법
  const rotatePiece = () => {
    if (!isPlaying) return;
    const shape = currentPiece.shape;
    const rotated = Array(shape[0].length).fill(null).map(() => Array(shape.length).fill(0));
    
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        rotated[c][shape.length - 1 - r] = shape[r][c];
      }
    }

    if (!checkCollision(rotated, currentPiece.x, currentPiece.y, grid)) {
      setCurrentPiece(prev => ({ ...prev, shape: rotated }));
    }
  };

  // 모던 룰 핵심: 하드 드롭 (바인딩 즉시 고정)
  const hardDrop = () => {
    if (!isPlaying) return;
    let currentY = currentPiece.y;
    while (!checkCollision(currentPiece.shape, currentPiece.x, currentY + 1, grid)) {
      currentY++;
    }
    setCurrentPiece(prev => {
      const dropped = { ...prev, y: currentY };
      // 배치 상태 동기화를 고속 매칭하기 위한 즉시 실행 흐름 제어
      setTimeout(() => {
        setGrid(g => {
          const newGrid = g.map(row => [...row]);
          dropped.shape.forEach((row, r) => {
            row.forEach((value, c) => {
              if (value !== 0 && dropped.y + r >= 0) {
                newGrid[dropped.y + r][dropped.x + c] = dropped.colorIdx;
              }
            });
          });
          let clearedLines = 0;
          const filteredGrid = newGrid.filter(row => {
            const isFull = row.every(cell => cell !== 0);
            if (isFull) clearedLines++;
            return !isFull;
          });
          while (filteredGrid.length < TETRIS_CONFIG.ROWS) {
            filteredGrid.unshift(Array(TETRIS_CONFIG.COLS).fill(0));
          }
          if (clearedLines > 0) setScore(s => s + clearedLines * TETRIS_CONFIG.LINE_SCORE_BASE);
          setTimeout(() => spawnPiece(nextPieceType), 0);
          return filteredGrid;
        });
      }, 0);
      return dropped;
    });
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-between touch-none select-none bg-slate-50 overflow-hidden">
      {/* 최상단 헤더 */}
      <div className="w-full flex justify-between items-center px-6 py-3 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">모던 테트리스</h2>
          <span className="text-xs text-slate-400">2차원 평면 데이터 행렬의 압축과 변형 가이드라인</span>
        </div>
        <div className="text-right flex items-center gap-4">
          <div className="bg-slate-100 p-1.5 rounded-lg border text-center">
            <div className="text-[9px] uppercase font-bold text-slate-400">Next</div>
            <div className="text-sm font-black text-slate-700 font-mono">{nextPieceType}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Score</div>
            <div className="text-xl font-black text-secondary font-mono leading-none">{score}</div>
          </div>
        </div>
      </div>

      {/* 테트리스 10x20 메인 매트릭스 스크린 */}
      <div className="flex-1 w-full flex items-center justify-center p-2">
        <div 
          className="bg-slate-950 border-2 border-slate-800 rounded-xl shadow-inner relative overflow-hidden"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${TETRIS_CONFIG.COLS}, minmax(0, 1fr))`,
            width: 'min(100%, 210px)',
            aspectRatio: '1 / 2'
          }}
        >
          {grid.map((row, y) =>
            row.map((cellValue, x) => {
              // 현재 제어 중인 테트로미노 알맹이 오버레이 연산 표현
              let activeColorIdx = cellValue;
              const isCurrentPiecePoint = 
                y >= currentPiece.y && 
                y < currentPiece.y + currentPiece.shape.length &&
                x >= currentPiece.x && 
                x < currentPiece.x + currentPiece.shape[0].length &&
                currentPiece.shape[y - currentPiece.y][x - currentPiece.x] !== 0;

              if (isCurrentPiecePoint) {
                activeColorIdx = currentPiece.colorIdx;
              }

              return (
                <div 
                  key={`${y}-${x}`} 
                  className="w-full h-full border-[0.3px] border-slate-900"
                  style={{ backgroundColor: COLORS[activeColorIdx] }}
                />
              );
            })
          )}

          {/* 오버레이 팝업 시스템 */}
          {(!isPlaying || isGameOver) && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <h3 className="text-white text-lg font-bold mb-3">{isGameOver ? 'GAME OVER' : 'READY TETRIS'}</h3>
              <button onClick={startGame} className="btn btn-secondary btn-sm font-bold w-36 shadow-md">
                시뮬레이션 시작
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 태블릿용 와이드 제어 콘솔 패널 */}
      <div className="w-full max-w-sm px-6 pb-6 shrink-0 flex flex-col gap-2">
        {/* 이동 패드 */}
        <div className="grid grid-cols-3 gap-2 h-14">
          <button onPointerDown={() => moveHorizontal(-1)} className="bg-slate-200 active:bg-slate-300 rounded-xl font-bold text-slate-700 text-lg">◀</button>
          <button onPointerDown={() => rotatePiece()} className="bg-slate-300 active:bg-slate-400 rounded-xl font-bold text-slate-800 text-sm">ROTATE</button>
          <button onPointerDown={() => moveHorizontal(1)} className="bg-slate-200 active:bg-slate-300 rounded-xl font-bold text-slate-700 text-lg">▶</button>
        </div>
        {/* 낙하 패드 */}
        <div className="grid grid-cols-2 gap-2 h-14">
          <button onPointerDown={() => moveDown()} className="bg-slate-200 active:bg-slate-300 rounded-xl font-bold text-slate-700 text-sm">SOFT DROP</button>
          <button onPointerDown={() => hardDrop()} className="bg-sky-100 active:bg-sky-200 text-sky-700 rounded-xl font-black text-sm">🚀 HARD DROP</button>
        </div>
      </div>
    </div>
  );
}