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
import { tutorialTracks } from "../features/block-studio/tutorial/data/tutorialTracks";
import { useTutorialMode } from "../features/block-studio/tutorial/hooks/useTutorialMode";
import type { LearningTemplate } from "../features/block-studio/templates/types/learningTemplate.types";

export default function BlockStudioPage() {
  const { blocks, setBlocks, appendLearningTemplate } = useBlockStudio();
  const tutorial = useTutorialMode({ blocks, tracks: tutorialTracks });
  const { activeDrag, handleDragStart, handleDragEnd } = useBlockDragAndDrop(setBlocks);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const addLearningTemplate = (template: LearningTemplate) => {
    if (tutorial.isTutorialMode) return;
    appendLearningTemplate(template);
    tutorial.progress.recordUiSignal("templateInserted");
  };

  const handlePreviewTabViewed = (tab: "preview" | "code") => {
    tutorial.progress.recordUiSignal(tab === "preview" ? "previewOpened" : "codeViewOpened");
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <BlockStudioLayout
        palette={
          <BlockPalette
            key={tutorial.isTutorialMode ? "tutorial-palette" : "standard-palette"}
            onAddTemplate={addLearningTemplate}
            templatesDisabled={tutorial.isTutorialMode}
          />
        }
        canvas={<BlockCanvas blocks={blocks} setBlocks={setBlocks} />}
        canvasOverlay={
          <TutorialOverlay
            mode={tutorial.mode}
            tracks={tutorial.tracks}
            activeTrack={tutorial.activeTrack}
            completedTrackIds={tutorial.completedTrackIds}
            mission={tutorial.progress.activeMission}
            successMission={tutorial.progress.successMission}
            successMissionNumber={tutorial.progress.successMissionNumber}
            processedCount={tutorial.progress.processedCount}
            totalCount={tutorial.progress.missions.length}
            isComplete={tutorial.progress.isComplete}
            isHidden={tutorial.progress.isHidden}
            incompleteMessage={tutorial.progress.incompleteMessage}
            onCompleteMission={tutorial.progress.completeActiveMissionManually}
            onSkip={tutorial.skipActiveMission}
            onNextMission={tutorial.continueAfterSuccess}
            onHide={tutorial.progress.hide}
            onShow={tutorial.progress.show}
            onStartTrack={tutorial.startTrack}
            onRestart={tutorial.restartTrack}
            onExit={tutorial.exitTutorial}
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
