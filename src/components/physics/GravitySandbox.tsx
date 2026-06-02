import React, { useEffect, useRef, useState } from 'react';
import { type Ball, PHYSICS_CONFIG, BALL_COLORS } from '../../constants/physicsConstants';

export default function GravitySandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  
  const [gravity, setGravity] = useState<number>(PHYSICS_CONFIG.INITIAL_GRAVITY);
  const [elasticity, setElasticity] = useState<number>(PHYSICS_CONFIG.INITIAL_ELASTICITY);

  const stateRef = useRef({ balls, gravity, elasticity });
  useEffect(() => {
    stateRef.current = { balls, gravity, elasticity };
  }, [balls, gravity, elasticity]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const radius = Math.random() * 12 + 10;
    const newBall: Ball = {
      id: Date.now() + Math.random(),
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      radius,
      color: BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)],
    };

    setBalls((prev) => [...prev, newBall]);
  };

  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      const current = stateRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = canvas.width;
      const height = canvas.height;

      let updatedBalls = current.balls.map((b) => ({ ...b }));

      // --- [Step A] 개별 공의 물리 운동 법칙 적용 ---
      updatedBalls = updatedBalls.map((ball) => {
        ball.vy += current.gravity;
        
        ball.vx *= PHYSICS_CONFIG.FRICTION;
        ball.vy *= PHYSICS_CONFIG.FRICTION;

        ball.x += ball.vx;
        ball.y += ball.vy;

        // 경계면 충돌 검사 및 위치 보정
        if (ball.y + ball.radius > height) {
          ball.y = height - ball.radius;
          ball.vy = -ball.vy * current.elasticity;
        }
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy = -ball.vy * current.elasticity;
        }
        if (ball.x + ball.radius > width) {
          ball.x = width - ball.radius;
          ball.vx = -ball.vx * current.elasticity;
        }
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx = -ball.vx * current.elasticity;
        }

        return ball;
      });

      // --- [Step B] 공 vs 공 간의 상호작용 및 예외 처리 ---
      for (let i = 0; i < updatedBalls.length; i++) {
        for (let j = i + 1; j < updatedBalls.length; j++) {
          const b1 = updatedBalls[i];
          const b2 = updatedBalls[j];

          // 1. 위치 벡터의 차이 및 거리 계산
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = b1.radius + b2.radius;

          if (distance < minDistance) {
            // 위치 보정 (끼임 현상 강제 분리)
            const overlap = minDistance - distance;
            const nx = dx / distance;
            const ny = dy / distance;

            b1.x -= nx * (overlap / 2);
            b1.y -= ny * (overlap / 2);
            b2.x += nx * (overlap / 2);
            b2.y += ny * (overlap / 2);

            // 상대 속도 벡터 계산
            const dvx = b2.vx - b1.vx;
            const dvy = b2.vy - b1.vy;

            // [해결 1] 내적(Dot Product)을 활용한 유착 방지
            // 내적이 0보다 작을 때만(즉, 두 공이 서로를 향해 다가오고 있을 때만) 속도 교환 연산 수행
            const dotProduct = dvx * dx + dvy * dy;

            if (dotProduct < 0) {
              const effectiveBallElasticity = current.elasticity * PHYSICS_CONFIG.BALL_COLLISION_BOOST;

              const tempVx = b1.vx;
              const tempVy = b1.vy;

              b1.vx = b2.vx * effectiveBallElasticity;
              b1.vy = b2.vy * effectiveBallElasticity;
              b2.vx = tempVx * effectiveBallElasticity;
              b2.vy = tempVy * effectiveBallElasticity;

              // [해결 2] 속도 임계값(Threshold)을 활용한 무한 색상 변경 방지
              // 충돌 강도(상대 속도의 크기 제곱)가 특정 수치 이상일 때만 시각적 타격감 발생
              const impactSpeedSq = dvx * dvx + dvy * dvy;
              const COLOR_CHANGE_THRESHOLD = 2.0;

              if (impactSpeedSq > COLOR_CHANGE_THRESHOLD) {
                b1.color = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
                b2.color = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
              }
            }
          }
        }
      }

      // --- [Step C] Canvas 드로잉 ---
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);

        updatedBalls.forEach((ball) => {
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
          ctx.fillStyle = ball.color;
          ctx.fill();
          ctx.closePath();
        });
      }

      setBalls(updatedBalls);
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const clearSandbox = () => setBalls([]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-50 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center gap-6 select-none">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">미니 그래비티 샌드박스</h2>
        <p className="text-sm text-slate-500 mt-1">수학 공식과 물리 법칙을 코딩으로 설계하고 변조하는 2D 가상 실험실</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-stretch">
        {/* [왼쪽] 물리 시뮬레이션 스크린 (Canvas) */}
        <div className="flex flex-col gap-3 flex-1">
          <canvas
            ref={canvasRef}
            width={500}
            height={350}
            onClick={handleCanvasClick}
            className="w-full h-[350px] bg-white border-2 border-slate-300 rounded-lg shadow-inner cursor-pointer"
          />
          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-slate-400">* 화면을 클릭하면 그 자리에 새로운 물리 엔터티(공)가 창조됩니다.</span>
            <button onClick={clearSandbox} className="btn btn-xs bg-slate-200 text-slate-600 font-bold border-none hover:bg-slate-300">리셋</button>
          </div>
        </div>

        {/* [오른쪽] 실시간 법칙 제어 패널 */}
        <div className="w-full md:w-72 p-5 bg-white border border-slate-200 rounded-lg flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1">🌐 세상의 규칙 변조하기</h3>
            
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>중력 가속도 (Gravity)</span>
                <span className="font-mono text-primary">{gravity.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="-0.5" max="1.5" step="0.05" 
                value={gravity} onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="range range-xs range-primary" 
              />
              <span className="text-[10px] text-slate-400">* 음수로 내리면 무중력을 넘어 하늘로 둥둥 떠오릅니다.</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>기본 반발력 (Elasticity)</span>
                <span className="font-mono text-secondary">{elasticity.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0.0" max="1.0" step="0.05" 
                value={elasticity} onChange={(e) => setElasticity(parseFloat(e.target.value))}
                className="range range-xs range-secondary" 
              />
              <span className="text-[10px] text-slate-400">* 공 충돌 시에는 이 수치에 x{PHYSICS_CONFIG.BALL_COLLISION_BOOST} 가중치가 추가 적용됩니다.</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-100 text-xs text-slate-500 leading-relaxed">
            <strong>💡 교육 시연 팁:</strong><br/>
            공을 10개쯤 만든 뒤, 반발력을 <span className="font-bold text-secondary">1.00</span>으로 올리면 공들이 속도를 잃지 않고 통통 튕기는 '영구 기관 소동'을 시각적으로 보여주며 학생들의 엄청난 흥미를 이끌어낼 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}