import React from 'react';
import type { ClickerShopItem } from '../../constants/ClickerConstants';

interface ShopPageProps {
  items: ClickerShopItem[];
  currentScore: number;
  onBuyItem: (id: string) => void;
  errorMessage: string | null;
}

export default function ShopPage({ items, currentScore, onBuyItem, errorMessage }: ShopPageProps) {
  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-700">업그레이드 상점</h3>
        <span className="text-xs text-slate-400">* 상점 구매 시 데이터 연산 바인딩이 즉시 처리됩니다.</span>
      </div>

      {/* 학생 조작 예외 상황 발생 시 노출되는 Toast 스타일 경고창 */}
      {errorMessage && (
        <div className="alert alert-error shadow-sm mb-4 py-2 text-sm text-white font-medium rounded-lg animate-shake">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 아이템 리스트 레이아웃 (DaisyUI Card 활용) */}
      <div className="space-y-3 overflow-y-auto max-h-60 pr-1">
        {items.map((item) => {
          const isAffordable = currentScore >= item.cost;
          
          return (
            <div 
              key={item.id} 
              className={`card card-side bg-slate-50 border p-4 flex items-center justify-between transition-all ${
                isAffordable ? 'border-slate-200' : 'border-slate-200 opacity-60'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                  <span className="badge badge-sm bg-slate-200 border-none text-slate-600 font-semibold">Lv.{item.level}</span>
                </div>
                <p className="text-xs text-slate-500 max-w-sm">{item.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">필요 비용</span>
                  <span className={`text-sm font-bold ${isAffordable ? 'text-primary' : 'text-slate-500'}`}>
                    {item.cost} pt
                  </span>
                </div>
                <button
                  onClick={() => onBuyItem(item.id)}
                  className={`btn btn-sm px-4 font-bold ${
                    isAffordable 
                      ? 'btn-primary text-white shadow-sm' 
                      : 'btn-ghost bg-slate-200 text-slate-400 border-none cursor-not-allowed'
                  }`}
                >
                  구매
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 2; }
      `}</style>
    </div>
  );
}