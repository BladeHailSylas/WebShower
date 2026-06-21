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
import TutorialOverlay from "../features/block-studio/tutorial/components/TutorialOverlay";
import { useTutorialProgress } from "../features/block-studio/tutorial/hooks/useTutorialProgress";
import type { LearningTemplate } from "../features/block-studio/templates/types/learningTemplate.types";

export default function BlockStudioPage() {
  const { blocks, setBlocks, appendLearningTemplate } = useBlockStudio();
  const tutorial = useTutorialProgress({ blocks });
  const { activeDrag, handleDragStart, handleDragEnd } = useBlockDragAndDrop(setBlocks);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const addLearningTemplate = (template: LearningTemplate) => {
    appendLearningTemplate(template);
    tutorial.recordUiSignal("templateInserted");
  };

  const handlePreviewTabViewed = (tab: "preview" | "code") => {
    tutorial.recordUiSignal(tab === "preview" ? "previewOpened" : "codeViewOpened");
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <BlockStudioLayout
        palette={<BlockPalette onAddTemplate={addLearningTemplate} />}
        canvas={<BlockCanvas blocks={blocks} setBlocks={setBlocks} />}
        canvasOverlay={
          <TutorialOverlay
            mission={tutorial.activeMission}
            successMission={tutorial.successMission}
            successMissionNumber={tutorial.successMissionNumber}
            processedCount={tutorial.processedCount}
            totalCount={tutorial.missions.length}
            isComplete={tutorial.isComplete}
            isHidden={tutorial.isHidden}
            onSkip={tutorial.skipActiveMission}
            onNextMission={tutorial.continueAfterSuccess}
            onHide={tutorial.hide}
            onShow={tutorial.show}
          />
        }
        preview={<BlockRenderer blocks={blocks} onTabViewed={handlePreviewTabViewed} />}
      />

      <DragOverlay dropAnimation={{ duration: 150, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
        <DragPreviewOverlay block={activeDrag.block} label={activeDrag.label} />
      </DragOverlay>
    </DndContext>
  );
}
