import React, { useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface ClickPageProps {
  onMainClick: () => void;
  pointsPerClick: number;
}

export default function ClickPage({ onMainClick, pointsPerClick }: ClickPageProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMainClick();

    // 클릭한 버튼 내부 좌표 기준 파티클 생성 위치 계산
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (Math.random() * 40 - 20); // 약간의 무작위성 부여
    const y = e.clientY - rect.top - 20;

    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x,
      y,
      text: `+${pointsPerClick}`,
    };

    setParticles((prev) => [...prev, newParticle]);

    // 0.8초 후 파티클 제거 (메모리 관리 및 예외 방지)
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 8000);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <p className="text-slate-400 text-sm mb-6 text-center">
        아래의 버튼을 클릭하여 포인트를 획득하세요.<br/>
      </p>

      {/* 인터랙티브 클릭 영역 */}
      <div className="relative">
        <button
          onClick={handleClick}
          className="w-48 h-48 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 shadow-xl border-4 border-white flex items-center justify-center text-white text-2xl font-bold uppercase tracking-wider select-none transform transition-all active:scale-90 hover:scale-105"
        >
          Click Here!
        </button>

        {/* 시각적 타격감 효과를 위한 떠오르는 텍스트 파티클 구조 */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute font-black text-xl text-indigo-600 pointer-events-none select-none animate-ping duration-1000"
            style={{
              left: p.x,
              top: p.y,
              transform: 'translate(-50%, -50%)',
              animation: 'floatUp 0.8s ease-out forwards',
            }}
          >
            {p.text}
          </span>
        ))}
      </div>

      {/* 파티클 애니메이션을 위한 컴포넌트 내 인라인 스타일 제공 */}
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -60px) scale(1.2); }
        }
      `}</style>
    </div>
  );
}