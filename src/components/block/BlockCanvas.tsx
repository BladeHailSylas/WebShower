import { useState, useRef, type MouseEvent } from 'react';
import type { HtmlBlock } from '../../types/types';
import { useDroppable } from '@dnd-kit/core'; // [추가]
import { CSS } from '@dnd-kit/utilities';
import { rectSortingStrategy, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import textLimiter from '../../utils/textLimiter';
import BlockStylePanel from './BlockStylePanel';

interface BlockCanvasProps {
  blocks: HtmlBlock[];
  setBlocks: (blocks: HtmlBlock[] | ((prev: HtmlBlock[]) => HtmlBlock[])) => void;
}

function SortableBlockItem({ block, activeStyleId, onStyleClick }: { block: HtmlBlock; activeStyleId: string | null; onStyleClick: (e: MouseEvent, id: string) => void; }) {
  const { attributes, listeners, setNodeRef, transform, transition: _/*dndTransition*/, isDragging } = useSortable({
    id: block.id,
    data: { type: 'CANVAS_ITEM', block },
  });

  // 🌟 명세서 사양: 2중 격리 공간 개별 센서 주입
  const { setNodeRef: setLockedRef, isOver: isLockedOver } = useDroppable({
    id: `droppable-default-${block.id}`,
  });
  const { setNodeRef: setUnlockedRef, isOver: isUnlockedOver } = useDroppable({
    id: `droppable-conditional-${block.id}`,
  });
  const { setNodeRef: setGridRef, isOver: isGridOver } = useDroppable({
    id: `droppable-container-${block.id}`
  });

  const stopProp = (e: React.PointerEvent | React.MouseEvent) => e.stopPropagation();
  const DragHandle = () => (
    <div {...attributes} {...listeners} onPointerDown={stopProp} className="w-6 bg-slate-700 hover:bg-slate-600 rounded-l-xl border-y-2 border-slate-700 flex items-center justify-center cursor-grab text-slate-400 text-xs select-none">⠿</div>
  );
  // 🎯 [인접 블록 애니메이션 버그 패치] 
  // dnd-kit이 연산하는 레이아웃 타이밍 꼬임 현상을 방지하기 위해, 드래그 중이 아닐 때는 브라우저에게 하드코딩된 변환 애니메이션을 강제합니다.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 220ms cubic-bezier(0.2, 0, 0, 1), opacity 220ms ease',
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };
  // 2. [신규] 컨테이너 내부 공간의 드롭(Drop) 센서 분리 탑재
  const { setNodeRef: setContainerDropRef, isOver: isContainerOver } = useDroppable({
    id: `droppable-container-${block.id}`,
    data: { type: 'CONTAINER_DROP_ZONE', blockId: block.id }
  });

  const isContainer = block.type === 'CONTAINER';
  const isZone = block.type.toString().split("_")[1] === 'ZONE';
  {
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className="mb-2 relative flex items-stretch w-max cursor-grab active:cursor-grabbing group"
    >
      <div className={`flex flex-col border-2 border-slate-700 bg-slate-800 rounded-l-xl shadow-sm ${isContainer ? 'min-w-70' : 'min-w-50'}`}>
        <div className="p-3 font-bold text-slate-200 text-sm flex justify-between items-center">
          <span>
            {isContainer 
              ? '일반 구역' 
              : block.type === 'H1' 
                ? `제목: ${block.content || '(내용 없음)'}` 
                : block.type === 'IMAGE' 
                  ? '이미지' :
                  block.type === 'PASSWORD_ZONE' ? 
                  '비밀번호 매크로 구역'
                  :
                  block.type === 'TOGGLE_ZONE' ? 
                  '여닫는 구역'
                  :
                  block.type === 'GRID_ZONE' ? 
                  `${block.styles?.gridCols}줄 바둑판 구역` :
                  block.type === 'SPACER' ? 
                  null :
                  block.type === 'A' ? 
                  `링크: ${block.content || '(글 없음)'} (${block.link || '링크 없음'})` :
                  `문단: ${textLimiter(block.content, 10) || '(내용 없음)'}`}
          </span>
        </div>
        
        {/* 🌟 [수정] 자식 블록 재귀 렌더링 및 내부 드롭 센서 반응 */}
        {isContainer && (
          <div 
            ref={setContainerDropRef}
            className={`ml-6 mr-2 mb-2 p-3 bg-slate-900/80 border-l-2 border-slate-700 border-dashed min-h-15 flex flex-col gap-1 transition-colors ${
              isContainerOver ? 'bg-slate-800 ring-2 ring-emerald-500/50' : ''
            }`}
          >
            <SortableContext items={(block.children || []).map(c => c.id)} strategy={verticalListSortingStrategy}>
              {block.children?.map((child) => (
                 // 재귀(Recursive) 호출: 자식 블록도 동일한 SortableItem으로 렌더링
                  <SortableBlockItem key={child.id} block={child} activeStyleId={activeStyleId} onStyleClick={onStyleClick} />
              ))}
            </SortableContext>
            
            {/* 자식이 비어있을 때 직관적인 안내 가이드 제공 */}
            {(!block.children || block.children.length === 0) && (
                <span className="text-xs text-slate-500 font-medium my-2 text-center pointer-events-none">요소를 드롭하여 중첩하세요</span>
            )}
          </div>
        )}
        {isZone && (
          block.type === "PASSWORD_ZONE" ? 
          (
          <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 relative flex items-stretch w-max">
            <div className="flex flex-col rounded-l-xl p-4 min-w-85 gap-3">

              <div ref={setLockedRef} className={`p-3 border-l-2 border-dashed border-red-500/30 bg-red-950/20 flex flex-col gap-1 transition-colors ${isLockedOver ? 'bg-red-900/30 ring-2 ring-red-500/50' : ''}`}>
                <div className="text-[10px] text-red-400 font-bold tracking-tight mb-1">잠겼을 때 화면에 노출될 요소</div>
                <SortableContext items={(block.defaultChildren || []).map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {block.defaultChildren?.map(child => <SortableBlockItem key={child.id} block={child} activeStyleId={activeStyleId} onStyleClick={onStyleClick} />)}
                </SortableContext>
                {(!block.defaultChildren || block.defaultChildren.length === 0) && (
                  <span className="text-[10px] text-slate-500 font-medium py-2 text-center pointer-events-none">블록을 놓으세요</span>
                )}
              </div>
              
              <div ref={setUnlockedRef} className={`p-3 border-l-2 border-dashed border-emerald-500/30 bg-emerald-950/20 flex flex-col gap-1 transition-colors ${isUnlockedOver ? 'bg-emerald-900/30 ring-2 ring-emerald-500/50' : ''}`}>
                <div className="text-[10px] text-emerald-400 font-bold tracking-tight mb-1">비밀번호 일치 시 나타날 보상 요소</div>
                <SortableContext items={(block.conditionalChildren || []).map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {block.conditionalChildren?.map(child => <SortableBlockItem key={child.id} block={child} activeStyleId={activeStyleId} onStyleClick={onStyleClick} />)}
                </SortableContext>
                {(!block.conditionalChildren || block.conditionalChildren.length === 0) && (
                  <span className="text-[10px] text-slate-500 font-medium py-2 text-center pointer-events-none">블록을 놓으세요</span>
                )}
              </div>
            </div>
          </div>
          ) :
          block.type === "TOGGLE_ZONE" ? (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 relative flex items-stretch w-max">
            <div className="flex flex-col rounded-l-xl p-4 min-w-85 gap-3">

              <div ref={setLockedRef} className={`p-3 border-l-2 border-dashed border-emerald-500/30 bg-emerald-950/20 flex flex-col gap-1 transition-colors ${isLockedOver ? 'bg-emerald-900/30 ring-2 ring-emerald-500/50' : ''}`}>
                <div className="text-[10px] text-emerald-400 font-bold tracking-tight mb-1">항상 보이는 요소</div>
                <SortableContext items={(block.defaultChildren || []).map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {block.defaultChildren?.map(child => <SortableBlockItem key={child.id} block={child} activeStyleId={activeStyleId} onStyleClick={onStyleClick} />)}
                </SortableContext>
                {(!block.defaultChildren || block.defaultChildren.length === 0) && (
                  <span className="text-[10px] text-slate-500 font-medium py-2 text-center pointer-events-none">블록을 놓으세요</span>
                )}
              </div>
              
              <div ref={setUnlockedRef} className={`p-3 border-l-2 border-dashed border-blue-500/30 bg-blue-950/20 flex flex-col gap-1 transition-colors ${isUnlockedOver ? 'bg-blue-900/30 ring-2 ring-blue-500/50' : ''}`}>
                <div className="text-[10px] text-blue-400 font-bold tracking-tight mb-1">열렸을 때 보이는 요소</div>
                <SortableContext items={(block.conditionalChildren || []).map(c => c.id)} strategy={verticalListSortingStrategy}>
                  {block.conditionalChildren?.map(child => <SortableBlockItem key={child.id} block={child} activeStyleId={activeStyleId} onStyleClick={onStyleClick} />)}
                </SortableContext>
                {(!block.conditionalChildren || block.conditionalChildren.length === 0) && (
                  <span className="text-[10px] text-slate-500 font-medium py-2 text-center pointer-events-none">블록을 놓으세요</span>
                )}
              </div>
            </div>
          </div>
          ) : 
          block.type === "GRID_ZONE" ? (
            <div ref={setNodeRef} style={style} className="mb-3 relative flex items-stretch w-full max-w-xl" onPointerDown={stopProp}>
              <div className="flex flex-col border-2 border-l-0 border-indigo-500 bg-slate-800 p-4 flex-1 rounded-r-none gap-2">
                <div className="text-xs font-black text-indigo-300 flex items-center justify-between">
                  <span>🏁 바둑판 구역 만들기</span>
                  <span className="text-[10px] bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/40 text-indigo-400">한 줄에 {block.styles?.gridCols}칸</span>
                </div>

                {/* 순차 배치 단일 드롭 바구니 */}
                <div ref={setGridRef} style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${(block.styles?.gridCols)}, minmax(0, 1fr))`,
                  gap: '12px'
                }} className={`p-3 rounded-xl bg-slate-900/50 min-h-20 border-2 border-dashed transition-colors ${isGridOver ? 'border-indigo-400 bg-slate-900/90' : 'border-slate-700'}`}>
                  <SortableContext items={(block.children || []).map(c => c.id)} strategy={rectSortingStrategy}>
                    {block.children?.map(child => <SortableBlockItem key={child.id} block={child} activeStyleId={activeStyleId} onStyleClick={onStyleClick} />)}
                  </SortableContext>
                </div>
              </div>
              <div onClick={(e) => onStyleClick(e, block.id)} className="w-8 bg-indigo-500 rounded-r-xl border-y-2 border-r-2 border-indigo-500 cursor-pointer hover:bg-indigo-400 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              </div>
            </div>
          ) :
          null)}
      </div>

      <div 
        onClick={(e) => onStyleClick(e, block.id)}
        onPointerDown={(e) => e.stopPropagation()} 
        className={`w-8 bg-emerald-500 rounded-r-xl border-y-2 border-r-2 border-slate-700 cursor-pointer hover:bg-emerald-400 flex items-center justify-center shrink-0 ${activeStyleId === block.id ? 'ring-2 ring-emerald-300 z-10' : ''}`}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
      </div>
    </div>
  );
}
}

export default function BlockCanvas({ blocks, setBlocks }: BlockCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeStyleId, setActiveStyleId] = useState<string | null>(null);
  const [lineStart, setLineStart] = useState({ x: 0, y: 0 });

  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-droppable' });

  const findBlockRecursive = (nodes: HtmlBlock[], targetId: string): HtmlBlock | undefined => {
    for (const node of nodes) {
      if (node.id === targetId) return node;
      if (node.children) { const f = findBlockRecursive(node.children, targetId); if (f) return f; }
      if (node.defaultChildren) { const f = findBlockRecursive(node.defaultChildren, targetId); if (f) return f; }
      if (node.conditionalChildren) { const f = findBlockRecursive(node.conditionalChildren, targetId); if (f) return f; }
    }
    return undefined;
  };

  // ⚙️ [Phase 4 패치] 중첩 구조를 지원하는 내용/디자인 수정 엔진
  const updateCurrentBlock = (fields: Partial<HtmlBlock>) => {
    if (!activeStyleId) return;
    const updateRecursive = (nodes: HtmlBlock[]): HtmlBlock[] => {
      return nodes.map(node => {
        if (node.id === activeStyleId) return { ...node, ...fields };
        return {
          ...node,
          children: node.children ? updateRecursive(node.children) : node.children,
          defaultChildren: node.defaultChildren ? updateRecursive(node.defaultChildren) : node.defaultChildren,
          conditionalChildren: node.conditionalChildren ? updateRecursive(node.conditionalChildren) : node.conditionalChildren,
        };
      });
    };
    // (이전 단계의 setBlocks 타입 호환성을 위해 타입 단언 사용)
    setBlocks((prev) => updateRecursive(prev as HtmlBlock[]));
  };

  // ⚙️ [Phase 4 패치] 중첩 구조를 지원하는 안전한 블록 적출(삭제) 엔진
  const deleteCurrentBlock = () => {
    console.log("현재 타겟 ID (activeStyleId):", activeStyleId);
    if (!activeStyleId) {
      console.log("❌ 타겟 ID가 없어서 삭제가 취소되었습니다.");
      return;
    }

    const deleteRecursive = (nodes: HtmlBlock[]): HtmlBlock[] => {
      return nodes
        .filter(node => node.id !== activeStyleId)
        .map(node => ({
          ...node,
          children: node.children ? deleteRecursive(node.children) : node.children,
          defaultChildren: node.defaultChildren ? deleteRecursive(node.defaultChildren) : node.defaultChildren,
          conditionalChildren: node.conditionalChildren ? deleteRecursive(node.conditionalChildren) : node.conditionalChildren,
        }));
    };

  setBlocks((prev) => {
    const res = deleteRecursive(prev);
    console.log("삭제 연산 후 전역 트리 상태:", res);
    return res;
  });
    setActiveStyleId(null);
  };

    // 현재 수정 중인 활성화된 블록 객체 찾기
  // 현재 팝업이 열려있는 대상을 재귀적으로 탐색하여 바인딩
  const targetBlock = activeStyleId ? findBlockRecursive(blocks, activeStyleId) : undefined;
  const popupPos = { x: lineStart.x + 180, y: Math.max(20, lineStart.y - 60) };

  const handleStyleClick = (e: MouseEvent, blockId: string) => {
    e.stopPropagation();
    if (activeStyleId === blockId) {
      setActiveStyleId(null);
      return;
    }
    if (canvasRef.current) {
      const btnRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      setLineStart({
        x: btnRect.right - canvasRect.left,
        y: btnRect.top + btnRect.height / 2 - canvasRect.top,
      });
    }
    setActiveStyleId(blockId);
  };

  return (
    <div ref={canvasRef} className="flex flex-col h-full w-full relative overflow-hidden bg-slate-900">
      <div className="absolute top-0 left-0 w-full p-6 z-10 pointer-events-none">
        <h2 className="text-2xl font-black text-slate-700/50">조립 캔버스</h2>
      </div>

      <div 
        ref={setNodeRef}
        className={`flex-1 w-full h-full relative overflow-auto p-12 pt-20 transition-colors duration-200 ${isOver ? 'bg-slate-800/80 ring-4 ring-inset ring-emerald-500/30' : ''}`}
        style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        onClick={() => setActiveStyleId(null)}
      >
        <div className="relative z-10 flex flex-col items-start gap-2">
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map(block => (
              <SortableBlockItem key={block.id} block={block} activeStyleId={activeStyleId} onStyleClick={handleStyleClick} />
            ))}
          </SortableContext>
        </div>

        {activeStyleId && (
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
            <path d={`M ${lineStart.x} ${lineStart.y} C ${lineStart.x + 80} ${lineStart.y}, ${popupPos.x - 80} ${popupPos.y + 30}, ${popupPos.x} ${popupPos.y + 30}`} fill="none" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 4" className="animate-[dash_1s_linear_infinite]" />
          </svg>
        )}

        {/* 🎨 전역 포스트잇 에디터 패널 내부 마크업 구역 */}
{activeStyleId && targetBlock && (
  <div 
    className="absolute z-30 w-80 bg-amber-50/95 backdrop-blur-sm shadow-2xl border border-amber-200 text-slate-800 p-5 rounded-br-3xl rounded-tr-xl rounded-l-xl"
    style={{ top: popupPos.y, left: popupPos.x }}
    onClick={e => e.stopPropagation()}
  >
    {/* 상단 타이틀 및 삭제 액션 바 생략 */}
    
    <div className="flex flex-col gap-4 text-sm font-medium">
      {/* (도메인별 글 내용 인풋창 위치) */}
      
      {/* 🌟 [의존성 주입 실행] 복잡한 GUI 연산을 컴포넌트 위임 후, 코어 핸들러(updateCurrentBlock)를 수혈함 */}
      <BlockStylePanel 
        targetBlock={targetBlock} 
        onUpdate={updateCurrentBlock} 
        onDelete={deleteCurrentBlock}
      />
    </div>
  </div>
)}
      </div>

      <style>{`@keyframes dash { to { stroke-dashoffset: -20; } }`}</style>
    </div>
  );
}