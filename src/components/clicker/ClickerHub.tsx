import { useState, useEffect } from 'react';
import { CHEAT_CONFIG, CLICKER_SAFETY_LIMITS, type ClickerShopItem } from '../../constants/clickerConstants';
import ClickPage from './ClickPage';
import ShopPage from './ShopPage';

export default function ClickerHub() {
  const [activeTab, setActiveTab] = useState<'click' | 'shop'>('click');
  const [score, setScore] = useState<number>(CHEAT_CONFIG.CLICKER_INITIAL_SCORE);
  const [pointsPerClick, setPointsPerClick] = useState<number>(1);
  const [autoClicksPerSecond, setAutoClicksPerSecond] = useState<number>(0);
  const [autoClickTick, setAutoClickTick] = useState<number>(0);
  
  // 시스템 경고 및 예외 상태 관리
  const [systemWarning, setSystemWarning] = useState<string | null>(null);
  const [shopError, setShopError] = useState<string | null>(null);
  const [highScore, setHighScore] = useState<number>(() => {
    const savedScore = localStorage.getItem("HighScore");
    return savedScore ? Number(savedScore) : 0;
  });

  // 상점 아이템 라인업
  const [items, setItems] = useState<ClickerShopItem[]>([
    { id: 'item_1', name: '고성능 마우스 패드', description: '클릭당 점수가 +1 증가합니다.', cost: 10, costMultiplier: 1.5, level: 0, effect: 1, type: 'click' },
    { id: 'item_2', name: '자동 클릭 매크로', description: '초당 1번 자동으로 클릭합니다.', cost: 50, costMultiplier: 1.8, level: 0, effect: 1, type: 'auto' },
  ]);

  // 1. 강사 코드 수정에 대한 시스템 예외 검증 (유지보수 및 안정성 확보)
  useEffect(() => {
    if (CHEAT_CONFIG.AUTO_CLICK_INTERVAL_MS < CLICKER_SAFETY_LIMITS.MIN_INTERVAL_MS) {
      setSystemWarning(`[시스템 경고] 강사 설정 오류: 자동 클릭 주기(${CHEAT_CONFIG.AUTO_CLICK_INTERVAL_MS}ms)가 너무 짧아 브라우저 보호를 위해 ${CLICKER_SAFETY_LIMITS.MIN_INTERVAL_MS}ms로 강제 제한됩니다.`);
    } else {
      setSystemWarning(null);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("HighScore", highScore.toString());
  }, [highScore, setHighScore]);
  useEffect(() => {
    if(score > highScore) {
      setHighScore(score);
    }
  }, [score, setScore]);
  // 2. 자동 클릭(Auto-Click) 타이머 루프 구현
  useEffect(() => {
    if (autoClicksPerSecond <= 0) return;

    // 예외 상황을 고려한 안전한 인터벌 주기 계산
    const validatedInterval = Math.max(CHEAT_CONFIG.AUTO_CLICK_INTERVAL_MS, CLICKER_SAFETY_LIMITS.MIN_INTERVAL_MS);

    const intervalId = setInterval(() => {
    const pointsPerInterval = autoClicksPerSecond * (validatedInterval / 1000);
    setScore((prev) => prev + pointsPerInterval);
      
    // 자동 클릭이 발생했음을 알리는 트리거 업데이트
    setAutoClickTick((prev) => prev + 1); 
  }, validatedInterval);

    return () => clearInterval(intervalId);
  }, [autoClicksPerSecond]);

  // 3. 메인 클릭 핸들러
  const handleMainClick = () => {
    const gainedPoints = pointsPerClick * CHEAT_CONFIG.CLICKER_CLICK_MULTIPLIER;
    const totalPoints = score + gainedPoints;
    setScore(totalPoints);
  };

  // 4. 상점 구매 핸들러
  const handleBuyItem = (itemId: string) => {
    const targetItem = items.find((item) => item.id === itemId);
    if (!targetItem) return;

    // 학생 조작 예외 처리: 잔액 부족 시 경고 알림 후 리턴
    if (score < targetItem.cost) {
      setShopError(`점수가 부족합니다! 부족한 점수: ${Math.ceil(targetItem.cost - score)}점`);
      setTimeout(() => setShopError(null), 3000); // 3초 후 경고 자동 제거
      return;
    }

    // 차감 및 상태 업데이트
    setScore((prev) => prev - targetItem.cost);
    if (targetItem.type === 'click') {
      setPointsPerClick((prev) => prev + targetItem.effect);
    } else if (targetItem.type === 'auto') {
      setAutoClicksPerSecond((prev) => prev + targetItem.effect);
    }

    // 아이템 레벨 및 가격 상승 반영
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, level: item.level + 1, cost: Math.floor(item.cost * item.costMultiplier) }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen w-full bg-base-200 text-slate-800 p-6 flex flex-col items-center">
      {/* 시스템 예외 상황 경고 알림 (강사용) */}
      {systemWarning && (
        <div className="alert alert-warning shadow-lg max-w-2xl mb-4 text-sm animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>{systemWarning}</span>
        </div>
      )}

      {/* 모던 대시보드 구조 (점수 현황판) */}
      <div className="stats shadow bg-white border border-slate-200 w-full max-w-2xl mb-6">
        <div className="stat">
          <div className="stat-title text-slate-500 font-medium">현재 누적 점수</div>
          <div className="stat-value text-primary text-4xl">{Math.floor(score).toLocaleString()}</div>
          <div className="stat-desc text-slate-400">클릭 배율: x{CHEAT_CONFIG.CLICKER_CLICK_MULTIPLIER}</div>
        </div>
        <div className="stat">
          <div className="stat-title text-slate-500 font-medium">클릭 파워</div>
          <div className="stat-value text-secondary text-3xl">+{pointsPerClick * CHEAT_CONFIG.CLICKER_CLICK_MULTIPLIER}</div>
          <div className="stat-desc text-slate-400">기본 {pointsPerClick}pt</div>
        </div>
        <div className="stat">
          <div className="stat-title text-slate-500 font-medium">자동 생산량 (CPS)</div>
          <div className="stat-value text-accent text-3xl">{autoClicksPerSecond}/s</div>
          <div className="stat-desc text-slate-400">{CHEAT_CONFIG.AUTO_CLICK_INTERVAL_MS}ms 주기 동작</div>
        </div>
      </div>

      {/* DaisyUI 탭 메뉴를 활용한 화면 전환 */}
      <div className="tabs tabs-boxed bg-white border border-slate-200 p-1 mb-6 w-full max-w-2xl flex">
        <button 
          className={`tab flex-1 font-bold transition-all ${activeTab === 'click' ? 'tab-active btn-primary text-blue-600 rounded-lg' : 'text-slate-500 hover:scale-105'}`}
          onClick={() => setActiveTab('click')}
        >
          메인 창 (Click)
        </button>
        <button 
          className={`tab flex-1 font-bold transition-all ${activeTab === 'shop' ? 'tab-active btn-primary text-blue-600 rounded-lg' : 'text-slate-500 hover:scale-105'}`}
          onClick={() => setActiveTab('shop')}
        >
          상점 창 (Shop)
        </button>
      </div>

      {/* 내부 페이지 컴포넌트 렌더링 영역 */}
      <div className="w-full max-w-2xl card bg-white border border-slate-200 shadow-sm p-6 min-h-88 flex flex-col justify-center items-center relative overflow-hidden">
        <div className="flex mb-12 text-slate-500 font-bold">
          최고 득점: {highScore}
        </div>
        {activeTab === 'click' ? (
          <ClickPage 
            onMainClick={handleMainClick} 
            pointsPerClick={pointsPerClick * CHEAT_CONFIG.CLICKER_CLICK_MULTIPLIER}
            autoClickTick={autoClickTick} 
            autoPoints={autoClicksPerSecond * (Math.max(CHEAT_CONFIG.AUTO_CLICK_INTERVAL_MS, CLICKER_SAFETY_LIMITS.MIN_INTERVAL_MS) / 1000)}
          />
        ) : (
          <ShopPage 
            items={items} 
            currentScore={score} 
            onBuyItem={handleBuyItem} 
            errorMessage={shopError} 
          />
        )}
      </div>
    </div>
  );
}