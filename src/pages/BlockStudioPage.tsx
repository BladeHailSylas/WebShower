import { useState } from "react";
import { 
  DndContext, 
  DragOverlay, 
  useSensor, 
  useSensors, 
  PointerSensor, 
  pointerWithin,
  type DragStartEvent, 
  type DragEndEvent 
} from '@dnd-kit/core';
import BlockCanvas from "../components/block/BlockCanvas";
import BlockPalette from "../components/block/BlockPalette";
import BlockRenderer from "../components/block/BlockRenderer";
import type { BlockType, HtmlBlock } from "../types/types";
import { useMobileDownload } from "../utils/useMobileDownload";
import textLimiter from "../utils/textLimiter";

// [수정] 통합 테스트용 레벨 1 모범 페이지: 학원 로비 안내판
const LEVEL_1_TEMPLATE: HtmlBlock[] = [
  {
    id: 'b-wrapper',
    type: 'CONTAINER',
    // 모바일/PC 모두 완벽하게 중앙 정렬되는 반응형 카드 디자인 클래스
    styles: { className: 'max-w-sm mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center text-center' },
    children: [
      {
        id: 'b-title',
        type: 'H1',
        content: '코딩 크리에이티브 스튜디오',
        styles: { className: 'text-2xl font-black text-slate-800 tracking-tight mb-4' }
      },
      {
        id: 'b-image',
        type: 'IMAGE',
        src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop', // 임시 코딩 이미지
        styles: { className: 'w-full h-48 object-cover rounded-xl shadow-inner mb-5' }
      },
      {
        id: 'b-desc',
        type: 'P',
        content: '블록을 조립하여 상상하는 모든 것을 웹사이트로 만들어보세요. 오늘 만든 작품을 스마트폰에 저장해서 부모님께 자랑해볼까요?',
        styles: { className: 'text-sm text-slate-500 leading-relaxed font-medium' }
      }
    ]
  }
];

export default function BlockStudioPage() {
  const [blocks, setBlocks] = useState<HtmlBlock[]>(LEVEL_1_TEMPLATE);
  const code = useMobileDownload();
  // [신규] 현재 드래그 중인 아이템의 상태 관리
  const [activeDragType, setActiveDragType] = useState<BlockType | null>(null);
  const [activeDragLabel, setActiveDragLabel] = useState<string | null>(null);
  // 현재 드래그 중인 원본 블록 데이터 추출
  // (dnd-kit의 active.data.current.block에 담아둔 데이터를 활용)
  const [activeDragBlock, setActiveDragBlock] = useState<HtmlBlock | null>(null);

  // [신규] 단순 클릭과 드래그를 구분하기 위한 센서 (5px 이상 이동 시 드래그로 판정)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'CANVAS_ITEM') {
      setActiveDragBlock(active.data.current.block);
      setActiveDragType(active.data.current.block.type);
      setActiveDragLabel(active.data.current.label);
    }
    if (active.data.current?.type === 'PALETTE_ITEM') {
      setActiveDragType(active.data.current.blockType);
      setActiveDragLabel(active.data.current.label);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragType(null);
    setActiveDragLabel(null);
    setActiveDragBlock(null);
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const isPaletteItem = active.data.current?.type === 'PALETTE_ITEM';
    console.log(overId);
    setBlocks((prev) => {
      let nextBlocks = [...prev];
      let movingBlock: HtmlBlock;

      // 1. 블록 인스턴스 확보 및 기존 위치에서 안전 적출 (2중 슬롯 지원)
      if (isPaletteItem) {
        const newType = active.data.current?.blockType as BlockType;
        movingBlock = {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: newType,
          correctAnswer: newType === 'PASSWORD_ZONE' ? '12345' : undefined, // 명세서 기본값 실시간 인젝션
          styles: { className: newType === 'PASSWORD_ZONE' ? 'p-6 bg-white rounded-2xl shadow-md border' : 'mb-2 text-slate-800' },
          defaultChildren: newType === 'PASSWORD_ZONE' ? [] : undefined,
          conditionalChildren: newType === 'PASSWORD_ZONE' ? [] : undefined,
          children: newType === 'CONTAINER' ? [] : undefined,
        };
      } else {
        const findNode = (nodes: HtmlBlock[], id: string): HtmlBlock | null => {
          for (const n of nodes) {
            if (n.id === id) return n;
            if (n.children) { const f = findNode(n.children, id); if (f) return f; }
            if (n.defaultChildren) { const f = findNode(n.defaultChildren, id); if (f) return f; }
            if (n.conditionalChildren) { const f = findNode(n.conditionalChildren, id); if (f) return f; }
          }
          return null;
        };
        const foundBlock = findNode(nextBlocks, activeId);
        if (!foundBlock) return prev;
        movingBlock = foundBlock;

        const removeNode = (nodes: HtmlBlock[], id: string): HtmlBlock[] => {
          return nodes.filter(n => n.id !== id).map(n => ({
            ...n,
            children: n.children ? removeNode(n.children, id) : n.children,
            lockedChildren: n.defaultChildren ? removeNode(n.defaultChildren, id) : n.defaultChildren,
            unlockedChildren: n.conditionalChildren ? removeNode(n.conditionalChildren, id) : n.conditionalChildren,
          }));
        };
        nextBlocks = removeNode(nextBlocks, activeId);
      }

      // 2. 새로운 2중 슬롯 타일 목적지 해석 및 강제 주입
      if (overId === 'canvas-droppable') {
        nextBlocks.push(movingBlock);
      } else if (overId.startsWith('droppable-container-')) {
        const targetContainerId = overId.replace('droppable-container-', '');
        const insertIntoContainer = (nodes: HtmlBlock[]): HtmlBlock[] => {
          return nodes.map(n => {
            if (n.id === targetContainerId) return { ...n, children: [...(n.children || []), movingBlock] };
            return {
              ...n,
              children: n.children ? insertIntoContainer(n.children) : n.children,
              defaultChildren: n.defaultChildren ? insertIntoContainer(n.defaultChildren) : n.defaultChildren,
              conditionalChildren: n.conditionalChildren ? insertIntoContainer(n.conditionalChildren) : n.conditionalChildren,
            };
          });
        };
        nextBlocks = insertIntoContainer(nextBlocks);
      } else if (overId.startsWith('droppable-default-') || overId.startsWith('droppable-conditional-')) {
        // 🌟 [명세서 분기] 독립된 2중 자식 슬롯 내부로 정밀 조립
        const isLockedSlot = overId.startsWith('droppable-default-');
        const targetBlockId = overId.replace(isLockedSlot ? 'droppable-default-' : 'droppable-conditional-', '');

        const insertIntoPasswordSlot = (nodes: HtmlBlock[]): HtmlBlock[] => {
          return nodes.map(n => {
            if (n.id === targetBlockId) {
              if (isLockedSlot) return { ...n, defaultChildren: [...(n.defaultChildren || []), movingBlock] };
              return { ...n, conditionalChildren: [...(n.conditionalChildren || []), movingBlock] };
            }
            return {
              ...n,
              children: n.children ? insertIntoPasswordSlot(n.children) : n.children,
              defaultChildren: n.defaultChildren ? insertIntoPasswordSlot(n.defaultChildren) : n.defaultChildren,
              conditionalChildren: n.conditionalChildren ? insertIntoPasswordSlot(n.conditionalChildren) : n.conditionalChildren,
            };
          });
        };
        nextBlocks = insertIntoPasswordSlot(nextBlocks);
      } else {
        const insertSibling = (nodes: HtmlBlock[]): HtmlBlock[] => {
          const targetIndex = nodes.findIndex(n => n.id === overId);
          if (targetIndex > -1) {
            const copy = [...nodes];
            copy.splice(targetIndex, 0, movingBlock);
            return copy;
          }
          return nodes.map(n => ({
            ...n,
            children: n.children ? insertSibling(n.children) : n.children,
            lockedChildren: n.defaultChildren ? insertSibling(n.defaultChildren) : n.defaultChildren,
            unlockedChildren: n.conditionalChildren ? insertSibling(n.conditionalChildren) : n.conditionalChildren,
          }));
        };
        nextBlocks = insertSibling(nextBlocks);
      }

      return nextBlocks;
    });
  };

  const renderOverlayBlock = (block: HtmlBlock) => {
    const isContainer = block.type === 'CONTAINER';
    const isZone = block.type === 'PASSWORD_ZONE';
    return (
      <div className={`flex flex-col border-2 border-emerald-400 bg-slate-800 rounded-xl shadow-2xl opacity-95 scale-105 ${isContainer ? 'min-w-70' : 'min-w-50'}`}>
        <div className="p-3 font-bold text-slate-200 text-sm flex justify-between items-center">
          <span>{
          isContainer ? '일반 구역 만들기 (Box)' : 
          block.type === 'H1' ? `제목: ${block.content || ''}` : 
          block.type === 'IMAGE' ? '이미지 (Image)' : 
          block.type === 'PASSWORD_ZONE' ? '비밀번호 매크로 구역' :
          `문단: ${textLimiter(block.content, 10) || ''}`}</span>
        </div>
        {/* 컨테이너일 경우 내부의 자식들까지 똑같이 축소해서 렌더링 */}
        {isContainer && block.children && (
          <div className="ml-6 mr-2 mb-2 p-3 bg-slate-900/80 border-l-2 border-emerald-500 border-dashed min-h-15 flex flex-col gap-1 pointer-events-none">
            {block.children.map(renderOverlayBlock)}
          </div>
        )}
        {isZone && (block.defaultChildren || block.conditionalChildren) && (
          <div className="ml-6 mr-2 mb-2 p-3 bg-slate-900/80 border-l-2 border-emerald-500 border-dashed min-h-15 flex flex-col gap-1 pointer-events-none">
            {block.defaultChildren?.map(renderOverlayBlock)}
            {block.conditionalChildren?.map(renderOverlayBlock)}
          </div>
        )}
      </div>
    );
  };
  // 다운로드를 위해 들어온 경우
  if(code) {
    return(
    <div className="h-full flex flex-col justify-center items-center">
        <div className="text-7xl font-bold">
            다운로드 중입니다...
        </div>
        <p className="mt-2">
          다운로드한 페이지를 보려면 휴대폰의 내 파일 앱으로 들어가세요.
        </p>
    </div>
    );
  }
  else {
    return (
    // [수정] 전체 레이아웃을 DndContext로 래핑
      <DndContext 
      sensors={sensors} 
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}>
        <div className="flex h-screen w-full bg-slate-900 overflow-hidden text-slate-100 font-sans select-none">
          <div className="w-80 border-r border-slate-700 bg-slate-800 flex flex-col shrink-0"><BlockPalette /></div>
          <div className="flex-1 bg-slate-900 relative flex flex-col overflow-hidden"><BlockCanvas blocks={blocks} setBlocks={setBlocks} /></div>
          <div className="w-md border-l border-slate-700 bg-white flex flex-col text-slate-900 shrink-0 shadow-2xl z-20"><BlockRenderer blocks={blocks} /></div>
        </div>

        {/* [신규] 드래그 중일 때 마우스 커서를 따라다니는 시각적 UI */}
        <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeDragType ? (
            activeDragBlock ? (
              // 캔버스 내부에 있던 완성된 블록(트리)을 집어 들었을 때
              renderOverlayBlock(activeDragBlock)
            ) : (
              // 팔레트에서 새 블록을 집어 들었을 때 (단순 라벨 표시)
              <div className="bg-slate-700 p-3 rounded-lg border-2 border-emerald-400 shadow-xl opacity-90 cursor-grabbing scale-105 flex items-center gap-2">
                <span className="text-sm font-medium text-white">{activeDragLabel}</span>
              </div>
            )
          ) : <div className="bg-slate-700 p-3 rounded-lg border-2 border-emerald-400 shadow-xl opacity-90 cursor-grabbing scale-105 flex items-center gap-2">
                <span className="text-sm font-medium text-white">NO</span>
              </div>}
        </DragOverlay>
      </DndContext>
    );
  }
}