import { useState } from "react";
import type {
  TutorialMission,
  TutorialModeState,
  TutorialTrack,
} from "../types/tutorial.types";
import TutorialCompletionBar from "./TutorialCompletionBar";
import TutorialMissionBar from "./TutorialMissionBar";
import TutorialTrackIntroModal, { type TutorialTrackIntroMode } from "./TutorialTrackIntroModal";
import TutorialTrackPicker from "./TutorialTrackPicker";

interface TutorialOverlayProps {
  mode: TutorialModeState;
  tracks: readonly TutorialTrack[];
  activeTrack?: TutorialTrack;
  completedTrackIds: ReadonlySet<string>;
  mission?: TutorialMission;
  successMission?: TutorialMission;
  successMissionNumber?: number;
  processedCount: number;
  totalCount: number;
  isComplete: boolean;
  isHidden: boolean;
  incompleteMessage?: string;
  onCompleteMission: () => void;
  onSkip: () => void;
  onNextMission: () => void;
  onHide: () => void;
  onShow: () => void;
  onStartTrack: (trackId: string) => void;
  onRestart: () => void;
  onExit: () => void;
}

type IntroRequest = {
  trackId: string;
  mode: TutorialTrackIntroMode;
};

export default function TutorialOverlay({
  mode,
  tracks,
  activeTrack,
  completedTrackIds,
  mission,
  successMission,
  successMissionNumber,
  processedCount,
  totalCount,
  isComplete,
  isHidden,
  incompleteMessage,
  onCompleteMission,
  onSkip,
  onNextMission,
  onHide,
  onShow,
  onStartTrack,
  onRestart,
  onExit,
}: TutorialOverlayProps) {
  const [isTrackPickerHidden, setIsTrackPickerHidden] = useState(false);
  const [introRequest, setIntroRequest] = useState<IntroRequest | null>(null);
  const currentMissionNumber =
    successMissionNumber ?? (isComplete ? totalCount : Math.min(processedCount + 1, totalCount));
  const introTrack = introRequest
    ? tracks.find((track) => track.id === introRequest.trackId)
    : undefined;

  const openTrackIntro = (trackId: string, mode: TutorialTrackIntroMode) => {
    setIntroRequest({ trackId, mode });
  };

  const closeTrackIntro = () => setIntroRequest(null);

  const confirmTrackIntro = () => {
    if (!introRequest) return;

    const { trackId, mode: introMode } = introRequest;
    setIntroRequest(null);

    if (introMode === "start") {
      onStartTrack(trackId);
      return;
    }

    if (introMode === "restart") {
      onRestart();
    }
  };

  return (
    <div className="pointer-events-none flex w-full justify-center px-2">
      {mode.status === "selecting" && isTrackPickerHidden ? (
        <button
          type="button"
          className="pointer-events-auto rounded-full border border-emerald-400/30 bg-slate-950/95 px-3 py-2 text-xs font-black text-emerald-300 shadow-xl backdrop-blur-sm transition-colors hover:bg-slate-800 hover:text-emerald-200"
          onClick={() => setIsTrackPickerHidden(false)}
          aria-label="튜토리얼 선택 열기"
        >
          튜토리얼 열기
        </button>
      ) : mode.status === "selecting" ? (
        <TutorialTrackPicker
          tracks={tracks}
          completedTrackIds={completedTrackIds}
          onStartTrack={(trackId) => openTrackIntro(trackId, "start")}
          onClose={() => setIsTrackPickerHidden(true)}
        />
      ) : mode.status === "completed" && activeTrack ? (
        <TutorialCompletionBar
          track={activeTrack}
          onRestart={() => openTrackIntro(activeTrack.id, "restart")}
          onExit={onExit}
        />
      ) : isHidden ? (
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
          trackTitle={activeTrack?.title ?? "튜토리얼"}
          mission={mission}
          successMission={successMission}
          processedCount={processedCount}
          totalCount={totalCount}
          isComplete={isComplete}
          incompleteMessage={incompleteMessage}
          onCompleteMission={onCompleteMission}
          onSkip={onSkip}
          onNextMission={onNextMission}
          onShowIntro={() => activeTrack && openTrackIntro(activeTrack.id, "review")}
          onHide={onHide}
          onExit={onExit}
        />
      )}
      {introTrack && introRequest && (
        <TutorialTrackIntroModal
          track={introTrack}
          mode={introRequest.mode}
          onPrimaryAction={introRequest.mode === "review" ? closeTrackIntro : confirmTrackIntro}
          onClose={closeTrackIntro}
        />
      )}
    </div>
  );
}
