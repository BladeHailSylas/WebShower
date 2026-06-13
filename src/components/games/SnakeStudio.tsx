import { useState, useEffect, useCallback } from 'react';

// =================================================================
// SHOW STUDENTS: 강사 시연용 게임 밸런스 제어 변수 (치트키)
// =================================================================
const GAME_CONFIG = {
  GRID_SIZE: 15,          // 15x15 2차원 격자
  INITIAL_SPEED: 100,     // 뱀의 이동 속도 (숫자가 작을수록 빠름, 단위 ms)
  BOOST_SPEED: 80,        // 치트키: 부스터 속도
  SCORE_PER_APPLE: 100,   // 사과 1개당 점수 (아이들 시연 시 10000 등으로 수정하여 호응 유도)
};

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function SnakeStudio() {
  // 1. 코딩 교육의 핵심: 뱀의 몸통을 담는 '배열(Array)' 상태
  const [snake, setSnake] = useState<Point[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Point>({ x: 10, y: 3 });
  const [direction, setDirection] = useState<Direction>('UP');
  
  // 2. 게임 메타 상태
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // 사과를 무작위 좌표에 생성하는 함수
  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
        y: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
      };
      // 뱀의 몸통과 겹치지 않는지 확인
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    setFood(newFood);
  }, []);

  // 게임 초기화
  const resetGame = () => {
    setSnake([{ x: 7, y: 7 }]);
    setDirection('UP');
    setScore(0);
    setIsGameOver(false);
    spawnFood([{ x: 7, y: 7 }]);
    setIsPlaying(true);
  };

  // 3. 메인 게임 루프 엔진 (좌표 계산 및 배열 Push/Pop)
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { ...head };

        // 방향에 따른 좌표 계산
        if (direction === 'UP') newHead.y -= 1;
        if (direction === 'DOWN') newHead.y += 1;
        if (direction === 'LEFT') newHead.x -= 1;
        if (direction === 'RIGHT') newHead.x += 1;

        // 예외 처리 1: 벽 충돌
        if (
          newHead.x < 0 || newHead.x >= GAME_CONFIG.GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GAME_CONFIG.GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        // 예외 처리 2: 자기 몸통 충돌
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake]; // 배열 맨 앞에 새 머리 삽입 (Unshift/Push 개념)

        // 사과 획득 여부 확인
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + GAME_CONFIG.SCORE_PER_APPLE);
          spawnFood(newSnake);
          // 꼬리를 자르지 않으므로 배열의 길이가 늘어남 (뱀의 성장)
        } else {
          newSnake.pop(); // 사과를 먹지 않았으면 배열 맨 끝 요소 제거 (이동 연출)
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_CONFIG.INITIAL_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, isGameOver, isPlaying, spawnFood]);

  // 키보드 조작 (테블릿이 아닌 환경을 위한 예비 장치)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // 터치 패드 컨트롤러 방어 로직 (역방향 이동 방지)
  const handleTouch = (newDir: Direction) => {
    if (!isPlaying) return;
    if (newDir === 'UP' && direction !== 'DOWN') setDirection('UP');
    if (newDir === 'DOWN' && direction !== 'UP') setDirection('DOWN');
    if (newDir === 'LEFT' && direction !== 'RIGHT') setDirection('LEFT');
    if (newDir === 'RIGHT' && direction !== 'LEFT') setDirection('RIGHT');
  };

  return (
    // h-screen 규격 및 터치 조작 최적화 (touch-none으로 스와이프/확대 원천 차단)
    <div className="h-full w-full flex flex-col items-center justify-between touch-none select-none bg-slate-50 overflow-hidden">
      
      {/* 상단: 점수판 및 타이틀 */}
      <div className="w-full flex justify-between items-center px-6 py-4 bg-white border-b border-slate-200 shadow-sm shrink-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-slate-800">모던 스네이크</h2>
          <span className="text-xs text-slate-400">데이터 배열로 움직이는 그리드 아케이드</span>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Score</div>
          <div className="text-2xl font-black text-primary font-mono leading-none">{score}</div>
        </div>
      </div>

      {/* 중앙: 2차원 게임 격자 렌더링 영역 */}
      <div className="flex-1 w-full flex items-center justify-center p-2 relative">
        <div 
          className="bg-slate-100 border-2 border-slate-300 rounded-lg shadow-inner relative overflow-hidden"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GAME_CONFIG.GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(100%, 400px)',
            aspectRatio: '1 / 1',
          }}
        >
          {Array.from({ length: GAME_CONFIG.GRID_SIZE * GAME_CONFIG.GRID_SIZE }).map((_, i) => {
            const x = i % GAME_CONFIG.GRID_SIZE;
            const y = Math.floor(i / GAME_CONFIG.GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full border-[0.5px] border-slate-200/50 ${
                  isHead ? 'bg-primary rounded-sm z-10' : 
                  isBody ? 'bg-primary/70 rounded-sm' : 
                  isFood ? 'bg-red-500 rounded-full scale-75 animate-pulse' : ''
                }`}
              />
            );
          })}

          {/* 게임 오버 / 시작 오버레이 */}
          {(!isPlaying || isGameOver) && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <h3 className="text-white text-2xl font-bold mb-2">{isGameOver ? 'GAME OVER' : 'READY?'}</h3>
              {isGameOver && <p className="text-slate-200 mb-4 font-mono">최종 점수: {score}</p>}
              <button 
                onClick={resetGame}
                className="btn btn-primary btn-wide font-bold shadow-lg"
              >
                {isGameOver ? '다시 시작하기' : '게임 시작'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 하단: 태블릿 최적화 대형 터치 D-Pad */}
      <div className="w-full max-w-sm px-6 pb-6 shrink-0">
        <div className="grid grid-cols-3 grid-rows-3 gap-2 h-40">
          <div className="col-start-2 row-start-1">
            <button 
              onPointerDown={() => handleTouch('UP')}
              className="w-full h-full bg-slate-200 active:bg-slate-300 rounded-xl shadow-sm flex items-center justify-center text-slate-600 text-2xl"
            >
              ▲
            </button>
          </div>
          <div className="col-start-1 row-start-2">
            <button 
              onPointerDown={() => handleTouch('LEFT')}
              className="w-full h-full bg-slate-200 active:bg-slate-300 rounded-xl shadow-sm flex items-center justify-center text-slate-600 text-2xl"
            >
              ◀
            </button>
          </div>
          <div className="col-start-3 row-start-2">
            <button 
              onPointerDown={() => handleTouch('RIGHT')}
              className="w-full h-full bg-slate-200 active:bg-slate-300 rounded-xl shadow-sm flex items-center justify-center text-slate-600 text-2xl"
            >
              ▶
            </button>
          </div>
          <div className="col-start-2 row-start-3">
            <button 
              onPointerDown={() => handleTouch('DOWN')}
              className="w-full h-full bg-slate-200 active:bg-slate-300 rounded-xl shadow-sm flex items-center justify-center text-slate-600 text-2xl"
            >
              ▼
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}