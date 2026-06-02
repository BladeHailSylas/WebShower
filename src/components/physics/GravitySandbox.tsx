import React, { useEffect, useRef, useState } from 'react';
import { type Ball, PHYSICS_CONFIG, BALL_COLORS } from '../../constants/physicsConstants';

export default function GravitySandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  
  const [gravity, setGravity] = useState<number>(PHYSICS_CONFIG.INITIAL_GRAVITY);
  const [elasticity, setElasticity] = useState<number>(PHYSICS_CONFIG.INITIAL_ELASTICITY);
  const [enableColorJuice, setEnableColorJuice] = useState<boolean>(PHYSICS_CONFIG.ENABLE_COLOR_JUICE);

  const stateRef = useRef({ balls, gravity, elasticity, enableColorJuice });
  useEffect(() => {
    stateRef.current = { balls, gravity, elasticity, enableColorJuice };
  }, [balls, gravity, elasticity, enableColorJuice]);

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
      mass: radius * radius, // 면적 기반 질량
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

      // --- [Step A] 개별 공 물리 운동 ---
      updatedBalls = updatedBalls.map((ball) => {
        ball.vy += current.gravity;
        ball.vx *= PHYSICS_CONFIG.FRICTION;
        ball.vy *= PHYSICS_CONFIG.FRICTION;
        ball.x += ball.vx;
        ball.y += ball.vy;

        // 벽 충돌 처리
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

      // --- [Step B] 공 vs 공 충돌 처리 (2차원 벡터 분해 방식) ---
      for (let i = 0; i < updatedBalls.length; i++) {
        for (let j = i + 1; j < updatedBalls.length; j++) {
          const b1 = updatedBalls[i];
          const b2 = updatedBalls[j];

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = b1.radius + b2.radius;

          if (distance < minDistance) {
            // 위치 보정 (끼임 방지)
            const overlap = minDistance - distance;
            const nx = dx / distance; // 법선 벡터 단위 (Normal X)
            const ny = dy / distance; // 법선 벡터 단위 (Normal Y)
            
            b1.x -= nx * (overlap / 2);
            b1.y -= ny * (overlap / 2);
            b2.x += nx * (overlap / 2);
            b2.y += ny * (overlap / 2);

            const dvx = b2.vx - b1.vx;
            const dvy = b2.vy - b1.vy;
            const dotProduct = dvx * nx + dvy * ny;

            // 서로 다가오는 중일 때만 연산 수행
            if (dotProduct < 0) {
              // 1. 접선 벡터 단위 (Tangent)
              const tx = -ny;
              const ty = nx;

              // 2. 기존 속도를 법선(n)과 접선(t) 스칼라 값으로 분해
              const v1n = b1.vx * nx + b1.vy * ny;
              const v1t = b1.vx * tx + b1.vy * ty;
              const v2n = b2.vx * nx + b2.vy * ny;
              const v2t = b2.vx * tx + b2.vy * ty;

              // 3. 법선 방향에 대해서만 1차원 질량 기반 완전 탄성 충돌 연산
              const mSum = b1.mass + b2.mass;
              let v1nAfter = ((b1.mass - b2.mass) * v1n + 2 * b2.mass * v2n) / mSum;
              let v2nAfter = ((b2.mass - b1.mass) * v2n + 2 * b1.mass * v1n) / mSum;

              // 반발력 및 가중치 적용 (법선 방향 속도에만 적용하여 에너지 손실 조절)
              const effectiveElasticity = current.elasticity * PHYSICS_CONFIG.BALL_COLLISION_BOOST;
              v1nAfter *= effectiveElasticity;
              v2nAfter *= effectiveElasticity;

              // 4. 새로운 법선 속도와 보존된 접선 속도(v1t, v2t)를 다시 X, Y 벡터로 합성
              b1.vx = v1nAfter * nx + v1t * tx;
              b1.vy = v1nAfter * ny + v1t * ty;
              b2.vx = v2nAfter * nx + v2t * tx;
              b2.vy = v2nAfter * ny + v2t * ty;

              // 5. 색상 변경 효과 (토글 및 속도 임계값 적용)
              if (current.enableColorJuice) {
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

        <div className="w-full md:w-72 p-5 bg-white border border-slate-200 rounded-lg flex flex-col gap-4">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1">🌐 규칙 조정해보기</h3>
            
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
            </div>

            {/* 시각적 효과 제어 토글 추가 */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
              <span className="text-xs font-semibold text-slate-600">충돌 시 색상 변화 이펙트</span>
              <input 
                type="checkbox" 
                className="toggle toggle-sm toggle-primary" 
                checked={enableColorJuice} 
                onChange={(e) => setEnableColorJuice(e.target.checked)} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}