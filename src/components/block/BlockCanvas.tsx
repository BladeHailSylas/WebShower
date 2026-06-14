import { useState, useRef, type MouseEvent } from 'react';
import type { HtmlBlock } from '../../types/types';
import { useDroppable } from '@dnd-kit/core'; // [추가]
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import textLimiter from '../../utils/textLimiter';

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
    id: `pw-locked-${block.id}`,
  });
  const { setNodeRef: setUnlockedRef, isOver: isUnlockedOver } = useDroppable({
    id: `pw-unlocked-${block.id}`,
  });

  // 🎯 [인접 블록 애니메이션 버그 패치] 
  // dnd-kit이 연산하는 레이아웃 타이밍 꼬임 현상을 방지하기 위해, 드래그 중이 아닐 때는 브라우저에게 하드코딩된 변환 애니메이션을 강제합니다.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'transform 220ms cubic-bezier(0.2, 0, 0, 1), opacity 220ms ease',
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  // 🌟 [PASSWORD_ZONE] 매크로 블록 전용 2중 슬롯 렌더링 명세 구현
  if (block.type === 'PASSWORD_ZONE') {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 relative flex items-stretch w-max">
        <div className="flex flex-col border-2 border-amber-600 bg-slate-800 rounded-l-xl p-4 min-w-85 gap-3">
          <div className="text-xs font-black text-amber-400 flex items-center gap-1.5">
            <span>🔒</span> 비밀번호 매크로 구역
          </div>

          {/* [잠겼을 때] 격리 공간 */}
          <div ref={setLockedRef} className={`p-3 rounded-xl border-2 border-dashed border-red-500/30 bg-red-950/20 flex flex-col gap-1 transition-colors ${isLockedOver ? 'bg-red-900/30 border-red-400' : ''}`}>
            <div className="text-[10px] text-red-400 font-bold tracking-tight mb-1">🔴 잠겼을 때 화면에 노출될 요소</div>
            <SortableContext items={(block.defaultChildren || []).map(c => c.id)} strategy={verticalListSortingStrategy}>
              {block.defaultChildren?.map(child => <SortableBlockItem key={child.id} block={child} activeStyleId={activeStyleId} onStyleClick={onStyleClick} />)}
            </SortableContext>
            {(!block.defaultChildren || block.defaultChildren.length === 0) && (
              <span className="text-[10px] text-slate-500 font-medium py-2 text-center pointer-events-none">블록을 놓으세요</span>
            )}
          </div>

          {/* [풀렸을 때] 격리 공간 */}
          <div ref={setUnlockedRef} className={`p-3 rounded-xl border-2 border-dashed border-emerald-500/30 bg-emerald-950/20 flex flex-col gap-1 transition-colors ${isUnlockedOver ? 'bg-emerald-900/30 border-emerald-400' : ''}`}>
            <div className="text-[10px] text-emerald-400 font-bold tracking-tight mb-1">🟢 비밀번호 일치 시 나타날 보상 요소</div>
            <SortableContext items={(block.conditionalChildren || []).map(c => c.id)} strategy={verticalListSortingStrategy}>
              {block.conditionalChildren?.map(child => <SortableBlockItem key={child.id} block={child} activeStyleId={activeStyleId} onStyleClick={onStyleClick} />)}
            </SortableContext>
            {(!block.conditionalChildren || block.conditionalChildren.length === 0) && (
              <span className="text-[10px] text-slate-500 font-medium py-2 text-center pointer-events-none">블록을 놓으세요</span>
            )}
          </div>
        </div>

        <div onClick={(e) => onStyleClick(e, block.id)} onPointerDown={(e) => e.stopPropagation()} className={`w-8 bg-amber-500 rounded-r-xl border-y-2 border-r-2 border-amber-600 cursor-pointer hover:bg-amber-400 flex items-center justify-center shrink-0 ${activeStyleId === block.id ? 'ring-2 ring-amber-300 z-10' : ''}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
        </div>
      </div>
    );
  }

  // 2. [신규] 컨테이너 내부 공간의 드롭(Drop) 센서 분리 탑재
  const { setNodeRef: setContainerDropRef, isOver: isContainerOver } = useDroppable({
    id: `droppable-container-${block.id}`,
    data: { type: 'CONTAINER_DROP_ZONE', blockId: block.id }
  });

  const isContainer = block.type === 'CONTAINER';

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
              ? '일반 구역 만들기 (Box)' 
              : block.type === 'H1' 
                ? `제목: ${block.content || '(내용 없음)'}` 
                : block.type === 'IMAGE' 
                  ? '이미지 넣기 (Image)' 
                  : `문단: ${textLimiter(block.content, 10) || '(내용 없음)'}`}
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
    if (!activeStyleId) return;

    const deleteRecursive = (nodes: HtmlBlock[]): HtmlBlock[] => {
      return nodes
        .filter(node => node.id !== activeStyleId)
        .map(node => ({
          ...node,
          children: node.children ? deleteRecursive(node.children) : node.children,
          lockedChildren: node.defaultChildren ? deleteRecursive(node.defaultChildren) : node.defaultChildren,
          unlockedChildren: node.conditionalChildren ? deleteRecursive(node.conditionalChildren) : node.conditionalChildren,
        }));
    };

    setBlocks((prev) => deleteRecursive(prev as HtmlBlock[]));
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

        {/* 🎨 확장된 포스트잇 스타일 및 내용 편집 패널 */}
        {activeStyleId && targetBlock && (
          <div 
            className="absolute z-30 w-80 bg-amber-50/95 backdrop-blur-sm shadow-2xl border border-amber-200 text-slate-800 p-5 rounded-br-3xl rounded-tr-xl rounded-l-xl"
            style={{ top: popupPos.y, left: popupPos.x }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b border-amber-200/60 pb-2">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span className="text-xl">⚙️</span> 블록 설정 창
              </h3>
              <div className="flex items-center gap-1.5">
                {/* 🗑️ 블록 삭제 버튼 */}
                <button 
                  onClick={deleteCurrentBlock} 
                  title="블록 삭제"
                  className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <button onClick={() => setActiveStyleId(null)} className="text-amber-500 hover:text-slate-700 font-bold px-2 py-1 bg-amber-100/50 rounded text-xs">✕</button>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 text-sm font-medium">
              {/* 📝 일반 텍스트 수정 영역 (H1, P 노드 대상) */}
              {targetBlock.type !== 'CONTAINER' && targetBlock.type !== 'IMAGE' && (
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-amber-800/70 font-bold uppercase">글 내용 수정</span>
                  <input 
                    type="text" 
                    value={targetBlock.content || ''} 
                    onChange={(e) => updateCurrentBlock({ content: e.target.value })}
                    className="bg-white border border-amber-200 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-sky-300 text-xs text-slate-800 shadow-inner" 
                  />
                </label>
              )}

              {/* 🖼️ 이미지 주소 수정 영역 (IMAGE 노드 대상) */}
              {targetBlock.type === 'IMAGE' && (
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-amber-800/70 font-bold uppercase">이미지 주소(URL)</span>
                  <input 
                    type="text" 
                    value={targetBlock.src || ''} 
                    onChange={(e) => updateCurrentBlock({ src: e.target.value })}
                    className="bg-white border border-amber-200 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-sky-300 text-xs font-mono text-slate-700 shadow-inner" 
                  />
                </label>
              )}

              {targetBlock.type === 'PASSWORD_ZONE' && (
                <label className="flex flex-col gap-1.5 bg-amber-100 p-2.5 rounded-lg border border-amber-200">
                  <span className="text-xs font-bold text-amber-900">🔑 정답 암호문 설정</span>
                  <input type="text" value={targetBlock.correctAnswer || ''} onChange={(e) => updateCurrentBlock({ correctAnswer: e.target.value })} className="bg-white border border-amber-300 rounded px-2 py-1 text-xs font-mono" />
                </label>
              )}

              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-amber-800/70 font-bold uppercase">Tailwind CSS 클래스</span>
                <input 
                  type="text" 
                  value={targetBlock.styles?.className || ''} 
                  onChange={(e) => updateCurrentBlock({ styles: { ...targetBlock.styles, className: e.target.value } })}
                  placeholder="예: text-center bg-blue-500" 
                  className="bg-white border border-amber-200 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-sky-300 font-mono text-xs text-slate-600 shadow-inner" 
                />
              </label>

              <label className="mt-1 flex items-start gap-3 bg-amber-100/30 p-3 rounded-lg border border-amber-200 cursor-pointer">
                <input type="checkbox" className="mt-0.5 w-4 h-4 accent-sky-500 rounded" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700 leading-tight">하위 블록에 공통으로 적용</span>
                  <span className="text-[10px] text-amber-700/60 mt-1 leading-tight">CSS 상속 기능을 활성화합니다.</span>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes dash { to { stroke-dashoffset: -20; } }`}</style>
    </div>
  );
}