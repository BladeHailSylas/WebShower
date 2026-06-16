import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import BlockCanvas from "../components/block/BlockCanvas";
import BlockPalette from "../components/block/BlockPalette";
import BlockRenderer from "../components/block/BlockRenderer";
import BlockStudioLayout from "../features/block-studio/components/BlockStudioLayout";
import DragPreviewOverlay from "../features/block-studio/components/DragPreviewOverlay";
import { useBlockDragAndDrop } from "../features/block-studio/hooks/useBlockDragAndDrop";
import { useBlockStudio } from "../features/block-studio/hooks/useBlockStudio";

export default function BlockStudioPage() {
  const { blocks, setBlocks } = useBlockStudio();
  const { activeDrag, handleDragStart, handleDragEnd } = useBlockDragAndDrop(setBlocks);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <BlockStudioLayout
        palette={<BlockPalette />}
        canvas={<BlockCanvas blocks={blocks} setBlocks={setBlocks} />}
        preview={<BlockRenderer blocks={blocks} />}
      />

      <DragOverlay dropAnimation={{ duration: 150, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
        <DragPreviewOverlay block={activeDrag.block} label={activeDrag.label} />
      </DragOverlay>
    </DndContext>
  );
}
