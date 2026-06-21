import type { TutorialMission } from "../types/tutorial.types";
import TutorialMissionBar from "./TutorialMissionBar";

interface TutorialOverlayProps {
  mission?: TutorialMission;
  successMission?: TutorialMission;
  successMissionNumber?: number;
  processedCount: number;
  totalCount: number;
  isComplete: boolean;
  isHidden: boolean;
  onSkip: () => void;
  onNextMission: () => void;
  onHide: () => void;
  onShow: () => void;
}

export default function TutorialOverlay({
  mission,
  successMission,
  successMissionNumber,
  processedCount,
  totalCount,
  isComplete,
  isHidden,
  onSkip,
  onNextMission,
  onHide,
  onShow,
}: TutorialOverlayProps) {
  const currentMissionNumber =
    successMissionNumber ?? (isComplete ? totalCount : Math.min(processedCount + 1, totalCount));

  return (
    <div className="pointer-events-none flex w-full justify-center px-2">
      {isHidden ? (
        <button
          type="button"
          className="pointer-events-auto rounded-full border border-emerald-400/30 bg-slate-950/95 px-3 py-2 text-xs font-black text-emerald-300 shadow-xl backdrop-blur-sm transition-colors hover:bg-slate-800 hover:text-emerald-200"
          onClick={onShow}
          aria-label="튜토리얼 다시 열기"
        >
          미션 {currentMissionNumber}/{totalCount}
        </button>
      ) : (
        <TutorialMissionBar
          mission={mission}
          successMission={successMission}
          processedCount={processedCount}
          totalCount={totalCount}
          isComplete={isComplete}
          onSkip={onSkip}
          onNextMission={onNextMission}
          onHide={onHide}
        />
      )}
    </div>
  );
}
