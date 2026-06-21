import { useState } from "react";
import type { HtmlBlock } from "../../../../types/types";
import type {
  TutorialModeState,
  TutorialTrack,
} from "../types/tutorial.types";
import { useTutorialProgress } from "./useTutorialProgress";

const noMissions: TutorialTrack["missions"] = [];

interface UseTutorialModeOptions {
  blocks: readonly HtmlBlock[];
  tracks: readonly TutorialTrack[];
}

export function useTutorialMode({ blocks, tracks }: UseTutorialModeOptions) {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [runRevision, setRunRevision] = useState(0);
  const [completedTrackIds, setCompletedTrackIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const activeTrack = tracks.find((track) => track.id === selectedTrackId);
  const isTutorialMode = activeTrack !== undefined;
  const sessionKey = activeTrack ? `${activeTrack.id}:${runRevision}` : null;
  const progress = useTutorialProgress({
    blocks,
    missions: activeTrack?.missions ?? noMissions,
    sessionKey,
    enabled: isTutorialMode,
  });

  const isCompleted = isTutorialMode && progress.isComplete && !progress.successMission;
  const mode: TutorialModeState = activeTrack
    ? isCompleted
      ? { status: "completed", trackId: activeTrack.id }
      : { status: "active", trackId: activeTrack.id }
    : { status: "selecting" };

  const rememberCompletedTrack = () => {
    if (!activeTrack) return;
    setCompletedTrackIds((current) => new Set(current).add(activeTrack.id));
  };

  const startTrack = (trackId: string) => {
    if (!tracks.some((track) => track.id === trackId)) return;
    setSelectedTrackId(trackId);
    setRunRevision((current) => current + 1);
  };

  const exitTutorial = () => setSelectedTrackId(null);

  const restartTrack = () => {
    if (!activeTrack) return;
    setRunRevision((current) => current + 1);
  };

  const continueAfterSuccess = () => {
    if (progress.isComplete) rememberCompletedTrack();
    progress.continueAfterSuccess();
  };

  const skipActiveMission = () => {
    const finishesTrack =
      activeTrack !== undefined &&
      progress.processedCount + 1 >= activeTrack.missions.length;
    progress.skipActiveMission();
    if (finishesTrack) rememberCompletedTrack();
  };

  return {
    mode,
    tracks,
    activeTrack,
    completedTrackIds,
    isTutorialMode,
    progress,
    startTrack,
    exitTutorial,
    restartTrack,
    continueAfterSuccess,
    skipActiveMission,
  };
}

