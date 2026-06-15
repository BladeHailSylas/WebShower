import type { HtmlBlock, StyleProps } from "../../types/types";

// 🌟 [DI 디자인] 부모의 전역 변이 상태 엔진에 안전하게 의존성을 주입받기 위한 명세
interface BlockStylePanelProps {
  targetBlock: HtmlBlock;
  onUpdate: (fields: Partial<HtmlBlock>) => void;
  onDelete: () => void;
}

export default function BlockStylePanel({ targetBlock, onUpdate, onDelete }: BlockStylePanelProps) {
  // 아이들의 마우스 클릭 조작에 대응하여 부모의 상태를 역류시키지 않고 DI 함수를 통해 캡슐화 전송
  const handleStyleChange = (key: keyof StyleProps, value: any) => {
    onUpdate({
      styles: {
        ...targetBlock.styles,
        [key]: value,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 text-sm font-medium border-t border-amber-200/60 pt-1 mt-1">
      <div className="flex justify-end">
        <button className="hover:cursor-pointer bg-red-300 rounded-lg p-2" onClick={onDelete}>
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20L18.4199 20.2209C18.3074 21.2337 17.4512 22 16.4321 22H7.56786C6.54876 22 5.69264 21.2337 5.5801 20.2209L4 6Z" stroke="#460809" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7.34491 3.14716C7.67506 2.44685 8.37973 2 9.15396 2H14.846C15.6203 2 16.3249 2.44685 16.6551 3.14716L18 6H6L7.34491 3.14716Z" stroke="#460809" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 6H22" stroke="#460809" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 11V16" stroke="#460809" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 11V16" stroke="#460809" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
      </div>
      <div className="text-xs font-black text-amber-900/70 uppercase tracking-wider flex items-center gap-1">
        🎨 블록 꾸미기 (스타일)
      </div>

      {/* 1. 정렬 드롭다운 */}
      <label className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-600 font-bold">글자 정렬</span>
        <select 
          value={targetBlock.styles?.textAlign || 'left'}
          onChange={(e) => handleStyleChange('textAlign', e.target.value)}
          className="bg-white border border-amber-300 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none focus:ring-2 ring-amber-400 cursor-pointer"
        >
          <option value="left">왼쪽 정렬</option>
          <option value="center">가운데 정렬</option>
          <option value="right">오른쪽 정렬</option>
        </select>
      </label>

      {/* 2. 글자 색상 드롭다운 */}
      <label className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-600 font-bold">글자 색상</span>
        <select 
          value={targetBlock.styles?.textColor || 'black'}
          onChange={(e) => handleStyleChange('textColor', e.target.value)}
          className="bg-white border border-amber-300 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none cursor-pointer"
        >
          <option value="black">⚫ 검정색</option>
          <option value="gray">⚪ 회색</option>
          <option value="red">🔴 빨간색</option>
          <option value="blue">🔵 파란색</option>
          <option value="green">🟢 초록색</option>
        </select>
      </label>

      {/* 3. 배경 색상 드롭다운 */}
      <label className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-600 font-bold">배경 색상</span>
        <select 
          value={targetBlock.styles?.bgColor || 'none'}
          onChange={(e) => handleStyleChange('bgColor', e.target.value)}
          className="bg-white border border-amber-300 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none cursor-pointer"
        >
          <option value="none">❌ 배경 없음</option>
          <option value="white">⬜ 하얀색</option>
          <option value="slate">🔘 연한 회색방</option>
          <option value="red">🍎 딸기맛(분홍)</option>
          <option value="blue">🐳 하늘맛(파랑)</option>
          <option value="green">🍏 메론맛(연두)</option>
          <option value="yellow">🧀 치즈맛(노랑)</option>
        </select>
      </label>

      {/* 4. 토글형 체크박스 2종 세트 */}
      <div className="grid grid-cols-2 gap-3 mt-1">
        <label className="flex items-center gap-2 bg-amber-100/60 p-2 rounded-xl border border-amber-200/50 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={!!targetBlock.styles?.isBold}
            onChange={(e) => handleStyleChange('isBold', e.target.checked)}
            className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
          />
          <span className="text-xs font-bold text-slate-700">글자 두껍게</span>
        </label>

        <label className="flex items-center gap-2 bg-amber-100/60 p-2 rounded-xl border border-amber-200/50 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={!!targetBlock.styles?.isRounded}
            onChange={(e) => handleStyleChange('isRounded', e.target.checked)}
            className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
          />
          <span className="text-xs font-bold text-slate-700">모서리 둥글게</span>
        </label>
      </div>
    </div>
  );
}