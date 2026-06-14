import { useDraggable } from '@dnd-kit/core';
import type { BlockType } from '../../types/types';

// [신규] 재사용 가능한 팔레트 드래그 아이템 컴포넌트
function PaletteItem({ type, label, icon }: { type: BlockType; label: string; icon?: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`, // 고유 ID
    data: {
      type: 'PALETTE_ITEM',
      blockType: type,
      label,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-slate-700 p-3 rounded-lg border border-slate-600 cursor-grab hover:bg-slate-600 transition-colors shadow-sm flex items-center gap-2 ${
        isDragging ? 'opacity-50 border-dashed' : ''
      }`}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span className="text-sm font-medium text-slate-200">{label}</span>
    </div>
  );
}

export default function BlockPalette() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-5 border-b border-slate-700 bg-slate-800/50">
        <h2 className="text-xl font-bold text-white tracking-tight">블록 팔레트</h2>
        <p className="text-xs text-slate-400 mt-1">원하는 요소를 캔버스로 끌어오세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">구조 요소</h3>
          <PaletteItem type="CONTAINER" label="일반 구역 만들기" icon="📦" />
          <PaletteItem type="TOGGLE_ZONE" label="여닫는 구역 만들기" icon="📂" />
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">일반 요소</h3>
          <PaletteItem type="H1" label="제목 쓰기 (H1)" icon="🔠" />
          <PaletteItem type="P" label="문단 쓰기 (P)" icon="📝" />
          <PaletteItem type="IMAGE" label="이미지 넣기 (Image)" icon="🖼️" />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">매크로 블록</h3>
          <PaletteItem type="PASSWORD_ZONE" label="비밀번호 구역 만들기" icon="🔒" />
        </div>
      </div>
    </div>
  );
}